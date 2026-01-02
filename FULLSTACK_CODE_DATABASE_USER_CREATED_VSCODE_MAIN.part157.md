---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 157
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 157 of 552)

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

---[FILE: extensions/vscode-colorize-tests/test/colorize-tree-sitter-results/test_vb.json]---
Location: vscode-main/extensions/vscode-colorize-tests/test/colorize-tree-sitter-results/test_vb.json

```json
[]
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-colorize-tests/test/colorize-tree-sitter-results/test_xml.json]---
Location: vscode-main/extensions/vscode-colorize-tests/test/colorize-tree-sitter-results/test_xml.json

```json
[]
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-colorize-tests/test/colorize-tree-sitter-results/test_yaml.json]---
Location: vscode-main/extensions/vscode-colorize-tests/test/colorize-tree-sitter-results/test_yaml.json

```json
[]
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-colorize-tests/test/colorize-tree-sitter-results/tsconfig_off_json.json]---
Location: vscode-main/extensions/vscode-colorize-tests/test/colorize-tree-sitter-results/tsconfig_off_json.json

```json
[]
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-colorize-tests/test/semantic-test/semantic-test.json]---
Location: vscode-main/extensions/vscode-colorize-tests/test/semantic-test/semantic-test.json

```json
[
	"class", "function.member.declaration",
			"parameterType.declaration",  "type", "parameterType.declaration", "type",
				"variable.declaration", "parameterNames",
		"function.member.declaration",
	"interface.declaration",
		"function.member.declaration", "function.notInLegend"

]
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-colorize-tests/test/semantic-test/.vscode/settings.json]---
Location: vscode-main/extensions/vscode-colorize-tests/test/semantic-test/.vscode/settings.json

```json
{
    "editor.tokenColorCustomizationsExperimental": {
        "class": "#00b0b0",
        "interface": "#845faf",
        "function": "#ff00ff",
        "*.declaration": {
            "fontStyle": "underline"
        },
        "*.declaration.member": {
            "fontStyle": "italic bold",
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-test-resolver/.gitignore]---
Location: vscode-main/extensions/vscode-test-resolver/.gitignore

```text
out
node_modules
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-test-resolver/.npmrc]---
Location: vscode-main/extensions/vscode-test-resolver/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-test-resolver/.vscodeignore]---
Location: vscode-main/extensions/vscode-test-resolver/.vscodeignore

```text
.vscode/**
typings/**
**/*.ts
**/*.map
.gitignore
tsconfig.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-test-resolver/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/vscode-test-resolver/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import { browser as withBrowserDefaults } from '../shared.webpack.config.mjs';

export default withBrowserDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/extension.browser.ts'
	},
	output: {
		filename: 'testResolverMain.js'
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-test-resolver/package-lock.json]---
Location: vscode-main/extensions/vscode-test-resolver/package-lock.json

```json
{
  "name": "vscode-test-resolver",
  "version": "0.0.1",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "vscode-test-resolver",
      "version": "0.0.1",
      "license": "MIT",
      "devDependencies": {
        "@types/node": "22.x"
      },
      "engines": {
        "vscode": "^1.25.0"
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

---[FILE: extensions/vscode-test-resolver/package.json]---
Location: vscode-main/extensions/vscode-test-resolver/package.json

```json
{
  "name": "vscode-test-resolver",
  "description": "Test resolver for VS Code",
  "version": "0.0.1",
  "publisher": "vscode",
  "license": "MIT",
  "enabledApiProposals": [
    "resolvers",
    "tunnels"
  ],
  "private": true,
  "engines": {
    "vscode": "^1.25.0"
  },
  "icon": "media/icon.png",
  "extensionKind": [
    "ui"
  ],
  "scripts": {
    "compile": "node ./node_modules/vscode/bin/compile -watch -p ./",
    "vscode:prepublish": "node ../../node_modules/gulp/bin/gulp.js --gulpfile ../../build/gulpfile.extensions.mjs compile-extension:vscode-test-resolver"
  },
  "activationEvents": [
    "onResolveRemoteAuthority:test",
    "onCommand:vscode-testresolver.newWindow",
    "onCommand:vscode-testresolver.currentWindow",
    "onCommand:vscode-testresolver.newWindowWithError",
    "onCommand:vscode-testresolver.showLog",
    "onCommand:vscode-testresolver.openTunnel",
    "onCommand:vscode-testresolver.startRemoteServer",
    "onCommand:vscode-testresolver.toggleConnectionPause"
  ],
  "main": "./out/extension",
  "browser": "./dist/browser/testResolverMain",
  "devDependencies": {
    "@types/node": "22.x"
  },
  "capabilities": {
    "untrustedWorkspaces": {
      "supported": true
    },
    "virtualWorkspaces": true
  },
  "contributes": {
    "resourceLabelFormatters": [
      {
        "scheme": "vscode-remote",
        "authority": "test+*",
        "formatting": {
          "label": "${path}",
          "separator": "/",
          "tildify": true,
          "workspaceSuffix": "TestResolver",
          "workspaceTooltip": "Remote running on the same machine"
        }
      }
    ],
    "commands": [
      {
        "title": "New TestResolver Window",
        "category": "Remote-TestResolver",
        "command": "vscode-testresolver.newWindow"
      },
      {
        "title": "Connect to TestResolver in Current Window",
        "category": "Remote-TestResolver",
        "command": "vscode-testresolver.currentWindow"
      },
      {
        "title": "Connect to TestResolver in Current Window with Managed Connection",
        "category": "Remote-TestResolver",
        "command": "vscode-testresolver.currentWindowManaged"
      },
      {
        "title": "Show TestResolver Log",
        "category": "Remote-TestResolver",
        "command": "vscode-testresolver.showLog"
      },
      {
        "title": "Kill Remote Server and Trigger Handled Error",
        "category": "Remote-TestResolver",
        "command": "vscode-testresolver.killServerAndTriggerHandledError"
      },
      {
        "title": "Open Tunnel...",
        "category": "Remote-TestResolver",
        "command": "vscode-testresolver.openTunnel"
      },
      {
        "title": "Open a Remote Port...",
        "category": "Remote-TestResolver",
        "command": "vscode-testresolver.startRemoteServer"
      },
      {
        "title": "Pause Connection (Test Reconnect)",
        "category": "Remote-TestResolver",
        "command": "vscode-testresolver.toggleConnectionPause"
      },
      {
        "title": "Slowdown Connection (Test Slow Down Indicator)",
        "category": "Remote-TestResolver",
        "command": "vscode-testresolver.toggleConnectionSlowdown"
      }
    ],
    "menus": {
      "commandPalette": [
        {
          "command": "vscode-testresolver.openTunnel",
          "when": "remoteName == test"
        },
        {
          "command": "vscode-testresolver.startRemoteServer",
          "when": "remoteName == test"
        },
        {
          "command": "vscode-testresolver.toggleConnectionPause",
          "when": "remoteName == test"
        }
      ],
      "statusBar/remoteIndicator": [
        {
          "command": "vscode-testresolver.newWindow",
          "when": "!remoteName && !virtualWorkspace",
          "group": "remote_90_test_1_local@2"
        },
        {
          "command": "vscode-testresolver.showLog",
          "when": "remoteName == test",
          "group": "remote_90_test_1_open@3"
        },
        {
          "command": "vscode-testresolver.newWindow",
          "when": "remoteName == test",
          "group": "remote_90_test_1_open@1"
        },
        {
          "command": "vscode-testresolver.openTunnel",
          "when": "remoteName == test",
          "group": "remote_90_test_2_more@4"
        },
        {
          "command": "vscode-testresolver.startRemoteServer",
          "when": "remoteName == test",
          "group": "remote_90_test_2_more@5"
        },
        {
          "command": "vscode-testresolver.toggleConnectionPause",
          "when": "remoteName == test",
          "group": "remote_90_test_2_more@6"
        }
      ]
    },
    "configuration": {
      "properties": {
        "testresolver.startupDelay": {
          "description": "If set, the resolver will delay for the given amount of seconds. Use ths setting for testing a slow resolver",
          "type": "number",
          "default": 0
        },
        "testresolver.startupError": {
          "description": "If set, the resolver will fail. Use ths setting for testing the failure of a resolver.",
          "type": "boolean",
          "default": false
        },
        "testresolver.supportPublicPorts": {
          "description": "If set, the test resolver tunnel factory will support mock public ports. Forwarded ports will not actually be public. Requires reload.",
          "type": "boolean",
          "default": false
        }
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

---[FILE: extensions/vscode-test-resolver/tsconfig.json]---
Location: vscode-main/extensions/vscode-test-resolver/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"typeRoots": [
			"./node_modules/@types"
		],
		"types": [
			"node"
		],
		"lib": [
			"WebWorker"
		]
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts",
		"../../src/vscode-dts/vscode.proposed.tunnels.d.ts",
		"../../src/vscode-dts/vscode.proposed.resolvers.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-test-resolver/.vscode/launch.json]---
Location: vscode-main/extensions/vscode-test-resolver/.vscode/launch.json

```json
// A launch configuration that compiles the extension and then opens it inside a new window
// Use IntelliSense to learn about possible attributes.
// Hover to view descriptions of existing attributes.
// For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Extension",
            "type": "extensionHost",
            "request": "launch",
            "runtimeExecutable": "${execPath}",
            "args": [
                "--extensionDevelopmentPath=${workspaceFolder}",
                "--remote=test+test"
            ],
            "outFiles": [
                "${workspaceFolder}/out/**/*.js"
            ]
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-test-resolver/scripts/terminateProcess.sh]---
Location: vscode-main/extensions/vscode-test-resolver/scripts/terminateProcess.sh

```bash
#!/bin/bash

terminateTree() {
	for cpid in $(/usr/bin/pgrep -P $1); do
		terminateTree $cpid
	done
	kill -9 $1 > /dev/null 2>&1
}

for pid in $*; do
	terminateTree $pid
done
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-test-resolver/src/download.ts]---
Location: vscode-main/extensions/vscode-test-resolver/src/download.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as cp from 'child_process';
import { parse as parseUrl } from 'url';

function ensureFolderExists(loc: string) {
	if (!fs.existsSync(loc)) {
		const parent = path.dirname(loc);
		if (parent) {
			ensureFolderExists(parent);
		}
		fs.mkdirSync(loc);
	}
}

function getDownloadUrl(updateUrl: string, commit: string, platform: string, quality: string): string {
	return `${updateUrl}/commit:${commit}/server-${platform}/${quality}`;
}

async function downloadVSCodeServerArchive(updateUrl: string, commit: string, quality: string, destDir: string, log: (messsage: string) => void): Promise<string> {
	ensureFolderExists(destDir);

	const platform = process.platform === 'win32' ? 'win32-x64' : process.platform === 'darwin' ? 'darwin' : 'linux-x64';
	const downloadUrl = getDownloadUrl(updateUrl, commit, platform, quality);

	return new Promise((resolve, reject) => {
		log(`Downloading VS Code Server from: ${downloadUrl}`);
		const requestOptions: https.RequestOptions = parseUrl(downloadUrl);

		https.get(requestOptions, res => {
			if (res.statusCode !== 302) {
				reject('Failed to get VS Code server archive location');
				res.resume(); // read the rest of the response data and discard it
				return;
			}
			const archiveUrl = res.headers.location;
			if (!archiveUrl) {
				reject('Failed to get VS Code server archive location');
				res.resume(); // read the rest of the response data and discard it
				return;
			}

			const archiveRequestOptions: https.RequestOptions = parseUrl(archiveUrl);
			const archivePath = path.resolve(destDir, `vscode-server-${commit}.${archiveUrl.endsWith('.zip') ? 'zip' : 'tgz'}`);
			const outStream = fs.createWriteStream(archivePath);
			outStream.on('finish', () => {
				resolve(archivePath);
			});
			outStream.on('error', err => {
				reject(err);
			});
			https.get(archiveRequestOptions, res => {
				res.pipe(outStream);
				res.on('error', err => {
					reject(err);
				});
			});
		});
	});
}

/**
 * Unzip a .zip or .tar.gz VS Code archive
 */
function unzipVSCodeServer(vscodeArchivePath: string, extractDir: string, destDir: string, log: (messsage: string) => void) {
	log(`Extracting ${vscodeArchivePath}`);
	if (vscodeArchivePath.endsWith('.zip')) {
		const tempDir = fs.mkdtempSync(path.join(destDir, 'vscode-server-extract'));
		if (process.platform === 'win32') {
			cp.spawnSync('powershell.exe', [
				'-NoProfile',
				'-ExecutionPolicy', 'Bypass',
				'-NonInteractive',
				'-NoLogo',
				'-Command',
				`Microsoft.PowerShell.Archive\\Expand-Archive -Path "${vscodeArchivePath}" -DestinationPath "${tempDir}"`
			]);
		} else {
			cp.spawnSync('unzip', [vscodeArchivePath, '-d', `${tempDir}`]);
		}
		fs.renameSync(path.join(tempDir, process.platform === 'win32' ? 'vscode-server-win32-x64' : 'vscode-server-darwin-x64'), extractDir);
	} else {
		// tar does not create extractDir by default
		if (!fs.existsSync(extractDir)) {
			fs.mkdirSync(extractDir);
		}
		cp.spawnSync('tar', ['-xzf', vscodeArchivePath, '-C', extractDir, '--strip-components', '1']);
	}
}

export async function downloadAndUnzipVSCodeServer(updateUrl: string, commit: string, quality: string = 'stable', destDir: string, log: (messsage: string) => void): Promise<string> {

	const extractDir = path.join(destDir, commit);
	if (fs.existsSync(extractDir)) {
		log(`Found ${extractDir}. Skipping download.`);
	} else {
		log(`Downloading VS Code Server ${quality} - ${commit} into ${extractDir}.`);
		try {
			const vscodeArchivePath = await downloadVSCodeServerArchive(updateUrl, commit, quality, destDir, log);
			if (fs.existsSync(vscodeArchivePath)) {
				unzipVSCodeServer(vscodeArchivePath, extractDir, destDir, log);
				// Remove archive
				fs.unlinkSync(vscodeArchivePath);
			}
		} catch (err) {
			throw Error(`Failed to download and unzip VS Code ${quality} - ${commit}`);
		}
	}
	return Promise.resolve(extractDir);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-test-resolver/src/extension.browser.ts]---
Location: vscode-main/extensions/vscode-test-resolver/src/extension.browser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export function activate(_context: vscode.ExtensionContext) {
	vscode.workspace.registerRemoteAuthorityResolver('test', {
		async resolve(_authority: string): Promise<vscode.ResolverResult> {
			console.log(`Resolving ${_authority}`);
			console.log(`Activating vscode.github-authentication to simulate auth`);
			await vscode.extensions.getExtension('vscode.github-authentication')?.activate();
			return new vscode.ManagedResolvedAuthority(async () => {
				return new InitialManagedMessagePassing();
			});
		}
	});
}

/**
 * The initial message passing is a bit special because we need to
 * wait for the HTTP headers to arrive before we can create the
 * actual WebSocket.
 */
class InitialManagedMessagePassing implements vscode.ManagedMessagePassing {
	private readonly dataEmitter = new vscode.EventEmitter<Uint8Array>();
	private readonly closeEmitter = new vscode.EventEmitter<Error | undefined>();
	private readonly endEmitter = new vscode.EventEmitter<void>();

	public readonly onDidReceiveMessage = this.dataEmitter.event;
	public readonly onDidClose = this.closeEmitter.event;
	public readonly onDidEnd = this.endEmitter.event;

	private _actual: OpeningManagedMessagePassing | null = null;
	private _isDisposed = false;

	public send(d: Uint8Array): void {
		if (this._actual) {
			// we already got the HTTP headers
			this._actual.send(d);
			return;
		}

		if (this._isDisposed) {
			// got disposed in the meantime, ignore
			return;
		}

		// we now received the HTTP headers
		const decoder = new TextDecoder();
		const str = decoder.decode(d);

		// example str GET ws://localhost/oss-dev?reconnectionToken=4354a323-a45a-452c-b5d7-d8d586e1cd5c&reconnection=false&skipWebSocketFrames=true HTTP/1.1
		const match = str.match(/GET\s+(\S+)\s+HTTP/);
		if (!match) {
			console.error(`Coult not parse ${str}`);
			this.closeEmitter.fire(new Error(`Coult not parse ${str}`));
			return;
		}

		// example url ws://localhost/oss-dev?reconnectionToken=4354a323-a45a-452c-b5d7-d8d586e1cd5c&reconnection=false&skipWebSocketFrames=true
		const url = new URL(match[1]);

		// extract path and query from url using browser's URL
		const parsedUrl = new URL(url);
		this._actual = new OpeningManagedMessagePassing(parsedUrl, this.dataEmitter, this.closeEmitter, this.endEmitter);
	}

	public end(): void {
		if (this._actual) {
			this._actual.end();
			return;
		}
		this._isDisposed = true;
	}
}

class OpeningManagedMessagePassing {

	private readonly socket: WebSocket;
	private isOpen = false;
	private bufferedData: Uint8Array[] = [];

	constructor(
		url: URL,
		dataEmitter: vscode.EventEmitter<Uint8Array>,
		closeEmitter: vscode.EventEmitter<Error | undefined>,
		_endEmitter: vscode.EventEmitter<void>
	) {
		this.socket = new WebSocket(`ws://localhost:9888${url.pathname}${url.search.replace(/skipWebSocketFrames=true/, 'skipWebSocketFrames=false')}`);
		this.socket.addEventListener('close', () => closeEmitter.fire(undefined));
		this.socket.addEventListener('error', (e) => closeEmitter.fire(new Error(String(e))));
		this.socket.addEventListener('message', async (e) => {
			const arrayBuffer = await e.data.arrayBuffer();
			dataEmitter.fire(new Uint8Array(arrayBuffer));
		});
		this.socket.addEventListener('open', () => {
			while (this.bufferedData.length > 0) {
				const first = this.bufferedData.shift()!;
				this.socket.send(first);
			}
			this.isOpen = true;

			// https://tools.ietf.org/html/rfc6455#section-4
			// const requestNonce = req.headers['sec-websocket-key'];
			// const hash = crypto.createHash('sha1');
			// hash.update(requestNonce + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
			// const responseNonce = hash.digest('base64');
			const responseHeaders = [
				`HTTP/1.1 101 Switching Protocols`,
				`Upgrade: websocket`,
				`Connection: Upgrade`,
				`Sec-WebSocket-Accept: TODO`
			];
			const textEncoder = new TextEncoder();
			textEncoder.encode(responseHeaders.join('\r\n') + '\r\n\r\n');
			dataEmitter.fire(textEncoder.encode(responseHeaders.join('\r\n') + '\r\n\r\n'));
		});
	}

	public send(d: Uint8Array): void {
		if (!this.isOpen) {
			this.bufferedData.push(d);
			return;
		}
		this.socket.send(d);
	}

	public end(): void {
		this.socket.close();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-test-resolver/src/extension.ts]---
Location: vscode-main/extensions/vscode-test-resolver/src/extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as net from 'net';
import * as http from 'http';
import * as crypto from 'crypto';
import { downloadAndUnzipVSCodeServer } from './download';
import { terminateProcess } from './util/processes';

let extHostProcess: cp.ChildProcess | undefined;
const enum CharCode {
	Backspace = 8,
	LineFeed = 10
}

let outputChannel: vscode.OutputChannel;

const SLOWED_DOWN_CONNECTION_DELAY = 800;

