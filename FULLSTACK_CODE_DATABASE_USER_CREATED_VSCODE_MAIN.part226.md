---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 226
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 226 of 552)

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

---[FILE: src/vs/editor/contrib/gotoSymbol/browser/goToCommands.ts]---
Location: vscode-main/src/vs/editor/contrib/gotoSymbol/browser/goToCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { createCancelablePromise, raceCancellation } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { assertType } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { CodeEditorStateFlag, EditorStateCancellationTokenSource } from '../../editorState/browser/editorState.js';
import { IActiveCodeEditor, ICodeEditor, isCodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction2, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { EmbeddedCodeEditorWidget } from '../../../browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { EditorOption, GoToLocationValues } from '../../../common/config/editorOptions.js';
import * as corePosition from '../../../common/core/position.js';
import { IRange, Range } from '../../../common/core/range.js';
import { ScrollType } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { ITextModel } from '../../../common/model.js';
import { isLocationLink, Location, LocationLink } from '../../../common/languages.js';
import { ReferencesController } from './peek/referencesController.js';
import { ReferencesModel } from './referencesModel.js';
import { ISymbolNavigationService } from './symbolNavigation.js';
import { MessageController } from '../../message/browser/messageController.js';
import { PeekContext } from '../../peekView/browser/peekView.js';
import * as nls from '../../../../nls.js';
import { IAction2F1RequiredOptions, IAction2Options, ISubmenuItem, MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { TextEditorSelectionRevealType, TextEditorSelectionSource } from '../../../../platform/editor/common/editor.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IEditorProgressService } from '../../../../platform/progress/common/progress.js';
import { getDeclarationsAtPosition, getDefinitionsAtPosition, getImplementationsAtPosition, getReferencesAtPosition, getTypeDefinitionsAtPosition } from './goToSymbol.js';
import { IWordAtPosition } from '../../../common/core/wordHelper.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { IsWebContext } from '../../../../platform/contextkey/common/contextkeys.js';

MenuRegistry.appendMenuItem(MenuId.EditorContext, {
	submenu: MenuId.EditorContextPeek,
	title: nls.localize('peek.submenu', "Peek"),
	group: 'navigation',
	order: 100
} satisfies ISubmenuItem);

export interface SymbolNavigationActionConfig {
	openToSide: boolean;
	openInPeek: boolean;
	muteMessage: boolean;
}

export class SymbolNavigationAnchor {

	static is(thing: any): thing is SymbolNavigationAnchor {
		if (!thing || typeof thing !== 'object') {
			return false;
		}
		if (thing instanceof SymbolNavigationAnchor) {
			return true;
		}
		if (corePosition.Position.isIPosition((<SymbolNavigationAnchor>thing).position) && (<SymbolNavigationAnchor>thing).model) {
			return true;
		}
		return false;
	}

	constructor(readonly model: ITextModel, readonly position: corePosition.Position) { }
}

export abstract class SymbolNavigationAction extends EditorAction2 {

	private static _allSymbolNavigationCommands = new Map<string, SymbolNavigationAction>();
	private static _activeAlternativeCommands = new Set<string>();

	static all(): IterableIterator<SymbolNavigationAction> {
		return SymbolNavigationAction._allSymbolNavigationCommands.values();
	}

	private static _patchConfig(opts: IAction2Options & IAction2F1RequiredOptions): IAction2Options {
		const result = { ...opts, f1: true };
		// patch context menu when clause
		if (result.menu) {
			for (const item of Iterable.wrap(result.menu)) {
				if (item.id === MenuId.EditorContext || item.id === MenuId.EditorContextPeek) {
					item.when = ContextKeyExpr.and(opts.precondition, item.when);
				}
			}
		}
		return <typeof opts>result;
	}

	readonly configuration: SymbolNavigationActionConfig;

	constructor(configuration: SymbolNavigationActionConfig, opts: IAction2Options & IAction2F1RequiredOptions) {
		super(SymbolNavigationAction._patchConfig(opts));
		this.configuration = configuration;
		SymbolNavigationAction._allSymbolNavigationCommands.set(opts.id, this);
	}

	override runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, arg?: SymbolNavigationAnchor | unknown, range?: Range): Promise<void> {
		if (!editor.hasModel()) {
			return Promise.resolve(undefined);
		}
		const notificationService = accessor.get(INotificationService);
		const editorService = accessor.get(ICodeEditorService);
		const progressService = accessor.get(IEditorProgressService);
		const symbolNavService = accessor.get(ISymbolNavigationService);
		const languageFeaturesService = accessor.get(ILanguageFeaturesService);
		const instaService = accessor.get(IInstantiationService);

		const model = editor.getModel();
		const position = editor.getPosition();
		const anchor = SymbolNavigationAnchor.is(arg) ? arg : new SymbolNavigationAnchor(model, position);

		const cts = new EditorStateCancellationTokenSource(editor, CodeEditorStateFlag.Value | CodeEditorStateFlag.Position);

		const promise = raceCancellation(this._getLocationModel(languageFeaturesService, anchor.model, anchor.position, cts.token), cts.token).then(async references => {

			if (!references || cts.token.isCancellationRequested) {
				return;
			}

			alert(references.ariaMessage);

			let altAction: SymbolNavigationAction | null | undefined;
			if (references.referenceAt(model.uri, position)) {
				const altActionId = this._getAlternativeCommand(editor);
				if (altActionId !== undefined && !SymbolNavigationAction._activeAlternativeCommands.has(altActionId) && SymbolNavigationAction._allSymbolNavigationCommands.has(altActionId)) {
					altAction = SymbolNavigationAction._allSymbolNavigationCommands.get(altActionId)!;
				}
			}

			const referenceCount = references.references.length;

			if (referenceCount === 0) {
				// no result -> show message
				if (!this.configuration.muteMessage) {
					const info = model.getWordAtPosition(position);
					MessageController.get(editor)?.showMessage(this._getNoResultFoundMessage(info), position);
				}
			} else if (referenceCount === 1 && altAction) {
				// already at the only result, run alternative
				SymbolNavigationAction._activeAlternativeCommands.add(this.desc.id);
				instaService.invokeFunction((accessor) => altAction.runEditorCommand(accessor, editor, arg, range).finally(() => {
					SymbolNavigationAction._activeAlternativeCommands.delete(this.desc.id);
				}));

			} else {
				// normal results handling
				return this._onResult(editorService, symbolNavService, editor, references, range);
			}

		}, (err) => {
			// report an error
			notificationService.error(err);
		}).finally(() => {
			cts.dispose();
		});

		progressService.showWhile(promise, 250);
		return promise;
	}

	protected abstract _getLocationModel(languageFeaturesService: ILanguageFeaturesService, model: ITextModel, position: corePosition.Position, token: CancellationToken): Promise<ReferencesModel | undefined>;

	protected abstract _getNoResultFoundMessage(info: IWordAtPosition | null): string;

	protected abstract _getAlternativeCommand(editor: IActiveCodeEditor): string | undefined;

	protected abstract _getGoToPreference(editor: IActiveCodeEditor): GoToLocationValues;

	private async _onResult(editorService: ICodeEditorService, symbolNavService: ISymbolNavigationService, editor: IActiveCodeEditor, model: ReferencesModel, range?: Range): Promise<void> {

		const gotoLocation = this._getGoToPreference(editor);
		if (!(editor instanceof EmbeddedCodeEditorWidget) && (this.configuration.openInPeek || (gotoLocation === 'peek' && model.references.length > 1))) {
			this._openInPeek(editor, model, range);

		} else {
			const next = model.firstReference()!;
			const peek = model.references.length > 1 && gotoLocation === 'gotoAndPeek';
			const targetEditor = await this._openReference(editor, editorService, next, this.configuration.openToSide, !peek);
			if (peek && targetEditor) {
				this._openInPeek(targetEditor, model, range);
			} else {
				model.dispose();
			}

			// keep remaining locations around when using
			// 'goto'-mode
			if (gotoLocation === 'goto') {
				symbolNavService.put(next);
			}
		}
	}

	private async _openReference(editor: ICodeEditor, editorService: ICodeEditorService, reference: Location | LocationLink, sideBySide: boolean, highlight: boolean): Promise<ICodeEditor | undefined> {
		// range is the target-selection-range when we have one
		// and the fallback is the 'full' range
		let range: IRange | undefined = undefined;
		if (isLocationLink(reference)) {
			range = reference.targetSelectionRange;
		}
		if (!range) {
			range = reference.range;
		}
		if (!range) {
			return undefined;
		}

		const targetEditor = await editorService.openCodeEditor({
			resource: reference.uri,
			options: {
				selection: Range.collapseToStart(range),
				selectionRevealType: TextEditorSelectionRevealType.NearTopIfOutsideViewport,
				selectionSource: TextEditorSelectionSource.JUMP
			}
		}, editor, sideBySide);

		if (!targetEditor) {
			return undefined;
		}

		if (highlight) {
			const modelNow = targetEditor.getModel();
			const decorations = targetEditor.createDecorationsCollection([{ range, options: { description: 'symbol-navigate-action-highlight', className: 'symbolHighlight' } }]);
			setTimeout(() => {
				if (targetEditor.getModel() === modelNow) {
					decorations.clear();
				}
			}, 350);
		}

		return targetEditor;
	}

	private _openInPeek(target: ICodeEditor, model: ReferencesModel, range?: Range) {
		const controller = ReferencesController.get(target);
		if (controller && target.hasModel()) {
			controller.toggleWidget(range ?? target.getSelection(), createCancelablePromise(_ => Promise.resolve(model)), this.configuration.openInPeek);
		} else {
			model.dispose();
		}
	}
}

//#region --- DEFINITION

export class DefinitionAction extends SymbolNavigationAction {

	protected async _getLocationModel(languageFeaturesService: ILanguageFeaturesService, model: ITextModel, position: corePosition.Position, token: CancellationToken): Promise<ReferencesModel> {
		return new ReferencesModel(await getDefinitionsAtPosition(languageFeaturesService.definitionProvider, model, position, false, token), nls.localize('def.title', 'Definitions'));
	}

	protected _getNoResultFoundMessage(info: IWordAtPosition | null): string {
		return info && info.word
			? nls.localize('noResultWord', "No definition found for '{0}'", info.word)
			: nls.localize('generic.noResults', "No definition found");
	}

	protected _getAlternativeCommand(editor: IActiveCodeEditor): string {
		return editor.getOption(EditorOption.gotoLocation).alternativeDefinitionCommand;
	}

	protected _getGoToPreference(editor: IActiveCodeEditor): GoToLocationValues {
		return editor.getOption(EditorOption.gotoLocation).multipleDefinitions;
	}
}

registerAction2(class GoToDefinitionAction extends DefinitionAction {

	static readonly id = 'editor.action.revealDefinition';

	constructor() {
		super({
			openToSide: false,
			openInPeek: false,
			muteMessage: false
		}, {
			id: GoToDefinitionAction.id,
			title: {
				...nls.localize2('actions.goToDecl.label', "Go to Definition"),
				mnemonicTitle: nls.localize({ key: 'miGotoDefinition', comment: ['&& denotes a mnemonic'] }, "Go to &&Definition"),
			},
			precondition: EditorContextKeys.hasDefinitionProvider,
			keybinding: [{
				when: EditorContextKeys.editorTextFocus,
				primary: KeyCode.F12,
				weight: KeybindingWeight.EditorContrib
			}, {
				when: ContextKeyExpr.and(EditorContextKeys.editorTextFocus, IsWebContext),
				primary: KeyMod.CtrlCmd | KeyCode.F12,
				weight: KeybindingWeight.EditorContrib
			}],
			menu: [{
				id: MenuId.EditorContext,
				group: 'navigation',
				order: 1.1
			}, {
				id: MenuId.MenubarGoMenu,
				precondition: null,
				group: '4_symbol_nav',
				order: 2,
			}]
		});
		CommandsRegistry.registerCommandAlias('editor.action.goToDeclaration', GoToDefinitionAction.id);
	}
});

registerAction2(class OpenDefinitionToSideAction extends DefinitionAction {

	static readonly id = 'editor.action.revealDefinitionAside';

	constructor() {
		super({
			openToSide: true,
			openInPeek: false,
			muteMessage: false
		}, {
			id: OpenDefinitionToSideAction.id,
			title: nls.localize2('actions.goToDeclToSide.label', "Open Definition to the Side"),
			precondition: ContextKeyExpr.and(
				EditorContextKeys.hasDefinitionProvider,
				EditorContextKeys.isInEmbeddedEditor.toNegated()),
			keybinding: [{
				when: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.F12),
				weight: KeybindingWeight.EditorContrib
			}, {
				when: ContextKeyExpr.and(EditorContextKeys.editorTextFocus, IsWebContext),
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.F12),
				weight: KeybindingWeight.EditorContrib
			}]
		});
		CommandsRegistry.registerCommandAlias('editor.action.openDeclarationToTheSide', OpenDefinitionToSideAction.id);
	}
});

registerAction2(class PeekDefinitionAction extends DefinitionAction {

	static readonly id = 'editor.action.peekDefinition';

	constructor() {
		super({
			openToSide: false,
			openInPeek: true,
			muteMessage: false
		}, {
			id: PeekDefinitionAction.id,
			title: nls.localize2('actions.previewDecl.label', "Peek Definition"),
			precondition: ContextKeyExpr.and(
				EditorContextKeys.hasDefinitionProvider,
				PeekContext.notInPeekEditor,
				EditorContextKeys.isInEmbeddedEditor.toNegated()
			),
			keybinding: {
				when: EditorContextKeys.editorTextFocus,
				primary: KeyMod.Alt | KeyCode.F12,
				linux: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.F10 },
				weight: KeybindingWeight.EditorContrib
			},
			menu: {
				id: MenuId.EditorContextPeek,
				group: 'peek',
				order: 2
			}
		});
		CommandsRegistry.registerCommandAlias('editor.action.previewDeclaration', PeekDefinitionAction.id);
	}
});

//#endregion

//#region --- DECLARATION

class DeclarationAction extends SymbolNavigationAction {

	protected async _getLocationModel(languageFeaturesService: ILanguageFeaturesService, model: ITextModel, position: corePosition.Position, token: CancellationToken): Promise<ReferencesModel> {
		return new ReferencesModel(await getDeclarationsAtPosition(languageFeaturesService.declarationProvider, model, position, false, token), nls.localize('decl.title', 'Declarations'));
	}

	protected _getNoResultFoundMessage(info: IWordAtPosition | null): string {
		return info && info.word
			? nls.localize('decl.noResultWord', "No declaration found for '{0}'", info.word)
			: nls.localize('decl.generic.noResults', "No declaration found");
	}

	protected _getAlternativeCommand(editor: IActiveCodeEditor): string {
		return editor.getOption(EditorOption.gotoLocation).alternativeDeclarationCommand;
	}

	protected _getGoToPreference(editor: IActiveCodeEditor): GoToLocationValues {
		return editor.getOption(EditorOption.gotoLocation).multipleDeclarations;
	}
}

registerAction2(class GoToDeclarationAction extends DeclarationAction {

	static readonly id = 'editor.action.revealDeclaration';

	constructor() {
		super({
			openToSide: false,
			openInPeek: false,
			muteMessage: false
		}, {
			id: GoToDeclarationAction.id,
			title: {
				...nls.localize2('actions.goToDeclaration.label', "Go to Declaration"),
				mnemonicTitle: nls.localize({ key: 'miGotoDeclaration', comment: ['&& denotes a mnemonic'] }, "Go to &&Declaration"),
			},
			precondition: ContextKeyExpr.and(
				EditorContextKeys.hasDeclarationProvider,
				EditorContextKeys.isInEmbeddedEditor.toNegated()
			),
			menu: [{
				id: MenuId.EditorContext,
				group: 'navigation',
				order: 1.3
			}, {
				id: MenuId.MenubarGoMenu,
				precondition: null,
				group: '4_symbol_nav',
				order: 3,
			}],
		});
	}

	protected override _getNoResultFoundMessage(info: IWordAtPosition | null): string {
		return info && info.word
			? nls.localize('decl.noResultWord', "No declaration found for '{0}'", info.word)
			: nls.localize('decl.generic.noResults', "No declaration found");
	}
});

registerAction2(class PeekDeclarationAction extends DeclarationAction {
	constructor() {
		super({
			openToSide: false,
			openInPeek: true,
			muteMessage: false
		}, {
			id: 'editor.action.peekDeclaration',
			title: nls.localize2('actions.peekDecl.label', "Peek Declaration"),
			precondition: ContextKeyExpr.and(
				EditorContextKeys.hasDeclarationProvider,
				PeekContext.notInPeekEditor,
				EditorContextKeys.isInEmbeddedEditor.toNegated()
			),
			menu: {
				id: MenuId.EditorContextPeek,
				group: 'peek',
				order: 3
			}
		});
	}
});

//#endregion

//#region --- TYPE DEFINITION

class TypeDefinitionAction extends SymbolNavigationAction {

	protected async _getLocationModel(languageFeaturesService: ILanguageFeaturesService, model: ITextModel, position: corePosition.Position, token: CancellationToken): Promise<ReferencesModel> {
		return new ReferencesModel(await getTypeDefinitionsAtPosition(languageFeaturesService.typeDefinitionProvider, model, position, false, token), nls.localize('typedef.title', 'Type Definitions'));
	}

	protected _getNoResultFoundMessage(info: IWordAtPosition | null): string {
		return info && info.word
			? nls.localize('goToTypeDefinition.noResultWord', "No type definition found for '{0}'", info.word)
			: nls.localize('goToTypeDefinition.generic.noResults', "No type definition found");
	}

	protected _getAlternativeCommand(editor: IActiveCodeEditor): string {
		return editor.getOption(EditorOption.gotoLocation).alternativeTypeDefinitionCommand;
	}

	protected _getGoToPreference(editor: IActiveCodeEditor): GoToLocationValues {
		return editor.getOption(EditorOption.gotoLocation).multipleTypeDefinitions;
	}
}

registerAction2(class GoToTypeDefinitionAction extends TypeDefinitionAction {

	public static readonly ID = 'editor.action.goToTypeDefinition';

	constructor() {
		super({
			openToSide: false,
			openInPeek: false,
			muteMessage: false
		}, {
			id: GoToTypeDefinitionAction.ID,
			title: {
				...nls.localize2('actions.goToTypeDefinition.label', "Go to Type Definition"),
				mnemonicTitle: nls.localize({ key: 'miGotoTypeDefinition', comment: ['&& denotes a mnemonic'] }, "Go to &&Type Definition"),
			},
			precondition: EditorContextKeys.hasTypeDefinitionProvider,
			keybinding: {
				when: EditorContextKeys.editorTextFocus,
				primary: 0,
				weight: KeybindingWeight.EditorContrib
			},
			menu: [{
				id: MenuId.EditorContext,
				group: 'navigation',
				order: 1.4
			}, {
				id: MenuId.MenubarGoMenu,
				precondition: null,
				group: '4_symbol_nav',
				order: 3,
			}]
		});
	}
});

registerAction2(class PeekTypeDefinitionAction extends TypeDefinitionAction {

	public static readonly ID = 'editor.action.peekTypeDefinition';

	constructor() {
		super({
			openToSide: false,
			openInPeek: true,
			muteMessage: false
		}, {
			id: PeekTypeDefinitionAction.ID,
			title: nls.localize2('actions.peekTypeDefinition.label', "Peek Type Definition"),
			precondition: ContextKeyExpr.and(
				EditorContextKeys.hasTypeDefinitionProvider,
				PeekContext.notInPeekEditor,
				EditorContextKeys.isInEmbeddedEditor.toNegated()
			),
			menu: {
				id: MenuId.EditorContextPeek,
				group: 'peek',
				order: 4
			}
		});
	}
});

//#endregion

//#region --- IMPLEMENTATION

class ImplementationAction extends SymbolNavigationAction {

	protected async _getLocationModel(languageFeaturesService: ILanguageFeaturesService, model: ITextModel, position: corePosition.Position, token: CancellationToken): Promise<ReferencesModel> {
		return new ReferencesModel(await getImplementationsAtPosition(languageFeaturesService.implementationProvider, model, position, false, token), nls.localize('impl.title', 'Implementations'));
	}

	protected _getNoResultFoundMessage(info: IWordAtPosition | null): string {
		return info && info.word
			? nls.localize('goToImplementation.noResultWord', "No implementation found for '{0}'", info.word)
			: nls.localize('goToImplementation.generic.noResults', "No implementation found");
	}

	protected _getAlternativeCommand(editor: IActiveCodeEditor): string {
		return editor.getOption(EditorOption.gotoLocation).alternativeImplementationCommand;
	}

	protected _getGoToPreference(editor: IActiveCodeEditor): GoToLocationValues {
		return editor.getOption(EditorOption.gotoLocation).multipleImplementations;
	}
}

