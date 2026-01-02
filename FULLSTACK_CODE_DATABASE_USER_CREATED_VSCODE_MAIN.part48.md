---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 48
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 48 of 552)

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

---[FILE: extensions/ipynb/src/deserializers.ts]---
Location: vscode-main/extensions/ipynb/src/deserializers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as nbformat from '@jupyterlab/nbformat';
import { extensions, NotebookCellData, NotebookCellExecutionSummary, NotebookCellKind, NotebookCellOutput, NotebookCellOutputItem, NotebookData } from 'vscode';
import { CellMetadata, CellOutputMetadata } from './common';
import { textMimeTypes } from './constants';

const jupyterLanguageToMonacoLanguageMapping = new Map([
	['c#', 'csharp'],
	['f#', 'fsharp'],
	['q#', 'qsharp'],
	['c++11', 'c++'],
	['c++12', 'c++'],
	['c++14', 'c++']
]);

export function getPreferredLanguage(metadata?: nbformat.INotebookMetadata) {
	const jupyterLanguage =
		metadata?.language_info?.name ||
		(metadata?.kernelspec as unknown as { language: string })?.language;

	// Default to python language only if the Python extension is installed.
	const defaultLanguage =
		extensions.getExtension('ms-python.python')
			? 'python'
			: (extensions.getExtension('ms-dotnettools.dotnet-interactive-vscode') ? 'csharp' : 'python');

	// Note, whatever language is returned here, when the user selects a kernel, the cells (of blank documents) get updated based on that kernel selection.
	return translateKernelLanguageToMonaco(jupyterLanguage || defaultLanguage);
}

function translateKernelLanguageToMonaco(language: string): string {
	language = language.toLowerCase();
	if (language.length === 2 && language.endsWith('#')) {
		return `${language.substring(0, 1)}sharp`;
	}
	return jupyterLanguageToMonacoLanguageMapping.get(language) || language;
}

const orderOfMimeTypes = [
	'application/vnd.*',
	'application/vdom.*',
	'application/geo+json',
	'application/x-nteract-model-debug+json',
	'text/html',
	'application/javascript',
	'image/gif',
	'text/latex',
	'text/markdown',
	'image/png',
	'image/svg+xml',
	'image/jpeg',
	'application/json',
	'text/plain'
];

function isEmptyVendoredMimeType(outputItem: NotebookCellOutputItem) {
	if (outputItem.mime.startsWith('application/vnd.')) {
		try {
			return outputItem.data.byteLength === 0 || Buffer.from(outputItem.data).toString().length === 0;
		} catch { }
	}
	return false;
}
function isMimeTypeMatch(value: string, compareWith: string) {
	if (value.endsWith('.*')) {
		value = value.substr(0, value.indexOf('.*'));
	}
	return compareWith.startsWith(value);
}

function sortOutputItemsBasedOnDisplayOrder(outputItems: NotebookCellOutputItem[]): NotebookCellOutputItem[] {
	return outputItems
		.map(item => {
			let index = orderOfMimeTypes.findIndex((mime) => isMimeTypeMatch(mime, item.mime));
			// Sometimes we can have mime types with empty data, e.g. when using holoview we can have `application/vnd.holoviews_load.v0+json` with empty value.
			// & in these cases we have HTML/JS and those take precedence.
			// https://github.com/microsoft/vscode-jupyter/issues/6109
			if (isEmptyVendoredMimeType(item)) {
				index = -1;
			}
			index = index === -1 ? 100 : index;
			return {
				item, index
			};
		})
		.sort((outputItemA, outputItemB) => outputItemA.index - outputItemB.index).map(item => item.item);
}

/**
 * Concatenates a multiline string or an array of strings into a single string.
 * Also normalizes line endings to use LF (`\n`) instead of CRLF (`\r\n`).
 * Same is done in serializer as well.
 */
function concatMultilineCellSource(source: string | string[]): string {
	return concatMultilineString(source).replace(/\r\n/g, '\n');
}

function concatMultilineString(str: string | string[]): string {
	if (Array.isArray(str)) {
		let result = '';
		for (let i = 0; i < str.length; i += 1) {
			const s = str[i];
			if (i < str.length - 1 && !s.endsWith('\n')) {
				result = result.concat(`${s}\n`);
			} else {
				result = result.concat(s);
			}
		}

		return result;
	}
	return str.toString();
}

function convertJupyterOutputToBuffer(mime: string, value: unknown): NotebookCellOutputItem {
	if (!value) {
		return NotebookCellOutputItem.text('', mime);
	}
	try {
		if (
			(mime.startsWith('text/') || textMimeTypes.includes(mime)) &&
			(Array.isArray(value) || typeof value === 'string')
		) {
			const stringValue = Array.isArray(value) ? concatMultilineString(value) : value;
			return NotebookCellOutputItem.text(stringValue, mime);
		} else if (mime.startsWith('image/') && typeof value === 'string' && mime !== 'image/svg+xml') {
			// Images in Jupyter are stored in base64 encoded format.
			// VS Code expects bytes when rendering images.
			if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
				return new NotebookCellOutputItem(Buffer.from(value, 'base64'), mime);
			} else {
				const data = Uint8Array.from(atob(value), c => c.charCodeAt(0));
				return new NotebookCellOutputItem(data, mime);
			}
		} else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
			return NotebookCellOutputItem.text(JSON.stringify(value), mime);
		} else if (mime === 'application/json') {
			return NotebookCellOutputItem.json(value, mime);
		} else {
			// For everything else, treat the data as strings (or multi-line strings).
			value = Array.isArray(value) ? concatMultilineString(value) : value;
			return NotebookCellOutputItem.text(value as string, mime);
		}
	} catch (ex) {
		return NotebookCellOutputItem.error(ex);
	}
}

function getNotebookCellMetadata(cell: nbformat.ICell): {
	[key: string]: any;
} {
	// We put this only for VSC to display in diff view.
	// Else we don't use this.
	const cellMetadata: CellMetadata = {};
	if (cell.cell_type === 'code') {
		if (typeof cell['execution_count'] === 'number') {
			cellMetadata.execution_count = cell['execution_count'];
		} else {
			cellMetadata.execution_count = null;
		}
	}

	if (cell['metadata']) {
		cellMetadata['metadata'] = JSON.parse(JSON.stringify(cell['metadata']));
	}

	if (typeof cell.id === 'string') {
		cellMetadata.id = cell.id;
	}

	if (cell['attachments']) {
		cellMetadata.attachments = JSON.parse(JSON.stringify(cell['attachments']));
	}
	return cellMetadata;
}

function getOutputMetadata(output: nbformat.IOutput): CellOutputMetadata {
	// Add on transient data if we have any. This should be removed by our save functions elsewhere.
	const metadata: CellOutputMetadata = {
		outputType: output.output_type
	};
	if (output.transient) {
		metadata.transient = output.transient;
	}

	switch (output.output_type as nbformat.OutputType) {
		case 'display_data':
		case 'execute_result':
		case 'update_display_data': {
			metadata.executionCount = output.execution_count;
			metadata.metadata = output.metadata ? JSON.parse(JSON.stringify(output.metadata)) : {};
			break;
		}
		default:
			break;
	}

	return metadata;
}


function translateDisplayDataOutput(
	output: nbformat.IDisplayData | nbformat.IDisplayUpdate | nbformat.IExecuteResult
): NotebookCellOutput {
	// Metadata could be as follows:
	// We'll have metadata specific to each mime type as well as generic metadata.
	/*
	IDisplayData = {
		output_type: 'display_data',
		data: {
			'image/jpg': '/////'
			'image/png': '/////'
			'text/plain': '/////'
		},
		metadata: {
			'image/png': '/////',
			'background': true,
			'xyz': '///
		}
	}
	*/
	const metadata = getOutputMetadata(output);
	const items: NotebookCellOutputItem[] = [];
	if (output.data) {
		for (const key in output.data) {
			items.push(convertJupyterOutputToBuffer(key, output.data[key]));
		}
	}

	return new NotebookCellOutput(sortOutputItemsBasedOnDisplayOrder(items), metadata);
}

function translateErrorOutput(output?: nbformat.IError): NotebookCellOutput {
	output = output || { output_type: 'error', ename: '', evalue: '', traceback: [] };
	return new NotebookCellOutput(
		[
			NotebookCellOutputItem.error({
				name: output?.ename || '',
				message: output?.evalue || '',
				stack: (output?.traceback || []).join('\n')
			})
		],
		{ ...getOutputMetadata(output), originalError: output }
	);
}

function translateStreamOutput(output: nbformat.IStream): NotebookCellOutput {
	const value = concatMultilineString(output.text);
	const item = output.name === 'stderr' ? NotebookCellOutputItem.stderr(value) : NotebookCellOutputItem.stdout(value);
	return new NotebookCellOutput([item], getOutputMetadata(output));
}

const cellOutputMappers = new Map<nbformat.OutputType, (output: any) => NotebookCellOutput>();
cellOutputMappers.set('display_data', translateDisplayDataOutput);
cellOutputMappers.set('execute_result', translateDisplayDataOutput);
cellOutputMappers.set('update_display_data', translateDisplayDataOutput);
cellOutputMappers.set('error', translateErrorOutput);
cellOutputMappers.set('stream', translateStreamOutput);

export function jupyterCellOutputToCellOutput(output: nbformat.IOutput): NotebookCellOutput {
	/**
	 * Stream, `application/x.notebook.stream`
	 * Error, `application/x.notebook.error-traceback`
	 * Rich, { mime: value }
	 *
	 * outputs: [
			new vscode.NotebookCellOutput([
				new vscode.NotebookCellOutputItem('application/x.notebook.stream', 2),
				new vscode.NotebookCellOutputItem('application/x.notebook.stream', 3),
			]),
			new vscode.NotebookCellOutput([
				new vscode.NotebookCellOutputItem('text/markdown', '## header 2'),
				new vscode.NotebookCellOutputItem('image/svg+xml', [
					"<svg baseProfile=\"full\" height=\"200\" version=\"1.1\" width=\"300\" xmlns=\"http://www.w3.org/2000/svg\">\n",
					"  <rect fill=\"blue\" height=\"100%\" width=\"100%\"/>\n",
					"  <circle cx=\"150\" cy=\"100\" fill=\"green\" r=\"80\"/>\n",
					"  <text fill=\"white\" font-size=\"60\" text-anchor=\"middle\" x=\"150\" y=\"125\">SVG</text>\n",
					"</svg>"
					]),
			]),
		]
	 *
	 */
	const fn = cellOutputMappers.get(output.output_type as nbformat.OutputType);
	let result: NotebookCellOutput;
	if (fn) {
		result = fn(output);
	} else {
		result = translateDisplayDataOutput(output as unknown as nbformat.IDisplayData | nbformat.IDisplayUpdate | nbformat.IExecuteResult);
	}
	return result;
}

function createNotebookCellDataFromRawCell(cell: nbformat.IRawCell): NotebookCellData {
	const cellData = new NotebookCellData(NotebookCellKind.Code, concatMultilineCellSource(cell.source), 'raw');
	cellData.outputs = [];
	cellData.metadata = getNotebookCellMetadata(cell);
	return cellData;
}
function createNotebookCellDataFromMarkdownCell(cell: nbformat.IMarkdownCell): NotebookCellData {
	const cellData = new NotebookCellData(
		NotebookCellKind.Markup,
		concatMultilineCellSource(cell.source),
		'markdown'
	);
	cellData.outputs = [];
	cellData.metadata = getNotebookCellMetadata(cell);
	return cellData;
}
function createNotebookCellDataFromCodeCell(cell: nbformat.ICodeCell, cellLanguage: string): NotebookCellData {
	const cellOutputs = Array.isArray(cell.outputs) ? cell.outputs : [];
	const outputs = cellOutputs.map(jupyterCellOutputToCellOutput);
	const hasExecutionCount = typeof cell.execution_count === 'number' && cell.execution_count > 0;

	const source = concatMultilineCellSource(cell.source);

	const executionSummary: NotebookCellExecutionSummary = hasExecutionCount
		? { executionOrder: cell.execution_count as number }
		: {};

	const vscodeCustomMetadata = cell.metadata?.['vscode'] as { [key: string]: any } | undefined;
	const cellLanguageId = vscodeCustomMetadata && vscodeCustomMetadata.languageId && typeof vscodeCustomMetadata.languageId === 'string' ? vscodeCustomMetadata.languageId : cellLanguage;
	const cellData = new NotebookCellData(NotebookCellKind.Code, source, cellLanguageId);

	cellData.outputs = outputs;
	cellData.metadata = getNotebookCellMetadata(cell);
	cellData.executionSummary = executionSummary;
	return cellData;
}

function createNotebookCellDataFromJupyterCell(
	cellLanguage: string,
	cell: nbformat.IBaseCell
): NotebookCellData | undefined {
	switch (cell.cell_type) {
		case 'raw': {
			return createNotebookCellDataFromRawCell(cell as nbformat.IRawCell);
		}
		case 'markdown': {
			return createNotebookCellDataFromMarkdownCell(cell as nbformat.IMarkdownCell);
		}
		case 'code': {
			return createNotebookCellDataFromCodeCell(cell as nbformat.ICodeCell, cellLanguage);
		}
	}

	return;
}

/**
 * Converts a NotebookModel into VS Code format.
 */
export function jupyterNotebookModelToNotebookData(
	notebookContent: Partial<nbformat.INotebookContent>,
	preferredLanguage: string
): NotebookData {
	const notebookContentWithoutCells = { ...notebookContent, cells: [] };
	if (!Array.isArray(notebookContent.cells)) {
		throw new Error('Notebook content is missing cells');
	}

	const cells = notebookContent.cells
		.map(cell => createNotebookCellDataFromJupyterCell(preferredLanguage, cell))
		.filter((item): item is NotebookCellData => !!item);

	const notebookData = new NotebookData(cells);
	notebookData.metadata = notebookContentWithoutCells;
	return notebookData;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/helper.ts]---
Location: vscode-main/extensions/ipynb/src/helper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationError } from 'vscode';

export function deepClone<T>(obj: T): T {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}
	if (obj instanceof RegExp) {
		// See https://github.com/microsoft/TypeScript/issues/10990
		return obj;
	}
	if (Array.isArray(obj)) {
		return obj.map(item => deepClone(item)) as unknown as T;
	}
	const result = {};
	for (const key of Object.keys(obj as object) as Array<keyof T>) {
		const value = obj[key];
		if (value && typeof value === 'object') {
			(result as T)[key] = deepClone(value);
		} else {
			(result as T)[key] = value;
		}
	}
	return result as T;
}

// from https://github.com/microsoft/vscode/blob/43ae27a30e7b5e8711bf6b218ee39872ed2b8ef6/src/vs/base/common/objects.ts#L117
export function objectEquals(one: any, other: any) {
	if (one === other) {
		return true;
	}
	if (one === null || one === undefined || other === null || other === undefined) {
		return false;
	}
	if (typeof one !== typeof other) {
		return false;
	}
	if (typeof one !== 'object') {
		return false;
	}
	if ((Array.isArray(one)) !== (Array.isArray(other))) {
		return false;
	}

	let i: number;
	let key: string;

	if (Array.isArray(one)) {
		if (one.length !== other.length) {
			return false;
		}
		for (i = 0; i < one.length; i++) {
			if (!objectEquals(one[i], other[i])) {
				return false;
			}
		}
	} else {
		const oneKeys: string[] = [];

		for (key in one) {
			oneKeys.push(key);
		}
		oneKeys.sort();
		const otherKeys: string[] = [];
		for (key in other) {
			otherKeys.push(key);
		}
		otherKeys.sort();
		if (!objectEquals(oneKeys, otherKeys)) {
			return false;
		}
		for (i = 0; i < oneKeys.length; i++) {
			if (!objectEquals(one[oneKeys[i]], other[oneKeys[i]])) {
				return false;
			}
		}
	}

	return true;
}

/**
 * A helper to delay/debounce execution of a task, includes cancellation/disposal support.
 * Pulled from https://github.com/microsoft/vscode/blob/3059063b805ed0ac10a6d9539e213386bfcfb852/extensions/markdown-language-features/src/util/async.ts
 */
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
				const result = this._task && this._task?.();
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

export interface ITask<T> {
	(): T;
}


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

export type ValueCallback<T = unknown> = (value: T | Promise<T>) => void;

const enum DeferredOutcome {
	Resolved,
	Rejected
}


/**
 * Creates a promise whose resolution or rejection can be controlled imperatively.
 */
export class DeferredPromise<T> {

	private completeCallback!: ValueCallback<T>;
	private errorCallback!: (err: unknown) => void;
	private outcome?: { outcome: DeferredOutcome.Rejected; value: any } | { outcome: DeferredOutcome.Resolved; value: T };

	public get isRejected() {
		return this.outcome?.outcome === DeferredOutcome.Rejected;
	}

	public get isResolved() {
		return this.outcome?.outcome === DeferredOutcome.Resolved;
	}

	public get isSettled() {
		return !!this.outcome;
	}

	public get value() {
		return this.outcome?.outcome === DeferredOutcome.Resolved ? this.outcome?.value : undefined;
	}

	public readonly p: Promise<T>;

	constructor() {
		this.p = new Promise<T>((c, e) => {
			this.completeCallback = c;
			this.errorCallback = e;
		});
	}

	public complete(value: T) {
		return new Promise<void>(resolve => {
			this.completeCallback(value);
			this.outcome = { outcome: DeferredOutcome.Resolved, value };
			resolve();
		});
	}

	public error(err: unknown) {
		return new Promise<void>(resolve => {
			this.errorCallback(err);
			this.outcome = { outcome: DeferredOutcome.Rejected, value: err };
			resolve();
		});
	}

