---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 195
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 195 of 552)

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

---[FILE: src/vs/code/browser/workbench/workbench-dev.html]---
Location: vscode-main/src/vs/code/browser/workbench/workbench-dev.html

```html
<!-- Copyright (C) Microsoft Corporation. All rights reserved. -->
<!DOCTYPE html>
<html>
	<head>
		<script>
			performance.mark('code/didStartRenderer');
		</script>
		<meta charset="utf-8" />

		<!-- Mobile tweaks -->
		<meta name="mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-title" content="Code">
		<link rel="apple-touch-icon" href="{{WORKBENCH_WEB_BASE_URL}}/resources/server/code-192.png" />

		<!-- Disable pinch zooming -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">

		<!-- Workbench Configuration -->
		<meta id="vscode-workbench-web-configuration" data-settings="{{WORKBENCH_WEB_CONFIGURATION}}">

		<!-- Workbench Auth Session -->
		<meta id="vscode-workbench-auth-session" data-settings="{{WORKBENCH_AUTH_SESSION}}">

		<!-- Builtin Extensions (running out of sources) -->
		<meta id="vscode-workbench-builtin-extensions" data-settings="{{WORKBENCH_BUILTIN_EXTENSIONS}}">

		<!-- Workbench Icon/Manifest/CSS -->
		<link rel="icon" href="{{WORKBENCH_WEB_BASE_URL}}/resources/server/favicon.ico" type="image/x-icon" />
		<link rel="manifest" href="{{WORKBENCH_WEB_BASE_URL}}/resources/server/manifest.json" crossorigin="use-credentials" />
		<style id="vscode-css-modules" type="text/css" media="screen"></style>

	</head>

	<body aria-label="">
	</body>

	<!-- Startup (do not modify order of script tags!) -->
	<script>
		const baseUrl = new URL('{{WORKBENCH_WEB_BASE_URL}}', window.location.origin).toString();
		globalThis._VSCODE_FILE_ROOT = baseUrl + '/out/';
	</script>
	<script>
		const sheet = document.getElementById('vscode-css-modules').sheet;
		globalThis._VSCODE_CSS_LOAD = function (url) {
			sheet.insertRule(`@import url(${url});`);
		};

		const importMap = { imports: {} };
		const cssModules = JSON.parse('{{WORKBENCH_DEV_CSS_MODULES}}');
		for (const cssModule of cssModules) {
			const cssUrl = new URL(cssModule, globalThis._VSCODE_FILE_ROOT).href;
			const jsSrc = `globalThis._VSCODE_CSS_LOAD('${cssUrl}');\n`;
			const blob = new Blob([jsSrc], { type: 'application/javascript' });
			importMap.imports[cssUrl] = URL.createObjectURL(blob);
		}
		const importMapElement = document.createElement('script');
		importMapElement.type = 'importmap';
		importMapElement.setAttribute('nonce', '1nline-m4p')
		importMapElement.textContent = JSON.stringify(importMap, undefined, 2);
		document.head.appendChild(importMapElement);
	</script>
	<script>
		performance.mark('code/willLoadWorkbenchMain');
	</script>
	<script type="module" src="{{WORKBENCH_WEB_BASE_URL}}/out/vs/code/browser/workbench/workbench.js"></script>
</html>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/code/browser/workbench/workbench.html]---
Location: vscode-main/src/vs/code/browser/workbench/workbench.html

```html
<!-- Copyright (C) Microsoft Corporation. All rights reserved. -->
<!DOCTYPE html>
<html>
	<head>
		<script>
			performance.mark('code/didStartRenderer');
		</script>
		<meta charset="utf-8" />

		<!-- Mobile tweaks -->
		<meta name="mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-title" content="Code">
		<link rel="apple-touch-icon" href="{{WORKBENCH_WEB_BASE_URL}}/resources/server/code-192.png" />

		<!-- Disable pinch zooming -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">

		<!-- Workbench Configuration -->
		<meta id="vscode-workbench-web-configuration" data-settings="{{WORKBENCH_WEB_CONFIGURATION}}">

		<!-- Workbench Auth Session -->
		<meta id="vscode-workbench-auth-session" data-settings="{{WORKBENCH_AUTH_SESSION}}">

		<!-- Workbench Icon/Manifest/CSS -->
		<link rel="icon" href="{{WORKBENCH_WEB_BASE_URL}}/resources/server/favicon.ico" type="image/x-icon" />
		<link rel="manifest" href="{{WORKBENCH_WEB_BASE_URL}}/resources/server/manifest.json" crossorigin="use-credentials" />
		<link rel="stylesheet" href="{{WORKBENCH_WEB_BASE_URL}}/out/vs/code/browser/workbench/workbench.css">

	</head>

	<body aria-label="">
	</body>

	<!-- Startup (do not modify order of script tags!) -->
	<script>
		const baseUrl = new URL('{{WORKBENCH_WEB_BASE_URL}}', window.location.origin).toString();
		globalThis._VSCODE_FILE_ROOT = baseUrl + '/out/';
	</script>
	<script>
		performance.mark('code/willLoadWorkbenchMain');
	</script>
	<!-- always ensure built in english NLS messages -->
	<script type="module" src="{{WORKBENCH_NLS_FALLBACK_URL}}"></script>
	<!-- attempt to load NLS messages in case non-english -->
	<script type="module" src="{{WORKBENCH_NLS_URL}}"></script>
	<script type="module" src="{{WORKBENCH_WEB_BASE_URL}}/out/vs/code/browser/workbench/workbench.js"></script>
</html>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/code/browser/workbench/workbench.ts]---
Location: vscode-main/src/vs/code/browser/workbench/workbench.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isStandalone } from '../../../base/browser/browser.js';
import { addDisposableListener } from '../../../base/browser/dom.js';
import { mainWindow } from '../../../base/browser/window.js';
import { VSBuffer, decodeBase64, encodeBase64 } from '../../../base/common/buffer.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { parse } from '../../../base/common/marshalling.js';
import { Schemas } from '../../../base/common/network.js';
import { posix } from '../../../base/common/path.js';
import { isEqual } from '../../../base/common/resources.js';
import { ltrim } from '../../../base/common/strings.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import product from '../../../platform/product/common/product.js';
import { ISecretStorageProvider } from '../../../platform/secrets/common/secrets.js';
import { isFolderToOpen, isWorkspaceToOpen } from '../../../platform/window/common/window.js';
import type { IWorkbenchConstructionOptions, IWorkspace, IWorkspaceProvider } from '../../../workbench/browser/web.api.js';
import { AuthenticationSessionInfo } from '../../../workbench/services/authentication/browser/authenticationService.js';
import type { IURLCallbackProvider } from '../../../workbench/services/url/browser/urlService.js';
import { create } from '../../../workbench/workbench.web.main.internal.js';

interface ISecretStorageCrypto {
	seal(data: string): Promise<string>;
	unseal(data: string): Promise<string>;
}

class TransparentCrypto implements ISecretStorageCrypto {

	async seal(data: string): Promise<string> {
		return data;
	}

	async unseal(data: string): Promise<string> {
		return data;
	}
}

const enum AESConstants {
	ALGORITHM = 'AES-GCM',
	KEY_LENGTH = 256,
	IV_LENGTH = 12,
}

class NetworkError extends Error {

	constructor(inner: Error) {
		super(inner.message);
		this.name = inner.name;
		this.stack = inner.stack;
	}
}

class ServerKeyedAESCrypto implements ISecretStorageCrypto {

	private serverKey: Uint8Array | undefined;

	/**
	 * Gets whether the algorithm is supported; requires a secure context
	 */
	static supported() {
		return !!crypto.subtle;
	}

	constructor(private readonly authEndpoint: string) { }

	async seal(data: string): Promise<string> {
		// Get a new key and IV on every change, to avoid the risk of reusing the same key and IV pair with AES-GCM
		// (see also: https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams#properties)
		const iv = mainWindow.crypto.getRandomValues(new Uint8Array(AESConstants.IV_LENGTH));
		// crypto.getRandomValues isn't a good-enough PRNG to generate crypto keys, so we need to use crypto.subtle.generateKey and export the key instead
		const clientKeyObj = await mainWindow.crypto.subtle.generateKey(
			{ name: AESConstants.ALGORITHM as const, length: AESConstants.KEY_LENGTH as const },
			true,
			['encrypt', 'decrypt']
		);

		const clientKey = new Uint8Array(await mainWindow.crypto.subtle.exportKey('raw', clientKeyObj));
		const key = await this.getKey(clientKey);
		const dataUint8Array = new TextEncoder().encode(data);
		const cipherText: ArrayBuffer = await mainWindow.crypto.subtle.encrypt(
			{ name: AESConstants.ALGORITHM as const, iv },
			key,
			dataUint8Array
		);

		// Base64 encode the result and store the ciphertext, the key, and the IV in localStorage
		// Note that the clientKey and IV don't need to be secret
		const result = new Uint8Array([...clientKey, ...iv, ...new Uint8Array(cipherText)]);
		return encodeBase64(VSBuffer.wrap(result));
	}

	async unseal(data: string): Promise<string> {
		// encrypted should contain, in order: the key (32-byte), the IV for AES-GCM (12-byte) and the ciphertext (which has the GCM auth tag at the end)
		// Minimum length must be 44 (key+IV length) + 16 bytes (1 block encrypted with AES - regardless of key size)
		const dataUint8Array = decodeBase64(data);

		if (dataUint8Array.byteLength < 60) {
			throw Error('Invalid length for the value for credentials.crypto');
		}

		const keyLength = AESConstants.KEY_LENGTH / 8;
		const clientKey = dataUint8Array.slice(0, keyLength);
		const iv = dataUint8Array.slice(keyLength, keyLength + AESConstants.IV_LENGTH);
		const cipherText = dataUint8Array.slice(keyLength + AESConstants.IV_LENGTH);

		// Do the decryption and parse the result as JSON
		const key = await this.getKey(clientKey.buffer);
		const decrypted = await mainWindow.crypto.subtle.decrypt(
			{ name: AESConstants.ALGORITHM as const, iv: iv.buffer as Uint8Array<ArrayBuffer> },
			key,
			cipherText.buffer as Uint8Array<ArrayBuffer>
		);

		return new TextDecoder().decode(new Uint8Array(decrypted));
	}

	/**
	 * Given a clientKey, returns the CryptoKey object that is used to encrypt/decrypt the data.
	 * The actual key is (clientKey XOR serverKey)
	 */
	private async getKey(clientKey: Uint8Array): Promise<CryptoKey> {
		if (!clientKey || clientKey.byteLength !== AESConstants.KEY_LENGTH / 8) {
			throw Error('Invalid length for clientKey');
		}

		const serverKey = await this.getServerKeyPart();
		const keyData = new Uint8Array(AESConstants.KEY_LENGTH / 8);

		for (let i = 0; i < keyData.byteLength; i++) {
			keyData[i] = clientKey[i] ^ serverKey[i];
		}

		return mainWindow.crypto.subtle.importKey(
			'raw',
			keyData,
			{
				name: AESConstants.ALGORITHM as const,
				length: AESConstants.KEY_LENGTH as const,
			},
			true,
			['encrypt', 'decrypt']
		);
	}

	private async getServerKeyPart(): Promise<Uint8Array> {
		if (this.serverKey) {
			return this.serverKey;
		}

		let attempt = 0;
		let lastError: Error | undefined;

		while (attempt <= 3) {
			try {
				const res = await fetch(this.authEndpoint, { credentials: 'include', method: 'POST' });
				if (!res.ok) {
					throw new Error(res.statusText);
				}

				const serverKey = new Uint8Array(await res.arrayBuffer());
				if (serverKey.byteLength !== AESConstants.KEY_LENGTH / 8) {
					throw Error(`The key retrieved by the server is not ${AESConstants.KEY_LENGTH} bit long.`);
				}

				this.serverKey = serverKey;

				return this.serverKey;
			} catch (e) {
				lastError = e instanceof Error ? e : new Error(String(e));
				attempt++;

				// exponential backoff
				await new Promise(resolve => setTimeout(resolve, attempt * attempt * 100));
			}
		}

		if (lastError) {
			throw new NetworkError(lastError);
		}

		throw new Error('Unknown error');
	}
}

export class LocalStorageSecretStorageProvider implements ISecretStorageProvider {

	private readonly storageKey = 'secrets.provider';

	private secretsPromise: Promise<Record<string, string>>;

	type: 'in-memory' | 'persisted' | 'unknown' = 'persisted';

	constructor(
		private readonly crypto: ISecretStorageCrypto,
	) {
		this.secretsPromise = this.load();
	}

	private async load(): Promise<Record<string, string>> {
		const record = this.loadAuthSessionFromElement();

		const encrypted = localStorage.getItem(this.storageKey);
		if (encrypted) {
			try {
				const decrypted = JSON.parse(await this.crypto.unseal(encrypted));

				return { ...record, ...decrypted };
			} catch (err) {
				// TODO: send telemetry
				console.error('Failed to decrypt secrets from localStorage', err);
				if (!(err instanceof NetworkError)) {
					localStorage.removeItem(this.storageKey);
				}
			}
		}

		return record;
	}

	private loadAuthSessionFromElement(): Record<string, string> {
		let authSessionInfo: (AuthenticationSessionInfo & { scopes: string[][] }) | undefined;
		// eslint-disable-next-line no-restricted-syntax
		const authSessionElement = mainWindow.document.getElementById('vscode-workbench-auth-session');
		const authSessionElementAttribute = authSessionElement ? authSessionElement.getAttribute('data-settings') : undefined;
		if (authSessionElementAttribute) {
			try {
				authSessionInfo = JSON.parse(authSessionElementAttribute);
			} catch (error) { /* Invalid session is passed. Ignore. */ }
		}

		if (!authSessionInfo) {
			return {};
		}

		const record: Record<string, string> = {};

		// Settings Sync Entry
		record[`${product.urlProtocol}.loginAccount`] = JSON.stringify(authSessionInfo);

		// Auth extension Entry
		if (authSessionInfo.providerId !== 'github') {
			console.error(`Unexpected auth provider: ${authSessionInfo.providerId}. Expected 'github'.`);
			return record;
		}

		const authAccount = JSON.stringify({ extensionId: 'vscode.github-authentication', key: 'github.auth' });
		record[authAccount] = JSON.stringify(authSessionInfo.scopes.map(scopes => ({
			id: authSessionInfo.id,
			scopes,
			accessToken: authSessionInfo.accessToken
		})));

		return record;
	}

	async get(key: string): Promise<string | undefined> {
		const secrets = await this.secretsPromise;

		return secrets[key];
	}

	async set(key: string, value: string): Promise<void> {
		const secrets = await this.secretsPromise;
		secrets[key] = value;
		this.secretsPromise = Promise.resolve(secrets);
		this.save();
	}

	async delete(key: string): Promise<void> {
		const secrets = await this.secretsPromise;
		delete secrets[key];
		this.secretsPromise = Promise.resolve(secrets);
		this.save();
	}

	async keys(): Promise<string[]> {
		const secrets = await this.secretsPromise;
		return Object.keys(secrets) || [];
	}

	private async save(): Promise<void> {
		try {
			const encrypted = await this.crypto.seal(JSON.stringify(await this.secretsPromise));
			localStorage.setItem(this.storageKey, encrypted);
		} catch (err) {
			console.error(err);
		}
	}
}

class LocalStorageURLCallbackProvider extends Disposable implements IURLCallbackProvider {

	private static REQUEST_ID = 0;

	private static QUERY_KEYS: ('scheme' | 'authority' | 'path' | 'query' | 'fragment')[] = [
		'scheme',
		'authority',
		'path',
		'query',
		'fragment'
	];

	private readonly _onCallback = this._register(new Emitter<URI>());
	readonly onCallback = this._onCallback.event;

	private pendingCallbacks = new Set<number>();
	private lastTimeChecked = Date.now();
	private checkCallbacksTimeout: Timeout | undefined = undefined;
	private onDidChangeLocalStorageDisposable: IDisposable | undefined;

	constructor(private readonly _callbackRoute: string) {
		super();
	}

	create(options: Partial<UriComponents> = {}): URI {
		const id = ++LocalStorageURLCallbackProvider.REQUEST_ID;
		const queryParams: string[] = [`vscode-reqid=${id}`];

		for (const key of LocalStorageURLCallbackProvider.QUERY_KEYS) {
			const value = options[key];

			if (value) {
				queryParams.push(`vscode-${key}=${encodeURIComponent(value)}`);
			}
		}

		// TODO@joao remove eventually
		// https://github.com/microsoft/vscode-dev/issues/62
		// https://github.com/microsoft/vscode/blob/159479eb5ae451a66b5dac3c12d564f32f454796/extensions/github-authentication/src/githubServer.ts#L50-L50
		if (!(options.authority === 'vscode.github-authentication' && options.path === '/dummy')) {
			const key = `vscode-web.url-callbacks[${id}]`;
			localStorage.removeItem(key);

			this.pendingCallbacks.add(id);
			this.startListening();
		}

		return URI.parse(mainWindow.location.href).with({ path: this._callbackRoute, query: queryParams.join('&') });
	}

	private startListening(): void {
		if (this.onDidChangeLocalStorageDisposable) {
			return;
		}

		this.onDidChangeLocalStorageDisposable = addDisposableListener(mainWindow, 'storage', () => this.onDidChangeLocalStorage());
	}

	private stopListening(): void {
		this.onDidChangeLocalStorageDisposable?.dispose();
		this.onDidChangeLocalStorageDisposable = undefined;
	}

	// this fires every time local storage changes, but we
	// don't want to check more often than once a second
	private async onDidChangeLocalStorage(): Promise<void> {
		const ellapsed = Date.now() - this.lastTimeChecked;

		if (ellapsed > 1000) {
			this.checkCallbacks();
		} else if (this.checkCallbacksTimeout === undefined) {
			this.checkCallbacksTimeout = setTimeout(() => {
				this.checkCallbacksTimeout = undefined;
				this.checkCallbacks();
			}, 1000 - ellapsed);
		}
	}

	private checkCallbacks(): void {
		let pendingCallbacks: Set<number> | undefined;

		for (const id of this.pendingCallbacks) {
			const key = `vscode-web.url-callbacks[${id}]`;
			const result = localStorage.getItem(key);

			if (result !== null) {
				try {
					this._onCallback.fire(URI.revive(JSON.parse(result)));
				} catch (error) {
					console.error(error);
				}

				pendingCallbacks = pendingCallbacks ?? new Set(this.pendingCallbacks);
				pendingCallbacks.delete(id);
				localStorage.removeItem(key);
			}
		}

		if (pendingCallbacks) {
			this.pendingCallbacks = pendingCallbacks;

			if (this.pendingCallbacks.size === 0) {
				this.stopListening();
			}
		}

		this.lastTimeChecked = Date.now();
	}
}

class WorkspaceProvider implements IWorkspaceProvider {

	private static QUERY_PARAM_EMPTY_WINDOW = 'ew';
	private static QUERY_PARAM_FOLDER = 'folder';
	private static QUERY_PARAM_WORKSPACE = 'workspace';

	private static QUERY_PARAM_PAYLOAD = 'payload';

	static create(config: IWorkbenchConstructionOptions & { folderUri?: UriComponents; workspaceUri?: UriComponents }) {
		let foundWorkspace = false;
		let workspace: IWorkspace;
		let payload = Object.create(null);

		const query = new URL(document.location.href).searchParams;
		query.forEach((value, key) => {
			switch (key) {

				// Folder
				case WorkspaceProvider.QUERY_PARAM_FOLDER:
					if (config.remoteAuthority && value.startsWith(posix.sep)) {
						// when connected to a remote and having a value
						// that is a path (begins with a `/`), assume this
						// is a vscode-remote resource as simplified URL.
						workspace = { folderUri: URI.from({ scheme: Schemas.vscodeRemote, path: value, authority: config.remoteAuthority }) };
					} else {
						workspace = { folderUri: URI.parse(value) };
					}
					foundWorkspace = true;
					break;

				// Workspace
				case WorkspaceProvider.QUERY_PARAM_WORKSPACE:
					if (config.remoteAuthority && value.startsWith(posix.sep)) {
						// when connected to a remote and having a value
						// that is a path (begins with a `/`), assume this
						// is a vscode-remote resource as simplified URL.
						workspace = { workspaceUri: URI.from({ scheme: Schemas.vscodeRemote, path: value, authority: config.remoteAuthority }) };
					} else {
						workspace = { workspaceUri: URI.parse(value) };
					}
					foundWorkspace = true;
					break;

				// Empty
				case WorkspaceProvider.QUERY_PARAM_EMPTY_WINDOW:
					workspace = undefined;
					foundWorkspace = true;
					break;

				// Payload
				case WorkspaceProvider.QUERY_PARAM_PAYLOAD:
					try {
						payload = parse(value); // use marshalling#parse() to revive potential URIs
					} catch (error) {
						console.error(error); // possible invalid JSON
					}
					break;
			}
		});

		// If no workspace is provided through the URL, check for config
		// attribute from server
		if (!foundWorkspace) {
			if (config.folderUri) {
				workspace = { folderUri: URI.revive(config.folderUri) };
			} else if (config.workspaceUri) {
				workspace = { workspaceUri: URI.revive(config.workspaceUri) };
			}
		}

		return new WorkspaceProvider(workspace, payload, config);
	}

	readonly trusted = true;

	private constructor(
		readonly workspace: IWorkspace,
		readonly payload: object,
		private readonly config: IWorkbenchConstructionOptions
	) {
	}

	async open(workspace: IWorkspace, options?: { reuse?: boolean; payload?: object }): Promise<boolean> {
		if (options?.reuse && !options.payload && this.isSame(this.workspace, workspace)) {
			return true; // return early if workspace and environment is not changing and we are reusing window
		}

		const targetHref = this.createTargetUrl(workspace, options);
		if (targetHref) {
			if (options?.reuse) {
				mainWindow.location.href = targetHref;
				return true;
			} else {
				let result;
				if (isStandalone()) {
					result = mainWindow.open(targetHref, '_blank', 'toolbar=no'); // ensures to open another 'standalone' window!
				} else {
					result = mainWindow.open(targetHref);
				}

				return !!result;
			}
		}

		return false;
	}

	private createTargetUrl(workspace: IWorkspace, options?: { reuse?: boolean; payload?: object }): string | undefined {

		// Empty
		let targetHref: string | undefined = undefined;
		if (!workspace) {
			targetHref = `${document.location.origin}${document.location.pathname}?${WorkspaceProvider.QUERY_PARAM_EMPTY_WINDOW}=true`;
		}

		// Folder
		else if (isFolderToOpen(workspace)) {
			const queryParamFolder = this.encodeWorkspacePath(workspace.folderUri);
			targetHref = `${document.location.origin}${document.location.pathname}?${WorkspaceProvider.QUERY_PARAM_FOLDER}=${queryParamFolder}`;
		}

		// Workspace
		else if (isWorkspaceToOpen(workspace)) {
			const queryParamWorkspace = this.encodeWorkspacePath(workspace.workspaceUri);
			targetHref = `${document.location.origin}${document.location.pathname}?${WorkspaceProvider.QUERY_PARAM_WORKSPACE}=${queryParamWorkspace}`;
		}

		// Append payload if any
		if (options?.payload) {
			targetHref += `&${WorkspaceProvider.QUERY_PARAM_PAYLOAD}=${encodeURIComponent(JSON.stringify(options.payload))}`;
		}

		return targetHref;
	}

