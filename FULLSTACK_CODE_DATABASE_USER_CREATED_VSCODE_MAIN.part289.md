---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 289
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 289 of 552)

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

---[FILE: src/vs/platform/tunnel/common/tunnel.ts]---
Location: vscode-main/src/vs/platform/tunnel/common/tunnel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IDisposable, Disposable } from '../../../base/common/lifecycle.js';
import { OperatingSystem } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { IAddressProvider } from '../../remote/common/remoteAgentConnection.js';
import { TunnelPrivacy } from '../../remote/common/remoteAuthorityResolver.js';

export const ITunnelService = createDecorator<ITunnelService>('tunnelService');
export const ISharedTunnelsService = createDecorator<ISharedTunnelsService>('sharedTunnelsService');

export interface RemoteTunnel {
	readonly tunnelRemotePort: number;
	readonly tunnelRemoteHost: string;
	readonly tunnelLocalPort?: number;
	readonly localAddress: string;
	readonly privacy: string;
	readonly protocol?: string;
	dispose(silent?: boolean): Promise<void>;
}

export function isRemoteTunnel(something: unknown): something is RemoteTunnel {
	const asTunnel: Partial<RemoteTunnel> = something as Partial<RemoteTunnel>;
	return !!(asTunnel.tunnelRemotePort && asTunnel.tunnelRemoteHost && asTunnel.localAddress && asTunnel.privacy && asTunnel.dispose);
}

export interface TunnelOptions {
	remoteAddress: { port: number; host: string };
	localAddressPort?: number;
	label?: string;
	public?: boolean;
	privacy?: string;
	protocol?: string;
}

export enum TunnelProtocol {
	Http = 'http',
	Https = 'https'
}

export enum TunnelPrivacyId {
	ConstantPrivate = 'constantPrivate', // private, and changing is unsupported
	Private = 'private',
	Public = 'public'
}

export interface TunnelCreationOptions {
	elevationRequired?: boolean;
}

export interface TunnelProviderFeatures {
	elevation: boolean;
	/**
	 * @deprecated
	 */
	public?: boolean;
	privacyOptions: TunnelPrivacy[];
	protocol: boolean;
}

export interface ITunnelProvider {
	forwardPort(tunnelOptions: TunnelOptions, tunnelCreationOptions: TunnelCreationOptions): Promise<RemoteTunnel | string | undefined> | undefined;
}

export function isTunnelProvider(addressOrTunnelProvider: IAddressProvider | ITunnelProvider): addressOrTunnelProvider is ITunnelProvider {
	return !!(addressOrTunnelProvider as ITunnelProvider).forwardPort;
}

export enum ProvidedOnAutoForward {
	Notify = 1,
	OpenBrowser = 2,
	OpenPreview = 3,
	Silent = 4,
	Ignore = 5,
	OpenBrowserOnce = 6
}

export interface ProvidedPortAttributes {
	port: number;
	autoForwardAction: ProvidedOnAutoForward;
}

export interface PortAttributesProvider {
	providePortAttributes(ports: number[], pid: number | undefined, commandLine: string | undefined, token: CancellationToken): Promise<ProvidedPortAttributes[]>;
}

export interface ITunnel {
	remoteAddress: { port: number; host: string };

	/**
	 * The complete local address(ex. localhost:1234)
	 */
	localAddress: string;

	/**
	 * @deprecated Use privacy instead
	 */
	public?: boolean;

	privacy?: string;

	protocol?: string;

	/**
	 * Implementers of Tunnel should fire onDidDispose when dispose is called.
	 */
	readonly onDidDispose: Event<void>;

	dispose(): Promise<void> | void;
}

export interface ISharedTunnelsService {
	readonly _serviceBrand: undefined;

	openTunnel(authority: string, addressProvider: IAddressProvider | undefined, remoteHost: string | undefined, remotePort: number, localHost: string, localPort?: number, elevateIfNeeded?: boolean, privacy?: string, protocol?: string): Promise<RemoteTunnel | string | undefined> | undefined;
}

export interface ITunnelService {
	readonly _serviceBrand: undefined;

	readonly tunnels: Promise<readonly RemoteTunnel[]>;
	readonly canChangePrivacy: boolean;
	readonly privacyOptions: TunnelPrivacy[];
	readonly onTunnelOpened: Event<RemoteTunnel>;
	readonly onTunnelClosed: Event<{ host: string; port: number }>;
	readonly canElevate: boolean;
	readonly canChangeProtocol: boolean;
	readonly hasTunnelProvider: boolean;
	readonly onAddedTunnelProvider: Event<void>;

	canTunnel(uri: URI): boolean;
	openTunnel(addressProvider: IAddressProvider | undefined, remoteHost: string | undefined, remotePort: number, localHost?: string, localPort?: number, elevateIfNeeded?: boolean, privacy?: string, protocol?: string): Promise<RemoteTunnel | string | undefined> | undefined;
	getExistingTunnel(remoteHost: string, remotePort: number): Promise<RemoteTunnel | string | undefined>;
	setEnvironmentTunnel(remoteHost: string, remotePort: number, localAddress: string, privacy: string, protocol: string): void;
	closeTunnel(remoteHost: string, remotePort: number): Promise<void>;
	setTunnelProvider(provider: ITunnelProvider | undefined): IDisposable;
	setTunnelFeatures(features: TunnelProviderFeatures): void;
	isPortPrivileged(port: number): boolean;
}

export function extractLocalHostUriMetaDataForPortMapping(uri: URI): { address: string; port: number } | undefined {
	if (uri.scheme !== 'http' && uri.scheme !== 'https') {
		return undefined;
	}
	const localhostMatch = /^(localhost|127\.0\.0\.1|0\.0\.0\.0):(\d+)$/.exec(uri.authority);
	if (!localhostMatch) {
		return undefined;
	}
	return {
		address: localhostMatch[1],
		port: +localhostMatch[2],
	};
}

export function extractQueryLocalHostUriMetaDataForPortMapping(uri: URI): { address: string; port: number } | undefined {
	if (uri.scheme !== 'http' && uri.scheme !== 'https' || !uri.query) {
		return undefined;
	}
	const keyvalues = uri.query.split('&');
	for (const keyvalue of keyvalues) {
		const value = keyvalue.split('=')[1];
		if (/^https?:/.exec(value)) {
			const result = extractLocalHostUriMetaDataForPortMapping(URI.parse(value));
			if (result) {
				return result;
			}
		}
	}
	return undefined;
}

export const LOCALHOST_ADDRESSES = ['localhost', '127.0.0.1', '0:0:0:0:0:0:0:1', '::1'];
export function isLocalhost(host: string): boolean {
	return LOCALHOST_ADDRESSES.indexOf(host) >= 0;
}

export const ALL_INTERFACES_ADDRESSES = ['0.0.0.0', '0:0:0:0:0:0:0:0', '::'];
export function isAllInterfaces(host: string): boolean {
	return ALL_INTERFACES_ADDRESSES.indexOf(host) >= 0;
}

export function isPortPrivileged(port: number, host: string, os: OperatingSystem, osRelease: string): boolean {
	if (os === OperatingSystem.Windows) {
		return false;
	}
	if (os === OperatingSystem.Macintosh) {
		if (isAllInterfaces(host)) {
			const osVersion = (/(\d+)\.(\d+)\.(\d+)/g).exec(osRelease);
			if (osVersion?.length === 4) {
				const major = parseInt(osVersion[1]);
				if (major >= 18 /* since macOS Mojave, darwin version 18.0.0 */) {
					return false;
				}
			}
		}
	}
	return port < 1024;
}

export class DisposableTunnel {
	private _onDispose: Emitter<void> = new Emitter();
	readonly onDidDispose: Event<void> = this._onDispose.event;

	constructor(
		public readonly remoteAddress: { port: number; host: string },
		public readonly localAddress: { port: number; host: string } | string,
		private readonly _dispose: () => Promise<void>) { }

	dispose(): Promise<void> {
		this._onDispose.fire();
		return this._dispose();
	}
}

export abstract class AbstractTunnelService extends Disposable implements ITunnelService {
	declare readonly _serviceBrand: undefined;

	private _onTunnelOpened: Emitter<RemoteTunnel> = new Emitter();
	public onTunnelOpened: Event<RemoteTunnel> = this._onTunnelOpened.event;
	private _onTunnelClosed: Emitter<{ host: string; port: number }> = new Emitter();
	public onTunnelClosed: Event<{ host: string; port: number }> = this._onTunnelClosed.event;
	private _onAddedTunnelProvider: Emitter<void> = new Emitter();
	public onAddedTunnelProvider: Event<void> = this._onAddedTunnelProvider.event;
	protected readonly _tunnels = new Map</*host*/ string, Map</* port */ number, { refcount: number; readonly value: Promise<RemoteTunnel | string | undefined> }>>();
	protected _tunnelProvider: ITunnelProvider | undefined;
	protected _canElevate: boolean = false;
	private _canChangeProtocol: boolean = true;
	private _privacyOptions: TunnelPrivacy[] = [];
	private _factoryInProgress: Set<number/*port*/> = new Set();

	public constructor(
		@ILogService protected readonly logService: ILogService,
		@IConfigurationService protected readonly configurationService: IConfigurationService
	) { super(); }

	get hasTunnelProvider(): boolean {
		return !!this._tunnelProvider;
	}

	protected get defaultTunnelHost(): string {
		const settingValue = this.configurationService.getValue('remote.localPortHost');
		return (!settingValue || settingValue === 'localhost') ? '127.0.0.1' : '0.0.0.0';
	}

	setTunnelProvider(provider: ITunnelProvider | undefined): IDisposable {
		this._tunnelProvider = provider;
		if (!provider) {
			// clear features
			this._canElevate = false;
			this._privacyOptions = [];
			this._onAddedTunnelProvider.fire();
			return {
				dispose: () => { }
			};
		}

		this._onAddedTunnelProvider.fire();
		return {
			dispose: () => {
				this._tunnelProvider = undefined;
				this._canElevate = false;
				this._privacyOptions = [];
			}
		};
	}

	setTunnelFeatures(features: TunnelProviderFeatures): void {
		this._canElevate = features.elevation;
		this._privacyOptions = features.privacyOptions;
		this._canChangeProtocol = features.protocol;
	}

	public get canChangeProtocol(): boolean {
		return this._canChangeProtocol;
	}

	public get canElevate(): boolean {
		return this._canElevate;
	}

	public get canChangePrivacy() {
		return this._privacyOptions.length > 0;
	}

	public get privacyOptions() {
		return this._privacyOptions;
	}

	public get tunnels(): Promise<readonly RemoteTunnel[]> {
		return this.getTunnels();
	}

	private async getTunnels(): Promise<readonly RemoteTunnel[]> {
		const tunnels: RemoteTunnel[] = [];
		const tunnelArray = Array.from(this._tunnels.values());
		for (const portMap of tunnelArray) {
			const portArray = Array.from(portMap.values());
			for (const x of portArray) {
				const tunnelValue = await x.value;
				if (tunnelValue && (typeof tunnelValue !== 'string')) {
					tunnels.push(tunnelValue);
				}
			}
		}
		return tunnels;
	}

	override async dispose(): Promise<void> {
		super.dispose();
		for (const portMap of this._tunnels.values()) {
			for (const { value } of portMap.values()) {
				await value.then(tunnel => typeof tunnel !== 'string' ? tunnel?.dispose() : undefined);
			}
			portMap.clear();
		}
		this._tunnels.clear();
	}

	setEnvironmentTunnel(remoteHost: string, remotePort: number, localAddress: string, privacy: string, protocol: string): void {
		this.addTunnelToMap(remoteHost, remotePort, Promise.resolve({
			tunnelRemoteHost: remoteHost,
			tunnelRemotePort: remotePort,
			localAddress,
			privacy,
			protocol,
			dispose: () => Promise.resolve()
		}));
	}

	async getExistingTunnel(remoteHost: string, remotePort: number): Promise<RemoteTunnel | string | undefined> {
		if (isAllInterfaces(remoteHost) || isLocalhost(remoteHost)) {
			remoteHost = LOCALHOST_ADDRESSES[0];
		}

		const existing = this.getTunnelFromMap(remoteHost, remotePort);
		if (existing) {
			++existing.refcount;
			return existing.value;
		}
		return undefined;
	}

	openTunnel(addressProvider: IAddressProvider | undefined, remoteHost: string | undefined, remotePort: number, localHost?: string, localPort?: number, elevateIfNeeded: boolean = false, privacy?: string, protocol?: string): Promise<RemoteTunnel | string | undefined> | undefined {
		this.logService.trace(`ForwardedPorts: (TunnelService) openTunnel request for ${remoteHost}:${remotePort} on local port ${localPort}.`);
		const addressOrTunnelProvider = this._tunnelProvider ?? addressProvider;
		if (!addressOrTunnelProvider) {
			return undefined;
		}

		if (!remoteHost) {
			remoteHost = 'localhost';
		}
		if (!localHost) {
			localHost = this.defaultTunnelHost;
		}

		// Prevent tunnel factories from calling openTunnel from within the factory
		if (this._tunnelProvider && this._factoryInProgress.has(remotePort)) {
			this.logService.debug(`ForwardedPorts: (TunnelService) Another call to create a tunnel with the same address has occurred before the last one completed. This call will be ignored.`);
			return;
		}

		const resolvedTunnel = this.retainOrCreateTunnel(addressOrTunnelProvider, remoteHost, remotePort, localHost, localPort, elevateIfNeeded, privacy, protocol);
		if (!resolvedTunnel) {
			this.logService.trace(`ForwardedPorts: (TunnelService) Tunnel was not created.`);
			return resolvedTunnel;
		}

		return resolvedTunnel.then(tunnel => {
			if (!tunnel) {
				this.logService.trace('ForwardedPorts: (TunnelService) New tunnel is undefined.');
				this.removeEmptyOrErrorTunnelFromMap(remoteHost, remotePort);
				return undefined;
			} else if (typeof tunnel === 'string') {
				this.logService.trace('ForwardedPorts: (TunnelService) The tunnel provider returned an error when creating the tunnel.');
				this.removeEmptyOrErrorTunnelFromMap(remoteHost, remotePort);
				return tunnel;
			}
			this.logService.trace('ForwardedPorts: (TunnelService) New tunnel established.');
			const newTunnel = this.makeTunnel(tunnel);
			if (tunnel.tunnelRemoteHost !== remoteHost || tunnel.tunnelRemotePort !== remotePort) {
				this.logService.warn('ForwardedPorts: (TunnelService) Created tunnel does not match requirements of requested tunnel. Host or port mismatch.');
			}
			if (privacy && tunnel.privacy !== privacy) {
				this.logService.warn('ForwardedPorts: (TunnelService) Created tunnel does not match requirements of requested tunnel. Privacy mismatch.');
			}
			this._onTunnelOpened.fire(newTunnel);
			return newTunnel;
		});
	}

	private makeTunnel(tunnel: RemoteTunnel): RemoteTunnel {
		return {
			tunnelRemotePort: tunnel.tunnelRemotePort,
			tunnelRemoteHost: tunnel.tunnelRemoteHost,
			tunnelLocalPort: tunnel.tunnelLocalPort,
			localAddress: tunnel.localAddress,
			privacy: tunnel.privacy,
			protocol: tunnel.protocol,
			dispose: async () => {
				this.logService.trace(`ForwardedPorts: (TunnelService) dispose request for ${tunnel.tunnelRemoteHost}:${tunnel.tunnelRemotePort} `);
				const existingHost = this._tunnels.get(tunnel.tunnelRemoteHost);
				if (existingHost) {
					const existing = existingHost.get(tunnel.tunnelRemotePort);
					if (existing) {
						existing.refcount--;
						await this.tryDisposeTunnel(tunnel.tunnelRemoteHost, tunnel.tunnelRemotePort, existing);
					}
				}
			}
		};
	}

	private async tryDisposeTunnel(remoteHost: string, remotePort: number, tunnel: { refcount: number; readonly value: Promise<RemoteTunnel | string | undefined> }): Promise<void> {
		if (tunnel.refcount <= 0) {
			this.logService.trace(`ForwardedPorts: (TunnelService) Tunnel is being disposed ${remoteHost}:${remotePort}.`);
			const disposePromise: Promise<void> = tunnel.value.then(async (tunnel) => {
				if (tunnel && (typeof tunnel !== 'string')) {
					await tunnel.dispose(true);
					this._onTunnelClosed.fire({ host: tunnel.tunnelRemoteHost, port: tunnel.tunnelRemotePort });
				}
			});
			if (this._tunnels.has(remoteHost)) {
				this._tunnels.get(remoteHost)!.delete(remotePort);
			}
			return disposePromise;
		}
	}

	async closeTunnel(remoteHost: string, remotePort: number): Promise<void> {
		this.logService.trace(`ForwardedPorts: (TunnelService) close request for ${remoteHost}:${remotePort} `);
		const portMap = this._tunnels.get(remoteHost);
		if (portMap && portMap.has(remotePort)) {
			const value = portMap.get(remotePort)!;
			value.refcount = 0;
			await this.tryDisposeTunnel(remoteHost, remotePort, value);
		}
	}

	protected addTunnelToMap(remoteHost: string, remotePort: number, tunnel: Promise<RemoteTunnel | string | undefined>) {
		if (!this._tunnels.has(remoteHost)) {
			this._tunnels.set(remoteHost, new Map());
		}
		this._tunnels.get(remoteHost)!.set(remotePort, { refcount: 1, value: tunnel });
	}

	private async removeEmptyOrErrorTunnelFromMap(remoteHost: string, remotePort: number) {
		const hostMap = this._tunnels.get(remoteHost);
		if (hostMap) {
			const tunnel = hostMap.get(remotePort);
			const tunnelResult = tunnel ? await tunnel.value : undefined;
			if (!tunnelResult || (typeof tunnelResult === 'string')) {
				hostMap.delete(remotePort);
			}
			if (hostMap.size === 0) {
				this._tunnels.delete(remoteHost);
			}
		}
	}

	protected getTunnelFromMap(remoteHost: string, remotePort: number): { refcount: number; readonly value: Promise<RemoteTunnel | string | undefined> } | undefined {
		const hosts = [remoteHost];
		// Order matters. We want the original host to be first.
		if (isLocalhost(remoteHost)) {
			hosts.push(...LOCALHOST_ADDRESSES);
			// For localhost, we add the all interfaces hosts because if the tunnel is already available at all interfaces,
			// then of course it is available at localhost.
			hosts.push(...ALL_INTERFACES_ADDRESSES);
		} else if (isAllInterfaces(remoteHost)) {
			hosts.push(...ALL_INTERFACES_ADDRESSES);
		}

		const existingPortMaps = hosts.map(host => this._tunnels.get(host));
		for (const map of existingPortMaps) {
			const existingTunnel = map?.get(remotePort);
			if (existingTunnel) {
				return existingTunnel;
			}
		}
		return undefined;
	}

	canTunnel(uri: URI): boolean {
		return !!extractLocalHostUriMetaDataForPortMapping(uri);
	}

	public abstract isPortPrivileged(port: number): boolean;

	protected abstract retainOrCreateTunnel(addressProvider: IAddressProvider | ITunnelProvider, remoteHost: string, remotePort: number, localHost: string, localPort: number | undefined, elevateIfNeeded: boolean, privacy?: string, protocol?: string): Promise<RemoteTunnel | string | undefined> | undefined;

	protected createWithProvider(tunnelProvider: ITunnelProvider, remoteHost: string, remotePort: number, localPort: number | undefined, elevateIfNeeded: boolean, privacy?: string, protocol?: string): Promise<RemoteTunnel | string | undefined> | undefined {
		this.logService.trace(`ForwardedPorts: (TunnelService) Creating tunnel with provider ${remoteHost}:${remotePort} on local port ${localPort}.`);
		const key = remotePort;
		this._factoryInProgress.add(key);
		const preferredLocalPort = localPort === undefined ? remotePort : localPort;
		const creationInfo = { elevationRequired: elevateIfNeeded ? this.isPortPrivileged(preferredLocalPort) : false };
		const tunnelOptions: TunnelOptions = { remoteAddress: { host: remoteHost, port: remotePort }, localAddressPort: localPort, privacy, public: privacy ? (privacy !== TunnelPrivacyId.Private) : undefined, protocol };
		const tunnel = tunnelProvider.forwardPort(tunnelOptions, creationInfo);
		if (tunnel) {
			this.addTunnelToMap(remoteHost, remotePort, tunnel);
			tunnel.finally(() => {
				this.logService.trace('ForwardedPorts: (TunnelService) Tunnel created by provider.');
				this._factoryInProgress.delete(key);
			});
		} else {
			this._factoryInProgress.delete(key);
		}
		return tunnel;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/tunnel/node/sharedProcessTunnelService.ts]---
Location: vscode-main/src/vs/platform/tunnel/node/sharedProcessTunnelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILogService } from '../../log/common/log.js';
import { ISharedProcessTunnel, ISharedProcessTunnelService } from '../../remote/common/sharedProcessTunnelService.js';
import { ISharedTunnelsService, RemoteTunnel } from '../common/tunnel.js';
import { IAddress, IAddressProvider } from '../../remote/common/remoteAgentConnection.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { canceled } from '../../../base/common/errors.js';
import { DeferredPromise } from '../../../base/common/async.js';

class TunnelData extends Disposable implements IAddressProvider {

	private _address: IAddress | null;
	private _addressPromise: DeferredPromise<IAddress> | null;

	constructor() {
		super();
		this._address = null;
		this._addressPromise = null;
	}

	async getAddress(): Promise<IAddress> {
		if (this._address) {
			// address is resolved
			return this._address;
		}
		if (!this._addressPromise) {
			this._addressPromise = new DeferredPromise<IAddress>();
		}
		return this._addressPromise.p;
	}

	setAddress(address: IAddress): void {
		this._address = address;
		if (this._addressPromise) {
			this._addressPromise.complete(address);
			this._addressPromise = null;
		}
	}

	setTunnel(tunnel: RemoteTunnel): void {
		this._register(tunnel);
	}
}

