---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 310
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 310 of 552)

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

---[FILE: src/vs/workbench/api/common/extHostLanguageFeatures.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostLanguageFeatures.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { asArray, coalesce, isFalsyOrEmpty, isNonEmptyArray } from '../../../base/common/arrays.js';
import { raceCancellationError } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { NotImplementedError, isCancellationError } from '../../../base/common/errors.js';
import { IdGenerator } from '../../../base/common/idGenerator.js';
import { DisposableStore, Disposable as CoreDisposable } from '../../../base/common/lifecycle.js';
import { equals, mixin } from '../../../base/common/objects.js';
import { StopWatch } from '../../../base/common/stopwatch.js';
import { regExpLeadsToEndlessLoop } from '../../../base/common/strings.js';
import { assertType, isObject } from '../../../base/common/types.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IURITransformer } from '../../../base/common/uriIpc.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { IPosition } from '../../../editor/common/core/position.js';
import { Range as EditorRange, IRange } from '../../../editor/common/core/range.js';
import { ISelection, Selection } from '../../../editor/common/core/selection.js';
import * as languages from '../../../editor/common/languages.js';
import { IAutoClosingPairConditional } from '../../../editor/common/languages/languageConfiguration.js';
import { encodeSemanticTokensDto } from '../../../editor/common/services/semanticTokensDto.js';
import { localize } from '../../../nls.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { isProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { Cache } from './cache.js';
import * as extHostProtocol from './extHost.protocol.js';
import { IExtHostApiDeprecationService } from './extHostApiDeprecationService.js';
import { CommandsConverter, ExtHostCommands } from './extHostCommands.js';
import { ExtHostDiagnostics } from './extHostDiagnostics.js';
import { ExtHostDocuments } from './extHostDocuments.js';
import { ExtHostTelemetry, IExtHostTelemetry } from './extHostTelemetry.js';
import * as typeConvert from './extHostTypeConverters.js';
import { CodeAction, CodeActionKind, CompletionList, DataTransfer, Disposable, DocumentDropOrPasteEditKind, DocumentSymbol, InlineCompletionsDisposeReasonKind, InlineCompletionTriggerKind, InternalDataTransferItem, Location, NewSymbolNameTriggerKind, Range, SemanticTokens, SemanticTokensEdit, SemanticTokensEdits, SnippetString, SymbolInformation, SyntaxTokenType } from './extHostTypes.js';
import { Emitter } from '../../../base/common/event.js';
import { IInlineCompletionsUnificationState } from '../../services/inlineCompletions/common/inlineCompletionsUnification.js';

// --- adapter

class DocumentSymbolAdapter {

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.DocumentSymbolProvider
	) { }

	async provideDocumentSymbols(resource: URI, token: CancellationToken): Promise<languages.DocumentSymbol[] | undefined> {
		const doc = this._documents.getDocument(resource);
		const value = await this._provider.provideDocumentSymbols(doc, token);
		if (isFalsyOrEmpty(value)) {
			return undefined;
		} else if (value![0] instanceof DocumentSymbol) {
			return (<DocumentSymbol[]>value).map(typeConvert.DocumentSymbol.from);
		} else {
			return DocumentSymbolAdapter._asDocumentSymbolTree(<SymbolInformation[]>value);
		}
	}

	private static _asDocumentSymbolTree(infos: SymbolInformation[]): languages.DocumentSymbol[] {
		// first sort by start (and end) and then loop over all elements
		// and build a tree based on containment.
		infos = infos.slice(0).sort((a, b) => {
			let res = a.location.range.start.compareTo(b.location.range.start);
			if (res === 0) {
				res = b.location.range.end.compareTo(a.location.range.end);
			}
			return res;
		});
		const res: languages.DocumentSymbol[] = [];
		const parentStack: languages.DocumentSymbol[] = [];
		for (const info of infos) {
			const element: languages.DocumentSymbol = {
				name: info.name || '!!MISSING: name!!',
				kind: typeConvert.SymbolKind.from(info.kind),
				tags: info.tags?.map(typeConvert.SymbolTag.from) || [],
				detail: '',
				containerName: info.containerName,
				range: typeConvert.Range.from(info.location.range),
				selectionRange: typeConvert.Range.from(info.location.range),
				children: []
			};

			while (true) {
				if (parentStack.length === 0) {
					parentStack.push(element);
					res.push(element);
					break;
				}
				const parent = parentStack[parentStack.length - 1];
				if (EditorRange.containsRange(parent.range, element.range) && !EditorRange.equalsRange(parent.range, element.range)) {
					parent.children?.push(element);
					parentStack.push(element);
					break;
				}
				parentStack.pop();
			}
		}
		return res;
	}
}

class CodeLensAdapter {

	private readonly _cache = new Cache<vscode.CodeLens>('CodeLens');
	private readonly _disposables = new Map<number, DisposableStore>();

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _commands: CommandsConverter,
		private readonly _provider: vscode.CodeLensProvider,
		private readonly _extension: IExtensionDescription,
		private readonly _extTelemetry: ExtHostTelemetry,
		private readonly _logService: ILogService,
	) { }

	async provideCodeLenses(resource: URI, token: CancellationToken): Promise<extHostProtocol.ICodeLensListDto | undefined> {
		const doc = this._documents.getDocument(resource);

		const lenses = await this._provider.provideCodeLenses(doc, token);
		if (!lenses || token.isCancellationRequested) {
			return undefined;
		}
		const cacheId = this._cache.add(lenses);
		const disposables = new DisposableStore();
		this._disposables.set(cacheId, disposables);
		const result: extHostProtocol.ICodeLensListDto = {
			cacheId,
			lenses: [],
		};
		for (let i = 0; i < lenses.length; i++) {

			if (!Range.isRange(lenses[i].range)) {
				console.warn('INVALID code lens, range is not defined', this._extension.identifier.value);
				continue;
			}

			result.lenses.push({
				cacheId: [cacheId, i],
				range: typeConvert.Range.from(lenses[i].range),
				command: this._commands.toInternal(lenses[i].command, disposables)
			});
		}
		return result;
	}

	async resolveCodeLens(symbol: extHostProtocol.ICodeLensDto, token: CancellationToken): Promise<extHostProtocol.ICodeLensDto | undefined> {

		const lens = symbol.cacheId && this._cache.get(...symbol.cacheId);
		if (!lens) {
			return undefined;
		}

		let resolvedLens: vscode.CodeLens | undefined | null;
		if (typeof this._provider.resolveCodeLens !== 'function' || lens.isResolved) {
			resolvedLens = lens;
		} else {
			resolvedLens = await this._provider.resolveCodeLens(lens, token);
		}
		if (!resolvedLens) {
			resolvedLens = lens;
		}

		if (token.isCancellationRequested) {
			return undefined;
		}
		const disposables = symbol.cacheId && this._disposables.get(symbol.cacheId[0]);
		if (!disposables) {
			// disposed in the meantime
			return undefined;
		}

		if (!resolvedLens.command) {
			const error = new Error('INVALID code lens resolved, lacks command: ' + this._extension.identifier.value);
			this._extTelemetry.onExtensionError(this._extension.identifier, error);
			this._logService.error(error);
			return undefined;
		}

		symbol.command = this._commands.toInternal(resolvedLens.command, disposables);
		return symbol;
	}

	releaseCodeLenses(cachedId: number): void {
		this._disposables.get(cachedId)?.dispose();
		this._disposables.delete(cachedId);
		this._cache.delete(cachedId);
	}
}

function convertToLocationLinks(value: vscode.Location | vscode.Location[] | vscode.LocationLink[] | undefined | null): languages.LocationLink[] {
	if (Array.isArray(value)) {
		// eslint-disable-next-line local/code-no-any-casts
		return (<any>value).map(typeConvert.DefinitionLink.from);
	} else if (value) {
		return [typeConvert.DefinitionLink.from(value)];
	}
	return [];
}

class DefinitionAdapter {

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.DefinitionProvider
	) { }

	async provideDefinition(resource: URI, position: IPosition, token: CancellationToken): Promise<languages.LocationLink[]> {
		const doc = this._documents.getDocument(resource);
		const pos = typeConvert.Position.to(position);
		const value = await this._provider.provideDefinition(doc, pos, token);
		return convertToLocationLinks(value);
	}
}

class DeclarationAdapter {

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.DeclarationProvider
	) { }

	async provideDeclaration(resource: URI, position: IPosition, token: CancellationToken): Promise<languages.LocationLink[]> {
		const doc = this._documents.getDocument(resource);
		const pos = typeConvert.Position.to(position);
		const value = await this._provider.provideDeclaration(doc, pos, token);
		return convertToLocationLinks(value);
	}
}

class ImplementationAdapter {

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.ImplementationProvider
	) { }

	async provideImplementation(resource: URI, position: IPosition, token: CancellationToken): Promise<languages.LocationLink[]> {
		const doc = this._documents.getDocument(resource);
		const pos = typeConvert.Position.to(position);
		const value = await this._provider.provideImplementation(doc, pos, token);
		return convertToLocationLinks(value);
	}
}

class TypeDefinitionAdapter {

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.TypeDefinitionProvider
	) { }

	async provideTypeDefinition(resource: URI, position: IPosition, token: CancellationToken): Promise<languages.LocationLink[]> {
		const doc = this._documents.getDocument(resource);
		const pos = typeConvert.Position.to(position);
		const value = await this._provider.provideTypeDefinition(doc, pos, token);
		return convertToLocationLinks(value);
	}
}

class HoverAdapter {

	private _hoverCounter: number = 0;
	private _hoverMap: Map<number, vscode.Hover> = new Map<number, vscode.Hover>();

	private static HOVER_MAP_MAX_SIZE = 10;

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.HoverProvider,
	) { }

	async provideHover(resource: URI, position: IPosition, context: languages.HoverContext<{ id: number }> | undefined, token: CancellationToken): Promise<extHostProtocol.HoverWithId | undefined> {

		const doc = this._documents.getDocument(resource);
		const pos = typeConvert.Position.to(position);

		let value: vscode.Hover | null | undefined;
		if (context && context.verbosityRequest) {
			const previousHoverId = context.verbosityRequest.previousHover.id;
			const previousHover = this._hoverMap.get(previousHoverId);
			if (!previousHover) {
				throw new Error(`Hover with id ${previousHoverId} not found`);
			}
			const hoverContext: vscode.HoverContext = { verbosityDelta: context.verbosityRequest.verbosityDelta, previousHover };
			value = await this._provider.provideHover(doc, pos, token, hoverContext);
		} else {
			value = await this._provider.provideHover(doc, pos, token);
		}
		if (!value || isFalsyOrEmpty(value.contents)) {
			return undefined;
		}
		if (!value.range) {
			value.range = doc.getWordRangeAtPosition(pos);
		}
		if (!value.range) {
			value.range = new Range(pos, pos);
		}
		const convertedHover: languages.Hover = typeConvert.Hover.from(value);
		const id = this._hoverCounter;
		// Check if hover map has more than 10 elements and if yes, remove oldest from the map
		if (this._hoverMap.size === HoverAdapter.HOVER_MAP_MAX_SIZE) {
			const minimumId = Math.min(...this._hoverMap.keys());
			this._hoverMap.delete(minimumId);
		}
		this._hoverMap.set(id, value);
		this._hoverCounter += 1;
		const hover: extHostProtocol.HoverWithId = {
			...convertedHover,
			id
		};
		return hover;
	}

	releaseHover(id: number): void {
		this._hoverMap.delete(id);
	}
}

class EvaluatableExpressionAdapter {

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.EvaluatableExpressionProvider,
	) { }

	async provideEvaluatableExpression(resource: URI, position: IPosition, token: CancellationToken): Promise<languages.EvaluatableExpression | undefined> {

		const doc = this._documents.getDocument(resource);
		const pos = typeConvert.Position.to(position);

		const value = await this._provider.provideEvaluatableExpression(doc, pos, token);
		if (value) {
			return typeConvert.EvaluatableExpression.from(value);
		}
		return undefined;
	}
}

class InlineValuesAdapter {

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.InlineValuesProvider,
	) { }

	async provideInlineValues(resource: URI, viewPort: IRange, context: extHostProtocol.IInlineValueContextDto, token: CancellationToken): Promise<languages.InlineValue[] | undefined> {
		const doc = this._documents.getDocument(resource);
		const value = await this._provider.provideInlineValues(doc, typeConvert.Range.to(viewPort), typeConvert.InlineValueContext.to(context), token);
		if (Array.isArray(value)) {
			return value.map(iv => typeConvert.InlineValue.from(iv));
		}
		return undefined;
	}
}

class DocumentHighlightAdapter {

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.DocumentHighlightProvider
	) { }

	async provideDocumentHighlights(resource: URI, position: IPosition, token: CancellationToken): Promise<languages.DocumentHighlight[] | undefined> {

		const doc = this._documents.getDocument(resource);
		const pos = typeConvert.Position.to(position);

		const value = await this._provider.provideDocumentHighlights(doc, pos, token);
		if (Array.isArray(value)) {
			return value.map(typeConvert.DocumentHighlight.from);
		}
		return undefined;
	}
}

class MultiDocumentHighlightAdapter {

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.MultiDocumentHighlightProvider,
		private readonly _logService: ILogService,
	) { }

	async provideMultiDocumentHighlights(resource: URI, position: IPosition, otherResources: URI[], token: CancellationToken): Promise<languages.MultiDocumentHighlight[] | undefined> {
		const doc = this._documents.getDocument(resource);
		const otherDocuments = otherResources.map(r => {
			try {
				return this._documents.getDocument(r);
			} catch (err) {
				this._logService.error('Error: Unable to retrieve document from URI: ' + r + '. Error message: ' + err);
				return undefined;
			}
		}).filter(doc => doc !== undefined);

		const pos = typeConvert.Position.to(position);

		const value = await this._provider.provideMultiDocumentHighlights(doc, pos, otherDocuments, token);
		if (Array.isArray(value)) {
			return value.map(typeConvert.MultiDocumentHighlight.from);
		}
		return undefined;
	}
}

class LinkedEditingRangeAdapter {
	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.LinkedEditingRangeProvider
	) { }

	async provideLinkedEditingRanges(resource: URI, position: IPosition, token: CancellationToken): Promise<languages.LinkedEditingRanges | undefined> {

		const doc = this._documents.getDocument(resource);
		const pos = typeConvert.Position.to(position);

		const value = await this._provider.provideLinkedEditingRanges(doc, pos, token);
		if (value && Array.isArray(value.ranges)) {
			return {
				ranges: coalesce(value.ranges.map(typeConvert.Range.from)),
				wordPattern: value.wordPattern
			};
		}
		return undefined;
	}
}

class ReferenceAdapter {

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.ReferenceProvider
	) { }

	async provideReferences(resource: URI, position: IPosition, context: languages.ReferenceContext, token: CancellationToken): Promise<languages.Location[] | undefined> {
		const doc = this._documents.getDocument(resource);
		const pos = typeConvert.Position.to(position);

		const value = await this._provider.provideReferences(doc, pos, context, token);
		if (Array.isArray(value)) {
			return value.map(typeConvert.location.from);
		}
		return undefined;
	}
}

export interface CustomCodeAction extends extHostProtocol.ICodeActionDto {
	_isSynthetic?: boolean;
}

class CodeActionAdapter {
	private static readonly _maxCodeActionsPerFile: number = 1000;

	private readonly _cache = new Cache<vscode.CodeAction | vscode.Command>('CodeAction');
	private readonly _disposables = new Map<number, DisposableStore>();

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _commands: CommandsConverter,
		private readonly _diagnostics: ExtHostDiagnostics,
		private readonly _provider: vscode.CodeActionProvider,
		private readonly _logService: ILogService,
		private readonly _extension: IExtensionDescription,
		private readonly _apiDeprecation: IExtHostApiDeprecationService,
	) { }

	async provideCodeActions(resource: URI, rangeOrSelection: IRange | ISelection, context: languages.CodeActionContext, token: CancellationToken): Promise<extHostProtocol.ICodeActionListDto | undefined> {

		const doc = this._documents.getDocument(resource);
		const ran = Selection.isISelection(rangeOrSelection)
			? <vscode.Selection>typeConvert.Selection.to(rangeOrSelection)
			: <vscode.Range>typeConvert.Range.to(rangeOrSelection);
		const allDiagnostics: vscode.Diagnostic[] = [];

		for (const diagnostic of this._diagnostics.getDiagnostics(resource)) {
			if (ran.intersection(diagnostic.range)) {
				const newLen = allDiagnostics.push(diagnostic);
				if (newLen > CodeActionAdapter._maxCodeActionsPerFile) {
					break;
				}
			}
		}

		const codeActionContext: vscode.CodeActionContext = {
			diagnostics: allDiagnostics,
			only: context.only ? new CodeActionKind(context.only) : undefined,
			triggerKind: typeConvert.CodeActionTriggerKind.to(context.trigger),
		};

		const commandsOrActions = await this._provider.provideCodeActions(doc, ran, codeActionContext, token);
		if (!isNonEmptyArray(commandsOrActions) || token.isCancellationRequested) {
			return undefined;
		}

		const cacheId = this._cache.add(commandsOrActions);
		const disposables = new DisposableStore();
		this._disposables.set(cacheId, disposables);
		const actions: CustomCodeAction[] = [];
		for (let i = 0; i < commandsOrActions.length; i++) {
			const candidate = commandsOrActions[i];
			if (!candidate) {
				continue;
			}

			if (CodeActionAdapter._isCommand(candidate) && !(candidate instanceof CodeAction)) {
				// old school: synthetic code action
				this._apiDeprecation.report('CodeActionProvider.provideCodeActions - return commands', this._extension,
					`Return 'CodeAction' instances instead.`);

				actions.push({
					_isSynthetic: true,
					title: candidate.title,
					command: this._commands.toInternal(candidate, disposables),
				});
			} else {
				const toConvert = candidate as vscode.CodeAction;

				// new school: convert code action
				if (codeActionContext.only) {
					if (!toConvert.kind) {
						this._logService.warn(`${this._extension.identifier.value} - Code actions of kind '${codeActionContext.only.value}' requested but returned code action does not have a 'kind'. Code action will be dropped. Please set 'CodeAction.kind'.`);
					} else if (!codeActionContext.only.contains(toConvert.kind)) {
						this._logService.warn(`${this._extension.identifier.value} - Code actions of kind '${codeActionContext.only.value}' requested but returned code action is of kind '${toConvert.kind.value}'. Code action will be dropped. Please check 'CodeActionContext.only' to only return requested code actions.`);
					}
				}

				// Ensures that this is either a Range[] or an empty array so we don't get Array<Range | undefined>
				const range = toConvert.ranges ?? [];

				actions.push({
					cacheId: [cacheId, i],
					title: toConvert.title,
					command: toConvert.command && this._commands.toInternal(toConvert.command, disposables),
					diagnostics: toConvert.diagnostics && toConvert.diagnostics.map(typeConvert.Diagnostic.from),
					edit: toConvert.edit && typeConvert.WorkspaceEdit.from(toConvert.edit, undefined),
					kind: toConvert.kind && toConvert.kind.value,
					isPreferred: toConvert.isPreferred,
					isAI: isProposedApiEnabled(this._extension, 'codeActionAI') ? toConvert.isAI : false,
					ranges: isProposedApiEnabled(this._extension, 'codeActionRanges') ? coalesce(range.map(typeConvert.Range.from)) : undefined,
					disabled: toConvert.disabled?.reason
				});
			}
		}
		return { cacheId, actions };
	}

	async resolveCodeAction(id: extHostProtocol.ChainedCacheId, token: CancellationToken): Promise<{ edit?: extHostProtocol.IWorkspaceEditDto; command?: extHostProtocol.ICommandDto }> {
		const [sessionId, itemId] = id;
		const item = this._cache.get(sessionId, itemId);
		if (!item || CodeActionAdapter._isCommand(item)) {
			return {}; // code actions only!
		}
		if (!this._provider.resolveCodeAction) {
			return {}; // this should not happen...
		}


		const resolvedItem = (await this._provider.resolveCodeAction(item, token)) ?? item;

		let resolvedEdit: extHostProtocol.IWorkspaceEditDto | undefined;
		if (resolvedItem.edit) {
			resolvedEdit = typeConvert.WorkspaceEdit.from(resolvedItem.edit, undefined);
		}

		let resolvedCommand: extHostProtocol.ICommandDto | undefined;
		if (resolvedItem.command) {
			const disposables = this._disposables.get(sessionId);
			if (disposables) {
				resolvedCommand = this._commands.toInternal(resolvedItem.command, disposables);
			}
		}

		return { edit: resolvedEdit, command: resolvedCommand };
	}

	releaseCodeActions(cachedId: number): void {
		this._disposables.get(cachedId)?.dispose();
		this._disposables.delete(cachedId);
		this._cache.delete(cachedId);
	}

	private static _isCommand(thing: any): thing is vscode.Command {
		return typeof (<vscode.Command>thing).command === 'string' && typeof (<vscode.Command>thing).title === 'string';
	}
}

class DocumentPasteEditProvider {

	private _cachedPrepare?: Map<string, vscode.DataTransferItem>;

	private readonly _editsCache = new Cache<vscode.DocumentPasteEdit>('DocumentPasteEdit.edits');

	constructor(
		private readonly _proxy: extHostProtocol.MainThreadLanguageFeaturesShape,
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.DocumentPasteEditProvider,
		private readonly _handle: number,
		private readonly _extension: IExtensionDescription,
	) { }

	async prepareDocumentPaste(resource: URI, ranges: IRange[], dataTransferDto: extHostProtocol.DataTransferDTO, token: CancellationToken): Promise<extHostProtocol.DataTransferDTO | undefined> {
		if (!this._provider.prepareDocumentPaste) {
			return;
		}

		this._cachedPrepare = undefined;

		const doc = this._documents.getDocument(resource);
		const vscodeRanges = ranges.map(range => typeConvert.Range.to(range));

		const dataTransfer = typeConvert.DataTransfer.toDataTransfer(dataTransferDto, () => {
			throw new NotImplementedError();
		});
		await this._provider.prepareDocumentPaste(doc, vscodeRanges, dataTransfer, token);
		if (token.isCancellationRequested) {
			return;
		}

		// Only send back values that have been added to the data transfer
		const newEntries = Array.from(dataTransfer).filter(([, value]) => !(value instanceof InternalDataTransferItem));

		// Store off original data transfer items so we can retrieve them on paste
		const newCache = new Map<string, vscode.DataTransferItem>();

		const items = await Promise.all(Array.from(newEntries, async ([mime, value]) => {
			const id = generateUuid();
			newCache.set(id, value);
			return [mime, await typeConvert.DataTransferItem.from(mime, value, id)] as const;
		}));

		this._cachedPrepare = newCache;

		return { items };
	}

