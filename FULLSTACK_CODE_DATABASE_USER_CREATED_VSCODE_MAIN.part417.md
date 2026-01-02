---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 417
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 417 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/notebookVariables/notebookVariablesTree.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/notebookVariables/notebookVariablesTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../../base/browser/dom.js';
import { IListVirtualDelegate } from '../../../../../../base/browser/ui/list/list.js';
import { IListAccessibilityProvider } from '../../../../../../base/browser/ui/list/listWidget.js';
import { ITreeNode, ITreeRenderer } from '../../../../../../base/browser/ui/tree/tree.js';
import { FuzzyScore } from '../../../../../../base/common/filters.js';
import { DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { observableValue } from '../../../../../../base/common/observable.js';
import { ILocalizedString, localize, localize2 } from '../../../../../../nls.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { WorkbenchObjectTree } from '../../../../../../platform/list/browser/listService.js';
import { DebugExpressionRenderer } from '../../../../debug/browser/debugExpressionRenderer.js';
import { INotebookVariableElement } from './notebookVariablesDataSource.js';

const $ = dom.$;
const MAX_VALUE_RENDER_LENGTH_IN_VIEWLET = 1024;

export const NOTEBOOK_TITLE: ILocalizedString = localize2('notebook.notebookVariables', "Notebook Variables");
export const REPL_TITLE: ILocalizedString = localize2('notebook.ReplVariables', "REPL Variables");

export class NotebookVariablesTree extends WorkbenchObjectTree<INotebookVariableElement> { }

export class NotebookVariablesDelegate implements IListVirtualDelegate<INotebookVariableElement> {

	getHeight(element: INotebookVariableElement): number {
		return 22;
	}

	getTemplateId(element: INotebookVariableElement): string {
		return NotebookVariableRenderer.ID;
	}
}


export interface IVariableTemplateData {
	expression: HTMLElement;
	name: HTMLSpanElement;
	value: HTMLSpanElement;
	elementDisposables: DisposableStore;
}

export class NotebookVariableRenderer implements ITreeRenderer<INotebookVariableElement, FuzzyScore, IVariableTemplateData> {

	private expressionRenderer: DebugExpressionRenderer;

	static readonly ID = 'variableElement';

	get templateId(): string {
		return NotebookVariableRenderer.ID;
	}

	constructor(@IInstantiationService instantiationService: IInstantiationService) {
		this.expressionRenderer = instantiationService.createInstance(DebugExpressionRenderer);
	}

	renderTemplate(container: HTMLElement): IVariableTemplateData {
		const expression = dom.append(container, $('.expression'));
		const name = dom.append(expression, $('span.name'));
		const value = dom.append(expression, $('span.value'));

		const template: IVariableTemplateData = { expression, name, value, elementDisposables: new DisposableStore() };

		return template;
	}

	renderElement(element: ITreeNode<INotebookVariableElement, FuzzyScore>, _index: number, data: IVariableTemplateData): void {
		const text = element.element.value.trim() !== '' ? `${element.element.name}:` : element.element.name;
		data.name.textContent = text;
		data.name.title = element.element.type ?? '';

		data.elementDisposables.add(this.expressionRenderer.renderValue(data.value, element.element, {
			colorize: true,
			maxValueLength: MAX_VALUE_RENDER_LENGTH_IN_VIEWLET,
			session: undefined,
		}));
	}

	disposeElement(element: ITreeNode<INotebookVariableElement, FuzzyScore>, index: number, templateData: IVariableTemplateData): void {
		templateData.elementDisposables.clear();
	}


	disposeTemplate(templateData: IVariableTemplateData): void {
		templateData.elementDisposables.dispose();
	}
}

export class NotebookVariableAccessibilityProvider implements IListAccessibilityProvider<INotebookVariableElement> {

	private _widgetAriaLabel = observableValue('widgetAriaLabel', NOTEBOOK_TITLE.value);

	getWidgetAriaLabel() {
		return this._widgetAriaLabel;
	}

	updateWidgetAriaLabel(label: string): void {
		this._widgetAriaLabel.set(label, undefined);
	}

	getAriaLabel(element: INotebookVariableElement): string {
		return localize('notebookVariableAriaLabel', "Variable {0}, value {1}", element.name, element.value);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/notebookVariables/notebookVariablesView.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/notebookVariables/notebookVariablesView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITreeContextMenuEvent } from '../../../../../../base/browser/ui/tree/tree.js';
import { RunOnceScheduler } from '../../../../../../base/common/async.js';
import { URI } from '../../../../../../base/common/uri.js';
import { getFlatContextMenuActions } from '../../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenuService, MenuId } from '../../../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../../../platform/contextview/browser/contextView.js';
import { IHoverService } from '../../../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../../platform/keybinding/common/keybinding.js';
import { WorkbenchAsyncDataTree } from '../../../../../../platform/list/browser/listService.js';
import { IOpenerService } from '../../../../../../platform/opener/common/opener.js';
import { IQuickInputService } from '../../../../../../platform/quickinput/common/quickInput.js';
import { IThemeService } from '../../../../../../platform/theme/common/themeService.js';
import { IViewPaneOptions, ViewPane } from '../../../../../browser/parts/views/viewPane.js';
import { IViewDescriptorService } from '../../../../../common/views.js';
import { CONTEXT_VARIABLE_EXTENSIONID, CONTEXT_VARIABLE_INTERFACES, CONTEXT_VARIABLE_LANGUAGE, CONTEXT_VARIABLE_NAME, CONTEXT_VARIABLE_TYPE, CONTEXT_VARIABLE_VALUE } from '../../../../debug/common/debug.js';
import { IEmptyScope, INotebookScope, INotebookVariableElement, NotebookVariableDataSource } from './notebookVariablesDataSource.js';
import { NOTEBOOK_TITLE, NotebookVariableAccessibilityProvider, NotebookVariableRenderer, NotebookVariablesDelegate, REPL_TITLE } from './notebookVariablesTree.js';
import { getNotebookEditorFromEditorPane } from '../../notebookBrowser.js';
import { NotebookTextModel } from '../../../common/model/notebookTextModel.js';
import { ICellExecutionStateChangedEvent, IExecutionStateChangedEvent, INotebookExecutionStateService } from '../../../common/notebookExecutionStateService.js';
import { INotebookKernelService } from '../../../common/notebookKernelService.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';
import { IEditorCloseEvent, IEditorPane } from '../../../../../common/editor.js';
import { isCompositeNotebookEditorInput } from '../../../common/notebookEditorInput.js';

export type contextMenuArg = { source: string; name: string; type?: string; value?: string; expression?: string; language?: string; extensionId?: string };

export class NotebookVariablesView extends ViewPane {

	static readonly ID = 'notebookVariablesView';

	private tree: WorkbenchAsyncDataTree<INotebookScope | IEmptyScope, INotebookVariableElement> | undefined;
	private activeNotebook: NotebookTextModel | undefined;
	private readonly dataSource: NotebookVariableDataSource;
	private readonly accessibilityProvider: NotebookVariableAccessibilityProvider;

	private updateScheduler: RunOnceScheduler;

	constructor(
		options: IViewPaneOptions,
		@IEditorService private readonly editorService: IEditorService,
		@INotebookKernelService private readonly notebookKernelService: INotebookKernelService,
		@INotebookExecutionStateService private readonly notebookExecutionStateService: INotebookExecutionStateService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IOpenerService openerService: IOpenerService,
		@IQuickInputService protected quickInputService: IQuickInputService,
		@ICommandService protected commandService: ICommandService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@IMenuService private readonly menuService: IMenuService
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);

		this._register(this.editorService.onDidActiveEditorChange(() => this.handleActiveEditorChange()));
		this._register(this.notebookKernelService.onDidNotebookVariablesUpdate(this.handleVariablesChanged.bind(this)));
		this._register(this.notebookExecutionStateService.onDidChangeExecution(this.handleExecutionStateChange.bind(this)));
		this._register(this.editorService.onDidCloseEditor((e) => this.handleCloseEditor(e)));

		this.accessibilityProvider = new NotebookVariableAccessibilityProvider();
		this.handleActiveEditorChange(false);

		this.dataSource = new NotebookVariableDataSource(this.notebookKernelService);
		this.updateScheduler = new RunOnceScheduler(() => this.tree?.updateChildren(), 100);
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);
		this.element.classList.add('debug-pane');

		this.tree = this.instantiationService.createInstance(
			WorkbenchAsyncDataTree<INotebookScope | IEmptyScope, INotebookVariableElement>,
			'notebookVariablesTree',
			container,
			new NotebookVariablesDelegate(),
			[this.instantiationService.createInstance(NotebookVariableRenderer)],
			this.dataSource,
			{
				accessibilityProvider: this.accessibilityProvider,
				identityProvider: { getId: (e: INotebookVariableElement) => e.id },
			});

		this.tree.layout();
		if (this.activeNotebook) {
			this.tree.setInput({ kind: 'root', notebook: this.activeNotebook });
		}

		this._register(this.tree.onContextMenu(e => this.onContextMenu(e)));
	}

	private onContextMenu(e: ITreeContextMenuEvent<INotebookVariableElement>): void {
		if (!e.element) {
			return;
		}
		const element = e.element;

		const arg: contextMenuArg = {
			source: element.notebook.uri.toString(),
			name: element.name,
			value: element.value,
			type: element.type,
			expression: element.expression,
			language: element.language,
			extensionId: element.extensionId
		};

		const overlayedContext = this.contextKeyService.createOverlay([
			[CONTEXT_VARIABLE_NAME.key, element.name],
			[CONTEXT_VARIABLE_VALUE.key, element.value],
			[CONTEXT_VARIABLE_TYPE.key, element.type],
			[CONTEXT_VARIABLE_INTERFACES.key, element.interfaces],
			[CONTEXT_VARIABLE_LANGUAGE.key, element.language],
			[CONTEXT_VARIABLE_EXTENSIONID.key, element.extensionId]
		]);
		const menuActions = this.menuService.getMenuActions(MenuId.NotebookVariablesContext, overlayedContext, { arg, shouldForwardArgs: true });
		const actions = getFlatContextMenuActions(menuActions);
		this.contextMenuService.showContextMenu({
			getAnchor: () => e.anchor,
			getActions: () => actions
		});
	}

	override focus(): void {
		super.focus();
		this.tree?.domFocus();
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);
		this.tree?.layout(height, width);
	}

	private setActiveNotebook(notebookDocument: NotebookTextModel, editor: IEditorPane, doUpdate = true) {
		this.activeNotebook = notebookDocument;

		if (isCompositeNotebookEditorInput(editor.input)) {
			this.updateTitle(REPL_TITLE.value);
			this.accessibilityProvider.updateWidgetAriaLabel(REPL_TITLE.value);
		} else {
			this.updateTitle(NOTEBOOK_TITLE.value);
			this.accessibilityProvider.updateWidgetAriaLabel(NOTEBOOK_TITLE.value);
		}

		if (doUpdate) {
			this.tree?.setInput({ kind: 'root', notebook: notebookDocument });
			this.updateScheduler.schedule();
		}
	}

	private getActiveNotebook() {
		const notebookEditor = this.editorService.activeEditorPane;
		const notebookDocument = getNotebookEditorFromEditorPane(notebookEditor)?.textModel;
		return notebookDocument && notebookEditor ? { notebookDocument, notebookEditor } : undefined;
	}

	private handleCloseEditor(e: IEditorCloseEvent) {
		if (e.editor.resource && e.editor.resource.toString() === this.activeNotebook?.uri.toString()) {
			this.tree?.setInput({ kind: 'empty' });
			this.updateScheduler.schedule();
		}
	}

	private handleActiveEditorChange(doUpdate = true) {
		const found = this.getActiveNotebook();
		if (found && found.notebookDocument !== this.activeNotebook) {
			this.setActiveNotebook(found.notebookDocument, found.notebookEditor, doUpdate);
		}
	}

	private handleExecutionStateChange(event: ICellExecutionStateChangedEvent | IExecutionStateChangedEvent) {
		if (this.activeNotebook && event.affectsNotebook(this.activeNotebook.uri)) {
			// new execution state means either new variables or the kernel is busy so we shouldn't ask
			this.dataSource.cancel();

			// changed === undefined -> excecution ended
			if (event.changed === undefined) {
				this.updateScheduler.schedule();
			}
			else {
				this.updateScheduler.cancel();
			}
		} else if (!this.getActiveNotebook()) {
			// check if the updated variables are for a visible notebook
			this.editorService.visibleEditorPanes.forEach(editor => {
				const notebookDocument = getNotebookEditorFromEditorPane(editor)?.textModel;
				if (notebookDocument && event.affectsNotebook(notebookDocument.uri)) {
					this.setActiveNotebook(notebookDocument, editor);
				}
			});
		}
	}

	private handleVariablesChanged(notebookUri: URI) {
		if (this.activeNotebook && notebookUri.toString() === this.activeNotebook.uri.toString()) {
			this.updateScheduler.schedule();
		} else if (!this.getActiveNotebook()) {
			// check if the updated variables are for a visible notebook
			this.editorService.visibleEditorPanes.forEach(editor => {
				const notebookDocument = getNotebookEditorFromEditorPane(editor)?.textModel;
				if (notebookDocument && notebookDocument.uri.toString() === notebookUri.toString()) {
					this.setActiveNotebook(notebookDocument, editor);
				}
			});
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/outline/notebookOutline.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/outline/notebookOutline.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../../nls.js';
import * as DOM from '../../../../../../base/browser/dom.js';
import { ToolBar } from '../../../../../../base/browser/ui/toolbar/toolbar.js';
import { IIconLabelValueOptions, IconLabel } from '../../../../../../base/browser/ui/iconLabel/iconLabel.js';
import { IKeyboardNavigationLabelProvider, IListVirtualDelegate } from '../../../../../../base/browser/ui/list/list.js';
import { IListAccessibilityProvider } from '../../../../../../base/browser/ui/list/listWidget.js';
import { IDataSource, ITreeNode, ITreeRenderer } from '../../../../../../base/browser/ui/tree/tree.js';
import { Emitter, Event } from '../../../../../../base/common/event.js';
import { FuzzyScore, createMatches } from '../../../../../../base/common/filters.js';
import { Disposable, DisposableStore, IDisposable, toDisposable, type IReference } from '../../../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { URI } from '../../../../../../base/common/uri.js';
import { getIconClassesForLanguageId } from '../../../../../../editor/common/services/getIconClasses.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../../../platform/configuration/common/configurationRegistry.js';
import { IEditorOptions } from '../../../../../../platform/editor/common/editor.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchDataTreeOptions } from '../../../../../../platform/list/browser/listService.js';
import { MarkerSeverity } from '../../../../../../platform/markers/common/markers.js';
import { Registry } from '../../../../../../platform/registry/common/platform.js';
import { listErrorForeground, listWarningForeground } from '../../../../../../platform/theme/common/colorRegistry.js';
import { IThemeService } from '../../../../../../platform/theme/common/themeService.js';
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../../../common/contributions.js';
import { IEditorPane } from '../../../../../common/editor.js';
import { CellFoldingState, CellRevealType, ICellModelDecorations, ICellModelDeltaDecorations, ICellViewModel, INotebookEditor, INotebookEditorOptions, INotebookEditorPane, INotebookViewModel } from '../../notebookBrowser.js';
import { NotebookEditor } from '../../notebookEditor.js';
import { INotebookCellOutlineDataSource, NotebookCellOutlineDataSource } from '../../viewModel/notebookOutlineDataSource.js';
import { CellKind, NotebookCellsChangeType, NotebookSetting } from '../../../common/notebookCommon.js';
import { IEditorService, SIDE_GROUP } from '../../../../../services/editor/common/editorService.js';
import { LifecyclePhase } from '../../../../../services/lifecycle/common/lifecycle.js';
import { IBreadcrumbsDataSource, IBreadcrumbsOutlineElement, IOutline, IOutlineComparator, IOutlineCreator, IOutlineListConfig, IOutlineService, IQuickPickDataSource, IQuickPickOutlineElement, OutlineChangeEvent, OutlineConfigCollapseItemsValues, OutlineConfigKeys, OutlineTarget } from '../../../../../services/outline/browser/outline.js';
import { OutlineEntry } from '../../viewModel/OutlineEntry.js';
import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { IModelDeltaDecoration } from '../../../../../../editor/common/model.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { IContextMenuService } from '../../../../../../platform/contextview/browser/contextView.js';
import { Action2, IMenu, IMenuService, MenuId, MenuItemAction, MenuRegistry, registerAction2 } from '../../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKeyService, RawContextKey } from '../../../../../../platform/contextkey/common/contextkey.js';
import { MenuEntryActionViewItem, getActionBarActions } from '../../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IAction } from '../../../../../../base/common/actions.js';
import { NotebookOutlineEntryArgs } from '../../controller/sectionActions.js';
import { MarkupCellViewModel } from '../../viewModel/markupCellViewModel.js';
import { Delayer, disposableTimeout } from '../../../../../../base/common/async.js';
import { IOutlinePane } from '../../../../outline/browser/outline.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { NOTEBOOK_IS_ACTIVE_EDITOR } from '../../../common/notebookContextKeys.js';
import { NotebookOutlineConstants } from '../../viewModel/notebookOutlineEntryFactory.js';
import { INotebookCellOutlineDataSourceFactory } from '../../viewModel/notebookOutlineDataSourceFactory.js';
import { INotebookExecutionStateService, NotebookExecutionType } from '../../../common/notebookExecutionStateService.js';
import { ILanguageFeaturesService } from '../../../../../../editor/common/services/languageFeatures.js';
import { safeIntl } from '../../../../../../base/common/date.js';

class NotebookOutlineTemplate {

	static readonly templateId = 'NotebookOutlineRenderer';

	constructor(
		readonly container: HTMLElement,
		readonly iconClass: HTMLElement,
		readonly iconLabel: IconLabel,
		readonly decoration: HTMLElement,
		readonly actionMenu: HTMLElement,
		readonly elementDisposables: DisposableStore,
	) { }
}

class NotebookOutlineRenderer implements ITreeRenderer<OutlineEntry, FuzzyScore, NotebookOutlineTemplate> {

	templateId: string = NotebookOutlineTemplate.templateId;

	constructor(
		private readonly _editor: INotebookEditor | undefined,
		private readonly _target: OutlineTarget,
		@IThemeService private readonly _themeService: IThemeService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IMenuService private readonly _menuService: IMenuService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) { }

	renderTemplate(container: HTMLElement): NotebookOutlineTemplate {
		const elementDisposables = new DisposableStore();

		container.classList.add('notebook-outline-element', 'show-file-icons');
		const iconClass = document.createElement('div');
		container.append(iconClass);
		const iconLabel = new IconLabel(container, { supportHighlights: true });
		const decoration = document.createElement('div');
		decoration.className = 'element-decoration';
		container.append(decoration);
		const actionMenu = document.createElement('div');
		actionMenu.className = 'action-menu';
		container.append(actionMenu);

		return new NotebookOutlineTemplate(container, iconClass, iconLabel, decoration, actionMenu, elementDisposables);
	}

	renderElement(node: ITreeNode<OutlineEntry, FuzzyScore>, _index: number, template: NotebookOutlineTemplate): void {
		const extraClasses: string[] = [];
		const options: IIconLabelValueOptions = {
			matches: createMatches(node.filterData),
			labelEscapeNewLines: true,
			extraClasses,
		};

		const isCodeCell = node.element.cell.cellKind === CellKind.Code;
		if (node.element.level >= 8) { // symbol
			template.iconClass.className = 'element-icon ' + ThemeIcon.asClassNameArray(node.element.icon).join(' ');
		} else if (isCodeCell && this._themeService.getFileIconTheme().hasFileIcons && !node.element.isExecuting) {
			template.iconClass.className = '';
			extraClasses.push(...getIconClassesForLanguageId(node.element.cell.language ?? ''));
		} else {
			template.iconClass.className = 'element-icon ' + ThemeIcon.asClassNameArray(node.element.icon).join(' ');
		}

		template.iconLabel.setLabel(' ' + node.element.label, undefined, options);

		const { markerInfo } = node.element;

		template.container.style.removeProperty('--outline-element-color');
		template.decoration.innerText = '';
		if (markerInfo) {
			const problem = this._configurationService.getValue('problems.visibility');
			const useBadges = this._configurationService.getValue(OutlineConfigKeys.problemsBadges);

			if (!useBadges || !problem) {
				template.decoration.classList.remove('bubble');
				template.decoration.innerText = '';
			} else if (markerInfo.count === 0) {
				template.decoration.classList.add('bubble');
				template.decoration.innerText = '\uea71';
			} else {
				template.decoration.classList.remove('bubble');
				template.decoration.innerText = markerInfo.count > 9 ? '9+' : String(markerInfo.count);
			}
			const color = this._themeService.getColorTheme().getColor(markerInfo.topSev === MarkerSeverity.Error ? listErrorForeground : listWarningForeground);
			if (problem === undefined) {
				return;
			}
			const useColors = this._configurationService.getValue(OutlineConfigKeys.problemsColors);
			if (!useColors || !problem) {
				template.container.style.removeProperty('--outline-element-color');
				template.decoration.style.setProperty('--outline-element-color', color?.toString() ?? 'inherit');
			} else {
				template.container.style.setProperty('--outline-element-color', color?.toString() ?? 'inherit');
			}
		}

		if (this._target === OutlineTarget.OutlinePane) {
			if (!this._editor) {
				return;
			}

			const nbCell = node.element.cell;
			const nbViewModel = this._editor.getViewModel();
			if (!nbViewModel) {
				return;
			}
			const idx = nbViewModel.getCellIndex(nbCell);
			const length = isCodeCell ? 0 : nbViewModel.getFoldedLength(idx);

			const scopedContextKeyService = template.elementDisposables.add(this._contextKeyService.createScoped(template.container));
			NotebookOutlineContext.CellKind.bindTo(scopedContextKeyService).set(isCodeCell ? CellKind.Code : CellKind.Markup);
			NotebookOutlineContext.CellHasChildren.bindTo(scopedContextKeyService).set(length > 0);
			NotebookOutlineContext.CellHasHeader.bindTo(scopedContextKeyService).set(node.element.level !== NotebookOutlineConstants.NonHeaderOutlineLevel);
			NotebookOutlineContext.OutlineElementTarget.bindTo(scopedContextKeyService).set(this._target);
			this.setupFolding(isCodeCell, nbViewModel, scopedContextKeyService, template, nbCell);

			const outlineEntryToolbar = template.elementDisposables.add(new ToolBar(template.actionMenu, this._contextMenuService, {
				actionViewItemProvider: action => {
					if (action instanceof MenuItemAction) {
						return this._instantiationService.createInstance(MenuEntryActionViewItem, action, undefined);
					}
					return undefined;
				},
			}));

			const menu = template.elementDisposables.add(this._menuService.createMenu(MenuId.NotebookOutlineActionMenu, scopedContextKeyService));
			const actions = getOutlineToolbarActions(menu, { notebookEditor: this._editor, outlineEntry: node.element });
			outlineEntryToolbar.setActions(actions.primary, actions.secondary);

			this.setupToolbarListeners(this._editor, outlineEntryToolbar, menu, actions, node.element, template);
			template.actionMenu.style.padding = '0 0.8em 0 0.4em';
		}
	}

	disposeTemplate(templateData: NotebookOutlineTemplate): void {
		templateData.iconLabel.dispose();
		templateData.elementDisposables.dispose();
	}

	disposeElement(element: ITreeNode<OutlineEntry, FuzzyScore>, index: number, templateData: NotebookOutlineTemplate): void {
		templateData.elementDisposables.clear();
		DOM.clearNode(templateData.actionMenu);
	}

	private setupFolding(isCodeCell: boolean, nbViewModel: INotebookViewModel, scopedContextKeyService: IContextKeyService, template: NotebookOutlineTemplate, nbCell: ICellViewModel) {
		const foldingState = isCodeCell ? CellFoldingState.None : ((nbCell as MarkupCellViewModel).foldingState);
		const foldingStateCtx = NotebookOutlineContext.CellFoldingState.bindTo(scopedContextKeyService);
		foldingStateCtx.set(foldingState);

		if (!isCodeCell) {
			template.elementDisposables.add(nbViewModel.onDidFoldingStateChanged(() => {
				const foldingState = (nbCell as MarkupCellViewModel).foldingState;
				NotebookOutlineContext.CellFoldingState.bindTo(scopedContextKeyService).set(foldingState);
				foldingStateCtx.set(foldingState);
			}));
		}
	}

	private setupToolbarListeners(editor: INotebookEditor, toolbar: ToolBar, menu: IMenu, initActions: { primary: IAction[]; secondary: IAction[] }, entry: OutlineEntry, templateData: NotebookOutlineTemplate): void {
		// same fix as in cellToolbars setupListeners re #103926
		let dropdownIsVisible = false;
		let deferredUpdate: (() => void) | undefined;

		toolbar.setActions(initActions.primary, initActions.secondary);
		templateData.elementDisposables.add(menu.onDidChange(() => {
			if (dropdownIsVisible) {
				const actions = getOutlineToolbarActions(menu, { notebookEditor: editor, outlineEntry: entry });
				deferredUpdate = () => toolbar.setActions(actions.primary, actions.secondary);

				return;
			}

			const actions = getOutlineToolbarActions(menu, { notebookEditor: editor, outlineEntry: entry });
			toolbar.setActions(actions.primary, actions.secondary);
		}));

		templateData.container.classList.remove('notebook-outline-toolbar-dropdown-active');
		templateData.elementDisposables.add(toolbar.onDidChangeDropdownVisibility(visible => {
			dropdownIsVisible = visible;
			if (visible) {
				templateData.container.classList.add('notebook-outline-toolbar-dropdown-active');
			} else {
				templateData.container.classList.remove('notebook-outline-toolbar-dropdown-active');
			}

			if (deferredUpdate && !visible) {
				disposableTimeout(() => {
					deferredUpdate?.();
				}, 0, templateData.elementDisposables);

				deferredUpdate = undefined;
			}
		}));

	}
}

function getOutlineToolbarActions(menu: IMenu, args?: NotebookOutlineEntryArgs): { primary: IAction[]; secondary: IAction[] } {
	return getActionBarActions(menu.getActions({ shouldForwardArgs: true, arg: args }), g => /^inline/.test(g));
}

class NotebookOutlineAccessibility implements IListAccessibilityProvider<OutlineEntry> {
	getAriaLabel(element: OutlineEntry): string | null {
		return element.label;
	}
	getWidgetAriaLabel(): string {
		return '';
	}
}

class NotebookNavigationLabelProvider implements IKeyboardNavigationLabelProvider<OutlineEntry> {
	getKeyboardNavigationLabel(element: OutlineEntry): { toString(): string | undefined } | { toString(): string | undefined }[] | undefined {
		return element.label;
	}
}

class NotebookOutlineVirtualDelegate implements IListVirtualDelegate<OutlineEntry> {

	getHeight(_element: OutlineEntry): number {
		return 22;
	}

	getTemplateId(_element: OutlineEntry): string {
		return NotebookOutlineTemplate.templateId;
	}
}

export class NotebookQuickPickProvider implements IQuickPickDataSource<OutlineEntry> {

	private readonly _disposables = new DisposableStore();

	private gotoShowCodeCellSymbols: boolean;

	constructor(
		private readonly notebookCellOutlineDataSourceRef: IReference<INotebookCellOutlineDataSource> | undefined,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IThemeService private readonly _themeService: IThemeService
	) {
		this.gotoShowCodeCellSymbols = this._configurationService.getValue<boolean>(NotebookSetting.gotoSymbolsAllSymbols);

		this._disposables.add(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(NotebookSetting.gotoSymbolsAllSymbols)) {
				this.gotoShowCodeCellSymbols = this._configurationService.getValue<boolean>(NotebookSetting.gotoSymbolsAllSymbols);
			}
		}));
	}

	getQuickPickElements(): IQuickPickOutlineElement<OutlineEntry>[] {
		const bucket: OutlineEntry[] = [];
		for (const entry of this.notebookCellOutlineDataSourceRef?.object?.entries ?? []) {
			entry.asFlatList(bucket);
		}
		const result: IQuickPickOutlineElement<OutlineEntry>[] = [];
		const { hasFileIcons } = this._themeService.getFileIconTheme();

		const isSymbol = (element: OutlineEntry) => !!element.symbolKind;
		const isCodeCell = (element: OutlineEntry) => (element.cell.cellKind === CellKind.Code && element.level === NotebookOutlineConstants.NonHeaderOutlineLevel); // code cell entries are exactly level 7 by this constant
		for (let i = 0; i < bucket.length; i++) {
			const element = bucket[i];
			const nextElement = bucket[i + 1]; // can be undefined

			if (!this.gotoShowCodeCellSymbols
				&& isSymbol(element)) {
				continue;
			}

			if (this.gotoShowCodeCellSymbols
				&& isCodeCell(element)
				&& nextElement && isSymbol(nextElement)) {
				continue;
			}

			const useFileIcon = hasFileIcons && !element.symbolKind;
			// todo@jrieken it is fishy that codicons cannot be used with iconClasses
			// but file icons can...
			result.push({
				element,
				label: useFileIcon ? element.label : `$(${element.icon.id}) ${element.label}`,
				ariaLabel: element.label,
				iconClasses: useFileIcon ? getIconClassesForLanguageId(element.cell.language ?? '') : undefined,
			});
		}
		return result;
	}

	dispose(): void {
		this._disposables.dispose();
	}
}

