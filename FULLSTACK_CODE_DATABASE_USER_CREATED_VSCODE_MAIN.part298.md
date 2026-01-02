---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 298
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 298 of 552)

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

---[FILE: src/vs/platform/windows/test/electron-main/windowsStateHandler.test.ts]---
Location: vscode-main/src/vs/platform/windows/test/electron-main/windowsStateHandler.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { tmpdir } from 'os';
import { join } from '../../../../base/common/path.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IWindowState as IWindowUIState, WindowMode } from '../../../window/electron-main/window.js';
import { getWindowsStateStoreData, IWindowsState, IWindowState, restoreWindowsState } from '../../electron-main/windowsStateHandler.js';
import { IWorkspaceIdentifier } from '../../../workspace/common/workspace.js';

suite('Windows State Storing', () => {

	function getUIState(): IWindowUIState {
		return {
			x: 0,
			y: 10,
			width: 100,
			height: 200,
			mode: 0
		};
	}

	function toWorkspace(uri: URI): IWorkspaceIdentifier {
		return {
			id: '1234',
			configPath: uri
		};
	}
	function assertEqualURI(u1: URI | undefined, u2: URI | undefined, message?: string): void {
		assert.strictEqual(u1 && u1.toString(), u2 && u2.toString(), message);
	}

	function assertEqualWorkspace(w1: IWorkspaceIdentifier | undefined, w2: IWorkspaceIdentifier | undefined, message?: string): void {
		if (!w1 || !w2) {
			assert.strictEqual(w1, w2, message);
			return;
		}
		assert.strictEqual(w1.id, w2.id, message);
		assertEqualURI(w1.configPath, w2.configPath, message);
	}

	function assertEqualWindowState(expected: IWindowState | undefined, actual: IWindowState | undefined, message?: string) {
		if (!expected || !actual) {
			assert.deepStrictEqual(expected, actual, message);
			return;
		}
		assert.strictEqual(expected.backupPath, actual.backupPath, message);
		assertEqualURI(expected.folderUri, actual.folderUri, message);
		assert.strictEqual(expected.remoteAuthority, actual.remoteAuthority, message);
		assertEqualWorkspace(expected.workspace, actual.workspace, message);
		assert.deepStrictEqual(expected.uiState, actual.uiState, message);
	}

	function assertEqualWindowsState(expected: IWindowsState, actual: IWindowsState, message?: string) {
		assertEqualWindowState(expected.lastPluginDevelopmentHostWindow, actual.lastPluginDevelopmentHostWindow, message);
		assertEqualWindowState(expected.lastActiveWindow, actual.lastActiveWindow, message);
		assert.strictEqual(expected.openedWindows.length, actual.openedWindows.length, message);
		for (let i = 0; i < expected.openedWindows.length; i++) {
			assertEqualWindowState(expected.openedWindows[i], actual.openedWindows[i], message);
		}
	}

	function assertRestoring(state: IWindowsState, message?: string) {
		const stored = getWindowsStateStoreData(state);
		const restored = restoreWindowsState(stored);
		assertEqualWindowsState(state, restored, message);
	}

	const testBackupPath1 = join(tmpdir(), 'windowStateTest', 'backupFolder1');
	const testBackupPath2 = join(tmpdir(), 'windowStateTest', 'backupFolder2');

	const testWSPath = URI.file(join(tmpdir(), 'windowStateTest', 'test.code-workspace'));
	const testFolderURI = URI.file(join(tmpdir(), 'windowStateTest', 'testFolder'));

	const testRemoteFolderURI = URI.parse('foo://bar/c/d');

	test('storing and restoring', () => {
		let windowState: IWindowsState;
		windowState = {
			openedWindows: []
		};
		assertRestoring(windowState, 'no windows');
		windowState = {
			openedWindows: [{ backupPath: testBackupPath1, uiState: getUIState() }]
		};
		assertRestoring(windowState, 'empty workspace');

		windowState = {
			openedWindows: [{ backupPath: testBackupPath1, uiState: getUIState(), workspace: toWorkspace(testWSPath) }]
		};
		assertRestoring(windowState, 'workspace');

		windowState = {
			openedWindows: [{ backupPath: testBackupPath2, uiState: getUIState(), folderUri: testFolderURI }]
		};
		assertRestoring(windowState, 'folder');

		windowState = {
			openedWindows: [{ backupPath: testBackupPath1, uiState: getUIState(), folderUri: testFolderURI }, { backupPath: testBackupPath1, uiState: getUIState(), folderUri: testRemoteFolderURI, remoteAuthority: 'bar' }]
		};
		assertRestoring(windowState, 'multiple windows');

		windowState = {
			lastActiveWindow: { backupPath: testBackupPath2, uiState: getUIState(), folderUri: testFolderURI },
			openedWindows: []
		};
		assertRestoring(windowState, 'lastActiveWindow');

		windowState = {
			lastPluginDevelopmentHostWindow: { backupPath: testBackupPath2, uiState: getUIState(), folderUri: testFolderURI },
			openedWindows: []
		};
		assertRestoring(windowState, 'lastPluginDevelopmentHostWindow');
	});

	test('open 1_32', () => {
		const v1_32_workspace = `{
			"openedWindows": [],
			"lastActiveWindow": {
				"workspaceIdentifier": {
					"id": "53b714b46ef1a2d4346568b4f591028c",
					"configURIPath": "file:///home/user/workspaces/testing/custom.code-workspace"
				},
				"backupPath": "/home/user/.config/code-oss-dev/Backups/53b714b46ef1a2d4346568b4f591028c",
				"uiState": {
					"mode": 0,
					"x": 0,
					"y": 27,
					"width": 2560,
					"height": 1364
				}
			}
		}`;

		let windowsState = restoreWindowsState(JSON.parse(v1_32_workspace));
		let expected: IWindowsState = {
			openedWindows: [],
			lastActiveWindow: {
				backupPath: '/home/user/.config/code-oss-dev/Backups/53b714b46ef1a2d4346568b4f591028c',
				uiState: { mode: WindowMode.Maximized, x: 0, y: 27, width: 2560, height: 1364 },
				workspace: { id: '53b714b46ef1a2d4346568b4f591028c', configPath: URI.parse('file:///home/user/workspaces/testing/custom.code-workspace') }
			}
		};

		assertEqualWindowsState(expected, windowsState, 'v1_32_workspace');

		const v1_32_folder = `{
			"openedWindows": [],
			"lastActiveWindow": {
				"folder": "file:///home/user/workspaces/testing/folding",
				"backupPath": "/home/user/.config/code-oss-dev/Backups/1daac1621c6c06f9e916ac8062e5a1b5",
				"uiState": {
					"mode": 1,
					"x": 625,
					"y": 263,
					"width": 1718,
					"height": 953
				}
			}
		}`;

		windowsState = restoreWindowsState(JSON.parse(v1_32_folder));
		expected = {
			openedWindows: [],
			lastActiveWindow: {
				backupPath: '/home/user/.config/code-oss-dev/Backups/1daac1621c6c06f9e916ac8062e5a1b5',
				uiState: { mode: WindowMode.Normal, x: 625, y: 263, width: 1718, height: 953 },
				folderUri: URI.parse('file:///home/user/workspaces/testing/folding')
			}
		};
		assertEqualWindowsState(expected, windowsState, 'v1_32_folder');

		const v1_32_empty_window = ` {
			"openedWindows": [
			],
			"lastActiveWindow": {
				"backupPath": "/home/user/.config/code-oss-dev/Backups/1549539668998",
				"uiState": {
					"mode": 1,
					"x": 768,
					"y": 336,
					"width": 1200,
					"height": 800
				}
			}
		}`;

		windowsState = restoreWindowsState(JSON.parse(v1_32_empty_window));
		expected = {
			openedWindows: [],
			lastActiveWindow: {
				backupPath: '/home/user/.config/code-oss-dev/Backups/1549539668998',
				uiState: { mode: WindowMode.Normal, x: 768, y: 336, width: 1200, height: 800 }
			}
		};
		assertEqualWindowsState(expected, windowsState, 'v1_32_empty_window');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/workspace/common/canonicalUri.ts]---
Location: vscode-main/src/vs/platform/workspace/common/canonicalUri.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export interface ICanonicalUriProvider {
	readonly scheme: string;
	provideCanonicalUri(uri: UriComponents, targetScheme: string, token: CancellationToken): Promise<URI | undefined>;
}

export const ICanonicalUriService = createDecorator<ICanonicalUriService>('canonicalUriIdentityService');

export interface ICanonicalUriService {
	readonly _serviceBrand: undefined;
	registerCanonicalUriProvider(provider: ICanonicalUriProvider): IDisposable;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/workspace/common/editSessions.ts]---
Location: vscode-main/src/vs/platform/workspace/common/editSessions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IWorkspaceFolder } from './workspace.js';

export interface IEditSessionIdentityProvider {
	readonly scheme: string;
	getEditSessionIdentifier(workspaceFolder: IWorkspaceFolder, token: CancellationToken): Promise<string | undefined>;
	provideEditSessionIdentityMatch(workspaceFolder: IWorkspaceFolder, identity1: string, identity2: string, token: CancellationToken): Promise<EditSessionIdentityMatch | undefined>;
}

export const IEditSessionIdentityService = createDecorator<IEditSessionIdentityService>('editSessionIdentityService');

export interface IEditSessionIdentityService {
	readonly _serviceBrand: undefined;

	registerEditSessionIdentityProvider(provider: IEditSessionIdentityProvider): IDisposable;
	getEditSessionIdentifier(workspaceFolder: IWorkspaceFolder, cancellationToken: CancellationToken): Promise<string | undefined>;
	provideEditSessionIdentityMatch(workspaceFolder: IWorkspaceFolder, identity1: string, identity2: string, cancellationToken: CancellationToken): Promise<EditSessionIdentityMatch | undefined>;
	addEditSessionIdentityCreateParticipant(participants: IEditSessionIdentityCreateParticipant): IDisposable;
	onWillCreateEditSessionIdentity(workspaceFolder: IWorkspaceFolder, cancellationToken: CancellationToken): Promise<void>;
}

export interface IEditSessionIdentityCreateParticipant {
	participate(workspaceFolder: IWorkspaceFolder, cancellationToken: CancellationToken): Promise<void>;
}

export enum EditSessionIdentityMatch {
	Complete = 100,
	Partial = 50,
	None = 0,
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/workspace/common/virtualWorkspace.ts]---
Location: vscode-main/src/vs/platform/workspace/common/virtualWorkspace.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';
import { IWorkspace } from './workspace.js';

export function isVirtualResource(resource: URI) {
	return resource.scheme !== Schemas.file && resource.scheme !== Schemas.vscodeRemote;
}

export function getVirtualWorkspaceLocation(workspace: IWorkspace): { scheme: string; authority: string } | undefined {
	if (workspace.folders.length) {
		return workspace.folders.every(f => isVirtualResource(f.uri)) ? workspace.folders[0].uri : undefined;
	} else if (workspace.configuration && isVirtualResource(workspace.configuration)) {
		return workspace.configuration;
	}
	return undefined;
}

export function getVirtualWorkspaceScheme(workspace: IWorkspace): string | undefined {
	return getVirtualWorkspaceLocation(workspace)?.scheme;
}

export function getVirtualWorkspaceAuthority(workspace: IWorkspace): string | undefined {
	return getVirtualWorkspaceLocation(workspace)?.authority;
}

export function isVirtualWorkspace(workspace: IWorkspace): boolean {
	return getVirtualWorkspaceLocation(workspace) !== undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/workspace/common/workspace.ts]---
Location: vscode-main/src/vs/platform/workspace/common/workspace.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../nls.js';
import { Event } from '../../../base/common/event.js';
import { basename, extname } from '../../../base/common/path.js';
import { TernarySearchTree } from '../../../base/common/ternarySearchTree.js';
import { extname as resourceExtname, basenameOrAuthority, joinPath, extUriBiasedIgnorePathCase } from '../../../base/common/resources.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { Schemas } from '../../../base/common/network.js';

export const IWorkspaceContextService = createDecorator<IWorkspaceContextService>('contextService');

export interface IWorkspaceContextService {

	readonly _serviceBrand: undefined;

	/**
	 * An event which fires on workbench state changes.
	 */
	readonly onDidChangeWorkbenchState: Event<WorkbenchState>;

	/**
	 * An event which fires on workspace name changes.
	 */
	readonly onDidChangeWorkspaceName: Event<void>;

	/**
	 * An event which fires before workspace folders change.
	 */
	readonly onWillChangeWorkspaceFolders: Event<IWorkspaceFoldersWillChangeEvent>;

	/**
	 * An event which fires on workspace folders change.
	 */
	readonly onDidChangeWorkspaceFolders: Event<IWorkspaceFoldersChangeEvent>;

	/**
	 * Provides access to the complete workspace object.
	 */
	getCompleteWorkspace(): Promise<IWorkspace>;

	/**
	 * Provides access to the workspace object the window is running with.
	 * Use `getCompleteWorkspace` to get complete workspace object.
	 */
	getWorkspace(): IWorkspace;

	/**
	 * Return the state of the workbench.
	 *
	 * WorkbenchState.EMPTY - if the workbench was opened with empty window or file
	 * WorkbenchState.FOLDER - if the workbench was opened with a folder
	 * WorkbenchState.WORKSPACE - if the workbench was opened with a workspace
	 */
	getWorkbenchState(): WorkbenchState;

	/**
	 * Returns the folder for the given resource from the workspace.
	 * Can be null if there is no workspace or the resource is not inside the workspace.
	 */
	getWorkspaceFolder(resource: URI): IWorkspaceFolder | null;

	/**
	 * Return `true` if the current workspace has the given identifier or root URI otherwise `false`.
	 */
	isCurrentWorkspace(workspaceIdOrFolder: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | URI): boolean;

	/**
	 * Returns if the provided resource is inside the workspace or not.
	 */
	isInsideWorkspace(resource: URI): boolean;
}

export interface IResolvedWorkspace extends IWorkspaceIdentifier, IBaseWorkspace {
	readonly folders: IWorkspaceFolder[];
}

export interface IBaseWorkspace {

	/**
	 * If present, marks the window that opens the workspace
	 * as a remote window with the given authority.
	 */
	readonly remoteAuthority?: string;

	/**
	 * Transient workspaces are meant to go away after being used
	 * once, e.g. a window reload of a transient workspace will
	 * open an empty window.
	 *
	 * See: https://github.com/microsoft/vscode/issues/119695
	 */
	readonly transient?: boolean;
}

export interface IBaseWorkspaceIdentifier {

	/**
	 * Every workspace (multi-root, single folder or empty)
	 * has a unique identifier. It is not possible to open
	 * a workspace with the same `id` in multiple windows
	 */
	readonly id: string;
}

/**
 * A single folder workspace identifier is a path to a folder + id.
 */
export interface ISingleFolderWorkspaceIdentifier extends IBaseWorkspaceIdentifier {

	/**
	 * Folder path as `URI`.
	 */
	readonly uri: URI;
}

/**
 * A multi-root workspace identifier is a path to a workspace file + id.
 */
export interface IWorkspaceIdentifier extends IBaseWorkspaceIdentifier {

	/**
	 * Workspace config file path as `URI`.
	 */
	configPath: URI;
}

export interface IEmptyWorkspaceIdentifier extends IBaseWorkspaceIdentifier { }

export type IAnyWorkspaceIdentifier = IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | IEmptyWorkspaceIdentifier;

export function isSingleFolderWorkspaceIdentifier(obj: unknown): obj is ISingleFolderWorkspaceIdentifier {
	const singleFolderIdentifier = obj as ISingleFolderWorkspaceIdentifier | undefined;

	return typeof singleFolderIdentifier?.id === 'string' && URI.isUri(singleFolderIdentifier.uri);
}

export function isEmptyWorkspaceIdentifier(obj: unknown): obj is IEmptyWorkspaceIdentifier {
	const emptyWorkspaceIdentifier = obj as IEmptyWorkspaceIdentifier | undefined;
	return typeof emptyWorkspaceIdentifier?.id === 'string'
		&& !isSingleFolderWorkspaceIdentifier(obj)
		&& !isWorkspaceIdentifier(obj);
}

export const EXTENSION_DEVELOPMENT_EMPTY_WINDOW_WORKSPACE: IEmptyWorkspaceIdentifier = { id: 'ext-dev' };
export const UNKNOWN_EMPTY_WINDOW_WORKSPACE: IEmptyWorkspaceIdentifier = { id: 'empty-window' };

export function toWorkspaceIdentifier(workspace: IWorkspace): IAnyWorkspaceIdentifier;
export function toWorkspaceIdentifier(backupPath: string | undefined, isExtensionDevelopment: boolean): IEmptyWorkspaceIdentifier;
export function toWorkspaceIdentifier(arg0: IWorkspace | string | undefined, isExtensionDevelopment?: boolean): IAnyWorkspaceIdentifier {

	// Empty workspace
	if (typeof arg0 === 'string' || typeof arg0 === 'undefined') {

		// With a backupPath, the basename is the empty workspace identifier
		if (typeof arg0 === 'string') {
			return {
				id: basename(arg0)
			};
		}

		// Extension development empty windows have backups disabled
		// so we return a constant workspace identifier for extension
		// authors to allow to restore their workspace state even then.
		if (isExtensionDevelopment) {
			return EXTENSION_DEVELOPMENT_EMPTY_WINDOW_WORKSPACE;
		}

		return UNKNOWN_EMPTY_WINDOW_WORKSPACE;
	}

	// Multi root
	const workspace = arg0;
	if (workspace.configuration) {
		return {
			id: workspace.id,
			configPath: workspace.configuration
		};
	}

	// Single folder
	if (workspace.folders.length === 1) {
		return {
			id: workspace.id,
			uri: workspace.folders[0].uri
		};
	}

	// Empty window
	return {
		id: workspace.id
	};
}

export function isWorkspaceIdentifier(obj: unknown): obj is IWorkspaceIdentifier {
	const workspaceIdentifier = obj as IWorkspaceIdentifier | undefined;

	return typeof workspaceIdentifier?.id === 'string' && URI.isUri(workspaceIdentifier.configPath);
}

export interface ISerializedSingleFolderWorkspaceIdentifier extends IBaseWorkspaceIdentifier {
	readonly uri: UriComponents;
}

export interface ISerializedWorkspaceIdentifier extends IBaseWorkspaceIdentifier {
	readonly configPath: UriComponents;
}

export function reviveIdentifier(identifier: undefined): undefined;
export function reviveIdentifier(identifier: ISerializedWorkspaceIdentifier): IWorkspaceIdentifier;
export function reviveIdentifier(identifier: ISerializedSingleFolderWorkspaceIdentifier): ISingleFolderWorkspaceIdentifier;
export function reviveIdentifier(identifier: IEmptyWorkspaceIdentifier): IEmptyWorkspaceIdentifier;
export function reviveIdentifier(identifier: ISerializedWorkspaceIdentifier | ISerializedSingleFolderWorkspaceIdentifier | IEmptyWorkspaceIdentifier | undefined): IAnyWorkspaceIdentifier | undefined;
export function reviveIdentifier(identifier: ISerializedWorkspaceIdentifier | ISerializedSingleFolderWorkspaceIdentifier | IEmptyWorkspaceIdentifier | undefined): IAnyWorkspaceIdentifier | undefined {

	// Single Folder
	const singleFolderIdentifierCandidate = identifier as ISerializedSingleFolderWorkspaceIdentifier | undefined;
	if (singleFolderIdentifierCandidate?.uri) {
		return { id: singleFolderIdentifierCandidate.id, uri: URI.revive(singleFolderIdentifierCandidate.uri) };
	}

	// Multi folder
	const workspaceIdentifierCandidate = identifier as ISerializedWorkspaceIdentifier | undefined;
	if (workspaceIdentifierCandidate?.configPath) {
		return { id: workspaceIdentifierCandidate.id, configPath: URI.revive(workspaceIdentifierCandidate.configPath) };
	}

	// Empty
	if (identifier?.id) {
		return { id: identifier.id };
	}

	return undefined;
}

export const enum WorkbenchState {
	EMPTY = 1,
	FOLDER,
	WORKSPACE
}

export interface IWorkspaceFoldersWillChangeEvent {

	readonly changes: IWorkspaceFoldersChangeEvent;
	readonly fromCache: boolean;

	join(promise: Promise<void>): void;
}

export interface IWorkspaceFoldersChangeEvent {
	added: IWorkspaceFolder[];
	removed: IWorkspaceFolder[];
	changed: IWorkspaceFolder[];
}

export interface IWorkspace {

	/**
	 * the unique identifier of the workspace.
	 */
	readonly id: string;

	/**
	 * Folders in the workspace.
	 */
	readonly folders: IWorkspaceFolder[];

	/**
	 * Transient workspaces are meant to go away after being used
	 * once, e.g. a window reload of a transient workspace will
	 * open an empty window.
	 */
	readonly transient?: boolean;

	/**
	 * the location of the workspace configuration
	 */
	readonly configuration?: URI | null;
}

export function isWorkspace(thing: unknown): thing is IWorkspace {
	const candidate = thing as IWorkspace | undefined;

	return !!(candidate && typeof candidate === 'object'
		&& typeof candidate.id === 'string'
		&& Array.isArray(candidate.folders));
}

export interface IWorkspaceFolderData {

	/**
	 * The associated URI for this workspace folder.
	 */
	readonly uri: URI;

	/**
	 * The name of this workspace folder. Defaults to
	 * the basename of its [uri-path](#Uri.path)
	 */
	readonly name: string;

	/**
	 * The ordinal number of this workspace folder.
	 */
	readonly index: number;
}

export interface IWorkspaceFolder extends IWorkspaceFolderData {

	/**
	 * Given workspace folder relative path, returns the resource with the absolute path.
	 */
	toResource: (relativePath: string) => URI;
}

export function isWorkspaceFolder(thing: unknown): thing is IWorkspaceFolder {
	const candidate = thing as IWorkspaceFolder;

	return !!(candidate && typeof candidate === 'object'
		&& URI.isUri(candidate.uri)
		&& typeof candidate.name === 'string'
		&& typeof candidate.toResource === 'function');
}

export class Workspace implements IWorkspace {

	private foldersMap: TernarySearchTree<URI, WorkspaceFolder>;

	private _folders!: WorkspaceFolder[];
	get folders(): WorkspaceFolder[] { return this._folders; }
	set folders(folders: WorkspaceFolder[]) {
		this._folders = folders;
		this.updateFoldersMap();
	}

	constructor(
		private _id: string,
		folders: WorkspaceFolder[],
		private _transient: boolean,
		private _configuration: URI | null,
		private ignorePathCasing: (key: URI) => boolean,
	) {
		this.foldersMap = TernarySearchTree.forUris<WorkspaceFolder>(this.ignorePathCasing, () => true);
		this.folders = folders;
	}

	update(workspace: Workspace) {
		this._id = workspace.id;
		this._configuration = workspace.configuration;
		this._transient = workspace.transient;
		this.ignorePathCasing = workspace.ignorePathCasing;
		this.folders = workspace.folders;
	}

	get id(): string {
		return this._id;
	}

	get transient(): boolean {
		return this._transient;
	}

	get configuration(): URI | null {
		return this._configuration;
	}

	set configuration(configuration: URI | null) {
		this._configuration = configuration;
	}

	getFolder(resource: URI): IWorkspaceFolder | null {
		if (!resource) {
			return null;
		}

		return this.foldersMap.findSubstr(resource) || null;
	}

	private updateFoldersMap(): void {
		this.foldersMap = TernarySearchTree.forUris<WorkspaceFolder>(this.ignorePathCasing, () => true);
		for (const folder of this.folders) {
			this.foldersMap.set(folder.uri, folder);
		}
	}

	toJSON(): IWorkspace {
		return { id: this.id, folders: this.folders, transient: this.transient, configuration: this.configuration };
	}
}

export interface IRawFileWorkspaceFolder {
	readonly path: string;
	name?: string;
}

export interface IRawUriWorkspaceFolder {
	readonly uri: string;
	name?: string;
}

export class WorkspaceFolder implements IWorkspaceFolder {

	readonly uri: URI;
	readonly name: string;
	readonly index: number;

	constructor(
		data: IWorkspaceFolderData,
		/**
		 * Provides access to the original metadata for this workspace
		 * folder. This can be different from the metadata provided in
		 * this class:
		 * - raw paths can be relative
		 * - raw paths are not normalized
		 */
		readonly raw?: IRawFileWorkspaceFolder | IRawUriWorkspaceFolder
	) {
		this.uri = data.uri;
		this.index = data.index;
		this.name = data.name;
	}

	toResource(relativePath: string): URI {
		return joinPath(this.uri, relativePath);
	}

	toJSON(): IWorkspaceFolderData {
		return { uri: this.uri, name: this.name, index: this.index };
	}
}

export function toWorkspaceFolder(resource: URI): WorkspaceFolder {
	return new WorkspaceFolder({ uri: resource, index: 0, name: basenameOrAuthority(resource) }, { uri: resource.toString() });
}

export const WORKSPACE_EXTENSION = 'code-workspace';
export const WORKSPACE_SUFFIX = `.${WORKSPACE_EXTENSION}`;
export const WORKSPACE_FILTER = [{ name: localize('codeWorkspace', "Code Workspace"), extensions: [WORKSPACE_EXTENSION] }];
export const UNTITLED_WORKSPACE_NAME = 'workspace.json';

export function isUntitledWorkspace(path: URI, environmentService: IEnvironmentService): boolean {
	return extUriBiasedIgnorePathCase.isEqualOrParent(path, environmentService.untitledWorkspacesHome);
}

export function isTemporaryWorkspace(workspace: IWorkspace): boolean;
export function isTemporaryWorkspace(path: URI): boolean;
export function isTemporaryWorkspace(arg1: IWorkspace | URI): boolean {
	let path: URI | null | undefined;
	if (URI.isUri(arg1)) {
		path = arg1;
	} else {
		path = arg1.configuration;
	}

	return path?.scheme === Schemas.tmp;
}

export const STANDALONE_EDITOR_WORKSPACE_ID = '4064f6ec-cb38-4ad0-af64-ee6467e63c82';
export function isStandaloneEditorWorkspace(workspace: IWorkspace): boolean {
	return workspace.id === STANDALONE_EDITOR_WORKSPACE_ID;
}

export function isSavedWorkspace(path: URI, environmentService: IEnvironmentService): boolean {
	return !isUntitledWorkspace(path, environmentService) && !isTemporaryWorkspace(path);
}

export function hasWorkspaceFileExtension(path: string | URI) {
	const ext = (typeof path === 'string') ? extname(path) : resourceExtname(path);

	return ext === WORKSPACE_SUFFIX;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/workspace/common/workspaceTrust.ts]---
Location: vscode-main/src/vs/platform/workspace/common/workspaceTrust.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export enum WorkspaceTrustScope {
	Local = 0,
	Remote = 1
}

export interface WorkspaceTrustRequestButton {
	readonly label: string;
	readonly type: 'ContinueWithTrust' | 'ContinueWithoutTrust' | 'Manage' | 'Cancel';
}

export interface WorkspaceTrustRequestOptions {
	readonly buttons?: WorkspaceTrustRequestButton[];
	readonly message?: string;
}

export const IWorkspaceTrustEnablementService = createDecorator<IWorkspaceTrustEnablementService>('workspaceTrustEnablementService');

export interface IWorkspaceTrustEnablementService {
	readonly _serviceBrand: undefined;

	isWorkspaceTrustEnabled(): boolean;
}

export const IWorkspaceTrustManagementService = createDecorator<IWorkspaceTrustManagementService>('workspaceTrustManagementService');

export interface IWorkspaceTrustManagementService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeTrust: Event<boolean>;
	readonly onDidChangeTrustedFolders: Event<void>;

	readonly workspaceResolved: Promise<void>;
	readonly workspaceTrustInitialized: Promise<void>;
	acceptsOutOfWorkspaceFiles: boolean;

	isWorkspaceTrusted(): boolean;
	isWorkspaceTrustForced(): boolean;

	canSetParentFolderTrust(): boolean;
	setParentFolderTrust(trusted: boolean): Promise<void>;

	canSetWorkspaceTrust(): boolean;
	setWorkspaceTrust(trusted: boolean): Promise<void>;

	getUriTrustInfo(uri: URI): Promise<IWorkspaceTrustUriInfo>;
	setUrisTrust(uri: URI[], trusted: boolean): Promise<void>;

	getTrustedUris(): URI[];
	setTrustedUris(uris: URI[]): Promise<void>;

	addWorkspaceTrustTransitionParticipant(participant: IWorkspaceTrustTransitionParticipant): IDisposable;
}

export const enum WorkspaceTrustUriResponse {
	Open = 1,
	OpenInNewWindow = 2,
	Cancel = 3
}

export const IWorkspaceTrustRequestService = createDecorator<IWorkspaceTrustRequestService>('workspaceTrustRequestService');

export interface IWorkspaceTrustRequestService {
	readonly _serviceBrand: undefined;

	readonly onDidInitiateOpenFilesTrustRequest: Event<void>;
	readonly onDidInitiateWorkspaceTrustRequest: Event<WorkspaceTrustRequestOptions | undefined>;
	readonly onDidInitiateWorkspaceTrustRequestOnStartup: Event<void>;

	completeOpenFilesTrustRequest(result: WorkspaceTrustUriResponse, saveResponse?: boolean): Promise<void>;
	requestOpenFilesTrust(openFiles: URI[]): Promise<WorkspaceTrustUriResponse>;

	cancelWorkspaceTrustRequest(): void;
	completeWorkspaceTrustRequest(trusted?: boolean): Promise<void>;
	requestWorkspaceTrust(options?: WorkspaceTrustRequestOptions): Promise<boolean | undefined>;
	requestWorkspaceTrustOnStartup(): void;
}

export interface IWorkspaceTrustTransitionParticipant {
	participate(trusted: boolean): Promise<void>;
}

export interface IWorkspaceTrustUriInfo {
	uri: URI;
	trusted: boolean;
}

export interface IWorkspaceTrustInfo {
	uriTrustInfo: IWorkspaceTrustUriInfo[];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/workspace/test/common/testWorkspace.ts]---
Location: vscode-main/src/vs/platform/workspace/test/common/testWorkspace.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isLinux, isWindows } from '../../../../base/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import { toWorkspaceFolder, Workspace as BaseWorkspace, WorkspaceFolder } from '../../common/workspace.js';