	private encodeWorkspacePath(uri: URI): string {
		if (this.config.remoteAuthority && uri.scheme === Schemas.vscodeRemote) {

			// when connected to a remote and having a folder
			// or workspace for that remote, only use the path
			// as query value to form shorter, nicer URLs.
			// however, we still need to `encodeURIComponent`
			// to ensure to preserve special characters, such
			// as `+` in the path.

			return encodeURIComponent(`${posix.sep}${ltrim(uri.path, posix.sep)}`).replaceAll('%2F', '/');
		}

		return encodeURIComponent(uri.toString(true));
	}

	private isSame(workspaceA: IWorkspace, workspaceB: IWorkspace): boolean {
		if (!workspaceA || !workspaceB) {
			return workspaceA === workspaceB; // both empty
		}

		if (isFolderToOpen(workspaceA) && isFolderToOpen(workspaceB)) {
			return isEqual(workspaceA.folderUri, workspaceB.folderUri); // same workspace
		}

		if (isWorkspaceToOpen(workspaceA) && isWorkspaceToOpen(workspaceB)) {
			return isEqual(workspaceA.workspaceUri, workspaceB.workspaceUri); // same workspace
		}

		return false;
	}

	hasRemote(): boolean {
		if (this.workspace) {
			if (isFolderToOpen(this.workspace)) {
				return this.workspace.folderUri.scheme === Schemas.vscodeRemote;
			}

			if (isWorkspaceToOpen(this.workspace)) {
				return this.workspace.workspaceUri.scheme === Schemas.vscodeRemote;
			}
		}

		return true;
	}
}

function readCookie(name: string): string | undefined {
	const cookies = document.cookie.split('; ');
	for (const cookie of cookies) {
		if (cookie.startsWith(name + '=')) {
			return cookie.substring(name.length + 1);
		}
	}

	return undefined;
}

(function () {

	// Find config by checking for DOM
	// eslint-disable-next-line no-restricted-syntax
	const configElement = mainWindow.document.getElementById('vscode-workbench-web-configuration');
	const configElementAttribute = configElement ? configElement.getAttribute('data-settings') : undefined;
	if (!configElement || !configElementAttribute) {
		throw new Error('Missing web configuration element');
	}
	const config: IWorkbenchConstructionOptions & { folderUri?: UriComponents; workspaceUri?: UriComponents; callbackRoute: string } = JSON.parse(configElementAttribute);
	const secretStorageKeyPath = readCookie('vscode-secret-key-path');
	const secretStorageCrypto = secretStorageKeyPath && ServerKeyedAESCrypto.supported()
		? new ServerKeyedAESCrypto(secretStorageKeyPath) : new TransparentCrypto();

	// Create workbench
	create(mainWindow.document.body, {
		...config,
		windowIndicator: config.windowIndicator ?? { label: '$(remote)', tooltip: `${product.nameShort} Web` },
		settingsSyncOptions: config.settingsSyncOptions ? { enabled: config.settingsSyncOptions.enabled, } : undefined,
		workspaceProvider: WorkspaceProvider.create(config),
		urlCallbackProvider: new LocalStorageURLCallbackProvider(config.callbackRoute),
		secretStorageProvider: config.remoteAuthority && !secretStorageKeyPath
			? undefined /* with a remote without embedder-preferred storage, store on the remote */
			: new LocalStorageSecretStorageProvider(secretStorageCrypto),
	});
})();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/code/electron-browser/workbench/workbench-dev.html]---
Location: vscode-main/src/vs/code/electron-browser/workbench/workbench-dev.html

```html
<!-- Copyright (C) Microsoft Corporation. All rights reserved. -->
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta
			http-equiv="Content-Security-Policy"
			content="
				default-src
					'none'
				;
				img-src
					'self'
					data:
					blob:
					vscode-remote-resource:
					vscode-managed-remote-resource:
					https:
				;
				media-src
					'self'
				;
				frame-src
					'self'
					vscode-webview:
				;
				script-src
					'self'
					'unsafe-eval'
					blob:
					'nonce-0c6a828f1297'
				;
				style-src
					'self'
					'unsafe-inline'
				;
				connect-src
					'self'
					https:
					ws:
				;
				font-src
					'self'
					vscode-remote-resource:
					vscode-managed-remote-resource:
					https://*.vscode-unpkg.net
				;
				require-trusted-types-for
					'script'
				;
				trusted-types
					vscode-bootstrapImportMap
					amdLoader
					cellRendererEditorText
					collapsedCellPreview
					defaultWorkerFactory
					diffEditorWidget
					diffReview
					domLineBreaksComputer
					dompurify
					editorGhostText
					editorViewLayer
					notebookRenderer
					stickyScrollViewLayer
					tokenizeToString
					notebookChatEditController
					richScreenReaderContent
				;
		"/>
	</head>

	<body aria-label="">
	</body>

	<!-- Startup (do not modify order of script tags!) -->
	<script src="./workbench.js" type="module"></script>
</html>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/code/electron-browser/workbench/workbench.html]---
Location: vscode-main/src/vs/code/electron-browser/workbench/workbench.html

```html
<!-- Copyright (C) Microsoft Corporation. All rights reserved. -->
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta
			http-equiv="Content-Security-Policy"
			content="
				default-src
					'none'
				;
				img-src
					'self'
					data:
					blob:
					vscode-remote-resource:
					vscode-managed-remote-resource:
					https:
				;
				media-src
					'self'
				;
				frame-src
					'self'
					vscode-webview:
				;
				script-src
					'self'
					'unsafe-eval'
					blob:
				;
				style-src
					'self'
					'unsafe-inline'
				;
				connect-src
					'self'
					https:
					ws:
				;
				font-src
					'self'
					vscode-remote-resource:
					vscode-managed-remote-resource:
					https://*.vscode-unpkg.net
				;
				require-trusted-types-for
					'script'
				;
				trusted-types
					amdLoader
					cellRendererEditorText
					collapsedCellPreview
					defaultWorkerFactory
					diffEditorWidget
					diffReview
					domLineBreaksComputer
					dompurify
					editorGhostText
					editorViewLayer
					notebookRenderer
					stickyScrollViewLayer
					tokenizeToString
					notebookChatEditController
					richScreenReaderContent
				;
		"/>

		<!-- Workbench CSS -->
		<link rel="stylesheet" href="../../../workbench/workbench.desktop.main.css">
	</head>

	<body aria-label="">
	</body>

	<!-- Startup (do not modify order of script tags!) -->
	<script src="./workbench.js" type="module"></script>
</html>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/code/electron-browser/workbench/workbench.ts]---
Location: vscode-main/src/vs/code/electron-browser/workbench/workbench.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable no-restricted-globals */

