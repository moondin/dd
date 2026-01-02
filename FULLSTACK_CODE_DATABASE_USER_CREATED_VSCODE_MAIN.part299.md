---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 299
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 299 of 552)

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

---[FILE: src/vs/server/node/remoteExtensionHostAgentServer.ts]---
Location: vscode-main/src/vs/server/node/remoteExtensionHostAgentServer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import type * as http from 'http';
import * as net from 'net';
import { createRequire } from 'node:module';
import { performance } from 'perf_hooks';
import * as url from 'url';
import { VSBuffer } from '../../base/common/buffer.js';
import { CharCode } from '../../base/common/charCode.js';
import { isSigPipeError, onUnexpectedError, setUnexpectedErrorHandler } from '../../base/common/errors.js';
import { isEqualOrParent } from '../../base/common/extpath.js';
import { Disposable, DisposableStore } from '../../base/common/lifecycle.js';
import { connectionTokenQueryName, FileAccess, getServerProductSegment, Schemas } from '../../base/common/network.js';
import { dirname, join } from '../../base/common/path.js';
import * as perf from '../../base/common/performance.js';
import * as platform from '../../base/common/platform.js';
import { createRegExp, escapeRegExpCharacters } from '../../base/common/strings.js';
import { URI } from '../../base/common/uri.js';
import { generateUuid } from '../../base/common/uuid.js';
import { getOSReleaseInfo } from '../../base/node/osReleaseInfo.js';
import { findFreePort } from '../../base/node/ports.js';
import { addUNCHostToAllowlist, disableUNCAccessRestrictions } from '../../base/node/unc.js';
import { PersistentProtocol } from '../../base/parts/ipc/common/ipc.net.js';
import { NodeSocket, upgradeToISocket, WebSocketNodeSocket } from '../../base/parts/ipc/node/ipc.net.js';
import { IConfigurationService } from '../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../platform/log/common/log.js';
import { IProductService } from '../../platform/product/common/productService.js';
import { ConnectionType, ConnectionTypeRequest, ErrorMessage, HandshakeMessage, IRemoteExtensionHostStartParams, ITunnelConnectionStartParams, SignRequest } from '../../platform/remote/common/remoteAgentConnection.js';
import { RemoteAgentConnectionContext } from '../../platform/remote/common/remoteAgentEnvironment.js';
import { ITelemetryService } from '../../platform/telemetry/common/telemetry.js';
import { ExtensionHostConnection } from './extensionHostConnection.js';
import { ManagementConnection } from './remoteExtensionManagement.js';
import { determineServerConnectionToken, requestHasValidConnectionToken as httpRequestHasValidConnectionToken, ServerConnectionToken, ServerConnectionTokenParseError, ServerConnectionTokenType } from './serverConnectionToken.js';
import { IServerEnvironmentService, ServerParsedArgs } from './serverEnvironmentService.js';
import { setupServerServices, SocketServer } from './serverServices.js';
import { CacheControl, serveError, serveFile, WebClientServer } from './webClientServer.js';
const require = createRequire(import.meta.url);

const SHUTDOWN_TIMEOUT = 5 * 60 * 1000;

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

class RemoteExtensionHostAgentServer extends Disposable implements IServerAPI {

	private readonly _extHostConnections: { [reconnectionToken: string]: ExtensionHostConnection };
	private readonly _managementConnections: { [reconnectionToken: string]: ManagementConnection };
	private readonly _allReconnectionTokens: Set<string>;
	private readonly _webClientServer: WebClientServer | null;
	private readonly _webEndpointOriginChecker: WebEndpointOriginChecker;
	private readonly _reconnectionGraceTime: number;

	private readonly _serverBasePath: string | undefined;
	private readonly _serverProductPath: string;

	private shutdownTimer: Timeout | undefined;

	constructor(
		private readonly _socketServer: SocketServer<RemoteAgentConnectionContext>,
		private readonly _connectionToken: ServerConnectionToken,
		private readonly _vsdaMod: typeof vsda | null,
		hasWebClient: boolean,
		serverBasePath: string | undefined,
		@IServerEnvironmentService private readonly _environmentService: IServerEnvironmentService,
		@IProductService private readonly _productService: IProductService,
		@ILogService private readonly _logService: ILogService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();
		this._webEndpointOriginChecker = WebEndpointOriginChecker.create(this._productService);

		if (serverBasePath !== undefined && serverBasePath.charCodeAt(serverBasePath.length - 1) === CharCode.Slash) {
			// Remove trailing slash from base path
			serverBasePath = serverBasePath.substring(0, serverBasePath.length - 1);
		}
		this._serverBasePath = serverBasePath; // undefined or starts with a slash
		this._serverProductPath = `/${getServerProductSegment(_productService)}`; // starts with a slash
		this._extHostConnections = Object.create(null);
		this._managementConnections = Object.create(null);
		this._allReconnectionTokens = new Set<string>();
		this._webClientServer = (
			hasWebClient
				? this._instantiationService.createInstance(WebClientServer, this._connectionToken, serverBasePath ?? '/', this._serverProductPath)
				: null
		);
		this._logService.info(`Extension host agent started.`);
		this._reconnectionGraceTime = this._environmentService.reconnectionGraceTime;

		this._waitThenShutdown(true);
	}

	public async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
		// Only serve GET requests
		if (req.method !== 'GET') {
			return serveError(req, res, 405, `Unsupported method ${req.method}`);
		}

		if (!req.url) {
			return serveError(req, res, 400, `Bad request.`);
		}

		const parsedUrl = url.parse(req.url, true);
		let pathname = parsedUrl.pathname;

		if (!pathname) {
			return serveError(req, res, 400, `Bad request.`);
		}

		// Serve from both '/' and serverBasePath
		if (this._serverBasePath !== undefined && pathname.startsWith(this._serverBasePath)) {
			pathname = pathname.substring(this._serverBasePath.length) || '/';
		}
		// for now accept all paths, with or without server product path
		if (pathname.startsWith(this._serverProductPath) && pathname.charCodeAt(this._serverProductPath.length) === CharCode.Slash) {
			pathname = pathname.substring(this._serverProductPath.length);
		}

		// Version
		if (pathname === '/version') {
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			return void res.end(this._productService.commit || '');
		}

		// Delay shutdown
		if (pathname === '/delay-shutdown') {
			this._delayShutdown();
			res.writeHead(200);
			return void res.end('OK');
		}

		if (!httpRequestHasValidConnectionToken(this._connectionToken, req, parsedUrl)) {
			// invalid connection token
			return serveError(req, res, 403, `Forbidden.`);
		}

		if (pathname === '/vscode-remote-resource') {
			// Handle HTTP requests for resources rendered in the rich client (images, fonts, etc.)
			// These resources could be files shipped with extensions or even workspace files.
			const desiredPath = parsedUrl.query['path'];
			if (typeof desiredPath !== 'string') {
				return serveError(req, res, 400, `Bad request.`);
			}

			let filePath: string;
			try {
				filePath = URI.from({ scheme: Schemas.file, path: desiredPath }).fsPath;
			} catch (err) {
				return serveError(req, res, 400, `Bad request.`);
			}

			const responseHeaders: Record<string, string> = Object.create(null);
			if (this._environmentService.isBuilt) {
				if (isEqualOrParent(filePath, this._environmentService.builtinExtensionsPath, !platform.isLinux)
					|| isEqualOrParent(filePath, this._environmentService.extensionsPath, !platform.isLinux)
				) {
					responseHeaders['Cache-Control'] = 'public, max-age=31536000';
				}
			}

			// Allow cross origin requests from the web worker extension host
			responseHeaders['Vary'] = 'Origin';
			const requestOrigin = req.headers['origin'];
			if (requestOrigin && this._webEndpointOriginChecker.matches(requestOrigin)) {
				responseHeaders['Access-Control-Allow-Origin'] = requestOrigin;
			}
			return serveFile(filePath, CacheControl.ETAG, this._logService, req, res, responseHeaders);
		}

		// workbench web UI
		if (this._webClientServer) {
			this._webClientServer.handle(req, res, parsedUrl, pathname);
			return;
		}

		res.writeHead(404, { 'Content-Type': 'text/plain' });
		return void res.end('Not found');
	}

	public handleUpgrade(req: http.IncomingMessage, socket: net.Socket) {
		let reconnectionToken = generateUuid();
		let isReconnection = false;
		let skipWebSocketFrames = false;

		if (req.url) {
			const query = url.parse(req.url, true).query;
			if (typeof query.reconnectionToken === 'string') {
				reconnectionToken = query.reconnectionToken;
			}
			if (query.reconnection === 'true') {
				isReconnection = true;
			}
			if (query.skipWebSocketFrames === 'true') {
				skipWebSocketFrames = true;
			}
		}

		const upgraded = upgradeToISocket(req, socket, {
			debugLabel: `server-connection-${reconnectionToken}`,
			skipWebSocketFrames,
			disableWebSocketCompression: this._environmentService.args['disable-websocket-compression']
		});

		if (!upgraded) {
			return;
		}

		this._handleWebSocketConnection(upgraded, isReconnection, reconnectionToken);
	}

	public handleServerError(err: Error): void {
		this._logService.error(`Error occurred in server`);
		this._logService.error(err);
	}

	// Eventually cleanup

	private _getRemoteAddress(socket: NodeSocket | WebSocketNodeSocket): string {
		let _socket: net.Socket;
		if (socket instanceof NodeSocket) {
			_socket = socket.socket;
		} else {
			_socket = socket.socket.socket;
		}
		return _socket.remoteAddress || `<unknown>`;
	}

	private async _rejectWebSocketConnection(logPrefix: string, protocol: PersistentProtocol, reason: string): Promise<void> {
		const socket = protocol.getSocket();
		this._logService.error(`${logPrefix} ${reason}.`);
		const errMessage: ErrorMessage = {
			type: 'error',
			reason: reason
		};
		protocol.sendControl(VSBuffer.fromString(JSON.stringify(errMessage)));
		protocol.dispose();
		await socket.drain();
		socket.dispose();
	}

	/**
	 * NOTE: Avoid using await in this method!
	 * The problem is that await introduces a process.nextTick due to the implicit Promise.then
	 * This can lead to some bytes being received and interpreted and a control message being emitted before the next listener has a chance to be registered.
	 */
	private _handleWebSocketConnection(socket: NodeSocket | WebSocketNodeSocket, isReconnection: boolean, reconnectionToken: string): void {
		const remoteAddress = this._getRemoteAddress(socket);
		const logPrefix = `[${remoteAddress}][${reconnectionToken.substr(0, 8)}]`;
		const protocol = new PersistentProtocol({ socket });

		const validator = this._vsdaMod ? new this._vsdaMod.validator() : null;
		const signer = this._vsdaMod ? new this._vsdaMod.signer() : null;

		const enum State {
			WaitingForAuth,
			WaitingForConnectionType,
			Done,
			Error
		}
		let state = State.WaitingForAuth;

		const rejectWebSocketConnection = (msg: string) => {
			state = State.Error;
			listener.dispose();
			this._rejectWebSocketConnection(logPrefix, protocol, msg);
		};

		const listener = protocol.onControlMessage((raw) => {
			if (state === State.WaitingForAuth) {
				let msg1: HandshakeMessage;
				try {
					msg1 = <HandshakeMessage>JSON.parse(raw.toString());
				} catch (err) {
					return rejectWebSocketConnection(`Malformed first message`);
				}
				if (msg1.type !== 'auth') {
					return rejectWebSocketConnection(`Invalid first message`);
				}

				if (this._connectionToken.type === ServerConnectionTokenType.Mandatory && !this._connectionToken.validate(msg1.auth)) {
					return rejectWebSocketConnection(`Unauthorized client refused: auth mismatch`);
				}

				// Send `sign` request
				let signedData = generateUuid();
				if (signer) {
					try {
						signedData = signer.sign(msg1.data);
					} catch (e) {
					}
				}
				let someText = generateUuid();
				if (validator) {
					try {
						someText = validator.createNewMessage(someText);
					} catch (e) {
					}
				}
				const signRequest: SignRequest = {
					type: 'sign',
					data: someText,
					signedData: signedData
				};
				protocol.sendControl(VSBuffer.fromString(JSON.stringify(signRequest)));

				state = State.WaitingForConnectionType;

			} else if (state === State.WaitingForConnectionType) {

				let msg2: HandshakeMessage;
				try {
					msg2 = <HandshakeMessage>JSON.parse(raw.toString());
				} catch (err) {
					return rejectWebSocketConnection(`Malformed second message`);
				}
				if (msg2.type !== 'connectionType') {
					return rejectWebSocketConnection(`Invalid second message`);
				}
				if (typeof msg2.signedData !== 'string') {
					return rejectWebSocketConnection(`Invalid second message field type`);
				}

				const rendererCommit = msg2.commit;
				const myCommit = this._productService.commit;
				if (rendererCommit && myCommit) {
					// Running in the built version where commits are defined
					if (rendererCommit !== myCommit) {
						return rejectWebSocketConnection(`Client refused: version mismatch`);
					}
				}

				let valid = false;
				if (!validator) {
					valid = true;
				} else if (this._connectionToken.validate(msg2.signedData)) {
					// web client
					valid = true;
				} else {
					try {
						valid = validator.validate(msg2.signedData) === 'ok';
					} catch (e) {
					}
				}

				if (!valid) {
					if (this._environmentService.isBuilt) {
						return rejectWebSocketConnection(`Unauthorized client refused`);
					} else {
						this._logService.error(`${logPrefix} Unauthorized client handshake failed but we proceed because of dev mode.`);
					}
				}

				// We have received a new connection.
				// This indicates that the server owner has connectivity.
				// Therefore we will shorten the reconnection grace period for disconnected connections!
				for (const key in this._managementConnections) {
					const managementConnection = this._managementConnections[key];
					managementConnection.shortenReconnectionGraceTimeIfNecessary();
				}
				for (const key in this._extHostConnections) {
					const extHostConnection = this._extHostConnections[key];
					extHostConnection.shortenReconnectionGraceTimeIfNecessary();
				}

				state = State.Done;
				listener.dispose();
				this._handleConnectionType(remoteAddress, logPrefix, protocol, socket, isReconnection, reconnectionToken, msg2);
			}
		});
	}

	private async _handleConnectionType(remoteAddress: string, _logPrefix: string, protocol: PersistentProtocol, socket: NodeSocket | WebSocketNodeSocket, isReconnection: boolean, reconnectionToken: string, msg: ConnectionTypeRequest): Promise<void> {
		const logPrefix = (
			msg.desiredConnectionType === ConnectionType.Management
				? `${_logPrefix}[ManagementConnection]`
				: msg.desiredConnectionType === ConnectionType.ExtensionHost
					? `${_logPrefix}[ExtensionHostConnection]`
					: _logPrefix
		);

		if (msg.desiredConnectionType === ConnectionType.Management) {
			// This should become a management connection

			if (isReconnection) {
				// This is a reconnection
				if (!this._managementConnections[reconnectionToken]) {
					if (!this._allReconnectionTokens.has(reconnectionToken)) {
						// This is an unknown reconnection token
						return this._rejectWebSocketConnection(logPrefix, protocol, `Unknown reconnection token (never seen)`);
					} else {
						// This is a connection that was seen in the past, but is no longer valid
						return this._rejectWebSocketConnection(logPrefix, protocol, `Unknown reconnection token (seen before)`);
					}
				}

				protocol.sendControl(VSBuffer.fromString(JSON.stringify({ type: 'ok' })));
				const dataChunk = protocol.readEntireBuffer();
				protocol.dispose();
				this._managementConnections[reconnectionToken].acceptReconnection(remoteAddress, socket, dataChunk);

			} else {
				// This is a fresh connection
				if (this._managementConnections[reconnectionToken]) {
					// Cannot have two concurrent connections using the same reconnection token
					return this._rejectWebSocketConnection(logPrefix, protocol, `Duplicate reconnection token`);
				}

				protocol.sendControl(VSBuffer.fromString(JSON.stringify({ type: 'ok' })));
				const con = new ManagementConnection(this._logService, reconnectionToken, remoteAddress, protocol, this._reconnectionGraceTime);
				this._socketServer.acceptConnection(con.protocol, con.onClose);
				this._managementConnections[reconnectionToken] = con;
				this._allReconnectionTokens.add(reconnectionToken);
				con.onClose(() => {
					delete this._managementConnections[reconnectionToken];
				});

			}

		} else if (msg.desiredConnectionType === ConnectionType.ExtensionHost) {

			// This should become an extension host connection
			const startParams0 = <IRemoteExtensionHostStartParams>msg.args || { language: 'en' };
			const startParams = await this._updateWithFreeDebugPort(startParams0);

			if (startParams.port) {
				this._logService.trace(`${logPrefix} - startParams debug port ${startParams.port}`);
			}
			this._logService.trace(`${logPrefix} - startParams language: ${startParams.language}`);
			this._logService.trace(`${logPrefix} - startParams env: ${JSON.stringify(startParams.env)}`);

			if (isReconnection) {
				// This is a reconnection
				if (!this._extHostConnections[reconnectionToken]) {
					if (!this._allReconnectionTokens.has(reconnectionToken)) {
						// This is an unknown reconnection token
						return this._rejectWebSocketConnection(logPrefix, protocol, `Unknown reconnection token (never seen)`);
					} else {
						// This is a connection that was seen in the past, but is no longer valid
						return this._rejectWebSocketConnection(logPrefix, protocol, `Unknown reconnection token (seen before)`);
					}
				}

				protocol.sendPause();
				protocol.sendControl(VSBuffer.fromString(JSON.stringify(startParams.port ? { debugPort: startParams.port } : {})));
				const dataChunk = protocol.readEntireBuffer();
				protocol.dispose();
				this._extHostConnections[reconnectionToken].acceptReconnection(remoteAddress, socket, dataChunk);

			} else {
				// This is a fresh connection
				if (this._extHostConnections[reconnectionToken]) {
					// Cannot have two concurrent connections using the same reconnection token
					return this._rejectWebSocketConnection(logPrefix, protocol, `Duplicate reconnection token`);
				}

				protocol.sendPause();
				protocol.sendControl(VSBuffer.fromString(JSON.stringify(startParams.port ? { debugPort: startParams.port } : {})));
				const dataChunk = protocol.readEntireBuffer();
				protocol.dispose();
				const con = this._instantiationService.createInstance(ExtensionHostConnection, reconnectionToken, remoteAddress, socket, dataChunk);
				this._extHostConnections[reconnectionToken] = con;
				this._allReconnectionTokens.add(reconnectionToken);
				con.onClose(() => {
					con.dispose();
					delete this._extHostConnections[reconnectionToken];
					this._onDidCloseExtHostConnection();
				});
				con.start(startParams);
			}

		} else if (msg.desiredConnectionType === ConnectionType.Tunnel) {

			const tunnelStartParams = <ITunnelConnectionStartParams>msg.args;
			this._createTunnel(protocol, tunnelStartParams);

		} else {

			return this._rejectWebSocketConnection(logPrefix, protocol, `Unknown initial data received`);

		}
	}

	private async _createTunnel(protocol: PersistentProtocol, tunnelStartParams: ITunnelConnectionStartParams): Promise<void> {
		const remoteSocket = (<NodeSocket>protocol.getSocket()).socket;
		const dataChunk = protocol.readEntireBuffer();
		protocol.dispose();

		remoteSocket.pause();
		const localSocket = await this._connectTunnelSocket(tunnelStartParams.host, tunnelStartParams.port);

		if (dataChunk.byteLength > 0) {
			localSocket.write(dataChunk.buffer);
		}

		localSocket.on('end', () => remoteSocket.end());
		localSocket.on('close', () => remoteSocket.end());
		localSocket.on('error', () => remoteSocket.destroy());
		remoteSocket.on('end', () => localSocket.end());
		remoteSocket.on('close', () => localSocket.end());
		remoteSocket.on('error', () => localSocket.destroy());

		localSocket.pipe(remoteSocket);
		remoteSocket.pipe(localSocket);
	}

	private _connectTunnelSocket(host: string, port: number): Promise<net.Socket> {
		return new Promise<net.Socket>((c, e) => {
			const socket = net.createConnection(
				{
					host: host,
					port: port,
					autoSelectFamily: true
				}, () => {
					socket.removeListener('error', e);
					socket.pause();
					c(socket);
				}
			);

			socket.once('error', e);
		});
	}

	private _updateWithFreeDebugPort(startParams: IRemoteExtensionHostStartParams): Thenable<IRemoteExtensionHostStartParams> {
		if (typeof startParams.port === 'number') {
			return findFreePort(startParams.port, 10 /* try 10 ports */, 5000 /* try up to 5 seconds */).then(freePort => {
				startParams.port = freePort;
				return startParams;
			});
		}
		// No port clear debug configuration.
		startParams.debugId = undefined;
		startParams.port = undefined;
		startParams.break = undefined;
		return Promise.resolve(startParams);
	}

	private async _onDidCloseExtHostConnection(): Promise<void> {
		if (!this._environmentService.args['enable-remote-auto-shutdown']) {
			return;
		}

		this._cancelShutdown();

		const hasActiveExtHosts = !!Object.keys(this._extHostConnections).length;
		if (!hasActiveExtHosts) {
			console.log('Last EH closed, waiting before shutting down');
			this._logService.info('Last EH closed, waiting before shutting down');
			this._waitThenShutdown();
		}
	}

	private _waitThenShutdown(initial = false): void {
		if (!this._environmentService.args['enable-remote-auto-shutdown']) {
			return;
		}

		if (this._environmentService.args['remote-auto-shutdown-without-delay'] && !initial) {
			this._shutdown();
		} else {
			this.shutdownTimer = setTimeout(() => {
				this.shutdownTimer = undefined;

				this._shutdown();
			}, SHUTDOWN_TIMEOUT);
		}
	}

	private _shutdown(): void {
		const hasActiveExtHosts = !!Object.keys(this._extHostConnections).length;
		if (hasActiveExtHosts) {
			console.log('New EH opened, aborting shutdown');
			this._logService.info('New EH opened, aborting shutdown');
			return;
		} else {
			console.log('Last EH closed, shutting down');
			this._logService.info('Last EH closed, shutting down');
			this.dispose();
			process.exit(0);
		}
	}

	/**
	 * If the server is in a shutdown timeout, cancel it and start over
	 */
	private _delayShutdown(): void {
		if (this.shutdownTimer) {
			console.log('Got delay-shutdown request while in shutdown timeout, delaying');
			this._logService.info('Got delay-shutdown request while in shutdown timeout, delaying');
			this._cancelShutdown();
			this._waitThenShutdown();
		}
	}

	private _cancelShutdown(): void {
		if (this.shutdownTimer) {
			console.log('Cancelling previous shutdown timeout');
			this._logService.info('Cancelling previous shutdown timeout');
			clearTimeout(this.shutdownTimer);
			this.shutdownTimer = undefined;
		}
	}
}