	async providePasteEdits(requestId: number, resource: URI, ranges: IRange[], dataTransferDto: extHostProtocol.DataTransferDTO, context: extHostProtocol.IDocumentPasteContextDto, token: CancellationToken): Promise<extHostProtocol.IPasteEditDto[]> {
		if (!this._provider.provideDocumentPasteEdits) {
			return [];
		}

		const doc = this._documents.getDocument(resource);
		const vscodeRanges = ranges.map(range => typeConvert.Range.to(range));

		const items = dataTransferDto.items.map(([mime, value]): [string, vscode.DataTransferItem] => {
			const cached = this._cachedPrepare?.get(value.id);
			if (cached) {
				return [mime, cached];
			}

			return [
				mime,
				typeConvert.DataTransferItem.to(mime, value, async id => {
					return (await this._proxy.$resolvePasteFileData(this._handle, requestId, id)).buffer;
				})
			];
		});

		const dataTransfer = new DataTransfer(items);

		const edits = await this._provider.provideDocumentPasteEdits(doc, vscodeRanges, dataTransfer, {
			only: context.only ? new DocumentDropOrPasteEditKind(context.only) : undefined,
			triggerKind: context.triggerKind,
		}, token);
		if (!edits || token.isCancellationRequested) {
			return [];
		}

		const cacheId = this._editsCache.add(edits);

		return edits.map((edit, i): extHostProtocol.IPasteEditDto => ({
			_cacheId: [cacheId, i],
			title: edit.title ?? localize('defaultPasteLabel', "Paste using '{0}' extension", this._extension.displayName || this._extension.name),
			kind: edit.kind,
			yieldTo: edit.yieldTo?.map(x => x.value),
			insertText: typeof edit.insertText === 'string' ? edit.insertText : { snippet: edit.insertText.value },
			additionalEdit: edit.additionalEdit ? typeConvert.WorkspaceEdit.from(edit.additionalEdit, undefined) : undefined,
		}));
	}

	async resolvePasteEdit(id: extHostProtocol.ChainedCacheId, token: CancellationToken): Promise<{ insertText?: string | vscode.SnippetString; additionalEdit?: extHostProtocol.IWorkspaceEditDto }> {
		const [sessionId, itemId] = id;
		const item = this._editsCache.get(sessionId, itemId);
		if (!item || !this._provider.resolveDocumentPasteEdit) {
			return {}; // this should not happen...
		}

		const resolvedItem = (await this._provider.resolveDocumentPasteEdit(item, token)) ?? item;
		return {
			insertText: resolvedItem.insertText,
			additionalEdit: resolvedItem.additionalEdit ? typeConvert.WorkspaceEdit.from(resolvedItem.additionalEdit, undefined) : undefined
		};
	}

	releasePasteEdits(id: number): any {
		this._editsCache.delete(id);
	}
}

class DocumentFormattingAdapter {

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.DocumentFormattingEditProvider
	) { }

	async provideDocumentFormattingEdits(resource: URI, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | undefined> {

		const document = this._documents.getDocument(resource);

		// eslint-disable-next-line local/code-no-any-casts
		const value = await this._provider.provideDocumentFormattingEdits(document, <any>options, token);
		if (Array.isArray(value)) {
			return value.map(typeConvert.TextEdit.from);
		}
		return undefined;
	}
}

class RangeFormattingAdapter {

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.DocumentRangeFormattingEditProvider
	) { }

	async provideDocumentRangeFormattingEdits(resource: URI, range: IRange, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | undefined> {

		const document = this._documents.getDocument(resource);
		const ran = typeConvert.Range.to(range);

		// eslint-disable-next-line local/code-no-any-casts
		const value = await this._provider.provideDocumentRangeFormattingEdits(document, ran, <any>options, token);
		if (Array.isArray(value)) {
			return value.map(typeConvert.TextEdit.from);
		}
		return undefined;
	}

	async provideDocumentRangesFormattingEdits(resource: URI, ranges: IRange[], options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | undefined> {
		assertType(typeof this._provider.provideDocumentRangesFormattingEdits === 'function', 'INVALID invocation of `provideDocumentRangesFormattingEdits`');

		const document = this._documents.getDocument(resource);
		const _ranges = <Range[]>ranges.map(typeConvert.Range.to);
		// eslint-disable-next-line local/code-no-any-casts
		const value = await this._provider.provideDocumentRangesFormattingEdits(document, _ranges, <any>options, token);
		if (Array.isArray(value)) {
			return value.map(typeConvert.TextEdit.from);
		}
		return undefined;
	}
}

class OnTypeFormattingAdapter {

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.OnTypeFormattingEditProvider
	) { }

	autoFormatTriggerCharacters: string[] = []; // not here

	async provideOnTypeFormattingEdits(resource: URI, position: IPosition, ch: string, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | undefined> {

		const document = this._documents.getDocument(resource);
		const pos = typeConvert.Position.to(position);

		// eslint-disable-next-line local/code-no-any-casts
		const value = await this._provider.provideOnTypeFormattingEdits(document, pos, ch, <any>options, token);
		if (Array.isArray(value)) {
			return value.map(typeConvert.TextEdit.from);
		}
		return undefined;
	}
}

class NavigateTypeAdapter {

	private readonly _cache = new Cache<vscode.SymbolInformation>('WorkspaceSymbols');

	constructor(
		private readonly _provider: vscode.WorkspaceSymbolProvider,
		private readonly _logService: ILogService
	) { }

	async provideWorkspaceSymbols(search: string, token: CancellationToken): Promise<extHostProtocol.IWorkspaceSymbolsDto> {
		const value = await this._provider.provideWorkspaceSymbols(search, token);

		if (!isNonEmptyArray(value)) {
			return { symbols: [] };
		}

		const sid = this._cache.add(value);
		const result: extHostProtocol.IWorkspaceSymbolsDto = {
			cacheId: sid,
			symbols: []
		};

		for (let i = 0; i < value.length; i++) {
			const item = value[i];
			if (!item || !item.name) {
				this._logService.warn('INVALID SymbolInformation', item);
				continue;
			}
			result.symbols.push({
				...typeConvert.WorkspaceSymbol.from(item),
				cacheId: [sid, i]
			});
		}

		return result;
	}

	async resolveWorkspaceSymbol(symbol: extHostProtocol.IWorkspaceSymbolDto, token: CancellationToken): Promise<extHostProtocol.IWorkspaceSymbolDto | undefined> {
		if (typeof this._provider.resolveWorkspaceSymbol !== 'function') {
			return symbol;
		}
		if (!symbol.cacheId) {
			return symbol;
		}
		const item = this._cache.get(...symbol.cacheId);
		if (item) {
			const value = await this._provider.resolveWorkspaceSymbol(item, token);
			return value && mixin(symbol, typeConvert.WorkspaceSymbol.from(value), true);
		}
		return undefined;
	}

	releaseWorkspaceSymbols(id: number): any {
		this._cache.delete(id);
	}
}

class RenameAdapter {

	static supportsResolving(provider: vscode.RenameProvider): boolean {
		return typeof provider.prepareRename === 'function';
	}

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.RenameProvider,
		private readonly _logService: ILogService
	) { }

	async provideRenameEdits(resource: URI, position: IPosition, newName: string, token: CancellationToken): Promise<extHostProtocol.IWorkspaceEditDto & languages.Rejection | undefined> {

		const doc = this._documents.getDocument(resource);
		const pos = typeConvert.Position.to(position);

		try {
			const value = await this._provider.provideRenameEdits(doc, pos, newName, token);
			if (!value) {
				return undefined;
			}
			return typeConvert.WorkspaceEdit.from(value);

		} catch (err) {
			const rejectReason = RenameAdapter._asMessage(err);
			if (rejectReason) {
				return { rejectReason, edits: undefined! };
			} else {
				// generic error
				return Promise.reject<extHostProtocol.IWorkspaceEditDto>(err);
			}
		}
	}

	async resolveRenameLocation(resource: URI, position: IPosition, token: CancellationToken): Promise<(languages.RenameLocation & languages.Rejection) | undefined> {
		if (typeof this._provider.prepareRename !== 'function') {
			return Promise.resolve(undefined);
		}

		const doc = this._documents.getDocument(resource);
		const pos = typeConvert.Position.to(position);

		try {
			const rangeOrLocation = await this._provider.prepareRename(doc, pos, token);

			let range: vscode.Range | undefined;
			let text: string | undefined;
			if (Range.isRange(rangeOrLocation)) {
				range = rangeOrLocation;
				text = doc.getText(rangeOrLocation);

			} else if (isObject(rangeOrLocation)) {
				range = rangeOrLocation.range;
				text = rangeOrLocation.placeholder;
			}

			if (!range || !text) {
				return undefined;
			}
			if (range.start.line > pos.line || range.end.line < pos.line) {
				this._logService.warn('INVALID rename location: position line must be within range start/end lines');
				return undefined;
			}
			return { range: typeConvert.Range.from(range), text };

		} catch (err) {
			const rejectReason = RenameAdapter._asMessage(err);
			if (rejectReason) {
				return { rejectReason, range: undefined!, text: undefined! };
			} else {
				return Promise.reject<any>(err);
			}
		}
	}

	private static _asMessage(err: any): string | undefined {
		if (typeof err === 'string') {
			return err;
		} else if (err instanceof Error && typeof err.message === 'string') {
			return err.message;
		} else {
			return undefined;
		}
	}
}

class NewSymbolNamesAdapter {

	private static languageTriggerKindToVSCodeTriggerKind: Record<languages.NewSymbolNameTriggerKind, vscode.NewSymbolNameTriggerKind> = {
		[languages.NewSymbolNameTriggerKind.Invoke]: NewSymbolNameTriggerKind.Invoke,
		[languages.NewSymbolNameTriggerKind.Automatic]: NewSymbolNameTriggerKind.Automatic,
	};

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.NewSymbolNamesProvider,
		private readonly _logService: ILogService
	) { }

	async supportsAutomaticNewSymbolNamesTriggerKind() {
		return this._provider.supportsAutomaticTriggerKind;
	}

	async provideNewSymbolNames(resource: URI, range: IRange, triggerKind: languages.NewSymbolNameTriggerKind, token: CancellationToken): Promise<languages.NewSymbolName[] | undefined> {

		const doc = this._documents.getDocument(resource);
		const pos = typeConvert.Range.to(range);

		try {
			const kind = NewSymbolNamesAdapter.languageTriggerKindToVSCodeTriggerKind[triggerKind];
			const value = await this._provider.provideNewSymbolNames(doc, pos, kind, token);
			if (!value) {
				return undefined;
			}
			return value.map(v =>
				typeof v === 'string' /* @ulugbekna: for backward compatibility because `value` used to be just `string[]` */
					? { newSymbolName: v }
					: { newSymbolName: v.newSymbolName, tags: v.tags }
			);
		} catch (err: unknown) {
			this._logService.error(NewSymbolNamesAdapter._asMessage(err) ?? JSON.stringify(err, null, '\t') /* @ulugbekna: assuming `err` doesn't have circular references that could result in an exception when converting to JSON */);
			return undefined;
		}
	}

	// @ulugbekna: this method is also defined in RenameAdapter but seems OK to be duplicated
	private static _asMessage(err: any): string | undefined {
		if (typeof err === 'string') {
			return err;
		} else if (err instanceof Error && typeof err.message === 'string') {
			return err.message;
		} else {
			return undefined;
		}
	}
}

class SemanticTokensPreviousResult {
	constructor(
		readonly resultId: string | undefined,
		readonly tokens?: Uint32Array,
	) { }
}

type RelaxedSemanticTokens = { readonly resultId?: string; readonly data: number[] };
type RelaxedSemanticTokensEdit = { readonly start: number; readonly deleteCount: number; readonly data?: number[] };
type RelaxedSemanticTokensEdits = { readonly resultId?: string; readonly edits: RelaxedSemanticTokensEdit[] };

type ProvidedSemanticTokens = vscode.SemanticTokens | RelaxedSemanticTokens;
type ProvidedSemanticTokensEdits = vscode.SemanticTokensEdits | RelaxedSemanticTokensEdits;

class DocumentSemanticTokensAdapter {

	private readonly _previousResults: Map<number, SemanticTokensPreviousResult>;
	private _nextResultId = 1;

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.DocumentSemanticTokensProvider,
	) {
		this._previousResults = new Map<number, SemanticTokensPreviousResult>();
	}

	async provideDocumentSemanticTokens(resource: URI, previousResultId: number, token: CancellationToken): Promise<VSBuffer | null> {
		const doc = this._documents.getDocument(resource);
		const previousResult = (previousResultId !== 0 ? this._previousResults.get(previousResultId) : null);
		let value = typeof previousResult?.resultId === 'string' && typeof this._provider.provideDocumentSemanticTokensEdits === 'function'
			? await this._provider.provideDocumentSemanticTokensEdits(doc, previousResult.resultId, token)
			: await this._provider.provideDocumentSemanticTokens(doc, token);

		if (previousResult) {
			this._previousResults.delete(previousResultId);
		}
		if (!value) {
			return null;
		}
		value = DocumentSemanticTokensAdapter._fixProvidedSemanticTokens(value);
		return this._send(DocumentSemanticTokensAdapter._convertToEdits(previousResult, value), value);
	}

	async releaseDocumentSemanticColoring(semanticColoringResultId: number): Promise<void> {
		this._previousResults.delete(semanticColoringResultId);
	}

	private static _fixProvidedSemanticTokens(v: ProvidedSemanticTokens | ProvidedSemanticTokensEdits): vscode.SemanticTokens | vscode.SemanticTokensEdits {
		if (DocumentSemanticTokensAdapter._isSemanticTokens(v)) {
			if (DocumentSemanticTokensAdapter._isCorrectSemanticTokens(v)) {
				return v;
			}
			return new SemanticTokens(new Uint32Array(v.data), v.resultId);
		} else if (DocumentSemanticTokensAdapter._isSemanticTokensEdits(v)) {
			if (DocumentSemanticTokensAdapter._isCorrectSemanticTokensEdits(v)) {
				return v;
			}
			return new SemanticTokensEdits(v.edits.map(edit => new SemanticTokensEdit(edit.start, edit.deleteCount, edit.data ? new Uint32Array(edit.data) : edit.data)), v.resultId);
		}
		return v;
	}

	private static _isSemanticTokens(v: ProvidedSemanticTokens | ProvidedSemanticTokensEdits): v is ProvidedSemanticTokens {
		return v && !!((v as ProvidedSemanticTokens).data);
	}

	private static _isCorrectSemanticTokens(v: ProvidedSemanticTokens): v is vscode.SemanticTokens {
		return (v.data instanceof Uint32Array);
	}

	private static _isSemanticTokensEdits(v: ProvidedSemanticTokens | ProvidedSemanticTokensEdits): v is ProvidedSemanticTokensEdits {
		return v && Array.isArray((v as ProvidedSemanticTokensEdits).edits);
	}

	private static _isCorrectSemanticTokensEdits(v: ProvidedSemanticTokensEdits): v is vscode.SemanticTokensEdits {
		for (const edit of v.edits) {
			if (!(edit.data instanceof Uint32Array)) {
				return false;
			}
		}
		return true;
	}

	private static _convertToEdits(previousResult: SemanticTokensPreviousResult | null | undefined, newResult: vscode.SemanticTokens | vscode.SemanticTokensEdits): vscode.SemanticTokens | vscode.SemanticTokensEdits {
		if (!DocumentSemanticTokensAdapter._isSemanticTokens(newResult)) {
			return newResult;
		}
		if (!previousResult || !previousResult.tokens) {
			return newResult;
		}
		const oldData = previousResult.tokens;
		const oldLength = oldData.length;
		const newData = newResult.data;
		const newLength = newData.length;

		let commonPrefixLength = 0;
		const maxCommonPrefixLength = Math.min(oldLength, newLength);
		while (commonPrefixLength < maxCommonPrefixLength && oldData[commonPrefixLength] === newData[commonPrefixLength]) {
			commonPrefixLength++;
		}

		if (commonPrefixLength === oldLength && commonPrefixLength === newLength) {
			// complete overlap!
			return new SemanticTokensEdits([], newResult.resultId);
		}

		let commonSuffixLength = 0;
		const maxCommonSuffixLength = maxCommonPrefixLength - commonPrefixLength;
		while (commonSuffixLength < maxCommonSuffixLength && oldData[oldLength - commonSuffixLength - 1] === newData[newLength - commonSuffixLength - 1]) {
			commonSuffixLength++;
		}

		return new SemanticTokensEdits([{
			start: commonPrefixLength,
			deleteCount: (oldLength - commonPrefixLength - commonSuffixLength),
			data: newData.subarray(commonPrefixLength, newLength - commonSuffixLength)
		}], newResult.resultId);
	}

	private _send(value: vscode.SemanticTokens | vscode.SemanticTokensEdits, original: vscode.SemanticTokens | vscode.SemanticTokensEdits): VSBuffer | null {
		if (DocumentSemanticTokensAdapter._isSemanticTokens(value)) {
			const myId = this._nextResultId++;
			this._previousResults.set(myId, new SemanticTokensPreviousResult(value.resultId, value.data));
			return encodeSemanticTokensDto({
				id: myId,
				type: 'full',
				data: value.data
			});
		}

		if (DocumentSemanticTokensAdapter._isSemanticTokensEdits(value)) {
			const myId = this._nextResultId++;
			if (DocumentSemanticTokensAdapter._isSemanticTokens(original)) {
				// store the original
				this._previousResults.set(myId, new SemanticTokensPreviousResult(original.resultId, original.data));
			} else {
				this._previousResults.set(myId, new SemanticTokensPreviousResult(value.resultId));
			}
			return encodeSemanticTokensDto({
				id: myId,
				type: 'delta',
				deltas: (value.edits || []).map(edit => ({ start: edit.start, deleteCount: edit.deleteCount, data: edit.data }))
			});
		}

		return null;
	}
}

class DocumentRangeSemanticTokensAdapter {

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.DocumentRangeSemanticTokensProvider,
	) { }

	async provideDocumentRangeSemanticTokens(resource: URI, range: IRange, token: CancellationToken): Promise<VSBuffer | null> {
		const doc = this._documents.getDocument(resource);
		const value = await this._provider.provideDocumentRangeSemanticTokens(doc, typeConvert.Range.to(range), token);
		if (!value) {
			return null;
		}
		return this._send(value);
	}

	private _send(value: vscode.SemanticTokens): VSBuffer {
		return encodeSemanticTokensDto({
			id: 0,
			type: 'full',
			data: value.data
		});
	}
}

class CompletionsAdapter {

	static supportsResolving(provider: vscode.CompletionItemProvider): boolean {
		return typeof provider.resolveCompletionItem === 'function';
	}