export class Workspace extends BaseWorkspace {
	constructor(
		id: string,
		folders: WorkspaceFolder[] = [],
		configuration: URI | null = null,
		ignorePathCasing: (key: URI) => boolean = () => !isLinux
	) {
		super(id, folders, false, configuration, ignorePathCasing);
	}
}

const wsUri = URI.file(isWindows ? 'C:\\testWorkspace' : '/testWorkspace');
export const TestWorkspace = testWorkspace(wsUri);

export function testWorkspace(resource: URI): Workspace {
	return new Workspace(resource.toString(), [toWorkspaceFolder(resource)]);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/workspace/test/common/workspace.test.ts]---
Location: vscode-main/src/vs/platform/workspace/test/common/workspace.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { join } from '../../../../base/common/path.js';
import { isLinux, isWindows } from '../../../../base/common/platform.js';
import { extUriBiasedIgnorePathCase } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { IRawFileWorkspaceFolder, Workspace, WorkspaceFolder } from '../../common/workspace.js';
import { toWorkspaceFolders } from '../../../workspaces/common/workspaces.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('Workspace', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const fileFolder = isWindows ? 'c:\\src' : '/src';
	const abcFolder = isWindows ? 'c:\\abc' : '/abc';

	const testFolderUri = URI.file(join(fileFolder, 'test'));
	const mainFolderUri = URI.file(join(fileFolder, 'main'));
	const test1FolderUri = URI.file(join(fileFolder, 'test1'));
	const test2FolderUri = URI.file(join(fileFolder, 'test2'));
	const test3FolderUri = URI.file(join(fileFolder, 'test3'));
	const abcTest1FolderUri = URI.file(join(abcFolder, 'test1'));
	const abcTest3FolderUri = URI.file(join(abcFolder, 'test3'));

	const workspaceConfigUri = URI.file(join(fileFolder, 'test.code-workspace'));

	test('getFolder returns the folder with given uri', () => {
		const expected = new WorkspaceFolder({ uri: testFolderUri, name: '', index: 2 });
		const testObject = new Workspace('', [new WorkspaceFolder({ uri: mainFolderUri, name: '', index: 0 }), expected, new WorkspaceFolder({ uri: URI.file('/src/code'), name: '', index: 2 })], false, null, () => !isLinux);

		const actual = testObject.getFolder(expected.uri);

		assert.strictEqual(actual, expected);
	});

	test('getFolder returns the folder if the uri is sub', () => {
		const expected = new WorkspaceFolder({ uri: testFolderUri, name: '', index: 0 });
		const testObject = new Workspace('', [expected, new WorkspaceFolder({ uri: mainFolderUri, name: '', index: 1 }), new WorkspaceFolder({ uri: URI.file('/src/code'), name: '', index: 2 })], false, null, () => !isLinux);

		const actual = testObject.getFolder(URI.file(join(fileFolder, 'test/a')));

		assert.strictEqual(actual, expected);
	});

	test('getFolder returns the closest folder if the uri is sub', () => {
		const expected = new WorkspaceFolder({ uri: testFolderUri, name: '', index: 2 });
		const testObject = new Workspace('', [new WorkspaceFolder({ uri: mainFolderUri, name: '', index: 0 }), new WorkspaceFolder({ uri: URI.file('/src/code'), name: '', index: 1 }), expected], false, null, () => !isLinux);

		const actual = testObject.getFolder(URI.file(join(fileFolder, 'test/a')));

		assert.strictEqual(actual, expected);
	});

	test('getFolder returns the folder even if the uri has query path', () => {
		const expected = new WorkspaceFolder({ uri: testFolderUri, name: '', index: 2 });
		const testObject = new Workspace('', [new WorkspaceFolder({ uri: mainFolderUri, name: '', index: 0 }), new WorkspaceFolder({ uri: URI.file('/src/code'), name: '', index: 1 }), expected], false, null, () => !isLinux);

		const actual = testObject.getFolder(URI.file(join(fileFolder, 'test/a')).with({ query: 'somequery' }));

		assert.strictEqual(actual, expected);
	});

	test('getFolder returns null if the uri is not sub', () => {
		const testObject = new Workspace('', [new WorkspaceFolder({ uri: testFolderUri, name: '', index: 0 }), new WorkspaceFolder({ uri: URI.file('/src/code'), name: '', index: 1 })], false, null, () => !isLinux);

		const actual = testObject.getFolder(URI.file(join(fileFolder, 'main/a')));

		assert.strictEqual(actual, null);
	});

	test('toWorkspaceFolders with single absolute folder', () => {
		const actual = toWorkspaceFolders([{ path: '/src/test' }], workspaceConfigUri, extUriBiasedIgnorePathCase);

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].uri.fsPath, testFolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[0].raw).path, '/src/test');
		assert.strictEqual(actual[0].index, 0);
		assert.strictEqual(actual[0].name, 'test');
	});

	test('toWorkspaceFolders with single relative folder', () => {
		const actual = toWorkspaceFolders([{ path: './test' }], workspaceConfigUri, extUriBiasedIgnorePathCase);

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].uri.fsPath, testFolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[0].raw).path, './test');
		assert.strictEqual(actual[0].index, 0);
		assert.strictEqual(actual[0].name, 'test');
	});

	test('toWorkspaceFolders with single absolute folder with name', () => {
		const actual = toWorkspaceFolders([{ path: '/src/test', name: 'hello' }], workspaceConfigUri, extUriBiasedIgnorePathCase);

		assert.strictEqual(actual.length, 1);

		assert.strictEqual(actual[0].uri.fsPath, testFolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[0].raw).path, '/src/test');
		assert.strictEqual(actual[0].index, 0);
		assert.strictEqual(actual[0].name, 'hello');
	});

	test('toWorkspaceFolders with multiple unique absolute folders', () => {
		const actual = toWorkspaceFolders([{ path: '/src/test2' }, { path: '/src/test3' }, { path: '/src/test1' }], workspaceConfigUri, extUriBiasedIgnorePathCase);

		assert.strictEqual(actual.length, 3);
		assert.strictEqual(actual[0].uri.fsPath, test2FolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[0].raw).path, '/src/test2');
		assert.strictEqual(actual[0].index, 0);
		assert.strictEqual(actual[0].name, 'test2');

		assert.strictEqual(actual[1].uri.fsPath, test3FolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[1].raw).path, '/src/test3');
		assert.strictEqual(actual[1].index, 1);
		assert.strictEqual(actual[1].name, 'test3');

		assert.strictEqual(actual[2].uri.fsPath, test1FolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[2].raw).path, '/src/test1');
		assert.strictEqual(actual[2].index, 2);
		assert.strictEqual(actual[2].name, 'test1');
	});

	test('toWorkspaceFolders with multiple unique absolute folders with names', () => {
		const actual = toWorkspaceFolders([{ path: '/src/test2' }, { path: '/src/test3', name: 'noName' }, { path: '/src/test1' }], workspaceConfigUri, extUriBiasedIgnorePathCase);

		assert.strictEqual(actual.length, 3);
		assert.strictEqual(actual[0].uri.fsPath, test2FolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[0].raw).path, '/src/test2');
		assert.strictEqual(actual[0].index, 0);
		assert.strictEqual(actual[0].name, 'test2');

		assert.strictEqual(actual[1].uri.fsPath, test3FolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[1].raw).path, '/src/test3');
		assert.strictEqual(actual[1].index, 1);
		assert.strictEqual(actual[1].name, 'noName');

		assert.strictEqual(actual[2].uri.fsPath, test1FolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[2].raw).path, '/src/test1');
		assert.strictEqual(actual[2].index, 2);
		assert.strictEqual(actual[2].name, 'test1');
	});

	test('toWorkspaceFolders with multiple unique absolute and relative folders', () => {
		const actual = toWorkspaceFolders([{ path: '/src/test2' }, { path: '/abc/test3', name: 'noName' }, { path: './test1' }], workspaceConfigUri, extUriBiasedIgnorePathCase);

		assert.strictEqual(actual.length, 3);
		assert.strictEqual(actual[0].uri.fsPath, test2FolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[0].raw).path, '/src/test2');
		assert.strictEqual(actual[0].index, 0);
		assert.strictEqual(actual[0].name, 'test2');

		assert.strictEqual(actual[1].uri.fsPath, abcTest3FolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[1].raw).path, '/abc/test3');
		assert.strictEqual(actual[1].index, 1);
		assert.strictEqual(actual[1].name, 'noName');

		assert.strictEqual(actual[2].uri.fsPath, test1FolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[2].raw).path, './test1');
		assert.strictEqual(actual[2].index, 2);
		assert.strictEqual(actual[2].name, 'test1');
	});

	test('toWorkspaceFolders with multiple absolute folders with duplicates', () => {
		const actual = toWorkspaceFolders([{ path: '/src/test2' }, { path: '/src/test2', name: 'noName' }, { path: '/src/test1' }], workspaceConfigUri, extUriBiasedIgnorePathCase);

		assert.strictEqual(actual.length, 2);
		assert.strictEqual(actual[0].uri.fsPath, test2FolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[0].raw).path, '/src/test2');
		assert.strictEqual(actual[0].index, 0);
		assert.strictEqual(actual[0].name, 'test2');

		assert.strictEqual(actual[1].uri.fsPath, test1FolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[1].raw).path, '/src/test1');
		assert.strictEqual(actual[1].index, 1);
		assert.strictEqual(actual[1].name, 'test1');
	});

	test('toWorkspaceFolders with multiple absolute and relative folders with duplicates', () => {
		const actual = toWorkspaceFolders([{ path: '/src/test2' }, { path: '/src/test3', name: 'noName' }, { path: './test3' }, { path: '/abc/test1' }], workspaceConfigUri, extUriBiasedIgnorePathCase);

		assert.strictEqual(actual.length, 3);
		assert.strictEqual(actual[0].uri.fsPath, test2FolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[0].raw).path, '/src/test2');
		assert.strictEqual(actual[0].index, 0);
		assert.strictEqual(actual[0].name, 'test2');

		assert.strictEqual(actual[1].uri.fsPath, test3FolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[1].raw).path, '/src/test3');
		assert.strictEqual(actual[1].index, 1);
		assert.strictEqual(actual[1].name, 'noName');

		assert.strictEqual(actual[2].uri.fsPath, abcTest1FolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[2].raw).path, '/abc/test1');
		assert.strictEqual(actual[2].index, 2);
		assert.strictEqual(actual[2].name, 'test1');
	});

	test('toWorkspaceFolders with multiple absolute and relative folders with invalid paths', () => {
		const actual = toWorkspaceFolders([{ path: '/src/test2' }, { path: '', name: 'noName' }, { path: './test3' }, { path: '/abc/test1' }], workspaceConfigUri, extUriBiasedIgnorePathCase);

		assert.strictEqual(actual.length, 3);
		assert.strictEqual(actual[0].uri.fsPath, test2FolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[0].raw).path, '/src/test2');
		assert.strictEqual(actual[0].index, 0);
		assert.strictEqual(actual[0].name, 'test2');

		assert.strictEqual(actual[1].uri.fsPath, test3FolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[1].raw).path, './test3');
		assert.strictEqual(actual[1].index, 1);
		assert.strictEqual(actual[1].name, 'test3');

		assert.strictEqual(actual[2].uri.fsPath, abcTest1FolderUri.fsPath);
		assert.strictEqual((<IRawFileWorkspaceFolder>actual[2].raw).path, '/abc/test1');
		assert.strictEqual(actual[2].index, 2);
		assert.strictEqual(actual[2].name, 'test1');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/workspaces/common/workspaces.ts]---
