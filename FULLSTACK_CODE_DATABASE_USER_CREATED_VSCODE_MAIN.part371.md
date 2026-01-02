---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 371
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 371 of 552)

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

---[FILE: src/vs/workbench/contrib/codeActions/browser/codeActionsContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeActions/browser/codeActionsContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { HierarchicalKind } from '../../../../base/common/hierarchicalKind.js';
import { IJSONSchema, IJSONSchemaMap } from '../../../../base/common/jsonSchema.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { editorConfigurationBaseNode } from '../../../../editor/common/config/editorConfigurationSchema.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { codeActionCommandId, refactorCommandId, sourceActionCommandId } from '../../../../editor/contrib/codeAction/browser/codeAction.js';
import { CodeActionKind } from '../../../../editor/contrib/codeAction/common/types.js';
import * as nls from '../../../../nls.js';
import { ConfigurationScope, Extensions, IConfigurationNode, IConfigurationPropertySchema, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';

const createCodeActionsAutoSave = (description: string): IJSONSchema => {
	return {
		type: 'string',
		enum: ['always', 'explicit', 'never', true, false],
		enumDescriptions: [
			nls.localize('alwaysSave', 'Triggers Code Actions on explicit saves and auto saves triggered by window or focus changes.'),
			nls.localize('explicitSave', 'Triggers Code Actions only when explicitly saved'),
			nls.localize('neverSave', 'Never triggers Code Actions on save'),
			nls.localize('explicitSaveBoolean', 'Triggers Code Actions only when explicitly saved. This value will be deprecated in favor of "explicit".'),
			nls.localize('neverSaveBoolean', 'Never triggers Code Actions on save. This value will be deprecated in favor of "never".')
		],
		default: 'explicit',
		description: description
	};
};

const createNotebookCodeActionsAutoSave = (description: string): IJSONSchema => {
	return {
		type: ['string', 'boolean'],
		enum: ['explicit', 'never', true, false],
		enumDescriptions: [
			nls.localize('explicit', 'Triggers Code Actions only when explicitly saved.'),
			nls.localize('never', 'Never triggers Code Actions on save.'),
			nls.localize('explicitBoolean', 'Triggers Code Actions only when explicitly saved. This value will be deprecated in favor of "explicit".'),
			nls.localize('neverBoolean', 'Triggers Code Actions only when explicitly saved. This value will be deprecated in favor of "never".')
		],
		default: 'explicit',
		description: description
	};
};


const codeActionsOnSaveSchema: IConfigurationPropertySchema = {
	oneOf: [
		{
			type: 'object',
			additionalProperties: {
				type: 'string'
			},
		},
		{
			type: 'array',
			items: { type: 'string' }
		}
	],
	markdownDescription: nls.localize('editor.codeActionsOnSave', 'Run Code Actions for the editor on save. Code Actions must be specified and the editor must not be shutting down. When {0} is set to `afterDelay`, Code Actions will only be run when the file is saved explicitly. Example: `"source.organizeImports": "explicit" `', '`#files.autoSave#`'),
	type: ['object', 'array'],
	additionalProperties: {
		type: 'string',
		enum: ['always', 'explicit', 'never', true, false],
	},
	default: {},
	scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
};

export const editorConfiguration = Object.freeze<IConfigurationNode>({
	...editorConfigurationBaseNode,
	properties: {
		'editor.codeActionsOnSave': codeActionsOnSaveSchema
	}
});

const notebookCodeActionsOnSaveSchema: IConfigurationPropertySchema = {
	oneOf: [
		{
			type: 'object',
			additionalProperties: {
				type: 'string'
			},
		},
		{
			type: 'array',
			items: { type: 'string' }
		}
	],
	markdownDescription: nls.localize('notebook.codeActionsOnSave', 'Run a series of Code Actions for a notebook on save. Code Actions must be specified and the editor must not be shutting down. When {0} is set to `afterDelay`, Code Actions will only be run when the file is saved explicitly. Example: `"notebook.source.organizeImports": "explicit"`', '`#files.autoSave#`'),
	type: 'object',
	additionalProperties: {
		type: ['string', 'boolean'],
		enum: ['explicit', 'never', true, false],
		// enum: ['explicit', 'always', 'never'], -- autosave support needs to be built first
		// nls.localize('always', 'Always triggers Code Actions on save, including autosave, focus, and window change events.'),
	},
	default: {}
};

export const notebookEditorConfiguration = Object.freeze<IConfigurationNode>({
	...editorConfigurationBaseNode,
	properties: {
		'notebook.codeActionsOnSave': notebookCodeActionsOnSaveSchema
	}
});

export class CodeActionsContribution extends Disposable implements IWorkbenchContribution {

	private readonly _onDidChangeSchemaContributions = this._register(new Emitter<void>());

	private _allProvidedCodeActionKinds: HierarchicalKind[] = [];

	constructor(
		@IKeybindingService keybindingService: IKeybindingService,
		@ILanguageFeaturesService private readonly languageFeatures: ILanguageFeaturesService
	) {
		super();

		// TODO: @justschen caching of code actions based on extensions loaded: https://github.com/microsoft/vscode/issues/216019
		this._register(
			Event.runAndSubscribe(
				Event.debounce(languageFeatures.codeActionProvider.onDidChange, () => { }, 1000),
				() => {
					this._allProvidedCodeActionKinds = this.getAllProvidedCodeActionKinds();
					this.updateConfigurationSchema(this._allProvidedCodeActionKinds);
					this._onDidChangeSchemaContributions.fire();
				}));

		this._register(keybindingService.registerSchemaContribution({
			getSchemaAdditions: () => this.getKeybindingSchemaAdditions(),
			onDidChange: this._onDidChangeSchemaContributions.event,
		}));
	}

	private getAllProvidedCodeActionKinds(): Array<HierarchicalKind> {
		const out = new Map<string, HierarchicalKind>();
		for (const provider of this.languageFeatures.codeActionProvider.allNoModel()) {
			for (const kind of provider.providedCodeActionKinds ?? []) {
				out.set(kind, new HierarchicalKind(kind));
			}
		}
		return Array.from(out.values());
	}

	private updateConfigurationSchema(allProvidedKinds: Iterable<HierarchicalKind>): void {
		const properties: IJSONSchemaMap = { ...codeActionsOnSaveSchema.properties };
		const notebookProperties: IJSONSchemaMap = { ...notebookCodeActionsOnSaveSchema.properties };
		for (const codeActionKind of allProvidedKinds) {
			if (CodeActionKind.Source.contains(codeActionKind) && !properties[codeActionKind.value]) {
				properties[codeActionKind.value] = createCodeActionsAutoSave(nls.localize('codeActionsOnSave.generic', "Controls whether '{0}' actions should be run on file save.", codeActionKind.value));
				notebookProperties[codeActionKind.value] = createNotebookCodeActionsAutoSave(nls.localize('codeActionsOnSave.generic', "Controls whether '{0}' actions should be run on file save.", codeActionKind.value));
			}
		}
		codeActionsOnSaveSchema.properties = properties;
		notebookCodeActionsOnSaveSchema.properties = notebookProperties;

		Registry.as<IConfigurationRegistry>(Extensions.Configuration)
			.notifyConfigurationSchemaUpdated(editorConfiguration);
	}

	private getKeybindingSchemaAdditions(): IJSONSchema[] {
		const conditionalSchema = (command: string, kinds: readonly string[]): IJSONSchema => {
			return {
				if: {
					required: ['command'],
					properties: {
						'command': { const: command }
					}
				},
				then: {
					properties: {
						'args': {
							required: ['kind'],
							properties: {
								'kind': {
									anyOf: [
										{ enum: Array.from(kinds) },
										{ type: 'string' },
									]
								}
							}
						}
					}
				}
			};
		};

		const filterProvidedKinds = (ofKind: HierarchicalKind): string[] => {
			const out = new Set<string>();
			for (const providedKind of this._allProvidedCodeActionKinds) {
				if (ofKind.contains(providedKind)) {
					out.add(providedKind.value);
				}
			}
			return Array.from(out);
		};

		return [
			conditionalSchema(codeActionCommandId, filterProvidedKinds(HierarchicalKind.Empty)),
			conditionalSchema(refactorCommandId, filterProvidedKinds(CodeActionKind.Refactor)),
			conditionalSchema(sourceActionCommandId, filterProvidedKinds(CodeActionKind.Source)),
		];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/codeEditor.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/codeEditor.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './menuPreventer.js';
import './accessibility/accessibility.js';
import './diffEditorHelper.js';
import './editorFeatures.js';
import './editorSettingsMigration.js';
import './inspectKeybindings.js';
import './largeFileOptimizations.js';
import './inspectEditorTokens/inspectEditorTokens.js';
import './quickaccess/gotoLineQuickAccess.js';
import './quickaccess/gotoSymbolQuickAccess.js';
import './saveParticipants.js';
import './toggleColumnSelection.js';
import './toggleMinimap.js';
import './toggleOvertype.js';
import './toggleMultiCursorModifier.js';
import './toggleRenderControlCharacter.js';
import './toggleRenderWhitespace.js';
import './toggleWordWrap.js';
import './emptyTextEditorHint/emptyTextEditorHint.js';
import './workbenchReferenceSearch.js';
import './editorLineNumberMenu.js';
import './dictation/editorDictation.js';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/diffEditorAccessibilityHelp.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/diffEditorAccessibilityHelp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { AccessibleDiffViewerNext, AccessibleDiffViewerPrev } from '../../../../editor/browser/widget/diffEditor/commands.js';
import { DiffEditorWidget } from '../../../../editor/browser/widget/diffEditor/diffEditorWidget.js';
import { localize } from '../../../../nls.js';
import { AccessibleViewProviderId, AccessibleViewType, AccessibleContentProvider } from '../../../../platform/accessibility/browser/accessibleView.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { ContextKeyEqualsExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { getCommentCommandInfo } from '../../accessibility/browser/editorAccessibilityHelp.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';

export class DiffEditorAccessibilityHelp implements IAccessibleViewImplementation {
	readonly priority = 105;
	readonly name = 'diff-editor';
	readonly when = ContextKeyEqualsExpr.create('isInDiffEditor', true);
	readonly type = AccessibleViewType.Help;
	getProvider(accessor: ServicesAccessor) {
		const editorService = accessor.get(IEditorService);
		const codeEditorService = accessor.get(ICodeEditorService);
		const keybindingService = accessor.get(IKeybindingService);
		const contextKeyService = accessor.get(IContextKeyService);

		if (!(editorService.activeTextEditorControl instanceof DiffEditorWidget)) {
			return;
		}

		const codeEditor = codeEditorService.getActiveCodeEditor() || codeEditorService.getFocusedCodeEditor();
		if (!codeEditor) {
			return;
		}

		const switchSides = localize('msg3', "Run the command Diff Editor: Switch Side{0} to toggle between the original and modified editors.", '<keybinding:diffEditor.switchSide>');
		const diffEditorActiveAnnouncement = localize('msg5', "The setting, accessibility.verbosity.diffEditorActive, controls if a diff editor announcement is made when it becomes the active editor.");

		const keys = ['accessibility.signals.diffLineDeleted', 'accessibility.signals.diffLineInserted', 'accessibility.signals.diffLineModified'];
		const content = [
			localize('msg1', "You are in a diff editor."),
			localize('msg2', "View the next{0} or previous{1} diff in diff review mode, which is optimized for screen readers.", '<keybinding:' + AccessibleDiffViewerNext.id + '>', '<keybinding:' + AccessibleDiffViewerPrev.id + '>'),
			switchSides,
			diffEditorActiveAnnouncement,
			localize('msg4', "To control which accessibility signals should be played, the following settings can be configured: {0}.", keys.join(', ')),
		];
		const commentCommandInfo = getCommentCommandInfo(keybindingService, contextKeyService, codeEditor);
		if (commentCommandInfo) {
			content.push(commentCommandInfo);
		}
		return new AccessibleContentProvider(
			AccessibleViewProviderId.DiffEditor,
			{ type: AccessibleViewType.Help },
			() => content.join('\n'),
			() => codeEditor.focus(),
			AccessibilityVerbositySettingId.DiffEditor,
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/diffEditorHelper.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/diffEditorHelper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { autorunWithStore, observableFromEvent } from '../../../../base/common/observable.js';
import { IDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { registerDiffEditorContribution } from '../../../../editor/browser/editorExtensions.js';
import { EmbeddedDiffEditorWidget } from '../../../../editor/browser/widget/diffEditor/embeddedDiffEditorWidget.js';
import { IDiffEditorContribution } from '../../../../editor/common/editorCommon.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { localize } from '../../../../nls.js';
import { AccessibleViewRegistry } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { FloatingEditorClickWidget } from '../../../browser/codeeditor.js';
import { Extensions, IConfigurationMigrationRegistry } from '../../../common/configuration.js';
import { DiffEditorAccessibilityHelp } from './diffEditorAccessibilityHelp.js';

class DiffEditorHelperContribution extends Disposable implements IDiffEditorContribution {
	public static readonly ID = 'editor.contrib.diffEditorHelper';

	constructor(
		private readonly _diffEditor: IDiffEditor,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITextResourceConfigurationService private readonly _textResourceConfigurationService: ITextResourceConfigurationService,
		@INotificationService private readonly _notificationService: INotificationService,
	) {
		super();

		const isEmbeddedDiffEditor = this._diffEditor instanceof EmbeddedDiffEditorWidget;

		if (!isEmbeddedDiffEditor) {
			const computationResult = observableFromEvent(this, e => this._diffEditor.onDidUpdateDiff(e), () => /** @description diffEditor.diffComputationResult */ this._diffEditor.getDiffComputationResult());
			const onlyWhiteSpaceChange = computationResult.map(r => r && !r.identical && r.changes2.length === 0);

			this._register(autorunWithStore((reader, store) => {
				/** @description update state */
				if (onlyWhiteSpaceChange.read(reader)) {
					const helperWidget = store.add(this._instantiationService.createInstance(
						FloatingEditorClickWidget,
						this._diffEditor.getModifiedEditor(),
						localize('hintWhitespace', "Show Whitespace Differences"),
						null
					));
					store.add(helperWidget.onClick(() => {
						this._textResourceConfigurationService.updateValue(this._diffEditor.getModel()!.modified.uri, 'diffEditor.ignoreTrimWhitespace', false);
					}));
					helperWidget.render();
				}
			}));

			this._register(this._diffEditor.onDidUpdateDiff(() => {
				const diffComputationResult = this._diffEditor.getDiffComputationResult();

				if (diffComputationResult && diffComputationResult.quitEarly) {
					this._notificationService.prompt(
						Severity.Warning,
						localize('hintTimeout', "The diff algorithm was stopped early (after {0} ms.)", this._diffEditor.maxComputationTime),
						[{
							label: localize('removeTimeout', "Remove Limit"),
							run: () => {
								this._textResourceConfigurationService.updateValue(this._diffEditor.getModel()!.modified.uri, 'diffEditor.maxComputationTime', 0);
							}
						}],
						{}
					);
				}
			}));
		}
	}
}

registerDiffEditorContribution(DiffEditorHelperContribution.ID, DiffEditorHelperContribution);

Registry.as<IConfigurationMigrationRegistry>(Extensions.ConfigurationMigration)
	.registerConfigurationMigrations([{
		key: 'diffEditor.experimental.collapseUnchangedRegions',
		migrateFn: (value, accessor) => {
			return [
				['diffEditor.hideUnchangedRegions.enabled', { value }],
				['diffEditor.experimental.collapseUnchangedRegions', { value: undefined }]
			];
		}
	}]);
AccessibleViewRegistry.register(new DiffEditorAccessibilityHelp());
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/editorFeatures.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/editorFeatures.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { getEditorFeatures } from '../../../../editor/common/editorFeatures.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';

class EditorFeaturesInstantiator extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.editorFeaturesInstantiator';

	private _instantiated = false;

	constructor(
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) {
		super();

		this._register(codeEditorService.onWillCreateCodeEditor(() => this._instantiate()));
		this._register(codeEditorService.onWillCreateDiffEditor(() => this._instantiate()));
		if (codeEditorService.listCodeEditors().length > 0 || codeEditorService.listDiffEditors().length > 0) {
			this._instantiate();
		}
	}

	private _instantiate(): void {
		if (this._instantiated) {
			return;
		}
		this._instantiated = true;

		// Instantiate all editor features
		const editorFeatures = getEditorFeatures();
		for (const feature of editorFeatures) {
			try {
				const instance = this._instantiationService.createInstance(feature);
				if (typeof (<IDisposable>instance).dispose === 'function') {
					this._register((<IDisposable>instance));
				}
			} catch (err) {
				onUnexpectedError(err);
			}
		}
	}
}

registerWorkbenchContribution2(EditorFeaturesInstantiator.ID, EditorFeaturesInstantiator, WorkbenchPhase.BlockRestore);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/editorLineNumberMenu.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/editorLineNumberMenu.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction, Separator } from '../../../../base/common/actions.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import { ICodeEditor, IEditorMouseEvent, MouseTargetType } from '../../../../editor/browser/editorBrowser.js';
import { registerEditorContribution, EditorContributionInstantiation } from '../../../../editor/browser/editorExtensions.js';
import { IEditorContribution } from '../../../../editor/common/editorCommon.js';
import { IMenuService, MenuId, MenuItemAction, SubmenuItemAction } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { TextEditorSelectionSource } from '../../../../platform/editor/common/editor.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { Registry } from '../../../../platform/registry/common/platform.js';

export interface IGutterActionsGenerator {
	(context: { lineNumber: number; editor: ICodeEditor; accessor: ServicesAccessor }, result: { push(action: IAction, group?: string): void }): void;
}

export class GutterActionsRegistryImpl {
	private _registeredGutterActionsGenerators: Set<IGutterActionsGenerator> = new Set();

	/**
	 *
	 * This exists solely to allow the debug and test contributions to add actions to the gutter context menu
	 * which cannot be trivially expressed using when clauses and therefore cannot be statically registered.
	 * If you want an action to show up in the gutter context menu, you should generally use MenuId.EditorLineNumberMenu instead.
	 */
	public registerGutterActionsGenerator(gutterActionsGenerator: IGutterActionsGenerator): IDisposable {
		this._registeredGutterActionsGenerators.add(gutterActionsGenerator);
		return {
			dispose: () => {
				this._registeredGutterActionsGenerators.delete(gutterActionsGenerator);
			}
		};
	}

	public getGutterActionsGenerators(): IGutterActionsGenerator[] {
		return Array.from(this._registeredGutterActionsGenerators.values());
	}
}

Registry.add('gutterActionsRegistry', new GutterActionsRegistryImpl());
export const GutterActionsRegistry: GutterActionsRegistryImpl = Registry.as('gutterActionsRegistry');

export class EditorLineNumberContextMenu extends Disposable implements IEditorContribution {
	static readonly ID = 'workbench.contrib.editorLineNumberContextMenu';

	constructor(
		private readonly editor: ICodeEditor,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IMenuService private readonly menuService: IMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		this._register(this.editor.onMouseDown((e: IEditorMouseEvent) => this.doShow(e, false)));

	}

	public show(e: IEditorMouseEvent) {
		this.doShow(e, true);
	}

	private doShow(e: IEditorMouseEvent, force: boolean) {
		const model = this.editor.getModel();

		// on macOS ctrl+click is interpreted as right click
		if (!e.event.rightButton && !(isMacintosh && e.event.leftButton && e.event.ctrlKey) && !force
			|| e.target.type !== MouseTargetType.GUTTER_LINE_NUMBERS && e.target.type !== MouseTargetType.GUTTER_GLYPH_MARGIN
			|| !e.target.position || !model
		) {
			return;
		}

		const lineNumber = e.target.position.lineNumber;

		const contextKeyService = this.contextKeyService.createOverlay([['editorLineNumber', lineNumber]]);
		const menu = this.menuService.createMenu(MenuId.EditorLineNumberContext, contextKeyService);

		const allActions: [string, (IAction | MenuItemAction | SubmenuItemAction)[]][] = [];

		this.instantiationService.invokeFunction(accessor => {
			for (const generator of GutterActionsRegistry.getGutterActionsGenerators()) {
				const collectedActions = new Map<string, IAction[]>();
				generator({ lineNumber, editor: this.editor, accessor }, {
					push: (action: IAction, group: string = 'navigation') => {
						const actions = (collectedActions.get(group) ?? []);
						actions.push(action);
						collectedActions.set(group, actions);
					}
				});
				for (const [group, actions] of collectedActions.entries()) {
					allActions.push([group, actions]);
				}
			}

			allActions.sort((a, b) => a[0].localeCompare(b[0]));

			const menuActions = menu.getActions({ arg: { lineNumber, uri: model.uri }, shouldForwardArgs: true });
			allActions.push(...menuActions);

			// if the current editor selections do not contain the target line number,
			// set the selection to the clicked line number
			if (e.target.type === MouseTargetType.GUTTER_LINE_NUMBERS) {
				const currentSelections = this.editor.getSelections();
				const lineRange = {
					startLineNumber: lineNumber,
					endLineNumber: lineNumber,
					startColumn: 1,
					endColumn: model.getLineLength(lineNumber) + 1
				};
				const containsSelection = currentSelections?.some(selection => !selection.isEmpty() && selection.intersectRanges(lineRange) !== null);
				if (!containsSelection) {
					this.editor.setSelection(lineRange, TextEditorSelectionSource.PROGRAMMATIC);
				}
			}

			this.contextMenuService.showContextMenu({
				getAnchor: () => e.event,
				getActions: () => Separator.join(...allActions.map((a) => a[1])),
				onHide: () => menu.dispose(),
			});
		});
	}
}

registerEditorContribution(EditorLineNumberContextMenu.ID, EditorLineNumberContextMenu, EditorContributionInstantiation.AfterFirstRender);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/editorSettingsMigration.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/editorSettingsMigration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorSettingMigration, ISettingsWriter } from '../../../../editor/browser/config/migrateOptions.js';
import { ConfigurationKeyValuePairs, Extensions, IConfigurationMigrationRegistry } from '../../../common/configuration.js';

Registry.as<IConfigurationMigrationRegistry>(Extensions.ConfigurationMigration)
	.registerConfigurationMigrations(EditorSettingMigration.items.map(item => ({
		key: `editor.${item.key}`,
		migrateFn: (value, accessor) => {
			const configurationKeyValuePairs: ConfigurationKeyValuePairs = [];
			const writer: ISettingsWriter = (key, value) => configurationKeyValuePairs.push([`editor.${key}`, { value }]);
			item.migrate(value, key => accessor(`editor.${key}`), writer);
			return configurationKeyValuePairs;
		}
	})));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/inspectKeybindings.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/inspectKeybindings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize2 } from '../../../../nls.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';

class InspectKeyMap extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.inspectKeyMappings',
			title: localize2('workbench.action.inspectKeyMap', 'Inspect Key Mappings'),
			category: Categories.Developer,
			f1: true
		});
	}

	run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const keybindingService = accessor.get(IKeybindingService);
		const editorService = accessor.get(IEditorService);

		editorService.openEditor({ resource: undefined, contents: keybindingService._dumpDebugInfo(), options: { pinned: true } });
	}
}