	private _cache = new Cache<vscode.CompletionItem>('CompletionItem');
	private _disposables = new Map<number, DisposableStore>();

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _commands: CommandsConverter,
		private readonly _provider: vscode.CompletionItemProvider,
		private readonly _apiDeprecation: IExtHostApiDeprecationService,
		private readonly _extension: IExtensionDescription,
	) { }

	async provideCompletionItems(resource: URI, position: IPosition, context: languages.CompletionContext, token: CancellationToken): Promise<extHostProtocol.ISuggestResultDto | undefined> {

		const doc = this._documents.getDocument(resource);
		const pos = typeConvert.Position.to(position);

		// The default insert/replace ranges. It's important to compute them
		// before asynchronously asking the provider for its results. See
		// https://github.com/microsoft/vscode/issues/83400#issuecomment-546851421
		const replaceRange = doc.getWordRangeAtPosition(pos) || new Range(pos, pos);
		const insertRange = replaceRange.with({ end: pos });

		const sw = new StopWatch();
		const itemsOrList = await this._provider.provideCompletionItems(doc, pos, token, typeConvert.CompletionContext.to(context));

		if (!itemsOrList) {
			// undefined and null are valid results
			return undefined;
		}

		if (token.isCancellationRequested) {
			// cancelled -> return without further ado, esp no caching
			// of results as they will leak
			return undefined;
		}

		const list = Array.isArray(itemsOrList) ? new CompletionList(itemsOrList) : itemsOrList;

		// keep result for providers that support resolving
		const pid: number = CompletionsAdapter.supportsResolving(this._provider) ? this._cache.add(list.items) : this._cache.add([]);
		const disposables = new DisposableStore();
		this._disposables.set(pid, disposables);

		const completions: extHostProtocol.ISuggestDataDto[] = [];
		const result: extHostProtocol.ISuggestResultDto = {
			x: pid,
			[extHostProtocol.ISuggestResultDtoField.completions]: completions,
			[extHostProtocol.ISuggestResultDtoField.defaultRanges]: { replace: typeConvert.Range.from(replaceRange), insert: typeConvert.Range.from(insertRange) },
			[extHostProtocol.ISuggestResultDtoField.isIncomplete]: list.isIncomplete || undefined,
			[extHostProtocol.ISuggestResultDtoField.duration]: sw.elapsed()
		};

		for (let i = 0; i < list.items.length; i++) {
			const item = list.items[i];
			// check for bad completion item first
			const dto = this._convertCompletionItem(item, [pid, i], insertRange, replaceRange);
			completions.push(dto);
		}

		return result;
	}

	async resolveCompletionItem(id: extHostProtocol.ChainedCacheId, token: CancellationToken): Promise<extHostProtocol.ISuggestDataDto | undefined> {

		if (typeof this._provider.resolveCompletionItem !== 'function') {
			return undefined;
		}

		const item = this._cache.get(...id);
		if (!item) {
			return undefined;
		}

		const dto1 = this._convertCompletionItem(item, id);

		const resolvedItem = await this._provider.resolveCompletionItem(item, token);

		if (!resolvedItem) {
			return undefined;
		}

		const dto2 = this._convertCompletionItem(resolvedItem, id);

		if (dto1[extHostProtocol.ISuggestDataDtoField.insertText] !== dto2[extHostProtocol.ISuggestDataDtoField.insertText]
			|| dto1[extHostProtocol.ISuggestDataDtoField.insertTextRules] !== dto2[extHostProtocol.ISuggestDataDtoField.insertTextRules]
		) {
			this._apiDeprecation.report('CompletionItem.insertText', this._extension, 'extension MAY NOT change \'insertText\' of a CompletionItem during resolve');
		}

		if (dto1[extHostProtocol.ISuggestDataDtoField.commandIdent] !== dto2[extHostProtocol.ISuggestDataDtoField.commandIdent]
			|| dto1[extHostProtocol.ISuggestDataDtoField.commandId] !== dto2[extHostProtocol.ISuggestDataDtoField.commandId]
			|| !equals(dto1[extHostProtocol.ISuggestDataDtoField.commandArguments], dto2[extHostProtocol.ISuggestDataDtoField.commandArguments])
		) {
			this._apiDeprecation.report('CompletionItem.command', this._extension, 'extension MAY NOT change \'command\' of a CompletionItem during resolve');
		}

		return {
			...dto1,
			[extHostProtocol.ISuggestDataDtoField.documentation]: dto2[extHostProtocol.ISuggestDataDtoField.documentation],
			[extHostProtocol.ISuggestDataDtoField.detail]: dto2[extHostProtocol.ISuggestDataDtoField.detail],
			[extHostProtocol.ISuggestDataDtoField.additionalTextEdits]: dto2[extHostProtocol.ISuggestDataDtoField.additionalTextEdits],

			// (fishy) async insertText
			[extHostProtocol.ISuggestDataDtoField.insertText]: dto2[extHostProtocol.ISuggestDataDtoField.insertText],
			[extHostProtocol.ISuggestDataDtoField.insertTextRules]: dto2[extHostProtocol.ISuggestDataDtoField.insertTextRules],

			// (fishy) async command
			[extHostProtocol.ISuggestDataDtoField.commandIdent]: dto2[extHostProtocol.ISuggestDataDtoField.commandIdent],
			[extHostProtocol.ISuggestDataDtoField.commandId]: dto2[extHostProtocol.ISuggestDataDtoField.commandId],
			[extHostProtocol.ISuggestDataDtoField.commandArguments]: dto2[extHostProtocol.ISuggestDataDtoField.commandArguments],
		};
	}

	releaseCompletionItems(id: number): any {
		this._disposables.get(id)?.dispose();
		this._disposables.delete(id);
		this._cache.delete(id);
	}

	private _convertCompletionItem(item: vscode.CompletionItem, id: extHostProtocol.ChainedCacheId, defaultInsertRange?: vscode.Range, defaultReplaceRange?: vscode.Range): extHostProtocol.ISuggestDataDto {

		const disposables = this._disposables.get(id[0]);
		if (!disposables) {
			throw Error('DisposableStore is missing...');
		}

		const command = this._commands.toInternal(item.command, disposables);
		const result: extHostProtocol.ISuggestDataDto = {
			//
			x: id,
			//
			[extHostProtocol.ISuggestDataDtoField.label]: item.label,
			[extHostProtocol.ISuggestDataDtoField.kind]: item.kind !== undefined ? typeConvert.CompletionItemKind.from(item.kind) : undefined,
			[extHostProtocol.ISuggestDataDtoField.kindModifier]: item.tags && item.tags.map(typeConvert.CompletionItemTag.from),
			[extHostProtocol.ISuggestDataDtoField.detail]: item.detail,
			[extHostProtocol.ISuggestDataDtoField.documentation]: typeof item.documentation === 'undefined' ? undefined : typeConvert.MarkdownString.fromStrict(item.documentation),
			[extHostProtocol.ISuggestDataDtoField.sortText]: item.sortText !== item.label ? item.sortText : undefined,
			[extHostProtocol.ISuggestDataDtoField.filterText]: item.filterText !== item.label ? item.filterText : undefined,
			[extHostProtocol.ISuggestDataDtoField.preselect]: item.preselect || undefined,
			[extHostProtocol.ISuggestDataDtoField.insertTextRules]: item.keepWhitespace ? languages.CompletionItemInsertTextRule.KeepWhitespace : languages.CompletionItemInsertTextRule.None,
			[extHostProtocol.ISuggestDataDtoField.commitCharacters]: item.commitCharacters?.join(''),
			[extHostProtocol.ISuggestDataDtoField.additionalTextEdits]: item.additionalTextEdits && item.additionalTextEdits.map(typeConvert.TextEdit.from),
			[extHostProtocol.ISuggestDataDtoField.commandIdent]: command?.$ident,
			[extHostProtocol.ISuggestDataDtoField.commandId]: command?.id,
			[extHostProtocol.ISuggestDataDtoField.commandArguments]: command?.$ident ? undefined : command?.arguments, // filled in on main side from $ident
		};

		// 'insertText'-logic
		if (item.textEdit) {
			this._apiDeprecation.report('CompletionItem.textEdit', this._extension, `Use 'CompletionItem.insertText' and 'CompletionItem.range' instead.`);
			result[extHostProtocol.ISuggestDataDtoField.insertText] = item.textEdit.newText;

		} else if (typeof item.insertText === 'string') {
			result[extHostProtocol.ISuggestDataDtoField.insertText] = item.insertText;

		} else if (item.insertText instanceof SnippetString) {
			result[extHostProtocol.ISuggestDataDtoField.insertText] = item.insertText.value;
			result[extHostProtocol.ISuggestDataDtoField.insertTextRules]! |= languages.CompletionItemInsertTextRule.InsertAsSnippet;
		}

		// 'overwrite[Before|After]'-logic
		let range: vscode.Range | { inserting: vscode.Range; replacing: vscode.Range } | undefined;
		if (item.textEdit) {
			range = item.textEdit.range;
		} else if (item.range) {
			range = item.range;
		}

		if (Range.isRange(range)) {
			// "old" range
			result[extHostProtocol.ISuggestDataDtoField.range] = typeConvert.Range.from(range);

		} else if (range && (!defaultInsertRange?.isEqual(range.inserting) || !defaultReplaceRange?.isEqual(range.replacing))) {
			// ONLY send range when it's different from the default ranges (safe bandwidth)
			result[extHostProtocol.ISuggestDataDtoField.range] = {
				insert: typeConvert.Range.from(range.inserting),
				replace: typeConvert.Range.from(range.replacing)
			};
		}

		return result;
	}
}

class InlineCompletionAdapter {
	private readonly _references = new ReferenceMap<{
		dispose(): void;
		items: readonly vscode.InlineCompletionItem[];
		list: vscode.InlineCompletionList | undefined;
	}>();

	private readonly _isAdditionsProposedApiEnabled: boolean;

	constructor(
		private readonly _extension: IExtensionDescription,
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.InlineCompletionItemProvider,
		private readonly _commands: CommandsConverter,
	) {
		this._isAdditionsProposedApiEnabled = isProposedApiEnabled(this._extension, 'inlineCompletionsAdditions');
	}

	public get supportsHandleEvents(): boolean {
		return isProposedApiEnabled(this._extension, 'inlineCompletionsAdditions')
			&& (typeof this._provider.handleDidShowCompletionItem === 'function'
				|| typeof this._provider.handleDidPartiallyAcceptCompletionItem === 'function'
				|| typeof this._provider.handleDidRejectCompletionItem === 'function'
				|| typeof this._provider.handleEndOfLifetime === 'function'
			);
	}

	public get supportsSetModelId(): boolean {
		return isProposedApiEnabled(this._extension, 'inlineCompletionsAdditions')
			&& typeof this._provider.setCurrentModelId === 'function';
	}

	private readonly languageTriggerKindToVSCodeTriggerKind: Record<languages.InlineCompletionTriggerKind, InlineCompletionTriggerKind> = {
		[languages.InlineCompletionTriggerKind.Automatic]: InlineCompletionTriggerKind.Automatic,
		[languages.InlineCompletionTriggerKind.Explicit]: InlineCompletionTriggerKind.Invoke,
	};

	public get modelInfo(): extHostProtocol.IInlineCompletionModelInfoDto | undefined {
		if (!this._isAdditionsProposedApiEnabled) {
			return undefined;
		}
		return this._provider.modelInfo ? {
			models: this._provider.modelInfo.models,
			currentModelId: this._provider.modelInfo.currentModelId
		} : undefined;
	}

	setCurrentModelId(modelId: string): void {
		if (!this._isAdditionsProposedApiEnabled) {
			return;
		}
		this._provider.setCurrentModelId?.(modelId);
	}

	async provideInlineCompletions(resource: URI, position: IPosition, context: languages.InlineCompletionContext, token: CancellationToken): Promise<extHostProtocol.IdentifiableInlineCompletions | undefined> {
		const doc = this._documents.getDocument(resource);
		const pos = typeConvert.Position.to(position);

		const result = await this._provider.provideInlineCompletionItems(doc, pos, {
			selectedCompletionInfo:
				context.selectedSuggestionInfo
					? {
						range: typeConvert.Range.to(context.selectedSuggestionInfo.range),
						text: context.selectedSuggestionInfo.text
					}
					: undefined,
			triggerKind: this.languageTriggerKindToVSCodeTriggerKind[context.triggerKind],
			requestUuid: context.requestUuid,
			requestIssuedDateTime: context.requestIssuedDateTime,
			earliestShownDateTime: context.earliestShownDateTime,
		}, token);

		if (!result) {
			// undefined and null are valid results
			return undefined;
		}

		const { resultItems, list } = Array.isArray(result) ? { resultItems: result, list: undefined } : { resultItems: result.items, list: result };
		const commands = this._isAdditionsProposedApiEnabled ? Array.isArray(result) ? [] : result.commands || [] : [];
		const enableForwardStability = this._isAdditionsProposedApiEnabled && !Array.isArray(result) ? result.enableForwardStability : undefined;

		let disposableStore: DisposableStore | undefined = undefined;
		const pid = this._references.createReferenceId({
			dispose() {
				disposableStore?.dispose();
			},
			items: resultItems,
			list,
		});

		const items = {
			pid,
			languageId: doc.languageId,
			items: resultItems.map<extHostProtocol.IdentifiableInlineCompletion>((item, idx) => {
				let command: languages.Command | undefined = undefined;
				if (item.command) {
					if (!disposableStore) {
						disposableStore = new DisposableStore();
					}
					command = this._commands.toInternal(item.command, disposableStore);
				}

				let action: languages.Command | undefined = undefined;
				if (item.action) {
					if (!disposableStore) {
						disposableStore = new DisposableStore();
					}
					action = this._commands.toInternal(item.action, disposableStore);
				}

				const insertText = item.insertText;
				return ({
					insertText: insertText === undefined ? undefined : (typeof insertText === 'string' ? insertText : { snippet: insertText.value }),
					range: item.range ? typeConvert.Range.from(item.range) : undefined,
					showRange: (this._isAdditionsProposedApiEnabled && item.showRange) ? typeConvert.Range.from(item.showRange) : undefined,
					command,
					gutterMenuLinkAction: action,
					idx: idx,
					completeBracketPairs: this._isAdditionsProposedApiEnabled ? item.completeBracketPairs : false,
					isInlineEdit: this._isAdditionsProposedApiEnabled ? item.isInlineEdit : false,
					showInlineEditMenu: this._isAdditionsProposedApiEnabled ? item.showInlineEditMenu : false,
					hint: (item.displayLocation && this._isAdditionsProposedApiEnabled) ? {
						range: typeConvert.Range.from(item.displayLocation.range),
						content: item.displayLocation.label,
						style: item.displayLocation.kind ? typeConvert.InlineCompletionHintStyle.from(item.displayLocation.kind) : languages.InlineCompletionHintStyle.Code,
					} : undefined,
					warning: (item.warning && this._isAdditionsProposedApiEnabled) ? {
						message: typeConvert.MarkdownString.from(item.warning.message),
						icon: item.warning.icon ? typeConvert.IconPath.fromThemeIcon(item.warning.icon) : undefined,
					} : undefined,
					correlationId: this._isAdditionsProposedApiEnabled ? item.correlationId : undefined,
					suggestionId: undefined,
					uri: (this._isAdditionsProposedApiEnabled && item.uri) ? item.uri : undefined,
					supportsRename: this._isAdditionsProposedApiEnabled ? item.supportsRename : false,
					jumpToPosition: (this._isAdditionsProposedApiEnabled && item.jumpToPosition) ? typeConvert.Position.from(item.jumpToPosition) : undefined,
				});
			}),
			commands: commands.map(c => {
				if (!disposableStore) {
					disposableStore = new DisposableStore();
				}
				return typeConvert.CompletionCommand.from(c, this._commands, disposableStore);
			}),
			suppressSuggestions: false,
			enableForwardStability,
		} satisfies extHostProtocol.IdentifiableInlineCompletions;
		return items;
	}

	disposeCompletions(pid: number, reason: languages.InlineCompletionsDisposeReason) {
		const completionList = this._references.get(pid);
		if (this._provider.handleListEndOfLifetime && this._isAdditionsProposedApiEnabled && completionList?.list) {
			function translateReason(reason: languages.InlineCompletionsDisposeReason): vscode.InlineCompletionsDisposeReason {
				switch (reason.kind) {
					case 'lostRace':
						return { kind: InlineCompletionsDisposeReasonKind.LostRace };
					case 'tokenCancellation':
						return { kind: InlineCompletionsDisposeReasonKind.TokenCancellation };
					case 'other':
						return { kind: InlineCompletionsDisposeReasonKind.Other };
					case 'empty':
						return { kind: InlineCompletionsDisposeReasonKind.Empty };
					case 'notTaken':
						return { kind: InlineCompletionsDisposeReasonKind.NotTaken };
					default:
						return { kind: InlineCompletionsDisposeReasonKind.Other };
				}
			}

			this._provider.handleListEndOfLifetime(completionList.list, translateReason(reason));
		}

		const data = this._references.disposeReferenceId(pid);
		data?.dispose();
	}

	handleDidShowCompletionItem(pid: number, idx: number, updatedInsertText: string): void {
		const completionItem = this._references.get(pid)?.items[idx];
		if (completionItem) {
			if (this._provider.handleDidShowCompletionItem && this._isAdditionsProposedApiEnabled) {
				this._provider.handleDidShowCompletionItem(completionItem, updatedInsertText);
			}
		}
	}

	handlePartialAccept(pid: number, idx: number, acceptedCharacters: number, info: languages.PartialAcceptInfo): void {
		const completionItem = this._references.get(pid)?.items[idx];
		if (completionItem) {
			if (this._provider.handleDidPartiallyAcceptCompletionItem && this._isAdditionsProposedApiEnabled) {
				this._provider.handleDidPartiallyAcceptCompletionItem(completionItem, acceptedCharacters);
				this._provider.handleDidPartiallyAcceptCompletionItem(completionItem, typeConvert.PartialAcceptInfo.to(info));
			}
		}
	}

	handleEndOfLifetime(pid: number, idx: number, reason: languages.InlineCompletionEndOfLifeReason<{ pid: number; idx: number }>): void {
		const completionItem = this._references.get(pid)?.items[idx];
		if (completionItem) {
			if (this._provider.handleEndOfLifetime && this._isAdditionsProposedApiEnabled) {
				const r = typeConvert.InlineCompletionEndOfLifeReason.to(reason, ref => this._references.get(ref.pid)?.items[ref.idx]);
				this._provider.handleEndOfLifetime(completionItem, r);
			}
		}
	}

	handleRejection(pid: number, idx: number): void {
		const completionItem = this._references.get(pid)?.items[idx];
		if (completionItem) {
			if (this._provider.handleDidRejectCompletionItem && this._isAdditionsProposedApiEnabled) {
				this._provider.handleDidRejectCompletionItem(completionItem);
			}
		}
	}
}

class ReferenceMap<T> {
	private readonly _references = new Map<number, T>();
	private _idPool = 1;

	createReferenceId(value: T): number {
		const id = this._idPool++;
		this._references.set(id, value);
		return id;
	}

	disposeReferenceId(referenceId: number): T | undefined {
		const value = this._references.get(referenceId);
		this._references.delete(referenceId);
		return value;
	}

	get(referenceId: number): T | undefined {
		return this._references.get(referenceId);
	}
}

class SignatureHelpAdapter {

	private readonly _cache = new Cache<vscode.SignatureHelp>('SignatureHelp');

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.SignatureHelpProvider,
	) { }

	async provideSignatureHelp(resource: URI, position: IPosition, context: extHostProtocol.ISignatureHelpContextDto, token: CancellationToken): Promise<extHostProtocol.ISignatureHelpDto | undefined> {
		const doc = this._documents.getDocument(resource);
		const pos = typeConvert.Position.to(position);
		const vscodeContext = this.reviveContext(context);

		const value = await this._provider.provideSignatureHelp(doc, pos, token, vscodeContext);
		if (value) {
			const id = this._cache.add([value]);
			return { ...typeConvert.SignatureHelp.from(value), id };
		}
		return undefined;
	}

	private reviveContext(context: extHostProtocol.ISignatureHelpContextDto): vscode.SignatureHelpContext {
		let activeSignatureHelp: vscode.SignatureHelp | undefined = undefined;
		if (context.activeSignatureHelp) {
			const revivedSignatureHelp = typeConvert.SignatureHelp.to(context.activeSignatureHelp);
			const saved = this._cache.get(context.activeSignatureHelp.id, 0);
			if (saved) {
				activeSignatureHelp = saved;
				activeSignatureHelp.activeSignature = revivedSignatureHelp.activeSignature;
				activeSignatureHelp.activeParameter = revivedSignatureHelp.activeParameter;
			} else {
				activeSignatureHelp = revivedSignatureHelp;
			}
		}
		return { ...context, activeSignatureHelp };
	}

	releaseSignatureHelp(id: number): any {
		this._cache.delete(id);
	}
}

class InlayHintsAdapter {

	private _cache = new Cache<vscode.InlayHint>('InlayHints');
	private readonly _disposables = new Map<number, DisposableStore>();

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _commands: CommandsConverter,
		private readonly _provider: vscode.InlayHintsProvider,
		private readonly _logService: ILogService,
		private readonly _extension: IExtensionDescription
	) { }

	async provideInlayHints(resource: URI, ran: IRange, token: CancellationToken): Promise<extHostProtocol.IInlayHintsDto | undefined> {
		const doc = this._documents.getDocument(resource);
		const range = typeConvert.Range.to(ran);

		const hints = await this._provider.provideInlayHints(doc, range, token);
		if (!Array.isArray(hints) || hints.length === 0) {
			// bad result
			this._logService.trace(`[InlayHints] NO inlay hints from '${this._extension.identifier.value}' for range ${JSON.stringify(ran)}`);
			return undefined;
		}
		if (token.isCancellationRequested) {
			// cancelled -> return without further ado, esp no caching
			// of results as they will leak
			return undefined;
		}
		const pid = this._cache.add(hints);
		this._disposables.set(pid, new DisposableStore());
		const result: extHostProtocol.IInlayHintsDto = { hints: [], cacheId: pid };
		for (let i = 0; i < hints.length; i++) {
			if (this._isValidInlayHint(hints[i], range)) {
				result.hints.push(this._convertInlayHint(hints[i], [pid, i]));
			}
		}
		this._logService.trace(`[InlayHints] ${result.hints.length} inlay hints from '${this._extension.identifier.value}' for range ${JSON.stringify(ran)}`);
		return result;
	}

	async resolveInlayHint(id: extHostProtocol.ChainedCacheId, token: CancellationToken) {
		if (typeof this._provider.resolveInlayHint !== 'function') {
			return undefined;
		}
		const item = this._cache.get(...id);
		if (!item) {
			return undefined;
		}
		const hint = await this._provider.resolveInlayHint(item, token);
		if (!hint) {
			return undefined;
		}
		if (!this._isValidInlayHint(hint)) {
			return undefined;
		}
		return this._convertInlayHint(hint, id);
	}

	releaseHints(id: number): any {
		this._disposables.get(id)?.dispose();
		this._disposables.delete(id);
		this._cache.delete(id);
	}

	private _isValidInlayHint(hint: vscode.InlayHint, range?: vscode.Range): boolean {
		if (hint.label.length === 0 || Array.isArray(hint.label) && hint.label.every(part => part.value.length === 0)) {
			console.log('INVALID inlay hint, empty label', hint);
			return false;
		}
		if (range && !range.contains(hint.position)) {
			// console.log('INVALID inlay hint, position outside range', range, hint);
			return false;
		}
		return true;
	}

	private _convertInlayHint(hint: vscode.InlayHint, id: extHostProtocol.ChainedCacheId): extHostProtocol.IInlayHintDto {

		const disposables = this._disposables.get(id[0]);
		if (!disposables) {
			throw Error('DisposableStore is missing...');
		}

		const result: extHostProtocol.IInlayHintDto = {
			label: '', // fill-in below
			cacheId: id,
			tooltip: typeConvert.MarkdownString.fromStrict(hint.tooltip),
			position: typeConvert.Position.from(hint.position),
			textEdits: hint.textEdits && hint.textEdits.map(typeConvert.TextEdit.from),
			kind: hint.kind && typeConvert.InlayHintKind.from(hint.kind),
			paddingLeft: hint.paddingLeft,
			paddingRight: hint.paddingRight,
		};

		if (typeof hint.label === 'string') {
			result.label = hint.label;
		} else {
			const parts: languages.InlayHintLabelPart[] = [];
			result.label = parts;

			for (const part of hint.label) {
				if (!part.value) {
					console.warn('INVALID inlay hint, empty label part', this._extension.identifier.value);
					continue;
				}
				const part2: languages.InlayHintLabelPart = {
					label: part.value,
					tooltip: typeConvert.MarkdownString.fromStrict(part.tooltip)
				};
				if (Location.isLocation(part.location)) {
					part2.location = typeConvert.location.from(part.location);
				}
				if (part.command) {
					part2.command = this._commands.toInternal(part.command, disposables);
				}
				parts.push(part2);
			}
		}
		return result;
	}
}

class LinkProviderAdapter {

	private _cache = new Cache<vscode.DocumentLink>('DocumentLink');

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.DocumentLinkProvider
	) { }

	async provideLinks(resource: URI, token: CancellationToken): Promise<extHostProtocol.ILinksListDto | undefined> {
		const doc = this._documents.getDocument(resource);

		const links = await this._provider.provideDocumentLinks(doc, token);
		if (!Array.isArray(links) || links.length === 0) {
			// bad result
			return undefined;
		}
		if (token.isCancellationRequested) {
			// cancelled -> return without further ado, esp no caching
			// of results as they will leak
			return undefined;
		}
		if (typeof this._provider.resolveDocumentLink !== 'function') {
			// no resolve -> no caching
			return { links: links.filter(LinkProviderAdapter._validateLink).map(typeConvert.DocumentLink.from) };

		} else {
			// cache links for future resolving
			const pid = this._cache.add(links);
			const result: extHostProtocol.ILinksListDto = { links: [], cacheId: pid };
			for (let i = 0; i < links.length; i++) {

				if (!LinkProviderAdapter._validateLink(links[i])) {
					continue;
				}

				const dto: extHostProtocol.ILinkDto = typeConvert.DocumentLink.from(links[i]);
				dto.cacheId = [pid, i];
				result.links.push(dto);
			}
			return result;
		}
	}

	private static _validateLink(link: vscode.DocumentLink): boolean {
		if (link.target && link.target.path.length > 50_000) {
			console.warn('DROPPING link because it is too long');
			return false;
		}
		return true;
	}

	async resolveLink(id: extHostProtocol.ChainedCacheId, token: CancellationToken): Promise<extHostProtocol.ILinkDto | undefined> {
		if (typeof this._provider.resolveDocumentLink !== 'function') {
			return undefined;
		}
		const item = this._cache.get(...id);
		if (!item) {
			return undefined;
		}
		const link = await this._provider.resolveDocumentLink(item, token);
		if (!link || !LinkProviderAdapter._validateLink(link)) {
			return undefined;
		}
		return typeConvert.DocumentLink.from(link);
	}

	releaseLinks(id: number): any {
		this._cache.delete(id);
	}
}

class ColorProviderAdapter {

	constructor(
		private _documents: ExtHostDocuments,
		private _provider: vscode.DocumentColorProvider
	) { }