export interface IServerAPI {
	/**
	 * Do not remove!!. Called from server-main.js
	 */
	handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void>;
	/**
	 * Do not remove!!. Called from server-main.js
	 */
	handleUpgrade(req: http.IncomingMessage, socket: net.Socket): void;
	/**
	 * Do not remove!!. Called from server-main.js
	 */
	handleServerError(err: Error): void;
	/**
	 * Do not remove!!. Called from server-main.js
	 */
	dispose(): void;
}

export async function createServer(address: string | net.AddressInfo | null, args: ServerParsedArgs, REMOTE_DATA_FOLDER: string): Promise<IServerAPI> {

	const connectionToken = await determineServerConnectionToken(args);
	if (connectionToken instanceof ServerConnectionTokenParseError) {
		console.warn(connectionToken.message);
		process.exit(1);
	}

	// setting up error handlers, first with console.error, then, once available, using the log service

	function initUnexpectedErrorHandler(handler: (err: any) => void) {
		setUnexpectedErrorHandler(err => {
			// See https://github.com/microsoft/vscode-remote-release/issues/6481
			// In some circumstances, console.error will throw an asynchronous error. This asynchronous error
			// will end up here, and then it will be logged again, thus creating an endless asynchronous loop.
			// Here we try to break the loop by ignoring EPIPE errors that include our own unexpected error handler in the stack.
			if (isSigPipeError(err) && err.stack && /unexpectedErrorHandler/.test(err.stack)) {
				return;
			}
			handler(err);
		});
	}

	const unloggedErrors: any[] = [];
	initUnexpectedErrorHandler((error: any) => {
		unloggedErrors.push(error);
		console.error(error);
	});
	let didLogAboutSIGPIPE = false;
	process.on('SIGPIPE', () => {
		// See https://github.com/microsoft/vscode-remote-release/issues/6543
		// We would normally install a SIGPIPE listener in bootstrap-node.js
		// But in certain situations, the console itself can be in a broken pipe state
		// so logging SIGPIPE to the console will cause an infinite async loop
		if (!didLogAboutSIGPIPE) {
			didLogAboutSIGPIPE = true;
			onUnexpectedError(new Error(`Unexpected SIGPIPE`));
		}
	});

	const disposables = new DisposableStore();
	const { socketServer, instantiationService } = await setupServerServices(connectionToken, args, REMOTE_DATA_FOLDER, disposables);

	// Set the unexpected error handler after the services have been initialized, to avoid having
	// the telemetry service overwrite our handler
	instantiationService.invokeFunction((accessor) => {
		const logService = accessor.get(ILogService);
		unloggedErrors.forEach(error => logService.error(error));
		unloggedErrors.length = 0;

		initUnexpectedErrorHandler((error: any) => logService.error(error));
	});

	// On Windows, configure the UNC allow list based on settings
	instantiationService.invokeFunction((accessor) => {
		const configurationService = accessor.get(IConfigurationService);

		if (platform.isWindows) {
			if (configurationService.getValue('security.restrictUNCAccess') === false) {
				disableUNCAccessRestrictions();
			} else {
				addUNCHostToAllowlist(configurationService.getValue('security.allowedUNCHosts'));
			}
		}
	});

	//
	// On Windows, exit early with warning message to users about potential security issue
	// if there is node_modules folder under home drive or Users folder.
	//
	instantiationService.invokeFunction((accessor) => {
		const logService = accessor.get(ILogService);

		if (platform.isWindows && process.env.HOMEDRIVE && process.env.HOMEPATH) {
			const homeDirModulesPath = join(process.env.HOMEDRIVE, 'node_modules');
			const userDir = dirname(join(process.env.HOMEDRIVE, process.env.HOMEPATH));
			const userDirModulesPath = join(userDir, 'node_modules');
			if (fs.existsSync(homeDirModulesPath) || fs.existsSync(userDirModulesPath)) {
				const message = `

*
* !!!! Server terminated due to presence of CVE-2020-1416 !!!!
*
* Please remove the following directories and re-try
* ${homeDirModulesPath}
* ${userDirModulesPath}
*
* For more information on the vulnerability https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-1416
*

`;
				logService.warn(message);
				console.warn(message);
				process.exit(0);
			}
		}
	});

	const vsdaMod = instantiationService.invokeFunction((accessor) => {
		const logService = accessor.get(ILogService);
		const hasVSDA = fs.existsSync(join(FileAccess.asFileUri('').fsPath, '../node_modules/vsda'));
		if (hasVSDA) {
			try {
				return require('vsda');
			} catch (err) {
				logService.error(err);
			}
		}
		return null;
	});

	let serverBasePath = args['server-base-path'];
	if (serverBasePath && !serverBasePath.startsWith('/')) {
		serverBasePath = `/${serverBasePath}`;
	}

	const hasWebClient = fs.existsSync(FileAccess.asFileUri(`vs/code/browser/workbench/workbench.html`).fsPath);

	if (hasWebClient && address && typeof address !== 'string') {
		// ships the web ui!
		const queryPart = (connectionToken.type !== ServerConnectionTokenType.None ? `?${connectionTokenQueryName}=${connectionToken.value}` : '');
		console.log(`Web UI available at http://localhost${address.port === 80 ? '' : `:${address.port}`}${serverBasePath ?? ''}${queryPart}`);
	}

	const remoteExtensionHostAgentServer = instantiationService.createInstance(RemoteExtensionHostAgentServer, socketServer, connectionToken, vsdaMod, hasWebClient, serverBasePath);

	perf.mark('code/server/ready');
	const currentTime = performance.now();
	// eslint-disable-next-line local/code-no-any-casts
	const vscodeServerStartTime: number = (<any>global).vscodeServerStartTime;
	// eslint-disable-next-line local/code-no-any-casts
	const vscodeServerListenTime: number = (<any>global).vscodeServerListenTime;
	// eslint-disable-next-line local/code-no-any-casts
	const vscodeServerCodeLoadedTime: number = (<any>global).vscodeServerCodeLoadedTime;

	instantiationService.invokeFunction(async (accessor) => {
		const telemetryService = accessor.get(ITelemetryService);

		type ServerStartClassification = {
			owner: 'alexdima';
			comment: 'The server has started up';
			startTime: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The time the server started at.' };
			startedTime: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The time the server began listening for connections.' };
			codeLoadedTime: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The time which the code loaded on the server' };
			readyTime: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The time when the server was completely ready' };
		};
		type ServerStartEvent = {
			startTime: number;
			startedTime: number;
			codeLoadedTime: number;
			readyTime: number;
		};
		telemetryService.publicLog2<ServerStartEvent, ServerStartClassification>('serverStart', {
			startTime: vscodeServerStartTime,
			startedTime: vscodeServerListenTime,
			codeLoadedTime: vscodeServerCodeLoadedTime,
			readyTime: currentTime
		});

		if (platform.isLinux) {
			const logService = accessor.get(ILogService);
			const releaseInfo = await getOSReleaseInfo(logService.error.bind(logService));
			if (releaseInfo) {
				type ServerPlatformInfoClassification = {
					platformId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'A string identifying the operating system without any version information.' };
					platformVersionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'A string identifying the operating system version excluding any name information or release code.' };
					platformIdLike: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'A string identifying the operating system the current OS derivate is closely related to.' };
					owner: 'deepak1556';
					comment: 'Provides insight into the distro information on Linux.';
				};
				type ServerPlatformInfoEvent = {
					platformId: string;
					platformVersionId: string | undefined;
					platformIdLike: string | undefined;
				};
				telemetryService.publicLog2<ServerPlatformInfoEvent, ServerPlatformInfoClassification>('serverPlatformInfo', {
					platformId: releaseInfo.id,
					platformVersionId: releaseInfo.version_id,
					platformIdLike: releaseInfo.id_like
				});
			}
		}
	});

	if (args['print-startup-performance']) {
		let output = '';
		output += `Start-up time: ${vscodeServerListenTime - vscodeServerStartTime}\n`;
		output += `Code loading time: ${vscodeServerCodeLoadedTime - vscodeServerStartTime}\n`;
		output += `Initialized time: ${currentTime - vscodeServerStartTime}\n`;
		output += `\n`;
		console.log(output);
	}
	return remoteExtensionHostAgentServer;
}

class WebEndpointOriginChecker {

	public static create(productService: IProductService): WebEndpointOriginChecker {
		const webEndpointUrlTemplate = productService.webEndpointUrlTemplate;
		const commit = productService.commit;
		const quality = productService.quality;
		if (!webEndpointUrlTemplate || !commit || !quality) {
			return new WebEndpointOriginChecker(null);
		}

		const uuid = generateUuid();
		const exampleUrl = new URL(
			webEndpointUrlTemplate
				.replace('{{uuid}}', uuid)
				.replace('{{commit}}', commit)
				.replace('{{quality}}', quality)
		);
		const exampleOrigin = exampleUrl.origin;
		const originRegExpSource = (
			escapeRegExpCharacters(exampleOrigin)
				.replace(uuid, '[a-zA-Z0-9\\-]+')
		);
		try {
			const originRegExp = createRegExp(`^${originRegExpSource}$`, true, { matchCase: false });
			return new WebEndpointOriginChecker(originRegExp);
		} catch (err) {
			return new WebEndpointOriginChecker(null);
		}
	}

	constructor(
		private readonly _originRegExp: RegExp | null
	) { }

	public matches(origin: string): boolean {
		if (!this._originRegExp) {
			return false;
		}
		return this._originRegExp.test(origin);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/server/node/remoteExtensionManagement.ts]---
Location: vscode-main/src/vs/server/node/remoteExtensionManagement.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { PersistentProtocol, ISocket, ProtocolConstants } from '../../base/parts/ipc/common/ipc.net.js';
import { ILogService } from '../../platform/log/common/log.js';
import { Emitter, Event } from '../../base/common/event.js';
import { VSBuffer } from '../../base/common/buffer.js';
import { ProcessTimeRunOnceScheduler } from '../../base/common/async.js';

function printTime(ms: number): string {
	let h = 0;
	let m = 0;
	let s = 0;
	if (ms >= 1000) {
		s = Math.floor(ms / 1000);
		ms -= s * 1000;
	}
	if (s >= 60) {
		m = Math.floor(s / 60);
		s -= m * 60;
	}
	if (m >= 60) {
		h = Math.floor(m / 60);
		m -= h * 60;
	}
	const _h = h ? `${h}h` : ``;
	const _m = m ? `${m}m` : ``;
	const _s = s ? `${s}s` : ``;
	const _ms = ms ? `${ms}ms` : ``;
	return `${_h}${_m}${_s}${_ms}`;
}

export class ManagementConnection {

	private _onClose = new Emitter<void>();
	public readonly onClose: Event<void> = this._onClose.event;

	private readonly _reconnectionGraceTime: number;
	private readonly _reconnectionShortGraceTime: number;
	private _remoteAddress: string;

	public readonly protocol: PersistentProtocol;
	private _disposed: boolean;
	private _disconnectRunner1: ProcessTimeRunOnceScheduler;
	private _disconnectRunner2: ProcessTimeRunOnceScheduler;

	constructor(
		private readonly _logService: ILogService,
		private readonly _reconnectionToken: string,
		remoteAddress: string,
		protocol: PersistentProtocol,
		reconnectionGraceTime: number
	) {
		this._reconnectionGraceTime = reconnectionGraceTime;
		const defaultShortGrace = ProtocolConstants.ReconnectionShortGraceTime;
		this._reconnectionShortGraceTime = reconnectionGraceTime > 0 ? Math.min(defaultShortGrace, reconnectionGraceTime) : 0;
		this._remoteAddress = remoteAddress;

		this.protocol = protocol;
		this._disposed = false;
		this._disconnectRunner1 = new ProcessTimeRunOnceScheduler(() => {
			this._log(`The reconnection grace time of ${printTime(this._reconnectionGraceTime)} has expired, so the connection will be disposed.`);
			this._cleanResources();
		}, this._reconnectionGraceTime);
		this._disconnectRunner2 = new ProcessTimeRunOnceScheduler(() => {
			this._log(`The reconnection short grace time of ${printTime(this._reconnectionShortGraceTime)} has expired, so the connection will be disposed.`);
			this._cleanResources();
		}, this._reconnectionShortGraceTime);

		this.protocol.onDidDispose(() => {
			this._log(`The client has disconnected gracefully, so the connection will be disposed.`);
			this._cleanResources();
		});
		this.protocol.onSocketClose(() => {
			this._log(`The client has disconnected, will wait for reconnection ${printTime(this._reconnectionGraceTime)} before disposing...`);
			// The socket has closed, let's give the renderer a certain amount of time to reconnect
			this._disconnectRunner1.schedule();
		});

		this._log(`New connection established.`);
	}

	private _log(_str: string): void {
		this._logService.info(`[${this._remoteAddress}][${this._reconnectionToken.substr(0, 8)}][ManagementConnection] ${_str}`);
	}

	public shortenReconnectionGraceTimeIfNecessary(): void {
		if (this._disconnectRunner2.isScheduled()) {
			// we are disconnected and already running the short reconnection timer
			return;
		}
		if (this._disconnectRunner1.isScheduled()) {
			this._log(`Another client has connected, will shorten the wait for reconnection ${printTime(this._reconnectionShortGraceTime)} before disposing...`);
			// we are disconnected and running the long reconnection timer
			this._disconnectRunner2.schedule();
		}
	}

	private _cleanResources(): void {
		if (this._disposed) {
			// already called
			return;
		}
		this._disposed = true;
		this._disconnectRunner1.dispose();
		this._disconnectRunner2.dispose();
		const socket = this.protocol.getSocket();
		this.protocol.sendDisconnect();
		this.protocol.dispose();
		socket.end();
		this._onClose.fire(undefined);
	}

	public acceptReconnection(remoteAddress: string, socket: ISocket, initialDataChunk: VSBuffer): void {
		this._remoteAddress = remoteAddress;
		this._log(`The client has reconnected.`);
		this._disconnectRunner1.cancel();
		this._disconnectRunner2.cancel();
		this.protocol.beginAcceptReconnection(socket, initialDataChunk);
		this.protocol.endAcceptReconnection();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/server/node/remoteExtensionsScanner.ts]---
Location: vscode-main/src/vs/server/node/remoteExtensionsScanner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isAbsolute, join, resolve } from '../../base/common/path.js';
import * as platform from '../../base/common/platform.js';
import { cwd } from '../../base/common/process.js';
import { URI } from '../../base/common/uri.js';
import * as performance from '../../base/common/performance.js';
import { Event } from '../../base/common/event.js';
import { IURITransformer, transformOutgoingURIs } from '../../base/common/uriIpc.js';
import { IServerChannel } from '../../base/parts/ipc/common/ipc.js';
import { ContextKeyDefinedExpr, ContextKeyEqualsExpr, ContextKeyExpr, ContextKeyExpression, ContextKeyGreaterEqualsExpr, ContextKeyGreaterExpr, ContextKeyInExpr, ContextKeyNotEqualsExpr, ContextKeyNotExpr, ContextKeyNotInExpr, ContextKeyRegexExpr, ContextKeySmallerEqualsExpr, ContextKeySmallerExpr, ContextKeyValue, IContextKeyExprMapper } from '../../platform/contextkey/common/contextkey.js';
import { IExtensionGalleryService, IExtensionManagementService, InstallExtensionSummary, InstallOptions } from '../../platform/extensionManagement/common/extensionManagement.js';
import { ExtensionManagementCLI } from '../../platform/extensionManagement/common/extensionManagementCLI.js';
import { IExtensionsScannerService, toExtensionDescription } from '../../platform/extensionManagement/common/extensionsScannerService.js';
import { ExtensionType, IExtensionDescription } from '../../platform/extensions/common/extensions.js';
import { ILogService } from '../../platform/log/common/log.js';
import { IUserDataProfilesService } from '../../platform/userDataProfile/common/userDataProfile.js';
import { IServerEnvironmentService } from './serverEnvironmentService.js';
import { dedupExtensions } from '../../workbench/services/extensions/common/extensionsUtil.js';
import { Schemas } from '../../base/common/network.js';
import { IRemoteExtensionsScannerService } from '../../platform/remote/common/remoteExtensionsScanner.js';
import { ILanguagePackService } from '../../platform/languagePacks/common/languagePacks.js';
import { areSameExtensions } from '../../platform/extensionManagement/common/extensionManagementUtil.js';

export class RemoteExtensionsScannerService implements IRemoteExtensionsScannerService {

	readonly _serviceBrand: undefined;

	private readonly _whenBuiltinExtensionsReady = Promise.resolve<InstallExtensionSummary>({ failed: [] });
	private readonly _whenExtensionsReady = Promise.resolve<InstallExtensionSummary>({ failed: [] });

	constructor(
		private readonly _extensionManagementCLI: ExtensionManagementCLI,
		environmentService: IServerEnvironmentService,
		private readonly _userDataProfilesService: IUserDataProfilesService,
		private readonly _extensionsScannerService: IExtensionsScannerService,
		private readonly _logService: ILogService,
		private readonly _extensionGalleryService: IExtensionGalleryService,
		private readonly _languagePackService: ILanguagePackService,
		private readonly _extensionManagementService: IExtensionManagementService,
	) {
		const builtinExtensionsToInstall = environmentService.args['install-builtin-extension'];
		if (builtinExtensionsToInstall) {
			_logService.trace('Installing builtin extensions passed via args...');
			const installOptions: InstallOptions = { isMachineScoped: !!environmentService.args['do-not-sync'], installPreReleaseVersion: !!environmentService.args['pre-release'] };
			performance.mark('code/server/willInstallBuiltinExtensions');
			this._whenExtensionsReady = this._whenBuiltinExtensionsReady = _extensionManagementCLI.installExtensions([], this._asExtensionIdOrVSIX(builtinExtensionsToInstall), installOptions, !!environmentService.args['force'])
				.then(() => {
					performance.mark('code/server/didInstallBuiltinExtensions');
					_logService.trace('Finished installing builtin extensions');
					return { failed: [] };
				}, error => {
					_logService.error(error);
					return { failed: [] };
				});
		}

		const extensionsToInstall = environmentService.args['install-extension'];
		if (extensionsToInstall) {
			_logService.trace('Installing extensions passed via args...');
			const installOptions: InstallOptions = {
				isMachineScoped: !!environmentService.args['do-not-sync'],
				installPreReleaseVersion: !!environmentService.args['pre-release'],
				isApplicationScoped: true // extensions installed during server startup are available to all profiles
			};
			this._whenExtensionsReady = this._whenBuiltinExtensionsReady
				.then(() => _extensionManagementCLI.installExtensions(this._asExtensionIdOrVSIX(extensionsToInstall), [], installOptions, !!environmentService.args['force']))
				.then(async () => {
					_logService.trace('Finished installing extensions');
					return { failed: [] };
				}, async error => {
					_logService.error(error);

					const failed: {
						id: string;
						installOptions: InstallOptions;
					}[] = [];
					const alreadyInstalled = await this._extensionManagementService.getInstalled(ExtensionType.User);

					for (const id of this._asExtensionIdOrVSIX(extensionsToInstall)) {
						if (typeof id === 'string') {
							if (!alreadyInstalled.some(e => areSameExtensions(e.identifier, { id }))) {
								failed.push({ id, installOptions });
							}
						}
					}

					if (!failed.length) {
						_logService.trace(`No extensions to report as failed`);
						return { failed: [] };
					}

					_logService.info(`Relaying the following extensions to install later: ${failed.map(f => f.id).join(', ')}`);
					return { failed };
				});
		}
	}

	private _asExtensionIdOrVSIX(inputs: string[]): (string | URI)[] {
		return inputs.map(input => /\.vsix$/i.test(input) ? URI.file(isAbsolute(input) ? input : join(cwd(), input)) : input);
	}

	whenExtensionsReady(): Promise<InstallExtensionSummary> {
		return this._whenExtensionsReady;
	}

	async scanExtensions(
		language?: string,
		profileLocation?: URI,
		workspaceExtensionLocations?: URI[],
		extensionDevelopmentLocations?: URI[],
		languagePackId?: string
	): Promise<IExtensionDescription[]> {
		performance.mark('code/server/willScanExtensions');
		this._logService.trace(`Scanning extensions using UI language: ${language}`);

		await this._whenBuiltinExtensionsReady;

		const extensionDevelopmentPaths = extensionDevelopmentLocations ? extensionDevelopmentLocations.filter(url => url.scheme === Schemas.file).map(url => url.fsPath) : undefined;
		profileLocation = profileLocation ?? this._userDataProfilesService.defaultProfile.extensionsResource;

		const extensions = await this._scanExtensions(profileLocation, language ?? platform.language, workspaceExtensionLocations, extensionDevelopmentPaths, languagePackId);

		this._logService.trace('Scanned Extensions', extensions);
		this._massageWhenConditions(extensions);

		performance.mark('code/server/didScanExtensions');
		return extensions;
	}

	private async _scanExtensions(profileLocation: URI, language: string, workspaceInstalledExtensionLocations: URI[] | undefined, extensionDevelopmentPath: string[] | undefined, languagePackId: string | undefined): Promise<IExtensionDescription[]> {
		await this._ensureLanguagePackIsInstalled(language, languagePackId);

		const [builtinExtensions, installedExtensions, workspaceInstalledExtensions, developedExtensions] = await Promise.all([
			this._scanBuiltinExtensions(language),
			this._scanInstalledExtensions(profileLocation, language),
			this._scanWorkspaceInstalledExtensions(language, workspaceInstalledExtensionLocations),
			this._scanDevelopedExtensions(language, extensionDevelopmentPath)
		]);

		return dedupExtensions(builtinExtensions, installedExtensions, workspaceInstalledExtensions, developedExtensions, this._logService);
	}

	private async _scanDevelopedExtensions(language: string, extensionDevelopmentPaths?: string[]): Promise<IExtensionDescription[]> {
		if (extensionDevelopmentPaths) {
			return (await Promise.all(extensionDevelopmentPaths.map(extensionDevelopmentPath => this._extensionsScannerService.scanOneOrMultipleExtensions(URI.file(resolve(extensionDevelopmentPath)), ExtensionType.User, { language }))))
				.flat()
				.map(e => toExtensionDescription(e, true));
		}
		return [];
	}

	private async _scanWorkspaceInstalledExtensions(language: string, workspaceInstalledExtensions?: URI[]): Promise<IExtensionDescription[]> {
		const result: IExtensionDescription[] = [];
		if (workspaceInstalledExtensions?.length) {
			const scannedExtensions = await Promise.all(workspaceInstalledExtensions.map(location => this._extensionsScannerService.scanExistingExtension(location, ExtensionType.User, { language })));
			for (const scannedExtension of scannedExtensions) {
				if (scannedExtension) {
					result.push(toExtensionDescription(scannedExtension, false));
				}
			}
		}
		return result;
	}

	private async _scanBuiltinExtensions(language: string): Promise<IExtensionDescription[]> {
		const scannedExtensions = await this._extensionsScannerService.scanSystemExtensions({ language });
		return scannedExtensions.map(e => toExtensionDescription(e, false));
	}

