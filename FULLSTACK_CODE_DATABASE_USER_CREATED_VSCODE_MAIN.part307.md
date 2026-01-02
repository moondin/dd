---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 307
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 307 of 552)

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

---[FILE: src/vs/workbench/api/common/extHostApiCommands.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostApiCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isFalsyOrEmpty } from '../../../base/common/arrays.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { Schemas, matchesSomeScheme } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';
import { IPosition } from '../../../editor/common/core/position.js';
import { IRange } from '../../../editor/common/core/range.js';
import { ISelection } from '../../../editor/common/core/selection.js';
import * as languages from '../../../editor/common/languages.js';
import { decodeSemanticTokensDto } from '../../../editor/common/services/semanticTokensDto.js';
import { validateWhenClauses } from '../../../platform/contextkey/common/contextkey.js';
import { ITextEditorOptions } from '../../../platform/editor/common/editor.js';
import { ICallHierarchyItemDto, IIncomingCallDto, IInlineValueContextDto, IOutgoingCallDto, IRawColorInfo, ITypeHierarchyItemDto, IWorkspaceEditDto } from './extHost.protocol.js';
import { ApiCommand, ApiCommandArgument, ApiCommandResult, ExtHostCommands } from './extHostCommands.js';
import { CustomCodeAction } from './extHostLanguageFeatures.js';
import * as typeConverters from './extHostTypeConverters.js';
import * as types from './extHostTypes.js';
import { TransientCellMetadata, TransientDocumentMetadata } from '../../contrib/notebook/common/notebookCommon.js';
import * as search from '../../contrib/search/common/search.js';
import type * as vscode from 'vscode';

//#region --- NEW world

const newCommands: ApiCommand[] = [
	// -- document highlights
	new ApiCommand(
		'vscode.executeDocumentHighlights', '_executeDocumentHighlights', 'Execute document highlight provider.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position],
		new ApiCommandResult<languages.DocumentHighlight[], types.DocumentHighlight[] | undefined>('A promise that resolves to an array of DocumentHighlight-instances.', tryMapWith(typeConverters.DocumentHighlight.to))
	),
	// -- document symbols
	new ApiCommand(
		'vscode.executeDocumentSymbolProvider', '_executeDocumentSymbolProvider', 'Execute document symbol provider.',
		[ApiCommandArgument.Uri],
		new ApiCommandResult<languages.DocumentSymbol[], vscode.SymbolInformation[] | undefined>('A promise that resolves to an array of SymbolInformation and DocumentSymbol instances.', (value, apiArgs) => {

			if (isFalsyOrEmpty(value)) {
				return undefined;
			}
			class MergedInfo extends types.SymbolInformation implements vscode.DocumentSymbol {
				static to(symbol: languages.DocumentSymbol): MergedInfo {
					const res = new MergedInfo(
						symbol.name,
						typeConverters.SymbolKind.to(symbol.kind),
						symbol.containerName || '',
						new types.Location(apiArgs[0], typeConverters.Range.to(symbol.range))
					);
					res.detail = symbol.detail;
					res.range = res.location.range;
					res.selectionRange = typeConverters.Range.to(symbol.selectionRange);
					res.children = symbol.children ? symbol.children.map(MergedInfo.to) : [];
					return res;
				}

				detail!: string;
				range!: vscode.Range;
				selectionRange!: vscode.Range;
				children!: vscode.DocumentSymbol[];
				override containerName: string = '';
			}
			return value.map(MergedInfo.to);

		})
	),
	// -- formatting
	new ApiCommand(
		'vscode.executeFormatDocumentProvider', '_executeFormatDocumentProvider', 'Execute document format provider.',
		[ApiCommandArgument.Uri, new ApiCommandArgument('options', 'Formatting options', _ => true, v => v)],
		new ApiCommandResult<languages.TextEdit[], types.TextEdit[] | undefined>('A promise that resolves to an array of TextEdits.', tryMapWith(typeConverters.TextEdit.to))
	),
	new ApiCommand(
		'vscode.executeFormatRangeProvider', '_executeFormatRangeProvider', 'Execute range format provider.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Range, new ApiCommandArgument('options', 'Formatting options', _ => true, v => v)],
		new ApiCommandResult<languages.TextEdit[], types.TextEdit[] | undefined>('A promise that resolves to an array of TextEdits.', tryMapWith(typeConverters.TextEdit.to))
	),
	new ApiCommand(
		'vscode.executeFormatOnTypeProvider', '_executeFormatOnTypeProvider', 'Execute format on type provider.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position, new ApiCommandArgument('ch', 'Trigger character', v => typeof v === 'string', v => v), new ApiCommandArgument('options', 'Formatting options', _ => true, v => v)],
		new ApiCommandResult<languages.TextEdit[], types.TextEdit[] | undefined>('A promise that resolves to an array of TextEdits.', tryMapWith(typeConverters.TextEdit.to))
	),
	// -- go to symbol (definition, type definition, declaration, impl, references)
	new ApiCommand(
		'vscode.executeDefinitionProvider', '_executeDefinitionProvider', 'Execute all definition providers.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position],
		new ApiCommandResult<(languages.Location | languages.LocationLink)[], (types.Location | vscode.LocationLink)[] | undefined>('A promise that resolves to an array of Location or LocationLink instances.', mapLocationOrLocationLink)
	),
	new ApiCommand(
		'vscode.experimental.executeDefinitionProvider_recursive', '_executeDefinitionProvider_recursive', 'Execute all definition providers.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position],
		new ApiCommandResult<(languages.Location | languages.LocationLink)[], (types.Location | vscode.LocationLink)[] | undefined>('A promise that resolves to an array of Location or LocationLink instances.', mapLocationOrLocationLink)
	),
	new ApiCommand(
		'vscode.executeTypeDefinitionProvider', '_executeTypeDefinitionProvider', 'Execute all type definition providers.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position],
		new ApiCommandResult<(languages.Location | languages.LocationLink)[], (types.Location | vscode.LocationLink)[] | undefined>('A promise that resolves to an array of Location or LocationLink instances.', mapLocationOrLocationLink)
	),
	new ApiCommand(
		'vscode.experimental.executeTypeDefinitionProvider_recursive', '_executeTypeDefinitionProvider_recursive', 'Execute all type definition providers.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position],
		new ApiCommandResult<(languages.Location | languages.LocationLink)[], (types.Location | vscode.LocationLink)[] | undefined>('A promise that resolves to an array of Location or LocationLink instances.', mapLocationOrLocationLink)
	),
	new ApiCommand(
		'vscode.executeDeclarationProvider', '_executeDeclarationProvider', 'Execute all declaration providers.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position],
		new ApiCommandResult<(languages.Location | languages.LocationLink)[], (types.Location | vscode.LocationLink)[] | undefined>('A promise that resolves to an array of Location or LocationLink instances.', mapLocationOrLocationLink)
	),
	new ApiCommand(
		'vscode.experimental.executeDeclarationProvider_recursive', '_executeDeclarationProvider_recursive', 'Execute all declaration providers.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position],
		new ApiCommandResult<(languages.Location | languages.LocationLink)[], (types.Location | vscode.LocationLink)[] | undefined>('A promise that resolves to an array of Location or LocationLink instances.', mapLocationOrLocationLink)
	),
	new ApiCommand(
		'vscode.executeImplementationProvider', '_executeImplementationProvider', 'Execute all implementation providers.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position],
		new ApiCommandResult<(languages.Location | languages.LocationLink)[], (types.Location | vscode.LocationLink)[] | undefined>('A promise that resolves to an array of Location or LocationLink instances.', mapLocationOrLocationLink)
	),
	new ApiCommand(
		'vscode.experimental.executeImplementationProvider_recursive', '_executeImplementationProvider_recursive', 'Execute all implementation providers.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position],
		new ApiCommandResult<(languages.Location | languages.LocationLink)[], (types.Location | vscode.LocationLink)[] | undefined>('A promise that resolves to an array of Location or LocationLink instances.', mapLocationOrLocationLink)
	),
	new ApiCommand(
		'vscode.executeReferenceProvider', '_executeReferenceProvider', 'Execute all reference providers.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position],
		new ApiCommandResult<languages.Location[], types.Location[] | undefined>('A promise that resolves to an array of Location-instances.', tryMapWith(typeConverters.location.to))
	),
	new ApiCommand(
		'vscode.experimental.executeReferenceProvider', '_executeReferenceProvider_recursive', 'Execute all reference providers.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position],
		new ApiCommandResult<languages.Location[], types.Location[] | undefined>('A promise that resolves to an array of Location-instances.', tryMapWith(typeConverters.location.to))
	),
	// -- hover
	new ApiCommand(
		'vscode.executeHoverProvider', '_executeHoverProvider', 'Execute all hover providers.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position],
		new ApiCommandResult<languages.Hover[], types.Hover[] | undefined>('A promise that resolves to an array of Hover-instances.', tryMapWith(typeConverters.Hover.to))
	),
	new ApiCommand(
		'vscode.experimental.executeHoverProvider_recursive', '_executeHoverProvider_recursive', 'Execute all hover providers.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position],
		new ApiCommandResult<languages.Hover[], types.Hover[] | undefined>('A promise that resolves to an array of Hover-instances.', tryMapWith(typeConverters.Hover.to))
	),
	// -- selection range
	new ApiCommand(
		'vscode.executeSelectionRangeProvider', '_executeSelectionRangeProvider', 'Execute selection range provider.',
		[ApiCommandArgument.Uri, new ApiCommandArgument<types.Position[], IPosition[]>('position', 'A position in a text document', v => Array.isArray(v) && v.every(v => types.Position.isPosition(v)), v => v.map(typeConverters.Position.from))],
		new ApiCommandResult<IRange[][], types.SelectionRange[]>('A promise that resolves to an array of ranges.', result => {
			return result.map(ranges => {
				let node: types.SelectionRange | undefined;
				for (const range of ranges.reverse()) {
					node = new types.SelectionRange(typeConverters.Range.to(range), node);
				}
				return node!;
			});
		})
	),
	// -- symbol search
	new ApiCommand(
		'vscode.executeWorkspaceSymbolProvider', '_executeWorkspaceSymbolProvider', 'Execute all workspace symbol providers.',
		[ApiCommandArgument.String.with('query', 'Search string')],
		new ApiCommandResult<search.IWorkspaceSymbol[], types.SymbolInformation[]>('A promise that resolves to an array of SymbolInformation-instances.', value => {
			return value.map(typeConverters.WorkspaceSymbol.to);
		})
	),
	// --- call hierarchy
	new ApiCommand(
		'vscode.prepareCallHierarchy', '_executePrepareCallHierarchy', 'Prepare call hierarchy at a position inside a document',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position],
		new ApiCommandResult<ICallHierarchyItemDto[], types.CallHierarchyItem[]>('A promise that resolves to an array of CallHierarchyItem-instances', v => v.map(typeConverters.CallHierarchyItem.to))
	),
	new ApiCommand(
		'vscode.provideIncomingCalls', '_executeProvideIncomingCalls', 'Compute incoming calls for an item',
		[ApiCommandArgument.CallHierarchyItem],
		new ApiCommandResult<IIncomingCallDto[], types.CallHierarchyIncomingCall[]>('A promise that resolves to an array of CallHierarchyIncomingCall-instances', v => v.map(typeConverters.CallHierarchyIncomingCall.to))
	),
	new ApiCommand(
		'vscode.provideOutgoingCalls', '_executeProvideOutgoingCalls', 'Compute outgoing calls for an item',
		[ApiCommandArgument.CallHierarchyItem],
		new ApiCommandResult<IOutgoingCallDto[], types.CallHierarchyOutgoingCall[]>('A promise that resolves to an array of CallHierarchyOutgoingCall-instances', v => v.map(typeConverters.CallHierarchyOutgoingCall.to))
	),
	// --- rename
	new ApiCommand(
		'vscode.prepareRename', '_executePrepareRename', 'Execute the prepareRename of rename provider.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position],
		new ApiCommandResult<languages.RenameLocation, { range: types.Range; placeholder: string } | undefined>('A promise that resolves to a range and placeholder text.', value => {
			if (!value) {
				return undefined;
			}
			return {
				range: typeConverters.Range.to(value.range),
				placeholder: value.text
			};
		})
	),
	new ApiCommand(
		'vscode.executeDocumentRenameProvider', '_executeDocumentRenameProvider', 'Execute rename provider.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position, ApiCommandArgument.String.with('newName', 'The new symbol name')],
		new ApiCommandResult<IWorkspaceEditDto & { rejectReason?: string }, types.WorkspaceEdit | undefined>('A promise that resolves to a WorkspaceEdit.', value => {
			if (!value) {
				return undefined;
			}
			if (value.rejectReason) {
				throw new Error(value.rejectReason);
			}
			return typeConverters.WorkspaceEdit.to(value);
		})
	),
	// --- links
	new ApiCommand(
		'vscode.executeLinkProvider', '_executeLinkProvider', 'Execute document link provider.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Number.with('linkResolveCount', 'Number of links that should be resolved, only when links are unresolved.').optional()],
		new ApiCommandResult<languages.ILink[], vscode.DocumentLink[]>('A promise that resolves to an array of DocumentLink-instances.', value => value.map(typeConverters.DocumentLink.to))
	),
	// --- semantic tokens
	new ApiCommand(
		'vscode.provideDocumentSemanticTokensLegend', '_provideDocumentSemanticTokensLegend', 'Provide semantic tokens legend for a document',
		[ApiCommandArgument.Uri],
		new ApiCommandResult<languages.SemanticTokensLegend, types.SemanticTokensLegend | undefined>('A promise that resolves to SemanticTokensLegend.', value => {
			if (!value) {
				return undefined;
			}
			return new types.SemanticTokensLegend(value.tokenTypes, value.tokenModifiers);
		})
	),
	new ApiCommand(
		'vscode.provideDocumentSemanticTokens', '_provideDocumentSemanticTokens', 'Provide semantic tokens for a document',
		[ApiCommandArgument.Uri],
		new ApiCommandResult<VSBuffer, types.SemanticTokens | undefined>('A promise that resolves to SemanticTokens.', value => {
			if (!value) {
				return undefined;
			}
			const semanticTokensDto = decodeSemanticTokensDto(value);
			if (semanticTokensDto.type !== 'full') {
				// only accepting full semantic tokens from provideDocumentSemanticTokens
				return undefined;
			}
			return new types.SemanticTokens(semanticTokensDto.data, undefined);
		})
	),
	new ApiCommand(
		'vscode.provideDocumentRangeSemanticTokensLegend', '_provideDocumentRangeSemanticTokensLegend', 'Provide semantic tokens legend for a document range',
		[ApiCommandArgument.Uri, ApiCommandArgument.Range.optional()],
		new ApiCommandResult<languages.SemanticTokensLegend, types.SemanticTokensLegend | undefined>('A promise that resolves to SemanticTokensLegend.', value => {
			if (!value) {
				return undefined;
			}
			return new types.SemanticTokensLegend(value.tokenTypes, value.tokenModifiers);
		})
	),
	new ApiCommand(
		'vscode.provideDocumentRangeSemanticTokens', '_provideDocumentRangeSemanticTokens', 'Provide semantic tokens for a document range',
		[ApiCommandArgument.Uri, ApiCommandArgument.Range],
		new ApiCommandResult<VSBuffer, types.SemanticTokens | undefined>('A promise that resolves to SemanticTokens.', value => {
			if (!value) {
				return undefined;
			}
			const semanticTokensDto = decodeSemanticTokensDto(value);
			if (semanticTokensDto.type !== 'full') {
				// only accepting full semantic tokens from provideDocumentRangeSemanticTokens
				return undefined;
			}
			return new types.SemanticTokens(semanticTokensDto.data, undefined);
		})
	),
	// --- completions
	new ApiCommand(
		'vscode.executeCompletionItemProvider', '_executeCompletionItemProvider', 'Execute completion item provider.',
		[
			ApiCommandArgument.Uri,
			ApiCommandArgument.Position,
			ApiCommandArgument.String.with('triggerCharacter', 'Trigger completion when the user types the character, like `,` or `(`').optional(),
			ApiCommandArgument.Number.with('itemResolveCount', 'Number of completions to resolve (too large numbers slow down completions)').optional()
		],
		new ApiCommandResult<languages.CompletionList, vscode.CompletionList>('A promise that resolves to a CompletionList-instance.', (value, _args, converter) => {
			if (!value) {
				return new types.CompletionList([]);
			}
			const items = value.suggestions.map(suggestion => typeConverters.CompletionItem.to(suggestion, converter));
			return new types.CompletionList(items, value.incomplete);
		})
	),
	// --- signature help
	new ApiCommand(
		'vscode.executeSignatureHelpProvider', '_executeSignatureHelpProvider', 'Execute signature help provider.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position, ApiCommandArgument.String.with('triggerCharacter', 'Trigger signature help when the user types the character, like `,` or `(`').optional()],
		new ApiCommandResult<languages.SignatureHelp, vscode.SignatureHelp | undefined>('A promise that resolves to SignatureHelp.', value => {
			if (value) {
				return typeConverters.SignatureHelp.to(value);
			}
			return undefined;
		})
	),
	// --- code lens
	new ApiCommand(
		'vscode.executeCodeLensProvider', '_executeCodeLensProvider', 'Execute code lens provider.',
		[ApiCommandArgument.Uri, ApiCommandArgument.Number.with('itemResolveCount', 'Number of lenses that should be resolved and returned. Will only return resolved lenses, will impact performance)').optional()],
		new ApiCommandResult<languages.CodeLens[], vscode.CodeLens[] | undefined>('A promise that resolves to an array of CodeLens-instances.', (value, _args, converter) => {
			return tryMapWith<languages.CodeLens, vscode.CodeLens>(item => {
				return new types.CodeLens(typeConverters.Range.to(item.range), item.command && converter.fromInternal(item.command));
			})(value);
		})
	),
	// --- code actions
	new ApiCommand(
		'vscode.executeCodeActionProvider', '_executeCodeActionProvider', 'Execute code action provider.',
		[
			ApiCommandArgument.Uri,
			new ApiCommandArgument('rangeOrSelection', 'Range in a text document. Some refactoring provider requires Selection object.', v => types.Range.isRange(v), v => types.Selection.isSelection(v) ? typeConverters.Selection.from(v) : typeConverters.Range.from(v)),
			ApiCommandArgument.String.with('kind', 'Code action kind to return code actions for').optional(),
			ApiCommandArgument.Number.with('itemResolveCount', 'Number of code actions to resolve (too large numbers slow down code actions)').optional()
		],
		new ApiCommandResult<CustomCodeAction[], (vscode.CodeAction | vscode.Command | undefined)[] | undefined>('A promise that resolves to an array of Command-instances.', (value, _args, converter) => {
			return tryMapWith<CustomCodeAction, vscode.CodeAction | vscode.Command | undefined>((codeAction) => {
				if (codeAction._isSynthetic) {
					if (!codeAction.command) {
						throw new Error('Synthetic code actions must have a command');
					}
					return converter.fromInternal(codeAction.command);
				} else {
					const ret = new types.CodeAction(
						codeAction.title,
						codeAction.kind ? new types.CodeActionKind(codeAction.kind) : undefined
					);
					if (codeAction.edit) {
						ret.edit = typeConverters.WorkspaceEdit.to(codeAction.edit);
					}
					if (codeAction.command) {
						ret.command = converter.fromInternal(codeAction.command);
					}
					ret.isPreferred = codeAction.isPreferred;
					return ret;
				}
			})(value);
		})
	),
	// --- colors
	new ApiCommand(
		'vscode.executeDocumentColorProvider', '_executeDocumentColorProvider', 'Execute document color provider.',
		[ApiCommandArgument.Uri],
		new ApiCommandResult<IRawColorInfo[], vscode.ColorInformation[]>('A promise that resolves to an array of ColorInformation objects.', result => {
			if (result) {
				return result.map(ci => new types.ColorInformation(typeConverters.Range.to(ci.range), typeConverters.Color.to(ci.color)));
			}
			return [];
		})
	),
	new ApiCommand(
		'vscode.executeColorPresentationProvider', '_executeColorPresentationProvider', 'Execute color presentation provider.',
		[
			new ApiCommandArgument<types.Color, [number, number, number, number]>('color', 'The color to show and insert', v => v instanceof types.Color, typeConverters.Color.from),
			new ApiCommandArgument<{ uri: URI; range: types.Range }, { uri: URI; range: IRange }>('context', 'Context object with uri and range', _v => true, v => ({ uri: v.uri, range: typeConverters.Range.from(v.range) })),
		],
		new ApiCommandResult<languages.IColorPresentation[], types.ColorPresentation[]>('A promise that resolves to an array of ColorPresentation objects.', result => {
			if (result) {
				return result.map(typeConverters.ColorPresentation.to);
			}
			return [];
		})
	),
	// --- inline hints
	new ApiCommand(
		'vscode.executeInlayHintProvider', '_executeInlayHintProvider', 'Execute inlay hints provider',
		[ApiCommandArgument.Uri, ApiCommandArgument.Range],
		new ApiCommandResult<languages.InlayHint[], vscode.InlayHint[]>('A promise that resolves to an array of Inlay objects', (result, args, converter) => {
			return result.map(typeConverters.InlayHint.to.bind(undefined, converter));
		})
	),
	// --- folding
	new ApiCommand(
		'vscode.executeFoldingRangeProvider', '_executeFoldingRangeProvider', 'Execute folding range provider',
		[ApiCommandArgument.Uri],
		new ApiCommandResult<languages.FoldingRange[] | undefined, vscode.FoldingRange[] | undefined>('A promise that resolves to an array of FoldingRange objects', (result, args) => {
			if (result) {
				return result.map(typeConverters.FoldingRange.to);
			}
			return undefined;
		})
	),

	// --- notebooks
	new ApiCommand(
		'vscode.resolveNotebookContentProviders', '_resolveNotebookContentProvider', 'Resolve Notebook Content Providers',
		[
			// new ApiCommandArgument<string, string>('viewType', '', v => typeof v === 'string', v => v),
			// new ApiCommandArgument<string, string>('displayName', '', v => typeof v === 'string', v => v),
			// new ApiCommandArgument<object, object>('options', '', v => typeof v === 'object', v => v),
		],
		new ApiCommandResult<{
			viewType: string;
			displayName: string;
			options: { transientOutputs: boolean; transientCellMetadata: TransientCellMetadata; transientDocumentMetadata: TransientDocumentMetadata };
			filenamePattern: (vscode.GlobPattern | { include: vscode.GlobPattern; exclude: vscode.GlobPattern })[];
		}[], {
			viewType: string;
			displayName: string;
			filenamePattern: (vscode.GlobPattern | { include: vscode.GlobPattern; exclude: vscode.GlobPattern })[];
			options: vscode.NotebookDocumentContentOptions;
		}[] | undefined>('A promise that resolves to an array of NotebookContentProvider static info objects.', tryMapWith(item => {
			return {
				viewType: item.viewType,
				displayName: item.displayName,
				options: {
					transientOutputs: item.options.transientOutputs,
					transientCellMetadata: item.options.transientCellMetadata,
					transientDocumentMetadata: item.options.transientDocumentMetadata
				},
				filenamePattern: item.filenamePattern.map(pattern => typeConverters.NotebookExclusiveDocumentPattern.to(pattern))
			};
		}))
	),
	// --- debug support
	new ApiCommand(
		'vscode.executeInlineValueProvider', '_executeInlineValueProvider', 'Execute inline value provider',
		[
			ApiCommandArgument.Uri,
			ApiCommandArgument.Range,
			new ApiCommandArgument<types.InlineValueContext, IInlineValueContextDto>('context', 'An InlineValueContext', v => v && typeof v.frameId === 'number' && v.stoppedLocation instanceof types.Range, v => typeConverters.InlineValueContext.from(v))
		],
		new ApiCommandResult<languages.InlineValue[], vscode.InlineValue[]>('A promise that resolves to an array of InlineValue objects', result => {
			return result.map(typeConverters.InlineValue.to);
		})
	),
	// --- open'ish commands
	new ApiCommand(
		'vscode.open', '_workbench.open', 'Opens the provided resource in the editor. Can be a text or binary file, or an http(s) URL. If you need more control over the options for opening a text file, use vscode.window.showTextDocument instead.',
		[
			new ApiCommandArgument<URI | string>('uriOrString', 'Uri-instance or string (only http/https)', v => URI.isUri(v) || (typeof v === 'string' && matchesSomeScheme(v, Schemas.http, Schemas.https)), v => v),
			new ApiCommandArgument<vscode.ViewColumn | typeConverters.TextEditorOpenOptions | undefined, [vscode.ViewColumn?, ITextEditorOptions?] | undefined>('columnOrOptions', 'Either the column in which to open or editor options, see vscode.TextDocumentShowOptions',
				v => v === undefined || typeof v === 'number' || typeof v === 'object',
				v => !v ? v : typeof v === 'number' ? [typeConverters.ViewColumn.from(v), undefined] : [typeConverters.ViewColumn.from(v.viewColumn), typeConverters.TextEditorOpenOptions.from(v)]
			).optional(),
			ApiCommandArgument.String.with('label', '').optional()
		],
		ApiCommandResult.Void
	),
	new ApiCommand(
		'vscode.openWith', '_workbench.openWith', 'Opens the provided resource with a specific editor.',
		[
			ApiCommandArgument.Uri.with('resource', 'Resource to open'),
			ApiCommandArgument.String.with('viewId', 'Custom editor view id. This should be the viewType string for custom editors or the notebookType string for notebooks. Use \'default\' to use VS Code\'s default text editor'),
			new ApiCommandArgument<vscode.ViewColumn | typeConverters.TextEditorOpenOptions | undefined, [vscode.ViewColumn?, ITextEditorOptions?] | undefined>('columnOrOptions', 'Either the column in which to open or editor options, see vscode.TextDocumentShowOptions',
				v => v === undefined || typeof v === 'number' || typeof v === 'object',
				v => !v ? v : typeof v === 'number' ? [typeConverters.ViewColumn.from(v), undefined] : [typeConverters.ViewColumn.from(v.viewColumn), typeConverters.TextEditorOpenOptions.from(v)],
			).optional()
		],
		ApiCommandResult.Void
	),
	new ApiCommand(
		'vscode.diff', '_workbench.diff', 'Opens the provided resources in the diff editor to compare their contents.',
		[
			ApiCommandArgument.Uri.with('left', 'Left-hand side resource of the diff editor'),
			ApiCommandArgument.Uri.with('right', 'Right-hand side resource of the diff editor'),
			ApiCommandArgument.String.with('title', 'Human readable title for the diff editor').optional(),
			new ApiCommandArgument<typeConverters.TextEditorOpenOptions | undefined, [number?, ITextEditorOptions?] | undefined>('columnOrOptions', 'Either the column in which to open or editor options, see vscode.TextDocumentShowOptions',
				v => v === undefined || typeof v === 'object',
				v => v && [typeConverters.ViewColumn.from(v.viewColumn), typeConverters.TextEditorOpenOptions.from(v)]
			).optional(),
		],
		ApiCommandResult.Void
	),
	new ApiCommand(
		'vscode.changes', '_workbench.changes', 'Opens a list of resources in the changes editor to compare their contents.',
		[
			ApiCommandArgument.String.with('title', 'Human readable title for the changes editor'),
			new ApiCommandArgument<[URI, URI?, URI?][]>('resourceList', 'List of resources to compare',
				resources => {
					for (const resource of resources) {
						if (resource.length !== 3) {
							return false;
						}

						const [label, left, right] = resource;
						if (!URI.isUri(label) ||
							(!URI.isUri(left) && left !== undefined && left !== null) ||
							(!URI.isUri(right) && right !== undefined && right !== null)) {
							return false;
						}
					}

					return true;
				},
				v => v)
		],
		ApiCommandResult.Void
	),
	// --- type hierarchy
	new ApiCommand(
		'vscode.prepareTypeHierarchy', '_executePrepareTypeHierarchy', 'Prepare type hierarchy at a position inside a document',
		[ApiCommandArgument.Uri, ApiCommandArgument.Position],
		new ApiCommandResult<ITypeHierarchyItemDto[], types.TypeHierarchyItem[]>('A promise that resolves to an array of TypeHierarchyItem-instances', v => v.map(typeConverters.TypeHierarchyItem.to))
	),
	new ApiCommand(
		'vscode.provideSupertypes', '_executeProvideSupertypes', 'Compute supertypes for an item',
		[ApiCommandArgument.TypeHierarchyItem],
		new ApiCommandResult<ITypeHierarchyItemDto[], types.TypeHierarchyItem[]>('A promise that resolves to an array of TypeHierarchyItem-instances', v => v.map(typeConverters.TypeHierarchyItem.to))
	),
	new ApiCommand(
		'vscode.provideSubtypes', '_executeProvideSubtypes', 'Compute subtypes for an item',
		[ApiCommandArgument.TypeHierarchyItem],
		new ApiCommandResult<ITypeHierarchyItemDto[], types.TypeHierarchyItem[]>('A promise that resolves to an array of TypeHierarchyItem-instances', v => v.map(typeConverters.TypeHierarchyItem.to))
	),
	// --- testing
	new ApiCommand(
		'vscode.revealTestInExplorer', '_revealTestInExplorer', 'Reveals a test instance in the explorer',
		[ApiCommandArgument.TestItem],
		ApiCommandResult.Void
	),
	new ApiCommand(
		'vscode.startContinuousTestRun', 'testing.startContinuousRunFromExtension', 'Starts running the given tests with continuous run mode.',
		[ApiCommandArgument.TestProfile, ApiCommandArgument.Arr(ApiCommandArgument.TestItem)],
		ApiCommandResult.Void
	),
	new ApiCommand(
		'vscode.stopContinuousTestRun', 'testing.stopContinuousRunFromExtension', 'Stops running the given tests with continuous run mode.',
		[ApiCommandArgument.Arr(ApiCommandArgument.TestItem)],
		ApiCommandResult.Void
	),
	// --- continue edit session
	new ApiCommand(
		'vscode.experimental.editSession.continue', '_workbench.editSessions.actions.continueEditSession', 'Continue the current edit session in a different workspace',
		[ApiCommandArgument.Uri.with('workspaceUri', 'The target workspace to continue the current edit session in')],
		ApiCommandResult.Void
	),
	// --- context keys
	new ApiCommand(
		'setContext', '_setContext', 'Set a custom context key value that can be used in when clauses.',
		[
			ApiCommandArgument.String.with('name', 'The context key name'),
			new ApiCommandArgument('value', 'The context key value', () => true, v => v),
		],
		ApiCommandResult.Void
	),
	// --- inline chat
	new ApiCommand(
		'vscode.editorChat.start', 'inlineChat.start', 'Invoke a new editor chat session',
		[new ApiCommandArgument<InlineChatEditorApiArg | undefined, InlineChatRunOptions | undefined>('Run arguments', '', _v => true, v => {

			if (!v) {
				return undefined;
			}

			return {
				initialRange: v.initialRange ? typeConverters.Range.from(v.initialRange) : undefined,
				initialSelection: types.Selection.isSelection(v.initialSelection) ? typeConverters.Selection.from(v.initialSelection) : undefined,
				message: v.message,
				attachments: v.attachments,
				autoSend: v.autoSend,
				position: v.position ? typeConverters.Position.from(v.position) : undefined,
				blockOnResponse: v.blockOnResponse
			};
		})],
		ApiCommandResult.Void
	)
];