Location: vscode-main/src/vs/platform/workspaces/common/workspaces.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { isUNC, toSlashes } from '../../../base/common/extpath.js';
import * as json from '../../../base/common/json.js';
import * as jsonEdit from '../../../base/common/jsonEdit.js';
import { FormattingOptions } from '../../../base/common/jsonFormatter.js';
import { normalizeDriveLetter } from '../../../base/common/labels.js';
import { Schemas } from '../../../base/common/network.js';
import { isAbsolute, posix } from '../../../base/common/path.js';
import { isLinux, isMacintosh, isWindows } from '../../../base/common/platform.js';
import { IExtUri, isEqualAuthority } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { IWorkspaceBackupInfo, IFolderBackupInfo } from '../../backup/common/backup.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { getRemoteAuthority } from '../../remote/common/remoteHosts.js';
import { IBaseWorkspace, IRawFileWorkspaceFolder, IRawUriWorkspaceFolder, IWorkspaceIdentifier, WorkspaceFolder } from '../../workspace/common/workspace.js';

export const IWorkspacesService = createDecorator<IWorkspacesService>('workspacesService');

export interface IWorkspacesService {

	readonly _serviceBrand: undefined;

	// Workspaces Management
	enterWorkspace(workspaceUri: URI): Promise<IEnterWorkspaceResult | undefined>;
	createUntitledWorkspace(folders?: IWorkspaceFolderCreationData[], remoteAuthority?: string): Promise<IWorkspaceIdentifier>;
	deleteUntitledWorkspace(workspace: IWorkspaceIdentifier): Promise<void>;
	getWorkspaceIdentifier(workspaceUri: URI): Promise<IWorkspaceIdentifier>;

	// Workspaces History
	readonly onDidChangeRecentlyOpened: Event<void>;
	addRecentlyOpened(recents: IRecent[]): Promise<void>;
	removeRecentlyOpened(workspaces: URI[]): Promise<void>;
	clearRecentlyOpened(): Promise<void>;
	getRecentlyOpened(): Promise<IRecentlyOpened>;

	// Dirty Workspaces
	getDirtyWorkspaces(): Promise<Array<IWorkspaceBackupInfo | IFolderBackupInfo>>;
}

//#region Workspaces Recently Opened

export interface IRecentlyOpened {
	workspaces: Array<IRecentWorkspace | IRecentFolder>;
	files: IRecentFile[];
}

export type IRecent = IRecentWorkspace | IRecentFolder | IRecentFile;

export interface IRecentWorkspace {
	readonly workspace: IWorkspaceIdentifier;
	label?: string;
	readonly remoteAuthority?: string;
}

export interface IRecentFolder {
	readonly folderUri: URI;
	label?: string;
	readonly remoteAuthority?: string;
}

export interface IRecentFile {
	readonly fileUri: URI;
	label?: string;
	readonly remoteAuthority?: string;
}

export function isRecentWorkspace(curr: IRecent): curr is IRecentWorkspace {
	return curr.hasOwnProperty('workspace');
}

export function isRecentFolder(curr: IRecent): curr is IRecentFolder {
	return curr.hasOwnProperty('folderUri');
}

export function isRecentFile(curr: IRecent): curr is IRecentFile {
	return curr.hasOwnProperty('fileUri');
}

//#endregion

//#region Workspace File Utilities

export function isStoredWorkspaceFolder(obj: unknown): obj is IStoredWorkspaceFolder {
	return isRawFileWorkspaceFolder(obj) || isRawUriWorkspaceFolder(obj);
}

function isRawFileWorkspaceFolder(obj: unknown): obj is IRawFileWorkspaceFolder {
	const candidate = obj as IRawFileWorkspaceFolder | undefined;

	return typeof candidate?.path === 'string' && (!candidate.name || typeof candidate.name === 'string');
}

function isRawUriWorkspaceFolder(obj: unknown): obj is IRawUriWorkspaceFolder {
	const candidate = obj as IRawUriWorkspaceFolder | undefined;

	return typeof candidate?.uri === 'string' && (!candidate.name || typeof candidate.name === 'string');
}

export type IStoredWorkspaceFolder = IRawFileWorkspaceFolder | IRawUriWorkspaceFolder;

export interface IStoredWorkspace extends IBaseWorkspace {
	folders: IStoredWorkspaceFolder[];
}

export interface IWorkspaceFolderCreationData {
	readonly uri: URI;
	readonly name?: string;
}

export interface IUntitledWorkspaceInfo {
	readonly workspace: IWorkspaceIdentifier;
	readonly remoteAuthority?: string;
}

export interface IEnterWorkspaceResult {
	readonly workspace: IWorkspaceIdentifier;
	readonly backupPath?: string;
}

/**
 * Given a folder URI and the workspace config folder, computes the `IStoredWorkspaceFolder`
 * using a relative or absolute path or a uri.
 * Undefined is returned if the `folderURI` and the `targetConfigFolderURI` don't have the
 * same schema or authority.
 *
 * @param folderURI a workspace folder
 * @param forceAbsolute if set, keep the path absolute
 * @param folderName a workspace name
 * @param targetConfigFolderURI the folder where the workspace is living in
 */
export function getStoredWorkspaceFolder(folderURI: URI, forceAbsolute: boolean, folderName: string | undefined, targetConfigFolderURI: URI, extUri: IExtUri): IStoredWorkspaceFolder {

	// Scheme mismatch: use full absolute URI as `uri`
	if (folderURI.scheme !== targetConfigFolderURI.scheme) {
		return { name: folderName, uri: folderURI.toString(true) };
	}

	// Always prefer a relative path if possible unless
	// prevented to make the workspace file shareable
	// with other users
	let folderPath = !forceAbsolute ? extUri.relativePath(targetConfigFolderURI, folderURI) : undefined;
	if (folderPath !== undefined) {
		if (folderPath.length === 0) {
			folderPath = '.';
		} else {
			if (isWindows) {
				folderPath = massagePathForWindows(folderPath);
			}
		}
	}

	// We could not resolve a relative path
	else {

		// Local file: use `fsPath`
		if (folderURI.scheme === Schemas.file) {
			folderPath = folderURI.fsPath;
			if (isWindows) {
				folderPath = massagePathForWindows(folderPath);
			}
		}

		// Different authority: use full absolute URI
		else if (!extUri.isEqualAuthority(folderURI.authority, targetConfigFolderURI.authority)) {
			return { name: folderName, uri: folderURI.toString(true) };
		}

		// Non-local file: use `path` of URI
		else {
			folderPath = folderURI.path;
		}
	}

	return { name: folderName, path: folderPath };
}

function massagePathForWindows(folderPath: string) {

	// Drive letter should be upper case
	folderPath = normalizeDriveLetter(folderPath);

	// Always prefer slash over backslash unless
	// we deal with UNC paths where backslash is
	// mandatory.
	if (!isUNC(folderPath)) {
		folderPath = toSlashes(folderPath);
	}

	return folderPath;
}

export function toWorkspaceFolders(configuredFolders: IStoredWorkspaceFolder[], workspaceConfigFile: URI, extUri: IExtUri): WorkspaceFolder[] {
	const result: WorkspaceFolder[] = [];
	const seen: Set<string> = new Set();

	const relativeTo = extUri.dirname(workspaceConfigFile);
	for (const configuredFolder of configuredFolders) {
		let uri: URI | undefined = undefined;
		if (isRawFileWorkspaceFolder(configuredFolder)) {
			if (configuredFolder.path) {
				uri = extUri.resolvePath(relativeTo, configuredFolder.path);
			}
		} else if (isRawUriWorkspaceFolder(configuredFolder)) {
			try {
				uri = URI.parse(configuredFolder.uri);
				if (uri.path[0] !== posix.sep) {
					uri = uri.with({ path: posix.sep + uri.path }); // this makes sure all workspace folder are absolute
				}
			} catch (e) {
				console.warn(e); // ignore
			}
		}

		if (uri) {

			// remove duplicates
			const comparisonKey = extUri.getComparisonKey(uri);
			if (!seen.has(comparisonKey)) {
				seen.add(comparisonKey);

				const name = configuredFolder.name || extUri.basenameOrAuthority(uri);
				result.push(new WorkspaceFolder({ uri, name, index: result.length }, configuredFolder));
			}
		}
	}

	return result;
}

/**
 * Rewrites the content of a workspace file to be saved at a new location.
 * Throws an exception if file is not a valid workspace file
 */
export function rewriteWorkspaceFileForNewLocation(rawWorkspaceContents: string, configPathURI: URI, isFromUntitledWorkspace: boolean, targetConfigPathURI: URI, extUri: IExtUri) {
	const storedWorkspace = doParseStoredWorkspace(configPathURI, rawWorkspaceContents);

	const sourceConfigFolder = extUri.dirname(configPathURI);
	const targetConfigFolder = extUri.dirname(targetConfigPathURI);

	const rewrittenFolders: IStoredWorkspaceFolder[] = [];

	for (const folder of storedWorkspace.folders) {
		const folderURI = isRawFileWorkspaceFolder(folder) ? extUri.resolvePath(sourceConfigFolder, folder.path) : URI.parse(folder.uri);
		let absolute;
		if (isFromUntitledWorkspace) {
			absolute = false; // if it was an untitled workspace, try to make paths relative
		} else {
			absolute = !isRawFileWorkspaceFolder(folder) || isAbsolute(folder.path); // for existing workspaces, preserve whether a path was absolute or relative
		}
		rewrittenFolders.push(getStoredWorkspaceFolder(folderURI, absolute, folder.name, targetConfigFolder, extUri));
	}

	// Preserve as much of the existing workspace as possible by using jsonEdit
	// and only changing the folders portion.
	const formattingOptions: FormattingOptions = { insertSpaces: false, tabSize: 4, eol: (isLinux || isMacintosh) ? '\n' : '\r\n' };
	const edits = jsonEdit.setProperty(rawWorkspaceContents, ['folders'], rewrittenFolders, formattingOptions);
	let newContent = jsonEdit.applyEdits(rawWorkspaceContents, edits);

	if (isEqualAuthority(storedWorkspace.remoteAuthority, getRemoteAuthority(targetConfigPathURI))) {
		// unsaved remote workspaces have the remoteAuthority set. Remove it when no longer nexessary.
		newContent = jsonEdit.applyEdits(newContent, jsonEdit.removeProperty(newContent, ['remoteAuthority'], formattingOptions));
	}

	return newContent;
}

function doParseStoredWorkspace(path: URI, contents: string): IStoredWorkspace {

	// Parse workspace file
	const storedWorkspace: IStoredWorkspace = json.parse(contents); // use fault tolerant parser

	// Filter out folders which do not have a path or uri set
	if (storedWorkspace && Array.isArray(storedWorkspace.folders)) {
		storedWorkspace.folders = storedWorkspace.folders.filter(folder => isStoredWorkspaceFolder(folder));
	} else {
		throw new Error(`${path} looks like an invalid workspace file.`);
	}

	return storedWorkspace;
}

//#endregion

//#region Workspace Storage

interface ISerializedRecentWorkspace {
	readonly workspace: {
		id: string;
		configPath: string;
	};
	readonly label?: string;
	readonly remoteAuthority?: string;
}

interface ISerializedRecentFolder {
	readonly folderUri: string;
	readonly label?: string;
	readonly remoteAuthority?: string;
}

interface ISerializedRecentFile {
	readonly fileUri: string;
	readonly label?: string;
	readonly remoteAuthority?: string;
}

interface ISerializedRecentlyOpened {
	readonly entries: Array<ISerializedRecentWorkspace | ISerializedRecentFolder | ISerializedRecentFile>; // since 1.55
}

export type RecentlyOpenedStorageData = object;

function isSerializedRecentWorkspace(data: unknown): data is ISerializedRecentWorkspace {
	const candidate = data as ISerializedRecentWorkspace | undefined;

	return typeof candidate?.workspace === 'object' && typeof candidate.workspace.id === 'string' && typeof candidate.workspace.configPath === 'string';
}

function isSerializedRecentFolder(data: unknown): data is ISerializedRecentFolder {
	const candidate = data as ISerializedRecentFolder | undefined;

	return typeof candidate?.folderUri === 'string';
}

function isSerializedRecentFile(data: unknown): data is ISerializedRecentFile {
	const candidate = data as ISerializedRecentFile | undefined;

	return typeof candidate?.fileUri === 'string';
}

export function restoreRecentlyOpened(data: RecentlyOpenedStorageData | undefined, logService: ILogService): IRecentlyOpened {
	const result: IRecentlyOpened = { workspaces: [], files: [] };
	if (data) {
		const restoreGracefully = function <T>(entries: T[], onEntry: (entry: T, index: number) => void) {
			for (let i = 0; i < entries.length; i++) {
				try {
					onEntry(entries[i], i);
				} catch (e) {
					logService.warn(`Error restoring recent entry ${JSON.stringify(entries[i])}: ${e.toString()}. Skip entry.`);
				}
			}
		};

		const storedRecents = data as ISerializedRecentlyOpened;
		if (Array.isArray(storedRecents.entries)) {
			restoreGracefully(storedRecents.entries, entry => {
				const label = entry.label;
				const remoteAuthority = entry.remoteAuthority;

				if (isSerializedRecentWorkspace(entry)) {
					result.workspaces.push({ label, remoteAuthority, workspace: { id: entry.workspace.id, configPath: URI.parse(entry.workspace.configPath) } });
				} else if (isSerializedRecentFolder(entry)) {
					result.workspaces.push({ label, remoteAuthority, folderUri: URI.parse(entry.folderUri) });
				} else if (isSerializedRecentFile(entry)) {
					result.files.push({ label, remoteAuthority, fileUri: URI.parse(entry.fileUri) });
				}
			});
		}
	}

	return result;
}

export function toStoreData(recents: IRecentlyOpened): RecentlyOpenedStorageData {
	const serialized: ISerializedRecentlyOpened = { entries: [] };

	const storeLabel = (label: string | undefined, uri: URI) => {
		// Only store the label if it is provided
		// and only if it differs from the path
		// This gives us a chance to render the
		// path better, e.g. use `~` for home.
		return label && label !== uri.fsPath && label !== uri.path;
	};

	for (const recent of recents.workspaces) {
		if (isRecentFolder(recent)) {
			serialized.entries.push({
				folderUri: recent.folderUri.toString(),
				label: storeLabel(recent.label, recent.folderUri) ? recent.label : undefined,
				remoteAuthority: recent.remoteAuthority
			});
		} else {
			serialized.entries.push({
				workspace: {
					id: recent.workspace.id,
					configPath: recent.workspace.configPath.toString()
				},
				label: storeLabel(recent.label, recent.workspace.configPath) ? recent.label : undefined,
				remoteAuthority: recent.remoteAuthority
			});
		}
	}

	for (const recent of recents.files) {
		serialized.entries.push({
			fileUri: recent.fileUri.toString(),
			label: storeLabel(recent.label, recent.fileUri) ? recent.label : undefined,
			remoteAuthority: recent.remoteAuthority
		});
	}

	return serialized;
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/workspaces/electron-main/workspacesHistoryMainService.ts]---
Location: vscode-main/src/vs/platform/workspaces/electron-main/workspacesHistoryMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { app, JumpListCategory, JumpListItem } from 'electron';
import { coalesce } from '../../../base/common/arrays.js';
import { ThrottledDelayer } from '../../../base/common/async.js';
import { Emitter, Event as CommonEvent } from '../../../base/common/event.js';
import { normalizeDriveLetter, splitRecentLabel } from '../../../base/common/labels.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { isMacintosh, isWindows } from '../../../base/common/platform.js';
import { basename, extUriBiasedIgnorePathCase, originalFSPath } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { Promises } from '../../../base/node/pfs.js';
import { localize } from '../../../nls.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILifecycleMainService, LifecycleMainPhase } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import { StorageScope, StorageTarget } from '../../storage/common/storage.js';
import { IApplicationStorageMainService } from '../../storage/electron-main/storageMainService.js';
import { IRecent, IRecentFile, IRecentFolder, IRecentlyOpened, IRecentWorkspace, isRecentFile, isRecentFolder, isRecentWorkspace, restoreRecentlyOpened, toStoreData } from '../common/workspaces.js';
import { IWorkspaceIdentifier, WORKSPACE_EXTENSION } from '../../workspace/common/workspace.js';
import { IWorkspacesManagementMainService } from './workspacesManagementMainService.js';
import { ResourceMap } from '../../../base/common/map.js';
import { IDialogMainService } from '../../dialogs/electron-main/dialogMainService.js';

export const IWorkspacesHistoryMainService = createDecorator<IWorkspacesHistoryMainService>('workspacesHistoryMainService');

export interface IWorkspacesHistoryMainService {

	readonly _serviceBrand: undefined;

	readonly onDidChangeRecentlyOpened: CommonEvent<void>;

	addRecentlyOpened(recents: IRecent[]): Promise<void>;
	getRecentlyOpened(): Promise<IRecentlyOpened>;
	removeRecentlyOpened(paths: URI[]): Promise<void>;
	clearRecentlyOpened(options?: { confirm?: boolean }): Promise<void>;
}

export class WorkspacesHistoryMainService extends Disposable implements IWorkspacesHistoryMainService {

	private static readonly MAX_TOTAL_RECENT_ENTRIES = 500;

	private static readonly RECENTLY_OPENED_STORAGE_KEY = 'history.recentlyOpenedPathsList';

	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeRecentlyOpened = this._register(new Emitter<void>());
	readonly onDidChangeRecentlyOpened = this._onDidChangeRecentlyOpened.event;

	constructor(
		@ILogService private readonly logService: ILogService,
		@IWorkspacesManagementMainService private readonly workspacesManagementMainService: IWorkspacesManagementMainService,
		@ILifecycleMainService private readonly lifecycleMainService: ILifecycleMainService,
		@IApplicationStorageMainService private readonly applicationStorageMainService: IApplicationStorageMainService,
		@IDialogMainService private readonly dialogMainService: IDialogMainService
	) {
		super();

		this.registerListeners();
	}

	private registerListeners(): void {

		// Install window jump list delayed after opening window
		// because perf measurements have shown this to be slow
		this.lifecycleMainService.when(LifecycleMainPhase.Eventually).then(() => this.handleWindowsJumpList());

		// Add to history when entering workspace
		this._register(this.workspacesManagementMainService.onDidEnterWorkspace(event => this.addRecentlyOpened([{ workspace: event.workspace, remoteAuthority: event.window.remoteAuthority }])));
	}

	//#region Workspaces History