export class SharedProcessTunnelService extends Disposable implements ISharedProcessTunnelService {
	_serviceBrand: undefined;

	private static _lastId = 0;

	private readonly _tunnels: Map<string, TunnelData> = new Map<string, TunnelData>();
	private readonly _disposedTunnels: Set<string> = new Set<string>();

	constructor(
		@ISharedTunnelsService private readonly _tunnelService: ISharedTunnelsService,
		@ILogService private readonly _logService: ILogService,
	) {
		super();
	}

	public override dispose(): void {
		super.dispose();
		this._tunnels.forEach((tunnel) => tunnel.dispose());
	}

	async createTunnel(): Promise<{ id: string }> {
		const id = String(++SharedProcessTunnelService._lastId);
		return { id };
	}

	async startTunnel(authority: string, id: string, tunnelRemoteHost: string, tunnelRemotePort: number, tunnelLocalHost: string, tunnelLocalPort: number | undefined, elevateIfNeeded: boolean | undefined): Promise<ISharedProcessTunnel> {
		const tunnelData = new TunnelData();

		const tunnel = await Promise.resolve(this._tunnelService.openTunnel(authority, tunnelData, tunnelRemoteHost, tunnelRemotePort, tunnelLocalHost, tunnelLocalPort, elevateIfNeeded));
		if (!tunnel || (typeof tunnel === 'string')) {
			this._logService.info(`[SharedProcessTunnelService] Could not create a tunnel to ${tunnelRemoteHost}:${tunnelRemotePort} (remote).`);
			tunnelData.dispose();
			throw new Error(`Could not create tunnel`);
		}

		if (this._disposedTunnels.delete(id)) {
			// This tunnel was disposed in the meantime
			tunnelData.dispose();
			await tunnel.dispose();
			throw canceled();
		}

		tunnelData.setTunnel(tunnel);
		this._tunnels.set(id, tunnelData);

		this._logService.info(`[SharedProcessTunnelService] Created tunnel ${id}: ${tunnel.localAddress} (local) to ${tunnelRemoteHost}:${tunnelRemotePort} (remote).`);
		const result: ISharedProcessTunnel = {
			tunnelLocalPort: tunnel.tunnelLocalPort,
			localAddress: tunnel.localAddress
		};
		return result;
	}

	async setAddress(id: string, address: IAddress): Promise<void> {
		const tunnel = this._tunnels.get(id);
		if (!tunnel) {
			return;
		}
		tunnel.setAddress(address);
	}

	async destroyTunnel(id: string): Promise<void> {
		const tunnel = this._tunnels.get(id);
		if (tunnel) {
			this._logService.info(`[SharedProcessTunnelService] Disposing tunnel ${id}.`);
			this._tunnels.delete(id);
			await tunnel.dispose();
			return;
		}

		// Looks like this tunnel is still starting, mark the id as disposed
		this._disposedTunnels.add(id);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/tunnel/node/tunnelService.ts]---
Location: vscode-main/src/vs/platform/tunnel/node/tunnelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as net from 'net';
import * as os from 'os';
import { BROWSER_RESTRICTED_PORTS, findFreePortFaster } from '../../../base/node/ports.js';
import { NodeSocket } from '../../../base/parts/ipc/node/ipc.net.js';

import { Barrier } from '../../../base/common/async.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { OS } from '../../../base/common/platform.js';
import { ISocket } from '../../../base/parts/ipc/common/ipc.net.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { ILogService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { IAddressProvider, IConnectionOptions, connectRemoteAgentTunnel } from '../../remote/common/remoteAgentConnection.js';
import { IRemoteSocketFactoryService } from '../../remote/common/remoteSocketFactoryService.js';
import { ISignService } from '../../sign/common/sign.js';
import { AbstractTunnelService, ISharedTunnelsService, ITunnelProvider, ITunnelService, RemoteTunnel, TunnelPrivacyId, isAllInterfaces, isLocalhost, isPortPrivileged, isTunnelProvider } from '../common/tunnel.js';
import { VSBuffer } from '../../../base/common/buffer.js';

async function createRemoteTunnel(options: IConnectionOptions, defaultTunnelHost: string, tunnelRemoteHost: string, tunnelRemotePort: number, tunnelLocalPort?: number): Promise<RemoteTunnel> {
	let readyTunnel: NodeRemoteTunnel | undefined;
	for (let attempts = 3; attempts; attempts--) {
		readyTunnel?.dispose();
		const tunnel = new NodeRemoteTunnel(options, defaultTunnelHost, tunnelRemoteHost, tunnelRemotePort, tunnelLocalPort);
		readyTunnel = await tunnel.waitForReady();
		if ((tunnelLocalPort && BROWSER_RESTRICTED_PORTS[tunnelLocalPort]) || !BROWSER_RESTRICTED_PORTS[readyTunnel.tunnelLocalPort]) {
			break;
		}
	}
	return readyTunnel!;
}

export class NodeRemoteTunnel extends Disposable implements RemoteTunnel {

	public readonly tunnelRemotePort: number;
	public tunnelLocalPort!: number;
	public tunnelRemoteHost: string;
	public localAddress!: string;
	public readonly privacy = TunnelPrivacyId.Private;

	private readonly _options: IConnectionOptions;
	private readonly _server: net.Server;
	private readonly _barrier: Barrier;

	private readonly _listeningListener: () => void;
	private readonly _connectionListener: (socket: net.Socket) => void;
	private readonly _errorListener: () => void;

	private readonly _socketsDispose: Map<string, () => void> = new Map();

	constructor(options: IConnectionOptions, private readonly defaultTunnelHost: string, tunnelRemoteHost: string, tunnelRemotePort: number, private readonly suggestedLocalPort?: number) {
		super();
		this._options = options;
		this._server = net.createServer();
		this._barrier = new Barrier();

		this._listeningListener = () => this._barrier.open();
		this._server.on('listening', this._listeningListener);

		this._connectionListener = (socket) => this._onConnection(socket);
		this._server.on('connection', this._connectionListener);

		// If there is no error listener and there is an error it will crash the whole window
		this._errorListener = () => { };
		this._server.on('error', this._errorListener);

		this.tunnelRemotePort = tunnelRemotePort;
		this.tunnelRemoteHost = tunnelRemoteHost;
	}

	public override async dispose(): Promise<void> {
		super.dispose();
		this._server.removeListener('listening', this._listeningListener);
		this._server.removeListener('connection', this._connectionListener);
		this._server.removeListener('error', this._errorListener);
		this._server.close();
		const disposers = Array.from(this._socketsDispose.values());
		disposers.forEach(disposer => {
			disposer();
		});
	}

	public async waitForReady(): Promise<this> {
		const startPort = this.suggestedLocalPort ?? this.tunnelRemotePort;
		const hostname = isAllInterfaces(this.defaultTunnelHost) ? '0.0.0.0' : '127.0.0.1';
		// try to get the same port number as the remote port number...
		let localPort = await findFreePortFaster(startPort, 2, 1000, hostname);

		// if that fails, the method above returns 0, which works out fine below...
		let address: string | net.AddressInfo | null = null;
		this._server.listen(localPort, this.defaultTunnelHost);
		await this._barrier.wait();
		address = <net.AddressInfo>this._server.address();

		// It is possible for findFreePortFaster to return a port that there is already a server listening on. This causes the previous listen call to error out.
		if (!address) {
			localPort = 0;
			this._server.listen(localPort, this.defaultTunnelHost);
			await this._barrier.wait();
			address = <net.AddressInfo>this._server.address();
		}

		this.tunnelLocalPort = address.port;
		this.localAddress = `${this.tunnelRemoteHost === '127.0.0.1' ? '127.0.0.1' : 'localhost'}:${address.port}`;
		return this;
	}

	private async _onConnection(localSocket: net.Socket): Promise<void> {
		// pause reading on the socket until we have a chance to forward its data
		localSocket.pause();

		const tunnelRemoteHost = (isLocalhost(this.tunnelRemoteHost) || isAllInterfaces(this.tunnelRemoteHost)) ? 'localhost' : this.tunnelRemoteHost;
		const protocol = await connectRemoteAgentTunnel(this._options, tunnelRemoteHost, this.tunnelRemotePort);
		const remoteSocket = protocol.getSocket();
		const dataChunk = protocol.readEntireBuffer();
		protocol.dispose();

		if (dataChunk.byteLength > 0) {
			localSocket.write(dataChunk.buffer);
		}

		localSocket.on('end', () => {
			if (localSocket.localAddress) {
				this._socketsDispose.delete(localSocket.localAddress);
			}
			remoteSocket.end();
		});
		localSocket.on('close', () => remoteSocket.end());
		localSocket.on('error', () => {
			if (localSocket.localAddress) {
				this._socketsDispose.delete(localSocket.localAddress);
			}
			if (remoteSocket instanceof NodeSocket) {
				remoteSocket.socket.destroy();
			} else {
				remoteSocket.end();
			}
		});

		if (remoteSocket instanceof NodeSocket) {
			this._mirrorNodeSocket(localSocket, remoteSocket);
		} else {
			this._mirrorGenericSocket(localSocket, remoteSocket);
		}

		if (localSocket.localAddress) {
			this._socketsDispose.set(localSocket.localAddress, () => {
				// Need to end instead of unpipe, otherwise whatever is connected locally could end up "stuck" with whatever state it had until manually exited.
				localSocket.end();
				remoteSocket.end();
			});
		}
	}

	private _mirrorGenericSocket(localSocket: net.Socket, remoteSocket: ISocket) {
		remoteSocket.onClose(() => localSocket.destroy());
		remoteSocket.onEnd(() => localSocket.end());
		remoteSocket.onData(d => localSocket.write(d.buffer));
		localSocket.on('data', d => remoteSocket.write(VSBuffer.wrap(d)));
		localSocket.resume();
	}

	private _mirrorNodeSocket(localSocket: net.Socket, remoteNodeSocket: NodeSocket) {
		const remoteSocket = remoteNodeSocket.socket;
		remoteSocket.on('end', () => localSocket.end());
		remoteSocket.on('close', () => localSocket.end());
		remoteSocket.on('error', () => {
			localSocket.destroy();
		});

		remoteSocket.pipe(localSocket);
		localSocket.pipe(remoteSocket);
	}
}

export class BaseTunnelService extends AbstractTunnelService {
	public constructor(
		@IRemoteSocketFactoryService private readonly remoteSocketFactoryService: IRemoteSocketFactoryService,
		@ILogService logService: ILogService,
		@ISignService private readonly signService: ISignService,
		@IProductService private readonly productService: IProductService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		super(logService, configurationService);
	}

	public isPortPrivileged(port: number): boolean {
		return isPortPrivileged(port, this.defaultTunnelHost, OS, os.release());
	}

	protected retainOrCreateTunnel(addressOrTunnelProvider: IAddressProvider | ITunnelProvider, remoteHost: string, remotePort: number, localHost: string, localPort: number | undefined, elevateIfNeeded: boolean, privacy?: string, protocol?: string): Promise<RemoteTunnel | string | undefined> | undefined {
		const existing = this.getTunnelFromMap(remoteHost, remotePort);
		if (existing) {
			++existing.refcount;
			return existing.value;
		}

		if (isTunnelProvider(addressOrTunnelProvider)) {
			return this.createWithProvider(addressOrTunnelProvider, remoteHost, remotePort, localPort, elevateIfNeeded, privacy, protocol);
		} else {
			this.logService.trace(`ForwardedPorts: (TunnelService) Creating tunnel without provider ${remoteHost}:${remotePort} on local port ${localPort}.`);
			const options: IConnectionOptions = {
				commit: this.productService.commit,
				quality: this.productService.quality,
				addressProvider: addressOrTunnelProvider,
				remoteSocketFactoryService: this.remoteSocketFactoryService,
				signService: this.signService,
				logService: this.logService,
				ipcLogger: null
			};

			const tunnel = createRemoteTunnel(options, localHost, remoteHost, remotePort, localPort);
			this.logService.trace('ForwardedPorts: (TunnelService) Tunnel created without provider.');
			this.addTunnelToMap(remoteHost, remotePort, tunnel);
			return tunnel;
		}
	}
}

export class TunnelService extends BaseTunnelService {
	public constructor(
		@IRemoteSocketFactoryService remoteSocketFactoryService: IRemoteSocketFactoryService,
		@ILogService logService: ILogService,
		@ISignService signService: ISignService,
		@IProductService productService: IProductService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		super(remoteSocketFactoryService, logService, signService, productService, configurationService);
	}
}

export class SharedTunnelsService extends Disposable implements ISharedTunnelsService {
	declare readonly _serviceBrand: undefined;
	private readonly _tunnelServices: Map<string, ITunnelService> = new Map();

	public constructor(
		@IRemoteSocketFactoryService protected readonly remoteSocketFactoryService: IRemoteSocketFactoryService,
		@ILogService protected readonly logService: ILogService,
		@IProductService private readonly productService: IProductService,
		@ISignService private readonly signService: ISignService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();
	}

