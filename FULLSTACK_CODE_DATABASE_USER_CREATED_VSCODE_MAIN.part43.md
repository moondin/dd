---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 43
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 43 of 552)

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

---[FILE: extensions/github-authentication/src/node/authServer.ts]---
Location: vscode-main/extensions/github-authentication/src/node/authServer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as http from 'http';
import { URL } from 'url';
import * as fs from 'fs';
import * as path from 'path';
import { randomBytes } from 'crypto';
import { env } from 'vscode';

function sendFile(res: http.ServerResponse, filepath: string) {
	const isSvg = filepath.endsWith('.svg');
	fs.readFile(filepath, (err, body) => {
		if (err) {
			console.error(err);
			res.writeHead(404);
			res.end();
		} else {
			if (isSvg) {
				// SVGs need to be served with the correct content type
				res.setHeader('Content-Type', 'image/svg+xml');
			}
			res.setHeader('content-length', body.length);
			res.writeHead(200);
			res.end(body);
		}
	});
}

interface IOAuthResult {
	code: string;
	state: string;
}

interface ILoopbackServer {
	/**
	 * If undefined, the server is not started yet.
	 */
	port: number | undefined;

	/**
	 * The nonce used
	 */
	nonce: string;

	/**
	 * The state parameter used in the OAuth flow.
	 */
	state: string | undefined;

	/**
	 * Starts the server.
	 * @returns The port to listen on.
	 * @throws If the server fails to start.
	 * @throws If the server is already started.
	 */
	start(): Promise<number>;
	/**
	 * Stops the server.
	 * @throws If the server is not started.
	 * @throws If the server fails to stop.
	 */
	stop(): Promise<void>;
	/**
	 * Returns a promise that resolves to the result of the OAuth flow.
	 */
	waitForOAuthResponse(): Promise<IOAuthResult>;
}

export class LoopbackAuthServer implements ILoopbackServer {
	private readonly _server: http.Server;
	private readonly _resultPromise: Promise<IOAuthResult>;
	private _startingRedirect: URL;

	public nonce = randomBytes(16).toString('base64');
	public port: number | undefined;

	public set state(state: string | undefined) {
		if (state) {
			this._startingRedirect.searchParams.set('state', state);
		} else {
			this._startingRedirect.searchParams.delete('state');
		}
	}
	public get state(): string | undefined {
		return this._startingRedirect.searchParams.get('state') ?? undefined;
	}

	constructor(serveRoot: string, startingRedirect: string, callbackUri: string) {
		if (!serveRoot) {
			throw new Error('serveRoot must be defined');
		}
		if (!startingRedirect) {
			throw new Error('startingRedirect must be defined');
		}
		this._startingRedirect = new URL(startingRedirect);
		let deferred: { resolve: (result: IOAuthResult) => void; reject: (reason: any) => void };
		this._resultPromise = new Promise<IOAuthResult>((resolve, reject) => deferred = { resolve, reject });

		const appNameQueryParam = `&app_name=${encodeURIComponent(env.appName)}`;
		this._server = http.createServer((req, res) => {
			const reqUrl = new URL(req.url!, `http://${req.headers.host}`);
			switch (reqUrl.pathname) {
				case '/signin': {
					const receivedNonce = (reqUrl.searchParams.get('nonce') ?? '').replace(/ /g, '+');
					if (receivedNonce !== this.nonce) {
						res.writeHead(302, { location: `/?error=${encodeURIComponent('Nonce does not match.')}${appNameQueryParam}` });
						res.end();
					}
					res.writeHead(302, { location: this._startingRedirect.toString() });
					res.end();
					break;
				}
				case '/callback': {
					const code = reqUrl.searchParams.get('code') ?? undefined;
					const state = reqUrl.searchParams.get('state') ?? undefined;
					const nonce = (reqUrl.searchParams.get('nonce') ?? '').replace(/ /g, '+');
					if (!code || !state || !nonce) {
						res.writeHead(400);
						res.end();
						return;
					}
					if (this.state !== state) {
						res.writeHead(302, { location: `/?error=${encodeURIComponent('State does not match.')}${appNameQueryParam}` });
						res.end();
						throw new Error('State does not match.');
					}
					if (this.nonce !== nonce) {
						res.writeHead(302, { location: `/?error=${encodeURIComponent('Nonce does not match.')}${appNameQueryParam}` });
						res.end();
						throw new Error('Nonce does not match.');
					}
					deferred.resolve({ code, state });
					res.writeHead(302, { location: `/?redirect_uri=${encodeURIComponent(callbackUri)}${appNameQueryParam}` });
					res.end();
					break;
				}
				// Serve the static files
				case '/':
					sendFile(res, path.join(serveRoot, 'index.html'));
					break;
				default:
					// substring to get rid of leading '/'
					sendFile(res, path.join(serveRoot, reqUrl.pathname.substring(1)));
					break;
			}
		});
	}

	public start(): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			if (this._server.listening) {
				throw new Error('Server is already started');
			}
			const portTimeout = setTimeout(() => {
				reject(new Error('Timeout waiting for port'));
			}, 5000);
			this._server.on('listening', () => {
				const address = this._server.address();
				if (typeof address === 'string') {
					this.port = parseInt(address);
				} else if (address instanceof Object) {
					this.port = address.port;
				} else {
					throw new Error('Unable to determine port');
				}

				clearTimeout(portTimeout);

				// set state which will be used to redirect back to vscode
				this.state = `http://127.0.0.1:${this.port}/callback?nonce=${encodeURIComponent(this.nonce)}`;

				resolve(this.port);
			});
			this._server.on('error', err => {
				reject(new Error(`Error listening to server: ${err}`));
			});
			this._server.on('close', () => {
				reject(new Error('Closed'));
			});
			this._server.listen(0, '127.0.0.1');
		});
	}

	public stop(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			if (!this._server.listening) {
				throw new Error('Server is not started');
			}
			this._server.close((err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	public waitForOAuthResponse(): Promise<IOAuthResult> {
		return this._resultPromise;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/node/buffer.ts]---
Location: vscode-main/extensions/github-authentication/src/node/buffer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function base64Encode(text: string): string {
	return Buffer.from(text, 'binary').toString('base64');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/node/crypto.ts]---
Location: vscode-main/extensions/github-authentication/src/node/crypto.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { webcrypto } from 'crypto';

export const crypto = webcrypto;
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/node/fetch.ts]---
Location: vscode-main/extensions/github-authentication/src/node/fetch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as http from 'http';
import * as https from 'https';
import { workspace } from 'vscode';
import { Log } from '../common/logger';
import { Readable } from 'stream';

export interface FetchOptions {
	logger: Log;
	retryFallbacks: boolean;
	expectJSON: boolean;
	method?: 'GET' | 'POST' | 'DELETE';
	headers?: Record<string, string>;
	body?: string;
	signal?: AbortSignal;
}

export interface FetchHeaders {
	get(name: string): string | null;
}

export interface FetchResponse {
	ok: boolean;
	status: number;
	statusText: string;
	headers: FetchHeaders;
	text(): Promise<string>;
	json(): Promise<any>;
}

export type Fetch = (url: string, options: FetchOptions) => Promise<FetchResponse>;

interface Fetcher {
	name: string;
	fetch: Fetch;
}

const _fetchers: Fetcher[] = [];
try {
	_fetchers.push({
		name: 'Electron fetch',
		fetch: require('electron').net.fetch
	});
} catch {
	// ignore
}

const nodeFetch = {
	name: 'Node fetch',
	fetch,
};
const useElectronFetch = workspace.getConfiguration('github-authentication').get<boolean>('useElectronFetch', true);
if (useElectronFetch) {
	_fetchers.push(nodeFetch);
} else {
	_fetchers.unshift(nodeFetch);
}

_fetchers.push({
	name: 'Node http/s',
	fetch: nodeHTTP,
});

export function createFetch(): Fetch {
	let fetchers: readonly Fetcher[] = _fetchers;
	return async (url, options) => {
		const result = await fetchWithFallbacks(fetchers, url, options, options.logger);
		if (result.updatedFetchers) {
			fetchers = result.updatedFetchers;
		}
		return result.response;
	};
}

function shouldNotRetry(status: number): boolean {
	// Don't retry with other fetchers for these HTTP status codes:
	// - 429 Too Many Requests (rate limiting)
	// - 401 Unauthorized (authentication issue)
	// - 403 Forbidden (authorization issue)
	// - 404 Not Found (resource doesn't exist)
	// These are application-level errors where retrying with a different fetcher won't help
	return status === 429 || status === 401 || status === 403 || status === 404;
}

async function fetchWithFallbacks(availableFetchers: readonly Fetcher[], url: string, options: FetchOptions, logService: Log): Promise<{ response: FetchResponse; updatedFetchers?: Fetcher[] }> {
	if (options.retryFallbacks && availableFetchers.length > 1) {
		let firstResult: { ok: boolean; response: FetchResponse } | { ok: false; err: any } | undefined;
		for (const fetcher of availableFetchers) {
			const result = await tryFetch(fetcher, url, options, logService);
			if (fetcher === availableFetchers[0]) {
				firstResult = result;
			}
			if (!result.ok) {
				// For certain HTTP status codes, don't retry with other fetchers
				// These are application-level errors, not network-level errors
				if ('response' in result && shouldNotRetry(result.response.status)) {
					return { response: result.response };
				}
				continue;
			}
			if (fetcher !== availableFetchers[0]) {
				const retry = await tryFetch(availableFetchers[0], url, options, logService);
				if (retry.ok) {
					return { response: retry.response };
				}
				logService.info(`FetcherService: using ${fetcher.name} from now on`);
				const updatedFetchers = availableFetchers.slice();
				updatedFetchers.splice(updatedFetchers.indexOf(fetcher), 1);
				updatedFetchers.unshift(fetcher);
				return { response: result.response, updatedFetchers };
			}
			return { response: result.response };
		}
		if ('response' in firstResult!) {
			return { response: firstResult.response };
		}
		throw firstResult!.err;
	}
	return { response: await availableFetchers[0].fetch(url, options) };
}

async function tryFetch(fetcher: Fetcher, url: string, options: FetchOptions, logService: Log): Promise<{ ok: boolean; response: FetchResponse } | { ok: false; err: any }> {
	try {
		logService.debug(`FetcherService: trying fetcher ${fetcher.name} for ${url}`);
		const response = await fetcher.fetch(url, options);
		if (!response.ok) {
			logService.info(`FetcherService: ${fetcher.name} failed with status: ${response.status} ${response.statusText}`);
			return { ok: false, response };
		}
		if (!options.expectJSON) {
			logService.debug(`FetcherService: ${fetcher.name} succeeded (not JSON)`);
			return { ok: response.ok, response };
		}
		const text = await response.text();
		try {
			const json = JSON.parse(text); // Verify JSON
			logService.debug(`FetcherService: ${fetcher.name} succeeded (JSON)`);
			return { ok: true, response: new FetchResponseImpl(response.status, response.statusText, response.headers, async () => text, async () => json, async () => Readable.from([text])) };
		} catch (err) {
			logService.info(`FetcherService: ${fetcher.name} failed to parse JSON: ${err.message}`);
			return { ok: false, err, response: new FetchResponseImpl(response.status, response.statusText, response.headers, async () => text, async () => { throw err; }, async () => Readable.from([text])) };
		}
	} catch (err) {
		logService.info(`FetcherService: ${fetcher.name} failed with error: ${err.message}`);
		return { ok: false, err };
	}
}

export const fetching = createFetch();

class FetchResponseImpl implements FetchResponse {
	public readonly ok: boolean;
	constructor(
		public readonly status: number,
		public readonly statusText: string,
		public readonly headers: FetchHeaders,
		public readonly text: () => Promise<string>,
		public readonly json: () => Promise<any>,
		public readonly body: () => Promise<NodeJS.ReadableStream | null>,
	) {
		this.ok = this.status >= 200 && this.status < 300;
	}
}

async function nodeHTTP(url: string, options: FetchOptions): Promise<FetchResponse> {
	return new Promise((resolve, reject) => {
		const { method, headers, body, signal } = options;
		const module = url.startsWith('https:') ? https : http;
		const req = module.request(url, { method, headers }, res => {
			if (signal?.aborted) {
				res.destroy();
				req.destroy();
				reject(makeAbortError(signal));
				return;
			}

			const nodeFetcherResponse = new NodeFetcherResponse(req, res, signal);
			resolve(new FetchResponseImpl(
				res.statusCode || 0,
				res.statusMessage || '',
				nodeFetcherResponse.headers,
				async () => nodeFetcherResponse.text(),
				async () => nodeFetcherResponse.json(),
				async () => nodeFetcherResponse.body(),
			));
		});
		req.setTimeout(60 * 1000); // time out after 60s of receiving no data
		req.on('error', reject);

		if (body) {
			req.write(body);
		}
		req.end();
	});
}

class NodeFetcherResponse {

	readonly headers: FetchHeaders;

	constructor(
		readonly req: http.ClientRequest,
		readonly res: http.IncomingMessage,
		readonly signal: AbortSignal | undefined,
	) {
		this.headers = new class implements FetchHeaders {
			get(name: string): string | null {
				const result = res.headers[name];
				return Array.isArray(result) ? result[0] : result ?? null;
			}
			[Symbol.iterator](): Iterator<[string, string], any, undefined> {
				const keys = Object.keys(res.headers);
				let index = 0;
				return {
					next: (): IteratorResult<[string, string]> => {
						if (index >= keys.length) {
							return { done: true, value: undefined };
						}
						const key = keys[index++];
						return { done: false, value: [key, this.get(key)!] };
					}
				};
			}
		};
	}

	public text(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const chunks: Buffer[] = [];
			this.res.on('data', chunk => chunks.push(chunk));
			this.res.on('end', () => resolve(Buffer.concat(chunks).toString()));
			this.res.on('error', reject);
			this.signal?.addEventListener('abort', () => {
				this.res.destroy();
				this.req.destroy();
				reject(makeAbortError(this.signal!));
			});
		});
	}

	public async json(): Promise<any> {
		const text = await this.text();
		return JSON.parse(text);
	}

	public async body(): Promise<NodeJS.ReadableStream | null> {
		this.signal?.addEventListener('abort', () => {
			this.res.emit('error', makeAbortError(this.signal!));
			this.res.destroy();
			this.req.destroy();
		});
		return this.res;
	}
}

function makeAbortError(signal: AbortSignal): Error {
	// see https://github.com/nodejs/node/issues/38361#issuecomment-1683839467
	return signal.reason;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/test/flows.test.ts]---
Location: vscode-main/extensions/github-authentication/src/test/flows.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { ExtensionHost, GitHubTarget, IFlowQuery, getFlows } from '../flows';
import { Config } from '../config';
import * as vscode from 'vscode';

const enum Flows {
	UrlHandlerFlow = 'url handler',
	LocalServerFlow = 'local server',
	DeviceCodeFlow = 'device code',
	PatFlow = 'personal access token'
}