	async addRecentlyOpened(recentToAdd: IRecent[]): Promise<void> {
		let workspaces: Array<IRecentFolder | IRecentWorkspace> = [];
		let files: IRecentFile[] = [];

		for (const recent of recentToAdd) {

			// Workspace
			if (isRecentWorkspace(recent)) {
				if (!this.workspacesManagementMainService.isUntitledWorkspace(recent.workspace) && !this.containsWorkspace(workspaces, recent.workspace)) {
					workspaces.push(recent);
				}
			}

			// Folder
			else if (isRecentFolder(recent)) {
				if (!this.containsFolder(workspaces, recent.folderUri)) {
					workspaces.push(recent);
				}
			}

			// File
			else {
				const alreadyExistsInHistory = this.containsFile(files, recent.fileUri);
				const shouldBeFiltered = recent.fileUri.scheme === Schemas.file && WorkspacesHistoryMainService.COMMON_FILES_FILTER.indexOf(basename(recent.fileUri)) >= 0;

				if (!alreadyExistsInHistory && !shouldBeFiltered) {
					files.push(recent);

					// Add to recent documents (Windows only, macOS later)
					if (isWindows && recent.fileUri.scheme === Schemas.file) {
						app.addRecentDocument(recent.fileUri.fsPath);
					}
				}
			}
		}

		const mergedEntries = await this.mergeEntriesFromStorage({ workspaces, files });
		workspaces = mergedEntries.workspaces;
		files = mergedEntries.files;

		if (workspaces.length > WorkspacesHistoryMainService.MAX_TOTAL_RECENT_ENTRIES) {
			workspaces.length = WorkspacesHistoryMainService.MAX_TOTAL_RECENT_ENTRIES;
		}

		if (files.length > WorkspacesHistoryMainService.MAX_TOTAL_RECENT_ENTRIES) {
			files.length = WorkspacesHistoryMainService.MAX_TOTAL_RECENT_ENTRIES;
		}

		await this.saveRecentlyOpened({ workspaces, files });
		this._onDidChangeRecentlyOpened.fire();

		// Schedule update to recent documents on macOS dock
		if (isMacintosh) {
			this.macOSRecentDocumentsUpdater.trigger(() => this.updateMacOSRecentDocuments());
		}
	}

	async removeRecentlyOpened(recentToRemove: URI[]): Promise<void> {
		const keep = (recent: IRecent) => {
			const uri = this.location(recent);
			for (const resourceToRemove of recentToRemove) {
				if (extUriBiasedIgnorePathCase.isEqual(resourceToRemove, uri)) {
					return false;
				}
			}

			return true;
		};

		const mru = await this.getRecentlyOpened();
		const workspaces = mru.workspaces.filter(keep);
		const files = mru.files.filter(keep);

		if (workspaces.length !== mru.workspaces.length || files.length !== mru.files.length) {
			await this.saveRecentlyOpened({ files, workspaces });
			this._onDidChangeRecentlyOpened.fire();

			// Schedule update to recent documents on macOS dock
			if (isMacintosh) {
				this.macOSRecentDocumentsUpdater.trigger(() => this.updateMacOSRecentDocuments());
			}
		}
	}

	async clearRecentlyOpened(options?: { confirm?: boolean }): Promise<void> {
		if (options?.confirm) {
			const { response } = await this.dialogMainService.showMessageBox({
				type: 'warning',
				buttons: [
					localize({ key: 'clearButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Clear"),
					localize({ key: 'cancel', comment: ['&& denotes a mnemonic'] }, "&&Cancel")
				],
				message: localize('confirmClearRecentsMessage', "Do you want to clear all recently opened files and workspaces?"),
				detail: localize('confirmClearDetail', "This action is irreversible!"),
				cancelId: 1
			});

			if (response !== 0) {
				return;
			}
		}

		await this.saveRecentlyOpened({ workspaces: [], files: [] });
		app.clearRecentDocuments();

		// Event
		this._onDidChangeRecentlyOpened.fire();
	}

	async getRecentlyOpened(): Promise<IRecentlyOpened> {
		return this.mergeEntriesFromStorage();
	}

	private async mergeEntriesFromStorage(existingEntries?: IRecentlyOpened): Promise<IRecentlyOpened> {

		// Build maps for more efficient lookup of existing entries that
		// are passed in by storing based on workspace/file identifier

		const mapWorkspaceIdToWorkspace = new ResourceMap<IRecentFolder | IRecentWorkspace>(uri => extUriBiasedIgnorePathCase.getComparisonKey(uri));
		if (existingEntries?.workspaces) {
			for (const workspace of existingEntries.workspaces) {
				mapWorkspaceIdToWorkspace.set(this.location(workspace), workspace);
			}
		}

		const mapFileIdToFile = new ResourceMap<IRecentFile>(uri => extUriBiasedIgnorePathCase.getComparisonKey(uri));
		if (existingEntries?.files) {
			for (const file of existingEntries.files) {
				mapFileIdToFile.set(this.location(file), file);
			}
		}

		// Merge in entries from storage, preserving existing known entries

		const recentFromStorage = await this.getRecentlyOpenedFromStorage();
		for (const recentWorkspaceFromStorage of recentFromStorage.workspaces) {
			const existingRecentWorkspace = mapWorkspaceIdToWorkspace.get(this.location(recentWorkspaceFromStorage));
			if (existingRecentWorkspace) {
				existingRecentWorkspace.label = existingRecentWorkspace.label ?? recentWorkspaceFromStorage.label;
			} else {
				mapWorkspaceIdToWorkspace.set(this.location(recentWorkspaceFromStorage), recentWorkspaceFromStorage);
			}
		}

		for (const recentFileFromStorage of recentFromStorage.files) {
			const existingRecentFile = mapFileIdToFile.get(this.location(recentFileFromStorage));
			if (existingRecentFile) {
				existingRecentFile.label = existingRecentFile.label ?? recentFileFromStorage.label;
			} else {
				mapFileIdToFile.set(this.location(recentFileFromStorage), recentFileFromStorage);
			}
		}

		return {
			workspaces: [...mapWorkspaceIdToWorkspace.values()],
			files: [...mapFileIdToFile.values()]
		};
	}

	private async getRecentlyOpenedFromStorage(): Promise<IRecentlyOpened> {

		// Wait for global storage to be ready
		await this.applicationStorageMainService.whenReady;

		let storedRecentlyOpened: object | undefined = undefined;

		// First try with storage service
		const storedRecentlyOpenedRaw = this.applicationStorageMainService.get(WorkspacesHistoryMainService.RECENTLY_OPENED_STORAGE_KEY, StorageScope.APPLICATION);
		if (typeof storedRecentlyOpenedRaw === 'string') {
			try {
				storedRecentlyOpened = JSON.parse(storedRecentlyOpenedRaw);
			} catch (error) {
				this.logService.error('Unexpected error parsing opened paths list', error);
			}
		}

		return restoreRecentlyOpened(storedRecentlyOpened, this.logService);
	}

	private async saveRecentlyOpened(recent: IRecentlyOpened): Promise<void> {

		// Wait for global storage to be ready
		await this.applicationStorageMainService.whenReady;

		// Store in global storage (but do not sync since this is mainly local paths)
		this.applicationStorageMainService.store(WorkspacesHistoryMainService.RECENTLY_OPENED_STORAGE_KEY, JSON.stringify(toStoreData(recent)), StorageScope.APPLICATION, StorageTarget.MACHINE);
	}

	private location(recent: IRecent): URI {
		if (isRecentFolder(recent)) {
			return recent.folderUri;
		}

		if (isRecentFile(recent)) {
			return recent.fileUri;
		}

		return recent.workspace.configPath;
	}

	private containsWorkspace(recents: IRecent[], candidate: IWorkspaceIdentifier): boolean {
		return !!recents.find(recent => isRecentWorkspace(recent) && recent.workspace.id === candidate.id);
	}

	private containsFolder(recents: IRecent[], candidate: URI): boolean {
		return !!recents.find(recent => isRecentFolder(recent) && extUriBiasedIgnorePathCase.isEqual(recent.folderUri, candidate));
	}

	private containsFile(recents: IRecentFile[], candidate: URI): boolean {
		return !!recents.find(recent => extUriBiasedIgnorePathCase.isEqual(recent.fileUri, candidate));
	}

	//#endregion


	//#region macOS Dock / Windows JumpList

	private static readonly MAX_MACOS_DOCK_RECENT_WORKSPACES = 7; 		// prefer higher number of workspaces...
	private static readonly MAX_MACOS_DOCK_RECENT_ENTRIES_TOTAL = 10; 	// ...over number of files

	private static readonly MAX_WINDOWS_JUMP_LIST_ENTRIES = 7;

	// Exclude some very common files from the dock/taskbar
	private static readonly COMMON_FILES_FILTER = [
		'COMMIT_EDITMSG',
		'MERGE_MSG',
		'git-rebase-todo'
	];

	private readonly macOSRecentDocumentsUpdater = this._register(new ThrottledDelayer<void>(800));

	private async handleWindowsJumpList(): Promise<void> {
		if (!isWindows) {
			return; // only on windows
		}

		await this.updateWindowsJumpList();
		this._register(this.onDidChangeRecentlyOpened(() => this.updateWindowsJumpList()));
	}

	private async updateWindowsJumpList(): Promise<void> {
		if (!isWindows) {
			return; // only on windows
		}

		const jumpList: JumpListCategory[] = [];

		// Tasks
		jumpList.push({
			type: 'tasks',
			items: [
				{
					type: 'task',
					title: localize('newWindow', "New Window"),
					description: localize('newWindowDesc', "Opens a new window"),
					program: process.execPath,
					args: '-n', // force new window
					iconPath: process.execPath,
					iconIndex: 0
				}
			]
		});

		// Recent Workspaces
		if ((await this.getRecentlyOpened()).workspaces.length > 0) {

			// The user might have meanwhile removed items from the jump list and we have to respect that
			// so we need to update our list of recent paths with the choice of the user to not add them again
			// Also: Windows will not show our custom category at all if there is any entry which was removed
			// by the user! See https://github.com/microsoft/vscode/issues/15052
			const toRemove: URI[] = [];
			for (const item of app.getJumpListSettings().removedItems) {
				const args = item.args;
				if (args) {
					const match = /^--(folder|file)-uri\s+"([^"]+)"$/.exec(args);
					if (match) {
						toRemove.push(URI.parse(match[2]));
					}
				}
			}
			await this.removeRecentlyOpened(toRemove);

			// Add entries
			let hasWorkspaces = false;
			const items: JumpListItem[] = coalesce((await this.getRecentlyOpened()).workspaces.slice(0, WorkspacesHistoryMainService.MAX_WINDOWS_JUMP_LIST_ENTRIES).map(recent => {
				const workspace = isRecentWorkspace(recent) ? recent.workspace : recent.folderUri;

				const { title, description } = this.getWindowsJumpListLabel(workspace, recent.label);
				let args;
				if (URI.isUri(workspace)) {
					args = `--folder-uri "${workspace.toString()}"`;
				} else {
					hasWorkspaces = true;
					args = `--file-uri "${workspace.configPath.toString()}"`;
				}

				return {
					type: 'task',
					title: title.substr(0, 255), 				// Windows seems to be picky around the length of entries
					description: description.substr(0, 255),	// (see https://github.com/microsoft/vscode/issues/111177)
					program: process.execPath,
					args,
					iconPath: 'explorer.exe', // simulate folder icon
					iconIndex: 0
				};
			}));

			if (items.length > 0) {
				jumpList.push({
					type: 'custom',
					name: hasWorkspaces ? localize('recentFoldersAndWorkspaces', "Recent Folders & Workspaces") : localize('recentFolders', "Recent Folders"),
					items
				});
			}
		}

		// Recent
		jumpList.push({
			type: 'recent' // this enables to show files in the "recent" category
		});

		try {
			const res = app.setJumpList(jumpList);
			if (res && res !== 'ok') {
				this.logService.warn(`updateWindowsJumpList#setJumpList unexpected result: ${res}`);
			}
		} catch (error) {
			this.logService.warn('updateWindowsJumpList#setJumpList', error); // since setJumpList is relatively new API, make sure to guard for errors
		}
	}

	private getWindowsJumpListLabel(workspace: IWorkspaceIdentifier | URI, recentLabel: string | undefined): { title: string; description: string } {

		// Prefer recent label
		if (recentLabel) {
			return { title: splitRecentLabel(recentLabel).name, description: recentLabel };
		}

		// Single Folder
		if (URI.isUri(workspace)) {
			return { title: basename(workspace), description: this.renderJumpListPathDescription(workspace) };
		}

		// Workspace: Untitled
		if (this.workspacesManagementMainService.isUntitledWorkspace(workspace)) {
			return { title: localize('untitledWorkspace', "Untitled (Workspace)"), description: '' };
		}

		// Workspace: normal
		let filename = basename(workspace.configPath);
		if (filename.endsWith(WORKSPACE_EXTENSION)) {
			filename = filename.substr(0, filename.length - WORKSPACE_EXTENSION.length - 1);
		}

		return { title: localize('workspaceName', "{0} (Workspace)", filename), description: this.renderJumpListPathDescription(workspace.configPath) };
	}

	private renderJumpListPathDescription(uri: URI) {
		return uri.scheme === 'file' ? normalizeDriveLetter(uri.fsPath) : uri.toString();
	}

	private async updateMacOSRecentDocuments(): Promise<void> {
		if (!isMacintosh) {
			return;
		}

		// We clear all documents first to ensure an up-to-date view on the set. Since entries
		// can get deleted on disk, this ensures that the list is always valid
		app.clearRecentDocuments();

		const mru = await this.getRecentlyOpened();

		// Collect max-N recent workspaces that are known to exist
		const workspaceEntries: string[] = [];
		let entries = 0;
		for (let i = 0; i < mru.workspaces.length && entries < WorkspacesHistoryMainService.MAX_MACOS_DOCK_RECENT_WORKSPACES; i++) {
			const loc = this.location(mru.workspaces[i]);
			if (loc.scheme === Schemas.file) {
				const workspacePath = originalFSPath(loc);
				if (await Promises.exists(workspacePath)) {
					workspaceEntries.push(workspacePath);
					entries++;
				}
			}
		}

		// Collect max-N recent files that are known to exist
		const fileEntries: string[] = [];
		for (let i = 0; i < mru.files.length && entries < WorkspacesHistoryMainService.MAX_MACOS_DOCK_RECENT_ENTRIES_TOTAL; i++) {
			const loc = this.location(mru.files[i]);
			if (loc.scheme === Schemas.file) {
				const filePath = originalFSPath(loc);
				if (
					WorkspacesHistoryMainService.COMMON_FILES_FILTER.includes(basename(loc)) || // skip some well known file entries
					workspaceEntries.includes(filePath)											// prefer a workspace entry over a file entry (e.g. for .code-workspace)
				) {
					continue;
				}

				if (await Promises.exists(filePath)) {
					fileEntries.push(filePath);
					entries++;
				}
			}
		}

		// The apple guidelines (https://developer.apple.com/design/human-interface-guidelines/macos/menus/menu-anatomy/)
		// explain that most recent entries should appear close to the interaction by the user (e.g. close to the
		// mouse click). Most native macOS applications that add recent documents to the dock, show the most recent document
		// to the bottom (because the dock menu is not appearing from top to bottom, but from the bottom to the top). As such
		// we fill in the entries in reverse order so that the most recent shows up at the bottom of the menu.
		//
		// On top of that, the maximum number of documents can be configured by the user (defaults to 10). To ensure that
		// we are not failing to show the most recent entries, we start by adding files first (in reverse order of recency)
		// and then add folders (in reverse order of recency). Given that strategy, we can ensure that the most recent
		// N folders are always appearing, even if the limit is low (https://github.com/microsoft/vscode/issues/74788)
		fileEntries.reverse().forEach(fileEntry => app.addRecentDocument(fileEntry));
		workspaceEntries.reverse().forEach(workspaceEntry => app.addRecentDocument(workspaceEntry));
	}

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/workspaces/electron-main/workspacesMainService.ts]---
Location: vscode-main/src/vs/platform/workspaces/electron-main/workspacesMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AddFirstParameterToFunctions } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { IBackupMainService } from '../../backup/electron-main/backup.js';
import { IWindowsMainService } from '../../windows/electron-main/windows.js';
import { IEnterWorkspaceResult, IRecent, IRecentlyOpened, IWorkspaceFolderCreationData, IWorkspacesService } from '../common/workspaces.js';
import { IWorkspaceIdentifier } from '../../workspace/common/workspace.js';
import { IWorkspacesHistoryMainService } from './workspacesHistoryMainService.js';
import { IWorkspacesManagementMainService } from './workspacesManagementMainService.js';
import { IWorkspaceBackupInfo, IFolderBackupInfo } from '../../backup/common/backup.js';
import { Event } from '../../../base/common/event.js';

export class WorkspacesMainService implements AddFirstParameterToFunctions<IWorkspacesService, Promise<unknown> /* only methods, not events */, number /* window ID */> {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IWorkspacesManagementMainService private readonly workspacesManagementMainService: IWorkspacesManagementMainService,
		@IWindowsMainService private readonly windowsMainService: IWindowsMainService,
		@IWorkspacesHistoryMainService private readonly workspacesHistoryMainService: IWorkspacesHistoryMainService,
		@IBackupMainService private readonly backupMainService: IBackupMainService
	) {
		this.onDidChangeRecentlyOpened = this.workspacesHistoryMainService.onDidChangeRecentlyOpened;
	}

	//#region Workspace Management

	async enterWorkspace(windowId: number, path: URI): Promise<IEnterWorkspaceResult | undefined> {
		const window = this.windowsMainService.getWindowById(windowId);
		if (window) {
			return this.workspacesManagementMainService.enterWorkspace(window, this.windowsMainService.getWindows(), path);
		}

		return undefined;
	}

	createUntitledWorkspace(windowId: number, folders?: IWorkspaceFolderCreationData[], remoteAuthority?: string): Promise<IWorkspaceIdentifier> {
		return this.workspacesManagementMainService.createUntitledWorkspace(folders, remoteAuthority);
	}

	deleteUntitledWorkspace(windowId: number, workspace: IWorkspaceIdentifier): Promise<void> {
		return this.workspacesManagementMainService.deleteUntitledWorkspace(workspace);
	}

	getWorkspaceIdentifier(windowId: number, workspacePath: URI): Promise<IWorkspaceIdentifier> {
		return this.workspacesManagementMainService.getWorkspaceIdentifier(workspacePath);
	}

	//#endregion

	//#region Workspaces History

	readonly onDidChangeRecentlyOpened: Event<void>;

	getRecentlyOpened(windowId: number): Promise<IRecentlyOpened> {
		return this.workspacesHistoryMainService.getRecentlyOpened();
	}

	addRecentlyOpened(windowId: number, recents: IRecent[]): Promise<void> {
		return this.workspacesHistoryMainService.addRecentlyOpened(recents);
	}

	removeRecentlyOpened(windowId: number, paths: URI[]): Promise<void> {
		return this.workspacesHistoryMainService.removeRecentlyOpened(paths);
	}

	clearRecentlyOpened(windowId: number): Promise<void> {
		return this.workspacesHistoryMainService.clearRecentlyOpened();
	}

	//#endregion


	//#region Dirty Workspaces

	async getDirtyWorkspaces(): Promise<Array<IWorkspaceBackupInfo | IFolderBackupInfo>> {
		return this.backupMainService.getDirtyWorkspaces();
	}

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/workspaces/electron-main/workspacesManagementMainService.ts]---
Location: vscode-main/src/vs/platform/workspaces/electron-main/workspacesManagementMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import electron from 'electron';
import { Emitter, Event } from '../../../base/common/event.js';
import { parse } from '../../../base/common/json.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { dirname, join } from '../../../base/common/path.js';
import { basename, extUriBiasedIgnorePathCase, joinPath, originalFSPath } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { Promises } from '../../../base/node/pfs.js';
import { localize } from '../../../nls.js';
import { IBackupMainService } from '../../backup/electron-main/backup.js';
import { IDialogMainService } from '../../dialogs/electron-main/dialogMainService.js';
import { IEnvironmentMainService } from '../../environment/electron-main/environmentMainService.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { IUserDataProfilesMainService } from '../../userDataProfile/electron-main/userDataProfile.js';
import { ICodeWindow } from '../../window/electron-main/window.js';
import { findWindowOnWorkspaceOrFolder } from '../../windows/electron-main/windowsFinder.js';
import { isWorkspaceIdentifier, IWorkspaceIdentifier, IResolvedWorkspace, hasWorkspaceFileExtension, UNTITLED_WORKSPACE_NAME, isUntitledWorkspace } from '../../workspace/common/workspace.js';
import { getStoredWorkspaceFolder, IEnterWorkspaceResult, isStoredWorkspaceFolder, IStoredWorkspace, IStoredWorkspaceFolder, IUntitledWorkspaceInfo, IWorkspaceFolderCreationData, toWorkspaceFolders } from '../common/workspaces.js';
import { getWorkspaceIdentifier } from '../node/workspaces.js';

export const IWorkspacesManagementMainService = createDecorator<IWorkspacesManagementMainService>('workspacesManagementMainService');

export interface IWorkspaceEnteredEvent {
	readonly window: ICodeWindow;
	readonly workspace: IWorkspaceIdentifier;
}

export interface IWorkspacesManagementMainService {

