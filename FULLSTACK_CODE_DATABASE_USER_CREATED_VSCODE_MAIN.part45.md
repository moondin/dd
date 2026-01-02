---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 45
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 45 of 552)

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

---[FILE: extensions/html-language-features/client/src/htmlClient.ts]---
Location: vscode-main/extensions/html-language-features/client/src/htmlClient.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import {
	languages, ExtensionContext, Position, TextDocument, Range, CompletionItem, CompletionItemKind, SnippetString, workspace, extensions,
	Disposable, FormattingOptions, CancellationToken, ProviderResult, TextEdit, CompletionContext, CompletionList, SemanticTokensLegend,
	DocumentSemanticTokensProvider, DocumentRangeSemanticTokensProvider, SemanticTokens, window, commands, l10n,
	LogOutputChannel
} from 'vscode';
import {
	LanguageClientOptions, RequestType, DocumentRangeFormattingParams,
	DocumentRangeFormattingRequest, ProvideCompletionItemsSignature, TextDocumentIdentifier, RequestType0, Range as LspRange, Position as LspPosition, NotificationType, BaseLanguageClient
} from 'vscode-languageclient';
import { FileSystemProvider, serveFileSystemRequests } from './requests';
import { getCustomDataSource } from './customData';
import { activateAutoInsertion } from './autoInsertion';
import { getLanguageParticipants, LanguageParticipants } from './languageParticipants';

namespace CustomDataChangedNotification {
	export const type: NotificationType<string[]> = new NotificationType('html/customDataChanged');
}

namespace CustomDataContent {
	export const type: RequestType<string, string, any> = new RequestType('html/customDataContent');
}

interface AutoInsertParams {
	/**
	 * The auto insert kind
	 */
	kind: 'autoQuote' | 'autoClose';
	/**
	 * The text document.
	 */
	textDocument: TextDocumentIdentifier;
	/**
	 * The position inside the text document.
	 */
	position: LspPosition;
}

namespace AutoInsertRequest {
	export const type: RequestType<AutoInsertParams, string, any> = new RequestType('html/autoInsert');
}

// experimental: semantic tokens
interface SemanticTokenParams {
	textDocument: TextDocumentIdentifier;
	ranges?: LspRange[];
}
namespace SemanticTokenRequest {
	export const type: RequestType<SemanticTokenParams, number[] | null, any> = new RequestType('html/semanticTokens');
}
namespace SemanticTokenLegendRequest {
	export const type: RequestType0<{ types: string[]; modifiers: string[] } | null, any> = new RequestType0('html/semanticTokenLegend');
}

namespace SettingIds {
	export const linkedEditing = 'editor.linkedEditing';
	export const formatEnable = 'html.format.enable';

}

export interface TelemetryReporter {
	sendTelemetryEvent(eventName: string, properties?: {
		[key: string]: string;
	}, measurements?: {
		[key: string]: number;
	}): void;
}

export type LanguageClientConstructor = (name: string, description: string, clientOptions: LanguageClientOptions) => BaseLanguageClient;

export const languageServerDescription = l10n.t('HTML Language Server');

export interface Runtime {
	TextDecoder: typeof TextDecoder;
	fileFs?: FileSystemProvider;
	telemetry?: TelemetryReporter;
	readonly timer: {
		setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable;
	};
}

export interface AsyncDisposable {
	dispose(): Promise<void>;
}

export async function startClient(context: ExtensionContext, newLanguageClient: LanguageClientConstructor, runtime: Runtime): Promise<AsyncDisposable> {

	const logOutputChannel = window.createOutputChannel(languageServerDescription, { log: true });

	const languageParticipants = getLanguageParticipants();
	context.subscriptions.push(languageParticipants);

	let client: Disposable | undefined = await startClientWithParticipants(languageParticipants, newLanguageClient, logOutputChannel, runtime);

	const promptForLinkedEditingKey = 'html.promptForLinkedEditing';
	if (extensions.getExtension('formulahendry.auto-rename-tag') !== undefined && (context.globalState.get(promptForLinkedEditingKey) !== false)) {
		const config = workspace.getConfiguration('editor', { languageId: 'html' });
		if (!config.get('linkedEditing') && !config.get('renameOnType')) {
			const activeEditorListener = window.onDidChangeActiveTextEditor(async e => {
				if (e && languageParticipants.hasLanguage(e.document.languageId)) {
					context.globalState.update(promptForLinkedEditingKey, false);
					activeEditorListener.dispose();
					const configure = l10n.t('Configure');
					const res = await window.showInformationMessage(l10n.t('VS Code now has built-in support for auto-renaming tags. Do you want to enable it?'), configure);
					if (res === configure) {
						commands.executeCommand('workbench.action.openSettings', SettingIds.linkedEditing);
					}
				}
			});
			context.subscriptions.push(activeEditorListener);
		}
	}

	let restartTrigger: Disposable | undefined;
	languageParticipants.onDidChange(() => {
		if (restartTrigger) {
			restartTrigger.dispose();
		}
		restartTrigger = runtime.timer.setTimeout(async () => {
			if (client) {
				logOutputChannel.info('Extensions have changed, restarting HTML server...');
				logOutputChannel.info('');
				const oldClient = client;
				client = undefined;
				await oldClient.dispose();
				client = await startClientWithParticipants(languageParticipants, newLanguageClient, logOutputChannel, runtime);
			}
		}, 2000);
	});

	return {
		dispose: async () => {
			restartTrigger?.dispose();
			await client?.dispose();
			logOutputChannel.dispose();
		}
	};
}

