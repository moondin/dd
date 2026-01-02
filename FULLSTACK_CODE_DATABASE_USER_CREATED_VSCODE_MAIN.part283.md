---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 283
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 283 of 552)

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

---[FILE: src/vs/platform/remote/common/remoteAuthorityResolver.ts]---
Location: vscode-main/src/vs/platform/remote/common/remoteAuthorityResolver.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ErrorNoTelemetry } from '../../../base/common/errors.js';
import { Event } from '../../../base/common/event.js';
import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IRemoteAuthorityResolverService = createDecorator<IRemoteAuthorityResolverService>('remoteAuthorityResolverService');

export const enum RemoteConnectionType {
	WebSocket,
	Managed
}

export class ManagedRemoteConnection {
	public readonly type = RemoteConnectionType.Managed;

	constructor(
		public readonly id: number
	) { }

	public toString(): string {
		return `Managed(${this.id})`;
	}
}

export class WebSocketRemoteConnection {
	public readonly type = RemoteConnectionType.WebSocket;

	constructor(
		public readonly host: string,
		public readonly port: number,
	) { }

	public toString(): string {
		return `WebSocket(${this.host}:${this.port})`;
	}
}

export type RemoteConnection = WebSocketRemoteConnection | ManagedRemoteConnection;

export type RemoteConnectionOfType<T extends RemoteConnectionType> = RemoteConnection & { type: T };

export interface ResolvedAuthority {
	readonly authority: string;
	readonly connectTo: RemoteConnection;
	readonly connectionToken: string | undefined;
}

export interface ResolvedOptions {
	readonly extensionHostEnv?: { [key: string]: string | null };
	readonly isTrusted?: boolean;
	readonly authenticationSession?: { id: string; providerId: string };
}

export interface TunnelDescription {
	remoteAddress: { port: number; host: string };
	localAddress: { port: number; host: string } | string;
	privacy?: string;
	protocol?: string;
}
export interface TunnelPrivacy {
	themeIcon: string;
	id: string;
	label: string;
}
export interface TunnelInformation {
	environmentTunnels?: TunnelDescription[];
	features?: {
		elevation: boolean;
		public?: boolean;
		privacyOptions: TunnelPrivacy[];
		protocol: boolean;
	};
}

export interface ResolverResult {
	authority: ResolvedAuthority;
	options?: ResolvedOptions;
	tunnelInformation?: TunnelInformation;
}

export interface IRemoteConnectionData {
	connectTo: RemoteConnection;
	connectionToken: string | undefined;
}

export enum RemoteAuthorityResolverErrorCode {
	Unknown = 'Unknown',
	NotAvailable = 'NotAvailable',
	TemporarilyNotAvailable = 'TemporarilyNotAvailable',
	NoResolverFound = 'NoResolverFound',
	InvalidAuthority = 'InvalidAuthority'
}

export class RemoteAuthorityResolverError extends ErrorNoTelemetry {

	public static isNotAvailable(err: any): boolean {
		return (err instanceof RemoteAuthorityResolverError) && err._code === RemoteAuthorityResolverErrorCode.NotAvailable;
	}

	public static isTemporarilyNotAvailable(err: any): boolean {
		return (err instanceof RemoteAuthorityResolverError) && err._code === RemoteAuthorityResolverErrorCode.TemporarilyNotAvailable;
	}

	public static isNoResolverFound(err: any): err is RemoteAuthorityResolverError {
		return (err instanceof RemoteAuthorityResolverError) && err._code === RemoteAuthorityResolverErrorCode.NoResolverFound;
	}

	public static isInvalidAuthority(err: any): boolean {
		return (err instanceof RemoteAuthorityResolverError) && err._code === RemoteAuthorityResolverErrorCode.InvalidAuthority;
	}

	public static isHandled(err: any): boolean {
		return (err instanceof RemoteAuthorityResolverError) && err.isHandled;
	}

	public readonly _message: string | undefined;
	public readonly _code: RemoteAuthorityResolverErrorCode;
	public readonly _detail: unknown;

	public isHandled: boolean;

	constructor(message?: string, code: RemoteAuthorityResolverErrorCode = RemoteAuthorityResolverErrorCode.Unknown, detail?: unknown) {
		super(message);

		this._message = message;
		this._code = code;
		this._detail = detail;

		this.isHandled = (code === RemoteAuthorityResolverErrorCode.NotAvailable) && detail === true;

		// workaround when extending builtin objects and when compiling to ES5, see:
		// https://github.com/microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
		Object.setPrototypeOf(this, RemoteAuthorityResolverError.prototype);
	}
}

export interface IRemoteAuthorityResolverService {

	readonly _serviceBrand: undefined;

	readonly onDidChangeConnectionData: Event<void>;

	resolveAuthority(authority: string): Promise<ResolverResult>;
	getConnectionData(authority: string): IRemoteConnectionData | null;
	/**
	 * Get the canonical URI for a `vscode-remote://` URI.
	 *
	 * **NOTE**: This can throw e.g. in cases where there is no resolver installed for the specific remote authority.
	 *
	 * @param uri The `vscode-remote://` URI
	 */
	getCanonicalURI(uri: URI): Promise<URI>;

	_clearResolvedAuthority(authority: string): void;
	_setResolvedAuthority(resolvedAuthority: ResolvedAuthority, resolvedOptions?: ResolvedOptions): void;
	_setResolvedAuthorityError(authority: string, err: any): void;
	_setAuthorityConnectionToken(authority: string, connectionToken: string): void;
	_setCanonicalURIProvider(provider: (uri: URI) => Promise<URI>): void;
}

export function getRemoteAuthorityPrefix(remoteAuthority: string): string {
	const plusIndex = remoteAuthority.indexOf('+');
	if (plusIndex === -1) {
		return remoteAuthority;
	}
	return remoteAuthority.substring(0, plusIndex);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remote/common/remoteExtensionsScanner.ts]---
Location: vscode-main/src/vs/platform/remote/common/remoteExtensionsScanner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstallExtensionSummary } from '../../extensionManagement/common/extensionManagement.js';
import { IExtensionDescription } from '../../extensions/common/extensions.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IRemoteExtensionsScannerService = createDecorator<IRemoteExtensionsScannerService>('IRemoteExtensionsScannerService');

export const RemoteExtensionsScannerChannelName = 'remoteExtensionsScanner';

export interface IRemoteExtensionsScannerService {
	readonly _serviceBrand: undefined;

	/**
	 * Returns a promise that resolves to an array of extension identifiers that failed to install
	 */
	whenExtensionsReady(): Promise<InstallExtensionSummary>;
	scanExtensions(): Promise<IExtensionDescription[]>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remote/common/remoteHosts.ts]---
Location: vscode-main/src/vs/platform/remote/common/remoteHosts.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';

export function getRemoteAuthority(uri: URI): string | undefined {
	return uri.scheme === Schemas.vscodeRemote ? uri.authority : undefined;
}

export function getRemoteName(authority: string): string;
export function getRemoteName(authority: undefined): undefined;
export function getRemoteName(authority: string | undefined): string | undefined;
export function getRemoteName(authority: string | undefined): string | undefined {
	if (!authority) {
		return undefined;
	}
	const pos = authority.indexOf('+');
	if (pos < 0) {
		// e.g. localhost:8000
		return authority;
	}
	return authority.substr(0, pos);
}

export function parseAuthorityWithPort(authority: string): { host: string; port: number } {
	const { host, port } = parseAuthority(authority);
	if (typeof port === 'undefined') {
		throw new Error(`Invalid remote authority: ${authority}. It must either be a remote of form <remoteName>+<arg> or a remote host of form <host>:<port>.`);
	}
	return { host, port };
}

export function parseAuthorityWithOptionalPort(authority: string, defaultPort: number): { host: string; port: number } {
	let { host, port } = parseAuthority(authority);
	if (typeof port === 'undefined') {
		port = defaultPort;
	}
	return { host, port };
}

function parseAuthority(authority: string): { host: string; port: number | undefined } {
	// check for ipv6 with port
	const m1 = authority.match(/^(\[[0-9a-z:]+\]):(\d+)$/);
	if (m1) {
		return { host: m1[1], port: parseInt(m1[2], 10) };
	}

	// check for ipv6 without port
	const m2 = authority.match(/^(\[[0-9a-z:]+\])$/);
	if (m2) {
		return { host: m2[1], port: undefined };
	}

	// anything with a trailing port
	const m3 = authority.match(/(.*):(\d+)$/);
	if (m3) {
		return { host: m3[1], port: parseInt(m3[2], 10) };
	}

	// doesn't contain a port
	return { host: authority, port: undefined };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remote/common/remoteSocketFactoryService.ts]---
Location: vscode-main/src/vs/platform/remote/common/remoteSocketFactoryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { ISocket } from '../../../base/parts/ipc/common/ipc.net.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { RemoteConnectionOfType, RemoteConnectionType, RemoteConnection } from './remoteAuthorityResolver.js';

export const IRemoteSocketFactoryService = createDecorator<IRemoteSocketFactoryService>('remoteSocketFactoryService');

export interface IRemoteSocketFactoryService {
	readonly _serviceBrand: undefined;

	/**
	 * Register a socket factory for the given message passing type
	 * @param type passing type to register for
	 * @param factory function that returns the socket factory, or undefined if
	 * it can't handle the data.
	 */
	register<T extends RemoteConnectionType>(type: T, factory: ISocketFactory<T>): IDisposable;

	connect(connectTo: RemoteConnection, path: string, query: string, debugLabel: string): Promise<ISocket>;
}

export interface ISocketFactory<T extends RemoteConnectionType> {
	supports(connectTo: RemoteConnectionOfType<T>): boolean;
	connect(connectTo: RemoteConnectionOfType<T>, path: string, query: string, debugLabel: string): Promise<ISocket>;
}

export class RemoteSocketFactoryService implements IRemoteSocketFactoryService {
	declare readonly _serviceBrand: undefined;

	private readonly factories: { [T in RemoteConnectionType]?: ISocketFactory<T>[] } = {};

	public register<T extends RemoteConnectionType>(type: T, factory: ISocketFactory<T>): IDisposable {
		this.factories[type] ??= [];
		this.factories[type]!.push(factory);
		return toDisposable(() => {
			const idx = this.factories[type]?.indexOf(factory);
			if (typeof idx === 'number' && idx >= 0) {
				this.factories[type]?.splice(idx, 1);
			}
		});
	}

	private getSocketFactory<T extends RemoteConnectionType>(messagePassing: RemoteConnectionOfType<T>): ISocketFactory<T> | undefined {
		const factories = (this.factories[messagePassing.type] || []);
		return factories.find(factory => factory.supports(messagePassing));
	}

	public connect(connectTo: RemoteConnection, path: string, query: string, debugLabel: string): Promise<ISocket> {
		const socketFactory = this.getSocketFactory(connectTo);
		if (!socketFactory) {
			throw new Error(`No socket factory found for ${connectTo}`);
		}
		return socketFactory.connect(connectTo, path, query, debugLabel);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remote/common/sharedProcessTunnelService.ts]---
Location: vscode-main/src/vs/platform/remote/common/sharedProcessTunnelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IAddress } from './remoteAgentConnection.js';

export const ISharedProcessTunnelService = createDecorator<ISharedProcessTunnelService>('sharedProcessTunnelService');

export const ipcSharedProcessTunnelChannelName = 'sharedProcessTunnel';

export interface ISharedProcessTunnel {
	tunnelLocalPort: number | undefined;
	localAddress: string;
}

/**
 * A service that creates tunnels on the shared process
 */
export interface ISharedProcessTunnelService {
	readonly _serviceBrand: undefined;

	/**
	 * Create a tunnel.
	 */
	createTunnel(): Promise<{ id: string }>;
	/**
	 * Start a previously created tunnel.
	 * Can only be called once per created tunnel.
	 */
	startTunnel(authority: string, id: string, tunnelRemoteHost: string, tunnelRemotePort: number, tunnelLocalHost: string, tunnelLocalPort: number | undefined, elevateIfNeeded: boolean | undefined): Promise<ISharedProcessTunnel>;
	/**
	 * Set the remote address info for a previously created tunnel.
	 * Should be called as often as the resolver resolves.
	 */
	setAddress(id: string, address: IAddress): Promise<void>;
	/**
	 * Destroy a previously created tunnel.
	 */
	destroyTunnel(id: string): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remote/electron-browser/electronRemoteResourceLoader.ts]---