registerAction2(class GoToImplementationAction extends ImplementationAction {

	public static readonly ID = 'editor.action.goToImplementation';

	constructor() {
		super({
			openToSide: false,
			openInPeek: false,
			muteMessage: false
		}, {
			id: GoToImplementationAction.ID,
			title: {
				...nls.localize2('actions.goToImplementation.label', "Go to Implementations"),
				mnemonicTitle: nls.localize({ key: 'miGotoImplementation', comment: ['&& denotes a mnemonic'] }, "Go to &&Implementations"),
			},
			precondition: EditorContextKeys.hasImplementationProvider,
			keybinding: {
				when: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyCode.F12,
				weight: KeybindingWeight.EditorContrib
			},
			menu: [{
				id: MenuId.EditorContext,
				group: 'navigation',
				order: 1.45
			}, {
				id: MenuId.MenubarGoMenu,
				precondition: null,
				group: '4_symbol_nav',
				order: 4,
			}]
		});
	}
});

registerAction2(class PeekImplementationAction extends ImplementationAction {

	public static readonly ID = 'editor.action.peekImplementation';

	constructor() {
		super({
			openToSide: false,
			openInPeek: true,
			muteMessage: false
		}, {
			id: PeekImplementationAction.ID,
			title: nls.localize2('actions.peekImplementation.label', "Peek Implementations"),
			precondition: ContextKeyExpr.and(
				EditorContextKeys.hasImplementationProvider,
				PeekContext.notInPeekEditor,
				EditorContextKeys.isInEmbeddedEditor.toNegated()
			),
			keybinding: {
				when: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.F12,
				weight: KeybindingWeight.EditorContrib
			},
			menu: {
				id: MenuId.EditorContextPeek,
				group: 'peek',
				order: 5
			}
		});
	}
});

//#endregion

//#region --- REFERENCES

abstract class ReferencesAction extends SymbolNavigationAction {

	protected _getNoResultFoundMessage(info: IWordAtPosition | null): string {
		return info
			? nls.localize('references.no', "No references found for '{0}'", info.word)
			: nls.localize('references.noGeneric', "No references found");
	}

	protected _getAlternativeCommand(editor: IActiveCodeEditor): string {
		return editor.getOption(EditorOption.gotoLocation).alternativeReferenceCommand;
	}

	protected _getGoToPreference(editor: IActiveCodeEditor): GoToLocationValues {
		return editor.getOption(EditorOption.gotoLocation).multipleReferences;
	}
}

registerAction2(class GoToReferencesAction extends ReferencesAction {

	constructor() {
		super({
			openToSide: false,
			openInPeek: false,
			muteMessage: false
		}, {
			id: 'editor.action.goToReferences',
			title: {
				...nls.localize2('goToReferences.label', "Go to References"),
				mnemonicTitle: nls.localize({ key: 'miGotoReference', comment: ['&& denotes a mnemonic'] }, "Go to &&References"),
			},
			precondition: ContextKeyExpr.and(
				EditorContextKeys.hasReferenceProvider,
				PeekContext.notInPeekEditor,
				EditorContextKeys.isInEmbeddedEditor.toNegated()
			),
			keybinding: {
				when: EditorContextKeys.editorTextFocus,
				primary: KeyMod.Shift | KeyCode.F12,
				weight: KeybindingWeight.EditorContrib
			},
			menu: [{
				id: MenuId.EditorContext,
				group: 'navigation',
				order: 1.45
			}, {
				id: MenuId.MenubarGoMenu,
				precondition: null,
				group: '4_symbol_nav',
				order: 5,
			}]
		});
	}

	protected async _getLocationModel(languageFeaturesService: ILanguageFeaturesService, model: ITextModel, position: corePosition.Position, token: CancellationToken): Promise<ReferencesModel> {
		return new ReferencesModel(await getReferencesAtPosition(languageFeaturesService.referenceProvider, model, position, true, false, token), nls.localize('ref.title', 'References'));
	}
});

registerAction2(class PeekReferencesAction extends ReferencesAction {

	constructor() {
		super({
			openToSide: false,
			openInPeek: true,
			muteMessage: false
		}, {
			id: 'editor.action.referenceSearch.trigger',
			title: nls.localize2('references.action.label', "Peek References"),
			precondition: ContextKeyExpr.and(
				EditorContextKeys.hasReferenceProvider,
				PeekContext.notInPeekEditor,
				EditorContextKeys.isInEmbeddedEditor.toNegated()
			),
			menu: {
				id: MenuId.EditorContextPeek,
				group: 'peek',
				order: 6
			}
		});
	}

	protected async _getLocationModel(languageFeaturesService: ILanguageFeaturesService, model: ITextModel, position: corePosition.Position, token: CancellationToken): Promise<ReferencesModel> {
		return new ReferencesModel(await getReferencesAtPosition(languageFeaturesService.referenceProvider, model, position, false, false, token), nls.localize('ref.title', 'References'));
	}
});

//#endregion


//#region --- GENERIC goto symbols command

class GenericGoToLocationAction extends SymbolNavigationAction {

	constructor(
		config: SymbolNavigationActionConfig,
		private readonly _references: Location[],
		private readonly _gotoMultipleBehaviour: GoToLocationValues | undefined,
	) {
		super(config, {
			id: 'editor.action.goToLocation',
			title: nls.localize2('label.generic', "Go to Any Symbol"),
			precondition: ContextKeyExpr.and(
				PeekContext.notInPeekEditor,
				EditorContextKeys.isInEmbeddedEditor.toNegated()
			),
		});
	}

	protected async _getLocationModel(languageFeaturesService: ILanguageFeaturesService, _model: ITextModel, _position: corePosition.Position, _token: CancellationToken): Promise<ReferencesModel | undefined> {
		return new ReferencesModel(this._references, nls.localize('generic.title', 'Locations'));
	}

	protected _getNoResultFoundMessage(info: IWordAtPosition | null): string {
		return info && nls.localize('generic.noResult', "No results for '{0}'", info.word) || '';
	}

	protected _getGoToPreference(editor: IActiveCodeEditor): GoToLocationValues {
		return this._gotoMultipleBehaviour ?? editor.getOption(EditorOption.gotoLocation).multipleReferences;
	}

	protected _getAlternativeCommand(): undefined {
		return undefined;
	}
}

CommandsRegistry.registerCommand({
	id: 'editor.action.goToLocations',
	metadata: {
		description: 'Go to locations from a position in a file',
		args: [
			{ name: 'uri', description: 'The text document in which to start', constraint: URI },
			{ name: 'position', description: 'The position at which to start', constraint: corePosition.Position.isIPosition },
			{ name: 'locations', description: 'An array of locations.', constraint: Array },
			{ name: 'multiple', description: 'Define what to do when having multiple results, either `peek`, `gotoAndPeek`, or `goto`' },
			{ name: 'noResultsMessage', description: 'Human readable message that shows when locations is empty.' },
		]
	},
	handler: async (accessor: ServicesAccessor, resource: any, position: any, references: any, multiple?: any, noResultsMessage?: string, openInPeek?: boolean) => {
		assertType(URI.isUri(resource));
		assertType(corePosition.Position.isIPosition(position));
		assertType(Array.isArray(references));
		assertType(typeof multiple === 'undefined' || typeof multiple === 'string');
		assertType(typeof openInPeek === 'undefined' || typeof openInPeek === 'boolean');

		const editorService = accessor.get(ICodeEditorService);
		const editor = await editorService.openCodeEditor({ resource }, editorService.getFocusedCodeEditor());

		if (isCodeEditor(editor)) {
			editor.setPosition(position);
			editor.revealPositionInCenterIfOutsideViewport(position, ScrollType.Smooth);

			return editor.invokeWithinContext(accessor => {
				const command = new class extends GenericGoToLocationAction {
					protected override _getNoResultFoundMessage(info: IWordAtPosition | null) {
						return noResultsMessage || super._getNoResultFoundMessage(info);
					}
				}({
					muteMessage: !Boolean(noResultsMessage),
					openInPeek: Boolean(openInPeek),
					openToSide: false
				}, references, multiple as GoToLocationValues);

				accessor.get(IInstantiationService).invokeFunction(command.run.bind(command), editor);
			});
		}
	}
});

CommandsRegistry.registerCommand({
	id: 'editor.action.peekLocations',
	metadata: {
		description: 'Peek locations from a position in a file',
		args: [
			{ name: 'uri', description: 'The text document in which to start', constraint: URI },
			{ name: 'position', description: 'The position at which to start', constraint: corePosition.Position.isIPosition },
			{ name: 'locations', description: 'An array of locations.', constraint: Array },
			{ name: 'multiple', description: 'Define what to do when having multiple results, either `peek`, `gotoAndPeek`, or `goto`' },
		]
	},
	handler: async (accessor: ServicesAccessor, resource: any, position: any, references: any, multiple?: any) => {
		accessor.get(ICommandService).executeCommand('editor.action.goToLocations', resource, position, references, multiple, undefined, true);
	}
});

//#endregion


//#region --- REFERENCE search special commands

CommandsRegistry.registerCommand({
	id: 'editor.action.findReferences',
	handler: (accessor: ServicesAccessor, resource: any, position: any) => {
		assertType(URI.isUri(resource));
		assertType(corePosition.Position.isIPosition(position));

		const languageFeaturesService = accessor.get(ILanguageFeaturesService);
		const codeEditorService = accessor.get(ICodeEditorService);
		return codeEditorService.openCodeEditor({ resource }, codeEditorService.getFocusedCodeEditor()).then(control => {
			if (!isCodeEditor(control) || !control.hasModel()) {
				return undefined;
			}

			const controller = ReferencesController.get(control);
			if (!controller) {
				return undefined;
			}

			const references = createCancelablePromise(token => getReferencesAtPosition(languageFeaturesService.referenceProvider, control.getModel(), corePosition.Position.lift(position), false, false, token).then(references => new ReferencesModel(references, nls.localize('ref.title', 'References'))));
			const range = new Range(position.lineNumber, position.column, position.lineNumber, position.column);
			return Promise.resolve(controller.toggleWidget(range, references, false));
		});
	}
});

// use NEW command
CommandsRegistry.registerCommandAlias('editor.action.showReferences', 'editor.action.peekLocations');

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/gotoSymbol/browser/goToSymbol.ts]---
Location: vscode-main/src/vs/editor/contrib/gotoSymbol/browser/goToSymbol.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { matchesSomeScheme, Schemas } from '../../../../base/common/network.js';
import { registerModelAndPositionCommand } from '../../../browser/editorExtensions.js';
import { Position } from '../../../common/core/position.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { DeclarationProvider, DefinitionProvider, ImplementationProvider, LocationLink, ProviderResult, ReferenceProvider, TypeDefinitionProvider } from '../../../common/languages.js';
import { ITextModel } from '../../../common/model.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { ReferencesModel } from './referencesModel.js';

function shouldIncludeLocationLink(sourceModel: ITextModel, loc: LocationLink): boolean {
	// Always allow the location if the request comes from a document with the same scheme.
	if (loc.uri.scheme === sourceModel.uri.scheme) {
		return true;
	}

	// Otherwise filter out locations from internal schemes
	if (matchesSomeScheme(loc.uri, Schemas.walkThroughSnippet, Schemas.vscodeChatCodeBlock, Schemas.vscodeChatCodeCompareBlock)) {
		return false;
	}

	return true;
}

async function getLocationLinks<T>(
	model: ITextModel,
	position: Position,
	registry: LanguageFeatureRegistry<T>,
	recursive: boolean,
	provide: (provider: T, model: ITextModel, position: Position) => ProviderResult<LocationLink | LocationLink[]>
): Promise<LocationLink[]> {
	const provider = registry.ordered(model, recursive);

	// get results
	const promises = provider.map((provider): Promise<LocationLink | LocationLink[] | undefined> => {
		return Promise.resolve(provide(provider, model, position)).then(undefined, err => {
			onUnexpectedExternalError(err);
			return undefined;
		});
	});

	const values = await Promise.all(promises);
	return coalesce(values.flat()).filter(loc => shouldIncludeLocationLink(model, loc));
}

export function getDefinitionsAtPosition(registry: LanguageFeatureRegistry<DefinitionProvider>, model: ITextModel, position: Position, recursive: boolean, token: CancellationToken): Promise<LocationLink[]> {
	return getLocationLinks(model, position, registry, recursive, (provider, model, position) => {
		return provider.provideDefinition(model, position, token);
	});
}

export function getDeclarationsAtPosition(registry: LanguageFeatureRegistry<DeclarationProvider>, model: ITextModel, position: Position, recursive: boolean, token: CancellationToken): Promise<LocationLink[]> {
	return getLocationLinks(model, position, registry, recursive, (provider, model, position) => {
		return provider.provideDeclaration(model, position, token);
	});
}

export function getImplementationsAtPosition(registry: LanguageFeatureRegistry<ImplementationProvider>, model: ITextModel, position: Position, recursive: boolean, token: CancellationToken): Promise<LocationLink[]> {
	return getLocationLinks(model, position, registry, recursive, (provider, model, position) => {
		return provider.provideImplementation(model, position, token);
	});
}

export function getTypeDefinitionsAtPosition(registry: LanguageFeatureRegistry<TypeDefinitionProvider>, model: ITextModel, position: Position, recursive: boolean, token: CancellationToken): Promise<LocationLink[]> {
	return getLocationLinks(model, position, registry, recursive, (provider, model, position) => {
		return provider.provideTypeDefinition(model, position, token);
	});
}

export function getReferencesAtPosition(registry: LanguageFeatureRegistry<ReferenceProvider>, model: ITextModel, position: Position, compact: boolean, recursive: boolean, token: CancellationToken): Promise<LocationLink[]> {
	return getLocationLinks(model, position, registry, recursive, async (provider, model, position) => {
		const result = (await provider.provideReferences(model, position, { includeDeclaration: true }, token))?.filter(ref => shouldIncludeLocationLink(model, ref));
		if (!compact || !result || result.length !== 2) {
			return result;
		}
		const resultWithoutDeclaration = (await provider.provideReferences(model, position, { includeDeclaration: false }, token))?.filter(ref => shouldIncludeLocationLink(model, ref));
		if (resultWithoutDeclaration && resultWithoutDeclaration.length === 1) {
			return resultWithoutDeclaration;
		}
		return result;
	});
}

// -- API commands ----

async function _sortedAndDeduped(callback: () => Promise<LocationLink[]>): Promise<LocationLink[]> {
	const rawLinks = await callback();
	const model = new ReferencesModel(rawLinks, '');
	const modelLinks = model.references.map(ref => ref.link);
	model.dispose();
	return modelLinks;
}

registerModelAndPositionCommand('_executeDefinitionProvider', (accessor, model, position) => {
	const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	const promise = getDefinitionsAtPosition(languageFeaturesService.definitionProvider, model, position, false, CancellationToken.None);
	return _sortedAndDeduped(() => promise);
});

registerModelAndPositionCommand('_executeDefinitionProvider_recursive', (accessor, model, position) => {
	const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	const promise = getDefinitionsAtPosition(languageFeaturesService.definitionProvider, model, position, true, CancellationToken.None);
	return _sortedAndDeduped(() => promise);
});

registerModelAndPositionCommand('_executeTypeDefinitionProvider', (accessor, model, position) => {
	const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	const promise = getTypeDefinitionsAtPosition(languageFeaturesService.typeDefinitionProvider, model, position, false, CancellationToken.None);
	return _sortedAndDeduped(() => promise);
});

registerModelAndPositionCommand('_executeTypeDefinitionProvider_recursive', (accessor, model, position) => {
	const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	const promise = getTypeDefinitionsAtPosition(languageFeaturesService.typeDefinitionProvider, model, position, true, CancellationToken.None);
	return _sortedAndDeduped(() => promise);
});

registerModelAndPositionCommand('_executeDeclarationProvider', (accessor, model, position) => {
	const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	const promise = getDeclarationsAtPosition(languageFeaturesService.declarationProvider, model, position, false, CancellationToken.None);
	return _sortedAndDeduped(() => promise);
});
registerModelAndPositionCommand('_executeDeclarationProvider_recursive', (accessor, model, position) => {
	const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	const promise = getDeclarationsAtPosition(languageFeaturesService.declarationProvider, model, position, true, CancellationToken.None);
	return _sortedAndDeduped(() => promise);
});

registerModelAndPositionCommand('_executeReferenceProvider', (accessor, model, position) => {
	const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	const promise = getReferencesAtPosition(languageFeaturesService.referenceProvider, model, position, false, false, CancellationToken.None);
	return _sortedAndDeduped(() => promise);
});

registerModelAndPositionCommand('_executeReferenceProvider_recursive', (accessor, model, position) => {
	const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	const promise = getReferencesAtPosition(languageFeaturesService.referenceProvider, model, position, false, true, CancellationToken.None);
	return _sortedAndDeduped(() => promise);
});

registerModelAndPositionCommand('_executeImplementationProvider', (accessor, model, position) => {
	const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	const promise = getImplementationsAtPosition(languageFeaturesService.implementationProvider, model, position, false, CancellationToken.None);
	return _sortedAndDeduped(() => promise);
});

registerModelAndPositionCommand('_executeImplementationProvider_recursive', (accessor, model, position) => {
	const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	const promise = getImplementationsAtPosition(languageFeaturesService.implementationProvider, model, position, true, CancellationToken.None);
	return _sortedAndDeduped(() => promise);
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/gotoSymbol/browser/referencesModel.ts]---
Location: vscode-main/src/vs/editor/contrib/gotoSymbol/browser/referencesModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IMatch } from '../../../../base/common/filters.js';
import { defaultGenerator } from '../../../../base/common/idGenerator.js';
import { dispose, IDisposable, IReference } from '../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { basename, extUri } from '../../../../base/common/resources.js';
import * as strings from '../../../../base/common/strings.js';
import { Constants } from '../../../../base/common/uint.js';
import { URI } from '../../../../base/common/uri.js';
import { Position } from '../../../common/core/position.js';
import { IRange, Range } from '../../../common/core/range.js';
import { Location, LocationLink } from '../../../common/languages.js';
import { ITextEditorModel, ITextModelService } from '../../../common/services/resolverService.js';
import { localize } from '../../../../nls.js';

export class OneReference {

	readonly id: string = defaultGenerator.nextId();

	private _range?: IRange;

	constructor(
		readonly isProviderFirst: boolean,
		readonly parent: FileReferences,
		readonly link: LocationLink,
		private _rangeCallback: (ref: OneReference) => void
	) { }

	get uri() {
		return this.link.uri;
	}

	get range(): IRange {
		return this._range ?? this.link.targetSelectionRange ?? this.link.range;
	}

	set range(value: IRange) {
		this._range = value;
		this._rangeCallback(this);
	}

	get ariaMessage(): string {

		const preview = this.parent.getPreview(this)?.preview(this.range);

		if (!preview) {
			return localize(
				'aria.oneReference', "in {0} on line {1} at column {2}",
				basename(this.uri), this.range.startLineNumber, this.range.startColumn
			);
		} else {
			return localize(
				{ key: 'aria.oneReference.preview', comment: ['Placeholders are: 0: filename, 1:line number, 2: column number, 3: preview snippet of source code'] }, "{0} in {1} on line {2} at column {3}",
				preview.value, basename(this.uri), this.range.startLineNumber, this.range.startColumn
			);
		}
	}
}

export class FilePreview implements IDisposable {

	constructor(
		private readonly _modelReference: IReference<ITextEditorModel>
	) { }

	dispose(): void {
		this._modelReference.dispose();
	}

	preview(range: IRange, n: number = 8): { value: string; highlight: IMatch } | undefined {
		const model = this._modelReference.object.textEditorModel;

		if (!model) {
			return undefined;
		}

		const { startLineNumber, startColumn, endLineNumber, endColumn } = range;
		const word = model.getWordUntilPosition({ lineNumber: startLineNumber, column: startColumn - n });
		const beforeRange = new Range(startLineNumber, word.startColumn, startLineNumber, startColumn);
		const afterRange = new Range(endLineNumber, endColumn, endLineNumber, Constants.MAX_SAFE_SMALL_INTEGER);

		const before = model.getValueInRange(beforeRange).replace(/^\s+/, '');
		const inside = model.getValueInRange(range);
		const after = model.getValueInRange(afterRange).replace(/\s+$/, '');

		return {
			value: before + inside + after,
			highlight: { start: before.length, end: before.length + inside.length }
		};
	}
}

export class FileReferences implements IDisposable {

	readonly children: OneReference[] = [];

	private _previews = new ResourceMap<FilePreview>();

	constructor(
		readonly parent: ReferencesModel,
		readonly uri: URI
	) { }

	dispose(): void {
		dispose(this._previews.values());
		this._previews.clear();
	}

	getPreview(child: OneReference): FilePreview | undefined {
		return this._previews.get(child.uri);
	}

	get ariaMessage(): string {
		const len = this.children.length;
		if (len === 1) {
			return localize('aria.fileReferences.1', "1 symbol in {0}, full path {1}", basename(this.uri), this.uri.fsPath);
		} else {
			return localize('aria.fileReferences.N', "{0} symbols in {1}, full path {2}", len, basename(this.uri), this.uri.fsPath);
		}
	}

	async resolve(textModelResolverService: ITextModelService): Promise<FileReferences> {
		if (this._previews.size !== 0) {
			return this;
		}
		for (const child of this.children) {
			if (this._previews.has(child.uri)) {
				continue;
			}
			try {
				const ref = await textModelResolverService.createModelReference(child.uri);
				this._previews.set(child.uri, new FilePreview(ref));
			} catch (err) {
				onUnexpectedError(err);
			}
		}
		return this;
	}
}