type InlineChatEditorApiArg = {
	initialRange?: vscode.Range;
	initialSelection?: vscode.Selection;
	message?: string;
	attachments?: vscode.Uri[];
	autoSend?: boolean;
	position?: vscode.Position;
	blockOnResponse?: boolean;
};

type InlineChatRunOptions = {
	initialRange?: IRange;
	initialSelection?: ISelection;
	message?: string;
	attachments?: URI[];
	autoSend?: boolean;
	position?: IPosition;
	blockOnResponse?: boolean;
};

//#endregion


//#region OLD world

export class ExtHostApiCommands {

	static register(commands: ExtHostCommands) {

		newCommands.forEach(commands.registerApiCommand, commands);

		this._registerValidateWhenClausesCommand(commands);
	}

	private static _registerValidateWhenClausesCommand(commands: ExtHostCommands) {
		commands.registerCommand(false, '_validateWhenClauses', validateWhenClauses);
	}
}

function tryMapWith<T, R>(f: (x: T) => R) {
	return (value: T[]) => {
		if (Array.isArray(value)) {
			return value.map(f);
		}
		return undefined;
	};
}

function mapLocationOrLocationLink(values: (languages.Location | languages.LocationLink)[]): (types.Location | vscode.LocationLink)[] | undefined {
	if (!Array.isArray(values)) {
		return undefined;
	}
	const result: (types.Location | vscode.LocationLink)[] = [];
	for (const item of values) {
		if (languages.isLocationLink(item)) {
			result.push(typeConverters.DefinitionLink.to(item));
		} else {
			result.push(typeConverters.location.to(item));
		}
	}
	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostApiDeprecationService.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostApiDeprecationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../platform/log/common/log.js';
import * as extHostProtocol from './extHost.protocol.js';
import { IExtHostRpcService } from './extHostRpcService.js';

export interface IExtHostApiDeprecationService {
	readonly _serviceBrand: undefined;

	report(apiId: string, extension: IExtensionDescription, migrationSuggestion: string): void;
}

export const IExtHostApiDeprecationService = createDecorator<IExtHostApiDeprecationService>('IExtHostApiDeprecationService');

export class ExtHostApiDeprecationService implements IExtHostApiDeprecationService {

	declare readonly _serviceBrand: undefined;

	private readonly _reportedUsages = new Set<string>();
	private readonly _telemetryShape: extHostProtocol.MainThreadTelemetryShape;

	constructor(
		@IExtHostRpcService rpc: IExtHostRpcService,
		@ILogService private readonly _extHostLogService: ILogService,
	) {
		this._telemetryShape = rpc.getProxy(extHostProtocol.MainContext.MainThreadTelemetry);
	}

	public report(apiId: string, extension: IExtensionDescription, migrationSuggestion: string): void {
		const key = this.getUsageKey(apiId, extension);
		if (this._reportedUsages.has(key)) {
			return;
		}
		this._reportedUsages.add(key);

		if (extension.isUnderDevelopment) {
			this._extHostLogService.warn(`[Deprecation Warning] '${apiId}' is deprecated. ${migrationSuggestion}`);
		}

		type DeprecationTelemetry = {
			extensionId: string;
			apiId: string;
		};
		type DeprecationTelemetryMeta = {
			extensionId: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The id of the extension that is using the deprecated API' };
			apiId: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The id of the deprecated API' };
			owner: 'mjbvz';
			comment: 'Helps us gain insights on extensions using deprecated API so we can assist in migration to new API';
		};
		this._telemetryShape.$publicLog2<DeprecationTelemetry, DeprecationTelemetryMeta>('extHostDeprecatedApiUsage', {
			extensionId: extension.identifier.value,
			apiId: apiId,
		});
	}

	private getUsageKey(apiId: string, extension: IExtensionDescription): string {
		return `${apiId}-${extension.identifier.value}`;
	}
}


export const NullApiDeprecationService = Object.freeze(new class implements IExtHostApiDeprecationService {
	declare readonly _serviceBrand: undefined;

	public report(_apiId: string, _extension: IExtensionDescription, _warningMessage: string): void {
		// noop
	}
}());
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostAuthentication.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostAuthentication.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import * as nls from '../../../nls.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { MainContext, MainThreadAuthenticationShape, ExtHostAuthenticationShape } from './extHost.protocol.js';
import { Disposable, ProgressLocation } from './extHostTypes.js';
import { IExtensionDescription, ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { INTERNAL_AUTH_PROVIDER_PREFIX, isAuthenticationWwwAuthenticateRequest } from '../../services/authentication/common/authentication.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { AuthorizationErrorType, fetchDynamicRegistration, getClaimsFromJWT, IAuthorizationJWTClaims, IAuthorizationProtectedResourceMetadata, IAuthorizationServerMetadata, IAuthorizationTokenResponse, isAuthorizationErrorResponse, isAuthorizationTokenResponse } from '../../../base/common/oauth.js';
import { IExtHostWindow } from './extHostWindow.js';
import { IExtHostInitDataService } from './extHostInitDataService.js';
import { ILogger, ILoggerService, ILogService } from '../../../platform/log/common/log.js';
import { autorun, derivedOpts, IObservable, ISettableObservable, observableValue } from '../../../base/common/observable.js';
import { stringHash } from '../../../base/common/hash.js';
import { DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { IExtHostUrlsService } from './extHostUrls.js';
import { encodeBase64, VSBuffer } from '../../../base/common/buffer.js';
import { equals as arraysEqual } from '../../../base/common/arrays.js';
import { IExtHostProgress } from './extHostProgress.js';
import { IProgressStep } from '../../../platform/progress/common/progress.js';
import { CancellationError, isCancellationError } from '../../../base/common/errors.js';
import { raceCancellationError, SequencerByKey } from '../../../base/common/async.js';

export interface IExtHostAuthentication extends ExtHostAuthentication { }
export const IExtHostAuthentication = createDecorator<IExtHostAuthentication>('IExtHostAuthentication');

interface ProviderWithMetadata {
	label: string;
	provider: vscode.AuthenticationProvider;
	disposable?: vscode.Disposable;
	options: vscode.AuthenticationProviderOptions;
}

export class ExtHostAuthentication implements ExtHostAuthenticationShape {

	declare _serviceBrand: undefined;

	protected readonly _dynamicAuthProviderCtor = DynamicAuthProvider;

	private _proxy: MainThreadAuthenticationShape;
	private _authenticationProviders: Map<string, ProviderWithMetadata> = new Map<string, ProviderWithMetadata>();
	private _providerOperations = new SequencerByKey<string>();

	private _onDidChangeSessions = new Emitter<vscode.AuthenticationSessionsChangeEvent & { extensionIdFilter?: string[] }>();
	private _getSessionTaskSingler = new TaskSingler<vscode.AuthenticationSession | undefined>();

	private _onDidDynamicAuthProviderTokensChange = new Emitter<{ authProviderId: string; clientId: string; tokens: IAuthorizationToken[] }>();

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@IExtHostInitDataService private readonly _initData: IExtHostInitDataService,
		@IExtHostWindow private readonly _extHostWindow: IExtHostWindow,
		@IExtHostUrlsService private readonly _extHostUrls: IExtHostUrlsService,
		@IExtHostProgress private readonly _extHostProgress: IExtHostProgress,
		@ILoggerService private readonly _extHostLoggerService: ILoggerService,
		@ILogService private readonly _logService: ILogService,
	) {
		this._proxy = extHostRpc.getProxy(MainContext.MainThreadAuthentication);
	}

	/**
	 * This sets up an event that will fire when the auth sessions change with a built-in filter for the extensionId
	 * if a session change only affects a specific extension.
	 * @param extensionId The extension that is interested in the event.
	 * @returns An event with a built-in filter for the extensionId
	 */
	getExtensionScopedSessionsEvent(extensionId: string): Event<vscode.AuthenticationSessionsChangeEvent> {
		const normalizedExtensionId = extensionId.toLowerCase();
		return Event.chain(this._onDidChangeSessions.event, ($) => $
			.filter(e => !e.extensionIdFilter || e.extensionIdFilter.includes(normalizedExtensionId))
			.map(e => ({ provider: e.provider }))
		);
	}

	async getSession(requestingExtension: IExtensionDescription, providerId: string, scopesOrRequest: readonly string[] | vscode.AuthenticationWwwAuthenticateRequest, options: vscode.AuthenticationGetSessionOptions & ({ createIfNone: true } | { forceNewSession: true } | { forceNewSession: vscode.AuthenticationForceNewSessionOptions })): Promise<vscode.AuthenticationSession>;
	async getSession(requestingExtension: IExtensionDescription, providerId: string, scopesOrRequest: readonly string[] | vscode.AuthenticationWwwAuthenticateRequest, options: vscode.AuthenticationGetSessionOptions & { forceNewSession: true }): Promise<vscode.AuthenticationSession>;
	async getSession(requestingExtension: IExtensionDescription, providerId: string, scopesOrRequest: readonly string[] | vscode.AuthenticationWwwAuthenticateRequest, options: vscode.AuthenticationGetSessionOptions & { forceNewSession: vscode.AuthenticationForceNewSessionOptions }): Promise<vscode.AuthenticationSession>;
	async getSession(requestingExtension: IExtensionDescription, providerId: string, scopesOrRequest: readonly string[] | vscode.AuthenticationWwwAuthenticateRequest, options: vscode.AuthenticationGetSessionOptions): Promise<vscode.AuthenticationSession | undefined>;
	async getSession(requestingExtension: IExtensionDescription, providerId: string, scopesOrRequest: readonly string[] | vscode.AuthenticationWwwAuthenticateRequest, options: vscode.AuthenticationGetSessionOptions = {}): Promise<vscode.AuthenticationSession | undefined> {
		const extensionId = ExtensionIdentifier.toKey(requestingExtension.identifier);
		const keys: (keyof vscode.AuthenticationGetSessionOptions)[] = Object.keys(options) as (keyof vscode.AuthenticationGetSessionOptions)[];
		// TODO: pull this out into a utility function somewhere
		const optionsStr = keys
			.map(key => {
				switch (key) {
					case 'account':
						return `${key}:${options.account?.id}`;
					case 'createIfNone':
					case 'forceNewSession': {
						const value = typeof options[key] === 'boolean'
							? `${options[key]}`
							: `'${options[key]?.detail}/${options[key]?.learnMore?.toString()}'`;
						return `${key}:${value}`;
					}
					case 'authorizationServer':
						return `${key}:${options.authorizationServer?.toString(true)}`;
					default:
						return `${key}:${!!options[key]}`;
				}
			})
			.sort()
			.join(', ');

		let singlerKey: string;
		if (isAuthenticationWwwAuthenticateRequest(scopesOrRequest)) {
			const challenge = scopesOrRequest as vscode.AuthenticationWwwAuthenticateRequest;
			const challengeStr = challenge.wwwAuthenticate;
			const scopesStr = challenge.fallbackScopes ? [...challenge.fallbackScopes].sort().join(' ') : '';
			singlerKey = `${extensionId} ${providerId} challenge:${challengeStr} ${scopesStr} ${optionsStr}`;
		} else {
			const sortedScopes = [...scopesOrRequest].sort().join(' ');
			singlerKey = `${extensionId} ${providerId} ${sortedScopes} ${optionsStr}`;
		}

		return await this._getSessionTaskSingler.getOrCreate(singlerKey, async () => {
			await this._proxy.$ensureProvider(providerId);
			const extensionName = requestingExtension.displayName || requestingExtension.name;
			return this._proxy.$getSession(providerId, scopesOrRequest, extensionId, extensionName, options);
		});
	}

	async getAccounts(providerId: string) {
		await this._proxy.$ensureProvider(providerId);
		return await this._proxy.$getAccounts(providerId);
	}

	registerAuthenticationProvider(id: string, label: string, provider: vscode.AuthenticationProvider, options?: vscode.AuthenticationProviderOptions): vscode.Disposable {
		// register
		void this._providerOperations.queue(id, async () => {
			// This use to be synchronous, but that wasn't an accurate representation because the main thread
			// may have unregistered the provider in the meantime. I don't see how this could really be done
			// synchronously, so we just say first one wins.
			if (this._authenticationProviders.get(id)) {
				this._logService.error(`An authentication provider with id '${id}' is already registered. The existing provider will not be replaced.`);
				return;
			}
			const listener = provider.onDidChangeSessions(e => this._proxy.$sendDidChangeSessions(id, e));
			this._authenticationProviders.set(id, { label, provider, disposable: listener, options: options ?? { supportsMultipleAccounts: false } });
			await this._proxy.$registerAuthenticationProvider({
				id,
				label,
				supportsMultipleAccounts: options?.supportsMultipleAccounts ?? false,
				supportedAuthorizationServers: options?.supportedAuthorizationServers,
				supportsChallenges: options?.supportsChallenges
			});
		});

		// unregister
		return new Disposable(() => {
			void this._providerOperations.queue(id, async () => {
				const providerData = this._authenticationProviders.get(id);
				if (providerData) {
					providerData.disposable?.dispose();
					this._authenticationProviders.delete(id);
					await this._proxy.$unregisterAuthenticationProvider(id);
				}
			});
		});
	}

	$createSession(providerId: string, scopes: string[], options: vscode.AuthenticationProviderSessionOptions): Promise<vscode.AuthenticationSession> {
		return this._providerOperations.queue(providerId, async () => {
			const providerData = this._authenticationProviders.get(providerId);
			if (providerData) {
				options.authorizationServer = URI.revive(options.authorizationServer);
				return await providerData.provider.createSession(scopes, options);
			}

			throw new Error(`Unable to find authentication provider with handle: ${providerId}`);
		});
	}

	$removeSession(providerId: string, sessionId: string): Promise<void> {
		return this._providerOperations.queue(providerId, async () => {
			const providerData = this._authenticationProviders.get(providerId);
			if (providerData) {
				return await providerData.provider.removeSession(sessionId);
			}

			throw new Error(`Unable to find authentication provider with handle: ${providerId}`);
		});
	}

	$getSessions(providerId: string, scopes: ReadonlyArray<string> | undefined, options: vscode.AuthenticationProviderSessionOptions): Promise<ReadonlyArray<vscode.AuthenticationSession>> {
		return this._providerOperations.queue(providerId, async () => {
			const providerData = this._authenticationProviders.get(providerId);
			if (providerData) {
				options.authorizationServer = URI.revive(options.authorizationServer);
				return await providerData.provider.getSessions(scopes, options);
			}

			throw new Error(`Unable to find authentication provider with handle: ${providerId}`);
		});
	}

	$getSessionsFromChallenges(providerId: string, constraint: vscode.AuthenticationConstraint, options: vscode.AuthenticationProviderSessionOptions): Promise<ReadonlyArray<vscode.AuthenticationSession>> {
		return this._providerOperations.queue(providerId, async () => {
			const providerData = this._authenticationProviders.get(providerId);
			if (providerData) {
				const provider = providerData.provider;
				// Check if provider supports challenges
				if (typeof provider.getSessionsFromChallenges === 'function') {
					options.authorizationServer = URI.revive(options.authorizationServer);
					return await provider.getSessionsFromChallenges(constraint, options);
				}
				throw new Error(`Authentication provider with handle: ${providerId} does not support getSessionsFromChallenges`);
			}

			throw new Error(`Unable to find authentication provider with handle: ${providerId}`);
		});
	}

	$createSessionFromChallenges(providerId: string, constraint: vscode.AuthenticationConstraint, options: vscode.AuthenticationProviderSessionOptions): Promise<vscode.AuthenticationSession> {
		return this._providerOperations.queue(providerId, async () => {
			const providerData = this._authenticationProviders.get(providerId);
			if (providerData) {
				const provider = providerData.provider;
				// Check if provider supports challenges
				if (typeof provider.createSessionFromChallenges === 'function') {
					options.authorizationServer = URI.revive(options.authorizationServer);
					return await provider.createSessionFromChallenges(constraint, options);
				}
				throw new Error(`Authentication provider with handle: ${providerId} does not support createSessionFromChallenges`);
			}

			throw new Error(`Unable to find authentication provider with handle: ${providerId}`);
		});
	}

	$onDidChangeAuthenticationSessions(id: string, label: string, extensionIdFilter?: string[]) {
		// Don't fire events for the internal auth providers
		if (!id.startsWith(INTERNAL_AUTH_PROVIDER_PREFIX)) {
			this._onDidChangeSessions.fire({ provider: { id, label }, extensionIdFilter });
		}
		return Promise.resolve();
	}

	$onDidUnregisterAuthenticationProvider(id: string): Promise<void> {
		return this._providerOperations.queue(id, async () => {
			const providerData = this._authenticationProviders.get(id);
			if (providerData) {
				providerData.disposable?.dispose();
				this._authenticationProviders.delete(id);
			}
		});
	}

	async $registerDynamicAuthProvider(
		authorizationServerComponents: UriComponents,
		serverMetadata: IAuthorizationServerMetadata,
		resourceMetadata: IAuthorizationProtectedResourceMetadata | undefined,
		clientId: string | undefined,
		clientSecret: string | undefined,
		initialTokens: IAuthorizationToken[] | undefined
	): Promise<string> {
		if (!clientId) {
			const authorizationServer = URI.revive(authorizationServerComponents);
			if (serverMetadata.registration_endpoint) {
				try {
					const registration = await fetchDynamicRegistration(serverMetadata, this._initData.environment.appName, resourceMetadata?.scopes_supported);
					clientId = registration.client_id;
					clientSecret = registration.client_secret;
				} catch (err) {
					this._logService.warn(`Dynamic registration failed for ${authorizationServer.toString()}: ${err.message}. Prompting user for client ID and client secret...`);
				}
			}
			// Still no client id so dynamic client registration was either not supported or failed
			if (!clientId) {
				this._logService.info(`Prompting user for client registration details for ${authorizationServer.toString()}`);
				const clientDetails = await this._proxy.$promptForClientRegistration(authorizationServer.toString());
				if (!clientDetails) {
					throw new Error('User did not provide client details');
				}
				clientId = clientDetails.clientId;
				clientSecret = clientDetails.clientSecret;
				this._logService.info(`User provided client registration for ${authorizationServer.toString()}`);
				if (clientSecret) {
					this._logService.trace(`User provided client secret for ${authorizationServer.toString()}`);
				} else {
					this._logService.trace(`User did not provide client secret for ${authorizationServer.toString()}`);
				}
			}
		}
		const provider = new this._dynamicAuthProviderCtor(
			this._extHostWindow,
			this._extHostUrls,
			this._initData,
			this._extHostProgress,
			this._extHostLoggerService,
			this._proxy,
			URI.revive(authorizationServerComponents),
			serverMetadata,
			resourceMetadata,
			clientId,
			clientSecret,
			this._onDidDynamicAuthProviderTokensChange,
			initialTokens || []
		);

		// Use the sequencer to ensure dynamic provider registration is serialized
		await this._providerOperations.queue(provider.id, async () => {
			this._authenticationProviders.set(
				provider.id,
				{
					label: provider.label,
					provider,
					disposable: Disposable.from(
						provider,
						provider.onDidChangeSessions(e => this._proxy.$sendDidChangeSessions(provider.id, e)),
						provider.onDidChangeClientId(() => this._proxy.$sendDidChangeDynamicProviderInfo({
							providerId: provider.id,
							clientId: provider.clientId,
							clientSecret: provider.clientSecret
						}))
					),
					options: { supportsMultipleAccounts: true }
				}
			);

			await this._proxy.$registerDynamicAuthenticationProvider({
				id: provider.id,
				label: provider.label,
				supportsMultipleAccounts: true,
				authorizationServer: authorizationServerComponents,
				resourceServer: resourceMetadata ? URI.parse(resourceMetadata.resource) : undefined,
				clientId: provider.clientId,
				clientSecret: provider.clientSecret
			});
		});




		return provider.id;
	}

	async $onDidChangeDynamicAuthProviderTokens(authProviderId: string, clientId: string, tokens: IAuthorizationToken[]): Promise<void> {
		this._onDidDynamicAuthProviderTokensChange.fire({ authProviderId, clientId, tokens });
	}
}

class TaskSingler<T> {
	private _inFlightPromises = new Map<string, Promise<T>>();
	getOrCreate(key: string, promiseFactory: () => Promise<T>) {
		const inFlight = this._inFlightPromises.get(key);
		if (inFlight) {
			return inFlight;
		}

		const promise = promiseFactory().finally(() => this._inFlightPromises.delete(key));
		this._inFlightPromises.set(key, promise);

		return promise;
	}
}

export class DynamicAuthProvider implements vscode.AuthenticationProvider {
	readonly id: string;
	readonly label: string;

	private _onDidChangeSessions = new Emitter<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent>();
	readonly onDidChangeSessions = this._onDidChangeSessions.event;

	private readonly _onDidChangeClientId = new Emitter<void>();
	readonly onDidChangeClientId = this._onDidChangeClientId.event;

	private readonly _tokenStore: TokenStore;

	protected readonly _createFlows: Array<{
		label: string;
		handler: (scopes: string[], progress: vscode.Progress<{ message: string }>, token: vscode.CancellationToken) => Promise<IAuthorizationTokenResponse>;
	}>;

	protected readonly _logger: ILogger;
	private readonly _disposable: DisposableStore;

	constructor(
		@IExtHostWindow protected readonly _extHostWindow: IExtHostWindow,
		@IExtHostUrlsService protected readonly _extHostUrls: IExtHostUrlsService,
		@IExtHostInitDataService protected readonly _initData: IExtHostInitDataService,
		@IExtHostProgress private readonly _extHostProgress: IExtHostProgress,
		@ILoggerService loggerService: ILoggerService,
		protected readonly _proxy: MainThreadAuthenticationShape,
		readonly authorizationServer: URI,
		protected readonly _serverMetadata: IAuthorizationServerMetadata,
		protected readonly _resourceMetadata: IAuthorizationProtectedResourceMetadata | undefined,
		protected _clientId: string,
		protected _clientSecret: string | undefined,
		onDidDynamicAuthProviderTokensChange: Emitter<{ authProviderId: string; clientId: string; tokens: IAuthorizationToken[] }>,
		initialTokens: IAuthorizationToken[],
	) {
		const stringifiedServer = authorizationServer.toString(true);
		// Auth Provider Id is a combination of the authorization server and the resource, if provided.
		this.id = _resourceMetadata?.resource
			? stringifiedServer + ' ' + _resourceMetadata?.resource
			: stringifiedServer;
		// Auth Provider label is just the resource name if provided, otherwise the authority of the authorization server.
		this.label = _resourceMetadata?.resource_name ?? this.authorizationServer.authority;

		this._logger = loggerService.createLogger(this.id, { name: `Auth: ${this.label}` });
		this._disposable = new DisposableStore();
		this._disposable.add(this._onDidChangeSessions);
		const scopedEvent = Event.chain(onDidDynamicAuthProviderTokensChange.event, $ => $
			.filter(e => e.authProviderId === this.id && e.clientId === _clientId)
			.map(e => e.tokens)
		);
		this._tokenStore = this._disposable.add(new TokenStore(
			{
				onDidChange: scopedEvent,
				set: (tokens) => _proxy.$setSessionsForDynamicAuthProvider(this.id, this.clientId, tokens),
			},
			initialTokens,
			this._logger
		));
		this._disposable.add(this._tokenStore.onDidChangeSessions(e => this._onDidChangeSessions.fire(e)));
		// Will be extended later to support other flows
		this._createFlows = [];
		if (_serverMetadata.authorization_endpoint) {
			this._createFlows.push({
				label: nls.localize('url handler', "URL Handler"),
				handler: (scopes, progress, token) => this._createWithUrlHandler(scopes, progress, token)
			});
		}
	}

	get clientId(): string {
		return this._clientId;
	}

	get clientSecret(): string | undefined {
		return this._clientSecret;
	}

	async getSessions(scopes: readonly string[] | undefined, _options: vscode.AuthenticationProviderSessionOptions): Promise<vscode.AuthenticationSession[]> {
		this._logger.info(`Getting sessions for scopes: ${scopes?.join(' ') ?? 'all'}`);
		if (!scopes) {
			return this._tokenStore.sessions;
		}
		// The oauth spec says tthat order doesn't matter so we sort the scopes for easy comparison
		// https://datatracker.ietf.org/doc/html/rfc6749#section-3.3
		// TODO@TylerLeonhardt: Do this for all scope handling in the auth APIs
		const sortedScopes = [...scopes].sort();
		const scopeStr = scopes.join(' ');
		let sessions = this._tokenStore.sessions.filter(session => arraysEqual([...session.scopes].sort(), sortedScopes));
		this._logger.info(`Found ${sessions.length} sessions for scopes: ${scopeStr}`);
		if (sessions.length) {
			const newTokens: IAuthorizationToken[] = [];
			const removedTokens: IAuthorizationToken[] = [];
			const tokenMap = new Map<string, IAuthorizationToken>(this._tokenStore.tokens.map(token => [token.access_token, token]));
			for (const session of sessions) {
				const token = tokenMap.get(session.accessToken);
				if (token && token.expires_in) {
					const now = Date.now();
					const expiresInMS = token.expires_in * 1000;
					// Check if the token is about to expire in 5 minutes or if it is expired
					if (now > token.created_at + expiresInMS - (5 * 60 * 1000)) {
						this._logger.info(`Token for session ${session.id} is about to expire, refreshing...`);
						removedTokens.push(token);
						if (!token.refresh_token) {
							// No refresh token available, cannot refresh
							this._logger.warn(`No refresh token available for scopes ${session.scopes.join(' ')}. Throwing away token.`);
							continue;
						}
						try {
							const newToken = await this.exchangeRefreshTokenForToken(token.refresh_token);
							// TODO@TylerLeonhardt: When the core scope handling doesn't care about order, this check should be
							// updated to not care about order
							if (newToken.scope !== scopeStr) {
								this._logger.warn(`Token scopes '${newToken.scope}' do not match requested scopes '${scopeStr}'. Overwriting token with what was requested...`);
								newToken.scope = scopeStr;
							}
							this._logger.info(`Successfully created a new token for scopes ${session.scopes.join(' ')}.`);
							newTokens.push(newToken);
						} catch (err) {
							this._logger.error(`Failed to refresh token: ${err}`);
						}

					}
				}
			}
			if (newTokens.length || removedTokens.length) {
				this._tokenStore.update({ added: newTokens, removed: removedTokens });
				// Since we updated the tokens, we need to re-filter the sessions
				// to get the latest state
				sessions = this._tokenStore.sessions.filter(session => arraysEqual([...session.scopes].sort(), sortedScopes));
			}
			this._logger.info(`Found ${sessions.length} sessions for scopes: ${scopeStr}`);
			return sessions;
		}
		return [];
	}

	async createSession(scopes: string[], _options: vscode.AuthenticationProviderSessionOptions): Promise<vscode.AuthenticationSession> {
		this._logger.info(`Creating session for scopes: ${scopes.join(' ')}`);
		let token: IAuthorizationTokenResponse | undefined;
		for (let i = 0; i < this._createFlows.length; i++) {
			const { handler } = this._createFlows[i];
			try {
				token = await this._extHostProgress.withProgressFromSource(
					{ label: this.label, id: this.id },
					{
						location: ProgressLocation.Notification,
						title: nls.localize('authenticatingTo', "Authenticating to '{0}'", this.label),
						cancellable: true
					},
					(progress, token) => handler(scopes, progress, token));
				if (token) {
					break;
				}
			} catch (err) {
				const nextMode = this._createFlows[i + 1]?.label;
				if (!nextMode) {
					break; // No more flows to try
				}
				const message = isCancellationError(err)
					? nls.localize('userCanceledContinue', "Having trouble authenticating to '{0}'? Would you like to try a different way? ({1})", this.label, nextMode)
					: nls.localize('continueWith', "You have not yet finished authenticating to '{0}'. Would you like to try a different way? ({1})", this.label, nextMode);

				const result = await this._proxy.$showContinueNotification(message);
				if (!result) {
					throw new CancellationError();
				}
				this._logger.error(`Failed to create token via flow '${nextMode}': ${err}`);
			}
		}
		if (!token) {
			throw new Error('Failed to create authentication token');
		}
		if (token.scope !== scopes.join(' ')) {
			this._logger.warn(`Token scopes '${token.scope}' do not match requested scopes '${scopes.join(' ')}'. Overwriting token with what was requested...`);
			token.scope = scopes.join(' ');
		}

		// Store session for later retrieval
		this._tokenStore.update({ added: [{ ...token, created_at: Date.now() }], removed: [] });
		const session = this._tokenStore.sessions.find(t => t.accessToken === token.access_token)!;
		this._logger.info(`Created ${token.refresh_token ? 'refreshable' : 'non-refreshable'} session for scopes: ${token.scope}${token.expires_in ? ` that expires in ${token.expires_in} seconds` : ''}`);
		return session;
	}

	async removeSession(sessionId: string): Promise<void> {
		this._logger.info(`Removing session with id: ${sessionId}`);
		const session = this._tokenStore.sessions.find(session => session.id === sessionId);
		if (!session) {
			this._logger.error(`Session with id ${sessionId} not found`);
			return;
		}
		const token = this._tokenStore.tokens.find(token => token.access_token === session.accessToken);
		if (!token) {
			this._logger.error(`Failed to retrieve token for removed session: ${session.id}`);
			return;
		}
		this._tokenStore.update({ added: [], removed: [token] });
		this._logger.info(`Removed token for session: ${session.id} with scopes: ${session.scopes.join(' ')}`);
	}

	dispose(): void {
		this._disposable.dispose();
	}

	private async _createWithUrlHandler(scopes: string[], progress: vscode.Progress<IProgressStep>, token: vscode.CancellationToken): Promise<IAuthorizationTokenResponse> {
		if (!this._serverMetadata.authorization_endpoint) {
			throw new Error('Authorization Endpoint required');
		}
		if (!this._serverMetadata.token_endpoint) {
			throw new Error('Token endpoint not available in server metadata');
		}

		// Generate PKCE code verifier (random string) and code challenge (SHA-256 hash of verifier)
		const codeVerifier = this.generateRandomString(64);
		const codeChallenge = await this.generateCodeChallenge(codeVerifier);

		// Generate a random state value to prevent CSRF
		const nonce = this.generateRandomString(32);
		const callbackUri = URI.parse(`${this._initData.environment.appUriScheme}://dynamicauthprovider/${this.authorizationServer.authority}/authorize?nonce=${nonce}`);
		let state: URI;
		try {
			state = await this._extHostUrls.createAppUri(callbackUri);
		} catch (error) {
			throw new Error(`Failed to create external URI: ${error}`);
		}

		// Prepare the authorization request URL
		const authorizationUrl = new URL(this._serverMetadata.authorization_endpoint);
		authorizationUrl.searchParams.append('client_id', this._clientId);
		authorizationUrl.searchParams.append('response_type', 'code');
		authorizationUrl.searchParams.append('state', state.toString());
		authorizationUrl.searchParams.append('code_challenge', codeChallenge);
		authorizationUrl.searchParams.append('code_challenge_method', 'S256');
		const scopeString = scopes.join(' ');
		if (scopeString) {
			// If non-empty scopes are provided, include scope parameter in the request
			authorizationUrl.searchParams.append('scope', scopeString);
		}
		if (this._resourceMetadata?.resource) {
			// If a resource is specified, include it in the request
			authorizationUrl.searchParams.append('resource', this._resourceMetadata.resource);
		}

		// Use a redirect URI that matches what was registered during dynamic registration
		const redirectUri = 'https://vscode.dev/redirect';
		authorizationUrl.searchParams.append('redirect_uri', redirectUri);

		const promise = this.waitForAuthorizationCode(callbackUri);

		// Open the browser for user authorization
		this._logger.info(`Opening authorization URL for scopes: ${scopeString}`);
		this._logger.trace(`Authorization URL: ${authorizationUrl.toString()}`);
		const opened = await this._extHostWindow.openUri(authorizationUrl.toString(), {});
		if (!opened) {
			throw new CancellationError();
		}
		progress.report({
			message: nls.localize('completeAuth', "Complete the authentication in the browser window that has opened."),
		});

		// Wait for the authorization code via a redirect
		let code: string | undefined;
		try {
			const response = await raceCancellationError(promise, token);
			code = response.code;
		} catch (err) {
			if (isCancellationError(err)) {
				this._logger.info('Authorization code request was cancelled by the user.');
				throw err;
			}
			this._logger.error(`Failed to receive authorization code: ${err}`);
			throw new Error(`Failed to receive authorization code: ${err}`);
		}
		this._logger.info(`Authorization code received for scopes: ${scopeString}`);

		// Exchange the authorization code for tokens
		const tokenResponse = await this.exchangeCodeForToken(code, codeVerifier, redirectUri);
		return tokenResponse;
	}

	protected generateRandomString(length: number): string {
		const array = new Uint8Array(length);
		crypto.getRandomValues(array);
		return Array.from(array)
			.map(b => b.toString(16).padStart(2, '0'))
			.join('')
			.substring(0, length);
	}

	protected async generateCodeChallenge(codeVerifier: string): Promise<string> {
		const encoder = new TextEncoder();
		const data = encoder.encode(codeVerifier);
		const digest = await crypto.subtle.digest('SHA-256', data);

		// Base64url encode the digest
		return encodeBase64(VSBuffer.wrap(new Uint8Array(digest)), false, false)
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');
	}

	private async waitForAuthorizationCode(expectedState: URI): Promise<{ code: string }> {
		const result = await this._proxy.$waitForUriHandler(expectedState);
		// Extract the code parameter directly from the query string. NOTE, URLSearchParams does not work here because
		// it will decode the query string and we need to keep it encoded.
		const codeMatch = /[?&]code=([^&]+)/.exec(result.query || '');
		if (!codeMatch || codeMatch.length < 2) {
			// No code parameter found in the query string
			throw new Error('Authentication failed: No authorization code received');
		}
		return { code: codeMatch[1] };
	}

	protected async exchangeCodeForToken(code: string, codeVerifier: string, redirectUri: string): Promise<IAuthorizationTokenResponse> {
		if (!this._serverMetadata.token_endpoint) {
			throw new Error('Token endpoint not available in server metadata');
		}

		const tokenRequest = new URLSearchParams();
		tokenRequest.append('client_id', this._clientId);
		tokenRequest.append('grant_type', 'authorization_code');
		tokenRequest.append('code', code);
		tokenRequest.append('redirect_uri', redirectUri);
		tokenRequest.append('code_verifier', codeVerifier);

		// Add resource indicator if available (RFC 8707)
		if (this._resourceMetadata?.resource) {
			tokenRequest.append('resource', this._resourceMetadata.resource);
		}

		// Add client secret if available
		if (this._clientSecret) {
			tokenRequest.append('client_secret', this._clientSecret);
		}

		this._logger.info('Exchanging authorization code for token...');
		this._logger.trace(`Url: ${this._serverMetadata.token_endpoint}`);
		this._logger.trace(`Token request body: ${tokenRequest.toString()}`);
		let response: Response;
		try {
			response = await fetch(this._serverMetadata.token_endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Accept': 'application/json'
				},
				body: tokenRequest.toString()
			});
		} catch (err) {
			this._logger.error(`Failed to exchange authorization code for token: ${err}`);
			throw new Error(`Failed to exchange authorization code for token: ${err}`);
		}

		if (!response.ok) {
			const text = await response.text();
			throw new Error(`Token exchange failed: ${response.status} ${response.statusText} - ${text}`);
		}

		const result = await response.json();
		if (isAuthorizationTokenResponse(result)) {
			this._logger.info(`Successfully exchanged authorization code for token.`);
			return result;
		} else if (isAuthorizationErrorResponse(result) && result.error === AuthorizationErrorType.InvalidClient) {
			this._logger.warn(`Client ID (${this._clientId}) was invalid, generated a new one.`);
			await this._generateNewClientId();
			throw new Error(`Client ID was invalid, generated a new one. Please try again.`);
		}
		throw new Error(`Invalid authorization token response: ${JSON.stringify(result)}`);
	}

	protected async exchangeRefreshTokenForToken(refreshToken: string): Promise<IAuthorizationToken> {
		if (!this._serverMetadata.token_endpoint) {
			throw new Error('Token endpoint not available in server metadata');
		}

		const tokenRequest = new URLSearchParams();
		tokenRequest.append('client_id', this._clientId);
		tokenRequest.append('grant_type', 'refresh_token');
		tokenRequest.append('refresh_token', refreshToken);

		// Add resource indicator if available (RFC 8707)
		if (this._resourceMetadata?.resource) {
			tokenRequest.append('resource', this._resourceMetadata.resource);
		}

		// Add client secret if available
		if (this._clientSecret) {
			tokenRequest.append('client_secret', this._clientSecret);
		}

		const response = await fetch(this._serverMetadata.token_endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json'
			},
			body: tokenRequest.toString()
		});

		const result = await response.json();
		if (isAuthorizationTokenResponse(result)) {
			return {
				...result,
				created_at: Date.now(),
			};
		} else if (isAuthorizationErrorResponse(result) && result.error === AuthorizationErrorType.InvalidClient) {
			this._logger.warn(`Client ID (${this._clientId}) was invalid, generated a new one.`);
			await this._generateNewClientId();
			throw new Error(`Client ID was invalid, generated a new one. Please try again.`);
		}
		throw new Error(`Invalid authorization token response: ${JSON.stringify(result)}`);
	}

	protected async _generateNewClientId(): Promise<void> {
		try {
			const registration = await fetchDynamicRegistration(this._serverMetadata, this._initData.environment.appName, this._resourceMetadata?.scopes_supported);
			this._clientId = registration.client_id;
			this._clientSecret = registration.client_secret;
			this._onDidChangeClientId.fire();
		} catch (err) {
			// When DCR fails, try to prompt the user for a client ID and client secret
			this._logger.info(`Dynamic registration failed for ${this.authorizationServer.toString()}: ${err}. Prompting user for client ID and client secret.`);

			try {
				const clientDetails = await this._proxy.$promptForClientRegistration(this.authorizationServer.toString());
				if (!clientDetails) {
					throw new Error('User did not provide client details');
				}
				this._clientId = clientDetails.clientId;
				this._clientSecret = clientDetails.clientSecret;
				this._logger.info(`User provided client ID for ${this.authorizationServer.toString()}`);
				if (clientDetails.clientSecret) {
					this._logger.info(`User provided client secret for ${this.authorizationServer.toString()}`);
				} else {
					this._logger.info(`User did not provide client secret for ${this.authorizationServer.toString()} (optional)`);
				}

				this._onDidChangeClientId.fire();
			} catch (promptErr) {
				this._logger.error(`Failed to fetch new client ID and user did not provide one: ${err}`);
				throw new Error(`Failed to fetch new client ID and user did not provide one: ${err}`);
			}
		}
	}
}