/**
 * Checks if the given outline entry should be filtered out of the outlinePane
 *
 * @param entry the OutlineEntry to check
 * @param showMarkdownHeadersOnly whether to show only markdown headers
 * @param showCodeCells whether to show code cells
 * @param showCodeCellSymbols whether to show code cell symbols
 * @returns true if the entry should be filtered out of the outlinePane, false if the entry should be visible.
 */
function filterEntry(entry: OutlineEntry, showMarkdownHeadersOnly: boolean, showCodeCells: boolean, showCodeCellSymbols: boolean): boolean {
	// if any are true, return true, this entry should NOT be included in the outline
	if (
		(showMarkdownHeadersOnly && entry.cell.cellKind === CellKind.Markup && entry.level === NotebookOutlineConstants.NonHeaderOutlineLevel) ||	// show headers only   + cell is mkdn + is level 7 (not header)
		(!showCodeCells && entry.cell.cellKind === CellKind.Code) ||																				// show code cells off + cell is code
		(!showCodeCellSymbols && entry.cell.cellKind === CellKind.Code && entry.level > NotebookOutlineConstants.NonHeaderOutlineLevel)				// show symbols off    + cell is code + is level >7 (nb symbol levels)
	) {
		return true;
	}

	return false;
}

export class NotebookOutlinePaneProvider implements IDataSource<NotebookCellOutline, OutlineEntry> {

	private readonly _disposables = new DisposableStore();

	private showCodeCells: boolean;
	private showCodeCellSymbols: boolean;
	private showMarkdownHeadersOnly: boolean;

	constructor(
		private readonly outlineDataSourceRef: IReference<INotebookCellOutlineDataSource> | undefined,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
		this.showCodeCells = this._configurationService.getValue<boolean>(NotebookSetting.outlineShowCodeCells);
		this.showCodeCellSymbols = this._configurationService.getValue<boolean>(NotebookSetting.outlineShowCodeCellSymbols);
		this.showMarkdownHeadersOnly = this._configurationService.getValue<boolean>(NotebookSetting.outlineShowMarkdownHeadersOnly);

		this._disposables.add(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(NotebookSetting.outlineShowCodeCells)) {
				this.showCodeCells = this._configurationService.getValue<boolean>(NotebookSetting.outlineShowCodeCells);
			}
			if (e.affectsConfiguration(NotebookSetting.outlineShowCodeCellSymbols)) {
				this.showCodeCellSymbols = this._configurationService.getValue<boolean>(NotebookSetting.outlineShowCodeCellSymbols);
			}
			if (e.affectsConfiguration(NotebookSetting.outlineShowMarkdownHeadersOnly)) {
				this.showMarkdownHeadersOnly = this._configurationService.getValue<boolean>(NotebookSetting.outlineShowMarkdownHeadersOnly);
			}
		}));
	}

	public getActiveEntry(): OutlineEntry | undefined {
		const newActive = this.outlineDataSourceRef?.object?.activeElement;
		if (!newActive) {
			return undefined;
		}

		if (!filterEntry(newActive, this.showMarkdownHeadersOnly, this.showCodeCells, this.showCodeCellSymbols)) {
			return newActive;
		}

		// find a valid parent
		let parent = newActive.parent;
		while (parent) {
			if (filterEntry(parent, this.showMarkdownHeadersOnly, this.showCodeCells, this.showCodeCellSymbols)) {
				parent = parent.parent;
			} else {
				return parent;
			}
		}

		// no valid parent found, return undefined
		return undefined;
	}

	*getChildren(element: NotebookCellOutline | OutlineEntry): Iterable<OutlineEntry> {
		const isOutline = element instanceof NotebookCellOutline;
		const entries = isOutline ? this.outlineDataSourceRef?.object?.entries ?? [] : element.children;

		for (const entry of entries) {
			if (entry.cell.cellKind === CellKind.Markup) {
				if (!this.showMarkdownHeadersOnly) {
					yield entry;
				} else if (entry.level < NotebookOutlineConstants.NonHeaderOutlineLevel) {
					yield entry;
				}

			} else if (this.showCodeCells && entry.cell.cellKind === CellKind.Code) {
				if (this.showCodeCellSymbols) {
					yield entry;
				} else if (entry.level === NotebookOutlineConstants.NonHeaderOutlineLevel) {
					yield entry;
				}
			}
		}
	}

	dispose(): void {
		this._disposables.dispose();
	}
}

export class NotebookBreadcrumbsProvider implements IBreadcrumbsDataSource<OutlineEntry> {

	private readonly _disposables = new DisposableStore();

	private showCodeCells: boolean;

	constructor(
		private readonly outlineDataSourceRef: IReference<INotebookCellOutlineDataSource> | undefined,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
		this.showCodeCells = this._configurationService.getValue<boolean>(NotebookSetting.breadcrumbsShowCodeCells);
		this._disposables.add(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(NotebookSetting.breadcrumbsShowCodeCells)) {
				this.showCodeCells = this._configurationService.getValue<boolean>(NotebookSetting.breadcrumbsShowCodeCells);
			}
		}));
	}

	getBreadcrumbElements(): readonly IBreadcrumbsOutlineElement<OutlineEntry>[] {
		const result: IBreadcrumbsOutlineElement<OutlineEntry>[] = [];
		let candidate = this.outlineDataSourceRef?.object?.activeElement;
		while (candidate) {
			if (this.showCodeCells || candidate.cell.cellKind !== CellKind.Code) {
				result.unshift({ element: candidate, label: candidate.label });
			}
			candidate = candidate.parent;
		}
		return result;
	}

	dispose(): void {
		this._disposables.dispose();
	}
}

class NotebookComparator implements IOutlineComparator<OutlineEntry> {

	private readonly _collator = safeIntl.Collator(undefined, { numeric: true });

	compareByPosition(a: OutlineEntry, b: OutlineEntry): number {
		return a.index - b.index;
	}
	compareByType(a: OutlineEntry, b: OutlineEntry): number {
		return a.cell.cellKind - b.cell.cellKind || this._collator.value.compare(a.label, b.label);
	}
	compareByName(a: OutlineEntry, b: OutlineEntry): number {
		return this._collator.value.compare(a.label, b.label);
	}
}

export class NotebookCellOutline implements IOutline<OutlineEntry> {
	readonly outlineKind = 'notebookCells';

	private readonly _disposables = new DisposableStore();
	private readonly _modelDisposables = new DisposableStore();
	private readonly _dataSourceDisposables = new DisposableStore();

	private readonly _onDidChange = new Emitter<OutlineChangeEvent>();
	readonly onDidChange: Event<OutlineChangeEvent> = this._onDidChange.event;

	private readonly delayerRecomputeState: Delayer<void> = this._disposables.add(new Delayer<void>(300));
	private readonly delayerRecomputeActive: Delayer<void> = this._disposables.add(new Delayer<void>(200));
	// this can be long, because it will force a recompute at the end, so ideally we only do this once all nb language features are registered
	private readonly delayerRecomputeSymbols: Delayer<void> = this._disposables.add(new Delayer<void>(2000));

	readonly config: IOutlineListConfig<OutlineEntry>;
	private _outlineDataSourceReference: IReference<NotebookCellOutlineDataSource> | undefined;
	// These three fields will always be set via setDataSources() on L475
	private _treeDataSource!: IDataSource<NotebookCellOutline, OutlineEntry>;
	private _quickPickDataSource!: IQuickPickDataSource<OutlineEntry>;
	private _breadcrumbsDataSource!: IBreadcrumbsDataSource<OutlineEntry>;

	// view settings
	private outlineShowCodeCells: boolean;
	private outlineShowCodeCellSymbols: boolean;
	private outlineShowMarkdownHeadersOnly: boolean;

	// getters
	get activeElement(): OutlineEntry | undefined {
		this.checkDelayer();
		if (this._target === OutlineTarget.OutlinePane) {
			return (this.config.treeDataSource as NotebookOutlinePaneProvider).getActiveEntry();
		} else {
			console.error('activeElement should not be called outside of the OutlinePane');
			return undefined;
		}
	}
	get entries(): OutlineEntry[] {
		this.checkDelayer();
		return this._outlineDataSourceReference?.object?.entries ?? [];
	}
	get uri(): URI | undefined {
		return this._outlineDataSourceReference?.object?.uri;
	}
	get isEmpty(): boolean {
		if (!this._outlineDataSourceReference?.object?.entries) {
			return true;
		}

		return !this._outlineDataSourceReference.object.entries.some(entry => {
			return !filterEntry(entry, this.outlineShowMarkdownHeadersOnly, this.outlineShowCodeCells, this.outlineShowCodeCellSymbols);
		});
	}

	private checkDelayer() {
		if (this.delayerRecomputeState.isTriggered()) {
			this.delayerRecomputeState.cancel();
			this.recomputeState();
		}
	}

	constructor(
		private readonly _editor: INotebookEditorPane,
		private readonly _target: OutlineTarget,
		@IThemeService private readonly _themeService: IThemeService,
		@IEditorService private readonly _editorService: IEditorService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@INotebookExecutionStateService private readonly _notebookExecutionStateService: INotebookExecutionStateService,
	) {
		this.outlineShowCodeCells = this._configurationService.getValue<boolean>(NotebookSetting.outlineShowCodeCells);
		this.outlineShowCodeCellSymbols = this._configurationService.getValue<boolean>(NotebookSetting.outlineShowCodeCellSymbols);
		this.outlineShowMarkdownHeadersOnly = this._configurationService.getValue<boolean>(NotebookSetting.outlineShowMarkdownHeadersOnly);

		this.initializeOutline();

		const delegate = new NotebookOutlineVirtualDelegate();
		const renderers = [this._instantiationService.createInstance(NotebookOutlineRenderer, this._editor.getControl(), this._target)];
		const comparator = new NotebookComparator();

		const options: IWorkbenchDataTreeOptions<OutlineEntry, FuzzyScore> = {
			collapseByDefault: this._target === OutlineTarget.Breadcrumbs || (this._target === OutlineTarget.OutlinePane && this._configurationService.getValue(OutlineConfigKeys.collapseItems) === OutlineConfigCollapseItemsValues.Collapsed),
			expandOnlyOnTwistieClick: true,
			multipleSelectionSupport: false,
			accessibilityProvider: new NotebookOutlineAccessibility(),
			identityProvider: { getId: element => element.cell.uri.toString() },
			keyboardNavigationLabelProvider: new NotebookNavigationLabelProvider()
		};

		this.config = {
			treeDataSource: this._treeDataSource,
			quickPickDataSource: this._quickPickDataSource,
			breadcrumbsDataSource: this._breadcrumbsDataSource,
			delegate,
			renderers,
			comparator,
			options,
		};
	}