registerAction2(InspectKeyMap);

class InspectKeyMapJSON extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.inspectKeyMappingsJSON',
			title: localize2('workbench.action.inspectKeyMapJSON', 'Inspect Key Mappings (JSON)'),
			category: Categories.Developer,
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const keybindingService = accessor.get(IKeybindingService);

		await editorService.openEditor({ resource: undefined, contents: keybindingService._dumpDebugInfoJSON(), options: { pinned: true } });
	}
}

registerAction2(InspectKeyMapJSON);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/largeFileOptimizations.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/largeFileOptimizations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import * as path from '../../../../base/common/path.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../../editor/browser/editorExtensions.js';
import { IEditorContribution } from '../../../../editor/common/editorCommon.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';

/**
 * Shows a message when opening a large file which has been memory optimized (and features disabled).
 */
export class LargeFileOptimizationsWarner extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.largeFileOptimizationsWarner';

	constructor(
		private readonly _editor: ICodeEditor,
		@INotificationService private readonly _notificationService: INotificationService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
		super();

		this._register(this._editor.onDidChangeModel((e) => this._update()));
		this._update();
	}

	private _update(): void {
		const model = this._editor.getModel();
		if (!model) {
			return;
		}

		if (model.isTooLargeForTokenization()) {
			const message = nls.localize(
				{
					key: 'largeFile',
					comment: [
						'Variable 0 will be a file name.'
					]
				},
				"{0}: tokenization, wrapping, folding, codelens, word highlighting and sticky scroll have been turned off for this large file in order to reduce memory usage and avoid freezing or crashing.",
				path.basename(model.uri.path)
			);

			this._notificationService.prompt(Severity.Info, message, [
				{
					label: nls.localize('removeOptimizations', "Forcefully Enable Features"),
					run: () => {
						this._configurationService.updateValue(`editor.largeFileOptimizations`, false).then(() => {
							this._notificationService.info(nls.localize('reopenFilePrompt', "Please reopen file in order for this setting to take effect."));
						}, (err) => {
							this._notificationService.error(err);
						});
					}
				}
			], { neverShowAgain: { id: 'editor.contrib.largeFileOptimizationsWarner' } });
		}
	}
}

registerEditorContribution(LargeFileOptimizationsWarner.ID, LargeFileOptimizationsWarner, EditorContributionInstantiation.AfterFirstRender);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/menuPreventer.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/menuPreventer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyMod } from '../../../../base/common/keyCodes.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../../editor/browser/editorExtensions.js';
import { IEditorContribution } from '../../../../editor/common/editorCommon.js';

/**
 * Prevents the top-level menu from showing up when doing Alt + Click in the editor
 */
export class MenuPreventer extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.menuPreventer';

	private _editor: ICodeEditor;
	private _altListeningMouse: boolean;
	private _altMouseTriggered: boolean;

	constructor(editor: ICodeEditor) {
		super();
		this._editor = editor;
		this._altListeningMouse = false;
		this._altMouseTriggered = false;

		// A global crossover handler to prevent menu bar from showing up
		// When <alt> is hold, we will listen to mouse events and prevent
		// the release event up <alt> if the mouse is triggered.

		this._register(this._editor.onMouseDown((e) => {
			if (this._altListeningMouse) {
				this._altMouseTriggered = true;
			}
		}));

		this._register(this._editor.onKeyDown((e) => {
			if (e.equals(KeyMod.Alt)) {
				if (!this._altListeningMouse) {
					this._altMouseTriggered = false;
				}
				this._altListeningMouse = true;
			}
		}));

		this._register(this._editor.onKeyUp((e) => {
			if (e.equals(KeyMod.Alt)) {
				if (this._altMouseTriggered) {
					e.preventDefault();
				}
				this._altListeningMouse = false;
				this._altMouseTriggered = false;
			}
		}));
	}
}

registerEditorContribution(MenuPreventer.ID, MenuPreventer, EditorContributionInstantiation.BeforeFirstInteraction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/saveParticipants.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/saveParticipants.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { HierarchicalKind } from '../../../../base/common/hierarchicalKind.js';
import { createCommandUri } from '../../../../base/common/htmlContent.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import * as strings from '../../../../base/common/strings.js';
import { IActiveCodeEditor, isCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { trimTrailingWhitespace } from '../../../../editor/common/commands/trimTrailingWhitespaceCommand.js';
import { EditOperation } from '../../../../editor/common/core/editOperation.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { CodeActionProvider, CodeActionTriggerType } from '../../../../editor/common/languages.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { ApplyCodeActionReason, applyCodeAction, getCodeActions } from '../../../../editor/contrib/codeAction/browser/codeAction.js';
import { CodeActionKind, CodeActionTriggerSource } from '../../../../editor/contrib/codeAction/common/types.js';
import { FormattingMode, formatDocumentRangesWithSelectedProvider, formatDocumentWithSelectedProvider } from '../../../../editor/contrib/format/browser/format.js';
import { SnippetController2 } from '../../../../editor/contrib/snippet/browser/snippetController2.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IProgress, IProgressStep, Progress } from '../../../../platform/progress/common/progress.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchContributionsExtensions } from '../../../common/contributions.js';
import { SaveReason } from '../../../common/editor.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { ITextFileEditorModel, ITextFileSaveParticipant, ITextFileSaveParticipantContext, ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { getModifiedRanges } from '../../format/browser/formatModified.js';

export class TrimWhitespaceParticipant implements ITextFileSaveParticipant {

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService
	) {
		// Nothing
	}

	async participate(model: ITextFileEditorModel, context: ITextFileSaveParticipantContext): Promise<void> {
		if (!model.textEditorModel) {
			return;
		}

		const trimTrailingWhitespaceOption = this.configurationService.getValue<boolean>('files.trimTrailingWhitespace', { overrideIdentifier: model.textEditorModel.getLanguageId(), resource: model.resource });
		const trimInRegexAndStrings = this.configurationService.getValue<boolean>('files.trimTrailingWhitespaceInRegexAndStrings', { overrideIdentifier: model.textEditorModel.getLanguageId(), resource: model.resource });
		if (trimTrailingWhitespaceOption) {
			this.doTrimTrailingWhitespace(model.textEditorModel, context.reason === SaveReason.AUTO, trimInRegexAndStrings);
		}
	}

	private doTrimTrailingWhitespace(model: ITextModel, isAutoSaved: boolean, trimInRegexesAndStrings: boolean): void {
		let prevSelection: Selection[] = [];
		let cursors: Position[] = [];

		const editor = findEditor(model, this.codeEditorService);
		if (editor) {
			// Find `prevSelection` in any case do ensure a good undo stack when pushing the edit
			// Collect active cursors in `cursors` only if `isAutoSaved` to avoid having the cursors jump
			prevSelection = editor.getSelections();
			if (isAutoSaved) {
				cursors = prevSelection.map(s => s.getPosition());
				const snippetsRange = SnippetController2.get(editor)?.getSessionEnclosingRange();
				if (snippetsRange) {
					for (let lineNumber = snippetsRange.startLineNumber; lineNumber <= snippetsRange.endLineNumber; lineNumber++) {
						cursors.push(new Position(lineNumber, model.getLineMaxColumn(lineNumber)));
					}
				}
			}
		}

		const ops = trimTrailingWhitespace(model, cursors, trimInRegexesAndStrings);
		if (!ops.length) {
			return; // Nothing to do
		}

		model.pushEditOperations(prevSelection, ops, (_edits) => prevSelection);
	}
}

function findEditor(model: ITextModel, codeEditorService: ICodeEditorService): IActiveCodeEditor | null {
	let candidate: IActiveCodeEditor | null = null;

	if (model.isAttachedToEditor()) {
		for (const editor of codeEditorService.listCodeEditors()) {
			if (editor.hasModel() && editor.getModel() === model) {
				if (editor.hasTextFocus()) {
					return editor; // favour focused editor if there are multiple
				}

				candidate = editor;
			}
		}
	}

	return candidate;
}

export class FinalNewLineParticipant implements ITextFileSaveParticipant {

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService
	) {
		// Nothing
	}

	async participate(model: ITextFileEditorModel, context: ITextFileSaveParticipantContext): Promise<void> {
		if (!model.textEditorModel) {
			return;
		}

		if (this.configurationService.getValue('files.insertFinalNewline', { overrideIdentifier: model.textEditorModel.getLanguageId(), resource: model.resource })) {
			this.doInsertFinalNewLine(model.textEditorModel);
		}
	}

	private doInsertFinalNewLine(model: ITextModel): void {
		const lineCount = model.getLineCount();
		const lastLine = model.getLineContent(lineCount);
		const lastLineIsEmptyOrWhitespace = strings.lastNonWhitespaceIndex(lastLine) === -1;

		if (!lineCount || lastLineIsEmptyOrWhitespace) {
			return;
		}

		const edits = [EditOperation.insert(new Position(lineCount, model.getLineMaxColumn(lineCount)), model.getEOL())];
		const editor = findEditor(model, this.codeEditorService);
		if (editor) {
			editor.executeEdits('insertFinalNewLine', edits, editor.getSelections());
		} else {
			model.pushEditOperations([], edits, () => null);
		}
	}
}

export class TrimFinalNewLinesParticipant implements ITextFileSaveParticipant {

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService
	) {
		// Nothing
	}

	async participate(model: ITextFileEditorModel, context: ITextFileSaveParticipantContext): Promise<void> {
		if (!model.textEditorModel) {
			return;
		}

		if (this.configurationService.getValue('files.trimFinalNewlines', { overrideIdentifier: model.textEditorModel.getLanguageId(), resource: model.resource })) {
			this.doTrimFinalNewLines(model.textEditorModel, context.reason === SaveReason.AUTO);
		}
	}

	/**
	 * returns 0 if the entire file is empty
	 */
	private findLastNonEmptyLine(model: ITextModel): number {
		for (let lineNumber = model.getLineCount(); lineNumber >= 1; lineNumber--) {
			const lineLength = model.getLineLength(lineNumber);
			if (lineLength > 0) {
				// this line has content
				return lineNumber;
			}
		}
		// no line has content
		return 0;
	}

	private doTrimFinalNewLines(model: ITextModel, isAutoSaved: boolean): void {
		const lineCount = model.getLineCount();

		// Do not insert new line if file does not end with new line
		if (lineCount === 1) {
			return;
		}

		let prevSelection: Selection[] = [];
		let cannotTouchLineNumber = 0;
		const editor = findEditor(model, this.codeEditorService);
		if (editor) {
			prevSelection = editor.getSelections();
			if (isAutoSaved) {
				for (let i = 0, len = prevSelection.length; i < len; i++) {
					const positionLineNumber = prevSelection[i].positionLineNumber;
					if (positionLineNumber > cannotTouchLineNumber) {
						cannotTouchLineNumber = positionLineNumber;
					}
				}
			}
		}

		const lastNonEmptyLine = this.findLastNonEmptyLine(model);
		const deleteFromLineNumber = Math.max(lastNonEmptyLine + 1, cannotTouchLineNumber + 1);
		const deletionRange = model.validateRange(new Range(deleteFromLineNumber, 1, lineCount, model.getLineMaxColumn(lineCount)));

		if (deletionRange.isEmpty()) {
			return;
		}

		model.pushEditOperations(prevSelection, [EditOperation.delete(deletionRange)], _edits => prevSelection);

		editor?.setSelections(prevSelection);
	}
}

class FormatOnSaveParticipant implements ITextFileSaveParticipant {

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		// Nothing
	}

	async participate(model: ITextFileEditorModel, context: ITextFileSaveParticipantContext, progress: IProgress<IProgressStep>, token: CancellationToken): Promise<void> {
		if (!model.textEditorModel) {
			return;
		}
		if (context.reason === SaveReason.AUTO) {
			return undefined;
		}

		const textEditorModel = model.textEditorModel;
		const overrides = { overrideIdentifier: textEditorModel.getLanguageId(), resource: textEditorModel.uri };

		const nestedProgress = new Progress<{ displayName?: string; extensionId?: ExtensionIdentifier }>(provider => {
			progress.report({
				message: localize(
					{ key: 'formatting2', comment: ['[configure]({1}) is a link. Only translate `configure`. Do not change brackets and parentheses or {1}'] },
					"Running '{0}' Formatter ([configure]({1})).",
					provider.displayName || provider.extensionId && provider.extensionId.value || '???',
					createCommandUri('workbench.action.openSettings', 'editor.formatOnSave').toString(),
				)
			});
		});

		const enabled = this.configurationService.getValue<boolean>('editor.formatOnSave', overrides);
		if (!enabled) {
			return undefined;
		}

		const editorOrModel = findEditor(textEditorModel, this.codeEditorService) || textEditorModel;
		const mode = this.configurationService.getValue<'file' | 'modifications' | 'modificationsIfAvailable'>('editor.formatOnSaveMode', overrides);

		if (mode === 'file') {
			await this.instantiationService.invokeFunction(formatDocumentWithSelectedProvider, editorOrModel, FormattingMode.Silent, nestedProgress, token);

		} else {
			const ranges = await this.instantiationService.invokeFunction(getModifiedRanges, isCodeEditor(editorOrModel) ? editorOrModel.getModel() : editorOrModel);
			if (ranges === null && mode === 'modificationsIfAvailable') {
				// no SCM, fallback to formatting the whole file iff wanted
				await this.instantiationService.invokeFunction(formatDocumentWithSelectedProvider, editorOrModel, FormattingMode.Silent, nestedProgress, token);

			} else if (ranges) {
				// formatted modified ranges
				await this.instantiationService.invokeFunction(formatDocumentRangesWithSelectedProvider, editorOrModel, ranges, FormattingMode.Silent, nestedProgress, token, false);
			}
		}
	}
}