type IAuthorizationToken = IAuthorizationTokenResponse & {
	/**
	 * The time when the token was created, in milliseconds since the epoch.
	 */
	created_at: number;
};

class TokenStore implements Disposable {
	private readonly _tokensObservable: ISettableObservable<IAuthorizationToken[]>;
	private readonly _sessionsObservable: IObservable<vscode.AuthenticationSession[]>;

	private readonly _onDidChangeSessions = new Emitter<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent>();
	readonly onDidChangeSessions = this._onDidChangeSessions.event;

	private readonly _disposable: DisposableStore;

	constructor(
		private readonly _persistence: { onDidChange: Event<IAuthorizationToken[]>; set: (tokens: IAuthorizationToken[]) => void },
		initialTokens: IAuthorizationToken[],
		private readonly _logger: ILogger
	) {
		this._disposable = new DisposableStore();
		this._tokensObservable = observableValue<IAuthorizationToken[]>('tokens', initialTokens);
		this._sessionsObservable = derivedOpts(
			{ equalsFn: (a, b) => arraysEqual(a, b, (a, b) => a.accessToken === b.accessToken) },
			(reader) => this._tokensObservable.read(reader).map(t => this._getSessionFromToken(t))
		);
		this._disposable.add(this._registerChangeEventAutorun());
		this._disposable.add(this._persistence.onDidChange((tokens) => this._tokensObservable.set(tokens, undefined)));
	}