async function startClientWithParticipants(languageParticipants: LanguageParticipants, newLanguageClient: LanguageClientConstructor, logOutputChannel: LogOutputChannel, runtime: Runtime): Promise<AsyncDisposable> {

	const toDispose: Disposable[] = [];

	const documentSelector = languageParticipants.documentSelector;
	const embeddedLanguages = { css: true, javascript: true };

	let rangeFormatting: Disposable | undefined = undefined;

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		documentSelector,
		synchronize: {
			configurationSection: ['html', 'css', 'javascript', 'js/ts'], // the settings to synchronize
		},
		initializationOptions: {
			embeddedLanguages,
			handledSchemas: ['file'],
			provideFormatter: false, // tell the server to not provide formatting capability and ignore the `html.format.enable` setting.
			customCapabilities: { rangeFormatting: { editLimit: 10000 } }
		},
		middleware: {
			// testing the replace / insert mode
			provideCompletionItem(document: TextDocument, position: Position, context: CompletionContext, token: CancellationToken, next: ProvideCompletionItemsSignature): ProviderResult<CompletionItem[] | CompletionList> {
				function updateRanges(item: CompletionItem) {
					const range = item.range;
					if (range instanceof Range && range.end.isAfter(position) && range.start.isBeforeOrEqual(position)) {
						item.range = { inserting: new Range(range.start, position), replacing: range };
					}
				}
				function updateProposals(r: CompletionItem[] | CompletionList | null | undefined): CompletionItem[] | CompletionList | null | undefined {
					if (r) {
						(Array.isArray(r) ? r : r.items).forEach(updateRanges);
					}
					return r;
				}
				function isThenable<T>(obj: unknown): obj is Thenable<T> {
					return !!obj && typeof (obj as unknown as Thenable<T>).then === 'function';
				}
				const r = next(document, position, context, token);
				if (isThenable<CompletionItem[] | CompletionList | null | undefined>(r)) {
					return r.then(updateProposals);
				}
				return updateProposals(r);
			}
		}
	};
	clientOptions.outputChannel = logOutputChannel;

	// Create the language client and start the client.
	const client = newLanguageClient('html', languageServerDescription, clientOptions);
	client.registerProposedFeatures();

	await client.start();

	toDispose.push(serveFileSystemRequests(client, runtime));

	const customDataSource = getCustomDataSource(runtime, toDispose);

	client.sendNotification(CustomDataChangedNotification.type, customDataSource.uris);
	customDataSource.onDidChange(() => {
		client.sendNotification(CustomDataChangedNotification.type, customDataSource.uris);
	}, undefined, toDispose);
	toDispose.push(client.onRequest(CustomDataContent.type, customDataSource.getContent));


	const insertRequestor = (kind: 'autoQuote' | 'autoClose', document: TextDocument, position: Position): Promise<string> => {
		const param: AutoInsertParams = {
			kind,
			textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
			position: client.code2ProtocolConverter.asPosition(position)
		};
		return client.sendRequest(AutoInsertRequest.type, param);
	};

	const disposable = activateAutoInsertion(insertRequestor, languageParticipants, runtime);
	toDispose.push(disposable);

	const disposable2 = client.onTelemetry(e => {
		runtime.telemetry?.sendTelemetryEvent(e.key, e.data);
	});
	toDispose.push(disposable2);

	// manually register / deregister format provider based on the `html.format.enable` setting avoiding issues with late registration. See #71652.
	updateFormatterRegistration();
	toDispose.push({ dispose: () => rangeFormatting && rangeFormatting.dispose() });
	toDispose.push(workspace.onDidChangeConfiguration(e => e.affectsConfiguration(SettingIds.formatEnable) && updateFormatterRegistration()));

	client.sendRequest(SemanticTokenLegendRequest.type).then(legend => {
		if (legend) {
			const provider: DocumentSemanticTokensProvider & DocumentRangeSemanticTokensProvider = {
				provideDocumentSemanticTokens(doc) {
					const params: SemanticTokenParams = {
						textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(doc),
					};
					return client.sendRequest(SemanticTokenRequest.type, params).then(data => {
						return data && new SemanticTokens(new Uint32Array(data));
					});
				},
				provideDocumentRangeSemanticTokens(doc, range) {
					const params: SemanticTokenParams = {
						textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(doc),
						ranges: [client.code2ProtocolConverter.asRange(range)]
					};
					return client.sendRequest(SemanticTokenRequest.type, params).then(data => {
						return data && new SemanticTokens(new Uint32Array(data));
					});
				}
			};
			toDispose.push(languages.registerDocumentSemanticTokensProvider(documentSelector, provider, new SemanticTokensLegend(legend.types, legend.modifiers)));
		}
	});

	function updateFormatterRegistration() {
		const formatEnabled = workspace.getConfiguration().get(SettingIds.formatEnable);
		if (!formatEnabled && rangeFormatting) {
			rangeFormatting.dispose();
			rangeFormatting = undefined;
		} else if (formatEnabled && !rangeFormatting) {
			rangeFormatting = languages.registerDocumentRangeFormattingEditProvider(documentSelector, {
				provideDocumentRangeFormattingEdits(document: TextDocument, range: Range, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]> {
					const filesConfig = workspace.getConfiguration('files', document);
					const fileFormattingOptions = {
						trimTrailingWhitespace: filesConfig.get<boolean>('trimTrailingWhitespace'),
						trimFinalNewlines: filesConfig.get<boolean>('trimFinalNewlines'),
						insertFinalNewline: filesConfig.get<boolean>('insertFinalNewline'),
					};
					const params: DocumentRangeFormattingParams = {
						textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
						range: client.code2ProtocolConverter.asRange(range),
						options: client.code2ProtocolConverter.asFormattingOptions(options, fileFormattingOptions)
					};
					return client.sendRequest(DocumentRangeFormattingRequest.type, params, token).then(
						client.protocol2CodeConverter.asTextEdits,
						(error) => {
							client.handleFailedRequest(DocumentRangeFormattingRequest.type, undefined, error, []);
							return Promise.resolve([]);
						}
					);
				}
			});
		}
	}

	const regionCompletionRegExpr = /^(\s*)(<(!(-(-\s*(#\w*)?)?)?)?)?$/;
	const htmlSnippetCompletionRegExpr = /^(\s*)(<(h(t(m(l)?)?)?)?)?$/;
	toDispose.push(languages.registerCompletionItemProvider(documentSelector, {
		provideCompletionItems(doc, pos) {
			const results: CompletionItem[] = [];
			const lineUntilPos = doc.getText(new Range(new Position(pos.line, 0), pos));
			const match = lineUntilPos.match(regionCompletionRegExpr);
			if (match) {
				const range = new Range(new Position(pos.line, match[1].length), pos);
				const beginProposal = new CompletionItem('#region', CompletionItemKind.Snippet);
				beginProposal.range = range;
				beginProposal.insertText = new SnippetString('<!-- #region $1-->');
				beginProposal.documentation = l10n.t('Folding Region Start');
				beginProposal.filterText = match[2];
				beginProposal.sortText = 'za';
				results.push(beginProposal);
				const endProposal = new CompletionItem('#endregion', CompletionItemKind.Snippet);
				endProposal.range = range;
				endProposal.insertText = new SnippetString('<!-- #endregion -->');
				endProposal.documentation = l10n.t('Folding Region End');
				endProposal.filterText = match[2];
				endProposal.sortText = 'zb';
				results.push(endProposal);
			}
			const match2 = lineUntilPos.match(htmlSnippetCompletionRegExpr);
			if (match2 && doc.getText(new Range(new Position(0, 0), pos)).match(htmlSnippetCompletionRegExpr)) {
				const range = new Range(new Position(pos.line, match2[1].length), pos);
				const snippetProposal = new CompletionItem('HTML sample', CompletionItemKind.Snippet);
				snippetProposal.range = range;
				const content = ['<!DOCTYPE html>',
					'<html>',
					'<head>',
					'\t<meta charset=\'utf-8\'>',
					'\t<meta http-equiv=\'X-UA-Compatible\' content=\'IE=edge\'>',
					'\t<title>${1:Page Title}</title>',
					'\t<meta name=\'viewport\' content=\'width=device-width, initial-scale=1\'>',
					'\t<link rel=\'stylesheet\' type=\'text/css\' media=\'screen\' href=\'${2:main.css}\'>',
					'\t<script src=\'${3:main.js}\'></script>',
					'</head>',
					'<body>',
					'\t$0',
					'</body>',
					'</html>'].join('\n');
				snippetProposal.insertText = new SnippetString(content);
				snippetProposal.documentation = l10n.t('Simple HTML5 starting point');
				snippetProposal.filterText = match2[2];
				snippetProposal.sortText = 'za';
				results.push(snippetProposal);
			}
			return results;
		}
	}));

	return {
		dispose: async () => {
			await client.stop();
			toDispose.forEach(d => d.dispose());
			rangeFormatting?.dispose();
		}
	};

}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/client/src/languageParticipants.ts]---
Location: vscode-main/extensions/html-language-features/client/src/languageParticipants.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event, EventEmitter, extensions } from 'vscode';

/**
 * HTML language participant contribution.
 */
interface LanguageParticipantContribution {
	/**
	 * The id of the language which participates with the HTML language server.
	 */
	languageId: string;
	/**
	 * true if the language activates the auto insertion and false otherwise.
	 */
	autoInsert?: boolean;
}

export interface LanguageParticipants {
	readonly onDidChange: Event<void>;
	readonly documentSelector: string[];
	hasLanguage(languageId: string): boolean;
	useAutoInsert(languageId: string): boolean;
	dispose(): void;
}

export function getLanguageParticipants(): LanguageParticipants {
	const onDidChangeEmmiter = new EventEmitter<void>();
	let languages = new Set<string>();
	let autoInsert = new Set<string>();

	function update() {
		const oldLanguages = languages, oldAutoInsert = autoInsert;

		languages = new Set();
		languages.add('html');
		autoInsert = new Set();
		autoInsert.add('html');

		for (const extension of extensions.allAcrossExtensionHosts) {
			const htmlLanguageParticipants = extension.packageJSON?.contributes?.htmlLanguageParticipants as LanguageParticipantContribution[];
			if (Array.isArray(htmlLanguageParticipants)) {
				for (const htmlLanguageParticipant of htmlLanguageParticipants) {
					const languageId = htmlLanguageParticipant.languageId;
					if (typeof languageId === 'string') {
						languages.add(languageId);
						if (htmlLanguageParticipant.autoInsert !== false) {
							autoInsert.add(languageId);
						}
					}
				}
			}
		}
		return !isEqualSet(languages, oldLanguages) || !isEqualSet(autoInsert, oldAutoInsert);
	}
	update();

	const changeListener = extensions.onDidChange(_ => {
		if (update()) {
			onDidChangeEmmiter.fire();
		}
	});

	return {
		onDidChange: onDidChangeEmmiter.event,
		get documentSelector() { return Array.from(languages); },
		hasLanguage(languageId: string) { return languages.has(languageId); },
		useAutoInsert(languageId: string) { return autoInsert.has(languageId); },
		dispose: () => changeListener.dispose()
	};
}

function isEqualSet<T>(s1: Set<T>, s2: Set<T>) {
	if (s1.size !== s2.size) {
		return false;
	}
	for (const e of s1) {
		if (!s2.has(e)) {
			return false;
		}
	}
	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/client/src/requests.ts]---
Location: vscode-main/extensions/html-language-features/client/src/requests.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Uri, workspace, Disposable } from 'vscode';
import { RequestType, BaseLanguageClient } from 'vscode-languageclient';
import { Runtime } from './htmlClient';

export namespace FsStatRequest {
	export const type: RequestType<string, FileStat, any> = new RequestType('fs/stat');
}

export namespace FsReadDirRequest {
	export const type: RequestType<string, [string, FileType][], any> = new RequestType('fs/readDir');
}

export function serveFileSystemRequests(client: BaseLanguageClient, runtime: Runtime): Disposable {
	const disposables = [];
	disposables.push(client.onRequest(FsReadDirRequest.type, (uriString: string) => {
		const uri = Uri.parse(uriString);
		if (uri.scheme === 'file' && runtime.fileFs) {
			return runtime.fileFs.readDirectory(uriString);
		}
		return workspace.fs.readDirectory(uri);
	}));
	disposables.push(client.onRequest(FsStatRequest.type, (uriString: string) => {
		const uri = Uri.parse(uriString);
		if (uri.scheme === 'file' && runtime.fileFs) {
			return runtime.fileFs.stat(uriString);
		}
		return workspace.fs.stat(uri);
	}));
	return Disposable.from(...disposables);
}

export enum FileType {
	/**
	 * The file type is unknown.
	 */
	Unknown = 0,
	/**
	 * A regular file.
	 */
	File = 1,
	/**
	 * A directory.
	 */
	Directory = 2,
	/**
	 * A symbolic link to a file.
	 */
	SymbolicLink = 64
}
export interface FileStat {
	/**
	 * The type of the file, e.g. is a regular file, a directory, or symbolic link
	 * to a file.
	 */
	type: FileType;
	/**
	 * The creation timestamp in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
	 */
	ctime: number;
	/**
	 * The modification timestamp in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
	 */
	mtime: number;
	/**
	 * The size in bytes.
	 */
	size: number;
}

export interface FileSystemProvider {
	stat(uri: string): Promise<FileStat>;
	readDirectory(uri: string): Promise<[string, FileType][]>;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/client/src/browser/htmlClientMain.ts]---
Location: vscode-main/extensions/html-language-features/client/src/browser/htmlClientMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, ExtensionContext, Uri, l10n } from 'vscode';
import { LanguageClientOptions } from 'vscode-languageclient';
import { startClient, LanguageClientConstructor, AsyncDisposable } from '../htmlClient';
import { LanguageClient } from 'vscode-languageclient/browser';