Location: vscode-main/src/vs/platform/remote/electron-browser/electronRemoteResourceLoader.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer, encodeBase64 } from '../../../base/common/buffer.js';
import { Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { getMediaOrTextMime } from '../../../base/common/mime.js';
import { Schemas } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';
import { IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { FileOperationError, FileOperationResult, IFileContent, IFileService } from '../../files/common/files.js';
import { IMainProcessService } from '../../ipc/common/mainProcessService.js';
import { NODE_REMOTE_RESOURCE_CHANNEL_NAME, NODE_REMOTE_RESOURCE_IPC_METHOD_NAME, NodeRemoteResourceResponse } from '../common/electronRemoteResources.js';

export class ElectronRemoteResourceLoader extends Disposable {
	constructor(
		private readonly windowId: number,
		@IMainProcessService mainProcessService: IMainProcessService,
		@IFileService private readonly fileService: IFileService,
	) {
		super();

		const channel: IServerChannel = {
			listen<T>(_: unknown, event: string): Event<T> {
				throw new Error(`Event not found: ${event}`);
			},

			call: (_: unknown, command: string, arg?: any): Promise<any> => {
				switch (command) {
					case NODE_REMOTE_RESOURCE_IPC_METHOD_NAME: return this.doRequest(URI.revive(arg[0]));
				}

				throw new Error(`Call not found: ${command}`);
			}
		};

		mainProcessService.registerChannel(NODE_REMOTE_RESOURCE_CHANNEL_NAME, channel);
	}

	private async doRequest(uri: URI): Promise<NodeRemoteResourceResponse> {
		let content: IFileContent;
		try {
			const params = new URLSearchParams(uri.query);
			const actual = uri.with({
				scheme: params.get('scheme')!,
				authority: params.get('authority')!,
				query: '',
			});
			content = await this.fileService.readFile(actual);
		} catch (e) {
			const str = encodeBase64(VSBuffer.fromString(e.message));
			if (e instanceof FileOperationError && e.fileOperationResult === FileOperationResult.FILE_NOT_FOUND) {
				return { statusCode: 404, body: str };
			} else {
				return { statusCode: 500, body: str };
			}
		}

		const mimeType = uri.path && getMediaOrTextMime(uri.path);
		return { statusCode: 200, body: encodeBase64(content.value), mimeType };
	}

	public getResourceUriProvider() {
		return (uri: URI) => uri.with({
			scheme: Schemas.vscodeManagedRemoteResource,
			authority: `window:${this.windowId}`,
			query: new URLSearchParams({ authority: uri.authority, scheme: uri.scheme }).toString(),
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remote/electron-browser/remoteAuthorityResolverService.ts]---
Location: vscode-main/src/vs/platform/remote/electron-browser/remoteAuthorityResolverService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
//
import { DeferredPromise } from '../../../base/common/async.js';
import * as errors from '../../../base/common/errors.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { RemoteAuthorities } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';
import { IProductService } from '../../product/common/productService.js';
import { IRemoteAuthorityResolverService, IRemoteConnectionData, RemoteConnectionType, ResolvedAuthority, ResolvedOptions, ResolverResult } from '../common/remoteAuthorityResolver.js';
import { ElectronRemoteResourceLoader } from './electronRemoteResourceLoader.js';

export class RemoteAuthorityResolverService extends Disposable implements IRemoteAuthorityResolverService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeConnectionData = this._register(new Emitter<void>());
	public readonly onDidChangeConnectionData = this._onDidChangeConnectionData.event;

	private readonly _resolveAuthorityRequests: Map<string, DeferredPromise<ResolverResult>>;
	private readonly _connectionTokens: Map<string, string>;
	private readonly _canonicalURIRequests: Map<string, { input: URI; result: DeferredPromise<URI> }>;
	private _canonicalURIProvider: ((uri: URI) => Promise<URI>) | null;

	constructor(@IProductService productService: IProductService, private readonly remoteResourceLoader: ElectronRemoteResourceLoader) {
		super();
		this._resolveAuthorityRequests = new Map<string, DeferredPromise<ResolverResult>>();
		this._connectionTokens = new Map<string, string>();
		this._canonicalURIRequests = new Map();
		this._canonicalURIProvider = null;

		RemoteAuthorities.setServerRootPath(productService, undefined); // on the desktop we don't support custom server base paths
	}

	resolveAuthority(authority: string): Promise<ResolverResult> {
		if (!this._resolveAuthorityRequests.has(authority)) {
			this._resolveAuthorityRequests.set(authority, new DeferredPromise());
		}
		return this._resolveAuthorityRequests.get(authority)!.p;
	}

	async getCanonicalURI(uri: URI): Promise<URI> {
		const key = uri.toString();
		const existing = this._canonicalURIRequests.get(key);
		if (existing) {
			return existing.result.p;
		}

		const result = new DeferredPromise<URI>();
		this._canonicalURIProvider?.(uri).then((uri) => result.complete(uri), (err) => result.error(err));
		this._canonicalURIRequests.set(key, { input: uri, result });
		return result.p;
	}

	getConnectionData(authority: string): IRemoteConnectionData | null {
		if (!this._resolveAuthorityRequests.has(authority)) {
			return null;
		}
		const request = this._resolveAuthorityRequests.get(authority)!;
		if (!request.isResolved) {
			return null;
		}
		const connectionToken = this._connectionTokens.get(authority);
		return {
			connectTo: request.value!.authority.connectTo,
			connectionToken: connectionToken
		};
	}

	_clearResolvedAuthority(authority: string): void {
		if (this._resolveAuthorityRequests.has(authority)) {
			this._resolveAuthorityRequests.get(authority)!.cancel();
			this._resolveAuthorityRequests.delete(authority);
		}
	}

	_setResolvedAuthority(resolvedAuthority: ResolvedAuthority, options?: ResolvedOptions): void {
		if (this._resolveAuthorityRequests.has(resolvedAuthority.authority)) {
			const request = this._resolveAuthorityRequests.get(resolvedAuthority.authority)!;
			if (resolvedAuthority.connectTo.type === RemoteConnectionType.WebSocket) {
				RemoteAuthorities.set(resolvedAuthority.authority, resolvedAuthority.connectTo.host, resolvedAuthority.connectTo.port);
			} else {
				RemoteAuthorities.setDelegate(this.remoteResourceLoader.getResourceUriProvider());
			}
			if (resolvedAuthority.connectionToken) {
				RemoteAuthorities.setConnectionToken(resolvedAuthority.authority, resolvedAuthority.connectionToken);
			}
			request.complete({ authority: resolvedAuthority, options });
			this._onDidChangeConnectionData.fire();
		}
	}

	_setResolvedAuthorityError(authority: string, err: any): void {
		if (this._resolveAuthorityRequests.has(authority)) {
			const request = this._resolveAuthorityRequests.get(authority)!;
			// Avoid that this error makes it to telemetry
			request.error(errors.ErrorNoTelemetry.fromError(err));
		}
	}

	_setAuthorityConnectionToken(authority: string, connectionToken: string): void {
		this._connectionTokens.set(authority, connectionToken);
		RemoteAuthorities.setConnectionToken(authority, connectionToken);
		this._onDidChangeConnectionData.fire();
	}

	_setCanonicalURIProvider(provider: (uri: URI) => Promise<URI>): void {
		this._canonicalURIProvider = provider;
		this._canonicalURIRequests.forEach(({ result, input }) => {
			this._canonicalURIProvider!(input).then((uri) => result.complete(uri), (err) => result.error(err));
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remote/electron-browser/sharedProcessTunnelService.ts]---
Location: vscode-main/src/vs/platform/remote/electron-browser/sharedProcessTunnelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerSharedProcessRemoteService } from '../../ipc/electron-browser/services.js';
import { ISharedProcessTunnelService, ipcSharedProcessTunnelChannelName } from '../common/sharedProcessTunnelService.js';

registerSharedProcessRemoteService(ISharedProcessTunnelService, ipcSharedProcessTunnelChannelName);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remote/node/nodeSocketFactory.ts]---
Location: vscode-main/src/vs/platform/remote/node/nodeSocketFactory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as net from 'net';
import { ISocket } from '../../../base/parts/ipc/common/ipc.net.js';
import { NodeSocket } from '../../../base/parts/ipc/node/ipc.net.js';
import { makeRawSocketHeaders } from '../common/managedSocket.js';
import { RemoteConnectionType, WebSocketRemoteConnection } from '../common/remoteAuthorityResolver.js';
import { ISocketFactory } from '../common/remoteSocketFactoryService.js';

export const nodeSocketFactory = new class implements ISocketFactory<RemoteConnectionType.WebSocket> {

	supports(connectTo: WebSocketRemoteConnection): boolean {
		return true;
	}

	connect({ host, port }: WebSocketRemoteConnection, path: string, query: string, debugLabel: string): Promise<ISocket> {
		return new Promise<ISocket>((resolve, reject) => {
			const socket = net.createConnection({ host: host, port: port }, () => {
				socket.removeListener('error', reject);

				socket.write(makeRawSocketHeaders(path, query, debugLabel));

				const onData = (data: Buffer) => {
					const strData = data.toString();
					if (strData.indexOf('\r\n\r\n') >= 0) {
						// headers received OK
						socket.off('data', onData);
						resolve(new NodeSocket(socket, debugLabel));
					}
				};
				socket.on('data', onData);
			});
			// Disable Nagle's algorithm.
			socket.setNoDelay(true);
			socket.once('error', reject);
		});
	}
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remote/node/wsl.ts]---
Location: vscode-main/src/vs/platform/remote/node/wsl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as os from 'os';
import * as cp from 'child_process';
import { join } from '../../../base/common/path.js';

let hasWSLFeaturePromise: Promise<boolean> | undefined;

export async function hasWSLFeatureInstalled(refresh = false): Promise<boolean> {
	if (hasWSLFeaturePromise === undefined || refresh) {
		hasWSLFeaturePromise = testWSLFeatureInstalled();
	}
	return hasWSLFeaturePromise;
}

async function testWSLFeatureInstalled(): Promise<boolean> {
	const windowsBuildNumber = getWindowsBuildNumber();
	if (windowsBuildNumber === undefined) {
		return false;
	}
	if (windowsBuildNumber >= 22000) {
		const wslExePath = getWSLExecutablePath();
		if (wslExePath) {
			return new Promise<boolean>(s => {
				try {
					cp.execFile(wslExePath, ['--status'], err => s(!err));
				} catch (e) {
					s(false);
				}
			});
		}
	} else {
		const dllPath = getLxssManagerDllPath();
		if (dllPath) {
			try {
				if ((await fs.promises.stat(dllPath)).isFile()) {
					return true;
				}
			} catch (e) {
			}
		}
	}
	return false;
}

function getWindowsBuildNumber(): number | undefined {
	const osVersion = (/(\d+)\.(\d+)\.(\d+)/g).exec(os.release());
	if (osVersion) {
		return parseInt(osVersion[3]);
	}
	return undefined;
}

function getSystem32Path(subPath: string): string | undefined {
	const systemRoot = process.env['SystemRoot'];
	if (systemRoot) {
		const is32ProcessOn64Windows = process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432');
		return join(systemRoot, is32ProcessOn64Windows ? 'Sysnative' : 'System32', subPath);
	}
	return undefined;
}

function getWSLExecutablePath(): string | undefined {
	return getSystem32Path('wsl.exe');
}

/**
 * In builds < 22000 this dll inidcates that WSL is installed
 */
function getLxssManagerDllPath(): string | undefined {
	return getSystem32Path('lxss\\LxssManager.dll');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remote/test/common/remoteHosts.test.ts]---
Location: vscode-main/src/vs/platform/remote/test/common/remoteHosts.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { parseAuthorityWithOptionalPort, parseAuthorityWithPort } from '../../common/remoteHosts.js';

suite('remoteHosts', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('parseAuthority hostname', () => {
		assert.deepStrictEqual(parseAuthorityWithPort('localhost:8080'), { host: 'localhost', port: 8080 });
	});

	test('parseAuthority ipv4', () => {
		assert.deepStrictEqual(parseAuthorityWithPort('127.0.0.1:8080'), { host: '127.0.0.1', port: 8080 });
	});

	test('parseAuthority ipv6', () => {
		assert.deepStrictEqual(parseAuthorityWithPort('[2001:0db8:85a3:0000:0000:8a2e:0370:7334]:8080'), { host: '[2001:0db8:85a3:0000:0000:8a2e:0370:7334]', port: 8080 });
	});

	test('parseAuthorityWithOptionalPort hostname', () => {
		assert.deepStrictEqual(parseAuthorityWithOptionalPort('localhost:8080', 123), { host: 'localhost', port: 8080 });
		assert.deepStrictEqual(parseAuthorityWithOptionalPort('localhost', 123), { host: 'localhost', port: 123 });
	});

	test('parseAuthorityWithOptionalPort ipv4', () => {
		assert.deepStrictEqual(parseAuthorityWithOptionalPort('127.0.0.1:8080', 123), { host: '127.0.0.1', port: 8080 });
		assert.deepStrictEqual(parseAuthorityWithOptionalPort('127.0.0.1', 123), { host: '127.0.0.1', port: 123 });
	});

	test('parseAuthorityWithOptionalPort ipv6', () => {
		assert.deepStrictEqual(parseAuthorityWithOptionalPort('[2001:0db8:85a3:0000:0000:8a2e:0370:7334]:8080', 123), { host: '[2001:0db8:85a3:0000:0000:8a2e:0370:7334]', port: 8080 });
		assert.deepStrictEqual(parseAuthorityWithOptionalPort('[2001:0db8:85a3:0000:0000:8a2e:0370:7334]', 123), { host: '[2001:0db8:85a3:0000:0000:8a2e:0370:7334]', port: 123 });
	});

	test('issue #151748: Error: Remote authorities containing \'+\' need to be resolved!', () => {
		assert.deepStrictEqual(parseAuthorityWithOptionalPort('codespaces+aaaaa-aaaaa-aaaa-aaaaa-a111aa111', 123), { host: 'codespaces+aaaaa-aaaaa-aaaa-aaaaa-a111aa111', port: 123 });
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remote/test/electron-browser/remoteAuthorityResolverService.test.ts]---
Location: vscode-main/src/vs/platform/remote/test/electron-browser/remoteAuthorityResolverService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import product from '../../../product/common/product.js';
import { IProductService } from '../../../product/common/productService.js';
import { RemoteAuthorityResolverError, RemoteAuthorityResolverErrorCode } from '../../common/remoteAuthorityResolver.js';
import { RemoteAuthorityResolverService } from '../../electron-browser/remoteAuthorityResolverService.js';

suite('RemoteAuthorityResolverService', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('issue #147318: RemoteAuthorityResolverError keeps the same type', async () => {
		const productService: IProductService = { _serviceBrand: undefined, ...product };
		// eslint-disable-next-line local/code-no-any-casts
		const service = new RemoteAuthorityResolverService(productService, undefined as any);
		const result = service.resolveAuthority('test+x');
		service._setResolvedAuthorityError('test+x', new RemoteAuthorityResolverError('something', RemoteAuthorityResolverErrorCode.TemporarilyNotAvailable));
		try {
			await result;
			assert.fail();
		} catch (err) {
			assert.strictEqual(RemoteAuthorityResolverError.isTemporarilyNotAvailable(err), true);
		}
		service.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remoteTunnel/common/remoteTunnel.ts]---
Location: vscode-main/src/vs/platform/remoteTunnel/common/remoteTunnel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';
import { Event } from '../../../base/common/event.js';
import { localize } from '../../../nls.js';

export interface IRemoteTunnelSession {
	readonly providerId: string;
	readonly sessionId: string;
	readonly accountLabel: string;
	readonly token?: string;
}

export const IRemoteTunnelService = createDecorator<IRemoteTunnelService>('IRemoteTunnelService');
export interface IRemoteTunnelService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeTunnelStatus: Event<TunnelStatus>;
	getTunnelStatus(): Promise<TunnelStatus>;

	getMode(): Promise<TunnelMode>;
	readonly onDidChangeMode: Event<TunnelMode>;

	readonly onDidTokenFailed: Event<IRemoteTunnelSession | undefined>;
	initialize(mode: TunnelMode): Promise<TunnelStatus>;

	startTunnel(mode: ActiveTunnelMode): Promise<TunnelStatus>;
	stopTunnel(): Promise<void>;
	getTunnelName(): Promise<string | undefined>;

}

export interface ActiveTunnelMode {
	readonly active: true;
	readonly session: IRemoteTunnelSession;
	readonly asService: boolean;
}

export interface InactiveTunnelMode {
	readonly active: false;
}

export const INACTIVE_TUNNEL_MODE: InactiveTunnelMode = { active: false };

/** Saved mode for the tunnel. */
export type TunnelMode = ActiveTunnelMode | InactiveTunnelMode;

export type TunnelStatus = TunnelStates.Connected | TunnelStates.Disconnected | TunnelStates.Connecting | TunnelStates.Uninitialized;

export namespace TunnelStates {
	export interface Uninitialized {
		readonly type: 'uninitialized';
	}
	export interface Connecting {
		readonly type: 'connecting';
		readonly progress?: string;
	}
	export interface Connected {
		readonly type: 'connected';
		readonly info: ConnectionInfo;
		readonly serviceInstallFailed: boolean;
	}
	export interface Disconnected {
		readonly type: 'disconnected';
		readonly onTokenFailed?: IRemoteTunnelSession;
	}
	export const disconnected = (onTokenFailed?: IRemoteTunnelSession): Disconnected => ({ type: 'disconnected', onTokenFailed });
	export const connected = (info: ConnectionInfo, serviceInstallFailed: boolean): Connected => ({ type: 'connected', info, serviceInstallFailed });
	export const connecting = (progress?: string): Connecting => ({ type: 'connecting', progress });
	export const uninitialized: Uninitialized = { type: 'uninitialized' };

}

export interface ConnectionInfo {
	link: string;
	domain: string;
	tunnelName: string;
	isAttached: boolean;
}

export const CONFIGURATION_KEY_PREFIX = 'remote.tunnels.access';
export const CONFIGURATION_KEY_HOST_NAME = CONFIGURATION_KEY_PREFIX + '.hostNameOverride';
export const CONFIGURATION_KEY_PREVENT_SLEEP = CONFIGURATION_KEY_PREFIX + '.preventSleep';

export const LOG_ID = 'remoteTunnelService';
export const LOGGER_NAME = localize('remoteTunnelLog', "Remote Tunnel Service");
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remoteTunnel/electron-browser/remoteTunnelService.ts]---
Location: vscode-main/src/vs/platform/remoteTunnel/electron-browser/remoteTunnelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerSharedProcessRemoteService } from '../../ipc/electron-browser/services.js';
import { IRemoteTunnelService } from '../common/remoteTunnel.js';

registerSharedProcessRemoteService(IRemoteTunnelService, 'remoteTunnel');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remoteTunnel/node/remoteTunnelService.ts]---
Location: vscode-main/src/vs/platform/remoteTunnel/node/remoteTunnelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CONFIGURATION_KEY_HOST_NAME, CONFIGURATION_KEY_PREVENT_SLEEP, ConnectionInfo, IRemoteTunnelSession, IRemoteTunnelService, LOGGER_NAME, LOG_ID, TunnelStates, TunnelStatus, TunnelMode, INACTIVE_TUNNEL_MODE, ActiveTunnelMode } from '../common/remoteTunnel.js';
import { Emitter } from '../../../base/common/event.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { INativeEnvironmentService } from '../../environment/common/environment.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { ILogger, ILoggerService, LogLevelToString } from '../../log/common/log.js';
import { dirname, join } from '../../../base/common/path.js';
import { ChildProcess, StdioOptions, spawn } from 'child_process';
import { IProductService } from '../../product/common/productService.js';
import { isMacintosh, isWindows } from '../../../base/common/platform.js';
import { CancelablePromise, createCancelablePromise, Delayer } from '../../../base/common/async.js';
import { ISharedProcessLifecycleService } from '../../lifecycle/node/sharedProcessLifecycleService.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { localize } from '../../../nls.js';
import { hostname, homedir } from 'os';
import { IStorageService, StorageScope, StorageTarget } from '../../storage/common/storage.js';
import { isString } from '../../../base/common/types.js';
import { StreamSplitter } from '../../../base/node/nodeStreams.js';
import { joinPath } from '../../../base/common/resources.js';

type RemoteTunnelEnablementClassification = {
	owner: 'aeschli';
	comment: 'Reporting when Remote Tunnel access is turned on or off';
	enabled?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Flag indicating if Remote Tunnel Access is enabled or not' };
	service?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Flag indicating if Remote Tunnel Access is installed as a service' };
};

type RemoteTunnelEnablementEvent = {
	enabled: boolean;
	service: boolean;
};

const restartTunnelOnConfigurationChanges: readonly string[] = [
	CONFIGURATION_KEY_HOST_NAME,
	CONFIGURATION_KEY_PREVENT_SLEEP,
];

// This is the session used run the tunnel access.
// if set, the remote tunnel access is currently enabled.
// if not set, the remote tunnel access is currently disabled.
const TUNNEL_ACCESS_SESSION = 'remoteTunnelSession';
// Boolean indicating whether the tunnel should be installed as a service.
const TUNNEL_ACCESS_IS_SERVICE = 'remoteTunnelIsService';

/**
 * This service runs on the shared service. It is running the `code-tunnel` command
 * to make the current machine available for remote access.
 */
export class RemoteTunnelService extends Disposable implements IRemoteTunnelService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidTokenFailedEmitter = new Emitter<IRemoteTunnelSession | undefined>();
	public readonly onDidTokenFailed = this._onDidTokenFailedEmitter.event;

	private readonly _onDidChangeTunnelStatusEmitter = new Emitter<TunnelStatus>();
	public readonly onDidChangeTunnelStatus = this._onDidChangeTunnelStatusEmitter.event;

	private readonly _onDidChangeModeEmitter = new Emitter<TunnelMode>();
	public readonly onDidChangeMode = this._onDidChangeModeEmitter.event;

	private readonly _logger: ILogger;

	/**
	 * "Mode" in the terminal state we want to get to -- started, stopped, and
	 * the attributes associated with each.
	 *
	 * At any given time, work may be ongoing to get `_tunnelStatus` into a
	 * state that reflects the desired `mode`.
	 */
	private _mode: TunnelMode = INACTIVE_TUNNEL_MODE;

	private _tunnelProcess: CancelablePromise<any> | undefined;

	private _tunnelStatus: TunnelStatus;
	private _startTunnelProcessDelayer: Delayer<void>;

	private _tunnelCommand: string | undefined;

	private _initialized = false;

	constructor(
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IProductService private readonly productService: IProductService,
		@INativeEnvironmentService private readonly environmentService: INativeEnvironmentService,
		@ILoggerService loggerService: ILoggerService,
		@ISharedProcessLifecycleService sharedProcessLifecycleService: ISharedProcessLifecycleService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IStorageService private readonly storageService: IStorageService
	) {
		super();
		this._logger = this._register(loggerService.createLogger(joinPath(environmentService.logsHome, `${LOG_ID}.log`), { id: LOG_ID, name: LOGGER_NAME }));
		this._startTunnelProcessDelayer = new Delayer(100);

		this._register(this._logger.onDidChangeLogLevel(l => this._logger.info('Log level changed to ' + LogLevelToString(l))));

		this._register(sharedProcessLifecycleService.onWillShutdown(() => {
			this._tunnelProcess?.cancel();
			this._tunnelProcess = undefined;
			this.dispose();
		}));

		this._register(configurationService.onDidChangeConfiguration(e => {
			if (restartTunnelOnConfigurationChanges.some(c => e.affectsConfiguration(c))) {
				this._startTunnelProcessDelayer.trigger(() => this.updateTunnelProcess());
			}
		}));

		this._mode = this._restoreMode();
		this._tunnelStatus = TunnelStates.uninitialized;
	}

	public async getTunnelStatus(): Promise<TunnelStatus> {
		return this._tunnelStatus;
	}

	private setTunnelStatus(tunnelStatus: TunnelStatus) {
		this._tunnelStatus = tunnelStatus;
		this._onDidChangeTunnelStatusEmitter.fire(tunnelStatus);
	}

	private setMode(mode: TunnelMode) {
		if (isSameMode(this._mode, mode)) {
			return;
		}

		this._mode = mode;
		this._storeMode(mode);
		this._onDidChangeModeEmitter.fire(this._mode);
		if (mode.active) {
			this._logger.info(`Session updated: ${mode.session.accountLabel} (${mode.session.providerId}) (service=${mode.asService})`);
			if (mode.session.token) {
				this._logger.info(`Session token updated: ${mode.session.accountLabel} (${mode.session.providerId})`);
			}
		} else {
			this._logger.info(`Session reset`);
		}
	}

	getMode(): Promise<TunnelMode> {
		return Promise.resolve(this._mode);
	}

	async initialize(mode: TunnelMode): Promise<TunnelStatus> {
		if (this._initialized) {
			return this._tunnelStatus;
		}
		this._initialized = true;
		this.setMode(mode);
		try {
			await this._startTunnelProcessDelayer.trigger(() => this.updateTunnelProcess());
		} catch (e) {
			this._logger.error(e);
		}
		return this._tunnelStatus;
	}

	private readonly defaultOnOutput = (a: string, isErr: boolean) => {
		if (isErr) {
			this._logger.error(a);
		} else {
			this._logger.info(a);
		}
	};

	private getTunnelCommandLocation() {
		if (!this._tunnelCommand) {
			let binParentLocation;
			if (isMacintosh) {
				// appRoot = /Applications/Visual Studio Code - Insiders.app/Contents/Resources/app
				// bin = /Applications/Visual Studio Code - Insiders.app/Contents/Resources/app/bin
				binParentLocation = this.environmentService.appRoot;
			} else if (isWindows) {
				if (this.productService.quality === 'insider') {
					// appRoot = C:\Users\<name>\AppData\Local\Programs\Microsoft VS Code Insiders\<version>\resources\app
					// bin = C:\Users\<name>\AppData\Local\Programs\Microsoft VS Code Insiders\bin
					binParentLocation = dirname(dirname(dirname(this.environmentService.appRoot)));
				} else {
					// appRoot = C:\Users\<name>\AppData\Local\Programs\Microsoft VS Code Insiders\resources\app
					// bin = C:\Users\<name>\AppData\Local\Programs\Microsoft VS Code Insiders\bin
					binParentLocation = dirname(dirname(this.environmentService.appRoot));
				}
			} else {
				// appRoot = /usr/share/code-insiders/resources/app
				// bin = /usr/share/code-insiders/bin
				binParentLocation = dirname(dirname(this.environmentService.appRoot));
			}
			this._tunnelCommand = join(binParentLocation, 'bin', `${this.productService.tunnelApplicationName}${isWindows ? '.exe' : ''}`);
		}
		return this._tunnelCommand;
	}

	async startTunnel(mode: ActiveTunnelMode): Promise<TunnelStatus> {
		if (isSameMode(this._mode, mode) && this._tunnelStatus.type !== 'disconnected') {
			return this._tunnelStatus;
		}

		this.setMode(mode);

		try {
			await this._startTunnelProcessDelayer.trigger(() => this.updateTunnelProcess());
		} catch (e) {
			this._logger.error(e);
		}
		return this._tunnelStatus;
	}


	async stopTunnel(): Promise<void> {
		if (this._tunnelProcess) {
			this._tunnelProcess.cancel();
			this._tunnelProcess = undefined;
		}

		if (this._mode.active) {
			// Be careful to only uninstall the service if we're the ones who installed it:
			const needsServiceUninstall = this._mode.asService;
			this.setMode(INACTIVE_TUNNEL_MODE);

			try {
				if (needsServiceUninstall) {
					this.runCodeTunnelCommand('uninstallService', ['service', 'uninstall']);
				}
			} catch (e) {
				this._logger.error(e);
			}
		}

		try {
			await this.runCodeTunnelCommand('stop', ['kill']);
		} catch (e) {
			this._logger.error(e);
		}

		this.setTunnelStatus(TunnelStates.disconnected());
	}

	private async updateTunnelProcess(): Promise<void> {
		this.telemetryService.publicLog2<RemoteTunnelEnablementEvent, RemoteTunnelEnablementClassification>('remoteTunnel.enablement', {
			enabled: this._mode.active,
			service: this._mode.active && this._mode.asService,
		});

		if (this._tunnelProcess) {
			this._tunnelProcess.cancel();
			this._tunnelProcess = undefined;
		}

		let output = '';
		let isServiceInstalled = false;
		const onOutput = (a: string, isErr: boolean) => {
			if (isErr) {
				this._logger.error(a);
			} else {
				output += a;
			}
			if (!this.environmentService.isBuilt && a.startsWith('   Compiling')) {
				this.setTunnelStatus(TunnelStates.connecting(localize('remoteTunnelService.building', 'Building CLI from sources')));
			}
		};

		const statusProcess = this.runCodeTunnelCommand('status', ['status'], onOutput);
		this._tunnelProcess = statusProcess;
		try {
			await statusProcess;
			if (this._tunnelProcess !== statusProcess) {
				return;
			}

			// split and find the line, since in dev builds additional noise is
			// added by cargo to the output.
			let status: {
				service_installed: boolean;
				tunnel: object | null;
			};

			try {
				status = JSON.parse(output.trim().split('\n').find(l => l.startsWith('{'))!);
			} catch (e) {
				this._logger.error(`Could not parse status output: ${JSON.stringify(output.trim())}`);
				this.setTunnelStatus(TunnelStates.disconnected());
				return;
			}

			isServiceInstalled = status.service_installed;
			this._logger.info(status.tunnel ? 'Other tunnel running, attaching...' : 'No other tunnel running');

			// If a tunnel is running but the mode isn't "active", we'll still attach
			// to the tunnel to show its state in the UI. If neither are true, disconnect
			if (!status.tunnel && !this._mode.active) {
				this.setTunnelStatus(TunnelStates.disconnected());
				return;
			}
		} catch (e) {
			this._logger.error(e);
			this.setTunnelStatus(TunnelStates.disconnected());
			return;
		} finally {
			if (this._tunnelProcess === statusProcess) {
				this._tunnelProcess = undefined;
			}
		}

		const session = this._mode.active ? this._mode.session : undefined;
		if (session && session.token) {
			const token = session.token;
			this.setTunnelStatus(TunnelStates.connecting(localize({ key: 'remoteTunnelService.authorizing', comment: ['{0} is a user account name, {1} a provider name (e.g. Github)'] }, 'Connecting as {0} ({1})', session.accountLabel, session.providerId)));
			const onLoginOutput = (a: string, isErr: boolean) => {
				a = a.replaceAll(token, '*'.repeat(4));
				onOutput(a, isErr);
			};
			const loginProcess = this.runCodeTunnelCommand('login', ['user', 'login', '--provider', session.providerId, '--log', LogLevelToString(this._logger.getLevel())], onLoginOutput, { VSCODE_CLI_ACCESS_TOKEN: token });
			this._tunnelProcess = loginProcess;
			try {
				await loginProcess;
				if (this._tunnelProcess !== loginProcess) {
					return;
				}
			} catch (e) {
				this._logger.error(e);
				this._tunnelProcess = undefined;
				this._onDidTokenFailedEmitter.fire(session);
				this.setTunnelStatus(TunnelStates.disconnected(session));
				return;
			}
		}

		const hostName = this._getTunnelName();
		if (hostName) {
			this.setTunnelStatus(TunnelStates.connecting(localize({ key: 'remoteTunnelService.openTunnelWithName', comment: ['{0} is a tunnel name'] }, 'Opening tunnel {0}', hostName)));
		} else {
			this.setTunnelStatus(TunnelStates.connecting(localize('remoteTunnelService.openTunnel', 'Opening tunnel')));
		}
		const args = ['--accept-server-license-terms', '--log', LogLevelToString(this._logger.getLevel())];
		if (hostName) {
			args.push('--name', hostName);
		} else {
			args.push('--random-name');
		}

		let serviceInstallFailed = false;
		if (this._mode.active && this._mode.asService && !isServiceInstalled) {
			// I thought about calling `code tunnel kill` here, but having multiple
			// tunnel processes running is pretty much idempotent. If there's
			// another tunnel process running, the service process will
			// take over when it exits, no hard feelings.
			serviceInstallFailed = await this.installTunnelService(args) === false;
		}

		return this.serverOrAttachTunnel(session, args, serviceInstallFailed);
	}

	private async installTunnelService(args: readonly string[]) {
		let status: number;
		try {
			status = await this.runCodeTunnelCommand('serviceInstall', ['service', 'install', ...args]);
		} catch (e) {
			this._logger.error(e);
			status = 1;
		}

		if (status !== 0) {
			const msg = localize('remoteTunnelService.serviceInstallFailed', 'Failed to install tunnel as a service, starting in session...');
			this._logger.warn(msg);
			this.setTunnelStatus(TunnelStates.connecting(msg));
			return false;
		}

		return true;
	}

	private async serverOrAttachTunnel(session: IRemoteTunnelSession | undefined, args: string[], serviceInstallFailed: boolean) {
		args.push('--parent-process-id', String(process.pid));

		if (this._preventSleep()) {
			args.push('--no-sleep');
		}

		let isAttached = false;
		const serveCommand = this.runCodeTunnelCommand('tunnel', args, (message: string, isErr: boolean) => {
			if (isErr) {
				this._logger.error(message);
			} else {
				this._logger.info(message);
			}

			if (message.includes('Connected to an existing tunnel process')) {
				isAttached = true;
			}

			const m = message.match(/Open this link in your browser (https:\/\/([^\/\s]+)\/([^\/\s]+)\/([^\/\s]+))/);
			if (m) {
				const info: ConnectionInfo = { link: m[1], domain: m[2], tunnelName: m[4], isAttached };
				this.setTunnelStatus(TunnelStates.connected(info, serviceInstallFailed));
			} else if (message.match(/error refreshing token/)) {
				serveCommand.cancel();
				this._onDidTokenFailedEmitter.fire(session);
				this.setTunnelStatus(TunnelStates.disconnected(session));
			}
		});
		this._tunnelProcess = serveCommand;
		serveCommand.finally(() => {
			if (serveCommand === this._tunnelProcess) {
				// process exited unexpectedly
				this._logger.info(`tunnel process terminated`);
				this._tunnelProcess = undefined;
				this._mode = INACTIVE_TUNNEL_MODE;

				this.setTunnelStatus(TunnelStates.disconnected());
			}
		});
	}

	private runCodeTunnelCommand(logLabel: string, commandArgs: string[], onOutput: (message: string, isError: boolean) => void = this.defaultOnOutput, env?: Record<string, string>): CancelablePromise<number> {
		return createCancelablePromise<number>(token => {
			return new Promise((resolve, reject) => {
				if (token.isCancellationRequested) {
					resolve(-1);
				}
				let tunnelProcess: ChildProcess | undefined;
				const stdio: StdioOptions = ['ignore', 'pipe', 'pipe'];

				token.onCancellationRequested(() => {
					if (tunnelProcess) {
						this._logger.info(`${logLabel} terminating(${tunnelProcess.pid})`);
						tunnelProcess.kill();
					}
				});
				if (!this.environmentService.isBuilt) {
					onOutput('Building tunnel CLI from sources and run\n', false);
					onOutput(`${logLabel} Spawning: cargo run -- tunnel ${commandArgs.join(' ')}\n`, false);
					tunnelProcess = spawn('cargo', ['run', '--', 'tunnel', ...commandArgs], { cwd: join(this.environmentService.appRoot, 'cli'), stdio, env: { ...process.env, RUST_BACKTRACE: '1', ...env } });
				} else {
					onOutput('Running tunnel CLI\n', false);
					const tunnelCommand = this.getTunnelCommandLocation();
					onOutput(`${logLabel} Spawning: ${tunnelCommand} tunnel ${commandArgs.join(' ')}\n`, false);
					tunnelProcess = spawn(tunnelCommand, ['tunnel', ...commandArgs], { cwd: homedir(), stdio, env: { ...process.env, ...env } });
				}

				tunnelProcess.stdout!.pipe(new StreamSplitter('\n')).on('data', data => {
					if (tunnelProcess) {
						const message = data.toString();
						onOutput(message, false);
					}
				});
				tunnelProcess.stderr!.pipe(new StreamSplitter('\n')).on('data', data => {
					if (tunnelProcess) {
						const message = data.toString();
						onOutput(message, true);
					}
				});
				tunnelProcess.on('exit', e => {
					if (tunnelProcess) {
						onOutput(`${logLabel} exit(${tunnelProcess.pid}): + ${e} `, false);
						tunnelProcess = undefined;
						resolve(e || 0);
					}
				});
				tunnelProcess.on('error', e => {
					if (tunnelProcess) {
						onOutput(`${logLabel} error(${tunnelProcess.pid}): + ${e} `, true);
						tunnelProcess = undefined;
						reject();
					}
				});
			});
		});
	}

	public async getTunnelName(): Promise<string | undefined> {
		return this._getTunnelName();
	}

	private _preventSleep() {
		return !!this.configurationService.getValue<boolean>(CONFIGURATION_KEY_PREVENT_SLEEP);
	}

	private _getTunnelName(): string | undefined {
		let name = this.configurationService.getValue<string>(CONFIGURATION_KEY_HOST_NAME) || hostname();
		name = name.replace(/^-+/g, '').replace(/[^\w-]/g, '').substring(0, 20);
		return name || undefined;
	}

	private _restoreMode(): TunnelMode {
		try {
			const tunnelAccessSession = this.storageService.get(TUNNEL_ACCESS_SESSION, StorageScope.APPLICATION);
			const asService = this.storageService.getBoolean(TUNNEL_ACCESS_IS_SERVICE, StorageScope.APPLICATION, false);
			if (tunnelAccessSession) {
				const session = JSON.parse(tunnelAccessSession) as IRemoteTunnelSession;
				if (session && isString(session.accountLabel) && isString(session.sessionId) && isString(session.providerId)) {
					return { active: true, session, asService };
				}
				this._logger.error('Problems restoring session from storage, invalid format', session);
			}
		} catch (e) {
			this._logger.error('Problems restoring session from storage', e);
		}
		return INACTIVE_TUNNEL_MODE;
	}

	private _storeMode(mode: TunnelMode): void {
		if (mode.active) {
			const sessionWithoutToken = {
				providerId: mode.session.providerId, sessionId: mode.session.sessionId, accountLabel: mode.session.accountLabel
			};
			this.storageService.store(TUNNEL_ACCESS_SESSION, JSON.stringify(sessionWithoutToken), StorageScope.APPLICATION, StorageTarget.MACHINE);
			this.storageService.store(TUNNEL_ACCESS_IS_SERVICE, mode.asService, StorageScope.APPLICATION, StorageTarget.MACHINE);
		} else {
			this.storageService.remove(TUNNEL_ACCESS_SESSION, StorageScope.APPLICATION);
			this.storageService.remove(TUNNEL_ACCESS_IS_SERVICE, StorageScope.APPLICATION);
		}
	}
}

function isSameSession(a1: IRemoteTunnelSession | undefined, a2: IRemoteTunnelSession | undefined): boolean {
	if (a1 && a2) {
		return a1.sessionId === a2.sessionId && a1.providerId === a2.providerId && a1.token === a2.token;
	}
	return a1 === a2;
}

const isSameMode = (a: TunnelMode, b: TunnelMode) => {
	if (a.active !== b.active) {
		return false;
	} else if (a.active && b.active) {
		return a.asService === b.asService && isSameSession(a.session, b.session);
	} else {
		return true;
	}
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/request/common/request.ts]---
Location: vscode-main/src/vs/platform/request/common/request.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { streamToBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { getErrorMessage } from '../../../base/common/errors.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { IHeaders, IRequestContext, IRequestOptions } from '../../../base/parts/request/common/request.js';
import { localize } from '../../../nls.js';
import { ConfigurationScope, Extensions, IConfigurationNode, IConfigurationRegistry } from '../../configuration/common/configurationRegistry.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { Registry } from '../../registry/common/platform.js';

export const IRequestService = createDecorator<IRequestService>('requestService');

export interface AuthInfo {
	isProxy: boolean;
	scheme: string;
	host: string;
	port: number;
	realm: string;
	attempt: number;
}

export interface Credentials {
	username: string;
	password: string;
}

export interface IRequestService {
	readonly _serviceBrand: undefined;

	request(options: IRequestOptions, token: CancellationToken): Promise<IRequestContext>;

	resolveProxy(url: string): Promise<string | undefined>;
	lookupAuthorization(authInfo: AuthInfo): Promise<Credentials | undefined>;
	lookupKerberosAuthorization(url: string): Promise<string | undefined>;
	loadCertificates(): Promise<string[]>;
}

class LoggableHeaders {

	private headers: IHeaders | undefined;

	constructor(private readonly original: IHeaders) { }

	toJSON(): any {
		if (!this.headers) {
			const headers = Object.create(null);
			for (const key in this.original) {
				if (key.toLowerCase() === 'authorization' || key.toLowerCase() === 'proxy-authorization') {
					headers[key] = '*****';
				} else {
					headers[key] = this.original[key];
				}
			}
			this.headers = headers;
		}
		return this.headers;
	}

}

export abstract class AbstractRequestService extends Disposable implements IRequestService {

	declare readonly _serviceBrand: undefined;

	private counter = 0;

	constructor(protected readonly logService: ILogService) {
		super();
	}

	protected async logAndRequest(options: IRequestOptions, request: () => Promise<IRequestContext>): Promise<IRequestContext> {
		const prefix = `#${++this.counter}: ${options.url}`;
		this.logService.trace(`${prefix} - begin`, options.type, new LoggableHeaders(options.headers ?? {}));
		try {
			const result = await request();
			this.logService.trace(`${prefix} - end`, options.type, result.res.statusCode, result.res.headers);
			return result;
		} catch (error) {
			this.logService.error(`${prefix} - error`, options.type, getErrorMessage(error));
			throw error;
		}
	}

	abstract request(options: IRequestOptions, token: CancellationToken): Promise<IRequestContext>;
	abstract resolveProxy(url: string): Promise<string | undefined>;
	abstract lookupAuthorization(authInfo: AuthInfo): Promise<Credentials | undefined>;
	abstract lookupKerberosAuthorization(url: string): Promise<string | undefined>;
	abstract loadCertificates(): Promise<string[]>;
}

export function isSuccess(context: IRequestContext): boolean {
	return (context.res.statusCode && context.res.statusCode >= 200 && context.res.statusCode < 300) || context.res.statusCode === 1223;
}

export function isClientError(context: IRequestContext): boolean {
	return !!context.res.statusCode && context.res.statusCode >= 400 && context.res.statusCode < 500;
}

export function isServerError(context: IRequestContext): boolean {
	return !!context.res.statusCode && context.res.statusCode >= 500 && context.res.statusCode < 600;
}

export function hasNoContent(context: IRequestContext): boolean {
	return context.res.statusCode === 204;
}

export async function asText(context: IRequestContext): Promise<string | null> {
	if (hasNoContent(context)) {
		return null;
	}
	const buffer = await streamToBuffer(context.stream);
	return buffer.toString();
}

export async function asTextOrError(context: IRequestContext): Promise<string | null> {
	if (!isSuccess(context)) {
		throw new Error('Server returned ' + context.res.statusCode);
	}
	return asText(context);
}

export async function asJson<T = {}>(context: IRequestContext): Promise<T | null> {
	if (!isSuccess(context)) {
		throw new Error('Server returned ' + context.res.statusCode);
	}
	if (hasNoContent(context)) {
		return null;
	}
	const buffer = await streamToBuffer(context.stream);
	const str = buffer.toString();
	try {
		return JSON.parse(str);
	} catch (err) {
		err.message += ':\n' + str;
		throw err;
	}
}

export function updateProxyConfigurationsScope(useHostProxy: boolean, useHostProxyDefault: boolean): void {
	registerProxyConfigurations(useHostProxy, useHostProxyDefault);
}

export const USER_LOCAL_AND_REMOTE_SETTINGS = [
	'http.proxy',
	'http.proxyStrictSSL',
	'http.proxyKerberosServicePrincipal',
	'http.noProxy',
	'http.proxyAuthorization',
	'http.proxySupport',
	'http.systemCertificates',
	'http.systemCertificatesNode',
	'http.experimental.systemCertificatesV2',
	'http.fetchAdditionalSupport',
	'http.experimental.networkInterfaceCheckInterval',
];

export const systemCertificatesNodeDefault = false;

let proxyConfiguration: IConfigurationNode[] = [];
let previousUseHostProxy: boolean | undefined = undefined;
let previousUseHostProxyDefault: boolean | undefined = undefined;
function registerProxyConfigurations(useHostProxy = true, useHostProxyDefault = true): void {
	if (previousUseHostProxy === useHostProxy && previousUseHostProxyDefault === useHostProxyDefault) {
		return;
	}

	previousUseHostProxy = useHostProxy;
	previousUseHostProxyDefault = useHostProxyDefault;

	const configurationRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
	const oldProxyConfiguration = proxyConfiguration;
	proxyConfiguration = [
		{
			id: 'http',
			order: 15,
			title: localize('httpConfigurationTitle', "HTTP"),
			type: 'object',
			scope: ConfigurationScope.MACHINE,
			properties: {
				'http.useLocalProxyConfiguration': {
					type: 'boolean',
					default: useHostProxyDefault,
					markdownDescription: localize('useLocalProxy', "Controls whether in the remote extension host the local proxy configuration should be used. This setting only applies as a remote setting during [remote development](https://aka.ms/vscode-remote)."),
					restricted: true
				},
			}
		},
		{
			id: 'http',
			order: 15,
			title: localize('httpConfigurationTitle', "HTTP"),
			type: 'object',
			scope: ConfigurationScope.APPLICATION,
			properties: {
				'http.electronFetch': {
					type: 'boolean',
					default: false,
					description: localize('electronFetch', "Controls whether use of Electron's fetch implementation instead of Node.js' should be enabled. All local extensions will get Electron's fetch implementation for the global fetch API."),
					restricted: true
				},
			}
		},
		{
			id: 'http',
			order: 15,
			title: localize('httpConfigurationTitle', "HTTP"),
			type: 'object',
			scope: useHostProxy ? ConfigurationScope.APPLICATION : ConfigurationScope.MACHINE,
			properties: {
				'http.proxy': {
					type: 'string',
					pattern: '^(https?|socks|socks4a?|socks5h?)://([^:]*(:[^@]*)?@)?([^:]+|\\[[:0-9a-fA-F]+\\])(:\\d+)?/?$|^$',
					markdownDescription: localize('proxy', "The proxy setting to use. If not set, will be inherited from the `http_proxy` and `https_proxy` environment variables. When during [remote development](https://aka.ms/vscode-remote) the {0} setting is disabled this setting can be configured in the local and the remote settings separately.", '`#http.useLocalProxyConfiguration#`'),
					restricted: true
				},
				'http.proxyStrictSSL': {
					type: 'boolean',
					default: true,
					markdownDescription: localize('strictSSL', "Controls whether the proxy server certificate should be verified against the list of supplied CAs. When during [remote development](https://aka.ms/vscode-remote) the {0} setting is disabled this setting can be configured in the local and the remote settings separately.", '`#http.useLocalProxyConfiguration#`'),
					restricted: true
				},
				'http.proxyKerberosServicePrincipal': {
					type: 'string',
					markdownDescription: localize('proxyKerberosServicePrincipal', "Overrides the principal service name for Kerberos authentication with the HTTP proxy. A default based on the proxy hostname is used when this is not set. When during [remote development](https://aka.ms/vscode-remote) the {0} setting is disabled this setting can be configured in the local and the remote settings separately.", '`#http.useLocalProxyConfiguration#`'),
					restricted: true
				},
				'http.noProxy': {
					type: 'array',
					items: { type: 'string' },
					markdownDescription: localize('noProxy', "Specifies domain names for which proxy settings should be ignored for HTTP/HTTPS requests. When during [remote development](https://aka.ms/vscode-remote) the {0} setting is disabled this setting can be configured in the local and the remote settings separately.", '`#http.useLocalProxyConfiguration#`'),
					restricted: true
				},
				'http.proxyAuthorization': {
					type: ['null', 'string'],
					default: null,
					markdownDescription: localize('proxyAuthorization', "The value to send as the `Proxy-Authorization` header for every network request. When during [remote development](https://aka.ms/vscode-remote) the {0} setting is disabled this setting can be configured in the local and the remote settings separately.", '`#http.useLocalProxyConfiguration#`'),
					restricted: true
				},
				'http.proxySupport': {
					type: 'string',
					enum: ['off', 'on', 'fallback', 'override'],
					enumDescriptions: [
						localize('proxySupportOff', "Disable proxy support for extensions."),
						localize('proxySupportOn', "Enable proxy support for extensions."),
						localize('proxySupportFallback', "Enable proxy support for extensions, fall back to request options, when no proxy found."),
						localize('proxySupportOverride', "Enable proxy support for extensions, override request options."),
					],
					default: 'override',
					markdownDescription: localize('proxySupport', "Use the proxy support for extensions. When during [remote development](https://aka.ms/vscode-remote) the {0} setting is disabled this setting can be configured in the local and the remote settings separately.", '`#http.useLocalProxyConfiguration#`'),
					restricted: true
				},
				'http.systemCertificates': {
					type: 'boolean',
					default: true,
					markdownDescription: localize('systemCertificates', "Controls whether CA certificates should be loaded from the OS. On Windows and macOS, a reload of the window is required after turning this off. When during [remote development](https://aka.ms/vscode-remote) the {0} setting is disabled this setting can be configured in the local and the remote settings separately.", '`#http.useLocalProxyConfiguration#`'),
					restricted: true
				},
				'http.systemCertificatesNode': {
					type: 'boolean',
					tags: ['experimental'],
					default: systemCertificatesNodeDefault,
					markdownDescription: localize('systemCertificatesNode', "Controls whether system certificates should be loaded using Node.js built-in support. Reload the window after changing this setting. When during [remote development](https://aka.ms/vscode-remote) the {0} setting is disabled this setting can be configured in the local and the remote settings separately.", '`#http.useLocalProxyConfiguration#`'),
					restricted: true,
					experiment: {
						mode: 'auto'
					}
				},
				'http.experimental.systemCertificatesV2': {
					type: 'boolean',
					tags: ['experimental'],
					default: false,
					markdownDescription: localize('systemCertificatesV2', "Controls whether experimental loading of CA certificates from the OS should be enabled. This uses a more general approach than the default implementation. When during [remote development](https://aka.ms/vscode-remote) the {0} setting is disabled this setting can be configured in the local and the remote settings separately.", '`#http.useLocalProxyConfiguration#`'),
					restricted: true
				},
				'http.fetchAdditionalSupport': {
					type: 'boolean',
					default: true,
					markdownDescription: localize('fetchAdditionalSupport', "Controls whether Node.js' fetch implementation should be extended with additional support. Currently proxy support ({1}) and system certificates ({2}) are added when the corresponding settings are enabled. When during [remote development](https://aka.ms/vscode-remote) the {0} setting is disabled this setting can be configured in the local and the remote settings separately.", '`#http.useLocalProxyConfiguration#`', '`#http.proxySupport#`', '`#http.systemCertificates#`'),
					restricted: true
				},
				'http.experimental.networkInterfaceCheckInterval': {
					type: 'number',
					default: 300,
					minimum: -1,
					tags: ['experimental'],
					markdownDescription: localize('networkInterfaceCheckInterval', "Controls the interval in seconds for checking network interface changes to invalidate the proxy cache. Set to -1 to disable. When during [remote development](https://aka.ms/vscode-remote) the {0} setting is disabled this setting can be configured in the local and the remote settings separately.", '`#http.useLocalProxyConfiguration#`'),
					restricted: true,
					experiment: {
						mode: 'auto'
					}
				}
			}
		}
	];
	configurationRegistry.updateConfigurations({ add: proxyConfiguration, remove: oldProxyConfiguration });
}

registerProxyConfigurations();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/request/common/requestIpc.ts]---
Location: vscode-main/src/vs/platform/request/common/requestIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { bufferToStream, streamToBuffer, VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Event } from '../../../base/common/event.js';
import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { IHeaders, IRequestContext, IRequestOptions } from '../../../base/parts/request/common/request.js';
import { AuthInfo, Credentials, IRequestService } from './request.js';

type RequestResponse = [
	{
		headers: IHeaders;
		statusCode?: number;
	},
	VSBuffer
];

export class RequestChannel implements IServerChannel {

	constructor(private readonly service: IRequestService) { }

	listen(context: any, event: string): Event<any> {
		throw new Error('Invalid listen');
	}

	call(context: any, command: string, args?: any, token: CancellationToken = CancellationToken.None): Promise<any> {
		switch (command) {
			case 'request': return this.service.request(args[0], token)
				.then(async ({ res, stream }) => {
					const buffer = await streamToBuffer(stream);
					return <RequestResponse>[{ statusCode: res.statusCode, headers: res.headers }, buffer];
				});
			case 'resolveProxy': return this.service.resolveProxy(args[0]);
			case 'lookupAuthorization': return this.service.lookupAuthorization(args[0]);
			case 'lookupKerberosAuthorization': return this.service.lookupKerberosAuthorization(args[0]);
			case 'loadCertificates': return this.service.loadCertificates();
		}
		throw new Error('Invalid call');
	}
}

export class RequestChannelClient implements IRequestService {

	declare readonly _serviceBrand: undefined;

	constructor(private readonly channel: IChannel) { }

	async request(options: IRequestOptions, token: CancellationToken): Promise<IRequestContext> {
		const [res, buffer] = await this.channel.call<RequestResponse>('request', [options], token);
		return { res, stream: bufferToStream(buffer) };
	}

	async resolveProxy(url: string): Promise<string | undefined> {
		return this.channel.call<string | undefined>('resolveProxy', [url]);
	}

	async lookupAuthorization(authInfo: AuthInfo): Promise<Credentials | undefined> {
		return this.channel.call<{ username: string; password: string } | undefined>('lookupAuthorization', [authInfo]);
	}

	async lookupKerberosAuthorization(url: string): Promise<string | undefined> {
		return this.channel.call<string | undefined>('lookupKerberosAuthorization', [url]);
	}

	async loadCertificates(): Promise<string[]> {
		return this.channel.call<string[]>('loadCertificates');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/request/electron-utility/requestService.ts]---
Location: vscode-main/src/vs/platform/request/electron-utility/requestService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { net } from 'electron';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { IRequestContext, IRequestOptions } from '../../../base/parts/request/common/request.js';
import { IRawRequestFunction, RequestService as NodeRequestService } from '../node/requestService.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { INativeEnvironmentService } from '../../environment/common/environment.js';
import { ILogService } from '../../log/common/log.js';

function getRawRequest(options: IRequestOptions): IRawRequestFunction {
	// eslint-disable-next-line local/code-no-any-casts
	return net.request as any as IRawRequestFunction;
}

export class RequestService extends NodeRequestService {

	constructor(
		@IConfigurationService configurationService: IConfigurationService,
		@INativeEnvironmentService environmentService: INativeEnvironmentService,
		@ILogService logService: ILogService,
	) {
		super('local', configurationService, environmentService, logService);
	}

	override request(options: IRequestOptions, token: CancellationToken): Promise<IRequestContext> {
		return super.request({ ...(options || {}), getRawRequest, isChromiumNetwork: true }, token);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/request/node/proxy.ts]---
Location: vscode-main/src/vs/platform/request/node/proxy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { parse as parseUrl, Url } from 'url';
import { isBoolean } from '../../../base/common/types.js';

export type Agent = any;

function getSystemProxyURI(requestURL: Url, env: typeof process.env): string | null {
	if (requestURL.protocol === 'http:') {
		return env.HTTP_PROXY || env.http_proxy || null;
	} else if (requestURL.protocol === 'https:') {
		return env.HTTPS_PROXY || env.https_proxy || env.HTTP_PROXY || env.http_proxy || null;
	}

	return null;
}

export interface IOptions {
	proxyUrl?: string;
	strictSSL?: boolean;
}

export async function getProxyAgent(rawRequestURL: string, env: typeof process.env, options: IOptions = {}): Promise<Agent> {
	const requestURL = parseUrl(rawRequestURL);
	const proxyURL = options.proxyUrl || getSystemProxyURI(requestURL, env);

	if (!proxyURL) {
		return null;
	}

	const proxyEndpoint = parseUrl(proxyURL);

	if (!/^https?:$/.test(proxyEndpoint.protocol || '')) {
		return null;
	}

	const opts = {
		host: proxyEndpoint.hostname || '',
		port: (proxyEndpoint.port ? +proxyEndpoint.port : 0) || (proxyEndpoint.protocol === 'https' ? 443 : 80),
		auth: proxyEndpoint.auth,
		rejectUnauthorized: isBoolean(options.strictSSL) ? options.strictSSL : true,
	};

	if (requestURL.protocol === 'http:') {
		const { default: mod } = await import('http-proxy-agent');
		return new mod.HttpProxyAgent(proxyURL, opts);
	} else {
		const { default: mod } = await import('https-proxy-agent');
		return new mod.HttpsProxyAgent(proxyURL, opts);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/request/node/requestService.ts]---
Location: vscode-main/src/vs/platform/request/node/requestService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as http from 'http';
import type * as https from 'https';
import { parse as parseUrl } from 'url';
import { Promises } from '../../../base/common/async.js';
import { streamToBufferReadableStream } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { CancellationError, getErrorMessage } from '../../../base/common/errors.js';
import * as streams from '../../../base/common/stream.js';
import { isBoolean, isNumber } from '../../../base/common/types.js';
import { IRequestContext, IRequestOptions } from '../../../base/parts/request/common/request.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { INativeEnvironmentService } from '../../environment/common/environment.js';
import { getResolvedShellEnv } from '../../shell/node/shellEnv.js';
import { ILogService } from '../../log/common/log.js';
import { AbstractRequestService, AuthInfo, Credentials, IRequestService, systemCertificatesNodeDefault } from '../common/request.js';
import { Agent, getProxyAgent } from './proxy.js';
import { createGunzip } from 'zlib';

export interface IRawRequestFunction {
	(options: http.RequestOptions, callback?: (res: http.IncomingMessage) => void): http.ClientRequest;
}

export interface NodeRequestOptions extends IRequestOptions {
	agent?: Agent;
	strictSSL?: boolean;
	isChromiumNetwork?: boolean;
	getRawRequest?(options: IRequestOptions): IRawRequestFunction;
}

/**
 * This service exposes the `request` API, while using the global
 * or configured proxy settings.
 */
export class RequestService extends AbstractRequestService implements IRequestService {

	declare readonly _serviceBrand: undefined;

	private proxyUrl?: string;
	private strictSSL: boolean | undefined;
	private authorization?: string;
	private shellEnvErrorLogged?: boolean;

	constructor(
		private readonly machine: 'local' | 'remote',
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@INativeEnvironmentService private readonly environmentService: INativeEnvironmentService,
		@ILogService logService: ILogService,
	) {
		super(logService);
		this.configure();
		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('http')) {
				this.configure();
			}
		}));
	}

	private configure() {
		this.proxyUrl = this.getConfigValue<string>('http.proxy');
		this.strictSSL = !!this.getConfigValue<boolean>('http.proxyStrictSSL');
		this.authorization = this.getConfigValue<string>('http.proxyAuthorization');
	}

	async request(options: NodeRequestOptions, token: CancellationToken): Promise<IRequestContext> {
		const { proxyUrl, strictSSL } = this;

		let shellEnv: typeof process.env | undefined = undefined;
		try {
			shellEnv = await getResolvedShellEnv(this.configurationService, this.logService, this.environmentService.args, process.env);
		} catch (error) {
			if (!this.shellEnvErrorLogged) {
				this.shellEnvErrorLogged = true;
				this.logService.error(`resolving shell environment failed`, getErrorMessage(error));
			}
		}

		const env = {
			...process.env,
			...shellEnv
		};
		const agent = options.agent ? options.agent : await getProxyAgent(options.url || '', env, { proxyUrl, strictSSL });

		options.agent = agent;
		options.strictSSL = strictSSL;

		if (this.authorization) {
			options.headers = {
				...(options.headers || {}),
				'Proxy-Authorization': this.authorization
			};
		}

		return this.logAndRequest(options, () => nodeRequest(options, token));
	}

	async resolveProxy(url: string): Promise<string | undefined> {
		return undefined; // currently not implemented in node
	}

	async lookupAuthorization(authInfo: AuthInfo): Promise<Credentials | undefined> {
		return undefined; // currently not implemented in node
	}

	async lookupKerberosAuthorization(urlStr: string): Promise<string | undefined> {
		try {
			const spnConfig = this.getConfigValue<string>('http.proxyKerberosServicePrincipal');
			const response = await lookupKerberosAuthorization(urlStr, spnConfig, this.logService, 'RequestService#lookupKerberosAuthorization');
			return 'Negotiate ' + response;
		} catch (err) {
			this.logService.debug('RequestService#lookupKerberosAuthorization Kerberos authentication failed', err);
			return undefined;
		}
	}

	async loadCertificates(): Promise<string[]> {
		const proxyAgent = await import('@vscode/proxy-agent');
		return proxyAgent.loadSystemCertificates({
			loadSystemCertificatesFromNode: () => this.getConfigValue<boolean>('http.systemCertificatesNode', systemCertificatesNodeDefault),
			log: this.logService,
		});
	}

	private getConfigValue<T>(key: string, fallback?: T): T | undefined {
		if (this.machine === 'remote') {
			return this.configurationService.getValue<T>(key);
		}
		const values = this.configurationService.inspect<T>(key);
		return values.userLocalValue ?? values.defaultValue ?? fallback;
	}
}

export async function lookupKerberosAuthorization(urlStr: string, spnConfig: string | undefined, logService: ILogService, logPrefix: string) {
	const importKerberos = await import('kerberos');
	const kerberos = importKerberos.default || importKerberos;
	const url = new URL(urlStr);
	const spn = spnConfig
		|| (process.platform === 'win32' ? `HTTP/${url.hostname}` : `HTTP@${url.hostname}`);
	logService.debug(`${logPrefix} Kerberos authentication lookup`, `proxyURL:${url}`, `spn:${spn}`);
	const client = await kerberos.initializeClient(spn);
	return client.step('');
}

async function getNodeRequest(options: IRequestOptions): Promise<IRawRequestFunction> {
	const endpoint = parseUrl(options.url!);
	const module = endpoint.protocol === 'https:' ? await import('https') : await import('http');

	return module.request;
}

export async function nodeRequest(options: NodeRequestOptions, token: CancellationToken): Promise<IRequestContext> {
	return Promises.withAsyncBody<IRequestContext>(async (resolve, reject) => {
		const endpoint = parseUrl(options.url!);
		const rawRequest = options.getRawRequest
			? options.getRawRequest(options)
			: await getNodeRequest(options);

		const opts: https.RequestOptions & { cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached' } = {
			hostname: endpoint.hostname,
			port: endpoint.port ? parseInt(endpoint.port) : (endpoint.protocol === 'https:' ? 443 : 80),
			protocol: endpoint.protocol,
			path: endpoint.path,
			method: options.type || 'GET',
			headers: options.headers,
			agent: options.agent,
			rejectUnauthorized: isBoolean(options.strictSSL) ? options.strictSSL : true
		};

		if (options.user && options.password) {
			opts.auth = options.user + ':' + options.password;
		}

		if (options.disableCache) {
			opts.cache = 'no-store';
		}

		const req = rawRequest(opts, (res: http.IncomingMessage) => {
			const followRedirects: number = isNumber(options.followRedirects) ? options.followRedirects : 3;
			if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && followRedirects > 0 && res.headers['location']) {
				nodeRequest({
					...options,
					url: res.headers['location'],
					followRedirects: followRedirects - 1
				}, token).then(resolve, reject);
			} else {
				let stream: streams.ReadableStreamEvents<Uint8Array> = res;

				// Responses from Electron net module should be treated as response
				// from browser, which will apply gzip filter and decompress the response
				// using zlib before passing the result to us. Following step can be bypassed
				// in this case and proceed further.
				// Refs https://source.chromium.org/chromium/chromium/src/+/main:net/url_request/url_request_http_job.cc;l=1266-1318
				if (!options.isChromiumNetwork && res.headers['content-encoding'] === 'gzip') {
					stream = res.pipe(createGunzip());
				}

				resolve({ res, stream: streamToBufferReadableStream(stream) } satisfies IRequestContext);
			}
		});

		req.on('error', reject);

		// Handle timeout
		if (options.timeout) {
			// Chromium network requests do not support the `timeout` option
			if (options.isChromiumNetwork) {
				// Use Node's setTimeout for Chromium network requests
				const timeout = setTimeout(() => {
					req.abort();
					reject(new Error(`Request timeout after ${options.timeout}ms`));
				}, options.timeout);

				// Clear timeout when request completes
				req.on('response', () => clearTimeout(timeout));
				req.on('error', () => clearTimeout(timeout));
				req.on('abort', () => clearTimeout(timeout));
			} else {
				req.setTimeout(options.timeout);
			}
		}

		// Chromium will abort the request if forbidden headers are set.
		// Ref https://source.chromium.org/chromium/chromium/src/+/main:services/network/public/cpp/header_util.cc;l=14-48;
		// for additional context.
		if (options.isChromiumNetwork) {
			req.removeHeader('Content-Length');
		}

		if (options.data) {
			if (typeof options.data === 'string') {
				req.write(options.data);
			}
		}

		req.end();

		token.onCancellationRequested(() => {
			req.abort();

			reject(new CancellationError());
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/request/test/node/requestService.test.ts]---
Location: vscode-main/src/vs/platform/request/test/node/requestService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { NullLogService } from '../../../log/common/log.js';
import { lookupKerberosAuthorization } from '../../node/requestService.js';
import { isWindows } from '../../../../base/common/platform.js';


suite('Request Service', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	// Kerberos module fails to load on local macOS and Linux CI.
	(isWindows ? test : test.skip)('Kerberos lookup', async () => {
		try {
			const logService = store.add(new NullLogService());
			const response = await lookupKerberosAuthorization('http://localhost:9999', undefined, logService, 'requestService.test.ts');
			assert.ok(response);
		} catch (err) {
			assert.ok(
				err?.message?.includes('No authority could be contacted for authentication')
				|| err?.message?.includes('No Kerberos credentials available')
				|| err?.message?.includes('No credentials are available in the security package')
				|| err?.message?.includes('no credential for')
				, `Unexpected error: ${err}`);
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/secrets/common/secrets.ts]---
Location: vscode-main/src/vs/platform/secrets/common/secrets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SequencerByKey } from '../../../base/common/async.js';
import { IEncryptionService } from '../../encryption/common/encryptionService.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IStorageService, InMemoryStorageService, StorageScope, StorageTarget } from '../../storage/common/storage.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { ILogService } from '../../log/common/log.js';
import { Disposable, DisposableStore } from '../../../base/common/lifecycle.js';
import { Lazy } from '../../../base/common/lazy.js';

export const ISecretStorageService = createDecorator<ISecretStorageService>('secretStorageService');

export interface ISecretStorageProvider {
	type: 'in-memory' | 'persisted' | 'unknown';
	get(key: string): Promise<string | undefined>;
	set(key: string, value: string): Promise<void>;
	delete(key: string): Promise<void>;
	keys?(): Promise<string[]>;
}

export interface ISecretStorageService extends ISecretStorageProvider {
	readonly _serviceBrand: undefined;
	readonly onDidChangeSecret: Event<string>;
}

export class BaseSecretStorageService extends Disposable implements ISecretStorageService {
	declare readonly _serviceBrand: undefined;

	private readonly _storagePrefix = 'secret://';

	protected readonly onDidChangeSecretEmitter = this._register(new Emitter<string>());
	readonly onDidChangeSecret: Event<string> = this.onDidChangeSecretEmitter.event;

	protected readonly _sequencer = new SequencerByKey<string>();

	private _type: 'in-memory' | 'persisted' | 'unknown' = 'unknown';

	private readonly _onDidChangeValueDisposable = this._register(new DisposableStore());

	constructor(
		private readonly _useInMemoryStorage: boolean,
		@IStorageService private _storageService: IStorageService,
		@IEncryptionService protected _encryptionService: IEncryptionService,
		@ILogService protected readonly _logService: ILogService,
	) {
		super();
	}

	/**
	 * @Note initialize must be called first so that this can be resolved properly
	 * otherwise it will return 'unknown'.
	 */
	get type() {
		return this._type;
	}

	private _lazyStorageService: Lazy<Promise<IStorageService>> = new Lazy(() => this.initialize());
	protected get resolvedStorageService() {
		return this._lazyStorageService.value;
	}

	get(key: string): Promise<string | undefined> {
		return this._sequencer.queue(key, async () => {
			const storageService = await this.resolvedStorageService;

			const fullKey = this.getKey(key);
			this._logService.trace('[secrets] getting secret for key:', fullKey);
			const encrypted = storageService.get(fullKey, StorageScope.APPLICATION);
			if (!encrypted) {
				this._logService.trace('[secrets] no secret found for key:', fullKey);
				return undefined;
			}

			try {
				this._logService.trace('[secrets] decrypting gotten secret for key:', fullKey);
				// If the storage service is in-memory, we don't need to decrypt
				const result = this._type === 'in-memory'
					? encrypted
					: await this._encryptionService.decrypt(encrypted);
				this._logService.trace('[secrets] decrypted secret for key:', fullKey);
				return result;
			} catch (e) {
				this._logService.error(e);
				this.delete(key);
				return undefined;
			}
		});
	}

	set(key: string, value: string): Promise<void> {
		return this._sequencer.queue(key, async () => {
			const storageService = await this.resolvedStorageService;

			this._logService.trace('[secrets] encrypting secret for key:', key);
			let encrypted;
			try {
				// If the storage service is in-memory, we don't need to encrypt
				encrypted = this._type === 'in-memory'
					? value
					: await this._encryptionService.encrypt(value);
			} catch (e) {
				this._logService.error(e);
				throw e;
			}
			const fullKey = this.getKey(key);
			this._logService.trace('[secrets] storing encrypted secret for key:', fullKey);
			storageService.store(fullKey, encrypted, StorageScope.APPLICATION, StorageTarget.MACHINE);
			this._logService.trace('[secrets] stored encrypted secret for key:', fullKey);
		});
	}

	delete(key: string): Promise<void> {
		return this._sequencer.queue(key, async () => {
			const storageService = await this.resolvedStorageService;

			const fullKey = this.getKey(key);
			this._logService.trace('[secrets] deleting secret for key:', fullKey);
			storageService.remove(fullKey, StorageScope.APPLICATION);
			this._logService.trace('[secrets] deleted secret for key:', fullKey);
		});
	}

	keys(): Promise<string[]> {
		return this._sequencer.queue('__keys__', async () => {
			const storageService = await this.resolvedStorageService;
			this._logService.trace('[secrets] fetching keys of all secrets');
			const allKeys = storageService.keys(StorageScope.APPLICATION, StorageTarget.MACHINE);
			this._logService.trace('[secrets] fetched keys of all secrets');
			return allKeys.filter(key => key.startsWith(this._storagePrefix)).map(key => key.slice(this._storagePrefix.length));
		});
	}

	private async initialize(): Promise<IStorageService> {
		let storageService;
		if (!this._useInMemoryStorage && await this._encryptionService.isEncryptionAvailable()) {
			this._logService.trace(`[SecretStorageService] Encryption is available, using persisted storage`);
			this._type = 'persisted';
			storageService = this._storageService;
		} else {
			// If we already have an in-memory storage service, we don't need to recreate it
			if (this._type === 'in-memory') {
				return this._storageService;
			}
			this._logService.trace('[SecretStorageService] Encryption is not available, falling back to in-memory storage');
			this._type = 'in-memory';
			storageService = this._register(new InMemoryStorageService());
		}

		this._onDidChangeValueDisposable.clear();
		this._onDidChangeValueDisposable.add(storageService.onDidChangeValue(StorageScope.APPLICATION, undefined, this._onDidChangeValueDisposable)(e => {
			this.onDidChangeValue(e.key);
		}));
		return storageService;
	}

	protected reinitialize(): void {
		this._lazyStorageService = new Lazy(() => this.initialize());
	}

	private onDidChangeValue(key: string): void {
		if (!key.startsWith(this._storagePrefix)) {
			return;
		}

		const secretKey = key.slice(this._storagePrefix.length);

		this._logService.trace(`[SecretStorageService] Notifying change in value for secret: ${secretKey}`);
		this.onDidChangeSecretEmitter.fire(secretKey);
	}

	private getKey(key: string): string {
		return `${this._storagePrefix}${key}`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/secrets/test/common/secrets.test.ts]---
Location: vscode-main/src/vs/platform/secrets/test/common/secrets.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as sinon from 'sinon';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IEncryptionService, KnownStorageProvider } from '../../../encryption/common/encryptionService.js';
import { NullLogService } from '../../../log/common/log.js';
import { BaseSecretStorageService } from '../../common/secrets.js';
import { InMemoryStorageService } from '../../../storage/common/storage.js';

class TestEncryptionService implements IEncryptionService {
	_serviceBrand: undefined;
	private encryptedPrefix = 'encrypted+'; // prefix to simulate encryption
	setUsePlainTextEncryption(): Promise<void> {
		return Promise.resolve();
	}
	getKeyStorageProvider(): Promise<KnownStorageProvider> {
		return Promise.resolve(KnownStorageProvider.basicText);
	}
	encrypt(value: string): Promise<string> {
		return Promise.resolve(this.encryptedPrefix + value);
	}
	decrypt(value: string): Promise<string> {
		return Promise.resolve(value.substring(this.encryptedPrefix.length));
	}
	isEncryptionAvailable(): Promise<boolean> {
		return Promise.resolve(true);
	}
}

class TestNoEncryptionService implements IEncryptionService {
	_serviceBrand: undefined;
	setUsePlainTextEncryption(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	getKeyStorageProvider(): Promise<KnownStorageProvider> {
		throw new Error('Method not implemented.');
	}
	encrypt(value: string): Promise<string> {
		throw new Error('Method not implemented.');
	}
	decrypt(value: string): Promise<string> {
		throw new Error('Method not implemented.');
	}
	isEncryptionAvailable(): Promise<boolean> {
		return Promise.resolve(false);
	}
}

suite('secrets', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	suite('BaseSecretStorageService useInMemoryStorage=true', () => {
		let service: BaseSecretStorageService;
		let spyEncryptionService: sinon.SinonSpiedInstance<TestEncryptionService>;
		let sandbox: sinon.SinonSandbox;

		setup(() => {
			sandbox = sinon.createSandbox();
			spyEncryptionService = sandbox.spy(new TestEncryptionService());
			service = store.add(new BaseSecretStorageService(
				true,
				store.add(new InMemoryStorageService()),
				spyEncryptionService,
				store.add(new NullLogService())
			));
		});

		teardown(() => {
			sandbox.restore();
		});

		test('type', async () => {
			assert.strictEqual(service.type, 'unknown');
			// trigger lazy initialization
			await service.set('my-secret', 'my-secret-value');

			assert.strictEqual(service.type, 'in-memory');
		});

		test('set and get', async () => {
			const key = 'my-secret';
			const value = 'my-secret-value';
			await service.set(key, value);
			const result = await service.get(key);
			assert.strictEqual(result, value);

			// Additionally ensure the encryptionservice was not used
			assert.strictEqual(spyEncryptionService.encrypt.callCount, 0);
			assert.strictEqual(spyEncryptionService.decrypt.callCount, 0);
		});

		test('delete', async () => {
			const key = 'my-secret';
			const value = 'my-secret-value';
			await service.set(key, value);
			await service.delete(key);
			const result = await service.get(key);
			assert.strictEqual(result, undefined);
		});

		test('onDidChangeSecret', async () => {
			const key = 'my-secret';
			const value = 'my-secret-value';
			let eventFired = false;
			store.add(service.onDidChangeSecret((changedKey) => {
				assert.strictEqual(changedKey, key);
				eventFired = true;
			}));
			await service.set(key, value);
			assert.strictEqual(eventFired, true);
		});
	});

	suite('BaseSecretStorageService useInMemoryStorage=false', () => {
		let service: BaseSecretStorageService;
		let spyEncryptionService: sinon.SinonSpiedInstance<TestEncryptionService>;
		let sandbox: sinon.SinonSandbox;

		setup(() => {
			sandbox = sinon.createSandbox();
			spyEncryptionService = sandbox.spy(new TestEncryptionService());
			service = store.add(new BaseSecretStorageService(
				false,
				store.add(new InMemoryStorageService()),
				spyEncryptionService,
				store.add(new NullLogService()))
			);
		});

		teardown(() => {
			sandbox.restore();
		});

		test('type', async () => {
			assert.strictEqual(service.type, 'unknown');
			// trigger lazy initialization
			await service.set('my-secret', 'my-secret-value');

			assert.strictEqual(service.type, 'persisted');
		});

		test('set and get', async () => {
			const key = 'my-secret';
			const value = 'my-secret-value';
			await service.set(key, value);
			const result = await service.get(key);
			assert.strictEqual(result, value);

			// Additionally ensure the encryptionservice was not used
			assert.strictEqual(spyEncryptionService.encrypt.callCount, 1);
			assert.strictEqual(spyEncryptionService.decrypt.callCount, 1);
		});

		test('delete', async () => {
			const key = 'my-secret';
			const value = 'my-secret-value';
			await service.set(key, value);
			await service.delete(key);
			const result = await service.get(key);
			assert.strictEqual(result, undefined);
		});

		test('onDidChangeSecret', async () => {
			const key = 'my-secret';
			const value = 'my-secret-value';
			let eventFired = false;
			store.add(service.onDidChangeSecret((changedKey) => {
				assert.strictEqual(changedKey, key);
				eventFired = true;
			}));
			await service.set(key, value);
			assert.strictEqual(eventFired, true);
		});
	});

	suite('BaseSecretStorageService useInMemoryStorage=false, encryption not available', () => {
		let service: BaseSecretStorageService;
		let spyNoEncryptionService: sinon.SinonSpiedInstance<TestEncryptionService>;
		let sandbox: sinon.SinonSandbox;

		setup(() => {
			sandbox = sinon.createSandbox();
			spyNoEncryptionService = sandbox.spy(new TestNoEncryptionService());
			service = store.add(new BaseSecretStorageService(
				false,
				store.add(new InMemoryStorageService()),
				spyNoEncryptionService,
				store.add(new NullLogService()))
			);
		});

		teardown(() => {
			sandbox.restore();
		});

		test('type', async () => {
			assert.strictEqual(service.type, 'unknown');
			// trigger lazy initialization
			await service.set('my-secret', 'my-secret-value');

			assert.strictEqual(service.type, 'in-memory');
		});

		test('set and get', async () => {
			const key = 'my-secret';
			const value = 'my-secret-value';
			await service.set(key, value);
			const result = await service.get(key);
			assert.strictEqual(result, value);

			// Additionally ensure the encryptionservice was not used
			assert.strictEqual(spyNoEncryptionService.encrypt.callCount, 0);
			assert.strictEqual(spyNoEncryptionService.decrypt.callCount, 0);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/secrets/test/common/testSecretStorageService.ts]---
Location: vscode-main/src/vs/platform/secrets/test/common/testSecretStorageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { ISecretStorageService } from '../../common/secrets.js';

export class TestSecretStorageService implements ISecretStorageService {
	declare readonly _serviceBrand: undefined;

	private readonly _storage = new Map<string, string>();
	private readonly _onDidChangeSecretEmitter = new Emitter<string>();
	readonly onDidChangeSecret = this._onDidChangeSecretEmitter.event;

	type = 'in-memory' as const;

	async get(key: string): Promise<string | undefined> {
		return this._storage.get(key);
	}

	async set(key: string, value: string): Promise<void> {
		this._storage.set(key, value);
		this._onDidChangeSecretEmitter.fire(key);
	}

	async delete(key: string): Promise<void> {
		this._storage.delete(key);
		this._onDidChangeSecretEmitter.fire(key);
	}

	async keys(): Promise<string[]> {
		return Array.from(this._storage.keys());
	}

	// Helper method for tests to clear all secrets
	clear(): void {
		this._storage.clear();
	}

	dispose(): void {
		this._onDidChangeSecretEmitter.dispose();
		this._storage.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/sharedProcess/common/sharedProcess.ts]---
Location: vscode-main/src/vs/platform/sharedProcess/common/sharedProcess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const SharedProcessLifecycle = {
	exit: 'vscode:electron-main->shared-process=exit',
	ipcReady: 'vscode:shared-process->electron-main=ipc-ready',
	initDone: 'vscode:shared-process->electron-main=init-done'
};

export const SharedProcessChannelConnection = {
	request: 'vscode:createSharedProcessChannelConnection',
	response: 'vscode:createSharedProcessChannelConnectionResult'
};

export const SharedProcessRawConnection = {
	request: 'vscode:createSharedProcessRawConnection',
	response: 'vscode:createSharedProcessRawConnectionResult'
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/sharedProcess/electron-main/sharedProcess.ts]---
Location: vscode-main/src/vs/platform/sharedProcess/electron-main/sharedProcess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IpcMainEvent, MessagePortMain } from 'electron';
import { validatedIpcMain } from '../../../base/parts/ipc/electron-main/ipcMain.js';
import { Barrier, DeferredPromise } from '../../../base/common/async.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { IEnvironmentMainService } from '../../environment/electron-main/environmentMainService.js';
import { ILifecycleMainService } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import { ISharedProcessConfiguration } from '../node/sharedProcess.js';
import { IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { IPolicyService } from '../../policy/common/policy.js';
import { ILoggerMainService } from '../../log/electron-main/loggerService.js';
import { UtilityProcess } from '../../utilityProcess/electron-main/utilityProcess.js';
import { NullTelemetryService } from '../../telemetry/common/telemetryUtils.js';
import { parseSharedProcessDebugPort } from '../../environment/node/environmentService.js';
import { assertReturnsDefined } from '../../../base/common/types.js';
import { SharedProcessChannelConnection, SharedProcessRawConnection, SharedProcessLifecycle } from '../common/sharedProcess.js';
import { Emitter } from '../../../base/common/event.js';

export class SharedProcess extends Disposable {

	private readonly firstWindowConnectionBarrier = new Barrier();

	private utilityProcess: UtilityProcess | undefined = undefined;
	private utilityProcessLogListener: IDisposable | undefined = undefined;

	private readonly _onDidCrash = this._register(new Emitter<void>());
	readonly onDidCrash = this._onDidCrash.event;

	constructor(
		private readonly machineId: string,
		private readonly sqmId: string,
		private readonly devDeviceId: string,
		@IEnvironmentMainService private readonly environmentMainService: IEnvironmentMainService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@ILifecycleMainService private readonly lifecycleMainService: ILifecycleMainService,
		@ILogService private readonly logService: ILogService,
		@ILoggerMainService private readonly loggerMainService: ILoggerMainService,
		@IPolicyService private readonly policyService: IPolicyService
	) {
		super();

		this.registerListeners();
	}

	private registerListeners(): void {

		// Shared process channel connections from workbench windows
		validatedIpcMain.on(SharedProcessChannelConnection.request, (e, nonce: string) => this.onWindowConnection(e, nonce, SharedProcessChannelConnection.response));

		// Shared process raw connections from workbench windows
		validatedIpcMain.on(SharedProcessRawConnection.request, (e, nonce: string) => this.onWindowConnection(e, nonce, SharedProcessRawConnection.response));

		// Lifecycle
		this._register(this.lifecycleMainService.onWillShutdown(() => this.onWillShutdown()));
	}

	private async onWindowConnection(e: IpcMainEvent, nonce: string, responseChannel: string): Promise<void> {
		this.logService.trace(`[SharedProcess] onWindowConnection for: ${responseChannel}`);

		// release barrier if this is the first window connection
		if (!this.firstWindowConnectionBarrier.isOpen()) {
			this.firstWindowConnectionBarrier.open();
		}

		// await the shared process to be overall ready
		// we do not just wait for IPC ready because the
		// workbench window will communicate directly

		await this.whenReady();

		// connect to the shared process passing the responseChannel
		// as payload to give a hint what the connection is about

		const port = await this.connect(responseChannel);

		// Check back if the requesting window meanwhile closed
		// Since shared process is delayed on startup there is
		// a chance that the window close before the shared process
		// was ready for a connection.

		if (e.sender.isDestroyed()) {
			return port.close();
		}

		// send the port back to the requesting window
		e.sender.postMessage(responseChannel, nonce, [port]);
	}

	private onWillShutdown(): void {
		this.logService.trace('[SharedProcess] onWillShutdown');

		this.utilityProcess?.postMessage(SharedProcessLifecycle.exit);
		this.utilityProcess = undefined;
	}

	private _whenReady: Promise<void> | undefined = undefined;
	whenReady(): Promise<void> {
		if (!this._whenReady) {
			this._whenReady = (async () => {

				// Wait for shared process being ready to accept connection
				await this.whenIpcReady;

				// Overall signal that the shared process was loaded and
				// all services within have been created.

				const whenReady = new DeferredPromise<void>();
				this.utilityProcess?.once(SharedProcessLifecycle.initDone, () => whenReady.complete());

				await whenReady.p;
				this.utilityProcessLogListener?.dispose();
				this.logService.trace('[SharedProcess] Overall ready');
			})();
		}

		return this._whenReady;
	}

	private _whenIpcReady: Promise<void> | undefined = undefined;
	private get whenIpcReady() {
		if (!this._whenIpcReady) {
			this._whenIpcReady = (async () => {

				// Always wait for first window asking for connection
				await this.firstWindowConnectionBarrier.wait();

				// Spawn shared process
				this.createUtilityProcess();

				// Wait for shared process indicating that IPC connections are accepted
				const sharedProcessIpcReady = new DeferredPromise<void>();
				this.utilityProcess?.once(SharedProcessLifecycle.ipcReady, () => sharedProcessIpcReady.complete());

				await sharedProcessIpcReady.p;
				this.logService.trace('[SharedProcess] IPC ready');
			})();
		}

		return this._whenIpcReady;
	}

	private createUtilityProcess(): void {
		this.utilityProcess = this._register(new UtilityProcess(this.logService, NullTelemetryService, this.lifecycleMainService));

		// Install a log listener for very early shared process warnings and errors
		this.utilityProcessLogListener = this.utilityProcess.onMessage(e => {
			const logValue = e as { warning?: unknown; error?: unknown };
			if (typeof logValue.warning === 'string') {
				this.logService.warn(logValue.warning);
			} else if (typeof logValue.error === 'string') {
				this.logService.error(logValue.error);
			}
		});

		const inspectParams = parseSharedProcessDebugPort(this.environmentMainService.args, this.environmentMainService.isBuilt);
		let execArgv: string[] | undefined = undefined;
		if (inspectParams.port) {
			execArgv = ['--nolazy', '--experimental-network-inspection'];
			if (inspectParams.break) {
				execArgv.push(`--inspect-brk=${inspectParams.port}`);
			} else {
				execArgv.push(`--inspect=${inspectParams.port}`);
			}
		}

		this.utilityProcess.start({
			type: 'shared-process',
			name: 'shared-process',
			entryPoint: 'vs/code/electron-utility/sharedProcess/sharedProcessMain',
			payload: this.createSharedProcessConfiguration(),
			respondToAuthRequestsFromMainProcess: true,
			execArgv
		});

		this._register(this.utilityProcess.onCrash(() => this._onDidCrash.fire()));
	}

	private createSharedProcessConfiguration(): ISharedProcessConfiguration {
		return {
			machineId: this.machineId,
			sqmId: this.sqmId,
			devDeviceId: this.devDeviceId,
			codeCachePath: this.environmentMainService.codeCachePath,
			profiles: {
				home: this.userDataProfilesService.profilesHome,
				all: this.userDataProfilesService.profiles,
			},
			args: this.environmentMainService.args,
			logLevel: this.loggerMainService.getLogLevel(),
			loggers: this.loggerMainService.getGlobalLoggers(),
			policiesData: this.policyService.serialize()
		};
	}

	async connect(payload?: unknown): Promise<MessagePortMain> {

		// Wait for shared process being ready to accept connection
		await this.whenIpcReady;

		// Connect and return message port
		const utilityProcess = assertReturnsDefined(this.utilityProcess);
		return utilityProcess.connect(payload);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/sharedProcess/node/sharedProcess.ts]---
Location: vscode-main/src/vs/platform/sharedProcess/node/sharedProcess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../base/common/collections.js';
import { NativeParsedArgs } from '../../environment/common/argv.js';
import { ILoggerResource, LogLevel } from '../../log/common/log.js';
import { IUserDataProfile } from '../../userDataProfile/common/userDataProfile.js';
import { PolicyDefinition, PolicyValue } from '../../policy/common/policy.js';
import { UriComponents, UriDto } from '../../../base/common/uri.js';

export interface ISharedProcessConfiguration {
	readonly machineId: string;

	readonly sqmId: string;

	readonly devDeviceId: string;

	readonly codeCachePath: string | undefined;

	readonly args: NativeParsedArgs;

	readonly logLevel: LogLevel;

	readonly loggers: UriDto<ILoggerResource>[];

	readonly profiles: {
		readonly home: UriComponents;
		readonly all: readonly UriDto<IUserDataProfile>[];
	};

	readonly policiesData?: IStringDictionary<{ definition: PolicyDefinition; value: PolicyValue }>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/shell/node/shellEnv.ts]---
Location: vscode-main/src/vs/platform/shell/node/shellEnv.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { spawn } from 'child_process';
import { basename } from '../../../base/common/path.js';
import { localize } from '../../../nls.js';
import { CancellationToken, CancellationTokenSource } from '../../../base/common/cancellation.js';
import { toErrorMessage } from '../../../base/common/errorMessage.js';
import { CancellationError, isCancellationError } from '../../../base/common/errors.js';
import { IProcessEnvironment, isWindows, OS } from '../../../base/common/platform.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { getSystemShell } from '../../../base/node/shell.js';
import { NativeParsedArgs } from '../../environment/common/argv.js';
import { isLaunchedFromCli } from '../../environment/node/argvHelper.js';
import { ILogService } from '../../log/common/log.js';
import { Promises } from '../../../base/common/async.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { clamp } from '../../../base/common/numbers.js';

let unixShellEnvPromise: Promise<typeof process.env> | undefined = undefined;

/**
 * Resolves the shell environment by spawning a shell. This call will cache
 * the shell spawning so that subsequent invocations use that cached result.
 *
 * Will throw an error if:
 * - we hit a timeout of `MAX_SHELL_RESOLVE_TIME`
 * - any other error from spawning a shell to figure out the environment
 */
export async function getResolvedShellEnv(configurationService: IConfigurationService, logService: ILogService, args: NativeParsedArgs, env: IProcessEnvironment): Promise<typeof process.env> {

	// Skip if --force-disable-user-env
	if (args['force-disable-user-env']) {
		logService.trace('resolveShellEnv(): skipped (--force-disable-user-env)');

		return {};
	}

	// Skip on windows
	else if (isWindows) {
		logService.trace('resolveShellEnv(): skipped (Windows)');

		return {};
	}

	// Skip if running from CLI already
	else if (isLaunchedFromCli(env) && !args['force-user-env']) {
		logService.trace('resolveShellEnv(): skipped (VSCODE_CLI is set)');

		return {};
	}

	// Otherwise resolve (macOS, Linux)
	else {
		if (isLaunchedFromCli(env)) {
			logService.trace('resolveShellEnv(): running (--force-user-env)');
		} else {
			logService.trace('resolveShellEnv(): running (macOS/Linux)');
		}

		// Call this only once and cache the promise for
		// subsequent calls since this operation can be
		// expensive (spawns a process).
		if (!unixShellEnvPromise) {
			unixShellEnvPromise = Promises.withAsyncBody<NodeJS.ProcessEnv>(async (resolve, reject) => {
				const cts = new CancellationTokenSource();

				let timeoutValue = 10000; // default to 10 seconds
				const configuredTimeoutValue = configurationService.getValue<unknown>('application.shellEnvironmentResolutionTimeout');
				if (typeof configuredTimeoutValue === 'number') {
					timeoutValue = clamp(configuredTimeoutValue, 1, 120) * 1000 /* convert from seconds */;
				}

				// Give up resolving shell env after some time
				const timeout = setTimeout(() => {
					cts.dispose(true);
					reject(new Error(localize('resolveShellEnvTimeout', "Unable to resolve your shell environment in a reasonable time. Please review your shell configuration and restart.")));
				}, timeoutValue);

				// Resolve shell env and handle errors
				try {
					resolve(await doResolveUnixShellEnv(logService, cts.token));
				} catch (error) {
					if (!isCancellationError(error) && !cts.token.isCancellationRequested) {
						reject(new Error(localize('resolveShellEnvError', "Unable to resolve your shell environment: {0}", toErrorMessage(error))));
					} else {
						resolve({});
					}
				} finally {
					clearTimeout(timeout);
					cts.dispose();
				}
			});
		}

		return unixShellEnvPromise;
	}
}

async function doResolveUnixShellEnv(logService: ILogService, token: CancellationToken): Promise<typeof process.env> {
	const runAsNode = process.env['ELECTRON_RUN_AS_NODE'];
	logService.trace('getUnixShellEnvironment#runAsNode', runAsNode);

	const noAttach = process.env['ELECTRON_NO_ATTACH_CONSOLE'];
	logService.trace('getUnixShellEnvironment#noAttach', noAttach);

	const mark = generateUuid().replace(/-/g, '').substr(0, 12);
	const regex = new RegExp(mark + '({.*})' + mark);

	const env = {
		...process.env,
		ELECTRON_RUN_AS_NODE: '1',
		ELECTRON_NO_ATTACH_CONSOLE: '1',
		VSCODE_RESOLVING_ENVIRONMENT: '1'
	};

	logService.trace('getUnixShellEnvironment#env', env);
	const systemShellUnix = await getSystemShell(OS, env);
	logService.trace('getUnixShellEnvironment#shell', systemShellUnix);

	return new Promise<typeof process.env>((resolve, reject) => {
		if (token.isCancellationRequested) {
			return reject(new CancellationError());
		}

		// handle popular non-POSIX shells
		const name = basename(systemShellUnix);
		let command: string, shellArgs: Array<string>;
		const extraArgs = '';
		if (/^(?:pwsh|powershell)(?:-preview)?$/.test(name)) {
			// Older versions of PowerShell removes double quotes sometimes so we use "double single quotes" which is how
			// you escape single quotes inside of a single quoted string.
			command = `& '${process.execPath}' ${extraArgs} -p '''${mark}'' + JSON.stringify(process.env) + ''${mark}'''`;
			shellArgs = ['-Login', '-Command'];
		} else if (name === 'nu') { // nushell requires ^ before quoted path to treat it as a command
			command = `^'${process.execPath}' ${extraArgs} -p '"${mark}" + JSON.stringify(process.env) + "${mark}"'`;
			shellArgs = ['-i', '-l', '-c'];
		} else if (name === 'xonsh') { // #200374: native implementation is shorter
			command = `import os, json; print("${mark}", json.dumps(dict(os.environ)), "${mark}")`;
			shellArgs = ['-i', '-l', '-c'];
		} else {
			command = `'${process.execPath}' ${extraArgs} -p '"${mark}" + JSON.stringify(process.env) + "${mark}"'`;

			if (name === 'tcsh' || name === 'csh') {
				shellArgs = ['-ic'];
			} else {
				shellArgs = ['-i', '-l', '-c'];
			}
		}

		logService.trace('getUnixShellEnvironment#spawn', JSON.stringify(shellArgs), command);

		const child = spawn(systemShellUnix, [...shellArgs, command], {
			detached: true,
			stdio: ['ignore', 'pipe', 'pipe'],
			env
		});

		token.onCancellationRequested(() => {
			child.kill();

			return reject(new CancellationError());
		});

		child.on('error', err => {
			logService.error('getUnixShellEnvironment#errorChildProcess', toErrorMessage(err));
			reject(err);
		});

		const buffers: Buffer[] = [];
		child.stdout.on('data', b => buffers.push(b));

		const stderr: Buffer[] = [];
		child.stderr.on('data', b => stderr.push(b));

		child.on('close', (code, signal) => {
			const raw = Buffer.concat(buffers).toString('utf8');
			logService.trace('getUnixShellEnvironment#raw', raw);

			const stderrStr = Buffer.concat(stderr).toString('utf8');
			if (stderrStr.trim()) {
				logService.trace('getUnixShellEnvironment#stderr', stderrStr);
			}

			if (code || signal) {
				return reject(new Error(localize('resolveShellEnvExitError', "Unexpected exit code from spawned shell (code {0}, signal {1})", code, signal)));
			}

			const match = regex.exec(raw);
			const rawStripped = match ? match[1] : '{}';

			try {
				const env = JSON.parse(rawStripped);

				if (runAsNode) {
					env['ELECTRON_RUN_AS_NODE'] = runAsNode;
				} else {
					delete env['ELECTRON_RUN_AS_NODE'];
				}

				if (noAttach) {
					env['ELECTRON_NO_ATTACH_CONSOLE'] = noAttach;
				} else {
					delete env['ELECTRON_NO_ATTACH_CONSOLE'];
				}

				delete env['VSCODE_RESOLVING_ENVIRONMENT'];

				// https://github.com/microsoft/vscode/issues/22593#issuecomment-336050758
				delete env['XDG_RUNTIME_DIR'];

				logService.trace('getUnixShellEnvironment#result', env);
				resolve(env);
			} catch (err) {
				logService.error('getUnixShellEnvironment#errorCaught', toErrorMessage(err));
				reject(err);
			}
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/sign/browser/signService.ts]---
Location: vscode-main/src/vs/platform/sign/browser/signService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { importAMDNodeModule, resolveAmdNodeModulePath } from '../../../amdX.js';
import { WindowIntervalTimer } from '../../../base/browser/dom.js';
import { mainWindow } from '../../../base/browser/window.js';
import { memoize } from '../../../base/common/decorators.js';
import { IProductService } from '../../product/common/productService.js';
import { AbstractSignService, IVsdaValidator } from '../common/abstractSignService.js';
import { ISignService } from '../common/sign.js';

declare namespace vsdaWeb {
	export function sign(salted_message: string): string;

	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class validator {
		free(): void;
		constructor();
		createNewMessage(original: string): string;
		validate(signed_message: string): 'ok' | 'error';
	}

	export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;
	export function init(module_or_path?: InitInput | Promise<InitInput>): Promise<unknown>;
}

// Initialized if/when vsda is loaded
declare const vsda_web: {
	default: typeof vsdaWeb.init;
	sign: typeof vsdaWeb.sign;
	validator: typeof vsdaWeb.validator;
};

const KEY_SIZE = 32;
const IV_SIZE = 16;
const STEP_SIZE = KEY_SIZE + IV_SIZE;

export class SignService extends AbstractSignService implements ISignService {
	constructor(@IProductService private readonly productService: IProductService) {
		super();
	}
	protected override getValidator(): Promise<IVsdaValidator> {
		return this.vsda().then(vsda => {
			const v = new vsda.validator();
			return {
				createNewMessage: arg => v.createNewMessage(arg),
				validate: arg => v.validate(arg),
				dispose: () => v.free(),
			};
		});
	}

	protected override signValue(arg: string): Promise<string> {
		return this.vsda().then(vsda => vsda.sign(arg));
	}

	@memoize
	private async vsda(): Promise<typeof vsda_web> {
		const checkInterval = new WindowIntervalTimer();
		let [wasm] = await Promise.all([
			this.getWasmBytes(),
			new Promise<void>((resolve, reject) => {
				importAMDNodeModule('vsda', 'rust/web/vsda.js').then(() => resolve(), reject);

				// todo@connor4312: there seems to be a bug(?) in vscode-loader with
				// require() not resolving in web once the script loads, so check manually
				checkInterval.cancelAndSet(() => {
					if (typeof vsda_web !== 'undefined') {
						resolve();
					}
				}, 50, mainWindow);
			}).finally(() => checkInterval.dispose()),
		]);

		const keyBytes = new TextEncoder().encode(this.productService.serverLicense?.join('\n') || '');
		for (let i = 0; i + STEP_SIZE < keyBytes.length; i += STEP_SIZE) {
			const key = await crypto.subtle.importKey('raw', keyBytes.slice(i + IV_SIZE, i + IV_SIZE + KEY_SIZE), { name: 'AES-CBC' }, false, ['decrypt']);
			wasm = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: keyBytes.slice(i, i + IV_SIZE) }, key, wasm);
		}

		await vsda_web.default(wasm);

		return vsda_web;
	}

	private async getWasmBytes(): Promise<ArrayBuffer> {
		const url = resolveAmdNodeModulePath('vsda', 'rust/web/vsda_bg.wasm');
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error('error loading vsda');
		}

		return response.arrayBuffer();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/sign/common/abstractSignService.ts]---
Location: vscode-main/src/vs/platform/sign/common/abstractSignService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMessage, ISignService } from './sign.js';

export interface IVsdaSigner {
	sign(arg: string): string;
}

export interface IVsdaValidator {
	createNewMessage(arg: string): string;
	validate(arg: string): 'ok' | 'error';
	dispose?(): void;
}

export abstract class AbstractSignService implements ISignService {
	declare readonly _serviceBrand: undefined;

	private static _nextId = 1;
	private readonly validators = new Map<string, IVsdaValidator>();

	protected abstract getValidator(): Promise<IVsdaValidator>;
	protected abstract signValue(arg: string): Promise<string>;

	public async createNewMessage(value: string): Promise<IMessage> {
		try {
			const validator = await this.getValidator();
			if (validator) {
				const id = String(AbstractSignService._nextId++);
				this.validators.set(id, validator);
				return {
					id: id,
					data: validator.createNewMessage(value)
				};
			}
		} catch (e) {
			// ignore errors silently
		}
		return { id: '', data: value };
	}

	async validate(message: IMessage, value: string): Promise<boolean> {
		if (!message.id) {
			return true;
		}

		const validator = this.validators.get(message.id);
		if (!validator) {
			return false;
		}
		this.validators.delete(message.id);
		try {
			return (validator.validate(value) === 'ok');
		} catch (e) {
			// ignore errors silently
			return false;
		} finally {
			validator.dispose?.();
		}
	}

	async sign(value: string): Promise<string> {
		try {
			return await this.signValue(value);
		} catch (e) {
			// ignore errors silently
		}
		return value;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/sign/common/sign.ts]---
Location: vscode-main/src/vs/platform/sign/common/sign.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';

export const SIGN_SERVICE_ID = 'signService';
export const ISignService = createDecorator<ISignService>(SIGN_SERVICE_ID);

export interface IMessage {
	id: string;
	data: string;
}

export interface ISignService {
	readonly _serviceBrand: undefined;

	createNewMessage(value: string): Promise<IMessage>;
	validate(message: IMessage, value: string): Promise<boolean>;
	sign(value: string): Promise<string>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/sign/node/signService.ts]---
Location: vscode-main/src/vs/platform/sign/node/signService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AbstractSignService, IVsdaValidator } from '../common/abstractSignService.js';
import { ISignService } from '../common/sign.js';

declare namespace vsda {
	// the signer is a native module that for historical reasons uses a lower case class name
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class signer {
		sign(arg: string): string;
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class validator {
		createNewMessage(arg: string): string;
		validate(arg: string): 'ok' | 'error';
	}
}

export class SignService extends AbstractSignService implements ISignService {
	protected override getValidator(): Promise<IVsdaValidator> {
		return this.vsda().then(vsda => new vsda.validator());
	}
	protected override signValue(arg: string): Promise<string> {
		return this.vsda().then(vsda => new vsda.signer().sign(arg));
	}

	private async vsda(): Promise<typeof vsda> {
		const mod = 'vsda';
		const { default: vsda } = await import(mod);
		return vsda;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/state/node/state.ts]---
Location: vscode-main/src/vs/platform/state/node/state.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IStateReadService = createDecorator<IStateReadService>('stateReadService');
export interface IStateReadService {

	readonly _serviceBrand: undefined;

	getItem<T>(key: string, defaultValue: T): T;
	getItem<T>(key: string, defaultValue?: T): T | undefined;

}

export const IStateService = createDecorator<IStateService>('stateService');
export interface IStateService extends IStateReadService {

	readonly _serviceBrand: undefined;

	setItem(key: string, data?: object | string | number | boolean | undefined | null): void;
	setItems(items: readonly { key: string; data?: object | string | number | boolean | undefined | null }[]): void;

	removeItem(key: string): void;

	close(): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/state/node/stateService.ts]---
Location: vscode-main/src/vs/platform/state/node/stateService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ThrottledDelayer } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { isUndefined, isUndefinedOrNull } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { FileOperationError, FileOperationResult, IFileService } from '../../files/common/files.js';
import { ILogService } from '../../log/common/log.js';
import { IStateReadService, IStateService } from './state.js';

type StorageDatabase = { [key: string]: unknown };

export const enum SaveStrategy {
	IMMEDIATE,
	DELAYED
}

export class FileStorage extends Disposable {

	private storage: StorageDatabase = Object.create(null);
	private lastSavedStorageContents = '';

	private readonly flushDelayer: ThrottledDelayer<void>;

	private initializing: Promise<void> | undefined = undefined;
	private closing: Promise<void> | undefined = undefined;

	constructor(
		private readonly storagePath: URI,
		saveStrategy: SaveStrategy,
		private readonly logService: ILogService,
		private readonly fileService: IFileService,
	) {
		super();

		this.flushDelayer = this._register(new ThrottledDelayer<void>(saveStrategy === SaveStrategy.IMMEDIATE ? 0 : 100 /* buffer saves over a short time */));
	}

	init(): Promise<void> {
		if (!this.initializing) {
			this.initializing = this.doInit();
		}

		return this.initializing;
	}

	private async doInit(): Promise<void> {
		try {
			this.lastSavedStorageContents = (await this.fileService.readFile(this.storagePath)).value.toString();
			this.storage = JSON.parse(this.lastSavedStorageContents);
		} catch (error) {
			if ((<FileOperationError>error).fileOperationResult !== FileOperationResult.FILE_NOT_FOUND) {
				this.logService.error(error);
			}
		}
	}

	getItem<T>(key: string, defaultValue: T): T;
	getItem<T>(key: string, defaultValue?: T): T | undefined;
	getItem<T>(key: string, defaultValue?: T): T | undefined {
		const res = this.storage[key];
		if (isUndefinedOrNull(res)) {
			return defaultValue;
		}

		return res as T;
	}

	setItem(key: string, data?: object | string | number | boolean | undefined | null): void {
		this.setItems([{ key, data }]);
	}

	setItems(items: readonly { key: string; data?: object | string | number | boolean | undefined | null }[]): void {
		let save = false;

		for (const { key, data } of items) {

			// Shortcut for data that did not change
			if (this.storage[key] === data) {
				continue;
			}

			// Remove items when they are undefined or null
			if (isUndefinedOrNull(data)) {
				if (!isUndefined(this.storage[key])) {
					this.storage[key] = undefined;
					save = true;
				}
			}

			// Otherwise add an item
			else {
				this.storage[key] = data;
				save = true;
			}
		}

		if (save) {
			this.save();
		}
	}

	removeItem(key: string): void {

		// Only update if the key is actually present (not undefined)
		if (!isUndefined(this.storage[key])) {
			this.storage[key] = undefined;
			this.save();
		}
	}

	private async save(): Promise<void> {
		if (this.closing) {
			return; // already about to close
		}

		return this.flushDelayer.trigger(() => this.doSave());
	}

	private async doSave(): Promise<void> {
		if (!this.initializing) {
			return; // if we never initialized, we should not save our state
		}

		// Make sure to wait for init to finish first
		await this.initializing;

		// Return early if the database has not changed
		const serializedDatabase = JSON.stringify(this.storage, null, 4);
		if (serializedDatabase === this.lastSavedStorageContents) {
			return;
		}

		// Write to disk
		try {
			await this.fileService.writeFile(this.storagePath, VSBuffer.fromString(serializedDatabase), { atomic: { postfix: '.vsctmp' } });
			this.lastSavedStorageContents = serializedDatabase;
		} catch (error) {
			this.logService.error(error);
		}
	}

	async close(): Promise<void> {
		if (!this.closing) {
			this.closing = this.flushDelayer.trigger(() => this.doSave(), 0 /* as soon as possible */);
		}

		return this.closing;
	}
}

export class StateReadonlyService extends Disposable implements IStateReadService {

	declare readonly _serviceBrand: undefined;

	protected readonly fileStorage: FileStorage;

	constructor(
		saveStrategy: SaveStrategy,
		@IEnvironmentService environmentService: IEnvironmentService,
		@ILogService logService: ILogService,
		@IFileService fileService: IFileService
	) {
		super();

		this.fileStorage = this._register(new FileStorage(environmentService.stateResource, saveStrategy, logService, fileService));
	}

	async init(): Promise<void> {
		await this.fileStorage.init();
	}

	getItem<T>(key: string, defaultValue: T): T;
	getItem<T>(key: string, defaultValue?: T): T | undefined;
	getItem<T>(key: string, defaultValue?: T): T | undefined {
		return this.fileStorage.getItem(key, defaultValue);
	}
}

export class StateService extends StateReadonlyService implements IStateService {

	declare readonly _serviceBrand: undefined;

	setItem(key: string, data?: object | string | number | boolean | undefined | null): void {
		this.fileStorage.setItem(key, data);
	}

	setItems(items: readonly { key: string; data?: object | string | number | boolean | undefined | null }[]): void {
		this.fileStorage.setItems(items);
	}

	removeItem(key: string): void {
		this.fileStorage.removeItem(key);
	}

	close(): Promise<void> {
		return this.fileStorage.close();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/state/test/node/state.test.ts]---
Location: vscode-main/src/vs/platform/state/test/node/state.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { readFileSync, promises } from 'fs';
import { tmpdir } from 'os';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { join } from '../../../../base/common/path.js';
import { URI } from '../../../../base/common/uri.js';
import { Promises, writeFileSync } from '../../../../base/node/pfs.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { flakySuite, getRandomTestPath } from '../../../../base/test/node/testUtils.js';
import { IFileService } from '../../../files/common/files.js';
import { FileService } from '../../../files/common/fileService.js';
import { DiskFileSystemProvider } from '../../../files/node/diskFileSystemProvider.js';
import { ILogService, NullLogService } from '../../../log/common/log.js';
import { FileStorage, SaveStrategy } from '../../node/stateService.js';

flakySuite('StateService', () => {

	let testDir: string;
	let fileService: IFileService;
	let logService: ILogService;
	let diskFileSystemProvider: DiskFileSystemProvider;

	const disposables = new DisposableStore();

	setup(() => {
		testDir = getRandomTestPath(tmpdir(), 'vsctests', 'statemainservice');

		logService = new NullLogService();

		fileService = disposables.add(new FileService(logService));
		diskFileSystemProvider = disposables.add(new DiskFileSystemProvider(logService));
		disposables.add(fileService.registerProvider(Schemas.file, diskFileSystemProvider));

		return promises.mkdir(testDir, { recursive: true });
	});

	teardown(() => {
		disposables.clear();

		return Promises.rm(testDir);
	});

	test('Basics (delayed strategy)', async function () {
		const storageFile = join(testDir, 'storage.json');
		writeFileSync(storageFile, '');

		let service = disposables.add(new FileStorage(URI.file(storageFile), SaveStrategy.DELAYED, logService, fileService));
		await service.init();

		service.setItem('some.key', 'some.value');
		assert.strictEqual(service.getItem('some.key'), 'some.value');

		service.removeItem('some.key');
		assert.strictEqual(service.getItem('some.key', 'some.default'), 'some.default');

		assert.ok(!service.getItem('some.unknonw.key'));

		service.setItem('some.other.key', 'some.other.value');

		await service.close();

		service = disposables.add(new FileStorage(URI.file(storageFile), SaveStrategy.DELAYED, logService, fileService));
		await service.init();

		assert.strictEqual(service.getItem('some.other.key'), 'some.other.value');

		service.setItem('some.other.key', 'some.other.value');
		assert.strictEqual(service.getItem('some.other.key'), 'some.other.value');

		service.setItem('some.undefined.key', undefined);
		assert.strictEqual(service.getItem('some.undefined.key', 'some.default'), 'some.default');

		service.setItem('some.null.key', null);
		assert.strictEqual(service.getItem('some.null.key', 'some.default'), 'some.default');

		service.setItems([
			{ key: 'some.setItems.key1', data: 'some.value' },
			{ key: 'some.setItems.key2', data: 0 },
			{ key: 'some.setItems.key3', data: true },
			{ key: 'some.setItems.key4', data: null },
			{ key: 'some.setItems.key5', data: undefined }
		]);

		assert.strictEqual(service.getItem('some.setItems.key1'), 'some.value');
		assert.strictEqual(service.getItem('some.setItems.key2'), 0);
		assert.strictEqual(service.getItem('some.setItems.key3'), true);
		assert.strictEqual(service.getItem('some.setItems.key4'), undefined);
		assert.strictEqual(service.getItem('some.setItems.key5'), undefined);

		service.setItems([
			{ key: 'some.setItems.key1', data: undefined },
			{ key: 'some.setItems.key2', data: undefined },
			{ key: 'some.setItems.key3', data: undefined },
			{ key: 'some.setItems.key4', data: null },
			{ key: 'some.setItems.key5', data: undefined }
		]);

		assert.strictEqual(service.getItem('some.setItems.key1'), undefined);
		assert.strictEqual(service.getItem('some.setItems.key2'), undefined);
		assert.strictEqual(service.getItem('some.setItems.key3'), undefined);
		assert.strictEqual(service.getItem('some.setItems.key4'), undefined);
		assert.strictEqual(service.getItem('some.setItems.key5'), undefined);

		return service.close();
	});

	test('Basics (immediate strategy)', async function () {
		const storageFile = join(testDir, 'storage.json');
		writeFileSync(storageFile, '');

		let service = disposables.add(new FileStorage(URI.file(storageFile), SaveStrategy.IMMEDIATE, logService, fileService));
		await service.init();

		service.setItem('some.key', 'some.value');
		assert.strictEqual(service.getItem('some.key'), 'some.value');

		service.removeItem('some.key');
		assert.strictEqual(service.getItem('some.key', 'some.default'), 'some.default');

		assert.ok(!service.getItem('some.unknonw.key'));

		service.setItem('some.other.key', 'some.other.value');

		await service.close();

		service = disposables.add(new FileStorage(URI.file(storageFile), SaveStrategy.IMMEDIATE, logService, fileService));
		await service.init();

		assert.strictEqual(service.getItem('some.other.key'), 'some.other.value');

		service.setItem('some.other.key', 'some.other.value');
		assert.strictEqual(service.getItem('some.other.key'), 'some.other.value');

		service.setItem('some.undefined.key', undefined);
		assert.strictEqual(service.getItem('some.undefined.key', 'some.default'), 'some.default');

		service.setItem('some.null.key', null);
		assert.strictEqual(service.getItem('some.null.key', 'some.default'), 'some.default');

		service.setItems([
			{ key: 'some.setItems.key1', data: 'some.value' },
			{ key: 'some.setItems.key2', data: 0 },
			{ key: 'some.setItems.key3', data: true },
			{ key: 'some.setItems.key4', data: null },
			{ key: 'some.setItems.key5', data: undefined }
		]);

		assert.strictEqual(service.getItem('some.setItems.key1'), 'some.value');
		assert.strictEqual(service.getItem('some.setItems.key2'), 0);
		assert.strictEqual(service.getItem('some.setItems.key3'), true);
		assert.strictEqual(service.getItem('some.setItems.key4'), undefined);
		assert.strictEqual(service.getItem('some.setItems.key5'), undefined);

		service.setItems([
			{ key: 'some.setItems.key1', data: undefined },
			{ key: 'some.setItems.key2', data: undefined },
			{ key: 'some.setItems.key3', data: undefined },
			{ key: 'some.setItems.key4', data: null },
			{ key: 'some.setItems.key5', data: undefined }
		]);

		assert.strictEqual(service.getItem('some.setItems.key1'), undefined);
		assert.strictEqual(service.getItem('some.setItems.key2'), undefined);
		assert.strictEqual(service.getItem('some.setItems.key3'), undefined);
		assert.strictEqual(service.getItem('some.setItems.key4'), undefined);
		assert.strictEqual(service.getItem('some.setItems.key5'), undefined);

		return service.close();
	});

	test('Multiple ops are buffered and applied', async function () {
		const storageFile = join(testDir, 'storage.json');
		writeFileSync(storageFile, '');

		let service = disposables.add(new FileStorage(URI.file(storageFile), SaveStrategy.DELAYED, logService, fileService));
		await service.init();

		service.setItem('some.key1', 'some.value1');
		service.setItem('some.key2', 'some.value2');
		service.setItem('some.key3', 'some.value3');
		service.setItem('some.key4', 'some.value4');
		service.removeItem('some.key4');

		assert.strictEqual(service.getItem('some.key1'), 'some.value1');
		assert.strictEqual(service.getItem('some.key2'), 'some.value2');
		assert.strictEqual(service.getItem('some.key3'), 'some.value3');
		assert.strictEqual(service.getItem('some.key4'), undefined);

		await service.close();

		service = disposables.add(new FileStorage(URI.file(storageFile), SaveStrategy.DELAYED, logService, fileService));
		await service.init();

		assert.strictEqual(service.getItem('some.key1'), 'some.value1');
		assert.strictEqual(service.getItem('some.key2'), 'some.value2');
		assert.strictEqual(service.getItem('some.key3'), 'some.value3');
		assert.strictEqual(service.getItem('some.key4'), undefined);

		return service.close();
	});

	test('Multiple ops (Immediate Strategy)', async function () {
		const storageFile = join(testDir, 'storage.json');
		writeFileSync(storageFile, '');

		let service = disposables.add(new FileStorage(URI.file(storageFile), SaveStrategy.IMMEDIATE, logService, fileService));
		await service.init();

		service.setItem('some.key1', 'some.value1');
		service.setItem('some.key2', 'some.value2');
		service.setItem('some.key3', 'some.value3');
		service.setItem('some.key4', 'some.value4');
		service.removeItem('some.key4');

		assert.strictEqual(service.getItem('some.key1'), 'some.value1');
		assert.strictEqual(service.getItem('some.key2'), 'some.value2');
		assert.strictEqual(service.getItem('some.key3'), 'some.value3');
		assert.strictEqual(service.getItem('some.key4'), undefined);

		await service.close();

		service = disposables.add(new FileStorage(URI.file(storageFile), SaveStrategy.IMMEDIATE, logService, fileService));
		await service.init();

		assert.strictEqual(service.getItem('some.key1'), 'some.value1');
		assert.strictEqual(service.getItem('some.key2'), 'some.value2');
		assert.strictEqual(service.getItem('some.key3'), 'some.value3');
		assert.strictEqual(service.getItem('some.key4'), undefined);

		return service.close();
	});

	test('Used before init', async function () {
		const storageFile = join(testDir, 'storage.json');
		writeFileSync(storageFile, '');

		const service = disposables.add(new FileStorage(URI.file(storageFile), SaveStrategy.DELAYED, logService, fileService));

		service.setItem('some.key1', 'some.value1');
		service.setItem('some.key2', 'some.value2');
		service.setItem('some.key3', 'some.value3');
		service.setItem('some.key4', 'some.value4');
		service.removeItem('some.key4');

		assert.strictEqual(service.getItem('some.key1'), 'some.value1');
		assert.strictEqual(service.getItem('some.key2'), 'some.value2');
		assert.strictEqual(service.getItem('some.key3'), 'some.value3');
		assert.strictEqual(service.getItem('some.key4'), undefined);

		await service.init();

		assert.strictEqual(service.getItem('some.key1'), 'some.value1');
		assert.strictEqual(service.getItem('some.key2'), 'some.value2');
		assert.strictEqual(service.getItem('some.key3'), 'some.value3');
		assert.strictEqual(service.getItem('some.key4'), undefined);

		return service.close();
	});

	test('Used after close', async function () {
		const storageFile = join(testDir, 'storage.json');
		writeFileSync(storageFile, '');

		const service = disposables.add(new FileStorage(URI.file(storageFile), SaveStrategy.DELAYED, logService, fileService));

		await service.init();

		service.setItem('some.key1', 'some.value1');
		service.setItem('some.key2', 'some.value2');
		service.setItem('some.key3', 'some.value3');
		service.setItem('some.key4', 'some.value4');

		await service.close();

		service.setItem('some.key5', 'some.marker');

		const contents = readFileSync(storageFile).toString();
		assert.ok(contents.includes('some.value1'));
		assert.ok(!contents.includes('some.marker'));

		return service.close();
	});

	test('Closed before init', async function () {
		const storageFile = join(testDir, 'storage.json');
		writeFileSync(storageFile, '');

		const service = disposables.add(new FileStorage(URI.file(storageFile), SaveStrategy.DELAYED, logService, fileService));

		service.setItem('some.key1', 'some.value1');
		service.setItem('some.key2', 'some.value2');
		service.setItem('some.key3', 'some.value3');
		service.setItem('some.key4', 'some.value4');

		await service.close();

		const contents = readFileSync(storageFile).toString();
		assert.strictEqual(contents.length, 0);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/storage/common/storage.ts]---
Location: vscode-main/src/vs/platform/storage/common/storage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Promises, RunOnceScheduler, runWhenGlobalIdle } from '../../../base/common/async.js';
import { Emitter, Event, PauseableEmitter } from '../../../base/common/event.js';
import { Disposable, DisposableStore, dispose, MutableDisposable } from '../../../base/common/lifecycle.js';
import { mark } from '../../../base/common/performance.js';
import { isUndefinedOrNull } from '../../../base/common/types.js';
import { InMemoryStorageDatabase, IStorage, IStorageChangeEvent, Storage, StorageHint, StorageValue } from '../../../base/parts/storage/common/storage.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { isUserDataProfile, IUserDataProfile } from '../../userDataProfile/common/userDataProfile.js';
import { IAnyWorkspaceIdentifier } from '../../workspace/common/workspace.js';

export const IS_NEW_KEY = '__$__isNewStorageMarker';
export const TARGET_KEY = '__$__targetStorageMarker';

export const IStorageService = createDecorator<IStorageService>('storageService');

export enum WillSaveStateReason {

	/**
	 * No specific reason to save state.
	 */
	NONE,

	/**
	 * A hint that the workbench is about to shutdown.
	 */
	SHUTDOWN
}

export interface IWillSaveStateEvent {
	readonly reason: WillSaveStateReason;
}

export interface IStorageEntry {
	readonly key: string;
	readonly value: StorageValue;
	readonly scope: StorageScope;
	readonly target: StorageTarget;
}

export interface IWorkspaceStorageValueChangeEvent extends IStorageValueChangeEvent {
	readonly scope: StorageScope.WORKSPACE;
}

export interface IProfileStorageValueChangeEvent extends IStorageValueChangeEvent {
	readonly scope: StorageScope.PROFILE;
}

export interface IApplicationStorageValueChangeEvent extends IStorageValueChangeEvent {
	readonly scope: StorageScope.APPLICATION;
}

export interface IStorageService {

	readonly _serviceBrand: undefined;

	/**
	 * Emitted whenever data is updated or deleted on the given
	 * scope and optional key.
	 *
	 * @param scope the `StorageScope` to listen to changes
	 * @param key the optional key to filter for or all keys of
	 * the scope if `undefined`
	 */
	onDidChangeValue(scope: StorageScope.WORKSPACE, key: string | undefined, disposable: DisposableStore): Event<IWorkspaceStorageValueChangeEvent>;
	onDidChangeValue(scope: StorageScope.PROFILE, key: string | undefined, disposable: DisposableStore): Event<IProfileStorageValueChangeEvent>;
	onDidChangeValue(scope: StorageScope.APPLICATION, key: string | undefined, disposable: DisposableStore): Event<IApplicationStorageValueChangeEvent>;
	onDidChangeValue(scope: StorageScope, key: string | undefined, disposable: DisposableStore): Event<IStorageValueChangeEvent>;

	/**
	 * Emitted whenever target of a storage entry changes.
	 */
	readonly onDidChangeTarget: Event<IStorageTargetChangeEvent>;

	/**
	 * Emitted when the storage is about to persist. This is the right time
	 * to persist data to ensure it is stored before the application shuts
	 * down.
	 *
	 * The will save state event allows to optionally ask for the reason of
	 * saving the state, e.g. to find out if the state is saved due to a
	 * shutdown.
	 *
	 * Note: this event may be fired many times, not only on shutdown to prevent
	 * loss of state in situations where the shutdown is not sufficient to
	 * persist the data properly.
	 */
	readonly onWillSaveState: Event<IWillSaveStateEvent>;

	/**
	 * Retrieve an element stored with the given key from storage. Use
	 * the provided `defaultValue` if the element is `null` or `undefined`.
	 *
	 * @param scope allows to define the scope of the storage operation
	 * to either the current workspace only, all workspaces or all profiles.
	 */
	get(key: string, scope: StorageScope, fallbackValue: string): string;
	get(key: string, scope: StorageScope, fallbackValue?: string): string | undefined;

	/**
	 * Retrieve an element stored with the given key from storage. Use
	 * the provided `defaultValue` if the element is `null` or `undefined`.
	 * The element will be converted to a `boolean`.
	 *
	 * @param scope allows to define the scope of the storage operation
	 * to either the current workspace only, all workspaces or all profiles.
	 */
	getBoolean(key: string, scope: StorageScope, fallbackValue: boolean): boolean;
	getBoolean(key: string, scope: StorageScope, fallbackValue?: boolean): boolean | undefined;

	/**
	 * Retrieve an element stored with the given key from storage. Use
	 * the provided `defaultValue` if the element is `null` or `undefined`.
	 * The element will be converted to a `number` using `parseInt` with a
	 * base of `10`.
	 *
	 * @param scope allows to define the scope of the storage operation
	 * to either the current workspace only, all workspaces or all profiles.
	 */
	getNumber(key: string, scope: StorageScope, fallbackValue: number): number;
	getNumber(key: string, scope: StorageScope, fallbackValue?: number): number | undefined;

	/**
	 * Retrieve an element stored with the given key from storage. Use
	 * the provided `defaultValue` if the element is `null` or `undefined`.
	 * The element will be converted to a `object` using `JSON.parse`.
	 *
	 * @param scope allows to define the scope of the storage operation
	 * to either the current workspace only, all workspaces or all profiles.
	 */
	getObject<T extends object>(key: string, scope: StorageScope, fallbackValue: T): T;
	getObject<T extends object>(key: string, scope: StorageScope, fallbackValue?: T): T | undefined;

	/**
	 * Store a value under the given key to storage. The value will be
	 * converted to a `string`. Storing either `undefined` or `null` will
	 * remove the entry under the key.
	 *
	 * @param scope allows to define the scope of the storage operation
	 * to either the current workspace only, all workspaces or all profiles.
	 *
	 * @param target allows to define the target of the storage operation
	 * to either the current machine or user.
	 */
	store(key: string, value: StorageValue, scope: StorageScope, target: StorageTarget): void;

	/**
	 * Allows to store multiple values in a bulk operation. Events will only
	 * be emitted when all values have been stored.
	 *
	 * @param external a hint to indicate the source of the operation is external,
	 * such as settings sync or profile changes.
	 */
	storeAll(entries: Array<IStorageEntry>, external: boolean): void;

	/**
	 * Delete an element stored under the provided key from storage.
	 *
	 * The scope argument allows to define the scope of the storage
	 * operation to either the current workspace only, all workspaces
	 * or all profiles.
	 */
	remove(key: string, scope: StorageScope): void;

	/**
	 * Returns all the keys used in the storage for the provided `scope`
	 * and `target`.
	 *
	 * Note: this will NOT return all keys stored in the storage layer.
	 * Some keys may not have an associated `StorageTarget` and thus
	 * will be excluded from the results.
	 *
	 * @param scope allows to define the scope for the keys
	 * to either the current workspace only, all workspaces or all profiles.
	 *
	 * @param target allows to define the target for the keys
	 * to either the current machine or user.
	 */
	keys(scope: StorageScope, target: StorageTarget): string[];

	/**
	 * Log the contents of the storage to the console.
	 */
	log(): void;

	/**
	 * Returns true if the storage service handles the provided scope.
	 */
	hasScope(scope: IAnyWorkspaceIdentifier | IUserDataProfile): boolean;

	/**
	 * Switch storage to another workspace or profile. Optionally preserve the
	 * current data to the new storage.
	 */
	switch(to: IAnyWorkspaceIdentifier | IUserDataProfile, preserveData: boolean): Promise<void>;

	/**
	 * Whether the storage for the given scope was created during this session or
	 * existed before.
	 */
	isNew(scope: StorageScope): boolean;

	/**
	 * Attempts to reduce the DB size via optimization commands if supported.
	 */
	optimize(scope: StorageScope): Promise<void>;

	/**
	 * Allows to flush state, e.g. in cases where a shutdown is
	 * imminent. This will send out the `onWillSaveState` to ask
	 * everyone for latest state.
	 *
	 * @returns a `Promise` that can be awaited on when all updates
	 * to the underlying storage have been flushed.
	 */
	flush(reason?: WillSaveStateReason): Promise<void>;
}

export const enum StorageScope {

	/**
	 * The stored data will be scoped to all workspaces across all profiles.
	 */
	APPLICATION = -1,

	/**
	 * The stored data will be scoped to all workspaces of the same profile.
	 */
	PROFILE = 0,

	/**
	 * The stored data will be scoped to the current workspace.
	 */
	WORKSPACE = 1
}

export const enum StorageTarget {

	/**
	 * The stored data is user specific and applies across machines.
	 */
	USER,

	/**
	 * The stored data is machine specific.
	 */
	MACHINE
}

export interface IStorageValueChangeEvent {

	/**
	 * The scope for the storage entry that changed
	 * or was removed.
	 */
	readonly scope: StorageScope;

	/**
	 * The `key` of the storage entry that was changed
	 * or was removed.
	 */
	readonly key: string;

	/**
	 * The `target` can be `undefined` if a key is being
	 * removed.
	 */
	readonly target: StorageTarget | undefined;

	/**
	 * A hint how the storage change event was triggered. If
	 * `true`, the storage change was triggered by an external
	 * source, such as:
	 * - another process (for example another window)
	 * - operations such as settings sync or profiles change
	 */
	readonly external?: boolean;
}

export interface IStorageTargetChangeEvent {

	/**
	 * The scope for the target that changed. Listeners
	 * should use `keys(scope, target)` to get an updated
	 * list of keys for the given `scope` and `target`.
	 */
	readonly scope: StorageScope;
}

interface IKeyTargets {
	[key: string]: StorageTarget;
}

export interface IStorageServiceOptions {
	readonly flushInterval: number;
}

export function loadKeyTargets(storage: IStorage): IKeyTargets {
	const keysRaw = storage.get(TARGET_KEY);
	if (keysRaw) {
		try {
			return JSON.parse(keysRaw);
		} catch (error) {
			// Fail gracefully
		}
	}

	return Object.create(null);
}

export abstract class AbstractStorageService extends Disposable implements IStorageService {

	declare readonly _serviceBrand: undefined;

	private static DEFAULT_FLUSH_INTERVAL = 60 * 1000; // every minute

	private readonly _onDidChangeValue = this._register(new PauseableEmitter<IStorageValueChangeEvent>());

	private readonly _onDidChangeTarget = this._register(new PauseableEmitter<IStorageTargetChangeEvent>());
	readonly onDidChangeTarget = this._onDidChangeTarget.event;

	private readonly _onWillSaveState = this._register(new Emitter<IWillSaveStateEvent>());
	readonly onWillSaveState = this._onWillSaveState.event;

	private initializationPromise: Promise<void> | undefined;

	private readonly flushWhenIdleScheduler: RunOnceScheduler;
	private readonly runFlushWhenIdle = this._register(new MutableDisposable());

	constructor(options: IStorageServiceOptions = { flushInterval: AbstractStorageService.DEFAULT_FLUSH_INTERVAL }) {
		super();

		this.flushWhenIdleScheduler = this._register(new RunOnceScheduler(() => this.doFlushWhenIdle(), options.flushInterval));
	}

	onDidChangeValue(scope: StorageScope.WORKSPACE, key: string | undefined, disposable: DisposableStore): Event<IWorkspaceStorageValueChangeEvent>;
	onDidChangeValue(scope: StorageScope.PROFILE, key: string | undefined, disposable: DisposableStore): Event<IProfileStorageValueChangeEvent>;
	onDidChangeValue(scope: StorageScope.APPLICATION, key: string | undefined, disposable: DisposableStore): Event<IApplicationStorageValueChangeEvent>;
	onDidChangeValue(scope: StorageScope, key: string | undefined, disposable: DisposableStore): Event<IStorageValueChangeEvent> {
		return Event.filter(this._onDidChangeValue.event, e => e.scope === scope && (key === undefined || e.key === key), disposable);
	}

	private doFlushWhenIdle(): void {
		this.runFlushWhenIdle.value = runWhenGlobalIdle(() => {
			if (this.shouldFlushWhenIdle()) {
				this.flush();
			}

			// repeat
			this.flushWhenIdleScheduler.schedule();
		});
	}

	protected shouldFlushWhenIdle(): boolean {
		return true;
	}

	protected stopFlushWhenIdle(): void {
		dispose([this.runFlushWhenIdle, this.flushWhenIdleScheduler]);
	}

	initialize(): Promise<void> {
		if (!this.initializationPromise) {
			this.initializationPromise = (async () => {

				// Init all storage locations
				mark('code/willInitStorage');
				try {
					await this.doInitialize(); // Ask subclasses to initialize storage
				} finally {
					mark('code/didInitStorage');
				}

				// On some OS we do not get enough time to persist state on shutdown (e.g. when
				// Windows restarts after applying updates). In other cases, VSCode might crash,
				// so we periodically save state to reduce the chance of loosing any state.
				// In the browser we do not have support for long running unload sequences. As such,
				// we cannot ask for saving state in that moment, because that would result in a
				// long running operation.
				// Instead, periodically ask customers to save save. The library will be clever enough
				// to only save state that has actually changed.
				this.flushWhenIdleScheduler.schedule();
			})();
		}

		return this.initializationPromise;
	}

	protected emitDidChangeValue(scope: StorageScope, event: IStorageChangeEvent): void {
		const { key, external } = event;

		// Specially handle `TARGET_KEY`
		if (key === TARGET_KEY) {

			// Clear our cached version which is now out of date
			switch (scope) {
				case StorageScope.APPLICATION:
					this._applicationKeyTargets = undefined;
					break;
				case StorageScope.PROFILE:
					this._profileKeyTargets = undefined;
					break;
				case StorageScope.WORKSPACE:
					this._workspaceKeyTargets = undefined;
					break;
			}

			// Emit as `didChangeTarget` event
			this._onDidChangeTarget.fire({ scope });
		}

		// Emit any other key to outside
		else {
			this._onDidChangeValue.fire({ scope, key, target: this.getKeyTargets(scope)[key], external });
		}
	}

	protected emitWillSaveState(reason: WillSaveStateReason): void {
		this._onWillSaveState.fire({ reason });
	}

	get(key: string, scope: StorageScope, fallbackValue: string): string;
	get(key: string, scope: StorageScope): string | undefined;
	get(key: string, scope: StorageScope, fallbackValue?: string): string | undefined {
		return this.getStorage(scope)?.get(key, fallbackValue);
	}

	getBoolean(key: string, scope: StorageScope, fallbackValue: boolean): boolean;
	getBoolean(key: string, scope: StorageScope): boolean | undefined;
	getBoolean(key: string, scope: StorageScope, fallbackValue?: boolean): boolean | undefined {
		return this.getStorage(scope)?.getBoolean(key, fallbackValue);
	}

	getNumber(key: string, scope: StorageScope, fallbackValue: number): number;
	getNumber(key: string, scope: StorageScope): number | undefined;
	getNumber(key: string, scope: StorageScope, fallbackValue?: number): number | undefined {
		return this.getStorage(scope)?.getNumber(key, fallbackValue);
	}

	getObject(key: string, scope: StorageScope, fallbackValue: object): object;
	getObject(key: string, scope: StorageScope): object | undefined;
	getObject(key: string, scope: StorageScope, fallbackValue?: object): object | undefined {
		return this.getStorage(scope)?.getObject(key, fallbackValue);
	}

	storeAll(entries: Array<IStorageEntry>, external: boolean): void {
		this.withPausedEmitters(() => {
			for (const entry of entries) {
				this.store(entry.key, entry.value, entry.scope, entry.target, external);
			}
		});
	}

	store(key: string, value: StorageValue, scope: StorageScope, target: StorageTarget, external = false): void {

		// We remove the key for undefined/null values
		if (isUndefinedOrNull(value)) {
			this.remove(key, scope, external);
			return;
		}

		// Update our datastructures but send events only after
		this.withPausedEmitters(() => {

			// Update key-target map
			this.updateKeyTarget(key, scope, target);

			// Store actual value
			this.getStorage(scope)?.set(key, value, external);
		});
	}

	remove(key: string, scope: StorageScope, external = false): void {

		// Update our datastructures but send events only after
		this.withPausedEmitters(() => {

			// Update key-target map
			this.updateKeyTarget(key, scope, undefined);

			// Remove actual key
			this.getStorage(scope)?.delete(key, external);
		});
	}

	private withPausedEmitters(fn: Function): void {

		// Pause emitters
		this._onDidChangeValue.pause();
		this._onDidChangeTarget.pause();

		try {
			fn();
		} finally {

			// Resume emitters
			this._onDidChangeValue.resume();
			this._onDidChangeTarget.resume();
		}
	}

	keys(scope: StorageScope, target: StorageTarget): string[] {
		const keys: string[] = [];

		const keyTargets = this.getKeyTargets(scope);
		for (const key of Object.keys(keyTargets)) {
			const keyTarget = keyTargets[key];
			if (keyTarget === target) {
				keys.push(key);
			}
		}

		return keys;
	}

	private updateKeyTarget(key: string, scope: StorageScope, target: StorageTarget | undefined, external = false): void {

		// Add
		const keyTargets = this.getKeyTargets(scope);
		if (typeof target === 'number') {
			if (keyTargets[key] !== target) {
				keyTargets[key] = target;
				this.getStorage(scope)?.set(TARGET_KEY, JSON.stringify(keyTargets), external);
			}
		}

		// Remove
		else {
			if (typeof keyTargets[key] === 'number') {
				delete keyTargets[key];
				this.getStorage(scope)?.set(TARGET_KEY, JSON.stringify(keyTargets), external);
			}
		}
	}

	private _workspaceKeyTargets: IKeyTargets | undefined = undefined;
	private get workspaceKeyTargets(): IKeyTargets {
		if (!this._workspaceKeyTargets) {
			this._workspaceKeyTargets = this.loadKeyTargets(StorageScope.WORKSPACE);
		}

		return this._workspaceKeyTargets;
	}

	private _profileKeyTargets: IKeyTargets | undefined = undefined;
	private get profileKeyTargets(): IKeyTargets {
		if (!this._profileKeyTargets) {
			this._profileKeyTargets = this.loadKeyTargets(StorageScope.PROFILE);
		}

		return this._profileKeyTargets;
	}

	private _applicationKeyTargets: IKeyTargets | undefined = undefined;
	private get applicationKeyTargets(): IKeyTargets {
		if (!this._applicationKeyTargets) {
			this._applicationKeyTargets = this.loadKeyTargets(StorageScope.APPLICATION);
		}

		return this._applicationKeyTargets;
	}

	private getKeyTargets(scope: StorageScope): IKeyTargets {
		switch (scope) {
			case StorageScope.APPLICATION:
				return this.applicationKeyTargets;
			case StorageScope.PROFILE:
				return this.profileKeyTargets;
			default:
				return this.workspaceKeyTargets;
		}
	}

	private loadKeyTargets(scope: StorageScope): { [key: string]: StorageTarget } {
		const storage = this.getStorage(scope);

		return storage ? loadKeyTargets(storage) : Object.create(null);
	}

	isNew(scope: StorageScope): boolean {
		return this.getBoolean(IS_NEW_KEY, scope) === true;
	}

	async flush(reason = WillSaveStateReason.NONE): Promise<void> {

		// Signal event to collect changes
		this._onWillSaveState.fire({ reason });

		const applicationStorage = this.getStorage(StorageScope.APPLICATION);
		const profileStorage = this.getStorage(StorageScope.PROFILE);
		const workspaceStorage = this.getStorage(StorageScope.WORKSPACE);

		switch (reason) {

			// Unspecific reason: just wait when data is flushed
			case WillSaveStateReason.NONE:
				await Promises.settled([
					applicationStorage?.whenFlushed() ?? Promise.resolve(),
					profileStorage?.whenFlushed() ?? Promise.resolve(),
					workspaceStorage?.whenFlushed() ?? Promise.resolve()
				]);
				break;

			// Shutdown: we want to flush as soon as possible
			// and not hit any delays that might be there
			case WillSaveStateReason.SHUTDOWN:
				await Promises.settled([
					applicationStorage?.flush(0) ?? Promise.resolve(),
					profileStorage?.flush(0) ?? Promise.resolve(),
					workspaceStorage?.flush(0) ?? Promise.resolve()
				]);
				break;
		}
	}

	async log(): Promise<void> {
		const applicationItems = this.getStorage(StorageScope.APPLICATION)?.items ?? new Map<string, string>();
		const profileItems = this.getStorage(StorageScope.PROFILE)?.items ?? new Map<string, string>();
		const workspaceItems = this.getStorage(StorageScope.WORKSPACE)?.items ?? new Map<string, string>();

		return logStorage(
			applicationItems,
			profileItems,
			workspaceItems,
			this.getLogDetails(StorageScope.APPLICATION) ?? '',
			this.getLogDetails(StorageScope.PROFILE) ?? '',
			this.getLogDetails(StorageScope.WORKSPACE) ?? ''
		);
	}

	async optimize(scope: StorageScope): Promise<void> {

		// Await pending data to be flushed to the DB
		// before attempting to optimize the DB
		await this.flush();

		return this.getStorage(scope)?.optimize();
	}

	async switch(to: IAnyWorkspaceIdentifier | IUserDataProfile, preserveData: boolean): Promise<void> {

		// Signal as event so that clients can store data before we switch
		this.emitWillSaveState(WillSaveStateReason.NONE);

		if (isUserDataProfile(to)) {
			return this.switchToProfile(to, preserveData);
		}

		return this.switchToWorkspace(to, preserveData);
	}

	protected canSwitchProfile(from: IUserDataProfile, to: IUserDataProfile): boolean {
		if (from.id === to.id) {
			return false; // both profiles are same
		}

		if (isProfileUsingDefaultStorage(to) && isProfileUsingDefaultStorage(from)) {
			return false; // both profiles are using default
		}

		return true;
	}

	protected switchData(oldStorage: Map<string, string>, newStorage: IStorage, scope: StorageScope): void {
		this.withPausedEmitters(() => {
			// Signal storage keys that have changed
			const handledkeys = new Set<string>();
			for (const [key, oldValue] of oldStorage) {
				handledkeys.add(key);

				const newValue = newStorage.get(key);
				if (newValue !== oldValue) {
					this.emitDidChangeValue(scope, { key, external: true });
				}
			}

			for (const [key] of newStorage.items) {
				if (!handledkeys.has(key)) {
					this.emitDidChangeValue(scope, { key, external: true });
				}
			}
		});
	}

	// --- abstract

	abstract hasScope(scope: IAnyWorkspaceIdentifier | IUserDataProfile): boolean;

	protected abstract doInitialize(): Promise<void>;

	protected abstract getStorage(scope: StorageScope): IStorage | undefined;

	protected abstract getLogDetails(scope: StorageScope): string | undefined;

	protected abstract switchToProfile(toProfile: IUserDataProfile, preserveData: boolean): Promise<void>;
	protected abstract switchToWorkspace(toWorkspace: IAnyWorkspaceIdentifier | IUserDataProfile, preserveData: boolean): Promise<void>;
}

export function isProfileUsingDefaultStorage(profile: IUserDataProfile): boolean {
	return profile.isDefault || !!profile.useDefaultFlags?.globalState;
}

export class InMemoryStorageService extends AbstractStorageService {

	private readonly applicationStorage = this._register(new Storage(new InMemoryStorageDatabase(), { hint: StorageHint.STORAGE_IN_MEMORY }));
	private readonly profileStorage = this._register(new Storage(new InMemoryStorageDatabase(), { hint: StorageHint.STORAGE_IN_MEMORY }));
	private readonly workspaceStorage = this._register(new Storage(new InMemoryStorageDatabase(), { hint: StorageHint.STORAGE_IN_MEMORY }));

	constructor() {
		super();

		this._register(this.workspaceStorage.onDidChangeStorage(e => this.emitDidChangeValue(StorageScope.WORKSPACE, e)));
		this._register(this.profileStorage.onDidChangeStorage(e => this.emitDidChangeValue(StorageScope.PROFILE, e)));
		this._register(this.applicationStorage.onDidChangeStorage(e => this.emitDidChangeValue(StorageScope.APPLICATION, e)));
	}

	protected getStorage(scope: StorageScope): IStorage {
		switch (scope) {
			case StorageScope.APPLICATION:
				return this.applicationStorage;
			case StorageScope.PROFILE:
				return this.profileStorage;
			default:
				return this.workspaceStorage;
		}
	}

	protected getLogDetails(scope: StorageScope): string | undefined {
		switch (scope) {
			case StorageScope.APPLICATION:
				return 'inMemory (application)';
			case StorageScope.PROFILE:
				return 'inMemory (profile)';
			default:
				return 'inMemory (workspace)';
		}
	}

	protected async doInitialize(): Promise<void> { }

	protected async switchToProfile(): Promise<void> {
		// no-op when in-memory
	}

	protected async switchToWorkspace(): Promise<void> {
		// no-op when in-memory
	}

	protected override shouldFlushWhenIdle(): boolean {
		return false;
	}

	hasScope(scope: IAnyWorkspaceIdentifier | IUserDataProfile): boolean {
		return false;
	}
}

export async function logStorage(application: Map<string, string>, profile: Map<string, string>, workspace: Map<string, string>, applicationPath: string, profilePath: string, workspacePath: string): Promise<void> {
	const safeParse = (value: string) => {
		try {
			return JSON.parse(value);
		} catch (error) {
			return value;
		}
	};

	const applicationItems = new Map<string, string>();
	const applicationItemsParsed = new Map<string, string>();
	application.forEach((value, key) => {
		applicationItems.set(key, value);
		applicationItemsParsed.set(key, safeParse(value));
	});

	const profileItems = new Map<string, string>();
	const profileItemsParsed = new Map<string, string>();
	profile.forEach((value, key) => {
		profileItems.set(key, value);
		profileItemsParsed.set(key, safeParse(value));
	});

	const workspaceItems = new Map<string, string>();
	const workspaceItemsParsed = new Map<string, string>();
	workspace.forEach((value, key) => {
		workspaceItems.set(key, value);
		workspaceItemsParsed.set(key, safeParse(value));
	});

	if (applicationPath !== profilePath) {
		console.group(`Storage: Application (path: ${applicationPath})`);
	} else {
		console.group(`Storage: Application & Profile (path: ${applicationPath}, default profile)`);
	}
	const applicationValues: { key: string; value: string }[] = [];
	applicationItems.forEach((value, key) => {
		applicationValues.push({ key, value });
	});
	console.table(applicationValues);
	console.groupEnd();

	console.log(applicationItemsParsed);

	if (applicationPath !== profilePath) {
		console.group(`Storage: Profile (path: ${profilePath}, profile specific)`);
		const profileValues: { key: string; value: string }[] = [];
		profileItems.forEach((value, key) => {
			profileValues.push({ key, value });
		});
		console.table(profileValues);
		console.groupEnd();

		console.log(profileItemsParsed);
	}

	console.group(`Storage: Workspace (path: ${workspacePath})`);
	const workspaceValues: { key: string; value: string }[] = [];
	workspaceItems.forEach((value, key) => {
		workspaceValues.push({ key, value });
	});
	console.table(workspaceValues);
	console.groupEnd();

	console.log(workspaceItemsParsed);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/storage/common/storageIpc.ts]---
Location: vscode-main/src/vs/platform/storage/common/storageIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { UriDto } from '../../../base/common/uri.js';
import { IChannel } from '../../../base/parts/ipc/common/ipc.js';
import { IStorageDatabase, IStorageItemsChangeEvent, IUpdateRequest } from '../../../base/parts/storage/common/storage.js';
import { IUserDataProfile } from '../../userDataProfile/common/userDataProfile.js';
import { ISerializedSingleFolderWorkspaceIdentifier, ISerializedWorkspaceIdentifier, IEmptyWorkspaceIdentifier, IAnyWorkspaceIdentifier } from '../../workspace/common/workspace.js';

export type Key = string;
export type Value = string;
export type Item = [Key, Value];

export interface IBaseSerializableStorageRequest {

	/**
	 * Profile to correlate storage. Only used when no
	 * workspace is provided. Can be undefined to denote
	 * application scope.
	 */
	readonly profile: UriDto<IUserDataProfile> | undefined;

	/**
	 * Workspace to correlate storage. Can be undefined to
	 * denote application or profile scope depending on profile.
	 */
	readonly workspace: ISerializedWorkspaceIdentifier | ISerializedSingleFolderWorkspaceIdentifier | IEmptyWorkspaceIdentifier | undefined;

	/**
	 * Additional payload for the request to perform.
	 */
	readonly payload?: unknown;
}

export interface ISerializableUpdateRequest extends IBaseSerializableStorageRequest {
	insert?: Item[];
	delete?: Key[];
}

export interface ISerializableItemsChangeEvent {
	readonly changed?: Item[];
	readonly deleted?: Key[];
}

abstract class BaseStorageDatabaseClient extends Disposable implements IStorageDatabase {

	abstract readonly onDidChangeItemsExternal: Event<IStorageItemsChangeEvent>;

	constructor(
		protected channel: IChannel,
		protected profile: UriDto<IUserDataProfile> | undefined,
		protected workspace: IAnyWorkspaceIdentifier | undefined
	) {
		super();
	}

	async getItems(): Promise<Map<string, string>> {
		const serializableRequest: IBaseSerializableStorageRequest = { profile: this.profile, workspace: this.workspace };
		const items: Item[] = await this.channel.call('getItems', serializableRequest);

		return new Map(items);
	}

	updateItems(request: IUpdateRequest): Promise<void> {
		const serializableRequest: ISerializableUpdateRequest = { profile: this.profile, workspace: this.workspace };

		if (request.insert) {
			serializableRequest.insert = Array.from(request.insert.entries());
		}

		if (request.delete) {
			serializableRequest.delete = Array.from(request.delete.values());
		}

		return this.channel.call('updateItems', serializableRequest);
	}

	optimize(): Promise<void> {
		const serializableRequest: IBaseSerializableStorageRequest = { profile: this.profile, workspace: this.workspace };

		return this.channel.call('optimize', serializableRequest);
	}

	abstract close(): Promise<void>;
}

abstract class BaseProfileAwareStorageDatabaseClient extends BaseStorageDatabaseClient {

	private readonly _onDidChangeItemsExternal = this._register(new Emitter<IStorageItemsChangeEvent>());
	readonly onDidChangeItemsExternal = this._onDidChangeItemsExternal.event;

	constructor(channel: IChannel, profile: UriDto<IUserDataProfile> | undefined) {
		super(channel, profile, undefined);

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.channel.listen<ISerializableItemsChangeEvent>('onDidChangeStorage', { profile: this.profile })((e: ISerializableItemsChangeEvent) => this.onDidChangeStorage(e)));
	}

	private onDidChangeStorage(e: ISerializableItemsChangeEvent): void {
		if (Array.isArray(e.changed) || Array.isArray(e.deleted)) {
			this._onDidChangeItemsExternal.fire({
				changed: e.changed ? new Map(e.changed) : undefined,
				deleted: e.deleted ? new Set<string>(e.deleted) : undefined
			});
		}
	}
}

export class ApplicationStorageDatabaseClient extends BaseProfileAwareStorageDatabaseClient {

	constructor(channel: IChannel) {
		super(channel, undefined);
	}

	async close(): Promise<void> {

		// The application storage database is shared across all instances so
		// we do not close it from the window. However we dispose the
		// listener for external changes because we no longer interested in it.

		this.dispose();
	}
}

export class ProfileStorageDatabaseClient extends BaseProfileAwareStorageDatabaseClient {

	async close(): Promise<void> {

		// The profile storage database is shared across all instances of
		// the same profile so we do not close it from the window.
		// However we dispose the listener for external changes because
		// we no longer interested in it.

		this.dispose();
	}
}

export class WorkspaceStorageDatabaseClient extends BaseStorageDatabaseClient implements IStorageDatabase {

	readonly onDidChangeItemsExternal = Event.None; // unsupported for workspace storage because we only ever write from one window

	constructor(channel: IChannel, workspace: IAnyWorkspaceIdentifier) {
		super(channel, undefined, workspace);
	}

	async close(): Promise<void> {

		// The workspace storage database is only used in this instance
		// but we do not need to close it from here, the main process
		// can take care of that.

		this.dispose();
	}
}

export class StorageClient {

	constructor(private readonly channel: IChannel) { }

	isUsed(path: string): Promise<boolean> {
		const serializableRequest: ISerializableUpdateRequest = { payload: path, profile: undefined, workspace: undefined };

		return this.channel.call('isUsed', serializableRequest);
	}
}
```

--------------------------------------------------------------------------------

````