	public cancel() {
		return this.error(new CancellationError());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/ipynbMain.browser.ts]---
Location: vscode-main/extensions/ipynb/src/ipynbMain.browser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as main from './ipynbMain';
import { NotebookSerializer } from './notebookSerializer.web';

export function activate(context: vscode.ExtensionContext) {
	return main.activate(context, new NotebookSerializer(context));
}

export function deactivate() {
	return main.deactivate();
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/ipynbMain.node.ts]---
Location: vscode-main/extensions/ipynb/src/ipynbMain.node.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as main from './ipynbMain';
import { NotebookSerializer } from './notebookSerializer.node';

export function activate(context: vscode.ExtensionContext) {
	return main.activate(context, new NotebookSerializer(context));
}

export function deactivate() {
	return main.deactivate();
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/ipynbMain.ts]---
Location: vscode-main/extensions/ipynb/src/ipynbMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { activate as keepNotebookModelStoreInSync } from './notebookModelStoreSync';
import { notebookImagePasteSetup } from './notebookImagePaste';
import { AttachmentCleaner } from './notebookAttachmentCleaner';
import { serializeNotebookToString } from './serializers';
import { defaultNotebookFormat } from './constants';

// From {nbformat.INotebookMetadata} in @jupyterlab/coreutils
type NotebookMetadata = {
	kernelspec?: {
		name: string;
		display_name: string;
		[propName: string]: unknown;
	};
	language_info?: {
		name: string;
		codemirror_mode?: string | {};
		file_extension?: string;
		mimetype?: string;
		pygments_lexer?: string;
		[propName: string]: unknown;
	};
	orig_nbformat?: number;
	[propName: string]: unknown;
};

type OptionsWithCellContentMetadata = vscode.NotebookDocumentContentOptions & { cellContentMetadata: { attachments: boolean } };


export function activate(context: vscode.ExtensionContext, serializer: vscode.NotebookSerializer) {
	keepNotebookModelStoreInSync(context);
	const notebookSerializerOptions: OptionsWithCellContentMetadata = {
		transientOutputs: false,
		transientDocumentMetadata: {
			cells: true,
			indentAmount: true
		},
		transientCellMetadata: {
			breakpointMargin: true,
			id: false,
			metadata: false,
			attachments: false
		},
		cellContentMetadata: {
			attachments: true
		}
	};
	context.subscriptions.push(vscode.workspace.registerNotebookSerializer('jupyter-notebook', serializer, notebookSerializerOptions));

	const interactiveSerializeOptions: OptionsWithCellContentMetadata = {
		transientOutputs: false,
		transientCellMetadata: {
			breakpointMargin: true,
			id: false,
			metadata: false,
			attachments: false
		},
		cellContentMetadata: {
			attachments: true
		}
	};
	context.subscriptions.push(vscode.workspace.registerNotebookSerializer('interactive', serializer, interactiveSerializeOptions));

	vscode.languages.registerCodeLensProvider({ pattern: '**/*.ipynb' }, {
		provideCodeLenses: (document) => {
			if (
				document.uri.scheme === 'vscode-notebook-cell' ||
				document.uri.scheme === 'vscode-notebook-cell-metadata' ||
				document.uri.scheme === 'vscode-notebook-cell-output'
			) {
				return [];
			}
			const codelens = new vscode.CodeLens(new vscode.Range(0, 0, 0, 0), { title: 'Open in Notebook Editor', command: 'ipynb.openIpynbInNotebookEditor', arguments: [document.uri] });
			return [codelens];
		}
	});

	context.subscriptions.push(vscode.commands.registerCommand('ipynb.newUntitledIpynb', async () => {
		const language = 'python';
		const cell = new vscode.NotebookCellData(vscode.NotebookCellKind.Code, '', language);
		const data = new vscode.NotebookData([cell]);
		data.metadata = {
			cells: [],
			metadata: {},
			nbformat: defaultNotebookFormat.major,
			nbformat_minor: defaultNotebookFormat.minor,
		};
		const doc = await vscode.workspace.openNotebookDocument('jupyter-notebook', data);
		await vscode.window.showNotebookDocument(doc);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('ipynb.openIpynbInNotebookEditor', async (uri: vscode.Uri) => {
		if (vscode.window.activeTextEditor?.document.uri.toString() === uri.toString()) {
			await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		}
		const document = await vscode.workspace.openNotebookDocument(uri);
		await vscode.window.showNotebookDocument(document);
	}));

	context.subscriptions.push(notebookImagePasteSetup());

	const enabled = vscode.workspace.getConfiguration('ipynb').get('pasteImagesAsAttachments.enabled', false);
	if (enabled) {
		const cleaner = new AttachmentCleaner();
		context.subscriptions.push(cleaner);
	}

	return {
		get dropCustomMetadata() {
			return true;
		},
		exportNotebook: (notebook: vscode.NotebookData): Promise<string> => {
			return Promise.resolve(serializeNotebookToString(notebook));
		},
		setNotebookMetadata: async (resource: vscode.Uri, metadata: Partial<NotebookMetadata>): Promise<boolean> => {
			const document = vscode.workspace.notebookDocuments.find(doc => doc.uri.toString() === resource.toString());
			if (!document) {
				return false;
			}

			const edit = new vscode.WorkspaceEdit();
			edit.set(resource, [vscode.NotebookEdit.updateNotebookMetadata({
				...document.metadata,
				metadata: {
					...(document.metadata.metadata ?? {}),
					...metadata
				} satisfies NotebookMetadata,
			})]);
			return vscode.workspace.applyEdit(edit);
		},
	};
}

export function deactivate() { }
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/notebookAttachmentCleaner.ts]---
Location: vscode-main/extensions/ipynb/src/notebookAttachmentCleaner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { ATTACHMENT_CLEANUP_COMMANDID, JUPYTER_NOTEBOOK_MARKDOWN_SELECTOR } from './constants';
import { deepClone, objectEquals, Delayer } from './helper';

interface AttachmentCleanRequest {
	notebook: vscode.NotebookDocument;
	document: vscode.TextDocument;
	cell: vscode.NotebookCell;
}

interface IAttachmentData {
	[key: string /** mimetype */]: string;/** b64-encoded */
}

interface IAttachmentDiagnostic {
	name: string;
	ranges: vscode.Range[];
}

export enum DiagnosticCode {
	missing_attachment = 'notebook.missing-attachment'
}

export class AttachmentCleaner implements vscode.CodeActionProvider {
	private _attachmentCache:
		Map<string /** uri */, Map<string /** cell fragment*/, Map<string /** attachment filename */, IAttachmentData>>> = new Map();

	private _disposables: vscode.Disposable[];
	private _imageDiagnosticCollection: vscode.DiagnosticCollection;
	private readonly _delayer = new Delayer(750);

	constructor() {
		this._disposables = [];
		this._imageDiagnosticCollection = vscode.languages.createDiagnosticCollection('Notebook Image Attachment');
		this._disposables.push(this._imageDiagnosticCollection);

		this._disposables.push(vscode.commands.registerCommand(ATTACHMENT_CLEANUP_COMMANDID, async (document: vscode.Uri, range: vscode.Range) => {
			const workspaceEdit = new vscode.WorkspaceEdit();
			workspaceEdit.delete(document, range);
			await vscode.workspace.applyEdit(workspaceEdit);
		}));

		this._disposables.push(vscode.languages.registerCodeActionsProvider(JUPYTER_NOTEBOOK_MARKDOWN_SELECTOR, this, {
			providedCodeActionKinds: [
				vscode.CodeActionKind.QuickFix
			],
		}));

		this._disposables.push(vscode.workspace.onDidChangeNotebookDocument(e => {
			this._delayer.trigger(() => {

				e.cellChanges.forEach(change => {
					if (!change.document) {
						return;
					}

					if (change.cell.kind !== vscode.NotebookCellKind.Markup) {
						return;
					}

					const metadataEdit = this.cleanNotebookAttachments({
						notebook: e.notebook,
						cell: change.cell,
						document: change.document
					});
					if (metadataEdit) {
						const workspaceEdit = new vscode.WorkspaceEdit();
						workspaceEdit.set(e.notebook.uri, [metadataEdit]);
						vscode.workspace.applyEdit(workspaceEdit);
					}
				});
			});
		}));


		this._disposables.push(vscode.workspace.onWillSaveNotebookDocument(e => {
			if (e.reason === vscode.TextDocumentSaveReason.Manual) {
				this._delayer.dispose();
				if (e.notebook.getCells().length === 0) {
					return;
				}
				const notebookEdits: vscode.NotebookEdit[] = [];
				for (const cell of e.notebook.getCells()) {
					if (cell.kind !== vscode.NotebookCellKind.Markup) {
						continue;
					}

					const metadataEdit = this.cleanNotebookAttachments({
						notebook: e.notebook,
						cell: cell,
						document: cell.document
					});

					if (metadataEdit) {
						notebookEdits.push(metadataEdit);
					}
				}
				if (!notebookEdits.length) {
					return;
				}
				const workspaceEdit = new vscode.WorkspaceEdit();
				workspaceEdit.set(e.notebook.uri, notebookEdits);
				e.waitUntil(Promise.resolve(workspaceEdit));
			}
		}));

		this._disposables.push(vscode.workspace.onDidCloseNotebookDocument(e => {
			this._attachmentCache.delete(e.uri.toString());
		}));

		this._disposables.push(vscode.workspace.onWillRenameFiles(e => {
			const re = /\.ipynb$/;
			for (const file of e.files) {
				if (!re.exec(file.oldUri.toString())) {
					continue;
				}

				// transfer cache to new uri
				if (this._attachmentCache.has(file.oldUri.toString())) {
					this._attachmentCache.set(file.newUri.toString(), this._attachmentCache.get(file.oldUri.toString())!);
					this._attachmentCache.delete(file.oldUri.toString());
				}
			}
		}));

		this._disposables.push(vscode.workspace.onDidOpenTextDocument(e => {
			this.analyzeMissingAttachments(e);
		}));

		this._disposables.push(vscode.workspace.onDidCloseTextDocument(e => {
			this.analyzeMissingAttachments(e);
		}));

		vscode.workspace.textDocuments.forEach(document => {
			this.analyzeMissingAttachments(document);
		});
	}

	provideCodeActions(document: vscode.TextDocument, _range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, _token: vscode.CancellationToken): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
		const fixes: vscode.CodeAction[] = [];

		for (const diagnostic of context.diagnostics) {
			switch (diagnostic.code) {
				case DiagnosticCode.missing_attachment:
					{
						const fix = new vscode.CodeAction(
							'Remove invalid image attachment reference',
							vscode.CodeActionKind.QuickFix);

						fix.command = {
							command: ATTACHMENT_CLEANUP_COMMANDID,
							title: 'Remove invalid image attachment reference',
							arguments: [document.uri, diagnostic.range],
						};
						fixes.push(fix);
					}
					break;
			}
		}

		return fixes;
	}

	/**
	 * take in a NotebookDocumentChangeEvent, and clean the attachment data for the cell(s) that have had their markdown source code changed
	 * @param e NotebookDocumentChangeEvent from the onDidChangeNotebookDocument listener
	 * @returns vscode.NotebookEdit, the metadata alteration performed on the json behind the ipynb
	 */
	private cleanNotebookAttachments(e: AttachmentCleanRequest): vscode.NotebookEdit | undefined {

		if (e.notebook.isClosed) {
			return;
		}
		const document = e.document;
		const cell = e.cell;

		const markdownAttachmentsInUse: { [key: string /** filename */]: IAttachmentData } = {};
		const cellFragment = cell.document.uri.fragment;
		const notebookUri = e.notebook.uri.toString();
		const diagnostics: IAttachmentDiagnostic[] = [];
		const markdownAttachmentsRefedInCell = this.getAttachmentNames(document);

		if (markdownAttachmentsRefedInCell.size === 0) {
			// no attachments used in this cell, cache all images from cell metadata
			this.saveAllAttachmentsToCache(cell.metadata, notebookUri, cellFragment);
		}

		if (this.checkMetadataHasAttachmentsField(cell.metadata)) {
			// the cell metadata contains attachments, check if any are used in the markdown source

			for (const [currFilename, attachment] of Object.entries(cell.metadata.attachments)) {
				// means markdown reference is present in the metadata, rendering will work properly
				// therefore, we don't need to check it in the next loop either
				if (markdownAttachmentsRefedInCell.has(currFilename)) {
					// attachment reference is present in the markdown source, no need to cache it
					markdownAttachmentsRefedInCell.get(currFilename)!.valid = true;
					markdownAttachmentsInUse[currFilename] = attachment as IAttachmentData;
				} else {
					// attachment reference is not present in the markdown source, cache it
					this.saveAttachmentToCache(notebookUri, cellFragment, currFilename, cell.metadata);
				}
			}
		}

		for (const [currFilename, attachment] of markdownAttachmentsRefedInCell) {
			if (attachment.valid) {
				// attachment reference is present in both the markdown source and the metadata, no op
				continue;
			}

			// if image is referenced in markdown source but not in metadata -> check if we have image in the cache
			const cachedImageAttachment = this._attachmentCache.get(notebookUri)?.get(cellFragment)?.get(currFilename);
			if (cachedImageAttachment) {
				markdownAttachmentsInUse[currFilename] = cachedImageAttachment;
				this._attachmentCache.get(notebookUri)?.get(cellFragment)?.delete(currFilename);
			} else {
				// if image is not in the cache, show warning
				diagnostics.push({ name: currFilename, ranges: attachment.ranges });
			}
		}

		this.updateDiagnostics(cell.document.uri, diagnostics);

		if (cell.index > -1 && !objectEquals(markdownAttachmentsInUse || {}, cell.metadata.attachments || {})) {
			const updateMetadata: { [key: string]: any } = deepClone(cell.metadata);
			if (Object.keys(markdownAttachmentsInUse).length === 0) {
				updateMetadata.attachments = undefined;
			} else {
				updateMetadata.attachments = markdownAttachmentsInUse;
			}
			const metadataEdit = vscode.NotebookEdit.updateCellMetadata(cell.index, updateMetadata);
			return metadataEdit;
		}
		return;
	}

	private analyzeMissingAttachments(document: vscode.TextDocument): void {
		if (document.uri.scheme !== 'vscode-notebook-cell') {
			// not notebook
			return;
		}

		if (document.isClosed) {
			this.updateDiagnostics(document.uri, []);
			return;
		}

		let notebook: vscode.NotebookDocument | undefined;
		let activeCell: vscode.NotebookCell | undefined;
		for (const notebookDocument of vscode.workspace.notebookDocuments) {
			const cell = notebookDocument.getCells().find(cell => cell.document === document);
			if (cell) {
				notebook = notebookDocument;
				activeCell = cell;
				break;
			}
		}

		if (!notebook || !activeCell) {
			return;
		}

		const diagnostics: IAttachmentDiagnostic[] = [];
		const markdownAttachments = this.getAttachmentNames(document);
		if (this.checkMetadataHasAttachmentsField(activeCell.metadata)) {
			for (const [currFilename, attachment] of markdownAttachments) {
				if (!activeCell.metadata.attachments[currFilename]) {
					// no attachment reference in the metadata
					diagnostics.push({ name: currFilename, ranges: attachment.ranges });
				}
			}
		}

		this.updateDiagnostics(activeCell.document.uri, diagnostics);
	}

	private updateDiagnostics(cellUri: vscode.Uri, diagnostics: IAttachmentDiagnostic[]) {
		const vscodeDiagnostics: vscode.Diagnostic[] = [];
		for (const currDiagnostic of diagnostics) {
			currDiagnostic.ranges.forEach(range => {
				const diagnostic = new vscode.Diagnostic(range, `The image named: '${currDiagnostic.name}' is not present in cell metadata.`, vscode.DiagnosticSeverity.Warning);
				diagnostic.code = DiagnosticCode.missing_attachment;
				vscodeDiagnostics.push(diagnostic);
			});
		}

		this._imageDiagnosticCollection.set(cellUri, vscodeDiagnostics);
	}

	/**
	 * remove attachment from metadata and add it to the cache
	 * @param notebookUri uri of the notebook currently being edited
	 * @param cellFragment fragment of the cell currently being edited
	 * @param currFilename filename of the image being pulled into the cell
	 * @param metadata metadata of the cell currently being edited
	 */
	private saveAttachmentToCache(notebookUri: string, cellFragment: string, currFilename: string, metadata: { [key: string]: any }): void {
		const documentCache = this._attachmentCache.get(notebookUri);
		if (!documentCache) {
			// no cache for this notebook yet
			const cellCache = new Map<string, IAttachmentData>();
			cellCache.set(currFilename, this.getMetadataAttachment(metadata, currFilename));
			const documentCache = new Map();
			documentCache.set(cellFragment, cellCache);
			this._attachmentCache.set(notebookUri, documentCache);
		} else if (!documentCache.has(cellFragment)) {
			// no cache for this cell yet
			const cellCache = new Map<string, IAttachmentData>();
			cellCache.set(currFilename, this.getMetadataAttachment(metadata, currFilename));
			documentCache.set(cellFragment, cellCache);
		} else {
			// cache for this cell already exists
			// add to cell cache
			documentCache.get(cellFragment)?.set(currFilename, this.getMetadataAttachment(metadata, currFilename));
		}
	}

	/**
	 * get an attachment entry from the given metadata
	 * @param metadata metadata to extract image data from
	 * @param currFilename filename of image being extracted
	 * @returns
	 */
	private getMetadataAttachment(metadata: { [key: string]: any }, currFilename: string): { [key: string]: any } {
		return metadata.attachments[currFilename];
	}

	/**
	 * returns a boolean that represents if there are any images in the attachment field of a cell's metadata
	 * @param metadata metadata of cell
	 * @returns boolean representing the presence of any attachments
	 */
	private checkMetadataHasAttachmentsField(metadata: { [key: string]: unknown }): metadata is { readonly attachments: Record<string, unknown> } {
		return !!metadata.attachments && typeof metadata.attachments === 'object';
	}

	/**
	 * given metadata from a cell, cache every image (used in cases with no image links in markdown source)
	 * @param metadata metadata for a cell with no images in markdown source
	 * @param notebookUri uri for the notebook being edited
	 * @param cellFragment fragment of cell being edited
	 */
	private saveAllAttachmentsToCache(metadata: { [key: string]: unknown }, notebookUri: string, cellFragment: string): void {
		const documentCache = this._attachmentCache.get(notebookUri) ?? new Map();
		this._attachmentCache.set(notebookUri, documentCache);
		const cellCache = documentCache.get(cellFragment) ?? new Map<string, IAttachmentData>();
		documentCache.set(cellFragment, cellCache);

		if (metadata.attachments && typeof metadata.attachments === 'object') {
			for (const [currFilename, attachment] of Object.entries(metadata.attachments)) {
				cellCache.set(currFilename, attachment);
			}
		}
	}

	/**
	 * pass in all of the markdown source code, and get a dictionary of all images referenced in the markdown. keys are image filenames, values are render state
	 * @param document the text document for the cell, formatted as a string
	 */
	private getAttachmentNames(document: vscode.TextDocument) {
		const source = document.getText();
		const filenames: Map<string, { valid: boolean; ranges: vscode.Range[] }> = new Map();
		const re = /!\[.*?\]\(<?attachment:(?<filename>.*?)>?\)/gm;

		let match;
		while ((match = re.exec(source))) {
			if (match.groups?.filename) {
				const index = match.index;
				const length = match[0].length;
				const startPosition = document.positionAt(index);
				const endPosition = document.positionAt(index + length);
				const range = new vscode.Range(startPosition, endPosition);
				const filename = filenames.get(match.groups.filename) ?? { valid: false, ranges: [] };
				filenames.set(match.groups.filename, filename);
				filename.ranges.push(range);
			}
		}
		return filenames;
	}

	dispose() {
		this._disposables.forEach(d => d.dispose());
		this._delayer.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/notebookImagePaste.ts]---
Location: vscode-main/extensions/ipynb/src/notebookImagePaste.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { JUPYTER_NOTEBOOK_MARKDOWN_SELECTOR } from './constants';
import { basename, extname } from 'path';

enum MimeType {
	bmp = 'image/bmp',
	gif = 'image/gif',
	ico = 'image/ico',
	jpeg = 'image/jpeg',
	png = 'image/png',
	tiff = 'image/tiff',
	webp = 'image/webp',
	plain = 'text/plain',
	uriList = 'text/uri-list',
}

const imageMimeTypes: ReadonlySet<string> = new Set<string>([
	MimeType.bmp,
	MimeType.gif,
	MimeType.ico,
	MimeType.jpeg,
	MimeType.png,
	MimeType.tiff,
	MimeType.webp,
]);

const imageExtToMime: ReadonlyMap<string, string> = new Map<string, string>([
	['.bmp', MimeType.bmp],
	['.gif', MimeType.gif],
	['.ico', MimeType.ico],
	['.jpe', MimeType.jpeg],
	['.jpeg', MimeType.jpeg],
	['.jpg', MimeType.jpeg],
	['.png', MimeType.png],
	['.tif', MimeType.tiff],
	['.tiff', MimeType.tiff],
	['.webp', MimeType.webp],
]);

function getImageMimeType(uri: vscode.Uri): string | undefined {
	return imageExtToMime.get(extname(uri.fsPath).toLowerCase());
}

class DropOrPasteEditProvider implements vscode.DocumentPasteEditProvider, vscode.DocumentDropEditProvider {

	public static readonly kind = vscode.DocumentDropOrPasteEditKind.Empty.append('markdown', 'link', 'image', 'attachment');

	async provideDocumentPasteEdits(
		document: vscode.TextDocument,
		_ranges: readonly vscode.Range[],
		dataTransfer: vscode.DataTransfer,
		_context: vscode.DocumentPasteEditContext,
		token: vscode.CancellationToken,
	): Promise<vscode.DocumentPasteEdit[] | undefined> {
		const enabled = vscode.workspace.getConfiguration('ipynb', document).get('pasteImagesAsAttachments.enabled', true);
		if (!enabled) {
			return;
		}

		const insert = await this.createInsertImageAttachmentEdit(document, dataTransfer, token);
		if (!insert) {
			return;
		}

		const pasteEdit = new vscode.DocumentPasteEdit(insert.insertText, vscode.l10n.t('Insert Image as Attachment'), DropOrPasteEditProvider.kind);
		pasteEdit.yieldTo = [vscode.DocumentDropOrPasteEditKind.Text];
		pasteEdit.additionalEdit = insert.additionalEdit;
		return [pasteEdit];
	}

	async provideDocumentDropEdits(
		document: vscode.TextDocument,
		_position: vscode.Position,
		dataTransfer: vscode.DataTransfer,
		token: vscode.CancellationToken,
	): Promise<vscode.DocumentDropEdit | undefined> {
		const insert = await this.createInsertImageAttachmentEdit(document, dataTransfer, token);
		if (!insert) {
			return;
		}

		const dropEdit = new vscode.DocumentDropEdit(insert.insertText);
		dropEdit.yieldTo = [vscode.DocumentDropOrPasteEditKind.Text];
		dropEdit.additionalEdit = insert.additionalEdit;
		dropEdit.title = vscode.l10n.t('Insert Image as Attachment');
		return dropEdit;
	}

	private async createInsertImageAttachmentEdit(
		document: vscode.TextDocument,
		dataTransfer: vscode.DataTransfer,
		token: vscode.CancellationToken,
	): Promise<{ insertText: vscode.SnippetString; additionalEdit: vscode.WorkspaceEdit } | undefined> {
		const imageData = await getDroppedImageData(dataTransfer, token);
		if (!imageData.length || token.isCancellationRequested) {
			return;
		}

		const currentCell = getCellFromCellDocument(document);
		if (!currentCell) {
			return undefined;
		}

		// create updated metadata for cell (prep for WorkspaceEdit)
		const newAttachment = buildAttachment(currentCell, imageData);
		if (!newAttachment) {
			return;
		}

		// build edits
		const additionalEdit = new vscode.WorkspaceEdit();
		const nbEdit = vscode.NotebookEdit.updateCellMetadata(currentCell.index, newAttachment.metadata);
		const notebookUri = currentCell.notebook.uri;
		additionalEdit.set(notebookUri, [nbEdit]);

		// create a snippet for paste
		const insertText = new vscode.SnippetString();
		newAttachment.filenames.forEach((filename, i) => {
			insertText.appendText('![');
			insertText.appendPlaceholder(`${filename}`);
			insertText.appendText(`](${/\s/.test(filename) ? `<attachment:${filename}>` : `attachment:${filename}`})`);
			if (i !== newAttachment.filenames.length - 1) {
				insertText.appendText(' ');
			}
		});

		return { insertText, additionalEdit };
	}
}

async function getDroppedImageData(
	dataTransfer: vscode.DataTransfer,
	token: vscode.CancellationToken,
): Promise<readonly ImageAttachmentData[]> {

	// Prefer using image data in the clipboard
	const files = coalesce(await Promise.all(Array.from(dataTransfer, async ([mimeType, item]): Promise<ImageAttachmentData | undefined> => {
		if (!imageMimeTypes.has(mimeType)) {
			return;
		}

		const file = item.asFile();
		if (!file) {
			return;
		}

		const data = await file.data();
		return { fileName: file.name, mimeType, data };
	})));
	if (files.length) {
		return files;
	}

	// Then fallback to image files in the uri-list
	const urlList = await dataTransfer.get('text/uri-list')?.asString();
	if (token.isCancellationRequested) {
		return [];
	}

	if (urlList) {
		const uris: vscode.Uri[] = [];
		for (const resource of urlList.split(/\r?\n/g)) {
			try {
				uris.push(vscode.Uri.parse(resource));
			} catch {
				// noop
			}
		}

		const entries = await Promise.all(uris.map(async (uri) => {
			const mimeType = getImageMimeType(uri);
			if (!mimeType) {
				return;
			}

			const data = await vscode.workspace.fs.readFile(uri);
			return { fileName: basename(uri.fsPath), mimeType, data };
		}));

		return coalesce(entries);
	}

	return [];
}

function coalesce<T>(array: ReadonlyArray<T | undefined | null>): T[] {
	return <T[]>array.filter(e => !!e);
}

function getCellFromCellDocument(cellDocument: vscode.TextDocument): vscode.NotebookCell | undefined {
	for (const notebook of vscode.workspace.notebookDocuments) {
		if (notebook.uri.path === cellDocument.uri.path) {
			for (const cell of notebook.getCells()) {
				if (cell.document === cellDocument) {
					return cell;
				}
			}
		}
	}
	return undefined;
}

/**
 *  Taken from https://github.com/microsoft/vscode/blob/743b016722db90df977feecde0a4b3b4f58c2a4c/src/vs/base/common/buffer.ts#L350-L387
 */
function encodeBase64(buffer: Uint8Array, padded = true, urlSafe = false) {
	const base64Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	const base64UrlSafeAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

	const dictionary = urlSafe ? base64UrlSafeAlphabet : base64Alphabet;
	let output = '';

	const remainder = buffer.byteLength % 3;

	let i = 0;
	for (; i < buffer.byteLength - remainder; i += 3) {
		const a = buffer[i + 0];
		const b = buffer[i + 1];
		const c = buffer[i + 2];

		output += dictionary[a >>> 2];
		output += dictionary[(a << 4 | b >>> 4) & 0b111111];
		output += dictionary[(b << 2 | c >>> 6) & 0b111111];
		output += dictionary[c & 0b111111];
	}

	if (remainder === 1) {
		const a = buffer[i + 0];
		output += dictionary[a >>> 2];
		output += dictionary[(a << 4) & 0b111111];
		if (padded) { output += '=='; }
	} else if (remainder === 2) {
		const a = buffer[i + 0];
		const b = buffer[i + 1];
		output += dictionary[a >>> 2];
		output += dictionary[(a << 4 | b >>> 4) & 0b111111];
		output += dictionary[(b << 2) & 0b111111];
		if (padded) { output += '='; }
	}

	return output;
}


interface ImageAttachmentData {
	readonly fileName: string;
	readonly data: Uint8Array;
	readonly mimeType: string;
}

function buildAttachment(
	cell: vscode.NotebookCell,
	attachments: readonly ImageAttachmentData[],
): { metadata: { [key: string]: any }; filenames: string[] } | undefined {
	const cellMetadata = { ...cell.metadata };
	const tempFilenames: string[] = [];
	if (!attachments.length) {
		return undefined;
	}

	if (!cellMetadata.attachments) {
		cellMetadata.attachments = {};
	}

	for (const attachment of attachments) {
		const b64 = encodeBase64(attachment.data);

		const fileExt = extname(attachment.fileName);
		const filenameWithoutExt = basename(attachment.fileName, fileExt);

		let tempFilename = filenameWithoutExt + fileExt;
		for (let appendValue = 2; cellMetadata.attachments[tempFilename]; appendValue++) {
			const objEntries = Object.entries(cellMetadata.attachments[tempFilename]);
			if (objEntries.length) { // check that mime:b64 are present
				const [mime, attachmentb64] = objEntries[0];
				if (mime === attachment.mimeType && attachmentb64 === b64) { // checking if filename can be reused, based on comparison of image data
					break;
				} else {
					tempFilename = filenameWithoutExt.concat(`-${appendValue}`) + fileExt;
				}
			}
		}

		tempFilenames.push(tempFilename);
		cellMetadata.attachments[tempFilename] = { [attachment.mimeType]: b64 };
	}

	return {
		metadata: cellMetadata,
		filenames: tempFilenames,
	};
}

export function notebookImagePasteSetup(): vscode.Disposable {
	const provider = new DropOrPasteEditProvider();
	return vscode.Disposable.from(
		vscode.languages.registerDocumentPasteEditProvider(JUPYTER_NOTEBOOK_MARKDOWN_SELECTOR, provider, {
			providedPasteEditKinds: [DropOrPasteEditProvider.kind],
			pasteMimeTypes: [
				MimeType.png,
				MimeType.uriList,
			],
		}),
		vscode.languages.registerDocumentDropEditProvider(JUPYTER_NOTEBOOK_MARKDOWN_SELECTOR, provider, {
			providedDropEditKinds: [DropOrPasteEditProvider.kind],
			dropMimeTypes: [
				...Object.values(imageExtToMime),
				MimeType.uriList,
			],
		})
	);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/notebookModelStoreSync.ts]---
Location: vscode-main/extensions/ipynb/src/notebookModelStoreSync.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, ExtensionContext, NotebookCellKind, NotebookDocument, NotebookDocumentChangeEvent, NotebookEdit, workspace, WorkspaceEdit, type NotebookCell, type NotebookDocumentWillSaveEvent } from 'vscode';
import { getCellMetadata, getVSCodeCellLanguageId, removeVSCodeCellLanguageId, setVSCodeCellLanguageId, sortObjectPropertiesRecursively, getNotebookMetadata } from './serializers';
import { CellMetadata } from './common';
import type * as nbformat from '@jupyterlab/nbformat';
import { generateUuid } from './helper';

const noop = () => {
	//
};

/**
 * Code here is used to ensure the Notebook Model is in sync the ipynb JSON file.
 * E.g. assume you add a new cell, this new cell will not have any metadata at all.
 * However when we save the ipynb, the metadata will be an empty object `{}`.
 * Now thats completely different from the metadata os being `empty/undefined` in the model.
 * As a result, when looking at things like diff view or accessing metadata, we'll see differences.
*
* This code ensures that the model is in sync with the ipynb file.
*/
export const pendingNotebookCellModelUpdates = new WeakMap<NotebookDocument, Set<Thenable<void>>>();
export function activate(context: ExtensionContext) {
	workspace.onDidChangeNotebookDocument(onDidChangeNotebookCells, undefined, context.subscriptions);
	workspace.onWillSaveNotebookDocument(waitForPendingModelUpdates, undefined, context.subscriptions);
}

type NotebookDocumentChangeEventEx = Omit<NotebookDocumentChangeEvent, 'metadata'>;
let mergedEvents: NotebookDocumentChangeEventEx | undefined;
let timer: NodeJS.Timeout;

function triggerDebouncedNotebookDocumentChangeEvent() {
	if (timer) {
		clearTimeout(timer);
	}
	if (!mergedEvents) {
		return;
	}
	const args = mergedEvents;
	mergedEvents = undefined;
	onDidChangeNotebookCells(args);
}

export function debounceOnDidChangeNotebookDocument() {
	const disposable = workspace.onDidChangeNotebookDocument(e => {
		if (!isSupportedNotebook(e.notebook)) {
			return;
		}
		if (!mergedEvents) {
			mergedEvents = e;
		} else if (mergedEvents.notebook === e.notebook) {
			// Same notebook, we can merge the updates.
			mergedEvents = {
				cellChanges: e.cellChanges.concat(mergedEvents.cellChanges),
				contentChanges: e.contentChanges.concat(mergedEvents.contentChanges),
				notebook: e.notebook
			};
		} else {
			// Different notebooks, we cannot merge the updates.
			// Hence we need to process the previous notebook and start a new timer for the new notebook.
			triggerDebouncedNotebookDocumentChangeEvent();
			// Start a new timer for the new notebook.
			mergedEvents = e;
		}
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(triggerDebouncedNotebookDocumentChangeEvent, 200);
	});


	return Disposable.from(disposable, new Disposable(() => {
		clearTimeout(timer);
	}));
}

function isSupportedNotebook(notebook: NotebookDocument) {
	return notebook.notebookType === 'jupyter-notebook';
}

function waitForPendingModelUpdates(e: NotebookDocumentWillSaveEvent) {
	if (!isSupportedNotebook(e.notebook)) {
		return;
	}

	triggerDebouncedNotebookDocumentChangeEvent();
	const promises = pendingNotebookCellModelUpdates.get(e.notebook);
	if (!promises) {
		return;
	}
	e.waitUntil(Promise.all(promises));
}

function cleanup(notebook: NotebookDocument, promise: PromiseLike<void>) {
	const pendingUpdates = pendingNotebookCellModelUpdates.get(notebook);
	if (pendingUpdates) {
		pendingUpdates.delete(promise);
		if (!pendingUpdates.size) {
			pendingNotebookCellModelUpdates.delete(notebook);
		}
	}
}
function trackAndUpdateCellMetadata(notebook: NotebookDocument, updates: { cell: NotebookCell; metadata: CellMetadata & { vscode?: { languageId: string } } }[]) {
	const pendingUpdates = pendingNotebookCellModelUpdates.get(notebook) ?? new Set<Thenable<void>>();
	pendingNotebookCellModelUpdates.set(notebook, pendingUpdates);
	const edit = new WorkspaceEdit();
	updates.forEach(({ cell, metadata }) => {
		const newMetadata = { ...cell.metadata, ...metadata };
		if (!metadata.execution_count && newMetadata.execution_count) {
			newMetadata.execution_count = null;
		}
		if (!metadata.attachments && newMetadata.attachments) {
			delete newMetadata.attachments;
		}
		edit.set(cell.notebook.uri, [NotebookEdit.updateCellMetadata(cell.index, sortObjectPropertiesRecursively(newMetadata))]);
	});
	const promise = workspace.applyEdit(edit).then(noop, noop);
	pendingUpdates.add(promise);
	const clean = () => cleanup(notebook, promise);
	promise.then(clean, clean);
}

const pendingCellUpdates = new WeakSet<NotebookCell>();
function onDidChangeNotebookCells(e: NotebookDocumentChangeEventEx) {
	if (!isSupportedNotebook(e.notebook)) {
		return;
	}

	const notebook = e.notebook;
	const notebookMetadata = getNotebookMetadata(e.notebook);

	// use the preferred language from document metadata or the first cell language as the notebook preferred cell language
	const preferredCellLanguage = notebookMetadata.metadata?.language_info?.name;
	const updates: { cell: NotebookCell; metadata: CellMetadata & { vscode?: { languageId: string } } }[] = [];
	// When we change the language of a cell,
	// Ensure the metadata in the notebook cell has been updated as well,
	// Else model will be out of sync with ipynb https://github.com/microsoft/vscode/issues/207968#issuecomment-2002858596
	e.cellChanges.forEach(e => {
		if (!preferredCellLanguage || e.cell.kind !== NotebookCellKind.Code) {
			return;
		}
		const currentMetadata = e.metadata ? getCellMetadata({ metadata: e.metadata }) : getCellMetadata({ cell: e.cell });
		const languageIdInMetadata = getVSCodeCellLanguageId(currentMetadata);
		const metadata: CellMetadata = JSON.parse(JSON.stringify(currentMetadata));
		metadata.metadata = metadata.metadata || {};
		let metadataUpdated = false;
		if (e.executionSummary?.executionOrder && typeof e.executionSummary.success === 'boolean' && currentMetadata.execution_count !== e.executionSummary?.executionOrder) {
			metadata.execution_count = e.executionSummary.executionOrder;
			metadataUpdated = true;
		} else if (!e.executionSummary && !e.metadata && e.outputs?.length === 0 && currentMetadata.execution_count) {
			// Clear all (user hit clear all).
			// NOTE: At this point we're updating the `execution_count` in metadata to `null`.
			// Thus this is a change in metadata, which we will need to update in the model.
			metadata.execution_count = null;
			metadataUpdated = true;
			// Note: We will get another event for this, see below for the check.
			// track the fact that we're expecting an update for this cell.
			pendingCellUpdates.add(e.cell);
		} else if ((!e.executionSummary || (!e.executionSummary?.executionOrder && !e.executionSummary?.success && !e.executionSummary?.timing))
			&& !e.metadata && !e.outputs && currentMetadata.execution_count && pendingCellUpdates.has(e.cell)) {
			// This is a result of the cell being cleared (i.e. we perfomed an update request and this is now the update event).
			metadata.execution_count = null;
			metadataUpdated = true;
			pendingCellUpdates.delete(e.cell);
		} else if (!e.executionSummary?.executionOrder && !e.executionSummary?.success && !e.executionSummary?.timing
			&& !e.metadata && !e.outputs && currentMetadata.execution_count && !pendingCellUpdates.has(e.cell)) {
			// This is a result of the cell without outupts but has execution count being cleared
			// Create two cells, one that produces output and one that doesn't. Run both and then clear the output or all cells.
			// This condition will be satisfied for first cell without outputs.
			metadata.execution_count = null;
			metadataUpdated = true;
		}

		if (e.document?.languageId && e.document?.languageId !== preferredCellLanguage && e.document?.languageId !== languageIdInMetadata) {
			setVSCodeCellLanguageId(metadata, e.document.languageId);
			metadataUpdated = true;
		} else if (e.document?.languageId && e.document.languageId === preferredCellLanguage && languageIdInMetadata) {
			removeVSCodeCellLanguageId(metadata);
			metadataUpdated = true;
		} else if (e.document?.languageId && e.document.languageId === preferredCellLanguage && e.document.languageId === languageIdInMetadata) {
			removeVSCodeCellLanguageId(metadata);
			metadataUpdated = true;
		}

		if (metadataUpdated) {
			updates.push({ cell: e.cell, metadata });
		}
	});

	// Ensure all new cells in notebooks with nbformat >= 4.5 have an id.
	// Details of the spec can be found here https://jupyter.org/enhancement-proposals/62-cell-id/cell-id.html#
	e.contentChanges.forEach(change => {
		change.addedCells.forEach(cell => {
			// When ever a cell is added, always update the metadata
			// as metadata is always an empty `{}` in ipynb JSON file
			const cellMetadata = getCellMetadata({ cell });

			// Avoid updating the metadata if it's not required.
			if (cellMetadata.metadata) {
				if (!isCellIdRequired(notebookMetadata)) {
					return;
				}
				if (isCellIdRequired(notebookMetadata) && cellMetadata?.id) {
					return;
				}
			}

			// Don't edit the metadata directly, always get a clone (prevents accidental singletons and directly editing the objects).
			const metadata: CellMetadata = { ...JSON.parse(JSON.stringify(cellMetadata || {})) };
			metadata.metadata = metadata.metadata || {};

			if (isCellIdRequired(notebookMetadata) && !cellMetadata?.id) {
				metadata.id = generateCellId(e.notebook);
			}
			updates.push({ cell, metadata });
		});
	});

	if (updates.length) {
		trackAndUpdateCellMetadata(notebook, updates);
	}
}


/**
 * Cell ids are required in notebooks only in notebooks with nbformat >= 4.5
 */
function isCellIdRequired(metadata: Pick<Partial<nbformat.INotebookContent>, 'nbformat' | 'nbformat_minor'>) {
	if ((metadata.nbformat || 0) >= 5) {
		return true;
	}
	if ((metadata.nbformat || 0) === 4 && (metadata.nbformat_minor || 0) >= 5) {
		return true;
	}
	return false;
}

function generateCellId(notebook: NotebookDocument) {
	while (true) {
		// Details of the id can be found here https://jupyter.org/enhancement-proposals/62-cell-id/cell-id.html#adding-an-id-field,
		// & here https://jupyter.org/enhancement-proposals/62-cell-id/cell-id.html#updating-older-formats
		const id = generateUuid().replace(/-/g, '').substring(0, 8);
		let duplicate = false;
		for (let index = 0; index < notebook.cellCount; index++) {
			const cell = notebook.cellAt(index);
			const existingId = getCellMetadata({ cell })?.id;
			if (!existingId) {
				continue;
			}
			if (existingId === id) {
				duplicate = true;
				break;
			}
		}
		if (!duplicate) {
			return id;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/notebookSerializer.node.ts]---
Location: vscode-main/extensions/ipynb/src/notebookSerializer.node.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DeferredPromise, generateUuid } from './helper';
import { NotebookSerializerBase } from './notebookSerializer';

export class NotebookSerializer extends NotebookSerializerBase {
	private experimentalSave = vscode.workspace.getConfiguration('ipynb').get('experimental.serialization', true);
	private worker?: import('node:worker_threads').Worker;
	private tasks = new Map<string, DeferredPromise<Uint8Array>>();

	constructor(context: vscode.ExtensionContext) {
		super(context);
		context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('ipynb.experimental.serialization')) {
				this.experimentalSave = vscode.workspace.getConfiguration('ipynb').get('experimental.serialization', true);
			}
		}));
	}

	override dispose() {
		try {
			void this.worker?.terminate();
		} catch {
			//
		}
		super.dispose();
	}

	public override async serializeNotebook(data: vscode.NotebookData, token: vscode.CancellationToken): Promise<Uint8Array> {
		if (this.disposed) {
			return new Uint8Array(0);
		}

		if (this.experimentalSave) {
			return this.serializeViaWorker(data);
		}

		return super.serializeNotebook(data, token);
	}

	private async startWorker() {
		if (this.disposed) {
			throw new Error('Serializer disposed');
		}
		if (this.worker) {
			return this.worker;
		}
		const { Worker } = await import('node:worker_threads');
		const outputDir = getOutputDir(this.context);
		this.worker = new Worker(vscode.Uri.joinPath(this.context.extensionUri, outputDir, 'notebookSerializerWorker.js').fsPath, {});
		this.worker.on('exit', (exitCode) => {
			if (!this.disposed) {
				console.error(`IPynb Notebook Serializer Worker exited unexpectedly`, exitCode);
			}
			this.worker = undefined;
		});
		this.worker.on('message', (result: { data: Uint8Array; id: string }) => {
			const task = this.tasks.get(result.id);
			if (task) {
				task.complete(result.data);
				this.tasks.delete(result.id);
			}
		});
		this.worker.on('error', (err) => {
			if (!this.disposed) {
				console.error(`IPynb Notebook Serializer Worker errored unexpectedly`, err);
			}
		});
		return this.worker;
	}
	private async serializeViaWorker(data: vscode.NotebookData): Promise<Uint8Array> {
		const worker = await this.startWorker();
		const id = generateUuid();

		const deferred = new DeferredPromise<Uint8Array>();
		this.tasks.set(id, deferred);
		worker.postMessage({ data, id });

		return deferred.p;
	}
}