	get tokens(): IAuthorizationToken[] {
		return this._tokensObservable.get();
	}

	get sessions(): vscode.AuthenticationSession[] {
		return this._sessionsObservable.get();
	}

	dispose() {
		this._disposable.dispose();
	}

	update({ added, removed }: { added: IAuthorizationToken[]; removed: IAuthorizationToken[] }): void {
		this._logger.trace(`Updating tokens: added ${added.length}, removed ${removed.length}`);
		const currentTokens = [...this._tokensObservable.get()];
		for (const token of removed) {
			const index = currentTokens.findIndex(t => t.access_token === token.access_token);
			if (index !== -1) {
				currentTokens.splice(index, 1);
			}
		}
		for (const token of added) {
			const index = currentTokens.findIndex(t => t.access_token === token.access_token);
			if (index === -1) {
				currentTokens.push(token);
			} else {
				currentTokens[index] = token;
			}
		}
		if (added.length || removed.length) {
			this._tokensObservable.set(currentTokens, undefined);
			void this._persistence.set(currentTokens);
		}
		this._logger.trace(`Tokens updated: ${currentTokens.length} tokens stored.`);
	}

	private _registerChangeEventAutorun(): IDisposable {
		let previousSessions: vscode.AuthenticationSession[] = [];
		return autorun((reader) => {
			this._logger.trace('Checking for session changes...');
			const currentSessions = this._sessionsObservable.read(reader);
			if (previousSessions === currentSessions) {
				this._logger.trace('No session changes detected.');
				return;
			}

			if (!currentSessions || currentSessions.length === 0) {
				// If currentSessions is undefined, all previous sessions are considered removed
				this._logger.trace('All sessions removed.');
				if (previousSessions.length > 0) {
					this._onDidChangeSessions.fire({
						added: [],
						removed: previousSessions,
						changed: []
					});
					previousSessions = [];
				}
				return;
			}

			const added: vscode.AuthenticationSession[] = [];
			const removed: vscode.AuthenticationSession[] = [];

			// Find added sessions
			for (const current of currentSessions) {
				const exists = previousSessions.some(prev => prev.accessToken === current.accessToken);
				if (!exists) {
					added.push(current);
				}
			}

			// Find removed sessions
			for (const prev of previousSessions) {
				const exists = currentSessions.some(current => current.accessToken === prev.accessToken);
				if (!exists) {
					removed.push(prev);
				}
			}

			// Fire the event if there are any changes
			if (added.length > 0 || removed.length > 0) {
				this._logger.trace(`Sessions changed: added ${added.length}, removed ${removed.length}`);
				this._onDidChangeSessions.fire({ added, removed, changed: [] });
			}

			// Update previous sessions reference
			previousSessions = currentSessions;
		});
	}