export function activate(context: vscode.ExtensionContext) {

	let connectionPaused = false;
	const connectionPausedEvent = new vscode.EventEmitter<boolean>();

	let connectionSlowedDown = false;
	const connectionSlowedDownEvent = new vscode.EventEmitter<boolean>();
	const slowedDownConnections = new Set<Function>();
	connectionSlowedDownEvent.event(slowed => {
		if (!slowed) {
			for (const cb of slowedDownConnections) {
				cb();
			}
			slowedDownConnections.clear();
		}
	});

	function getTunnelFeatures(): vscode.TunnelInformation['tunnelFeatures'] {
		return {
			elevation: true,
			privacyOptions: vscode.workspace.getConfiguration('testresolver').get('supportPublicPorts') ? [
				{
					id: 'public',
					label: 'Public',
					themeIcon: 'eye'
				},
				{
					id: 'other',
					label: 'Other',
					themeIcon: 'circuit-board'
				},
				{
					id: 'private',
					label: 'Private',
					themeIcon: 'eye-closed'
				}
			] : []
		};
	}

	function maybeSlowdown(): Promise<void> | void {
		if (connectionSlowedDown) {
			return new Promise(resolve => {
				const handle = setTimeout(() => {
					resolve();
					slowedDownConnections.delete(resolve);
				}, SLOWED_DOWN_CONNECTION_DELAY);

				slowedDownConnections.add(() => {
					resolve();
					clearTimeout(handle);
				});
			});
		}
	}

	function doResolve(authority: string, progress: vscode.Progress<{ message?: string; increment?: number }>): Promise<vscode.ResolverResult> {
		if (connectionPaused) {
			throw vscode.RemoteAuthorityResolverError.TemporarilyNotAvailable('Not available right now');
		}
		const connectionToken = String(crypto.randomInt(0xffffffffff));

		// eslint-disable-next-line no-async-promise-executor
		const serverPromise = new Promise<vscode.ResolvedAuthority>(async (res, rej) => {
			progress.report({ message: 'Starting Test Resolver' });
			outputChannel = vscode.window.createOutputChannel('TestResolver');

			let isResolved = false;
			async function processError(message: string) {
				outputChannel.appendLine(message);
				if (!isResolved) {
					isResolved = true;
					outputChannel.show();

					const result = await vscode.window.showErrorMessage(message, { modal: true }, ...getActions());
					if (result) {
						await result.execute();
					}
					rej(vscode.RemoteAuthorityResolverError.NotAvailable(message, true));
				}
			}

			let lastProgressLine = '';
			function processOutput(output: string) {
				outputChannel.append(output);
				for (let i = 0; i < output.length; i++) {
					const chr = output.charCodeAt(i);
					if (chr === CharCode.LineFeed) {
						const match = lastProgressLine.match(/Extension host agent listening on (\d+)/);
						if (match) {
							isResolved = true;
							res(new vscode.ResolvedAuthority('127.0.0.1', parseInt(match[1], 10), connectionToken)); // success!
						}
						lastProgressLine = '';
					} else if (chr === CharCode.Backspace) {
						lastProgressLine = lastProgressLine.substr(0, lastProgressLine.length - 1);
					} else {
						lastProgressLine += output.charAt(i);
					}
				}
			}
			const delay = getConfiguration('startupDelay');
			if (typeof delay === 'number') {
				let remaining = Math.ceil(delay);
				outputChannel.append(`Delaying startup by ${remaining} seconds (configured by "testresolver.startupDelay").`);
				while (remaining > 0) {
					progress.report({ message: `Delayed resolving: Remaining ${remaining}s` });
					await (sleep(1000));
					remaining--;
				}
			}

			if (getConfiguration('startupError') === true) {
				processError('Test Resolver failed for testing purposes (configured by "testresolver.startupError").');
				return;
			}

			const { updateUrl, commit, quality, serverDataFolderName, serverApplicationName, dataFolderName } = getProductConfiguration();
			const commandArgs = ['--host=127.0.0.1', '--port=0', '--disable-telemetry', '--disable-experiments', '--use-host-proxy', '--accept-server-license-terms'];
			const env = getNewEnv();
			const remoteDataDir = process.env['TESTRESOLVER_DATA_FOLDER'] || path.join(os.homedir(), `${serverDataFolderName || dataFolderName}-testresolver`);
			const logsDir = process.env['TESTRESOLVER_LOGS_FOLDER'];
			if (logsDir) {
				commandArgs.push('--logsPath', logsDir);
			}
			const logLevel = process.env['TESTRESOLVER_LOG_LEVEL'];
			if (logLevel) {
				commandArgs.push('--log', logLevel);
			}
			outputChannel.appendLine(`Using data folder at ${remoteDataDir}`);
			commandArgs.push('--server-data-dir', remoteDataDir);

			commandArgs.push('--connection-token', connectionToken);

			if (!commit) { // dev mode
				const serverCommand = process.platform === 'win32' ? 'code-server.bat' : 'code-server.sh';
				const vscodePath = path.resolve(path.join(context.extensionPath, '..', '..'));
				const serverCommandPath = path.join(vscodePath, 'scripts', serverCommand);

				outputChannel.appendLine(`Launching server: "${serverCommandPath}" ${commandArgs.join(' ')}`);
				const shell = (process.platform === 'win32');
				extHostProcess = cp.spawn(serverCommandPath, commandArgs, { env, cwd: vscodePath, shell });
			} else {
				const extensionToInstall = process.env['TESTRESOLVER_INSTALL_BUILTIN_EXTENSION'];
				if (extensionToInstall) {
					commandArgs.push('--install-builtin-extension', extensionToInstall);
					commandArgs.push('--start-server');
				}
				const serverCommand = `${serverApplicationName}${process.platform === 'win32' ? '.cmd' : ''}`;
				let serverLocation = env['VSCODE_REMOTE_SERVER_PATH']; // support environment variable to specify location of server on disk
				if (!serverLocation) {
					const serverBin = path.join(remoteDataDir, 'bin');
					progress.report({ message: 'Installing VSCode Server' });
					serverLocation = await downloadAndUnzipVSCodeServer(updateUrl, commit, quality, serverBin, m => outputChannel.appendLine(m));
				}

				outputChannel.appendLine(`Using server build at ${serverLocation}`);
				outputChannel.appendLine(`Server arguments ${commandArgs.join(' ')}`);
				const shell = (process.platform === 'win32');
				extHostProcess = cp.spawn(path.join(serverLocation, 'bin', serverCommand), commandArgs, { env, cwd: serverLocation, shell });
			}
			extHostProcess.stdout!.on('data', (data: Buffer) => processOutput(data.toString()));
			extHostProcess.stderr!.on('data', (data: Buffer) => processOutput(data.toString()));
			extHostProcess.on('error', (error: Error) => {
				processError(`server failed with error:\n${error.message}`);
				extHostProcess = undefined;
			});
			extHostProcess.on('close', (code: number) => {
				processError(`server closed unexpectedly.\nError code: ${code}`);
				extHostProcess = undefined;
			});
			context.subscriptions.push({
				dispose: () => {
					if (extHostProcess) {
						terminateProcess(extHostProcess, context.extensionPath);
					}
				}
			});
		});

		return serverPromise.then((serverAddr): Promise<vscode.ResolverResult> => {
			if (authority.includes('managed')) {
				console.log('Connecting via a managed authority');
				return Promise.resolve(new vscode.ManagedResolvedAuthority(async () => {
					const remoteSocket = net.createConnection({ port: serverAddr.port });
					const dataEmitter = new vscode.EventEmitter<Uint8Array>();
					const closeEmitter = new vscode.EventEmitter<Error | undefined>();
					const endEmitter = new vscode.EventEmitter<void>();

					await new Promise((res, rej) => {
						remoteSocket.on('data', d => dataEmitter.fire(d))
							.on('error', err => { rej(); closeEmitter.fire(err); })
							.on('close', () => endEmitter.fire())
							.on('end', () => endEmitter.fire())
							.on('connect', res);
					});


					return {
						onDidReceiveMessage: dataEmitter.event,
						onDidClose: closeEmitter.event,
						onDidEnd: endEmitter.event,
						send: d => remoteSocket.write(d),
						end: () => remoteSocket.end(),
					};
				}, connectionToken));
			}

			return new Promise<vscode.ResolvedAuthority>((res, _rej) => {
				const proxyServer = net.createServer(proxySocket => {
					outputChannel.appendLine(`Proxy connection accepted`);
					let remoteReady = true, localReady = true;
					const remoteSocket = net.createConnection({ port: serverAddr.port });

					let isDisconnected = false;
					const handleConnectionPause = () => {
						const newIsDisconnected = connectionPaused;
						if (isDisconnected !== newIsDisconnected) {
							outputChannel.appendLine(`Connection state: ${newIsDisconnected ? 'open' : 'paused'}`);
							isDisconnected = newIsDisconnected;
							if (!isDisconnected) {
								outputChannel.appendLine(`Resume remote and proxy sockets.`);
								if (remoteSocket.isPaused() && localReady) {
									remoteSocket.resume();
								}
								if (proxySocket.isPaused() && remoteReady) {
									proxySocket.resume();
								}
							} else {
								outputChannel.appendLine(`Pausing remote and proxy sockets.`);
								if (!remoteSocket.isPaused()) {
									remoteSocket.pause();
								}
								if (!proxySocket.isPaused()) {
									proxySocket.pause();
								}
							}
						}
					};

					connectionPausedEvent.event(_ => handleConnectionPause());
					handleConnectionPause();

					proxySocket.on('data', async (data) => {
						await maybeSlowdown();
						remoteReady = remoteSocket.write(data);
						if (!remoteReady) {
							proxySocket.pause();
						}
					});
					remoteSocket.on('data', async (data) => {
						await maybeSlowdown();
						localReady = proxySocket.write(data);
						if (!localReady) {
							remoteSocket.pause();
						}
					});
					proxySocket.on('drain', () => {
						localReady = true;
						if (!isDisconnected) {
							remoteSocket.resume();
						}
					});
					remoteSocket.on('drain', () => {
						remoteReady = true;
						if (!isDisconnected) {
							proxySocket.resume();
						}
					});
					proxySocket.on('close', () => {
						outputChannel.appendLine(`Proxy socket closed, closing remote socket.`);
						remoteSocket.end();
					});
					remoteSocket.on('close', () => {
						outputChannel.appendLine(`Remote socket closed, closing proxy socket.`);
						proxySocket.end();
					});
					context.subscriptions.push({
						dispose: () => {
							proxySocket.end();
							remoteSocket.end();
						}
					});
				});
				proxyServer.listen(0, '127.0.0.1', () => {
					const port = (<net.AddressInfo>proxyServer.address()).port;
					outputChannel.appendLine(`Going through proxy at port ${port}`);
					res(new vscode.ResolvedAuthority('127.0.0.1', port, connectionToken));
				});
				context.subscriptions.push({
					dispose: () => {
						proxyServer.close();
					}
				});
			});
		});
	}

	const authorityResolverDisposable = vscode.workspace.registerRemoteAuthorityResolver('test', {
		async getCanonicalURI(uri: vscode.Uri): Promise<vscode.Uri> {
			return vscode.Uri.file(uri.path);
		},
		resolve(_authority: string): Thenable<vscode.ResolverResult> {
			return vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: 'Open TestResolver Remote ([details](command:vscode-testresolver.showLog))',
				cancellable: false
			}, async (progress) => {
				const rr = await doResolve(_authority, progress);
				rr.tunnelFeatures = getTunnelFeatures();
				return rr;
			});
		},
		tunnelFactory,
		showCandidatePort
	});
	context.subscriptions.push(authorityResolverDisposable);

	context.subscriptions.push(vscode.commands.registerCommand('vscode-testresolver.newWindow', () => {
		return vscode.commands.executeCommand('vscode.newWindow', { remoteAuthority: 'test+test' });
	}));
	context.subscriptions.push(vscode.commands.registerCommand('vscode-testresolver.currentWindow', () => {
		return vscode.commands.executeCommand('vscode.newWindow', { remoteAuthority: 'test+test', reuseWindow: true });
	}));
	context.subscriptions.push(vscode.commands.registerCommand('vscode-testresolver.currentWindowManaged', () => {
		return vscode.commands.executeCommand('vscode.newWindow', { remoteAuthority: 'test+managed', reuseWindow: true });
	}));
	context.subscriptions.push(vscode.commands.registerCommand('vscode-testresolver.newWindowWithError', () => {
		return vscode.commands.executeCommand('vscode.newWindow', { remoteAuthority: 'test+error' });
	}));
	context.subscriptions.push(vscode.commands.registerCommand('vscode-testresolver.killServerAndTriggerHandledError', () => {
		authorityResolverDisposable.dispose();
		if (extHostProcess) {
			terminateProcess(extHostProcess, context.extensionPath);
		}
		vscode.workspace.registerRemoteAuthorityResolver('test', {
			async resolve(_authority: string): Promise<vscode.ResolvedAuthority> {
				setTimeout(async () => {
					await vscode.window.showErrorMessage('Just a custom message.', { modal: true, useCustom: true }, 'OK', 'Great');
				}, 2000);
				throw vscode.RemoteAuthorityResolverError.NotAvailable('Intentional Error', true);
			}
		});
	}));
	context.subscriptions.push(vscode.commands.registerCommand('vscode-testresolver.showLog', () => {
		if (outputChannel) {
			outputChannel.show();
		}
	}));

	const pauseStatusBarEntry = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	pauseStatusBarEntry.text = 'Remote connection paused. Click to undo';
	pauseStatusBarEntry.command = 'vscode-testresolver.toggleConnectionPause';
	pauseStatusBarEntry.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');

	context.subscriptions.push(vscode.commands.registerCommand('vscode-testresolver.toggleConnectionPause', () => {
		if (!connectionPaused) {
			connectionPaused = true;
			pauseStatusBarEntry.show();
		} else {
			connectionPaused = false;
			pauseStatusBarEntry.hide();
		}
		connectionPausedEvent.fire(connectionPaused);
	}));

	const slowdownStatusBarEntry = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	slowdownStatusBarEntry.text = 'Remote connection slowed down. Click to undo';
	slowdownStatusBarEntry.command = 'vscode-testresolver.toggleConnectionSlowdown';
	slowdownStatusBarEntry.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');

	context.subscriptions.push(vscode.commands.registerCommand('vscode-testresolver.toggleConnectionSlowdown', () => {
		if (!connectionSlowedDown) {
			connectionSlowedDown = true;
			slowdownStatusBarEntry.show();
		} else {
			connectionSlowedDown = false;
			slowdownStatusBarEntry.hide();
		}
		connectionSlowedDownEvent.fire(connectionSlowedDown);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('vscode-testresolver.openTunnel', async () => {
		const result = await vscode.window.showInputBox({
			prompt: 'Enter the remote port for the tunnel',
			value: '5000',
			validateInput: input => /^[\d]+$/.test(input) ? undefined : 'Not a valid number'
		});
		if (result) {
			const port = Number.parseInt(result);
			vscode.workspace.openTunnel({
				remoteAddress: {
					host: '127.0.0.1',
					port: port
				},
				localAddressPort: port + 1
			});
		}

	}));
	context.subscriptions.push(vscode.commands.registerCommand('vscode-testresolver.startRemoteServer', async () => {
		const result = await vscode.window.showInputBox({
			prompt: 'Enter the port for the remote server',
			value: '5000',
			validateInput: input => /^[\d]+$/.test(input) ? undefined : 'Not a valid number'
		});
		if (result) {
			runHTTPTestServer(Number.parseInt(result));
		}

	}));
	vscode.commands.executeCommand('setContext', 'forwardedPortsViewEnabled', true);
}

type ActionItem = (vscode.MessageItem & { execute: () => void });

function getActions(): ActionItem[] {
	const actions: ActionItem[] = [];
	const isDirty = vscode.workspace.textDocuments.some(d => d.isDirty) || vscode.workspace.workspaceFile && vscode.workspace.workspaceFile.scheme === 'untitled';

	actions.push({
		title: 'Retry',
		execute: async () => {
			await vscode.commands.executeCommand('workbench.action.reloadWindow');
		}
	});
	if (!isDirty) {
		actions.push({
			title: 'Close Remote',
			execute: async () => {
				await vscode.commands.executeCommand('vscode.newWindow', { reuseWindow: true, remoteAuthority: null });
			}
		});
	}
	actions.push({
		title: 'Ignore',
		isCloseAffordance: true,
		execute: async () => {
			vscode.commands.executeCommand('vscode-testresolver.showLog'); // no need to wait
		}
	});
	return actions;
}

export interface IProductConfiguration {
	updateUrl: string;
	commit: string;
	quality: string;
	dataFolderName: string;
	serverApplicationName?: string;
	serverDataFolderName?: string;
}

function getProductConfiguration(): IProductConfiguration {
	const content = fs.readFileSync(path.join(vscode.env.appRoot, 'product.json')).toString();
	return JSON.parse(content) as IProductConfiguration;
}

function getNewEnv(): { [x: string]: string | undefined } {
	const env = { ...process.env };
	delete env['ELECTRON_RUN_AS_NODE'];
	return env;
}

function sleep(ms: number): Promise<void> {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

function getConfiguration<T>(id: string): T | undefined {
	return vscode.workspace.getConfiguration('testresolver').get<T>(id);
}

const remoteServers: number[] = [];

async function showCandidatePort(_host: string, port: number, _detail: string): Promise<boolean> {
	return remoteServers.includes(port) || port === 100;
}

async function tunnelFactory(tunnelOptions: vscode.TunnelOptions, tunnelCreationOptions: vscode.TunnelCreationOptions): Promise<vscode.Tunnel> {
	outputChannel.appendLine(`Tunnel factory request: Remote ${tunnelOptions.remoteAddress.port} -> local ${tunnelOptions.localAddressPort}`);
	if (tunnelCreationOptions.elevationRequired) {
		await vscode.window.showInformationMessage('This is a fake elevation message. A real resolver would show a native elevation prompt.', { modal: true }, 'Ok');
	}

	return createTunnelService();

	function newTunnel(localAddress: { host: string; port: number }): vscode.Tunnel {
		const onDidDispose: vscode.EventEmitter<void> = new vscode.EventEmitter();
		let isDisposed = false;
		return {
			localAddress,
			remoteAddress: tunnelOptions.remoteAddress,
			public: !!vscode.workspace.getConfiguration('testresolver').get('supportPublicPorts') && tunnelOptions.public,
			privacy: tunnelOptions.privacy,
			protocol: tunnelOptions.protocol,
			onDidDispose: onDidDispose.event,
			dispose: () => {
				if (!isDisposed) {
					isDisposed = true;
					onDidDispose.fire();
				}
			}
		};
	}

	function createTunnelService(): Promise<vscode.Tunnel> {
		return new Promise<vscode.Tunnel>((res, _rej) => {
			const proxyServer = net.createServer(proxySocket => {
				const remoteSocket = net.createConnection({ host: tunnelOptions.remoteAddress.host, port: tunnelOptions.remoteAddress.port });
				remoteSocket.pipe(proxySocket);
				proxySocket.pipe(remoteSocket);
			});
			let localPort = 0;

			if (tunnelOptions.localAddressPort) {
				// When the tunnelOptions include a localAddressPort, we should use that.
				// However, the test resolver all runs on one machine, so if the localAddressPort is the same as the remote port,
				// then we must use a different port number.
				localPort = tunnelOptions.localAddressPort;
			} else {
				localPort = tunnelOptions.remoteAddress.port;
			}

			if (localPort === tunnelOptions.remoteAddress.port) {
				localPort += 1;
			}

			// The test resolver can't actually handle privileged ports, it only pretends to.
			if (localPort < 1024 && process.platform !== 'win32') {
				localPort = 0;
			}
			proxyServer.listen(localPort, '127.0.0.1', () => {
				const localPort = (<net.AddressInfo>proxyServer.address()).port;
				outputChannel.appendLine(`New test resolver tunnel service: Remote ${tunnelOptions.remoteAddress.port} -> local ${localPort}`);
				const tunnel = newTunnel({ host: '127.0.0.1', port: localPort });
				tunnel.onDidDispose(() => proxyServer.close());
				res(tunnel);
			});
		});
	}
}

function runHTTPTestServer(port: number): vscode.Disposable {
	const server = http.createServer((_req, res) => {
		res.writeHead(200);
		res.end(`Hello, World from test server running on port ${port}!`);
	});
	remoteServers.push(port);
	server.listen(port, '127.0.0.1');
	const message = `Opened HTTP server on http://127.0.0.1:${port}`;
	console.log(message);
	outputChannel.appendLine(message);
	return {
		dispose: () => {
			server.close();
			const index = remoteServers.indexOf(port);
			if (index !== -1) {
				remoteServers.splice(index, 1);
			}
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-test-resolver/src/util/processes.ts]---
Location: vscode-main/extensions/vscode-test-resolver/src/util/processes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as cp from 'child_process';
import * as path from 'path';

export interface TerminateResponse {
	success: boolean;
	error?: any;
}

export function terminateProcess(p: cp.ChildProcess, extensionPath: string): TerminateResponse {
	if (process.platform === 'win32') {
		try {
			const options: any = {
				stdio: ['pipe', 'pipe', 'ignore']
			};
			cp.execFileSync('taskkill', ['/T', '/F', '/PID', p.pid!.toString()], options);
		} catch (err) {
			return { success: false, error: err };
		}
	} else if (process.platform === 'darwin' || process.platform === 'linux') {
		try {
			const cmd = path.join(extensionPath, 'scripts', 'terminateProcess.sh');
			const result = cp.spawnSync(cmd, [p.pid!.toString()]);
			if (result.error) {
				return { success: false, error: result.error };
			}
		} catch (err) {
			return { success: false, error: err };
		}
	} else {
		p.kill('SIGKILL');
	}
	return { success: true };
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/xml/.vscodeignore]---
Location: vscode-main/extensions/xml/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/xml/cgmanifest.json]---
Location: vscode-main/extensions/xml/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "atom/language-xml",
					"repositoryUrl": "https://github.com/atom/language-xml",
					"commitHash": "7bc75dfe779ad5b35d9bf4013d9181864358cb49"
				}
			},
			"license": "MIT",
			"description": "The files syntaxes/xml.json and syntaxes/xsl.json were derived from the Atom package https://github.com/atom/language-xml which were originally converted from the TextMate bundle https://github.com/textmate/xml.tmbundle.",
			"version": "0.35.2"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/xml/package.json]---
Location: vscode-main/extensions/xml/package.json