function getOutputDir(context: vscode.ExtensionContext): string {
	const main = context.extension.packageJSON.main as string;
	return main.indexOf('/dist/') !== -1 ? 'dist' : 'out';
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/notebookSerializer.ts]---
Location: vscode-main/extensions/ipynb/src/notebookSerializer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as nbformat from '@jupyterlab/nbformat';
import detectIndent from 'detect-indent';
import * as vscode from 'vscode';
import { getPreferredLanguage, jupyterNotebookModelToNotebookData } from './deserializers';
import * as fnv from '@enonic/fnv-plus';
import { serializeNotebookToString } from './serializers';

export abstract class NotebookSerializerBase extends vscode.Disposable implements vscode.NotebookSerializer {
	protected disposed: boolean = false;
	constructor(protected readonly context: vscode.ExtensionContext) {
		super(() => { });
	}

	override dispose() {
		this.disposed = true;
		super.dispose();
	}

	public async deserializeNotebook(content: Uint8Array, _token: vscode.CancellationToken): Promise<vscode.NotebookData> {
		let contents = '';
		try {
			contents = new TextDecoder().decode(content);
		} catch {
		}

		let json = contents && /\S/.test(contents) ? (JSON.parse(contents) as Partial<nbformat.INotebookContent>) : {};

		if (json.__webview_backup) {
			const backupId = json.__webview_backup;
			const uri = this.context.globalStorageUri;
			const folder = uri.with({ path: this.context.globalStorageUri.path.replace('vscode.ipynb', 'ms-toolsai.jupyter') });
			const fileHash = fnv.fast1a32hex(backupId) as string;
			const fileName = `${fileHash}.ipynb`;
			const file = vscode.Uri.joinPath(folder, fileName);
			const data = await vscode.workspace.fs.readFile(file);
			json = data ? JSON.parse(data.toString()) : {};

			if (json.contents && typeof json.contents === 'string') {
				contents = json.contents;
				json = JSON.parse(contents) as Partial<nbformat.INotebookContent>;
			}
		}

		if (json.nbformat && json.nbformat < 4) {
			throw new Error('Only Jupyter notebooks version 4+ are supported');
		}

		// Then compute indent from the contents (only use first 1K characters as a perf optimization)
		const indentAmount = contents ? detectIndent(contents.substring(0, 1_000)).indent : ' ';

		const preferredCellLanguage = getPreferredLanguage(json.metadata);
		// Ensure we always have a blank cell.
		if ((json.cells || []).length === 0) {
			json.cells = [
			];
		}

		// For notebooks without metadata default the language in metadata to the preferred language.
		if (!json.metadata || (!json.metadata.kernelspec && !json.metadata.language_info)) {
			json.metadata = json.metadata || {};
			json.metadata.language_info = json.metadata.language_info || { name: preferredCellLanguage };
		}

		const data = jupyterNotebookModelToNotebookData(
			json,
			preferredCellLanguage
		);
		data.metadata = data.metadata || {};
		data.metadata.indentAmount = indentAmount;

		return data;
	}