suite('getFlows', () => {
	let lastClientSecret: string | undefined = undefined;
	suiteSetup(() => {
		lastClientSecret = Config.gitHubClientSecret;
		Config.gitHubClientSecret = 'asdf';
	});

	suiteTeardown(() => {
		Config.gitHubClientSecret = lastClientSecret;
	});

	const testCases: Array<{ label: string; query: IFlowQuery; expectedFlows: Flows[] }> = [
		{
			label: 'VS Code Desktop. Local filesystem. GitHub.com',
			query: {
				extensionHost: ExtensionHost.Local,
				isSupportedClient: true,
				target: GitHubTarget.DotCom
			},
			expectedFlows: [
				Flows.LocalServerFlow,
				Flows.UrlHandlerFlow,
				Flows.DeviceCodeFlow
			]
		},
		{
			label: 'VS Code Desktop. Local filesystem. GitHub Hosted Enterprise',
			query: {
				extensionHost: ExtensionHost.Local,
				isSupportedClient: true,
				target: GitHubTarget.HostedEnterprise
			},
			expectedFlows: [
				Flows.LocalServerFlow,
				Flows.UrlHandlerFlow,
				Flows.DeviceCodeFlow,
				Flows.PatFlow
			]
		},
		{
			label: 'VS Code Desktop. Local filesystem. GitHub Enterprise Server',
			query: {
				extensionHost: ExtensionHost.Local,
				isSupportedClient: true,
				target: GitHubTarget.Enterprise
			},
			expectedFlows: [
				Flows.DeviceCodeFlow,
				Flows.PatFlow
			]
		},
		{
			label: 'vscode.dev. serverful. GitHub.com',
			query: {
				extensionHost: ExtensionHost.Remote,
				isSupportedClient: true,
				target: GitHubTarget.DotCom
			},
			expectedFlows: [
				Flows.UrlHandlerFlow,
				Flows.DeviceCodeFlow
			]
		},
		{
			label: 'vscode.dev. serverful. GitHub Hosted Enterprise',
			query: {
				extensionHost: ExtensionHost.Remote,
				isSupportedClient: true,
				target: GitHubTarget.HostedEnterprise
			},
			expectedFlows: [
				Flows.UrlHandlerFlow,
				Flows.DeviceCodeFlow,
				Flows.PatFlow
			]
		},
		{
			label: 'vscode.dev. serverful. GitHub Enterprise',
			query: {
				extensionHost: ExtensionHost.Remote,
				isSupportedClient: true,
				target: GitHubTarget.Enterprise
			},
			expectedFlows: [
				Flows.DeviceCodeFlow,
				Flows.PatFlow
			]
		},
		{
			label: 'vscode.dev. serverless. GitHub.com',
			query: {
				extensionHost: ExtensionHost.WebWorker,
				isSupportedClient: true,
				target: GitHubTarget.DotCom
			},
			expectedFlows: [
				Flows.UrlHandlerFlow
			]
		},
		{
			label: 'vscode.dev. serverless. GitHub Hosted Enterprise',
			query: {
				extensionHost: ExtensionHost.WebWorker,
				isSupportedClient: true,
				target: GitHubTarget.HostedEnterprise
			},
			expectedFlows: [
				Flows.UrlHandlerFlow,
				Flows.PatFlow
			]
		},
		{
			label: 'vscode.dev. serverless. GitHub Enterprise Server',
			query: {
				extensionHost: ExtensionHost.WebWorker,
				isSupportedClient: true,
				target: GitHubTarget.Enterprise
			},
			expectedFlows: [
				Flows.PatFlow
			]
		},
		{
			label: 'Code - OSS. Local filesystem. GitHub.com',
			query: {
				extensionHost: ExtensionHost.Local,
				isSupportedClient: false,
				target: GitHubTarget.DotCom
			},
			expectedFlows: [
				Flows.LocalServerFlow,
				Flows.DeviceCodeFlow,
				Flows.PatFlow
			]
		},
		{
			label: 'Code - OSS. Local filesystem. GitHub Hosted Enterprise',
			query: {
				extensionHost: ExtensionHost.Local,
				isSupportedClient: false,
				target: GitHubTarget.HostedEnterprise
			},
			expectedFlows: [
				Flows.LocalServerFlow,
				Flows.DeviceCodeFlow,
				Flows.PatFlow
			]
		},
		{
			label: 'Code - OSS. Local filesystem. GitHub Enterprise Server',
			query: {
				extensionHost: ExtensionHost.Local,
				isSupportedClient: false,
				target: GitHubTarget.Enterprise
			},
			expectedFlows: [
				Flows.DeviceCodeFlow,
				Flows.PatFlow
			]
		},
	];

	for (const testCase of testCases) {
		test(`gives the correct flows - ${testCase.label}`, () => {
			const flows = getFlows(testCase.query);

			assert.strictEqual(
				flows.length,
				testCase.expectedFlows.length,
				`Unexpected number of flows: ${flows.map(f => f.label).join(',')}`
			);

			for (let i = 0; i < flows.length; i++) {
				const flow = flows[i];

				assert.strictEqual(flow.label, testCase.expectedFlows[i]);
			}
		});
	}

	suite('preferDeviceCodeFlow configuration', () => {
		let originalConfig: boolean | undefined;

		suiteSetup(async () => {
			const config = vscode.workspace.getConfiguration('github-authentication');
			originalConfig = config.get<boolean>('preferDeviceCodeFlow');
		});

		suiteTeardown(async () => {
			const config = vscode.workspace.getConfiguration('github-authentication');
			await config.update('preferDeviceCodeFlow', originalConfig, vscode.ConfigurationTarget.Global);
		});

		test('returns device code flow first when preferDeviceCodeFlow is true - VS Code Desktop', async () => {
			const config = vscode.workspace.getConfiguration('github-authentication');
			await config.update('preferDeviceCodeFlow', true, vscode.ConfigurationTarget.Global);

			const flows = getFlows({
				extensionHost: ExtensionHost.Local,
				isSupportedClient: true,
				target: GitHubTarget.DotCom
			});

			// Should return device code flow first, then other flows
			assert.strictEqual(flows.length, 3, `Expected 3 flows, got ${flows.length}: ${flows.map(f => f.label).join(',')}`);
			assert.strictEqual(flows[0].label, Flows.DeviceCodeFlow);
			// Other flows should still be available
			assert.strictEqual(flows[1].label, Flows.LocalServerFlow);
			assert.strictEqual(flows[2].label, Flows.UrlHandlerFlow);
		});

		test('returns device code flow first when preferDeviceCodeFlow is true - Remote', async () => {
			const config = vscode.workspace.getConfiguration('github-authentication');
			await config.update('preferDeviceCodeFlow', true, vscode.ConfigurationTarget.Global);

			const flows = getFlows({
				extensionHost: ExtensionHost.Remote,
				isSupportedClient: true,
				target: GitHubTarget.DotCom
			});

			// Should return device code flow first, then other flows
			assert.strictEqual(flows.length, 2, `Expected 2 flows, got ${flows.length}: ${flows.map(f => f.label).join(',')}`);
			assert.strictEqual(flows[0].label, Flows.DeviceCodeFlow);
			assert.strictEqual(flows[1].label, Flows.UrlHandlerFlow);
		});

		test('returns normal flows when preferDeviceCodeFlow is true but device code flow is not supported - WebWorker', async () => {
			const config = vscode.workspace.getConfiguration('github-authentication');
			await config.update('preferDeviceCodeFlow', true, vscode.ConfigurationTarget.Global);

			const flows = getFlows({
				extensionHost: ExtensionHost.WebWorker,
				isSupportedClient: true,
				target: GitHubTarget.DotCom
			});

			// WebWorker doesn't support DeviceCodeFlow, so should return normal flows
			// Based on the original logic, WebWorker + DotCom should return UrlHandlerFlow
			assert.strictEqual(flows.length, 1, `Expected 1 flow for WebWorker configuration, got ${flows.length}: ${flows.map(f => f.label).join(',')}`);
			assert.strictEqual(flows[0].label, Flows.UrlHandlerFlow);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/test/node/authServer.test.ts]---
Location: vscode-main/extensions/github-authentication/src/test/node/authServer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { LoopbackAuthServer } from '../../node/authServer';
import { env } from 'vscode';

suite('LoopbackAuthServer', () => {
	let server: LoopbackAuthServer;
	let port: number;

	setup(async () => {
		server = new LoopbackAuthServer(__dirname, 'http://localhost:8080', 'https://code.visualstudio.com');
		port = await server.start();
	});

	teardown(async () => {
		await server.stop();
	});

	test('should redirect to starting redirect on /signin', async () => {
		const response = await fetch(`http://localhost:${port}/signin?nonce=${server.nonce}`, {
			redirect: 'manual'
		});
		// Redirect
		assert.strictEqual(response.status, 302);

		// Check location
		const location = response.headers.get('location');
		assert.ok(location);
		const locationUrl = new URL(location);
		assert.strictEqual(locationUrl.origin, 'http://localhost:8080');

		// Check state
		const state = locationUrl.searchParams.get('state');
		assert.ok(state);
		const stateLocation = new URL(state);
		assert.strictEqual(stateLocation.origin, `http://127.0.0.1:${port}`);
		assert.strictEqual(stateLocation.pathname, '/callback');
		assert.strictEqual(stateLocation.searchParams.get('nonce'), server.nonce);
	});

	test('should return 400 on /callback with missing parameters', async () => {
		const response = await fetch(`http://localhost:${port}/callback`);
		assert.strictEqual(response.status, 400);
	});

	test('should resolve with code and state on /callback with valid parameters', async () => {
		server.state = 'valid-state';
		const response = await fetch(
			`http://localhost:${port}/callback?code=valid-code&state=${server.state}&nonce=${server.nonce}`,
			{ redirect: 'manual' }
		);
		assert.strictEqual(response.status, 302);
		assert.strictEqual(response.headers.get('location'), `/?redirect_uri=https%3A%2F%2Fcode.visualstudio.com&app_name=${encodeURIComponent(env.appName)}`);
		await Promise.race([
			server.waitForOAuthResponse().then(result => {
				assert.strictEqual(result.code, 'valid-code');
				assert.strictEqual(result.state, server.state);
			}),
			new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
		]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/test/node/fetch.test.ts]---
Location: vscode-main/extensions/github-authentication/src/test/node/fetch.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as http from 'http';
import * as net from 'net';
import { createFetch } from '../../node/fetch';
import { Log } from '../../common/logger';
import { AuthProviderType } from '../../github';


suite('fetching', () => {
	const logger = new Log(AuthProviderType.github);
	let server: http.Server;
	let port: number;

	setup(async () => {
		await new Promise<void>((resolve) => {
			server = http.createServer((req, res) => {
				const reqUrl = new URL(req.url!, `http://${req.headers.host}`);
				const expectAgent = reqUrl.searchParams.get('expectAgent');
				const actualAgent = String(req.headers['user-agent']).toLowerCase();
				if (expectAgent && !actualAgent.includes(expectAgent)) {
					if (reqUrl.searchParams.get('error') === 'html') {
						res.writeHead(200, {
							'Content-Type': 'text/html',
							'X-Client-User-Agent': actualAgent,
						});
						res.end('<html><body><h1>Bad Request</h1></body></html>');
						return;
					} else {
						res.writeHead(400, {
							'X-Client-User-Agent': actualAgent,
						});
						res.end('Bad Request');
						return;
					}
				}
				switch (reqUrl.pathname) {
					case '/json': {
						res.writeHead(200, {
							'Content-Type': 'application/json',
							'X-Client-User-Agent': actualAgent,
						});
						res.end(JSON.stringify({ message: 'Hello, world!' }));
						break;
					}
					case '/text': {
						res.writeHead(200, {
							'Content-Type': 'text/plain',
							'X-Client-User-Agent': actualAgent,
						});
						res.end('Hello, world!');
						break;
					}
					default:
						res.writeHead(404);
						res.end('Not Found');
						break;
				}
			}).listen(() => {
				port = (server.address() as net.AddressInfo).port;
				resolve();
			});
		});
	});

	teardown(async () => {
		await new Promise<unknown>((resolve) => {
			server.close(resolve);
		});
	});

	test('should use Electron fetch', async () => {
		const res = await createFetch()(`http://localhost:${port}/json`, {
			logger,
			retryFallbacks: true,
			expectJSON: true,
		});
		const actualAgent = res.headers.get('x-client-user-agent') || 'None';
		assert.ok(actualAgent.includes('electron'), actualAgent);
		assert.strictEqual(res.status, 200);
		assert.deepStrictEqual(await res.json(), { message: 'Hello, world!' });
	});

	test('should use Electron fetch 2', async () => {
		const res = await createFetch()(`http://localhost:${port}/text`, {
			logger,
			retryFallbacks: true,
			expectJSON: false,
		});
		const actualAgent = res.headers.get('x-client-user-agent') || 'None';
		assert.ok(actualAgent.includes('electron'), actualAgent);
		assert.strictEqual(res.status, 200);
		assert.deepStrictEqual(await res.text(), 'Hello, world!');
	});

	test('should fall back to Node.js fetch', async () => {
		const res = await createFetch()(`http://localhost:${port}/json?expectAgent=node`, {
			logger,
			retryFallbacks: true,
			expectJSON: true,
		});
		const actualAgent = res.headers.get('x-client-user-agent') || 'None';
		assert.strictEqual(actualAgent, 'node');
		assert.strictEqual(res.status, 200);
		assert.deepStrictEqual(await res.json(), { message: 'Hello, world!' });
	});

	test('should fall back to Node.js fetch 2', async () => {
		const res = await createFetch()(`http://localhost:${port}/json?expectAgent=node&error=html`, {
			logger,
			retryFallbacks: true,
			expectJSON: true,
		});
		const actualAgent = res.headers.get('x-client-user-agent') || 'None';
		assert.strictEqual(actualAgent, 'node');
		assert.strictEqual(res.status, 200);
		assert.deepStrictEqual(await res.json(), { message: 'Hello, world!' });
	});

	test('should fall back to Node.js http/s', async () => {
		const res = await createFetch()(`http://localhost:${port}/json?expectAgent=undefined`, {
			logger,
			retryFallbacks: true,
			expectJSON: true,
		});
		const actualAgent = res.headers.get('x-client-user-agent') || 'None';
		assert.strictEqual(actualAgent, 'undefined');
		assert.strictEqual(res.status, 200);
		assert.deepStrictEqual(await res.json(), { message: 'Hello, world!' });
	});

	test('should fail with first error', async () => {
		const res = await createFetch()(`http://localhost:${port}/text`, {
			logger,
			retryFallbacks: true,
			expectJSON: true, // Expect JSON but server returns text
		});
		const actualAgent = res.headers.get('x-client-user-agent') || 'None';
		assert.ok(actualAgent.includes('electron'), actualAgent);
		assert.strictEqual(res.status, 200);
		assert.deepStrictEqual(await res.text(), 'Hello, world!');
	});

	test('should not retry with other fetchers on 429 status', async () => {
		// Set up server to return 429 for the first request
		let requestCount = 0;
		const oldListener = server.listeners('request')[0] as (req: http.IncomingMessage, res: http.ServerResponse) => void;
		if (!oldListener) {
			throw new Error('No request listener found on server');
		}
		
		server.removeAllListeners('request');
		server.on('request', (req, res) => {
			requestCount++;
			if (req.url === '/rate-limited') {
				res.writeHead(429, {
					'Content-Type': 'text/plain',
					'X-Client-User-Agent': String(req.headers['user-agent'] ?? '').toLowerCase(),
				});
				res.end('Too Many Requests');
			} else {
				oldListener(req, res);
			}
		});

		try {
			const res = await createFetch()(`http://localhost:${port}/rate-limited`, {
				logger,
				retryFallbacks: true,
				expectJSON: false,
			});

			// Verify only one request was made (no fallback attempts)
			assert.strictEqual(requestCount, 1, 'Should only make one request for 429 status');
			assert.strictEqual(res.status, 429);
			// Note: We only check that we got a response, not which fetcher was used,
			// as the fetcher order may vary by configuration
			assert.strictEqual(await res.text(), 'Too Many Requests');
		} finally {
			// Restore original listener
			server.removeAllListeners('request');
			server.on('request', oldListener);
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/go/.vscodeignore]---
Location: vscode-main/extensions/go/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/go/cgmanifest.json]---
Location: vscode-main/extensions/go/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "go-syntax",
					"repositoryUrl": "https://github.com/worlpaker/go-syntax",
					"commitHash": "8c70c078f56d237f72574ce49cc95839c4f8a741"
				}
			},
			"license": "MIT",
			"description": "The file syntaxes/go.tmLanguage.json is from https://github.com/worlpaker/go-syntax, which in turn was derived from https://github.com/jeff-hykin/better-go-syntax.",
			"version": "0.8.4"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/go/language-configuration.json]---
Location: vscode-main/extensions/go/language-configuration.json

```json
{
	"comments": {
		"lineComment": "//",
		"blockComment": [
			"/*",
			"*/"
		]
	},
	"brackets": [
		[
			"{",
			"}"
		],
		[
			"[",
			"]"
		],
		[
			"(",
			")"
		]
	],
	"autoClosingPairs": [
		[
			"{",
			"}"
		],
		[
			"[",
			"]"
		],
		[
			"(",
			")"
		],
		{
			"open": "`",
			"close": "`",
			"notIn": [
				"string"
			]
		},
		{
			"open": "\"",
			"close": "\"",
			"notIn": [
				"string"
			]
		},
		{
			"open": "'",
			"close": "'",
			"notIn": [
				"string",
				"comment"
			]
		}
	],
	"surroundingPairs": [
		[
			"{",
			"}"
		],
		[
			"[",
			"]"
		],
		[
			"(",
			")"
		],
		[
			"\"",
			"\""
		],
		[
			"'",
			"'"
		],
		[
			"`",
			"`"
		]
	],
	"indentationRules": {
		"increaseIndentPattern": "^.*(\\bcase\\b.*:|\\bdefault\\b:|(\\b(func|if|else|switch|select|for|struct)\\b.*)?{[^}\"'`]*|\\([^)\"'`]*)$",
		"decreaseIndentPattern": "^\\s*(\\bcase\\b.*:|\\bdefault\\b:|}[)}]*[),]?|\\)[,]?)$"
	},
	"folding": {
		"markers": {
			"start": "^\\s*//\\s*#?region\\b",
			"end": "^\\s*//\\s*#?endregion\\b"
		}
	},
	"onEnterRules": [
		// Add // when pressing enter from inside line comment
		{
			"beforeText": {
				"pattern": "\/\/.*"
			},
			"afterText": {
				"pattern": "^(?!\\s*$).+"
			},
			"action": {
				"indent": "none",
				"appendText": "// "
			}
		},
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/go/package.json]---
Location: vscode-main/extensions/go/package.json

```json
{
  "name": "go",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin worlpaker/go-syntax syntaxes/go.tmLanguage.json ./syntaxes/go.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "go",
        "extensions": [
          ".go"
        ],
        "aliases": [
          "Go"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "go",
        "scopeName": "source.go",
        "path": "./syntaxes/go.tmLanguage.json"
      }
    ],
    "configurationDefaults": {
      "[go]": {
        "editor.insertSpaces": false
      }
    }
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/go/package.nls.json]---
Location: vscode-main/extensions/go/package.nls.json

```json
{
	"displayName": "Go Language Basics",
	"description": "Provides syntax highlighting and bracket matching in Go files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/go/syntaxes/go.tmLanguage.json]---
Location: vscode-main/extensions/go/syntaxes/go.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/worlpaker/go-syntax/blob/master/syntaxes/go.tmLanguage.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/worlpaker/go-syntax/commit/8c70c078f56d237f72574ce49cc95839c4f8a741",
	"name": "Go",
	"scopeName": "source.go",
	"patterns": [
		{
			"include": "#statements"
		}
	],
	"repository": {
		"statements": {
			"patterns": [
				{
					"include": "#package_name"
				},
				{
					"include": "#import"
				},
				{
					"include": "#syntax_errors"
				},
				{
					"include": "#group-functions"
				},
				{
					"include": "#group-types"
				},
				{
					"include": "#group-variables"
				},
				{
					"include": "#hover"
				}
			]
		},
		"group-functions": {
			"comment": "all statements related to functions",
			"patterns": [
				{
					"include": "#function_declaration"
				},
				{
					"include": "#functions_inline"
				},
				{
					"include": "#functions"
				},
				{
					"include": "#built_in_functions"
				},
				{
					"include": "#support_functions"
				}
			]
		},
		"group-types": {
			"comment": "all statements related to types",
			"patterns": [
				{
					"include": "#other_struct_interface_expressions"
				},
				{
					"include": "#type_assertion_inline"
				},
				{
					"include": "#struct_variables_types"
				},
				{
					"include": "#interface_variables_types"
				},
				{
					"include": "#single_type"
				},
				{
					"include": "#multi_types"
				},
				{
					"include": "#struct_interface_declaration"
				},
				{
					"include": "#double_parentheses_types"
				},
				{
					"include": "#switch_types"
				},
				{
					"include": "#type-declarations"
				}
			]
		},
		"group-variables": {
			"comment": "all statements related to variables",
			"patterns": [
				{
					"include": "#const_assignment"
				},
				{
					"include": "#var_assignment"
				},
				{
					"include": "#variable_assignment"
				},
				{
					"include": "#label_loop_variables"
				},
				{
					"include": "#slice_index_variables"
				},
				{
					"include": "#property_variables"
				},
				{
					"include": "#switch_variables"
				},
				{
					"include": "#other_variables"
				}
			]
		},
		"type-declarations": {
			"comment": "includes all type declarations",
			"patterns": [
				{
					"include": "#language_constants"
				},
				{
					"include": "#comments"
				},
				{
					"include": "#map_types"
				},
				{
					"include": "#brackets"
				},
				{
					"include": "#delimiters"
				},
				{
					"include": "#keywords"
				},
				{
					"include": "#operators"
				},
				{
					"include": "#runes"
				},
				{
					"include": "#storage_types"
				},
				{
					"include": "#raw_string_literals"
				},
				{
					"include": "#string_literals"
				},
				{
					"include": "#numeric_literals"
				},
				{
					"include": "#terminators"
				}
			]
		},
		"type-declarations-without-brackets": {
			"comment": "includes all type declarations without brackets (in some cases, brackets need to be captured manually)",
			"patterns": [
				{
					"include": "#language_constants"
				},
				{
					"include": "#comments"
				},
				{
					"include": "#map_types"
				},
				{
					"include": "#delimiters"
				},
				{
					"include": "#keywords"
				},
				{
					"include": "#operators"
				},
				{
					"include": "#runes"
				},
				{
					"include": "#storage_types"
				},
				{
					"include": "#raw_string_literals"
				},
				{
					"include": "#string_literals"
				},
				{
					"include": "#numeric_literals"
				},
				{
					"include": "#terminators"
				}
			]
		},
		"parameter-variable-types": {
			"comment": "function and generic parameter types",
			"patterns": [
				{
					"match": "\\{",
					"name": "punctuation.definition.begin.bracket.curly.go"
				},
				{
					"match": "\\}",
					"name": "punctuation.definition.end.bracket.curly.go"
				},
				{
					"begin": "([\\w\\.\\*]+)?(\\[)",
					"beginCaptures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						},
						"2": {
							"name": "punctuation.definition.begin.bracket.square.go"
						}
					},
					"end": "\\]",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.square.go"
						}
					},
					"patterns": [
						{
							"include": "#generic_param_types"
						}
					]
				},
				{
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.begin.bracket.round.go"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.round.go"
						}
					},
					"patterns": [
						{
							"include": "#function_param_types"
						}
					]
				}
			]
		},
		"language_constants": {
			"comment": "Language constants",
			"match": "\\b(?:(true|false)|(nil)|(iota))\\b",
			"captures": {
				"1": {
					"name": "constant.language.boolean.go"
				},
				"2": {
					"name": "constant.language.null.go"
				},
				"3": {
					"name": "constant.language.iota.go"
				}
			}
		},
		"comments": {
			"patterns": [
				{
					"name": "comment.block.go",
					"begin": "(\\/\\*)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.comment.go"
						}
					},
					"end": "(\\*\\/)",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.comment.go"
						}
					}
				},
				{
					"name": "comment.line.double-slash.go",
					"begin": "(\\/\\/)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.comment.go"
						}
					},
					"end": "(?:\\n|$)"
				}
			]
		},
		"map_types": {
			"comment": "map types",
			"begin": "(\\bmap\\b)(\\[)",
			"beginCaptures": {
				"1": {
					"name": "keyword.map.go"
				},
				"2": {
					"name": "punctuation.definition.begin.bracket.square.go"
				}
			},
			"end": "(?:(\\])((?:(?:(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?(?!(?:[\\[\\]\\*]+)?\\b(?:func|struct|map)\\b)(?:[\\*\\[\\]]+)?(?:[\\w\\.]+)(?:\\[(?:(?:[\\w\\.\\*\\[\\]\\{\\}]+)(?:(?:\\,\\s*(?:[\\w\\.\\*\\[\\]\\{\\}]+))*))?\\])?)?)",
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.end.bracket.square.go"
				},
				"2": {
					"patterns": [
						{
							"include": "#type-declarations-without-brackets"
						},
						{
							"match": "\\[",
							"name": "punctuation.definition.begin.bracket.square.go"
						},
						{
							"match": "\\]",
							"name": "punctuation.definition.end.bracket.square.go"
						},
						{
							"match": "\\w+",
							"name": "entity.name.type.go"
						}
					]
				}
			},
			"patterns": [
				{
					"include": "#type-declarations-without-brackets"
				},
				{
					"include": "#parameter-variable-types"
				},
				{
					"include": "#functions"
				},
				{
					"match": "\\[",
					"name": "punctuation.definition.begin.bracket.square.go"
				},
				{
					"match": "\\]",
					"name": "punctuation.definition.end.bracket.square.go"
				},
				{
					"match": "\\{",
					"name": "punctuation.definition.begin.bracket.curly.go"
				},
				{
					"match": "\\}",
					"name": "punctuation.definition.end.bracket.curly.go"
				},
				{
					"match": "\\(",
					"name": "punctuation.definition.begin.bracket.round.go"
				},
				{
					"match": "\\)",
					"name": "punctuation.definition.end.bracket.round.go"
				},
				{
					"match": "\\w+",
					"name": "entity.name.type.go"
				}
			]
		},
		"brackets": {
			"patterns": [
				{
					"begin": "\\{",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.begin.bracket.curly.go"
						}
					},
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.curly.go"
						}
					},
					"patterns": [
						{
							"include": "$self"
						}
					]
				},
				{
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.begin.bracket.round.go"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.round.go"
						}
					},
					"patterns": [
						{
							"include": "$self"
						}
					]
				},
				{
					"begin": "\\[",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.begin.bracket.square.go"
						}
					},
					"end": "\\]",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.square.go"
						}
					},
					"patterns": [
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"delimiters": {
			"patterns": [
				{
					"match": "\\,",
					"name": "punctuation.other.comma.go"
				},
				{
					"match": "\\.(?!\\.\\.)",
					"name": "punctuation.other.period.go"
				},
				{
					"match": ":(?!=)",
					"name": "punctuation.other.colon.go"
				}
			]
		},
		"keywords": {
			"patterns": [
				{
					"comment": "Flow control keywords",
					"match": "\\b(break|case|continue|default|defer|else|fallthrough|for|go|goto|if|range|return|select|switch)\\b",
					"name": "keyword.control.go"
				},
				{
					"match": "\\bchan\\b",
					"name": "keyword.channel.go"
				},
				{
					"match": "\\bconst\\b",
					"name": "keyword.const.go"
				},
				{
					"match": "\\bvar\\b",
					"name": "keyword.var.go"
				},
				{
					"match": "\\bfunc\\b",
					"name": "keyword.function.go"
				},
				{
					"match": "\\binterface\\b",
					"name": "keyword.interface.go"
				},
				{
					"match": "\\bmap\\b",
					"name": "keyword.map.go"
				},
				{
					"match": "\\bstruct\\b",
					"name": "keyword.struct.go"
				},
				{
					"match": "\\bimport\\b",
					"name": "keyword.control.import.go"
				},
				{
					"match": "\\btype\\b",
					"name": "keyword.type.go"
				}
			]
		},
		"operators": {
			"comment": "Note that the order here is very important!",
			"patterns": [
				{
					"match": "(?<!\\w)(?:\\*|\\&)+(?:(?!\\d)(?=(?:[\\w\\[\\]])|(?:\\<\\-)))",
					"name": "keyword.operator.address.go"
				},
				{
					"match": "<\\-",
					"name": "keyword.operator.channel.go"
				},
				{
					"match": "\\-\\-",
					"name": "keyword.operator.decrement.go"
				},
				{
					"match": "\\+\\+",
					"name": "keyword.operator.increment.go"
				},
				{
					"match": "(==|!=|<=|>=|<(?!<)|>(?!>))",
					"name": "keyword.operator.comparison.go"
				},
				{
					"match": "(&&|\\|\\||!)",
					"name": "keyword.operator.logical.go"
				},
				{
					"match": "(=|\\+=|\\-=|\\|=|\\^=|\\*=|/=|:=|%=|<<=|>>=|&\\^=|&=)",
					"name": "keyword.operator.assignment.go"
				},
				{
					"match": "(\\+|\\-|\\*|/|%)",
					"name": "keyword.operator.arithmetic.go"
				},
				{
					"match": "(&(?!\\^)|\\||\\^|&\\^|<<|>>|\\~)",
					"name": "keyword.operator.arithmetic.bitwise.go"
				},
				{
					"match": "\\.\\.\\.",
					"name": "keyword.operator.ellipsis.go"
				}
			]
		},
		"runes": {
			"patterns": [
				{
					"begin": "'",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.go"
						}
					},
					"end": "'",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.go"
						}
					},
					"name": "string.quoted.rune.go",
					"patterns": [
						{
							"match": "\\G(\\\\([0-7]{3}|[abfnrtv\\\\'\"]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})|.)(?=')",
							"name": "constant.other.rune.go"
						},
						{
							"match": "[^']+",
							"name": "invalid.illegal.unknown-rune.go"
						}
					]
				}
			]
		},
		"storage_types": {
			"patterns": [
				{
					"match": "\\bbool\\b",
					"name": "storage.type.boolean.go"
				},
				{
					"match": "\\bbyte\\b",
					"name": "storage.type.byte.go"
				},
				{
					"match": "\\berror\\b",
					"name": "storage.type.error.go"
				},
				{
					"match": "\\b(complex(64|128)|float(32|64)|u?int(8|16|32|64)?)\\b",
					"name": "storage.type.numeric.go"
				},
				{
					"match": "\\brune\\b",
					"name": "storage.type.rune.go"
				},
				{
					"match": "\\bstring\\b",
					"name": "storage.type.string.go"
				},
				{
					"match": "\\buintptr\\b",
					"name": "storage.type.uintptr.go"
				},
				{
					"match": "\\bany\\b",
					"name": "entity.name.type.any.go"
				},
				{
					"match": "\\bcomparable\\b",
					"name": "entity.name.type.comparable.go"
				}
			]
		},
		"raw_string_literals": {
			"comment": "Raw string literals",
			"begin": "`",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.go"
				}
			},
			"end": "`",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.go"
				}
			},
			"name": "string.quoted.raw.go",
			"patterns": [
				{
					"include": "#string_placeholder"
				}
			]
		},
		"string_literals": {
			"patterns": [
				{
					"comment": "Interpreted string literals",
					"begin": "\"",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.go"
						}
					},
					"end": "\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.go"
						}
					},
					"name": "string.quoted.double.go",
					"patterns": [
						{
							"include": "#string_escaped_char"
						},
						{
							"include": "#string_placeholder"
						}
					]
				}
			]
		},
		"string_escaped_char": {
			"patterns": [
				{
					"match": "\\\\([0-7]{3}|[abfnrtv\\\\'\"]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})",
					"name": "constant.character.escape.go"
				},
				{
					"match": "\\\\[^0-7xuUabfnrtv\\'\"]",
					"name": "invalid.illegal.unknown-escape.go"
				}
			]
		},
		"string_placeholder": {
			"patterns": [
				{
					"match": "%(\\[\\d+\\])?([\\+#\\-0\\x20]{,2}((\\d+|\\*)?(\\.?(\\d+|\\*|(\\[\\d+\\])\\*?)?(\\[\\d+\\])?)?))?[vT%tbcdoqxXUbeEfFgGspw]",
					"name": "constant.other.placeholder.go"
				}
			]
		},
		"numeric_literals": {
			"match": "(?<!\\w)\\.?\\d(?:(?:[0-9a-zA-Z_\\.])|(?<=[eEpP])[+-])*",
			"captures": {
				"0": {
					"patterns": [
						{
							"begin": "(?=.)",
							"end": "(?:\\n|$)",
							"patterns": [
								{
									"match": "(?:(?:(?:(?:(?:\\G(?=[0-9.])(?!0[xXbBoO])([0-9](?:[0-9]|((?<=[0-9a-fA-F])_(?=[0-9a-fA-F])))*)((?:(?<=[0-9])\\.|\\.(?=[0-9])))([0-9](?:[0-9]|((?<=[0-9a-fA-F])_(?=[0-9a-fA-F])))*)?(?:(?<!_)([eE])(\\+?)(\\-?)((?:[0-9](?:[0-9]|(?:(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])))*)))?(i(?!\\w))?(?:\\n|$)|\\G(?=[0-9.])(?!0[xXbBoO])([0-9](?:[0-9]|((?<=[0-9a-fA-F])_(?=[0-9a-fA-F])))*)(?<!_)([eE])(\\+?)(\\-?)((?:[0-9](?:[0-9]|(?:(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])))*))(i(?!\\w))?(?:\\n|$))|\\G((?:(?<=[0-9])\\.|\\.(?=[0-9])))([0-9](?:[0-9]|((?<=[0-9a-fA-F])_(?=[0-9a-fA-F])))*)(?:(?<!_)([eE])(\\+?)(\\-?)((?:[0-9](?:[0-9]|(?:(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])))*)))?(i(?!\\w))?(?:\\n|$))|(\\G0[xX])_?([0-9a-fA-F](?:[0-9a-fA-F]|((?<=[0-9a-fA-F])_(?=[0-9a-fA-F])))*)((?:(?<=[0-9a-fA-F])\\.|\\.(?=[0-9a-fA-F])))([0-9a-fA-F](?:[0-9a-fA-F]|((?<=[0-9a-fA-F])_(?=[0-9a-fA-F])))*)?(?<!_)([pP])(\\+?)(\\-?)((?:[0-9](?:[0-9]|(?:(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])))*))(i(?!\\w))?(?:\\n|$))|(\\G0[xX])_?([0-9a-fA-F](?:[0-9a-fA-F]|((?<=[0-9a-fA-F])_(?=[0-9a-fA-F])))*)(?<!_)([pP])(\\+?)(\\-?)((?:[0-9](?:[0-9]|(?:(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])))*))(i(?!\\w))?(?:\\n|$))|(\\G0[xX])((?:(?<=[0-9a-fA-F])\\.|\\.(?=[0-9a-fA-F])))([0-9a-fA-F](?:[0-9a-fA-F]|((?<=[0-9a-fA-F])_(?=[0-9a-fA-F])))*)(?<!_)([pP])(\\+?)(\\-?)((?:[0-9](?:[0-9]|(?:(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])))*))(i(?!\\w))?(?:\\n|$))",
									"captures": {
										"1": {
											"name": "constant.numeric.decimal.go",
											"patterns": [
												{
													"match": "(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])",
													"name": "punctuation.separator.constant.numeric.go"
												}
											]
										},
										"2": {
											"name": "punctuation.separator.constant.numeric.go"
										},
										"3": {
											"name": "constant.numeric.decimal.point.go"
										},
										"4": {
											"name": "constant.numeric.decimal.go",
											"patterns": [
												{
													"match": "(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])",
													"name": "punctuation.separator.constant.numeric.go"
												}
											]
										},
										"5": {
											"name": "punctuation.separator.constant.numeric.go"
										},
										"6": {
											"name": "keyword.other.unit.exponent.decimal.go"
										},
										"7": {
											"name": "keyword.operator.plus.exponent.decimal.go"
										},
										"8": {
											"name": "keyword.operator.minus.exponent.decimal.go"
										},
										"9": {
											"name": "constant.numeric.exponent.decimal.go",
											"patterns": [
												{
													"match": "(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])",
													"name": "punctuation.separator.constant.numeric.go"
												}
											]
										},
										"10": {
											"name": "keyword.other.unit.imaginary.go"
										},
										"11": {
											"name": "constant.numeric.decimal.go",
											"patterns": [
												{
													"match": "(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])",
													"name": "punctuation.separator.constant.numeric.go"
												}
											]
										},
										"12": {
											"name": "punctuation.separator.constant.numeric.go"
										},
										"13": {
											"name": "keyword.other.unit.exponent.decimal.go"
										},
										"14": {
											"name": "keyword.operator.plus.exponent.decimal.go"
										},
										"15": {
											"name": "keyword.operator.minus.exponent.decimal.go"
										},
										"16": {
											"name": "constant.numeric.exponent.decimal.go",
											"patterns": [
												{
													"match": "(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])",
													"name": "punctuation.separator.constant.numeric.go"
												}
											]
										},
										"17": {
											"name": "keyword.other.unit.imaginary.go"
										},
										"18": {
											"name": "constant.numeric.decimal.point.go"
										},
										"19": {
											"name": "constant.numeric.decimal.go",
											"patterns": [
												{
													"match": "(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])",
													"name": "punctuation.separator.constant.numeric.go"
												}
											]
										},
										"20": {
											"name": "punctuation.separator.constant.numeric.go"
										},
										"21": {
											"name": "keyword.other.unit.exponent.decimal.go"
										},
										"22": {
											"name": "keyword.operator.plus.exponent.decimal.go"
										},
										"23": {
											"name": "keyword.operator.minus.exponent.decimal.go"
										},
										"24": {
											"name": "constant.numeric.exponent.decimal.go",
											"patterns": [
												{
													"match": "(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])",
													"name": "punctuation.separator.constant.numeric.go"
												}
											]
										},
										"25": {
											"name": "keyword.other.unit.imaginary.go"
										},
										"26": {
											"name": "keyword.other.unit.hexadecimal.go"
										},
										"27": {
											"name": "constant.numeric.hexadecimal.go",
											"patterns": [
												{
													"match": "(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])",
													"name": "punctuation.separator.constant.numeric.go"
												}
											]
										},
										"28": {
											"name": "punctuation.separator.constant.numeric.go"
										},
										"29": {
											"name": "constant.numeric.hexadecimal.go"
										},
										"30": {
											"name": "constant.numeric.hexadecimal.go",
											"patterns": [
												{
													"match": "(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])",
													"name": "punctuation.separator.constant.numeric.go"
												}
											]
										},
										"31": {
											"name": "punctuation.separator.constant.numeric.go"
										},
										"32": {
											"name": "keyword.other.unit.exponent.hexadecimal.go"
										},
										"33": {
											"name": "keyword.operator.plus.exponent.hexadecimal.go"
										},
										"34": {
											"name": "keyword.operator.minus.exponent.hexadecimal.go"
										},
										"35": {
											"name": "constant.numeric.exponent.hexadecimal.go",
											"patterns": [
												{
													"match": "(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])",
													"name": "punctuation.separator.constant.numeric.go"
												}
											]
										},
										"36": {
											"name": "keyword.other.unit.imaginary.go"
										},
										"37": {
											"name": "keyword.other.unit.hexadecimal.go"
										},
										"38": {
											"name": "constant.numeric.hexadecimal.go",
											"patterns": [
												{
													"match": "(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])",
													"name": "punctuation.separator.constant.numeric.go"
												}
											]
										},
										"39": {
											"name": "punctuation.separator.constant.numeric.go"
										},
										"40": {
											"name": "keyword.other.unit.exponent.hexadecimal.go"
										},
										"41": {
											"name": "keyword.operator.plus.exponent.hexadecimal.go"
										},
										"42": {
											"name": "keyword.operator.minus.exponent.hexadecimal.go"
										},
										"43": {
											"name": "constant.numeric.exponent.hexadecimal.go",
											"patterns": [
												{
													"match": "(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])",
													"name": "punctuation.separator.constant.numeric.go"
												}
											]
										},
										"44": {
											"name": "keyword.other.unit.imaginary.go"
										},
										"45": {
											"name": "keyword.other.unit.hexadecimal.go"
										},
										"46": {
											"name": "constant.numeric.hexadecimal.go"
										},
										"47": {
											"name": "constant.numeric.hexadecimal.go",
											"patterns": [
												{
													"match": "(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])",
													"name": "punctuation.separator.constant.numeric.go"
												}
											]
										},
										"48": {
											"name": "punctuation.separator.constant.numeric.go"
										},
										"49": {
											"name": "keyword.other.unit.exponent.hexadecimal.go"
										},
										"50": {
											"name": "keyword.operator.plus.exponent.hexadecimal.go"
										},
										"51": {
											"name": "keyword.operator.minus.exponent.hexadecimal.go"
										},
										"52": {
											"name": "constant.numeric.exponent.hexadecimal.go",
											"patterns": [
												{
													"match": "(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])",
													"name": "punctuation.separator.constant.numeric.go"
												}
											]
										},
										"53": {
											"name": "keyword.other.unit.imaginary.go"
										}
									}
								},
								{
									"match": "(?:(?:(?:\\G(?=[0-9.])(?!0[xXbBoO])([0-9](?:[0-9]|((?<=[0-9a-fA-F])_(?=[0-9a-fA-F])))*)(i(?!\\w))?(?:\\n|$)|(\\G0[bB])_?([01](?:[01]|((?<=[0-9a-fA-F])_(?=[0-9a-fA-F])))*)(i(?!\\w))?(?:\\n|$))|(\\G0[oO]?)_?((?:[0-7]|((?<=[0-9a-fA-F])_(?=[0-9a-fA-F])))+)(i(?!\\w))?(?:\\n|$))|(\\G0[xX])_?([0-9a-fA-F](?:[0-9a-fA-F]|((?<=[0-9a-fA-F])_(?=[0-9a-fA-F])))*)(i(?!\\w))?(?:\\n|$))",
									"captures": {
										"1": {
											"name": "constant.numeric.decimal.go",
											"patterns": [
												{
													"match": "(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])",
													"name": "punctuation.separator.constant.numeric.go"
												}
											]
										},
										"2": {
											"name": "punctuation.separator.constant.numeric.go"
										},
										"3": {
											"name": "keyword.other.unit.imaginary.go"
										},
										"4": {
											"name": "keyword.other.unit.binary.go"
										},
										"5": {
											"name": "constant.numeric.binary.go",
											"patterns": [
												{
													"match": "(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])",
													"name": "punctuation.separator.constant.numeric.go"
												}
											]
										},
										"6": {
											"name": "punctuation.separator.constant.numeric.go"
										},
										"7": {
											"name": "keyword.other.unit.imaginary.go"
										},
										"8": {
											"name": "keyword.other.unit.octal.go"
										},
										"9": {
											"name": "constant.numeric.octal.go",
											"patterns": [
												{
													"match": "(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])",
													"name": "punctuation.separator.constant.numeric.go"
												}
											]
										},
										"10": {
											"name": "punctuation.separator.constant.numeric.go"
										},
										"11": {
											"name": "keyword.other.unit.imaginary.go"
										},
										"12": {
											"name": "keyword.other.unit.hexadecimal.go"
										},
										"13": {
											"name": "constant.numeric.hexadecimal.go",
											"patterns": [
												{
													"match": "(?<=[0-9a-fA-F])_(?=[0-9a-fA-F])",
													"name": "punctuation.separator.constant.numeric.go"
												}
											]
										},
										"14": {
											"name": "punctuation.separator.constant.numeric.go"
										},
										"15": {
											"name": "keyword.other.unit.imaginary.go"
										}
									}
								},
								{
									"match": "(?:(?:[0-9a-zA-Z_\\.])|(?<=[eEpP])[+-])+",
									"name": "invalid.illegal.constant.numeric.go"
								}
							]
						}
					]
				}
			}
		},
		"terminators": {
			"comment": "Terminators",
			"match": ";",
			"name": "punctuation.terminator.go"
		},
		"package_name": {
			"patterns": [
				{
					"comment": "package name",
					"begin": "\\b(package)\\s+",
					"beginCaptures": {
						"1": {
							"name": "keyword.package.go"
						}
					},
					"end": "(?!\\G)",
					"patterns": [
						{
							"match": "\\d\\w*",
							"name": "invalid.illegal.identifier.go"
						},
						{
							"match": "\\w+",
							"name": "entity.name.type.package.go"
						}
					]
				}
			]
		},
		"import": {
			"comment": "import",
			"patterns": [
				{
					"comment": "import",
					"begin": "\\b(import)\\s+",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.import.go"
						}
					},
					"end": "(?!\\G)",
					"patterns": [
						{
							"include": "#imports"
						}
					]
				}
			]
		},
		"imports": {
			"comment": "import package(s)",
			"patterns": [
				{
					"match": "(\\s*[\\w\\.]+)?\\s*((\")([^\"]*)(\"))",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#delimiters"
								},
								{
									"match": "\\w+",
									"name": "variable.other.import.go"
								}
							]
						},
						"2": {
							"name": "string.quoted.double.go"
						},
						"3": {
							"name": "punctuation.definition.string.begin.go"
						},
						"4": {
							"name": "entity.name.import.go"
						},
						"5": {
							"name": "punctuation.definition.string.end.go"
						}
					}
				},
				{
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.imports.begin.bracket.round.go"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.imports.end.bracket.round.go"
						}
					},
					"patterns": [
						{
							"include": "#comments"
						},
						{
							"include": "#imports"
						}
					]
				},
				{
					"include": "$self"
				}
			]
		},
		"function_declaration": {
			"comment": "Function declarations",
			"begin": "(?:^(\\bfunc\\b)(?:\\s*(\\([^\\)]+\\)\\s*)?(?:(\\w+)(?=\\(|\\[))?))",
			"beginCaptures": {
				"1": {
					"name": "keyword.function.go"
				},
				"2": {
					"patterns": [
						{
							"begin": "\\(",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.begin.bracket.round.go"
								}
							},
							"end": "\\)",
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.end.bracket.round.go"
								}
							},
							"patterns": [
								{
									"match": "(?:(\\w+(?:\\s+))?((?:[\\w\\.\\*]+)(?:\\[(?:(?:(?:[\\w\\.\\*]+)(?:\\,\\s+)?)+)?\\])?))",
									"captures": {
										"1": {
											"name": "variable.parameter.go"
										},
										"2": {
											"patterns": [
												{
													"include": "#type-declarations-without-brackets"
												},
												{
													"include": "#parameter-variable-types"
												},
												{
													"match": "\\w+",
													"name": "entity.name.type.go"
												}
											]
										}
									}
								},
								{
									"include": "$self"
								}
							]
						}
					]
				},
				"3": {
					"patterns": [
						{
							"match": "\\d\\w*",
							"name": "invalid.illegal.identifier.go"
						},
						{
							"match": "\\w+",
							"name": "entity.name.function.go"
						}
					]
				}
			},
			"end": "(?:(?<=\\))\\s*((?:(?:(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?(?!(?:[\\[\\]\\*]+)?(?:\\bstruct\\b|\\binterface\\b))[\\w\\.\\-\\*\\[\\]]+)?\\s*(?=\\{))",
			"endCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#type-declarations-without-brackets"
						},
						{
							"include": "#parameter-variable-types"
						},
						{
							"match": "\\w+",
							"name": "entity.name.type.go"
						}
					]
				}
			},
			"patterns": [
				{
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.begin.bracket.round.go"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.round.go"
						}
					},
					"patterns": [
						{
							"include": "#function_param_types"
						}
					]
				},
				{
					"begin": "([\\w\\.\\*]+)?(\\[)",
					"beginCaptures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						},
						"2": {
							"name": "punctuation.definition.begin.bracket.square.go"
						}
					},
					"end": "\\]",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.square.go"
						}
					},
					"patterns": [
						{
							"include": "#generic_param_types"
						}
					]
				},
				{
					"comment": "single function as a type returned type(s) declaration",
					"match": "(?:(?<=\\))(?:\\s*)((?:(?:\\s*(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?[\\w\\*\\.\\[\\]\\<\\>\\-]+(?:\\s*)(?:\\/(?:\\/|\\*).*)?)$)",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations-without-brackets"
								},
								{
									"include": "#parameter-variable-types"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					}
				},
				{
					"include": "$self"
				}
			]
		},
		"function_param_types": {
			"comment": "function parameter variables and types",
			"patterns": [
				{
					"include": "#struct_variables_types"
				},
				{
					"include": "#interface_variables_types"
				},
				{
					"include": "#type-declarations-without-brackets"
				},
				{
					"comment": "struct/interface type declaration",
					"match": "((?:(?:\\b\\w+\\,\\s*)+)?\\b\\w+)\\s+(?=(?:(?:\\s*(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?(?:[\\[\\]\\*]+)?\\b(?:struct|interface)\\b\\s*\\{)",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "variable.parameter.go"
								}
							]
						}
					}
				},
				{
					"comment": "multiple parameters one type -with multilines",
					"match": "(?:(?:(?<=\\()|^\\s*)((?:(?:\\b\\w+\\,\\s*)+)(?:/(?:/|\\*).*)?)$)",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "variable.parameter.go"
								}
							]
						}
					}
				},
				{
					"comment": "multiple params and types | multiple params one type | one param one type",
					"match": "(?:((?:(?:\\b\\w+\\,\\s*)+)?\\b\\w+)(?:\\s+)((?:(?:\\s*(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?(?:(?:(?:[\\w\\[\\]\\.\\*]+)?(?:(?:\\bfunc\\b\\((?:[^\\)]+)?\\))(?:(?:\\s*(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?(?:\\s*))+(?:(?:(?:[\\w\\*\\.\\[\\]]+)|(?:\\((?:[^\\)]+)?\\))))?)|(?:(?:[\\[\\]\\*]+)?[\\w\\*\\.]+(?:\\[(?:[^\\]]+)\\])?(?:[\\w\\.\\*]+)?)+)))",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#delimiters"
								},
								{
									"match": "\\w+",
									"name": "variable.parameter.go"
								}
							]
						},
						"2": {
							"patterns": [
								{
									"include": "#type-declarations-without-brackets"
								},
								{
									"include": "#parameter-variable-types"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					}
				},
				{
					"begin": "([\\w\\.\\*]+)?(\\[)",
					"beginCaptures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						},
						"2": {
							"name": "punctuation.definition.begin.bracket.square.go"
						}
					},
					"end": "\\]",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.square.go"
						}
					},
					"patterns": [
						{
							"include": "#generic_param_types"
						}
					]
				},
				{
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.begin.bracket.round.go"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.round.go"
						}
					},
					"patterns": [
						{
							"include": "#function_param_types"
						}
					]
				},
				{
					"comment": "other types",
					"match": "([\\w\\.]+)",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					}
				},
				{
					"include": "$self"
				}
			]
		},
		"generic_param_types": {
			"comment": "generic parameter variables and types",
			"patterns": [
				{
					"include": "#struct_variables_types"
				},
				{
					"include": "#interface_variables_types"
				},
				{
					"include": "#type-declarations-without-brackets"
				},
				{
					"comment": "struct/interface type declaration",
					"match": "((?:(?:\\b\\w+\\,\\s*)+)?\\b\\w+)\\s+(?=(?:(?:\\s*(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?(?:[\\[\\]\\*]+)?\\b(?:struct|interface)\\b\\s*\\{)",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "variable.parameter.go"
								}
							]
						}
					}
				},
				{
					"comment": "multiple parameters one type -with multilines",
					"match": "(?:(?:(?<=\\()|^\\s*)((?:(?:\\b\\w+\\,\\s*)+)(?:/(?:/|\\*).*)?)$)",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "variable.parameter.go"
								}
							]
						}
					}
				},
				{
					"comment": "multiple params and types | multiple types one param",
					"match": "(?:((?:(?:\\b\\w+\\,\\s*)+)?\\b\\w+)(?:\\s+)((?:(?:\\s*(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?(?:(?:(?:[\\w\\[\\]\\.\\*]+)?(?:(?:\\bfunc\\b\\((?:[^\\)]+)?\\))(?:(?:\\s*(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?(?:\\s*))+(?:(?:(?:[\\w\\*\\.]+)|(?:\\((?:[^\\)]+)?\\))))?)|(?:(?:(?:[\\w\\*\\.\\~]+)|(?:\\[(?:(?:[\\w\\.\\*]+)?(?:\\[(?:[^\\]]+)?\\])?(?:\\,\\s+)?)+\\]))(?:[\\w\\.\\*]+)?)+)))",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#delimiters"
								},
								{
									"match": "\\w+",
									"name": "variable.parameter.go"
								}
							]
						},
						"2": {
							"patterns": [
								{
									"include": "#type-declarations-without-brackets"
								},
								{
									"include": "#parameter-variable-types"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						},
						"3": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					}
				},
				{
					"begin": "([\\w\\.\\*]+)?(\\[)",
					"beginCaptures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						},
						"2": {
							"name": "punctuation.definition.begin.bracket.square.go"
						}
					},
					"end": "\\]",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.square.go"
						}
					},
					"patterns": [
						{
							"include": "#generic_param_types"
						}
					]
				},
				{
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.begin.bracket.round.go"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.round.go"
						}
					},
					"patterns": [
						{
							"include": "#function_param_types"
						}
					]
				},
				{
					"comment": "other types",
					"match": "\\b([\\w\\.]+)",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					}
				},
				{
					"include": "$self"
				}
			]
		},
		"functions": {
			"comment": "Functions",
			"begin": "(\\bfunc\\b)(?=\\()",
			"beginCaptures": {
				"1": {
					"name": "keyword.function.go"
				}
			},
			"end": "(?:(?<=\\))(\\s*(?:(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?((?:(?:\\s*(?:(?:[\\[\\]\\*]+)?[\\w\\.\\*]+)?(?:(?:\\[(?:(?:[\\w\\.\\*]+)?(?:\\[(?:[^\\]]+)?\\])?(?:\\,\\s+)?)+\\])|(?:\\((?:[^\\)]+)?\\)))?(?:[\\w\\.\\*]+)?)(?:\\s*)(?=\\{))|(?:\\s*(?:(?:(?:[\\[\\]\\*]+)?(?!\\bfunc\\b)(?:[\\w\\.\\*]+)(?:\\[(?:(?:[\\w\\.\\*]+)?(?:\\[(?:[^\\]]+)?\\])?(?:\\,\\s+)?)+\\])?(?:[\\w\\.\\*]+)?)|(?:\\((?:[^\\)]+)?\\)))))?)",
			"endCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#type-declarations"
						}
					]
				},
				"2": {
					"patterns": [
						{
							"include": "#type-declarations-without-brackets"
						},
						{
							"include": "#parameter-variable-types"
						},
						{
							"match": "\\w+",
							"name": "entity.name.type.go"
						}
					]
				}
			},
			"patterns": [
				{
					"include": "#parameter-variable-types"
				}
			]
		},
		"functions_inline": {
			"comment": "functions in-line with multi return types",
			"match": "(?:(\\bfunc\\b)((?:\\((?:[^/]*?)\\))(?:\\s+)(?:\\((?:[^/]*?)\\)))(?:\\s+)(?=\\{))",
			"captures": {
				"1": {
					"name": "keyword.function.go"
				},
				"2": {
					"patterns": [
						{
							"include": "#type-declarations-without-brackets"
						},
						{
							"begin": "\\(",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.begin.bracket.round.go"
								}
							},
							"end": "\\)",
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.end.bracket.round.go"
								}
							},
							"patterns": [
								{
									"include": "#function_param_types"
								},
								{
									"include": "$self"
								}
							]
						},
						{
							"match": "\\[",
							"name": "punctuation.definition.begin.bracket.square.go"
						},
						{
							"match": "\\]",
							"name": "punctuation.definition.end.bracket.square.go"
						},
						{
							"match": "\\{",
							"name": "punctuation.definition.begin.bracket.curly.go"
						},
						{
							"match": "\\}",
							"name": "punctuation.definition.end.bracket.curly.go"
						},
						{
							"match": "\\w+",
							"name": "entity.name.type.go"
						}
					]
				}
			}
		},
		"support_functions": {
			"comment": "Support Functions",
			"match": "(?:(?:((?<=\\.)\\b\\w+)|(\\b\\w+))(?<brackets>\\[(?:[^\\[\\]]|\\g<brackets>)*\\])?(?=\\())",
			"captures": {
				"1": {
					"name": "entity.name.function.support.go"
				},
				"2": {
					"patterns": [
						{
							"include": "#type-declarations"
						},
						{
							"match": "\\d\\w*",
							"name": "invalid.illegal.identifier.go"
						},
						{
							"match": "\\w+",
							"name": "entity.name.function.support.go"
						}
					]
				},
				"3": {
					"patterns": [
						{
							"include": "#type-declarations-without-brackets"
						},
						{
							"match": "\\[",
							"name": "punctuation.definition.begin.bracket.square.go"
						},
						{
							"match": "\\]",
							"name": "punctuation.definition.end.bracket.square.go"
						},
						{
							"match": "\\{",
							"name": "punctuation.definition.begin.bracket.curly.go"
						},
						{
							"match": "\\}",
							"name": "punctuation.definition.end.bracket.curly.go"
						},
						{
							"match": "\\w+",
							"name": "entity.name.type.go"
						}
					]
				}
			}
		},
		"other_struct_interface_expressions": {
			"comment": "struct and interface expression in-line (before curly bracket)",
			"patterns": [
				{
					"comment": "after control variables must be added exactly here, do not move it! (changing may not affect tests, so be careful!)",
					"include": "#after_control_variables"
				},
				{
					"comment": "uses a named group to recursively match generic type with nested brackets, like 'Foo[A[B, C]]{}'",
					"match": "\\b(?!struct\\b|interface\\b)([\\w\\.]+)(?<brackets>\\[(?:[^\\[\\]]|\\g<brackets>)*\\])?(?=\\{)",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						},
						"2": {
							"patterns": [
								{
									"include": "#type-declarations-without-brackets"
								},
								{
									"match": "\\[",
									"name": "punctuation.definition.begin.bracket.square.go"
								},
								{
									"match": "\\]",
									"name": "punctuation.definition.end.bracket.square.go"
								},
								{
									"match": "\\{",
									"name": "punctuation.definition.begin.bracket.curly.go"
								},
								{
									"match": "\\}",
									"name": "punctuation.definition.end.bracket.curly.go"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					}
				}
			]
		},
		"type_assertion_inline": {
			"comment": "struct/interface types in-line (type assertion) | switch type keyword",
			"match": "(?:(?<=\\.\\()(?:(\\btype\\b)|((?:(?:\\s*(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?(?:[\\[\\]\\*]+)?(?:[\\w\\.]+)(?:\\[(?:(?:[\\w\\.\\*\\[\\]\\{\\}]+)(?:(?:\\,\\s*(?:[\\w\\.\\*\\[\\]\\{\\}]+))*))?\\])?))(?=\\)))",
			"captures": {
				"1": {
					"name": "keyword.type.go"
				},
				"2": {
					"patterns": [
						{
							"include": "#type-declarations-without-brackets"
						},
						{
							"match": "\\(",
							"name": "punctuation.definition.begin.bracket.round.go"
						},
						{
							"match": "\\)",
							"name": "punctuation.definition.end.bracket.round.go"
						},
						{
							"match": "\\[",
							"name": "punctuation.definition.begin.bracket.square.go"
						},
						{
							"match": "\\]",
							"name": "punctuation.definition.end.bracket.square.go"
						},
						{
							"match": "\\{",
							"name": "punctuation.definition.begin.bracket.curly.go"
						},
						{
							"match": "\\}",
							"name": "punctuation.definition.end.bracket.curly.go"
						},
						{
							"match": "\\w+",
							"name": "entity.name.type.go"
						}
					]
				}
			}
		},
		"struct_variables_types": {
			"comment": "Struct variable type",
			"begin": "(\\bstruct\\b)\\s*(\\{)",
			"beginCaptures": {
				"1": {
					"name": "keyword.struct.go"
				},
				"2": {
					"name": "punctuation.definition.begin.bracket.curly.go"
				}
			},
			"patterns": [
				{
					"include": "#struct_variables_types_fields"
				},
				{
					"include": "$self"
				}
			],
			"end": "\\}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.end.bracket.curly.go"
				}
			}
		},
		"struct_variables_types_fields": {
			"comment": "Struct variable type fields",
			"patterns": [
				{
					"include": "#struct_variable_types_fields_multi"
				},
				{
					"comment": "one line - single type",
					"match": "(?:(?<=\\{)\\s*((?:(?:\\s*(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?(?:[\\w\\.\\*\\[\\]]+))\\s*(?=\\}))",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					}
				},
				{
					"comment": "one line - property variables and types",
					"match": "(?:(?<=\\{)\\s*((?:(?:\\w+\\,\\s*)+)?(?:\\w+\\s+))((?:(?:\\s*(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?(?:[\\w\\.\\*\\[\\]]+))\\s*(?=\\}))",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "variable.other.property.go"
								}
							]
						},
						"2": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					}
				},
				{
					"comment": "one line with semicolon(;) without formatting gofmt - single type | property variables and types",
					"match": "(?:(?<=\\{)((?:\\s*(?:(?:(?:\\w+\\,\\s*)+)?(?:\\w+\\s+))?(?:(?:(?:\\s*(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?(?:[^\\s/]+)(?:\\;)?))+)\\s*(?=\\}))",
					"captures": {
						"1": {
							"patterns": [
								{
									"match": "(?:((?:(?:\\w+\\,\\s*)+)?(?:\\w+\\s+))?((?:(?:\\s*(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?(?:[^\\s/]+)(?:\\;)?))",
									"captures": {
										"1": {
											"patterns": [
												{
													"include": "#type-declarations"
												},
												{
													"match": "\\w+",
													"name": "variable.other.property.go"
												}
											]
										},
										"2": {
											"patterns": [
												{
													"include": "#type-declarations"
												},
												{
													"match": "\\w+",
													"name": "entity.name.type.go"
												}
											]
										}
									}
								}
							]
						}
					}
				},
				{
					"comment": "one type only",
					"match": "(?:((?:(?:\\s*(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?(?:[\\w\\.\\*]+)\\s*)(?:(?=\\`|\\/|\")|$))",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					}
				},
				{
					"comment": "property variables and types",
					"match": "(\\b\\w+(?:\\s*\\,\\s*\\b\\w+)*)\\s*([^\\`\"\\/]+)",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "variable.other.property.go"
								}
							]
						},
						"2": {
							"patterns": [
								{
									"include": "#type-declarations-without-brackets"
								},
								{
									"include": "#parameter-variable-types"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					}
				}
			]
		},
		"struct_variable_types_fields_multi": {
			"comment": "struct variable and type fields with multi lines",
			"patterns": [
				{
					"comment": "struct in struct types",
					"begin": "(?:((?:\\b\\w+(?:\\,\\s*\\b\\w+)*)(?:(?:\\s*(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?(?:\\s*)(?:[\\[\\]\\*]+)?)(\\bstruct\\b)(?:\\s*)(\\{))",
					"beginCaptures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "variable.other.property.go"
								}
							]
						},
						"2": {
							"name": "keyword.struct.go"
						},
						"3": {
							"name": "punctuation.definition.begin.bracket.curly.go"
						}
					},
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.curly.go"
						}
					},
					"patterns": [
						{
							"include": "#struct_variables_types_fields"
						},
						{
							"include": "$self"
						}
					]
				},
				{
					"comment": "interface in struct types",
					"begin": "(?:((?:\\b\\w+(?:\\,\\s*\\b\\w+)*)(?:(?:\\s*(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?(?:\\s*)(?:[\\[\\]\\*]+)?)(\\binterface\\b)(?:\\s*)(\\{))",
					"beginCaptures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "variable.other.property.go"
								}
							]
						},
						"2": {
							"name": "keyword.interface.go"
						},
						"3": {
							"name": "punctuation.definition.begin.bracket.curly.go"
						}
					},
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.curly.go"
						}
					},
					"patterns": [
						{
							"include": "#interface_variables_types_field"
						},
						{
							"include": "$self"
						}
					]
				},
				{
					"comment": "function in struct types",
					"begin": "(?:((?:\\b\\w+(?:\\,\\s*\\b\\w+)*)(?:(?:\\s*(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?(?:\\s*)(?:[\\[\\]\\*]+)?)(\\bfunc\\b)(?:\\s*)(\\())",
					"beginCaptures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "variable.other.property.go"
								}
							]
						},
						"2": {
							"name": "keyword.function.go"
						},
						"3": {
							"name": "punctuation.definition.begin.bracket.round.go"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.round.go"
						}
					},
					"patterns": [
						{
							"include": "#function_param_types"
						},
						{
							"include": "$self"
						}
					]
				},
				{
					"include": "#parameter-variable-types"
				}
			]
		},
		"interface_variables_types": {
			"comment": "interface variable types",
			"begin": "(\\binterface\\b)\\s*(\\{)",
			"beginCaptures": {
				"1": {
					"name": "keyword.interface.go"
				},
				"2": {
					"name": "punctuation.definition.begin.bracket.curly.go"
				}
			},
			"patterns": [
				{
					"include": "#interface_variables_types_field"
				},
				{
					"include": "$self"
				}
			],
			"end": "\\}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.end.bracket.curly.go"
				}
			}
		},
		"interface_variables_types_field": {
			"comment": "interface variable type fields",
			"patterns": [
				{
					"include": "#support_functions"
				},
				{
					"include": "#type-declarations-without-brackets"
				},
				{
					"begin": "([\\w\\.\\*]+)?(\\[)",
					"beginCaptures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						},
						"2": {
							"name": "punctuation.definition.begin.bracket.square.go"
						}
					},
					"end": "\\]",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.square.go"
						}
					},
					"patterns": [
						{
							"include": "#generic_param_types"
						}
					]
				},
				{
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.begin.bracket.round.go"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.round.go"
						}
					},
					"patterns": [
						{
							"include": "#function_param_types"
						}
					]
				},
				{
					"comment": "other types",
					"match": "([\\w\\.]+)",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					}
				}
			]
		},
		"single_type": {
			"patterns": [
				{
					"comment": "single type declaration",
					"match": "(?:(?:^\\s*)(\\btype\\b)(?:\\s*)([\\w\\.\\*]+)(?:\\s+)(?!(?:\\=\\s*)?(?:[\\[\\]\\*]+)?\\b(?:struct|interface)\\b)([\\s\\S]+))",
					"captures": {
						"1": {
							"name": "keyword.type.go"
						},
						"2": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						},
						"3": {
							"patterns": [
								{
									"begin": "\\(",
									"beginCaptures": {
										"0": {
											"name": "punctuation.definition.begin.bracket.round.go"
										}
									},
									"end": "\\)",
									"endCaptures": {
										"0": {
											"name": "punctuation.definition.end.bracket.round.go"
										}
									},
									"patterns": [
										{
											"include": "#function_param_types"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"include": "#type-declarations"
								},
								{
									"include": "#generic_types"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					}
				},
				{
					"comment": "single type declaration with generics",
					"begin": "(?:(?:^|\\s+)(\\btype\\b)(?:\\s*)([\\w\\.\\*]+)(?=\\[))",
					"beginCaptures": {
						"1": {
							"name": "keyword.type.go"
						},
						"2": {
							"patterns": [
								{
									"include": "#type-declarations-without-brackets"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					},
					"end": "(?:(?<=\\])((?:\\s+)(?:\\=\\s*)?(?:(?:(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+)?(?:(?!(?:[\\[\\]\\*]+)?(?:\\bstruct\\b|\\binterface\\b|\\bfunc\\b))[\\w\\.\\-\\*\\[\\]]+(?:\\,\\s*[\\w\\.\\[\\]\\*]+)*))?)",
					"endCaptures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations-without-brackets"
								},
								{
									"match": "\\[",
									"name": "punctuation.definition.begin.bracket.square.go"
								},
								{
									"match": "\\]",
									"name": "punctuation.definition.end.bracket.square.go"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					},
					"patterns": [
						{
							"include": "#struct_variables_types"
						},
						{
							"include": "#type-declarations-without-brackets"
						},
						{
							"include": "#parameter-variable-types"
						},
						{
							"match": "\\[",
							"name": "punctuation.definition.begin.bracket.square.go"
						},
						{
							"match": "\\]",
							"name": "punctuation.definition.end.bracket.square.go"
						},
						{
							"match": "\\{",
							"name": "punctuation.definition.begin.bracket.curly.go"
						},
						{
							"match": "\\}",
							"name": "punctuation.definition.end.bracket.curly.go"
						},
						{
							"match": "\\(",
							"name": "punctuation.definition.begin.bracket.round.go"
						},
						{
							"match": "\\)",
							"name": "punctuation.definition.end.bracket.round.go"
						},
						{
							"match": "\\w+",
							"name": "entity.name.type.go"
						}
					]
				}
			]
		},
		"multi_types": {
			"comment": "multi type declaration",
			"begin": "(\\btype\\b)\\s*(\\()",
			"beginCaptures": {
				"1": {
					"name": "keyword.type.go"
				},
				"2": {
					"name": "punctuation.definition.begin.bracket.round.go"
				}
			},
			"patterns": [
				{
					"include": "#struct_variables_types"
				},
				{
					"include": "#interface_variables_types"
				},
				{
					"include": "#type-declarations-without-brackets"
				},
				{
					"include": "#parameter-variable-types"
				},
				{
					"match": "\\w+",
					"name": "entity.name.type.go"
				}
			],
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.end.bracket.round.go"
				}
			}
		},
		"after_control_variables": {
			"comment": "After control variables, to not highlight as a struct/interface (before formatting with gofmt)",
			"match": "(?:(?<=\\brange\\b|\\;|\\bif\\b|\\bfor\\b|\\<|\\>|\\<\\=|\\>\\=|\\=\\=|\\!\\=|\\w(?:\\+|/|\\-|\\*|\\%)|\\w(?:\\+|/|\\-|\\*|\\%)\\=|\\|\\||\\&\\&)(?:\\s*)((?![\\[\\]]+)[[:alnum:]\\-\\_\\!\\.\\[\\]\\<\\>\\=\\*/\\+\\%\\:]+)(?:\\s*)(?=\\{))",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#type-declarations-without-brackets"
						},
						{
							"match": "\\[",
							"name": "punctuation.definition.begin.bracket.square.go"
						},
						{
							"match": "\\]",
							"name": "punctuation.definition.end.bracket.square.go"
						},
						{
							"match": "\\w+",
							"name": "variable.other.go"
						}
					]
				}
			}
		},
		"syntax_errors": {
			"patterns": [
				{
					"comment": "Syntax error using slices",
					"match": "\\[\\](\\s+)",
					"captures": {
						"1": {
							"name": "invalid.illegal.slice.go"
						}
					}
				},
				{
					"comment": "Syntax error numeric literals",
					"match": "\\b0[0-7]*[89]\\d*\\b",
					"name": "invalid.illegal.numeric.go"
				}
			]
		},
		"built_in_functions": {
			"comment": "Built-in functions",
			"patterns": [
				{
					"match": "\\b(append|cap|close|complex|copy|delete|imag|len|panic|print|println|real|recover|min|max|clear)\\b(?=\\()",
					"name": "entity.name.function.support.builtin.go"
				},
				{
					"comment": "new keyword",
					"begin": "(\\bnew\\b)(\\()",
					"beginCaptures": {
						"1": {
							"name": "entity.name.function.support.builtin.go"
						},
						"2": {
							"name": "punctuation.definition.begin.bracket.round.go"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.round.go"
						}
					},
					"patterns": [
						{
							"include": "#functions"
						},
						{
							"include": "#struct_variables_types"
						},
						{
							"include": "#type-declarations"
						},
						{
							"include": "#generic_types"
						},
						{
							"match": "\\w+",
							"name": "entity.name.type.go"
						},
						{
							"include": "$self"
						}
					]
				},
				{
					"comment": "make keyword",
					"begin": "(?:(\\bmake\\b)(?:(\\()((?:(?:(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+(?:\\([^\\)]+\\))?)?(?:[\\[\\]\\*]+)?(?:(?!\\bmap\\b)(?:[\\w\\.]+))?(\\[(?:(?:[\\S]+)(?:(?:\\,\\s*(?:[\\S]+))*))?\\])?(?:\\,)?)?))",
					"beginCaptures": {
						"1": {
							"name": "entity.name.function.support.builtin.go"
						},
						"2": {
							"name": "punctuation.definition.begin.bracket.round.go"
						},
						"3": {
							"patterns": [
								{
									"include": "#type-declarations-without-brackets"
								},
								{
									"include": "#parameter-variable-types"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.round.go"
						}
					},
					"patterns": [
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"struct_interface_declaration": {
			"comment": "struct, interface type declarations (related to: struct_variables_types, interface_variables_types)",
			"match": "(?:(?:^\\s*)(\\btype\\b)(?:\\s*)([\\w\\.]+))",
			"captures": {
				"1": {
					"name": "keyword.type.go"
				},
				"2": {
					"patterns": [
						{
							"include": "#type-declarations"
						},
						{
							"match": "\\w+",
							"name": "entity.name.type.go"
						}
					]
				}
			}
		},
		"switch_types": {
			"comment": "switch type assertions, only highlights types after case keyword",
			"begin": "(?<=\\bswitch\\b)(?:\\s*)(?:(\\w+\\s*\\:\\=)?\\s*([\\w\\.\\*\\(\\)\\[\\]\\+/\\-\\%\\<\\>\\|\\&]+))(\\.\\(\\btype\\b\\)\\s*)(\\{)",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#operators"
						},
						{
							"match": "\\w+",
							"name": "variable.other.assignment.go"
						}
					]
				},
				"2": {
					"patterns": [
						{
							"include": "#support_functions"
						},
						{
							"include": "#type-declarations"
						},
						{
							"match": "\\w+",
							"name": "variable.other.go"
						}
					]
				},
				"3": {
					"patterns": [
						{
							"include": "#delimiters"
						},
						{
							"include": "#brackets"
						},
						{
							"match": "\\btype\\b",
							"name": "keyword.type.go"
						}
					]
				},
				"4": {
					"name": "punctuation.definition.begin.bracket.curly.go"
				}
			},
			"end": "\\}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.end.bracket.curly.go"
				}
			},
			"patterns": [
				{
					"comment": "types after case keyword with single line",
					"match": "(?:^\\s*(\\bcase\\b))(?:\\s+)([\\w\\.\\,\\*\\=\\<\\>\\!\\s]+)(:)(\\s*/(?:/|\\*)\\s*.*)?$",
					"captures": {
						"1": {
							"name": "keyword.control.go"
						},
						"2": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						},
						"3": {
							"name": "punctuation.other.colon.go"
						},
						"4": {
							"patterns": [
								{
									"include": "#comments"
								}
							]
						}
					}
				},
				{
					"comment": "types after case keyword with multi lines",
					"begin": "\\bcase\\b",
					"beginCaptures": {
						"0": {
							"name": "keyword.control.go"
						}
					},
					"end": "\\:",
					"endCaptures": {
						"0": {
							"name": "punctuation.other.colon.go"
						}
					},
					"patterns": [
						{
							"include": "#type-declarations"
						},
						{
							"match": "\\w+",
							"name": "entity.name.type.go"
						}
					]
				},
				{
					"include": "$self"
				}
			]
		},
		"switch_variables": {
			"comment": "variables after case control keyword in switch/select expression, to not scope them as property variables",
			"patterns": [
				{
					"comment": "single line",
					"match": "(?:(?:^\\s*(\\bcase\\b))(?:\\s+)([\\s\\S]+(?:\\:)\\s*(?:/(?:/|\\*).*)?)$)",
					"captures": {
						"1": {
							"name": "keyword.control.go"
						},
						"2": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"include": "#support_functions"
								},
								{
									"include": "#variable_assignment"
								},
								{
									"match": "\\w+",
									"name": "variable.other.go"
								}
							]
						}
					}
				},
				{
					"comment": "multi lines",
					"begin": "(?<=\\bswitch\\b)(?:\\s*)((?:[\\w\\.]+(?:\\s*(?:[\\:\\=\\!\\,\\+/\\-\\%\\<\\>\\|\\&]+)\\s*[\\w\\.]+)*\\s*(?:[\\:\\=\\!\\,\\+/\\-\\%\\<\\>\\|\\&]+))?(?:\\s*(?:[\\w\\.\\*\\(\\)\\[\\]\\+/\\-\\%\\<\\>\\|\\&]+)?\\s*(?:\\;\\s*(?:[\\w\\.\\*\\(\\)\\[\\]\\+/\\-\\%\\<\\>\\|\\&]+)\\s*)?))(\\{)",
					"beginCaptures": {
						"1": {
							"patterns": [
								{
									"include": "#support_functions"
								},
								{
									"include": "#type-declarations"
								},
								{
									"include": "#variable_assignment"
								},
								{
									"match": "\\w+",
									"name": "variable.other.go"
								}
							]
						},
						"2": {
							"name": "punctuation.definition.begin.bracket.curly.go"
						}
					},
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.curly.go"
						}
					},
					"patterns": [
						{
							"begin": "\\bcase\\b",
							"beginCaptures": {
								"0": {
									"name": "keyword.control.go"
								}
							},
							"end": "\\:",
							"endCaptures": {
								"0": {
									"name": "punctuation.other.colon.go"
								}
							},
							"patterns": [
								{
									"include": "#support_functions"
								},
								{
									"include": "#type-declarations"
								},
								{
									"include": "#variable_assignment"
								},
								{
									"match": "\\w+",
									"name": "variable.other.go"
								}
							]
						},
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"var_assignment": {
			"comment": "variable assignment with var keyword",
			"patterns": [
				{
					"comment": "single assignment",
					"match": "(?:(?<=\\bvar\\b)(?:\\s*)(\\b[\\w\\.]+(?:\\,\\s*[\\w\\.]+)*)(?:\\s*)((?:(?:(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+(?:\\([^\\)]+\\))?)?(?!(?:[\\[\\]\\*]+)?\\b(?:struct|func|map)\\b)(?:[\\w\\.\\[\\]\\*]+(?:\\,\\s*[\\w\\.\\[\\]\\*]+)*)?(?:\\s*)(?:\\=)?)?)",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#delimiters"
								},
								{
									"match": "\\w+",
									"name": "variable.other.assignment.go"
								}
							]
						},
						"2": {
							"patterns": [
								{
									"include": "#type-declarations-without-brackets"
								},
								{
									"include": "#generic_types"
								},
								{
									"match": "\\(",
									"name": "punctuation.definition.begin.bracket.round.go"
								},
								{
									"match": "\\)",
									"name": "punctuation.definition.end.bracket.round.go"
								},
								{
									"match": "\\[",
									"name": "punctuation.definition.begin.bracket.square.go"
								},
								{
									"match": "\\]",
									"name": "punctuation.definition.end.bracket.square.go"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					}
				},
				{
					"comment": "multi assignment",
					"begin": "(?:(?<=\\bvar\\b)(?:\\s*)(\\())",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.begin.bracket.round.go"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.round.go"
						}
					},
					"patterns": [
						{
							"match": "(?:(?:^\\s*)(\\b[\\w\\.]+(?:\\,\\s*[\\w\\.]+)*)(?:\\s*)((?:(?:(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+(?:\\([^\\)]+\\))?)?(?!(?:[\\[\\]\\*]+)?\\b(?:struct|func|map)\\b)(?:[\\w\\.\\[\\]\\*]+(?:\\,\\s*[\\w\\.\\[\\]\\*]+)*)?(?:\\s*)(?:\\=)?)?)",
							"captures": {
								"1": {
									"patterns": [
										{
											"include": "#delimiters"
										},
										{
											"match": "\\w+",
											"name": "variable.other.assignment.go"
										}
									]
								},
								"2": {
									"patterns": [
										{
											"include": "#type-declarations-without-brackets"
										},
										{
											"include": "#generic_types"
										},
										{
											"match": "\\(",
											"name": "punctuation.definition.begin.bracket.round.go"
										},
										{
											"match": "\\)",
											"name": "punctuation.definition.end.bracket.round.go"
										},
										{
											"match": "\\[",
											"name": "punctuation.definition.begin.bracket.square.go"
										},
										{
											"match": "\\]",
											"name": "punctuation.definition.end.bracket.square.go"
										},
										{
											"match": "\\w+",
											"name": "entity.name.type.go"
										}
									]
								}
							}
						},
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"const_assignment": {
			"comment": "constant assignment with const keyword",
			"patterns": [
				{
					"comment": "single assignment",
					"match": "(?:(?<=\\bconst\\b)(?:\\s*)(\\b[\\w\\.]+(?:\\,\\s*[\\w\\.]+)*)(?:\\s*)((?:(?:(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+(?:\\([^\\)]+\\))?)?(?!(?:[\\[\\]\\*]+)?\\b(?:struct|func|map)\\b)(?:[\\w\\.\\[\\]\\*]+(?:\\,\\s*[\\w\\.\\[\\]\\*]+)*)?(?:\\s*)(?:\\=)?)?)",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#delimiters"
								},
								{
									"match": "\\w+",
									"name": "variable.other.constant.go"
								}
							]
						},
						"2": {
							"patterns": [
								{
									"include": "#type-declarations-without-brackets"
								},
								{
									"include": "#generic_types"
								},
								{
									"match": "\\(",
									"name": "punctuation.definition.begin.bracket.round.go"
								},
								{
									"match": "\\)",
									"name": "punctuation.definition.end.bracket.round.go"
								},
								{
									"match": "\\[",
									"name": "punctuation.definition.begin.bracket.square.go"
								},
								{
									"match": "\\]",
									"name": "punctuation.definition.end.bracket.square.go"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					}
				},
				{
					"comment": "multi assignment",
					"begin": "(?:(?<=\\bconst\\b)(?:\\s*)(\\())",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.begin.bracket.round.go"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.round.go"
						}
					},
					"patterns": [
						{
							"match": "(?:(?:^\\s*)(\\b[\\w\\.]+(?:\\,\\s*[\\w\\.]+)*)(?:\\s*)((?:(?:(?:[\\*\\[\\]]+)?(?:\\<\\-\\s*)?\\bchan\\b(?:\\s*\\<\\-)?\\s*)+(?:\\([^\\)]+\\))?)?(?!(?:[\\[\\]\\*]+)?\\b(?:struct|func|map)\\b)(?:[\\w\\.\\[\\]\\*]+(?:\\,\\s*[\\w\\.\\[\\]\\*]+)*)?(?:\\s*)(?:\\=)?)?)",
							"captures": {
								"1": {
									"patterns": [
										{
											"include": "#delimiters"
										},
										{
											"match": "\\w+",
											"name": "variable.other.constant.go"
										}
									]
								},
								"2": {
									"patterns": [
										{
											"include": "#type-declarations-without-brackets"
										},
										{
											"include": "#generic_types"
										},
										{
											"match": "\\(",
											"name": "punctuation.definition.begin.bracket.round.go"
										},
										{
											"match": "\\)",
											"name": "punctuation.definition.end.bracket.round.go"
										},
										{
											"match": "\\[",
											"name": "punctuation.definition.begin.bracket.square.go"
										},
										{
											"match": "\\]",
											"name": "punctuation.definition.end.bracket.square.go"
										},
										{
											"match": "\\w+",
											"name": "entity.name.type.go"
										}
									]
								}
							}
						},
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"variable_assignment": {
			"comment": "variable assignment",
			"patterns": [
				{
					"comment": "variable assignment with :=",
					"match": "\\b\\w+(?:\\,\\s*\\w+)*(?=\\s*:=)",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#delimiters"
								},
								{
									"match": "\\d\\w*",
									"name": "invalid.illegal.identifier.go"
								},
								{
									"match": "\\w+",
									"name": "variable.other.assignment.go"
								}
							]
						}
					}
				},
				{
					"comment": "variable assignment with =",
					"match": "\\b[\\w\\.\\*]+(?:\\,\\s*[\\w\\.\\*]+)*(?=\\s*=(?!=))",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#delimiters"
								},
								{
									"include": "#operators"
								},
								{
									"match": "\\d\\w*",
									"name": "invalid.illegal.identifier.go"
								},
								{
									"match": "\\w+",
									"name": "variable.other.assignment.go"
								}
							]
						}
					}
				}
			]
		},
		"generic_types": {
			"comment": "Generic support for all types",
			"match": "(?:([\\w\\.\\*]+)(\\[(?:[^\\]]+)?\\]))",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#type-declarations"
						},
						{
							"match": "\\w+",
							"name": "entity.name.type.go"
						}
					]
				},
				"2": {
					"patterns": [
						{
							"include": "#parameter-variable-types"
						}
					]
				}
			}
		},
		"slice_index_variables": {
			"comment": "slice index and capacity variables, to not scope them as property variables",
			"match": "(?<=\\w\\[)((?:(?:\\b[\\w\\.\\*\\+/\\-\\%\\<\\>\\|\\&]+\\:)|(?:\\:\\b[\\w\\.\\*\\+/\\-\\%\\<\\>\\|\\&]+))(?:\\b[\\w\\.\\*\\+/\\-\\%\\<\\>\\|\\&]+)?(?:\\:\\b[\\w\\.\\*\\+/\\-\\%\\<\\>\\|\\&]+)?)(?=\\])",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#type-declarations"
						},
						{
							"match": "\\w+",
							"name": "variable.other.go"
						}
					]
				}
			}
		},
		"property_variables": {
			"comment": "Property variables in struct",
			"match": "((?:\\b[\\w\\.]+)(?:\\:(?!\\=)))",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#type-declarations"
						},
						{
							"match": "\\w+",
							"name": "variable.other.property.go"
						}
					]
				}
			}
		},
		"label_loop_variables": {
			"comment": "labeled loop variable name",
			"match": "((?:^\\s*\\w+:\\s*$)|(?:^\\s*(?:\\bbreak\\b|\\bgoto\\b|\\bcontinue\\b)\\s+\\w+(?:\\s*/(?:/|\\*)\\s*.*)?$))",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#type-declarations"
						},
						{
							"match": "\\w+",
							"name": "variable.other.label.go"
						}
					]
				}
			}
		},
		"double_parentheses_types": {
			"comment": "double parentheses types",
			"match": "(?:(?<!\\w)(\\((?:[\\[\\]\\*]+)?(?:[\\w\\.]+)(?:\\[(?:(?:[\\w\\.\\*\\[\\]\\{\\}]+)(?:(?:\\,\\s*(?:[\\w\\.\\*\\[\\]\\{\\}]+))*))?\\])?\\))(?=\\())",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#type-declarations-without-brackets"
						},
						{
							"match": "\\(",
							"name": "punctuation.definition.begin.bracket.round.go"
						},
						{
							"match": "\\)",
							"name": "punctuation.definition.end.bracket.round.go"
						},
						{
							"match": "\\[",
							"name": "punctuation.definition.begin.bracket.square.go"
						},
						{
							"match": "\\]",
							"name": "punctuation.definition.end.bracket.square.go"
						},
						{
							"match": "\\{",
							"name": "punctuation.definition.begin.bracket.curly.go"
						},
						{
							"match": "\\}",
							"name": "punctuation.definition.end.bracket.curly.go"
						},
						{
							"match": "\\w+",
							"name": "entity.name.type.go"
						}
					]
				}
			}
		},
		"hover": {
			"comment": "hovering with the mouse",
			"patterns": [
				{
					"comment": "struct field property and types when hovering with the mouse",
					"match": "(?:(?<=^\\bfield\\b)\\s+([\\w\\*\\.]+)\\s+([\\s\\S]+))",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations"
								},
								{
									"match": "\\w+",
									"name": "variable.other.property.go"
								}
							]
						},
						"2": {
							"patterns": [
								{
									"match": "\\binvalid\\b\\s+\\btype\\b",
									"name": "invalid.field.go"
								},
								{
									"include": "#type-declarations-without-brackets"
								},
								{
									"include": "#parameter-variable-types"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					}
				},
				{
					"comment": "return types when hovering with the mouse",
					"match": "(?:(?<=^\\breturns\\b)\\s+([\\s\\S]+))",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#type-declarations-without-brackets"
								},
								{
									"include": "#parameter-variable-types"
								},
								{
									"match": "\\w+",
									"name": "entity.name.type.go"
								}
							]
						}
					}
				}
			]
		},
		"other_variables": {
			"comment": "all other variables",
			"match": "\\w+",
			"name": "variable.other.go"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/groovy/.vscodeignore]---