let client: AsyncDisposable | undefined;

// this method is called when vs code is activated
export async function activate(context: ExtensionContext) {
	const serverMain = Uri.joinPath(context.extensionUri, 'server/dist/browser/htmlServerMain.js');
	try {
		const worker = new Worker(serverMain.toString());
		worker.postMessage({ i10lLocation: l10n.uri?.toString(false) ?? '' });

		const newLanguageClient: LanguageClientConstructor = (id: string, name: string, clientOptions: LanguageClientOptions) => {
			return new LanguageClient(id, name, worker, clientOptions);
		};

		const timer = {
			setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable {
				const handle = setTimeout(callback, ms, ...args);
				return { dispose: () => clearTimeout(handle) };
			}
		};

		client = await startClient(context, newLanguageClient, { TextDecoder, timer });

	} catch (e) {
		console.log(e);
	}
}

export async function deactivate(): Promise<void> {
	if (client) {
		await client.dispose();
		client = undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/client/src/node/htmlClientMain.ts]---
Location: vscode-main/extensions/html-language-features/client/src/node/htmlClientMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getNodeFileFS } from './nodeFs';
import { Disposable, ExtensionContext, l10n } from 'vscode';
import { startClient, LanguageClientConstructor, AsyncDisposable } from '../htmlClient';
import { ServerOptions, TransportKind, LanguageClientOptions, LanguageClient } from 'vscode-languageclient/node';
import * as fs from 'fs';
import TelemetryReporter from '@vscode/extension-telemetry';