	private initializeOutline() {
		// initial setup
		this.setDataSources();
		this.setModelListeners();

		// reset the data sources + model listeners when we get a new notebook model
		this._disposables.add(this._editor.onDidChangeModel(() => {
			this.setDataSources();
			this.setModelListeners();
			this.computeSymbols();
		}));

		// recompute symbols as document symbol providers are updated in the language features registry
		this._disposables.add(this._languageFeaturesService.documentSymbolProvider.onDidChange(() => {
			this.delayedComputeSymbols();
		}));

		// recompute active when the selection changes
		this._disposables.add(this._editor.onDidChangeSelection(() => {
			this.delayedRecomputeActive();
		}));

		// recompute state when filter config changes
		this._disposables.add(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(NotebookSetting.outlineShowMarkdownHeadersOnly) ||
				e.affectsConfiguration(NotebookSetting.outlineShowCodeCells) ||
				e.affectsConfiguration(NotebookSetting.outlineShowCodeCellSymbols) ||
				e.affectsConfiguration(NotebookSetting.breadcrumbsShowCodeCells)
			) {
				this.outlineShowCodeCells = this._configurationService.getValue<boolean>(NotebookSetting.outlineShowCodeCells);
				this.outlineShowCodeCellSymbols = this._configurationService.getValue<boolean>(NotebookSetting.outlineShowCodeCellSymbols);
				this.outlineShowMarkdownHeadersOnly = this._configurationService.getValue<boolean>(NotebookSetting.outlineShowMarkdownHeadersOnly);

				this.delayedRecomputeState();
			}
		}));

		// recompute state when execution states change
		this._disposables.add(this._notebookExecutionStateService.onDidChangeExecution(e => {
			if (e.type === NotebookExecutionType.cell && !!this._editor.textModel && e.affectsNotebook(this._editor.textModel?.uri)) {
				this.delayedRecomputeState();
			}
		}));

		// recompute symbols when the configuration changes (recompute state - and therefore recompute active - is also called within compute symbols)
		this._disposables.add(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(NotebookSetting.outlineShowCodeCellSymbols)) {
				this.outlineShowCodeCellSymbols = this._configurationService.getValue<boolean>(NotebookSetting.outlineShowCodeCellSymbols);
				this.computeSymbols();
			}
		}));

		// fire a change event when the theme changes
		this._disposables.add(this._themeService.onDidFileIconThemeChange(() => {
			this._onDidChange.fire({});
		}));

		// finish with a recompute state
		this.recomputeState();
	}

	/**
	 * set up the primary data source + three viewing sources for the various outline views
	 */
	private setDataSources(): void {
		const notebookEditor = this._editor.getControl();
		this._outlineDataSourceReference?.dispose();
		this._dataSourceDisposables.clear();

		if (!notebookEditor?.hasModel()) {
			this._outlineDataSourceReference = undefined;
		} else {
			this._outlineDataSourceReference = this._dataSourceDisposables.add(this._instantiationService.invokeFunction((accessor) => accessor.get(INotebookCellOutlineDataSourceFactory).getOrCreate(notebookEditor)));
			// escalate outline data source change events
			this._dataSourceDisposables.add(this._outlineDataSourceReference.object.onDidChange(() => {
				this._onDidChange.fire({});
			}));
		}

		// these fields can be passed undefined outlineDataSources. View Providers all handle it accordingly
		this._treeDataSource = this._dataSourceDisposables.add(this._instantiationService.createInstance(NotebookOutlinePaneProvider, this._outlineDataSourceReference));
		this._quickPickDataSource = this._dataSourceDisposables.add(this._instantiationService.createInstance(NotebookQuickPickProvider, this._outlineDataSourceReference));
		this._breadcrumbsDataSource = this._dataSourceDisposables.add(this._instantiationService.createInstance(NotebookBreadcrumbsProvider, this._outlineDataSourceReference));
	}

	/**
	 * set up the listeners for the outline content, these respond to model changes in the notebook
	 */
	private setModelListeners(): void {
		this._modelDisposables.clear();
		if (!this._editor.textModel) {
			return;
		}

		// Perhaps this is the first time we're building the outline
		if (!this.entries.length) {
			this.computeSymbols();
		}

		// recompute state when there are notebook content changes
		this._modelDisposables.add(this._editor.textModel.onDidChangeContent(contentChanges => {
			if (contentChanges.rawEvents.some(c =>
				c.kind === NotebookCellsChangeType.ChangeCellContent ||
				c.kind === NotebookCellsChangeType.ChangeCellInternalMetadata ||
				c.kind === NotebookCellsChangeType.Move ||
				c.kind === NotebookCellsChangeType.ModelChange)) {
				this.delayedRecomputeState();
			}
		}));
	}

	private async computeSymbols(cancelToken: CancellationToken = CancellationToken.None) {
		if (this._target === OutlineTarget.OutlinePane && this.outlineShowCodeCellSymbols) {
			// No need to wait for this, we want the outline to show up quickly.
			void this.doComputeSymbols(cancelToken);
		}
	}
	public async doComputeSymbols(cancelToken: CancellationToken): Promise<void> {
		await this._outlineDataSourceReference?.object?.computeFullSymbols(cancelToken);
	}
	private async delayedComputeSymbols() {
		this.delayerRecomputeState.cancel();
		this.delayerRecomputeActive.cancel();
		this.delayerRecomputeSymbols.trigger(() => { this.computeSymbols(); });
	}

	private recomputeState() { this._outlineDataSourceReference?.object?.recomputeState(); }
	private delayedRecomputeState() {
		this.delayerRecomputeActive.cancel(); // Active is always recomputed after a recomputing the State.
		this.delayerRecomputeState.trigger(() => { this.recomputeState(); });
	}

	private recomputeActive() { this._outlineDataSourceReference?.object?.recomputeActive(); }
	private delayedRecomputeActive() {
		this.delayerRecomputeActive.trigger(() => { this.recomputeActive(); });
	}

	async reveal(entry: OutlineEntry, options: IEditorOptions, sideBySide: boolean): Promise<void> {
		const notebookEditorOptions: INotebookEditorOptions = {
			...options,
			override: this._editor.input?.editorId,
			cellRevealType: CellRevealType.Top,
			selection: entry.position,
			viewState: undefined,
		};
		await this._editorService.openEditor({
			resource: entry.cell.uri,
			options: notebookEditorOptions,
		}, sideBySide ? SIDE_GROUP : undefined);
	}

	preview(entry: OutlineEntry): IDisposable {
		const widget = this._editor.getControl();
		if (!widget) {
			return Disposable.None;
		}


		if (entry.range) {
			const range = Range.lift(entry.range);
			widget.revealRangeInCenterIfOutsideViewportAsync(entry.cell, range);
		} else {
			widget.revealInCenterIfOutsideViewport(entry.cell);
		}

		const ids = widget.deltaCellDecorations([], [{
			handle: entry.cell.handle,
			options: { className: 'nb-symbolHighlight', outputClassName: 'nb-symbolHighlight' }
		}]);

		let editorDecorations: ICellModelDecorations[];
		widget.changeModelDecorations(accessor => {
			if (entry.range) {
				const decorations: IModelDeltaDecoration[] = [
					{
						range: entry.range, options: {
							description: 'document-symbols-outline-range-highlight',
							className: 'rangeHighlight',
							isWholeLine: true
						}
					}
				];
				const deltaDecoration: ICellModelDeltaDecorations = {
					ownerId: entry.cell.handle,
					decorations: decorations
				};

				editorDecorations = accessor.deltaDecorations([], [deltaDecoration]);
			}
		});

		return toDisposable(() => {
			widget.deltaCellDecorations(ids, []);
			if (editorDecorations?.length) {
				widget.changeModelDecorations(accessor => {
					accessor.deltaDecorations(editorDecorations, []);
				});
			}
		});

	}

	captureViewState(): IDisposable {
		const widget = this._editor.getControl();
		const viewState = widget?.getEditorViewState();
		return toDisposable(() => {
			if (viewState) {
				widget?.restoreListViewState(viewState);
			}
		});
	}

	dispose(): void {
		this._onDidChange.dispose();
		this._disposables.dispose();
		this._modelDisposables.dispose();
		this._dataSourceDisposables.dispose();
		this._outlineDataSourceReference?.dispose();
	}
}

export class NotebookOutlineCreator implements IOutlineCreator<NotebookEditor, OutlineEntry> {

	readonly dispose: () => void;

	constructor(
		@IOutlineService outlineService: IOutlineService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) {
		const reg = outlineService.registerOutlineCreator(this);
		this.dispose = () => reg.dispose();
	}

	matches(candidate: IEditorPane): candidate is NotebookEditor {
		return candidate.getId() === NotebookEditor.ID;
	}

	async createOutline(editor: INotebookEditorPane, target: OutlineTarget, cancelToken: CancellationToken): Promise<IOutline<OutlineEntry> | undefined> {
		const outline = this._instantiationService.createInstance(NotebookCellOutline, editor, target);
		if (target === OutlineTarget.QuickPick) {
			// The quickpick creates the outline on demand
			// so we need to ensure the symbols are pre-cached before the entries are syncronously requested
			await outline.doComputeSymbols(cancelToken);
		}
		return outline;
	}
}

export const NotebookOutlineContext = {
	CellKind: new RawContextKey<CellKind>('notebookCellKind', undefined),
	CellHasChildren: new RawContextKey<boolean>('notebookCellHasChildren', false),
	CellHasHeader: new RawContextKey<boolean>('notebookCellHasHeader', false),
	CellFoldingState: new RawContextKey<CellFoldingState>('notebookCellFoldingState', CellFoldingState.None),
	OutlineElementTarget: new RawContextKey<OutlineTarget>('notebookOutlineElementTarget', undefined),
};

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(NotebookOutlineCreator, LifecyclePhase.Eventually);

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
	id: 'notebook',
	order: 100,
	type: 'object',
	'properties': {
		[NotebookSetting.outlineShowMarkdownHeadersOnly]: {
			type: 'boolean',
			default: true,
			markdownDescription: localize('outline.showMarkdownHeadersOnly', "When enabled, notebook outline will show only markdown cells containing a header.")
		},
		[NotebookSetting.outlineShowCodeCells]: {
			type: 'boolean',
			default: false,
			markdownDescription: localize('outline.showCodeCells', "When enabled, notebook outline shows code cells.")
		},
		[NotebookSetting.outlineShowCodeCellSymbols]: {
			type: 'boolean',
			default: true,
			markdownDescription: localize('outline.showCodeCellSymbols', "When enabled, notebook outline shows code cell symbols. Relies on `#notebook.outline.showCodeCells#` being enabled.")
		},
		[NotebookSetting.breadcrumbsShowCodeCells]: {
			type: 'boolean',
			default: true,
			markdownDescription: localize('breadcrumbs.showCodeCells', "When enabled, notebook breadcrumbs contain code cells.")
		},
		[NotebookSetting.gotoSymbolsAllSymbols]: {
			type: 'boolean',
			default: true,
			markdownDescription: localize('notebook.gotoSymbols.showAllSymbols', "When enabled, the Go to Symbol Quick Pick will display full code symbols from the notebook, as well as Markdown headers.")
		},
	}
});

MenuRegistry.appendMenuItem(MenuId.ViewTitle, {
	submenu: MenuId.NotebookOutlineFilter,
	title: localize('filter', "Filter Entries"),
	icon: Codicon.filter,
	group: 'navigation',
	order: -1,
	when: ContextKeyExpr.and(ContextKeyExpr.equals('view', IOutlinePane.Id), NOTEBOOK_IS_ACTIVE_EDITOR),
});

registerAction2(class ToggleShowMarkdownHeadersOnly extends Action2 {
	constructor() {
		super({
			id: 'notebook.outline.toggleShowMarkdownHeadersOnly',
			title: localize('toggleShowMarkdownHeadersOnly', "Markdown Headers Only"),
			f1: false,
			toggled: {
				condition: ContextKeyExpr.equals('config.notebook.outline.showMarkdownHeadersOnly', true)
			},
			menu: {
				id: MenuId.NotebookOutlineFilter,
				group: '0_markdown_cells',
			}
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]) {
		const configurationService = accessor.get(IConfigurationService);
		const showMarkdownHeadersOnly = configurationService.getValue<boolean>(NotebookSetting.outlineShowMarkdownHeadersOnly);
		configurationService.updateValue(NotebookSetting.outlineShowMarkdownHeadersOnly, !showMarkdownHeadersOnly);
	}
});

registerAction2(class ToggleCodeCellEntries extends Action2 {
	constructor() {
		super({
			id: 'notebook.outline.toggleCodeCells',
			title: localize('toggleCodeCells', "Code Cells"),
			f1: false,
			toggled: {
				condition: ContextKeyExpr.equals('config.notebook.outline.showCodeCells', true)
			},
			menu: {
				id: MenuId.NotebookOutlineFilter,
				order: 1,
				group: '1_code_cells',
			}
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]) {
		const configurationService = accessor.get(IConfigurationService);
		const showCodeCells = configurationService.getValue<boolean>(NotebookSetting.outlineShowCodeCells);
		configurationService.updateValue(NotebookSetting.outlineShowCodeCells, !showCodeCells);
	}
});

registerAction2(class ToggleCodeCellSymbolEntries extends Action2 {
	constructor() {
		super({
			id: 'notebook.outline.toggleCodeCellSymbols',
			title: localize('toggleCodeCellSymbols', "Code Cell Symbols"),
			f1: false,
			toggled: {
				condition: ContextKeyExpr.equals('config.notebook.outline.showCodeCellSymbols', true)
			},
			menu: {
				id: MenuId.NotebookOutlineFilter,
				order: 2,
				group: '1_code_cells',
			}
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]) {
		const configurationService = accessor.get(IConfigurationService);
		const showCodeCellSymbols = configurationService.getValue<boolean>(NotebookSetting.outlineShowCodeCellSymbols);
		configurationService.updateValue(NotebookSetting.outlineShowCodeCellSymbols, !showCodeCellSymbols);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/profile/notebookProfile.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/profile/notebookProfile.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ServicesAccessor } from '../../../../../../editor/browser/editorExtensions.js';
import { localize } from '../../../../../../nls.js';
import { Action2, registerAction2 } from '../../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { NotebookSetting } from '../../../common/notebookCommon.js';

export enum NotebookProfileType {
	default = 'default',
	jupyter = 'jupyter',
	colab = 'colab'
}

const profiles = {
	[NotebookProfileType.default]: {
		[NotebookSetting.focusIndicator]: 'gutter',
		[NotebookSetting.insertToolbarLocation]: 'both',
		[NotebookSetting.globalToolbar]: true,
		[NotebookSetting.cellToolbarLocation]: { default: 'right' },
		[NotebookSetting.compactView]: true,
		[NotebookSetting.showCellStatusBar]: 'visible',
		[NotebookSetting.consolidatedRunButton]: true,
		[NotebookSetting.undoRedoPerCell]: false
	},
	[NotebookProfileType.jupyter]: {
		[NotebookSetting.focusIndicator]: 'gutter',
		[NotebookSetting.insertToolbarLocation]: 'notebookToolbar',
		[NotebookSetting.globalToolbar]: true,
		[NotebookSetting.cellToolbarLocation]: { default: 'left' },
		[NotebookSetting.compactView]: true,
		[NotebookSetting.showCellStatusBar]: 'visible',
		[NotebookSetting.consolidatedRunButton]: false,
		[NotebookSetting.undoRedoPerCell]: true
	},
	[NotebookProfileType.colab]: {
		[NotebookSetting.focusIndicator]: 'border',
		[NotebookSetting.insertToolbarLocation]: 'betweenCells',
		[NotebookSetting.globalToolbar]: false,
		[NotebookSetting.cellToolbarLocation]: { default: 'right' },
		[NotebookSetting.compactView]: false,
		[NotebookSetting.showCellStatusBar]: 'hidden',
		[NotebookSetting.consolidatedRunButton]: true,
		[NotebookSetting.undoRedoPerCell]: false
	}
};

async function applyProfile(configService: IConfigurationService, profile: Record<string, any>): Promise<void> {
	const promises = [];
	for (const settingKey in profile) {
		promises.push(configService.updateValue(settingKey, profile[settingKey]));
	}

	await Promise.all(promises);
}

export interface ISetProfileArgs {
	profile: NotebookProfileType;
}

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'notebook.setProfile',
			title: localize('setProfileTitle', "Set Profile")
		});
	}

	async run(accessor: ServicesAccessor, args: unknown): Promise<void> {
		if (!isSetProfileArgs(args)) {
			return;
		}

		const configService = accessor.get(IConfigurationService);
		return applyProfile(configService, profiles[args.profile]);
	}
});

function isSetProfileArgs(args: unknown): args is ISetProfileArgs {
	const setProfileArgs = args as ISetProfileArgs;
	return setProfileArgs.profile === NotebookProfileType.colab ||
		setProfileArgs.profile === NotebookProfileType.default ||
		setProfileArgs.profile === NotebookProfileType.jupyter;
}

// export class NotebookProfileContribution extends Disposable {

// 	static readonly ID = 'workbench.contrib.notebookProfile';

// 	constructor(@IConfigurationService configService: IConfigurationService, @IWorkbenchAssignmentService private readonly experimentService: IWorkbenchAssignmentService) {
// 		super();

// 		if (this.experimentService) {
// 			this.experimentService.getTreatment<NotebookProfileType.default | NotebookProfileType.jupyter | NotebookProfileType.colab>('notebookprofile').then(treatment => {
// 				if (treatment === undefined) {
// 					return;
// 				} else {
// 					// check if settings are already modified
// 					const focusIndicator = configService.getValue(NotebookSetting.focusIndicator);
// 					const insertToolbarPosition = configService.getValue(NotebookSetting.insertToolbarLocation);
// 					const globalToolbar = configService.getValue(NotebookSetting.globalToolbar);
// 					// const cellToolbarLocation = configService.getValue(NotebookSetting.cellToolbarLocation);
// 					const compactView = configService.getValue(NotebookSetting.compactView);
// 					const showCellStatusBar = configService.getValue(NotebookSetting.showCellStatusBar);
// 					const consolidatedRunButton = configService.getValue(NotebookSetting.consolidatedRunButton);
// 					if (focusIndicator === 'border'
// 						&& insertToolbarPosition === 'both'
// 						&& globalToolbar === false
// 						// && cellToolbarLocation === undefined
// 						&& compactView === true
// 						&& showCellStatusBar === 'visible'
// 						&& consolidatedRunButton === true
// 					) {
// 						applyProfile(configService, profiles[treatment] ?? profiles[NotebookProfileType.default]);
// 					}
// 				}
// 			});
// 		}
// 	}
// }