export class ReferencesModel implements IDisposable {

	private readonly _links: LocationLink[];
	private readonly _title: string;

	readonly groups: FileReferences[] = [];
	readonly references: OneReference[] = [];

	readonly _onDidChangeReferenceRange = new Emitter<OneReference>();
	readonly onDidChangeReferenceRange: Event<OneReference> = this._onDidChangeReferenceRange.event;

	constructor(links: LocationLink[], title: string) {
		this._links = links;
		this._title = title;

		// grouping and sorting
		const [providersFirst] = links;
		links.sort(ReferencesModel._compareReferences);

		let current: FileReferences | undefined;
		for (const link of links) {
			if (!current || !extUri.isEqual(current.uri, link.uri, true)) {
				// new group
				current = new FileReferences(this, link.uri);
				this.groups.push(current);
			}

			// append, check for equality first!
			if (current.children.length === 0 || ReferencesModel._compareReferences(link, current.children[current.children.length - 1]) !== 0) {

				const oneRef = new OneReference(
					providersFirst === link,
					current,
					link,
					ref => this._onDidChangeReferenceRange.fire(ref)
				);
				this.references.push(oneRef);
				current.children.push(oneRef);
			}
		}
	}

	dispose(): void {
		dispose(this.groups);
		this._onDidChangeReferenceRange.dispose();
		this.groups.length = 0;
	}

	clone(): ReferencesModel {
		return new ReferencesModel(this._links, this._title);
	}

	get title(): string {
		return this._title;
	}

	get isEmpty(): boolean {
		return this.groups.length === 0;
	}

	get ariaMessage(): string {
		if (this.isEmpty) {
			return localize('aria.result.0', "No results found");
		} else if (this.references.length === 1) {
			return localize('aria.result.1', "Found 1 symbol in {0}", this.references[0].uri.fsPath);
		} else if (this.groups.length === 1) {
			return localize('aria.result.n1', "Found {0} symbols in {1}", this.references.length, this.groups[0].uri.fsPath);
		} else {
			return localize('aria.result.nm', "Found {0} symbols in {1} files", this.references.length, this.groups.length);
		}
	}

	nextOrPreviousReference(reference: OneReference, next: boolean): OneReference {

		const { parent } = reference;

		let idx = parent.children.indexOf(reference);
		const childCount = parent.children.length;
		const groupCount = parent.parent.groups.length;

		if (groupCount === 1 || next && idx + 1 < childCount || !next && idx > 0) {
			// cycling within one file
			if (next) {
				idx = (idx + 1) % childCount;
			} else {
				idx = (idx + childCount - 1) % childCount;
			}
			return parent.children[idx];
		}

		idx = parent.parent.groups.indexOf(parent);
		if (next) {
			idx = (idx + 1) % groupCount;
			return parent.parent.groups[idx].children[0];
		} else {
			idx = (idx + groupCount - 1) % groupCount;
			return parent.parent.groups[idx].children[parent.parent.groups[idx].children.length - 1];
		}
	}

	nearestReference(resource: URI, position: Position): OneReference | undefined {

		const nearest = this.references.map((ref, idx) => {
			return {
				idx,
				prefixLen: strings.commonPrefixLength(ref.uri.toString(), resource.toString()),
				offsetDist: Math.abs(ref.range.startLineNumber - position.lineNumber) * 100 + Math.abs(ref.range.startColumn - position.column)
			};
		}).sort((a, b) => {
			if (a.prefixLen > b.prefixLen) {
				return -1;
			} else if (a.prefixLen < b.prefixLen) {
				return 1;
			} else if (a.offsetDist < b.offsetDist) {
				return -1;
			} else if (a.offsetDist > b.offsetDist) {
				return 1;
			} else {
				return 0;
			}
		})[0];

		if (nearest) {
			return this.references[nearest.idx];
		}
		return undefined;
	}

	referenceAt(resource: URI, position: Position): OneReference | undefined {
		for (const ref of this.references) {
			if (ref.uri.toString() === resource.toString()) {
				if (Range.containsPosition(ref.range, position)) {
					return ref;
				}
			}
		}
		return undefined;
	}

	firstReference(): OneReference | undefined {
		for (const ref of this.references) {
			if (ref.isProviderFirst) {
				return ref;
			}
		}
		return this.references[0];
	}

	private static _compareReferences(a: Location, b: Location): number {
		return extUri.compare(a.uri, b.uri) || Range.compareRangesUsingStarts(a.range, b.range);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/gotoSymbol/browser/symbolNavigation.ts]---
Location: vscode-main/src/vs/editor/contrib/gotoSymbol/browser/symbolNavigation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { combinedDisposable, DisposableStore, dispose, IDisposable } from '../../../../base/common/lifecycle.js';
import { isEqual } from '../../../../base/common/resources.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorCommand, registerEditorCommand } from '../../../browser/editorExtensions.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { Range } from '../../../common/core/range.js';
import { OneReference, ReferencesModel } from './referencesModel.js';
import { localize } from '../../../../nls.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { TextEditorSelectionRevealType } from '../../../../platform/editor/common/editor.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { INotificationService, IStatusHandle } from '../../../../platform/notification/common/notification.js';

export const ctxHasSymbols = new RawContextKey('hasSymbols', false, localize('hasSymbols', "Whether there are symbol locations that can be navigated via keyboard-only."));

export const ISymbolNavigationService = createDecorator<ISymbolNavigationService>('ISymbolNavigationService');

export interface ISymbolNavigationService {
	readonly _serviceBrand: undefined;
	reset(): void;
	put(anchor: OneReference): void;
	revealNext(source: ICodeEditor): Promise<any>;
}

class SymbolNavigationService implements ISymbolNavigationService {

	declare readonly _serviceBrand: undefined;

	private readonly _ctxHasSymbols: IContextKey<boolean>;

	private _currentModel?: ReferencesModel = undefined;
	private _currentIdx: number = -1;
	private _currentState?: IDisposable;
	private _currentMessage?: IStatusHandle;
	private _ignoreEditorChange: boolean = false;

	constructor(
		@IContextKeyService contextKeyService: IContextKeyService,
		@ICodeEditorService private readonly _editorService: ICodeEditorService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
	) {
		this._ctxHasSymbols = ctxHasSymbols.bindTo(contextKeyService);
	}

	reset(): void {
		this._ctxHasSymbols.reset();
		this._currentState?.dispose();
		this._currentMessage?.close();
		this._currentModel = undefined;
		this._currentIdx = -1;
	}

	put(anchor: OneReference): void {
		const refModel = anchor.parent.parent;

		if (refModel.references.length <= 1) {
			this.reset();
			return;
		}

		this._currentModel = refModel;
		this._currentIdx = refModel.references.indexOf(anchor);
		this._ctxHasSymbols.set(true);
		this._showMessage();

		const editorState = new EditorState(this._editorService);
		const listener = editorState.onDidChange(_ => {

			if (this._ignoreEditorChange) {
				return;
			}

			const editor = this._editorService.getActiveCodeEditor();
			if (!editor) {
				return;
			}
			const model = editor.getModel();
			const position = editor.getPosition();
			if (!model || !position) {
				return;
			}

			let seenUri: boolean = false;
			let seenPosition: boolean = false;
			for (const reference of refModel.references) {
				if (isEqual(reference.uri, model.uri)) {
					seenUri = true;
					seenPosition = seenPosition || Range.containsPosition(reference.range, position);
				} else if (seenUri) {
					break;
				}
			}
			if (!seenUri || !seenPosition) {
				this.reset();
			}
		});

		this._currentState = combinedDisposable(editorState, listener);
	}

	revealNext(source: ICodeEditor): Promise<any> {
		if (!this._currentModel) {
			return Promise.resolve();
		}

		// get next result and advance
		this._currentIdx += 1;
		this._currentIdx %= this._currentModel.references.length;
		const reference = this._currentModel.references[this._currentIdx];

		// status
		this._showMessage();

		// open editor, ignore events while that happens
		this._ignoreEditorChange = true;
		return this._editorService.openCodeEditor({
			resource: reference.uri,
			options: {
				selection: Range.collapseToStart(reference.range),
				selectionRevealType: TextEditorSelectionRevealType.NearTopIfOutsideViewport
			}
		}, source).finally(() => {
			this._ignoreEditorChange = false;
		});

	}

	private _showMessage(): void {

		this._currentMessage?.close();

		const kb = this._keybindingService.lookupKeybinding('editor.gotoNextSymbolFromResult');
		const message = kb
			? localize('location.kb', "Symbol {0} of {1}, {2} for next", this._currentIdx + 1, this._currentModel!.references.length, kb.getLabel())
			: localize('location', "Symbol {0} of {1}", this._currentIdx + 1, this._currentModel!.references.length);

		this._currentMessage = this._notificationService.status(message);
	}
}

registerSingleton(ISymbolNavigationService, SymbolNavigationService, InstantiationType.Delayed);

registerEditorCommand(new class extends EditorCommand {

	constructor() {
		super({
			id: 'editor.gotoNextSymbolFromResult',
			precondition: ctxHasSymbols,
			kbOpts: {
				weight: KeybindingWeight.EditorContrib,
				primary: KeyCode.F12
			}
		});
	}

	runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor): void | Promise<void> {
		return accessor.get(ISymbolNavigationService).revealNext(editor);
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'editor.gotoNextSymbolFromResult.cancel',
	weight: KeybindingWeight.EditorContrib,
	when: ctxHasSymbols,
	primary: KeyCode.Escape,
	handler(accessor) {
		accessor.get(ISymbolNavigationService).reset();
	}
});

//

class EditorState {

	private readonly _listener = new Map<ICodeEditor, IDisposable>();
	private readonly _disposables = new DisposableStore();

	private readonly _onDidChange = new Emitter<{ editor: ICodeEditor }>();
	readonly onDidChange: Event<{ editor: ICodeEditor }> = this._onDidChange.event;

	constructor(@ICodeEditorService editorService: ICodeEditorService) {
		this._disposables.add(editorService.onCodeEditorRemove(this._onDidRemoveEditor, this));
		this._disposables.add(editorService.onCodeEditorAdd(this._onDidAddEditor, this));
		editorService.listCodeEditors().forEach(this._onDidAddEditor, this);
	}

	dispose(): void {
		this._disposables.dispose();
		this._onDidChange.dispose();
		dispose(this._listener.values());
	}

	private _onDidAddEditor(editor: ICodeEditor): void {
		this._listener.set(editor, combinedDisposable(
			editor.onDidChangeCursorPosition(_ => this._onDidChange.fire({ editor })),
			editor.onDidChangeModelContent(_ => this._onDidChange.fire({ editor })),
		));
	}

	private _onDidRemoveEditor(editor: ICodeEditor): void {
		this._listener.get(editor)?.dispose();
		this._listener.delete(editor);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/gotoSymbol/browser/link/clickLinkGesture.ts]---
Location: vscode-main/src/vs/editor/contrib/gotoSymbol/browser/link/clickLinkGesture.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IKeyboardEvent } from '../../../../../base/browser/keyboardEvent.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { KeyCode } from '../../../../../base/common/keyCodes.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import * as platform from '../../../../../base/common/platform.js';
import { ICodeEditor, IEditorMouseEvent, IMouseTarget } from '../../../../browser/editorBrowser.js';
import { EditorOption, MouseMiddleClickAction } from '../../../../common/config/editorOptions.js';
import { ICursorSelectionChangedEvent } from '../../../../common/cursorEvents.js';

function hasModifier(e: { ctrlKey: boolean; shiftKey: boolean; altKey: boolean; metaKey: boolean }, modifier: 'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey'): boolean {
	return !!e[modifier];
}

/**
 * An event that encapsulates the various trigger modifiers logic needed for go to definition.
 */
export class ClickLinkMouseEvent {

	public readonly target: IMouseTarget;
	public readonly hasTriggerModifier: boolean;
	public readonly hasSideBySideModifier: boolean;
	public readonly isNoneOrSingleMouseDown: boolean;
	public readonly isLeftClick: boolean;
	public readonly isMiddleClick: boolean;
	public readonly isRightClick: boolean;

	public readonly mouseMiddleClickAction: MouseMiddleClickAction;

	constructor(source: IEditorMouseEvent, opts: ClickLinkOptions) {
		this.target = source.target;
		this.isLeftClick = source.event.leftButton;
		this.isMiddleClick = source.event.middleButton;
		this.isRightClick = source.event.rightButton;
		this.mouseMiddleClickAction = opts.mouseMiddleClickAction;
		this.hasTriggerModifier = hasModifier(source.event, opts.triggerModifier);

		if (this.isMiddleClick && opts.mouseMiddleClickAction === 'ctrlLeftClick') {
			// Redirect middle click to left click with modifier
			this.isMiddleClick = false;
			this.isLeftClick = true;
			this.hasTriggerModifier = true;
		}
		this.hasSideBySideModifier = hasModifier(source.event, opts.triggerSideBySideModifier);
		this.isNoneOrSingleMouseDown = (source.event.detail <= 1);
	}
}

/**
 * An event that encapsulates the various trigger modifiers logic needed for go to definition.
 */
export class ClickLinkKeyboardEvent {

	public readonly keyCodeIsTriggerKey: boolean;
	public readonly keyCodeIsSideBySideKey: boolean;
	public readonly hasTriggerModifier: boolean;

	constructor(source: IKeyboardEvent, opts: ClickLinkOptions) {
		this.keyCodeIsTriggerKey = (source.keyCode === opts.triggerKey);
		this.keyCodeIsSideBySideKey = (source.keyCode === opts.triggerSideBySideKey);
		this.hasTriggerModifier = hasModifier(source, opts.triggerModifier);
	}
}
export type TriggerModifier = 'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey';

export class ClickLinkOptions {

	public readonly triggerKey: KeyCode;
	public readonly triggerModifier: TriggerModifier;
	public readonly triggerSideBySideKey: KeyCode;
	public readonly triggerSideBySideModifier: TriggerModifier;

	constructor(
		triggerKey: KeyCode,
		triggerModifier: TriggerModifier,
		triggerSideBySideKey: KeyCode,
		triggerSideBySideModifier: TriggerModifier,
		public readonly mouseMiddleClickAction: MouseMiddleClickAction,
	) {
		this.triggerKey = triggerKey;
		this.triggerModifier = triggerModifier;
		this.triggerSideBySideKey = triggerSideBySideKey;
		this.triggerSideBySideModifier = triggerSideBySideModifier;
	}

	public equals(other: ClickLinkOptions): boolean {
		return (
			this.triggerKey === other.triggerKey
			&& this.triggerModifier === other.triggerModifier
			&& this.triggerSideBySideKey === other.triggerSideBySideKey
			&& this.triggerSideBySideModifier === other.triggerSideBySideModifier
			&& this.mouseMiddleClickAction === other.mouseMiddleClickAction
		);
	}
}

function createOptions(multiCursorModifier: 'altKey' | 'ctrlKey' | 'metaKey', mouseMiddleClickAction: MouseMiddleClickAction): ClickLinkOptions {
	if (multiCursorModifier === 'altKey') {
		if (platform.isMacintosh) {
			return new ClickLinkOptions(KeyCode.Meta, 'metaKey', KeyCode.Alt, 'altKey', mouseMiddleClickAction);
		}
		return new ClickLinkOptions(KeyCode.Ctrl, 'ctrlKey', KeyCode.Alt, 'altKey', mouseMiddleClickAction);
	}

	if (platform.isMacintosh) {
		return new ClickLinkOptions(KeyCode.Alt, 'altKey', KeyCode.Meta, 'metaKey', mouseMiddleClickAction);
	}
	return new ClickLinkOptions(KeyCode.Alt, 'altKey', KeyCode.Ctrl, 'ctrlKey', mouseMiddleClickAction);
}

export interface IClickLinkGestureOptions {
	/**
	 * Return 0 if the mouse event should not be considered.
	 */
	extractLineNumberFromMouseEvent?: (e: ClickLinkMouseEvent) => number;
}

export class ClickLinkGesture extends Disposable {

	private readonly _onMouseMoveOrRelevantKeyDown: Emitter<[ClickLinkMouseEvent, ClickLinkKeyboardEvent | null]> = this._register(new Emitter<[ClickLinkMouseEvent, ClickLinkKeyboardEvent | null]>());
	public readonly onMouseMoveOrRelevantKeyDown: Event<[ClickLinkMouseEvent, ClickLinkKeyboardEvent | null]> = this._onMouseMoveOrRelevantKeyDown.event;

	private readonly _onExecute: Emitter<ClickLinkMouseEvent> = this._register(new Emitter<ClickLinkMouseEvent>());
	public readonly onExecute: Event<ClickLinkMouseEvent> = this._onExecute.event;

	private readonly _onCancel: Emitter<void> = this._register(new Emitter<void>());
	public readonly onCancel: Event<void> = this._onCancel.event;

	private readonly _editor: ICodeEditor;
	private readonly _extractLineNumberFromMouseEvent: (e: ClickLinkMouseEvent) => number;
	private _opts: ClickLinkOptions;

	private _lastMouseMoveEvent: ClickLinkMouseEvent | null;
	private _hasTriggerKeyOnMouseDown: boolean;
	private _lineNumberOnMouseDown: number;

	constructor(editor: ICodeEditor, opts?: IClickLinkGestureOptions) {
		super();

		this._editor = editor;
		this._extractLineNumberFromMouseEvent = opts?.extractLineNumberFromMouseEvent ?? ((e) => e.target.position ? e.target.position.lineNumber : 0);
		this._opts = createOptions(this._editor.getOption(EditorOption.multiCursorModifier), this._editor.getOption(EditorOption.mouseMiddleClickAction));

		this._lastMouseMoveEvent = null;
		this._hasTriggerKeyOnMouseDown = false;
		this._lineNumberOnMouseDown = 0;

		this._register(this._editor.onDidChangeConfiguration((e) => {
			if (e.hasChanged(EditorOption.multiCursorModifier) || e.hasChanged(EditorOption.mouseMiddleClickAction)) {
				const newOpts = createOptions(this._editor.getOption(EditorOption.multiCursorModifier), this._editor.getOption(EditorOption.mouseMiddleClickAction));
				if (this._opts.equals(newOpts)) {
					return;
				}
				this._opts = newOpts;
				this._lastMouseMoveEvent = null;
				this._hasTriggerKeyOnMouseDown = false;
				this._lineNumberOnMouseDown = 0;
				this._onCancel.fire();
			}
		}));
		this._register(this._editor.onMouseMove((e: IEditorMouseEvent) => this._onEditorMouseMove(new ClickLinkMouseEvent(e, this._opts))));
		this._register(this._editor.onMouseDown((e: IEditorMouseEvent) => this._onEditorMouseDown(new ClickLinkMouseEvent(e, this._opts))));
		this._register(this._editor.onMouseUp((e: IEditorMouseEvent) => this._onEditorMouseUp(new ClickLinkMouseEvent(e, this._opts))));
		this._register(this._editor.onKeyDown((e: IKeyboardEvent) => this._onEditorKeyDown(new ClickLinkKeyboardEvent(e, this._opts))));
		this._register(this._editor.onKeyUp((e: IKeyboardEvent) => this._onEditorKeyUp(new ClickLinkKeyboardEvent(e, this._opts))));
		this._register(this._editor.onMouseDrag(() => this._resetHandler()));

		this._register(this._editor.onDidChangeCursorSelection((e) => this._onDidChangeCursorSelection(e)));
		this._register(this._editor.onDidChangeModel((e) => this._resetHandler()));
		this._register(this._editor.onDidChangeModelContent(() => this._resetHandler()));
		this._register(this._editor.onDidScrollChange((e) => {
			if (e.scrollTopChanged || e.scrollLeftChanged) {
				this._resetHandler();
			}
		}));
	}

	private _onDidChangeCursorSelection(e: ICursorSelectionChangedEvent): void {
		if (e.selection && e.selection.startColumn !== e.selection.endColumn) {
			this._resetHandler(); // immediately stop this feature if the user starts to select (https://github.com/microsoft/vscode/issues/7827)
		}
	}

	private _onEditorMouseMove(mouseEvent: ClickLinkMouseEvent): void {
		this._lastMouseMoveEvent = mouseEvent;

		this._onMouseMoveOrRelevantKeyDown.fire([mouseEvent, null]);
	}

	private _onEditorMouseDown(mouseEvent: ClickLinkMouseEvent): void {
		// We need to record if we had the trigger key on mouse down because someone might select something in the editor
		// holding the mouse down and then while mouse is down start to press Ctrl/Cmd to start a copy operation and then
		// release the mouse button without wanting to do the navigation.
		// With this flag we prevent goto definition if the mouse was down before the trigger key was pressed.
		this._hasTriggerKeyOnMouseDown = mouseEvent.hasTriggerModifier;
		this._lineNumberOnMouseDown = this._extractLineNumberFromMouseEvent(mouseEvent);
	}

	private _onEditorMouseUp(mouseEvent: ClickLinkMouseEvent): void {
		const currentLineNumber = this._extractLineNumberFromMouseEvent(mouseEvent);
		const lineNumbersCorrect = !!this._lineNumberOnMouseDown && this._lineNumberOnMouseDown === currentLineNumber;
		if (lineNumbersCorrect && (this._hasTriggerKeyOnMouseDown || (mouseEvent.isMiddleClick && mouseEvent.mouseMiddleClickAction === 'openLink'))) {
			this._onExecute.fire(mouseEvent);
		}
	}