```json
{
  "name": "xml",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "xml",
        "extensions": [
          ".xml",
          ".xsd",
          ".ascx",
          ".atom",
          ".axml",
          ".axaml",
          ".bpmn",
          ".cpt",
          ".csl",
          ".csproj",
          ".csproj.user",
          ".dita",
          ".ditamap",
          ".dtd",
          ".ent",
          ".mod",
          ".dtml",
          ".fsproj",
          ".fxml",
          ".iml",
          ".isml",
          ".jmx",
          ".launch",
          ".menu",
          ".mxml",
          ".nuspec",
          ".opml",
          ".owl",
          ".proj",
          ".props",
          ".pt",
          ".publishsettings",
          ".pubxml",
          ".pubxml.user",
          ".rbxlx",
          ".rbxmx",
          ".rdf",
          ".rng",
          ".rss",
          ".shproj",
          ".slnx",
          ".storyboard",
          ".svg",
          ".targets",
          ".tld",
          ".tmx",
          ".vbproj",
          ".vbproj.user",
          ".vcxproj",
          ".vcxproj.filters",
          ".wsdl",
          ".wxi",
          ".wxl",
          ".wxs",
          ".xaml",
          ".xbl",
          ".xib",
          ".xlf",
          ".xliff",
          ".xpdl",
          ".xul",
          ".xoml"
        ],
        "firstLine": "(\\<\\?xml.*)|(\\<svg)|(\\<\\!doctype\\s+svg)",
        "aliases": [
          "XML",
          "xml"
        ],
        "configuration": "./xml.language-configuration.json"
      },
      {
        "id": "xsl",
        "extensions": [
          ".xsl",
          ".xslt"
        ],
        "aliases": [
          "XSL",
          "xsl"
        ],
        "configuration": "./xsl.language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "xml",
        "scopeName": "text.xml",
        "path": "./syntaxes/xml.tmLanguage.json"
      },
      {
        "language": "xsl",
        "scopeName": "text.xml.xsl",
        "path": "./syntaxes/xsl.tmLanguage.json"
      }
    ]
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin atom/language-xml grammars/xml.cson ./syntaxes/xml.tmLanguage.json grammars/xsl.cson ./syntaxes/xsl.tmLanguage.json"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/xml/package.nls.json]---
Location: vscode-main/extensions/xml/package.nls.json

```json
{
	"displayName": "XML Language Basics",
	"description": "Provides syntax highlighting and bracket matching in XML files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/xml/xml.language-configuration.json]---
Location: vscode-main/extensions/xml/xml.language-configuration.json

```json
{
	"comments": {
		"blockComment": [ "<!--", "-->" ]
	},
	"brackets": [
		["<!--", "-->"],
		["<", ">"],
		["{", "}"],
		["(", ")"]
	],
	"autoClosingPairs": [
		{ "open": "{", "close": "}"},
		{ "open": "[", "close": "]"},
		{ "open": "(", "close": ")" },
		{ "open": "\"", "close": "\"", "notIn": ["string"] },
		{ "open": "'", "close": "'", "notIn": ["string"] },
		{ "open": "<!--", "close": "-->", "notIn": [ "comment", "string" ]}
	],
	"surroundingPairs": [
		{ "open": "'", "close": "'" },
		{ "open": "\"", "close": "\"" },
		{ "open": "{", "close": "}"},
		{ "open": "[", "close": "]"},
		{ "open": "(", "close": ")" },
		{ "open": "<", "close": ">" }
	],
	"colorizedBracketPairs": [
	],
	"folding": {
		"markers": {
			"start": "^\\s*<!--\\s*#region\\b.*-->",
			"end": "^\\s*<!--\\s*#endregion\\b.*-->"
		}
	},
	"wordPattern": {
		"pattern": "(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>\\/\\?\\s]+)"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/xml/xsl.language-configuration.json]---
Location: vscode-main/extensions/xml/xsl.language-configuration.json

```json
{
	"comments": {
		"lineComment": "",
		"blockComment": ["<!--", "-->"]
	},
	"brackets": [
		["<!--", "-->"],
		["<", ">"],
		["{", "}"],
		["(", ")"],
		["[", "]"]
	],
	"wordPattern": {
		"pattern": "(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>\\/\\?\\s]+)"
	}

	// enhancedBrackets: [{
	// 	tokenType: 'tag.tag-$1.xml',
	// 	openTrigger: '>',
	// 	open: /<(\w[\w\d]*)([^\/>]*(?!\/)>)[^<>]*$/i,
	// 	closeComplete: '</$1>',
	// 	closeTrigger: '>',
	// 	close: /<\/(\w[\w\d]*)\s*>$/i
	// }],

	// autoClosingPairs:  [['\'', '\''], ['"', '"'] ]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/xml/syntaxes/xml.tmLanguage.json]---
Location: vscode-main/extensions/xml/syntaxes/xml.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/atom/language-xml/blob/master/grammars/xml.cson",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/atom/language-xml/commit/7bc75dfe779ad5b35d9bf4013d9181864358cb49",
	"name": "XML",
	"scopeName": "text.xml",
	"patterns": [
		{
			"begin": "(<\\?)\\s*([-_a-zA-Z0-9]+)",
			"captures": {
				"1": {
					"name": "punctuation.definition.tag.xml"
				},
				"2": {
					"name": "entity.name.tag.xml"
				}
			},
			"end": "(\\?>)",
			"name": "meta.tag.preprocessor.xml",
			"patterns": [
				{
					"match": " ([a-zA-Z-]+)",
					"name": "entity.other.attribute-name.xml"
				},
				{
					"include": "#doublequotedString"
				},
				{
					"include": "#singlequotedString"
				}
			]
		},
		{
			"begin": "(<!)(DOCTYPE)\\s+([:a-zA-Z_][:a-zA-Z0-9_.-]*)",
			"captures": {
				"1": {
					"name": "punctuation.definition.tag.xml"
				},
				"2": {
					"name": "keyword.other.doctype.xml"
				},
				"3": {
					"name": "variable.language.documentroot.xml"
				}
			},
			"end": "\\s*(>)",
			"name": "meta.tag.sgml.doctype.xml",
			"patterns": [
				{
					"include": "#internalSubset"
				}
			]
		},
		{
			"include": "#comments"
		},
		{
			"begin": "(<)((?:([-_a-zA-Z0-9]+)(:))?([-_a-zA-Z0-9:]+))(?=(\\s[^>]*)?></\\2>)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.tag.xml"
				},
				"2": {
					"name": "entity.name.tag.xml"
				},
				"3": {
					"name": "entity.name.tag.namespace.xml"
				},
				"4": {
					"name": "punctuation.separator.namespace.xml"
				},
				"5": {
					"name": "entity.name.tag.localname.xml"
				}
			},
			"end": "(>)(</)((?:([-_a-zA-Z0-9]+)(:))?([-_a-zA-Z0-9:]+))(>)",
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.tag.xml"
				},
				"2": {
					"name": "punctuation.definition.tag.xml"
				},
				"3": {
					"name": "entity.name.tag.xml"
				},
				"4": {
					"name": "entity.name.tag.namespace.xml"
				},
				"5": {
					"name": "punctuation.separator.namespace.xml"
				},
				"6": {
					"name": "entity.name.tag.localname.xml"
				},
				"7": {
					"name": "punctuation.definition.tag.xml"
				}
			},
			"name": "meta.tag.no-content.xml",
			"patterns": [
				{
					"include": "#tagStuff"
				}
			]
		},
		{
			"begin": "(</?)(?:([-\\w\\.]+)((:)))?([-\\w\\.:]+)",
			"captures": {
				"1": {
					"name": "punctuation.definition.tag.xml"
				},
				"2": {
					"name": "entity.name.tag.namespace.xml"
				},
				"3": {
					"name": "entity.name.tag.xml"
				},
				"4": {
					"name": "punctuation.separator.namespace.xml"
				},
				"5": {
					"name": "entity.name.tag.localname.xml"
				}
			},
			"end": "(/?>)",
			"name": "meta.tag.xml",
			"patterns": [
				{
					"include": "#tagStuff"
				}
			]
		},
		{
			"include": "#entity"
		},
		{
			"include": "#bare-ampersand"
		},
		{
			"begin": "<%@",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.embedded.begin.xml"
				}
			},
			"end": "%>",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.embedded.end.xml"
				}
			},
			"name": "source.java-props.embedded.xml",
			"patterns": [
				{
					"match": "page|include|taglib",
					"name": "keyword.other.page-props.xml"
				}
			]
		},
		{
			"begin": "<%[!=]?(?!--)",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.embedded.begin.xml"
				}
			},
			"end": "(?!--)%>",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.embedded.end.xml"
				}
			},
			"name": "source.java.embedded.xml",
			"patterns": [
				{
					"include": "source.java"
				}
			]
		},
		{
			"begin": "<!\\[CDATA\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.xml"
				}
			},
			"end": "]]>",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.xml"
				}
			},
			"name": "string.unquoted.cdata.xml"
		}
	],
	"repository": {
		"EntityDecl": {
			"begin": "(<!)(ENTITY)\\s+(%\\s+)?([:a-zA-Z_][:a-zA-Z0-9_.-]*)(\\s+(?:SYSTEM|PUBLIC)\\s+)?",
			"captures": {
				"1": {
					"name": "punctuation.definition.tag.xml"
				},
				"2": {
					"name": "keyword.other.entity.xml"
				},
				"3": {
					"name": "punctuation.definition.entity.xml"
				},
				"4": {
					"name": "variable.language.entity.xml"
				},
				"5": {
					"name": "keyword.other.entitytype.xml"
				}
			},
			"end": "(>)",
			"patterns": [
				{
					"include": "#doublequotedString"
				},
				{
					"include": "#singlequotedString"
				}
			]
		},
		"bare-ampersand": {
			"match": "&",
			"name": "invalid.illegal.bad-ampersand.xml"
		},
		"doublequotedString": {
			"begin": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.xml"
				}
			},
			"end": "\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.xml"
				}
			},
			"name": "string.quoted.double.xml",
			"patterns": [
				{
					"include": "#entity"
				},
				{
					"include": "#bare-ampersand"
				}
			]
		},
		"entity": {
			"captures": {
				"1": {
					"name": "punctuation.definition.constant.xml"
				},
				"3": {
					"name": "punctuation.definition.constant.xml"
				}
			},
			"match": "(&)([:a-zA-Z_][:a-zA-Z0-9_.-]*|#[0-9]+|#x[0-9a-fA-F]+)(;)",
			"name": "constant.character.entity.xml"
		},
		"internalSubset": {
			"begin": "(\\[)",
			"captures": {
				"1": {
					"name": "punctuation.definition.constant.xml"
				}
			},
			"end": "(\\])",
			"name": "meta.internalsubset.xml",
			"patterns": [
				{
					"include": "#EntityDecl"
				},
				{
					"include": "#parameterEntity"
				},
				{
					"include": "#comments"
				}
			]
		},
		"parameterEntity": {
			"captures": {
				"1": {
					"name": "punctuation.definition.constant.xml"
				},
				"3": {
					"name": "punctuation.definition.constant.xml"
				}
			},
			"match": "(%)([:a-zA-Z_][:a-zA-Z0-9_.-]*)(;)",
			"name": "constant.character.parameter-entity.xml"
		},
		"singlequotedString": {
			"begin": "'",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.xml"
				}
			},
			"end": "'",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.xml"
				}
			},
			"name": "string.quoted.single.xml",
			"patterns": [
				{
					"include": "#entity"
				},
				{
					"include": "#bare-ampersand"
				}
			]
		},
		"tagStuff": {
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "entity.other.attribute-name.namespace.xml"
						},
						"2": {
							"name": "entity.other.attribute-name.xml"
						},
						"3": {
							"name": "punctuation.separator.namespace.xml"
						},
						"4": {
							"name": "entity.other.attribute-name.localname.xml"
						}
					},
					"match": "(?:^|\\s+)(?:([-\\w.]+)((:)))?([-\\w.:]+)\\s*="
				},
				{
					"include": "#doublequotedString"
				},
				{
					"include": "#singlequotedString"
				}
			]
		},
		"comments": {
			"patterns": [
				{
					"begin": "<%--",
					"captures": {
						"0": {
							"name": "punctuation.definition.comment.xml"
						},
						"end": "--%>",
						"name": "comment.block.xml"
					}
				},
				{
					"begin": "<!--",
					"captures": {
						"0": {
							"name": "punctuation.definition.comment.xml"
						}
					},
					"end": "-->",
					"name": "comment.block.xml",
					"patterns": [
						{
							"begin": "--(?!>)",
							"captures": {
								"0": {
									"name": "invalid.illegal.bad-comments-or-CDATA.xml"
								}
							}
						}
					]
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/xml/syntaxes/xsl.tmLanguage.json]---
Location: vscode-main/extensions/xml/syntaxes/xsl.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/atom/language-xml/blob/master/grammars/xsl.cson",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/atom/language-xml/commit/507de2ee7daca60cf02e9e21fbeb92bbae73e280",
	"name": "XSL",
	"scopeName": "text.xml.xsl",
	"patterns": [
		{
			"begin": "(<)(xsl)((:))(template)",
			"captures": {
				"1": {
					"name": "punctuation.definition.tag.xml"
				},
				"2": {
					"name": "entity.name.tag.namespace.xml"
				},
				"3": {
					"name": "entity.name.tag.xml"
				},
				"4": {
					"name": "punctuation.separator.namespace.xml"
				},
				"5": {
					"name": "entity.name.tag.localname.xml"
				}
			},
			"end": "(>)",
			"name": "meta.tag.xml.template",
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "entity.other.attribute-name.namespace.xml"
						},
						"2": {
							"name": "entity.other.attribute-name.xml"
						},
						"3": {
							"name": "punctuation.separator.namespace.xml"
						},
						"4": {
							"name": "entity.other.attribute-name.localname.xml"
						}
					},
					"match": " (?:([-_a-zA-Z0-9]+)((:)))?([a-zA-Z-]+)"
				},
				{
					"include": "#doublequotedString"
				},
				{
					"include": "#singlequotedString"
				}
			]
		},
		{
			"include": "text.xml"
		}
	],
	"repository": {
		"doublequotedString": {
			"begin": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.xml"
				}
			},
			"end": "\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.xml"
				}
			},
			"name": "string.quoted.double.xml"
		},
		"singlequotedString": {
			"begin": "'",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.xml"
				}
			},
			"end": "'",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.xml"
				}
			},
			"name": "string.quoted.single.xml"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/yaml/.vscodeignore]---
Location: vscode-main/extensions/yaml/.vscodeignore

```text
test/**
cgmanifest.json
build/**
```

--------------------------------------------------------------------------------

---[FILE: extensions/yaml/cgmanifest.json]---
Location: vscode-main/extensions/yaml/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "RedCMD/YAML-Syntax-Highlighter",
					"repositoryUrl": "https://github.com/RedCMD/YAML-Syntax-Highlighter",
					"commitHash": "53d38bbc66b704803de54ffce5b251bf97211c60"
				}
			},
			"licenseDetail": [
				"MIT License",
				"",
				"Copyright 2024 RedCMD",
				"",
				"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:",
				"",
				"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
				"",
				"THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
			],
			"license": "MIT",
			"version": "1.3.2"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/yaml/language-configuration.json]---
Location: vscode-main/extensions/yaml/language-configuration.json