Location: vscode-main/extensions/groovy/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/groovy/cgmanifest.json]---
Location: vscode-main/extensions/groovy/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "textmate/groovy.tmbundle",
					"repositoryUrl": "https://github.com/textmate/groovy.tmbundle",
					"commitHash": "85d8f7c97ae473ccb9473f6c8d27e4ec957f4be1"
				}
			},
			"licenseDetail": [
				"Copyright (c) textmate-groovy.tmbundle project authors",
				"",
				"If not otherwise specified (see below), files in this repository fall under the following license:",
				"",
				"Permission to copy, use, modify, sell and distribute this",
				"software is granted. This software is provided \"as is\" without",
				"express or implied warranty, and with no claim as to its",
				"suitability for any purpose.",
				"",
				"An exception is made for files in readable text which contain their own license information,",
				"or files where an accompanying file exists (in the same directory) with a \"-license\" suffix added",
				"to the base-name name of the original file, and an extension of txt, html, or similar. For example",
				"\"tidy\" is accompanied by \"tidy-license.txt\"."
			],
			"license": "TextMate Bundle License",
			"version": "0.0.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/groovy/language-configuration.json]---
Location: vscode-main/extensions/groovy/language-configuration.json

```json
{
	"comments": {
		"lineComment": "//",
		"blockComment": [
			"/*",
			"*/"
		]
	},
	"brackets": [
		[
			"{",
			"}"
		],
		[
			"[",
			"]"
		],
		[
			"(",
			")"
		]
	],
	"autoClosingPairs": [
		[
			"{",
			"}"
		],
		[
			"[",
			"]"
		],
		[
			"(",
			")"
		],
		{
			"open": "\"",
			"close": "\"",
			"notIn": [
				"string"
			]
		},
		{
			"open": "'",
			"close": "'",
			"notIn": [
				"string"
			]
		}
	],
	"surroundingPairs": [
		[
			"{",
			"}"
		],
		[
			"[",
			"]"
		],
		[
			"(",
			")"
		],
		[
			"\"",
			"\""
		],
		[
			"'",
			"'"
		]
	],
	"onEnterRules": [
		// Add // when pressing enter from inside line comment
		{
			"beforeText": {
				"pattern": "\/\/.*"
			},
			"afterText": {
				"pattern": "^(?!\\s*$).+"
			},
			"action": {
				"indent": "none",
				"appendText": "// "
			}
		},
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/groovy/package.json]---
Location: vscode-main/extensions/groovy/package.json

```json
{
  "name": "groovy",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin textmate/groovy.tmbundle Syntaxes/Groovy.tmLanguage ./syntaxes/groovy.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "groovy",
        "aliases": [
          "Groovy",
          "groovy"
        ],
        "extensions": [
          ".groovy",
          ".gvy",
          ".gradle",
          ".jenkinsfile",
          ".nf"
        ],
        "filenames": [
          "Jenkinsfile"
        ],
        "filenamePatterns": [
          "Jenkinsfile*"
        ],
        "firstLine": "^#!.*\\bgroovy\\b",
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "groovy",
        "scopeName": "source.groovy",
        "path": "./syntaxes/groovy.tmLanguage.json"
      }
    ],
    "snippets": [
      {
        "language": "groovy",
        "path": "./snippets/groovy.code-snippets"
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/groovy/package.nls.json]---
Location: vscode-main/extensions/groovy/package.nls.json

```json
{
	"displayName": "Groovy Language Basics",
	"description": "Provides snippets, syntax highlighting and bracket matching in Groovy files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/groovy/snippets/groovy.code-snippets]---
Location: vscode-main/extensions/groovy/snippets/groovy.code-snippets

```text
{
	"replace(dir: …, includes: …, token: …, value: …)": {
		"prefix": "replace",
		"body": "replace(dir:\"${1:dirName}\", includes:\"${2:*.*}\", token:\"${3:tokenName}\", value:\"\\${${4:value}}\")$0",
		"description": "Replace(...)"
	},
	"Doc Block": {
		"prefix": "doc",
		"body": [
			"/**",
			" * $0",
			" */"
		],
		"description": "Doc block comment"
	},
	"key: \"value\" (Hash Pair)": {
		"prefix": "key",
		"body": "${1:key}: ${2:\"${3:value}\"}"
	},
	"Thread.start { … }": {
		"prefix": "thread",
		"body": [
			"Thread.start {",
			"\t$0",
			"}"
		],
		"description": "Thread.start { ... }"
	},
	"Thread.startDaemon { … }": {
		"prefix": "thread",
		"body": [
			"Thread.startDaemon {",
			"\t$0",
			"}"
		],
		"description": "Thread.startDaemon { ... }"
	},
	"case … break": {
		"prefix": "case",
		"body": [
			"case ${1:CASE_NAME}:",
			"\t$2",
			"break$0"
		],
		"description": "case ... break"
	},
	"instance … (Singleton)": {
		"prefix": "instance",
		"body": [
			"private static $1 instance",
			"",
			"static $1 getInstance(${2:args}) { ",
			"\tif (!instance) instance = new $1(${2:args})",
			"\treturn instance",
			"}"
		],
		"description": "Singleton instance + Getter"
	},
	"class … extends GroovyTestCase { … }": {
		"prefix": "tc",
		"body": [
			"class $1 extends GroovyTestCase {",
			"",
			"\t$0",
			"}"
		],
		"description": "GroovyTestCase class"
	},
	"copy(file: …, tofile: …) ": {
		"prefix": "copy",
		"body": "copy(file:\"${1:sourceFile}\", tofile:\"${2:targetFile}\")",
		"description": "Copy file"
	},
	"copy(todir: …) { fileset(dir: …) { include … exclude }": {
		"prefix": "copy",
		"body": [
			"copy(todir:\"${1:targetDir}\") {",
			"\tfileset(dir:\"${2:sourceDir}\") {",
			"\t\tinclude(name:\"${3:includeName}\")",
			"\t\texclude(name:\"${4:excludeName}\")",
			"\t}",
			"}"
		],
		"description": "Copy fileset todir w/ include/exclude"
	},
	"copy(todir: …) { fileset:dir …) }": {
		"prefix": "copy",
		"body": [
			"copy(todir:\"${1:targetDir}\") {",
			"\tfileset(dir:\"${2:sourceDir}\")",
			"}"
		],
		"description": "Copy fileset todir"
	},
	"closure = { … } ": {
		"prefix": "cv",
		"body": [
			"def ${1:closureName} = { ${2:args} ->",
			"\t$0",
			"}"
		],
		"description": "Closure block"
	},
	"for(… in …) { … }": {
		"prefix": "forin",
		"body": [
			"for (${1:element} in ${2:collection}) {",
			"\t$0",
			"}"
		],
		"description": "For-loop"
	},
	"mkdir(dir: …)": {
		"prefix": "mkdir",
		"body": "mkdir(dir:\"${1:dirName}\")",
		"description": "mkdir"
	},
	"print": {
		"prefix": "p",
		"body": "print $0",
		"description": "print"
	},
	"println ": {
		"prefix": "pl",
		"body": "println $0",
		"description": "println"
	},
	"runAfter() { … }": {
		"prefix": "runa",
		"body": [
			"runAfter(${1:delay}) {",
			"\t$0",
			"}"
		],
		"description": "runAfter()  { ... }"
	},
	"setUp() { … }": {
		"prefix": "setup",
		"body": [
			"void setUp() {",
			"\t$0",
			"}"
		],
		"description": "setup() { ... }"
	},
	"sleep(secs) { … // on interrupt do }": {
		"prefix": "sleep",
		"body": [
			"sleep(${1:secs}) {",
			"\t${2:// on interrupt do}",
			"}"
		],
		"description": "sleep with interrupt"
	},
	"sleep(secs)": {
		"prefix": "sleep",
		"body": "sleep(${1:secs})",
		"description": "sleep"
	},
	"sort { … }": {
		"prefix": "sort",
		"body": [
			"sort { ",
			"\t$0",
			"}"
		],
		"description": "sort"
	},
	"static main() { … }": {
		"prefix": "main",
		"body": [
			"static main(args) {",
			"\t$0",
			"}"
		],
		"description": "main method"
	},
	"switch … case": {
		"prefix": "switch",
		"body": [
			"switch(${1:value}) {",
			"\tcase ${2:CASE}:",
			"\t\t$3",
			"\tbreak$0",
			"}"
		],
		"description": "Switch-Case block"
	},
	"switch … case … default": {
		"prefix": "switch",
		"body": [
			"switch(${1:value}) {",
			"\tcase ${3:CASE}:",
			"\t\t$4",
			"\tbreak$0",
			"\tdefault:",
			"\t\t$2",
			"\tbreak",
			"}"
		],
		"description": "Switch-Case-Default block"
	},
	"tearDown() { … }": {
		"prefix": "tear",
		"body": [
			"void tearDown() {",
			"\t$0",
			"}"
		],
		"description": "tearDown() { ... }"
	},
	"test()": {
		"prefix": "t",
		"body": [
			"void test$1() {",
			"\t$0",
			"}"
		],
		"description": "test method"
	},
	"var": {
		"prefix": "v",
		"body": "${1:def} ${2:var}${3: = ${0:null}}",
		"description": "var"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/groovy/syntaxes/groovy.tmLanguage.json]---
Location: vscode-main/extensions/groovy/syntaxes/groovy.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/textmate/groovy.tmbundle/blob/master/Syntaxes/Groovy.tmLanguage",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/textmate/groovy.tmbundle/commit/85d8f7c97ae473ccb9473f6c8d27e4ec957f4be1",
	"name": "Groovy",
	"scopeName": "source.groovy",
	"patterns": [
		{
			"captures": {
				"1": {
					"name": "punctuation.definition.comment.groovy"
				}
			},
			"match": "^(#!).+$\\n",
			"name": "comment.line.hashbang.groovy"
		},
		{
			"captures": {
				"1": {
					"name": "keyword.other.package.groovy"
				},
				"2": {
					"name": "storage.modifier.package.groovy"
				},
				"3": {
					"name": "punctuation.terminator.groovy"
				}
			},
			"match": "^\\s*(package)\\b(?:\\s*([^ ;$]+)\\s*(;)?)?",
			"name": "meta.package.groovy"
		},
		{
			"begin": "(import static)\\b\\s*",
			"beginCaptures": {
				"1": {
					"name": "keyword.other.import.static.groovy"
				}
			},
			"captures": {
				"1": {
					"name": "keyword.other.import.groovy"
				},
				"2": {
					"name": "storage.modifier.import.groovy"
				},
				"3": {
					"name": "punctuation.terminator.groovy"
				}
			},
			"contentName": "storage.modifier.import.groovy",
			"end": "\\s*(?:$|(?=%>)(;))",
			"endCaptures": {
				"1": {
					"name": "punctuation.terminator.groovy"
				}
			},
			"name": "meta.import.groovy",
			"patterns": [
				{
					"match": "\\.",
					"name": "punctuation.separator.groovy"
				},
				{
					"match": "\\s",
					"name": "invalid.illegal.character_not_allowed_here.groovy"
				}
			]
		},
		{
			"begin": "(import)\\b\\s*",
			"beginCaptures": {
				"1": {
					"name": "keyword.other.import.groovy"
				}
			},
			"captures": {
				"1": {
					"name": "keyword.other.import.groovy"
				},
				"2": {
					"name": "storage.modifier.import.groovy"
				},
				"3": {
					"name": "punctuation.terminator.groovy"
				}
			},
			"contentName": "storage.modifier.import.groovy",
			"end": "\\s*(?:$|(?=%>)|(;))",
			"endCaptures": {
				"1": {
					"name": "punctuation.terminator.groovy"
				}
			},
			"name": "meta.import.groovy",
			"patterns": [
				{
					"match": "\\.",
					"name": "punctuation.separator.groovy"
				},
				{
					"match": "\\s",
					"name": "invalid.illegal.character_not_allowed_here.groovy"
				}
			]
		},
		{
			"captures": {
				"1": {
					"name": "keyword.other.import.groovy"
				},
				"2": {
					"name": "keyword.other.import.static.groovy"
				},
				"3": {
					"name": "storage.modifier.import.groovy"
				},
				"4": {
					"name": "punctuation.terminator.groovy"
				}
			},
			"match": "^\\s*(import)(?:\\s+(static)\\s+)\\b(?:\\s*([^ ;$]+)\\s*(;)?)?",
			"name": "meta.import.groovy"
		},
		{
			"include": "#groovy"
		}
	],
	"repository": {
		"annotations": {
			"patterns": [
				{
					"begin": "(?<!\\.)(@[^ (]+)(\\()",
					"beginCaptures": {
						"1": {
							"name": "storage.type.annotation.groovy"
						},
						"2": {
							"name": "punctuation.definition.annotation-arguments.begin.groovy"
						}
					},
					"end": "(\\))",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.annotation-arguments.end.groovy"
						}
					},
					"name": "meta.declaration.annotation.groovy",
					"patterns": [
						{
							"captures": {
								"1": {
									"name": "constant.other.key.groovy"
								},
								"2": {
									"name": "keyword.operator.assignment.groovy"
								}
							},
							"match": "(\\w*)\\s*(=)"
						},
						{
							"include": "#values"
						},
						{
							"match": ",",
							"name": "punctuation.definition.seperator.groovy"
						}
					]
				},
				{
					"match": "(?<!\\.)@\\S+",
					"name": "storage.type.annotation.groovy"
				}
			]
		},
		"anonymous-classes-and-new": {
			"begin": "\\bnew\\b",
			"beginCaptures": {
				"0": {
					"name": "keyword.control.new.groovy"
				}
			},
			"end": "(?<=\\)|\\])(?!\\s*{)|(?<=})|(?=[;])|$",
			"patterns": [
				{
					"begin": "(\\w+)\\s*(?=\\[)",
					"beginCaptures": {
						"1": {
							"name": "storage.type.groovy"
						}
					},
					"end": "}|(?=\\s*(?:,|;|\\)))|$",
					"patterns": [
						{
							"begin": "\\[",
							"end": "\\]",
							"patterns": [
								{
									"include": "#groovy"
								}
							]
						},
						{
							"begin": "{",
							"end": "(?=})",
							"patterns": [
								{
									"include": "#groovy"
								}
							]
						}
					]
				},
				{
					"begin": "(?=\\w.*\\(?)",
					"end": "(?<=\\))|$",
					"patterns": [
						{
							"include": "#object-types"
						},
						{
							"begin": "\\(",
							"beginCaptures": {
								"1": {
									"name": "storage.type.groovy"
								}
							},
							"end": "\\)",
							"patterns": [
								{
									"include": "#groovy"
								}
							]
						}
					]
				},
				{
					"begin": "{",
					"end": "}",
					"name": "meta.inner-class.groovy",
					"patterns": [
						{
							"include": "#class-body"
						}
					]
				}
			]
		},
		"braces": {
			"begin": "\\{",
			"end": "\\}",
			"patterns": [
				{
					"include": "#groovy-code"
				}
			]
		},
		"class": {
			"begin": "(?=\\w?[\\w\\s]*(?:class|(?:@)?interface|enum)\\s+\\w+)",
			"end": "}",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.class.end.groovy"
				}
			},
			"name": "meta.definition.class.groovy",
			"patterns": [
				{
					"include": "#storage-modifiers"
				},
				{
					"include": "#comments"
				},
				{
					"captures": {
						"1": {
							"name": "storage.modifier.groovy"
						},
						"2": {
							"name": "entity.name.type.class.groovy"
						}
					},
					"match": "(class|(?:@)?interface|enum)\\s+(\\w+)",
					"name": "meta.class.identifier.groovy"
				},
				{
					"begin": "extends",
					"beginCaptures": {
						"0": {
							"name": "storage.modifier.extends.groovy"
						}
					},
					"end": "(?={|implements)",
					"name": "meta.definition.class.inherited.classes.groovy",
					"patterns": [
						{
							"include": "#object-types-inherited"
						},
						{
							"include": "#comments"
						}
					]
				},
				{
					"begin": "(implements)\\s",
					"beginCaptures": {
						"1": {
							"name": "storage.modifier.implements.groovy"
						}
					},
					"end": "(?=\\s*extends|\\{)",
					"name": "meta.definition.class.implemented.interfaces.groovy",
					"patterns": [
						{
							"include": "#object-types-inherited"
						},
						{
							"include": "#comments"
						}
					]
				},
				{
					"begin": "{",
					"end": "(?=})",
					"name": "meta.class.body.groovy",
					"patterns": [
						{
							"include": "#class-body"
						}
					]
				}
			]
		},
		"class-body": {
			"patterns": [
				{
					"include": "#enum-values"
				},
				{
					"include": "#constructors"
				},
				{
					"include": "#groovy"
				}
			]
		},
		"closures": {
			"begin": "\\{(?=.*?->)",
			"end": "\\}",
			"patterns": [
				{
					"begin": "(?<=\\{)(?=[^\\}]*?->)",
					"end": "->",
					"endCaptures": {
						"0": {
							"name": "keyword.operator.groovy"
						}
					},
					"patterns": [
						{
							"begin": "(?!->)",
							"end": "(?=->)",
							"name": "meta.closure.parameters.groovy",
							"patterns": [
								{
									"begin": "(?!,|->)",
									"end": "(?=,|->)",
									"name": "meta.closure.parameter.groovy",
									"patterns": [
										{
											"begin": "=",
											"beginCaptures": {
												"0": {
													"name": "keyword.operator.assignment.groovy"
												}
											},
											"end": "(?=,|->)",
											"name": "meta.parameter.default.groovy",
											"patterns": [
												{
													"include": "#groovy-code"
												}
											]
										},
										{
											"include": "#parameters"
										}
									]
								}
							]
						}
					]
				},
				{
					"begin": "(?=[^}])",
					"end": "(?=\\})",
					"patterns": [
						{
							"include": "#groovy-code"
						}
					]
				}
			]
		},
		"comment-block": {
			"begin": "/\\*",
			"captures": {
				"0": {
					"name": "punctuation.definition.comment.groovy"
				}
			},
			"end": "\\*/",
			"name": "comment.block.groovy"
		},
		"comments": {
			"patterns": [
				{
					"captures": {
						"0": {
							"name": "punctuation.definition.comment.groovy"
						}
					},
					"match": "/\\*\\*/",
					"name": "comment.block.empty.groovy"
				},
				{
					"include": "text.html.javadoc"
				},
				{
					"include": "#comment-block"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.comment.groovy"
						}
					},
					"match": "(//).*$\\n?",
					"name": "comment.line.double-slash.groovy"
				}
			]
		},
		"constants": {
			"patterns": [
				{
					"match": "\\b([A-Z][A-Z0-9_]+)\\b",
					"name": "constant.other.groovy"
				},
				{
					"match": "\\b(true|false|null)\\b",
					"name": "constant.language.groovy"
				}
			]
		},
		"constructors": {
			"applyEndPatternLast": 1,
			"begin": "(?<=;|^)(?=\\s*(?:(?:private|protected|public|native|synchronized|abstract|threadsafe|transient|static|final)\\s+)*[A-Z]\\w*\\()",
			"end": "}",
			"patterns": [
				{
					"include": "#method-content"
				}
			]
		},
		"enum-values": {
			"patterns": [
				{
					"begin": "(?<=;|^)\\s*\\b([A-Z0-9_]+)(?=\\s*(?:,|;|}|\\(|$))",
					"beginCaptures": {
						"1": {
							"name": "constant.enum.name.groovy"
						}
					},
					"end": ",|;|(?=})|^(?!\\s*\\w+\\s*(?:,|$))",
					"patterns": [
						{
							"begin": "\\(",
							"end": "\\)",
							"name": "meta.enum.value.groovy",
							"patterns": [
								{
									"match": ",",
									"name": "punctuation.definition.seperator.parameter.groovy"
								},
								{
									"include": "#groovy-code"
								}
							]
						}
					]
				}
			]
		},
		"groovy": {
			"patterns": [
				{
					"include": "#comments"
				},
				{
					"include": "#class"
				},
				{
					"include": "#variables"
				},
				{
					"include": "#methods"
				},
				{
					"include": "#annotations"
				},
				{
					"include": "#groovy-code"
				}
			]
		},
		"groovy-code": {
			"patterns": [
				{
					"include": "#groovy-code-minus-map-keys"
				},
				{
					"include": "#map-keys"
				}
			]
		},
		"groovy-code-minus-map-keys": {
			"comment": "In some situations, maps can't be declared without enclosing []'s, \n\t\t\t\ttherefore we create a collection of everything but that",
			"patterns": [
				{
					"include": "#comments"
				},
				{
					"include": "#annotations"
				},
				{
					"include": "#support-functions"
				},
				{
					"include": "#keyword-language"
				},
				{
					"include": "#values"
				},
				{
					"include": "#anonymous-classes-and-new"
				},
				{
					"include": "#keyword-operator"
				},
				{
					"include": "#types"
				},
				{
					"include": "#storage-modifiers"
				},
				{
					"include": "#parens"
				},
				{
					"include": "#closures"
				},
				{
					"include": "#braces"
				}
			]
		},
		"keyword": {
			"patterns": [
				{
					"include": "#keyword-operator"
				},
				{
					"include": "#keyword-language"
				}
			]
		},
		"keyword-language": {
			"patterns": [
				{
					"match": "\\b(try|catch|finally|throw)\\b",
					"name": "keyword.control.exception.groovy"
				},
				{
					"match": "\\b((?<!\\.)(?:return|break|continue|default|do|while|for|switch|if|else))\\b",
					"name": "keyword.control.groovy"
				},
				{
					"begin": "\\bcase\\b",
					"beginCaptures": {
						"0": {
							"name": "keyword.control.groovy"
						}
					},
					"end": ":",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.case-terminator.groovy"
						}
					},
					"name": "meta.case.groovy",
					"patterns": [
						{
							"include": "#groovy-code-minus-map-keys"
						}
					]
				},
				{
					"begin": "\\b(assert)\\s",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.assert.groovy"
						}
					},
					"end": "$|;|}",
					"name": "meta.declaration.assertion.groovy",
					"patterns": [
						{
							"match": ":",
							"name": "keyword.operator.assert.expression-seperator.groovy"
						},
						{
							"include": "#groovy-code-minus-map-keys"
						}
					]
				},
				{
					"match": "\\b(throws)\\b",
					"name": "keyword.other.throws.groovy"
				}
			]
		},
		"keyword-operator": {
			"patterns": [
				{
					"match": "\\b(as)\\b",
					"name": "keyword.operator.as.groovy"
				},
				{
					"match": "\\b(in)\\b",
					"name": "keyword.operator.in.groovy"
				},
				{
					"match": "\\?\\:",
					"name": "keyword.operator.elvis.groovy"
				},
				{
					"match": "\\*\\:",
					"name": "keyword.operator.spreadmap.groovy"
				},
				{
					"match": "\\.\\.",
					"name": "keyword.operator.range.groovy"
				},
				{
					"match": "\\->",
					"name": "keyword.operator.arrow.groovy"
				},
				{
					"match": "<<",
					"name": "keyword.operator.leftshift.groovy"
				},
				{
					"match": "(?<=\\S)\\.(?=\\S)",
					"name": "keyword.operator.navigation.groovy"
				},
				{
					"match": "(?<=\\S)\\?\\.(?=\\S)",
					"name": "keyword.operator.safe-navigation.groovy"
				},
				{
					"begin": "\\?",
					"beginCaptures": {
						"0": {
							"name": "keyword.operator.ternary.groovy"
						}
					},
					"end": "(?=$|\\)|}|])",
					"name": "meta.evaluation.ternary.groovy",
					"patterns": [
						{
							"match": ":",
							"name": "keyword.operator.ternary.expression-seperator.groovy"
						},
						{
							"include": "#groovy-code-minus-map-keys"
						}
					]
				},
				{
					"match": "==~",
					"name": "keyword.operator.match.groovy"
				},
				{
					"match": "=~",
					"name": "keyword.operator.find.groovy"
				},
				{
					"match": "\\b(instanceof)\\b",
					"name": "keyword.operator.instanceof.groovy"
				},
				{
					"match": "(===|==|!=|<=|>=|<=>|<>|<|>|<<)",
					"name": "keyword.operator.comparison.groovy"
				},
				{
					"match": "=",
					"name": "keyword.operator.assignment.groovy"
				},
				{
					"match": "(\\-\\-|\\+\\+)",
					"name": "keyword.operator.increment-decrement.groovy"
				},
				{
					"match": "(\\-|\\+|\\*|\\/|%)",
					"name": "keyword.operator.arithmetic.groovy"
				},
				{
					"match": "(!|&&|\\|\\|)",
					"name": "keyword.operator.logical.groovy"
				}
			]
		},
		"language-variables": {
			"patterns": [
				{
					"match": "\\b(this|super)\\b",
					"name": "variable.language.groovy"
				}
			]
		},
		"map-keys": {
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "constant.other.key.groovy"
						},
						"2": {
							"name": "punctuation.definition.seperator.key-value.groovy"
						}
					},
					"match": "(\\w+)\\s*(:)"
				}
			]
		},
		"method-call": {
			"begin": "([\\w$]+)(\\()",
			"beginCaptures": {
				"1": {
					"name": "meta.method.groovy"
				},
				"2": {
					"name": "punctuation.definition.method-parameters.begin.groovy"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.method-parameters.end.groovy"
				}
			},
			"name": "meta.method-call.groovy",
			"patterns": [
				{
					"match": ",",
					"name": "punctuation.definition.seperator.parameter.groovy"
				},
				{
					"include": "#groovy-code"
				}
			]
		},
		"method-content": {
			"patterns": [
				{
					"match": "\\s"
				},
				{
					"include": "#annotations"
				},
				{
					"begin": "(?=(?:\\w|<)[^\\(]*\\s+(?:[\\w$]|<)+\\s*\\()",
					"end": "(?=[\\w$]+\\s*\\()",
					"name": "meta.method.return-type.java",
					"patterns": [
						{
							"include": "#storage-modifiers"
						},
						{
							"include": "#types"
						}
					]
				},
				{
					"begin": "([\\w$]+)\\s*\\(",
					"beginCaptures": {
						"1": {
							"name": "entity.name.function.java"
						}
					},
					"end": "\\)",
					"name": "meta.definition.method.signature.java",
					"patterns": [
						{
							"begin": "(?=[^)])",
							"end": "(?=\\))",
							"name": "meta.method.parameters.groovy",
							"patterns": [
								{
									"begin": "(?=[^,)])",
									"end": "(?=,|\\))",
									"name": "meta.method.parameter.groovy",
									"patterns": [
										{
											"match": ",",
											"name": "punctuation.definition.separator.groovy"
										},
										{
											"begin": "=",
											"beginCaptures": {
												"0": {
													"name": "keyword.operator.assignment.groovy"
												}
											},
											"end": "(?=,|\\))",
											"name": "meta.parameter.default.groovy",
											"patterns": [
												{
													"include": "#groovy-code"
												}
											]
										},
										{
											"include": "#parameters"
										}
									]
								}
							]
						}
					]
				},
				{
					"begin": "(?=<)",
					"end": "(?=\\s)",
					"name": "meta.method.paramerised-type.groovy",
					"patterns": [
						{
							"begin": "<",
							"end": ">",
							"name": "storage.type.parameters.groovy",
							"patterns": [
								{
									"include": "#types"
								},
								{
									"match": ",",
									"name": "punctuation.definition.seperator.groovy"
								}
							]
						}
					]
				},
				{
					"begin": "throws",
					"beginCaptures": {
						"0": {
							"name": "storage.modifier.groovy"
						}
					},
					"end": "(?={|;)|^(?=\\s*(?:[^{\\s]|$))",
					"name": "meta.throwables.groovy",
					"patterns": [
						{
							"include": "#object-types"
						}
					]
				},
				{
					"begin": "{",
					"end": "(?=})",
					"name": "meta.method.body.java",
					"patterns": [
						{
							"include": "#groovy-code"
						}
					]
				}
			]
		},
		"methods": {
			"applyEndPatternLast": 1,
			"begin": "(?x:(?<=;|^|{)(?=\\s*\n                (?:\n                    (?:private|protected|public|native|synchronized|abstract|threadsafe|transient|static|final) # visibility/modifier\n                        |\n                    (?:def)\n                        |\n                    (?:\n                        (?:\n                            (?:void|boolean|byte|char|short|int|float|long|double)\n                                |\n                            (?:@?(?:[a-zA-Z]\\w*\\.)*[A-Z]+\\w*) # object type\n                        )\n                        [\\[\\]]*\n                        (?:<.*>)?\n                    ) \n                    \n                )\n                \\s+\n                ([^=]+\\s+)?\\w+\\s*\\(\n\t\t\t))",
			"end": "}|(?=[^{])",
			"name": "meta.definition.method.groovy",
			"patterns": [
				{
					"include": "#method-content"
				}
			]
		},
		"nest_curly": {
			"begin": "\\{",
			"captures": {
				"0": {
					"name": "punctuation.section.scope.groovy"
				}
			},
			"end": "\\}",
			"patterns": [
				{
					"include": "#nest_curly"
				}
			]
		},
		"numbers": {
			"patterns": [
				{
					"match": "((0(x|X)[0-9a-fA-F]*)|(\\+|-)?\\b(([0-9]+\\.?[0-9]*)|(\\.[0-9]+))((e|E)(\\+|-)?[0-9]+)?)([LlFfUuDdg]|UL|ul)?\\b",
					"name": "constant.numeric.groovy"
				}
			]
		},
		"object-types": {
			"patterns": [
				{
					"begin": "\\b((?:[a-z]\\w*\\.)*(?:[A-Z]+\\w*[a-z]+\\w*|UR[LI]))<",
					"end": ">|[^\\w\\s,\\?<\\[\\]]",
					"name": "storage.type.generic.groovy",
					"patterns": [
						{
							"include": "#object-types"
						},
						{
							"begin": "<",
							"comment": "This is just to support <>'s with no actual type prefix",
							"end": ">|[^\\w\\s,\\[\\]<]",
							"name": "storage.type.generic.groovy"
						}
					]
				},
				{
					"begin": "\\b((?:[a-z]\\w*\\.)*[A-Z]+\\w*[a-z]+\\w*)(?=\\[)",
					"end": "(?=[^\\]\\s])",
					"name": "storage.type.object.array.groovy",
					"patterns": [
						{
							"begin": "\\[",
							"end": "\\]",
							"patterns": [
								{
									"include": "#groovy"
								}
							]
						}
					]
				},
				{
					"match": "\\b(?:[a-zA-Z]\\w*\\.)*(?:[A-Z]+\\w*[a-z]+\\w*|UR[LI])\\b",
					"name": "storage.type.groovy"
				}
			]
		},
		"object-types-inherited": {
			"patterns": [
				{
					"begin": "\\b((?:[a-zA-Z]\\w*\\.)*[A-Z]+\\w*[a-z]+\\w*)<",
					"end": ">|[^\\w\\s,\\?<\\[\\]]",
					"name": "entity.other.inherited-class.groovy",
					"patterns": [
						{
							"include": "#object-types-inherited"
						},
						{
							"begin": "<",
							"comment": "This is just to support <>'s with no actual type prefix",
							"end": ">|[^\\w\\s,\\[\\]<]",
							"name": "storage.type.generic.groovy"
						}
					]
				},
				{
					"captures": {
						"1": {
							"name": "keyword.operator.dereference.groovy"
						}
					},
					"match": "\\b(?:[a-zA-Z]\\w*(\\.))*[A-Z]+\\w*[a-z]+\\w*\\b",
					"name": "entity.other.inherited-class.groovy"
				}
			]
		},
		"parameters": {
			"patterns": [
				{
					"include": "#annotations"
				},
				{
					"include": "#storage-modifiers"
				},
				{
					"include": "#types"
				},
				{
					"match": "\\w+",
					"name": "variable.parameter.method.groovy"
				}
			]
		},
		"parens": {
			"begin": "\\(",
			"end": "\\)",
			"patterns": [
				{
					"include": "#groovy-code"
				}
			]
		},
		"primitive-arrays": {
			"patterns": [
				{
					"match": "\\b(?:void|boolean|byte|char|short|int|float|long|double)(\\[\\])*\\b",
					"name": "storage.type.primitive.array.groovy"
				}
			]
		},
		"primitive-types": {
			"patterns": [
				{
					"match": "\\b(?:void|boolean|byte|char|short|int|float|long|double)\\b",
					"name": "storage.type.primitive.groovy"
				}
			]
		},
		"regexp": {
			"patterns": [
				{
					"begin": "/(?=[^/]+/([^>]|$))",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.regexp.begin.groovy"
						}
					},
					"end": "/",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.regexp.end.groovy"
						}
					},
					"name": "string.regexp.groovy",
					"patterns": [
						{
							"match": "\\\\.",
							"name": "constant.character.escape.groovy"
						}
					]
				},
				{
					"begin": "~\"",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.regexp.begin.groovy"
						}
					},
					"end": "\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.regexp.end.groovy"
						}
					},
					"name": "string.regexp.compiled.groovy",
					"patterns": [
						{
							"match": "\\\\.",
							"name": "constant.character.escape.groovy"
						}
					]
				}
			]
		},
		"storage-modifiers": {
			"patterns": [
				{
					"match": "\\b(private|protected|public)\\b",
					"name": "storage.modifier.access-control.groovy"
				},
				{
					"match": "\\b(static)\\b",
					"name": "storage.modifier.static.groovy"
				},
				{
					"match": "\\b(final)\\b",
					"name": "storage.modifier.final.groovy"
				},
				{
					"match": "\\b(native|synchronized|abstract|threadsafe|transient)\\b",
					"name": "storage.modifier.other.groovy"
				}
			]
		},
		"string-quoted-double": {
			"begin": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.groovy"
				}
			},
			"end": "\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.groovy"
				}
			},
			"name": "string.quoted.double.groovy",
			"patterns": [
				{
					"include": "#string-quoted-double-contents"
				}
			]
		},
		"string-quoted-double-contents": {
			"patterns": [
				{
					"match": "\\\\.",
					"name": "constant.character.escape.groovy"
				},
				{
					"applyEndPatternLast": 1,
					"begin": "\\$\\w",
					"end": "(?=\\W)",
					"name": "variable.other.interpolated.groovy",
					"patterns": [
						{
							"match": "\\w",
							"name": "variable.other.interpolated.groovy"
						},
						{
							"match": "\\.",
							"name": "keyword.other.dereference.groovy"
						}
					]
				},
				{
					"begin": "\\$\\{",
					"captures": {
						"0": {
							"name": "punctuation.section.embedded.groovy"
						}
					},
					"end": "\\}",
					"name": "source.groovy.embedded.source",
					"patterns": [
						{
							"include": "#nest_curly"
						}
					]
				}
			]
		},
		"string-quoted-double-multiline": {
			"begin": "\"\"\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.groovy"
				}
			},
			"end": "\"\"\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.groovy"
				}
			},
			"name": "string.quoted.double.multiline.groovy",
			"patterns": [
				{
					"include": "#string-quoted-double-contents"
				}
			]
		},
		"string-quoted-single": {
			"begin": "'",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.groovy"
				}
			},
			"end": "'",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.groovy"
				}
			},
			"name": "string.quoted.single.groovy",
			"patterns": [
				{
					"include": "#string-quoted-single-contents"
				}
			]
		},
		"string-quoted-single-contents": {
			"patterns": [
				{
					"match": "\\\\.",
					"name": "constant.character.escape.groovy"
				}
			]
		},
		"string-quoted-single-multiline": {
			"begin": "'''",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.groovy"
				}
			},
			"end": "'''",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.groovy"
				}
			},
			"name": "string.quoted.single.multiline.groovy",
			"patterns": [
				{
					"include": "#string-quoted-single-contents"
				}
			]
		},
		"strings": {
			"patterns": [
				{
					"include": "#string-quoted-double-multiline"
				},
				{
					"include": "#string-quoted-single-multiline"
				},
				{
					"include": "#string-quoted-double"
				},
				{
					"include": "#string-quoted-single"
				},
				{
					"include": "#regexp"
				}
			]
		},
		"structures": {
			"begin": "\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.structure.begin.groovy"
				}
			},
			"end": "\\]",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.structure.end.groovy"
				}
			},
			"name": "meta.structure.groovy",
			"patterns": [
				{
					"include": "#groovy-code"
				},
				{
					"match": ",",
					"name": "punctuation.definition.separator.groovy"
				}
			]
		},
		"support-functions": {
			"patterns": [
				{
					"match": "(?x)\\b(?:sprintf|print(?:f|ln)?)\\b",
					"name": "support.function.print.groovy"
				},
				{
					"match": "(?x)\\b(?:shouldFail|fail(?:NotEquals)?|ass(?:ume|ert(?:S(?:cript|ame)|N(?:ot(?:Same|\n\t\t\t\t\tNull)|ull)|Contains|T(?:hat|oString|rue)|Inspect|Equals|False|Length|\n\t\t\t\t\tArrayEquals)))\\b",
					"name": "support.function.testing.groovy"
				}
			]
		},
		"types": {
			"patterns": [
				{
					"match": "\\b(def)\\b",
					"name": "storage.type.def.groovy"
				},
				{
					"include": "#primitive-types"
				},
				{
					"include": "#primitive-arrays"
				},
				{
					"include": "#object-types"
				}
			]
		},
		"values": {
			"patterns": [
				{
					"include": "#language-variables"
				},
				{
					"include": "#strings"
				},
				{
					"include": "#numbers"
				},
				{
					"include": "#constants"
				},
				{
					"include": "#types"
				},
				{
					"include": "#structures"
				},
				{
					"include": "#method-call"
				}
			]
		},
		"variables": {
			"applyEndPatternLast": 1,
			"patterns": [
				{
					"begin": "(?x:(?=\n                        (?:\n                            (?:private|protected|public|native|synchronized|abstract|threadsafe|transient|static|final) # visibility/modifier\n                                |\n                            (?:def)\n                                |\n                            (?:void|boolean|byte|char|short|int|float|long|double)\n                                |\n                            (?:(?:[a-z]\\w*\\.)*[A-Z]+\\w*) # object type\n                        )\n                        \\s+\n                        [\\w\\d_<>\\[\\],\\s]+\n                        (?:=|$)\n                        \n        \t\t\t))",
					"end": ";|$",
					"name": "meta.definition.variable.groovy",
					"patterns": [
						{
							"match": "\\s"
						},
						{
							"captures": {
								"1": {
									"name": "constant.variable.groovy"
								}
							},
							"match": "([A-Z_0-9]+)\\s+(?=\\=)"
						},
						{
							"captures": {
								"1": {
									"name": "meta.definition.variable.name.groovy"
								}
							},
							"match": "(\\w[^\\s,]*)\\s+(?=\\=)"
						},
						{
							"begin": "=",
							"beginCaptures": {
								"0": {
									"name": "keyword.operator.assignment.groovy"
								}
							},
							"end": "$",
							"patterns": [
								{
									"include": "#groovy-code"
								}
							]
						},
						{
							"captures": {
								"1": {
									"name": "meta.definition.variable.name.groovy"
								}
							},
							"match": "(\\w[^\\s=]*)(?=\\s*($|;))"
						},
						{
							"include": "#groovy-code"
						}
					]
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/grunt/.npmrc]---
Location: vscode-main/extensions/grunt/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/grunt/.vscodeignore]---
Location: vscode-main/extensions/grunt/.vscodeignore

```text
test/**
src/**
tsconfig.json
out/**
extension.webpack.config.js
package-lock.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/grunt/extension.webpack.config.js]---
Location: vscode-main/extensions/grunt/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults from '../shared.webpack.config.mjs';

export default withDefaults({
	context: import.meta.dirname,
	entry: {
		main: './src/main.ts',
	},
	resolve: {
		mainFields: ['module', 'main']
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/grunt/package-lock.json]---
Location: vscode-main/extensions/grunt/package-lock.json

```json
{
  "name": "grunt",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "grunt",
      "version": "1.0.0",
      "license": "MIT",
      "devDependencies": {
        "@types/node": "22.x"
      },
      "engines": {
        "vscode": "*"
      }
    },
    "node_modules/@types/node": {
      "version": "22.13.10",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.13.10.tgz",
      "integrity": "sha512-I6LPUvlRH+O6VRUqYOcMudhaIdUVWfsjnZavnsraHvpBwaEyMN29ry+0UVJhImYL16xsscu0aske3yA+uPOWfw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.20.0"
      }
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/grunt/package.json]---
Location: vscode-main/extensions/grunt/package.json