let telemetry: TelemetryReporter | undefined;
let client: AsyncDisposable | undefined;

// this method is called when vs code is activated
export async function activate(context: ExtensionContext) {

	const clientPackageJSON = getPackageInfo(context);
	telemetry = new TelemetryReporter(clientPackageJSON.aiKey);

	const serverMain = `./server/${clientPackageJSON.main.indexOf('/dist/') !== -1 ? 'dist' : 'out'}/node/htmlServerMain`;
	const serverModule = context.asAbsolutePath(serverMain);

	// The debug options for the server
	const debugOptions = { execArgv: ['--nolazy', '--inspect=' + (8000 + Math.round(Math.random() * 999))] };

	// If the extension is launch in debug mode the debug server options are use
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
	};

	const newLanguageClient: LanguageClientConstructor = (id: string, name: string, clientOptions: LanguageClientOptions) => {
		return new LanguageClient(id, name, serverOptions, clientOptions);
	};

	const timer = {
		setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable {
			const handle = setTimeout(callback, ms, ...args);
			return { dispose: () => clearTimeout(handle) };
		}
	};


	// pass the location of the localization bundle to the server
	process.env['VSCODE_L10N_BUNDLE_LOCATION'] = l10n.uri?.toString() ?? '';

	client = await startClient(context, newLanguageClient, { fileFs: getNodeFileFS(), TextDecoder, telemetry, timer });
}