	private _onEditorKeyDown(e: ClickLinkKeyboardEvent): void {
		if (
			this._lastMouseMoveEvent
			&& (
				e.keyCodeIsTriggerKey // User just pressed Ctrl/Cmd (normal goto definition)
				|| (e.keyCodeIsSideBySideKey && e.hasTriggerModifier) // User pressed Ctrl/Cmd+Alt (goto definition to the side)
			)
		) {
			this._onMouseMoveOrRelevantKeyDown.fire([this._lastMouseMoveEvent, e]);
		} else if (e.hasTriggerModifier) {
			this._onCancel.fire(); // remove decorations if user holds another key with ctrl/cmd to prevent accident goto declaration
		}
	}

	private _onEditorKeyUp(e: ClickLinkKeyboardEvent): void {
		if (e.keyCodeIsTriggerKey) {
			this._onCancel.fire();
		}
	}

	private _resetHandler(): void {
		this._lastMouseMoveEvent = null;
		this._hasTriggerKeyOnMouseDown = false;
		this._onCancel.fire();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/gotoSymbol/browser/link/goToDefinitionAtPosition.css]---
Location: vscode-main/src/vs/editor/contrib/gotoSymbol/browser/link/goToDefinitionAtPosition.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .goto-definition-link {
	text-decoration: underline;
	cursor: pointer;
	color: var(--vscode-editorLink-activeForeground) !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/gotoSymbol/browser/link/goToDefinitionAtPosition.ts]---
Location: vscode-main/src/vs/editor/contrib/gotoSymbol/browser/link/goToDefinitionAtPosition.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IKeyboardEvent } from '../../../../../base/browser/keyboardEvent.js';
import { CancelablePromise, createCancelablePromise } from '../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { onUnexpectedError } from '../../../../../base/common/errors.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import './goToDefinitionAtPosition.css';
import { CodeEditorStateFlag, EditorState } from '../../../editorState/browser/editorState.js';
import { ICodeEditor, MouseTargetType } from '../../../../browser/editorBrowser.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../../browser/editorExtensions.js';
import { EditorOption } from '../../../../common/config/editorOptions.js';
import { Position } from '../../../../common/core/position.js';
import { IRange, Range } from '../../../../common/core/range.js';
import { IEditorContribution, IEditorDecorationsCollection } from '../../../../common/editorCommon.js';
import { IModelDeltaDecoration, ITextModel } from '../../../../common/model.js';
import { LocationLink } from '../../../../common/languages.js';
import { ILanguageService } from '../../../../common/languages/language.js';
import { ITextModelService } from '../../../../common/services/resolverService.js';
import { ClickLinkGesture, ClickLinkKeyboardEvent, ClickLinkMouseEvent } from './clickLinkGesture.js';
import { PeekContext } from '../../../peekView/browser/peekView.js';
import * as nls from '../../../../../nls.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { DefinitionAction } from '../goToCommands.js';
import { getDefinitionsAtPosition } from '../goToSymbol.js';
import { IWordAtPosition } from '../../../../common/core/wordHelper.js';
import { ILanguageFeaturesService } from '../../../../common/services/languageFeatures.js';
import { ModelDecorationInjectedTextOptions } from '../../../../common/model/textModel.js';

export class GotoDefinitionAtPositionEditorContribution implements IEditorContribution {

	public static readonly ID = 'editor.contrib.gotodefinitionatposition';
	static readonly MAX_SOURCE_PREVIEW_LINES = 8;

	private readonly editor: ICodeEditor;
	private readonly toUnhook = new DisposableStore();
	private readonly toUnhookForKeyboard = new DisposableStore();
	private readonly linkDecorations: IEditorDecorationsCollection;
	private currentWordAtPosition: IWordAtPosition | null = null;
	private previousPromise: CancelablePromise<LocationLink[] | null> | null = null;

	constructor(
		editor: ICodeEditor,
		@ITextModelService private readonly textModelResolverService: ITextModelService,
		@ILanguageService private readonly languageService: ILanguageService,
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
	) {
		this.editor = editor;
		this.linkDecorations = this.editor.createDecorationsCollection();

		const linkGesture = new ClickLinkGesture(editor);
		this.toUnhook.add(linkGesture);

		this.toUnhook.add(linkGesture.onMouseMoveOrRelevantKeyDown(([mouseEvent, keyboardEvent]) => {
			this.startFindDefinitionFromMouse(mouseEvent, keyboardEvent ?? undefined);
		}));

		this.toUnhook.add(linkGesture.onExecute((mouseEvent: ClickLinkMouseEvent) => {
			if (this.isEnabled(mouseEvent)) {
				this.gotoDefinition(mouseEvent.target.position!, mouseEvent.hasSideBySideModifier)
					.catch((error: Error) => {
						onUnexpectedError(error);
					})
					.finally(() => {
						this.removeLinkDecorations();
					});
			}
		}));

		this.toUnhook.add(linkGesture.onCancel(() => {
			this.removeLinkDecorations();
			this.currentWordAtPosition = null;
		}));
	}

	static get(editor: ICodeEditor): GotoDefinitionAtPositionEditorContribution | null {
		return editor.getContribution<GotoDefinitionAtPositionEditorContribution>(GotoDefinitionAtPositionEditorContribution.ID);
	}

	async startFindDefinitionFromCursor(position: Position) {
		// For issue: https://github.com/microsoft/vscode/issues/46257
		// equivalent to mouse move with meta/ctrl key

		// First find the definition and add decorations
		// to the editor to be shown with the content hover widget
		await this.startFindDefinition(position);
		// Add listeners for editor cursor move and key down events
		// Dismiss the "extended" editor decorations when the user hides
		// the hover widget. There is no event for the widget itself so these
		// serve as a best effort. After removing the link decorations, the hover
		// widget is clean and will only show declarations per next request.
		this.toUnhookForKeyboard.add(this.editor.onDidChangeCursorPosition(() => {
			this.currentWordAtPosition = null;
			this.removeLinkDecorations();
			this.toUnhookForKeyboard.clear();
		}));
		this.toUnhookForKeyboard.add(this.editor.onKeyDown((e: IKeyboardEvent) => {
			if (e) {
				this.currentWordAtPosition = null;
				this.removeLinkDecorations();
				this.toUnhookForKeyboard.clear();
			}
		}));
	}

	private startFindDefinitionFromMouse(mouseEvent: ClickLinkMouseEvent, withKey?: ClickLinkKeyboardEvent): void {

		// check if we are active and on a content widget
		if (mouseEvent.target.type === MouseTargetType.CONTENT_WIDGET && this.linkDecorations.length > 0) {
			return;
		}

		if (!this.editor.hasModel() || !this.isEnabled(mouseEvent, withKey)) {
			this.currentWordAtPosition = null;
			this.removeLinkDecorations();
			return;
		}

		const position = mouseEvent.target.position!;

		this.startFindDefinition(position);
	}

	private async startFindDefinition(position: Position): Promise<void> {

		// Dispose listeners for updating decorations when using keyboard to show definition hover
		this.toUnhookForKeyboard.clear();

		// Find word at mouse position
		const word = position ? this.editor.getModel()?.getWordAtPosition(position) : null;
		if (!word) {
			this.currentWordAtPosition = null;
			this.removeLinkDecorations();
			return;
		}

		// Return early if word at position is still the same
		if (this.currentWordAtPosition && this.currentWordAtPosition.startColumn === word.startColumn && this.currentWordAtPosition.endColumn === word.endColumn && this.currentWordAtPosition.word === word.word) {
			return;
		}

		this.currentWordAtPosition = word;

		// Find definition and decorate word if found
		const state = new EditorState(this.editor, CodeEditorStateFlag.Position | CodeEditorStateFlag.Value | CodeEditorStateFlag.Selection | CodeEditorStateFlag.Scroll);

		if (this.previousPromise) {
			this.previousPromise.cancel();
			this.previousPromise = null;
		}

		this.previousPromise = createCancelablePromise(token => this.findDefinition(position, token));

		let results: LocationLink[] | null;
		try {
			results = await this.previousPromise;

		} catch (error) {
			onUnexpectedError(error);
			return;
		}

		if (!results || !results.length || !state.validate(this.editor)) {
			this.removeLinkDecorations();
			return;
		}

		const linkRange = results[0].originSelectionRange
			? Range.lift(results[0].originSelectionRange)
			: new Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);

		// Multiple results
		if (results.length > 1) {

			let combinedRange = linkRange;
			for (const { originSelectionRange } of results) {
				if (originSelectionRange) {
					combinedRange = Range.plusRange(combinedRange, originSelectionRange);
				}
			}

			this.addDecoration(
				combinedRange,
				new MarkdownString().appendText(nls.localize('multipleResults', "Click to show {0} definitions.", results.length))
			);
		} else {
			// Single result
			const result = results[0];

			if (!result.uri) {
				return;
			}

			return this.textModelResolverService.createModelReference(result.uri).then(ref => {

				if (!ref.object || !ref.object.textEditorModel) {
					ref.dispose();
					return;
				}

				const { object: { textEditorModel } } = ref;
				const { startLineNumber } = result.range;

				if (startLineNumber < 1 || startLineNumber > textEditorModel.getLineCount()) {
					// invalid range
					ref.dispose();
					return;
				}

				const previewValue = this.getPreviewValue(textEditorModel, startLineNumber, result);
				const languageId = this.languageService.guessLanguageIdByFilepathOrFirstLine(textEditorModel.uri);
				this.addDecoration(
					linkRange,
					previewValue ? new MarkdownString().appendCodeblock(languageId ? languageId : '', previewValue) : undefined
				);
				ref.dispose();
			});
		}
	}

	private getPreviewValue(textEditorModel: ITextModel, startLineNumber: number, result: LocationLink) {
		let rangeToUse = result.range;
		const numberOfLinesInRange = rangeToUse.endLineNumber - rangeToUse.startLineNumber;
		if (numberOfLinesInRange >= GotoDefinitionAtPositionEditorContribution.MAX_SOURCE_PREVIEW_LINES) {
			rangeToUse = this.getPreviewRangeBasedOnIndentation(textEditorModel, startLineNumber);
		}
		rangeToUse = textEditorModel.validateRange(rangeToUse);
		const previewValue = this.stripIndentationFromPreviewRange(textEditorModel, startLineNumber, rangeToUse);
		return previewValue;
	}

	private stripIndentationFromPreviewRange(textEditorModel: ITextModel, startLineNumber: number, previewRange: IRange) {
		const startIndent = textEditorModel.getLineFirstNonWhitespaceColumn(startLineNumber);
		let minIndent = startIndent;

		for (let endLineNumber = startLineNumber + 1; endLineNumber < previewRange.endLineNumber; endLineNumber++) {
			const endIndent = textEditorModel.getLineFirstNonWhitespaceColumn(endLineNumber);
			minIndent = Math.min(minIndent, endIndent);
		}

		const previewValue = textEditorModel.getValueInRange(previewRange).replace(new RegExp(`^\\s{${minIndent - 1}}`, 'gm'), '').trim();
		return previewValue;
	}

	private getPreviewRangeBasedOnIndentation(textEditorModel: ITextModel, startLineNumber: number) {
		const startIndent = textEditorModel.getLineFirstNonWhitespaceColumn(startLineNumber);
		const maxLineNumber = Math.min(textEditorModel.getLineCount(), startLineNumber + GotoDefinitionAtPositionEditorContribution.MAX_SOURCE_PREVIEW_LINES);
		let endLineNumber = startLineNumber + 1;

		for (; endLineNumber < maxLineNumber; endLineNumber++) {
			const endIndent = textEditorModel.getLineFirstNonWhitespaceColumn(endLineNumber);

			if (startIndent === endIndent) {
				break;
			}
		}

		return new Range(startLineNumber, 1, endLineNumber + 1, 1);
	}

	private addDecoration(range: Range, hoverMessage: MarkdownString | undefined): void {

		const newDecorations: IModelDeltaDecoration = {
			range: range,
			options: {
				description: 'goto-definition-link',
				inlineClassName: 'goto-definition-link',
				hoverMessage
			}
		};

		this.linkDecorations.set([newDecorations]);
	}

	private removeLinkDecorations(): void {
		this.linkDecorations.clear();
	}

	private isEnabled(mouseEvent: ClickLinkMouseEvent, withKey?: ClickLinkKeyboardEvent): boolean {
		return this.editor.hasModel()
			&& mouseEvent.isLeftClick
			&& mouseEvent.isNoneOrSingleMouseDown
			&& mouseEvent.target.type === MouseTargetType.CONTENT_TEXT
			&& !(mouseEvent.target.detail.injectedText?.options instanceof ModelDecorationInjectedTextOptions)
			&& (mouseEvent.hasTriggerModifier || (withKey ? withKey.keyCodeIsTriggerKey : false))
			&& this.languageFeaturesService.definitionProvider.has(this.editor.getModel());
	}

	private findDefinition(position: Position, token: CancellationToken): Promise<LocationLink[] | null> {
		const model = this.editor.getModel();
		if (!model) {
			return Promise.resolve(null);
		}

		return getDefinitionsAtPosition(this.languageFeaturesService.definitionProvider, model, position, false, token);
	}

	private async gotoDefinition(position: Position, openToSide: boolean): Promise<unknown> {
		this.editor.setPosition(position);
		return this.editor.invokeWithinContext((accessor) => {
			const canPeek = !openToSide && this.editor.getOption(EditorOption.definitionLinkOpensInPeek) && !this.isInPeekEditor(accessor);
			const action = new DefinitionAction({ openToSide, openInPeek: canPeek, muteMessage: true }, { title: { value: '', original: '' }, id: '', precondition: undefined });
			return action.run(accessor);
		});
	}

	private isInPeekEditor(accessor: ServicesAccessor): boolean | undefined {
		const contextKeyService = accessor.get(IContextKeyService);
		return PeekContext.inPeekEditor.getValue(contextKeyService);
	}

	public dispose(): void {
		this.toUnhook.dispose();
		this.toUnhookForKeyboard.dispose();
	}
}

registerEditorContribution(GotoDefinitionAtPositionEditorContribution.ID, GotoDefinitionAtPositionEditorContribution, EditorContributionInstantiation.BeforeFirstInteraction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/gotoSymbol/browser/peek/referencesController.ts]---
Location: vscode-main/src/vs/editor/contrib/gotoSymbol/browser/peek/referencesController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancelablePromise, createCancelablePromise } from '../../../../../base/common/async.js';
import { onUnexpectedError } from '../../../../../base/common/errors.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { ICodeEditorService } from '../../../../browser/services/codeEditorService.js';
import { EditorOption } from '../../../../common/config/editorOptions.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { IEditorContribution } from '../../../../common/editorCommon.js';
import { Location } from '../../../../common/languages.js';
import { PeekContext } from '../../../peekView/browser/peekView.js';
import { getOuterEditor } from '../../../../browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import * as nls from '../../../../../nls.js';
import { CommandsRegistry } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../../platform/contextkey/common/contextkey.js';
import { TextEditorSelectionSource } from '../../../../../platform/editor/common/editor.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IListService, WorkbenchListFocusContextKey, WorkbenchTreeElementCanCollapse, WorkbenchTreeElementCanExpand } from '../../../../../platform/list/browser/listService.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { OneReference, ReferencesModel } from '../referencesModel.js';
import { LayoutData, ReferenceWidget } from './referencesWidget.js';
import { EditorContextKeys } from '../../../../common/editorContextKeys.js';
import { InputFocusedContext } from '../../../../../platform/contextkey/common/contextkeys.js';

export const ctxReferenceSearchVisible = new RawContextKey<boolean>('referenceSearchVisible', false, nls.localize('referenceSearchVisible', "Whether reference peek is visible, like 'Peek References' or 'Peek Definition'"));

export abstract class ReferencesController implements IEditorContribution {

	static readonly ID = 'editor.contrib.referencesController';

	private readonly _disposables = new DisposableStore();

	private _widget?: ReferenceWidget;
	private _model?: ReferencesModel;
	private _peekMode?: boolean;
	private _requestIdPool = 0;
	private _ignoreModelChangeEvent = false;

	private readonly _referenceSearchVisible: IContextKey<boolean>;

	static get(editor: ICodeEditor): ReferencesController | null {
		return editor.getContribution<ReferencesController>(ReferencesController.ID);
	}

	constructor(
		private readonly _defaultTreeKeyboardSupport: boolean,
		private readonly _editor: ICodeEditor,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ICodeEditorService private readonly _editorService: ICodeEditorService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IStorageService private readonly _storageService: IStorageService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {

		this._referenceSearchVisible = ctxReferenceSearchVisible.bindTo(contextKeyService);
	}

	dispose(): void {
		this._referenceSearchVisible.reset();
		this._disposables.dispose();
		this._widget?.dispose();
		this._model?.dispose();
		this._widget = undefined;
		this._model = undefined;
	}

	toggleWidget(range: Range, modelPromise: CancelablePromise<ReferencesModel>, peekMode: boolean): void {

		// close current widget and return early is position didn't change
		let widgetPosition: Position | undefined;
		if (this._widget) {
			widgetPosition = this._widget.position;
		}
		this.closeWidget();
		if (!!widgetPosition && range.containsPosition(widgetPosition)) {
			return;
		}

		this._peekMode = peekMode;
		this._referenceSearchVisible.set(true);

		// close the widget on model/mode changes
		this._disposables.add(this._editor.onDidChangeModelLanguage(() => { this.closeWidget(); }));
		this._disposables.add(this._editor.onDidChangeModel(() => {
			if (!this._ignoreModelChangeEvent) {
				this.closeWidget();
			}
		}));
		const storageKey = 'peekViewLayout';
		const data = LayoutData.fromJSON(this._storageService.get(storageKey, StorageScope.PROFILE, '{}'));
		this._widget = this._instantiationService.createInstance(ReferenceWidget, this._editor, this._defaultTreeKeyboardSupport, data);
		this._widget.setTitle(nls.localize('labelLoading', "Loading..."));
		this._widget.show(range);

		this._disposables.add(this._widget.onDidClose(() => {
			modelPromise.cancel();
			if (this._widget) {
				this._storageService.store(storageKey, JSON.stringify(this._widget.layoutData), StorageScope.PROFILE, StorageTarget.MACHINE);
				if (!this._widget.isClosing) {
					// to prevent calling this too many times, check whether it was already closing.
					this.closeWidget();
				}
				this._widget = undefined;
			} else {
				this.closeWidget();
			}
		}));

		this._disposables.add(this._widget.onDidSelectReference(event => {
			const { element, kind } = event;
			if (!element) {
				return;
			}
			switch (kind) {
				case 'open':
					if (event.source !== 'editor' || !this._configurationService.getValue('editor.stablePeek')) {
						// when stable peek is configured we don't close
						// the peek window on selecting the editor
						this.openReference(element, false, false);
					}
					break;
				case 'side':
					this.openReference(element, true, false);
					break;
				case 'goto':
					if (peekMode) {
						this._gotoReference(element, true);
					} else {
						this.openReference(element, false, true);
					}
					break;
			}
		}));

		const requestId = ++this._requestIdPool;

		modelPromise.then(model => {

			// still current request? widget still open?
			if (requestId !== this._requestIdPool || !this._widget) {
				model.dispose();
				return undefined;
			}

			this._model?.dispose();
			this._model = model;

			// show widget
			return this._widget.setModel(this._model).then(() => {
				if (this._widget && this._model && this._editor.hasModel()) { // might have been closed

					// set title
					if (!this._model.isEmpty) {
						this._widget.setMetaTitle(nls.localize('metaTitle.N', "{0} ({1})", this._model.title, this._model.references.length));
					} else {
						this._widget.setMetaTitle('');
					}

					// set 'best' selection
					const uri = this._editor.getModel().uri;
					const pos = new Position(range.startLineNumber, range.startColumn);
					const selection = this._model.nearestReference(uri, pos);
					if (selection) {
						return this._widget.setSelection(selection).then(() => {
							if (this._widget && this._editor.getOption(EditorOption.peekWidgetDefaultFocus) === 'editor') {
								this._widget.focusOnPreviewEditor();
							}
						});
					}
				}
				return undefined;
			});

		}, error => {
			this._notificationService.error(error);
		});
	}

	changeFocusBetweenPreviewAndReferences() {
		if (!this._widget) {
			// can be called while still resolving...
			return;
		}
		if (this._widget.isPreviewEditorFocused()) {
			this._widget.focusOnReferenceTree();
		} else {
			this._widget.focusOnPreviewEditor();
		}
	}

	async goToNextOrPreviousReference(fwd: boolean) {
		if (!this._editor.hasModel() || !this._model || !this._widget) {
			// can be called while still resolving...
			return;
		}
		const currentPosition = this._widget.position;
		if (!currentPosition) {
			return;
		}
		const source = this._model.nearestReference(this._editor.getModel().uri, currentPosition);
		if (!source) {
			return;
		}
		const target = this._model.nextOrPreviousReference(source, fwd);
		const editorFocus = this._editor.hasTextFocus();
		const previewEditorFocus = this._widget.isPreviewEditorFocused();
		await this._widget.setSelection(target);
		await this._gotoReference(target, false);
		if (editorFocus) {
			this._editor.focus();
		} else if (this._widget && previewEditorFocus) {
			this._widget.focusOnPreviewEditor();
		}
	}

	async revealReference(reference: OneReference): Promise<void> {
		if (!this._editor.hasModel() || !this._model || !this._widget) {
			// can be called while still resolving...
			return;
		}

		await this._widget.revealReference(reference);
	}

	closeWidget(focusEditor = true): void {
		this._widget?.dispose();
		this._model?.dispose();
		this._referenceSearchVisible.reset();
		this._disposables.clear();
		this._widget = undefined;
		this._model = undefined;
		if (focusEditor) {
			this._editor.focus();
		}
		this._requestIdPool += 1; // Cancel pending requests
	}

	private _gotoReference(ref: Location, pinned: boolean): Promise<unknown> {
		this._widget?.hide();

		this._ignoreModelChangeEvent = true;
		const range = Range.lift(ref.range).collapseToStart();

		return this._editorService.openCodeEditor({
			resource: ref.uri,
			options: { selection: range, selectionSource: TextEditorSelectionSource.JUMP, pinned }
		}, this._editor).then(openedEditor => {
			this._ignoreModelChangeEvent = false;

			if (!openedEditor || !this._widget) {
				// something went wrong...
				this.closeWidget();
				return;
			}

			if (this._editor === openedEditor) {
				//
				this._widget.show(range);
				this._widget.focusOnReferenceTree();

			} else {
				// we opened a different editor instance which means a different controller instance.
				// therefore we stop with this controller and continue with the other
				const other = ReferencesController.get(openedEditor);
				const model = this._model!.clone();

				this.closeWidget();
				openedEditor.focus();

				other?.toggleWidget(
					range,
					createCancelablePromise(_ => Promise.resolve(model)),
					this._peekMode ?? false
				);
			}

		}, (err) => {
			this._ignoreModelChangeEvent = false;
			onUnexpectedError(err);
		});
	}

	openReference(ref: Location, sideBySide: boolean, pinned: boolean): void {
		// clear stage
		if (!sideBySide) {
			this.closeWidget();
		}

		const { uri, range } = ref;
		this._editorService.openCodeEditor({
			resource: uri,
			options: { selection: range, selectionSource: TextEditorSelectionSource.JUMP, pinned }
		}, this._editor, sideBySide);
	}
}

function withController(accessor: ServicesAccessor, fn: (controller: ReferencesController) => void): void {
	const outerEditor = getOuterEditor(accessor);
	if (!outerEditor) {
		return;
	}
	const controller = ReferencesController.get(outerEditor);
	if (controller) {
		fn(controller);
	}
}

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'togglePeekWidgetFocus',
	weight: KeybindingWeight.EditorContrib,
	primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.F2),
	when: ContextKeyExpr.or(ctxReferenceSearchVisible, PeekContext.inPeekEditor),
	handler(accessor) {
		withController(accessor, controller => {
			controller.changeFocusBetweenPreviewAndReferences();
		});
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'goToNextReference',
	weight: KeybindingWeight.EditorContrib - 10,
	primary: KeyCode.F4,
	secondary: [KeyCode.F12],
	when: ContextKeyExpr.or(ctxReferenceSearchVisible, PeekContext.inPeekEditor),
	handler(accessor) {
		withController(accessor, controller => {
			controller.goToNextOrPreviousReference(true);
		});
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'goToPreviousReference',
	weight: KeybindingWeight.EditorContrib - 10,
	primary: KeyMod.Shift | KeyCode.F4,
	secondary: [KeyMod.Shift | KeyCode.F12],
	when: ContextKeyExpr.or(ctxReferenceSearchVisible, PeekContext.inPeekEditor),
	handler(accessor) {
		withController(accessor, controller => {
			controller.goToNextOrPreviousReference(false);
		});
	}
});