```json
{
  "name": "grunt",
  "publisher": "vscode",
  "description": "Extension to add Grunt capabilities to VS Code.",
  "displayName": "Grunt support for VS Code",
  "version": "1.0.0",
  "private": true,
  "icon": "images/grunt.png",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "categories": [
    "Other"
  ],
  "scripts": {
    "compile": "gulp compile-extension:grunt",
    "watch": "gulp watch-extension:grunt"
  },
  "dependencies": {},
  "devDependencies": {
    "@types/node": "22.x"
  },
  "main": "./out/main",
  "activationEvents": [
    "onTaskType:grunt"
  ],
  "capabilities": {
    "virtualWorkspaces": false,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "contributes": {
    "configuration": {
      "id": "grunt",
      "type": "object",
      "title": "Grunt",
      "properties": {
        "grunt.autoDetect": {
          "scope": "application",
          "type": "string",
          "enum": [
            "off",
            "on"
          ],
          "default": "off",
          "description": "%config.grunt.autoDetect%"
        }
      }
    },
    "taskDefinitions": [
      {
        "type": "grunt",
        "required": [
          "task"
        ],
        "properties": {
          "task": {
            "type": "string",
            "description": "%grunt.taskDefinition.type.description%"
          },
          "args": {
            "type": "array",
            "description": "%grunt.taskDefinition.args.description%"
          },
          "file": {
            "type": "string",
            "description": "%grunt.taskDefinition.file.description%"
          }
        },
        "when": "shellExecutionSupported"
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/grunt/package.nls.json]---
Location: vscode-main/extensions/grunt/package.nls.json

```json
{
	"description": "Extension to add Grunt capabilities to VS Code.",
	"displayName": "Grunt support for VS Code",
	"config.grunt.autoDetect": "Controls enablement of Grunt task detection. Grunt task detection can cause files in any open workspace to be executed.",
	"grunt.taskDefinition.type.description": "The Grunt task to customize.",
	"grunt.taskDefinition.args.description": "Command line arguments to pass to the grunt task",
	"grunt.taskDefinition.file.description": "The Grunt file that provides the task. Can be omitted."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/grunt/README.md]---