(async function () {

	// Add a perf entry right from the top
	performance.mark('code/didStartRenderer');

	type ISandboxConfiguration = import('../../../base/parts/sandbox/common/sandboxTypes.js').ISandboxConfiguration;
	type ILoadResult<M, T extends ISandboxConfiguration> = import('../../../platform/window/electron-browser/window.js').ILoadResult<M, T>;
	type ILoadOptions<T extends ISandboxConfiguration> = import('../../../platform/window/electron-browser/window.js').ILoadOptions<T>;
	type INativeWindowConfiguration = import('../../../platform/window/common/window.ts').INativeWindowConfiguration;
	type IMainWindowSandboxGlobals = import('../../../base/parts/sandbox/electron-browser/globals.js').IMainWindowSandboxGlobals;
	type IDesktopMain = import('../../../workbench/electron-browser/desktop.main.js').IDesktopMain;

	const preloadGlobals = (window as unknown as { vscode: IMainWindowSandboxGlobals }).vscode; // defined by preload.ts
	const safeProcess = preloadGlobals.process;

	//#region Splash Screen Helpers

	function showSplash(configuration: INativeWindowConfiguration) {
		performance.mark('code/willShowPartsSplash');

		let data = configuration.partsSplash;
		if (data) {
			if (configuration.autoDetectHighContrast && configuration.colorScheme.highContrast) {
				if ((configuration.colorScheme.dark && data.baseTheme !== 'hc-black') || (!configuration.colorScheme.dark && data.baseTheme !== 'hc-light')) {
					data = undefined; // high contrast mode has been turned by the OS -> ignore stored colors and layouts
				}
			} else if (configuration.autoDetectColorScheme) {
				if ((configuration.colorScheme.dark && data.baseTheme !== 'vs-dark') || (!configuration.colorScheme.dark && data.baseTheme !== 'vs')) {
					data = undefined; // OS color scheme is tracked and has changed
				}
			}
		}

		// developing an extension -> ignore stored layouts
		if (data && configuration.extensionDevelopmentPath) {
			data.layoutInfo = undefined;
		}

		// minimal color configuration (works with or without persisted data)
		let baseTheme;
		let shellBackground;
		let shellForeground;
		if (data) {
			baseTheme = data.baseTheme;
			shellBackground = data.colorInfo.editorBackground;
			shellForeground = data.colorInfo.foreground;
		} else if (configuration.autoDetectHighContrast && configuration.colorScheme.highContrast) {
			if (configuration.colorScheme.dark) {
				baseTheme = 'hc-black';
				shellBackground = '#000000';
				shellForeground = '#FFFFFF';
			} else {
				baseTheme = 'hc-light';
				shellBackground = '#FFFFFF';
				shellForeground = '#000000';
			}
		} else if (configuration.autoDetectColorScheme) {
			if (configuration.colorScheme.dark) {
				baseTheme = 'vs-dark';
				shellBackground = '#1E1E1E';
				shellForeground = '#CCCCCC';
			} else {
				baseTheme = 'vs';
				shellBackground = '#FFFFFF';
				shellForeground = '#000000';
			}
		}

		const style = document.createElement('style');
		style.className = 'initialShellColors';
		window.document.head.appendChild(style);
		style.textContent = `body {	background-color: ${shellBackground}; color: ${shellForeground}; margin: 0; padding: 0; }`;

		// set zoom level as soon as possible
		if (typeof data?.zoomLevel === 'number' && typeof preloadGlobals?.webFrame?.setZoomLevel === 'function') {
			preloadGlobals.webFrame.setZoomLevel(data.zoomLevel);
		}

		// restore parts if possible (we might not always store layout info)
		if (data?.layoutInfo) {
			const { layoutInfo, colorInfo } = data;

			const splash = document.createElement('div');
			splash.id = 'monaco-parts-splash';
			splash.className = baseTheme ?? 'vs-dark';

			if (layoutInfo.windowBorder && colorInfo.windowBorder) {
				const borderElement = document.createElement('div');
				borderElement.style.position = 'absolute';
				borderElement.style.width = 'calc(100vw - 2px)';
				borderElement.style.height = 'calc(100vh - 2px)';
				borderElement.style.zIndex = '1'; // allow border above other elements
				borderElement.style.border = `1px solid var(--window-border-color)`;
				borderElement.style.setProperty('--window-border-color', colorInfo.windowBorder);

				if (layoutInfo.windowBorderRadius) {
					borderElement.style.borderRadius = layoutInfo.windowBorderRadius;
				}

				splash.appendChild(borderElement);
			}

			if (layoutInfo.auxiliaryBarWidth === Number.MAX_SAFE_INTEGER) {
				// if auxiliary bar is maximized, it goes as wide as the
				// window width but leaving room for activity bar
				layoutInfo.auxiliaryBarWidth = window.innerWidth - layoutInfo.activityBarWidth;
			} else {
				// otherwise adjust for other parts sizes if not maximized
				layoutInfo.auxiliaryBarWidth = Math.min(layoutInfo.auxiliaryBarWidth, window.innerWidth - (layoutInfo.activityBarWidth + layoutInfo.editorPartMinWidth + layoutInfo.sideBarWidth));
			}
			layoutInfo.sideBarWidth = Math.min(layoutInfo.sideBarWidth, window.innerWidth - (layoutInfo.activityBarWidth + layoutInfo.editorPartMinWidth + layoutInfo.auxiliaryBarWidth));

			// part: title
			if (layoutInfo.titleBarHeight > 0) {
				const titleDiv = document.createElement('div');
				titleDiv.style.position = 'absolute';
				titleDiv.style.width = '100%';
				titleDiv.style.height = `${layoutInfo.titleBarHeight}px`;
				titleDiv.style.left = '0';
				titleDiv.style.top = '0';
				titleDiv.style.backgroundColor = `${colorInfo.titleBarBackground}`;
				(titleDiv.style as CSSStyleDeclaration & { '-webkit-app-region': string })['-webkit-app-region'] = 'drag';
				splash.appendChild(titleDiv);

				if (colorInfo.titleBarBorder) {
					const titleBorder = document.createElement('div');
					titleBorder.style.position = 'absolute';
					titleBorder.style.width = '100%';
					titleBorder.style.height = '1px';
					titleBorder.style.left = '0';
					titleBorder.style.bottom = '0';
					titleBorder.style.borderBottom = `1px solid ${colorInfo.titleBarBorder}`;
					titleDiv.appendChild(titleBorder);
				}
			}

			// part: activity bar
			if (layoutInfo.activityBarWidth > 0) {
				const activityDiv = document.createElement('div');
				activityDiv.style.position = 'absolute';
				activityDiv.style.width = `${layoutInfo.activityBarWidth}px`;
				activityDiv.style.height = `calc(100% - ${layoutInfo.titleBarHeight + layoutInfo.statusBarHeight}px)`;
				activityDiv.style.top = `${layoutInfo.titleBarHeight}px`;
				if (layoutInfo.sideBarSide === 'left') {
					activityDiv.style.left = '0';
				} else {
					activityDiv.style.right = '0';
				}
				activityDiv.style.backgroundColor = `${colorInfo.activityBarBackground}`;
				splash.appendChild(activityDiv);

				if (colorInfo.activityBarBorder) {
					const activityBorderDiv = document.createElement('div');
					activityBorderDiv.style.position = 'absolute';
					activityBorderDiv.style.width = '1px';
					activityBorderDiv.style.height = '100%';
					activityBorderDiv.style.top = '0';
					if (layoutInfo.sideBarSide === 'left') {
						activityBorderDiv.style.right = '0';
						activityBorderDiv.style.borderRight = `1px solid ${colorInfo.activityBarBorder}`;
					} else {
						activityBorderDiv.style.left = '0';
						activityBorderDiv.style.borderLeft = `1px solid ${colorInfo.activityBarBorder}`;
					}
					activityDiv.appendChild(activityBorderDiv);
				}
			}

			// part: side bar
			if (layoutInfo.sideBarWidth > 0) {
				const sideDiv = document.createElement('div');
				sideDiv.style.position = 'absolute';
				sideDiv.style.width = `${layoutInfo.sideBarWidth}px`;
				sideDiv.style.height = `calc(100% - ${layoutInfo.titleBarHeight + layoutInfo.statusBarHeight}px)`;
				sideDiv.style.top = `${layoutInfo.titleBarHeight}px`;
				if (layoutInfo.sideBarSide === 'left') {
					sideDiv.style.left = `${layoutInfo.activityBarWidth}px`;
				} else {
					sideDiv.style.right = `${layoutInfo.activityBarWidth}px`;
				}
				sideDiv.style.backgroundColor = `${colorInfo.sideBarBackground}`;
				splash.appendChild(sideDiv);

				if (colorInfo.sideBarBorder) {
					const sideBorderDiv = document.createElement('div');
					sideBorderDiv.style.position = 'absolute';
					sideBorderDiv.style.width = '1px';
					sideBorderDiv.style.height = '100%';
					sideBorderDiv.style.top = '0';
					sideBorderDiv.style.right = '0';
					if (layoutInfo.sideBarSide === 'left') {
						sideBorderDiv.style.borderRight = `1px solid ${colorInfo.sideBarBorder}`;
					} else {
						sideBorderDiv.style.left = '0';
						sideBorderDiv.style.borderLeft = `1px solid ${colorInfo.sideBarBorder}`;
					}
					sideDiv.appendChild(sideBorderDiv);
				}
			}

			// part: auxiliary sidebar
			if (layoutInfo.auxiliaryBarWidth > 0) {
				const auxSideDiv = document.createElement('div');
				auxSideDiv.style.position = 'absolute';
				auxSideDiv.style.width = `${layoutInfo.auxiliaryBarWidth}px`;
				auxSideDiv.style.height = `calc(100% - ${layoutInfo.titleBarHeight + layoutInfo.statusBarHeight}px)`;
				auxSideDiv.style.top = `${layoutInfo.titleBarHeight}px`;
				if (layoutInfo.sideBarSide === 'left') {
					auxSideDiv.style.right = '0';
				} else {
					auxSideDiv.style.left = '0';
				}
				auxSideDiv.style.backgroundColor = `${colorInfo.sideBarBackground}`;
				splash.appendChild(auxSideDiv);

				if (colorInfo.sideBarBorder) {
					const auxSideBorderDiv = document.createElement('div');
					auxSideBorderDiv.style.position = 'absolute';
					auxSideBorderDiv.style.width = '1px';
					auxSideBorderDiv.style.height = '100%';
					auxSideBorderDiv.style.top = '0';
					if (layoutInfo.sideBarSide === 'left') {
						auxSideBorderDiv.style.left = '0';
						auxSideBorderDiv.style.borderLeft = `1px solid ${colorInfo.sideBarBorder}`;
					} else {
						auxSideBorderDiv.style.right = '0';
						auxSideBorderDiv.style.borderRight = `1px solid ${colorInfo.sideBarBorder}`;
					}
					auxSideDiv.appendChild(auxSideBorderDiv);
				}
			}

			// part: statusbar
			if (layoutInfo.statusBarHeight > 0) {
				const statusDiv = document.createElement('div');
				statusDiv.style.position = 'absolute';
				statusDiv.style.width = '100%';
				statusDiv.style.height = `${layoutInfo.statusBarHeight}px`;
				statusDiv.style.bottom = '0';
				statusDiv.style.left = '0';
				if (configuration.workspace && colorInfo.statusBarBackground) {
					statusDiv.style.backgroundColor = colorInfo.statusBarBackground;
				} else if (!configuration.workspace && colorInfo.statusBarNoFolderBackground) {
					statusDiv.style.backgroundColor = colorInfo.statusBarNoFolderBackground;
				}
				splash.appendChild(statusDiv);

				if (colorInfo.statusBarBorder) {
					const statusBorderDiv = document.createElement('div');
					statusBorderDiv.style.position = 'absolute';
					statusBorderDiv.style.width = '100%';
					statusBorderDiv.style.height = '1px';
					statusBorderDiv.style.top = '0';
					statusBorderDiv.style.borderTop = `1px solid ${colorInfo.statusBarBorder}`;
					statusDiv.appendChild(statusBorderDiv);
				}
			}

			window.document.body.appendChild(splash);
		}

		performance.mark('code/didShowPartsSplash');
	}

	//#endregion

	//#region Window Helpers

	async function load<M, T extends ISandboxConfiguration>(options: ILoadOptions<T>): Promise<ILoadResult<M, T>> {

		// Window Configuration from Preload Script
		const configuration = await resolveWindowConfiguration<T>();

		// Signal before import()
		options?.beforeImport?.(configuration);

		// Developer settings
		const { enableDeveloperKeybindings, removeDeveloperKeybindingsAfterLoad, developerDeveloperKeybindingsDisposable, forceDisableShowDevtoolsOnError } = setupDeveloperKeybindings(configuration, options);

		// NLS
		setupNLS<T>(configuration);

		// Compute base URL and set as global
		const baseUrl = new URL(`${fileUriFromPath(configuration.appRoot, { isWindows: safeProcess.platform === 'win32', scheme: 'vscode-file', fallbackAuthority: 'vscode-app' })}/out/`);
		globalThis._VSCODE_FILE_ROOT = baseUrl.toString();

		// Dev only: CSS import map tricks
		setupCSSImportMaps<T>(configuration, baseUrl);

		// ESM Import
		try {
			let workbenchUrl: string;
			if (!!safeProcess.env['VSCODE_DEV'] && globalThis._VSCODE_USE_RELATIVE_IMPORTS) {
				workbenchUrl = '../../../workbench/workbench.desktop.main.js'; // for dev purposes only
			} else {
				workbenchUrl = new URL(`vs/workbench/workbench.desktop.main.js`, baseUrl).href;
			}

			const result = await import(workbenchUrl);
			if (developerDeveloperKeybindingsDisposable && removeDeveloperKeybindingsAfterLoad) {
				developerDeveloperKeybindingsDisposable();
			}

			return { result, configuration };
		} catch (error) {
			onUnexpectedError(error, enableDeveloperKeybindings && !forceDisableShowDevtoolsOnError);

			throw error;
		}
	}

	async function resolveWindowConfiguration<T extends ISandboxConfiguration>() {
		const timeout = setTimeout(() => { console.error(`[resolve window config] Could not resolve window configuration within 10 seconds, but will continue to wait...`); }, 10000);
		performance.mark('code/willWaitForWindowConfig');

		const configuration = await preloadGlobals.context.resolveConfiguration() as T;
		performance.mark('code/didWaitForWindowConfig');

		clearTimeout(timeout);

		return configuration;
	}

	function setupDeveloperKeybindings<T extends ISandboxConfiguration>(configuration: T, options: ILoadOptions<T>) {
		const {
			forceEnableDeveloperKeybindings,
			disallowReloadKeybinding,
			removeDeveloperKeybindingsAfterLoad,
			forceDisableShowDevtoolsOnError
		} = typeof options?.configureDeveloperSettings === 'function' ? options.configureDeveloperSettings(configuration) : {
			forceEnableDeveloperKeybindings: false,
			disallowReloadKeybinding: false,
			removeDeveloperKeybindingsAfterLoad: false,
			forceDisableShowDevtoolsOnError: false
		};

		const isDev = !!safeProcess.env['VSCODE_DEV'];
		const enableDeveloperKeybindings = Boolean(isDev || forceEnableDeveloperKeybindings);
		let developerDeveloperKeybindingsDisposable: Function | undefined = undefined;
		if (enableDeveloperKeybindings) {
			developerDeveloperKeybindingsDisposable = registerDeveloperKeybindings(disallowReloadKeybinding);
		}

		return {
			enableDeveloperKeybindings,
			removeDeveloperKeybindingsAfterLoad,
			developerDeveloperKeybindingsDisposable,
			forceDisableShowDevtoolsOnError
		};
	}

	function registerDeveloperKeybindings(disallowReloadKeybinding: boolean | undefined): Function {
		const ipcRenderer = preloadGlobals.ipcRenderer;

		const extractKey =
			function (e: KeyboardEvent) {
				return [
					e.ctrlKey ? 'ctrl-' : '',
					e.metaKey ? 'meta-' : '',
					e.altKey ? 'alt-' : '',
					e.shiftKey ? 'shift-' : '',
					e.keyCode
				].join('');
			};

		// Devtools & reload support
		const TOGGLE_DEV_TOOLS_KB = (safeProcess.platform === 'darwin' ? 'meta-alt-73' : 'ctrl-shift-73'); // mac: Cmd-Alt-I, rest: Ctrl-Shift-I
		const TOGGLE_DEV_TOOLS_KB_ALT = '123'; // F12
		const RELOAD_KB = (safeProcess.platform === 'darwin' ? 'meta-82' : 'ctrl-82'); // mac: Cmd-R, rest: Ctrl-R

		let listener: ((e: KeyboardEvent) => void) | undefined = function (e) {
			const key = extractKey(e);
			if (key === TOGGLE_DEV_TOOLS_KB || key === TOGGLE_DEV_TOOLS_KB_ALT) {
				ipcRenderer.send('vscode:toggleDevTools');
			} else if (key === RELOAD_KB && !disallowReloadKeybinding) {
				ipcRenderer.send('vscode:reloadWindow');
			}
		};

		window.addEventListener('keydown', listener);

		return function () {
			if (listener) {
				window.removeEventListener('keydown', listener);
				listener = undefined;
			}
		};
	}

	function setupNLS<T extends ISandboxConfiguration>(configuration: T): void {
		globalThis._VSCODE_NLS_MESSAGES = configuration.nls.messages;
		globalThis._VSCODE_NLS_LANGUAGE = configuration.nls.language;

		let language = configuration.nls.language || 'en';
		if (language === 'zh-tw') {
			language = 'zh-Hant';
		} else if (language === 'zh-cn') {
			language = 'zh-Hans';
		}

		window.document.documentElement.setAttribute('lang', language);
	}

	function onUnexpectedError(error: string | Error, showDevtoolsOnError: boolean): void {
		if (showDevtoolsOnError) {
			const ipcRenderer = preloadGlobals.ipcRenderer;
			ipcRenderer.send('vscode:openDevTools');
		}

		console.error(`[uncaught exception]: ${error}`);

		if (error && typeof error !== 'string' && error.stack) {
			console.error(error.stack);
		}
	}

	function fileUriFromPath(path: string, config: { isWindows?: boolean; scheme?: string; fallbackAuthority?: string }): string {

		// Since we are building a URI, we normalize any backslash
		// to slashes and we ensure that the path begins with a '/'.
		let pathName = path.replace(/\\/g, '/');
		if (pathName.length > 0 && pathName.charAt(0) !== '/') {
			pathName = `/${pathName}`;
		}

		let uri: string;

		// Windows: in order to support UNC paths (which start with '//')
		// that have their own authority, we do not use the provided authority
		// but rather preserve it.
		if (config.isWindows && pathName.startsWith('//')) {
			uri = encodeURI(`${config.scheme || 'file'}:${pathName}`);
		}

		// Otherwise we optionally add the provided authority if specified
		else {
			uri = encodeURI(`${config.scheme || 'file'}://${config.fallbackAuthority || ''}${pathName}`);
		}

		return uri.replace(/#/g, '%23');
	}

	function setupCSSImportMaps<T extends ISandboxConfiguration>(configuration: T, baseUrl: URL) {

		// DEV ---------------------------------------------------------------------------------------
		// DEV: This is for development and enables loading CSS via import-statements via import-maps.
		// DEV: For each CSS modules that we have we defined an entry in the import map that maps to
		// DEV: a blob URL that loads the CSS via a dynamic @import-rule.
		// DEV ---------------------------------------------------------------------------------------

		if (globalThis._VSCODE_DISABLE_CSS_IMPORT_MAP) {
			return; // disabled in certain development setups
		}

		if (Array.isArray(configuration.cssModules) && configuration.cssModules.length > 0) {
			performance.mark('code/willAddCssLoader');

			globalThis._VSCODE_CSS_LOAD = function (url) {
				const link = document.createElement('link');
				link.setAttribute('rel', 'stylesheet');
				link.setAttribute('type', 'text/css');
				link.setAttribute('href', url);

				window.document.head.appendChild(link);
			};

			const importMap: { imports: Record<string, string> } = { imports: {} };
			for (const cssModule of configuration.cssModules) {
				const cssUrl = new URL(cssModule, baseUrl).href;
				const jsSrc = `globalThis._VSCODE_CSS_LOAD('${cssUrl}');\n`;
				const blob = new Blob([jsSrc], { type: 'application/javascript' });
				importMap.imports[cssUrl] = URL.createObjectURL(blob);
			}

			const ttp = window.trustedTypes?.createPolicy('vscode-bootstrapImportMap', { createScript(value) { return value; }, });
			const importMapSrc = JSON.stringify(importMap, undefined, 2);
			const importMapScript = document.createElement('script');
			importMapScript.type = 'importmap';
			importMapScript.setAttribute('nonce', '0c6a828f1297');
			// @ts-expect-error
			importMapScript.textContent = ttp?.createScript(importMapSrc) ?? importMapSrc;
			window.document.head.appendChild(importMapScript);

			performance.mark('code/didAddCssLoader');
		}
	}

	//#endregion

	const { result, configuration } = await load<IDesktopMain, INativeWindowConfiguration>(
		{
			configureDeveloperSettings: function (windowConfig) {
				return {
					// disable automated devtools opening on error when running extension tests
					// as this can lead to nondeterministic test execution (devtools steals focus)
					forceDisableShowDevtoolsOnError: typeof windowConfig.extensionTestsPath === 'string' || windowConfig['enable-smoke-test-driver'] === true,
					// enable devtools keybindings in extension development window
					forceEnableDeveloperKeybindings: Array.isArray(windowConfig.extensionDevelopmentPath) && windowConfig.extensionDevelopmentPath.length > 0,
					removeDeveloperKeybindingsAfterLoad: true
				};
			},
			beforeImport: function (windowConfig) {

				// Show our splash as early as possible
				showSplash(windowConfig);

				// Code windows have a `vscodeWindowId` property to identify them
				Object.defineProperty(window, 'vscodeWindowId', {
					get: () => windowConfig.windowId
				});

				// It looks like browsers only lazily enable
				// the <canvas> element when needed. Since we
				// leverage canvas elements in our code in many
				// locations, we try to help the browser to
				// initialize canvas when it is idle, right
				// before we wait for the scripts to be loaded.
				window.requestIdleCallback(() => {
					const canvas = document.createElement('canvas');
					const context = canvas.getContext('2d');
					context?.clearRect(0, 0, canvas.width, canvas.height);
					canvas.remove();
				}, { timeout: 50 });

				// Track import() perf
				performance.mark('code/willLoadWorkbenchMain');
			}
		}
	);

	// Mark start of workbench
	performance.mark('code/didLoadWorkbenchMain');

	// Load workbench
	result.main(configuration);
}());
```

--------------------------------------------------------------------------------

---[FILE: src/vs/code/electron-main/app.ts]---
Location: vscode-main/src/vs/code/electron-main/app.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { app, protocol, session, Session, systemPreferences, WebFrameMain } from 'electron';
import { addUNCHostToAllowlist, disableUNCAccessRestrictions } from '../../base/node/unc.js';
import { validatedIpcMain } from '../../base/parts/ipc/electron-main/ipcMain.js';
import { hostname, release } from 'os';
import { VSBuffer } from '../../base/common/buffer.js';
import { toErrorMessage } from '../../base/common/errorMessage.js';
import { Event } from '../../base/common/event.js';
import { parse } from '../../base/common/jsonc.js';
import { getPathLabel } from '../../base/common/labels.js';
import { Disposable, DisposableStore } from '../../base/common/lifecycle.js';
import { Schemas, VSCODE_AUTHORITY } from '../../base/common/network.js';
import { join, posix } from '../../base/common/path.js';
import { IProcessEnvironment, isLinux, isLinuxSnap, isMacintosh, isWindows, OS } from '../../base/common/platform.js';
import { assertType } from '../../base/common/types.js';
import { URI } from '../../base/common/uri.js';
import { generateUuid } from '../../base/common/uuid.js';
import { registerContextMenuListener } from '../../base/parts/contextmenu/electron-main/contextmenu.js';
import { getDelayedChannel, ProxyChannel, StaticRouter } from '../../base/parts/ipc/common/ipc.js';
import { Server as ElectronIPCServer } from '../../base/parts/ipc/electron-main/ipc.electron.js';
import { Client as MessagePortClient } from '../../base/parts/ipc/electron-main/ipc.mp.js';
import { Server as NodeIPCServer } from '../../base/parts/ipc/node/ipc.net.js';
import { IProxyAuthService, ProxyAuthService } from '../../platform/native/electron-main/auth.js';
import { localize } from '../../nls.js';
import { IBackupMainService } from '../../platform/backup/electron-main/backup.js';
import { BackupMainService } from '../../platform/backup/electron-main/backupMainService.js';
import { IConfigurationService } from '../../platform/configuration/common/configuration.js';
import { ElectronExtensionHostDebugBroadcastChannel } from '../../platform/debug/electron-main/extensionHostDebugIpc.js';
import { IDiagnosticsService } from '../../platform/diagnostics/common/diagnostics.js';
import { DiagnosticsMainService, IDiagnosticsMainService } from '../../platform/diagnostics/electron-main/diagnosticsMainService.js';
import { DialogMainService, IDialogMainService } from '../../platform/dialogs/electron-main/dialogMainService.js';
import { IEncryptionMainService } from '../../platform/encryption/common/encryptionService.js';
import { EncryptionMainService } from '../../platform/encryption/electron-main/encryptionMainService.js';
import { NativeBrowserElementsMainService, INativeBrowserElementsMainService } from '../../platform/browserElements/electron-main/nativeBrowserElementsMainService.js';
import { NativeParsedArgs } from '../../platform/environment/common/argv.js';
import { IEnvironmentMainService } from '../../platform/environment/electron-main/environmentMainService.js';
import { isLaunchedFromCli } from '../../platform/environment/node/argvHelper.js';
import { getResolvedShellEnv } from '../../platform/shell/node/shellEnv.js';
import { IExtensionHostStarter, ipcExtensionHostStarterChannelName } from '../../platform/extensions/common/extensionHostStarter.js';
import { ExtensionHostStarter } from '../../platform/extensions/electron-main/extensionHostStarter.js';
import { IExternalTerminalMainService } from '../../platform/externalTerminal/electron-main/externalTerminal.js';
import { LinuxExternalTerminalService, MacExternalTerminalService, WindowsExternalTerminalService } from '../../platform/externalTerminal/node/externalTerminalService.js';
import { LOCAL_FILE_SYSTEM_CHANNEL_NAME } from '../../platform/files/common/diskFileSystemProviderClient.js';
import { IFileService } from '../../platform/files/common/files.js';
import { DiskFileSystemProviderChannel } from '../../platform/files/electron-main/diskFileSystemProviderServer.js';
import { DiskFileSystemProvider } from '../../platform/files/node/diskFileSystemProvider.js';
import { SyncDescriptor } from '../../platform/instantiation/common/descriptors.js';
import { IInstantiationService, ServicesAccessor } from '../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../platform/instantiation/common/serviceCollection.js';
import { ProcessMainService } from '../../platform/process/electron-main/processMainService.js';
import { IKeyboardLayoutMainService, KeyboardLayoutMainService } from '../../platform/keyboardLayout/electron-main/keyboardLayoutMainService.js';
import { ILaunchMainService, LaunchMainService } from '../../platform/launch/electron-main/launchMainService.js';
import { ILifecycleMainService, LifecycleMainPhase, ShutdownReason } from '../../platform/lifecycle/electron-main/lifecycleMainService.js';
import { ILoggerService, ILogService } from '../../platform/log/common/log.js';
import { IMenubarMainService, MenubarMainService } from '../../platform/menubar/electron-main/menubarMainService.js';
import { INativeHostMainService, NativeHostMainService } from '../../platform/native/electron-main/nativeHostMainService.js';
import { IProductService } from '../../platform/product/common/productService.js';
import { getRemoteAuthority } from '../../platform/remote/common/remoteHosts.js';
import { SharedProcess } from '../../platform/sharedProcess/electron-main/sharedProcess.js';
import { ISignService } from '../../platform/sign/common/sign.js';
import { IStateService } from '../../platform/state/node/state.js';
import { StorageDatabaseChannel } from '../../platform/storage/electron-main/storageIpc.js';
import { ApplicationStorageMainService, IApplicationStorageMainService, IStorageMainService, StorageMainService } from '../../platform/storage/electron-main/storageMainService.js';
import { resolveCommonProperties } from '../../platform/telemetry/common/commonProperties.js';
import { ITelemetryService, TelemetryLevel } from '../../platform/telemetry/common/telemetry.js';
import { TelemetryAppenderClient } from '../../platform/telemetry/common/telemetryIpc.js';
import { ITelemetryServiceConfig, TelemetryService } from '../../platform/telemetry/common/telemetryService.js';
import { getPiiPathsFromEnvironment, getTelemetryLevel, isInternalTelemetry, NullTelemetryService, supportsTelemetry } from '../../platform/telemetry/common/telemetryUtils.js';
import { IUpdateService } from '../../platform/update/common/update.js';
import { UpdateChannel } from '../../platform/update/common/updateIpc.js';
import { DarwinUpdateService } from '../../platform/update/electron-main/updateService.darwin.js';
import { LinuxUpdateService } from '../../platform/update/electron-main/updateService.linux.js';
import { SnapUpdateService } from '../../platform/update/electron-main/updateService.snap.js';
import { Win32UpdateService } from '../../platform/update/electron-main/updateService.win32.js';
import { IOpenURLOptions, IURLService } from '../../platform/url/common/url.js';
import { URLHandlerChannelClient, URLHandlerRouter } from '../../platform/url/common/urlIpc.js';
import { NativeURLService } from '../../platform/url/common/urlService.js';
import { ElectronURLListener } from '../../platform/url/electron-main/electronUrlListener.js';
import { IWebviewManagerService } from '../../platform/webview/common/webviewManagerService.js';
import { WebviewMainService } from '../../platform/webview/electron-main/webviewMainService.js';
import { isFolderToOpen, isWorkspaceToOpen, IWindowOpenable } from '../../platform/window/common/window.js';
import { getAllWindowsExcludingOffscreen, IWindowsMainService, OpenContext } from '../../platform/windows/electron-main/windows.js';
import { ICodeWindow } from '../../platform/window/electron-main/window.js';
import { WindowsMainService } from '../../platform/windows/electron-main/windowsMainService.js';
import { ActiveWindowManager } from '../../platform/windows/node/windowTracker.js';
import { hasWorkspaceFileExtension } from '../../platform/workspace/common/workspace.js';
import { IWorkspacesService } from '../../platform/workspaces/common/workspaces.js';
import { IWorkspacesHistoryMainService, WorkspacesHistoryMainService } from '../../platform/workspaces/electron-main/workspacesHistoryMainService.js';
import { WorkspacesMainService } from '../../platform/workspaces/electron-main/workspacesMainService.js';
import { IWorkspacesManagementMainService, WorkspacesManagementMainService } from '../../platform/workspaces/electron-main/workspacesManagementMainService.js';
import { IPolicyService } from '../../platform/policy/common/policy.js';
import { PolicyChannel } from '../../platform/policy/common/policyIpc.js';
import { IUserDataProfilesMainService } from '../../platform/userDataProfile/electron-main/userDataProfile.js';
import { IExtensionsProfileScannerService } from '../../platform/extensionManagement/common/extensionsProfileScannerService.js';
import { IExtensionsScannerService } from '../../platform/extensionManagement/common/extensionsScannerService.js';
import { ExtensionsScannerService } from '../../platform/extensionManagement/node/extensionsScannerService.js';
import { UserDataProfilesHandler } from '../../platform/userDataProfile/electron-main/userDataProfilesHandler.js';
import { ProfileStorageChangesListenerChannel } from '../../platform/userDataProfile/electron-main/userDataProfileStorageIpc.js';
import { Promises, RunOnceScheduler, runWhenGlobalIdle } from '../../base/common/async.js';
import { resolveMachineId, resolveSqmId, resolveDevDeviceId, validateDevDeviceId } from '../../platform/telemetry/electron-main/telemetryUtils.js';
import { ExtensionsProfileScannerService } from '../../platform/extensionManagement/node/extensionsProfileScannerService.js';
import { LoggerChannel } from '../../platform/log/electron-main/logIpc.js';
import { ILoggerMainService } from '../../platform/log/electron-main/loggerService.js';
import { IInitialProtocolUrls, IProtocolUrl } from '../../platform/url/electron-main/url.js';
import { IUtilityProcessWorkerMainService, UtilityProcessWorkerMainService } from '../../platform/utilityProcess/electron-main/utilityProcessWorkerMainService.js';
import { ipcUtilityProcessWorkerChannelName } from '../../platform/utilityProcess/common/utilityProcessWorkerService.js';
import { ILocalPtyService, LocalReconnectConstants, TerminalIpcChannels, TerminalSettingId } from '../../platform/terminal/common/terminal.js';
import { ElectronPtyHostStarter } from '../../platform/terminal/electron-main/electronPtyHostStarter.js';
import { PtyHostService } from '../../platform/terminal/node/ptyHostService.js';
import { NODE_REMOTE_RESOURCE_CHANNEL_NAME, NODE_REMOTE_RESOURCE_IPC_METHOD_NAME, NodeRemoteResourceResponse, NodeRemoteResourceRouter } from '../../platform/remote/common/electronRemoteResources.js';
import { Lazy } from '../../base/common/lazy.js';
import { IAuxiliaryWindowsMainService } from '../../platform/auxiliaryWindow/electron-main/auxiliaryWindows.js';
import { AuxiliaryWindowsMainService } from '../../platform/auxiliaryWindow/electron-main/auxiliaryWindowsMainService.js';
import { normalizeNFC } from '../../base/common/normalization.js';
import { ICSSDevelopmentService, CSSDevelopmentService } from '../../platform/cssDev/node/cssDevService.js';
import { INativeMcpDiscoveryHelperService, NativeMcpDiscoveryHelperChannelName } from '../../platform/mcp/common/nativeMcpDiscoveryHelper.js';
import { NativeMcpDiscoveryHelperService } from '../../platform/mcp/node/nativeMcpDiscoveryHelperService.js';
import { IWebContentExtractorService } from '../../platform/webContentExtractor/common/webContentExtractor.js';
import { NativeWebContentExtractorService } from '../../platform/webContentExtractor/electron-main/webContentExtractorService.js';
import ErrorTelemetry from '../../platform/telemetry/electron-main/errorTelemetry.js';

/**
 * The main VS Code application. There will only ever be one instance,
 * even if the user starts many instances (e.g. from the command line).
 */
export class CodeApplication extends Disposable {

	private static readonly SECURITY_PROTOCOL_HANDLING_CONFIRMATION_SETTING_KEY = {
		[Schemas.file]: 'security.promptForLocalFileProtocolHandling' as const,
		[Schemas.vscodeRemote]: 'security.promptForRemoteFileProtocolHandling' as const
	};

	private windowsMainService: IWindowsMainService | undefined;
	private auxiliaryWindowsMainService: IAuxiliaryWindowsMainService | undefined;
	private nativeHostMainService: INativeHostMainService | undefined;

	constructor(
		private readonly mainProcessNodeIpcServer: NodeIPCServer,
		private readonly userEnv: IProcessEnvironment,
		@IInstantiationService private readonly mainInstantiationService: IInstantiationService,
		@ILogService private readonly logService: ILogService,
		@ILoggerService private readonly loggerService: ILoggerService,
		@IEnvironmentMainService private readonly environmentMainService: IEnvironmentMainService,
		@ILifecycleMainService private readonly lifecycleMainService: ILifecycleMainService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IStateService private readonly stateService: IStateService,
		@IFileService private readonly fileService: IFileService,
		@IProductService private readonly productService: IProductService,
		@IUserDataProfilesMainService private readonly userDataProfilesMainService: IUserDataProfilesMainService
	) {
		super();

		this.configureSession();
		this.registerListeners();
	}

	private configureSession(): void {

		//#region Security related measures (https://electronjs.org/docs/tutorial/security)
		//
		// !!! DO NOT CHANGE without consulting the documentation !!!
		//

		const isUrlFromWindow = (requestingUrl?: string | undefined) => requestingUrl?.startsWith(`${Schemas.vscodeFileResource}://${VSCODE_AUTHORITY}`);
		const isUrlFromWebview = (requestingUrl: string | undefined) => requestingUrl?.startsWith(`${Schemas.vscodeWebview}://`);

		const alwaysAllowedPermissions = new Set(['pointerLock', 'notifications']);

		const allowedPermissionsInWebview = new Set([
			...alwaysAllowedPermissions,
			'clipboard-read',
			'clipboard-sanitized-write',
			// TODO(deepak1556): Should be removed once migration is complete
			// https://github.com/microsoft/vscode/issues/239228
			'deprecated-sync-clipboard-read',
		]);

		const allowedPermissionsInCore = new Set([
			...alwaysAllowedPermissions,
			'media',
			'local-fonts',
			// TODO(deepak1556): Should be removed once migration is complete
			// https://github.com/microsoft/vscode/issues/239228
			'deprecated-sync-clipboard-read',
		]);

		session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback, details) => {
			if (isUrlFromWebview(details.requestingUrl)) {
				return callback(allowedPermissionsInWebview.has(permission));
			}
			if (isUrlFromWindow(details.requestingUrl)) {
				return callback(allowedPermissionsInCore.has(permission));
			}
			return callback(false);
		});

		session.defaultSession.setPermissionCheckHandler((_webContents, permission, _origin, details) => {
			if (isUrlFromWebview(details.requestingUrl)) {
				return allowedPermissionsInWebview.has(permission);
			}
			if (isUrlFromWindow(details.requestingUrl)) {
				return allowedPermissionsInCore.has(permission);
			}
			return false;
		});

		//#endregion

		//#region Request filtering

		// Block all SVG requests from unsupported origins
		const supportedSvgSchemes = new Set([Schemas.file, Schemas.vscodeFileResource, Schemas.vscodeRemoteResource, Schemas.vscodeManagedRemoteResource, 'devtools']);

		// But allow them if they are made from inside an webview
		const isSafeFrame = (requestFrame: WebFrameMain | null | undefined): boolean => {
			for (let frame: WebFrameMain | null | undefined = requestFrame; frame; frame = frame.parent) {
				if (frame.url.startsWith(`${Schemas.vscodeWebview}://`)) {
					return true;
				}
			}
			return false;
		};

		const isSvgRequestFromSafeContext = (details: Electron.OnBeforeRequestListenerDetails | Electron.OnHeadersReceivedListenerDetails): boolean => {
			return details.resourceType === 'xhr' || isSafeFrame(details.frame);
		};

		const isAllowedVsCodeFileRequest = (details: Electron.OnBeforeRequestListenerDetails) => {
			const frame = details.frame;
			if (!frame || !this.windowsMainService) {
				return false;
			}

			// Check to see if the request comes from one of the main windows (or shared process) and not from embedded content
			const windows = getAllWindowsExcludingOffscreen();
			for (const window of windows) {
				if (frame.processId === window.webContents.mainFrame.processId) {
					return true;
				}
			}

			return false;
		};

		const isAllowedWebviewRequest = (uri: URI, details: Electron.OnBeforeRequestListenerDetails): boolean => {
			if (uri.path !== '/index.html') {
				return true; // Only restrict top level page of webviews: index.html
			}

			const frame = details.frame;
			if (!frame || !this.windowsMainService) {
				return false;
			}

			// Check to see if the request comes from one of the main editor windows.
			for (const window of this.windowsMainService.getWindows()) {
				if (window.win) {
					if (frame.processId === window.win.webContents.mainFrame.processId) {
						return true;
					}
				}
			}

			return false;
		};

		session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
			const uri = URI.parse(details.url);
			if (uri.scheme === Schemas.vscodeWebview) {
				if (!isAllowedWebviewRequest(uri, details)) {
					this.logService.error('Blocked vscode-webview request', details.url);
					return callback({ cancel: true });
				}
			}

			if (uri.scheme === Schemas.vscodeFileResource) {
				if (!isAllowedVsCodeFileRequest(details)) {
					this.logService.error('Blocked vscode-file request', details.url);
					return callback({ cancel: true });
				}
			}

			// Block most svgs
			if (uri.path.endsWith('.svg')) {
				const isSafeResourceUrl = supportedSvgSchemes.has(uri.scheme);
				if (!isSafeResourceUrl) {
					return callback({ cancel: !isSvgRequestFromSafeContext(details) });
				}
			}

			return callback({ cancel: false });
		});

		// Configure SVG header content type properly
		// https://github.com/microsoft/vscode/issues/97564
		session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
			const responseHeaders = details.responseHeaders as Record<string, (string) | (string[])>;
			const contentTypes = (responseHeaders['content-type'] || responseHeaders['Content-Type']);

			if (contentTypes && Array.isArray(contentTypes)) {
				const uri = URI.parse(details.url);
				if (uri.path.endsWith('.svg')) {
					if (supportedSvgSchemes.has(uri.scheme)) {
						responseHeaders['Content-Type'] = ['image/svg+xml'];

						return callback({ cancel: false, responseHeaders });
					}
				}

				// remote extension schemes have the following format
				// http://127.0.0.1:<port>/vscode-remote-resource?path=
				if (!uri.path.endsWith(Schemas.vscodeRemoteResource) && contentTypes.some(contentType => contentType.toLowerCase().includes('image/svg'))) {
					return callback({ cancel: !isSvgRequestFromSafeContext(details) });
				}
			}

			return callback({ cancel: false });
		});

		//#endregion

		//#region Allow CORS for the PRSS CDN

		// https://github.com/microsoft/vscode-remote-release/issues/9246
		session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
			if (details.url.startsWith('https://vscode.download.prss.microsoft.com/')) {
				const responseHeaders = details.responseHeaders ?? Object.create(null);

				if (responseHeaders['Access-Control-Allow-Origin'] === undefined) {
					responseHeaders['Access-Control-Allow-Origin'] = ['*'];
					return callback({ cancel: false, responseHeaders });
				}
			}

			return callback({ cancel: false });
		});

		//#endregion

		//#region Code Cache

		type SessionWithCodeCachePathSupport = Session & {
			/**
			 * Sets code cache directory. By default, the directory will be `Code Cache` under
			 * the respective user data folder.
			 */
			setCodeCachePath?(path: string): void;
		};

		const defaultSession = session.defaultSession as unknown as SessionWithCodeCachePathSupport;
		if (typeof defaultSession.setCodeCachePath === 'function' && this.environmentMainService.codeCachePath) {
			// Make sure to partition Chrome's code cache folder
			// in the same way as our code cache path to help
			// invalidate caches that we know are invalid
			// (https://github.com/microsoft/vscode/issues/120655)
			defaultSession.setCodeCachePath(join(this.environmentMainService.codeCachePath, 'chrome'));
		}

		//#endregion

		//#region UNC Host Allowlist (Windows)

		if (isWindows) {
			if (this.configurationService.getValue('security.restrictUNCAccess') === false) {
				disableUNCAccessRestrictions();
			} else {
				addUNCHostToAllowlist(this.configurationService.getValue('security.allowedUNCHosts'));
			}
		}

		//#endregion
	}

	private registerListeners(): void {

		// Dispose on shutdown
		Event.once(this.lifecycleMainService.onWillShutdown)(() => this.dispose());

		// Contextmenu via IPC support
		registerContextMenuListener();

		// Accessibility change event
		app.on('accessibility-support-changed', (event, accessibilitySupportEnabled) => {
			this.windowsMainService?.sendToAll('vscode:accessibilitySupportChanged', accessibilitySupportEnabled);
		});

		// macOS dock activate
		app.on('activate', async (event, hasVisibleWindows) => {
			this.logService.trace('app#activate');

			// Mac only event: open new window when we get activated
			if (!hasVisibleWindows) {
				await this.windowsMainService?.openEmptyWindow({ context: OpenContext.DOCK });
			}
		});

		//#region Security related measures (https://electronjs.org/docs/tutorial/security)
		//
		// !!! DO NOT CHANGE without consulting the documentation !!!
		//
		app.on('web-contents-created', (event, contents) => {

			// Auxiliary Window: delegate to `AuxiliaryWindow` class
			if (contents?.opener?.url.startsWith(`${Schemas.vscodeFileResource}://${VSCODE_AUTHORITY}/`)) {
				this.logService.trace('[aux window]  app.on("web-contents-created"): Registering auxiliary window');

				this.auxiliaryWindowsMainService?.registerWindow(contents);
			}

			// Block any in-page navigation
			contents.on('will-navigate', event => {
				this.logService.error('webContents#will-navigate: Prevented webcontent navigation');

				event.preventDefault();
			});

			// All Windows: only allow about:blank auxiliary windows to open
			// For all other URLs, delegate to the OS.
			contents.setWindowOpenHandler(details => {

				// about:blank windows can open as window witho our default options
				if (details.url === 'about:blank') {
					this.logService.trace('[aux window] webContents#setWindowOpenHandler: Allowing auxiliary window to open on about:blank');

					return {
						action: 'allow',
						overrideBrowserWindowOptions: this.auxiliaryWindowsMainService?.createWindow(details)
					};
				}

				// Any other URL: delegate to OS
				else {
					this.logService.trace(`webContents#setWindowOpenHandler: Prevented opening window with URL ${details.url}}`);

					this.nativeHostMainService?.openExternal(undefined, details.url);

					return { action: 'deny' };
				}
			});
		});

		//#endregion

		let macOpenFileURIs: IWindowOpenable[] = [];
		let runningTimeout: Timeout | undefined = undefined;
		app.on('open-file', (event, path) => {
			path = normalizeNFC(path); // macOS only: normalize paths to NFC form

			this.logService.trace('app#open-file: ', path);
			event.preventDefault();

			// Keep in array because more might come!
			macOpenFileURIs.push(hasWorkspaceFileExtension(path) ? { workspaceUri: URI.file(path) } : { fileUri: URI.file(path) });

			// Clear previous handler if any
			if (runningTimeout !== undefined) {
				clearTimeout(runningTimeout);
				runningTimeout = undefined;
			}

			// Handle paths delayed in case more are coming!
			runningTimeout = setTimeout(async () => {
				await this.windowsMainService?.open({
					context: OpenContext.DOCK /* can also be opening from finder while app is running */,
					cli: this.environmentMainService.args,
					urisToOpen: macOpenFileURIs,
					gotoLineMode: false,
					preferNewWindow: true /* dropping on the dock or opening from finder prefers to open in a new window */
				});

				macOpenFileURIs = [];
				runningTimeout = undefined;
			}, 100);
		});

		app.on('new-window-for-tab', async () => {
			await this.windowsMainService?.openEmptyWindow({ context: OpenContext.DESKTOP }); //macOS native tab "+" button
		});

		//#region Bootstrap IPC Handlers

		validatedIpcMain.handle('vscode:fetchShellEnv', event => {

			// Prefer to use the args and env from the target window
			// when resolving the shell env. It is possible that
			// a first window was opened from the UI but a second
			// from the CLI and that has implications for whether to
			// resolve the shell environment or not.
			//
			// Window can be undefined for e.g. the shared process
			// that is not part of our windows registry!
			const window = this.windowsMainService?.getWindowByWebContents(event.sender); // Note: this can be `undefined` for the shared process
			let args: NativeParsedArgs;
			let env: IProcessEnvironment;
			if (window?.config) {
				args = window.config;
				env = { ...process.env, ...window.config.userEnv };
			} else {
				args = this.environmentMainService.args;
				env = process.env;
			}

			// Resolve shell env
			return this.resolveShellEnvironment(args, env, false);
		});

		validatedIpcMain.on('vscode:toggleDevTools', event => event.sender.toggleDevTools());
		validatedIpcMain.on('vscode:openDevTools', event => event.sender.openDevTools());

		validatedIpcMain.on('vscode:reloadWindow', event => event.sender.reload());

		validatedIpcMain.handle('vscode:notifyZoomLevel', async (event, zoomLevel: number | undefined) => {
			const window = this.windowsMainService?.getWindowByWebContents(event.sender);
			if (window) {
				window.notifyZoomLevel(zoomLevel);
			}
		});

		//#endregion
	}

	async startup(): Promise<void> {
		this.logService.debug('Starting VS Code');
		this.logService.debug(`from: ${this.environmentMainService.appRoot}`);
		this.logService.debug('args:', this.environmentMainService.args);

		// Make sure we associate the program with the app user model id
		// This will help Windows to associate the running program with
		// any shortcut that is pinned to the taskbar and prevent showing
		// two icons in the taskbar for the same app.
		const win32AppUserModelId = this.productService.win32AppUserModelId;
		if (isWindows && win32AppUserModelId) {
			app.setAppUserModelId(win32AppUserModelId);
		}

		// Fix native tabs on macOS 10.13
		// macOS enables a compatibility patch for any bundle ID beginning with
		// "com.microsoft.", which breaks native tabs for VS Code when using this
		// identifier (from the official build).
		// Explicitly opt out of the patch here before creating any windows.
		// See: https://github.com/microsoft/vscode/issues/35361#issuecomment-399794085
		try {
			if (isMacintosh && this.configurationService.getValue('window.nativeTabs') === true && !systemPreferences.getUserDefault('NSUseImprovedLayoutPass', 'boolean')) {
				systemPreferences.setUserDefault('NSUseImprovedLayoutPass', 'boolean', true);
			}
		} catch (error) {
			this.logService.error(error);
		}

		// Main process server (electron IPC based)
		const mainProcessElectronServer = new ElectronIPCServer();
		Event.once(this.lifecycleMainService.onWillShutdown)(e => {
			if (e.reason === ShutdownReason.KILL) {
				// When we go down abnormally, make sure to free up
				// any IPC we accept from other windows to reduce
				// the chance of doing work after we go down. Kill
				// is special in that it does not orderly shutdown
				// windows.
				mainProcessElectronServer.dispose();
			}
		});

		// Resolve unique machine ID
		const [machineId, sqmId, devDeviceId] = await Promise.all([
			resolveMachineId(this.stateService, this.logService),
			resolveSqmId(this.stateService, this.logService),
			resolveDevDeviceId(this.stateService, this.logService)
		]);

		// Shared process
		const { sharedProcessReady, sharedProcessClient } = this.setupSharedProcess(machineId, sqmId, devDeviceId);

		// Services
		const appInstantiationService = await this.initServices(machineId, sqmId, devDeviceId, sharedProcessReady);

		// Error telemetry
		appInstantiationService.invokeFunction(accessor => this._register(new ErrorTelemetry(accessor.get(ILogService), accessor.get(ITelemetryService))));

		// Auth Handler
		appInstantiationService.invokeFunction(accessor => accessor.get(IProxyAuthService));

		// Transient profiles handler
		this._register(appInstantiationService.createInstance(UserDataProfilesHandler));

		// Init Channels
		appInstantiationService.invokeFunction(accessor => this.initChannels(accessor, mainProcessElectronServer, sharedProcessClient));

		// Setup Protocol URL Handlers
		const initialProtocolUrls = await appInstantiationService.invokeFunction(accessor => this.setupProtocolUrlHandlers(accessor, mainProcessElectronServer));

		// Setup vscode-remote-resource protocol handler
		this.setupManagedRemoteResourceUrlHandler(mainProcessElectronServer);

		// Signal phase: ready - before opening first window
		this.lifecycleMainService.phase = LifecycleMainPhase.Ready;

		// Open Windows
		await appInstantiationService.invokeFunction(accessor => this.openFirstWindow(accessor, initialProtocolUrls));

		// Signal phase: after window open
		this.lifecycleMainService.phase = LifecycleMainPhase.AfterWindowOpen;

		// Post Open Windows Tasks
		this.afterWindowOpen();

		// Set lifecycle phase to `Eventually` after a short delay and when idle (min 2.5sec, max 5sec)
		const eventuallyPhaseScheduler = this._register(new RunOnceScheduler(() => {
			this._register(runWhenGlobalIdle(() => {

				// Signal phase: eventually
				this.lifecycleMainService.phase = LifecycleMainPhase.Eventually;

				// Eventually Post Open Window Tasks
				this.eventuallyAfterWindowOpen();
			}, 2500));
		}, 2500));
		eventuallyPhaseScheduler.schedule();
	}

	private async setupProtocolUrlHandlers(accessor: ServicesAccessor, mainProcessElectronServer: ElectronIPCServer): Promise<IInitialProtocolUrls | undefined> {
		const windowsMainService = this.windowsMainService = accessor.get(IWindowsMainService);
		const urlService = accessor.get(IURLService);
		const nativeHostMainService = this.nativeHostMainService = accessor.get(INativeHostMainService);
		const dialogMainService = accessor.get(IDialogMainService);

		// Install URL handlers that deal with protocl URLs either
		// from this process by opening windows and/or by forwarding
		// the URLs into a window process to be handled there.

		const app = this;
		urlService.registerHandler({
			async handleURL(uri: URI, options?: IOpenURLOptions): Promise<boolean> {
				return app.handleProtocolUrl(windowsMainService, dialogMainService, urlService, uri, options);
			}
		});

		const activeWindowManager = this._register(new ActiveWindowManager({
			onDidOpenMainWindow: nativeHostMainService.onDidOpenMainWindow,
			onDidFocusMainWindow: nativeHostMainService.onDidFocusMainWindow,
			getActiveWindowId: () => nativeHostMainService.getActiveWindowId(-1)
		}));
		const activeWindowRouter = new StaticRouter(ctx => activeWindowManager.getActiveClientId().then(id => ctx === id));
		const urlHandlerRouter = new URLHandlerRouter(activeWindowRouter, this.logService);
		const urlHandlerChannel = mainProcessElectronServer.getChannel('urlHandler', urlHandlerRouter);
		urlService.registerHandler(new URLHandlerChannelClient(urlHandlerChannel));

		const initialProtocolUrls = await this.resolveInitialProtocolUrls(windowsMainService, dialogMainService);
		this._register(new ElectronURLListener(initialProtocolUrls?.urls, urlService, windowsMainService, this.environmentMainService, this.productService, this.logService));

		return initialProtocolUrls;
	}

	private setupManagedRemoteResourceUrlHandler(mainProcessElectronServer: ElectronIPCServer) {
		const notFound = (): Electron.ProtocolResponse => ({ statusCode: 404, data: 'Not found' });
		const remoteResourceChannel = new Lazy(() => mainProcessElectronServer.getChannel(
			NODE_REMOTE_RESOURCE_CHANNEL_NAME,
			new NodeRemoteResourceRouter(),
		));

		protocol.registerBufferProtocol(Schemas.vscodeManagedRemoteResource, (request, callback) => {
			const url = URI.parse(request.url);
			if (!url.authority.startsWith('window:')) {
				return callback(notFound());
			}

			remoteResourceChannel.value.call<NodeRemoteResourceResponse>(NODE_REMOTE_RESOURCE_IPC_METHOD_NAME, [url]).then(
				r => callback({ ...r, data: Buffer.from(r.body, 'base64') }),
				err => {
					this.logService.warn('error dispatching remote resource call', err);
					callback({ statusCode: 500, data: String(err) });
				});
		});
	}

	private async resolveInitialProtocolUrls(windowsMainService: IWindowsMainService, dialogMainService: IDialogMainService): Promise<IInitialProtocolUrls | undefined> {

		/**
		 * Protocol URL handling on startup is complex, refer to
		 * {@link IInitialProtocolUrls} for an explainer.
		 */

		// Windows/Linux: protocol handler invokes CLI with --open-url
		const protocolUrlsFromCommandLine = this.environmentMainService.args['open-url'] ? this.environmentMainService.args._urls || [] : [];
		if (protocolUrlsFromCommandLine.length > 0) {
			this.logService.trace('app#resolveInitialProtocolUrls() protocol urls from command line:', protocolUrlsFromCommandLine);
		}

		// macOS: open-url events that were received before the app is ready
		const protocolUrlsFromEvent = ((global as { getOpenUrls?: () => string[] }).getOpenUrls?.() || []);
		if (protocolUrlsFromEvent.length > 0) {
			this.logService.trace(`app#resolveInitialProtocolUrls() protocol urls from macOS 'open-url' event:`, protocolUrlsFromEvent);
		}

		if (protocolUrlsFromCommandLine.length + protocolUrlsFromEvent.length === 0) {
			return undefined;
		}

		const protocolUrls = [
			...protocolUrlsFromCommandLine,
			...protocolUrlsFromEvent
		].map(url => {
			try {
				return { uri: URI.parse(url), originalUrl: url };
			} catch {
				this.logService.trace('app#resolveInitialProtocolUrls() protocol url failed to parse:', url);

				return undefined;
			}
		});

		const openables: IWindowOpenable[] = [];
		const urls: IProtocolUrl[] = [];
		for (const protocolUrl of protocolUrls) {
			if (!protocolUrl) {
				continue; // invalid
			}

			const windowOpenable = this.getWindowOpenableFromProtocolUrl(protocolUrl.uri);
			if (windowOpenable) {
				if (await this.shouldBlockOpenable(windowOpenable, windowsMainService, dialogMainService)) {
					this.logService.trace('app#resolveInitialProtocolUrls() protocol url was blocked:', protocolUrl.uri.toString(true));

					continue; // blocked
				} else {
					this.logService.trace('app#resolveInitialProtocolUrls() protocol url will be handled as window to open:', protocolUrl.uri.toString(true), windowOpenable);

					openables.push(windowOpenable); // handled as window to open
				}
			} else {
				this.logService.trace('app#resolveInitialProtocolUrls() protocol url will be passed to active window for handling:', protocolUrl.uri.toString(true));

				urls.push(protocolUrl); // handled within active window
			}
		}

		return { urls, openables };
	}

	private async shouldBlockOpenable(openable: IWindowOpenable, windowsMainService: IWindowsMainService, dialogMainService: IDialogMainService): Promise<boolean> {
		let openableUri: URI;
		let message: string;
		if (isWorkspaceToOpen(openable)) {
			openableUri = openable.workspaceUri;
			message = localize('confirmOpenMessageWorkspace', "An external application wants to open '{0}' in {1}. Do you want to open this workspace file?", openableUri.scheme === Schemas.file ? getPathLabel(openableUri, { os: OS, tildify: this.environmentMainService }) : openableUri.toString(true), this.productService.nameShort);
		} else if (isFolderToOpen(openable)) {
			openableUri = openable.folderUri;
			message = localize('confirmOpenMessageFolder', "An external application wants to open '{0}' in {1}. Do you want to open this folder?", openableUri.scheme === Schemas.file ? getPathLabel(openableUri, { os: OS, tildify: this.environmentMainService }) : openableUri.toString(true), this.productService.nameShort);
		} else {
			openableUri = openable.fileUri;
			message = localize('confirmOpenMessageFileOrFolder', "An external application wants to open '{0}' in {1}. Do you want to open this file or folder?", openableUri.scheme === Schemas.file ? getPathLabel(openableUri, { os: OS, tildify: this.environmentMainService }) : openableUri.toString(true), this.productService.nameShort);
		}

		if (openableUri.scheme !== Schemas.file && openableUri.scheme !== Schemas.vscodeRemote) {

			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			//
			// NOTE: we currently only ask for confirmation for `file` and `vscode-remote`
			// authorities here. There is an additional confirmation for `extension.id`
			// authorities from within the window.
			//
			// IF YOU ARE PLANNING ON ADDING ANOTHER AUTHORITY HERE, MAKE SURE TO ALSO
			// ADD IT TO THE CONFIRMATION CODE BELOW OR INSIDE THE WINDOW!
			//
			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

			return false;
		}

		const askForConfirmation = this.configurationService.getValue<unknown>(CodeApplication.SECURITY_PROTOCOL_HANDLING_CONFIRMATION_SETTING_KEY[openableUri.scheme]);
		if (askForConfirmation === false) {
			return false; // not blocked via settings
		}

		const { response, checkboxChecked } = await dialogMainService.showMessageBox({
			type: 'warning',
			buttons: [
				localize({ key: 'open', comment: ['&& denotes a mnemonic'] }, "&&Yes"),
				localize({ key: 'cancel', comment: ['&& denotes a mnemonic'] }, "&&No")
			],
			message,
			detail: localize('confirmOpenDetail', "If you did not initiate this request, it may represent an attempted attack on your system. Unless you took an explicit action to initiate this request, you should press 'No'"),
			checkboxLabel: openableUri.scheme === Schemas.file ? localize('doNotAskAgainLocal', "Allow opening local paths without asking") : localize('doNotAskAgainRemote', "Allow opening remote paths without asking"),
			cancelId: 1
		});

		if (response !== 0) {
			return true; // blocked by user choice
		}

		if (checkboxChecked) {
			// Due to https://github.com/microsoft/vscode/issues/195436, we can only
			// update settings from within a window. But we do not know if a window
			// is about to open or can already handle the request, so we have to send
			// to any current window and any newly opening window.
			const request = { channel: 'vscode:disablePromptForProtocolHandling', args: openableUri.scheme === Schemas.file ? 'local' : 'remote' };
			windowsMainService.sendToFocused(request.channel, request.args);
			windowsMainService.sendToOpeningWindow(request.channel, request.args);
		}

		return false; // not blocked by user choice
	}

	private getWindowOpenableFromProtocolUrl(uri: URI): IWindowOpenable | undefined {
		if (!uri.path) {
			return undefined;
		}

		// File path
		if (uri.authority === Schemas.file) {
			const fileUri = URI.file(uri.fsPath);

			if (hasWorkspaceFileExtension(fileUri)) {
				return { workspaceUri: fileUri };
			}

			return { fileUri };
		}

		// Remote path
		else if (uri.authority === Schemas.vscodeRemote) {

			// Example conversion:
			// From: vscode://vscode-remote/wsl+ubuntu/mnt/c/GitDevelopment/monaco
			//   To: vscode-remote://wsl+ubuntu/mnt/c/GitDevelopment/monaco

			const secondSlash = uri.path.indexOf(posix.sep, 1 /* skip over the leading slash */);
			let authority: string;
			let path: string;
			if (secondSlash !== -1) {
				authority = uri.path.substring(1, secondSlash);
				path = uri.path.substring(secondSlash);
			} else {
				authority = uri.path.substring(1);
				path = '/';
			}

			let query = uri.query;
			const params = new URLSearchParams(uri.query);
			if (params.get('windowId') === '_blank') {
				// Make sure to unset any `windowId=_blank` here
				// https://github.com/microsoft/vscode/issues/191902
				params.delete('windowId');
				query = params.toString();
			}

			const remoteUri = URI.from({ scheme: Schemas.vscodeRemote, authority, path, query, fragment: uri.fragment });

			if (hasWorkspaceFileExtension(path)) {
				return { workspaceUri: remoteUri };
			}

			if (/:[\d]+$/.test(path)) {
				// path with :line:column syntax
				return { fileUri: remoteUri };
			}

			return { folderUri: remoteUri };
		}
		return undefined;
	}

	private async handleProtocolUrl(windowsMainService: IWindowsMainService, dialogMainService: IDialogMainService, urlService: IURLService, uri: URI, options?: IOpenURLOptions): Promise<boolean> {
		this.logService.trace('app#handleProtocolUrl():', uri.toString(true), options);

		// Support 'workspace' URLs (https://github.com/microsoft/vscode/issues/124263)
		if (uri.scheme === this.productService.urlProtocol && uri.path === 'workspace') {
			uri = uri.with({
				authority: 'file',
				path: URI.parse(uri.query).path,
				query: ''
			});
		}

		let shouldOpenInNewWindow = false;

		// We should handle the URI in a new window if the URL contains `windowId=_blank`
		const params = new URLSearchParams(uri.query);
		if (params.get('windowId') === '_blank') {
			this.logService.trace(`app#handleProtocolUrl() found 'windowId=_blank' as parameter, setting shouldOpenInNewWindow=true:`, uri.toString(true));

			params.delete('windowId');
			uri = uri.with({ query: params.toString() });

			shouldOpenInNewWindow = true;
		}

		// or if no window is open (macOS only)
		else if (isMacintosh && windowsMainService.getWindowCount() === 0) {
			this.logService.trace(`app#handleProtocolUrl() running on macOS with no window open, setting shouldOpenInNewWindow=true:`, uri.toString(true));

			shouldOpenInNewWindow = true;
		}

		// Pass along whether the application is being opened via a Continue On flow
		const continueOn = params.get('continueOn');
		if (continueOn !== null) {
			this.logService.trace(`app#handleProtocolUrl() found 'continueOn' as parameter:`, uri.toString(true));

			params.delete('continueOn');
			uri = uri.with({ query: params.toString() });

			this.environmentMainService.continueOn = continueOn ?? undefined;
		}

		// Check if the protocol URL is a window openable to open...
		const windowOpenableFromProtocolUrl = this.getWindowOpenableFromProtocolUrl(uri);
		if (windowOpenableFromProtocolUrl) {
			if (await this.shouldBlockOpenable(windowOpenableFromProtocolUrl, windowsMainService, dialogMainService)) {
				this.logService.trace('app#handleProtocolUrl() protocol url was blocked:', uri.toString(true));

				return true; // If openable should be blocked, behave as if it's handled
			} else {
				this.logService.trace('app#handleProtocolUrl() opening protocol url as window:', windowOpenableFromProtocolUrl, uri.toString(true));

				const window = (await windowsMainService.open({
					context: OpenContext.LINK,
					cli: { ...this.environmentMainService.args },
					urisToOpen: [windowOpenableFromProtocolUrl],
					forceNewWindow: shouldOpenInNewWindow,
					gotoLineMode: true
					// remoteAuthority: will be determined based on windowOpenableFromProtocolUrl
				})).at(0);

				window?.focus(); // this should help ensuring that the right window gets focus when multiple are opened

				return true;
			}
		}

		// ...or if we should open in a new window and then handle it within that window
		if (shouldOpenInNewWindow) {
			this.logService.trace('app#handleProtocolUrl() opening empty window and passing in protocol url:', uri.toString(true));

			const window = (await windowsMainService.open({
				context: OpenContext.LINK,
				cli: { ...this.environmentMainService.args },
				forceNewWindow: true,
				forceEmpty: true,
				gotoLineMode: true,
				remoteAuthority: getRemoteAuthority(uri)
			})).at(0);

			await window?.ready();

			return urlService.open(uri, options);
		}

		this.logService.trace('app#handleProtocolUrl(): not handled', uri.toString(true), options);

		return false;
	}

	private setupSharedProcess(machineId: string, sqmId: string, devDeviceId: string): { sharedProcessReady: Promise<MessagePortClient>; sharedProcessClient: Promise<MessagePortClient> } {
		const sharedProcess = this._register(this.mainInstantiationService.createInstance(SharedProcess, machineId, sqmId, devDeviceId));

		this._register(sharedProcess.onDidCrash(() => this.windowsMainService?.sendToFocused('vscode:reportSharedProcessCrash')));

		const sharedProcessClient = (async () => {
			this.logService.trace('Main->SharedProcess#connect');

			const port = await sharedProcess.connect();

			this.logService.trace('Main->SharedProcess#connect: connection established');

			return new MessagePortClient(port, 'main');
		})();

		const sharedProcessReady = (async () => {
			await sharedProcess.whenReady();

			return sharedProcessClient;
		})();

		return { sharedProcessReady, sharedProcessClient };
	}

	private async initServices(machineId: string, sqmId: string, devDeviceId: string, sharedProcessReady: Promise<MessagePortClient>): Promise<IInstantiationService> {
		const services = new ServiceCollection();

		// Update
		switch (process.platform) {
			case 'win32':
				services.set(IUpdateService, new SyncDescriptor(Win32UpdateService));
				break;

			case 'linux':
				if (isLinuxSnap) {
					services.set(IUpdateService, new SyncDescriptor(SnapUpdateService, [process.env['SNAP'], process.env['SNAP_REVISION']]));
				} else {
					services.set(IUpdateService, new SyncDescriptor(LinuxUpdateService));
				}
				break;

			case 'darwin':
				services.set(IUpdateService, new SyncDescriptor(DarwinUpdateService));
				break;
		}

		// Windows
		services.set(IWindowsMainService, new SyncDescriptor(WindowsMainService, [machineId, sqmId, devDeviceId, this.userEnv], false));
		services.set(IAuxiliaryWindowsMainService, new SyncDescriptor(AuxiliaryWindowsMainService, undefined, false));

		// Dialogs
		const dialogMainService = new DialogMainService(this.logService, this.productService);
		services.set(IDialogMainService, dialogMainService);

		// Launch
		services.set(ILaunchMainService, new SyncDescriptor(LaunchMainService, undefined, false /* proxied to other processes */));

		// Diagnostics
		services.set(IDiagnosticsMainService, new SyncDescriptor(DiagnosticsMainService, undefined, false /* proxied to other processes */));
		services.set(IDiagnosticsService, ProxyChannel.toService(getDelayedChannel(sharedProcessReady.then(client => client.getChannel('diagnostics')))));

		// Encryption
		services.set(IEncryptionMainService, new SyncDescriptor(EncryptionMainService));

		// Browser Elements
		services.set(INativeBrowserElementsMainService, new SyncDescriptor(NativeBrowserElementsMainService, undefined, false /* proxied to other processes */));

		// Keyboard Layout
		services.set(IKeyboardLayoutMainService, new SyncDescriptor(KeyboardLayoutMainService));

		// Native Host
		services.set(INativeHostMainService, new SyncDescriptor(NativeHostMainService, undefined, false /* proxied to other processes */));

		// Web Contents Extractor
		services.set(IWebContentExtractorService, new SyncDescriptor(NativeWebContentExtractorService, undefined, false /* proxied to other processes */));

		// Webview Manager
		services.set(IWebviewManagerService, new SyncDescriptor(WebviewMainService));

		// Menubar
		services.set(IMenubarMainService, new SyncDescriptor(MenubarMainService));

		// Extension Host Starter
		services.set(IExtensionHostStarter, new SyncDescriptor(ExtensionHostStarter));

		// Storage
		services.set(IStorageMainService, new SyncDescriptor(StorageMainService));
		services.set(IApplicationStorageMainService, new SyncDescriptor(ApplicationStorageMainService));

		// Terminal
		const ptyHostStarter = new ElectronPtyHostStarter({
			graceTime: LocalReconnectConstants.GraceTime,
			shortGraceTime: LocalReconnectConstants.ShortGraceTime,
			scrollback: this.configurationService.getValue<number>(TerminalSettingId.PersistentSessionScrollback) ?? 100
		}, this.configurationService, this.environmentMainService, this.lifecycleMainService, this.logService);
		const ptyHostService = new PtyHostService(
			ptyHostStarter,
			this.configurationService,
			this.logService,
			this.loggerService
		);
		services.set(ILocalPtyService, ptyHostService);

		// External terminal
		if (isWindows) {
			services.set(IExternalTerminalMainService, new SyncDescriptor(WindowsExternalTerminalService));
		} else if (isMacintosh) {
			services.set(IExternalTerminalMainService, new SyncDescriptor(MacExternalTerminalService));
		} else if (isLinux) {
			services.set(IExternalTerminalMainService, new SyncDescriptor(LinuxExternalTerminalService));
		}

		// Backups
		const backupMainService = new BackupMainService(this.environmentMainService, this.configurationService, this.logService, this.stateService);
		services.set(IBackupMainService, backupMainService);

		// Workspaces
		const workspacesManagementMainService = new WorkspacesManagementMainService(this.environmentMainService, this.logService, this.userDataProfilesMainService, backupMainService, dialogMainService);
		services.set(IWorkspacesManagementMainService, workspacesManagementMainService);
		services.set(IWorkspacesService, new SyncDescriptor(WorkspacesMainService, undefined, false /* proxied to other processes */));
		services.set(IWorkspacesHistoryMainService, new SyncDescriptor(WorkspacesHistoryMainService, undefined, false));

		// URL handling
		services.set(IURLService, new SyncDescriptor(NativeURLService, undefined, false /* proxied to other processes */));

		// Telemetry
		if (supportsTelemetry(this.productService, this.environmentMainService)) {
			const isInternal = isInternalTelemetry(this.productService, this.configurationService);
			const channel = getDelayedChannel(sharedProcessReady.then(client => client.getChannel('telemetryAppender')));
			const appender = new TelemetryAppenderClient(channel);
			const commonProperties = resolveCommonProperties(release(), hostname(), process.arch, this.productService.commit, this.productService.version, machineId, sqmId, devDeviceId, isInternal, this.productService.date);
			const piiPaths = getPiiPathsFromEnvironment(this.environmentMainService);
			const config: ITelemetryServiceConfig = { appenders: [appender], commonProperties, piiPaths, sendErrorTelemetry: true };

			services.set(ITelemetryService, new SyncDescriptor(TelemetryService, [config], false));
		} else {
			services.set(ITelemetryService, NullTelemetryService);
		}

		// Default Extensions Profile Init
		services.set(IExtensionsProfileScannerService, new SyncDescriptor(ExtensionsProfileScannerService, undefined, true));
		services.set(IExtensionsScannerService, new SyncDescriptor(ExtensionsScannerService, undefined, true));

		// Utility Process Worker
		services.set(IUtilityProcessWorkerMainService, new SyncDescriptor(UtilityProcessWorkerMainService, undefined, true));

		// Proxy Auth
		services.set(IProxyAuthService, new SyncDescriptor(ProxyAuthService));

		// MCP
		services.set(INativeMcpDiscoveryHelperService, new SyncDescriptor(NativeMcpDiscoveryHelperService));


		// Dev Only: CSS service (for ESM)
		services.set(ICSSDevelopmentService, new SyncDescriptor(CSSDevelopmentService, undefined, true));

		// Init services that require it
		await Promises.settled([
			backupMainService.initialize(),
			workspacesManagementMainService.initialize()
		]);

		return this.mainInstantiationService.createChild(services);
	}

	private initChannels(accessor: ServicesAccessor, mainProcessElectronServer: ElectronIPCServer, sharedProcessClient: Promise<MessagePortClient>): void {

		// Channels registered to node.js are exposed to second instances
		// launching because that is the only way the second instance
		// can talk to the first instance. Electron IPC does not work
		// across apps until `requestSingleInstance` APIs are adopted.

		const disposables = this._register(new DisposableStore());

		const launchChannel = ProxyChannel.fromService(accessor.get(ILaunchMainService), disposables, { disableMarshalling: true });
		this.mainProcessNodeIpcServer.registerChannel('launch', launchChannel);

		const diagnosticsChannel = ProxyChannel.fromService(accessor.get(IDiagnosticsMainService), disposables, { disableMarshalling: true });
		this.mainProcessNodeIpcServer.registerChannel('diagnostics', diagnosticsChannel);

		// Policies (main & shared process)
		const policyChannel = disposables.add(new PolicyChannel(accessor.get(IPolicyService)));
		mainProcessElectronServer.registerChannel('policy', policyChannel);
		sharedProcessClient.then(client => client.registerChannel('policy', policyChannel));

		// Local Files
		const diskFileSystemProvider = this.fileService.getProvider(Schemas.file);
		assertType(diskFileSystemProvider instanceof DiskFileSystemProvider);
		const fileSystemProviderChannel = disposables.add(new DiskFileSystemProviderChannel(diskFileSystemProvider, this.logService, this.environmentMainService));
		mainProcessElectronServer.registerChannel(LOCAL_FILE_SYSTEM_CHANNEL_NAME, fileSystemProviderChannel);
		sharedProcessClient.then(client => client.registerChannel(LOCAL_FILE_SYSTEM_CHANNEL_NAME, fileSystemProviderChannel));

		// User Data Profiles
		const userDataProfilesService = ProxyChannel.fromService(accessor.get(IUserDataProfilesMainService), disposables);
		mainProcessElectronServer.registerChannel('userDataProfiles', userDataProfilesService);
		sharedProcessClient.then(client => client.registerChannel('userDataProfiles', userDataProfilesService));

		// Update
		const updateChannel = new UpdateChannel(accessor.get(IUpdateService));
		mainProcessElectronServer.registerChannel('update', updateChannel);

		// Process
		const processChannel = ProxyChannel.fromService(new ProcessMainService(this.logService, accessor.get(IDiagnosticsService), accessor.get(IDiagnosticsMainService)), disposables);
		mainProcessElectronServer.registerChannel('process', processChannel);

		// Encryption
		const encryptionChannel = ProxyChannel.fromService(accessor.get(IEncryptionMainService), disposables);
		mainProcessElectronServer.registerChannel('encryption', encryptionChannel);

		// Browser Elements
		const browserElementsChannel = ProxyChannel.fromService(accessor.get(INativeBrowserElementsMainService), disposables);
		mainProcessElectronServer.registerChannel('browserElements', browserElementsChannel);
		sharedProcessClient.then(client => client.registerChannel('browserElements', browserElementsChannel));

		// Signing
		const signChannel = ProxyChannel.fromService(accessor.get(ISignService), disposables);
		mainProcessElectronServer.registerChannel('sign', signChannel);

		// Keyboard Layout
		const keyboardLayoutChannel = ProxyChannel.fromService(accessor.get(IKeyboardLayoutMainService), disposables);
		mainProcessElectronServer.registerChannel('keyboardLayout', keyboardLayoutChannel);

		// Native host (main & shared process)
		this.nativeHostMainService = accessor.get(INativeHostMainService);
		const nativeHostChannel = ProxyChannel.fromService(this.nativeHostMainService, disposables);
		mainProcessElectronServer.registerChannel('nativeHost', nativeHostChannel);
		sharedProcessClient.then(client => client.registerChannel('nativeHost', nativeHostChannel));

		// Web Content Extractor
		const webContentExtractorChannel = ProxyChannel.fromService(accessor.get(IWebContentExtractorService), disposables);
		mainProcessElectronServer.registerChannel('webContentExtractor', webContentExtractorChannel);

		// Workspaces
		const workspacesChannel = ProxyChannel.fromService(accessor.get(IWorkspacesService), disposables);
		mainProcessElectronServer.registerChannel('workspaces', workspacesChannel);

		// Menubar
		const menubarChannel = ProxyChannel.fromService(accessor.get(IMenubarMainService), disposables);
		mainProcessElectronServer.registerChannel('menubar', menubarChannel);

		// URL handling
		const urlChannel = ProxyChannel.fromService(accessor.get(IURLService), disposables);
		mainProcessElectronServer.registerChannel('url', urlChannel);

		// Webview Manager
		const webviewChannel = ProxyChannel.fromService(accessor.get(IWebviewManagerService), disposables);
		mainProcessElectronServer.registerChannel('webview', webviewChannel);

		// Storage (main & shared process)
		const storageChannel = disposables.add((new StorageDatabaseChannel(this.logService, accessor.get(IStorageMainService))));
		mainProcessElectronServer.registerChannel('storage', storageChannel);
		sharedProcessClient.then(client => client.registerChannel('storage', storageChannel));

		// Profile Storage Changes Listener (shared process)
		const profileStorageListener = disposables.add((new ProfileStorageChangesListenerChannel(accessor.get(IStorageMainService), accessor.get(IUserDataProfilesMainService), this.logService)));
		sharedProcessClient.then(client => client.registerChannel('profileStorageListener', profileStorageListener));

		// Terminal
		const ptyHostChannel = ProxyChannel.fromService(accessor.get(ILocalPtyService), disposables);
		mainProcessElectronServer.registerChannel(TerminalIpcChannels.LocalPty, ptyHostChannel);

		// External Terminal
		const externalTerminalChannel = ProxyChannel.fromService(accessor.get(IExternalTerminalMainService), disposables);
		mainProcessElectronServer.registerChannel('externalTerminal', externalTerminalChannel);

		// MCP
		const mcpDiscoveryChannel = ProxyChannel.fromService(accessor.get(INativeMcpDiscoveryHelperService), disposables);
		mainProcessElectronServer.registerChannel(NativeMcpDiscoveryHelperChannelName, mcpDiscoveryChannel);

		// Logger
		const loggerChannel = new LoggerChannel(accessor.get(ILoggerMainService),);
		mainProcessElectronServer.registerChannel('logger', loggerChannel);
		sharedProcessClient.then(client => client.registerChannel('logger', loggerChannel));

		// Extension Host Debug Broadcasting
		const electronExtensionHostDebugBroadcastChannel = new ElectronExtensionHostDebugBroadcastChannel(accessor.get(IWindowsMainService));
		mainProcessElectronServer.registerChannel('extensionhostdebugservice', electronExtensionHostDebugBroadcastChannel);

		// Extension Host Starter
		const extensionHostStarterChannel = ProxyChannel.fromService(accessor.get(IExtensionHostStarter), disposables);
		mainProcessElectronServer.registerChannel(ipcExtensionHostStarterChannelName, extensionHostStarterChannel);

		// Utility Process Worker
		const utilityProcessWorkerChannel = ProxyChannel.fromService(accessor.get(IUtilityProcessWorkerMainService), disposables);
		mainProcessElectronServer.registerChannel(ipcUtilityProcessWorkerChannelName, utilityProcessWorkerChannel);
	}

	private async openFirstWindow(accessor: ServicesAccessor, initialProtocolUrls: IInitialProtocolUrls | undefined): Promise<ICodeWindow[]> {
		const windowsMainService = this.windowsMainService = accessor.get(IWindowsMainService);
		this.auxiliaryWindowsMainService = accessor.get(IAuxiliaryWindowsMainService);

		const context = isLaunchedFromCli(process.env) ? OpenContext.CLI : OpenContext.DESKTOP;
		const args = this.environmentMainService.args;

		// First check for windows from protocol links to open
		if (initialProtocolUrls) {

			// Openables can open as windows directly
			if (initialProtocolUrls.openables.length > 0) {
				return windowsMainService.open({
					context,
					cli: args,
					urisToOpen: initialProtocolUrls.openables,
					gotoLineMode: true,
					initialStartup: true
					// remoteAuthority: will be determined based on openables
				});
			}

			// Protocol links with `windowId=_blank` on startup
			// should be handled in a special way:
			// We take the first one of these and open an empty
			// window for it. This ensures we are not restoring
			// all windows of the previous session.
			// If there are any more URLs like these, they will
			// be handled from the URL listeners installed later.

			if (initialProtocolUrls.urls.length > 0) {
				for (const protocolUrl of initialProtocolUrls.urls) {
					const params = new URLSearchParams(protocolUrl.uri.query);
					if (params.get('windowId') === '_blank') {

						// It is important here that we remove `windowId=_blank` from
						// this URL because here we open an empty window for it.

						params.delete('windowId');
						protocolUrl.originalUrl = protocolUrl.uri.toString(true);
						protocolUrl.uri = protocolUrl.uri.with({ query: params.toString() });

						return windowsMainService.open({
							context,
							cli: args,
							forceNewWindow: true,
							forceEmpty: true,
							gotoLineMode: true,
							initialStartup: true
							// remoteAuthority: will be determined based on openables
						});
					}
				}
			}
		}

		const macOpenFiles: string[] = (global as { macOpenFiles?: string[] }).macOpenFiles ?? [];
		const hasCliArgs = args._.length;
		const hasFolderURIs = !!args['folder-uri'];
		const hasFileURIs = !!args['file-uri'];
		const noRecentEntry = args['skip-add-to-recently-opened'] === true;
		const waitMarkerFileURI = args.wait && args.waitMarkerFilePath ? URI.file(args.waitMarkerFilePath) : undefined;
		const remoteAuthority = args.remote || undefined;
		const forceProfile = args.profile;
		const forceTempProfile = args['profile-temp'];

		// Started without file/folder arguments
		if (!hasCliArgs && !hasFolderURIs && !hasFileURIs) {

			// Force new window
			if (args['new-window'] || forceProfile || forceTempProfile) {
				return windowsMainService.open({
					context,
					cli: args,
					forceNewWindow: true,
					forceEmpty: true,
					noRecentEntry,
					waitMarkerFileURI,
					initialStartup: true,
					remoteAuthority,
					forceProfile,
					forceTempProfile
				});
			}

			// mac: open-file event received on startup
			if (macOpenFiles.length) {
				return windowsMainService.open({
					context: OpenContext.DOCK,
					cli: args,
					urisToOpen: macOpenFiles.map(path => {
						path = normalizeNFC(path); // macOS only: normalize paths to NFC form

						return (hasWorkspaceFileExtension(path) ? { workspaceUri: URI.file(path) } : { fileUri: URI.file(path) });
					}),
					noRecentEntry,
					waitMarkerFileURI,
					initialStartup: true,
					// remoteAuthority: will be determined based on macOpenFiles
				});
			}
		}

		// default: read paths from cli
		return windowsMainService.open({
			context,
			cli: args,
			forceNewWindow: args['new-window'],
			diffMode: args.diff,
			mergeMode: args.merge,
			noRecentEntry,
			waitMarkerFileURI,
			gotoLineMode: args.goto,
			initialStartup: true,
			remoteAuthority,
			forceProfile,
			forceTempProfile
		});
	}

	private afterWindowOpen(): void {

		// Windows: mutex
		this.installMutex();

		// Remote Authorities
		protocol.registerHttpProtocol(Schemas.vscodeRemoteResource, (request, callback) => {
			callback({
				url: request.url.replace(/^vscode-remote-resource:/, 'http:'),
				method: request.method
			});
		});

		// Start to fetch shell environment (if needed) after window has opened
		// Since this operation can take a long time, we want to warm it up while
		// the window is opening.
		// We also show an error to the user in case this fails.
		this.resolveShellEnvironment(this.environmentMainService.args, process.env, true);

		// Crash reporter
		this.updateCrashReporterEnablement();

		// macOS: rosetta translation warning
		if (isMacintosh && app.runningUnderARM64Translation) {
			this.windowsMainService?.sendToFocused('vscode:showTranslatedBuildWarning');
		}
	}

	private async installMutex(): Promise<void> {
		const win32MutexName = this.productService.win32MutexName;
		if (isWindows && win32MutexName) {
			try {
				const WindowsMutex = await import('@vscode/windows-mutex');
				const mutex = new WindowsMutex.Mutex(win32MutexName);
				Event.once(this.lifecycleMainService.onWillShutdown)(() => mutex.release());
			} catch (error) {
				this.logService.error(error);
			}
		}
	}

	private async resolveShellEnvironment(args: NativeParsedArgs, env: IProcessEnvironment, notifyOnError: boolean): Promise<typeof process.env> {
		try {
			return await getResolvedShellEnv(this.configurationService, this.logService, args, env);
		} catch (error) {
			const errorMessage = toErrorMessage(error);
			if (notifyOnError) {
				this.windowsMainService?.sendToFocused('vscode:showResolveShellEnvError', errorMessage);
			} else {
				this.logService.error(errorMessage);
			}
		}

		return {};
	}

	private async updateCrashReporterEnablement(): Promise<void> {

		// If enable-crash-reporter argv is undefined then this is a fresh start,
		// based on `telemetry.enableCrashreporter` settings, generate a UUID which
		// will be used as crash reporter id and also update the json file.

		try {
			const argvContent = await this.fileService.readFile(this.environmentMainService.argvResource);
			const argvString = argvContent.value.toString();
			const argvJSON = parse<{ 'enable-crash-reporter'?: boolean }>(argvString);
			const telemetryLevel = getTelemetryLevel(this.configurationService);
			const enableCrashReporter = telemetryLevel >= TelemetryLevel.CRASH;

			// Initial startup
			if (argvJSON['enable-crash-reporter'] === undefined) {
				const additionalArgvContent = [
					'',
					'	// Allows to disable crash reporting.',
					'	// Should restart the app if the value is changed.',
					`	"enable-crash-reporter": ${enableCrashReporter},`,
					'',
					'	// Unique id used for correlating crash reports sent from this instance.',
					'	// Do not edit this value.',
					`	"crash-reporter-id": "${generateUuid()}"`,
					'}'
				];
				const newArgvString = argvString.substring(0, argvString.length - 2).concat(',\n', additionalArgvContent.join('\n'));

				await this.fileService.writeFile(this.environmentMainService.argvResource, VSBuffer.fromString(newArgvString));
			}

			// Subsequent startup: update crash reporter value if changed
			else {
				const newArgvString = argvString.replace(/"enable-crash-reporter": .*,/, `"enable-crash-reporter": ${enableCrashReporter},`);
				if (newArgvString !== argvString) {
					await this.fileService.writeFile(this.environmentMainService.argvResource, VSBuffer.fromString(newArgvString));
				}
			}
		} catch (error) {
			this.logService.error(error);

			// Inform the user via notification
			this.windowsMainService?.sendToFocused('vscode:showArgvParseWarning');
		}
	}

	private eventuallyAfterWindowOpen(): void {

		// Validate Device ID is up to date (delay this as it has shown significant perf impact)
		// Refs: https://github.com/microsoft/vscode/issues/234064
		validateDevDeviceId(this.stateService, this.logService);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/code/electron-main/main.ts]---