export async function deactivate(): Promise<void> {
	if (client) {
		await client.dispose();
		client = undefined;
	}
}

interface IPackageInfo {
	name: string;
	version: string;
	aiKey: string;
	main: string;
}

function getPackageInfo(context: ExtensionContext): IPackageInfo {
	const location = context.asAbsolutePath('./package.json');
	try {
		return JSON.parse(fs.readFileSync(location).toString());
	} catch (e) {
		console.log(`Problems reading ${location}: ${e}`);
		return { name: '', version: '', aiKey: '', main: '' };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/client/src/node/nodeFs.ts]---
Location: vscode-main/extensions/html-language-features/client/src/node/nodeFs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { Uri } from 'vscode';
import { FileSystemProvider, FileType } from '../requests';

export function getNodeFileFS(): FileSystemProvider {
	function ensureFileUri(location: string) {
		if (!location.startsWith('file:')) {
			throw new Error('fileRequestService can only handle file URLs');
		}
	}
	return {
		stat(location: string) {
			ensureFileUri(location);
			return new Promise((c, e) => {
				const uri = Uri.parse(location);
				fs.stat(uri.fsPath, (err, stats) => {
					if (err) {
						if (err.code === 'ENOENT') {
							return c({ type: FileType.Unknown, ctime: -1, mtime: -1, size: -1 });
						} else {
							return e(err);
						}
					}

					let type = FileType.Unknown;
					if (stats.isFile()) {
						type = FileType.File;
					} else if (stats.isDirectory()) {
						type = FileType.Directory;
					} else if (stats.isSymbolicLink()) {
						type = FileType.SymbolicLink;
					}

					c({
						type,
						ctime: stats.ctime.getTime(),
						mtime: stats.mtime.getTime(),
						size: stats.size
					});
				});
			});
		},
		readDirectory(location: string) {
			ensureFileUri(location);
			return new Promise((c, e) => {
				const path = Uri.parse(location).fsPath;

				fs.readdir(path, { withFileTypes: true }, (err, children) => {
					if (err) {
						return e(err);
					}
					c(children.map(stat => {
						if (stat.isSymbolicLink()) {
							return [stat.name, FileType.SymbolicLink];
						} else if (stat.isDirectory()) {
							return [stat.name, FileType.Directory];
						} else if (stat.isFile()) {
							return [stat.name, FileType.File];
						} else {
							return [stat.name, FileType.Unknown];
						}
					}));
				});
			});
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/schemas/package.schema.json]---
Location: vscode-main/extensions/html-language-features/schemas/package.schema.json

```json
{
	"$schema": "http://json-schema.org/draft-07/schema#",
	"type": "object",
	"properties": {
		"contributes": {
			"type": "object",
			"properties": {
				"html.customData": {
					"type": "array",
					"markdownDescription": "A list of relative file paths pointing to JSON files following the [custom data format](https://github.com/microsoft/vscode-html-languageservice/blob/master/docs/customData.md).\n\nVS Code loads custom data on startup to enhance its HTML support for the custom HTML tags, attributes and attribute values you specify in the JSON files.\n\nThe file paths are relative to workspace and only workspace folder settings are considered.",
					"items": {
						"type": "string",
						"description": "Relative path to a HTML custom data file"
					}
				},
				"htmlLanguageParticipants": {
					"type": "array",
					"description": "A list of languages that participate with the HTML language server.",
					"items": {
						"type": "object",
						"properties": {
							"languageId": {
								"type": "string",
								"description": "The id of the language that participates with HTML language server."
							},
							"autoInsert": {
								"type": "boolean",
								"description": "Whether the language participates with HTML auto insertions. If not specified, defaults to <code>true</code>."
							}
						}
					}
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/.npmrc]---
Location: vscode-main/extensions/html-language-features/server/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/html-language-features/server/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import { browser as withBrowserDefaults } from '../../shared.webpack.config.mjs';
import path from 'path';

const serverConfig = withBrowserDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/browser/htmlServerWorkerMain.ts',
	},
	resolve: {
		extensionAlias: {
			// this is needed to resolve dynamic imports that now require the .js extension
			'.js': ['.js', '.ts'],
		},
	},
	output: {
		filename: 'htmlServerMain.js',
		path: path.join(import.meta.dirname, 'dist', 'browser'),
		libraryTarget: 'var',
		library: 'serverExportVar'
	},
	optimization: {
		splitChunks: {
			chunks: 'async'
		}
	}
});
serverConfig.module.noParse = /typescript[\/\\]lib[\/\\]typescript\.js/;
serverConfig.module.rules.push({
	test: /javascriptLibs.ts$/,
	use: [
		{
			loader: path.resolve(import.meta.dirname, 'build', 'javaScriptLibraryLoader.js')
		}
	]
});

export default serverConfig;
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/extension.webpack.config.js]---
Location: vscode-main/extensions/html-language-features/server/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults from '../../shared.webpack.config.mjs';
import path from 'path';

export default withDefaults({
	context: path.join(import.meta.dirname),
	entry: {
		extension: './src/node/htmlServerNodeMain.ts',
	},
	output: {
		filename: 'htmlServerMain.js',
		path: path.join(import.meta.dirname, 'dist', 'node'),
	},
	externals: {
		'typescript': 'commonjs typescript'
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/package-lock.json]---
Location: vscode-main/extensions/html-language-features/server/package-lock.json

```json
{
  "name": "vscode-html-languageserver",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "vscode-html-languageserver",
      "version": "1.0.0",
      "license": "MIT",
      "dependencies": {
        "@vscode/l10n": "^0.0.18",
        "vscode-css-languageservice": "^6.3.9",
        "vscode-html-languageservice": "^5.6.1",
        "vscode-languageserver": "^10.0.0-next.15",
        "vscode-languageserver-textdocument": "^1.0.12",
        "vscode-uri": "^3.1.0"
      },
      "devDependencies": {
        "@types/mocha": "^10.0.10",
        "@types/node": "22.x"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/@types/mocha": {
      "version": "10.0.10",
      "resolved": "https://registry.npmjs.org/@types/mocha/-/mocha-10.0.10.tgz",
      "integrity": "sha512-xPyYSz1cMPnJQhl0CLMH68j3gprKZaTjG3s5Vi+fDgx+uhG9NOXwbVt52eFS8ECyXhyKcjDLCBEqBExKuiZb7Q==",
      "dev": true,
      "license": "MIT"
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
    "node_modules/@vscode/l10n": {
      "version": "0.0.18",
      "resolved": "https://registry.npmjs.org/@vscode/l10n/-/l10n-0.0.18.tgz",
      "integrity": "sha512-KYSIHVmslkaCDyw013pphY+d7x1qV8IZupYfeIfzNA+nsaWHbn5uPuQRvdRFsa9zFzGeudPuoGoZ1Op4jrJXIQ=="
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/vscode-css-languageservice": {
      "version": "6.3.9",
      "resolved": "https://registry.npmjs.org/vscode-css-languageservice/-/vscode-css-languageservice-6.3.9.tgz",
      "integrity": "sha512-1tLWfp+TDM5ZuVWht3jmaY5y7O6aZmpeXLoHl5bv1QtRsRKt4xYGRMmdJa5Pqx/FTkgRbsna9R+Gn2xE+evVuA==",
      "license": "MIT",
      "dependencies": {
        "@vscode/l10n": "^0.0.18",
        "vscode-languageserver-textdocument": "^1.0.12",
        "vscode-languageserver-types": "3.17.5",
        "vscode-uri": "^3.1.0"
      }
    },
    "node_modules/vscode-html-languageservice": {
      "version": "5.6.1",
      "resolved": "https://registry.npmjs.org/vscode-html-languageservice/-/vscode-html-languageservice-5.6.1.tgz",
      "integrity": "sha512-5Mrqy5CLfFZUgkyhNZLA1Ye5g12Cb/v6VM7SxUzZUaRKWMDz4md+y26PrfRTSU0/eQAl3XpO9m2og+GGtDMuaA==",
      "license": "MIT",
      "dependencies": {
        "@vscode/l10n": "^0.0.18",
        "vscode-languageserver-textdocument": "^1.0.12",
        "vscode-languageserver-types": "^3.17.5",
        "vscode-uri": "^3.1.0"
      }
    },
    "node_modules/vscode-jsonrpc": {
      "version": "9.0.0-next.10",
      "resolved": "https://registry.npmjs.org/vscode-jsonrpc/-/vscode-jsonrpc-9.0.0-next.10.tgz",
      "integrity": "sha512-P+UOjuG/B1zkLM+bGIdmBwSkDejxtgo6EjG0pIkwnFBI0a2Mb7od36uUu8CPbECeQuh+n3zGcNwDl16DhuJ5IA==",
      "license": "MIT",
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/vscode-languageserver": {
      "version": "10.0.0-next.15",
      "resolved": "https://registry.npmjs.org/vscode-languageserver/-/vscode-languageserver-10.0.0-next.15.tgz",
      "integrity": "sha512-vs+bwci/lM83ZhrR9t8DcZ2AgS2CKx4i6Yw86teKKkqlzlrYWTixuBd9w6H/UP9s8EGBvii0jnbjQd6wsKJ0ig==",
      "license": "MIT",
      "dependencies": {
        "vscode-languageserver-protocol": "3.17.6-next.15"
      },
      "bin": {
        "installServerIntoExtension": "bin/installServerIntoExtension"
      }
    },
    "node_modules/vscode-languageserver-protocol": {
      "version": "3.17.6-next.15",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-protocol/-/vscode-languageserver-protocol-3.17.6-next.15.tgz",
      "integrity": "sha512-aoWX1wwGCndzfrTRhGKVpKAPVy9+WYhUtZW/PJQfHODmVwhVwb4we68CgsQZRTl36t8ZqlSOO2c2TdBPW7hrCw==",
      "license": "MIT",
      "dependencies": {
        "vscode-jsonrpc": "9.0.0-next.10",
        "vscode-languageserver-types": "3.17.6-next.6"
      }
    },
    "node_modules/vscode-languageserver-protocol/node_modules/vscode-languageserver-types": {
      "version": "3.17.6-next.6",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-types/-/vscode-languageserver-types-3.17.6-next.6.tgz",
      "integrity": "sha512-aiJY5/yW+xzw7KPNlwi3gQtddq/3EIn5z8X8nCgJfaiAij2R1APKePngv+MUdLdYJBVTLu+Qa0ODsT+pHgYguQ==",
      "license": "MIT"
    },
    "node_modules/vscode-languageserver-textdocument": {
      "version": "1.0.12",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-textdocument/-/vscode-languageserver-textdocument-1.0.12.tgz",
      "integrity": "sha512-cxWNPesCnQCcMPeenjKKsOCKQZ/L6Tv19DTRIGuLWe32lyzWhihGVJ/rcckZXJxfdKCFvRLS3fpBIsV/ZGX4zA=="
    },
    "node_modules/vscode-languageserver-types": {
      "version": "3.17.5",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-types/-/vscode-languageserver-types-3.17.5.tgz",
      "integrity": "sha512-Ld1VelNuX9pdF39h2Hgaeb5hEZM2Z3jUrrMgWQAu82jMtZp7p3vJT3BzToKtZI7NgQssZje5o0zryOrhQvzQAg=="
    },
    "node_modules/vscode-uri": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/vscode-uri/-/vscode-uri-3.1.0.tgz",
      "integrity": "sha512-/BpdSx+yCQGnCvecbyXdxHDkuk55/G3xwnC0GqY4gmQ3j+A+g8kzzgB4Nk/SINjqn6+waqw3EgbVF2QKExkRxQ==",
      "license": "MIT"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/package.json]---
Location: vscode-main/extensions/html-language-features/server/package.json

```json
{
  "name": "vscode-html-languageserver",
  "description": "HTML language server",
  "version": "1.0.0",
  "author": "Microsoft Corporation",
  "license": "MIT",
  "engines": {
    "node": "*"
  },
  "main": "./out/node/htmlServerMain",
  "dependencies": {
    "@vscode/l10n": "^0.0.18",
    "vscode-css-languageservice": "^6.3.9",
    "vscode-html-languageservice": "^5.6.1",
    "vscode-languageserver": "^10.0.0-next.15",
    "vscode-languageserver-textdocument": "^1.0.12",
    "vscode-uri": "^3.1.0"
  },
  "devDependencies": {
    "@types/mocha": "^10.0.10",
    "@types/node": "22.x"
  },
  "scripts": {
    "compile": "npx gulp compile-extension:html-language-features-server",
    "watch": "npx gulp watch-extension:html-language-features-server",
    "install-service-next": "npm install vscode-css-languageservice && npm install vscode-html-languageservice",
    "install-service-local": "npm install vscode-css-languageservice && npm install vscode-html-languageservice",
    "install-server-next": "npm install vscode-languageserver@next",
    "install-server-local": "npm install vscode-languageserver",
    "test": "npm run compile && node ./test/index.js"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/tsconfig.json]---
Location: vscode-main/extensions/html-language-features/server/tsconfig.json

```json
{
	"extends": "../../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"lib": [
			"ES2024",
			"WebWorker"
		],
		"module": "Node16",
		"typeRoots": [
			"../node_modules/@types"
		]
	},
	"include": [
		"src/**/*"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/.vscode/launch.json]---
Location: vscode-main/extensions/html-language-features/server/.vscode/launch.json

```json
{
	"version": "0.1.0",
	// List of configurations. Add new configurations or edit existing ones.
	"configurations": [
		{
			"name": "Attach",
			"type": "node",
			"request": "attach",
			"port": 6045,
			"protocol": "inspector",
			"sourceMaps": true,
			"outFiles": ["${workspaceFolder}/out/**/*.js"]
		},
		{
			"name": "Unit Tests",
			"type": "node",
			"request": "launch",
			"program": "${workspaceFolder}/../../../node_modules/mocha/bin/_mocha",
			"stopOnEntry": false,
			"args": [
				"--timeout",
				"999999",
				"--colors"
			],
			"cwd": "${workspaceFolder}",
			"runtimeExecutable": null,
			"runtimeArgs": [],
			"env": {},
			"sourceMaps": true,
			"outFiles": ["${workspaceFolder}/out/**/*.js"]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/.vscode/tasks.json]---
Location: vscode-main/extensions/html-language-features/server/.vscode/tasks.json

```json
{
	"version": "2.0.0",
	"tasks": [
		{
			"label": "npm run watch",
			"command": "npm i",
			"args": ["watch"],
			"type": "shell",
			"presentation": {
				"reveal": "silent",
				"focus": false,
				"panel": "shared"
			},
			"isBackground": true,
			"problemMatcher": "$tsc-watch"
		}
	],
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/build/javaScriptLibraryLoader.js]---
Location: vscode-main/extensions/html-language-features/server/build/javaScriptLibraryLoader.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// a webpack loader that bundles all library definitions (d.ts) for the embedded JavaScript engine.

const path = require('path');
const fs = require('fs');

const TYPESCRIPT_LIB_SOURCE = path.join(__dirname, '../../../node_modules/typescript/lib');
const JQUERY_DTS = path.join(__dirname, '../lib/jquery.d.ts');

module.exports = function () {
	function getFileName(name) {
		return (name === '' ? 'lib.d.ts' : `lib.${name}.d.ts`);
	}
	function readLibFile(name) {
		var srcPath = path.join(TYPESCRIPT_LIB_SOURCE, getFileName(name));
		return fs.readFileSync(srcPath).toString();
	}

	var queue = [];
	var in_queue = {};

	var enqueue = function (name) {
		if (in_queue[name]) {
			return;
		}
		in_queue[name] = true;
		queue.push(name);
	};

	enqueue('es2020.full');

	var result = [];
	while (queue.length > 0) {
		var name = queue.shift();
		var contents = readLibFile(name);
		var lines = contents.split(/\r\n|\r|\n/);

		var outputLines = [];
		for (let i = 0; i < lines.length; i++) {
			let m = lines[i].match(/\/\/\/\s*<reference\s*lib="([^"]+)"/);
			if (m) {
				enqueue(m[1]);
			}
			outputLines.push(lines[i]);
		}

		result.push({
			name: getFileName(name),
			output: `"${escapeText(outputLines.join('\n'))}"`
		});
	}

	const jquerySource = fs.readFileSync(JQUERY_DTS).toString();
	var lines = jquerySource.split(/\r\n|\r|\n/);
	result.push({
		name: 'jquery',
		output: `"${escapeText(lines.join('\n'))}"`
	});

	let strResult = `\nconst libs : { [name:string]: string; } = {\n`
	for (let i = result.length - 1; i >= 0; i--) {
		strResult += `"${result[i].name}": ${result[i].output},\n`;
	}
	strResult += `\n};`

	strResult += `export function loadLibrary(name: string) : string {\n return libs[name] || ''; \n}`;

	return strResult;
}

/**
 * Escape text such that it can be used in a javascript string enclosed by double quotes (")
 */
function escapeText(text) {
	// See http://www.javascriptkit.com/jsref/escapesequence.shtml
	var _backspace = '\b'.charCodeAt(0);
	var _formFeed = '\f'.charCodeAt(0);
	var _newLine = '\n'.charCodeAt(0);
	var _nullChar = 0;
	var _carriageReturn = '\r'.charCodeAt(0);
	var _tab = '\t'.charCodeAt(0);
	var _verticalTab = '\v'.charCodeAt(0);
	var _backslash = '\\'.charCodeAt(0);
	var _doubleQuote = '"'.charCodeAt(0);

	var startPos = 0, chrCode, replaceWith = null, resultPieces = [];

	for (var i = 0, len = text.length; i < len; i++) {
		chrCode = text.charCodeAt(i);
		switch (chrCode) {
			case _backspace:
				replaceWith = '\\b';
				break;
			case _formFeed:
				replaceWith = '\\f';
				break;
			case _newLine:
				replaceWith = '\\n';
				break;
			case _nullChar:
				replaceWith = '\\0';
				break;
			case _carriageReturn:
				replaceWith = '\\r';
				break;
			case _tab:
				replaceWith = '\\t';
				break;
			case _verticalTab:
				replaceWith = '\\v';
				break;
			case _backslash:
				replaceWith = '\\\\';
				break;
			case _doubleQuote:
				replaceWith = '\\"';
				break;
		}
		if (replaceWith !== null) {
			resultPieces.push(text.substring(startPos, i));
			resultPieces.push(replaceWith);
			startPos = i + 1;
			replaceWith = null;
		}
	}
	resultPieces.push(text.substring(startPos, len));
	return resultPieces.join('');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/lib/cgmanifest.json]---
Location: vscode-main/extensions/html-language-features/server/lib/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "definitelytyped",
					"repositoryUrl": "https://github.com/DefinitelyTyped/DefinitelyTyped",
					"commitHash": "69e3ac6bec3008271f76bbfa7cf69aa9198c4ff0"
				}
			},
			"license": "MIT"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

````