Location: vscode-main/extensions/grunt/README.md

```markdown
# Grunt - The JavaScript Task Runner

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

This extension supports running [Grunt](https://gruntjs.com/) tasks defined in a `gruntfile.js` file as [VS Code tasks](https://code.visualstudio.com/docs/editor/tasks). Grunt tasks with the name 'build', 'compile', or 'watch' are treated as build tasks.

To run Grunt tasks, use the **Tasks** menu.

## Settings

- `grunt.autoDetect` - Enable detecting tasks from `gruntfile.js` files, the default is `on`.
```

--------------------------------------------------------------------------------

---[FILE: extensions/grunt/tsconfig.json]---
Location: vscode-main/extensions/grunt/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"types": [
			"node"
		],
		"typeRoots": [
			"./node_modules/@types"
		]
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/grunt/src/main.ts]---
Location: vscode-main/extensions/grunt/src/main.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as fs from 'fs';
import * as cp from 'child_process';
import * as vscode from 'vscode';

type AutoDetect = 'on' | 'off';

function exists(file: string): Promise<boolean> {
	return new Promise<boolean>((resolve, _reject) => {
		fs.exists(file, (value) => {
			resolve(value);
		});
	});
}

function exec(command: string, options: cp.ExecOptions): Promise<{ stdout: string; stderr: string }> {
	return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
		cp.exec(command, options, (error, stdout, stderr) => {
			if (error) {
				reject({ error, stdout, stderr });
			}
			resolve({ stdout, stderr });
		});
	});
}