Location: vscode-main/src/vs/code/electron-main/main.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import '../../platform/update/common/update.config.contribution.js';

import { app, dialog } from 'electron';
import { unlinkSync, promises } from 'fs';
import { URI } from '../../base/common/uri.js';
import { coalesce, distinct } from '../../base/common/arrays.js';
import { Promises } from '../../base/common/async.js';
import { toErrorMessage } from '../../base/common/errorMessage.js';
import { ExpectedError, setUnexpectedErrorHandler } from '../../base/common/errors.js';
import { IPathWithLineAndColumn, isValidBasename, parseLineAndColumnAware, sanitizeFilePath } from '../../base/common/extpath.js';
import { Event } from '../../base/common/event.js';
import { getPathLabel } from '../../base/common/labels.js';
import { Schemas } from '../../base/common/network.js';
import { basename, resolve } from '../../base/common/path.js';
import { mark } from '../../base/common/performance.js';
import { IProcessEnvironment, isLinux, isMacintosh, isWindows, OS } from '../../base/common/platform.js';
import { cwd } from '../../base/common/process.js';
import { rtrim, trim } from '../../base/common/strings.js';
import { Promises as FSPromises } from '../../base/node/pfs.js';
import { ProxyChannel } from '../../base/parts/ipc/common/ipc.js';
import { Client as NodeIPCClient } from '../../base/parts/ipc/common/ipc.net.js';
import { connect as nodeIPCConnect, serve as nodeIPCServe, Server as NodeIPCServer, XDG_RUNTIME_DIR } from '../../base/parts/ipc/node/ipc.net.js';
import { CodeApplication } from './app.js';
import { localize } from '../../nls.js';
import { IConfigurationService } from '../../platform/configuration/common/configuration.js';
import { ConfigurationService } from '../../platform/configuration/common/configurationService.js';
import { IDiagnosticsMainService } from '../../platform/diagnostics/electron-main/diagnosticsMainService.js';
import { DiagnosticsService } from '../../platform/diagnostics/node/diagnosticsService.js';
import { NativeParsedArgs } from '../../platform/environment/common/argv.js';
import { EnvironmentMainService, IEnvironmentMainService } from '../../platform/environment/electron-main/environmentMainService.js';
import { addArg, parseMainProcessArgv } from '../../platform/environment/node/argvHelper.js';
import { createWaitMarkerFileSync } from '../../platform/environment/node/wait.js';
import { IFileService } from '../../platform/files/common/files.js';
import { FileService } from '../../platform/files/common/fileService.js';
import { DiskFileSystemProvider } from '../../platform/files/node/diskFileSystemProvider.js';
import { SyncDescriptor } from '../../platform/instantiation/common/descriptors.js';
import { IInstantiationService, ServicesAccessor } from '../../platform/instantiation/common/instantiation.js';
import { InstantiationService } from '../../platform/instantiation/common/instantiationService.js';
import { ServiceCollection } from '../../platform/instantiation/common/serviceCollection.js';
import { ILaunchMainService } from '../../platform/launch/electron-main/launchMainService.js';
import { ILifecycleMainService, LifecycleMainService } from '../../platform/lifecycle/electron-main/lifecycleMainService.js';
import { BufferLogger } from '../../platform/log/common/bufferLog.js';
import { ConsoleMainLogger, getLogLevel, ILoggerService, ILogService } from '../../platform/log/common/log.js';
import product from '../../platform/product/common/product.js';
import { IProductService } from '../../platform/product/common/productService.js';
import { IProtocolMainService } from '../../platform/protocol/electron-main/protocol.js';
import { ProtocolMainService } from '../../platform/protocol/electron-main/protocolMainService.js';
import { ITunnelService } from '../../platform/tunnel/common/tunnel.js';
import { TunnelService } from '../../platform/tunnel/node/tunnelService.js';
import { IRequestService } from '../../platform/request/common/request.js';
import { RequestService } from '../../platform/request/electron-utility/requestService.js';
import { ISignService } from '../../platform/sign/common/sign.js';
import { SignService } from '../../platform/sign/node/signService.js';
import { IStateReadService, IStateService } from '../../platform/state/node/state.js';
import { NullTelemetryService } from '../../platform/telemetry/common/telemetryUtils.js';
import { IThemeMainService } from '../../platform/theme/electron-main/themeMainService.js';
import { IUserDataProfilesMainService, UserDataProfilesMainService } from '../../platform/userDataProfile/electron-main/userDataProfile.js';
import { IPolicyService, NullPolicyService } from '../../platform/policy/common/policy.js';
import { NativePolicyService } from '../../platform/policy/node/nativePolicyService.js';
import { FilePolicyService } from '../../platform/policy/common/filePolicyService.js';
import { DisposableStore } from '../../base/common/lifecycle.js';
import { IUriIdentityService } from '../../platform/uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../platform/uriIdentity/common/uriIdentityService.js';
import { ILoggerMainService, LoggerMainService } from '../../platform/log/electron-main/loggerService.js';
import { LogService } from '../../platform/log/common/logService.js';
import { massageMessageBoxOptions } from '../../platform/dialogs/common/dialogs.js';
import { SaveStrategy, StateService } from '../../platform/state/node/stateService.js';
import { FileUserDataProvider } from '../../platform/userData/common/fileUserDataProvider.js';
import { addUNCHostToAllowlist, getUNCHost } from '../../base/node/unc.js';
import { ThemeMainService } from '../../platform/theme/electron-main/themeMainServiceImpl.js';
import { LINUX_SYSTEM_POLICY_FILE_PATH } from '../../base/common/policy.js';

