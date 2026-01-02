---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 526
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 526 of 552)

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

---[FILE: src/vs/workbench/services/remote/common/tunnelModel.ts]---
Location: vscode-main/src/vs/workbench/services/remote/common/tunnelModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { debounce } from '../../../../base/common/decorators.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { hash } from '../../../../base/common/hash.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IAddressProvider } from '../../../../platform/remote/common/remoteAgentConnection.js';
import { IRemoteAuthorityResolverService, TunnelDescription } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { RemoteTunnel, ITunnelService, TunnelProtocol, TunnelPrivacyId, LOCALHOST_ADDRESSES, ProvidedPortAttributes, PortAttributesProvider, isLocalhost, isAllInterfaces, ProvidedOnAutoForward, ALL_INTERFACES_ADDRESSES } from '../../../../platform/tunnel/common/tunnel.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { isNumber, isObject, isString } from '../../../../base/common/types.js';
import { deepClone } from '../../../../base/common/objects.js';
import { IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';

const MISMATCH_LOCAL_PORT_COOLDOWN = 10 * 1000; // 10 seconds
const TUNNELS_TO_RESTORE = 'remote.tunnels.toRestore';
const TUNNELS_TO_RESTORE_EXPIRATION = 'remote.tunnels.toRestoreExpiration';
const RESTORE_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 14; // 2 weeks
export const ACTIVATION_EVENT = 'onTunnel';
export const forwardedPortsFeaturesEnabled = new RawContextKey<boolean>('forwardedPortsViewEnabled', false, nls.localize('tunnel.forwardedPortsViewEnabled', "Whether the Ports view is enabled."));
export const forwardedPortsViewEnabled = new RawContextKey<boolean>('forwardedPortsViewOnlyEnabled', false, nls.localize('tunnel.forwardedPortsViewEnabled', "Whether the Ports view is enabled."));

export interface RestorableTunnel {
	remoteHost: string;
	remotePort: number;
	localAddress: string;
	localUri: URI;
	protocol: TunnelProtocol;
	localPort?: number;
	name?: string;
	source: {
		source: TunnelSource;
		description: string;
	};
}

export interface Tunnel {
	remoteHost: string;
	remotePort: number;
	localAddress: string;
	localUri: URI;
	protocol: TunnelProtocol;
	localPort?: number;
	name?: string;
	closeable?: boolean;
	privacy: TunnelPrivacyId | string;
	runningProcess: string | undefined;
	hasRunningProcess?: boolean;
	pid: number | undefined;
	source: {
		source: TunnelSource;
		description: string;
	};
}

export function parseAddress(address: string): { host: string; port: number } | undefined {
	const matches = address.match(/^([a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*:)?([0-9]+)$/);
	if (!matches) {
		return undefined;
	}
	return { host: matches[1]?.substring(0, matches[1].length - 1) || 'localhost', port: Number(matches[2]) };
}

export enum TunnelCloseReason {
	Other = 'Other',
	User = 'User',
	AutoForwardEnd = 'AutoForwardEnd',
}

export enum TunnelSource {
	User,
	Auto,
	Extension
}

export const UserTunnelSource = {
	source: TunnelSource.User,
	description: nls.localize('tunnel.source.user', "User Forwarded")
};
export const AutoTunnelSource = {
	source: TunnelSource.Auto,
	description: nls.localize('tunnel.source.auto', "Auto Forwarded")
};

export function mapHasAddress<T>(map: Map<string, T>, host: string, port: number): T | undefined {
	const initialAddress = map.get(makeAddress(host, port));
	if (initialAddress) {
		return initialAddress;
	}

	if (isLocalhost(host)) {
		// Do localhost checks
		for (const testHost of LOCALHOST_ADDRESSES) {
			const testAddress = makeAddress(testHost, port);
			if (map.has(testAddress)) {
				return map.get(testAddress);
			}
		}
	} else if (isAllInterfaces(host)) {
		// Do all interfaces checks
		for (const testHost of ALL_INTERFACES_ADDRESSES) {
			const testAddress = makeAddress(testHost, port);
			if (map.has(testAddress)) {
				return map.get(testAddress);
			}
		}
	}

	return undefined;
}

export function mapHasAddressLocalhostOrAllInterfaces<T>(map: Map<string, T>, host: string, port: number): T | undefined {
	const originalAddress = mapHasAddress(map, host, port);
	if (originalAddress) {
		return originalAddress;
	}
	const otherHost = isAllInterfaces(host) ? 'localhost' : (isLocalhost(host) ? '0.0.0.0' : undefined);
	if (otherHost) {
		return mapHasAddress(map, otherHost, port);
	}
	return undefined;
}


export function makeAddress(host: string, port: number): string {
	return host + ':' + port;
}

export interface TunnelProperties {
	remote: { host: string; port: number };
	local?: number;
	name?: string;
	source?: {
		source: TunnelSource;
		description: string;
	};
	elevateIfNeeded?: boolean;
	privacy?: string;
}

export interface CandidatePort {
	host: string;
	port: number;
	detail?: string;
	pid?: number;
}

interface PortAttributes extends Attributes {
	key: number | PortRange | RegExp | HostAndPort;
}

export enum OnPortForward {
	Notify = 'notify',
	OpenBrowser = 'openBrowser',
	OpenBrowserOnce = 'openBrowserOnce',
	OpenPreview = 'openPreview',
	Silent = 'silent',
	Ignore = 'ignore'
}

export interface Attributes {
	label: string | undefined;
	onAutoForward: OnPortForward | undefined;
	elevateIfNeeded: boolean | undefined;
	requireLocalPort: boolean | undefined;
	protocol: TunnelProtocol | undefined;
}

interface PortRange { start: number; end: number }

interface HostAndPort { host: string; port: number }

export function isCandidatePort(candidate: any): candidate is CandidatePort {
	return candidate && 'host' in candidate && typeof candidate.host === 'string'
		&& 'port' in candidate && typeof candidate.port === 'number'
		&& (!('detail' in candidate) || typeof candidate.detail === 'string')
		&& (!('pid' in candidate) || typeof candidate.pid === 'string');
}

export class PortsAttributes extends Disposable {
	private static SETTING = 'remote.portsAttributes';
	private static DEFAULTS = 'remote.otherPortsAttributes';
	private static RANGE = /^(\d+)\-(\d+)$/;
	private static HOST_AND_PORT = /^([a-z0-9\-]+):(\d{1,5})$/;
	private portsAttributes: PortAttributes[] = [];
	private defaultPortAttributes: Attributes | undefined;
	private _onDidChangeAttributes = new Emitter<void>();
	public readonly onDidChangeAttributes = this._onDidChangeAttributes.event;

	constructor(private readonly configurationService: IConfigurationService) {
		super();
		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(PortsAttributes.SETTING) || e.affectsConfiguration(PortsAttributes.DEFAULTS)) {
				this.updateAttributes();
			}
		}));
		this.updateAttributes();
	}

	private updateAttributes() {
		this.portsAttributes = this.readSetting();
		this._onDidChangeAttributes.fire();
	}

	getAttributes(port: number, host: string, commandLine?: string): Attributes | undefined {
		let index = this.findNextIndex(port, host, commandLine, this.portsAttributes, 0);
		const attributes: Attributes = {
			label: undefined,
			onAutoForward: undefined,
			elevateIfNeeded: undefined,
			requireLocalPort: undefined,
			protocol: undefined
		};
		while (index >= 0) {
			const found = this.portsAttributes[index];
			if (found.key === port) {
				attributes.onAutoForward = found.onAutoForward ?? attributes.onAutoForward;
				attributes.elevateIfNeeded = (found.elevateIfNeeded !== undefined) ? found.elevateIfNeeded : attributes.elevateIfNeeded;
				attributes.label = found.label ?? attributes.label;
				attributes.requireLocalPort = found.requireLocalPort;
				attributes.protocol = found.protocol;
			} else {
				// It's a range or regex, which means that if the attribute is already set, we keep it
				attributes.onAutoForward = attributes.onAutoForward ?? found.onAutoForward;
				attributes.elevateIfNeeded = (attributes.elevateIfNeeded !== undefined) ? attributes.elevateIfNeeded : found.elevateIfNeeded;
				attributes.label = attributes.label ?? found.label;
				attributes.requireLocalPort = (attributes.requireLocalPort !== undefined) ? attributes.requireLocalPort : undefined;
				attributes.protocol = attributes.protocol ?? found.protocol;
			}
			index = this.findNextIndex(port, host, commandLine, this.portsAttributes, index + 1);
		}
		if (attributes.onAutoForward !== undefined || attributes.elevateIfNeeded !== undefined
			|| attributes.label !== undefined || attributes.requireLocalPort !== undefined
			|| attributes.protocol !== undefined) {
			return attributes;
		}

		// If we find no matches, then use the other port attributes.
		return this.getOtherAttributes();
	}

	private hasStartEnd(value: number | PortRange | RegExp | HostAndPort): value is PortRange {
		return (value as Partial<PortRange>).start !== undefined && (value as Partial<PortRange>).end !== undefined;
	}

	private hasHostAndPort(value: number | PortRange | RegExp | HostAndPort): value is HostAndPort {
		return ((value as Partial<HostAndPort>).host !== undefined) && ((value as Partial<HostAndPort>).port !== undefined)
			&& isString((value as Partial<HostAndPort>).host) && isNumber((value as Partial<HostAndPort>).port);
	}

	private findNextIndex(port: number, host: string, commandLine: string | undefined, attributes: PortAttributes[], fromIndex: number): number {
		if (fromIndex >= attributes.length) {
			return -1;
		}
		const shouldUseHost = !isLocalhost(host) && !isAllInterfaces(host);
		const sliced = attributes.slice(fromIndex);
		const foundIndex = sliced.findIndex((value) => {
			if (isNumber(value.key)) {
				return shouldUseHost ? false : value.key === port;
			} else if (this.hasStartEnd(value.key)) {
				return shouldUseHost ? false : (port >= value.key.start && port <= value.key.end);
			} else if (this.hasHostAndPort(value.key)) {
				return (port === value.key.port) && (host === value.key.host);
			} else {
				return commandLine ? value.key.test(commandLine) : false;
			}

		});
		return foundIndex >= 0 ? foundIndex + fromIndex : -1;
	}

	private readSetting(): PortAttributes[] {
		const settingValue = this.configurationService.getValue(PortsAttributes.SETTING);
		if (!settingValue || !isObject(settingValue)) {
			return [];
		}

		const attributes: PortAttributes[] = [];
		for (const attributesKey in settingValue) {
			if (attributesKey === undefined) {
				continue;
			}
			const setting = (settingValue as Record<string, PortAttributes>)[attributesKey];
			let key: number | PortRange | RegExp | HostAndPort | undefined = undefined;
			if (Number(attributesKey)) {
				key = Number(attributesKey);
			} else if (isString(attributesKey)) {
				if (PortsAttributes.RANGE.test(attributesKey)) {
					const match = attributesKey.match(PortsAttributes.RANGE);
					key = { start: Number(match![1]), end: Number(match![2]) };
				} else if (PortsAttributes.HOST_AND_PORT.test(attributesKey)) {
					const match = attributesKey.match(PortsAttributes.HOST_AND_PORT);
					key = { host: match![1], port: Number(match![2]) };
				} else {
					let regTest: RegExp | undefined = undefined;
					try {
						regTest = RegExp(attributesKey);
					} catch (e) {
						// The user entered an invalid regular expression.
					}
					if (regTest) {
						key = regTest;
					}
				}
			}
			if (!key) {
				continue;
			}
			attributes.push({
				key: key,
				elevateIfNeeded: setting.elevateIfNeeded,
				onAutoForward: setting.onAutoForward,
				label: setting.label,
				requireLocalPort: setting.requireLocalPort,
				protocol: setting.protocol
			});
		}

		const defaults = this.configurationService.getValue(PortsAttributes.DEFAULTS) as Partial<Attributes> | undefined;
		if (defaults) {
			this.defaultPortAttributes = {
				elevateIfNeeded: defaults.elevateIfNeeded,
				label: defaults.label,
				onAutoForward: defaults.onAutoForward,
				requireLocalPort: defaults.requireLocalPort,
				protocol: defaults.protocol
			};
		}

		return this.sortAttributes(attributes);
	}

	private sortAttributes(attributes: PortAttributes[]): PortAttributes[] {
		function getVal(item: PortAttributes, thisRef: PortsAttributes) {
			if (isNumber(item.key)) {
				return item.key;
			} else if (thisRef.hasStartEnd(item.key)) {
				return item.key.start;
			} else if (thisRef.hasHostAndPort(item.key)) {
				return item.key.port;
			} else {
				return Number.MAX_VALUE;
			}
		}

		return attributes.sort((a, b) => {
			return getVal(a, this) - getVal(b, this);
		});
	}

	private getOtherAttributes() {
		return this.defaultPortAttributes;
	}

	static providedActionToAction(providedAction: ProvidedOnAutoForward | undefined) {
		switch (providedAction) {
			case ProvidedOnAutoForward.Notify: return OnPortForward.Notify;
			case ProvidedOnAutoForward.OpenBrowser: return OnPortForward.OpenBrowser;
			case ProvidedOnAutoForward.OpenBrowserOnce: return OnPortForward.OpenBrowserOnce;
			case ProvidedOnAutoForward.OpenPreview: return OnPortForward.OpenPreview;
			case ProvidedOnAutoForward.Silent: return OnPortForward.Silent;
			case ProvidedOnAutoForward.Ignore: return OnPortForward.Ignore;
			default: return undefined;
		}
	}

	public async addAttributes(port: number, attributes: Partial<Attributes>, target: ConfigurationTarget) {
		const settingValue = this.configurationService.inspect(PortsAttributes.SETTING);
		const remoteValue: any = settingValue.userRemoteValue;
		let newRemoteValue: any;
		if (!remoteValue || !isObject(remoteValue)) {
			newRemoteValue = {};
		} else {
			newRemoteValue = deepClone(remoteValue);
		}

		if (!newRemoteValue[`${port}`]) {
			newRemoteValue[`${port}`] = {};
		}
		for (const attribute in attributes) {
			newRemoteValue[`${port}`][attribute] = (attributes as Record<string, unknown>)[attribute];
		}

		return this.configurationService.updateValue(PortsAttributes.SETTING, newRemoteValue, target);
	}
}

export class TunnelModel extends Disposable {
	readonly forwarded: Map<string, Tunnel>;
	private readonly inProgress: Map<string, true> = new Map();
	readonly detected: Map<string, Tunnel>;
	private remoteTunnels: Map<string, RemoteTunnel>;
	private _onForwardPort: Emitter<Tunnel | void> = new Emitter();
	public onForwardPort: Event<Tunnel | void> = this._onForwardPort.event;
	private _onClosePort: Emitter<{ host: string; port: number }> = new Emitter();
	public onClosePort: Event<{ host: string; port: number }> = this._onClosePort.event;
	private _onPortName: Emitter<{ host: string; port: number }> = new Emitter();
	public onPortName: Event<{ host: string; port: number }> = this._onPortName.event;
	private _candidates: Map<string, CandidatePort> | undefined;
	private _onCandidatesChanged: Emitter<Map<string, { host: string; port: number }>> = new Emitter();
	// onCandidateChanged returns the removed candidates
	public onCandidatesChanged: Event<Map<string, { host: string; port: number }>> = this._onCandidatesChanged.event;
	private _candidateFilter: ((candidates: CandidatePort[]) => Promise<CandidatePort[]>) | undefined;
	private tunnelRestoreValue: Promise<string | undefined>;
	private _onEnvironmentTunnelsSet: Emitter<void> = new Emitter();
	public onEnvironmentTunnelsSet: Event<void> = this._onEnvironmentTunnelsSet.event;
	private _environmentTunnelsSet: boolean = false;
	public readonly configPortsAttributes: PortsAttributes;
	private restoreListener: DisposableStore | undefined = undefined;
	private knownPortsRestoreValue: string | undefined;
	private restoreComplete = false;
	private onRestoreComplete: Emitter<void> = new Emitter();
	private unrestoredExtensionTunnels: Map<string, RestorableTunnel> = new Map();
	private sessionCachedProperties: Map<string, Partial<TunnelProperties>> = new Map();

	private portAttributesProviders: PortAttributesProvider[] = [];

	constructor(
		@ITunnelService private readonly tunnelService: ITunnelService,
		@IStorageService private readonly storageService: IStorageService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IRemoteAuthorityResolverService private readonly remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@ILogService private readonly logService: ILogService,
		@IDialogService private readonly dialogService: IDialogService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService
	) {
		super();
		this.configPortsAttributes = new PortsAttributes(configurationService);
		this.tunnelRestoreValue = this.getTunnelRestoreValue();
		this._register(this.configPortsAttributes.onDidChangeAttributes(this.updateAttributes, this));
		this.forwarded = new Map();
		this.remoteTunnels = new Map();
		this.tunnelService.tunnels.then(async (tunnels) => {
			const attributes = await this.getAttributes(tunnels.map(tunnel => {
				return { port: tunnel.tunnelRemotePort, host: tunnel.tunnelRemoteHost };
			}));
			for (const tunnel of tunnels) {
				if (tunnel.localAddress) {
					const key = makeAddress(tunnel.tunnelRemoteHost, tunnel.tunnelRemotePort);
					const matchingCandidate = mapHasAddressLocalhostOrAllInterfaces(this._candidates ?? new Map(), tunnel.tunnelRemoteHost, tunnel.tunnelRemotePort);
					this.forwarded.set(key, {
						remotePort: tunnel.tunnelRemotePort,
						remoteHost: tunnel.tunnelRemoteHost,
						localAddress: tunnel.localAddress,
						protocol: attributes?.get(tunnel.tunnelRemotePort)?.protocol ?? TunnelProtocol.Http,
						localUri: await this.makeLocalUri(tunnel.localAddress, attributes?.get(tunnel.tunnelRemotePort)),
						localPort: tunnel.tunnelLocalPort,
						name: attributes?.get(tunnel.tunnelRemotePort)?.label,
						runningProcess: matchingCandidate?.detail,
						hasRunningProcess: !!matchingCandidate,
						pid: matchingCandidate?.pid,
						privacy: tunnel.privacy,
						source: UserTunnelSource,
					});
					this.remoteTunnels.set(key, tunnel);
				}
			}
		});

		this.detected = new Map();
		this._register(this.tunnelService.onTunnelOpened(async (tunnel) => {
			const key = makeAddress(tunnel.tunnelRemoteHost, tunnel.tunnelRemotePort);
			if (!mapHasAddressLocalhostOrAllInterfaces(this.forwarded, tunnel.tunnelRemoteHost, tunnel.tunnelRemotePort)
				&& !mapHasAddressLocalhostOrAllInterfaces(this.detected, tunnel.tunnelRemoteHost, tunnel.tunnelRemotePort)
				&& !mapHasAddressLocalhostOrAllInterfaces(this.inProgress, tunnel.tunnelRemoteHost, tunnel.tunnelRemotePort)
				&& tunnel.localAddress) {
				const matchingCandidate = mapHasAddressLocalhostOrAllInterfaces(this._candidates ?? new Map(), tunnel.tunnelRemoteHost, tunnel.tunnelRemotePort);
				const attributes = (await this.getAttributes([{ port: tunnel.tunnelRemotePort, host: tunnel.tunnelRemoteHost }]))?.get(tunnel.tunnelRemotePort);
				this.forwarded.set(key, {
					remoteHost: tunnel.tunnelRemoteHost,
					remotePort: tunnel.tunnelRemotePort,
					localAddress: tunnel.localAddress,
					protocol: attributes?.protocol ?? TunnelProtocol.Http,
					localUri: await this.makeLocalUri(tunnel.localAddress, attributes),
					localPort: tunnel.tunnelLocalPort,
					name: attributes?.label,
					closeable: true,
					runningProcess: matchingCandidate?.detail,
					hasRunningProcess: !!matchingCandidate,
					pid: matchingCandidate?.pid,
					privacy: tunnel.privacy,
					source: UserTunnelSource,
				});
			}
			await this.storeForwarded();
			this.checkExtensionActivationEvents(true);
			this.remoteTunnels.set(key, tunnel);
			this._onForwardPort.fire(this.forwarded.get(key)!);
		}));
		this._register(this.tunnelService.onTunnelClosed(address => {
			return this.onTunnelClosed(address, TunnelCloseReason.Other);
		}));
		this.checkExtensionActivationEvents(false);
	}

	private extensionHasActivationEvent() {
		if (this.extensionService.extensions.find(extension => extension.activationEvents?.includes(ACTIVATION_EVENT))) {
			this.contextKeyService.createKey(forwardedPortsViewEnabled.key, true);
			return true;
		}
		return false;
	}

	private hasCheckedExtensionsOnTunnelOpened = false;
	private checkExtensionActivationEvents(tunnelOpened: boolean) {
		if (this.hasCheckedExtensionsOnTunnelOpened) {
			return;
		}
		if (tunnelOpened) {
			this.hasCheckedExtensionsOnTunnelOpened = true;
		}
		const hasRemote = this.environmentService.remoteAuthority !== undefined;
		if (hasRemote && !tunnelOpened) {
			// We don't activate extensions on startup if there is a remote
			return;
		}
		if (this.extensionHasActivationEvent()) {
			return;
		}

		const activationDisposable = this._register(this.extensionService.onDidRegisterExtensions(() => {
			if (this.extensionHasActivationEvent()) {
				activationDisposable.dispose();
			}
		}));
	}