const buildNames: string[] = ['build', 'compile', 'watch'];
function isBuildTask(name: string): boolean {
	for (const buildName of buildNames) {
		if (name.indexOf(buildName) !== -1) {
			return true;
		}
	}
	return false;
}

const testNames: string[] = ['test'];
function isTestTask(name: string): boolean {
	for (const testName of testNames) {
		if (name.indexOf(testName) !== -1) {
			return true;
		}
	}
	return false;
}

let _channel: vscode.OutputChannel;
function getOutputChannel(): vscode.OutputChannel {
	if (!_channel) {
		_channel = vscode.window.createOutputChannel('Grunt Auto Detection');
	}
	return _channel;
}

function showError() {
	vscode.window.showWarningMessage(vscode.l10n.t("Problem finding grunt tasks. See the output for more information."),
		vscode.l10n.t("Go to output")).then(() => {
			getOutputChannel().show(true);
		});
}
interface GruntTaskDefinition extends vscode.TaskDefinition {
	task: string;
	args?: string[];
	file?: string;
}

async function findGruntCommand(rootPath: string): Promise<string> {
	let command: string;
	const platform = process.platform;
	if (platform === 'win32' && await exists(path.join(rootPath!, 'node_modules', '.bin', 'grunt.cmd'))) {
		command = path.join('.', 'node_modules', '.bin', 'grunt.cmd');
	} else if ((platform === 'linux' || platform === 'darwin') && await exists(path.join(rootPath!, 'node_modules', '.bin', 'grunt'))) {
		command = path.join('.', 'node_modules', '.bin', 'grunt');
	} else {
		command = 'grunt';
	}
	return command;
}

