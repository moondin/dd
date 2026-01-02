---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 61
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 61 of 552)

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

---[FILE: extensions/markdown-language-features/src/languageFeatures/updateLinksOnPaste.ts]---
Location: vscode-main/extensions/markdown-language-features/src/languageFeatures/updateLinksOnPaste.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { MdLanguageClient } from '../client/client';
import { Mime } from '../util/mimes';

class UpdatePastedLinksEditProvider implements vscode.DocumentPasteEditProvider {

	public static readonly kind = vscode.DocumentDropOrPasteEditKind.Text.append('updateLinks', 'markdown');

	public static readonly metadataMime = 'application/vnd.vscode.markdown.updatelinks.metadata';

	constructor(
		private readonly _client: MdLanguageClient,
	) { }

	async prepareDocumentPaste(document: vscode.TextDocument, ranges: readonly vscode.Range[], dataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
		if (!this._isEnabled(document)) {
			return;
		}

		const metadata = await this._client.prepareUpdatePastedLinks(document.uri, ranges, token);
		if (token.isCancellationRequested) {
			return;
		}

		dataTransfer.set(UpdatePastedLinksEditProvider.metadataMime, new vscode.DataTransferItem(metadata));
	}

	async provideDocumentPasteEdits(
		document: vscode.TextDocument,
		ranges: readonly vscode.Range[],
		dataTransfer: vscode.DataTransfer,
		context: vscode.DocumentPasteEditContext,
		token: vscode.CancellationToken,
	): Promise<vscode.DocumentPasteEdit[] | undefined> {
		if (!this._isEnabled(document)) {
			return;
		}

		const metadata = dataTransfer.get(UpdatePastedLinksEditProvider.metadataMime)?.value;
		if (!metadata) {
			return;
		}

		const textItem = dataTransfer.get(Mime.textPlain);
		const text = await textItem?.asString();
		if (!text || token.isCancellationRequested) {
			return;
		}

		// TODO: Handle cases such as:
		// - copy empty line
		// - Copy with multiple cursors and paste into multiple locations
		// - ...
		const edits = await this._client.getUpdatePastedLinksEdit(document.uri, ranges.map(x => new vscode.TextEdit(x, text)), metadata, token);
		if (!edits?.length || token.isCancellationRequested) {
			return;
		}

		const pasteEdit = new vscode.DocumentPasteEdit('', vscode.l10n.t("Paste and update pasted links"), UpdatePastedLinksEditProvider.kind);
		const workspaceEdit = new vscode.WorkspaceEdit();
		workspaceEdit.set(document.uri, edits.map(x => new vscode.TextEdit(new vscode.Range(x.range.start.line, x.range.start.character, x.range.end.line, x.range.end.character,), x.newText)));
		pasteEdit.additionalEdit = workspaceEdit;

		if (!context.only || !UpdatePastedLinksEditProvider.kind.contains(context.only)) {
			pasteEdit.yieldTo = [vscode.DocumentDropOrPasteEditKind.Text];
		}

		return [pasteEdit];
	}

	private _isEnabled(document: vscode.TextDocument): boolean {
		return vscode.workspace.getConfiguration('markdown', document.uri).get<boolean>('editor.updateLinksOnPaste.enabled', true);
	}
}

export function registerUpdatePastedLinks(selector: vscode.DocumentSelector, client: MdLanguageClient) {
	return vscode.languages.registerDocumentPasteEditProvider(selector, new UpdatePastedLinksEditProvider(client), {
		copyMimeTypes: [UpdatePastedLinksEditProvider.metadataMime],
		providedPasteEditKinds: [UpdatePastedLinksEditProvider.kind],
		pasteMimeTypes: [UpdatePastedLinksEditProvider.metadataMime],
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/languageFeatures/copyFiles/copyFiles.ts]---
Location: vscode-main/extensions/markdown-language-features/src/languageFeatures/copyFiles/copyFiles.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as path from 'path';
import * as vscode from 'vscode';
import { Utils } from 'vscode-uri';

type OverwriteBehavior = 'overwrite' | 'nameIncrementally';

export interface CopyFileConfiguration {
	readonly destination: Record<string, string>;
	readonly overwriteBehavior: OverwriteBehavior;
}

export function getCopyFileConfiguration(document: vscode.TextDocument): CopyFileConfiguration {
	const config = vscode.workspace.getConfiguration('markdown', document);
	return {
		destination: config.get<Record<string, string>>('copyFiles.destination') ?? {},
		overwriteBehavior: readOverwriteBehavior(config),
	};
}

function readOverwriteBehavior(config: vscode.WorkspaceConfiguration): OverwriteBehavior {
	switch (config.get('copyFiles.overwriteBehavior')) {
		case 'overwrite': return 'overwrite';
		default: return 'nameIncrementally';
	}
}

export function parseGlob(rawGlob: string): Iterable<string> {
	if (rawGlob.startsWith('/')) {
		// Anchor to workspace folders
		return (vscode.workspace.workspaceFolders ?? []).map(folder => vscode.Uri.joinPath(folder.uri, rawGlob).path);
	}

	// Relative path, so implicitly track on ** to match everything
	if (!rawGlob.startsWith('**')) {
		return ['**/' + rawGlob];
	}

	return [rawGlob];
}

type GetWorkspaceFolder = (documentUri: vscode.Uri) => vscode.Uri | undefined;

export function resolveCopyDestination(documentUri: vscode.Uri, fileName: string, dest: string, getWorkspaceFolder: GetWorkspaceFolder): vscode.Uri {
	const resolvedDest = resolveCopyDestinationSetting(documentUri, fileName, dest, getWorkspaceFolder);

	if (resolvedDest.startsWith('/')) {
		// Absolute path
		return Utils.resolvePath(documentUri, resolvedDest);
	}

	// Relative to document
	const dirName = Utils.dirname(documentUri);
	return Utils.resolvePath(dirName, resolvedDest);
}


function resolveCopyDestinationSetting(documentUri: vscode.Uri, fileName: string, dest: string, getWorkspaceFolder: GetWorkspaceFolder): string {
	let outDest = dest.trim();
	if (!outDest) {
		outDest = '${fileName}';
	}

	// Destination that start with `/` implicitly means go to workspace root
	if (outDest.startsWith('/')) {
		outDest = '${documentWorkspaceFolder}/' + outDest.slice(1);
	}

	// Destination that ends with `/` implicitly needs a fileName
	if (outDest.endsWith('/')) {
		outDest += '${fileName}';
	}

	const documentDirName = Utils.dirname(documentUri);
	const documentBaseName = Utils.basename(documentUri);
	const documentExtName = Utils.extname(documentUri);

	const workspaceFolder = getWorkspaceFolder(documentUri);

	const vars = new Map<string, string>([
		// Document
		['documentDirName', documentDirName.path], // Absolute parent directory path of the Markdown document, e.g. `/Users/me/myProject/docs`.
		['documentRelativeDirName', workspaceFolder ? path.posix.relative(workspaceFolder.path, documentDirName.path) : documentDirName.path], // Relative parent directory path of the Markdown document, e.g. `docs`. This is the same as `${documentDirName}` if the file is not part of a workspace.
		['documentFileName', documentBaseName], // The full filename of the Markdown document, e.g. `README.md`.
		['documentBaseName', documentBaseName.slice(0, documentBaseName.length - documentExtName.length)], // The basename of the Markdown document, e.g. `README`.
		['documentExtName', documentExtName.replace('.', '')], // The extension of the Markdown document, e.g. `md`.
		['documentFilePath', documentUri.path], // Absolute path of the Markdown document, e.g. `/Users/me/myProject/docs/README.md`.
		['documentRelativeFilePath', workspaceFolder ? path.posix.relative(workspaceFolder.path, documentUri.path) : documentUri.path], // Relative path of the Markdown document, e.g. `docs/README.md`. This is the same as `${documentFilePath}` if the file is not part of a workspace.

		// Workspace
		['documentWorkspaceFolder', ((workspaceFolder ?? documentDirName).path)], // The workspace folder for the Markdown document, e.g. `/Users/me/myProject`. This is the same as `${documentDirName}` if the file is not part of a workspace.

		// File
		['fileName', fileName], // The file name of the dropped file, e.g. `image.png`.
		['fileExtName', path.extname(fileName).replace('.', '')], // The extension of the dropped file, e.g. `png`.
		['unixTime', Date.now().toString()], // The current Unix timestamp in milliseconds.
		['isoTime', new Date().toISOString()], // The current time in ISO 8601 format, e.g. '2025-06-06T08:40:32.123Z'.
	]);

	return outDest.replaceAll(/(?<escape>\\\$)|(?<!\\)\$\{(?<name>\w+)(?:\/(?<pattern>(?:\\\/|[^\}\/])+)\/(?<replacement>(?:\\\/|[^\}\/])*)\/)?\}/g, (match, _escape, name, pattern, replacement, _offset, _str, groups) => {
		if (groups?.['escape']) {
			return '$';
		}

		const entry = vars.get(name);
		if (typeof entry !== 'string') {
			return match;
		}

		if (pattern && replacement) {
			try {
				return entry.replace(new RegExp(replaceTransformEscapes(pattern)), replaceTransformEscapes(replacement));
			} catch (e) {
				console.log(`Error applying 'resolveCopyDestinationSetting' transform: ${pattern} -> ${replacement}`);
			}
		}

		return entry;
	});
}