	public async serializeNotebook(data: vscode.NotebookData, _token: vscode.CancellationToken): Promise<Uint8Array> {
		if (this.disposed) {
			return new Uint8Array(0);
		}

		const serialized = serializeNotebookToString(data);
		return new TextEncoder().encode(serialized);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/notebookSerializer.web.ts]---
Location: vscode-main/extensions/ipynb/src/notebookSerializer.web.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DeferredPromise, generateUuid } from './helper';
import { NotebookSerializerBase } from './notebookSerializer';

export class NotebookSerializer extends NotebookSerializerBase {
	private experimentalSave = vscode.workspace.getConfiguration('ipynb').get('experimental.serialization', true);
	private worker?: Worker;
	private tasks = new Map<string, DeferredPromise<Uint8Array>>();

	constructor(context: vscode.ExtensionContext) {
		super(context);
		context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('ipynb.experimental.serialization')) {
				this.experimentalSave = vscode.workspace.getConfiguration('ipynb').get('experimental.serialization', true);
			}
		}));
	}

	override dispose() {
		try {
			void this.worker?.terminate();
		} catch {
			//
		}
		super.dispose();
	}

	public override async serializeNotebook(data: vscode.NotebookData, token: vscode.CancellationToken): Promise<Uint8Array> {
		if (this.disposed) {
			return new Uint8Array(0);
		}

		if (this.experimentalSave) {
			return this.serializeViaWorker(data);
		}

		return super.serializeNotebook(data, token);
	}

	private async startWorker() {
		if (this.disposed) {
			throw new Error('Serializer disposed');
		}
		if (this.worker) {
			return this.worker;
		}
		const entry = vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'browser', 'notebookSerializerWorker.js');
		this.worker = new Worker(entry.toString());
		this.worker.addEventListener('exit', (exitCode) => {
			if (!this.disposed) {
				console.error(`IPynb Notebook Serializer Worker exited unexpectedly`, exitCode);
			}
			this.worker = undefined;
		});
		this.worker.onmessage = (e) => {
			const result = e.data as { id: string; data: Uint8Array };
			const task = this.tasks.get(result.id);
			if (task) {
				task.complete(result.data);
				this.tasks.delete(result.id);
			}
		};
		this.worker.onerror = (err) => {
			if (!this.disposed) {
				console.error(`IPynb Notebook Serializer Worker errored unexpectedly`, err);
			}
		};
		return this.worker;
	}
	private async serializeViaWorker(data: vscode.NotebookData): Promise<Uint8Array> {
		const worker = await this.startWorker();
		const id = generateUuid();

		const deferred = new DeferredPromise<Uint8Array>();
		this.tasks.set(id, deferred);
		worker.postMessage({ data, id });

		return deferred.p;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/notebookSerializerWorker.ts]---
Location: vscode-main/extensions/ipynb/src/notebookSerializerWorker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { parentPort } from 'worker_threads';
import { serializeNotebookToString } from './serializers';
import type { NotebookData } from 'vscode';


if (parentPort) {
	parentPort.on('message', ({ id, data }: { id: string; data: NotebookData }) => {
		if (parentPort) {
			const json = serializeNotebookToString(data);
			const bytes = new TextEncoder().encode(json);
			parentPort.postMessage({ id, data: bytes });
		}
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/notebookSerializerWorker.web.ts]---
Location: vscode-main/extensions/ipynb/src/notebookSerializerWorker.web.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { serializeNotebookToString } from './serializers';
import type { NotebookData } from 'vscode';

onmessage = (e) => {
	const data = e.data as { id: string; data: NotebookData };
	const json = serializeNotebookToString(data.data);
	const bytes = new TextEncoder().encode(json);
	postMessage({ id: data.id, data: bytes });
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/serializers.ts]---
Location: vscode-main/extensions/ipynb/src/serializers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as nbformat from '@jupyterlab/nbformat';
import type { NotebookCell, NotebookCellData, NotebookCellOutput, NotebookData, NotebookDocument } from 'vscode';
import { CellOutputMetadata, hasKey, type CellMetadata } from './common';
import { textMimeTypes, NotebookCellKindMarkup, CellOutputMimeTypes, defaultNotebookFormat } from './constants';

const textDecoder = new TextDecoder();

export function createJupyterCellFromNotebookCell(
	vscCell: NotebookCellData,
	preferredLanguage: string | undefined,
): nbformat.IRawCell | nbformat.IMarkdownCell | nbformat.ICodeCell {
	let cell: nbformat.IRawCell | nbformat.IMarkdownCell | nbformat.ICodeCell;
	if (vscCell.kind === NotebookCellKindMarkup) {
		cell = createMarkdownCellFromNotebookCell(vscCell);
	} else if (vscCell.languageId === 'raw') {
		cell = createRawCellFromNotebookCell(vscCell);
	} else {
		cell = createCodeCellFromNotebookCell(vscCell, preferredLanguage);
	}
	return cell;
}


/**
 * Sort the JSON to minimize unnecessary SCM changes.
 * Jupyter notbeooks/labs sorts the JSON keys in alphabetical order.
 * https://github.com/microsoft/vscode-python/issues/13155
 */
export function sortObjectPropertiesRecursively(obj: any): any {
	if (Array.isArray(obj)) {
		return obj.map(sortObjectPropertiesRecursively);
	}
	if (obj !== undefined && obj !== null && typeof obj === 'object' && Object.keys(obj).length > 0) {
		return (
			Object.keys(obj)
				.sort()
				.reduce<Record<string, unknown>>((sortedObj, prop) => {
					sortedObj[prop] = sortObjectPropertiesRecursively(obj[prop]);
					return sortedObj;
				}, {})
		);
	}
	return obj;
}

export function getCellMetadata(options: { cell: NotebookCell | NotebookCellData } | { metadata?: { [key: string]: any } }): CellMetadata {
	if (hasKey(options, { cell: true })) {
		const cell = options.cell;
		const metadata = {
			execution_count: null,
			// it contains the cell id, and the cell metadata, along with other nb cell metadata
			...(cell.metadata ?? {})
		} satisfies CellMetadata;
		if (cell.kind === NotebookCellKindMarkup) {
			delete (metadata as Record<string, unknown>).execution_count;
		}
		return metadata;
	} else {
		const cell = options;
		const metadata = {
			// it contains the cell id, and the cell metadata, along with other nb cell metadata
			...(cell.metadata ?? {})
		};

		return metadata as CellMetadata;
	}
}

export function getVSCodeCellLanguageId(metadata: CellMetadata): string | undefined {
	return metadata.metadata?.vscode?.languageId;
}
export function setVSCodeCellLanguageId(metadata: CellMetadata, languageId: string) {
	metadata.metadata = metadata.metadata || {};
	metadata.metadata.vscode = { languageId };
}
export function removeVSCodeCellLanguageId(metadata: CellMetadata) {
	if (metadata.metadata?.vscode) {
		delete metadata.metadata.vscode;
	}
}

function createCodeCellFromNotebookCell(cell: NotebookCellData, preferredLanguage: string | undefined): nbformat.ICodeCell {
	const cellMetadata: CellMetadata = JSON.parse(JSON.stringify(getCellMetadata({ cell })));
	cellMetadata.metadata = cellMetadata.metadata || {}; // This cannot be empty.
	if (cell.languageId !== preferredLanguage) {
		setVSCodeCellLanguageId(cellMetadata, cell.languageId);
	} else {
		// cell current language is the same as the preferred cell language in the document, flush the vscode custom language id metadata
		removeVSCodeCellLanguageId(cellMetadata);
	}

	const codeCell: nbformat.ICodeCell = {
		cell_type: 'code',
		// Metadata should always contain the execution_count.
		// When ever execution summary data changes we will update the metadata to contain the execution count.
		// Failing to do so means we have a problem.
		// Also do not read the value of executionSummary here, as its possible user reverted changes to metadata
		// & in that case execution summary could contain the data, but metadata will not.
		// In such cases we do not want to re-set the metadata with the value from execution summary (remember, user reverted that).
		execution_count: cellMetadata.execution_count ?? null,
		source: splitCellSourceIntoMultilineString(cell.value),
		outputs: (cell.outputs || []).map(translateCellDisplayOutput),
		metadata: cellMetadata.metadata
	};
	if (cellMetadata?.id) {
		codeCell.id = cellMetadata.id;
	}
	return codeCell;
}

function createRawCellFromNotebookCell(cell: NotebookCellData): nbformat.IRawCell {
	const cellMetadata = getCellMetadata({ cell });
	const rawCell: any = {
		cell_type: 'raw',
		source: splitCellSourceIntoMultilineString(cell.value),
		metadata: cellMetadata?.metadata || {} // This cannot be empty.
	};
	if (cellMetadata?.attachments) {
		rawCell.attachments = cellMetadata.attachments;
	}
	if (cellMetadata?.id) {
		rawCell.id = cellMetadata.id;
	}
	return rawCell;
}

/**
 * Splits the source of a cell into an array of strings, each representing a line.
 * Also normalizes line endings to use LF (`\n`) instead of CRLF (`\r\n`).
 * Same is done in deserializer as well.
 */
function splitCellSourceIntoMultilineString(source: string): string[] {
	return splitMultilineString(source.replace(/\r\n/g, '\n'));
}

function splitMultilineString(source: nbformat.MultilineString): string[] {
	if (Array.isArray(source)) {
		return source as string[];
	}
	const str = source.toString();
	if (str.length > 0) {
		// Each line should be a separate entry, but end with a \n if not last entry
		const arr = str.split('\n');
		return arr
			.map((s, i) => {
				if (i < arr.length - 1) {
					return `${s}\n`;
				}
				return s;
			})
			.filter(s => s.length > 0); // Skip last one if empty (it's the only one that could be length 0)
	}
	return [];
}

function translateCellDisplayOutput(output: NotebookCellOutput): JupyterOutput {
	const customMetadata = output.metadata as CellOutputMetadata | undefined;
	let result: JupyterOutput;
	// Possible some other extension added some output (do best effort to translate & save in ipynb).
	// In which case metadata might not contain `outputType`.
	const outputType = customMetadata?.outputType as nbformat.OutputType;
	switch (outputType) {
		case 'error': {
			result = translateCellErrorOutput(output);
			break;
		}
		case 'stream': {
			result = convertStreamOutput(output);
			break;
		}
		case 'display_data': {
			result = {
				output_type: 'display_data',
				data: output.items.reduce((prev: any, curr) => {
					prev[curr.mime] = convertOutputMimeToJupyterOutput(curr.mime, curr.data as Uint8Array);
					return prev;
				}, {}),
				metadata: customMetadata?.metadata || {} // This can never be undefined.
			};
			break;
		}
		case 'execute_result': {
			result = {
				output_type: 'execute_result',
				data: output.items.reduce((prev: any, curr) => {
					prev[curr.mime] = convertOutputMimeToJupyterOutput(curr.mime, curr.data as Uint8Array);
					return prev;
				}, {}),
				metadata: customMetadata?.metadata || {}, // This can never be undefined.
				execution_count:
					typeof customMetadata?.executionCount === 'number' ? customMetadata?.executionCount : null // This can never be undefined, only a number or `null`.
			};
			break;
		}
		case 'update_display_data': {
			result = {
				output_type: 'update_display_data',
				data: output.items.reduce((prev: any, curr) => {
					prev[curr.mime] = convertOutputMimeToJupyterOutput(curr.mime, curr.data as Uint8Array);
					return prev;
				}, {}),
				metadata: customMetadata?.metadata || {} // This can never be undefined.
			};
			break;
		}
		default: {
			const isError =
				output.items.length === 1 && output.items.every((item) => item.mime === CellOutputMimeTypes.error);
			const isStream = output.items.every(
				(item) => item.mime === CellOutputMimeTypes.stderr || item.mime === CellOutputMimeTypes.stdout
			);

			if (isError) {
				return translateCellErrorOutput(output);
			}

			// In the case of .NET & other kernels, we need to ensure we save ipynb correctly.
			// Hence if we have stream output, save the output as Jupyter `stream` else `display_data`
			// Unless we already know its an unknown output type.
			const outputType: nbformat.OutputType =
				<nbformat.OutputType>customMetadata?.outputType || (isStream ? 'stream' : 'display_data');
			let unknownOutput: nbformat.IUnrecognizedOutput | nbformat.IDisplayData | nbformat.IStream;
			if (outputType === 'stream') {
				// If saving as `stream` ensure the mandatory properties are set.
				unknownOutput = convertStreamOutput(output);
			} else if (outputType === 'display_data') {
				// If saving as `display_data` ensure the mandatory properties are set.
				const displayData: nbformat.IDisplayData = {
					data: {},
					metadata: {},
					output_type: 'display_data'
				};
				unknownOutput = displayData;
			} else {
				unknownOutput = {
					output_type: outputType
				};
			}
			if (customMetadata?.metadata) {
				unknownOutput.metadata = customMetadata.metadata;
			}
			if (output.items.length > 0) {
				unknownOutput.data = output.items.reduce((prev: any, curr) => {
					prev[curr.mime] = convertOutputMimeToJupyterOutput(curr.mime, curr.data as Uint8Array);
					return prev;
				}, {});
			}
			result = unknownOutput;
			break;
		}
	}

	// Account for transient data as well
	// `transient.display_id` is used to update cell output in other cells, at least thats one use case we know of.
	if (result && customMetadata && customMetadata.transient) {
		result.transient = customMetadata.transient;
	}
	return result;
}

function translateCellErrorOutput(output: NotebookCellOutput): nbformat.IError {
	// it should have at least one output item
	const firstItem = output.items[0];
	// Bug in VS Code.
	if (!firstItem.data) {
		return {
			output_type: 'error',
			ename: '',
			evalue: '',
			traceback: []
		};
	}
	const originalError: undefined | nbformat.IError = output.metadata?.originalError;
	const value: Error = JSON.parse(textDecoder.decode(firstItem.data));
	return {
		output_type: 'error',
		ename: value.name,
		evalue: value.message,
		// VS Code needs an `Error` object which requires a `stack` property as a string.
		// Its possible the format could change when converting from `traceback` to `string` and back again to `string`
		// When .NET stores errors in output (with their .NET kernel),
		// stack is empty, hence store the message instead of stack (so that somethign gets displayed in ipynb).
		traceback: originalError?.traceback || splitMultilineString(value.stack || value.message || '')
	};
}


function getOutputStreamType(output: NotebookCellOutput): string | undefined {
	if (output.items.length > 0) {
		return output.items[0].mime === CellOutputMimeTypes.stderr ? 'stderr' : 'stdout';
	}

	return;
}

type JupyterOutput =
	| nbformat.IUnrecognizedOutput
	| nbformat.IExecuteResult
	| nbformat.IDisplayData
	| nbformat.IStream
	| nbformat.IError;

function convertStreamOutput(output: NotebookCellOutput): JupyterOutput {
	const outputs: string[] = [];
	output.items
		.filter((opit) => opit.mime === CellOutputMimeTypes.stderr || opit.mime === CellOutputMimeTypes.stdout)
		.map((opit) => textDecoder.decode(opit.data))
		.forEach(value => {
			// Ensure each line is a separate entry in an array (ending with \n).
			const lines = value.split('\n');
			// If the last item in `outputs` is not empty and the first item in `lines` is not empty, then concate them.
			// As they are part of the same line.
			if (outputs.length && lines.length && lines[0].length > 0) {
				outputs[outputs.length - 1] = `${outputs[outputs.length - 1]}${lines.shift()!}`;
			}
			for (const line of lines) {
				outputs.push(line);
			}
		});

	for (let index = 0; index < (outputs.length - 1); index++) {
		outputs[index] = `${outputs[index]}\n`;
	}

	// Skip last one if empty (it's the only one that could be length 0)
	if (outputs.length && outputs[outputs.length - 1].length === 0) {
		outputs.pop();
	}

	const streamType = getOutputStreamType(output) || 'stdout';

	return {
		output_type: 'stream',
		name: streamType,
		text: outputs
	};
}

function convertOutputMimeToJupyterOutput(mime: string, value: Uint8Array) {
	if (!value) {
		return '';
	}
	try {
		if (mime === CellOutputMimeTypes.error) {
			const stringValue = textDecoder.decode(value);
			return JSON.parse(stringValue);
		} else if (mime.startsWith('text/') || textMimeTypes.includes(mime)) {
			const stringValue = textDecoder.decode(value);
			return splitMultilineString(stringValue);
		} else if (mime.startsWith('image/') && mime !== 'image/svg+xml') {
			// Images in Jupyter are stored in base64 encoded format.
			// VS Code expects bytes when rendering images.
			if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
				return Buffer.from(value).toString('base64');
			} else {
				return btoa(value.reduce((s: string, b: number) => s + String.fromCharCode(b), ''));
			}
		} else if (mime.toLowerCase().includes('json')) {
			const stringValue = textDecoder.decode(value);
			return stringValue.length > 0 ? JSON.parse(stringValue) : stringValue;
		} else if (mime === 'image/svg+xml') {
			return splitMultilineString(textDecoder.decode(value));
		} else {
			return textDecoder.decode(value);
		}
	} catch (ex) {
		return '';
	}
}

export function createMarkdownCellFromNotebookCell(cell: NotebookCellData): nbformat.IMarkdownCell {
	const cellMetadata = getCellMetadata({ cell });
	const markdownCell: any = {
		cell_type: 'markdown',
		source: splitCellSourceIntoMultilineString(cell.value),
		metadata: cellMetadata?.metadata || {} // This cannot be empty.
	};
	if (cellMetadata?.attachments) {
		markdownCell.attachments = cellMetadata.attachments;
	}
	if (cellMetadata?.id) {
		markdownCell.id = cellMetadata.id;
	}
	return markdownCell;
}

export function pruneCell(cell: nbformat.ICell): nbformat.ICell {
	// Source is usually a single string on input. Convert back to an array
	const result: nbformat.ICell = {
		...cell,
		source: splitMultilineString(cell.source)
	};

	// Remove outputs and execution_count from non code cells
	if (result.cell_type !== 'code') {
		delete (result as Record<string, unknown>).outputs;
		delete (result as Record<string, unknown>).execution_count;
	} else {
		// Clean outputs from code cells
		result.outputs = result.outputs ? (result.outputs as nbformat.IOutput[]).map(fixupOutput) : [];
	}

	return result;
}
const dummyStreamObj: nbformat.IStream = {
	output_type: 'stream',
	name: 'stdout',
	text: ''
};
const dummyErrorObj: nbformat.IError = {
	output_type: 'error',
	ename: '',
	evalue: '',
	traceback: ['']
};
const dummyDisplayObj: nbformat.IDisplayData = {
	output_type: 'display_data',
	data: {},
	metadata: {}
};
const dummyExecuteResultObj: nbformat.IExecuteResult = {
	output_type: 'execute_result',
	name: '',
	execution_count: 0,
	data: {},
	metadata: {}
};
const AllowedCellOutputKeys = {
	['stream']: new Set(Object.keys(dummyStreamObj)),
	['error']: new Set(Object.keys(dummyErrorObj)),
	['display_data']: new Set(Object.keys(dummyDisplayObj)),
	['execute_result']: new Set(Object.keys(dummyExecuteResultObj))
};

function fixupOutput(output: nbformat.IOutput): nbformat.IOutput {
	let allowedKeys: Set<string>;
	switch (output.output_type) {
		case 'stream':
		case 'error':
		case 'execute_result':
		case 'display_data':
			allowedKeys = AllowedCellOutputKeys[output.output_type];
			break;
		default:
			return output;
	}
	const result = { ...output };
	for (const k of Object.keys(output)) {
		if (!allowedKeys.has(k)) {
			delete result[k];
		}
	}
	return result;
}


export function serializeNotebookToString(data: NotebookData): string {
	const notebookContent = getNotebookMetadata(data);
	// use the preferred language from document metadata or the first cell language as the notebook preferred cell language
	const preferredCellLanguage = notebookContent.metadata?.language_info?.name ?? data.cells.find(cell => cell.kind === 2)?.languageId;

	notebookContent.cells = data.cells
		.map(cell => createJupyterCellFromNotebookCell(cell, preferredCellLanguage))
		.map(pruneCell);

	const indentAmount = data.metadata && typeof data.metadata.indentAmount === 'string' ?
		data.metadata.indentAmount :
		' ';

	return serializeNotebookToJSON(notebookContent, indentAmount);
}
function serializeNotebookToJSON(notebookContent: Partial<nbformat.INotebookContent>, indentAmount: string): string {
	// ipynb always ends with a trailing new line (we add this so that SCMs do not show unnecessary changes, resulting from a missing trailing new line).
	const sorted = sortObjectPropertiesRecursively(notebookContent);

	return JSON.stringify(sorted, undefined, indentAmount) + '\n';
}

export function getNotebookMetadata(document: NotebookDocument | NotebookData) {
	const existingContent: Partial<nbformat.INotebookContent> = document.metadata || {};
	const notebookContent: Partial<nbformat.INotebookContent> = {};
	notebookContent.cells = existingContent.cells || [];
	notebookContent.nbformat = existingContent.nbformat || defaultNotebookFormat.major;
	notebookContent.nbformat_minor = existingContent.nbformat_minor ?? defaultNotebookFormat.minor;
	notebookContent.metadata = existingContent.metadata || {};
	return notebookContent;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/types.d.ts]---
Location: vscode-main/extensions/ipynb/src/types.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module '@enonic/fnv-plus';
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/test/clearOutputs.test.ts]---
Location: vscode-main/extensions/ipynb/src/test/clearOutputs.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as sinon from 'sinon';
import type * as nbformat from '@jupyterlab/nbformat';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { jupyterNotebookModelToNotebookData } from '../deserializers';
import { activate } from '../notebookModelStoreSync';