```json
{
	"comments": {
		"lineComment": "#"
	},
	"brackets": [
		["{", "}"],
		["[", "]"],
		["(", ")"]
	],
	"autoClosingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""],
		["'", "'"]
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""],
		["'", "'"]
	],
	"folding": {
		"offSide": true,
		"markers": {
			"start": "^\\s*#\\s*region\\b",
			"end": "^\\s*#\\s*endregion\\b"
		}
	},
	"indentationRules": {
		"increaseIndentPattern": "^\\s*.*(:|-) ?(&amp;\\w+)?(\\{[^}\"']*|\\([^)\"']*)?$",
		"decreaseIndentPattern": "^\\s+\\}$"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/yaml/package.json]---
Location: vscode-main/extensions/yaml/package.json

```json
{
  "name": "yaml",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ./build/update-grammar.js"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "dockercompose",
        "aliases": [
          "Compose",
          "compose"
        ],
        "filenamePatterns": [
          "compose.yml",
          "compose.yaml",
          "compose.*.yml",
          "compose.*.yaml",
          "*docker*compose*.yml",
          "*docker*compose*.yaml"
        ],
        "configuration": "./language-configuration.json"
      },
      {
        "id": "yaml",
        "aliases": [
          "YAML",
          "yaml"
        ],
        "extensions": [
          ".yaml",
          ".yml",
          ".eyaml",
          ".eyml",
          ".cff",
          ".yaml-tmlanguage",
          ".yaml-tmpreferences",
          ".yaml-tmtheme",
          ".winget"
        ],
        "firstLine": "^#cloud-config",
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "dockercompose",
        "scopeName": "source.yaml",
        "path": "./syntaxes/yaml.tmLanguage.json"
      },
      {
        "scopeName": "source.yaml.1.3",
        "path": "./syntaxes/yaml-1.3.tmLanguage.json"
      },
      {
        "scopeName": "source.yaml.1.2",
        "path": "./syntaxes/yaml-1.2.tmLanguage.json"
      },
      {
        "scopeName": "source.yaml.1.1",
        "path": "./syntaxes/yaml-1.1.tmLanguage.json"
      },
      {
        "scopeName": "source.yaml.1.0",
        "path": "./syntaxes/yaml-1.0.tmLanguage.json"
      },
      {
        "scopeName": "source.yaml.embedded",
        "path": "./syntaxes/yaml-embedded.tmLanguage.json"
      },
      {
        "language": "yaml",
        "scopeName": "source.yaml",
        "path": "./syntaxes/yaml.tmLanguage.json",
        "unbalancedBracketScopes": [
          "invalid.illegal",
          "meta.scalar.yaml",
          "storage.type.tag.shorthand.yaml",
          "keyword.control.flow"
        ]
      }
    ],
    "configurationDefaults": {
      "[yaml]": {
        "editor.insertSpaces": true,
        "editor.tabSize": 2,
        "editor.autoIndent": "advanced",
        "diffEditor.ignoreTrimWhitespace": false,
        "editor.defaultColorDecorators": "never",
        "editor.quickSuggestions": { 
          "strings": "on"
        }
      },
      "[dockercompose]": {
        "editor.insertSpaces": true,
        "editor.tabSize": 2,
        "editor.autoIndent": "advanced"
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

---[FILE: extensions/yaml/package.nls.json]---
Location: vscode-main/extensions/yaml/package.nls.json

```json
{
	"displayName": "YAML Language Basics",
	"description": "Provides syntax highlighting and bracket matching in YAML files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/yaml/build/update-grammar.js]---
Location: vscode-main/extensions/yaml/build/update-grammar.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

var updateGrammar = require('vscode-grammar-updater');

async function updateGrammars() {
	await updateGrammar.update('RedCMD/YAML-Syntax-Highlighter', 'syntaxes/yaml-1.0.tmLanguage.json', './syntaxes/yaml-1.0.tmLanguage.json',  undefined, 'main');
	await updateGrammar.update('RedCMD/YAML-Syntax-Highlighter', 'syntaxes/yaml-1.1.tmLanguage.json', './syntaxes/yaml-1.1.tmLanguage.json',  undefined, 'main');
	await updateGrammar.update('RedCMD/YAML-Syntax-Highlighter', 'syntaxes/yaml-1.2.tmLanguage.json', './syntaxes/yaml-1.2.tmLanguage.json',  undefined, 'main');
	await updateGrammar.update('RedCMD/YAML-Syntax-Highlighter', 'syntaxes/yaml-1.3.tmLanguage.json', './syntaxes/yaml-1.3.tmLanguage.json',  undefined, 'main');
	await updateGrammar.update('RedCMD/YAML-Syntax-Highlighter', 'syntaxes/yaml-embedded.tmLanguage.json', './syntaxes/yaml-embedded.tmLanguage.json',  undefined, 'main');
	await updateGrammar.update('RedCMD/YAML-Syntax-Highlighter', 'syntaxes/yaml.tmLanguage.json', './syntaxes/yaml.tmLanguage.json',  undefined, 'main');
}

updateGrammars();
```

--------------------------------------------------------------------------------

---[FILE: extensions/yaml/syntaxes/yaml-1.0.tmLanguage.json]---
Location: vscode-main/extensions/yaml/syntaxes/yaml-1.0.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/RedCMD/YAML-Syntax-Highlighter/blob/master/syntaxes/yaml-1.0.tmLanguage.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/RedCMD/YAML-Syntax-Highlighter/commit/0b50d9c47145df62c4461c4407698a24e8f1f3c2",
	"name": "YAML 1.0",
	"scopeName": "source.yaml.1.0",
	"comment": "https://yaml.org/spec/1.0/",
	"patterns": [
		{
			"include": "#stream"
		}
	],
	"repository": {
		"stream": {
			"patterns": [
				{
					"comment": "allows me to just use `\\G` instead of the performance heavy `(^|\\G)`",
					"begin": "^(?!\\G)",
					"while": "^",
					"name": "meta.stream.yaml",
					"patterns": [
						{
							"include": "source.yaml.1.1#byte-order-mark"
						},
						{
							"include": "#directives"
						},
						{
							"include": "#document"
						},
						{
							"include": "source.yaml.1.1#presentation-detail"
						}
					]
				},
				{
					"begin": "\\G",
					"while": "\\G",
					"name": "meta.stream.yaml",
					"patterns": [
						{
							"include": "source.yaml.1.1#byte-order-mark"
						},
						{
							"include": "#directives"
						},
						{
							"include": "#document"
						},
						{
							"include": "source.yaml.1.1#presentation-detail"
						}
					]
				}
			]
		},
		"directive-YAML": {
			"comment": "https://yaml.org/spec/1.2.2/#681-yaml-directives",
			"begin": "(?=%YAML:1\\.0(?=[\\x{85 2028 2029}\r\n\t ]))",
			"end": "\\G(?=%(?!YAML:1\\.0))",
			"name": "meta.1.0.yaml",
			"patterns": [
				{
					"comment": "https://yaml.org/spec/1.2.2/#681-yaml-directives",
					"begin": "\\G(%)(YAML)(:)(1\\.0)",
					"while": "\\G(?!---[\\x{85 2028 2029}\r\n\t ])",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.directive.begin.yaml"
						},
						"2": {
							"name": "keyword.other.directive.yaml.yaml"
						},
						"3": {
							"name": "punctuation.whitespace.separator.yaml"
						},
						"4": {
							"name": "constant.numeric.yaml-version.yaml"
						}
					},
					"name": "meta.directives.yaml",
					"patterns": [
						{
							"include": "source.yaml.1.1#directive-invalid"
						},
						{
							"include": "#directives"
						},
						{
							"include": "source.yaml.1.1#presentation-detail"
						}
					]
				},
				{
					"begin": "\\G(?=---[\\x{85 2028 2029}\r\n\t ])",
					"while": "\\G(?!%)",
					"patterns": [
						{
							"include": "#document"
						},
						{
							"include": "source.yaml.1.1#presentation-detail"
						}
					]
				},
				{
					"include": "source.yaml.1.1#presentation-detail"
				}
			]
		},
		"directives": {
			"comment": "https://yaml.org/spec/1.2.2/#68-directives",
			"patterns": [
				{
					"include": "source.yaml.1.3#directive-YAML"
				},
				{
					"include": "source.yaml.1.2#directive-YAML"
				},
				{
					"include": "source.yaml.1.1#directive-YAML"
				},
				{
					"include": "source.yaml.1.0#directive-YAML"
				},
				{
					"begin": "(?=%)",
					"while": "\\G(?!%|---[\\x{85 2028 2029}\r\n\t ])",
					"name": "meta.directives.yaml",
					"patterns": [
						{
							"comment": "https://yaml.org/spec/1.2.2/#rule-ns-reserved-directive",
							"begin": "(%)([^: \\p{Cntrl}\\p{Surrogate}\\x{2028 2029 FFFE FFFF}]++)",
							"end": "$",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.directive.begin.yaml"
								},
								"2": {
									"name": "keyword.other.directive.other.yaml"
								}
							},
							"patterns": [
								{
									"match": "\\G(:)([^ \\p{Cntrl}\\p{Surrogate}\\x{2028 2029 FFFE FFFF}]++)",
									"captures": {
										"1": {
											"name": "punctuation.whitespace.separator.yaml"
										},
										"2": {
											"name": "string.unquoted.directive-name.yaml"
										}
									}
								},
								{
									"include": "source.yaml.1.1#presentation-detail"
								}
							]
						},
						{
							"match": "\\G\\.{3}(?=[\\x{85 2028 2029}\r\n\t ])",
							"name": "invalid.illegal.entity.other.document.end.yaml"
						},
						{
							"include": "source.yaml.1.1#presentation-detail"
						}
					]
				}
			]
		},
		"document": {
			"comment": "https://yaml.org/spec/1.2.2/#91-documents",
			"patterns": [
				{
					"begin": "---(?=[\\x{85 2028 2029}\r\n\t ])",
					"while": "\\G(?!(?>\\.{3}|---)[\\x{85 2028 2029}\r\n\t ])",
					"beginCaptures": {
						"0": {
							"name": "entity.other.document.begin.yaml"
						}
					},
					"name": "meta.document.yaml",
					"patterns": [
						{
							"include": "#block-node"
						}
					]
				},
				{
					"begin": "(?=\\.{3}[\\x{85 2028 2029}\r\n\t ])",
					"while": "\\G(?=[\t \\x{FEFF}]*+(?>#|$))",
					"patterns": [
						{
							"begin": "\\G\\.{3}",
							"end": "$",
							"beginCaptures": {
								"0": {
									"name": "entity.other.document.end.yaml"
								}
							},
							"patterns": [
								{
									"include": "source.yaml.1.1#presentation-detail"
								}
							]
						},
						{
							"include": "source.yaml.1.1#byte-order-mark"
						},
						{
							"include": "source.yaml.1.1#presentation-detail"
						}
					]
				},
				{
					"begin": "\\G(?!%|[\t \\x{FEFF}]*+(?>#|$))",
					"while": "\\G(?!(?>\\.{3}|---)[\\x{85 2028 2029}\r\n\t ])",
					"name": "meta.document.yaml",
					"patterns": [
						{
							"include": "#block-node"
						}
					]
				}
			]
		},
		"block-node": {
			"patterns": [
				{
					"include": "#block-sequence"
				},
				{
					"include": "#block-mapping"
				},
				{
					"include": "#block-scalar"
				},
				{
					"include": "source.yaml.1.1#anchor-property"
				},
				{
					"include": "#tag-property"
				},
				{
					"include": "source.yaml.1.1#alias"
				},
				{
					"begin": "(?=\"|')",
					"while": "\\G",
					"patterns": [
						{
							"begin": "(?!\\G)",
							"while": "\\G",
							"patterns": [
								{
									"include": "source.yaml.1.1#presentation-detail"
								}
							]
						},
						{
							"include": "#double"
						},
						{
							"include": "source.yaml.1.1#single"
						}
					]
				},
				{
					"begin": "(?={)",
					"end": "$",
					"patterns": [
						{
							"include": "#flow-mapping"
						},
						{
							"include": "source.yaml.1.1#presentation-detail"
						}
					]
				},
				{
					"begin": "(?=\\[)",
					"end": "$",
					"patterns": [
						{
							"include": "#flow-sequence"
						},
						{
							"include": "source.yaml.1.1#presentation-detail"
						}
					]
				},
				{
					"include": "source.yaml.1.1#block-plain-out"
				},
				{
					"include": "source.yaml.1.1#presentation-detail"
				}
			]
		},
		"block-mapping": {
			"//": "The check for plain keys is expensive",
			"begin": "(?=((?<=[-?:]) )?+)(?<![^\t ][\t ]*+:|---)\\G( *+)([\t ]*+)((?>[!&*][^\\x{85 2028 2029}\r\n\t ]*+[\t ]++)*+)(?=(?>(?#Double Quote)\"(?>[^\\\\\"]++|\\\\.)*+\"|(?#Single Quote)'(?>[^']++|'')*+'|(?#Flow-Map){(?>[^\\x{85 2028 2029}}]++|}[ \t]*+(?!:[\\x{85 2028 2029}\r\n\t ]))++}|(?#Flow-Seq)\\[(?>[^\\x{85 2028 2029}\\]]++|][ \t]*+(?!:[\\x{85 2028 2029}\r\n\t ]))++]|(?#Plain)(?>[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FFFE FFFF}]|[?:-](?![\\x{85 2028 2029}\r\n\t ]))(?>[^:#]++|:(?![\\x{85 2028 2029}\r\n\t ])|(?<! |\t)#++)*+)?+(?#Map Value)[\t ]*+:[\\x{85 2028 2029}\r\n\t ]|(?#Explicit)\\?[\\x{85 2028 2029}\r\n\t ])",
			"while": "\\G(?>(\\1\\2)((?>[!&*][^\\x{85 2028 2029}\r\n\t ]*+[\t ]++)*+)((?>\t[\t ]*+)?+[^\\x{85 2028 2029}\r\n\t ?:\\-#!&*\"'\\[\\]{}0-9A-Za-z$()+./;<=\\\\^_~\\x{A0}-\\x{D7FF}\\x{E000}-\\x{FFFD}\\x{010000}-\\x{10FFFF}])?+|( *+)([\t ]*+[^\\x{85 2028 2029}\r\n#])?+)",
			"beginCaptures": {
				"2": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"3": {
					"name": "punctuation.whitespace.separator.yaml"
				},
				"4": {
					"comment": "May cause lag on long lines starting with a tag, anchor or alias",
					"patterns": [
						{
							"include": "#tag-property"
						},
						{
							"include": "source.yaml.1.1#anchor-property"
						},
						{
							"include": "source.yaml.1.1#alias"
						},
						{
							"include": "source.yaml.1.1#presentation-detail"
						}
					]
				}
			},
			"whileCaptures": {
				"1": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"2": {
					"comment": "May cause lag on long lines starting with a tag, anchor or alias",
					"patterns": [
						{
							"include": "#tag-property"
						},
						{
							"include": "source.yaml.1.1#anchor-property"
						},
						{
							"include": "source.yaml.1.1#alias"
						},
						{
							"include": "source.yaml.1.1#presentation-detail"
						}
					]
				},
				"3": {
					"name": "invalid.illegal.expected-indentation.yaml"
				},
				"4": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"5": {
					"name": "invalid.illegal.expected-indentation.yaml"
				}
			},
			"name": "meta.mapping.yaml",
			"patterns": [
				{
					"include": "#block-map-key-double"
				},
				{
					"include": "source.yaml#block-map-key-single"
				},
				{
					"include": "source.yaml.1.1#block-map-key-plain"
				},
				{
					"include": "#block-map-key-explicit"
				},
				{
					"include": "#block-map-value"
				},
				{
					"include": "#flow-mapping"
				},
				{
					"include": "#flow-sequence"
				},
				{
					"include": "source.yaml.1.1#presentation-detail"
				}
			]
		},
		"block-sequence": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-l+block-sequence",
			"begin": "(?=((?<=[-?:]) )?+)(?<![^\t ][\t ]*+:|---)\\G( *+)(-)(?=[\\x{85 2028 2029}\r\n\t ])",
			"while": "\\G(?>(\\1\\2)(?!-[\\x{85 2028 2029}\r\n\t ])((?>\t[\t ]*+)?+[^\\x{85 2028 2029}\r\n\t #\\]}])?+|(?!\\1\\2)( *+)([\t ]*+[^\\x{85 2028 2029}\r\n#])?+)",
			"beginCaptures": {
				"2": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"3": {
					"name": "punctuation.definition.block.sequence.item.yaml"
				}
			},
			"whileCaptures": {
				"1": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"2": {
					"name": "invalid.illegal.expected-indentation.yaml"
				},
				"3": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"4": {
					"name": "invalid.illegal.expected-indentation.yaml"
				}
			},
			"name": "meta.block.sequence.yaml",
			"patterns": [
				{
					"include": "#block-node"
				}
			]
		},
		"block-map-key-explicit": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-l-block-map-explicit-key",
			"begin": "(?=((?<=[-?:]) )?+)\\G( *+)(\\?)(?=[\\x{85 2028 2029}\r\n\t ])",
			"while": "\\G(?>(\\1\\2)(?![?:0-9A-Za-z$()+./;<=\\\\^_~\\x{A0}-\\x{D7FF}\\x{E000}-\\x{FFFD}\\x{010000}-\\x{10FFFF}&&[^\\x{2028 2029}]])((?>\t[\t ]*+)?+[^\\x{85 2028 2029}\r\n\t #\\-\\[\\]{}])?+|(?!\\1\\2)( *+)([\t ]*+[^\\x{85 2028 2029}\r\n#])?+)",
			"beginCaptures": {
				"2": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"3": {
					"name": "punctuation.definition.map.key.yaml"
				},
				"4": {
					"name": "punctuation.whitespace.separator.yaml"
				}
			},
			"whileCaptures": {
				"1": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"2": {
					"name": "invalid.illegal.expected-indentation.yaml"
				},
				"3": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"4": {
					"name": "invalid.illegal.expected-indentation.yaml"
				}
			},
			"name": "meta.map.explicit.yaml",
			"patterns": [
				{
					"include": "#key-double"
				},
				{
					"include": "source.yaml#key-single"
				},
				{
					"include": "source.yaml.1.1#flow-key-plain-out"
				},
				{
					"include": "#block-map-value"
				},
				{
					"include": "#block-node"
				}
			]
		},
		"block-map-key-double": {
			"comment": "https://yaml.org/spec/1.2.2/#double-quoted-style (BLOCK-KEY)",
			"begin": "\\G\"",
			"end": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.yaml"
				}
			},
			"name": "meta.map.key.yaml string.quoted.double.yaml entity.name.tag.yaml",
			"patterns": [
				{
					"match": ".[\t ]*+$",
					"name": "invalid.illegal.multiline-key.yaml"
				},
				{
					"match": "[^\t -\\x{10FFFF}]++",
					"name": "invalid.illegal.character.yaml"
				},
				{
					"include": "#double-escape"
				}
			]
		},
		"block-map-value": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-l-block-map-implicit-value",
			"//": "Assumming 3rd party preprocessing variables `{{...}}` turn into valid map-keys when inside a block-mapping",
			"begin": ":(?=[\\x{85 2028 2029}\r\n\t ])|(?<=}})(?=[\t ]++#|[\t ]*+$)",
			"while": "\\G(?![?:!\"'0-9A-Za-z$()+./;<=\\\\^_~\\[{\\x{A0}-\\x{D7FF}\\x{E000}-\\x{FFFD}\\x{010000}-\\x{10FFFF}&&[^\\x{2028 2029}]]|-[^\\x{85 2028 2029}\r\n\t ])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.separator.map.value.yaml"
				}
			},
			"name": "meta.map.value.yaml",
			"patterns": [
				{
					"include": "#block-node"
				}
			]
		},
		"block-scalar": {
			"comment": "https://yaml.org/spec/1.2.2/#81-block-scalar-styles",
			"patterns": [
				{
					"comment": "https://yaml.org/spec/1.2.2/#8111-block-indentation-indicator",
					"begin": "(?>(\\|)|(>))(?<chomp>[+-])?+([0-9])(?(<chomp>)|\\g<chomp>)?+",
					"while": "\\G(?> {\\4}| *+($|[^#]))",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.flow.block-scalar.literal.yaml"
						},
						"2": {
							"name": "keyword.control.flow.block-scalar.folded.yaml"
						},
						"3": {
							"name": "storage.modifier.chomping-indicator.yaml"
						},
						"4": {
							"name": "constant.numeric.indentation-indicator.yaml"
						}
					},
					"whileCaptures": {
						"0": {
							"name": "punctuation.whitespace.indentation.yaml"
						},
						"1": {
							"name": "invalid.illegal.expected-indentation.yaml"
						}
					},
					"name": "meta.scalar.yaml",
					"patterns": [
						{
							"begin": "$",
							"while": "\\G",
							"contentName": "string.unquoted.block.yaml",
							"patterns": [
								{
									"include": "source.yaml#non-printable"
								}
							]
						},
						{
							"begin": "\\G",
							"end": "$",
							"patterns": [
								{
									"include": "source.yaml.1.1#presentation-detail"
								}
							]
						}
					]
				},
				{
					"//": "Soooooooo many edge cases",
					"begin": "(?>(\\|)|(>))([+-]?+)",
					"while": "\\G",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.flow.block-scalar.literal.yaml"
						},
						"2": {
							"name": "keyword.control.flow.block-scalar.folded.yaml"
						},
						"3": {
							"name": "storage.modifier.chomping-indicator.yaml"
						}
					},
					"name": "meta.scalar.yaml",
					"patterns": [
						{
							"comment": "https://yaml.org/spec/1.2.2/#rule-l-literal-content",
							"begin": "$",
							"while": "\\G",
							"patterns": [
								{
									"comment": "https://yaml.org/spec/1.2.2/#rule-l-nb-literal-text",
									"//": "Find the highest indented line",
									"begin": "\\G( ++)$",
									"while": "\\G(?>(\\1)$|(?!\\1)( *+)($|.))",
									"captures": {
										"1": {
											"name": "punctuation.whitespace.indentation.yaml"
										},
										"2": {
											"name": "punctuation.whitespace.indentation.yaml"
										},
										"3": {
											"name": "invalid.illegal.expected-indentation.yaml"
										}
									},
									"contentName": "string.unquoted.block.yaml",
									"patterns": [
										{
											"include": "source.yaml#non-printable"
										}
									]
								},
								{
									"comment": "https://yaml.org/spec/1.2.2/#rule-b-nb-literal-next",
									"//": [
										"Funky wrapper function",
										"The `end` pattern clears the parent `\\G` anchor",
										"Affectively forcing this rule to only match at most once",
										"https://github.com/microsoft/vscode-textmate/issues/114"
									],
									"begin": "\\G(?!$)(?=( *+))",
									"end": "\\G(?!\\1)(?=[\t ]*+#)",
									"patterns": [
										{
											"comment": "https://yaml.org/spec/1.2.2/#rule-l-nb-literal-text",
											"begin": "\\G( *+)",
											"while": "\\G(?>(\\1)|( *+)($|[^\t#]|[\t ]++[^#]))",
											"captures": {
												"1": {
													"name": "punctuation.whitespace.indentation.yaml"
												},
												"2": {
													"name": "punctuation.whitespace.indentation.yaml"
												},
												"3": {
													"name": "invalid.illegal.expected-indentation.yaml"
												}
											},
											"contentName": "string.unquoted.block.yaml",
											"patterns": [
												{
													"include": "source.yaml#non-printable"
												}
											]
										}
									]
								},
								{
									"comment": "https://yaml.org/spec/1.2.2/#rule-l-chomped-empty",
									"begin": "(?!\\G)(?=[\t ]*+#)",
									"while": "\\G",
									"patterns": [
										{
											"include": "source.yaml.1.1#presentation-detail"
										}
									]
								}
							]
						},
						{
							"comment": "Header Comment",
							"begin": "\\G",
							"end": "$",
							"patterns": [
								{
									"include": "source.yaml.1.1#presentation-detail"
								}
							]
						}
					]
				}
			]
		},
		"flow-node": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-seq-entry (FLOW-IN)",
			"patterns": [
				{
					"begin": "(?=\\[|{)",
					"end": "(?=[:,\\]}])",
					"patterns": [
						{
							"begin": "(?!\\G)",
							"end": "(?=[:,\\]}])",
							"patterns": [
								{
									"include": "source.yaml.1.1#presentation-detail"
								}
							]
						},
						{
							"include": "#flow-mapping"
						},
						{
							"include": "#flow-sequence"
						}
					]
				},
				{
					"include": "source.yaml.1.1#anchor-property"
				},
				{
					"include": "#tag-property"
				},
				{
					"include": "source.yaml.1.1#alias"
				},
				{
					"begin": "(?=\"|')",
					"end": "(?=[:,\\]}])",
					"patterns": [
						{
							"begin": "(?!\\G)",
							"end": "(?=[:,\\]}])",
							"patterns": [
								{
									"include": "source.yaml.1.1#presentation-detail"
								}
							]
						},
						{
							"include": "#double"
						},
						{
							"include": "source.yaml.1.1#single"
						}
					]
				},
				{
					"include": "source.yaml.1.1#flow-plain-in"
				},
				{
					"include": "source.yaml.1.1#presentation-detail"
				}
			]
		},
		"flow-mapping": {
			"comment": "https://yaml.org/spec/1.2.2/#742-flow-mappings",
			"begin": "{",
			"end": "}",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.mapping.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.mapping.end.yaml"
				}
			},
			"name": "meta.flow.mapping.yaml",
			"patterns": [
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-s-flow-map-entries",
					"begin": "(?<={)\\G(?=[\\x{85 2028 2029}\r\n\t ,#])|,",
					"end": "(?=[^\\x{85 2028 2029}\r\n\t ,#])",
					"beginCaptures": {
						"0": {
							"name": "punctuation.separator.mapping.yaml"
						}
					},
					"patterns": [
						{
							"match": ",++",
							"name": "invalid.illegal.separator.sequence.yaml"
						},
						{
							"include": "source.yaml.1.1#presentation-detail"
						}
					]
				},
				{
					"include": "#flow-mapping-map-key"
				},
				{
					"include": "#flow-map-value-yaml"
				},
				{
					"include": "#flow-map-value-json"
				},
				{
					"include": "#flow-node"
				}
			]
		},
		"flow-sequence": {
			"comment": "https://yaml.org/spec/1.2.2/#741-flow-sequences",
			"begin": "\\[",
			"end": "]",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.sequence.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.sequence.end.yaml"
				}
			},
			"name": "meta.flow.sequence.yaml",
			"patterns": [
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-s-flow-seq-entries",
					"begin": "(?<=\\[)\\G(?=[\\x{85 2028 2029}\r\n\t ,#])|,",
					"end": "(?=[^\\x{85 2028 2029}\r\n\t ,#])",
					"beginCaptures": {
						"0": {
							"name": "punctuation.separator.sequence.yaml"
						}
					},
					"patterns": [
						{
							"match": ",++",
							"name": "invalid.illegal.separator.sequence.yaml"
						},
						{
							"include": "source.yaml.1.1#presentation-detail"
						}
					]
				},
				{
					"include": "#flow-sequence-map-key"
				},
				{
					"include": "#flow-map-value-yaml"
				},
				{
					"include": "#flow-map-value-json"
				},
				{
					"include": "#flow-node"
				}
			]
		},
		"flow-mapping-map-key": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-map-entry (FLOW-IN)",
			"patterns": [
				{
					"begin": "\\?(?=[\\x{85 2028 2029}\r\n\t ,\\[\\]{}])",
					"end": "(?=[,\\[\\]{}])",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.map.key.yaml"
						}
					},
					"name": "meta.flow.map.explicit.yaml",
					"patterns": [
						{
							"include": "#flow-mapping-map-key"
						},
						{
							"include": "#flow-map-value-yaml"
						},
						{
							"include": "#flow-map-value-json"
						},
						{
							"include": "#flow-node"
						}
					]
				},
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-map-implicit-entry (FLOW-IN)",
					"begin": "(?=(?>[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FFFE FFFF}]|[?:-](?![\\x{85 2028 2029}\r\n\t ,\\[\\]{}])))",
					"end": "(?=[,\\[\\]{}])",
					"name": "meta.flow.map.implicit.yaml",
					"patterns": [
						{
							"include": "source.yaml.1.1#flow-key-plain-in"
						},
						{
							"match": ":(?=\\[|{)",
							"name": "invalid.illegal.separator.map.yaml"
						},
						{
							"include": "#flow-map-value-yaml"
						},
						{
							"include": "source.yaml.1.1#presentation-detail"
						}
					]
				},
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-map-implicit-entry (FLOW-IN)",
					"begin": "(?=\"|')",
					"end": "(?=[,\\[\\]{}])",
					"name": "meta.flow.map.implicit.yaml",
					"patterns": [
						{
							"include": "#key-double"
						},
						{
							"include": "source.yaml#key-single"
						},
						{
							"include": "#flow-map-value-json"
						},
						{
							"include": "source.yaml.1.1#presentation-detail"
						}
					]
				}
			]
		},
		"flow-sequence-map-key": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-map-entry (FLOW-IN)",
			"patterns": [
				{
					"begin": "\\?(?=[\\x{85 2028 2029}\r\n\t ,\\[\\]{}])",
					"end": "(?=[,\\[\\]{}])",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.map.key.yaml"
						}
					},
					"name": "meta.flow.map.explicit.yaml",
					"patterns": [
						{
							"include": "#flow-mapping-map-key"
						},
						{
							"include": "#flow-map-value-yaml"
						},
						{
							"include": "#flow-map-value-json"
						},
						{
							"include": "#flow-node"
						}
					]
				},
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-map-implicit-entry (FLOW-IN)",
					"begin": "(?<=[\t ,\\[{]|^)(?=(?>[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FFFE FFFF}]|[?:-](?![\\x{85 2028 2029}\r\n\t ,\\[\\]{}]))(?>[^:#,\\[\\]{}]++|:(?![\\x{85 2028 2029}\r\n\t ,\\[\\]{}])|(?<! |\t)#++)*+:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}])",
					"end": "(?=[,\\[\\]{}])",
					"name": "meta.flow.map.implicit.yaml",
					"patterns": [
						{
							"include": "source.yaml.1.1#flow-key-plain-in"
						},
						{
							"match": ":(?=\\[|{)",
							"name": "invalid.illegal.separator.map.yaml"
						},
						{
							"include": "#flow-map-value-yaml"
						},
						{
							"include": "source.yaml.1.1#presentation-detail"
						}
					]
				},
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-map-implicit-entry (FLOW-IN)",
					"begin": "(?=(?>\"(?>[^\\\\\"]++|\\\\.)*+\"|'(?>[^']++|'')*+')[\t ]*+:)",
					"end": "(?=[,\\[\\]{}])",
					"name": "meta.flow.map.implicit.yaml",
					"patterns": [
						{
							"include": "#key-double"
						},
						{
							"include": "source.yaml#key-single"
						},
						{
							"include": "#flow-map-value-json"
						},
						{
							"include": "source.yaml.1.1#presentation-detail"
						}
					]
				}
			]
		},
		"flow-map-value-yaml": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-ns-flow-map-separate-value (FLOW-IN)",
			"begin": ":(?=[\\x{85 2028 2029}\r\n\t ,\\[\\]{}])",
			"end": "(?=[,\\]}])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.separator.map.value.yaml"
				}
			},
			"name": "meta.flow.pair.value.yaml",
			"patterns": [
				{
					"include": "#flow-node"
				}
			]
		},
		"flow-map-value-json": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-ns-flow-map-separate-value (FLOW-IN)",
			"begin": "(?<=(?>[\"'\\]}]|^)[\t ]*+):",
			"end": "(?=[,\\]}])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.separator.map.value.yaml"
				}
			},
			"name": "meta.flow.pair.value.yaml",
			"patterns": [
				{
					"include": "#flow-node"
				}
			]
		},
		"key-double": {
			"comment": "https://yaml.org/spec/1.2.2/#double-quoted-style (FLOW-OUT)",
			"begin": "\"",
			"end": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.yaml"
				}
			},
			"name": "meta.map.key.yaml string.quoted.double.yaml entity.name.tag.yaml",
			"patterns": [
				{
					"match": "[^\t -\\x{10FFFF}]++",
					"name": "invalid.illegal.character.yaml"
				},
				{
					"include": "#double-escape"
				}
			]
		},
		"double": {
			"comment": "https://yaml.org/spec/1.2.2/#double-quoted-style",
			"begin": "\"",
			"end": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.yaml"
				}
			},
			"name": "string.quoted.double.yaml",
			"patterns": [
				{
					"match": "(?<!\")\\G[\t ]++",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"match": "[\t ]++$",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"match": "[^\\x{85 2028 2029}\r\n\t -\\x{10FFFF}]++",
					"name": "invalid.illegal.character.yaml"
				},
				{
					"include": "#double-escape"
				}
			]
		},
		"double-escape": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-ns-esc-char",
			"patterns": [
				{
					"match": "\\\\[\\x{85 2028 2029}\r\n0abtnvfre \"\\\\N_LP^]",
					"name": "constant.character.escape.yaml"
				},
				{
					"match": "\\\\x[0-9a-fA-F]{2}",
					"name": "constant.character.escape.unicode.8-bit.yaml"
				},
				{
					"match": "\\\\u[0-9a-fA-F]{4}",
					"name": "constant.character.escape.unicode.16-bit.yaml"
				},
				{
					"match": "\\\\U[0-9a-fA-F]{8}",
					"name": "constant.character.escape.unicode.32-bit.yaml"
				},
				{
					"match": "\\\\(?>x[^\"]{2,0}|u[^\"]{4,0}|U[^\"]{8,0}|.)",
					"name": "invalid.illegal.constant.character.escape.yaml"
				}
			]
		},
		"tag-property": {
			"comment": "https://yaml.org/spec/1.0/#c-ns-tag-property",
			"//": [
				"!^",
				"!!private_ns-tag-char+",
				"!global_core_ns-tag-char+_no-:/!",
				"!global_vocabulary_az09-_/ns-tag-char",
				"!global_domain_ns-tag-char+.ns-tag-char+,1234(-12(-12)?)?/ns-tag-char*"
			],
			"begin": "(?=!)",
			"end": "(?=[\\x{2028 2029}\r\n\t ])",
			"name": "storage.type.tag.yaml",
			"patterns": [
				{
					"match": "\\G!(?=[\\x{85 2028 2029}\r\n\t ])",
					"name": "punctuation.definition.tag.non-specific.yaml"
				},
				{
					"comment": "https://yaml.org/spec/1.0/#c-ns-private-tag",
					"match": "\\G!!",
					"name": "punctuation.definition.tag.private.yaml"
				},
				{
					"comment": "https://yaml.org/spec/1.0/#ns-ns-global-tag",
					"match": "\\G!",
					"name": "punctuation.definition.tag.global.yaml"
				},
				{
					"comment": "https://yaml.org/spec/1.0/#c-prefix",
					"match": "\\^",
					"name": "punctuation.definition.tag.prefix.yaml"
				},
				{
					"match": "%[0-9a-fA-F]{2}",
					"name": "constant.character.escape.unicode.8-bit.yaml"
				},
				{
					"match": "%[^\\x{85 2028 2029}\r\n\t ]{2,0}",
					"name": "invalid.illegal.constant.character.escape.unicode.8-bit.yaml"
				},
				{
					"include": "#double-escape"
				},
				{
					"include": "source.yaml#non-printable"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/yaml/syntaxes/yaml-1.1.tmLanguage.json]---
Location: vscode-main/extensions/yaml/syntaxes/yaml-1.1.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/RedCMD/YAML-Syntax-Highlighter/blob/master/syntaxes/yaml-1.1.tmLanguage.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/RedCMD/YAML-Syntax-Highlighter/commit/dfd7e5f4f71f9695c5d8697ca57f81240165aa04",
	"name": "YAML 1.1",
	"scopeName": "source.yaml.1.1",
	"comment": "https://yaml.org/spec/1.1/",
	"patterns": [
		{
			"include": "#stream"
		}
	],
	"repository": {
		"stream": {
			"patterns": [
				{
					"comment": "allows me to just use `\\G` instead of the performance heavy `(^|\\G)`",
					"begin": "^(?!\\G)",
					"while": "^",
					"name": "meta.stream.yaml",
					"patterns": [
						{
							"include": "#byte-order-mark"
						},
						{
							"include": "#directives"
						},
						{
							"include": "#document"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"begin": "\\G",
					"while": "\\G",
					"name": "meta.stream.yaml",
					"patterns": [
						{
							"include": "#byte-order-mark"
						},
						{
							"include": "#directives"
						},
						{
							"include": "#document"
						},
						{
							"include": "#presentation-detail"
						}
					]
				}
			]
		},
		"directive-YAML": {
			"comment": "https://yaml.org/spec/1.2.2/#681-yaml-directives",
			"begin": "(?=%YAML[ \t]+1\\.1(?=[\\x{85 2028 2029}\r\n\t ]))",
			"end": "\\G(?=%(?!YAML[ \t]+1\\.1))",
			"name": "meta.1.1.yaml",
			"patterns": [
				{
					"comment": "https://yaml.org/spec/1.2.2/#681-yaml-directives",
					"begin": "\\G(%)(YAML)([ \t]+)(1\\.1)",
					"while": "\\G(?!---[\\x{85 2028 2029}\r\n\t ])",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.directive.begin.yaml"
						},
						"2": {
							"name": "keyword.other.directive.yaml.yaml"
						},
						"3": {
							"name": "punctuation.whitespace.separator.yaml"
						},
						"4": {
							"name": "constant.numeric.yaml-version.yaml"
						}
					},
					"name": "meta.directives.yaml",
					"patterns": [
						{
							"include": "#directive-invalid"
						},
						{
							"include": "#directives"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"begin": "\\G(?=---[\\x{85 2028 2029}\r\n\t ])",
					"while": "\\G(?!%)",
					"patterns": [
						{
							"include": "#document"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"include": "#presentation-detail"
				}
			]
		},
		"directives": {
			"comment": "https://yaml.org/spec/1.2.2/#68-directives",
			"patterns": [
				{
					"include": "source.yaml.1.3#directive-YAML"
				},
				{
					"include": "source.yaml.1.2#directive-YAML"
				},
				{
					"include": "source.yaml.1.1#directive-YAML"
				},
				{
					"include": "source.yaml.1.0#directive-YAML"
				},
				{
					"begin": "(?=%)",
					"while": "\\G(?!%|---[\\x{85 2028 2029}\r\n\t ])",
					"name": "meta.directives.yaml",
					"patterns": [
						{
							"comment": "https://yaml.org/spec/1.2.2/#682-tag-directives",
							"begin": "\\G(%)(TAG)(?>([\t ]++)((!)(?>[0-9A-Za-z-]*+(!))?+))?+",
							"end": "$",
							"applyEndPatternLast": true,
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.directive.begin.yaml"
								},
								"2": {
									"name": "keyword.other.directive.tag.yaml"
								},
								"3": {
									"name": "punctuation.whitespace.separator.yaml"
								},
								"4": {
									"name": "storage.type.tag-handle.yaml"
								},
								"5": {
									"name": "punctuation.definition.tag.begin.yaml"
								},
								"6": {
									"name": "punctuation.definition.tag.end.yaml"
								},
								"comment": "https://yaml.org/spec/1.2.2/#rule-c-tag-handle"
							},
							"patterns": [
								{
									"comment": "technically the beginning should only validate against a valid uri scheme [A-Za-z][A-Za-z0-9.+-]*",
									"begin": "\\G[\t ]++(?!#)",
									"end": "(?=[\\x{85 2028 2029}\r\n\t ])",
									"beginCaptures": {
										"0": {
											"name": "punctuation.whitespace.separator.yaml"
										}
									},
									"contentName": "support.type.tag-prefix.yaml",
									"patterns": [
										{
											"match": "%[0-9a-fA-F]{2}",
											"name": "constant.character.escape.unicode.8-bit.yaml"
										},
										{
											"match": "%[^\\x{85 2028 2029}\r\n\t ]{2,0}",
											"name": "invalid.illegal.constant.character.escape.unicode.8-bit.yaml"
										},
										{
											"match": "\\G[,\\[\\]{}]",
											"name": "invalid.illegal.character.uri.yaml"
										},
										{
											"include": "source.yaml#non-printable"
										},
										{
											"match": "[^\\x{85 2028 2029}\r\n\t a-zA-Z0-9-#;/?:@&=+$,_.!~*'()\\[\\]]++",
											"name": "invalid.illegal.unrecognized.yaml"
										}
									]
								},
								{
									"include": "#presentation-detail"
								}
							]
						},
						{
							"comment": "https://yaml.org/spec/1.2.2/#rule-ns-reserved-directive",
							"begin": "(%)([^ \\p{Cntrl}\\p{Surrogate}\\x{2028 2029 FFFE FFFF}]++)",
							"end": "$",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.directive.begin.yaml"
								},
								"2": {
									"name": "keyword.other.directive.other.yaml"
								}
							},
							"patterns": [
								{
									"match": "\\G([\t ]++)([^ \\p{Cntrl}\\p{Surrogate}\\x{2028 2029 FFFE FFFF}]++)",
									"captures": {
										"1": {
											"name": "punctuation.whitespace.separator.yaml"
										},
										"2": {
											"name": "string.unquoted.directive-name.yaml"
										}
									}
								},
								{
									"match": "([\t ]++)([^ \\p{Cntrl}\\p{Surrogate}\\x{2028 2029 FFFE FFFF}]++)",
									"captures": {
										"1": {
											"name": "punctuation.whitespace.separator.yaml"
										},
										"2": {
											"name": "string.unquoted.directive-parameter.yaml"
										}
									}
								},
								{
									"include": "#presentation-detail"
								}
							]
						},
						{
							"match": "\\G\\.{3}(?=[\\x{85 2028 2029}\r\n\t ])",
							"name": "invalid.illegal.entity.other.document.end.yaml"
						},
						{
							"include": "#presentation-detail"
						}
					]
				}
			]
		},
		"directive-invalid": {
			"patterns": [
				{
					"match": "\\G\\.{3}(?=[\\x{85 2028 2029}\r\n\t ])",
					"name": "invalid.illegal.entity.other.document.end.yaml"
				},
				{
					"begin": "\\G(%)(YAML)",
					"end": "$",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.directive.begin.yaml"
						},
						"2": {
							"name": "invalid.illegal.keyword.other.directive.yaml.yaml"
						}
					},
					"name": "meta.directive.yaml",
					"patterns": [
						{
							"match": "\\G([\t ]++|:)([0-9]++\\.[0-9]++)?+",
							"captures": {
								"1": {
									"name": "punctuation.whitespace.separator.yaml"
								},
								"2": {
									"name": "constant.numeric.yaml-version.yaml"
								}
							}
						},
						{
							"include": "#presentation-detail"
						}
					]
				}
			]
		},
		"document": {
			"comment": "https://yaml.org/spec/1.2.2/#91-documents",
			"patterns": [
				{
					"begin": "---(?=[\\x{85 2028 2029}\r\n\t ])",
					"while": "\\G(?!(?>\\.{3}|---)[\\x{85 2028 2029}\r\n\t ])",
					"beginCaptures": {
						"0": {
							"name": "entity.other.document.begin.yaml"
						}
					},
					"name": "meta.document.yaml",
					"patterns": [
						{
							"include": "#block-node"
						}
					]
				},
				{
					"begin": "(?=\\.{3}[\\x{85 2028 2029}\r\n\t ])",
					"while": "\\G(?=[\t \\x{FEFF}]*+(?>#|$))",
					"patterns": [
						{
							"begin": "\\G\\.{3}",
							"end": "$",
							"beginCaptures": {
								"0": {
									"name": "entity.other.document.end.yaml"
								}
							},
							"patterns": [
								{
									"include": "#presentation-detail"
								}
							]
						},
						{
							"include": "#byte-order-mark"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"begin": "\\G(?!%|[\t \\x{FEFF}]*+(?>#|$))",
					"while": "\\G(?!(?>\\.{3}|---)[\\x{85 2028 2029}\r\n\t ])",
					"name": "meta.document.yaml",
					"patterns": [
						{
							"include": "#block-node"
						}
					]
				}
			]
		},
		"block-node": {
			"patterns": [
				{
					"include": "#block-sequence"
				},
				{
					"include": "#block-mapping"
				},
				{
					"include": "source.yaml.1.2#block-scalar"
				},
				{
					"include": "#anchor-property"
				},
				{
					"include": "#tag-property"
				},
				{
					"include": "#alias"
				},
				{
					"begin": "(?=\"|')",
					"while": "\\G",
					"patterns": [
						{
							"begin": "(?!\\G)",
							"while": "\\G",
							"patterns": [
								{
									"include": "#presentation-detail"
								}
							]
						},
						{
							"include": "#double"
						},
						{
							"include": "#single"
						}
					]
				},
				{
					"begin": "(?={)",
					"end": "$",
					"patterns": [
						{
							"include": "#flow-mapping"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"begin": "(?=\\[)",
					"end": "$",
					"patterns": [
						{
							"include": "#flow-sequence"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"include": "#block-plain-out"
				},
				{
					"include": "#presentation-detail"
				}
			]
		},
		"block-mapping": {
			"//": "The check for plain keys is expensive",
			"begin": "(?=((?<=[-?:]) )?+)(?<![^\t ][\t ]*+:|---)\\G( *+)([\t ]*+)((?>[!&*][^\\x{85 2028 2029}\r\n\t ]*+[\t ]++)*+)(?=(?>(?#Double Quote)\"(?>[^\\\\\"]++|\\\\.)*+\"|(?#Single Quote)'(?>[^']++|'')*+'|(?#Flow-Map){(?>[^\\x{85 2028 2029}}]++|}[ \t]*+(?!:[\\x{85 2028 2029}\r\n\t ]))++}|(?#Flow-Seq)\\[(?>[^\\x{85 2028 2029}\\]]++|][ \t]*+(?!:[\\x{85 2028 2029}\r\n\t ]))++]|(?#Plain)(?>[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FFFE FFFF}]|[?:-](?![\\x{85 2028 2029}\r\n\t ]))(?>[^:#]++|:(?![\\x{85 2028 2029}\r\n\t ])|(?<! |\t)#++)*+)?+(?#Map Value)[\t ]*+:[\\x{85 2028 2029}\r\n\t ]|(?#Explicit)\\?[\\x{85 2028 2029}\r\n\t ])",
			"while": "\\G(?>(\\1\\2)((?>[!&*][^\\x{85 2028 2029}\r\n\t ]*+[\t ]++)*+)((?>\t[\t ]*+)?+[^\\x{85 2028 2029}\r\n\t ?:\\-#!&*\"'\\[\\]{}0-9A-Za-z$()+./;<=\\\\^_~\\x{A0}-\\x{D7FF}\\x{E000}-\\x{FFFD}\\x{010000}-\\x{10FFFF}])?+|( *+)([\t ]*+[^\\x{85 2028 2029}\r\n#])?+)",
			"beginCaptures": {
				"2": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"3": {
					"name": "punctuation.whitespace.separator.yaml"
				},
				"4": {
					"comment": "May cause lag on long lines starting with a tag, anchor or alias",
					"patterns": [
						{
							"include": "#tag-property"
						},
						{
							"include": "#anchor-property"
						},
						{
							"include": "#alias"
						},
						{
							"include": "#presentation-detail"
						}
					]
				}
			},
			"whileCaptures": {
				"1": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"2": {
					"comment": "May cause lag on long lines starting with a tag, anchor or alias",
					"patterns": [
						{
							"include": "#tag-property"
						},
						{
							"include": "#anchor-property"
						},
						{
							"include": "#alias"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				"3": {
					"name": "invalid.illegal.expected-indentation.yaml"
				},
				"4": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"5": {
					"name": "invalid.illegal.expected-indentation.yaml"
				}
			},
			"name": "meta.mapping.yaml",
			"patterns": [
				{
					"include": "#block-map-key-double"
				},
				{
					"include": "source.yaml#block-map-key-single"
				},
				{
					"include": "#block-map-key-plain"
				},
				{
					"include": "#block-map-key-explicit"
				},
				{
					"include": "#block-map-value"
				},
				{
					"include": "#flow-mapping"
				},
				{
					"include": "#flow-sequence"
				},
				{
					"include": "#presentation-detail"
				}
			]
		},
		"block-sequence": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-l+block-sequence",
			"begin": "(?=((?<=[-?:]) )?+)(?<![^\t ][\t ]*+:|---)\\G( *+)(-)(?=[\\x{85 2028 2029}\r\n\t ])",
			"while": "\\G(?>(\\1\\2)(?!-[\\x{85 2028 2029}\r\n\t ])((?>\t[\t ]*+)?+[^\\x{85 2028 2029}\r\n\t #\\]}])?+|(?!\\1\\2)( *+)([\t ]*+[^\\x{85 2028 2029}\r\n#])?+)",
			"beginCaptures": {
				"2": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"3": {
					"name": "punctuation.definition.block.sequence.item.yaml"
				}
			},
			"whileCaptures": {
				"1": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"2": {
					"name": "invalid.illegal.expected-indentation.yaml"
				},
				"3": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"4": {
					"name": "invalid.illegal.expected-indentation.yaml"
				}
			},
			"name": "meta.block.sequence.yaml",
			"patterns": [
				{
					"include": "#block-node"
				}
			]
		},
		"block-map-key-explicit": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-l-block-map-explicit-key",
			"begin": "(?=((?<=[-?:]) )?+)\\G( *+)(\\?)(?=[\\x{85 2028 2029}\r\n\t ])",
			"while": "\\G(?>(\\1\\2)(?![?:0-9A-Za-z$()+./;<=\\\\^_~\\x{A0}-\\x{D7FF}\\x{E000}-\\x{FFFD}\\x{010000}-\\x{10FFFF}&&[^\\x{2028 2029}]])((?>\t[\t ]*+)?+[^\\x{85 2028 2029}\r\n\t #\\-\\[\\]{}])?+|(?!\\1\\2)( *+)([\t ]*+[^\\x{85 2028 2029}\r\n#])?+)",
			"beginCaptures": {
				"2": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"3": {
					"name": "punctuation.definition.map.key.yaml"
				},
				"4": {
					"name": "punctuation.whitespace.separator.yaml"
				}
			},
			"whileCaptures": {
				"1": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"2": {
					"name": "invalid.illegal.expected-indentation.yaml"
				},
				"3": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"4": {
					"name": "invalid.illegal.expected-indentation.yaml"
				}
			},
			"name": "meta.map.explicit.yaml",
			"patterns": [
				{
					"include": "#key-double"
				},
				{
					"include": "source.yaml#key-single"
				},
				{
					"include": "#flow-key-plain-out"
				},
				{
					"include": "#block-map-value"
				},
				{
					"include": "#block-node"
				}
			]
		},
		"block-map-key-double": {
			"comment": "https://yaml.org/spec/1.2.2/#double-quoted-style (BLOCK-KEY)",
			"begin": "\\G\"",
			"end": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.yaml"
				}
			},
			"name": "meta.map.key.yaml string.quoted.double.yaml entity.name.tag.yaml",
			"patterns": [
				{
					"match": ".[\t ]*+$",
					"name": "invalid.illegal.multiline-key.yaml"
				},
				{
					"match": "[^\t -\\x{10FFFF}]++",
					"name": "invalid.illegal.character.yaml"
				},
				{
					"include": "#double-escape"
				}
			]
		},
		"block-map-key-plain": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-plain-one-line (BLOCK-KEY)",
			"begin": "\\G(?=[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FFFE FFFF}]|[?:-](?![\\x{85 2028 2029}\r\n\t ]))",
			"end": "(?=[\t ]*+:[\\x{85 2028 2029}\r\n\t ]|(?>[\t ]++|\\G)#)",
			"name": "meta.map.key.yaml string.unquoted.plain.yaml entity.name.tag.yaml",
			"patterns": [
				{
					"include": "#tag-implicit-plain-out"
				},
				{
					"match": "\\G([\t ]++)(.)",
					"captures": {
						"1": {
							"name": "punctuation.whitespace.separator.yaml"
						},
						"2": {
							"name": "invalid.illegal.multiline-key.yaml"
						}
					}
				},
				{
					"match": "[\t ]++$",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"include": "source.yaml#non-printable"
				}
			]
		},
		"block-map-value": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-l-block-map-implicit-value",
			"//": "Assumming 3rd party preprocessing variables `{{...}}` turn into valid map-keys when inside a block-mapping",
			"begin": ":(?=[\\x{85 2028 2029}\r\n\t ])|(?<=}})(?=[\t ]++#|[\t ]*+$)",
			"while": "\\G(?![?:!\"'0-9A-Za-z$()+./;<=\\\\^_~\\[{\\x{A0}-\\x{D7FF}\\x{E000}-\\x{FFFD}\\x{010000}-\\x{10FFFF}&&[^\\x{2028 2029}]]|-[^\\x{85 2028 2029}\r\n\t ])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.separator.map.value.yaml"
				}
			},
			"name": "meta.map.value.yaml",
			"patterns": [
				{
					"include": "#block-node"
				}
			]
		},
		"block-plain-out": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-plain-multi-line (FLOW-OUT)",
			"begin": "(?=[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FFFE FFFF}]|[?:-](?![\\x{85 2028 2029}\r\n\t ]))",
			"while": "\\G",
			"patterns": [
				{
					"begin": "\\G",
					"end": "(?=(?>[\t ]++|\\G)#)",
					"name": "string.unquoted.plain.out.yaml",
					"patterns": [
						{
							"include": "#tag-implicit-plain-out"
						},
						{
							"match": ":(?=[\\x{85 2028 2029}\r\n\t ])",
							"name": "invalid.illegal.multiline-key.yaml"
						},
						{
							"match": "\\G[\t ]++",
							"name": "punctuation.whitespace.separator.yaml"
						},
						{
							"match": "[\t ]++$",
							"name": "punctuation.whitespace.separator.yaml"
						},
						{
							"include": "source.yaml#non-printable"
						}
					]
				},
				{
					"begin": "(?!\\G)",
					"while": "\\G",
					"patterns": [
						{
							"include": "#presentation-detail"
						}
					]
				}
			]
		},
		"flow-node": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-seq-entry (FLOW-IN)",
			"patterns": [
				{
					"begin": "(?=\\[|{)",
					"end": "(?=[:,\\]}])",
					"patterns": [
						{
							"begin": "(?!\\G)",
							"end": "(?=[:,\\]}])",
							"patterns": [
								{
									"include": "#presentation-detail"
								}
							]
						},
						{
							"include": "#flow-mapping"
						},
						{
							"include": "#flow-sequence"
						}
					]
				},
				{
					"include": "#anchor-property"
				},
				{
					"include": "#tag-property"
				},
				{
					"include": "#alias"
				},
				{
					"begin": "(?=\"|')",
					"end": "(?=[:,\\]}])",
					"patterns": [
						{
							"begin": "(?!\\G)",
							"end": "(?=[:,\\]}])",
							"patterns": [
								{
									"include": "#presentation-detail"
								}
							]
						},
						{
							"include": "#double"
						},
						{
							"include": "#single"
						}
					]
				},
				{
					"include": "#flow-plain-in"
				},
				{
					"include": "#presentation-detail"
				}
			]
		},
		"flow-mapping": {
			"comment": "https://yaml.org/spec/1.2.2/#742-flow-mappings",
			"begin": "{",
			"end": "}",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.mapping.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.mapping.end.yaml"
				}
			},
			"name": "meta.flow.mapping.yaml",
			"patterns": [
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-s-flow-map-entries",
					"begin": "(?<={)\\G(?=[\\x{85 2028 2029}\r\n\t ,#])|,",
					"end": "(?=[^\\x{85 2028 2029}\r\n\t ,#])",
					"beginCaptures": {
						"0": {
							"name": "punctuation.separator.mapping.yaml"
						}
					},
					"patterns": [
						{
							"match": ",++",
							"name": "invalid.illegal.separator.sequence.yaml"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"include": "#flow-mapping-map-key"
				},
				{
					"include": "#flow-map-value-yaml"
				},
				{
					"include": "#flow-map-value-json"
				},
				{
					"include": "#flow-node"
				}
			]
		},
		"flow-sequence": {
			"comment": "https://yaml.org/spec/1.2.2/#741-flow-sequences",
			"begin": "\\[",
			"end": "]",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.sequence.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.sequence.end.yaml"
				}
			},
			"name": "meta.flow.sequence.yaml",
			"patterns": [
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-s-flow-seq-entries",
					"begin": "(?<=\\[)\\G(?=[\\x{85 2028 2029}\r\n\t ,#])|,",
					"end": "(?=[^\\x{85 2028 2029}\r\n\t ,#])",
					"beginCaptures": {
						"0": {
							"name": "punctuation.separator.sequence.yaml"
						}
					},
					"patterns": [
						{
							"match": ",++",
							"name": "invalid.illegal.separator.sequence.yaml"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"include": "#flow-sequence-map-key"
				},
				{
					"include": "#flow-map-value-yaml"
				},
				{
					"include": "#flow-map-value-json"
				},
				{
					"include": "#flow-node"
				}
			]
		},
		"flow-mapping-map-key": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-map-entry (FLOW-IN)",
			"patterns": [
				{
					"begin": "\\?(?=[\\x{85 2028 2029}\r\n\t ,\\[\\]{}])",
					"end": "(?=[,\\[\\]{}])",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.map.key.yaml"
						}
					},
					"name": "meta.flow.map.explicit.yaml",
					"patterns": [
						{
							"include": "#flow-mapping-map-key"
						},
						{
							"include": "#flow-map-value-yaml"
						},
						{
							"include": "#flow-map-value-json"
						},
						{
							"include": "#flow-node"
						}
					]
				},
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-map-implicit-entry (FLOW-IN)",
					"begin": "(?=(?>[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FFFE FFFF}]|[?:-](?![\\x{85 2028 2029}\r\n\t ,\\[\\]{}])))",
					"end": "(?=[,\\[\\]{}])",
					"name": "meta.flow.map.implicit.yaml",
					"patterns": [
						{
							"include": "#flow-key-plain-in"
						},
						{
							"match": ":(?=\\[|{)",
							"name": "invalid.illegal.separator.map.yaml"
						},
						{
							"include": "#flow-map-value-yaml"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-map-implicit-entry (FLOW-IN)",
					"begin": "(?=\"|')",
					"end": "(?=[,\\[\\]{}])",
					"name": "meta.flow.map.implicit.yaml",
					"patterns": [
						{
							"include": "#key-double"
						},
						{
							"include": "source.yaml#key-single"
						},
						{
							"include": "#flow-map-value-json"
						},
						{
							"include": "#presentation-detail"
						}
					]
				}
			]
		},
		"flow-sequence-map-key": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-map-entry (FLOW-IN)",
			"patterns": [
				{
					"begin": "\\?(?=[\\x{85 2028 2029}\r\n\t ,\\[\\]{}])",
					"end": "(?=[,\\[\\]{}])",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.map.key.yaml"
						}
					},
					"name": "meta.flow.map.explicit.yaml",
					"patterns": [
						{
							"include": "#flow-mapping-map-key"
						},
						{
							"include": "#flow-map-value-yaml"
						},
						{
							"include": "#flow-map-value-json"
						},
						{
							"include": "#flow-node"
						}
					]
				},
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-map-implicit-entry (FLOW-IN)",
					"begin": "(?<=[\t ,\\[{]|^)(?=(?>[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FFFE FFFF}]|[?:-](?![\\x{85 2028 2029}\r\n\t ,\\[\\]{}]))(?>[^:#,\\[\\]{}]++|:(?![\\x{85 2028 2029}\r\n\t ,\\[\\]{}])|(?<! |\t)#++)*+:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}])",
					"end": "(?=[,\\[\\]{}])",
					"name": "meta.flow.map.implicit.yaml",
					"patterns": [
						{
							"include": "#flow-key-plain-in"
						},
						{
							"match": ":(?=\\[|{)",
							"name": "invalid.illegal.separator.map.yaml"
						},
						{
							"include": "#flow-map-value-yaml"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-map-implicit-entry (FLOW-IN)",
					"begin": "(?=(?>\"(?>[^\\\\\"]++|\\\\.)*+\"|'(?>[^']++|'')*+')[\t ]*+:)",
					"end": "(?=[,\\[\\]{}])",
					"name": "meta.flow.map.implicit.yaml",
					"patterns": [
						{
							"include": "#key-double"
						},
						{
							"include": "source.yaml#key-single"
						},
						{
							"include": "#flow-map-value-json"
						},
						{
							"include": "#presentation-detail"
						}
					]
				}
			]
		},
		"flow-map-value-yaml": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-ns-flow-map-separate-value (FLOW-IN)",
			"begin": ":(?=[\\x{85 2028 2029}\r\n\t ,\\[\\]{}])",
			"end": "(?=[,\\]}])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.separator.map.value.yaml"
				}
			},
			"name": "meta.flow.pair.value.yaml",
			"patterns": [
				{
					"include": "#flow-node"
				}
			]
		},
		"flow-map-value-json": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-ns-flow-map-separate-value (FLOW-IN)",
			"begin": "(?<=(?>[\"'\\]}]|^)[\t ]*+):",
			"end": "(?=[,\\]}])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.separator.map.value.yaml"
				}
			},
			"name": "meta.flow.pair.value.yaml",
			"patterns": [
				{
					"include": "#flow-node"
				}
			]
		},
		"flow-plain-in": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-plain-multi-line (FLOW-IN)",
			"begin": "(?=[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FFFE FFFF}]|[?:-](?![\\x{85 2028 2029}\r\n\t ,\\[\\]{}]))",
			"end": "(?=(?>[\t ]++|\\G)#|[\t ]*+[,\\[\\]{}])",
			"name": "string.unquoted.plain.in.yaml",
			"patterns": [
				{
					"include": "#tag-implicit-plain-in"
				},
				{
					"match": "\\G[\t ]++",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"match": "[\t ]++$",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"match": ":(?=[\\x{85 2028 2029}\r\n\t ,\\[\\]{}])",
					"name": "invalid.illegal.multiline-key.yaml"
				},
				{
					"include": "source.yaml#non-printable"
				}
			]
		},
		"flow-key-plain-out": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-plain-one-line (FLOW-OUT)",
			"begin": "(?=[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FFFE FFFF}]|[?:-](?![\\x{85 2028 2029}\r\n\t ]))",
			"end": "(?=[\t ]*+:[\\x{85 2028 2029}\r\n\t ]|[\t ]++#)",
			"name": "meta.map.key.yaml string.unquoted.plain.yaml entity.name.tag.yaml",
			"patterns": [
				{
					"include": "#tag-implicit-plain-out"
				},
				{
					"match": "\\G[\t ]++",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"match": "[\t ]++$",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"include": "source.yaml#non-printable"
				}
			]
		},
		"flow-key-plain-in": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-s-implicit-yaml-key (FLOW-KEY)",
			"begin": "\\G(?![\\x{85 2028 2029}\r\n\t #])",
			"end": "(?=[\t ]*+(?>:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}]|[,\\[\\]{}])|[\t ]++#)",
			"name": "meta.flow.map.key.yaml string.unquoted.plain.in.yaml entity.name.tag.yaml",
			"patterns": [
				{
					"include": "#tag-implicit-plain-in"
				},
				{
					"include": "source.yaml#non-printable"
				}
			]
		},
		"key-double": {
			"comment": "https://yaml.org/spec/1.2.2/#double-quoted-style (FLOW-OUT)",
			"begin": "\"",
			"end": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.yaml"
				}
			},
			"name": "meta.map.key.yaml string.quoted.double.yaml entity.name.tag.yaml",
			"patterns": [
				{
					"match": "[^\t -\\x{10FFFF}]++",
					"name": "invalid.illegal.character.yaml"
				},
				{
					"include": "#double-escape"
				}
			]
		},
		"double": {
			"comment": "https://yaml.org/spec/1.2.2/#double-quoted-style",
			"begin": "\"",
			"end": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.yaml"
				}
			},
			"name": "string.quoted.double.yaml",
			"patterns": [
				{
					"match": "(?<!\")\\G[\t ]++",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"match": "[\t ]++$",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"match": "[^\\x{85 2028 2029}\r\n\t -\\x{10FFFF}]++",
					"name": "invalid.illegal.character.yaml"
				},
				{
					"include": "#double-escape"
				}
			]
		},
		"single": {
			"comment": "https://yaml.org/spec/1.2.2/#single-quoted-style",
			"begin": "'",
			"end": "'(?!')",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.yaml"
				}
			},
			"name": "string.quoted.single.yaml",
			"patterns": [
				{
					"match": "(?<!')\\G[\t ]++",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"match": "[\t ]++$",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"match": "[^\\x{85 2028 2029}\r\n\t -\\x{10FFFF}]++",
					"name": "invalid.illegal.character.yaml"
				},
				{
					"match": "''",
					"name": "constant.character.escape.single-quote.yaml"
				}
			]
		},
		"double-escape": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-ns-esc-char",
			"patterns": [
				{
					"match": "\\\\[\\x{85 2028 2029}\r\n\t0abtnvfre \"\\\\N_LP]",
					"name": "constant.character.escape.yaml"
				},
				{
					"match": "\\\\x[0-9a-fA-F]{2}",
					"name": "constant.character.escape.unicode.8-bit.yaml"
				},
				{
					"match": "\\\\u[0-9a-fA-F]{4}",
					"name": "constant.character.escape.unicode.16-bit.yaml"
				},
				{
					"match": "\\\\U[0-9a-fA-F]{8}",
					"name": "constant.character.escape.unicode.32-bit.yaml"
				},
				{
					"match": "\\\\(?>x[^\"]{2,0}|u[^\"]{4,0}|U[^\"]{8,0}|.)",
					"name": "invalid.illegal.constant.character.escape.yaml"
				}
			]
		},
		"tag-implicit-plain-in": {
			"comment": "https://yaml.org/type/index.html",
			"patterns": [
				{
					"match": "\\G(?>null|Null|NULL|~)(?=[\t ]++#|[\t ]*+(?>[\\x{85 2028 2029}\r\n,\\]}]|:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}]))",
					"name": "constant.language.null.yaml"
				},
				{
					"match": "\\G(?>true|True|TRUE|false|False|FALSE|y|Y|yes|Yes|YES|n|N|no|No|NO|on|On|ON|off|Off|OFF)(?=[\t ]++#|[\t ]*+(?>[\\x{85 2028 2029}\r\n,\\]}]|:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}]))",
					"name": "constant.language.boolean.yaml"
				},
				{
					"match": "\\G[-+]?+(0|[1-9][0-9_]*+)(?=[\t ]++#|[\t ]*+(?>[\\x{85 2028 2029}\r\n,\\]}]|:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}]))",
					"name": "constant.numeric.integer.decimal.yaml"
				},
				{
					"match": "\\G[-+]?+0b[0-1_]++(?=[\t ]++#|[\t ]*+(?>[\\x{85 2028 2029}\r\n,\\]}]|:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}]))",
					"name": "constant.numeric.integer.binary.yaml"
				},
				{
					"match": "\\G[-+]?0[0-7_]++(?=[\t ]++#|[\t ]*+(?>[\\x{85 2028 2029}\r\n,\\]}]|:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}]))",
					"name": "constant.numeric.integer.octal.yaml"
				},
				{
					"match": "\\G[-+]?+0x[0-9a-fA-F_]++(?=[\t ]++#|[\t ]*+(?>[\\x{85 2028 2029}\r\n,\\]}]|:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}]))",
					"name": "constant.numeric.integer.hexadecimal.yaml"
				},
				{
					"match": "\\G[-+]?+[1-9][0-9_]*+(?>:[0-5]?[0-9])++(?=[\t ]++#|[\t ]*+(?>[\\x{85 2028 2029}\r\n,\\]}]|:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}]))",
					"name": "constant.numeric.integer.Sexagesimal.yaml"
				},
				{
					"match": "\\G[-+]?+(?>[0-9][0-9_]*+)?+\\.[0-9.]*+(?>[eE][-+][0-9]+)?+(?=[\t ]++#|[\t ]*+(?>[\\x{85 2028 2029}\r\n,\\]}]|:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}]))",
					"name": "constant.numeric.float.decimal.yaml"
				},
				{
					"match": "\\G[-+]?+[0-9][0-9_]*+(?>:[0-5]?[0-9])++\\.[0-9_]*+(?=[\t ]++#|[\t ]*+(?>[\\x{85 2028 2029}\r\n,\\]}]|:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}]))",
					"name": "constant.numeric.float.Sexagesimal.yaml"
				},
				{
					"match": "\\G[-+]?+\\.(?>inf|Inf|INF)(?=[\t ]++#|[\t ]*+(?>[\\x{85 2028 2029}\r\n,\\]}]|:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}]))",
					"name": "constant.numeric.float.inf.yaml"
				},
				{
					"match": "\\G\\.(?>nan|NaN|NAN)(?=[\t ]++#|[\t ]*+(?>[\\x{85 2028 2029}\r\n,\\]}]|:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}]))",
					"name": "constant.numeric.float.nan.yaml"
				},
				{
					"comment": "https://www.w3.org/TR/NOTE-datetime does not allow spaces, however https://yaml.org/type/timestamp.html does, but the provided regex doesn't match the TZD space in many of the YAML examples",
					"match": "\\G(?>[0-9]{4}-[0-9]{2,1}-[0-9]{2,1}(?>T|t|[\t ]++)[0-9]{2,1}:[0-9]{2}:[0-9]{2}(?>\\.[0-9]*+)?+[\t ]*+(?>Z|[-+][0-9]{2,1}(?>:[0-9]{2})?+)?+|[0-9]{4}-[0-9]{2}-[0-9]{2})(?=[\t ]++#|[\t ]*+(?>[\\x{85 2028 2029}\r\n,\\]}]|:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}]))",
					"name": "constant.numeric.timestamp.yaml"
				},
				{
					"match": "\\G<<(?=[\t ]++#|[\t ]*+(?>[\\x{85 2028 2029}\r\n,\\]}]|:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}]))",
					"name": "constant.language.merge.yaml"
				},
				{
					"match": "\\G=(?=[\t ]++#|[\t ]*+(?>[\\x{85 2028 2029}\r\n,\\]}]|:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}]))",
					"name": "constant.language.value.yaml"
				},
				{
					"match": "\\G(?>!|&|\\*)(?=[\t ]++#|[\t ]*+(?>[\\x{85 2028 2029}\r\n,\\]}]|:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}]))",
					"name": "constant.language.yaml.yaml"
				}
			]
		},
		"tag-implicit-plain-out": {
			"comment": "https://yaml.org/type/index.html",
			"patterns": [
				{
					"match": "\\G(?>null|Null|NULL|~)(?=[\t ]++#|[\t ]*+(?>$|:[\\x{85 2028 2029}\r\n\t ]))",
					"name": "constant.language.null.yaml"
				},
				{
					"match": "\\G(?>true|True|TRUE|false|False|FALSE|yes|Yes|YES|y|Y|no|No|NO|n|N|on|On|ON|off|Off|OFF)(?=[\t ]++#|[\t ]*+(?>$|:[\\x{85 2028 2029}\r\n\t ]))",
					"name": "constant.language.boolean.yaml"
				},
				{
					"match": "\\G[-+]?+(0|[1-9][0-9_]*+)(?=[\t ]++#|[\t ]*+(?>$|:[\\x{85 2028 2029}\r\n\t ]))",
					"name": "constant.numeric.integer.decimal.yaml"
				},
				{
					"match": "\\G[-+]?+0b[0-1_]++(?=[\t ]++#|[\t ]*+(?>$|:[\\x{85 2028 2029}\r\n\t ]))",
					"name": "constant.numeric.integer.binary.yaml"
				},
				{
					"match": "\\G[-+]?0[0-7_]++(?=[\t ]++#|[\t ]*+(?>$|:[\\x{85 2028 2029}\r\n\t ]))",
					"name": "constant.numeric.integer.octal.yaml"
				},
				{
					"match": "\\G[-+]?+0x[0-9a-fA-F_]++(?=[\t ]++#|[\t ]*+(?>$|:[\\x{85 2028 2029}\r\n\t ]))",
					"name": "constant.numeric.integer.hexadecimal.yaml"
				},
				{
					"match": "\\G[-+]?+[1-9][0-9_]*+(?>:[0-5]?[0-9])++(?=[\t ]++#|[\t ]*+(?>$|:[\\x{85 2028 2029}\r\n\t ]))",
					"name": "constant.numeric.integer.Sexagesimal.yaml"
				},
				{
					"match": "\\G[-+]?+(?>[0-9][0-9_]*+)?+\\.[0-9.]*+(?>[eE][-+][0-9]+)?+(?=[\t ]++#|[\t ]*+(?>$|:[\\x{85 2028 2029}\r\n\t ]))",
					"name": "constant.numeric.float.decimal.yaml"
				},
				{
					"match": "\\G[-+]?+[0-9][0-9_]*+(?>:[0-5]?[0-9])++\\.[0-9_]*+(?=[\t ]++#|[\t ]*+(?>$|:[\\x{85 2028 2029}\r\n\t ]))",
					"name": "constant.numeric.float.Sexagesimal.yaml"
				},
				{
					"match": "\\G[-+]?+\\.(?>inf|Inf|INF)(?=[\t ]++#|[\t ]*+(?>$|:[\\x{85 2028 2029}\r\n\t ]))",
					"name": "constant.numeric.float.inf.yaml"
				},
				{
					"match": "\\G\\.(?>nan|NaN|NAN)(?=[\t ]++#|[\t ]*+(?>$|:[\\x{85 2028 2029}\r\n\t ]))",
					"name": "constant.numeric.float.nan.yaml"
				},
				{
					"comment": "https://www.w3.org/TR/NOTE-datetime does not allow spaces, however https://yaml.org/type/timestamp.html does, but the provided regex doesn't match the TZD space in many of the YAML examples",
					"match": "\\G(?>[0-9]{4}-[0-9]{2,1}-[0-9]{2,1}(?>T|t|[\t ]++)[0-9]{2,1}:[0-9]{2}:[0-9]{2}(?>\\.[0-9]*+)?+[\t ]*+(?>Z|[-+][0-9]{2,1}(?>:[0-9]{2})?+)?+|[0-9]{4}-[0-9]{2}-[0-9]{2})(?=[\t ]++#|[\t ]*+(?>$|:[\\x{85 2028 2029}\r\n\t ]))",
					"name": "constant.numeric.timestamp.yaml"
				},
				{
					"match": "\\G<<(?=[\t ]++#|[\t ]*+(?>$|:[\\x{85 2028 2029}\r\n\t ]))",
					"name": "constant.language.merge.yaml"
				},
				{
					"match": "\\G=(?=[\t ]++#|[\t ]*+(?>$|:[\\x{85 2028 2029}\r\n\t ]))",
					"name": "constant.language.value.yaml"
				},
				{
					"match": "\\G(?>!|&|\\*)(?=[\t ]++#|[\t ]*+(?>$|:[\\x{85 2028 2029}\r\n\t ]))",
					"name": "constant.language.yaml.yaml"
				}
			]
		},
		"tag-property": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-ns-tag-property",
			"//": [
				"!",
				"!!",
				"!<>",
				"!...",
				"!!...",
				"!<...>",
				"!...!..."
			],
			"patterns": [
				{
					"match": "!(?=[\\x{85 2028 2029}\r\n\t ])",
					"name": "storage.type.tag.non-specific.yaml punctuation.definition.tag.non-specific.yaml"
				},
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-c-verbatim-tag",
					"begin": "!<",
					"end": ">",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.tag.begin.yaml"
						}
					},
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.yaml"
						}
					},
					"name": "storage.type.tag.verbatim.yaml",
					"patterns": [
						{
							"match": "%[0-9a-fA-F]{2}",
							"name": "constant.character.escape.unicode.8-bit.yaml"
						},
						{
							"match": "%[^\\x{85 2028 2029}\r\n\t ]{2,0}",
							"name": "invalid.illegal.constant.character.escape.unicode.8-bit.yaml"
						},
						{
							"include": "source.yaml#non-printable"
						},
						{
							"match": "[^\\x{85 2028 2029}\r\n\t a-zA-Z0-9-#;/?:@&=+$,_.!~*'()\\[\\]%>]++",
							"name": "invalid.illegal.unrecognized.yaml"
						}
					]
				},
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-c-ns-shorthand-tag",
					"begin": "(?=!)",
					"end": "(?=[\\x{85 2028 2029}\r\n\t ,\\[\\]{}])",
					"name": "storage.type.tag.shorthand.yaml",
					"patterns": [
						{
							"comment": "https://yaml.org/spec/1.2.2/#rule-c-secondary-tag-handle",
							"match": "\\G!!",
							"name": "punctuation.definition.tag.secondary.yaml"
						},
						{
							"comment": "https://yaml.org/spec/1.2.2/#rule-c-secondary-tag-handle",
							"match": "\\G(!)[0-9A-Za-z-]++(!)",
							"captures": {
								"1": {
									"name": "punctuation.definition.tag.named.yaml"
								},
								"2": {
									"name": "punctuation.definition.tag.named.yaml"
								}
							}
						},
						{
							"comment": "https://yaml.org/spec/1.2.2/#rule-c-primary-tag-handle",
							"match": "\\G!",
							"name": "punctuation.definition.tag.primary.yaml"
						},
						{
							"match": "%[0-9a-fA-F]{2}",
							"name": "constant.character.escape.unicode.8-bit.yaml"
						},
						{
							"match": "%[^\\x{85 2028 2029}\r\n\t ]{2,0}",
							"name": "invalid.illegal.constant.character.escape.unicode.8-bit.yaml"
						},
						{
							"include": "source.yaml#non-printable"
						},
						{
							"match": "[^\\x{85 2028 2029}\r\n\t a-zA-Z0-9-#;/?:@&=+$,_.~*'()\\[\\]%]++",
							"name": "invalid.illegal.unrecognized.yaml"
						}
					]
				}
			]
		},
		"anchor-property": {
			"match": "(&)([^ \\p{Cntrl}\\p{Surrogate}\\x{2028 2029 FFFE FFFF}]++)|(&)",
			"captures": {
				"0": {
					"name": "keyword.control.flow.anchor.yaml"
				},
				"1": {
					"name": "punctuation.definition.anchor.yaml"
				},
				"2": {
					"name": "variable.other.anchor.yaml"
				},
				"3": {
					"name": "invalid.illegal.flow.anchor.yaml"
				}
			}
		},
		"alias": {
			"begin": "(\\*)([^ \\p{Cntrl}\\p{Surrogate}\\x{2028 2029 FFFE FFFF}]++)|(\\*)",
			"end": "(?=:[\\x{85 2028 2029}\r\n\t ,\\[\\]{}]|[,\\[\\]{}])",
			"captures": {
				"0": {
					"name": "keyword.control.flow.alias.yaml"
				},
				"1": {
					"name": "punctuation.definition.alias.yaml"
				},
				"2": {
					"name": "variable.other.alias.yaml"
				},
				"3": {
					"name": "invalid.illegal.flow.alias.yaml"
				}
			},
			"patterns": [
				{
					"include": "#presentation-detail"
				}
			]
		},
		"byte-order-mark": {
			"comment": "﻿",
			"begin": "\\G",
			"while": "\\G(?=[\\x{FEFF 85 2028 2029}\r\n\t ])",
			"patterns": [
				{
					"begin": "(?=#)",
					"while": "\\G",
					"patterns": [
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"begin": "\\G\\x{FEFF}",
					"while": "\\G",
					"beginCaptures": {
						"0": {
							"name": "byte-order-mark.yaml"
						}
					},
					"patterns": [
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"include": "#presentation-detail"
				}
			]
		},
		"presentation-detail": {
			"patterns": [
				{
					"match": "[\t ]++",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"comment": "https://yaml.org/spec/1.1/#id871136",
					"match": "[\\x{85 2028 2029}\r\n]++",
					"name": "punctuation.separator.line-break.yaml"
				},
				{
					"include": "source.yaml#non-printable"
				},
				{
					"include": "#comment"
				},
				{
					"include": "#unknown"
				}
			]
		},
		"comment": {
			"comment": "Comments must be separated from other tokens by white space characters. `space`, `newline` or `carriage-return`. `#(.*)` causes performance issues",
			"begin": "(?<=^|[\\x{FEFF 85 2028 2029} ])#",
			"end": "[\\x{85 2028 2029}\r\n]",
			"captures": {
				"0": {
					"name": "punctuation.definition.comment.yaml"
				}
			},
			"name": "comment.line.number-sign.yaml",
			"patterns": [
				{
					"include": "source.yaml#non-printable"
				}
			]
		},
		"unknown": {
			"match": ".[[^\\x{85 2028 2029}#\"':,\\[\\]{}]&&!-~\\x{A0}-\\x{D7FF}\\x{E000}-\\x{FFFD}\\x{010000}-\\x{10FFFF}]*+",
			"name": "invalid.illegal.unrecognized.yaml"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/yaml/syntaxes/yaml-1.2.tmLanguage.json]---
Location: vscode-main/extensions/yaml/syntaxes/yaml-1.2.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/RedCMD/YAML-Syntax-Highlighter/blob/master/syntaxes/yaml-1.2.tmLanguage.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/RedCMD/YAML-Syntax-Highlighter/commit/53d38bbc66b704803de54ffce5b251bf97211c60",
	"name": "YAML 1.2",
	"scopeName": "source.yaml.1.2",
	"comment": "https://yaml.org/spec/1.2.2",
	"patterns": [
		{
			"include": "#stream"
		}
	],
	"repository": {
		"stream": {
			"patterns": [
				{
					"comment": "allows me to just use `\\G` instead of the performance heavy `(^|\\G)`",
					"begin": "^(?!\\G)",
					"while": "^",
					"name": "meta.stream.yaml",
					"patterns": [
						{
							"include": "#byte-order-mark"
						},
						{
							"include": "#directives"
						},
						{
							"include": "#document"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"comment": "For when YAML is embedded inside a Markdown code-block",
					"begin": "\\G(?!$)",
					"while": "\\G",
					"name": "meta.stream.yaml",
					"patterns": [
						{
							"include": "#byte-order-mark"
						},
						{
							"include": "#directives"
						},
						{
							"include": "#document"
						},
						{
							"include": "#presentation-detail"
						}
					]
				}
			]
		},
		"directive-YAML": {
			"comment": "https://yaml.org/spec/1.2.2/#681-yaml-directives",
			"begin": "(?=%YAML[\t ]+1\\.2(?=[\r\n\t ]))",
			"end": "\\G(?=(?>\\.{3}|---)[\r\n\t ])",
			"name": "meta.1.2.yaml",
			"patterns": [
				{
					"comment": "https://yaml.org/spec/1.2.2/#681-yaml-directives",
					"begin": "\\G(%)(YAML)([\t ]+)(1\\.2)",
					"end": "\\G(?=---[\r\n\t ])",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.directive.begin.yaml"
						},
						"2": {
							"name": "keyword.other.directive.yaml.yaml"
						},
						"3": {
							"name": "punctuation.whitespace.separator.yaml"
						},
						"4": {
							"name": "constant.numeric.yaml-version.yaml"
						}
					},
					"name": "meta.directives.yaml",
					"patterns": [
						{
							"include": "#directive-invalid"
						},
						{
							"include": "#directives"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"include": "#document"
				}
			]
		},
		"directives": {
			"comment": "https://yaml.org/spec/1.2.2/#68-directives",
			"patterns": [
				{
					"include": "source.yaml.1.3#directive-YAML"
				},
				{
					"include": "source.yaml.1.2#directive-YAML"
				},
				{
					"include": "source.yaml.1.1#directive-YAML"
				},
				{
					"include": "source.yaml.1.0#directive-YAML"
				},
				{
					"begin": "(?=%)",
					"while": "\\G(?!%|---[\r\n\t ])",
					"name": "meta.directives.yaml",
					"patterns": [
						{
							"comment": "https://yaml.org/spec/1.2.2/#682-tag-directives",
							"begin": "\\G(%)(TAG)(?>([\t ]++)((!)(?>[0-9A-Za-z-]*+(!))?+))?+",
							"end": "$",
							"applyEndPatternLast": true,
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.directive.begin.yaml"
								},
								"2": {
									"name": "keyword.other.directive.tag.yaml"
								},
								"3": {
									"name": "punctuation.whitespace.separator.yaml"
								},
								"4": {
									"name": "storage.type.tag-handle.yaml"
								},
								"5": {
									"name": "punctuation.definition.tag.begin.yaml"
								},
								"6": {
									"name": "punctuation.definition.tag.end.yaml"
								},
								"comment": "https://yaml.org/spec/1.2.2/#rule-c-tag-handle"
							},
							"patterns": [
								{
									"comment": "technically the beginning should only validate against a valid uri scheme [A-Za-z][A-Za-z0-9.+-]*",
									"begin": "\\G[\t ]++(?!#)",
									"end": "(?=[\r\n\t ])",
									"beginCaptures": {
										"0": {
											"name": "punctuation.whitespace.separator.yaml"
										}
									},
									"contentName": "support.type.tag-prefix.yaml",
									"patterns": [
										{
											"match": "%[0-9a-fA-F]{2}",
											"name": "constant.character.escape.unicode.8-bit.yaml"
										},
										{
											"match": "%[^\r\n\t ]{2,0}",
											"name": "invalid.illegal.constant.character.escape.unicode.8-bit.yaml"
										},
										{
											"match": "\\G[,\\[\\]{}]",
											"name": "invalid.illegal.character.uri.yaml"
										},
										{
											"include": "source.yaml#non-printable"
										},
										{
											"match": "[^\r\n\t a-zA-Z0-9-#;/?:@&=+$,_.!~*'()\\[\\]]++",
											"name": "invalid.illegal.unrecognized.yaml"
										}
									]
								},
								{
									"include": "#presentation-detail"
								}
							]
						},
						{
							"comment": "https://yaml.org/spec/1.2.2/#rule-ns-reserved-directive",
							"begin": "(%)([\\x{85}[^ \\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]++)",
							"end": "$",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.directive.begin.yaml"
								},
								"2": {
									"name": "keyword.other.directive.other.yaml"
								}
							},
							"patterns": [
								{
									"match": "\\G([\t ]++)([\\x{85}[^ \\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]++)",
									"captures": {
										"1": {
											"name": "punctuation.whitespace.separator.yaml"
										},
										"2": {
											"name": "string.unquoted.directive-name.yaml"
										}
									}
								},
								{
									"match": "([\t ]++)([\\x{85}[^ \\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]++)",
									"captures": {
										"1": {
											"name": "punctuation.whitespace.separator.yaml"
										},
										"2": {
											"name": "string.unquoted.directive-parameter.yaml"
										}
									}
								},
								{
									"include": "#presentation-detail"
								}
							]
						},
						{
							"match": "\\G\\.{3}(?=[\r\n\t ])",
							"name": "invalid.illegal.entity.other.document.end.yaml"
						},
						{
							"include": "#presentation-detail"
						}
					]
				}
			]
		},
		"directive-invalid": {
			"patterns": [
				{
					"match": "\\G\\.{3}(?=[\r\n\t ])",
					"name": "invalid.illegal.entity.other.document.end.yaml"
				},
				{
					"begin": "\\G(%)(YAML)",
					"end": "$",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.directive.begin.yaml"
						},
						"2": {
							"name": "invalid.illegal.keyword.other.directive.yaml.yaml"
						}
					},
					"name": "meta.directive.yaml",
					"patterns": [
						{
							"match": "\\G([\t ]++|:)([0-9]++\\.[0-9]++)?+",
							"captures": {
								"1": {
									"name": "punctuation.whitespace.separator.yaml"
								},
								"2": {
									"name": "constant.numeric.yaml-version.yaml"
								}
							}
						},
						{
							"include": "#presentation-detail"
						}
					]
				}
			]
		},
		"document": {
			"comment": "https://yaml.org/spec/1.2.2/#91-documents",
			"patterns": [
				{
					"begin": "---(?=[\r\n\t ])",
					"while": "\\G(?!(?>\\.{3}|---)[\r\n\t ])",
					"beginCaptures": {
						"0": {
							"name": "entity.other.document.begin.yaml"
						}
					},
					"name": "meta.document.yaml",
					"patterns": [
						{
							"include": "#block-node"
						}
					]
				},
				{
					"begin": "(?=\\.{3}[\r\n\t ])",
					"while": "\\G(?=[\t \\x{FEFF}]*+(?>#|$))",
					"patterns": [
						{
							"begin": "\\G\\.{3}",
							"end": "$",
							"beginCaptures": {
								"0": {
									"name": "entity.other.document.end.yaml"
								}
							},
							"patterns": [
								{
									"include": "#presentation-detail"
								}
							]
						},
						{
							"include": "#byte-order-mark"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"begin": "\\G(?!%|[\t \\x{FEFF}]*+(?>#|$))",
					"while": "\\G(?!(?>\\.{3}|---)[\r\n\t ])",
					"name": "meta.document.yaml",
					"patterns": [
						{
							"include": "#block-node"
						}
					]
				}
			]
		},
		"block-node": {
			"patterns": [
				{
					"include": "#block-mapping"
				},
				{
					"include": "#block-sequence"
				},
				{
					"include": "#block-scalar"
				},
				{
					"include": "#anchor-property"
				},
				{
					"include": "#tag-property"
				},
				{
					"include": "#alias"
				},
				{
					"begin": "(?=\"|')",
					"while": "\\G",
					"patterns": [
						{
							"begin": "(?!\\G)",
							"while": "\\G",
							"patterns": [
								{
									"include": "#presentation-detail"
								}
							]
						},
						{
							"include": "#double"
						},
						{
							"include": "#single"
						}
					]
				},
				{
					"begin": "(?={)",
					"end": "$",
					"patterns": [
						{
							"include": "#flow-mapping"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"begin": "(?=\\[)",
					"end": "$",
					"patterns": [
						{
							"include": "#flow-sequence"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"include": "#block-plain-out"
				},
				{
					"include": "#presentation-detail"
				}
			]
		},
		"block-mapping": {
			"//": "The check for plain keys is expensive",
			"begin": "(?=((?<=[-?:]) )?+)(?<![^\t ][\t ]*+:|---)\\G( *+)([\t ]*+)(?>((?>[!&*][^\r\n\t ]*+[\t ]++)*+)(?=(?>(?#Double Quote)\"(?>[^\\\\\"]++|\\\\.)*+\"|(?#Single Quote)'(?>[^']++|'')*+'|(?#Flow-Map){(?>[^}]++|}[ \t]*+(?!:[\r\n\t ]))++}|(?#Flow-Seq)\\[(?>[^]]++|][ \t]*+(?!:[\r\n\t ]))++]|(?#Plain)(?>[\\x{85}[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]|[?:-](?![\r\n\t ]))(?>[^:#]++|:(?![\r\n\t ])|(?<! |\t)#++)*+)?+(?#Map Value)[\t ]*+:[\r\n\t ])|(?#Explicit)(?=\\?[\r\n\t ]))",
			"while": "\\G(?>(\\1\\2)((?>[!&*][^\r\n\t ]*+[\t ]++)*+)((?>\t[\t ]*+)?+[^\r\n\t ?:\\-#!&*\"'\\[\\]{}0-9A-Za-z$()+./;<=\\\\^_~\\x{85}\\x{A0}-\\x{D7FF}\\x{E000}-\\x{FFFD}\\x{010000}-\\x{10FFFF}])?+|( *+)([\t ]*+[^\r\n#])?+)",
			"beginCaptures": {
				"2": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"3": {
					"name": "punctuation.whitespace.separator.yaml"
				},
				"4": {
					"comment": "May cause lag on long lines starting with a tag, anchor or alias",
					"patterns": [
						{
							"include": "#tag-property"
						},
						{
							"include": "#anchor-property"
						},
						{
							"include": "#alias"
						},
						{
							"include": "#presentation-detail"
						}
					]
				}
			},
			"whileCaptures": {
				"1": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"2": {
					"comment": "May cause lag on long lines starting with a tag, anchor or alias",
					"patterns": [
						{
							"include": "#tag-property"
						},
						{
							"include": "#anchor-property"
						},
						{
							"include": "#alias"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				"3": {
					"name": "invalid.illegal.expected-indentation.yaml"
				},
				"4": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"5": {
					"name": "invalid.illegal.expected-indentation.yaml"
				}
			},
			"name": "meta.mapping.yaml",
			"patterns": [
				{
					"include": "#block-map-key-double"
				},
				{
					"include": "source.yaml#block-map-key-single"
				},
				{
					"include": "#block-map-key-plain"
				},
				{
					"include": "#block-map-key-explicit"
				},
				{
					"include": "#block-map-value"
				},
				{
					"include": "#flow-mapping"
				},
				{
					"include": "#flow-sequence"
				},
				{
					"include": "#presentation-detail"
				}
			]
		},
		"block-sequence": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-l+block-sequence",
			"begin": "(?=((?<=[-?:]) )?+)(?<![^\t ][\t ]*+:|---)\\G( *+)(-)(?=[\r\n\t ])",
			"while": "\\G(?>(\\1\\2)(?!-[\r\n\t ])((?>\t[\t ]*+)?+[^\r\n\t #\\]}])?+|(?!\\1\\2)( *+)([\t ]*+[^\r\n#])?+)",
			"beginCaptures": {
				"2": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"3": {
					"name": "punctuation.definition.block.sequence.item.yaml"
				}
			},
			"whileCaptures": {
				"1": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"2": {
					"name": "invalid.illegal.expected-indentation.yaml"
				},
				"3": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"4": {
					"name": "invalid.illegal.expected-indentation.yaml"
				}
			},
			"name": "meta.block.sequence.yaml",
			"patterns": [
				{
					"include": "#block-node"
				}
			]
		},
		"block-map-key-explicit": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-l-block-map-explicit-key",
			"begin": "(?=((?<=[-?:]) )?+)\\G( *+)(\\?)(?=[\r\n\t ])",
			"while": "\\G(?>(\\1\\2)(?![?:0-9A-Za-z$()+./;<=\\\\^_~\\x{85}\\x{A0}-\\x{D7FF}\\x{E000}-\\x{FFFD}\\x{010000}-\\x{10FFFF}&&[^\\x{FEFF}]])((?>\t[\t ]*+)?+[^\r\n\t #\\-\\[\\]{}])?+|(?!\\1\\2)( *+)([\t ]*+[^\r\n#])?+)",
			"beginCaptures": {
				"2": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"3": {
					"name": "punctuation.definition.map.key.yaml"
				},
				"4": {
					"name": "punctuation.whitespace.separator.yaml"
				}
			},
			"whileCaptures": {
				"1": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"2": {
					"name": "invalid.illegal.expected-indentation.yaml"
				},
				"3": {
					"name": "punctuation.whitespace.indentation.yaml"
				},
				"4": {
					"name": "invalid.illegal.expected-indentation.yaml"
				}
			},
			"name": "meta.map.explicit.yaml",
			"patterns": [
				{
					"include": "#key-double"
				},
				{
					"include": "source.yaml#key-single"
				},
				{
					"include": "#flow-key-plain-out"
				},
				{
					"include": "#block-map-value"
				},
				{
					"include": "#block-node"
				}
			]
		},
		"block-map-key-double": {
			"comment": "https://yaml.org/spec/1.2.2/#double-quoted-style (BLOCK-KEY)",
			"begin": "\\G\"",
			"end": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.yaml"
				}
			},
			"name": "meta.map.key.yaml string.quoted.double.yaml entity.name.tag.yaml",
			"patterns": [
				{
					"match": ".[\t ]*+$",
					"name": "invalid.illegal.multiline-key.yaml"
				},
				{
					"match": "[^\t -\\x{10FFFF}]++",
					"name": "invalid.illegal.character.yaml"
				},
				{
					"include": "#double-escape"
				}
			]
		},
		"block-map-key-plain": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-plain-one-line (BLOCK-KEY)",
			"begin": "\\G(?=[\\x{85}[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]|[?:-](?![\r\n\t ]))",
			"end": "(?=[\t ]*+:[\r\n\t ]|(?>[\t ]++|\\G)#)",
			"name": "meta.map.key.yaml string.unquoted.plain.yaml entity.name.tag.yaml",
			"patterns": [
				{
					"include": "#tag-implicit-plain-out"
				},
				{
					"match": "\\G([\t ]++)(.)",
					"captures": {
						"1": {
							"name": "punctuation.whitespace.separator.yaml"
						},
						"2": {
							"name": "invalid.illegal.multiline-key.yaml"
						}
					}
				},
				{
					"match": "[\t ]++$",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"match": "[^\r\n\t ](?=[\t ]*+$)",
					"name": "invalid.illegal.expected-map-separator.yaml"
				},
				{
					"match": "\\x{FEFF}",
					"name": "invalid.illegal.bom.yaml"
				},
				{
					"include": "source.yaml#non-printable"
				}
			]
		},
		"block-map-value": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-l-block-map-implicit-value",
			"//": "Assumming 3rd party preprocessing variables `{{...}}` turn into valid map-keys when inside a block-mapping",
			"begin": ":(?=[\r\n\t ])|(?<=}})(?=[\t ]++#|[\t ]*+$)",
			"while": "\\G(?![?:!\"'0-9A-Za-z$()+./;<=\\\\^_~\\[{\\x{85}\\x{A0}-\\x{D7FF}\\x{E000}-\\x{FFFD}\\x{010000}-\\x{10FFFF}&&[^\\x{FEFF}]]|-[^\r\n\t ])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.separator.map.value.yaml"
				}
			},
			"name": "meta.map.value.yaml",
			"patterns": [
				{
					"include": "#block-node"
				}
			]
		},
		"block-scalar": {
			"comment": "https://yaml.org/spec/1.2.2/#81-block-scalar-styles",
			"patterns": [
				{
					"comment": "https://yaml.org/spec/1.2.2/#8111-block-indentation-indicator",
					"begin": "(?>(\\|)|(>))(?<chomp>[+-])?+([1-9])(?(<chomp>)|\\g<chomp>)?+",
					"while": "\\G(?> {\\4}| *+($|[^#]))",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.flow.block-scalar.literal.yaml"
						},
						"2": {
							"name": "keyword.control.flow.block-scalar.folded.yaml"
						},
						"3": {
							"name": "storage.modifier.chomping-indicator.yaml"
						},
						"4": {
							"name": "constant.numeric.indentation-indicator.yaml"
						}
					},
					"whileCaptures": {
						"0": {
							"name": "punctuation.whitespace.indentation.yaml"
						},
						"1": {
							"name": "invalid.illegal.expected-indentation.yaml"
						}
					},
					"name": "meta.scalar.yaml",
					"patterns": [
						{
							"begin": "$",
							"while": "\\G",
							"contentName": "string.unquoted.block.yaml",
							"patterns": [
								{
									"include": "source.yaml#non-printable"
								}
							]
						},
						{
							"begin": "\\G",
							"end": "$",
							"patterns": [
								{
									"include": "#presentation-detail"
								}
							]
						}
					]
				},
				{
					"//": "Soooooooo many edge cases",
					"begin": "(?>(\\|)|(>))([+-]?+)",
					"while": "\\G",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.flow.block-scalar.literal.yaml"
						},
						"2": {
							"name": "keyword.control.flow.block-scalar.folded.yaml"
						},
						"3": {
							"name": "storage.modifier.chomping-indicator.yaml"
						}
					},
					"name": "meta.scalar.yaml",
					"patterns": [
						{
							"comment": "https://yaml.org/spec/1.2.2/#rule-l-literal-content",
							"begin": "$",
							"while": "\\G",
							"patterns": [
								{
									"comment": "https://yaml.org/spec/1.2.2/#rule-l-nb-literal-text",
									"//": "Find the highest indented line",
									"begin": "\\G( ++)$",
									"while": "\\G(?>(\\1)$|(?!\\1)( *+)($|.))",
									"captures": {
										"1": {
											"name": "punctuation.whitespace.indentation.yaml"
										},
										"2": {
											"name": "punctuation.whitespace.indentation.yaml"
										},
										"3": {
											"name": "invalid.illegal.expected-indentation.yaml"
										}
									},
									"contentName": "string.unquoted.block.yaml",
									"patterns": [
										{
											"include": "source.yaml#non-printable"
										}
									]
								},
								{
									"comment": "https://yaml.org/spec/1.2.2/#rule-b-nb-literal-next",
									"//": [
										"Funky wrapper function",
										"The `end` pattern clears the parent `\\G` anchor",
										"Affectively forcing this rule to only match at most once",
										"https://github.com/microsoft/vscode-textmate/issues/114"
									],
									"begin": "\\G(?!$)(?=( *+))",
									"end": "\\G(?!\\1)(?=[\t ]*+#)",
									"patterns": [
										{
											"comment": "https://yaml.org/spec/1.2.2/#rule-l-nb-literal-text",
											"begin": "\\G( *+)",
											"while": "\\G(?>(\\1)|( *+)($|[^\t#]|[\t ]++[^#]))",
											"captures": {
												"1": {
													"name": "punctuation.whitespace.indentation.yaml"
												},
												"2": {
													"name": "punctuation.whitespace.indentation.yaml"
												},
												"3": {
													"name": "invalid.illegal.expected-indentation.yaml"
												}
											},
											"contentName": "string.unquoted.block.yaml",
											"patterns": [
												{
													"include": "source.yaml#non-printable"
												}
											]
										}
									]
								},
								{
									"comment": "https://yaml.org/spec/1.2.2/#rule-l-chomped-empty",
									"begin": "(?!\\G)(?=[\t ]*+#)",
									"while": "\\G",
									"patterns": [
										{
											"include": "#presentation-detail"
										}
									]
								}
							]
						},
						{
							"comment": "https://yaml.org/spec/1.2.2/#rule-c-b-block-header",
							"begin": "\\G",
							"end": "$",
							"patterns": [
								{
									"include": "#presentation-detail"
								}
							]
						}
					]
				}
			]
		},
		"block-plain-out": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-plain-multi-line (FLOW-OUT)",
			"begin": "(?=[\\x{85}[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]|[?:-](?![\r\n\t ]))",
			"while": "\\G",
			"patterns": [
				{
					"begin": "\\G",
					"end": "(?=(?>[\t ]++|\\G)#)",
					"name": "string.unquoted.plain.out.yaml",
					"patterns": [
						{
							"include": "#tag-implicit-plain-out"
						},
						{
							"match": ":(?=[\r\n\t ])",
							"name": "invalid.illegal.multiline-key.yaml"
						},
						{
							"match": "\\G[\t ]++",
							"name": "punctuation.whitespace.separator.yaml"
						},
						{
							"match": "[\t ]++$",
							"name": "punctuation.whitespace.separator.yaml"
						},
						{
							"match": "\\x{FEFF}",
							"name": "invalid.illegal.bom.yaml"
						},
						{
							"include": "source.yaml#non-printable"
						}
					]
				},
				{
					"begin": "(?!\\G)",
					"while": "\\G",
					"patterns": [
						{
							"include": "#presentation-detail"
						}
					]
				}
			]
		},
		"flow-node": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-seq-entry (FLOW-IN)",
			"patterns": [
				{
					"begin": "(?=\\[|{)",
					"end": "(?=[:,\\]}])",
					"patterns": [
						{
							"begin": "(?!\\G)",
							"end": "(?=[:,\\]}])",
							"patterns": [
								{
									"include": "#presentation-detail"
								}
							]
						},
						{
							"include": "#flow-mapping"
						},
						{
							"include": "#flow-sequence"
						}
					]
				},
				{
					"include": "#anchor-property"
				},
				{
					"include": "#tag-property"
				},
				{
					"include": "#alias"
				},
				{
					"begin": "(?=\"|')",
					"end": "(?=[:,\\]}])",
					"patterns": [
						{
							"begin": "(?!\\G)",
							"end": "(?=[:,\\]}])",
							"patterns": [
								{
									"include": "#presentation-detail"
								}
							]
						},
						{
							"include": "#double"
						},
						{
							"include": "#single"
						}
					]
				},
				{
					"include": "#flow-plain-in"
				},
				{
					"include": "#presentation-detail"
				}
			]
		},
		"flow-mapping": {
			"comment": "https://yaml.org/spec/1.2.2/#742-flow-mappings",
			"begin": "{",
			"end": "}",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.mapping.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.mapping.end.yaml"
				}
			},
			"name": "meta.flow.mapping.yaml",
			"patterns": [
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-s-flow-map-entries",
					"begin": "(?<={)\\G(?=[\r\n\t ,#])|,",
					"end": "(?=[^\r\n\t ,#])",
					"beginCaptures": {
						"0": {
							"name": "punctuation.separator.mapping.yaml"
						}
					},
					"patterns": [
						{
							"match": ",++",
							"name": "invalid.illegal.separator.sequence.yaml"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"include": "#flow-mapping-map-key"
				},
				{
					"include": "#flow-map-value-yaml"
				},
				{
					"include": "#flow-map-value-json"
				},
				{
					"include": "#flow-node"
				}
			]
		},
		"flow-sequence": {
			"comment": "https://yaml.org/spec/1.2.2/#741-flow-sequences",
			"begin": "\\[",
			"end": "]",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.sequence.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.sequence.end.yaml"
				}
			},
			"name": "meta.flow.sequence.yaml",
			"patterns": [
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-s-flow-seq-entries",
					"begin": "(?<=\\[)\\G(?=[\r\n\t ,#])|,",
					"end": "(?=[^\r\n\t ,#])",
					"beginCaptures": {
						"0": {
							"name": "punctuation.separator.sequence.yaml"
						}
					},
					"patterns": [
						{
							"match": ",++",
							"name": "invalid.illegal.separator.sequence.yaml"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"include": "#flow-sequence-map-key"
				},
				{
					"include": "#flow-map-value-yaml"
				},
				{
					"include": "#flow-map-value-json"
				},
				{
					"include": "#flow-node"
				}
			]
		},
		"flow-mapping-map-key": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-map-entry (FLOW-IN)",
			"patterns": [
				{
					"begin": "\\?(?=[\r\n\t ,\\[\\]{}])",
					"end": "(?=[,\\[\\]{}])",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.map.key.yaml"
						}
					},
					"name": "meta.flow.map.explicit.yaml",
					"patterns": [
						{
							"include": "#flow-mapping-map-key"
						},
						{
							"include": "#flow-map-value-yaml"
						},
						{
							"include": "#flow-map-value-json"
						},
						{
							"include": "#flow-node"
						}
					]
				},
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-map-implicit-entry (FLOW-IN)",
					"begin": "(?=(?>[\\x{85}[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]|[?:-](?![\r\n\t ,\\[\\]{}])))",
					"end": "(?=[,\\[\\]{}])",
					"name": "meta.flow.map.implicit.yaml",
					"patterns": [
						{
							"include": "#flow-key-plain-in"
						},
						{
							"match": ":(?=\\[|{)",
							"name": "invalid.illegal.separator.map.yaml"
						},
						{
							"include": "#flow-map-value-yaml"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-map-implicit-entry (FLOW-IN)",
					"begin": "(?=\"|')",
					"end": "(?=[,\\[\\]{}])",
					"name": "meta.flow.map.implicit.yaml",
					"patterns": [
						{
							"include": "#key-double"
						},
						{
							"include": "source.yaml#key-single"
						},
						{
							"include": "#flow-map-value-json"
						},
						{
							"include": "#presentation-detail"
						}
					]
				}
			]
		},
		"flow-sequence-map-key": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-map-entry (FLOW-IN)",
			"patterns": [
				{
					"begin": "\\?(?=[\r\n\t ,\\[\\]{}])",
					"end": "(?=[,\\[\\]{}])",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.map.key.yaml"
						}
					},
					"name": "meta.flow.map.explicit.yaml",
					"patterns": [
						{
							"include": "#flow-mapping-map-key"
						},
						{
							"include": "#flow-map-value-yaml"
						},
						{
							"include": "#flow-map-value-json"
						},
						{
							"include": "#flow-node"
						}
					]
				},
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-map-implicit-entry (FLOW-IN)",
					"begin": "(?<=[\t ,\\[{]|^)(?=(?>[\\x{85}[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]|[?:-](?![\r\n\t ,\\[\\]{}]))(?>[^:#,\\[\\]{}]++|:(?![\r\n\t ,\\[\\]{}])|(?<! |\t)#++)*+:[\r\n\t ,\\[\\]{}])",
					"end": "(?=[,\\[\\]{}])",
					"name": "meta.flow.map.implicit.yaml",
					"patterns": [
						{
							"include": "#flow-key-plain-in"
						},
						{
							"match": ":(?=\\[|{)",
							"name": "invalid.illegal.separator.map.yaml"
						},
						{
							"include": "#flow-map-value-yaml"
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-flow-map-implicit-entry (FLOW-IN)",
					"begin": "(?=(?>\"(?>[^\\\\\"]++|\\\\.)*+\"|'(?>[^']++|'')*+')[\t ]*+:)",
					"end": "(?=[,\\[\\]{}])",
					"name": "meta.flow.map.implicit.yaml",
					"patterns": [
						{
							"include": "#key-double"
						},
						{
							"include": "source.yaml#key-single"
						},
						{
							"include": "#flow-map-value-json"
						},
						{
							"include": "#presentation-detail"
						}
					]
				}
			]
		},
		"flow-map-value-yaml": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-ns-flow-map-separate-value (FLOW-IN)",
			"begin": ":(?=[\r\n\t ,\\[\\]{}])",
			"end": "(?=[,\\]}])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.separator.map.value.yaml"
				}
			},
			"name": "meta.flow.pair.value.yaml",
			"patterns": [
				{
					"include": "#flow-node"
				}
			]
		},
		"flow-map-value-json": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-ns-flow-map-separate-value (FLOW-IN)",
			"begin": "(?<=(?>[\"'\\]}]|^)[\t ]*+):",
			"end": "(?=[,\\]}])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.separator.map.value.yaml"
				}
			},
			"name": "meta.flow.pair.value.yaml",
			"patterns": [
				{
					"include": "#flow-node"
				}
			]
		},
		"flow-plain-in": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-plain-multi-line (FLOW-IN)",
			"begin": "(?=[\\x{85}[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]|[?:-](?![\r\n\t ,\\[\\]{}]))",
			"end": "(?=(?>[\t ]++|\\G)#|[\t ]*+[,\\[\\]{}])",
			"name": "string.unquoted.plain.in.yaml",
			"patterns": [
				{
					"include": "#tag-implicit-plain-in"
				},
				{
					"match": "\\G[\t ]++",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"match": "[\t ]++$",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"match": ":(?=[\r\n\t ,\\[\\]{}])",
					"name": "invalid.illegal.multiline-key.yaml"
				},
				{
					"match": "\\x{FEFF}",
					"name": "invalid.illegal.bom.yaml"
				},
				{
					"include": "source.yaml#non-printable"
				}
			]
		},
		"flow-key-plain-out": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-plain-one-line (FLOW-OUT)",
			"begin": "(?=[\\x{85}[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]|[?:-](?![\r\n\t ]))",
			"end": "(?=[\t ]*+:[\r\n\t ]|[\t ]++#)",
			"name": "meta.map.key.yaml string.unquoted.plain.yaml entity.name.tag.yaml",
			"patterns": [
				{
					"include": "#tag-implicit-plain-out"
				},
				{
					"match": "\\G[\t ]++",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"match": "[\t ]++$",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"match": "\\x{FEFF}",
					"name": "invalid.illegal.bom.yaml"
				},
				{
					"include": "source.yaml#non-printable"
				}
			]
		},
		"flow-key-plain-in": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-s-implicit-yaml-key (FLOW-KEY)",
			"begin": "\\G(?![\r\n\t #])",
			"end": "(?=[\t ]*+(?>:[\r\n\t ,\\[\\]{}]|[,\\[\\]{}])|[\t ]++#)",
			"name": "meta.flow.map.key.yaml string.unquoted.plain.in.yaml entity.name.tag.yaml",
			"patterns": [
				{
					"include": "#tag-implicit-plain-in"
				},
				{
					"match": "\\x{FEFF}",
					"name": "invalid.illegal.bom.yaml"
				},
				{
					"include": "source.yaml#non-printable"
				}
			]
		},
		"key-double": {
			"comment": "https://yaml.org/spec/1.2.2/#double-quoted-style (FLOW-OUT)",
			"begin": "\"",
			"end": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.yaml"
				}
			},
			"name": "meta.map.key.yaml string.quoted.double.yaml entity.name.tag.yaml",
			"patterns": [
				{
					"match": "[^\r\n\t -\\x{10FFFF}]++",
					"name": "invalid.illegal.character.yaml"
				},
				{
					"include": "#double-escape"
				}
			]
		},
		"double": {
			"comment": "https://yaml.org/spec/1.2.2/#double-quoted-style",
			"begin": "\"",
			"end": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.yaml"
				}
			},
			"name": "string.quoted.double.yaml",
			"patterns": [
				{
					"match": "(?<!\")\\G[\t ]++",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"match": "[\t ]++$",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"match": "[^\r\n\t -\\x{10FFFF}]++",
					"name": "invalid.illegal.character.yaml"
				},
				{
					"include": "#double-escape"
				}
			]
		},
		"single": {
			"comment": "https://yaml.org/spec/1.2.2/#single-quoted-style",
			"begin": "'",
			"end": "'(?!')",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.yaml"
				}
			},
			"name": "string.quoted.single.yaml",
			"patterns": [
				{
					"match": "(?<!')\\G[\t ]++",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"match": "[\t ]++$",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"match": "[^\r\n\t -\\x{10FFFF}]++",
					"name": "invalid.illegal.character.yaml"
				},
				{
					"match": "''",
					"name": "constant.character.escape.single-quote.yaml"
				}
			]
		},
		"double-escape": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-ns-esc-char",
			"patterns": [
				{
					"match": "\\\\[\r\n\t0abtnvfre \"/\\\\N_LP]",
					"name": "constant.character.escape.yaml"
				},
				{
					"match": "\\\\x[0-9a-fA-F]{2}",
					"name": "constant.character.escape.unicode.8-bit.yaml"
				},
				{
					"match": "\\\\u[0-9a-fA-F]{4}",
					"name": "constant.character.escape.unicode.16-bit.yaml"
				},
				{
					"match": "\\\\U[0-9a-fA-F]{8}",
					"name": "constant.character.escape.unicode.32-bit.yaml"
				},
				{
					"match": "\\\\(?>x[^\"]{2,0}|u[^\"]{4,0}|U[^\"]{8,0}|.)",
					"name": "invalid.illegal.constant.character.escape.yaml"
				}
			]
		},
		"tag-implicit-plain-in": {
			"comment": "https://yaml.org/spec/1.2.2/#103-core-schema",
			"patterns": [
				{
					"match": "\\G(?>null|Null|NULL|~)(?=[\t ]++#|[\t ]*+(?>[\r\n,\\]}]|:[\r\n\t ,\\[\\]{}]))",
					"name": "constant.language.null.yaml"
				},
				{
					"match": "\\G(?>true|True|TRUE|false|False|FALSE)(?=[\t ]++#|[\t ]*+(?>[\r\n,\\]}]|:[\r\n\t ,\\[\\]{}]))",
					"name": "constant.language.boolean.yaml"
				},
				{
					"match": "\\G[+-]?+[0-9]++(?=[\t ]++#|[\t ]*+(?>[\r\n,\\]}]|:[\r\n\t ,\\[\\]{}]))",
					"name": "constant.numeric.integer.decimal.yaml"
				},
				{
					"match": "\\G0o[0-7]++(?=[\t ]++#|[\t ]*+(?>[\r\n,\\]}]|:[\r\n\t ,\\[\\]{}]))",
					"name": "constant.numeric.integer.octal.yaml"
				},
				{
					"match": "\\G0x[0-9a-fA-F]++(?=[\t ]++#|[\t ]*+(?>[\r\n,\\]}]|:[\r\n\t ,\\[\\]{}]))",
					"name": "constant.numeric.integer.hexadecimal.yaml"
				},
				{
					"match": "\\G[+-]?+(?>\\.[0-9]++|[0-9]++(?>\\.[0-9]*+)?+)(?>[eE][+-]?+[0-9]++)?+(?=[\t ]++#|[\t ]*+(?>[\r\n,\\]}]|:[\r\n\t ,\\[\\]{}]))",
					"name": "constant.numeric.float.yaml"
				},
				{
					"match": "\\G[+-]?+\\.(?>inf|Inf|INF)(?=[\t ]++#|[\t ]*+(?>[\r\n,\\]}]|:[\r\n\t ,\\[\\]{}]))",
					"name": "constant.numeric.float.inf.yaml"
				},
				{
					"match": "\\G\\.(?>nan|NaN|NAN)(?=[\t ]++#|[\t ]*+(?>[\r\n,\\]}]|:[\r\n\t ,\\[\\]{}]))",
					"name": "constant.numeric.float.nan.yaml"
				}
			]
		},
		"tag-implicit-plain-out": {
			"comment": "https://yaml.org/spec/1.2.2/#103-core-schema",
			"patterns": [
				{
					"match": "\\G(?>null|Null|NULL|~)(?=[\t ]++#|[\t ]*+(?>$|:[\r\n\t ]))",
					"name": "constant.language.null.yaml"
				},
				{
					"match": "\\G(?>true|True|TRUE|false|False|FALSE)(?=[\t ]++#|[\t ]*+(?>$|:[\r\n\t ]))",
					"name": "constant.language.boolean.yaml"
				},
				{
					"match": "\\G[+-]?+[0-9]++(?=[\t ]++#|[\t ]*+(?>$|:[\r\n\t ]))",
					"name": "constant.numeric.integer.decimal.yaml"
				},
				{
					"match": "\\G0o[0-7]++(?=[\t ]++#|[\t ]*+(?>$|:[\r\n\t ]))",
					"name": "constant.numeric.integer.octal.yaml"
				},
				{
					"match": "\\G0x[0-9a-fA-F]++(?=[\t ]++#|[\t ]*+(?>$|:[\r\n\t ]))",
					"name": "constant.numeric.integer.hexadecimal.yaml"
				},
				{
					"match": "\\G[+-]?+(?>\\.[0-9]++|[0-9]++(?>\\.[0-9]*+)?+)(?>[eE][+-]?+[0-9]++)?+(?=[\t ]++#|[\t ]*+(?>$|:[\r\n\t ]))",
					"name": "constant.numeric.float.yaml"
				},
				{
					"match": "\\G[+-]?+\\.(?>inf|Inf|INF)(?=[\t ]++#|[\t ]*+(?>$|:[\r\n\t ]))",
					"name": "constant.numeric.float.inf.yaml"
				},
				{
					"match": "\\G\\.(?>nan|NaN|NAN)(?=[\t ]++#|[\t ]*+(?>$|:[\r\n\t ]))",
					"name": "constant.numeric.float.nan.yaml"
				}
			]
		},
		"tag-property": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-ns-tag-property",
			"//": [
				"!",
				"!!",
				"!<>",
				"!...",
				"!!...",
				"!<...>",
				"!...!..."
			],
			"patterns": [
				{
					"match": "!(?=[\r\n\t ])",
					"name": "storage.type.tag.non-specific.yaml punctuation.definition.tag.non-specific.yaml"
				},
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-c-verbatim-tag",
					"begin": "!<",
					"end": ">",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.tag.begin.yaml"
						}
					},
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.yaml"
						}
					},
					"name": "storage.type.tag.verbatim.yaml",
					"patterns": [
						{
							"match": "%[0-9a-fA-F]{2}",
							"name": "constant.character.escape.unicode.8-bit.yaml"
						},
						{
							"match": "%[^\r\n\t ]{2,0}",
							"name": "invalid.illegal.constant.character.escape.unicode.8-bit.yaml"
						},
						{
							"include": "source.yaml#non-printable"
						},
						{
							"match": "[^\r\n\t a-zA-Z0-9-#;/?:@&=+$,_.!~*'()\\[\\]%>]++",
							"name": "invalid.illegal.unrecognized.yaml"
						}
					]
				},
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-c-ns-shorthand-tag",
					"begin": "(?=!)",
					"end": "(?=[\r\n\t ,\\[\\]{}])",
					"name": "storage.type.tag.shorthand.yaml",
					"patterns": [
						{
							"comment": "https://yaml.org/spec/1.2.2/#rule-c-secondary-tag-handle",
							"match": "\\G!!",
							"name": "punctuation.definition.tag.secondary.yaml"
						},
						{
							"comment": "https://yaml.org/spec/1.2.2/#rule-c-secondary-tag-handle",
							"match": "\\G(!)[0-9A-Za-z-]++(!)",
							"captures": {
								"1": {
									"name": "punctuation.definition.tag.named.yaml"
								},
								"2": {
									"name": "punctuation.definition.tag.named.yaml"
								}
							}
						},
						{
							"comment": "https://yaml.org/spec/1.2.2/#rule-c-primary-tag-handle",
							"match": "\\G!",
							"name": "punctuation.definition.tag.primary.yaml"
						},
						{
							"match": "%[0-9a-fA-F]{2}",
							"name": "constant.character.escape.unicode.8-bit.yaml"
						},
						{
							"match": "%[^\r\n\t ]{2,0}",
							"name": "invalid.illegal.constant.character.escape.unicode.8-bit.yaml"
						},
						{
							"include": "source.yaml#non-printable"
						},
						{
							"match": "[^\r\n\t a-zA-Z0-9-#;/?:@&=+$_.~*'()%]++",
							"name": "invalid.illegal.unrecognized.yaml"
						}
					]
				}
			]
		},
		"anchor-property": {
			"match": "(&)([\\x{85}[^ ,\\[\\]{}\\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]++)|(&)",
			"captures": {
				"0": {
					"name": "keyword.control.flow.anchor.yaml"
				},
				"1": {
					"name": "punctuation.definition.anchor.yaml"
				},
				"2": {
					"name": "variable.other.anchor.yaml"
				},
				"3": {
					"name": "invalid.illegal.flow.anchor.yaml"
				}
			}
		},
		"alias": {
			"begin": "(\\*)([\\x{85}[^ ,\\[\\]{}\\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]++)|(\\*)",
			"end": "(?=:[\r\n\t ,\\[\\]{}]|[,\\[\\]{}])",
			"captures": {
				"0": {
					"name": "keyword.control.flow.alias.yaml"
				},
				"1": {
					"name": "punctuation.definition.alias.yaml"
				},
				"2": {
					"name": "variable.other.alias.yaml"
				},
				"3": {
					"name": "invalid.illegal.flow.alias.yaml"
				}
			},
			"patterns": [
				{
					"include": "#presentation-detail"
				}
			]
		},
		"byte-order-mark": {
			"comment": "﻿",
			"match": "\\G\\x{FEFF}++",
			"name": "byte-order-mark.yaml"
		},
		"presentation-detail": {
			"patterns": [
				{
					"match": "[\t ]++",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"include": "source.yaml#non-printable"
				},
				{
					"include": "#comment"
				},
				{
					"include": "#unknown"
				}
			]
		},
		"comment": {
			"comment": "Comments must be separated from other tokens by white space characters. `space`, `tab`, `newline` or `carriage-return`. `#(.*)` causes performance issues",
			"begin": "(?<=[\\x{FEFF}\t ]|^)#",
			"end": "$",
			"captures": {
				"0": {
					"name": "punctuation.definition.comment.yaml"
				}
			},
			"name": "comment.line.number-sign.yaml",
			"patterns": [
				{
					"include": "source.yaml#non-printable"
				}
			]
		},
		"unknown": {
			"match": ".[[^\"':,\\[\\]{}]&&!-~\\x{85}\\x{A0}-\\x{D7FF}\\x{E000}-\\x{FFFD}\\x{010000}-\\x{10FFFF}]*+",
			"name": "invalid.illegal.unrecognized.yaml"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/yaml/syntaxes/yaml-1.3.tmLanguage.json]---