	private async _scanInstalledExtensions(profileLocation: URI, language: string): Promise<IExtensionDescription[]> {
		const scannedExtensions = await this._extensionsScannerService.scanUserExtensions({ profileLocation, language, useCache: true });
		return scannedExtensions.map(e => toExtensionDescription(e, false));
	}

	private async _ensureLanguagePackIsInstalled(language: string, languagePackId: string | undefined): Promise<void> {
		if (
			// No need to install language packs for the default language
			language === platform.LANGUAGE_DEFAULT ||
			// The extension gallery service needs to be available
			!this._extensionGalleryService.isEnabled()
		) {
			return;
		}

		try {
			const installed = await this._languagePackService.getInstalledLanguages();
			if (installed.find(p => p.id === language)) {
				this._logService.trace(`Language Pack ${language} is already installed. Skipping language pack installation.`);
				return;
			}
		} catch (err) {
			// We tried to see what is installed but failed. We can try installing anyway.
			this._logService.error(err);
		}

		if (!languagePackId) {
			this._logService.trace(`No language pack id provided for language ${language}. Skipping language pack installation.`);
			return;
		}

		this._logService.trace(`Language Pack ${languagePackId} for language ${language} is not installed. It will be installed now.`);
		try {
			await this._extensionManagementCLI.installExtensions([languagePackId], [], { isMachineScoped: true }, true);
		} catch (err) {
			// We tried to install the language pack but failed. We can continue without it thus using the default language.
			this._logService.error(err);
		}
	}

	private _massageWhenConditions(extensions: IExtensionDescription[]): void {
		// Massage "when" conditions which mention `resourceScheme`

		interface WhenUser { when?: string }

		interface LocWhenUser { [loc: string]: WhenUser[] }

		const _mapResourceSchemeValue = (value: string, isRegex: boolean): string => {
			// console.log(`_mapResourceSchemeValue: ${value}, ${isRegex}`);
			return value.replace(/file/g, 'vscode-remote');
		};

		const _mapResourceRegExpValue = (value: RegExp): RegExp => {
			let flags = '';
			flags += value.global ? 'g' : '';
			flags += value.ignoreCase ? 'i' : '';
			flags += value.multiline ? 'm' : '';
			return new RegExp(_mapResourceSchemeValue(value.source, true), flags);
		};

		const _exprKeyMapper = new class implements IContextKeyExprMapper {
			mapDefined(key: string): ContextKeyExpression {
				return ContextKeyDefinedExpr.create(key);
			}
			mapNot(key: string): ContextKeyExpression {
				return ContextKeyNotExpr.create(key);
			}
			mapEquals(key: string, value: ContextKeyValue): ContextKeyExpression {
				if (key === 'resourceScheme' && typeof value === 'string') {
					return ContextKeyEqualsExpr.create(key, _mapResourceSchemeValue(value, false));
				} else {
					return ContextKeyEqualsExpr.create(key, value);
				}
			}
			mapNotEquals(key: string, value: ContextKeyValue): ContextKeyExpression {
				if (key === 'resourceScheme' && typeof value === 'string') {
					return ContextKeyNotEqualsExpr.create(key, _mapResourceSchemeValue(value, false));
				} else {
					return ContextKeyNotEqualsExpr.create(key, value);
				}
			}
			mapGreater(key: string, value: ContextKeyValue): ContextKeyExpression {
				return ContextKeyGreaterExpr.create(key, value);
			}
			mapGreaterEquals(key: string, value: ContextKeyValue): ContextKeyExpression {
				return ContextKeyGreaterEqualsExpr.create(key, value);
			}
			mapSmaller(key: string, value: ContextKeyValue): ContextKeyExpression {
				return ContextKeySmallerExpr.create(key, value);
			}
			mapSmallerEquals(key: string, value: ContextKeyValue): ContextKeyExpression {
				return ContextKeySmallerEqualsExpr.create(key, value);
			}
			mapRegex(key: string, regexp: RegExp | null): ContextKeyRegexExpr {
				if (key === 'resourceScheme' && regexp) {
					return ContextKeyRegexExpr.create(key, _mapResourceRegExpValue(regexp));
				} else {
					return ContextKeyRegexExpr.create(key, regexp);
				}
			}
			mapIn(key: string, valueKey: string): ContextKeyInExpr {
				return ContextKeyInExpr.create(key, valueKey);
			}
			mapNotIn(key: string, valueKey: string): ContextKeyNotInExpr {
				return ContextKeyNotInExpr.create(key, valueKey);
			}
		};

		const _massageWhenUser = (element: WhenUser) => {
			if (!element || !element.when || !/resourceScheme/.test(element.when)) {
				return;
			}

			const expr = ContextKeyExpr.deserialize(element.when);
			if (!expr) {
				return;
			}

			const massaged = expr.map(_exprKeyMapper);
			element.when = massaged.serialize();
		};

		const _massageWhenUserArr = (elements: WhenUser[] | WhenUser) => {
			if (Array.isArray(elements)) {
				for (const element of elements) {
					_massageWhenUser(element);
				}
			} else {
				_massageWhenUser(elements);
			}
		};

		const _massageLocWhenUser = (target: LocWhenUser) => {
			for (const loc in target) {
				_massageWhenUserArr(target[loc]);
			}
		};

		extensions.forEach((extension) => {
			if (extension.contributes) {
				if (extension.contributes.menus) {
					_massageLocWhenUser(<LocWhenUser>extension.contributes.menus);
				}
				if (extension.contributes.keybindings) {
					_massageWhenUserArr(<WhenUser | WhenUser[]>extension.contributes.keybindings);
				}
				if (extension.contributes.views) {
					_massageLocWhenUser(<LocWhenUser>extension.contributes.views);
				}
			}
		});
	}
}

export class RemoteExtensionsScannerChannel implements IServerChannel {

	constructor(private service: RemoteExtensionsScannerService, private getUriTransformer: (requestContext: any) => IURITransformer) { }

	listen(context: any, event: string): Event<any> {
		throw new Error('Invalid listen');
	}

	async call(context: any, command: string, args?: any): Promise<any> {
		const uriTransformer = this.getUriTransformer(context);
		switch (command) {
			case 'whenExtensionsReady': return await this.service.whenExtensionsReady();

			case 'scanExtensions': {
				const language = args[0];
				const profileLocation = args[1] ? URI.revive(uriTransformer.transformIncoming(args[1])) : undefined;
				const workspaceExtensionLocations = Array.isArray(args[2]) ? args[2].map(u => URI.revive(uriTransformer.transformIncoming(u))) : undefined;
				const extensionDevelopmentPath = Array.isArray(args[3]) ? args[3].map(u => URI.revive(uriTransformer.transformIncoming(u))) : undefined;
				const languagePackId: string | undefined = args[4];
				const extensions = await this.service.scanExtensions(
					language,
					profileLocation,
					workspaceExtensionLocations,
					extensionDevelopmentPath,
					languagePackId
				);
				return extensions.map(extension => transformOutgoingURIs(extension, uriTransformer));
			}
		}
		throw new Error('Invalid call');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/server/node/remoteFileSystemProviderServer.ts]---
Location: vscode-main/src/vs/server/node/remoteFileSystemProviderServer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../base/common/event.js';
import { URI, UriComponents } from '../../base/common/uri.js';
import { IURITransformer } from '../../base/common/uriIpc.js';
import { IFileChange } from '../../platform/files/common/files.js';
import { ILogService } from '../../platform/log/common/log.js';
import { createURITransformer } from '../../base/common/uriTransformer.js';
import { RemoteAgentConnectionContext } from '../../platform/remote/common/remoteAgentEnvironment.js';
import { DiskFileSystemProvider } from '../../platform/files/node/diskFileSystemProvider.js';
import { posix, delimiter } from '../../base/common/path.js';
import { IServerEnvironmentService } from './serverEnvironmentService.js';
import { AbstractDiskFileSystemProviderChannel, AbstractSessionFileWatcher, ISessionFileWatcher } from '../../platform/files/node/diskFileSystemProviderServer.js';
import { IRecursiveWatcherOptions } from '../../platform/files/common/watcher.js';
import { IConfigurationService } from '../../platform/configuration/common/configuration.js';

export class RemoteAgentFileSystemProviderChannel extends AbstractDiskFileSystemProviderChannel<RemoteAgentConnectionContext> {

	private readonly uriTransformerCache = new Map<string, IURITransformer>();

	constructor(
		logService: ILogService,
		private readonly environmentService: IServerEnvironmentService,
		private readonly configurationService: IConfigurationService
	) {
		super(new DiskFileSystemProvider(logService), logService);

		this._register(this.provider);
	}

	protected override getUriTransformer(ctx: RemoteAgentConnectionContext): IURITransformer {
		let transformer = this.uriTransformerCache.get(ctx.remoteAuthority);
		if (!transformer) {
			transformer = createURITransformer(ctx.remoteAuthority);
			this.uriTransformerCache.set(ctx.remoteAuthority, transformer);
		}

		return transformer;
	}

	protected override transformIncoming(uriTransformer: IURITransformer, _resource: UriComponents, supportVSCodeResource = false): URI {
		if (supportVSCodeResource && _resource.path === '/vscode-resource' && _resource.query) {
			const requestResourcePath = JSON.parse(_resource.query).requestResourcePath;

			return URI.from({ scheme: 'file', path: requestResourcePath });
		}

		return URI.revive(uriTransformer.transformIncoming(_resource));
	}

	//#region File Watching

	protected createSessionFileWatcher(uriTransformer: IURITransformer, emitter: Emitter<IFileChange[] | string>): ISessionFileWatcher {
		return new SessionFileWatcher(uriTransformer, emitter, this.logService, this.environmentService, this.configurationService);
	}

	//#endregion
}

class SessionFileWatcher extends AbstractSessionFileWatcher {

	constructor(
		uriTransformer: IURITransformer,
		sessionEmitter: Emitter<IFileChange[] | string>,
		logService: ILogService,
		environmentService: IServerEnvironmentService,
		configurationService: IConfigurationService
	) {
		super(uriTransformer, sessionEmitter, logService, environmentService);
	}

	protected override getRecursiveWatcherOptions(environmentService: IServerEnvironmentService): IRecursiveWatcherOptions | undefined {
		const fileWatcherPolling = environmentService.args['file-watcher-polling'];
		if (fileWatcherPolling) {
			const segments = fileWatcherPolling.split(delimiter);
			const pollingInterval = Number(segments[0]);
			if (pollingInterval > 0) {
				const usePolling = segments.length > 1 ? segments.slice(1) : true;
				return { usePolling, pollingInterval };
			}
		}

		return undefined;
	}

	protected override getExtraExcludes(environmentService: IServerEnvironmentService): string[] | undefined {
		if (environmentService.extensionsPath) {
			// when opening the $HOME folder, we end up watching the extension folder
			// so simply exclude watching the extensions folder
			return [posix.join(environmentService.extensionsPath, '**')];
		}

		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/server/node/remoteLanguagePacks.ts]---
Location: vscode-main/src/vs/server/node/remoteLanguagePacks.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FileAccess } from '../../base/common/network.js';
import { join } from '../../base/common/path.js';
import type { INLSConfiguration } from '../../nls.js';
import { resolveNLSConfiguration } from '../../base/node/nls.js';
import { Promises } from '../../base/node/pfs.js';
import product from '../../platform/product/common/product.js';

const nlsMetadataPath = join(FileAccess.asFileUri('').fsPath);
const defaultMessagesFile = join(nlsMetadataPath, 'nls.messages.json');
const nlsConfigurationCache = new Map<string, Promise<INLSConfiguration>>();

export async function getNLSConfiguration(language: string, userDataPath: string): Promise<INLSConfiguration> {
	if (!product.commit || !(await Promises.exists(defaultMessagesFile))) {
		return {
			userLocale: 'en',
			osLocale: 'en',
			resolvedLanguage: 'en',
			defaultMessagesFile,

			// NLS: below 2 are a relic from old times only used by vscode-nls and deprecated
			locale: 'en',
			availableLanguages: {}
		};
	}

	const cacheKey = `${language}||${userDataPath}`;
	let result = nlsConfigurationCache.get(cacheKey);
	if (!result) {
		result = resolveNLSConfiguration({ userLocale: language, osLocale: language, commit: product.commit, userDataPath, nlsMetadataPath });
		nlsConfigurationCache.set(cacheKey, result);
	}

	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/server/node/remoteTerminalChannel.ts]---
Location: vscode-main/src/vs/server/node/remoteTerminalChannel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as os from 'os';
import { Emitter, Event } from '../../base/common/event.js';
import { cloneAndChange } from '../../base/common/objects.js';
import { Disposable } from '../../base/common/lifecycle.js';
import * as path from '../../base/common/path.js';
import * as platform from '../../base/common/platform.js';
import { URI } from '../../base/common/uri.js';
import { IURITransformer } from '../../base/common/uriIpc.js';
import { IServerChannel } from '../../base/parts/ipc/common/ipc.js';
import { createRandomIPCHandle } from '../../base/parts/ipc/node/ipc.net.js';
import { RemoteAgentConnectionContext } from '../../platform/remote/common/remoteAgentEnvironment.js';
import { IPtyHostService, IShellLaunchConfig, ITerminalProfile } from '../../platform/terminal/common/terminal.js';
import { IGetTerminalLayoutInfoArgs, ISetTerminalLayoutInfoArgs } from '../../platform/terminal/common/terminalProcess.js';
import { IWorkspaceFolder } from '../../platform/workspace/common/workspace.js';
import { createURITransformer } from '../../base/common/uriTransformer.js';
import { CLIServerBase, ICommandsExecuter } from '../../workbench/api/node/extHostCLIServer.js';
import { IEnvironmentVariableCollection } from '../../platform/terminal/common/environmentVariable.js';
import { MergedEnvironmentVariableCollection } from '../../platform/terminal/common/environmentVariableCollection.js';
import { deserializeEnvironmentDescriptionMap, deserializeEnvironmentVariableCollection } from '../../platform/terminal/common/environmentVariableShared.js';
import { ICreateTerminalProcessArguments, ICreateTerminalProcessResult, IWorkspaceFolderData, RemoteTerminalChannelEvent, RemoteTerminalChannelRequest } from '../../workbench/contrib/terminal/common/remote/terminal.js';
import * as terminalEnvironment from '../../workbench/contrib/terminal/common/terminalEnvironment.js';
import { AbstractVariableResolverService } from '../../workbench/services/configurationResolver/common/variableResolver.js';
import { buildUserEnvironment } from './extensionHostConnection.js';
import { IServerEnvironmentService } from './serverEnvironmentService.js';
import { IProductService } from '../../platform/product/common/productService.js';
import { IExtensionManagementService } from '../../platform/extensionManagement/common/extensionManagement.js';
import { IConfigurationService } from '../../platform/configuration/common/configuration.js';
import { ILogService } from '../../platform/log/common/log.js';
import { promiseWithResolvers } from '../../base/common/async.js';
import { shouldUseEnvironmentVariableCollection } from '../../platform/terminal/common/terminalEnvironment.js';

class CustomVariableResolver extends AbstractVariableResolverService {
	constructor(
		env: platform.IProcessEnvironment,
		workspaceFolders: IWorkspaceFolder[],
		activeFileResource: URI | undefined,
		resolvedVariables: { [name: string]: string },
		extensionService: IExtensionManagementService,
	) {
		super({
			getFolderUri: (folderName: string): URI | undefined => {
				const found = workspaceFolders.filter(f => f.name === folderName);
				if (found && found.length > 0) {
					return found[0].uri;
				}
				return undefined;
			},
			getWorkspaceFolderCount: (): number => {
				return workspaceFolders.length;
			},
			getConfigurationValue: (folderUri: URI, section: string): string | undefined => {
				return resolvedVariables[`config:${section}`];
			},
			getExecPath: (): string | undefined => {
				return env['VSCODE_EXEC_PATH'];
			},
			getAppRoot: (): string | undefined => {
				return env['VSCODE_CWD'];
			},
			getFilePath: (): string | undefined => {
				if (activeFileResource) {
					return path.normalize(activeFileResource.fsPath);
				}
				return undefined;
			},
			getSelectedText: (): string | undefined => {
				return resolvedVariables['selectedText'];
			},
			getLineNumber: (): string | undefined => {
				return resolvedVariables['lineNumber'];
			},
			getColumnNumber: (): string | undefined => {
				return resolvedVariables['columnNumber'];
			},
			getExtension: async id => {
				const installed = await extensionService.getInstalled();
				const found = installed.find(e => e.identifier.id === id);
				return found && { extensionLocation: found.location };
			},
		}, undefined, Promise.resolve(os.homedir()), Promise.resolve(env));
	}
}

export class RemoteTerminalChannel extends Disposable implements IServerChannel<RemoteAgentConnectionContext> {

	private _lastReqId = 0;
	private readonly _pendingCommands = new Map<number, {
		resolve: (value: unknown) => void;
		reject: (err?: unknown) => void;
		uriTransformer: IURITransformer;
	}>();

	private readonly _onExecuteCommand = this._register(new Emitter<{ reqId: number; persistentProcessId: number; commandId: string; commandArgs: unknown[] }>());
	readonly onExecuteCommand = this._onExecuteCommand.event;