	private _getSessionFromToken(token: IAuthorizationTokenResponse): vscode.AuthenticationSession {
		let claims: IAuthorizationJWTClaims | undefined;
		if (token.id_token) {
			try {
				claims = getClaimsFromJWT(token.id_token);
			} catch (e) {
				// log
			}
		}
		if (!claims) {
			try {
				claims = getClaimsFromJWT(token.access_token);
			} catch (e) {
				// log
			}
		}
		const scopes = token.scope
			? token.scope.split(' ')
			: claims?.scope
				? claims.scope.split(' ')
				: [];
		return {
			id: stringHash(token.access_token, 0).toString(),
			accessToken: token.access_token,
			account: {
				id: claims?.sub || 'unknown',
				// TODO: Don't say MCP...
				label: claims?.preferred_username || claims?.name || claims?.email || 'MCP',
			},
			scopes: scopes,
			idToken: token.id_token
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostBulkEdits.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostBulkEdits.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { MainContext, MainThreadBulkEditsShape } from './extHost.protocol.js';
import { ExtHostDocumentsAndEditors } from './extHostDocumentsAndEditors.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { WorkspaceEdit } from './extHostTypeConverters.js';
import { SerializableObjectWithBuffers } from '../../services/extensions/common/proxyIdentifier.js';
import type * as vscode from 'vscode';

export class ExtHostBulkEdits {

	private readonly _proxy: MainThreadBulkEditsShape;
	private readonly _versionInformationProvider: WorkspaceEdit.IVersionInformationProvider;

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		extHostDocumentsAndEditors: ExtHostDocumentsAndEditors,
	) {
		this._proxy = extHostRpc.getProxy(MainContext.MainThreadBulkEdits);

		this._versionInformationProvider = {
			getTextDocumentVersion: uri => extHostDocumentsAndEditors.getDocument(uri)?.version,
			getNotebookDocumentVersion: () => undefined
		};
	}

	applyWorkspaceEdit(edit: vscode.WorkspaceEdit, extension: IExtensionDescription, metadata: vscode.WorkspaceEditMetadata | undefined): Promise<boolean> {
		const dto = new SerializableObjectWithBuffers(WorkspaceEdit.from(edit, this._versionInformationProvider));
		return this._proxy.$tryApplyWorkspaceEdit(dto, undefined, metadata?.isRefactoring ?? false);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostChatAgents2.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostChatAgents2.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { coalesce } from '../../../base/common/arrays.js';
import { timeout } from '../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../base/common/cancellation.js';
import { toErrorMessage } from '../../../base/common/errorMessage.js';
import { Emitter } from '../../../base/common/event.js';
import { Iterable } from '../../../base/common/iterator.js';
import { Disposable, DisposableMap, DisposableResourceMap, DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';
import { revive } from '../../../base/common/marshalling.js';
import { StopWatch } from '../../../base/common/stopwatch.js';
import { assertType } from '../../../base/common/types.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { Location } from '../../../editor/common/languages.js';
import { ExtensionIdentifier, IExtensionDescription, IRelaxedExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { isChatViewTitleActionContext } from '../../contrib/chat/common/chatActions.js';
import { IChatAgentRequest, IChatAgentResult, IChatAgentResultTimings, UserSelectedTools } from '../../contrib/chat/common/chatAgents.js';
import { IChatRelatedFile, IChatRequestDraft } from '../../contrib/chat/common/chatEditingService.js';
import { ChatAgentVoteDirection, IChatContentReference, IChatFollowup, IChatResponseErrorDetails, IChatUserActionEvent, IChatVoteAction } from '../../contrib/chat/common/chatService.js';
import { LocalChatSessionUri } from '../../contrib/chat/common/chatUri.js';
import { ChatAgentLocation } from '../../contrib/chat/common/constants.js';
import { checkProposedApiEnabled, isProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { Dto } from '../../services/extensions/common/proxyIdentifier.js';
import { ExtHostChatAgentsShape2, IChatAgentCompletionItem, IChatAgentHistoryEntryDto, IChatAgentProgressShape, IChatProgressDto, IChatSessionContextDto, IExtensionChatAgentMetadata, IMainContext, MainContext, MainThreadChatAgentsShape2 } from './extHost.protocol.js';
import { CommandsConverter, ExtHostCommands } from './extHostCommands.js';
import { ExtHostDiagnostics } from './extHostDiagnostics.js';
import { ExtHostDocuments } from './extHostDocuments.js';
import { ExtHostLanguageModels } from './extHostLanguageModels.js';
import { ExtHostLanguageModelTools } from './extHostLanguageModelTools.js';
import * as typeConvert from './extHostTypeConverters.js';
import * as extHostTypes from './extHostTypes.js';
import { ICustomAgentQueryOptions, IExternalCustomAgent } from '../../contrib/chat/common/promptSyntax/service/promptsService.js';
import { ExtHostDocumentsAndEditors } from './extHostDocumentsAndEditors.js';

export class ChatAgentResponseStream {

	private _stopWatch = StopWatch.create(false);
	private _isClosed: boolean = false;
	private _firstProgress: number | undefined;
	private _apiObject: vscode.ChatResponseStream | undefined;

	constructor(
		private readonly _extension: IExtensionDescription,
		private readonly _request: IChatAgentRequest,
		private readonly _proxy: IChatAgentProgressShape,
		private readonly _commandsConverter: CommandsConverter,
		private readonly _sessionDisposables: DisposableStore
	) { }

	close() {
		this._isClosed = true;
	}

	get timings(): IChatAgentResultTimings {
		return {
			firstProgress: this._firstProgress,
			totalElapsed: this._stopWatch.elapsed()
		};
	}

	get apiObject() {

		if (!this._apiObject) {

			const that = this;
			this._stopWatch.reset();


			let taskHandlePool = 0;


			function throwIfDone(source: Function | undefined) {
				if (that._isClosed) {
					const err = new Error('Response stream has been closed');
					Error.captureStackTrace(err, source);
					throw err;
				}
			}


			const sendQueue: (IChatProgressDto | [IChatProgressDto, number])[] = [];
			let notify: Function[] = [];

			function send(chunk: IChatProgressDto): void;
			function send(chunk: IChatProgressDto, handle: number): Promise<void>;
			function send(chunk: IChatProgressDto, handle?: number) {
				// push data into send queue. the first entry schedules the micro task which
				// does the actual send to the main thread
				const newLen = sendQueue.push(handle !== undefined ? [chunk, handle] : chunk);
				if (newLen === 1) {
					queueMicrotask(() => {
						const toNotify = notify;
						notify = [];
						that._proxy.$handleProgressChunk(that._request.requestId, sendQueue).finally(() => {
							toNotify.forEach(f => f());
						});
						sendQueue.length = 0;
					});
				}
				if (handle !== undefined) {
					return new Promise<void>(resolve => { notify.push(resolve); });
				}
				return;
			}

			const _report = (progress: IChatProgressDto, task?: (progress: vscode.Progress<vscode.ChatResponseWarningPart | vscode.ChatResponseReferencePart>) => Thenable<string | void>) => {
				// Measure the time to the first progress update with real markdown content
				if (typeof this._firstProgress === 'undefined' && (progress.kind === 'markdownContent' || progress.kind === 'markdownVuln' || progress.kind === 'prepareToolInvocation')) {
					this._firstProgress = this._stopWatch.elapsed();
				}

				if (task) {
					const myHandle = taskHandlePool++;
					const progressReporterPromise = send(progress, myHandle);
					const progressReporter = {
						report: (p: vscode.ChatResponseWarningPart | vscode.ChatResponseReferencePart) => {
							progressReporterPromise.then(() => {
								if (extHostTypes.MarkdownString.isMarkdownString(p.value)) {
									send(typeConvert.ChatResponseWarningPart.from(<vscode.ChatResponseWarningPart>p), myHandle);
								} else {
									send(typeConvert.ChatResponseReferencePart.from(<vscode.ChatResponseReferencePart>p), myHandle);
								}
							});
						}
					};

					Promise.all([progressReporterPromise, task(progressReporter)]).then(([_void, res]) => {
						send(typeConvert.ChatTaskResult.from(res), myHandle);
					});
				} else {
					send(progress);
				}
			};

			this._apiObject = Object.freeze<vscode.ChatResponseStream>({
				clearToPreviousToolInvocation(reason) {
					throwIfDone(this.markdown);
					send({ kind: 'clearToPreviousToolInvocation', reason: reason });
					return this;
				},
				markdown(value) {
					throwIfDone(this.markdown);
					const part = new extHostTypes.ChatResponseMarkdownPart(value);
					const dto = typeConvert.ChatResponseMarkdownPart.from(part);
					_report(dto);
					return this;
				},
				markdownWithVulnerabilities(value, vulnerabilities) {
					throwIfDone(this.markdown);
					if (vulnerabilities) {
						checkProposedApiEnabled(that._extension, 'chatParticipantAdditions');
					}

					const part = new extHostTypes.ChatResponseMarkdownWithVulnerabilitiesPart(value, vulnerabilities);
					const dto = typeConvert.ChatResponseMarkdownWithVulnerabilitiesPart.from(part);
					_report(dto);
					return this;
				},
				codeblockUri(value, isEdit) {
					throwIfDone(this.codeblockUri);
					checkProposedApiEnabled(that._extension, 'chatParticipantAdditions');
					const part = new extHostTypes.ChatResponseCodeblockUriPart(value, isEdit);
					const dto = typeConvert.ChatResponseCodeblockUriPart.from(part);
					_report(dto);
					return this;
				},
				filetree(value, baseUri) {
					throwIfDone(this.filetree);
					const part = new extHostTypes.ChatResponseFileTreePart(value, baseUri);
					const dto = typeConvert.ChatResponseFilesPart.from(part);
					_report(dto);
					return this;
				},
				anchor(value, title?: string) {
					const part = new extHostTypes.ChatResponseAnchorPart(value, title);
					return this.push(part);
				},
				button(value) {
					throwIfDone(this.anchor);
					const part = new extHostTypes.ChatResponseCommandButtonPart(value);
					const dto = typeConvert.ChatResponseCommandButtonPart.from(part, that._commandsConverter, that._sessionDisposables);
					_report(dto);
					return this;
				},
				progress(value, task?: ((progress: vscode.Progress<vscode.ChatResponseWarningPart>) => Thenable<string | void>)) {
					throwIfDone(this.progress);
					const part = new extHostTypes.ChatResponseProgressPart2(value, task);
					const dto = task ? typeConvert.ChatTask.from(part) : typeConvert.ChatResponseProgressPart.from(part);
					_report(dto, task);
					return this;
				},
				thinkingProgress(thinkingDelta: vscode.ThinkingDelta) {
					throwIfDone(this.thinkingProgress);
					checkProposedApiEnabled(that._extension, 'chatParticipantAdditions');
					const part = new extHostTypes.ChatResponseThinkingProgressPart(thinkingDelta.text ?? '', thinkingDelta.id, thinkingDelta.metadata);
					const dto = typeConvert.ChatResponseThinkingProgressPart.from(part);
					_report(dto);
					return this;
				},
				warning(value) {
					throwIfDone(this.progress);
					checkProposedApiEnabled(that._extension, 'chatParticipantAdditions');
					const part = new extHostTypes.ChatResponseWarningPart(value);
					const dto = typeConvert.ChatResponseWarningPart.from(part);
					_report(dto);
					return this;
				},
				reference(value, iconPath) {
					return this.reference2(value, iconPath);
				},
				reference2(value, iconPath, options) {
					throwIfDone(this.reference);

					if (typeof value === 'object' && 'variableName' in value) {
						checkProposedApiEnabled(that._extension, 'chatParticipantAdditions');
					}

					if (typeof value === 'object' && 'variableName' in value && !value.value) {
						// The participant used this variable. Does that variable have any references to pull in?
						const matchingVarData = that._request.variables.variables.find(v => v.name === value.variableName);
						if (matchingVarData) {
							let references: Dto<IChatContentReference>[] | undefined;
							if (matchingVarData.references?.length) {
								references = matchingVarData.references.map(r => ({
									kind: 'reference',
									reference: { variableName: value.variableName, value: r.reference as URI | Location }
								} satisfies IChatContentReference));
							} else {
								// Participant sent a variableName reference but the variable produced no references. Show variable reference with no value
								const part = new extHostTypes.ChatResponseReferencePart(value, iconPath, options);
								const dto = typeConvert.ChatResponseReferencePart.from(part);
								references = [dto];
							}

							references.forEach(r => _report(r));
							return this;
						} else {
							// Something went wrong- that variable doesn't actually exist
						}
					} else {
						const part = new extHostTypes.ChatResponseReferencePart(value, iconPath, options);
						const dto = typeConvert.ChatResponseReferencePart.from(part);
						_report(dto);
					}

					return this;
				},
				codeCitation(value: vscode.Uri, license: string, snippet: string): void {
					throwIfDone(this.codeCitation);
					checkProposedApiEnabled(that._extension, 'chatParticipantAdditions');

					const part = new extHostTypes.ChatResponseCodeCitationPart(value, license, snippet);
					const dto = typeConvert.ChatResponseCodeCitationPart.from(part);
					_report(dto);
				},
				textEdit(target, edits) {
					throwIfDone(this.textEdit);
					checkProposedApiEnabled(that._extension, 'chatParticipantAdditions');

					const part = new extHostTypes.ChatResponseTextEditPart(target, edits);
					part.isDone = edits === true ? true : undefined;
					const dto = typeConvert.ChatResponseTextEditPart.from(part);
					_report(dto);
					return this;
				},
				notebookEdit(target, edits) {
					throwIfDone(this.notebookEdit);
					checkProposedApiEnabled(that._extension, 'chatParticipantAdditions');

					const part = new extHostTypes.ChatResponseNotebookEditPart(target, edits);
					const dto = typeConvert.ChatResponseNotebookEditPart.from(part);
					_report(dto);
					return this;
				},
				async externalEdit(target, callback) {
					throwIfDone(this.externalEdit);
					const resources = Array.isArray(target) ? target : [target];
					const operationId = taskHandlePool++;
					const undoStopId = generateUuid();
					await send({ kind: 'externalEdits', start: true, resources, undoStopId }, operationId);
					try {
						await callback();
						return undoStopId;
					} finally {
						await send({ kind: 'externalEdits', start: false, resources, undoStopId }, operationId);
					}
				},
				confirmation(title, message, data, buttons) {
					throwIfDone(this.confirmation);
					checkProposedApiEnabled(that._extension, 'chatParticipantAdditions');

					const part = new extHostTypes.ChatResponseConfirmationPart(title, message, data, buttons);
					const dto = typeConvert.ChatResponseConfirmationPart.from(part);
					_report(dto);
					return this;
				},
				prepareToolInvocation(toolName) {
					throwIfDone(this.prepareToolInvocation);
					checkProposedApiEnabled(that._extension, 'chatParticipantAdditions');

					const part = new extHostTypes.ChatPrepareToolInvocationPart(toolName);
					const dto = typeConvert.ChatPrepareToolInvocationPart.from(part);
					_report(dto);
					return this;
				},
				push(part) {
					throwIfDone(this.push);

					if (
						part instanceof extHostTypes.ChatResponseTextEditPart ||
						part instanceof extHostTypes.ChatResponseNotebookEditPart ||
						part instanceof extHostTypes.ChatResponseMarkdownWithVulnerabilitiesPart ||
						part instanceof extHostTypes.ChatResponseWarningPart ||
						part instanceof extHostTypes.ChatResponseConfirmationPart ||
						part instanceof extHostTypes.ChatResponseCodeCitationPart ||
						part instanceof extHostTypes.ChatResponseMovePart ||
						part instanceof extHostTypes.ChatResponseExtensionsPart ||
						part instanceof extHostTypes.ChatResponseExternalEditPart ||
						part instanceof extHostTypes.ChatResponseThinkingProgressPart ||
						part instanceof extHostTypes.ChatResponsePullRequestPart ||
						part instanceof extHostTypes.ChatResponseProgressPart2
					) {
						checkProposedApiEnabled(that._extension, 'chatParticipantAdditions');
					}

					if (part instanceof extHostTypes.ChatResponseReferencePart) {
						// Ensure variable reference values get fixed up
						this.reference2(part.value, part.iconPath, part.options);
					} else if (part instanceof extHostTypes.ChatResponseProgressPart2) {
						const dto = part.task ? typeConvert.ChatTask.from(part) : typeConvert.ChatResponseProgressPart.from(part);
						_report(dto, part.task);
					} else if (part instanceof extHostTypes.ChatResponseThinkingProgressPart) {
						const dto = typeConvert.ChatResponseThinkingProgressPart.from(part);
						_report(dto);
					} else if (part instanceof extHostTypes.ChatResponseAnchorPart) {
						const dto = typeConvert.ChatResponseAnchorPart.from(part);

						if (part.resolve) {
							checkProposedApiEnabled(that._extension, 'chatParticipantAdditions');

							dto.resolveId = generateUuid();

							const cts = new CancellationTokenSource();
							part.resolve(cts.token)
								.then(() => {
									const resolvedDto = typeConvert.ChatResponseAnchorPart.from(part);
									that._proxy.$handleAnchorResolve(that._request.requestId, dto.resolveId!, resolvedDto);
								})
								.then(() => cts.dispose(), () => cts.dispose());
							that._sessionDisposables.add(toDisposable(() => cts.dispose(true)));
						}
						_report(dto);
					} else if (part instanceof extHostTypes.ChatPrepareToolInvocationPart) {
						checkProposedApiEnabled(that._extension, 'chatParticipantAdditions');
						const dto = typeConvert.ChatPrepareToolInvocationPart.from(part);
						_report(dto);
						return this;
					} else if (part instanceof extHostTypes.ChatResponseExternalEditPart) {
						const p = this.externalEdit(part.uris, part.callback);
						p.then((value) => part.didGetApplied(value));
						return this;
					} else {
						const dto = typeConvert.ChatResponsePart.from(part, that._commandsConverter, that._sessionDisposables);
						_report(dto);
					}

					return this;
				},
			});
		}

		return this._apiObject;
	}
}

interface InFlightChatRequest {
	requestId: string;
	extRequest: vscode.ChatRequest;
	extension: IRelaxedExtensionDescription;
}

export class ExtHostChatAgents2 extends Disposable implements ExtHostChatAgentsShape2 {

	private static _idPool = 0;

	private readonly _agents = new Map<number, ExtHostChatAgent>();
	private readonly _proxy: MainThreadChatAgentsShape2;

	private static _participantDetectionProviderIdPool = 0;
	private readonly _participantDetectionProviders = new Map<number, ExtHostParticipantDetector>();

	private static _relatedFilesProviderIdPool = 0;
	private readonly _relatedFilesProviders = new Map<number, ExtHostRelatedFilesProvider>();

	private static _customAgentsProviderIdPool = 0;
	private readonly _customAgentsProviders = new Map<number, { extension: IExtensionDescription; provider: vscode.CustomAgentsProvider }>();

	private readonly _sessionDisposables: DisposableResourceMap<DisposableStore> = this._register(new DisposableResourceMap());
	private readonly _completionDisposables: DisposableMap<number, DisposableStore> = this._register(new DisposableMap());

	private readonly _inFlightRequests = new Set<InFlightChatRequest>();

	private readonly _onDidChangeChatRequestTools = this._register(new Emitter<vscode.ChatRequest>());
	readonly onDidChangeChatRequestTools = this._onDidChangeChatRequestTools.event;

	private readonly _onDidDisposeChatSession = this._register(new Emitter<string>());
	readonly onDidDisposeChatSession = this._onDidDisposeChatSession.event;

	constructor(
		mainContext: IMainContext,
		private readonly _logService: ILogService,
		private readonly _commands: ExtHostCommands,
		private readonly _documents: ExtHostDocuments,
		private readonly _editorsAndDocuments: ExtHostDocumentsAndEditors,
		private readonly _languageModels: ExtHostLanguageModels,
		private readonly _diagnostics: ExtHostDiagnostics,
		private readonly _tools: ExtHostLanguageModelTools
	) {
		super();
		this._proxy = mainContext.getProxy(MainContext.MainThreadChatAgents2);

		_commands.registerArgumentProcessor({
			processArgument: (arg) => {
				// Don't send this argument to extension commands
				if (isChatViewTitleActionContext(arg)) {
					return null;
				}

				return arg;
			}
		});
	}

	transferActiveChat(newWorkspace: vscode.Uri): void {
		this._proxy.$transferActiveChatSession(newWorkspace);
	}

	createChatAgent(extension: IExtensionDescription, id: string, handler: vscode.ChatExtendedRequestHandler): vscode.ChatParticipant {
		const handle = ExtHostChatAgents2._idPool++;
		const agent = new ExtHostChatAgent(extension, id, this._proxy, handle, handler);
		this._agents.set(handle, agent);

		this._proxy.$registerAgent(handle, extension.identifier, id, {}, undefined);
		return agent.apiAgent;
	}

	createDynamicChatAgent(extension: IExtensionDescription, id: string, dynamicProps: vscode.DynamicChatParticipantProps, handler: vscode.ChatExtendedRequestHandler): vscode.ChatParticipant {
		const handle = ExtHostChatAgents2._idPool++;
		const agent = new ExtHostChatAgent(extension, id, this._proxy, handle, handler);
		this._agents.set(handle, agent);

		this._proxy.$registerAgent(handle, extension.identifier, id, { isSticky: true } satisfies IExtensionChatAgentMetadata, dynamicProps);
		return agent.apiAgent;
	}

	registerChatParticipantDetectionProvider(extension: IExtensionDescription, provider: vscode.ChatParticipantDetectionProvider): vscode.Disposable {
		const handle = ExtHostChatAgents2._participantDetectionProviderIdPool++;
		this._participantDetectionProviders.set(handle, new ExtHostParticipantDetector(extension, provider));
		this._proxy.$registerChatParticipantDetectionProvider(handle);
		return toDisposable(() => {
			this._participantDetectionProviders.delete(handle);
			this._proxy.$unregisterChatParticipantDetectionProvider(handle);
		});
	}

	registerRelatedFilesProvider(extension: IExtensionDescription, provider: vscode.ChatRelatedFilesProvider, metadata: vscode.ChatRelatedFilesProviderMetadata): vscode.Disposable {
		const handle = ExtHostChatAgents2._relatedFilesProviderIdPool++;
		this._relatedFilesProviders.set(handle, new ExtHostRelatedFilesProvider(extension, provider));
		this._proxy.$registerRelatedFilesProvider(handle, metadata);
		return toDisposable(() => {
			this._relatedFilesProviders.delete(handle);
			this._proxy.$unregisterRelatedFilesProvider(handle);
		});
	}

	registerCustomAgentsProvider(extension: IExtensionDescription, provider: vscode.CustomAgentsProvider): vscode.Disposable {
		const handle = ExtHostChatAgents2._customAgentsProviderIdPool++;
		this._customAgentsProviders.set(handle, { extension, provider });
		this._proxy.$registerCustomAgentsProvider(handle, extension.identifier);

		const disposables = new DisposableStore();

		// Listen to provider change events and notify main thread
		if (provider.onDidChangeCustomAgents) {
			disposables.add(provider.onDidChangeCustomAgents(() => {
				this._proxy.$onDidChangeCustomAgents(handle);
			}));
		}

		disposables.add(toDisposable(() => {
			this._customAgentsProviders.delete(handle);
			this._proxy.$unregisterCustomAgentsProvider(handle);
		}));

		return disposables;
	}

	async $provideRelatedFiles(handle: number, request: IChatRequestDraft, token: CancellationToken): Promise<Dto<IChatRelatedFile>[] | undefined> {
		const provider = this._relatedFilesProviders.get(handle);
		if (!provider) {
			return Promise.resolve([]);
		}

		const extRequestDraft = typeConvert.ChatRequestDraft.to(request);
		return await provider.provider.provideRelatedFiles(extRequestDraft, token) ?? undefined;
	}

	async $provideCustomAgents(handle: number, options: ICustomAgentQueryOptions, token: CancellationToken): Promise<IExternalCustomAgent[] | undefined> {
		const providerData = this._customAgentsProviders.get(handle);
		if (!providerData) {
			return Promise.resolve(undefined);
		}

		return await providerData.provider.provideCustomAgents(options, token) ?? undefined;
	}

	async $detectChatParticipant(handle: number, requestDto: Dto<IChatAgentRequest>, context: { history: IChatAgentHistoryEntryDto[] }, options: { location: ChatAgentLocation; participants?: vscode.ChatParticipantMetadata[] }, token: CancellationToken): Promise<vscode.ChatParticipantDetectionResult | null | undefined> {
		const detector = this._participantDetectionProviders.get(handle);
		if (!detector) {
			return undefined;
		}

		const { request, location, history } = await this._createRequest(requestDto, context, detector.extension);

		const model = await this.getModelForRequest(request, detector.extension);
		const extRequest = typeConvert.ChatAgentRequest.to(
			request,
			location,
			model,
			this.getDiagnosticsWhenEnabled(detector.extension),
			this.getToolsForRequest(detector.extension, request.userSelectedTools),
			detector.extension,
			this._logService);

		return detector.provider.provideParticipantDetection(
			extRequest,
			{ history },
			{ participants: options.participants, location: typeConvert.ChatLocation.to(options.location) },
			token
		);
	}

	private async _createRequest(requestDto: Dto<IChatAgentRequest>, context: { history: IChatAgentHistoryEntryDto[] }, extension: IExtensionDescription) {
		const request = revive<IChatAgentRequest>(requestDto);
		const convertedHistory = await this.prepareHistoryTurns(extension, request.agentId, context);

		// in-place converting for location-data
		let location: vscode.ChatRequestEditorData | vscode.ChatRequestNotebookData | undefined;
		if (request.locationData?.type === ChatAgentLocation.EditorInline) {
			// editor data
			const document = this._documents.getDocument(request.locationData.document);
			const editor = this._editorsAndDocuments.getEditor(request.locationData.id)!;
			location = new extHostTypes.ChatRequestEditorData(editor.value, document, typeConvert.Selection.to(request.locationData.selection), typeConvert.Range.to(request.locationData.wholeRange));

		} else if (request.locationData?.type === ChatAgentLocation.Notebook) {
			// notebook data
			const cell = this._documents.getDocument(request.locationData.sessionInputUri);
			location = new extHostTypes.ChatRequestNotebookData(cell);

		} else if (request.locationData?.type === ChatAgentLocation.Terminal) {
			// TBD
		}

		return { request, location, history: convertedHistory };
	}

	private async getModelForRequest(request: IChatAgentRequest, extension: IExtensionDescription): Promise<vscode.LanguageModelChat> {
		let model: vscode.LanguageModelChat | undefined;
		if (request.userSelectedModelId) {
			model = await this._languageModels.getLanguageModelByIdentifier(extension, request.userSelectedModelId);
		}
		if (!model) {
			model = await this._languageModels.getDefaultLanguageModel(extension);
			if (!model) {
				throw new Error('Language model unavailable');
			}
		}

		return model;
	}


	async $setRequestTools(requestId: string, tools: UserSelectedTools) {
		const request = [...this._inFlightRequests].find(r => r.requestId === requestId);
		if (!request) {
			return;
		}

		request.extRequest.tools.clear();
		for (const [k, v] of this.getToolsForRequest(request.extension, tools)) {
			request.extRequest.tools.set(k, v);
		}
		this._onDidChangeChatRequestTools.fire(request.extRequest);
	}

	async $invokeAgent(handle: number, requestDto: Dto<IChatAgentRequest>, context: { history: IChatAgentHistoryEntryDto[]; chatSessionContext?: IChatSessionContextDto }, token: CancellationToken): Promise<IChatAgentResult | undefined> {
		const agent = this._agents.get(handle);
		if (!agent) {
			throw new Error(`[CHAT](${handle}) CANNOT invoke agent because the agent is not registered`);
		}

		let stream: ChatAgentResponseStream | undefined;
		let inFlightRequest: InFlightChatRequest | undefined;

		try {
			const { request, location, history } = await this._createRequest(requestDto, context, agent.extension);

			// Init session disposables
			let sessionDisposables = this._sessionDisposables.get(request.sessionResource);
			if (!sessionDisposables) {
				sessionDisposables = new DisposableStore();
				this._sessionDisposables.set(request.sessionResource, sessionDisposables);
			}

			stream = new ChatAgentResponseStream(agent.extension, request, this._proxy, this._commands.converter, sessionDisposables);

			const model = await this.getModelForRequest(request, agent.extension);
			const extRequest = typeConvert.ChatAgentRequest.to(
				request,
				location,
				model,
				this.getDiagnosticsWhenEnabled(agent.extension),
				this.getToolsForRequest(agent.extension, request.userSelectedTools),
				agent.extension,
				this._logService
			);
			inFlightRequest = { requestId: requestDto.requestId, extRequest, extension: agent.extension };
			this._inFlightRequests.add(inFlightRequest);


			// If this request originates from a contributed chat session editor, attempt to resolve the ChatSession API object
			let chatSessionContext: vscode.ChatSessionContext | undefined;
			if (context.chatSessionContext) {
				chatSessionContext = {
					chatSessionItem: {
						resource: URI.revive(context.chatSessionContext.chatSessionResource),
						label: context.chatSessionContext.isUntitled ? 'Untitled Session' : 'Session',
					},
					isUntitled: context.chatSessionContext.isUntitled,
				};
			}

			const chatContext: vscode.ChatContext = { history, chatSessionContext };
			const task = agent.invoke(
				extRequest,
				chatContext,
				stream.apiObject,
				token
			);

			return await raceCancellationWithTimeout(1000, Promise.resolve(task).then((result) => {
				if (result?.metadata) {
					try {
						JSON.stringify(result.metadata);
					} catch (err) {
						const msg = `result.metadata MUST be JSON.stringify-able. Got error: ${err.message}`;
						this._logService.error(`[${agent.extension.identifier.value}] [@${agent.id}] ${msg}`, agent.extension);
						return { errorDetails: { message: msg }, timings: stream?.timings, nextQuestion: result.nextQuestion, };
					}
				}
				let errorDetails: IChatResponseErrorDetails | undefined;
				if (result?.errorDetails) {
					errorDetails = {
						...result.errorDetails,
						responseIsIncomplete: true
					};
				}
				if (errorDetails?.responseIsRedacted || errorDetails?.isQuotaExceeded || errorDetails?.isRateLimited || errorDetails?.confirmationButtons || errorDetails?.code) {
					checkProposedApiEnabled(agent.extension, 'chatParticipantPrivate');
				}

				return { errorDetails, timings: stream?.timings, metadata: result?.metadata, nextQuestion: result?.nextQuestion, details: result?.details } satisfies IChatAgentResult;
			}), token);
		} catch (e) {
			this._logService.error(e, agent.extension);

			if (e instanceof extHostTypes.LanguageModelError && e.cause) {
				e = e.cause;
			}

			const isQuotaExceeded = e instanceof Error && e.name === 'ChatQuotaExceeded';
			const isRateLimited = e instanceof Error && e.name === 'ChatRateLimited';
			return { errorDetails: { message: toErrorMessage(e), responseIsIncomplete: true, isQuotaExceeded, isRateLimited } };

		} finally {
			if (inFlightRequest) {
				this._inFlightRequests.delete(inFlightRequest);
			}
			stream?.close();
		}
	}

	private getDiagnosticsWhenEnabled(extension: Readonly<IRelaxedExtensionDescription>) {
		if (!isProposedApiEnabled(extension, 'chatReferenceDiagnostic')) {
			return [];
		}
		return this._diagnostics.getDiagnostics();
	}

	private getToolsForRequest(extension: IExtensionDescription, tools: UserSelectedTools | undefined): Map<string, boolean> {
		if (!tools) {
			return new Map();
		}
		const result = new Map<string, boolean>();
		for (const tool of this._tools.getTools(extension)) {
			if (typeof tools[tool.name] === 'boolean') {
				result.set(tool.name, tools[tool.name]);
			}
		}
		return result;
	}

	private async prepareHistoryTurns(extension: Readonly<IRelaxedExtensionDescription>, agentId: string, context: { history: IChatAgentHistoryEntryDto[] }): Promise<(vscode.ChatRequestTurn | vscode.ChatResponseTurn)[]> {
		const res: (vscode.ChatRequestTurn | vscode.ChatResponseTurn)[] = [];

		for (const h of context.history) {
			const ehResult = typeConvert.ChatAgentResult.to(h.result);
			const result: vscode.ChatResult = agentId === h.request.agentId ?
				ehResult :
				{ ...ehResult, metadata: undefined };

			// REQUEST turn
			const varsWithoutTools: vscode.ChatPromptReference[] = [];
			const toolReferences: vscode.ChatLanguageModelToolReference[] = [];
			for (const v of h.request.variables.variables) {
				if (v.kind === 'tool') {
					toolReferences.push(typeConvert.ChatLanguageModelToolReference.to(v));
				} else if (v.kind === 'toolset') {
					toolReferences.push(...v.value.map(typeConvert.ChatLanguageModelToolReference.to));
				} else {
					const ref = typeConvert.ChatPromptReference.to(v, this.getDiagnosticsWhenEnabled(extension), this._logService);
					if (ref) {
						varsWithoutTools.push(ref);
					}
				}
			}

			const editedFileEvents = isProposedApiEnabled(extension, 'chatParticipantPrivate') ? h.request.editedFileEvents : undefined;
			const turn = new extHostTypes.ChatRequestTurn(h.request.message, h.request.command, varsWithoutTools, h.request.agentId, toolReferences, editedFileEvents, h.request.requestId);
			res.push(turn);

			// RESPONSE turn
			const parts = coalesce(h.response.map(r => typeConvert.ChatResponsePart.toContent(r, this._commands.converter)));
			res.push(new extHostTypes.ChatResponseTurn(parts, result, h.request.agentId, h.request.command));
		}

		return res;
	}

	$releaseSession(sessionResourceDto: UriComponents): void {
		const sessionResource = URI.revive(sessionResourceDto);
		this._sessionDisposables.deleteAndDispose(sessionResource);
		const sessionId = LocalChatSessionUri.parseLocalSessionId(sessionResource);
		if (sessionId) {
			this._onDidDisposeChatSession.fire(sessionId);
		}
	}

	async $provideFollowups(requestDto: Dto<IChatAgentRequest>, handle: number, result: IChatAgentResult, context: { history: IChatAgentHistoryEntryDto[] }, token: CancellationToken): Promise<IChatFollowup[]> {
		const agent = this._agents.get(handle);
		if (!agent) {
			return Promise.resolve([]);
		}

		const request = revive<IChatAgentRequest>(requestDto);
		const convertedHistory = await this.prepareHistoryTurns(agent.extension, agent.id, context);

		const ehResult = typeConvert.ChatAgentResult.to(result);
		return (await agent.provideFollowups(ehResult, { history: convertedHistory }, token))
			.filter(f => {
				// The followup must refer to a participant that exists from the same extension
				const isValid = !f.participant || Iterable.some(
					this._agents.values(),
					a => a.id === f.participant && ExtensionIdentifier.equals(a.extension.identifier, agent.extension.identifier));
				if (!isValid) {
					this._logService.warn(`[@${agent.id}] ChatFollowup refers to an unknown participant: ${f.participant}`);
				}
				return isValid;
			})
			.map(f => typeConvert.ChatFollowup.from(f, request));
	}

	$acceptFeedback(handle: number, result: IChatAgentResult, voteAction: IChatVoteAction): void {
		const agent = this._agents.get(handle);
		if (!agent) {
			return;
		}

		const ehResult = typeConvert.ChatAgentResult.to(result);
		let kind: extHostTypes.ChatResultFeedbackKind;
		switch (voteAction.direction) {
			case ChatAgentVoteDirection.Down:
				kind = extHostTypes.ChatResultFeedbackKind.Unhelpful;
				break;
			case ChatAgentVoteDirection.Up:
				kind = extHostTypes.ChatResultFeedbackKind.Helpful;
				break;
		}

		const feedback: vscode.ChatResultFeedback = {
			result: ehResult,
			kind,
			unhelpfulReason: isProposedApiEnabled(agent.extension, 'chatParticipantAdditions') ? voteAction.reason : undefined,
		};
		agent.acceptFeedback(Object.freeze(feedback));
	}

	$acceptAction(handle: number, result: IChatAgentResult, event: IChatUserActionEvent): void {
		const agent = this._agents.get(handle);
		if (!agent) {
			return;
		}
		if (event.action.kind === 'vote') {
			// handled by $acceptFeedback
			return;
		}

		const ehAction = typeConvert.ChatAgentUserActionEvent.to(result, event, this._commands.converter);
		if (ehAction) {
			agent.acceptAction(Object.freeze(ehAction));
		}
	}

	async $invokeCompletionProvider(handle: number, query: string, token: CancellationToken): Promise<IChatAgentCompletionItem[]> {
		const agent = this._agents.get(handle);
		if (!agent) {
			return [];
		}

		let disposables = this._completionDisposables.get(handle);
		if (disposables) {
			// Clear any disposables from the last invocation of this completion provider
			disposables.clear();
		} else {
			disposables = new DisposableStore();
			this._completionDisposables.set(handle, disposables);
		}

		const items = await agent.invokeCompletionProvider(query, token);

		return items.map((i) => typeConvert.ChatAgentCompletionItem.from(i, this._commands.converter, disposables));
	}

	async $provideChatTitle(handle: number, context: IChatAgentHistoryEntryDto[], token: CancellationToken): Promise<string | undefined> {
		const agent = this._agents.get(handle);
		if (!agent) {
			return;
		}

		const history = await this.prepareHistoryTurns(agent.extension, agent.id, { history: context });
		return await agent.provideTitle({ history }, token);
	}

	async $provideChatSummary(handle: number, context: IChatAgentHistoryEntryDto[], token: CancellationToken): Promise<string | undefined> {
		const agent = this._agents.get(handle);
		if (!agent) {
			return;
		}

		const history = await this.prepareHistoryTurns(agent.extension, agent.id, { history: context });
		return await agent.provideSummary({ history }, token);
	}
}

class ExtHostParticipantDetector {
	constructor(
		public readonly extension: IExtensionDescription,
		public readonly provider: vscode.ChatParticipantDetectionProvider,
	) { }
}

class ExtHostRelatedFilesProvider {
	constructor(
		public readonly extension: IExtensionDescription,
		public readonly provider: vscode.ChatRelatedFilesProvider,
	) { }
}

class ExtHostChatAgent {

	private _followupProvider: vscode.ChatFollowupProvider | undefined;
	private _iconPath: vscode.Uri | { light: vscode.Uri; dark: vscode.Uri } | vscode.ThemeIcon | undefined;
	private _helpTextPrefix: string | vscode.MarkdownString | undefined;
	private _helpTextPostfix: string | vscode.MarkdownString | undefined;
	private _onDidReceiveFeedback = new Emitter<vscode.ChatResultFeedback>();
	private _onDidPerformAction = new Emitter<vscode.ChatUserActionEvent>();
	private _supportIssueReporting: boolean | undefined;
	private _agentVariableProvider?: { provider: vscode.ChatParticipantCompletionItemProvider; triggerCharacters: string[] };
	private _additionalWelcomeMessage?: string | vscode.MarkdownString | undefined;
	private _titleProvider?: vscode.ChatTitleProvider | undefined;
	private _summarizer?: vscode.ChatSummarizer | undefined;
	private _pauseStateEmitter = new Emitter<vscode.ChatParticipantPauseStateEvent>();

	constructor(
		public readonly extension: IExtensionDescription,
		public readonly id: string,
		private readonly _proxy: MainThreadChatAgentsShape2,
		private readonly _handle: number,
		private _requestHandler: vscode.ChatExtendedRequestHandler,
	) { }

	acceptFeedback(feedback: vscode.ChatResultFeedback) {
		this._onDidReceiveFeedback.fire(feedback);
	}

	acceptAction(event: vscode.ChatUserActionEvent) {
		this._onDidPerformAction.fire(event);
	}

	setChatRequestPauseState(pauseState: vscode.ChatParticipantPauseStateEvent) {
		this._pauseStateEmitter.fire(pauseState);
	}

	async invokeCompletionProvider(query: string, token: CancellationToken): Promise<vscode.ChatCompletionItem[]> {
		if (!this._agentVariableProvider) {
			return [];
		}

		return await this._agentVariableProvider.provider.provideCompletionItems(query, token) ?? [];
	}

	async provideFollowups(result: vscode.ChatResult, context: vscode.ChatContext, token: CancellationToken): Promise<vscode.ChatFollowup[]> {
		if (!this._followupProvider) {
			return [];
		}

		const followups = await this._followupProvider.provideFollowups(result, context, token);
		if (!followups) {
			return [];
		}
		return followups
			// Filter out "command followups" from older providers
			.filter(f => !(f && 'commandId' in f))
			// Filter out followups from older providers before 'message' changed to 'prompt'
			.filter(f => !(f && 'message' in f));
	}

	async provideTitle(context: vscode.ChatContext, token: CancellationToken): Promise<string | undefined> {
		if (!this._titleProvider) {
			return;
		}

		return await this._titleProvider.provideChatTitle(context, token) ?? undefined;
	}

	async provideSummary(context: vscode.ChatContext, token: CancellationToken): Promise<string | undefined> {
		if (!this._summarizer) {
			return;
		}

		return await this._summarizer.provideChatSummary(context, token) ?? undefined;
	}

	get apiAgent(): vscode.ChatParticipant {
		let disposed = false;
		let updateScheduled = false;
		const updateMetadataSoon = () => {
			if (disposed) {
				return;
			}
			if (updateScheduled) {
				return;
			}
			updateScheduled = true;
			queueMicrotask(() => {
				this._proxy.$updateAgent(this._handle, {
					icon: !this._iconPath ? undefined :
						this._iconPath instanceof URI ? this._iconPath :
							'light' in this._iconPath ? this._iconPath.light :
								undefined,
					iconDark: !this._iconPath ? undefined :
						'dark' in this._iconPath ? this._iconPath.dark :
							undefined,
					themeIcon: this._iconPath instanceof extHostTypes.ThemeIcon ? this._iconPath : undefined,
					hasFollowups: this._followupProvider !== undefined,
					helpTextPrefix: (!this._helpTextPrefix || typeof this._helpTextPrefix === 'string') ? this._helpTextPrefix : typeConvert.MarkdownString.from(this._helpTextPrefix),
					helpTextPostfix: (!this._helpTextPostfix || typeof this._helpTextPostfix === 'string') ? this._helpTextPostfix : typeConvert.MarkdownString.from(this._helpTextPostfix),
					supportIssueReporting: this._supportIssueReporting,
					additionalWelcomeMessage: (!this._additionalWelcomeMessage || typeof this._additionalWelcomeMessage === 'string') ? this._additionalWelcomeMessage : typeConvert.MarkdownString.from(this._additionalWelcomeMessage),
				});
				updateScheduled = false;
			});
		};

		const that = this;
		return {
			get id() {
				return that.id;
			},
			get iconPath() {
				return that._iconPath;
			},
			set iconPath(v) {
				that._iconPath = v;
				updateMetadataSoon();
			},
			get requestHandler() {
				return that._requestHandler;
			},
			set requestHandler(v) {
				assertType(typeof v === 'function', 'Invalid request handler');
				that._requestHandler = v;
			},
			get followupProvider() {
				return that._followupProvider;
			},
			set followupProvider(v) {
				that._followupProvider = v;
				updateMetadataSoon();
			},
			get helpTextPrefix() {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				return that._helpTextPrefix;
			},
			set helpTextPrefix(v) {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				that._helpTextPrefix = v;
				updateMetadataSoon();
			},
			get helpTextPostfix() {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				return that._helpTextPostfix;
			},
			set helpTextPostfix(v) {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				that._helpTextPostfix = v;
				updateMetadataSoon();
			},
			get supportIssueReporting() {
				checkProposedApiEnabled(that.extension, 'chatParticipantPrivate');
				return that._supportIssueReporting;
			},
			set supportIssueReporting(v) {
				checkProposedApiEnabled(that.extension, 'chatParticipantPrivate');
				that._supportIssueReporting = v;
				updateMetadataSoon();
			},
			get onDidReceiveFeedback() {
				return that._onDidReceiveFeedback.event;
			},
			set participantVariableProvider(v) {
				checkProposedApiEnabled(that.extension, 'chatParticipantAdditions');
				that._agentVariableProvider = v;
				if (v) {
					if (!v.triggerCharacters.length) {
						throw new Error('triggerCharacters are required');
					}

					that._proxy.$registerAgentCompletionsProvider(that._handle, that.id, v.triggerCharacters);
				} else {
					that._proxy.$unregisterAgentCompletionsProvider(that._handle, that.id);
				}
			},
			get participantVariableProvider() {
				checkProposedApiEnabled(that.extension, 'chatParticipantAdditions');
				return that._agentVariableProvider;
			},
			set additionalWelcomeMessage(v) {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				that._additionalWelcomeMessage = v;
				updateMetadataSoon();
			},
			get additionalWelcomeMessage() {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				return that._additionalWelcomeMessage;
			},
			set titleProvider(v) {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				that._titleProvider = v;
				updateMetadataSoon();
			},
			get titleProvider() {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				return that._titleProvider;
			},
			set summarizer(v) {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				that._summarizer = v;
			},
			get summarizer() {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				return that._summarizer;
			},
			get onDidChangePauseState() {
				checkProposedApiEnabled(that.extension, 'chatParticipantAdditions');
				return that._pauseStateEmitter.event;
			},
			onDidPerformAction: !isProposedApiEnabled(this.extension, 'chatParticipantAdditions')
				? undefined!
				: this._onDidPerformAction.event
			,
			dispose() {
				disposed = true;
				that._followupProvider = undefined;
				that._onDidReceiveFeedback.dispose();
				that._proxy.$unregisterAgent(that._handle);
			},
		} satisfies vscode.ChatParticipant;
	}

	invoke(request: vscode.ChatRequest, context: vscode.ChatContext, response: vscode.ChatResponseStream, token: CancellationToken): vscode.ProviderResult<vscode.ChatResult | void> {
		return this._requestHandler(request, context, response, token);
	}
}

/**
 * raceCancellation, but give the promise a little time to complete to see if we can get a real result quickly.
 */
function raceCancellationWithTimeout<T>(cancelWait: number, promise: Promise<T>, token: CancellationToken): Promise<T | undefined> {
	return new Promise((resolve, reject) => {
		const ref = token.onCancellationRequested(async () => {
			ref.dispose();
			await timeout(cancelWait);
			resolve(undefined);
		});
		promise.then(resolve, reject).finally(() => ref.dispose());
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostChatContext.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostChatContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { ExtHostChatContextShape, MainContext, MainThreadChatContextShape } from './extHost.protocol.js';
import { DocumentSelector } from './extHostTypeConverters.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { IChatContextItem } from '../../contrib/chat/common/chatContext.js';
import { Disposable, DisposableStore } from '../../../base/common/lifecycle.js';

export class ExtHostChatContext extends Disposable implements ExtHostChatContextShape {
	declare _serviceBrand: undefined;

	private _proxy: MainThreadChatContextShape;
	private _handlePool: number = 0;
	private _providers: Map<number, { provider: vscode.ChatContextProvider; disposables: DisposableStore }> = new Map();
	private _itemPool: number = 0;
	private _items: Map<number, Map<number, vscode.ChatContextItem>> = new Map(); // handle -> itemHandle -> item

	constructor(@IExtHostRpcService extHostRpc: IExtHostRpcService,
	) {
		super();
		this._proxy = extHostRpc.getProxy(MainContext.MainThreadChatContext);
	}

	async $provideChatContext(handle: number, token: CancellationToken): Promise<IChatContextItem[]> {
		this._items.delete(handle); // clear previous items
		const provider = this._getProvider(handle);
		if (!provider.provideChatContextExplicit) {
			throw new Error('provideChatContext not implemented');
		}
		const result = (await provider.provideChatContextExplicit!(token)) ?? [];
		const items: IChatContextItem[] = [];
		for (const item of result) {
			const itemHandle = this._addTrackedItem(handle, item);
			items.push({
				handle: itemHandle,
				icon: item.icon,
				label: item.label,
				modelDescription: item.modelDescription,
				value: item.value
			});
		}
		return items;
	}

	private _addTrackedItem(handle: number, item: vscode.ChatContextItem): number {
		const itemHandle = this._itemPool++;
		if (!this._items.has(handle)) {
			this._items.set(handle, new Map());
		}
		this._items.get(handle)!.set(itemHandle, item);
		return itemHandle;
	}

	async $provideChatContextForResource(handle: number, options: { resource: UriComponents; withValue: boolean }, token: CancellationToken): Promise<IChatContextItem | undefined> {
		const provider = this._getProvider(handle);

		if (!provider.provideChatContextForResource) {
			throw new Error('provideChatContextForResource not implemented');
		}

		const result = await provider.provideChatContextForResource({ resource: URI.revive(options.resource) }, token);
		if (!result) {
			return undefined;
		}
		const itemHandle = this._addTrackedItem(handle, result);

		const item: IChatContextItem | undefined = {
			handle: itemHandle,
			icon: result.icon,
			label: result.label,
			modelDescription: result.modelDescription,
			value: options.withValue ? result.value : undefined
		};
		if (options.withValue && !item.value && provider.resolveChatContext) {
			const resolved = await provider.resolveChatContext(result, token);
			item.value = resolved?.value;
		}

		return item;
	}

	private async _doResolve(provider: vscode.ChatContextProvider, context: IChatContextItem, extItem: vscode.ChatContextItem, token: CancellationToken): Promise<IChatContextItem> {
		const extResult = await provider.resolveChatContext(extItem, token);
		const result = extResult ?? context;
		return {
			handle: context.handle,
			icon: result.icon,
			label: result.label,
			modelDescription: result.modelDescription,
			value: result.value
		};
	}

	async $resolveChatContext(handle: number, context: IChatContextItem, token: CancellationToken): Promise<IChatContextItem> {
		const provider = this._getProvider(handle);

		if (!provider.resolveChatContext) {
			throw new Error('resolveChatContext not implemented');
		}
		const extItem = this._items.get(handle)?.get(context.handle);
		if (!extItem) {
			throw new Error('Chat context item not found');
		}
		return this._doResolve(provider, context, extItem, token);
	}

	registerChatContextProvider(selector: vscode.DocumentSelector | undefined, id: string, provider: vscode.ChatContextProvider): vscode.Disposable {
		const handle = this._handlePool++;
		const disposables = new DisposableStore();
		this._listenForWorkspaceContextChanges(handle, provider, disposables);
		this._providers.set(handle, { provider, disposables });
		this._proxy.$registerChatContextProvider(handle, `${id}`, selector ? DocumentSelector.from(selector) : undefined, {}, { supportsResource: !!provider.provideChatContextForResource, supportsResolve: !!provider.resolveChatContext });

		return {
			dispose: () => {
				this._providers.delete(handle);
				this._proxy.$unregisterChatContextProvider(handle);
				disposables.dispose();
			}
		};
	}

	private _listenForWorkspaceContextChanges(handle: number, provider: vscode.ChatContextProvider, disposables: DisposableStore): void {
		if (!provider.onDidChangeWorkspaceChatContext || !provider.provideWorkspaceChatContext) {
			return;
		}
		disposables.add(provider.onDidChangeWorkspaceChatContext(async () => {
			const workspaceContexts = await provider.provideWorkspaceChatContext!(CancellationToken.None);
			const resolvedContexts: IChatContextItem[] = [];
			for (const item of workspaceContexts ?? []) {
				const contextItem: IChatContextItem = {
					icon: item.icon,
					label: item.label,
					modelDescription: item.modelDescription,
					value: item.value,
					handle: this._itemPool++
				};
				const resolved = await this._doResolve(provider, contextItem, item, CancellationToken.None);
				resolvedContexts.push(resolved);
			}

			this._proxy.$updateWorkspaceContextItems(handle, resolvedContexts);
		}));
	}

	private _getProvider(handle: number): vscode.ChatContextProvider {
		if (!this._providers.has(handle)) {
			throw new Error('Chat context provider not found');
		}
		return this._providers.get(handle)!.provider;
	}

	public override dispose(): void {
		super.dispose();
		for (const { disposables } of this._providers.values()) {
			disposables.dispose();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostChatOutputRenderer.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostChatOutputRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { ExtHostChatOutputRendererShape, IMainContext, MainContext, MainThreadChatOutputRendererShape } from './extHost.protocol.js';
import { Disposable } from './extHostTypes.js';
import { ExtHostWebviews } from './extHostWebview.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { VSBuffer } from '../../../base/common/buffer.js';

export class ExtHostChatOutputRenderer implements ExtHostChatOutputRendererShape {

	private readonly _proxy: MainThreadChatOutputRendererShape;

	private readonly _renderers = new Map</*viewType*/ string, {
		readonly renderer: vscode.ChatOutputRenderer;
		readonly extension: IExtensionDescription;
	}>();

	constructor(
		mainContext: IMainContext,
		private readonly webviews: ExtHostWebviews,
	) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadChatOutputRenderer);
	}

	registerChatOutputRenderer(extension: IExtensionDescription, viewType: string, renderer: vscode.ChatOutputRenderer): vscode.Disposable {
		if (this._renderers.has(viewType)) {
			throw new Error(`Chat output renderer already registered for: ${viewType}`);
		}

		this._renderers.set(viewType, { extension, renderer });
		this._proxy.$registerChatOutputRenderer(viewType, extension.identifier, extension.extensionLocation);

		return new Disposable(() => {
			this._renderers.delete(viewType);
			this._proxy.$unregisterChatOutputRenderer(viewType);
		});
	}

	async $renderChatOutput(viewType: string, mime: string, valueData: VSBuffer, webviewHandle: string, token: CancellationToken): Promise<void> {
		const entry = this._renderers.get(viewType);
		if (!entry) {
			throw new Error(`No chat output renderer registered for: ${viewType}`);
		}

		const webview = this.webviews.createNewWebview(webviewHandle, {}, entry.extension);
		return entry.renderer.renderChatOutput(Object.freeze({ mime, value: valueData.buffer }), webview, {}, token);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostChatSessions.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostChatSessions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { coalesce } from '../../../base/common/arrays.js';
import { CancellationToken, CancellationTokenSource } from '../../../base/common/cancellation.js';
import { CancellationError } from '../../../base/common/errors.js';
import { Disposable, DisposableStore } from '../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../base/common/map.js';
import { revive } from '../../../base/common/marshalling.js';
import { MarshalledId } from '../../../base/common/marshallingIds.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { IChatAgentRequest, IChatAgentResult } from '../../contrib/chat/common/chatAgents.js';
import { ChatSessionStatus, IChatSessionItem, IChatSessionProviderOptionItem } from '../../contrib/chat/common/chatSessionsService.js';
import { ChatAgentLocation } from '../../contrib/chat/common/constants.js';
import { Proxied } from '../../services/extensions/common/proxyIdentifier.js';
import { ChatSessionDto, ExtHostChatSessionsShape, IChatAgentProgressShape, IChatSessionProviderOptions, MainContext, MainThreadChatSessionsShape } from './extHost.protocol.js';
import { ChatAgentResponseStream } from './extHostChatAgents2.js';
import { CommandsConverter, ExtHostCommands } from './extHostCommands.js';
import { ExtHostLanguageModels } from './extHostLanguageModels.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import * as typeConvert from './extHostTypeConverters.js';
import * as extHostTypes from './extHostTypes.js';
import { IChatRequestVariableEntry, IDiagnosticVariableEntryFilterData, IPromptFileVariableEntry, ISymbolVariableEntry, PromptFileVariableKind } from '../../contrib/chat/common/chatVariableEntries.js';
import { basename } from '../../../base/common/resources.js';
import { Diagnostic } from './extHostTypeConverters.js';
import { SymbolKind, SymbolKinds } from '../../../editor/common/languages.js';

class ExtHostChatSession {
	private _stream: ChatAgentResponseStream;

	constructor(
		public readonly session: vscode.ChatSession,
		public readonly extension: IExtensionDescription,
		request: IChatAgentRequest,
		public readonly proxy: IChatAgentProgressShape,
		public readonly commandsConverter: CommandsConverter,
		public readonly sessionDisposables: DisposableStore
	) {
		this._stream = new ChatAgentResponseStream(extension, request, proxy, commandsConverter, sessionDisposables);
	}

	get activeResponseStream() {
		return this._stream;
	}

	getActiveRequestStream(request: IChatAgentRequest) {
		return new ChatAgentResponseStream(this.extension, request, this.proxy, this.commandsConverter, this.sessionDisposables);
	}
}

export class ExtHostChatSessions extends Disposable implements ExtHostChatSessionsShape {
	private static _sessionHandlePool = 0;

	private readonly _proxy: Proxied<MainThreadChatSessionsShape>;
	private readonly _chatSessionItemProviders = new Map<number, {
		readonly sessionType: string;
		readonly provider: vscode.ChatSessionItemProvider;
		readonly extension: IExtensionDescription;
		readonly disposable: DisposableStore;
	}>();
	private readonly _chatSessionContentProviders = new Map<number, {
		readonly provider: vscode.ChatSessionContentProvider;
		readonly extension: IExtensionDescription;
		readonly capabilities?: vscode.ChatSessionCapabilities;
		readonly disposable: DisposableStore;
	}>();
	private _nextChatSessionItemProviderHandle = 0;
	private _nextChatSessionContentProviderHandle = 0;

	/**
	 * Map of uri -> chat session items
	 *
	 * TODO: this isn't cleared/updated properly
	 */
	private readonly _sessionItems = new ResourceMap<vscode.ChatSessionItem>();

	/**
	 * Map of uri -> chat sessions infos
	 */
	private readonly _extHostChatSessions = new ResourceMap<{ readonly sessionObj: ExtHostChatSession; readonly disposeCts: CancellationTokenSource }>();


	constructor(
		private readonly commands: ExtHostCommands,
		private readonly _languageModels: ExtHostLanguageModels,
		@IExtHostRpcService private readonly _extHostRpc: IExtHostRpcService,
		@ILogService private readonly _logService: ILogService,
	) {
		super();
		this._proxy = this._extHostRpc.getProxy(MainContext.MainThreadChatSessions);

		commands.registerArgumentProcessor({
			processArgument: (arg) => {
				if (arg && arg.$mid === MarshalledId.AgentSessionContext) {
					const id = arg.session.resource || arg.sessionId;
					const sessionContent = this._sessionItems.get(id);
					if (sessionContent) {
						return sessionContent;
					} else {
						this._logService.warn(`No chat session found for ID: ${id}`);
						return arg;
					}
				}

				return arg;
			}
		});
	}

	registerChatSessionItemProvider(extension: IExtensionDescription, chatSessionType: string, provider: vscode.ChatSessionItemProvider): vscode.Disposable {
		const handle = this._nextChatSessionItemProviderHandle++;
		const disposables = new DisposableStore();

		this._chatSessionItemProviders.set(handle, { provider, extension, disposable: disposables, sessionType: chatSessionType });
		this._proxy.$registerChatSessionItemProvider(handle, chatSessionType);
		if (provider.onDidChangeChatSessionItems) {
			disposables.add(provider.onDidChangeChatSessionItems(() => {
				this._proxy.$onDidChangeChatSessionItems(handle);
			}));
		}
		if (provider.onDidCommitChatSessionItem) {
			disposables.add(provider.onDidCommitChatSessionItem((e) => {
				const { original, modified } = e;
				this._proxy.$onDidCommitChatSessionItem(handle, original.resource, modified.resource);
			}));
		}
		return {
			dispose: () => {
				this._chatSessionItemProviders.delete(handle);
				disposables.dispose();
				this._proxy.$unregisterChatSessionItemProvider(handle);
			}
		};
	}

	registerChatSessionContentProvider(extension: IExtensionDescription, chatSessionScheme: string, chatParticipant: vscode.ChatParticipant, provider: vscode.ChatSessionContentProvider, capabilities?: vscode.ChatSessionCapabilities): vscode.Disposable {
		const handle = this._nextChatSessionContentProviderHandle++;
		const disposables = new DisposableStore();

		this._chatSessionContentProviders.set(handle, { provider, extension, capabilities, disposable: disposables });
		this._proxy.$registerChatSessionContentProvider(handle, chatSessionScheme);

		if (provider.onDidChangeChatSessionOptions) {
			disposables.add(provider.onDidChangeChatSessionOptions(evt => {
				this._proxy.$onDidChangeChatSessionOptions(handle, evt.resource, evt.updates);
			}));
		}

		return new extHostTypes.Disposable(() => {
			this._chatSessionContentProviders.delete(handle);
			disposables.dispose();
			this._proxy.$unregisterChatSessionContentProvider(handle);
		});
	}

	private convertChatSessionStatus(status: vscode.ChatSessionStatus | undefined): ChatSessionStatus | undefined {
		if (status === undefined) {
			return undefined;
		}

		switch (status) {
			case 0: // vscode.ChatSessionStatus.Failed
				return ChatSessionStatus.Failed;
			case 1: // vscode.ChatSessionStatus.Completed
				return ChatSessionStatus.Completed;
			case 2: // vscode.ChatSessionStatus.InProgress
				return ChatSessionStatus.InProgress;
			// Need to support NeedsInput status if we ever export it to the extension API
			default:
				return undefined;
		}
	}

	private convertChatSessionItem(sessionType: string, sessionContent: vscode.ChatSessionItem): IChatSessionItem {
		return {
			resource: sessionContent.resource,
			label: sessionContent.label,
			description: sessionContent.description ? typeConvert.MarkdownString.from(sessionContent.description) : undefined,
			badge: sessionContent.badge ? typeConvert.MarkdownString.from(sessionContent.badge) : undefined,
			status: this.convertChatSessionStatus(sessionContent.status),
			tooltip: typeConvert.MarkdownString.fromStrict(sessionContent.tooltip),
			timing: {
				startTime: sessionContent.timing?.startTime ?? 0,
				endTime: sessionContent.timing?.endTime
			},
			changes: sessionContent.changes instanceof Array
				? sessionContent.changes :
				(sessionContent.changes && {
					files: sessionContent.changes?.files ?? 0,
					insertions: sessionContent.changes?.insertions ?? 0,
					deletions: sessionContent.changes?.deletions ?? 0,
				}),
		};
	}

	async $provideNewChatSessionItem(handle: number, options: { request: IChatAgentRequest; metadata?: any }, token: CancellationToken): Promise<IChatSessionItem> {
		const entry = this._chatSessionItemProviders.get(handle);
		if (!entry || !entry.provider.provideNewChatSessionItem) {
			throw new Error(`No provider registered for handle ${handle} or provider does not support creating sessions`);
		}

		try {
			const model = await this.getModelForRequest(options.request, entry.extension);
			const vscodeRequest = typeConvert.ChatAgentRequest.to(
				revive(options.request),
				undefined,
				model,
				[],
				new Map(),
				entry.extension,
				this._logService);

			const vscodeOptions = {
				request: vscodeRequest,
				metadata: options.metadata
			};

			const chatSessionItem = await entry.provider.provideNewChatSessionItem(vscodeOptions, token);
			if (!chatSessionItem) {
				throw new Error('Provider did not create session');
			}

			this._sessionItems.set(chatSessionItem.resource, chatSessionItem);
			return this.convertChatSessionItem(entry.sessionType, chatSessionItem);
		} catch (error) {
			this._logService.error(`Error creating chat session: ${error}`);
			throw error;
		}
	}

	async $provideChatSessionItems(handle: number, token: vscode.CancellationToken): Promise<IChatSessionItem[]> {
		const entry = this._chatSessionItemProviders.get(handle);
		if (!entry) {
			this._logService.error(`No provider registered for handle ${handle}`);
			return [];
		}

		const sessions = await entry.provider.provideChatSessionItems(token);
		if (!sessions) {
			return [];
		}

		const response: IChatSessionItem[] = [];
		for (const sessionContent of sessions) {
			this._sessionItems.set(sessionContent.resource, sessionContent);
			response.push(this.convertChatSessionItem(entry.sessionType, sessionContent));
		}
		return response;
	}

	async $provideChatSessionContent(handle: number, sessionResourceComponents: UriComponents, token: CancellationToken): Promise<ChatSessionDto> {
		const provider = this._chatSessionContentProviders.get(handle);
		if (!provider) {
			throw new Error(`No provider for handle ${handle}`);
		}

		const sessionResource = URI.revive(sessionResourceComponents);

		const session = await provider.provider.provideChatSessionContent(sessionResource, token);
		if (token.isCancellationRequested) {
			throw new CancellationError();
		}

		const sessionDisposables = new DisposableStore();
		const sessionId = ExtHostChatSessions._sessionHandlePool++;
		const id = sessionResource.toString();
		const chatSession = new ExtHostChatSession(session, provider.extension, {
			sessionResource,
			requestId: 'ongoing',
			agentId: id,
			message: '',
			variables: { variables: [] },
			location: ChatAgentLocation.Chat,
		}, {
			$handleProgressChunk: (requestId, chunks) => {
				return this._proxy.$handleProgressChunk(handle, sessionResource, requestId, chunks);
			},
			$handleAnchorResolve: (requestId, requestHandle, anchor) => {
				this._proxy.$handleAnchorResolve(handle, sessionResource, requestId, requestHandle, anchor);
			},
		}, this.commands.converter, sessionDisposables);

		const disposeCts = sessionDisposables.add(new CancellationTokenSource());
		this._extHostChatSessions.set(sessionResource, { sessionObj: chatSession, disposeCts });

		// Call activeResponseCallback immediately for best user experience
		if (session.activeResponseCallback) {
			Promise.resolve(session.activeResponseCallback(chatSession.activeResponseStream.apiObject, disposeCts.token)).finally(() => {
				// complete
				this._proxy.$handleProgressComplete(handle, sessionResource, 'ongoing');
			});
		}
		const { capabilities } = provider;
		return {
			id: sessionId + '',
			resource: URI.revive(sessionResource),
			hasActiveResponseCallback: !!session.activeResponseCallback,
			hasRequestHandler: !!session.requestHandler,
			supportsInterruption: !!capabilities?.supportsInterruptions,
			options: session.options,
			history: session.history.map(turn => {
				if (turn instanceof extHostTypes.ChatRequestTurn) {
					return this.convertRequestTurn(turn);
				} else {
					return this.convertResponseTurn(turn as extHostTypes.ChatResponseTurn2, sessionDisposables);
				}
			})
		};
	}

	async $provideHandleOptionsChange(handle: number, sessionResourceComponents: UriComponents, updates: ReadonlyArray<{ optionId: string; value: string | IChatSessionProviderOptionItem | undefined }>, token: CancellationToken): Promise<void> {
		const sessionResource = URI.revive(sessionResourceComponents);
		const provider = this._chatSessionContentProviders.get(handle);
		if (!provider) {
			this._logService.warn(`No provider for handle ${handle}`);
			return;
		}

		if (!provider.provider.provideHandleOptionsChange) {
			this._logService.debug(`Provider for handle ${handle} does not implement provideHandleOptionsChange`);
			return;
		}

		try {
			const updatesToSend = updates.map(update => ({
				optionId: update.optionId,
				value: update.value === undefined ? undefined : (typeof update.value === 'string' ? update.value : update.value.id)
			}));
			await provider.provider.provideHandleOptionsChange(sessionResource, updatesToSend, token);
		} catch (error) {
			this._logService.error(`Error calling provideHandleOptionsChange for handle ${handle}, sessionResource ${sessionResource}:`, error);
		}
	}

	async $provideChatSessionProviderOptions(handle: number, token: CancellationToken): Promise<IChatSessionProviderOptions | undefined> {
		const entry = this._chatSessionContentProviders.get(handle);
		if (!entry) {
			this._logService.warn(`No provider for handle ${handle} when requesting chat session options`);
			return;
		}

		const provider = entry.provider;
		if (!provider.provideChatSessionProviderOptions) {
			return;
		}

		try {
			const { optionGroups } = await provider.provideChatSessionProviderOptions(token);
			if (!optionGroups) {
				return;
			}
			return {
				optionGroups,
			};
		} catch (error) {
			this._logService.error(`Error calling provideChatSessionProviderOptions for handle ${handle}:`, error);
			return;
		}
	}

	async $interruptChatSessionActiveResponse(providerHandle: number, sessionResource: UriComponents, requestId: string): Promise<void> {
		const entry = this._extHostChatSessions.get(URI.revive(sessionResource));
		entry?.disposeCts.cancel();
	}

	async $disposeChatSessionContent(providerHandle: number, sessionResource: UriComponents): Promise<void> {
		const entry = this._extHostChatSessions.get(URI.revive(sessionResource));
		if (!entry) {
			this._logService.warn(`No chat session found for resource: ${sessionResource}`);
			return;
		}

		entry.disposeCts.cancel();
		entry.sessionObj.sessionDisposables.dispose();
		this._extHostChatSessions.delete(URI.revive(sessionResource));
	}

	async $invokeChatSessionRequestHandler(handle: number, sessionResource: UriComponents, request: IChatAgentRequest, history: any[], token: CancellationToken): Promise<IChatAgentResult> {
		const entry = this._extHostChatSessions.get(URI.revive(sessionResource));
		if (!entry || !entry.sessionObj.session.requestHandler) {
			return {};
		}

		const chatRequest = typeConvert.ChatAgentRequest.to(request, undefined, await this.getModelForRequest(request, entry.sessionObj.extension), [], new Map(), entry.sessionObj.extension, this._logService);

		const stream = entry.sessionObj.getActiveRequestStream(request);
		await entry.sessionObj.session.requestHandler(chatRequest, { history: history }, stream.apiObject, token);

		// TODO: do we need to dispose the stream object?
		return {};
	}

	private async getModelForRequest(request: IChatAgentRequest, extension: IExtensionDescription): Promise<vscode.LanguageModelChat> {
		let model: vscode.LanguageModelChat | undefined;
		if (request.userSelectedModelId) {
			model = await this._languageModels.getLanguageModelByIdentifier(extension, request.userSelectedModelId);
		}
		if (!model) {
			model = await this._languageModels.getDefaultLanguageModel(extension);
			if (!model) {
				throw new Error('Language model unavailable');
			}
		}

		return model;
	}

	private convertRequestTurn(turn: extHostTypes.ChatRequestTurn) {
		const variables = turn.references.map(ref => this.convertReferenceToVariable(ref));
		return {
			type: 'request' as const,
			id: turn.id,
			prompt: turn.prompt,
			participant: turn.participant,
			command: turn.command,
			variableData: variables.length > 0 ? { variables } : undefined
		};
	}

	private convertReferenceToVariable(ref: vscode.ChatPromptReference): IChatRequestVariableEntry {
		const value = ref.value && typeof ref.value === 'object' && 'uri' in ref.value && 'range' in ref.value
			? typeConvert.Location.from(ref.value as vscode.Location)
			: ref.value;
		const range = ref.range ? { start: ref.range[0], endExclusive: ref.range[1] } : undefined;

		if (value && value instanceof extHostTypes.ChatReferenceDiagnostic && Array.isArray(value.diagnostics) && value.diagnostics.length && value.diagnostics[0][1].length) {
			const marker = Diagnostic.from(value.diagnostics[0][1][0]);
			const refValue: IDiagnosticVariableEntryFilterData = {
				filterRange: { startLineNumber: marker.startLineNumber, startColumn: marker.startColumn, endLineNumber: marker.endLineNumber, endColumn: marker.endColumn },
				filterSeverity: marker.severity,
				filterUri: value.diagnostics[0][0],
				problemMessage: value.diagnostics[0][1][0].message
			};
			return IDiagnosticVariableEntryFilterData.toEntry(refValue);
		}

		if (extHostTypes.Location.isLocation(ref.value) && ref.name.startsWith(`sym:`)) {
			const loc = typeConvert.Location.from(ref.value);
			return {
				id: ref.id,
				name: ref.name,
				fullName: ref.name.substring(4),
				value: { uri: ref.value.uri, range: loc.range },
				// We never send this information to extensions, so default to Property
				symbolKind: SymbolKind.Property,
				// We never send this information to extensions, so default to Property
				icon: SymbolKinds.toIcon(SymbolKind.Property),
				kind: 'symbol',
				range,
			} satisfies ISymbolVariableEntry;
		}

		if (URI.isUri(value) && ref.name.startsWith(`prompt:`) &&
			ref.id.startsWith(PromptFileVariableKind.PromptFile) &&
			ref.id.endsWith(value.toString())) {
			return {
				id: ref.id,
				name: `prompt:${basename(value)}`,
				value,
				kind: 'promptFile',
				modelDescription: 'Prompt instructions file',
				isRoot: true,
				automaticallyAdded: false,
				range,
			} satisfies IPromptFileVariableEntry;
		}

		const isFile = URI.isUri(value) || (value && typeof value === 'object' && 'uri' in value);
		const isFolder = isFile && URI.isUri(value) && value.path.endsWith('/');
		return {
			id: ref.id,
			name: ref.name,
			value,
			modelDescription: ref.modelDescription,
			range,
			kind: isFolder ? 'directory' as const : isFile ? 'file' as const : 'generic' as const
		};
	}

	private convertResponseTurn(turn: extHostTypes.ChatResponseTurn2, sessionDisposables: DisposableStore) {
		const parts = coalesce(turn.response.map(r => typeConvert.ChatResponsePart.from(r, this.commands.converter, sessionDisposables)));
		return {
			type: 'response' as const,
			parts,
			participant: turn.participant
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostChatStatus.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostChatStatus.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import * as extHostProtocol from './extHost.protocol.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';

export class ExtHostChatStatus {

	private readonly _proxy: extHostProtocol.MainThreadChatStatusShape;

	private readonly _items = new Map<string, vscode.ChatStatusItem>();

	constructor(
		mainContext: extHostProtocol.IMainContext
	) {
		this._proxy = mainContext.getProxy(extHostProtocol.MainContext.MainThreadChatStatus);
	}

	createChatStatusItem(extension: IExtensionDescription, id: string): vscode.ChatStatusItem {
		const internalId = asChatItemIdentifier(extension.identifier, id);
		if (this._items.has(internalId)) {
			throw new Error(`Chat status item '${id}' already exists`);
		}

		const state: extHostProtocol.ChatStatusItemDto = {
			id: internalId,
			title: '',
			description: '',
			detail: '',
		};

		let disposed = false;
		let visible = false;
		const syncState = () => {
			if (disposed) {
				throw new Error('Chat status item is disposed');
			}

			if (!visible) {
				return;
			}

			this._proxy.$setEntry(id, state);
		};

		const item = Object.freeze<vscode.ChatStatusItem>({
			id: id,

			get title(): string | { label: string; link: string } {
				return state.title;
			},
			set title(value: string | { label: string; link: string }) {
				state.title = value;
				syncState();
			},

			get description(): string {
				return state.description;
			},
			set description(value: string) {
				state.description = value;
				syncState();
			},

			get detail(): string | undefined {
				return state.detail;
			},
			set detail(value: string | undefined) {
				state.detail = value;
				syncState();
			},

			show: () => {
				visible = true;
				syncState();
			},
			hide: () => {
				visible = false;
				this._proxy.$disposeEntry(id);
			},
			dispose: () => {
				disposed = true;
				this._proxy.$disposeEntry(id);
				this._items.delete(internalId);
			},
		});

		this._items.set(internalId, item);
		return item;
	}
}

function asChatItemIdentifier(extension: ExtensionIdentifier, id: string): string {
	return `${ExtensionIdentifier.toKey(extension)}.${id}`;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostClipboard.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostClipboard.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMainContext, MainContext } from './extHost.protocol.js';
import type * as vscode from 'vscode';

export class ExtHostClipboard {

	readonly value: vscode.Clipboard;

	constructor(mainContext: IMainContext) {
		const proxy = mainContext.getProxy(MainContext.MainThreadClipboard);
		this.value = Object.freeze({
			readText() {
				return proxy.$readText();
			},
			writeText(value: string) {
				return proxy.$writeText(value);
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostCodeInsets.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostCodeInsets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../base/common/event.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ExtHostTextEditor } from './extHostTextEditor.js';
import { ExtHostEditors } from './extHostTextEditors.js';
import { asWebviewUri, webviewGenericCspSource, WebviewRemoteInfo } from '../../contrib/webview/common/webview.js';
import type * as vscode from 'vscode';
import { ExtHostEditorInsetsShape, MainThreadEditorInsetsShape } from './extHost.protocol.js';

export class ExtHostEditorInsets implements ExtHostEditorInsetsShape {

	private _handlePool = 0;
	private readonly _disposables = new DisposableStore();
	private _insets = new Map<number, { editor: vscode.TextEditor; inset: vscode.WebviewEditorInset; onDidReceiveMessage: Emitter<any> }>();

	constructor(
		private readonly _proxy: MainThreadEditorInsetsShape,
		private readonly _editors: ExtHostEditors,
		private readonly _remoteInfo: WebviewRemoteInfo
	) {

		// dispose editor inset whenever the hosting editor goes away
		this._disposables.add(_editors.onDidChangeVisibleTextEditors(() => {
			const visibleEditor = _editors.getVisibleTextEditors();
			for (const value of this._insets.values()) {
				if (visibleEditor.indexOf(value.editor) < 0) {
					value.inset.dispose(); // will remove from `this._insets`
				}
			}
		}));
	}

	dispose(): void {
		this._insets.forEach(value => value.inset.dispose());
		this._disposables.dispose();
	}

	createWebviewEditorInset(editor: vscode.TextEditor, line: number, height: number, options: vscode.WebviewOptions | undefined, extension: IExtensionDescription): vscode.WebviewEditorInset {

		let apiEditor: ExtHostTextEditor | undefined;
		for (const candidate of this._editors.getVisibleTextEditors(true)) {
			if (candidate.value === editor) {
				apiEditor = <ExtHostTextEditor>candidate;
				break;
			}
		}
		if (!apiEditor) {
			throw new Error('not a visible editor');
		}

		const that = this;
		const handle = this._handlePool++;
		const onDidReceiveMessage = new Emitter<any>();
		const onDidDispose = new Emitter<void>();

		const webview = new class implements vscode.Webview {

			private _html: string = '';
			private _options: vscode.WebviewOptions = Object.create(null);

			asWebviewUri(resource: vscode.Uri): vscode.Uri {
				return asWebviewUri(resource, that._remoteInfo);
			}

			get cspSource(): string {
				return webviewGenericCspSource;
			}

			set options(value: vscode.WebviewOptions) {
				this._options = value;
				that._proxy.$setOptions(handle, value);
			}

			get options(): vscode.WebviewOptions {
				return this._options;
			}

			set html(value: string) {
				this._html = value;
				that._proxy.$setHtml(handle, value);
			}

			get html(): string {
				return this._html;
			}

			get onDidReceiveMessage(): vscode.Event<any> {
				return onDidReceiveMessage.event;
			}

			postMessage(message: any): Thenable<boolean> {
				return that._proxy.$postMessage(handle, message);
			}
		};

		const inset = new class implements vscode.WebviewEditorInset {

			readonly editor: vscode.TextEditor = editor;
			readonly line: number = line;
			readonly height: number = height;
			readonly webview: vscode.Webview = webview;
			readonly onDidDispose: vscode.Event<void> = onDidDispose.event;

			dispose(): void {
				if (that._insets.delete(handle)) {
					that._proxy.$disposeEditorInset(handle);
					onDidDispose.fire();

					// final cleanup
					onDidDispose.dispose();
					onDidReceiveMessage.dispose();
				}
			}
		};

		this._proxy.$createEditorInset(handle, apiEditor.id, apiEditor.value.document.uri, line + 1, height, options || {}, extension.identifier, extension.extensionLocation);
		this._insets.set(handle, { editor, inset, onDidReceiveMessage });

		return inset;
	}

	$onDidDispose(handle: number): void {
		const value = this._insets.get(handle);
		if (value) {
			value.inset.dispose();
		}
	}

	$onDidReceiveMessage(handle: number, message: any): void {
		const value = this._insets.get(handle);
		value?.onDidReceiveMessage.fire(message);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostCodeMapper.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostCodeMapper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ICodeMapperResult } from '../../contrib/chat/common/chatCodeMapperService.js';
import * as extHostProtocol from './extHost.protocol.js';
import { NotebookEdit, TextEdit } from './extHostTypeConverters.js';
import { URI } from '../../../base/common/uri.js';
import { asArray } from '../../../base/common/arrays.js';
import { LocalChatSessionUri } from '../../contrib/chat/common/chatUri.js';

export class ExtHostCodeMapper implements extHostProtocol.ExtHostCodeMapperShape {

	private static _providerHandlePool: number = 0;
	private readonly _proxy: extHostProtocol.MainThreadCodeMapperShape;
	private readonly providers = new Map<number, vscode.MappedEditsProvider2>();

	constructor(
		mainContext: extHostProtocol.IMainContext
	) {
		this._proxy = mainContext.getProxy(extHostProtocol.MainContext.MainThreadCodeMapper);
	}

	async $mapCode(handle: number, internalRequest: extHostProtocol.ICodeMapperRequestDto, token: CancellationToken): Promise<ICodeMapperResult | null> {
		// Received request to map code from the main thread
		const provider = this.providers.get(handle);
		if (!provider) {
			throw new Error(`Received request to map code for unknown provider handle ${handle}`);
		}

		// Construct a response object to pass to the provider
		const stream: vscode.MappedEditsResponseStream = {
			textEdit: (target: vscode.Uri, edits: vscode.TextEdit | vscode.TextEdit[]) => {
				edits = asArray(edits);
				this._proxy.$handleProgress(internalRequest.requestId, {
					uri: target,
					edits: edits.map(TextEdit.from)
				});
			},
			notebookEdit: (target: vscode.Uri, edits: vscode.NotebookEdit | vscode.NotebookEdit[]) => {
				edits = asArray(edits);
				this._proxy.$handleProgress(internalRequest.requestId, {
					uri: target,
					edits: edits.map(NotebookEdit.from)
				});
			}
		};

		const request: vscode.MappedEditsRequest = {
			location: internalRequest.location,
			chatRequestId: internalRequest.chatRequestId,
			chatRequestModel: internalRequest.chatRequestModel,
			chatSessionId: internalRequest.chatSessionResource ? LocalChatSessionUri.parseLocalSessionId(URI.revive(internalRequest.chatSessionResource)) : undefined,
			codeBlocks: internalRequest.codeBlocks.map(block => {
				return {
					code: block.code,
					resource: URI.revive(block.resource),
					markdownBeforeBlock: block.markdownBeforeBlock
				};
			})
		};

		const result = await provider.provideMappedEdits(request, stream, token);
		return result ?? null;
	}

	registerMappedEditsProvider(extension: IExtensionDescription, provider: vscode.MappedEditsProvider2): vscode.Disposable {
		const handle = ExtHostCodeMapper._providerHandlePool++;
		this._proxy.$registerCodeMapperProvider(handle, extension.displayName ?? extension.name);
		this.providers.set(handle, provider);
		return {
			dispose: () => {
				return this._proxy.$unregisterCodeMapperProvider(handle);
			}
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostCommands.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable local/code-no-native-private */

import { validateConstraint } from '../../../base/common/types.js';
import { ICommandMetadata } from '../../../platform/commands/common/commands.js';
import * as extHostTypes from './extHostTypes.js';
import * as extHostTypeConverter from './extHostTypeConverters.js';
import { cloneAndChange } from '../../../base/common/objects.js';
import { MainContext, MainThreadCommandsShape, ExtHostCommandsShape, ICommandDto, ICommandMetadataDto, MainThreadTelemetryShape } from './extHost.protocol.js';
import { isNonEmptyArray } from '../../../base/common/arrays.js';
import * as languages from '../../../editor/common/languages.js';
import type * as vscode from 'vscode';
import { ILogService } from '../../../platform/log/common/log.js';
import { revive } from '../../../base/common/marshalling.js';
import { IRange, Range } from '../../../editor/common/core/range.js';
import { IPosition, Position } from '../../../editor/common/core/position.js';
import { URI } from '../../../base/common/uri.js';
import { DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { ISelection } from '../../../editor/common/core/selection.js';
import { TestItemImpl } from './extHostTestItem.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { SerializableObjectWithBuffers } from '../../services/extensions/common/proxyIdentifier.js';
import { toErrorMessage } from '../../../base/common/errorMessage.js';
import { StopWatch } from '../../../base/common/stopwatch.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { TelemetryTrustedValue } from '../../../platform/telemetry/common/telemetryUtils.js';
import { IExtHostTelemetry } from './extHostTelemetry.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { isCancellationError } from '../../../base/common/errors.js';

interface CommandHandler {
	callback: Function;
	thisArg: any;
	metadata?: ICommandMetadata;
	extension?: IExtensionDescription;
}

export interface ArgumentProcessor {
	processArgument(arg: any, extension: IExtensionDescription | undefined): any;
}

export class ExtHostCommands implements ExtHostCommandsShape {

	readonly _serviceBrand: undefined;

	#proxy: MainThreadCommandsShape;

	private readonly _commands = new Map<string, CommandHandler>();
	private readonly _apiCommands = new Map<string, ApiCommand>();
	#telemetry: MainThreadTelemetryShape;

	private readonly _logService: ILogService;
	readonly #extHostTelemetry: IExtHostTelemetry;
	private readonly _argumentProcessors: ArgumentProcessor[];

	readonly converter: CommandsConverter;

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@ILogService logService: ILogService,
		@IExtHostTelemetry extHostTelemetry: IExtHostTelemetry
	) {
		this.#proxy = extHostRpc.getProxy(MainContext.MainThreadCommands);
		this._logService = logService;
		this.#extHostTelemetry = extHostTelemetry;
		this.#telemetry = extHostRpc.getProxy(MainContext.MainThreadTelemetry);
		this.converter = new CommandsConverter(
			this,
			id => {
				// API commands that have no return type (void) can be
				// converted to their internal command and don't need
				// any indirection commands
				const candidate = this._apiCommands.get(id);
				return candidate?.result === ApiCommandResult.Void
					? candidate : undefined;
			},
			logService
		);
		this._argumentProcessors = [
			{
				processArgument(a) {
					// URI, Regex
					return revive(a);
				}
			},
			{
				processArgument(arg) {
					return cloneAndChange(arg, function (obj) {
						// Reverse of https://github.com/microsoft/vscode/blob/1f28c5fc681f4c01226460b6d1c7e91b8acb4a5b/src/vs/workbench/api/node/extHostCommands.ts#L112-L127
						if (Range.isIRange(obj)) {
							return extHostTypeConverter.Range.to(obj);
						}
						if (Position.isIPosition(obj)) {
							return extHostTypeConverter.Position.to(obj);
						}
						if (Range.isIRange((obj as languages.Location).range) && URI.isUri((obj as languages.Location).uri)) {
							return extHostTypeConverter.location.to(obj);
						}
						if (obj instanceof VSBuffer) {
							return obj.buffer.buffer;
						}
						if (!Array.isArray(obj)) {
							return obj;
						}
					});
				}
			}
		];
	}

	registerArgumentProcessor(processor: ArgumentProcessor): void {
		this._argumentProcessors.push(processor);
	}

	registerApiCommand(apiCommand: ApiCommand): extHostTypes.Disposable {


		const registration = this.registerCommand(false, apiCommand.id, async (...apiArgs) => {

			const internalArgs = apiCommand.args.map((arg, i) => {
				if (!arg.validate(apiArgs[i])) {
					throw new Error(`Invalid argument '${arg.name}' when running '${apiCommand.id}', received: ${typeof apiArgs[i] === 'object' ? JSON.stringify(apiArgs[i], null, '\t') : apiArgs[i]} `);
				}
				return arg.convert(apiArgs[i]);
			});

			const internalResult = await this.executeCommand(apiCommand.internalId, ...internalArgs);
			return apiCommand.result.convert(internalResult, apiArgs, this.converter);
		}, undefined, {
			description: apiCommand.description,
			args: apiCommand.args,
			returns: apiCommand.result.description
		});

		this._apiCommands.set(apiCommand.id, apiCommand);

		return new extHostTypes.Disposable(() => {
			registration.dispose();
			this._apiCommands.delete(apiCommand.id);
		});
	}

	registerCommand(global: boolean, id: string, callback: <T>(...args: any[]) => T | Thenable<T>, thisArg?: any, metadata?: ICommandMetadata, extension?: IExtensionDescription): extHostTypes.Disposable {
		this._logService.trace('ExtHostCommands#registerCommand', id);

		if (!id.trim().length) {
			throw new Error('invalid id');
		}

		if (this._commands.has(id)) {
			throw new Error(`command '${id}' already exists`);
		}

		this._commands.set(id, { callback, thisArg, metadata, extension });
		if (global) {
			this.#proxy.$registerCommand(id);
		}

		return new extHostTypes.Disposable(() => {
			if (this._commands.delete(id)) {
				if (global) {
					this.#proxy.$unregisterCommand(id);
				}
			}
		});
	}

	executeCommand<T>(id: string, ...args: unknown[]): Promise<T> {
		this._logService.trace('ExtHostCommands#executeCommand', id);
		return this._doExecuteCommand(id, args, true);
	}

	private async _doExecuteCommand<T>(id: string, args: unknown[], retry: boolean): Promise<T> {

		if (this._commands.has(id)) {
			// - We stay inside the extension host and support
			// 	 to pass any kind of parameters around.
			// - We still emit the corresponding activation event
			//   BUT we don't await that event
			this.#proxy.$fireCommandActivationEvent(id);
			return this._executeContributedCommand<T>(id, args, false);

		} else {
			// automagically convert some argument types
			let hasBuffers = false;
			const toArgs = cloneAndChange(args, function (value) {
				if (value instanceof extHostTypes.Position) {
					return extHostTypeConverter.Position.from(value);
				} else if (value instanceof extHostTypes.Range) {
					return extHostTypeConverter.Range.from(value);
				} else if (value instanceof extHostTypes.Location) {
					return extHostTypeConverter.location.from(value);
				} else if (extHostTypes.NotebookRange.isNotebookRange(value)) {
					return extHostTypeConverter.NotebookRange.from(value);
				} else if (value instanceof ArrayBuffer) {
					hasBuffers = true;
					return VSBuffer.wrap(new Uint8Array(value));
				} else if (value instanceof Uint8Array) {
					hasBuffers = true;
					return VSBuffer.wrap(value);
				} else if (value instanceof VSBuffer) {
					hasBuffers = true;
					return value;
				}
				if (!Array.isArray(value)) {
					return value;
				}
			});

			try {
				const result = await this.#proxy.$executeCommand(id, hasBuffers ? new SerializableObjectWithBuffers(toArgs) : toArgs, retry);
				return revive<any>(result);
			} catch (e) {
				// Rerun the command when it wasn't known, had arguments, and when retry
				// is enabled. We do this because the command might be registered inside
				// the extension host now and can therefore accept the arguments as-is.
				if (e instanceof Error && e.message === '$executeCommand:retry') {
					return this._doExecuteCommand(id, args, false);
				} else {
					throw e;
				}
			}
		}
	}

	private async _executeContributedCommand<T = unknown>(id: string, args: unknown[], annotateError: boolean): Promise<T> {
		const command = this._commands.get(id);
		if (!command) {
			throw new Error('Unknown command');
		}
		const { callback, thisArg, metadata } = command;
		if (metadata?.args) {
			for (let i = 0; i < metadata.args.length; i++) {
				try {
					validateConstraint(args[i], metadata.args[i].constraint);
				} catch (err) {
					throw new Error(`Running the contributed command: '${id}' failed. Illegal argument '${metadata.args[i].name}' - ${metadata.args[i].description}`);
				}
			}
		}

		const stopWatch = StopWatch.create();
		try {
			return await callback.apply(thisArg, args);
		} catch (err) {
			// The indirection-command from the converter can fail when invoking the actual
			// command and in that case it is better to blame the correct command
			if (id === this.converter.delegatingCommandId) {
				const actual = this.converter.getActualCommand(...args);
				if (actual) {
					id = actual.command;
				}
			}
			if (!isCancellationError(err)) {
				this._logService.error(err, id, command.extension?.identifier);
			}

			if (!annotateError) {
				throw err;
			}

			if (command.extension?.identifier) {
				const reported = this.#extHostTelemetry.onExtensionError(command.extension.identifier, err);
				this._logService.trace('forwarded error to extension?', reported, command.extension?.identifier);
			}

			throw new class CommandError extends Error {
				readonly id = id;
				readonly source = command!.extension?.displayName ?? command!.extension?.name;
				constructor() {
					super(toErrorMessage(err));
				}
			};
		}
		finally {
			this._reportTelemetry(command, id, stopWatch.elapsed());
		}
	}

	private _reportTelemetry(command: CommandHandler, id: string, duration: number) {
		if (!command.extension) {
			return;
		}
		if (id.startsWith('code.copilot.logStructured')) {
			// This command is very active. See https://github.com/microsoft/vscode/issues/254153.
			return;
		}
		type ExtensionActionTelemetry = {
			extensionId: string;
			id: TelemetryTrustedValue<string>;
			duration: number;
		};
		type ExtensionActionTelemetryMeta = {
			extensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The id of the extension handling the command, informing which extensions provide most-used functionality.' };
			id: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The id of the command, to understand which specific extension features are most popular.' };
			duration: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The duration of the command execution, to detect performance issues' };
			owner: 'digitarald';
			comment: 'Used to gain insight on the most popular commands used from extensions';
		};
		this.#telemetry.$publicLog2<ExtensionActionTelemetry, ExtensionActionTelemetryMeta>('Extension:ActionExecuted', {
			extensionId: command.extension.identifier.value,
			id: new TelemetryTrustedValue(id),
			duration: duration,
		});
	}

	$executeContributedCommand(id: string, ...args: unknown[]): Promise<unknown> {
		this._logService.trace('ExtHostCommands#$executeContributedCommand', id);

		const cmdHandler = this._commands.get(id);
		if (!cmdHandler) {
			return Promise.reject(new Error(`Contributed command '${id}' does not exist.`));
		} else {
			args = args.map(arg => this._argumentProcessors.reduce((r, p) => p.processArgument(r, cmdHandler.extension), arg));
			return this._executeContributedCommand(id, args, true);
		}
	}

	getCommands(filterUnderscoreCommands: boolean = false): Promise<string[]> {
		this._logService.trace('ExtHostCommands#getCommands', filterUnderscoreCommands);

		return this.#proxy.$getCommands().then(result => {
			if (filterUnderscoreCommands) {
				result = result.filter(command => command[0] !== '_');
			}
			return result;
		});
	}

	$getContributedCommandMetadata(): Promise<{ [id: string]: string | ICommandMetadataDto }> {
		const result: { [id: string]: string | ICommandMetadata } = Object.create(null);
		for (const [id, command] of this._commands) {
			const { metadata } = command;
			if (metadata) {
				result[id] = metadata;
			}
		}
		return Promise.resolve(result);
	}
}

export interface IExtHostCommands extends ExtHostCommands { }
export const IExtHostCommands = createDecorator<IExtHostCommands>('IExtHostCommands');

export class CommandsConverter implements extHostTypeConverter.Command.ICommandsConverter {

	readonly delegatingCommandId: string = `__vsc${generateUuid()}`;
	private readonly _cache = new Map<string, vscode.Command>();
	private _cachIdPool = 0;

	// --- conversion between internal and api commands
	constructor(
		private readonly _commands: ExtHostCommands,
		private readonly _lookupApiCommand: (id: string) => ApiCommand | undefined,
		private readonly _logService: ILogService
	) {
		this._commands.registerCommand(true, this.delegatingCommandId, this._executeConvertedCommand, this);
	}

	toInternal(command: vscode.Command, disposables: DisposableStore): ICommandDto;
	toInternal(command: vscode.Command | undefined, disposables: DisposableStore): ICommandDto | undefined;
	toInternal(command: vscode.Command | undefined, disposables: DisposableStore): ICommandDto | undefined {

		if (!command) {
			return undefined;
		}

		const result: ICommandDto = {
			$ident: undefined,
			id: command.command,
			title: command.title,
			tooltip: command.tooltip
		};

		if (!command.command) {
			// falsy command id -> return converted command but don't attempt any
			// argument or API-command dance since this command won't run anyways
			return result;
		}

		const apiCommand = this._lookupApiCommand(command.command);
		if (apiCommand) {
			// API command with return-value can be converted inplace
			result.id = apiCommand.internalId;
			result.arguments = apiCommand.args.map((arg, i) => arg.convert(command.arguments && command.arguments[i]));


		} else if (isNonEmptyArray(command.arguments)) {
			// we have a contributed command with arguments. that
			// means we don't want to send the arguments around

			const id = `${command.command} /${++this._cachIdPool}`;
			this._cache.set(id, command);
			disposables.add(toDisposable(() => {
				this._cache.delete(id);
				this._logService.trace('CommandsConverter#DISPOSE', id);
			}));
			result.$ident = id;

			result.id = this.delegatingCommandId;
			result.arguments = [id];

			this._logService.trace('CommandsConverter#CREATE', command.command, id);
		}

		return result;
	}

	fromInternal(command: ICommandDto): vscode.Command | undefined {

		if (typeof command.$ident === 'string') {
			return this._cache.get(command.$ident);

		} else {
			return {
				command: command.id,
				title: command.title,
				arguments: command.arguments
			};
		}
	}


	getActualCommand(...args: any[]): vscode.Command | undefined {
		return this._cache.get(args[0]);
	}

	private _executeConvertedCommand<R>(...args: any[]): Promise<R> {
		const actualCmd = this.getActualCommand(...args);
		this._logService.trace('CommandsConverter#EXECUTE', args[0], actualCmd ? actualCmd.command : 'MISSING');

		if (!actualCmd) {
			return Promise.reject(`Actual command not found, wanted to execute ${args[0]}`);
		}
		return this._commands.executeCommand(actualCmd.command, ...(actualCmd.arguments || []));
	}

}


export class ApiCommandArgument<V, O = V> {

	static readonly Uri = new ApiCommandArgument<URI>('uri', 'Uri of a text document', v => URI.isUri(v), v => v);
	static readonly Position = new ApiCommandArgument<extHostTypes.Position, IPosition>('position', 'A position in a text document', v => extHostTypes.Position.isPosition(v), extHostTypeConverter.Position.from);
	static readonly Range = new ApiCommandArgument<extHostTypes.Range, IRange>('range', 'A range in a text document', v => extHostTypes.Range.isRange(v), extHostTypeConverter.Range.from);
	static readonly Selection = new ApiCommandArgument<extHostTypes.Selection, ISelection>('selection', 'A selection in a text document', v => extHostTypes.Selection.isSelection(v), extHostTypeConverter.Selection.from);
	static readonly Number = new ApiCommandArgument<number>('number', '', v => typeof v === 'number', v => v);
	static readonly String = new ApiCommandArgument<string>('string', '', v => typeof v === 'string', v => v);

	static Arr<T, K = T>(element: ApiCommandArgument<T, K>) {
		return new ApiCommandArgument(
			`${element.name}_array`,
			`Array of ${element.name}, ${element.description}`,
			(v: unknown) => Array.isArray(v) && v.every(e => element.validate(e)),
			(v: T[]) => v.map(e => element.convert(e))
		);
	}

	static readonly CallHierarchyItem = new ApiCommandArgument('item', 'A call hierarchy item', v => v instanceof extHostTypes.CallHierarchyItem, extHostTypeConverter.CallHierarchyItem.from);
	static readonly TypeHierarchyItem = new ApiCommandArgument('item', 'A type hierarchy item', v => v instanceof extHostTypes.TypeHierarchyItem, extHostTypeConverter.TypeHierarchyItem.from);
	static readonly TestItem = new ApiCommandArgument('testItem', 'A VS Code TestItem', v => v instanceof TestItemImpl, extHostTypeConverter.TestItem.from);
	static readonly TestProfile = new ApiCommandArgument('testProfile', 'A VS Code test profile', v => v instanceof extHostTypes.TestRunProfileBase, extHostTypeConverter.TestRunProfile.from);

	constructor(
		readonly name: string,
		readonly description: string,
		readonly validate: (v: V) => boolean,
		readonly convert: (v: V) => O
	) { }

	optional(): ApiCommandArgument<V | undefined | null, O | undefined | null> {
		return new ApiCommandArgument(
			this.name, `(optional) ${this.description}`,
			value => value === undefined || value === null || this.validate(value),
			value => value === undefined ? undefined : value === null ? null : this.convert(value)
		);
	}

	with(name: string | undefined, description: string | undefined): ApiCommandArgument<V, O> {
		return new ApiCommandArgument(name ?? this.name, description ?? this.description, this.validate, this.convert);
	}
}

export class ApiCommandResult<V, O = V> {

	static readonly Void = new ApiCommandResult<void, void>('no result', v => v);

	constructor(
		readonly description: string,
		readonly convert: (v: V, apiArgs: any[], cmdConverter: CommandsConverter) => O
	) { }
}

export class ApiCommand {

	constructor(
		readonly id: string,
		readonly internalId: string,
		readonly description: string,
		readonly args: ApiCommandArgument<any, any>[],
		readonly result: ApiCommandResult<any, any>
	) { }
}
```

--------------------------------------------------------------------------------

````