Location: vscode-main/extensions/yaml/syntaxes/yaml-1.3.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/RedCMD/YAML-Syntax-Highlighter/blob/master/syntaxes/yaml-1.3.tmLanguage.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/RedCMD/YAML-Syntax-Highlighter/commit/274009903e20ac6dc37ba5763fb853744e28c9b2",
	"name": "YAML 1.3",
	"scopeName": "source.yaml.1.3",
	"comment": "https://spec.yaml.io/main/spec/1.3.0/",
	"patterns": [
		{
			"include": "source.yaml"
		}
	],
	"repository": {
		"directive-YAML": {
			"comment": "https://yaml.org/spec/1.2.2/#681-yaml-directives",
			"begin": "(?=%YAML[\t ]+1\\.3(?=[\r\n\t ]))",
			"end": "\\G(?=(?>\\.{3}|---)[\r\n\t ])",
			"name": "meta.1.3.yaml",
			"patterns": [
				{
					"comment": "https://yaml.org/spec/1.2.2/#681-yaml-directives",
					"begin": "\\G(%)(YAML)([\t ]+)(1\\.3)",
					"end": "\\G(?=---[\r\n\t ])",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.directive.begin.yaml"
						},
						"2": {
							"name": "keyword.other.directive.yaml.yaml"
						},
						"3": {
							"name": "punctuation.whitespace.separator.yaml"
						},
						"4": {
							"name": "constant.numeric.yaml-version.yaml"
						}
					},
					"name": "meta.directives.yaml",
					"patterns": [
						{
							"include": "source.yaml.1.2#directive-invalid"
						},
						{
							"include": "source.yaml.1.2#directives"
						},
						{
							"include": "source.yaml.1.2#presentation-detail"
						}
					]
				},
				{
					"include": "source.yaml.1.2#document"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

````