	async provideColors(resource: URI, token: CancellationToken): Promise<extHostProtocol.IRawColorInfo[]> {
		const doc = this._documents.getDocument(resource);
		const colors = await this._provider.provideDocumentColors(doc, token);
		if (!Array.isArray(colors)) {
			return [];
		}
		const colorInfos: extHostProtocol.IRawColorInfo[] = colors.map(ci => {
			return {
				color: typeConvert.Color.from(ci.color),
				range: typeConvert.Range.from(ci.range)
			};
		});
		return colorInfos;
	}

	async provideColorPresentations(resource: URI, raw: extHostProtocol.IRawColorInfo, token: CancellationToken): Promise<languages.IColorPresentation[] | undefined> {
		const document = this._documents.getDocument(resource);
		const range = typeConvert.Range.to(raw.range);
		const color = typeConvert.Color.to(raw.color);
		const value = await this._provider.provideColorPresentations(color, { document, range }, token);
		if (!Array.isArray(value)) {
			return undefined;
		}
		return value.map(typeConvert.ColorPresentation.from);
	}
}

class FoldingProviderAdapter {

	constructor(
		private _documents: ExtHostDocuments,
		private _provider: vscode.FoldingRangeProvider
	) { }

	async provideFoldingRanges(resource: URI, context: languages.FoldingContext, token: CancellationToken): Promise<languages.FoldingRange[] | undefined> {
		const doc = this._documents.getDocument(resource);
		const ranges = await this._provider.provideFoldingRanges(doc, context, token);
		if (!Array.isArray(ranges)) {
			return undefined;
		}
		return ranges.map(typeConvert.FoldingRange.from);
	}
}

class SelectionRangeAdapter {

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.SelectionRangeProvider,
		private readonly _logService: ILogService
	) { }

	async provideSelectionRanges(resource: URI, pos: IPosition[], token: CancellationToken): Promise<languages.SelectionRange[][]> {
		const document = this._documents.getDocument(resource);
		const positions = pos.map(typeConvert.Position.to);

		const allProviderRanges = await this._provider.provideSelectionRanges(document, positions, token);
		if (!isNonEmptyArray(allProviderRanges)) {
			return [];
		}
		if (allProviderRanges.length !== positions.length) {
			this._logService.warn('BAD selection ranges, provider must return ranges for each position');
			return [];
		}
		const allResults: languages.SelectionRange[][] = [];
		for (let i = 0; i < positions.length; i++) {
			const oneResult: languages.SelectionRange[] = [];
			allResults.push(oneResult);

			let last: vscode.Position | vscode.Range = positions[i];
			let selectionRange = allProviderRanges[i];

			while (true) {
				if (!selectionRange.range.contains(last)) {
					throw new Error('INVALID selection range, must contain the previous range');
				}
				oneResult.push(typeConvert.SelectionRange.from(selectionRange));
				if (!selectionRange.parent) {
					break;
				}
				last = selectionRange.range;
				selectionRange = selectionRange.parent;
			}
		}
		return allResults;
	}
}

class CallHierarchyAdapter {

	private readonly _idPool = new IdGenerator('');
	private readonly _cache = new Map<string, Map<string, vscode.CallHierarchyItem>>();

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.CallHierarchyProvider
	) { }

	async prepareSession(uri: URI, position: IPosition, token: CancellationToken): Promise<extHostProtocol.ICallHierarchyItemDto[] | undefined> {
		const doc = this._documents.getDocument(uri);
		const pos = typeConvert.Position.to(position);

		const items = await this._provider.prepareCallHierarchy(doc, pos, token);
		if (!items) {
			return undefined;
		}

		const sessionId = this._idPool.nextId();
		this._cache.set(sessionId, new Map());

		if (Array.isArray(items)) {
			return items.map(item => this._cacheAndConvertItem(sessionId, item));
		} else {
			return [this._cacheAndConvertItem(sessionId, items)];
		}
	}

	async provideCallsTo(sessionId: string, itemId: string, token: CancellationToken): Promise<extHostProtocol.IIncomingCallDto[] | undefined> {
		const item = this._itemFromCache(sessionId, itemId);
		if (!item) {
			throw new Error('missing call hierarchy item');
		}
		const calls = await this._provider.provideCallHierarchyIncomingCalls(item, token);
		if (!calls) {
			return undefined;
		}
		return calls.map(call => {
			return {
				from: this._cacheAndConvertItem(sessionId, call.from),
				fromRanges: call.fromRanges.map(r => typeConvert.Range.from(r))
			};
		});
	}

	async provideCallsFrom(sessionId: string, itemId: string, token: CancellationToken): Promise<extHostProtocol.IOutgoingCallDto[] | undefined> {
		const item = this._itemFromCache(sessionId, itemId);
		if (!item) {
			throw new Error('missing call hierarchy item');
		}
		const calls = await this._provider.provideCallHierarchyOutgoingCalls(item, token);
		if (!calls) {
			return undefined;
		}
		return calls.map(call => {
			return {
				to: this._cacheAndConvertItem(sessionId, call.to),
				fromRanges: call.fromRanges.map(r => typeConvert.Range.from(r))
			};
		});
	}

	releaseSession(sessionId: string): void {
		this._cache.delete(sessionId);
	}

	private _cacheAndConvertItem(sessionId: string, item: vscode.CallHierarchyItem): extHostProtocol.ICallHierarchyItemDto {
		const map = this._cache.get(sessionId)!;
		const dto = typeConvert.CallHierarchyItem.from(item, sessionId, map.size.toString(36));
		map.set(dto._itemId, item);
		return dto;
	}

	private _itemFromCache(sessionId: string, itemId: string): vscode.CallHierarchyItem | undefined {
		const map = this._cache.get(sessionId);
		return map?.get(itemId);
	}
}

class TypeHierarchyAdapter {

	private readonly _idPool = new IdGenerator('');
	private readonly _cache = new Map<string, Map<string, vscode.TypeHierarchyItem>>();

	constructor(
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.TypeHierarchyProvider
	) { }

	async prepareSession(uri: URI, position: IPosition, token: CancellationToken): Promise<extHostProtocol.ITypeHierarchyItemDto[] | undefined> {
		const doc = this._documents.getDocument(uri);
		const pos = typeConvert.Position.to(position);

		const items = await this._provider.prepareTypeHierarchy(doc, pos, token);
		if (!items) {
			return undefined;
		}

		const sessionId = this._idPool.nextId();
		this._cache.set(sessionId, new Map());

		if (Array.isArray(items)) {
			return items.map(item => this._cacheAndConvertItem(sessionId, item));
		} else {
			return [this._cacheAndConvertItem(sessionId, items)];
		}
	}

	async provideSupertypes(sessionId: string, itemId: string, token: CancellationToken): Promise<extHostProtocol.ITypeHierarchyItemDto[] | undefined> {
		const item = this._itemFromCache(sessionId, itemId);
		if (!item) {
			throw new Error('missing type hierarchy item');
		}
		const supertypes = await this._provider.provideTypeHierarchySupertypes(item, token);
		if (!supertypes) {
			return undefined;
		}
		return supertypes.map(supertype => {
			return this._cacheAndConvertItem(sessionId, supertype);
		});
	}

	async provideSubtypes(sessionId: string, itemId: string, token: CancellationToken): Promise<extHostProtocol.ITypeHierarchyItemDto[] | undefined> {
		const item = this._itemFromCache(sessionId, itemId);
		if (!item) {
			throw new Error('missing type hierarchy item');
		}
		const subtypes = await this._provider.provideTypeHierarchySubtypes(item, token);
		if (!subtypes) {
			return undefined;
		}
		return subtypes.map(subtype => {
			return this._cacheAndConvertItem(sessionId, subtype);
		});
	}

	releaseSession(sessionId: string): void {
		this._cache.delete(sessionId);
	}

	private _cacheAndConvertItem(sessionId: string, item: vscode.TypeHierarchyItem): extHostProtocol.ITypeHierarchyItemDto {
		const map = this._cache.get(sessionId)!;
		const dto = typeConvert.TypeHierarchyItem.from(item, sessionId, map.size.toString(36));
		map.set(dto._itemId, item);
		return dto;
	}

	private _itemFromCache(sessionId: string, itemId: string): vscode.TypeHierarchyItem | undefined {
		const map = this._cache.get(sessionId);
		return map?.get(itemId);
	}
}

class DocumentDropEditAdapter {

	private readonly _cache = new Cache<vscode.DocumentDropEdit>('DocumentDropEdit');

	constructor(
		private readonly _proxy: extHostProtocol.MainThreadLanguageFeaturesShape,
		private readonly _documents: ExtHostDocuments,
		private readonly _provider: vscode.DocumentDropEditProvider,
		private readonly _handle: number,
		private readonly _extension: IExtensionDescription,
	) { }

	async provideDocumentOnDropEdits(requestId: number, uri: URI, position: IPosition, dataTransferDto: extHostProtocol.DataTransferDTO, token: CancellationToken): Promise<extHostProtocol.IDocumentDropEditDto[] | undefined> {
		const doc = this._documents.getDocument(uri);
		const pos = typeConvert.Position.to(position);
		const dataTransfer = typeConvert.DataTransfer.toDataTransfer(dataTransferDto, async (id) => {
			return (await this._proxy.$resolveDocumentOnDropFileData(this._handle, requestId, id)).buffer;
		});

		const edits = await this._provider.provideDocumentDropEdits(doc, pos, dataTransfer, token);
		if (!edits) {
			return undefined;
		}

		const editsArray = asArray(edits);
		const cacheId = this._cache.add(editsArray);

		return editsArray.map((edit, i): extHostProtocol.IDocumentDropEditDto => ({
			_cacheId: [cacheId, i],
			title: edit.title ?? localize('defaultDropLabel', "Drop using '{0}' extension", this._extension.displayName || this._extension.name),
			kind: edit.kind?.value,
			yieldTo: edit.yieldTo?.map(x => x.value),
			insertText: typeof edit.insertText === 'string' ? edit.insertText : { snippet: edit.insertText.value },
			additionalEdit: edit.additionalEdit ? typeConvert.WorkspaceEdit.from(edit.additionalEdit, undefined) : undefined,
		}));
	}

	async resolveDropEdit(id: extHostProtocol.ChainedCacheId, token: CancellationToken): Promise<{ additionalEdit?: extHostProtocol.IWorkspaceEditDto }> {
		const [sessionId, itemId] = id;
		const item = this._cache.get(sessionId, itemId);
		if (!item || !this._provider.resolveDocumentDropEdit) {
			return {}; // this should not happen...
		}

		const resolvedItem = (await this._provider.resolveDocumentDropEdit(item, token)) ?? item;
		const additionalEdit = resolvedItem.additionalEdit ? typeConvert.WorkspaceEdit.from(resolvedItem.additionalEdit, undefined) : undefined;
		return { additionalEdit };
	}

	releaseDropEdits(id: number): any {
		this._cache.delete(id);
	}
}

type Adapter = DocumentSymbolAdapter | CodeLensAdapter | DefinitionAdapter | HoverAdapter
	| DocumentHighlightAdapter | MultiDocumentHighlightAdapter | ReferenceAdapter | CodeActionAdapter
	| DocumentPasteEditProvider | DocumentFormattingAdapter | RangeFormattingAdapter
	| OnTypeFormattingAdapter | NavigateTypeAdapter | RenameAdapter
	| CompletionsAdapter | SignatureHelpAdapter | LinkProviderAdapter | ImplementationAdapter
	| TypeDefinitionAdapter | ColorProviderAdapter | FoldingProviderAdapter | DeclarationAdapter
	| SelectionRangeAdapter | CallHierarchyAdapter | TypeHierarchyAdapter
	| DocumentSemanticTokensAdapter | DocumentRangeSemanticTokensAdapter
	| EvaluatableExpressionAdapter | InlineValuesAdapter
	| LinkedEditingRangeAdapter | InlayHintsAdapter | InlineCompletionAdapter
	| DocumentDropEditAdapter | NewSymbolNamesAdapter;

class AdapterData {
	constructor(
		readonly adapter: Adapter,
		readonly extension: IExtensionDescription
	) { }
}

export class ExtHostLanguageFeatures extends CoreDisposable implements extHostProtocol.ExtHostLanguageFeaturesShape {

	private static _handlePool: number = 0;

	private readonly _proxy: extHostProtocol.MainThreadLanguageFeaturesShape;
	private readonly _adapter = new Map<number, AdapterData>();

	private _inlineCompletionsUnificationState: vscode.InlineCompletionsUnificationState;
	public get inlineCompletionsUnificationState(): vscode.InlineCompletionsUnificationState {
		return this._inlineCompletionsUnificationState;
	}

	private readonly _onDidChangeInlineCompletionsUnificationState = this._register(new Emitter<void>());
	readonly onDidChangeInlineCompletionsUnificationState = this._onDidChangeInlineCompletionsUnificationState.event;

	constructor(
		mainContext: extHostProtocol.IMainContext,
		private readonly _uriTransformer: IURITransformer,
		private readonly _documents: ExtHostDocuments,
		private readonly _commands: ExtHostCommands,
		private readonly _diagnostics: ExtHostDiagnostics,
		private readonly _logService: ILogService,
		private readonly _apiDeprecation: IExtHostApiDeprecationService,
		private readonly _extensionTelemetry: IExtHostTelemetry
	) {
		super();
		this._proxy = mainContext.getProxy(extHostProtocol.MainContext.MainThreadLanguageFeatures);
		this._inlineCompletionsUnificationState = {
			codeUnification: false,
			modelUnification: false,
			extensionUnification: false,
			expAssignments: []
		};
	}

	private _transformDocumentSelector(selector: vscode.DocumentSelector, extension: IExtensionDescription): Array<extHostProtocol.IDocumentFilterDto> {
		return typeConvert.DocumentSelector.from(selector, this._uriTransformer, extension);
	}

	private _createDisposable(handle: number): Disposable {
		return new Disposable(() => {
			this._adapter.delete(handle);
			this._proxy.$unregister(handle);
		});
	}

	private _nextHandle(): number {
		return ExtHostLanguageFeatures._handlePool++;
	}

	private async _withAdapter<A, R>(
		handle: number,
		ctor: { new(...args: any[]): A },
		callback: (adapter: A, extension: IExtensionDescription) => Promise<R>,
		fallbackValue: R,
		tokenToRaceAgainst: CancellationToken | undefined,
		doNotLog: boolean = false
	): Promise<R> {
		const data = this._adapter.get(handle);
		if (!data || !(data.adapter instanceof ctor)) {
			return fallbackValue;
		}

		const t1: number = Date.now();
		if (!doNotLog) {
			this._logService.trace(`[${data.extension.identifier.value}] INVOKE provider '${callback.toString().replace(/[\r\n]/g, '')}'`);
		}

		const result = callback(data.adapter, data.extension);

		// logging,tracing
		Promise.resolve(result).catch(err => {
			if (!isCancellationError(err)) {
				this._logService.error(`[${data.extension.identifier.value}] provider FAILED`);
				this._logService.error(err);

				this._extensionTelemetry.onExtensionError(data.extension.identifier, err);
			}
		}).finally(() => {
			if (!doNotLog) {
				this._logService.trace(`[${data.extension.identifier.value}] provider DONE after ${Date.now() - t1}ms`);
			}
		});

		if (CancellationToken.isCancellationToken(tokenToRaceAgainst)) {
			return raceCancellationError(result, tokenToRaceAgainst);
		}
		return result;
	}

	private _addNewAdapter(adapter: Adapter, extension: IExtensionDescription): number {
		const handle = this._nextHandle();
		this._adapter.set(handle, new AdapterData(adapter, extension));
		return handle;
	}

	private static _extLabel(ext: IExtensionDescription): string {
		return ext.displayName || ext.name;
	}

	private static _extId(ext: IExtensionDescription): string {
		return ext.identifier.value;
	}

	// --- outline

	registerDocumentSymbolProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.DocumentSymbolProvider, metadata?: vscode.DocumentSymbolProviderMetadata): vscode.Disposable {
		const handle = this._addNewAdapter(new DocumentSymbolAdapter(this._documents, provider), extension);
		const displayName = (metadata && metadata.label) || ExtHostLanguageFeatures._extLabel(extension);
		this._proxy.$registerDocumentSymbolProvider(handle, this._transformDocumentSelector(selector, extension), displayName);
		return this._createDisposable(handle);
	}

	$provideDocumentSymbols(handle: number, resource: UriComponents, token: CancellationToken): Promise<languages.DocumentSymbol[] | undefined> {
		return this._withAdapter(handle, DocumentSymbolAdapter, adapter => adapter.provideDocumentSymbols(URI.revive(resource), token), undefined, token);
	}

	// --- code lens

	registerCodeLensProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.CodeLensProvider): vscode.Disposable {
		const handle = this._nextHandle();
		const eventHandle = typeof provider.onDidChangeCodeLenses === 'function' ? this._nextHandle() : undefined;

		this._adapter.set(handle, new AdapterData(new CodeLensAdapter(this._documents, this._commands.converter, provider, extension, this._extensionTelemetry, this._logService), extension));
		this._proxy.$registerCodeLensSupport(handle, this._transformDocumentSelector(selector, extension), eventHandle);
		let result = this._createDisposable(handle);

		if (eventHandle !== undefined) {
			const subscription = provider.onDidChangeCodeLenses!(_ => this._proxy.$emitCodeLensEvent(eventHandle));
			result = Disposable.from(result, subscription);
		}

		return result;
	}

	$provideCodeLenses(handle: number, resource: UriComponents, token: CancellationToken): Promise<extHostProtocol.ICodeLensListDto | undefined> {
		return this._withAdapter(handle, CodeLensAdapter, adapter => adapter.provideCodeLenses(URI.revive(resource), token), undefined, token, resource.scheme === 'output');
	}

	$resolveCodeLens(handle: number, symbol: extHostProtocol.ICodeLensDto, token: CancellationToken): Promise<extHostProtocol.ICodeLensDto | undefined> {
		return this._withAdapter(handle, CodeLensAdapter, adapter => adapter.resolveCodeLens(symbol, token), undefined, undefined, true);
	}

	$releaseCodeLenses(handle: number, cacheId: number): void {
		this._withAdapter(handle, CodeLensAdapter, adapter => Promise.resolve(adapter.releaseCodeLenses(cacheId)), undefined, undefined, true);
	}

	// --- declaration

	registerDefinitionProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.DefinitionProvider): vscode.Disposable {
		const handle = this._addNewAdapter(new DefinitionAdapter(this._documents, provider), extension);
		this._proxy.$registerDefinitionSupport(handle, this._transformDocumentSelector(selector, extension));
		return this._createDisposable(handle);
	}

	$provideDefinition(handle: number, resource: UriComponents, position: IPosition, token: CancellationToken): Promise<languages.LocationLink[]> {
		return this._withAdapter(handle, DefinitionAdapter, adapter => adapter.provideDefinition(URI.revive(resource), position, token), [], token);
	}

	registerDeclarationProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.DeclarationProvider): vscode.Disposable {
		const handle = this._addNewAdapter(new DeclarationAdapter(this._documents, provider), extension);
		this._proxy.$registerDeclarationSupport(handle, this._transformDocumentSelector(selector, extension));
		return this._createDisposable(handle);
	}

	$provideDeclaration(handle: number, resource: UriComponents, position: IPosition, token: CancellationToken): Promise<languages.LocationLink[]> {
		return this._withAdapter(handle, DeclarationAdapter, adapter => adapter.provideDeclaration(URI.revive(resource), position, token), [], token);
	}

	registerImplementationProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.ImplementationProvider): vscode.Disposable {
		const handle = this._addNewAdapter(new ImplementationAdapter(this._documents, provider), extension);
		this._proxy.$registerImplementationSupport(handle, this._transformDocumentSelector(selector, extension));
		return this._createDisposable(handle);
	}

	$provideImplementation(handle: number, resource: UriComponents, position: IPosition, token: CancellationToken): Promise<languages.LocationLink[]> {
		return this._withAdapter(handle, ImplementationAdapter, adapter => adapter.provideImplementation(URI.revive(resource), position, token), [], token);
	}

	registerTypeDefinitionProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.TypeDefinitionProvider): vscode.Disposable {
		const handle = this._addNewAdapter(new TypeDefinitionAdapter(this._documents, provider), extension);
		this._proxy.$registerTypeDefinitionSupport(handle, this._transformDocumentSelector(selector, extension));
		return this._createDisposable(handle);
	}

	$provideTypeDefinition(handle: number, resource: UriComponents, position: IPosition, token: CancellationToken): Promise<languages.LocationLink[]> {
		return this._withAdapter(handle, TypeDefinitionAdapter, adapter => adapter.provideTypeDefinition(URI.revive(resource), position, token), [], token);
	}

	// --- extra info

	registerHoverProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.HoverProvider, extensionId?: ExtensionIdentifier): vscode.Disposable {
		const handle = this._addNewAdapter(new HoverAdapter(this._documents, provider), extension);
		this._proxy.$registerHoverProvider(handle, this._transformDocumentSelector(selector, extension));
		return this._createDisposable(handle);
	}

	$provideHover(handle: number, resource: UriComponents, position: IPosition, context: languages.HoverContext<{ id: number }> | undefined, token: CancellationToken,): Promise<extHostProtocol.HoverWithId | undefined> {
		return this._withAdapter(handle, HoverAdapter, adapter => adapter.provideHover(URI.revive(resource), position, context, token), undefined, token);
	}

	$releaseHover(handle: number, id: number): void {
		this._withAdapter(handle, HoverAdapter, adapter => Promise.resolve(adapter.releaseHover(id)), undefined, undefined);
	}

	// --- debug hover

	registerEvaluatableExpressionProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.EvaluatableExpressionProvider, extensionId?: ExtensionIdentifier): vscode.Disposable {
		const handle = this._addNewAdapter(new EvaluatableExpressionAdapter(this._documents, provider), extension);
		this._proxy.$registerEvaluatableExpressionProvider(handle, this._transformDocumentSelector(selector, extension));
		return this._createDisposable(handle);
	}

	$provideEvaluatableExpression(handle: number, resource: UriComponents, position: IPosition, token: CancellationToken): Promise<languages.EvaluatableExpression | undefined> {
		return this._withAdapter(handle, EvaluatableExpressionAdapter, adapter => adapter.provideEvaluatableExpression(URI.revive(resource), position, token), undefined, token);
	}

	// --- debug inline values

	registerInlineValuesProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.InlineValuesProvider, extensionId?: ExtensionIdentifier): vscode.Disposable {

		const eventHandle = typeof provider.onDidChangeInlineValues === 'function' ? this._nextHandle() : undefined;
		const handle = this._addNewAdapter(new InlineValuesAdapter(this._documents, provider), extension);

		this._proxy.$registerInlineValuesProvider(handle, this._transformDocumentSelector(selector, extension), eventHandle);
		let result = this._createDisposable(handle);

		if (eventHandle !== undefined) {
			const subscription = provider.onDidChangeInlineValues!(_ => this._proxy.$emitInlineValuesEvent(eventHandle));
			result = Disposable.from(result, subscription);
		}
		return result;
	}

	$provideInlineValues(handle: number, resource: UriComponents, range: IRange, context: extHostProtocol.IInlineValueContextDto, token: CancellationToken): Promise<languages.InlineValue[] | undefined> {
		return this._withAdapter(handle, InlineValuesAdapter, adapter => adapter.provideInlineValues(URI.revive(resource), range, context, token), undefined, token);
	}

	// --- occurrences

	registerDocumentHighlightProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.DocumentHighlightProvider): vscode.Disposable {
		const handle = this._addNewAdapter(new DocumentHighlightAdapter(this._documents, provider), extension);
		this._proxy.$registerDocumentHighlightProvider(handle, this._transformDocumentSelector(selector, extension));
		return this._createDisposable(handle);
	}

	registerMultiDocumentHighlightProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.MultiDocumentHighlightProvider): vscode.Disposable {
		const handle = this._addNewAdapter(new MultiDocumentHighlightAdapter(this._documents, provider, this._logService), extension);
		this._proxy.$registerMultiDocumentHighlightProvider(handle, this._transformDocumentSelector(selector, extension));
		return this._createDisposable(handle);
	}

	$provideDocumentHighlights(handle: number, resource: UriComponents, position: IPosition, token: CancellationToken): Promise<languages.DocumentHighlight[] | undefined> {
		return this._withAdapter(handle, DocumentHighlightAdapter, adapter => adapter.provideDocumentHighlights(URI.revive(resource), position, token), undefined, token);
	}

	$provideMultiDocumentHighlights(handle: number, resource: UriComponents, position: IPosition, otherModels: UriComponents[], token: CancellationToken): Promise<languages.MultiDocumentHighlight[] | undefined> {
		return this._withAdapter(handle, MultiDocumentHighlightAdapter, adapter => adapter.provideMultiDocumentHighlights(URI.revive(resource), position, otherModels.map(model => URI.revive(model)), token), undefined, token);
	}

	// --- linked editing

	registerLinkedEditingRangeProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.LinkedEditingRangeProvider): vscode.Disposable {
		const handle = this._addNewAdapter(new LinkedEditingRangeAdapter(this._documents, provider), extension);
		this._proxy.$registerLinkedEditingRangeProvider(handle, this._transformDocumentSelector(selector, extension));
		return this._createDisposable(handle);
	}

	$provideLinkedEditingRanges(handle: number, resource: UriComponents, position: IPosition, token: CancellationToken): Promise<extHostProtocol.ILinkedEditingRangesDto | undefined> {
		return this._withAdapter(handle, LinkedEditingRangeAdapter, async adapter => {
			const res = await adapter.provideLinkedEditingRanges(URI.revive(resource), position, token);
			if (res) {
				return {
					ranges: res.ranges,
					wordPattern: res.wordPattern ? ExtHostLanguageFeatures._serializeRegExp(res.wordPattern) : undefined
				};
			}
			return undefined;
		}, undefined, token);
	}

	// --- references

	registerReferenceProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.ReferenceProvider): vscode.Disposable {
		const handle = this._addNewAdapter(new ReferenceAdapter(this._documents, provider), extension);
		this._proxy.$registerReferenceSupport(handle, this._transformDocumentSelector(selector, extension));
		return this._createDisposable(handle);
	}

	$provideReferences(handle: number, resource: UriComponents, position: IPosition, context: languages.ReferenceContext, token: CancellationToken): Promise<languages.Location[] | undefined> {
		return this._withAdapter(handle, ReferenceAdapter, adapter => adapter.provideReferences(URI.revive(resource), position, context, token), undefined, token);
	}

	// --- code actions

	registerCodeActionProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.CodeActionProvider, metadata?: vscode.CodeActionProviderMetadata): vscode.Disposable {
		const store = new DisposableStore();
		const handle = this._addNewAdapter(new CodeActionAdapter(this._documents, this._commands.converter, this._diagnostics, provider, this._logService, extension, this._apiDeprecation), extension);
		this._proxy.$registerCodeActionSupport(handle, this._transformDocumentSelector(selector, extension), {
			providedKinds: metadata?.providedCodeActionKinds?.map(kind => kind.value),
			documentation: metadata?.documentation?.map(x => ({
				kind: x.kind.value,
				command: this._commands.converter.toInternal(x.command, store),
			}))
		}, ExtHostLanguageFeatures._extLabel(extension), ExtHostLanguageFeatures._extId(extension), Boolean(provider.resolveCodeAction));
		store.add(this._createDisposable(handle));
		return store;
	}


	$provideCodeActions(handle: number, resource: UriComponents, rangeOrSelection: IRange | ISelection, context: languages.CodeActionContext, token: CancellationToken): Promise<extHostProtocol.ICodeActionListDto | undefined> {
		return this._withAdapter(handle, CodeActionAdapter, adapter => adapter.provideCodeActions(URI.revive(resource), rangeOrSelection, context, token), undefined, token);
	}

	$resolveCodeAction(handle: number, id: extHostProtocol.ChainedCacheId, token: CancellationToken): Promise<{ edit?: extHostProtocol.IWorkspaceEditDto; command?: extHostProtocol.ICommandDto }> {
		return this._withAdapter(handle, CodeActionAdapter, adapter => adapter.resolveCodeAction(id, token), {}, undefined);
	}

	$releaseCodeActions(handle: number, cacheId: number): void {
		this._withAdapter(handle, CodeActionAdapter, adapter => Promise.resolve(adapter.releaseCodeActions(cacheId)), undefined, undefined);
	}

	// --- formatting

	registerDocumentFormattingEditProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.DocumentFormattingEditProvider): vscode.Disposable {
		const handle = this._addNewAdapter(new DocumentFormattingAdapter(this._documents, provider), extension);
		this._proxy.$registerDocumentFormattingSupport(handle, this._transformDocumentSelector(selector, extension), extension.identifier, extension.displayName || extension.name);
		return this._createDisposable(handle);
	}

	$provideDocumentFormattingEdits(handle: number, resource: UriComponents, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | undefined> {
		return this._withAdapter(handle, DocumentFormattingAdapter, adapter => adapter.provideDocumentFormattingEdits(URI.revive(resource), options, token), undefined, token);
	}

	registerDocumentRangeFormattingEditProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.DocumentRangeFormattingEditProvider): vscode.Disposable {
		const canFormatMultipleRanges = typeof provider.provideDocumentRangesFormattingEdits === 'function';
		const handle = this._addNewAdapter(new RangeFormattingAdapter(this._documents, provider), extension);
		this._proxy.$registerRangeFormattingSupport(handle, this._transformDocumentSelector(selector, extension), extension.identifier, extension.displayName || extension.name, canFormatMultipleRanges);
		return this._createDisposable(handle);
	}

	$provideDocumentRangeFormattingEdits(handle: number, resource: UriComponents, range: IRange, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | undefined> {
		return this._withAdapter(handle, RangeFormattingAdapter, adapter => adapter.provideDocumentRangeFormattingEdits(URI.revive(resource), range, options, token), undefined, token);
	}

	$provideDocumentRangesFormattingEdits(handle: number, resource: UriComponents, ranges: IRange[], options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | undefined> {
		return this._withAdapter(handle, RangeFormattingAdapter, adapter => adapter.provideDocumentRangesFormattingEdits(URI.revive(resource), ranges, options, token), undefined, token);
	}

	registerOnTypeFormattingEditProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.OnTypeFormattingEditProvider, triggerCharacters: string[]): vscode.Disposable {
		const handle = this._addNewAdapter(new OnTypeFormattingAdapter(this._documents, provider), extension);
		this._proxy.$registerOnTypeFormattingSupport(handle, this._transformDocumentSelector(selector, extension), triggerCharacters, extension.identifier);
		return this._createDisposable(handle);
	}

	$provideOnTypeFormattingEdits(handle: number, resource: UriComponents, position: IPosition, ch: string, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | undefined> {
		return this._withAdapter(handle, OnTypeFormattingAdapter, adapter => adapter.provideOnTypeFormattingEdits(URI.revive(resource), position, ch, options, token), undefined, token);
	}

	// --- navigate types

	registerWorkspaceSymbolProvider(extension: IExtensionDescription, provider: vscode.WorkspaceSymbolProvider): vscode.Disposable {
		const handle = this._addNewAdapter(new NavigateTypeAdapter(provider, this._logService), extension);
		this._proxy.$registerNavigateTypeSupport(handle, typeof provider.resolveWorkspaceSymbol === 'function');
		return this._createDisposable(handle);
	}

	$provideWorkspaceSymbols(handle: number, search: string, token: CancellationToken): Promise<extHostProtocol.IWorkspaceSymbolsDto> {
		return this._withAdapter(handle, NavigateTypeAdapter, adapter => adapter.provideWorkspaceSymbols(search, token), { symbols: [] }, token);
	}

	$resolveWorkspaceSymbol(handle: number, symbol: extHostProtocol.IWorkspaceSymbolDto, token: CancellationToken): Promise<extHostProtocol.IWorkspaceSymbolDto | undefined> {
		return this._withAdapter(handle, NavigateTypeAdapter, adapter => adapter.resolveWorkspaceSymbol(symbol, token), undefined, undefined);
	}

	$releaseWorkspaceSymbols(handle: number, id: number): void {
		this._withAdapter(handle, NavigateTypeAdapter, adapter => adapter.releaseWorkspaceSymbols(id), undefined, undefined);
	}

	// --- rename

	registerRenameProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.RenameProvider): vscode.Disposable {
		const handle = this._addNewAdapter(new RenameAdapter(this._documents, provider, this._logService), extension);
		this._proxy.$registerRenameSupport(handle, this._transformDocumentSelector(selector, extension), RenameAdapter.supportsResolving(provider));
		return this._createDisposable(handle);
	}

	$provideRenameEdits(handle: number, resource: UriComponents, position: IPosition, newName: string, token: CancellationToken): Promise<extHostProtocol.IWorkspaceEditDto | undefined> {
		return this._withAdapter(handle, RenameAdapter, adapter => adapter.provideRenameEdits(URI.revive(resource), position, newName, token), undefined, token);
	}

	$resolveRenameLocation(handle: number, resource: URI, position: IPosition, token: CancellationToken): Promise<languages.RenameLocation | undefined> {
		return this._withAdapter(handle, RenameAdapter, adapter => adapter.resolveRenameLocation(URI.revive(resource), position, token), undefined, token);
	}

	registerNewSymbolNamesProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.NewSymbolNamesProvider): vscode.Disposable {
		const handle = this._addNewAdapter(new NewSymbolNamesAdapter(this._documents, provider, this._logService), extension);
		this._proxy.$registerNewSymbolNamesProvider(handle, this._transformDocumentSelector(selector, extension));
		return this._createDisposable(handle);
	}

	$supportsAutomaticNewSymbolNamesTriggerKind(handle: number): Promise<boolean | undefined> {
		return this._withAdapter(
			handle,
			NewSymbolNamesAdapter,
			adapter => adapter.supportsAutomaticNewSymbolNamesTriggerKind(),
			false,
			undefined
		);
	}

	$provideNewSymbolNames(handle: number, resource: UriComponents, range: IRange, triggerKind: languages.NewSymbolNameTriggerKind, token: CancellationToken): Promise<languages.NewSymbolName[] | undefined> {
		return this._withAdapter(handle, NewSymbolNamesAdapter, adapter => adapter.provideNewSymbolNames(URI.revive(resource), range, triggerKind, token), undefined, token);
	}

	//#region semantic coloring

	registerDocumentSemanticTokensProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.DocumentSemanticTokensProvider, legend: vscode.SemanticTokensLegend): vscode.Disposable {
		const handle = this._addNewAdapter(new DocumentSemanticTokensAdapter(this._documents, provider), extension);
		const eventHandle = (typeof provider.onDidChangeSemanticTokens === 'function' ? this._nextHandle() : undefined);
		this._proxy.$registerDocumentSemanticTokensProvider(handle, this._transformDocumentSelector(selector, extension), legend, eventHandle);
		let result = this._createDisposable(handle);

		if (eventHandle) {
			const subscription = provider.onDidChangeSemanticTokens!(_ => this._proxy.$emitDocumentSemanticTokensEvent(eventHandle));
			result = Disposable.from(result, subscription);
		}

		return result;
	}

	$provideDocumentSemanticTokens(handle: number, resource: UriComponents, previousResultId: number, token: CancellationToken): Promise<VSBuffer | null> {
		return this._withAdapter(handle, DocumentSemanticTokensAdapter, adapter => adapter.provideDocumentSemanticTokens(URI.revive(resource), previousResultId, token), null, token);
	}

	$releaseDocumentSemanticTokens(handle: number, semanticColoringResultId: number): void {
		this._withAdapter(handle, DocumentSemanticTokensAdapter, adapter => adapter.releaseDocumentSemanticColoring(semanticColoringResultId), undefined, undefined);
	}

	registerDocumentRangeSemanticTokensProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.DocumentRangeSemanticTokensProvider, legend: vscode.SemanticTokensLegend): vscode.Disposable {
		const handle = this._addNewAdapter(new DocumentRangeSemanticTokensAdapter(this._documents, provider), extension);
		const eventHandle = (typeof provider.onDidChangeSemanticTokens === 'function' ? this._nextHandle() : undefined);
		this._proxy.$registerDocumentRangeSemanticTokensProvider(handle, this._transformDocumentSelector(selector, extension), legend, eventHandle);
		let result = this._createDisposable(handle);

		if (eventHandle) {
			const subscription = provider.onDidChangeSemanticTokens!(_ => this._proxy.$emitDocumentRangeSemanticTokensEvent(eventHandle));
			result = Disposable.from(result, subscription);
		}

		return result;
	}

	$provideDocumentRangeSemanticTokens(handle: number, resource: UriComponents, range: IRange, token: CancellationToken): Promise<VSBuffer | null> {
		return this._withAdapter(handle, DocumentRangeSemanticTokensAdapter, adapter => adapter.provideDocumentRangeSemanticTokens(URI.revive(resource), range, token), null, token);
	}

	//#endregion

	// --- suggestion

	registerCompletionItemProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.CompletionItemProvider, triggerCharacters: string[]): vscode.Disposable {
		const handle = this._addNewAdapter(new CompletionsAdapter(this._documents, this._commands.converter, provider, this._apiDeprecation, extension), extension);
		this._proxy.$registerCompletionsProvider(handle, this._transformDocumentSelector(selector, extension), triggerCharacters, CompletionsAdapter.supportsResolving(provider), extension.identifier);
		return this._createDisposable(handle);
	}

	$provideCompletionItems(handle: number, resource: UriComponents, position: IPosition, context: languages.CompletionContext, token: CancellationToken): Promise<extHostProtocol.ISuggestResultDto | undefined> {
		return this._withAdapter(handle, CompletionsAdapter, adapter => adapter.provideCompletionItems(URI.revive(resource), position, context, token), undefined, token);
	}

	$resolveCompletionItem(handle: number, id: extHostProtocol.ChainedCacheId, token: CancellationToken): Promise<extHostProtocol.ISuggestDataDto | undefined> {
		return this._withAdapter(handle, CompletionsAdapter, adapter => adapter.resolveCompletionItem(id, token), undefined, token);
	}

	$releaseCompletionItems(handle: number, id: number): void {
		this._withAdapter(handle, CompletionsAdapter, adapter => adapter.releaseCompletionItems(id), undefined, undefined);
	}

	// --- ghost text

	registerInlineCompletionsProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.InlineCompletionItemProvider, metadata: vscode.InlineCompletionItemProviderMetadata | undefined): vscode.Disposable {
		const adapter = new InlineCompletionAdapter(extension, this._documents, provider, this._commands.converter);
		const handle = this._addNewAdapter(adapter, extension);
		let result = this._createDisposable(handle);

		const supportsOnDidChange = isProposedApiEnabled(extension, 'inlineCompletionsAdditions') && typeof provider.onDidChange === 'function';
		if (supportsOnDidChange) {
			const subscription = provider.onDidChange!(_ => this._proxy.$emitInlineCompletionsChange(handle));
			result = Disposable.from(result, subscription);
		}

		const supportsOnDidChangeModelInfo = isProposedApiEnabled(extension, 'inlineCompletionsAdditions') && typeof provider.onDidChangeModelInfo === 'function';
		if (supportsOnDidChangeModelInfo) {
			const subscription = provider.onDidChangeModelInfo!(_ => this._proxy.$emitInlineCompletionModelInfoChange(handle, adapter.modelInfo));
			result = Disposable.from(result, subscription);
		}
		this._proxy.$registerInlineCompletionsSupport(
			handle,
			this._transformDocumentSelector(selector, extension),
			adapter.supportsHandleEvents,
			ExtensionIdentifier.toKey(extension.identifier.value),
			extension.version,
			metadata?.groupId ? ExtensionIdentifier.toKey(metadata.groupId) : undefined,
			metadata?.yieldTo?.map(extId => ExtensionIdentifier.toKey(extId)) || [],
			metadata?.displayName,
			metadata?.debounceDelayMs,
			metadata?.excludes?.map(extId => ExtensionIdentifier.toKey(extId)) || [],
			supportsOnDidChange,
			adapter.supportsSetModelId,
			adapter.modelInfo,
			supportsOnDidChangeModelInfo,
		);
		return result;
	}

	$provideInlineCompletions(handle: number, resource: UriComponents, position: IPosition, context: languages.InlineCompletionContext, token: CancellationToken): Promise<extHostProtocol.IdentifiableInlineCompletions | undefined> {
		return this._withAdapter(handle, InlineCompletionAdapter, adapter => adapter.provideInlineCompletions(URI.revive(resource), position, context, token), undefined, undefined);
	}

	$handleInlineCompletionDidShow(handle: number, pid: number, idx: number, updatedInsertText: string): void {
		this._withAdapter(handle, InlineCompletionAdapter, async adapter => {
			adapter.handleDidShowCompletionItem(pid, idx, updatedInsertText);
		}, undefined, undefined);
	}

	$handleInlineCompletionPartialAccept(handle: number, pid: number, idx: number, acceptedCharacters: number, info: languages.PartialAcceptInfo): void {
		this._withAdapter(handle, InlineCompletionAdapter, async adapter => {
			adapter.handlePartialAccept(pid, idx, acceptedCharacters, info);
		}, undefined, undefined);
	}

	$handleInlineCompletionEndOfLifetime(handle: number, pid: number, idx: number, reason: languages.InlineCompletionEndOfLifeReason<{ pid: number; idx: number }>): void {
		this._withAdapter(handle, InlineCompletionAdapter, async adapter => {
			adapter.handleEndOfLifetime(pid, idx, reason);
		}, undefined, undefined);
	}

	$handleInlineCompletionRejection(handle: number, pid: number, idx: number): void {
		this._withAdapter(handle, InlineCompletionAdapter, async adapter => {
			adapter.handleRejection(pid, idx);
		}, undefined, undefined);
	}

	$freeInlineCompletionsList(handle: number, pid: number, reason: languages.InlineCompletionsDisposeReason): void {
		this._withAdapter(handle, InlineCompletionAdapter, async adapter => { adapter.disposeCompletions(pid, reason); }, undefined, undefined);
	}

	$acceptInlineCompletionsUnificationState(state: IInlineCompletionsUnificationState): void {
		this._inlineCompletionsUnificationState = state;
		this._onDidChangeInlineCompletionsUnificationState.fire();
	}

	$handleInlineCompletionSetCurrentModelId(handle: number, modelId: string): void {
		this._withAdapter(handle, InlineCompletionAdapter, async adapter => {
			adapter.setCurrentModelId(modelId);
		}, undefined, undefined);
	}

	// --- parameter hints

	registerSignatureHelpProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.SignatureHelpProvider, metadataOrTriggerChars: string[] | vscode.SignatureHelpProviderMetadata): vscode.Disposable {
		const metadata: extHostProtocol.ISignatureHelpProviderMetadataDto | undefined = Array.isArray(metadataOrTriggerChars)
			? { triggerCharacters: metadataOrTriggerChars, retriggerCharacters: [] }
			: metadataOrTriggerChars;

		const handle = this._addNewAdapter(new SignatureHelpAdapter(this._documents, provider), extension);
		this._proxy.$registerSignatureHelpProvider(handle, this._transformDocumentSelector(selector, extension), metadata);
		return this._createDisposable(handle);
	}

	$provideSignatureHelp(handle: number, resource: UriComponents, position: IPosition, context: extHostProtocol.ISignatureHelpContextDto, token: CancellationToken): Promise<extHostProtocol.ISignatureHelpDto | undefined> {
		return this._withAdapter(handle, SignatureHelpAdapter, adapter => adapter.provideSignatureHelp(URI.revive(resource), position, context, token), undefined, token);
	}

	$releaseSignatureHelp(handle: number, id: number): void {
		this._withAdapter(handle, SignatureHelpAdapter, adapter => adapter.releaseSignatureHelp(id), undefined, undefined);
	}

	// --- inline hints

	registerInlayHintsProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.InlayHintsProvider): vscode.Disposable {

		const eventHandle = typeof provider.onDidChangeInlayHints === 'function' ? this._nextHandle() : undefined;
		const handle = this._addNewAdapter(new InlayHintsAdapter(this._documents, this._commands.converter, provider, this._logService, extension), extension);

		this._proxy.$registerInlayHintsProvider(handle, this._transformDocumentSelector(selector, extension), typeof provider.resolveInlayHint === 'function', eventHandle, ExtHostLanguageFeatures._extLabel(extension));
		let result = this._createDisposable(handle);

		if (eventHandle !== undefined) {
			const subscription = provider.onDidChangeInlayHints!(uri => this._proxy.$emitInlayHintsEvent(eventHandle));
			result = Disposable.from(result, subscription);
		}
		return result;
	}

	$provideInlayHints(handle: number, resource: UriComponents, range: IRange, token: CancellationToken): Promise<extHostProtocol.IInlayHintsDto | undefined> {
		return this._withAdapter(handle, InlayHintsAdapter, adapter => adapter.provideInlayHints(URI.revive(resource), range, token), undefined, token);
	}

	$resolveInlayHint(handle: number, id: extHostProtocol.ChainedCacheId, token: CancellationToken): Promise<extHostProtocol.IInlayHintDto | undefined> {
		return this._withAdapter(handle, InlayHintsAdapter, adapter => adapter.resolveInlayHint(id, token), undefined, token);
	}

	$releaseInlayHints(handle: number, id: number): void {
		this._withAdapter(handle, InlayHintsAdapter, adapter => adapter.releaseHints(id), undefined, undefined);
	}

	// --- links

	registerDocumentLinkProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.DocumentLinkProvider): vscode.Disposable {
		const handle = this._addNewAdapter(new LinkProviderAdapter(this._documents, provider), extension);
		this._proxy.$registerDocumentLinkProvider(handle, this._transformDocumentSelector(selector, extension), typeof provider.resolveDocumentLink === 'function');
		return this._createDisposable(handle);
	}

	$provideDocumentLinks(handle: number, resource: UriComponents, token: CancellationToken): Promise<extHostProtocol.ILinksListDto | undefined> {
		return this._withAdapter(handle, LinkProviderAdapter, adapter => adapter.provideLinks(URI.revive(resource), token), undefined, token, resource.scheme === 'output');
	}

	$resolveDocumentLink(handle: number, id: extHostProtocol.ChainedCacheId, token: CancellationToken): Promise<extHostProtocol.ILinkDto | undefined> {
		return this._withAdapter(handle, LinkProviderAdapter, adapter => adapter.resolveLink(id, token), undefined, undefined, true);
	}

	$releaseDocumentLinks(handle: number, id: number): void {
		this._withAdapter(handle, LinkProviderAdapter, adapter => adapter.releaseLinks(id), undefined, undefined, true);
	}

	registerColorProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.DocumentColorProvider): vscode.Disposable {
		const handle = this._addNewAdapter(new ColorProviderAdapter(this._documents, provider), extension);
		this._proxy.$registerDocumentColorProvider(handle, this._transformDocumentSelector(selector, extension));
		return this._createDisposable(handle);
	}

	$provideDocumentColors(handle: number, resource: UriComponents, token: CancellationToken): Promise<extHostProtocol.IRawColorInfo[]> {
		return this._withAdapter(handle, ColorProviderAdapter, adapter => adapter.provideColors(URI.revive(resource), token), [], token);
	}

	$provideColorPresentations(handle: number, resource: UriComponents, colorInfo: extHostProtocol.IRawColorInfo, token: CancellationToken): Promise<languages.IColorPresentation[] | undefined> {
		return this._withAdapter(handle, ColorProviderAdapter, adapter => adapter.provideColorPresentations(URI.revive(resource), colorInfo, token), undefined, token);
	}

	registerFoldingRangeProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.FoldingRangeProvider): vscode.Disposable {
		const handle = this._nextHandle();
		const eventHandle = typeof provider.onDidChangeFoldingRanges === 'function' ? this._nextHandle() : undefined;

		this._adapter.set(handle, new AdapterData(new FoldingProviderAdapter(this._documents, provider), extension));
		this._proxy.$registerFoldingRangeProvider(handle, this._transformDocumentSelector(selector, extension), extension.identifier, eventHandle);
		let result = this._createDisposable(handle);

		if (eventHandle !== undefined) {
			const subscription = provider.onDidChangeFoldingRanges!(() => this._proxy.$emitFoldingRangeEvent(eventHandle));
			result = Disposable.from(result, subscription);
		}

		return result;
	}

	$provideFoldingRanges(handle: number, resource: UriComponents, context: vscode.FoldingContext, token: CancellationToken): Promise<languages.FoldingRange[] | undefined> {
		return this._withAdapter(
			handle,
			FoldingProviderAdapter,
			(adapter) =>
				adapter.provideFoldingRanges(URI.revive(resource), context, token),
			undefined,
			token
		);
	}

	// --- smart select

	registerSelectionRangeProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.SelectionRangeProvider): vscode.Disposable {
		const handle = this._addNewAdapter(new SelectionRangeAdapter(this._documents, provider, this._logService), extension);
		this._proxy.$registerSelectionRangeProvider(handle, this._transformDocumentSelector(selector, extension));
		return this._createDisposable(handle);
	}

	$provideSelectionRanges(handle: number, resource: UriComponents, positions: IPosition[], token: CancellationToken): Promise<languages.SelectionRange[][]> {
		return this._withAdapter(handle, SelectionRangeAdapter, adapter => adapter.provideSelectionRanges(URI.revive(resource), positions, token), [], token);
	}

	// --- call hierarchy

	registerCallHierarchyProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.CallHierarchyProvider): vscode.Disposable {
		const handle = this._addNewAdapter(new CallHierarchyAdapter(this._documents, provider), extension);
		this._proxy.$registerCallHierarchyProvider(handle, this._transformDocumentSelector(selector, extension));
		return this._createDisposable(handle);
	}

	$prepareCallHierarchy(handle: number, resource: UriComponents, position: IPosition, token: CancellationToken): Promise<extHostProtocol.ICallHierarchyItemDto[] | undefined> {
		return this._withAdapter(handle, CallHierarchyAdapter, adapter => Promise.resolve(adapter.prepareSession(URI.revive(resource), position, token)), undefined, token);
	}

	$provideCallHierarchyIncomingCalls(handle: number, sessionId: string, itemId: string, token: CancellationToken): Promise<extHostProtocol.IIncomingCallDto[] | undefined> {
		return this._withAdapter(handle, CallHierarchyAdapter, adapter => adapter.provideCallsTo(sessionId, itemId, token), undefined, token);
	}

	$provideCallHierarchyOutgoingCalls(handle: number, sessionId: string, itemId: string, token: CancellationToken): Promise<extHostProtocol.IOutgoingCallDto[] | undefined> {
		return this._withAdapter(handle, CallHierarchyAdapter, adapter => adapter.provideCallsFrom(sessionId, itemId, token), undefined, token);
	}

	$releaseCallHierarchy(handle: number, sessionId: string): void {
		this._withAdapter(handle, CallHierarchyAdapter, adapter => Promise.resolve(adapter.releaseSession(sessionId)), undefined, undefined);
	}

	// --- type hierarchy
	registerTypeHierarchyProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.TypeHierarchyProvider): vscode.Disposable {
		const handle = this._addNewAdapter(new TypeHierarchyAdapter(this._documents, provider), extension);
		this._proxy.$registerTypeHierarchyProvider(handle, this._transformDocumentSelector(selector, extension));
		return this._createDisposable(handle);
	}

	$prepareTypeHierarchy(handle: number, resource: UriComponents, position: IPosition, token: CancellationToken): Promise<extHostProtocol.ITypeHierarchyItemDto[] | undefined> {
		return this._withAdapter(handle, TypeHierarchyAdapter, adapter => Promise.resolve(adapter.prepareSession(URI.revive(resource), position, token)), undefined, token);
	}

	$provideTypeHierarchySupertypes(handle: number, sessionId: string, itemId: string, token: CancellationToken): Promise<extHostProtocol.ITypeHierarchyItemDto[] | undefined> {
		return this._withAdapter(handle, TypeHierarchyAdapter, adapter => adapter.provideSupertypes(sessionId, itemId, token), undefined, token);
	}

	$provideTypeHierarchySubtypes(handle: number, sessionId: string, itemId: string, token: CancellationToken): Promise<extHostProtocol.ITypeHierarchyItemDto[] | undefined> {
		return this._withAdapter(handle, TypeHierarchyAdapter, adapter => adapter.provideSubtypes(sessionId, itemId, token), undefined, token);
	}

	$releaseTypeHierarchy(handle: number, sessionId: string): void {
		this._withAdapter(handle, TypeHierarchyAdapter, adapter => Promise.resolve(adapter.releaseSession(sessionId)), undefined, undefined);
	}

	// --- Document on drop

	registerDocumentOnDropEditProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.DocumentDropEditProvider, metadata?: vscode.DocumentDropEditProviderMetadata) {
		const handle = this._nextHandle();
		this._adapter.set(handle, new AdapterData(new DocumentDropEditAdapter(this._proxy, this._documents, provider, handle, extension), extension));

		this._proxy.$registerDocumentOnDropEditProvider(handle, this._transformDocumentSelector(selector, extension), metadata ? {
			supportsResolve: !!provider.resolveDocumentDropEdit,
			dropMimeTypes: metadata.dropMimeTypes,
			providedDropKinds: metadata.providedDropEditKinds?.map(x => x.value),
		} : undefined);

		return this._createDisposable(handle);
	}

	$provideDocumentOnDropEdits(handle: number, requestId: number, resource: UriComponents, position: IPosition, dataTransferDto: extHostProtocol.DataTransferDTO, token: CancellationToken): Promise<extHostProtocol.IDocumentDropEditDto[] | undefined> {
		return this._withAdapter(handle, DocumentDropEditAdapter, adapter =>
			Promise.resolve(adapter.provideDocumentOnDropEdits(requestId, URI.revive(resource), position, dataTransferDto, token)), undefined, undefined);
	}

	$resolveDropEdit(handle: number, id: extHostProtocol.ChainedCacheId, token: CancellationToken): Promise<{ additionalEdit?: extHostProtocol.IWorkspaceEditDto }> {
		return this._withAdapter(handle, DocumentDropEditAdapter, adapter => adapter.resolveDropEdit(id, token), {}, undefined);
	}

	$releaseDocumentOnDropEdits(handle: number, cacheId: number): void {
		this._withAdapter(handle, DocumentDropEditAdapter, adapter => Promise.resolve(adapter.releaseDropEdits(cacheId)), undefined, undefined);
	}

	// --- copy/paste actions

	registerDocumentPasteEditProvider(extension: IExtensionDescription, selector: vscode.DocumentSelector, provider: vscode.DocumentPasteEditProvider, metadata: vscode.DocumentPasteProviderMetadata): vscode.Disposable {
		const handle = this._nextHandle();
		this._adapter.set(handle, new AdapterData(new DocumentPasteEditProvider(this._proxy, this._documents, provider, handle, extension), extension));
		this._proxy.$registerPasteEditProvider(handle, this._transformDocumentSelector(selector, extension), {
			supportsCopy: !!provider.prepareDocumentPaste,
			supportsPaste: !!provider.provideDocumentPasteEdits,
			supportsResolve: !!provider.resolveDocumentPasteEdit,
			providedPasteEditKinds: metadata.providedPasteEditKinds?.map(x => x.value),
			copyMimeTypes: metadata.copyMimeTypes,
			pasteMimeTypes: metadata.pasteMimeTypes,
		});
		return this._createDisposable(handle);
	}

	$prepareDocumentPaste(handle: number, resource: UriComponents, ranges: IRange[], dataTransfer: extHostProtocol.DataTransferDTO, token: CancellationToken): Promise<extHostProtocol.DataTransferDTO | undefined> {
		return this._withAdapter(handle, DocumentPasteEditProvider, adapter => adapter.prepareDocumentPaste(URI.revive(resource), ranges, dataTransfer, token), undefined, token);
	}

	$providePasteEdits(handle: number, requestId: number, resource: UriComponents, ranges: IRange[], dataTransferDto: extHostProtocol.DataTransferDTO, context: extHostProtocol.IDocumentPasteContextDto, token: CancellationToken): Promise<extHostProtocol.IPasteEditDto[] | undefined> {
		return this._withAdapter(handle, DocumentPasteEditProvider, adapter => adapter.providePasteEdits(requestId, URI.revive(resource), ranges, dataTransferDto, context, token), undefined, token);
	}

	$resolvePasteEdit(handle: number, id: extHostProtocol.ChainedCacheId, token: CancellationToken): Promise<{ additionalEdit?: extHostProtocol.IWorkspaceEditDto }> {
		return this._withAdapter(handle, DocumentPasteEditProvider, adapter => adapter.resolvePasteEdit(id, token), {}, undefined);
	}

	$releasePasteEdits(handle: number, cacheId: number): void {
		this._withAdapter(handle, DocumentPasteEditProvider, adapter => Promise.resolve(adapter.releasePasteEdits(cacheId)), undefined, undefined);
	}

	// --- configuration

	private static _serializeRegExp(regExp: RegExp): extHostProtocol.IRegExpDto {
		return {
			pattern: regExp.source,
			flags: regExp.flags,
		};
	}

	private static _serializeIndentationRule(indentationRule: vscode.IndentationRule): extHostProtocol.IIndentationRuleDto {
		return {
			decreaseIndentPattern: ExtHostLanguageFeatures._serializeRegExp(indentationRule.decreaseIndentPattern),
			increaseIndentPattern: ExtHostLanguageFeatures._serializeRegExp(indentationRule.increaseIndentPattern),
			indentNextLinePattern: indentationRule.indentNextLinePattern ? ExtHostLanguageFeatures._serializeRegExp(indentationRule.indentNextLinePattern) : undefined,
			unIndentedLinePattern: indentationRule.unIndentedLinePattern ? ExtHostLanguageFeatures._serializeRegExp(indentationRule.unIndentedLinePattern) : undefined,
		};
	}

	private static _serializeOnEnterRule(onEnterRule: vscode.OnEnterRule): extHostProtocol.IOnEnterRuleDto {
		return {
			beforeText: ExtHostLanguageFeatures._serializeRegExp(onEnterRule.beforeText),
			afterText: onEnterRule.afterText ? ExtHostLanguageFeatures._serializeRegExp(onEnterRule.afterText) : undefined,
			previousLineText: onEnterRule.previousLineText ? ExtHostLanguageFeatures._serializeRegExp(onEnterRule.previousLineText) : undefined,
			action: onEnterRule.action
		};
	}

	private static _serializeOnEnterRules(onEnterRules: vscode.OnEnterRule[]): extHostProtocol.IOnEnterRuleDto[] {
		return onEnterRules.map(ExtHostLanguageFeatures._serializeOnEnterRule);
	}

	private static _serializeAutoClosingPair(autoClosingPair: vscode.AutoClosingPair): IAutoClosingPairConditional {
		return {
			open: autoClosingPair.open,
			close: autoClosingPair.close,
			notIn: autoClosingPair.notIn ? autoClosingPair.notIn.map(v => SyntaxTokenType.toString(v)) : undefined,
		};
	}

	private static _serializeAutoClosingPairs(autoClosingPairs: vscode.AutoClosingPair[]): IAutoClosingPairConditional[] {
		return autoClosingPairs.map(ExtHostLanguageFeatures._serializeAutoClosingPair);
	}

	setLanguageConfiguration(extension: IExtensionDescription, languageId: string, configuration: vscode.LanguageConfiguration): vscode.Disposable {
		const { wordPattern } = configuration;

		// check for a valid word pattern
		if (wordPattern && regExpLeadsToEndlessLoop(wordPattern)) {
			throw new Error(`Invalid language configuration: wordPattern '${wordPattern}' is not allowed to match the empty string.`);
		}

		// word definition
		if (wordPattern) {
			this._documents.setWordDefinitionFor(languageId, wordPattern);
		} else {
			this._documents.setWordDefinitionFor(languageId, undefined);
		}

		if (configuration.__electricCharacterSupport) {
			this._apiDeprecation.report('LanguageConfiguration.__electricCharacterSupport', extension,
				`Do not use.`);
		}

		if (configuration.__characterPairSupport) {
			this._apiDeprecation.report('LanguageConfiguration.__characterPairSupport', extension,
				`Do not use.`);
		}

		const handle = this._nextHandle();
		const serializedConfiguration: extHostProtocol.ILanguageConfigurationDto = {
			comments: configuration.comments,
			brackets: configuration.brackets,
			wordPattern: configuration.wordPattern ? ExtHostLanguageFeatures._serializeRegExp(configuration.wordPattern) : undefined,
			indentationRules: configuration.indentationRules ? ExtHostLanguageFeatures._serializeIndentationRule(configuration.indentationRules) : undefined,
			onEnterRules: configuration.onEnterRules ? ExtHostLanguageFeatures._serializeOnEnterRules(configuration.onEnterRules) : undefined,
			__electricCharacterSupport: configuration.__electricCharacterSupport,
			__characterPairSupport: configuration.__characterPairSupport,
			autoClosingPairs: configuration.autoClosingPairs ? ExtHostLanguageFeatures._serializeAutoClosingPairs(configuration.autoClosingPairs) : undefined,
		};

		this._proxy.$setLanguageConfiguration(handle, languageId, serializedConfiguration);
		return this._createDisposable(handle);
	}

	$setWordDefinitions(wordDefinitions: extHostProtocol.ILanguageWordDefinitionDto[]): void {
		for (const wordDefinition of wordDefinitions) {
			this._documents.setWordDefinitionFor(wordDefinition.languageId, new RegExp(wordDefinition.regexSource, wordDefinition.regexFlags));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostLanguageModels.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostLanguageModels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { AsyncIterableProducer, AsyncIterableSource, RunOnceScheduler } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { SerializedError, transformErrorForSerialization, transformErrorFromSerialization } from '../../../base/common/errors.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Iterable } from '../../../base/common/iterator.js';
import { IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { ExtensionIdentifier, ExtensionIdentifierMap, ExtensionIdentifierSet, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { Progress } from '../../../platform/progress/common/progress.js';
import { IChatMessage, IChatResponsePart, ILanguageModelChatMetadata, ILanguageModelChatMetadataAndIdentifier } from '../../contrib/chat/common/languageModels.js';
import { DEFAULT_MODEL_PICKER_CATEGORY } from '../../contrib/chat/common/modelPicker/modelPickerWidget.js';
import { INTERNAL_AUTH_PROVIDER_PREFIX } from '../../services/authentication/common/authentication.js';
import { checkProposedApiEnabled, isProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { SerializableObjectWithBuffers } from '../../services/extensions/common/proxyIdentifier.js';
import { ExtHostLanguageModelsShape, MainContext, MainThreadLanguageModelsShape } from './extHost.protocol.js';
import { IExtHostAuthentication } from './extHostAuthentication.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import * as typeConvert from './extHostTypeConverters.js';
import * as extHostTypes from './extHostTypes.js';

export interface IExtHostLanguageModels extends ExtHostLanguageModels { }

export const IExtHostLanguageModels = createDecorator<IExtHostLanguageModels>('IExtHostLanguageModels');

type LanguageModelProviderData = {
	readonly extension: IExtensionDescription;
	readonly provider: vscode.LanguageModelChatProvider;
};

type LMResponsePart = vscode.LanguageModelTextPart | vscode.LanguageModelToolCallPart | vscode.LanguageModelDataPart | vscode.LanguageModelThinkingPart;


class LanguageModelResponse {

	readonly apiObject: vscode.LanguageModelChatResponse;

	private readonly _defaultStream = new AsyncIterableSource<LMResponsePart>();
	private _isDone: boolean = false;

	constructor() {

		const that = this;

		const [stream1, stream2] = AsyncIterableProducer.tee(that._defaultStream.asyncIterable);

		this.apiObject = {
			// result: promise,
			get stream() {
				return stream1;
			},
			get text() {
				return stream2.map(part => {
					if (part instanceof extHostTypes.LanguageModelTextPart) {
						return part.value;
					} else {
						return undefined;
					}
				}).coalesce();
			},
		};
	}

	handleResponsePart(parts: IChatResponsePart | IChatResponsePart[]): void {
		if (this._isDone) {
			return;
		}

		const lmResponseParts: LMResponsePart[] = [];

		for (const part of Iterable.wrap(parts)) {

			let out: LMResponsePart;
			if (part.type === 'text') {
				out = new extHostTypes.LanguageModelTextPart(part.value, part.audience);
			} else if (part.type === 'thinking') {
				out = new extHostTypes.LanguageModelThinkingPart(part.value, part.id, part.metadata);

			} else if (part.type === 'data') {
				out = new extHostTypes.LanguageModelDataPart(part.data.buffer, part.mimeType, part.audience);
			} else {
				out = new extHostTypes.LanguageModelToolCallPart(part.toolCallId, part.name, part.parameters);
			}
			lmResponseParts.push(out);
		}

		this._defaultStream.emitMany(lmResponseParts);
	}

	reject(err: Error): void {
		this._isDone = true;
		this._defaultStream.reject(err);
	}

	resolve(): void {
		this._isDone = true;
		this._defaultStream.resolve();
	}
}

export class ExtHostLanguageModels implements ExtHostLanguageModelsShape {

	declare _serviceBrand: undefined;

	private static _idPool = 1;

	private readonly _proxy: MainThreadLanguageModelsShape;
	private readonly _onDidChangeModelAccess = new Emitter<{ from: ExtensionIdentifier; to: ExtensionIdentifier }>();
	private readonly _onDidChangeProviders = new Emitter<void>();
	readonly onDidChangeProviders = this._onDidChangeProviders.event;
	private readonly _onDidChangeModelProxyAvailability = new Emitter<void>();
	readonly onDidChangeModelProxyAvailability = this._onDidChangeModelProxyAvailability.event;

	private readonly _languageModelProviders = new Map<string, LanguageModelProviderData>();
	// TODO @lramos15 - Remove the need for both info and metadata as it's a lot of redundancy. Should just need one
	private readonly _localModels = new Map<string, { metadata: ILanguageModelChatMetadata; info: vscode.LanguageModelChatInformation }>();
	private readonly _modelAccessList = new ExtensionIdentifierMap<ExtensionIdentifierSet>();
	private readonly _pendingRequest = new Map<number, { languageModelId: string; res: LanguageModelResponse }>();
	private readonly _ignoredFileProviders = new Map<number, vscode.LanguageModelIgnoredFileProvider>();
	private _languageModelProxyProvider: vscode.LanguageModelProxyProvider | undefined;

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@ILogService private readonly _logService: ILogService,
		@IExtHostAuthentication private readonly _extHostAuthentication: IExtHostAuthentication,
	) {
		this._proxy = extHostRpc.getProxy(MainContext.MainThreadLanguageModels);
	}

	dispose(): void {
		this._onDidChangeModelAccess.dispose();
		this._onDidChangeProviders.dispose();
		this._onDidChangeModelProxyAvailability.dispose();
	}

	registerLanguageModelChatProvider(extension: IExtensionDescription, vendor: string, provider: vscode.LanguageModelChatProvider): IDisposable {

		this._languageModelProviders.set(vendor, { extension: extension, provider });
		this._proxy.$registerLanguageModelProvider(vendor);

		let providerChangeEventDisposable: IDisposable | undefined;
		if (provider.onDidChangeLanguageModelChatInformation) {
			providerChangeEventDisposable = provider.onDidChangeLanguageModelChatInformation(() => {
				this._proxy.$onLMProviderChange(vendor);
			});
		}

		return toDisposable(() => {
			this._languageModelProviders.delete(vendor);
			this._clearModelCache(vendor);
			providerChangeEventDisposable?.dispose();
			this._proxy.$unregisterProvider(vendor);
		});
	}

	// Helper function to clear the local cache for a specific vendor. There's no lookup, so this involves iterating over all models.
	private _clearModelCache(vendor: string): void {
		this._localModels.forEach((value, key) => {
			if (value.metadata.vendor === vendor) {
				this._localModels.delete(key);
			}
		});
	}

	async $provideLanguageModelChatInfo(vendor: string, options: { silent: boolean }, token: CancellationToken): Promise<ILanguageModelChatMetadataAndIdentifier[]> {
		const data = this._languageModelProviders.get(vendor);
		if (!data) {
			return [];
		}
		const modelInformation: vscode.LanguageModelChatInformation[] = await data.provider.provideLanguageModelChatInformation(options, token) ?? [];
		const modelMetadataAndIdentifier: ILanguageModelChatMetadataAndIdentifier[] = modelInformation.map((m): ILanguageModelChatMetadataAndIdentifier => {
			let auth;
			if (m.requiresAuthorization && isProposedApiEnabled(data.extension, 'chatProvider')) {
				auth = {
					providerLabel: data.extension.displayName || data.extension.name,
					accountLabel: typeof m.requiresAuthorization === 'object' ? m.requiresAuthorization.label : undefined
				};
			}
			if (m.capabilities.editTools) {
				checkProposedApiEnabled(data.extension, 'chatProvider');
			}

			return {
				metadata: {
					extension: data.extension.identifier,
					id: m.id,
					vendor,
					name: m.name ?? '',
					family: m.family ?? '',
					detail: m.detail,
					tooltip: m.tooltip,
					version: m.version,
					maxInputTokens: m.maxInputTokens,
					maxOutputTokens: m.maxOutputTokens,
					auth,
					isDefault: m.isDefault,
					isUserSelectable: m.isUserSelectable,
					statusIcon: m.statusIcon,
					modelPickerCategory: m.category ?? DEFAULT_MODEL_PICKER_CATEGORY,
					capabilities: m.capabilities ? {
						vision: m.capabilities.imageInput,
						editTools: m.capabilities.editTools,
						toolCalling: !!m.capabilities.toolCalling,
						agentMode: !!m.capabilities.toolCalling
					} : undefined,
				},
				identifier: `${vendor}/${m.id}`,
			};
		});

		this._clearModelCache(vendor);
		for (let i = 0; i < modelMetadataAndIdentifier.length; i++) {
			this._localModels.set(modelMetadataAndIdentifier[i].identifier, {
				metadata: modelMetadataAndIdentifier[i].metadata,
				info: modelInformation[i]
			});
		}

		return modelMetadataAndIdentifier;
	}

	async $startChatRequest(modelId: string, requestId: number, from: ExtensionIdentifier, messages: SerializableObjectWithBuffers<IChatMessage[]>, options: vscode.LanguageModelChatRequestOptions, token: CancellationToken): Promise<void> {
		const knownModel = this._localModels.get(modelId);
		if (!knownModel) {
			throw new Error('Model not found');
		}

		const data = this._languageModelProviders.get(knownModel.metadata.vendor);
		if (!data) {
			throw new Error(`Language model provider for '${knownModel.metadata.id}' not found.`);
		}

		const queue: IChatResponsePart[] = [];
		const sendNow = () => {
			if (queue.length > 0) {
				this._proxy.$reportResponsePart(requestId, new SerializableObjectWithBuffers(queue));
				queue.length = 0;
			}
		};
		const queueScheduler = new RunOnceScheduler(sendNow, 30);
		const sendSoon = (part: IChatResponsePart) => {
			const newLen = queue.push(part);
			// flush/send if things pile up more than expected
			if (newLen > 30) {
				sendNow();
				queueScheduler.cancel();
			} else {
				queueScheduler.schedule();
			}
		};

		const progress = new Progress<vscode.LanguageModelTextPart | vscode.LanguageModelToolCallPart | vscode.LanguageModelDataPart | vscode.LanguageModelThinkingPart>(async fragment => {
			if (token.isCancellationRequested) {
				this._logService.warn(`[CHAT](${data.extension.identifier.value}) CANNOT send progress because the REQUEST IS CANCELLED`);
				return;
			}

			let part: IChatResponsePart | undefined;
			if (fragment instanceof extHostTypes.LanguageModelToolCallPart) {
				part = { type: 'tool_use', name: fragment.name, parameters: fragment.input, toolCallId: fragment.callId };
			} else if (fragment instanceof extHostTypes.LanguageModelTextPart) {
				part = { type: 'text', value: fragment.value, audience: fragment.audience };
			} else if (fragment instanceof extHostTypes.LanguageModelDataPart) {
				part = { type: 'data', mimeType: fragment.mimeType, data: VSBuffer.wrap(fragment.data), audience: fragment.audience };
			} else if (fragment instanceof extHostTypes.LanguageModelThinkingPart) {
				part = { type: 'thinking', value: fragment.value, id: fragment.id, metadata: fragment.metadata };
			}

			if (!part) {
				this._logService.warn(`[CHAT](${data.extension.identifier.value}) UNKNOWN part ${JSON.stringify(fragment)}`);
				return;
			}

			sendSoon(part);
		});

		let value: unknown;

		try {
			value = data.provider.provideLanguageModelChatResponse(
				knownModel.info,
				messages.value.map(typeConvert.LanguageModelChatMessage2.to),
				{ ...options, modelOptions: options.modelOptions ?? {}, requestInitiator: ExtensionIdentifier.toKey(from), toolMode: options.toolMode ?? extHostTypes.LanguageModelChatToolMode.Auto },
				progress,
				token
			);

		} catch (err) {
			// synchronously failed
			throw err;
		}

		Promise.resolve(value).then(() => {
			sendNow();
			this._proxy.$reportResponseDone(requestId, undefined);
		}, err => {
			sendNow();
			this._proxy.$reportResponseDone(requestId, transformErrorForSerialization(err));
		});
	}

	//#region --- token counting

	$provideTokenLength(modelId: string, value: string, token: CancellationToken): Promise<number> {
		const knownModel = this._localModels.get(modelId);
		if (!knownModel) {
			return Promise.resolve(0);
		}
		const data = this._languageModelProviders.get(knownModel.metadata.vendor);
		if (!data) {
			return Promise.resolve(0);
		}
		return Promise.resolve(data.provider.provideTokenCount(knownModel.info, value, token));
	}


	//#region --- making request

	async getDefaultLanguageModel(extension: IExtensionDescription, forceResolveModels?: boolean): Promise<vscode.LanguageModelChat | undefined> {
		let defaultModelId: string | undefined;

		if (forceResolveModels) {
			await this.selectLanguageModels(extension, {});
		}

		for (const [modelIdentifier, modelData] of this._localModels) {
			if (modelData.metadata.isDefault) {
				defaultModelId = modelIdentifier;
				break;
			}
		}
		if (!defaultModelId && !forceResolveModels) {
			// Maybe the default wasn't cached so we will try again with resolving the models too
			return this.getDefaultLanguageModel(extension, true);
		}
		return this.getLanguageModelByIdentifier(extension, defaultModelId);
	}

	async getLanguageModelByIdentifier(extension: IExtensionDescription, modelId: string | undefined): Promise<vscode.LanguageModelChat | undefined> {
		if (!modelId) {
			return undefined;
		}

		const model = this._localModels.get(modelId);
		if (!model) {
			// model gone? is this an error on us? Try to resolve model again
			return (await this.selectLanguageModels(extension, { id: modelId }))[0];
		}

		// make sure auth information is correct
		if (this._isUsingAuth(extension.identifier, model.metadata)) {
			await this._fakeAuthPopulate(model.metadata);
		}

		let apiObject: vscode.LanguageModelChat | undefined;
		if (!apiObject) {
			const that = this;
			apiObject = {
				id: model.info.id,
				vendor: model.metadata.vendor,
				family: model.info.family,
				version: model.info.version,
				name: model.info.name,
				capabilities: {
					supportsImageToText: model.metadata.capabilities?.vision ?? false,
					supportsToolCalling: !!model.metadata.capabilities?.toolCalling,
					editToolsHint: model.metadata.capabilities?.editTools,
				},
				maxInputTokens: model.metadata.maxInputTokens,
				countTokens(text, token) {
					if (!that._localModels.has(modelId)) {
						throw extHostTypes.LanguageModelError.NotFound(modelId);
					}
					return that._computeTokenLength(modelId, text, token ?? CancellationToken.None);
				},
				sendRequest(messages, options, token) {
					if (!that._localModels.has(modelId)) {
						throw extHostTypes.LanguageModelError.NotFound(modelId);
					}
					return that._sendChatRequest(extension, modelId, messages, options ?? {}, token ?? CancellationToken.None);
				}
			};

			Object.freeze(apiObject);
		}

		return apiObject;
	}

	async selectLanguageModels(extension: IExtensionDescription, selector: vscode.LanguageModelChatSelector) {

		// this triggers extension activation
		const models = await this._proxy.$selectChatModels({ ...selector, extension: extension.identifier });

		const result: vscode.LanguageModelChat[] = [];

		const modelPromises = models.map(identifier => this.getLanguageModelByIdentifier(extension, identifier));
		const modelResults = await Promise.all(modelPromises);
		for (const model of modelResults) {
			if (model) {
				result.push(model);
			}
		}

		return result;
	}

	private async _sendChatRequest(extension: IExtensionDescription, languageModelId: string, messages: vscode.LanguageModelChatMessage2[], options: vscode.LanguageModelChatRequestOptions, token: CancellationToken) {

		const internalMessages: IChatMessage[] = this._convertMessages(extension, messages);

		const from = extension.identifier;
		const metadata = this._localModels.get(languageModelId)?.metadata;

		if (!metadata || !this._localModels.has(languageModelId)) {
			throw extHostTypes.LanguageModelError.NotFound(`Language model '${languageModelId}' is unknown.`);
		}

		if (this._isUsingAuth(from, metadata)) {
			const success = await this._getAuthAccess(extension, { identifier: metadata.extension, displayName: metadata.auth.providerLabel }, options.justification, false);

			if (!success || !this._modelAccessList.get(from)?.has(metadata.extension)) {
				throw extHostTypes.LanguageModelError.NoPermissions(`Language model '${languageModelId}' cannot be used by '${from.value}'.`);
			}
		}

		const requestId = (Math.random() * 1e6) | 0;
		const res = new LanguageModelResponse();
		this._pendingRequest.set(requestId, { languageModelId, res });

		try {
			await this._proxy.$tryStartChatRequest(from, languageModelId, requestId, new SerializableObjectWithBuffers(internalMessages), options, token);

		} catch (error) {
			// error'ing here means that the request could NOT be started/made, e.g. wrong model, no access, etc, but
			// later the response can fail as well. Those failures are communicated via the stream-object
			this._pendingRequest.delete(requestId);
			throw extHostTypes.LanguageModelError.tryDeserialize(error) ?? error;
		}

		return res.apiObject;
	}

	private _convertMessages(extension: IExtensionDescription, messages: vscode.LanguageModelChatMessage2[]) {
		const internalMessages: IChatMessage[] = [];
		for (const message of messages) {
			if (message.role as number === extHostTypes.LanguageModelChatMessageRole.System) {
				checkProposedApiEnabled(extension, 'languageModelSystem');
			}
			internalMessages.push(typeConvert.LanguageModelChatMessage2.from(message));
		}
		return internalMessages;
	}

	async $acceptResponsePart(requestId: number, chunk: SerializableObjectWithBuffers<IChatResponsePart | IChatResponsePart[]>): Promise<void> {
		const data = this._pendingRequest.get(requestId);
		if (data) {
			data.res.handleResponsePart(chunk.value);
		}
	}

	async $acceptResponseDone(requestId: number, error: SerializedError | undefined): Promise<void> {
		const data = this._pendingRequest.get(requestId);
		if (!data) {
			return;
		}
		this._pendingRequest.delete(requestId);
		if (error) {
			// we error the stream because that's the only way to signal
			// that the request has failed
			data.res.reject(extHostTypes.LanguageModelError.tryDeserialize(error) ?? transformErrorFromSerialization(error));
		} else {
			data.res.resolve();
		}
	}

	// BIG HACK: Using AuthenticationProviders to check access to Language Models
	private async _getAuthAccess(from: IExtensionDescription, to: { identifier: ExtensionIdentifier; displayName: string }, justification: string | undefined, silent: boolean | undefined): Promise<boolean> {
		// This needs to be done in both MainThread & ExtHost ChatProvider
		const providerId = INTERNAL_AUTH_PROVIDER_PREFIX + to.identifier.value;
		const session = await this._extHostAuthentication.getSession(from, providerId, [], { silent: true });

		if (session) {
			this.$updateModelAccesslist([{ from: from.identifier, to: to.identifier, enabled: true }]);
			return true;
		}

		if (silent) {
			return false;
		}

		try {
			const detail = justification
				? localize('chatAccessWithJustification', "Justification: {1}", to.displayName, justification)
				: undefined;
			await this._extHostAuthentication.getSession(from, providerId, [], { forceNewSession: { detail } });
			this.$updateModelAccesslist([{ from: from.identifier, to: to.identifier, enabled: true }]);
			return true;

		} catch (err) {
			// ignore
			return false;
		}
	}

	private _isUsingAuth(from: ExtensionIdentifier, toMetadata: ILanguageModelChatMetadata): toMetadata is ILanguageModelChatMetadata & { auth: NonNullable<ILanguageModelChatMetadata['auth']> } {
		// If the 'to' extension uses an auth check
		return !!toMetadata.auth
			// And we're asking from a different extension
			&& !ExtensionIdentifier.equals(toMetadata.extension, from);
	}

	private async _fakeAuthPopulate(metadata: ILanguageModelChatMetadata): Promise<void> {

		if (!metadata.auth) {
			return;
		}

		for (const from of this._languageAccessInformationExtensions) {
			try {
				await this._getAuthAccess(from, { identifier: metadata.extension, displayName: '' }, undefined, true);
			} catch (err) {
				this._logService.error('Fake Auth request failed');
				this._logService.error(err);
			}
		}
	}

	private async _computeTokenLength(modelId: string, value: string | vscode.LanguageModelChatMessage2, token: vscode.CancellationToken): Promise<number> {

		const data = this._localModels.get(modelId);
		if (!data) {
			throw extHostTypes.LanguageModelError.NotFound(`Language model '${modelId}' is unknown.`);
		}
		return this._languageModelProviders.get(data.metadata.vendor)?.provider.provideTokenCount(data.info, value, token) ?? 0;
		// return this._proxy.$countTokens(languageModelId, (typeof value === 'string' ? value : typeConvert.LanguageModelChatMessage2.from(value)), token);
	}

	$updateModelAccesslist(data: { from: ExtensionIdentifier; to: ExtensionIdentifier; enabled: boolean }[]): void {
		const updated = new Array<{ from: ExtensionIdentifier; to: ExtensionIdentifier }>();
		for (const { from, to, enabled } of data) {
			const set = this._modelAccessList.get(from) ?? new ExtensionIdentifierSet();
			const oldValue = set.has(to);
			if (oldValue !== enabled) {
				if (enabled) {
					set.add(to);
				} else {
					set.delete(to);
				}
				this._modelAccessList.set(from, set);
				const newItem = { from, to };
				updated.push(newItem);
				this._onDidChangeModelAccess.fire(newItem);
			}
		}
	}

	private readonly _languageAccessInformationExtensions = new Set<Readonly<IExtensionDescription>>();

	createLanguageModelAccessInformation(from: Readonly<IExtensionDescription>): vscode.LanguageModelAccessInformation {

		this._languageAccessInformationExtensions.add(from);

		// const that = this;
		const _onDidChangeAccess = Event.signal(Event.filter(this._onDidChangeModelAccess.event, e => ExtensionIdentifier.equals(e.from, from.identifier)));
		const _onDidAddRemove = Event.signal(this._onDidChangeProviders.event);

		return {
			get onDidChange() {
				return Event.any(_onDidChangeAccess, _onDidAddRemove);
			},
			canSendRequest(chat: vscode.LanguageModelChat): boolean | undefined {
				return true;
				// TODO @lramos15 - Fix

				// let metadata: ILanguageModelChatMetadata | undefined;

				// out: for (const [_, value] of that._allLanguageModelData) {
				// 	for (const candidate of value.apiObjects.values()) {
				// 		if (candidate === chat) {
				// 			metadata = value.metadata;
				// 			break out;
				// 		}
				// 	}
				// }
				// if (!metadata) {
				// 	return undefined;
				// }
				// if (!that._isUsingAuth(from.identifier, metadata)) {
				// 	return true;
				// }

				// const list = that._modelAccessList.get(from.identifier);
				// if (!list) {
				// 	return undefined;
				// }
				// return list.has(metadata.extension);
			}
		};
	}

	fileIsIgnored(extension: IExtensionDescription, uri: vscode.Uri, token: vscode.CancellationToken = CancellationToken.None): Promise<boolean> {
		checkProposedApiEnabled(extension, 'chatParticipantAdditions');

		return this._proxy.$fileIsIgnored(uri, token);
	}

	get isModelProxyAvailable(): boolean {
		return !!this._languageModelProxyProvider;
	}

	async getModelProxy(extension: IExtensionDescription): Promise<vscode.LanguageModelProxy> {
		checkProposedApiEnabled(extension, 'languageModelProxy');

		if (!this._languageModelProxyProvider) {
			this._logService.trace('[LanguageModelProxy] No LanguageModelProxyProvider registered');
			throw new Error('No language model proxy provider is registered.');
		}

		const requestingExtensionId = ExtensionIdentifier.toKey(extension.identifier);
		try {
			const result = await Promise.resolve(this._languageModelProxyProvider.provideModelProxy(requestingExtensionId, CancellationToken.None));
			if (!result) {
				this._logService.warn(`[LanguageModelProxy] Provider returned no proxy for ${requestingExtensionId}`);
				throw new Error('Language model proxy is not available.');
			}
			return result;
		} catch (err) {
			this._logService.error(`[LanguageModelProxy] Provider failed to return proxy for ${requestingExtensionId}`, err);
			throw err;
		}
	}

	async $isFileIgnored(handle: number, uri: UriComponents, token: CancellationToken): Promise<boolean> {
		const provider = this._ignoredFileProviders.get(handle);
		if (!provider) {
			throw new Error('Unknown LanguageModelIgnoredFileProvider');
		}

		return (await provider.provideFileIgnored(URI.revive(uri), token)) ?? false;
	}

	registerIgnoredFileProvider(extension: IExtensionDescription, provider: vscode.LanguageModelIgnoredFileProvider): vscode.Disposable {
		checkProposedApiEnabled(extension, 'chatParticipantPrivate');

		const handle = ExtHostLanguageModels._idPool++;
		this._proxy.$registerFileIgnoreProvider(handle);
		this._ignoredFileProviders.set(handle, provider);
		return toDisposable(() => {
			this._proxy.$unregisterFileIgnoreProvider(handle);
			this._ignoredFileProviders.delete(handle);
		});
	}

	registerLanguageModelProxyProvider(extension: IExtensionDescription, provider: vscode.LanguageModelProxyProvider): vscode.Disposable {
		checkProposedApiEnabled(extension, 'chatParticipantPrivate');

		this._languageModelProxyProvider = provider;
		this._onDidChangeModelProxyAvailability.fire();
		return toDisposable(() => {
			if (this._languageModelProxyProvider === provider) {
				this._languageModelProxyProvider = undefined;
				this._onDidChangeModelProxyAvailability.fire();
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostLanguageModelTools.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostLanguageModelTools.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { raceCancellation } from '../../../base/common/async.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { CancellationError } from '../../../base/common/errors.js';
import { Lazy } from '../../../base/common/lazy.js';
import { IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { revive } from '../../../base/common/marshalling.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { IPreparedToolInvocation, isToolInvocationContext, IToolInvocation, IToolInvocationContext, IToolInvocationPreparationContext, IToolResult, ToolInvocationPresentation } from '../../contrib/chat/common/languageModelToolsService.js';
import { ExtensionEditToolId, InternalEditToolId } from '../../contrib/chat/common/tools/editFileTool.js';
import { InternalFetchWebPageToolId } from '../../contrib/chat/common/tools/tools.js';
import { SearchExtensionsToolId } from '../../contrib/extensions/common/searchExtensionsTool.js';
import { checkProposedApiEnabled, isProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { Dto, SerializableObjectWithBuffers } from '../../services/extensions/common/proxyIdentifier.js';
import { ExtHostLanguageModelToolsShape, IMainContext, IToolDataDto, MainContext, MainThreadLanguageModelToolsShape } from './extHost.protocol.js';
import { ExtHostLanguageModels } from './extHostLanguageModels.js';
import * as typeConvert from './extHostTypeConverters.js';

class Tool {

	private _data: IToolDataDto;
	private _apiObject = new Lazy<vscode.LanguageModelToolInformation>(() => {
		const that = this;
		return Object.freeze({
			get name() { return that._data.id; },
			get description() { return that._data.modelDescription; },
			get inputSchema() { return that._data.inputSchema; },
			get tags() { return that._data.tags ?? []; },
			get source() { return undefined; }
		});
	});

	private _apiObjectWithChatParticipantAdditions = new Lazy<vscode.LanguageModelToolInformation>(() => {
		const that = this;
		const source = typeConvert.LanguageModelToolSource.to(that._data.source);

		return Object.freeze({
			get name() { return that._data.id; },
			get description() { return that._data.modelDescription; },
			get inputSchema() { return that._data.inputSchema; },
			get tags() { return that._data.tags ?? []; },
			get source() { return source; }
		});
	});

	constructor(data: IToolDataDto) {
		this._data = data;
	}

	update(newData: IToolDataDto): void {
		this._data = newData;
	}

	get data(): IToolDataDto {
		return this._data;
	}

	get apiObject(): vscode.LanguageModelToolInformation {
		return this._apiObject.value;
	}

	get apiObjectWithChatParticipantAdditions() {
		return this._apiObjectWithChatParticipantAdditions.value;
	}
}

export class ExtHostLanguageModelTools implements ExtHostLanguageModelToolsShape {
	/** A map of tools that were registered in this EH */
	private readonly _registeredTools = new Map<string, { extension: IExtensionDescription; tool: vscode.LanguageModelTool<Object> }>();
	private readonly _proxy: MainThreadLanguageModelToolsShape;
	private readonly _tokenCountFuncs = new Map</* call ID */string, (text: string, token?: vscode.CancellationToken) => Thenable<number>>();

	/** A map of all known tools, from other EHs or registered in vscode core */
	private readonly _allTools = new Map<string, Tool>();

	constructor(
		mainContext: IMainContext,
		private readonly _languageModels: ExtHostLanguageModels,
	) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadLanguageModelTools);

		this._proxy.$getTools().then(tools => {
			for (const tool of tools) {
				this._allTools.set(tool.id, new Tool(revive(tool)));
			}
		});
	}

	async $countTokensForInvocation(callId: string, input: string, token: CancellationToken): Promise<number> {
		const fn = this._tokenCountFuncs.get(callId);
		if (!fn) {
			throw new Error(`Tool invocation call ${callId} not found`);
		}

		return await fn(input, token);
	}

	async invokeTool(extension: IExtensionDescription, toolId: string, options: vscode.LanguageModelToolInvocationOptions<any>, token?: CancellationToken): Promise<vscode.LanguageModelToolResult> {
		const callId = generateUuid();
		if (options.tokenizationOptions) {
			this._tokenCountFuncs.set(callId, options.tokenizationOptions.countTokens);
		}

		try {
			if (options.toolInvocationToken && !isToolInvocationContext(options.toolInvocationToken)) {
				throw new Error(`Invalid tool invocation token`);
			}

			if ((toolId === InternalEditToolId || toolId === ExtensionEditToolId) && !isProposedApiEnabled(extension, 'chatParticipantPrivate')) {
				throw new Error(`Invalid tool: ${toolId}`);
			}

			// Making the round trip here because not all tools were necessarily registered in this EH
			const result = await this._proxy.$invokeTool({
				toolId,
				callId,
				parameters: options.input,
				tokenBudget: options.tokenizationOptions?.tokenBudget,
				context: options.toolInvocationToken as IToolInvocationContext | undefined,
				chatRequestId: isProposedApiEnabled(extension, 'chatParticipantPrivate') ? options.chatRequestId : undefined,
				chatInteractionId: isProposedApiEnabled(extension, 'chatParticipantPrivate') ? options.chatInteractionId : undefined,
				fromSubAgent: isProposedApiEnabled(extension, 'chatParticipantPrivate') ? options.fromSubAgent : undefined,
			}, token);

			const dto: Dto<IToolResult> = result instanceof SerializableObjectWithBuffers ? result.value : result;
			return typeConvert.LanguageModelToolResult.to(revive(dto));
		} finally {
			this._tokenCountFuncs.delete(callId);
		}
	}

	$onDidChangeTools(tools: IToolDataDto[]): void {

		const oldTools = new Set(this._registeredTools.keys());

		for (const tool of tools) {
			oldTools.delete(tool.id);
			const existing = this._allTools.get(tool.id);
			if (existing) {
				existing.update(tool);
			} else {
				this._allTools.set(tool.id, new Tool(revive(tool)));
			}
		}

		for (const id of oldTools) {
			this._allTools.delete(id);
		}
	}

	getTools(extension: IExtensionDescription): vscode.LanguageModelToolInformation[] {
		const hasParticipantAdditions = isProposedApiEnabled(extension, 'chatParticipantPrivate');
		return Array.from(this._allTools.values())
			.map(tool => hasParticipantAdditions ? tool.apiObjectWithChatParticipantAdditions : tool.apiObject)
			.filter(tool => {
				switch (tool.name) {
					case InternalEditToolId:
					case ExtensionEditToolId:
					case InternalFetchWebPageToolId:
					case SearchExtensionsToolId:
						return isProposedApiEnabled(extension, 'chatParticipantPrivate');
					default:
						return true;
				}
			});
	}

	async $invokeTool(dto: Dto<IToolInvocation>, token: CancellationToken): Promise<Dto<IToolResult> | SerializableObjectWithBuffers<Dto<IToolResult>>> {
		const item = this._registeredTools.get(dto.toolId);
		if (!item) {
			throw new Error(`Unknown tool ${dto.toolId}`);
		}

		const options: vscode.LanguageModelToolInvocationOptions<Object> = {
			input: dto.parameters,
			toolInvocationToken: revive(dto.context) as unknown as vscode.ChatParticipantToolToken | undefined,
		};
		if (isProposedApiEnabled(item.extension, 'chatParticipantPrivate')) {
			options.chatRequestId = dto.chatRequestId;
			options.chatInteractionId = dto.chatInteractionId;
			options.chatSessionId = dto.context?.sessionId;
			options.fromSubAgent = dto.fromSubAgent;
		}

		if (isProposedApiEnabled(item.extension, 'chatParticipantAdditions') && dto.modelId) {
			options.model = await this.getModel(dto.modelId, item.extension);
		}

		if (dto.tokenBudget !== undefined) {
			options.tokenizationOptions = {
				tokenBudget: dto.tokenBudget,
				countTokens: this._tokenCountFuncs.get(dto.callId) || ((value, token = CancellationToken.None) =>
					this._proxy.$countTokensForInvocation(dto.callId, value, token))
			};
		}

		let progress: vscode.Progress<{ message?: string | vscode.MarkdownString; increment?: number }> | undefined;
		if (isProposedApiEnabled(item.extension, 'toolProgress')) {
			let lastProgress: number | undefined;
			progress = {
				report: value => {
					if (value.increment !== undefined) {
						lastProgress = (lastProgress ?? 0) + value.increment;
					}

					this._proxy.$acceptToolProgress(dto.callId, {
						message: typeConvert.MarkdownString.fromStrict(value.message),
						progress: lastProgress === undefined ? undefined : lastProgress / 100,
					});
				}
			};
		}

		// todo: 'any' cast because TS can't handle the overloads
		// eslint-disable-next-line local/code-no-any-casts
		const extensionResult = await raceCancellation(Promise.resolve((item.tool.invoke as any)(options, token, progress!)), token);
		if (!extensionResult) {
			throw new CancellationError();
		}

		return typeConvert.LanguageModelToolResult.from(extensionResult, item.extension);
	}

	private async getModel(modelId: string, extension: IExtensionDescription): Promise<vscode.LanguageModelChat> {
		let model: vscode.LanguageModelChat | undefined;
		if (modelId) {
			model = await this._languageModels.getLanguageModelByIdentifier(extension, modelId);
		}
		if (!model) {
			model = await this._languageModels.getDefaultLanguageModel(extension);
			if (!model) {
				throw new Error('Language model unavailable');
			}
		}

		return model;
	}

	async $prepareToolInvocation(toolId: string, context: IToolInvocationPreparationContext, token: CancellationToken): Promise<IPreparedToolInvocation | undefined> {
		const item = this._registeredTools.get(toolId);
		if (!item) {
			throw new Error(`Unknown tool ${toolId}`);
		}

		const options: vscode.LanguageModelToolInvocationPrepareOptions<any> = {
			input: context.parameters,
			chatRequestId: context.chatRequestId,
			chatSessionId: context.chatSessionId,
			chatInteractionId: context.chatInteractionId
		};
		if (item.tool.prepareInvocation) {
			const result = await item.tool.prepareInvocation(options, token);
			if (!result) {
				return undefined;
			}

			if (result.pastTenseMessage || result.presentation) {
				checkProposedApiEnabled(item.extension, 'chatParticipantPrivate');
			}

			return {
				confirmationMessages: result.confirmationMessages ? {
					title: typeof result.confirmationMessages.title === 'string' ? result.confirmationMessages.title : typeConvert.MarkdownString.from(result.confirmationMessages.title),
					message: typeof result.confirmationMessages.message === 'string' ? result.confirmationMessages.message : typeConvert.MarkdownString.from(result.confirmationMessages.message),
				} : undefined,
				invocationMessage: typeConvert.MarkdownString.fromStrict(result.invocationMessage),
				pastTenseMessage: typeConvert.MarkdownString.fromStrict(result.pastTenseMessage),
				presentation: result.presentation as ToolInvocationPresentation | undefined
			};
		}

		return undefined;
	}

	registerTool(extension: IExtensionDescription, id: string, tool: vscode.LanguageModelTool<any>): IDisposable {
		this._registeredTools.set(id, { extension, tool });
		this._proxy.$registerTool(id);

		return toDisposable(() => {
			this._registeredTools.delete(id);
			this._proxy.$unregisterTool(id);
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostLanguages.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostLanguages.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MainContext, MainThreadLanguagesShape, IMainContext, ExtHostLanguagesShape } from './extHost.protocol.js';
import type * as vscode from 'vscode';
import { ExtHostDocuments } from './extHostDocuments.js';
import * as typeConvert from './extHostTypeConverters.js';
import { StandardTokenType, Range, Position, LanguageStatusSeverity } from './extHostTypes.js';
import Severity from '../../../base/common/severity.js';
import { disposableTimeout } from '../../../base/common/async.js';
import { DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { CommandsConverter } from './extHostCommands.js';
import { IURITransformer } from '../../../base/common/uriIpc.js';
import { checkProposedApiEnabled } from '../../services/extensions/common/extensions.js';

export class ExtHostLanguages implements ExtHostLanguagesShape {

	private readonly _proxy: MainThreadLanguagesShape;

	private _languageIds: string[] = [];

	constructor(
		mainContext: IMainContext,
		private readonly _documents: ExtHostDocuments,
		private readonly _commands: CommandsConverter,
		private readonly _uriTransformer: IURITransformer | undefined
	) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadLanguages);
	}

	$acceptLanguageIds(ids: string[]): void {
		this._languageIds = ids;
	}

	async getLanguages(): Promise<string[]> {
		return this._languageIds.slice(0);
	}

	async changeLanguage(uri: vscode.Uri, languageId: string): Promise<vscode.TextDocument> {
		await this._proxy.$changeLanguage(uri, languageId);
		const data = this._documents.getDocumentData(uri);
		if (!data) {
			throw new Error(`document '${uri.toString()}' NOT found`);
		}
		return data.document;
	}

	async tokenAtPosition(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.TokenInformation> {
		const versionNow = document.version;
		const pos = typeConvert.Position.from(position);
		const info = await this._proxy.$tokensAtPosition(document.uri, pos);
		const defaultRange = {
			type: StandardTokenType.Other,
			range: document.getWordRangeAtPosition(position) ?? new Range(position.line, position.character, position.line, position.character)
		};
		if (!info) {
			// no result
			return defaultRange;
		}
		const result = {
			range: typeConvert.Range.to(info.range),
			type: typeConvert.TokenType.to(info.type)
		};
		if (!result.range.contains(<Position>position)) {
			// bogous result
			return defaultRange;
		}
		if (versionNow !== document.version) {
			// concurrent change
			return defaultRange;
		}
		return result;
	}

	private _handlePool: number = 0;
	private _ids = new Set<string>();

	createLanguageStatusItem(extension: IExtensionDescription, id: string, selector: vscode.DocumentSelector): vscode.LanguageStatusItem {

		const handle = this._handlePool++;
		const proxy = this._proxy;
		const ids = this._ids;

		// enforce extension unique identifier
		const fullyQualifiedId = `${extension.identifier.value}/${id}`;
		if (ids.has(fullyQualifiedId)) {
			throw new Error(`LanguageStatusItem with id '${id}' ALREADY exists`);
		}
		ids.add(fullyQualifiedId);

		const data: Omit<vscode.LanguageStatusItem, 'dispose' | 'text2'> = {
			selector,
			id,
			name: extension.displayName ?? extension.name,
			severity: LanguageStatusSeverity.Information,
			command: undefined,
			text: '',
			detail: '',
			busy: false
		};


		let soonHandle: IDisposable | undefined;
		const commandDisposables = new DisposableStore();
		const updateAsync = () => {
			soonHandle?.dispose();

			if (!ids.has(fullyQualifiedId)) {
				console.warn(`LanguageStatusItem (${id}) from ${extension.identifier.value} has been disposed and CANNOT be updated anymore`);
				return; // disposed in the meantime
			}

			soonHandle = disposableTimeout(() => {
				commandDisposables.clear();
				this._proxy.$setLanguageStatus(handle, {
					id: fullyQualifiedId,
					name: data.name ?? extension.displayName ?? extension.name,
					source: extension.displayName ?? extension.name,
					selector: typeConvert.DocumentSelector.from(data.selector, this._uriTransformer),
					label: data.text,
					detail: data.detail ?? '',
					severity: data.severity === LanguageStatusSeverity.Error ? Severity.Error : data.severity === LanguageStatusSeverity.Warning ? Severity.Warning : Severity.Info,
					command: data.command && this._commands.toInternal(data.command, commandDisposables),
					accessibilityInfo: data.accessibilityInformation,
					busy: data.busy
				});
			}, 0);
		};

		const result: vscode.LanguageStatusItem = {
			dispose() {
				commandDisposables.dispose();
				soonHandle?.dispose();
				proxy.$removeLanguageStatus(handle);
				ids.delete(fullyQualifiedId);
			},
			get id() {
				return data.id;
			},
			get name() {
				return data.name;
			},
			set name(value) {
				data.name = value;
				updateAsync();
			},
			get selector() {
				return data.selector;
			},
			set selector(value) {
				data.selector = value;
				updateAsync();
			},
			get text() {
				return data.text;
			},
			set text(value) {
				data.text = value;
				updateAsync();
			},
			set text2(value) {
				checkProposedApiEnabled(extension, 'languageStatusText');
				data.text = value;
				updateAsync();
			},
			get text2() {
				checkProposedApiEnabled(extension, 'languageStatusText');
				return data.text;
			},
			get detail() {
				return data.detail;
			},
			set detail(value) {
				data.detail = value;
				updateAsync();
			},
			get severity() {
				return data.severity;
			},
			set severity(value) {
				data.severity = value;
				updateAsync();
			},
			get accessibilityInformation() {
				return data.accessibilityInformation;
			},
			set accessibilityInformation(value) {
				data.accessibilityInformation = value;
				updateAsync();
			},
			get command() {
				return data.command;
			},
			set command(value) {
				data.command = value;
				updateAsync();
			},
			get busy() {
				return data.busy;
			},
			set busy(value: boolean) {
				data.busy = value;
				updateAsync();
			}
		};
		updateAsync();
		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostLocalizationService.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostLocalizationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LANGUAGE_DEFAULT } from '../../../base/common/platform.js';
import { format2 } from '../../../base/common/strings.js';
import { URI } from '../../../base/common/uri.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { ExtHostLocalizationShape, IStringDetails, MainContext, MainThreadLocalizationShape } from './extHost.protocol.js';
import { IExtHostInitDataService } from './extHostInitDataService.js';
import { IExtHostRpcService } from './extHostRpcService.js';

export class ExtHostLocalizationService implements ExtHostLocalizationShape {
	readonly _serviceBrand: undefined;

	private readonly _proxy: MainThreadLocalizationShape;
	private readonly currentLanguage: string;
	private readonly isDefaultLanguage: boolean;

	private readonly bundleCache: Map<string, { contents: { [key: string]: string }; uri: URI }> = new Map();

	constructor(
		@IExtHostInitDataService initData: IExtHostInitDataService,
		@IExtHostRpcService rpc: IExtHostRpcService,
		@ILogService private readonly logService: ILogService
	) {
		this._proxy = rpc.getProxy(MainContext.MainThreadLocalization);
		this.currentLanguage = initData.environment.appLanguage;
		this.isDefaultLanguage = this.currentLanguage === LANGUAGE_DEFAULT;
	}

	getMessage(extensionId: string, details: IStringDetails): string {
		const { message, args, comment } = details;
		if (this.isDefaultLanguage) {
			return format2(message, (args ?? {}));
		}

		let key = message;
		if (comment && comment.length > 0) {
			key += `/${Array.isArray(comment) ? comment.join('') : comment}`;
		}
		const str = this.bundleCache.get(extensionId)?.contents[key];
		if (!str) {
			this.logService.warn(`Using default string since no string found in i18n bundle that has the key: ${key}`);
		}
		return format2(str ?? message, (args ?? {}));
	}

	getBundle(extensionId: string): { [key: string]: string } | undefined {
		return this.bundleCache.get(extensionId)?.contents;
	}

	getBundleUri(extensionId: string): URI | undefined {
		return this.bundleCache.get(extensionId)?.uri;
	}

	async initializeLocalizedMessages(extension: IExtensionDescription): Promise<void> {
		if (this.isDefaultLanguage
			|| (!extension.l10n && !extension.isBuiltin)
		) {
			return;
		}

		if (this.bundleCache.has(extension.identifier.value)) {
			return;
		}

		let contents: { [key: string]: string } | undefined;
		const bundleUri = await this.getBundleLocation(extension);
		if (!bundleUri) {
			this.logService.error(`No bundle location found for extension ${extension.identifier.value}`);
			return;
		}

		try {
			const response = await this._proxy.$fetchBundleContents(bundleUri);
			const result = JSON.parse(response);
			// 'contents.bundle' is a well-known key in the language pack json file that contains the _code_ translations for the extension
			contents = extension.isBuiltin ? result.contents?.bundle : result;
		} catch (e) {
			this.logService.error(`Failed to load translations for ${extension.identifier.value} from ${bundleUri}: ${e.message}`);
			return;
		}

		if (contents) {
			this.bundleCache.set(extension.identifier.value, {
				contents,
				uri: bundleUri
			});
		}
	}

	private async getBundleLocation(extension: IExtensionDescription): Promise<URI | undefined> {
		if (extension.isBuiltin) {
			const uri = await this._proxy.$fetchBuiltInBundleUri(extension.identifier.value, this.currentLanguage);
			return URI.revive(uri);
		}

		return extension.l10n
			? URI.joinPath(extension.extensionLocation, extension.l10n, `bundle.l10n.${this.currentLanguage}.json`)
			: undefined;
	}
}

export const IExtHostLocalizationService = createDecorator<IExtHostLocalizationService>('IExtHostLocalizationService');
export interface IExtHostLocalizationService extends ExtHostLocalizationService { }
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostLoggerService.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostLoggerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILogger, ILoggerOptions, AbstractMessageLogger, LogLevel, AbstractLoggerService } from '../../../platform/log/common/log.js';
import { MainThreadLoggerShape, MainContext, ExtHostLogLevelServiceShape as ExtHostLogLevelServiceShape } from './extHost.protocol.js';
import { IExtHostInitDataService } from './extHostInitDataService.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { revive } from '../../../base/common/marshalling.js';

export class ExtHostLoggerService extends AbstractLoggerService implements ExtHostLogLevelServiceShape {

	declare readonly _serviceBrand: undefined;
	protected readonly _proxy: MainThreadLoggerShape;

	constructor(
		@IExtHostRpcService rpc: IExtHostRpcService,
		@IExtHostInitDataService initData: IExtHostInitDataService,
	) {
		super(initData.logLevel, initData.logsLocation, initData.loggers.map(logger => revive(logger)));
		this._proxy = rpc.getProxy(MainContext.MainThreadLogger);
	}

	$setLogLevel(logLevel: LogLevel, resource?: UriComponents): void {
		if (resource) {
			this.setLogLevel(URI.revive(resource), logLevel);
		} else {
			this.setLogLevel(logLevel);
		}
	}

	override setVisibility(resource: URI, visibility: boolean): void {
		super.setVisibility(resource, visibility);
		this._proxy.$setVisibility(resource, visibility);
	}

	protected doCreateLogger(resource: URI, logLevel: LogLevel, options?: ILoggerOptions): ILogger {
		return new Logger(this._proxy, resource, logLevel, options);
	}
}

class Logger extends AbstractMessageLogger {

	private isLoggerCreated: boolean = false;
	private buffer: [LogLevel, string][] = [];

	constructor(
		private readonly proxy: MainThreadLoggerShape,
		private readonly file: URI,
		logLevel: LogLevel,
		loggerOptions?: ILoggerOptions,
	) {
		super(loggerOptions?.logLevel === 'always');
		this.setLevel(logLevel);
		this.proxy.$createLogger(file, loggerOptions)
			.then(() => {
				this.doLog(this.buffer);
				this.isLoggerCreated = true;
			});
	}

	protected log(level: LogLevel, message: string) {
		const messages: [LogLevel, string][] = [[level, message]];
		if (this.isLoggerCreated) {
			this.doLog(messages);
		} else {
			this.buffer.push(...messages);
		}
	}

	private doLog(messages: [LogLevel, string][]) {
		this.proxy.$log(this.file, messages);
	}

	override flush(): void {
		this.proxy.$flush(this.file);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostLogService.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostLogService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../nls.js';
import { ILoggerService } from '../../../platform/log/common/log.js';
import { LogService } from '../../../platform/log/common/logService.js';
import { IExtHostInitDataService } from './extHostInitDataService.js';

export class ExtHostLogService extends LogService {

	declare readonly _serviceBrand: undefined;

	constructor(
		isWorker: boolean,
		@ILoggerService loggerService: ILoggerService,
		@IExtHostInitDataService initData: IExtHostInitDataService,
	) {
		const id = initData.remote.isRemote ? 'remoteexthost' : isWorker ? 'workerexthost' : 'exthost';
		const name = initData.remote.isRemote ? localize('remote', "Extension Host (Remote)") : isWorker ? localize('worker', "Extension Host (Worker)") : localize('local', "Extension Host");
		super(loggerService.createLogger(id, { name }));
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostManagedSockets.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostManagedSockets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtHostManagedSocketsShape, MainContext, MainThreadManagedSocketsShape } from './extHost.protocol.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import * as vscode from 'vscode';
import { Disposable, DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { VSBuffer } from '../../../base/common/buffer.js';

export interface IExtHostManagedSockets extends ExtHostManagedSocketsShape {
	setFactory(socketFactoryId: number, makeConnection: () => Thenable<vscode.ManagedMessagePassing>): void;
	readonly _serviceBrand: undefined;
}

export const IExtHostManagedSockets = createDecorator<IExtHostManagedSockets>('IExtHostManagedSockets');

export class ExtHostManagedSockets implements IExtHostManagedSockets {
	declare readonly _serviceBrand: undefined;

	private readonly _proxy: MainThreadManagedSocketsShape;
	private _remoteSocketIdCounter = 0;
	private _factory: ManagedSocketFactory | null = null;
	private readonly _managedRemoteSockets: Map<number, ManagedSocket> = new Map();

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
	) {
		this._proxy = extHostRpc.getProxy(MainContext.MainThreadManagedSockets);
	}

	setFactory(socketFactoryId: number, makeConnection: () => Thenable<vscode.ManagedMessagePassing>): void {
		// Terminate all previous sockets
		for (const socket of this._managedRemoteSockets.values()) {
			// calling dispose() will lead to it removing itself from the map
			socket.dispose();
		}
		// Unregister previous factory
		if (this._factory) {
			this._proxy.$unregisterSocketFactory(this._factory.socketFactoryId);
		}

		this._factory = new ManagedSocketFactory(socketFactoryId, makeConnection);
		this._proxy.$registerSocketFactory(this._factory.socketFactoryId);
	}

	async $openRemoteSocket(socketFactoryId: number): Promise<number> {
		if (!this._factory || this._factory.socketFactoryId !== socketFactoryId) {
			throw new Error(`No socket factory with id ${socketFactoryId}`);
		}

		const id = (++this._remoteSocketIdCounter);
		const socket = await this._factory.makeConnection();
		const disposable = new DisposableStore();
		this._managedRemoteSockets.set(id, new ManagedSocket(id, socket, disposable));

		disposable.add(toDisposable(() => this._managedRemoteSockets.delete(id)));
		disposable.add(socket.onDidEnd(() => {
			this._proxy.$onDidManagedSocketEnd(id);
			disposable.dispose();
		}));
		disposable.add(socket.onDidClose(e => {
			this._proxy.$onDidManagedSocketClose(id, e?.stack ?? e?.message);
			disposable.dispose();
		}));
		disposable.add(socket.onDidReceiveMessage(e => this._proxy.$onDidManagedSocketHaveData(id, VSBuffer.wrap(e))));

		return id;
	}

	$remoteSocketWrite(socketId: number, buffer: VSBuffer): void {
		this._managedRemoteSockets.get(socketId)?.actual.send(buffer.buffer);
	}

	$remoteSocketEnd(socketId: number): void {
		const socket = this._managedRemoteSockets.get(socketId);
		if (socket) {
			socket.actual.end();
			socket.dispose();
		}
	}

	async $remoteSocketDrain(socketId: number): Promise<void> {
		await this._managedRemoteSockets.get(socketId)?.actual.drain?.();
	}
}

class ManagedSocketFactory {
	constructor(
		public readonly socketFactoryId: number,
		public readonly makeConnection: () => Thenable<vscode.ManagedMessagePassing>,
	) { }
}

class ManagedSocket extends Disposable {
	constructor(
		public readonly socketId: number,
		public readonly actual: vscode.ManagedMessagePassing,
		disposer: DisposableStore,
	) {
		super();
		this._register(disposer);
	}
}
```

--------------------------------------------------------------------------------

````