	constructor(
		private readonly _environmentService: IServerEnvironmentService,
		private readonly _logService: ILogService,
		private readonly _ptyHostService: IPtyHostService,
		private readonly _productService: IProductService,
		private readonly _extensionManagementService: IExtensionManagementService,
		private readonly _configurationService: IConfigurationService
	) {
		super();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async call(ctx: RemoteAgentConnectionContext, command: RemoteTerminalChannelRequest, args?: any): Promise<any> {
		switch (command) {
			case RemoteTerminalChannelRequest.RestartPtyHost: return this._ptyHostService.restartPtyHost.apply(this._ptyHostService, args);

			case RemoteTerminalChannelRequest.CreateProcess: {
				const uriTransformer = createURITransformer(ctx.remoteAuthority);
				return this._createProcess(uriTransformer, <ICreateTerminalProcessArguments>args);
			}
			case RemoteTerminalChannelRequest.AttachToProcess: return this._ptyHostService.attachToProcess.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.DetachFromProcess: return this._ptyHostService.detachFromProcess.apply(this._ptyHostService, args);

			case RemoteTerminalChannelRequest.ListProcesses: return this._ptyHostService.listProcesses.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.GetLatency: return this._ptyHostService.getLatency.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.GetPerformanceMarks: return this._ptyHostService.getPerformanceMarks.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.OrphanQuestionReply: return this._ptyHostService.orphanQuestionReply.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.AcceptPtyHostResolvedVariables: return this._ptyHostService.acceptPtyHostResolvedVariables.apply(this._ptyHostService, args);

			case RemoteTerminalChannelRequest.Start: return this._ptyHostService.start.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.Input: return this._ptyHostService.input.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.SendSignal: return this._ptyHostService.sendSignal.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.AcknowledgeDataEvent: return this._ptyHostService.acknowledgeDataEvent.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.Shutdown: return this._ptyHostService.shutdown.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.Resize: return this._ptyHostService.resize.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.ClearBuffer: return this._ptyHostService.clearBuffer.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.GetInitialCwd: return this._ptyHostService.getInitialCwd.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.GetCwd: return this._ptyHostService.getCwd.apply(this._ptyHostService, args);

			case RemoteTerminalChannelRequest.ProcessBinary: return this._ptyHostService.processBinary.apply(this._ptyHostService, args);

			case RemoteTerminalChannelRequest.SendCommandResult: return this._sendCommandResult(args[0], args[1], args[2]);
			case RemoteTerminalChannelRequest.InstallAutoReply: return this._ptyHostService.installAutoReply.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.UninstallAllAutoReplies: return this._ptyHostService.uninstallAllAutoReplies.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.GetDefaultSystemShell: return this._getDefaultSystemShell.apply(this, args);
			case RemoteTerminalChannelRequest.GetProfiles: return this._getProfiles.apply(this, args);
			case RemoteTerminalChannelRequest.GetEnvironment: return this._getEnvironment();
			case RemoteTerminalChannelRequest.GetWslPath: return this._getWslPath(args[0], args[1]);
			case RemoteTerminalChannelRequest.GetTerminalLayoutInfo: return this._ptyHostService.getTerminalLayoutInfo(<IGetTerminalLayoutInfoArgs>args);
			case RemoteTerminalChannelRequest.SetTerminalLayoutInfo: return this._ptyHostService.setTerminalLayoutInfo(<ISetTerminalLayoutInfoArgs>args);
			case RemoteTerminalChannelRequest.SerializeTerminalState: return this._ptyHostService.serializeTerminalState.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.ReviveTerminalProcesses: return this._ptyHostService.reviveTerminalProcesses.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.GetRevivedPtyNewId: return this._ptyHostService.getRevivedPtyNewId.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.SetUnicodeVersion: return this._ptyHostService.setUnicodeVersion.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.SetNextCommandId: return this._ptyHostService.setNextCommandId.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.ReduceConnectionGraceTime: return this._reduceConnectionGraceTime();
			case RemoteTerminalChannelRequest.UpdateIcon: return this._ptyHostService.updateIcon.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.UpdateTitle: return this._ptyHostService.updateTitle.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.UpdateProperty: return this._ptyHostService.updateProperty.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.RefreshProperty: return this._ptyHostService.refreshProperty.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.RequestDetachInstance: return this._ptyHostService.requestDetachInstance(args[0], args[1]);
			case RemoteTerminalChannelRequest.AcceptDetachedInstance: return this._ptyHostService.acceptDetachInstanceReply(args[0], args[1]);
			case RemoteTerminalChannelRequest.FreePortKillProcess: return this._ptyHostService.freePortKillProcess.apply(this._ptyHostService, args);
			case RemoteTerminalChannelRequest.AcceptDetachInstanceReply: return this._ptyHostService.acceptDetachInstanceReply.apply(this._ptyHostService, args);
		}

		// @ts-expect-error Assert command is the `never` type to ensure all messages are handled
		throw new Error(`IPC Command ${command} not found`);
	}

	listen<T>(_: unknown, event: RemoteTerminalChannelEvent, _arg: unknown): Event<T> {
		switch (event) {
			case RemoteTerminalChannelEvent.OnPtyHostExitEvent: return (this._ptyHostService.onPtyHostExit || Event.None) as Event<T>;
			case RemoteTerminalChannelEvent.OnPtyHostStartEvent: return (this._ptyHostService.onPtyHostStart || Event.None) as Event<T>;
			case RemoteTerminalChannelEvent.OnPtyHostUnresponsiveEvent: return (this._ptyHostService.onPtyHostUnresponsive || Event.None) as Event<T>;
			case RemoteTerminalChannelEvent.OnPtyHostResponsiveEvent: return (this._ptyHostService.onPtyHostResponsive || Event.None) as Event<T>;
			case RemoteTerminalChannelEvent.OnPtyHostRequestResolveVariablesEvent: return (this._ptyHostService.onPtyHostRequestResolveVariables || Event.None) as Event<T>;
			case RemoteTerminalChannelEvent.OnProcessDataEvent: return (this._ptyHostService.onProcessData) as Event<T>;
			case RemoteTerminalChannelEvent.OnProcessReadyEvent: return (this._ptyHostService.onProcessReady) as Event<T>;
			case RemoteTerminalChannelEvent.OnProcessExitEvent: return (this._ptyHostService.onProcessExit) as Event<T>;
			case RemoteTerminalChannelEvent.OnProcessReplayEvent: return (this._ptyHostService.onProcessReplay) as Event<T>;
			case RemoteTerminalChannelEvent.OnProcessOrphanQuestion: return (this._ptyHostService.onProcessOrphanQuestion) as Event<T>;
			case RemoteTerminalChannelEvent.OnExecuteCommand: return (this.onExecuteCommand) as Event<T>;
			case RemoteTerminalChannelEvent.OnDidRequestDetach: return (this._ptyHostService.onDidRequestDetach || Event.None) as Event<T>;
			case RemoteTerminalChannelEvent.OnDidChangeProperty: return (this._ptyHostService.onDidChangeProperty) as Event<T>;
		}

		// @ts-expect-error Assert event is the `never` type to ensure all messages are handled
		throw new Error(`IPC Command ${event} not found`);
	}

	private async _createProcess(uriTransformer: IURITransformer, args: ICreateTerminalProcessArguments): Promise<ICreateTerminalProcessResult> {
		const shellLaunchConfig: IShellLaunchConfig = {
			name: args.shellLaunchConfig.name,
			executable: args.shellLaunchConfig.executable,
			args: args.shellLaunchConfig.args,
			cwd: (
				typeof args.shellLaunchConfig.cwd === 'string' || typeof args.shellLaunchConfig.cwd === 'undefined'
					? args.shellLaunchConfig.cwd
					: URI.revive(uriTransformer.transformIncoming(args.shellLaunchConfig.cwd))
			),
			env: args.shellLaunchConfig.env,
			useShellEnvironment: args.shellLaunchConfig.useShellEnvironment,
			reconnectionProperties: args.shellLaunchConfig.reconnectionProperties,
			type: args.shellLaunchConfig.type,
			isFeatureTerminal: args.shellLaunchConfig.isFeatureTerminal,
			tabActions: args.shellLaunchConfig.tabActions,
			shellIntegrationEnvironmentReporting: args.shellLaunchConfig.shellIntegrationEnvironmentReporting,
		};


		const baseEnv = await buildUserEnvironment(args.resolverEnv, !!args.shellLaunchConfig.useShellEnvironment, platform.language, this._environmentService, this._logService, this._configurationService);
		this._logService.trace('baseEnv', baseEnv);

		const reviveWorkspaceFolder = (workspaceData: IWorkspaceFolderData): IWorkspaceFolder => {
			return {
				uri: URI.revive(uriTransformer.transformIncoming(workspaceData.uri)),
				name: workspaceData.name,
				index: workspaceData.index,
				toResource: () => {
					throw new Error('Not implemented');
				}
			};
		};
		const workspaceFolders = args.workspaceFolders.map(reviveWorkspaceFolder);
		const activeWorkspaceFolder = args.activeWorkspaceFolder ? reviveWorkspaceFolder(args.activeWorkspaceFolder) : undefined;
		const activeFileResource = args.activeFileResource ? URI.revive(uriTransformer.transformIncoming(args.activeFileResource)) : undefined;
		const customVariableResolver = new CustomVariableResolver(baseEnv, workspaceFolders, activeFileResource, args.resolvedVariables, this._extensionManagementService);
		const variableResolver = terminalEnvironment.createVariableResolver(activeWorkspaceFolder, process.env, customVariableResolver);

		// Get the initial cwd
		const initialCwd = await terminalEnvironment.getCwd(shellLaunchConfig, os.homedir(), variableResolver, activeWorkspaceFolder?.uri, args.configuration['terminal.integrated.cwd'], this._logService);
		shellLaunchConfig.cwd = initialCwd;

		const envPlatformKey = platform.isWindows ? 'terminal.integrated.env.windows' : (platform.isMacintosh ? 'terminal.integrated.env.osx' : 'terminal.integrated.env.linux');
		const envFromConfig = args.configuration[envPlatformKey];
		const env = await terminalEnvironment.createTerminalEnvironment(
			shellLaunchConfig,
			envFromConfig,
			variableResolver,
			this._productService.version,
			args.configuration['terminal.integrated.detectLocale'],
			baseEnv
		);

		// Apply extension environment variable collections to the environment
		if (shouldUseEnvironmentVariableCollection(shellLaunchConfig)) {
			const entries: [string, IEnvironmentVariableCollection][] = [];
			for (const [k, v, d] of args.envVariableCollections) {
				entries.push([k, { map: deserializeEnvironmentVariableCollection(v), descriptionMap: deserializeEnvironmentDescriptionMap(d) }]);
			}
			const envVariableCollections = new Map<string, IEnvironmentVariableCollection>(entries);
			const mergedCollection = new MergedEnvironmentVariableCollection(envVariableCollections);
			const workspaceFolder = activeWorkspaceFolder ? activeWorkspaceFolder ?? undefined : undefined;
			await mergedCollection.applyToProcessEnvironment(env, { workspaceFolder }, variableResolver);
		}

		// Fork the process and listen for messages
		this._logService.debug(`Terminal process launching on remote agent`, { shellLaunchConfig, initialCwd, cols: args.cols, rows: args.rows, env });

		// Setup the CLI server to support forwarding commands run from the CLI
		const ipcHandlePath = createRandomIPCHandle();
		env.VSCODE_IPC_HOOK_CLI = ipcHandlePath;

		const persistentProcessId = await this._ptyHostService.createProcess(shellLaunchConfig, initialCwd, args.cols, args.rows, args.unicodeVersion, env, baseEnv, args.options, args.shouldPersistTerminal, args.workspaceId, args.workspaceName);
		const commandsExecuter: ICommandsExecuter = {
			executeCommand: <T>(id: string, ...args: unknown[]): Promise<T> => this._executeCommand(persistentProcessId, id, args, uriTransformer)
		};
		const cliServer = new CLIServerBase(commandsExecuter, this._logService, ipcHandlePath);
		this._ptyHostService.onProcessExit(e => e.id === persistentProcessId && cliServer.dispose());

		return {
			persistentTerminalId: persistentProcessId,
			resolvedShellLaunchConfig: shellLaunchConfig
		};
	}

	private _executeCommand<T>(persistentProcessId: number, commandId: string, commandArgs: unknown[], uriTransformer: IURITransformer): Promise<T> {
		const { resolve, reject, promise } = promiseWithResolvers<T>();

		const reqId = ++this._lastReqId;
		this._pendingCommands.set(reqId, { resolve: resolve as (value: unknown) => void, reject, uriTransformer });

		const serializedCommandArgs = cloneAndChange(commandArgs, (obj) => {
			if (obj && obj.$mid === 1) {
				// this is UriComponents
				return uriTransformer.transformOutgoing(obj);
			}
			if (obj && obj instanceof URI) {
				return uriTransformer.transformOutgoingURI(obj);
			}
			return undefined;
		});
		this._onExecuteCommand.fire({
			reqId,
			persistentProcessId,
			commandId,
			commandArgs: serializedCommandArgs
		});

		return promise;
	}

	private _sendCommandResult(reqId: number, isError: boolean, serializedPayload: unknown): void {
		const data = this._pendingCommands.get(reqId);
		if (!data) {
			return;
		}
		this._pendingCommands.delete(reqId);
		const payload = cloneAndChange(serializedPayload, (obj) => {
			if (obj && obj.$mid === 1) {
				// this is UriComponents
				return data.uriTransformer.transformIncoming(obj);
			}
			return undefined;
		});
		if (isError) {
			data.reject(payload);
		} else {
			data.resolve(payload);
		}
	}

	private _getDefaultSystemShell(osOverride?: platform.OperatingSystem): Promise<string> {
		return this._ptyHostService.getDefaultSystemShell(osOverride);
	}

	private async _getProfiles(workspaceId: string, profiles: unknown, defaultProfile: unknown, includeDetectedProfiles?: boolean): Promise<ITerminalProfile[]> {
		return this._ptyHostService.getProfiles(workspaceId, profiles, defaultProfile, includeDetectedProfiles) || [];
	}

	private _getEnvironment(): platform.IProcessEnvironment {
		return { ...process.env };
	}

	private _getWslPath(original: string, direction: 'unix-to-win' | 'win-to-unix'): Promise<string> {
		return this._ptyHostService.getWslPath(original, direction);
	}


	private _reduceConnectionGraceTime(): Promise<void> {
		return this._ptyHostService.reduceConnectionGraceTime();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/server/node/server.cli.ts]---
Location: vscode-main/src/vs/server/node/server.cli.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as url from 'url';
import * as cp from 'child_process';
import * as http from 'http';
import { cwd } from '../../base/common/process.js';
import { dirname, extname, resolve, join } from '../../base/common/path.js';
import { parseArgs, buildHelpMessage, buildVersionMessage, OPTIONS, OptionDescriptions, ErrorReporter } from '../../platform/environment/node/argv.js';
import { NativeParsedArgs } from '../../platform/environment/common/argv.js';
import { createWaitMarkerFileSync } from '../../platform/environment/node/wait.js';
import { PipeCommand } from '../../workbench/api/node/extHostCLIServer.js';
import { hasStdinWithoutTty, getStdinFilePath, readFromStdin } from '../../platform/environment/node/stdin.js';
import { DeferredPromise } from '../../base/common/async.js';
import { FileAccess } from '../../base/common/network.js';

/*
 * Implements a standalone CLI app that opens VS Code from a remote terminal.
 *  - In integrated terminals for remote windows this connects to the remote server though a pipe.
 *    The pipe is passed in env VSCODE_IPC_HOOK_CLI.
 *  - In external terminals for WSL this calls VS Code on the Windows side.
 *    The VS Code desktop executable path is passed in env VSCODE_CLIENT_COMMAND.
 */


interface ProductDescription {
	productName: string;
	version: string;
	commit: string;
	executableName: string;
}

interface RemoteParsedArgs extends NativeParsedArgs { 'gitCredential'?: string; 'openExternal'?: boolean }


const isSupportedForCmd = (optionId: keyof RemoteParsedArgs) => {
	switch (optionId) {
		case 'user-data-dir':
		case 'extensions-dir':
		case 'export-default-configuration':
		case 'install-source':
		case 'enable-smoke-test-driver':
		case 'extensions-download-dir':
		case 'builtin-extensions-dir':
		case 'telemetry':
			return false;
		default:
			return true;
	}
};

const isSupportedForPipe = (optionId: keyof RemoteParsedArgs) => {
	switch (optionId) {
		case 'version':
		case 'help':
		case 'folder-uri':
		case 'file-uri':
		case 'add':
		case 'diff':
		case 'merge':
		case 'wait':
		case 'goto':
		case 'reuse-window':
		case 'new-window':
		case 'status':
		case 'install-extension':
		case 'uninstall-extension':
		case 'update-extensions':
		case 'list-extensions':
		case 'force':
		case 'do-not-include-pack-dependencies':
		case 'show-versions':
		case 'category':
		case 'verbose':
		case 'remote':
		case 'locate-shell-integration-path':
			return true;
		default:
			return false;
	}
};

const cliPipe = process.env['VSCODE_IPC_HOOK_CLI'] as string;
const cliCommand = process.env['VSCODE_CLIENT_COMMAND'] as string;
const cliCommandCwd = process.env['VSCODE_CLIENT_COMMAND_CWD'] as string;
const cliRemoteAuthority = process.env['VSCODE_CLI_AUTHORITY'] as string;
const cliStdInFilePath = process.env['VSCODE_STDIN_FILE_PATH'] as string;

export async function main(desc: ProductDescription, args: string[]): Promise<void> {
	if (!cliPipe && !cliCommand) {
		console.log('Command is only available in WSL or inside a Visual Studio Code terminal.');
		return;
	}

	// take the local options and remove the ones that don't apply
	const options: OptionDescriptions<Required<RemoteParsedArgs>> = { ...OPTIONS, gitCredential: { type: 'string' }, openExternal: { type: 'boolean' } };
	const isSupported = cliCommand ? isSupportedForCmd : isSupportedForPipe;
	for (const optionId in OPTIONS) {
		const optId = <keyof RemoteParsedArgs>optionId;
		if (!isSupported(optId)) {
			delete options[optId];
		}
	}

	if (cliPipe) {
		options['openExternal'] = { type: 'boolean' };
	}

	const errorReporter: ErrorReporter = {
		onMultipleValues: (id: string, usedValue: string) => {
			console.error(`Option '${id}' can only be defined once. Using value ${usedValue}.`);
		},
		onEmptyValue: (id) => {
			console.error(`Ignoring option '${id}': Value must not be empty.`);
		},
		onUnknownOption: (id: string) => {
			console.error(`Ignoring option '${id}': not supported for ${desc.executableName}.`);
		},
		onDeprecatedOption: (deprecatedOption: string, message: string) => {
			console.warn(`Option '${deprecatedOption}' is deprecated: ${message}`);
		}
	};

	const parsedArgs = parseArgs(args, options, errorReporter);
	const mapFileUri = cliRemoteAuthority ? mapFileToRemoteUri : (uri: string) => uri;

	const verbose = !!parsedArgs['verbose'];

	if (parsedArgs.help) {
		console.log(buildHelpMessage(desc.productName, desc.executableName, desc.version, options));
		return;
	}
	if (parsedArgs.version) {
		console.log(buildVersionMessage(desc.version, desc.commit));
		return;
	}
	if (parsedArgs['locate-shell-integration-path']) {
		let file: string;
		switch (parsedArgs['locate-shell-integration-path']) {
			// Usage: `[[ "$TERM_PROGRAM" == "vscode" ]] && . "$(code --locate-shell-integration-path bash)"`
			case 'bash': file = 'shellIntegration-bash.sh'; break;
			// Usage: `if ($env:TERM_PROGRAM -eq "vscode") { . "$(code --locate-shell-integration-path pwsh)" }`
			case 'pwsh': file = 'shellIntegration.ps1'; break;
			// Usage: `[[ "$TERM_PROGRAM" == "vscode" ]] && . "$(code --locate-shell-integration-path zsh)"`
			case 'zsh': file = 'shellIntegration-rc.zsh'; break;
			// Usage: `string match -q "$TERM_PROGRAM" "vscode"; and . (code --locate-shell-integration-path fish)`
			case 'fish': file = 'shellIntegration.fish'; break;
			default: throw new Error('Error using --locate-shell-integration-path: Invalid shell type');
		}
		console.log(join(getAppRoot(), 'out', 'vs', 'workbench', 'contrib', 'terminal', 'common', 'scripts', file));
		return;
	}
	if (cliPipe) {
		if (parsedArgs['openExternal']) {
			await openInBrowser(parsedArgs['_'], verbose);
			return;
		}
	}

	let remote: string | null | undefined = parsedArgs.remote;
	if (remote === 'local' || remote === 'false' || remote === '') {
		remote = null; // null represent a local window
	}

	const folderURIs = (parsedArgs['folder-uri'] || []).map(mapFileUri);
	parsedArgs['folder-uri'] = folderURIs;

	const fileURIs = (parsedArgs['file-uri'] || []).map(mapFileUri);
	parsedArgs['file-uri'] = fileURIs;

	const inputPaths = parsedArgs['_'];
	let hasReadStdinArg = false;
	for (const input of inputPaths) {
		if (input === '-') {
			hasReadStdinArg = true;
		} else {
			translatePath(input, mapFileUri, folderURIs, fileURIs);
		}
	}

	parsedArgs['_'] = [];

	let readFromStdinPromise: Promise<void> | undefined;
	let stdinFilePath: string | undefined;

	if (hasReadStdinArg && hasStdinWithoutTty()) {
		try {
			stdinFilePath = cliStdInFilePath;
			if (!stdinFilePath) {
				stdinFilePath = getStdinFilePath();
				const readFromStdinDone = new DeferredPromise<void>();
				await readFromStdin(stdinFilePath, verbose, () => readFromStdinDone.complete()); // throws error if file can not be written
				if (!parsedArgs.wait) {
					// if `--wait` is not provided, we keep this process alive
					// for at least as long as the stdin stream is open to
					// ensure that we read all the data.
					readFromStdinPromise = readFromStdinDone.p;
				}
			}

			// Make sure to open tmp file
			translatePath(stdinFilePath, mapFileUri, folderURIs, fileURIs);

			// Ignore adding this to history
			parsedArgs['skip-add-to-recently-opened'] = true;

			console.log(`Reading from stdin via: ${stdinFilePath}`);
		} catch (e) {
			console.log(`Failed to create file to read via stdin: ${e.toString()}`);
		}
	}

	if (parsedArgs.extensionDevelopmentPath) {
		parsedArgs.extensionDevelopmentPath = parsedArgs.extensionDevelopmentPath.map(p => mapFileUri(pathToURI(p).href));
	}

	if (parsedArgs.extensionTestsPath) {
		parsedArgs.extensionTestsPath = mapFileUri(pathToURI(parsedArgs['extensionTestsPath']).href);
	}

	const crashReporterDirectory = parsedArgs['crash-reporter-directory'];
	if (crashReporterDirectory !== undefined && !crashReporterDirectory.match(/^([a-zA-Z]:[\\\/])/)) {
		console.log(`The crash reporter directory '${crashReporterDirectory}' must be an absolute Windows path (e.g. c:/crashes)`);
		return;
	}

	if (cliCommand) {
		if (parsedArgs['install-extension'] !== undefined || parsedArgs['uninstall-extension'] !== undefined || parsedArgs['list-extensions'] || parsedArgs['update-extensions']) {
			const cmdLine: string[] = [];
			parsedArgs['install-extension']?.forEach(id => cmdLine.push('--install-extension', id));
			parsedArgs['uninstall-extension']?.forEach(id => cmdLine.push('--uninstall-extension', id));
			['list-extensions', 'force', 'show-versions', 'category'].forEach(opt => {
				const value = parsedArgs[<keyof NativeParsedArgs>opt];
				if (value !== undefined) {
					cmdLine.push(`--${opt}=${value}`);
				}
			});
			if (parsedArgs['update-extensions']) {
				cmdLine.push('--update-extensions');
			}

			const childProcess = cp.fork(FileAccess.asFileUri('server-main').fsPath, cmdLine, { stdio: 'inherit' });
			childProcess.on('error', err => console.log(err));
			return;
		}

		const newCommandline: string[] = [];
		for (const key in parsedArgs) {
			const val = parsedArgs[key as keyof typeof parsedArgs];
			if (typeof val === 'boolean') {
				if (val) {
					newCommandline.push('--' + key);
				}
			} else if (Array.isArray(val)) {
				for (const entry of val) {
					newCommandline.push(`--${key}=${entry.toString()}`);
				}
			} else if (val) {
				newCommandline.push(`--${key}=${val.toString()}`);
			}
		}
		if (remote !== null) {
			newCommandline.push(`--remote=${remote || cliRemoteAuthority}`);
		}

		const ext = extname(cliCommand);
		if (ext === '.bat' || ext === '.cmd') {
			const processCwd = cliCommandCwd || cwd();
			if (verbose) {
				console.log(`Invoking: cmd.exe /C ${cliCommand} ${newCommandline.join(' ')} in ${processCwd}`);
			}
			cp.spawn('cmd.exe', ['/C', cliCommand, ...newCommandline], {
				stdio: 'inherit',
				cwd: processCwd
			});
		} else {
			const cliCwd = dirname(cliCommand);
			const env = { ...process.env, ELECTRON_RUN_AS_NODE: '1' };
			const versionFolder = desc.commit.substring(0, 10);
			if (fs.existsSync(join(cliCwd, versionFolder))) {
				newCommandline.unshift(`${versionFolder}/resources/app/out/cli.js`);
			} else {
				newCommandline.unshift('resources/app/out/cli.js');
			}
			if (verbose) {
				console.log(`Invoking: cd "${cliCwd}" && ELECTRON_RUN_AS_NODE=1 "${cliCommand}" "${newCommandline.join('" "')}"`);
			}
			if (runningInWSL2()) {
				if (verbose) {
					console.log(`Using pipes for output.`);
				}
				const childProcess = cp.spawn(cliCommand, newCommandline, { cwd: cliCwd, env, stdio: ['inherit', 'pipe', 'pipe'] });
				childProcess.stdout.on('data', data => process.stdout.write(data));
				childProcess.stderr.on('data', data => process.stderr.write(data));
			} else {
				cp.spawn(cliCommand, newCommandline, { cwd: cliCwd, env, stdio: 'inherit' });
			}
		}
	} else {
		if (parsedArgs.status) {
			await sendToPipe({
				type: 'status'
			}, verbose).then((res: string) => {
				console.log(res);
			}).catch(e => {
				console.error('Error when requesting status:', e);
			});
			return;
		}

		if (parsedArgs['install-extension'] !== undefined || parsedArgs['uninstall-extension'] !== undefined || parsedArgs['list-extensions'] || parsedArgs['update-extensions']) {
			await sendToPipe({
				type: 'extensionManagement',
				list: parsedArgs['list-extensions'] ? { showVersions: parsedArgs['show-versions'], category: parsedArgs['category'] } : undefined,
				install: asExtensionIdOrVSIX(parsedArgs['install-extension']),
				uninstall: asExtensionIdOrVSIX(parsedArgs['uninstall-extension']),
				force: parsedArgs['force']
			}, verbose).then((res: string) => {
				console.log(res);
			}).catch(e => {
				console.error('Error when invoking the extension management command:', e);
			});
			return;
		}

		let waitMarkerFilePath: string | undefined = undefined;
		if (parsedArgs['wait']) {
			if (!fileURIs.length) {
				console.log('At least one file must be provided to wait for.');
				return;
			}
			waitMarkerFilePath = createWaitMarkerFileSync(verbose);
		}

		await sendToPipe({
			type: 'open',
			fileURIs,
			folderURIs,
			diffMode: parsedArgs.diff,
			mergeMode: parsedArgs.merge,
			addMode: parsedArgs.add,
			removeMode: parsedArgs.remove,
			gotoLineMode: parsedArgs.goto,
			forceReuseWindow: parsedArgs['reuse-window'],
			forceNewWindow: parsedArgs['new-window'],
			waitMarkerFilePath,
			remoteAuthority: remote
		}, verbose).catch(e => {
			console.error('Error when invoking the open command:', e);
		});

		if (waitMarkerFilePath) {
			await waitForFileDeleted(waitMarkerFilePath);
		}

		if (readFromStdinPromise) {
			await readFromStdinPromise;

		}

		if (waitMarkerFilePath && stdinFilePath) {
			try {
				fs.unlinkSync(stdinFilePath);
			} catch (e) {
				//ignore
			}
		}
	}

}

function runningInWSL2(): boolean {
	if (!!process.env['WSL_DISTRO_NAME']) {
		try {
			return cp.execSync('uname -r', { encoding: 'utf8' }).includes('-microsoft-');
		} catch (_e) {
			// Ignore
		}
	}
	return false;
}

async function waitForFileDeleted(path: string) {
	while (fs.existsSync(path)) {
		await new Promise(res => setTimeout(res, 1000));
	}
}

async function openInBrowser(args: string[], verbose: boolean) {
	const uris: string[] = [];
	for (const location of args) {
		try {
			if (/^[a-z-]+:\/\/.+/.test(location)) {
				uris.push(url.parse(location).href);
			} else {
				uris.push(pathToURI(location).href);
			}
		} catch (e) {
			console.log(`Invalid url: ${location}`);
		}
	}
	if (uris.length) {
		await sendToPipe({
			type: 'openExternal',
			uris
		}, verbose).catch(e => {
			console.error('Error when invoking the open external command:', e);
		});
	}
}

function sendToPipe(args: PipeCommand, verbose: boolean): Promise<string> {
	if (verbose) {
		console.log(JSON.stringify(args, null, '  '));
	}
	return new Promise<string>((resolve, reject) => {
		const message = JSON.stringify(args);
		if (!cliPipe) {
			console.log('Message ' + message);
			resolve('');
			return;
		}

		const opts: http.RequestOptions = {
			socketPath: cliPipe,
			path: '/',
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'accept': 'application/json'
			}
		};

		const req = http.request(opts, res => {
			if (res.headers['content-type'] !== 'application/json') {
				reject('Error in response: Invalid content type: Expected \'application/json\', is: ' + res.headers['content-type']);
				return;
			}

			const chunks: string[] = [];
			res.setEncoding('utf8');
			res.on('data', chunk => {
				chunks.push(chunk);
			});
			res.on('error', (err) => fatal('Error in response.', err));
			res.on('end', () => {
				const content = chunks.join('');
				try {
					const obj = JSON.parse(content);
					if (res.statusCode === 200) {
						resolve(obj);
					} else {
						reject(obj);
					}
				} catch (e) {
					reject('Error in response: Unable to parse response as JSON: ' + content);
				}
			});
		});

		req.on('error', (err) => fatal('Error in request.', err));
		req.write(message);
		req.end();
	});
}

function asExtensionIdOrVSIX(inputs: string[] | undefined) {
	return inputs?.map(input => /\.vsix$/i.test(input) ? pathToURI(input).href : input);
}

function fatal(message: string, err: unknown): void {
	console.error('Unable to connect to VS Code server: ' + message);
	console.error(err);
	process.exit(1);
}

const preferredCwd = process.env.PWD || cwd(); // prefer process.env.PWD as it does not follow symlinks

function pathToURI(input: string): url.URL {
	input = input.trim();
	input = resolve(preferredCwd, input);

	return url.pathToFileURL(input);
}

function translatePath(input: string, mapFileUri: (input: string) => string, folderURIS: string[], fileURIS: string[]) {
	const url = pathToURI(input);
	const mappedUri = mapFileUri(url.href);
	try {
		const stat = fs.lstatSync(fs.realpathSync(input));

		if (stat.isFile()) {
			fileURIS.push(mappedUri);
		} else if (stat.isDirectory()) {
			folderURIS.push(mappedUri);
		} else if (input === '/dev/null') {
			// handle /dev/null passed to us by external tools such as `git difftool`
			fileURIS.push(mappedUri);
		}
	} catch (e) {
		if (e.code === 'ENOENT') {
			fileURIS.push(mappedUri);
		} else {
			console.log(`Problem accessing file ${input}. Ignoring file`, e);
		}
	}
}

function mapFileToRemoteUri(uri: string): string {
	return uri.replace(/^file:\/\//, 'vscode-remote://' + cliRemoteAuthority);
}

function getAppRoot() {
	return dirname(FileAccess.asFileUri('').fsPath);
}

const [, , productName, version, commit, executableName, ...remainingArgs] = process.argv;
main({ productName, version, commit, executableName }, remainingArgs).then(null, err => {
	console.error(err.message || err.stack || err);
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/server/node/server.main.ts]---
Location: vscode-main/src/vs/server/node/server.main.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as os from 'os';
import * as fs from 'fs';
import * as net from 'net';
import { FileAccess } from '../../base/common/network.js';
import { run as runCli } from './remoteExtensionHostAgentCli.js';
import { createServer as doCreateServer, IServerAPI } from './remoteExtensionHostAgentServer.js';
import { parseArgs, ErrorReporter } from '../../platform/environment/node/argv.js';
import { join, dirname } from '../../base/common/path.js';
import { performance } from 'perf_hooks';
import { serverOptions } from './serverEnvironmentService.js';
import product from '../../platform/product/common/product.js';
import * as perf from '../../base/common/performance.js';

perf.mark('code/server/codeLoaded');
(global as unknown as { vscodeServerCodeLoadedTime?: number }).vscodeServerCodeLoadedTime = performance.now();

const errorReporter: ErrorReporter = {
	onMultipleValues: (id: string, usedValue: string) => {
		console.error(`Option '${id}' can only be defined once. Using value ${usedValue}.`);
	},
	onEmptyValue: (id) => {
		console.error(`Ignoring option '${id}': Value must not be empty.`);
	},
	onUnknownOption: (id: string) => {
		console.error(`Ignoring option '${id}': not supported for server.`);
	},
	onDeprecatedOption: (deprecatedOption: string, message) => {
		console.warn(`Option '${deprecatedOption}' is deprecated: ${message}`);
	}
};

const args = parseArgs(process.argv.slice(2), serverOptions, errorReporter);

const REMOTE_DATA_FOLDER = args['server-data-dir'] || process.env['VSCODE_AGENT_FOLDER'] || join(os.homedir(), product.serverDataFolderName || '.vscode-remote');
const USER_DATA_PATH = join(REMOTE_DATA_FOLDER, 'data');
const APP_SETTINGS_HOME = join(USER_DATA_PATH, 'User');
const GLOBAL_STORAGE_HOME = join(APP_SETTINGS_HOME, 'globalStorage');
const LOCAL_HISTORY_HOME = join(APP_SETTINGS_HOME, 'History');
const MACHINE_SETTINGS_HOME = join(USER_DATA_PATH, 'Machine');
args['user-data-dir'] = USER_DATA_PATH;
const APP_ROOT = dirname(FileAccess.asFileUri('').fsPath);
const BUILTIN_EXTENSIONS_FOLDER_PATH = join(APP_ROOT, 'extensions');
args['builtin-extensions-dir'] = BUILTIN_EXTENSIONS_FOLDER_PATH;
args['extensions-dir'] = args['extensions-dir'] || join(REMOTE_DATA_FOLDER, 'extensions');

[REMOTE_DATA_FOLDER, args['extensions-dir'], USER_DATA_PATH, APP_SETTINGS_HOME, MACHINE_SETTINGS_HOME, GLOBAL_STORAGE_HOME, LOCAL_HISTORY_HOME].forEach(f => {
	try {
		if (!fs.existsSync(f)) {
			fs.mkdirSync(f, { mode: 0o700, recursive: true });
		}
	} catch (err) { console.error(err); }
});

/**
 * invoked by server-main.js
 */
export function spawnCli() {
	runCli(args, REMOTE_DATA_FOLDER, serverOptions);
}

/**
 * invoked by server-main.js
 */
export function createServer(address: string | net.AddressInfo | null): Promise<IServerAPI> {
	return doCreateServer(address, args, REMOTE_DATA_FOLDER);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/server/node/serverConnectionToken.ts]---
Location: vscode-main/src/vs/server/node/serverConnectionToken.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as cookie from 'cookie';
import * as fs from 'fs';
import * as http from 'http';
import * as url from 'url';
import * as path from '../../base/common/path.js';
import { generateUuid } from '../../base/common/uuid.js';
import { connectionTokenCookieName, connectionTokenQueryName } from '../../base/common/network.js';
import { ServerParsedArgs } from './serverEnvironmentService.js';
import { Promises } from '../../base/node/pfs.js';

const connectionTokenRegex = /^[0-9A-Za-z_-]+$/;

export const enum ServerConnectionTokenType {
	None,
	Optional,// TODO: Remove this soon
	Mandatory
}

export class NoneServerConnectionToken {
	public readonly type = ServerConnectionTokenType.None;

	public validate(connectionToken: unknown): boolean {
		return true;
	}
}

export class MandatoryServerConnectionToken {
	public readonly type = ServerConnectionTokenType.Mandatory;

	constructor(public readonly value: string) {
	}

	public validate(connectionToken: unknown): boolean {
		return (connectionToken === this.value);
	}
}

export type ServerConnectionToken = NoneServerConnectionToken | MandatoryServerConnectionToken;

export class ServerConnectionTokenParseError {
	constructor(
		public readonly message: string
	) { }
}

export async function parseServerConnectionToken(args: ServerParsedArgs, defaultValue: () => Promise<string>): Promise<ServerConnectionToken | ServerConnectionTokenParseError> {
	const withoutConnectionToken = args['without-connection-token'];
	const connectionToken = args['connection-token'];
	const connectionTokenFile = args['connection-token-file'];

	if (withoutConnectionToken) {
		if (typeof connectionToken !== 'undefined' || typeof connectionTokenFile !== 'undefined') {
			return new ServerConnectionTokenParseError(`Please do not use the argument '--connection-token' or '--connection-token-file' at the same time as '--without-connection-token'.`);
		}
		return new NoneServerConnectionToken();
	}

	if (typeof connectionTokenFile !== 'undefined') {
		if (typeof connectionToken !== 'undefined') {
			return new ServerConnectionTokenParseError(`Please do not use the argument '--connection-token' at the same time as '--connection-token-file'.`);
		}

		let rawConnectionToken: string;
		try {
			rawConnectionToken = fs.readFileSync(connectionTokenFile).toString().replace(/\r?\n$/, '');
		} catch (e) {
			return new ServerConnectionTokenParseError(`Unable to read the connection token file at '${connectionTokenFile}'.`);
		}

		if (!connectionTokenRegex.test(rawConnectionToken)) {
			return new ServerConnectionTokenParseError(`The connection token defined in '${connectionTokenFile} does not adhere to the characters 0-9, a-z, A-Z, _, or -.`);
		}

		return new MandatoryServerConnectionToken(rawConnectionToken);
	}

	if (typeof connectionToken !== 'undefined') {
		if (!connectionTokenRegex.test(connectionToken)) {
			return new ServerConnectionTokenParseError(`The connection token '${connectionToken} does not adhere to the characters 0-9, a-z, A-Z or -.`);
		}

		return new MandatoryServerConnectionToken(connectionToken);
	}

	return new MandatoryServerConnectionToken(await defaultValue());
}

export async function determineServerConnectionToken(args: ServerParsedArgs): Promise<ServerConnectionToken | ServerConnectionTokenParseError> {
	const readOrGenerateConnectionToken = async () => {
		if (!args['user-data-dir']) {
			// No place to store it!
			return generateUuid();
		}
		const storageLocation = path.join(args['user-data-dir'], 'token');

		// First try to find a connection token
		try {
			const fileContents = await fs.promises.readFile(storageLocation);
			const connectionToken = fileContents.toString().replace(/\r?\n$/, '');
			if (connectionTokenRegex.test(connectionToken)) {
				return connectionToken;
			}
		} catch (err) { }

		// No connection token found, generate one
		const connectionToken = generateUuid();

		try {
			// Try to store it
			await Promises.writeFile(storageLocation, connectionToken, { mode: 0o600 });
		} catch (err) { }

		return connectionToken;
	};
	return parseServerConnectionToken(args, readOrGenerateConnectionToken);
}

export function requestHasValidConnectionToken(connectionToken: ServerConnectionToken, req: http.IncomingMessage, parsedUrl: url.UrlWithParsedQuery) {
	// First check if there is a valid query parameter
	if (connectionToken.validate(parsedUrl.query[connectionTokenQueryName])) {
		return true;
	}

	// Otherwise, check if there is a valid cookie
	const cookies = cookie.parse(req.headers.cookie || '');
	return connectionToken.validate(cookies[connectionTokenCookieName]);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/server/node/serverEnvironmentService.ts]---
Location: vscode-main/src/vs/server/node/serverEnvironmentService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../nls.js';

import { NativeEnvironmentService } from '../../platform/environment/node/environmentService.js';
import { OPTIONS, OptionDescriptions } from '../../platform/environment/node/argv.js';
import { refineServiceDecorator } from '../../platform/instantiation/common/instantiation.js';
import { IEnvironmentService, INativeEnvironmentService } from '../../platform/environment/common/environment.js';
import { memoize } from '../../base/common/decorators.js';
import { URI } from '../../base/common/uri.js';
import { joinPath } from '../../base/common/resources.js';
import { join } from '../../base/common/path.js';
import { ProtocolConstants } from '../../base/parts/ipc/common/ipc.net.js';

export const serverOptions: OptionDescriptions<Required<ServerParsedArgs>> = {

	/* ----- server setup ----- */

	'host': { type: 'string', cat: 'o', args: 'ip-address', description: nls.localize('host', "The host name or IP address the server should listen to. If not set, defaults to 'localhost'.") },
	'port': { type: 'string', cat: 'o', args: 'port | port range', description: nls.localize('port', "The port the server should listen to. If 0 is passed a random free port is picked. If a range in the format num-num is passed, a free port from the range (end inclusive) is selected.") },
	'socket-path': { type: 'string', cat: 'o', args: 'path', description: nls.localize('socket-path', "The path to a socket file for the server to listen to.") },
	'server-base-path': { type: 'string', cat: 'o', args: 'path', description: nls.localize('server-base-path', "The path under which the web UI and the code server is provided. Defaults to '/'.`") },
	'connection-token': { type: 'string', cat: 'o', args: 'token', deprecates: ['connectionToken'], description: nls.localize('connection-token', "A secret that must be included with all requests.") },
	'connection-token-file': { type: 'string', cat: 'o', args: 'path', deprecates: ['connection-secret', 'connectionTokenFile'], description: nls.localize('connection-token-file', "Path to a file that contains the connection token.") },
	'without-connection-token': { type: 'boolean', cat: 'o', description: nls.localize('without-connection-token', "Run without a connection token. Only use this if the connection is secured by other means.") },
	'disable-websocket-compression': { type: 'boolean' },
	'print-startup-performance': { type: 'boolean' },
	'print-ip-address': { type: 'boolean' },
	'accept-server-license-terms': { type: 'boolean', cat: 'o', description: nls.localize('acceptLicenseTerms', "If set, the user accepts the server license terms and the server will be started without a user prompt.") },
	'server-data-dir': { type: 'string', cat: 'o', description: nls.localize('serverDataDir', "Specifies the directory that server data is kept in.") },
	'telemetry-level': { type: 'string', cat: 'o', args: 'level', description: nls.localize('telemetry-level', "Sets the initial telemetry level. Valid levels are: 'off', 'crash', 'error' and 'all'. If not specified, the server will send telemetry until a client connects, it will then use the clients telemetry setting. Setting this to 'off' is equivalent to --disable-telemetry") },

	/* ----- vs code options ---	-- */

	'user-data-dir': OPTIONS['user-data-dir'],
	'enable-smoke-test-driver': OPTIONS['enable-smoke-test-driver'],
	'disable-telemetry': OPTIONS['disable-telemetry'],
	'disable-experiments': OPTIONS['disable-experiments'],
	'disable-workspace-trust': OPTIONS['disable-workspace-trust'],
	'file-watcher-polling': { type: 'string', deprecates: ['fileWatcherPolling'] },
	'log': OPTIONS['log'],
	'logsPath': OPTIONS['logsPath'],
	'force-disable-user-env': OPTIONS['force-disable-user-env'],
	'enable-proposed-api': OPTIONS['enable-proposed-api'],

	/* ----- vs code web options ----- */

	'folder': { type: 'string', deprecationMessage: 'No longer supported. Folder needs to be provided in the browser URL or with `default-folder`.' },
	'workspace': { type: 'string', deprecationMessage: 'No longer supported. Workspace needs to be provided in the browser URL or with `default-workspace`.' },

	'default-folder': { type: 'string', description: nls.localize('default-folder', 'The workspace folder to open when no input is specified in the browser URL. A relative or absolute path resolved against the current working directory.') },
	'default-workspace': { type: 'string', description: nls.localize('default-workspace', 'The workspace to open when no input is specified in the browser URL. A relative or absolute path resolved against the current working directory.') },

	'enable-sync': { type: 'boolean' },
	'github-auth': { type: 'string' },
	'use-test-resolver': { type: 'boolean' },

	/* ----- extension management ----- */

	'extensions-dir': OPTIONS['extensions-dir'],
	'extensions-download-dir': OPTIONS['extensions-download-dir'],
	'builtin-extensions-dir': OPTIONS['builtin-extensions-dir'],
	'install-extension': OPTIONS['install-extension'],
	'install-builtin-extension': OPTIONS['install-builtin-extension'],
	'update-extensions': OPTIONS['update-extensions'],
	'uninstall-extension': OPTIONS['uninstall-extension'],
	'list-extensions': OPTIONS['list-extensions'],
	'locate-extension': OPTIONS['locate-extension'],

	'show-versions': OPTIONS['show-versions'],
	'category': OPTIONS['category'],
	'force': OPTIONS['force'],
	'do-not-sync': OPTIONS['do-not-sync'],
	'do-not-include-pack-dependencies': OPTIONS['do-not-include-pack-dependencies'],
	'pre-release': OPTIONS['pre-release'],
	'start-server': { type: 'boolean', cat: 'e', description: nls.localize('start-server', "Start the server when installing or uninstalling extensions. To be used in combination with 'install-extension', 'install-builtin-extension' and 'uninstall-extension'.") },


	/* ----- remote development options ----- */

	'enable-remote-auto-shutdown': { type: 'boolean' },
	'remote-auto-shutdown-without-delay': { type: 'boolean' },
	'inspect-ptyhost': { type: 'string', allowEmptyValue: true },

	'use-host-proxy': { type: 'boolean' },
	'without-browser-env-var': { type: 'boolean' },
	'reconnection-grace-time': { type: 'string', cat: 'o', args: 'seconds', description: nls.localize('reconnection-grace-time', "Override the reconnection grace time window in seconds. Defaults to 10800 (3 hours).") },

	/* ----- server cli ----- */

	'help': OPTIONS['help'],
	'version': OPTIONS['version'],
	'locate-shell-integration-path': OPTIONS['locate-shell-integration-path'],

	'compatibility': { type: 'string' },

	_: OPTIONS['_']
};

export interface ServerParsedArgs {

	/* ----- server setup ----- */

	host?: string;
	/**
	 * A port or a port range
	 */
	port?: string;
	'socket-path'?: string;

	/**
	 * The path under which the web UI and the code server is provided.
	 * By defaults it is '/'.`
	 */
	'server-base-path'?: string;

	/**
	 * A secret token that must be provided by the web client with all requests.
	 * Use only `[0-9A-Za-z\-]`.
	 *
	 * By default, a UUID will be generated every time the server starts up.
	 *
	 * If the server is running on a multi-user system, then consider
	 * using `--connection-token-file` which has the advantage that the token cannot
	 * be seen by other users using `ps` or similar commands.
	 */
	'connection-token'?: string;
	/**
	 * A path to a filename which will be read on startup.
	 * Consider placing this file in a folder readable only by the same user (a `chmod 0700` directory).
	 *
	 * The contents of the file will be used as the connection token. Use only `[0-9A-Z\-]` as contents in the file.
	 * The file can optionally end in a `\n` which will be ignored.
	 *
	 * This secret must be communicated to any vscode instance via the resolver or embedder API.
	 */
	'connection-token-file'?: string;

	/**
	 * Run the server without a connection token
	 */
	'without-connection-token'?: boolean;

	'disable-websocket-compression'?: boolean;

	'print-startup-performance'?: boolean;
	'print-ip-address'?: boolean;

	'accept-server-license-terms': boolean;

	'server-data-dir'?: string;

	'telemetry-level'?: string;

	'disable-workspace-trust'?: boolean;

	/* ----- vs code options ----- */

	'user-data-dir'?: string;

	'enable-smoke-test-driver'?: boolean;

	'disable-telemetry'?: boolean;
	'disable-experiments'?: boolean;
	'file-watcher-polling'?: string;

	'log'?: string[];
	'logsPath'?: string;

	'force-disable-user-env'?: boolean;
	'enable-proposed-api'?: string[];

	/* ----- vs code web options ----- */

	'default-workspace'?: string;
	'default-folder'?: string;

	/** @deprecated use default-workspace instead */
	workspace: string;
	/** @deprecated use default-folder instead */
	folder: string;


	'enable-sync'?: boolean;
	'github-auth'?: string;
	'use-test-resolver'?: boolean;

	/* ----- extension management ----- */

	'extensions-dir'?: string;
	'extensions-download-dir'?: string;
	'builtin-extensions-dir'?: string;
	'install-extension'?: string[];
	'install-builtin-extension'?: string[];
	'update-extensions'?: boolean;
	'uninstall-extension'?: string[];
	'list-extensions'?: boolean;
	'locate-extension'?: string[];
	'show-versions'?: boolean;
	'category'?: string;
	force?: boolean; // used by install-extension
	'do-not-sync'?: boolean; // used by install-extension
	'pre-release'?: boolean; // used by install-extension
	'do-not-include-pack-dependencies'?: boolean; // used by install-extension


	'start-server'?: boolean;

	/* ----- remote development options ----- */

	'enable-remote-auto-shutdown'?: boolean;
	'remote-auto-shutdown-without-delay'?: boolean;
	'inspect-ptyhost'?: string;

	'use-host-proxy'?: boolean;
	'without-browser-env-var'?: boolean;
	'reconnection-grace-time'?: string;

	/* ----- server cli ----- */
	help: boolean;
	version: boolean;
	'locate-shell-integration-path'?: string;

	compatibility: string;

	_: string[];
}

export const IServerEnvironmentService = refineServiceDecorator<IEnvironmentService, IServerEnvironmentService>(IEnvironmentService);

export interface IServerEnvironmentService extends INativeEnvironmentService {
	readonly machineSettingsResource: URI;
	readonly mcpResource: URI;
	readonly args: ServerParsedArgs;
	readonly reconnectionGraceTime: number;
}

export class ServerEnvironmentService extends NativeEnvironmentService implements IServerEnvironmentService {
	@memoize
	override get userRoamingDataHome(): URI { return this.appSettingsHome; }
	@memoize
	get machineSettingsResource(): URI { return joinPath(URI.file(join(this.userDataPath, 'Machine')), 'settings.json'); }
	@memoize
	get mcpResource(): URI { return joinPath(URI.file(join(this.userDataPath, 'User')), 'mcp.json'); }
	override get args(): ServerParsedArgs { return super.args as ServerParsedArgs; }
	@memoize
	get reconnectionGraceTime(): number { return parseGraceTime(this.args['reconnection-grace-time'], ProtocolConstants.ReconnectionGraceTime); }
}

function parseGraceTime(rawValue: string | undefined, fallback: number): number {
	if (typeof rawValue !== 'string' || rawValue.trim().length === 0) {
		console.log(`[reconnection-grace-time] No CLI argument provided, using default: ${fallback}ms (${Math.floor(fallback / 1000)}s)`);
		return fallback;
	}
	const parsedSeconds = Number(rawValue);
	if (!isFinite(parsedSeconds) || parsedSeconds < 0) {
		console.log(`[reconnection-grace-time] Invalid value '${rawValue}', using default: ${fallback}ms (${Math.floor(fallback / 1000)}s)`);
		return fallback;
	}
	const millis = Math.floor(parsedSeconds * 1000);
	if (!isFinite(millis) || millis > Number.MAX_SAFE_INTEGER) {
		console.log(`[reconnection-grace-time] Value too large '${rawValue}', using default: ${fallback}ms (${Math.floor(fallback / 1000)}s)`);
		return fallback;
	}
	console.log(`[reconnection-grace-time] Parsed CLI argument: ${parsedSeconds}s -> ${millis}ms`);
	return millis;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/server/node/serverServices.ts]---
Location: vscode-main/src/vs/server/node/serverServices.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { hostname, release } from 'os';
import { Emitter, Event } from '../../base/common/event.js';
import { DisposableStore, toDisposable } from '../../base/common/lifecycle.js';
import { Schemas } from '../../base/common/network.js';
import * as path from '../../base/common/path.js';
import { IURITransformer } from '../../base/common/uriIpc.js';
import { getMachineId, getSqmMachineId, getDevDeviceId } from '../../base/node/id.js';
import { Promises } from '../../base/node/pfs.js';
import { ClientConnectionEvent, IMessagePassingProtocol, IPCServer, StaticRouter } from '../../base/parts/ipc/common/ipc.js';
import { ProtocolConstants } from '../../base/parts/ipc/common/ipc.net.js';
import { IConfigurationService } from '../../platform/configuration/common/configuration.js';
import { ConfigurationService } from '../../platform/configuration/common/configurationService.js';
import { ExtensionHostDebugBroadcastChannel } from '../../platform/debug/common/extensionHostDebugIpc.js';
import { IDownloadService } from '../../platform/download/common/download.js';
import { DownloadServiceChannelClient } from '../../platform/download/common/downloadIpc.js';
import { IEnvironmentService, INativeEnvironmentService } from '../../platform/environment/common/environment.js';
import { ExtensionGalleryServiceWithNoStorageService } from '../../platform/extensionManagement/common/extensionGalleryService.js';
import { IAllowedExtensionsService, IExtensionGalleryService } from '../../platform/extensionManagement/common/extensionManagement.js';
import { ExtensionSignatureVerificationService, IExtensionSignatureVerificationService } from '../../platform/extensionManagement/node/extensionSignatureVerificationService.js';
import { ExtensionManagementCLI } from '../../platform/extensionManagement/common/extensionManagementCLI.js';
import { ExtensionManagementChannel } from '../../platform/extensionManagement/common/extensionManagementIpc.js';
import { ExtensionManagementService, INativeServerExtensionManagementService } from '../../platform/extensionManagement/node/extensionManagementService.js';
import { IFileService } from '../../platform/files/common/files.js';
import { FileService } from '../../platform/files/common/fileService.js';
import { DiskFileSystemProvider } from '../../platform/files/node/diskFileSystemProvider.js';
import { SyncDescriptor } from '../../platform/instantiation/common/descriptors.js';
import { IInstantiationService } from '../../platform/instantiation/common/instantiation.js';
import { InstantiationService } from '../../platform/instantiation/common/instantiationService.js';
import { ServiceCollection } from '../../platform/instantiation/common/serviceCollection.js';
import { ILanguagePackService } from '../../platform/languagePacks/common/languagePacks.js';
import { NativeLanguagePackService } from '../../platform/languagePacks/node/languagePacks.js';
import { AbstractLogger, DEFAULT_LOG_LEVEL, getLogLevel, ILoggerService, ILogService, log, LogLevel, LogLevelToString } from '../../platform/log/common/log.js';
import product from '../../platform/product/common/product.js';
import { IProductService } from '../../platform/product/common/productService.js';
import { RemoteAgentConnectionContext } from '../../platform/remote/common/remoteAgentEnvironment.js';
import { IRequestService } from '../../platform/request/common/request.js';
import { RequestChannel } from '../../platform/request/common/requestIpc.js';
import { RequestService } from '../../platform/request/node/requestService.js';
import { resolveCommonProperties } from '../../platform/telemetry/common/commonProperties.js';
import { ITelemetryService, TelemetryLevel } from '../../platform/telemetry/common/telemetry.js';
import { ITelemetryServiceConfig } from '../../platform/telemetry/common/telemetryService.js';
import { getPiiPathsFromEnvironment, isInternalTelemetry, isLoggingOnly, ITelemetryAppender, NullAppender, supportsTelemetry } from '../../platform/telemetry/common/telemetryUtils.js';
import ErrorTelemetry from '../../platform/telemetry/node/errorTelemetry.js';
import { IPtyService, TerminalSettingId } from '../../platform/terminal/common/terminal.js';
import { PtyHostService } from '../../platform/terminal/node/ptyHostService.js';
import { IUriIdentityService } from '../../platform/uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../platform/uriIdentity/common/uriIdentityService.js';
import { RemoteAgentEnvironmentChannel } from './remoteAgentEnvironmentImpl.js';
import { RemoteAgentFileSystemProviderChannel } from './remoteFileSystemProviderServer.js';
import { ServerTelemetryChannel } from '../../platform/telemetry/common/remoteTelemetryChannel.js';
import { IServerTelemetryService, ServerNullTelemetryService, ServerTelemetryService } from '../../platform/telemetry/common/serverTelemetryService.js';
import { RemoteTerminalChannel } from './remoteTerminalChannel.js';
import { createURITransformer } from '../../base/common/uriTransformer.js';
import { ServerConnectionToken } from './serverConnectionToken.js';
import { ServerEnvironmentService, ServerParsedArgs } from './serverEnvironmentService.js';
import { REMOTE_TERMINAL_CHANNEL_NAME } from '../../workbench/contrib/terminal/common/remote/remoteTerminalChannel.js';
import { REMOTE_FILE_SYSTEM_CHANNEL_NAME } from '../../workbench/services/remote/common/remoteFileSystemProviderClient.js';
import { ExtensionHostStatusService, IExtensionHostStatusService } from './extensionHostStatusService.js';
import { IExtensionsScannerService } from '../../platform/extensionManagement/common/extensionsScannerService.js';
import { ExtensionsScannerService } from './extensionsScannerService.js';
import { IExtensionsProfileScannerService } from '../../platform/extensionManagement/common/extensionsProfileScannerService.js';
import { IUserDataProfilesService } from '../../platform/userDataProfile/common/userDataProfile.js';
import { NullPolicyService } from '../../platform/policy/common/policy.js';
import { OneDataSystemAppender } from '../../platform/telemetry/node/1dsAppender.js';
import { LoggerService } from '../../platform/log/node/loggerService.js';
import { ServerUserDataProfilesService } from '../../platform/userDataProfile/node/userDataProfile.js';
import { ExtensionsProfileScannerService } from '../../platform/extensionManagement/node/extensionsProfileScannerService.js';
import { LogService } from '../../platform/log/common/logService.js';
import { LoggerChannel } from '../../platform/log/common/logIpc.js';
import { localize } from '../../nls.js';
import { RemoteExtensionsScannerChannel, RemoteExtensionsScannerService } from './remoteExtensionsScanner.js';
import { RemoteExtensionsScannerChannelName } from '../../platform/remote/common/remoteExtensionsScanner.js';
import { RemoteUserDataProfilesServiceChannel } from '../../platform/userDataProfile/common/userDataProfileIpc.js';
import { NodePtyHostStarter } from '../../platform/terminal/node/nodePtyHostStarter.js';
import { CSSDevelopmentService, ICSSDevelopmentService } from '../../platform/cssDev/node/cssDevService.js';
import { AllowedExtensionsService } from '../../platform/extensionManagement/common/allowedExtensionsService.js';
import { TelemetryLogAppender } from '../../platform/telemetry/common/telemetryLogAppender.js';
import { INativeMcpDiscoveryHelperService, NativeMcpDiscoveryHelperChannelName } from '../../platform/mcp/common/nativeMcpDiscoveryHelper.js';
import { NativeMcpDiscoveryHelperChannel } from '../../platform/mcp/node/nativeMcpDiscoveryHelperChannel.js';
import { NativeMcpDiscoveryHelperService } from '../../platform/mcp/node/nativeMcpDiscoveryHelperService.js';
import { IExtensionGalleryManifestService } from '../../platform/extensionManagement/common/extensionGalleryManifest.js';
import { ExtensionGalleryManifestIPCService } from '../../platform/extensionManagement/common/extensionGalleryManifestServiceIpc.js';
import { IAllowedMcpServersService, IMcpGalleryService, IMcpManagementService } from '../../platform/mcp/common/mcpManagement.js';
import { McpManagementService } from '../../platform/mcp/node/mcpManagementService.js';
import { McpGalleryService } from '../../platform/mcp/common/mcpGalleryService.js';
import { IMcpResourceScannerService, McpResourceScannerService } from '../../platform/mcp/common/mcpResourceScannerService.js';
import { McpManagementChannel } from '../../platform/mcp/common/mcpManagementIpc.js';
import { AllowedMcpServersService } from '../../platform/mcp/common/allowedMcpServersService.js';
import { IMcpGalleryManifestService } from '../../platform/mcp/common/mcpGalleryManifest.js';
import { McpGalleryManifestIPCService } from '../../platform/mcp/common/mcpGalleryManifestServiceIpc.js';

const eventPrefix = 'monacoworkbench';

export async function setupServerServices(connectionToken: ServerConnectionToken, args: ServerParsedArgs, REMOTE_DATA_FOLDER: string, disposables: DisposableStore) {
	const services = new ServiceCollection();
	const socketServer = new SocketServer<RemoteAgentConnectionContext>();

	const productService: IProductService = { _serviceBrand: undefined, ...product };
	services.set(IProductService, productService);

	const environmentService = new ServerEnvironmentService(args, productService);
	services.set(IEnvironmentService, environmentService);
	services.set(INativeEnvironmentService, environmentService);

	const loggerService = new LoggerService(getLogLevel(environmentService), environmentService.logsHome);
	services.set(ILoggerService, loggerService);
	socketServer.registerChannel('logger', new LoggerChannel(loggerService, (ctx: RemoteAgentConnectionContext) => getUriTransformer(ctx.remoteAuthority)));

	const logger = loggerService.createLogger('remoteagent', { name: localize('remoteExtensionLog', "Server") });
	const logService = new LogService(logger, [new ServerLogger(getLogLevel(environmentService))]);
	services.set(ILogService, logService);
	setTimeout(() => cleanupOlderLogs(environmentService.logsHome.with({ scheme: Schemas.file }).fsPath).then(null, err => logService.error(err)), 10000);
	logService.onDidChangeLogLevel(logLevel => log(logService, logLevel, `Log level changed to ${LogLevelToString(logService.getLevel())}`));

	logService.trace(`Remote configuration data at ${REMOTE_DATA_FOLDER}`);
	logService.trace('process arguments:', environmentService.args);
	if (Array.isArray(productService.serverGreeting)) {
		logService.info(`\n\n${productService.serverGreeting.join('\n')}\n\n`);
	}

	// ExtensionHost Debug broadcast service
	socketServer.registerChannel(ExtensionHostDebugBroadcastChannel.ChannelName, new ExtensionHostDebugBroadcastChannel());

	// TODO: @Sandy @Joao need dynamic context based router
	const router = new StaticRouter<RemoteAgentConnectionContext>(ctx => ctx.clientId === 'renderer');

	// Files
	const fileService = disposables.add(new FileService(logService));
	services.set(IFileService, fileService);
	fileService.registerProvider(Schemas.file, disposables.add(new DiskFileSystemProvider(logService)));

	// URI Identity
	const uriIdentityService = new UriIdentityService(fileService);
	services.set(IUriIdentityService, uriIdentityService);

	// Configuration
	const configurationService = new ConfigurationService(environmentService.machineSettingsResource, fileService, new NullPolicyService(), logService);
	services.set(IConfigurationService, configurationService);

	// User Data Profiles
	const userDataProfilesService = new ServerUserDataProfilesService(uriIdentityService, environmentService, fileService, logService);
	services.set(IUserDataProfilesService, userDataProfilesService);
	socketServer.registerChannel('userDataProfiles', new RemoteUserDataProfilesServiceChannel(userDataProfilesService, (ctx: RemoteAgentConnectionContext) => getUriTransformer(ctx.remoteAuthority)));

	// Dev Only: CSS service (for ESM)
	services.set(ICSSDevelopmentService, new SyncDescriptor(CSSDevelopmentService, undefined, true));

	// Initialize
	const [, , machineId, sqmId, devDeviceId] = await Promise.all([
		configurationService.initialize(),
		userDataProfilesService.init(),
		getMachineId(logService.error.bind(logService)),
		getSqmMachineId(logService.error.bind(logService)),
		getDevDeviceId(logService.error.bind(logService))
	]);

	const extensionHostStatusService = new ExtensionHostStatusService();
	services.set(IExtensionHostStatusService, extensionHostStatusService);

	// Request
	const requestService = new RequestService('remote', configurationService, environmentService, logService);
	services.set(IRequestService, requestService);

	let oneDsAppender: ITelemetryAppender = NullAppender;
	const isInternal = isInternalTelemetry(productService, configurationService);
	if (supportsTelemetry(productService, environmentService)) {
		if (!isLoggingOnly(productService, environmentService) && productService.aiConfig?.ariaKey) {
			oneDsAppender = new OneDataSystemAppender(requestService, isInternal, eventPrefix, null, productService.aiConfig.ariaKey);
			disposables.add(toDisposable(() => oneDsAppender?.flush())); // Ensure the AI appender is disposed so that it flushes remaining data
		}

		const config: ITelemetryServiceConfig = {
			appenders: [oneDsAppender, new TelemetryLogAppender('', true, loggerService, environmentService, productService)],
			commonProperties: resolveCommonProperties(release(), hostname(), process.arch, productService.commit, productService.version + '-remote', machineId, sqmId, devDeviceId, isInternal, productService.date, 'remoteAgent'),
			piiPaths: getPiiPathsFromEnvironment(environmentService)
		};
		const initialTelemetryLevelArg = environmentService.args['telemetry-level'];
		let injectedTelemetryLevel: TelemetryLevel = TelemetryLevel.USAGE;
		// Convert the passed in CLI argument into a telemetry level for the telemetry service
		if (initialTelemetryLevelArg === 'all') {
			injectedTelemetryLevel = TelemetryLevel.USAGE;
		} else if (initialTelemetryLevelArg === 'error') {
			injectedTelemetryLevel = TelemetryLevel.ERROR;
		} else if (initialTelemetryLevelArg === 'crash') {
			injectedTelemetryLevel = TelemetryLevel.CRASH;
		} else if (initialTelemetryLevelArg !== undefined) {
			injectedTelemetryLevel = TelemetryLevel.NONE;
		}
		services.set(IServerTelemetryService, new SyncDescriptor(ServerTelemetryService, [config, injectedTelemetryLevel]));
	} else {
		services.set(IServerTelemetryService, ServerNullTelemetryService);
	}

	services.set(IExtensionGalleryManifestService, new ExtensionGalleryManifestIPCService(socketServer, productService));
	services.set(IMcpGalleryManifestService, new McpGalleryManifestIPCService(socketServer));
	services.set(IExtensionGalleryService, new SyncDescriptor(ExtensionGalleryServiceWithNoStorageService));

	const downloadChannel = socketServer.getChannel('download', router);
	services.set(IDownloadService, new DownloadServiceChannelClient(downloadChannel, () => getUriTransformer('renderer') /* TODO: @Sandy @Joao need dynamic context based router */));

	services.set(IExtensionsProfileScannerService, new SyncDescriptor(ExtensionsProfileScannerService));
	services.set(IExtensionsScannerService, new SyncDescriptor(ExtensionsScannerService));
	services.set(IExtensionSignatureVerificationService, new SyncDescriptor(ExtensionSignatureVerificationService));
	services.set(IAllowedExtensionsService, new SyncDescriptor(AllowedExtensionsService));
	services.set(INativeServerExtensionManagementService, new SyncDescriptor(ExtensionManagementService));
	services.set(INativeMcpDiscoveryHelperService, new SyncDescriptor(NativeMcpDiscoveryHelperService));

	const instantiationService: IInstantiationService = new InstantiationService(services);
	services.set(ILanguagePackService, instantiationService.createInstance(NativeLanguagePackService));

	const ptyHostStarter = instantiationService.createInstance(
		NodePtyHostStarter,
		{
			graceTime: environmentService.reconnectionGraceTime,
			shortGraceTime: environmentService.reconnectionGraceTime > 0 ? Math.min(ProtocolConstants.ReconnectionShortGraceTime, environmentService.reconnectionGraceTime) : 0,
			scrollback: configurationService.getValue<number>(TerminalSettingId.PersistentSessionScrollback) ?? 100
		}
	);
	const ptyHostService = instantiationService.createInstance(PtyHostService, ptyHostStarter);
	services.set(IPtyService, ptyHostService);

	services.set(IAllowedMcpServersService, new SyncDescriptor(AllowedMcpServersService));
	services.set(IMcpResourceScannerService, new SyncDescriptor(McpResourceScannerService));
	services.set(IMcpGalleryService, new SyncDescriptor(McpGalleryService));
	services.set(IMcpManagementService, new SyncDescriptor(McpManagementService));

	instantiationService.invokeFunction(accessor => {
		const mcpManagementService = accessor.get(IMcpManagementService);
		const extensionManagementService = accessor.get(INativeServerExtensionManagementService);
		const extensionsScannerService = accessor.get(IExtensionsScannerService);
		const extensionGalleryService = accessor.get(IExtensionGalleryService);
		const languagePackService = accessor.get(ILanguagePackService);
		const remoteExtensionEnvironmentChannel = new RemoteAgentEnvironmentChannel(connectionToken, environmentService, userDataProfilesService, extensionHostStatusService, logService);
		socketServer.registerChannel('remoteextensionsenvironment', remoteExtensionEnvironmentChannel);

		const telemetryChannel = new ServerTelemetryChannel(accessor.get(IServerTelemetryService), oneDsAppender);
		socketServer.registerChannel('telemetry', telemetryChannel);

		socketServer.registerChannel(REMOTE_TERMINAL_CHANNEL_NAME, new RemoteTerminalChannel(environmentService, logService, ptyHostService, productService, extensionManagementService, configurationService));

		const remoteExtensionsScanner = new RemoteExtensionsScannerService(instantiationService.createInstance(ExtensionManagementCLI, logService), environmentService, userDataProfilesService, extensionsScannerService, logService, extensionGalleryService, languagePackService, extensionManagementService);
		socketServer.registerChannel(RemoteExtensionsScannerChannelName, new RemoteExtensionsScannerChannel(remoteExtensionsScanner, (ctx: RemoteAgentConnectionContext) => getUriTransformer(ctx.remoteAuthority)));

		socketServer.registerChannel(NativeMcpDiscoveryHelperChannelName, instantiationService.createInstance(NativeMcpDiscoveryHelperChannel, (ctx: RemoteAgentConnectionContext) => getUriTransformer(ctx.remoteAuthority)));

		const remoteFileSystemChannel = disposables.add(new RemoteAgentFileSystemProviderChannel(logService, environmentService, configurationService));
		socketServer.registerChannel(REMOTE_FILE_SYSTEM_CHANNEL_NAME, remoteFileSystemChannel);

		socketServer.registerChannel('request', new RequestChannel(accessor.get(IRequestService)));

		const channel = new ExtensionManagementChannel(extensionManagementService, (ctx: RemoteAgentConnectionContext) => getUriTransformer(ctx.remoteAuthority));
		socketServer.registerChannel('extensions', channel);

		socketServer.registerChannel('mcpManagement', new McpManagementChannel(mcpManagementService, (ctx: RemoteAgentConnectionContext) => getUriTransformer(ctx.remoteAuthority)));

		// clean up extensions folder
		remoteExtensionsScanner.whenExtensionsReady().then(() => extensionManagementService.cleanUp());

		disposables.add(new ErrorTelemetry(accessor.get(ITelemetryService)));

		return {
			telemetryService: accessor.get(ITelemetryService)
		};
	});

	return { socketServer, instantiationService };
}

const _uriTransformerCache: { [remoteAuthority: string]: IURITransformer } = Object.create(null);

function getUriTransformer(remoteAuthority: string): IURITransformer {
	if (!_uriTransformerCache[remoteAuthority]) {
		_uriTransformerCache[remoteAuthority] = createURITransformer(remoteAuthority);
	}
	return _uriTransformerCache[remoteAuthority];
}

export class SocketServer<TContext = string> extends IPCServer<TContext> {

	private _onDidConnectEmitter: Emitter<ClientConnectionEvent>;

	constructor() {
		const emitter = new Emitter<ClientConnectionEvent>();
		super(emitter.event);
		this._onDidConnectEmitter = emitter;
	}

	public acceptConnection(protocol: IMessagePassingProtocol, onDidClientDisconnect: Event<void>): void {
		this._onDidConnectEmitter.fire({ protocol, onDidClientDisconnect });
	}
}

class ServerLogger extends AbstractLogger {
	private useColors: boolean;

	constructor(logLevel: LogLevel = DEFAULT_LOG_LEVEL) {
		super();
		this.setLevel(logLevel);
		this.useColors = Boolean(process.stdout.isTTY);
	}

	trace(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Trace)) {
			if (this.useColors) {
				console.log(`\x1b[90m[${now()}]\x1b[0m`, message, ...args);
			} else {
				console.log(`[${now()}]`, message, ...args);
			}
		}
	}

	debug(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Debug)) {
			if (this.useColors) {
				console.log(`\x1b[90m[${now()}]\x1b[0m`, message, ...args);
			} else {
				console.log(`[${now()}]`, message, ...args);
			}
		}
	}