/**
 * The main VS Code entry point.
 *
 * Note: This class can exist more than once for example when VS Code is already
 * running and a second instance is started from the command line. It will always
 * try to communicate with an existing instance to prevent that 2 VS Code instances
 * are running at the same time.
 */
class CodeMain {

	main(): void {
		try {
			this.startup();
		} catch (error) {
			console.error(error.message);
			app.exit(1);
		}
	}

	private async startup(): Promise<void> {

		// Set the error handler early enough so that we are not getting the
		// default electron error dialog popping up
		setUnexpectedErrorHandler(err => console.error(err));

		// Create services
		const [instantiationService, instanceEnvironment, environmentMainService, configurationService, stateMainService, bufferLogger, productService, userDataProfilesMainService] = this.createServices();

		try {

			// Init services
			try {
				await this.initServices(environmentMainService, userDataProfilesMainService, configurationService, stateMainService, productService);
			} catch (error) {

				// Show a dialog for errors that can be resolved by the user
				this.handleStartupDataDirError(environmentMainService, productService, error);

				throw error;
			}

			// Startup
			await instantiationService.invokeFunction(async accessor => {
				const logService = accessor.get(ILogService);
				const lifecycleMainService = accessor.get(ILifecycleMainService);
				const fileService = accessor.get(IFileService);
				const loggerService = accessor.get(ILoggerService);

				// Create the main IPC server by trying to be the server
				// If this throws an error it means we are not the first
				// instance of VS Code running and so we would quit.
				const mainProcessNodeIpcServer = await this.claimInstance(logService, environmentMainService, lifecycleMainService, instantiationService, productService, true);

				// Write a lockfile to indicate an instance is running
				// (https://github.com/microsoft/vscode/issues/127861#issuecomment-877417451)
				FSPromises.writeFile(environmentMainService.mainLockfile, String(process.pid)).catch(err => {
					logService.warn(`app#startup(): Error writing main lockfile: ${err.stack}`);
				});

				// Delay creation of spdlog for perf reasons (https://github.com/microsoft/vscode/issues/72906)
				bufferLogger.logger = loggerService.createLogger('main', { name: localize('mainLog', "Main") });

				// Lifecycle
				Event.once(lifecycleMainService.onWillShutdown)(evt => {
					fileService.dispose();
					configurationService.dispose();
					evt.join('instanceLockfile', promises.unlink(environmentMainService.mainLockfile).catch(() => { /* ignored */ }));
				});

				// Check if Inno Setup is running
				const innoSetupActive = await this.checkInnoSetupMutex(productService);
				if (innoSetupActive) {
					const message = `${productService.nameShort} is currently being updated. Please wait for the update to complete before launching.`;
					instantiationService.invokeFunction(this.quit, new Error(message));
					return;
				}

				return instantiationService.createInstance(CodeApplication, mainProcessNodeIpcServer, instanceEnvironment).startup();
			});
		} catch (error) {
			instantiationService.invokeFunction(this.quit, error);
		}
	}