class CodeActionOnSaveParticipant extends Disposable implements ITextFileSaveParticipant {

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
		@IHostService private readonly hostService: IHostService,
		@IEditorService private readonly editorService: IEditorService,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
	) {
		super();

		this._register(this.hostService.onDidChangeFocus(() => { this.triggerCodeActionsCommand(); }));
		this._register(this.editorService.onDidActiveEditorChange(() => { this.triggerCodeActionsCommand(); }));
	}

	private async triggerCodeActionsCommand() {
		if (this.configurationService.getValue<boolean>('editor.codeActions.triggerOnFocusChange') && this.configurationService.getValue<string>('files.autoSave') === 'afterDelay') {
			const model = this.codeEditorService.getActiveCodeEditor()?.getModel();
			if (!model) {
				return undefined;
			}

			const settingsOverrides = { overrideIdentifier: model.getLanguageId(), resource: model.uri };
			const setting = this.configurationService.getValue<{ [kind: string]: string | boolean } | string[]>('editor.codeActionsOnSave', settingsOverrides);

			if (!setting) {
				return undefined;
			}

			if (Array.isArray(setting)) {
				return undefined;
			}

			const settingItems: string[] = Object.keys(setting).filter(x => setting[x] && setting[x] === 'always' && CodeActionKind.Source.contains(new HierarchicalKind(x)));

			const cancellationTokenSource = new CancellationTokenSource();

			const codeActionKindList = [];
			for (const item of settingItems) {
				codeActionKindList.push(new HierarchicalKind(item));
			}

			// run code actions based on what is found from setting === 'always', no exclusions.
			await this.applyOnSaveActions(model, codeActionKindList, [], Progress.None, cancellationTokenSource.token);
		}
	}

	async participate(model: ITextFileEditorModel, context: ITextFileSaveParticipantContext, progress: IProgress<IProgressStep>, token: CancellationToken): Promise<void> {
		if (!model.textEditorModel) {
			return;
		}

		const textEditorModel = model.textEditorModel;
		const settingsOverrides = { overrideIdentifier: textEditorModel.getLanguageId(), resource: textEditorModel.uri };

		// Convert boolean values to strings
		const setting = this.configurationService.getValue<{ [kind: string]: string | boolean } | string[]>('editor.codeActionsOnSave', settingsOverrides);
		if (!setting) {
			return undefined;
		}

		if (context.reason === SaveReason.AUTO) {
			return undefined;
		}

		if (context.reason !== SaveReason.EXPLICIT && Array.isArray(setting)) {
			return undefined;
		}

		const settingItems: string[] = Array.isArray(setting)
			? setting
			: Object.keys(setting).filter(x => setting[x] && setting[x] !== 'never');

		const codeActionsOnSave = this.createCodeActionsOnSave(settingItems);

		if (!Array.isArray(setting)) {
			codeActionsOnSave.sort((a, b) => {
				if (CodeActionKind.SourceFixAll.contains(a)) {
					if (CodeActionKind.SourceFixAll.contains(b)) {
						return 0;
					}
					return -1;
				}
				if (CodeActionKind.SourceFixAll.contains(b)) {
					return 1;
				}
				return 0;
			});
		}

		if (!codeActionsOnSave.length) {
			return undefined;
		}
		const excludedActions = Array.isArray(setting)
			? []
			: Object.keys(setting)
				.filter(x => setting[x] === 'never' || false)
				.map(x => new HierarchicalKind(x));

		progress.report({ message: localize('codeaction', "Quick Fixes") });

		const filteredSaveList = Array.isArray(setting) ? codeActionsOnSave : codeActionsOnSave.filter(x => setting[x.value] === 'always' || ((setting[x.value] === 'explicit' || setting[x.value] === true) && context.reason === SaveReason.EXPLICIT));

		await this.applyOnSaveActions(textEditorModel, filteredSaveList, excludedActions, progress, token);
	}

	private createCodeActionsOnSave(settingItems: readonly string[]): HierarchicalKind[] {
		const kinds = settingItems.map(x => new HierarchicalKind(x));

		// Remove subsets
		return kinds.filter(kind => {
			return kinds.every(otherKind => otherKind.equals(kind) || !otherKind.contains(kind));
		});
	}

	private async applyOnSaveActions(model: ITextModel, codeActionsOnSave: readonly HierarchicalKind[], excludes: readonly HierarchicalKind[], progress: IProgress<IProgressStep>, token: CancellationToken): Promise<void> {

		const getActionProgress = new class implements IProgress<CodeActionProvider> {
			private _names = new Set<string>();
			private _report(): void {
				progress.report({
					message: localize(
						{ key: 'codeaction.get2', comment: ['[configure]({1}) is a link. Only translate `configure`. Do not change brackets and parentheses or {1}'] },
						"Getting code actions from {0} ([configure]({1})).",
						[...this._names].map(name => `'${name}'`).join(', '),
						createCommandUri('workbench.action.openSettings', 'editor.codeActionsOnSave').toString()
					)
				});
			}
			report(provider: CodeActionProvider) {
				if (provider.displayName && !this._names.has(provider.displayName)) {
					this._names.add(provider.displayName);
					this._report();
				}
			}
		};

		for (const codeActionKind of codeActionsOnSave) {
			const actionsToRun = await this.getActionsToRun(model, codeActionKind, excludes, getActionProgress, token);

			if (token.isCancellationRequested) {
				actionsToRun.dispose();
				return;
			}

			try {
				for (const action of actionsToRun.validActions) {
					progress.report({ message: localize('codeAction.apply', "Applying code action '{0}'.", action.action.title) });
					await this.instantiationService.invokeFunction(applyCodeAction, action, ApplyCodeActionReason.OnSave, {}, token);
					if (token.isCancellationRequested) {
						return;
					}
				}
			} catch {
				// Failure to apply a code action should not block other on save actions
			} finally {
				actionsToRun.dispose();
			}
		}
	}

	private getActionsToRun(model: ITextModel, codeActionKind: HierarchicalKind, excludes: readonly HierarchicalKind[], progress: IProgress<CodeActionProvider>, token: CancellationToken) {
		return getCodeActions(this.languageFeaturesService.codeActionProvider, model, model.getFullModelRange(), {
			type: CodeActionTriggerType.Auto,
			triggerAction: CodeActionTriggerSource.OnSave,
			filter: { include: codeActionKind, excludes: excludes, includeSourceActions: true },
		}, progress, token);
	}
}

export class SaveParticipantsContribution extends Disposable implements IWorkbenchContribution {

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITextFileService private readonly textFileService: ITextFileService
	) {
		super();

		this.registerSaveParticipants();
	}

	private registerSaveParticipants(): void {
		this._register(this.textFileService.files.addSaveParticipant(this.instantiationService.createInstance(TrimWhitespaceParticipant)));
		this._register(this.textFileService.files.addSaveParticipant(this.instantiationService.createInstance(CodeActionOnSaveParticipant)));
		this._register(this.textFileService.files.addSaveParticipant(this.instantiationService.createInstance(FormatOnSaveParticipant)));
		this._register(this.textFileService.files.addSaveParticipant(this.instantiationService.createInstance(FinalNewLineParticipant)));
		this._register(this.textFileService.files.addSaveParticipant(this.instantiationService.createInstance(TrimFinalNewLinesParticipant)));
	}
}

const workbenchContributionsRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchContributionsExtensions.Workbench);
workbenchContributionsRegistry.registerWorkbenchContribution(SaveParticipantsContribution, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/selectionClipboard.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/selectionClipboard.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const SelectionClipboardContributionID = 'editor.contrib.selectionClipboard';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/simpleEditorOptions.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/simpleEditorOptions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { ICodeEditorWidgetOptions } from '../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { ContextMenuController } from '../../../../editor/contrib/contextmenu/browser/contextmenu.js';
import { SnippetController2 } from '../../../../editor/contrib/snippet/browser/snippetController2.js';
import { SuggestController } from '../../../../editor/contrib/suggest/browser/suggestController.js';
import { MenuPreventer } from './menuPreventer.js';
import { SelectionClipboardContributionID } from './selectionClipboard.js';
import { TabCompletionController } from '../../snippets/browser/tabCompletion.js';
import { EditorExtensionsRegistry } from '../../../../editor/browser/editorExtensions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { selectionBackground, inputBackground, inputForeground, editorSelectionBackground } from '../../../../platform/theme/common/colorRegistry.js';

export function getSimpleEditorOptions(configurationService: IConfigurationService): IEditorOptions {
	return {
		wordWrap: 'on',
		overviewRulerLanes: 0,
		glyphMargin: false,
		lineNumbers: 'off',
		folding: false,
		selectOnLineNumbers: false,
		hideCursorInOverviewRuler: true,
		selectionHighlight: false,
		scrollbar: {
			horizontal: 'hidden',
			alwaysConsumeMouseWheel: false
		},
		lineDecorationsWidth: 0,
		overviewRulerBorder: false,
		scrollBeyondLastLine: false,
		renderLineHighlight: 'none',
		fixedOverflowWidgets: true,
		acceptSuggestionOnEnter: 'smart',
		dragAndDrop: false,
		revealHorizontalRightPadding: 5,
		minimap: {
			enabled: false
		},
		guides: {
			indentation: false
		},
		wordSegmenterLocales: configurationService.getValue<string | string[]>('editor.wordSegmenterLocales'),
		accessibilitySupport: configurationService.getValue<'auto' | 'off' | 'on'>('editor.accessibilitySupport'),
		cursorBlinking: configurationService.getValue<'blink' | 'smooth' | 'phase' | 'expand' | 'solid'>('editor.cursorBlinking'),
		editContext: configurationService.getValue<boolean>('editor.editContext'),
		defaultColorDecorators: 'never',
		allowVariableLineHeights: false,
		allowVariableFonts: false,
		allowVariableFontsInAccessibilityMode: false,
	};
}

export function getSimpleCodeEditorWidgetOptions(): ICodeEditorWidgetOptions {
	return {
		isSimpleWidget: true,
		contributions: EditorExtensionsRegistry.getSomeEditorContributions([
			MenuPreventer.ID,
			SelectionClipboardContributionID,
			ContextMenuController.ID,
			SuggestController.ID,
			SnippetController2.ID,
			TabCompletionController.ID,
		])
	};
}

/**
 * Should be called to set the styling on editors that are appearing as just input boxes
 * @param editorContainerSelector An element selector that will match the container of the editor
 */
export function setupSimpleEditorSelectionStyling(editorContainerSelector: string): IDisposable {
	// Override styles in selections.ts
	return registerThemingParticipant((theme, collector) => {
		const selectionBackgroundColor = theme.getColor(selectionBackground);

		if (selectionBackgroundColor) {
			// Override inactive selection bg
			const inputBackgroundColor = theme.getColor(inputBackground);
			if (inputBackgroundColor) {
				collector.addRule(`${editorContainerSelector} .monaco-editor-background { background-color: ${inputBackgroundColor}; } `);
				collector.addRule(`${editorContainerSelector} .monaco-editor .selected-text { background-color: ${inputBackgroundColor.transparent(0.4)}; }`);
			}

			// Override selected fg
			const inputForegroundColor = theme.getColor(inputForeground);
			if (inputForegroundColor) {
				collector.addRule(`${editorContainerSelector} .monaco-editor .view-line span.inline-selected-text { color: ${inputForegroundColor}; }`);
			}

			collector.addRule(`${editorContainerSelector} .monaco-editor .focused .selected-text { background-color: ${selectionBackgroundColor}; }`);
		} else {
			// Use editor selection color if theme has not set a selection background color
			collector.addRule(`${editorContainerSelector} .monaco-editor .focused .selected-text { background-color: ${theme.getColor(editorSelectionBackground)}; }`);
		}
	});

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/toggleColumnSelection.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/toggleColumnSelection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { CoreNavigationCommands } from '../../../../editor/browser/coreCommands.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';

export class ToggleColumnSelectionAction extends Action2 {

	static readonly ID = 'editor.action.toggleColumnSelection';

	constructor() {
		super({
			id: ToggleColumnSelectionAction.ID,
			title: {
				...localize2('toggleColumnSelection', "Toggle Column Selection Mode"),
				mnemonicTitle: localize({ key: 'miColumnSelection', comment: ['&& denotes a mnemonic'] }, "Column &&Selection Mode"),
			},
			f1: true,
			toggled: ContextKeyExpr.equals('config.editor.columnSelection', true),
			menu: {
				id: MenuId.MenubarSelectionMenu,
				group: '4_config',
				order: 2
			}
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);
		const codeEditorService = accessor.get(ICodeEditorService);

		const oldValue = configurationService.getValue('editor.columnSelection');
		const codeEditor = this._getCodeEditor(codeEditorService);
		await configurationService.updateValue('editor.columnSelection', !oldValue);
		const newValue = configurationService.getValue('editor.columnSelection');
		if (!codeEditor || codeEditor !== this._getCodeEditor(codeEditorService) || oldValue === newValue || !codeEditor.hasModel() || typeof oldValue !== 'boolean' || typeof newValue !== 'boolean') {
			return;
		}
		const viewModel = codeEditor._getViewModel();
		if (codeEditor.getOption(EditorOption.columnSelection)) {
			const selection = codeEditor.getSelection();
			const modelSelectionStart = new Position(selection.selectionStartLineNumber, selection.selectionStartColumn);
			const viewSelectionStart = viewModel.coordinatesConverter.convertModelPositionToViewPosition(modelSelectionStart);
			const modelPosition = new Position(selection.positionLineNumber, selection.positionColumn);
			const viewPosition = viewModel.coordinatesConverter.convertModelPositionToViewPosition(modelPosition);

			CoreNavigationCommands.MoveTo.runCoreEditorCommand(viewModel, {
				position: modelSelectionStart,
				viewPosition: viewSelectionStart
			});
			const visibleColumn = viewModel.cursorConfig.visibleColumnFromColumn(viewModel, viewPosition);
			CoreNavigationCommands.ColumnSelect.runCoreEditorCommand(viewModel, {
				position: modelPosition,
				viewPosition: viewPosition,
				doColumnSelect: true,
				mouseColumn: visibleColumn + 1
			});
		} else {
			const columnSelectData = viewModel.getCursorColumnSelectData();
			const fromViewColumn = viewModel.cursorConfig.columnFromVisibleColumn(viewModel, columnSelectData.fromViewLineNumber, columnSelectData.fromViewVisualColumn);
			const fromPosition = viewModel.coordinatesConverter.convertViewPositionToModelPosition(new Position(columnSelectData.fromViewLineNumber, fromViewColumn));
			const toViewColumn = viewModel.cursorConfig.columnFromVisibleColumn(viewModel, columnSelectData.toViewLineNumber, columnSelectData.toViewVisualColumn);
			const toPosition = viewModel.coordinatesConverter.convertViewPositionToModelPosition(new Position(columnSelectData.toViewLineNumber, toViewColumn));

			codeEditor.setSelection(new Selection(fromPosition.lineNumber, fromPosition.column, toPosition.lineNumber, toPosition.column));
		}
	}

	private _getCodeEditor(codeEditorService: ICodeEditorService): ICodeEditor | null {
		const codeEditor = codeEditorService.getFocusedCodeEditor();
		if (codeEditor) {
			return codeEditor;
		}
		return codeEditorService.getActiveCodeEditor();
	}
}

registerAction2(ToggleColumnSelectionAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/toggleMinimap.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/toggleMinimap.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';

export class ToggleMinimapAction extends Action2 {

	static readonly ID = 'editor.action.toggleMinimap';

	constructor() {
		super({
			id: ToggleMinimapAction.ID,
			title: {
				...localize2('toggleMinimap', "Toggle Minimap"),
				mnemonicTitle: localize({ key: 'miMinimap', comment: ['&& denotes a mnemonic'] }, "&&Minimap"),
			},
			category: Categories.View,
			f1: true,
			toggled: ContextKeyExpr.equals('config.editor.minimap.enabled', true),
			menu: {
				id: MenuId.MenubarAppearanceMenu,
				group: '4_editor',
				order: 1
			}
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);

		const newValue = !configurationService.getValue('editor.minimap.enabled');
		return configurationService.updateValue('editor.minimap.enabled', newValue);
	}
}

registerAction2(ToggleMinimapAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/toggleMultiCursorModifier.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/toggleMultiCursorModifier.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import { localize, localize2 } from '../../../../nls.js';
import { Action2, MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';

export class ToggleMultiCursorModifierAction extends Action2 {

	static readonly ID = 'workbench.action.toggleMultiCursorModifier';

	private static readonly multiCursorModifierConfigurationKey = 'editor.multiCursorModifier';

	constructor() {
		super({
			id: ToggleMultiCursorModifierAction.ID,
			title: localize2('toggleLocation', 'Toggle Multi-Cursor Modifier'),
			f1: true
		});
	}

	override run(accessor: ServicesAccessor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);

		const editorConf = configurationService.getValue<{ multiCursorModifier: 'ctrlCmd' | 'alt' }>('editor');
		const newValue: 'ctrlCmd' | 'alt' = (editorConf.multiCursorModifier === 'ctrlCmd' ? 'alt' : 'ctrlCmd');

		return configurationService.updateValue(ToggleMultiCursorModifierAction.multiCursorModifierConfigurationKey, newValue);
	}
}

const multiCursorModifier = new RawContextKey<string>('multiCursorModifier', 'altKey');

class MultiCursorModifierContextKeyController extends Disposable implements IWorkbenchContribution {

	private readonly _multiCursorModifier: IContextKey<string>;

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		super();
		this._multiCursorModifier = multiCursorModifier.bindTo(contextKeyService);

		this._update();
		this._register(configurationService.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('editor.multiCursorModifier')) {
				this._update();
			}
		}));
	}

	private _update(): void {
		const editorConf = this.configurationService.getValue<{ multiCursorModifier: 'ctrlCmd' | 'alt' }>('editor');
		const value = (editorConf.multiCursorModifier === 'ctrlCmd' ? 'ctrlCmd' : 'altKey');
		this._multiCursorModifier.set(value);
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(MultiCursorModifierContextKeyController, LifecyclePhase.Restored);

registerAction2(ToggleMultiCursorModifierAction);

MenuRegistry.appendMenuItem(MenuId.MenubarSelectionMenu, {
	group: '4_config',
	command: {
		id: ToggleMultiCursorModifierAction.ID,
		title: localize('miMultiCursorAlt', "Switch to Alt+Click for Multi-Cursor")
	},
	when: multiCursorModifier.isEqualTo('ctrlCmd'),
	order: 1
});
MenuRegistry.appendMenuItem(MenuId.MenubarSelectionMenu, {
	group: '4_config',
	command: {
		id: ToggleMultiCursorModifierAction.ID,
		title: (
			isMacintosh
				? localize('miMultiCursorCmd', "Switch to Cmd+Click for Multi-Cursor")
				: localize('miMultiCursorCtrl', "Switch to Ctrl+Click for Multi-Cursor")
		)
	},
	when: multiCursorModifier.isEqualTo('altKey'),
	order: 1
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/toggleOvertype.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/toggleOvertype.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { InputMode } from '../../../../editor/common/inputMode.js';

export class ToggleOvertypeInsertMode extends Action2 {

	constructor() {
		super({
			id: 'editor.action.toggleOvertypeInsertMode',
			title: {
				...localize2('toggleOvertypeInsertMode', "Toggle Overtype/Insert Mode"),
				mnemonicTitle: localize({ key: 'mitoggleOvertypeInsertMode', comment: ['&& denotes a mnemonic'] }, "&&Toggle Overtype/Insert Mode"),
			},
			metadata: {
				description: localize2('toggleOvertypeMode.description', "Toggle between overtype and insert mode"),
			},
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyCode.Insert,
				mac: { primary: KeyMod.Alt | KeyMod.CtrlCmd | KeyCode.KeyO },
			},
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const oldInputMode = InputMode.getInputMode();
		const newInputMode = oldInputMode === 'insert' ? 'overtype' : 'insert';
		InputMode.setInputMode(newInputMode);
	}
}

registerAction2(ToggleOvertypeInsertMode);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/toggleRenderControlCharacter.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/toggleRenderControlCharacter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';

export class ToggleRenderControlCharacterAction extends Action2 {

	static readonly ID = 'editor.action.toggleRenderControlCharacter';

	constructor() {
		super({
			id: ToggleRenderControlCharacterAction.ID,
			title: {
				...localize2('toggleRenderControlCharacters', "Toggle Control Characters"),
				mnemonicTitle: localize({ key: 'miToggleRenderControlCharacters', comment: ['&& denotes a mnemonic'] }, "Render &&Control Characters"),
			},
			category: Categories.View,
			f1: true,
			toggled: ContextKeyExpr.equals('config.editor.renderControlCharacters', true),
			menu: {
				id: MenuId.MenubarAppearanceMenu,
				group: '4_editor',
				order: 5
			}
		});
	}

	override run(accessor: ServicesAccessor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);

		const newRenderControlCharacters = !configurationService.getValue<boolean>('editor.renderControlCharacters');
		return configurationService.updateValue('editor.renderControlCharacters', newRenderControlCharacters);
	}
}

registerAction2(ToggleRenderControlCharacterAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/toggleRenderWhitespace.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/toggleRenderWhitespace.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';

class ToggleRenderWhitespaceAction extends Action2 {

	static readonly ID = 'editor.action.toggleRenderWhitespace';

	constructor() {
		super({
			id: ToggleRenderWhitespaceAction.ID,
			title: {
				...localize2('toggleRenderWhitespace', "Toggle Render Whitespace"),
				mnemonicTitle: localize({ key: 'miToggleRenderWhitespace', comment: ['&& denotes a mnemonic'] }, "&&Render Whitespace"),
			},
			category: Categories.View,
			f1: true,
			toggled: ContextKeyExpr.notEquals('config.editor.renderWhitespace', 'none'),
			menu: {
				id: MenuId.MenubarAppearanceMenu,
				group: '4_editor',
				order: 4
			}
		});
	}

	override run(accessor: ServicesAccessor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);

		const renderWhitespace = configurationService.getValue<string>('editor.renderWhitespace');

		let newRenderWhitespace: string;
		if (renderWhitespace === 'none') {
			newRenderWhitespace = 'all';
		} else {
			newRenderWhitespace = 'none';
		}

		return configurationService.updateValue('editor.renderWhitespace', newRenderWhitespace);
	}
}

registerAction2(ToggleRenderWhitespaceAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/toggleWordWrap.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/toggleWordWrap.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener, onDidRegisterWindow } from '../../../../base/browser/dom.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Event } from '../../../../base/common/event.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { IActiveCodeEditor, ICodeEditor, IDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorAction, EditorContributionInstantiation, ServicesAccessor, registerDiffEditorContribution, registerEditorAction, registerEditorContribution } from '../../../../editor/browser/editorExtensions.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { findDiffEditorContainingCodeEditor } from '../../../../editor/browser/widget/diffEditor/commands.js';
import { EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { IDiffEditorContribution, IEditorContribution } from '../../../../editor/common/editorCommon.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { ITextModel } from '../../../../editor/common/model.js';
import * as nls from '../../../../nls.js';
import { MenuId, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';

const transientWordWrapState = 'transientWordWrapState';
const isWordWrapMinifiedKey = 'isWordWrapMinified';
const isDominatedByLongLinesKey = 'isDominatedByLongLines';
const CAN_TOGGLE_WORD_WRAP = new RawContextKey<boolean>('canToggleWordWrap', false, true);
const EDITOR_WORD_WRAP = new RawContextKey<boolean>('editorWordWrap', false, nls.localize('editorWordWrap', 'Whether the editor is currently using word wrapping.'));

/**
 * State written/read by the toggle word wrap action and associated with a particular model.
 */
export interface IWordWrapTransientState {
	readonly wordWrapOverride: 'on' | 'off';
}

/**
 * Store (in memory) the word wrap state for a particular model.
 */
export function writeTransientState(model: ITextModel, state: IWordWrapTransientState | null, codeEditorService: ICodeEditorService): void {
	codeEditorService.setTransientModelProperty(model, transientWordWrapState, state);
}

/**
 * Read (in memory) the word wrap state for a particular model.
 */
export function readTransientState(model: ITextModel, codeEditorService: ICodeEditorService): IWordWrapTransientState | null {
	return codeEditorService.getTransientModelProperty(model, transientWordWrapState) as IWordWrapTransientState | null;
}

const TOGGLE_WORD_WRAP_ID = 'editor.action.toggleWordWrap';
class ToggleWordWrapAction extends EditorAction {

	constructor() {
		super({
			id: TOGGLE_WORD_WRAP_ID,
			label: nls.localize2('toggle.wordwrap', "View: Toggle Word Wrap"),
			precondition: undefined,
			kbOpts: {
				kbExpr: null,
				primary: KeyMod.Alt | KeyCode.KeyZ,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const codeEditorService = accessor.get(ICodeEditorService);
		const instaService = accessor.get(IInstantiationService);

		if (!canToggleWordWrap(codeEditorService, editor)) {
			return;
		}

		const model = editor.getModel();

		// Read the current state
		const transientState = readTransientState(model, codeEditorService);

		// Compute the new state
		let newState: IWordWrapTransientState | null;
		if (transientState) {
			newState = null;
		} else {
			const actualWrappingInfo = editor.getOption(EditorOption.wrappingInfo);
			const wordWrapOverride = (actualWrappingInfo.wrappingColumn === -1 ? 'on' : 'off');
			newState = { wordWrapOverride };
		}

		// Write the new state
		// (this will cause an event and the controller will apply the state)
		writeTransientState(model, newState, codeEditorService);

		// if we are in a diff editor, update the other editor (if possible)
		const diffEditor = instaService.invokeFunction(findDiffEditorContainingCodeEditor, editor);
		if (diffEditor) {
			const originalEditor = diffEditor.getOriginalEditor();
			const modifiedEditor = diffEditor.getModifiedEditor();
			const otherEditor = (originalEditor === editor ? modifiedEditor : originalEditor);
			if (canToggleWordWrap(codeEditorService, otherEditor)) {
				writeTransientState(otherEditor.getModel(), newState, codeEditorService);
				diffEditor.updateOptions({});
			}
		}
	}
}

class ToggleWordWrapController extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.toggleWordWrapController';

	constructor(
		private readonly _editor: ICodeEditor,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@ICodeEditorService private readonly _codeEditorService: ICodeEditorService
	) {
		super();

		const options = this._editor.getOptions();
		const wrappingInfo = options.get(EditorOption.wrappingInfo);
		const isWordWrapMinified = this._contextKeyService.createKey(isWordWrapMinifiedKey, wrappingInfo.isWordWrapMinified);
		const isDominatedByLongLines = this._contextKeyService.createKey(isDominatedByLongLinesKey, wrappingInfo.isDominatedByLongLines);
		let currentlyApplyingEditorConfig = false;

		this._register(_editor.onDidChangeConfiguration((e) => {
			if (!e.hasChanged(EditorOption.wrappingInfo)) {
				return;
			}
			const options = this._editor.getOptions();
			const wrappingInfo = options.get(EditorOption.wrappingInfo);
			isWordWrapMinified.set(wrappingInfo.isWordWrapMinified);
			isDominatedByLongLines.set(wrappingInfo.isDominatedByLongLines);
			if (!currentlyApplyingEditorConfig) {
				// I am not the cause of the word wrap getting changed
				ensureWordWrapSettings();
			}
		}));

		this._register(_editor.onDidChangeModel((e) => {
			ensureWordWrapSettings();
		}));

		this._register(_codeEditorService.onDidChangeTransientModelProperty(() => {
			ensureWordWrapSettings();
		}));

		const ensureWordWrapSettings = () => {
			if (!canToggleWordWrap(this._codeEditorService, this._editor)) {
				return;
			}

			const transientState = readTransientState(this._editor.getModel(), this._codeEditorService);

			// Apply the state
			try {
				currentlyApplyingEditorConfig = true;
				this._applyWordWrapState(transientState);
			} finally {
				currentlyApplyingEditorConfig = false;
			}
		};
	}

	private _applyWordWrapState(state: IWordWrapTransientState | null): void {
		const wordWrapOverride2 = state ? state.wordWrapOverride : 'inherit';
		this._editor.updateOptions({
			wordWrapOverride2: wordWrapOverride2
		});
	}
}

class DiffToggleWordWrapController extends Disposable implements IDiffEditorContribution {

	public static readonly ID = 'diffeditor.contrib.toggleWordWrapController';

	constructor(
		private readonly _diffEditor: IDiffEditor,
		@ICodeEditorService private readonly _codeEditorService: ICodeEditorService
	) {
		super();

		this._register(this._diffEditor.onDidChangeModel(() => {
			this._ensureSyncedWordWrapToggle();
		}));
	}

	private _ensureSyncedWordWrapToggle(): void {
		const originalEditor = this._diffEditor.getOriginalEditor();
		const modifiedEditor = this._diffEditor.getModifiedEditor();

		if (!originalEditor.hasModel() || !modifiedEditor.hasModel()) {
			return;
		}

		const originalTransientState = readTransientState(originalEditor.getModel(), this._codeEditorService);
		const modifiedTransientState = readTransientState(modifiedEditor.getModel(), this._codeEditorService);

		if (originalTransientState && !modifiedTransientState && canToggleWordWrap(this._codeEditorService, originalEditor)) {
			writeTransientState(modifiedEditor.getModel(), originalTransientState, this._codeEditorService);
			this._diffEditor.updateOptions({});
		}
		if (!originalTransientState && modifiedTransientState && canToggleWordWrap(this._codeEditorService, modifiedEditor)) {
			writeTransientState(originalEditor.getModel(), modifiedTransientState, this._codeEditorService);
			this._diffEditor.updateOptions({});
		}
	}
}

function canToggleWordWrap(codeEditorService: ICodeEditorService, editor: ICodeEditor | null): editor is IActiveCodeEditor {
	if (!editor) {
		return false;
	}
	if (editor.isSimpleWidget) {
		// in a simple widget...
		return false;
	}
	// Ensure correct word wrap settings
	const model = editor.getModel();
	if (!model) {
		return false;
	}
	if (editor.getOption(EditorOption.inDiffEditor)) {
		// this editor belongs to a diff editor
		for (const diffEditor of codeEditorService.listDiffEditors()) {
			if (diffEditor.getOriginalEditor() === editor && !diffEditor.renderSideBySide) {
				// this editor is the left side of an inline diff editor
				return false;
			}
		}
	}

	return true;
}

class EditorWordWrapContextKeyTracker extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.editorWordWrapContextKeyTracker';

	private readonly _canToggleWordWrap: IContextKey<boolean>;
	private readonly _editorWordWrap: IContextKey<boolean>;
	private _activeEditor: ICodeEditor | null;
	private readonly _activeEditorListener: DisposableStore;

	constructor(
		@IEditorService private readonly _editorService: IEditorService,
		@ICodeEditorService private readonly _codeEditorService: ICodeEditorService,
		@IContextKeyService private readonly _contextService: IContextKeyService,
	) {
		super();
		this._register(Event.runAndSubscribe(onDidRegisterWindow, ({ window, disposables }) => {
			disposables.add(addDisposableListener(window, 'focus', () => this._update(), true));
			disposables.add(addDisposableListener(window, 'blur', () => this._update(), true));
		}, { window: mainWindow, disposables: this._store }));
		this._register(this._editorService.onDidActiveEditorChange(() => this._update()));
		this._canToggleWordWrap = CAN_TOGGLE_WORD_WRAP.bindTo(this._contextService);
		this._editorWordWrap = EDITOR_WORD_WRAP.bindTo(this._contextService);
		this._activeEditor = null;
		this._activeEditorListener = new DisposableStore();
		this._update();
	}

	private _update(): void {
		const activeEditor = this._codeEditorService.getFocusedCodeEditor() || this._codeEditorService.getActiveCodeEditor();
		if (this._activeEditor === activeEditor) {
			// no change
			return;
		}
		this._activeEditorListener.clear();
		this._activeEditor = activeEditor;

		if (activeEditor) {
			this._activeEditorListener.add(activeEditor.onDidChangeModel(() => this._updateFromCodeEditor()));
			this._activeEditorListener.add(activeEditor.onDidChangeConfiguration((e) => {
				if (e.hasChanged(EditorOption.wrappingInfo)) {
					this._updateFromCodeEditor();
				}
			}));
			this._updateFromCodeEditor();
		}
	}

	private _updateFromCodeEditor(): void {
		if (!canToggleWordWrap(this._codeEditorService, this._activeEditor)) {
			return this._setValues(false, false);
		} else {
			const wrappingInfo = this._activeEditor.getOption(EditorOption.wrappingInfo);
			this._setValues(true, wrappingInfo.wrappingColumn !== -1);
		}
	}

	private _setValues(canToggleWordWrap: boolean, isWordWrap: boolean): void {
		this._canToggleWordWrap.set(canToggleWordWrap);
		this._editorWordWrap.set(isWordWrap);
	}
}

registerWorkbenchContribution2(EditorWordWrapContextKeyTracker.ID, EditorWordWrapContextKeyTracker, WorkbenchPhase.AfterRestored);

registerEditorContribution(ToggleWordWrapController.ID, ToggleWordWrapController, EditorContributionInstantiation.Eager); // eager because it needs to change the editor word wrap configuration
registerDiffEditorContribution(DiffToggleWordWrapController.ID, DiffToggleWordWrapController);
registerEditorAction(ToggleWordWrapAction);

MenuRegistry.appendMenuItem(MenuId.EditorTitle, {
	command: {
		id: TOGGLE_WORD_WRAP_ID,
		title: nls.localize('unwrapMinified', "Disable wrapping for this file"),
		icon: Codicon.wordWrap
	},
	group: 'navigation',
	order: 1,
	when: ContextKeyExpr.and(
		ContextKeyExpr.has(isDominatedByLongLinesKey),
		ContextKeyExpr.has(isWordWrapMinifiedKey)
	)
});
MenuRegistry.appendMenuItem(MenuId.EditorTitle, {
	command: {
		id: TOGGLE_WORD_WRAP_ID,
		title: nls.localize('wrapMinified', "Enable wrapping for this file"),
		icon: Codicon.wordWrap
	},
	group: 'navigation',
	order: 1,
	when: ContextKeyExpr.and(
		EditorContextKeys.inDiffEditor.negate(),
		ContextKeyExpr.has(isDominatedByLongLinesKey),
		ContextKeyExpr.not(isWordWrapMinifiedKey)
	)
});


// View menu
MenuRegistry.appendMenuItem(MenuId.MenubarViewMenu, {
	command: {
		id: TOGGLE_WORD_WRAP_ID,
		title: nls.localize({ key: 'miToggleWordWrap', comment: ['&& denotes a mnemonic'] }, "&&Word Wrap"),
		toggled: EDITOR_WORD_WRAP,
		precondition: CAN_TOGGLE_WORD_WRAP
	},
	order: 1,
	group: '6_editor'
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/workbenchReferenceSearch.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/workbenchReferenceSearch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../../editor/browser/editorExtensions.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { ReferencesController } from '../../../../editor/contrib/gotoSymbol/browser/peek/referencesController.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';

export class WorkbenchReferencesController extends ReferencesController {

	public constructor(
		editor: ICodeEditor,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ICodeEditorService editorService: ICodeEditorService,
		@INotificationService notificationService: INotificationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IStorageService storageService: IStorageService,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super(
			false,
			editor,
			contextKeyService,
			editorService,
			notificationService,
			instantiationService,
			storageService,
			configurationService
		);
	}
}

registerEditorContribution(ReferencesController.ID, WorkbenchReferencesController, EditorContributionInstantiation.Lazy);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/accessibility/accessibility.css]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/accessibility/accessibility.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.accessible-view {
	position: absolute;
	background-color: var(--vscode-editorWidget-background);
	color: var(--vscode-editorWidget-foreground);
	box-shadow: 0 2px 8px var(--vscode-widget-shadow);
	border: 2px solid var(--vscode-focusBorder);
	border-radius: 6px;
	margin-top: -1px;
	z-index: 2550;
}

.accessible-view-container .actions-container {
	display: flex;
	margin: 0 auto;
	padding: 0;
	width: 100%;
	justify-content: flex-end;
}

.accessible-view-title-bar {
	display: flex;
	align-items: center;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
}

.accessible-view-title {
	padding: 3px 0px;
	text-align: center;
	text-overflow: ellipsis;
	overflow: hidden;
	width: 100%;
}

.accessible-view-action-bar {
	justify-content: flex-end;
	margin-right: 4px;
	flex: 1;
}

.accessible-view-action-bar > .actions-container {
	justify-content: flex-end;
}

.accessible-view-title-bar .monaco-action-bar .action-label.codicon {
	background-position: center;
	background-repeat: no-repeat;
	padding: 2px;
}

.accessible-view.hide {
	position: fixed;
	top: -2000px;
	left:-2000px;
	pointer-events: none;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/accessibility/accessibility.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/accessibility/accessibility.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './accessibility.css';
import * as nls from '../../../../../nls.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IAccessibilityService } from '../../../../../platform/accessibility/common/accessibility.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { accessibilityHelpIsShown } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { alert } from '../../../../../base/browser/ui/aria/aria.js';
import { AccessibilityHelpNLS } from '../../../../../editor/common/standaloneStrings.js';

class ToggleScreenReaderMode extends Action2 {

	constructor() {
		super({
			id: 'editor.action.toggleScreenReaderAccessibilityMode',
			title: nls.localize2('toggleScreenReaderMode', "Toggle Screen Reader Accessibility Mode"),
			metadata: {
				description: nls.localize2('toggleScreenReaderModeDescription', "Toggles an optimized mode for usage with screen readers, braille devices, and other assistive technologies."),
			},
			f1: true,
			keybinding: [{
				primary: KeyMod.CtrlCmd | KeyCode.KeyE,
				weight: KeybindingWeight.WorkbenchContrib + 10,
				when: accessibilityHelpIsShown
			},
			{
				primary: KeyMod.Alt | KeyCode.F1 | KeyMod.Shift,
				linux: { primary: KeyMod.Alt | KeyCode.F4 | KeyMod.Shift },
				weight: KeybindingWeight.WorkbenchContrib + 10,
			}]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const accessibiiltyService = accessor.get(IAccessibilityService);
		const configurationService = accessor.get(IConfigurationService);
		const isScreenReaderOptimized = accessibiiltyService.isScreenReaderOptimized();
		configurationService.updateValue('editor.accessibilitySupport', isScreenReaderOptimized ? 'off' : 'on', ConfigurationTarget.USER);
		alert(isScreenReaderOptimized ? AccessibilityHelpNLS.screenReaderModeDisabled : AccessibilityHelpNLS.screenReaderModeEnabled);
	}
}

registerAction2(ToggleScreenReaderMode);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/dictation/editorDictation.css]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/dictation/editorDictation.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .editor-dictation-widget {
	background-color: var(--vscode-editor-background);
	padding: 2px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	box-shadow: 0 4px 8px var(--vscode-widget-shadow);
	z-index: 1000;
	min-height: var(--vscode-editor-dictation-widget-height);
	line-height: var(--vscode-editor-dictation-widget-height);
	max-width: var(--vscode-editor-dictation-widget-width);
}

.monaco-editor .editor-dictation-widget.recording .codicon.codicon-mic-filled {
	color: var(--vscode-activityBarBadge-background);
	animation: editor-dictation-animation 1s infinite;
}

@keyframes editor-dictation-animation {
	0% {
		color: var(--vscode-editorCursor-background);
	}

	50% {
		color: var(--vscode-activityBarBadge-background);
	}

	100% {
		color: var(--vscode-editorCursor-background);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/dictation/editorDictation.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/dictation/editorDictation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './editorDictation.css';
import { localize, localize2 } from '../../../../../nls.js';
import { IDimension } from '../../../../../base/browser/dom.js';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { Disposable, DisposableStore, MutableDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidget, IContentWidgetPosition } from '../../../../../editor/browser/editorBrowser.js';
import { IEditorContribution } from '../../../../../editor/common/editorCommon.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../../platform/contextkey/common/contextkey.js';
import { HasSpeechProvider, ISpeechService, SpeechToTextInProgress, SpeechToTextStatus } from '../../../speech/common/speechService.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { EditorOption } from '../../../../../editor/common/config/editorOptions.js';
import { EditorAction2, EditorContributionInstantiation, registerEditorContribution } from '../../../../../editor/browser/editorExtensions.js';
import { EditorContextKeys } from '../../../../../editor/common/editorContextKeys.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { EditOperation } from '../../../../../editor/common/core/editOperation.js';
import { Selection } from '../../../../../editor/common/core/selection.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { assertReturnsDefined } from '../../../../../base/common/types.js';
import { ActionBar } from '../../../../../base/browser/ui/actionbar/actionbar.js';
import { toAction } from '../../../../../base/common/actions.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { isWindows } from '../../../../../base/common/platform.js';

const EDITOR_DICTATION_IN_PROGRESS = new RawContextKey<boolean>('editorDictation.inProgress', false);
const VOICE_CATEGORY = localize2('voiceCategory', "Voice");

export class EditorDictationStartAction extends EditorAction2 {

	constructor() {
		super({
			id: 'workbench.action.editorDictation.start',
			title: localize2('startDictation', "Start Dictation in Editor"),
			category: VOICE_CATEGORY,
			precondition: ContextKeyExpr.and(
				HasSpeechProvider,
				SpeechToTextInProgress.toNegated(),		// disable when any speech-to-text is in progress
				EditorContextKeys.readOnly.toNegated()	// disable in read-only editors
			),
			f1: true,
			keybinding: {
				primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyV,
				weight: KeybindingWeight.WorkbenchContrib,
				secondary: isWindows ? [
					KeyMod.Alt | KeyCode.Backquote
				] : undefined
			}
		});
	}

	override runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const keybindingService = accessor.get(IKeybindingService);

		const holdMode = keybindingService.enableKeybindingHoldMode(this.desc.id);
		if (holdMode) {
			let shouldCallStop = false;

			const handle = setTimeout(() => {
				shouldCallStop = true;
			}, 500);

			holdMode.finally(() => {
				clearTimeout(handle);

				if (shouldCallStop) {
					EditorDictation.get(editor)?.stop();
				}
			});
		}

		EditorDictation.get(editor)?.start();
	}
}

export class EditorDictationStopAction extends EditorAction2 {

	static readonly ID = 'workbench.action.editorDictation.stop';

	constructor() {
		super({
			id: EditorDictationStopAction.ID,
			title: localize2('stopDictation', "Stop Dictation in Editor"),
			category: VOICE_CATEGORY,
			precondition: EDITOR_DICTATION_IN_PROGRESS,
			f1: true,
			keybinding: {
				primary: KeyCode.Escape,
				weight: KeybindingWeight.WorkbenchContrib + 100
			}
		});
	}

	override runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		EditorDictation.get(editor)?.stop();
	}
}

export class DictationWidget extends Disposable implements IContentWidget {

	readonly suppressMouseDown = true;
	readonly allowEditorOverflow = true;

	private readonly domNode = document.createElement('div');

	constructor(private readonly editor: ICodeEditor, keybindingService: IKeybindingService) {
		super();

		const actionBar = this._register(new ActionBar(this.domNode));
		const stopActionKeybinding = keybindingService.lookupKeybinding(EditorDictationStopAction.ID)?.getLabel();
		actionBar.push(toAction({
			id: EditorDictationStopAction.ID,
			label: stopActionKeybinding ? localize('stopDictationShort1', "Stop Dictation ({0})", stopActionKeybinding) : localize('stopDictationShort2', "Stop Dictation"),
			class: ThemeIcon.asClassName(Codicon.micFilled),
			run: () => EditorDictation.get(editor)?.stop()
		}), { icon: true, label: false, keybinding: stopActionKeybinding });

		this.domNode.classList.add('editor-dictation-widget');
		this.domNode.appendChild(actionBar.domNode);
	}

	getId(): string {
		return 'editorDictation';
	}

	getDomNode(): HTMLElement {
		return this.domNode;
	}

	getPosition(): IContentWidgetPosition | null {
		if (!this.editor.hasModel()) {
			return null;
		}

		const selection = this.editor.getSelection();

		return {
			position: selection.getPosition(),
			preference: [
				selection.getPosition().equals(selection.getStartPosition()) ? ContentWidgetPositionPreference.ABOVE : ContentWidgetPositionPreference.BELOW,
				ContentWidgetPositionPreference.EXACT
			]
		};
	}

	beforeRender(): IDimension | null {
		const position = this.editor.getPosition();
		const lineHeight = position ? this.editor.getLineHeightForPosition(position) : this.editor.getOption(EditorOption.lineHeight);
		const width = this.editor.getLayoutInfo().contentWidth * 0.7;

		this.domNode.style.setProperty('--vscode-editor-dictation-widget-height', `${lineHeight}px`);
		this.domNode.style.setProperty('--vscode-editor-dictation-widget-width', `${width}px`);

		return null;
	}

	show() {
		this.editor.addContentWidget(this);
	}

	layout(): void {
		this.editor.layoutContentWidget(this);
	}

	active(): void {
		this.domNode.classList.add('recording');
	}

	hide() {
		this.domNode.classList.remove('recording');
		this.editor.removeContentWidget(this);
	}
}

export class EditorDictation extends Disposable implements IEditorContribution {

	static readonly ID = 'editorDictation';

	static get(editor: ICodeEditor): EditorDictation | null {
		return editor.getContribution<EditorDictation>(EditorDictation.ID);
	}

	private readonly widget: DictationWidget;
	private readonly editorDictationInProgress: IContextKey<boolean>;

	private readonly sessionDisposables = this._register(new MutableDisposable());

	constructor(
		private readonly editor: ICodeEditor,
		@ISpeechService private readonly speechService: ISpeechService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IKeybindingService keybindingService: IKeybindingService
	) {
		super();

		this.widget = this._register(new DictationWidget(this.editor, keybindingService));
		this.editorDictationInProgress = EDITOR_DICTATION_IN_PROGRESS.bindTo(contextKeyService);
	}

	async start(): Promise<void> {
		const disposables = new DisposableStore();
		this.sessionDisposables.value = disposables;

		this.widget.show();
		disposables.add(toDisposable(() => this.widget.hide()));

		this.editorDictationInProgress.set(true);
		disposables.add(toDisposable(() => this.editorDictationInProgress.reset()));

		const collection = this.editor.createDecorationsCollection();
		disposables.add(toDisposable(() => collection.clear()));

		disposables.add(this.editor.onDidChangeCursorPosition(() => this.widget.layout()));

		let previewStart: Position | undefined = undefined;

		let lastReplaceTextLength = 0;
		const replaceText = (text: string, isPreview: boolean) => {
			if (!previewStart) {
				previewStart = assertReturnsDefined(this.editor.getPosition());
			}

			const endPosition = new Position(previewStart.lineNumber, previewStart.column + text.length);
			this.editor.executeEdits(EditorDictation.ID, [
				EditOperation.replace(Range.fromPositions(previewStart, previewStart.with(undefined, previewStart.column + lastReplaceTextLength)), text)
			], [
				Selection.fromPositions(endPosition)
			]);

			if (isPreview) {
				collection.set([
					{
						range: Range.fromPositions(previewStart, previewStart.with(undefined, previewStart.column + text.length)),
						options: {
							description: 'editor-dictation-preview',
							inlineClassName: 'ghost-text-decoration-preview'
						}
					}
				]);
			} else {
				collection.clear();
			}

			lastReplaceTextLength = text.length;
			if (!isPreview) {
				previewStart = undefined;
				lastReplaceTextLength = 0;
			}

			this.editor.revealPositionInCenterIfOutsideViewport(endPosition);
		};

		const cts = new CancellationTokenSource();
		disposables.add(toDisposable(() => cts.dispose(true)));

		const session = await this.speechService.createSpeechToTextSession(cts.token, 'editor');
		disposables.add(session.onDidChange(e => {
			if (cts.token.isCancellationRequested) {
				return;
			}

			switch (e.status) {
				case SpeechToTextStatus.Started:
					this.widget.active();
					break;
				case SpeechToTextStatus.Stopped:
					disposables.dispose();
					break;
				case SpeechToTextStatus.Recognizing: {
					if (!e.text) {
						return;
					}

					replaceText(e.text, true);
					break;
				}
				case SpeechToTextStatus.Recognized: {
					if (!e.text) {
						return;
					}

					replaceText(`${e.text} `, false);
					break;
				}
			}
		}));
	}

	stop(): void {
		this.sessionDisposables.clear();
	}
}

registerEditorContribution(EditorDictation.ID, EditorDictation, EditorContributionInstantiation.Lazy);
registerAction2(EditorDictationStartAction);
registerAction2(EditorDictationStopAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/emptyTextEditorHint/emptyTextEditorHint.css]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/emptyTextEditorHint/emptyTextEditorHint.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .contentWidgets .empty-editor-hint {
	color: var(--vscode-input-placeholderForeground);
	user-select: none;
	-webkit-user-select: none;
	pointer-events: none;
}

.monaco-editor .contentWidgets .empty-editor-hint a {
	color: var(--vscode-textLink-foreground);
	pointer-events: auto;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/emptyTextEditorHint/emptyTextEditorHint.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/emptyTextEditorHint/emptyTextEditorHint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, addDisposableListener, getActiveWindow } from '../../../../../base/browser/dom.js';
import { IContentActionHandler, renderFormattedText } from '../../../../../base/browser/formattedTextRenderer.js';
import { StandardMouseEvent } from '../../../../../base/browser/mouseEvent.js';
import { status } from '../../../../../base/browser/ui/aria/aria.js';
import { WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../../../base/common/actions.js';
import { Event } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidget, IContentWidgetPosition } from '../../../../../editor/browser/editorBrowser.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../../../editor/browser/editorExtensions.js';
import { ConfigurationChangedEvent, EditorOption } from '../../../../../editor/common/config/editorOptions.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { IEditorContribution } from '../../../../../editor/common/editorCommon.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../../editor/common/languages/modesRegistry.js';
import { localize } from '../../../../../nls.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { ChangeLanguageAction } from '../../../../browser/parts/editor/editorStatus.js';
import { LOG_MODE_ID, OUTPUT_MODE_ID } from '../../../../services/output/common/output.js';
import { SEARCH_RESULT_LANGUAGE_ID } from '../../../../services/search/common/search.js';
import { AccessibilityVerbositySettingId } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { IChatAgentService } from '../../../chat/common/chatAgents.js';
import { ChatAgentLocation } from '../../../chat/common/constants.js';
import { IInlineChatSessionService } from '../../../inlineChat/browser/inlineChatSessionService.js';
import './emptyTextEditorHint.css';

export const emptyTextEditorHintSetting = 'workbench.editor.empty.hint';
export class EmptyTextEditorHintContribution extends Disposable implements IEditorContribution {

	static readonly ID = 'editor.contrib.emptyTextEditorHint';

	private textHintContentWidget: EmptyTextEditorHintContentWidget | undefined;

	constructor(
		protected readonly editor: ICodeEditor,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IInlineChatSessionService private readonly inlineChatSessionService: IInlineChatSessionService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();

		this._register(this.editor.onDidChangeModel(() => this.update()));
		this._register(this.editor.onDidChangeModelLanguage(() => this.update()));
		this._register(this.editor.onDidChangeModelContent(() => this.update()));
		this._register(this.chatAgentService.onDidChangeAgents(() => this.update()));
		this._register(this.editor.onDidChangeModelDecorations(() => this.update()));
		this._register(this.editor.onDidChangeConfiguration((e: ConfigurationChangedEvent) => {
			if (e.hasChanged(EditorOption.readOnly)) {
				this.update();
			}
		}));
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(emptyTextEditorHintSetting)) {
				this.update();
			}
		}));
		this._register(inlineChatSessionService.onWillStartSession(editor => {
			if (this.editor === editor) {
				this.textHintContentWidget?.dispose();
			}
		}));
		this._register(inlineChatSessionService.onDidEndSession(e => {
			if (this.editor === e.editor) {
				this.update();
			}
		}));
	}

	protected shouldRenderHint() {
		const configValue = this.configurationService.getValue(emptyTextEditorHintSetting);
		if (configValue === 'hidden') {
			return false;
		}

		if (this.editor.getOption(EditorOption.readOnly)) {
			return false;
		}

		const model = this.editor.getModel();
		const languageId = model?.getLanguageId();
		if (!model || languageId === OUTPUT_MODE_ID || languageId === LOG_MODE_ID || languageId === SEARCH_RESULT_LANGUAGE_ID) {
			return false;
		}

		if (this.inlineChatSessionService.getSession(this.editor, model.uri)) {
			return false;
		}

		if (this.editor.getModel()?.getValueLength()) {
			return false;
		}

		const hasConflictingDecorations = Boolean(this.editor.getLineDecorations(1)?.find((d) =>
			d.options.beforeContentClassName
			|| d.options.afterContentClassName
			|| d.options.before?.content
			|| d.options.after?.content
		));
		if (hasConflictingDecorations) {
			return false;
		}

		const hasEditorAgents = Boolean(this.chatAgentService.getDefaultAgent(ChatAgentLocation.EditorInline));
		const shouldRenderDefaultHint = model?.uri.scheme === Schemas.untitled && languageId === PLAINTEXT_LANGUAGE_ID;
		return hasEditorAgents || shouldRenderDefaultHint;
	}

	protected update(): void {
		const shouldRenderHint = this.shouldRenderHint();
		if (shouldRenderHint && !this.textHintContentWidget) {
			this.textHintContentWidget = this.instantiationService.createInstance(EmptyTextEditorHintContentWidget, this.editor);
		} else if (!shouldRenderHint && this.textHintContentWidget) {
			this.textHintContentWidget.dispose();
			this.textHintContentWidget = undefined;
		}
	}

	override dispose(): void {
		super.dispose();

		this.textHintContentWidget?.dispose();
	}
}

class EmptyTextEditorHintContentWidget extends Disposable implements IContentWidget {

	private static readonly ID = 'editor.widget.emptyHint';

	private domNode: HTMLElement | undefined;
	private isVisible = false;
	private ariaLabel: string = '';

	constructor(
		private readonly editor: ICodeEditor,
		@ICommandService private readonly commandService: ICommandService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
	) {
		super();

		this._register(this.editor.onDidChangeConfiguration((e: ConfigurationChangedEvent) => {
			if (this.domNode && e.hasChanged(EditorOption.fontInfo)) {
				this.editor.applyFontInfo(this.domNode);
			}
		}));
		const onDidFocusEditorText = Event.debounce(this.editor.onDidFocusEditorText, () => undefined, 500);
		this._register(onDidFocusEditorText(() => {
			if (this.editor.hasTextFocus() && this.isVisible && this.ariaLabel && this.configurationService.getValue(AccessibilityVerbositySettingId.EmptyEditorHint)) {
				status(this.ariaLabel);
			}
		}));
		this.editor.addContentWidget(this);
	}

	getId(): string {
		return EmptyTextEditorHintContentWidget.ID;
	}

	private disableHint(e?: MouseEvent) {
		const disableHint = () => {
			this.configurationService.updateValue(emptyTextEditorHintSetting, 'hidden');
			this.dispose();
			this.editor.focus();
		};

		if (!e) {
			disableHint();
			return;
		}

		this.contextMenuService.showContextMenu({
			getAnchor: () => { return new StandardMouseEvent(getActiveWindow(), e); },
			getActions: () => {
				return [{
					id: 'workench.action.disableEmptyEditorHint',
					label: localize('disableEditorEmptyHint', "Disable Empty Editor Hint"),
					tooltip: localize('disableEditorEmptyHint', "Disable Empty Editor Hint"),
					enabled: true,
					class: undefined,
					run: () => {
						disableHint();
					}
				}
				];
			}
		});
	}

	private getHint() {
		const hasInlineChatProvider = this.chatAgentService.getActivatedAgents().filter(candidate => candidate.locations.includes(ChatAgentLocation.EditorInline)).length > 0;

		const hintHandler: IContentActionHandler = {
			disposables: this._store,
			callback: (index, event) => {
				switch (index) {
					case '0':
						hasInlineChatProvider ? askSomething(event.browserEvent) : languageOnClickOrTap(event.browserEvent);
						break;
					case '1':
						hasInlineChatProvider ? languageOnClickOrTap(event.browserEvent) : this.disableHint();
						break;
					case '2':
						this.disableHint();
						break;
				}
			}
		};

		// the actual command handlers...
		const askSomethingCommandId = 'inlineChat.start';
		const askSomething = async (e: UIEvent) => {
			e.stopPropagation();
			this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', {
				id: askSomethingCommandId,
				from: 'hint'
			});
			await this.commandService.executeCommand(askSomethingCommandId, { from: 'hint' });
		};
		const languageOnClickOrTap = async (e: UIEvent) => {
			e.stopPropagation();
			// Need to focus editor before so current editor becomes active and the command is properly executed
			this.editor.focus();
			this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', {
				id: ChangeLanguageAction.ID,
				from: 'hint'
			});
			await this.commandService.executeCommand(ChangeLanguageAction.ID);
			this.editor.focus();
		};

		const keybindingsLookup = [askSomethingCommandId, ChangeLanguageAction.ID];
		const keybindingLabels = keybindingsLookup.map(id => this.keybindingService.lookupKeybinding(id)?.getLabel());

		const hintMsg = (hasInlineChatProvider ? localize({
			key: 'emptyTextEditorHintWithInlineChat',
			comment: [
				'Preserve double-square brackets and their order',
				'language refers to a programming language'
			]
		}, '[[Generate code]] ({0}), or [[select a language]] ({1}). Start typing to dismiss or [[don\'t show]] this again.', keybindingLabels.at(0) ?? '', keybindingLabels.at(1) ?? '') : localize({
			key: 'emptyTextEditorHintWithoutInlineChat',
			comment: [
				'Preserve double-square brackets and their order',
				'language refers to a programming language'
			]
		}, '[[Select a language]] ({0}) to get started. Start typing to dismiss or [[don\'t show]] this again.', keybindingLabels.at(1) ?? '')).replaceAll(' ()', '');
		const hintElement = renderFormattedText(hintMsg, {
			actionHandler: hintHandler,
			renderCodeSegments: false,
		});
		hintElement.style.fontStyle = 'italic';

		const ariaLabel = hasInlineChatProvider ?
			localize('defaultHintAriaLabelWithInlineChat', 'Execute {0} to ask a question, execute {1} to select a language and get started. Start typing to dismiss.', ...keybindingLabels) :
			localize('defaultHintAriaLabelWithoutInlineChat', 'Execute {0} to select a language and get started. Start typing to dismiss.', ...keybindingLabels);
		// eslint-disable-next-line no-restricted-syntax
		for (const anchor of hintElement.querySelectorAll('a')) {
			anchor.style.cursor = 'pointer';
		}

		return { hintElement, ariaLabel };
	}

	getDomNode(): HTMLElement {
		if (!this.domNode) {
			this.domNode = $('.empty-editor-hint');
			this.domNode.style.width = 'max-content';
			this.domNode.style.paddingLeft = '4px';

			const { hintElement, ariaLabel } = this.getHint();
			this.domNode.append(hintElement);
			this.ariaLabel = ariaLabel.concat(localize('disableHint', ' Toggle {0} in settings to disable this hint.', AccessibilityVerbositySettingId.EmptyEditorHint));

			this._register(addDisposableListener(this.domNode, 'click', () => {
				this.editor.focus();
			}));

			this.editor.applyFontInfo(this.domNode);
			const lineHeight = this.editor.getLineHeightForPosition(new Position(1, 1));
			this.domNode.style.lineHeight = lineHeight + 'px';
		}

		return this.domNode;
	}

	getPosition(): IContentWidgetPosition | null {
		return {
			position: { lineNumber: 1, column: 1 },
			preference: [ContentWidgetPositionPreference.EXACT]
		};
	}

	override dispose(): void {
		super.dispose();

		this.editor.removeContentWidget(this);
	}
}

registerEditorContribution(EmptyTextEditorHintContribution.ID, EmptyTextEditorHintContribution, EditorContributionInstantiation.Eager); // eager because it needs to render a help message
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/find/simpleFindWidget.css]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/find/simpleFindWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .simple-find-part-wrapper {
	overflow: hidden;
	z-index: 10;
	position: absolute;
	top: 0;
	right: 18px;
	max-width: calc(100% - 28px - 28px - 8px);
	pointer-events: none;
	padding: 0 10px 10px;
}

.simple-find-part .monaco-inputbox > .ibwrapper > input {
	text-overflow: clip;
}

.monaco-workbench .simple-find-part {
	visibility: hidden; /* Use visibility to maintain flex layout while hidden otherwise interferes with transition */
	z-index: 10;
	position: relative;
	top: -45px;
	display: flex;
	padding: 4px;
	align-items: center;
	pointer-events: all;
	transition: top 200ms linear;
	background-color: var(--vscode-editorWidget-background) !important;
	color: var(--vscode-editorWidget-foreground);
	box-shadow: 0 0 8px 2px var(--vscode-widget-shadow);
	border: 1px solid var(--vscode-widget-border);
	border-bottom-left-radius: 4px;
	border-bottom-right-radius: 4px;
	font-size: 12px;
}

.monaco-workbench.monaco-reduce-motion .monaco-editor .find-widget {
	transition: top 0ms linear;
}

.monaco-workbench .simple-find-part.visible {
	visibility: visible;
}

.monaco-workbench .simple-find-part.suppress-transition {
	transition: none;
}

.monaco-workbench .simple-find-part.visible-transition {
	top: 0;
}

.monaco-workbench .simple-find-part .monaco-findInput {
	flex: 1;
}

.monaco-workbench .simple-find-part .matchesCount {
	width: 73px;
	max-width: 73px;
	min-width: 73px;
	padding-left: 5px;
}

.monaco-workbench .simple-find-part.reduced-find-widget .matchesCount {
	display: none;
}

.monaco-workbench .simple-find-part .button {
	min-width: 20px;
	width: 20px;
	height: 20px;
	line-height: 20px;
	display: flex;
	flex: initial;
	justify-content: center;
	margin-left: 3px;
	background-position: center center;
	background-repeat: no-repeat;
	cursor: pointer;
}

.monaco-workbench div.simple-find-part div.button.disabled {
	opacity: 0.3 !important;
	cursor: default;
}

div.simple-find-part-wrapper div.button {
	border-radius: 5px;
}

.no-results.matchesCount {
	color: var(--vscode-errorForeground);
}

div.simple-find-part-wrapper div.button:hover:not(.disabled) {
	background-color: var(--vscode-toolbar-hoverBackground);
	outline: 1px dashed var(--vscode-toolbar-hoverOutline);
	outline-offset: -1px;
}

.monaco-workbench .simple-find-part .monaco-sash {
	left: 0 !important;
	border-left: 1px solid;
	border-bottom-left-radius: 4px;
}

.monaco-workbench .simple-find-part .monaco-sash.vertical:before {
	width: 2px;
	left: calc(50% - (var(--vscode-sash-hover-size) / 4));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/find/simpleFindWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/find/simpleFindWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './simpleFindWidget.css';
import * as nls from '../../../../../nls.js';
import * as dom from '../../../../../base/browser/dom.js';
import { FindInput } from '../../../../../base/browser/ui/findinput/findInput.js';
import { Widget } from '../../../../../base/browser/ui/widget.js';
import { Delayer } from '../../../../../base/common/async.js';
import { KeyCode } from '../../../../../base/common/keyCodes.js';
import { FindReplaceState, INewFindReplaceState } from '../../../../../editor/contrib/find/browser/findState.js';
import { IMessage as InputBoxMessage } from '../../../../../base/browser/ui/inputbox/inputBox.js';
import { SimpleButton, findPreviousMatchIcon, findNextMatchIcon, NLS_NO_RESULTS, NLS_MATCHES_LOCATION } from '../../../../../editor/contrib/find/browser/findWidget.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IContextViewService } from '../../../../../platform/contextview/browser/contextView.js';
import { ContextScopedFindInput } from '../../../../../platform/history/browser/contextScopedHistoryWidget.js';
import { widgetClose } from '../../../../../platform/theme/common/iconRegistry.js';
import { registerThemingParticipant } from '../../../../../platform/theme/common/themeService.js';
import * as strings from '../../../../../base/common/strings.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { showHistoryKeybindingHint } from '../../../../../platform/history/browser/historyWidgetKeybindingHint.js';
import { status } from '../../../../../base/browser/ui/aria/aria.js';
import { defaultInputBoxStyles, defaultToggleStyles } from '../../../../../platform/theme/browser/defaultStyles.js';
import { ISashEvent, IVerticalSashLayoutProvider, Orientation, Sash } from '../../../../../base/browser/ui/sash/sash.js';
import { registerColor } from '../../../../../platform/theme/common/colorRegistry.js';
import type { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import type { IHoverLifecycleOptions } from '../../../../../base/browser/ui/hover/hover.js';

const NLS_FIND_INPUT_LABEL = nls.localize('label.find', "Find");
const NLS_FIND_INPUT_PLACEHOLDER = nls.localize('placeholder.find', "Find");
const NLS_PREVIOUS_MATCH_BTN_LABEL = nls.localize('label.previousMatchButton', "Previous Match");
const NLS_NEXT_MATCH_BTN_LABEL = nls.localize('label.nextMatchButton', "Next Match");
const NLS_CLOSE_BTN_LABEL = nls.localize('label.closeButton', "Close");

interface IFindOptions {
	showCommonFindToggles?: boolean;
	checkImeCompletionState?: boolean;
	showResultCount?: boolean;
	appendCaseSensitiveActionId?: string;
	appendRegexActionId?: string;
	appendWholeWordsActionId?: string;
	previousMatchActionId?: string;
	nextMatchActionId?: string;
	closeWidgetActionId?: string;
	matchesLimit?: number;
	type?: 'Terminal' | 'Webview';
	initialWidth?: number;
	enableSash?: boolean;
}

const SIMPLE_FIND_WIDGET_INITIAL_WIDTH = 310;
const MATCHES_COUNT_WIDTH = 73;

export abstract class SimpleFindWidget extends Widget implements IVerticalSashLayoutProvider {
	private readonly _findInput: FindInput;
	private readonly _domNode: HTMLElement;
	private readonly _innerDomNode: HTMLElement;
	private readonly _focusTracker: dom.IFocusTracker;
	private readonly _findInputFocusTracker: dom.IFocusTracker;
	private readonly _updateHistoryDelayer: Delayer<void>;
	private readonly prevBtn: SimpleButton;
	private readonly nextBtn: SimpleButton;
	private readonly _matchesLimit: number;
	private _matchesCount: HTMLElement | undefined;

	private _isVisible: boolean = false;
	private _foundMatch: boolean = false;
	private _width: number = 0;

	readonly state: FindReplaceState;

	constructor(
		options: IFindOptions,
		contextViewService: IContextViewService,
		contextKeyService: IContextKeyService,
		hoverService: IHoverService,
		private readonly _keybindingService: IKeybindingService,
	) {
		super();

		this.state = this._register(new FindReplaceState());
		this._matchesLimit = options.matchesLimit ?? Number.MAX_SAFE_INTEGER;

		this._findInput = this._register(new ContextScopedFindInput(null, contextViewService, {
			label: NLS_FIND_INPUT_LABEL,
			placeholder: NLS_FIND_INPUT_PLACEHOLDER,
			validation: (value: string): InputBoxMessage | null => {
				if (value.length === 0 || !this._findInput.getRegex()) {
					return null;
				}
				try {
					new RegExp(value);
					return null;
				} catch (e) {
					this._foundMatch = false;
					this.updateButtons(this._foundMatch);
					return { content: e.message };
				}
			},
			showCommonFindToggles: options.showCommonFindToggles,
			appendCaseSensitiveLabel: options.appendCaseSensitiveActionId ? this._getKeybinding(options.appendCaseSensitiveActionId) : undefined,
			appendRegexLabel: options.appendRegexActionId ? this._getKeybinding(options.appendRegexActionId) : undefined,
			appendWholeWordsLabel: options.appendWholeWordsActionId ? this._getKeybinding(options.appendWholeWordsActionId) : undefined,
			showHistoryHint: () => showHistoryKeybindingHint(_keybindingService),
			inputBoxStyles: defaultInputBoxStyles,
			toggleStyles: defaultToggleStyles
		}, contextKeyService));
		// Find History with update delayer
		this._updateHistoryDelayer = this._register(new Delayer<void>(500));

		this._register(this._findInput.onInput(async (e) => {
			if (!options.checkImeCompletionState || !this._findInput.isImeSessionInProgress) {
				this._foundMatch = this._onInputChanged();
				if (options.showResultCount) {
					await this.updateResultCount();
				}
				this.updateButtons(this._foundMatch);
				this.focusFindBox();
				this._delayedUpdateHistory();
			}
		}));

		this._findInput.setRegex(!!this.state.isRegex);
		this._findInput.setCaseSensitive(!!this.state.matchCase);
		this._findInput.setWholeWords(!!this.state.wholeWord);

		this._register(this._findInput.onDidOptionChange(() => {
			this.state.change({
				isRegex: this._findInput.getRegex(),
				wholeWord: this._findInput.getWholeWords(),
				matchCase: this._findInput.getCaseSensitive()
			}, true);
		}));

		this._register(this.state.onFindReplaceStateChange(() => {
			this._findInput.setRegex(this.state.isRegex);
			this._findInput.setWholeWords(this.state.wholeWord);
			this._findInput.setCaseSensitive(this.state.matchCase);
			this.findFirst();
		}));

		const hoverLifecycleOptions: IHoverLifecycleOptions = { groupId: 'simple-find-widget' };

		this.prevBtn = this._register(new SimpleButton({
			label: NLS_PREVIOUS_MATCH_BTN_LABEL + (options.previousMatchActionId ? this._getKeybinding(options.previousMatchActionId) : ''),
			icon: findPreviousMatchIcon,
			hoverLifecycleOptions,
			onTrigger: () => {
				this.find(true);
			}
		}, hoverService));

		this.nextBtn = this._register(new SimpleButton({
			label: NLS_NEXT_MATCH_BTN_LABEL + (options.nextMatchActionId ? this._getKeybinding(options.nextMatchActionId) : ''),
			icon: findNextMatchIcon,
			hoverLifecycleOptions,
			onTrigger: () => {
				this.find(false);
			}
		}, hoverService));

		const closeBtn = this._register(new SimpleButton({
			label: NLS_CLOSE_BTN_LABEL + (options.closeWidgetActionId ? this._getKeybinding(options.closeWidgetActionId) : ''),
			icon: widgetClose,
			hoverLifecycleOptions,
			onTrigger: () => {
				this.hide();
			}
		}, hoverService));

		this._innerDomNode = document.createElement('div');
		this._innerDomNode.classList.add('simple-find-part');
		this._innerDomNode.appendChild(this._findInput.domNode);
		this._innerDomNode.appendChild(this.prevBtn.domNode);
		this._innerDomNode.appendChild(this.nextBtn.domNode);
		this._innerDomNode.appendChild(closeBtn.domNode);

		// _domNode wraps _innerDomNode, ensuring that
		this._domNode = document.createElement('div');
		this._domNode.classList.add('simple-find-part-wrapper');
		this._domNode.appendChild(this._innerDomNode);

		this.onkeyup(this._innerDomNode, e => {
			if (e.equals(KeyCode.Escape)) {
				this.hide();
				e.preventDefault();
				return;
			}
		});

		this._focusTracker = this._register(dom.trackFocus(this._innerDomNode));
		this._register(this._focusTracker.onDidFocus(this._onFocusTrackerFocus.bind(this)));
		this._register(this._focusTracker.onDidBlur(this._onFocusTrackerBlur.bind(this)));

		this._findInputFocusTracker = this._register(dom.trackFocus(this._findInput.domNode));
		this._register(this._findInputFocusTracker.onDidFocus(this._onFindInputFocusTrackerFocus.bind(this)));
		this._register(this._findInputFocusTracker.onDidBlur(this._onFindInputFocusTrackerBlur.bind(this)));

		this._register(dom.addDisposableListener(this._innerDomNode, 'click', (event) => {
			event.stopPropagation();
		}));

		if (options?.showResultCount) {
			this._domNode.classList.add('result-count');
			this._matchesCount = document.createElement('div');
			this._matchesCount.className = 'matchesCount';
			this._findInput.domNode.insertAdjacentElement('afterend', this._matchesCount);
			this._register(this._findInput.onDidChange(async () => {
				await this.updateResultCount();
			}));
			this._register(this._findInput.onDidOptionChange(async () => {
				this._foundMatch = this._onInputChanged();
				await this.updateResultCount();
				this.focusFindBox();
				this._delayedUpdateHistory();
			}));
		}

		let initialMinWidth = options?.initialWidth;
		if (initialMinWidth) {
			initialMinWidth = initialMinWidth < SIMPLE_FIND_WIDGET_INITIAL_WIDTH ? SIMPLE_FIND_WIDGET_INITIAL_WIDTH : initialMinWidth;
			this._domNode.style.width = `${initialMinWidth}px`;
		}

		if (options?.enableSash) {
			const _initialMinWidth = initialMinWidth ?? SIMPLE_FIND_WIDGET_INITIAL_WIDTH;
			let originalWidth = _initialMinWidth;

			// sash
			const resizeSash = this._register(new Sash(this._innerDomNode, this, { orientation: Orientation.VERTICAL, size: 1 }));
			this._register(resizeSash.onDidStart(() => {
				originalWidth = parseFloat(dom.getComputedStyle(this._domNode).width);
			}));

			this._register(resizeSash.onDidChange((e: ISashEvent) => {
				const width = originalWidth + e.startX - e.currentX;
				if (width < _initialMinWidth) {
					return;
				}
				this._domNode.style.width = `${width}px`;
			}));

			this._register(resizeSash.onDidReset(e => {
				const currentWidth = parseFloat(dom.getComputedStyle(this._domNode).width);
				if (currentWidth === _initialMinWidth) {
					this._domNode.style.width = '100%';
				} else {
					this._domNode.style.width = `${_initialMinWidth}px`;
				}
			}));
		}
	}

	public getVerticalSashLeft(_sash: Sash): number {
		return 0;
	}

	public abstract find(previous: boolean): void;
	public abstract findFirst(): void;
	protected abstract _onInputChanged(): boolean;
	protected abstract _onFocusTrackerFocus(): void;
	protected abstract _onFocusTrackerBlur(): void;
	protected abstract _onFindInputFocusTrackerFocus(): void;
	protected abstract _onFindInputFocusTrackerBlur(): void;
	protected abstract _getResultCount(): Promise<{ resultIndex: number; resultCount: number } | undefined>;

	protected get inputValue() {
		return this._findInput.getValue();
	}

	public get focusTracker(): dom.IFocusTracker {
		return this._focusTracker;
	}

	private _getKeybinding(actionId: string): string {
		const kb = this._keybindingService?.lookupKeybinding(actionId);
		if (!kb) {
			return '';
		}
		return ` (${kb.getLabel()})`;
	}

	override dispose() {
		super.dispose();

		this._domNode?.remove();
	}

	public isVisible(): boolean {
		return this._isVisible;
	}

	public getDomNode() {
		return this._domNode;
	}

	public getFindInputDomNode() {
		return this._findInput.domNode;
	}

	public reveal(initialInput?: string, animated = true): void {
		if (initialInput) {
			this._findInput.setValue(initialInput);
		}

		if (this._isVisible) {
			this._findInput.select();
			return;
		}

		this._isVisible = true;
		this.updateResultCount();
		this.layout();

		setTimeout(() => {
			this._innerDomNode.classList.toggle('suppress-transition', !animated);
			this._innerDomNode.classList.add('visible', 'visible-transition');
			this._innerDomNode.setAttribute('aria-hidden', 'false');
			this._findInput.select();

			if (!animated) {
				setTimeout(() => {
					this._innerDomNode.classList.remove('suppress-transition');
				}, 0);
			}
		}, 0);
	}

	public show(initialInput?: string): void {
		if (initialInput && !this._isVisible) {
			this._findInput.setValue(initialInput);
		}

		this._isVisible = true;
		this.layout();

		setTimeout(() => {
			this._innerDomNode.classList.add('visible', 'visible-transition');

			this._innerDomNode.setAttribute('aria-hidden', 'false');
		}, 0);
	}

	public hide(animated = true): void {
		if (this._isVisible) {
			this._innerDomNode.classList.toggle('suppress-transition', !animated);
			this._innerDomNode.classList.remove('visible-transition');
			this._innerDomNode.setAttribute('aria-hidden', 'true');
			// Need to delay toggling visibility until after Transition, then visibility hidden - removes from tabIndex list
			setTimeout(() => {
				this._isVisible = false;
				this.updateButtons(this._foundMatch);
				this._innerDomNode.classList.remove('visible', 'suppress-transition');
			}, animated ? 200 : 0);
		}
	}

	public layout(width: number = this._width): void {
		this._width = width;

		if (!this._isVisible) {
			return;
		}

		if (this._matchesCount) {
			let reducedFindWidget = false;
			if (SIMPLE_FIND_WIDGET_INITIAL_WIDTH + MATCHES_COUNT_WIDTH + 28 >= width) {
				reducedFindWidget = true;
			}
			this._innerDomNode.classList.toggle('reduced-find-widget', reducedFindWidget);
		}
	}

	protected _delayedUpdateHistory() {
		this._updateHistoryDelayer.trigger(this._updateHistory.bind(this));
	}

	protected _updateHistory() {
		this._findInput.inputBox.addToHistory();
	}

	protected _getRegexValue(): boolean {
		return this._findInput.getRegex();
	}

	protected _getWholeWordValue(): boolean {
		return this._findInput.getWholeWords();
	}

	protected _getCaseSensitiveValue(): boolean {
		return this._findInput.getCaseSensitive();
	}

	protected updateButtons(foundMatch: boolean) {
		const hasInput = this.inputValue.length > 0;
		this.prevBtn.setEnabled(this._isVisible && hasInput && foundMatch);
		this.nextBtn.setEnabled(this._isVisible && hasInput && foundMatch);
	}

	protected focusFindBox() {
		// Focus back onto the find box, which
		// requires focusing onto the next button first
		this.nextBtn.focus();
		this._findInput.inputBox.focus();
	}

	async updateResultCount(): Promise<void> {
		if (!this._matchesCount) {
			this.updateButtons(this._foundMatch);
			return;
		}

		const count = await this._getResultCount();
		this._matchesCount.textContent = '';
		const showRedOutline = (this.inputValue.length > 0 && count?.resultCount === 0);
		this._matchesCount.classList.toggle('no-results', showRedOutline);
		let label = '';
		if (count?.resultCount) {
			let matchesCount: string = String(count.resultCount);
			if (count.resultCount >= this._matchesLimit) {
				matchesCount += '+';
			}
			let matchesPosition: string = String(count.resultIndex + 1);
			if (matchesPosition === '0') {
				matchesPosition = '?';
			}
			label = strings.format(NLS_MATCHES_LOCATION, matchesPosition, matchesCount);
		} else {
			label = NLS_NO_RESULTS;
		}
		status(this._announceSearchResults(label, this.inputValue));
		this._matchesCount.appendChild(document.createTextNode(label));
		this._foundMatch = !!count && count.resultCount > 0;
		this.updateButtons(this._foundMatch);
	}

	changeState(state: INewFindReplaceState) {
		this.state.change(state, false);
	}

	private _announceSearchResults(label: string, searchString?: string): string {
		if (!searchString) {
			return nls.localize('ariaSearchNoInput', "Enter search input");
		}
		if (label === NLS_NO_RESULTS) {
			return searchString === ''
				? nls.localize('ariaSearchNoResultEmpty', "{0} found", label)
				: nls.localize('ariaSearchNoResult', "{0} found for '{1}'", label, searchString);
		}

		return nls.localize('ariaSearchNoResultWithLineNumNoCurrentMatch', "{0} found for '{1}'", label, searchString);
	}
}

export const simpleFindWidgetSashBorder = registerColor('simpleFindWidget.sashBorder', { dark: '#454545', light: '#C8C8C8', hcDark: '#6FC3DF', hcLight: '#0F4A85' }, nls.localize('simpleFindWidget.sashBorder', 'Border color of the sash border.'));

registerThemingParticipant((theme, collector) => {
	const resizeBorderBackground = theme.getColor(simpleFindWidgetSashBorder);
	collector.addRule(`.monaco-workbench .simple-find-part .monaco-sash { background-color: ${resizeBorderBackground}; border-color: ${resizeBorderBackground} }`);
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/inspectEditorTokens/inspectEditorTokens.css]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/inspectEditorTokens/inspectEditorTokens.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.token-inspect-widget {
	z-index: 50;
	user-select: text;
	-webkit-user-select: text;
	padding: 10px;
	border: 1px solid var(--vscode-editorHoverWidget-border);
}
.hc-black .tokens-inspect-widget, .hc-light .tokens-inspect-widget {
	border-width: 2px;
}

.monaco-editor .token-inspect-widget {
	background-color: var(--vscode-editorHoverWidget-background);
}

.monaco-editor .token-inspect-widget .tiw-metadata-separator {
	background-color: var(--vscode-editorHoverWidget-border)
}

.tiw-token {
	font-family: var(--monaco-monospace-font);
}

.tiw-metadata-separator {
	height: 1px;
	border: 0;
}

.tiw-token-length {
	font-weight: normal;
	font-size: 60%;
	float: right;
}

.tiw-metadata-table {
	width: 100%;
}

.tiw-metadata-value {
	font-family: var(--monaco-monospace-font);
	word-break: break-word;
}

.tiw-metadata-values {
	list-style: none;
	max-height: 300px;
	overflow-y: auto;
	margin-right: -10px;
	padding-left: 0;
}

.tiw-metadata-values > .tiw-metadata-value {
	margin-right: 10px;
}

.tiw-metadata-key {
	width: 1px;
	min-width: 150px;
	padding-right: 10px;
	white-space: nowrap;
	vertical-align: top;
}

.tiw-metadata-semantic {
	font-style: italic;
}

.tiw-metadata-scopes {
	line-height: normal;
}

.tiw-theme-selector {
	font-family: var(--monaco-monospace-font);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/inspectEditorTokens/inspectEditorTokens.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/inspectEditorTokens/inspectEditorTokens.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './inspectEditorTokens.css';
import * as nls from '../../../../../nls.js';
import * as dom from '../../../../../base/browser/dom.js';
import { CharCode } from '../../../../../base/common/charCode.js';
import { Color } from '../../../../../base/common/color.js';
import { KeyCode } from '../../../../../base/common/keyCodes.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ContentWidgetPositionPreference, IActiveCodeEditor, ICodeEditor, IContentWidget, IContentWidgetPosition } from '../../../../../editor/browser/editorBrowser.js';
import { EditorAction, ServicesAccessor, registerEditorAction, registerEditorContribution, EditorContributionInstantiation } from '../../../../../editor/browser/editorExtensions.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { IEditorContribution } from '../../../../../editor/common/editorCommon.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { SemanticTokensLegend, SemanticTokens } from '../../../../../editor/common/languages.js';
import { FontStyle, ColorId, StandardTokenType, TokenMetadata } from '../../../../../editor/common/encodedTokenAttributes.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { findMatchingThemeRule } from '../../../../services/textMate/common/TMHelper.js';
import { ITextMateTokenizationService } from '../../../../services/textMate/browser/textMateTokenizationFeature.js';
import type { IGrammar, IToken, StateStack } from 'vscode-textmate';
import { IWorkbenchThemeService } from '../../../../services/themes/common/workbenchThemeService.js';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { ColorThemeData, TokenStyleDefinitions, TokenStyleDefinition, TextMateThemingRuleDefinitions } from '../../../../services/themes/common/colorThemeData.js';
import { SemanticTokenRule, TokenStyleData, TokenStyle } from '../../../../../platform/theme/common/tokenClassificationRegistry.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { SEMANTIC_HIGHLIGHTING_SETTING_ID, IEditorSemanticHighlightingOptions } from '../../../../../editor/contrib/semanticTokens/common/semanticTokensConfig.js';
import { Schemas } from '../../../../../base/common/network.js';
import { ILanguageFeaturesService } from '../../../../../editor/common/services/languageFeatures.js';
import type * as TreeSitter from '@vscode/tree-sitter-wasm';
import { TreeSitterSyntaxTokenBackend } from '../../../../../editor/common/model/tokens/treeSitter/treeSitterSyntaxTokenBackend.js';
import { TokenizationTextModelPart } from '../../../../../editor/common/model/tokens/tokenizationTextModelPart.js';
import { TreeSitterTree } from '../../../../../editor/common/model/tokens/treeSitter/treeSitterTree.js';

const $ = dom.$;

export class InspectEditorTokensController extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.inspectEditorTokens';

	public static get(editor: ICodeEditor): InspectEditorTokensController | null {
		return editor.getContribution<InspectEditorTokensController>(InspectEditorTokensController.ID);
	}

	private _editor: ICodeEditor;
	private _textMateService: ITextMateTokenizationService;
	private _themeService: IWorkbenchThemeService;
	private _languageService: ILanguageService;
	private _notificationService: INotificationService;
	private _configurationService: IConfigurationService;
	private _languageFeaturesService: ILanguageFeaturesService;
	private _widget: InspectEditorTokensWidget | null;

	constructor(
		editor: ICodeEditor,
		@ITextMateTokenizationService textMateService: ITextMateTokenizationService,
		@ILanguageService languageService: ILanguageService,
		@IWorkbenchThemeService themeService: IWorkbenchThemeService,
		@INotificationService notificationService: INotificationService,
		@IConfigurationService configurationService: IConfigurationService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService
	) {
		super();
		this._editor = editor;
		this._textMateService = textMateService;
		this._themeService = themeService;
		this._languageService = languageService;
		this._notificationService = notificationService;
		this._configurationService = configurationService;
		this._languageFeaturesService = languageFeaturesService;
		this._widget = null;

		this._register(this._editor.onDidChangeModel((e) => this.stop()));
		this._register(this._editor.onDidChangeModelLanguage((e) => this.stop()));
		this._register(this._editor.onKeyUp((e) => e.keyCode === KeyCode.Escape && this.stop()));
	}

	public override dispose(): void {
		this.stop();
		super.dispose();
	}

	public launch(): void {
		if (this._widget) {
			return;
		}
		if (!this._editor.hasModel()) {
			return;
		}
		if (this._editor.getModel().uri.scheme === Schemas.vscodeNotebookCell) {
			// disable in notebooks
			return;
		}
		this._widget = new InspectEditorTokensWidget(this._editor, this._textMateService, this._languageService, this._themeService, this._notificationService, this._configurationService, this._languageFeaturesService);
	}

	public stop(): void {
		if (this._widget) {
			this._widget.dispose();
			this._widget = null;
		}
	}

	public toggle(): void {
		if (!this._widget) {
			this.launch();
		} else {
			this.stop();
		}
	}
}

class InspectEditorTokens extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.inspectTMScopes',
			label: nls.localize2('inspectEditorTokens', "Developer: Inspect Editor Tokens and Scopes"),
			precondition: undefined
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const controller = InspectEditorTokensController.get(editor);
		controller?.toggle();
	}
}

interface ITextMateTokenInfo {
	token: IToken;
	metadata: IDecodedMetadata;
}

interface ISemanticTokenInfo {
	type: string;
	modifiers: string[];
	range: Range;
	metadata?: IDecodedMetadata;
	definitions: TokenStyleDefinitions;
}

interface IDecodedMetadata {
	languageId: string | undefined;
	tokenType: StandardTokenType;
	bold: boolean | undefined;
	italic: boolean | undefined;
	underline: boolean | undefined;
	strikethrough: boolean | undefined;
	foreground: string | undefined;
	background: string | undefined;
}

function renderTokenText(tokenText: string): string {
	if (tokenText.length > 40) {
		tokenText = tokenText.substr(0, 20) + '…' + tokenText.substr(tokenText.length - 20);
	}
	let result: string = '';
	for (let charIndex = 0, len = tokenText.length; charIndex < len; charIndex++) {
		const charCode = tokenText.charCodeAt(charIndex);
		switch (charCode) {
			case CharCode.Tab:
				result += '\u2192'; // &rarr;
				break;

			case CharCode.Space:
				result += '\u00B7'; // &middot;
				break;

			default:
				result += String.fromCharCode(charCode);
		}
	}
	return result;
}

type SemanticTokensResult = { tokens: SemanticTokens; legend: SemanticTokensLegend };

class InspectEditorTokensWidget extends Disposable implements IContentWidget {

	private static readonly _ID = 'editor.contrib.inspectEditorTokensWidget';

	// Editor.IContentWidget.allowEditorOverflow
	public readonly allowEditorOverflow = true;

	private _isDisposed: boolean;
	private readonly _editor: IActiveCodeEditor;
	private readonly _languageService: ILanguageService;
	private readonly _themeService: IWorkbenchThemeService;
	private readonly _textMateService: ITextMateTokenizationService;
	private readonly _notificationService: INotificationService;
	private readonly _configurationService: IConfigurationService;
	private readonly _languageFeaturesService: ILanguageFeaturesService;
	private readonly _model: ITextModel;
	private readonly _domNode: HTMLElement;
	private readonly _currentRequestCancellationTokenSource: CancellationTokenSource;

	constructor(
		editor: IActiveCodeEditor,
		textMateService: ITextMateTokenizationService,
		languageService: ILanguageService,
		themeService: IWorkbenchThemeService,
		notificationService: INotificationService,
		configurationService: IConfigurationService,
		languageFeaturesService: ILanguageFeaturesService
	) {
		super();
		this._isDisposed = false;
		this._editor = editor;
		this._languageService = languageService;
		this._themeService = themeService;
		this._textMateService = textMateService;
		this._notificationService = notificationService;
		this._configurationService = configurationService;
		this._languageFeaturesService = languageFeaturesService;
		this._model = this._editor.getModel();
		this._domNode = document.createElement('div');
		this._domNode.className = 'token-inspect-widget';
		this._currentRequestCancellationTokenSource = new CancellationTokenSource();
		this._beginCompute(this._editor.getPosition());
		this._register(this._editor.onDidChangeCursorPosition((e) => this._beginCompute(this._editor.getPosition())));
		this._register(themeService.onDidColorThemeChange(_ => this._beginCompute(this._editor.getPosition())));
		this._register(configurationService.onDidChangeConfiguration(e => e.affectsConfiguration('editor.semanticHighlighting.enabled') && this._beginCompute(this._editor.getPosition())));
		this._editor.addContentWidget(this);
	}

	public override dispose(): void {
		this._isDisposed = true;
		this._editor.removeContentWidget(this);
		this._currentRequestCancellationTokenSource.cancel();
		super.dispose();
	}

	public getId(): string {
		return InspectEditorTokensWidget._ID;
	}

	private _beginCompute(position: Position): void {
		const grammar = this._textMateService.createTokenizer(this._model.getLanguageId());
		const semanticTokens = this._computeSemanticTokens(position);
		const backend = (this._model.tokenization as TokenizationTextModelPart).tokens.get();
		const asTreeSitterBackend = backend instanceof TreeSitterSyntaxTokenBackend ? backend : undefined;

		dom.clearNode(this._domNode);
		this._domNode.appendChild(document.createTextNode(nls.localize('inspectTMScopesWidget.loading', "Loading...")));

		Promise.all([grammar, semanticTokens]).then(([grammar, semanticTokens]) => {
			if (this._isDisposed) {
				return;
			}
			const treeSitterTree = asTreeSitterBackend?.tree.get();
			this._compute(grammar, semanticTokens, treeSitterTree, position);
			this._domNode.style.maxWidth = `${Math.max(this._editor.getLayoutInfo().width * 0.66, 500)}px`;
			this._editor.layoutContentWidget(this);
		}, (err) => {
			this._notificationService.warn(err);

			setTimeout(() => {
				InspectEditorTokensController.get(this._editor)?.stop();
			});
		});

	}

	private _isSemanticColoringEnabled() {
		const setting = this._configurationService.getValue<IEditorSemanticHighlightingOptions>(SEMANTIC_HIGHLIGHTING_SETTING_ID, { overrideIdentifier: this._model.getLanguageId(), resource: this._model.uri })?.enabled;
		if (typeof setting === 'boolean') {
			return setting;
		}
		return this._themeService.getColorTheme().semanticHighlighting;
	}

	private _compute(grammar: IGrammar | null, semanticTokens: SemanticTokensResult | null, tree: TreeSitterTree | undefined, position: Position) {
		const textMateTokenInfo = grammar && this._getTokensAtPosition(grammar, position);
		const semanticTokenInfo = semanticTokens && this._getSemanticTokenAtPosition(semanticTokens, position);
		const treeSitterTokenInfo = tree && this._getTreeSitterTokenAtPosition(tree, position);
		if (!textMateTokenInfo && !semanticTokenInfo && !treeSitterTokenInfo) {
			dom.reset(this._domNode, 'No grammar or semantic tokens available.');
			return;
		}

		const tmMetadata = textMateTokenInfo?.metadata;
		const semMetadata = semanticTokenInfo?.metadata;

		const semTokenText = semanticTokenInfo && renderTokenText(this._model.getValueInRange(semanticTokenInfo.range));
		const tmTokenText = textMateTokenInfo && renderTokenText(this._model.getLineContent(position.lineNumber).substring(textMateTokenInfo.token.startIndex, textMateTokenInfo.token.endIndex));
		const semTokenLength = semanticTokenInfo && this._model.getValueLengthInRange(semanticTokenInfo.range);
		const tmTokenLength = textMateTokenInfo && (textMateTokenInfo.token.endIndex - textMateTokenInfo.token.startIndex);

		const tokenText = semTokenText || tmTokenText || '';
		const tokenLength = semTokenLength || tmTokenLength || 0;

		dom.reset(this._domNode,
			$('h2.tiw-token', undefined,
				tokenText,
				$('span.tiw-token-length', undefined, `${tokenLength} ${tokenLength === 1 ? 'char' : 'chars'}`)));
		dom.append(this._domNode, $('hr.tiw-metadata-separator', { 'style': 'clear:both' }));
		dom.append(this._domNode, $('table.tiw-metadata-table', undefined,
			$('tbody', undefined,
				$('tr', undefined,
					$('td.tiw-metadata-key', undefined, 'language'),
					$('td.tiw-metadata-value', undefined, tmMetadata?.languageId || '')
				),
				$('tr', undefined,
					$('td.tiw-metadata-key', undefined, 'standard token type' as string),
					$('td.tiw-metadata-value', undefined, this._tokenTypeToString(tmMetadata?.tokenType || StandardTokenType.Other))
				),
				...this._formatMetadata(semMetadata, tmMetadata)
			)
		));

		if (semanticTokenInfo) {
			dom.append(this._domNode, $('hr.tiw-metadata-separator'));
			const table = dom.append(this._domNode, $('table.tiw-metadata-table', undefined));
			const tbody = dom.append(table, $('tbody', undefined,
				$('tr', undefined,
					$('td.tiw-metadata-key', undefined, 'semantic token type' as string),
					$('td.tiw-metadata-value', undefined, semanticTokenInfo.type)
				)
			));
			if (semanticTokenInfo.modifiers.length) {
				dom.append(tbody, $('tr', undefined,
					$('td.tiw-metadata-key', undefined, 'modifiers'),
					$('td.tiw-metadata-value', undefined, semanticTokenInfo.modifiers.join(' ')),
				));
			}
			if (semanticTokenInfo.metadata) {
				const properties: (keyof TokenStyleData)[] = ['foreground', 'bold', 'italic', 'underline', 'strikethrough'];
				const propertiesByDefValue: { [rule: string]: string[] } = {};
				const allDefValues = new Array<[Array<HTMLElement | string>, string]>(); // remember the order
				// first collect to detect when the same rule is used for multiple properties
				for (const property of properties) {
					if (semanticTokenInfo.metadata[property] !== undefined) {
						const definition = semanticTokenInfo.definitions[property];
						const defValue = this._renderTokenStyleDefinition(definition, property);
						const defValueStr = defValue.map(el => dom.isHTMLElement(el) ? el.outerHTML : el).join();
						let properties = propertiesByDefValue[defValueStr];
						if (!properties) {
							propertiesByDefValue[defValueStr] = properties = [];
							allDefValues.push([defValue, defValueStr]);
						}
						properties.push(property);
					}
				}
				for (const [defValue, defValueStr] of allDefValues) {
					dom.append(tbody, $('tr', undefined,
						$('td.tiw-metadata-key', undefined, propertiesByDefValue[defValueStr].join(', ')),
						$('td.tiw-metadata-value', undefined, ...defValue)
					));
				}
			}
		}

		if (textMateTokenInfo) {
			const theme = this._themeService.getColorTheme();
			dom.append(this._domNode, $('hr.tiw-metadata-separator'));
			const table = dom.append(this._domNode, $('table.tiw-metadata-table'));
			const tbody = dom.append(table, $('tbody'));

			if (tmTokenText && tmTokenText !== tokenText) {
				dom.append(tbody, $('tr', undefined,
					$('td.tiw-metadata-key', undefined, 'textmate token' as string),
					$('td.tiw-metadata-value', undefined, `${tmTokenText} (${tmTokenText.length})`)
				));
			}
			const scopes = new Array<HTMLElement | string>();
			for (let i = textMateTokenInfo.token.scopes.length - 1; i >= 0; i--) {
				scopes.push(textMateTokenInfo.token.scopes[i]);
				if (i > 0) {
					scopes.push($('br'));
				}
			}
			dom.append(tbody, $('tr', undefined,
				$('td.tiw-metadata-key', undefined, 'textmate scopes' as string),
				$('td.tiw-metadata-value.tiw-metadata-scopes', undefined, ...scopes),
			));

			const matchingRule = findMatchingThemeRule(theme, textMateTokenInfo.token.scopes, false);
			const semForeground = semanticTokenInfo?.metadata?.foreground;
			if (matchingRule) {
				if (semForeground !== textMateTokenInfo.metadata.foreground) {
					let defValue = $('code.tiw-theme-selector', undefined,
						matchingRule.rawSelector, $('br'), JSON.stringify(matchingRule.settings, null, '\t'));
					if (semForeground) {
						defValue = $('s', undefined, defValue);
					}
					dom.append(tbody, $('tr', undefined,
						$('td.tiw-metadata-key', undefined, 'foreground'),
						$('td.tiw-metadata-value', undefined, defValue),
					));
				}
			} else if (!semForeground) {
				dom.append(tbody, $('tr', undefined,
					$('td.tiw-metadata-key', undefined, 'foreground'),
					$('td.tiw-metadata-value', undefined, 'No theme selector' as string),
				));
			}
		}

		if (treeSitterTokenInfo) {
			const lastTokenInfo = treeSitterTokenInfo[treeSitterTokenInfo.length - 1];
			dom.append(this._domNode, $('hr.tiw-metadata-separator'));
			const table = dom.append(this._domNode, $('table.tiw-metadata-table'));
			const tbody = dom.append(table, $('tbody'));

			dom.append(tbody, $('tr', undefined,
				$('td.tiw-metadata-key', undefined, `tree-sitter token ${lastTokenInfo.id}` as string),
				$('td.tiw-metadata-value', undefined, `${lastTokenInfo.text}`)
			));
			const scopes = new Array<HTMLElement | string>();
			let i = treeSitterTokenInfo.length - 1;
			let node = treeSitterTokenInfo[i];
			while (node.parent || i > 0) {
				scopes.push(node.type);
				node = node.parent ?? treeSitterTokenInfo[--i];
				if (node) {
					scopes.push($('br'));
				}
			}

			dom.append(tbody, $('tr', undefined,
				$('td.tiw-metadata-key', undefined, 'tree-sitter tree' as string),
				$('td.tiw-metadata-value.tiw-metadata-scopes', undefined, ...scopes),
			));

			const tokenizationSupport = ((this._model.tokenization as TokenizationTextModelPart).tokens.get() as TreeSitterSyntaxTokenBackend).tokenizationImpl.get();
			const captures = tokenizationSupport?.captureAtPosition(position.lineNumber, position.column);
			if (captures && captures.length > 0) {
				dom.append(tbody, $('tr', undefined,
					$('td.tiw-metadata-key', undefined, 'foreground'),
					$('td.tiw-metadata-value', undefined, captures.map(cap => cap.name).join(' ')),
				));
			}
		}
	}

	private _formatMetadata(semantic?: IDecodedMetadata, tm?: IDecodedMetadata): Array<HTMLElement | string> {
		const elements = new Array<HTMLElement | string>();

		function render(property: 'foreground' | 'background') {
			const value = semantic?.[property] || tm?.[property];
			if (value !== undefined) {
				const semanticStyle = semantic?.[property] ? 'tiw-metadata-semantic' : '';
				elements.push($('tr', undefined,
					$('td.tiw-metadata-key', undefined, property),
					$(`td.tiw-metadata-value.${semanticStyle}`, undefined, value)
				));
			}
			return value;
		}

		const foreground = render('foreground');
		const background = render('background');
		if (foreground && background) {
			const backgroundColor = Color.fromHex(background), foregroundColor = Color.fromHex(foreground);
			if (backgroundColor.isOpaque()) {
				elements.push($('tr', undefined,
					$('td.tiw-metadata-key', undefined, 'contrast ratio' as string),
					$('td.tiw-metadata-value', undefined, backgroundColor.getContrastRatio(foregroundColor.makeOpaque(backgroundColor)).toFixed(2))
				));
			} else {
				elements.push($('tr', undefined,
					$('td.tiw-metadata-key', undefined, 'Contrast ratio cannot be precise for background colors that use transparency' as string),
					$('td.tiw-metadata-value')
				));
			}
		}

		const fontStyleLabels = new Array<HTMLElement | string>();

		function addStyle(key: 'bold' | 'italic' | 'underline' | 'strikethrough') {
			let label: HTMLElement | string | undefined;
			if (semantic && semantic[key]) {
				label = $('span.tiw-metadata-semantic', undefined, key);
			} else if (tm && tm[key]) {
				label = key;
			}
			if (label) {
				if (fontStyleLabels.length) {
					fontStyleLabels.push(' ');
				}
				fontStyleLabels.push(label);
			}
		}
		addStyle('bold');
		addStyle('italic');
		addStyle('underline');
		addStyle('strikethrough');
		if (fontStyleLabels.length) {
			elements.push($('tr', undefined,
				$('td.tiw-metadata-key', undefined, 'font style' as string),
				$('td.tiw-metadata-value', undefined, ...fontStyleLabels)
			));
		}
		return elements;
	}

	private _decodeMetadata(metadata: number): IDecodedMetadata {
		const colorMap = this._themeService.getColorTheme().tokenColorMap;
		const languageId = TokenMetadata.getLanguageId(metadata);
		const tokenType = TokenMetadata.getTokenType(metadata);
		const fontStyle = TokenMetadata.getFontStyle(metadata);
		const foreground = TokenMetadata.getForeground(metadata);
		const background = TokenMetadata.getBackground(metadata);
		return {
			languageId: this._languageService.languageIdCodec.decodeLanguageId(languageId),
			tokenType: tokenType,
			bold: (fontStyle & FontStyle.Bold) ? true : undefined,
			italic: (fontStyle & FontStyle.Italic) ? true : undefined,
			underline: (fontStyle & FontStyle.Underline) ? true : undefined,
			strikethrough: (fontStyle & FontStyle.Strikethrough) ? true : undefined,
			foreground: colorMap[foreground],
			background: colorMap[background]
		};
	}

	private _tokenTypeToString(tokenType: StandardTokenType): string {
		switch (tokenType) {
			case StandardTokenType.Other: return 'Other';
			case StandardTokenType.Comment: return 'Comment';
			case StandardTokenType.String: return 'String';
			case StandardTokenType.RegEx: return 'RegEx';
			default: return '??';
		}
	}

	private _getTokensAtPosition(grammar: IGrammar, position: Position): ITextMateTokenInfo {
		const lineNumber = position.lineNumber;
		const stateBeforeLine = this._getStateBeforeLine(grammar, lineNumber);

		const tokenizationResult1 = grammar.tokenizeLine(this._model.getLineContent(lineNumber), stateBeforeLine);
		const tokenizationResult2 = grammar.tokenizeLine2(this._model.getLineContent(lineNumber), stateBeforeLine);

		let token1Index = 0;
		for (let i = tokenizationResult1.tokens.length - 1; i >= 0; i--) {
			const t = tokenizationResult1.tokens[i];
			if (position.column - 1 >= t.startIndex) {
				token1Index = i;
				break;
			}
		}

		let token2Index = 0;
		for (let i = (tokenizationResult2.tokens.length >>> 1); i >= 0; i--) {
			if (position.column - 1 >= tokenizationResult2.tokens[(i << 1)]) {
				token2Index = i;
				break;
			}
		}

		return {
			token: tokenizationResult1.tokens[token1Index],
			metadata: this._decodeMetadata(tokenizationResult2.tokens[(token2Index << 1) + 1])
		};
	}

	private _getStateBeforeLine(grammar: IGrammar, lineNumber: number): StateStack | null {
		let state: StateStack | null = null;

		for (let i = 1; i < lineNumber; i++) {
			const tokenizationResult = grammar.tokenizeLine(this._model.getLineContent(i), state);
			state = tokenizationResult.ruleStack;
		}

		return state;
	}

	private isSemanticTokens(token: any): token is SemanticTokens {
		return token && token.data;
	}

	private async _computeSemanticTokens(position: Position): Promise<SemanticTokensResult | null> {
		if (!this._isSemanticColoringEnabled()) {
			return null;
		}

		const tokenProviders = this._languageFeaturesService.documentSemanticTokensProvider.ordered(this._model);
		if (tokenProviders.length) {
			const provider = tokenProviders[0];
			const tokens = await Promise.resolve(provider.provideDocumentSemanticTokens(this._model, null, this._currentRequestCancellationTokenSource.token));
			if (this.isSemanticTokens(tokens)) {
				return { tokens, legend: provider.getLegend() };
			}
		}
		const rangeTokenProviders = this._languageFeaturesService.documentRangeSemanticTokensProvider.ordered(this._model);
		if (rangeTokenProviders.length) {
			const provider = rangeTokenProviders[0];
			const lineNumber = position.lineNumber;
			const range = new Range(lineNumber, 1, lineNumber, this._model.getLineMaxColumn(lineNumber));
			const tokens = await Promise.resolve(provider.provideDocumentRangeSemanticTokens(this._model, range, this._currentRequestCancellationTokenSource.token));
			if (this.isSemanticTokens(tokens)) {
				return { tokens, legend: provider.getLegend() };
			}
		}
		return null;
	}

	private _getSemanticTokenAtPosition(semanticTokens: SemanticTokensResult, pos: Position): ISemanticTokenInfo | null {
		const tokenData = semanticTokens.tokens.data;
		const defaultLanguage = this._model.getLanguageId();
		let lastLine = 0;
		let lastCharacter = 0;
		const posLine = pos.lineNumber - 1, posCharacter = pos.column - 1; // to 0-based position
		for (let i = 0; i < tokenData.length; i += 5) {
			const lineDelta = tokenData[i], charDelta = tokenData[i + 1], len = tokenData[i + 2], typeIdx = tokenData[i + 3], modSet = tokenData[i + 4];
			const line = lastLine + lineDelta; // 0-based
			const character = lineDelta === 0 ? lastCharacter + charDelta : charDelta; // 0-based
			if (posLine === line && character <= posCharacter && posCharacter < character + len) {
				const type = semanticTokens.legend.tokenTypes[typeIdx] || 'not in legend (ignored)';
				const modifiers = [];
				let modifierSet = modSet;
				for (let modifierIndex = 0; modifierSet > 0 && modifierIndex < semanticTokens.legend.tokenModifiers.length; modifierIndex++) {
					if (modifierSet & 1) {
						modifiers.push(semanticTokens.legend.tokenModifiers[modifierIndex]);
					}
					modifierSet = modifierSet >> 1;
				}
				if (modifierSet > 0) {
					modifiers.push('not in legend (ignored)');
				}
				const range = new Range(line + 1, character + 1, line + 1, character + 1 + len);
				const definitions = {};
				const colorMap = this._themeService.getColorTheme().tokenColorMap;
				const theme = this._themeService.getColorTheme() as ColorThemeData;
				const tokenStyle = theme.getTokenStyleMetadata(type, modifiers, defaultLanguage, true, definitions);

				let metadata: IDecodedMetadata | undefined = undefined;
				if (tokenStyle) {
					metadata = {
						languageId: undefined,
						tokenType: StandardTokenType.Other,
						bold: tokenStyle?.bold,
						italic: tokenStyle?.italic,
						underline: tokenStyle?.underline,
						strikethrough: tokenStyle?.strikethrough,
						foreground: colorMap[tokenStyle?.foreground || ColorId.None],
						background: undefined
					};
				}

				return { type, modifiers, range, metadata, definitions };
			}
			lastLine = line;
			lastCharacter = character;
		}
		return null;
	}

	private _walkTreeforPosition(cursor: TreeSitter.TreeCursor, pos: Position): TreeSitter.Node | null {
		const offset = this._model.getOffsetAt(pos);
		cursor.gotoFirstChild();
		let goChild: boolean = false;
		let lastGoodNode: TreeSitter.Node | null = null;
		do {
			if (cursor.currentNode.startIndex <= offset && offset < cursor.currentNode.endIndex) {
				goChild = true;
				lastGoodNode = cursor.currentNode;
			} else {
				goChild = false;
			}
		} while (goChild ? cursor.gotoFirstChild() : cursor.gotoNextSibling());
		return lastGoodNode;
	}

	private _getTreeSitterTokenAtPosition(treeSitterTree: TreeSitterTree | undefined, pos: Position): TreeSitter.Node[] | null {
		const nodes: TreeSitter.Node[] = [];

		let tree = treeSitterTree?.tree.get();
		while (tree) {
			const cursor = tree.walk();
			const node = this._walkTreeforPosition(cursor, pos);
			cursor.delete();
			if (node) {
				nodes.push(node);
				treeSitterTree = treeSitterTree?.getInjectionTrees(node.startIndex, treeSitterTree.languageId);
				tree = treeSitterTree?.tree.get();
			} else {
				tree = undefined;
			}
		}
		return nodes.length > 0 ? nodes : null;
	}

	private _renderTokenStyleDefinition(definition: TokenStyleDefinition | undefined, property: keyof TokenStyleData): Array<HTMLElement | string> {
		const elements = new Array<HTMLElement | string>();
		if (definition === undefined) {
			return elements;
		}
		const theme = this._themeService.getColorTheme() as ColorThemeData;

		if (Array.isArray(definition)) {
			const scopesDefinition: TextMateThemingRuleDefinitions = {};
			theme.resolveScopes(definition, scopesDefinition);
			const matchingRule = scopesDefinition[property];
			if (matchingRule && scopesDefinition.scope) {
				const scopes = $('ul.tiw-metadata-values');
				const strScopes = Array.isArray(matchingRule.scope) ? matchingRule.scope : [String(matchingRule.scope)];

				for (const strScope of strScopes) {
					scopes.appendChild($('li.tiw-metadata-value.tiw-metadata-scopes', undefined, strScope));
				}

				elements.push(
					scopesDefinition.scope.join(' '),
					scopes,
					$('code.tiw-theme-selector', undefined, JSON.stringify(matchingRule.settings, null, '\t')));
				return elements;
			}
			return elements;
		} else if (SemanticTokenRule.is(definition)) {
			const scope = theme.getTokenStylingRuleScope(definition);
			if (scope === 'setting') {
				elements.push(`User settings: ${definition.selector.id} - ${this._renderStyleProperty(definition.style, property)}`);
				return elements;
			} else if (scope === 'theme') {
				elements.push(`Color theme: ${definition.selector.id} - ${this._renderStyleProperty(definition.style, property)}`);
				return elements;
			}
			return elements;
		} else {
			const style = theme.resolveTokenStyleValue(definition);
			elements.push(`Default: ${style ? this._renderStyleProperty(style, property) : ''}`);
			return elements;
		}
	}

	private _renderStyleProperty(style: TokenStyle, property: keyof TokenStyleData) {
		switch (property) {
			case 'foreground': return style.foreground ? Color.Format.CSS.formatHexA(style.foreground, true) : '';
			default: return style[property] !== undefined ? String(style[property]) : '';
		}
	}

	public getDomNode(): HTMLElement {
		return this._domNode;
	}

	public getPosition(): IContentWidgetPosition {
		return {
			position: this._editor.getPosition(),
			preference: [ContentWidgetPositionPreference.BELOW, ContentWidgetPositionPreference.ABOVE]
		};
	}
}

registerEditorContribution(InspectEditorTokensController.ID, InspectEditorTokensController, EditorContributionInstantiation.Lazy);
registerEditorAction(InspectEditorTokens);
```

--------------------------------------------------------------------------------

````