// registerWorkbenchContribution2(NotebookProfileContribution.ID, NotebookProfileContribution, WorkbenchPhase.BlockRestore);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/saveParticipants/saveParticipants.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/saveParticipants/saveParticipants.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { HierarchicalKind } from '../../../../../../base/common/hierarchicalKind.js';
import { Disposable, DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { isEqual } from '../../../../../../base/common/resources.js';
import { ICodeEditor } from '../../../../../../editor/browser/editorBrowser.js';
import { IBulkEditService, ResourceEdit, ResourceTextEdit } from '../../../../../../editor/browser/services/bulkEditService.js';
import { trimTrailingWhitespace } from '../../../../../../editor/common/commands/trimTrailingWhitespaceCommand.js';
import { Position } from '../../../../../../editor/common/core/position.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { Selection } from '../../../../../../editor/common/core/selection.js';
import { CodeActionProvider, CodeActionTriggerType, IWorkspaceTextEdit } from '../../../../../../editor/common/languages.js';
import { IReadonlyTextBuffer, ITextModel } from '../../../../../../editor/common/model.js';
import { IEditorWorkerService } from '../../../../../../editor/common/services/editorWorker.js';
import { ILanguageFeaturesService } from '../../../../../../editor/common/services/languageFeatures.js';
import { ITextModelService } from '../../../../../../editor/common/services/resolverService.js';
import { ApplyCodeActionReason, applyCodeAction, getCodeActions } from '../../../../../../editor/contrib/codeAction/browser/codeAction.js';
import { CodeActionItem, CodeActionKind, CodeActionTriggerSource } from '../../../../../../editor/contrib/codeAction/common/types.js';
import { FormattingMode, getDocumentFormattingEditsWithSelectedProvider } from '../../../../../../editor/contrib/format/browser/format.js';
import { SnippetController2 } from '../../../../../../editor/contrib/snippet/browser/snippetController2.js';
import { localize } from '../../../../../../nls.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../../../platform/log/common/log.js';
import { IProgress, IProgressStep } from '../../../../../../platform/progress/common/progress.js';
import { Registry } from '../../../../../../platform/registry/common/platform.js';
import { IWorkspaceTrustManagementService } from '../../../../../../platform/workspace/common/workspaceTrust.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchContributionsExtensions } from '../../../../../common/contributions.js';
import { SaveReason } from '../../../../../common/editor.js';
import { getNotebookEditorFromEditorPane } from '../../notebookBrowser.js';
import { NotebookTextModel } from '../../../common/model/notebookTextModel.js';
import { CellKind, NotebookSetting } from '../../../common/notebookCommon.js';
import { NotebookFileWorkingCopyModel } from '../../../common/notebookEditorModel.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';
import { LifecyclePhase } from '../../../../../services/lifecycle/common/lifecycle.js';
import { IStoredFileWorkingCopy, IStoredFileWorkingCopyModel } from '../../../../../services/workingCopy/common/storedFileWorkingCopy.js';
import { IStoredFileWorkingCopySaveParticipant, IStoredFileWorkingCopySaveParticipantContext, IWorkingCopyFileService } from '../../../../../services/workingCopy/common/workingCopyFileService.js';
import { NotebookMultiCursorController, NotebookMultiCursorState } from '../multicursor/notebookMulticursor.js';

export abstract class NotebookSaveParticipant implements IStoredFileWorkingCopySaveParticipant {
	constructor(
		private readonly _editorService: IEditorService,
	) { }
	abstract participate(workingCopy: IStoredFileWorkingCopy<IStoredFileWorkingCopyModel>, context: IStoredFileWorkingCopySaveParticipantContext, progress: IProgress<IProgressStep>, token: CancellationToken): Promise<void>;

	protected canParticipate(): boolean {
		const editor = getNotebookEditorFromEditorPane(this._editorService.activeEditorPane);
		const controller = editor?.getContribution<NotebookMultiCursorController>(NotebookMultiCursorController.id);
		if (!controller) {
			return true;
		}

		return controller.getState() !== NotebookMultiCursorState.Editing;
	}
}

class FormatOnSaveParticipant implements IStoredFileWorkingCopySaveParticipant {
	constructor(
		@IEditorWorkerService private readonly editorWorkerService: IEditorWorkerService,
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@IBulkEditService private readonly bulkEditService: IBulkEditService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) { }

	async participate(workingCopy: IStoredFileWorkingCopy<IStoredFileWorkingCopyModel>, context: IStoredFileWorkingCopySaveParticipantContext, progress: IProgress<IProgressStep>, token: CancellationToken): Promise<void> {
		if (!workingCopy.model || !(workingCopy.model instanceof NotebookFileWorkingCopyModel)) {
			return;
		}

		if (context.reason === SaveReason.AUTO) {
			return undefined;
		}

		const enabled = this.configurationService.getValue<boolean>(NotebookSetting.formatOnSave);
		if (!enabled) {
			return undefined;
		}
		progress.report({ message: localize('notebookFormatSave.formatting', "Formatting") });

		const notebook = workingCopy.model.notebookModel;
		const formatApplied: boolean = await this.instantiationService.invokeFunction(CodeActionParticipantUtils.checkAndRunFormatCodeAction, notebook, progress, token);

		const disposable = new DisposableStore();
		try {
			if (!formatApplied) {
				const allCellEdits = await Promise.all(notebook.cells.map(async cell => {
					const ref = await this.textModelService.createModelReference(cell.uri);
					disposable.add(ref);

					const model = ref.object.textEditorModel;

					const formatEdits = await getDocumentFormattingEditsWithSelectedProvider(
						this.editorWorkerService,
						this.languageFeaturesService,
						model,
						FormattingMode.Silent,
						token
					);

					const edits: ResourceTextEdit[] = [];

					if (formatEdits) {
						edits.push(...formatEdits.map(edit => new ResourceTextEdit(model.uri, edit, model.getVersionId())));
						return edits;
					}

					return [];
				}));

				await this.bulkEditService.apply(/* edit */allCellEdits.flat(), { label: localize('formatNotebook', "Format Notebook"), code: 'undoredo.formatNotebook', });
			}
		} finally {
			progress.report({ increment: 100 });
			disposable.dispose();
		}
	}
}

class TrimWhitespaceParticipant extends NotebookSaveParticipant {

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IEditorService private readonly editorService: IEditorService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@IBulkEditService private readonly bulkEditService: IBulkEditService,
	) {
		super(editorService);
	}

	async participate(workingCopy: IStoredFileWorkingCopy<IStoredFileWorkingCopyModel>, context: IStoredFileWorkingCopySaveParticipantContext, progress: IProgress<IProgressStep>, _token: CancellationToken): Promise<void> {
		const trimTrailingWhitespaceOption = this.configurationService.getValue<boolean>('files.trimTrailingWhitespace');
		const trimInRegexAndStrings = this.configurationService.getValue<boolean>('files.trimTrailingWhitespaceInRegexAndStrings');
		if (trimTrailingWhitespaceOption && this.canParticipate()) {
			await this.doTrimTrailingWhitespace(workingCopy, context.reason === SaveReason.AUTO, trimInRegexAndStrings, progress);
		}
	}

	private async doTrimTrailingWhitespace(workingCopy: IStoredFileWorkingCopy<IStoredFileWorkingCopyModel>, isAutoSaved: boolean, trimInRegexesAndStrings: boolean, progress: IProgress<IProgressStep>) {
		if (!workingCopy.model || !(workingCopy.model instanceof NotebookFileWorkingCopyModel)) {
			return;
		}

		const disposable = new DisposableStore();
		const notebook = workingCopy.model.notebookModel;
		const activeCellEditor = getActiveCellCodeEditor(this.editorService);

		let cursors: Position[] = [];
		let prevSelection: Selection[] = [];
		try {
			const allCellEdits = await Promise.all(notebook.cells.map(async (cell) => {
				if (cell.cellKind !== CellKind.Code) {
					return [];
				}

				const ref = await this.textModelService.createModelReference(cell.uri);
				disposable.add(ref);
				const model = ref.object.textEditorModel;

				const isActiveCell = (activeCellEditor && cell.uri.toString() === activeCellEditor.getModel()?.uri.toString());
				if (isActiveCell) {
					prevSelection = activeCellEditor.getSelections() ?? [];
					if (isAutoSaved) {
						cursors = prevSelection.map(s => s.getPosition()); // get initial cursor positions
						const snippetsRange = SnippetController2.get(activeCellEditor)?.getSessionEnclosingRange();
						if (snippetsRange) {
							for (let lineNumber = snippetsRange.startLineNumber; lineNumber <= snippetsRange.endLineNumber; lineNumber++) {
								cursors.push(new Position(lineNumber, model.getLineMaxColumn(lineNumber)));
							}
						}
					}
				}

				const ops = trimTrailingWhitespace(model, cursors, trimInRegexesAndStrings);
				if (!ops.length) {
					return []; // Nothing to do
				}

				return ops.map(op => new ResourceTextEdit(model.uri, { ...op, text: op.text || '' }, model.getVersionId()));
			}));

			const filteredEdits = allCellEdits.flat().filter(edit => edit !== undefined) as ResourceEdit[];
			await this.bulkEditService.apply(filteredEdits, { label: localize('trimNotebookWhitespace', "Notebook Trim Trailing Whitespace"), code: 'undoredo.notebookTrimTrailingWhitespace' });

		} finally {
			progress.report({ increment: 100 });
			disposable.dispose();
		}
	}
}

class TrimFinalNewLinesParticipant extends NotebookSaveParticipant {

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IEditorService private readonly editorService: IEditorService,
		@IBulkEditService private readonly bulkEditService: IBulkEditService,
	) {
		super(editorService);
	}


	async participate(workingCopy: IStoredFileWorkingCopy<IStoredFileWorkingCopyModel>, context: IStoredFileWorkingCopySaveParticipantContext, progress: IProgress<IProgressStep>, _token: CancellationToken): Promise<void> {
		if (this.configurationService.getValue<boolean>('files.trimFinalNewlines') && this.canParticipate()) {
			await this.doTrimFinalNewLines(workingCopy, context.reason === SaveReason.AUTO, progress);
		}
	}

	/**
	 * returns 0 if the entire file is empty
	 */
	private findLastNonEmptyLine(textBuffer: IReadonlyTextBuffer): number {
		for (let lineNumber = textBuffer.getLineCount(); lineNumber >= 1; lineNumber--) {
			const lineLength = textBuffer.getLineLength(lineNumber);
			if (lineLength) {
				// this line has content
				return lineNumber;
			}
		}
		// no line has content
		return 0;
	}

	private async doTrimFinalNewLines(workingCopy: IStoredFileWorkingCopy<IStoredFileWorkingCopyModel>, isAutoSaved: boolean, progress: IProgress<IProgressStep>): Promise<void> {
		if (!workingCopy.model || !(workingCopy.model instanceof NotebookFileWorkingCopyModel)) {
			return;
		}

		const disposable = new DisposableStore();
		const notebook = workingCopy.model.notebookModel;
		const activeCellEditor = getActiveCellCodeEditor(this.editorService);

		try {
			const allCellEdits = await Promise.all(notebook.cells.map(async (cell) => {
				if (cell.cellKind !== CellKind.Code) {
					return;
				}

				// autosave -- don't trim every trailing line, just up to the cursor line
				let cannotTouchLineNumber = 0;
				const isActiveCell = (activeCellEditor && cell.uri.toString() === activeCellEditor.getModel()?.uri.toString());
				if (isAutoSaved && isActiveCell) {
					const selections = activeCellEditor.getSelections() ?? [];
					for (const sel of selections) {
						cannotTouchLineNumber = Math.max(cannotTouchLineNumber, sel.selectionStartLineNumber);
					}
				}

				const textBuffer = cell.textBuffer;
				const lastNonEmptyLine = this.findLastNonEmptyLine(textBuffer);
				const deleteFromLineNumber = Math.max(lastNonEmptyLine + 1, cannotTouchLineNumber + 1);
				if (deleteFromLineNumber > textBuffer.getLineCount()) {
					return;
				}

				const deletionRange = new Range(deleteFromLineNumber, 1, textBuffer.getLineCount(), textBuffer.getLineLastNonWhitespaceColumn(textBuffer.getLineCount()));
				if (deletionRange.isEmpty()) {
					return;
				}

				// create the edit to delete all lines in deletionRange
				return new ResourceTextEdit(cell.uri, { range: deletionRange, text: '' }, cell.textModel?.getVersionId());
			}));

			const filteredEdits = allCellEdits.flat().filter(edit => edit !== undefined) as ResourceEdit[];
			await this.bulkEditService.apply(filteredEdits, { label: localize('trimNotebookNewlines', "Trim Final New Lines"), code: 'undoredo.trimFinalNewLines' });

		} finally {
			progress.report({ increment: 100 });
			disposable.dispose();
		}
	}
}

class InsertFinalNewLineParticipant extends NotebookSaveParticipant {

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IBulkEditService private readonly bulkEditService: IBulkEditService,
		@IEditorService private readonly editorService: IEditorService,
	) {
		super(editorService);
	}

	async participate(workingCopy: IStoredFileWorkingCopy<IStoredFileWorkingCopyModel>, context: IStoredFileWorkingCopySaveParticipantContext, progress: IProgress<IProgressStep>, _token: CancellationToken): Promise<void> {
		// waiting on notebook-specific override before this feature can sync with 'files.insertFinalNewline'
		// if (this.configurationService.getValue('files.insertFinalNewline')) {

		if (this.configurationService.getValue<boolean>(NotebookSetting.insertFinalNewline) && this.canParticipate()) {
			await this.doInsertFinalNewLine(workingCopy, context.reason === SaveReason.AUTO, progress);
		}
	}

	private async doInsertFinalNewLine(workingCopy: IStoredFileWorkingCopy<IStoredFileWorkingCopyModel>, isAutoSaved: boolean, progress: IProgress<IProgressStep>): Promise<void> {
		if (!workingCopy.model || !(workingCopy.model instanceof NotebookFileWorkingCopyModel)) {
			return;
		}

		const disposable = new DisposableStore();
		const notebook = workingCopy.model.notebookModel;

		// get initial cursor positions
		const activeCellEditor = getActiveCellCodeEditor(this.editorService);
		let selections;
		if (activeCellEditor) {
			selections = activeCellEditor.getSelections() ?? [];
		}

		try {
			const allCellEdits = await Promise.all(notebook.cells.map(async (cell) => {
				if (cell.cellKind !== CellKind.Code) {
					return;
				}

				const lineCount = cell.textBuffer.getLineCount();
				const lastLineIsEmptyOrWhitespace = cell.textBuffer.getLineFirstNonWhitespaceColumn(lineCount) === 0;

				if (!lineCount || lastLineIsEmptyOrWhitespace) {
					return;
				}

				return new ResourceTextEdit(cell.uri, { range: new Range(lineCount + 1, cell.textBuffer.getLineLength(lineCount), lineCount + 1, cell.textBuffer.getLineLength(lineCount)), text: cell.textBuffer.getEOL() }, cell.textModel?.getVersionId());
			}));

			const filteredEdits = allCellEdits.filter(edit => edit !== undefined) as ResourceEdit[];
			await this.bulkEditService.apply(filteredEdits, { label: localize('insertFinalNewLine', "Insert Final New Line"), code: 'undoredo.insertFinalNewLine' });

			// set cursor back to initial position after inserting final new line
			if (activeCellEditor && selections) {
				activeCellEditor.setSelections(selections);
			}
		} finally {
			progress.report({ increment: 100 });
			disposable.dispose();
		}
	}
}