	private createServices(): [IInstantiationService, IProcessEnvironment, IEnvironmentMainService, ConfigurationService, StateService, BufferLogger, IProductService, UserDataProfilesMainService] {
		const services = new ServiceCollection();
		const disposables = new DisposableStore();
		process.once('exit', () => disposables.dispose());

		// Product
		const productService = { _serviceBrand: undefined, ...product };
		services.set(IProductService, productService);

		// Environment
		const environmentMainService = new EnvironmentMainService(this.resolveArgs(), productService);
		const instanceEnvironment = this.patchEnvironment(environmentMainService); // Patch `process.env` with the instance's environment
		services.set(IEnvironmentMainService, environmentMainService);

		// Logger
		const loggerService = new LoggerMainService(getLogLevel(environmentMainService), environmentMainService.logsHome);
		services.set(ILoggerMainService, loggerService);

		// Log: We need to buffer the spdlog logs until we are sure
		// we are the only instance running, otherwise we'll have concurrent
		// log file access on Windows (https://github.com/microsoft/vscode/issues/41218)
		const bufferLogger = new BufferLogger(loggerService.getLogLevel());
		const logService = disposables.add(new LogService(bufferLogger, [new ConsoleMainLogger(loggerService.getLogLevel())]));
		services.set(ILogService, logService);

		// Files
		const fileService = new FileService(logService);
		services.set(IFileService, fileService);
		const diskFileSystemProvider = new DiskFileSystemProvider(logService);
		fileService.registerProvider(Schemas.file, diskFileSystemProvider);

		// URI Identity
		const uriIdentityService = new UriIdentityService(fileService);
		services.set(IUriIdentityService, uriIdentityService);

		// State
		const stateService = new StateService(SaveStrategy.DELAYED, environmentMainService, logService, fileService);
		services.set(IStateReadService, stateService);
		services.set(IStateService, stateService);

		// User Data Profiles
		const userDataProfilesMainService = new UserDataProfilesMainService(stateService, uriIdentityService, environmentMainService, fileService, logService);
		services.set(IUserDataProfilesMainService, userDataProfilesMainService);

		// Use FileUserDataProvider for user data to
		// enable atomic read / write operations.
		fileService.registerProvider(Schemas.vscodeUserData, new FileUserDataProvider(Schemas.file, diskFileSystemProvider, Schemas.vscodeUserData, userDataProfilesMainService, uriIdentityService, logService));

		// Policy
		let policyService: IPolicyService | undefined;
		if (isWindows && productService.win32RegValueName) {
			policyService = disposables.add(new NativePolicyService(logService, productService.win32RegValueName));
		} else if (isMacintosh && productService.darwinBundleIdentifier) {
			policyService = disposables.add(new NativePolicyService(logService, productService.darwinBundleIdentifier));
		} else if (isLinux) {
			policyService = disposables.add(new FilePolicyService(URI.file(LINUX_SYSTEM_POLICY_FILE_PATH), fileService, logService));
		} else if (environmentMainService.policyFile) {
			policyService = disposables.add(new FilePolicyService(environmentMainService.policyFile, fileService, logService));
		} else {
			policyService = new NullPolicyService();
		}
		services.set(IPolicyService, policyService);

		// Configuration
		const configurationService = new ConfigurationService(userDataProfilesMainService.defaultProfile.settingsResource, fileService, policyService, logService);
		services.set(IConfigurationService, configurationService);

		// Lifecycle
		services.set(ILifecycleMainService, new SyncDescriptor(LifecycleMainService, undefined, false));

		// Request
		services.set(IRequestService, new SyncDescriptor(RequestService, undefined, true));

		// Themes
		services.set(IThemeMainService, new SyncDescriptor(ThemeMainService));

		// Signing
		services.set(ISignService, new SyncDescriptor(SignService, undefined, false /* proxied to other processes */));

		// Tunnel
		services.set(ITunnelService, new SyncDescriptor(TunnelService));

		// Protocol (instantiated early and not using sync descriptor for security reasons)
		services.set(IProtocolMainService, new ProtocolMainService(environmentMainService, userDataProfilesMainService, logService));

		return [new InstantiationService(services, true), instanceEnvironment, environmentMainService, configurationService, stateService, bufferLogger, productService, userDataProfilesMainService];
	}

	private patchEnvironment(environmentMainService: IEnvironmentMainService): IProcessEnvironment {
		const instanceEnvironment: IProcessEnvironment = {
			VSCODE_IPC_HOOK: environmentMainService.mainIPCHandle
		};

		['VSCODE_NLS_CONFIG', 'VSCODE_PORTABLE'].forEach(key => {
			const value = process.env[key];
			if (typeof value === 'string') {
				instanceEnvironment[key] = value;
			}
		});

		Object.assign(process.env, instanceEnvironment);

		return instanceEnvironment;
	}

	private async initServices(environmentMainService: IEnvironmentMainService, userDataProfilesMainService: UserDataProfilesMainService, configurationService: ConfigurationService, stateService: StateService, productService: IProductService): Promise<void> {
		await Promises.settled<unknown>([

			// Environment service (paths)
			Promise.all<string | undefined>([
				this.allowWindowsUNCPath(environmentMainService.extensionsPath), // enable extension paths on UNC drives...
				environmentMainService.codeCachePath,							 // ...other user-data-derived paths should already be enlisted from `main.js`
				environmentMainService.logsHome.with({ scheme: Schemas.file }).fsPath,
				userDataProfilesMainService.defaultProfile.globalStorageHome.with({ scheme: Schemas.file }).fsPath,
				environmentMainService.workspaceStorageHome.with({ scheme: Schemas.file }).fsPath,
				environmentMainService.localHistoryHome.with({ scheme: Schemas.file }).fsPath,
				environmentMainService.backupHome
			].map(path => path ? promises.mkdir(path, { recursive: true }) : undefined)),

			// State service
			stateService.init(),

			// Configuration service
			configurationService.initialize()
		]);

		// Initialize user data profiles after initializing the state
		userDataProfilesMainService.init();
	}

	private allowWindowsUNCPath(path: string): string {
		if (isWindows) {
			const host = getUNCHost(path);
			if (host) {
				addUNCHostToAllowlist(host);
			}
		}

		return path;
	}

	private async claimInstance(logService: ILogService, environmentMainService: IEnvironmentMainService, lifecycleMainService: ILifecycleMainService, instantiationService: IInstantiationService, productService: IProductService, retry: boolean): Promise<NodeIPCServer> {

		// Try to setup a server for running. If that succeeds it means
		// we are the first instance to startup. Otherwise it is likely
		// that another instance is already running.
		let mainProcessNodeIpcServer: NodeIPCServer;
		try {
			mark('code/willStartMainServer');
			mainProcessNodeIpcServer = await nodeIPCServe(environmentMainService.mainIPCHandle);
			mark('code/didStartMainServer');
			Event.once(lifecycleMainService.onWillShutdown)(() => mainProcessNodeIpcServer.dispose());
		} catch (error) {

			// Handle unexpected errors (the only expected error is EADDRINUSE that
			// indicates another instance of VS Code is running)
			if (error.code !== 'EADDRINUSE') {

				// Show a dialog for errors that can be resolved by the user
				this.handleStartupDataDirError(environmentMainService, productService, error);

				// Any other runtime error is just printed to the console
				throw error;
			}

			// there's a running instance, let's connect to it
			let client: NodeIPCClient<string>;
			try {
				client = await nodeIPCConnect(environmentMainService.mainIPCHandle, 'main');
			} catch (error) {

				// Handle unexpected connection errors by showing a dialog to the user
				if (!retry || isWindows || error.code !== 'ECONNREFUSED') {
					if (error.code === 'EPERM') {
						this.showStartupWarningDialog(
							localize('secondInstanceAdmin', "Another instance of {0} is already running as administrator.", productService.nameShort),
							localize('secondInstanceAdminDetail', "Please close the other instance and try again."),
							productService
						);
					}

					throw error;
				}

				// it happens on Linux and OS X that the pipe is left behind
				// let's delete it, since we can't connect to it and then
				// retry the whole thing
				try {
					unlinkSync(environmentMainService.mainIPCHandle);
				} catch (error) {
					logService.warn('Could not delete obsolete instance handle', error);

					throw error;
				}

				return this.claimInstance(logService, environmentMainService, lifecycleMainService, instantiationService, productService, false);
			}

			// Tests from CLI require to be the only instance currently
			if (environmentMainService.extensionTestsLocationURI && !environmentMainService.debugExtensionHost.break) {
				const msg = `Running extension tests from the command line is currently only supported if no other instance of ${productService.nameShort} is running.`;
				logService.error(msg);
				client.dispose();

				throw new Error(msg);
			}

			// Show a warning dialog after some timeout if it takes long to talk to the other instance
			// Skip this if we are running with --wait where it is expected that we wait for a while.
			// Also skip when gathering diagnostics (--status) which can take a longer time.
			let startupWarningDialogHandle: Timeout | undefined = undefined;
			if (!environmentMainService.args.wait && !environmentMainService.args.status) {
				startupWarningDialogHandle = setTimeout(() => {
					this.showStartupWarningDialog(
						localize('secondInstanceNoResponse', "Another instance of {0} is running but not responding", productService.nameShort),
						localize('secondInstanceNoResponseDetail', "Please close all other instances and try again."),
						productService
					);
				}, 10000);
			}

			const otherInstanceLaunchMainService = ProxyChannel.toService<ILaunchMainService>(client.getChannel('launch'), { disableMarshalling: true });
			const otherInstanceDiagnosticsMainService = ProxyChannel.toService<IDiagnosticsMainService>(client.getChannel('diagnostics'), { disableMarshalling: true });

			// Process Info
			if (environmentMainService.args.status) {
				return instantiationService.invokeFunction(async () => {
					const diagnosticsService = new DiagnosticsService(NullTelemetryService, productService);
					const mainDiagnostics = await otherInstanceDiagnosticsMainService.getMainDiagnostics();
					const remoteDiagnostics = await otherInstanceDiagnosticsMainService.getRemoteDiagnostics({ includeProcesses: true, includeWorkspaceMetadata: true });
					const diagnostics = await diagnosticsService.getDiagnostics(mainDiagnostics, remoteDiagnostics);
					console.log(diagnostics);

					throw new ExpectedError();
				});
			}

			// Windows: allow to set foreground
			if (isWindows) {
				await this.windowsAllowSetForegroundWindow(otherInstanceLaunchMainService, logService);
			}

			// Send environment over...
			logService.trace('Sending env to running instance...');
			await otherInstanceLaunchMainService.start(environmentMainService.args, process.env as IProcessEnvironment);

			// Cleanup
			client.dispose();

			// Now that we started, make sure the warning dialog is prevented
			if (startupWarningDialogHandle) {
				clearTimeout(startupWarningDialogHandle);
			}

			throw new ExpectedError('Sent env to running instance. Terminating...');
		}

		// Print --status usage info
		if (environmentMainService.args.status) {
			console.log(localize('statusWarning', "Warning: The --status argument can only be used if {0} is already running. Please run it again after {0} has started.", productService.nameShort));

			throw new ExpectedError('Terminating...');
		}

		// Set the VSCODE_PID variable here when we are sure we are the first
		// instance to startup. Otherwise we would wrongly overwrite the PID
		process.env['VSCODE_PID'] = String(process.pid);

		return mainProcessNodeIpcServer;
	}

	private handleStartupDataDirError(environmentMainService: IEnvironmentMainService, productService: IProductService, error: NodeJS.ErrnoException): void {
		if (error.code === 'EACCES' || error.code === 'EPERM') {
			const directories = coalesce([environmentMainService.userDataPath, environmentMainService.extensionsPath, XDG_RUNTIME_DIR]).map(folder => getPathLabel(URI.file(folder), { os: OS, tildify: environmentMainService }));

			this.showStartupWarningDialog(
				localize('startupDataDirError', "Unable to write program user data."),
				localize('startupUserDataAndExtensionsDirErrorDetail', "{0}\n\nPlease make sure the following directories are writeable:\n\n{1}", toErrorMessage(error), directories.join('\n')),
				productService
			);
		}
	}

	private showStartupWarningDialog(message: string, detail: string, productService: IProductService): void {

		// use sync variant here because we likely exit after this method
		// due to startup issues and otherwise the dialog seems to disappear
		// https://github.com/microsoft/vscode/issues/104493

		dialog.showMessageBoxSync(massageMessageBoxOptions({
			type: 'warning',
			buttons: [localize({ key: 'close', comment: ['&& denotes a mnemonic'] }, "&&Close")],
			message,
			detail
		}, productService).options);
	}