	info(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Info)) {
			if (this.useColors) {
				console.log(`\x1b[90m[${now()}]\x1b[0m`, message, ...args);
			} else {
				console.log(`[${now()}]`, message, ...args);
			}
		}
	}

	warn(message: string | Error, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Warning)) {
			if (this.useColors) {
				console.warn(`\x1b[93m[${now()}]\x1b[0m`, message, ...args);
			} else {
				console.warn(`[${now()}]`, message, ...args);
			}
		}
	}

	error(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Error)) {
			if (this.useColors) {
				console.error(`\x1b[91m[${now()}]\x1b[0m`, message, ...args);
			} else {
				console.error(`[${now()}]`, message, ...args);
			}
		}
	}

	flush(): void {
		// noop
	}
}

function now(): string {
	const date = new Date();
	return `${twodigits(date.getHours())}:${twodigits(date.getMinutes())}:${twodigits(date.getSeconds())}`;
}

function twodigits(n: number): string {
	if (n < 10) {
		return `0${n}`;
	}
	return String(n);
}

/**
 * Cleans up older logs, while keeping the 10 most recent ones.
 */
async function cleanupOlderLogs(logsPath: string): Promise<void> {
	const currentLog = path.basename(logsPath);
	const logsRoot = path.dirname(logsPath);
	const children = await Promises.readdir(logsRoot);
	const allSessions = children.filter(name => /^\d{8}T\d{6}$/.test(name));
	const oldSessions = allSessions.sort().filter((d) => d !== currentLog);
	const toDelete = oldSessions.slice(0, Math.max(0, oldSessions.length - 9));

	await Promise.all(toDelete.map(name => Promises.rm(path.join(logsRoot, name))));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/server/node/webClientServer.ts]---