suite(`ipynb Clear Outputs`, () => {
	const disposables: vscode.Disposable[] = [];
	const context = { subscriptions: disposables } as vscode.ExtensionContext;
	setup(() => {
		disposables.length = 0;
		activate(context);
	});
	teardown(async () => {
		disposables.forEach(d => d.dispose());
		disposables.length = 0;
		sinon.restore();
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');
	});

	test.skip('Clear outputs after opening Notebook', async () => {
		const cells: nbformat.ICell[] = [
			{
				cell_type: 'code',
				execution_count: 10,
				outputs: [{ output_type: 'stream', name: 'stdout', text: ['Hello'] }],
				source: 'print(1)',
				metadata: {}
			},
			{
				cell_type: 'code',
				outputs: [],
				source: 'print(2)',
				metadata: {}
			},
			{
				cell_type: 'markdown',
				source: '# HEAD',
				metadata: {}
			}
		];
		const notebook = jupyterNotebookModelToNotebookData({ cells }, 'python');

		const notebookDocumentPromise = vscode.workspace.openNotebookDocument('jupyter-notebook', notebook);
		await raceTimeout(notebookDocumentPromise, 5000, () => {
			throw new Error('Timeout waiting for notebook to open');
		});
		const notebookDocument = await notebookDocumentPromise;
		await raceTimeout(vscode.window.showNotebookDocument(notebookDocument), 20000, () => {
			throw new Error('Timeout waiting for notebook to open');
		});

		assert.strictEqual(notebookDocument.cellCount, 3);
		assert.strictEqual(notebookDocument.cellAt(0).metadata.execution_count, 10);
		assert.strictEqual(notebookDocument.cellAt(1).metadata.execution_count, null);
		assert.strictEqual(notebookDocument.cellAt(2).metadata.execution_count, undefined);

		// Clear all outputs
		await raceTimeout(vscode.commands.executeCommand('notebook.clearAllCellsOutputs'), 5000, () => {
			throw new Error('Timeout waiting for notebook to clear outputs');
		});

		// Wait for all changes to be applied, could take a few ms.
		const verifyMetadataChanges = () => {
			assert.strictEqual(notebookDocument.cellAt(0).metadata.execution_count, null);
			assert.strictEqual(notebookDocument.cellAt(1).metadata.execution_count, null);
			assert.strictEqual(notebookDocument.cellAt(2).metadata.execution_count, undefined);
		};

		vscode.workspace.onDidChangeNotebookDocument(() => verifyMetadataChanges(), undefined, disposables);

		await new Promise<void>((resolve, reject) => {
			const interval = setInterval(() => {
				try {
					verifyMetadataChanges();
					clearInterval(interval);
					resolve();
				} catch {
					// Ignore
				}
			}, 50);
			disposables.push({ dispose: () => clearInterval(interval) });
			const timeout = setTimeout(() => {
				try {
					verifyMetadataChanges();
					resolve();
				} catch (ex) {
					reject(ex);
				}
			}, 1000);
			disposables.push({ dispose: () => clearTimeout(timeout) });
		});
	});


	// test('Serialize', async () => {
	// 	const markdownCell = new vscode.NotebookCellData(vscode.NotebookCellKind.Markup, '# header1', 'markdown');
	// 	markdownCell.metadata = {
	// 		attachments: {
	// 			'image.png': {
	// 				'image/png': 'abc'
	// 			}
	// 		},
	// 		id: '123',
	// 		metadata: {
	// 			foo: 'bar'
	// 		}
	// 	};

	// 	const cellMetadata = getCellMetadata({ cell: markdownCell });
	// 	assert.deepStrictEqual(cellMetadata, {
	// 		id: '123',
	// 		metadata: {
	// 			foo: 'bar',
	// 		},
	// 		attachments: {
	// 			'image.png': {
	// 				'image/png': 'abc'
	// 			}
	// 		}
	// 	});

	// 	const markdownCell2 = new vscode.NotebookCellData(vscode.NotebookCellKind.Markup, '# header1', 'markdown');
	// 	markdownCell2.metadata = {
	// 		id: '123',
	// 		metadata: {
	// 			foo: 'bar'
	// 		},
	// 		attachments: {
	// 			'image.png': {
	// 				'image/png': 'abc'
	// 			}
	// 		}
	// 	};

	// 	const nbMarkdownCell = createMarkdownCellFromNotebookCell(markdownCell);
	// 	const nbMarkdownCell2 = createMarkdownCellFromNotebookCell(markdownCell2);
	// 	assert.deepStrictEqual(nbMarkdownCell, nbMarkdownCell2);

	// 	assert.deepStrictEqual(nbMarkdownCell, {
	// 		cell_type: 'markdown',
	// 		source: ['# header1'],
	// 		metadata: {
	// 			foo: 'bar',
	// 		},
	// 		attachments: {
	// 			'image.png': {
	// 				'image/png': 'abc'
	// 			}
	// 		},
	// 		id: '123'
	// 	});
	// });

	// suite('Outputs', () => {
	// 	function validateCellOutputTranslation(
	// 		outputs: nbformat.IOutput[],
	// 		expectedOutputs: vscode.NotebookCellOutput[],
	// 		propertiesToExcludeFromComparison: string[] = []
	// 	) {
	// 		const cells: nbformat.ICell[] = [
	// 			{
	// 				cell_type: 'code',
	// 				execution_count: 10,
	// 				outputs,
	// 				source: 'print(1)',
	// 				metadata: {}
	// 			}
	// 		];
	// 		const notebook = jupyterNotebookModelToNotebookData({ cells }, 'python');

	// 		// OutputItems contain an `id` property generated by VSC.
	// 		// Exclude that property when comparing.
	// 		const propertiesToExclude = propertiesToExcludeFromComparison.concat(['id']);
	// 		const actualOuts = notebook.cells[0].outputs;
	// 		deepStripProperties(actualOuts, propertiesToExclude);
	// 		deepStripProperties(expectedOutputs, propertiesToExclude);
	// 		assert.deepStrictEqual(actualOuts, expectedOutputs);
	// 	}

	// 	test('Empty output', () => {
	// 		validateCellOutputTranslation([], []);
	// 	});

	// 	test('Stream output', () => {
	// 		validateCellOutputTranslation(
	// 			[
	// 				{
	// 					output_type: 'stream',
	// 					name: 'stderr',
	// 					text: 'Error'
	// 				},
	// 				{
	// 					output_type: 'stream',
	// 					name: 'stdout',
	// 					text: 'NoError'
	// 				}
	// 			],
	// 			[
	// 				new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stderr('Error')], {
	// 					outputType: 'stream'
	// 				}),
	// 				new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stdout('NoError')], {
	// 					outputType: 'stream'
	// 				})
	// 			]
	// 		);
	// 	});
	// 	test('Stream output and line endings', () => {
	// 		validateCellOutputTranslation(
	// 			[
	// 				{
	// 					output_type: 'stream',
	// 					name: 'stdout',
	// 					text: [
	// 						'Line1\n',
	// 						'\n',
	// 						'Line3\n',
	// 						'Line4'
	// 					]
	// 				}
	// 			],
	// 			[
	// 				new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stdout('Line1\n\nLine3\nLine4')], {
	// 					outputType: 'stream'
	// 				})
	// 			]
	// 		);
	// 		validateCellOutputTranslation(
	// 			[
	// 				{
	// 					output_type: 'stream',
	// 					name: 'stdout',
	// 					text: [
	// 						'Hello\n',
	// 						'Hello\n',
	// 						'Hello\n',
	// 						'Hello\n',
	// 						'Hello\n',
	// 						'Hello\n'
	// 					]
	// 				}
	// 			],
	// 			[
	// 				new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stdout('Hello\nHello\nHello\nHello\nHello\nHello\n')], {
	// 					outputType: 'stream'
	// 				})
	// 			]
	// 		);
	// 	});
	// 	test('Multi-line Stream output', () => {
	// 		validateCellOutputTranslation(
	// 			[
	// 				{
	// 					name: 'stdout',
	// 					output_type: 'stream',
	// 					text: [
	// 						'Epoch 1/5\n',
	// 						'...\n',
	// 						'Epoch 2/5\n',
	// 						'...\n',
	// 						'Epoch 3/5\n',
	// 						'...\n',
	// 						'Epoch 4/5\n',
	// 						'...\n',
	// 						'Epoch 5/5\n',
	// 						'...\n'
	// 					]
	// 				}
	// 			],
	// 			[
	// 				new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stdout(['Epoch 1/5\n',
	// 					'...\n',
	// 					'Epoch 2/5\n',
	// 					'...\n',
	// 					'Epoch 3/5\n',
	// 					'...\n',
	// 					'Epoch 4/5\n',
	// 					'...\n',
	// 					'Epoch 5/5\n',
	// 					'...\n'].join(''))], {
	// 					outputType: 'stream'
	// 				})
	// 			]
	// 		);
	// 	});

	// 	test('Multi-line Stream output (last empty line should not be saved in ipynb)', () => {
	// 		validateCellOutputTranslation(
	// 			[
	// 				{
	// 					name: 'stderr',
	// 					output_type: 'stream',
	// 					text: [
	// 						'Epoch 1/5\n',
	// 						'...\n',
	// 						'Epoch 2/5\n',
	// 						'...\n',
	// 						'Epoch 3/5\n',
	// 						'...\n',
	// 						'Epoch 4/5\n',
	// 						'...\n',
	// 						'Epoch 5/5\n',
	// 						'...\n'
	// 					]
	// 				}
	// 			],
	// 			[
	// 				new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stderr(['Epoch 1/5\n',
	// 					'...\n',
	// 					'Epoch 2/5\n',
	// 					'...\n',
	// 					'Epoch 3/5\n',
	// 					'...\n',
	// 					'Epoch 4/5\n',
	// 					'...\n',
	// 					'Epoch 5/5\n',
	// 					'...\n',
	// 					// This last empty line should not be saved in ipynb.
	// 					'\n'].join(''))], {
	// 					outputType: 'stream'
	// 				})
	// 			]
	// 		);
	// 	});

	// 	test('Streamed text with Ansi characters', async () => {
	// 		validateCellOutputTranslation(
	// 			[
	// 				{
	// 					name: 'stderr',
	// 					text: '\u001b[K\u001b[33m✅ \u001b[0m Loading\n',
	// 					output_type: 'stream'
	// 				}
	// 			],
	// 			[
	// 				new vscode.NotebookCellOutput(
	// 					[vscode.NotebookCellOutputItem.stderr('\u001b[K\u001b[33m✅ \u001b[0m Loading\n')],
	// 					{
	// 						outputType: 'stream'
	// 					}
	// 				)
	// 			]
	// 		);
	// 	});

	// 	test('Streamed text with angle bracket characters', async () => {
	// 		validateCellOutputTranslation(
	// 			[
	// 				{
	// 					name: 'stderr',
	// 					text: '1 is < 2',
	// 					output_type: 'stream'
	// 				}
	// 			],
	// 			[
	// 				new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stderr('1 is < 2')], {
	// 					outputType: 'stream'
	// 				})
	// 			]
	// 		);
	// 	});

	// 	test('Streamed text with angle bracket characters and ansi chars', async () => {
	// 		validateCellOutputTranslation(
	// 			[
	// 				{
	// 					name: 'stderr',
	// 					text: '1 is < 2\u001b[K\u001b[33m✅ \u001b[0m Loading\n',
	// 					output_type: 'stream'
	// 				}
	// 			],
	// 			[
	// 				new vscode.NotebookCellOutput(
	// 					[vscode.NotebookCellOutputItem.stderr('1 is < 2\u001b[K\u001b[33m✅ \u001b[0m Loading\n')],
	// 					{
	// 						outputType: 'stream'
	// 					}
	// 				)
	// 			]
	// 		);
	// 	});

	// 	test('Error', async () => {
	// 		validateCellOutputTranslation(
	// 			[
	// 				{
	// 					ename: 'Error Name',
	// 					evalue: 'Error Value',
	// 					traceback: ['stack1', 'stack2', 'stack3'],
	// 					output_type: 'error'
	// 				}
	// 			],
	// 			[
	// 				new vscode.NotebookCellOutput(
	// 					[
	// 						vscode.NotebookCellOutputItem.error({
	// 							name: 'Error Name',
	// 							message: 'Error Value',
	// 							stack: ['stack1', 'stack2', 'stack3'].join('\n')
	// 						})
	// 					],
	// 					{
	// 						outputType: 'error',
	// 						originalError: {
	// 							ename: 'Error Name',
	// 							evalue: 'Error Value',
	// 							traceback: ['stack1', 'stack2', 'stack3'],
	// 							output_type: 'error'
	// 						}
	// 					}
	// 				)
	// 			]
	// 		);
	// 	});

	// 	['display_data', 'execute_result'].forEach(output_type => {
	// 		suite(`Rich output for output_type = ${output_type}`, () => {
	// 			// Properties to exclude when comparing.
	// 			let propertiesToExcludeFromComparison: string[] = [];
	// 			setup(() => {
	// 				if (output_type === 'display_data') {
	// 					// With display_data the execution_count property will never exist in the output.
	// 					// We can ignore that (as it will never exist).
	// 					// But we leave it in the case of `output_type === 'execute_result'`
	// 					propertiesToExcludeFromComparison = ['execution_count', 'executionCount'];
	// 				}
	// 			});

	// 			test('Text mimeType output', async () => {
	// 				validateCellOutputTranslation(
	// 					[
	// 						{
	// 							data: {
	// 								'text/plain': 'Hello World!'
	// 							},
	// 							output_type,
	// 							metadata: {},
	// 							execution_count: 1
	// 						}
	// 					],
	// 					[
	// 						new vscode.NotebookCellOutput(
	// 							[new vscode.NotebookCellOutputItem(Buffer.from('Hello World!', 'utf8'), 'text/plain')],
	// 							{
	// 								outputType: output_type,
	// 								metadata: {}, // display_data & execute_result always have metadata.
	// 								executionCount: 1
	// 							}
	// 						)
	// 					],
	// 					propertiesToExcludeFromComparison
	// 				);
	// 			});

	// 			test('png,jpeg images', async () => {
	// 				validateCellOutputTranslation(
	// 					[
	// 						{
	// 							execution_count: 1,
	// 							data: {
	// 								'image/png': base64EncodedImage,
	// 								'image/jpeg': base64EncodedImage
	// 							},
	// 							metadata: {},
	// 							output_type
	// 						}
	// 					],
	// 					[
	// 						new vscode.NotebookCellOutput(
	// 							[
	// 								new vscode.NotebookCellOutputItem(Buffer.from(base64EncodedImage, 'base64'), 'image/png'),
	// 								new vscode.NotebookCellOutputItem(Buffer.from(base64EncodedImage, 'base64'), 'image/jpeg')
	// 							],
	// 							{
	// 								executionCount: 1,
	// 								outputType: output_type,
	// 								metadata: {} // display_data & execute_result always have metadata.
	// 							}
	// 						)
	// 					],
	// 					propertiesToExcludeFromComparison
	// 				);
	// 			});

	// 			test('png image with a light background', async () => {
	// 				validateCellOutputTranslation(
	// 					[
	// 						{
	// 							execution_count: 1,
	// 							data: {
	// 								'image/png': base64EncodedImage
	// 							},
	// 							metadata: {
	// 								needs_background: 'light'
	// 							},
	// 							output_type
	// 						}
	// 					],
	// 					[
	// 						new vscode.NotebookCellOutput(
	// 							[new vscode.NotebookCellOutputItem(Buffer.from(base64EncodedImage, 'base64'), 'image/png')],
	// 							{
	// 								executionCount: 1,
	// 								metadata: {
	// 									needs_background: 'light'
	// 								},
	// 								outputType: output_type
	// 							}
	// 						)
	// 					],
	// 					propertiesToExcludeFromComparison
	// 				);
	// 			});

	// 			test('png image with a dark background', async () => {
	// 				validateCellOutputTranslation(
	// 					[
	// 						{
	// 							execution_count: 1,
	// 							data: {
	// 								'image/png': base64EncodedImage
	// 							},
	// 							metadata: {
	// 								needs_background: 'dark'
	// 							},
	// 							output_type
	// 						}
	// 					],
	// 					[
	// 						new vscode.NotebookCellOutput(
	// 							[new vscode.NotebookCellOutputItem(Buffer.from(base64EncodedImage, 'base64'), 'image/png')],
	// 							{
	// 								executionCount: 1,
	// 								metadata: {
	// 									needs_background: 'dark'
	// 								},
	// 								outputType: output_type
	// 							}
	// 						)
	// 					],
	// 					propertiesToExcludeFromComparison
	// 				);
	// 			});

	// 			test('png image with custom dimensions', async () => {
	// 				validateCellOutputTranslation(
	// 					[
	// 						{
	// 							execution_count: 1,
	// 							data: {
	// 								'image/png': base64EncodedImage
	// 							},
	// 							metadata: {
	// 								'image/png': { height: '111px', width: '999px' }
	// 							},
	// 							output_type
	// 						}
	// 					],
	// 					[
	// 						new vscode.NotebookCellOutput(
	// 							[new vscode.NotebookCellOutputItem(Buffer.from(base64EncodedImage, 'base64'), 'image/png')],
	// 							{
	// 								executionCount: 1,
	// 								metadata: {
	// 									'image/png': { height: '111px', width: '999px' }
	// 								},
	// 								outputType: output_type
	// 							}
	// 						)
	// 					],
	// 					propertiesToExcludeFromComparison
	// 				);
	// 			});

	// 			test('png allowed to scroll', async () => {
	// 				validateCellOutputTranslation(
	// 					[
	// 						{
	// 							execution_count: 1,
	// 							data: {
	// 								'image/png': base64EncodedImage
	// 							},
	// 							metadata: {
	// 								unconfined: true,
	// 								'image/png': { width: '999px' }
	// 							},
	// 							output_type
	// 						}
	// 					],
	// 					[
	// 						new vscode.NotebookCellOutput(
	// 							[new vscode.NotebookCellOutputItem(Buffer.from(base64EncodedImage, 'base64'), 'image/png')],
	// 							{
	// 								executionCount: 1,
	// 								metadata: {
	// 									unconfined: true,
	// 									'image/png': { width: '999px' }
	// 								},
	// 								outputType: output_type
	// 							}
	// 						)
	// 					],
	// 					propertiesToExcludeFromComparison
	// 				);
	// 			});
	// 		});
	// 	});
	// });

	// suite('Output Order', () => {
	// 	test('Verify order of outputs', async () => {
	// 		const dataAndExpectedOrder: { output: nbformat.IDisplayData; expectedMimeTypesOrder: string[] }[] = [
	// 			{
	// 				output: {
	// 					data: {
	// 						'application/vnd.vegalite.v4+json': 'some json',
	// 						'text/html': '<a>Hello</a>'
	// 					},
	// 					metadata: {},
	// 					output_type: 'display_data'
	// 				},
	// 				expectedMimeTypesOrder: ['application/vnd.vegalite.v4+json', 'text/html']
	// 			},
	// 			{
	// 				output: {
	// 					data: {
	// 						'application/vnd.vegalite.v4+json': 'some json',
	// 						'application/javascript': 'some js',
	// 						'text/plain': 'some text',
	// 						'text/html': '<a>Hello</a>'
	// 					},
	// 					metadata: {},
	// 					output_type: 'display_data'
	// 				},
	// 				expectedMimeTypesOrder: [
	// 					'application/vnd.vegalite.v4+json',
	// 					'text/html',
	// 					'application/javascript',
	// 					'text/plain'
	// 				]
	// 			},
	// 			{
	// 				output: {
	// 					data: {
	// 						'application/vnd.vegalite.v4+json': '', // Empty, should give preference to other mimetypes.
	// 						'application/javascript': 'some js',
	// 						'text/plain': 'some text',
	// 						'text/html': '<a>Hello</a>'
	// 					},
	// 					metadata: {},
	// 					output_type: 'display_data'
	// 				},
	// 				expectedMimeTypesOrder: [
	// 					'text/html',
	// 					'application/javascript',
	// 					'text/plain',
	// 					'application/vnd.vegalite.v4+json'
	// 				]
	// 			},
	// 			{
	// 				output: {
	// 					data: {
	// 						'text/plain': 'some text',
	// 						'text/html': '<a>Hello</a>'
	// 					},
	// 					metadata: {},
	// 					output_type: 'display_data'
	// 				},
	// 				expectedMimeTypesOrder: ['text/html', 'text/plain']
	// 			},
	// 			{
	// 				output: {
	// 					data: {
	// 						'application/javascript': 'some js',
	// 						'text/plain': 'some text'
	// 					},
	// 					metadata: {},
	// 					output_type: 'display_data'
	// 				},
	// 				expectedMimeTypesOrder: ['application/javascript', 'text/plain']
	// 			},
	// 			{
	// 				output: {
	// 					data: {
	// 						'image/svg+xml': 'some svg',
	// 						'text/plain': 'some text'
	// 					},
	// 					metadata: {},
	// 					output_type: 'display_data'
	// 				},
	// 				expectedMimeTypesOrder: ['image/svg+xml', 'text/plain']
	// 			},
	// 			{
	// 				output: {
	// 					data: {
	// 						'text/latex': 'some latex',
	// 						'text/plain': 'some text'
	// 					},
	// 					metadata: {},
	// 					output_type: 'display_data'
	// 				},
	// 				expectedMimeTypesOrder: ['text/latex', 'text/plain']
	// 			},
	// 			{
	// 				output: {
	// 					data: {
	// 						'application/vnd.jupyter.widget-view+json': 'some widget',
	// 						'text/plain': 'some text'
	// 					},
	// 					metadata: {},
	// 					output_type: 'display_data'
	// 				},
	// 				expectedMimeTypesOrder: ['application/vnd.jupyter.widget-view+json', 'text/plain']
	// 			},
	// 			{
	// 				output: {
	// 					data: {
	// 						'text/plain': 'some text',
	// 						'image/svg+xml': 'some svg',
	// 						'image/png': 'some png'
	// 					},
	// 					metadata: {},
	// 					output_type: 'display_data'
	// 				},
	// 				expectedMimeTypesOrder: ['image/png', 'image/svg+xml', 'text/plain']
	// 			}
	// 		];

	// 		dataAndExpectedOrder.forEach(({ output, expectedMimeTypesOrder }) => {
	// 			const sortedOutputs = jupyterCellOutputToCellOutput(output);
	// 			const mimeTypes = sortedOutputs.items.map((item) => item.mime).join(',');
	// 			assert.equal(mimeTypes, expectedMimeTypesOrder.join(','));
	// 		});
	// 	});
	// });
});

