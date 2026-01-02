---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 311
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 311 of 552)

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

---[FILE: src/vs/workbench/api/common/extHostMcp.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostMcp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DeferredPromise, raceCancellationError, Sequencer, timeout } from '../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../base/common/cancellation.js';
import { CancellationError } from '../../../base/common/errors.js';
import { Disposable, DisposableMap, DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { AUTH_SCOPE_SEPARATOR, fetchAuthorizationServerMetadata, fetchResourceMetadata, getDefaultMetadataForUrl, IAuthorizationProtectedResourceMetadata, IAuthorizationServerMetadata, parseWWWAuthenticateHeader, scopesMatch } from '../../../base/common/oauth.js';
import { SSEParser } from '../../../base/common/sseParser.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { vArray, vNumber, vObj, vObjAny, vOptionalProp, vString } from '../../../base/common/validation.js';
import { ConfigurationTarget } from '../../../platform/configuration/common/configuration.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { canLog, ILogService, LogLevel } from '../../../platform/log/common/log.js';
import product from '../../../platform/product/common/product.js';
import { StorageScope } from '../../../platform/storage/common/storage.js';
import { extensionPrefixedIdentifier, McpCollectionDefinition, McpConnectionState, McpServerDefinition, McpServerLaunch, McpServerStaticMetadata, McpServerStaticToolAvailability, McpServerTransportHTTP, McpServerTransportType, UserInteractionRequiredError } from '../../contrib/mcp/common/mcpTypes.js';
import { MCP } from '../../contrib/mcp/common/modelContextProtocol.js';
import { checkProposedApiEnabled, isProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { ExtHostMcpShape, IMcpAuthenticationDetails, IStartMcpOptions, MainContext, MainThreadMcpShape } from './extHost.protocol.js';
import { IExtHostInitDataService } from './extHostInitDataService.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import * as Convert from './extHostTypeConverters.js';
import { McpHttpServerDefinition, McpStdioServerDefinition, McpToolAvailability } from './extHostTypes.js';
import { IExtHostVariableResolverProvider } from './extHostVariableResolverService.js';
import { IExtHostWorkspace } from './extHostWorkspace.js';

export const IExtHostMpcService = createDecorator<IExtHostMpcService>('IExtHostMpcService');

export interface IExtHostMpcService extends ExtHostMcpShape {
	registerMcpConfigurationProvider(extension: IExtensionDescription, id: string, provider: vscode.McpServerDefinitionProvider): IDisposable;
}

const serverDataValidation = vObj({
	label: vString(),
	version: vOptionalProp(vString()),
	metadata: vOptionalProp(vObj({
		capabilities: vOptionalProp(vObjAny()),
		serverInfo: vOptionalProp(vObjAny()),
		tools: vOptionalProp(vArray(vObj({
			availability: vNumber(),
			definition: vObjAny(),
		}))),
	})),
	authentication: vOptionalProp(vObj({
		providerId: vString(),
		scopes: vArray(vString()),
	}))
});

// Can be validated with:
// declare const _serverDataValidationTest: vscode.McpStdioServerDefinition | vscode.McpHttpServerDefinition;
// const _serverDataValidationProd: ValidatorType<typeof serverDataValidation> = _serverDataValidationTest;

export class ExtHostMcpService extends Disposable implements IExtHostMpcService {
	protected _proxy: MainThreadMcpShape;
	private readonly _initialProviderPromises = new Set<Promise<void>>();
	protected readonly _sseEventSources = this._register(new DisposableMap<number, McpHTTPHandle>());
	private readonly _unresolvedMcpServers = new Map</* collectionId */ string, {
		provider: vscode.McpServerDefinitionProvider;
		servers: vscode.McpServerDefinition[];
	}>();

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@ILogService protected readonly _logService: ILogService,
		@IExtHostInitDataService private readonly _extHostInitData: IExtHostInitDataService,
		@IExtHostWorkspace protected readonly _workspaceService: IExtHostWorkspace,
		@IExtHostVariableResolverProvider private readonly _variableResolver: IExtHostVariableResolverProvider,
	) {
		super();
		this._proxy = extHostRpc.getProxy(MainContext.MainThreadMcp);
	}

	$startMcp(id: number, opts: IStartMcpOptions): void {
		this._startMcp(id, McpServerLaunch.fromSerialized(opts.launch), opts.defaultCwd && URI.revive(opts.defaultCwd), opts.errorOnUserInteraction);
	}

	protected _startMcp(id: number, launch: McpServerLaunch, _defaultCwd?: URI, errorOnUserInteraction?: boolean): void {
		if (launch.type === McpServerTransportType.HTTP) {
			this._sseEventSources.set(id, new McpHTTPHandle(id, launch, this._proxy, this._logService, errorOnUserInteraction));
			return;
		}

		throw new Error('not implemented');
	}

	async $substituteVariables<T>(_workspaceFolder: UriComponents | undefined, value: T): Promise<T> {
		const folderURI = URI.revive(_workspaceFolder);
		const folder = folderURI && await this._workspaceService.resolveWorkspaceFolder(folderURI);
		const variableResolver = await this._variableResolver.getResolver();
		return variableResolver.resolveAsync(folder && {
			uri: folder.uri,
			name: folder.name,
			index: folder.index,
		}, value) as T;
	}

	$stopMcp(id: number): void {
		this._sseEventSources.get(id)
			?.close()
			.then(() => this._didClose(id));
	}

	private _didClose(id: number) {
		this._sseEventSources.deleteAndDispose(id);
	}

	$sendMessage(id: number, message: string): void {
		this._sseEventSources.get(id)?.send(message);
	}

	async $waitForInitialCollectionProviders(): Promise<void> {
		await Promise.all(this._initialProviderPromises);
	}

	async $resolveMcpLaunch(collectionId: string, label: string): Promise<McpServerLaunch.Serialized | undefined> {
		const rec = this._unresolvedMcpServers.get(collectionId);
		if (!rec) {
			return;
		}

		const server = rec.servers.find(s => s.label === label);
		if (!server) {
			return;
		}
		if (!rec.provider.resolveMcpServerDefinition) {
			return Convert.McpServerDefinition.from(server);
		}

		const resolved = await rec.provider.resolveMcpServerDefinition(server, CancellationToken.None);
		return resolved ? Convert.McpServerDefinition.from(resolved) : undefined;
	}

	/** {@link vscode.lm.registerMcpServerDefinitionProvider} */
	public registerMcpConfigurationProvider(extension: IExtensionDescription, id: string, provider: vscode.McpServerDefinitionProvider): IDisposable {
		const store = new DisposableStore();

		const metadata = extension.contributes?.mcpServerDefinitionProviders?.find(m => m.id === id);
		if (!metadata) {
			throw new Error(`MCP configuration providers must be registered in the contributes.mcpServerDefinitionProviders array within your package.json, but "${id}" was not`);
		}

		const mcp: McpCollectionDefinition.FromExtHost = {
			id: extensionPrefixedIdentifier(extension.identifier, id),
			isTrustedByDefault: true,
			label: metadata?.label ?? extension.displayName ?? extension.name,
			scope: StorageScope.WORKSPACE,
			canResolveLaunch: typeof provider.resolveMcpServerDefinition === 'function',
			extensionId: extension.identifier.value,
			configTarget: this._extHostInitData.remote.isRemote ? ConfigurationTarget.USER_REMOTE : ConfigurationTarget.USER,
		};

		const update = async () => {
			const list = await provider.provideMcpServerDefinitions(CancellationToken.None);
			this._unresolvedMcpServers.set(mcp.id, { servers: list ?? [], provider });

			const servers: McpServerDefinition.Serialized[] = [];
			for (const item of list ?? []) {
				let id = ExtensionIdentifier.toKey(extension.identifier) + '/' + item.label;
				if (servers.some(s => s.id === id)) {
					let i = 2;
					while (servers.some(s => s.id === id + i)) { i++; }
					id = id + i;
				}

				serverDataValidation.validateOrThrow(item);
				if ((item as vscode.McpHttpServerDefinition2).authentication) {
					checkProposedApiEnabled(extension, 'mcpToolDefinitions');
				}

				let staticMetadata: McpServerStaticMetadata | undefined;
				const castAs2 = item as McpStdioServerDefinition | McpHttpServerDefinition;
				if (isProposedApiEnabled(extension, 'mcpToolDefinitions') && castAs2.metadata) {
					staticMetadata = {
						capabilities: castAs2.metadata.capabilities as MCP.ServerCapabilities,
						instructions: castAs2.metadata.instructions,
						serverInfo: castAs2.metadata.serverInfo as MCP.Implementation,
						tools: castAs2.metadata.tools?.map(t => ({
							availability: t.availability === McpToolAvailability.Dynamic ? McpServerStaticToolAvailability.Dynamic : McpServerStaticToolAvailability.Initial,
							definition: t.definition as MCP.Tool,
						})),
					};
				}

				servers.push({
					id,
					label: item.label,
					cacheNonce: item.version || '$$NONE',
					staticMetadata,
					launch: Convert.McpServerDefinition.from(item),
				});
			}

			this._proxy.$upsertMcpCollection(mcp, servers);
		};

		store.add(toDisposable(() => {
			this._unresolvedMcpServers.delete(mcp.id);
			this._proxy.$deleteMcpCollection(mcp.id);
		}));

		if (provider.onDidChangeMcpServerDefinitions) {
			store.add(provider.onDidChangeMcpServerDefinitions(update));
		}
		// todo@connor4312: proposed API back-compat
		// eslint-disable-next-line local/code-no-any-casts
		if ((provider as any).onDidChangeServerDefinitions) {
			// eslint-disable-next-line local/code-no-any-casts
			store.add((provider as any).onDidChangeServerDefinitions(update));
		}
		// eslint-disable-next-line local/code-no-any-casts
		if ((provider as any).onDidChange) {
			// eslint-disable-next-line local/code-no-any-casts
			store.add((provider as any).onDidChange(update));
		}

		const promise = new Promise<void>(resolve => {
			setTimeout(() => update().finally(() => {
				this._initialProviderPromises.delete(promise);
				resolve();
			}), 0);
		});

		this._initialProviderPromises.add(promise);

		return store;
	}
}

const enum HttpMode {
	Unknown,
	Http,
	SSE,
}

type HttpModeT =
	| { value: HttpMode.Unknown }
	| { value: HttpMode.Http; sessionId: string | undefined }
	| { value: HttpMode.SSE; endpoint: string };

const MAX_FOLLOW_REDIRECTS = 5;
const REDIRECT_STATUS_CODES = [301, 302, 303, 307, 308];

/**
 * Implementation of both MCP HTTP Streaming as well as legacy SSE.
 *
 * The first request will POST to the endpoint, assuming HTTP streaming. If the
 * server is legacy SSE, it should return some 4xx status in that case,
 * and we'll automatically fall back to SSE and res
 */
export class McpHTTPHandle extends Disposable {
	private readonly _requestSequencer = new Sequencer();
	private readonly _postEndpoint = new DeferredPromise<{ url: string; transport: McpServerTransportHTTP }>();
	private _mode: HttpModeT = { value: HttpMode.Unknown };
	private readonly _cts = new CancellationTokenSource();
	private readonly _abortCtrl = new AbortController();
	private _authMetadata?: AuthMetadata;
	private _didSendClose = false;

	constructor(
		private readonly _id: number,
		private readonly _launch: McpServerTransportHTTP,
		private readonly _proxy: MainThreadMcpShape,
		private readonly _logService: ILogService,
		private readonly _errorOnUserInteraction?: boolean,
	) {
		super();

		this._register(toDisposable(() => {
			this._abortCtrl.abort();
			this._cts.dispose(true);
		}));
		this._proxy.$onDidChangeState(this._id, { state: McpConnectionState.Kind.Running });
	}

	async send(message: string) {
		try {
			if (this._mode.value === HttpMode.Unknown) {
				await this._requestSequencer.queue(() => this._send(message));
			} else {
				await this._send(message);
			}
		} catch (err) {
			const msg = `Error sending message to ${this._launch.uri}: ${String(err)}`;
			this._proxy.$onDidChangeState(this._id, { state: McpConnectionState.Kind.Error, message: msg });
		}
	}

	async close() {
		if (this._mode.value === HttpMode.Http && this._mode.sessionId && !this._didSendClose) {
			this._didSendClose = true;
			try {
				await this._closeSession(this._mode.sessionId);
			} catch {
				// ignored -- already logged
			}
		}

		this._proxy.$onDidChangeState(this._id, { state: McpConnectionState.Kind.Stopped });
	}

	private async _closeSession(sessionId: string) {
		const headers: Record<string, string> = {
			...Object.fromEntries(this._launch.headers),
			'Mcp-Session-Id': sessionId,
		};

		await this._addAuthHeader(headers);

		// no fetch with retry here -- don't try to auth if we get an auth failure
		await this._fetch(
			this._launch.uri.toString(true),
			{
				method: 'DELETE',
				headers,
			},
		);
	}

	private _send(message: string) {
		if (this._mode.value === HttpMode.SSE) {
			return this._sendLegacySSE(this._mode.endpoint, message);
		} else {
			return this._sendStreamableHttp(message, this._mode.value === HttpMode.Http ? this._mode.sessionId : undefined);
		}
	}

	/**
	 * Sends a streamable-HTTP request.
	 * 1. Posts to the endpoint
	 * 2. Updates internal state as needed. Falls back to SSE if appropriate.
	 * 3. If the response body is empty, JSON, or a JSON stream, handle it appropriately.
	 */
	private async _sendStreamableHttp(message: string, sessionId: string | undefined) {
		const asBytes = new TextEncoder().encode(message) as Uint8Array<ArrayBuffer>;
		const headers: Record<string, string> = {
			...Object.fromEntries(this._launch.headers),
			'Content-Type': 'application/json',
			'Content-Length': String(asBytes.length),
			Accept: 'text/event-stream, application/json',
		};
		if (sessionId) {
			headers['Mcp-Session-Id'] = sessionId;
		}
		await this._addAuthHeader(headers);

		const res = await this._fetchWithAuthRetry(
			this._launch.uri.toString(true),
			{
				method: 'POST',
				headers,
				body: asBytes,
			},
			headers
		);

		const wasUnknown = this._mode.value === HttpMode.Unknown;

		// Mcp-Session-Id is the strongest signal that we're in streamable HTTP mode
		const nextSessionId = res.headers.get('Mcp-Session-Id');
		if (nextSessionId) {
			this._mode = { value: HttpMode.Http, sessionId: nextSessionId };
		}

		if (this._mode.value === HttpMode.Unknown &&
			// We care about 4xx errors...
			res.status >= 400 && res.status < 500
			// ...except for auth errors
			&& !isAuthStatusCode(res.status)
		) {
			this._log(LogLevel.Info, `${res.status} status sending message to ${this._launch.uri}, will attempt to fall back to legacy SSE`);
			this._sseFallbackWithMessage(message);
			return;
		}

		if (res.status >= 300) {
			// "When a client receives HTTP 404 in response to a request containing an Mcp-Session-Id, it MUST start a new session by sending a new InitializeRequest without a session ID attached"
			// Though this says only 404, some servers send 400s as well, including their example
			// https://github.com/modelcontextprotocol/typescript-sdk/issues/389
			const retryWithSessionId = this._mode.value === HttpMode.Http && !!this._mode.sessionId && (res.status === 400 || res.status === 404);

			this._proxy.$onDidChangeState(this._id, {
				state: McpConnectionState.Kind.Error,
				message: `${res.status} status sending message to ${this._launch.uri}: ${await this._getErrText(res)}` + (retryWithSessionId ? `; will retry with new session ID` : ''),
				shouldRetry: retryWithSessionId,
			});
			return;
		}

		if (this._mode.value === HttpMode.Unknown) {
			this._mode = { value: HttpMode.Http, sessionId: undefined };
		}
		if (wasUnknown) {
			this._attachStreamableBackchannel();
		}

		await this._handleSuccessfulStreamableHttp(res, message);
	}

	private async _sseFallbackWithMessage(message: string) {
		const endpoint = await this._attachSSE();
		if (endpoint) {
			this._mode = { value: HttpMode.SSE, endpoint };
			await this._sendLegacySSE(endpoint, message);
		}
	}

	private async _handleSuccessfulStreamableHttp(res: CommonResponse, message: string) {
		if (res.status === 202) {
			return; // no body
		}

		const contentType = res.headers.get('Content-Type')?.toLowerCase() || '';
		if (contentType.startsWith('text/event-stream')) {
			const parser = new SSEParser(event => {
				if (event.type === 'message') {
					this._proxy.$onDidReceiveMessage(this._id, event.data);
				} else if (event.type === 'endpoint') {
					// An SSE server that didn't correctly return a 4xx status when we POSTed
					this._log(LogLevel.Warning, `Received SSE endpoint from a POST to ${this._launch.uri}, will fall back to legacy SSE`);
					this._sseFallbackWithMessage(message);
					throw new CancellationError(); // just to end the SSE stream
				}
			});

			try {
				await this._doSSE(parser, res);
			} catch (err) {
				this._log(LogLevel.Warning, `Error reading SSE stream: ${String(err)}`);
			}
		} else if (contentType.startsWith('application/json')) {
			this._proxy.$onDidReceiveMessage(this._id, await res.text());
		} else {
			const responseBody = await res.text();
			if (isJSON(responseBody)) { // try to read as JSON even if the server didn't set the content type
				this._proxy.$onDidReceiveMessage(this._id, responseBody);
			} else {
				this._log(LogLevel.Warning, `Unexpected ${res.status} response for request: ${responseBody}`);
			}
		}
	}

	/**
	 * Attaches the SSE backchannel that streamable HTTP servers can use
	 * for async notifications. This is a "MAY" support, so if the server gives
	 * us a 4xx code, we'll stop trying to connect..
	 */
	private async _attachStreamableBackchannel() {
		let lastEventId: string | undefined;
		let canReconnectAt: number | undefined;
		for (let retry = 0; !this._store.isDisposed; retry++) {
			if (canReconnectAt !== undefined) {
				await timeout(Math.max(0, canReconnectAt - Date.now()), this._cts.token);
				canReconnectAt = undefined;
			} else {
				await timeout(Math.min(retry * 1000, 30_000), this._cts.token);
			}

			let res: CommonResponse;
			try {
				const headers: Record<string, string> = {
					...Object.fromEntries(this._launch.headers),
					'Accept': 'text/event-stream',
				};
				await this._addAuthHeader(headers);

				if (this._mode.value === HttpMode.Http && this._mode.sessionId !== undefined) {
					headers['Mcp-Session-Id'] = this._mode.sessionId;
				}
				if (lastEventId) {
					headers['Last-Event-ID'] = lastEventId;
				}

				res = await this._fetchWithAuthRetry(
					this._launch.uri.toString(true),
					{
						method: 'GET',
						headers,
					},
					headers
				);
			} catch (e) {
				this._log(LogLevel.Info, `Error connecting to ${this._launch.uri} for async notifications, will retry`);
				continue;
			}

			if (res.status >= 400) {
				this._log(LogLevel.Debug, `${res.status} status connecting to ${this._launch.uri} for async notifications; they will be disabled: ${await this._getErrText(res)}`);
				return;
			}

			// Only reset the retry counter if we definitely get an event stream to avoid
			// spamming servers that (incorrectly) don't return one from this endpoint.
			if (res.headers.get('content-type')?.toLowerCase().includes('text/event-stream')) {
				retry = 0;
			}

			const parser = new SSEParser(event => {
				if (event.retry) {
					canReconnectAt = Date.now() + event.retry;
				}
				if (event.type === 'message' && event.data) {
					this._proxy.$onDidReceiveMessage(this._id, event.data);
				}
				if (event.id) {
					lastEventId = event.id;
				}
			});

			try {
				await this._doSSE(parser, res);
			} catch (e) {
				this._log(LogLevel.Info, `Error reading from async stream, we will reconnect: ${e}`);
			}
		}
	}

	/**
	 * Starts a legacy SSE attachment, where the SSE response is the session lifetime.
	 * Unlike `_attachStreamableBackchannel`, this fails the server if it disconnects.
	 */
	private async _attachSSE(): Promise<string | undefined> {
		const postEndpoint = new DeferredPromise<string>();
		const headers: Record<string, string> = {
			...Object.fromEntries(this._launch.headers),
			'Accept': 'text/event-stream',
		};
		await this._addAuthHeader(headers);

		let res: CommonResponse;
		try {
			res = await this._fetchWithAuthRetry(
				this._launch.uri.toString(true),
				{
					method: 'GET',
					headers,
				},
				headers
			);
			if (res.status >= 300) {
				this._proxy.$onDidChangeState(this._id, { state: McpConnectionState.Kind.Error, message: `${res.status} status connecting to ${this._launch.uri} as SSE: ${await this._getErrText(res)}` });
				return;
			}
		} catch (e) {
			this._proxy.$onDidChangeState(this._id, { state: McpConnectionState.Kind.Error, message: `Error connecting to ${this._launch.uri} as SSE: ${e}` });
			return;
		}

		const parser = new SSEParser(event => {
			if (event.type === 'message') {
				this._proxy.$onDidReceiveMessage(this._id, event.data);
			} else if (event.type === 'endpoint') {
				postEndpoint.complete(new URL(event.data, this._launch.uri.toString(true)).toString());
			}
		});

		this._register(toDisposable(() => postEndpoint.cancel()));
		this._doSSE(parser, res).catch(err => {
			this._proxy.$onDidChangeState(this._id, { state: McpConnectionState.Kind.Error, message: `Error reading SSE stream: ${String(err)}` });
		});

		return postEndpoint.p;
	}

	/**
	 * Sends a legacy SSE message to the server. The response is always empty and
	 * is otherwise received in {@link _attachSSE}'s loop.
	 */
	private async _sendLegacySSE(url: string, message: string) {
		const asBytes = new TextEncoder().encode(message) as Uint8Array<ArrayBuffer>;
		const headers: Record<string, string> = {
			...Object.fromEntries(this._launch.headers),
			'Content-Type': 'application/json',
			'Content-Length': String(asBytes.length),
		};
		await this._addAuthHeader(headers);
		const res = await this._fetch(url, {
			method: 'POST',
			headers,
			body: asBytes,
		});

		if (res.status >= 300) {
			this._log(LogLevel.Warning, `${res.status} status sending message to ${this._postEndpoint}: ${await this._getErrText(res)}`);
		}
	}

	/** Generic handle to pipe a response into an SSE parser. */
	private async _doSSE(parser: SSEParser, res: CommonResponse) {
		if (!res.body) {
			return;
		}

		const reader = res.body.getReader();
		let chunk: ReadableStreamReadResult<Uint8Array>;
		do {
			try {
				chunk = await raceCancellationError(reader.read(), this._cts.token);
			} catch (err) {
				reader.cancel();
				if (this._store.isDisposed) {
					return;
				} else {
					throw err;
				}
			}

			if (chunk.value) {
				parser.feed(chunk.value);
			}
		} while (!chunk.done);
	}

	private async _addAuthHeader(headers: Record<string, string>, forceNewRegistration?: boolean) {
		if (this._authMetadata) {
			try {
				const authDetails: IMcpAuthenticationDetails = {
					authorizationServer: this._authMetadata.authorizationServer.toJSON(),
					authorizationServerMetadata: this._authMetadata.serverMetadata,
					resourceMetadata: this._authMetadata.resourceMetadata,
					scopes: this._authMetadata.scopes
				};
				const token = await this._proxy.$getTokenFromServerMetadata(
					this._id,
					authDetails,
					{
						errorOnUserInteraction: this._errorOnUserInteraction,
						forceNewRegistration
					});
				if (token) {
					headers['Authorization'] = `Bearer ${token}`;
				}
			} catch (e) {
				if (UserInteractionRequiredError.is(e)) {
					this._proxy.$onDidChangeState(this._id, { state: McpConnectionState.Kind.Stopped, reason: 'needs-user-interaction' });
					throw new CancellationError();
				}
				this._log(LogLevel.Warning, `Error getting token from server metadata: ${String(e)}`);
			}
		}
		if (this._launch.authentication) {
			try {
				this._log(LogLevel.Debug, `Using provided authentication config: providerId=${this._launch.authentication.providerId}, scopes=${this._launch.authentication.scopes.join(', ')}`);
				const token = await this._proxy.$getTokenForProviderId(
					this._id,
					this._launch.authentication.providerId,
					this._launch.authentication.scopes,
					{
						errorOnUserInteraction: this._errorOnUserInteraction,
						forceNewRegistration
					}
				);
				if (token) {
					headers['Authorization'] = `Bearer ${token}`;
					this._log(LogLevel.Info, 'Successfully obtained token from provided authentication config');
				}
			} catch (e) {
				if (UserInteractionRequiredError.is(e)) {
					this._proxy.$onDidChangeState(this._id, { state: McpConnectionState.Kind.Stopped, reason: 'needs-user-interaction' });
					throw new CancellationError();
				}
				this._log(LogLevel.Warning, `Error getting token from provided authentication config: ${String(e)}`);
			}
		}
		return headers;
	}

	private _log(level: LogLevel, message: string) {
		if (!this._store.isDisposed) {
			this._proxy.$onDidPublishLog(this._id, level, message);
		}
	}

	private async _getErrText(res: CommonResponse) {
		try {
			return await res.text();
		} catch {
			return res.statusText;
		}
	}

	/**
	 * Helper method to perform fetch with authentication retry logic.
	 * If the initial request returns an auth error and we don't have auth metadata,
	 * it will populate the auth metadata and retry once.
	 * If we already have auth metadata, check if the scopes changed and update them.
	 */
	private async _fetchWithAuthRetry(mcpUrl: string, init: MinimalRequestInit, headers: Record<string, string>): Promise<CommonResponse> {
		const doFetch = () => this._fetch(mcpUrl, init);

		let res = await doFetch();
		if (isAuthStatusCode(res.status)) {
			if (!this._authMetadata) {
				this._authMetadata = await createAuthMetadata(mcpUrl, res, {
					launchHeaders: this._launch.headers,
					fetch: (url, init) => this._fetch(url, init as MinimalRequestInit),
					log: (level, message) => this._log(level, message)
				});
				await this._addAuthHeader(headers);
				if (headers['Authorization']) {
					// Update the headers in the init object
					init.headers = headers;
					res = await doFetch();
				}
			} else {
				// We have auth metadata, but got an auth error. Check if the scopes changed.
				if (this._authMetadata.update(res)) {
					await this._addAuthHeader(headers);
					if (headers['Authorization']) {
						// Update the headers in the init object
						init.headers = headers;
						res = await doFetch();
					}
				}
			}
		}
		// If we have an Authorization header and still get an auth error, we should retry with a new auth registration
		if (headers['Authorization'] && isAuthStatusCode(res.status)) {
			const errorText = await this._getErrText(res);
			this._log(LogLevel.Debug, `Received ${res.status} status with Authorization header, retrying with new auth registration. Error details: ${errorText || 'no additional details'}`);
			await this._addAuthHeader(headers, true);
			res = await doFetch();
		}
		return res;
	}

	private async _fetch(url: string, init: MinimalRequestInit): Promise<CommonResponse> {
		init.headers['user-agent'] = `${product.nameLong}/${product.version}`;

		if (canLog(this._logService.getLevel(), LogLevel.Trace)) {
			const traceObj: any = { ...init, headers: { ...init.headers } };
			if (traceObj.body) {
				traceObj.body = new TextDecoder().decode(traceObj.body);
			}
			if (traceObj.headers?.Authorization) {
				traceObj.headers.Authorization = '***'; // don't log the auth header
			}
			this._log(LogLevel.Trace, `Fetching ${url} with options: ${JSON.stringify(traceObj)}`);
		}

		let currentUrl = url;
		let response!: CommonResponse;
		for (let redirectCount = 0; redirectCount < MAX_FOLLOW_REDIRECTS; redirectCount++) {
			response = await this._fetchInternal(currentUrl, {
				...init,
				signal: this._abortCtrl.signal,
				redirect: 'manual'
			});

			// Check for redirect status codes (301, 302, 303, 307, 308)
			if (!REDIRECT_STATUS_CODES.includes(response.status)) {
				break;
			}

			const location = response.headers.get('location');
			if (!location) {
				break;
			}

			const nextUrl = new URL(location, currentUrl).toString();
			this._log(LogLevel.Trace, `Redirect (${response.status}) from ${currentUrl} to ${nextUrl}`);
			currentUrl = nextUrl;
			// Per fetch spec, for 303 always use GET, keep method unless original was POST and 301/302, then GET.
			if (response.status === 303 || ((response.status === 301 || response.status === 302) && init.method === 'POST')) {
				init.method = 'GET';
				delete init.body;
			}
		}

		if (canLog(this._logService.getLevel(), LogLevel.Trace)) {
			const headers: Record<string, string> = {};
			response.headers.forEach((value, key) => { headers[key] = value; });
			this._log(LogLevel.Trace, `Fetched ${currentUrl}: ${JSON.stringify({
				status: response.status,
				headers: headers,
			})}`);
		}

		return response;
	}

	protected _fetchInternal(url: string, init?: CommonRequestInit): Promise<CommonResponse> {
		return fetch(url, init);
	}
}

interface MinimalRequestInit {
	method: string;
	headers: Record<string, string>;
	body?: Uint8Array<ArrayBuffer>;
}

export interface CommonRequestInit extends MinimalRequestInit {
	signal?: AbortSignal;
	redirect?: RequestRedirect;
}

export interface CommonResponse {
	status: number;
	statusText: string;
	headers: Headers;
	body?: ReadableStream | null;
	url: string;
	json(): Promise<any>;
	text(): Promise<string>;
}

function isJSON(str: string): boolean {
	try {
		JSON.parse(str);
		return true;
	} catch (e) {
		return false;
	}
}

function isAuthStatusCode(status: number): boolean {
	return status === 401 || status === 403;
}


//#region AuthMetadata

/**
 * Logger callback type for AuthMetadata operations.
 */
export type AuthMetadataLogger = (level: LogLevel, message: string) => void;

/**
 * Interface for authentication metadata that can be updated when scopes change.
 */
export interface IAuthMetadata {
	readonly authorizationServer: URI;
	readonly serverMetadata: IAuthorizationServerMetadata;
	readonly resourceMetadata: IAuthorizationProtectedResourceMetadata | undefined;
	readonly scopes: string[] | undefined;

	/**
	 * Updates the scopes based on the WWW-Authenticate header in the response.
	 * @param response The HTTP response containing potential scope challenges
	 * @returns true if scopes were updated, false otherwise
	 */
	update(response: CommonResponse): boolean;
}

/**
 * Concrete implementation of IAuthMetadata that manages OAuth authentication metadata.
 * Consumers should use {@link createAuthMetadata} to create instances.
 */
class AuthMetadata implements IAuthMetadata {
	private _scopes: string[] | undefined;

	constructor(
		public readonly authorizationServer: URI,
		public readonly serverMetadata: IAuthorizationServerMetadata,
		public readonly resourceMetadata: IAuthorizationProtectedResourceMetadata | undefined,
		scopes: string[] | undefined,
		private readonly _log: AuthMetadataLogger,
	) {
		this._scopes = scopes;
	}

	get scopes(): string[] | undefined {
		return this._scopes;
	}

	update(response: CommonResponse): boolean {
		const scopesChallenge = this._parseScopesFromResponse(response);
		if (!scopesMatch(scopesChallenge, this._scopes)) {
			this._log(LogLevel.Debug, `Scopes changed from ${JSON.stringify(this._scopes)} to ${JSON.stringify(scopesChallenge)}, updating`);
			this._scopes = scopesChallenge;
			return true;
		}
		return false;
	}

	private _parseScopesFromResponse(response: CommonResponse): string[] | undefined {
		if (!response.headers.has('WWW-Authenticate')) {
			return undefined;
		}

		const authHeader = response.headers.get('WWW-Authenticate')!;
		const challenges = parseWWWAuthenticateHeader(authHeader);
		for (const challenge of challenges) {
			if (challenge.scheme === 'Bearer' && challenge.params['scope']) {
				const scopes = challenge.params['scope'].split(AUTH_SCOPE_SEPARATOR).filter(s => s.trim().length);
				if (scopes.length) {
					this._log(LogLevel.Debug, `Found scope challenge in WWW-Authenticate header: ${challenge.params['scope']}`);
					return scopes;
				}
			}
		}
		return undefined;
	}
}

/**
 * Options for creating AuthMetadata.
 */
export interface ICreateAuthMetadataOptions {
	/** Headers to include when fetching metadata from the same origin as the MCP server */
	launchHeaders: Iterable<readonly [string, string]>;
	/** Fetch function to use for HTTP requests */
	fetch: (url: string, init: MinimalRequestInit) => Promise<CommonResponse>;
	/** Logger function for diagnostic output */
	log: AuthMetadataLogger;
}

/**
 * Creates an AuthMetadata instance by discovering OAuth metadata from the server.
 *
 * This function:
 * 1. Parses the WWW-Authenticate header for resource_metadata and scope challenges
 * 2. Fetches OAuth protected resource metadata from well-known URIs or the challenge URL
 * 3. Fetches authorization server metadata
 * 4. Falls back to default metadata if discovery fails
 *
 * @param mcpUrl The MCP server URL
 * @param originalResponse The original HTTP response that triggered auth (typically 401/403)
 * @param options Configuration options including headers, fetch function, and logger
 * @returns A new AuthMetadata instance
 */
export async function createAuthMetadata(
	mcpUrl: string,
	originalResponse: CommonResponse,
	options: ICreateAuthMetadataOptions
): Promise<AuthMetadata> {
	const { launchHeaders, fetch, log } = options;

	// Parse the WWW-Authenticate header for resource_metadata and scope challenges
	const { resourceMetadataChallenge, scopesChallenge: scopesChallengeFromHeader } = parseWWWAuthenticateHeaderForChallenges(originalResponse, log);

	// Fetch the resource metadata either from the challenge URL or from well-known URIs
	let serverMetadataUrl: string | undefined;
	let resource: IAuthorizationProtectedResourceMetadata | undefined;
	let scopesChallenge = scopesChallengeFromHeader;

	try {
		const { metadata, errors } = await fetchResourceMetadata(mcpUrl, resourceMetadataChallenge, {
			sameOriginHeaders: {
				...Object.fromEntries(launchHeaders),
				'MCP-Protocol-Version': MCP.LATEST_PROTOCOL_VERSION
			},
			fetch: (url, init) => fetch(url, init as MinimalRequestInit)
		});
		for (const err of errors) {
			log(LogLevel.Warning, `Error fetching resource metadata: ${err}`);
		}
		// TODO:@TylerLeonhardt support multiple authorization servers
		// Consider using one that has an auth provider first, over the dynamic flow
		serverMetadataUrl = metadata.authorization_servers?.[0];
		log(LogLevel.Debug, `Using auth server metadata url: ${serverMetadataUrl}`);
		scopesChallenge ??= metadata.scopes_supported;
		resource = metadata;
	} catch (e) {
		log(LogLevel.Warning, `Could not fetch resource metadata: ${String(e)}`);
	}

	const baseUrl = new URL(originalResponse.url).origin;

	// If we are not given a resource_metadata, see if the well-known server metadata is available
	// on the base url.
	let additionalHeaders: Record<string, string> = {};
	if (!serverMetadataUrl) {
		serverMetadataUrl = baseUrl;
		// Maintain the launch headers when talking to the MCP origin.
		additionalHeaders = {
			...Object.fromEntries(launchHeaders),
			'MCP-Protocol-Version': MCP.LATEST_PROTOCOL_VERSION
		};
	}

	try {
		log(LogLevel.Debug, `Fetching auth server metadata for: ${serverMetadataUrl} ...`);
		const serverMetadataResponse = await fetchAuthorizationServerMetadata(serverMetadataUrl, {
			additionalHeaders,
			fetch: (url, init) => fetch(url, init as MinimalRequestInit)
		});
		log(LogLevel.Info, 'Populated auth metadata');
		return new AuthMetadata(
			URI.parse(serverMetadataUrl),
			serverMetadataResponse,
			resource,
			scopesChallenge,
			log
		);
	} catch (e) {
		log(LogLevel.Warning, `Error populating auth server metadata for ${serverMetadataUrl}: ${String(e)}`);
	}

	// If there's no well-known server metadata, then use the default values based off of the url.
	const defaultMetadata = getDefaultMetadataForUrl(new URL(baseUrl));
	log(LogLevel.Info, 'Using default auth metadata');
	return new AuthMetadata(
		URI.parse(baseUrl),
		defaultMetadata,
		resource,
		scopesChallenge,
		log
	);
}

/**
 * Parses the WWW-Authenticate header for resource_metadata and scope challenges.
 */
function parseWWWAuthenticateHeaderForChallenges(
	response: CommonResponse,
	log: AuthMetadataLogger
): { resourceMetadataChallenge: string | undefined; scopesChallenge: string[] | undefined } {
	let resourceMetadataChallenge: string | undefined;
	let scopesChallenge: string[] | undefined;

	if (response.headers.has('WWW-Authenticate')) {
		const authHeader = response.headers.get('WWW-Authenticate')!;
		const challenges = parseWWWAuthenticateHeader(authHeader);
		for (const challenge of challenges) {
			if (challenge.scheme === 'Bearer') {
				if (!resourceMetadataChallenge && challenge.params['resource_metadata']) {
					resourceMetadataChallenge = challenge.params['resource_metadata'];
					log(LogLevel.Debug, `Found resource_metadata challenge in WWW-Authenticate header: ${resourceMetadataChallenge}`);
				}
				if (!scopesChallenge && challenge.params['scope']) {
					const scopes = challenge.params['scope'].split(AUTH_SCOPE_SEPARATOR).filter(s => s.trim().length);
					if (scopes.length) {
						log(LogLevel.Debug, `Found scope challenge in WWW-Authenticate header: ${challenge.params['scope']}`);
						scopesChallenge = scopes;
					}
				}
				if (resourceMetadataChallenge && scopesChallenge) {
					break;
				}
			}
		}
	}
	return { resourceMetadataChallenge, scopesChallenge };
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostMemento.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostMemento.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { ExtHostStorage } from './extHostStorage.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { DeferredPromise, RunOnceScheduler } from '../../../base/common/async.js';

export class ExtensionMemento implements vscode.Memento {

	protected readonly _id: string;
	private readonly _shared: boolean;
	protected readonly _storage: ExtHostStorage;

	private readonly _init: Promise<ExtensionMemento>;
	private _value?: { [n: string]: any };
	private readonly _storageListener: IDisposable;

	private _deferredPromises: Map<string, DeferredPromise<void>> = new Map();
	private _scheduler: RunOnceScheduler;

	constructor(id: string, global: boolean, storage: ExtHostStorage) {
		this._id = id;
		this._shared = global;
		this._storage = storage;

		this._init = this._storage.initializeExtensionStorage(this._shared, this._id, Object.create(null)).then(value => {
			this._value = value;
			return this;
		});

		this._storageListener = this._storage.onDidChangeStorage(e => {
			if (e.shared === this._shared && e.key === this._id) {
				this._value = e.value;
			}
		});

		this._scheduler = new RunOnceScheduler(() => {
			const records = this._deferredPromises;
			this._deferredPromises = new Map();
			(async () => {
				try {
					await this._storage.setValue(this._shared, this._id, this._value!);
					for (const value of records.values()) {
						value.complete();
					}
				} catch (e) {
					for (const value of records.values()) {
						value.error(e);
					}
				}
			})();
		}, 0);
	}

	keys(): readonly string[] {
		// Filter out `undefined` values, as they can stick around in the `_value` until the `onDidChangeStorage` event runs
		return Object.entries(this._value ?? {}).filter(([, value]) => value !== undefined).map(([key]) => key);
	}

	get whenReady(): Promise<ExtensionMemento> {
		return this._init;
	}

	get<T>(key: string): T | undefined;
	get<T>(key: string, defaultValue: T): T;
	get<T>(key: string, defaultValue?: T): T {
		let value = this._value![key];
		if (typeof value === 'undefined') {
			value = defaultValue;
		}
		return value;
	}

	update(key: string, value: any): Promise<void> {
		if (value !== null && typeof value === 'object') {
			// Prevent the value from being as-is for until we have
			// received the change event from the main side by emulating
			// the treatment of values via JSON parsing and stringifying.
			// (https://github.com/microsoft/vscode/issues/209479)
			this._value![key] = JSON.parse(JSON.stringify(value));
		} else {
			this._value![key] = value;
		}

		const record = this._deferredPromises.get(key);
		if (record !== undefined) {
			return record.p;
		}

		const promise = new DeferredPromise<void>();
		this._deferredPromises.set(key, promise);

		if (!this._scheduler.isScheduled()) {
			this._scheduler.schedule();
		}

		return promise.p;
	}

	dispose(): void {
		this._storageListener.dispose();
	}
}

export class ExtensionGlobalMemento extends ExtensionMemento {

	private readonly _extension: IExtensionDescription;

	setKeysForSync(keys: string[]): void {
		this._storage.registerExtensionStorageKeysToSync({ id: this._id, version: this._extension.version }, keys);
	}

	constructor(extensionDescription: IExtensionDescription, storage: ExtHostStorage) {
		super(extensionDescription.identifier.value, true, storage);
		this._extension = extensionDescription;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostMessageService.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostMessageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Severity from '../../../base/common/severity.js';
import type * as vscode from 'vscode';
import { MainContext, MainThreadMessageServiceShape, MainThreadMessageOptions, IMainContext } from './extHost.protocol.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { checkProposedApiEnabled } from '../../services/extensions/common/extensions.js';

function isMessageItem(item: any): item is vscode.MessageItem {
	return item && item.title;
}

export class ExtHostMessageService {

	private _proxy: MainThreadMessageServiceShape;

	constructor(
		mainContext: IMainContext,
		@ILogService private readonly _logService: ILogService
	) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadMessageService);
	}


	showMessage(extension: IExtensionDescription, severity: Severity, message: string, optionsOrFirstItem: vscode.MessageOptions | string | undefined, rest: string[]): Promise<string | undefined>;
	showMessage(extension: IExtensionDescription, severity: Severity, message: string, optionsOrFirstItem: vscode.MessageOptions | vscode.MessageItem | undefined, rest: vscode.MessageItem[]): Promise<vscode.MessageItem | undefined>;
	showMessage(extension: IExtensionDescription, severity: Severity, message: string, optionsOrFirstItem: vscode.MessageOptions | vscode.MessageItem | string | undefined, rest: Array<vscode.MessageItem | string>): Promise<string | vscode.MessageItem | undefined>;
	showMessage(extension: IExtensionDescription, severity: Severity, message: string, optionsOrFirstItem: vscode.MessageOptions | string | vscode.MessageItem | undefined, rest: Array<string | vscode.MessageItem>): Promise<string | vscode.MessageItem | undefined> {

		const options: MainThreadMessageOptions = {
			source: { identifier: extension.identifier, label: extension.displayName || extension.name }
		};
		let items: (string | vscode.MessageItem)[];

		if (typeof optionsOrFirstItem === 'string' || isMessageItem(optionsOrFirstItem)) {
			items = [optionsOrFirstItem, ...rest];
		} else {
			options.modal = optionsOrFirstItem?.modal;
			options.useCustom = optionsOrFirstItem?.useCustom;
			options.detail = optionsOrFirstItem?.detail;
			items = rest;
		}

		if (options.useCustom) {
			checkProposedApiEnabled(extension, 'resolvers');
		}

		const commands: { title: string; isCloseAffordance: boolean; handle: number }[] = [];
		let hasCloseAffordance = false;

		for (let handle = 0; handle < items.length; handle++) {
			const command = items[handle];
			if (typeof command === 'string') {
				commands.push({ title: command, handle, isCloseAffordance: false });
			} else if (typeof command === 'object') {
				const { title, isCloseAffordance } = command;
				commands.push({ title, isCloseAffordance: !!isCloseAffordance, handle });
				if (isCloseAffordance) {
					if (hasCloseAffordance) {
						this._logService.warn(`[${extension.identifier}] Only one message item can have 'isCloseAffordance':`, command);
					} else {
						hasCloseAffordance = true;
					}
				}
			} else {
				this._logService.warn(`[${extension.identifier}] Invalid message item:`, command);
			}
		}

		return this._proxy.$showMessage(severity, message, options, commands).then(handle => {
			if (typeof handle === 'number') {
				return items[handle];
			}
			return undefined;
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostNotebook.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostNotebook.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../nls.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IRelativePattern } from '../../../base/common/glob.js';
import { DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { ResourceMap, ResourceSet } from '../../../base/common/map.js';
import { MarshalledId } from '../../../base/common/marshallingIds.js';
import { isFalsyOrWhitespace } from '../../../base/common/strings.js';
import { assertReturnsDefined } from '../../../base/common/types.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { CancellationError } from '../../../base/common/errors.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import * as files from '../../../platform/files/common/files.js';
import { Cache } from './cache.js';
import { ExtHostNotebookShape, IMainContext, IModelAddedData, INotebookCellStatusBarListDto, INotebookDocumentsAndEditorsDelta, INotebookDocumentShowOptions, INotebookEditorAddData, INotebookPartialFileStatsWithMetadata, MainContext, MainThreadNotebookDocumentsShape, MainThreadNotebookEditorsShape, MainThreadNotebookShape, NotebookDataDto } from './extHost.protocol.js';
import { ApiCommand, ApiCommandArgument, ApiCommandResult, CommandsConverter, ExtHostCommands } from './extHostCommands.js';
import { ExtHostDocuments } from './extHostDocuments.js';
import { ExtHostDocumentsAndEditors } from './extHostDocumentsAndEditors.js';
import * as typeConverters from './extHostTypeConverters.js';
import * as extHostTypes from './extHostTypes.js';
import { INotebookExclusiveDocumentFilter, INotebookContributionData } from '../../contrib/notebook/common/notebookCommon.js';
import { SerializableObjectWithBuffers } from '../../services/extensions/common/proxyIdentifier.js';
import type * as vscode from 'vscode';
import { ExtHostCell, ExtHostNotebookDocument } from './extHostNotebookDocument.js';
import { ExtHostNotebookEditor } from './extHostNotebookEditor.js';
import { IExtHostConsumerFileSystem } from './extHostFileSystemConsumer.js';
import { filter } from '../../../base/common/objects.js';
import { Schemas } from '../../../base/common/network.js';
import { IFileQuery, ITextQuery, QueryType } from '../../services/search/common/search.js';
import { IExtHostSearch } from './extHostSearch.js';
import { CellSearchModel } from '../../contrib/search/common/cellSearchModel.js';
import { INotebookCellMatchNoModel, INotebookFileMatchNoModel, IRawClosedNotebookFileMatch, genericCellMatchesToTextSearchMatches } from '../../contrib/search/common/searchNotebookHelpers.js';
import { NotebookPriorityInfo } from '../../contrib/search/common/search.js';
import { globMatchesResource, RegisteredEditorPriority } from '../../services/editor/common/editorResolverService.js';
import { ILogService } from '../../../platform/log/common/log.js';

export class ExtHostNotebookController implements ExtHostNotebookShape {
	private static _notebookStatusBarItemProviderHandlePool: number = 0;

	private readonly _notebookProxy: MainThreadNotebookShape;
	private readonly _notebookDocumentsProxy: MainThreadNotebookDocumentsShape;
	private readonly _notebookEditorsProxy: MainThreadNotebookEditorsShape;

	private readonly _notebookStatusBarItemProviders = new Map<number, vscode.NotebookCellStatusBarItemProvider>();
	private readonly _documents = new ResourceMap<ExtHostNotebookDocument>();
	private readonly _editors = new Map<string, ExtHostNotebookEditor>();
	private readonly _commandsConverter: CommandsConverter;

	private readonly _onDidChangeActiveNotebookEditor = new Emitter<vscode.NotebookEditor | undefined>();
	readonly onDidChangeActiveNotebookEditor = this._onDidChangeActiveNotebookEditor.event;

	private _activeNotebookEditor: ExtHostNotebookEditor | undefined;
	get activeNotebookEditor(): vscode.NotebookEditor | undefined {
		return this._activeNotebookEditor?.apiEditor;
	}
	private _visibleNotebookEditors: ExtHostNotebookEditor[] = [];
	get visibleNotebookEditors(): vscode.NotebookEditor[] {
		return this._visibleNotebookEditors.map(editor => editor.apiEditor);
	}

	private _onDidOpenNotebookDocument = new Emitter<vscode.NotebookDocument>();
	readonly onDidOpenNotebookDocument: Event<vscode.NotebookDocument> = this._onDidOpenNotebookDocument.event;
	private _onDidCloseNotebookDocument = new Emitter<vscode.NotebookDocument>();
	readonly onDidCloseNotebookDocument: Event<vscode.NotebookDocument> = this._onDidCloseNotebookDocument.event;

	private _onDidChangeVisibleNotebookEditors = new Emitter<vscode.NotebookEditor[]>();
	onDidChangeVisibleNotebookEditors = this._onDidChangeVisibleNotebookEditors.event;

	private _statusBarCache = new Cache<IDisposable>('NotebookCellStatusBarCache');

	constructor(
		mainContext: IMainContext,
		commands: ExtHostCommands,
		private _textDocumentsAndEditors: ExtHostDocumentsAndEditors,
		private _textDocuments: ExtHostDocuments,
		private _extHostFileSystem: IExtHostConsumerFileSystem,
		private _extHostSearch: IExtHostSearch,
		private _logService: ILogService
	) {
		this._notebookProxy = mainContext.getProxy(MainContext.MainThreadNotebook);
		this._notebookDocumentsProxy = mainContext.getProxy(MainContext.MainThreadNotebookDocuments);
		this._notebookEditorsProxy = mainContext.getProxy(MainContext.MainThreadNotebookEditors);
		this._commandsConverter = commands.converter;

		commands.registerArgumentProcessor({
			// Serialized INotebookCellActionContext
			processArgument: (arg) => {
				if (arg && arg.$mid === MarshalledId.NotebookCellActionContext) {
					const notebookUri = arg.notebookEditor?.notebookUri;
					const cellHandle = arg.cell.handle;

					const data = this._documents.get(notebookUri);
					const cell = data?.getCell(cellHandle);
					if (cell) {
						return cell.apiCell;
					}
				}
				if (arg && arg.$mid === MarshalledId.NotebookActionContext) {
					const notebookUri = arg.uri;
					const data = this._documents.get(notebookUri);
					if (data) {
						return data.apiNotebook;
					}
				}
				return arg;
			}
		});

		ExtHostNotebookController._registerApiCommands(commands);
	}

	getEditorById(editorId: string): ExtHostNotebookEditor {
		const editor = this._editors.get(editorId);
		if (!editor) {
			throw new Error(`unknown text editor: ${editorId}. known editors: ${[...this._editors.keys()]} `);
		}
		return editor;
	}

	getIdByEditor(editor: vscode.NotebookEditor): string | undefined {
		for (const [id, candidate] of this._editors) {
			if (candidate.apiEditor === editor) {
				return id;
			}
		}
		return undefined;
	}

	get notebookDocuments() {
		return [...this._documents.values()];
	}

	getNotebookDocument(uri: URI, relaxed: true): ExtHostNotebookDocument | undefined;
	getNotebookDocument(uri: URI): ExtHostNotebookDocument;
	getNotebookDocument(uri: URI, relaxed?: true): ExtHostNotebookDocument | undefined {
		const result = this._documents.get(uri);
		if (!result && !relaxed) {
			throw new Error(`NO notebook document for '${uri}'`);
		}
		return result;
	}

	private static _convertNotebookRegistrationData(extension: IExtensionDescription, registration: vscode.NotebookRegistrationData | undefined): INotebookContributionData | undefined {
		if (!registration) {
			return;
		}
		const viewOptionsFilenamePattern = registration.filenamePattern
			.map(pattern => typeConverters.NotebookExclusiveDocumentPattern.from(pattern))
			.filter(pattern => pattern !== undefined) as (string | IRelativePattern | INotebookExclusiveDocumentFilter)[];
		if (registration.filenamePattern && !viewOptionsFilenamePattern) {
			console.warn(`Notebook content provider view options file name pattern is invalid ${registration.filenamePattern}`);
			return undefined;
		}
		return {
			extension: extension.identifier,
			providerDisplayName: extension.displayName || extension.name,
			displayName: registration.displayName,
			filenamePattern: viewOptionsFilenamePattern,
			priority: registration.exclusive ? RegisteredEditorPriority.exclusive : undefined
		};
	}

	registerNotebookCellStatusBarItemProvider(extension: IExtensionDescription, notebookType: string, provider: vscode.NotebookCellStatusBarItemProvider) {

		const handle = ExtHostNotebookController._notebookStatusBarItemProviderHandlePool++;
		const eventHandle = typeof provider.onDidChangeCellStatusBarItems === 'function' ? ExtHostNotebookController._notebookStatusBarItemProviderHandlePool++ : undefined;

		this._notebookStatusBarItemProviders.set(handle, provider);
		this._notebookProxy.$registerNotebookCellStatusBarItemProvider(handle, eventHandle, notebookType);

		let subscription: vscode.Disposable | undefined;
		if (eventHandle !== undefined) {
			subscription = provider.onDidChangeCellStatusBarItems!(_ => this._notebookProxy.$emitCellStatusBarEvent(eventHandle));
		}

		return new extHostTypes.Disposable(() => {
			this._notebookStatusBarItemProviders.delete(handle);
			this._notebookProxy.$unregisterNotebookCellStatusBarItemProvider(handle, eventHandle);
			subscription?.dispose();
		});
	}

	async createNotebookDocument(options: { viewType: string; content?: vscode.NotebookData }): Promise<URI> {
		const canonicalUri = await this._notebookDocumentsProxy.$tryCreateNotebook({
			viewType: options.viewType,
			content: options.content && typeConverters.NotebookData.from(options.content)
		});
		return URI.revive(canonicalUri);
	}

	async openNotebookDocument(uri: URI): Promise<vscode.NotebookDocument> {
		const cached = this._documents.get(uri);
		if (cached) {
			return cached.apiNotebook;
		}
		const canonicalUri = await this._notebookDocumentsProxy.$tryOpenNotebook(uri);
		const document = this._documents.get(URI.revive(canonicalUri));
		return assertReturnsDefined(document?.apiNotebook);
	}

	async showNotebookDocument(notebook: vscode.NotebookDocument, options?: vscode.NotebookDocumentShowOptions): Promise<vscode.NotebookEditor> {
		let resolvedOptions: INotebookDocumentShowOptions;
		if (typeof options === 'object') {
			resolvedOptions = {
				position: typeConverters.ViewColumn.from(options.viewColumn),
				preserveFocus: options.preserveFocus,
				selections: options.selections && options.selections.map(typeConverters.NotebookRange.from),
				pinned: typeof options.preview === 'boolean' ? !options.preview : undefined,
				label: typeof options.asRepl === 'string' ?
					options.asRepl :
					typeof options.asRepl === 'object' ?
						options.asRepl.label :
						undefined,
			};
		} else {
			resolvedOptions = {
				preserveFocus: false,
				pinned: true
			};
		}

		const viewType = !!options?.asRepl ? 'repl' : notebook.notebookType;
		const editorId = await this._notebookEditorsProxy.$tryShowNotebookDocument(notebook.uri, viewType, resolvedOptions);
		const editor = editorId && this._editors.get(editorId)?.apiEditor;

		if (editor) {
			return editor;
		}

		if (editorId) {
			throw new Error(`Could NOT open editor for "${notebook.uri.toString()}" because another editor opened in the meantime.`);
		} else {
			throw new Error(`Could NOT open editor for "${notebook.uri.toString()}".`);
		}
	}

	async $provideNotebookCellStatusBarItems(handle: number, uri: UriComponents, index: number, token: CancellationToken): Promise<INotebookCellStatusBarListDto | undefined> {
		const provider = this._notebookStatusBarItemProviders.get(handle);
		const revivedUri = URI.revive(uri);
		const document = this._documents.get(revivedUri);
		if (!document || !provider) {
			return;
		}

		const cell = document.getCellFromIndex(index);
		if (!cell) {
			return;
		}

		const result = await provider.provideCellStatusBarItems(cell.apiCell, token);
		if (!result) {
			return undefined;
		}

		const disposables = new DisposableStore();
		const cacheId = this._statusBarCache.add([disposables]);
		const resultArr = Array.isArray(result) ? result : [result];
		const items = resultArr.map(item => typeConverters.NotebookStatusBarItem.from(item, this._commandsConverter, disposables));
		return {
			cacheId,
			items
		};
	}

	$releaseNotebookCellStatusBarItems(cacheId: number): void {
		this._statusBarCache.delete(cacheId);
	}

	// --- serialize/deserialize

	private _handlePool = 0;
	private readonly _notebookSerializer = new Map<number, { viewType: string; serializer: vscode.NotebookSerializer; options: vscode.NotebookDocumentContentOptions | undefined }>();

	registerNotebookSerializer(extension: IExtensionDescription, viewType: string, serializer: vscode.NotebookSerializer, options?: vscode.NotebookDocumentContentOptions, registration?: vscode.NotebookRegistrationData): vscode.Disposable {
		if (isFalsyOrWhitespace(viewType)) {
			throw new Error(`viewType cannot be empty or just whitespace`);
		}
		const handle = this._handlePool++;
		this._notebookSerializer.set(handle, { viewType, serializer, options });
		this._notebookProxy.$registerNotebookSerializer(
			handle,
			{ id: extension.identifier, location: extension.extensionLocation },
			viewType,
			typeConverters.NotebookDocumentContentOptions.from(options),
			ExtHostNotebookController._convertNotebookRegistrationData(extension, registration)
		);
		return toDisposable(() => {
			this._notebookProxy.$unregisterNotebookSerializer(handle);
		});
	}

	async $dataToNotebook(handle: number, bytes: VSBuffer, token: CancellationToken): Promise<SerializableObjectWithBuffers<NotebookDataDto>> {
		const serializer = this._notebookSerializer.get(handle);
		if (!serializer) {
			throw new Error('NO serializer found');
		}
		const data = await serializer.serializer.deserializeNotebook(bytes.buffer, token);
		return new SerializableObjectWithBuffers(typeConverters.NotebookData.from(data));
	}

	async $notebookToData(handle: number, data: SerializableObjectWithBuffers<NotebookDataDto>, token: CancellationToken): Promise<VSBuffer> {
		const serializer = this._notebookSerializer.get(handle);
		if (!serializer) {
			throw new Error('NO serializer found');
		}
		const bytes = await serializer.serializer.serializeNotebook(typeConverters.NotebookData.to(data.value), token);
		return VSBuffer.wrap(bytes);
	}

	async $saveNotebook(handle: number, uriComponents: UriComponents, versionId: number, options: files.IWriteFileOptions, token: CancellationToken): Promise<INotebookPartialFileStatsWithMetadata | files.FileOperationError> {
		const uri = URI.revive(uriComponents);
		const serializer = this._notebookSerializer.get(handle);
		this.trace(`enter saveNotebook(versionId: ${versionId}, ${uri.toString()})`);

		try {
			if (!serializer) {
				throw new NotebookSaveError('NO serializer found');
			}

			const document = this._documents.get(uri);
			if (!document) {
				throw new NotebookSaveError('Document NOT found');
			}

			if (document.versionId !== versionId) {
				throw new NotebookSaveError('Document version mismatch, expected: ' + versionId + ', actual: ' + document.versionId);
			}

			if (!this._extHostFileSystem.value.isWritableFileSystem(uri.scheme)) {
				throw new files.FileOperationError(localize('err.readonly', "Unable to modify read-only file '{0}'", this._resourceForError(uri)), files.FileOperationResult.FILE_PERMISSION_DENIED);
			}

			const data: vscode.NotebookData = {
				metadata: filter(document.apiNotebook.metadata, key => !(serializer.options?.transientDocumentMetadata ?? {})[key]),
				cells: [],
			};

			// this data must be retrieved before any async calls to ensure the data is for the correct version
			for (const cell of document.apiNotebook.getCells()) {
				const cellData = new extHostTypes.NotebookCellData(
					cell.kind,
					cell.document.getText(),
					cell.document.languageId,
					cell.mime,
					!(serializer.options?.transientOutputs) ? [...cell.outputs] : [],
					cell.metadata,
					cell.executionSummary
				);

				cellData.metadata = filter(cell.metadata, key => !(serializer.options?.transientCellMetadata ?? {})[key]);
				data.cells.push(cellData);
			}

			// validate write
			await this._validateWriteFile(uri, options);

			if (token.isCancellationRequested) {
				throw new CancellationError();
			}
			const bytes = await serializer.serializer.serializeNotebook(data, token);
			if (token.isCancellationRequested) {
				throw new CancellationError();
			}

			// Don't accept any cancellation beyond this point, we need to report the result of the file write
			this.trace(`serialized versionId: ${versionId} ${uri.toString()}`);
			await this._extHostFileSystem.value.writeFile(uri, bytes);
			this.trace(`Finished write versionId: ${versionId} ${uri.toString()}`);
			const providerExtUri = this._extHostFileSystem.getFileSystemProviderExtUri(uri.scheme);
			const stat = await this._extHostFileSystem.value.stat(uri);

			const fileStats = {
				name: providerExtUri.basename(uri),
				isFile: (stat.type & files.FileType.File) !== 0,
				isDirectory: (stat.type & files.FileType.Directory) !== 0,
				isSymbolicLink: (stat.type & files.FileType.SymbolicLink) !== 0,
				mtime: stat.mtime,
				ctime: stat.ctime,
				size: stat.size,
				readonly: Boolean((stat.permissions ?? 0) & files.FilePermission.Readonly) || !this._extHostFileSystem.value.isWritableFileSystem(uri.scheme),
				locked: Boolean((stat.permissions ?? 0) & files.FilePermission.Locked),
				etag: files.etag({ mtime: stat.mtime, size: stat.size }),
				children: undefined
			};

			this.trace(`exit saveNotebook(versionId: ${versionId}, ${uri.toString()})`);
			return fileStats;
		} catch (error) {
			// return fileOperationsErrors to keep the whole object across serialization, these errors are handled specially by the WCS
			if (error instanceof files.FileOperationError) {
				return { ...error, message: error.message };
			}
			throw error;
		}
	}

	/**
	 * Search for query in all notebooks that can be deserialized by the serializer fetched by `handle`.
	 *
	 * @param handle used to get notebook serializer
	 * @param textQuery the text query to search using
	 * @param viewTypeFileTargets the globs (and associated ranks) that are targetting for opening this type of notebook
	 * @param otherViewTypeFileTargets ranked globs for other editors that we should consider when deciding whether it will open as this notebook
	 * @param token cancellation token
	 * @returns `IRawClosedNotebookFileMatch` for every file. Files without matches will just have a `IRawClosedNotebookFileMatch`
	 * 	with no `cellResults`. This allows the caller to know what was searched in already, even if it did not yield results.
	 */
	async $searchInNotebooks(handle: number, textQuery: ITextQuery, viewTypeFileTargets: NotebookPriorityInfo[], otherViewTypeFileTargets: NotebookPriorityInfo[], token: CancellationToken): Promise<{ results: IRawClosedNotebookFileMatch[]; limitHit: boolean }> {
		const serializer = this._notebookSerializer.get(handle)?.serializer;
		if (!serializer) {
			return {
				limitHit: false,
				results: []
			};
		}

		const finalMatchedTargets = new ResourceSet();

		const runFileQueries = async (includes: NotebookPriorityInfo[], token: CancellationToken, textQuery: ITextQuery): Promise<void> => {
			await Promise.all(includes.map(async include =>
				await Promise.all(include.filenamePatterns.map(filePattern => {
					const query: IFileQuery = {
						_reason: textQuery._reason,
						folderQueries: textQuery.folderQueries,
						includePattern: textQuery.includePattern,
						excludePattern: textQuery.excludePattern,
						maxResults: textQuery.maxResults,
						type: QueryType.File,
						filePattern
					};

					// use priority info to exclude info from other globs
					return this._extHostSearch.doInternalFileSearchWithCustomCallback(query, token, (data) => {
						data.forEach(uri => {
							if (finalMatchedTargets.has(uri)) {
								return;
							}
							const hasOtherMatches = otherViewTypeFileTargets.some(target => {
								// use the same strategy that the editor service uses to open editors
								// https://github.com/microsoft/vscode/blob/ac1631528e67637da65ec994c6dc35d73f6e33cc/src/vs/workbench/services/editor/browser/editorResolverService.ts#L359-L366
								if (include.isFromSettings && !target.isFromSettings) {
									// if the include is from the settings and target isn't, even if it matches, it's still overridden.
									return false;
								} else {
									// longer filePatterns are considered more specifc, so they always have precedence the shorter patterns
									return target.filenamePatterns.some(targetFilePattern => globMatchesResource(targetFilePattern, uri));
								}
							});

							if (hasOtherMatches) {
								return;
							}
							finalMatchedTargets.add(uri);
						});
					}).catch(err => {
						// temporary fix for https://github.com/microsoft/vscode/issues/205044: don't show notebook results for remotehub repos.
						if (err.code === 'ENOENT') {
							console.warn(`Could not find notebook search results, ignoring notebook results.`);
							return {
								limitHit: false,
								messages: [],
							};
						} else {
							throw err;
						}
					});
				}))
			));
			return;
		};

		await runFileQueries(viewTypeFileTargets, token, textQuery);

		const results = new ResourceMap<INotebookFileMatchNoModel>();
		let limitHit = false;
		const promises = Array.from(finalMatchedTargets).map(async (uri) => {
			const cellMatches: INotebookCellMatchNoModel[] = [];

			try {
				if (token.isCancellationRequested) {
					return;
				}
				if (textQuery.maxResults && [...results.values()].reduce((acc, value) => acc + value.cellResults.length, 0) > textQuery.maxResults) {
					limitHit = true;
					return;
				}

				const simpleCells: Array<{ input: string; outputs: string[] }> = [];
				const notebook = this._documents.get(uri);
				if (notebook) {
					const cells = notebook.apiNotebook.getCells();
					cells.forEach(e => simpleCells.push(
						{
							input: e.document.getText(),
							outputs: e.outputs.flatMap(value => value.items.map(output => output.data.toString()))
						}
					));
				} else {
					const fileContent = await this._extHostFileSystem.value.readFile(uri);
					const bytes = VSBuffer.fromString(fileContent.toString());
					const notebook = await serializer.deserializeNotebook(bytes.buffer, token);
					if (token.isCancellationRequested) {
						return;
					}
					const data = typeConverters.NotebookData.from(notebook);

					data.cells.forEach(cell => simpleCells.push(
						{
							input: cell.source,
							outputs: cell.outputs.flatMap(value => value.items.map(output => output.valueBytes.toString()))
						}
					));
				}


				if (token.isCancellationRequested) {
					return;
				}

				simpleCells.forEach((cell, index) => {
					const target = textQuery.contentPattern.pattern;
					const cellModel = new CellSearchModel(cell.input, undefined, cell.outputs);

					const inputMatches = cellModel.findInInputs(target);
					const outputMatches = cellModel.findInOutputs(target);
					const webviewResults = outputMatches
						.flatMap(outputMatch =>
							genericCellMatchesToTextSearchMatches(outputMatch.matches, outputMatch.textBuffer))
						.map((textMatch, index) => {
							textMatch.webviewIndex = index;
							return textMatch;
						});

					if (inputMatches.length > 0 || outputMatches.length > 0) {
						const cellMatch: INotebookCellMatchNoModel = {
							index: index,
							contentResults: genericCellMatchesToTextSearchMatches(inputMatches, cellModel.inputTextBuffer),
							webviewResults
						};
						cellMatches.push(cellMatch);
					}
				});

				const fileMatch = {
					resource: uri, cellResults: cellMatches
				};
				results.set(uri, fileMatch);
				return;

			} catch (e) {
				return;
			}

		});

		await Promise.all(promises);
		return {
			limitHit,
			results: [...results.values()]
		};
	}



	private async _validateWriteFile(uri: URI, options: files.IWriteFileOptions) {
		const stat = await this._extHostFileSystem.value.stat(uri);
		// Dirty write prevention
		if (
			typeof options?.mtime === 'number' && typeof options.etag === 'string' && options.etag !== files.ETAG_DISABLED &&
			typeof stat.mtime === 'number' && typeof stat.size === 'number' &&
			options.mtime < stat.mtime && options.etag !== files.etag({ mtime: options.mtime /* not using stat.mtime for a reason, see above */, size: stat.size })
		) {
			throw new files.FileOperationError(localize('fileModifiedError', "File Modified Since"), files.FileOperationResult.FILE_MODIFIED_SINCE, options);
		}

		return;
	}

	private _resourceForError(uri: URI): string {
		return uri.scheme === Schemas.file ? uri.fsPath : uri.toString();
	}

	// --- open, save, saveAs, backup


	private _createExtHostEditor(document: ExtHostNotebookDocument, editorId: string, data: INotebookEditorAddData) {

		if (this._editors.has(editorId)) {
			throw new Error(`editor with id ALREADY EXSIST: ${editorId}`);
		}

		const editor = new ExtHostNotebookEditor(
			editorId,
			this._notebookEditorsProxy,
			document,
			data.visibleRanges.map(typeConverters.NotebookRange.to),
			data.selections.map(typeConverters.NotebookRange.to),
			typeof data.viewColumn === 'number' ? typeConverters.ViewColumn.to(data.viewColumn) : undefined,
			data.viewType
		);

		this._editors.set(editorId, editor);
	}

	$acceptDocumentAndEditorsDelta(delta: SerializableObjectWithBuffers<INotebookDocumentsAndEditorsDelta>): void {

		if (delta.value.removedDocuments) {
			for (const uri of delta.value.removedDocuments) {
				const revivedUri = URI.revive(uri);
				const document = this._documents.get(revivedUri);

				if (document) {
					document.dispose();
					this._documents.delete(revivedUri);
					this._textDocumentsAndEditors.$acceptDocumentsAndEditorsDelta({ removedDocuments: document.apiNotebook.getCells().map(cell => cell.document.uri) });
					this._onDidCloseNotebookDocument.fire(document.apiNotebook);
				}

				for (const editor of this._editors.values()) {
					if (editor.notebookData.uri.toString() === revivedUri.toString()) {
						this._editors.delete(editor.id);
					}
				}
			}
		}

		if (delta.value.addedDocuments) {

			const addedCellDocuments: IModelAddedData[] = [];

			for (const modelData of delta.value.addedDocuments) {
				const uri = URI.revive(modelData.uri);

				if (this._documents.has(uri)) {
					throw new Error(`adding EXISTING notebook ${uri} `);
				}

				const document = new ExtHostNotebookDocument(
					this._notebookDocumentsProxy,
					this._textDocumentsAndEditors,
					this._textDocuments,
					uri,
					modelData
				);

				// add cell document as vscode.TextDocument
				addedCellDocuments.push(...modelData.cells.map(cell => ExtHostCell.asModelAddData(cell)));

				this._documents.get(uri)?.dispose();
				this._documents.set(uri, document);
				this._textDocumentsAndEditors.$acceptDocumentsAndEditorsDelta({ addedDocuments: addedCellDocuments });

				this._onDidOpenNotebookDocument.fire(document.apiNotebook);
			}
		}

		if (delta.value.addedEditors) {
			for (const editorModelData of delta.value.addedEditors) {
				if (this._editors.has(editorModelData.id)) {
					return;
				}

				const revivedUri = URI.revive(editorModelData.documentUri);
				const document = this._documents.get(revivedUri);

				if (document) {
					this._createExtHostEditor(document, editorModelData.id, editorModelData);
				}
			}
		}

		const removedEditors: ExtHostNotebookEditor[] = [];

		if (delta.value.removedEditors) {
			for (const editorid of delta.value.removedEditors) {
				const editor = this._editors.get(editorid);

				if (editor) {
					this._editors.delete(editorid);

					if (this._activeNotebookEditor?.id === editor.id) {
						this._activeNotebookEditor = undefined;
					}

					removedEditors.push(editor);
				}
			}
		}

		if (delta.value.visibleEditors) {
			this._visibleNotebookEditors = delta.value.visibleEditors.map(id => this._editors.get(id)!).filter(editor => !!editor) as ExtHostNotebookEditor[];
			const visibleEditorsSet = new Set<string>();
			this._visibleNotebookEditors.forEach(editor => visibleEditorsSet.add(editor.id));

			for (const editor of this._editors.values()) {
				const newValue = visibleEditorsSet.has(editor.id);
				editor._acceptVisibility(newValue);
			}

			this._visibleNotebookEditors = [...this._editors.values()].map(e => e).filter(e => e.visible);
			this._onDidChangeVisibleNotebookEditors.fire(this.visibleNotebookEditors);
		}

		if (delta.value.newActiveEditor === null) {
			// clear active notebook as current active editor is non-notebook editor
			this._activeNotebookEditor = undefined;
		} else if (delta.value.newActiveEditor) {
			const activeEditor = this._editors.get(delta.value.newActiveEditor);
			if (!activeEditor) {
				console.error(`FAILED to find active notebook editor ${delta.value.newActiveEditor}`);
			}
			this._activeNotebookEditor = this._editors.get(delta.value.newActiveEditor);
		}
		if (delta.value.newActiveEditor !== undefined) {
			this._onDidChangeActiveNotebookEditor.fire(this._activeNotebookEditor?.apiEditor);
		}
	}

	private static _registerApiCommands(extHostCommands: ExtHostCommands) {

		const notebookTypeArg = ApiCommandArgument.String.with('notebookType', 'A notebook type');

		const commandDataToNotebook = new ApiCommand(
			'vscode.executeDataToNotebook', '_executeDataToNotebook', 'Invoke notebook serializer',
			[notebookTypeArg, new ApiCommandArgument<Uint8Array, VSBuffer>('data', 'Bytes to convert to data', v => v instanceof Uint8Array, v => VSBuffer.wrap(v))],
			new ApiCommandResult<SerializableObjectWithBuffers<NotebookDataDto>, vscode.NotebookData>('Notebook Data', data => typeConverters.NotebookData.to(data.value))
		);

		const commandNotebookToData = new ApiCommand(
			'vscode.executeNotebookToData', '_executeNotebookToData', 'Invoke notebook serializer',
			[notebookTypeArg, new ApiCommandArgument<vscode.NotebookData, SerializableObjectWithBuffers<NotebookDataDto>>('NotebookData', 'Notebook data to convert to bytes', v => true, v => new SerializableObjectWithBuffers(typeConverters.NotebookData.from(v)))],
			new ApiCommandResult<VSBuffer, Uint8Array>('Bytes', dto => dto.buffer)
		);

		extHostCommands.registerApiCommand(commandDataToNotebook);
		extHostCommands.registerApiCommand(commandNotebookToData);
	}

	private trace(msg: string): void {
		this._logService.trace(`[Extension Host Notebook] ${msg}`);
	}
}

export class NotebookSaveError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'NotebookSaveError';
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostNotebookDocument.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostNotebookDocument.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';
import * as extHostProtocol from './extHost.protocol.js';
import { ExtHostDocuments } from './extHostDocuments.js';
import { ExtHostDocumentsAndEditors } from './extHostDocumentsAndEditors.js';
import * as extHostTypeConverters from './extHostTypeConverters.js';
import { NotebookRange } from './extHostTypes.js';
import * as notebookCommon from '../../contrib/notebook/common/notebookCommon.js';
import * as vscode from 'vscode';
import { isTextStreamMime } from '../../../base/common/mime.js';

class RawContentChangeEvent {

	constructor(
		readonly start: number,
		readonly deletedCount: number,
		readonly deletedItems: vscode.NotebookCell[],
		readonly items: ExtHostCell[]
	) { }

	asApiEvent(): vscode.NotebookDocumentContentChange {
		return {
			range: new NotebookRange(this.start, this.start + this.deletedCount),
			addedCells: this.items.map(cell => cell.apiCell),
			removedCells: this.deletedItems,
		};
	}
}

export class ExtHostCell {

	static asModelAddData(cell: extHostProtocol.NotebookCellDto): extHostProtocol.IModelAddedData {
		return {
			EOL: cell.eol,
			lines: cell.source,
			languageId: cell.language,
			uri: cell.uri,
			isDirty: false,
			versionId: 1,
			encoding: 'utf8'
		};
	}

	private _outputs: vscode.NotebookCellOutput[];
	private _metadata: Readonly<notebookCommon.NotebookCellMetadata>;
	private _previousResult: Readonly<vscode.NotebookCellExecutionSummary | undefined>;

	private _internalMetadata: notebookCommon.NotebookCellInternalMetadata;
	readonly handle: number;
	readonly uri: URI;
	readonly cellKind: notebookCommon.CellKind;

	private _apiCell: vscode.NotebookCell | undefined;
	private _mime: string | undefined;

	constructor(
		readonly notebook: ExtHostNotebookDocument,
		private readonly _extHostDocument: ExtHostDocumentsAndEditors,
		private readonly _cellData: extHostProtocol.NotebookCellDto,
	) {
		this.handle = _cellData.handle;
		this.uri = URI.revive(_cellData.uri);
		this.cellKind = _cellData.cellKind;
		this._outputs = _cellData.outputs.map(extHostTypeConverters.NotebookCellOutput.to);
		this._internalMetadata = _cellData.internalMetadata ?? {};
		this._metadata = Object.freeze(_cellData.metadata ?? {});
		this._previousResult = Object.freeze(extHostTypeConverters.NotebookCellExecutionSummary.to(_cellData.internalMetadata ?? {}));
	}

	get internalMetadata(): notebookCommon.NotebookCellInternalMetadata {
		return this._internalMetadata;
	}

	get apiCell(): vscode.NotebookCell {
		if (!this._apiCell) {
			const that = this;
			const data = this._extHostDocument.getDocument(this.uri);
			if (!data) {
				throw new Error(`MISSING extHostDocument for notebook cell: ${this.uri}`);
			}
			const apiCell: vscode.NotebookCell = {
				get index() { return that.notebook.getCellIndex(that); },
				notebook: that.notebook.apiNotebook,
				kind: extHostTypeConverters.NotebookCellKind.to(this._cellData.cellKind),
				document: data.document,
				get mime() { return that._mime; },
				set mime(value: string | undefined) { that._mime = value; },
				get outputs() { return that._outputs.slice(0); },
				get metadata() { return that._metadata; },
				get executionSummary() { return that._previousResult; }
			};
			this._apiCell = Object.freeze(apiCell);
		}
		return this._apiCell;
	}

	setOutputs(newOutputs: extHostProtocol.NotebookOutputDto[]): void {
		this._outputs = newOutputs.map(extHostTypeConverters.NotebookCellOutput.to);
	}

	setOutputItems(outputId: string, append: boolean, newOutputItems: extHostProtocol.NotebookOutputItemDto[]) {
		const newItems = newOutputItems.map(extHostTypeConverters.NotebookCellOutputItem.to);
		const output = this._outputs.find(op => op.id === outputId);
		if (output) {
			if (!append) {
				output.items.length = 0;
			}
			output.items.push(...newItems);

			if (output.items.length > 1 && output.items.every(item => isTextStreamMime(item.mime))) {
				// Look for the mimes in the items, and keep track of their order.
				// Merge the streams into one output item, per mime type.
				const mimeOutputs = new Map<string, Uint8Array[]>();
				const mimeTypes: string[] = [];
				output.items.forEach(item => {
					let items: Uint8Array[];
					if (mimeOutputs.has(item.mime)) {
						items = mimeOutputs.get(item.mime)!;
					} else {
						items = [];
						mimeOutputs.set(item.mime, items);
						mimeTypes.push(item.mime);
					}
					items.push(item.data);
				});
				output.items.length = 0;
				mimeTypes.forEach(mime => {
					const compressed = notebookCommon.compressOutputItemStreams(mimeOutputs.get(mime)!);
					output.items.push({
						mime,
						data: compressed.data.buffer
					});
				});
			}
		}
	}

	setMetadata(newMetadata: notebookCommon.NotebookCellMetadata): void {
		this._metadata = Object.freeze(newMetadata);
	}

	setInternalMetadata(newInternalMetadata: notebookCommon.NotebookCellInternalMetadata): void {
		this._internalMetadata = newInternalMetadata;
		this._previousResult = Object.freeze(extHostTypeConverters.NotebookCellExecutionSummary.to(newInternalMetadata));
	}

	setMime(newMime: string | undefined) {

	}
}


export class ExtHostNotebookDocument {

	private static _handlePool: number = 0;
	readonly handle = ExtHostNotebookDocument._handlePool++;

	private readonly _cells: ExtHostCell[] = [];

	private readonly _notebookType: string;

	private _notebook: vscode.NotebookDocument | undefined;
	private _metadata: Record<string, any>;
	private _versionId: number = 0;
	private _isDirty: boolean = false;
	private _disposed: boolean = false;

	constructor(
		private readonly _proxy: extHostProtocol.MainThreadNotebookDocumentsShape,
		private readonly _textDocumentsAndEditors: ExtHostDocumentsAndEditors,
		private readonly _textDocuments: ExtHostDocuments,
		readonly uri: URI,
		data: extHostProtocol.INotebookModelAddedData
	) {
		this._notebookType = data.viewType;
		this._metadata = Object.freeze(data.metadata ?? Object.create(null));
		this._spliceNotebookCells([[0, 0, data.cells]], true /* init -> no event*/, undefined);
		this._versionId = data.versionId;
	}

	dispose() {
		this._disposed = true;
	}

	get versionId(): number {
		return this._versionId;
	}

	get apiNotebook(): vscode.NotebookDocument {
		if (!this._notebook) {
			const that = this;
			const apiObject: vscode.NotebookDocument = {
				get uri() { return that.uri; },
				get version() { return that._versionId; },
				get notebookType() { return that._notebookType; },
				get isDirty() { return that._isDirty; },
				get isUntitled() { return that.uri.scheme === Schemas.untitled; },
				get isClosed() { return that._disposed; },
				get metadata() { return that._metadata; },
				get cellCount() { return that._cells.length; },
				cellAt(index) {
					index = that._validateIndex(index);
					return that._cells[index].apiCell;
				},
				getCells(range) {
					const cells = range ? that._getCells(range) : that._cells;
					return cells.map(cell => cell.apiCell);
				},
				save() {
					return that._save();
				},
				[Symbol.for('debug.description')]() {
					return `NotebookDocument(${this.uri.toString()})`;
				}
			};
			this._notebook = Object.freeze(apiObject);
		}
		return this._notebook;
	}

	acceptDocumentPropertiesChanged(data: extHostProtocol.INotebookDocumentPropertiesChangeData) {
		if (data.metadata) {
			this._metadata = Object.freeze({ ...this._metadata, ...data.metadata });
		}
	}

	acceptDirty(isDirty: boolean): void {
		this._isDirty = isDirty;
	}

	acceptModelChanged(event: extHostProtocol.NotebookCellsChangedEventDto, isDirty: boolean, newMetadata: notebookCommon.NotebookDocumentMetadata | undefined): vscode.NotebookDocumentChangeEvent {
		this._versionId = event.versionId;
		this._isDirty = isDirty;
		this.acceptDocumentPropertiesChanged({ metadata: newMetadata });

		const result = {
			notebook: this.apiNotebook,
			metadata: newMetadata,
			cellChanges: <vscode.NotebookDocumentCellChange[]>[],
			contentChanges: <vscode.NotebookDocumentContentChange[]>[],
		};

		type RelaxedCellChange = Partial<vscode.NotebookDocumentCellChange> & { cell: vscode.NotebookCell };
		const relaxedCellChanges: RelaxedCellChange[] = [];

		// -- apply change and populate content changes

		for (const rawEvent of event.rawEvents) {
			if (rawEvent.kind === notebookCommon.NotebookCellsChangeType.ModelChange) {
				this._spliceNotebookCells(rawEvent.changes, false, result.contentChanges);

			} else if (rawEvent.kind === notebookCommon.NotebookCellsChangeType.Move) {
				this._moveCells(rawEvent.index, rawEvent.length, rawEvent.newIdx, result.contentChanges);

			} else if (rawEvent.kind === notebookCommon.NotebookCellsChangeType.Output) {
				this._setCellOutputs(rawEvent.index, rawEvent.outputs);
				relaxedCellChanges.push({ cell: this._cells[rawEvent.index].apiCell, outputs: this._cells[rawEvent.index].apiCell.outputs });

			} else if (rawEvent.kind === notebookCommon.NotebookCellsChangeType.OutputItem) {
				this._setCellOutputItems(rawEvent.index, rawEvent.outputId, rawEvent.append, rawEvent.outputItems);
				relaxedCellChanges.push({ cell: this._cells[rawEvent.index].apiCell, outputs: this._cells[rawEvent.index].apiCell.outputs });

			} else if (rawEvent.kind === notebookCommon.NotebookCellsChangeType.ChangeCellLanguage) {
				this._changeCellLanguage(rawEvent.index, rawEvent.language);
				relaxedCellChanges.push({ cell: this._cells[rawEvent.index].apiCell, document: this._cells[rawEvent.index].apiCell.document });

			} else if (rawEvent.kind === notebookCommon.NotebookCellsChangeType.ChangeCellContent) {
				relaxedCellChanges.push({ cell: this._cells[rawEvent.index].apiCell, document: this._cells[rawEvent.index].apiCell.document });

			} else if (rawEvent.kind === notebookCommon.NotebookCellsChangeType.ChangeCellMime) {
				this._changeCellMime(rawEvent.index, rawEvent.mime);
			} else if (rawEvent.kind === notebookCommon.NotebookCellsChangeType.ChangeCellMetadata) {
				this._changeCellMetadata(rawEvent.index, rawEvent.metadata);
				relaxedCellChanges.push({ cell: this._cells[rawEvent.index].apiCell, metadata: this._cells[rawEvent.index].apiCell.metadata });

			} else if (rawEvent.kind === notebookCommon.NotebookCellsChangeType.ChangeCellInternalMetadata) {
				this._changeCellInternalMetadata(rawEvent.index, rawEvent.internalMetadata);
				relaxedCellChanges.push({ cell: this._cells[rawEvent.index].apiCell, executionSummary: this._cells[rawEvent.index].apiCell.executionSummary });
			}
		}

		// -- compact cellChanges

		const map = new Map<vscode.NotebookCell, number>();
		for (let i = 0; i < relaxedCellChanges.length; i++) {
			const relaxedCellChange = relaxedCellChanges[i];
			const existing = map.get(relaxedCellChange.cell);
			if (existing === undefined) {
				const newLen = result.cellChanges.push({
					document: undefined,
					executionSummary: undefined,
					metadata: undefined,
					outputs: undefined,
					...relaxedCellChange,
				});
				map.set(relaxedCellChange.cell, newLen - 1);
			} else {
				result.cellChanges[existing] = {
					...result.cellChanges[existing],
					...relaxedCellChange
				};
			}
		}

		// Freeze event properties so handlers cannot accidentally modify them
		Object.freeze(result);
		Object.freeze(result.cellChanges);
		Object.freeze(result.contentChanges);

		return result;
	}

	private _validateIndex(index: number): number {
		index = index | 0;
		if (index < 0) {
			return 0;
		} else if (index >= this._cells.length) {
			return this._cells.length - 1;
		} else {
			return index;
		}
	}

	private _validateRange(range: vscode.NotebookRange): vscode.NotebookRange {
		let start = range.start | 0;
		let end = range.end | 0;
		if (start < 0) {
			start = 0;
		}
		if (end > this._cells.length) {
			end = this._cells.length;
		}
		return range.with({ start, end });
	}

	private _getCells(range: vscode.NotebookRange): ExtHostCell[] {
		range = this._validateRange(range);
		const result: ExtHostCell[] = [];
		for (let i = range.start; i < range.end; i++) {
			result.push(this._cells[i]);
		}
		return result;
	}

	private async _save(): Promise<boolean> {
		if (this._disposed) {
			return Promise.reject(new Error('Notebook has been closed'));
		}
		return this._proxy.$trySaveNotebook(this.uri);
	}

	private _spliceNotebookCells(splices: notebookCommon.NotebookCellTextModelSplice<extHostProtocol.NotebookCellDto>[], initialization: boolean, bucket: vscode.NotebookDocumentContentChange[] | undefined): void {
		if (this._disposed) {
			return;
		}

		const contentChangeEvents: RawContentChangeEvent[] = [];
		const addedCellDocuments: extHostProtocol.IModelAddedData[] = [];
		const removedCellDocuments: URI[] = [];

		splices.reverse().forEach(splice => {
			const cellDtos = splice[2];
			const newCells = cellDtos.map(cell => {

				const extCell = new ExtHostCell(this, this._textDocumentsAndEditors, cell);
				if (!initialization) {
					addedCellDocuments.push(ExtHostCell.asModelAddData(cell));
				}
				return extCell;
			});

			const changeEvent = new RawContentChangeEvent(splice[0], splice[1], [], newCells);
			const deletedItems = this._cells.splice(splice[0], splice[1], ...newCells);
			for (const cell of deletedItems) {
				removedCellDocuments.push(cell.uri);
				changeEvent.deletedItems.push(cell.apiCell);
			}
			contentChangeEvents.push(changeEvent);
		});

		this._textDocumentsAndEditors.acceptDocumentsAndEditorsDelta({
			addedDocuments: addedCellDocuments,
			removedDocuments: removedCellDocuments
		});

		if (bucket) {
			for (const changeEvent of contentChangeEvents) {
				bucket.push(changeEvent.asApiEvent());
			}
		}
	}

	private _moveCells(index: number, length: number, newIdx: number, bucket: vscode.NotebookDocumentContentChange[]): void {
		const cells = this._cells.splice(index, length);
		this._cells.splice(newIdx, 0, ...cells);
		const changes = [
			new RawContentChangeEvent(index, length, cells.map(c => c.apiCell), []),
			new RawContentChangeEvent(newIdx, 0, [], cells)
		];
		for (const change of changes) {
			bucket.push(change.asApiEvent());
		}
	}

	private _setCellOutputs(index: number, outputs: extHostProtocol.NotebookOutputDto[]): void {
		const cell = this._cells[index];
		cell.setOutputs(outputs);
	}

	private _setCellOutputItems(index: number, outputId: string, append: boolean, outputItems: extHostProtocol.NotebookOutputItemDto[]): void {
		const cell = this._cells[index];
		cell.setOutputItems(outputId, append, outputItems);
	}

	private _changeCellLanguage(index: number, newLanguageId: string): void {
		const cell = this._cells[index];
		if (cell.apiCell.document.languageId !== newLanguageId) {
			this._textDocuments.$acceptModelLanguageChanged(cell.uri, newLanguageId);
		}
	}

	private _changeCellMime(index: number, newMime: string | undefined): void {
		const cell = this._cells[index];
		cell.apiCell.mime = newMime;
	}

	private _changeCellMetadata(index: number, newMetadata: notebookCommon.NotebookCellMetadata): void {
		const cell = this._cells[index];
		cell.setMetadata(newMetadata);
	}

	private _changeCellInternalMetadata(index: number, newInternalMetadata: notebookCommon.NotebookCellInternalMetadata): void {
		const cell = this._cells[index];
		cell.setInternalMetadata(newInternalMetadata);
	}

	getCellFromApiCell(apiCell: vscode.NotebookCell): ExtHostCell | undefined {
		return this._cells.find(cell => cell.apiCell === apiCell);
	}

	getCellFromIndex(index: number): ExtHostCell | undefined {
		return this._cells[index];
	}

	getCell(cellHandle: number): ExtHostCell | undefined {
		return this._cells.find(cell => cell.handle === cellHandle);
	}

	getCellIndex(cell: ExtHostCell): number {
		return this._cells.indexOf(cell);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostNotebookDocuments.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostNotebookDocuments.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../base/common/event.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import * as extHostProtocol from './extHost.protocol.js';
import { ExtHostNotebookController } from './extHostNotebook.js';
import { NotebookDocumentMetadata } from '../../contrib/notebook/common/notebookCommon.js';
import { SerializableObjectWithBuffers } from '../../services/extensions/common/proxyIdentifier.js';
import type * as vscode from 'vscode';

export class ExtHostNotebookDocuments implements extHostProtocol.ExtHostNotebookDocumentsShape {

	private readonly _onDidSaveNotebookDocument = new Emitter<vscode.NotebookDocument>();
	readonly onDidSaveNotebookDocument = this._onDidSaveNotebookDocument.event;

	private readonly _onDidChangeNotebookDocument = new Emitter<vscode.NotebookDocumentChangeEvent>();
	readonly onDidChangeNotebookDocument = this._onDidChangeNotebookDocument.event;

	constructor(
		private readonly _notebooksAndEditors: ExtHostNotebookController,
	) { }

	$acceptModelChanged(uri: UriComponents, event: SerializableObjectWithBuffers<extHostProtocol.NotebookCellsChangedEventDto>, isDirty: boolean, newMetadata?: NotebookDocumentMetadata): void {
		const document = this._notebooksAndEditors.getNotebookDocument(URI.revive(uri));
		const e = document.acceptModelChanged(event.value, isDirty, newMetadata);
		this._onDidChangeNotebookDocument.fire(e);
	}

	$acceptDirtyStateChanged(uri: UriComponents, isDirty: boolean): void {
		const document = this._notebooksAndEditors.getNotebookDocument(URI.revive(uri));
		document.acceptDirty(isDirty);
	}

	$acceptModelSaved(uri: UriComponents): void {
		const document = this._notebooksAndEditors.getNotebookDocument(URI.revive(uri));
		this._onDidSaveNotebookDocument.fire(document.apiNotebook);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostNotebookDocumentSaveParticipant.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostNotebookDocumentSaveParticipant.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { AsyncEmitter, Event } from '../../../base/common/event.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { ExtHostNotebookDocumentSaveParticipantShape, IWorkspaceEditDto, MainThreadBulkEditsShape } from './extHost.protocol.js';
import { ExtHostNotebookController } from './extHostNotebook.js';
import { TextDocumentSaveReason, WorkspaceEdit as WorksapceEditConverter } from './extHostTypeConverters.js';
import { WorkspaceEdit } from './extHostTypes.js';
import { SaveReason } from '../../common/editor.js';
import { SerializableObjectWithBuffers } from '../../services/extensions/common/proxyIdentifier.js';
import { NotebookDocumentWillSaveEvent } from 'vscode';

interface IExtensionListener<E> {
	extension: IExtensionDescription;
	(e: E): any;
}

export class ExtHostNotebookDocumentSaveParticipant implements ExtHostNotebookDocumentSaveParticipantShape {

	private readonly _onWillSaveNotebookDocumentEvent = new AsyncEmitter<NotebookDocumentWillSaveEvent>();

	constructor(
		private readonly _logService: ILogService,
		private readonly _notebooksAndEditors: ExtHostNotebookController,
		private readonly _mainThreadBulkEdits: MainThreadBulkEditsShape,
		private readonly _thresholds: { timeout: number; errors: number } = { timeout: 1500, errors: 3 }) {

	}

	dispose(): void {
	}

	getOnWillSaveNotebookDocumentEvent(extension: IExtensionDescription): Event<NotebookDocumentWillSaveEvent> {
		return (listener, thisArg, disposables) => {
			const wrappedListener: IExtensionListener<NotebookDocumentWillSaveEvent> = function wrapped(e) { listener.call(thisArg, e); };
			wrappedListener.extension = extension;
			return this._onWillSaveNotebookDocumentEvent.event(wrappedListener, undefined, disposables);
		};
	}

	async $participateInSave(resource: UriComponents, reason: SaveReason, token: CancellationToken): Promise<boolean> {
		const revivedUri = URI.revive(resource);
		const document = this._notebooksAndEditors.getNotebookDocument(revivedUri);

		if (!document) {
			throw new Error('Unable to resolve notebook document');
		}

		const edits: WorkspaceEdit[] = [];

		await this._onWillSaveNotebookDocumentEvent.fireAsync({ notebook: document.apiNotebook, reason: TextDocumentSaveReason.to(reason) }, token, async (thenable: Promise<unknown>, listener) => {
			const now = Date.now();
			const data = await await Promise.resolve(thenable);
			if (Date.now() - now > this._thresholds.timeout) {
				this._logService.warn('onWillSaveNotebookDocument-listener from extension', (<IExtensionListener<NotebookDocumentWillSaveEvent>>listener).extension.identifier);
			}

			if (token.isCancellationRequested) {
				return;
			}

			if (data) {
				if (data instanceof WorkspaceEdit) {
					edits.push(data);
				} else {
					// ignore invalid data
					this._logService.warn('onWillSaveNotebookDocument-listener from extension', (<IExtensionListener<NotebookDocumentWillSaveEvent>>listener).extension.identifier, 'ignored due to invalid data');
				}
			}

			return;
		});

		if (token.isCancellationRequested) {
			return false;
		}

		if (edits.length === 0) {
			return true;
		}

		const dto: IWorkspaceEditDto = { edits: [] };
		for (const edit of edits) {
			const { edits } = WorksapceEditConverter.from(edit);
			dto.edits = dto.edits.concat(edits);
		}

		return this._mainThreadBulkEdits.$tryApplyWorkspaceEdit(new SerializableObjectWithBuffers(dto));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostNotebookEditor.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostNotebookEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { illegalArgument } from '../../../base/common/errors.js';
import { MainThreadNotebookEditorsShape } from './extHost.protocol.js';
import * as extHostConverter from './extHostTypeConverters.js';
import * as extHostTypes from './extHostTypes.js';
import * as vscode from 'vscode';
import { ExtHostNotebookDocument } from './extHostNotebookDocument.js';
import { NotebookRange } from './extHostTypes.js';

export class ExtHostNotebookEditor {

	public static readonly apiEditorsToExtHost = new WeakMap<vscode.NotebookEditor, ExtHostNotebookEditor>();

	private _visible: boolean = false;

	private _editor?: vscode.NotebookEditor;

	constructor(
		readonly id: string,
		private readonly _proxy: MainThreadNotebookEditorsShape,
		readonly notebookData: ExtHostNotebookDocument,
		private _visibleRanges: vscode.NotebookRange[],
		private _selections: vscode.NotebookRange[],
		private _viewColumn: vscode.ViewColumn | undefined,
		private readonly viewType: string
	) { }

	get apiEditor(): vscode.NotebookEditor {
		if (!this._editor) {
			const that = this;
			this._editor = {
				get notebook() {
					return that.notebookData.apiNotebook;
				},
				get selection() {
					return that._selections[0];
				},
				set selection(selection: vscode.NotebookRange) {
					this.selections = [selection];
				},
				get selections() {
					return that._selections;
				},
				set selections(value: vscode.NotebookRange[]) {
					if (!Array.isArray(value) || !value.every(extHostTypes.NotebookRange.isNotebookRange)) {
						throw illegalArgument('selections');
					}
					that._selections = value.length === 0 ? [new NotebookRange(0, 0)] : value;
					that._trySetSelections(that._selections);
				},
				get visibleRanges() {
					return that._visibleRanges;
				},
				revealRange(range, revealType) {
					that._proxy.$tryRevealRange(
						that.id,
						extHostConverter.NotebookRange.from(range),
						revealType ?? extHostTypes.NotebookEditorRevealType.Default
					);
				},
				get viewColumn() {
					return that._viewColumn;
				},
				get replOptions() {
					if (that.viewType === 'repl') {
						return { appendIndex: this.notebook.cellCount - 1 };
					}
					return undefined;
				},
				[Symbol.for('debug.description')]() {
					return `NotebookEditor(${this.notebook.uri.toString()})`;
				}
			};

			ExtHostNotebookEditor.apiEditorsToExtHost.set(this._editor, this);
		}
		return this._editor;
	}

	get visible(): boolean {
		return this._visible;
	}

	_acceptVisibility(value: boolean) {
		this._visible = value;
	}

	_acceptVisibleRanges(value: vscode.NotebookRange[]): void {
		this._visibleRanges = value;
	}

	_acceptSelections(selections: vscode.NotebookRange[]): void {
		this._selections = selections;
	}

	private _trySetSelections(value: vscode.NotebookRange[]): void {
		this._proxy.$trySetSelections(this.id, value.map(extHostConverter.NotebookRange.from));
	}

	_acceptViewColumn(value: vscode.ViewColumn | undefined) {
		this._viewColumn = value;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostNotebookEditors.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostNotebookEditors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../base/common/event.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { ExtHostNotebookEditorsShape, INotebookEditorPropertiesChangeData, INotebookEditorViewColumnInfo } from './extHost.protocol.js';
import { ExtHostNotebookController } from './extHostNotebook.js';
import * as typeConverters from './extHostTypeConverters.js';
import type * as vscode from 'vscode';


export class ExtHostNotebookEditors implements ExtHostNotebookEditorsShape {

	private readonly _onDidChangeNotebookEditorSelection = new Emitter<vscode.NotebookEditorSelectionChangeEvent>();
	private readonly _onDidChangeNotebookEditorVisibleRanges = new Emitter<vscode.NotebookEditorVisibleRangesChangeEvent>();

	readonly onDidChangeNotebookEditorSelection = this._onDidChangeNotebookEditorSelection.event;
	readonly onDidChangeNotebookEditorVisibleRanges = this._onDidChangeNotebookEditorVisibleRanges.event;

	constructor(
		@ILogService private readonly _logService: ILogService,
		private readonly _notebooksAndEditors: ExtHostNotebookController,
	) { }

	$acceptEditorPropertiesChanged(id: string, data: INotebookEditorPropertiesChangeData): void {
		this._logService.debug('ExtHostNotebook#$acceptEditorPropertiesChanged', id, data);
		const editor = this._notebooksAndEditors.getEditorById(id);
		// ONE: make all state updates
		if (data.visibleRanges) {
			editor._acceptVisibleRanges(data.visibleRanges.ranges.map(typeConverters.NotebookRange.to));
		}
		if (data.selections) {
			editor._acceptSelections(data.selections.selections.map(typeConverters.NotebookRange.to));
		}

		// TWO: send all events after states have been updated
		if (data.visibleRanges) {
			this._onDidChangeNotebookEditorVisibleRanges.fire({
				notebookEditor: editor.apiEditor,
				visibleRanges: editor.apiEditor.visibleRanges
			});
		}
		if (data.selections) {
			this._onDidChangeNotebookEditorSelection.fire(Object.freeze({
				notebookEditor: editor.apiEditor,
				selections: editor.apiEditor.selections
			}));
		}
	}

	$acceptEditorViewColumns(data: INotebookEditorViewColumnInfo): void {
		for (const id in data) {
			const editor = this._notebooksAndEditors.getEditorById(id);
			editor._acceptViewColumn(typeConverters.ViewColumn.to(data[id]));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostNotebookKernels.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostNotebookKernels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { asArray } from '../../../base/common/arrays.js';
import { DeferredPromise, timeout } from '../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../base/common/cancellation.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../base/common/map.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { ExtHostNotebookKernelsShape, ICellExecuteUpdateDto, IMainContext, INotebookKernelDto2, MainContext, MainThreadNotebookKernelsShape, NotebookOutputDto, VariablesResult } from './extHost.protocol.js';
import { ApiCommand, ApiCommandArgument, ApiCommandResult, ExtHostCommands } from './extHostCommands.js';
import { IExtHostInitDataService } from './extHostInitDataService.js';
import { ExtHostNotebookController } from './extHostNotebook.js';
import { ExtHostCell, ExtHostNotebookDocument } from './extHostNotebookDocument.js';
import * as extHostTypeConverters from './extHostTypeConverters.js';
import { NotebookCellOutput, NotebookControllerAffinity2, NotebookVariablesRequestKind } from './extHostTypes.js';
import { asWebviewUri } from '../../contrib/webview/common/webview.js';
import { INotebookKernelSourceAction } from '../../contrib/notebook/common/notebookCommon.js';
import { CellExecutionUpdateType } from '../../contrib/notebook/common/notebookExecutionService.js';
import { checkProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { SerializableObjectWithBuffers } from '../../services/extensions/common/proxyIdentifier.js';
import * as vscode from 'vscode';
import { variablePageSize } from '../../contrib/notebook/common/notebookKernelService.js';

interface IKernelData {
	extensionId: ExtensionIdentifier;
	controller: vscode.NotebookController;
	onDidChangeSelection: Emitter<{ selected: boolean; notebook: vscode.NotebookDocument }>;
	onDidReceiveMessage: Emitter<{ editor: vscode.NotebookEditor; message: unknown }>;
	associatedNotebooks: ResourceMap<boolean>;
}

type ExtHostSelectKernelArgs = ControllerInfo | { notebookEditor: vscode.NotebookEditor } | ControllerInfo & { notebookEditor: vscode.NotebookEditor } | undefined;
type SelectKernelReturnArgs = ControllerInfo | { notebookEditorId: string } | ControllerInfo & { notebookEditorId: string } | undefined;
type ControllerInfo = { id: string; extension: string };


export class ExtHostNotebookKernels implements ExtHostNotebookKernelsShape {

	private readonly _proxy: MainThreadNotebookKernelsShape;
	private readonly _activeExecutions = new ResourceMap<NotebookCellExecutionTask>();
	private readonly _activeNotebookExecutions = new ResourceMap<[NotebookExecutionTask, IDisposable]>();

	private _kernelDetectionTask = new Map<number, vscode.NotebookControllerDetectionTask>();
	private _kernelDetectionTaskHandlePool: number = 0;

	private _kernelSourceActionProviders = new Map<number, vscode.NotebookKernelSourceActionProvider>();
	private _kernelSourceActionProviderHandlePool: number = 0;

	private readonly _kernelData = new Map<number, IKernelData>();
	private _handlePool: number = 0;

	constructor(
		mainContext: IMainContext,
		private readonly _initData: IExtHostInitDataService,
		private readonly _extHostNotebook: ExtHostNotebookController,
		private _commands: ExtHostCommands,
		@ILogService private readonly _logService: ILogService,
	) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadNotebookKernels);

		// todo@rebornix @joyceerhl: move to APICommands once stabilized.
		const selectKernelApiCommand = new ApiCommand(
			'notebook.selectKernel',
			'_notebook.selectKernel',
			'Trigger kernel picker for specified notebook editor widget',
			[
				new ApiCommandArgument<ExtHostSelectKernelArgs, SelectKernelReturnArgs>('options', 'Select kernel options', v => true, (v: ExtHostSelectKernelArgs) => {
					if (v && 'notebookEditor' in v && 'id' in v) {
						const notebookEditorId = this._extHostNotebook.getIdByEditor(v.notebookEditor);
						return {
							id: v.id, extension: v.extension, notebookEditorId
						};
					} else if (v && 'notebookEditor' in v) {
						const notebookEditorId = this._extHostNotebook.getIdByEditor(v.notebookEditor);
						if (notebookEditorId === undefined) {
							throw new Error(`Cannot invoke 'notebook.selectKernel' for unrecognized notebook editor ${v.notebookEditor.notebook.uri.toString()}`);
						}
						if ('skipIfAlreadySelected' in v) {
							return { notebookEditorId, skipIfAlreadySelected: v.skipIfAlreadySelected };
						}
						return { notebookEditorId };
					}
					return v;
				})
			],
			ApiCommandResult.Void);

		const requestKernelVariablesApiCommand = new ApiCommand(
			'vscode.executeNotebookVariableProvider',
			'_executeNotebookVariableProvider',
			'Execute notebook variable provider',
			[ApiCommandArgument.Uri],
			new ApiCommandResult<VariablesResult[], vscode.VariablesResult[]>('A promise that resolves to an array of variables', (value, apiArgs) => {
				return value.map(variable => {
					return {
						variable: {
							name: variable.name,
							value: variable.value,
							expression: variable.expression,
							type: variable.type,
							language: variable.language
						},
						hasNamedChildren: variable.hasNamedChildren,
						indexedChildrenCount: variable.indexedChildrenCount
					};
				});
			})
		);
		this._commands.registerApiCommand(selectKernelApiCommand);
		this._commands.registerApiCommand(requestKernelVariablesApiCommand);
	}

	createNotebookController(extension: IExtensionDescription, id: string, viewType: string, label: string, handler?: (cells: vscode.NotebookCell[], notebook: vscode.NotebookDocument, controller: vscode.NotebookController) => void | Thenable<void>, preloads?: vscode.NotebookRendererScript[]): vscode.NotebookController {

		for (const data of this._kernelData.values()) {
			if (data.controller.id === id && ExtensionIdentifier.equals(extension.identifier, data.extensionId)) {
				throw new Error(`notebook controller with id '${id}' ALREADY exist`);
			}
		}


		const handle = this._handlePool++;
		const that = this;

		this._logService.trace(`NotebookController[${handle}], CREATED by ${extension.identifier.value}, ${id}`);

		const _defaultExecutHandler = () => console.warn(`NO execute handler from notebook controller '${data.id}' of extension: '${extension.identifier}'`);

		let isDisposed = false;

		const onDidChangeSelection = new Emitter<{ selected: boolean; notebook: vscode.NotebookDocument }>();
		const onDidReceiveMessage = new Emitter<{ editor: vscode.NotebookEditor; message: unknown }>();

		const data: INotebookKernelDto2 = {
			id: createKernelId(extension.identifier, id),
			notebookType: viewType,
			extensionId: extension.identifier,
			extensionLocation: extension.extensionLocation,
			label: label || extension.identifier.value,
			preloads: preloads ? preloads.map(extHostTypeConverters.NotebookRendererScript.from) : []
		};

		//
		let _executeHandler = handler ?? _defaultExecutHandler;
		let _interruptHandler: ((this: vscode.NotebookController, notebook: vscode.NotebookDocument) => void | Thenable<void>) | undefined;
		let _variableProvider: vscode.NotebookVariableProvider | undefined;

		this._proxy.$addKernel(handle, data).catch(err => {
			// this can happen when a kernel with that ID is already registered
			console.log(err);
			isDisposed = true;
		});

		// update: all setters write directly into the dto object
		// and trigger an update. the actual update will only happen
		// once per event loop execution
		let tokenPool = 0;
		const _update = () => {
			if (isDisposed) {
				return;
			}
			const myToken = ++tokenPool;
			Promise.resolve().then(() => {
				if (myToken === tokenPool) {
					this._proxy.$updateKernel(handle, data);
				}
			});
		};

		// notebook documents that are associated to this controller
		const associatedNotebooks = new ResourceMap<boolean>();

		const controller: vscode.NotebookController = {
			get id() { return id; },
			get notebookType() { return data.notebookType; },
			onDidChangeSelectedNotebooks: onDidChangeSelection.event,
			get label() {
				return data.label;
			},
			set label(value) {
				data.label = value ?? extension.displayName ?? extension.name;
				_update();
			},
			get detail() {
				return data.detail ?? '';
			},
			set detail(value) {
				data.detail = value;
				_update();
			},
			get description() {
				return data.description ?? '';
			},
			set description(value) {
				data.description = value;
				_update();
			},
			get supportedLanguages() {
				return data.supportedLanguages;
			},
			set supportedLanguages(value) {
				data.supportedLanguages = value;
				_update();
			},
			get supportsExecutionOrder() {
				return data.supportsExecutionOrder ?? false;
			},
			set supportsExecutionOrder(value) {
				data.supportsExecutionOrder = value;
				_update();
			},
			get rendererScripts() {
				return data.preloads ? data.preloads.map(extHostTypeConverters.NotebookRendererScript.to) : [];
			},
			get executeHandler() {
				return _executeHandler;
			},
			set executeHandler(value) {
				_executeHandler = value ?? _defaultExecutHandler;
			},
			get interruptHandler() {
				return _interruptHandler;
			},
			set interruptHandler(value) {
				_interruptHandler = value;
				data.supportsInterrupt = Boolean(value);
				_update();
			},
			set variableProvider(value) {
				checkProposedApiEnabled(extension, 'notebookVariableProvider');
				_variableProvider = value;
				data.hasVariableProvider = !!value;
				value?.onDidChangeVariables(e => that._proxy.$variablesUpdated(e.uri));
				_update();
			},
			get variableProvider() {
				return _variableProvider;
			},
			createNotebookCellExecution(cell) {
				if (isDisposed) {
					throw new Error('notebook controller is DISPOSED');
				}
				if (!associatedNotebooks.has(cell.notebook.uri)) {
					that._logService.trace(`NotebookController[${handle}] NOT associated to notebook, associated to THESE notebooks:`, Array.from(associatedNotebooks.keys()).map(u => u.toString()));
					throw new Error(`notebook controller is NOT associated to notebook: ${cell.notebook.uri.toString()}`);
				}
				return that._createNotebookCellExecution(cell, createKernelId(extension.identifier, this.id));
			},
			createNotebookExecution(notebook) {
				checkProposedApiEnabled(extension, 'notebookExecution');
				if (isDisposed) {
					throw new Error('notebook controller is DISPOSED');
				}
				if (!associatedNotebooks.has(notebook.uri)) {
					that._logService.trace(`NotebookController[${handle}] NOT associated to notebook, associated to THESE notebooks:`, Array.from(associatedNotebooks.keys()).map(u => u.toString()));
					throw new Error(`notebook controller is NOT associated to notebook: ${notebook.uri.toString()}`);
				}
				return that._createNotebookExecution(notebook, createKernelId(extension.identifier, this.id));
			},
			dispose: () => {
				if (!isDisposed) {
					this._logService.trace(`NotebookController[${handle}], DISPOSED`);
					isDisposed = true;
					this._kernelData.delete(handle);
					onDidChangeSelection.dispose();
					onDidReceiveMessage.dispose();
					this._proxy.$removeKernel(handle);
				}
			},
			// --- priority
			updateNotebookAffinity(notebook, priority) {
				if (priority === NotebookControllerAffinity2.Hidden) {
					// This api only adds an extra enum value, the function is the same, so just gate on the new value being passed
					// for proposedAPI check.
					checkProposedApiEnabled(extension, 'notebookControllerAffinityHidden');
				}
				that._proxy.$updateNotebookPriority(handle, notebook.uri, priority);
			},
			// --- ipc
			onDidReceiveMessage: onDidReceiveMessage.event,
			postMessage(message, editor) {
				checkProposedApiEnabled(extension, 'notebookMessaging');
				return that._proxy.$postMessage(handle, editor && that._extHostNotebook.getIdByEditor(editor), message);
			},
			asWebviewUri(uri: URI) {
				checkProposedApiEnabled(extension, 'notebookMessaging');
				return asWebviewUri(uri, that._initData.remote);
			},
		};

		this._kernelData.set(handle, {
			extensionId: extension.identifier,
			controller,
			onDidReceiveMessage,
			onDidChangeSelection,
			associatedNotebooks
		});
		return controller;
	}

	getIdByController(controller: vscode.NotebookController) {
		for (const [_, candidate] of this._kernelData) {
			if (candidate.controller === controller) {
				return createKernelId(candidate.extensionId, controller.id);
			}
		}
		return null;
	}

	createNotebookControllerDetectionTask(extension: IExtensionDescription, viewType: string): vscode.NotebookControllerDetectionTask {
		const handle = this._kernelDetectionTaskHandlePool++;
		const that = this;

		this._logService.trace(`NotebookControllerDetectionTask[${handle}], CREATED by ${extension.identifier.value}`);
		this._proxy.$addKernelDetectionTask(handle, viewType);

		const detectionTask: vscode.NotebookControllerDetectionTask = {
			dispose: () => {
				this._kernelDetectionTask.delete(handle);
				that._proxy.$removeKernelDetectionTask(handle);
			}
		};

		this._kernelDetectionTask.set(handle, detectionTask);
		return detectionTask;
	}

	registerKernelSourceActionProvider(extension: IExtensionDescription, viewType: string, provider: vscode.NotebookKernelSourceActionProvider) {
		const handle = this._kernelSourceActionProviderHandlePool++;
		const eventHandle = typeof provider.onDidChangeNotebookKernelSourceActions === 'function' ? handle : undefined;
		const that = this;

		this._kernelSourceActionProviders.set(handle, provider);
		this._logService.trace(`NotebookKernelSourceActionProvider[${handle}], CREATED by ${extension.identifier.value}`);
		this._proxy.$addKernelSourceActionProvider(handle, handle, viewType);

		let subscription: vscode.Disposable | undefined;
		if (eventHandle !== undefined) {
			subscription = provider.onDidChangeNotebookKernelSourceActions!(_ => this._proxy.$emitNotebookKernelSourceActionsChangeEvent(eventHandle));
		}

		return {
			dispose: () => {
				this._kernelSourceActionProviders.delete(handle);
				that._proxy.$removeKernelSourceActionProvider(handle, handle);
				subscription?.dispose();
			}
		};
	}

	async $provideKernelSourceActions(handle: number, token: CancellationToken): Promise<INotebookKernelSourceAction[]> {
		const provider = this._kernelSourceActionProviders.get(handle);
		if (provider) {
			const disposables = new DisposableStore();
			const ret = await provider.provideNotebookKernelSourceActions(token);
			return (ret ?? []).map(item => extHostTypeConverters.NotebookKernelSourceAction.from(item, this._commands.converter, disposables));
		}
		return [];
	}

	$acceptNotebookAssociation(handle: number, uri: UriComponents, value: boolean): void {
		const obj = this._kernelData.get(handle);
		if (obj) {
			// update data structure
			const notebook = this._extHostNotebook.getNotebookDocument(URI.revive(uri))!;
			if (value) {
				obj.associatedNotebooks.set(notebook.uri, true);
			} else {
				obj.associatedNotebooks.delete(notebook.uri);
			}
			this._logService.trace(`NotebookController[${handle}] ASSOCIATE notebook`, notebook.uri.toString(), value);
			// send event
			obj.onDidChangeSelection.fire({
				selected: value,
				notebook: notebook.apiNotebook
			});
		}
	}

	async $executeCells(handle: number, uri: UriComponents, handles: number[]): Promise<void> {
		const obj = this._kernelData.get(handle);
		if (!obj) {
			// extension can dispose kernels in the meantime
			return;
		}
		const document = this._extHostNotebook.getNotebookDocument(URI.revive(uri));
		const cells: vscode.NotebookCell[] = [];
		for (const cellHandle of handles) {
			const cell = document.getCell(cellHandle);
			if (cell) {
				cells.push(cell.apiCell);
			}
		}

		try {
			this._logService.trace(`NotebookController[${handle}] EXECUTE cells`, document.uri.toString(), cells.length);
			await obj.controller.executeHandler.call(obj.controller, cells, document.apiNotebook, obj.controller);
		} catch (err) {
			//
			this._logService.error(`NotebookController[${handle}] execute cells FAILED`, err);
			console.error(err);
		}
	}

	async $cancelCells(handle: number, uri: UriComponents, handles: number[]): Promise<void> {
		const obj = this._kernelData.get(handle);
		if (!obj) {
			// extension can dispose kernels in the meantime
			return;
		}

		// cancel or interrupt depends on the controller. When an interrupt handler is used we
		// don't trigger the cancelation token of executions.
		const document = this._extHostNotebook.getNotebookDocument(URI.revive(uri));
		if (obj.controller.interruptHandler) {
			await obj.controller.interruptHandler.call(obj.controller, document.apiNotebook);

		} else {
			for (const cellHandle of handles) {
				const cell = document.getCell(cellHandle);
				if (cell) {
					this._activeExecutions.get(cell.uri)?.cancel();
				}
			}
		}

		if (obj.controller.interruptHandler) {
			// If we're interrupting all cells, we also need to cancel the notebook level execution.
			const items = this._activeNotebookExecutions.get(document.uri);
			this._activeNotebookExecutions.delete(document.uri);
			if (handles.length && Array.isArray(items) && items.length) {
				items.forEach(d => d.dispose());
			}
		}
	}

	private id = 0;
	private variableStore: Record<string, vscode.Variable> = {};

	async $provideVariables(handle: number, requestId: string, notebookUri: UriComponents, parentId: number | undefined, kind: 'named' | 'indexed', start: number, token: CancellationToken): Promise<void> {
		const obj = this._kernelData.get(handle);
		if (!obj) {
			return;
		}

		const document = this._extHostNotebook.getNotebookDocument(URI.revive(notebookUri));
		const variableProvider = obj.controller.variableProvider;
		if (!variableProvider) {
			return;
		}

		let parent: vscode.Variable | undefined = undefined;
		if (parentId !== undefined) {
			parent = this.variableStore[parentId];
			if (!parent) {
				// request for unknown parent
				return;
			}
		} else {
			// root request, clear store
			this.variableStore = {};
		}


		const requestKind = kind === 'named' ? NotebookVariablesRequestKind.Named : NotebookVariablesRequestKind.Indexed;
		const variableResults = variableProvider.provideVariables(document.apiNotebook, parent, requestKind, start, token);

		let resultCount = 0;
		for await (const result of variableResults) {
			if (token.isCancellationRequested) {
				return;
			}
			const variable = {
				id: this.id++,
				name: result.variable.name,
				value: result.variable.value,
				type: result.variable.type,
				interfaces: result.variable.interfaces,
				language: result.variable.language,
				expression: result.variable.expression,
				hasNamedChildren: result.hasNamedChildren,
				indexedChildrenCount: result.indexedChildrenCount,
				extensionId: obj.extensionId.value,
			};
			this.variableStore[variable.id] = result.variable;
			this._proxy.$receiveVariable(requestId, variable);

			if (resultCount++ >= variablePageSize) {
				return;
			}
		}
	}

	$acceptKernelMessageFromRenderer(handle: number, editorId: string, message: unknown): void {
		const obj = this._kernelData.get(handle);
		if (!obj) {
			// extension can dispose kernels in the meantime
			return;
		}

		const editor = this._extHostNotebook.getEditorById(editorId);
		obj.onDidReceiveMessage.fire(Object.freeze({ editor: editor.apiEditor, message }));
	}


	// ---

	_createNotebookCellExecution(cell: vscode.NotebookCell, controllerId: string): vscode.NotebookCellExecution {
		if (cell.index < 0) {
			throw new Error('CANNOT execute cell that has been REMOVED from notebook');
		}
		const notebook = this._extHostNotebook.getNotebookDocument(cell.notebook.uri);
		const cellObj = notebook.getCellFromApiCell(cell);
		if (!cellObj) {
			throw new Error('invalid cell');
		}
		if (this._activeExecutions.has(cellObj.uri)) {
			throw new Error(`duplicate execution for ${cellObj.uri}`);
		}
		const execution = new NotebookCellExecutionTask(controllerId, cellObj, this._proxy);
		this._activeExecutions.set(cellObj.uri, execution);
		const listener = execution.onDidChangeState(() => {
			if (execution.state === NotebookCellExecutionTaskState.Resolved) {
				execution.dispose();
				listener.dispose();
				this._activeExecutions.delete(cellObj.uri);
			}
		});
		return execution.asApiObject();
	}

	// ---

	_createNotebookExecution(nb: vscode.NotebookDocument, controllerId: string): vscode.NotebookExecution {
		const notebook = this._extHostNotebook.getNotebookDocument(nb.uri);
		const runningCell = nb.getCells().find(cell => {
			const apiCell = notebook.getCellFromApiCell(cell);
			return apiCell && this._activeExecutions.has(apiCell.uri);
		});
		if (runningCell) {
			throw new Error(`duplicate cell execution for ${runningCell.document.uri}`);
		}
		if (this._activeNotebookExecutions.has(notebook.uri)) {
			throw new Error(`duplicate notebook execution for ${notebook.uri}`);
		}
		const execution = new NotebookExecutionTask(controllerId, notebook, this._proxy);
		const listener = execution.onDidChangeState(() => {
			if (execution.state === NotebookExecutionTaskState.Resolved) {
				execution.dispose();
				listener.dispose();
				this._activeNotebookExecutions.delete(notebook.uri);
			}
		});
		this._activeNotebookExecutions.set(notebook.uri, [execution, listener]);
		return execution.asApiObject();
	}
}


enum NotebookCellExecutionTaskState {
	Init,
	Started,
	Resolved
}

class NotebookCellExecutionTask extends Disposable {
	private static HANDLE = 0;
	private _handle = NotebookCellExecutionTask.HANDLE++;

	private _onDidChangeState = new Emitter<void>();
	readonly onDidChangeState = this._onDidChangeState.event;

	private _state = NotebookCellExecutionTaskState.Init;
	get state(): NotebookCellExecutionTaskState { return this._state; }

	private readonly _tokenSource = this._register(new CancellationTokenSource());

	private readonly _collector: TimeoutBasedCollector<ICellExecuteUpdateDto>;

	private _executionOrder: number | undefined;

	constructor(
		controllerId: string,
		private readonly _cell: ExtHostCell,
		private readonly _proxy: MainThreadNotebookKernelsShape
	) {
		super();

		this._collector = new TimeoutBasedCollector(10, updates => this.update(updates));

		this._executionOrder = _cell.internalMetadata.executionOrder;
		this._proxy.$createExecution(this._handle, controllerId, this._cell.notebook.uri, this._cell.handle);
	}

	cancel(): void {
		this._tokenSource.cancel();
	}

	private async updateSoon(update: ICellExecuteUpdateDto): Promise<void> {
		await this._collector.addItem(update);
	}

	private async update(update: ICellExecuteUpdateDto | ICellExecuteUpdateDto[]): Promise<void> {
		const updates = Array.isArray(update) ? update : [update];
		return this._proxy.$updateExecution(this._handle, new SerializableObjectWithBuffers(updates));
	}

	private verifyStateForOutput() {
		if (this._state === NotebookCellExecutionTaskState.Init) {
			throw new Error('Must call start before modifying cell output');
		}

		if (this._state === NotebookCellExecutionTaskState.Resolved) {
			throw new Error('Cannot modify cell output after calling resolve');
		}
	}

	private cellIndexToHandle(cellOrCellIndex: vscode.NotebookCell | undefined): number {
		let cell: ExtHostCell | undefined = this._cell;
		if (cellOrCellIndex) {
			cell = this._cell.notebook.getCellFromApiCell(cellOrCellIndex);
		}
		if (!cell) {
			throw new Error('INVALID cell');
		}
		return cell.handle;
	}

	private validateAndConvertOutputs(items: vscode.NotebookCellOutput[]): NotebookOutputDto[] {
		return items.map(output => {
			const newOutput = NotebookCellOutput.ensureUniqueMimeTypes(output.items, true);
			if (newOutput === output.items) {
				return extHostTypeConverters.NotebookCellOutput.from(output);
			}
			return extHostTypeConverters.NotebookCellOutput.from({
				items: newOutput,
				id: output.id,
				metadata: output.metadata
			});
		});
	}

	private async updateOutputs(outputs: vscode.NotebookCellOutput | vscode.NotebookCellOutput[], cell: vscode.NotebookCell | undefined, append: boolean): Promise<void> {
		const handle = this.cellIndexToHandle(cell);
		const outputDtos = this.validateAndConvertOutputs(asArray(outputs));
		return this.updateSoon(
			{
				editType: CellExecutionUpdateType.Output,
				cellHandle: handle,
				append,
				outputs: outputDtos
			});
	}

	private async updateOutputItems(items: vscode.NotebookCellOutputItem | vscode.NotebookCellOutputItem[], output: vscode.NotebookCellOutput, append: boolean): Promise<void> {
		items = NotebookCellOutput.ensureUniqueMimeTypes(asArray(items), true);
		return this.updateSoon({
			editType: CellExecutionUpdateType.OutputItems,
			items: items.map(extHostTypeConverters.NotebookCellOutputItem.from),
			outputId: output.id,
			append
		});
	}

	asApiObject(): vscode.NotebookCellExecution {
		const that = this;
		const result: vscode.NotebookCellExecution = {
			get token() { return that._tokenSource.token; },
			get cell() { return that._cell.apiCell; },
			get executionOrder() { return that._executionOrder; },
			set executionOrder(v: number | undefined) {
				that._executionOrder = v;
				that.update([{
					editType: CellExecutionUpdateType.ExecutionState,
					executionOrder: that._executionOrder
				}]);
			},

			start(startTime?: number): void {
				if (that._state === NotebookCellExecutionTaskState.Resolved || that._state === NotebookCellExecutionTaskState.Started) {
					throw new Error('Cannot call start again');
				}

				that._state = NotebookCellExecutionTaskState.Started;
				that._onDidChangeState.fire();

				that.update({
					editType: CellExecutionUpdateType.ExecutionState,
					runStartTime: startTime
				});
			},

			end(success: boolean | undefined, endTime?: number, executionError?: vscode.CellExecutionError): void {
				if (that._state === NotebookCellExecutionTaskState.Resolved) {
					throw new Error('Cannot call resolve twice');
				}

				that._state = NotebookCellExecutionTaskState.Resolved;
				that._onDidChangeState.fire();

				// The last update needs to be ordered correctly and applied immediately,
				// so we use updateSoon and immediately flush.
				that._collector.flush();

				const error = createSerializeableError(executionError);

				that._proxy.$completeExecution(that._handle, new SerializableObjectWithBuffers({
					runEndTime: endTime,
					lastRunSuccess: success,
					error
				}));
			},

			clearOutput(cell?: vscode.NotebookCell): Thenable<void> {
				that.verifyStateForOutput();
				return that.updateOutputs([], cell, false);
			},

			appendOutput(outputs: vscode.NotebookCellOutput | vscode.NotebookCellOutput[], cell?: vscode.NotebookCell): Promise<void> {
				that.verifyStateForOutput();
				return that.updateOutputs(outputs, cell, true);
			},

			replaceOutput(outputs: vscode.NotebookCellOutput | vscode.NotebookCellOutput[], cell?: vscode.NotebookCell): Promise<void> {
				that.verifyStateForOutput();
				return that.updateOutputs(outputs, cell, false);
			},

			appendOutputItems(items: vscode.NotebookCellOutputItem | vscode.NotebookCellOutputItem[], output: vscode.NotebookCellOutput): Promise<void> {
				that.verifyStateForOutput();
				return that.updateOutputItems(items, output, true);
			},

			replaceOutputItems(items: vscode.NotebookCellOutputItem | vscode.NotebookCellOutputItem[], output: vscode.NotebookCellOutput): Promise<void> {
				that.verifyStateForOutput();
				return that.updateOutputItems(items, output, false);
			}
		};
		return Object.freeze(result);
	}
}

function createSerializeableError(executionError: vscode.CellExecutionError | undefined) {
	const convertRange = (range: vscode.Range | undefined) => (range ? {
		startLineNumber: range.start.line,
		startColumn: range.start.character,
		endLineNumber: range.end.line,
		endColumn: range.end.character
	} : undefined);

	const convertStackFrame = (frame: vscode.CellErrorStackFrame) => ({
		uri: frame.uri,
		position: frame.position,
		label: frame.label
	});

	const error = executionError ? {
		name: executionError.name,
		message: executionError.message,
		stack: executionError.stack instanceof Array
			? executionError.stack.map(frame => convertStackFrame(frame))
			: executionError.stack,
		location: convertRange(executionError.location),
		uri: executionError.uri
	} : undefined;
	return error;
}

enum NotebookExecutionTaskState {
	Init,
	Started,
	Resolved
}


class NotebookExecutionTask extends Disposable {
	private static HANDLE = 0;
	private _handle = NotebookExecutionTask.HANDLE++;

	private _onDidChangeState = new Emitter<void>();
	readonly onDidChangeState = this._onDidChangeState.event;

	private _state = NotebookExecutionTaskState.Init;
	get state(): NotebookExecutionTaskState { return this._state; }

	private readonly _tokenSource = this._register(new CancellationTokenSource());

	constructor(
		controllerId: string,
		private readonly _notebook: ExtHostNotebookDocument,
		private readonly _proxy: MainThreadNotebookKernelsShape
	) {
		super();

		this._proxy.$createNotebookExecution(this._handle, controllerId, this._notebook.uri);
	}

	cancel(): void {
		this._tokenSource.cancel();
	}
	asApiObject(): vscode.NotebookExecution {
		const result: vscode.NotebookExecution = {
			start: () => {
				if (this._state === NotebookExecutionTaskState.Resolved || this._state === NotebookExecutionTaskState.Started) {
					throw new Error('Cannot call start again');
				}

				this._state = NotebookExecutionTaskState.Started;
				this._onDidChangeState.fire();

				this._proxy.$beginNotebookExecution(this._handle);
			},

			end: () => {
				if (this._state === NotebookExecutionTaskState.Resolved) {
					throw new Error('Cannot call resolve twice');
				}

				this._state = NotebookExecutionTaskState.Resolved;
				this._onDidChangeState.fire();

				this._proxy.$completeNotebookExecution(this._handle);
			},

		};
		return Object.freeze(result);
	}
}

class TimeoutBasedCollector<T> {
	private batch: T[] = [];
	private startedTimer = Date.now();
	private currentDeferred: DeferredPromise<void> | undefined;

	constructor(
		private readonly delay: number,
		private readonly callback: (items: T[]) => Promise<void>) { }

	addItem(item: T): Promise<void> {
		this.batch.push(item);
		if (!this.currentDeferred) {
			this.currentDeferred = new DeferredPromise<void>();
			this.startedTimer = Date.now();
			timeout(this.delay).then(() => {
				return this.flush();
			});
		}

		// This can be called by the extension repeatedly for a long time before the timeout is able to run.
		// Force a flush after the delay.
		if (Date.now() - this.startedTimer > this.delay) {
			return this.flush();
		}

		return this.currentDeferred.p;
	}

	flush(): Promise<void> {
		if (this.batch.length === 0 || !this.currentDeferred) {
			return Promise.resolve();
		}

		const deferred = this.currentDeferred;
		this.currentDeferred = undefined;
		const batch = this.batch;
		this.batch = [];
		return this.callback(batch)
			.finally(() => deferred.complete());
	}
}

export function createKernelId(extensionIdentifier: ExtensionIdentifier, id: string): string {
	return `${extensionIdentifier.value}/${id}`;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostNotebookRenderers.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostNotebookRenderers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../base/common/event.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ExtHostNotebookRenderersShape, IMainContext, MainContext, MainThreadNotebookRenderersShape } from './extHost.protocol.js';
import { ExtHostNotebookController } from './extHostNotebook.js';
import { ExtHostNotebookEditor } from './extHostNotebookEditor.js';
import * as vscode from 'vscode';


export class ExtHostNotebookRenderers implements ExtHostNotebookRenderersShape {
	private readonly _rendererMessageEmitters = new Map<string /* rendererId */, Emitter<{ editor: vscode.NotebookEditor; message: unknown }>>();
	private readonly proxy: MainThreadNotebookRenderersShape;

	constructor(mainContext: IMainContext, private readonly _extHostNotebook: ExtHostNotebookController) {
		this.proxy = mainContext.getProxy(MainContext.MainThreadNotebookRenderers);
	}

	public $postRendererMessage(editorId: string, rendererId: string, message: unknown): void {
		const editor = this._extHostNotebook.getEditorById(editorId);
		this._rendererMessageEmitters.get(rendererId)?.fire({ editor: editor.apiEditor, message });
	}

	public createRendererMessaging(manifest: IExtensionDescription, rendererId: string): vscode.NotebookRendererMessaging {
		if (!manifest.contributes?.notebookRenderer?.some(r => r.id === rendererId)) {
			throw new Error(`Extensions may only call createRendererMessaging() for renderers they contribute (got ${rendererId})`);
		}

		const messaging: vscode.NotebookRendererMessaging = {
			onDidReceiveMessage: (listener, thisArg, disposables) => {
				return this.getOrCreateEmitterFor(rendererId).event(listener, thisArg, disposables);
			},
			postMessage: (message, editorOrAlias) => {
				if (ExtHostNotebookEditor.apiEditorsToExtHost.has(message)) { // back compat for swapped args
					[message, editorOrAlias] = [editorOrAlias, message];
				}

				const extHostEditor = editorOrAlias && ExtHostNotebookEditor.apiEditorsToExtHost.get(editorOrAlias);
				return this.proxy.$postMessage(extHostEditor?.id, rendererId, message);
			},
		};

		return messaging;
	}

	private getOrCreateEmitterFor(rendererId: string) {
		let emitter = this._rendererMessageEmitters.get(rendererId);
		if (emitter) {
			return emitter;
		}

		emitter = new Emitter({
			onDidRemoveLastListener: () => {
				emitter?.dispose();
				this._rendererMessageEmitters.delete(rendererId);
			}
		});

		this._rendererMessageEmitters.set(rendererId, emitter);

		return emitter;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostOutput.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostOutput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MainContext, MainThreadOutputServiceShape, ExtHostOutputServiceShape } from './extHost.protocol.js';
import type * as vscode from 'vscode';
import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { AbstractMessageLogger, ILogger, ILoggerService, ILogService, log, LogLevel, parseLogLevel } from '../../../platform/log/common/log.js';
import { OutputChannelUpdateMode } from '../../services/output/common/output.js';
import { IExtHostConsumerFileSystem } from './extHostFileSystemConsumer.js';
import { IExtHostInitDataService } from './extHostInitDataService.js';
import { IExtHostFileSystemInfo } from './extHostFileSystemInfo.js';
import { toLocalISOString } from '../../../base/common/date.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { isString } from '../../../base/common/types.js';
import { FileSystemProviderErrorCode, toFileSystemProviderErrorCode } from '../../../platform/files/common/files.js';
import { Emitter } from '../../../base/common/event.js';
import { DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';

class ExtHostOutputChannel extends AbstractMessageLogger implements vscode.LogOutputChannel {

	private offset: number = 0;

	public visible: boolean = false;

	constructor(
		readonly id: string,
		readonly name: string,
		protected readonly logger: ILogger,
		protected readonly proxy: MainThreadOutputServiceShape,
		readonly extension: IExtensionDescription,
	) {
		super();
		this.setLevel(logger.getLevel());
		this._register(logger.onDidChangeLogLevel(level => this.setLevel(level)));
		this._register(toDisposable(() => this.proxy.$dispose(this.id)));
	}

	get logLevel(): LogLevel {
		return this.getLevel();
	}

	appendLine(value: string): void {
		this.append(value + '\n');
	}

	append(value: string): void {
		this.info(value);
	}

	clear(): void {
		const till = this.offset;
		this.logger.flush();
		this.proxy.$update(this.id, OutputChannelUpdateMode.Clear, till);
	}

	replace(value: string): void {
		const till = this.offset;
		this.info(value);
		this.proxy.$update(this.id, OutputChannelUpdateMode.Replace, till);
		if (this.visible) {
			this.logger.flush();
		}
	}

	show(columnOrPreserveFocus?: vscode.ViewColumn | boolean, preserveFocus?: boolean): void {
		this.logger.flush();
		this.proxy.$reveal(this.id, !!(typeof columnOrPreserveFocus === 'boolean' ? columnOrPreserveFocus : preserveFocus));
	}

	hide(): void {
		this.proxy.$close(this.id);
	}

	protected log(level: LogLevel, message: string): void {
		this.offset += VSBuffer.fromString(message).byteLength;
		log(this.logger, level, message);
		if (this.visible) {
			this.logger.flush();
			this.proxy.$update(this.id, OutputChannelUpdateMode.Append);
		}
	}

}

class ExtHostLogOutputChannel extends ExtHostOutputChannel {

	override appendLine(value: string): void {
		this.append(value);
	}

}

export class ExtHostOutputService implements ExtHostOutputServiceShape {

	readonly _serviceBrand: undefined;

	private readonly proxy: MainThreadOutputServiceShape;

	private readonly outputsLocation: URI;
	private outputDirectoryPromise: Thenable<URI> | undefined;
	private readonly extensionLogDirectoryPromise = new Map<string, Thenable<URI>>();
	private namePool: number = 1;

	private readonly channels = new Map<string, ExtHostLogOutputChannel | ExtHostOutputChannel>();
	private visibleChannelId: string | null = null;

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@IExtHostInitDataService private readonly initData: IExtHostInitDataService,
		@IExtHostConsumerFileSystem private readonly extHostFileSystem: IExtHostConsumerFileSystem,
		@IExtHostFileSystemInfo private readonly extHostFileSystemInfo: IExtHostFileSystemInfo,
		@ILoggerService private readonly loggerService: ILoggerService,
		@ILogService private readonly logService: ILogService,
	) {
		this.proxy = extHostRpc.getProxy(MainContext.MainThreadOutputService);
		this.outputsLocation = this.extHostFileSystemInfo.extUri.joinPath(initData.logsLocation, `output_logging_${toLocalISOString(new Date()).replace(/-|:|\.\d+Z$/g, '')}`);
	}

	$setVisibleChannel(visibleChannelId: string | null): void {
		this.visibleChannelId = visibleChannelId;
		for (const [id, channel] of this.channels) {
			channel.visible = id === this.visibleChannelId;
		}
	}

	createOutputChannel(name: string, options: string | { log: true } | undefined, extension: IExtensionDescription): vscode.OutputChannel | vscode.LogOutputChannel {
		name = name.trim();
		if (!name) {
			throw new Error('illegal argument `name`. must not be falsy');
		}
		const log = typeof options === 'object' && options.log;
		const languageId = isString(options) ? options : undefined;
		if (isString(languageId) && !languageId.trim()) {
			throw new Error('illegal argument `languageId`. must not be empty');
		}
		let logLevel: LogLevel | undefined;
		const logLevelValue = this.initData.environment.extensionLogLevel?.find(([identifier]) => ExtensionIdentifier.equals(extension.identifier, identifier))?.[1];
		if (logLevelValue) {
			logLevel = parseLogLevel(logLevelValue);
		}
		const channelDisposables = new DisposableStore();
		const extHostOutputChannel = log
			? this.doCreateLogOutputChannel(name, logLevel, extension, channelDisposables)
			: this.doCreateOutputChannel(name, languageId, extension, channelDisposables);
		extHostOutputChannel.then(channel => {
			this.channels.set(channel.id, channel);
			channel.visible = channel.id === this.visibleChannelId;
			channelDisposables.add(toDisposable(() => this.channels.delete(channel.id)));
		});
		return log
			? this.createExtHostLogOutputChannel(name, logLevel ?? this.logService.getLevel(), <Promise<ExtHostOutputChannel>>extHostOutputChannel, channelDisposables)
			: this.createExtHostOutputChannel(name, <Promise<ExtHostOutputChannel>>extHostOutputChannel, channelDisposables);
	}

	private async doCreateOutputChannel(name: string, languageId: string | undefined, extension: IExtensionDescription, channelDisposables: DisposableStore): Promise<ExtHostOutputChannel> {
		if (!this.outputDirectoryPromise) {
			this.outputDirectoryPromise = this.extHostFileSystem.value.createDirectory(this.outputsLocation).then(() => this.outputsLocation);
		}
		const outputDir = await this.outputDirectoryPromise;
		const file = this.extHostFileSystemInfo.extUri.joinPath(outputDir, `${this.namePool++}-${name.replace(/[\\/:\*\?"<>\|]/g, '')}.log`);
		const logger = channelDisposables.add(this.loggerService.createLogger(file, { logLevel: 'always', donotRotate: true, donotUseFormatters: true, hidden: true }));
		const id = await this.proxy.$register(name, file, languageId, extension.identifier.value);
		channelDisposables.add(toDisposable(() => this.loggerService.deregisterLogger(file)));
		return new ExtHostOutputChannel(id, name, logger, this.proxy, extension);
	}

	private async doCreateLogOutputChannel(name: string, logLevel: LogLevel | undefined, extension: IExtensionDescription, channelDisposables: DisposableStore): Promise<ExtHostLogOutputChannel> {
		const extensionLogDir = await this.createExtensionLogDirectory(extension);
		const fileName = name.replace(/[\\/:\*\?"<>\|]/g, '');
		const file = this.extHostFileSystemInfo.extUri.joinPath(extensionLogDir, `${fileName}.log`);
		const id = `${extension.identifier.value}.${fileName}`;
		const logger = channelDisposables.add(this.loggerService.createLogger(file, { id, name, logLevel, extensionId: extension.identifier.value }));
		channelDisposables.add(toDisposable(() => this.loggerService.deregisterLogger(file)));
		return new ExtHostLogOutputChannel(id, name, logger, this.proxy, extension);
	}

	private createExtensionLogDirectory(extension: IExtensionDescription): Thenable<URI> {
		let extensionLogDirectoryPromise = this.extensionLogDirectoryPromise.get(extension.identifier.value);
		if (!extensionLogDirectoryPromise) {
			const extensionLogDirectory = this.extHostFileSystemInfo.extUri.joinPath(this.initData.logsLocation, extension.identifier.value);
			this.extensionLogDirectoryPromise.set(extension.identifier.value, extensionLogDirectoryPromise = (async () => {
				try {
					await this.extHostFileSystem.value.createDirectory(extensionLogDirectory);
				} catch (err) {
					if (toFileSystemProviderErrorCode(err) !== FileSystemProviderErrorCode.FileExists) {
						throw err;
					}
				}
				return extensionLogDirectory;
			})());
		}
		return extensionLogDirectoryPromise;
	}

	private createExtHostOutputChannel(name: string, channelPromise: Promise<ExtHostOutputChannel>, channelDisposables: DisposableStore): vscode.OutputChannel {
		const validate = () => {
			if (channelDisposables.isDisposed) {
				throw new Error('Channel has been closed');
			}
		};
		channelPromise.then(channel => channelDisposables.add(channel));
		return {
			get name(): string { return name; },
			append(value: string): void {
				validate();
				channelPromise.then(channel => channel.append(value));
			},
			appendLine(value: string): void {
				validate();
				channelPromise.then(channel => channel.appendLine(value));
			},
			clear(): void {
				validate();
				channelPromise.then(channel => channel.clear());
			},
			replace(value: string): void {
				validate();
				channelPromise.then(channel => channel.replace(value));
			},
			show(columnOrPreserveFocus?: vscode.ViewColumn | boolean, preserveFocus?: boolean): void {
				validate();
				channelPromise.then(channel => channel.show(columnOrPreserveFocus, preserveFocus));
			},
			hide(): void {
				validate();
				channelPromise.then(channel => channel.hide());
			},
			dispose(): void {
				channelDisposables.dispose();
			}
		};
	}

	private createExtHostLogOutputChannel(name: string, logLevel: LogLevel, channelPromise: Promise<ExtHostOutputChannel>, channelDisposables: DisposableStore): vscode.LogOutputChannel {
		const validate = () => {
			if (channelDisposables.isDisposed) {
				throw new Error('Channel has been closed');
			}
		};
		const onDidChangeLogLevel = channelDisposables.add(new Emitter<LogLevel>());
		function setLogLevel(newLogLevel: LogLevel): void {
			logLevel = newLogLevel;
			onDidChangeLogLevel.fire(newLogLevel);
		}
		channelPromise.then(channel => {
			if (channel.logLevel !== logLevel) {
				setLogLevel(channel.logLevel);
			}
			channelDisposables.add(channel.onDidChangeLogLevel(e => setLogLevel(e)));
		});
		return {
			...this.createExtHostOutputChannel(name, channelPromise, channelDisposables),
			get logLevel() { return logLevel; },
			onDidChangeLogLevel: onDidChangeLogLevel.event,
			trace(value: string, ...args: unknown[]): void {
				validate();
				channelPromise.then(channel => channel.trace(value, ...args));
			},
			debug(value: string, ...args: unknown[]): void {
				validate();
				channelPromise.then(channel => channel.debug(value, ...args));
			},
			info(value: string, ...args: unknown[]): void {
				validate();
				channelPromise.then(channel => channel.info(value, ...args));
			},
			warn(value: string, ...args: unknown[]): void {
				validate();
				channelPromise.then(channel => channel.warn(value, ...args));
			},
			error(value: Error | string, ...args: unknown[]): void {
				validate();
				channelPromise.then(channel => channel.error(value, ...args));
			}
		};
	}
}

export interface IExtHostOutputService extends ExtHostOutputService { }
export const IExtHostOutputService = createDecorator<IExtHostOutputService>('IExtHostOutputService');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostProfileContentHandler.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostProfileContentHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { toDisposable } from '../../../base/common/lifecycle.js';
import { isString } from '../../../base/common/types.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { checkProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { ISaveProfileResult } from '../../services/userDataProfile/common/userDataProfile.js';
import type * as vscode from 'vscode';
import { ExtHostProfileContentHandlersShape, IMainContext, MainContext, MainThreadProfileContentHandlersShape } from './extHost.protocol.js';


export class ExtHostProfileContentHandlers implements ExtHostProfileContentHandlersShape {

	private readonly proxy: MainThreadProfileContentHandlersShape;

	private readonly handlers = new Map<string, vscode.ProfileContentHandler>();

	constructor(
		mainContext: IMainContext,
	) {
		this.proxy = mainContext.getProxy(MainContext.MainThreadProfileContentHandlers);
	}

	registerProfileContentHandler(
		extension: IExtensionDescription,
		id: string,
		handler: vscode.ProfileContentHandler,
	): vscode.Disposable {
		checkProposedApiEnabled(extension, 'profileContentHandlers');
		if (this.handlers.has(id)) {
			throw new Error(`Handler with id '${id}' already registered`);
		}

		this.handlers.set(id, handler);
		this.proxy.$registerProfileContentHandler(id, handler.name, handler.description, extension.identifier.value);

		return toDisposable(() => {
			this.handlers.delete(id);
			this.proxy.$unregisterProfileContentHandler(id);
		});
	}

	async $saveProfile(id: string, name: string, content: string, token: CancellationToken): Promise<ISaveProfileResult | null> {
		const handler = this.handlers.get(id);
		if (!handler) {
			throw new Error(`Unknown handler with id: ${id}`);
		}

		return handler.saveProfile(name, content, token);
	}

	async $readProfile(id: string, idOrUri: string | UriComponents, token: CancellationToken): Promise<string | null> {
		const handler = this.handlers.get(id);
		if (!handler) {
			throw new Error(`Unknown handler with id: ${id}`);
		}

		return handler.readProfile(isString(idOrUri) ? idOrUri : URI.revive(idOrUri), token);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostProgress.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostProgress.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ProgressOptions } from 'vscode';
import { MainThreadProgressShape, ExtHostProgressShape, MainContext } from './extHost.protocol.js';
import { ProgressLocation } from './extHostTypeConverters.js';
import { Progress, IProgressStep } from '../../../platform/progress/common/progress.js';
import { CancellationTokenSource, CancellationToken } from '../../../base/common/cancellation.js';
import { throttle } from '../../../base/common/decorators.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { onUnexpectedExternalError } from '../../../base/common/errors.js';
import { INotificationSource } from '../../../platform/notification/common/notification.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IExtHostRpcService } from './extHostRpcService.js';

export interface IExtHostProgress extends ExtHostProgress { }
export const IExtHostProgress = createDecorator<IExtHostProgress>('IExtHostProgress');

export class ExtHostProgress implements ExtHostProgressShape {

	declare readonly _serviceBrand: undefined;

	private _proxy: MainThreadProgressShape;
	private _handles: number = 0;
	private _mapHandleToCancellationSource: Map<number, CancellationTokenSource> = new Map();

	constructor(@IExtHostRpcService extHostRpc: IExtHostRpcService) {
		this._proxy = extHostRpc.getProxy(MainContext.MainThreadProgress);
	}

	async withProgress<R>(extension: IExtensionDescription, options: ProgressOptions, task: (progress: Progress<IProgressStep>, token: CancellationToken) => Thenable<R>): Promise<R> {
		const handle = this._handles++;
		const { title, location, cancellable } = options;
		const source = { label: extension.displayName || extension.name, id: extension.identifier.value };

		this._proxy.$startProgress(handle, { location: ProgressLocation.from(location), title, source, cancellable }, !extension.isUnderDevelopment ? extension.identifier.value : undefined).catch(onUnexpectedExternalError);
		return this._withProgress(handle, task, !!cancellable);
	}

	async withProgressFromSource<R>(source: string | INotificationSource, options: ProgressOptions, task: (progress: Progress<IProgressStep>, token: CancellationToken) => Thenable<R>): Promise<R> {
		const handle = this._handles++;
		const { title, location, cancellable } = options;

		this._proxy.$startProgress(handle, { location: ProgressLocation.from(location), title, source, cancellable }, undefined).catch(onUnexpectedExternalError);
		return this._withProgress(handle, task, !!cancellable);
	}

	private _withProgress<R>(handle: number, task: (progress: Progress<IProgressStep>, token: CancellationToken) => Thenable<R>, cancellable: boolean): Thenable<R> {
		let source: CancellationTokenSource | undefined;
		if (cancellable) {
			source = new CancellationTokenSource();
			this._mapHandleToCancellationSource.set(handle, source);
		}

		const progressEnd = (handle: number): void => {
			this._proxy.$progressEnd(handle);
			this._mapHandleToCancellationSource.delete(handle);
			source?.dispose();
		};

		let p: Thenable<R>;

		try {
			p = task(new ProgressCallback(this._proxy, handle), cancellable && source ? source.token : CancellationToken.None);
		} catch (err) {
			progressEnd(handle);
			throw err;
		}

		p.then(result => progressEnd(handle), err => progressEnd(handle));
		return p;
	}

	public $acceptProgressCanceled(handle: number): void {
		const source = this._mapHandleToCancellationSource.get(handle);
		if (source) {
			source.cancel();
			this._mapHandleToCancellationSource.delete(handle);
		}
	}
}

function mergeProgress(result: IProgressStep, currentValue: IProgressStep): IProgressStep {
	result.message = currentValue.message;
	if (typeof currentValue.increment === 'number') {
		if (typeof result.increment === 'number') {
			result.increment += currentValue.increment;
		} else {
			result.increment = currentValue.increment;
		}
	}

	return result;
}

class ProgressCallback extends Progress<IProgressStep> {
	constructor(private _proxy: MainThreadProgressShape, private _handle: number) {
		super(p => this.throttledReport(p));
	}

	@throttle(100, (result: IProgressStep, currentValue: IProgressStep) => mergeProgress(result, currentValue), () => Object.create(null))
	throttledReport(p: IProgressStep): void {
		this._proxy.$progressReport(this._handle, p);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostQuickDiff.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostQuickDiff.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { ExtHostQuickDiffShape, IMainContext, MainContext, MainThreadQuickDiffShape } from './extHost.protocol.js';
import { asPromise } from '../../../base/common/async.js';
import { DocumentSelector } from './extHostTypeConverters.js';
import { IURITransformer } from '../../../base/common/uriIpc.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';

export class ExtHostQuickDiff implements ExtHostQuickDiffShape {
	private static handlePool: number = 0;

	private proxy: MainThreadQuickDiffShape;
	private providers: Map<number, vscode.QuickDiffProvider> = new Map();

	constructor(
		mainContext: IMainContext,
		private readonly uriTransformer: IURITransformer | undefined
	) {
		this.proxy = mainContext.getProxy(MainContext.MainThreadQuickDiff);
	}

	$provideOriginalResource(handle: number, uriComponents: UriComponents, token: CancellationToken): Promise<UriComponents | null> {
		const uri = URI.revive(uriComponents);
		const provider = this.providers.get(handle);

		if (!provider) {
			return Promise.resolve(null);
		}

		return asPromise(() => provider.provideOriginalResource!(uri, token))
			.then<UriComponents | null>(r => r || null);
	}

	registerQuickDiffProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, quickDiffProvider: vscode.QuickDiffProvider, id: string, label: string, rootUri?: vscode.Uri): vscode.Disposable {
		const handle = ExtHostQuickDiff.handlePool++;
		this.providers.set(handle, quickDiffProvider);

		const extensionId = ExtensionIdentifier.toKey(extension.identifier);
		this.proxy.$registerQuickDiffProvider(handle, DocumentSelector.from(selector, this.uriTransformer), `${extensionId}.${id}`, label, rootUri);
		return {
			dispose: () => {
				this.proxy.$unregisterQuickDiffProvider(handle);
				this.providers.delete(handle);
			}
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostQuickOpen.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostQuickOpen.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter } from '../../../base/common/event.js';
import { dispose, IDisposable } from '../../../base/common/lifecycle.js';
import { ExtHostCommands } from './extHostCommands.js';
import { IExtHostWorkspaceProvider } from './extHostWorkspace.js';
import { InputBox, InputBoxOptions, InputBoxValidationMessage, QuickInput, QuickInputButton, QuickPick, QuickPickItem, QuickPickItemButtonEvent, QuickPickOptions, WorkspaceFolder, WorkspaceFolderPickOptions } from 'vscode';
import { ExtHostQuickOpenShape, IMainContext, MainContext, TransferQuickInput, TransferQuickInputButton, TransferQuickPickItemOrSeparator } from './extHost.protocol.js';
import { QuickInputButtons, QuickPickItemKind, InputBoxValidationSeverity, QuickInputButtonLocation } from './extHostTypes.js';
import { isCancellationError } from '../../../base/common/errors.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { coalesce } from '../../../base/common/arrays.js';
import Severity from '../../../base/common/severity.js';
import { checkProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { IconPath, MarkdownString } from './extHostTypeConverters.js';

export type Item = string | QuickPickItem;

export interface ExtHostQuickOpen {
	showQuickPick(extension: IExtensionDescription, itemsOrItemsPromise: QuickPickItem[] | Promise<QuickPickItem[]>, options: QuickPickOptions & { canPickMany: true }, token?: CancellationToken): Promise<QuickPickItem[] | undefined>;
	showQuickPick(extension: IExtensionDescription, itemsOrItemsPromise: string[] | Promise<string[]>, options?: QuickPickOptions, token?: CancellationToken): Promise<string | undefined>;
	showQuickPick(extension: IExtensionDescription, itemsOrItemsPromise: QuickPickItem[] | Promise<QuickPickItem[]>, options?: QuickPickOptions, token?: CancellationToken): Promise<QuickPickItem | undefined>;
	showQuickPick(extension: IExtensionDescription, itemsOrItemsPromise: Item[] | Promise<Item[]>, options?: QuickPickOptions, token?: CancellationToken): Promise<Item | Item[] | undefined>;

	showInput(options?: InputBoxOptions, token?: CancellationToken): Promise<string | undefined>;

	showWorkspaceFolderPick(options?: WorkspaceFolderPickOptions, token?: CancellationToken): Promise<WorkspaceFolder | undefined>;

	createQuickPick<T extends QuickPickItem>(extension: IExtensionDescription): QuickPick<T>;

	createInputBox(extension: IExtensionDescription): InputBox;
}

export function createExtHostQuickOpen(mainContext: IMainContext, workspace: IExtHostWorkspaceProvider, commands: ExtHostCommands): ExtHostQuickOpenShape & ExtHostQuickOpen {
	const proxy = mainContext.getProxy(MainContext.MainThreadQuickOpen);

	class ExtHostQuickOpenImpl implements ExtHostQuickOpenShape {

		private _workspace: IExtHostWorkspaceProvider;
		private _commands: ExtHostCommands;

		private _onDidSelectItem?: (handle: number) => void;
		private _validateInput?: (input: string) => string | InputBoxValidationMessage | undefined | null | Thenable<string | InputBoxValidationMessage | undefined | null>;

		private _sessions = new Map<number, ExtHostQuickInput>();

		private _instances = 0;

		constructor(workspace: IExtHostWorkspaceProvider, commands: ExtHostCommands) {
			this._workspace = workspace;
			this._commands = commands;
		}

		showQuickPick(extension: IExtensionDescription, itemsOrItemsPromise: QuickPickItem[] | Promise<QuickPickItem[]>, options: QuickPickOptions & { canPickMany: true }, token?: CancellationToken): Promise<QuickPickItem[] | undefined>;
		showQuickPick(extension: IExtensionDescription, itemsOrItemsPromise: string[] | Promise<string[]>, options?: QuickPickOptions, token?: CancellationToken): Promise<string | undefined>;
		showQuickPick(extension: IExtensionDescription, itemsOrItemsPromise: QuickPickItem[] | Promise<QuickPickItem[]>, options?: QuickPickOptions, token?: CancellationToken): Promise<QuickPickItem | undefined>;
		showQuickPick(extension: IExtensionDescription, itemsOrItemsPromise: Item[] | Promise<Item[]>, options?: QuickPickOptions, token: CancellationToken = CancellationToken.None): Promise<Item | Item[] | undefined> {
			// clear state from last invocation
			this._onDidSelectItem = undefined;

			const itemsPromise = Promise.resolve(itemsOrItemsPromise);

			const instance = ++this._instances;

			const quickPickWidget = proxy.$show(instance, {
				title: options?.title,
				placeHolder: options?.placeHolder,
				prompt: options?.prompt,
				matchOnDescription: options?.matchOnDescription,
				matchOnDetail: options?.matchOnDetail,
				ignoreFocusLost: options?.ignoreFocusOut,
				canPickMany: options?.canPickMany,
			}, token);

			const widgetClosedMarker = {};
			const widgetClosedPromise = quickPickWidget.then(() => widgetClosedMarker);

			return Promise.race([widgetClosedPromise, itemsPromise]).then(result => {
				if (result === widgetClosedMarker) {
					return undefined;
				}

				return itemsPromise.then(items => {

					const pickItems: TransferQuickPickItemOrSeparator[] = [];
					for (let handle = 0; handle < items.length; handle++) {
						const item = items[handle];
						if (typeof item === 'string') {
							pickItems.push({ label: item, handle });
						} else if (item.kind === QuickPickItemKind.Separator) {
							pickItems.push({ type: 'separator', label: item.label });
						} else {
							if (item.tooltip) {
								checkProposedApiEnabled(extension, 'quickPickItemTooltip');
							}

							pickItems.push({
								label: item.label,
								iconPathDto: IconPath.from(item.iconPath),
								description: item.description,
								detail: item.detail,
								picked: item.picked,
								alwaysShow: item.alwaysShow,
								tooltip: MarkdownString.fromStrict(item.tooltip),
								resourceUri: item.resourceUri,
								handle
							});
						}
					}

					// handle selection changes
					if (options && typeof options.onDidSelectItem === 'function') {
						this._onDidSelectItem = (handle) => {
							options.onDidSelectItem!(items[handle]);
						};
					}

					// show items
					proxy.$setItems(instance, pickItems);

					return quickPickWidget.then(handle => {
						if (typeof handle === 'number') {
							return items[handle];
						} else if (Array.isArray(handle)) {
							return handle.map(h => items[h]);
						}
						return undefined;
					});
				});
			}).then(undefined, err => {
				if (isCancellationError(err)) {
					return undefined;
				}

				proxy.$setError(instance, err);

				return Promise.reject(err);
			});
		}

		$onItemSelected(handle: number): void {
			this._onDidSelectItem?.(handle);
		}

		// ---- input

		showInput(options?: InputBoxOptions, token: CancellationToken = CancellationToken.None): Promise<string | undefined> {

			// global validate fn used in callback below
			this._validateInput = options?.validateInput;

			return proxy.$input(options, typeof this._validateInput === 'function', token)
				.then(undefined, err => {
					if (isCancellationError(err)) {
						return undefined;
					}

					return Promise.reject(err);
				});
		}

		async $validateInput(input: string): Promise<string | { content: string; severity: Severity } | null | undefined> {
			if (!this._validateInput) {
				return;
			}

			const result = await this._validateInput(input);
			if (!result || typeof result === 'string') {
				return result;
			}

			let severity: Severity;
			switch (result.severity) {
				case InputBoxValidationSeverity.Info:
					severity = Severity.Info;
					break;
				case InputBoxValidationSeverity.Warning:
					severity = Severity.Warning;
					break;
				case InputBoxValidationSeverity.Error:
					severity = Severity.Error;
					break;
				default:
					severity = result.message ? Severity.Error : Severity.Ignore;
					break;
			}

			return {
				content: result.message,
				severity
			};
		}

		// ---- workspace folder picker

		async showWorkspaceFolderPick(options?: WorkspaceFolderPickOptions, token = CancellationToken.None): Promise<WorkspaceFolder | undefined> {
			const selectedFolder = await this._commands.executeCommand<WorkspaceFolder>('_workbench.pickWorkspaceFolder', [options]);
			if (!selectedFolder) {
				return undefined;
			}
			const workspaceFolders = await this._workspace.getWorkspaceFolders2();
			if (!workspaceFolders) {
				return undefined;
			}
			return workspaceFolders.find(folder => folder.uri.toString() === selectedFolder.uri.toString());
		}

		// ---- QuickInput

		createQuickPick<T extends QuickPickItem>(extension: IExtensionDescription): QuickPick<T> {
			const session: ExtHostQuickPick<T> = new ExtHostQuickPick(extension, () => this._sessions.delete(session._id));
			this._sessions.set(session._id, session);
			return session;
		}

		createInputBox(extension: IExtensionDescription): InputBox {
			const session: ExtHostInputBox = new ExtHostInputBox(extension, () => this._sessions.delete(session._id));
			this._sessions.set(session._id, session);
			return session;
		}

		$onDidChangeValue(sessionId: number, value: string): void {
			const session = this._sessions.get(sessionId);
			session?._fireDidChangeValue(value);
		}

		$onDidAccept(sessionId: number): void {
			const session = this._sessions.get(sessionId);
			session?._fireDidAccept();
		}

		$onDidChangeActive(sessionId: number, handles: number[]): void {
			const session = this._sessions.get(sessionId);
			if (session instanceof ExtHostQuickPick) {
				session._fireDidChangeActive(handles);
			}
		}

		$onDidChangeSelection(sessionId: number, handles: number[]): void {
			const session = this._sessions.get(sessionId);
			if (session instanceof ExtHostQuickPick) {
				session._fireDidChangeSelection(handles);
			}
		}

		$onDidTriggerButton(sessionId: number, handle: number, checked?: boolean): void {
			const session = this._sessions.get(sessionId);
			session?._fireDidTriggerButton(handle, checked);
		}

		$onDidTriggerItemButton(sessionId: number, itemHandle: number, buttonHandle: number): void {
			const session = this._sessions.get(sessionId);
			if (session instanceof ExtHostQuickPick) {
				session._fireDidTriggerItemButton(itemHandle, buttonHandle);
			}
		}

		$onDidHide(sessionId: number): void {
			const session = this._sessions.get(sessionId);
			session?._fireDidHide();
		}
	}

	class ExtHostQuickInput implements QuickInput {

		private static _nextId = 1;
		_id = ExtHostQuickPick._nextId++;

		private _title: string | undefined;
		private _steps: number | undefined;
		private _totalSteps: number | undefined;
		private _visible = false;
		private _expectingHide = false;
		private _enabled = true;
		private _busy = false;
		private _ignoreFocusOut = true;
		private _value = '';
		private _valueSelection: readonly [number, number] | undefined = undefined;
		private _placeholder: string | undefined;
		private _buttons: QuickInputButton[] = [];
		private _handlesToButtons = new Map<number, QuickInputButton>();
		private readonly _onDidAcceptEmitter = new Emitter<void>();
		private readonly _onDidChangeValueEmitter = new Emitter<string>();
		private readonly _onDidTriggerButtonEmitter = new Emitter<QuickInputButton>();
		private readonly _onDidHideEmitter = new Emitter<void>();
		private _updateTimeout: Timeout | undefined;
		private _pendingUpdate: TransferQuickInput = { id: this._id };

		private _disposed = false;
		protected _disposables: IDisposable[] = [
			this._onDidTriggerButtonEmitter,
			this._onDidHideEmitter,
			this._onDidAcceptEmitter,
			this._onDidChangeValueEmitter
		];

		constructor(protected _extension: IExtensionDescription, private _onDidDispose: () => void) {
		}

		get title() {
			return this._title;
		}

		set title(title: string | undefined) {
			this._title = title;
			this.update({ title });
		}

		get step() {
			return this._steps;
		}

		set step(step: number | undefined) {
			this._steps = step;
			this.update({ step });
		}

		get totalSteps() {
			return this._totalSteps;
		}

		set totalSteps(totalSteps: number | undefined) {
			this._totalSteps = totalSteps;
			this.update({ totalSteps });
		}

		get enabled() {
			return this._enabled;
		}

		set enabled(enabled: boolean) {
			this._enabled = enabled;
			this.update({ enabled });
		}

		get busy() {
			return this._busy;
		}

		set busy(busy: boolean) {
			this._busy = busy;
			this.update({ busy });
		}

		get ignoreFocusOut() {
			return this._ignoreFocusOut;
		}

		set ignoreFocusOut(ignoreFocusOut: boolean) {
			this._ignoreFocusOut = ignoreFocusOut;
			this.update({ ignoreFocusOut });
		}

		get value() {
			return this._value;
		}

		set value(value: string) {
			this._value = value;
			this.update({ value });
		}

		get valueSelection() {
			return this._valueSelection;
		}

		set valueSelection(valueSelection: readonly [number, number] | undefined) {
			this._valueSelection = valueSelection;
			this.update({ valueSelection });
		}

		get placeholder() {
			return this._placeholder;
		}

		set placeholder(placeholder: string | undefined) {
			this._placeholder = placeholder;
			this.update({ placeholder });
		}

		onDidChangeValue = this._onDidChangeValueEmitter.event;

		onDidAccept = this._onDidAcceptEmitter.event;

		get buttons() {
			return this._buttons;
		}

		set buttons(buttons: QuickInputButton[]) {
			if (buttons.some(button =>
				typeof button.location === 'number' ||
				typeof button.toggle === 'object' && typeof button.toggle.checked === 'boolean')) {
				checkProposedApiEnabled(this._extension, 'quickInputButtonLocation');
			}

			if (buttons.some(button =>
				typeof button.location === 'number' &&
				button.location !== QuickInputButtonLocation.Input &&
				typeof button.toggle === 'object' &&
				typeof button.toggle.checked === 'boolean')) {
				throw new Error('QuickInputButtons with toggle set are only supported in the Input location.');
			}

			this._buttons = buttons.slice();
			this._handlesToButtons.clear();
			buttons.forEach((button, i) => {
				const handle = button === QuickInputButtons.Back ? -1 : i;
				this._handlesToButtons.set(handle, button);
			});
			this.update({
				buttons: buttons.map<TransferQuickInputButton>((button, i) => {
					return {
						iconPathDto: IconPath.from(button.iconPath),
						tooltip: button.tooltip,
						handle: button === QuickInputButtons.Back ? -1 : i,
						location: typeof button.location === 'number' ? button.location : undefined,
						checked: typeof button.toggle === 'object' && typeof button.toggle.checked === 'boolean' ? button.toggle.checked : undefined
					};
				})
			});
		}

		onDidTriggerButton = this._onDidTriggerButtonEmitter.event;

		show(): void {
			this._visible = true;
			this._expectingHide = true;
			this.update({ visible: true });
		}

		hide(): void {
			this._visible = false;
			this.update({ visible: false });
		}

		onDidHide = this._onDidHideEmitter.event;

		_fireDidAccept() {
			this._onDidAcceptEmitter.fire();
		}

		_fireDidChangeValue(value: string) {
			this._value = value;
			this._onDidChangeValueEmitter.fire(value);
		}

		_fireDidTriggerButton(handle: number, checked?: boolean) {
			const button = this._handlesToButtons.get(handle);
			if (button) {
				if (checked !== undefined && button.toggle) {
					button.toggle.checked = checked;
				}
				this._onDidTriggerButtonEmitter.fire(button);
			}
		}

		_fireDidHide() {
			if (this._expectingHide) {
				// if this._visible is true, it means that .show() was called between
				// .hide() and .onDidHide. To ensure the correct number of onDidHide events
				// are emitted, we set this._expectingHide to this value so that
				// the next time .hide() is called, we can emit the event again.
				// Example:
				// .show() -> .hide() -> .show() -> .hide() should emit 2 onDidHide events.
				// .show() -> .hide() -> .hide() should emit 1 onDidHide event.
				// Fixes #135747
				this._expectingHide = this._visible;
				this._onDidHideEmitter.fire();
			}
		}

		dispose(): void {
			if (this._disposed) {
				return;
			}
			this._disposed = true;
			this._fireDidHide();
			this._disposables = dispose(this._disposables);
			if (this._updateTimeout) {
				clearTimeout(this._updateTimeout);
				this._updateTimeout = undefined;
			}
			this._onDidDispose();
			proxy.$dispose(this._id);
		}

		protected update(properties: Record<string, unknown>): void {
			if (this._disposed) {
				return;
			}
			for (const key of Object.keys(properties)) {
				const value = properties[key];
				this._pendingUpdate[key] = value === undefined ? null : value;
			}

			if ('visible' in this._pendingUpdate) {
				if (this._updateTimeout) {
					clearTimeout(this._updateTimeout);
					this._updateTimeout = undefined;
				}
				this.dispatchUpdate();
			} else if (this._visible && !this._updateTimeout) {
				// Defer the update so that multiple changes to setters don't cause a redraw each
				this._updateTimeout = setTimeout(() => {
					this._updateTimeout = undefined;
					this.dispatchUpdate();
				}, 0);
			}
		}

		private dispatchUpdate() {
			proxy.$createOrUpdate(this._pendingUpdate);
			this._pendingUpdate = { id: this._id };
		}
	}

	class ExtHostQuickPick<T extends QuickPickItem> extends ExtHostQuickInput implements QuickPick<T> {

		private _items: T[] = [];
		private _handlesToItems = new Map<number, T>();
		private _itemsToHandles = new Map<T, number>();
		private _canSelectMany = false;
		private _matchOnDescription = true;
		private _matchOnDetail = true;
		private _sortByLabel = true;
		private _keepScrollPosition = false;
		private _activeItems: T[] = [];
		private _prompt: string | undefined;
		private readonly _onDidChangeActiveEmitter = new Emitter<T[]>();
		private _selectedItems: T[] = [];
		private readonly _onDidChangeSelectionEmitter = new Emitter<T[]>();
		private readonly _onDidTriggerItemButtonEmitter = new Emitter<QuickPickItemButtonEvent<T>>();

		constructor(extension: IExtensionDescription, onDispose: () => void) {
			super(extension, onDispose);
			this._disposables.push(
				this._onDidChangeActiveEmitter,
				this._onDidChangeSelectionEmitter,
				this._onDidTriggerItemButtonEmitter
			);
			this.update({ type: 'quickPick' });
		}

		get items() {
			return this._items;
		}

		set items(items: T[]) {
			this._items = items.slice();
			this._handlesToItems.clear();
			this._itemsToHandles.clear();
			items.forEach((item, i) => {
				this._handlesToItems.set(i, item);
				this._itemsToHandles.set(item, i);
			});

			const pickItems: TransferQuickPickItemOrSeparator[] = [];
			for (let handle = 0; handle < items.length; handle++) {
				const item = items[handle];
				if (item.kind === QuickPickItemKind.Separator) {
					pickItems.push({ type: 'separator', label: item.label });
				} else {
					if (item.tooltip) {
						checkProposedApiEnabled(this._extension, 'quickPickItemTooltip');
					}

					pickItems.push({
						handle,
						label: item.label,
						iconPathDto: IconPath.from(item.iconPath),
						description: item.description,
						detail: item.detail,
						picked: item.picked,
						alwaysShow: item.alwaysShow,
						tooltip: MarkdownString.fromStrict(item.tooltip),
						resourceUri: item.resourceUri,
						buttons: item.buttons?.map<TransferQuickInputButton>((button, i) => {
							return {
								iconPathDto: IconPath.from(button.iconPath),
								tooltip: button.tooltip,
								handle: i
							};
						}),
					});
				}
			}

			this.update({
				items: pickItems,
			});
		}

		get canSelectMany() {
			return this._canSelectMany;
		}

		set canSelectMany(canSelectMany: boolean) {
			this._canSelectMany = canSelectMany;
			this.update({ canSelectMany });
		}

		get matchOnDescription() {
			return this._matchOnDescription;
		}

		set matchOnDescription(matchOnDescription: boolean) {
			this._matchOnDescription = matchOnDescription;
			this.update({ matchOnDescription });
		}

		get matchOnDetail() {
			return this._matchOnDetail;
		}

		set matchOnDetail(matchOnDetail: boolean) {
			this._matchOnDetail = matchOnDetail;
			this.update({ matchOnDetail });
		}

		get sortByLabel() {
			return this._sortByLabel;
		}

		set sortByLabel(sortByLabel: boolean) {
			this._sortByLabel = sortByLabel;
			this.update({ sortByLabel });
		}

		get keepScrollPosition() {
			return this._keepScrollPosition;
		}

		set keepScrollPosition(keepScrollPosition: boolean) {
			this._keepScrollPosition = keepScrollPosition;
			this.update({ keepScrollPosition });
		}

		get prompt() {
			return this._prompt;
		}

		set prompt(prompt: string | undefined) {
			this._prompt = prompt;
			this.update({ prompt });
		}

		get activeItems() {
			return this._activeItems;
		}

		set activeItems(activeItems: T[]) {
			this._activeItems = activeItems.filter(item => this._itemsToHandles.has(item));
			this.update({ activeItems: this._activeItems.map(item => this._itemsToHandles.get(item)) });
		}

		onDidChangeActive = this._onDidChangeActiveEmitter.event;

		get selectedItems() {
			return this._selectedItems;
		}

		set selectedItems(selectedItems: T[]) {
			this._selectedItems = selectedItems.filter(item => this._itemsToHandles.has(item));
			this.update({ selectedItems: this._selectedItems.map(item => this._itemsToHandles.get(item)) });
		}

		onDidChangeSelection = this._onDidChangeSelectionEmitter.event;

		_fireDidChangeActive(handles: number[]) {
			const items = coalesce(handles.map(handle => this._handlesToItems.get(handle)));
			this._activeItems = items;
			this._onDidChangeActiveEmitter.fire(items);
		}

		_fireDidChangeSelection(handles: number[]) {
			const items = coalesce(handles.map(handle => this._handlesToItems.get(handle)));
			this._selectedItems = items;
			this._onDidChangeSelectionEmitter.fire(items);
		}

		onDidTriggerItemButton = this._onDidTriggerItemButtonEmitter.event;

		_fireDidTriggerItemButton(itemHandle: number, buttonHandle: number) {
			const item = this._handlesToItems.get(itemHandle)!;
			if (!item || !item.buttons || !item.buttons.length) {
				return;
			}
			const button = item.buttons[buttonHandle];
			if (button) {
				this._onDidTriggerItemButtonEmitter.fire({
					button,
					item
				});
			}
		}
	}

	class ExtHostInputBox extends ExtHostQuickInput implements InputBox {

		private _password = false;
		private _prompt: string | undefined;
		private _validationMessage: string | InputBoxValidationMessage | undefined;

		constructor(extension: IExtensionDescription, onDispose: () => void) {
			super(extension, onDispose);
			this.update({ type: 'inputBox' });
		}

		get password() {
			return this._password;
		}

		set password(password: boolean) {
			this._password = password;
			this.update({ password });
		}

		get prompt() {
			return this._prompt;
		}

		set prompt(prompt: string | undefined) {
			this._prompt = prompt;
			this.update({ prompt });
		}

		get validationMessage() {
			return this._validationMessage;
		}

		set validationMessage(validationMessage: string | InputBoxValidationMessage | undefined) {
			this._validationMessage = validationMessage;
			if (!validationMessage) {
				this.update({ validationMessage: undefined, severity: Severity.Ignore });
			} else if (typeof validationMessage === 'string') {
				this.update({ validationMessage, severity: Severity.Error });
			} else {
				this.update({ validationMessage: validationMessage.message, severity: validationMessage.severity ?? Severity.Error });
			}
		}
	}

	return new ExtHostQuickOpenImpl(workspace, commands);
}
```

--------------------------------------------------------------------------------

````