Location: vscode-main/src/vs/server/node/webClientServer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createReadStream, promises } from 'fs';
import * as http from 'http';
import * as url from 'url';
import * as cookie from 'cookie';
import * as crypto from 'crypto';
import { isEqualOrParent } from '../../base/common/extpath.js';
import { getMediaMime } from '../../base/common/mime.js';
import { isLinux } from '../../base/common/platform.js';
import { ILogService, LogLevel } from '../../platform/log/common/log.js';
import { IServerEnvironmentService } from './serverEnvironmentService.js';
import { extname, dirname, join, normalize, posix, resolve } from '../../base/common/path.js';
import { FileAccess, connectionTokenCookieName, connectionTokenQueryName, Schemas, builtinExtensionsPath } from '../../base/common/network.js';
import { generateUuid } from '../../base/common/uuid.js';
import { IProductService } from '../../platform/product/common/productService.js';
import { ServerConnectionToken, ServerConnectionTokenType } from './serverConnectionToken.js';
import { asTextOrError, IRequestService } from '../../platform/request/common/request.js';
import { IHeaders } from '../../base/parts/request/common/request.js';
import { CancellationToken } from '../../base/common/cancellation.js';
import { URI } from '../../base/common/uri.js';
import { streamToBuffer } from '../../base/common/buffer.js';
import { IProductConfiguration } from '../../base/common/product.js';
import { isString, Mutable } from '../../base/common/types.js';
import { CharCode } from '../../base/common/charCode.js';
import { IExtensionManifest } from '../../platform/extensions/common/extensions.js';
import { ICSSDevelopmentService } from '../../platform/cssDev/node/cssDevService.js';