	readonly _serviceBrand: undefined;

	readonly onDidDeleteUntitledWorkspace: Event<IWorkspaceIdentifier>;
	readonly onDidEnterWorkspace: Event<IWorkspaceEnteredEvent>;

	enterWorkspace(intoWindow: ICodeWindow, openedWindows: ICodeWindow[], path: URI): Promise<IEnterWorkspaceResult | undefined>;

	createUntitledWorkspace(folders?: IWorkspaceFolderCreationData[], remoteAuthority?: string): Promise<IWorkspaceIdentifier>;

	deleteUntitledWorkspace(workspace: IWorkspaceIdentifier): Promise<void>;

	getUntitledWorkspaces(): IUntitledWorkspaceInfo[];
	isUntitledWorkspace(workspace: IWorkspaceIdentifier): boolean;

	resolveLocalWorkspace(path: URI): Promise<IResolvedWorkspace | undefined>;

	getWorkspaceIdentifier(workspacePath: URI): Promise<IWorkspaceIdentifier>;
}

export class WorkspacesManagementMainService extends Disposable implements IWorkspacesManagementMainService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidDeleteUntitledWorkspace = this._register(new Emitter<IWorkspaceIdentifier>());
	readonly onDidDeleteUntitledWorkspace: Event<IWorkspaceIdentifier> = this._onDidDeleteUntitledWorkspace.event;

	private readonly _onDidEnterWorkspace = this._register(new Emitter<IWorkspaceEnteredEvent>());
	readonly onDidEnterWorkspace: Event<IWorkspaceEnteredEvent> = this._onDidEnterWorkspace.event;

	private readonly untitledWorkspacesHome: URI; // local URI that contains all untitled workspaces

	private untitledWorkspaces: IUntitledWorkspaceInfo[] = [];

	constructor(
		@IEnvironmentMainService private readonly environmentMainService: IEnvironmentMainService,
		@ILogService private readonly logService: ILogService,
		@IUserDataProfilesMainService private readonly userDataProfilesMainService: IUserDataProfilesMainService,
		@IBackupMainService private readonly backupMainService: IBackupMainService,
		@IDialogMainService private readonly dialogMainService: IDialogMainService
	) {
		super();

		this.untitledWorkspacesHome = this.environmentMainService.untitledWorkspacesHome;
	}

	async initialize(): Promise<void> {

		// Reset
		this.untitledWorkspaces = [];

		// Resolve untitled workspaces
		try {
			const untitledWorkspacePaths = (await Promises.readdir(this.untitledWorkspacesHome.with({ scheme: Schemas.file }).fsPath)).map(folder => joinPath(this.untitledWorkspacesHome, folder, UNTITLED_WORKSPACE_NAME));
			for (const untitledWorkspacePath of untitledWorkspacePaths) {
				const workspace = getWorkspaceIdentifier(untitledWorkspacePath);
				const resolvedWorkspace = await this.resolveLocalWorkspace(untitledWorkspacePath);
				if (!resolvedWorkspace) {
					await this.deleteUntitledWorkspace(workspace);
				} else {
					this.untitledWorkspaces.push({ workspace, remoteAuthority: resolvedWorkspace.remoteAuthority });
				}
			}
		} catch (error) {
			if (error.code !== 'ENOENT') {
				this.logService.warn(`Unable to read folders in ${this.untitledWorkspacesHome} (${error}).`);
			}
		}
	}

	resolveLocalWorkspace(uri: URI): Promise<IResolvedWorkspace | undefined> {
		return this.doResolveLocalWorkspace(uri, path => fs.promises.readFile(path, 'utf8'));
	}

	private doResolveLocalWorkspace(uri: URI, contentsFn: (path: string) => string): IResolvedWorkspace | undefined;
	private doResolveLocalWorkspace(uri: URI, contentsFn: (path: string) => Promise<string>): Promise<IResolvedWorkspace | undefined>;
	private doResolveLocalWorkspace(uri: URI, contentsFn: (path: string) => string | Promise<string>): IResolvedWorkspace | undefined | Promise<IResolvedWorkspace | undefined> {
		if (!this.isWorkspacePath(uri)) {
			return undefined; // does not look like a valid workspace config file
		}

		if (uri.scheme !== Schemas.file) {
			return undefined;
		}

		try {
			const contents = contentsFn(uri.fsPath);
			if (contents instanceof Promise) {
				return contents.then(value => this.doResolveWorkspace(uri, value), error => undefined /* invalid workspace */);
			} else {
				return this.doResolveWorkspace(uri, contents);
			}
		} catch {
			return undefined; // invalid workspace
		}
	}

	private isWorkspacePath(uri: URI): boolean {
		return isUntitledWorkspace(uri, this.environmentMainService) || hasWorkspaceFileExtension(uri);
	}

	private doResolveWorkspace(path: URI, contents: string): IResolvedWorkspace | undefined {
		try {
			const workspace = this.doParseStoredWorkspace(path, contents);
			const workspaceIdentifier = getWorkspaceIdentifier(path);
			return {
				id: workspaceIdentifier.id,
				configPath: workspaceIdentifier.configPath,
				folders: toWorkspaceFolders(workspace.folders, workspaceIdentifier.configPath, extUriBiasedIgnorePathCase),
				remoteAuthority: workspace.remoteAuthority,
				transient: workspace.transient
			};
		} catch (error) {
			this.logService.warn(error.toString());
		}

		return undefined;
	}

	private doParseStoredWorkspace(path: URI, contents: string): IStoredWorkspace {

		// Parse workspace file
		const storedWorkspace: IStoredWorkspace = parse(contents); // use fault tolerant parser

		// Filter out folders which do not have a path or uri set
		if (storedWorkspace && Array.isArray(storedWorkspace.folders)) {
			storedWorkspace.folders = storedWorkspace.folders.filter(folder => isStoredWorkspaceFolder(folder));
		} else {
			throw new Error(`${path.toString(true)} looks like an invalid workspace file.`);
		}

		return storedWorkspace;
	}

	async createUntitledWorkspace(folders?: IWorkspaceFolderCreationData[], remoteAuthority?: string): Promise<IWorkspaceIdentifier> {
		const { workspace, storedWorkspace } = this.newUntitledWorkspace(folders, remoteAuthority);
		const configPath = workspace.configPath.fsPath;

		await fs.promises.mkdir(dirname(configPath), { recursive: true });
		await Promises.writeFile(configPath, JSON.stringify(storedWorkspace, null, '\t'));

		this.untitledWorkspaces.push({ workspace, remoteAuthority });

		return workspace;
	}

	private newUntitledWorkspace(folders: IWorkspaceFolderCreationData[] = [], remoteAuthority?: string): { workspace: IWorkspaceIdentifier; storedWorkspace: IStoredWorkspace } {
		const randomId = (Date.now() + Math.round(Math.random() * 1000)).toString();
		const untitledWorkspaceConfigFolder = joinPath(this.untitledWorkspacesHome, randomId);
		const untitledWorkspaceConfigPath = joinPath(untitledWorkspaceConfigFolder, UNTITLED_WORKSPACE_NAME);

		const storedWorkspaceFolder: IStoredWorkspaceFolder[] = [];

		for (const folder of folders) {
			storedWorkspaceFolder.push(getStoredWorkspaceFolder(folder.uri, true, folder.name, untitledWorkspaceConfigFolder, extUriBiasedIgnorePathCase));
		}

		return {
			workspace: getWorkspaceIdentifier(untitledWorkspaceConfigPath),
			storedWorkspace: { folders: storedWorkspaceFolder, remoteAuthority }
		};
	}

	async getWorkspaceIdentifier(configPath: URI): Promise<IWorkspaceIdentifier> {
		return getWorkspaceIdentifier(configPath);
	}

	isUntitledWorkspace(workspace: IWorkspaceIdentifier): boolean {
		return isUntitledWorkspace(workspace.configPath, this.environmentMainService);
	}

	async deleteUntitledWorkspace(workspace: IWorkspaceIdentifier): Promise<void> {
		if (!this.isUntitledWorkspace(workspace)) {
			return; // only supported for untitled workspaces
		}

		// Delete from disk
		await this.doDeleteUntitledWorkspace(workspace);

		// unset workspace from profiles
		this.userDataProfilesMainService.unsetWorkspace(workspace);

		// Event
		this._onDidDeleteUntitledWorkspace.fire(workspace);
	}

	private async doDeleteUntitledWorkspace(workspace: IWorkspaceIdentifier): Promise<void> {
		const configPath = originalFSPath(workspace.configPath);
		try {

			// Delete Workspace
			await Promises.rm(dirname(configPath));

			// Mark Workspace Storage to be deleted
			const workspaceStoragePath = join(this.environmentMainService.workspaceStorageHome.with({ scheme: Schemas.file }).fsPath, workspace.id);
			if (await Promises.exists(workspaceStoragePath)) {
				await Promises.writeFile(join(workspaceStoragePath, 'obsolete'), '');
			}

			// Remove from list
			this.untitledWorkspaces = this.untitledWorkspaces.filter(untitledWorkspace => untitledWorkspace.workspace.id !== workspace.id);
		} catch (error) {
			this.logService.warn(`Unable to delete untitled workspace ${configPath} (${error}).`);
		}
	}

	getUntitledWorkspaces(): IUntitledWorkspaceInfo[] {
		return this.untitledWorkspaces;
	}

	async enterWorkspace(window: ICodeWindow, windows: ICodeWindow[], path: URI): Promise<IEnterWorkspaceResult | undefined> {
		if (!window?.win || !window.isReady) {
			return undefined; // return early if the window is not ready or disposed
		}

		const isValid = await this.isValidTargetWorkspacePath(window, windows, path);
		if (!isValid) {
			return undefined; // return early if the workspace is not valid
		}

		const result = await this.doEnterWorkspace(window, getWorkspaceIdentifier(path));
		if (!result) {
			return undefined;
		}

		// Emit as event
		this._onDidEnterWorkspace.fire({ window, workspace: result.workspace });

		return result;
	}

	private async isValidTargetWorkspacePath(window: ICodeWindow, windows: ICodeWindow[], workspacePath?: URI): Promise<boolean> {
		if (!workspacePath) {
			return true;
		}

		if (isWorkspaceIdentifier(window.openedWorkspace) && extUriBiasedIgnorePathCase.isEqual(window.openedWorkspace.configPath, workspacePath)) {
			return false; // window is already opened on a workspace with that path
		}

		// Prevent overwriting a workspace that is currently opened in another window
		if (findWindowOnWorkspaceOrFolder(windows, workspacePath)) {
			await this.dialogMainService.showMessageBox({
				type: 'info',
				buttons: [localize({ key: 'ok', comment: ['&& denotes a mnemonic'] }, "&&OK")],
				message: localize('workspaceOpenedMessage', "Unable to save workspace '{0}'", basename(workspacePath)),
				detail: localize('workspaceOpenedDetail', "The workspace is already opened in another window. Please close that window first and then try again.")
			}, electron.BrowserWindow.getFocusedWindow() ?? undefined);

			return false;
		}

		return true; // OK
	}

	private async doEnterWorkspace(window: ICodeWindow, workspace: IWorkspaceIdentifier): Promise<IEnterWorkspaceResult | undefined> {
		if (!window.config) {
			return undefined;
		}

		window.focus();

		// Register window for backups and migrate current backups over
		let backupPath: string | undefined;
		if (!window.config.extensionDevelopmentPath) {
			if (window.config.backupPath) {
				backupPath = await this.backupMainService.registerWorkspaceBackup({ workspace, remoteAuthority: window.remoteAuthority }, window.config.backupPath);
			} else {
				backupPath = this.backupMainService.registerWorkspaceBackup({ workspace, remoteAuthority: window.remoteAuthority });
			}
		}

		// if the window was opened on an untitled workspace, delete it.
		if (isWorkspaceIdentifier(window.openedWorkspace) && this.isUntitledWorkspace(window.openedWorkspace)) {
			await this.deleteUntitledWorkspace(window.openedWorkspace);
		}

		// Update window configuration properly based on transition to workspace
		window.config.workspace = workspace;
		window.config.backupPath = backupPath;

		return { workspace, backupPath };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/workspaces/node/workspaces.ts]---
Location: vscode-main/src/vs/platform/workspaces/node/workspaces.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createHash } from 'crypto';
import { Stats } from 'fs';
import { Schemas } from '../../../base/common/network.js';
import { isLinux, isMacintosh, isWindows } from '../../../base/common/platform.js';
import { originalFSPath } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { IEmptyWorkspaceIdentifier, ISingleFolderWorkspaceIdentifier, IWorkspaceIdentifier } from '../../workspace/common/workspace.js';

/**
 * Length of workspace identifiers that are not empty. Those are
 * MD5 hashes (128bits / 4 due to hex presentation).
 */