class FolderDetector {

	private fileWatcher: vscode.FileSystemWatcher | undefined;
	private promise: Thenable<vscode.Task[]> | undefined;

	constructor(
		private _workspaceFolder: vscode.WorkspaceFolder,
		private _gruntCommand: Promise<string>) {
	}

	public get workspaceFolder(): vscode.WorkspaceFolder {
		return this._workspaceFolder;
	}

	public isEnabled(): boolean {
		return vscode.workspace.getConfiguration('grunt', this._workspaceFolder.uri).get<AutoDetect>('autoDetect') === 'on';
	}

	public start(): void {
		const pattern = path.join(this._workspaceFolder.uri.fsPath, '{node_modules,[Gg]runtfile.js}');
		this.fileWatcher = vscode.workspace.createFileSystemWatcher(pattern);
		this.fileWatcher.onDidChange(() => this.promise = undefined);
		this.fileWatcher.onDidCreate(() => this.promise = undefined);
		this.fileWatcher.onDidDelete(() => this.promise = undefined);
	}

	public async getTasks(): Promise<vscode.Task[]> {
		if (this.isEnabled()) {
			if (!this.promise) {
				this.promise = this.computeTasks();
			}
			return this.promise;
		} else {
			return [];
		}
	}

	public async getTask(_task: vscode.Task): Promise<vscode.Task | undefined> {
		const taskDefinition = _task.definition;
		const gruntTask = taskDefinition.task;
		if (gruntTask) {
			const options: vscode.ShellExecutionOptions = { cwd: this.workspaceFolder.uri.fsPath };
			const source = 'grunt';
			const task = gruntTask.indexOf(' ') === -1
				? new vscode.Task(taskDefinition, this.workspaceFolder, gruntTask, source, new vscode.ShellExecution(`${await this._gruntCommand}`, [gruntTask, ...taskDefinition.args], options))
				: new vscode.Task(taskDefinition, this.workspaceFolder, gruntTask, source, new vscode.ShellExecution(`${await this._gruntCommand}`, [`"${gruntTask}"`, ...taskDefinition.args], options));
			return task;
		}
		return undefined;
	}

	private async computeTasks(): Promise<vscode.Task[]> {
		const rootPath = this._workspaceFolder.uri.scheme === 'file' ? this._workspaceFolder.uri.fsPath : undefined;
		const emptyTasks: vscode.Task[] = [];
		if (!rootPath) {
			return emptyTasks;
		}
		if (!await exists(path.join(rootPath, 'gruntfile.js')) && !await exists(path.join(rootPath, 'Gruntfile.js'))) {
			return emptyTasks;
		}

		const commandLine = `${await this._gruntCommand} --help --no-color`;
		try {
			const { stdout, stderr } = await exec(commandLine, { cwd: rootPath });
			if (stderr) {
				getOutputChannel().appendLine(stderr);
				showError();
			}
			const result: vscode.Task[] = [];
			if (stdout) {
				// grunt lists tasks as follows (description is wrapped into a new line if too long):
				// ...
				// Available tasks
				//         uglify  Minify files with UglifyJS. *
				//         jshint  Validate files with JSHint. *
				//           test  Alias for "jshint", "qunit" tasks.
				//        default  Alias for "jshint", "qunit", "concat", "uglify" tasks.
				//           long  Alias for "eslint", "qunit", "browserify", "sass",
				//                 "autoprefixer", "uglify", tasks.
				//
				// Tasks run in the order specified

				const lines = stdout.split(/\r{0,1}\n/);
				let tasksStart = false;
				let tasksEnd = false;
				for (const line of lines) {
					if (line.length === 0) {
						continue;
					}
					if (!tasksStart && !tasksEnd) {
						if (line.indexOf('Available tasks') === 0) {
							tasksStart = true;
						}
					} else if (tasksStart && !tasksEnd) {
						if (line.indexOf('Tasks run in the order specified') === 0) {
							tasksEnd = true;
						} else {
							const regExp = /^\s*(\S.*\S)  \S/g;
							const matches = regExp.exec(line);
							if (matches && matches.length === 2) {
								const name = matches[1];
								const kind: GruntTaskDefinition = {
									type: 'grunt',
									task: name
								};
								const source = 'grunt';
								const options: vscode.ShellExecutionOptions = { cwd: this.workspaceFolder.uri.fsPath };
								const task = name.indexOf(' ') === -1
									? new vscode.Task(kind, this.workspaceFolder, name, source, new vscode.ShellExecution(`${await this._gruntCommand} ${name}`, options))
									: new vscode.Task(kind, this.workspaceFolder, name, source, new vscode.ShellExecution(`${await this._gruntCommand} "${name}"`, options));
								result.push(task);
								const lowerCaseTaskName = name.toLowerCase();
								if (isBuildTask(lowerCaseTaskName)) {
									task.group = vscode.TaskGroup.Build;
								} else if (isTestTask(lowerCaseTaskName)) {
									task.group = vscode.TaskGroup.Test;
								}
							}
						}
					}
				}
			}
			return result;
		} catch (err) {
			const channel = getOutputChannel();
			if (err.stderr) {
				channel.appendLine(err.stderr);
			}
			if (err.stdout) {
				channel.appendLine(err.stdout);
			}
			channel.appendLine(vscode.l10n.t("Auto detecting Grunt for folder {0} failed with error: {1}', this.workspaceFolder.name, err.error ? err.error.toString() : 'unknown"));
			showError();
			return emptyTasks;
		}
	}