	private async onTunnelClosed(address: { host: string; port: number }, reason: TunnelCloseReason) {
		const key = makeAddress(address.host, address.port);
		if (this.forwarded.delete(key)) {
			await this.storeForwarded();
			this._onClosePort.fire(address);
		}
	}

	private makeLocalUri(localAddress: string, attributes?: Attributes) {
		if (localAddress.startsWith('http')) {
			return URI.parse(localAddress);
		}
		const protocol = attributes?.protocol ?? 'http';
		return URI.parse(`${protocol}://${localAddress}`);
	}

	private async addStorageKeyPostfix(prefix: string): Promise<string | undefined> {
		const workspace = this.workspaceContextService.getWorkspace();
		const workspaceHash = workspace.configuration ? hash(workspace.configuration.path) : (workspace.folders.length > 0 ? hash(workspace.folders[0].uri.path) : undefined);
		if (workspaceHash === undefined) {
			this.logService.debug('Could not get workspace hash for forwarded ports storage key.');
			return undefined;
		}
		return `${prefix}.${this.environmentService.remoteAuthority}.${workspaceHash}`;
	}

	private async getTunnelRestoreStorageKey(): Promise<string | undefined> {
		return this.addStorageKeyPostfix(TUNNELS_TO_RESTORE);
	}

	private async getRestoreExpirationStorageKey(): Promise<string | undefined> {
		return this.addStorageKeyPostfix(TUNNELS_TO_RESTORE_EXPIRATION);
	}

	private async getTunnelRestoreValue(): Promise<string | undefined> {
		const deprecatedValue = this.storageService.get(TUNNELS_TO_RESTORE, StorageScope.WORKSPACE);
		if (deprecatedValue) {
			this.storageService.remove(TUNNELS_TO_RESTORE, StorageScope.WORKSPACE);
			await this.storeForwarded();
			return deprecatedValue;
		}
		const storageKey = await this.getTunnelRestoreStorageKey();
		if (!storageKey) {
			return undefined;
		}
		return this.storageService.get(storageKey, StorageScope.PROFILE);
	}

	async restoreForwarded() {
		this.cleanupExpiredTunnelsForRestore();
		if (this.configurationService.getValue('remote.restoreForwardedPorts')) {
			const tunnelRestoreValue = await this.tunnelRestoreValue;
			if (tunnelRestoreValue && (tunnelRestoreValue !== this.knownPortsRestoreValue)) {
				const tunnels = <RestorableTunnel[] | undefined>JSON.parse(tunnelRestoreValue) ?? [];
				this.logService.trace(`ForwardedPorts: (TunnelModel) restoring ports ${tunnels.map(tunnel => tunnel.remotePort).join(', ')}`);
				for (const tunnel of tunnels) {
					const alreadyForwarded = mapHasAddressLocalhostOrAllInterfaces(this.detected, tunnel.remoteHost, tunnel.remotePort);
					// Extension forwarded ports should only be updated, not restored.
					if ((tunnel.source.source !== TunnelSource.Extension && !alreadyForwarded) || (tunnel.source.source === TunnelSource.Extension && alreadyForwarded)) {
						await this.doForward({
							remote: { host: tunnel.remoteHost, port: tunnel.remotePort },
							local: tunnel.localPort,
							name: tunnel.name,
							elevateIfNeeded: true,
							source: tunnel.source
						});
					} else if (tunnel.source.source === TunnelSource.Extension && !alreadyForwarded) {
						this.unrestoredExtensionTunnels.set(makeAddress(tunnel.remoteHost, tunnel.remotePort), tunnel);
					}
				}
			}
		}

		this.restoreComplete = true;
		this.onRestoreComplete.fire();

		if (!this.restoreListener) {
			// It's possible that at restore time the value hasn't synced.
			const key = await this.getTunnelRestoreStorageKey();
			this.restoreListener = this._register(new DisposableStore());
			this.restoreListener.add(this.storageService.onDidChangeValue(StorageScope.PROFILE, undefined, this.restoreListener)(async (e) => {
				if (e.key === key) {
					this.tunnelRestoreValue = Promise.resolve(this.storageService.get(key, StorageScope.PROFILE));
					await this.restoreForwarded();
				}
			}));
		}
	}

	private cleanupExpiredTunnelsForRestore() {
		const keys = this.storageService.keys(StorageScope.PROFILE, StorageTarget.USER).filter(key => key.startsWith(TUNNELS_TO_RESTORE_EXPIRATION));
		for (const key of keys) {
			const expiration = this.storageService.getNumber(key, StorageScope.PROFILE);
			if (expiration && expiration < Date.now()) {
				this.tunnelRestoreValue = Promise.resolve(undefined);
				const storageKey = key.replace(TUNNELS_TO_RESTORE_EXPIRATION, TUNNELS_TO_RESTORE);
				this.storageService.remove(key, StorageScope.PROFILE);
				this.storageService.remove(storageKey, StorageScope.PROFILE);
			}
		}
	}

	@debounce(1000)
	private async storeForwarded() {
		if (this.configurationService.getValue('remote.restoreForwardedPorts')) {
			const forwarded = Array.from(this.forwarded.values());
			const restorableTunnels: RestorableTunnel[] = forwarded.map(tunnel => {
				return {
					remoteHost: tunnel.remoteHost,
					remotePort: tunnel.remotePort,
					localPort: tunnel.localPort,
					name: tunnel.name,
					localAddress: tunnel.localAddress,
					localUri: tunnel.localUri,
					protocol: tunnel.protocol,
					source: tunnel.source,
				};
			});
			let valueToStore: string | undefined;
			if (forwarded.length > 0) {
				valueToStore = JSON.stringify(restorableTunnels);
			}

			const key = await this.getTunnelRestoreStorageKey();
			const expirationKey = await this.getRestoreExpirationStorageKey();
			if (!valueToStore && key && expirationKey) {
				this.storageService.remove(key, StorageScope.PROFILE);
				this.storageService.remove(expirationKey, StorageScope.PROFILE);
			} else if ((valueToStore !== this.knownPortsRestoreValue) && key && expirationKey) {
				this.storageService.store(key, valueToStore, StorageScope.PROFILE, StorageTarget.USER);
				this.storageService.store(expirationKey, Date.now() + RESTORE_EXPIRATION_TIME, StorageScope.PROFILE, StorageTarget.USER);
			}
			this.knownPortsRestoreValue = valueToStore;
		}
	}

	private mismatchCooldown = new Date();
	private async showPortMismatchModalIfNeeded(tunnel: RemoteTunnel, expectedLocal: number, attributes: Attributes | undefined) {
		if (!tunnel.tunnelLocalPort || !attributes?.requireLocalPort) {
			return;
		}
		if (tunnel.tunnelLocalPort === expectedLocal) {
			return;
		}

		const newCooldown = new Date();
		if ((this.mismatchCooldown.getTime() + MISMATCH_LOCAL_PORT_COOLDOWN) > newCooldown.getTime()) {
			return;
		}
		this.mismatchCooldown = newCooldown;
		const mismatchString = nls.localize('remote.localPortMismatch.single', "Local port {0} could not be used for forwarding to remote port {1}.\n\nThis usually happens when there is already another process using local port {0}.\n\nPort number {2} has been used instead.",
			expectedLocal, tunnel.tunnelRemotePort, tunnel.tunnelLocalPort);
		return this.dialogService.info(mismatchString);
	}

	async forward(tunnelProperties: TunnelProperties, attributes?: Attributes | null): Promise<RemoteTunnel | string | undefined> {
		if (!this.restoreComplete && this.environmentService.remoteAuthority) {
			await Event.toPromise(this.onRestoreComplete.event);
		}
		return this.doForward(tunnelProperties, attributes);
	}

	private async doForward(tunnelProperties: TunnelProperties, attributes?: Attributes | null): Promise<RemoteTunnel | string | undefined> {
		await this.extensionService.activateByEvent(ACTIVATION_EVENT);

		const existingTunnel = mapHasAddressLocalhostOrAllInterfaces(this.forwarded, tunnelProperties.remote.host, tunnelProperties.remote.port);
		attributes = attributes ??
			((attributes !== null)
				? (await this.getAttributes([tunnelProperties.remote]))?.get(tunnelProperties.remote.port)
				: undefined);
		const localPort = (tunnelProperties.local !== undefined) ? tunnelProperties.local : tunnelProperties.remote.port;
		let noTunnelValue: string | undefined;
		if (!existingTunnel) {
			const authority = this.environmentService.remoteAuthority;
			const addressProvider: IAddressProvider | undefined = authority ? {
				getAddress: async () => { return (await this.remoteAuthorityResolverService.resolveAuthority(authority)).authority; }
			} : undefined;

			const key = makeAddress(tunnelProperties.remote.host, tunnelProperties.remote.port);
			this.inProgress.set(key, true);
			tunnelProperties = this.mergeCachedAndUnrestoredProperties(key, tunnelProperties);

			const tunnel = await this.tunnelService.openTunnel(addressProvider, tunnelProperties.remote.host, tunnelProperties.remote.port, undefined, localPort, (!tunnelProperties.elevateIfNeeded) ? attributes?.elevateIfNeeded : tunnelProperties.elevateIfNeeded, tunnelProperties.privacy, attributes?.protocol);
			if (typeof tunnel === 'string') {
				// There was an error  while creating the tunnel.
				noTunnelValue = tunnel;
			} else if (tunnel && tunnel.localAddress) {
				const matchingCandidate = mapHasAddressLocalhostOrAllInterfaces<CandidatePort>(this._candidates ?? new Map(), tunnelProperties.remote.host, tunnelProperties.remote.port);
				const protocol = (tunnel.protocol ?
					((tunnel.protocol === TunnelProtocol.Https) ? TunnelProtocol.Https : TunnelProtocol.Http)
					: (attributes?.protocol ?? TunnelProtocol.Http));
				const newForward: Tunnel = {
					remoteHost: tunnel.tunnelRemoteHost,
					remotePort: tunnel.tunnelRemotePort,
					localPort: tunnel.tunnelLocalPort,
					name: attributes?.label ?? tunnelProperties.name,
					closeable: true,
					localAddress: tunnel.localAddress,
					protocol,
					localUri: await this.makeLocalUri(tunnel.localAddress, attributes),
					runningProcess: matchingCandidate?.detail,
					hasRunningProcess: !!matchingCandidate,
					pid: matchingCandidate?.pid,
					source: tunnelProperties.source ?? UserTunnelSource,
					privacy: tunnel.privacy,
				};
				this.forwarded.set(key, newForward);
				this.remoteTunnels.set(key, tunnel);
				this.inProgress.delete(key);
				await this.storeForwarded();
				await this.showPortMismatchModalIfNeeded(tunnel, localPort, attributes);
				this._onForwardPort.fire(newForward);
				return tunnel;
			}
			this.inProgress.delete(key);
		} else {
			return this.mergeAttributesIntoExistingTunnel(existingTunnel, tunnelProperties, attributes);
		}

		return noTunnelValue;
	}

	private mergeCachedAndUnrestoredProperties(key: string, tunnelProperties: TunnelProperties): TunnelProperties {
		const map = this.unrestoredExtensionTunnels.has(key) ? this.unrestoredExtensionTunnels : (this.sessionCachedProperties.has(key) ? this.sessionCachedProperties : undefined);
		if (map) {
			const updateProps = map.get(key)!;
			map.delete(key);
			if (updateProps) {
				tunnelProperties.name = updateProps.name ?? tunnelProperties.name;
				tunnelProperties.local = (('local' in updateProps) ? updateProps.local : (('localPort' in updateProps) ? updateProps.localPort : undefined)) ?? tunnelProperties.local;
				tunnelProperties.privacy = tunnelProperties.privacy;
			}
		}
		return tunnelProperties;
	}

	private async mergeAttributesIntoExistingTunnel(existingTunnel: Tunnel, tunnelProperties: TunnelProperties, attributes: Attributes | undefined) {
		const newName = attributes?.label ?? tunnelProperties.name;
		enum MergedAttributeAction {
			None = 0,
			Fire = 1,
			Reopen = 2
		}
		let mergedAction = MergedAttributeAction.None;
		if (newName !== existingTunnel.name) {
			existingTunnel.name = newName;
			mergedAction = MergedAttributeAction.Fire;
		}
		// Source of existing tunnel wins so that original source is maintained
		if ((attributes?.protocol || (existingTunnel.protocol !== TunnelProtocol.Http)) && (attributes?.protocol !== existingTunnel.protocol)) {
			tunnelProperties.source = existingTunnel.source;
			mergedAction = MergedAttributeAction.Reopen;
		}
		// New privacy value wins
		if (tunnelProperties.privacy && (existingTunnel.privacy !== tunnelProperties.privacy)) {
			mergedAction = MergedAttributeAction.Reopen;
		}
		switch (mergedAction) {
			case MergedAttributeAction.Fire: {
				this._onForwardPort.fire();
				break;
			}
			case MergedAttributeAction.Reopen: {
				await this.close(existingTunnel.remoteHost, existingTunnel.remotePort, TunnelCloseReason.User);
				await this.doForward(tunnelProperties, attributes);
			}
		}

		return mapHasAddressLocalhostOrAllInterfaces(this.remoteTunnels, tunnelProperties.remote.host, tunnelProperties.remote.port);
	}

	async name(host: string, port: number, name: string) {
		const existingForwarded = mapHasAddressLocalhostOrAllInterfaces(this.forwarded, host, port);
		const key = makeAddress(host, port);
		if (existingForwarded) {
			existingForwarded.name = name;
			await this.storeForwarded();
			this._onPortName.fire({ host, port });
			return;
		} else if (this.detected.has(key)) {
			this.detected.get(key)!.name = name;
			this._onPortName.fire({ host, port });
		}
	}

	async close(host: string, port: number, reason: TunnelCloseReason): Promise<void> {
		const key = makeAddress(host, port);
		const oldTunnel = this.forwarded.get(key)!;
		if ((reason === TunnelCloseReason.AutoForwardEnd) && oldTunnel && (oldTunnel.source.source === TunnelSource.Auto)) {
			this.sessionCachedProperties.set(key, {
				local: oldTunnel.localPort,
				name: oldTunnel.name,
				privacy: oldTunnel.privacy,
			});
		}
		await this.tunnelService.closeTunnel(host, port);
		return this.onTunnelClosed({ host, port }, reason);
	}

	address(host: string, port: number): string | undefined {
		const key = makeAddress(host, port);
		return (this.forwarded.get(key) || this.detected.get(key))?.localAddress;
	}

	public get environmentTunnelsSet(): boolean {
		return this._environmentTunnelsSet;
	}

	addEnvironmentTunnels(tunnels: TunnelDescription[] | undefined): void {
		if (tunnels) {
			for (const tunnel of tunnels) {
				const matchingCandidate = mapHasAddressLocalhostOrAllInterfaces(this._candidates ?? new Map(), tunnel.remoteAddress.host, tunnel.remoteAddress.port);
				const localAddress = typeof tunnel.localAddress === 'string' ? tunnel.localAddress : makeAddress(tunnel.localAddress.host, tunnel.localAddress.port);
				this.detected.set(makeAddress(tunnel.remoteAddress.host, tunnel.remoteAddress.port), {
					remoteHost: tunnel.remoteAddress.host,
					remotePort: tunnel.remoteAddress.port,
					localAddress: localAddress,
					protocol: TunnelProtocol.Http,
					localUri: this.makeLocalUri(localAddress),
					closeable: false,
					runningProcess: matchingCandidate?.detail,
					hasRunningProcess: !!matchingCandidate,
					pid: matchingCandidate?.pid,
					privacy: TunnelPrivacyId.ConstantPrivate,
					source: {
						source: TunnelSource.Extension,
						description: nls.localize('tunnel.staticallyForwarded', "Statically Forwarded")
					}
				});
				this.tunnelService.setEnvironmentTunnel(tunnel.remoteAddress.host, tunnel.remoteAddress.port, localAddress, TunnelPrivacyId.ConstantPrivate, TunnelProtocol.Http);
			}
		}
		this._environmentTunnelsSet = true;
		this._onEnvironmentTunnelsSet.fire();
		this._onForwardPort.fire();
	}

	setCandidateFilter(filter: ((candidates: CandidatePort[]) => Promise<CandidatePort[]>) | undefined): void {
		this._candidateFilter = filter;
	}

	async setCandidates(candidates: CandidatePort[]) {
		let processedCandidates = candidates;
		if (this._candidateFilter) {
			// When an extension provides a filter, we do the filtering on the extension host before the candidates are set here.
			// However, when the filter doesn't come from an extension we filter here.
			processedCandidates = await this._candidateFilter(candidates);
		}
		const removedCandidates = this.updateInResponseToCandidates(processedCandidates);
		this.logService.trace(`ForwardedPorts: (TunnelModel) removed candidates ${Array.from(removedCandidates.values()).map(candidate => candidate.port).join(', ')}`);
		this._onCandidatesChanged.fire(removedCandidates);
	}

	// Returns removed candidates
	private updateInResponseToCandidates(candidates: CandidatePort[]): Map<string, { host: string; port: number }> {
		const removedCandidates = this._candidates ?? new Map();
		const candidatesMap = new Map();
		this._candidates = candidatesMap;
		candidates.forEach(value => {
			const addressKey = makeAddress(value.host, value.port);
			candidatesMap.set(addressKey, {
				host: value.host,
				port: value.port,
				detail: value.detail,
				pid: value.pid
			});
			removedCandidates.delete(addressKey);
			const forwardedValue = mapHasAddressLocalhostOrAllInterfaces(this.forwarded, value.host, value.port);
			if (forwardedValue) {
				forwardedValue.runningProcess = value.detail;
				forwardedValue.hasRunningProcess = true;
				forwardedValue.pid = value.pid;
			}
		});
		removedCandidates.forEach((_value, key) => {
			const parsedAddress = parseAddress(key);
			if (!parsedAddress) {
				return;
			}
			const forwardedValue = mapHasAddressLocalhostOrAllInterfaces(this.forwarded, parsedAddress.host, parsedAddress.port);
			if (forwardedValue) {
				forwardedValue.runningProcess = undefined;
				forwardedValue.hasRunningProcess = false;
				forwardedValue.pid = undefined;
			}
			const detectedValue = mapHasAddressLocalhostOrAllInterfaces(this.detected, parsedAddress.host, parsedAddress.port);
			if (detectedValue) {
				detectedValue.runningProcess = undefined;
				detectedValue.hasRunningProcess = false;
				detectedValue.pid = undefined;
			}
		});
		return removedCandidates;
	}

	get candidates(): CandidatePort[] {
		return this._candidates ? Array.from(this._candidates.values()) : [];
	}

	get candidatesOrUndefined(): CandidatePort[] | undefined {
		return this._candidates ? this.candidates : undefined;
	}

	private async updateAttributes() {
		// If the label changes in the attributes, we should update it.
		const tunnels = Array.from(this.forwarded.values());
		const allAttributes = await this.getAttributes(tunnels.map(tunnel => {
			return { port: tunnel.remotePort, host: tunnel.remoteHost };
		}), false);
		if (!allAttributes) {
			return;
		}
		for (const forwarded of tunnels) {
			const attributes = allAttributes.get(forwarded.remotePort);
			if ((attributes?.protocol || (forwarded.protocol !== TunnelProtocol.Http)) && (attributes?.protocol !== forwarded.protocol)) {
				await this.doForward({
					remote: { host: forwarded.remoteHost, port: forwarded.remotePort },
					local: forwarded.localPort,
					name: forwarded.name,
					source: forwarded.source
				}, attributes);
			}

			if (!attributes) {
				continue;
			}
			if (attributes.label && attributes.label !== forwarded.name) {
				await this.name(forwarded.remoteHost, forwarded.remotePort, attributes.label);
			}

		}
	}

	async getAttributes(forwardedPorts: { host: string; port: number }[], checkProviders: boolean = true): Promise<Map<number, Attributes> | undefined> {
		const matchingCandidates: Map<number, CandidatePort> = new Map();
		const pidToPortsMapping: Map<number | undefined, number[]> = new Map();
		forwardedPorts.forEach(forwardedPort => {
			const matchingCandidate = mapHasAddressLocalhostOrAllInterfaces<CandidatePort>(this._candidates ?? new Map(), LOCALHOST_ADDRESSES[0], forwardedPort.port) ?? forwardedPort;
			if (matchingCandidate) {
				matchingCandidates.set(forwardedPort.port, matchingCandidate);
				const pid = isCandidatePort(matchingCandidate) ? matchingCandidate.pid : undefined;
				if (!pidToPortsMapping.has(pid)) {
					pidToPortsMapping.set(pid, []);
				}
				pidToPortsMapping.get(pid)?.push(forwardedPort.port);
			}
		});

		const configAttributes: Map<number, Attributes> = new Map();
		forwardedPorts.forEach(forwardedPort => {
			const attributes = this.configPortsAttributes.getAttributes(forwardedPort.port, forwardedPort.host, matchingCandidates.get(forwardedPort.port)?.detail);
			if (attributes) {
				configAttributes.set(forwardedPort.port, attributes);
			}
		});
		if ((this.portAttributesProviders.length === 0) || !checkProviders) {
			return (configAttributes.size > 0) ? configAttributes : undefined;
		}

		// Group calls to provide attributes by pid.
		const allProviderResults = await Promise.all(this.portAttributesProviders.flatMap(provider => {
			return Array.from(pidToPortsMapping.entries()).map(entry => {
				const portGroup = entry[1];
				const matchingCandidate = matchingCandidates.get(portGroup[0]);
				return provider.providePortAttributes(portGroup,
					matchingCandidate?.pid, matchingCandidate?.detail, CancellationToken.None);
			});
		}));
		const providedAttributes: Map<number, ProvidedPortAttributes> = new Map();
		allProviderResults.forEach(attributes => attributes.forEach(attribute => {
			if (attribute) {
				providedAttributes.set(attribute.port, attribute);
			}
		}));

		if (!configAttributes && !providedAttributes) {
			return undefined;
		}

		// Merge. The config wins.
		const mergedAttributes: Map<number, Attributes> = new Map();
		forwardedPorts.forEach(forwardedPorts => {
			const config = configAttributes.get(forwardedPorts.port);
			const provider = providedAttributes.get(forwardedPorts.port);
			mergedAttributes.set(forwardedPorts.port, {
				elevateIfNeeded: config?.elevateIfNeeded,
				label: config?.label,
				onAutoForward: config?.onAutoForward ?? PortsAttributes.providedActionToAction(provider?.autoForwardAction),
				requireLocalPort: config?.requireLocalPort,
				protocol: config?.protocol
			});
		});

		return mergedAttributes;
	}