	private async windowsAllowSetForegroundWindow(launchMainService: ILaunchMainService, logService: ILogService): Promise<void> {
		if (isWindows) {
			const processId = await launchMainService.getMainProcessId();

			logService.trace('Sending some foreground love to the running instance:', processId);

			try {
				(await import('windows-foreground-love')).allowSetForegroundWindow(processId);
			} catch (error) {
				logService.error(error);
			}
		}
	}

	private quit(accessor: ServicesAccessor, reason?: ExpectedError | Error): void {
		const logService = accessor.get(ILogService);
		const lifecycleMainService = accessor.get(ILifecycleMainService);

		let exitCode = 0;

		if (reason) {
			if ((reason as ExpectedError).isExpected) {
				if (reason.message) {
					logService.trace(reason.message);
				}
			} else {
				exitCode = 1; // signal error to the outside

				if (reason.stack) {
					logService.error(reason.stack);
				} else {
					logService.error(`Startup error: ${reason.toString()}`);
				}
			}
		}

		lifecycleMainService.kill(exitCode);
	}

	private async checkInnoSetupMutex(productService: IProductService): Promise<boolean> {
		if (!isWindows || !productService.win32MutexName || productService.quality !== 'insider') {
			return false;
		}

		try {
			const readyMutexName = `${productService.win32MutexName}setup`;
			const mutex = await import('@vscode/windows-mutex');
			return mutex.isActive(readyMutexName);
		} catch (error) {
			console.error('Failed to check Inno Setup mutex:', error);
			return false;
		}
	}

	//#region Command line arguments utilities

	private resolveArgs(): NativeParsedArgs {

		// Parse arguments
		const args = this.validatePaths(parseMainProcessArgv(process.argv));

		if (args.wait && !args.waitMarkerFilePath) {
			// If we are started with --wait create a random temporary file
			// and pass it over to the starting instance. We can use this file
			// to wait for it to be deleted to monitor that the edited file
			// is closed and then exit the waiting process.
			//
			// Note: we are not doing this if the wait marker has been already
			// added as argument. This can happen if VS Code was started from CLI.
			const waitMarkerFilePath = createWaitMarkerFileSync(args.verbose);
			if (waitMarkerFilePath) {
				addArg(process.argv, '--waitMarkerFilePath', waitMarkerFilePath);
				args.waitMarkerFilePath = waitMarkerFilePath;
			}
		}

		if (args.chat) {
			if (args.chat['new-window']) {
				// Apply `--new-window` flag to the main arguments
				args['new-window'] = true;
			} else if (args.chat['reuse-window']) {
				// Apply `--reuse-window` flag to the main arguments
				args['reuse-window'] = true;
			} else if (args.chat['profile']) {
				// Apply `--profile` flag to the main arguments
				args['profile'] = args.chat['profile'];
			} else {
				// Unless we are started with specific instructions about
				// new windows or reusing existing ones, always take the
				// current working directory as workspace to open.
				args._ = [cwd()];
			}
		}

		return args;
	}

	private validatePaths(args: NativeParsedArgs): NativeParsedArgs {

		// Track URLs if they're going to be used
		if (args['open-url']) {
			args._urls = args._;
			args._ = [];
		}

		// Normalize paths and watch out for goto line mode
		if (!args['remote']) {
			const paths = this.doValidatePaths(args._, args.goto);
			args._ = paths;
		}

		return args;
	}

	private doValidatePaths(args: string[], gotoLineMode?: boolean): string[] {
		const currentWorkingDir = cwd();
		const result = args.map(arg => {
			let pathCandidate = String(arg);

			let parsedPath: IPathWithLineAndColumn | undefined = undefined;
			if (gotoLineMode) {
				parsedPath = parseLineAndColumnAware(pathCandidate);
				pathCandidate = parsedPath.path;
			}

			if (pathCandidate) {
				pathCandidate = this.preparePath(currentWorkingDir, pathCandidate);
			}

			const sanitizedFilePath = sanitizeFilePath(pathCandidate, currentWorkingDir);

			const filePathBasename = basename(sanitizedFilePath);
			if (filePathBasename /* can be empty if code is opened on root */ && !isValidBasename(filePathBasename)) {
				return null; // do not allow invalid file names
			}

			if (gotoLineMode && parsedPath) {
				parsedPath.path = sanitizedFilePath;

				return this.toPath(parsedPath);
			}

			return sanitizedFilePath;
		});

		const caseInsensitive = isWindows || isMacintosh;
		const distinctPaths = distinct(result, path => path && caseInsensitive ? path.toLowerCase() : (path || ''));

		return coalesce(distinctPaths);
	}

	private preparePath(cwd: string, path: string): string {

		// Trim trailing quotes
		if (isWindows) {
			path = rtrim(path, '"'); // https://github.com/microsoft/vscode/issues/1498
		}

		// Trim whitespaces
		path = trim(trim(path, ' '), '\t');

		if (isWindows) {

			// Resolve the path against cwd if it is relative
			path = resolve(cwd, path);

			// Trim trailing '.' chars on Windows to prevent invalid file names
			path = rtrim(path, '.');
		}

		return path;
	}

	private toPath(pathWithLineAndCol: IPathWithLineAndColumn): string {
		const segments = [pathWithLineAndCol.path];

		if (typeof pathWithLineAndCol.line === 'number') {
			segments.push(String(pathWithLineAndCol.line));
		}

		if (typeof pathWithLineAndCol.column === 'number') {
			segments.push(String(pathWithLineAndCol.column));
		}

		return segments.join(':');
	}

	//#endregion
}

// Main Startup
const code = new CodeMain();
code.main();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/code/electron-utility/sharedProcess/sharedProcessMain.ts]---
Location: vscode-main/src/vs/code/electron-utility/sharedProcess/sharedProcessMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { hostname, release } from 'os';
import { MessagePortMain, MessageEvent } from '../../../base/parts/sandbox/node/electronTypes.js';
import { toErrorMessage } from '../../../base/common/errorMessage.js';
import { onUnexpectedError, setUnexpectedErrorHandler } from '../../../base/common/errors.js';
import { combinedDisposable, Disposable, toDisposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';
import { Emitter } from '../../../base/common/event.js';
import { ProxyChannel, StaticRouter } from '../../../base/parts/ipc/common/ipc.js';
import { IClientConnectionFilter, Server as UtilityProcessMessagePortServer, once } from '../../../base/parts/ipc/node/ipc.mp.js';
import { CodeCacheCleaner } from './contrib/codeCacheCleaner.js';
import { LanguagePackCachedDataCleaner } from './contrib/languagePackCachedDataCleaner.js';
import { LocalizationsUpdater } from './contrib/localizationsUpdater.js';
import { LogsDataCleaner } from './contrib/logsDataCleaner.js';
import { UnusedWorkspaceStorageDataCleaner } from './contrib/storageDataCleaner.js';
import { IChecksumService } from '../../../platform/checksum/common/checksumService.js';
import { ChecksumService } from '../../../platform/checksum/node/checksumService.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { ConfigurationService } from '../../../platform/configuration/common/configurationService.js';
import { IDiagnosticsService } from '../../../platform/diagnostics/common/diagnostics.js';
import { DiagnosticsService } from '../../../platform/diagnostics/node/diagnosticsService.js';
import { IDownloadService } from '../../../platform/download/common/download.js';
import { DownloadService } from '../../../platform/download/common/downloadService.js';
import { INativeEnvironmentService } from '../../../platform/environment/common/environment.js';
import { GlobalExtensionEnablementService } from '../../../platform/extensionManagement/common/extensionEnablementService.js';
import { ExtensionGalleryService } from '../../../platform/extensionManagement/common/extensionGalleryService.js';
import { IAllowedExtensionsService, IExtensionGalleryService, IExtensionManagementService, IExtensionTipsService, IGlobalExtensionEnablementService } from '../../../platform/extensionManagement/common/extensionManagement.js';
import { ExtensionSignatureVerificationService, IExtensionSignatureVerificationService } from '../../../platform/extensionManagement/node/extensionSignatureVerificationService.js';
import { ExtensionManagementChannel, ExtensionTipsChannel } from '../../../platform/extensionManagement/common/extensionManagementIpc.js';
import { ExtensionManagementService, INativeServerExtensionManagementService } from '../../../platform/extensionManagement/node/extensionManagementService.js';
import { IExtensionRecommendationNotificationService } from '../../../platform/extensionRecommendations/common/extensionRecommendations.js';
import { IFileService } from '../../../platform/files/common/files.js';
import { FileService } from '../../../platform/files/common/fileService.js';
import { DiskFileSystemProvider } from '../../../platform/files/node/diskFileSystemProvider.js';
import { SyncDescriptor } from '../../../platform/instantiation/common/descriptors.js';
import { IInstantiationService, ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { InstantiationService } from '../../../platform/instantiation/common/instantiationService.js';
import { ServiceCollection } from '../../../platform/instantiation/common/serviceCollection.js';
import { ILanguagePackService } from '../../../platform/languagePacks/common/languagePacks.js';
import { NativeLanguagePackService } from '../../../platform/languagePacks/node/languagePacks.js';
import { ConsoleLogger, ILoggerService, ILogService, LoggerGroup } from '../../../platform/log/common/log.js';
import { LoggerChannelClient } from '../../../platform/log/common/logIpc.js';
import product from '../../../platform/product/common/product.js';
import { IProductService } from '../../../platform/product/common/productService.js';
import { IRequestService } from '../../../platform/request/common/request.js';
import { ISharedProcessConfiguration } from '../../../platform/sharedProcess/node/sharedProcess.js';
import { IStorageService } from '../../../platform/storage/common/storage.js';
import { resolveCommonProperties } from '../../../platform/telemetry/common/commonProperties.js';
import { ICustomEndpointTelemetryService, ITelemetryService } from '../../../platform/telemetry/common/telemetry.js';
import { TelemetryAppenderChannel } from '../../../platform/telemetry/common/telemetryIpc.js';
import { TelemetryLogAppender } from '../../../platform/telemetry/common/telemetryLogAppender.js';
import { TelemetryService } from '../../../platform/telemetry/common/telemetryService.js';
import { supportsTelemetry, ITelemetryAppender, NullAppender, NullTelemetryService, getPiiPathsFromEnvironment, isInternalTelemetry, isLoggingOnly } from '../../../platform/telemetry/common/telemetryUtils.js';
import { CustomEndpointTelemetryService } from '../../../platform/telemetry/node/customEndpointTelemetryService.js';
import { ExtensionStorageService, IExtensionStorageService } from '../../../platform/extensionManagement/common/extensionStorage.js';
import { IgnoredExtensionsManagementService, IIgnoredExtensionsManagementService } from '../../../platform/userDataSync/common/ignoredExtensions.js';
import { IUserDataSyncLocalStoreService, IUserDataSyncLogService, IUserDataSyncEnablementService, IUserDataSyncService, IUserDataSyncStoreManagementService, IUserDataSyncStoreService, IUserDataSyncUtilService, registerConfiguration as registerUserDataSyncConfiguration, IUserDataSyncResourceProviderService } from '../../../platform/userDataSync/common/userDataSync.js';
import { IUserDataSyncAccountService, UserDataSyncAccountService } from '../../../platform/userDataSync/common/userDataSyncAccount.js';
import { UserDataSyncLocalStoreService } from '../../../platform/userDataSync/common/userDataSyncLocalStoreService.js';
import { UserDataSyncAccountServiceChannel, UserDataSyncStoreManagementServiceChannel } from '../../../platform/userDataSync/common/userDataSyncIpc.js';
import { UserDataSyncLogService } from '../../../platform/userDataSync/common/userDataSyncLog.js';
import { IUserDataSyncMachinesService, UserDataSyncMachinesService } from '../../../platform/userDataSync/common/userDataSyncMachines.js';
import { UserDataSyncEnablementService } from '../../../platform/userDataSync/common/userDataSyncEnablementService.js';
import { UserDataSyncService } from '../../../platform/userDataSync/common/userDataSyncService.js';
import { UserDataSyncServiceChannel } from '../../../platform/userDataSync/common/userDataSyncServiceIpc.js';
import { UserDataSyncStoreManagementService, UserDataSyncStoreService } from '../../../platform/userDataSync/common/userDataSyncStoreService.js';
import { IUserDataProfileStorageService } from '../../../platform/userDataProfile/common/userDataProfileStorageService.js';
import { SharedProcessUserDataProfileStorageService } from '../../../platform/userDataProfile/node/userDataProfileStorageService.js';
import { ActiveWindowManager } from '../../../platform/windows/node/windowTracker.js';
import { ISignService } from '../../../platform/sign/common/sign.js';
import { SignService } from '../../../platform/sign/node/signService.js';
import { ISharedTunnelsService } from '../../../platform/tunnel/common/tunnel.js';
import { SharedTunnelsService } from '../../../platform/tunnel/node/tunnelService.js';
import { ipcSharedProcessTunnelChannelName, ISharedProcessTunnelService } from '../../../platform/remote/common/sharedProcessTunnelService.js';
import { SharedProcessTunnelService } from '../../../platform/tunnel/node/sharedProcessTunnelService.js';
import { IUriIdentityService } from '../../../platform/uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../../platform/uriIdentity/common/uriIdentityService.js';
import { isLinux } from '../../../base/common/platform.js';
import { FileUserDataProvider } from '../../../platform/userData/common/fileUserDataProvider.js';
import { DiskFileSystemProviderClient, LOCAL_FILE_SYSTEM_CHANNEL_NAME } from '../../../platform/files/common/diskFileSystemProviderClient.js';
import { InspectProfilingService as V8InspectProfilingService } from '../../../platform/profiling/node/profilingService.js';
import { IV8InspectProfilingService } from '../../../platform/profiling/common/profiling.js';
import { IExtensionsScannerService } from '../../../platform/extensionManagement/common/extensionsScannerService.js';
import { ExtensionsScannerService } from '../../../platform/extensionManagement/node/extensionsScannerService.js';
import { IUserDataProfilesService } from '../../../platform/userDataProfile/common/userDataProfile.js';
import { IExtensionsProfileScannerService } from '../../../platform/extensionManagement/common/extensionsProfileScannerService.js';
import { PolicyChannelClient } from '../../../platform/policy/common/policyIpc.js';
import { IPolicyService, NullPolicyService } from '../../../platform/policy/common/policy.js';
import { UserDataProfilesService } from '../../../platform/userDataProfile/common/userDataProfileIpc.js';
import { OneDataSystemAppender } from '../../../platform/telemetry/node/1dsAppender.js';
import { UserDataProfilesCleaner } from './contrib/userDataProfilesCleaner.js';
import { IRemoteTunnelService } from '../../../platform/remoteTunnel/common/remoteTunnel.js';
import { UserDataSyncResourceProviderService } from '../../../platform/userDataSync/common/userDataSyncResourceProvider.js';
import { ExtensionsContributions } from './contrib/extensions.js';
import { localize } from '../../../nls.js';
import { LogService } from '../../../platform/log/common/logService.js';
import { ISharedProcessLifecycleService, SharedProcessLifecycleService } from '../../../platform/lifecycle/node/sharedProcessLifecycleService.js';
import { RemoteTunnelService } from '../../../platform/remoteTunnel/node/remoteTunnelService.js';
import { ExtensionsProfileScannerService } from '../../../platform/extensionManagement/node/extensionsProfileScannerService.js';
import { ExtensionRecommendationNotificationServiceChannelClient } from '../../../platform/extensionRecommendations/common/extensionRecommendationsIpc.js';
import { INativeHostService } from '../../../platform/native/common/native.js';
import { NativeHostService } from '../../../platform/native/common/nativeHostService.js';
import { UserDataAutoSyncService } from '../../../platform/userDataSync/node/userDataAutoSyncService.js';
import { ExtensionTipsService } from '../../../platform/extensionManagement/node/extensionTipsService.js';
import { IMainProcessService, MainProcessService } from '../../../platform/ipc/common/mainProcessService.js';
import { RemoteStorageService } from '../../../platform/storage/common/storageService.js';
import { IRemoteSocketFactoryService, RemoteSocketFactoryService } from '../../../platform/remote/common/remoteSocketFactoryService.js';
import { RemoteConnectionType } from '../../../platform/remote/common/remoteAuthorityResolver.js';
import { nodeSocketFactory } from '../../../platform/remote/node/nodeSocketFactory.js';
import { NativeEnvironmentService } from '../../../platform/environment/node/environmentService.js';
import { SharedProcessRawConnection, SharedProcessLifecycle } from '../../../platform/sharedProcess/common/sharedProcess.js';
import { getOSReleaseInfo } from '../../../base/node/osReleaseInfo.js';
import { getDesktopEnvironment } from '../../../base/common/desktopEnvironmentInfo.js';
import { getCodeDisplayProtocol, getDisplayProtocol } from '../../../base/node/osDisplayProtocolInfo.js';
import { RequestService } from '../../../platform/request/electron-utility/requestService.js';
import { DefaultExtensionsInitializer } from './contrib/defaultExtensionsInitializer.js';
import { AllowedExtensionsService } from '../../../platform/extensionManagement/common/allowedExtensionsService.js';
import { IExtensionGalleryManifestService } from '../../../platform/extensionManagement/common/extensionGalleryManifest.js';
import { ExtensionGalleryManifestIPCService } from '../../../platform/extensionManagement/common/extensionGalleryManifestServiceIpc.js';
import { ISharedWebContentExtractorService } from '../../../platform/webContentExtractor/common/webContentExtractor.js';
import { SharedWebContentExtractorService } from '../../../platform/webContentExtractor/node/sharedWebContentExtractorService.js';
import { McpManagementService } from '../../../platform/mcp/node/mcpManagementService.js';
import { IAllowedMcpServersService, IMcpGalleryService, IMcpManagementService } from '../../../platform/mcp/common/mcpManagement.js';
import { IMcpResourceScannerService, McpResourceScannerService } from '../../../platform/mcp/common/mcpResourceScannerService.js';
import { McpGalleryService } from '../../../platform/mcp/common/mcpGalleryService.js';
import { McpManagementChannel } from '../../../platform/mcp/common/mcpManagementIpc.js';
import { AllowedMcpServersService } from '../../../platform/mcp/common/allowedMcpServersService.js';
import { IMcpGalleryManifestService } from '../../../platform/mcp/common/mcpGalleryManifest.js';
import { McpGalleryManifestIPCService } from '../../../platform/mcp/common/mcpGalleryManifestServiceIpc.js';

class SharedProcessMain extends Disposable implements IClientConnectionFilter {

	private readonly server = this._register(new UtilityProcessMessagePortServer(this));

	private lifecycleService: SharedProcessLifecycleService | undefined = undefined;

	private readonly onDidWindowConnectRaw = this._register(new Emitter<MessagePortMain>());

	constructor(private configuration: ISharedProcessConfiguration) {
		super();

		this.registerListeners();
	}

	private registerListeners(): void {

		// Shared process lifecycle
		let didExit = false;
		const onExit = () => {
			if (!didExit) {
				didExit = true;

				this.lifecycleService?.fireOnWillShutdown();
				this.dispose();
			}
		};
		process.once('exit', onExit);
		once(process.parentPort, SharedProcessLifecycle.exit, onExit);
	}

	async init(): Promise<void> {

		// Services
		const instantiationService = await this.initServices();

		// Config
		registerUserDataSyncConfiguration();

		instantiationService.invokeFunction(accessor => {
			const logService = accessor.get(ILogService);
			const telemetryService = accessor.get(ITelemetryService);

			// Log info
			logService.trace('sharedProcess configuration', JSON.stringify(this.configuration));

			// Channels
			this.initChannels(accessor);

			// Error handler
			this.registerErrorHandler(logService);

			// Report Client OS/DE Info
			this.reportClientOSInfo(telemetryService, logService);
		});

		// Instantiate Contributions
		this._register(combinedDisposable(
			instantiationService.createInstance(CodeCacheCleaner, this.configuration.codeCachePath),
			instantiationService.createInstance(LanguagePackCachedDataCleaner),
			instantiationService.createInstance(UnusedWorkspaceStorageDataCleaner),
			instantiationService.createInstance(LogsDataCleaner),
			instantiationService.createInstance(LocalizationsUpdater),
			instantiationService.createInstance(ExtensionsContributions),
			instantiationService.createInstance(UserDataProfilesCleaner),
			instantiationService.createInstance(DefaultExtensionsInitializer)
		));
	}

	private async initServices(): Promise<IInstantiationService> {
		const services = new ServiceCollection();

		// Product
		const productService = { _serviceBrand: undefined, ...product };
		services.set(IProductService, productService);

		// Main Process
		const mainRouter = new StaticRouter(ctx => ctx === 'main');
		const mainProcessService = new MainProcessService(this.server, mainRouter);
		services.set(IMainProcessService, mainProcessService);

		// Policies
		const policyService = this.configuration.policiesData ? new PolicyChannelClient(this.configuration.policiesData, mainProcessService.getChannel('policy')) : new NullPolicyService();
		services.set(IPolicyService, policyService);

		// Environment
		const environmentService = new NativeEnvironmentService(this.configuration.args, productService);
		services.set(INativeEnvironmentService, environmentService);

		// Logger
		const loggerService = new LoggerChannelClient(undefined, this.configuration.logLevel, environmentService.logsHome, this.configuration.loggers.map(loggerResource => ({ ...loggerResource, resource: URI.revive(loggerResource.resource) })), mainProcessService.getChannel('logger'));
		services.set(ILoggerService, loggerService);

		// Log
		const sharedLogGroup: LoggerGroup = { id: 'shared', name: localize('sharedLog', "Shared") };
		const logger = this._register(loggerService.createLogger('sharedprocess', { name: localize('sharedLog', "Shared"), group: sharedLogGroup }));
		const consoleLogger = this._register(new ConsoleLogger(logger.getLevel()));
		const logService = this._register(new LogService(logger, [consoleLogger]));
		services.set(ILogService, logService);

		// Lifecycle
		this.lifecycleService = this._register(new SharedProcessLifecycleService(logService));
		services.set(ISharedProcessLifecycleService, this.lifecycleService);

		// Files
		const fileService = this._register(new FileService(logService));
		services.set(IFileService, fileService);

		const diskFileSystemProvider = this._register(new DiskFileSystemProvider(logService));
		fileService.registerProvider(Schemas.file, diskFileSystemProvider);

		// URI Identity
		const uriIdentityService = new UriIdentityService(fileService);
		services.set(IUriIdentityService, uriIdentityService);

		// User Data Profiles
		const userDataProfilesService = this._register(new UserDataProfilesService(this.configuration.profiles.all, URI.revive(this.configuration.profiles.home).with({ scheme: environmentService.userRoamingDataHome.scheme }), mainProcessService.getChannel('userDataProfiles')));
		services.set(IUserDataProfilesService, userDataProfilesService);

		const userDataFileSystemProvider = this._register(new FileUserDataProvider(
			Schemas.file,
			// Specifically for user data, use the disk file system provider
			// from the main process to enable atomic read/write operations.
			// Since user data can change very frequently across multiple
			// processes, we want a single process handling these operations.
			this._register(new DiskFileSystemProviderClient(mainProcessService.getChannel(LOCAL_FILE_SYSTEM_CHANNEL_NAME), { pathCaseSensitive: isLinux })),
			Schemas.vscodeUserData,
			userDataProfilesService,
			uriIdentityService,
			logService
		));
		fileService.registerProvider(Schemas.vscodeUserData, userDataFileSystemProvider);

		// Configuration
		const configurationService = this._register(new ConfigurationService(userDataProfilesService.defaultProfile.settingsResource, fileService, policyService, logService));
		services.set(IConfigurationService, configurationService);

		// Storage (global access only)
		const storageService = new RemoteStorageService(undefined, { defaultProfile: userDataProfilesService.defaultProfile, currentProfile: userDataProfilesService.defaultProfile }, mainProcessService, environmentService);
		services.set(IStorageService, storageService);
		this._register(toDisposable(() => storageService.flush()));

		// Initialize config & storage in parallel
		await Promise.all([
			configurationService.initialize(),
			storageService.initialize()
		]);

		// Request
		const networkLogger = this._register(loggerService.createLogger(`network-shared`, { name: localize('networkk', "Network"), group: sharedLogGroup }));
		const requestService = new RequestService(configurationService, environmentService, this._register(new LogService(networkLogger)));
		services.set(IRequestService, requestService);

		// Checksum
		services.set(IChecksumService, new SyncDescriptor(ChecksumService, undefined, false /* proxied to other processes */));

		// V8 Inspect profiler
		services.set(IV8InspectProfilingService, new SyncDescriptor(V8InspectProfilingService, undefined, false /* proxied to other processes */));

		// Native Host
		const nativeHostService = new NativeHostService(-1 /* we are not running in a browser window context */, mainProcessService) as INativeHostService;
		services.set(INativeHostService, nativeHostService);

		// Download
		services.set(IDownloadService, new SyncDescriptor(DownloadService, undefined, true));

		// Extension recommendations
		const activeWindowManager = this._register(new ActiveWindowManager(nativeHostService));
		const activeWindowRouter = new StaticRouter(ctx => activeWindowManager.getActiveClientId().then(id => ctx === id));
		services.set(IExtensionRecommendationNotificationService, new ExtensionRecommendationNotificationServiceChannelClient(this.server.getChannel('extensionRecommendationNotification', activeWindowRouter)));

		// Telemetry
		let telemetryService: ITelemetryService;
		const appenders: ITelemetryAppender[] = [];
		const internalTelemetry = isInternalTelemetry(productService, configurationService);
		if (supportsTelemetry(productService, environmentService)) {
			const logAppender = new TelemetryLogAppender('', false, loggerService, environmentService, productService);
			appenders.push(logAppender);
			if (!isLoggingOnly(productService, environmentService) && productService.aiConfig?.ariaKey) {
				const collectorAppender = new OneDataSystemAppender(requestService, internalTelemetry, 'monacoworkbench', null, productService.aiConfig.ariaKey);
				this._register(toDisposable(() => collectorAppender.flush())); // Ensure the 1DS appender is disposed so that it flushes remaining data
				appenders.push(collectorAppender);
			}

			telemetryService = new TelemetryService({
				appenders,
				commonProperties: resolveCommonProperties(release(), hostname(), process.arch, productService.commit, productService.version, this.configuration.machineId, this.configuration.sqmId, this.configuration.devDeviceId, internalTelemetry, productService.date),
				sendErrorTelemetry: true,
				piiPaths: getPiiPathsFromEnvironment(environmentService),
			}, configurationService, productService);
		} else {
			telemetryService = NullTelemetryService;
			const nullAppender = NullAppender;
			appenders.push(nullAppender);
		}

		this.server.registerChannel('telemetryAppender', new TelemetryAppenderChannel(appenders));
		services.set(ITelemetryService, telemetryService);

		// Custom Endpoint Telemetry
		const customEndpointTelemetryService = new CustomEndpointTelemetryService(configurationService, telemetryService, loggerService, environmentService, productService);
		services.set(ICustomEndpointTelemetryService, customEndpointTelemetryService);

		// Extension Management
		services.set(IExtensionsProfileScannerService, new SyncDescriptor(ExtensionsProfileScannerService, undefined, true));
		services.set(IExtensionsScannerService, new SyncDescriptor(ExtensionsScannerService, undefined, true));
		services.set(IExtensionSignatureVerificationService, new SyncDescriptor(ExtensionSignatureVerificationService, undefined, true));
		services.set(IAllowedExtensionsService, new SyncDescriptor(AllowedExtensionsService, undefined, true));
		services.set(INativeServerExtensionManagementService, new SyncDescriptor(ExtensionManagementService, undefined, true));

		// MCP Management
		services.set(IAllowedMcpServersService, new SyncDescriptor(AllowedMcpServersService, undefined, true));
		services.set(IMcpGalleryManifestService, new McpGalleryManifestIPCService(this.server));
		services.set(IMcpGalleryService, new SyncDescriptor(McpGalleryService, undefined, true));
		services.set(IMcpResourceScannerService, new SyncDescriptor(McpResourceScannerService, undefined, true));
		services.set(IMcpManagementService, new SyncDescriptor(McpManagementService, undefined, true));

		// Extension Gallery
		services.set(IExtensionGalleryManifestService, new ExtensionGalleryManifestIPCService(this.server, productService));
		services.set(IExtensionGalleryService, new SyncDescriptor(ExtensionGalleryService, undefined, true));

		// Extension Tips
		services.set(IExtensionTipsService, new SyncDescriptor(ExtensionTipsService, undefined, false /* Eagerly scans and computes exe based recommendations */));

		// Localizations
		services.set(ILanguagePackService, new SyncDescriptor(NativeLanguagePackService, undefined, false /* proxied to other processes */));

		// Diagnostics
		services.set(IDiagnosticsService, new SyncDescriptor(DiagnosticsService, undefined, false /* proxied to other processes */));

		// Settings Sync
		services.set(IUserDataSyncAccountService, new SyncDescriptor(UserDataSyncAccountService, undefined, true));
		services.set(IUserDataSyncLogService, new SyncDescriptor(UserDataSyncLogService, undefined, true));
		services.set(IUserDataSyncUtilService, ProxyChannel.toService(this.server.getChannel('userDataSyncUtil', client => client.ctx !== 'main')));
		services.set(IGlobalExtensionEnablementService, new SyncDescriptor(GlobalExtensionEnablementService, undefined, false /* Eagerly resets installed extensions */));
		services.set(IIgnoredExtensionsManagementService, new SyncDescriptor(IgnoredExtensionsManagementService, undefined, true));
		services.set(IExtensionStorageService, new SyncDescriptor(ExtensionStorageService));
		services.set(IUserDataSyncStoreManagementService, new SyncDescriptor(UserDataSyncStoreManagementService, undefined, true));
		services.set(IUserDataSyncStoreService, new SyncDescriptor(UserDataSyncStoreService, undefined, true));
		services.set(IUserDataSyncMachinesService, new SyncDescriptor(UserDataSyncMachinesService, undefined, true));
		services.set(IUserDataSyncLocalStoreService, new SyncDescriptor(UserDataSyncLocalStoreService, undefined, false /* Eagerly cleans up old backups */));
		services.set(IUserDataSyncEnablementService, new SyncDescriptor(UserDataSyncEnablementService, undefined, true));
		services.set(IUserDataSyncService, new SyncDescriptor(UserDataSyncService, undefined, false /* Initializes the Sync State */));
		services.set(IUserDataProfileStorageService, new SyncDescriptor(SharedProcessUserDataProfileStorageService, undefined, true));
		services.set(IUserDataSyncResourceProviderService, new SyncDescriptor(UserDataSyncResourceProviderService, undefined, true));

		// Signing
		services.set(ISignService, new SyncDescriptor(SignService, undefined, false /* proxied to other processes */));

		// Tunnel
		const remoteSocketFactoryService = new RemoteSocketFactoryService();
		services.set(IRemoteSocketFactoryService, remoteSocketFactoryService);
		remoteSocketFactoryService.register(RemoteConnectionType.WebSocket, nodeSocketFactory);
		services.set(ISharedTunnelsService, new SyncDescriptor(SharedTunnelsService));
		services.set(ISharedProcessTunnelService, new SyncDescriptor(SharedProcessTunnelService));

		// Remote Tunnel
		services.set(IRemoteTunnelService, new SyncDescriptor(RemoteTunnelService));

		// Web Content Extractor
		services.set(ISharedWebContentExtractorService, new SyncDescriptor(SharedWebContentExtractorService));

		return new InstantiationService(services);
	}

	private initChannels(accessor: ServicesAccessor): void {

		// Extensions Management
		const channel = new ExtensionManagementChannel(accessor.get(IExtensionManagementService), () => null);
		this.server.registerChannel('extensions', channel);

		// Mcp Management
		const mcpManagementChannel = new McpManagementChannel(accessor.get(IMcpManagementService), () => null);
		this.server.registerChannel('mcpManagement', mcpManagementChannel);

		// Language Packs
		const languagePacksChannel = ProxyChannel.fromService(accessor.get(ILanguagePackService), this._store);
		this.server.registerChannel('languagePacks', languagePacksChannel);

		// Diagnostics
		const diagnosticsChannel = ProxyChannel.fromService(accessor.get(IDiagnosticsService), this._store);
		this.server.registerChannel('diagnostics', diagnosticsChannel);

		// Extension Tips
		const extensionTipsChannel = new ExtensionTipsChannel(accessor.get(IExtensionTipsService));
		this.server.registerChannel('extensionTipsService', extensionTipsChannel);

		// Checksum
		const checksumChannel = ProxyChannel.fromService(accessor.get(IChecksumService), this._store);
		this.server.registerChannel('checksum', checksumChannel);

		// Profiling
		const profilingChannel = ProxyChannel.fromService(accessor.get(IV8InspectProfilingService), this._store);
		this.server.registerChannel('v8InspectProfiling', profilingChannel);

		// Settings Sync
		const userDataSyncMachineChannel = ProxyChannel.fromService(accessor.get(IUserDataSyncMachinesService), this._store);
		this.server.registerChannel('userDataSyncMachines', userDataSyncMachineChannel);

		// Custom Endpoint Telemetry
		const customEndpointTelemetryChannel = ProxyChannel.fromService(accessor.get(ICustomEndpointTelemetryService), this._store);
		this.server.registerChannel('customEndpointTelemetry', customEndpointTelemetryChannel);

		const userDataSyncAccountChannel = new UserDataSyncAccountServiceChannel(accessor.get(IUserDataSyncAccountService));
		this.server.registerChannel('userDataSyncAccount', userDataSyncAccountChannel);

		const userDataSyncStoreManagementChannel = new UserDataSyncStoreManagementServiceChannel(accessor.get(IUserDataSyncStoreManagementService));
		this.server.registerChannel('userDataSyncStoreManagement', userDataSyncStoreManagementChannel);

		const userDataSyncChannel = new UserDataSyncServiceChannel(accessor.get(IUserDataSyncService), accessor.get(IUserDataProfilesService), accessor.get(ILogService));
		this.server.registerChannel('userDataSync', userDataSyncChannel);

		const userDataAutoSync = this._register(accessor.get(IInstantiationService).createInstance(UserDataAutoSyncService));
		this.server.registerChannel('userDataAutoSync', ProxyChannel.fromService(userDataAutoSync, this._store));

		this.server.registerChannel('IUserDataSyncResourceProviderService', ProxyChannel.fromService(accessor.get(IUserDataSyncResourceProviderService), this._store));

		// Tunnel
		const sharedProcessTunnelChannel = ProxyChannel.fromService(accessor.get(ISharedProcessTunnelService), this._store);
		this.server.registerChannel(ipcSharedProcessTunnelChannelName, sharedProcessTunnelChannel);

		// Remote Tunnel
		const remoteTunnelChannel = ProxyChannel.fromService(accessor.get(IRemoteTunnelService), this._store);
		this.server.registerChannel('remoteTunnel', remoteTunnelChannel);

		// Web Content Extractor
		const webContentExtractorChannel = ProxyChannel.fromService(accessor.get(ISharedWebContentExtractorService), this._store);
		this.server.registerChannel('sharedWebContentExtractor', webContentExtractorChannel);
	}

	private registerErrorHandler(logService: ILogService): void {

		// Listen on global error events
		process.on('uncaughtException', error => onUnexpectedError(error));
		process.on('unhandledRejection', (reason: unknown) => onUnexpectedError(reason));

		// Install handler for unexpected errors
		setUnexpectedErrorHandler(error => {
			const message = toErrorMessage(error, true);
			if (!message) {
				return;
			}

			logService.error(`[uncaught exception in sharedProcess]: ${message}`);
		});
	}

	private async reportClientOSInfo(telemetryService: ITelemetryService, logService: ILogService): Promise<void> {
		if (isLinux) {
			const [releaseInfo, displayProtocol] = await Promise.all([
				getOSReleaseInfo(logService.error.bind(logService)),
				getDisplayProtocol(logService.error.bind(logService))
			]);
			const desktopEnvironment = getDesktopEnvironment();
			const codeSessionType = getCodeDisplayProtocol(displayProtocol, this.configuration.args['ozone-platform']);
			if (releaseInfo) {
				type ClientPlatformInfoClassification = {
					platformId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'A string identifying the operating system without any version information.' };
					platformVersionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'A string identifying the operating system version excluding any name information or release code.' };
					platformIdLike: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'A string identifying the operating system the current OS derivate is closely related to.' };
					desktopEnvironment: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'A string identifying the desktop environment the user is using.' };
					displayProtocol: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'A string identifying the users display protocol type.' };
					codeDisplayProtocol: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'A string identifying the vscode display protocol type.' };
					owner: 'benibenj';
					comment: 'Provides insight into the distro and desktop environment information on Linux.';
				};
				type ClientPlatformInfoEvent = {
					platformId: string;
					platformVersionId: string | undefined;
					platformIdLike: string | undefined;
					desktopEnvironment: string | undefined;
					displayProtocol: string | undefined;
					codeDisplayProtocol: string | undefined;
				};
				telemetryService.publicLog2<ClientPlatformInfoEvent, ClientPlatformInfoClassification>('clientPlatformInfo', {
					platformId: releaseInfo.id,
					platformVersionId: releaseInfo.version_id,
					platformIdLike: releaseInfo.id_like,
					desktopEnvironment: desktopEnvironment,
					displayProtocol: displayProtocol,
					codeDisplayProtocol: codeSessionType
				});
			}
		}
	}

	handledClientConnection(e: MessageEvent): boolean {

		// This filter on message port messages will look for
		// attempts of a window to connect raw to the shared
		// process to handle these connections separate from
		// our IPC based protocol.

		if (e.data !== SharedProcessRawConnection.response) {
			return false;
		}

		const port = e.ports.at(0);
		if (port) {
			this.onDidWindowConnectRaw.fire(port);

			return true;
		}

		return false;
	}
}