function raceTimeout<T>(promise: Thenable<T>, timeout: number, onTimeout?: () => void): Promise<T | undefined> {
	let promiseResolve: ((value: T | undefined) => void) | undefined = undefined;

	const timer = setTimeout(() => {
		promiseResolve?.(undefined);
		onTimeout?.();
	}, timeout);

	return Promise.race([
		Promise.resolve(promise).then(
			result => {
				clearTimeout(timer);
				return result;
			},
			err => {
				clearTimeout(timer);
				throw err;
			}
		),
		new Promise<T | undefined>(resolve => promiseResolve = resolve)
	]);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/test/index.ts]---
Location: vscode-main/extensions/ipynb/src/test/index.ts

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
	suite = `${process.env.VSCODE_BROWSER} Browser Integration .ipynb Tests`;
} else if (process.env.REMOTE_VSCODE) {
	suite = 'Remote Integration .ipynb Tests';
} else {
	suite = 'Integration .ipynb Tests';
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

---[FILE: extensions/ipynb/src/test/notebookModelStoreSync.test.ts]---
Location: vscode-main/extensions/ipynb/src/test/notebookModelStoreSync.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as sinon from 'sinon';
import { CancellationTokenSource, Disposable, EventEmitter, ExtensionContext, NotebookCellKind, NotebookDocumentChangeEvent, NotebookDocumentWillSaveEvent, NotebookEdit, NotebookRange, TextDocument, TextDocumentSaveReason, workspace, type CancellationToken, type NotebookCell, type NotebookDocument, type WorkspaceEdit, type WorkspaceEditMetadata } from 'vscode';
import { activate } from '../notebookModelStoreSync';

suite(`Notebook Model Store Sync`, () => {
	let disposables: Disposable[] = [];
	let onDidChangeNotebookDocument: EventEmitter<NotebookDocumentChangeEvent>;
	let onWillSaveNotebookDocument: AsyncEmitter<NotebookDocumentWillSaveEvent>;
	let notebook: NotebookDocument;
	let token: CancellationTokenSource;
	let editsApplied: WorkspaceEdit[] = [];
	let pendingPromises: Promise<void>[] = [];
	let cellMetadataUpdates: NotebookEdit[] = [];
	let applyEditStub: sinon.SinonStub<[edit: WorkspaceEdit, metadata?: WorkspaceEditMetadata | undefined], Thenable<boolean>>;
	setup(() => {
		disposables = [];
		notebook = {
			notebookType: '',
			metadata: {}
		} as NotebookDocument;
		token = new CancellationTokenSource();
		disposables.push(token);
		sinon.stub(notebook, 'notebookType').get(() => 'jupyter-notebook');
		applyEditStub = sinon.stub(workspace, 'applyEdit').callsFake((edit: WorkspaceEdit) => {
			editsApplied.push(edit);
			return Promise.resolve(true);
		});
		const context = { subscriptions: [] as Disposable[] } as ExtensionContext;
		onDidChangeNotebookDocument = new EventEmitter<NotebookDocumentChangeEvent>();
		disposables.push(onDidChangeNotebookDocument);
		onWillSaveNotebookDocument = new AsyncEmitter<NotebookDocumentWillSaveEvent>();

		const stub = sinon.stub(NotebookEdit, 'updateCellMetadata').callsFake((index, metadata) => {
			const edit = stub.wrappedMethod.call(NotebookEdit, index, metadata);
			cellMetadataUpdates.push(edit);
			return edit;
		}
		);
		sinon.stub(workspace, 'onDidChangeNotebookDocument').callsFake(cb =>
			onDidChangeNotebookDocument.event(cb)
		);
		sinon.stub(workspace, 'onWillSaveNotebookDocument').callsFake(cb =>
			onWillSaveNotebookDocument.event(cb)
		);
		activate(context);
	});
	teardown(async () => {
		await Promise.allSettled(pendingPromises);
		editsApplied = [];
		pendingPromises = [];
		cellMetadataUpdates = [];
		disposables.forEach(d => d.dispose());
		disposables = [];
		sinon.restore();
	});

	test('Empty cell will not result in any updates', async () => {
		const e: NotebookDocumentChangeEvent = {
			notebook,
			metadata: undefined,
			contentChanges: [],
			cellChanges: []
		};

		onDidChangeNotebookDocument.fire(e);

		assert.strictEqual(editsApplied.length, 0);
	});
	test('Adding cell for non Jupyter Notebook will not result in any updates', async () => {
		sinon.stub(notebook, 'notebookType').get(() => 'some-other-type');
		const cell: NotebookCell = {
			document: {} as unknown as TextDocument,
			executionSummary: {},
			index: 0,
			kind: NotebookCellKind.Code,
			metadata: {},
			notebook,
			outputs: []
		};
		const e: NotebookDocumentChangeEvent = {
			notebook,
			metadata: undefined,
			contentChanges: [
				{
					range: new NotebookRange(0, 0),
					removedCells: [],
					addedCells: [cell]
				}
			],
			cellChanges: []
		};

		onDidChangeNotebookDocument.fire(e);

		assert.strictEqual(editsApplied.length, 0);
		assert.strictEqual(cellMetadataUpdates.length, 0);
	});
	test('Adding cell to nbformat 4.2 notebook will result in adding empty metadata', async () => {
		sinon.stub(notebook, 'metadata').get(() => ({ nbformat: 4, nbformat_minor: 2 }));
		const cell: NotebookCell = {
			document: {} as unknown as TextDocument,
			executionSummary: {},
			index: 0,
			kind: NotebookCellKind.Code,
			metadata: {},
			notebook,
			outputs: []
		};
		const e: NotebookDocumentChangeEvent = {
			notebook,
			metadata: undefined,
			contentChanges: [
				{
					range: new NotebookRange(0, 0),
					removedCells: [],
					addedCells: [cell]
				}
			],
			cellChanges: []
		};

		onDidChangeNotebookDocument.fire(e);

		assert.strictEqual(editsApplied.length, 1);
		assert.strictEqual(cellMetadataUpdates.length, 1);
		const newMetadata = cellMetadataUpdates[0].newCellMetadata;
		assert.deepStrictEqual(newMetadata, { execution_count: null, metadata: {} });
	});
	test('Added cell will have a cell id if nbformat is 4.5', async () => {
		sinon.stub(notebook, 'metadata').get(() => ({ nbformat: 4, nbformat_minor: 5 }));
		const cell: NotebookCell = {
			document: {} as unknown as TextDocument,
			executionSummary: {},
			index: 0,
			kind: NotebookCellKind.Code,
			metadata: {},
			notebook,
			outputs: []
		};
		const e: NotebookDocumentChangeEvent = {
			notebook,
			metadata: undefined,
			contentChanges: [
				{
					range: new NotebookRange(0, 0),
					removedCells: [],
					addedCells: [cell]
				}
			],
			cellChanges: []
		};

		onDidChangeNotebookDocument.fire(e);

		assert.strictEqual(editsApplied.length, 1);
		assert.strictEqual(cellMetadataUpdates.length, 1);
		const newMetadata = cellMetadataUpdates[0].newCellMetadata || {};
		assert.strictEqual(Object.keys(newMetadata).length, 3);
		assert.deepStrictEqual(newMetadata.execution_count, null);
		assert.deepStrictEqual(newMetadata.metadata, {});
		assert.ok(newMetadata.id);
	});
	test('Do not add cell id if one already exists', async () => {
		sinon.stub(notebook, 'metadata').get(() => ({ nbformat: 4, nbformat_minor: 5 }));
		const cell: NotebookCell = {
			document: {} as unknown as TextDocument,
			executionSummary: {},
			index: 0,
			kind: NotebookCellKind.Code,
			metadata: {
				id: '1234'
			},
			notebook,
			outputs: []
		};
		const e: NotebookDocumentChangeEvent = {
			notebook,
			metadata: undefined,
			contentChanges: [
				{
					range: new NotebookRange(0, 0),
					removedCells: [],
					addedCells: [cell]
				}
			],
			cellChanges: []
		};

		onDidChangeNotebookDocument.fire(e);

		assert.strictEqual(editsApplied.length, 1);
		assert.strictEqual(cellMetadataUpdates.length, 1);
		const newMetadata = cellMetadataUpdates[0].newCellMetadata || {};
		assert.strictEqual(Object.keys(newMetadata).length, 3);
		assert.deepStrictEqual(newMetadata.execution_count, null);
		assert.deepStrictEqual(newMetadata.metadata, {});
		assert.strictEqual(newMetadata.id, '1234');
	});
	test('Do not perform any updates if cell id and metadata exists', async () => {
		sinon.stub(notebook, 'metadata').get(() => ({ nbformat: 4, nbformat_minor: 5 }));
		const cell: NotebookCell = {
			document: {} as unknown as TextDocument,
			executionSummary: {},
			index: 0,
			kind: NotebookCellKind.Code,
			metadata: {
				id: '1234',
				metadata: {}
			},
			notebook,
			outputs: []
		};
		const e: NotebookDocumentChangeEvent = {
			notebook,
			metadata: undefined,
			contentChanges: [
				{
					range: new NotebookRange(0, 0),
					removedCells: [],
					addedCells: [cell]
				}
			],
			cellChanges: []
		};

		onDidChangeNotebookDocument.fire(e);

		assert.strictEqual(editsApplied.length, 0);
		assert.strictEqual(cellMetadataUpdates.length, 0);
	});
	test('Store language id in custom metadata, whilst preserving existing metadata', async () => {
		sinon.stub(notebook, 'metadata').get(() => ({
			nbformat: 4, nbformat_minor: 5,
			metadata: {
				language_info: { name: 'python' }
			}
		}));
		const cell: NotebookCell = {
			document: {
				languageId: 'javascript'
			} as unknown as TextDocument,
			executionSummary: {},
			index: 0,
			kind: NotebookCellKind.Code,
			metadata: {
				id: '1234',
				metadata: {
					collapsed: true, scrolled: true
				}
			},
			notebook,
			outputs: []
		};
		const e: NotebookDocumentChangeEvent = {
			notebook,
			metadata: undefined,
			contentChanges: [],
			cellChanges: [
				{
					cell,
					document: {
						languageId: 'javascript'
					} as unknown as TextDocument,
					metadata: undefined,
					outputs: undefined,
					executionSummary: undefined
				}
			]
		};

		onDidChangeNotebookDocument.fire(e);

		assert.strictEqual(editsApplied.length, 1);
		assert.strictEqual(cellMetadataUpdates.length, 1);
		const newMetadata = cellMetadataUpdates[0].newCellMetadata || {};
		assert.strictEqual(Object.keys(newMetadata).length, 3);
		assert.deepStrictEqual(newMetadata.execution_count, null);
		assert.deepStrictEqual(newMetadata.metadata, { collapsed: true, scrolled: true, vscode: { languageId: 'javascript' } });
		assert.strictEqual(newMetadata.id, '1234');
	});
	test('No changes when language is javascript', async () => {
		sinon.stub(notebook, 'metadata').get(() => ({
			nbformat: 4, nbformat_minor: 5,
			metadata: {
				language_info: { name: 'javascript' }
			}
		}));
		const cell: NotebookCell = {
			document: {
				languageId: 'javascript'
			} as unknown as TextDocument,
			executionSummary: {},
			index: 0,
			kind: NotebookCellKind.Code,
			metadata: {
				id: '1234',
				metadata: {
					collapsed: true, scrolled: true
				}
			},
			notebook,
			outputs: []
		};
		const e: NotebookDocumentChangeEvent = {
			notebook,
			metadata: undefined,
			contentChanges: [],
			cellChanges: [
				{
					cell,
					document: undefined,
					metadata: undefined,
					outputs: undefined,
					executionSummary: undefined
				}
			]
		};

		onDidChangeNotebookDocument.fire(e);

		assert.strictEqual(editsApplied.length, 0);
		assert.strictEqual(cellMetadataUpdates.length, 0);
	});
	test('Remove language from metadata when cell language matches kernel language', async () => {
		sinon.stub(notebook, 'metadata').get(() => ({
			nbformat: 4, nbformat_minor: 5,
			metadata: {
				language_info: { name: 'javascript' }
			}
		}));
		const cell: NotebookCell = {
			document: {
				languageId: 'javascript'
			} as unknown as TextDocument,
			executionSummary: {},
			index: 0,
			kind: NotebookCellKind.Code,
			metadata: {
				id: '1234',
				metadata: {
					vscode: { languageId: 'python' },
					collapsed: true, scrolled: true
				}
			},
			notebook,
			outputs: []
		};
		const e: NotebookDocumentChangeEvent = {
			notebook,
			metadata: undefined,
			contentChanges: [],
			cellChanges: [
				{
					cell,
					document: {
						languageId: 'javascript'
					} as unknown as TextDocument,
					metadata: undefined,
					outputs: undefined,
					executionSummary: undefined
				}
			]
		};

		onDidChangeNotebookDocument.fire(e);

		assert.strictEqual(editsApplied.length, 1);
		assert.strictEqual(cellMetadataUpdates.length, 1);
		const newMetadata = cellMetadataUpdates[0].newCellMetadata || {};
		assert.strictEqual(Object.keys(newMetadata).length, 3);
		assert.deepStrictEqual(newMetadata.execution_count, null);
		assert.deepStrictEqual(newMetadata.metadata, { collapsed: true, scrolled: true });
		assert.strictEqual(newMetadata.id, '1234');
	});
	test('Update language in metadata', async () => {
		sinon.stub(notebook, 'metadata').get(() => ({
			nbformat: 4, nbformat_minor: 5,
			metadata: {
				language_info: { name: 'javascript' }
			}
		}));
		const cell: NotebookCell = {
			document: {
				languageId: 'powershell'
			} as unknown as TextDocument,
			executionSummary: {},
			index: 0,
			kind: NotebookCellKind.Code,
			metadata: {
				id: '1234',
				metadata: {
					vscode: { languageId: 'python' },
					collapsed: true, scrolled: true
				}
			},
			notebook,
			outputs: []
		};
		const e: NotebookDocumentChangeEvent = {
			notebook,
			metadata: undefined,
			contentChanges: [],
			cellChanges: [
				{
					cell,
					document: {
						languageId: 'powershell'
					} as unknown as TextDocument,
					metadata: undefined,
					outputs: undefined,
					executionSummary: undefined
				}
			]
		};

		onDidChangeNotebookDocument.fire(e);

		assert.strictEqual(editsApplied.length, 1);
		assert.strictEqual(cellMetadataUpdates.length, 1);
		const newMetadata = cellMetadataUpdates[0].newCellMetadata || {};
		assert.strictEqual(Object.keys(newMetadata).length, 3);
		assert.deepStrictEqual(newMetadata.execution_count, null);
		assert.deepStrictEqual(newMetadata.metadata, { collapsed: true, scrolled: true, vscode: { languageId: 'powershell' } });
		assert.strictEqual(newMetadata.id, '1234');
	});

	test('Will save event without any changes', async () => {
		await onWillSaveNotebookDocument.fireAsync({ notebook, reason: TextDocumentSaveReason.Manual }, token.token);
	});
	test('Wait for pending updates to complete when saving', async () => {
		let resolveApplyEditPromise: (value: boolean) => void;
		const promise = new Promise<boolean>((resolve) => resolveApplyEditPromise = resolve);
		applyEditStub.restore();
		sinon.stub(workspace, 'applyEdit').callsFake((edit: WorkspaceEdit) => {
			editsApplied.push(edit);
			return promise;
		});

		const cell: NotebookCell = {
			document: {} as unknown as TextDocument,
			executionSummary: {},
			index: 0,
			kind: NotebookCellKind.Code,
			metadata: {},
			notebook,
			outputs: []
		};
		const e: NotebookDocumentChangeEvent = {
			notebook,
			metadata: undefined,
			contentChanges: [
				{
					range: new NotebookRange(0, 0),
					removedCells: [],
					addedCells: [cell]
				}
			],
			cellChanges: []
		};

		onDidChangeNotebookDocument.fire(e);

		assert.strictEqual(editsApplied.length, 1);
		assert.strictEqual(cellMetadataUpdates.length, 1);

		// Try to save.
		let saveCompleted = false;
		const saved = onWillSaveNotebookDocument.fireAsync({
			notebook,
			reason: TextDocumentSaveReason.Manual
		}, token.token);
		saved.finally(() => saveCompleted = true);
		await new Promise((resolve) => setTimeout(resolve, 10));

		// Verify we have not yet completed saving.
		assert.strictEqual(saveCompleted, false);

		resolveApplyEditPromise!(true);
		await new Promise((resolve) => setTimeout(resolve, 1));

		// Should have completed saving.
		saved.finally(() => saveCompleted = true);
	});

	interface IWaitUntil {
		token: CancellationToken;
		waitUntil(thenable: Promise<unknown>): void;
	}

	interface IWaitUntil {
		token: CancellationToken;
		waitUntil(thenable: Promise<unknown>): void;
	}
	type IWaitUntilData<T> = Omit<Omit<T, 'waitUntil'>, 'token'>;

	class AsyncEmitter<T extends IWaitUntil> {
		private listeners: ((d: T) => void)[] = [];
		get event(): (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]) => Disposable {

			return (listener, thisArgs, _disposables) => {
				this.listeners.push(listener.bind(thisArgs));
				return {
					dispose: () => {
						//
					}
				};
			};
		}
		dispose() {
			this.listeners = [];
		}
		async fireAsync(data: IWaitUntilData<T>, token: CancellationToken): Promise<void> {
			if (!this.listeners.length) {
				return;
			}

			const promises: Promise<unknown>[] = [];
			this.listeners.forEach(cb => {
				const event = {
					...data,
					token,
					waitUntil: (thenable: Promise<WorkspaceEdit>) => {
						promises.push(thenable);
					}
				} as T;
				cb(event);
			});

			await Promise.all(promises);
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/test/serializers.test.ts]---
Location: vscode-main/extensions/ipynb/src/test/serializers.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as sinon from 'sinon';
import type * as nbformat from '@jupyterlab/nbformat';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { jupyterCellOutputToCellOutput, jupyterNotebookModelToNotebookData } from '../deserializers';
import { createMarkdownCellFromNotebookCell, getCellMetadata } from '../serializers';

function deepStripProperties(obj: any, props: string[]) {
	for (const prop in obj) {
		if (obj[prop]) {
			delete obj[prop];
		} else if (typeof obj[prop] === 'object') {
			deepStripProperties(obj[prop], props);
		}
	}
}
suite(`ipynb serializer`, () => {
	let disposables: vscode.Disposable[] = [];
	setup(() => {
		disposables = [];
	});
	teardown(async () => {
		disposables.forEach(d => d.dispose());
		disposables = [];
		sinon.restore();
	});

	const base64EncodedImage =
		'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOUlZL6DwAB/wFSU1jVmgAAAABJRU5ErkJggg==';
	test('Deserialize', async () => {
		const cells: nbformat.ICell[] = [
			{
				cell_type: 'code',
				execution_count: 10,
				outputs: [],
				source: 'print(1)',
				metadata: {}
			},
			{
				cell_type: 'code',
				outputs: [],
				source: 'print(2)',
				metadata: {}
			},
			{
				cell_type: 'markdown',
				source: '# HEAD',
				metadata: {}
			}
		];
		const notebook = jupyterNotebookModelToNotebookData({ cells }, 'python');
		assert.ok(notebook);

		const expectedCodeCell = new vscode.NotebookCellData(vscode.NotebookCellKind.Code, 'print(1)', 'python');
		expectedCodeCell.outputs = [];
		expectedCodeCell.metadata = { execution_count: 10, metadata: {} };
		expectedCodeCell.executionSummary = { executionOrder: 10 };

		const expectedCodeCell2 = new vscode.NotebookCellData(vscode.NotebookCellKind.Code, 'print(2)', 'python');
		expectedCodeCell2.outputs = [];
		expectedCodeCell2.metadata = { execution_count: null, metadata: {} };
		expectedCodeCell2.executionSummary = {};

		const expectedMarkdownCell = new vscode.NotebookCellData(vscode.NotebookCellKind.Markup, '# HEAD', 'markdown');
		expectedMarkdownCell.outputs = [];
		expectedMarkdownCell.metadata = {
			metadata: {}
		};

		assert.deepStrictEqual(notebook.cells, [expectedCodeCell, expectedCodeCell2, expectedMarkdownCell]);
	});

	test('Deserialize cells without metadata field', async () => {
		// Test case for issue where cells without metadata field cause "Cannot read properties of undefined" error
		const cells: nbformat.ICell[] = [
			{
				cell_type: 'code',
				execution_count: 10,
				outputs: [],
				source: 'print(1)'
			},
			{
				cell_type: 'code',
				outputs: [],
				source: 'print(2)'
			},
			{
				cell_type: 'markdown',
				source: '# HEAD'
			}
		] as unknown as nbformat.ICell[];
		const notebook = jupyterNotebookModelToNotebookData({ cells }, 'python');
		assert.ok(notebook);
		assert.strictEqual(notebook.cells.length, 3);

		// First cell with execution count
		const cell1 = notebook.cells[0];
		assert.strictEqual(cell1.kind, vscode.NotebookCellKind.Code);
		assert.strictEqual(cell1.value, 'print(1)');
		assert.strictEqual(cell1.languageId, 'python');
		assert.ok(cell1.metadata);
		assert.strictEqual(cell1.metadata.execution_count, 10);
		assert.deepStrictEqual(cell1.executionSummary, { executionOrder: 10 });

		// Second cell without execution count
		const cell2 = notebook.cells[1];
		assert.strictEqual(cell2.kind, vscode.NotebookCellKind.Code);
		assert.strictEqual(cell2.value, 'print(2)');
		assert.strictEqual(cell2.languageId, 'python');
		assert.ok(cell2.metadata);
		assert.strictEqual(cell2.metadata.execution_count, null);
		assert.deepStrictEqual(cell2.executionSummary, {});

		// Markdown cell
		const cell3 = notebook.cells[2];
		assert.strictEqual(cell3.kind, vscode.NotebookCellKind.Markup);
		assert.strictEqual(cell3.value, '# HEAD');
		assert.strictEqual(cell3.languageId, 'markdown');
	});

	test('Serialize', async () => {
		const markdownCell = new vscode.NotebookCellData(vscode.NotebookCellKind.Markup, '# header1', 'markdown');
		markdownCell.metadata = {
			attachments: {
				'image.png': {
					'image/png': 'abc'
				}
			},
			id: '123',
			metadata: {
				foo: 'bar'
			}
		};

		const cellMetadata = getCellMetadata({ cell: markdownCell });
		assert.deepStrictEqual(cellMetadata, {
			id: '123',
			metadata: {
				foo: 'bar',
			},
			attachments: {
				'image.png': {
					'image/png': 'abc'
				}
			}
		});

		const markdownCell2 = new vscode.NotebookCellData(vscode.NotebookCellKind.Markup, '# header1', 'markdown');
		markdownCell2.metadata = {
			id: '123',
			metadata: {
				foo: 'bar'
			},
			attachments: {
				'image.png': {
					'image/png': 'abc'
				}
			}
		};

		const nbMarkdownCell = createMarkdownCellFromNotebookCell(markdownCell);
		const nbMarkdownCell2 = createMarkdownCellFromNotebookCell(markdownCell2);
		assert.deepStrictEqual(nbMarkdownCell, nbMarkdownCell2);

		assert.deepStrictEqual(nbMarkdownCell, {
			cell_type: 'markdown',
			source: ['# header1'],
			metadata: {
				foo: 'bar',
			},
			attachments: {
				'image.png': {
					'image/png': 'abc'
				}
			},
			id: '123'
		});
	});

	suite('Outputs', () => {
		function validateCellOutputTranslation(
			outputs: nbformat.IOutput[],
			expectedOutputs: vscode.NotebookCellOutput[],
			propertiesToExcludeFromComparison: string[] = []
		) {
			const cells: nbformat.ICell[] = [
				{
					cell_type: 'code',
					execution_count: 10,
					outputs,
					source: 'print(1)',
					metadata: {}
				}
			];
			const notebook = jupyterNotebookModelToNotebookData({ cells }, 'python');

			// OutputItems contain an `id` property generated by VSC.
			// Exclude that property when comparing.
			const propertiesToExclude = propertiesToExcludeFromComparison.concat(['id']);
			const actualOuts = notebook.cells[0].outputs;
			deepStripProperties(actualOuts, propertiesToExclude);
			deepStripProperties(expectedOutputs, propertiesToExclude);
			assert.deepStrictEqual(actualOuts, expectedOutputs);
		}

		test('Empty output', () => {
			validateCellOutputTranslation([], []);
		});

		test('Stream output', () => {
			validateCellOutputTranslation(
				[
					{
						output_type: 'stream',
						name: 'stderr',
						text: 'Error'
					},
					{
						output_type: 'stream',
						name: 'stdout',
						text: 'NoError'
					}
				],
				[
					new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stderr('Error')], {
						outputType: 'stream'
					}),
					new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stdout('NoError')], {
						outputType: 'stream'
					})
				]
			);
		});
		test('Stream output and line endings', () => {
			validateCellOutputTranslation(
				[
					{
						output_type: 'stream',
						name: 'stdout',
						text: [
							'Line1\n',
							'\n',
							'Line3\n',
							'Line4'
						]
					}
				],
				[
					new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stdout('Line1\n\nLine3\nLine4')], {
						outputType: 'stream'
					})
				]
			);
			validateCellOutputTranslation(
				[
					{
						output_type: 'stream',
						name: 'stdout',
						text: [
							'Hello\n',
							'Hello\n',
							'Hello\n',
							'Hello\n',
							'Hello\n',
							'Hello\n'
						]
					}
				],
				[
					new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stdout('Hello\nHello\nHello\nHello\nHello\nHello\n')], {
						outputType: 'stream'
					})
				]
			);
		});
		test('Multi-line Stream output', () => {
			validateCellOutputTranslation(
				[
					{
						name: 'stdout',
						output_type: 'stream',
						text: [
							'Epoch 1/5\n',
							'...\n',
							'Epoch 2/5\n',
							'...\n',
							'Epoch 3/5\n',
							'...\n',
							'Epoch 4/5\n',
							'...\n',
							'Epoch 5/5\n',
							'...\n'
						]
					}
				],
				[
					new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stdout(['Epoch 1/5\n',
						'...\n',
						'Epoch 2/5\n',
						'...\n',
						'Epoch 3/5\n',
						'...\n',
						'Epoch 4/5\n',
						'...\n',
						'Epoch 5/5\n',
						'...\n'].join(''))], {
						outputType: 'stream'
					})
				]
			);
		});

		test('Multi-line Stream output (last empty line should not be saved in ipynb)', () => {
			validateCellOutputTranslation(
				[
					{
						name: 'stderr',
						output_type: 'stream',
						text: [
							'Epoch 1/5\n',
							'...\n',
							'Epoch 2/5\n',
							'...\n',
							'Epoch 3/5\n',
							'...\n',
							'Epoch 4/5\n',
							'...\n',
							'Epoch 5/5\n',
							'...\n'
						]
					}
				],
				[
					new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stderr(['Epoch 1/5\n',
						'...\n',
						'Epoch 2/5\n',
						'...\n',
						'Epoch 3/5\n',
						'...\n',
						'Epoch 4/5\n',
						'...\n',
						'Epoch 5/5\n',
						'...\n',
						// This last empty line should not be saved in ipynb.
						'\n'].join(''))], {
						outputType: 'stream'
					})
				]
			);
		});

		test('Streamed text with Ansi characters', async () => {
			validateCellOutputTranslation(
				[
					{
						name: 'stderr',
						text: '\u001b[K\u001b[33m✅ \u001b[0m Loading\n',
						output_type: 'stream'
					}
				],
				[
					new vscode.NotebookCellOutput(
						[vscode.NotebookCellOutputItem.stderr('\u001b[K\u001b[33m✅ \u001b[0m Loading\n')],
						{
							outputType: 'stream'
						}
					)
				]
			);
		});

		test('Streamed text with angle bracket characters', async () => {
			validateCellOutputTranslation(
				[
					{
						name: 'stderr',
						text: '1 is < 2',
						output_type: 'stream'
					}
				],
				[
					new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stderr('1 is < 2')], {
						outputType: 'stream'
					})
				]
			);
		});

		test('Streamed text with angle bracket characters and ansi chars', async () => {
			validateCellOutputTranslation(
				[
					{
						name: 'stderr',
						text: '1 is < 2\u001b[K\u001b[33m✅ \u001b[0m Loading\n',
						output_type: 'stream'
					}
				],
				[
					new vscode.NotebookCellOutput(
						[vscode.NotebookCellOutputItem.stderr('1 is < 2\u001b[K\u001b[33m✅ \u001b[0m Loading\n')],
						{
							outputType: 'stream'
						}
					)
				]
			);
		});

		test('Error', async () => {
			validateCellOutputTranslation(
				[
					{
						ename: 'Error Name',
						evalue: 'Error Value',
						traceback: ['stack1', 'stack2', 'stack3'],
						output_type: 'error'
					}
				],
				[
					new vscode.NotebookCellOutput(
						[
							vscode.NotebookCellOutputItem.error({
								name: 'Error Name',
								message: 'Error Value',
								stack: ['stack1', 'stack2', 'stack3'].join('\n')
							})
						],
						{
							outputType: 'error',
							originalError: {
								ename: 'Error Name',
								evalue: 'Error Value',
								traceback: ['stack1', 'stack2', 'stack3'],
								output_type: 'error'
							}
						}
					)
				]
			);
		});

		['display_data', 'execute_result'].forEach(output_type => {
			suite(`Rich output for output_type = ${output_type}`, () => {
				// Properties to exclude when comparing.
				let propertiesToExcludeFromComparison: string[] = [];
				setup(() => {
					if (output_type === 'display_data') {
						// With display_data the execution_count property will never exist in the output.
						// We can ignore that (as it will never exist).
						// But we leave it in the case of `output_type === 'execute_result'`
						propertiesToExcludeFromComparison = ['execution_count', 'executionCount'];
					}
				});

				test('Text mimeType output', async () => {
					validateCellOutputTranslation(
						[
							{
								data: {
									'text/plain': 'Hello World!'
								},
								output_type,
								metadata: {},
								execution_count: 1
							}
						],
						[
							new vscode.NotebookCellOutput(
								[new vscode.NotebookCellOutputItem(Buffer.from('Hello World!', 'utf8'), 'text/plain')],
								{
									outputType: output_type,
									metadata: {}, // display_data & execute_result always have metadata.
									executionCount: 1
								}
							)
						],
						propertiesToExcludeFromComparison
					);
				});

				test('png,jpeg images', async () => {
					validateCellOutputTranslation(
						[
							{
								execution_count: 1,
								data: {
									'image/png': base64EncodedImage,
									'image/jpeg': base64EncodedImage
								},
								metadata: {},
								output_type
							}
						],
						[
							new vscode.NotebookCellOutput(
								[
									new vscode.NotebookCellOutputItem(Buffer.from(base64EncodedImage, 'base64'), 'image/png'),
									new vscode.NotebookCellOutputItem(Buffer.from(base64EncodedImage, 'base64'), 'image/jpeg')
								],
								{
									executionCount: 1,
									outputType: output_type,
									metadata: {} // display_data & execute_result always have metadata.
								}
							)
						],
						propertiesToExcludeFromComparison
					);
				});

				test('png image with a light background', async () => {
					validateCellOutputTranslation(
						[
							{
								execution_count: 1,
								data: {
									'image/png': base64EncodedImage
								},
								metadata: {
									needs_background: 'light'
								},
								output_type
							}
						],
						[
							new vscode.NotebookCellOutput(
								[new vscode.NotebookCellOutputItem(Buffer.from(base64EncodedImage, 'base64'), 'image/png')],
								{
									executionCount: 1,
									metadata: {
										needs_background: 'light'
									},
									outputType: output_type
								}
							)
						],
						propertiesToExcludeFromComparison
					);
				});

				test('png image with a dark background', async () => {
					validateCellOutputTranslation(
						[
							{
								execution_count: 1,
								data: {
									'image/png': base64EncodedImage
								},
								metadata: {
									needs_background: 'dark'
								},
								output_type
							}
						],
						[
							new vscode.NotebookCellOutput(
								[new vscode.NotebookCellOutputItem(Buffer.from(base64EncodedImage, 'base64'), 'image/png')],
								{
									executionCount: 1,
									metadata: {
										needs_background: 'dark'
									},
									outputType: output_type
								}
							)
						],
						propertiesToExcludeFromComparison
					);
				});

				test('png image with custom dimensions', async () => {
					validateCellOutputTranslation(
						[
							{
								execution_count: 1,
								data: {
									'image/png': base64EncodedImage
								},
								metadata: {
									'image/png': { height: '111px', width: '999px' }
								},
								output_type
							}
						],
						[
							new vscode.NotebookCellOutput(
								[new vscode.NotebookCellOutputItem(Buffer.from(base64EncodedImage, 'base64'), 'image/png')],
								{
									executionCount: 1,
									metadata: {
										'image/png': { height: '111px', width: '999px' }
									},
									outputType: output_type
								}
							)
						],
						propertiesToExcludeFromComparison
					);
				});

				test('png allowed to scroll', async () => {
					validateCellOutputTranslation(
						[
							{
								execution_count: 1,
								data: {
									'image/png': base64EncodedImage
								},
								metadata: {
									unconfined: true,
									'image/png': { width: '999px' }
								},
								output_type
							}
						],
						[
							new vscode.NotebookCellOutput(
								[new vscode.NotebookCellOutputItem(Buffer.from(base64EncodedImage, 'base64'), 'image/png')],
								{
									executionCount: 1,
									metadata: {
										unconfined: true,
										'image/png': { width: '999px' }
									},
									outputType: output_type
								}
							)
						],
						propertiesToExcludeFromComparison
					);
				});
			});
		});
	});

	suite('Output Order', () => {
		test('Verify order of outputs', async () => {
			const dataAndExpectedOrder: { output: nbformat.IDisplayData; expectedMimeTypesOrder: string[] }[] = [
				{
					output: {
						data: {
							'application/vnd.vegalite.v4+json': 'some json',
							'text/html': '<a>Hello</a>'
						},
						metadata: {},
						output_type: 'display_data'
					},
					expectedMimeTypesOrder: ['application/vnd.vegalite.v4+json', 'text/html']
				},
				{
					output: {
						data: {
							'application/vnd.vegalite.v4+json': 'some json',
							'application/javascript': 'some js',
							'text/plain': 'some text',
							'text/html': '<a>Hello</a>'
						},
						metadata: {},
						output_type: 'display_data'
					},
					expectedMimeTypesOrder: [
						'application/vnd.vegalite.v4+json',
						'text/html',
						'application/javascript',
						'text/plain'
					]
				},
				{
					output: {
						data: {
							'application/vnd.vegalite.v4+json': '', // Empty, should give preference to other mimetypes.
							'application/javascript': 'some js',
							'text/plain': 'some text',
							'text/html': '<a>Hello</a>'
						},
						metadata: {},
						output_type: 'display_data'
					},
					expectedMimeTypesOrder: [
						'text/html',
						'application/javascript',
						'text/plain',
						'application/vnd.vegalite.v4+json'
					]
				},
				{
					output: {
						data: {
							'text/plain': 'some text',
							'text/html': '<a>Hello</a>'
						},
						metadata: {},
						output_type: 'display_data'
					},
					expectedMimeTypesOrder: ['text/html', 'text/plain']
				},
				{
					output: {
						data: {
							'application/javascript': 'some js',
							'text/plain': 'some text'
						},
						metadata: {},
						output_type: 'display_data'
					},
					expectedMimeTypesOrder: ['application/javascript', 'text/plain']
				},
				{
					output: {
						data: {
							'image/svg+xml': 'some svg',
							'text/plain': 'some text'
						},
						metadata: {},
						output_type: 'display_data'
					},
					expectedMimeTypesOrder: ['image/svg+xml', 'text/plain']
				},
				{
					output: {
						data: {
							'text/latex': 'some latex',
							'text/plain': 'some text'
						},
						metadata: {},
						output_type: 'display_data'
					},
					expectedMimeTypesOrder: ['text/latex', 'text/plain']
				},
				{
					output: {
						data: {
							'application/vnd.jupyter.widget-view+json': 'some widget',
							'text/plain': 'some text'
						},
						metadata: {},
						output_type: 'display_data'
					},
					expectedMimeTypesOrder: ['application/vnd.jupyter.widget-view+json', 'text/plain']
				},
				{
					output: {
						data: {
							'text/plain': 'some text',
							'image/svg+xml': 'some svg',
							'image/png': 'some png'
						},
						metadata: {},
						output_type: 'display_data'
					},
					expectedMimeTypesOrder: ['image/png', 'image/svg+xml', 'text/plain']
				}
			];

			dataAndExpectedOrder.forEach(({ output, expectedMimeTypesOrder }) => {
				const sortedOutputs = jupyterCellOutputToCellOutput(output);
				const mimeTypes = sortedOutputs.items.map((item) => item.mime).join(',');
				assert.equal(mimeTypes, expectedMimeTypesOrder.join(','));
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/jake/.npmrc]---
Location: vscode-main/extensions/jake/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/jake/.vscodeignore]---
Location: vscode-main/extensions/jake/.vscodeignore

```text
src/**
tsconfig.json
out/**
extension.webpack.config.js
package-lock.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/jake/extension.webpack.config.js]---
Location: vscode-main/extensions/jake/extension.webpack.config.js

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

---[FILE: extensions/jake/package-lock.json]---
Location: vscode-main/extensions/jake/package-lock.json

```json
{
  "name": "jake",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "jake",
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

---[FILE: extensions/jake/package.json]---
Location: vscode-main/extensions/jake/package.json

```json
{
  "name": "jake",
  "publisher": "vscode",
  "description": "%description%",
  "displayName": "%displayName%",
  "icon": "images/cowboy_hat.png",
  "version": "1.0.0",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "categories": [
    "Other"
  ],
  "scripts": {
    "compile": "gulp compile-extension:jake",
    "watch": "gulp watch-extension:jake"
  },
  "dependencies": {},
  "devDependencies": {
    "@types/node": "22.x"
  },
  "main": "./out/main",
  "activationEvents": [
    "onTaskType:jake"
  ],
  "capabilities": {
    "virtualWorkspaces": false,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "contributes": {
    "configuration": {
      "id": "jake",
      "type": "object",
      "title": "Jake",
      "properties": {
        "jake.autoDetect": {
          "scope": "application",
          "type": "string",
          "enum": [
            "off",
            "on"
          ],
          "default": "off",
          "description": "%config.jake.autoDetect%"
        }
      }
    },
    "taskDefinitions": [
      {
        "type": "jake",
        "required": [
          "task"
        ],
        "properties": {
          "task": {
            "type": "string",
            "description": "%jake.taskDefinition.type.description%"
          },
          "file": {
            "type": "string",
            "description": "%jake.taskDefinition.file.description%"
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

---[FILE: extensions/jake/package.nls.json]---
Location: vscode-main/extensions/jake/package.nls.json

```json
{
	"description": "Extension to add Jake capabilities to VS Code.",
	"displayName": "Jake support for VS Code",
	"jake.taskDefinition.type.description": "The Jake task to customize.",
	"jake.taskDefinition.file.description": "The Jake file that provides the task. Can be omitted.",
	"config.jake.autoDetect": "Controls enablement of Jake task detection. Jake task detection can cause files in any open workspace to be executed."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/jake/README.md]---
Location: vscode-main/extensions/jake/README.md

```markdown
# Jake - JavaScript build tool

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

This extension supports running [Jake](http://jakejs.com/) tasks defined in a `Jakefile.js` file as [VS Code tasks](https://code.visualstudio.com/docs/editor/tasks). Jake tasks with the name 'build', 'compile', or 'watch' are treated as build tasks.

To run Jake tasks, use the **Tasks** menu.

## Settings

- `jake.autoDetect` - Enable detecting tasks from `Jakefile.js` files, the default is `on`.
```

--------------------------------------------------------------------------------

---[FILE: extensions/jake/tsconfig.json]---
Location: vscode-main/extensions/jake/tsconfig.json

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

---[FILE: extensions/jake/src/main.ts]---
Location: vscode-main/extensions/jake/src/main.ts

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
		_channel = vscode.window.createOutputChannel('Jake Auto Detection');
	}
	return _channel;
}

function showError() {
	vscode.window.showWarningMessage(vscode.l10n.t("Problem finding jake tasks. See the output for more information."),
		vscode.l10n.t("Go to output")).then(() => {
			getOutputChannel().show(true);
		});
}

async function findJakeCommand(rootPath: string): Promise<string> {
	let jakeCommand: string;
	const platform = process.platform;
	if (platform === 'win32' && await exists(path.join(rootPath!, 'node_modules', '.bin', 'jake.cmd'))) {
		jakeCommand = path.join('.', 'node_modules', '.bin', 'jake.cmd');
	} else if ((platform === 'linux' || platform === 'darwin') && await exists(path.join(rootPath!, 'node_modules', '.bin', 'jake'))) {
		jakeCommand = path.join('.', 'node_modules', '.bin', 'jake');
	} else {
		jakeCommand = 'jake';
	}
	return jakeCommand;
}

interface JakeTaskDefinition extends vscode.TaskDefinition {
	task: string;
	file?: string;
}

class FolderDetector {

	private fileWatcher: vscode.FileSystemWatcher | undefined;
	private promise: Thenable<vscode.Task[]> | undefined;

	constructor(
		private _workspaceFolder: vscode.WorkspaceFolder,
		private _jakeCommand: Promise<string>) {
	}

	public get workspaceFolder(): vscode.WorkspaceFolder {
		return this._workspaceFolder;
	}

	public isEnabled(): boolean {
		return vscode.workspace.getConfiguration('jake', this._workspaceFolder.uri).get<AutoDetect>('autoDetect') === 'on';
	}

	public start(): void {
		const pattern = path.join(this._workspaceFolder.uri.fsPath, '{node_modules,Jakefile,Jakefile.js}');
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
		const jakeTask = _task.definition.task;
		if (jakeTask) {
			const kind = _task.definition as JakeTaskDefinition;
			const options: vscode.ShellExecutionOptions = { cwd: this.workspaceFolder.uri.fsPath };
			const task = new vscode.Task(kind, this.workspaceFolder, jakeTask, 'jake', new vscode.ShellExecution(await this._jakeCommand, [jakeTask], options));
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
		let jakefile = path.join(rootPath, 'Jakefile');
		if (!await exists(jakefile)) {
			jakefile = path.join(rootPath, 'Jakefile.js');
			if (! await exists(jakefile)) {
				return emptyTasks;
			}
		}

		const commandLine = `${await this._jakeCommand} --tasks`;
		try {
			const { stdout, stderr } = await exec(commandLine, { cwd: rootPath });
			if (stderr) {
				getOutputChannel().appendLine(stderr);
				showError();
			}
			const result: vscode.Task[] = [];
			if (stdout) {
				const lines = stdout.split(/\r{0,1}\n/);
				for (const line of lines) {
					if (line.length === 0) {
						continue;
					}
					const regExp = /^jake\s+([^\s]+)\s/g;
					const matches = regExp.exec(line);
					if (matches && matches.length === 2) {
						const taskName = matches[1];
						const kind: JakeTaskDefinition = {
							type: 'jake',
							task: taskName
						};
						const options: vscode.ShellExecutionOptions = { cwd: this.workspaceFolder.uri.fsPath };
						const task = new vscode.Task(kind, taskName, 'jake', new vscode.ShellExecution(`${await this._jakeCommand} ${taskName}`, options));
						result.push(task);
						const lowerCaseLine = line.toLowerCase();
						if (isBuildTask(lowerCaseLine)) {
							task.group = vscode.TaskGroup.Build;
						} else if (isTestTask(lowerCaseLine)) {
							task.group = vscode.TaskGroup.Test;
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
			channel.appendLine(vscode.l10n.t("Auto detecting Jake for folder {0} failed with error: {1}', this.workspaceFolder.name, err.error ? err.error.toString() : 'unknown"));
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
			const detector = new FolderDetector(add, findJakeCommand(add.uri.fsPath));
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
					const detector = new FolderDetector(folder, findJakeCommand(folder.uri.fsPath));
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
			this.taskProvider = vscode.tasks.registerTaskProvider('jake', {
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

---[FILE: extensions/java/.vscodeignore]---
Location: vscode-main/extensions/java/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/java/cgmanifest.json]---
Location: vscode-main/extensions/java/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "redhat-developer/vscode-java",
					"repositoryUrl": "https://github.com/redhat-developer/vscode-java",
					"commitHash": "f09b712f5d6d6339e765f58c8dfab3f78a378183",
					"tag": "1.26.0"
				}
			},
			"license": "MIT",
			"licenseDetail": [
				"Copyright (c) 2014 GitHub Inc.",
				"",
				"Permission is hereby granted, free of charge, to any person obtaining",
				"a copy of this software and associated documentation files (the",
				"\"Software\"), to deal in the Software without restriction, including",
				"without limitation the rights to use, copy, modify, merge, publish,",
				"distribute, sublicense, and/or sell copies of the Software, and to",
				"permit persons to whom the Software is furnished to do so, subject to",
				"the following conditions:",
				"",
				"The above copyright notice and this permission notice shall be",
				"included in all copies or substantial portions of the Software.",
				"",
				"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND,",
				"EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF",
				"MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND",
				"NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE",
				"LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION",
				"OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION",
				"WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.",
				"",
				"--------------------------------------------------------------------",
				"",
				"This package was derived from a TextMate bundle located at",
				"https://github.com/textmate/java.tmbundle and distributed under the following",
				"license, located in `README.mdown`:",
				"",
				"Permission to copy, use, modify, sell and distribute this",
				"software is granted. This software is provided \"as is\" without",
				"express or implied warranty, and with no claim as to its",
				"suitability for any purpose."
			],
			"description": "This grammar was derived from https://github.com/atom/language-java/blob/master/grammars/java.cson.",
			"version": "1.26.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/java/language-configuration.json]---
Location: vscode-main/extensions/java/language-configuration.json

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
		},
		{
			"open": "/**",
			"close": " */",
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
		],
		[
			"<",
			">"
		]
	],
	"folding": {
		"markers": {
			"start": "^\\s*//\\s*(?:(?:#?region\\b)|(?:<editor-fold\\b))",
			"end": "^\\s*//\\s*(?:(?:#?endregion\\b)|(?:</editor-fold>))"
		}
	},
	"onEnterRules": [
		{
			// e.g. /** | */
			"beforeText": {
				"pattern": "^\\s*/\\*\\*(?!/)([^\\*]|\\*(?!/))*$"
			},
			"afterText": {
				"pattern": "^\\s*\\*/$"
			},
			"action": {
				"indent": "indentOutdent",
				"appendText": " * "
			}
		},
		{
			// e.g. /** ...|
			"beforeText": {
				"pattern": "^\\s*/\\*\\*(?!/)([^\\*]|\\*(?!/))*$"
			},
			"action": {
				"indent": "none",
				"appendText": " * "
			}
		},
		{
			// e.g.  * ...|
			"beforeText": {
				"pattern": "^(\\t|[ ])*[ ]\\*([ ]([^\\*]|\\*(?!/))*)?$"
			},
			"previousLineText": {
				"pattern": "(?=^(\\s*(/\\*\\*|\\*)).*)(?=(?!(\\s*\\*/)))"
			},
			"action": {
				"indent": "none",
				"appendText": "* "
			}
		},
		{
			// e.g.  */|
			"beforeText": {
				"pattern": "^(\\t|[ ])*[ ]\\*/\\s*$"
			},
			"action": {
				"indent": "none",
				"removeText": 1
			}
		},
		{
			// e.g.  *-----*/|
			"beforeText": {
				"pattern": "^(\\t|[ ])*[ ]\\*[^/]*\\*/\\s*$"
			},
			"action": {
				"indent": "none",
				"removeText": 1
			}
		},
		{
			"beforeText": {
				"pattern": "^\\s*(\\bcase\\s.+:|\\bdefault:)$"
			},
			"afterText": {
				"pattern": "^(?!\\s*(\\bcase\\b|\\bdefault\\b))"
			},
			"action": {
				"indent": "indent"
			}
		},
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

---[FILE: extensions/java/package.json]---
Location: vscode-main/extensions/java/package.json

```json
{
  "name": "java",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin redhat-developer/vscode-java language-support/java/java.tmLanguage.json ./syntaxes/java.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "java",
        "extensions": [
          ".java",
          ".jav"
        ],
        "aliases": [
          "Java",
          "java"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "java",
        "scopeName": "source.java",
        "path": "./syntaxes/java.tmLanguage.json"
      }
    ],
    "snippets": [
      {
        "language": "java",
        "path": "./snippets/java.code-snippets"
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

---[FILE: extensions/java/package.nls.json]---
Location: vscode-main/extensions/java/package.nls.json

```json
{
	"displayName": "Java Language Basics",
	"description": "Provides snippets, syntax highlighting, bracket matching and folding in Java files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/java/snippets/java.code-snippets]---
Location: vscode-main/extensions/java/snippets/java.code-snippets

```text
{
	"Region Start": {
		"prefix": "#region",
		"body": [
			"//#region"
		],
		"description": "Folding Region Start"
	},
	"Region End": {
		"prefix": "#endregion",
		"body": [
			"//#endregion"
		],
		"description": "Folding Region End"
	}
}
```

--------------------------------------------------------------------------------

````