	addAttributesProvider(provider: PortAttributesProvider) {
		this.portAttributesProviders.push(provider);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/remote/electron-browser/remoteAgentService.ts]---
Location: vscode-main/src/vs/workbench/services/remote/electron-browser/remoteAgentService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { IRemoteAgentService } from '../common/remoteAgentService.js';
import { IRemoteAuthorityResolverService, RemoteConnectionType, RemoteAuthorityResolverError } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { AbstractRemoteAgentService } from '../common/abstractRemoteAgentService.js';
import { ISignService } from '../../../../platform/sign/common/sign.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { INotificationService, IPromptChoice, Severity } from '../../../../platform/notification/common/notification.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { URI } from '../../../../base/common/uri.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { IRemoteSocketFactoryService } from '../../../../platform/remote/common/remoteSocketFactoryService.js';

export class RemoteAgentService extends AbstractRemoteAgentService implements IRemoteAgentService {
	constructor(
		@IRemoteSocketFactoryService remoteSocketFactoryService: IRemoteSocketFactoryService,
		@IUserDataProfileService userDataProfileService: IUserDataProfileService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IProductService productService: IProductService,
		@IRemoteAuthorityResolverService remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@ISignService signService: ISignService,
		@ILogService logService: ILogService,
	) {
		super(remoteSocketFactoryService, userDataProfileService, environmentService, productService, remoteAuthorityResolverService, signService, logService);
	}
}

class RemoteConnectionFailureNotificationContribution implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.nativeRemoteConnectionFailureNotification';

	constructor(
		@IRemoteAgentService private readonly _remoteAgentService: IRemoteAgentService,
		@INotificationService notificationService: INotificationService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@ITelemetryService telemetryService: ITelemetryService,
		@INativeHostService nativeHostService: INativeHostService,
		@IRemoteAuthorityResolverService private readonly _remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@IOpenerService openerService: IOpenerService,
	) {
		// Let's cover the case where connecting to fetch the remote extension info fails
		this._remoteAgentService.getRawEnvironment()
			.then(undefined, err => {

				if (!RemoteAuthorityResolverError.isHandled(err)) {
					const choices: IPromptChoice[] = [
						{
							label: nls.localize('devTools', "Open Developer Tools"),
							run: () => nativeHostService.openDevTools()
						}
					];
					const troubleshootingURL = this._getTroubleshootingURL();
					if (troubleshootingURL) {
						choices.push({
							label: nls.localize('directUrl', "Open in browser"),
							run: () => openerService.open(troubleshootingURL, { openExternal: true })
						});
					}
					notificationService.prompt(
						Severity.Error,
						nls.localize('connectionError', "Failed to connect to the remote extension host server (Error: {0})", err ? err.message : ''),
						choices
					);
				}
			});
	}

	private _getTroubleshootingURL(): URI | null {
		const remoteAgentConnection = this._remoteAgentService.getConnection();
		if (!remoteAgentConnection) {
			return null;
		}
		const connectionData = this._remoteAuthorityResolverService.getConnectionData(remoteAgentConnection.remoteAuthority);
		if (!connectionData || connectionData.connectTo.type !== RemoteConnectionType.WebSocket) {
			return null;
		}
		return URI.from({
			scheme: 'http',
			authority: `${connectionData.connectTo.host}:${connectionData.connectTo.port}`,
			path: `/version`
		});
	}

}

registerWorkbenchContribution2(RemoteConnectionFailureNotificationContribution.ID, RemoteConnectionFailureNotificationContribution, WorkbenchPhase.BlockRestore);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/request/browser/requestService.ts]---
Location: vscode-main/src/vs/workbench/services/request/browser/requestService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IRequestOptions, IRequestContext } from '../../../../base/parts/request/common/request.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { RequestChannelClient } from '../../../../platform/request/common/requestIpc.js';
import { IRemoteAgentService, IRemoteAgentConnection } from '../../remote/common/remoteAgentService.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { AbstractRequestService, AuthInfo, Credentials, IRequestService } from '../../../../platform/request/common/request.js';
import { request } from '../../../../base/parts/request/common/requestImpl.js';
import { ILoggerService } from '../../../../platform/log/common/log.js';
import { localize } from '../../../../nls.js';
import { LogService } from '../../../../platform/log/common/logService.js';
import { windowLogGroup } from '../../log/common/logConstants.js';

export class BrowserRequestService extends AbstractRequestService implements IRequestService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ILoggerService loggerService: ILoggerService,
	) {
		const logger = loggerService.createLogger(`network`, { name: localize('network', "Network"), group: windowLogGroup });
		const logService = new LogService(logger);
		super(logService);
		this._register(logger);
		this._register(logService);
	}

	async request(options: IRequestOptions, token: CancellationToken): Promise<IRequestContext> {
		try {
			if (!options.proxyAuthorization) {
				options.proxyAuthorization = this.configurationService.inspect<string>('http.proxyAuthorization').userLocalValue;
			}
			const context = await this.logAndRequest(options, () => request(options, token, () => navigator.onLine));

			const connection = this.remoteAgentService.getConnection();
			if (connection && context.res.statusCode === 405) {
				return this._makeRemoteRequest(connection, options, token);
			}
			return context;
		} catch (error) {
			const connection = this.remoteAgentService.getConnection();
			if (connection) {
				return this._makeRemoteRequest(connection, options, token);
			}
			throw error;
		}
	}

	async resolveProxy(url: string): Promise<string | undefined> {
		return undefined; // not implemented in the web
	}

	async lookupAuthorization(authInfo: AuthInfo): Promise<Credentials | undefined> {
		return undefined; // not implemented in the web
	}

	async lookupKerberosAuthorization(url: string): Promise<string | undefined> {
		return undefined; // not implemented in the web
	}

	async loadCertificates(): Promise<string[]> {
		return []; // not implemented in the web
	}

	private _makeRemoteRequest(connection: IRemoteAgentConnection, options: IRequestOptions, token: CancellationToken): Promise<IRequestContext> {
		return connection.withChannel('request', channel => new RequestChannelClient(channel).request(options, token));
	}
}

// --- Internal commands to help authentication for extensions

CommandsRegistry.registerCommand('_workbench.fetchJSON', async function (accessor: ServicesAccessor, url: string, method: string) {
	const result = await fetch(url, { method, headers: { Accept: 'application/json' } });

	if (result.ok) {
		return result.json();
	} else {
		throw new Error(result.statusText);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/request/electron-browser/requestService.ts]---
Location: vscode-main/src/vs/workbench/services/request/electron-browser/requestService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { AbstractRequestService, AuthInfo, Credentials, IRequestService } from '../../../../platform/request/common/request.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IRequestContext, IRequestOptions } from '../../../../base/parts/request/common/request.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { request } from '../../../../base/parts/request/common/requestImpl.js';
import { ILoggerService } from '../../../../platform/log/common/log.js';
import { localize } from '../../../../nls.js';
import { windowLogGroup } from '../../log/common/logConstants.js';
import { LogService } from '../../../../platform/log/common/logService.js';

export class NativeRequestService extends AbstractRequestService implements IRequestService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ILoggerService loggerService: ILoggerService,
	) {
		const logger = loggerService.createLogger(`network`, { name: localize('network', "Network"), group: windowLogGroup });
		const logService = new LogService(logger);
		super(logService);
		this._register(logger);
		this._register(logService);
	}

	async request(options: IRequestOptions, token: CancellationToken): Promise<IRequestContext> {
		if (!options.proxyAuthorization) {
			options.proxyAuthorization = this.configurationService.inspect<string>('http.proxyAuthorization').userLocalValue;
		}
		return this.logAndRequest(options, () => request(options, token, () => navigator.onLine));
	}

	async resolveProxy(url: string): Promise<string | undefined> {
		return this.nativeHostService.resolveProxy(url);
	}

	async lookupAuthorization(authInfo: AuthInfo): Promise<Credentials | undefined> {
		return this.nativeHostService.lookupAuthorization(authInfo);
	}

	async lookupKerberosAuthorization(url: string): Promise<string | undefined> {
		return this.nativeHostService.lookupKerberosAuthorization(url);
	}

	async loadCertificates(): Promise<string[]> {
		return this.nativeHostService.loadCertificates();
	}
}

registerSingleton(IRequestService, NativeRequestService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/browser/searchService.ts]---
Location: vscode-main/src/vs/workbench/services/search/browser/searchService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { IFileMatch, IFileQuery, ISearchComplete, ISearchProgressItem, ISearchResultProvider, ISearchService, ITextQuery, SearchProviderType, TextSearchCompleteMessageType } from '../common/search.js';
import { SearchService } from '../common/searchService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWebWorkerClient, logOnceWebWorkerWarning } from '../../../../base/common/worker/webWorker.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { WebWorkerDescriptor } from '../../../../platform/webWorker/browser/webWorkerDescriptor.js';
import { IWebWorkerService } from '../../../../platform/webWorker/browser/webWorkerService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILocalFileSearchWorker, LocalFileSearchWorkerHost } from '../common/localFileSearchWorkerTypes.js';
import { memoize } from '../../../../base/common/decorators.js';
import { HTMLFileSystemProvider } from '../../../../platform/files/browser/htmlFileSystemProvider.js';
import { FileAccess, Schemas } from '../../../../base/common/network.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { localize } from '../../../../nls.js';
import { WebFileSystemAccess } from '../../../../platform/files/browser/webFileSystemAccess.js';
import { revive } from '../../../../base/common/marshalling.js';

export class RemoteSearchService extends SearchService {
	constructor(
		@IModelService modelService: IModelService,
		@IEditorService editorService: IEditorService,
		@ITelemetryService telemetryService: ITelemetryService,
		@ILogService logService: ILogService,
		@IExtensionService extensionService: IExtensionService,
		@IFileService fileService: IFileService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super(modelService, editorService, telemetryService, logService, extensionService, fileService, uriIdentityService);
		const searchProvider = this.instantiationService.createInstance(LocalFileSearchWorkerClient);
		this.registerSearchResultProvider(Schemas.file, SearchProviderType.file, searchProvider);
		this.registerSearchResultProvider(Schemas.file, SearchProviderType.text, searchProvider);
	}
}

export class LocalFileSearchWorkerClient extends Disposable implements ISearchResultProvider {

	protected _worker: IWebWorkerClient<ILocalFileSearchWorker> | null;

	private readonly _onDidReceiveTextSearchMatch = new Emitter<{ match: IFileMatch<UriComponents>; queryId: number }>();
	readonly onDidReceiveTextSearchMatch: Event<{ match: IFileMatch<UriComponents>; queryId: number }> = this._onDidReceiveTextSearchMatch.event;

	private cache: { key: string; cache: ISearchComplete } | undefined;

	private queryId: number = 0;

	constructor(
		@IFileService private fileService: IFileService,
		@IUriIdentityService private uriIdentityService: IUriIdentityService,
		@IWebWorkerService private webWorkerService: IWebWorkerService,
	) {
		super();
		this._worker = null;
	}

	async getAIName(): Promise<string | undefined> {
		return undefined;
	}

	sendTextSearchMatch(match: IFileMatch<UriComponents>, queryId: number): void {
		this._onDidReceiveTextSearchMatch.fire({ match, queryId });
	}

	@memoize
	private get fileSystemProvider(): HTMLFileSystemProvider {
		return this.fileService.getProvider(Schemas.file) as HTMLFileSystemProvider;
	}

	private async cancelQuery(queryId: number) {
		const proxy = this._getOrCreateWorker().proxy;
		proxy.$cancelQuery(queryId);
	}

	async textSearch(query: ITextQuery, onProgress?: (p: ISearchProgressItem) => void, token?: CancellationToken): Promise<ISearchComplete> {
		try {
			const queryDisposables = new DisposableStore();

			const proxy = this._getOrCreateWorker().proxy;
			const results: IFileMatch[] = [];

			let limitHit = false;

			await Promise.all(query.folderQueries.map(async fq => {
				const queryId = this.queryId++;
				queryDisposables.add(token?.onCancellationRequested(e => this.cancelQuery(queryId)) || Disposable.None);

				const handle: FileSystemHandle | undefined = await this.fileSystemProvider.getHandle(fq.folder);
				if (!handle || !WebFileSystemAccess.isFileSystemDirectoryHandle(handle)) {
					console.error('Could not get directory handle for ', fq);
					return;
				}

				// force resource to revive using URI.revive.
				// TODO @andrea see why we can't just use `revive()` below. For some reason, (<MarshalledObject>obj).$mid was undefined for result.resource
				const reviveMatch = (result: IFileMatch<UriComponents>): IFileMatch => ({
					resource: URI.revive(result.resource),
					results: revive(result.results)
				});

				queryDisposables.add(this.onDidReceiveTextSearchMatch(e => {
					if (e.queryId === queryId) {
						onProgress?.(reviveMatch(e.match));
					}
				}));

				const ignorePathCasing = this.uriIdentityService.extUri.ignorePathCasing(fq.folder);
				const folderResults = await proxy.$searchDirectory(handle, query, fq, ignorePathCasing, queryId);
				for (const folderResult of folderResults.results) {
					results.push(revive(folderResult));
				}

				if (folderResults.limitHit) {
					limitHit = true;
				}

			}));

			queryDisposables.dispose();
			const result = { messages: [], results, limitHit };
			return result;
		} catch (e) {
			console.error('Error performing web worker text search', e);
			return {
				results: [],
				messages: [{
					text: localize('errorSearchText', "Unable to search with Web Worker text searcher"), type: TextSearchCompleteMessageType.Warning
				}],
			};
		}
	}

	async fileSearch(query: IFileQuery, token?: CancellationToken): Promise<ISearchComplete> {
		try {
			const queryDisposables = new DisposableStore();
			let limitHit = false;

			const proxy = this._getOrCreateWorker().proxy;
			const results: IFileMatch[] = [];
			await Promise.all(query.folderQueries.map(async fq => {
				const queryId = this.queryId++;
				queryDisposables.add(token?.onCancellationRequested(e => this.cancelQuery(queryId)) || Disposable.None);

				const handle: FileSystemHandle | undefined = await this.fileSystemProvider.getHandle(fq.folder);
				if (!handle || !WebFileSystemAccess.isFileSystemDirectoryHandle(handle)) {
					console.error('Could not get directory handle for ', fq);
					return;
				}
				const caseSensitive = this.uriIdentityService.extUri.ignorePathCasing(fq.folder);
				const folderResults = await proxy.$listDirectory(handle, query, fq, caseSensitive, queryId);
				for (const folderResult of folderResults.results) {
					results.push({ resource: URI.joinPath(fq.folder, folderResult) });
				}
				if (folderResults.limitHit) { limitHit = true; }
			}));

			queryDisposables.dispose();

			const result = { messages: [], results, limitHit };
			return result;
		} catch (e) {
			console.error('Error performing web worker file search', e);
			return {
				results: [],
				messages: [{
					text: localize('errorSearchFile', "Unable to search with Web Worker file searcher"), type: TextSearchCompleteMessageType.Warning
				}],
			};
		}
	}

	async clearCache(cacheKey: string): Promise<void> {
		if (this.cache?.key === cacheKey) { this.cache = undefined; }
	}

	private _getOrCreateWorker(): IWebWorkerClient<ILocalFileSearchWorker> {
		if (!this._worker) {
			try {
				this._worker = this._register(this.webWorkerService.createWorkerClient<ILocalFileSearchWorker>(
					new WebWorkerDescriptor({
						esmModuleLocation: FileAccess.asBrowserUri('vs/workbench/services/search/worker/localFileSearchMain.js'),
						label: 'LocalFileSearchWorker'
					})
				));
				LocalFileSearchWorkerHost.setChannel(this._worker, {
					$sendTextSearchMatch: (match, queryId) => {
						return this.sendTextSearchMatch(match, queryId);
					}
				});
			} catch (err) {
				logOnceWebWorkerWarning(err);
				throw err;
			}
		}
		return this._worker;
	}
}

registerSingleton(ISearchService, RemoteSearchService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/common/fileSearchManager.ts]---
Location: vscode-main/src/vs/workbench/services/search/common/fileSearchManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from '../../../../base/common/path.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import * as glob from '../../../../base/common/glob.js';
import * as resources from '../../../../base/common/resources.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { URI } from '../../../../base/common/uri.js';
import { IFileMatch, IFileSearchProviderStats, IFolderQuery, ISearchCompleteStats, IFileQuery, QueryGlobTester, resolvePatternsForProvider, hasSiblingFn, excludeToGlobPattern, DEFAULT_MAX_SEARCH_RESULTS } from './search.js';
import { FileSearchProviderFolderOptions, FileSearchProvider2, FileSearchProviderOptions } from './searchExtTypes.js';
import { OldFileSearchProviderConverter } from './searchExtConversionTypes.js';
import { FolderQuerySearchTree } from './folderQuerySearchTree.js';

interface IInternalFileMatch {
	base: URI;
	original?: URI;
	relativePath?: string; // Not present for extraFiles or absolute path matches
	basename: string;
	size?: number;
}

interface IDirectoryEntry {
	base: URI;
	relativePath: string;
	basename: string;
}

interface FolderQueryInfo {
	queryTester: QueryGlobTester;
	noSiblingsClauses: boolean;
	folder: URI;
	tree: IDirectoryTree;
}

interface IDirectoryTree {
	rootEntries: IDirectoryEntry[];
	pathToEntries: { [relativePath: string]: IDirectoryEntry[] };
}

class FileSearchEngine {
	private filePattern?: string;
	private includePattern?: glob.ParsedExpression;
	private maxResults?: number;
	private exists?: boolean;
	private isLimitHit = false;
	private resultCount = 0;
	private isCanceled = false;

	private activeCancellationTokens: Set<CancellationTokenSource>;

	private globalExcludePattern?: glob.ParsedExpression;

	constructor(private config: IFileQuery, private provider: FileSearchProvider2, private sessionLifecycle?: SessionLifecycle) {
		this.filePattern = config.filePattern;
		this.includePattern = config.includePattern && glob.parse(config.includePattern);
		this.maxResults = config.maxResults || undefined;
		this.exists = config.exists;
		this.activeCancellationTokens = new Set<CancellationTokenSource>();

		this.globalExcludePattern = config.excludePattern && glob.parse(config.excludePattern);
	}

	cancel(): void {
		this.isCanceled = true;
		this.activeCancellationTokens.forEach(t => t.cancel());
		this.activeCancellationTokens = new Set();
	}

	search(_onResult: (match: IInternalFileMatch) => void): Promise<IInternalSearchComplete> {
		const folderQueries = this.config.folderQueries || [];

		return new Promise((resolve, reject) => {
			const onResult = (match: IInternalFileMatch) => {
				this.resultCount++;
				_onResult(match);
			};

			// Support that the file pattern is a full path to a file that exists
			if (this.isCanceled) {
				return resolve({ limitHit: this.isLimitHit });
			}

			// For each extra file
			if (this.config.extraFileResources) {
				this.config.extraFileResources
					.forEach(extraFile => {
						const extraFileStr = extraFile.toString(); // ?
						const basename = path.basename(extraFileStr);
						if (this.globalExcludePattern && this.globalExcludePattern(extraFileStr, basename)) {
							return; // excluded
						}

						// File: Check for match on file pattern and include pattern
						this.matchFile(onResult, { base: extraFile, basename });
					});
			}

			// For each root folder'

			// NEW: can just call with an array of folder info
			this.doSearch(folderQueries, onResult).then(stats => {
				resolve({
					limitHit: this.isLimitHit,
					stats: stats || undefined // Only looking at single-folder workspace stats...
				});
			}, (err: Error) => {
				reject(new Error(toErrorMessage(err)));
			});
		});
	}