// commands that aren't needed anymore because there is now ContextKeyExpr.OR
CommandsRegistry.registerCommandAlias('goToNextReferenceFromEmbeddedEditor', 'goToNextReference');
CommandsRegistry.registerCommandAlias('goToPreviousReferenceFromEmbeddedEditor', 'goToPreviousReference');

// close
CommandsRegistry.registerCommandAlias('closeReferenceSearchEditor', 'closeReferenceSearch');
CommandsRegistry.registerCommand(
	'closeReferenceSearch',
	accessor => withController(accessor, controller => controller.closeWidget())
);
KeybindingsRegistry.registerKeybindingRule({
	id: 'closeReferenceSearch',
	weight: KeybindingWeight.EditorContrib - 101,
	primary: KeyCode.Escape,
	secondary: [KeyMod.Shift | KeyCode.Escape],
	when: ContextKeyExpr.and(PeekContext.inPeekEditor, ContextKeyExpr.not('config.editor.stablePeek'))
});
KeybindingsRegistry.registerKeybindingRule({
	id: 'closeReferenceSearch',
	weight: KeybindingWeight.WorkbenchContrib + 50,
	primary: KeyCode.Escape,
	secondary: [KeyMod.Shift | KeyCode.Escape],
	when: ContextKeyExpr.and(
		ctxReferenceSearchVisible,
		ContextKeyExpr.not('config.editor.stablePeek'),
		ContextKeyExpr.or(
			EditorContextKeys.editorTextFocus,
			InputFocusedContext.negate()
		)
	)
});


KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'revealReference',
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyCode.Enter,
	mac: {
		primary: KeyCode.Enter,
		secondary: [KeyMod.CtrlCmd | KeyCode.DownArrow]
	},
	when: ContextKeyExpr.and(ctxReferenceSearchVisible, WorkbenchListFocusContextKey, WorkbenchTreeElementCanCollapse.negate(), WorkbenchTreeElementCanExpand.negate()),
	handler(accessor: ServicesAccessor) {
		const listService = accessor.get(IListService);
		const focus = <unknown[]>listService.lastFocusedList?.getFocus();
		if (Array.isArray(focus) && focus[0] instanceof OneReference) {
			withController(accessor, controller => controller.revealReference(focus[0] as OneReference));
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'openReferenceToSide',
	weight: KeybindingWeight.EditorContrib,
	primary: KeyMod.CtrlCmd | KeyCode.Enter,
	mac: {
		primary: KeyMod.WinCtrl | KeyCode.Enter
	},
	when: ContextKeyExpr.and(ctxReferenceSearchVisible, WorkbenchListFocusContextKey, WorkbenchTreeElementCanCollapse.negate(), WorkbenchTreeElementCanExpand.negate()),
	handler(accessor: ServicesAccessor) {
		const listService = accessor.get(IListService);
		const focus = <unknown[]>listService.lastFocusedList?.getFocus();
		if (Array.isArray(focus) && focus[0] instanceof OneReference) {
			withController(accessor, controller => controller.openReference(focus[0] as OneReference, true, true));
		}
	}
});