function replaceTransformEscapes(str: string): string {
	return str.replaceAll(/\\\//g, '/');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/languageFeatures/copyFiles/dropOrPasteResource.ts]---
Location: vscode-main/extensions/markdown-language-features/src/languageFeatures/copyFiles/dropOrPasteResource.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { IMdParser } from '../../markdownEngine';
import { coalesce } from '../../util/arrays';
import { getParentDocumentUri } from '../../util/document';
import { getMediaKindForMime, MediaKind, Mime, rootMediaMimesTypes } from '../../util/mimes';
import { Schemes } from '../../util/schemes';
import { UriList } from '../../util/uriList';
import { NewFilePathGenerator } from './newFilePathGenerator';
import { audioEditKind, baseLinkEditKind, createInsertUriListEdit, createUriListSnippet, DropOrPasteEdit, getSnippetLabelAndKind, imageEditKind, linkEditKind, videoEditKind } from './shared';
import { InsertMarkdownLink, shouldInsertMarkdownLinkByDefault } from './smartDropOrPaste';

enum CopyFilesSettings {
	Never = 'never',
	MediaFiles = 'mediaFiles',
}

/**
 * Provides support for pasting or dropping resources into markdown documents.
 *
 * This includes:
 *
 * - `text/uri-list` data in the data transfer.
 * - File object in the data transfer.
 * - Media data in the data transfer, such as `image/png`.
 */
class ResourcePasteOrDropProvider implements vscode.DocumentPasteEditProvider, vscode.DocumentDropEditProvider {

	public static readonly mimeTypes = [
		Mime.textUriList,
		'files',
		...Object.values(rootMediaMimesTypes).map(type => `${type}/*`),
	];

	private readonly _yieldTo = [
		vscode.DocumentDropOrPasteEditKind.Text,
		vscode.DocumentDropOrPasteEditKind.Empty.append('markdown', 'link', 'image', 'attachment'), // Prefer notebook attachments
	];

	constructor(
		private readonly _parser: IMdParser,
	) { }

	public async provideDocumentDropEdits(
		document: vscode.TextDocument,
		position: vscode.Position,
		dataTransfer: vscode.DataTransfer,
		token: vscode.CancellationToken,
	): Promise<vscode.DocumentDropEdit | undefined> {
		const edit = await this._createEdit(document, [new vscode.Range(position, position)], dataTransfer, {
			insert: this._getEnabled(document, 'editor.drop.enabled'),
			copyIntoWorkspace: vscode.workspace.getConfiguration('markdown', document).get<CopyFilesSettings>('editor.drop.copyIntoWorkspace', CopyFilesSettings.MediaFiles)
		}, undefined, token);

		if (!edit || token.isCancellationRequested) {
			return;
		}

		const dropEdit = new vscode.DocumentDropEdit(edit.snippet);
		dropEdit.title = edit.label;
		dropEdit.kind = edit.kind;
		dropEdit.additionalEdit = edit.additionalEdits;
		dropEdit.yieldTo = [...this._yieldTo, ...edit.yieldTo];
		return dropEdit;
	}

	public async provideDocumentPasteEdits(
		document: vscode.TextDocument,
		ranges: readonly vscode.Range[],
		dataTransfer: vscode.DataTransfer,
		context: vscode.DocumentPasteEditContext,
		token: vscode.CancellationToken,
	): Promise<vscode.DocumentPasteEdit[] | undefined> {
		const edit = await this._createEdit(document, ranges, dataTransfer, {
			insert: this._getEnabled(document, 'editor.paste.enabled'),
			copyIntoWorkspace: vscode.workspace.getConfiguration('markdown', document).get<CopyFilesSettings>('editor.paste.copyIntoWorkspace', CopyFilesSettings.MediaFiles)
		}, context, token);

		if (!edit || token.isCancellationRequested) {
			return;
		}

		const pasteEdit = new vscode.DocumentPasteEdit(edit.snippet, edit.label, edit.kind);
		pasteEdit.additionalEdit = edit.additionalEdits;
		pasteEdit.yieldTo = [...this._yieldTo, ...edit.yieldTo];
		return [pasteEdit];
	}

	private _getEnabled(document: vscode.TextDocument, settingName: string): InsertMarkdownLink {
		const setting = vscode.workspace.getConfiguration('markdown', document).get<boolean | InsertMarkdownLink>(settingName, true);
		// Convert old boolean values to new enum setting
		if (setting === false) {
			return InsertMarkdownLink.Never;
		} else if (setting === true) {
			return InsertMarkdownLink.Smart;
		} else {
			return setting;
		}
	}

	private async _createEdit(
		document: vscode.TextDocument,
		ranges: readonly vscode.Range[],
		dataTransfer: vscode.DataTransfer,
		settings: Readonly<{
			insert: InsertMarkdownLink;
			copyIntoWorkspace: CopyFilesSettings;
		}>,
		context: vscode.DocumentPasteEditContext | undefined,
		token: vscode.CancellationToken,
	): Promise<DropOrPasteEdit | undefined> {
		if (settings.insert === InsertMarkdownLink.Never) {
			return;
		}

		let edit = await this._createEditForMediaFiles(document, dataTransfer, settings.copyIntoWorkspace, token);
		if (token.isCancellationRequested) {
			return;
		}

		if (!edit) {
			edit = await this._createEditFromUriListData(document, ranges, dataTransfer, context, token);
		}

		if (!edit || token.isCancellationRequested) {
			return;
		}

		if (!(await shouldInsertMarkdownLinkByDefault(this._parser, document, settings.insert, ranges, token))) {
			edit.yieldTo.push(vscode.DocumentDropOrPasteEditKind.Empty.append('uri'));
		}

		return edit;
	}

	private async _createEditFromUriListData(
		document: vscode.TextDocument,
		ranges: readonly vscode.Range[],
		dataTransfer: vscode.DataTransfer,
		context: vscode.DocumentPasteEditContext | undefined,
		token: vscode.CancellationToken,
	): Promise<DropOrPasteEdit | undefined> {
		const uriListData = await dataTransfer.get(Mime.textUriList)?.asString();
		if (!uriListData || token.isCancellationRequested) {
			return;
		}

		const uriList = UriList.from(uriListData);
		if (!uriList.entries.length) {
			return;
		}

		// In some browsers, copying from the address bar sets both text/uri-list and text/plain.
		// Disable ourselves if there's also a text entry with the same http(s) uri as our list,
		// unless we are explicitly requested.
		if (
			uriList.entries.length === 1
			&& (uriList.entries[0].uri.scheme === Schemes.http || uriList.entries[0].uri.scheme === Schemes.https)
			&& !context?.only?.contains(baseLinkEditKind)
		) {
			const text = await dataTransfer.get(Mime.textPlain)?.asString();
			if (token.isCancellationRequested) {
				return;
			}

			if (text && textMatchesUriList(text, uriList)) {
				return;
			}
		}

		const edit = createInsertUriListEdit(document, ranges, uriList, { linkKindHint: context?.only });
		if (!edit) {
			return;
		}

		const additionalEdits = new vscode.WorkspaceEdit();
		additionalEdits.set(document.uri, edit.edits);

		return {
			label: edit.label,
			kind: edit.kind,
			snippet: new vscode.SnippetString(''),
			additionalEdits,
			yieldTo: []
		};
	}

	/**
	 * Create a new edit for media files in a data transfer.
	 *
	 * This tries copying files outside of the workspace into the workspace.
	 */
	private async _createEditForMediaFiles(
		document: vscode.TextDocument,
		dataTransfer: vscode.DataTransfer,
		copyIntoWorkspace: CopyFilesSettings,
		token: vscode.CancellationToken,
	): Promise<DropOrPasteEdit | undefined> {
		if (copyIntoWorkspace !== CopyFilesSettings.MediaFiles || getParentDocumentUri(document.uri).scheme === Schemes.untitled) {
			return;
		}

		interface FileEntry {
			readonly uri: vscode.Uri;
			readonly kind: MediaKind;
			readonly newFile?: { readonly contents: vscode.DataTransferFile; readonly overwrite: boolean };
		}

		const pathGenerator = new NewFilePathGenerator();
		const fileEntries = coalesce(await Promise.all(Array.from(dataTransfer, async ([mime, item]): Promise<FileEntry | undefined> => {
			const mediaKind = getMediaKindForMime(mime);
			if (!mediaKind) {
				return;
			}

			const file = item?.asFile();
			if (!file) {
				return;
			}

			if (file.uri) {
				// If the file is already in a workspace, we don't want to create a copy of it
				const workspaceFolder = vscode.workspace.getWorkspaceFolder(file.uri);
				if (workspaceFolder) {
					return { uri: file.uri, kind: mediaKind };
				}
			}

			const newFile = await pathGenerator.getNewFilePath(document, file, token);
			if (!newFile) {
				return;
			}
			return { uri: newFile.uri, kind: mediaKind, newFile: { contents: file, overwrite: newFile.overwrite } };
		})));
		if (!fileEntries.length) {
			return;
		}

		const snippet = createUriListSnippet(document.uri, fileEntries);
		if (!snippet) {
			return;
		}

		const additionalEdits = new vscode.WorkspaceEdit();
		for (const entry of fileEntries) {
			if (entry.newFile) {
				additionalEdits.createFile(entry.uri, {
					contents: entry.newFile.contents,
					overwrite: entry.newFile.overwrite,
				});
			}
		}

		const { label, kind } = getSnippetLabelAndKind(snippet);
		return {
			snippet: snippet.snippet,
			label,
			kind,
			additionalEdits,
			yieldTo: [],
		};
	}
}

function textMatchesUriList(text: string, uriList: UriList): boolean {
	if (text === uriList.entries[0].str) {
		return true;
	}

	try {
		const uri = vscode.Uri.parse(text);
		return uriList.entries.some(entry => entry.uri.toString() === uri.toString());
	} catch {
		return false;
	}
}

export function registerResourceDropOrPasteSupport(selector: vscode.DocumentSelector, parser: IMdParser): vscode.Disposable {
	const providedEditKinds = [
		baseLinkEditKind,
		linkEditKind,
		imageEditKind,
		audioEditKind,
		videoEditKind,
	];

	return vscode.Disposable.from(
		vscode.languages.registerDocumentPasteEditProvider(selector, new ResourcePasteOrDropProvider(parser), {
			providedPasteEditKinds: providedEditKinds,
			pasteMimeTypes: ResourcePasteOrDropProvider.mimeTypes,
		}),
		vscode.languages.registerDocumentDropEditProvider(selector, new ResourcePasteOrDropProvider(parser), {
			providedDropEditKinds: providedEditKinds,
			dropMimeTypes: ResourcePasteOrDropProvider.mimeTypes,
		}),
	);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/languageFeatures/copyFiles/newFilePathGenerator.ts]---
Location: vscode-main/extensions/markdown-language-features/src/languageFeatures/copyFiles/newFilePathGenerator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as picomatch from 'picomatch';
import * as vscode from 'vscode';
import { Utils } from 'vscode-uri';
import { getParentDocumentUri } from '../../util/document';
import { CopyFileConfiguration, getCopyFileConfiguration, parseGlob, resolveCopyDestination } from './copyFiles';


export class NewFilePathGenerator {

	private readonly _usedPaths = new Set<string>();

	async getNewFilePath(
		document: vscode.TextDocument,
		file: vscode.DataTransferFile,
		token: vscode.CancellationToken
	): Promise<{ readonly uri: vscode.Uri; readonly overwrite: boolean } | undefined> {
		const config = getCopyFileConfiguration(document);
		const desiredPath = getDesiredNewFilePath(config, document, file);

		const root = Utils.dirname(desiredPath);
		const ext = Utils.extname(desiredPath);
		let baseName = Utils.basename(desiredPath);
		baseName = baseName.slice(0, baseName.length - ext.length);
		for (let i = 0; ; ++i) {
			if (token.isCancellationRequested) {
				return undefined;
			}

			const name = i === 0 ? baseName : `${baseName}-${i}`;
			const uri = vscode.Uri.joinPath(root, name + ext);
			if (this._wasPathAlreadyUsed(uri)) {
				continue;
			}

			// Try overwriting if it already exists
			if (config.overwriteBehavior === 'overwrite') {
				this._usedPaths.add(uri.toString());
				return { uri, overwrite: true };
			}

			// Otherwise we need to check the fs to see if it exists
			try {
				await vscode.workspace.fs.stat(uri);
			} catch {
				if (!this._wasPathAlreadyUsed(uri)) {
					// Does not exist
					this._usedPaths.add(uri.toString());
					return { uri, overwrite: false };
				}
			}
		}
	}

	private _wasPathAlreadyUsed(uri: vscode.Uri) {
		return this._usedPaths.has(uri.toString());
	}
}

export function getDesiredNewFilePath(config: CopyFileConfiguration, document: vscode.TextDocument, file: vscode.DataTransferFile): vscode.Uri {
	const docUri = getParentDocumentUri(document.uri);
	for (const [rawGlob, rawDest] of Object.entries(config.destination)) {
		for (const glob of parseGlob(rawGlob)) {
			if (picomatch.isMatch(docUri.path, glob, { dot: true })) {
				return resolveCopyDestination(docUri, file.name, rawDest, uri => vscode.workspace.getWorkspaceFolder(uri)?.uri);
			}
		}
	}

	// Default to next to current file
	return vscode.Uri.joinPath(Utils.dirname(docUri), file.name);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/languageFeatures/copyFiles/pasteUrlProvider.ts]---
Location: vscode-main/extensions/markdown-language-features/src/languageFeatures/copyFiles/pasteUrlProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { IMdParser } from '../../markdownEngine';
import { Mime } from '../../util/mimes';
import { UriList } from '../../util/uriList';
import { createInsertUriListEdit, linkEditKind } from './shared';
import { InsertMarkdownLink, findValidUriInText, shouldInsertMarkdownLinkByDefault } from './smartDropOrPaste';

/**
 * Adds support for pasting text uris to create markdown links.
 *
 * This only applies to `text/plain`. Other mimes like `text/uri-list` are handled by ResourcePasteOrDropProvider.
 */
class PasteUrlEditProvider implements vscode.DocumentPasteEditProvider {

	public static readonly kind = linkEditKind;

	public static readonly pasteMimeTypes = [Mime.textPlain];

	constructor(
		private readonly _parser: IMdParser,
	) { }

	async provideDocumentPasteEdits(
		document: vscode.TextDocument,
		ranges: readonly vscode.Range[],
		dataTransfer: vscode.DataTransfer,
		context: vscode.DocumentPasteEditContext,
		token: vscode.CancellationToken,
	): Promise<vscode.DocumentPasteEdit[] | undefined> {
		const pasteUrlSetting = vscode.workspace.getConfiguration('markdown', document)
			.get<InsertMarkdownLink>('editor.pasteUrlAsFormattedLink.enabled', InsertMarkdownLink.SmartWithSelection);
		if (pasteUrlSetting === InsertMarkdownLink.Never) {
			return;
		}

		const item = dataTransfer.get(Mime.textPlain);
		const text = await item?.asString();
		if (token.isCancellationRequested || !text) {
			return;
		}

		// TODO: If the user has explicitly requested to paste as a markdown link,
		// try to paste even if we don't have a valid uri
		const uriText = findValidUriInText(text);
		if (!uriText) {
			return;
		}

		const edit = createInsertUriListEdit(document, ranges, UriList.from(uriText), {
			linkKindHint: context.only,
			preserveAbsoluteUris: true
		});
		if (!edit) {
			return;
		}

		const pasteEdit = new vscode.DocumentPasteEdit('', edit.label, PasteUrlEditProvider.kind);
		const workspaceEdit = new vscode.WorkspaceEdit();
		workspaceEdit.set(document.uri, edit.edits);
		pasteEdit.additionalEdit = workspaceEdit;

		if (!(await shouldInsertMarkdownLinkByDefault(this._parser, document, pasteUrlSetting, ranges, token))) {
			pasteEdit.yieldTo = [
				vscode.DocumentDropOrPasteEditKind.Text,
				vscode.DocumentDropOrPasteEditKind.Empty.append('uri')
			];
		}

		return [pasteEdit];
	}
}

export function registerPasteUrlSupport(selector: vscode.DocumentSelector, parser: IMdParser) {
	return vscode.languages.registerDocumentPasteEditProvider(selector, new PasteUrlEditProvider(parser), {
		providedPasteEditKinds: [PasteUrlEditProvider.kind],
		pasteMimeTypes: PasteUrlEditProvider.pasteMimeTypes,
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/languageFeatures/copyFiles/shared.ts]---
Location: vscode-main/extensions/markdown-language-features/src/languageFeatures/copyFiles/shared.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as vscode from 'vscode';
import * as URI from 'vscode-uri';
import { ITextDocument } from '../../types/textDocument';
import { getDocumentDir } from '../../util/document';
import { Schemes } from '../../util/schemes';
import { UriList } from '../../util/uriList';
import { resolveSnippet } from './snippets';
import { mediaFileExtensions, MediaKind } from '../../util/mimes';

/** Base kind for any sort of markdown link, including both path and media links */
export const baseLinkEditKind = vscode.DocumentDropOrPasteEditKind.Empty.append('markdown', 'link');

/** Kind for normal markdown links, i.e. `[text](path/to/file.md)` */
export const linkEditKind = baseLinkEditKind.append('uri');

export const imageEditKind = baseLinkEditKind.append('image');
export const audioEditKind = baseLinkEditKind.append('audio');
export const videoEditKind = baseLinkEditKind.append('video');

export function getSnippetLabelAndKind(counter: { readonly insertedAudioCount: number; readonly insertedVideoCount: number; readonly insertedImageCount: number; readonly insertedLinkCount: number }): {
	label: string;
	kind: vscode.DocumentDropOrPasteEditKind;
} {
	if (counter.insertedVideoCount > 0 || counter.insertedAudioCount > 0) {
		// Any media plus links
		if (counter.insertedLinkCount > 0) {
			return {
				label: vscode.l10n.t('Insert Markdown Media and Links'),
				kind: baseLinkEditKind,
			};
		}

		// Any media plus images
		if (counter.insertedImageCount > 0) {
			return {
				label: vscode.l10n.t('Insert Markdown Media and Images'),
				kind: baseLinkEditKind,
			};
		}

		// Audio only
		if (counter.insertedAudioCount > 0 && !counter.insertedVideoCount) {
			return {
				label: vscode.l10n.t('Insert Markdown Audio'),
				kind: audioEditKind,
			};
		}

		// Video only
		if (counter.insertedVideoCount > 0 && !counter.insertedAudioCount) {
			return {
				label: vscode.l10n.t('Insert Markdown Video'),
				kind: videoEditKind,
			};
		}

		// Mix of audio and video
		return {
			label: vscode.l10n.t('Insert Markdown Media'),
			kind: baseLinkEditKind,
		};
	} else if (counter.insertedImageCount > 0) {
		// Mix of images and links
		if (counter.insertedLinkCount > 0) {
			return {
				label: vscode.l10n.t('Insert Markdown Images and Links'),
				kind: baseLinkEditKind,
			};
		}

		// Just images
		return {
			label: counter.insertedImageCount > 1
				? vscode.l10n.t('Insert Markdown Images')
				: vscode.l10n.t('Insert Markdown Image'),
			kind: imageEditKind,
		};
	} else {
		return {
			label: counter.insertedLinkCount > 1
				? vscode.l10n.t('Insert Markdown Links')
				: vscode.l10n.t('Insert Markdown Link'),
			kind: linkEditKind,
		};
	}
}

export function createInsertUriListEdit(
	document: ITextDocument,
	ranges: readonly vscode.Range[],
	urlList: UriList,
	options?: UriListSnippetOptions,
): { edits: vscode.SnippetTextEdit[]; label: string; kind: vscode.DocumentDropOrPasteEditKind } | undefined {
	if (!ranges.length || !urlList.entries.length) {
		return;
	}

	const edits: vscode.SnippetTextEdit[] = [];

	let insertedLinkCount = 0;
	let insertedImageCount = 0;
	let insertedAudioCount = 0;
	let insertedVideoCount = 0;

	// Use 1 for all empty ranges but give non-empty range unique indices starting after 1
	let placeHolderStartIndex = 1 + urlList.entries.length;

	// Sort ranges by start position
	const orderedRanges = [...ranges].sort((a, b) => a.start.compareTo(b.start));
	const allRangesAreEmpty = orderedRanges.every(range => range.isEmpty);

	for (const range of orderedRanges) {
		const snippet = createUriListSnippet(document.uri, urlList.entries, {
			placeholderText: range.isEmpty ? undefined : document.getText(range),
			placeholderStartIndex: allRangesAreEmpty ? 1 : placeHolderStartIndex,
			...options,
		});
		if (!snippet) {
			continue;
		}

		insertedLinkCount += snippet.insertedLinkCount;
		insertedImageCount += snippet.insertedImageCount;
		insertedAudioCount += snippet.insertedAudioCount;
		insertedVideoCount += snippet.insertedVideoCount;

		placeHolderStartIndex += urlList.entries.length;

		edits.push(new vscode.SnippetTextEdit(range, snippet.snippet));
	}

	const { label, kind } = getSnippetLabelAndKind({ insertedAudioCount, insertedVideoCount, insertedImageCount, insertedLinkCount });
	return { edits, label, kind };
}

interface UriListSnippetOptions {
	readonly placeholderText?: string;

	readonly placeholderStartIndex?: number;

	/**
	 * Hints how links should be inserted, e.g. as normal markdown link or as an image.
	 *
	 * By default this is inferred from the uri. If you use `media`, we will insert the resource as an image, video, or audio.
	 */
	readonly linkKindHint?: vscode.DocumentDropOrPasteEditKind | 'media';

	readonly separator?: string;

	/**
	 * Prevents uris from being made relative to the document.
	 *
	 * This is mostly useful for `file:` uris.
	 */
	readonly preserveAbsoluteUris?: boolean;
}


export interface UriSnippet {
	readonly snippet: vscode.SnippetString;
	readonly insertedLinkCount: number;
	readonly insertedImageCount: number;
	readonly insertedVideoCount: number;
	readonly insertedAudioCount: number;
}

export function createUriListSnippet(
	document: vscode.Uri,
	uris: ReadonlyArray<{
		readonly uri: vscode.Uri;
		readonly str?: string;
		readonly kind?: MediaKind;
	}>,
	options?: UriListSnippetOptions,
): UriSnippet | undefined {
	if (!uris.length) {
		return;
	}

	const documentDir = getDocumentDir(document);
	const config = vscode.workspace.getConfiguration('markdown', document);
	const title = options?.placeholderText || 'Title';

	let insertedLinkCount = 0;
	let insertedImageCount = 0;
	let insertedAudioCount = 0;
	let insertedVideoCount = 0;

	const snippet = new vscode.SnippetString();
	let placeholderIndex = options?.placeholderStartIndex ?? 1;

	uris.forEach((uri, i) => {
		const mdPath = (!options?.preserveAbsoluteUris ? getRelativeMdPath(documentDir, uri.uri) : undefined) ?? uri.str ?? uri.uri.toString();

		const desiredKind = getDesiredLinkKind(uri.uri, uri.kind, options);

		if (desiredKind === DesiredLinkKind.Link) {
			insertedLinkCount++;
			snippet.appendText('[');
			snippet.appendPlaceholder(escapeBrackets(options?.placeholderText ?? 'text'), placeholderIndex);
			snippet.appendText(`](${escapeMarkdownLinkPath(mdPath)})`);
		} else {
			const insertAsVideo = desiredKind === DesiredLinkKind.Video;
			const insertAsAudio = desiredKind === DesiredLinkKind.Audio;
			if (insertAsVideo || insertAsAudio) {
				if (insertAsVideo) {
					insertedVideoCount++;
				} else {
					insertedAudioCount++;
				}
				const mediaSnippet = insertAsVideo
					? config.get<string>('editor.filePaste.videoSnippet', '<video controls src="${src}" title="${title}"></video>')
					: config.get<string>('editor.filePaste.audioSnippet', '<audio controls src="${src}" title="${title}"></audio>');
				snippet.value += resolveSnippet(mediaSnippet, new Map<string, string>([
					['src', mdPath],
					['title', `\${${placeholderIndex++}:${title}}`],
				]));
			} else {
				insertedImageCount++;
				snippet.appendText('![');
				const placeholderText = escapeBrackets(options?.placeholderText || 'alt text');
				snippet.appendPlaceholder(placeholderText, placeholderIndex);
				snippet.appendText(`](${escapeMarkdownLinkPath(mdPath)})`);
			}
		}

		if (i < uris.length - 1 && uris.length > 1) {
			snippet.appendText(options?.separator ?? ' ');
		}
	});

	return { snippet, insertedAudioCount, insertedVideoCount, insertedImageCount, insertedLinkCount };
}

enum DesiredLinkKind {
	Link,
	Image,
	Video,
	Audio,
}

function getDesiredLinkKind(uri: vscode.Uri, uriFileKind: MediaKind | undefined, options: UriListSnippetOptions | undefined): DesiredLinkKind {
	if (options?.linkKindHint instanceof vscode.DocumentDropOrPasteEditKind) {
		if (linkEditKind.contains(options.linkKindHint)) {
			return DesiredLinkKind.Link;
		} else if (imageEditKind.contains(options.linkKindHint)) {
			return DesiredLinkKind.Image;
		} else if (audioEditKind.contains(options.linkKindHint)) {
			return DesiredLinkKind.Audio;
		} else if (videoEditKind.contains(options.linkKindHint)) {
			return DesiredLinkKind.Video;
		}
	}

	if (typeof uriFileKind !== 'undefined') {
		switch (uriFileKind) {
			case MediaKind.Video: return DesiredLinkKind.Video;
			case MediaKind.Audio: return DesiredLinkKind.Audio;
			case MediaKind.Image: return DesiredLinkKind.Image;
		}
	}

	const normalizedExt = URI.Utils.extname(uri).toLowerCase().replace('.', '');
	if (options?.linkKindHint === 'media' || mediaFileExtensions.has(normalizedExt)) {
		switch (mediaFileExtensions.get(normalizedExt)) {
			case MediaKind.Video: return DesiredLinkKind.Video;
			case MediaKind.Audio: return DesiredLinkKind.Audio;
			default: return DesiredLinkKind.Image;
		}
	}

	return DesiredLinkKind.Link;
}

function getRelativeMdPath(dir: vscode.Uri | undefined, file: vscode.Uri): string | undefined {
	if (dir && dir.scheme === file.scheme && dir.authority === file.authority) {
		if (file.scheme === Schemes.file) {
			// On windows, we must use the native `path.relative` to generate the relative path
			// so that drive-letters are resolved cast insensitively. However we then want to
			// convert back to a posix path to insert in to the document.
			const relativePath = path.relative(dir.fsPath, file.fsPath);
			return path.posix.normalize(relativePath.split(path.sep).join(path.posix.sep));
		}

		return path.posix.relative(dir.path, file.path);
	}
	return undefined;
}

function escapeMarkdownLinkPath(mdPath: string): string {
	if (needsBracketLink(mdPath)) {
		return '<' + mdPath.replaceAll('<', '\\<').replaceAll('>', '\\>') + '>';
	}

	return mdPath;
}

function escapeBrackets(value: string): string {
	value = value.replace(/[\[\]]/g, '\\$&'); // CodeQL [SM02383] The Markdown is fully sanitized after being rendered.
	return value;
}

function needsBracketLink(mdPath: string): boolean {
	// Links with whitespace or control characters must be enclosed in brackets
	if (mdPath.startsWith('<') || /\s|[\u007F\u0000-\u001f]/.test(mdPath)) {
		return true;
	}

	// Check if the link has mis-matched parens
	if (!/[\(\)]/.test(mdPath)) {
		return false;
	}

	let previousChar = '';
	let nestingCount = 0;
	for (const char of mdPath) {
		if (char === '(' && previousChar !== '\\') {
			nestingCount++;
		} else if (char === ')' && previousChar !== '\\') {
			nestingCount--;
		}

		if (nestingCount < 0) {
			return true;
		}
		previousChar = char;
	}

	return nestingCount > 0;
}

export interface DropOrPasteEdit {
	readonly snippet: vscode.SnippetString;
	readonly kind: vscode.DocumentDropOrPasteEditKind;
	readonly label: string;
	readonly additionalEdits: vscode.WorkspaceEdit;
	readonly yieldTo: vscode.DocumentDropOrPasteEditKind[];
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/languageFeatures/copyFiles/smartDropOrPaste.ts]---
Location: vscode-main/extensions/markdown-language-features/src/languageFeatures/copyFiles/smartDropOrPaste.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { IMdParser } from '../../markdownEngine';
import { ITextDocument } from '../../types/textDocument';
import { Schemes } from '../../util/schemes';

const smartPasteLineRegexes = [
	{ regex: /(\[[^\[\]]*](?:\([^\(\)]*\)|\[[^\[\]]*]))/g }, // In a Markdown link
	{ regex: /\$\$[\s\S]*?\$\$/gm }, // In a fenced math block
	{ regex: /`[^`]*`/g }, // In inline code
	{ regex: /\$[^$]*\$/g }, // In inline math
	{ regex: /<[^<>\s]*>/g }, // Autolink
	{ regex: /^[ ]{0,3}\[\w+\]:\s.*$/g, isWholeLine: true }, // Block link definition (needed as tokens are not generated for these)
];

export async function shouldInsertMarkdownLinkByDefault(
	parser: IMdParser,
	document: ITextDocument,
	pasteUrlSetting: InsertMarkdownLink,
	ranges: readonly vscode.Range[],
	token: vscode.CancellationToken
): Promise<boolean> {
	switch (pasteUrlSetting) {
		case InsertMarkdownLink.Always: {
			return true;
		}
		case InsertMarkdownLink.Smart: {
			return checkSmart();
		}
		case InsertMarkdownLink.SmartWithSelection: {
			// At least one range must not be empty
			if (!ranges.some(range => document.getText(range).trim().length > 0)) {
				return false;
			}
			// And all ranges must be smart
			return checkSmart();
		}
		default: {
			return false;
		}
	}

	async function checkSmart(): Promise<boolean> {
		return (await Promise.all(ranges.map(range => shouldSmartPasteForSelection(parser, document, range, token)))).every(x => x);
	}
}

const textTokenTypes = new Set([
	'paragraph_open',
	'inline',
	'heading_open',
	'ordered_list_open',
	'bullet_list_open',
	'list_item_open',
	'blockquote_open',
]);

async function shouldSmartPasteForSelection(
	parser: IMdParser,
	document: ITextDocument,
	selectedRange: vscode.Range,
	token: vscode.CancellationToken
): Promise<boolean> {
	// Disable for multi-line selections
	if (selectedRange.start.line !== selectedRange.end.line) {
		return false;
	}

	const rangeText = document.getText(selectedRange);
	// Disable when the selection is already a link
	if (findValidUriInText(rangeText)) {
		return false;
	}

	if (/\[.*\]\(.*\)/.test(rangeText) || /!\[.*\]\(.*\)/.test(rangeText)) {
		return false;
	}

	// Check if selection is inside a special block level element using markdown engine
	const tokens = await parser.tokenize(document);
	if (token.isCancellationRequested) {
		return false;
	}

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (!token.map) {
			continue;
		}
		if (token.map[0] <= selectedRange.start.line && token.map[1] > selectedRange.start.line) {
			if (!textTokenTypes.has(token.type)) {
				return false;
			}
		}

		// Special case for html such as:
		//
		// <b>
		// |
		// </b>
		//
		// In this case pasting will cause the html block to be created even though the cursor is not currently inside a block
		if (token.type === 'html_block' && token.map[1] === selectedRange.start.line) {
			const nextToken = tokens.at(i + 1);
			// The next token does not need to be a html_block, but it must be on the next line
			if (nextToken?.map?.[0] === selectedRange.end.line + 1) {
				return false;
			}
		}
	}

	// Run additional regex checks on the current line to check if we are inside an inline element
	const line = document.getText(new vscode.Range(selectedRange.start.line, 0, selectedRange.start.line, Number.MAX_SAFE_INTEGER));
	for (const regex of smartPasteLineRegexes) {
		for (const match of line.matchAll(regex.regex)) {
			if (match.index === undefined) {
				continue;
			}

			if (regex.isWholeLine) {
				return false;
			}

			if (selectedRange.start.character > match.index && selectedRange.start.character < match.index + match[0].length) {
				return false;
			}
		}
	}

	return true;
}

const externalUriSchemes: ReadonlySet<string> = new Set([
	Schemes.http,
	Schemes.https,
	Schemes.mailto,
	Schemes.file,
]);

export function findValidUriInText(text: string): string | undefined {
	const trimmedUrlList = text.trim();

	if (!/^\S+$/.test(trimmedUrlList) // Uri must consist of a single sequence of characters without spaces
		|| !trimmedUrlList.includes(':') // And it must have colon somewhere for the scheme. We will verify the schema again later
	) {
		return;
	}

	let uri: vscode.Uri;
	try {
		uri = vscode.Uri.parse(trimmedUrlList);
	} catch {
		// Could not parse
		return;
	}

	// `Uri.parse` is lenient and will return a `file:` uri even for non-uri text such as `abc`
	// Make sure that the resolved scheme starts the original text
	if (!trimmedUrlList.toLowerCase().startsWith(uri.scheme.toLowerCase() + ':')) {
		return;
	}

	// Only enable for an allow list of schemes. Otherwise this can be accidentally activated for non-uri text
	// such as `c:\abc` or `value:foo`
	if (!externalUriSchemes.has(uri.scheme.toLowerCase())) {
		return;
	}

	// Some part of the uri must not be empty
	// This disables the feature for text such as `http:`
	if (!uri.authority && uri.path.length < 2 && !uri.query && !uri.fragment) {
		return;
	}

	return trimmedUrlList;
}

export enum InsertMarkdownLink {
	Always = 'always',
	SmartWithSelection = 'smartWithSelection',
	Smart = 'smart',
	Never = 'never'
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/languageFeatures/copyFiles/snippets.ts]---
Location: vscode-main/extensions/markdown-language-features/src/languageFeatures/copyFiles/snippets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Resolves variables in a VS Code snippet style string
 */
export function resolveSnippet(snippetString: string, vars: ReadonlyMap<string, string>): string {
	return snippetString.replaceAll(/(?<escape>\\\$)|(?<!\\)\$\{(?<name>\w+)(?:\/(?<pattern>(?:\\\/|[^\}])+?)\/(?<replacement>(?:\\\/|[^\}])+?)\/)?\}/g, (match, _escape, name, pattern, replacement, _offset, _str, groups) => {
		if (groups?.['escape']) {
			return '$';
		}

		const entry = vars.get(name);
		if (typeof entry !== 'string') {
			return match;
		}

		if (pattern && replacement) {
			return entry.replace(new RegExp(replaceTransformEscapes(pattern)), replaceTransformEscapes(replacement));
		}

		return entry;
	});
}


function replaceTransformEscapes(str: string): string {
	return str.replaceAll(/\\\//g, '/');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/preview/documentRenderer.ts]---
Location: vscode-main/extensions/markdown-language-features/src/preview/documentRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as uri from 'vscode-uri';
import { ILogger } from '../logging';
import { MarkdownItEngine } from '../markdownEngine';
import { MarkdownContributionProvider } from '../markdownExtensions';
import { escapeAttribute } from '../util/dom';
import { WebviewResourceProvider } from '../util/resources';
import { generateUuid } from '../util/uuid';
import { MarkdownPreviewConfiguration, MarkdownPreviewConfigurationManager } from './previewConfig';
import { ContentSecurityPolicyArbiter, MarkdownPreviewSecurityLevel } from './security';


/**
 * Strings used inside the markdown preview.
 *
 * Stored here and then injected in the preview so that they
 * can be localized using our normal localization process.
 */
const previewStrings = {
	cspAlertMessageText: vscode.l10n.t("Some content has been disabled in this document"),

	cspAlertMessageTitle: vscode.l10n.t("Potentially unsafe or insecure content has been disabled in the Markdown preview. Change the Markdown preview security setting to allow insecure content or enable scripts"),

	cspAlertMessageLabel: vscode.l10n.t("Content Disabled Security Warning")
};

export interface MarkdownContentProviderOutput {
	html: string;
	containingImages: Set<string>;
}

export interface ImageInfo {
	readonly id: string;
	readonly width: number;
	readonly height: number;
}

export class MdDocumentRenderer {
	constructor(
		private readonly _engine: MarkdownItEngine,
		private readonly _context: vscode.ExtensionContext,
		private readonly _cspArbiter: ContentSecurityPolicyArbiter,
		private readonly _contributionProvider: MarkdownContributionProvider,
		private readonly _logger: ILogger
	) {
		this.iconPath = {
			dark: vscode.Uri.joinPath(this._context.extensionUri, 'media', 'preview-dark.svg'),
			light: vscode.Uri.joinPath(this._context.extensionUri, 'media', 'preview-light.svg'),
		};
	}

	public readonly iconPath: { light: vscode.Uri; dark: vscode.Uri };

	public async renderDocument(
		markdownDocument: vscode.TextDocument,
		resourceProvider: WebviewResourceProvider,
		previewConfigurations: MarkdownPreviewConfigurationManager,
		initialLine: number | undefined,
		selectedLine: number | undefined,
		state: any | undefined,
		imageInfo: readonly ImageInfo[],
		token: vscode.CancellationToken
	): Promise<MarkdownContentProviderOutput> {
		const sourceUri = markdownDocument.uri;
		const config = previewConfigurations.loadAndCacheConfiguration(sourceUri);
		const initialData = {
			source: sourceUri.toString(),
			fragment: state?.fragment || markdownDocument.uri.fragment || undefined,
			line: initialLine,
			selectedLine,
			scrollPreviewWithEditor: config.scrollPreviewWithEditor,
			scrollEditorWithPreview: config.scrollEditorWithPreview,
			doubleClickToSwitchToEditor: config.doubleClickToSwitchToEditor,
			disableSecurityWarnings: this._cspArbiter.shouldDisableSecurityWarnings(),
			webviewResourceRoot: resourceProvider.asWebviewUri(markdownDocument.uri).toString(),
		};

		this._logger.trace('DocumentRenderer', `provideTextDocumentContent - ${markdownDocument.uri}`, initialData);

		// Content Security Policy
		const nonce = generateUuid();
		const csp = this._getCsp(resourceProvider, sourceUri, nonce);

		const body = await this.renderBody(markdownDocument, resourceProvider);
		if (token.isCancellationRequested) {
			return { html: '', containingImages: new Set() };
		}

		const html = `<!DOCTYPE html>
			<html style="${escapeAttribute(this._getSettingsOverrideStyles(config))}">
			<head>
				<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
				<meta http-equiv="Content-Security-Policy" content="${escapeAttribute(csp)}">
				<meta id="vscode-markdown-preview-data"
					data-settings="${escapeAttribute(JSON.stringify(initialData))}"
					data-strings="${escapeAttribute(JSON.stringify(previewStrings))}"
					data-state="${escapeAttribute(JSON.stringify(state || {}))}"
					data-initial-md-content="${escapeAttribute(body.html)}">
				<script src="${this._extensionResourcePath(resourceProvider, 'pre.js')}" nonce="${nonce}"></script>
				${this._getStyles(resourceProvider, sourceUri, config, imageInfo)}
				<base href="${resourceProvider.asWebviewUri(markdownDocument.uri)}">
			</head>
			<body class="vscode-body ${config.scrollBeyondLastLine ? 'scrollBeyondLastLine' : ''} ${config.wordWrap ? 'wordWrap' : ''} ${config.markEditorSelection ? 'showEditorSelection' : ''}">
				${this._getScripts(resourceProvider, nonce)}
			</body>
			</html>`;
		return {
			html,
			containingImages: body.containingImages,
		};
	}

	public async renderBody(
		markdownDocument: vscode.TextDocument,
		resourceProvider: WebviewResourceProvider,
	): Promise<MarkdownContentProviderOutput> {
		const rendered = await this._engine.render(markdownDocument, resourceProvider);
		const html = `<div class="markdown-body" dir="auto">${rendered.html}<div class="code-line" data-line="${markdownDocument.lineCount}"></div></div>`;
		return {
			html,
			containingImages: rendered.containingImages
		};
	}

	public renderFileNotFoundDocument(resource: vscode.Uri): string {
		const resourcePath = uri.Utils.basename(resource);
		const body = vscode.l10n.t('{0} cannot be found', resourcePath);
		return `<!DOCTYPE html>
			<html>
			<body class="vscode-body">
				${body}
			</body>
			</html>`;
	}

	private _extensionResourcePath(resourceProvider: WebviewResourceProvider, mediaFile: string): string {
		const webviewResource = resourceProvider.asWebviewUri(
			vscode.Uri.joinPath(this._context.extensionUri, 'media', mediaFile));
		return webviewResource.toString();
	}

	private _fixHref(resourceProvider: WebviewResourceProvider, resource: vscode.Uri, href: string): string {
		if (!href) {
			return href;
		}

		if (href.startsWith('http:') || href.startsWith('https:') || href.startsWith('file:')) {
			return href;
		}

		// Assume it must be a local file
		if (href.startsWith('/') || /^[a-z]:\\/i.test(href)) {
			return resourceProvider.asWebviewUri(vscode.Uri.file(href)).toString();
		}

		// Use a workspace relative path if there is a workspace
		const root = vscode.workspace.getWorkspaceFolder(resource);
		if (root) {
			return resourceProvider.asWebviewUri(vscode.Uri.joinPath(root.uri, href)).toString();
		}

		// Otherwise look relative to the markdown file
		return resourceProvider.asWebviewUri(vscode.Uri.joinPath(uri.Utils.dirname(resource), href)).toString();
	}

	private _computeCustomStyleSheetIncludes(resourceProvider: WebviewResourceProvider, resource: vscode.Uri, config: MarkdownPreviewConfiguration): string {
		if (!Array.isArray(config.styles)) {
			return '';
		}
		const out: string[] = [];
		for (const style of config.styles) {
			out.push(`<link rel="stylesheet" class="code-user-style" data-source="${escapeAttribute(style)}" href="${escapeAttribute(this._fixHref(resourceProvider, resource, style))}" type="text/css" media="screen">`);
		}
		return out.join('\n');
	}

	private _getSettingsOverrideStyles(config: MarkdownPreviewConfiguration): string {
		return [
			config.fontFamily ? `--markdown-font-family: ${config.fontFamily};` : '',
			isNaN(config.fontSize) ? '' : `--markdown-font-size: ${config.fontSize}px;`,
			isNaN(config.lineHeight) ? '' : `--markdown-line-height: ${config.lineHeight};`,
		].join(' ');
	}

	private _getImageStabilizerStyles(imageInfo: readonly ImageInfo[]): string {
		if (!imageInfo.length) {
			return '';
		}

		let ret = '<style>\n';
		for (const imgInfo of imageInfo) {
			ret += `#${imgInfo.id}.loading {
					height: ${imgInfo.height}px;
					width: ${imgInfo.width}px;
				}\n`;
		}
		ret += '</style>\n';

		return ret;
	}

	private _getStyles(resourceProvider: WebviewResourceProvider, resource: vscode.Uri, config: MarkdownPreviewConfiguration, imageInfo: readonly ImageInfo[]): string {
		const baseStyles: string[] = [];
		for (const resource of this._contributionProvider.contributions.previewStyles) {
			baseStyles.push(`<link rel="stylesheet" type="text/css" href="${escapeAttribute(resourceProvider.asWebviewUri(resource))}">`);
		}

		return `${baseStyles.join('\n')}
			${this._computeCustomStyleSheetIncludes(resourceProvider, resource, config)}
			${this._getImageStabilizerStyles(imageInfo)}`;
	}

	private _getScripts(resourceProvider: WebviewResourceProvider, nonce: string): string {
		const out: string[] = [];
		for (const resource of this._contributionProvider.contributions.previewScripts) {
			out.push(`<script async
				src="${escapeAttribute(resourceProvider.asWebviewUri(resource))}"
				nonce="${nonce}"
				charset="UTF-8"></script>`);
		}
		return out.join('\n');
	}

	private _getCsp(
		provider: WebviewResourceProvider,
		resource: vscode.Uri,
		nonce: string
	): string {
		const rule = provider.cspSource.split(';')[0];
		switch (this._cspArbiter.getSecurityLevelForResource(resource)) {
			case MarkdownPreviewSecurityLevel.AllowInsecureContent:
				return `default-src 'none'; img-src 'self' ${rule} http: https: data:; media-src 'self' ${rule} http: https: data:; script-src 'nonce-${nonce}'; style-src 'self' ${rule} 'unsafe-inline' http: https: data:; font-src 'self' ${rule} http: https: data:;`;

			case MarkdownPreviewSecurityLevel.AllowInsecureLocalContent:
				return `default-src 'none'; img-src 'self' ${rule} https: data: http://localhost:* http://127.0.0.1:*; media-src 'self' ${rule} https: data: http://localhost:* http://127.0.0.1:*; script-src 'nonce-${nonce}'; style-src 'self' ${rule} 'unsafe-inline' https: data: http://localhost:* http://127.0.0.1:*; font-src 'self' ${rule} https: data: http://localhost:* http://127.0.0.1:*;`;

			case MarkdownPreviewSecurityLevel.AllowScriptsAndAllContent:
				return ``;

			case MarkdownPreviewSecurityLevel.Strict:
			default:
				return `default-src 'none'; img-src 'self' ${rule} https: data:; media-src 'self' ${rule} https: data:; script-src 'nonce-${nonce}'; style-src 'self' ${rule} 'unsafe-inline' https: data:; font-src 'self' ${rule} https: data:;`;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/preview/preview.ts]---
Location: vscode-main/extensions/markdown-language-features/src/preview/preview.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as uri from 'vscode-uri';
import { ILogger } from '../logging';
import { MarkdownContributionProvider } from '../markdownExtensions';
import { Disposable } from '../util/dispose';
import { isMarkdownFile } from '../util/file';
import { MdLinkOpener } from '../util/openDocumentLink';
import { WebviewResourceProvider } from '../util/resources';
import { urlToUri } from '../util/url';
import { ImageInfo, MdDocumentRenderer } from './documentRenderer';
import { MarkdownPreviewConfigurationManager } from './previewConfig';
import { scrollEditorToLine, StartingScrollFragment, StartingScrollLine, StartingScrollLocation } from './scrolling';
import { getVisibleLine, LastScrollLocation, TopmostLineMonitor } from './topmostLineMonitor';
import type { FromWebviewMessage, ToWebviewMessage } from '../../types/previewMessaging';

export class PreviewDocumentVersion {

	public readonly resource: vscode.Uri;
	private readonly _version: number;

	public constructor(document: vscode.TextDocument) {
		this.resource = document.uri;
		this._version = document.version;
	}

	public equals(other: PreviewDocumentVersion): boolean {
		return this.resource.fsPath === other.resource.fsPath
			&& this._version === other._version;
	}
}

interface MarkdownPreviewDelegate {
	getTitle?(resource: vscode.Uri): string;
	getAdditionalState(): {};
	openPreviewLinkToMarkdownFile(markdownLink: vscode.Uri, fragment: string | undefined): void;
}

class MarkdownPreview extends Disposable implements WebviewResourceProvider {

	private static readonly _unwatchedImageSchemes = new Set(['https', 'http', 'data']);

	private _disposed: boolean = false;

	private readonly _delay = 300;
	private _throttleTimer: any;

	private readonly _resource: vscode.Uri;
	private readonly _webviewPanel: vscode.WebviewPanel;

	private _line: number | undefined;
	private readonly _scrollToFragment: string | undefined;
	private _firstUpdate = true;
	private _currentVersion?: PreviewDocumentVersion;
	private _isScrolling = false;

	private _imageInfo: readonly ImageInfo[] = [];
	private readonly _fileWatchersBySrc = new Map</* src: */ string, vscode.FileSystemWatcher>();

	private readonly _onScrollEmitter = this._register(new vscode.EventEmitter<LastScrollLocation>());
	public readonly onScroll = this._onScrollEmitter.event;

	private readonly _disposeCts = this._register(new vscode.CancellationTokenSource());

	constructor(
		webview: vscode.WebviewPanel,
		resource: vscode.Uri,
		startingScroll: StartingScrollLocation | undefined,
		private readonly _delegate: MarkdownPreviewDelegate,
		private readonly _contentProvider: MdDocumentRenderer,
		private readonly _previewConfigurations: MarkdownPreviewConfigurationManager,
		private readonly _logger: ILogger,
		private readonly _contributionProvider: MarkdownContributionProvider,
		private readonly _opener: MdLinkOpener,
	) {
		super();

		this._webviewPanel = webview;
		this._resource = resource;

		switch (startingScroll?.type) {
			case 'line':
				if (!isNaN(startingScroll.line!)) {
					this._line = startingScroll.line;
				}
				break;

			case 'fragment':
				this._scrollToFragment = startingScroll.fragment;
				break;
		}

		this._register(_contributionProvider.onContributionsChanged(() => {
			setTimeout(() => this.refresh(true), 0);
		}));

		this._register(vscode.workspace.onDidChangeTextDocument(event => {
			if (this.isPreviewOf(event.document.uri)) {
				this.refresh();
			}
		}));

		this._register(vscode.workspace.onDidOpenTextDocument(document => {
			if (this.isPreviewOf(document.uri)) {
				this.refresh();
			}
		}));

		if (vscode.workspace.fs.isWritableFileSystem(resource.scheme)) {
			const watcher = this._register(vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(resource, '*')));
			this._register(watcher.onDidChange(uri => {
				if (this.isPreviewOf(uri)) {
					// Only use the file system event when VS Code does not already know about the file
					if (!vscode.workspace.textDocuments.some(doc => doc.uri.toString() === uri.toString())) {
						this.refresh();
					}
				}
			}));
		}

		this._register(this._webviewPanel.webview.onDidReceiveMessage((e: FromWebviewMessage.Type) => {
			if (e.source !== this._resource.toString()) {
				return;
			}

			switch (e.type) {
				case 'cacheImageSizes':
					this._imageInfo = e.imageData;
					break;

				case 'revealLine':
					this._onDidScrollPreview(e.line);
					break;

				case 'didClick':
					this._onDidClickPreview(e.line);
					break;

				case 'openLink':
					this._onDidClickPreviewLink(e.href);
					break;

				case 'showPreviewSecuritySelector':
					vscode.commands.executeCommand('markdown.showPreviewSecuritySelector', e.source);
					break;

				case 'previewStyleLoadError':
					vscode.window.showWarningMessage(
						vscode.l10n.t("Could not load 'markdown.styles': {0}", e.unloadedStyles.join(', ')));
					break;
			}
		}));

		this.refresh();
	}

	override dispose() {
		this._disposeCts.cancel();

		super.dispose();

		this._disposed = true;

		clearTimeout(this._throttleTimer);
		for (const entry of this._fileWatchersBySrc.values()) {
			entry.dispose();
		}
		this._fileWatchersBySrc.clear();
	}

	public get resource(): vscode.Uri {
		return this._resource;
	}

	public get state() {
		return {
			resource: this._resource.toString(),
			line: this._line,
			fragment: this._scrollToFragment,
			...this._delegate.getAdditionalState(),
		};
	}

	/**
	 * The first call immediately refreshes the preview,
	 * calls happening shortly thereafter are debounced.
	*/
	public refresh(forceUpdate: boolean = false) {
		// Schedule update if none is pending
		if (!this._throttleTimer) {
			if (this._firstUpdate) {
				this._updatePreview(true);
			} else {
				this._throttleTimer = setTimeout(() => this._updatePreview(forceUpdate), this._delay);
			}
		}

		this._firstUpdate = false;
	}


	public isPreviewOf(resource: vscode.Uri): boolean {
		return this._resource.fsPath === resource.fsPath;
	}

	public postMessage(msg: ToWebviewMessage.Type) {
		if (!this._disposed) {
			this._webviewPanel.webview.postMessage(msg);
		}
	}

	public scrollTo(topLine: number) {
		if (this._disposed) {
			return;
		}

		if (this._isScrolling) {
			this._isScrolling = false;
			return;
		}

		this._logger.trace('MarkdownPreview', 'updateForView', { markdownFile: this._resource });
		this._line = topLine;
		this.postMessage({
			type: 'updateView',
			line: topLine,
			source: this._resource.toString()
		});
	}

	private async _updatePreview(forceUpdate?: boolean): Promise<void> {
		clearTimeout(this._throttleTimer);
		this._throttleTimer = undefined;

		if (this._disposed) {
			return;
		}

		let document: vscode.TextDocument;
		try {
			document = await vscode.workspace.openTextDocument(this._resource);
		} catch {
			if (!this._disposed) {
				await this._showFileNotFoundError();
			}
			return;
		}

		if (this._disposed) {
			return;
		}

		const pendingVersion = new PreviewDocumentVersion(document);
		if (!forceUpdate && this._currentVersion?.equals(pendingVersion)) {
			if (this._line) {
				this.scrollTo(this._line);
			}
			return;
		}

		const shouldReloadPage = forceUpdate || !this._currentVersion || this._currentVersion.resource.toString() !== pendingVersion.resource.toString() || !this._webviewPanel.visible;
		this._currentVersion = pendingVersion;

		let selectedLine: number | undefined = undefined;
		for (const editor of vscode.window.visibleTextEditors) {
			if (this.isPreviewOf(editor.document.uri)) {
				selectedLine = editor.selection.active.line;
				break;
			}
		}

		const content = await (shouldReloadPage
			? this._contentProvider.renderDocument(document, this, this._previewConfigurations, this._line, selectedLine, this.state, this._imageInfo, this._disposeCts.token)
			: this._contentProvider.renderBody(document, this));

		// Another call to `doUpdate` may have happened.
		// Make sure we are still updating for the correct document
		if (this._currentVersion?.equals(pendingVersion)) {
			this._updateWebviewContent(content.html, shouldReloadPage);
			this._updateImageWatchers(content.containingImages);
		}
	}

	private _onDidScrollPreview(line: number) {
		this._line = line;
		this._onScrollEmitter.fire({ line: this._line, uri: this._resource });
		const config = this._previewConfigurations.loadAndCacheConfiguration(this._resource);
		if (!config.scrollEditorWithPreview) {
			return;
		}

		for (const editor of vscode.window.visibleTextEditors) {
			if (!this.isPreviewOf(editor.document.uri)) {
				continue;
			}

			this._isScrolling = true;
			scrollEditorToLine(line, editor);
		}
	}

	private async _onDidClickPreview(line: number): Promise<void> {
		// fix #82457, find currently opened but unfocused source tab
		await vscode.commands.executeCommand('markdown.showSource');

		const revealLineInEditor = (editor: vscode.TextEditor) => {
			const position = new vscode.Position(line, 0);
			const newSelection = new vscode.Selection(position, position);
			editor.selection = newSelection;
			editor.revealRange(newSelection, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
		};

		for (const visibleEditor of vscode.window.visibleTextEditors) {
			if (this.isPreviewOf(visibleEditor.document.uri)) {
				const editor = await vscode.window.showTextDocument(visibleEditor.document, visibleEditor.viewColumn);
				revealLineInEditor(editor);
				return;
			}
		}

		await vscode.workspace.openTextDocument(this._resource)
			.then(vscode.window.showTextDocument)
			.then((editor) => {
				revealLineInEditor(editor);
			}, () => {
				vscode.window.showErrorMessage(vscode.l10n.t('Could not open {0}', this._resource.toString()));
			});
	}

	private async _showFileNotFoundError() {
		this._webviewPanel.webview.html = this._contentProvider.renderFileNotFoundDocument(this._resource);
	}

	private _updateWebviewContent(html: string, reloadPage: boolean): void {
		if (this._disposed) {
			return;
		}

		if (this._delegate.getTitle) {
			this._webviewPanel.title = this._delegate.getTitle(this._resource);
		}
		this._webviewPanel.webview.options = this._getWebviewOptions();

		if (reloadPage) {
			this._webviewPanel.webview.html = html;
		} else {
			this.postMessage({
				type: 'updateContent',
				content: html,
				source: this._resource.toString(),
			});
		}
	}

	private _updateImageWatchers(srcs: Set<string>) {
		// Delete stale file watchers.
		for (const [src, watcher] of this._fileWatchersBySrc) {
			if (!srcs.has(src)) {
				watcher.dispose();
				this._fileWatchersBySrc.delete(src);
			}
		}

		// Create new file watchers.
		const root = vscode.Uri.joinPath(this._resource, '../');
		for (const src of srcs) {
			const uri = urlToUri(src, root);
			if (uri && !MarkdownPreview._unwatchedImageSchemes.has(uri.scheme) && !this._fileWatchersBySrc.has(src)) {
				const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(uri, '*'));
				watcher.onDidChange(() => {
					this.refresh(true);
				});
				this._fileWatchersBySrc.set(src, watcher);
			}
		}
	}

	private _getWebviewOptions(): vscode.WebviewOptions {
		return {
			enableScripts: true,
			enableForms: false,
			localResourceRoots: this._getLocalResourceRoots()
		};
	}

	private _getLocalResourceRoots(): ReadonlyArray<vscode.Uri> {
		const baseRoots = Array.from(this._contributionProvider.contributions.previewResourceRoots);

		const folder = vscode.workspace.getWorkspaceFolder(this._resource);
		if (folder) {
			const workspaceRoots = vscode.workspace.workspaceFolders?.map(folder => folder.uri);
			if (workspaceRoots) {
				baseRoots.push(...workspaceRoots);
			}
		} else {
			baseRoots.push(uri.Utils.dirname(this._resource));
		}

		return baseRoots;
	}

	private async _onDidClickPreviewLink(href: string) {
		const config = vscode.workspace.getConfiguration('markdown', this.resource);
		const openLinks = config.get<string>('preview.openMarkdownLinks', 'inPreview');
		if (openLinks === 'inPreview') {
			const resolved = await this._opener.resolveDocumentLink(href, this.resource);
			if (resolved.kind === 'file') {
				try {
					const doc = await vscode.workspace.openTextDocument(vscode.Uri.from(resolved.uri));
					if (isMarkdownFile(doc)) {
						return this._delegate.openPreviewLinkToMarkdownFile(doc.uri, resolved.fragment ? decodeURIComponent(resolved.fragment) : undefined);
					}
				} catch {
					// Noop
				}
			}
		}

		return this._opener.openDocumentLink(href, this.resource);
	}

	//#region WebviewResourceProvider

	asWebviewUri(resource: vscode.Uri) {
		return this._webviewPanel.webview.asWebviewUri(resource);
	}

	get cspSource() {
		return [
			this._webviewPanel.webview.cspSource,

			// On web, we also need to allow loading of resources from contributed extensions
			...this._contributionProvider.contributions.previewResourceRoots
				.filter(root => root.scheme === 'http' || root.scheme === 'https')
				.map(root => {
					const dirRoot = root.path.endsWith('/') ? root : root.with({ path: root.path + '/' });
					return dirRoot.toString();
				}),
		].join(' ');
	}

	//#endregion
}

export interface IManagedMarkdownPreview {

	readonly resource: vscode.Uri;
	readonly resourceColumn: vscode.ViewColumn;

	readonly onDispose: vscode.Event<void>;
	readonly onDidChangeViewState: vscode.Event<vscode.WebviewPanelOnDidChangeViewStateEvent>;

	copyImage(id: string): void;
	dispose(): void;
	refresh(): void;
	updateConfiguration(): void;

	matchesResource(
		otherResource: vscode.Uri,
		otherPosition: vscode.ViewColumn | undefined,
		otherLocked: boolean
	): boolean;
}

export class StaticMarkdownPreview extends Disposable implements IManagedMarkdownPreview {

	public static readonly customEditorViewType = 'vscode.markdown.preview.editor';

	public static revive(
		resource: vscode.Uri,
		webview: vscode.WebviewPanel,
		contentProvider: MdDocumentRenderer,
		previewConfigurations: MarkdownPreviewConfigurationManager,
		topmostLineMonitor: TopmostLineMonitor,
		logger: ILogger,
		contributionProvider: MarkdownContributionProvider,
		opener: MdLinkOpener,
		scrollLine?: number,
	): StaticMarkdownPreview {
		return new StaticMarkdownPreview(webview, resource, contentProvider, previewConfigurations, topmostLineMonitor, logger, contributionProvider, opener, scrollLine);
	}

	private readonly _preview: MarkdownPreview;

	private constructor(
		private readonly _webviewPanel: vscode.WebviewPanel,
		resource: vscode.Uri,
		contentProvider: MdDocumentRenderer,
		private readonly _previewConfigurations: MarkdownPreviewConfigurationManager,
		topmostLineMonitor: TopmostLineMonitor,
		logger: ILogger,
		contributionProvider: MarkdownContributionProvider,
		opener: MdLinkOpener,
		scrollLine?: number,
	) {
		super();
		const topScrollLocation = scrollLine ? new StartingScrollLine(scrollLine) : undefined;
		this._preview = this._register(new MarkdownPreview(this._webviewPanel, resource, topScrollLocation, {
			getAdditionalState: () => { return {}; },
			openPreviewLinkToMarkdownFile: (markdownLink, fragment) => {
				return vscode.commands.executeCommand('vscode.openWith', markdownLink.with({
					fragment
				}), StaticMarkdownPreview.customEditorViewType, this._webviewPanel.viewColumn);
			}
		}, contentProvider, _previewConfigurations, logger, contributionProvider, opener));

		this._register(this._webviewPanel.onDidDispose(() => {
			this.dispose();
		}));

		this._register(this._webviewPanel.onDidChangeViewState(e => {
			this._onDidChangeViewState.fire(e);
		}));

		this._register(this._preview.onScroll((scrollInfo) => {
			topmostLineMonitor.setPreviousStaticEditorLine(scrollInfo);
		}));

		this._register(topmostLineMonitor.onDidChanged(event => {
			if (this._preview.isPreviewOf(event.resource)) {
				this._preview.scrollTo(event.line);
			}
		}));
	}

	copyImage(id: string) {
		this._webviewPanel.reveal();
		this._preview.postMessage({
			type: 'copyImage',
			source: this.resource.toString(),
			id: id
		});
	}

	private readonly _onDispose = this._register(new vscode.EventEmitter<void>());
	public readonly onDispose = this._onDispose.event;

	private readonly _onDidChangeViewState = this._register(new vscode.EventEmitter<vscode.WebviewPanelOnDidChangeViewStateEvent>());
	public readonly onDidChangeViewState = this._onDidChangeViewState.event;

	override dispose() {
		this._onDispose.fire();
		super.dispose();
	}

	public matchesResource(
		_otherResource: vscode.Uri,
		_otherPosition: vscode.ViewColumn | undefined,
		_otherLocked: boolean
	): boolean {
		return false;
	}

	public refresh() {
		this._preview.refresh(true);
	}

	public updateConfiguration() {
		if (this._previewConfigurations.hasConfigurationChanged(this._preview.resource)) {
			this.refresh();
		}
	}

	public get resource() {
		return this._preview.resource;
	}

	public get resourceColumn() {
		return this._webviewPanel.viewColumn || vscode.ViewColumn.One;
	}
}

interface DynamicPreviewInput {
	readonly resource: vscode.Uri;
	readonly resourceColumn: vscode.ViewColumn;
	readonly locked: boolean;
	readonly line?: number;
}

export class DynamicMarkdownPreview extends Disposable implements IManagedMarkdownPreview {

	public static readonly viewType = 'markdown.preview';

	private readonly _resourceColumn: vscode.ViewColumn;
	private _locked: boolean;

	private readonly _webviewPanel: vscode.WebviewPanel;
	private _preview: MarkdownPreview;

	public static revive(
		input: DynamicPreviewInput,
		webview: vscode.WebviewPanel,
		contentProvider: MdDocumentRenderer,
		previewConfigurations: MarkdownPreviewConfigurationManager,
		logger: ILogger,
		topmostLineMonitor: TopmostLineMonitor,
		contributionProvider: MarkdownContributionProvider,
		opener: MdLinkOpener,
	): DynamicMarkdownPreview {
		webview.iconPath = contentProvider.iconPath;

		return new DynamicMarkdownPreview(webview, input,
			contentProvider, previewConfigurations, logger, topmostLineMonitor, contributionProvider, opener);
	}

	public static create(
		input: DynamicPreviewInput,
		previewColumn: vscode.ViewColumn,
		contentProvider: MdDocumentRenderer,
		previewConfigurations: MarkdownPreviewConfigurationManager,
		logger: ILogger,
		topmostLineMonitor: TopmostLineMonitor,
		contributionProvider: MarkdownContributionProvider,
		opener: MdLinkOpener,
	): DynamicMarkdownPreview {
		const webview = vscode.window.createWebviewPanel(
			DynamicMarkdownPreview.viewType,
			DynamicMarkdownPreview._getPreviewTitle(input.resource, input.locked),
			previewColumn, { enableFindWidget: true, });

		webview.iconPath = contentProvider.iconPath;

		return new DynamicMarkdownPreview(webview, input,
			contentProvider, previewConfigurations, logger, topmostLineMonitor, contributionProvider, opener);
	}

	private constructor(
		webview: vscode.WebviewPanel,
		input: DynamicPreviewInput,
		private readonly _contentProvider: MdDocumentRenderer,
		private readonly _previewConfigurations: MarkdownPreviewConfigurationManager,
		private readonly _logger: ILogger,
		private readonly _topmostLineMonitor: TopmostLineMonitor,
		private readonly _contributionProvider: MarkdownContributionProvider,
		private readonly _opener: MdLinkOpener,
	) {
		super();

		this._webviewPanel = webview;

		this._resourceColumn = input.resourceColumn;
		this._locked = input.locked;

		this._preview = this._createPreview(input.resource, typeof input.line === 'number' ? new StartingScrollLine(input.line) : undefined);

		this._register(webview.onDidDispose(() => { this.dispose(); }));

		this._register(this._webviewPanel.onDidChangeViewState(e => {
			this._onDidChangeViewStateEmitter.fire(e);
		}));

		this._register(this._topmostLineMonitor.onDidChanged(event => {
			if (this._preview.isPreviewOf(event.resource)) {
				this._preview.scrollTo(event.line);
			}
		}));

		this._register(vscode.window.onDidChangeTextEditorSelection(event => {
			if (this._preview.isPreviewOf(event.textEditor.document.uri)) {
				this._preview.postMessage({
					type: 'onDidChangeTextEditorSelection',
					line: event.selections[0].active.line,
					source: this._preview.resource.toString()
				});
			}
		}));

		this._register(vscode.window.onDidChangeActiveTextEditor(editor => {
			// Only allow previewing normal text editors which have a viewColumn: See #101514
			if (typeof editor?.viewColumn === 'undefined') {
				return;
			}

			if (isMarkdownFile(editor.document) && !this._locked && !this._preview.isPreviewOf(editor.document.uri)) {
				const line = getVisibleLine(editor);
				this.update(editor.document.uri, line ? new StartingScrollLine(line) : undefined);
			}
		}));
	}

	copyImage(id: string) {
		this._webviewPanel.reveal();
		this._preview.postMessage({
			type: 'copyImage',
			source: this.resource.toString(),
			id: id
		});
	}

	private readonly _onDisposeEmitter = this._register(new vscode.EventEmitter<void>());
	public readonly onDispose = this._onDisposeEmitter.event;

	private readonly _onDidChangeViewStateEmitter = this._register(new vscode.EventEmitter<vscode.WebviewPanelOnDidChangeViewStateEvent>());
	public readonly onDidChangeViewState = this._onDidChangeViewStateEmitter.event;

	override dispose() {
		this._preview.dispose();
		this._webviewPanel.dispose();

		this._onDisposeEmitter.fire();
		this._onDisposeEmitter.dispose();
		super.dispose();
	}

	public get resource() {
		return this._preview.resource;
	}

	public get resourceColumn() {
		return this._resourceColumn;
	}

	public reveal(viewColumn: vscode.ViewColumn) {
		this._webviewPanel.reveal(viewColumn);
	}

	public refresh() {
		this._preview.refresh(true);
	}

	public updateConfiguration() {
		if (this._previewConfigurations.hasConfigurationChanged(this._preview.resource)) {
			this.refresh();
		}
	}

	public update(newResource: vscode.Uri, scrollLocation?: StartingScrollLocation) {
		if (this._preview.isPreviewOf(newResource)) {
			switch (scrollLocation?.type) {
				case 'line':
					this._preview.scrollTo(scrollLocation.line);
					return;

				case 'fragment':
					// Workaround. For fragments, just reload the entire preview
					break;

				default:
					return;
			}
		}

		this._preview.dispose();
		this._preview = this._createPreview(newResource, scrollLocation);
	}

	public toggleLock() {
		this._locked = !this._locked;
		this._webviewPanel.title = DynamicMarkdownPreview._getPreviewTitle(this._preview.resource, this._locked);
	}

	private static _getPreviewTitle(resource: vscode.Uri, locked: boolean): string {
		const resourceLabel = uri.Utils.basename(resource);
		return locked
			? vscode.l10n.t('[Preview] {0}', resourceLabel)
			: vscode.l10n.t('Preview {0}', resourceLabel);
	}

	public get position(): vscode.ViewColumn | undefined {
		return this._webviewPanel.viewColumn;
	}

	public matchesResource(
		otherResource: vscode.Uri,
		otherPosition: vscode.ViewColumn | undefined,
		otherLocked: boolean
	): boolean {
		if (this.position !== otherPosition) {
			return false;
		}

		if (this._locked) {
			return otherLocked && this._preview.isPreviewOf(otherResource);
		} else {
			return !otherLocked;
		}
	}

	public matches(otherPreview: DynamicMarkdownPreview): boolean {
		return this.matchesResource(otherPreview._preview.resource, otherPreview.position, otherPreview._locked);
	}

	private _createPreview(resource: vscode.Uri, startingScroll?: StartingScrollLocation): MarkdownPreview {
		return new MarkdownPreview(this._webviewPanel, resource, startingScroll, {
			getTitle: (resource) => DynamicMarkdownPreview._getPreviewTitle(resource, this._locked),
			getAdditionalState: () => {
				return {
					resourceColumn: this.resourceColumn,
					locked: this._locked,
				};
			},
			openPreviewLinkToMarkdownFile: (link: vscode.Uri, fragment?: string) => {
				this.update(link, fragment ? new StartingScrollFragment(fragment) : undefined);
			}
		},
			this._contentProvider,
			this._previewConfigurations,
			this._logger,
			this._contributionProvider,
			this._opener);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/preview/previewConfig.ts]---
Location: vscode-main/extensions/markdown-language-features/src/preview/previewConfig.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { equals } from '../util/arrays';

export class MarkdownPreviewConfiguration {
	public static getForResource(resource: vscode.Uri | null) {
		return new MarkdownPreviewConfiguration(resource);
	}

	public readonly scrollBeyondLastLine: boolean;
	public readonly wordWrap: boolean;

	public readonly previewLineBreaks: boolean;
	public readonly previewLinkify: boolean;
	public readonly previewTypographer: boolean;

	public readonly doubleClickToSwitchToEditor: boolean;
	public readonly scrollEditorWithPreview: boolean;
	public readonly scrollPreviewWithEditor: boolean;
	public readonly markEditorSelection: boolean;

	public readonly lineHeight: number;
	public readonly fontSize: number;
	public readonly fontFamily: string | undefined;
	public readonly styles: readonly string[];

	private constructor(resource: vscode.Uri | null) {
		const editorConfig = vscode.workspace.getConfiguration('editor', resource);
		const markdownConfig = vscode.workspace.getConfiguration('markdown', resource);
		const markdownEditorConfig = vscode.workspace.getConfiguration('[markdown]', resource);

		this.scrollBeyondLastLine = editorConfig.get<boolean>('scrollBeyondLastLine', false);

		this.wordWrap = editorConfig.get<string>('wordWrap', 'off') !== 'off';
		if (markdownEditorConfig?.['editor.wordWrap']) {
			this.wordWrap = markdownEditorConfig['editor.wordWrap'] !== 'off';
		}

		this.scrollPreviewWithEditor = !!markdownConfig.get<boolean>('preview.scrollPreviewWithEditor', true);
		this.scrollEditorWithPreview = !!markdownConfig.get<boolean>('preview.scrollEditorWithPreview', true);

		this.previewLineBreaks = !!markdownConfig.get<boolean>('preview.breaks', false);
		this.previewLinkify = !!markdownConfig.get<boolean>('preview.linkify', true);
		this.previewTypographer = !!markdownConfig.get<boolean>('preview.typographer', false);

		this.doubleClickToSwitchToEditor = !!markdownConfig.get<boolean>('preview.doubleClickToSwitchToEditor', true);
		this.markEditorSelection = !!markdownConfig.get<boolean>('preview.markEditorSelection', true);

		this.fontFamily = markdownConfig.get<string | undefined>('preview.fontFamily', undefined);
		this.fontSize = Math.max(8, +markdownConfig.get<number>('preview.fontSize', NaN));
		this.lineHeight = Math.max(0.6, +markdownConfig.get<number>('preview.lineHeight', NaN));

		this.styles = markdownConfig.get<string[]>('styles', []);
	}

	public isEqualTo(otherConfig: MarkdownPreviewConfiguration) {
		for (const key in this) {
			if (this.hasOwnProperty(key) && key !== 'styles') {
				if (this[key] !== otherConfig[key]) {
					return false;
				}
			}
		}

		return equals(this.styles, otherConfig.styles);
	}

	readonly [key: string]: any;
}

export class MarkdownPreviewConfigurationManager {
	private readonly _previewConfigurationsForWorkspaces = new Map<string, MarkdownPreviewConfiguration>();

	public loadAndCacheConfiguration(
		resource: vscode.Uri
	): MarkdownPreviewConfiguration {
		const config = MarkdownPreviewConfiguration.getForResource(resource);
		this._previewConfigurationsForWorkspaces.set(this._getKey(resource), config);
		return config;
	}

	public hasConfigurationChanged(resource: vscode.Uri): boolean {
		const key = this._getKey(resource);
		const currentConfig = this._previewConfigurationsForWorkspaces.get(key);
		const newConfig = MarkdownPreviewConfiguration.getForResource(resource);
		return !currentConfig?.isEqualTo(newConfig);
	}

	private _getKey(
		resource: vscode.Uri
	): string {
		const folder = vscode.workspace.getWorkspaceFolder(resource);
		return folder ? folder.uri.toString() : '';
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/preview/previewManager.ts]---
Location: vscode-main/extensions/markdown-language-features/src/preview/previewManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { ILogger } from '../logging';
import { MarkdownContributionProvider } from '../markdownExtensions';
import { Disposable, disposeAll } from '../util/dispose';
import { isMarkdownFile } from '../util/file';
import { MdLinkOpener } from '../util/openDocumentLink';
import { MdDocumentRenderer } from './documentRenderer';
import { DynamicMarkdownPreview, IManagedMarkdownPreview, StaticMarkdownPreview } from './preview';
import { MarkdownPreviewConfigurationManager } from './previewConfig';
import { scrollEditorToLine, StartingScrollFragment } from './scrolling';
import { TopmostLineMonitor } from './topmostLineMonitor';


export interface DynamicPreviewSettings {
	readonly resourceColumn: vscode.ViewColumn;
	readonly previewColumn: vscode.ViewColumn;
	readonly locked: boolean;
}

class PreviewStore<T extends IManagedMarkdownPreview> extends Disposable {

	private readonly _previews = new Set<T>();

	public override dispose(): void {
		super.dispose();
		for (const preview of this._previews) {
			preview.dispose();
		}
		this._previews.clear();
	}

	[Symbol.iterator](): Iterator<T> {
		return this._previews[Symbol.iterator]();
	}

	public get(resource: vscode.Uri, previewSettings: DynamicPreviewSettings): T | undefined {
		const previewColumn = this._resolvePreviewColumn(previewSettings);
		for (const preview of this._previews) {
			if (preview.matchesResource(resource, previewColumn, previewSettings.locked)) {
				return preview;
			}
		}
		return undefined;
	}

	public add(preview: T) {
		this._previews.add(preview);
	}

	public delete(preview: T) {
		this._previews.delete(preview);
	}

	private _resolvePreviewColumn(previewSettings: DynamicPreviewSettings): vscode.ViewColumn | undefined {
		if (previewSettings.previewColumn === vscode.ViewColumn.Active) {
			return vscode.window.tabGroups.activeTabGroup.viewColumn;
		}

		if (previewSettings.previewColumn === vscode.ViewColumn.Beside) {
			return vscode.window.tabGroups.activeTabGroup.viewColumn + 1;
		}

		return previewSettings.previewColumn;
	}
}

export class MarkdownPreviewManager extends Disposable implements vscode.WebviewPanelSerializer, vscode.CustomTextEditorProvider {

	private readonly _topmostLineMonitor = new TopmostLineMonitor();
	private readonly _previewConfigurations = new MarkdownPreviewConfigurationManager();

	private readonly _dynamicPreviews = this._register(new PreviewStore<DynamicMarkdownPreview>());
	private readonly _staticPreviews = this._register(new PreviewStore<StaticMarkdownPreview>());

	private _activePreview: IManagedMarkdownPreview | undefined = undefined;

	public constructor(
		private readonly _contentProvider: MdDocumentRenderer,
		private readonly _logger: ILogger,
		private readonly _contributions: MarkdownContributionProvider,
		private readonly _opener: MdLinkOpener,
	) {
		super();

		this._register(vscode.window.registerWebviewPanelSerializer(DynamicMarkdownPreview.viewType, this));

		this._register(vscode.window.registerCustomEditorProvider(StaticMarkdownPreview.customEditorViewType, this, {
			webviewOptions: { enableFindWidget: true }
		}));

		this._register(vscode.window.onDidChangeActiveTextEditor(textEditor => {
			// When at a markdown file, apply existing scroll settings
			if (textEditor?.document && isMarkdownFile(textEditor.document)) {
				const line = this._topmostLineMonitor.getPreviousStaticEditorLineByUri(textEditor.document.uri);
				if (typeof line === 'number') {
					scrollEditorToLine(line, textEditor);
				}
			}
		}));
	}

	public refresh() {
		for (const preview of this._dynamicPreviews) {
			preview.refresh();
		}
		for (const preview of this._staticPreviews) {
			preview.refresh();
		}
	}

	public updateConfiguration() {
		for (const preview of this._dynamicPreviews) {
			preview.updateConfiguration();
		}
		for (const preview of this._staticPreviews) {
			preview.updateConfiguration();
		}
	}

	public openDynamicPreview(
		resource: vscode.Uri,
		settings: DynamicPreviewSettings
	): void {
		let preview = this._dynamicPreviews.get(resource, settings);
		if (preview) {
			preview.reveal(settings.previewColumn);
		} else {
			preview = this._createNewDynamicPreview(resource, settings);
		}

		preview.update(
			resource,
			resource.fragment ? new StartingScrollFragment(resource.fragment) : undefined
		);
	}

	public get activePreviewResource() {
		return this._activePreview?.resource;
	}

	public get activePreviewResourceColumn() {
		return this._activePreview?.resourceColumn;
	}

	public findPreview(resource: vscode.Uri): IManagedMarkdownPreview | undefined {
		for (const preview of [...this._dynamicPreviews, ...this._staticPreviews]) {
			if (preview.resource.fsPath === resource.fsPath) {
				return preview;
			}
		}
		return undefined;
	}

	public toggleLock() {
		const preview = this._activePreview;
		if (preview instanceof DynamicMarkdownPreview) {
			preview.toggleLock();

			// Close any previews that are now redundant, such as having two dynamic previews in the same editor group
			for (const otherPreview of this._dynamicPreviews) {
				if (otherPreview !== preview && preview.matches(otherPreview)) {
					otherPreview.dispose();
				}
			}
		}
	}

	public openDocumentLink(linkText: string, fromResource: vscode.Uri) {
		const viewColumn = this.findPreview(fromResource)?.resourceColumn;
		return this._opener.openDocumentLink(linkText, fromResource, viewColumn);
	}

	public async deserializeWebviewPanel(
		webview: vscode.WebviewPanel,
		state: any
	): Promise<void> {
		try {
			const resource = vscode.Uri.parse(state.resource);
			const locked = state.locked;
			const line = state.line;
			const resourceColumn = state.resourceColumn;

			const preview = DynamicMarkdownPreview.revive(
				{ resource, locked, line, resourceColumn },
				webview,
				this._contentProvider,
				this._previewConfigurations,
				this._logger,
				this._topmostLineMonitor,
				this._contributions,
				this._opener);

			this._registerDynamicPreview(preview);
		} catch (e) {
			console.error(e);

			webview.webview.html = /* html */`<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!-- Disable pinch zooming -->
				<meta name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">

				<title>Markdown Preview</title>

				<style>
					html, body {
						min-height: 100%;
						height: 100%;
					}

					.error-container {
						display: flex;
						justify-content: center;
						align-items: center;
						text-align: center;
					}
				</style>

				<meta http-equiv="Content-Security-Policy" content="default-src 'none';">
			</head>
			<body class="error-container">
				<p>${vscode.l10n.t("An unexpected error occurred while restoring the Markdown preview.")}</p>
			</body>
			</html>`;
		}
	}

	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webview: vscode.WebviewPanel
	): Promise<void> {
		const lineNumber = this._topmostLineMonitor.getPreviousStaticTextEditorLineByUri(document.uri);
		const preview = StaticMarkdownPreview.revive(
			document.uri,
			webview,
			this._contentProvider,
			this._previewConfigurations,
			this._topmostLineMonitor,
			this._logger,
			this._contributions,
			this._opener,
			lineNumber
		);
		this._registerStaticPreview(preview);
		this._activePreview = preview;
	}

	private _createNewDynamicPreview(
		resource: vscode.Uri,
		previewSettings: DynamicPreviewSettings
	): DynamicMarkdownPreview {
		const activeTextEditorURI = vscode.window.activeTextEditor?.document.uri;
		const scrollLine = (activeTextEditorURI?.toString() === resource.toString()) ? vscode.window.activeTextEditor?.visibleRanges[0].start.line : undefined;
		const preview = DynamicMarkdownPreview.create(
			{
				resource,
				resourceColumn: previewSettings.resourceColumn,
				locked: previewSettings.locked,
				line: scrollLine,
			},
			previewSettings.previewColumn,
			this._contentProvider,
			this._previewConfigurations,
			this._logger,
			this._topmostLineMonitor,
			this._contributions,
			this._opener);

		this._activePreview = preview;
		return this._registerDynamicPreview(preview);
	}

	private _registerDynamicPreview(preview: DynamicMarkdownPreview): DynamicMarkdownPreview {
		this._dynamicPreviews.add(preview);

		preview.onDispose(() => {
			this._dynamicPreviews.delete(preview);
		});

		this._trackActive(preview);

		preview.onDidChangeViewState(() => {
			// Remove other dynamic previews in our column
			disposeAll(Array.from(this._dynamicPreviews).filter(otherPreview => preview !== otherPreview && preview.matches(otherPreview)));
		});
		return preview;
	}

	private _registerStaticPreview(preview: StaticMarkdownPreview): StaticMarkdownPreview {
		this._staticPreviews.add(preview);

		preview.onDispose(() => {
			this._staticPreviews.delete(preview);
		});

		this._trackActive(preview);
		return preview;
	}

	private _trackActive(preview: IManagedMarkdownPreview): void {
		preview.onDidChangeViewState(({ webviewPanel }) => {
			this._activePreview = webviewPanel.active ? preview : undefined;
		});

		preview.onDispose(() => {
			if (this._activePreview === preview) {
				this._activePreview = undefined;
			}
		});
	}

}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/preview/scrolling.ts]---
Location: vscode-main/extensions/markdown-language-features/src/preview/scrolling.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as vscode from 'vscode';

/**
 * Change the top-most visible line of `editor` to be at `line`
 */
export function scrollEditorToLine(
	line: number,
	editor: vscode.TextEditor
) {
	const revealRange = toRevealRange(line, editor);
	editor.revealRange(revealRange, vscode.TextEditorRevealType.AtTop);
}

function toRevealRange(line: number, editor: vscode.TextEditor): vscode.Range {
	line = Math.max(0, line);
	const sourceLine = Math.floor(line);
	if (sourceLine >= editor.document.lineCount) {
		return new vscode.Range(editor.document.lineCount - 1, 0, editor.document.lineCount - 1, 0);
	}

	const fraction = line - sourceLine;
	const text = editor.document.lineAt(sourceLine).text;
	const start = Math.floor(fraction * text.length);
	return new vscode.Range(sourceLine, start, sourceLine + 1, 0);
}

export class StartingScrollFragment {
	public readonly type = 'fragment';

	constructor(
		public readonly fragment: string,
	) { }
}

export class StartingScrollLine {
	public readonly type = 'line';

	constructor(
		public readonly line: number,
	) { }
}

export type StartingScrollLocation = StartingScrollLine | StartingScrollFragment;
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/preview/security.ts]---
Location: vscode-main/extensions/markdown-language-features/src/preview/security.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { MarkdownPreviewManager } from './previewManager';


export const enum MarkdownPreviewSecurityLevel {
	Strict = 0,
	AllowInsecureContent = 1,
	AllowScriptsAndAllContent = 2,
	AllowInsecureLocalContent = 3
}

export interface ContentSecurityPolicyArbiter {
	getSecurityLevelForResource(resource: vscode.Uri): MarkdownPreviewSecurityLevel;

	setSecurityLevelForResource(resource: vscode.Uri, level: MarkdownPreviewSecurityLevel): Thenable<void>;

	shouldAllowSvgsForResource(resource: vscode.Uri): void;

	shouldDisableSecurityWarnings(): boolean;

	setShouldDisableSecurityWarning(shouldShow: boolean): Thenable<void>;
}

export class ExtensionContentSecurityPolicyArbiter implements ContentSecurityPolicyArbiter {
	private readonly _old_trusted_workspace_key = 'trusted_preview_workspace:';
	private readonly _security_level_key = 'preview_security_level:';
	private readonly _should_disable_security_warning_key = 'preview_should_show_security_warning:';

	constructor(
		private readonly _globalState: vscode.Memento,
		private readonly _workspaceState: vscode.Memento
	) { }

	public getSecurityLevelForResource(resource: vscode.Uri): MarkdownPreviewSecurityLevel {
		// Use new security level setting first
		const level = this._globalState.get<MarkdownPreviewSecurityLevel | undefined>(this._security_level_key + this._getRoot(resource), undefined);
		if (typeof level !== 'undefined') {
			return level;
		}

		// Fallback to old trusted workspace setting
		if (this._globalState.get<boolean>(this._old_trusted_workspace_key + this._getRoot(resource), false)) {
			return MarkdownPreviewSecurityLevel.AllowScriptsAndAllContent;
		}
		return MarkdownPreviewSecurityLevel.Strict;
	}

	public setSecurityLevelForResource(resource: vscode.Uri, level: MarkdownPreviewSecurityLevel): Thenable<void> {
		return this._globalState.update(this._security_level_key + this._getRoot(resource), level);
	}

	public shouldAllowSvgsForResource(resource: vscode.Uri) {
		const securityLevel = this.getSecurityLevelForResource(resource);
		return securityLevel === MarkdownPreviewSecurityLevel.AllowInsecureContent || securityLevel === MarkdownPreviewSecurityLevel.AllowScriptsAndAllContent;
	}

	public shouldDisableSecurityWarnings(): boolean {
		return this._workspaceState.get<boolean>(this._should_disable_security_warning_key, false);
	}

	public setShouldDisableSecurityWarning(disabled: boolean): Thenable<void> {
		return this._workspaceState.update(this._should_disable_security_warning_key, disabled);
	}

	private _getRoot(resource: vscode.Uri): vscode.Uri {
		if (vscode.workspace.workspaceFolders) {
			const folderForResource = vscode.workspace.getWorkspaceFolder(resource);
			if (folderForResource) {
				return folderForResource.uri;
			}

			if (vscode.workspace.workspaceFolders.length) {
				return vscode.workspace.workspaceFolders[0].uri;
			}
		}

		return resource;
	}
}

export class PreviewSecuritySelector {

	public constructor(
		private readonly _cspArbiter: ContentSecurityPolicyArbiter,
		private readonly _webviewManager: MarkdownPreviewManager
	) { }

	public async showSecuritySelectorForResource(resource: vscode.Uri): Promise<void> {
		interface PreviewSecurityPickItem extends vscode.QuickPickItem {
			readonly type: 'moreinfo' | 'toggle' | MarkdownPreviewSecurityLevel;
		}

		function markActiveWhen(when: boolean): string {
			return when ? '• ' : '';
		}

		const currentSecurityLevel = this._cspArbiter.getSecurityLevelForResource(resource);
		const selection = await vscode.window.showQuickPick<PreviewSecurityPickItem>(
			[
				{
					type: MarkdownPreviewSecurityLevel.Strict,
					label: markActiveWhen(currentSecurityLevel === MarkdownPreviewSecurityLevel.Strict) + vscode.l10n.t("Strict"),
					description: vscode.l10n.t("Only load secure content"),
				}, {
					type: MarkdownPreviewSecurityLevel.AllowInsecureLocalContent,
					label: markActiveWhen(currentSecurityLevel === MarkdownPreviewSecurityLevel.AllowInsecureLocalContent) + vscode.l10n.t("Allow insecure local content"),
					description: vscode.l10n.t("Enable loading content over http served from localhost"),
				}, {
					type: MarkdownPreviewSecurityLevel.AllowInsecureContent,
					label: markActiveWhen(currentSecurityLevel === MarkdownPreviewSecurityLevel.AllowInsecureContent) + vscode.l10n.t("Allow insecure content"),
					description: vscode.l10n.t("Enable loading content over http"),
				}, {
					type: MarkdownPreviewSecurityLevel.AllowScriptsAndAllContent,
					label: markActiveWhen(currentSecurityLevel === MarkdownPreviewSecurityLevel.AllowScriptsAndAllContent) + vscode.l10n.t("Disable"),
					description: vscode.l10n.t("Allow all content and script execution. Not recommended"),
				}, {
					type: 'moreinfo',
					label: vscode.l10n.t("More Information"),
					description: ''
				}, {
					type: 'toggle',
					label: this._cspArbiter.shouldDisableSecurityWarnings()
						? vscode.l10n.t("Enable preview security warnings in this workspace")
						: vscode.l10n.t("Disable preview security warning in this workspace"),
					description: vscode.l10n.t("Does not affect the content security level")
				},
			], {
			placeHolder: vscode.l10n.t("Select security settings for Markdown previews in this workspace"),
		});
		if (!selection) {
			return;
		}

		if (selection.type === 'moreinfo') {
			vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://go.microsoft.com/fwlink/?linkid=854414'));
			return;
		}

		if (selection.type === 'toggle') {
			this._cspArbiter.setShouldDisableSecurityWarning(!this._cspArbiter.shouldDisableSecurityWarnings());
			this._webviewManager.refresh();
			return;
		} else {
			await this._cspArbiter.setSecurityLevelForResource(resource, selection.type);
		}
		this._webviewManager.refresh();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/preview/topmostLineMonitor.ts]---
Location: vscode-main/extensions/markdown-language-features/src/preview/topmostLineMonitor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Disposable } from '../util/dispose';
import { isMarkdownFile } from '../util/file';
import { ResourceMap } from '../util/resourceMap';

export interface LastScrollLocation {
	readonly line: number;
	readonly uri: vscode.Uri;
}

export class TopmostLineMonitor extends Disposable {

	private readonly _pendingUpdates = new ResourceMap<number>();
	private readonly _throttle = 50;
	private readonly _previousTextEditorInfo = new ResourceMap<LastScrollLocation>();
	private readonly _previousStaticEditorInfo = new ResourceMap<LastScrollLocation>();

	constructor() {
		super();

		if (vscode.window.activeTextEditor) {
			const line = getVisibleLine(vscode.window.activeTextEditor);
			this.setPreviousTextEditorLine({ uri: vscode.window.activeTextEditor.document.uri, line: line ?? 0 });
		}

		this._register(vscode.window.onDidChangeTextEditorVisibleRanges(event => {
			if (isMarkdownFile(event.textEditor.document)) {
				const line = getVisibleLine(event.textEditor);
				if (typeof line === 'number') {
					this.updateLine(event.textEditor.document.uri, line);
					this.setPreviousTextEditorLine({ uri: event.textEditor.document.uri, line: line });
				}
			}
		}));
	}

	private readonly _onChanged = this._register(new vscode.EventEmitter<{ readonly resource: vscode.Uri; readonly line: number }>());
	public readonly onDidChanged = this._onChanged.event;

	public setPreviousStaticEditorLine(scrollLocation: LastScrollLocation): void {
		this._previousStaticEditorInfo.set(scrollLocation.uri, scrollLocation);
	}

	public getPreviousStaticEditorLineByUri(resource: vscode.Uri): number | undefined {
		const scrollLoc = this._previousStaticEditorInfo.get(resource);
		this._previousStaticEditorInfo.delete(resource);
		return scrollLoc?.line;
	}


	public setPreviousTextEditorLine(scrollLocation: LastScrollLocation): void {
		this._previousTextEditorInfo.set(scrollLocation.uri, scrollLocation);
	}

	public getPreviousTextEditorLineByUri(resource: vscode.Uri): number | undefined {
		const scrollLoc = this._previousTextEditorInfo.get(resource);
		this._previousTextEditorInfo.delete(resource);
		return scrollLoc?.line;
	}

	public getPreviousStaticTextEditorLineByUri(resource: vscode.Uri): number | undefined {
		const state = this._previousStaticEditorInfo.get(resource);
		return state?.line;
	}

	public updateLine(
		resource: vscode.Uri,
		line: number
	) {
		if (!this._pendingUpdates.has(resource)) {
			// schedule update
			setTimeout(() => {
				if (this._pendingUpdates.has(resource)) {
					this._onChanged.fire({
						resource,
						line: this._pendingUpdates.get(resource) as number
					});
					this._pendingUpdates.delete(resource);
				}
			}, this._throttle);
		}

		this._pendingUpdates.set(resource, line);
	}
}

/**
 * Get the top-most visible range of `editor`.
 *
 * Returns a fractional line number based the visible character within the line.
 * Floor to get real line number
 */
export function getVisibleLine(
	editor: vscode.TextEditor
): number | undefined {
	if (!editor.visibleRanges.length) {
		return undefined;
	}

	const firstVisiblePosition = editor.visibleRanges[0].start;
	const lineNumber = firstVisiblePosition.line;
	const line = editor.document.lineAt(lineNumber);
	const progress = firstVisiblePosition.character / (line.text.length + 2);
	return lineNumber + progress;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/test/copyFile.test.ts]---
Location: vscode-main/extensions/markdown-language-features/src/test/copyFile.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import * as vscode from 'vscode';
import { resolveCopyDestination } from '../languageFeatures/copyFiles/copyFiles';


suite('resolveCopyDestination', () => {

	test('Relative destinations should resolve next to document', async () => {
		const documentUri = vscode.Uri.parse('test://projects/project/sub/readme.md');

		{
			const dest = resolveCopyDestination(documentUri, 'img.png', '${fileName}', () => vscode.Uri.parse('test://projects/project/'));
			assert.strictEqual(dest.toString(), 'test://projects/project/sub/img.png');
		}
		{
			const dest = resolveCopyDestination(documentUri, 'img.png', './${fileName}', () => vscode.Uri.parse('test://projects/project/'));
			assert.strictEqual(dest.toString(), 'test://projects/project/sub/img.png');
		}
		{
			const dest = resolveCopyDestination(documentUri, 'img.png', '../${fileName}', () => vscode.Uri.parse('test://projects/project/'));
			assert.strictEqual(dest.toString(), 'test://projects/project/img.png');
		}
	});

	test('Destination starting with / should go to workspace root', async () => {
		const documentUri = vscode.Uri.parse('test://projects/project/sub/readme.md');
		const dest = resolveCopyDestination(documentUri, 'img.png', '/${fileName}', () => vscode.Uri.parse('test://projects/project/'));

		assert.strictEqual(dest.toString(), 'test://projects/project/img.png');
	});

	test('If there is no workspace root, / should resolve to document dir', async () => {
		const documentUri = vscode.Uri.parse('test://projects/project/sub/readme.md');
		const dest = resolveCopyDestination(documentUri, 'img.png', '/${fileName}', () => undefined);

		assert.strictEqual(dest.toString(), 'test://projects/project/sub/img.png');
	});

	test('If path ends in /, we should automatically add the fileName', async () => {
		{
			const documentUri = vscode.Uri.parse('test://projects/project/sub/readme.md');
			const dest = resolveCopyDestination(documentUri, 'img.png', 'images/', () => vscode.Uri.parse('test://projects/project/'));
			assert.strictEqual(dest.toString(), 'test://projects/project/sub/images/img.png');
		}
		{
			const documentUri = vscode.Uri.parse('test://projects/project/sub/readme.md');
			const dest = resolveCopyDestination(documentUri, 'img.png', './', () => vscode.Uri.parse('test://projects/project/'));
			assert.strictEqual(dest.toString(), 'test://projects/project/sub/img.png');
		}
		{
			const documentUri = vscode.Uri.parse('test://projects/project/sub/readme.md');
			const dest = resolveCopyDestination(documentUri, 'img.png', '/', () => vscode.Uri.parse('test://projects/project/'));

			assert.strictEqual(dest.toString(), 'test://projects/project/img.png');
		}
	});

	test('Basic transform', async () => {
		const documentUri = vscode.Uri.parse('test://projects/project/sub/readme.md');
		const dest = resolveCopyDestination(documentUri, 'img.png', '${fileName/.png/.gif/}', () => undefined);

		assert.strictEqual(dest.toString(), 'test://projects/project/sub/img.gif');
	});

	test('Transforms should support capture groups', async () => {
		const documentUri = vscode.Uri.parse('test://projects/project/sub/readme.md');
		const dest = resolveCopyDestination(documentUri, 'img.png', '${fileName/(.+)\\.(.+)/$2.$1/}', () => undefined);

		assert.strictEqual(dest.toString(), 'test://projects/project/sub/png.img');
	});

	test('Should support escaping snippet variables ', async () => {
		const documentUri = vscode.Uri.parse('test://projects/project/sub/readme.md');

		// Escape leading '$'
		assert.strictEqual(
			resolveCopyDestination(documentUri, 'img.png', '\\${fileName}', () => undefined).toString(true),
			'test://projects/project/sub/${fileName}');

		// Escape closing '}'
		assert.strictEqual(
			resolveCopyDestination(documentUri, 'img.png', '${fileName\\}', () => undefined).toString(true),
			'test://projects/project/sub/${fileName\\}');
	});

	test('Transforms should support escaped slashes', async () => {
		const documentUri = vscode.Uri.parse('test://projects/project/sub/readme.md');
		const dest = resolveCopyDestination(documentUri, 'img.png', '${fileName/(.+)/x\\/y/}.${fileExtName}', () => undefined);

		assert.strictEqual(dest.toString(), 'test://projects/project/sub/x/y.png');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/test/documentLink.test.ts]---
Location: vscode-main/extensions/markdown-language-features/src/test/documentLink.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import * as vscode from 'vscode';
import { joinLines } from './util';

const testFileA = workspaceFile('a.md');

const debug = false;

function debugLog(...args: any[]) {
	if (debug) {
		console.log(...args);
	}
}

function workspaceFile(...segments: string[]) {
	return vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri, ...segments);
}

async function getLinksForFile(file: vscode.Uri): Promise<vscode.DocumentLink[]> {
	debugLog('getting links', file.toString(), Date.now());
	const r = (await vscode.commands.executeCommand<vscode.DocumentLink[]>('vscode.executeLinkProvider', file, /*linkResolveCount*/ 100))!;
	debugLog('got links', file.toString(), Date.now());
	return r;
}

(vscode.env.uiKind === vscode.UIKind.Web ? suite.skip : suite)('Markdown Document links', () => {

	setup(async () => {
		// the tests make the assumption that link providers are already registered
		await vscode.extensions.getExtension('vscode.markdown-language-features')!.activate();
	});

	teardown(async () => {
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');
	});

	test('Should navigate to markdown file', async () => {
		await withFileContents(testFileA, '[b](b.md)');

		const [link] = await getLinksForFile(testFileA);
		await executeLink(link);

		assertActiveDocumentUri(workspaceFile('b.md'));
	});

	test('Should navigate to markdown file with leading ./', async () => {
		await withFileContents(testFileA, '[b](./b.md)');

		const [link] = await getLinksForFile(testFileA);
		await executeLink(link);

		assertActiveDocumentUri(workspaceFile('b.md'));
	});

	test('Should navigate to markdown file with leading /', async () => {
		await withFileContents(testFileA, '[b](./b.md)');

		const [link] = await getLinksForFile(testFileA);
		await executeLink(link);

		assertActiveDocumentUri(workspaceFile('b.md'));
	});

	test('Should navigate to markdown file without file extension', async () => {
		await withFileContents(testFileA, '[b](b)');

		const [link] = await getLinksForFile(testFileA);
		await executeLink(link);

		assertActiveDocumentUri(workspaceFile('b.md'));
	});

	test('Should navigate to markdown file in directory', async () => {
		await withFileContents(testFileA, '[b](sub/c)');

		const [link] = await getLinksForFile(testFileA);
		await executeLink(link);

		assertActiveDocumentUri(workspaceFile('sub', 'c.md'));
	});

	test('Should navigate to fragment by title in file', async () => {
		await withFileContents(testFileA, '[b](sub/c#second)');

		const [link] = await getLinksForFile(testFileA);
		await executeLink(link);

		assertActiveDocumentUri(workspaceFile('sub', 'c.md'));
		assert.strictEqual(vscode.window.activeTextEditor!.selection.start.line, 1);
	});

	test('Should navigate to fragment by line', async () => {
		await withFileContents(testFileA, '[b](sub/c#L2)');

		const [link] = await getLinksForFile(testFileA);
		await executeLink(link);

		assertActiveDocumentUri(workspaceFile('sub', 'c.md'));
		assert.strictEqual(vscode.window.activeTextEditor!.selection.start.line, 1);
	});

	test('Should navigate to line number within non-md file', async () => {
		await withFileContents(testFileA, '[b](sub/foo.txt#L3)');

		const [link] = await getLinksForFile(testFileA);
		await executeLink(link);

		assertActiveDocumentUri(workspaceFile('sub', 'foo.txt'));
		assert.strictEqual(vscode.window.activeTextEditor!.selection.start.line, 2);
	});

	test('Should navigate to fragment within current file', async () => {
		await withFileContents(testFileA, joinLines(
			'[](a#header)',
			'[](#header)',
			'# Header'));

		const links = await getLinksForFile(testFileA);
		{
			await executeLink(links[0]);
			assertActiveDocumentUri(workspaceFile('a.md'));
			assert.strictEqual(vscode.window.activeTextEditor!.selection.start.line, 2);
		}
		{
			await executeLink(links[1]);
			assertActiveDocumentUri(workspaceFile('a.md'));
			assert.strictEqual(vscode.window.activeTextEditor!.selection.start.line, 2);
		}
	});

	test.skip('Should navigate to fragment within current untitled file', async () => { // TODO: skip for now for ls migration
		const testFile = workspaceFile('x.md').with({ scheme: 'untitled' });
		await withFileContents(testFile, joinLines(
			'[](#second)',
			'# Second'));

		const [link] = await getLinksForFile(testFile);
		await executeLink(link);

		assertActiveDocumentUri(testFile);
		assert.strictEqual(vscode.window.activeTextEditor!.selection.start.line, 1);
	});
});


function assertActiveDocumentUri(expectedUri: vscode.Uri) {
	assert.strictEqual(
		vscode.window.activeTextEditor!.document.uri.fsPath,
		expectedUri.fsPath
	);
}

async function withFileContents(file: vscode.Uri, contents: string): Promise<void> {
	debugLog('openTextDocument', file.toString(), Date.now());
	const document = await vscode.workspace.openTextDocument(file);
	debugLog('showTextDocument', file.toString(), Date.now());
	const editor = await vscode.window.showTextDocument(document);
	debugLog('editTextDocument', file.toString(), Date.now());
	await editor.edit(edit => {
		edit.replace(new vscode.Range(0, 0, 1000, 0), contents);
	});
	debugLog('opened done', vscode.window.activeTextEditor?.document.toString(), Date.now());
}

async function executeLink(link: vscode.DocumentLink) {
	debugLog('executingLink', link.target?.toString(), Date.now());

	await vscode.commands.executeCommand('vscode.open', link.target!);
	debugLog('executedLink', vscode.window.activeTextEditor?.document.toString(), Date.now());
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/test/engine.test.ts]---
Location: vscode-main/extensions/markdown-language-features/src/test/engine.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import * as vscode from 'vscode';
import { InMemoryDocument } from '../client/inMemoryDocument';
import { createNewMarkdownEngine } from './engine';


const testFileName = vscode.Uri.file('test.md');

suite('markdown.engine', () => {
	suite('rendering', () => {
		const input = '# hello\n\nworld!';
		const output = '<h1 data-line="0" class="code-line" dir="auto" id="hello">hello</h1>\n'
			+ '<p data-line="2" class="code-line" dir="auto">world!</p>\n';

		test('Renders a document', async () => {
			const doc = new InMemoryDocument(testFileName, input);
			const engine = createNewMarkdownEngine();
			assert.strictEqual((await engine.render(doc)).html, output);
		});

		test('Renders a string', async () => {
			const engine = createNewMarkdownEngine();
			assert.strictEqual((await engine.render(input)).html, output);
		});
	});

	suite('image-caching', () => {
		const input = '![](img.png) [](no-img.png) ![](http://example.org/img.png) ![](img.png) ![](./img2.png)';

		test('Extracts all images', async () => {
			const engine = createNewMarkdownEngine();
			const result = await engine.render(input);
			assert.deepStrictEqual(result.html,
				'<p data-line="0" class="code-line" dir="auto">'
				+ '<img src="img.png" alt="" data-src="img.png"> '
				+ '<a href="no-img.png" data-href="no-img.png"></a> '
				+ '<img src="http://example.org/img.png" alt="" data-src="http://example.org/img.png"> '
				+ '<img src="img.png" alt="" data-src="img.png"> '
				+ '<img src="./img2.png" alt="" data-src="./img2.png">'
				+ '</p>\n'
			);

			assert.deepStrictEqual([...result.containingImages], ['img.png', 'http://example.org/img.png', './img2.png']);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/test/engine.ts]---
Location: vscode-main/extensions/markdown-language-features/src/test/engine.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { MarkdownItEngine } from '../markdownEngine';
import { MarkdownContributionProvider, MarkdownContributions } from '../markdownExtensions';
import { githubSlugifier } from '../slugify';
import { nulLogger } from './nulLogging';

const emptyContributions = new class implements MarkdownContributionProvider {
	readonly extensionUri = vscode.Uri.file('/');
	readonly contributions = MarkdownContributions.Empty;

	private readonly _onContributionsChanged = new vscode.EventEmitter<this>();
	readonly onContributionsChanged = this._onContributionsChanged.event;

	dispose() {
		this._onContributionsChanged.dispose();
	}
};

export function createNewMarkdownEngine(): MarkdownItEngine {
	return new MarkdownItEngine(emptyContributions, githubSlugifier, nulLogger);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/test/index.ts]---
Location: vscode-main/extensions/markdown-language-features/src/test/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as testRunner from '../../../../test/integration/electron/testrunner';

const options: import('mocha').MochaOptions = {
	ui: 'tdd',
	color: true,
	timeout: 60000
};

// These integration tests is being run in multiple environments (electron, web, remote)
// so we need to set the suite name based on the environment as the suite name is used
// for the test results file name
let suite = '';
if (process.env.VSCODE_BROWSER) {
	suite = `${process.env.VSCODE_BROWSER} Browser Integration Markdown Tests`;
} else if (process.env.REMOTE_VSCODE) {
	suite = 'Remote Integration Markdown Tests';
} else {
	suite = 'Integration Markdown Tests';
}

if (process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE) {
	options.reporter = 'mocha-multi-reporters';
	options.reporterOptions = {
		reporterEnabled: 'spec, mocha-junit-reporter',
		mochaJunitReporterReporterOptions: {
			testsuitesTitle: `${suite} ${process.platform}`,
			mochaFile: path.join(
				process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE || __dirname,
				`test-results/${process.platform}-${process.arch}-${suite.toLowerCase().replace(/[^\w]/g, '-')}-results.xml`)
		}
	};
}

testRunner.configure(options);

export = testRunner;
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/test/nulLogging.ts]---
Location: vscode-main/extensions/markdown-language-features/src/test/nulLogging.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILogger } from '../logging';

export const nulLogger = new class implements ILogger {
	trace(): void {
		// noop
	}
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/test/pasteUrl.test.ts]---
Location: vscode-main/extensions/markdown-language-features/src/test/pasteUrl.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as assert from 'assert';
import 'mocha';
import * as vscode from 'vscode';
import { InMemoryDocument } from '../client/inMemoryDocument';
import { createInsertUriListEdit, imageEditKind, linkEditKind } from '../languageFeatures/copyFiles/shared';
import { InsertMarkdownLink, findValidUriInText, shouldInsertMarkdownLinkByDefault } from '../languageFeatures/copyFiles/smartDropOrPaste';
import { noopToken } from '../util/cancellation';
import { UriList } from '../util/uriList';
import { createNewMarkdownEngine } from './engine';
import { joinLines } from './util';

function makeTestDoc(contents: string) {
	return new InMemoryDocument(vscode.Uri.file('test.md'), contents);
}

suite('createEditAddingLinksForUriList', () => {

	test('Markdown Link Pasting should occur for a valid link (end to end)', async () => {
		const result = createInsertUriListEdit(
			new InMemoryDocument(vscode.Uri.file('test.md'), 'hello world!'), [new vscode.Range(0, 0, 0, 12)], UriList.from('https://www.microsoft.com/'));
		// need to check the actual result -> snippet value
		assert.strictEqual(result?.label, 'Insert Markdown Link');
	});

	suite('validateLink', () => {

		test('Markdown pasting should occur for a valid link', () => {
			assert.strictEqual(
				findValidUriInText('https://www.microsoft.com/'),
				'https://www.microsoft.com/');
		});

		test('Markdown pasting should occur for a valid link preceded by a new line', () => {
			assert.strictEqual(
				findValidUriInText('\r\nhttps://www.microsoft.com/'),
				'https://www.microsoft.com/');
		});

		test('Markdown pasting should occur for a valid link followed by a new line', () => {
			assert.strictEqual(
				findValidUriInText('https://www.microsoft.com/\r\n'),
				'https://www.microsoft.com/');
		});

		test('Markdown pasting should not occur for a valid hostname and invalid protool', () => {
			assert.strictEqual(
				findValidUriInText('invalid:www.microsoft.com'),
				undefined);
		});

		test('Markdown pasting should not occur for plain text', () => {
			assert.strictEqual(
				findValidUriInText('hello world!'),
				undefined);
		});

		test('Markdown pasting should not occur for plain text including a colon', () => {
			assert.strictEqual(
				findValidUriInText('hello: world!'),
				undefined);
		});

		test('Markdown pasting should not occur for plain text including a slashes', () => {
			assert.strictEqual(
				findValidUriInText('helloworld!'),
				undefined);
		});

		test('Markdown pasting should not occur for a link followed by text', () => {
			assert.strictEqual(
				findValidUriInText('https://www.microsoft.com/ hello world!'),
				undefined);
		});

		test('Markdown pasting should occur for a link preceded or followed by spaces', () => {
			assert.strictEqual(
				findValidUriInText('     https://www.microsoft.com/     '),
				'https://www.microsoft.com/');
		});

		test('Markdown pasting should not occur for a link with an invalid scheme', () => {
			assert.strictEqual(
				findValidUriInText('hello:www.microsoft.com'),
				undefined);
		});

		test('Markdown pasting should not occur for multiple links being pasted', () => {
			assert.strictEqual(
				findValidUriInText('https://www.microsoft.com/\r\nhttps://www.microsoft.com/\r\nhttps://www.microsoft.com/\r\nhttps://www.microsoft.com/'),
				undefined);
		});

		test('Markdown pasting should not occur for multiple links with spaces being pasted', () => {
			assert.strictEqual(
				findValidUriInText('https://www.microsoft.com/    \r\nhttps://www.microsoft.com/\r\nhttps://www.microsoft.com/\r\n hello \r\nhttps://www.microsoft.com/'),
				undefined);
		});

		test('Markdown pasting should not occur for just a valid uri scheme', () => {
			assert.strictEqual(
				findValidUriInText('https://'),
				undefined);
		});
	});

	suite('createInsertUriListEdit', () => {
		test('Should create snippet with < > when pasted link has an mismatched parentheses', () => {
			const edit = createInsertUriListEdit(makeTestDoc(''), [new vscode.Range(0, 0, 0, 0)], UriList.from('https://www.mic(rosoft.com'));
			assert.strictEqual(edit?.edits?.[0].snippet.value, '[${1:text}](<https://www.mic(rosoft.com>)');
		});

		test('Should create Markdown link snippet when pasteAsMarkdownLink is true', () => {
			const edit = createInsertUriListEdit(makeTestDoc(''), [new vscode.Range(0, 0, 0, 0)], UriList.from('https://www.microsoft.com'));
			assert.strictEqual(edit?.edits?.[0].snippet.value, '[${1:text}](https://www.microsoft.com)');
		});

		test('Should use an unencoded URI string in Markdown link when passing in an external browser link', () => {
			const edit = createInsertUriListEdit(makeTestDoc(''), [new vscode.Range(0, 0, 0, 0)], UriList.from('https://www.microsoft.com'));
			assert.strictEqual(edit?.edits?.[0].snippet.value, '[${1:text}](https://www.microsoft.com)');
		});

		test('Should not decode an encoded URI string when passing in an external browser link', () => {
			const edit = createInsertUriListEdit(makeTestDoc(''), [new vscode.Range(0, 0, 0, 0)], UriList.from('https://www.microsoft.com/%20'));
			assert.strictEqual(edit?.edits?.[0].snippet.value, '[${1:text}](https://www.microsoft.com/%20)');
		});

		test('Should not encode an unencoded URI string when passing in an external browser link', () => {
			const edit = createInsertUriListEdit(makeTestDoc(''), [new vscode.Range(0, 0, 0, 0)], UriList.from('https://www.example.com/path?query=value&another=value#fragment'));
			assert.strictEqual(edit?.edits?.[0].snippet.value, '[${1:text}](https://www.example.com/path?query=value&another=value#fragment)');
		});

		test('Should add image for image file by default', () => {
			const edit = createInsertUriListEdit(makeTestDoc(''), [new vscode.Range(0, 0, 0, 0)], UriList.from('https://www.example.com/cat.png'));
			assert.strictEqual(edit?.edits?.[0].snippet.value, '![${1:alt text}](https://www.example.com/cat.png)');
		});

		test('Should be able to override insert style to use link', () => {
			const edit = createInsertUriListEdit(makeTestDoc(''), [new vscode.Range(0, 0, 0, 0)], UriList.from('https://www.example.com/cat.png'), {
				linkKindHint: linkEditKind,
			});
			assert.strictEqual(edit?.edits?.[0].snippet.value, '[${1:text}](https://www.example.com/cat.png)');
		});

		test('Should be able to override insert style to use images', () => {
			const edit = createInsertUriListEdit(makeTestDoc(''), [new vscode.Range(0, 0, 0, 0)], UriList.from('https://www.example.com/'), {
				linkKindHint: imageEditKind,
			});
			assert.strictEqual(edit?.edits?.[0].snippet.value, '![${1:alt text}](https://www.example.com/)');
		});
	});


	suite('shouldInsertMarkdownLinkByDefault', () => {

		test('Smart should be enabled for selected plain text', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('hello world'), InsertMarkdownLink.SmartWithSelection, [new vscode.Range(0, 0, 0, 12)], noopToken),
				true);
		});

		test('Smart should be enabled in headers', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('# title'), InsertMarkdownLink.Smart, [new vscode.Range(0, 2, 0, 2)], noopToken),
				true);
		});

		test('Smart should be enabled in lists', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('1. text'), InsertMarkdownLink.Smart, [new vscode.Range(0, 3, 0, 3)], noopToken),
				true);
		});

		test('Smart should be enabled in blockquotes', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('> text'), InsertMarkdownLink.Smart, [new vscode.Range(0, 3, 0, 3)], noopToken),
				true);
		});

		test('Smart should be disabled in indented code blocks', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('    code'), InsertMarkdownLink.Smart, [new vscode.Range(0, 4, 0, 4)], noopToken),
				false);
		});

		test('Smart should be disabled in fenced code blocks', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('```\r\n\r\n```'), InsertMarkdownLink.Smart, [new vscode.Range(0, 5, 0, 5)], noopToken),
				false);

			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('~~~\r\n\r\n~~~'), InsertMarkdownLink.Smart, [new vscode.Range(0, 5, 0, 5)], noopToken),
				false);
		});

		test('Smart should be disabled in math blocks', async () => {

			let katex: any = (await import('@vscode/markdown-it-katex')).default;
			if (typeof katex === 'object') {
				katex = katex.default;
			}

			const engine = createNewMarkdownEngine();
			(await engine.getEngine(undefined)).use(katex);
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(engine, makeTestDoc('$$\r\n\r\n$$'), InsertMarkdownLink.Smart, [new vscode.Range(0, 5, 0, 5)], noopToken),
				false);
		});

		test('Smart should be disabled in link definitions', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('[ref]: http://example.com'), InsertMarkdownLink.Smart, [new vscode.Range(0, 4, 0, 6)], noopToken),
				false);

			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('[ref]: '), InsertMarkdownLink.Smart, [new vscode.Range(0, 7, 0, 7)], noopToken),
				false);

			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('[ref]: '), InsertMarkdownLink.Smart, [new vscode.Range(0, 0, 0, 0)], noopToken),
				false);
		});

		test('Smart should be disabled in html blocks', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('<p>\na\n</p>'), InsertMarkdownLink.Smart, [new vscode.Range(1, 0, 1, 0)], noopToken),
				false);
		});

		test('Smart should be disabled in html blocks where paste creates the block', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('<p>\n\n</p>'), InsertMarkdownLink.Smart, [new vscode.Range(1, 0, 1, 0)], noopToken),
				false,
				'Between two html tags should be treated as html block');

			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('<p>\n\ntext'), InsertMarkdownLink.Smart, [new vscode.Range(1, 0, 1, 0)], noopToken),
				false,
				'Between opening html tag and text should be treated as html block');

			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('<p>\n\n\n</p>'), InsertMarkdownLink.Smart, [new vscode.Range(1, 0, 1, 0)], noopToken),
				true,
				'Extra new line after paste should not be treated as html block');
		});

		test('Smart should be disabled in Markdown links', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('[a](bcdef)'), InsertMarkdownLink.Smart, [new vscode.Range(0, 4, 0, 6)], noopToken),
				false);
		});

		test('Smart should be disabled in Markdown images', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('![a](bcdef)'), InsertMarkdownLink.Smart, [new vscode.Range(0, 5, 0, 10)], noopToken),
				false);
		});

		test('Smart should be disabled in inline code', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('``'), InsertMarkdownLink.Smart, [new vscode.Range(0, 1, 0, 1)], noopToken),
				false,
				'Should be disabled inside of inline code');

			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('``'), InsertMarkdownLink.Smart, [new vscode.Range(0, 0, 0, 0)], noopToken),
				true,
				'Should be enabled when cursor is outside but next to inline code');

			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('`a`'), InsertMarkdownLink.Smart, [new vscode.Range(0, 3, 0, 3)], noopToken),
				true,
				'Should be enabled when cursor is outside but next to inline code');
		});

		test('Smart should be enabled when pasting over inline code ', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('`xyz`'), InsertMarkdownLink.Smart, [new vscode.Range(0, 0, 0, 5)], noopToken),
				true);
		});

		test('Smart should be disabled in inline math', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('$$'), InsertMarkdownLink.SmartWithSelection, [new vscode.Range(0, 1, 0, 1)], noopToken),
				false);
		});

		test('Smart should be enabled for empty selection', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('xyz'), InsertMarkdownLink.Smart, [new vscode.Range(0, 0, 0, 0)], noopToken),
				true);
		});

		test('SmartWithSelection should disable for empty selection', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('xyz'), InsertMarkdownLink.SmartWithSelection, [new vscode.Range(0, 0, 0, 0)], noopToken),
				false);
		});

		test('Smart should disable for selected link', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('https://www.microsoft.com'), InsertMarkdownLink.SmartWithSelection, [new vscode.Range(0, 0, 0, 25)], noopToken),
				false);
		});

		test('Smart should disable for selected link with trailing whitespace', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('   https://www.microsoft.com  '), InsertMarkdownLink.SmartWithSelection, [new vscode.Range(0, 0, 0, 30)], noopToken),
				false);
		});

		test('Should evaluate pasteAsMarkdownLink as true for a link pasted in square brackets', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('[abc]'), InsertMarkdownLink.SmartWithSelection, [new vscode.Range(0, 1, 0, 4)], noopToken),
				true);
		});

		test('Should evaluate pasteAsMarkdownLink as false for selected whitespace and new lines', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('   \r\n\r\n'), InsertMarkdownLink.SmartWithSelection, [new vscode.Range(0, 0, 0, 7)], noopToken),
				false);
		});

		test('Smart should be disabled inside of autolinks', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc('<>'), InsertMarkdownLink.Smart, [new vscode.Range(0, 1, 0, 1)], noopToken),
				false);
		});

		test('Smart should be disabled in frontmatter', async () => {
			const textDoc = makeTestDoc(joinLines(
				`---`,
				`layout: post`,
				`title: Blogging Like a Hacker`,
				`---`,
				``,
				`Link Text`
			));
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), textDoc, InsertMarkdownLink.Smart, [new vscode.Range(0, 0, 0, 0)], noopToken),
				false);

			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), textDoc, InsertMarkdownLink.Smart, [new vscode.Range(1, 0, 1, 0)], noopToken),
				false);
		});

		test('Smart should enabled after frontmatter', async () => {
			assert.strictEqual(
				await shouldInsertMarkdownLinkByDefault(createNewMarkdownEngine(), makeTestDoc(joinLines(
					`---`,
					`layout: post`,
					`title: Blogging Like a Hacker`,
					`---`,
					``,
					`Link Text`
				)), InsertMarkdownLink.Smart, [new vscode.Range(5, 0, 5, 0)], noopToken),
				true);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/test/urlToUri.test.ts]---
Location: vscode-main/extensions/markdown-language-features/src/test/urlToUri.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual } from 'assert';
import 'mocha';
import { Uri } from 'vscode';
import { urlToUri } from '../util/url';