export async function main(configuration: ISharedProcessConfiguration): Promise<void> {

	// create shared process and signal back to main that we are
	// ready to accept message ports as client connections

	try {
		const sharedProcess = new SharedProcessMain(configuration);
		process.parentPort.postMessage(SharedProcessLifecycle.ipcReady);

		// await initialization and signal this back to electron-main
		await sharedProcess.init();

		process.parentPort.postMessage(SharedProcessLifecycle.initDone);
	} catch (error) {
		process.parentPort.postMessage({ error: error.toString() });
	}
}

const handle = setTimeout(() => {
	process.parentPort.postMessage({ warning: '[SharedProcess] did not receive configuration within 30s...' });
}, 30000);

process.parentPort.once('message', (e: Electron.MessageEvent) => {
	clearTimeout(handle);
	main(e.data as ISharedProcessConfiguration);
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/code/electron-utility/sharedProcess/contrib/codeCacheCleaner.ts]---
Location: vscode-main/src/vs/code/electron-utility/sharedProcess/contrib/codeCacheCleaner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { promises } from 'fs';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { basename, dirname, join } from '../../../../base/common/path.js';
import { Promises } from '../../../../base/node/pfs.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';

export class CodeCacheCleaner extends Disposable {

	private readonly dataMaxAge: number;

	constructor(
		currentCodeCachePath: string | undefined,
		@IProductService productService: IProductService,
		@ILogService private readonly logService: ILogService
	) {
		super();

		this.dataMaxAge = productService.quality !== 'stable'
			? 1000 * 60 * 60 * 24 * 7 		// roughly 1 week (insiders)
			: 1000 * 60 * 60 * 24 * 30 * 3; // roughly 3 months (stable)

		// Cached data is stored as user data and we run a cleanup task every time
		// the editor starts. The strategy is to delete all files that are older than
		// 3 months (1 week respectively)
		if (currentCodeCachePath) {
			const scheduler = this._register(new RunOnceScheduler(() => {
				this.cleanUpCodeCaches(currentCodeCachePath);
			}, 30 * 1000 /* after 30s */));
			scheduler.schedule();
		}
	}

	private async cleanUpCodeCaches(currentCodeCachePath: string): Promise<void> {
		this.logService.trace('[code cache cleanup]: Starting to clean up old code cache folders.');

		try {
			const now = Date.now();

			// The folder which contains folders of cached data.
			// Each of these folders is partioned per commit
			const codeCacheRootPath = dirname(currentCodeCachePath);
			const currentCodeCache = basename(currentCodeCachePath);

			const codeCaches = await Promises.readdir(codeCacheRootPath);
			await Promise.all(codeCaches.map(async codeCache => {
				if (codeCache === currentCodeCache) {
					return; // not the current cache folder
				}

				// Delete cache folder if old enough
				const codeCacheEntryPath = join(codeCacheRootPath, codeCache);
				const codeCacheEntryStat = await promises.stat(codeCacheEntryPath);
				if (codeCacheEntryStat.isDirectory() && (now - codeCacheEntryStat.mtime.getTime()) > this.dataMaxAge) {
					this.logService.trace(`[code cache cleanup]: Removing code cache folder ${codeCache}.`);

					return Promises.rm(codeCacheEntryPath);
				}
			}));
		} catch (error) {
			onUnexpectedError(error);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/code/electron-utility/sharedProcess/contrib/defaultExtensionsInitializer.ts]---
Location: vscode-main/src/vs/code/electron-utility/sharedProcess/contrib/defaultExtensionsInitializer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { dirname, join } from '../../../../base/common/path.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { isWindows } from '../../../../base/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import { INativeEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { INativeServerExtensionManagementService } from '../../../../platform/extensionManagement/node/extensionManagementService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { FileOperationResult, IFileService, IFileStat, toFileOperationResult } from '../../../../platform/files/common/files.js';
import { getErrorMessage } from '../../../../base/common/errors.js';
import { IProductService } from '../../../../platform/product/common/productService.js';

const defaultExtensionsInitStatusKey = 'initializing-default-extensions';

export class DefaultExtensionsInitializer extends Disposable {
	constructor(
		@INativeEnvironmentService private readonly environmentService: INativeEnvironmentService,
		@INativeServerExtensionManagementService private readonly extensionManagementService: INativeServerExtensionManagementService,
		@IStorageService storageService: IStorageService,
		@IFileService private readonly fileService: IFileService,
		@ILogService private readonly logService: ILogService,
		@IProductService private readonly productService: IProductService,
	) {
		super();

		if (isWindows && storageService.getBoolean(defaultExtensionsInitStatusKey, StorageScope.APPLICATION, true)) {
			storageService.store(defaultExtensionsInitStatusKey, true, StorageScope.APPLICATION, StorageTarget.MACHINE);
			this.initializeDefaultExtensions().then(() => storageService.store(defaultExtensionsInitStatusKey, false, StorageScope.APPLICATION, StorageTarget.MACHINE));
		}
	}

	private async initializeDefaultExtensions(): Promise<void> {
		const extensionsLocation = this.getDefaultExtensionVSIXsLocation();
		let stat: IFileStat;
		try {
			stat = await this.fileService.resolve(extensionsLocation);
			if (!stat.children) {
				this.logService.debug('There are no default extensions to initialize', extensionsLocation.toString());
				return;
			}
		} catch (error) {
			if (toFileOperationResult(error) === FileOperationResult.FILE_NOT_FOUND) {
				this.logService.debug('There are no default extensions to initialize', extensionsLocation.toString());
				return;
			}
			this.logService.error('Error initializing extensions', error);
			return;
		}

		const vsixs = stat.children.filter(child => child.name.toLowerCase().endsWith('.vsix'));
		if (vsixs.length === 0) {
			this.logService.debug('There are no default extensions to initialize', extensionsLocation.toString());
			return;
		}

		this.logService.info('Initializing default extensions', extensionsLocation.toString());
		await Promise.all(vsixs.map(async vsix => {
			this.logService.info('Installing default extension', vsix.resource.toString());
			try {
				await this.extensionManagementService.install(vsix.resource, { donotIncludePackAndDependencies: true, keepExisting: false });
				this.logService.info('Default extension installed', vsix.resource.toString());
			} catch (error) {
				this.logService.error('Error installing default extension', vsix.resource.toString(), getErrorMessage(error));
			}
		}));
		this.logService.info('Default extensions initialized', extensionsLocation.toString());
	}

	private getDefaultExtensionVSIXsLocation(): URI {
		if (this.productService.quality === 'insider') {
			// appRoot = C:\Users\<name>\AppData\Local\Programs\Microsoft VS Code Insiders\<version>\resources\app
			// extensionsPath = C:\Users\<name>\AppData\Local\Programs\Microsoft VS Code Insiders\<version>\bootstrap\extensions
			return URI.file(join(dirname(dirname(dirname(this.environmentService.appRoot))), 'bootstrap', 'extensions'));
		} else {
			// appRoot = C:\Users\<name>\AppData\Local\Programs\Microsoft VS Code Insiders\resources\app
			// extensionsPath = C:\Users\<name>\AppData\Local\Programs\Microsoft VS Code Insiders\bootstrap\extensions
			return URI.file(join(dirname(dirname(this.environmentService.appRoot)), 'bootstrap', 'extensions'));
		}
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/code/electron-utility/sharedProcess/contrib/extensions.ts]---
Location: vscode-main/src/vs/code/electron-utility/sharedProcess/contrib/extensions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IExtensionGalleryService, IGlobalExtensionEnablementService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { ExtensionStorageService, IExtensionStorageService } from '../../../../platform/extensionManagement/common/extensionStorage.js';
import { migrateUnsupportedExtensions } from '../../../../platform/extensionManagement/common/unsupportedExtensionsMigration.js';
import { INativeServerExtensionManagementService } from '../../../../platform/extensionManagement/node/extensionManagementService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';

export class ExtensionsContributions extends Disposable {
	constructor(
		@INativeServerExtensionManagementService extensionManagementService: INativeServerExtensionManagementService,
		@IExtensionGalleryService extensionGalleryService: IExtensionGalleryService,
		@IExtensionStorageService extensionStorageService: IExtensionStorageService,
		@IGlobalExtensionEnablementService extensionEnablementService: IGlobalExtensionEnablementService,
		@IStorageService storageService: IStorageService,
		@ILogService logService: ILogService,
	) {
		super();

		extensionManagementService.cleanUp();
		migrateUnsupportedExtensions(extensionManagementService, extensionGalleryService, extensionStorageService, extensionEnablementService, logService);
		ExtensionStorageService.removeOutdatedExtensionVersions(extensionManagementService, storageService);
	}

}
```

--------------------------------------------------------------------------------

````