CommandsRegistry.registerCommand('openReference', (accessor) => {
	const listService = accessor.get(IListService);
	const focus = <unknown[]>listService.lastFocusedList?.getFocus();
	if (Array.isArray(focus) && focus[0] instanceof OneReference) {
		withController(accessor, controller => controller.openReference(focus[0] as OneReference, false, true));
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/gotoSymbol/browser/peek/referencesTree.ts]---
Location: vscode-main/src/vs/editor/contrib/gotoSymbol/browser/peek/referencesTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { IKeyboardEvent } from '../../../../../base/browser/keyboardEvent.js';
import { CountBadge } from '../../../../../base/browser/ui/countBadge/countBadge.js';
import { HighlightedLabel } from '../../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { IconLabel } from '../../../../../base/browser/ui/iconLabel/iconLabel.js';
import { IIdentityProvider, IKeyboardNavigationLabelProvider, IListVirtualDelegate } from '../../../../../base/browser/ui/list/list.js';
import { IListAccessibilityProvider } from '../../../../../base/browser/ui/list/listWidget.js';
import { IAsyncDataSource, ITreeNode, ITreeRenderer } from '../../../../../base/browser/ui/tree/tree.js';
import { createMatches, FuzzyScore, IMatch } from '../../../../../base/common/filters.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { basename, dirname } from '../../../../../base/common/resources.js';
import { ITextModelService } from '../../../../common/services/resolverService.js';
import { localize } from '../../../../../nls.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { defaultCountBadgeStyles } from '../../../../../platform/theme/browser/defaultStyles.js';
import { FileReferences, OneReference, ReferencesModel } from '../referencesModel.js';

//#region data source

export type TreeElement = FileReferences | OneReference;

export class DataSource implements IAsyncDataSource<ReferencesModel | FileReferences, TreeElement> {

	constructor(@ITextModelService private readonly _resolverService: ITextModelService) { }

	hasChildren(element: ReferencesModel | FileReferences | TreeElement): boolean {
		if (element instanceof ReferencesModel) {
			return true;
		}
		if (element instanceof FileReferences) {
			return true;
		}
		return false;
	}

	getChildren(element: ReferencesModel | FileReferences | TreeElement): TreeElement[] | Promise<TreeElement[]> {
		if (element instanceof ReferencesModel) {
			return element.groups;
		}

		if (element instanceof FileReferences) {
			return element.resolve(this._resolverService).then(val => {
				// if (element.failure) {
				// 	// refresh the element on failure so that
				// 	// we can update its rendering
				// 	return tree.refresh(element).then(() => val.children);
				// }
				return val.children;
			});
		}

		throw new Error('bad tree');
	}
}

//#endregion

export class Delegate implements IListVirtualDelegate<TreeElement> {
	getHeight(): number {
		return 23;
	}
	getTemplateId(element: FileReferences | OneReference): string {
		if (element instanceof FileReferences) {
			return FileReferencesRenderer.id;
		} else {
			return OneReferenceRenderer.id;
		}
	}
}

export class StringRepresentationProvider implements IKeyboardNavigationLabelProvider<TreeElement> {

	constructor(@IKeybindingService private readonly _keybindingService: IKeybindingService) { }

	getKeyboardNavigationLabel(element: TreeElement): { toString(): string } {
		if (element instanceof OneReference) {
			const parts = element.parent.getPreview(element)?.preview(element.range);
			if (parts) {
				return parts.value;
			}
		}
		// FileReferences or unresolved OneReference
		return basename(element.uri);
	}

	mightProducePrintableCharacter(event: IKeyboardEvent): boolean {
		return this._keybindingService.mightProducePrintableCharacter(event);
	}
}

export class IdentityProvider implements IIdentityProvider<TreeElement> {

	getId(element: TreeElement): { toString(): string } {
		return element instanceof OneReference ? element.id : element.uri;
	}
}

//#region render: File

class FileReferencesTemplate extends Disposable {

	readonly file: IconLabel;
	readonly badge: CountBadge;

	constructor(
		container: HTMLElement,
		@ILabelService private readonly _labelService: ILabelService
	) {
		super();
		const parent = document.createElement('div');
		parent.classList.add('reference-file');
		this.file = this._register(new IconLabel(parent, { supportHighlights: true }));

		this.badge = this._register(new CountBadge(dom.append(parent, dom.$('.count')), {}, defaultCountBadgeStyles));

		container.appendChild(parent);
	}

	set(element: FileReferences, matches: IMatch[]) {
		const parent = dirname(element.uri);
		this.file.setLabel(
			this._labelService.getUriBasenameLabel(element.uri),
			this._labelService.getUriLabel(parent, { relative: true }),
			{ title: this._labelService.getUriLabel(element.uri), matches }
		);
		const len = element.children.length;
		this.badge.setCount(len);
		if (len > 1) {
			this.badge.setTitleFormat(localize('referencesCount', "{0} references", len));
		} else {
			this.badge.setTitleFormat(localize('referenceCount', "{0} reference", len));
		}
	}
}

export class FileReferencesRenderer implements ITreeRenderer<FileReferences, FuzzyScore, FileReferencesTemplate> {

	static readonly id = 'FileReferencesRenderer';

	readonly templateId: string = FileReferencesRenderer.id;

	constructor(@IInstantiationService private readonly _instantiationService: IInstantiationService) { }

	renderTemplate(container: HTMLElement): FileReferencesTemplate {
		return this._instantiationService.createInstance(FileReferencesTemplate, container);
	}
	renderElement(node: ITreeNode<FileReferences, FuzzyScore>, index: number, template: FileReferencesTemplate): void {
		template.set(node.element, createMatches(node.filterData));
	}
	disposeTemplate(templateData: FileReferencesTemplate): void {
		templateData.dispose();
	}
}

//#endregion

//#region render: Reference
class OneReferenceTemplate extends Disposable {

	readonly label: HighlightedLabel;

	constructor(container: HTMLElement) {
		super();

		this.label = this._register(new HighlightedLabel(container));
	}

	set(element: OneReference, score?: FuzzyScore): void {
		const preview = element.parent.getPreview(element)?.preview(element.range);
		if (!preview || !preview.value) {
			// this means we FAILED to resolve the document or the value is the empty string
			this.label.set(`${basename(element.uri)}:${element.range.startLineNumber + 1}:${element.range.startColumn + 1}`);
		} else {
			// render search match as highlight unless
			// we have score, then render the score
			const { value, highlight } = preview;
			if (score && !FuzzyScore.isDefault(score)) {
				this.label.element.classList.toggle('referenceMatch', false);
				this.label.set(value, createMatches(score));
			} else {
				this.label.element.classList.toggle('referenceMatch', true);
				this.label.set(value, [highlight]);
			}
		}
	}
}

export class OneReferenceRenderer implements ITreeRenderer<OneReference, FuzzyScore, OneReferenceTemplate> {

	static readonly id = 'OneReferenceRenderer';

	readonly templateId: string = OneReferenceRenderer.id;

	renderTemplate(container: HTMLElement): OneReferenceTemplate {
		return new OneReferenceTemplate(container);
	}
	renderElement(node: ITreeNode<OneReference, FuzzyScore>, index: number, templateData: OneReferenceTemplate): void {
		templateData.set(node.element, node.filterData);
	}
	disposeTemplate(templateData: OneReferenceTemplate): void {
		templateData.dispose();
	}
}

//#endregion


export class AccessibilityProvider implements IListAccessibilityProvider<FileReferences | OneReference> {

	getWidgetAriaLabel(): string {
		return localize('treeAriaLabel', "References");
	}

	getAriaLabel(element: FileReferences | OneReference): string | null {
		return element.ariaMessage;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/gotoSymbol/browser/peek/referencesWidget.css]---
Location: vscode-main/src/vs/editor/contrib/gotoSymbol/browser/peek/referencesWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* -- zone widget */
.monaco-editor .zone-widget .zone-widget-container.reference-zone-widget {
	border-top-width: 1px;
	border-bottom-width: 1px;
}

.monaco-editor .reference-zone-widget .inline {
	display: inline-block;
	vertical-align: top;
}

.monaco-editor .reference-zone-widget .messages {
	height: 100%;
	width: 100%;
	text-align: center;
	padding: 3em 0;
}

.monaco-editor .reference-zone-widget .ref-tree {
	line-height: 23px;
	background-color: var(--vscode-peekViewResult-background);
	color: var(--vscode-peekViewResult-lineForeground);
}

.monaco-editor .reference-zone-widget .ref-tree .reference {
	text-overflow: ellipsis;
	overflow: hidden;
}

.monaco-editor .reference-zone-widget .ref-tree .reference-file {
	display: inline-flex;
	width: 100%;
	height: 100%;
	color: var(--vscode-peekViewResult-fileForeground);
}

.monaco-editor .reference-zone-widget .ref-tree .monaco-list:focus .selected .reference-file {
	color: inherit !important;
}

.monaco-editor .reference-zone-widget .ref-tree .monaco-list:focus .monaco-list-rows > .monaco-list-row.selected:not(.highlighted) {
	background-color: var(--vscode-peekViewResult-selectionBackground);
	color: var(--vscode-peekViewResult-selectionForeground) !important;
}

.monaco-editor .reference-zone-widget .ref-tree .reference-file .count {
	margin-right: 12px;
	margin-left: auto;
}

.monaco-editor .reference-zone-widget .ref-tree .referenceMatch .highlight {
	color: var(--vscode-peekViewResult-fileForeground) !important;
	background-color: var(--vscode-peekViewResult-matchHighlightBackground) !important;
}

.monaco-editor .reference-zone-widget .preview .reference-decoration {
	background-color: var(--vscode-peekViewEditor-matchHighlightBackground);
	border: 2px solid var(--vscode-peekViewEditor-matchHighlightBorder);
	box-sizing: border-box;
}

.monaco-editor .reference-zone-widget .preview .monaco-editor .monaco-editor-background,
.monaco-editor .reference-zone-widget .preview .monaco-editor .inputarea.ime-input {
	background-color: var(--vscode-peekViewEditor-background);
}

.monaco-editor .reference-zone-widget .preview .monaco-editor .margin {
	background-color: var(--vscode-peekViewEditorGutter-background);
}

/* High Contrast Theming */

.monaco-editor.hc-black .reference-zone-widget .ref-tree .reference-file,
.monaco-editor.hc-light .reference-zone-widget .ref-tree .reference-file {
	font-weight: bold;
}

.monaco-editor.hc-black .reference-zone-widget .ref-tree .referenceMatch .highlight,
.monaco-editor.hc-light .reference-zone-widget .ref-tree .referenceMatch .highlight {
	border: 1px dotted var(--vscode-contrastActiveBorder, transparent);
	box-sizing: border-box;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/gotoSymbol/browser/peek/referencesWidget.ts]---
Location: vscode-main/src/vs/editor/contrib/gotoSymbol/browser/peek/referencesWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { IMouseEvent } from '../../../../../base/browser/mouseEvent.js';
import { Orientation } from '../../../../../base/browser/ui/sash/sash.js';
import { Sizing, SplitView } from '../../../../../base/browser/ui/splitview/splitview.js';
import { Color } from '../../../../../base/common/color.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { FuzzyScore } from '../../../../../base/common/filters.js';
import { KeyCode } from '../../../../../base/common/keyCodes.js';
import { DisposableStore, dispose, IDisposable, IReference } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { basenameOrAuthority, dirname } from '../../../../../base/common/resources.js';
import './referencesWidget.css';
import { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { EmbeddedCodeEditorWidget } from '../../../../browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { IEditorOptions } from '../../../../common/config/editorOptions.js';
import { IRange, Range } from '../../../../common/core/range.js';
import { ScrollType } from '../../../../common/editorCommon.js';
import { IModelDeltaDecoration, TrackedRangeStickiness } from '../../../../common/model.js';
import { ModelDecorationOptions, TextModel } from '../../../../common/model/textModel.js';
import { Location } from '../../../../common/languages.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../common/languages/modesRegistry.js';
import { ITextEditorModel, ITextModelService } from '../../../../common/services/resolverService.js';
import { AccessibilityProvider, DataSource, Delegate, FileReferencesRenderer, IdentityProvider, OneReferenceRenderer, StringRepresentationProvider, TreeElement } from './referencesTree.js';
import * as peekView from '../../../peekView/browser/peekView.js';
import * as nls from '../../../../../nls.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { IWorkbenchAsyncDataTreeOptions, WorkbenchAsyncDataTree } from '../../../../../platform/list/browser/listService.js';
import { IColorTheme, IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { FileReferences, OneReference, ReferencesModel } from '../referencesModel.js';
import { ITreeDragAndDrop, ITreeDragOverReaction } from '../../../../../base/browser/ui/tree/tree.js';
import { DataTransfers, IDragAndDropData } from '../../../../../base/browser/dnd.js';
import { ElementsDragAndDropData } from '../../../../../base/browser/ui/list/listView.js';
import { withSelection } from '../../../../../platform/opener/common/opener.js';

class DecorationsManager implements IDisposable {

	private static readonly DecorationOptions = ModelDecorationOptions.register({
		description: 'reference-decoration',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		className: 'reference-decoration'
	});

	private _decorations = new Map<string, OneReference>();
	private _decorationIgnoreSet = new Set<string>();
	private readonly _callOnDispose = new DisposableStore();
	private readonly _callOnModelChange = new DisposableStore();

	constructor(private _editor: ICodeEditor, private _model: ReferencesModel) {
		this._callOnDispose.add(this._editor.onDidChangeModel(() => this._onModelChanged()));
		this._onModelChanged();
	}

	dispose(): void {
		this._callOnModelChange.dispose();
		this._callOnDispose.dispose();
		this.removeDecorations();
	}

	private _onModelChanged(): void {
		this._callOnModelChange.clear();
		const model = this._editor.getModel();
		if (!model) {
			return;
		}
		for (const ref of this._model.references) {
			if (ref.uri.toString() === model.uri.toString()) {
				this._addDecorations(ref.parent);
				return;
			}
		}
	}

	private _addDecorations(reference: FileReferences): void {
		if (!this._editor.hasModel()) {
			return;
		}
		this._callOnModelChange.add(this._editor.getModel().onDidChangeDecorations(() => this._onDecorationChanged()));

		const newDecorations: IModelDeltaDecoration[] = [];
		const newDecorationsActualIndex: number[] = [];

		for (let i = 0, len = reference.children.length; i < len; i++) {
			const oneReference = reference.children[i];
			if (this._decorationIgnoreSet.has(oneReference.id)) {
				continue;
			}
			if (oneReference.uri.toString() !== this._editor.getModel().uri.toString()) {
				continue;
			}
			newDecorations.push({
				range: oneReference.range,
				options: DecorationsManager.DecorationOptions
			});
			newDecorationsActualIndex.push(i);
		}

		this._editor.changeDecorations((changeAccessor) => {
			const decorations = changeAccessor.deltaDecorations([], newDecorations);
			for (let i = 0; i < decorations.length; i++) {
				this._decorations.set(decorations[i], reference.children[newDecorationsActualIndex[i]]);
			}
		});
	}

	private _onDecorationChanged(): void {
		const toRemove: string[] = [];

		const model = this._editor.getModel();
		if (!model) {
			return;
		}

		for (const [decorationId, reference] of this._decorations) {

			const newRange = model.getDecorationRange(decorationId);

			if (!newRange) {
				continue;
			}

			let ignore = false;
			if (Range.equalsRange(newRange, reference.range)) {
				continue;

			}

			if (Range.spansMultipleLines(newRange)) {
				ignore = true;

			} else {
				const lineLength = reference.range.endColumn - reference.range.startColumn;
				const newLineLength = newRange.endColumn - newRange.startColumn;

				if (lineLength !== newLineLength) {
					ignore = true;
				}
			}

			if (ignore) {
				this._decorationIgnoreSet.add(reference.id);
				toRemove.push(decorationId);
			} else {
				reference.range = newRange;
			}
		}

		for (let i = 0, len = toRemove.length; i < len; i++) {
			this._decorations.delete(toRemove[i]);
		}
		this._editor.removeDecorations(toRemove);
	}

	removeDecorations(): void {
		this._editor.removeDecorations([...this._decorations.keys()]);
		this._decorations.clear();
	}
}

export class LayoutData {
	ratio: number = 0.7;
	heightInLines: number = 18;

	static fromJSON(raw: string): LayoutData {
		let ratio: number | undefined;
		let heightInLines: number | undefined;
		try {
			const data = <LayoutData>JSON.parse(raw);
			ratio = data.ratio;
			heightInLines = data.heightInLines;
		} catch {
			//
		}
		return {
			ratio: ratio || 0.7,
			heightInLines: heightInLines || 18
		};
	}
}

export interface SelectionEvent {
	readonly kind: 'goto' | 'show' | 'side' | 'open';
	readonly source: 'editor' | 'tree' | 'title';
	readonly element?: Location;
}

class ReferencesTree extends WorkbenchAsyncDataTree<ReferencesModel | FileReferences, TreeElement, FuzzyScore> { }

class ReferencesDragAndDrop implements ITreeDragAndDrop<TreeElement> {

	private readonly disposables = new DisposableStore();

	constructor(@ILabelService private readonly labelService: ILabelService) { }

	getDragURI(element: TreeElement): string | null {
		if (element instanceof FileReferences) {
			return element.uri.toString();
		} else if (element instanceof OneReference) {
			return withSelection(element.uri, element.range).toString();
		}
		return null;
	}

	getDragLabel(elements: TreeElement[]): string | undefined {
		if (elements.length === 0) {
			return undefined;
		}
		const labels = elements.map(e => this.labelService.getUriBasenameLabel(e.uri));
		return labels.join(', ');
	}

	onDragStart(data: IDragAndDropData, originalEvent: DragEvent): void {
		if (!originalEvent.dataTransfer) {
			return;
		}

		const elements = (data as ElementsDragAndDropData<TreeElement, TreeElement[]>).elements;
		const resources = elements.map(e => this.getDragURI(e)).filter(Boolean);

		if (resources.length) {
			// Apply resources as resource-list
			originalEvent.dataTransfer.setData(DataTransfers.RESOURCES, JSON.stringify(resources));

			// Also add as plain text for outside consumers
			originalEvent.dataTransfer.setData(DataTransfers.TEXT, resources.join('\n'));
		}
	}

	onDragOver(): boolean | ITreeDragOverReaction { return false; }
	drop(): void { }
	dispose(): void { this.disposables.dispose(); }
}

/**
 * ZoneWidget that is shown inside the editor
 */
export class ReferenceWidget extends peekView.PeekViewWidget {

	private _model?: ReferencesModel;
	private _decorationsManager?: DecorationsManager;

	private readonly _disposeOnNewModel = new DisposableStore();
	private readonly _callOnDispose = new DisposableStore();

	private readonly _onDidSelectReference = new Emitter<SelectionEvent>();
	readonly onDidSelectReference = this._onDidSelectReference.event;

	private _tree!: ReferencesTree;
	private _treeContainer!: HTMLElement;
	private _splitView!: SplitView;
	private _preview!: ICodeEditor;
	private _previewModelReference!: IReference<ITextEditorModel>;
	private _previewNotAvailableMessage!: TextModel;
	private _previewContainer!: HTMLElement;
	private _messageContainer!: HTMLElement;
	private _dim = new dom.Dimension(0, 0);
	private _isClosing = false; // whether or not a dispose is already in progress

	constructor(
		editor: ICodeEditor,
		private _defaultTreeKeyboardSupport: boolean,
		public layoutData: LayoutData,
		@IThemeService themeService: IThemeService,
		@ITextModelService private readonly _textModelResolverService: ITextModelService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@peekView.IPeekViewService private readonly _peekViewService: peekView.IPeekViewService,
		@ILabelService private readonly _uriLabel: ILabelService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
	) {
		super(editor, { showFrame: false, showArrow: true, isResizeable: true, isAccessible: true, supportOnTitleClick: true }, _instantiationService);

		this._applyTheme(themeService.getColorTheme());
		this._callOnDispose.add(themeService.onDidColorThemeChange(this._applyTheme.bind(this)));
		this._peekViewService.addExclusiveWidget(editor, this);
		this.create();
	}

	get isClosing() {
		return this._isClosing;
	}

	override dispose(): void {
		this._isClosing = true;
		this.setModel(undefined);
		this._callOnDispose.dispose();
		this._disposeOnNewModel.dispose();
		dispose(this._preview);
		dispose(this._previewNotAvailableMessage);
		dispose(this._tree);
		dispose(this._previewModelReference);
		this._splitView.dispose();
		super.dispose();
	}

	private _applyTheme(theme: IColorTheme) {
		const borderColor = theme.getColor(peekView.peekViewBorder) || Color.transparent;
		this.style({
			arrowColor: borderColor,
			frameColor: borderColor,
			headerBackgroundColor: theme.getColor(peekView.peekViewTitleBackground) || Color.transparent,
			primaryHeadingColor: theme.getColor(peekView.peekViewTitleForeground),
			secondaryHeadingColor: theme.getColor(peekView.peekViewTitleInfoForeground)
		});
	}

	override show(where: IRange) {
		super.show(where, this.layoutData.heightInLines || 18);
	}

	focusOnReferenceTree(): void {
		this._tree.domFocus();
	}

	focusOnPreviewEditor(): void {
		this._preview.focus();
	}

	isPreviewEditorFocused(): boolean {
		return this._preview.hasTextFocus();
	}

	protected override _onTitleClick(e: IMouseEvent): void {
		if (this._preview && this._preview.getModel()) {
			this._onDidSelectReference.fire({
				element: this._getFocusedReference(),
				kind: e.ctrlKey || e.metaKey || e.altKey ? 'side' : 'open',
				source: 'title'
			});
		}
	}

	protected _fillBody(containerElement: HTMLElement): void {
		this.setCssClass('reference-zone-widget');

		// message pane
		this._messageContainer = dom.append(containerElement, dom.$('div.messages'));
		dom.hide(this._messageContainer);

		this._splitView = new SplitView(containerElement, { orientation: Orientation.HORIZONTAL });

		// editor
		this._previewContainer = dom.append(containerElement, dom.$('div.preview.inline'));
		const options: IEditorOptions = {
			scrollBeyondLastLine: false,
			scrollbar: {
				verticalScrollbarSize: 14,
				horizontal: 'auto',
				useShadows: true,
				verticalHasArrows: false,
				horizontalHasArrows: false,
				alwaysConsumeMouseWheel: true
			},
			overviewRulerLanes: 2,
			fixedOverflowWidgets: true,
			minimap: {
				enabled: false
			}
		};
		this._preview = this._instantiationService.createInstance(EmbeddedCodeEditorWidget, this._previewContainer, options, {}, this.editor);
		dom.hide(this._previewContainer);
		this._previewNotAvailableMessage = this._instantiationService.createInstance(TextModel, nls.localize('missingPreviewMessage', "no preview available"), PLAINTEXT_LANGUAGE_ID, TextModel.DEFAULT_CREATION_OPTIONS, null);

		// tree
		this._treeContainer = dom.append(containerElement, dom.$('div.ref-tree.inline'));
		const treeOptions: IWorkbenchAsyncDataTreeOptions<TreeElement, FuzzyScore> = {
			keyboardSupport: this._defaultTreeKeyboardSupport,
			accessibilityProvider: new AccessibilityProvider(),
			keyboardNavigationLabelProvider: this._instantiationService.createInstance(StringRepresentationProvider),
			identityProvider: new IdentityProvider(),
			openOnSingleClick: true,
			selectionNavigation: true,
			overrideStyles: {
				listBackground: peekView.peekViewResultsBackground
			},
			dnd: this._instantiationService.createInstance(ReferencesDragAndDrop)
		};
		if (this._defaultTreeKeyboardSupport) {
			// the tree will consume `Escape` and prevent the widget from closing
			this._callOnDispose.add(dom.addStandardDisposableListener(this._treeContainer, 'keydown', (e) => {
				if (e.equals(KeyCode.Escape)) {
					this._keybindingService.dispatchEvent(e, e.target);
					e.stopPropagation();
				}
			}, true));
		}
		this._tree = this._instantiationService.createInstance(
			ReferencesTree,
			'ReferencesWidget',
			this._treeContainer,
			new Delegate(),
			[
				this._instantiationService.createInstance(FileReferencesRenderer),
				this._instantiationService.createInstance(OneReferenceRenderer),
			],
			this._instantiationService.createInstance(DataSource),
			treeOptions,
		);

		// split stuff
		this._splitView.addView({
			onDidChange: Event.None,
			element: this._previewContainer,
			minimumSize: 200,
			maximumSize: Number.MAX_VALUE,
			layout: (width) => {
				this._preview.layout({ height: this._dim.height, width });
			}
		}, Sizing.Distribute);

		this._splitView.addView({
			onDidChange: Event.None,
			element: this._treeContainer,
			minimumSize: 100,
			maximumSize: Number.MAX_VALUE,
			layout: (width) => {
				this._treeContainer.style.height = `${this._dim.height}px`;
				this._treeContainer.style.width = `${width}px`;
				this._tree.layout(this._dim.height, width);
			}
		}, Sizing.Distribute);

		this._disposables.add(this._splitView.onDidSashChange(() => {
			if (this._dim.width) {
				this.layoutData.ratio = this._splitView.getViewSize(0) / this._dim.width;
			}
		}, undefined));

		// listen on selection and focus
		const onEvent = (element: TreeElement | undefined, kind: 'show' | 'goto' | 'side') => {
			if (element instanceof OneReference) {
				if (kind === 'show') {
					this._revealReference(element, false);
				}
				this._onDidSelectReference.fire({ element, kind, source: 'tree' });
			}
		};
		this._disposables.add(this._tree.onDidOpen(e => {
			if (e.sideBySide) {
				onEvent(e.element, 'side');
			} else if (e.editorOptions.pinned) {
				onEvent(e.element, 'goto');
			} else {
				onEvent(e.element, 'show');
			}
		}));

		dom.hide(this._treeContainer);
	}

	protected override _onWidth(width: number) {
		if (this._dim) {
			this._doLayoutBody(this._dim.height, width);
		}
	}

	protected override _doLayoutBody(heightInPixel: number, widthInPixel: number): void {
		super._doLayoutBody(heightInPixel, widthInPixel);
		this._dim = new dom.Dimension(widthInPixel, heightInPixel);
		this.layoutData.heightInLines = this._viewZone ? this._viewZone.heightInLines : this.layoutData.heightInLines;
		this._splitView.layout(widthInPixel);
		this._splitView.resizeView(0, widthInPixel * this.layoutData.ratio);
	}

	setSelection(selection: OneReference): Promise<unknown> {
		return this._revealReference(selection, true).then(() => {
			if (!this._model) {
				// disposed
				return;
			}
			// show in tree
			this._tree.setSelection([selection]);
			this._tree.setFocus([selection]);
		});
	}

	setModel(newModel: ReferencesModel | undefined): Promise<unknown> {
		// clean up
		this._disposeOnNewModel.clear();
		this._model = newModel;
		if (this._model) {
			return this._onNewModel();
		}
		return Promise.resolve();
	}

	private _onNewModel(): Promise<unknown> {
		if (!this._model) {
			return Promise.resolve(undefined);
		}

		if (this._model.isEmpty) {
			this.setTitle('');
			this._messageContainer.innerText = nls.localize('noResults', "No results");
			dom.show(this._messageContainer);
			return Promise.resolve(undefined);
		}

		dom.hide(this._messageContainer);
		this._decorationsManager = new DecorationsManager(this._preview, this._model);
		this._disposeOnNewModel.add(this._decorationsManager);

		// listen on model changes
		this._disposeOnNewModel.add(this._model.onDidChangeReferenceRange(reference => this._tree.rerender(reference)));

		// listen on editor
		this._disposeOnNewModel.add(this._preview.onMouseDown(e => {
			const { event, target } = e;
			if (event.detail !== 2) {
				return;
			}
			const element = this._getFocusedReference();
			if (!element) {
				return;
			}
			this._onDidSelectReference.fire({
				element: { uri: element.uri, range: target.range! },
				kind: (event.ctrlKey || event.metaKey || event.altKey) ? 'side' : 'open',
				source: 'editor'
			});
		}));

		// make sure things are rendered
		this.container!.classList.add('results-loaded');
		dom.show(this._treeContainer);
		dom.show(this._previewContainer);
		this._splitView.layout(this._dim.width);
		this.focusOnReferenceTree();

		// pick input and a reference to begin with
		return this._tree.setInput(this._model.groups.length === 1 ? this._model.groups[0] : this._model);
	}

	private _getFocusedReference(): OneReference | undefined {
		const [element] = this._tree.getFocus();
		if (element instanceof OneReference) {
			return element;
		} else if (element instanceof FileReferences) {
			if (element.children.length > 0) {
				return element.children[0];
			}
		}
		return undefined;
	}

	async revealReference(reference: OneReference): Promise<void> {
		await this._revealReference(reference, false);
		this._onDidSelectReference.fire({ element: reference, kind: 'goto', source: 'tree' });
	}

	private _revealedReference?: OneReference;

	private async _revealReference(reference: OneReference, revealParent: boolean): Promise<void> {

		// check if there is anything to do...
		if (this._revealedReference === reference) {
			return;
		}
		this._revealedReference = reference;

		// Update widget header
		if (reference.uri.scheme !== Schemas.inMemory) {
			this.setTitle(basenameOrAuthority(reference.uri), this._uriLabel.getUriLabel(dirname(reference.uri)));
		} else {
			this.setTitle(nls.localize('peekView.alternateTitle', "References"));
		}

		const promise = this._textModelResolverService.createModelReference(reference.uri);

		if (this._tree.getInput() === reference.parent) {
			this._tree.reveal(reference);
		} else {
			if (revealParent) {
				this._tree.reveal(reference.parent);
			}
			await this._tree.expand(reference.parent);
			this._tree.reveal(reference);
		}

		const ref = await promise;

		if (!this._model) {
			// disposed
			ref.dispose();
			return;
		}

		dispose(this._previewModelReference);

		// show in editor
		const model = ref.object;
		if (model) {
			const scrollType = this._preview.getModel() === model.textEditorModel ? ScrollType.Smooth : ScrollType.Immediate;
			const sel = Range.lift(reference.range).collapseToStart();
			this._previewModelReference = ref;
			this._preview.setModel(model.textEditorModel);
			this._preview.setSelection(sel);
			this._preview.revealRangeInCenter(sel, scrollType);
		} else {
			this._preview.setModel(this._previewNotAvailableMessage);
			ref.dispose();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/gotoSymbol/test/browser/referencesModel.test.ts]---
Location: vscode-main/src/vs/editor/contrib/gotoSymbol/test/browser/referencesModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { ReferencesModel } from '../../browser/referencesModel.js';

suite('references', function () {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('nearestReference', () => {
		const model = new ReferencesModel([{
			uri: URI.file('/out/obj/can'),
			range: new Range(1, 1, 1, 1)
		}, {
			uri: URI.file('/out/obj/can2'),
			range: new Range(1, 1, 1, 1)
		}, {
			uri: URI.file('/src/can'),
			range: new Range(1, 1, 1, 1)
		}], 'FOO');

		let ref = model.nearestReference(URI.file('/src/can'), new Position(1, 1));
		assert.strictEqual(ref!.uri.path, '/src/can');

		ref = model.nearestReference(URI.file('/src/someOtherFileInSrc'), new Position(1, 1));
		assert.strictEqual(ref!.uri.path, '/src/can');

		ref = model.nearestReference(URI.file('/out/someOtherFile'), new Position(1, 1));
		assert.strictEqual(ref!.uri.path, '/out/obj/can');

		ref = model.nearestReference(URI.file('/out/obj/can2222'), new Position(1, 1));
		assert.strictEqual(ref!.uri.path, '/out/obj/can2');
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/gpu/browser/gpuActions.ts]---
Location: vscode-main/src/vs/editor/contrib/gpu/browser/gpuActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getActiveWindow } from '../../../../base/browser/dom.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { URI } from '../../../../base/common/uri.js';
import { localize, localize2 } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import type { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, registerEditorAction, type ServicesAccessor } from '../../../browser/editorExtensions.js';
import { ensureNonNullable } from '../../../browser/gpu/gpuUtils.js';
import { GlyphRasterizer } from '../../../browser/gpu/raster/glyphRasterizer.js';
import { ViewGpuContext } from '../../../browser/gpu/viewGpuContext.js';

class DebugEditorGpuRendererAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.debugEditorGpuRenderer',
			label: localize2('gpuDebug.label', "Developer: Debug Editor GPU Renderer"),
			// TODO: Why doesn't `ContextKeyExpr.equals('config:editor.experimentalGpuAcceleration', 'on')` work?
			precondition: ContextKeyExpr.true(),
		});
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const instantiationService = accessor.get(IInstantiationService);
		const quickInputService = accessor.get(IQuickInputService);
		const choice = await quickInputService.pick([
			{
				label: localize('logTextureAtlasStats.label', "Log Texture Atlas Stats"),
				id: 'logTextureAtlasStats',
			},
			{
				label: localize('saveTextureAtlas.label', "Save Texture Atlas"),
				id: 'saveTextureAtlas',
			},
			{
				label: localize('drawGlyph.label', "Draw Glyph"),
				id: 'drawGlyph',
			},
		], { canPickMany: false });
		if (!choice) {
			return;
		}
		switch (choice.id) {
			case 'logTextureAtlasStats':
				instantiationService.invokeFunction(accessor => {
					const logService = accessor.get(ILogService);

					const atlas = ViewGpuContext.atlas;
					if (!ViewGpuContext.atlas) {
						logService.error('No texture atlas found');
						return;
					}

					const stats = atlas.getStats();
					logService.info(['Texture atlas stats', ...stats].join('\n\n'));
				});
				break;
			case 'saveTextureAtlas':
				instantiationService.invokeFunction(async accessor => {
					const workspaceContextService = accessor.get(IWorkspaceContextService);
					const fileService = accessor.get(IFileService);
					const folders = workspaceContextService.getWorkspace().folders;
					if (folders.length > 0) {
						const atlas = ViewGpuContext.atlas;
						const promises = [];
						for (const [layerIndex, page] of atlas.pages.entries()) {
							promises.push(...[
								fileService.writeFile(
									URI.joinPath(folders[0].uri, `textureAtlasPage${layerIndex}_actual.png`),
									VSBuffer.wrap(new Uint8Array(await (await page.source.convertToBlob()).arrayBuffer()))
								),
								fileService.writeFile(
									URI.joinPath(folders[0].uri, `textureAtlasPage${layerIndex}_usage.png`),
									VSBuffer.wrap(new Uint8Array(await (await page.getUsagePreview()).arrayBuffer()))
								),
							]);
						}
						await Promise.all(promises);
					}
				});
				break;
			case 'drawGlyph':
				instantiationService.invokeFunction(async accessor => {
					const configurationService = accessor.get(IConfigurationService);
					const fileService = accessor.get(IFileService);
					const quickInputService = accessor.get(IQuickInputService);
					const workspaceContextService = accessor.get(IWorkspaceContextService);

					const folders = workspaceContextService.getWorkspace().folders;
					if (folders.length === 0) {
						return;
					}

					const atlas = ViewGpuContext.atlas;
					const fontFamily = configurationService.getValue<string>('editor.fontFamily');
					const fontSize = configurationService.getValue<number>('editor.fontSize');
					const rasterizer = new GlyphRasterizer(fontSize, fontFamily, getActiveWindow().devicePixelRatio, ViewGpuContext.decorationStyleCache);
					let chars = await quickInputService.input({
						prompt: 'Enter a character to draw (prefix with 0x for code point))'
					});
					if (!chars) {
						return;
					}
					const codePoint = chars.match(/0x(?<codePoint>[0-9a-f]+)/i)?.groups?.codePoint;
					if (codePoint !== undefined) {
						chars = String.fromCodePoint(parseInt(codePoint, 16));
					}
					const tokenMetadata = 0;
					const charMetadata = 0;
					const rasterizedGlyph = atlas.getGlyph(rasterizer, chars, tokenMetadata, charMetadata, 0);
					if (!rasterizedGlyph) {
						return;
					}
					const imageData = atlas.pages[rasterizedGlyph.pageIndex].source.getContext('2d')?.getImageData(
						rasterizedGlyph.x,
						rasterizedGlyph.y,
						rasterizedGlyph.w,
						rasterizedGlyph.h
					);
					if (!imageData) {
						return;
					}
					const canvas = new OffscreenCanvas(imageData.width, imageData.height);
					const ctx = ensureNonNullable(canvas.getContext('2d'));
					ctx.putImageData(imageData, 0, 0);
					const blob = await canvas.convertToBlob({ type: 'image/png' });
					const resource = URI.joinPath(folders[0].uri, `glyph_${chars}_${tokenMetadata}_${fontSize}px_${fontFamily.replaceAll(/[,\\\/\.'\s]/g, '_')}.png`);
					await fileService.writeFile(resource, VSBuffer.wrap(new Uint8Array(await blob.arrayBuffer())));
				});
				break;
		}
	}
}

registerEditorAction(DebugEditorGpuRendererAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/contentHoverComputer.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/contentHoverComputer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IActiveCodeEditor, ICodeEditor } from '../../../browser/editorBrowser.js';
import { IModelDecoration } from '../../../common/model.js';
import { HoverStartSource, IHoverComputer } from './hoverOperation.js';
import { HoverAnchor, HoverAnchorType, IEditorHoverParticipant, IHoverPart } from './hoverTypes.js';
import { AsyncIterableProducer } from '../../../../base/common/async.js';

export interface ContentHoverComputerOptions {
	shouldFocus: boolean;
	anchor: HoverAnchor;
	source: HoverStartSource;
	insistOnKeepingHoverVisible: boolean;
}

export class ContentHoverComputer implements IHoverComputer<ContentHoverComputerOptions, IHoverPart> {

	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _participants: readonly IEditorHoverParticipant[]
	) {
	}

	private static _getLineDecorations(editor: IActiveCodeEditor, anchor: HoverAnchor): IModelDecoration[] {
		if (anchor.type !== HoverAnchorType.Range && !anchor.supportsMarkerHover) {
			return [];
		}

		const model = editor.getModel();
		const lineNumber = anchor.range.startLineNumber;

		if (lineNumber > model.getLineCount()) {
			// invalid line
			return [];
		}

		const maxColumn = model.getLineMaxColumn(lineNumber);

		return editor.getLineDecorations(lineNumber).filter((d) => {
			if (d.options.isWholeLine) {
				return true;
			}

			const startColumn = (d.range.startLineNumber === lineNumber) ? d.range.startColumn : 1;
			const endColumn = (d.range.endLineNumber === lineNumber) ? d.range.endColumn : maxColumn;

			if (d.options.showIfCollapsed) {
				// Relax check around `showIfCollapsed` decorations to also include +/- 1 character
				if (startColumn > anchor.range.startColumn + 1 || anchor.range.endColumn - 1 > endColumn) {
					return false;
				}
			} else {
				if (startColumn > anchor.range.startColumn || anchor.range.endColumn > endColumn) {
					return false;
				}
			}

			return true;
		});
	}

	public computeAsync(options: ContentHoverComputerOptions, token: CancellationToken): AsyncIterableProducer<IHoverPart> {
		const anchor = options.anchor;

		if (!this._editor.hasModel() || !anchor) {
			return AsyncIterableProducer.EMPTY;
		}

		const lineDecorations = ContentHoverComputer._getLineDecorations(this._editor, anchor);

		return AsyncIterableProducer.merge(
			this._participants.map((participant) => {
				if (!participant.computeAsync) {
					return AsyncIterableProducer.EMPTY;
				}
				return participant.computeAsync(anchor, lineDecorations, options.source, token);
			})
		);
	}

	public computeSync(options: ContentHoverComputerOptions): IHoverPart[] {
		if (!this._editor.hasModel()) {
			return [];
		}

		const anchor = options.anchor;
		const lineDecorations = ContentHoverComputer._getLineDecorations(this._editor, anchor);

		let result: IHoverPart[] = [];
		for (const participant of this._participants) {
			result = result.concat(participant.computeSync(anchor, lineDecorations, options.source));
		}

		return coalesce(result);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/contentHoverController.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/contentHoverController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DECREASE_HOVER_VERBOSITY_ACTION_ID, INCREASE_HOVER_VERBOSITY_ACTION_ID, SHOW_OR_FOCUS_HOVER_ACTION_ID } from './hoverActionIds.js';
import { IKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { ICodeEditor, IEditorMouseEvent, IPartialEditorMouseEvent } from '../../../browser/editorBrowser.js';
import { ConfigurationChangedEvent, EditorOption } from '../../../common/config/editorOptions.js';
import { Range } from '../../../common/core/range.js';
import { IEditorContribution, IScrollEvent } from '../../../common/editorCommon.js';
import { HoverStartMode, HoverStartSource } from './hoverOperation.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { InlineSuggestionHintsContentWidget } from '../../inlineCompletions/browser/hintsWidget/inlineCompletionsHintsWidget.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ResultKind } from '../../../../platform/keybinding/common/keybindingResolver.js';
import { HoverVerbosityAction } from '../../../common/languages.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { isMousePositionWithinElement, shouldShowHover } from './hoverUtils.js';
import { ContentHoverWidgetWrapper } from './contentHoverWidgetWrapper.js';
import './hover.css';
import { Emitter } from '../../../../base/common/event.js';
import { isOnColorDecorator } from '../../colorPicker/browser/hoverColorPicker/hoverColorPicker.js';
import { isModifierKey, KeyCode } from '../../../../base/common/keyCodes.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';

// sticky hover widget which doesn't disappear on focus out and such
const _sticky = false
	// || Boolean("true") // done "weirdly" so that a lint warning prevents you from pushing this
	;

interface IHoverSettings {
	readonly enabled: 'on' | 'off' | 'onKeyboardModifier';
	readonly sticky: boolean;
	readonly hidingDelay: number;
}

export class ContentHoverController extends Disposable implements IEditorContribution {

	private readonly _onHoverContentsChanged = this._register(new Emitter<void>());
	public readonly onHoverContentsChanged = this._onHoverContentsChanged.event;

	public static readonly ID = 'editor.contrib.contentHover';

	public shouldKeepOpenOnEditorMouseMoveOrLeave: boolean = false;

	private readonly _listenersStore = new DisposableStore();

	private _contentWidget: ContentHoverWidgetWrapper | undefined;

	private _mouseMoveEvent: IEditorMouseEvent | undefined;
	private _reactToEditorMouseMoveRunner: RunOnceScheduler;

	private _hoverSettings!: IHoverSettings;
	private _isMouseDown: boolean = false;

	private _ignoreMouseEvents: boolean = false;

	constructor(
		private readonly _editor: ICodeEditor,
		@IContextMenuService _contextMenuService: IContextMenuService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService
	) {
		super();
		this._reactToEditorMouseMoveRunner = this._register(new RunOnceScheduler(
			() => {
				if (this._mouseMoveEvent) {
					this._reactToEditorMouseMove(this._mouseMoveEvent);
				}
			}, 0
		));
		this._register(_contextMenuService.onDidShowContextMenu(() => {
			this.hideContentHover();
			this._ignoreMouseEvents = true;
		}));
		this._register(_contextMenuService.onDidHideContextMenu(() => {
			this._ignoreMouseEvents = false;
		}));
		this._hookListeners();
		this._register(this._editor.onDidChangeConfiguration((e: ConfigurationChangedEvent) => {
			if (e.hasChanged(EditorOption.hover)) {
				this._unhookListeners();
				this._hookListeners();
			}
		}));
	}

	static get(editor: ICodeEditor): ContentHoverController | null {
		return editor.getContribution<ContentHoverController>(ContentHoverController.ID);
	}

	private _hookListeners(): void {
		const hoverOpts = this._editor.getOption(EditorOption.hover);
		this._hoverSettings = {
			enabled: hoverOpts.enabled,
			sticky: hoverOpts.sticky,
			hidingDelay: hoverOpts.hidingDelay
		};
		if (hoverOpts.enabled === 'off') {
			this._cancelSchedulerAndHide();
		}
		this._listenersStore.add(this._editor.onMouseDown((e: IEditorMouseEvent) => this._onEditorMouseDown(e)));
		this._listenersStore.add(this._editor.onMouseUp(() => this._onEditorMouseUp()));
		this._listenersStore.add(this._editor.onMouseMove((e: IEditorMouseEvent) => this._onEditorMouseMove(e)));
		this._listenersStore.add(this._editor.onKeyDown((e: IKeyboardEvent) => this._onKeyDown(e)));
		this._listenersStore.add(this._editor.onMouseLeave((e) => this._onEditorMouseLeave(e)));
		this._listenersStore.add(this._editor.onDidChangeModel(() => this._cancelSchedulerAndHide()));
		this._listenersStore.add(this._editor.onDidChangeModelContent(() => this._cancelScheduler()));
		this._listenersStore.add(this._editor.onDidScrollChange((e: IScrollEvent) => this._onEditorScrollChanged(e)));
	}

	private _unhookListeners(): void {
		this._listenersStore.clear();
	}

	private _cancelSchedulerAndHide(): void {
		this._cancelScheduler();
		this.hideContentHover();
	}

	private _cancelScheduler() {
		this._mouseMoveEvent = undefined;
		this._reactToEditorMouseMoveRunner.cancel();
	}

	private _onEditorScrollChanged(e: IScrollEvent): void {
		if (this._ignoreMouseEvents) {
			return;
		}
		if (e.scrollTopChanged || e.scrollLeftChanged) {
			this.hideContentHover();
		}
	}

	private _onEditorMouseDown(mouseEvent: IEditorMouseEvent): void {
		if (this._ignoreMouseEvents) {
			return;
		}
		this._isMouseDown = true;
		const shouldKeepHoverWidgetVisible = this._shouldKeepHoverWidgetVisible(mouseEvent);
		if (shouldKeepHoverWidgetVisible) {
			return;
		}
		this.hideContentHover();
	}

	private _shouldKeepHoverWidgetVisible(mouseEvent: IPartialEditorMouseEvent): boolean {
		return this._isMouseOnContentHoverWidget(mouseEvent) || this._isContentWidgetResizing() || isOnColorDecorator(mouseEvent);
	}

	private _isMouseOnContentHoverWidget(mouseEvent: IPartialEditorMouseEvent): boolean {
		if (!this._contentWidget) {
			return false;
		}
		return isMousePositionWithinElement(this._contentWidget.getDomNode(), mouseEvent.event.posx, mouseEvent.event.posy);
	}

	private _onEditorMouseUp(): void {
		if (this._ignoreMouseEvents) {
			return;
		}
		this._isMouseDown = false;
	}

	private _onEditorMouseLeave(mouseEvent: IPartialEditorMouseEvent): void {
		if (this._ignoreMouseEvents) {
			return;
		}
		if (this.shouldKeepOpenOnEditorMouseMoveOrLeave) {
			return;
		}
		this._cancelScheduler();
		const shouldKeepHoverWidgetVisible = this._shouldKeepHoverWidgetVisible(mouseEvent);
		if (shouldKeepHoverWidgetVisible) {
			return;
		}
		if (_sticky) {
			return;
		}
		this.hideContentHover();
	}

	private _shouldKeepCurrentHover(mouseEvent: IEditorMouseEvent): boolean {
		const contentWidget = this._contentWidget;
		if (!contentWidget) {
			return false;
		}
		const isHoverSticky = this._hoverSettings.sticky;
		const isMouseOnStickyContentHoverWidget = (mouseEvent: IEditorMouseEvent, isHoverSticky: boolean): boolean => {
			const isMouseOnContentHoverWidget = this._isMouseOnContentHoverWidget(mouseEvent);
			return isHoverSticky && isMouseOnContentHoverWidget;
		};
		const isMouseOnColorPickerOrChoosingColor = (mouseEvent: IEditorMouseEvent): boolean => {
			const isColorPickerVisible = contentWidget.isColorPickerVisible;
			const isMouseOnContentHoverWidget = this._isMouseOnContentHoverWidget(mouseEvent);
			const isMouseOnHoverWithColorPicker = isColorPickerVisible && isMouseOnContentHoverWidget;
			const isMaybeChoosingColor = isColorPickerVisible && this._isMouseDown;
			return isMouseOnHoverWithColorPicker || isMaybeChoosingColor;
		};
		// TODO@aiday-mar verify if the following is necessary code
		const isTextSelectedWithinContentHoverWidget = (mouseEvent: IEditorMouseEvent, sticky: boolean): boolean => {
			const view = mouseEvent.event.browserEvent.view;
			if (!view) {
				return false;
			}
			return sticky && contentWidget.containsNode(view.document.activeElement) && !view.getSelection()?.isCollapsed;
		};
		const isFocused = contentWidget.isFocused;
		const isResizing = contentWidget.isResizing;
		const isStickyAndVisibleFromKeyboard = this._hoverSettings.sticky && contentWidget.isVisibleFromKeyboard;

		return this.shouldKeepOpenOnEditorMouseMoveOrLeave
			|| isFocused
			|| isResizing
			|| isStickyAndVisibleFromKeyboard
			|| isMouseOnStickyContentHoverWidget(mouseEvent, isHoverSticky)
			|| isMouseOnColorPickerOrChoosingColor(mouseEvent)
			|| isTextSelectedWithinContentHoverWidget(mouseEvent, isHoverSticky);
	}

	private _onEditorMouseMove(mouseEvent: IEditorMouseEvent): void {
		if (this._ignoreMouseEvents) {
			return;
		}
		this._mouseMoveEvent = mouseEvent;
		const shouldKeepCurrentHover = this._shouldKeepCurrentHover(mouseEvent);
		if (shouldKeepCurrentHover) {
			this._reactToEditorMouseMoveRunner.cancel();
			return;
		}
		const shouldRescheduleHoverComputation = this._shouldRescheduleHoverComputation();
		if (shouldRescheduleHoverComputation) {
			if (!this._reactToEditorMouseMoveRunner.isScheduled()) {
				this._reactToEditorMouseMoveRunner.schedule(this._hoverSettings.hidingDelay);
			}
			return;
		}
		this._reactToEditorMouseMove(mouseEvent);
	}

	private _shouldRescheduleHoverComputation(): boolean {
		const hidingDelay = this._hoverSettings.hidingDelay;
		const isContentHoverWidgetVisible = this._contentWidget?.isVisible ?? false;
		// If the mouse is not over the widget, and if sticky is on,
		// then give it a grace period before reacting to the mouse event
		return isContentHoverWidgetVisible && this._hoverSettings.sticky && hidingDelay > 0;
	}

	private _reactToEditorMouseMove(mouseEvent: IEditorMouseEvent): void {
		if (shouldShowHover(
			this._hoverSettings.enabled,
			this._editor.getOption(EditorOption.multiCursorModifier),
			mouseEvent
		)) {
			const contentWidget: ContentHoverWidgetWrapper = this._getOrCreateContentWidget();
			if (contentWidget.showsOrWillShow(mouseEvent)) {
				return;
			}
		}
		if (_sticky) {
			return;
		}
		this.hideContentHover();
	}

	private _onKeyDown(e: IKeyboardEvent): void {
		if (this._ignoreMouseEvents) {
			return;
		}
		if (!this._contentWidget) {
			return;
		}
		const isPotentialKeyboardShortcut = this._isPotentialKeyboardShortcut(e);
		const isModifierKeyPressed = isModifierKey(e.keyCode);
		if (isPotentialKeyboardShortcut || isModifierKeyPressed) {
			return;
		}
		if (this._contentWidget.isFocused && e.keyCode === KeyCode.Tab) {
			return;
		}
		this.hideContentHover();
	}

	private _isPotentialKeyboardShortcut(e: IKeyboardEvent): boolean {
		if (!this._editor.hasModel() || !this._contentWidget) {
			return false;
		}
		const resolvedKeyboardEvent = this._keybindingService.softDispatch(e, this._editor.getDomNode());
		const moreChordsAreNeeded = resolvedKeyboardEvent.kind === ResultKind.MoreChordsNeeded;
		const isHoverAction = resolvedKeyboardEvent.kind === ResultKind.KbFound
			&& (resolvedKeyboardEvent.commandId === SHOW_OR_FOCUS_HOVER_ACTION_ID
				|| resolvedKeyboardEvent.commandId === INCREASE_HOVER_VERBOSITY_ACTION_ID
				|| resolvedKeyboardEvent.commandId === DECREASE_HOVER_VERBOSITY_ACTION_ID)
			&& this._contentWidget.isVisible;
		return moreChordsAreNeeded || isHoverAction;
	}

	public hideContentHover(): void {
		if (_sticky) {
			return;
		}
		if (InlineSuggestionHintsContentWidget.dropDownVisible) {
			return;
		}
		this._contentWidget?.hide();
	}

	private _getOrCreateContentWidget(): ContentHoverWidgetWrapper {
		if (!this._contentWidget) {
			this._contentWidget = this._instantiationService.createInstance(ContentHoverWidgetWrapper, this._editor);
			this._listenersStore.add(this._contentWidget.onContentsChanged(() => this._onHoverContentsChanged.fire()));
		}
		return this._contentWidget;
	}

	public showContentHover(
		range: Range,
		mode: HoverStartMode,
		source: HoverStartSource,
		focus: boolean
	): void {
		this._getOrCreateContentWidget().startShowingAtRange(range, mode, source, focus);
	}

	private _isContentWidgetResizing(): boolean {
		return this._contentWidget?.widget.isResizing || false;
	}

	public focusedHoverPartIndex(): number {
		return this._getOrCreateContentWidget().focusedHoverPartIndex();
	}

	public doesHoverAtIndexSupportVerbosityAction(index: number, action: HoverVerbosityAction): boolean {
		return this._getOrCreateContentWidget().doesHoverAtIndexSupportVerbosityAction(index, action);
	}

	public updateHoverVerbosityLevel(action: HoverVerbosityAction, index: number, focus?: boolean): void {
		this._getOrCreateContentWidget().updateHoverVerbosityLevel(action, index, focus);
	}

	public focus(): void {
		this._contentWidget?.focus();
	}

	public focusHoverPartWithIndex(index: number): void {
		this._contentWidget?.focusHoverPartWithIndex(index);
	}

	public scrollUp(): void {
		this._contentWidget?.scrollUp();
	}

	public scrollDown(): void {
		this._contentWidget?.scrollDown();
	}

	public scrollLeft(): void {
		this._contentWidget?.scrollLeft();
	}

	public scrollRight(): void {
		this._contentWidget?.scrollRight();
	}

	public pageUp(): void {
		this._contentWidget?.pageUp();
	}

	public pageDown(): void {
		this._contentWidget?.pageDown();
	}

	public goToTop(): void {
		this._contentWidget?.goToTop();
	}

	public goToBottom(): void {
		this._contentWidget?.goToBottom();
	}

	public getWidgetContent(): string | undefined {
		return this._contentWidget?.getWidgetContent();
	}

	public getAccessibleWidgetContent(): string | undefined {
		return this._contentWidget?.getAccessibleWidgetContent();
	}

	public getAccessibleWidgetContentAtIndex(index: number): string | undefined {
		return this._contentWidget?.getAccessibleWidgetContentAtIndex(index);
	}

	public get isColorPickerVisible(): boolean | undefined {
		return this._contentWidget?.isColorPickerVisible;
	}

	public get isHoverVisible(): boolean | undefined {
		return this._contentWidget?.isVisible;
	}

	public override dispose(): void {
		super.dispose();
		this._unhookListeners();
		this._listenersStore.dispose();
		this._contentWidget?.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/contentHoverRendered.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/contentHoverRendered.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEditorHoverContext, IEditorHoverParticipant, IEditorHoverRenderContext, IHoverPart, IRenderedHoverParts, RenderedHoverParts } from './hoverTypes.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { EditorHoverStatusBar } from './contentHoverStatusBar.js';
import { HoverStartSource } from './hoverOperation.js';
import { HoverCopyButton } from './hoverCopyButton.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { ContentHoverResult } from './contentHoverTypes.js';
import * as dom from '../../../../base/browser/dom.js';
import { HoverVerbosityAction } from '../../../common/languages.js';
import { MarkdownHoverParticipant } from './markdownHoverParticipant.js';
import { HoverColorPickerParticipant } from '../../colorPicker/browser/hoverColorPicker/hoverColorPickerParticipant.js';
import { localize } from '../../../../nls.js';
import { InlayHintsHover } from '../../inlayHints/browser/inlayHintsHover.js';
import { BugIndicatingError } from '../../../../base/common/errors.js';
import { HoverAction } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IOffsetRange } from '../../../common/core/ranges/offsetRange.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { MarkerHover } from './markerHoverParticipant.js';

export class RenderedContentHover extends Disposable {

	public closestMouseDistance: number | undefined;
	public initialMousePosX: number | undefined;
	public initialMousePosY: number | undefined;

	public readonly showAtPosition: Position;
	public readonly showAtSecondaryPosition: Position;
	public readonly shouldFocus: boolean;
	public readonly source: HoverStartSource;
	public readonly shouldAppearBeforeContent: boolean;

	private readonly _renderedHoverParts: RenderedContentHoverParts;

	constructor(
		editor: ICodeEditor,
		hoverResult: ContentHoverResult,
		participants: IEditorHoverParticipant<IHoverPart>[],
		context: IEditorHoverContext,
		@IKeybindingService keybindingService: IKeybindingService,
		@IHoverService hoverService: IHoverService,
		@IClipboardService clipboardService: IClipboardService
	) {
		super();
		const parts = hoverResult.hoverParts;
		this._renderedHoverParts = this._register(new RenderedContentHoverParts(
			editor,
			participants,
			parts,
			context,
			keybindingService,
			hoverService,
			clipboardService
		));
		const contentHoverComputerOptions = hoverResult.options;
		const anchor = contentHoverComputerOptions.anchor;
		const { showAtPosition, showAtSecondaryPosition } = RenderedContentHover.computeHoverPositions(editor, anchor.range, parts);
		this.shouldAppearBeforeContent = parts.some(m => m.isBeforeContent);
		this.showAtPosition = showAtPosition;
		this.showAtSecondaryPosition = showAtSecondaryPosition;
		this.initialMousePosX = anchor.initialMousePosX;
		this.initialMousePosY = anchor.initialMousePosY;
		this.shouldFocus = contentHoverComputerOptions.shouldFocus;
		this.source = contentHoverComputerOptions.source;
	}

	public get domNode(): DocumentFragment {
		return this._renderedHoverParts.domNode;
	}

	public get domNodeHasChildren(): boolean {
		return this._renderedHoverParts.domNodeHasChildren;
	}

	public get focusedHoverPartIndex(): number {
		return this._renderedHoverParts.focusedHoverPartIndex;
	}

	public get hoverPartsCount(): number {
		return this._renderedHoverParts.hoverPartsCount;
	}

	public focusHoverPartWithIndex(index: number): void {
		this._renderedHoverParts.focusHoverPartWithIndex(index);
	}

	public getAccessibleWidgetContent(): string {
		return this._renderedHoverParts.getAccessibleContent();
	}

	public getAccessibleWidgetContentAtIndex(index: number): string {
		return this._renderedHoverParts.getAccessibleHoverContentAtIndex(index);
	}

	public async updateHoverVerbosityLevel(action: HoverVerbosityAction, index: number, focus?: boolean): Promise<void> {
		this._renderedHoverParts.updateHoverVerbosityLevel(action, index, focus);
	}

	public doesHoverAtIndexSupportVerbosityAction(index: number, action: HoverVerbosityAction): boolean {
		return this._renderedHoverParts.doesHoverAtIndexSupportVerbosityAction(index, action);
	}

	public isColorPickerVisible(): boolean {
		return this._renderedHoverParts.isColorPickerVisible();
	}

	public static computeHoverPositions(editor: ICodeEditor, anchorRange: Range, hoverParts: IHoverPart[]): { showAtPosition: Position; showAtSecondaryPosition: Position } {

		let startColumnBoundary = 1;
		if (editor.hasModel()) {
			// Ensure the range is on the current view line
			const viewModel = editor._getViewModel();
			const coordinatesConverter = viewModel.coordinatesConverter;
			const anchorViewRange = coordinatesConverter.convertModelRangeToViewRange(anchorRange);
			const anchorViewMinColumn = viewModel.getLineMinColumn(anchorViewRange.startLineNumber);
			const anchorViewRangeStart = new Position(anchorViewRange.startLineNumber, anchorViewMinColumn);
			startColumnBoundary = coordinatesConverter.convertViewPositionToModelPosition(anchorViewRangeStart).column;
		}

		// The anchor range is always on a single line
		const anchorStartLineNumber = anchorRange.startLineNumber;
		let secondaryPositionColumn = anchorRange.startColumn;
		let forceShowAtRange: Range | undefined;

		for (const hoverPart of hoverParts) {
			const hoverPartRange = hoverPart.range;
			const hoverPartRangeOnAnchorStartLine = hoverPartRange.startLineNumber === anchorStartLineNumber;
			const hoverPartRangeOnAnchorEndLine = hoverPartRange.endLineNumber === anchorStartLineNumber;
			const hoverPartRangeIsOnAnchorLine = hoverPartRangeOnAnchorStartLine && hoverPartRangeOnAnchorEndLine;
			if (hoverPartRangeIsOnAnchorLine) {
				// this message has a range that is completely sitting on the line of the anchor
				const hoverPartStartColumn = hoverPartRange.startColumn;
				const minSecondaryPositionColumn = Math.min(secondaryPositionColumn, hoverPartStartColumn);
				secondaryPositionColumn = Math.max(minSecondaryPositionColumn, startColumnBoundary);
			}
			if (hoverPart.forceShowAtRange) {
				forceShowAtRange = hoverPartRange;
			}
		}

		let showAtPosition: Position;
		let showAtSecondaryPosition: Position;
		if (forceShowAtRange) {
			const forceShowAtPosition = forceShowAtRange.getStartPosition();
			showAtPosition = forceShowAtPosition;
			showAtSecondaryPosition = forceShowAtPosition;
		} else {
			showAtPosition = anchorRange.getStartPosition();
			showAtSecondaryPosition = new Position(anchorStartLineNumber, secondaryPositionColumn);
		}
		return {
			showAtPosition,
			showAtSecondaryPosition,
		};
	}
}

interface IRenderedContentHoverPart {
	/**
	 * Type of rendered part
	 */
	type: 'hoverPart';
	/**
	 * Participant of the rendered hover part
	 */
	participant: IEditorHoverParticipant<IHoverPart>;
	/**
	 * The rendered hover part
	 */
	hoverPart: IHoverPart;
	/**
	 * The HTML element containing the hover status bar.
	 */
	hoverElement: HTMLElement;
}

interface IRenderedContentStatusBar {
	/**
	 * Type of rendered part
	 */
	type: 'statusBar';
	/**
	 * The HTML element containing the hover status bar.
	 */
	hoverElement: HTMLElement;
	/**
	 * The actions of the hover status bar.
	 */
	actions: HoverAction[];
}

type IRenderedContentHoverPartOrStatusBar = IRenderedContentHoverPart | IRenderedContentStatusBar;

class RenderedStatusBar implements IDisposable {

	constructor(fragment: DocumentFragment, private readonly _statusBar: EditorHoverStatusBar) {
		fragment.appendChild(this._statusBar.hoverElement);
	}

	get hoverElement(): HTMLElement {
		return this._statusBar.hoverElement;
	}

	get actions(): HoverAction[] {
		return this._statusBar.actions;
	}

	dispose() {
		this._statusBar.dispose();
	}
}

class RenderedContentHoverParts extends Disposable {

	private static readonly _DECORATION_OPTIONS = ModelDecorationOptions.register({
		description: 'content-hover-highlight',
		className: 'hoverHighlight'
	});

	private readonly _renderedParts: IRenderedContentHoverPartOrStatusBar[] = [];
	private readonly _fragment: DocumentFragment;
	private readonly _context: IEditorHoverContext;

	private _markdownHoverParticipant: MarkdownHoverParticipant | undefined;
	private _colorHoverParticipant: HoverColorPickerParticipant | undefined;
	private _focusedHoverPartIndex: number = -1;

	constructor(
		editor: ICodeEditor,
		participants: IEditorHoverParticipant<IHoverPart>[],
		hoverParts: IHoverPart[],
		context: IEditorHoverContext,
		@IKeybindingService keybindingService: IKeybindingService,
		@IHoverService private readonly _hoverService: IHoverService,
		@IClipboardService private readonly _clipboardService: IClipboardService
	) {
		super();
		this._context = context;
		this._fragment = document.createDocumentFragment();
		this._register(this._renderParts(participants, hoverParts, context, keybindingService, this._hoverService));
		this._register(this._registerListenersOnRenderedParts());
		this._register(this._createEditorDecorations(editor, hoverParts));
		this._updateMarkdownAndColorParticipantInfo(participants);
	}

	private _createEditorDecorations(editor: ICodeEditor, hoverParts: IHoverPart[]): IDisposable {
		if (hoverParts.length === 0) {
			return Disposable.None;
		}
		let highlightRange = hoverParts[0].range;
		for (const hoverPart of hoverParts) {
			const hoverPartRange = hoverPart.range;
			highlightRange = Range.plusRange(highlightRange, hoverPartRange);
		}
		const highlightDecoration = editor.createDecorationsCollection();
		highlightDecoration.set([{
			range: highlightRange,
			options: RenderedContentHoverParts._DECORATION_OPTIONS
		}]);
		return toDisposable(() => {
			highlightDecoration.clear();
		});
	}

	private _renderParts(participants: IEditorHoverParticipant<IHoverPart>[], hoverParts: IHoverPart[], hoverContext: IEditorHoverContext, keybindingService: IKeybindingService, hoverService: IHoverService): IDisposable {
		const statusBar = new EditorHoverStatusBar(keybindingService, hoverService);
		const hoverRenderingContext: IEditorHoverRenderContext = {
			fragment: this._fragment,
			statusBar,
			...hoverContext
		};
		const disposables = new DisposableStore();
		disposables.add(statusBar);
		for (const participant of participants) {
			const renderedHoverParts = this._renderHoverPartsForParticipant(hoverParts, participant, hoverRenderingContext);
			disposables.add(renderedHoverParts);
			for (const renderedHoverPart of renderedHoverParts.renderedHoverParts) {
				this._renderedParts.push({
					type: 'hoverPart',
					participant,
					hoverPart: renderedHoverPart.hoverPart,
					hoverElement: renderedHoverPart.hoverElement,
				});
			}
		}
		const renderedStatusBar = this._renderStatusBar(this._fragment, statusBar);
		if (renderedStatusBar) {
			disposables.add(renderedStatusBar);
			this._renderedParts.push({
				type: 'statusBar',
				hoverElement: renderedStatusBar.hoverElement,
				actions: renderedStatusBar.actions,
			});
		}
		return disposables;
	}

	private _renderHoverPartsForParticipant(hoverParts: IHoverPart[], participant: IEditorHoverParticipant<IHoverPart>, hoverRenderingContext: IEditorHoverRenderContext): IRenderedHoverParts<IHoverPart> {
		const hoverPartsForParticipant = hoverParts.filter(hoverPart => hoverPart.owner === participant);
		const hasHoverPartsForParticipant = hoverPartsForParticipant.length > 0;
		if (!hasHoverPartsForParticipant) {
			return new RenderedHoverParts([]);
		}
		return participant.renderHoverParts(hoverRenderingContext, hoverPartsForParticipant);
	}

	private _renderStatusBar(fragment: DocumentFragment, statusBar: EditorHoverStatusBar): RenderedStatusBar | undefined {
		if (!statusBar.hasContent) {
			return undefined;
		}
		return new RenderedStatusBar(fragment, statusBar);
	}

	private _registerListenersOnRenderedParts(): IDisposable {
		const disposables = new DisposableStore();
		this._renderedParts.forEach((renderedPart: IRenderedContentHoverPartOrStatusBar, index: number) => {
			const element = renderedPart.hoverElement;
			element.tabIndex = 0;
			disposables.add(dom.addDisposableListener(element, dom.EventType.FOCUS_IN, (event: Event) => {
				event.stopPropagation();
				this._focusedHoverPartIndex = index;
			}));
			disposables.add(dom.addDisposableListener(element, dom.EventType.FOCUS_OUT, (event: Event) => {
				event.stopPropagation();
				this._focusedHoverPartIndex = -1;
			}));
			// Add copy button for marker hovers
			if (renderedPart.type === 'hoverPart' && renderedPart.hoverPart instanceof MarkerHover) {
				disposables.add(new HoverCopyButton(
					element,
					() => renderedPart.participant.getAccessibleContent(renderedPart.hoverPart),
					this._clipboardService,
					this._hoverService
				));
			}
		});
		return disposables;
	}

	private _updateMarkdownAndColorParticipantInfo(participants: IEditorHoverParticipant<IHoverPart>[]) {
		const markdownHoverParticipant = participants.find(p => {
			return (p instanceof MarkdownHoverParticipant) && !(p instanceof InlayHintsHover);
		});
		if (markdownHoverParticipant) {
			this._markdownHoverParticipant = markdownHoverParticipant as MarkdownHoverParticipant;
		}
		this._colorHoverParticipant = participants.find(p => p instanceof HoverColorPickerParticipant);
	}

	public focusHoverPartWithIndex(index: number): void {
		if (index < 0 || index >= this._renderedParts.length) {
			return;
		}
		this._renderedParts[index].hoverElement.focus();
	}

	public getAccessibleContent(): string {
		const content: string[] = [];
		for (let i = 0; i < this._renderedParts.length; i++) {
			content.push(this.getAccessibleHoverContentAtIndex(i));
		}
		return content.join('\n\n');
	}

	public getAccessibleHoverContentAtIndex(index: number): string {
		const renderedPart = this._renderedParts[index];
		if (!renderedPart) {
			return '';
		}
		if (renderedPart.type === 'statusBar') {
			const statusBarDescription = [localize('hoverAccessibilityStatusBar', "This is a hover status bar.")];
			for (const action of renderedPart.actions) {
				const keybinding = action.actionKeybindingLabel;
				if (keybinding) {
					statusBarDescription.push(localize('hoverAccessibilityStatusBarActionWithKeybinding', "It has an action with label {0} and keybinding {1}.", action.actionLabel, keybinding));
				} else {
					statusBarDescription.push(localize('hoverAccessibilityStatusBarActionWithoutKeybinding', "It has an action with label {0}.", action.actionLabel));
				}
			}
			return statusBarDescription.join('\n');
		}
		return renderedPart.participant.getAccessibleContent(renderedPart.hoverPart);
	}

	public async updateHoverVerbosityLevel(action: HoverVerbosityAction, index: number, focus?: boolean): Promise<void> {
		if (!this._markdownHoverParticipant) {
			return;
		}
		let rangeOfIndicesToUpdate: IOffsetRange;
		if (index >= 0) {
			rangeOfIndicesToUpdate = { start: index, endExclusive: index + 1 };
		} else {
			rangeOfIndicesToUpdate = this._findRangeOfMarkdownHoverParts(this._markdownHoverParticipant);
		}
		for (let i = rangeOfIndicesToUpdate.start; i < rangeOfIndicesToUpdate.endExclusive; i++) {
			const normalizedMarkdownHoverIndex = this._normalizedIndexToMarkdownHoverIndexRange(this._markdownHoverParticipant, i);
			if (normalizedMarkdownHoverIndex === undefined) {
				continue;
			}
			const renderedPart = await this._markdownHoverParticipant.updateMarkdownHoverVerbosityLevel(action, normalizedMarkdownHoverIndex);
			if (!renderedPart) {
				continue;
			}
			this._renderedParts[i] = {
				type: 'hoverPart',
				participant: this._markdownHoverParticipant,
				hoverPart: renderedPart.hoverPart,
				hoverElement: renderedPart.hoverElement,
			};
		}
		if (focus) {
			if (index >= 0) {
				this.focusHoverPartWithIndex(index);
			} else {
				this._context.focus();
			}
		}
		this._context.onContentsChanged();
	}

	public doesHoverAtIndexSupportVerbosityAction(index: number, action: HoverVerbosityAction): boolean {
		if (!this._markdownHoverParticipant) {
			return false;
		}
		const normalizedMarkdownHoverIndex = this._normalizedIndexToMarkdownHoverIndexRange(this._markdownHoverParticipant, index);
		if (normalizedMarkdownHoverIndex === undefined) {
			return false;
		}
		return this._markdownHoverParticipant.doesMarkdownHoverAtIndexSupportVerbosityAction(normalizedMarkdownHoverIndex, action);
	}

	public isColorPickerVisible(): boolean {
		return this._colorHoverParticipant?.isColorPickerVisible() ?? false;
	}

	private _normalizedIndexToMarkdownHoverIndexRange(markdownHoverParticipant: MarkdownHoverParticipant, index: number): number | undefined {
		const renderedPart = this._renderedParts[index];
		if (!renderedPart || renderedPart.type !== 'hoverPart') {
			return undefined;
		}
		const isHoverPartMarkdownHover = renderedPart.participant === markdownHoverParticipant;
		if (!isHoverPartMarkdownHover) {
			return undefined;
		}
		const firstIndexOfMarkdownHovers = this._renderedParts.findIndex(renderedPart =>
			renderedPart.type === 'hoverPart'
			&& renderedPart.participant === markdownHoverParticipant
		);
		if (firstIndexOfMarkdownHovers === -1) {
			throw new BugIndicatingError();
		}
		return index - firstIndexOfMarkdownHovers;
	}

	private _findRangeOfMarkdownHoverParts(markdownHoverParticipant: MarkdownHoverParticipant): IOffsetRange {
		const copiedRenderedParts = this._renderedParts.slice();
		const firstIndexOfMarkdownHovers = copiedRenderedParts.findIndex(renderedPart => renderedPart.type === 'hoverPart' && renderedPart.participant === markdownHoverParticipant);
		const inversedLastIndexOfMarkdownHovers = copiedRenderedParts.reverse().findIndex(renderedPart => renderedPart.type === 'hoverPart' && renderedPart.participant === markdownHoverParticipant);
		const lastIndexOfMarkdownHovers = inversedLastIndexOfMarkdownHovers >= 0 ? copiedRenderedParts.length - inversedLastIndexOfMarkdownHovers : inversedLastIndexOfMarkdownHovers;
		return { start: firstIndexOfMarkdownHovers, endExclusive: lastIndexOfMarkdownHovers + 1 };
	}

	public get domNode(): DocumentFragment {
		return this._fragment;
	}

	public get domNodeHasChildren(): boolean {
		return this._fragment.hasChildNodes();
	}

	public get focusedHoverPartIndex(): number {
		return this._focusedHoverPartIndex;
	}

	public get hoverPartsCount(): number {
		return this._renderedParts.length;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/contentHoverStatusBar.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/contentHoverStatusBar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as dom from '../../../../base/browser/dom.js';
import { HoverAction } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IEditorHoverAction, IEditorHoverStatusBar } from './hoverTypes.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';

const $ = dom.$;

export class EditorHoverStatusBar extends Disposable implements IEditorHoverStatusBar {

	public readonly hoverElement: HTMLElement;
	public readonly actions: HoverAction[] = [];

	private readonly actionsElement: HTMLElement;
	private _hasContent: boolean = false;

	public get hasContent() {
		return this._hasContent;
	}

	constructor(
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IHoverService private readonly _hoverService: IHoverService,
	) {
		super();
		this.hoverElement = $('div.hover-row.status-bar');
		this.hoverElement.tabIndex = 0;
		this.actionsElement = dom.append(this.hoverElement, $('div.actions'));
	}

	public addAction(
		actionOptions: {
			label: string;
			iconClass?: string; run: (target: HTMLElement) => void;
			commandId: string;
		}): IEditorHoverAction {

		const keybinding = this._keybindingService.lookupKeybinding(actionOptions.commandId);
		const keybindingLabel = keybinding ? keybinding.getLabel() : null;
		this._hasContent = true;
		const action = this._register(HoverAction.render(this.actionsElement, actionOptions, keybindingLabel));
		this._register(this._hoverService.setupManagedHover(getDefaultHoverDelegate('element'), action.actionContainer, action.actionRenderedLabel));
		this.actions.push(action);
		return action;
	}

	public append(element: HTMLElement): HTMLElement {
		const result = dom.append(this.actionsElement, element);
		this._hasContent = true;
		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/contentHoverTypes.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/contentHoverTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ContentHoverComputerOptions } from './contentHoverComputer.js';
import { HoverAnchor, IHoverPart } from './hoverTypes.js';

export class ContentHoverResult {

	constructor(
		public readonly hoverParts: IHoverPart[],
		public readonly isComplete: boolean,
		public readonly options: ContentHoverComputerOptions
	) { }

	public filter(anchor: HoverAnchor): ContentHoverResult {
		const filteredHoverParts = this.hoverParts.filter((m) => m.isValidForHoverAnchor(anchor));
		if (filteredHoverParts.length === this.hoverParts.length) {
			return this;
		}
		return new FilteredContentHoverResult(this, filteredHoverParts, this.isComplete, this.options);
	}
}

export class FilteredContentHoverResult extends ContentHoverResult {

	constructor(
		private readonly original: ContentHoverResult,
		messages: IHoverPart[],
		isComplete: boolean,
		options: ContentHoverComputerOptions
	) {
		super(messages, isComplete, options);
	}

	public override filter(anchor: HoverAnchor): ContentHoverResult {
		return this.original.filter(anchor);
	}
}
```

--------------------------------------------------------------------------------

````