const textMimeType: { [ext: string]: string | undefined } = {
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.json': 'application/json',
	'.css': 'text/css',
	'.svg': 'image/svg+xml',
};

/**
 * Return an error to the client.
 */
export async function serveError(req: http.IncomingMessage, res: http.ServerResponse, errorCode: number, errorMessage: string): Promise<void> {
	res.writeHead(errorCode, { 'Content-Type': 'text/plain' });
	res.end(errorMessage);
}

export const enum CacheControl {
	NO_CACHING, ETAG, NO_EXPIRY
}

/**
 * Serve a file at a given path or 404 if the file is missing.
 */
export async function serveFile(filePath: string, cacheControl: CacheControl, logService: ILogService, req: http.IncomingMessage, res: http.ServerResponse, responseHeaders: Record<string, string>): Promise<void> {
	try {
		const stat = await promises.stat(filePath); // throws an error if file doesn't exist
		if (cacheControl === CacheControl.ETAG) {

			// Check if file modified since
			const etag = `W/"${[stat.ino, stat.size, stat.mtime.getTime()].join('-')}"`; // weak validator (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
			if (req.headers['if-none-match'] === etag) {
				res.writeHead(304);
				return void res.end();
			}

			responseHeaders['Etag'] = etag;
		} else if (cacheControl === CacheControl.NO_EXPIRY) {
			responseHeaders['Cache-Control'] = 'public, max-age=31536000';
		} else if (cacheControl === CacheControl.NO_CACHING) {
			responseHeaders['Cache-Control'] = 'no-store';
		}

		responseHeaders['Content-Type'] = textMimeType[extname(filePath)] || getMediaMime(filePath) || 'text/plain';

		res.writeHead(200, responseHeaders);

		// Data
		createReadStream(filePath).pipe(res);
	} catch (error) {
		if (error.code !== 'ENOENT') {
			logService.error(error);
			console.error(error.toString());
		} else {
			console.error(`File not found: ${filePath}`);
		}

		res.writeHead(404, { 'Content-Type': 'text/plain' });
		return void res.end('Not found');
	}
}

const APP_ROOT = dirname(FileAccess.asFileUri('').fsPath);

const STATIC_PATH = `/static`;
const CALLBACK_PATH = `/callback`;
const WEB_EXTENSION_PATH = `/web-extension-resource`;

export class WebClientServer {

	private readonly _webExtensionResourceUrlTemplate: URI | undefined;

	constructor(
		private readonly _connectionToken: ServerConnectionToken,
		private readonly _basePath: string,
		private readonly _productPath: string,
		@IServerEnvironmentService private readonly _environmentService: IServerEnvironmentService,
		@ILogService private readonly _logService: ILogService,
		@IRequestService private readonly _requestService: IRequestService,
		@IProductService private readonly _productService: IProductService,
		@ICSSDevelopmentService private readonly _cssDevService: ICSSDevelopmentService
	) {
		this._webExtensionResourceUrlTemplate = this._productService.extensionsGallery?.resourceUrlTemplate ? URI.parse(this._productService.extensionsGallery.resourceUrlTemplate) : undefined;
	}

	/**
	 * Handle web resources (i.e. only needed by the web client).
	 * **NOTE**: This method is only invoked when the server has web bits.
	 * **NOTE**: This method is only invoked after the connection token has been validated.
	 * @param parsedUrl The URL to handle, including base and product path
	 * @param pathname The pathname of the URL, without base and product path
	 */
	async handle(req: http.IncomingMessage, res: http.ServerResponse, parsedUrl: url.UrlWithParsedQuery, pathname: string): Promise<void> {
		try {
			if (pathname.startsWith(STATIC_PATH) && pathname.charCodeAt(STATIC_PATH.length) === CharCode.Slash) {
				return this._handleStatic(req, res, pathname.substring(STATIC_PATH.length));
			}
			if (pathname === '/') {
				return this._handleRoot(req, res, parsedUrl);
			}
			if (pathname === CALLBACK_PATH) {
				// callback support
				return this._handleCallback(res);
			}
			if (pathname.startsWith(WEB_EXTENSION_PATH) && pathname.charCodeAt(WEB_EXTENSION_PATH.length) === CharCode.Slash) {
				// extension resource support
				return this._handleWebExtensionResource(req, res, pathname.substring(WEB_EXTENSION_PATH.length));
			}

			return serveError(req, res, 404, 'Not found.');
		} catch (error) {
			this._logService.error(error);
			console.error(error.toString());

			return serveError(req, res, 500, 'Internal Server Error.');
		}
	}
	/**
	 * Handle HTTP requests for /static/*
	 * @param resourcePath The path after /static/
	 */
	private async _handleStatic(req: http.IncomingMessage, res: http.ServerResponse, resourcePath: string): Promise<void> {
		const headers: Record<string, string> = Object.create(null);

		// Strip the this._staticRoute from the path
		const normalizedPathname = decodeURIComponent(resourcePath); // support paths that are uri-encoded (e.g. spaces => %20)

		const filePath = join(APP_ROOT, normalizedPathname); // join also normalizes the path
		if (!isEqualOrParent(filePath, APP_ROOT, !isLinux)) {
			return serveError(req, res, 400, `Bad request.`);
		}

		return serveFile(filePath, this._environmentService.isBuilt ? CacheControl.NO_EXPIRY : CacheControl.ETAG, this._logService, req, res, headers);
	}

	private _getResourceURLTemplateAuthority(uri: URI): string | undefined {
		const index = uri.authority.indexOf('.');
		return index !== -1 ? uri.authority.substring(index + 1) : undefined;
	}

	/**
	 * Handle extension resources
	 * @param resourcePath The path after /web-extension-resource/
	 */
	private async _handleWebExtensionResource(req: http.IncomingMessage, res: http.ServerResponse, resourcePath: string): Promise<void> {
		if (!this._webExtensionResourceUrlTemplate) {
			return serveError(req, res, 500, 'No extension gallery service configured.');
		}

		const normalizedPathname = decodeURIComponent(resourcePath); // support paths that are uri-encoded (e.g. spaces => %20)
		const path = normalize(normalizedPathname);
		const uri = URI.parse(path).with({
			scheme: this._webExtensionResourceUrlTemplate.scheme,
			authority: path.substring(0, path.indexOf('/')),
			path: path.substring(path.indexOf('/') + 1)
		});

		if (this._getResourceURLTemplateAuthority(this._webExtensionResourceUrlTemplate) !== this._getResourceURLTemplateAuthority(uri)) {
			return serveError(req, res, 403, 'Request Forbidden');
		}

		const headers: IHeaders = {};
		const setRequestHeader = (header: string) => {
			const value = req.headers[header];
			if (value && (isString(value) || value[0])) {
				headers[header] = isString(value) ? value : value[0];
			} else if (header !== header.toLowerCase()) {
				setRequestHeader(header.toLowerCase());
			}
		};
		setRequestHeader('X-Client-Name');
		setRequestHeader('X-Client-Version');
		setRequestHeader('X-Machine-Id');
		setRequestHeader('X-Client-Commit');

		const context = await this._requestService.request({
			type: 'GET',
			url: uri.toString(true),
			headers
		}, CancellationToken.None);

		const status = context.res.statusCode || 500;
		if (status !== 200) {
			let text: string | null = null;
			try {
				text = await asTextOrError(context);
			} catch (error) {/* Ignore */ }
			return serveError(req, res, status, text || `Request failed with status ${status}`);
		}

		const responseHeaders: Record<string, string | string[]> = Object.create(null);
		const setResponseHeader = (header: string) => {
			const value = context.res.headers[header];
			if (value) {
				responseHeaders[header] = value;
			} else if (header !== header.toLowerCase()) {
				setResponseHeader(header.toLowerCase());
			}
		};
		setResponseHeader('Cache-Control');
		setResponseHeader('Content-Type');
		res.writeHead(200, responseHeaders);
		const buffer = await streamToBuffer(context.stream);
		return void res.end(buffer.buffer);
	}

	/**
	 * Handle HTTP requests for /
	 */
	private async _handleRoot(req: http.IncomingMessage, res: http.ServerResponse, parsedUrl: url.UrlWithParsedQuery): Promise<void> {

		const getFirstHeader = (headerName: string) => {
			const val = req.headers[headerName];
			return Array.isArray(val) ? val[0] : val;
		};

		// Prefix routes with basePath for clients
		const basePath = getFirstHeader('x-forwarded-prefix') || this._basePath;

		const queryConnectionToken = parsedUrl.query[connectionTokenQueryName];
		if (typeof queryConnectionToken === 'string') {
			// We got a connection token as a query parameter.
			// We want to have a clean URL, so we strip it
			const responseHeaders: Record<string, string> = Object.create(null);
			responseHeaders['Set-Cookie'] = cookie.serialize(
				connectionTokenCookieName,
				queryConnectionToken,
				{
					sameSite: 'lax',
					maxAge: 60 * 60 * 24 * 7 /* 1 week */
				}
			);

			const newQuery = Object.create(null);
			for (const key in parsedUrl.query) {
				if (key !== connectionTokenQueryName) {
					newQuery[key] = parsedUrl.query[key];
				}
			}
			const newLocation = url.format({ pathname: basePath, query: newQuery });
			responseHeaders['Location'] = newLocation;

			res.writeHead(302, responseHeaders);
			return void res.end();
		}

		const replacePort = (host: string, port: string) => {
			const index = host?.indexOf(':');
			if (index !== -1) {
				host = host?.substring(0, index);
			}
			host += `:${port}`;
			return host;
		};

		const useTestResolver = (!this._environmentService.isBuilt && this._environmentService.args['use-test-resolver']);
		let remoteAuthority = (
			useTestResolver
				? 'test+test'
				: (getFirstHeader('x-original-host') || getFirstHeader('x-forwarded-host') || req.headers.host)
		);
		if (!remoteAuthority) {
			return serveError(req, res, 400, `Bad request.`);
		}
		const forwardedPort = getFirstHeader('x-forwarded-port');
		if (forwardedPort) {
			remoteAuthority = replacePort(remoteAuthority, forwardedPort);
		}

		function asJSON(value: unknown): string {
			return JSON.stringify(value).replace(/"/g, '&quot;');
		}

		let _wrapWebWorkerExtHostInIframe: undefined | false = undefined;
		if (this._environmentService.args['enable-smoke-test-driver']) {
			// integration tests run at a time when the built output is not yet published to the CDN
			// so we must disable the iframe wrapping because the iframe URL will give a 404
			_wrapWebWorkerExtHostInIframe = false;
		}

		if (this._logService.getLevel() === LogLevel.Trace) {
			['x-original-host', 'x-forwarded-host', 'x-forwarded-port', 'host'].forEach(header => {
				const value = getFirstHeader(header);
				if (value) {
					this._logService.trace(`[WebClientServer] ${header}: ${value}`);
				}
			});
			this._logService.trace(`[WebClientServer] Request URL: ${req.url}, basePath: ${basePath}, remoteAuthority: ${remoteAuthority}`);
		}

		const staticRoute = posix.join(basePath, this._productPath, STATIC_PATH);
		const callbackRoute = posix.join(basePath, this._productPath, CALLBACK_PATH);
		const webExtensionRoute = posix.join(basePath, this._productPath, WEB_EXTENSION_PATH);

		const resolveWorkspaceURI = (defaultLocation?: string) => defaultLocation && URI.file(resolve(defaultLocation)).with({ scheme: Schemas.vscodeRemote, authority: remoteAuthority });

		const filePath = FileAccess.asFileUri(`vs/code/browser/workbench/workbench${this._environmentService.isBuilt ? '' : '-dev'}.html`).fsPath;
		const authSessionInfo = !this._environmentService.isBuilt && this._environmentService.args['github-auth'] ? {
			id: generateUuid(),
			providerId: 'github',
			accessToken: this._environmentService.args['github-auth'],
			scopes: [['user:email'], ['repo']]
		} : undefined;

		const productConfiguration: Partial<Mutable<IProductConfiguration>> = {
			embedderIdentifier: 'server-distro',
			extensionsGallery: this._webExtensionResourceUrlTemplate && this._productService.extensionsGallery ? {
				...this._productService.extensionsGallery,
				resourceUrlTemplate: this._webExtensionResourceUrlTemplate.with({
					scheme: 'http',
					authority: remoteAuthority,
					path: `${webExtensionRoute}/${this._webExtensionResourceUrlTemplate.authority}${this._webExtensionResourceUrlTemplate.path}`
				}).toString(true)
			} : undefined
		};

		const proposedApi = this._environmentService.args['enable-proposed-api'];
		if (proposedApi?.length) {
			productConfiguration.extensionsEnabledWithApiProposalVersion ??= [];
			productConfiguration.extensionsEnabledWithApiProposalVersion.push(...proposedApi);
		}

		if (!this._environmentService.isBuilt) {
			try {
				const productOverrides = JSON.parse((await promises.readFile(join(APP_ROOT, 'product.overrides.json'))).toString());
				Object.assign(productConfiguration, productOverrides);
			} catch (err) {/* Ignore Error */ }
		}

		const workbenchWebConfiguration = {
			remoteAuthority,
			serverBasePath: basePath,
			_wrapWebWorkerExtHostInIframe,
			developmentOptions: { enableSmokeTestDriver: this._environmentService.args['enable-smoke-test-driver'] ? true : undefined, logLevel: this._logService.getLevel() },
			settingsSyncOptions: !this._environmentService.isBuilt && this._environmentService.args['enable-sync'] ? { enabled: true } : undefined,
			enableWorkspaceTrust: !this._environmentService.args['disable-workspace-trust'],
			folderUri: resolveWorkspaceURI(this._environmentService.args['default-folder']),
			workspaceUri: resolveWorkspaceURI(this._environmentService.args['default-workspace']),
			productConfiguration,
			callbackRoute: callbackRoute
		};

		const cookies = cookie.parse(req.headers.cookie || '');
		const locale = cookies['vscode.nls.locale'] || req.headers['accept-language']?.split(',')[0]?.toLowerCase() || 'en';
		let WORKBENCH_NLS_BASE_URL: string | undefined;
		let WORKBENCH_NLS_URL: string;
		if (!locale.startsWith('en') && this._productService.nlsCoreBaseUrl) {
			WORKBENCH_NLS_BASE_URL = this._productService.nlsCoreBaseUrl;
			WORKBENCH_NLS_URL = `${WORKBENCH_NLS_BASE_URL}${this._productService.commit}/${this._productService.version}/${locale}/nls.messages.js`;
		} else {
			WORKBENCH_NLS_URL = ''; // fallback will apply
		}

		const values: { [key: string]: string } = {
			WORKBENCH_WEB_CONFIGURATION: asJSON(workbenchWebConfiguration),
			WORKBENCH_AUTH_SESSION: authSessionInfo ? asJSON(authSessionInfo) : '',
			WORKBENCH_WEB_BASE_URL: staticRoute,
			WORKBENCH_NLS_URL,
			WORKBENCH_NLS_FALLBACK_URL: `${staticRoute}/out/nls.messages.js`
		};

		// DEV ---------------------------------------------------------------------------------------
		// DEV: This is for development and enables loading CSS via import-statements via import-maps.
		// DEV: The server needs to send along all CSS modules so that the client can construct the
		// DEV: import-map.
		// DEV ---------------------------------------------------------------------------------------
		if (this._cssDevService.isEnabled) {
			const cssModules = await this._cssDevService.getCssModules();
			values['WORKBENCH_DEV_CSS_MODULES'] = JSON.stringify(cssModules);
		}

		if (useTestResolver) {
			const bundledExtensions: { extensionPath: string; packageJSON: IExtensionManifest }[] = [];
			for (const extensionPath of ['vscode-test-resolver', 'github-authentication']) {
				const packageJSON = JSON.parse((await promises.readFile(FileAccess.asFileUri(`${builtinExtensionsPath}/${extensionPath}/package.json`).fsPath)).toString());
				bundledExtensions.push({ extensionPath, packageJSON });
			}
			values['WORKBENCH_BUILTIN_EXTENSIONS'] = asJSON(bundledExtensions);
		}

		let data;
		try {
			const workbenchTemplate = (await promises.readFile(filePath)).toString();
			data = workbenchTemplate.replace(/\{\{([^}]+)\}\}/g, (_, key) => values[key] ?? 'undefined');
		} catch (e) {
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			return void res.end('Not found');
		}

		const webWorkerExtensionHostIframeScriptSHA = 'sha256-2Q+j4hfT09+1+imS46J2YlkCtHWQt0/BE79PXjJ0ZJ8=';

		const cspDirectives = [
			'default-src \'self\';',
			'img-src \'self\' https: data: blob:;',
			'media-src \'self\';',
			`script-src 'self' 'unsafe-eval' ${WORKBENCH_NLS_BASE_URL ?? ''} blob: 'nonce-1nline-m4p' ${this._getScriptCspHashes(data).join(' ')} '${webWorkerExtensionHostIframeScriptSHA}' 'sha256-/r7rqQ+yrxt57sxLuQ6AMYcy/lUpvAIzHjIJt/OeLWU=' ${useTestResolver ? '' : `http://${remoteAuthority}`};`,  // the sha is the same as in src/vs/workbench/services/extensions/worker/webWorkerExtensionHostIframe.html
			'child-src \'self\';',
			`frame-src 'self' https://*.vscode-cdn.net data:;`,
			'worker-src \'self\' data: blob:;',
			'style-src \'self\' \'unsafe-inline\';',
			'connect-src \'self\' ws: wss: https:;',
			'font-src \'self\' blob:;',
			'manifest-src \'self\';'
		].join(' ');

		const headers: http.OutgoingHttpHeaders = {
			'Content-Type': 'text/html',
			'Content-Security-Policy': cspDirectives
		};
		if (this._connectionToken.type !== ServerConnectionTokenType.None) {
			// At this point we know the client has a valid cookie
			// and we want to set it prolong it to ensure that this
			// client is valid for another 1 week at least
			headers['Set-Cookie'] = cookie.serialize(
				connectionTokenCookieName,
				this._connectionToken.value,
				{
					sameSite: 'lax',
					maxAge: 60 * 60 * 24 * 7 /* 1 week */
				}
			);
		}

		res.writeHead(200, headers);
		return void res.end(data);
	}

	private _getScriptCspHashes(content: string): string[] {
		// Compute the CSP hashes for line scripts. Uses regex
		// which means it isn't 100% good.
		const regex = /<script>([\s\S]+?)<\/script>/img;
		const result: string[] = [];
		let match: RegExpExecArray | null;
		while (match = regex.exec(content)) {
			const hasher = crypto.createHash('sha256');
			// This only works on Windows if we strip `\r` from `\r\n`.
			const script = match[1].replace(/\r\n/g, '\n');
			const hash = hasher
				.update(Buffer.from(script))
				.digest().toString('base64');

			result.push(`'sha256-${hash}'`);
		}
		return result;
	}