	public dispose() {
		this.promise = undefined;
		if (this.fileWatcher) {
			this.fileWatcher.dispose();
		}
	}
}

class TaskDetector {

	private taskProvider: vscode.Disposable | undefined;
	private detectors: Map<string, FolderDetector> = new Map();

	constructor() {
	}

	public start(): void {
		const folders = vscode.workspace.workspaceFolders;
		if (folders) {
			this.updateWorkspaceFolders(folders, []);
		}
		vscode.workspace.onDidChangeWorkspaceFolders((event) => this.updateWorkspaceFolders(event.added, event.removed));
		vscode.workspace.onDidChangeConfiguration(this.updateConfiguration, this);
	}

	public dispose(): void {
		if (this.taskProvider) {
			this.taskProvider.dispose();
			this.taskProvider = undefined;
		}
		this.detectors.clear();
	}

	private updateWorkspaceFolders(added: readonly vscode.WorkspaceFolder[], removed: readonly vscode.WorkspaceFolder[]): void {
		for (const remove of removed) {
			const detector = this.detectors.get(remove.uri.toString());
			if (detector) {
				detector.dispose();
				this.detectors.delete(remove.uri.toString());
			}
		}
		for (const add of added) {
			const detector = new FolderDetector(add, findGruntCommand(add.uri.fsPath));
			this.detectors.set(add.uri.toString(), detector);
			if (detector.isEnabled()) {
				detector.start();
			}
		}
		this.updateProvider();
	}

	private updateConfiguration(): void {
		for (const detector of this.detectors.values()) {
			detector.dispose();
			this.detectors.delete(detector.workspaceFolder.uri.toString());
		}
		const folders = vscode.workspace.workspaceFolders;
		if (folders) {
			for (const folder of folders) {
				if (!this.detectors.has(folder.uri.toString())) {
					const detector = new FolderDetector(folder, findGruntCommand(folder.uri.fsPath));
					this.detectors.set(folder.uri.toString(), detector);
					if (detector.isEnabled()) {
						detector.start();
					}
				}
			}
		}
		this.updateProvider();
	}

	private updateProvider(): void {
		if (!this.taskProvider && this.detectors.size > 0) {
			const thisCapture = this;
			this.taskProvider = vscode.tasks.registerTaskProvider('grunt', {
				provideTasks: (): Promise<vscode.Task[]> => {
					return thisCapture.getTasks();
				},
				resolveTask(_task: vscode.Task): Promise<vscode.Task | undefined> {
					return thisCapture.getTask(_task);
				}
			});
		}
		else if (this.taskProvider && this.detectors.size === 0) {
			this.taskProvider.dispose();
			this.taskProvider = undefined;
		}
	}

	public getTasks(): Promise<vscode.Task[]> {
		return this.computeTasks();
	}

	private computeTasks(): Promise<vscode.Task[]> {
		if (this.detectors.size === 0) {
			return Promise.resolve([]);
		} else if (this.detectors.size === 1) {
			return this.detectors.values().next().value!.getTasks();
		} else {
			const promises: Promise<vscode.Task[]>[] = [];
			for (const detector of this.detectors.values()) {
				promises.push(detector.getTasks().then((value) => value, () => []));
			}
			return Promise.all(promises).then((values) => {
				const result: vscode.Task[] = [];
				for (const tasks of values) {
					if (tasks && tasks.length > 0) {
						result.push(...tasks);
					}
				}
				return result;
			});
		}
	}

	public async getTask(task: vscode.Task): Promise<vscode.Task | undefined> {
		if (this.detectors.size === 0) {
			return undefined;
		} else if (this.detectors.size === 1) {
			return this.detectors.values().next().value!.getTask(task);
		} else {
			if ((task.scope === vscode.TaskScope.Workspace) || (task.scope === vscode.TaskScope.Global)) {
				return undefined;
			} else if (task.scope) {
				const detector = this.detectors.get(task.scope.uri.toString());
				if (detector) {
					return detector.getTask(task);
				}
			}
			return undefined;
		}
	}
}

let detector: TaskDetector;
export function activate(_context: vscode.ExtensionContext): void {
	detector = new TaskDetector();
	detector.start();
}

export function deactivate(): void {
	detector.dispose();
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/gulp/.npmrc]---
Location: vscode-main/extensions/gulp/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/gulp/.vscodeignore]---
Location: vscode-main/extensions/gulp/.vscodeignore

```text
src/**
tsconfig.json
out/**
extension.webpack.config.js
package-lock.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/gulp/extension.webpack.config.js]---
Location: vscode-main/extensions/gulp/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults from '../shared.webpack.config.mjs';

export default withDefaults({
	context: import.meta.dirname,
	entry: {
		main: './src/main.ts',
	},
	resolve: {
		mainFields: ['module', 'main']
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/gulp/package-lock.json]---
Location: vscode-main/extensions/gulp/package-lock.json

```json
{
  "name": "gulp",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "gulp",
      "version": "1.0.0",
      "license": "MIT",
      "devDependencies": {
        "@types/node": "22.x"
      },
      "engines": {
        "vscode": "*"
      }
    },
    "node_modules/@types/node": {
      "version": "22.13.10",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.13.10.tgz",
      "integrity": "sha512-I6LPUvlRH+O6VRUqYOcMudhaIdUVWfsjnZavnsraHvpBwaEyMN29ry+0UVJhImYL16xsscu0aske3yA+uPOWfw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.20.0"
      }
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/gulp/package.json]---
Location: vscode-main/extensions/gulp/package.json

```json
{
  "name": "gulp",
  "publisher": "vscode",
  "description": "%description%",
  "displayName": "%displayName%",
  "version": "1.0.0",
  "icon": "images/gulp.png",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "categories": [
    "Other"
  ],
  "scripts": {
    "compile": "gulp compile-extension:gulp",
    "watch": "gulp watch-extension:gulp"
  },
  "dependencies": {},
  "devDependencies": {
    "@types/node": "22.x"
  },
  "main": "./out/main",
  "activationEvents": [
    "onTaskType:gulp"
  ],
  "capabilities": {
    "virtualWorkspaces": false,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "contributes": {
    "configuration": {
      "id": "gulp",
      "type": "object",
      "title": "Gulp",
      "properties": {
        "gulp.autoDetect": {
          "scope": "application",
          "type": "string",
          "enum": [
            "off",
            "on"
          ],
          "default": "off",
          "description": "%config.gulp.autoDetect%"
        }
      }
    },
    "taskDefinitions": [
      {
        "type": "gulp",
        "required": [
          "task"
        ],
        "properties": {
          "task": {
            "type": "string",
            "description": "%gulp.taskDefinition.type.description%"
          },
          "file": {
            "type": "string",
            "description": "%gulp.taskDefinition.file.description%"
          }
        },
        "when": "shellExecutionSupported"
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/gulp/package.nls.json]---
Location: vscode-main/extensions/gulp/package.nls.json

```json
{
	"description": "Extension to add Gulp capabilities to VSCode.",
	"displayName": "Gulp support for VSCode",
	"config.gulp.autoDetect": "Controls enablement of Gulp task detection. Gulp task detection can cause files in any open workspace to be executed.",
	"gulp.taskDefinition.type.description": "The Gulp task to customize.",
	"gulp.taskDefinition.file.description": "The Gulp file that provides the task. Can be omitted."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/gulp/README.md]---
Location: vscode-main/extensions/gulp/README.md

```markdown
# Gulp - Automate and enhance your workflow

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

This extension supports running [Gulp](https://gulpjs.com/) tasks defined in a `gulpfile.{js,ts}` file as [VS Code tasks](https://code.visualstudio.com/docs/editor/tasks). Gulp tasks with the name 'build', 'compile', or 'watch' are treated as build tasks.

To run Gulp tasks, use the **Tasks** menu.

## Settings

- `gulp.autoDetect` - Enable detecting tasks from `gulpfile.{js,ts}` files, the default is `on`.
```

--------------------------------------------------------------------------------

---[FILE: extensions/gulp/tsconfig.json]---
Location: vscode-main/extensions/gulp/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"types": [
			"node"
		],
		"typeRoots": [
			"./node_modules/@types"
		]
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/gulp/src/main.ts]---
Location: vscode-main/extensions/gulp/src/main.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as fs from 'fs';
import * as cp from 'child_process';
import * as vscode from 'vscode';


type AutoDetect = 'on' | 'off';

/**
 * Check if the given filename is a file.
 *
 * If returns false in case the file does not exist or
 * the file stats cannot be accessed/queried or it
 * is no file at all.
 *
 * @param filename
 *   the filename to the checked
 * @returns
 *   true in case the file exists, in any other case false.
 */
async function exists(filename: string): Promise<boolean> {
	try {

		if ((await fs.promises.stat(filename)).isFile()) {
			return true;
		}
	} catch (ex) {
		// In case requesting the file statistics fail.
		// we assume it does not exist.
		return false;
	}

	return false;
}

function exec(command: string, options: cp.ExecOptions): Promise<{ stdout: string; stderr: string }> {
	return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
		cp.exec(command, options, (error, stdout, stderr) => {
			if (error) {
				reject({ error, stdout, stderr });
			}
			resolve({ stdout, stderr });
		});
	});
}

const buildNames: string[] = ['build', 'compile', 'watch'];
function isBuildTask(name: string): boolean {
	for (const buildName of buildNames) {
		if (name.indexOf(buildName) !== -1) {
			return true;
		}
	}
	return false;
}

const testNames: string[] = ['test'];
function isTestTask(name: string): boolean {
	for (const testName of testNames) {
		if (name.indexOf(testName) !== -1) {
			return true;
		}
	}
	return false;
}

let _channel: vscode.OutputChannel;
function getOutputChannel(): vscode.OutputChannel {
	if (!_channel) {
		_channel = vscode.window.createOutputChannel('Gulp Auto Detection');
	}
	return _channel;
}

function showError() {
	vscode.window.showWarningMessage(vscode.l10n.t("Problem finding gulp tasks. See the output for more information."),
		vscode.l10n.t("Go to output")).then((choice) => {
			if (choice !== undefined) {
				_channel.show(true);
			}
		});
}

async function findGulpCommand(rootPath: string): Promise<string> {
	const platform = process.platform;

	if (platform === 'win32' && await exists(path.join(rootPath, 'node_modules', '.bin', 'gulp.cmd'))) {
		const globalGulp = path.join(process.env.APPDATA ? process.env.APPDATA : '', 'npm', 'gulp.cmd');
		if (await exists(globalGulp)) {
			return `"${globalGulp}"`;
		}

		return path.join('.', 'node_modules', '.bin', 'gulp.cmd');

	}

	if ((platform === 'linux' || platform === 'darwin') && await exists(path.join(rootPath, 'node_modules', '.bin', 'gulp'))) {
		return path.join('.', 'node_modules', '.bin', 'gulp');
	}

	return 'gulp';
}

interface GulpTaskDefinition extends vscode.TaskDefinition {
	task: string;
	file?: string;
}

class FolderDetector {

	private fileWatcher: vscode.FileSystemWatcher | undefined;
	private promise: Thenable<vscode.Task[]> | undefined;

	constructor(
		private _workspaceFolder: vscode.WorkspaceFolder,
		private _gulpCommand: Promise<string>) {
	}

	public get workspaceFolder(): vscode.WorkspaceFolder {
		return this._workspaceFolder;
	}

	public isEnabled(): boolean {
		return vscode.workspace.getConfiguration('gulp', this._workspaceFolder.uri).get<AutoDetect>('autoDetect') === 'on';
	}

	public start(): void {
		const pattern = path.join(this._workspaceFolder.uri.fsPath, '{node_modules,gulpfile{.babel.js,.esm.js,.js,.mjs,.cjs,.ts}}');
		this.fileWatcher = vscode.workspace.createFileSystemWatcher(pattern);
		this.fileWatcher.onDidChange(() => this.promise = undefined);
		this.fileWatcher.onDidCreate(() => this.promise = undefined);
		this.fileWatcher.onDidDelete(() => this.promise = undefined);
	}

	public async getTasks(): Promise<vscode.Task[]> {
		if (!this.isEnabled()) {
			return [];
		}

		if (!this.promise) {
			this.promise = this.computeTasks();
		}

		return this.promise;
	}

	public async getTask(_task: vscode.Task): Promise<vscode.Task | undefined> {
		const gulpTask = _task.definition.task;
		if (gulpTask) {
			const kind = _task.definition as GulpTaskDefinition;
			const options: vscode.ShellExecutionOptions = { cwd: this.workspaceFolder.uri.fsPath };
			const task = new vscode.Task(kind, this.workspaceFolder, gulpTask, 'gulp', new vscode.ShellExecution(await this._gulpCommand, [gulpTask], options));
			return task;
		}
		return undefined;
	}

	/**
	 * Searches for a gulp entry point inside the given folder.
	 *
	 * Typically the entry point is a file named "gulpfile.js"
	 *
	 * It can also be a transposed gulp entry points, like gulp.babel.js or gulp.esm.js
	 *
	 * Additionally recent node version prefer the .mjs or .cjs extension over the .js.
	 *
	 * @param root
	 *   the folder which should be checked.
	 */
	private async hasGulpfile(root: string): Promise<boolean | undefined> {

		for (const filename of await fs.promises.readdir(root)) {

			const ext = path.extname(filename);
			if (ext !== '.js' && ext !== '.mjs' && ext !== '.cjs' && ext !== '.ts') {
				continue;
			}

			if (!exists(filename)) {
				continue;
			}

			const basename = path.basename(filename, ext).toLowerCase();
			if (basename === 'gulpfile') {
				return true;
			}
			if (basename === 'gulpfile.esm') {
				return true;
			}
			if (basename === 'gulpfile.babel') {
				return true;
			}
		}

		return false;
	}

	private async computeTasks(): Promise<vscode.Task[]> {
		const rootPath = this._workspaceFolder.uri.scheme === 'file' ? this._workspaceFolder.uri.fsPath : undefined;
		const emptyTasks: vscode.Task[] = [];
		if (!rootPath) {
			return emptyTasks;
		}

		if (!await this.hasGulpfile(rootPath)) {
			return emptyTasks;
		}

		const commandLine = `${await this._gulpCommand} --tasks-simple --no-color`;
		try {
			const { stdout, stderr } = await exec(commandLine, { cwd: rootPath });
			if (stderr && stderr.length > 0) {
				// Filter out "No license field"
				const errors = stderr.split('\n');
				errors.pop(); // The last line is empty.
				if (!errors.every(value => value.indexOf('No license field') >= 0)) {
					getOutputChannel().appendLine(stderr);
					showError();
				}
			}
			const result: vscode.Task[] = [];
			if (stdout) {
				const lines = stdout.split(/\r{0,1}\n/);
				for (const line of lines) {
					if (line.length === 0) {
						continue;
					}
					const kind: GulpTaskDefinition = {
						type: 'gulp',
						task: line
					};
					const options: vscode.ShellExecutionOptions = { cwd: this.workspaceFolder.uri.fsPath };
					const task = new vscode.Task(kind, this.workspaceFolder, line, 'gulp', new vscode.ShellExecution(await this._gulpCommand, [line], options));
					result.push(task);
					const lowerCaseLine = line.toLowerCase();
					if (isBuildTask(lowerCaseLine)) {
						task.group = vscode.TaskGroup.Build;
					} else if (isTestTask(lowerCaseLine)) {
						task.group = vscode.TaskGroup.Test;
					}
				}
			}
			return result;
		} catch (err) {
			const channel = getOutputChannel();
			if (err.stderr) {
				channel.appendLine(err.stderr);
			}
			if (err.stdout) {
				channel.appendLine(err.stdout);
			}
			channel.appendLine(vscode.l10n.t("Auto detecting gulp for folder {0} failed with error: {1}', this.workspaceFolder.name, err.error ? err.error.toString() : 'unknown"));
			showError();
			return emptyTasks;
		}
	}

	public dispose() {
		this.promise = undefined;
		if (this.fileWatcher) {
			this.fileWatcher.dispose();
		}
	}
}

class TaskDetector {

	private taskProvider: vscode.Disposable | undefined;
	private detectors: Map<string, FolderDetector> = new Map();

	constructor() {
	}

	public start(): void {
		const folders = vscode.workspace.workspaceFolders;
		if (folders) {
			this.updateWorkspaceFolders(folders, []);
		}
		vscode.workspace.onDidChangeWorkspaceFolders((event) => this.updateWorkspaceFolders(event.added, event.removed));
		vscode.workspace.onDidChangeConfiguration(this.updateConfiguration, this);
	}

	public dispose(): void {
		if (this.taskProvider) {
			this.taskProvider.dispose();
			this.taskProvider = undefined;
		}
		this.detectors.clear();
	}

	private updateWorkspaceFolders(added: readonly vscode.WorkspaceFolder[], removed: readonly vscode.WorkspaceFolder[]): void {
		for (const remove of removed) {
			const detector = this.detectors.get(remove.uri.toString());
			if (detector) {
				detector.dispose();
				this.detectors.delete(remove.uri.toString());
			}
		}
		for (const add of added) {
			const detector = new FolderDetector(add, findGulpCommand(add.uri.fsPath));
			this.detectors.set(add.uri.toString(), detector);
			if (detector.isEnabled()) {
				detector.start();
			}
		}
		this.updateProvider();
	}

	private updateConfiguration(): void {
		for (const detector of this.detectors.values()) {
			detector.dispose();
			this.detectors.delete(detector.workspaceFolder.uri.toString());
		}
		const folders = vscode.workspace.workspaceFolders;
		if (folders) {
			for (const folder of folders) {
				if (!this.detectors.has(folder.uri.toString())) {
					const detector = new FolderDetector(folder, findGulpCommand(folder.uri.fsPath));
					this.detectors.set(folder.uri.toString(), detector);
					if (detector.isEnabled()) {
						detector.start();
					}
				}
			}
		}
		this.updateProvider();
	}

	private updateProvider(): void {
		if (!this.taskProvider && this.detectors.size > 0) {
			const thisCapture = this;
			this.taskProvider = vscode.tasks.registerTaskProvider('gulp', {
				provideTasks(): Promise<vscode.Task[]> {
					return thisCapture.getTasks();
				},
				resolveTask(_task: vscode.Task): Promise<vscode.Task | undefined> {
					return thisCapture.getTask(_task);
				}
			});
		}
		else if (this.taskProvider && this.detectors.size === 0) {
			this.taskProvider.dispose();
			this.taskProvider = undefined;
		}
	}

	public getTasks(): Promise<vscode.Task[]> {
		return this.computeTasks();
	}

	private computeTasks(): Promise<vscode.Task[]> {
		if (this.detectors.size === 0) {
			return Promise.resolve([]);
		} else if (this.detectors.size === 1) {
			return this.detectors.values().next().value!.getTasks();
		} else {
			const promises: Promise<vscode.Task[]>[] = [];
			for (const detector of this.detectors.values()) {
				promises.push(detector.getTasks().then((value) => value, () => []));
			}
			return Promise.all(promises).then((values) => {
				const result: vscode.Task[] = [];
				for (const tasks of values) {
					if (tasks && tasks.length > 0) {
						result.push(...tasks);
					}
				}
				return result;
			});
		}
	}

	public async getTask(task: vscode.Task): Promise<vscode.Task | undefined> {
		if (this.detectors.size === 0) {
			return undefined;
		} else if (this.detectors.size === 1) {
			return this.detectors.values().next().value!.getTask(task);
		} else {
			if ((task.scope === vscode.TaskScope.Workspace) || (task.scope === vscode.TaskScope.Global)) {
				// Not supported, we don't have enough info to create the task.
				return undefined;
			} else if (task.scope) {
				const detector = this.detectors.get(task.scope.uri.toString());
				if (detector) {
					return detector.getTask(task);
				}
			}
			return undefined;
		}
	}
}

let detector: TaskDetector;
export function activate(_context: vscode.ExtensionContext): void {
	detector = new TaskDetector();
	detector.start();
}

export function deactivate(): void {
	detector.dispose();
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/handlebars/.vscodeignore]---
Location: vscode-main/extensions/handlebars/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/handlebars/cgmanifest.json]---
Location: vscode-main/extensions/handlebars/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "daaain/Handlebars",
					"repositoryUrl": "https://github.com/daaain/Handlebars",
					"commitHash": "85a153a6f759df4e8da7533e1b3651f007867c51"
				}
			},
			"licenseDetail": [
				"-- Credits",
				"",
				"Adapted from the great sublime-text-handlebars package by Nicholas Westlake.",
				"",
				"Thanks a lot to all the generous contributors (in alphabetical order): @bittersweetryan, @bradcliffe, @calumbrodie, @duncanbeevers, @hlvnst, @jonschlinkert, @Krutius, @samselikoff, @utkarshkukreti, @zeppelin",
				"",
				"-- License",
				"",
				"(The MIT License)",
				"",
				"Copyright (c) daaain/Handlebars project authors",
				"",
				"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:",
				"",
				"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
				"",
				"THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
			],
			"license": "MIT",
			"version": "1.8.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

````