	private async doSearch(fqs: IFolderQuery<URI>[], onResult: (match: IInternalFileMatch) => void): Promise<IFileSearchProviderStats | null> {
		const cancellation = new CancellationTokenSource();
		const folderOptions = fqs.map(fq => this.getSearchOptionsForFolder(fq));
		const session = this.provider instanceof OldFileSearchProviderConverter ? this.sessionLifecycle?.tokenSource.token : this.sessionLifecycle?.obj;
		const options: FileSearchProviderOptions = {
			folderOptions,
			maxResults: this.config.maxResults ?? DEFAULT_MAX_SEARCH_RESULTS,
			session
		};


		const getFolderQueryInfo = (fq: IFolderQuery) => {
			const queryTester = new QueryGlobTester(this.config, fq);
			const noSiblingsClauses = !queryTester.hasSiblingExcludeClauses();
			return { queryTester, noSiblingsClauses, folder: fq.folder, tree: this.initDirectoryTree() };
		};

		const folderMappings: FolderQuerySearchTree<FolderQueryInfo> = new FolderQuerySearchTree<FolderQueryInfo>(fqs, getFolderQueryInfo);

		let providerSW: StopWatch;

		try {
			this.activeCancellationTokens.add(cancellation);

			providerSW = StopWatch.create();
			const results = await this.provider.provideFileSearchResults(
				this.config.filePattern || '',
				options,
				cancellation.token);
			const providerTime = providerSW.elapsed();
			const postProcessSW = StopWatch.create();

			if (this.isCanceled && !this.isLimitHit) {
				return null;
			}


			if (results) {
				results.forEach(result => {
					const fqFolderInfo = folderMappings.findQueryFragmentAwareSubstr(result)!;
					const relativePath = path.posix.relative(fqFolderInfo.folder.path, result.path);

					if (fqFolderInfo.noSiblingsClauses) {
						const basename = path.basename(result.path);
						this.matchFile(onResult, { base: fqFolderInfo.folder, relativePath, basename });

						return;
					}

					// TODO: Optimize siblings clauses with ripgrep here.
					this.addDirectoryEntries(fqFolderInfo.tree, fqFolderInfo.folder, relativePath, onResult);
				});
			}

			if (this.isCanceled && !this.isLimitHit) {
				return null;
			}

			folderMappings.forEachFolderQueryInfo(e => {
				this.matchDirectoryTree(e.tree, e.queryTester, onResult);
			});

			return {
				providerTime,
				postProcessTime: postProcessSW.elapsed()
			};
		} finally {
			cancellation.dispose();
			this.activeCancellationTokens.delete(cancellation);
		}
	}

	private getSearchOptionsForFolder(fq: IFolderQuery<URI>): FileSearchProviderFolderOptions {
		const includes = resolvePatternsForProvider(this.config.includePattern, fq.includePattern);
		let excludePattern = fq.excludePattern?.map(e => ({
			folder: e.folder,
			patterns: resolvePatternsForProvider(this.config.excludePattern, e.pattern)
		}));
		if (!excludePattern?.length) {
			excludePattern = [{
				folder: undefined,
				patterns: resolvePatternsForProvider(this.config.excludePattern, undefined)
			}];
		}
		const excludes = excludeToGlobPattern(excludePattern);

		return {
			folder: fq.folder,
			excludes,
			includes,
			useIgnoreFiles: {
				local: !fq.disregardIgnoreFiles,
				parent: !fq.disregardParentIgnoreFiles,
				global: !fq.disregardGlobalIgnoreFiles
			},
			followSymlinks: !fq.ignoreSymlinks,
		};
	}

	private initDirectoryTree(): IDirectoryTree {
		const tree: IDirectoryTree = {
			rootEntries: [],
			pathToEntries: Object.create(null)
		};
		tree.pathToEntries['.'] = tree.rootEntries;
		return tree;
	}

	private addDirectoryEntries({ pathToEntries }: IDirectoryTree, base: URI, relativeFile: string, onResult: (result: IInternalFileMatch) => void) {
		// Support relative paths to files from a root resource (ignores excludes)
		if (relativeFile === this.filePattern) {
			const basename = path.basename(this.filePattern);
			this.matchFile(onResult, { base: base, relativePath: this.filePattern, basename });
		}

		function add(relativePath: string) {
			const basename = path.basename(relativePath);
			const dirname = path.dirname(relativePath);
			let entries = pathToEntries[dirname];
			if (!entries) {
				entries = pathToEntries[dirname] = [];
				add(dirname);
			}
			entries.push({
				base,
				relativePath,
				basename
			});
		}

		add(relativeFile);
	}

	private matchDirectoryTree({ rootEntries, pathToEntries }: IDirectoryTree, queryTester: QueryGlobTester, onResult: (result: IInternalFileMatch) => void) {
		const self = this;
		const filePattern = this.filePattern;
		function matchDirectory(entries: IDirectoryEntry[]) {
			const hasSibling = hasSiblingFn(() => entries.map(entry => entry.basename));
			for (let i = 0, n = entries.length; i < n; i++) {
				const entry = entries[i];
				const { relativePath, basename } = entry;

				// Check exclude pattern
				// If the user searches for the exact file name, we adjust the glob matching
				// to ignore filtering by siblings because the user seems to know what they
				// are searching for and we want to include the result in that case anyway
				if (queryTester.matchesExcludesSync(relativePath, basename, filePattern !== basename ? hasSibling : undefined)) {
					continue;
				}

				const sub = pathToEntries[relativePath];
				if (sub) {
					matchDirectory(sub);
				} else {
					if (relativePath === filePattern) {
						continue; // ignore file if its path matches with the file pattern because that is already matched above
					}

					self.matchFile(onResult, entry);
				}

				if (self.isLimitHit) {
					break;
				}
			}
		}
		matchDirectory(rootEntries);
	}

	private matchFile(onResult: (result: IInternalFileMatch) => void, candidate: IInternalFileMatch): void {
		if (!this.includePattern || (candidate.relativePath && this.includePattern(candidate.relativePath, candidate.basename))) {
			if (this.exists || (this.maxResults && this.resultCount >= this.maxResults)) {
				this.isLimitHit = true;
				this.cancel();
			}

			if (!this.isLimitHit) {
				onResult(candidate);
			}
		}
	}
}

interface IInternalSearchComplete {
	limitHit: boolean;
	stats?: IFileSearchProviderStats;
}

/**
 * For backwards compatibility, store both a cancellation token and a session object. The session object is the new implementation, where
 */
class SessionLifecycle {
	private _obj: object | undefined;
	public readonly tokenSource: CancellationTokenSource;

	constructor() {
		this._obj = new Object();
		this.tokenSource = new CancellationTokenSource();
	}

	public get obj() {
		if (this._obj) {
			return this._obj;
		}

		throw new Error('Session object has been dereferenced.');
	}

	cancel() {
		this.tokenSource.cancel();
		this._obj = undefined; // dereference
	}
}

export class FileSearchManager {

	private static readonly BATCH_SIZE = 512;

	private readonly sessions = new Map<string, SessionLifecycle>();

	fileSearch(config: IFileQuery, provider: FileSearchProvider2, onBatch: (matches: IFileMatch[]) => void, token: CancellationToken): Promise<ISearchCompleteStats> {
		const sessionTokenSource = this.getSessionTokenSource(config.cacheKey);
		const engine = new FileSearchEngine(config, provider, sessionTokenSource);

		let resultCount = 0;
		const onInternalResult = (batch: IInternalFileMatch[]) => {
			resultCount += batch.length;
			onBatch(batch.map(m => this.rawMatchToSearchItem(m)));
		};

		return this.doSearch(engine, FileSearchManager.BATCH_SIZE, onInternalResult, token).then(
			result => {
				return {
					limitHit: result.limitHit,
					stats: result.stats ? {
						fromCache: false,
						type: 'fileSearchProvider',
						resultCount,
						detailStats: result.stats
					} : undefined,
					messages: []
				};
			});
	}

	clearCache(cacheKey: string): void {
		// cancel the token
		this.sessions.get(cacheKey)?.cancel();
		// with no reference to this, it will be removed from WeakMaps
		this.sessions.delete(cacheKey);
	}

	private getSessionTokenSource(cacheKey: string | undefined): SessionLifecycle | undefined {
		if (!cacheKey) {
			return undefined;
		}

		if (!this.sessions.has(cacheKey)) {
			this.sessions.set(cacheKey, new SessionLifecycle());
		}

		return this.sessions.get(cacheKey);
	}

	private rawMatchToSearchItem(match: IInternalFileMatch): IFileMatch {
		if (match.relativePath) {
			return {
				resource: resources.joinPath(match.base, match.relativePath)
			};
		} else {
			// extraFileResources
			return {
				resource: match.base
			};
		}
	}