class CodeActionOnSaveParticipant implements IStoredFileWorkingCopySaveParticipant {
	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ILogService private readonly logService: ILogService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
	}

	async participate(workingCopy: IStoredFileWorkingCopy<IStoredFileWorkingCopyModel>, context: IStoredFileWorkingCopySaveParticipantContext, progress: IProgress<IProgressStep>, token: CancellationToken): Promise<void> {
		const isTrusted = this.workspaceTrustManagementService.isWorkspaceTrusted();
		if (!isTrusted) {
			return;
		}

		if (!workingCopy.model || !(workingCopy.model instanceof NotebookFileWorkingCopyModel)) {
			return;
		}

		let saveTrigger = '';
		if (context.reason === SaveReason.AUTO) {
			// currently this won't happen, as vs/editor/contrib/codeAction/browser/codeAction.ts L#104 filters out codeactions on autosave. Just future-proofing
			// ? notebook CodeActions on autosave seems dangerous (perf-wise)
			// saveTrigger = 'always'; // TODO@Yoyokrazy, support during debt
			return undefined;
		} else if (context.reason === SaveReason.EXPLICIT) {
			saveTrigger = 'explicit';
		} else {
			// 	SaveReason.FOCUS_CHANGE, WINDOW_CHANGE need to be addressed when autosaves are enabled
			return undefined;
		}

		const notebookModel = workingCopy.model.notebookModel;

		const setting = this.configurationService.getValue<{ [kind: string]: string | boolean }>(NotebookSetting.codeActionsOnSave);
		const settingItems: string[] = Array.isArray(setting)
			? setting
			: Object.keys(setting).filter(x => setting[x]);

		const allCodeActions = this.createCodeActionsOnSave(settingItems);
		const excludedActions = allCodeActions
			.filter(x => setting[x.value] === 'never' || setting[x.value] === false);
		const includedActions = allCodeActions
			.filter(x => setting[x.value] === saveTrigger || setting[x.value] === true);

		const editorCodeActionsOnSave = includedActions.filter(x => !CodeActionKind.Notebook.contains(x));
		const notebookCodeActionsOnSave = includedActions.filter(x => CodeActionKind.Notebook.contains(x));

		// run notebook code actions
		if (notebookCodeActionsOnSave.length) {
			const nbDisposable = new DisposableStore();
			progress.report({ message: localize('notebookSaveParticipants.notebookCodeActions', "Running 'Notebook' code actions") });
			try {
				const cell = notebookModel.cells[0];
				const ref = await this.textModelService.createModelReference(cell.uri);
				nbDisposable.add(ref);

				const textEditorModel = ref.object.textEditorModel;

				await this.instantiationService.invokeFunction(CodeActionParticipantUtils.applyOnSaveGenericCodeActions, textEditorModel, notebookCodeActionsOnSave, excludedActions, progress, token);
			} catch {
				this.logService.error('Failed to apply notebook code action on save');
			} finally {
				progress.report({ increment: 100 });
				nbDisposable.dispose();
			}
		}

		// run cell level code actions
		if (editorCodeActionsOnSave.length) {
			// prioritize `source.fixAll` code actions
			if (!Array.isArray(setting)) {
				editorCodeActionsOnSave.sort((a, b) => {
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

			const cellDisposable = new DisposableStore();
			progress.report({ message: localize('notebookSaveParticipants.cellCodeActions', "Running 'Cell' code actions") });
			try {
				await Promise.all(notebookModel.cells.map(async cell => {
					const ref = await this.textModelService.createModelReference(cell.uri);
					cellDisposable.add(ref);

					const textEditorModel = ref.object.textEditorModel;

					await this.instantiationService.invokeFunction(CodeActionParticipantUtils.applyOnSaveGenericCodeActions, textEditorModel, editorCodeActionsOnSave, excludedActions, progress, token);
				}));
			} catch {
				this.logService.error('Failed to apply code action on save');
			} finally {
				progress.report({ increment: 100 });
				cellDisposable.dispose();
			}
		}
	}

	private createCodeActionsOnSave(settingItems: readonly string[]): HierarchicalKind[] {
		const kinds = settingItems.map(x => new HierarchicalKind(x));

		// Remove subsets
		return kinds.filter(kind => {
			return kinds.every(otherKind => otherKind.equals(kind) || !otherKind.contains(kind));
		});
	}
}

export class CodeActionParticipantUtils {

	static async checkAndRunFormatCodeAction(
		accessor: ServicesAccessor,
		notebookModel: NotebookTextModel,
		progress: IProgress<IProgressStep>,
		token: CancellationToken): Promise<boolean> {

		const instantiationService: IInstantiationService = accessor.get(IInstantiationService);
		const textModelService: ITextModelService = accessor.get(ITextModelService);
		const logService: ILogService = accessor.get(ILogService);
		const configurationService: IConfigurationService = accessor.get(IConfigurationService);

		const formatDisposable = new DisposableStore();
		let formatResult: boolean = false;
		progress.report({ message: localize('notebookSaveParticipants.formatCodeActions', "Running 'Format' code actions") });
		try {
			const cell = notebookModel.cells[0];
			const ref = await textModelService.createModelReference(cell.uri);
			formatDisposable.add(ref);
			const textEditorModel = ref.object.textEditorModel;

			const defaultFormatterExtId = configurationService.getValue<string | undefined>(NotebookSetting.defaultFormatter);
			formatResult = await instantiationService.invokeFunction(CodeActionParticipantUtils.applyOnSaveFormatCodeAction, textEditorModel, new HierarchicalKind('notebook.format'), [], defaultFormatterExtId, progress, token);
		} catch {
			logService.error('Failed to apply notebook format action on save');
		} finally {
			progress.report({ increment: 100 });
			formatDisposable.dispose();
		}
		return formatResult;
	}

	static async applyOnSaveGenericCodeActions(
		accessor: ServicesAccessor,
		model: ITextModel,
		codeActionsOnSave: readonly HierarchicalKind[],
		excludes: readonly HierarchicalKind[],
		progress: IProgress<IProgressStep>,
		token: CancellationToken): Promise<void> {

		const instantiationService: IInstantiationService = accessor.get(IInstantiationService);
		const languageFeaturesService: ILanguageFeaturesService = accessor.get(ILanguageFeaturesService);
		const logService: ILogService = accessor.get(ILogService);

		const getActionProgress = new class implements IProgress<CodeActionProvider> {
			private _names = new Set<string>();
			private _report(): void {
				progress.report({
					message: localize(
						{ key: 'codeaction.get2', comment: ['[configure]({1}) is a link. Only translate `configure`. Do not change brackets and parentheses or {1}'] },
						"Getting code actions from '{0}' ([configure]({1})).",
						[...this._names].map(name => `'${name}'`).join(', '),
						'command:workbench.action.openSettings?%5B%22notebook.codeActionsOnSave%22%5D'
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
			const actionsToRun = await CodeActionParticipantUtils.getActionsToRun(model, codeActionKind, excludes, languageFeaturesService, getActionProgress, token);
			if (token.isCancellationRequested) {
				actionsToRun.dispose();
				return;
			}

			try {
				for (const action of actionsToRun.validActions) {
					const codeActionEdits = action.action.edit?.edits;
					let breakFlag = false;
					if (!action.action.kind?.startsWith('notebook')) {
						for (const edit of codeActionEdits ?? []) {
							const workspaceTextEdit = edit as IWorkspaceTextEdit;
							if (workspaceTextEdit.resource && isEqual(workspaceTextEdit.resource, model.uri)) {
								continue;
							} else {
								// error -> applied to multiple resources
								breakFlag = true;
								break;
							}
						}
					}
					if (breakFlag) {
						logService.warn('Failed to apply code action on save, applied to multiple resources.');
						continue;
					}
					progress.report({ message: localize('codeAction.apply', "Applying code action '{0}'.", action.action.title) });
					await instantiationService.invokeFunction(applyCodeAction, action, ApplyCodeActionReason.OnSave, {}, token);
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

	static async applyOnSaveFormatCodeAction(
		accessor: ServicesAccessor,
		model: ITextModel,
		formatCodeActionOnSave: HierarchicalKind,
		excludes: readonly HierarchicalKind[],
		extensionId: string | undefined,
		progress: IProgress<IProgressStep>,
		token: CancellationToken): Promise<boolean> {

		const instantiationService: IInstantiationService = accessor.get(IInstantiationService);
		const languageFeaturesService: ILanguageFeaturesService = accessor.get(ILanguageFeaturesService);
		const logService: ILogService = accessor.get(ILogService);

		const getActionProgress = new class implements IProgress<CodeActionProvider> {
			private _names = new Set<string>();
			private _report(): void {
				progress.report({
					message: localize(
						{ key: 'codeaction.get2', comment: ['[configure]({1}) is a link. Only translate `configure`. Do not change brackets and parentheses or {1}'] },
						"Getting code actions from '{0}' ([configure]({1})).",
						[...this._names].map(name => `'${name}'`).join(', '),
						'command:workbench.action.openSettings?%5B%22notebook.defaultFormatter%22%5D'
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

		const providedActions = await CodeActionParticipantUtils.getActionsToRun(model, formatCodeActionOnSave, excludes, languageFeaturesService, getActionProgress, token);
		// warn the user if there are more than one provided format action, and there is no specified defaultFormatter
		if (providedActions.validActions.length > 1 && !extensionId) {
			logService.warn('More than one format code action is provided, the 0th one will be used. A default can be specified via `notebook.defaultFormatter` in your settings.');
		}

		if (token.isCancellationRequested) {
			providedActions.dispose();
			return false;
		}

		try {
			const action: CodeActionItem | undefined = extensionId ? providedActions.validActions.find(action => action.provider?.extensionId === extensionId) : providedActions.validActions[0];
			if (!action) {
				return false;
			}

			progress.report({ message: localize('codeAction.apply', "Applying code action '{0}'.", action.action.title) });
			await instantiationService.invokeFunction(applyCodeAction, action, ApplyCodeActionReason.OnSave, {}, token);
			if (token.isCancellationRequested) {
				return false;
			}
		} catch {
			logService.error('Failed to apply notebook format code action on save');
			return false;
		} finally {
			providedActions.dispose();
		}
		return true;
	}

	// @Yoyokrazy this could likely be modified to leverage the extensionID, therefore not getting actions from providers unnecessarily -- future work
	static getActionsToRun(model: ITextModel, codeActionKind: HierarchicalKind, excludes: readonly HierarchicalKind[], languageFeaturesService: ILanguageFeaturesService, progress: IProgress<CodeActionProvider>, token: CancellationToken) {
		return getCodeActions(languageFeaturesService.codeActionProvider, model, model.getFullModelRange(), {
			type: CodeActionTriggerType.Invoke,
			triggerAction: CodeActionTriggerSource.OnSave,
			filter: { include: codeActionKind, excludes: excludes, includeSourceActions: true },
		}, progress, token);
	}

}

function getActiveCellCodeEditor(editorService: IEditorService): ICodeEditor | undefined {
	const activePane = editorService.activeEditorPane;
	const notebookEditor = getNotebookEditorFromEditorPane(activePane);
	const activeCodeEditor = notebookEditor?.activeCodeEditor;
	return activeCodeEditor;
}

export class SaveParticipantsContribution extends Disposable implements IWorkbenchContribution {
	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IWorkingCopyFileService private readonly workingCopyFileService: IWorkingCopyFileService) {

		super();
		this.registerSaveParticipants();
	}

	private registerSaveParticipants(): void {
		this._register(this.workingCopyFileService.addSaveParticipant(this.instantiationService.createInstance(TrimWhitespaceParticipant)));
		this._register(this.workingCopyFileService.addSaveParticipant(this.instantiationService.createInstance(CodeActionOnSaveParticipant)));
		this._register(this.workingCopyFileService.addSaveParticipant(this.instantiationService.createInstance(FormatOnSaveParticipant)));
		this._register(this.workingCopyFileService.addSaveParticipant(this.instantiationService.createInstance(InsertFinalNewLineParticipant)));
		this._register(this.workingCopyFileService.addSaveParticipant(this.instantiationService.createInstance(TrimFinalNewLinesParticipant)));
	}
}

const workbenchContributionsRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchContributionsExtensions.Workbench);
workbenchContributionsRegistry.registerWorkbenchContribution(SaveParticipantsContribution, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/troubleshoot/layout.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/troubleshoot/layout.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore, dispose, toDisposable } from '../../../../../../base/common/lifecycle.js';
import { localize2 } from '../../../../../../nls.js';
import { Categories } from '../../../../../../platform/action/common/actionCommonCategories.js';
import { Action2, registerAction2 } from '../../../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../../../platform/instantiation/common/instantiation.js';
import { getNotebookEditorFromEditorPane, ICellViewModel, INotebookDeltaCellStatusBarItems, INotebookEditor, INotebookEditorContribution } from '../../notebookBrowser.js';
import { registerNotebookContribution } from '../../notebookEditorExtensions.js';
import { NotebookEditorWidget } from '../../notebookEditorWidget.js';
import { CellStatusbarAlignment, INotebookCellStatusBarItem } from '../../../common/notebookCommon.js';
import { INotebookService } from '../../../common/notebookService.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';
import { n } from '../../../../../../base/browser/dom.js';

export class TroubleshootController extends Disposable implements INotebookEditorContribution {
	static id: string = 'workbench.notebook.troubleshoot';

	private readonly _localStore = this._register(new DisposableStore());
	private _cellDisposables: DisposableStore[] = [];
	private _enabled: boolean = false;
	private _cellStatusItems: string[] = [];
	private _notebookOverlayDomNode: HTMLElement | undefined;

	constructor(private readonly _notebookEditor: INotebookEditor) {
		super();

		this._register(this._notebookEditor.onDidChangeModel(() => {
			this._update();
		}));

		this._update();
	}

	toggle(): void {
		this._enabled = !this._enabled;
		this._update();
	}

	private _update() {
		this._localStore.clear();
		this._cellDisposables.forEach(d => d.dispose());
		this._cellDisposables = [];
		this._removeNotebookOverlay();

		if (!this._notebookEditor.hasModel()) {
			return;
		}

		if (this._enabled) {
			this._updateListener();
			this._createNotebookOverlay();
			this._createCellOverlays();
		}
	}

	private _log(cell: ICellViewModel, e: any) {
		if (this._enabled) {
			const oldHeight = (this._notebookEditor as NotebookEditorWidget).getViewHeight(cell);
			console.log(`cell#${cell.handle}`, e, `${oldHeight} -> ${cell.layoutInfo.totalHeight}`);
		}
	}

	private _createCellOverlays() {
		if (!this._notebookEditor.hasModel()) {
			return;
		}

		for (let i = 0; i < this._notebookEditor.getLength(); i++) {
			const cell = this._notebookEditor.cellAt(i);
			this._createCellOverlay(cell, i);
		}

		// Add listener for new cells
		this._localStore.add(this._notebookEditor.onDidChangeViewCells(e => {
			const addedCells = e.splices.reduce((acc, [, , newCells]) => [...acc, ...newCells], [] as ICellViewModel[]);
			for (let i = 0; i < addedCells.length; i++) {
				const cellIndex = this._notebookEditor.getCellIndex(addedCells[i]);
				if (cellIndex !== undefined) {
					this._createCellOverlay(addedCells[i], cellIndex);
				}
			}
		}));
	}

	private _createNotebookOverlay() {
		if (!this._notebookEditor.hasModel()) {
			return;
		}

		const listViewTop = this._notebookEditor.getLayoutInfo().listViewOffsetTop;
		const scrollTop = this._notebookEditor.scrollTop;

		const overlay = n.div({
			style: {
				position: 'absolute',
				top: '0',
				left: '0',
				width: '100%',
				height: '100%',
				pointerEvents: 'none',
				zIndex: '1000'
			}
		}, [
			// Top line
			n.div({
				style: {
					position: 'absolute',
					top: `${listViewTop}px`,
					left: '0',
					width: '100%',
					height: '2px',
					backgroundColor: 'rgba(0, 0, 255, 0.7)'
				}
			}),
			// Text label for the notebook overlay
			n.div({
				style: {
					position: 'absolute',
					top: `${listViewTop}px`,
					left: '10px',
					backgroundColor: 'rgba(0, 0, 255, 0.7)',
					color: 'white',
					fontSize: '11px',
					fontWeight: 'bold',
					padding: '2px 6px',
					borderRadius: '3px',
					whiteSpace: 'nowrap',
					pointerEvents: 'none',
					zIndex: '1001'
				}
			}, [`ScrollTop: ${scrollTop}px`])
		]).keepUpdated(this._store);

		this._notebookOverlayDomNode = overlay.element;

		if (this._notebookOverlayDomNode) {
			this._notebookEditor.getDomNode().appendChild(this._notebookOverlayDomNode);
		}

		this._localStore.add(this._notebookEditor.onDidScroll(() => {
			const scrollTop = this._notebookEditor.scrollTop;
			const listViewTop = this._notebookEditor.getLayoutInfo().listViewOffsetTop;

			if (this._notebookOverlayDomNode) {
				// Update label
				// eslint-disable-next-line no-restricted-syntax
				const labelElement = this._notebookOverlayDomNode.querySelector('div:nth-child(2)') as HTMLElement;
				if (labelElement) {
					labelElement.textContent = `ScrollTop: ${scrollTop}px`;
					labelElement.style.top = `${listViewTop}px`;
				}

				// Update top line
				// eslint-disable-next-line no-restricted-syntax
				const topLineElement = this._notebookOverlayDomNode.querySelector('div:first-child') as HTMLElement;
				if (topLineElement) {
					topLineElement.style.top = `${listViewTop}px`;
				}
			}
		}));
	}

	private _createCellOverlay(cell: ICellViewModel, index: number) {
		const overlayContainer = document.createElement('div');
		overlayContainer.style.position = 'absolute';
		overlayContainer.style.top = '0';
		overlayContainer.style.left = '0';
		overlayContainer.style.width = '100%';
		overlayContainer.style.height = '100%';
		overlayContainer.style.pointerEvents = 'none';
		overlayContainer.style.zIndex = '1000';
		const topLine = document.createElement('div');
		topLine.style.position = 'absolute';
		topLine.style.top = '0';
		topLine.style.left = '0';
		topLine.style.width = '100%';
		topLine.style.height = '2px';
		topLine.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
		overlayContainer.appendChild(topLine);

		const getLayoutInfo = () => {
			const eol = cell.textBuffer.getEOL() === '\n' ? 'LF' : 'CRLF';
			let scrollTop = '';
			if (cell.layoutInfo.layoutState > 0) {
				scrollTop = `| AbsoluteTopOfElement: ${this._notebookEditor.getAbsoluteTopOfElement(cell)}px`;
			}
			return `cell #${index} (handle: ${cell.handle}) ${scrollTop} | EOL: ${eol}`;
		};
		const label = document.createElement('div');
		label.textContent = getLayoutInfo();
		label.style.position = 'absolute';
		label.style.top = '0px';
		label.style.right = '10px';
		label.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
		label.style.color = 'white';
		label.style.fontSize = '11px';
		label.style.fontWeight = 'bold';
		label.style.padding = '2px 6px';
		label.style.borderRadius = '3px';
		label.style.whiteSpace = 'nowrap';
		label.style.pointerEvents = 'none';
		label.style.zIndex = '1001';
		overlayContainer.appendChild(label);

		let overlayId: string | undefined = undefined;
		this._notebookEditor.changeCellOverlays((accessor) => {
			overlayId = accessor.addOverlay({
				cell,
				domNode: overlayContainer
			});
		});

		if (overlayId) {

			// Update overlay when layout changes
			const updateLayout = () => {
				// Update label text
				label.textContent = getLayoutInfo();

				// Refresh the overlay position
				if (overlayId) {
					this._notebookEditor.changeCellOverlays((accessor) => {
						accessor.layoutOverlay(overlayId!);
					});
				}
			};

			const disposables = this._cellDisposables[index];
			disposables.add(cell.onDidChangeLayout((e) => {
				updateLayout();
			}));
			disposables.add(cell.textBuffer.onDidChangeContent(() => {
				updateLayout();
			}));
			if (cell.textModel) {
				disposables.add(cell.textModel.onDidChangeContent(() => {
					updateLayout();
				}));
			}
			disposables.add(this._notebookEditor.onDidChangeLayout(() => {
				updateLayout();
			}));
			disposables.add(toDisposable(() => {
				this._notebookEditor.changeCellOverlays((accessor) => {
					if (overlayId) {
						accessor.removeOverlay(overlayId);
					}
				});
			}));
		}

	}

	private _removeNotebookOverlay() {
		if (this._notebookOverlayDomNode) {
			this._notebookOverlayDomNode.remove();
			this._notebookOverlayDomNode = undefined;
		}
	}

	private _updateListener() {
		if (!this._notebookEditor.hasModel()) {
			return;
		}

		for (let i = 0; i < this._notebookEditor.getLength(); i++) {
			const cell = this._notebookEditor.cellAt(i);

			const disposableStore = new DisposableStore();
			this._cellDisposables.push(disposableStore);
			disposableStore.add(cell.onDidChangeLayout(e => {
				this._log(cell, e);
			}));
		}

		this._localStore.add(this._notebookEditor.onDidChangeViewCells(e => {
			[...e.splices].reverse().forEach(splice => {
				const [start, deleted, newCells] = splice;
				const deletedCells = this._cellDisposables.splice(start, deleted, ...newCells.map(cell => {
					const disposableStore = new DisposableStore();
					disposableStore.add(cell.onDidChangeLayout(e => {
						this._log(cell, e);
					}));
					return disposableStore;
				}));

				dispose(deletedCells);
			});

			// Add the overlays
			const addedCells = e.splices.reduce((acc, [, , newCells]) => [...acc, ...newCells], [] as ICellViewModel[]);
			for (let i = 0; i < addedCells.length; i++) {
				const cellIndex = this._notebookEditor.getCellIndex(addedCells[i]);
				if (cellIndex !== undefined) {
					this._createCellOverlay(addedCells[i], cellIndex);
				}
			}
		}));

		const vm = this._notebookEditor.getViewModel();
		let items: INotebookDeltaCellStatusBarItems[] = [];

		if (this._enabled) {
			items = this._getItemsForCells();
		}

		this._cellStatusItems = vm.deltaCellStatusBarItems(this._cellStatusItems, items);

	}

	private _getItemsForCells(): INotebookDeltaCellStatusBarItems[] {
		const items: INotebookDeltaCellStatusBarItems[] = [];
		for (let i = 0; i < this._notebookEditor.getLength(); i++) {
			items.push({
				handle: i,
				items: [
					{
						text: `index: ${i}`,
						alignment: CellStatusbarAlignment.Left,
						priority: Number.MAX_SAFE_INTEGER
					} satisfies INotebookCellStatusBarItem
				]
			});
		}

		return items;
	}

	override dispose() {
		dispose(this._cellDisposables);
		this._removeNotebookOverlay();
		this._localStore.clear();
		super.dispose();
	}
}

registerNotebookContribution(TroubleshootController.id, TroubleshootController);

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'notebook.toggleLayoutTroubleshoot',
			title: localize2('workbench.notebook.toggleLayoutTroubleshoot', "Toggle Notebook Layout Troubleshoot"),
			category: Categories.Developer,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);

		if (!editor) {
			return;
		}

		const controller = editor.getContribution<TroubleshootController>(TroubleshootController.id);
		controller?.toggle();
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'notebook.inspectLayout',
			title: localize2('workbench.notebook.inspectLayout', "Inspect Notebook Layout"),
			category: Categories.Developer,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);

		if (!editor || !editor.hasModel()) {
			return;
		}

		for (let i = 0; i < editor.getLength(); i++) {
			const cell = editor.cellAt(i);
			console.log(`cell#${cell.handle}`, cell.layoutInfo);
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'notebook.clearNotebookEdtitorTypeCache',
			title: localize2('workbench.notebook.clearNotebookEdtitorTypeCache', "Clear Notebook Editor Type Cache"),
			category: Categories.Developer,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const notebookService = accessor.get(INotebookService);
		notebookService.clearEditorCache();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/undoRedo/notebookUndoRedo.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/undoRedo/notebookUndoRedo.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../../../common/contributions.js';
import { CellKind } from '../../../common/notebookCommon.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';
import { CellEditState, getNotebookEditorFromEditorPane } from '../../notebookBrowser.js';
import { RedoCommand, UndoCommand } from '../../../../../../editor/browser/editorExtensions.js';
import { NotebookViewModel } from '../../viewModel/notebookViewModelImpl.js';

class NotebookUndoRedoContribution extends Disposable {

	static readonly ID = 'workbench.contrib.notebookUndoRedo';

	constructor(@IEditorService private readonly _editorService: IEditorService) {
		super();

		const PRIORITY = 105;
		this._register(UndoCommand.addImplementation(PRIORITY, 'notebook-undo-redo', () => {
			const editor = getNotebookEditorFromEditorPane(this._editorService.activeEditorPane);
			const viewModel = editor?.getViewModel() as NotebookViewModel | undefined;
			if (editor && editor.hasEditorFocus() && editor.hasModel() && viewModel) {
				return viewModel.undo().then(cellResources => {
					if (cellResources?.length) {
						for (let i = 0; i < editor.getLength(); i++) {
							const cell = editor.cellAt(i);
							if (cell.cellKind === CellKind.Markup && cellResources.find(resource => resource.fragment === cell.model.uri.fragment)) {
								cell.updateEditState(CellEditState.Editing, 'undo');
							}
						}

						editor?.setOptions({ cellOptions: { resource: cellResources[0] }, preserveFocus: true });
					}
				});
			}

			return false;
		}));

		this._register(RedoCommand.addImplementation(PRIORITY, 'notebook-undo-redo', () => {
			const editor = getNotebookEditorFromEditorPane(this._editorService.activeEditorPane);
			const viewModel = editor?.getViewModel() as NotebookViewModel | undefined;

			if (editor && editor.hasEditorFocus() && editor.hasModel() && viewModel) {
				return viewModel.redo().then(cellResources => {
					if (cellResources?.length) {
						for (let i = 0; i < editor.getLength(); i++) {
							const cell = editor.cellAt(i);
							if (cell.cellKind === CellKind.Markup && cellResources.find(resource => resource.fragment === cell.model.uri.fragment)) {
								cell.updateEditState(CellEditState.Editing, 'redo');
							}
						}

						editor?.setOptions({ cellOptions: { resource: cellResources[0] }, preserveFocus: true });
					}
				});
			}

			return false;
		}));
	}
}

registerWorkbenchContribution2(NotebookUndoRedoContribution.ID, NotebookUndoRedoContribution, WorkbenchPhase.BlockRestore);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/viewportWarmup/viewportWarmup.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/viewportWarmup/viewportWarmup.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../../../../base/common/async.js';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { IAccessibilityService } from '../../../../../../platform/accessibility/common/accessibility.js';
import { CellEditState, IInsetRenderOutput, INotebookEditor, INotebookEditorContribution, INotebookEditorDelegate, RenderOutputType } from '../../notebookBrowser.js';
import { registerNotebookContribution } from '../../notebookEditorExtensions.js';
import { CodeCellViewModel, outputDisplayLimit } from '../../viewModel/codeCellViewModel.js';
import { CellKind } from '../../../common/notebookCommon.js';
import { cellRangesToIndexes } from '../../../common/notebookRange.js';
import { INotebookService } from '../../../common/notebookService.js';

class NotebookViewportContribution extends Disposable implements INotebookEditorContribution {
	static id: string = 'workbench.notebook.viewportWarmup';
	private readonly _warmupViewport: RunOnceScheduler;
	private readonly _warmupDocument: RunOnceScheduler | null = null;

	constructor(
		private readonly _notebookEditor: INotebookEditor,
		@INotebookService private readonly _notebookService: INotebookService,
		@IAccessibilityService accessibilityService: IAccessibilityService,
	) {
		super();

		this._warmupViewport = new RunOnceScheduler(() => this._warmupViewportNow(), 200);
		this._register(this._warmupViewport);
		this._register(this._notebookEditor.onDidScroll(() => {
			this._warmupViewport.schedule();
		}));

		this._warmupDocument = new RunOnceScheduler(() => this._warmupDocumentNow(), 200);
		this._register(this._warmupDocument);
		this._register(this._notebookEditor.onDidAttachViewModel(() => {
			if (this._notebookEditor.hasModel()) {
				this._warmupDocument?.schedule();
			}
		}));

		if (this._notebookEditor.hasModel()) {
			this._warmupDocument?.schedule();
		}
	}

	private _warmupDocumentNow() {
		if (this._notebookEditor.hasModel()) {
			for (let i = 0; i < this._notebookEditor.getLength(); i++) {
				const cell = this._notebookEditor.cellAt(i);

				if (cell?.cellKind === CellKind.Markup && cell?.getEditState() === CellEditState.Preview && !cell.isInputCollapsed) {
					// TODO@rebornix currently we disable markdown cell rendering in webview for accessibility
					// this._notebookEditor.createMarkupPreview(cell);
				} else if (cell?.cellKind === CellKind.Code) {
					this._warmupCodeCell((cell as CodeCellViewModel));
				}
			}
		}
	}

	private _warmupViewportNow() {
		if (this._notebookEditor.isDisposed) {
			return;
		}

		if (!this._notebookEditor.hasModel()) {
			return;
		}

		const visibleRanges = this._notebookEditor.getVisibleRangesPlusViewportAboveAndBelow();
		cellRangesToIndexes(visibleRanges).forEach(index => {
			const cell = this._notebookEditor.cellAt(index);

			if (cell?.cellKind === CellKind.Markup && cell?.getEditState() === CellEditState.Preview && !cell.isInputCollapsed) {
				(this._notebookEditor as INotebookEditorDelegate).createMarkupPreview(cell);
			} else if (cell?.cellKind === CellKind.Code) {
				this._warmupCodeCell((cell as CodeCellViewModel));
			}
		});
	}

	private _warmupCodeCell(viewCell: CodeCellViewModel) {
		if (viewCell.isOutputCollapsed) {
			return;
		}

		const outputs = viewCell.outputsViewModels;
		for (const output of outputs.slice(0, outputDisplayLimit)) {
			const [mimeTypes, pick] = output.resolveMimeTypes(this._notebookEditor.textModel!, undefined);
			if (!mimeTypes.find(mimeType => mimeType.isTrusted) || mimeTypes.length === 0) {
				continue;
			}

			const pickedMimeTypeRenderer = mimeTypes[pick];

			if (!pickedMimeTypeRenderer) {
				return;
			}

			if (!this._notebookEditor.hasModel()) {
				return;
			}

			const renderer = this._notebookService.getRendererInfo(pickedMimeTypeRenderer.rendererId);

			if (!renderer) {
				return;
			}

			const result: IInsetRenderOutput = { type: RenderOutputType.Extension, renderer, source: output, mimeType: pickedMimeTypeRenderer.mimeType };
			this._notebookEditor.createOutput(viewCell, result, 0, true);
		}

	}
}

registerNotebookContribution(NotebookViewportContribution.id, NotebookViewportContribution);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/controller/apiActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/controller/apiActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as glob from '../../../../../base/common/glob.js';
import { URI, UriComponents } from '../../../../../base/common/uri.js';
import { CommandsRegistry } from '../../../../../platform/commands/common/commands.js';
import { isDocumentExcludePattern, TransientCellMetadata, TransientDocumentMetadata } from '../../common/notebookCommon.js';
import { INotebookKernelService } from '../../common/notebookKernelService.js';
import { INotebookService } from '../../common/notebookService.js';

CommandsRegistry.registerCommand('_resolveNotebookContentProvider', (accessor): {
	viewType: string;
	displayName: string;
	options: { transientOutputs: boolean; transientCellMetadata: TransientCellMetadata; transientDocumentMetadata: TransientDocumentMetadata };
	filenamePattern: (string | glob.IRelativePattern | { include: string | glob.IRelativePattern; exclude: string | glob.IRelativePattern })[];
}[] => {
	const notebookService = accessor.get<INotebookService>(INotebookService);
	const contentProviders = notebookService.getContributedNotebookTypes();
	return contentProviders.map(provider => {
		const filenamePatterns = provider.selectors.map(selector => {
			if (typeof selector === 'string') {
				return selector;
			}

			if (glob.isRelativePattern(selector)) {
				return selector;
			}

			if (isDocumentExcludePattern(selector)) {
				return {
					include: selector.include,
					exclude: selector.exclude
				};
			}

			return null;
		}).filter(pattern => pattern !== null) as (string | glob.IRelativePattern | { include: string | glob.IRelativePattern; exclude: string | glob.IRelativePattern })[];

		return {
			viewType: provider.id,
			displayName: provider.displayName,
			filenamePattern: filenamePatterns,
			options: {
				transientCellMetadata: provider.options.transientCellMetadata,
				transientDocumentMetadata: provider.options.transientDocumentMetadata,
				transientOutputs: provider.options.transientOutputs
			}
		};
	});
});

CommandsRegistry.registerCommand('_resolveNotebookKernels', async (accessor, args: {
	viewType: string;
	uri: UriComponents;
}): Promise<{
	id?: string;
	label: string;
	description?: string;
	detail?: string;
	isPreferred?: boolean;
	preloads?: URI[];
}[]> => {
	const notebookKernelService = accessor.get(INotebookKernelService);
	const uri = URI.revive(args.uri as UriComponents);
	const kernels = notebookKernelService.getMatchingKernel({ uri, notebookType: args.viewType });

	return kernels.all.map(provider => ({
		id: provider.id,
		label: provider.label,
		description: provider.description,
		detail: provider.detail,
		isPreferred: false, // todo@jrieken,@rebornix
		preloads: provider.preloadUris,
	}));
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/controller/cellOperations.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/controller/cellOperations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IBulkEditService, ResourceEdit, ResourceTextEdit } from '../../../../../editor/browser/services/bulkEditService.js';
import { IPosition, Position } from '../../../../../editor/common/core/position.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { EndOfLinePreference, IReadonlyTextBuffer } from '../../../../../editor/common/model.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../../editor/common/languages/modesRegistry.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { ResourceNotebookCellEdit } from '../../../bulkEdit/browser/bulkCellEdits.js';
import { INotebookActionContext, INotebookCellActionContext } from './coreActions.js';
import { CellEditState, CellFocusMode, expandCellRangesWithHiddenCells, IActiveNotebookEditor, ICellViewModel } from '../notebookBrowser.js';
import { CellViewModel, NotebookViewModel } from '../viewModel/notebookViewModelImpl.js';
import { cloneNotebookCellTextModel } from '../../common/model/notebookCellTextModel.js';
import { CellEditType, CellKind, ICellEditOperation, ICellReplaceEdit, IOutputDto, ISelectionState, NotebookCellMetadata, SelectionStateType } from '../../common/notebookCommon.js';
import { cellRangeContains, cellRangesToIndexes, ICellRange } from '../../common/notebookRange.js';
import { localize } from '../../../../../nls.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { INotebookKernelHistoryService } from '../../common/notebookKernelService.js';

export async function changeCellToKind(kind: CellKind, context: INotebookActionContext, language?: string, mime?: string): Promise<void> {
	const { notebookEditor } = context;
	if (!notebookEditor.hasModel()) {
		return;
	}

	if (notebookEditor.isReadOnly) {
		return;
	}

	if (context.ui && context.cell) {
		// action from UI
		const { cell } = context;

		if (cell.cellKind === kind) {
			return;
		}

		const text = cell.getText();
		const idx = notebookEditor.getCellIndex(cell);

		if (language === undefined) {
			const availableLanguages = notebookEditor.activeKernel?.supportedLanguages ?? [];
			language = availableLanguages[0] ?? PLAINTEXT_LANGUAGE_ID;
		}

		notebookEditor.textModel.applyEdits([
			{
				editType: CellEditType.Replace,
				index: idx,
				count: 1,
				cells: [{
					cellKind: kind,
					source: text,
					language: language,
					mime: mime ?? cell.mime,
					outputs: cell.model.outputs,
					metadata: cell.metadata,
				}]
			}
		], true, {
			kind: SelectionStateType.Index,
			focus: notebookEditor.getFocus(),
			selections: notebookEditor.getSelections()
		}, () => {
			return {
				kind: SelectionStateType.Index,
				focus: notebookEditor.getFocus(),
				selections: notebookEditor.getSelections()
			};
		}, undefined, true);
		const newCell = notebookEditor.cellAt(idx);
		await notebookEditor.focusNotebookCell(newCell, cell.getEditState() === CellEditState.Editing ? 'editor' : 'container');
	} else if (context.selectedCells) {
		const selectedCells = context.selectedCells;
		const rawEdits: ICellEditOperation[] = [];

		selectedCells.forEach(cell => {
			if (cell.cellKind === kind) {
				return;
			}
			const text = cell.getText();
			const idx = notebookEditor.getCellIndex(cell);

			if (language === undefined) {
				const availableLanguages = notebookEditor.activeKernel?.supportedLanguages ?? [];
				language = availableLanguages[0] ?? PLAINTEXT_LANGUAGE_ID;
			}

			rawEdits.push(
				{
					editType: CellEditType.Replace,
					index: idx,
					count: 1,
					cells: [{
						cellKind: kind,
						source: text,
						language: language,
						mime: mime ?? cell.mime,
						outputs: cell.model.outputs,
						metadata: cell.metadata,
					}]
				}
			);
		});

		notebookEditor.textModel.applyEdits(rawEdits, true, {
			kind: SelectionStateType.Index,
			focus: notebookEditor.getFocus(),
			selections: notebookEditor.getSelections()
		}, () => {
			return {
				kind: SelectionStateType.Index,
				focus: notebookEditor.getFocus(),
				selections: notebookEditor.getSelections()
			};
		}, undefined, true);
	}
}

export function runDeleteAction(editor: IActiveNotebookEditor, cell: ICellViewModel) {
	const textModel = editor.textModel;
	const selections = editor.getSelections();
	const targetCellIndex = editor.getCellIndex(cell);
	const containingSelection = selections.find(selection => selection.start <= targetCellIndex && targetCellIndex < selection.end);

	const computeUndoRedo = !editor.isReadOnly || textModel.viewType === 'interactive';
	if (containingSelection) {
		const edits: ICellReplaceEdit[] = selections.reverse().map(selection => ({
			editType: CellEditType.Replace, index: selection.start, count: selection.end - selection.start, cells: []
		}));

		const nextCellAfterContainingSelection = containingSelection.end >= editor.getLength() ? undefined : editor.cellAt(containingSelection.end);

		textModel.applyEdits(edits, true, { kind: SelectionStateType.Index, focus: editor.getFocus(), selections: editor.getSelections() }, () => {
			if (nextCellAfterContainingSelection) {
				const cellIndex = textModel.cells.findIndex(cell => cell.handle === nextCellAfterContainingSelection.handle);
				return { kind: SelectionStateType.Index, focus: { start: cellIndex, end: cellIndex + 1 }, selections: [{ start: cellIndex, end: cellIndex + 1 }] };
			} else {
				if (textModel.length) {
					const lastCellIndex = textModel.length - 1;
					return { kind: SelectionStateType.Index, focus: { start: lastCellIndex, end: lastCellIndex + 1 }, selections: [{ start: lastCellIndex, end: lastCellIndex + 1 }] };

				} else {
					return { kind: SelectionStateType.Index, focus: { start: 0, end: 0 }, selections: [{ start: 0, end: 0 }] };
				}
			}
		}, undefined, computeUndoRedo);
	} else {
		const focus = editor.getFocus();
		const edits: ICellReplaceEdit[] = [{
			editType: CellEditType.Replace, index: targetCellIndex, count: 1, cells: []
		}];

		const finalSelections: ICellRange[] = [];
		for (let i = 0; i < selections.length; i++) {
			const selection = selections[i];

			if (selection.end <= targetCellIndex) {
				finalSelections.push(selection);
			} else if (selection.start > targetCellIndex) {
				finalSelections.push({ start: selection.start - 1, end: selection.end - 1 });
			} else {
				finalSelections.push({ start: targetCellIndex, end: targetCellIndex + 1 });
			}
		}

		if (editor.cellAt(focus.start) === cell) {
			// focus is the target, focus is also not part of any selection
			const newFocus = focus.end === textModel.length ? { start: focus.start - 1, end: focus.end - 1 } : focus;

			textModel.applyEdits(edits, true, { kind: SelectionStateType.Index, focus: editor.getFocus(), selections: editor.getSelections() }, () => ({
				kind: SelectionStateType.Index, focus: newFocus, selections: finalSelections
			}), undefined, computeUndoRedo);
		} else {
			// users decide to delete a cell out of current focus/selection
			const newFocus = focus.start > targetCellIndex ? { start: focus.start - 1, end: focus.end - 1 } : focus;

			textModel.applyEdits(edits, true, { kind: SelectionStateType.Index, focus: editor.getFocus(), selections: editor.getSelections() }, () => ({
				kind: SelectionStateType.Index, focus: newFocus, selections: finalSelections
			}), undefined, computeUndoRedo);
		}
	}
}

export async function moveCellRange(context: INotebookActionContext, direction: 'up' | 'down'): Promise<void> {
	if (!context.notebookEditor.hasModel()) {
		return;
	}
	const editor = context.notebookEditor;
	const textModel = editor.textModel;

	if (editor.isReadOnly) {
		return;
	}

	let range: ICellRange | undefined = undefined;

	if (context.cell) {
		const idx = editor.getCellIndex(context.cell);
		range = { start: idx, end: idx + 1 };
	} else {
		const selections = editor.getSelections();
		const modelRanges = expandCellRangesWithHiddenCells(editor, selections);
		range = modelRanges[0];
	}

	if (!range || range.start === range.end) {
		return;
	}

	if (direction === 'up') {
		if (range.start === 0) {
			return;
		}

		const indexAbove = range.start - 1;
		const finalSelection = { start: range.start - 1, end: range.end - 1 };
		const focus = context.notebookEditor.getFocus();
		const newFocus = cellRangeContains(range, focus) ? { start: focus.start - 1, end: focus.end - 1 } : { start: range.start - 1, end: range.start };
		textModel.applyEdits([
			{
				editType: CellEditType.Move,
				index: indexAbove,
				length: 1,
				newIdx: range.end - 1
			}],
			true,
			{
				kind: SelectionStateType.Index,
				focus: editor.getFocus(),
				selections: editor.getSelections()
			},
			() => ({ kind: SelectionStateType.Index, focus: newFocus, selections: [finalSelection] }),
			undefined,
			true
		);
		const focusRange = editor.getSelections()[0] ?? editor.getFocus();
		editor.revealCellRangeInView(focusRange);
	} else {
		if (range.end >= textModel.length) {
			return;
		}

		const indexBelow = range.end;
		const finalSelection = { start: range.start + 1, end: range.end + 1 };
		const focus = editor.getFocus();
		const newFocus = cellRangeContains(range, focus) ? { start: focus.start + 1, end: focus.end + 1 } : { start: range.start + 1, end: range.start + 2 };

		textModel.applyEdits([
			{
				editType: CellEditType.Move,
				index: indexBelow,
				length: 1,
				newIdx: range.start
			}],
			true,
			{
				kind: SelectionStateType.Index,
				focus: editor.getFocus(),
				selections: editor.getSelections()
			},
			() => ({ kind: SelectionStateType.Index, focus: newFocus, selections: [finalSelection] }),
			undefined,
			true
		);

		const focusRange = editor.getSelections()[0] ?? editor.getFocus();
		editor.revealCellRangeInView(focusRange);
	}
}

export async function copyCellRange(context: INotebookCellActionContext, direction: 'up' | 'down'): Promise<void> {
	const editor = context.notebookEditor;
	if (!editor.hasModel()) {
		return;
	}

	const textModel = editor.textModel;

	if (editor.isReadOnly) {
		return;
	}

	let range: ICellRange | undefined = undefined;

	if (context.ui) {
		const targetCell = context.cell;
		const targetCellIndex = editor.getCellIndex(targetCell);
		range = { start: targetCellIndex, end: targetCellIndex + 1 };
	} else {
		const selections = editor.getSelections();
		const modelRanges = expandCellRangesWithHiddenCells(editor, selections);
		range = modelRanges[0];
	}

	if (!range || range.start === range.end) {
		return;
	}

	if (direction === 'up') {
		// insert up, without changing focus and selections
		const focus = editor.getFocus();
		const selections = editor.getSelections();
		textModel.applyEdits([
			{
				editType: CellEditType.Replace,
				index: range.end,
				count: 0,
				cells: cellRangesToIndexes([range]).map(index => cloneNotebookCellTextModel(editor.cellAt(index)!.model))
			}],
			true,
			{
				kind: SelectionStateType.Index,
				focus: focus,
				selections: selections
			},
			() => ({ kind: SelectionStateType.Index, focus: focus, selections: selections }),
			undefined,
			true
		);
	} else {
		// insert down, move selections
		const focus = editor.getFocus();
		const selections = editor.getSelections();
		const newCells = cellRangesToIndexes([range]).map(index => cloneNotebookCellTextModel(editor.cellAt(index)!.model));
		const countDelta = newCells.length;
		const newFocus = context.ui ? focus : { start: focus.start + countDelta, end: focus.end + countDelta };
		const newSelections = context.ui ? selections : [{ start: range.start + countDelta, end: range.end + countDelta }];
		textModel.applyEdits([
			{
				editType: CellEditType.Replace,
				index: range.end,
				count: 0,
				cells: cellRangesToIndexes([range]).map(index => cloneNotebookCellTextModel(editor.cellAt(index)!.model))
			}],
			true,
			{
				kind: SelectionStateType.Index,
				focus: focus,
				selections: selections
			},
			() => ({ kind: SelectionStateType.Index, focus: newFocus, selections: newSelections }),
			undefined,
			true
		);

		const focusRange = editor.getSelections()[0] ?? editor.getFocus();
		editor.revealCellRangeInView(focusRange);
	}
}

export async function joinSelectedCells(bulkEditService: IBulkEditService, notificationService: INotificationService, context: INotebookCellActionContext): Promise<void> {
	const editor = context.notebookEditor;
	if (editor.isReadOnly) {
		return;
	}

	const edits: ResourceEdit[] = [];
	const cells: ICellViewModel[] = [];
	for (const selection of editor.getSelections()) {
		cells.push(...editor.getCellsInRange(selection));
	}

	if (cells.length <= 1) {
		return;
	}

	// check if all cells are of the same kind
	const cellKind = cells[0].cellKind;
	const isSameKind = cells.every(cell => cell.cellKind === cellKind);
	if (!isSameKind) {
		// cannot join cells of different kinds
		// show warning and quit
		const message = localize('notebookActions.joinSelectedCells', "Cannot join cells of different kinds");
		return notificationService.warn(message);
	}

	// merge all cells content into first cell
	const firstCell = cells[0];
	const insertContent = cells.map(cell => cell.getText()).join(firstCell.textBuffer.getEOL());
	const firstSelection = editor.getSelections()[0];
	edits.push(
		new ResourceNotebookCellEdit(editor.textModel.uri,
			{
				editType: CellEditType.Replace,
				index: firstSelection.start,
				count: firstSelection.end - firstSelection.start,
				cells: [{
					cellKind: firstCell.cellKind,
					source: insertContent,
					language: firstCell.language,
					mime: firstCell.mime,
					outputs: firstCell.model.outputs,
					metadata: firstCell.metadata,
				}]
			}
		)
	);

	for (const selection of editor.getSelections().slice(1)) {
		edits.push(new ResourceNotebookCellEdit(editor.textModel.uri,
			{
				editType: CellEditType.Replace,
				index: selection.start,
				count: selection.end - selection.start,
				cells: []
			}));
	}

	if (edits.length) {
		await bulkEditService.apply(
			edits,
			{ quotableLabel: localize('notebookActions.joinSelectedCells.label', "Join Notebook Cells") }
		);
	}
}

export async function joinNotebookCells(editor: IActiveNotebookEditor, range: ICellRange, direction: 'above' | 'below', constraint?: CellKind): Promise<{ edits: ResourceEdit[]; cell: ICellViewModel; endFocus: ICellRange; endSelections: ICellRange[] } | null> {
	if (editor.isReadOnly) {
		return null;
	}

	const textModel = editor.textModel;
	const cells = editor.getCellsInRange(range);

	if (!cells.length) {
		return null;
	}

	if (range.start === 0 && direction === 'above') {
		return null;
	}

	if (range.end === textModel.length && direction === 'below') {
		return null;
	}

	for (let i = 0; i < cells.length; i++) {
		const cell = cells[i];

		if (constraint && cell.cellKind !== constraint) {
			return null;
		}
	}

	if (direction === 'above') {
		const above = editor.cellAt(range.start - 1) as CellViewModel;
		if (constraint && above.cellKind !== constraint) {
			return null;
		}

		const insertContent = cells.map(cell => (cell.textBuffer.getEOL() ?? '') + cell.getText()).join('');
		const aboveCellLineCount = above.textBuffer.getLineCount();
		const aboveCellLastLineEndColumn = above.textBuffer.getLineLength(aboveCellLineCount);

		return {
			edits: [
				new ResourceTextEdit(above.uri, { range: new Range(aboveCellLineCount, aboveCellLastLineEndColumn + 1, aboveCellLineCount, aboveCellLastLineEndColumn + 1), text: insertContent }),
				new ResourceNotebookCellEdit(textModel.uri,
					{
						editType: CellEditType.Replace,
						index: range.start,
						count: range.end - range.start,
						cells: []
					}
				)
			],
			cell: above,
			endFocus: { start: range.start - 1, end: range.start },
			endSelections: [{ start: range.start - 1, end: range.start }]
		};
	} else {
		const below = editor.cellAt(range.end) as CellViewModel;
		if (constraint && below.cellKind !== constraint) {
			return null;
		}

		const cell = cells[0];
		const restCells = [...cells.slice(1), below];
		const insertContent = restCells.map(cl => (cl.textBuffer.getEOL() ?? '') + cl.getText()).join('');

		const cellLineCount = cell.textBuffer.getLineCount();
		const cellLastLineEndColumn = cell.textBuffer.getLineLength(cellLineCount);

		return {
			edits: [
				new ResourceTextEdit(cell.uri, { range: new Range(cellLineCount, cellLastLineEndColumn + 1, cellLineCount, cellLastLineEndColumn + 1), text: insertContent }),
				new ResourceNotebookCellEdit(textModel.uri,
					{
						editType: CellEditType.Replace,
						index: range.start + 1,
						count: range.end - range.start,
						cells: []
					}
				)
			],
			cell,
			endFocus: { start: range.start, end: range.start + 1 },
			endSelections: [{ start: range.start, end: range.start + 1 }]
		};
	}
}

export async function joinCellsWithSurrounds(bulkEditService: IBulkEditService, context: INotebookCellActionContext, direction: 'above' | 'below'): Promise<void> {
	const editor = context.notebookEditor;
	const textModel = editor.textModel;
	const viewModel = editor.getViewModel() as NotebookViewModel;
	let ret: {
		edits: ResourceEdit[];
		cell: ICellViewModel;
		endFocus: ICellRange;
		endSelections: ICellRange[];
	} | null = null;

	if (context.ui) {
		const focusMode = context.cell.focusMode;
		const cellIndex = editor.getCellIndex(context.cell);
		ret = await joinNotebookCells(editor, { start: cellIndex, end: cellIndex + 1 }, direction);
		if (!ret) {
			return;
		}

		await bulkEditService.apply(
			ret?.edits,
			{ quotableLabel: 'Join Notebook Cells' }
		);
		viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: ret.endFocus, selections: ret.endSelections });
		ret.cell.updateEditState(CellEditState.Editing, 'joinCellsWithSurrounds');
		editor.revealCellRangeInView(editor.getFocus());
		if (focusMode === CellFocusMode.Editor) {
			ret.cell.focusMode = CellFocusMode.Editor;
		}
	} else {
		const selections = editor.getSelections();
		if (!selections.length) {
			return;
		}

		const focus = editor.getFocus();
		const focusMode = editor.cellAt(focus.start)?.focusMode;

		const edits: ResourceEdit[] = [];
		let cell: ICellViewModel | null = null;
		const cells: ICellViewModel[] = [];

		for (let i = selections.length - 1; i >= 0; i--) {
			const selection = selections[i];
			const containFocus = cellRangeContains(selection, focus);

			if (
				selection.end >= textModel.length && direction === 'below'
				|| selection.start === 0 && direction === 'above'
			) {
				if (containFocus) {
					cell = editor.cellAt(focus.start)!;
				}

				cells.push(...editor.getCellsInRange(selection));
				continue;
			}

			const singleRet = await joinNotebookCells(editor, selection, direction);

			if (!singleRet) {
				return;
			}

			edits.push(...singleRet.edits);
			cells.push(singleRet.cell);

			if (containFocus) {
				cell = singleRet.cell;
			}
		}

		if (!edits.length) {
			return;
		}

		if (!cell || !cells.length) {
			return;
		}

		await bulkEditService.apply(
			edits,
			{ quotableLabel: 'Join Notebook Cells' }
		);

		cells.forEach(cell => {
			cell.updateEditState(CellEditState.Editing, 'joinCellsWithSurrounds');
		});

		viewModel.updateSelectionsState({ kind: SelectionStateType.Handle, primary: cell.handle, selections: cells.map(cell => cell.handle) });
		editor.revealCellRangeInView(editor.getFocus());
		const newFocusedCell = editor.cellAt(editor.getFocus().start);
		if (focusMode === CellFocusMode.Editor && newFocusedCell) {
			newFocusedCell.focusMode = CellFocusMode.Editor;
		}
	}
}

function _splitPointsToBoundaries(splitPoints: IPosition[], textBuffer: IReadonlyTextBuffer): IPosition[] | null {
	const boundaries: IPosition[] = [];
	const lineCnt = textBuffer.getLineCount();
	const getLineLen = (lineNumber: number) => {
		return textBuffer.getLineLength(lineNumber);
	};

	// split points need to be sorted
	splitPoints = splitPoints.sort((l, r) => {
		const lineDiff = l.lineNumber - r.lineNumber;
		const columnDiff = l.column - r.column;
		return lineDiff !== 0 ? lineDiff : columnDiff;
	});

	for (let sp of splitPoints) {
		if (getLineLen(sp.lineNumber) + 1 === sp.column && sp.column !== 1 /** empty line */ && sp.lineNumber < lineCnt) {
			sp = new Position(sp.lineNumber + 1, 1);
		}
		_pushIfAbsent(boundaries, sp);
	}

	if (boundaries.length === 0) {
		return null;
	}

	// boundaries already sorted and not empty
	const modelStart = new Position(1, 1);
	const modelEnd = new Position(lineCnt, getLineLen(lineCnt) + 1);
	return [modelStart, ...boundaries, modelEnd];
}

function _pushIfAbsent(positions: IPosition[], p: IPosition) {
	const last = positions.length > 0 ? positions[positions.length - 1] : undefined;
	if (!last || last.lineNumber !== p.lineNumber || last.column !== p.column) {
		positions.push(p);
	}
}

export function computeCellLinesContents(cell: ICellViewModel, splitPoints: IPosition[]): string[] | null {
	const rangeBoundaries = _splitPointsToBoundaries(splitPoints, cell.textBuffer);
	if (!rangeBoundaries) {
		return null;
	}
	const newLineModels: string[] = [];
	for (let i = 1; i < rangeBoundaries.length; i++) {
		const start = rangeBoundaries[i - 1];
		const end = rangeBoundaries[i];

		newLineModels.push(cell.textBuffer.getValueInRange(new Range(start.lineNumber, start.column, end.lineNumber, end.column), EndOfLinePreference.TextDefined));
	}

	return newLineModels;
}

export function insertCell(
	languageService: ILanguageService,
	editor: IActiveNotebookEditor,
	index: number,
	type: CellKind,
	direction: 'above' | 'below' = 'above',
	initialText: string = '',
	ui: boolean = false,
	kernelHistoryService?: INotebookKernelHistoryService
) {
	const viewModel = editor.getViewModel() as NotebookViewModel;
	const activeKernel = editor.activeKernel;
	if (viewModel.options.isReadOnly) {
		return null;
	}

	const cell = editor.cellAt(index);
	const nextIndex = ui ? viewModel.getNextVisibleCellIndex(index) : index + 1;
	let language;
	if (type === CellKind.Code) {
		const supportedLanguages = activeKernel?.supportedLanguages ?? languageService.getRegisteredLanguageIds();
		const defaultLanguage = supportedLanguages[0] || PLAINTEXT_LANGUAGE_ID;

		if (cell?.cellKind === CellKind.Code) {
			language = cell.language;
		} else if (cell?.cellKind === CellKind.Markup) {
			const nearestCodeCellIndex = viewModel.nearestCodeCellIndex(index);
			if (nearestCodeCellIndex > -1) {
				language = viewModel.cellAt(nearestCodeCellIndex)!.language;
			} else {
				language = defaultLanguage;
			}
		} else if (!cell && viewModel.length === 0) {
			// No cells in notebook - check kernel history
			const lastKernels = kernelHistoryService?.getKernels(viewModel.notebookDocument);
			if (lastKernels?.all.length) {
				const lastKernel = lastKernels.all[0];
				language = lastKernel.supportedLanguages[0] || defaultLanguage;
			} else {
				language = defaultLanguage;
			}
		} else {
			if (cell === undefined && direction === 'above') {
				// insert cell at the very top
				language = viewModel.viewCells.find(cell => cell.cellKind === CellKind.Code)?.language || defaultLanguage;
			} else {
				language = defaultLanguage;
			}
		}

		if (!supportedLanguages.includes(language)) {
			// the language no longer exists
			language = defaultLanguage;
		}
	} else {
		language = 'markdown';
	}

	const insertIndex = cell ?
		(direction === 'above' ? index : nextIndex) :
		index;
	return insertCellAtIndex(viewModel, insertIndex, initialText, language, type, undefined, [], true, true);
}

export function insertCellAtIndex(viewModel: NotebookViewModel, index: number, source: string, language: string, type: CellKind, metadata: NotebookCellMetadata | undefined, outputs: IOutputDto[], synchronous: boolean, pushUndoStop: boolean): CellViewModel {
	const endSelections: ISelectionState = { kind: SelectionStateType.Index, focus: { start: index, end: index + 1 }, selections: [{ start: index, end: index + 1 }] };
	viewModel.notebookDocument.applyEdits([
		{
			editType: CellEditType.Replace,
			index,
			count: 0,
			cells: [
				{
					cellKind: type,
					language: language,
					mime: undefined,
					outputs: outputs,
					metadata: metadata,
					source: source
				}
			]
		}
	], synchronous, { kind: SelectionStateType.Index, focus: viewModel.getFocus(), selections: viewModel.getSelections() }, () => endSelections, undefined, pushUndoStop && !viewModel.options.isReadOnly);
	return viewModel.cellAt(index)!;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/controller/cellOutputActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/controller/cellOutputActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { localize } from '../../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { INotebookOutputActionContext, NOTEBOOK_ACTIONS_CATEGORY } from './coreActions.js';
import { NOTEBOOK_CELL_HAS_HIDDEN_OUTPUTS, NOTEBOOK_CELL_HAS_OUTPUTS, NOTEBOOK_CELL_OUTPUT_MIMETYPE } from '../../common/notebookContextKeys.js';
import * as icons from '../notebookIcons.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { copyCellOutput } from '../viewModel/cellOutputTextHelper.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { ICellOutputViewModel, ICellViewModel, INotebookEditor, getNotebookEditorFromEditorPane } from '../notebookBrowser.js';
import { CellKind, CellUri } from '../../common/notebookCommon.js';
import { CodeCellViewModel } from '../viewModel/codeCellViewModel.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { INotebookEditorModelResolverService } from '../../common/notebookEditorModelResolverService.js';
import { IFileDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { URI } from '../../../../../base/common/uri.js';

export const COPY_OUTPUT_COMMAND_ID = 'notebook.cellOutput.copy';

registerAction2(class ShowAllOutputsAction extends Action2 {
	constructor() {
		super({
			id: 'notebook.cellOuput.showEmptyOutputs',
			title: localize('notebookActions.showAllOutput', "Show Empty Outputs"),
			menu: {
				id: MenuId.NotebookOutputToolbar,
				when: ContextKeyExpr.and(NOTEBOOK_CELL_HAS_OUTPUTS, NOTEBOOK_CELL_HAS_HIDDEN_OUTPUTS)
			},
			f1: false,
			category: NOTEBOOK_ACTIONS_CATEGORY
		});
	}

	run(accessor: ServicesAccessor, context: INotebookOutputActionContext): void {
		const cell = context.cell;
		if (cell && cell.cellKind === CellKind.Code) {

			for (let i = 1; i < cell.outputsViewModels.length; i++) {
				if (!cell.outputsViewModels[i].visible.get()) {
					cell.outputsViewModels[i].setVisible(true, true);
					(cell as CodeCellViewModel).updateOutputHeight(i, 1, 'command');
				}
			}
		}
	}
});

registerAction2(class CopyCellOutputAction extends Action2 {
	constructor() {
		super({
			id: COPY_OUTPUT_COMMAND_ID,
			title: localize('notebookActions.copyOutput', "Copy Cell Output"),
			menu: {
				id: MenuId.NotebookOutputToolbar,
				when: NOTEBOOK_CELL_HAS_OUTPUTS
			},
			category: NOTEBOOK_ACTIONS_CATEGORY,
			icon: icons.copyIcon,
		});
	}

	async run(accessor: ServicesAccessor, outputContext: INotebookOutputActionContext | { outputViewModel: ICellOutputViewModel } | undefined): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const clipboardService = accessor.get(IClipboardService);
		const logService = accessor.get(ILogService);

		const notebookEditor = getNotebookEditorFromContext(editorService, outputContext);
		if (!notebookEditor) {
			return;
		}

		const outputViewModel = getOutputViewModelFromContext(outputContext, notebookEditor);
		if (!outputViewModel) {
			return;
		}

		const mimeType = outputViewModel.pickedMimeType?.mimeType;

		if (mimeType?.startsWith('image/')) {
			const focusOptions = { skipReveal: true, outputId: outputViewModel.model.outputId, altOutputId: outputViewModel.model.alternativeOutputId };
			await notebookEditor.focusNotebookCell(outputViewModel.cellViewModel as ICellViewModel, 'output', focusOptions);
			notebookEditor.copyOutputImage(outputViewModel);
		} else {
			copyCellOutput(mimeType, outputViewModel, clipboardService, logService);
		}
	}

});

export function getOutputViewModelFromId(outputId: string, notebookEditor: INotebookEditor): ICellOutputViewModel | undefined {
	const notebookViewModel = notebookEditor.getViewModel();
	if (notebookViewModel) {
		const codeCells = notebookViewModel.viewCells.filter(cell => cell.cellKind === CellKind.Code) as CodeCellViewModel[];
		for (const cell of codeCells) {
			const output = cell.outputsViewModels.find(output => output.model.outputId === outputId || output.model.alternativeOutputId === outputId);
			if (output) {
				return output;
			}
		}
	}

	return undefined;
}

function getNotebookEditorFromContext(editorService: IEditorService, outputContext: INotebookOutputActionContext | { outputViewModel: ICellOutputViewModel } | undefined): INotebookEditor | undefined {
	if (outputContext && 'notebookEditor' in outputContext) {
		return outputContext.notebookEditor;
	}
	return getNotebookEditorFromEditorPane(editorService.activeEditorPane);
}

function getOutputViewModelFromContext(outputContext: INotebookOutputActionContext | { outputViewModel: ICellOutputViewModel } | undefined, notebookEditor: INotebookEditor): ICellOutputViewModel | undefined {
	let outputViewModel: ICellOutputViewModel | undefined;

	if (outputContext && 'outputId' in outputContext && typeof outputContext.outputId === 'string') {
		outputViewModel = getOutputViewModelFromId(outputContext.outputId, notebookEditor);
	} else if (outputContext && 'outputViewModel' in outputContext) {
		outputViewModel = outputContext.outputViewModel;
	}

	if (!outputViewModel) {
		// not able to find the output from the provided context, use the active cell
		const activeCell = notebookEditor.getActiveCell();
		if (!activeCell) {
			return undefined;
		}

		if (activeCell.focusedOutputId !== undefined) {
			outputViewModel = activeCell.outputsViewModels.find(output => {
				return output.model.outputId === activeCell.focusedOutputId;
			});
		} else {
			outputViewModel = activeCell.outputsViewModels.find(output => output.pickedMimeType?.isTrusted);
		}
	}

	return outputViewModel;
}

export const OPEN_OUTPUT_COMMAND_ID = 'notebook.cellOutput.openInTextEditor';

registerAction2(class OpenCellOutputInEditorAction extends Action2 {
	constructor() {
		super({
			id: OPEN_OUTPUT_COMMAND_ID,
			title: localize('notebookActions.openOutputInEditor', "Open Cell Output in Text Editor"),
			f1: false,
			category: NOTEBOOK_ACTIONS_CATEGORY,
			icon: icons.copyIcon,
		});
	}

	async run(accessor: ServicesAccessor, outputContext: INotebookOutputActionContext | { outputViewModel: ICellOutputViewModel } | undefined): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const notebookModelService = accessor.get(INotebookEditorModelResolverService);
		const openerService = accessor.get(IOpenerService);

		const notebookEditor = getNotebookEditorFromContext(editorService, outputContext);
		if (!notebookEditor) {
			return;
		}

		const outputViewModel = getOutputViewModelFromContext(outputContext, notebookEditor);

		if (outputViewModel?.model.outputId && notebookEditor.textModel?.uri) {
			// reserve notebook document reference since the active notebook editor might not be pinned so it can be replaced by the output editor
			const ref = await notebookModelService.resolve(notebookEditor.textModel.uri);
			await openerService.open(CellUri.generateCellOutputUriWithId(notebookEditor.textModel.uri, outputViewModel.model.outputId));
			ref.dispose();
		}
	}
});

export const SAVE_OUTPUT_IMAGE_COMMAND_ID = 'notebook.cellOutput.saveImage';

registerAction2(class SaveCellOutputImageAction extends Action2 {
	constructor() {
		super({
			id: SAVE_OUTPUT_IMAGE_COMMAND_ID,
			title: localize('notebookActions.saveOutputImage', "Save Image"),
			menu: {
				id: MenuId.NotebookOutputToolbar,
				when: ContextKeyExpr.regex(NOTEBOOK_CELL_OUTPUT_MIMETYPE.key, /^image\//)
			},
			f1: false,
			category: NOTEBOOK_ACTIONS_CATEGORY,
			icon: icons.saveIcon,
		});
	}

	async run(accessor: ServicesAccessor, outputContext: INotebookOutputActionContext | { outputViewModel: ICellOutputViewModel } | undefined): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const fileDialogService = accessor.get(IFileDialogService);
		const fileService = accessor.get(IFileService);
		const logService = accessor.get(ILogService);

		const notebookEditor = getNotebookEditorFromContext(editorService, outputContext);
		if (!notebookEditor) {
			return;
		}

		const outputViewModel = getOutputViewModelFromContext(outputContext, notebookEditor);
		if (!outputViewModel) {
			return;
		}

		const mimeType = outputViewModel.pickedMimeType?.mimeType;

		// Only handle image mime types
		if (!mimeType?.startsWith('image/')) {
			return;
		}

		const outputItem = outputViewModel.model.outputs.find(output => output.mime === mimeType);
		if (!outputItem) {
			logService.error('Could not find output item with mime type', mimeType);
			return;
		}

		// Determine file extension based on mime type
		const mimeToExt: { [key: string]: string } = {
			'image/png': 'png',
			'image/jpeg': 'jpg',
			'image/jpg': 'jpg',
			'image/gif': 'gif',
			'image/svg+xml': 'svg',
			'image/webp': 'webp',
			'image/bmp': 'bmp',
			'image/tiff': 'tiff'
		};

		const extension = mimeToExt[mimeType] || 'png';
		const defaultFileName = `image.${extension}`;

		const defaultUri = notebookEditor.textModel?.uri
			? URI.joinPath(URI.file(notebookEditor.textModel.uri.fsPath), '..', defaultFileName)
			: undefined;

		const uri = await fileDialogService.showSaveDialog({
			defaultUri,
			filters: [{
				name: localize('imageFiles', "Image Files"),
				extensions: [extension]
			}]
		});

		if (!uri) {
			return; // User cancelled
		}

		try {
			const imageData = outputItem.data;
			await fileService.writeFile(uri, imageData);
			logService.info('Saved image output to', uri.toString());
		} catch (error) {
			logService.error('Failed to save image output', error);
		}
	}
});

export const OPEN_OUTPUT_IN_OUTPUT_PREVIEW_COMMAND_ID = 'notebook.cellOutput.openInOutputPreview';

registerAction2(class OpenCellOutputInNotebookOutputEditorAction extends Action2 {
	constructor() {
		super({
			id: OPEN_OUTPUT_IN_OUTPUT_PREVIEW_COMMAND_ID,
			title: localize('notebookActions.openOutputInNotebookOutputEditor', "Open in Output Preview"),
			menu: {
				id: MenuId.NotebookOutputToolbar,
				when: ContextKeyExpr.and(NOTEBOOK_CELL_HAS_OUTPUTS, ContextKeyExpr.equals('config.notebook.output.openInPreviewEditor.enabled', true))
			},
			f1: false,
			category: NOTEBOOK_ACTIONS_CATEGORY,
		});
	}

	async run(accessor: ServicesAccessor, outputContext: INotebookOutputActionContext | { outputViewModel: ICellOutputViewModel } | undefined): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const openerService = accessor.get(IOpenerService);

		const notebookEditor = getNotebookEditorFromContext(editorService, outputContext);
		if (!notebookEditor) {
			return;
		}

		const outputViewModel = getOutputViewModelFromContext(outputContext, notebookEditor);

		if (!outputViewModel) {
			return;
		}

		const genericCellViewModel = outputViewModel.cellViewModel;
		if (!genericCellViewModel) {
			return;
		}

		// get cell index
		const cellViewModel = notebookEditor.getCellByHandle(genericCellViewModel.handle);
		if (!cellViewModel) {
			return;
		}
		const cellIndex = notebookEditor.getCellIndex(cellViewModel);
		if (cellIndex === undefined) {
			return;
		}

		// get output index
		const outputIndex = genericCellViewModel.outputsViewModels.indexOf(outputViewModel);
		if (outputIndex === -1) {
			return;
		}

		if (!notebookEditor.textModel) {
			return;
		}

		// craft rich output URI to pass data to the notebook output editor/viewer
		const outputURI = CellUri.generateOutputEditorUri(
			notebookEditor.textModel.uri,
			cellViewModel.id,
			cellIndex,
			outputViewModel.model.outputId,
			outputIndex,
		);

		openerService.open(outputURI, { openToSide: true });
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/controller/coreActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/controller/coreActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI, UriComponents } from '../../../../../base/common/uri.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2, IAction2Options, MenuId, MenuRegistry } from '../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { getNotebookEditorFromEditorPane, IActiveNotebookEditor, ICellViewModel, cellRangeToViewCells, ICellOutputViewModel } from '../notebookBrowser.js';
import { INTERACTIVE_WINDOW_IS_ACTIVE_EDITOR, NOTEBOOK_EDITOR_EDITABLE, NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_IS_ACTIVE_EDITOR, NOTEBOOK_KERNEL_COUNT, NOTEBOOK_KERNEL_SOURCE_COUNT, REPL_NOTEBOOK_IS_ACTIVE_EDITOR } from '../../common/notebookContextKeys.js';
import { ICellRange, isICellRange } from '../../common/notebookRange.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { isEditorCommandsContext } from '../../../../common/editor.js';
import { INotebookEditorService } from '../services/notebookEditorService.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../../../base/common/actions.js';
import { TypeConstraint } from '../../../../../base/common/types.js';
import { IJSONSchema } from '../../../../../base/common/jsonSchema.js';
import { MarshalledId } from '../../../../../base/common/marshallingIds.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { isEqual } from '../../../../../base/common/resources.js';

// Kernel Command
export const SELECT_KERNEL_ID = '_notebook.selectKernel';
export const NOTEBOOK_ACTIONS_CATEGORY = localize2('notebookActions.category', 'Notebook');

export const CELL_TITLE_CELL_GROUP_ID = 'inline/cell';
export const CELL_TITLE_OUTPUT_GROUP_ID = 'inline/output';

export const NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT = KeybindingWeight.EditorContrib; // smaller than Suggest Widget, etc
export const NOTEBOOK_OUTPUT_WEBVIEW_ACTION_WEIGHT = KeybindingWeight.WorkbenchContrib + 1; // higher than Workbench contribution (such as Notebook List View), etc

export const enum CellToolbarOrder {
	RunSection,
	EditCell,
	ExecuteAboveCells,
	ExecuteCellAndBelow,
	SaveCell,
	SplitCell,
	ClearCellOutput
}

export const enum CellOverflowToolbarGroups {
	Copy = '1_copy',
	Insert = '2_insert',
	Edit = '3_edit',
	Share = '4_share'
}

export interface INotebookActionContext {
	readonly cell?: ICellViewModel;
	readonly notebookEditor: IActiveNotebookEditor;
	readonly ui?: boolean;
	readonly selectedCells?: readonly ICellViewModel[];
	readonly autoReveal?: boolean;
}

export interface INotebookCellToolbarActionContext extends INotebookActionContext {
	readonly ui: true;
	readonly cell: ICellViewModel;
}

export interface INotebookCommandContext extends INotebookActionContext {
	readonly ui: false;
	readonly selectedCells: readonly ICellViewModel[];
}

export interface INotebookCellActionContext extends INotebookActionContext {
	cell: ICellViewModel;
}

export interface INotebookOutputActionContext extends INotebookCellActionContext {
	outputViewModel: ICellOutputViewModel;
}

export function getContextFromActiveEditor(editorService: IEditorService): INotebookActionContext | undefined {
	const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);
	if (!editor || !editor.hasModel()) {
		return;
	}

	const activeCell = editor.getActiveCell();
	const selectedCells = editor.getSelectionViewModels();
	return {
		cell: activeCell,
		selectedCells,
		notebookEditor: editor
	};
}

function getWidgetFromUri(accessor: ServicesAccessor, uri: URI) {
	const notebookEditorService = accessor.get(INotebookEditorService);
	const widget = notebookEditorService.listNotebookEditors().find(widget => widget.hasModel() && widget.textModel.uri.toString() === uri.toString());

	if (widget && widget.hasModel()) {
		return widget;
	}

	return undefined;
}

export function getContextFromUri(accessor: ServicesAccessor, context?: any) {
	const uri = URI.revive(context);

	if (uri) {
		const widget = getWidgetFromUri(accessor, uri);

		if (widget) {
			return {
				notebookEditor: widget,
			};
		}
	}

	return undefined;
}

export function findTargetCellEditor(context: INotebookCellActionContext, targetCell: ICellViewModel) {
	let foundEditor: ICodeEditor | undefined = undefined;
	for (const [, codeEditor] of context.notebookEditor.codeEditors) {
		if (isEqual(codeEditor.getModel()?.uri, targetCell.uri)) {
			foundEditor = codeEditor;
			break;
		}
	}

	return foundEditor;
}

export abstract class NotebookAction extends Action2 {
	constructor(desc: IAction2Options) {
		if (desc.f1 !== false) {
			desc.f1 = false;
			const f1Menu = {
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.or(NOTEBOOK_IS_ACTIVE_EDITOR, INTERACTIVE_WINDOW_IS_ACTIVE_EDITOR, REPL_NOTEBOOK_IS_ACTIVE_EDITOR)
			};

			if (!desc.menu) {
				desc.menu = [];
			} else if (!Array.isArray(desc.menu)) {
				desc.menu = [desc.menu];
			}

			desc.menu = [
				...desc.menu,
				f1Menu
			];
		}

		desc.category = NOTEBOOK_ACTIONS_CATEGORY;

		super(desc);
	}

	async run(accessor: ServicesAccessor, context?: any, ...additionalArgs: any[]): Promise<void> {
		sendEntryTelemetry(accessor, this.desc.id, context);

		if (!this.isNotebookActionContext(context)) {
			context = this.getEditorContextFromArgsOrActive(accessor, context, ...additionalArgs);
			if (!context) {
				return;
			}
		}

		return this.runWithContext(accessor, context);
	}

	abstract runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void>;

	private isNotebookActionContext(context?: unknown): context is INotebookActionContext {
		return !!context && !!(context as INotebookActionContext).notebookEditor;
	}

	getEditorContextFromArgsOrActive(accessor: ServicesAccessor, context?: any, ...additionalArgs: any[]): INotebookActionContext | undefined {
		return getContextFromActiveEditor(accessor.get(IEditorService));
	}
}

// todo@rebornix, replace NotebookAction with this
export abstract class NotebookMultiCellAction extends Action2 {
	constructor(desc: IAction2Options) {
		if (desc.f1 !== false) {
			desc.f1 = false;
			const f1Menu = {
				id: MenuId.CommandPalette,
				when: NOTEBOOK_IS_ACTIVE_EDITOR
			};

			if (!desc.menu) {
				desc.menu = [];
			} else if (!Array.isArray(desc.menu)) {
				desc.menu = [desc.menu];
			}

			desc.menu = [
				...desc.menu,
				f1Menu
			];
		}

		desc.category = NOTEBOOK_ACTIONS_CATEGORY;

		super(desc);
	}

	parseArgs(accessor: ServicesAccessor, ...args: unknown[]): INotebookCommandContext | undefined {
		return undefined;
	}

	abstract runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void>;

	/**
	 * The action/command args are resolved in following order
	 * `run(accessor, cellToolbarContext)` from cell toolbar
	 * `run(accessor, ...args)` from command service with arguments
	 * `run(accessor, undefined)` from keyboard shortcuts, command palatte, etc
	 */
	async run(accessor: ServicesAccessor, ...additionalArgs: any[]): Promise<void> {
		const context = additionalArgs[0];

		sendEntryTelemetry(accessor, this.desc.id, context);

		const isFromCellToolbar = isCellToolbarContext(context);
		if (isFromCellToolbar) {
			return this.runWithContext(accessor, context);
		}

		// handle parsed args
		const parsedArgs = this.parseArgs(accessor, ...additionalArgs);
		if (parsedArgs) {
			return this.runWithContext(accessor, parsedArgs);
		}

		// no parsed args, try handle active editor
		const editor = getEditorFromArgsOrActivePane(accessor);
		if (editor) {
			const selectedCellRange: ICellRange[] = editor.getSelections().length === 0 ? [editor.getFocus()] : editor.getSelections();


			return this.runWithContext(accessor, {
				ui: false,
				notebookEditor: editor,
				selectedCells: cellRangeToViewCells(editor, selectedCellRange)
			});
		}
	}
}

export abstract class NotebookCellAction<T = INotebookCellActionContext> extends NotebookAction {
	protected isCellActionContext(context?: unknown): context is INotebookCellActionContext {
		return !!context && !!(context as INotebookCellActionContext).notebookEditor && !!(context as INotebookCellActionContext).cell;
	}

	protected getCellContextFromArgs(accessor: ServicesAccessor, context?: T, ...additionalArgs: any[]): INotebookCellActionContext | undefined {
		return undefined;
	}

	override async run(accessor: ServicesAccessor, context?: INotebookCellActionContext, ...additionalArgs: any[]): Promise<void> {
		sendEntryTelemetry(accessor, this.desc.id, context);

		if (this.isCellActionContext(context)) {
			return this.runWithContext(accessor, context);
		}

		const contextFromArgs = this.getCellContextFromArgs(accessor, context, ...additionalArgs);

		if (contextFromArgs) {
			return this.runWithContext(accessor, contextFromArgs);
		}

		const activeEditorContext = this.getEditorContextFromArgsOrActive(accessor);
		if (this.isCellActionContext(activeEditorContext)) {
			return this.runWithContext(accessor, activeEditorContext);
		}
	}

	abstract override runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext): Promise<void>;
}

export const executeNotebookCondition = ContextKeyExpr.or(ContextKeyExpr.greater(NOTEBOOK_KERNEL_COUNT.key, 0), ContextKeyExpr.greater(NOTEBOOK_KERNEL_SOURCE_COUNT.key, 0));

interface IMultiCellArgs {
	ranges: ICellRange[];
	document?: URI;
	autoReveal?: boolean;
}

function sendEntryTelemetry(accessor: ServicesAccessor, id: string, context?: any) {
	if (context) {
		const telemetryService = accessor.get(ITelemetryService);
		if (context.source) {
			telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: id, from: context.source });
		} else if (URI.isUri(context)) {
			telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: id, from: 'cellEditorContextMenu' });
		} else if (context && 'from' in context && context.from === 'cellContainer') {
			telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: id, from: 'cellContainer' });
		} else {
			const from = isCellToolbarContext(context) ? 'cellToolbar' : (isEditorCommandsContext(context) ? 'editorToolbar' : 'other');
			telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: id, from: from });
		}
	}
}

function isCellToolbarContext(context?: unknown): context is INotebookCellToolbarActionContext {
	return !!context && !!(context as INotebookActionContext).notebookEditor && (context as INotebookActionContext & { $mid: MarshalledId }).$mid === MarshalledId.NotebookCellActionContext;
}

function isMultiCellArgs(arg: unknown): arg is IMultiCellArgs {
	if (arg === undefined) {
		return false;
	}
	const ranges = (arg as IMultiCellArgs).ranges;
	if (!ranges) {
		return false;
	}

	if (!Array.isArray(ranges) || ranges.some(range => !isICellRange(range))) {
		return false;
	}

	if ((arg as IMultiCellArgs).document) {
		const uri = URI.revive((arg as IMultiCellArgs).document);

		if (!uri) {
			return false;
		}
	}

	return true;
}

export function getEditorFromArgsOrActivePane(accessor: ServicesAccessor, context?: UriComponents): IActiveNotebookEditor | undefined {
	const editorFromUri = getContextFromUri(accessor, context)?.notebookEditor;

	if (editorFromUri) {
		return editorFromUri;
	}

	const editor = getNotebookEditorFromEditorPane(accessor.get(IEditorService).activeEditorPane);
	if (!editor || !editor.hasModel()) {
		return;
	}

	return editor;
}

export function parseMultiCellExecutionArgs(accessor: ServicesAccessor, ...args: any[]): INotebookCommandContext | undefined {
	const firstArg = args[0];

	if (isMultiCellArgs(firstArg)) {
		const editor = getEditorFromArgsOrActivePane(accessor, firstArg.document);
		if (!editor) {
			return;
		}

		const ranges = firstArg.ranges;
		const selectedCells = ranges.map(range => editor.getCellsInRange(range).slice(0)).flat();
		const autoReveal = firstArg.autoReveal;
		return {
			ui: false,
			notebookEditor: editor,
			selectedCells,
			autoReveal
		};
	}

	// handle legacy arguments
	if (isICellRange(firstArg)) {
		// cellRange, document
		const secondArg = args[1];
		const editor = getEditorFromArgsOrActivePane(accessor, secondArg);
		if (!editor) {
			return;
		}

		return {
			ui: false,
			notebookEditor: editor,
			selectedCells: editor.getCellsInRange(firstArg)
		};
	}

	// let's just execute the active cell
	const context = getContextFromActiveEditor(accessor.get(IEditorService));
	return context ? {
		ui: false,
		notebookEditor: context.notebookEditor,
		selectedCells: context.selectedCells ?? [],
		cell: context.cell
	} : undefined;
}

export const cellExecutionArgs: ReadonlyArray<{
	readonly name: string;
	readonly isOptional?: boolean;
	readonly description?: string;
	readonly constraint?: TypeConstraint;
	readonly schema?: IJSONSchema;
}> = [
		{
			isOptional: true,
			name: 'options',
			description: 'The cell range options',
			schema: {
				'type': 'object',
				'required': ['ranges'],
				'properties': {
					'ranges': {
						'type': 'array',
						items: [
							{
								'type': 'object',
								'required': ['start', 'end'],
								'properties': {
									'start': {
										'type': 'number'
									},
									'end': {
										'type': 'number'
									}
								}
							}
						]
					},
					'document': {
						'type': 'object',
						'description': 'The document uri',
					},
					'autoReveal': {
						'type': 'boolean',
						'description': 'Whether the cell should be revealed into view automatically'
					}
				}
			}
		}
	];


MenuRegistry.appendMenuItem(MenuId.NotebookCellTitle, {
	submenu: MenuId.NotebookCellInsert,
	title: localize('notebookMenu.insertCell', "Insert Cell"),
	group: CellOverflowToolbarGroups.Insert,
	when: NOTEBOOK_EDITOR_EDITABLE.isEqualTo(true)
});

MenuRegistry.appendMenuItem(MenuId.EditorContext, {
	submenu: MenuId.NotebookCellTitle,
	title: localize('notebookMenu.cellTitle', "Notebook Cell"),
	group: CellOverflowToolbarGroups.Insert,
	when: NOTEBOOK_EDITOR_FOCUSED
});

MenuRegistry.appendMenuItem(MenuId.NotebookCellTitle, {
	title: localize('miShare', "Share"),
	submenu: MenuId.EditorContextShare,
	group: CellOverflowToolbarGroups.Share
});
```

--------------------------------------------------------------------------------

````