export const NON_EMPTY_WORKSPACE_ID_LENGTH = 128 / 4;

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// NOTE: DO NOT CHANGE. IDENTIFIERS HAVE TO REMAIN STABLE
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export function getWorkspaceIdentifier(configPath: URI): IWorkspaceIdentifier {

	function getWorkspaceId(): string {
		let configPathStr = configPath.scheme === Schemas.file ? originalFSPath(configPath) : configPath.toString();
		if (!isLinux) {
			configPathStr = configPathStr.toLowerCase(); // sanitize for platform file system
		}

		return createHash('md5').update(configPathStr).digest('hex'); // CodeQL [SM04514] Using MD5 to convert a file path to a fixed length
	}

	return {
		id: getWorkspaceId(),
		configPath
	};
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// NOTE: DO NOT CHANGE. IDENTIFIERS HAVE TO REMAIN STABLE
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export function getSingleFolderWorkspaceIdentifier(folderUri: URI): ISingleFolderWorkspaceIdentifier | undefined;
export function getSingleFolderWorkspaceIdentifier(folderUri: URI, folderStat: Stats): ISingleFolderWorkspaceIdentifier;
export function getSingleFolderWorkspaceIdentifier(folderUri: URI, folderStat?: Stats): ISingleFolderWorkspaceIdentifier | undefined {

	function getFolderId(): string | undefined {

		// Remote: produce a hash from the entire URI
		if (folderUri.scheme !== Schemas.file) {
			return createHash('md5').update(folderUri.toString()).digest('hex'); // CodeQL [SM04514] Using MD5 to convert a file path to a fixed length
		}

		// Local: we use the ctime as extra salt to the
		// identifier so that folders getting recreated
		// result in a different identifier. However, if
		// the stat is not provided we return `undefined`
		// to ensure identifiers are stable for the given
		// URI.

		if (!folderStat) {
			return undefined;
		}

		let ctime: number | undefined;
		if (isLinux) {
			ctime = folderStat.ino; // Linux: birthtime is ctime, so we cannot use it! We use the ino instead!
		} else if (isMacintosh) {
			ctime = folderStat.birthtime.getTime(); // macOS: birthtime is fine to use as is
		} else if (isWindows) {
			if (typeof folderStat.birthtimeMs === 'number') {
				ctime = Math.floor(folderStat.birthtimeMs); // Windows: fix precision issue in node.js 8.x to get 7.x results (see https://github.com/nodejs/node/issues/19897)
			} else {
				ctime = folderStat.birthtime.getTime();
			}
		}

		return createHash('md5').update(folderUri.fsPath).update(ctime ? String(ctime) : '').digest('hex'); // CodeQL [SM04514] Using MD5 to convert a file path to a fixed length
	}

	const folderId = getFolderId();
	if (typeof folderId === 'string') {
		return {
			id: folderId,
			uri: folderUri
		};
	}

	return undefined; // invalid folder
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// NOTE: DO NOT CHANGE. IDENTIFIERS HAVE TO REMAIN STABLE
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export function createEmptyWorkspaceIdentifier(): IEmptyWorkspaceIdentifier {
	return {
		id: (Date.now() + Math.round(Math.random() * 1000)).toString()
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/workspaces/test/common/workspaces.test.ts]---
Location: vscode-main/src/vs/platform/workspaces/test/common/workspaces.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ISerializedSingleFolderWorkspaceIdentifier, ISerializedWorkspaceIdentifier, reviveIdentifier, hasWorkspaceFileExtension, isWorkspaceIdentifier, isSingleFolderWorkspaceIdentifier, IEmptyWorkspaceIdentifier, toWorkspaceIdentifier, isEmptyWorkspaceIdentifier } from '../../../workspace/common/workspace.js';

suite('Workspaces', () => {

	test('reviveIdentifier', () => {
		const serializedWorkspaceIdentifier: ISerializedWorkspaceIdentifier = { id: 'id', configPath: URI.file('foo').toJSON() };
		assert.strictEqual(isWorkspaceIdentifier(reviveIdentifier(serializedWorkspaceIdentifier)), true);

		const serializedSingleFolderWorkspaceIdentifier: ISerializedSingleFolderWorkspaceIdentifier = { id: 'id', uri: URI.file('foo').toJSON() };
		assert.strictEqual(isSingleFolderWorkspaceIdentifier(reviveIdentifier(serializedSingleFolderWorkspaceIdentifier)), true);

		const serializedEmptyWorkspaceIdentifier: IEmptyWorkspaceIdentifier = { id: 'id' };
		assert.strictEqual(reviveIdentifier(serializedEmptyWorkspaceIdentifier).id, serializedEmptyWorkspaceIdentifier.id);
		assert.strictEqual(isWorkspaceIdentifier(serializedEmptyWorkspaceIdentifier), false);
		assert.strictEqual(isSingleFolderWorkspaceIdentifier(serializedEmptyWorkspaceIdentifier), false);

		assert.strictEqual(reviveIdentifier(undefined), undefined);
	});

	test('hasWorkspaceFileExtension', () => {
		assert.strictEqual(hasWorkspaceFileExtension('something'), false);
		assert.strictEqual(hasWorkspaceFileExtension('something.code-workspace'), true);
	});

	test('toWorkspaceIdentifier', () => {
		let identifier = toWorkspaceIdentifier({ id: 'id', folders: [] });
		assert.ok(identifier);
		assert.ok(isEmptyWorkspaceIdentifier(identifier));
		assert.ok(!isWorkspaceIdentifier(identifier));
		assert.ok(!isWorkspaceIdentifier(identifier));

		identifier = toWorkspaceIdentifier({ id: 'id', folders: [{ index: 0, name: 'test', toResource: () => URI.file('test'), uri: URI.file('test') }] });
		assert.ok(identifier);
		assert.ok(isSingleFolderWorkspaceIdentifier(identifier));
		assert.ok(!isWorkspaceIdentifier(identifier));

		identifier = toWorkspaceIdentifier({ id: 'id', configuration: URI.file('test.code-workspace'), folders: [] });
		assert.ok(identifier);
		assert.ok(!isSingleFolderWorkspaceIdentifier(identifier));
		assert.ok(isWorkspaceIdentifier(identifier));
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/workspaces/test/electron-main/workspacesManagementMainService.test.ts]---
Location: vscode-main/src/vs/platform/workspaces/test/electron-main/workspacesManagementMainService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import { isUNC, toSlashes } from '../../../../base/common/extpath.js';
import { normalizeDriveLetter } from '../../../../base/common/labels.js';
import * as path from '../../../../base/common/path.js';
import { isWindows } from '../../../../base/common/platform.js';
import { extUriBiasedIgnorePathCase } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import * as pfs from '../../../../base/node/pfs.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { flakySuite, getRandomTestPath } from '../../../../base/test/node/testUtils.js';
import { IWorkspaceBackupInfo, IFolderBackupInfo } from '../../../backup/common/backup.js';
import { IBackupMainService } from '../../../backup/electron-main/backup.js';
import { IEmptyWindowBackupInfo } from '../../../backup/node/backup.js';
import { INativeOpenDialogOptions } from '../../../dialogs/common/dialogs.js';
import { IDialogMainService } from '../../../dialogs/electron-main/dialogMainService.js';
import { EnvironmentMainService } from '../../../environment/electron-main/environmentMainService.js';
import { OPTIONS, parseArgs } from '../../../environment/node/argv.js';
import { FileService } from '../../../files/common/fileService.js';
import { NullLogService } from '../../../log/common/log.js';
import product from '../../../product/common/product.js';
import { IProductService } from '../../../product/common/productService.js';
import { SaveStrategy, StateService } from '../../../state/node/stateService.js';
import { UriIdentityService } from '../../../uriIdentity/common/uriIdentityService.js';
import { UserDataProfilesMainService } from '../../../userDataProfile/electron-main/userDataProfile.js';
import { IRawFileWorkspaceFolder, IRawUriWorkspaceFolder, WORKSPACE_EXTENSION } from '../../../workspace/common/workspace.js';
import { IStoredWorkspace, IStoredWorkspaceFolder, IWorkspaceFolderCreationData, rewriteWorkspaceFileForNewLocation } from '../../common/workspaces.js';
import { WorkspacesManagementMainService } from '../../electron-main/workspacesManagementMainService.js';

flakySuite('WorkspacesManagementMainService', () => {

	class TestDialogMainService implements IDialogMainService {

		declare readonly _serviceBrand: undefined;

		pickFileFolder(options: INativeOpenDialogOptions, window?: Electron.BrowserWindow | undefined): Promise<string[] | undefined> { throw new Error('Method not implemented.'); }
		pickFolder(options: INativeOpenDialogOptions, window?: Electron.BrowserWindow | undefined): Promise<string[] | undefined> { throw new Error('Method not implemented.'); }
		pickFile(options: INativeOpenDialogOptions, window?: Electron.BrowserWindow | undefined): Promise<string[] | undefined> { throw new Error('Method not implemented.'); }
		pickWorkspace(options: INativeOpenDialogOptions, window?: Electron.BrowserWindow | undefined): Promise<string[] | undefined> { throw new Error('Method not implemented.'); }
		showMessageBox(options: Electron.MessageBoxOptions, window?: Electron.BrowserWindow | undefined): Promise<Electron.MessageBoxReturnValue> { throw new Error('Method not implemented.'); }
		showSaveDialog(options: Electron.SaveDialogOptions, window?: Electron.BrowserWindow | undefined): Promise<Electron.SaveDialogReturnValue> { throw new Error('Method not implemented.'); }
		showOpenDialog(options: Electron.OpenDialogOptions, window?: Electron.BrowserWindow | undefined): Promise<Electron.OpenDialogReturnValue> { throw new Error('Method not implemented.'); }
	}

	class TestBackupMainService implements IBackupMainService {

		declare readonly _serviceBrand: undefined;

		isHotExitEnabled(): boolean { throw new Error('Method not implemented.'); }
		getEmptyWindowBackups(): IEmptyWindowBackupInfo[] { throw new Error('Method not implemented.'); }
		registerWorkspaceBackup(workspaceInfo: IWorkspaceBackupInfo): string;
		registerWorkspaceBackup(workspaceInfo: IWorkspaceBackupInfo, migrateFrom: string): Promise<string>;
		registerWorkspaceBackup(workspaceInfo: unknown, migrateFrom?: unknown): string | Promise<string> { throw new Error('Method not implemented.'); }
		registerFolderBackup(folder: IFolderBackupInfo): string { throw new Error('Method not implemented.'); }
		registerEmptyWindowBackup(empty: IEmptyWindowBackupInfo): string { throw new Error('Method not implemented.'); }
		async getDirtyWorkspaces(): Promise<(IWorkspaceBackupInfo | IFolderBackupInfo)[]> { return []; }
	}

	function createUntitledWorkspace(folders: string[], names?: string[]) {
		return service.createUntitledWorkspace(folders.map((folder, index) => ({ uri: URI.file(folder), name: names ? names[index] : undefined } as IWorkspaceFolderCreationData)));
	}

	function createWorkspace(workspaceConfigPath: string, folders: (string | URI)[], names?: string[]): void {
		const ws: IStoredWorkspace = {
			folders: []
		};

		for (let i = 0; i < folders.length; i++) {
			const f = folders[i];
			const s: IStoredWorkspaceFolder = f instanceof URI ? { uri: f.toString() } : { path: f };
			if (names) {
				s.name = names[i];
			}
			ws.folders.push(s);
		}

		fs.writeFileSync(workspaceConfigPath, JSON.stringify(ws));
	}

	let testDir: string;
	let untitledWorkspacesHomePath: string;
	let environmentMainService: EnvironmentMainService;
	let service: WorkspacesManagementMainService;

	const cwd = process.cwd();
	const tmpDir = os.tmpdir();

	setup(async () => {
		testDir = getRandomTestPath(tmpDir, 'vsctests', 'workspacesmanagementmainservice');
		untitledWorkspacesHomePath = path.join(testDir, 'Workspaces');

		const productService: IProductService = { _serviceBrand: undefined, ...product };

		environmentMainService = new class TestEnvironmentService extends EnvironmentMainService {

			constructor() {
				super(parseArgs(process.argv, OPTIONS), productService);
			}

			override get untitledWorkspacesHome(): URI {
				return URI.file(untitledWorkspacesHomePath);
			}
		};

		const logService = new NullLogService();
		const fileService = new FileService(logService);
		service = new WorkspacesManagementMainService(environmentMainService, logService, new UserDataProfilesMainService(new StateService(SaveStrategy.DELAYED, environmentMainService, logService, fileService), new UriIdentityService(fileService), environmentMainService, fileService, logService), new TestBackupMainService(), new TestDialogMainService());

		return fs.promises.mkdir(untitledWorkspacesHomePath, { recursive: true });
	});

	teardown(() => {
		service.dispose();

		return pfs.Promises.rm(testDir);
	});

	function assertPathEquals(pathInWorkspaceFile: string, pathOnDisk: string): void {
		if (isWindows) {
			pathInWorkspaceFile = normalizeDriveLetter(pathInWorkspaceFile);
			pathOnDisk = normalizeDriveLetter(pathOnDisk);
			if (!isUNC(pathOnDisk)) {
				pathOnDisk = toSlashes(pathOnDisk); // workspace file is using slashes for all paths except where mandatory
			}
		}

		assert.strictEqual(pathInWorkspaceFile, pathOnDisk);
	}

	function assertEqualURI(u1: URI, u2: URI): void {
		assert.strictEqual(u1.toString(), u2.toString());
	}

	test('createWorkspace (folders)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir]);
		assert.ok(workspace);
		assert.ok(fs.existsSync(workspace.configPath.fsPath));
		assert.ok(service.isUntitledWorkspace(workspace));

		const ws = (JSON.parse(fs.readFileSync(workspace.configPath.fsPath).toString()) as IStoredWorkspace);
		assert.strictEqual(ws.folders.length, 2);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[0]).path, cwd);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[1]).path, tmpDir);
		assert.ok(!(<IRawFileWorkspaceFolder>ws.folders[0]).name);
		assert.ok(!(<IRawFileWorkspaceFolder>ws.folders[1]).name);
	});

	test('createWorkspace (folders with name)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir], ['currentworkingdirectory', 'tempdir']);
		assert.ok(workspace);
		assert.ok(fs.existsSync(workspace.configPath.fsPath));
		assert.ok(service.isUntitledWorkspace(workspace));

		const ws = (JSON.parse(fs.readFileSync(workspace.configPath.fsPath).toString()) as IStoredWorkspace);
		assert.strictEqual(ws.folders.length, 2);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[0]).path, cwd);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[1]).path, tmpDir);
		assert.strictEqual((<IRawFileWorkspaceFolder>ws.folders[0]).name, 'currentworkingdirectory');
		assert.strictEqual((<IRawFileWorkspaceFolder>ws.folders[1]).name, 'tempdir');
	});

	test('createUntitledWorkspace (folders as other resource URIs)', async () => {
		const folder1URI = URI.parse('myscheme://server/work/p/f1');
		const folder2URI = URI.parse('myscheme://server/work/o/f3');

		const workspace = await service.createUntitledWorkspace([{ uri: folder1URI }, { uri: folder2URI }], 'server');
		assert.ok(workspace);
		assert.ok(fs.existsSync(workspace.configPath.fsPath));
		assert.ok(service.isUntitledWorkspace(workspace));

		const ws = (JSON.parse(fs.readFileSync(workspace.configPath.fsPath).toString()) as IStoredWorkspace);
		assert.strictEqual(ws.folders.length, 2);
		assert.strictEqual((<IRawUriWorkspaceFolder>ws.folders[0]).uri, folder1URI.toString(true));
		assert.strictEqual((<IRawUriWorkspaceFolder>ws.folders[1]).uri, folder2URI.toString(true));
		assert.ok(!(<IRawFileWorkspaceFolder>ws.folders[0]).name);
		assert.ok(!(<IRawFileWorkspaceFolder>ws.folders[1]).name);
		assert.strictEqual(ws.remoteAuthority, 'server');
	});

	test('resolveWorkspace', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir]);
		assert.ok(await service.resolveLocalWorkspace(workspace.configPath));

		// make it a valid workspace path
		const newPath = path.join(path.dirname(workspace.configPath.fsPath), `workspace.${WORKSPACE_EXTENSION}`);
		fs.renameSync(workspace.configPath.fsPath, newPath);
		workspace.configPath = URI.file(newPath);

		const resolved = await service.resolveLocalWorkspace(workspace.configPath);
		assert.strictEqual(2, resolved!.folders.length);
		assertEqualURI(resolved!.configPath, workspace.configPath);
		assert.ok(resolved!.id);
		fs.writeFileSync(workspace.configPath.fsPath, JSON.stringify({ something: 'something' })); // invalid workspace

		const resolvedInvalid = await service.resolveLocalWorkspace(workspace.configPath);
		assert.ok(!resolvedInvalid);

		fs.writeFileSync(workspace.configPath.fsPath, JSON.stringify({ transient: true, folders: [] })); // transient worksapce
		const resolvedTransient = await service.resolveLocalWorkspace(workspace.configPath);
		assert.ok(resolvedTransient?.transient);
	});

	test('resolveWorkspace (support relative paths)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir]);
		fs.writeFileSync(workspace.configPath.fsPath, JSON.stringify({ folders: [{ path: './ticino-playground/lib' }] }));

		const resolved = await service.resolveLocalWorkspace(workspace.configPath);
		assertEqualURI(resolved!.folders[0].uri, URI.file(path.join(path.dirname(workspace.configPath.fsPath), 'ticino-playground', 'lib')));
	});

	test('resolveWorkspace (support relative paths #2)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir]);
		fs.writeFileSync(workspace.configPath.fsPath, JSON.stringify({ folders: [{ path: './ticino-playground/lib/../other' }] }));

		const resolved = await service.resolveLocalWorkspace(workspace.configPath);
		assertEqualURI(resolved!.folders[0].uri, URI.file(path.join(path.dirname(workspace.configPath.fsPath), 'ticino-playground', 'other')));
	});

	test('resolveWorkspace (support relative paths #3)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir]);
		fs.writeFileSync(workspace.configPath.fsPath, JSON.stringify({ folders: [{ path: 'ticino-playground/lib' }] }));

		const resolved = await service.resolveLocalWorkspace(workspace.configPath);
		assertEqualURI(resolved!.folders[0].uri, URI.file(path.join(path.dirname(workspace.configPath.fsPath), 'ticino-playground', 'lib')));
	});

	test('resolveWorkspace (support invalid JSON via fault tolerant parsing)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir]);
		fs.writeFileSync(workspace.configPath.fsPath, '{ "folders": [ { "path": "./ticino-playground/lib" } , ] }'); // trailing comma

		const resolved = await service.resolveLocalWorkspace(workspace.configPath);
		assertEqualURI(resolved!.folders[0].uri, URI.file(path.join(path.dirname(workspace.configPath.fsPath), 'ticino-playground', 'lib')));
	});

	test('rewriteWorkspaceFileForNewLocation', async () => {
		const folder1 = cwd;  // absolute path because outside of tmpDir
		const tmpInsideDir = path.join(tmpDir, 'inside');

		const firstConfigPath = path.join(tmpDir, 'myworkspace0.code-workspace');
		createWorkspace(firstConfigPath, [folder1, 'inside', path.join('inside', 'somefolder')]);
		const origContent = fs.readFileSync(firstConfigPath).toString();

		let origConfigPath = URI.file(firstConfigPath);
		let workspaceConfigPath = URI.file(path.join(tmpDir, 'inside', 'myworkspace1.code-workspace'));
		let newContent = rewriteWorkspaceFileForNewLocation(origContent, origConfigPath, false, workspaceConfigPath, extUriBiasedIgnorePathCase);
		let ws = (JSON.parse(newContent) as IStoredWorkspace);
		assert.strictEqual(ws.folders.length, 3);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[0]).path, folder1); // absolute path because outside of tmpdir
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[1]).path, '.');
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[2]).path, 'somefolder');

		origConfigPath = workspaceConfigPath;
		workspaceConfigPath = URI.file(path.join(tmpDir, 'myworkspace2.code-workspace'));
		newContent = rewriteWorkspaceFileForNewLocation(newContent, origConfigPath, false, workspaceConfigPath, extUriBiasedIgnorePathCase);
		ws = (JSON.parse(newContent) as IStoredWorkspace);
		assert.strictEqual(ws.folders.length, 3);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[0]).path, folder1);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[1]).path, 'inside');
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[2]).path, 'inside/somefolder');

		origConfigPath = workspaceConfigPath;
		workspaceConfigPath = URI.file(path.join(tmpDir, 'other', 'myworkspace2.code-workspace'));
		newContent = rewriteWorkspaceFileForNewLocation(newContent, origConfigPath, false, workspaceConfigPath, extUriBiasedIgnorePathCase);
		ws = (JSON.parse(newContent) as IStoredWorkspace);
		assert.strictEqual(ws.folders.length, 3);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[0]).path, folder1);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[1]).path, '../inside');
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[2]).path, '../inside/somefolder');

		origConfigPath = workspaceConfigPath;
		workspaceConfigPath = URI.parse('foo://foo/bar/myworkspace2.code-workspace');
		newContent = rewriteWorkspaceFileForNewLocation(newContent, origConfigPath, false, workspaceConfigPath, extUriBiasedIgnorePathCase);
		ws = (JSON.parse(newContent) as IStoredWorkspace);
		assert.strictEqual(ws.folders.length, 3);
		assert.strictEqual((<IRawUriWorkspaceFolder>ws.folders[0]).uri, URI.file(folder1).toString(true));
		assert.strictEqual((<IRawUriWorkspaceFolder>ws.folders[1]).uri, URI.file(tmpInsideDir).toString(true));
		assert.strictEqual((<IRawUriWorkspaceFolder>ws.folders[2]).uri, URI.file(path.join(tmpInsideDir, 'somefolder')).toString(true));

		fs.unlinkSync(firstConfigPath);
	});

	test('rewriteWorkspaceFileForNewLocation (preserves comments)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir, path.join(tmpDir, 'somefolder')]);
		const workspaceConfigPath = URI.file(path.join(tmpDir, `myworkspace.${Date.now()}.${WORKSPACE_EXTENSION}`));

		let origContent = fs.readFileSync(workspace.configPath.fsPath).toString();
		origContent = `// this is a comment\n${origContent}`;

		const newContent = rewriteWorkspaceFileForNewLocation(origContent, workspace.configPath, false, workspaceConfigPath, extUriBiasedIgnorePathCase);
		assert.strictEqual(0, newContent.indexOf('// this is a comment'));
		await service.deleteUntitledWorkspace(workspace);
	});

	test('rewriteWorkspaceFileForNewLocation (preserves forward slashes)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir, path.join(tmpDir, 'somefolder')]);
		const workspaceConfigPath = URI.file(path.join(tmpDir, `myworkspace.${Date.now()}.${WORKSPACE_EXTENSION}`));

		let origContent = fs.readFileSync(workspace.configPath.fsPath).toString();
		origContent = origContent.replace(/[\\]/g, '/'); // convert backslash to slash

		const newContent = rewriteWorkspaceFileForNewLocation(origContent, workspace.configPath, false, workspaceConfigPath, extUriBiasedIgnorePathCase);
		const ws = (JSON.parse(newContent) as IStoredWorkspace);
		assert.ok(ws.folders.every(f => (<IRawFileWorkspaceFolder>f).path.indexOf('\\') < 0));
		await service.deleteUntitledWorkspace(workspace);
	});

	(!isWindows ? test.skip : test)('rewriteWorkspaceFileForNewLocation (unc paths)', async () => {
		const workspaceLocation = path.join(tmpDir, 'wsloc');
		const folder1Location = 'x:\\foo';
		const folder2Location = '\\\\server\\share2\\some\\path';
		const folder3Location = path.join(workspaceLocation, 'inner', 'more');

		const workspace = await createUntitledWorkspace([folder1Location, folder2Location, folder3Location]);
		const workspaceConfigPath = URI.file(path.join(workspaceLocation, `myworkspace.${Date.now()}.${WORKSPACE_EXTENSION}`));
		const origContent = fs.readFileSync(workspace.configPath.fsPath).toString();
		const newContent = rewriteWorkspaceFileForNewLocation(origContent, workspace.configPath, true, workspaceConfigPath, extUriBiasedIgnorePathCase);
		const ws = (JSON.parse(newContent) as IStoredWorkspace);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[0]).path, folder1Location);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[1]).path, folder2Location);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[2]).path, 'inner/more');

		await service.deleteUntitledWorkspace(workspace);
	});

	test('deleteUntitledWorkspace (untitled)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir]);
		assert.ok(fs.existsSync(workspace.configPath.fsPath));
		await service.deleteUntitledWorkspace(workspace);
		assert.ok(!fs.existsSync(workspace.configPath.fsPath));
	});

	test('deleteUntitledWorkspace (saved)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir]);
		await service.deleteUntitledWorkspace(workspace);
	});

	test('getUntitledWorkspace', async function () {
		await service.initialize();
		let untitled = service.getUntitledWorkspaces();
		assert.strictEqual(untitled.length, 0);

		const untitledOne = await createUntitledWorkspace([cwd, tmpDir]);
		assert.ok(fs.existsSync(untitledOne.configPath.fsPath));

		await service.initialize();
		untitled = service.getUntitledWorkspaces();
		assert.strictEqual(1, untitled.length);
		assert.strictEqual(untitledOne.id, untitled[0].workspace.id);

		await service.deleteUntitledWorkspace(untitledOne);
		await service.initialize();
		untitled = service.getUntitledWorkspaces();
		assert.strictEqual(0, untitled.length);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/workspaces/test/node/workspaces.test.ts]---
Location: vscode-main/src/vs/platform/workspaces/test/node/workspaces.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import * as path from '../../../../base/common/path.js';
import { isWindows } from '../../../../base/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import * as pfs from '../../../../base/node/pfs.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { flakySuite, getRandomTestPath } from '../../../../base/test/node/testUtils.js';
import { getSingleFolderWorkspaceIdentifier, getWorkspaceIdentifier } from '../../node/workspaces.js';

flakySuite('Workspaces', () => {

	let testDir: string;

	const tmpDir = os.tmpdir();

	setup(async () => {
		testDir = getRandomTestPath(tmpDir, 'vsctests', 'workspacesmanagementmainservice');

		return fs.promises.mkdir(testDir, { recursive: true });
	});

	teardown(() => {
		return pfs.Promises.rm(testDir);
	});

	test('getSingleWorkspaceIdentifier', async function () {
		const nonLocalUri = URI.parse('myscheme://server/work/p/f1');
		const nonLocalUriId = getSingleFolderWorkspaceIdentifier(nonLocalUri);
		assert.ok(nonLocalUriId?.id);

		const localNonExistingUri = URI.file(path.join(testDir, 'f1'));
		const localNonExistingUriId = getSingleFolderWorkspaceIdentifier(localNonExistingUri);
		assert.ok(!localNonExistingUriId);

		fs.mkdirSync(path.join(testDir, 'f1'));

		const localExistingUri = URI.file(path.join(testDir, 'f1'));
		const localExistingUriId = getSingleFolderWorkspaceIdentifier(localExistingUri, fs.statSync(localExistingUri.fsPath));
		assert.ok(localExistingUriId?.id);
	});

	test('workspace identifiers are stable', function () {

		// workspace identifier (local)
		assert.strictEqual(getWorkspaceIdentifier(URI.file('/hello/test')).id, isWindows  /* slash vs backslash */ ? '9f3efb614e2cd7924e4b8076e6c72233' : 'e36736311be12ff6d695feefe415b3e8');

		// single folder identifier (local)
		const fakeStat = {
			ino: 1611312115129,
			birthtimeMs: 1611312115129,
			birthtime: new Date(1611312115129)
		};
		assert.strictEqual(getSingleFolderWorkspaceIdentifier(URI.file('/hello/test'), fakeStat as fs.Stats)?.id, isWindows /* slash vs backslash */ ? '9a8441e897e5174fa388bc7ef8f7a710' : '1d726b3d516dc2a6d343abf4797eaaef');

		// workspace identifier (remote)
		assert.strictEqual(getWorkspaceIdentifier(URI.parse('vscode-remote:/hello/test')).id, '786de4f224d57691f218dc7f31ee2ee3');

		// single folder identifier (remote)
		assert.strictEqual(getSingleFolderWorkspaceIdentifier(URI.parse('vscode-remote:/hello/test'))?.id, '786de4f224d57691f218dc7f31ee2ee3');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/workspaces/test/node/workspacesHistoryStorage.test.ts]---
Location: vscode-main/src/vs/platform/workspaces/test/node/workspacesHistoryStorage.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { tmpdir } from 'os';
import { join } from '../../../../base/common/path.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { NullLogService } from '../../../log/common/log.js';
import { IWorkspaceIdentifier } from '../../../workspace/common/workspace.js';
import { IRecentFolder, IRecentlyOpened, IRecentWorkspace, isRecentFolder, restoreRecentlyOpened, toStoreData } from '../../common/workspaces.js';

suite('History Storage', () => {

	function toWorkspace(uri: URI): IWorkspaceIdentifier {
		return {
			id: '1234',
			configPath: uri
		};
	}
	function assertEqualURI(u1: URI | undefined, u2: URI | undefined, message?: string): void {
		assert.strictEqual(u1 && u1.toString(), u2 && u2.toString(), message);
	}

	function assertEqualWorkspace(w1: IWorkspaceIdentifier | undefined, w2: IWorkspaceIdentifier | undefined, message?: string): void {
		if (!w1 || !w2) {
			assert.strictEqual(w1, w2, message);
			return;
		}
		assert.strictEqual(w1.id, w2.id, message);
		assertEqualURI(w1.configPath, w2.configPath, message);
	}

	function assertEqualRecentlyOpened(actual: IRecentlyOpened, expected: IRecentlyOpened, message?: string) {
		assert.strictEqual(actual.files.length, expected.files.length, message);
		for (let i = 0; i < actual.files.length; i++) {
			assertEqualURI(actual.files[i].fileUri, expected.files[i].fileUri, message);
			assert.strictEqual(actual.files[i].label, expected.files[i].label);
			assert.strictEqual(actual.files[i].remoteAuthority, expected.files[i].remoteAuthority);
		}
		assert.strictEqual(actual.workspaces.length, expected.workspaces.length, message);
		for (let i = 0; i < actual.workspaces.length; i++) {
			const expectedRecent = expected.workspaces[i];
			const actualRecent = actual.workspaces[i];
			if (isRecentFolder(actualRecent)) {
				assertEqualURI(actualRecent.folderUri, (<IRecentFolder>expectedRecent).folderUri, message);
			} else {
				assertEqualWorkspace(actualRecent.workspace, (<IRecentWorkspace>expectedRecent).workspace, message);
			}
			assert.strictEqual(actualRecent.label, expectedRecent.label);
			assert.strictEqual(actualRecent.remoteAuthority, actualRecent.remoteAuthority);
		}
	}

	function assertRestoring(state: IRecentlyOpened, message?: string) {
		const stored = toStoreData(state);
		const restored = restoreRecentlyOpened(stored, new NullLogService());
		assertEqualRecentlyOpened(state, restored, message);
	}

	const testWSPath = URI.file(join(tmpdir(), 'windowStateTest', 'test.code-workspace'));
	const testFileURI = URI.file(join(tmpdir(), 'windowStateTest', 'testFile.txt'));
	const testFolderURI = URI.file(join(tmpdir(), 'windowStateTest', 'testFolder'));

	const testRemoteFolderURI = URI.parse('foo://bar/c/e');
	const testRemoteFileURI = URI.parse('foo://bar/c/d.txt');
	const testRemoteWSURI = URI.parse('foo://bar/c/test.code-workspace');

	test('storing and restoring', () => {
		let ro: IRecentlyOpened;
		ro = {
			files: [],
			workspaces: []
		};
		assertRestoring(ro, 'empty');
		ro = {
			files: [{ fileUri: testFileURI }],
			workspaces: []
		};
		assertRestoring(ro, 'file');
		ro = {
			files: [],
			workspaces: [{ folderUri: testFolderURI }]
		};
		assertRestoring(ro, 'folder');
		ro = {
			files: [],
			workspaces: [{ workspace: toWorkspace(testWSPath) }, { folderUri: testFolderURI }]
		};
		assertRestoring(ro, 'workspaces and folders');

		ro = {
			files: [{ fileUri: testRemoteFileURI }],
			workspaces: [{ workspace: toWorkspace(testRemoteWSURI) }, { folderUri: testRemoteFolderURI }]
		};
		assertRestoring(ro, 'remote workspaces and folders');
		ro = {
			files: [{ label: 'abc', fileUri: testFileURI }],
			workspaces: [{ label: 'def', workspace: toWorkspace(testWSPath) }, { folderUri: testRemoteFolderURI }]
		};
		assertRestoring(ro, 'labels');
		ro = {
			files: [{ label: 'abc', remoteAuthority: 'test', fileUri: testRemoteFileURI }],
			workspaces: [{ label: 'def', remoteAuthority: 'test', workspace: toWorkspace(testWSPath) }, { folderUri: testRemoteFolderURI, remoteAuthority: 'test' }]
		};
		assertRestoring(ro, 'authority');
	});

	test('open 1_55', () => {
		const v1_55 = `{
			"entries": [
				{
					"folderUri": "foo://bar/23/43",
					"remoteAuthority": "test+test"
				},
				{
					"workspace": {
						"id": "53b714b46ef1a2d4346568b4f591028c",
						"configPath": "file:///home/user/workspaces/testing/custom.code-workspace"
					}
				},
				{
					"folderUri": "file:///home/user/workspaces/testing/folding",
					"label": "abc"
				},
				{
					"fileUri": "file:///home/user/.config/code-oss-dev/storage.json",
					"label": "def"
				}
			]
		}`;

		const windowsState = restoreRecentlyOpened(JSON.parse(v1_55), new NullLogService());
		const expected: IRecentlyOpened = {
			files: [{ label: 'def', fileUri: URI.parse('file:///home/user/.config/code-oss-dev/storage.json') }],
			workspaces: [
				{ folderUri: URI.parse('foo://bar/23/43'), remoteAuthority: 'test+test' },
				{ workspace: { id: '53b714b46ef1a2d4346568b4f591028c', configPath: URI.parse('file:///home/user/workspaces/testing/custom.code-workspace') } },
				{ label: 'abc', folderUri: URI.parse('file:///home/user/workspaces/testing/folding') }
			]
		};

		assertEqualRecentlyOpened(windowsState, expected, 'v1_33');
	});

	test('toStoreData drops label if it matches path', () => {
		const actual = toStoreData({
			workspaces: [],
			files: [{
				fileUri: URI.parse('file:///foo/bar/test.txt'),
				label: '/foo/bar/test.txt',
				remoteAuthority: undefined
			}]
		});
		assert.deepStrictEqual(actual, {
			entries: [{
				fileUri: 'file:///foo/bar/test.txt',
				label: undefined,
				remoteAuthority: undefined
			}]
		});
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/server/node/extensionHostConnection.ts]---
Location: vscode-main/src/vs/server/node/extensionHostConnection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as cp from 'child_process';
import * as net from 'net';
import { VSBuffer } from '../../base/common/buffer.js';
import { Emitter, Event } from '../../base/common/event.js';
import { Disposable, DisposableStore, toDisposable } from '../../base/common/lifecycle.js';
import { FileAccess } from '../../base/common/network.js';
import { delimiter, join } from '../../base/common/path.js';
import { IProcessEnvironment, isWindows } from '../../base/common/platform.js';
import { removeDangerousEnvVariables } from '../../base/common/processes.js';
import { createRandomIPCHandle, NodeSocket, WebSocketNodeSocket } from '../../base/parts/ipc/node/ipc.net.js';
import { IConfigurationService } from '../../platform/configuration/common/configuration.js';
import { ILogService } from '../../platform/log/common/log.js';
import { IRemoteExtensionHostStartParams } from '../../platform/remote/common/remoteAgentConnection.js';
import { getResolvedShellEnv } from '../../platform/shell/node/shellEnv.js';
import { IExtensionHostStatusService } from './extensionHostStatusService.js';
import { getNLSConfiguration } from './remoteLanguagePacks.js';
import { IServerEnvironmentService } from './serverEnvironmentService.js';
import { IPCExtHostConnection, SocketExtHostConnection, writeExtHostConnection } from '../../workbench/services/extensions/common/extensionHostEnv.js';
import { IExtHostReadyMessage, IExtHostReduceGraceTimeMessage, IExtHostSocketMessage } from '../../workbench/services/extensions/common/extensionHostProtocol.js';

export async function buildUserEnvironment(startParamsEnv: { [key: string]: string | null } = {}, withUserShellEnvironment: boolean, language: string, environmentService: IServerEnvironmentService, logService: ILogService, configurationService: IConfigurationService): Promise<IProcessEnvironment> {
	const nlsConfig = await getNLSConfiguration(language, environmentService.userDataPath);

	let userShellEnv: typeof process.env = {};
	if (withUserShellEnvironment) {
		try {
			userShellEnv = await getResolvedShellEnv(configurationService, logService, environmentService.args, process.env);
		} catch (error) {
			logService.error('ExtensionHostConnection#buildUserEnvironment resolving shell environment failed', error);
		}
	}

	const processEnv = process.env;

	const env: IProcessEnvironment = {
		...processEnv,
		...userShellEnv,
		...{
			VSCODE_ESM_ENTRYPOINT: 'vs/workbench/api/node/extensionHostProcess',
			VSCODE_HANDLES_UNCAUGHT_ERRORS: 'true',
			VSCODE_NLS_CONFIG: JSON.stringify(nlsConfig)
		},
		...startParamsEnv
	};

	const binFolder = environmentService.isBuilt ? join(environmentService.appRoot, 'bin') : join(environmentService.appRoot, 'resources', 'server', 'bin-dev');
	const remoteCliBinFolder = join(binFolder, 'remote-cli'); // contains the `code` command that can talk to the remote server

	let PATH = readCaseInsensitive(env, 'PATH');
	if (PATH) {
		PATH = remoteCliBinFolder + delimiter + PATH;
	} else {
		PATH = remoteCliBinFolder;
	}
	setCaseInsensitive(env, 'PATH', PATH);

	if (!environmentService.args['without-browser-env-var']) {
		env.BROWSER = join(binFolder, 'helpers', isWindows ? 'browser.cmd' : 'browser.sh'); // a command that opens a browser on the local machine
	}

	env.VSCODE_RECONNECTION_GRACE_TIME = String(environmentService.reconnectionGraceTime);
	logService.trace(`[reconnection-grace-time] Setting VSCODE_RECONNECTION_GRACE_TIME env var for extension host: ${environmentService.reconnectionGraceTime}ms (${Math.floor(environmentService.reconnectionGraceTime / 1000)}s)`);

	removeNulls(env);
	return env;
}

class ConnectionData {
	constructor(
		public readonly socket: NodeSocket | WebSocketNodeSocket,
		public readonly initialDataChunk: VSBuffer
	) { }

	public socketDrain(): Promise<void> {
		return this.socket.drain();
	}

	public toIExtHostSocketMessage(): IExtHostSocketMessage {

		let skipWebSocketFrames: boolean;
		let permessageDeflate: boolean;
		let inflateBytes: VSBuffer;

		if (this.socket instanceof NodeSocket) {
			skipWebSocketFrames = true;
			permessageDeflate = false;
			inflateBytes = VSBuffer.alloc(0);
		} else {
			skipWebSocketFrames = false;
			permessageDeflate = this.socket.permessageDeflate;
			inflateBytes = this.socket.recordedInflateBytes;
		}

		return {
			type: 'VSCODE_EXTHOST_IPC_SOCKET',
			initialDataChunk: (<Buffer>this.initialDataChunk.buffer).toString('base64'),
			skipWebSocketFrames: skipWebSocketFrames,
			permessageDeflate: permessageDeflate,
			inflateBytes: (<Buffer>inflateBytes.buffer).toString('base64'),
		};
	}
}

export class ExtensionHostConnection extends Disposable {

	private _onClose = new Emitter<void>();
	readonly onClose: Event<void> = this._onClose.event;

	private readonly _canSendSocket: boolean;
	private _disposed: boolean;
	private _remoteAddress: string;
	private _extensionHostProcess: cp.ChildProcess | null;
	private _connectionData: ConnectionData | null;

	constructor(
		private readonly _reconnectionToken: string,
		remoteAddress: string,
		socket: NodeSocket | WebSocketNodeSocket,
		initialDataChunk: VSBuffer,
		@IServerEnvironmentService private readonly _environmentService: IServerEnvironmentService,
		@ILogService private readonly _logService: ILogService,
		@IExtensionHostStatusService private readonly _extensionHostStatusService: IExtensionHostStatusService,
		@IConfigurationService private readonly _configurationService: IConfigurationService
	) {
		super();
		this._canSendSocket = (!isWindows || !this._environmentService.args['socket-path']);
		this._disposed = false;
		this._remoteAddress = remoteAddress;
		this._extensionHostProcess = null;
		this._connectionData = new ConnectionData(socket, initialDataChunk);

		this._log(`New connection established.`);
	}

	override dispose(): void {
		this._cleanResources();
		super.dispose();
	}

	private get _logPrefix(): string {
		return `[${this._remoteAddress}][${this._reconnectionToken.substr(0, 8)}][ExtensionHostConnection] `;
	}

	private _log(_str: string): void {
		this._logService.info(`${this._logPrefix}${_str}`);
	}

	private _logError(_str: string): void {
		this._logService.error(`${this._logPrefix}${_str}`);
	}

	private async _pipeSockets(extHostSocket: net.Socket, connectionData: ConnectionData): Promise<void> {

		const disposables = new DisposableStore();
		disposables.add(connectionData.socket);
		disposables.add(toDisposable(() => {
			extHostSocket.destroy();
		}));

		const stopAndCleanup = () => {
			disposables.dispose();
		};

		disposables.add(connectionData.socket.onEnd(stopAndCleanup));
		disposables.add(connectionData.socket.onClose(stopAndCleanup));

		disposables.add(Event.fromNodeEventEmitter<void>(extHostSocket, 'end')(stopAndCleanup));
		disposables.add(Event.fromNodeEventEmitter<void>(extHostSocket, 'close')(stopAndCleanup));
		disposables.add(Event.fromNodeEventEmitter<void>(extHostSocket, 'error')(stopAndCleanup));

		disposables.add(connectionData.socket.onData((e) => extHostSocket.write(e.buffer)));
		disposables.add(Event.fromNodeEventEmitter<Buffer>(extHostSocket, 'data')((e) => {
			connectionData.socket.write(VSBuffer.wrap(e));
		}));

		if (connectionData.initialDataChunk.byteLength > 0) {
			extHostSocket.write(connectionData.initialDataChunk.buffer);
		}
	}

	private async _sendSocketToExtensionHost(extensionHostProcess: cp.ChildProcess, connectionData: ConnectionData): Promise<void> {
		// Make sure all outstanding writes have been drained before sending the socket
		await connectionData.socketDrain();
		const msg = connectionData.toIExtHostSocketMessage();
		let socket: net.Socket;
		if (connectionData.socket instanceof NodeSocket) {
			socket = connectionData.socket.socket;
		} else {
			socket = connectionData.socket.socket.socket;
		}
		extensionHostProcess.send(msg, socket);
	}

	public shortenReconnectionGraceTimeIfNecessary(): void {
		if (!this._extensionHostProcess) {
			return;
		}
		const msg: IExtHostReduceGraceTimeMessage = {
			type: 'VSCODE_EXTHOST_IPC_REDUCE_GRACE_TIME'
		};
		this._extensionHostProcess.send(msg);
	}

	public acceptReconnection(remoteAddress: string, _socket: NodeSocket | WebSocketNodeSocket, initialDataChunk: VSBuffer): void {
		this._remoteAddress = remoteAddress;
		this._log(`The client has reconnected.`);
		const connectionData = new ConnectionData(_socket, initialDataChunk);

		if (!this._extensionHostProcess) {
			// The extension host didn't even start up yet
			this._connectionData = connectionData;
			return;
		}

		this._sendSocketToExtensionHost(this._extensionHostProcess, connectionData);
	}

	private _cleanResources(): void {
		if (this._disposed) {
			// already called
			return;
		}
		this._disposed = true;
		if (this._connectionData) {
			this._connectionData.socket.end();
			this._connectionData = null;
		}
		if (this._extensionHostProcess) {
			this._extensionHostProcess.kill();
			this._extensionHostProcess = null;
		}
		this._onClose.fire(undefined);
	}

	public async start(startParams: IRemoteExtensionHostStartParams): Promise<void> {
		try {
			let execArgv: string[] = process.execArgv ? process.execArgv.filter(a => !/^--inspect(-brk)?=/.test(a)) : [];
			// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
			if (startParams.port && !(<any>process).pkg) {
				execArgv = [
					`--inspect${startParams.break ? '-brk' : ''}=${startParams.port}`,
					'--experimental-network-inspection'
				];
			}

			const env = await buildUserEnvironment(startParams.env, true, startParams.language, this._environmentService, this._logService, this._configurationService);
			removeDangerousEnvVariables(env);

			let extHostNamedPipeServer: net.Server | null;

			if (this._canSendSocket) {
				writeExtHostConnection(new SocketExtHostConnection(), env);
				extHostNamedPipeServer = null;
			} else {
				const { namedPipeServer, pipeName } = await this._listenOnPipe();
				writeExtHostConnection(new IPCExtHostConnection(pipeName), env);
				extHostNamedPipeServer = namedPipeServer;
			}

			const opts = {
				env,
				execArgv,
				silent: true
			};

			// Refs https://github.com/microsoft/vscode/issues/189805
			opts.execArgv.unshift('--dns-result-order=ipv4first');

			// Run Extension Host as fork of current process
			const args = ['--type=extensionHost', `--transformURIs`];
			const useHostProxy = this._environmentService.args['use-host-proxy'];
			args.push(`--useHostProxy=${useHostProxy ? 'true' : 'false'}`);
			if (this._configurationService.getValue<boolean>('extensions.supportNodeGlobalNavigator')) {
				args.push('--supportGlobalNavigator');
			}
			this._extensionHostProcess = cp.fork(FileAccess.asFileUri('bootstrap-fork').fsPath, args, opts);
			const pid = this._extensionHostProcess.pid;
			this._log(`<${pid}> Launched Extension Host Process.`);

			// Catch all output coming from the extension host process
			this._extensionHostProcess.stdout!.setEncoding('utf8');
			this._extensionHostProcess.stderr!.setEncoding('utf8');
			const onStdout = Event.fromNodeEventEmitter<string>(this._extensionHostProcess.stdout!, 'data');
			const onStderr = Event.fromNodeEventEmitter<string>(this._extensionHostProcess.stderr!, 'data');
			this._register(onStdout((e) => this._log(`<${pid}> ${e}`)));
			this._register(onStderr((e) => this._log(`<${pid}><stderr> ${e}`)));

			// Lifecycle
			this._extensionHostProcess.on('error', (err) => {
				this._logError(`<${pid}> Extension Host Process had an error`);
				this._logService.error(err);
				this._cleanResources();
			});

			this._extensionHostProcess.on('exit', (code: number, signal: string) => {
				this._extensionHostStatusService.setExitInfo(this._reconnectionToken, { code, signal });
				this._log(`<${pid}> Extension Host Process exited with code: ${code}, signal: ${signal}.`);
				this._cleanResources();
			});

			if (extHostNamedPipeServer) {
				extHostNamedPipeServer.on('connection', (socket) => {
					extHostNamedPipeServer.close();
					this._pipeSockets(socket, this._connectionData!);
				});
			} else {
				const messageListener = (msg: IExtHostReadyMessage) => {
					if (msg.type === 'VSCODE_EXTHOST_IPC_READY') {
						this._extensionHostProcess!.removeListener('message', messageListener);
						this._sendSocketToExtensionHost(this._extensionHostProcess!, this._connectionData!);
						this._connectionData = null;
					}
				};
				this._extensionHostProcess.on('message', messageListener);
			}

		} catch (error) {
			console.error('ExtensionHostConnection errored');
			if (error) {
				console.error(error);
			}
		}
	}

	private _listenOnPipe(): Promise<{ pipeName: string; namedPipeServer: net.Server }> {
		return new Promise<{ pipeName: string; namedPipeServer: net.Server }>((resolve, reject) => {
			const pipeName = createRandomIPCHandle();

			const namedPipeServer = net.createServer();
			namedPipeServer.on('error', reject);
			namedPipeServer.listen(pipeName, () => {
				namedPipeServer?.removeListener('error', reject);
				resolve({ pipeName, namedPipeServer });
			});
		});
	}
}

function readCaseInsensitive(env: { [key: string]: string | undefined }, key: string): string | undefined {
	const pathKeys = Object.keys(env).filter(k => k.toLowerCase() === key.toLowerCase());
	const pathKey = pathKeys.length > 0 ? pathKeys[0] : key;
	return env[pathKey];
}

function setCaseInsensitive(env: { [key: string]: unknown }, key: string, value: string): void {
	const pathKeys = Object.keys(env).filter(k => k.toLowerCase() === key.toLowerCase());
	const pathKey = pathKeys.length > 0 ? pathKeys[0] : key;
	env[pathKey] = value;
}

function removeNulls(env: { [key: string]: unknown | null }): void {
	// Don't delete while iterating the object itself
	for (const key of Object.keys(env)) {
		if (env[key] === null) {
			delete env[key];
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/server/node/extensionHostStatusService.ts]---
Location: vscode-main/src/vs/server/node/extensionHostStatusService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../platform/instantiation/common/instantiation.js';
import { IExtensionHostExitInfo } from '../../workbench/services/remote/common/remoteAgentService.js';

export const IExtensionHostStatusService = createDecorator<IExtensionHostStatusService>('extensionHostStatusService');

export interface IExtensionHostStatusService {
	readonly _serviceBrand: undefined;

	setExitInfo(reconnectionToken: string, info: IExtensionHostExitInfo): void;
	getExitInfo(reconnectionToken: string): IExtensionHostExitInfo | null;
}

export class ExtensionHostStatusService implements IExtensionHostStatusService {
	_serviceBrand: undefined;

	private readonly _exitInfo = new Map<string, IExtensionHostExitInfo>();

	setExitInfo(reconnectionToken: string, info: IExtensionHostExitInfo): void {
		this._exitInfo.set(reconnectionToken, info);
	}

	getExitInfo(reconnectionToken: string): IExtensionHostExitInfo | null {
		return this._exitInfo.get(reconnectionToken) || null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/server/node/extensionsScannerService.ts]---
Location: vscode-main/src/vs/server/node/extensionsScannerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { joinPath } from '../../base/common/resources.js';
import { URI } from '../../base/common/uri.js';
import { INativeEnvironmentService } from '../../platform/environment/common/environment.js';
import { IExtensionsProfileScannerService } from '../../platform/extensionManagement/common/extensionsProfileScannerService.js';
import { AbstractExtensionsScannerService, IExtensionsScannerService, Translations } from '../../platform/extensionManagement/common/extensionsScannerService.js';
import { IFileService } from '../../platform/files/common/files.js';
import { IInstantiationService } from '../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../platform/log/common/log.js';
import { IProductService } from '../../platform/product/common/productService.js';
import { IUriIdentityService } from '../../platform/uriIdentity/common/uriIdentity.js';
import { IUserDataProfilesService } from '../../platform/userDataProfile/common/userDataProfile.js';
import { getNLSConfiguration } from './remoteLanguagePacks.js';

export class ExtensionsScannerService extends AbstractExtensionsScannerService implements IExtensionsScannerService {

	constructor(
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IExtensionsProfileScannerService extensionsProfileScannerService: IExtensionsProfileScannerService,
		@IFileService fileService: IFileService,
		@ILogService logService: ILogService,
		@INativeEnvironmentService private readonly nativeEnvironmentService: INativeEnvironmentService,
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
		const config = await getNLSConfiguration(language, this.nativeEnvironmentService.userDataPath);
		if (config.languagePack) {
			try {
				const content = await this.fileService.readFile(URI.file(config.languagePack.translationsConfigFile));
				return JSON.parse(content.value.toString());
			} catch (err) { /* Ignore error */ }
		}
		return Object.create(null);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/server/node/remoteAgentEnvironmentImpl.ts]---
Location: vscode-main/src/vs/server/node/remoteAgentEnvironmentImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../base/common/event.js';
import * as platform from '../../base/common/platform.js';
import * as performance from '../../base/common/performance.js';
import { URI } from '../../base/common/uri.js';
import { createURITransformer } from '../../base/common/uriTransformer.js';
import { IRemoteAgentEnvironmentDTO, IGetEnvironmentDataArguments, IGetExtensionHostExitInfoArguments } from '../../workbench/services/remote/common/remoteAgentEnvironmentChannel.js';
import { IServerEnvironmentService } from './serverEnvironmentService.js';
import { IServerChannel } from '../../base/parts/ipc/common/ipc.js';
import { transformOutgoingURIs } from '../../base/common/uriIpc.js';
import { listProcesses } from '../../base/node/ps.js';
import { getMachineInfo, collectWorkspaceStats } from '../../platform/diagnostics/node/diagnosticsService.js';
import { IDiagnosticInfoOptions, IDiagnosticInfo } from '../../platform/diagnostics/common/diagnostics.js';
import { basename } from '../../base/common/path.js';
import { ProcessItem } from '../../base/common/processes.js';
import { ServerConnectionToken, ServerConnectionTokenType } from './serverConnectionToken.js';
import { IExtensionHostStatusService } from './extensionHostStatusService.js';
import { IUserDataProfilesService } from '../../platform/userDataProfile/common/userDataProfile.js';
import { joinPath } from '../../base/common/resources.js';
import { ILogService } from '../../platform/log/common/log.js';

export class RemoteAgentEnvironmentChannel implements IServerChannel {

	private static _namePool = 1;

	constructor(
		private readonly _connectionToken: ServerConnectionToken,
		private readonly _environmentService: IServerEnvironmentService,
		private readonly _userDataProfilesService: IUserDataProfilesService,
		private readonly _extensionHostStatusService: IExtensionHostStatusService,
		private readonly _logService: ILogService,
	) {
	}

	async call(_: any, command: string, arg?: any): Promise<any> {
		switch (command) {

			case 'getEnvironmentData': {
				const args = <IGetEnvironmentDataArguments>arg;
				const uriTransformer = createURITransformer(args.remoteAuthority);

				let environmentData = await this._getEnvironmentData(args.profile);
				environmentData = transformOutgoingURIs(environmentData, uriTransformer);

				return environmentData;
			}

			case 'getExtensionHostExitInfo': {
				const args = <IGetExtensionHostExitInfoArguments>arg;
				return this._extensionHostStatusService.getExitInfo(args.reconnectionToken);
			}

			case 'getDiagnosticInfo': {
				const options = <IDiagnosticInfoOptions>arg;
				const diagnosticInfo: IDiagnosticInfo = {
					machineInfo: getMachineInfo()
				};

				const processesPromise: Promise<ProcessItem | void> = options.includeProcesses ? listProcesses(process.pid) : Promise.resolve();

				let workspaceMetadataPromises: Promise<void>[] = [];
				const workspaceMetadata: { [key: string]: any } = {};
				if (options.folders) {
					// only incoming paths are transformed, so remote authority is unneeded.
					const uriTransformer = createURITransformer('');
					const folderPaths = options.folders
						.map(folder => URI.revive(uriTransformer.transformIncoming(folder)))
						.filter(uri => uri.scheme === 'file');

					workspaceMetadataPromises = folderPaths.map(folder => {
						return collectWorkspaceStats(folder.fsPath, ['node_modules', '.git'])
							.then(stats => {
								workspaceMetadata[basename(folder.fsPath)] = stats;
							});
					});
				}

				return Promise.all([processesPromise, ...workspaceMetadataPromises]).then(([processes, _]) => {
					diagnosticInfo.processes = processes || undefined;
					diagnosticInfo.workspaceMetadata = options.folders ? workspaceMetadata : undefined;
					return diagnosticInfo;
				});
			}
		}

		throw new Error(`IPC Command ${command} not found`);
	}

	listen(_: any, event: string, arg: any): Event<any> {
		throw new Error('Not supported');
	}

	private async _getEnvironmentData(profile?: string): Promise<IRemoteAgentEnvironmentDTO> {
		if (profile && !this._userDataProfilesService.profiles.some(p => p.id === profile)) {
			await this._userDataProfilesService.createProfile(profile, profile);
		}
		type ProcessWithGlibc = NodeJS.Process & {
			glibcVersion?: string;
		};
		let isUnsupportedGlibc = false;
		if (process.platform === 'linux') {
			const glibcVersion = (process as ProcessWithGlibc).glibcVersion;
			const minorVersion = glibcVersion ? parseInt(glibcVersion.split('.')[1]) : 28;
			isUnsupportedGlibc = (minorVersion <= 27) || !!process.env['VSCODE_SERVER_CUSTOM_GLIBC_LINKER'];
		}
		this._logService.trace(`[reconnection-grace-time] Server sending grace time to client: ${this._environmentService.reconnectionGraceTime}ms (${Math.floor(this._environmentService.reconnectionGraceTime / 1000)}s)`);
		return {
			pid: process.pid,
			connectionToken: (this._connectionToken.type !== ServerConnectionTokenType.None ? this._connectionToken.value : ''),
			appRoot: URI.file(this._environmentService.appRoot),
			settingsPath: this._environmentService.machineSettingsResource,
			mcpResource: this._environmentService.mcpResource,
			logsPath: this._environmentService.logsHome,
			extensionHostLogsPath: joinPath(this._environmentService.logsHome, `exthost${RemoteAgentEnvironmentChannel._namePool++}`),
			globalStorageHome: this._userDataProfilesService.defaultProfile.globalStorageHome,
			workspaceStorageHome: this._environmentService.workspaceStorageHome,
			localHistoryHome: this._environmentService.localHistoryHome,
			userHome: this._environmentService.userHome,
			os: platform.OS,
			arch: process.arch,
			marks: performance.getMarks(),
			useHostProxy: !!this._environmentService.args['use-host-proxy'],
			profiles: {
				home: this._userDataProfilesService.profilesHome,
				all: [...this._userDataProfilesService.profiles].map(profile => ({ ...profile }))
			},
			isUnsupportedGlibc,
			reconnectionGraceTime: this._environmentService.reconnectionGraceTime
		};
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/server/node/remoteExtensionHostAgentCli.ts]---
Location: vscode-main/src/vs/server/node/remoteExtensionHostAgentCli.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ServiceCollection } from '../../platform/instantiation/common/serviceCollection.js';
import { ConsoleLogger, getLogLevel, ILoggerService, ILogService } from '../../platform/log/common/log.js';
import { SyncDescriptor } from '../../platform/instantiation/common/descriptors.js';
import { ConfigurationService } from '../../platform/configuration/common/configurationService.js';
import { IConfigurationService } from '../../platform/configuration/common/configuration.js';
import { IRequestService } from '../../platform/request/common/request.js';
import { RequestService } from '../../platform/request/node/requestService.js';
import { NullTelemetryService } from '../../platform/telemetry/common/telemetryUtils.js';
import { ITelemetryService } from '../../platform/telemetry/common/telemetry.js';
import { IAllowedExtensionsService, IExtensionGalleryService, InstallOptions } from '../../platform/extensionManagement/common/extensionManagement.js';
import { ExtensionGalleryServiceWithNoStorageService } from '../../platform/extensionManagement/common/extensionGalleryService.js';
import { ExtensionManagementService, INativeServerExtensionManagementService } from '../../platform/extensionManagement/node/extensionManagementService.js';
import { ExtensionSignatureVerificationService, IExtensionSignatureVerificationService } from '../../platform/extensionManagement/node/extensionSignatureVerificationService.js';
import { InstantiationService } from '../../platform/instantiation/common/instantiationService.js';
import { IInstantiationService } from '../../platform/instantiation/common/instantiation.js';
import product from '../../platform/product/common/product.js';
import { Disposable } from '../../base/common/lifecycle.js';
import { FileService } from '../../platform/files/common/fileService.js';
import { DiskFileSystemProvider } from '../../platform/files/node/diskFileSystemProvider.js';
import { Schemas } from '../../base/common/network.js';
import { IFileService } from '../../platform/files/common/files.js';
import { IProductService } from '../../platform/product/common/productService.js';
import { IServerEnvironmentService, ServerEnvironmentService, ServerParsedArgs } from './serverEnvironmentService.js';
import { ExtensionManagementCLI } from '../../platform/extensionManagement/common/extensionManagementCLI.js';
import { ILanguagePackService } from '../../platform/languagePacks/common/languagePacks.js';
import { NativeLanguagePackService } from '../../platform/languagePacks/node/languagePacks.js';
import { getErrorMessage } from '../../base/common/errors.js';
import { URI } from '../../base/common/uri.js';
import { isAbsolute, join } from '../../base/common/path.js';
import { cwd } from '../../base/common/process.js';
import { DownloadService } from '../../platform/download/common/downloadService.js';
import { IDownloadService } from '../../platform/download/common/download.js';
import { IUriIdentityService } from '../../platform/uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../platform/uriIdentity/common/uriIdentityService.js';
import { buildHelpMessage, buildVersionMessage, OptionDescriptions } from '../../platform/environment/node/argv.js';
import { isWindows } from '../../base/common/platform.js';
import { IExtensionsScannerService } from '../../platform/extensionManagement/common/extensionsScannerService.js';
import { ExtensionsScannerService } from './extensionsScannerService.js';
import { IUserDataProfilesService } from '../../platform/userDataProfile/common/userDataProfile.js';
import { IExtensionsProfileScannerService } from '../../platform/extensionManagement/common/extensionsProfileScannerService.js';
import { NullPolicyService } from '../../platform/policy/common/policy.js';
import { ServerUserDataProfilesService } from '../../platform/userDataProfile/node/userDataProfile.js';
import { ExtensionsProfileScannerService } from '../../platform/extensionManagement/node/extensionsProfileScannerService.js';
import { LogService } from '../../platform/log/common/logService.js';
import { LoggerService } from '../../platform/log/node/loggerService.js';
import { localize } from '../../nls.js';
import { addUNCHostToAllowlist, disableUNCAccessRestrictions } from '../../base/node/unc.js';
import { AllowedExtensionsService } from '../../platform/extensionManagement/common/allowedExtensionsService.js';
import { IExtensionGalleryManifestService } from '../../platform/extensionManagement/common/extensionGalleryManifest.js';
import { ExtensionGalleryManifestService } from '../../platform/extensionManagement/common/extensionGalleryManifestService.js';

class CliMain extends Disposable {

	constructor(private readonly args: ServerParsedArgs, private readonly remoteDataFolder: string) {
		super();

		this.registerListeners();
	}

	private registerListeners(): void {
		process.once('exit', () => this.dispose()); // Dispose on exit
	}

	async run(): Promise<void> {
		const instantiationService = await this.initServices();
		await instantiationService.invokeFunction(async accessor => {
			const configurationService = accessor.get(IConfigurationService);
			const logService = accessor.get(ILogService);

			// On Windows, configure the UNC allow list based on settings
			if (isWindows) {
				if (configurationService.getValue('security.restrictUNCAccess') === false) {
					disableUNCAccessRestrictions();
				} else {
					addUNCHostToAllowlist(configurationService.getValue('security.allowedUNCHosts'));
				}
			}

			try {
				await this.doRun(instantiationService.createInstance(ExtensionManagementCLI, new ConsoleLogger(logService.getLevel(), false)));
			} catch (error) {
				logService.error(error);
				console.error(getErrorMessage(error));
				throw error;
			}
		});
	}

	private async initServices(): Promise<IInstantiationService> {
		const services = new ServiceCollection();

		const productService = { _serviceBrand: undefined, ...product };
		services.set(IProductService, productService);

		const environmentService = new ServerEnvironmentService(this.args, productService);
		services.set(IServerEnvironmentService, environmentService);

		const loggerService = new LoggerService(getLogLevel(environmentService), environmentService.logsHome);
		services.set(ILoggerService, loggerService);

		const logService = new LogService(this._register(loggerService.createLogger('remoteCLI', { name: localize('remotecli', "Remote CLI") })));
		services.set(ILogService, logService);
		logService.trace(`Remote configuration data at ${this.remoteDataFolder}`);
		logService.trace('process arguments:', this.args);

		// Files
		const fileService = this._register(new FileService(logService));
		services.set(IFileService, fileService);
		fileService.registerProvider(Schemas.file, this._register(new DiskFileSystemProvider(logService)));

		const uriIdentityService = new UriIdentityService(fileService);
		services.set(IUriIdentityService, uriIdentityService);

		// User Data Profiles
		const userDataProfilesService = this._register(new ServerUserDataProfilesService(uriIdentityService, environmentService, fileService, logService));
		services.set(IUserDataProfilesService, userDataProfilesService);

		// Configuration
		const configurationService = this._register(new ConfigurationService(userDataProfilesService.defaultProfile.settingsResource, fileService, new NullPolicyService(), logService));
		services.set(IConfigurationService, configurationService);

		// Initialize
		await Promise.all([
			configurationService.initialize(),
			userDataProfilesService.init()
		]);

		services.set(IRequestService, new SyncDescriptor(RequestService, ['remote']));
		services.set(IDownloadService, new SyncDescriptor(DownloadService));
		services.set(ITelemetryService, NullTelemetryService);
		services.set(IExtensionGalleryManifestService, new SyncDescriptor(ExtensionGalleryManifestService));
		services.set(IExtensionGalleryService, new SyncDescriptor(ExtensionGalleryServiceWithNoStorageService));
		services.set(IExtensionsProfileScannerService, new SyncDescriptor(ExtensionsProfileScannerService));
		services.set(IExtensionsScannerService, new SyncDescriptor(ExtensionsScannerService));
		services.set(IExtensionSignatureVerificationService, new SyncDescriptor(ExtensionSignatureVerificationService));
		services.set(IAllowedExtensionsService, new SyncDescriptor(AllowedExtensionsService));
		services.set(INativeServerExtensionManagementService, new SyncDescriptor(ExtensionManagementService));
		services.set(ILanguagePackService, new SyncDescriptor(NativeLanguagePackService));

		return new InstantiationService(services);
	}

	private async doRun(extensionManagementCLI: ExtensionManagementCLI): Promise<void> {

		// List Extensions
		if (this.args['list-extensions']) {
			return extensionManagementCLI.listExtensions(!!this.args['show-versions'], this.args['category']);
		}

		// Install Extension
		else if (this.args['install-extension'] || this.args['install-builtin-extension']) {
			const installOptions: InstallOptions = { isMachineScoped: !!this.args['do-not-sync'], installPreReleaseVersion: !!this.args['pre-release'], donotIncludePackAndDependencies: !!this.args['do-not-include-pack-dependencies'] };
			return extensionManagementCLI.installExtensions(this.asExtensionIdOrVSIX(this.args['install-extension'] || []), this.asExtensionIdOrVSIX(this.args['install-builtin-extension'] || []), installOptions, !!this.args['force']);
		}

		// Uninstall Extension
		else if (this.args['uninstall-extension']) {
			return extensionManagementCLI.uninstallExtensions(this.asExtensionIdOrVSIX(this.args['uninstall-extension']), !!this.args['force']);
		}

		// Update the installed extensions
		else if (this.args['update-extensions']) {
			return extensionManagementCLI.updateExtensions();
		}

		// Locate Extension
		else if (this.args['locate-extension']) {
			return extensionManagementCLI.locateExtension(this.args['locate-extension']);
		}
	}

	private asExtensionIdOrVSIX(inputs: string[]): (string | URI)[] {
		return inputs.map(input => /\.vsix$/i.test(input) ? URI.file(isAbsolute(input) ? input : join(cwd(), input)) : input);
	}
}

function eventuallyExit(code: number): void {
	setTimeout(() => process.exit(code), 0);
}

export async function run(args: ServerParsedArgs, REMOTE_DATA_FOLDER: string, optionDescriptions: OptionDescriptions<ServerParsedArgs>): Promise<void> {
	if (args.help) {
		const executable = product.serverApplicationName + (isWindows ? '.cmd' : '');
		console.log(buildHelpMessage(product.nameLong, executable, product.version, optionDescriptions, { noInputFiles: true, noPipe: true }));
		return;
	}

	// Version Info
	if (args.version) {
		console.log(buildVersionMessage(product.version, product.commit));
		return;
	}

	const cliMain = new CliMain(args, REMOTE_DATA_FOLDER);
	try {
		await cliMain.run();
		eventuallyExit(0);
	} catch (err) {
		eventuallyExit(1);
	} finally {
		cliMain.dispose();
	}
}
```

--------------------------------------------------------------------------------

````