	private doSearch(engine: FileSearchEngine, batchSize: number, onResultBatch: (matches: IInternalFileMatch[]) => void, token: CancellationToken): Promise<IInternalSearchComplete> {
		const listener = token.onCancellationRequested(() => {
			engine.cancel();
		});

		const _onResult = (match: IInternalFileMatch) => {
			if (match) {
				batch.push(match);
				if (batchSize > 0 && batch.length >= batchSize) {
					onResultBatch(batch);
					batch = [];
				}
			}
		};

		let batch: IInternalFileMatch[] = [];
		return engine.search(_onResult).then(result => {
			if (batch.length) {
				onResultBatch(batch);
			}

			listener.dispose();
			return result;
		}, error => {
			if (batch.length) {
				onResultBatch(batch);
			}

			listener.dispose();
			return Promise.reject(error);
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/common/folderQuerySearchTree.ts]---
Location: vscode-main/src/vs/workbench/services/search/common/folderQuerySearchTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { URI } from '../../../../base/common/uri.js';
import { IFolderQuery } from './search.js';
import { TernarySearchTree, UriIterator } from '../../../../base/common/ternarySearchTree.js';
import { ResourceMap } from '../../../../base/common/map.js';

/**
 * A ternary search tree that supports URI keys and query/fragment-aware substring matching, specifically for file search.
 * This is because the traditional TST does not support query and fragments https://github.com/microsoft/vscode/issues/227836
 */
export class FolderQuerySearchTree<FolderQueryInfo extends { folder: URI }> extends TernarySearchTree<URI, Map<string, FolderQueryInfo>> {
	constructor(folderQueries: IFolderQuery<URI>[],
		getFolderQueryInfo: (fq: IFolderQuery, i: number) => FolderQueryInfo,
		ignorePathCasing: (key: URI) => boolean = () => false
	) {
		const uriIterator = new UriIterator(ignorePathCasing, () => false);
		super(uriIterator);

		const fqBySameBase = new ResourceMap<{ fq: IFolderQuery<URI>; i: number }[]>();
		folderQueries.forEach((fq, i) => {
			const uriWithoutQueryOrFragment = fq.folder.with({ query: '', fragment: '' });
			if (fqBySameBase.has(uriWithoutQueryOrFragment)) {
				fqBySameBase.get(uriWithoutQueryOrFragment)!.push({ fq, i });
			} else {
				fqBySameBase.set(uriWithoutQueryOrFragment, [{ fq, i }]);
			}
		});
		fqBySameBase.forEach((values, key) => {
			const folderQueriesWithQueries = new Map<string, FolderQueryInfo>();
			for (const fqBases of values) {
				const folderQueryInfo = getFolderQueryInfo(fqBases.fq, fqBases.i);
				folderQueriesWithQueries.set(this.encodeKey(fqBases.fq.folder), folderQueryInfo);
			}
			super.set(key, folderQueriesWithQueries);
		});
	}

	findQueryFragmentAwareSubstr(key: URI): FolderQueryInfo | undefined {

		const baseURIResult = super.findSubstr(key.with({ query: '', fragment: '' }));
		if (!baseURIResult) {
			return undefined;
		}
		const queryAndFragmentKey = this.encodeKey(key);
		return baseURIResult.get(queryAndFragmentKey);

	}

	forEachFolderQueryInfo(fn: (folderQueryInfo: FolderQueryInfo) => void): void {
		return this.forEach(elem => elem.forEach(mapElem => fn(mapElem)));
	}

	private encodeKey(key: URI): string {
		let str = '';
		if (key.query) {
			str += key.query;
		}
		if (key.fragment) {
			str += '#' + key.fragment;
		}
		return str;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/common/getFileResults.ts]---
Location: vscode-main/src/vs/workbench/services/search/common/getFileResults.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITextSearchMatch, ITextSearchPreviewOptions, ITextSearchResult } from './search.js';
import { Range } from '../../../../editor/common/core/range.js';

export const getFileResults = (
	bytes: Uint8Array,
	pattern: RegExp,
	options: {
		surroundingContext: number;
		previewOptions: ITextSearchPreviewOptions | undefined;
		remainingResultQuota: number;
	}
): ITextSearchResult[] => {

	let text: string;
	if (bytes[0] === 0xff && bytes[1] === 0xfe) {
		text = new TextDecoder('utf-16le').decode(bytes);
	} else if (bytes[0] === 0xfe && bytes[1] === 0xff) {
		text = new TextDecoder('utf-16be').decode(bytes);
	} else {
		text = new TextDecoder('utf8').decode(bytes);
		if (text.slice(0, 1000).includes('\uFFFD') && bytes.includes(0)) {
			return [];
		}
	}

	const results: ITextSearchResult[] = [];

	const patternIndices: { matchStartIndex: number; matchedText: string }[] = [];

	let patternMatch: RegExpExecArray | null = null;
	let remainingResultQuota = options.remainingResultQuota;
	while (remainingResultQuota >= 0 && (patternMatch = pattern.exec(text))) {
		patternIndices.push({ matchStartIndex: patternMatch.index, matchedText: patternMatch[0] });
		remainingResultQuota--;
	}

	if (patternIndices.length) {
		const contextLinesNeeded = new Set<number>();
		const resultLines = new Set<number>();

		const lineRanges: { start: number; end: number }[] = [];
		const readLine = (lineNumber: number) => text.slice(lineRanges[lineNumber].start, lineRanges[lineNumber].end);

		let prevLineEnd = 0;
		let lineEndingMatch: RegExpExecArray | null = null;
		const lineEndRegex = /\r?\n/g;
		while ((lineEndingMatch = lineEndRegex.exec(text))) {
			lineRanges.push({ start: prevLineEnd, end: lineEndingMatch.index });
			prevLineEnd = lineEndingMatch.index + lineEndingMatch[0].length;
		}
		if (prevLineEnd < text.length) { lineRanges.push({ start: prevLineEnd, end: text.length }); }

		let startLine = 0;
		for (const { matchStartIndex, matchedText } of patternIndices) {
			if (remainingResultQuota < 0) {
				break;
			}

			while (Boolean(lineRanges[startLine + 1]) && matchStartIndex > lineRanges[startLine].end) {
				startLine++;
			}
			let endLine = startLine;
			while (Boolean(lineRanges[endLine + 1]) && matchStartIndex + matchedText.length > lineRanges[endLine].end) {
				endLine++;
			}

			if (options.surroundingContext) {
				for (let contextLine = Math.max(0, startLine - options.surroundingContext); contextLine < startLine; contextLine++) {
					contextLinesNeeded.add(contextLine);
				}
			}

			let previewText = '';
			let offset = 0;
			for (let matchLine = startLine; matchLine <= endLine; matchLine++) {
				let previewLine = readLine(matchLine);
				if (options.previewOptions?.charsPerLine && previewLine.length > options.previewOptions.charsPerLine) {
					offset = Math.max(matchStartIndex - lineRanges[startLine].start - 20, 0);
					previewLine = previewLine.substr(offset, options.previewOptions.charsPerLine);
				}
				previewText += `${previewLine}\n`;
				resultLines.add(matchLine);
			}

			const fileRange = new Range(
				startLine,
				matchStartIndex - lineRanges[startLine].start,
				endLine,
				matchStartIndex + matchedText.length - lineRanges[endLine].start
			);
			const previewRange = new Range(
				0,
				matchStartIndex - lineRanges[startLine].start - offset,
				endLine - startLine,
				matchStartIndex + matchedText.length - lineRanges[endLine].start - (endLine === startLine ? offset : 0)
			);

			const match: ITextSearchMatch = {
				rangeLocations: [{
					source: fileRange,
					preview: previewRange,
				}],
				previewText: previewText
			};

			results.push(match);

			if (options.surroundingContext) {
				for (let contextLine = endLine + 1; contextLine <= Math.min(endLine + options.surroundingContext, lineRanges.length - 1); contextLine++) {
					contextLinesNeeded.add(contextLine);
				}
			}
		}
		for (const contextLine of contextLinesNeeded) {
			if (!resultLines.has(contextLine)) {

				results.push({
					text: readLine(contextLine),
					lineNumber: contextLine + 1,
				});
			}
		}
	}
	return results;
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/common/ignoreFile.ts]---
Location: vscode-main/src/vs/workbench/services/search/common/ignoreFile.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as glob from '../../../../base/common/glob.js';
import { startsWithIgnoreCase } from '../../../../base/common/strings.js';

export class IgnoreFile {

	private isPathIgnored: (path: string, isDir: boolean, parent?: IgnoreFile) => boolean;

	constructor(
		contents: string,
		private readonly location: string,
		private readonly parent?: IgnoreFile,
		private readonly ignoreCase = false) {
		if (location[location.length - 1] === '\\') {
			throw Error('Unexpected path format, do not use trailing backslashes');
		}
		if (location[location.length - 1] !== '/') {
			location += '/';
		}
		this.isPathIgnored = this.parseIgnoreFile(contents, this.location, this.parent);
	}

	/**
	 * Updates the contents of the ignore file. Preserving the location and parent
	 * @param contents The new contents of the gitignore file
	 */
	updateContents(contents: string) {
		this.isPathIgnored = this.parseIgnoreFile(contents, this.location, this.parent);
	}

	/**
	 * Returns true if a path in a traversable directory has not been ignored.
	 *
	 * Note: For performance reasons this does not check if the parent directories have been ignored,
	 * so it should always be used in tandem with `shouldTraverseDir` when walking a directory.
	 *
	 * In cases where a path must be tested in isolation, `isArbitraryPathIncluded` should be used.
	 */
	isPathIncludedInTraversal(path: string, isDir: boolean): boolean {
		if (path[0] !== '/' || path[path.length - 1] === '/') {
			throw Error('Unexpected path format, expected to begin with slash and end without. got:' + path);
		}

		const ignored = this.isPathIgnored(path, isDir);

		return !ignored;
	}

	/**
	 * Returns true if an arbitrary path has not been ignored.
	 * This is an expensive operation and should only be used outside of traversals.
	 */
	isArbitraryPathIgnored(path: string, isDir: boolean): boolean {
		if (path[0] !== '/' || path[path.length - 1] === '/') {
			throw Error('Unexpected path format, expected to begin with slash and end without. got:' + path);
		}

		const segments = path.split('/').filter(x => x);
		let ignored = false;

		let walkingPath = '';

		for (let i = 0; i < segments.length; i++) {
			const isLast = i === segments.length - 1;
			const segment = segments[i];

			walkingPath = walkingPath + '/' + segment;

			if (!this.isPathIncludedInTraversal(walkingPath, isLast ? isDir : true)) {
				ignored = true;
				break;
			}
		}

		return ignored;
	}

	private gitignoreLinesToExpression(lines: string[], dirPath: string, trimForExclusions: boolean): glob.ParsedExpression {
		const includeLines = lines.map(line => this.gitignoreLineToGlob(line, dirPath));

		const includeExpression: glob.IExpression = Object.create(null);
		for (const line of includeLines) {
			includeExpression[line] = true;
		}

		return glob.parse(includeExpression, { trimForExclusions, ignoreCase: this.ignoreCase });
	}

	private parseIgnoreFile(ignoreContents: string, dirPath: string, parent: IgnoreFile | undefined): (path: string, isDir: boolean) => boolean {
		const contentLines = ignoreContents
			.split('\n')
			.map(line => line.trim())
			.filter(line => line && line[0] !== '#');

		// Pull out all the lines that end with `/`, those only apply to directories
		const fileLines = contentLines.filter(line => !line.endsWith('/'));

		const fileIgnoreLines = fileLines.filter(line => !line.includes('!'));
		const isFileIgnored = this.gitignoreLinesToExpression(fileIgnoreLines, dirPath, true);

		// TODO: Slight hack... this naive approach may reintroduce too many files in cases of weirdly complex .gitignores
		const fileIncludeLines = fileLines.filter(line => line.includes('!')).map(line => line.replace(/!/g, ''));
		const isFileIncluded = this.gitignoreLinesToExpression(fileIncludeLines, dirPath, false);

		// When checking if a dir is ignored we can use all lines
		const dirIgnoreLines = contentLines.filter(line => !line.includes('!'));
		const isDirIgnored = this.gitignoreLinesToExpression(dirIgnoreLines, dirPath, true);

		// Same hack.
		const dirIncludeLines = contentLines.filter(line => line.includes('!')).map(line => line.replace(/!/g, ''));
		const isDirIncluded = this.gitignoreLinesToExpression(dirIncludeLines, dirPath, false);

		const isPathIgnored = (path: string, isDir: boolean) => {
			if (!(this.ignoreCase ? startsWithIgnoreCase(path, dirPath) : path.startsWith(dirPath))) { return false; }
			if (isDir && isDirIgnored(path) && !isDirIncluded(path)) { return true; }
			if (isFileIgnored(path) && !isFileIncluded(path)) { return true; }

			if (parent) { return parent.isPathIgnored(path, isDir); }

			return false;
		};

		return isPathIgnored;
	}

	private gitignoreLineToGlob(line: string, dirPath: string): string {
		const firstSep = line.indexOf('/');
		if (firstSep === -1 || firstSep === line.length - 1) {
			line = '**/' + line;
		} else {
			if (firstSep === 0) {
				if (dirPath.slice(-1) === '/') {
					line = line.slice(1);
				}
			} else {
				if (dirPath.slice(-1) !== '/') {
					line = '/' + line;
				}
			}
			line = dirPath + line;
		}

		return line;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/common/localFileSearchWorkerTypes.ts]---
Location: vscode-main/src/vs/workbench/services/search/common/localFileSearchWorkerTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { UriComponents } from '../../../../base/common/uri.js';
import { IWebWorkerClient, IWebWorkerServer } from '../../../../base/common/worker/webWorker.js';
import { IFileMatch, IFileQueryProps, IFolderQuery, ITextQueryProps } from './search.js';

export interface IWorkerTextSearchComplete {
	results: IFileMatch<UriComponents>[];
	limitHit?: boolean;
}

export interface IWorkerFileSearchComplete {
	results: string[];
	limitHit?: boolean;
}

// Copied from lib.dom.ts, which is not available in this layer.
type IWorkerFileSystemHandleKind = 'directory' | 'file';

export interface IWorkerFileSystemHandle {
	readonly kind: IWorkerFileSystemHandleKind;
	readonly name: string;
	isSameEntry(other: IWorkerFileSystemHandle): Promise<boolean>;
}

export interface IWorkerFileSystemDirectoryHandle extends IWorkerFileSystemHandle {
	readonly kind: 'directory';
	getDirectoryHandle(name: string): Promise<IWorkerFileSystemDirectoryHandle>;
	getFileHandle(name: string): Promise<IWorkerFileSystemFileHandle>;
	resolve(possibleDescendant: IWorkerFileSystemHandle): Promise<string[] | null>;
	entries(): AsyncIterableIterator<[string, IWorkerFileSystemDirectoryHandle | IWorkerFileSystemFileHandle]>;
}

export interface IWorkerFileSystemFileHandle extends IWorkerFileSystemHandle {
	readonly kind: 'file';
	getFile(): Promise<{ arrayBuffer(): Promise<ArrayBuffer> }>;
}

export interface ILocalFileSearchWorker {
	_requestHandlerBrand: void;

	$cancelQuery(queryId: number): void;

	$listDirectory(handle: IWorkerFileSystemDirectoryHandle, queryProps: IFileQueryProps<UriComponents>, folderQuery: IFolderQuery, ignorePathCasing: boolean, queryId: number): Promise<IWorkerFileSearchComplete>;
	$searchDirectory(handle: IWorkerFileSystemDirectoryHandle, queryProps: ITextQueryProps<UriComponents>, folderQuery: IFolderQuery, ignorePathCasing: boolean, queryId: number): Promise<IWorkerTextSearchComplete>;
}

export abstract class LocalFileSearchWorkerHost {
	public static CHANNEL_NAME = 'localFileSearchWorkerHost';
	public static getChannel(workerServer: IWebWorkerServer): LocalFileSearchWorkerHost {
		return workerServer.getChannel<LocalFileSearchWorkerHost>(LocalFileSearchWorkerHost.CHANNEL_NAME);
	}
	public static setChannel(workerClient: IWebWorkerClient<unknown>, obj: LocalFileSearchWorkerHost): void {
		workerClient.setChannel<LocalFileSearchWorkerHost>(LocalFileSearchWorkerHost.CHANNEL_NAME, obj);
	}

	abstract $sendTextSearchMatch(match: IFileMatch<UriComponents>, queryId: number): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/common/queryBuilder.ts]---
Location: vscode-main/src/vs/workbench/services/search/common/queryBuilder.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from '../../../../base/common/arrays.js';
import * as collections from '../../../../base/common/collections.js';
import * as glob from '../../../../base/common/glob.js';
import { untildify } from '../../../../base/common/labels.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { Schemas } from '../../../../base/common/network.js';
import * as path from '../../../../base/common/path.js';
import { isEqual, basename, relativePath, isAbsolutePath } from '../../../../base/common/resources.js';
import * as strings from '../../../../base/common/strings.js';
import { assertReturnsDefined, isDefined } from '../../../../base/common/types.js';
import { URI, URI as uri, UriComponents } from '../../../../base/common/uri.js';
import { isMultilineRegexSource } from '../../../../editor/common/model/textModelSearch.js';
import * as nls from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceContextService, IWorkspaceFolderData, toWorkspaceFolder, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { IEditorGroupsService } from '../../editor/common/editorGroupsService.js';
import { IPathService } from '../../path/common/pathService.js';
import { ExcludeGlobPattern, getExcludes, IAITextQuery, ICommonQueryProps, IFileQuery, IFolderQuery, IPatternInfo, ISearchConfiguration, ITextQuery, ITextSearchPreviewOptions, pathIncludedInQuery, QueryType } from './search.js';
import { GlobPattern } from './searchExtTypes.js';

/**
 * One folder to search and a glob expression that should be applied.
 */
interface IOneSearchPathPattern {
	searchPath: uri;
	pattern?: string;
}

/**
 * One folder to search and a set of glob expressions that should be applied.
 */
export interface ISearchPathPattern {
	searchPath: uri;
	pattern?: glob.IExpression;
}

type ISearchPathPatternBuilder = string | string[];

export interface ISearchPatternBuilder<U extends UriComponents> {
	uri?: U;
	pattern: ISearchPathPatternBuilder;
}

export function isISearchPatternBuilder<U extends UriComponents>(object: ISearchPatternBuilder<U> | ISearchPathPatternBuilder): object is ISearchPatternBuilder<U> {
	return (typeof object === 'object' && 'uri' in object && 'pattern' in object);
}

export function globPatternToISearchPatternBuilder(globPattern: GlobPattern): ISearchPatternBuilder<URI> {

	if (typeof globPattern === 'string') {
		return {
			pattern: globPattern
		};
	}

	return {
		pattern: globPattern.pattern,
		uri: globPattern.baseUri
	};
}

/**
 * A set of search paths and a set of glob expressions that should be applied.
 */
export interface ISearchPathsInfo {
	searchPaths?: ISearchPathPattern[];
	pattern?: glob.IExpression;
}

interface ICommonQueryBuilderOptions<U extends UriComponents = URI> {
	_reason?: string;
	excludePattern?: ISearchPatternBuilder<U>[];
	includePattern?: ISearchPathPatternBuilder;
	extraFileResources?: U[];

	/** Parse the special ./ syntax supported by the searchview, and expand foo to ** /foo */
	expandPatterns?: boolean;

	maxResults?: number;
	maxFileSize?: number;
	disregardIgnoreFiles?: boolean;
	disregardGlobalIgnoreFiles?: boolean;
	disregardParentIgnoreFiles?: boolean;
	disregardExcludeSettings?: boolean;
	disregardSearchExcludeSettings?: boolean;
	ignoreSymlinks?: boolean;
	onlyOpenEditors?: boolean;
	onlyFileScheme?: boolean;
}

export interface IFileQueryBuilderOptions<U extends UriComponents = URI> extends ICommonQueryBuilderOptions<U> {
	filePattern?: string;
	exists?: boolean;
	sortByScore?: boolean;
	cacheKey?: string;
	shouldGlobSearch?: boolean;
}

export interface ITextQueryBuilderOptions<U extends UriComponents = URI> extends ICommonQueryBuilderOptions<U> {
	previewOptions?: ITextSearchPreviewOptions;
	fileEncoding?: string;
	surroundingContext?: number;
	isSmartCase?: boolean;
	notebookSearchConfig?: {
		includeMarkupInput: boolean;
		includeMarkupPreview: boolean;
		includeCodeInput: boolean;
		includeOutput: boolean;
	};
}

export class QueryBuilder {

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IEditorGroupsService private readonly editorGroupsService: IEditorGroupsService,
		@ILogService private readonly logService: ILogService,
		@IPathService private readonly pathService: IPathService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService
	) {
	}

	aiText(contentPattern: string, folderResources?: uri[], options: ITextQueryBuilderOptions = {}): IAITextQuery {
		const commonQuery = this.commonQuery(folderResources?.map(toWorkspaceFolder), options);
		return {
			...commonQuery,
			type: QueryType.aiText,
			contentPattern,
		};
	}

	text(contentPattern: IPatternInfo, folderResources?: uri[], options: ITextQueryBuilderOptions = {}): ITextQuery {
		contentPattern = this.getContentPattern(contentPattern, options);
		const searchConfig = this.configurationService.getValue<ISearchConfiguration>();

		const fallbackToPCRE = folderResources && folderResources.some(folder => {
			const folderConfig = this.configurationService.getValue<ISearchConfiguration>({ resource: folder });
			return !folderConfig.search.useRipgrep;
		});

		const commonQuery = this.commonQuery(folderResources?.map(toWorkspaceFolder), options);
		return {
			...commonQuery,
			type: QueryType.Text,
			contentPattern,
			previewOptions: options.previewOptions,
			maxFileSize: options.maxFileSize,
			usePCRE2: searchConfig.search.usePCRE2 || fallbackToPCRE || false,
			surroundingContext: options.surroundingContext,
			userDisabledExcludesAndIgnoreFiles: options.disregardExcludeSettings && options.disregardIgnoreFiles,

		};
	}

	/**
	 * Adjusts input pattern for config
	 */
	private getContentPattern(inputPattern: IPatternInfo, options: ITextQueryBuilderOptions): IPatternInfo {
		const searchConfig = this.configurationService.getValue<ISearchConfiguration>();

		if (inputPattern.isRegExp) {
			inputPattern.pattern = inputPattern.pattern.replace(/\r?\n/g, '\\n');
		}

		const newPattern = {
			...inputPattern,
			wordSeparators: searchConfig.editor.wordSeparators
		};

		if (this.isCaseSensitive(inputPattern, options)) {
			newPattern.isCaseSensitive = true;
		}

		if (this.isMultiline(inputPattern)) {
			newPattern.isMultiline = true;
		}

		if (options.notebookSearchConfig?.includeMarkupInput) {
			if (!newPattern.notebookInfo) {
				newPattern.notebookInfo = {};
			}
			newPattern.notebookInfo.isInNotebookMarkdownInput = options.notebookSearchConfig.includeMarkupInput;
		}

		if (options.notebookSearchConfig?.includeMarkupPreview) {
			if (!newPattern.notebookInfo) {
				newPattern.notebookInfo = {};
			}
			newPattern.notebookInfo.isInNotebookMarkdownPreview = options.notebookSearchConfig.includeMarkupPreview;
		}

		if (options.notebookSearchConfig?.includeCodeInput) {
			if (!newPattern.notebookInfo) {
				newPattern.notebookInfo = {};
			}
			newPattern.notebookInfo.isInNotebookCellInput = options.notebookSearchConfig.includeCodeInput;
		}

		if (options.notebookSearchConfig?.includeOutput) {
			if (!newPattern.notebookInfo) {
				newPattern.notebookInfo = {};
			}
			newPattern.notebookInfo.isInNotebookCellOutput = options.notebookSearchConfig.includeOutput;
		}

		return newPattern;
	}

	file(folders: (IWorkspaceFolderData | URI)[], options: IFileQueryBuilderOptions = {}): IFileQuery {
		const commonQuery = this.commonQuery(folders, options);
		return {
			...commonQuery,
			type: QueryType.File,
			filePattern: options.filePattern
				? options.filePattern.trim()
				: options.filePattern,
			exists: options.exists,
			sortByScore: options.sortByScore,
			cacheKey: options.cacheKey,
			shouldGlobMatchFilePattern: options.shouldGlobSearch
		};
	}

	private handleIncludeExclude(pattern: string | string[] | undefined, expandPatterns: boolean | undefined): ISearchPathsInfo {
		if (!pattern) {
			return {};
		}

		if (Array.isArray(pattern)) {
			pattern = pattern.filter(p => p.length > 0).map(normalizeSlashes);
			if (!pattern.length) {
				return {};
			}
		} else {
			pattern = normalizeSlashes(pattern);
		}
		return expandPatterns
			? this.parseSearchPaths(pattern)
			: { pattern: patternListToIExpression(...(Array.isArray(pattern) ? pattern : [pattern])) };
	}

	private commonQuery(folderResources: (IWorkspaceFolderData | URI)[] = [], options: ICommonQueryBuilderOptions = {}): ICommonQueryProps<uri> {

		let excludePatterns: string | string[] | undefined = Array.isArray(options.excludePattern) ? options.excludePattern.map(p => p.pattern).flat() : options.excludePattern;
		excludePatterns = excludePatterns?.length === 1 ? excludePatterns[0] : excludePatterns;
		const includeSearchPathsInfo: ISearchPathsInfo = this.handleIncludeExclude(options.includePattern, options.expandPatterns);
		const excludeSearchPathsInfo: ISearchPathsInfo = this.handleIncludeExclude(excludePatterns, options.expandPatterns);

		// Build folderQueries from searchPaths, if given, otherwise folderResources
		const includeFolderName = folderResources.length > 1;
		const folderQueries = (includeSearchPathsInfo.searchPaths && includeSearchPathsInfo.searchPaths.length ?
			includeSearchPathsInfo.searchPaths.map(searchPath => this.getFolderQueryForSearchPath(searchPath, options, excludeSearchPathsInfo)) :
			folderResources.map(folder => this.getFolderQueryForRoot(folder, options, excludeSearchPathsInfo, includeFolderName)))
			.filter(query => !!query) as IFolderQuery[];

		const queryProps: ICommonQueryProps<uri> = {
			_reason: options._reason,
			folderQueries,
			usingSearchPaths: !!(includeSearchPathsInfo.searchPaths && includeSearchPathsInfo.searchPaths.length),
			extraFileResources: options.extraFileResources,

			excludePattern: excludeSearchPathsInfo.pattern,
			includePattern: includeSearchPathsInfo.pattern,
			onlyOpenEditors: options.onlyOpenEditors,
			maxResults: options.maxResults,
			onlyFileScheme: options.onlyFileScheme
		};

		if (options.onlyOpenEditors) {
			const openEditors = arrays.coalesce(this.editorGroupsService.groups.flatMap(group => group.editors.map(editor => editor.resource)));
			this.logService.trace('QueryBuilder#commonQuery - openEditor URIs', JSON.stringify(openEditors));
			const openEditorsInQuery = openEditors.filter(editor => pathIncludedInQuery(queryProps, editor.fsPath));
			const openEditorsQueryProps = this.commonQueryFromFileList(openEditorsInQuery);
			this.logService.trace('QueryBuilder#commonQuery - openEditor Query', JSON.stringify(openEditorsQueryProps));
			return { ...queryProps, ...openEditorsQueryProps };
		}

		// Filter extraFileResources against global include/exclude patterns - they are already expected to not belong to a workspace
		const extraFileResources = options.extraFileResources && options.extraFileResources.filter(extraFile => pathIncludedInQuery(queryProps, extraFile.fsPath));
		queryProps.extraFileResources = extraFileResources && extraFileResources.length ? extraFileResources : undefined;

		return queryProps;
	}

	private commonQueryFromFileList(files: URI[]): ICommonQueryProps<URI> {
		const folderQueries: IFolderQuery[] = [];
		const foldersToSearch: ResourceMap<IFolderQuery> = new ResourceMap();
		const includePattern: glob.IExpression = {};
		let hasIncludedFile = false;
		files.forEach(file => {
			if (file.scheme === Schemas.walkThrough) { return; }

			const providerExists = isAbsolutePath(file);
			// Special case userdata as we don't have a search provider for it, but it can be searched.
			if (providerExists) {

				const searchRoot = this.workspaceContextService.getWorkspaceFolder(file)?.uri ?? this.uriIdentityService.extUri.dirname(file);

				let folderQuery = foldersToSearch.get(searchRoot);
				if (!folderQuery) {
					hasIncludedFile = true;
					folderQuery = { folder: searchRoot, includePattern: {} };
					folderQueries.push(folderQuery);
					foldersToSearch.set(searchRoot, folderQuery);
				}

				const relPath = path.relative(searchRoot.fsPath, file.fsPath);
				assertReturnsDefined(folderQuery.includePattern)[escapeGlobPattern(relPath.replace(/\\/g, '/'))] = true;
			} else {
				if (file.fsPath) {
					hasIncludedFile = true;
					includePattern[escapeGlobPattern(file.fsPath)] = true;
				}
			}
		});

		return {
			folderQueries,
			includePattern,
			usingSearchPaths: true,
			excludePattern: hasIncludedFile ? undefined : { '**/*': true }
		};
	}

	/**
	 * Resolve isCaseSensitive flag based on the query and the isSmartCase flag, for search providers that don't support smart case natively.
	 */
	private isCaseSensitive(contentPattern: IPatternInfo, options: ITextQueryBuilderOptions): boolean {
		if (options.isSmartCase) {
			if (contentPattern.isRegExp) {
				// Consider it case sensitive if it contains an unescaped capital letter
				if (strings.containsUppercaseCharacter(contentPattern.pattern, true)) {
					return true;
				}
			} else if (strings.containsUppercaseCharacter(contentPattern.pattern)) {
				return true;
			}
		}

		return !!contentPattern.isCaseSensitive;
	}

	private isMultiline(contentPattern: IPatternInfo): boolean {
		if (contentPattern.isMultiline) {
			return true;
		}

		if (contentPattern.isRegExp && isMultilineRegexSource(contentPattern.pattern)) {
			return true;
		}

		if (contentPattern.pattern.indexOf('\n') >= 0) {
			return true;
		}

		return !!contentPattern.isMultiline;
	}

	/**
	 * Take the includePattern as seen in the search viewlet, and split into components that look like searchPaths, and
	 * glob patterns. Glob patterns are expanded from 'foo/bar' to '{foo/bar/**, **\/foo/bar}.
	 *
	 * Public for test.
	 */
	parseSearchPaths(pattern: string | string[]): ISearchPathsInfo {
		const isSearchPath = (segment: string) => {
			// A segment is a search path if it is an absolute path or starts with ./, ../, .\, or ..\
			return path.isAbsolute(segment) || /^\.\.?([\/\\]|$)/.test(segment);
		};

		const patterns = Array.isArray(pattern) ? pattern : splitGlobPattern(pattern);
		const segments = patterns
			.map(segment => {
				const userHome = this.pathService.resolvedUserHome;
				if (userHome) {
					return untildify(segment, userHome.scheme === Schemas.file ? userHome.fsPath : userHome.path);
				}

				return segment;
			});
		const groups = collections.groupBy(segments,
			segment => isSearchPath(segment) ? 'searchPaths' : 'exprSegments');

		const expandedExprSegments = (groups.exprSegments || [])
			.map(s => strings.rtrim(s, '/'))
			.map(s => strings.rtrim(s, '\\'))
			.map(p => {
				if (p[0] === '.') {
					p = '*' + p; // convert ".js" to "*.js"
				}

				return expandGlobalGlob(p);
			});

		const result: ISearchPathsInfo = {};
		const searchPaths = this.expandSearchPathPatterns(groups.searchPaths || []);
		if (searchPaths && searchPaths.length) {
			result.searchPaths = searchPaths;
		}

		const exprSegments = expandedExprSegments.flat();
		const includePattern = patternListToIExpression(...exprSegments);
		if (includePattern) {
			result.pattern = includePattern;
		}

		return result;
	}

	private getExcludesForFolder(folderConfig: ISearchConfiguration, options: ICommonQueryBuilderOptions): glob.IExpression | undefined {
		return options.disregardExcludeSettings ?
			undefined :
			getExcludes(folderConfig, !options.disregardSearchExcludeSettings);
	}

	/**
	 * Split search paths (./ or ../ or absolute paths in the includePatterns) into absolute paths and globs applied to those paths
	 */
	private expandSearchPathPatterns(searchPaths: string[]): ISearchPathPattern[] {
		if (!searchPaths || !searchPaths.length) {
			// No workspace => ignore search paths
			return [];
		}

		const expandedSearchPaths = searchPaths.flatMap(searchPath => {
			// 1 open folder => just resolve the search paths to absolute paths
			let { pathPortion, globPortion } = splitGlobFromPath(searchPath);

			if (globPortion) {
				globPortion = normalizeGlobPattern(globPortion);
			}

			// One pathPortion to multiple expanded search paths (e.g. duplicate matching workspace folders)
			const oneExpanded = this.expandOneSearchPath(pathPortion);

			// Expanded search paths to multiple resolved patterns (with ** and without)
			return oneExpanded.flatMap(oneExpandedResult => this.resolveOneSearchPathPattern(oneExpandedResult, globPortion));
		});

		const searchPathPatternMap = new Map<string, ISearchPathPattern>();
		expandedSearchPaths.forEach(oneSearchPathPattern => {
			const key = oneSearchPathPattern.searchPath.toString();
			const existing = searchPathPatternMap.get(key);
			if (existing) {
				if (oneSearchPathPattern.pattern) {
					existing.pattern = existing.pattern || {};
					existing.pattern[oneSearchPathPattern.pattern] = true;
				}
			} else {
				searchPathPatternMap.set(key, {
					searchPath: oneSearchPathPattern.searchPath,
					pattern: oneSearchPathPattern.pattern ? patternListToIExpression(oneSearchPathPattern.pattern) : undefined
				});
			}
		});

		return Array.from(searchPathPatternMap.values());
	}

	/**
	 * Takes a searchPath like `./a/foo` or `../a/foo` and expands it to absolute paths for all the workspaces it matches.
	 */
	private expandOneSearchPath(searchPath: string): IOneSearchPathPattern[] {
		if (path.isAbsolute(searchPath)) {
			const workspaceFolders = this.workspaceContextService.getWorkspace().folders;
			if (workspaceFolders[0] && workspaceFolders[0].uri.scheme !== Schemas.file) {
				return [{
					searchPath: workspaceFolders[0].uri.with({ path: searchPath })
				}];
			}

			// Currently only local resources can be searched for with absolute search paths.
			// TODO convert this to a workspace folder + pattern, so excludes will be resolved properly for an absolute path inside a workspace folder
			return [{
				searchPath: uri.file(path.normalize(searchPath))
			}];
		}

		if (this.workspaceContextService.getWorkbenchState() === WorkbenchState.FOLDER) {
			const workspaceUri = this.workspaceContextService.getWorkspace().folders[0].uri;

			searchPath = normalizeSlashes(searchPath);
			if (searchPath.startsWith('../') || searchPath === '..') {
				const resolvedPath = path.posix.resolve(workspaceUri.path, searchPath);
				return [{
					searchPath: workspaceUri.with({ path: resolvedPath })
				}];
			}

			const cleanedPattern = normalizeGlobPattern(searchPath);
			return [{
				searchPath: workspaceUri,
				pattern: cleanedPattern
			}];
		} else if (searchPath === './' || searchPath === '.\\') {
			return []; // ./ or ./**/foo makes sense for single-folder but not multi-folder workspaces
		} else {
			const searchPathWithoutDotSlash = searchPath.replace(/^\.[\/\\]/, '');
			const folders = this.workspaceContextService.getWorkspace().folders;
			const folderMatches = folders.map(folder => {
				const match = searchPathWithoutDotSlash.match(new RegExp(`^${strings.escapeRegExpCharacters(folder.name)}(?:/(.*)|$)`));
				return match ? {
					match,
					folder
				} : null;
			}).filter(isDefined);

			if (folderMatches.length) {
				return folderMatches.map(match => {
					const patternMatch = match.match[1];
					return {
						searchPath: match.folder.uri,
						pattern: patternMatch && normalizeGlobPattern(patternMatch)
					};
				});
			} else {
				const probableWorkspaceFolderNameMatch = searchPath.match(/\.[\/\\](.+)[\/\\]?/);
				const probableWorkspaceFolderName = probableWorkspaceFolderNameMatch ? probableWorkspaceFolderNameMatch[1] : searchPath;

				// No root folder with name
				const searchPathNotFoundError = nls.localize('search.noWorkspaceWithName', "Workspace folder does not exist: {0}", probableWorkspaceFolderName);
				throw new Error(searchPathNotFoundError);
			}
		}
	}

	private resolveOneSearchPathPattern(oneExpandedResult: IOneSearchPathPattern, globPortion?: string): IOneSearchPathPattern[] {
		const pattern = oneExpandedResult.pattern && globPortion ?
			`${oneExpandedResult.pattern}/${globPortion}` :
			oneExpandedResult.pattern || globPortion;

		const results = [
			{
				searchPath: oneExpandedResult.searchPath,
				pattern
			}];

		if (pattern && !pattern.endsWith('**')) {
			results.push({
				searchPath: oneExpandedResult.searchPath,
				pattern: pattern + '/**'
			});
		}

		return results;
	}

	private getFolderQueryForSearchPath(searchPath: ISearchPathPattern, options: ICommonQueryBuilderOptions, searchPathExcludes: ISearchPathsInfo): IFolderQuery | null {
		const rootConfig = this.getFolderQueryForRoot(toWorkspaceFolder(searchPath.searchPath), options, searchPathExcludes, false);
		if (!rootConfig) {
			return null;
		}

		return {
			...rootConfig,
			...{
				includePattern: searchPath.pattern
			}
		};
	}

	private getFolderQueryForRoot(folder: (IWorkspaceFolderData | URI), options: ICommonQueryBuilderOptions, searchPathExcludes: ISearchPathsInfo, includeFolderName: boolean): IFolderQuery | null {
		let thisFolderExcludeSearchPathPattern: glob.IExpression | undefined;
		const folderUri = URI.isUri(folder) ? folder : folder.uri;

		// only use exclude root if it is different from the folder root
		let excludeFolderRoots = options.excludePattern?.map(excludePattern => {
			const excludeRoot = options.excludePattern && isISearchPatternBuilder(excludePattern) ? excludePattern.uri : undefined;
			const shouldUseExcludeRoot = (!excludeRoot || !(URI.isUri(folder) && this.uriIdentityService.extUri.isEqual(folder, excludeRoot)));
			return shouldUseExcludeRoot ? excludeRoot : undefined;
		});

		if (!excludeFolderRoots?.length) {
			excludeFolderRoots = [undefined];
		}

		if (searchPathExcludes.searchPaths) {
			const thisFolderExcludeSearchPath = searchPathExcludes.searchPaths.filter(sp => isEqual(sp.searchPath, folderUri))[0];
			if (thisFolderExcludeSearchPath && !thisFolderExcludeSearchPath.pattern) {
				// entire folder is excluded
				return null;
			} else if (thisFolderExcludeSearchPath) {
				thisFolderExcludeSearchPathPattern = thisFolderExcludeSearchPath.pattern;
			}
		}

		const folderConfig = this.configurationService.getValue<ISearchConfiguration>({ resource: folderUri });
		const settingExcludes = this.getExcludesForFolder(folderConfig, options);
		const excludePattern: glob.IExpression = {
			...(settingExcludes || {}),
			...(thisFolderExcludeSearchPathPattern || {})
		};

		const folderName = URI.isUri(folder) ? basename(folder) : folder.name;

		const excludePatternRet: ExcludeGlobPattern[] = excludeFolderRoots.map(excludeFolderRoot => {
			return Object.keys(excludePattern).length > 0 ? {
				folder: excludeFolderRoot,
				pattern: excludePattern
			} satisfies ExcludeGlobPattern : undefined;
		}).filter((e) => e) as ExcludeGlobPattern[];

		return {
			folder: folderUri,
			folderName: includeFolderName ? folderName : undefined,
			excludePattern: excludePatternRet,
			fileEncoding: folderConfig.files && folderConfig.files.encoding,
			disregardIgnoreFiles: typeof options.disregardIgnoreFiles === 'boolean' ? options.disregardIgnoreFiles : !folderConfig.search.useIgnoreFiles,
			disregardGlobalIgnoreFiles: typeof options.disregardGlobalIgnoreFiles === 'boolean' ? options.disregardGlobalIgnoreFiles : !folderConfig.search.useGlobalIgnoreFiles,
			disregardParentIgnoreFiles: typeof options.disregardParentIgnoreFiles === 'boolean' ? options.disregardParentIgnoreFiles : !folderConfig.search.useParentIgnoreFiles,
			ignoreSymlinks: typeof options.ignoreSymlinks === 'boolean' ? options.ignoreSymlinks : !folderConfig.search.followSymlinks,
		};
	}
}

function splitGlobFromPath(searchPath: string): { pathPortion: string; globPortion?: string } {
	const globCharMatch = searchPath.match(/[\*\{\}\(\)\[\]\?]/);
	if (globCharMatch) {
		const globCharIdx = globCharMatch.index;
		const lastSlashMatch = searchPath.substr(0, globCharIdx).match(/[/|\\][^/\\]*$/);
		if (lastSlashMatch) {
			let pathPortion = searchPath.substr(0, lastSlashMatch.index);
			if (!pathPortion.match(/[/\\]/)) {
				// If the last slash was the only slash, then we now have '' or 'C:' or '.'. Append a slash.
				pathPortion += '/';
			}

			return {
				pathPortion,
				globPortion: searchPath.substr((lastSlashMatch.index || 0) + 1)
			};
		}
	}

	// No glob char, or malformed
	return {
		pathPortion: searchPath
	};
}

function patternListToIExpression(...patterns: string[]): glob.IExpression | undefined {
	return patterns.length ?
		patterns.reduce((glob, cur) => { glob[cur] = true; return glob; }, Object.create(null)) :
		undefined;
}

function splitGlobPattern(pattern: string): string[] {
	return glob.splitGlobAware(pattern, ',')
		.map(s => s.trim())
		.filter(s => !!s.length);
}

/**
 * Note - we used {} here previously but ripgrep can't handle nested {} patterns. See https://github.com/microsoft/vscode/issues/32761
 */
function expandGlobalGlob(pattern: string): string[] {
	const patterns = [
		`**/${pattern}/**`,
		`**/${pattern}`
	];

	return patterns.map(p => p.replace(/\*\*\/\*\*/g, '**'));
}

function normalizeSlashes(pattern: string): string {
	return pattern.replace(/\\/g, '/');
}

/**
 * Normalize slashes, remove `./` and trailing slashes
 */
function normalizeGlobPattern(pattern: string): string {
	return normalizeSlashes(pattern)
		.replace(/^\.\//, '')
		.replace(/\/+$/g, '');
}

/**
 * Escapes a path for use as a glob pattern that would match the input precisely.
 * Characters '?', '*', '[', and ']' are escaped into character range glob syntax
 * (for example, '?' becomes '[?]').
 * NOTE: This implementation makes no special cases for UNC paths. For example,
 * given the input "//?/C:/A?.txt", this would produce output '//[?]/C:/A[?].txt',
 * which may not be desirable in some cases. Use with caution if UNC paths could be expected.
 */
export function escapeGlobPattern(path: string): string {
	return path.replace(/([?*[\]])/g, '[$1]');
}

/**
 * Construct an include pattern from a list of folders uris to search in.
 */
export function resolveResourcesForSearchIncludes(resources: URI[], contextService: IWorkspaceContextService): string[] {
	resources = arrays.distinct(resources, resource => resource.toString());

	const folderPaths: string[] = [];
	const workspace = contextService.getWorkspace();

	if (resources) {
		resources.forEach(resource => {
			let folderPath: string | undefined;
			if (contextService.getWorkbenchState() === WorkbenchState.FOLDER) {
				// Show relative path from the root for single-root mode
				folderPath = relativePath(workspace.folders[0].uri, resource); // always uses forward slashes
				if (folderPath && folderPath !== '.') {
					folderPath = './' + folderPath;
				}
			} else {
				const owningFolder = contextService.getWorkspaceFolder(resource);
				if (owningFolder) {
					const owningRootName = owningFolder.name;
					// If this root is the only one with its basename, use a relative ./ path. If there is another, use an absolute path
					const isUniqueFolder = workspace.folders.filter(folder => folder.name === owningRootName).length === 1;
					if (isUniqueFolder) {
						const relPath = relativePath(owningFolder.uri, resource); // always uses forward slashes
						if (relPath === '') {
							folderPath = `./${owningFolder.name}`;
						} else {
							folderPath = `./${owningFolder.name}/${relPath}`;
						}
					} else {
						folderPath = resource.fsPath; // TODO rob: handle non-file URIs
					}
				}
			}

			if (folderPath) {
				folderPaths.push(escapeGlobPattern(folderPath));
			}
		});
	}
	return folderPaths;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/common/replace.ts]---
Location: vscode-main/src/vs/workbench/services/search/common/replace.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as strings from '../../../../base/common/strings.js';
import { IPatternInfo } from './search.js';
import { CharCode } from '../../../../base/common/charCode.js';
import { buildReplaceStringWithCasePreserved } from '../../../../base/common/search.js';

export class ReplacePattern {

	private _replacePattern: string;
	private _hasParameters: boolean = false;
	private _regExp: RegExp;
	private _caseOpsRegExp: RegExp;

	constructor(replaceString: string, searchPatternInfo: IPatternInfo);
	constructor(replaceString: string, parseParameters: boolean, regEx: RegExp);
	constructor(replaceString: string, arg2: any, arg3?: any) {
		this._replacePattern = replaceString;
		let searchPatternInfo: IPatternInfo;
		let parseParameters: boolean;
		if (typeof arg2 === 'boolean') {
			parseParameters = arg2;
			this._regExp = arg3;

		} else {
			searchPatternInfo = arg2;
			parseParameters = !!searchPatternInfo.isRegExp;
			this._regExp = strings.createRegExp(searchPatternInfo.pattern, !!searchPatternInfo.isRegExp, { matchCase: searchPatternInfo.isCaseSensitive, wholeWord: searchPatternInfo.isWordMatch, multiline: searchPatternInfo.isMultiline, global: false, unicode: true });
		}

		if (parseParameters) {
			this.parseReplaceString(replaceString);
		}

		if (this._regExp.global) {
			this._regExp = strings.createRegExp(this._regExp.source, true, { matchCase: !this._regExp.ignoreCase, wholeWord: false, multiline: this._regExp.multiline, global: false });
		}

		this._caseOpsRegExp = new RegExp(/([\s\S]*?)((?:\\[uUlL])+?|)(\$[0-9]+)([\s\S]*?)/g);
	}

	get hasParameters(): boolean {
		return this._hasParameters;
	}

	get pattern(): string {
		return this._replacePattern;
	}

	get regExp(): RegExp {
		return this._regExp;
	}

	/**
	* Returns the replace string for the first match in the given text.
	* If text has no matches then returns null.
	*/
	getReplaceString(text: string, preserveCase?: boolean): string | null {
		this._regExp.lastIndex = 0;
		const match = this._regExp.exec(text);
		if (match) {
			if (this.hasParameters) {
				const replaceString = this.replaceWithCaseOperations(text, this._regExp, this.buildReplaceString(match, preserveCase));
				if (match[0] === text) {
					return replaceString;
				}
				return replaceString.substr(match.index, match[0].length - (text.length - replaceString.length));
			}
			return this.buildReplaceString(match, preserveCase);
		}

		return null;
	}

	/**
	 * replaceWithCaseOperations applies case operations to relevant replacement strings and applies
	 * the affected $N arguments. It then passes unaffected $N arguments through to string.replace().
	 *
	 * \u			=> upper-cases one character in a match.
	 * \U			=> upper-cases ALL remaining characters in a match.
	 * \l			=> lower-cases one character in a match.
	 * \L			=> lower-cases ALL remaining characters in a match.
	 */
	private replaceWithCaseOperations(text: string, regex: RegExp, replaceString: string): string {
		// Short-circuit the common path.
		if (!/\\[uUlL]/.test(replaceString)) {
			return text.replace(regex, replaceString);
		}
		// Store the values of the search parameters.
		const firstMatch = regex.exec(text);
		if (firstMatch === null) {
			return text.replace(regex, replaceString);
		}

		let patMatch: RegExpExecArray | null;
		let newReplaceString = '';
		let lastIndex = 0;
		let lastMatch = '';
		// For each annotated $N, perform text processing on the parameters and perform the substitution.
		while ((patMatch = this._caseOpsRegExp.exec(replaceString)) !== null) {
			lastIndex = patMatch.index;
			const fullMatch = patMatch[0];
			lastMatch = fullMatch;
			let caseOps = patMatch[2]; // \u, \l\u, etc.
			const money = patMatch[3]; // $1, $2, etc.

			if (!caseOps) {
				newReplaceString += fullMatch;
				continue;
			}
			const replacement = firstMatch[parseInt(money.slice(1))];
			if (!replacement) {
				newReplaceString += fullMatch;
				continue;
			}
			const replacementLen = replacement.length;

			newReplaceString += patMatch[1]; // prefix
			caseOps = caseOps.replace(/\\/g, '');
			let i = 0;
			for (; i < caseOps.length; i++) {
				switch (caseOps[i]) {
					case 'U':
						newReplaceString += replacement.slice(i).toUpperCase();
						i = replacementLen;
						break;
					case 'u':
						newReplaceString += replacement[i].toUpperCase();
						break;
					case 'L':
						newReplaceString += replacement.slice(i).toLowerCase();
						i = replacementLen;
						break;
					case 'l':
						newReplaceString += replacement[i].toLowerCase();
						break;
				}
			}
			// Append any remaining replacement string content not covered by case operations.
			if (i < replacementLen) {
				newReplaceString += replacement.slice(i);
			}

			newReplaceString += patMatch[4]; // suffix
		}

		// Append any remaining trailing content after the final regex match.
		newReplaceString += replaceString.slice(lastIndex + lastMatch.length);

		return text.replace(regex, newReplaceString);
	}

	public buildReplaceString(matches: string[] | null, preserveCase?: boolean): string {
		if (preserveCase) {
			return buildReplaceStringWithCasePreserved(matches, this._replacePattern);
		} else {
			return this._replacePattern;
		}
	}

	/**
	 * \n => LF
	 * \t => TAB
	 * \\ => \
	 * $0 => $& (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter)
	 * everything else stays untouched
	 */
	private parseReplaceString(replaceString: string): void {
		if (!replaceString || replaceString.length === 0) {
			return;
		}

		let substrFrom = 0, result = '';
		for (let i = 0, len = replaceString.length; i < len; i++) {
			const chCode = replaceString.charCodeAt(i);

			if (chCode === CharCode.Backslash) {

				// move to next char
				i++;

				if (i >= len) {
					// string ends with a \
					break;
				}

				const nextChCode = replaceString.charCodeAt(i);
				let replaceWithCharacter: string | null = null;

				switch (nextChCode) {
					case CharCode.Backslash:
						// \\ => \
						replaceWithCharacter = '\\';
						break;
					case CharCode.n:
						// \n => LF
						replaceWithCharacter = '\n';
						break;
					case CharCode.t:
						// \t => TAB
						replaceWithCharacter = '\t';
						break;
				}

				if (replaceWithCharacter) {
					result += replaceString.substring(substrFrom, i - 1) + replaceWithCharacter;
					substrFrom = i + 1;
				}
			}

			if (chCode === CharCode.DollarSign) {

				// move to next char
				i++;

				if (i >= len) {
					// string ends with a $
					break;
				}

				const nextChCode = replaceString.charCodeAt(i);
				let replaceWithCharacter: string | null = null;

				switch (nextChCode) {
					case CharCode.Digit0:
						// $0 => $&
						replaceWithCharacter = '$&';
						this._hasParameters = true;
						break;
					case CharCode.BackTick:
					case CharCode.SingleQuote:
						this._hasParameters = true;
						break;
					default: {
						// check if it is a valid string parameter $n (0 <= n <= 99). $0 is already handled by now.
						if (!this.between(nextChCode, CharCode.Digit1, CharCode.Digit9)) {
							break;
						}
						if (i === replaceString.length - 1) {
							this._hasParameters = true;
							break;
						}
						let charCode = replaceString.charCodeAt(++i);
						if (!this.between(charCode, CharCode.Digit0, CharCode.Digit9)) {
							this._hasParameters = true;
							--i;
							break;
						}
						if (i === replaceString.length - 1) {
							this._hasParameters = true;
							break;
						}
						charCode = replaceString.charCodeAt(++i);
						if (!this.between(charCode, CharCode.Digit0, CharCode.Digit9)) {
							this._hasParameters = true;
							--i;
							break;
						}
						break;
					}
				}

				if (replaceWithCharacter) {
					result += replaceString.substring(substrFrom, i - 1) + replaceWithCharacter;
					substrFrom = i + 1;
				}
			}
		}

		if (substrFrom === 0) {
			// no replacement occurred
			return;
		}

		this._replacePattern = result + replaceString.substring(substrFrom);
	}

	private between(value: number, from: number, to: number): boolean {
		return from <= value && value <= to;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/common/search.ts]---
Location: vscode-main/src/vs/workbench/services/search/common/search.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mapArrayOrNot } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import * as glob from '../../../../base/common/glob.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import * as objects from '../../../../base/common/objects.js';
import * as extpath from '../../../../base/common/extpath.js';
import { fuzzyContains, getNLines } from '../../../../base/common/strings.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { IFilesConfiguration } from '../../../../platform/files/common/files.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ITelemetryData } from '../../../../platform/telemetry/common/telemetry.js';
import { Event } from '../../../../base/common/event.js';
import * as paths from '../../../../base/common/path.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { AISearchKeyword, GlobPattern, TextSearchCompleteMessageType } from './searchExtTypes.js';
import { isThenable } from '../../../../base/common/async.js';
import { ResourceSet } from '../../../../base/common/map.js';

export { TextSearchCompleteMessageType };

export const VIEWLET_ID = 'workbench.view.search';
export const PANEL_ID = 'workbench.panel.search';
export const VIEW_ID = 'workbench.view.search';
export const SEARCH_RESULT_LANGUAGE_ID = 'search-result';

export const SEARCH_EXCLUDE_CONFIG = 'search.exclude';
export const DEFAULT_MAX_SEARCH_RESULTS = 20000;

// Warning: this pattern is used in the search editor to detect offsets. If you
// change this, also change the search-result built-in extension
const SEARCH_ELIDED_PREFIX = '⟪ ';
const SEARCH_ELIDED_SUFFIX = ' characters skipped ⟫';
const SEARCH_ELIDED_MIN_LEN = (SEARCH_ELIDED_PREFIX.length + SEARCH_ELIDED_SUFFIX.length + 5) * 2;

export const ISearchService = createDecorator<ISearchService>('searchService');

/**
 * A service that enables to search for files or with in files.
 */
export interface ISearchService {
	readonly _serviceBrand: undefined;
	textSearch(query: ITextQuery, token?: CancellationToken, onProgress?: (result: ISearchProgressItem) => void): Promise<ISearchComplete>;
	aiTextSearch(query: IAITextQuery, token?: CancellationToken, onProgress?: (result: ISearchProgressItem) => void): Promise<ISearchComplete>;
	getAIName(): Promise<string | undefined>;
	textSearchSplitSyncAsync(query: ITextQuery, token?: CancellationToken | undefined, onProgress?: ((result: ISearchProgressItem) => void) | undefined, notebookFilesToIgnore?: ResourceSet, asyncNotebookFilesToIgnore?: Promise<ResourceSet>): { syncResults: ISearchComplete; asyncResults: Promise<ISearchComplete> };
	fileSearch(query: IFileQuery, token?: CancellationToken): Promise<ISearchComplete>;
	schemeHasFileSearchProvider(scheme: string): boolean;
	clearCache(cacheKey: string): Promise<void>;
	registerSearchResultProvider(scheme: string, type: SearchProviderType, provider: ISearchResultProvider): IDisposable;
}

/**
 * TODO@roblou - split text from file search entirely, or share code in a more natural way.
 */
export const enum SearchProviderType {
	file,
	text,
	aiText
}

export interface ISearchResultProvider {
	getAIName(): Promise<string | undefined>;
	textSearch(query: ITextQuery, onProgress?: (p: ISearchProgressItem) => void, token?: CancellationToken): Promise<ISearchComplete>;
	fileSearch(query: IFileQuery, token?: CancellationToken): Promise<ISearchComplete>;
	clearCache(cacheKey: string): Promise<void>;
}


export interface ExcludeGlobPattern<U extends UriComponents = URI> {
	folder?: U;
	pattern: glob.IExpression;
}

export interface IFolderQuery<U extends UriComponents = URI> {
	folder: U;
	folderName?: string;
	excludePattern?: ExcludeGlobPattern<U>[];
	includePattern?: glob.IExpression;
	fileEncoding?: string;
	disregardIgnoreFiles?: boolean;
	disregardGlobalIgnoreFiles?: boolean;
	disregardParentIgnoreFiles?: boolean;
	ignoreSymlinks?: boolean;
}

export interface ICommonQueryProps<U extends UriComponents> {
	/** For telemetry - indicates what is triggering the source */
	_reason?: string;

	folderQueries: IFolderQuery<U>[];
	// The include pattern for files that gets passed into ripgrep.
	// Note that this will override any ignore files if applicable.
	includePattern?: glob.IExpression;
	excludePattern?: glob.IExpression;
	extraFileResources?: U[];

	onlyOpenEditors?: boolean;

	maxResults?: number;
	usingSearchPaths?: boolean;
	onlyFileScheme?: boolean;
}

export interface IFileQueryProps<U extends UriComponents> extends ICommonQueryProps<U> {
	type: QueryType.File;
	filePattern?: string;

	// when walking through the tree to find the result, don't use the filePattern to fuzzy match.
	// Instead, should use glob matching.
	shouldGlobMatchFilePattern?: boolean;

	/**
	 * If true no results will be returned. Instead `limitHit` will indicate if at least one result exists or not.
	 * Currently does not work with queries including a 'siblings clause'.
	 */
	exists?: boolean;
	sortByScore?: boolean;
	cacheKey?: string;
}

export interface ITextQueryProps<U extends UriComponents> extends ICommonQueryProps<U> {
	type: QueryType.Text;
	contentPattern: IPatternInfo;

	previewOptions?: ITextSearchPreviewOptions;
	maxFileSize?: number;
	usePCRE2?: boolean;
	surroundingContext?: number;

	userDisabledExcludesAndIgnoreFiles?: boolean;
}

export interface IAITextQueryProps<U extends UriComponents> extends ICommonQueryProps<U> {
	type: QueryType.aiText;
	contentPattern: string;

	previewOptions?: ITextSearchPreviewOptions;
	maxFileSize?: number;
	surroundingContext?: number;

	userDisabledExcludesAndIgnoreFiles?: boolean;
}

export type IFileQuery = IFileQueryProps<URI>;
export type IRawFileQuery = IFileQueryProps<UriComponents>;
export type ITextQuery = ITextQueryProps<URI>;
export type IRawTextQuery = ITextQueryProps<UriComponents>;
export type IAITextQuery = IAITextQueryProps<URI>;
export type IRawAITextQuery = IAITextQueryProps<UriComponents>;

export type IRawQuery = IRawTextQuery | IRawFileQuery | IRawAITextQuery;
export type ISearchQuery = ITextQuery | IFileQuery | IAITextQuery;
export type ITextSearchQuery = ITextQuery | IAITextQuery;

export const enum QueryType {
	File = 1,
	Text = 2,
	aiText = 3
}

/* __GDPR__FRAGMENT__
	"IPatternInfo" : {
		"isRegExp": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
		"isWordMatch": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
		"wordSeparators": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
		"isMultiline": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
		"isCaseSensitive": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
		"isSmartCase": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
	}
*/
export interface IPatternInfo {
	pattern: string;
	isRegExp?: boolean;
	isWordMatch?: boolean;
	wordSeparators?: string;
	isMultiline?: boolean;
	isUnicode?: boolean;
	isCaseSensitive?: boolean;
	notebookInfo?: INotebookPatternInfo;
}

export interface INotebookPatternInfo {
	isInNotebookMarkdownInput?: boolean;
	isInNotebookMarkdownPreview?: boolean;
	isInNotebookCellInput?: boolean;
	isInNotebookCellOutput?: boolean;
}

export interface IExtendedExtensionSearchOptions {
	usePCRE2?: boolean;
}

export interface IFileMatch<U extends UriComponents = URI> {
	resource: U;
	results?: ITextSearchResult<U>[];
}

export type IRawFileMatch2 = IFileMatch<UriComponents>;

export interface ITextSearchPreviewOptions {
	matchLines: number;
	charsPerLine: number;
}

export interface ISearchRange {
	readonly startLineNumber: number;
	readonly startColumn: number;
	readonly endLineNumber: number;
	readonly endColumn: number;
}

export interface ITextSearchMatch<U extends UriComponents = URI> {
	uri?: U;
	rangeLocations: SearchRangeSetPairing[];
	previewText: string;
	webviewIndex?: number;
	cellFragment?: string;
}

export interface ITextSearchContext<U extends UriComponents = URI> {
	uri?: U;
	text: string;
	lineNumber: number;
}

export type ITextSearchResult<U extends UriComponents = URI> = ITextSearchMatch<U> | ITextSearchContext<U>;

export function resultIsMatch(result: ITextSearchResult): result is ITextSearchMatch {
	return !!(<ITextSearchMatch>result).rangeLocations && !!(<ITextSearchMatch>result).previewText;
}

export interface IProgressMessage {
	message: string;
}

export type ISearchProgressItem = IFileMatch | IProgressMessage | AISearchKeyword;

export function isFileMatch(p: ISearchProgressItem): p is IFileMatch {
	return !!(<IFileMatch>p).resource;
}

export function isAIKeyword(p: ISearchProgressItem): p is AISearchKeyword {
	return !!(<AISearchKeyword>p).keyword;
}

export function isProgressMessage(p: ISearchProgressItem | ISerializedSearchProgressItem): p is IProgressMessage {
	return !!(p as IProgressMessage).message;
}

export interface ITextSearchCompleteMessage {
	text: string;
	type: TextSearchCompleteMessageType;
	trusted?: boolean;
}

export interface ISearchCompleteStats {
	limitHit?: boolean;
	messages: ITextSearchCompleteMessage[];
	stats?: IFileSearchStats | ITextSearchStats;
}

export interface ISearchComplete extends ISearchCompleteStats {
	results: IFileMatch[];
	exit?: SearchCompletionExitCode;
	aiKeywords?: AISearchKeyword[];
}

export const enum SearchCompletionExitCode {
	Normal,
	NewSearchStarted
}

export interface ITextSearchStats {
	type: 'textSearchProvider' | 'searchProcess' | 'aiTextSearchProvider';
}

export interface IFileSearchStats {
	fromCache: boolean;
	detailStats: ISearchEngineStats | ICachedSearchStats | IFileSearchProviderStats;

	resultCount: number;
	type: 'fileSearchProvider' | 'searchProcess';
	sortingTime?: number;
}

export interface ICachedSearchStats {
	cacheWasResolved: boolean;
	cacheLookupTime: number;
	cacheFilterTime: number;
	cacheEntryCount: number;
}

export interface ISearchEngineStats {
	fileWalkTime: number;
	directoriesWalked: number;
	filesWalked: number;
	cmdTime: number;
	cmdResultCount?: number;
}

export interface IFileSearchProviderStats {
	providerTime: number;
	postProcessTime: number;
}

export class FileMatch implements IFileMatch {
	results: ITextSearchResult[] = [];
	constructor(public resource: URI) {
		// empty
	}
}

export interface SearchRangeSetPairing {
	source: ISearchRange;
	preview: ISearchRange;
}

export class TextSearchMatch implements ITextSearchMatch {
	rangeLocations: SearchRangeSetPairing[] = [];
	previewText: string;
	webviewIndex?: number;

	constructor(text: string, ranges: ISearchRange | ISearchRange[], previewOptions?: ITextSearchPreviewOptions, webviewIndex?: number) {
		this.webviewIndex = webviewIndex;

		// Trim preview if this is one match and a single-line match with a preview requested.
		// Otherwise send the full text, like for replace or for showing multiple previews.
		// TODO this is fishy.
		const rangesArr = Array.isArray(ranges) ? ranges : [ranges];

		if (previewOptions && previewOptions.matchLines === 1 && isSingleLineRangeList(rangesArr)) {
			// 1 line preview requested
			text = getNLines(text, previewOptions.matchLines);

			let result = '';
			let shift = 0;
			let lastEnd = 0;
			const leadingChars = Math.floor(previewOptions.charsPerLine / 5);
			for (const range of rangesArr) {
				const previewStart = Math.max(range.startColumn - leadingChars, 0);
				const previewEnd = range.startColumn + previewOptions.charsPerLine;
				if (previewStart > lastEnd + leadingChars + SEARCH_ELIDED_MIN_LEN) {
					const elision = SEARCH_ELIDED_PREFIX + (previewStart - lastEnd) + SEARCH_ELIDED_SUFFIX;
					result += elision + text.slice(previewStart, previewEnd);
					shift += previewStart - (lastEnd + elision.length);
				} else {
					result += text.slice(lastEnd, previewEnd);
				}

				lastEnd = previewEnd;
				this.rangeLocations.push({
					source: range,
					preview: new OneLineRange(0, range.startColumn - shift, range.endColumn - shift)
				});

			}

			this.previewText = result;
		} else {
			const firstMatchLine = Array.isArray(ranges) ? ranges[0].startLineNumber : ranges.startLineNumber;

			const rangeLocs = mapArrayOrNot(ranges, r => ({
				preview: new SearchRange(r.startLineNumber - firstMatchLine, r.startColumn, r.endLineNumber - firstMatchLine, r.endColumn),
				source: r
			}));

			this.rangeLocations = Array.isArray(rangeLocs) ? rangeLocs : [rangeLocs];
			this.previewText = text;
		}
	}
}

function isSingleLineRangeList(ranges: ISearchRange[]): boolean {
	const line = ranges[0].startLineNumber;
	for (const r of ranges) {
		if (r.startLineNumber !== line || r.endLineNumber !== line) {
			return false;
		}
	}

	return true;
}

export class SearchRange implements ISearchRange {
	startLineNumber: number;
	startColumn: number;
	endLineNumber: number;
	endColumn: number;

	constructor(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number) {
		this.startLineNumber = startLineNumber;
		this.startColumn = startColumn;
		this.endLineNumber = endLineNumber;
		this.endColumn = endColumn;
	}
}

export class OneLineRange extends SearchRange {
	constructor(lineNumber: number, startColumn: number, endColumn: number) {
		super(lineNumber, startColumn, lineNumber, endColumn);
	}
}

export const enum ViewMode {
	List = 'list',
	Tree = 'tree'
}

export const enum SearchSortOrder {
	Default = 'default',
	FileNames = 'fileNames',
	Type = 'type',
	Modified = 'modified',
	CountDescending = 'countDescending',
	CountAscending = 'countAscending'
}

export const enum SemanticSearchBehavior {
	Auto = 'auto',
	Manual = 'manual',
	RunOnEmpty = 'runOnEmpty',
}

export interface ISearchConfigurationProperties {
	exclude: glob.IExpression;
	useRipgrep: boolean;
	/**
	 * Use ignore file for file search.
	 */
	useIgnoreFiles: boolean;
	useGlobalIgnoreFiles: boolean;
	useParentIgnoreFiles: boolean;
	followSymlinks: boolean;
	smartCase: boolean;
	globalFindClipboard: boolean;
	location: 'sidebar' | 'panel';
	useReplacePreview: boolean;
	showLineNumbers: boolean;
	usePCRE2: boolean;
	actionsPosition: 'auto' | 'right';
	maintainFileSearchCache: boolean;
	maxResults: number | null;
	collapseResults: 'auto' | 'alwaysCollapse' | 'alwaysExpand';
	searchOnType: boolean;
	seedOnFocus: boolean;
	seedWithNearestWord: boolean;
	searchOnTypeDebouncePeriod: number;
	mode: 'view' | 'reuseEditor' | 'newEditor';
	searchEditor: {
		doubleClickBehaviour: 'selectWord' | 'goToLocation' | 'openLocationToSide';
		singleClickBehaviour: 'default' | 'peekDefinition';
		reusePriorSearchConfiguration: boolean;
		defaultNumberOfContextLines: number | null;
		focusResultsOnSearch: boolean;
		experimental: {};
	};
	sortOrder: SearchSortOrder;
	decorations: {
		colors: boolean;
		badges: boolean;
	};
	quickAccess: {
		preserveInput: boolean;
	};
	defaultViewMode: ViewMode;
	experimental: {
		closedNotebookRichContentResults: boolean;
	};
	searchView: {
		semanticSearchBehavior: string;
		keywordSuggestions: boolean;
	};
}

export interface ISearchConfiguration extends IFilesConfiguration {
	search: ISearchConfigurationProperties;
	editor: {
		wordSeparators: string;
	};
}

export function getExcludes(configuration: ISearchConfiguration, includeSearchExcludes = true): glob.IExpression | undefined {
	const fileExcludes = configuration && configuration.files && configuration.files.exclude;
	const searchExcludes = includeSearchExcludes && configuration && configuration.search && configuration.search.exclude;

	if (!fileExcludes && !searchExcludes) {
		return undefined;
	}

	if (!fileExcludes || !searchExcludes) {
		return fileExcludes || searchExcludes || undefined;
	}

	let allExcludes: glob.IExpression = Object.create(null);
	// clone the config as it could be frozen
	allExcludes = objects.mixin(allExcludes, objects.deepClone(fileExcludes));
	allExcludes = objects.mixin(allExcludes, objects.deepClone(searchExcludes), true);

	return allExcludes;
}

export function pathIncludedInQuery(queryProps: ICommonQueryProps<URI>, fsPath: string): boolean {
	if (queryProps.excludePattern && glob.match(queryProps.excludePattern, fsPath)) {
		return false;
	}

	if (queryProps.includePattern || queryProps.usingSearchPaths) {
		if (queryProps.includePattern && glob.match(queryProps.includePattern, fsPath)) {
			return true;
		}

		// If searchPaths are being used, the extra file must be in a subfolder and match the pattern, if present
		if (queryProps.usingSearchPaths) {
			return !!queryProps.folderQueries && queryProps.folderQueries.some(fq => {
				const searchPath = fq.folder.fsPath;
				if (extpath.isEqualOrParent(fsPath, searchPath)) {
					const relPath = paths.relative(searchPath, fsPath);
					return !fq.includePattern || !!glob.match(fq.includePattern, relPath);
				} else {
					return false;
				}
			});
		}

		return false;
	}

	return true;
}

export enum SearchErrorCode {
	unknownEncoding = 1,
	regexParseError,
	globParseError,
	invalidLiteral,
	rgProcessError,
	other,
	canceled
}

export class SearchError extends Error {
	constructor(message: string, readonly code?: SearchErrorCode) {
		super(message);
	}
}

export function deserializeSearchError(error: Error): SearchError {
	const errorMsg = error.message;

	if (isCancellationError(error)) {
		return new SearchError(errorMsg, SearchErrorCode.canceled);
	}

	try {
		const details = JSON.parse(errorMsg);
		return new SearchError(details.message, details.code);
	} catch (e) {
		return new SearchError(errorMsg, SearchErrorCode.other);
	}
}

export function serializeSearchError(searchError: SearchError): Error {
	const details = { message: searchError.message, code: searchError.code };
	return new Error(JSON.stringify(details));
}
export interface ITelemetryEvent {
	eventName: string;
	data: ITelemetryData;
}

export interface IRawSearchService {
	fileSearch(search: IRawFileQuery): Event<ISerializedSearchProgressItem | ISerializedSearchComplete>;
	textSearch(search: IRawTextQuery): Event<ISerializedSearchProgressItem | ISerializedSearchComplete>;
	clearCache(cacheKey: string): Promise<void>;
}

export interface IRawFileMatch {
	base?: string;
	/**
	 * The path of the file relative to the containing `base` folder.
	 * This path is exactly as it appears on the filesystem.
	 */
	relativePath: string;
	/**
	 * This path is transformed for search purposes. For example, this could be
	 * the `relativePath` with the workspace folder name prepended. This way the
	 * search algorithm would also match against the name of the containing folder.
	 *
	 * If not given, the search algorithm should use `relativePath`.
	 */
	searchPath: string | undefined;
}

export interface ISearchEngine<T> {
	search: (onResult: (matches: T) => void, onProgress: (progress: IProgressMessage) => void, done: (error: Error | null, complete: ISearchEngineSuccess) => void) => void;
	cancel: () => void;
}

export interface ISerializedSearchSuccess {
	type: 'success';
	limitHit: boolean;
	messages: ITextSearchCompleteMessage[];
	stats?: IFileSearchStats | ITextSearchStats;
}

export interface ISearchEngineSuccess {
	limitHit: boolean;
	messages: ITextSearchCompleteMessage[];
	stats: ISearchEngineStats;
}

export interface ISerializedSearchError {
	type: 'error';
	error: {
		message: string;
		stack: string;
	};
}

export type ISerializedSearchComplete = ISerializedSearchSuccess | ISerializedSearchError;

export function isSerializedSearchComplete(arg: ISerializedSearchProgressItem | ISerializedSearchComplete): arg is ISerializedSearchComplete {
	// eslint-disable-next-line local/code-no-any-casts
	if ((arg as any).type === 'error') {
		return true;
		// eslint-disable-next-line local/code-no-any-casts
	} else if ((arg as any).type === 'success') {
		return true;
	} else {
		return false;
	}
}

export function isSerializedSearchSuccess(arg: ISerializedSearchComplete): arg is ISerializedSearchSuccess {
	return arg.type === 'success';
}

export function isSerializedFileMatch(arg: ISerializedSearchProgressItem): arg is ISerializedFileMatch {
	return !!(<ISerializedFileMatch>arg).path;
}

export function isFilePatternMatch(candidate: IRawFileMatch, filePatternToUse: string, fuzzy = true): boolean {
	const pathToMatch = candidate.searchPath ? candidate.searchPath : candidate.relativePath;
	return fuzzy ?
		fuzzyContains(pathToMatch, filePatternToUse) :
		glob.match(filePatternToUse, pathToMatch);
}

export interface ISerializedFileMatch {
	path: string;
	results?: ITextSearchResult[];
	numMatches?: number;
}

// Type of the possible values for progress calls from the engine
export type ISerializedSearchProgressItem = ISerializedFileMatch | ISerializedFileMatch[] | IProgressMessage;
export type IFileSearchProgressItem = IRawFileMatch | IRawFileMatch[] | IProgressMessage;


export class SerializableFileMatch implements ISerializedFileMatch {
	path: string;
	results: ITextSearchMatch[];

	constructor(path: string) {
		this.path = path;
		this.results = [];
	}

	addMatch(match: ITextSearchMatch): void {
		this.results.push(match);
	}

	serialize(): ISerializedFileMatch {
		return {
			path: this.path,
			results: this.results,
			numMatches: this.results.length
		};
	}
}

/**
 *  Computes the patterns that the provider handles. Discards sibling clauses and 'false' patterns
 */
export function resolvePatternsForProvider(globalPattern: glob.IExpression | undefined, folderPattern: glob.IExpression | undefined): string[] {
	const merged = {
		...(globalPattern || {}),
		...(folderPattern || {})
	};

	return Object.keys(merged)
		.filter(key => {
			const value = merged[key];
			return typeof value === 'boolean' && value;
		});
}

export class QueryGlobTester {

	private _excludeExpression: glob.IExpression[]; // TODO: evaluate globs based on baseURI of pattern
	private _parsedExcludeExpression: glob.ParsedExpression[];

	private _parsedIncludeExpression: glob.ParsedExpression | null = null;

	constructor(config: ISearchQuery, folderQuery: IFolderQuery) {
		// todo: try to incorporate folderQuery.excludePattern.folder if available
		this._excludeExpression = folderQuery.excludePattern?.map(excludePattern => {
			return {
				...(config.excludePattern || {}),
				...(excludePattern.pattern || {})
			} satisfies glob.IExpression;
		}) ?? [];

		if (this._excludeExpression.length === 0) {
			// even if there are no folderQueries, we want to observe  the global excludes
			this._excludeExpression = [config.excludePattern || {}];
		}

		this._parsedExcludeExpression = this._excludeExpression.map(e => glob.parse(e));

		// Empty includeExpression means include nothing, so no {} shortcuts
		let includeExpression: glob.IExpression | undefined = config.includePattern;
		if (folderQuery.includePattern) {
			if (includeExpression) {
				includeExpression = {
					...includeExpression,
					...folderQuery.includePattern
				};
			} else {
				includeExpression = folderQuery.includePattern;
			}
		}

		if (includeExpression) {
			this._parsedIncludeExpression = glob.parse(includeExpression);
		}
	}

	private _evalParsedExcludeExpression(testPath: string, basename: string | undefined, hasSibling?: (name: string) => boolean): string | null {
		// todo: less hacky way of evaluating sync vs async sibling clauses
		let result: string | null = null;

		for (const folderExclude of this._parsedExcludeExpression) {

			// find first non-null result
			const evaluation = folderExclude(testPath, basename, hasSibling);

			if (typeof evaluation === 'string') {
				result = evaluation;
				break;
			}
		}
		return result;
	}


	matchesExcludesSync(testPath: string, basename?: string, hasSibling?: (name: string) => boolean): boolean {
		if (this._parsedExcludeExpression && this._evalParsedExcludeExpression(testPath, basename, hasSibling)) {
			return true;
		}

		return false;
	}

	/**
	 * Guaranteed sync - siblingsFn should not return a promise.
	 */
	includedInQuerySync(testPath: string, basename?: string, hasSibling?: (name: string) => boolean): boolean {
		if (this._parsedExcludeExpression && this._evalParsedExcludeExpression(testPath, basename, hasSibling)) {
			return false;
		}

		if (this._parsedIncludeExpression && !this._parsedIncludeExpression(testPath, basename, hasSibling)) {
			return false;
		}

		return true;
	}

	/**
	 * Evaluating the exclude expression is only async if it includes sibling clauses. As an optimization, avoid doing anything with Promises
	 * unless the expression is async.
	 */
	includedInQuery(testPath: string, basename?: string, hasSibling?: (name: string) => boolean | Promise<boolean>): Promise<boolean> | boolean {

		const isIncluded = () => {
			return this._parsedIncludeExpression ?
				!!(this._parsedIncludeExpression(testPath, basename, hasSibling)) :
				true;
		};

		return Promise.all(this._parsedExcludeExpression.map(e => {
			const excluded = e(testPath, basename, hasSibling);
			if (isThenable(excluded)) {
				return excluded.then(excluded => {
					if (excluded) {
						return false;
					}

					return isIncluded();
				});
			}

			return isIncluded();

		})).then(e => e.some(e => !!e));


	}

	hasSiblingExcludeClauses(): boolean {
		return this._excludeExpression.reduce((prev, curr) => hasSiblingClauses(curr) || prev, false);
	}
}

function hasSiblingClauses(pattern: glob.IExpression): boolean {
	for (const key in pattern) {
		if (typeof pattern[key] !== 'boolean') {
			return true;
		}
	}

	return false;
}

export function hasSiblingPromiseFn(siblingsFn?: () => Promise<string[]>) {
	if (!siblingsFn) {
		return undefined;
	}

	let siblings: Promise<Record<string, true>>;
	return (name: string) => {
		if (!siblings) {
			siblings = (siblingsFn() || Promise.resolve([]))
				.then(list => list ? listToMap(list) : {});
		}
		return siblings.then(map => !!map[name]);
	};
}

export function hasSiblingFn(siblingsFn?: () => string[]) {
	if (!siblingsFn) {
		return undefined;
	}

	let siblings: Record<string, true>;
	return (name: string) => {
		if (!siblings) {
			const list = siblingsFn();
			siblings = list ? listToMap(list) : {};
		}
		return !!siblings[name];
	};
}

function listToMap(list: string[]) {
	const map: Record<string, true> = {};
	for (const key of list) {
		map[key] = true;
	}
	return map;
}

export function excludeToGlobPattern(excludesForFolder: { baseUri?: URI | undefined; patterns: string[] }[]): GlobPattern[] {
	return excludesForFolder.flatMap(exclude => exclude.patterns.map(pattern => {
		return exclude.baseUri ?
			{
				baseUri: exclude.baseUri,
				pattern: pattern
			} : pattern;
	}));
}

export const DEFAULT_TEXT_SEARCH_PREVIEW_OPTIONS = {
	matchLines: 100,
	charsPerLine: 10000
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/common/searchExtConversionTypes.ts]---
Location: vscode-main/src/vs/workbench/services/search/common/searchExtConversionTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { asArray, coalesce } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { URI } from '../../../../base/common/uri.js';
import { IProgress } from '../../../../platform/progress/common/progress.js';
import { DEFAULT_TEXT_SEARCH_PREVIEW_OPTIONS } from './search.js';
import { Range, FileSearchProvider2, FileSearchProviderOptions, ProviderResult, TextSearchComplete2, TextSearchContext2, TextSearchMatch2, TextSearchProvider2, TextSearchProviderOptions, TextSearchQuery2, TextSearchResult2, TextSearchCompleteMessage } from './searchExtTypes.js';

// old types that are retained for backward compatibility
// TODO: delete this when search apis are adopted by all first-party extensions

/**
 * A relative pattern is a helper to construct glob patterns that are matched
 * relatively to a base path. The base path can either be an absolute file path
 * or a [workspace folder](#WorkspaceFolder).
 */
export interface RelativePattern {

	/**
	 * A base file path to which this pattern will be matched against relatively.
	 */
	base: string;

	/**
	 * A file glob pattern like `*.{ts,js}` that will be matched on file paths
	 * relative to the base path.
	 *
	 * Example: Given a base of `/home/work/folder` and a file path of `/home/work/folder/index.js`,
	 * the file glob pattern will match on `index.js`.
	 */
	pattern: string;
}

/**
 * A file glob pattern to match file paths against. This can either be a glob pattern string
 * (like `** /*.{ts,js}` without space before / or `*.{ts,js}`) or a [relative pattern](#RelativePattern).
 *
 * Glob patterns can have the following syntax:
 * * `*` to match zero or more characters in a path segment
 * * `?` to match on one character in a path segment
 * * `**` to match any number of path segments, including none
 * * `{}` to group conditions (e.g. `** /*.{ts,js}` without space before / matches all TypeScript and JavaScript files)
 * * `[]` to declare a range of characters to match in a path segment (e.g., `example.[0-9]` to match on `example.0`, `example.1`, …)
 * * `[!...]` to negate a range of characters to match in a path segment (e.g., `example.[!0-9]` to match on `example.a`, `example.b`, but not `example.0`)
 *
 * Note: a backslash (`\`) is not valid within a glob pattern. If you have an existing file
 * path to match against, consider to use the [relative pattern](#RelativePattern) support
 * that takes care of converting any backslash into slash. Otherwise, make sure to convert
 * any backslash to slash when creating the glob pattern.
 */
export type GlobPattern = string | RelativePattern;

/**
 * The parameters of a query for text search.
 */
export interface TextSearchQuery {
	/**
	 * The text pattern to search for.
	 */
	pattern: string;

	/**
	 * Whether or not `pattern` should match multiple lines of text.
	 */
	isMultiline?: boolean;

	/**
	 * Whether or not `pattern` should be interpreted as a regular expression.
	 */
	isRegExp?: boolean;

	/**
	 * Whether or not the search should be case-sensitive.
	 */
	isCaseSensitive?: boolean;

	/**
	 * Whether or not to search for whole word matches only.
	 */
	isWordMatch?: boolean;
}

/**
 * A file glob pattern to match file paths against.
 * TODO@roblou - merge this with the GlobPattern docs/definition in vscode.d.ts.
 * @see [GlobPattern](#GlobPattern)
 */
export type GlobString = string;

/**
 * Options common to file and text search
 */
export interface SearchOptions {
	/**
	 * The root folder to search within.
	 */
	folder: URI;

	/**
	 * Files that match an `includes` glob pattern should be included in the search.
	 */
	includes: GlobString[];

	/**
	 * Files that match an `excludes` glob pattern should be excluded from the search.
	 */
	excludes: GlobString[];

	/**
	 * Whether external files that exclude files, like .gitignore, should be respected.
	 * See the vscode setting `"search.useIgnoreFiles"`.
	 */
	useIgnoreFiles: boolean;

	/**
	 * Whether symlinks should be followed while searching.
	 * See the vscode setting `"search.followSymlinks"`.
	 */
	followSymlinks: boolean;

	/**
	 * Whether global files that exclude files, like .gitignore, should be respected.
	 * See the vscode setting `"search.useGlobalIgnoreFiles"`.
	 */
	useGlobalIgnoreFiles: boolean;

	/**
	 * Whether files in parent directories that exclude files, like .gitignore, should be respected.
	 * See the vscode setting `"search.useParentIgnoreFiles"`.
	 */
	useParentIgnoreFiles: boolean;
}

/**
 * Options to specify the size of the result text preview.
 * These options don't affect the size of the match itself, just the amount of preview text.
 */
export interface TextSearchPreviewOptions {
	/**
	 * The maximum number of lines in the preview.
	 * Only search providers that support multiline search will ever return more than one line in the match.
	 */
	matchLines: number;

	/**
	 * The maximum number of characters included per line.
	 */
	charsPerLine: number;
}

/**
 * Options that apply to text search.
 */
export interface TextSearchOptions extends SearchOptions {
	/**
	 * The maximum number of results to be returned.
	 */
	maxResults: number;

	/**
	 * Options to specify the size of the result text preview.
	 */
	previewOptions?: TextSearchPreviewOptions;

	/**
	 * Exclude files larger than `maxFileSize` in bytes.
	 */
	maxFileSize?: number;

	/**
	 * Interpret files using this encoding.
	 * See the vscode setting `"files.encoding"`
	 */
	encoding?: string;

	/**
	 * Number of lines of context to include before each match.
	 */
	beforeContext?: number;

	/**
	 * Number of lines of context to include after each match.
	 */
	afterContext?: number;
}
/**
 * Options that apply to AI text search.
 */
export interface AITextSearchOptions extends SearchOptions {
	/**
	 * The maximum number of results to be returned.
	 */
	maxResults: number;

	/**
	 * Options to specify the size of the result text preview.
	 */
	previewOptions?: TextSearchPreviewOptions;

	/**
	 * Exclude files larger than `maxFileSize` in bytes.
	 */
	maxFileSize?: number;

	/**
	 * Number of lines of context to include before each match.
	 */
	beforeContext?: number;

	/**
	 * Number of lines of context to include after each match.
	 */
	afterContext?: number;
}

/**
 * Information collected when text search is complete.
 */
export interface TextSearchComplete {
	/**
	 * Whether the search hit the limit on the maximum number of search results.
	 * `maxResults` on [`TextSearchOptions`](#TextSearchOptions) specifies the max number of results.
	 * - If exactly that number of matches exist, this should be false.
	 * - If `maxResults` matches are returned and more exist, this should be true.
	 * - If search hits an internal limit which is less than `maxResults`, this should be true.
	 */
	limitHit?: boolean;

	/**
	 * Additional information regarding the state of the completed search.
	 *
	 * Supports links in markdown syntax:
	 * - Click to [run a command](command:workbench.action.OpenQuickPick)
	 * - Click to [open a website](https://aka.ms)
	 */
	message?: TextSearchCompleteMessage | TextSearchCompleteMessage[];
}

/**
 * The parameters of a query for file search.
 */
export interface FileSearchQuery {
	/**
	 * The search pattern to match against file paths.
	 */
	pattern: string;
}

/**
 * Options that apply to file search.
 */
export interface FileSearchOptions extends SearchOptions {
	/**
	 * The maximum number of results to be returned.
	 */
	maxResults?: number;

	/**
	 * A CancellationToken that represents the session for this search query. If the provider chooses to, this object can be used as the key for a cache,
	 * and searches with the same session object can search the same cache. When the token is cancelled, the session is complete and the cache can be cleared.
	 */
	session?: CancellationToken;
}

/**
 * A preview of the text result.
 */
export interface TextSearchMatchPreview {
	/**
	 * The matching lines of text, or a portion of the matching line that contains the match.
	 */
	text: string;

	/**
	 * The Range within `text` corresponding to the text of the match.
	 * The number of matches must match the TextSearchMatch's range property.
	 */
	matches: Range | Range[];
}

/**
 * A match from a text search
 */
export interface TextSearchMatch {
	/**
	 * The uri for the matching document.
	 */
	uri: URI;

	/**
	 * The range of the match within the document, or multiple ranges for multiple matches.
	 */
	ranges: Range | Range[];

	/**
	 * A preview of the text match.
	 */
	preview: TextSearchMatchPreview;
}

/**
 * Checks if the given object is of type TextSearchMatch.
 * @param object The object to check.
 * @returns True if the object is a TextSearchMatch, false otherwise.
 */
function isTextSearchMatch(object: any): object is TextSearchMatch {
	return 'uri' in object && 'ranges' in object && 'preview' in object;
}

/**
 * A line of context surrounding a TextSearchMatch.
 */
export interface TextSearchContext {
	/**
	 * The uri for the matching document.
	 */
	uri: URI;

	/**
	 * One line of text.
	 * previewOptions.charsPerLine applies to this
	 */
	text: string;

	/**
	 * The line number of this line of context.
	 */
	lineNumber: number;
}

export type TextSearchResult = TextSearchMatch | TextSearchContext;

/**
 * A FileSearchProvider provides search results for files in the given folder that match a query string. It can be invoked by quickaccess or other extensions.
 *
 * A FileSearchProvider is the more powerful of two ways to implement file search in VS Code. Use a FileSearchProvider if you wish to search within a folder for
 * all files that match the user's query.
 *
 * The FileSearchProvider will be invoked on every keypress in quickaccess. When `workspace.findFiles` is called, it will be invoked with an empty query string,
 * and in that case, every file in the folder should be returned.
 */
export interface FileSearchProvider {
	/**
	 * Provide the set of files that match a certain file path pattern.
	 * @param query The parameters for this query.
	 * @param options A set of options to consider while searching files.
	 * @param progress A progress callback that must be invoked for all results.
	 * @param token A cancellation token.
	 */
	provideFileSearchResults(query: FileSearchQuery, options: FileSearchOptions, token: CancellationToken): ProviderResult<URI[]>;
}

/**
 * A TextSearchProvider provides search results for text results inside files in the workspace.
 */
export interface TextSearchProvider {
	/**
	 * Provide results that match the given text pattern.
	 * @param query The parameters for this query.
	 * @param options A set of options to consider while searching.
	 * @param progress A progress callback that must be invoked for all results.
	 * @param token A cancellation token.
	 */
	provideTextSearchResults(query: TextSearchQuery, options: TextSearchOptions, progress: IProgress<TextSearchResult>, token: CancellationToken): ProviderResult<TextSearchComplete>;
}
/**
 * Options that can be set on a findTextInFiles search.
 */
export interface FindTextInFilesOptions {
	/**
	 * A [glob pattern](#GlobPattern) that defines the files to search for. The glob pattern
	 * will be matched against the file paths of files relative to their workspace. Use a [relative pattern](#RelativePattern)
	 * to restrict the search results to a [workspace folder](#WorkspaceFolder).
	 */
	include?: GlobPattern;

	/**
	 * A [glob pattern](#GlobPattern) that defines files and folders to exclude. The glob pattern
	 * will be matched against the file paths of resulting matches relative to their workspace. When `undefined` only default excludes will
	 * apply, when `null` no excludes will apply.
	 */
	exclude?: GlobPattern | null;

	/**
	 * The maximum number of results to search for
	 */
	maxResults?: number;

	/**
	 * Whether external files that exclude files, like .gitignore, should be respected.
	 * See the vscode setting `"search.useIgnoreFiles"`.
	 */
	useIgnoreFiles?: boolean;

	/**
	 * Whether global files that exclude files, like .gitignore, should be respected.
	 * See the vscode setting `"search.useGlobalIgnoreFiles"`.
	 */
	useGlobalIgnoreFiles?: boolean;

	/**
	 * Whether files in parent directories that exclude files, like .gitignore, should be respected.
	 * See the vscode setting `"search.useParentIgnoreFiles"`.
	 */
	useParentIgnoreFiles: boolean;

	/**
	 * Whether symlinks should be followed while searching.
	 * See the vscode setting `"search.followSymlinks"`.
	 */
	followSymlinks?: boolean;

	/**
	 * Interpret files using this encoding.
	 * See the vscode setting `"files.encoding"`
	 */
	encoding?: string;

	/**
	 * Options to specify the size of the result text preview.
	 */
	previewOptions?: TextSearchPreviewOptions;

	/**
	 * Number of lines of context to include before each match.
	 */
	beforeContext?: number;

	/**
	 * Number of lines of context to include after each match.
	 */
	afterContext?: number;
}

function newToOldFileProviderOptions(options: FileSearchProviderOptions): FileSearchOptions[] {
	return options.folderOptions.map(folderOption => ({
		folder: folderOption.folder,
		excludes: folderOption.excludes.map(e => typeof (e) === 'string' ? e : e.pattern),
		includes: folderOption.includes,
		useGlobalIgnoreFiles: folderOption.useIgnoreFiles.global,
		useIgnoreFiles: folderOption.useIgnoreFiles.local,
		useParentIgnoreFiles: folderOption.useIgnoreFiles.parent,
		followSymlinks: folderOption.followSymlinks,
		maxResults: options.maxResults,
		session: <CancellationToken | undefined>options.session // TODO: make sure that we actually use a cancellation token here.
	} satisfies FileSearchOptions));
}

export class OldFileSearchProviderConverter implements FileSearchProvider2 {
	constructor(private provider: FileSearchProvider) { }

	provideFileSearchResults(pattern: string, options: FileSearchProviderOptions, token: CancellationToken): ProviderResult<URI[]> {
		const getResult = async () => {
			const newOpts = newToOldFileProviderOptions(options);
			return Promise.all(newOpts.map(
				o => this.provider.provideFileSearchResults({ pattern }, o, token)));
		};
		return getResult().then(e => coalesce(e).flat());
	}
}

function newToOldTextProviderOptions(options: TextSearchProviderOptions): TextSearchOptions[] {
	return options.folderOptions.map(folderOption => ({
		folder: folderOption.folder,
		excludes: folderOption.excludes.map(e => typeof (e) === 'string' ? e : e.pattern),
		includes: folderOption.includes,
		useGlobalIgnoreFiles: folderOption.useIgnoreFiles.global,
		useIgnoreFiles: folderOption.useIgnoreFiles.local,
		useParentIgnoreFiles: folderOption.useIgnoreFiles.parent,
		followSymlinks: folderOption.followSymlinks,
		maxResults: options.maxResults,
		previewOptions: newToOldPreviewOptions(options.previewOptions),
		maxFileSize: options.maxFileSize,
		encoding: folderOption.encoding,
		afterContext: options.surroundingContext,
		beforeContext: options.surroundingContext
	} satisfies TextSearchOptions));
}

export function newToOldPreviewOptions(options: {
	matchLines?: number;
	charsPerLine?: number;
} | undefined
): {
	matchLines: number;
	charsPerLine: number;
} {
	return {
		matchLines: options?.matchLines ?? DEFAULT_TEXT_SEARCH_PREVIEW_OPTIONS.matchLines,
		charsPerLine: options?.charsPerLine ?? DEFAULT_TEXT_SEARCH_PREVIEW_OPTIONS.charsPerLine
	};
}

export function oldToNewTextSearchResult(result: TextSearchResult): TextSearchResult2 {
	if (isTextSearchMatch(result)) {
		const ranges = asArray(result.ranges).map((r, i) => {
			const previewArr = asArray(result.preview.matches);
			const matchingPreviewRange = previewArr[i];
			return { sourceRange: r, previewRange: matchingPreviewRange };
		});
		return new TextSearchMatch2(result.uri, ranges, result.preview.text);
	} else {
		return new TextSearchContext2(result.uri, result.text, result.lineNumber);
	}
}

export class OldTextSearchProviderConverter implements TextSearchProvider2 {
	constructor(private provider: TextSearchProvider) { }

	provideTextSearchResults(query: TextSearchQuery2, options: TextSearchProviderOptions, progress: IProgress<TextSearchResult2>, token: CancellationToken): ProviderResult<TextSearchComplete2> {

		const progressShim = (oldResult: TextSearchResult) => {
			if (!validateProviderResult(oldResult)) {
				return;
			}
			progress.report(oldToNewTextSearchResult(oldResult));
		};

		const getResult = async () => {
			return coalesce(await Promise.all(
				newToOldTextProviderOptions(options).map(
					o => this.provider.provideTextSearchResults(query, o, { report: (e) => progressShim(e) }, token))))
				.reduce(
					(prev, cur) => ({ limitHit: prev.limitHit || cur.limitHit }),
					{ limitHit: false }
				);
		};
		const oldResult = getResult();
		return oldResult.then((e) => {
			return {
				limitHit: e.limitHit,
				message: coalesce(asArray(e.message))
			} satisfies TextSearchComplete2;
		});
	}
}

function validateProviderResult(result: TextSearchResult): boolean {
	if (extensionResultIsMatch(result)) {
		if (Array.isArray(result.ranges)) {
			if (!Array.isArray(result.preview.matches)) {
				console.warn('INVALID - A text search provider match\'s`ranges` and`matches` properties must have the same type.');
				return false;
			}

			if ((<Range[]>result.preview.matches).length !== result.ranges.length) {
				console.warn('INVALID - A text search provider match\'s`ranges` and`matches` properties must have the same length.');
				return false;
			}
		} else {
			if (Array.isArray(result.preview.matches)) {
				console.warn('INVALID - A text search provider match\'s`ranges` and`matches` properties must have the same length.');
				return false;
			}
		}
	}

	return true;
}

export function extensionResultIsMatch(data: TextSearchResult): data is TextSearchMatch {
	return !!(<TextSearchMatch>data).preview;
}
```

--------------------------------------------------------------------------------

````