	async openTunnel(authority: string, addressProvider: IAddressProvider | undefined, remoteHost: string | undefined, remotePort: number, localHost: string, localPort?: number, elevateIfNeeded?: boolean, privacy?: string, protocol?: string): Promise<RemoteTunnel | string | undefined> {
		this.logService.trace(`ForwardedPorts: (SharedTunnelService) openTunnel request for ${remoteHost}:${remotePort} on local port ${localPort}.`);
		if (!this._tunnelServices.has(authority)) {
			const tunnelService = new TunnelService(this.remoteSocketFactoryService, this.logService, this.signService, this.productService, this.configurationService);
			this._register(tunnelService);
			this._tunnelServices.set(authority, tunnelService);
			tunnelService.onTunnelClosed(async () => {
				if ((await tunnelService.tunnels).length === 0) {
					tunnelService.dispose();
					this._tunnelServices.delete(authority);
				}
			});
		}
		return this._tunnelServices.get(authority)!.openTunnel(addressProvider, remoteHost, remotePort, localHost, localPort, elevateIfNeeded, privacy, protocol);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/tunnel/test/common/tunnel.test.ts]---
Location: vscode-main/src/vs/platform/tunnel/test/common/tunnel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import {
	extractLocalHostUriMetaDataForPortMapping,
	extractQueryLocalHostUriMetaDataForPortMapping
} from '../../common/tunnel.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';


suite('Tunnel', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	function portMappingDoTest(uri: string,
		func: (uri: URI) => { address: string; port: number } | undefined,
		expectedAddress?: string,
		expectedPort?: number) {
		const res = func(URI.parse(uri));
		assert.strictEqual(!expectedAddress, !res);
		assert.strictEqual(res?.address, expectedAddress);
		assert.strictEqual(res?.port, expectedPort);
	}

	function portMappingTest(uri: string, expectedAddress?: string, expectedPort?: number) {
		portMappingDoTest(uri, extractLocalHostUriMetaDataForPortMapping, expectedAddress, expectedPort);
	}

	function portMappingTestQuery(uri: string, expectedAddress?: string, expectedPort?: number) {
		portMappingDoTest(uri, extractQueryLocalHostUriMetaDataForPortMapping, expectedAddress, expectedPort);
	}

	test('portMapping', () => {
		portMappingTest('file:///foo.bar/baz');
		portMappingTest('http://foo.bar:1234');
		portMappingTest('http://localhost:8080', 'localhost', 8080);
		portMappingTest('https://localhost:443', 'localhost', 443);
		portMappingTest('http://127.0.0.1:3456', '127.0.0.1', 3456);
		portMappingTest('http://0.0.0.0:7654', '0.0.0.0', 7654);
		portMappingTest('http://localhost:8080/path?foo=bar', 'localhost', 8080);
		portMappingTest('http://localhost:8080/path?foo=http%3A%2F%2Flocalhost%3A8081', 'localhost', 8080);
		portMappingTestQuery('http://foo.bar/path?url=http%3A%2F%2Flocalhost%3A8081', 'localhost', 8081);
		portMappingTestQuery('http://foo.bar/path?url=http%3A%2F%2Flocalhost%3A8081&url2=http%3A%2F%2Flocalhost%3A8082', 'localhost', 8081);
		portMappingTestQuery('http://foo.bar/path?url=http%3A%2F%2Fmicrosoft.com%2Fbad&url2=http%3A%2F%2Flocalhost%3A8081', 'localhost', 8081);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/undoRedo/common/undoRedo.ts]---
Location: vscode-main/src/vs/platform/undoRedo/common/undoRedo.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IUndoRedoService = createDecorator<IUndoRedoService>('undoRedoService');

export const enum UndoRedoElementType {
	Resource,
	Workspace
}

export interface IResourceUndoRedoElement {
	readonly type: UndoRedoElementType.Resource;
	/**
	 * The resource impacted by this element.
	 */
	readonly resource: URI;
	/**
	 * A user presentable label. May be localized.
	 */
	readonly label: string;
	/**
	 * A code describing the operation. Will not be localized.
	 */
	readonly code: string;
	/**
	 * Show a message to the user confirming when trying to undo this element
	 */
	readonly confirmBeforeUndo?: boolean;
	undo(): Promise<void> | void;
	redo(): Promise<void> | void;
}

export interface IWorkspaceUndoRedoElement {
	readonly type: UndoRedoElementType.Workspace;
	/**
	 * The resources impacted by this element.
	 */
	readonly resources: readonly URI[];
	/**
	 * A user presentable label. May be localized.
	 */
	readonly label: string;
	/**
	 * A code describing the operation. Will not be localized.
	 */
	readonly code: string;
	/**
	 * Show a message to the user confirming when trying to undo this element
	 */
	readonly confirmBeforeUndo?: boolean;
	undo(): Promise<void> | void;
	redo(): Promise<void> | void;

	/**
	 * If implemented, indicates that this undo/redo element can be split into multiple per resource elements.
	 */
	split?(): IResourceUndoRedoElement[];

	/**
	 * If implemented, will be invoked before calling `undo()` or `redo()`.
	 * This is a good place to prepare everything such that the calls to `undo()` or `redo()` are synchronous.
	 * If a disposable is returned, it will be invoked to clean things up.
	 */
	prepareUndoRedo?(): Promise<IDisposable> | IDisposable | void;
}

export type IUndoRedoElement = IResourceUndoRedoElement | IWorkspaceUndoRedoElement;

export interface IPastFutureElements {
	past: IUndoRedoElement[];
	future: IUndoRedoElement[];
}

export interface UriComparisonKeyComputer {
	getComparisonKey(uri: URI): string;
}

export class ResourceEditStackSnapshot {
	constructor(
		public readonly resource: URI,
		public readonly elements: number[]
	) { }
}

export class UndoRedoGroup {
	private static _ID = 0;

	public readonly id: number;
	private order: number;

	constructor() {
		this.id = UndoRedoGroup._ID++;
		this.order = 1;
	}

	public nextOrder(): number {
		if (this.id === 0) {
			return 0;
		}
		return this.order++;
	}

	public static None = new UndoRedoGroup();
}

export class UndoRedoSource {
	private static _ID = 0;

	public readonly id: number;
	private order: number;

	constructor() {
		this.id = UndoRedoSource._ID++;
		this.order = 1;
	}

	public nextOrder(): number {
		if (this.id === 0) {
			return 0;
		}
		return this.order++;
	}

	public static None = new UndoRedoSource();
}

export interface IUndoRedoService {
	readonly _serviceBrand: undefined;

	/**
	 * Register an URI -> string hasher.
	 * This is useful for making multiple URIs share the same undo-redo stack.
	 */
	registerUriComparisonKeyComputer(scheme: string, uriComparisonKeyComputer: UriComparisonKeyComputer): IDisposable;

	/**
	 * Get the hash used internally for a certain URI.
	 * This uses any registered `UriComparisonKeyComputer`.
	 */
	getUriComparisonKey(resource: URI): string;

	/**
	 * Add a new element to the `undo` stack.
	 * This will destroy the `redo` stack.
	 */
	pushElement(element: IUndoRedoElement, group?: UndoRedoGroup, source?: UndoRedoSource): void;

	/**
	 * Get the last pushed element for a resource.
	 * If the last pushed element has been undone, returns null.
	 */
	getLastElement(resource: URI): IUndoRedoElement | null;

	/**
	 * Get all the elements associated with a resource.
	 * This includes the past and the future.
	 */
	getElements(resource: URI): IPastFutureElements;

	/**
	 * Validate or invalidate stack elements associated with a resource.
	 */
	setElementsValidFlag(resource: URI, isValid: boolean, filter: (element: IUndoRedoElement) => boolean): void;

	/**
	 * Remove elements that target `resource`.
	 */
	removeElements(resource: URI): void;

	/**
	 * Create a snapshot of the current elements on the undo-redo stack for a resource.
	 */
	createSnapshot(resource: URI): ResourceEditStackSnapshot;
	/**
	 * Attempt (as best as possible) to restore a certain snapshot previously created with `createSnapshot` for a resource.
	 */
	restoreSnapshot(snapshot: ResourceEditStackSnapshot): void;

	canUndo(resource: URI | UndoRedoSource): boolean;
	undo(resource: URI | UndoRedoSource): Promise<void> | void;

	canRedo(resource: URI | UndoRedoSource): boolean;
	redo(resource: URI | UndoRedoSource): Promise<void> | void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/undoRedo/common/undoRedoService.ts]---
Location: vscode-main/src/vs/platform/undoRedo/common/undoRedoService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onUnexpectedError } from '../../../base/common/errors.js';
import { Disposable, IDisposable, isDisposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import Severity from '../../../base/common/severity.js';
import { URI } from '../../../base/common/uri.js';
import * as nls from '../../../nls.js';
import { IDialogService } from '../../dialogs/common/dialogs.js';
import { InstantiationType, registerSingleton } from '../../instantiation/common/extensions.js';
import { INotificationService } from '../../notification/common/notification.js';
import { IPastFutureElements, IResourceUndoRedoElement, IUndoRedoElement, IUndoRedoService, IWorkspaceUndoRedoElement, ResourceEditStackSnapshot, UndoRedoElementType, UndoRedoGroup, UndoRedoSource, UriComparisonKeyComputer } from './undoRedo.js';

const DEBUG = false;

function getResourceLabel(resource: URI): string {
	return resource.scheme === Schemas.file ? resource.fsPath : resource.path;
}

let stackElementCounter = 0;

class ResourceStackElement {
	public readonly id = (++stackElementCounter);
	public readonly type = UndoRedoElementType.Resource;
	public readonly actual: IUndoRedoElement;
	public readonly label: string;
	public readonly confirmBeforeUndo: boolean;

	public readonly resourceLabel: string;
	public readonly strResource: string;
	public readonly resourceLabels: string[];
	public readonly strResources: string[];
	public readonly groupId: number;
	public readonly groupOrder: number;
	public readonly sourceId: number;
	public readonly sourceOrder: number;
	public isValid: boolean;

	constructor(actual: IUndoRedoElement, resourceLabel: string, strResource: string, groupId: number, groupOrder: number, sourceId: number, sourceOrder: number) {
		this.actual = actual;
		this.label = actual.label;
		this.confirmBeforeUndo = actual.confirmBeforeUndo || false;
		this.resourceLabel = resourceLabel;
		this.strResource = strResource;
		this.resourceLabels = [this.resourceLabel];
		this.strResources = [this.strResource];
		this.groupId = groupId;
		this.groupOrder = groupOrder;
		this.sourceId = sourceId;
		this.sourceOrder = sourceOrder;
		this.isValid = true;
	}

	public setValid(isValid: boolean): void {
		this.isValid = isValid;
	}

	public toString(): string {
		return `[id:${this.id}] [group:${this.groupId}] [${this.isValid ? '  VALID' : 'INVALID'}] ${this.actual.constructor.name} - ${this.actual}`;
	}
}

const enum RemovedResourceReason {
	ExternalRemoval = 0,
	NoParallelUniverses = 1
}

class ResourceReasonPair {
	constructor(
		public readonly resourceLabel: string,
		public readonly reason: RemovedResourceReason
	) { }
}

class RemovedResources {
	private readonly elements = new Map<string, ResourceReasonPair>();

	public createMessage(): string {
		const externalRemoval: string[] = [];
		const noParallelUniverses: string[] = [];
		for (const [, element] of this.elements) {
			const dest = (
				element.reason === RemovedResourceReason.ExternalRemoval
					? externalRemoval
					: noParallelUniverses
			);
			dest.push(element.resourceLabel);
		}

		const messages: string[] = [];
		if (externalRemoval.length > 0) {
			messages.push(
				nls.localize(
					{ key: 'externalRemoval', comment: ['{0} is a list of filenames'] },
					"The following files have been closed and modified on disk: {0}.", externalRemoval.join(', ')
				)
			);
		}
		if (noParallelUniverses.length > 0) {
			messages.push(
				nls.localize(
					{ key: 'noParallelUniverses', comment: ['{0} is a list of filenames'] },
					"The following files have been modified in an incompatible way: {0}.", noParallelUniverses.join(', ')
				));
		}
		return messages.join('\n');
	}

	public get size(): number {
		return this.elements.size;
	}

	public has(strResource: string): boolean {
		return this.elements.has(strResource);
	}

	public set(strResource: string, value: ResourceReasonPair): void {
		this.elements.set(strResource, value);
	}

	public delete(strResource: string): boolean {
		return this.elements.delete(strResource);
	}
}

class WorkspaceStackElement {
	public readonly id = (++stackElementCounter);
	public readonly type = UndoRedoElementType.Workspace;
	public readonly actual: IWorkspaceUndoRedoElement;
	public readonly label: string;
	public readonly confirmBeforeUndo: boolean;

	public readonly resourceLabels: string[];
	public readonly strResources: string[];
	public readonly groupId: number;
	public readonly groupOrder: number;
	public readonly sourceId: number;
	public readonly sourceOrder: number;
	public removedResources: RemovedResources | null;
	public invalidatedResources: RemovedResources | null;

	constructor(actual: IWorkspaceUndoRedoElement, resourceLabels: string[], strResources: string[], groupId: number, groupOrder: number, sourceId: number, sourceOrder: number) {
		this.actual = actual;
		this.label = actual.label;
		this.confirmBeforeUndo = actual.confirmBeforeUndo || false;
		this.resourceLabels = resourceLabels;
		this.strResources = strResources;
		this.groupId = groupId;
		this.groupOrder = groupOrder;
		this.sourceId = sourceId;
		this.sourceOrder = sourceOrder;
		this.removedResources = null;
		this.invalidatedResources = null;
	}

	public canSplit(): this is WorkspaceStackElement & { actual: { split(): IResourceUndoRedoElement[] } } {
		return (typeof this.actual.split === 'function');
	}

	public removeResource(resourceLabel: string, strResource: string, reason: RemovedResourceReason): void {
		if (!this.removedResources) {
			this.removedResources = new RemovedResources();
		}
		if (!this.removedResources.has(strResource)) {
			this.removedResources.set(strResource, new ResourceReasonPair(resourceLabel, reason));
		}
	}

	public setValid(resourceLabel: string, strResource: string, isValid: boolean): void {
		if (isValid) {
			if (this.invalidatedResources) {
				this.invalidatedResources.delete(strResource);
				if (this.invalidatedResources.size === 0) {
					this.invalidatedResources = null;
				}
			}
		} else {
			if (!this.invalidatedResources) {
				this.invalidatedResources = new RemovedResources();
			}
			if (!this.invalidatedResources.has(strResource)) {
				this.invalidatedResources.set(strResource, new ResourceReasonPair(resourceLabel, RemovedResourceReason.ExternalRemoval));
			}
		}
	}

	public toString(): string {
		return `[id:${this.id}] [group:${this.groupId}] [${this.invalidatedResources ? 'INVALID' : '  VALID'}] ${this.actual.constructor.name} - ${this.actual}`;
	}
}

type StackElement = ResourceStackElement | WorkspaceStackElement;

class ResourceEditStack {
	public readonly resourceLabel: string;
	private readonly strResource: string;
	private _past: StackElement[];
	private _future: StackElement[];
	public locked: boolean;
	public versionId: number;

	constructor(resourceLabel: string, strResource: string) {
		this.resourceLabel = resourceLabel;
		this.strResource = strResource;
		this._past = [];
		this._future = [];
		this.locked = false;
		this.versionId = 1;
	}

	public dispose(): void {
		for (const element of this._past) {
			if (element.type === UndoRedoElementType.Workspace) {
				element.removeResource(this.resourceLabel, this.strResource, RemovedResourceReason.ExternalRemoval);
			}
		}
		for (const element of this._future) {
			if (element.type === UndoRedoElementType.Workspace) {
				element.removeResource(this.resourceLabel, this.strResource, RemovedResourceReason.ExternalRemoval);
			}
		}
		this.versionId++;
	}

	public toString(): string {
		const result: string[] = [];
		result.push(`* ${this.strResource}:`);
		for (let i = 0; i < this._past.length; i++) {
			result.push(`   * [UNDO] ${this._past[i]}`);
		}
		for (let i = this._future.length - 1; i >= 0; i--) {
			result.push(`   * [REDO] ${this._future[i]}`);
		}
		return result.join('\n');
	}

	public flushAllElements(): void {
		this._past = [];
		this._future = [];
		this.versionId++;
	}

	public setElementsIsValid(isValid: boolean): void {
		for (const element of this._past) {
			if (element.type === UndoRedoElementType.Workspace) {
				element.setValid(this.resourceLabel, this.strResource, isValid);
			} else {
				element.setValid(isValid);
			}
		}
		for (const element of this._future) {
			if (element.type === UndoRedoElementType.Workspace) {
				element.setValid(this.resourceLabel, this.strResource, isValid);
			} else {
				element.setValid(isValid);
			}
		}
	}

	private _setElementValidFlag(element: StackElement, isValid: boolean): void {
		if (element.type === UndoRedoElementType.Workspace) {
			element.setValid(this.resourceLabel, this.strResource, isValid);
		} else {
			element.setValid(isValid);
		}
	}

	public setElementsValidFlag(isValid: boolean, filter: (element: IUndoRedoElement) => boolean): void {
		for (const element of this._past) {
			if (filter(element.actual)) {
				this._setElementValidFlag(element, isValid);
			}
		}
		for (const element of this._future) {
			if (filter(element.actual)) {
				this._setElementValidFlag(element, isValid);
			}
		}
	}

	public pushElement(element: StackElement): void {
		// remove the future
		for (const futureElement of this._future) {
			if (futureElement.type === UndoRedoElementType.Workspace) {
				futureElement.removeResource(this.resourceLabel, this.strResource, RemovedResourceReason.NoParallelUniverses);
			}
		}
		this._future = [];
		this._past.push(element);
		this.versionId++;
	}

	public createSnapshot(resource: URI): ResourceEditStackSnapshot {
		const elements: number[] = [];

		for (let i = 0, len = this._past.length; i < len; i++) {
			elements.push(this._past[i].id);
		}
		for (let i = this._future.length - 1; i >= 0; i--) {
			elements.push(this._future[i].id);
		}

		return new ResourceEditStackSnapshot(resource, elements);
	}

	public restoreSnapshot(snapshot: ResourceEditStackSnapshot): void {
		const snapshotLength = snapshot.elements.length;
		let isOK = true;
		let snapshotIndex = 0;
		let removePastAfter = -1;
		for (let i = 0, len = this._past.length; i < len; i++, snapshotIndex++) {
			const element = this._past[i];
			if (isOK && (snapshotIndex >= snapshotLength || element.id !== snapshot.elements[snapshotIndex])) {
				isOK = false;
				removePastAfter = i;
			}
			if (!isOK && element.type === UndoRedoElementType.Workspace) {
				element.removeResource(this.resourceLabel, this.strResource, RemovedResourceReason.ExternalRemoval);
			}
		}
		let removeFutureBefore = -1;
		for (let i = this._future.length - 1; i >= 0; i--, snapshotIndex++) {
			const element = this._future[i];
			if (isOK && (snapshotIndex >= snapshotLength || element.id !== snapshot.elements[snapshotIndex])) {
				isOK = false;
				removeFutureBefore = i;
			}
			if (!isOK && element.type === UndoRedoElementType.Workspace) {
				element.removeResource(this.resourceLabel, this.strResource, RemovedResourceReason.ExternalRemoval);
			}
		}
		if (removePastAfter !== -1) {
			this._past = this._past.slice(0, removePastAfter);
		}
		if (removeFutureBefore !== -1) {
			this._future = this._future.slice(removeFutureBefore + 1);
		}
		this.versionId++;
	}

	public getElements(): IPastFutureElements {
		const past: IUndoRedoElement[] = [];
		const future: IUndoRedoElement[] = [];

		for (const element of this._past) {
			past.push(element.actual);
		}
		for (const element of this._future) {
			future.push(element.actual);
		}

		return { past, future };
	}

	public getClosestPastElement(): StackElement | null {
		if (this._past.length === 0) {
			return null;
		}
		return this._past[this._past.length - 1];
	}

	public getSecondClosestPastElement(): StackElement | null {
		if (this._past.length < 2) {
			return null;
		}
		return this._past[this._past.length - 2];
	}

	public getClosestFutureElement(): StackElement | null {
		if (this._future.length === 0) {
			return null;
		}
		return this._future[this._future.length - 1];
	}

	public hasPastElements(): boolean {
		return (this._past.length > 0);
	}

	public hasFutureElements(): boolean {
		return (this._future.length > 0);
	}

	public splitPastWorkspaceElement(toRemove: WorkspaceStackElement, individualMap: Map<string, ResourceStackElement>): void {
		for (let j = this._past.length - 1; j >= 0; j--) {
			if (this._past[j] === toRemove) {
				if (individualMap.has(this.strResource)) {
					// gets replaced
					this._past[j] = individualMap.get(this.strResource)!;
				} else {
					// gets deleted
					this._past.splice(j, 1);
				}
				break;
			}
		}
		this.versionId++;
	}

	public splitFutureWorkspaceElement(toRemove: WorkspaceStackElement, individualMap: Map<string, ResourceStackElement>): void {
		for (let j = this._future.length - 1; j >= 0; j--) {
			if (this._future[j] === toRemove) {
				if (individualMap.has(this.strResource)) {
					// gets replaced
					this._future[j] = individualMap.get(this.strResource)!;
				} else {
					// gets deleted
					this._future.splice(j, 1);
				}
				break;
			}
		}
		this.versionId++;
	}

	public moveBackward(element: StackElement): void {
		this._past.pop();
		this._future.push(element);
		this.versionId++;
	}

	public moveForward(element: StackElement): void {
		this._future.pop();
		this._past.push(element);
		this.versionId++;
	}
}

class EditStackSnapshot {

	public readonly editStacks: ResourceEditStack[];
	private readonly _versionIds: number[];

	constructor(editStacks: ResourceEditStack[]) {
		this.editStacks = editStacks;
		this._versionIds = [];
		for (let i = 0, len = this.editStacks.length; i < len; i++) {
			this._versionIds[i] = this.editStacks[i].versionId;
		}
	}

	public isValid(): boolean {
		for (let i = 0, len = this.editStacks.length; i < len; i++) {
			if (this._versionIds[i] !== this.editStacks[i].versionId) {
				return false;
			}
		}
		return true;
	}
}

const missingEditStack = new ResourceEditStack('', '');
missingEditStack.locked = true;

export class UndoRedoService implements IUndoRedoService {
	declare readonly _serviceBrand: undefined;

	private readonly _editStacks: Map<string, ResourceEditStack>;
	private readonly _uriComparisonKeyComputers: [string, UriComparisonKeyComputer][];

	constructor(
		@IDialogService private readonly _dialogService: IDialogService,
		@INotificationService private readonly _notificationService: INotificationService,
	) {
		this._editStacks = new Map<string, ResourceEditStack>();
		this._uriComparisonKeyComputers = [];
	}

	public registerUriComparisonKeyComputer(scheme: string, uriComparisonKeyComputer: UriComparisonKeyComputer): IDisposable {
		this._uriComparisonKeyComputers.push([scheme, uriComparisonKeyComputer]);
		return {
			dispose: () => {
				for (let i = 0, len = this._uriComparisonKeyComputers.length; i < len; i++) {
					if (this._uriComparisonKeyComputers[i][1] === uriComparisonKeyComputer) {
						this._uriComparisonKeyComputers.splice(i, 1);
						return;
					}
				}
			}
		};
	}

	public getUriComparisonKey(resource: URI): string {
		for (const uriComparisonKeyComputer of this._uriComparisonKeyComputers) {
			if (uriComparisonKeyComputer[0] === resource.scheme) {
				return uriComparisonKeyComputer[1].getComparisonKey(resource);
			}
		}
		return resource.toString();
	}

	private _print(label: string): void {
		console.log(`------------------------------------`);
		console.log(`AFTER ${label}: `);
		const str: string[] = [];
		for (const element of this._editStacks) {
			str.push(element[1].toString());
		}
		console.log(str.join('\n'));
	}

	public pushElement(element: IUndoRedoElement, group: UndoRedoGroup = UndoRedoGroup.None, source: UndoRedoSource = UndoRedoSource.None): void {
		if (element.type === UndoRedoElementType.Resource) {
			const resourceLabel = getResourceLabel(element.resource);
			const strResource = this.getUriComparisonKey(element.resource);
			this._pushElement(new ResourceStackElement(element, resourceLabel, strResource, group.id, group.nextOrder(), source.id, source.nextOrder()));
		} else {
			const seen = new Set<string>();
			const resourceLabels: string[] = [];
			const strResources: string[] = [];
			for (const resource of element.resources) {
				const resourceLabel = getResourceLabel(resource);
				const strResource = this.getUriComparisonKey(resource);

				if (seen.has(strResource)) {
					continue;
				}
				seen.add(strResource);
				resourceLabels.push(resourceLabel);
				strResources.push(strResource);
			}

			if (resourceLabels.length === 1) {
				this._pushElement(new ResourceStackElement(element, resourceLabels[0], strResources[0], group.id, group.nextOrder(), source.id, source.nextOrder()));
			} else {
				this._pushElement(new WorkspaceStackElement(element, resourceLabels, strResources, group.id, group.nextOrder(), source.id, source.nextOrder()));
			}
		}
		if (DEBUG) {
			this._print('pushElement');
		}
	}

	private _pushElement(element: StackElement): void {
		for (let i = 0, len = element.strResources.length; i < len; i++) {
			const resourceLabel = element.resourceLabels[i];
			const strResource = element.strResources[i];

			let editStack: ResourceEditStack;
			if (this._editStacks.has(strResource)) {
				editStack = this._editStacks.get(strResource)!;
			} else {
				editStack = new ResourceEditStack(resourceLabel, strResource);
				this._editStacks.set(strResource, editStack);
			}

			editStack.pushElement(element);
		}
	}

	public getLastElement(resource: URI): IUndoRedoElement | null {
		const strResource = this.getUriComparisonKey(resource);
		if (this._editStacks.has(strResource)) {
			const editStack = this._editStacks.get(strResource)!;
			if (editStack.hasFutureElements()) {
				return null;
			}
			const closestPastElement = editStack.getClosestPastElement();
			return closestPastElement ? closestPastElement.actual : null;
		}
		return null;
	}

	private _splitPastWorkspaceElement(toRemove: WorkspaceStackElement & { actual: { split(): IResourceUndoRedoElement[] } }, ignoreResources: RemovedResources | null): void {
		const individualArr = toRemove.actual.split();
		const individualMap = new Map<string, ResourceStackElement>();
		for (const _element of individualArr) {
			const resourceLabel = getResourceLabel(_element.resource);
			const strResource = this.getUriComparisonKey(_element.resource);
			const element = new ResourceStackElement(_element, resourceLabel, strResource, 0, 0, 0, 0);
			individualMap.set(element.strResource, element);
		}

		for (const strResource of toRemove.strResources) {
			if (ignoreResources && ignoreResources.has(strResource)) {
				continue;
			}
			const editStack = this._editStacks.get(strResource)!;
			editStack.splitPastWorkspaceElement(toRemove, individualMap);
		}
	}

	private _splitFutureWorkspaceElement(toRemove: WorkspaceStackElement & { actual: { split(): IResourceUndoRedoElement[] } }, ignoreResources: RemovedResources | null): void {
		const individualArr = toRemove.actual.split();
		const individualMap = new Map<string, ResourceStackElement>();
		for (const _element of individualArr) {
			const resourceLabel = getResourceLabel(_element.resource);
			const strResource = this.getUriComparisonKey(_element.resource);
			const element = new ResourceStackElement(_element, resourceLabel, strResource, 0, 0, 0, 0);
			individualMap.set(element.strResource, element);
		}

		for (const strResource of toRemove.strResources) {
			if (ignoreResources && ignoreResources.has(strResource)) {
				continue;
			}
			const editStack = this._editStacks.get(strResource)!;
			editStack.splitFutureWorkspaceElement(toRemove, individualMap);
		}
	}

	public removeElements(resource: URI | string): void {
		const strResource = typeof resource === 'string' ? resource : this.getUriComparisonKey(resource);
		if (this._editStacks.has(strResource)) {
			const editStack = this._editStacks.get(strResource)!;
			editStack.dispose();
			this._editStacks.delete(strResource);
		}
		if (DEBUG) {
			this._print('removeElements');
		}
	}

	public setElementsValidFlag(resource: URI, isValid: boolean, filter: (element: IUndoRedoElement) => boolean): void {
		const strResource = this.getUriComparisonKey(resource);
		if (this._editStacks.has(strResource)) {
			const editStack = this._editStacks.get(strResource)!;
			editStack.setElementsValidFlag(isValid, filter);
		}
		if (DEBUG) {
			this._print('setElementsValidFlag');
		}
	}

	public hasElements(resource: URI): boolean {
		const strResource = this.getUriComparisonKey(resource);
		if (this._editStacks.has(strResource)) {
			const editStack = this._editStacks.get(strResource)!;
			return (editStack.hasPastElements() || editStack.hasFutureElements());
		}
		return false;
	}

	public createSnapshot(resource: URI): ResourceEditStackSnapshot {
		const strResource = this.getUriComparisonKey(resource);
		if (this._editStacks.has(strResource)) {
			const editStack = this._editStacks.get(strResource)!;
			return editStack.createSnapshot(resource);
		}
		return new ResourceEditStackSnapshot(resource, []);
	}

	public restoreSnapshot(snapshot: ResourceEditStackSnapshot): void {
		const strResource = this.getUriComparisonKey(snapshot.resource);
		if (this._editStacks.has(strResource)) {
			const editStack = this._editStacks.get(strResource)!;
			editStack.restoreSnapshot(snapshot);

			if (!editStack.hasPastElements() && !editStack.hasFutureElements()) {
				// the edit stack is now empty, just remove it entirely
				editStack.dispose();
				this._editStacks.delete(strResource);
			}
		}
		if (DEBUG) {
			this._print('restoreSnapshot');
		}
	}

	public getElements(resource: URI): IPastFutureElements {
		const strResource = this.getUriComparisonKey(resource);
		if (this._editStacks.has(strResource)) {
			const editStack = this._editStacks.get(strResource)!;
			return editStack.getElements();
		}
		return { past: [], future: [] };
	}

	private _findClosestUndoElementWithSource(sourceId: number): [StackElement | null, string | null] {
		if (!sourceId) {
			return [null, null];
		}

		// find an element with the sourceId and with the highest sourceOrder ready to be undone
		let matchedElement: StackElement | null = null;
		let matchedStrResource: string | null = null;

		for (const [strResource, editStack] of this._editStacks) {
			const candidate = editStack.getClosestPastElement();
			if (!candidate) {
				continue;
			}
			if (candidate.sourceId === sourceId) {
				if (!matchedElement || candidate.sourceOrder > matchedElement.sourceOrder) {
					matchedElement = candidate;
					matchedStrResource = strResource;
				}
			}
		}

		return [matchedElement, matchedStrResource];
	}

	public canUndo(resourceOrSource: URI | UndoRedoSource): boolean {
		if (resourceOrSource instanceof UndoRedoSource) {
			const [, matchedStrResource] = this._findClosestUndoElementWithSource(resourceOrSource.id);
			return matchedStrResource ? true : false;
		}
		const strResource = this.getUriComparisonKey(resourceOrSource);
		if (this._editStacks.has(strResource)) {
			const editStack = this._editStacks.get(strResource)!;
			return editStack.hasPastElements();
		}
		return false;
	}

	private _onError(err: Error, element: StackElement): void {
		onUnexpectedError(err);
		// An error occurred while undoing or redoing => drop the undo/redo stack for all affected resources
		for (const strResource of element.strResources) {
			this.removeElements(strResource);
		}
		this._notificationService.error(err);
	}

	private _acquireLocks(editStackSnapshot: EditStackSnapshot): () => void {
		// first, check if all locks can be acquired
		for (const editStack of editStackSnapshot.editStacks) {
			if (editStack.locked) {
				throw new Error('Cannot acquire edit stack lock');
			}
		}

		// can acquire all locks
		for (const editStack of editStackSnapshot.editStacks) {
			editStack.locked = true;
		}

		return () => {
			// release all locks
			for (const editStack of editStackSnapshot.editStacks) {
				editStack.locked = false;
			}
		};
	}

	private _safeInvokeWithLocks(element: StackElement, invoke: () => Promise<void> | void, editStackSnapshot: EditStackSnapshot, cleanup: IDisposable, continuation: () => Promise<void> | void): Promise<void> | void {
		const releaseLocks = this._acquireLocks(editStackSnapshot);

		let result: Promise<void> | void;
		try {
			result = invoke();
		} catch (err) {
			releaseLocks();
			cleanup.dispose();
			return this._onError(err, element);
		}

		if (result) {
			// result is Promise<void>
			return result.then(
				() => {
					releaseLocks();
					cleanup.dispose();
					return continuation();
				},
				(err) => {
					releaseLocks();
					cleanup.dispose();
					return this._onError(err, element);
				}
			);
		} else {
			// result is void
			releaseLocks();
			cleanup.dispose();
			return continuation();
		}
	}

	private async _invokeWorkspacePrepare(element: WorkspaceStackElement): Promise<IDisposable> {
		if (typeof element.actual.prepareUndoRedo === 'undefined') {
			return Disposable.None;
		}
		const result = element.actual.prepareUndoRedo();
		if (typeof result === 'undefined') {
			return Disposable.None;
		}
		return result;
	}

	private _invokeResourcePrepare(element: ResourceStackElement, callback: (disposable: IDisposable) => Promise<void> | void): void | Promise<void> {
		if (element.actual.type !== UndoRedoElementType.Workspace || typeof element.actual.prepareUndoRedo === 'undefined') {
			// no preparation needed
			return callback(Disposable.None);
		}

		const r = element.actual.prepareUndoRedo();
		if (!r) {
			// nothing to clean up
			return callback(Disposable.None);
		}

		if (isDisposable(r)) {
			return callback(r);
		}

		return r.then((disposable) => {
			return callback(disposable);
		});
	}

	private _getAffectedEditStacks(element: WorkspaceStackElement): EditStackSnapshot {
		const affectedEditStacks: ResourceEditStack[] = [];
		for (const strResource of element.strResources) {
			affectedEditStacks.push(this._editStacks.get(strResource) || missingEditStack);
		}
		return new EditStackSnapshot(affectedEditStacks);
	}

	private _tryToSplitAndUndo(strResource: string, element: WorkspaceStackElement, ignoreResources: RemovedResources | null, message: string): WorkspaceVerificationError {
		if (element.canSplit()) {
			this._splitPastWorkspaceElement(element, ignoreResources);
			this._notificationService.warn(message);
			return new WorkspaceVerificationError(this._undo(strResource, 0, true));
		} else {
			// Cannot safely split this workspace element => flush all undo/redo stacks
			for (const strResource of element.strResources) {
				this.removeElements(strResource);
			}
			this._notificationService.warn(message);
			return new WorkspaceVerificationError();
		}
	}

	private _checkWorkspaceUndo(strResource: string, element: WorkspaceStackElement, editStackSnapshot: EditStackSnapshot, checkInvalidatedResources: boolean): WorkspaceVerificationError | null {
		if (element.removedResources) {
			return this._tryToSplitAndUndo(
				strResource,
				element,
				element.removedResources,
				nls.localize(
					{ key: 'cannotWorkspaceUndo', comment: ['{0} is a label for an operation. {1} is another message.'] },
					"Could not undo '{0}' across all files. {1}", element.label, element.removedResources.createMessage()
				)
			);
		}
		if (checkInvalidatedResources && element.invalidatedResources) {
			return this._tryToSplitAndUndo(
				strResource,
				element,
				element.invalidatedResources,
				nls.localize(
					{ key: 'cannotWorkspaceUndo', comment: ['{0} is a label for an operation. {1} is another message.'] },
					"Could not undo '{0}' across all files. {1}", element.label, element.invalidatedResources.createMessage()
				)
			);
		}

		// this must be the last past element in all the impacted resources!
		const cannotUndoDueToResources: string[] = [];
		for (const editStack of editStackSnapshot.editStacks) {
			if (editStack.getClosestPastElement() !== element) {
				cannotUndoDueToResources.push(editStack.resourceLabel);
			}
		}
		if (cannotUndoDueToResources.length > 0) {
			return this._tryToSplitAndUndo(
				strResource,
				element,
				null,
				nls.localize(
					{ key: 'cannotWorkspaceUndoDueToChanges', comment: ['{0} is a label for an operation. {1} is a list of filenames.'] },
					"Could not undo '{0}' across all files because changes were made to {1}", element.label, cannotUndoDueToResources.join(', ')
				)
			);
		}

		const cannotLockDueToResources: string[] = [];
		for (const editStack of editStackSnapshot.editStacks) {
			if (editStack.locked) {
				cannotLockDueToResources.push(editStack.resourceLabel);
			}
		}
		if (cannotLockDueToResources.length > 0) {
			return this._tryToSplitAndUndo(
				strResource,
				element,
				null,
				nls.localize(
					{ key: 'cannotWorkspaceUndoDueToInProgressUndoRedo', comment: ['{0} is a label for an operation. {1} is a list of filenames.'] },
					"Could not undo '{0}' across all files because there is already an undo or redo operation running on {1}", element.label, cannotLockDueToResources.join(', ')
				)
			);
		}

		// check if new stack elements were added in the meantime...
		if (!editStackSnapshot.isValid()) {
			return this._tryToSplitAndUndo(
				strResource,
				element,
				null,
				nls.localize(
					{ key: 'cannotWorkspaceUndoDueToInMeantimeUndoRedo', comment: ['{0} is a label for an operation. {1} is a list of filenames.'] },
					"Could not undo '{0}' across all files because an undo or redo operation occurred in the meantime", element.label
				)
			);
		}

		return null;
	}

	private _workspaceUndo(strResource: string, element: WorkspaceStackElement, undoConfirmed: boolean): Promise<void> | void {
		const affectedEditStacks = this._getAffectedEditStacks(element);
		const verificationError = this._checkWorkspaceUndo(strResource, element, affectedEditStacks, /*invalidated resources will be checked after the prepare call*/false);
		if (verificationError) {
			return verificationError.returnValue;
		}
		return this._confirmAndExecuteWorkspaceUndo(strResource, element, affectedEditStacks, undoConfirmed);
	}

	private _isPartOfUndoGroup(element: WorkspaceStackElement): boolean {
		if (!element.groupId) {
			return false;
		}
		// check that there is at least another element with the same groupId ready to be undone
		for (const [, editStack] of this._editStacks) {
			const pastElement = editStack.getClosestPastElement();
			if (!pastElement) {
				continue;
			}
			if (pastElement === element) {
				const secondPastElement = editStack.getSecondClosestPastElement();
				if (secondPastElement && secondPastElement.groupId === element.groupId) {
					// there is another element with the same group id in the same stack!
					return true;
				}
			}
			if (pastElement.groupId === element.groupId) {
				// there is another element with the same group id in another stack!
				return true;
			}
		}
		return false;
	}

	private async _confirmAndExecuteWorkspaceUndo(strResource: string, element: WorkspaceStackElement, editStackSnapshot: EditStackSnapshot, undoConfirmed: boolean): Promise<void> {

		if (element.canSplit() && !this._isPartOfUndoGroup(element)) {
			// this element can be split

			enum UndoChoice {
				All = 0,
				This = 1,
				Cancel = 2
			}

			const { result } = await this._dialogService.prompt<UndoChoice>({
				type: Severity.Info,
				message: nls.localize('confirmWorkspace', "Would you like to undo '{0}' across all files?", element.label),
				buttons: [
					{
						label: nls.localize({ key: 'ok', comment: ['{0} denotes a number that is > 1, && denotes a mnemonic'] }, "&&Undo in {0} Files", editStackSnapshot.editStacks.length),
						run: () => UndoChoice.All
					},
					{
						label: nls.localize({ key: 'nok', comment: ['&& denotes a mnemonic'] }, "Undo this &&File"),
						run: () => UndoChoice.This
					}
				],
				cancelButton: {
					run: () => UndoChoice.Cancel
				}
			});

			if (result === UndoChoice.Cancel) {
				// choice: cancel
				return;
			}

			if (result === UndoChoice.This) {
				// choice: undo this file
				this._splitPastWorkspaceElement(element, null);
				return this._undo(strResource, 0, true);
			}

			// choice: undo in all files

			// At this point, it is possible that the element has been made invalid in the meantime (due to the confirmation await)
			const verificationError1 = this._checkWorkspaceUndo(strResource, element, editStackSnapshot, /*invalidated resources will be checked after the prepare call*/false);
			if (verificationError1) {
				return verificationError1.returnValue;
			}

			undoConfirmed = true;
		}

		// prepare
		let cleanup: IDisposable;
		try {
			cleanup = await this._invokeWorkspacePrepare(element);
		} catch (err) {
			return this._onError(err, element);
		}

		// At this point, it is possible that the element has been made invalid in the meantime (due to the prepare await)
		const verificationError2 = this._checkWorkspaceUndo(strResource, element, editStackSnapshot, /*now also check that there are no more invalidated resources*/true);
		if (verificationError2) {
			cleanup.dispose();
			return verificationError2.returnValue;
		}

		for (const editStack of editStackSnapshot.editStacks) {
			editStack.moveBackward(element);
		}
		return this._safeInvokeWithLocks(element, () => element.actual.undo(), editStackSnapshot, cleanup, () => this._continueUndoInGroup(element.groupId, undoConfirmed));
	}

	private _resourceUndo(editStack: ResourceEditStack, element: ResourceStackElement, undoConfirmed: boolean): Promise<void> | void {
		if (!element.isValid) {
			// invalid element => immediately flush edit stack!
			editStack.flushAllElements();
			return;
		}
		if (editStack.locked) {
			const message = nls.localize(
				{ key: 'cannotResourceUndoDueToInProgressUndoRedo', comment: ['{0} is a label for an operation.'] },
				"Could not undo '{0}' because there is already an undo or redo operation running.", element.label
			);
			this._notificationService.warn(message);
			return;
		}
		return this._invokeResourcePrepare(element, (cleanup) => {
			editStack.moveBackward(element);
			return this._safeInvokeWithLocks(element, () => element.actual.undo(), new EditStackSnapshot([editStack]), cleanup, () => this._continueUndoInGroup(element.groupId, undoConfirmed));
		});
	}

	private _findClosestUndoElementInGroup(groupId: number): [StackElement | null, string | null] {
		if (!groupId) {
			return [null, null];
		}

		// find another element with the same groupId and with the highest groupOrder ready to be undone
		let matchedElement: StackElement | null = null;
		let matchedStrResource: string | null = null;

		for (const [strResource, editStack] of this._editStacks) {
			const candidate = editStack.getClosestPastElement();
			if (!candidate) {
				continue;
			}
			if (candidate.groupId === groupId) {
				if (!matchedElement || candidate.groupOrder > matchedElement.groupOrder) {
					matchedElement = candidate;
					matchedStrResource = strResource;
				}
			}
		}

		return [matchedElement, matchedStrResource];
	}

	private _continueUndoInGroup(groupId: number, undoConfirmed: boolean): Promise<void> | void {
		if (!groupId) {
			return;
		}

		const [, matchedStrResource] = this._findClosestUndoElementInGroup(groupId);
		if (matchedStrResource) {
			return this._undo(matchedStrResource, 0, undoConfirmed);
		}
	}

	public undo(resourceOrSource: URI | UndoRedoSource): Promise<void> | void {
		if (resourceOrSource instanceof UndoRedoSource) {
			const [, matchedStrResource] = this._findClosestUndoElementWithSource(resourceOrSource.id);
			return matchedStrResource ? this._undo(matchedStrResource, resourceOrSource.id, false) : undefined;
		}
		if (typeof resourceOrSource === 'string') {
			return this._undo(resourceOrSource, 0, false);
		}
		return this._undo(this.getUriComparisonKey(resourceOrSource), 0, false);
	}

	private _undo(strResource: string, sourceId: number = 0, undoConfirmed: boolean): Promise<void> | void {
		if (!this._editStacks.has(strResource)) {
			return;
		}

		const editStack = this._editStacks.get(strResource)!;
		const element = editStack.getClosestPastElement();
		if (!element) {
			return;
		}

		if (element.groupId) {
			// this element is a part of a group, we need to make sure undoing in a group is in order
			const [matchedElement, matchedStrResource] = this._findClosestUndoElementInGroup(element.groupId);
			if (element !== matchedElement && matchedStrResource) {
				// there is an element in the same group that should be undone before this one
				return this._undo(matchedStrResource, sourceId, undoConfirmed);
			}
		}

		const shouldPromptForConfirmation = (element.sourceId !== sourceId || element.confirmBeforeUndo);
		if (shouldPromptForConfirmation && !undoConfirmed) {
			// Hit a different source or the element asks for prompt before undo, prompt for confirmation
			return this._confirmAndContinueUndo(strResource, sourceId, element);
		}

		try {
			if (element.type === UndoRedoElementType.Workspace) {
				return this._workspaceUndo(strResource, element, undoConfirmed);
			} else {
				return this._resourceUndo(editStack, element, undoConfirmed);
			}
		} finally {
			if (DEBUG) {
				this._print('undo');
			}
		}
	}

	private async _confirmAndContinueUndo(strResource: string, sourceId: number, element: StackElement): Promise<void> {
		const result = await this._dialogService.confirm({
			message: nls.localize('confirmDifferentSource', "Would you like to undo '{0}'?", element.label),
			primaryButton: nls.localize({ key: 'confirmDifferentSource.yes', comment: ['&& denotes a mnemonic'] }, "&&Yes"),
			cancelButton: nls.localize('confirmDifferentSource.no', "No")
		});

		if (!result.confirmed) {
			return;
		}

		return this._undo(strResource, sourceId, true);
	}

	private _findClosestRedoElementWithSource(sourceId: number): [StackElement | null, string | null] {
		if (!sourceId) {
			return [null, null];
		}

		// find an element with sourceId and with the lowest sourceOrder ready to be redone
		let matchedElement: StackElement | null = null;
		let matchedStrResource: string | null = null;

		for (const [strResource, editStack] of this._editStacks) {
			const candidate = editStack.getClosestFutureElement();
			if (!candidate) {
				continue;
			}
			if (candidate.sourceId === sourceId) {
				if (!matchedElement || candidate.sourceOrder < matchedElement.sourceOrder) {
					matchedElement = candidate;
					matchedStrResource = strResource;
				}
			}
		}

		return [matchedElement, matchedStrResource];
	}

	public canRedo(resourceOrSource: URI | UndoRedoSource): boolean {
		if (resourceOrSource instanceof UndoRedoSource) {
			const [, matchedStrResource] = this._findClosestRedoElementWithSource(resourceOrSource.id);
			return matchedStrResource ? true : false;
		}
		const strResource = this.getUriComparisonKey(resourceOrSource);
		if (this._editStacks.has(strResource)) {
			const editStack = this._editStacks.get(strResource)!;
			return editStack.hasFutureElements();
		}
		return false;
	}

	private _tryToSplitAndRedo(strResource: string, element: WorkspaceStackElement, ignoreResources: RemovedResources | null, message: string): WorkspaceVerificationError {
		if (element.canSplit()) {
			this._splitFutureWorkspaceElement(element, ignoreResources);
			this._notificationService.warn(message);
			return new WorkspaceVerificationError(this._redo(strResource));
		} else {
			// Cannot safely split this workspace element => flush all undo/redo stacks
			for (const strResource of element.strResources) {
				this.removeElements(strResource);
			}
			this._notificationService.warn(message);
			return new WorkspaceVerificationError();
		}
	}

	private _checkWorkspaceRedo(strResource: string, element: WorkspaceStackElement, editStackSnapshot: EditStackSnapshot, checkInvalidatedResources: boolean): WorkspaceVerificationError | null {
		if (element.removedResources) {
			return this._tryToSplitAndRedo(
				strResource,
				element,
				element.removedResources,
				nls.localize(
					{ key: 'cannotWorkspaceRedo', comment: ['{0} is a label for an operation. {1} is another message.'] },
					"Could not redo '{0}' across all files. {1}", element.label, element.removedResources.createMessage()
				)
			);
		}
		if (checkInvalidatedResources && element.invalidatedResources) {
			return this._tryToSplitAndRedo(
				strResource,
				element,
				element.invalidatedResources,
				nls.localize(
					{ key: 'cannotWorkspaceRedo', comment: ['{0} is a label for an operation. {1} is another message.'] },
					"Could not redo '{0}' across all files. {1}", element.label, element.invalidatedResources.createMessage()
				)
			);
		}

		// this must be the last future element in all the impacted resources!
		const cannotRedoDueToResources: string[] = [];
		for (const editStack of editStackSnapshot.editStacks) {
			if (editStack.getClosestFutureElement() !== element) {
				cannotRedoDueToResources.push(editStack.resourceLabel);
			}
		}
		if (cannotRedoDueToResources.length > 0) {
			return this._tryToSplitAndRedo(
				strResource,
				element,
				null,
				nls.localize(
					{ key: 'cannotWorkspaceRedoDueToChanges', comment: ['{0} is a label for an operation. {1} is a list of filenames.'] },
					"Could not redo '{0}' across all files because changes were made to {1}", element.label, cannotRedoDueToResources.join(', ')
				)
			);
		}

		const cannotLockDueToResources: string[] = [];
		for (const editStack of editStackSnapshot.editStacks) {
			if (editStack.locked) {
				cannotLockDueToResources.push(editStack.resourceLabel);
			}
		}
		if (cannotLockDueToResources.length > 0) {
			return this._tryToSplitAndRedo(
				strResource,
				element,
				null,
				nls.localize(
					{ key: 'cannotWorkspaceRedoDueToInProgressUndoRedo', comment: ['{0} is a label for an operation. {1} is a list of filenames.'] },
					"Could not redo '{0}' across all files because there is already an undo or redo operation running on {1}", element.label, cannotLockDueToResources.join(', ')
				)
			);
		}

		// check if new stack elements were added in the meantime...
		if (!editStackSnapshot.isValid()) {
			return this._tryToSplitAndRedo(
				strResource,
				element,
				null,
				nls.localize(
					{ key: 'cannotWorkspaceRedoDueToInMeantimeUndoRedo', comment: ['{0} is a label for an operation. {1} is a list of filenames.'] },
					"Could not redo '{0}' across all files because an undo or redo operation occurred in the meantime", element.label
				)
			);
		}

		return null;
	}

	private _workspaceRedo(strResource: string, element: WorkspaceStackElement): Promise<void> | void {
		const affectedEditStacks = this._getAffectedEditStacks(element);
		const verificationError = this._checkWorkspaceRedo(strResource, element, affectedEditStacks, /*invalidated resources will be checked after the prepare call*/false);
		if (verificationError) {
			return verificationError.returnValue;
		}
		return this._executeWorkspaceRedo(strResource, element, affectedEditStacks);
	}

	private async _executeWorkspaceRedo(strResource: string, element: WorkspaceStackElement, editStackSnapshot: EditStackSnapshot): Promise<void> {
		// prepare
		let cleanup: IDisposable;
		try {
			cleanup = await this._invokeWorkspacePrepare(element);
		} catch (err) {
			return this._onError(err, element);
		}

		// At this point, it is possible that the element has been made invalid in the meantime (due to the prepare await)
		const verificationError = this._checkWorkspaceRedo(strResource, element, editStackSnapshot, /*now also check that there are no more invalidated resources*/true);
		if (verificationError) {
			cleanup.dispose();
			return verificationError.returnValue;
		}

		for (const editStack of editStackSnapshot.editStacks) {
			editStack.moveForward(element);
		}
		return this._safeInvokeWithLocks(element, () => element.actual.redo(), editStackSnapshot, cleanup, () => this._continueRedoInGroup(element.groupId));
	}

	private _resourceRedo(editStack: ResourceEditStack, element: ResourceStackElement): Promise<void> | void {
		if (!element.isValid) {
			// invalid element => immediately flush edit stack!
			editStack.flushAllElements();
			return;
		}
		if (editStack.locked) {
			const message = nls.localize(
				{ key: 'cannotResourceRedoDueToInProgressUndoRedo', comment: ['{0} is a label for an operation.'] },
				"Could not redo '{0}' because there is already an undo or redo operation running.", element.label
			);
			this._notificationService.warn(message);
			return;
		}

		return this._invokeResourcePrepare(element, (cleanup) => {
			editStack.moveForward(element);
			return this._safeInvokeWithLocks(element, () => element.actual.redo(), new EditStackSnapshot([editStack]), cleanup, () => this._continueRedoInGroup(element.groupId));
		});
	}

	private _findClosestRedoElementInGroup(groupId: number): [StackElement | null, string | null] {
		if (!groupId) {
			return [null, null];
		}

		// find another element with the same groupId and with the lowest groupOrder ready to be redone
		let matchedElement: StackElement | null = null;
		let matchedStrResource: string | null = null;

		for (const [strResource, editStack] of this._editStacks) {
			const candidate = editStack.getClosestFutureElement();
			if (!candidate) {
				continue;
			}
			if (candidate.groupId === groupId) {
				if (!matchedElement || candidate.groupOrder < matchedElement.groupOrder) {
					matchedElement = candidate;
					matchedStrResource = strResource;
				}
			}
		}

		return [matchedElement, matchedStrResource];
	}

	private _continueRedoInGroup(groupId: number): Promise<void> | void {
		if (!groupId) {
			return;
		}

		const [, matchedStrResource] = this._findClosestRedoElementInGroup(groupId);
		if (matchedStrResource) {
			return this._redo(matchedStrResource);
		}
	}

	public redo(resourceOrSource: URI | UndoRedoSource | string): Promise<void> | void {
		if (resourceOrSource instanceof UndoRedoSource) {
			const [, matchedStrResource] = this._findClosestRedoElementWithSource(resourceOrSource.id);
			return matchedStrResource ? this._redo(matchedStrResource) : undefined;
		}
		if (typeof resourceOrSource === 'string') {
			return this._redo(resourceOrSource);
		}
		return this._redo(this.getUriComparisonKey(resourceOrSource));
	}

	private _redo(strResource: string): Promise<void> | void {
		if (!this._editStacks.has(strResource)) {
			return;
		}

		const editStack = this._editStacks.get(strResource)!;
		const element = editStack.getClosestFutureElement();
		if (!element) {
			return;
		}

		if (element.groupId) {
			// this element is a part of a group, we need to make sure redoing in a group is in order
			const [matchedElement, matchedStrResource] = this._findClosestRedoElementInGroup(element.groupId);
			if (element !== matchedElement && matchedStrResource) {
				// there is an element in the same group that should be redone before this one
				return this._redo(matchedStrResource);
			}
		}

		try {
			if (element.type === UndoRedoElementType.Workspace) {
				return this._workspaceRedo(strResource, element);
			} else {
				return this._resourceRedo(editStack, element);
			}
		} finally {
			if (DEBUG) {
				this._print('redo');
			}
		}
	}
}

class WorkspaceVerificationError {
	constructor(public readonly returnValue: Promise<void> | void) { }
}

registerSingleton(IUndoRedoService, UndoRedoService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/undoRedo/test/common/undoRedoService.test.ts]---
Location: vscode-main/src/vs/platform/undoRedo/test/common/undoRedoService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { mock } from '../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IDialogService, IPrompt } from '../../../dialogs/common/dialogs.js';
import { TestDialogService } from '../../../dialogs/test/common/testDialogService.js';
import { TestNotificationService } from '../../../notification/test/common/testNotificationService.js';
import { IUndoRedoElement, UndoRedoElementType, UndoRedoGroup } from '../../common/undoRedo.js';
import { UndoRedoService } from '../../common/undoRedoService.js';

suite('UndoRedoService', () => {

	function createUndoRedoService(dialogService: IDialogService = new TestDialogService()): UndoRedoService {
		const notificationService = new TestNotificationService();
		return new UndoRedoService(dialogService, notificationService);
	}

	test('simple single resource elements', () => {
		const resource = URI.file('test.txt');
		const service = createUndoRedoService();

		assert.strictEqual(service.canUndo(resource), false);
		assert.strictEqual(service.canRedo(resource), false);
		assert.strictEqual(service.hasElements(resource), false);
		assert.ok(service.getLastElement(resource) === null);

		let undoCall1 = 0;
		let redoCall1 = 0;
		const element1: IUndoRedoElement = {
			type: UndoRedoElementType.Resource,
			resource: resource,
			label: 'typing 1',
			code: 'typing',
			undo: () => { undoCall1++; },
			redo: () => { redoCall1++; }
		};
		service.pushElement(element1);

		assert.strictEqual(undoCall1, 0);
		assert.strictEqual(redoCall1, 0);
		assert.strictEqual(service.canUndo(resource), true);
		assert.strictEqual(service.canRedo(resource), false);
		assert.strictEqual(service.hasElements(resource), true);
		assert.ok(service.getLastElement(resource) === element1);

		service.undo(resource);
		assert.strictEqual(undoCall1, 1);
		assert.strictEqual(redoCall1, 0);
		assert.strictEqual(service.canUndo(resource), false);
		assert.strictEqual(service.canRedo(resource), true);
		assert.strictEqual(service.hasElements(resource), true);
		assert.ok(service.getLastElement(resource) === null);

		service.redo(resource);
		assert.strictEqual(undoCall1, 1);
		assert.strictEqual(redoCall1, 1);
		assert.strictEqual(service.canUndo(resource), true);
		assert.strictEqual(service.canRedo(resource), false);
		assert.strictEqual(service.hasElements(resource), true);
		assert.ok(service.getLastElement(resource) === element1);

		let undoCall2 = 0;
		let redoCall2 = 0;
		const element2: IUndoRedoElement = {
			type: UndoRedoElementType.Resource,
			resource: resource,
			label: 'typing 2',
			code: 'typing',
			undo: () => { undoCall2++; },
			redo: () => { redoCall2++; }
		};
		service.pushElement(element2);

		assert.strictEqual(undoCall1, 1);
		assert.strictEqual(redoCall1, 1);
		assert.strictEqual(undoCall2, 0);
		assert.strictEqual(redoCall2, 0);
		assert.strictEqual(service.canUndo(resource), true);
		assert.strictEqual(service.canRedo(resource), false);
		assert.strictEqual(service.hasElements(resource), true);
		assert.ok(service.getLastElement(resource) === element2);

		service.undo(resource);

		assert.strictEqual(undoCall1, 1);
		assert.strictEqual(redoCall1, 1);
		assert.strictEqual(undoCall2, 1);
		assert.strictEqual(redoCall2, 0);
		assert.strictEqual(service.canUndo(resource), true);
		assert.strictEqual(service.canRedo(resource), true);
		assert.strictEqual(service.hasElements(resource), true);
		assert.ok(service.getLastElement(resource) === null);

		let undoCall3 = 0;
		let redoCall3 = 0;
		const element3: IUndoRedoElement = {
			type: UndoRedoElementType.Resource,
			resource: resource,
			label: 'typing 2',
			code: 'typing',
			undo: () => { undoCall3++; },
			redo: () => { redoCall3++; }
		};
		service.pushElement(element3);

		assert.strictEqual(undoCall1, 1);
		assert.strictEqual(redoCall1, 1);
		assert.strictEqual(undoCall2, 1);
		assert.strictEqual(redoCall2, 0);
		assert.strictEqual(undoCall3, 0);
		assert.strictEqual(redoCall3, 0);
		assert.strictEqual(service.canUndo(resource), true);
		assert.strictEqual(service.canRedo(resource), false);
		assert.strictEqual(service.hasElements(resource), true);
		assert.ok(service.getLastElement(resource) === element3);

		service.undo(resource);

		assert.strictEqual(undoCall1, 1);
		assert.strictEqual(redoCall1, 1);
		assert.strictEqual(undoCall2, 1);
		assert.strictEqual(redoCall2, 0);
		assert.strictEqual(undoCall3, 1);
		assert.strictEqual(redoCall3, 0);
		assert.strictEqual(service.canUndo(resource), true);
		assert.strictEqual(service.canRedo(resource), true);
		assert.strictEqual(service.hasElements(resource), true);
		assert.ok(service.getLastElement(resource) === null);
	});

	test('multi resource elements', async () => {
		const resource1 = URI.file('test1.txt');
		const resource2 = URI.file('test2.txt');
		const service = createUndoRedoService(new class extends mock<IDialogService>() {
			override async prompt<T = any>(prompt: IPrompt<any>) {
				const result = prompt.buttons?.[0].run({ checkboxChecked: false });

				return { result };
			}
			override async confirm() {
				return {
					confirmed: true // confirm!
				};
			}
		});

		let undoCall1 = 0, undoCall11 = 0, undoCall12 = 0;
		let redoCall1 = 0, redoCall11 = 0, redoCall12 = 0;
		const element1: IUndoRedoElement = {
			type: UndoRedoElementType.Workspace,
			resources: [resource1, resource2],
			label: 'typing 1',
			code: 'typing',
			undo: () => { undoCall1++; },
			redo: () => { redoCall1++; },
			split: () => {
				return [
					{
						type: UndoRedoElementType.Resource,
						resource: resource1,
						label: 'typing 1.1',
						code: 'typing',
						undo: () => { undoCall11++; },
						redo: () => { redoCall11++; }
					},
					{
						type: UndoRedoElementType.Resource,
						resource: resource2,
						label: 'typing 1.2',
						code: 'typing',
						undo: () => { undoCall12++; },
						redo: () => { redoCall12++; }
					}
				];
			}
		};
		service.pushElement(element1);

		assert.strictEqual(service.canUndo(resource1), true);
		assert.strictEqual(service.canRedo(resource1), false);
		assert.strictEqual(service.hasElements(resource1), true);
		assert.ok(service.getLastElement(resource1) === element1);
		assert.strictEqual(service.canUndo(resource2), true);
		assert.strictEqual(service.canRedo(resource2), false);
		assert.strictEqual(service.hasElements(resource2), true);
		assert.ok(service.getLastElement(resource2) === element1);

		await service.undo(resource1);

		assert.strictEqual(undoCall1, 1);
		assert.strictEqual(redoCall1, 0);
		assert.strictEqual(service.canUndo(resource1), false);
		assert.strictEqual(service.canRedo(resource1), true);
		assert.strictEqual(service.hasElements(resource1), true);
		assert.ok(service.getLastElement(resource1) === null);
		assert.strictEqual(service.canUndo(resource2), false);
		assert.strictEqual(service.canRedo(resource2), true);
		assert.strictEqual(service.hasElements(resource2), true);
		assert.ok(service.getLastElement(resource2) === null);

		await service.redo(resource2);
		assert.strictEqual(undoCall1, 1);
		assert.strictEqual(redoCall1, 1);
		assert.strictEqual(undoCall11, 0);
		assert.strictEqual(redoCall11, 0);
		assert.strictEqual(undoCall12, 0);
		assert.strictEqual(redoCall12, 0);
		assert.strictEqual(service.canUndo(resource1), true);
		assert.strictEqual(service.canRedo(resource1), false);
		assert.strictEqual(service.hasElements(resource1), true);
		assert.ok(service.getLastElement(resource1) === element1);
		assert.strictEqual(service.canUndo(resource2), true);
		assert.strictEqual(service.canRedo(resource2), false);
		assert.strictEqual(service.hasElements(resource2), true);
		assert.ok(service.getLastElement(resource2) === element1);

	});

	test('UndoRedoGroup.None uses id 0', () => {
		assert.strictEqual(UndoRedoGroup.None.id, 0);
		assert.strictEqual(UndoRedoGroup.None.nextOrder(), 0);
		assert.strictEqual(UndoRedoGroup.None.nextOrder(), 0);
	});

	test('restoreSnapshot preserves elements that match the snapshot', () => {
		const resource = URI.file('test.txt');
		const service = createUndoRedoService();

		// Push three elements
		const element1: IUndoRedoElement = {
			type: UndoRedoElementType.Resource,
			resource: resource,
			label: 'typing 1',
			code: 'typing',
			undo: () => { },
			redo: () => { }
		};
		const element2: IUndoRedoElement = {
			type: UndoRedoElementType.Resource,
			resource: resource,
			label: 'typing 2',
			code: 'typing',
			undo: () => { },
			redo: () => { }
		};
		const element3: IUndoRedoElement = {
			type: UndoRedoElementType.Resource,
			resource: resource,
			label: 'typing 3',
			code: 'typing',
			undo: () => { },
			redo: () => { }
		};
		service.pushElement(element1);
		service.pushElement(element2);
		service.pushElement(element3);

		// Create snapshot after 3 elements: [element1, element2, element3]
		const snapshot = service.createSnapshot(resource);

		// Push more elements after the snapshot
		const element4: IUndoRedoElement = {
			type: UndoRedoElementType.Resource,
			resource: resource,
			label: 'typing 4',
			code: 'typing',
			undo: () => { },
			redo: () => { }
		};
		const element5: IUndoRedoElement = {
			type: UndoRedoElementType.Resource,
			resource: resource,
			label: 'typing 5',
			code: 'typing',
			undo: () => { },
			redo: () => { }
		};
		service.pushElement(element4);
		service.pushElement(element5);

		// Verify we have 5 elements now
		let elements = service.getElements(resource);
		assert.strictEqual(elements.past.length, 5);
		assert.strictEqual(elements.future.length, 0);

		// Restore snapshot - should remove element4 and element5, but keep element1, element2, element3
		service.restoreSnapshot(snapshot);

		// Verify that elements matching the snapshot are preserved
		elements = service.getElements(resource);
		assert.strictEqual(elements.past.length, 3, 'Should have 3 past elements after restore');
		assert.strictEqual(elements.future.length, 0, 'Should have 0 future elements after restore');
		assert.strictEqual(elements.past[0], element1, 'First element should be element1');
		assert.strictEqual(elements.past[1], element2, 'Second element should be element2');
		assert.strictEqual(elements.past[2], element3, 'Third element should be element3');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/update/common/update.config.contribution.ts]---
Location: vscode-main/src/vs/platform/update/common/update.config.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isWeb, isWindows } from '../../../base/common/platform.js';
import { PolicyCategory } from '../../../base/common/policy.js';
import { localize } from '../../../nls.js';
import { ConfigurationScope, Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../configuration/common/configurationRegistry.js';
import { Registry } from '../../registry/common/platform.js';

const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
configurationRegistry.registerConfiguration({
	id: 'update',
	order: 15,
	title: localize('updateConfigurationTitle', "Update"),
	type: 'object',
	properties: {
		'update.mode': {
			type: 'string',
			enum: ['none', 'manual', 'start', 'default'],
			default: 'default',
			scope: ConfigurationScope.APPLICATION,
			description: localize('updateMode', "Configure whether you receive automatic updates. Requires a restart after change. The updates are fetched from a Microsoft online service."),
			tags: ['usesOnlineServices'],
			enumDescriptions: [
				localize('none', "Disable updates."),
				localize('manual', "Disable automatic background update checks. Updates will be available if you manually check for updates."),
				localize('start', "Check for updates only on startup. Disable automatic background update checks."),
				localize('default', "Enable automatic update checks. Code will check for updates automatically and periodically.")
			],
			policy: {
				name: 'UpdateMode',
				category: PolicyCategory.Update,
				minimumVersion: '1.67',
				localization: {
					description: { key: 'updateMode', value: localize('updateMode', "Configure whether you receive automatic updates. Requires a restart after change. The updates are fetched from a Microsoft online service."), },
					enumDescriptions: [
						{
							key: 'none',
							value: localize('none', "Disable updates."),
						},
						{
							key: 'manual',
							value: localize('manual', "Disable automatic background update checks. Updates will be available if you manually check for updates."),
						},
						{
							key: 'start',
							value: localize('start', "Check for updates only on startup. Disable automatic background update checks."),
						},
						{
							key: 'default',
							value: localize('default', "Enable automatic update checks. Code will check for updates automatically and periodically."),
						}
					]
				},
			}
		},
		'update.channel': {
			type: 'string',
			default: 'default',
			scope: ConfigurationScope.APPLICATION,
			description: localize('updateMode', "Configure whether you receive automatic updates. Requires a restart after change. The updates are fetched from a Microsoft online service."),
			deprecationMessage: localize('deprecated', "This setting is deprecated, please use '{0}' instead.", 'update.mode')
		},
		'update.enableWindowsBackgroundUpdates': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.APPLICATION,
			title: localize('enableWindowsBackgroundUpdatesTitle', "Enable Background Updates on Windows"),
			description: localize('enableWindowsBackgroundUpdates', "Enable to download and install new VS Code versions in the background on Windows."),
			included: isWindows && !isWeb
		},
		'update.showReleaseNotes': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.APPLICATION,
			description: localize('showReleaseNotes', "Show Release Notes after an update. The Release Notes are fetched from a Microsoft online service."),
			tags: ['usesOnlineServices']
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/update/common/update.ts]---
Location: vscode-main/src/vs/platform/update/common/update.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { upcast } from '../../../base/common/types.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export interface IUpdate {
	// Windows and Linux: 9a19815253d91900be5ec1016e0ecc7cc9a6950 (Commit Hash). Mac: 1.54.0 (Product Version)
	version: string;
	productVersion?: string;
	timestamp?: number;
	url?: string;
	sha256hash?: string;
}

/**
 * Updates are run as a state machine:
 *
 *      Uninitialized
 *           ↓
 *          Idle
 *          ↓  ↑
 *   Checking for Updates  →  Available for Download
 *         ↓
 *     Downloading  →   Ready
 *         ↓               ↑
 *     Downloaded   →  Updating
 *
 * Available: There is an update available for download (linux).
 * Ready: Code will be updated as soon as it restarts (win32, darwin).
 * Downloaded: There is an update ready to be installed in the background (win32).
 */

export const enum StateType {
	Uninitialized = 'uninitialized',
	Idle = 'idle',
	Disabled = 'disabled',
	CheckingForUpdates = 'checking for updates',
	AvailableForDownload = 'available for download',
	Downloading = 'downloading',
	Downloaded = 'downloaded',
	Updating = 'updating',
	Ready = 'ready',
}

export const enum UpdateType {
	Setup,
	Archive,
	Snap
}

export const enum DisablementReason {
	NotBuilt,
	DisabledByEnvironment,
	ManuallyDisabled,
	MissingConfiguration,
	InvalidConfiguration,
	RunningAsAdmin,
}

export type Uninitialized = { type: StateType.Uninitialized };
export type Disabled = { type: StateType.Disabled; reason: DisablementReason };
export type Idle = { type: StateType.Idle; updateType: UpdateType; error?: string };
export type CheckingForUpdates = { type: StateType.CheckingForUpdates; explicit: boolean };
export type AvailableForDownload = { type: StateType.AvailableForDownload; update: IUpdate };
export type Downloading = { type: StateType.Downloading };
export type Downloaded = { type: StateType.Downloaded; update: IUpdate };
export type Updating = { type: StateType.Updating; update: IUpdate };
export type Ready = { type: StateType.Ready; update: IUpdate };

export type State = Uninitialized | Disabled | Idle | CheckingForUpdates | AvailableForDownload | Downloading | Downloaded | Updating | Ready;

export const State = {
	Uninitialized: upcast<Uninitialized>({ type: StateType.Uninitialized }),
	Disabled: (reason: DisablementReason): Disabled => ({ type: StateType.Disabled, reason }),
	Idle: (updateType: UpdateType, error?: string): Idle => ({ type: StateType.Idle, updateType, error }),
	CheckingForUpdates: (explicit: boolean): CheckingForUpdates => ({ type: StateType.CheckingForUpdates, explicit }),
	AvailableForDownload: (update: IUpdate): AvailableForDownload => ({ type: StateType.AvailableForDownload, update }),
	Downloading: upcast<Downloading>({ type: StateType.Downloading }),
	Downloaded: (update: IUpdate): Downloaded => ({ type: StateType.Downloaded, update }),
	Updating: (update: IUpdate): Updating => ({ type: StateType.Updating, update }),
	Ready: (update: IUpdate): Ready => ({ type: StateType.Ready, update }),
};

export interface IAutoUpdater extends Event.NodeEventEmitter {
	setFeedURL(url: string): void;
	checkForUpdates(): void;
	applyUpdate?(): Promise<void>;
	quitAndInstall(): void;
}

export const IUpdateService = createDecorator<IUpdateService>('updateService');

export interface IUpdateService {
	readonly _serviceBrand: undefined;

	readonly onStateChange: Event<State>;
	readonly state: State;

	checkForUpdates(explicit: boolean): Promise<void>;
	downloadUpdate(): Promise<void>;
	applyUpdate(): Promise<void>;
	quitAndInstall(): Promise<void>;

	isLatestVersion(): Promise<boolean | undefined>;
	_applySpecificUpdate(packagePath: string): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/update/common/updateIpc.ts]---
Location: vscode-main/src/vs/platform/update/common/updateIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { IUpdateService, State } from './update.js';

export class UpdateChannel implements IServerChannel {

	constructor(private service: IUpdateService) { }

	listen(_: unknown, event: string): Event<any> {
		switch (event) {
			case 'onStateChange': return this.service.onStateChange;
		}

		throw new Error(`Event not found: ${event}`);
	}

	call(_: unknown, command: string, arg?: any): Promise<any> {
		switch (command) {
			case 'checkForUpdates': return this.service.checkForUpdates(arg);
			case 'downloadUpdate': return this.service.downloadUpdate();
			case 'applyUpdate': return this.service.applyUpdate();
			case 'quitAndInstall': return this.service.quitAndInstall();
			case '_getInitialState': return Promise.resolve(this.service.state);
			case 'isLatestVersion': return this.service.isLatestVersion();
			case '_applySpecificUpdate': return this.service._applySpecificUpdate(arg);
		}

		throw new Error(`Call not found: ${command}`);
	}
}

export class UpdateChannelClient implements IUpdateService {

	declare readonly _serviceBrand: undefined;
	private readonly disposables = new DisposableStore();

	private readonly _onStateChange = new Emitter<State>();
	readonly onStateChange: Event<State> = this._onStateChange.event;

	private _state: State = State.Uninitialized;
	get state(): State { return this._state; }
	set state(state: State) {
		this._state = state;
		this._onStateChange.fire(state);
	}

	constructor(private readonly channel: IChannel) {
		this.disposables.add(this.channel.listen<State>('onStateChange')(state => this.state = state));
		this.channel.call<State>('_getInitialState').then(state => this.state = state);
	}

	checkForUpdates(explicit: boolean): Promise<void> {
		return this.channel.call('checkForUpdates', explicit);
	}

	downloadUpdate(): Promise<void> {
		return this.channel.call('downloadUpdate');
	}

	applyUpdate(): Promise<void> {
		return this.channel.call('applyUpdate');
	}

	quitAndInstall(): Promise<void> {
		return this.channel.call('quitAndInstall');
	}

	isLatestVersion(): Promise<boolean | undefined> {
		return this.channel.call('isLatestVersion');
	}

	_applySpecificUpdate(packagePath: string): Promise<void> {
		return this.channel.call('_applySpecificUpdate', packagePath);
	}

	dispose(): void {
		this.disposables.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/update/electron-main/abstractUpdateService.ts]---
Location: vscode-main/src/vs/platform/update/electron-main/abstractUpdateService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../base/common/async.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentMainService } from '../../environment/electron-main/environmentMainService.js';
import { ILifecycleMainService, LifecycleMainPhase } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { IRequestService } from '../../request/common/request.js';
import { AvailableForDownload, DisablementReason, IUpdateService, State, StateType, UpdateType } from '../common/update.js';

export function createUpdateURL(platform: string, quality: string, productService: IProductService): string {
	return `${productService.updateUrl}/api/update/${platform}/${quality}/${productService.commit}`;
}

export type UpdateErrorClassification = {
	owner: 'joaomoreno';
	messageHash: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The hash of the error message.' };
	comment: 'This is used to know how often VS Code updates have failed.';
};

export abstract class AbstractUpdateService implements IUpdateService {

	declare readonly _serviceBrand: undefined;

	protected url: string | undefined;

	private _state: State = State.Uninitialized;

	private readonly _onStateChange = new Emitter<State>();
	readonly onStateChange: Event<State> = this._onStateChange.event;

	get state(): State {
		return this._state;
	}

	protected setState(state: State): void {
		this.logService.info('update#setState', state.type);
		this._state = state;
		this._onStateChange.fire(state);
	}

	constructor(
		@ILifecycleMainService protected readonly lifecycleMainService: ILifecycleMainService,
		@IConfigurationService protected configurationService: IConfigurationService,
		@IEnvironmentMainService protected environmentMainService: IEnvironmentMainService,
		@IRequestService protected requestService: IRequestService,
		@ILogService protected logService: ILogService,
		@IProductService protected readonly productService: IProductService
	) {
		lifecycleMainService.when(LifecycleMainPhase.AfterWindowOpen)
			.finally(() => this.initialize());
	}

	/**
	 * This must be called before any other call. This is a performance
	 * optimization, to avoid using extra CPU cycles before first window open.
	 * https://github.com/microsoft/vscode/issues/89784
	 */
	protected async initialize(): Promise<void> {
		if (!this.environmentMainService.isBuilt) {
			this.setState(State.Disabled(DisablementReason.NotBuilt));
			return; // updates are never enabled when running out of sources
		}

		if (this.environmentMainService.disableUpdates) {
			this.setState(State.Disabled(DisablementReason.DisabledByEnvironment));
			this.logService.info('update#ctor - updates are disabled by the environment');
			return;
		}

		if (!this.productService.updateUrl || !this.productService.commit) {
			this.setState(State.Disabled(DisablementReason.MissingConfiguration));
			this.logService.info('update#ctor - updates are disabled as there is no update URL');
			return;
		}

		const updateMode = this.configurationService.getValue<'none' | 'manual' | 'start' | 'default'>('update.mode');
		const quality = this.getProductQuality(updateMode);

		if (!quality) {
			this.setState(State.Disabled(DisablementReason.ManuallyDisabled));
			this.logService.info('update#ctor - updates are disabled by user preference');
			return;
		}

		this.url = this.buildUpdateFeedUrl(quality);
		if (!this.url) {
			this.setState(State.Disabled(DisablementReason.InvalidConfiguration));
			this.logService.info('update#ctor - updates are disabled as the update URL is badly formed');
			return;
		}

		// hidden setting
		if (this.configurationService.getValue<boolean>('_update.prss')) {
			const url = new URL(this.url);
			url.searchParams.set('prss', 'true');
			this.url = url.toString();
		}

		this.setState(State.Idle(this.getUpdateType()));

		await this.postInitialize();

		if (updateMode === 'manual') {
			this.logService.info('update#ctor - manual checks only; automatic updates are disabled by user preference');
			return;
		}

		if (updateMode === 'start') {
			this.logService.info('update#ctor - startup checks only; automatic updates are disabled by user preference');

			// Check for updates only once after 30 seconds
			setTimeout(() => this.checkForUpdates(false), 30 * 1000);
		} else {
			// Start checking for updates after 30 seconds
			this.scheduleCheckForUpdates(30 * 1000).then(undefined, err => this.logService.error(err));
		}
	}

	private getProductQuality(updateMode: string): string | undefined {
		return updateMode === 'none' ? undefined : this.productService.quality;
	}

	private scheduleCheckForUpdates(delay = 60 * 60 * 1000): Promise<void> {
		return timeout(delay)
			.then(() => this.checkForUpdates(false))
			.then(() => {
				// Check again after 1 hour
				return this.scheduleCheckForUpdates(60 * 60 * 1000);
			});
	}

	async checkForUpdates(explicit: boolean): Promise<void> {
		this.logService.trace('update#checkForUpdates, state = ', this.state.type);

		if (this.state.type !== StateType.Idle) {
			return;
		}

		this.doCheckForUpdates(explicit);
	}

	async downloadUpdate(): Promise<void> {
		this.logService.trace('update#downloadUpdate, state = ', this.state.type);

		if (this.state.type !== StateType.AvailableForDownload) {
			return;
		}

		await this.doDownloadUpdate(this.state);
	}

	protected async doDownloadUpdate(state: AvailableForDownload): Promise<void> {
		// noop
	}

	async applyUpdate(): Promise<void> {
		this.logService.trace('update#applyUpdate, state = ', this.state.type);

		if (this.state.type !== StateType.Downloaded) {
			return;
		}

		await this.doApplyUpdate();
	}

	protected async doApplyUpdate(): Promise<void> {
		// noop
	}

	quitAndInstall(): Promise<void> {
		this.logService.trace('update#quitAndInstall, state = ', this.state.type);

		if (this.state.type !== StateType.Ready) {
			return Promise.resolve(undefined);
		}

		this.logService.trace('update#quitAndInstall(): before lifecycle quit()');

		this.lifecycleMainService.quit(true /* will restart */).then(vetod => {
			this.logService.trace(`update#quitAndInstall(): after lifecycle quit() with veto: ${vetod}`);
			if (vetod) {
				return;
			}

			this.logService.trace('update#quitAndInstall(): running raw#quitAndInstall()');
			this.doQuitAndInstall();
		});

		return Promise.resolve(undefined);
	}

	async isLatestVersion(): Promise<boolean | undefined> {
		if (!this.url) {
			return undefined;
		}

		const mode = this.configurationService.getValue<'none' | 'manual' | 'start' | 'default'>('update.mode');

		if (mode === 'none') {
			return false;
		}

		try {
			const context = await this.requestService.request({ url: this.url }, CancellationToken.None);
			// The update server replies with 204 (No Content) when no
			// update is available - that's all we want to know.
			return context.res.statusCode === 204;

		} catch (error) {
			this.logService.error('update#isLatestVersion(): failed to check for updates');
			this.logService.error(error);
			return undefined;
		}
	}

	async _applySpecificUpdate(packagePath: string): Promise<void> {
		// noop
	}

	protected getUpdateType(): UpdateType {
		return UpdateType.Archive;
	}

	protected doQuitAndInstall(): void {
		// noop
	}

	protected async postInitialize(): Promise<void> {
		// noop
	}

	protected abstract buildUpdateFeedUrl(quality: string): string | undefined;
	protected abstract doCheckForUpdates(explicit: boolean): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/update/electron-main/updateService.darwin.ts]---
Location: vscode-main/src/vs/platform/update/electron-main/updateService.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as electron from 'electron';
import { memoize } from '../../../base/common/decorators.js';
import { Event } from '../../../base/common/event.js';
import { hash } from '../../../base/common/hash.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentMainService } from '../../environment/electron-main/environmentMainService.js';
import { ILifecycleMainService, IRelaunchHandler, IRelaunchOptions } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { IRequestService } from '../../request/common/request.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { IUpdate, State, StateType, UpdateType } from '../common/update.js';
import { AbstractUpdateService, createUpdateURL, UpdateErrorClassification } from './abstractUpdateService.js';

export class DarwinUpdateService extends AbstractUpdateService implements IRelaunchHandler {

	private readonly disposables = new DisposableStore();

	@memoize private get onRawError(): Event<string> { return Event.fromNodeEventEmitter(electron.autoUpdater, 'error', (_, message) => message); }
	@memoize private get onRawUpdateNotAvailable(): Event<void> { return Event.fromNodeEventEmitter<void>(electron.autoUpdater, 'update-not-available'); }
	@memoize private get onRawUpdateAvailable(): Event<void> { return Event.fromNodeEventEmitter(electron.autoUpdater, 'update-available'); }
	@memoize private get onRawUpdateDownloaded(): Event<IUpdate> { return Event.fromNodeEventEmitter(electron.autoUpdater, 'update-downloaded', (_, releaseNotes, version, timestamp) => ({ version, productVersion: version, timestamp })); }

	constructor(
		@ILifecycleMainService lifecycleMainService: ILifecycleMainService,
		@IConfigurationService configurationService: IConfigurationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IEnvironmentMainService environmentMainService: IEnvironmentMainService,
		@IRequestService requestService: IRequestService,
		@ILogService logService: ILogService,
		@IProductService productService: IProductService
	) {
		super(lifecycleMainService, configurationService, environmentMainService, requestService, logService, productService);

		lifecycleMainService.setRelaunchHandler(this);
	}

	handleRelaunch(options?: IRelaunchOptions): boolean {
		if (options?.addArgs || options?.removeArgs) {
			return false; // we cannot apply an update and restart with different args
		}

		if (this.state.type !== StateType.Ready) {
			return false; // we only handle the relaunch when we have a pending update
		}

		this.logService.trace('update#handleRelaunch(): running raw#quitAndInstall()');
		this.doQuitAndInstall();

		return true;
	}

	protected override async initialize(): Promise<void> {
		await super.initialize();
		this.onRawError(this.onError, this, this.disposables);
		this.onRawUpdateAvailable(this.onUpdateAvailable, this, this.disposables);
		this.onRawUpdateDownloaded(this.onUpdateDownloaded, this, this.disposables);
		this.onRawUpdateNotAvailable(this.onUpdateNotAvailable, this, this.disposables);
	}

	private onError(err: string): void {
		this.telemetryService.publicLog2<{ messageHash: string }, UpdateErrorClassification>('update:error', { messageHash: String(hash(String(err))) });
		this.logService.error('UpdateService error:', err);

		// only show message when explicitly checking for updates
		const message = (this.state.type === StateType.CheckingForUpdates && this.state.explicit) ? err : undefined;
		this.setState(State.Idle(UpdateType.Archive, message));
	}

	protected buildUpdateFeedUrl(quality: string): string | undefined {
		let assetID: string;
		if (!this.productService.darwinUniversalAssetId) {
			assetID = process.arch === 'x64' ? 'darwin' : 'darwin-arm64';
		} else {
			assetID = this.productService.darwinUniversalAssetId;
		}
		const url = createUpdateURL(assetID, quality, this.productService);
		try {
			electron.autoUpdater.setFeedURL({ url });
		} catch (e) {
			// application is very likely not signed
			this.logService.error('Failed to set update feed URL', e);
			return undefined;
		}
		return url;
	}

	protected doCheckForUpdates(explicit: boolean): void {
		if (!this.url) {
			return;
		}

		this.setState(State.CheckingForUpdates(explicit));

		const url = explicit ? this.url : `${this.url}?bg=true`;
		electron.autoUpdater.setFeedURL({ url });
		electron.autoUpdater.checkForUpdates();
	}

	private onUpdateAvailable(): void {
		if (this.state.type !== StateType.CheckingForUpdates) {
			return;
		}

		this.setState(State.Downloading);
	}

	private onUpdateDownloaded(update: IUpdate): void {
		if (this.state.type !== StateType.Downloading) {
			return;
		}

		this.setState(State.Downloaded(update));

		type UpdateDownloadedClassification = {
			owner: 'joaomoreno';
			newVersion: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The version number of the new VS Code that has been downloaded.' };
			comment: 'This is used to know how often VS Code has successfully downloaded the update.';
		};
		this.telemetryService.publicLog2<{ newVersion: String }, UpdateDownloadedClassification>('update:downloaded', { newVersion: update.version });

		this.setState(State.Ready(update));
	}

	private onUpdateNotAvailable(): void {
		if (this.state.type !== StateType.CheckingForUpdates) {
			return;
		}

		this.setState(State.Idle(UpdateType.Archive));
	}

	protected override doQuitAndInstall(): void {
		this.logService.trace('update#quitAndInstall(): running raw#quitAndInstall()');
		electron.autoUpdater.quitAndInstall();
	}

	dispose(): void {
		this.disposables.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/update/electron-main/updateService.linux.ts]---
Location: vscode-main/src/vs/platform/update/electron-main/updateService.linux.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentMainService } from '../../environment/electron-main/environmentMainService.js';
import { ILifecycleMainService } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import { INativeHostMainService } from '../../native/electron-main/nativeHostMainService.js';
import { IProductService } from '../../product/common/productService.js';
import { asJson, IRequestService } from '../../request/common/request.js';
import { AvailableForDownload, IUpdate, State, UpdateType } from '../common/update.js';
import { AbstractUpdateService, createUpdateURL } from './abstractUpdateService.js';

export class LinuxUpdateService extends AbstractUpdateService {

	constructor(
		@ILifecycleMainService lifecycleMainService: ILifecycleMainService,
		@IConfigurationService configurationService: IConfigurationService,
		@IEnvironmentMainService environmentMainService: IEnvironmentMainService,
		@IRequestService requestService: IRequestService,
		@ILogService logService: ILogService,
		@INativeHostMainService private readonly nativeHostMainService: INativeHostMainService,
		@IProductService productService: IProductService
	) {
		super(lifecycleMainService, configurationService, environmentMainService, requestService, logService, productService);
	}

	protected buildUpdateFeedUrl(quality: string): string {
		return createUpdateURL(`linux-${process.arch}`, quality, this.productService);
	}

	protected doCheckForUpdates(explicit: boolean): void {
		if (!this.url) {
			return;
		}

		const url = explicit ? this.url : `${this.url}?bg=true`;
		this.setState(State.CheckingForUpdates(explicit));

		this.requestService.request({ url }, CancellationToken.None)
			.then<IUpdate | null>(asJson)
			.then(update => {
				if (!update || !update.url || !update.version || !update.productVersion) {
					this.setState(State.Idle(UpdateType.Archive));
				} else {
					this.setState(State.AvailableForDownload(update));
				}
			})
			.then(undefined, err => {
				this.logService.error(err);
				// only show message when explicitly checking for updates
				const message: string | undefined = explicit ? (err.message || err) : undefined;
				this.setState(State.Idle(UpdateType.Archive, message));
			});
	}

	protected override async doDownloadUpdate(state: AvailableForDownload): Promise<void> {
		// Use the download URL if available as we don't currently detect the package type that was
		// installed and the website download page is more useful than the tarball generally.
		if (this.productService.downloadUrl && this.productService.downloadUrl.length > 0) {
			this.nativeHostMainService.openExternal(undefined, this.productService.downloadUrl);
		} else if (state.update.url) {
			this.nativeHostMainService.openExternal(undefined, state.update.url);
		}

		this.setState(State.Idle(UpdateType.Archive));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/update/electron-main/updateService.snap.ts]---
Location: vscode-main/src/vs/platform/update/electron-main/updateService.snap.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { spawn } from 'child_process';
import { realpath, watch } from 'fs';
import { timeout } from '../../../base/common/async.js';
import { Emitter, Event } from '../../../base/common/event.js';
import * as path from '../../../base/common/path.js';
import { IEnvironmentMainService } from '../../environment/electron-main/environmentMainService.js';
import { ILifecycleMainService } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import { AvailableForDownload, IUpdateService, State, StateType, UpdateType } from '../common/update.js';

abstract class AbstractUpdateService implements IUpdateService {

	declare readonly _serviceBrand: undefined;

	private _state: State = State.Uninitialized;

	private readonly _onStateChange = new Emitter<State>();
	readonly onStateChange: Event<State> = this._onStateChange.event;

	get state(): State {
		return this._state;
	}

	protected setState(state: State): void {
		this.logService.info('update#setState', state.type);
		this._state = state;
		this._onStateChange.fire(state);
	}

	constructor(
		@ILifecycleMainService private readonly lifecycleMainService: ILifecycleMainService,
		@IEnvironmentMainService environmentMainService: IEnvironmentMainService,
		@ILogService protected logService: ILogService,
	) {
		if (environmentMainService.disableUpdates) {
			this.logService.info('update#ctor - updates are disabled');
			return;
		}

		this.setState(State.Idle(this.getUpdateType()));

		// Start checking for updates after 30 seconds
		this.scheduleCheckForUpdates(30 * 1000).then(undefined, err => this.logService.error(err));
	}

	private scheduleCheckForUpdates(delay = 60 * 60 * 1000): Promise<void> {
		return timeout(delay)
			.then(() => this.checkForUpdates(false))
			.then(() => {
				// Check again after 1 hour
				return this.scheduleCheckForUpdates(60 * 60 * 1000);
			});
	}

	async checkForUpdates(explicit: boolean): Promise<void> {
		this.logService.trace('update#checkForUpdates, state = ', this.state.type);

		if (this.state.type !== StateType.Idle) {
			return;
		}

		this.doCheckForUpdates(explicit);
	}

	async downloadUpdate(): Promise<void> {
		this.logService.trace('update#downloadUpdate, state = ', this.state.type);

		if (this.state.type !== StateType.AvailableForDownload) {
			return;
		}

		await this.doDownloadUpdate(this.state);
	}

	protected doDownloadUpdate(state: AvailableForDownload): Promise<void> {
		return Promise.resolve(undefined);
	}

	async applyUpdate(): Promise<void> {
		this.logService.trace('update#applyUpdate, state = ', this.state.type);

		if (this.state.type !== StateType.Downloaded) {
			return;
		}

		await this.doApplyUpdate();
	}

	protected doApplyUpdate(): Promise<void> {
		return Promise.resolve(undefined);
	}

	quitAndInstall(): Promise<void> {
		this.logService.trace('update#quitAndInstall, state = ', this.state.type);

		if (this.state.type !== StateType.Ready) {
			return Promise.resolve(undefined);
		}

		this.logService.trace('update#quitAndInstall(): before lifecycle quit()');

		this.lifecycleMainService.quit(true /* will restart */).then(vetod => {
			this.logService.trace(`update#quitAndInstall(): after lifecycle quit() with veto: ${vetod}`);
			if (vetod) {
				return;
			}

			this.logService.trace('update#quitAndInstall(): running raw#quitAndInstall()');
			this.doQuitAndInstall();
		});

		return Promise.resolve(undefined);
	}


	protected getUpdateType(): UpdateType {
		return UpdateType.Snap;
	}

	protected doQuitAndInstall(): void {
		// noop
	}

	abstract isLatestVersion(): Promise<boolean | undefined>;

	async _applySpecificUpdate(packagePath: string): Promise<void> {
		// noop
	}

	protected abstract doCheckForUpdates(context: any): void;
}

export class SnapUpdateService extends AbstractUpdateService {

	constructor(
		private snap: string,
		private snapRevision: string,
		@ILifecycleMainService lifecycleMainService: ILifecycleMainService,
		@IEnvironmentMainService environmentMainService: IEnvironmentMainService,
		@ILogService logService: ILogService,
	) {
		super(lifecycleMainService, environmentMainService, logService);

		const watcher = watch(path.dirname(this.snap));
		const onChange = Event.fromNodeEventEmitter(watcher, 'change', (_, fileName: string) => fileName);
		const onCurrentChange = Event.filter(onChange, n => n === 'current');
		const onDebouncedCurrentChange = Event.debounce(onCurrentChange, (_, e) => e, 2000);
		const listener = onDebouncedCurrentChange(() => this.checkForUpdates(false));

		lifecycleMainService.onWillShutdown(() => {
			listener.dispose();
			watcher.close();
		});
	}

	protected doCheckForUpdates(): void {
		this.setState(State.CheckingForUpdates(false));
		this.isUpdateAvailable().then(result => {
			if (result) {
				this.setState(State.Ready({ version: 'something' }));
			} else {
				this.setState(State.Idle(UpdateType.Snap));
			}
		}, err => {
			this.logService.error(err);
			this.setState(State.Idle(UpdateType.Snap, err.message || err));
		});
	}

	protected override doQuitAndInstall(): void {
		this.logService.trace('update#quitAndInstall(): running raw#quitAndInstall()');

		// Allow 3 seconds for VS Code to close
		spawn('sleep 3 && ' + path.basename(process.argv[0]), {
			shell: true,
			detached: true,
			stdio: 'ignore',
		});
	}

	private async isUpdateAvailable(): Promise<boolean> {
		const resolvedCurrentSnapPath = await new Promise<string>((c, e) => realpath(`${path.dirname(this.snap)}/current`, (err, r) => err ? e(err) : c(r)));
		const currentRevision = path.basename(resolvedCurrentSnapPath);
		return this.snapRevision !== currentRevision;
	}

	isLatestVersion(): Promise<boolean | undefined> {
		return this.isUpdateAvailable().then(undefined, err => {
			this.logService.error('update#checkForSnapUpdate(): Could not get realpath of application.');
			return undefined;
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/update/electron-main/updateService.win32.ts]---
Location: vscode-main/src/vs/platform/update/electron-main/updateService.win32.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { spawn } from 'child_process';
import { existsSync, unlinkSync } from 'fs';
import { mkdir, readFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { app } from 'electron';
import { timeout } from '../../../base/common/async.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { memoize } from '../../../base/common/decorators.js';
import { hash } from '../../../base/common/hash.js';
import * as path from '../../../base/common/path.js';
import { URI } from '../../../base/common/uri.js';
import { checksum } from '../../../base/node/crypto.js';
import * as pfs from '../../../base/node/pfs.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentMainService } from '../../environment/electron-main/environmentMainService.js';
import { IFileService } from '../../files/common/files.js';
import { ILifecycleMainService, IRelaunchHandler, IRelaunchOptions } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import { INativeHostMainService } from '../../native/electron-main/nativeHostMainService.js';
import { IProductService } from '../../product/common/productService.js';
import { asJson, IRequestService } from '../../request/common/request.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { AvailableForDownload, DisablementReason, IUpdate, State, StateType, UpdateType } from '../common/update.js';
import { AbstractUpdateService, createUpdateURL, UpdateErrorClassification } from './abstractUpdateService.js';

async function pollUntil(fn: () => boolean, millis = 1000): Promise<void> {
	while (!fn()) {
		await timeout(millis);
	}
}

interface IAvailableUpdate {
	packagePath: string;
	updateFilePath?: string;
}

let _updateType: UpdateType | undefined = undefined;
function getUpdateType(): UpdateType {
	if (typeof _updateType === 'undefined') {
		_updateType = existsSync(path.join(path.dirname(process.execPath), 'unins000.exe'))
			? UpdateType.Setup
			: UpdateType.Archive;
	}

	return _updateType;
}

export class Win32UpdateService extends AbstractUpdateService implements IRelaunchHandler {

	private availableUpdate: IAvailableUpdate | undefined;

	@memoize
	get cachePath(): Promise<string> {
		const result = path.join(tmpdir(), `vscode-${this.productService.quality}-${this.productService.target}-${process.arch}`);
		return mkdir(result, { recursive: true }).then(() => result);
	}

	constructor(
		@ILifecycleMainService lifecycleMainService: ILifecycleMainService,
		@IConfigurationService configurationService: IConfigurationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IEnvironmentMainService environmentMainService: IEnvironmentMainService,
		@IRequestService requestService: IRequestService,
		@ILogService logService: ILogService,
		@IFileService private readonly fileService: IFileService,
		@INativeHostMainService private readonly nativeHostMainService: INativeHostMainService,
		@IProductService productService: IProductService
	) {
		super(lifecycleMainService, configurationService, environmentMainService, requestService, logService, productService);

		lifecycleMainService.setRelaunchHandler(this);
	}

	handleRelaunch(options?: IRelaunchOptions): boolean {
		if (options?.addArgs || options?.removeArgs) {
			return false; // we cannot apply an update and restart with different args
		}

		if (this.state.type !== StateType.Ready || !this.availableUpdate) {
			return false; // we only handle the relaunch when we have a pending update
		}

		this.logService.trace('update#handleRelaunch(): running raw#quitAndInstall()');
		this.doQuitAndInstall();

		return true;
	}

	protected override async initialize(): Promise<void> {
		if (this.environmentMainService.isBuilt) {
			const cachePath = await this.cachePath;
			app.setPath('appUpdate', cachePath);
			try {
				await unlink(path.join(cachePath, 'session-ending.flag'));
			} catch { }
		}

		if (this.productService.target === 'user' && await this.nativeHostMainService.isAdmin(undefined)) {
			this.setState(State.Disabled(DisablementReason.RunningAsAdmin));
			this.logService.info('update#ctor - updates are disabled due to running as Admin in user setup');
			return;
		}

		await super.initialize();
	}

	protected override async postInitialize(): Promise<void> {
		if (this.productService.quality !== 'insider') {
			return;
		}
		// Check for pending update from previous session
		// This can happen if the app is quit right after the update has been
		// downloaded and before the update has been applied.
		const exePath = app.getPath('exe');
		const exeDir = path.dirname(exePath);
		const updatingVersionPath = path.join(exeDir, 'updating_version');
		if (await pfs.Promises.exists(updatingVersionPath)) {
			try {
				const updatingVersion = (await readFile(updatingVersionPath, 'utf8')).trim();
				this.logService.info(`update#doCheckForUpdates - application was updating to version ${updatingVersion}`);
				const updatePackagePath = await this.getUpdatePackagePath(updatingVersion);
				if (await pfs.Promises.exists(updatePackagePath)) {
					await this._applySpecificUpdate(updatePackagePath);
					this.logService.info(`update#doCheckForUpdates - successfully applied update to version ${updatingVersion}`);
				}
			} catch (e) {
				this.logService.error(`update#doCheckForUpdates - could not read ${updatingVersionPath}`, e);
			} finally {
				// updatingVersionPath will be deleted by inno setup.
			}
		} else {
			const fastUpdatesEnabled = this.configurationService.getValue('update.enableWindowsBackgroundUpdates');
			// GC for background updates in system setup happens via inno_setup since it requires
			// elevated permissions.
			if (fastUpdatesEnabled && this.productService.target === 'user' && this.productService.commit) {
				const versionedResourcesFolder = this.productService.commit.substring(0, 10);
				const innoUpdater = path.join(exeDir, versionedResourcesFolder, 'tools', 'inno_updater.exe');
				await new Promise<void>(resolve => {
					const child = spawn(innoUpdater, ['--gc', exePath, versionedResourcesFolder], {
						stdio: ['ignore', 'ignore', 'ignore'],
						windowsHide: true,
						timeout: 2 * 60 * 1000
					});
					child.once('exit', () => resolve());
				});
			}
		}
	}

	protected buildUpdateFeedUrl(quality: string): string | undefined {
		let platform = `win32-${process.arch}`;

		if (getUpdateType() === UpdateType.Archive) {
			platform += '-archive';
		} else if (this.productService.target === 'user') {
			platform += '-user';
		}

		return createUpdateURL(platform, quality, this.productService);
	}

	protected doCheckForUpdates(explicit: boolean): void {
		if (!this.url) {
			return;
		}

		const url = explicit ? this.url : `${this.url}?bg=true`;
		this.setState(State.CheckingForUpdates(explicit));

		this.requestService.request({ url }, CancellationToken.None)
			.then<IUpdate | null>(asJson)
			.then(update => {
				const updateType = getUpdateType();

				if (!update || !update.url || !update.version || !update.productVersion) {
					this.setState(State.Idle(updateType));
					return Promise.resolve(null);
				}

				if (updateType === UpdateType.Archive) {
					this.setState(State.AvailableForDownload(update));
					return Promise.resolve(null);
				}

				this.setState(State.Downloading);

				return this.cleanup(update.version).then(() => {
					return this.getUpdatePackagePath(update.version).then(updatePackagePath => {
						return pfs.Promises.exists(updatePackagePath).then(exists => {
							if (exists) {
								return Promise.resolve(updatePackagePath);
							}

							const downloadPath = `${updatePackagePath}.tmp`;

							return this.requestService.request({ url: update.url }, CancellationToken.None)
								.then(context => this.fileService.writeFile(URI.file(downloadPath), context.stream))
								.then(update.sha256hash ? () => checksum(downloadPath, update.sha256hash) : () => undefined)
								.then(() => pfs.Promises.rename(downloadPath, updatePackagePath, false /* no retry */))
								.then(() => updatePackagePath);
						});
					}).then(packagePath => {
						this.availableUpdate = { packagePath };
						this.setState(State.Downloaded(update));

						const fastUpdatesEnabled = this.configurationService.getValue('update.enableWindowsBackgroundUpdates');
						if (fastUpdatesEnabled) {
							if (this.productService.target === 'user') {
								this.doApplyUpdate();
							}
						} else {
							this.setState(State.Ready(update));
						}
					});
				});
			})
			.then(undefined, err => {
				this.telemetryService.publicLog2<{ messageHash: string }, UpdateErrorClassification>('update:error', { messageHash: String(hash(String(err))) });
				this.logService.error(err);

				// only show message when explicitly checking for updates
				const message: string | undefined = explicit ? (err.message || err) : undefined;
				this.setState(State.Idle(getUpdateType(), message));
			});
	}

	protected override async doDownloadUpdate(state: AvailableForDownload): Promise<void> {
		if (state.update.url) {
			this.nativeHostMainService.openExternal(undefined, state.update.url);
		}
		this.setState(State.Idle(getUpdateType()));
	}

	private async getUpdatePackagePath(version: string): Promise<string> {
		const cachePath = await this.cachePath;
		return path.join(cachePath, `CodeSetup-${this.productService.quality}-${version}.exe`);
	}

	private async cleanup(exceptVersion: string | null = null): Promise<void> {
		const filter = exceptVersion ? (one: string) => !(new RegExp(`${this.productService.quality}-${exceptVersion}\\.exe$`).test(one)) : () => true;

		const cachePath = await this.cachePath;
		const versions = await pfs.Promises.readdir(cachePath);

		const promises = versions.filter(filter).map(async one => {
			try {
				await unlink(path.join(cachePath, one));
			} catch (err) {
				// ignore
			}
		});

		await Promise.all(promises);
	}

	protected override async doApplyUpdate(): Promise<void> {
		if (this.state.type !== StateType.Downloaded) {
			return Promise.resolve(undefined);
		}

		if (!this.availableUpdate) {
			return Promise.resolve(undefined);
		}

		const update = this.state.update;
		this.setState(State.Updating(update));

		const cachePath = await this.cachePath;
		const sessionEndFlagPath = path.join(cachePath, 'session-ending.flag');

		this.availableUpdate.updateFilePath = path.join(cachePath, `CodeSetup-${this.productService.quality}-${update.version}.flag`);

		await pfs.Promises.writeFile(this.availableUpdate.updateFilePath, 'flag');
		const child = spawn(this.availableUpdate.packagePath, ['/verysilent', '/log', `/update="${this.availableUpdate.updateFilePath}"`, `/sessionend="${sessionEndFlagPath}"`, '/nocloseapplications', '/mergetasks=runcode,!desktopicon,!quicklaunchicon'], {
			detached: true,
			stdio: ['ignore', 'ignore', 'ignore'],
			windowsVerbatimArguments: true
		});

		child.once('exit', () => {
			this.availableUpdate = undefined;
			this.setState(State.Idle(getUpdateType()));
		});

		const readyMutexName = `${this.productService.win32MutexName}-ready`;
		const mutex = await import('@vscode/windows-mutex');

		// poll for mutex-ready
		pollUntil(() => mutex.isActive(readyMutexName))
			.then(() => this.setState(State.Ready(update)));
	}

	protected override doQuitAndInstall(): void {
		if (this.state.type !== StateType.Ready || !this.availableUpdate) {
			return;
		}

		this.logService.trace('update#quitAndInstall(): running raw#quitAndInstall()');

		if (this.availableUpdate.updateFilePath) {
			unlinkSync(this.availableUpdate.updateFilePath);
		} else {
			spawn(this.availableUpdate.packagePath, ['/silent', '/log', '/mergetasks=runcode,!desktopicon,!quicklaunchicon'], {
				detached: true,
				stdio: ['ignore', 'ignore', 'ignore']
			});
		}
	}

	protected override getUpdateType(): UpdateType {
		return getUpdateType();
	}

	override async _applySpecificUpdate(packagePath: string): Promise<void> {
		if (this.state.type !== StateType.Idle) {
			return;
		}

		const fastUpdatesEnabled = this.configurationService.getValue('update.enableWindowsBackgroundUpdates');
		const update: IUpdate = { version: 'unknown', productVersion: 'unknown' };

		this.setState(State.Downloading);
		this.availableUpdate = { packagePath };
		this.setState(State.Downloaded(update));

		if (fastUpdatesEnabled) {
			if (this.productService.target === 'user') {
				this.doApplyUpdate();
			}
		} else {
			this.setState(State.Ready(update));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/uriIdentity/common/uriIdentity.ts]---
Location: vscode-main/src/vs/platform/uriIdentity/common/uriIdentity.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IExtUri } from '../../../base/common/resources.js';


export const IUriIdentityService = createDecorator<IUriIdentityService>('IUriIdentityService');

export interface IUriIdentityService {

	readonly _serviceBrand: undefined;

	/**
	 * Uri extensions that are aware of casing.
	 */
	readonly extUri: IExtUri;

	/**
	 * Returns a canonical uri for the given resource. Different uris can point to the same
	 * resource. That's because of casing or missing normalization, e.g the following uris
	 * are different but refer to the same document (because windows paths are not case-sensitive)
	 *
	 * ```txt
	 * file:///c:/foo/bar.txt
	 * file:///c:/FOO/BAR.txt
	 * ```
	 *
	 * This function should be invoked when feeding uris into the system that represent the truth,
	 * e.g document uris or marker-to-document associations etc. This function should NOT be called
	 * to pretty print a label nor to sanitize a uri.
	 *
	 * Samples:
	 *
	 * | in | out | |
	 * |---|---|---|
	 * | `file:///foo/bar/../bar` | `file:///foo/bar` | n/a |
	 * | `file:///foo/bar/../bar#frag` | `file:///foo/bar#frag` | keep fragment |
	 * | `file:///foo/BAR` | `file:///foo/bar` | assume ignore case |
	 * | `file:///foo/bar/../BAR?q=2` | `file:///foo/BAR?q=2` | query makes it a different document |
	 */
	asCanonicalUri(uri: URI): URI;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/uriIdentity/common/uriIdentityService.ts]---
Location: vscode-main/src/vs/platform/uriIdentity/common/uriIdentityService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IUriIdentityService } from './uriIdentity.js';
import { URI } from '../../../base/common/uri.js';
import { InstantiationType, registerSingleton } from '../../instantiation/common/extensions.js';
import { IFileService, FileSystemProviderCapabilities, IFileSystemProviderCapabilitiesChangeEvent, IFileSystemProviderRegistrationEvent } from '../../files/common/files.js';
import { ExtUri, IExtUri, normalizePath } from '../../../base/common/resources.js';
import { Event } from '../../../base/common/event.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { quickSelect } from '../../../base/common/arrays.js';

class Entry {
	static _clock = 0;
	time: number = Entry._clock++;
	constructor(readonly uri: URI) { }
	touch() {
		this.time = Entry._clock++;
		return this;
	}
}

export class UriIdentityService implements IUriIdentityService {

	declare readonly _serviceBrand: undefined;

	readonly extUri: IExtUri;

	private readonly _dispooables = new DisposableStore();
	private readonly _canonicalUris: Map<string, Entry>;
	private readonly _limit = 2 ** 16;

	constructor(@IFileService private readonly _fileService: IFileService) {

		const schemeIgnoresPathCasingCache = new Map<string, boolean>();

		// assume path casing matters unless the file system provider spec'ed the opposite.
		// for all other cases path casing matters, e.g for
		// * virtual documents
		// * in-memory uris
		// * all kind of "private" schemes
		const ignorePathCasing = (uri: URI): boolean => {
			let ignorePathCasing = schemeIgnoresPathCasingCache.get(uri.scheme);
			if (ignorePathCasing === undefined) {
				// retrieve once and then case per scheme until a change happens
				ignorePathCasing = _fileService.hasProvider(uri) && !this._fileService.hasCapability(uri, FileSystemProviderCapabilities.PathCaseSensitive);
				schemeIgnoresPathCasingCache.set(uri.scheme, ignorePathCasing);
			}
			return ignorePathCasing;
		};
		this._dispooables.add(Event.any<IFileSystemProviderCapabilitiesChangeEvent | IFileSystemProviderRegistrationEvent>(
			_fileService.onDidChangeFileSystemProviderRegistrations,
			_fileService.onDidChangeFileSystemProviderCapabilities
		)(e => {
			const oldIgnorePathCasingValue = schemeIgnoresPathCasingCache.get(e.scheme);
			if (oldIgnorePathCasingValue === undefined) {
				return;
			}
			schemeIgnoresPathCasingCache.delete(e.scheme);
			const newIgnorePathCasingValue = ignorePathCasing(URI.from({ scheme: e.scheme }));
			if (newIgnorePathCasingValue === newIgnorePathCasingValue) {
				return;
			}
			for (const [key, entry] of this._canonicalUris.entries()) {
				if (entry.uri.scheme !== e.scheme) {
					continue;
				}
				this._canonicalUris.delete(key);
			}
		}));

		this.extUri = new ExtUri(ignorePathCasing);
		this._canonicalUris = new Map();
	}

	dispose(): void {
		this._dispooables.dispose();
		this._canonicalUris.clear();
	}

	asCanonicalUri(uri: URI): URI {

		// (1) normalize URI
		if (this._fileService.hasProvider(uri)) {
			uri = normalizePath(uri);
		}

		// (2) find the uri in its canonical form or use this uri to define it
		const uriKey = this.extUri.getComparisonKey(uri, true);
		const item = this._canonicalUris.get(uriKey);
		if (item) {
			return item.touch().uri.with({ fragment: uri.fragment });
		}

		// this uri is first and defines the canonical form
		this._canonicalUris.set(uriKey, new Entry(uri));
		this._checkTrim();

		return uri;
	}

	private _checkTrim(): void {
		if (this._canonicalUris.size < this._limit) {
			return;
		}

		Entry._clock = 1;
		const times = [...this._canonicalUris.values()].map(e => e.time);
		const median = quickSelect(
			Math.floor(times.length / 2),
			times,
			(a, b) => a - b);
		for (const [key, entry] of this._canonicalUris.entries()) {
			// Its important to remove the median value here (<= not <).
			// If we have not touched any items since the last trim, the
			// median will be 0 and no items will be removed otherwise.
			if (entry.time <= median) {
				this._canonicalUris.delete(key);
			} else {
				entry.time = 0;
			}
		}
	}
}

registerSingleton(IUriIdentityService, UriIdentityService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/uriIdentity/test/common/uriIdentityService.test.ts]---
Location: vscode-main/src/vs/platform/uriIdentity/test/common/uriIdentityService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { UriIdentityService } from '../../common/uriIdentityService.js';
import { mock } from '../../../../base/test/common/mock.js';
import { IFileService, FileSystemProviderCapabilities } from '../../../files/common/files.js';
import { URI } from '../../../../base/common/uri.js';
import { Event } from '../../../../base/common/event.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('URI Identity', function () {

	class FakeFileService extends mock<IFileService>() {

		override onDidChangeFileSystemProviderCapabilities = Event.None;
		override onDidChangeFileSystemProviderRegistrations = Event.None;

		constructor(readonly data: Map<string, FileSystemProviderCapabilities>) {
			super();
		}
		override hasProvider(uri: URI) {
			return this.data.has(uri.scheme);
		}
		override hasCapability(uri: URI, flag: FileSystemProviderCapabilities): boolean {
			const mask = this.data.get(uri.scheme) ?? 0;
			return Boolean(mask & flag);
		}
	}

	let _service: UriIdentityService;

	setup(function () {
		_service = new UriIdentityService(new FakeFileService(new Map([
			['bar', FileSystemProviderCapabilities.PathCaseSensitive],
			['foo', FileSystemProviderCapabilities.None]
		])));
	});

	teardown(function () {
		_service.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	function assertCanonical(input: URI, expected: URI, service: UriIdentityService = _service) {
		const actual = service.asCanonicalUri(input);
		assert.strictEqual(actual.toString(), expected.toString());
		assert.ok(service.extUri.isEqual(actual, expected));
	}

	test('extUri (isEqual)', function () {
		const a = URI.parse('foo://bar/bang');
		const a1 = URI.parse('foo://bar/BANG');
		const b = URI.parse('bar://bar/bang');
		const b1 = URI.parse('bar://bar/BANG');

		assert.strictEqual(_service.extUri.isEqual(a, a1), true);
		assert.strictEqual(_service.extUri.isEqual(a1, a), true);

		assert.strictEqual(_service.extUri.isEqual(b, b1), false);
		assert.strictEqual(_service.extUri.isEqual(b1, b), false);
	});

	test('asCanonicalUri (casing)', function () {

		const a = URI.parse('foo://bar/bang');
		const a1 = URI.parse('foo://bar/BANG');
		const b = URI.parse('bar://bar/bang');
		const b1 = URI.parse('bar://bar/BANG');

		assertCanonical(a, a);
		assertCanonical(a1, a);

		assertCanonical(b, b);
		assertCanonical(b1, b1); // case sensitive
	});

	test('asCanonicalUri (normalization)', function () {
		const a = URI.parse('foo://bar/bang');
		assertCanonical(a, a);
		assertCanonical(URI.parse('foo://bar/./bang'), a);
		assertCanonical(URI.parse('foo://bar/./bang'), a);
		assertCanonical(URI.parse('foo://bar/./foo/../bang'), a);
	});

	test('asCanonicalUri (keep fragement)', function () {

		const a = URI.parse('foo://bar/bang');

		assertCanonical(a, a);
		assertCanonical(URI.parse('foo://bar/./bang#frag'), a.with({ fragment: 'frag' }));
		assertCanonical(URI.parse('foo://bar/./bang#frag'), a.with({ fragment: 'frag' }));
		assertCanonical(URI.parse('foo://bar/./bang#frag'), a.with({ fragment: 'frag' }));
		assertCanonical(URI.parse('foo://bar/./foo/../bang#frag'), a.with({ fragment: 'frag' }));

		const b = URI.parse('foo://bar/bazz#frag');
		assertCanonical(b, b);
		assertCanonical(URI.parse('foo://bar/bazz'), b.with({ fragment: '' }));
		assertCanonical(URI.parse('foo://bar/BAZZ#DDD'), b.with({ fragment: 'DDD' })); // lower-case path, but fragment is kept
	});

	test('[perf] clears cache when overflown with respect to access time', () => {
		const CACHE_SIZE = 2 ** 16;
		const getUri = (i: number) => URI.parse(`foo://bar/${i}`);

		const FIRST = 0;
		const SECOND = 1;
		const firstCached = _service.asCanonicalUri(getUri(FIRST));
		const secondCached = _service.asCanonicalUri(getUri(SECOND));
		for (let i = 2; i < CACHE_SIZE - 1; i++) {
			_service.asCanonicalUri(getUri(i));
		}

		// Assert that the first URI is still the same object.
		assert.strictEqual(_service.asCanonicalUri(getUri(FIRST)), firstCached);

		// Clear the cache.
		_service.asCanonicalUri(getUri(CACHE_SIZE - 1));

		// First URI should still be the same object.
		assert.strictEqual(_service.asCanonicalUri(getUri(FIRST)), firstCached);
		// But the second URI should be a new object, since it was evicted.
		assert.notStrictEqual(_service.asCanonicalUri(getUri(SECOND)), secondCached);
	});

	test('[perf] preserves order of access time on cache cleanup', () => {
		const SIZE = 2 ** 16;
		const getUri = (i: number) => URI.parse(`foo://bar/${i}`);

		const FIRST = 0;
		const firstCached = _service.asCanonicalUri(getUri(FIRST));
		for (let i = 1; i < SIZE - 2; i++) {
			_service.asCanonicalUri(getUri(i));
		}
		const LAST = SIZE - 2;
		const lastCached = _service.asCanonicalUri(getUri(LAST));

		// Clear the cache.
		_service.asCanonicalUri(getUri(SIZE - 1));

		// Batch 2
		const BATCH2_FIRST = SIZE;
		const batch2FirstCached = _service.asCanonicalUri(getUri(BATCH2_FIRST));
		const BATCH2_SECOND = SIZE + 1;
		const batch2SecondCached = _service.asCanonicalUri(getUri(BATCH2_SECOND));
		const BATCH2_THIRD = SIZE + 2;
		const batch2ThirdCached = _service.asCanonicalUri(getUri(BATCH2_THIRD));
		for (let i = SIZE + 3; i < SIZE + Math.floor(SIZE / 2) - 1; i++) {
			_service.asCanonicalUri(getUri(i));
		}
		const BATCH2_LAST = SIZE + Math.floor(SIZE / 2);
		const batch2LastCached = _service.asCanonicalUri(getUri(BATCH2_LAST));

		// Clean up the cache.
		_service.asCanonicalUri(getUri(SIZE + Math.ceil(SIZE / 2) + 1));

		// Both URIs from the first batch should be evicted.
		assert.notStrictEqual(_service.asCanonicalUri(getUri(FIRST)), firstCached);
		assert.notStrictEqual(_service.asCanonicalUri(getUri(LAST)), lastCached);

		// But the URIs from the second batch should still be the same objects.
		// Except for the first one, which is removed as a median value.
		assert.notStrictEqual(_service.asCanonicalUri(getUri(BATCH2_FIRST)), batch2FirstCached);
		assert.deepStrictEqual(_service.asCanonicalUri(getUri(BATCH2_SECOND)), batch2SecondCached);
		assert.deepStrictEqual(_service.asCanonicalUri(getUri(BATCH2_THIRD)), batch2ThirdCached);
		assert.deepStrictEqual(_service.asCanonicalUri(getUri(BATCH2_LAST)), batch2LastCached);
	});

	test('[perf] CPU pegged after some builds #194853', function () {

		const n = 100 + (2 ** 16);
		for (let i = 0; i < n; i++) {
			const uri = URI.parse(`foo://bar/${i}`);
			const uri2 = _service.asCanonicalUri(uri);

			assert.ok(uri2);
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/url/common/url.ts]---
Location: vscode-main/src/vs/platform/url/common/url.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IURLService = createDecorator<IURLService>('urlService');

export interface IOpenURLOptions {

	/**
	 * If not provided or `false`, signals that the
	 * URL to open did not originate from the product
	 * but outside. As such, a confirmation dialog
	 * might be shown to the user.
	 */
	trusted?: boolean;

	originalUrl?: string;
}

export interface IURLHandler {
	handleURL(uri: URI, options?: IOpenURLOptions): Promise<boolean>;
}

export interface IURLService {

	readonly _serviceBrand: undefined;

	/**
	 * Create a URL that can be called to trigger IURLhandlers.
	 * The URL that gets passed to the IURLHandlers carries over
	 * any of the provided IURLCreateOption values.
	 */
	create(options?: Partial<UriComponents>): URI;

	open(url: URI, options?: IOpenURLOptions): Promise<boolean>;

	registerHandler(handler: IURLHandler): IDisposable;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/url/common/urlIpc.ts]---
Location: vscode-main/src/vs/platform/url/common/urlIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Event } from '../../../base/common/event.js';
import { URI } from '../../../base/common/uri.js';
import { Client, IChannel, IClientRouter, IConnectionHub, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { ILogService } from '../../log/common/log.js';
import { IOpenURLOptions, IURLHandler } from './url.js';

export class URLHandlerChannel implements IServerChannel {

	constructor(private handler: IURLHandler) { }

	listen<T>(_: unknown, event: string): Event<T> {
		throw new Error(`Event not found: ${event}`);
	}

	call(_: unknown, command: string, arg?: any): Promise<any> {
		switch (command) {
			case 'handleURL': return this.handler.handleURL(URI.revive(arg[0]), arg[1]);
		}

		throw new Error(`Call not found: ${command}`);
	}
}

export class URLHandlerChannelClient implements IURLHandler {

	constructor(private channel: IChannel) { }

	handleURL(uri: URI, options?: IOpenURLOptions): Promise<boolean> {
		return this.channel.call('handleURL', [uri.toJSON(), options]);
	}
}

export class URLHandlerRouter implements IClientRouter<string> {

	constructor(
		private next: IClientRouter<string>,
		private readonly logService: ILogService
	) { }

	async routeCall(hub: IConnectionHub<string>, command: string, arg?: any, cancellationToken?: CancellationToken): Promise<Client<string>> {
		if (command !== 'handleURL') {
			throw new Error(`Call not found: ${command}`);
		}

		if (Array.isArray(arg) && arg.length > 0) {
			const uri = URI.revive(arg[0]);

			this.logService.trace('URLHandlerRouter#routeCall() with URI argument', uri.toString(true));

			if (uri.query) {
				const match = /\bwindowId=(\d+)/.exec(uri.query);

				if (match) {
					const windowId = match[1];

					this.logService.trace(`URLHandlerRouter#routeCall(): found windowId query parameter with value "${windowId}"`, uri.toString(true));

					const regex = new RegExp(`window:${windowId}`);
					const connection = hub.connections.find(c => {
						this.logService.trace('URLHandlerRouter#routeCall(): testing connection', c.ctx);

						return regex.test(c.ctx);
					});
					if (connection) {
						this.logService.trace('URLHandlerRouter#routeCall(): found a connection to route', uri.toString(true));

						return connection;
					} else {
						this.logService.trace('URLHandlerRouter#routeCall(): did not find a connection to route', uri.toString(true));
					}
				} else {
					this.logService.trace('URLHandlerRouter#routeCall(): did not find windowId query parameter', uri.toString(true));
				}
			}
		} else {
			this.logService.trace('URLHandlerRouter#routeCall() without URI argument');
		}

		return this.next.routeCall(hub, command, arg, cancellationToken);
	}

	routeEvent(_: IConnectionHub<string>, event: string): Promise<Client<string>> {
		throw new Error(`Event not found: ${event}`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/url/common/urlService.ts]---
Location: vscode-main/src/vs/platform/url/common/urlService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { first } from '../../../base/common/async.js';
import { Disposable, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IProductService } from '../../product/common/productService.js';
import { IOpenURLOptions, IURLHandler, IURLService } from './url.js';

export abstract class AbstractURLService extends Disposable implements IURLService {

	declare readonly _serviceBrand: undefined;

	private handlers = new Set<IURLHandler>();

	abstract create(options?: Partial<UriComponents>): URI;

	open(uri: URI, options?: IOpenURLOptions): Promise<boolean> {
		const handlers = [...this.handlers.values()];
		return first(handlers.map(h => () => h.handleURL(uri, options)), undefined, false).then(val => val || false);
	}

	registerHandler(handler: IURLHandler): IDisposable {
		this.handlers.add(handler);
		return toDisposable(() => this.handlers.delete(handler));
	}
}

export class NativeURLService extends AbstractURLService {

	constructor(
		@IProductService protected readonly productService: IProductService
	) {
		super();
	}

	create(options?: Partial<UriComponents>): URI {
		let { authority, path, query, fragment } = options ? options : { authority: undefined, path: undefined, query: undefined, fragment: undefined };

		if (authority && path && path.indexOf('/') !== 0) {
			path = `/${path}`; // URI validation requires a path if there is an authority
		}

		return URI.from({ scheme: this.productService.urlProtocol, authority, path, query, fragment });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/url/electron-main/electronUrlListener.ts]---
Location: vscode-main/src/vs/platform/url/electron-main/electronUrlListener.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { app, Event as ElectronEvent } from 'electron';
import { disposableTimeout } from '../../../base/common/async.js';
import { Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { isWindows } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { IEnvironmentMainService } from '../../environment/electron-main/environmentMainService.js';
import { ILogService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { IURLService } from '../common/url.js';
import { IProtocolUrl } from './url.js';
import { IWindowsMainService } from '../../windows/electron-main/windows.js';

/**
 * A listener for URLs that are opened from the OS and handled by VSCode.
 * Depending on the platform, this works differently:
 * - Windows: we use `app.setAsDefaultProtocolClient()` to register VSCode with the OS
 *            and additionally add the `open-url` command line argument to identify.
 * - macOS:   we rely on `app.on('open-url')` to be called by the OS
 * - Linux:   we have a special shortcut installed (`resources/linux/code-url-handler.desktop`)
 *            that calls VSCode with the `open-url` command line argument
 *            (https://github.com/microsoft/vscode/pull/56727)
 */
export class ElectronURLListener extends Disposable {

	private uris: IProtocolUrl[] = [];
	private retryCount = 0;

	constructor(
		initialProtocolUrls: IProtocolUrl[] | undefined,
		private readonly urlService: IURLService,
		windowsMainService: IWindowsMainService,
		environmentMainService: IEnvironmentMainService,
		productService: IProductService,
		private readonly logService: ILogService
	) {
		super();

		if (initialProtocolUrls) {
			logService.trace('ElectronURLListener initialUrisToHandle:', initialProtocolUrls.map(url => url.originalUrl));

			// the initial set of URIs we need to handle once the window is ready
			this.uris = initialProtocolUrls;
		}

		// Windows: install as protocol handler
		if (isWindows) {
			const windowsParameters = environmentMainService.isBuilt ? [] : [`"${environmentMainService.appRoot}"`];
			windowsParameters.push('--open-url', '--');
			app.setAsDefaultProtocolClient(productService.urlProtocol, process.execPath, windowsParameters);
		}

		// macOS: listen to `open-url` events from here on to handle
		const onOpenElectronUrl = Event.map(
			Event.fromNodeEventEmitter(app, 'open-url', (event: ElectronEvent, url: string) => ({ event, url })),
			({ event, url }) => {
				event.preventDefault(); // always prevent default and return the url as string

				return url;
			});

		this._register(onOpenElectronUrl(url => {
			const uri = this.uriFromRawUrl(url);
			if (!uri) {
				return;
			}

			this.urlService.open(uri, { originalUrl: url });
		}));

		// Send initial links to the window once it has loaded
		const isWindowReady = windowsMainService.getWindows()
			.filter(window => window.isReady)
			.length > 0;

		if (isWindowReady) {
			logService.trace('ElectronURLListener: window is ready to handle URLs');

			this.flush();
		} else {
			logService.trace('ElectronURLListener: waiting for window to be ready to handle URLs...');

			this._register(Event.once(windowsMainService.onDidSignalReadyWindow)(() => this.flush()));
		}
	}

	private uriFromRawUrl(url: string): URI | undefined {
		try {
			return URI.parse(url);
		} catch (e) {
			return undefined;
		}
	}

	private async flush(): Promise<void> {
		if (this.retryCount++ > 10) {
			this.logService.trace('ElectronURLListener#flush(): giving up after 10 retries');

			return;
		}

		this.logService.trace('ElectronURLListener#flush(): flushing URLs');

		const uris: IProtocolUrl[] = [];

		for (const obj of this.uris) {
			const handled = await this.urlService.open(obj.uri, { originalUrl: obj.originalUrl });
			if (handled) {
				this.logService.trace('ElectronURLListener#flush(): URL was handled', obj.originalUrl);
			} else {
				this.logService.trace('ElectronURLListener#flush(): URL was not yet handled', obj.originalUrl);

				uris.push(obj);
			}
		}

		if (uris.length === 0) {
			return;
		}

		this.uris = uris;
		disposableTimeout(() => this.flush(), 500, this._store);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/url/electron-main/url.ts]---
Location: vscode-main/src/vs/platform/url/electron-main/url.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { IWindowOpenable } from '../../window/common/window.js';

export interface IProtocolUrl {

	/**
	 * The parsed URI from the raw URL.
	 */
	uri: URI;

	/**
	 * The raw URL that was passed in.
	 */
	originalUrl: string;
}

/**
 * A special set of protocol URLs that are to be handled
 * right on startup. Handling is complex depending on the
 * form of the protocol URL:
 *
 * On the high level, there are 2 types of protocol URLs:
 * - those that need to be handled within a window because
 *   they need to be forwarded to an extension for example
 * - those that can be handled directly as window to open
 *
 * The former can be of the form:
 * ```
 * <protocol>://<extension.id>/<path>
 * ```
 * and the latter are of the form
 *
 * ```
 * <protocol>:/<file | vscode-remote>/<path>
 * ```
 *
 * On top of that, protocol URLs can indicate to be handled in
 * a new empty window or not via the `windowId` parameter. If that
 * parameter is set to `_blank`, the URL should be handled not in
 * the existing window but a new window. This is only supported
 * for protocol URLs that need to be handled within a window.
 *
 * This interface splits the protocol links up into the 2 groups:
 * - `urls` are the protocol URLs that need to be handled in a window
 * - `openables` are windows that should open for the protocol URLs
 *
 * The decision is made as follows:
 * - a URL with authority `file` or `vscode-remote` becomes an `IWindowOpenable`
 *   and will not be included in the `urls` array because it was fully handled
 * - a URL with any other authority will be added to the `urls` array
 */
export interface IInitialProtocolUrls {

	/**
	 * Initial protocol URLs to handle that are not
	 * already converted to `IWindowOpenable` window
	 * instances.
	 *
	 * These URLs will be handled by the URL service
	 * in the active or a new empty window (if `windowId`
	 * is set to `_blank`).
	 */
	readonly urls: IProtocolUrl[];

	/**
	 * Initial protocol URLs that result in direct
	 * windows to open.
	 */
	readonly openables: IWindowOpenable[];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userData/common/fileUserDataProvider.ts]---
Location: vscode-main/src/vs/platform/userData/common/fileUserDataProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { IFileSystemProviderWithFileReadWriteCapability, IFileChange, IWatchOptions, IStat, IFileOverwriteOptions, FileType, IFileWriteOptions, IFileDeleteOptions, FileSystemProviderCapabilities, IFileSystemProviderWithFileReadStreamCapability, IFileReadStreamOptions, IFileSystemProviderWithFileAtomicReadCapability, hasFileFolderCopyCapability, IFileSystemProviderWithOpenReadWriteCloseCapability, IFileOpenOptions, IFileSystemProviderWithFileAtomicWriteCapability, IFileSystemProviderWithFileAtomicDeleteCapability, IFileSystemProviderWithFileFolderCopyCapability, IFileSystemProviderWithFileCloneCapability, hasFileCloneCapability, IFileAtomicReadOptions, IFileAtomicOptions } from '../../files/common/files.js';
import { URI } from '../../../base/common/uri.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { ReadableStreamEvents } from '../../../base/common/stream.js';
import { ILogService } from '../../log/common/log.js';
import { TernarySearchTree } from '../../../base/common/ternarySearchTree.js';
import { IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { ResourceSet } from '../../../base/common/map.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';

/**
 * This is a wrapper on top of the local filesystem provider which will
 * 	- Convert the user data resources to file system scheme and vice-versa
 *  - Enforces atomic reads for user data
 */
export class FileUserDataProvider extends Disposable implements
	IFileSystemProviderWithFileReadWriteCapability,
	IFileSystemProviderWithOpenReadWriteCloseCapability,
	IFileSystemProviderWithFileReadStreamCapability,
	IFileSystemProviderWithFileFolderCopyCapability,
	IFileSystemProviderWithFileAtomicReadCapability,
	IFileSystemProviderWithFileAtomicWriteCapability,
	IFileSystemProviderWithFileAtomicDeleteCapability,
	IFileSystemProviderWithFileCloneCapability {

	readonly capabilities: FileSystemProviderCapabilities;
	readonly onDidChangeCapabilities: Event<void>;

	private readonly _onDidChangeFile: Emitter<readonly IFileChange[]>;
	readonly onDidChangeFile: Event<readonly IFileChange[]>;

	private readonly watchResources: TernarySearchTree<URI, URI>;
	private readonly atomicReadWriteResources: ResourceSet;

	constructor(
		private readonly fileSystemScheme: string,
		private readonly fileSystemProvider: IFileSystemProviderWithFileReadWriteCapability & IFileSystemProviderWithOpenReadWriteCloseCapability & IFileSystemProviderWithFileReadStreamCapability & IFileSystemProviderWithFileAtomicReadCapability & IFileSystemProviderWithFileAtomicWriteCapability & IFileSystemProviderWithFileAtomicDeleteCapability,
		private readonly userDataScheme: string,
		private readonly userDataProfilesService: IUserDataProfilesService,
		private readonly uriIdentityService: IUriIdentityService,
		private readonly logService: ILogService,
	) {
		super();
		this.capabilities = this.fileSystemProvider.capabilities;
		this.onDidChangeCapabilities = this.fileSystemProvider.onDidChangeCapabilities;
		this._onDidChangeFile = this._register(new Emitter());
		this.onDidChangeFile = this._onDidChangeFile.event;
		this.watchResources = TernarySearchTree.forUris(() => !(this.capabilities & 1024 /* FileSystemProviderCapabilities.PathCaseSensitive */));
		this.atomicReadWriteResources = new ResourceSet((uri) => this.uriIdentityService.extUri.getComparisonKey(this.toFileSystemResource(uri)));
		this.updateAtomicReadWritesResources();
		this._register(userDataProfilesService.onDidChangeProfiles(() => this.updateAtomicReadWritesResources()));
		this._register(this.fileSystemProvider.onDidChangeFile(e => this.handleFileChanges(e)));
	}

	private updateAtomicReadWritesResources(): void {
		this.atomicReadWriteResources.clear();
		for (const profile of this.userDataProfilesService.profiles) {
			this.atomicReadWriteResources.add(profile.settingsResource);
			this.atomicReadWriteResources.add(profile.keybindingsResource);
			this.atomicReadWriteResources.add(profile.tasksResource);
			this.atomicReadWriteResources.add(profile.extensionsResource);
		}
	}

	open(resource: URI, opts: IFileOpenOptions): Promise<number> {
		return this.fileSystemProvider.open(this.toFileSystemResource(resource), opts);
	}

	close(fd: number): Promise<void> {
		return this.fileSystemProvider.close(fd);
	}

	read(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {
		return this.fileSystemProvider.read(fd, pos, data, offset, length);
	}

	write(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {
		return this.fileSystemProvider.write(fd, pos, data, offset, length);
	}

	watch(resource: URI, opts: IWatchOptions): IDisposable {
		this.watchResources.set(resource, resource);
		const disposable = this.fileSystemProvider.watch(this.toFileSystemResource(resource), opts);
		return toDisposable(() => {
			this.watchResources.delete(resource);
			disposable.dispose();
		});
	}

	stat(resource: URI): Promise<IStat> {
		return this.fileSystemProvider.stat(this.toFileSystemResource(resource));
	}

	mkdir(resource: URI): Promise<void> {
		return this.fileSystemProvider.mkdir(this.toFileSystemResource(resource));
	}

	rename(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> {
		return this.fileSystemProvider.rename(this.toFileSystemResource(from), this.toFileSystemResource(to), opts);
	}

	readFile(resource: URI, opts?: IFileAtomicReadOptions): Promise<Uint8Array> {
		return this.fileSystemProvider.readFile(this.toFileSystemResource(resource), opts);
	}

	readFileStream(resource: URI, opts: IFileReadStreamOptions, token: CancellationToken): ReadableStreamEvents<Uint8Array> {
		return this.fileSystemProvider.readFileStream(this.toFileSystemResource(resource), opts, token);
	}

	readdir(resource: URI): Promise<[string, FileType][]> {
		return this.fileSystemProvider.readdir(this.toFileSystemResource(resource));
	}

	enforceAtomicReadFile(resource: URI): boolean {
		return this.atomicReadWriteResources.has(resource);
	}

	writeFile(resource: URI, content: Uint8Array, opts: IFileWriteOptions): Promise<void> {
		return this.fileSystemProvider.writeFile(this.toFileSystemResource(resource), content, opts);
	}

	enforceAtomicWriteFile(resource: URI): IFileAtomicOptions | false {
		if (this.atomicReadWriteResources.has(resource)) {
			return { postfix: '.vsctmp' };
		}

		return false;
	}

	delete(resource: URI, opts: IFileDeleteOptions): Promise<void> {
		return this.fileSystemProvider.delete(this.toFileSystemResource(resource), opts);
	}

	copy(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> {
		if (hasFileFolderCopyCapability(this.fileSystemProvider)) {
			return this.fileSystemProvider.copy(this.toFileSystemResource(from), this.toFileSystemResource(to), opts);
		}
		throw new Error('copy not supported');
	}

	cloneFile(from: URI, to: URI): Promise<void> {
		if (hasFileCloneCapability(this.fileSystemProvider)) {
			return this.fileSystemProvider.cloneFile(this.toFileSystemResource(from), this.toFileSystemResource(to));
		}
		throw new Error('clone not supported');
	}

	private handleFileChanges(changes: readonly IFileChange[]): void {
		const userDataChanges: IFileChange[] = [];
		for (const change of changes) {
			if (change.resource.scheme !== this.fileSystemScheme) {
				continue; // only interested in file schemes
			}

			const userDataResource = this.toUserDataResource(change.resource);
			if (this.watchResources.findSubstr(userDataResource)) {
				userDataChanges.push({
					resource: userDataResource,
					type: change.type,
					cId: change.cId
				});
			}
		}
		if (userDataChanges.length) {
			this.logService.debug('User data changed');
			this._onDidChangeFile.fire(userDataChanges);
		}
	}

	private toFileSystemResource(userDataResource: URI): URI {
		return userDataResource.with({ scheme: this.fileSystemScheme });
	}

	private toUserDataResource(fileSystemResource: URI): URI {
		return fileSystemResource.with({ scheme: this.userDataScheme });
	}

}
```

--------------------------------------------------------------------------------

````