	/**
	 * Handle HTTP requests for /callback
	 */
	private async _handleCallback(res: http.ServerResponse): Promise<void> {
		const filePath = FileAccess.asFileUri('vs/code/browser/workbench/callback.html').fsPath;
		const data = (await promises.readFile(filePath)).toString();
		const cspDirectives = [
			'default-src \'self\';',
			'img-src \'self\' https: data: blob:;',
			'media-src \'none\';',
			`script-src 'self' ${this._getScriptCspHashes(data).join(' ')};`,
			'style-src \'self\' \'unsafe-inline\';',
			'font-src \'self\' blob:;'
		].join(' ');

		res.writeHead(200, {
			'Content-Type': 'text/html',
			'Content-Security-Policy': cspDirectives
		});
		return void res.end(data);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/server/test/node/serverConnectionToken.test.ts]---
Location: vscode-main/src/vs/server/test/node/serverConnectionToken.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import { join } from '../../../base/common/path.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../base/test/common/utils.js';
import { getRandomTestPath } from '../../../base/test/node/testUtils.js';
import { parseServerConnectionToken, ServerConnectionToken, ServerConnectionTokenParseError, ServerConnectionTokenType } from '../../node/serverConnectionToken.js';
import { ServerParsedArgs } from '../../node/serverEnvironmentService.js';

suite('parseServerConnectionToken', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	function isError(r: ServerConnectionToken | ServerConnectionTokenParseError): r is ServerConnectionTokenParseError {
		return (r instanceof ServerConnectionTokenParseError);
	}

	function assertIsError(r: ServerConnectionToken | ServerConnectionTokenParseError): void {
		assert.strictEqual(isError(r), true);
	}

	test('no arguments generates a token that is mandatory', async () => {
		const result = await parseServerConnectionToken({} as ServerParsedArgs, async () => 'defaultTokenValue');
		assert.ok(!(result instanceof ServerConnectionTokenParseError));
		assert.ok(result.type === ServerConnectionTokenType.Mandatory);
	});

	test('--without-connection-token', async () => {
		const result = await parseServerConnectionToken({ 'without-connection-token': true } as ServerParsedArgs, async () => 'defaultTokenValue');
		assert.ok(!(result instanceof ServerConnectionTokenParseError));
		assert.ok(result.type === ServerConnectionTokenType.None);
	});

	test('--without-connection-token --connection-token results in error', async () => {
		assertIsError(await parseServerConnectionToken({ 'without-connection-token': true, 'connection-token': '0' } as ServerParsedArgs, async () => 'defaultTokenValue'));
	});

	test('--without-connection-token --connection-token-file results in error', async () => {
		assertIsError(await parseServerConnectionToken({ 'without-connection-token': true, 'connection-token-file': '0' } as ServerParsedArgs, async () => 'defaultTokenValue'));
	});

	test('--connection-token-file --connection-token results in error', async () => {
		assertIsError(await parseServerConnectionToken({ 'connection-token-file': '0', 'connection-token': '0' } as ServerParsedArgs, async () => 'defaultTokenValue'));
	});

	test('--connection-token-file', async function () {
		this.timeout(10000);
		const testDir = getRandomTestPath(os.tmpdir(), 'vsctests', 'server-connection-token');
		fs.mkdirSync(testDir, { recursive: true });
		const filename = join(testDir, 'connection-token-file');
		const connectionToken = `12345-123-abc`;
		fs.writeFileSync(filename, connectionToken);
		const result = await parseServerConnectionToken({ 'connection-token-file': filename } as ServerParsedArgs, async () => 'defaultTokenValue');
		assert.ok(!(result instanceof ServerConnectionTokenParseError));
		assert.ok(result.type === ServerConnectionTokenType.Mandatory);
		assert.strictEqual(result.value, connectionToken);
		fs.rmSync(testDir, { recursive: true, force: true });
	});

	test('--connection-token', async () => {
		const connectionToken = `12345-123-abc`;
		const result = await parseServerConnectionToken({ 'connection-token': connectionToken } as ServerParsedArgs, async () => 'defaultTokenValue');
		assert.ok(!(result instanceof ServerConnectionTokenParseError));
		assert.ok(result.type === ServerConnectionTokenType.Mandatory);
		assert.strictEqual(result.value, connectionToken);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/server/test/node/serverMain.test.ts]---
Location: vscode-main/src/vs/server/test/node/serverMain.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import { join } from '../../../base/common/path.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../base/test/common/utils.js';
import { getRandomTestPath } from '../../../base/test/node/testUtils.js';

suite('server.main directory creation', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('should create nested directories with recursive option', function () {
		this.timeout(10000);
		const testDir = getRandomTestPath(os.tmpdir(), 'vsctests', 'server-main-dirs');
		const nestedPath = join(testDir, 'parent', 'child', 'extensions');

		try {
			// Ensure the test directory doesn't exist
			if (fs.existsSync(testDir)) {
				fs.rmSync(testDir, { recursive: true, force: true });
			}

			// This simulates what server.main.ts does - create directories with recursive option
			if (!fs.existsSync(nestedPath)) {
				fs.mkdirSync(nestedPath, { mode: 0o700, recursive: true });
			}

			// Verify all directories were created
			assert.strictEqual(fs.existsSync(nestedPath), true, 'Nested directory should exist');
			assert.strictEqual(fs.existsSync(join(testDir, 'parent')), true, 'Parent directory should exist');
			assert.strictEqual(fs.existsSync(join(testDir, 'parent', 'child')), true, 'Child directory should exist');

			// Verify the permissions (only on Unix-like systems)
			if (process.platform !== 'win32') {
				const stats = fs.statSync(nestedPath);
				const mode = stats.mode & 0o777;
				assert.strictEqual(mode, 0o700, 'Directory should have 0o700 permissions');
			}
		} finally {
			// Cleanup
			if (fs.existsSync(testDir)) {
				fs.rmSync(testDir, { recursive: true, force: true });
			}
		}
	});

	test('should not fail when parent directories do not exist', function () {
		this.timeout(10000);
		const testDir = getRandomTestPath(os.tmpdir(), 'vsctests', 'server-main-nonexistent');
		const deeplyNestedPath = join(testDir, 'level1', 'level2', 'level3', 'extensions');

		try {
			// Ensure the test directory doesn't exist
			if (fs.existsSync(testDir)) {
				fs.rmSync(testDir, { recursive: true, force: true });
			}

			// This should not throw an error even though parent directories don't exist
			assert.doesNotThrow(() => {
				if (!fs.existsSync(deeplyNestedPath)) {
					fs.mkdirSync(deeplyNestedPath, { mode: 0o700, recursive: true });
				}
			}, 'Should not throw when creating deeply nested directories');

			// Verify the directory was created
			assert.strictEqual(fs.existsSync(deeplyNestedPath), true, 'Deeply nested directory should exist');
		} finally {
			// Cleanup
			if (fs.existsSync(testDir)) {
				fs.rmSync(testDir, { recursive: true, force: true });
			}
		}
	});

	test('should handle existing directories gracefully', function () {
		this.timeout(10000);
		const testDir = getRandomTestPath(os.tmpdir(), 'vsctests', 'server-main-existing');
		const extensionsPath = join(testDir, 'extensions');

		try {
			// Create the directory first
			fs.mkdirSync(extensionsPath, { mode: 0o700, recursive: true });
			assert.strictEqual(fs.existsSync(extensionsPath), true);

			// Try to create it again - this simulates the if (!fs.existsSync(f)) check in server.main.ts
			assert.doesNotThrow(() => {
				if (!fs.existsSync(extensionsPath)) {
					fs.mkdirSync(extensionsPath, { mode: 0o700, recursive: true });
				}
			}, 'Should not throw when directory already exists');

			// The directory should still exist
			assert.strictEqual(fs.existsSync(extensionsPath), true);
		} finally {
			// Cleanup
			if (fs.existsSync(testDir)) {
				fs.rmSync(testDir, { recursive: true, force: true });
			}
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/workbench.common.main.ts]---
Location: vscode-main/src/vs/workbench/workbench.common.main.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//#region --- editor/workbench core

import '../editor/editor.all.js';

import './api/browser/extensionHost.contribution.js';
import './browser/workbench.contribution.js';

//#endregion


//#region --- workbench actions

import './browser/actions/textInputActions.js';
import './browser/actions/developerActions.js';
import './browser/actions/helpActions.js';
import './browser/actions/layoutActions.js';
import './browser/actions/listCommands.js';
import './browser/actions/navigationActions.js';
import './browser/actions/windowActions.js';
import './browser/actions/workspaceActions.js';
import './browser/actions/workspaceCommands.js';
import './browser/actions/quickAccessActions.js';
import './browser/actions/widgetNavigationCommands.js';

//#endregion


//#region --- API Extension Points

import './services/actions/common/menusExtensionPoint.js';
import './api/common/configurationExtensionPoint.js';
import './api/browser/viewsExtensionPoint.js';

//#endregion


//#region --- workbench parts

import './browser/parts/editor/editor.contribution.js';
import './browser/parts/editor/editorParts.js';
import './browser/parts/paneCompositePartService.js';
import './browser/parts/banner/bannerPart.js';
import './browser/parts/statusbar/statusbarPart.js';

//#endregion


//#region --- workbench services

import '../platform/actions/common/actions.contribution.js';
import '../platform/undoRedo/common/undoRedoService.js';
import '../platform/mcp/common/mcpResourceScannerService.js';
import './services/workspaces/common/editSessionIdentityService.js';
import './services/workspaces/common/canonicalUriService.js';
import './services/extensions/browser/extensionUrlHandler.js';
import './services/keybinding/common/keybindingEditing.js';
import './services/decorations/browser/decorationsService.js';
import './services/dialogs/common/dialogService.js';
import './services/progress/browser/progressService.js';
import './services/editor/browser/codeEditorService.js';
import './services/preferences/browser/preferencesService.js';
import './services/configuration/common/jsonEditingService.js';
import './services/textmodelResolver/common/textModelResolverService.js';
import './services/editor/browser/editorService.js';
import './services/editor/browser/editorResolverService.js';
import './services/aiEmbeddingVector/common/aiEmbeddingVectorService.js';
import './services/aiRelatedInformation/common/aiRelatedInformationService.js';
import './services/aiSettingsSearch/common/aiSettingsSearchService.js';
import './services/history/browser/historyService.js';
import './services/activity/browser/activityService.js';
import './services/keybinding/browser/keybindingService.js';
import './services/untitled/common/untitledTextEditorService.js';
import './services/textresourceProperties/common/textResourcePropertiesService.js';
import './services/textfile/common/textEditorService.js';
import './services/language/common/languageService.js';
import './services/model/common/modelService.js';
import './services/notebook/common/notebookDocumentService.js';
import './services/commands/common/commandService.js';
import './services/themes/browser/workbenchThemeService.js';
import './services/label/common/labelService.js';
import './services/extensions/common/extensionManifestPropertiesService.js';
import './services/extensionManagement/common/extensionGalleryService.js';
import './services/extensionManagement/browser/extensionEnablementService.js';
import './services/extensionManagement/browser/builtinExtensionsScannerService.js';
import './services/extensionRecommendations/common/extensionIgnoredRecommendationsService.js';
import './services/extensionRecommendations/common/workspaceExtensionsConfig.js';
import './services/extensionManagement/common/extensionFeaturesManagemetService.js';
import './services/notification/common/notificationService.js';
import './services/userDataSync/common/userDataSyncUtil.js';
import './services/userDataProfile/browser/userDataProfileImportExportService.js';
import './services/userDataProfile/browser/userDataProfileManagement.js';
import './services/userDataProfile/common/remoteUserDataProfiles.js';
import './services/remote/common/remoteExplorerService.js';
import './services/remote/common/remoteExtensionsScanner.js';
import './services/terminal/common/embedderTerminalService.js';
import './services/workingCopy/common/workingCopyService.js';
import './services/workingCopy/common/workingCopyFileService.js';
import './services/workingCopy/common/workingCopyEditorService.js';
import './services/filesConfiguration/common/filesConfigurationService.js';
import './services/views/browser/viewDescriptorService.js';
import './services/views/browser/viewsService.js';
import './services/quickinput/browser/quickInputService.js';
import './services/userDataSync/browser/userDataSyncWorkbenchService.js';
import './services/authentication/browser/authenticationService.js';
import './services/authentication/browser/authenticationExtensionsService.js';
import './services/authentication/browser/authenticationUsageService.js';
import './services/authentication/browser/authenticationAccessService.js';
import './services/authentication/browser/authenticationMcpUsageService.js';
import './services/authentication/browser/authenticationMcpAccessService.js';
import './services/authentication/browser/authenticationMcpService.js';
import './services/authentication/browser/dynamicAuthenticationProviderStorageService.js';
import './services/authentication/browser/authenticationQueryService.js';
import '../platform/hover/browser/hoverService.js';
import './services/assignment/common/assignmentService.js';
import './services/outline/browser/outlineService.js';
import './services/languageDetection/browser/languageDetectionWorkerServiceImpl.js';
import '../editor/common/services/languageFeaturesService.js';
import '../editor/common/services/semanticTokensStylingService.js';
import '../editor/common/services/treeViewsDndService.js';
import './services/textMate/browser/textMateTokenizationFeature.contribution.js';
import './services/treeSitter/browser/treeSitter.contribution.js';
import './services/userActivity/common/userActivityService.js';
import './services/userActivity/browser/userActivityBrowser.js';
import './services/userAttention/browser/userAttentionBrowser.js';
import './services/editor/browser/editorPaneService.js';
import './services/editor/common/customEditorLabelService.js';
import './services/dataChannel/browser/dataChannelService.js';
import './services/inlineCompletions/common/inlineCompletionsUnification.js';
import './services/chat/common/chatEntitlementService.js';

import { InstantiationType, registerSingleton } from '../platform/instantiation/common/extensions.js';
import { GlobalExtensionEnablementService } from '../platform/extensionManagement/common/extensionEnablementService.js';
import { IAllowedExtensionsService, IGlobalExtensionEnablementService } from '../platform/extensionManagement/common/extensionManagement.js';
import { ContextViewService } from '../platform/contextview/browser/contextViewService.js';
import { IContextViewService } from '../platform/contextview/browser/contextView.js';
import { IListService, ListService } from '../platform/list/browser/listService.js';
import { MarkerDecorationsService } from '../editor/common/services/markerDecorationsService.js';
import { IMarkerDecorationsService } from '../editor/common/services/markerDecorations.js';
import { IMarkerService } from '../platform/markers/common/markers.js';
import { MarkerService } from '../platform/markers/common/markerService.js';
import { ContextKeyService } from '../platform/contextkey/browser/contextKeyService.js';
import { IContextKeyService } from '../platform/contextkey/common/contextkey.js';
import { ITextResourceConfigurationService } from '../editor/common/services/textResourceConfiguration.js';
import { TextResourceConfigurationService } from '../editor/common/services/textResourceConfigurationService.js';
import { IDownloadService } from '../platform/download/common/download.js';
import { DownloadService } from '../platform/download/common/downloadService.js';
import { OpenerService } from '../editor/browser/services/openerService.js';
import { IOpenerService } from '../platform/opener/common/opener.js';
import { IgnoredExtensionsManagementService, IIgnoredExtensionsManagementService } from '../platform/userDataSync/common/ignoredExtensions.js';
import { ExtensionStorageService, IExtensionStorageService } from '../platform/extensionManagement/common/extensionStorage.js';
import { IUserDataSyncLogService } from '../platform/userDataSync/common/userDataSync.js';
import { UserDataSyncLogService } from '../platform/userDataSync/common/userDataSyncLog.js';
import { AllowedExtensionsService } from '../platform/extensionManagement/common/allowedExtensionsService.js';
import { IAllowedMcpServersService, IMcpGalleryService } from '../platform/mcp/common/mcpManagement.js';
import { McpGalleryService } from '../platform/mcp/common/mcpGalleryService.js';
import { AllowedMcpServersService } from '../platform/mcp/common/allowedMcpServersService.js';
import { IWebWorkerService } from '../platform/webWorker/browser/webWorkerService.js';
import { WebWorkerService } from '../platform/webWorker/browser/webWorkerServiceImpl.js';

registerSingleton(IUserDataSyncLogService, UserDataSyncLogService, InstantiationType.Delayed);
registerSingleton(IAllowedExtensionsService, AllowedExtensionsService, InstantiationType.Delayed);
registerSingleton(IIgnoredExtensionsManagementService, IgnoredExtensionsManagementService, InstantiationType.Delayed);
registerSingleton(IGlobalExtensionEnablementService, GlobalExtensionEnablementService, InstantiationType.Delayed);
registerSingleton(IExtensionStorageService, ExtensionStorageService, InstantiationType.Delayed);
registerSingleton(IContextViewService, ContextViewService, InstantiationType.Delayed);
registerSingleton(IListService, ListService, InstantiationType.Delayed);
registerSingleton(IMarkerDecorationsService, MarkerDecorationsService, InstantiationType.Delayed);
registerSingleton(IMarkerService, MarkerService, InstantiationType.Delayed);
registerSingleton(IContextKeyService, ContextKeyService, InstantiationType.Delayed);
registerSingleton(ITextResourceConfigurationService, TextResourceConfigurationService, InstantiationType.Delayed);
registerSingleton(IDownloadService, DownloadService, InstantiationType.Delayed);
registerSingleton(IOpenerService, OpenerService, InstantiationType.Delayed);
registerSingleton(IWebWorkerService, WebWorkerService, InstantiationType.Delayed);
registerSingleton(IMcpGalleryService, McpGalleryService, InstantiationType.Delayed);
registerSingleton(IAllowedMcpServersService, AllowedMcpServersService, InstantiationType.Delayed);

//#endregion


//#region --- workbench contributions

// Default Account
import './services/accounts/common/defaultAccount.js';

// Telemetry
import './contrib/telemetry/browser/telemetry.contribution.js';

// Preferences
import './contrib/preferences/browser/preferences.contribution.js';
import './contrib/preferences/browser/keybindingsEditorContribution.js';
import './contrib/preferences/browser/preferencesSearch.js';

// Performance
import './contrib/performance/browser/performance.contribution.js';

// Notebook
import './contrib/notebook/browser/notebook.contribution.js';

// Speech
import './contrib/speech/browser/speech.contribution.js';

// Chat
import './contrib/chat/browser/chat.contribution.js';
import './contrib/inlineChat/browser/inlineChat.contribution.js';
import './contrib/mcp/browser/mcp.contribution.js';
import './contrib/chat/browser/chatSessions.contribution.js';
import './contrib/chat/browser/chatContext.contribution.js';

// Interactive
import './contrib/interactive/browser/interactive.contribution.js';

// repl
import './contrib/replNotebook/browser/repl.contribution.js';

// Testing
import './contrib/testing/browser/testing.contribution.js';

// Logs
import './contrib/logs/common/logs.contribution.js';

// Quickaccess
import './contrib/quickaccess/browser/quickAccess.contribution.js';

// Explorer
import './contrib/files/browser/explorerViewlet.js';
import './contrib/files/browser/fileActions.contribution.js';
import './contrib/files/browser/files.contribution.js';

// Bulk Edit
import './contrib/bulkEdit/browser/bulkEditService.js';
import './contrib/bulkEdit/browser/preview/bulkEdit.contribution.js';

// Search
import './contrib/search/browser/search.contribution.js';
import './contrib/search/browser/searchView.js';

// Search Editor
import './contrib/searchEditor/browser/searchEditor.contribution.js';

// Sash
import './contrib/sash/browser/sash.contribution.js';

// SCM
import './contrib/scm/browser/scm.contribution.js';

// Debug
import './contrib/debug/browser/debug.contribution.js';
import './contrib/debug/browser/debugEditorContribution.js';
import './contrib/debug/browser/breakpointEditorContribution.js';
import './contrib/debug/browser/callStackEditorContribution.js';
import './contrib/debug/browser/repl.js';
import './contrib/debug/browser/debugViewlet.js';

// Markers
import './contrib/markers/browser/markers.contribution.js';

// Process Explorer
import './contrib/processExplorer/browser/processExplorer.contribution.js';

// Merge Editor
import './contrib/mergeEditor/browser/mergeEditor.contribution.js';

// Multi Diff Editor
import './contrib/multiDiffEditor/browser/multiDiffEditor.contribution.js';

// Commands
import './contrib/commands/common/commands.contribution.js';

// Comments
import './contrib/comments/browser/comments.contribution.js';

// URL Support
import './contrib/url/browser/url.contribution.js';

// Webview
import './contrib/webview/browser/webview.contribution.js';
import './contrib/webviewPanel/browser/webviewPanel.contribution.js';
import './contrib/webviewView/browser/webviewView.contribution.js';
import './contrib/customEditor/browser/customEditor.contribution.js';

// External Uri Opener
import './contrib/externalUriOpener/common/externalUriOpener.contribution.js';

// Extensions Management
import './contrib/extensions/browser/extensions.contribution.js';
import './contrib/extensions/browser/extensionsViewlet.js';

// Output View
import './contrib/output/browser/output.contribution.js';
import './contrib/output/browser/outputView.js';

// Terminal
import './contrib/terminal/terminal.all.js';

// External terminal
import './contrib/externalTerminal/browser/externalTerminal.contribution.js';

// Relauncher
import './contrib/relauncher/browser/relauncher.contribution.js';

// Tasks
import './contrib/tasks/browser/task.contribution.js';

// Remote
import './contrib/remote/common/remote.contribution.js';
import './contrib/remote/browser/remote.contribution.js';

// Emmet
import './contrib/emmet/browser/emmet.contribution.js';

// CodeEditor Contributions
import './contrib/codeEditor/browser/codeEditor.contribution.js';

// Markdown
import './contrib/markdown/browser/markdown.contribution.js';

// Keybindings Contributions
import './contrib/keybindings/browser/keybindings.contribution.js';

// Snippets
import './contrib/snippets/browser/snippets.contribution.js';

// Formatter Help
import './contrib/format/browser/format.contribution.js';

// Folding
import './contrib/folding/browser/folding.contribution.js';

// Limit Indicator
import './contrib/limitIndicator/browser/limitIndicator.contribution.js';

// Inlay Hint Accessibility
import './contrib/inlayHints/browser/inlayHintsAccessibilty.js';

// Themes
import './contrib/themes/browser/themes.contribution.js';

// Update
import './contrib/update/browser/update.contribution.js';

// Surveys
import './contrib/surveys/browser/nps.contribution.js';
import './contrib/surveys/browser/languageSurveys.contribution.js';

// Welcome
import './contrib/welcomeGettingStarted/browser/gettingStarted.contribution.js';
import './contrib/welcomeWalkthrough/browser/walkThrough.contribution.js';
import './contrib/welcomeViews/common/viewsWelcome.contribution.js';
import './contrib/welcomeViews/common/newFile.contribution.js';

// Call Hierarchy
import './contrib/callHierarchy/browser/callHierarchy.contribution.js';

// Type Hierarchy
import './contrib/typeHierarchy/browser/typeHierarchy.contribution.js';

// Outline
import './contrib/codeEditor/browser/outline/documentSymbolsOutline.js';
import './contrib/outline/browser/outline.contribution.js';

// Language Detection
import './contrib/languageDetection/browser/languageDetection.contribution.js';

// Language Status
import './contrib/languageStatus/browser/languageStatus.contribution.js';

// Authentication
import './contrib/authentication/browser/authentication.contribution.js';

// User Data Sync
import './contrib/userDataSync/browser/userDataSync.contribution.js';

// User Data Profiles
import './contrib/userDataProfile/browser/userDataProfile.contribution.js';

// Continue Edit Session
import './contrib/editSessions/browser/editSessions.contribution.js';

// Remote Coding Agents
import './contrib/remoteCodingAgents/browser/remoteCodingAgents.contribution.js';

// Code Actions
import './contrib/codeActions/browser/codeActions.contribution.js';

// Timeline
import './contrib/timeline/browser/timeline.contribution.js';

// Local History
import './contrib/localHistory/browser/localHistory.contribution.js';

// Workspace
import './contrib/workspace/browser/workspace.contribution.js';

// Workspaces
import './contrib/workspaces/browser/workspaces.contribution.js';

// List
import './contrib/list/browser/list.contribution.js';

// Accessibility Signals
import './contrib/accessibilitySignals/browser/accessibilitySignal.contribution.js';

// Bracket Pair Colorizer 2 Telemetry
import './contrib/bracketPairColorizer2Telemetry/browser/bracketPairColorizer2Telemetry.contribution.js';

// Accessibility
import './contrib/accessibility/browser/accessibility.contribution.js';

// Share
import './contrib/share/browser/share.contribution.js';

// Synchronized Scrolling
import './contrib/scrollLocking/browser/scrollLocking.contribution.js';

// Inline Completions
import './contrib/inlineCompletions/browser/inlineCompletions.contribution.js';

// Drop or paste into
import './contrib/dropOrPasteInto/browser/dropOrPasteInto.contribution.js';

// Edit Telemetry
import './contrib/editTelemetry/browser/editTelemetry.contribution.js';

// Opener
import './contrib/opener/browser/opener.contribution.js';

//#endregion
```

--------------------------------------------------------------------------------

````