suite('urlToUri', () => {
	test('Absolute File', () => {
		deepStrictEqual(
			urlToUri('file:///root/test.txt', Uri.parse('file:///usr/home/')),
			Uri.parse('file:///root/test.txt')
		);
	});

	test('Relative File', () => {
		deepStrictEqual(
			urlToUri('./file.ext', Uri.parse('file:///usr/home/')),
			Uri.parse('file:///usr/home/file.ext')
		);
	});

	test('Http Basic', () => {
		deepStrictEqual(
			urlToUri('http://example.org?q=10&f', Uri.parse('file:///usr/home/')),
			Uri.parse('http://example.org?q=10&f')
		);
	});

	test('Http Encoded Chars', () => {
		deepStrictEqual(
			urlToUri('http://example.org/%C3%A4', Uri.parse('file:///usr/home/')),
			Uri.parse('http://example.org/%C3%A4')
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/test/util.ts]---
Location: vscode-main/extensions/markdown-language-features/src/test/util.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as os from 'os';

export const joinLines = (...args: string[]) =>
	args.join(os.platform() === 'win32' ? '\r\n' : '\n');
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/types/textDocument.ts]---
Location: vscode-main/extensions/markdown-language-features/src/types/textDocument.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

/**
 * Minimal version of {@link vscode.TextDocument}.
 */
export interface ITextDocument {
	readonly uri: vscode.Uri;
	readonly version: number;

	getText(range?: vscode.Range): string;

	positionAt(offset: number): vscode.Position;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/typings/ref.d.ts]---
Location: vscode-main/extensions/markdown-language-features/src/typings/ref.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'markdown-it-front-matter';
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/util/arrays.ts]---
Location: vscode-main/extensions/markdown-language-features/src/util/arrays.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 * @returns New array with all falsy values removed. The original array IS NOT modified.
 */
export function coalesce<T>(array: ReadonlyArray<T | undefined | null>): T[] {
	return <T[]>array.filter(e => !!e);
}

export function equals<T>(one: ReadonlyArray<T>, other: ReadonlyArray<T>, itemEquals: (a: T, b: T) => boolean = (a, b) => a === b): boolean {
	if (one.length !== other.length) {
		return false;
	}

	for (let i = 0, len = one.length; i < len; i++) {
		if (!itemEquals(one[i], other[i])) {
			return false;
		}
	}

	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/util/async.ts]---
Location: vscode-main/extensions/markdown-language-features/src/util/async.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface ITask<T> {
	(): T;
}

export class Delayer<T> {

	public defaultDelay: number;
	private _timeout: any; // Timer
	private _cancelTimeout: Promise<T | null> | null;
	private _onSuccess: ((value: T | PromiseLike<T> | undefined) => void) | null;
	private _task: ITask<T> | null;

	constructor(defaultDelay: number) {
		this.defaultDelay = defaultDelay;
		this._timeout = null;
		this._cancelTimeout = null;
		this._onSuccess = null;
		this._task = null;
	}

	dispose() {
		this._doCancelTimeout();
	}

	public trigger(task: ITask<T>, delay: number = this.defaultDelay): Promise<T | null> {
		this._task = task;
		if (delay >= 0) {
			this._doCancelTimeout();
		}

		if (!this._cancelTimeout) {
			this._cancelTimeout = new Promise<T | undefined>((resolve) => {
				this._onSuccess = resolve;
			}).then(() => {
				this._cancelTimeout = null;
				this._onSuccess = null;
				const result = this._task?.() ?? null;
				this._task = null;
				return result;
			});
		}

		if (delay >= 0 || this._timeout === null) {
			this._timeout = setTimeout(() => {
				this._timeout = null;
				this._onSuccess?.(undefined);
			}, delay >= 0 ? delay : this.defaultDelay);
		}

		return this._cancelTimeout;
	}

	private _doCancelTimeout(): void {
		if (this._timeout !== null) {
			clearTimeout(this._timeout);
			this._timeout = null;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/util/cancellation.ts]---
Location: vscode-main/extensions/markdown-language-features/src/util/cancellation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export const noopToken: vscode.CancellationToken = new class implements vscode.CancellationToken {
	private readonly _onCancellationRequestedEmitter = new vscode.EventEmitter<void>();
	onCancellationRequested = this._onCancellationRequestedEmitter.event;

	get isCancellationRequested() { return false; }
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/util/dispose.ts]---
Location: vscode-main/extensions/markdown-language-features/src/util/dispose.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export function disposeAll(disposables: Iterable<vscode.Disposable>) {
	const errors: any[] = [];

	for (const disposable of disposables) {
		try {
			disposable.dispose();
		} catch (e) {
			errors.push(e);
		}
	}

	if (errors.length === 1) {
		throw errors[0];
	} else if (errors.length > 1) {
		throw new AggregateError(errors, 'Encountered errors while disposing of store');
	}
}

export interface IDisposable {
	dispose(): void;
}

export abstract class Disposable {
	private _isDisposed = false;

	protected _disposables: vscode.Disposable[] = [];

	public dispose(): any {
		if (this._isDisposed) {
			return;
		}
		this._isDisposed = true;
		disposeAll(this._disposables);
	}

	protected _register<T extends IDisposable>(value: T): T {
		if (this._isDisposed) {
			value.dispose();
		} else {
			this._disposables.push(value);
		}
		return value;
	}

	protected get isDisposed() {
		return this._isDisposed;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/util/document.ts]---
Location: vscode-main/extensions/markdown-language-features/src/util/document.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Schemes } from './schemes';
import { Utils } from 'vscode-uri';

export function getDocumentDir(uri: vscode.Uri): vscode.Uri | undefined {
	const docUri = getParentDocumentUri(uri);
	if (docUri.scheme === Schemes.untitled) {
		return vscode.workspace.workspaceFolders?.[0]?.uri;
	}
	return Utils.dirname(docUri);
}

export function getParentDocumentUri(uri: vscode.Uri): vscode.Uri {
	if (uri.scheme === Schemes.notebookCell) {
		for (const notebook of vscode.workspace.notebookDocuments) {
			for (const cell of notebook.getCells()) {
				if (cell.document.uri.toString() === uri.toString()) {
					return notebook.uri;
				}
			}
		}
	}

	return uri;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/util/dom.ts]---
Location: vscode-main/extensions/markdown-language-features/src/util/dom.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as vscode from 'vscode';

export function escapeAttribute(value: string | vscode.Uri): string {
	return value.toString()
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/util/file.ts]---
Location: vscode-main/extensions/markdown-language-features/src/util/file.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as URI from 'vscode-uri';
import { Schemes } from './schemes';

export const markdownFileExtensions = Object.freeze<string[]>([
	'md',
	'mkd',
	'mdwn',
	'mdown',
	'markdown',
	'markdn',
	'mdtxt',
	'mdtext',
	'workbook',
]);

export const markdownLanguageIds = ['markdown', 'prompt', 'instructions', 'chatmode'];

export function isMarkdownFile(document: vscode.TextDocument) {
	return markdownLanguageIds.indexOf(document.languageId) !== -1;
}

export function looksLikeMarkdownPath(resolvedHrefPath: vscode.Uri): boolean {
	const doc = vscode.workspace.textDocuments.find(doc => doc.uri.toString() === resolvedHrefPath.toString());
	if (doc) {
		return isMarkdownFile(doc);
	}

	if (resolvedHrefPath.scheme === Schemes.notebookCell) {
		for (const notebook of vscode.workspace.notebookDocuments) {
			for (const cell of notebook.getCells()) {
				if (cell.kind === vscode.NotebookCellKind.Markup && isMarkdownFile(cell.document)) {
					return true;
				}
			}
		}
		return false;
	}

	return markdownFileExtensions.includes(URI.Utils.extname(resolvedHrefPath).toLowerCase().replace('.', ''));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/util/mimes.ts]---
Location: vscode-main/extensions/markdown-language-features/src/util/mimes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const Mime = {
	textUriList: 'text/uri-list',
	textPlain: 'text/plain',
} as const;

export const rootMediaMimesTypes = Object.freeze({
	image: 'image',
	audio: 'audio',
	video: 'video',
});

export enum MediaKind {
	Image = 1,
	Video,
	Audio
}

export function getMediaKindForMime(mime: string): MediaKind | undefined {
	const root = mime.toLowerCase().split('/').at(0);
	switch (root) {
		case 'image': return MediaKind.Image;
		case 'video': return MediaKind.Video;
		case 'audio': return MediaKind.Audio;
		default: return undefined;
	}
}

export const mediaFileExtensions = new Map<string, MediaKind>([
	// Images
	['avif', MediaKind.Image],
	['bmp', MediaKind.Image],
	['gif', MediaKind.Image],
	['ico', MediaKind.Image],
	['jpe', MediaKind.Image],
	['jpeg', MediaKind.Image],
	['jpg', MediaKind.Image],
	['png', MediaKind.Image],
	['psd', MediaKind.Image],
	['svg', MediaKind.Image],
	['tga', MediaKind.Image],
	['tif', MediaKind.Image],
	['tiff', MediaKind.Image],
	['webp', MediaKind.Image],

	// Videos
	['ogg', MediaKind.Video],
	['mp4', MediaKind.Video],
	['mov', MediaKind.Video],

	// Audio Files
	['mp3', MediaKind.Audio],
	['aac', MediaKind.Audio],
	['wav', MediaKind.Audio],
]);
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/util/openDocumentLink.ts]---
Location: vscode-main/extensions/markdown-language-features/src/util/openDocumentLink.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { MdLanguageClient } from '../client/client';
import * as proto from '../client/protocol';

enum OpenMarkdownLinks {
	beside = 'beside',
	currentGroup = 'currentGroup',
}

export class MdLinkOpener {

	constructor(
		private readonly _client: MdLanguageClient,
	) { }

	public async resolveDocumentLink(linkText: string, fromResource: vscode.Uri): Promise<proto.ResolvedDocumentLinkTarget> {
		return this._client.resolveLinkTarget(linkText, fromResource);
	}

	public async openDocumentLink(linkText: string, fromResource: vscode.Uri, viewColumn?: vscode.ViewColumn): Promise<void> {
		const resolved = await this._client.resolveLinkTarget(linkText, fromResource);
		if (!resolved) {
			return;
		}

		const uri = vscode.Uri.from(resolved.uri);
		switch (resolved.kind) {
			case 'external':
				return vscode.commands.executeCommand('vscode.open', uri);

			case 'folder':
				return vscode.commands.executeCommand('revealInExplorer', uri);

			case 'file': {
				// If no explicit viewColumn is given, check if the editor is already open in a tab
				if (typeof viewColumn === 'undefined') {
					for (const tab of vscode.window.tabGroups.all.flatMap(x => x.tabs)) {
						if (tab.input instanceof vscode.TabInputText) {
							if (tab.input.uri.fsPath === uri.fsPath) {
								viewColumn = tab.group.viewColumn;
								break;
							}
						}
					}
				}

				return vscode.commands.executeCommand('vscode.open', uri, {
					selection: resolved.position ? new vscode.Range(resolved.position.line, resolved.position.character, resolved.position.line, resolved.position.character) : undefined,
					viewColumn: viewColumn ?? getViewColumn(fromResource),
				} satisfies vscode.TextDocumentShowOptions);
			}
		}
	}
}

function getViewColumn(resource: vscode.Uri): vscode.ViewColumn {
	const config = vscode.workspace.getConfiguration('markdown', resource);
	const openLinks = config.get<OpenMarkdownLinks>('links.openLocation', OpenMarkdownLinks.currentGroup);
	switch (openLinks) {
		case OpenMarkdownLinks.beside:
			return vscode.ViewColumn.Beside;
		case OpenMarkdownLinks.currentGroup:
		default:
			return vscode.ViewColumn.Active;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/util/resourceMap.ts]---
Location: vscode-main/extensions/markdown-language-features/src/util/resourceMap.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

type ResourceToKey = (uri: vscode.Uri) => string;

const defaultResourceToKey = (resource: vscode.Uri): string => resource.toString();

export class ResourceMap<T> {

	private readonly _map = new Map<string, { readonly uri: vscode.Uri; readonly value: T }>();

	private readonly _toKey: ResourceToKey;

	constructor(toKey: ResourceToKey = defaultResourceToKey) {
		this._toKey = toKey;
	}

	public set(uri: vscode.Uri, value: T): this {
		this._map.set(this._toKey(uri), { uri, value });
		return this;
	}

	public get(resource: vscode.Uri): T | undefined {
		return this._map.get(this._toKey(resource))?.value;
	}

	public has(resource: vscode.Uri): boolean {
		return this._map.has(this._toKey(resource));
	}

	public get size(): number {
		return this._map.size;
	}

	public clear(): void {
		this._map.clear();
	}

	public delete(resource: vscode.Uri): boolean {
		return this._map.delete(this._toKey(resource));
	}

	public *values(): IterableIterator<T> {
		for (const entry of this._map.values()) {
			yield entry.value;
		}
	}

	public *keys(): IterableIterator<vscode.Uri> {
		for (const entry of this._map.values()) {
			yield entry.uri;
		}
	}

	public *entries(): IterableIterator<[vscode.Uri, T]> {
		for (const entry of this._map.values()) {
			yield [entry.uri, entry.value];
		}
	}

	public [Symbol.iterator](): IterableIterator<[vscode.Uri, T]> {
		return this.entries();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/util/resources.ts]---
Location: vscode-main/extensions/markdown-language-features/src/util/resources.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export interface WebviewResourceProvider {
	asWebviewUri(resource: vscode.Uri): vscode.Uri;

	readonly cspSource: string;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/util/schemes.ts]---
Location: vscode-main/extensions/markdown-language-features/src/util/schemes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const Schemes = Object.freeze({
	http: 'http',
	https: 'https',
	file: 'file',
	untitled: 'untitled',
	mailto: 'mailto',
	vscode: 'vscode',
	'vscode-insiders': 'vscode-insiders',
	notebookCell: 'vscode-notebook-cell',
});

export function isOfScheme(scheme: string, link: string): boolean {
	return link.toLowerCase().startsWith(scheme + ':');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/util/uriList.ts]---
Location: vscode-main/extensions/markdown-language-features/src/util/uriList.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from './arrays';
import * as vscode from 'vscode';

function splitUriList(str: string): string[] {
	return str.split('\r\n');
}

function parseUriList(str: string): string[] {
	return splitUriList(str)
		.filter(value => !value.startsWith('#')) // Remove comments
		.map(value => value.trim());
}

export class UriList {

	static from(str: string): UriList {
		return new UriList(coalesce(parseUriList(str).map(line => {
			try {
				return { uri: vscode.Uri.parse(line), str: line };
			} catch {
				// Uri parse failure
				return undefined;
			}
		})));
	}

	private constructor(
		public readonly entries: ReadonlyArray<{ readonly uri: vscode.Uri; readonly str: string }>
	) { }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/util/url.ts]---
Location: vscode-main/extensions/markdown-language-features/src/util/url.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

/**
 * Tries to convert an url into a vscode uri and returns undefined if this is not possible.
 * `url` can be absolute or relative.
*/
export function urlToUri(url: string, base: vscode.Uri): vscode.Uri | undefined {
	try {
		// `vscode.Uri.joinPath` cannot be used, since it understands
		// `src` as path, not as relative url. This is problematic for query args.
		const parsedUrl = new URL(url, base.toString());
		const uri = vscode.Uri.parse(parsedUrl.toString());
		return uri;
	} catch (e) {
		// Don't crash if `URL` cannot parse `src`.
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/util/uuid.ts]---
Location: vscode-main/extensions/markdown-language-features/src/util/uuid.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Copied from src/vs/base/common/uuid.ts
 */
export function generateUuid(): string {
	// use `randomUUID` if possible
	if (typeof crypto.randomUUID === 'function') {
		// see https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto
		// > Although crypto is available on all windows, the returned Crypto object only has one
		// > usable feature in insecure contexts: the getRandomValues() method.
		// > In general, you should use this API only in secure contexts.

		return crypto.randomUUID.bind(crypto)();
	}

	// prep-work
	const _data = new Uint8Array(16);
	const _hex: string[] = [];
	for (let i = 0; i < 256; i++) {
		_hex.push(i.toString(16).padStart(2, '0'));
	}

	// get data
	crypto.getRandomValues(_data);

	// set version bits
	_data[6] = (_data[6] & 0x0f) | 0x40;
	_data[8] = (_data[8] & 0x3f) | 0x80;

	// print as string
	let i = 0;
	let result = '';
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += '-';
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += '-';
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += '-';
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += '-';
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/test-workspace/a.md]---
Location: vscode-main/extensions/markdown-language-features/test-workspace/a.md

```markdown
[b](b)

[b.md](b.md)

[./b.md](./b.md)

[/b.md](/b.md) `[/b.md](/b.md)`

[b#header1](b#header1)

```
[b](b)
```

~~~
[b](b)
~~~

    // Indented code
    [b](b)
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/test-workspace/b.md]---
Location: vscode-main/extensions/markdown-language-features/test-workspace/b.md

```markdown
# b

[./a](./a)

# header1
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/test-workspace/sub/c.md]---
Location: vscode-main/extensions/markdown-language-features/test-workspace/sub/c.md

```markdown
# First
# Second

[b](/b.md)
[b](../b.md)
[b](./../b.md)
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/test-workspace/sub/file with space.md]---
Location: vscode-main/extensions/markdown-language-features/test-workspace/sub/file with space.md

```markdown
# Header
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/test-workspace/sub/foo.txt]---
Location: vscode-main/extensions/markdown-language-features/test-workspace/sub/foo.txt

```text
1
2
3
4
5
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/test-workspace/sub with space/file.md]---
Location: vscode-main/extensions/markdown-language-features/test-workspace/sub with space/file.md

```markdown
# header
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/types/previewMessaging.d.ts]---
Location: vscode-main/extensions/markdown-language-features/types/previewMessaging.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

interface BaseMessage {
	readonly source: string;
}

export namespace FromWebviewMessage {

	export interface CacheImageSizes extends BaseMessage {
		readonly type: 'cacheImageSizes';
		readonly imageData: ReadonlyArray<{ id: string; width: number; height: number }>;
	}

	export interface RevealLine extends BaseMessage {
		readonly type: 'revealLine';
		readonly line: number;
	}

	export interface DidClick extends BaseMessage {
		readonly type: 'didClick';
		readonly line: number;
	}

	export interface ClickLink extends BaseMessage {
		readonly type: 'openLink';
		readonly href: string;
	}

	export interface ShowPreviewSecuritySelector extends BaseMessage {
		readonly type: 'showPreviewSecuritySelector';
	}

	export interface PreviewStyleLoadError extends BaseMessage {
		readonly type: 'previewStyleLoadError';
		readonly unloadedStyles: readonly string[];
	}

	export type Type =
		| CacheImageSizes
		| RevealLine
		| DidClick
		| ClickLink
		| ShowPreviewSecuritySelector
		| PreviewStyleLoadError
		;
}

export namespace ToWebviewMessage {
	export interface OnDidChangeTextEditorSelection extends BaseMessage {
		readonly type: 'onDidChangeTextEditorSelection';
		readonly line: number;
	}

	export interface UpdateView extends BaseMessage {
		readonly type: 'updateView';
		readonly line: number;
		readonly source: string;
	}

	export interface UpdateContent extends BaseMessage {
		readonly type: 'updateContent';
		readonly content: string;
	}

	export interface CopyImageContent extends BaseMessage {
		readonly type: 'copyImage';
		readonly source: string;
		readonly id: string;
	}

	export interface OpenImageContent extends BaseMessage {
		readonly type: 'openImage';
		readonly source: string;
		readonly imageSource: string;
	}

	export type Type =
		| OnDidChangeTextEditorSelection
		| UpdateView
		| UpdateContent
		| CopyImageContent
		| OpenImageContent
		;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-math/.gitignore]---
Location: vscode-main/extensions/markdown-math/.gitignore

```text
notebook-out
languageService
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-math/.npmrc]---
Location: vscode-main/extensions/markdown-math/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-math/.vscodeignore]---
Location: vscode-main/extensions/markdown-math/.vscodeignore

```text
src/**
notebook/**
extension-browser.webpack.config.js
extension.webpack.config.js
esbuild.*
cgmanifest.json
package-lock.json
webpack.config.js
tsconfig.json
.gitignore
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-math/cgmanifest.json]---
Location: vscode-main/extensions/markdown-math/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "James-Yu/LaTeX-Workshop",
					"repositoryUrl": "https://github.com/James-Yu/LaTeX-Workshop",
					"commitHash": "e4cd86f1731546c2cdde0cc93717ca3fec2da0ba"
				}
			},
			"license": "MIT",
			"version": "8.19.1"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-math/esbuild.mjs]---
Location: vscode-main/extensions/markdown-math/esbuild.mjs

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
//@ts-check

import path from 'path';
import fse from 'fs-extra';
import { run } from '../esbuild-webview-common.mjs';

const args = process.argv.slice(2);

const srcDir = path.join(import.meta.dirname, 'notebook');
const outDir = path.join(import.meta.dirname, 'notebook-out');

function postBuild(outDir) {
	fse.copySync(
		path.join(import.meta.dirname, 'node_modules', 'katex', 'dist', 'katex.min.css'),
		path.join(outDir, 'katex.min.css'));

	const fontsDir = path.join(import.meta.dirname, 'node_modules', 'katex', 'dist', 'fonts');
	const fontsOutDir = path.join(outDir, 'fonts/');

	fse.mkdirSync(fontsOutDir, { recursive: true });

	for (const file of fse.readdirSync(fontsDir)) {
		if (file.endsWith('.woff2')) {
			fse.copyFileSync(path.join(fontsDir, file), path.join(fontsOutDir, file));
		}
	}
}

run({
	entryPoints: [
		path.join(srcDir, 'katex.ts'),
	],
	srcDir,
	outdir: outDir,
}, process.argv, postBuild);
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-math/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/markdown-math/extension-browser.webpack.config.js

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
		extension: './src/extension.ts'
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-math/extension.webpack.config.js]---
Location: vscode-main/extensions/markdown-math/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults from '../shared.webpack.config.mjs';

export default withDefaults({
	context: import.meta.dirname,
	resolve: {
		mainFields: ['module', 'main']
	},
	entry: {
		extension: './src/extension.ts',
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-math/package-lock.json]---
Location: vscode-main/extensions/markdown-math/package-lock.json

```json
{
  "name": "markdown-math",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "markdown-math",
      "version": "1.0.0",
      "license": "MIT",
      "dependencies": {
        "@vscode/markdown-it-katex": "^1.1.2"
      },
      "devDependencies": {
        "@types/markdown-it": "^0.0.0",
        "@types/vscode-notebook-renderer": "^1.60.0"
      },
      "engines": {
        "vscode": "^1.54.0"
      }
    },
    "node_modules/@types/markdown-it": {
      "version": "0.0.0",
      "resolved": "https://registry.npmjs.org/@types/markdown-it/-/markdown-it-0.0.0.tgz",
      "integrity": "sha512-rLEOTm6Wi9M8GFnIK7VczXSEThIN/eVoevpTYVk+FD/DPX3N15Sj9b3vkjjDY63U0Zw1yawf13CI92CCHpC5kw==",
      "dev": true
    },
    "node_modules/@types/vscode-notebook-renderer": {
      "version": "1.72.0",
      "resolved": "https://registry.npmjs.org/@types/vscode-notebook-renderer/-/vscode-notebook-renderer-1.72.0.tgz",
      "integrity": "sha512-5iTjb39DpLn03ULUwrDR3L2Dy59RV4blSUHy0oLdQuIY11PhgWO4mXIcoFS0VxY1GZQ4IcjSf3ooT2Jrrcahnw==",
      "dev": true
    },
    "node_modules/@vscode/markdown-it-katex": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/@vscode/markdown-it-katex/-/markdown-it-katex-1.1.2.tgz",
      "integrity": "sha512-+4IIv5PgrmhKvW/3LpkpkGg257OViEhXkOOgCyj5KMsjsOfnRXkni8XAuuF9Ui5p3B8WnUovlDXAQNb8RJ/RaQ==",
      "license": "MIT",
      "dependencies": {
        "katex": "^0.16.4"
      }
    },
    "node_modules/commander": {
      "version": "8.3.0",
      "resolved": "https://registry.npmjs.org/commander/-/commander-8.3.0.tgz",
      "integrity": "sha512-OkTL9umf+He2DZkUq8f8J9of7yL6RJKI24dVITBmNfZBmri9zYZQrKkuXiKhyfPSu8tUhnVBB1iKXevvnlR4Ww==",
      "license": "MIT",
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/katex": {
      "version": "0.16.21",
      "resolved": "https://registry.npmjs.org/katex/-/katex-0.16.21.tgz",
      "integrity": "sha512-XvqR7FgOHtWupfMiigNzmh+MgUVmDGU2kXZm899ZkPfcuoPuFxyHmXsgATDpFZDAXCI8tvinaVcDo8PIIJSo4A==",
      "funding": [
        "https://opencollective.com/katex",
        "https://github.com/sponsors/katex"
      ],
      "license": "MIT",
      "dependencies": {
        "commander": "^8.3.0"
      },
      "bin": {
        "katex": "cli.js"
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-math/package.json]---
Location: vscode-main/extensions/markdown-math/package.json

```json
{
  "name": "markdown-math",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "icon": "icon.png",
  "publisher": "vscode",
  "license": "MIT",
  "aiKey": "0c6ae279ed8443289764825290e4f9e2-1a736e7c-1324-4338-be46-fc2a58ae4d14-7255",
  "engines": {
    "vscode": "^1.54.0"
  },
  "categories": [
    "Other",
    "Programming Languages"
  ],
  "capabilities": {
    "virtualWorkspaces": true,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "main": "./out/extension",
  "browser": "./dist/browser/extension",
  "activationEvents": [],
  "contributes": {
    "languages": [
      {
        "id": "markdown-math",
        "aliases": []
      }
    ],
    "grammars": [
      {
        "language": "markdown-math",
        "scopeName": "text.html.markdown.math",
        "path": "./syntaxes/md-math.tmLanguage.json"
      },
      {
        "scopeName": "markdown.math.block",
        "path": "./syntaxes/md-math-block.tmLanguage.json",
        "injectTo": [
          "text.html.markdown"
        ],
        "embeddedLanguages": {
          "meta.embedded.math.markdown": "latex"
        }
      },
      {
        "scopeName": "markdown.math.inline",
        "path": "./syntaxes/md-math-inline.tmLanguage.json",
        "injectTo": [
          "text.html.markdown"
        ],
        "embeddedLanguages": {
          "meta.embedded.math.markdown": "latex",
          "punctuation.definition.math.end.markdown": "latex"
        }
      },
      {
        "scopeName": "markdown.math.codeblock",
        "path": "./syntaxes/md-math-fence.tmLanguage.json",
        "injectTo": [
          "text.html.markdown"
        ],
        "embeddedLanguages": {
          "meta.embedded.math.markdown": "latex"
        }
      }
    ],
    "notebookRenderer": [
      {
        "id": "vscode.markdown-it-katex-extension",
        "displayName": "Markdown it KaTeX renderer",
        "entrypoint": {
          "extends": "vscode.markdown-it-renderer",
          "path": "./notebook-out/katex.js"
        }
      }
    ],
    "markdown.markdownItPlugins": true,
    "markdown.previewStyles": [
      "./notebook-out/katex.min.css",
      "./preview-styles/index.css"
    ],
    "configuration": [
      {
        "title": "Markdown Math",
        "properties": {
          "markdown.math.enabled": {
            "type": "boolean",
            "default": true,
            "description": "%config.markdown.math.enabled%"
          },
          "markdown.math.macros": {
            "type": "object",
            "additionalProperties": {
              "type": "string"
            },
            "default": {},
            "description": "%config.markdown.math.macros%",
            "scope": "resource"
          }
        }
      }
    ]
  },
  "scripts": {
    "compile": "npm run build-notebook",
    "watch": "npm run build-notebook",
    "build-notebook": "node ./esbuild.mjs"
  },
  "devDependencies": {
    "@types/markdown-it": "^0.0.0",
    "@types/vscode-notebook-renderer": "^1.60.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  },
  "dependencies": {
    "@vscode/markdown-it-katex": "^1.1.2"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-math/package.nls.json]---
Location: vscode-main/extensions/markdown-math/package.nls.json

```json
{
	"displayName": "Markdown Math",
	"description": "Adds math support to Markdown in notebooks.",
	"config.markdown.math.enabled": "Enable/disable rendering math in the built-in Markdown preview.",
	"config.markdown.math.macros": "A collection of custom macros. Each macro is a key-value pair where the key is a new command name and the value is the expansion of the macro."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-math/README.md]---
Location: vscode-main/extensions/markdown-math/README.md

```markdown
# Markdown Math

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

Adds math rendering using [KaTeX](https://katex.org) to VS Code's built-in markdown preview and markdown cells in notebooks.
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-math/tsconfig.json]---
Location: vscode-main/extensions/markdown-math/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"types": [],
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

---[FILE: extensions/markdown-math/notebook/katex.ts]---
Location: vscode-main/extensions/markdown-math/notebook/katex.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import type * as markdownIt from 'markdown-it';
import type { RendererContext } from 'vscode-notebook-renderer';

const styleHref = import.meta.url.replace(/katex.js$/, 'katex.min.css');

export async function activate(ctx: RendererContext<void>) {
	const markdownItRenderer = (await ctx.getRenderer('vscode.markdown-it-renderer')) as undefined | any;
	if (!markdownItRenderer) {
		throw new Error(`Could not load 'vscode.markdown-it-renderer'`);
	}

	// Add katex styles to be copied to shadow dom
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.classList.add('markdown-style');
	link.href = styleHref;

	// Add same katex style to root document.
	// This is needed for the font to be loaded correctly inside the shadow dom.
	//
	// Seems like https://bugs.chromium.org/p/chromium/issues/detail?id=336876
	const linkHead = document.createElement('link');
	linkHead.rel = 'stylesheet';
	linkHead.href = styleHref;
	document.head.appendChild(linkHead);

	const style = document.createElement('style');
	style.textContent = `
		.katex-error {
			color: var(--vscode-editorError-foreground);
		}
		.katex-block {
			counter-reset: katexEqnNo mmlEqnNo;
		}
	`;

	// Put Everything into a template
	const styleTemplate = document.createElement('template');
	styleTemplate.classList.add('markdown-style');
	styleTemplate.content.appendChild(style);
	styleTemplate.content.appendChild(link);
	document.head.appendChild(styleTemplate);

	const katex = require('@vscode/markdown-it-katex').default;
	const macros = {};
	markdownItRenderer.extendMarkdownIt((md: markdownIt.MarkdownIt) => {
		return md.use(katex, {
			globalGroup: true,
			enableBareBlocks: true,
			enableFencedBlocks: true,
			macros,
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-math/notebook/tsconfig.json]---
Location: vscode-main/extensions/markdown-math/notebook/tsconfig.json

```json
{
	"extends": "../../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./dist/",
		"jsx": "react",
		"module": "es2020",
		"lib": [
			"ES2024",
			"DOM",
			"DOM.Iterable"
		],
		"types": [
			"node"
		],
		"typeRoots": [
			"../node_modules/@types"
		]
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-math/preview-styles/index.css]---
Location: vscode-main/extensions/markdown-math/preview-styles/index.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.katex-error {
	color: var(--vscode-editorError-foreground);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-math/src/extension.ts]---
Location: vscode-main/extensions/markdown-math/src/extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as vscode from 'vscode';

declare function require(path: string): any;

const markdownMathSetting = 'markdown.math';

export function activate(context: vscode.ExtensionContext) {
	function isEnabled(): boolean {
		const config = vscode.workspace.getConfiguration('markdown');
		return config.get<boolean>('math.enabled', true);
	}

	function getMacros(): { [key: string]: string } {
		const config = vscode.workspace.getConfiguration('markdown');
		return config.get<{ [key: string]: string }>('math.macros', {});
	}

	vscode.workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration(markdownMathSetting)) {
			vscode.commands.executeCommand('markdown.api.reloadPlugins');
		}
	}, undefined, context.subscriptions);

	return {
		extendMarkdownIt(md: any) {
			if (isEnabled()) {
				const katex = require('@vscode/markdown-it-katex').default;
				const settingsMacros = getMacros();
				const options = {
					enableFencedBlocks: true,
					globalGroup: true,
					macros: { ...settingsMacros }
				};
				md.core.ruler.push('reset-katex-macros', () => {
					options.macros = { ...settingsMacros };
				});
				return md.use(katex, options);
			}
			return md;
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-math/syntaxes/md-math-block.tmLanguage.json]---
Location: vscode-main/extensions/markdown-math/syntaxes/md-math-block.tmLanguage.json

```json
{
	"fileTypes": [],
	"injectionSelector": "L:text.html.markdown - (comment, string, meta.paragraph.markdown, markup.math.block.markdown, markup.fenced_code.block.markdown, markup.raw.block.markdown)",
	"patterns": [
		{
			"include": "#double_dollar_math_block"
		},
		{
			"include": "#single_dollar_math_block"
		}
	],
	"repository": {
		"double_dollar_math_block": {
			"name": "markup.math.block.markdown",
			"contentName": "meta.embedded.math.markdown",
			"begin": "(?<=^\\s*)(\\${2})(?![^$]*\\${2})",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.math.begin.markdown"
				}
			},
			"end": "(.*)(\\${2})",
			"endCaptures": {
				"1": {
					"name": "meta.embedded.math.markdown",
					"patterns": [
						{
							"include": "text.html.markdown.math#math"
						}
					]
				},
				"2": {
					"name": "punctuation.definition.math.end.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)",
					"while": "(^|\\G)(?!.*(\\${2}))",
					"patterns": [
						{
							"include": "text.html.markdown.math#math"
						}
					]
				}
			]
		},
		"single_dollar_math_block": {
			"name": "markup.math.block.markdown",
			"contentName": "meta.embedded.math.markdown",
			"begin": "(?<=^\\s*)(\\$)(?![^$]*\\$|\\d)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.math.begin.markdown"
				}
			},
			"end": "(.*)(\\${1})",
			"endCaptures": {
				"1": {
					"name": "meta.embedded.math.markdown",
					"patterns": [
						{
							"include": "text.html.markdown.math#math"
						}
					]
				},
				"2": {
					"name": "punctuation.definition.math.end.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)",
					"while": "(^|\\G)(?!.*(\\${1}))",
					"patterns": [
						{
							"include": "text.html.markdown.math#math"
						}
					]
				}
			]
		}
	},
	"scopeName": "markdown.math.block"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-math/syntaxes/md-math-fence.tmLanguage.json]---
Location: vscode-main/extensions/markdown-math/syntaxes/md-math-fence.tmLanguage.json

```json
{
    "fileTypes": [],
    "injectionSelector": "L:markup.fenced_code.block.markdown",
    "patterns": [
        {
            "include": "#math-code-block"
        }
    ],
    "repository": {
        "math-code-block": {
            "begin": "(?<=[`~])math(\\s+[^`~]*)?$",
            "end": "(^|\\G)(?=\\s*[`~]{3,}\\s*$)",
            "patterns": [
                {
                    "begin": "(^|\\G)(\\s*)(.*)",
                    "while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
                    "contentName": "meta.embedded.math.markdown",
                    "patterns": [
                        {
                            "include": "text.html.markdown.math#math"
                        }
                    ]
                }
            ]
        }
    },
    "scopeName": "markdown.math.codeblock"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-math/syntaxes/md-math-inline.tmLanguage.json]---
Location: vscode-main/extensions/markdown-math/syntaxes/md-math-inline.tmLanguage.json

```json
{
	"fileTypes": [],
	"injectionSelector": "L:meta.paragraph.markdown - (comment, string, markup.math.inline.markdown, markup.fenced_code.block.markdown)",
	"patterns": [
		{
			"include": "#math_inline_double"
		},
		{
			"include": "#math_inline_single"
		},
		{
			"include": "#math_inline_block"
		}
	],
	"repository": {
		"math_inline_single": {
			"name": "markup.math.inline.markdown",
			"match": "(?<=\\s|\\W|^)(?<!\\$)(\\$)(.+?)(\\$)(?!\\$)(?=\\s|\\W|$)",
			"captures": {
				"1": {
					"name": "punctuation.definition.math.begin.markdown"
				},
				"2": {
					"name": "meta.embedded.math.markdown",
					"patterns": [
						{
							"include": "text.html.markdown.math#math"
						}
					]
				},
				"3": {
					"name": "punctuation.definition.math.end.markdown"
				}
			}
		},
		"math_inline_double": {
			"name": "markup.math.inline.markdown",
			"match": "(?<=\\s|\\W|^)(?<!\\$)(\\$\\$)(.+?)(\\$\\$)(?!\\$)(?=\\s|\\W|$)",
			"captures": {
				"1": {
					"name": "punctuation.definition.math.begin.markdown"
				},
				"2": {
					"name": "meta.embedded.math.markdown",
					"patterns": [
						{
							"include": "text.html.markdown.math#math"
						}
					]
				},
				"3": {
					"name": "punctuation.definition.math.end.markdown"
				}
			}
		},
		"math_inline_block": {
			"name": "markup.math.inline.markdown",
			"contentName": "meta.embedded.math.markdown",
			"begin": "(?<=\\s|^)(\\${2})",
			"beginCaptures": {
				"2": {
					"name": "punctuation.definition.math.begin.markdown"
				}
			},
			"end": "(\\${2})(?=\\s|$)",
			"endCaptures": {
				"2": {
					"name": "punctuation.definition.math.end.markdown"
				}
			},
			"patterns": [
				{
					"include": "text.html.markdown.math#math"
				}
			]
		}
	},
	"scopeName": "markdown.math.inline"
}
```

--------------------------------------------------------------------------------

````
