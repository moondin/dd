---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 381
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 381 of 552)

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

---[FILE: src/vs/workbench/contrib/debug/browser/repl.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/repl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import * as domStylesheetsJs from '../../../../base/browser/domStylesheets.js';
import { IHistoryNavigationWidget } from '../../../../base/browser/history.js';
import { IActionViewItem } from '../../../../base/browser/ui/actionbar/actionbar.js';
import * as aria from '../../../../base/browser/ui/aria/aria.js';
import { MOUSE_CURSOR_TEXT_CSS_CLASS_NAME } from '../../../../base/browser/ui/mouseCursor/mouseCursor.js';
import { IAsyncDataSource, ITreeContextMenuEvent, ITreeNode } from '../../../../base/browser/ui/tree/tree.js';
import { IAction } from '../../../../base/common/actions.js';
import { RunOnceScheduler, timeout } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { memoize } from '../../../../base/common/decorators.js';
import { Emitter } from '../../../../base/common/event.js';
import { FuzzyScore } from '../../../../base/common/filters.js';
import { HistoryNavigator } from '../../../../base/common/history.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { removeAnsiEscapeCodes } from '../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI as uri } from '../../../../base/common/uri.js';
import { ICodeEditor, isCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorAction, registerEditorAction } from '../../../../editor/browser/editorExtensions.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { CodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { EDITOR_FONT_DEFAULTS } from '../../../../editor/common/config/fontInfo.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { IDecorationOptions } from '../../../../editor/common/editorCommon.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { CompletionContext, CompletionItem, CompletionItemInsertTextRule, CompletionItemKind, CompletionItemKinds, CompletionList } from '../../../../editor/common/languages.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ITextResourcePropertiesService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { SuggestController } from '../../../../editor/contrib/suggest/browser/suggestController.js';
import { localize, localize2 } from '../../../../nls.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { getFlatContextMenuActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { Action2, IMenu, IMenuService, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { registerAndCreateHistoryNavigationContext } from '../../../../platform/history/browser/contextScopedHistoryWidget.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { WorkbenchAsyncDataTree } from '../../../../platform/list/browser/listService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { editorForeground, resolveColorValue } from '../../../../platform/theme/common/colorRegistry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { registerNavigableContainer } from '../../../browser/actions/widgetNavigationCommands.js';
import { FilterViewPane, IViewPaneOptions, ViewAction } from '../../../browser/parts/views/viewPane.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { AccessibilityCommandId } from '../../accessibility/common/accessibilityCommands.js';
import { getSimpleCodeEditorWidgetOptions, getSimpleEditorOptions } from '../../codeEditor/browser/simpleEditorOptions.js';
import { CONTEXT_DEBUG_STATE, CONTEXT_IN_DEBUG_REPL, CONTEXT_MULTI_SESSION_REPL, DEBUG_SCHEME, IDebugConfiguration, IDebugService, IDebugSession, IReplConfiguration, IReplElement, IReplOptions, REPL_VIEW_ID, State, getStateLabel } from '../common/debug.js';
import { Variable } from '../common/debugModel.js';
import { resolveChildSession } from '../common/debugUtils.js';
import { ReplEvaluationResult, ReplGroup } from '../common/replModel.js';
import { FocusSessionActionViewItem } from './debugActionViewItems.js';
import { DEBUG_COMMAND_CATEGORY, FOCUS_REPL_ID } from './debugCommands.js';
import { DebugExpressionRenderer } from './debugExpressionRenderer.js';
import { debugConsoleClearAll, debugConsoleEvaluationPrompt } from './debugIcons.js';
import './media/repl.css';
import { ReplFilter } from './replFilter.js';
import { ReplAccessibilityProvider, ReplDataSource, ReplDelegate, ReplEvaluationInputsRenderer, ReplEvaluationResultsRenderer, ReplGroupRenderer, ReplOutputElementRenderer, ReplRawObjectsRenderer, ReplVariablesRenderer } from './replViewer.js';

const $ = dom.$;

const HISTORY_STORAGE_KEY = 'debug.repl.history';
const FILTER_HISTORY_STORAGE_KEY = 'debug.repl.filterHistory';
const FILTER_VALUE_STORAGE_KEY = 'debug.repl.filterValue';
const DECORATION_KEY = 'replinputdecoration';

function revealLastElement(tree: WorkbenchAsyncDataTree<any, any, any>) {
	tree.scrollTop = tree.scrollHeight - tree.renderHeight;
	// tree.scrollTop = 1e6;
}

const sessionsToIgnore = new Set<IDebugSession>();
const identityProvider = { getId: (element: IReplElement) => element.getId() };

export class Repl extends FilterViewPane implements IHistoryNavigationWidget {
	declare readonly _serviceBrand: undefined;

	private static readonly REFRESH_DELAY = 50; // delay in ms to refresh the repl for new elements to show
	private static readonly URI = uri.parse(`${DEBUG_SCHEME}:replinput`);

	private history: HistoryNavigator<string>;
	private tree?: WorkbenchAsyncDataTree<IDebugSession, IReplElement, FuzzyScore>;
	private replOptions: ReplOptions;
	private previousTreeScrollHeight: number = 0;
	private replDelegate!: ReplDelegate;
	private container!: HTMLElement;
	private treeContainer!: HTMLElement;
	private replInput!: CodeEditorWidget;
	private replInputContainer!: HTMLElement;
	private bodyContentDimension: dom.Dimension | undefined;
	private model: ITextModel | undefined;
	private setHistoryNavigationEnablement!: (enabled: boolean) => void;
	private scopedInstantiationService!: IInstantiationService;
	private replElementsChangeListener: IDisposable | undefined;
	private styleElement: HTMLStyleElement | undefined;
	private styleChangedWhenInvisible: boolean = false;
	private completionItemProvider: IDisposable | undefined;
	private modelChangeListener: IDisposable = Disposable.None;
	private filter: ReplFilter;
	private multiSessionRepl: IContextKey<boolean>;
	private menu: IMenu;
	private replDataSource: IAsyncDataSource<IDebugSession, IReplElement> | undefined;
	private findIsOpen: boolean = false;

	constructor(
		options: IViewPaneOptions,
		@IDebugService private readonly debugService: IDebugService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IStorageService private readonly storageService: IStorageService,
		@IThemeService themeService: IThemeService,
		@IModelService private readonly modelService: IModelService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService protected override readonly configurationService: IConfigurationService,
		@ITextResourcePropertiesService private readonly textResourcePropertiesService: ITextResourcePropertiesService,
		@IEditorService private readonly editorService: IEditorService,
		@IKeybindingService protected override readonly keybindingService: IKeybindingService,
		@IOpenerService openerService: IOpenerService,
		@IHoverService hoverService: IHoverService,
		@IMenuService menuService: IMenuService,
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
		@ILogService private readonly logService: ILogService,
	) {
		const filterText = storageService.get(FILTER_VALUE_STORAGE_KEY, StorageScope.WORKSPACE, '');
		super({
			...options,
			filterOptions: {
				placeholder: localize({ key: 'workbench.debug.filter.placeholder', comment: ['Text in the brackets after e.g. is not localizable'] }, "Filter (e.g. text, !exclude, \\escape)"),
				text: filterText,
				history: JSON.parse(storageService.get(FILTER_HISTORY_STORAGE_KEY, StorageScope.WORKSPACE, '[]')) as string[],
			}
		}, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);

		this.menu = menuService.createMenu(MenuId.DebugConsoleContext, contextKeyService);
		this._register(this.menu);
		this.history = this._register(new HistoryNavigator(new Set(JSON.parse(this.storageService.get(HISTORY_STORAGE_KEY, StorageScope.WORKSPACE, '[]'))), 100));
		this.filter = new ReplFilter();
		this.filter.filterQuery = filterText;
		this.multiSessionRepl = CONTEXT_MULTI_SESSION_REPL.bindTo(contextKeyService);
		this.replOptions = this._register(this.instantiationService.createInstance(ReplOptions, this.id, () => this.getLocationBasedColors().background));
		this._register(this.replOptions.onDidChange(() => this.onDidStyleChange()));

		this._register(codeEditorService.registerDecorationType('repl-decoration', DECORATION_KEY, {}));
		this.multiSessionRepl.set(this.isMultiSessionView);
		this.registerListeners();
	}

	private registerListeners(): void {
		if (this.debugService.getViewModel().focusedSession) {
			this.onDidFocusSession(this.debugService.getViewModel().focusedSession);
		}

		this._register(this.debugService.getViewModel().onDidFocusSession(session => {
			this.onDidFocusSession(session);
		}));
		this._register(this.debugService.getViewModel().onDidEvaluateLazyExpression(async e => {
			if (e instanceof Variable && this.tree?.hasNode(e)) {
				await this.tree.updateChildren(e, false, true);
				await this.tree.expand(e);
			}
		}));
		this._register(this.debugService.onWillNewSession(async newSession => {
			// Need to listen to output events for sessions which are not yet fully initialised
			const input = this.tree?.getInput();
			if (!input || input.state === State.Inactive) {
				await this.selectSession(newSession);
			}
			this.multiSessionRepl.set(this.isMultiSessionView);
		}));
		this._register(this.debugService.onDidEndSession(async () => {
			// Update view, since orphaned sessions might now be separate
			await Promise.resolve(); // allow other listeners to go first, so sessions can update parents
			this.multiSessionRepl.set(this.isMultiSessionView);
		}));
		this._register(this.themeService.onDidColorThemeChange(() => {
			this.refreshReplElements(false);
			if (this.isVisible()) {
				this.updateInputDecoration();
			}
		}));
		this._register(this.onDidChangeBodyVisibility(visible => {
			if (!visible) {
				return;
			}
			if (!this.model) {
				this.model = this.modelService.getModel(Repl.URI) || this.modelService.createModel('', null, Repl.URI, true);
			}

			const focusedSession = this.debugService.getViewModel().focusedSession;
			if (this.tree && this.tree.getInput() !== focusedSession) {
				this.onDidFocusSession(focusedSession);
			}

			this.setMode();
			this.replInput.setModel(this.model);
			this.updateInputDecoration();
			this.refreshReplElements(true);

			if (this.styleChangedWhenInvisible) {
				this.styleChangedWhenInvisible = false;
				this.tree?.updateChildren(undefined, true, false);
				this.onDidStyleChange();
			}
		}));
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('debug.console.wordWrap') && this.tree) {
				this.tree.dispose();
				this.treeContainer.innerText = '';
				dom.clearNode(this.treeContainer);
				this.createReplTree();
			}
			if (e.affectsConfiguration('debug.console.acceptSuggestionOnEnter')) {
				const config = this.configurationService.getValue<IDebugConfiguration>('debug');
				this.replInput.updateOptions({
					acceptSuggestionOnEnter: config.console.acceptSuggestionOnEnter === 'on' ? 'on' : 'off'
				});
			}
		}));

		this._register(this.editorService.onDidActiveEditorChange(() => {
			this.setMode();
		}));

		this._register(this.filterWidget.onDidChangeFilterText(() => {
			this.filter.filterQuery = this.filterWidget.getFilterText();
			if (this.tree) {
				this.tree.refilter();
				revealLastElement(this.tree);
			}
		}));
	}

	private async onDidFocusSession(session: IDebugSession | undefined): Promise<void> {
		if (session) {
			sessionsToIgnore.delete(session);
			this.completionItemProvider?.dispose();
			if (session.capabilities.supportsCompletionsRequest) {
				this.completionItemProvider = this.languageFeaturesService.completionProvider.register({ scheme: DEBUG_SCHEME, pattern: '**/replinput', hasAccessToAllModels: true }, {
					_debugDisplayName: 'debugConsole',
					triggerCharacters: session.capabilities.completionTriggerCharacters || ['.'],
					provideCompletionItems: async (_: ITextModel, position: Position, _context: CompletionContext, token: CancellationToken): Promise<CompletionList> => {
						// Disable history navigation because up and down are used to navigate through the suggest widget
						this.setHistoryNavigationEnablement(false);

						const model = this.replInput.getModel();
						if (model) {
							const text = model.getValue();
							const focusedStackFrame = this.debugService.getViewModel().focusedStackFrame;
							const frameId = focusedStackFrame ? focusedStackFrame.frameId : undefined;
							const response = await session.completions(frameId, focusedStackFrame?.thread.threadId || 0, text, position, token);

							const suggestions: CompletionItem[] = [];
							const computeRange = (length: number) => Range.fromPositions(position.delta(0, -length), position);
							if (response && response.body && response.body.targets) {
								response.body.targets.forEach(item => {
									if (item && item.label) {
										let insertTextRules: CompletionItemInsertTextRule | undefined = undefined;
										let insertText = item.text || item.label;
										if (typeof item.selectionStart === 'number') {
											// If a debug completion item sets a selection we need to use snippets to make sure the selection is selected #90974
											insertTextRules = CompletionItemInsertTextRule.InsertAsSnippet;
											const selectionLength = typeof item.selectionLength === 'number' ? item.selectionLength : 0;
											const placeholder = selectionLength > 0 ? '${1:' + insertText.substring(item.selectionStart, item.selectionStart + selectionLength) + '}$0' : '$0';
											insertText = insertText.substring(0, item.selectionStart) + placeholder + insertText.substring(item.selectionStart + selectionLength);
										}

										suggestions.push({
											label: item.label,
											insertText,
											detail: item.detail,
											kind: CompletionItemKinds.fromString(item.type || 'property'),
											filterText: (item.start && item.length) ? text.substring(item.start, item.start + item.length).concat(item.label) : undefined,
											range: computeRange(item.length || 0),
											sortText: item.sortText,
											insertTextRules
										});
									}
								});
							}

							if (this.configurationService.getValue<IDebugConfiguration>('debug').console.historySuggestions) {
								const history = this.history.getHistory();
								const idxLength = String(history.length).length;
								history.forEach((h, i) => suggestions.push({
									label: h,
									insertText: h,
									kind: CompletionItemKind.Text,
									range: computeRange(h.length),
									sortText: 'ZZZ' + String(history.length - i).padStart(idxLength, '0')
								}));
							}

							return { suggestions };
						}

						return Promise.resolve({ suggestions: [] });
					}
				});
			}
		}

		await this.selectSession();
	}

	getFilterStats(): { total: number; filtered: number } {
		// This could be called before the tree is created when setting this.filterState.filterText value
		return {
			total: this.tree?.getNode().children.length ?? 0,
			filtered: this.tree?.getNode().children.filter(c => c.visible).length ?? 0
		};
	}

	get isReadonly(): boolean {
		// Do not allow to edit inactive sessions
		const session = this.tree?.getInput();
		if (session && session.state !== State.Inactive) {
			return false;
		}

		return true;
	}

	showPreviousValue(): void {
		if (!this.isReadonly) {
			this.navigateHistory(true);
		}
	}

	showNextValue(): void {
		if (!this.isReadonly) {
			this.navigateHistory(false);
		}
	}

	focusFilter(): void {
		this.filterWidget.focus();
	}

	openFind(): void {
		this.tree?.openFind();
	}

	private setMode(): void {
		if (!this.isVisible()) {
			return;
		}

		const activeEditorControl = this.editorService.activeTextEditorControl;
		if (isCodeEditor(activeEditorControl)) {
			this.modelChangeListener.dispose();
			this.modelChangeListener = activeEditorControl.onDidChangeModelLanguage(() => this.setMode());
			if (this.model && activeEditorControl.hasModel()) {
				this.model.setLanguage(activeEditorControl.getModel().getLanguageId());
			}
		}
	}

	private onDidStyleChange(): void {
		if (!this.isVisible()) {
			this.styleChangedWhenInvisible = true;
			return;
		}
		if (this.styleElement) {
			this.replInput.updateOptions({
				fontSize: this.replOptions.replConfiguration.fontSize,
				lineHeight: this.replOptions.replConfiguration.lineHeight,
				fontFamily: this.replOptions.replConfiguration.fontFamily === 'default' ? EDITOR_FONT_DEFAULTS.fontFamily : this.replOptions.replConfiguration.fontFamily
			});

			const replInputLineHeight = this.replInput.getOption(EditorOption.lineHeight);

			// Set the font size, font family, line height and align the twistie to be centered, and input theme color
			this.styleElement.textContent = `
				.repl .repl-input-wrapper .repl-input-chevron {
					line-height: ${replInputLineHeight}px
				}

				.repl .repl-input-wrapper .monaco-editor .lines-content {
					background-color: ${this.replOptions.replConfiguration.backgroundColor};
				}
			`;
			const cssFontFamily = this.replOptions.replConfiguration.fontFamily === 'default' ? 'var(--monaco-monospace-font)' : this.replOptions.replConfiguration.fontFamily;
			this.container.style.setProperty(`--vscode-repl-font-family`, cssFontFamily);
			this.container.style.setProperty(`--vscode-repl-font-size`, `${this.replOptions.replConfiguration.fontSize}px`);
			this.container.style.setProperty(`--vscode-repl-font-size-for-twistie`, `${this.replOptions.replConfiguration.fontSizeForTwistie}px`);
			this.container.style.setProperty(`--vscode-repl-line-height`, this.replOptions.replConfiguration.cssLineHeight);

			this.tree?.rerender();

			if (this.bodyContentDimension) {
				this.layoutBodyContent(this.bodyContentDimension.height, this.bodyContentDimension.width);
			}
		}
	}

	private navigateHistory(previous: boolean): void {
		const historyInput = (previous ?
			(this.history.previous() ?? this.history.first()) : this.history.next())
			?? '';
		this.replInput.setValue(historyInput);
		aria.status(historyInput);
		// always leave cursor at the end.
		this.replInput.setPosition({ lineNumber: 1, column: historyInput.length + 1 });
		this.setHistoryNavigationEnablement(true);
	}

	async selectSession(session?: IDebugSession): Promise<void> {
		const treeInput = this.tree?.getInput();
		if (!session) {
			const focusedSession = this.debugService.getViewModel().focusedSession;
			// If there is a focusedSession focus on that one, otherwise just show any other not ignored session
			if (focusedSession) {
				session = focusedSession;
			} else if (!treeInput || sessionsToIgnore.has(treeInput)) {
				session = this.debugService.getModel().getSessions(true).find(s => !sessionsToIgnore.has(s));
			}
		}
		if (session) {
			this.replElementsChangeListener?.dispose();
			this.replElementsChangeListener = session.onDidChangeReplElements(() => {
				this.refreshReplElements(session.getReplElements().length === 0);
			});

			if (this.tree && treeInput !== session) {
				try {
					await this.tree.setInput(session);
				} catch (err) {
					// Ignore error because this may happen multiple times while refreshing,
					// then changing the root may fail. Log to help with debugging if needed.
					this.logService.error(err);
				}
				revealLastElement(this.tree);
			}
		}

		this.replInput?.updateOptions({ readOnly: this.isReadonly });
		this.updateInputDecoration();
	}

	async clearRepl(): Promise<void> {
		const session = this.tree?.getInput();
		if (session) {
			session.removeReplExpressions();
			if (session.state === State.Inactive) {
				// Ignore inactive sessions which got cleared - so they are not shown any more
				sessionsToIgnore.add(session);
				await this.selectSession();
				this.multiSessionRepl.set(this.isMultiSessionView);
			}
		}
		this.replInput.focus();
	}

	acceptReplInput(): void {
		const session = this.tree?.getInput();
		if (session && !this.isReadonly) {
			session.addReplExpression(this.debugService.getViewModel().focusedStackFrame, this.replInput.getValue());
			revealLastElement(this.tree!);
			this.history.add(this.replInput.getValue());
			this.replInput.setValue('');
			if (this.bodyContentDimension) {
				// Trigger a layout to shrink a potential multi line input
				this.layoutBodyContent(this.bodyContentDimension.height, this.bodyContentDimension.width);
			}
		}
	}

	sendReplInput(input: string): void {
		const session = this.tree?.getInput();
		if (session && !this.isReadonly) {
			session.addReplExpression(this.debugService.getViewModel().focusedStackFrame, input);
			revealLastElement(this.tree!);
			this.history.add(input);
		}
	}

	getVisibleContent(): string {
		let text = '';
		if (this.model && this.tree) {
			const lineDelimiter = this.textResourcePropertiesService.getEOL(this.model.uri);
			const traverseAndAppend = (node: ITreeNode<IReplElement, FuzzyScore>) => {
				node.children.forEach(child => {
					if (child.visible) {
						text += child.element.toString().trimRight() + lineDelimiter;
						if (!child.collapsed && child.children.length) {
							traverseAndAppend(child);
						}
					}
				});
			};
			traverseAndAppend(this.tree.getNode());
		}

		return removeAnsiEscapeCodes(text);
	}

	protected layoutBodyContent(height: number, width: number): void {
		this.bodyContentDimension = new dom.Dimension(width, height);
		const replInputHeight = Math.min(this.replInput.getContentHeight(), height);
		if (this.tree) {
			const lastElementVisible = this.tree.scrollTop + this.tree.renderHeight >= this.tree.scrollHeight;
			const treeHeight = height - replInputHeight;
			this.tree.getHTMLElement().style.height = `${treeHeight}px`;
			this.tree.layout(treeHeight, width);
			if (lastElementVisible) {
				revealLastElement(this.tree);
			}
		}
		this.replInputContainer.style.height = `${replInputHeight}px`;

		this.replInput.layout({ width: width - 30, height: replInputHeight });
	}

	collapseAll(): void {
		this.tree?.collapseAll();
	}

	getDebugSession(): IDebugSession | undefined {
		return this.tree?.getInput();
	}

	getReplInput(): CodeEditorWidget {
		return this.replInput;
	}

	getReplDataSource(): IAsyncDataSource<IDebugSession, IReplElement> | undefined {
		return this.replDataSource;
	}

	getFocusedElement(): IReplElement | undefined {
		return this.tree?.getFocus()?.[0];
	}

	focusTree(): void {
		this.tree?.domFocus();
	}

	override async focus(): Promise<void> {
		super.focus();
		await timeout(0); // wait a task for the repl to get attached to the DOM, #83387
		this.replInput.focus();
	}

	override createActionViewItem(action: IAction): IActionViewItem | undefined {
		if (action.id === selectReplCommandId) {
			const session = (this.tree ? this.tree.getInput() : undefined) ?? this.debugService.getViewModel().focusedSession;
			return this.instantiationService.createInstance(SelectReplActionViewItem, action, session);
		}

		return super.createActionViewItem(action);
	}

	private get isMultiSessionView(): boolean {
		return this.debugService.getModel().getSessions(true).filter(s => s.hasSeparateRepl() && !sessionsToIgnore.has(s)).length > 1;
	}

	// --- Cached locals

	@memoize
	private get refreshScheduler(): RunOnceScheduler {
		const autoExpanded = new Set<string>();
		return new RunOnceScheduler(async () => {
			if (!this.tree || !this.tree.getInput() || !this.isVisible()) {
				return;
			}

			await this.tree.updateChildren(undefined, true, false, { diffIdentityProvider: identityProvider });

			const session = this.tree.getInput();
			if (session) {
				// Automatically expand repl group elements when specified
				const autoExpandElements = async (elements: IReplElement[]) => {
					for (const element of elements) {
						if (element instanceof ReplGroup) {
							if (element.autoExpand && !autoExpanded.has(element.getId())) {
								autoExpanded.add(element.getId());
								await this.tree!.expand(element);
							}
							if (!this.tree!.isCollapsed(element)) {
								// Repl groups can have children which are repl groups thus we might need to expand those as well
								await autoExpandElements(element.getChildren());
							}
						}
					}
				};
				await autoExpandElements(session.getReplElements());
			}
			// Repl elements count changed, need to update filter stats on the badge
			const { total, filtered } = this.getFilterStats();
			this.filterWidget.updateBadge(total === filtered || total === 0 ? undefined : localize('showing filtered repl lines', "Showing {0} of {1}", filtered, total));
		}, Repl.REFRESH_DELAY);
	}

	// --- Creation

	override render(): void {
		super.render();
		this._register(registerNavigableContainer({
			name: 'repl',
			focusNotifiers: [this, this.filterWidget],
			focusNextWidget: () => {
				const element = this.tree?.getHTMLElement();
				if (this.filterWidget.hasFocus()) {
					this.tree?.domFocus();
				} else if (element && dom.isActiveElement(element)) {
					this.focus();
				}
			},
			focusPreviousWidget: () => {
				const element = this.tree?.getHTMLElement();
				if (this.replInput.hasTextFocus()) {
					this.tree?.domFocus();
				} else if (element && dom.isActiveElement(element)) {
					this.focusFilter();
				}
			}
		}));
	}

	protected override renderBody(parent: HTMLElement): void {
		super.renderBody(parent);
		this.container = dom.append(parent, $('.repl'));
		this.treeContainer = dom.append(this.container, $(`.repl-tree.${MOUSE_CURSOR_TEXT_CSS_CLASS_NAME}`));
		this.createReplInput(this.container);
		this.createReplTree();
	}

	private createReplTree(): void {
		this.replDelegate = new ReplDelegate(this.configurationService, this.replOptions);
		const wordWrap = this.configurationService.getValue<IDebugConfiguration>('debug').console.wordWrap;
		this.treeContainer.classList.toggle('word-wrap', wordWrap);
		const expressionRenderer = this.instantiationService.createInstance(DebugExpressionRenderer);
		this.replDataSource = new ReplDataSource();

		const tree = this.tree = this.instantiationService.createInstance(
			WorkbenchAsyncDataTree<IDebugSession, IReplElement, FuzzyScore>,
			'DebugRepl',
			this.treeContainer,
			this.replDelegate,
			[
				this.instantiationService.createInstance(ReplVariablesRenderer, expressionRenderer),
				this.instantiationService.createInstance(ReplOutputElementRenderer, expressionRenderer),
				new ReplEvaluationInputsRenderer(),
				this.instantiationService.createInstance(ReplGroupRenderer, expressionRenderer),
				new ReplEvaluationResultsRenderer(expressionRenderer),
				new ReplRawObjectsRenderer(expressionRenderer),
			],
			this.replDataSource,
			{
				filter: this.filter,
				accessibilityProvider: new ReplAccessibilityProvider(),
				identityProvider,
				userSelection: true,
				mouseSupport: false,
				findWidgetEnabled: true,
				keyboardNavigationLabelProvider: { getKeyboardNavigationLabel: (e: IReplElement) => e.toString(true) },
				horizontalScrolling: !wordWrap,
				setRowLineHeight: false,
				supportDynamicHeights: wordWrap,
				overrideStyles: this.getLocationBasedColors().listOverrideStyles
			});

		this._register(tree.onDidChangeContentHeight(() => {
			if (tree.scrollHeight !== this.previousTreeScrollHeight) {
				// Due to rounding, the scrollTop + renderHeight will not exactly match the scrollHeight.
				// Consider the tree to be scrolled all the way down if it is within 2px of the bottom.
				const lastElementWasVisible = tree.scrollTop + tree.renderHeight >= this.previousTreeScrollHeight - 2;
				if (lastElementWasVisible) {
					setTimeout(() => {
						// Can't set scrollTop during this event listener, the list might overwrite the change
						revealLastElement(tree);
					}, 0);
				}
			}

			this.previousTreeScrollHeight = tree.scrollHeight;
		}));

		this._register(tree.onContextMenu(e => this.onContextMenu(e)));
		this._register(tree.onDidChangeFindOpenState((open) => this.findIsOpen = open));

		let lastSelectedString: string;
		this._register(tree.onMouseClick(() => {
			if (this.findIsOpen) {
				return;
			}
			const selection = dom.getWindow(this.treeContainer).getSelection();
			if (!selection || selection.type !== 'Range' || lastSelectedString === selection.toString()) {
				// only focus the input if the user is not currently selecting and find isn't open.
				this.replInput.focus();
			}
			lastSelectedString = selection ? selection.toString() : '';
		}));
		// Make sure to select the session if debugging is already active
		this.selectSession();
		this.styleElement = domStylesheetsJs.createStyleSheet(this.container);
		this.onDidStyleChange();
	}

	private createReplInput(container: HTMLElement): void {
		this.replInputContainer = dom.append(container, $('.repl-input-wrapper'));
		dom.append(this.replInputContainer, $('.repl-input-chevron' + ThemeIcon.asCSSSelector(debugConsoleEvaluationPrompt)));

		const { historyNavigationBackwardsEnablement, historyNavigationForwardsEnablement } = this._register(registerAndCreateHistoryNavigationContext(this.scopedContextKeyService, this));
		this.setHistoryNavigationEnablement = enabled => {
			historyNavigationBackwardsEnablement.set(enabled);
			historyNavigationForwardsEnablement.set(enabled);
		};
		CONTEXT_IN_DEBUG_REPL.bindTo(this.scopedContextKeyService).set(true);

		this.scopedInstantiationService = this._register(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, this.scopedContextKeyService])));
		const options = getSimpleEditorOptions(this.configurationService);
		options.readOnly = true;
		options.suggest = { showStatusBar: true };
		const config = this.configurationService.getValue<IDebugConfiguration>('debug');
		options.acceptSuggestionOnEnter = config.console.acceptSuggestionOnEnter === 'on' ? 'on' : 'off';
		options.ariaLabel = this.getAriaLabel();

		this.replInput = this.scopedInstantiationService.createInstance(CodeEditorWidget, this.replInputContainer, options, getSimpleCodeEditorWidgetOptions());

		let lastContentHeight = -1;
		this._register(this.replInput.onDidChangeModelContent(() => {
			const model = this.replInput.getModel();
			this.setHistoryNavigationEnablement(!!model && model.getValue() === '');

			const contentHeight = this.replInput.getContentHeight();
			if (contentHeight !== lastContentHeight) {
				lastContentHeight = contentHeight;
				if (this.bodyContentDimension) {
					this.layoutBodyContent(this.bodyContentDimension.height, this.bodyContentDimension.width);
				}
			}
		}));
		// We add the input decoration only when the focus is in the input #61126
		this._register(this.replInput.onDidFocusEditorText(() => this.updateInputDecoration()));
		this._register(this.replInput.onDidBlurEditorText(() => this.updateInputDecoration()));

		this._register(dom.addStandardDisposableListener(this.replInputContainer, dom.EventType.FOCUS, () => this.replInputContainer.classList.add('synthetic-focus')));
		this._register(dom.addStandardDisposableListener(this.replInputContainer, dom.EventType.BLUR, () => this.replInputContainer.classList.remove('synthetic-focus')));
	}

	private getAriaLabel(): string {
		let ariaLabel = localize('debugConsole', "Debug Console");
		if (!this.configurationService.getValue(AccessibilityVerbositySettingId.Debug)) {
			return ariaLabel;
		}
		const keybinding = this.keybindingService.lookupKeybinding(AccessibilityCommandId.OpenAccessibilityHelp)?.getAriaLabel();
		if (keybinding) {
			ariaLabel = localize('commentLabelWithKeybinding', "{0}, use ({1}) for accessibility help", ariaLabel, keybinding);
		} else {
			ariaLabel = localize('commentLabelWithKeybindingNoKeybinding', "{0}, run the command Open Accessibility Help which is currently not triggerable via keybinding.", ariaLabel);
		}

		return ariaLabel;
	}

	private onContextMenu(e: ITreeContextMenuEvent<IReplElement>): void {
		const actions = getFlatContextMenuActions(this.menu.getActions({ arg: e.element, shouldForwardArgs: false }));
		this.contextMenuService.showContextMenu({
			getAnchor: () => e.anchor,
			getActions: () => actions,
			getActionsContext: () => e.element
		});
	}

	// --- Update

	private refreshReplElements(noDelay: boolean): void {
		if (this.tree && this.isVisible()) {
			if (this.refreshScheduler.isScheduled()) {
				return;
			}

			this.refreshScheduler.schedule(noDelay ? 0 : undefined);
		}
	}

	private updateInputDecoration(): void {
		if (!this.replInput) {
			return;
		}

		const decorations: IDecorationOptions[] = [];
		if (this.isReadonly && this.replInput.hasTextFocus() && !this.replInput.getValue()) {
			const transparentForeground = resolveColorValue(editorForeground, this.themeService.getColorTheme())?.transparent(0.4);
			decorations.push({
				range: {
					startLineNumber: 0,
					endLineNumber: 0,
					startColumn: 0,
					endColumn: 1
				},
				renderOptions: {
					after: {
						contentText: localize('startDebugFirst', "Please start a debug session to evaluate expressions"),
						color: transparentForeground ? transparentForeground.toString() : undefined
					}
				}
			});
		}

		this.replInput.setDecorationsByType('repl-decoration', DECORATION_KEY, decorations);
	}

	override saveState(): void {
		const replHistory = this.history.getHistory();
		if (replHistory.length) {
			this.storageService.store(HISTORY_STORAGE_KEY, JSON.stringify(replHistory), StorageScope.WORKSPACE, StorageTarget.MACHINE);
		} else {
			this.storageService.remove(HISTORY_STORAGE_KEY, StorageScope.WORKSPACE);
		}
		const filterHistory = this.filterWidget.getHistory();
		if (filterHistory.length) {
			this.storageService.store(FILTER_HISTORY_STORAGE_KEY, JSON.stringify(filterHistory), StorageScope.WORKSPACE, StorageTarget.MACHINE);
		} else {
			this.storageService.remove(FILTER_HISTORY_STORAGE_KEY, StorageScope.WORKSPACE);
		}
		const filterValue = this.filterWidget.getFilterText();
		if (filterValue) {
			this.storageService.store(FILTER_VALUE_STORAGE_KEY, filterValue, StorageScope.WORKSPACE, StorageTarget.MACHINE);
		} else {
			this.storageService.remove(FILTER_VALUE_STORAGE_KEY, StorageScope.WORKSPACE);
		}

		super.saveState();
	}

	override dispose(): void {
		this.replInput?.dispose(); // Disposed before rendered? #174558
		this.replElementsChangeListener?.dispose();
		this.refreshScheduler.dispose();
		this.modelChangeListener.dispose();
		super.dispose();
	}
}

class ReplOptions extends Disposable implements IReplOptions {
	private static readonly lineHeightEm = 1.4;

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange = this._onDidChange.event;

	private _replConfig!: IReplConfiguration;
	public get replConfiguration(): IReplConfiguration {
		return this._replConfig;
	}

	constructor(
		viewId: string,
		private readonly backgroundColorDelegate: () => string,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IThemeService private readonly themeService: IThemeService,
		@IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService
	) {
		super();

		this._register(this.themeService.onDidColorThemeChange(e => this.update()));
		this._register(this.viewDescriptorService.onDidChangeLocation(e => {
			if (e.views.some(v => v.id === viewId)) {
				this.update();
			}
		}));
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('debug.console.lineHeight') || e.affectsConfiguration('debug.console.fontSize') || e.affectsConfiguration('debug.console.fontFamily')) {
				this.update();
			}
		}));
		this.update();
	}

	private update() {
		const debugConsole = this.configurationService.getValue<IDebugConfiguration>('debug').console;
		this._replConfig = {
			fontSize: debugConsole.fontSize,
			fontFamily: debugConsole.fontFamily,
			lineHeight: debugConsole.lineHeight ? debugConsole.lineHeight : ReplOptions.lineHeightEm * debugConsole.fontSize,
			cssLineHeight: debugConsole.lineHeight ? `${debugConsole.lineHeight}px` : `${ReplOptions.lineHeightEm}em`,
			backgroundColor: this.themeService.getColorTheme().getColor(this.backgroundColorDelegate()),
			fontSizeForTwistie: debugConsole.fontSize * ReplOptions.lineHeightEm / 2 - 8
		};
		this._onDidChange.fire();
	}
}

// Repl actions and commands

class AcceptReplInputAction extends EditorAction {

	constructor() {
		super({
			id: 'repl.action.acceptInput',
			label: localize2({ key: 'actions.repl.acceptInput', comment: ['Apply input from the debug console input box'] }, "Debug Console: Accept Input"),
			precondition: CONTEXT_IN_DEBUG_REPL,
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: KeyCode.Enter,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	run(accessor: ServicesAccessor, editor: ICodeEditor): void | Promise<void> {
		SuggestController.get(editor)?.cancelSuggestWidget();
		const repl = getReplView(accessor.get(IViewsService));
		repl?.acceptReplInput();
	}
}

class FilterReplAction extends ViewAction<Repl> {

	constructor() {
		super({
			viewId: REPL_VIEW_ID,
			id: 'repl.action.filter',
			title: localize('repl.action.filter', "Debug Console: Focus Filter"),
			precondition: CONTEXT_IN_DEBUG_REPL,
			keybinding: [{
				when: EditorContextKeys.textInputFocus,
				primary: KeyMod.CtrlCmd | KeyCode.KeyF,
				weight: KeybindingWeight.EditorContrib
			}]
		});
	}

	runInView(accessor: ServicesAccessor, repl: Repl): void | Promise<void> {
		repl.focusFilter();
	}
}


class FindReplAction extends ViewAction<Repl> {

	constructor() {
		super({
			viewId: REPL_VIEW_ID,
			id: 'repl.action.find',
			title: localize('repl.action.find', "Debug Console: Focus Find"),
			precondition: CONTEXT_IN_DEBUG_REPL,
			keybinding: [{
				when: ContextKeyExpr.or(CONTEXT_IN_DEBUG_REPL, ContextKeyExpr.equals('focusedView', 'workbench.panel.repl.view')),
				primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyF,
				weight: KeybindingWeight.EditorContrib
			}],
			icon: Codicon.search,
			menu: [{
				id: MenuId.ViewTitle,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', REPL_VIEW_ID),
				order: 15
			}, {
				id: MenuId.DebugConsoleContext,
				group: 'z_commands',
				order: 25
			}],
		});
	}

	runInView(accessor: ServicesAccessor, view: Repl): void | Promise<void> {
		view.openFind();
	}
}

class ReplCopyAllAction extends EditorAction {

	constructor() {
		super({
			id: 'repl.action.copyAll',
			label: localize('actions.repl.copyAll', "Debug: Console Copy All"),
			alias: 'Debug Console Copy All',
			precondition: CONTEXT_IN_DEBUG_REPL,
		});
	}

	run(accessor: ServicesAccessor, editor: ICodeEditor): void | Promise<void> {
		const clipboardService = accessor.get(IClipboardService);
		const repl = getReplView(accessor.get(IViewsService));
		if (repl) {
			return clipboardService.writeText(repl.getVisibleContent());
		}
	}
}

registerEditorAction(AcceptReplInputAction);
registerEditorAction(ReplCopyAllAction);
registerAction2(FilterReplAction);
registerAction2(FindReplAction);

class SelectReplActionViewItem extends FocusSessionActionViewItem {

	protected override getSessions(): ReadonlyArray<IDebugSession> {
		return this.debugService.getModel().getSessions(true).filter(s => s.hasSeparateRepl() && !sessionsToIgnore.has(s));
	}

	protected override mapFocusedSessionToSelected(focusedSession: IDebugSession): IDebugSession {
		while (focusedSession.parentSession && !focusedSession.hasSeparateRepl()) {
			focusedSession = focusedSession.parentSession;
		}
		return focusedSession;
	}
}

export function getReplView(viewsService: IViewsService): Repl | undefined {
	return viewsService.getActiveViewWithId(REPL_VIEW_ID) as Repl ?? undefined;
}

const selectReplCommandId = 'workbench.action.debug.selectRepl';
registerAction2(class extends ViewAction<Repl> {
	constructor() {
		super({
			id: selectReplCommandId,
			viewId: REPL_VIEW_ID,
			title: localize('selectRepl', "Select Debug Console"),
			f1: false,
			menu: {
				id: MenuId.ViewTitle,
				group: 'navigation',
				when: ContextKeyExpr.and(ContextKeyExpr.equals('view', REPL_VIEW_ID), CONTEXT_MULTI_SESSION_REPL),
				order: 20
			}
		});
	}

	async runInView(accessor: ServicesAccessor, view: Repl, session: IDebugSession | undefined) {
		const debugService = accessor.get(IDebugService);
		// If session is already the focused session we need to manualy update the tree since view model will not send a focused change event
		if (session && session.state !== State.Inactive && session !== debugService.getViewModel().focusedSession) {
			session = resolveChildSession(session, debugService.getModel().getSessions());
			await debugService.focusStackFrame(undefined, undefined, session, { explicit: true });
		}
		// Need to select the session in the view since the focussed session might not have changed
		await view.selectSession(session);
	}
});

registerAction2(class extends ViewAction<Repl> {
	constructor() {
		super({
			id: 'workbench.debug.panel.action.clearReplAction',
			viewId: REPL_VIEW_ID,
			title: localize2('clearRepl', 'Clear Console'),
			metadata: {
				description: localize2('clearRepl.descriotion', 'Clears all program output from your debug REPL')
			},
			f1: true,
			icon: debugConsoleClearAll,
			menu: [{
				id: MenuId.ViewTitle,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', REPL_VIEW_ID),
				order: 30
			}, {
				id: MenuId.DebugConsoleContext,
				group: 'z_commands',
				order: 20
			}],
			keybinding: [{
				primary: 0,
				mac: { primary: KeyMod.CtrlCmd | KeyCode.KeyK },
				// Weight is higher than work workbench contributions so the keybinding remains
				// highest priority when chords are registered afterwards
				weight: KeybindingWeight.WorkbenchContrib + 1,
				when: ContextKeyExpr.equals('focusedView', 'workbench.panel.repl.view')
			}],
		});
	}

	runInView(_accessor: ServicesAccessor, view: Repl): void {
		const accessibilitySignalService = _accessor.get(IAccessibilitySignalService);
		view.clearRepl();
		accessibilitySignalService.playSignal(AccessibilitySignal.clear);
	}
});

registerAction2(class extends ViewAction<Repl> {
	constructor() {
		super({
			id: 'debug.collapseRepl',
			title: localize('collapse', "Collapse All"),
			viewId: REPL_VIEW_ID,
			menu: {
				id: MenuId.DebugConsoleContext,
				group: 'z_commands',
				order: 10
			}
		});
	}

	runInView(_accessor: ServicesAccessor, view: Repl): void {
		view.collapseAll();
		view.focus();
	}
});

registerAction2(class extends ViewAction<Repl> {
	constructor() {
		super({
			id: 'debug.replPaste',
			title: localize('paste', "Paste"),
			viewId: REPL_VIEW_ID,
			precondition: CONTEXT_DEBUG_STATE.notEqualsTo(getStateLabel(State.Inactive)),
			menu: {
				id: MenuId.DebugConsoleContext,
				group: '2_cutcopypaste',
				order: 30
			}
		});
	}

	async runInView(accessor: ServicesAccessor, view: Repl): Promise<void> {
		const clipboardService = accessor.get(IClipboardService);
		const clipboardText = await clipboardService.readText();
		if (clipboardText) {
			const replInput = view.getReplInput();
			replInput.setValue(replInput.getValue().concat(clipboardText));
			view.focus();
			const model = replInput.getModel();
			const lineNumber = model ? model.getLineCount() : 0;
			const column = model?.getLineMaxColumn(lineNumber);
			if (typeof lineNumber === 'number' && typeof column === 'number') {
				replInput.setPosition({ lineNumber, column });
			}
		}
	}
});

registerAction2(class extends ViewAction<Repl> {
	constructor() {
		super({
			id: 'workbench.debug.action.copyAll',
			title: localize('copyAll', "Copy All"),
			viewId: REPL_VIEW_ID,
			menu: {
				id: MenuId.DebugConsoleContext,
				group: '2_cutcopypaste',
				order: 20
			}
		});
	}

	async runInView(accessor: ServicesAccessor, view: Repl): Promise<void> {
		const clipboardService = accessor.get(IClipboardService);
		await clipboardService.writeText(view.getVisibleContent());
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'debug.replCopy',
			title: localize('copy', "Copy"),
			menu: {
				id: MenuId.DebugConsoleContext,
				group: '2_cutcopypaste',
				order: 10
			}
		});
	}

	async run(accessor: ServicesAccessor, element: IReplElement): Promise<void> {
		const clipboardService = accessor.get(IClipboardService);
		const debugService = accessor.get(IDebugService);
		const nativeSelection = dom.getActiveWindow().getSelection();
		const selectedText = nativeSelection?.toString();
		if (selectedText && selectedText.length > 0) {
			return clipboardService.writeText(selectedText);
		} else if (element) {
			const retValue = await this.tryEvaluateAndCopy(debugService, element);
			const textToCopy = retValue || removeAnsiEscapeCodes(element.toString());
			return clipboardService.writeText(textToCopy);
		}
	}

	private async tryEvaluateAndCopy(debugService: IDebugService, element: IReplElement): Promise<string | undefined> {
		// todo: we should expand DAP to allow copying more types here (#187784)
		if (!(element instanceof ReplEvaluationResult)) {
			return;
		}

		const stackFrame = debugService.getViewModel().focusedStackFrame;
		const session = debugService.getViewModel().focusedSession;
		if (!stackFrame || !session || !session.capabilities.supportsClipboardContext) {
			return;
		}

		try {
			const evaluation = await session.evaluate(element.originalExpression, stackFrame.frameId, 'clipboard');
			return evaluation?.body.result;
		} catch (e) {
			return;
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: FOCUS_REPL_ID,
			category: DEBUG_COMMAND_CATEGORY,
			title: localize2({ comment: ['Debug is a noun in this context, not a verb.'], key: 'debugFocusConsole' }, "Focus on Debug Console View"),
		});
	}

	override async run(accessor: ServicesAccessor) {
		const viewsService = accessor.get(IViewsService);
		const repl = await viewsService.openView<Repl>(REPL_VIEW_ID);
		await repl?.focus();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/replAccessibilityHelp.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/replAccessibilityHelp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { AccessibleViewProviderId, AccessibleViewType, IAccessibleViewContentProvider } from '../../../../platform/accessibility/browser/accessibleView.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { getReplView, Repl } from './repl.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { localize } from '../../../../nls.js';

export class ReplAccessibilityHelp implements IAccessibleViewImplementation {
	priority = 120;
	name = 'replHelp';
	when = ContextKeyExpr.equals('focusedView', 'workbench.panel.repl.view');
	type: AccessibleViewType = AccessibleViewType.Help;
	getProvider(accessor: ServicesAccessor) {
		const viewsService = accessor.get(IViewsService);
		const replView = getReplView(viewsService);
		if (!replView) {
			return undefined;
		}
		return new ReplAccessibilityHelpProvider(replView);
	}
}

class ReplAccessibilityHelpProvider extends Disposable implements IAccessibleViewContentProvider {
	public readonly id = AccessibleViewProviderId.ReplHelp;
	public readonly verbositySettingKey = AccessibilityVerbositySettingId.Debug;
	public readonly options = { type: AccessibleViewType.Help };
	private _treeHadFocus = false;
	constructor(private readonly _replView: Repl) {
		super();
		this._treeHadFocus = !!_replView.getFocusedElement();
	}

	public onClose(): void {
		if (this._treeHadFocus) {
			return this._replView.focusTree();
		}
		this._replView.getReplInput().focus();
	}

	public provideContent(): string {
		return [
			localize('repl.help', "The debug console is a Read-Eval-Print-Loop that allows you to evaluate expressions and run commands and can be focused with{0}.", '<keybinding:workbench.panel.repl.view.focus>'),
			localize('repl.output', "The debug console output can be navigated to from the input field with the Focus Previous Widget command{0}.", '<keybinding:widgetNavigation.focusPrevious>'),
			localize('repl.input', "The debug console input can be navigated to from the output with the Focus Next Widget command{0}.", '<keybinding:widgetNavigation.focusNext>'),
			localize('repl.history', "The debug console output history can be navigated with the up and down arrow keys."),
			localize('repl.accessibleView', "The Open Accessible View command{0} will allow character by character navigation of the console output.", '<keybinding:editor.action.accessibleView>'),
			localize('repl.showRunAndDebug', "The Show Run and Debug view command{0} will open the Run and Debug view and provides more information about debugging.", '<keybinding:workbench.view.debug>'),
			localize('repl.clear', "The Debug: Clear Console command{0} will clear the console output.", '<keybinding:workbench.debug.panel.action.clearReplAction>'),
			localize('repl.lazyVariables', "The setting `debug.expandLazyVariables` controls whether variables are evaluated automatically. This is enabled by default when using a screen reader."),
		].join('\n');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/replAccessibleView.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/replAccessibleView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AccessibleViewProviderId, AccessibleViewType, IAccessibleViewContentProvider, IAccessibleViewService } from '../../../../platform/accessibility/browser/accessibleView.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { IReplElement } from '../common/debug.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { getReplView, Repl } from './repl.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Position } from '../../../../editor/common/core/position.js';

export class ReplAccessibleView implements IAccessibleViewImplementation {
	priority = 70;
	name = 'debugConsole';
	when = ContextKeyExpr.equals('focusedView', 'workbench.panel.repl.view');
	type: AccessibleViewType = AccessibleViewType.View;
	getProvider(accessor: ServicesAccessor) {
		const viewsService = accessor.get(IViewsService);
		const accessibleViewService = accessor.get(IAccessibleViewService);
		const replView = getReplView(viewsService);
		if (!replView) {
			return undefined;
		}

		const focusedElement = replView.getFocusedElement();
		return new ReplOutputAccessibleViewProvider(replView, focusedElement, accessibleViewService);
	}
}

class ReplOutputAccessibleViewProvider extends Disposable implements IAccessibleViewContentProvider {
	public readonly id = AccessibleViewProviderId.Repl;
	private _content: string | undefined;
	private readonly _onDidChangeContent: Emitter<void> = this._register(new Emitter<void>());
	public readonly onDidChangeContent: Event<void> = this._onDidChangeContent.event;
	private readonly _onDidResolveChildren: Emitter<void> = this._register(new Emitter<void>());
	public readonly onDidResolveChildren: Event<void> = this._onDidResolveChildren.event;

	public readonly verbositySettingKey = AccessibilityVerbositySettingId.Debug;
	public readonly options = {
		type: AccessibleViewType.View
	};

	private _elementPositionMap: Map<string, Position> = new Map<string, Position>();
	private _treeHadFocus = false;

	constructor(
		private readonly _replView: Repl,
		private readonly _focusedElement: IReplElement | undefined,
		@IAccessibleViewService private readonly _accessibleViewService: IAccessibleViewService) {
		super();
		this._treeHadFocus = !!_focusedElement;
	}
	public provideContent(): string {
		const debugSession = this._replView.getDebugSession();
		if (!debugSession) {
			return 'No debug session available.';
		}
		const elements = debugSession.getReplElements();
		if (!elements.length) {
			return 'No output in the debug console.';
		}
		if (!this._content) {
			this._updateContent(elements);
		}
		// Content is loaded asynchronously, so we need to check if it's available or fallback to the elements that are already available.
		return this._content ?? elements.map(e => e.toString(true)).join('\n');
	}

	public onClose(): void {
		this._content = undefined;
		this._elementPositionMap.clear();
		if (this._treeHadFocus) {
			return this._replView.focusTree();
		}
		this._replView.getReplInput().focus();
	}

	public onOpen(): void {
		// Children are resolved async, so we need to update the content when they are resolved.
		this._register(this.onDidResolveChildren(() => {
			this._onDidChangeContent.fire();
			queueMicrotask(() => {
				if (this._focusedElement) {
					const position = this._elementPositionMap.get(this._focusedElement.getId());
					if (position) {
						this._accessibleViewService.setPosition(position, true);
					}
				}
			});
		}));
	}

	private async _updateContent(elements: IReplElement[]) {
		const dataSource = this._replView.getReplDataSource();
		if (!dataSource) {
			return;
		}
		let line = 1;
		const content: string[] = [];
		for (const e of elements) {
			content.push(e.toString().replace(/\n/g, ''));
			this._elementPositionMap.set(e.getId(), new Position(line, 1));
			line++;
			if (dataSource.hasChildren(e)) {
				const childContent: string[] = [];
				const children = await dataSource.getChildren(e);
				for (const child of children) {
					const id = child.getId();
					if (!this._elementPositionMap.has(id)) {
						// don't overwrite parent position
						this._elementPositionMap.set(id, new Position(line, 1));
					}
					childContent.push('  ' + child.toString());
					line++;
				}
				content.push(childContent.join('\n'));
			}
		}

		this._content = content.join('\n');
		this._onDidResolveChildren.fire();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/replFilter.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/replFilter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FuzzyScore, matchesFuzzy } from '../../../../base/common/filters.js';
import { splitGlobAware } from '../../../../base/common/glob.js';
import { ITreeFilter, TreeVisibility, TreeFilterResult } from '../../../../base/browser/ui/tree/tree.js';
import { IReplElement } from '../common/debug.js';
import { ReplEvaluationResult, ReplEvaluationInput } from '../common/replModel.js';
import { Variable } from '../common/debugModel.js';


type ParsedQuery = {
	type: 'include' | 'exclude';
	query: string;
};

export class ReplFilter implements ITreeFilter<IReplElement, FuzzyScore> {

	static matchQuery = matchesFuzzy;

	private _parsedQueries: ParsedQuery[] = [];
	set filterQuery(query: string) {
		this._parsedQueries = [];
		query = query.trim();

		if (query && query !== '') {
			const filters = splitGlobAware(query, ',').map(s => s.trim()).filter(s => !!s.length);
			for (const f of filters) {
				if (f.startsWith('\\')) {
					this._parsedQueries.push({ type: 'include', query: f.slice(1) });
				} else if (f.startsWith('!')) {
					this._parsedQueries.push({ type: 'exclude', query: f.slice(1) });
				} else {
					this._parsedQueries.push({ type: 'include', query: f });
				}
			}
		}
	}

	filter(element: IReplElement, parentVisibility: TreeVisibility): TreeFilterResult<FuzzyScore> {
		if (element instanceof ReplEvaluationInput || element instanceof ReplEvaluationResult || element instanceof Variable) {
			// Only filter the output events, everything else is visible https://github.com/microsoft/vscode/issues/105863
			return TreeVisibility.Visible;
		}

		let includeQueryPresent = false;
		let includeQueryMatched = false;

		const text = element.toString(true);

		for (const { type, query } of this._parsedQueries) {
			if (type === 'exclude' && ReplFilter.matchQuery(query, text)) {
				// If exclude query matches, ignore all other queries and hide
				return false;
			} else if (type === 'include') {
				includeQueryPresent = true;
				if (ReplFilter.matchQuery(query, text)) {
					includeQueryMatched = true;
				}
			}
		}

		return includeQueryPresent ? includeQueryMatched : (typeof parentVisibility !== 'undefined' ? parentVisibility : TreeVisibility.Visible);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/replViewer.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/replViewer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { CountBadge } from '../../../../base/browser/ui/countBadge/countBadge.js';
import { HighlightedLabel, IHighlight } from '../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { IManagedHover } from '../../../../base/browser/ui/hover/hover.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { CachedListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { IAsyncDataSource, ITreeNode, ITreeRenderer } from '../../../../base/browser/ui/tree/tree.js';
import { createMatches, FuzzyScore } from '../../../../base/common/filters.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { basename } from '../../../../base/common/path.js';
import severity from '../../../../base/common/severity.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { defaultCountBadgeStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IDebugConfiguration, IDebugService, IDebugSession, IExpression, IExpressionContainer, INestingReplElement, IReplElement, IReplElementSource, IReplOptions } from '../common/debug.js';
import { Variable } from '../common/debugModel.js';
import { RawObjectReplElement, ReplEvaluationInput, ReplEvaluationResult, ReplGroup, ReplOutputElement, ReplVariableElement } from '../common/replModel.js';
import { AbstractExpressionsRenderer, IExpressionTemplateData, IInputBoxOptions } from './baseDebugView.js';
import { DebugExpressionRenderer } from './debugExpressionRenderer.js';
import { debugConsoleEvaluationInput } from './debugIcons.js';

const $ = dom.$;

interface IReplEvaluationInputTemplateData {
	label: HighlightedLabel;
}

interface IReplGroupTemplateData {
	label: HTMLElement;
	source: SourceWidget;
	elementDisposable?: IDisposable;
}

interface IReplEvaluationResultTemplateData {
	value: HTMLElement;
	elementStore: DisposableStore;
}

interface IOutputReplElementTemplateData {
	container: HTMLElement;
	count: CountBadge;
	countContainer: HTMLElement;
	value: HTMLElement;
	source: SourceWidget;
	getReplElementSource(): IReplElementSource | undefined;
	elementDisposable: DisposableStore;
}

interface IRawObjectReplTemplateData {
	container: HTMLElement;
	expression: HTMLElement;
	name: HTMLElement;
	value: HTMLElement;
	label: HighlightedLabel;
	elementStore: DisposableStore;
}

export class ReplEvaluationInputsRenderer implements ITreeRenderer<ReplEvaluationInput, FuzzyScore, IReplEvaluationInputTemplateData> {
	static readonly ID = 'replEvaluationInput';

	get templateId(): string {
		return ReplEvaluationInputsRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IReplEvaluationInputTemplateData {
		dom.append(container, $('span.arrow' + ThemeIcon.asCSSSelector(debugConsoleEvaluationInput)));
		const input = dom.append(container, $('.expression'));
		const label = new HighlightedLabel(input);
		return { label };
	}

	renderElement(element: ITreeNode<ReplEvaluationInput, FuzzyScore>, index: number, templateData: IReplEvaluationInputTemplateData): void {
		const evaluation = element.element;
		templateData.label.set(evaluation.value, createMatches(element.filterData));
	}

	disposeTemplate(templateData: IReplEvaluationInputTemplateData): void {
		templateData.label.dispose();
	}
}

export class ReplGroupRenderer implements ITreeRenderer<ReplGroup, FuzzyScore, IReplGroupTemplateData> {
	static readonly ID = 'replGroup';

	constructor(
		private readonly expressionRenderer: DebugExpressionRenderer,
		@IInstantiationService private readonly instaService: IInstantiationService,
	) { }

	get templateId(): string {
		return ReplGroupRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IReplGroupTemplateData {
		container.classList.add('group');
		const expression = dom.append(container, $('.output.expression.value-and-source'));
		const label = dom.append(expression, $('span.label'));
		const source = this.instaService.createInstance(SourceWidget, expression);
		return { label, source };
	}

	renderElement(element: ITreeNode<ReplGroup, FuzzyScore>, _index: number, templateData: IReplGroupTemplateData): void {

		templateData.elementDisposable?.dispose();
		const replGroup = element.element;
		dom.clearNode(templateData.label);
		templateData.elementDisposable = this.expressionRenderer.renderValue(templateData.label, replGroup.name, { wasANSI: true, session: element.element.session });
		templateData.source.setSource(replGroup.sourceData);
	}

	disposeTemplate(templateData: IReplGroupTemplateData): void {
		templateData.elementDisposable?.dispose();
		templateData.source.dispose();
	}
}

export class ReplEvaluationResultsRenderer implements ITreeRenderer<ReplEvaluationResult | Variable, FuzzyScore, IReplEvaluationResultTemplateData> {
	static readonly ID = 'replEvaluationResult';

	get templateId(): string {
		return ReplEvaluationResultsRenderer.ID;
	}

	constructor(
		private readonly expressionRenderer: DebugExpressionRenderer,
	) { }

	renderTemplate(container: HTMLElement): IReplEvaluationResultTemplateData {
		const output = dom.append(container, $('.evaluation-result.expression'));
		const value = dom.append(output, $('span.value'));

		return { value, elementStore: new DisposableStore() };
	}

	renderElement(element: ITreeNode<ReplEvaluationResult | Variable, FuzzyScore>, index: number, templateData: IReplEvaluationResultTemplateData): void {
		templateData.elementStore.clear();
		const expression = element.element;
		templateData.elementStore.add(this.expressionRenderer.renderValue(templateData.value, expression, {
			colorize: true,
			hover: false,
			session: element.element.getSession(),
		}));
	}

	disposeTemplate(templateData: IReplEvaluationResultTemplateData): void {
		templateData.elementStore.dispose();
	}
}

export class ReplOutputElementRenderer implements ITreeRenderer<ReplOutputElement, FuzzyScore, IOutputReplElementTemplateData> {
	static readonly ID = 'outputReplElement';

	constructor(
		private readonly expressionRenderer: DebugExpressionRenderer,
		@IInstantiationService private readonly instaService: IInstantiationService,
	) { }

	get templateId(): string {
		return ReplOutputElementRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IOutputReplElementTemplateData {
		const data: IOutputReplElementTemplateData = Object.create(null);
		container.classList.add('output');
		const expression = dom.append(container, $('.output.expression.value-and-source'));

		data.container = container;
		data.countContainer = dom.append(expression, $('.count-badge-wrapper'));
		data.count = new CountBadge(data.countContainer, {}, defaultCountBadgeStyles);
		data.value = dom.append(expression, $('span.value.label'));
		data.source = this.instaService.createInstance(SourceWidget, expression);
		data.elementDisposable = new DisposableStore();

		return data;
	}

	renderElement({ element }: ITreeNode<ReplOutputElement, FuzzyScore>, index: number, templateData: IOutputReplElementTemplateData): void {
		templateData.elementDisposable.clear();
		this.setElementCount(element, templateData);
		templateData.elementDisposable.add(element.onDidChangeCount(() => this.setElementCount(element, templateData)));
		// value
		dom.clearNode(templateData.value);
		// Reset classes to clear ansi decorations since templates are reused
		templateData.value.className = 'value';

		const locationReference = element.expression?.valueLocationReference;
		templateData.elementDisposable.add(this.expressionRenderer.renderValue(templateData.value, element.value, {
			wasANSI: true,
			session: element.session,
			locationReference,
			hover: false,
		}));

		templateData.value.classList.add((element.severity === severity.Warning) ? 'warn' : (element.severity === severity.Error) ? 'error' : (element.severity === severity.Ignore) ? 'ignore' : 'info');
		templateData.source.setSource(element.sourceData);
		templateData.getReplElementSource = () => element.sourceData;
	}

	private setElementCount(element: ReplOutputElement, templateData: IOutputReplElementTemplateData): void {
		if (element.count >= 2) {
			templateData.count.setCount(element.count);
			templateData.countContainer.hidden = false;
		} else {
			templateData.countContainer.hidden = true;
		}
	}

	disposeTemplate(templateData: IOutputReplElementTemplateData): void {
		templateData.source.dispose();
		templateData.elementDisposable.dispose();
		templateData.count.dispose();
	}

	disposeElement(_element: ITreeNode<ReplOutputElement, FuzzyScore>, _index: number, templateData: IOutputReplElementTemplateData): void {
		templateData.elementDisposable.clear();
	}
}

export class ReplVariablesRenderer extends AbstractExpressionsRenderer<IExpression | ReplVariableElement> {

	static readonly ID = 'replVariable';

	get templateId(): string {
		return ReplVariablesRenderer.ID;
	}

	constructor(
		private readonly expressionRenderer: DebugExpressionRenderer,
		@IDebugService debugService: IDebugService,
		@IContextViewService contextViewService: IContextViewService,
		@IHoverService hoverService: IHoverService,
	) {
		super(debugService, contextViewService, hoverService);
	}

	public renderElement(node: ITreeNode<IExpression | ReplVariableElement, FuzzyScore>, _index: number, data: IExpressionTemplateData): void {
		const element = node.element;
		data.elementDisposable.clear();
		super.renderExpressionElement(element instanceof ReplVariableElement ? element.expression : element, node, data);
	}

	protected renderExpression(expression: IExpression | ReplVariableElement, data: IExpressionTemplateData, highlights: IHighlight[]): void {
		const isReplVariable = expression instanceof ReplVariableElement;
		if (isReplVariable || !expression.name) {
			data.label.set('');
			const value = isReplVariable ? expression.expression : expression;
			data.elementDisposable.add(this.expressionRenderer.renderValue(data.value, value, { colorize: true, hover: false, session: expression.getSession() }));
			data.expression.classList.remove('nested-variable');
		} else {
			data.elementDisposable.add(this.expressionRenderer.renderVariable(data, expression as Variable, { showChanged: true, highlights }));
			data.expression.classList.toggle('nested-variable', isNestedVariable(expression));
		}
	}

	protected getInputBoxOptions(expression: IExpression): IInputBoxOptions | undefined {
		return undefined;
	}
}

export class ReplRawObjectsRenderer implements ITreeRenderer<RawObjectReplElement, FuzzyScore, IRawObjectReplTemplateData> {
	static readonly ID = 'rawObject';

	constructor(
		private readonly expressionRenderer: DebugExpressionRenderer,
	) { }

	get templateId(): string {
		return ReplRawObjectsRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IRawObjectReplTemplateData {
		container.classList.add('output');

		const expression = dom.append(container, $('.output.expression'));
		const name = dom.append(expression, $('span.name'));
		const label = new HighlightedLabel(name);
		const value = dom.append(expression, $('span.value'));

		return { container, expression, name, label, value, elementStore: new DisposableStore() };
	}

	renderElement(node: ITreeNode<RawObjectReplElement, FuzzyScore>, index: number, templateData: IRawObjectReplTemplateData): void {
		templateData.elementStore.clear();

		// key
		const element = node.element;
		templateData.label.set(element.name ? `${element.name}:` : '', createMatches(node.filterData));
		if (element.name) {
			templateData.name.textContent = `${element.name}:`;
		} else {
			templateData.name.textContent = '';
		}

		// value
		templateData.elementStore.add(this.expressionRenderer.renderValue(templateData.value, element.value, {
			hover: false,
			session: node.element.getSession(),
		}));
	}

	disposeTemplate(templateData: IRawObjectReplTemplateData): void {
		templateData.elementStore.dispose();
		templateData.label.dispose();
	}
}

function isNestedVariable(element: IReplElement) {
	return element instanceof Variable && (element.parent instanceof ReplEvaluationResult || element.parent instanceof Variable);
}

export class ReplDelegate extends CachedListVirtualDelegate<IReplElement> {

	constructor(
		private readonly configurationService: IConfigurationService,
		private readonly replOptions: IReplOptions
	) {
		super();
	}

	override getHeight(element: IReplElement): number {
		const config = this.configurationService.getValue<IDebugConfiguration>('debug');

		if (!config.console.wordWrap) {
			return this.estimateHeight(element, true);
		}

		return super.getHeight(element);
	}

	/**
	 * With wordWrap enabled, this is an estimate. With wordWrap disabled, this is the real height that the list will use.
	 */
	protected estimateHeight(element: IReplElement, ignoreValueLength = false): number {
		const lineHeight = this.replOptions.replConfiguration.lineHeight;
		const countNumberOfLines = (str: string) => str.match(/\n/g)?.length ?? 0;
		const hasValue = (e: any): e is { value: string } => typeof e.value === 'string';

		if (hasValue(element) && !isNestedVariable(element)) {
			const value = element.value;
			const valueRows = countNumberOfLines(value)
				+ (ignoreValueLength ? 0 : Math.floor(value.length / 70)) // Make an estimate for wrapping
				+ (element instanceof ReplOutputElement ? 0 : 1); // A SimpleReplElement ends in \n if it's a complete line

			return Math.max(valueRows, 1) * lineHeight;
		}

		return lineHeight;
	}

	getTemplateId(element: IReplElement): string {
		if (element instanceof Variable || element instanceof ReplVariableElement) {
			return ReplVariablesRenderer.ID;
		}
		if (element instanceof ReplEvaluationResult) {
			return ReplEvaluationResultsRenderer.ID;
		}
		if (element instanceof ReplEvaluationInput) {
			return ReplEvaluationInputsRenderer.ID;
		}
		if (element instanceof ReplOutputElement) {
			return ReplOutputElementRenderer.ID;
		}
		if (element instanceof ReplGroup) {
			return ReplGroupRenderer.ID;
		}

		return ReplRawObjectsRenderer.ID;
	}

	hasDynamicHeight(element: IReplElement): boolean {
		if (isNestedVariable(element)) {
			// Nested variables should always be in one line #111843
			return false;
		}
		// Empty elements should not have dynamic height since they will be invisible
		return element.toString().length > 0;
	}
}

function isDebugSession(obj: any): obj is IDebugSession {
	return typeof obj.getReplElements === 'function';
}

export class ReplDataSource implements IAsyncDataSource<IDebugSession, IReplElement> {

	hasChildren(element: IReplElement | IDebugSession): boolean {
		if (isDebugSession(element)) {
			return true;
		}

		return !!(<IExpressionContainer | INestingReplElement>element).hasChildren;
	}

	getChildren(element: IReplElement | IDebugSession): Promise<IReplElement[]> {
		if (isDebugSession(element)) {
			return Promise.resolve(element.getReplElements());
		}

		return Promise.resolve((<IExpression | INestingReplElement>element).getChildren());
	}
}

export class ReplAccessibilityProvider implements IListAccessibilityProvider<IReplElement> {

	getWidgetAriaLabel(): string {
		return localize('debugConsole', "Debug Console");
	}

	getAriaLabel(element: IReplElement): string {
		if (element instanceof Variable) {
			return localize('replVariableAriaLabel', "Variable {0}, value {1}", element.name, element.value);
		}
		if (element instanceof ReplOutputElement || element instanceof ReplEvaluationInput || element instanceof ReplEvaluationResult) {
			return element.value + (element instanceof ReplOutputElement && element.count > 1 ? localize({ key: 'occurred', comment: ['Front will the value of the debug console element. Placeholder will be replaced by a number which represents occurrance count.'] },
				", occurred {0} times", element.count) : '');
		}
		if (element instanceof RawObjectReplElement) {
			return localize('replRawObjectAriaLabel', "Debug console variable {0}, value {1}", element.name, element.value);
		}
		if (element instanceof ReplGroup) {
			return localize('replGroup', "Debug console group {0}", element.name);
		}

		return '';
	}
}

class SourceWidget extends Disposable {
	private readonly el: HTMLElement;
	private source?: IReplElementSource;
	private hover?: IManagedHover;

	constructor(container: HTMLElement,
		@IEditorService editorService: IEditorService,
		@IHoverService private readonly hoverService: IHoverService,
		@ILabelService private readonly labelService: ILabelService,
	) {
		super();
		this.el = dom.append(container, $('.source'));
		this._register(dom.addDisposableListener(this.el, 'click', e => {
			e.preventDefault();
			e.stopPropagation();
			if (this.source) {
				this.source.source.openInEditor(editorService, {
					startLineNumber: this.source.lineNumber,
					startColumn: this.source.column,
					endLineNumber: this.source.lineNumber,
					endColumn: this.source.column
				});
			}
		}));

	}

	public setSource(source?: IReplElementSource) {
		this.source = source;
		this.el.textContent = source ? `${basename(source.source.name)}:${source.lineNumber}` : '';

		this.hover ??= this._register(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.el, ''));
		this.hover.update(source ? `${this.labelService.getUriLabel(source.source.uri)}:${source.lineNumber}` : '');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/runAndDebugAccessibilityHelp.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/runAndDebugAccessibilityHelp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { AccessibleViewProviderId, AccessibleViewType, IAccessibleViewContentProvider } from '../../../../platform/accessibility/browser/accessibleView.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { localize } from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { AccessibilityHelpNLS } from '../../../../editor/common/standaloneStrings.js';
import { FocusedViewContext, SidebarFocusContext } from '../../../common/contextkeys.js';
import { BREAKPOINTS_VIEW_ID, CALLSTACK_VIEW_ID, LOADED_SCRIPTS_VIEW_ID, VARIABLES_VIEW_ID, WATCH_VIEW_ID } from '../common/debug.js';

export class RunAndDebugAccessibilityHelp implements IAccessibleViewImplementation {
	priority = 120;
	name = 'runAndDebugHelp';
	when = ContextKeyExpr.or(
		ContextKeyExpr.and(ContextKeyExpr.equals('activeViewlet', 'workbench.view.debug'), SidebarFocusContext),
		ContextKeyExpr.equals(FocusedViewContext.key, VARIABLES_VIEW_ID),
		ContextKeyExpr.equals(FocusedViewContext.key, WATCH_VIEW_ID),
		ContextKeyExpr.equals(FocusedViewContext.key, CALLSTACK_VIEW_ID),
		ContextKeyExpr.equals(FocusedViewContext.key, LOADED_SCRIPTS_VIEW_ID),
		ContextKeyExpr.equals(FocusedViewContext.key, BREAKPOINTS_VIEW_ID)
	);
	type: AccessibleViewType = AccessibleViewType.Help;
	getProvider(accessor: ServicesAccessor) {
		return new RunAndDebugAccessibilityHelpProvider(accessor.get(ICommandService), accessor.get(IViewsService));
	}
}

class RunAndDebugAccessibilityHelpProvider extends Disposable implements IAccessibleViewContentProvider {
	public readonly id = AccessibleViewProviderId.RunAndDebug;
	public readonly verbositySettingKey = AccessibilityVerbositySettingId.Debug;
	public readonly options = { type: AccessibleViewType.Help };
	private _focusedView: string | undefined;
	constructor(
		@ICommandService private readonly _commandService: ICommandService,
		@IViewsService private readonly _viewsService: IViewsService
	) {
		super();
		this._focusedView = this._viewsService.getFocusedViewName();
	}

	public onClose(): void {
		switch (this._focusedView) {
			case 'Watch':
				this._commandService.executeCommand('workbench.debug.action.focusWatchView');
				break;
			case 'Variables':
				this._commandService.executeCommand('workbench.debug.action.focusVariablesView');
				break;
			case 'Call Stack':
				this._commandService.executeCommand('workbench.debug.action.focusCallStackView');
				break;
			case 'Breakpoints':
				this._commandService.executeCommand('workbench.debug.action.focusBreakpointsView');
				break;
			default:
				this._commandService.executeCommand('workbench.view.debug');
		}
	}

	public provideContent(): string {
		return [
			localize('debug.showRunAndDebug', "The Show Run and Debug view command{0} will open the current view.", '<keybinding:workbench.view.debug>'),
			localize('debug.startDebugging', "The Debug: Start Debugging command{0} will start a debug session.", '<keybinding:workbench.action.debug.start>'),
			localize('debug.help', "Access debug output and evaluate expressions in the debug console, which can be focused with{0}.", '<keybinding:workbench.panel.repl.view.focus>'),
			AccessibilityHelpNLS.setBreakpoint,
			AccessibilityHelpNLS.addToWatch,
			localize('onceDebugging', "Once debugging, the following commands will be available:"),
			localize('debug.restartDebugging', "- Debug: Restart Debugging command{0} will restart the current debug session.", '<keybinding:workbench.action.debug.restart>'),
			localize('debug.stopDebugging', "- Debug: Stop Debugging command{0} will stop the current debugging session.", '<keybinding:workbench.action.debug.stop>'),
			localize('debug.continue', "- Debug: Continue command{0} will continue execution until the next breakpoint.", '<keybinding:workbench.action.debug.continue>'),
			localize('debug.stepInto', "- Debug: Step Into command{0} will step into the next function call.", '<keybinding:workbench.action.debug.stepInto>'),
			localize('debug.stepOver', "- Debug: Step Over command{0} will step over the current function call.", '<keybinding:workbench.action.debug.stepOver>'),
			localize('debug.stepOut', "- Debug: Step Out command{0} will step out of the current function call.", '<keybinding:workbench.action.debug.stepOut>'),
			localize('debug.views', 'The debug viewlet is comprised of several views that can be focused with the following commands or navigated to via tab then arrow keys:'),
			localize('debug.focusBreakpoints', "- Debug: Focus Breakpoints View command{0} will focus the breakpoints view.", '<keybinding:workbench.debug.action.focusBreakpointsView>'),
			localize('debug.focusCallStack', "- Debug: Focus Call Stack View command{0} will focus the call stack view.", '<keybinding:workbench.debug.action.focusCallStackView>'),
			localize('debug.focusVariables', "- Debug: Focus Variables View command{0} will focus the variables view.", '<keybinding:workbench.debug.action.focusVariablesView>'),
			localize('debug.focusWatch', "- Debug: Focus Watch View command{0} will focus the watch view.", '<keybinding:workbench.debug.action.focusWatchView>'),
			localize('debug.watchSetting', "The setting {0} controls whether watch variable changes are announced.", 'accessibility.debugWatchVariableAnnouncements'),
		].join('\n');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/statusbarColorProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/statusbarColorProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { asCssVariable, asCssVariableName, registerColor, transparent } from '../../../../platform/theme/common/colorRegistry.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IDebugService, State, IDebugSession, IDebugConfiguration } from '../common/debug.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { STATUS_BAR_FOREGROUND, STATUS_BAR_BORDER, COMMAND_CENTER_BACKGROUND } from '../../../common/theme.js';
import { DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { IStatusbarService } from '../../../services/statusbar/browser/statusbar.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { createStyleSheet } from '../../../../base/browser/domStylesheets.js';


// colors for theming

export const STATUS_BAR_DEBUGGING_BACKGROUND = registerColor('statusBar.debuggingBackground', {
	dark: '#CC6633',
	light: '#CC6633',
	hcDark: '#BA592C',
	hcLight: '#B5200D'
}, localize('statusBarDebuggingBackground', "Status bar background color when a program is being debugged. The status bar is shown in the bottom of the window"));

export const STATUS_BAR_DEBUGGING_FOREGROUND = registerColor('statusBar.debuggingForeground', {
	dark: STATUS_BAR_FOREGROUND,
	light: STATUS_BAR_FOREGROUND,
	hcDark: STATUS_BAR_FOREGROUND,
	hcLight: '#FFFFFF'
}, localize('statusBarDebuggingForeground', "Status bar foreground color when a program is being debugged. The status bar is shown in the bottom of the window"));

export const STATUS_BAR_DEBUGGING_BORDER = registerColor('statusBar.debuggingBorder', STATUS_BAR_BORDER, localize('statusBarDebuggingBorder', "Status bar border color separating to the sidebar and editor when a program is being debugged. The status bar is shown in the bottom of the window"));

export const COMMAND_CENTER_DEBUGGING_BACKGROUND = registerColor(
	'commandCenter.debuggingBackground',
	transparent(STATUS_BAR_DEBUGGING_BACKGROUND, 0.258),
	localize('commandCenter-activeBackground', "Command center background color when a program is being debugged"),
	true
);

export class StatusBarColorProvider implements IWorkbenchContribution {

	private readonly disposables = new DisposableStore();
	private disposable: IDisposable | undefined;

	private readonly styleSheet = createStyleSheet();

	private set enabled(enabled: boolean) {
		if (enabled === !!this.disposable) {
			return;
		}

		if (enabled) {
			this.disposable = this.statusbarService.overrideStyle({
				priority: 10,
				foreground: STATUS_BAR_DEBUGGING_FOREGROUND,
				background: STATUS_BAR_DEBUGGING_BACKGROUND,
				border: STATUS_BAR_DEBUGGING_BORDER,
			});
		} else {
			this.disposable!.dispose();
			this.disposable = undefined;
		}
	}

	constructor(
		@IDebugService private readonly debugService: IDebugService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IStatusbarService private readonly statusbarService: IStatusbarService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		this.debugService.onDidChangeState(this.update, this, this.disposables);
		this.contextService.onDidChangeWorkbenchState(this.update, this, this.disposables);
		this.configurationService.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('debug.enableStatusBarColor') || e.affectsConfiguration('debug.toolBarLocation')) {
				this.update();
			}
		}, undefined, this.disposables);
		this.update();
	}

	protected update(): void {
		const debugConfig = this.configurationService.getValue<IDebugConfiguration>('debug');
		const isInDebugMode = isStatusbarInDebugMode(this.debugService.state, this.debugService.getModel().getSessions());
		if (!debugConfig.enableStatusBarColor) {
			this.enabled = false;
		} else {
			this.enabled = isInDebugMode;
		}

		const isInCommandCenter = debugConfig.toolBarLocation === 'commandCenter';

		this.styleSheet.textContent = isInCommandCenter && isInDebugMode ? `
			.monaco-workbench {
				${asCssVariableName(COMMAND_CENTER_BACKGROUND)}: ${asCssVariable(COMMAND_CENTER_DEBUGGING_BACKGROUND)};
			}
		` : '';
	}

	dispose(): void {
		this.disposable?.dispose();
		this.disposables.dispose();
	}
}

export function isStatusbarInDebugMode(state: State, sessions: IDebugSession[]): boolean {
	if (state === State.Inactive || state === State.Initializing || sessions.every(s => s.suppressDebugStatusbar || s.configuration?.noDebug)) {
		return false;
	}

	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/variablesView.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/variablesView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { HighlightedLabel, IHighlight } from '../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { AsyncDataTree, IAsyncDataTreeViewState } from '../../../../base/browser/ui/tree/asyncDataTree.js';
import { ITreeContextMenuEvent, ITreeMouseEvent, ITreeNode, ITreeRenderer } from '../../../../base/browser/ui/tree/tree.js';
import { IAction, toAction } from '../../../../base/common/actions.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { FuzzyScore, createMatches } from '../../../../base/common/filters.js';
import { IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { localize } from '../../../../nls.js';
import { getContextMenuActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenuService, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService, IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { WorkbenchAsyncDataTree } from '../../../../platform/list/browser/listService.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ViewAction, ViewPane } from '../../../browser/parts/views/viewPane.js';
import { IViewletViewOptions } from '../../../browser/parts/views/viewsViewlet.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { IExtensionsWorkbenchService } from '../../extensions/common/extensions.js';
import { CONTEXT_BREAK_WHEN_VALUE_CHANGES_SUPPORTED, CONTEXT_BREAK_WHEN_VALUE_IS_ACCESSED_SUPPORTED, CONTEXT_BREAK_WHEN_VALUE_IS_READ_SUPPORTED, CONTEXT_VARIABLES_FOCUSED, DebugVisualizationType, IDebugService, IDebugViewWithVariables, IExpression, IScope, IStackFrame, IViewModel, VARIABLES_VIEW_ID, WATCH_VIEW_ID } from '../common/debug.js';
import { getContextForVariable } from '../common/debugContext.js';
import { ErrorScope, Expression, Scope, StackFrame, Variable, VisualizedExpression, getUriForDebugMemory } from '../common/debugModel.js';
import { DebugVisualizer, IDebugVisualizerService } from '../common/debugVisualizers.js';
import { AbstractExpressionDataSource, AbstractExpressionsRenderer, expressionAndScopeLabelProvider, IExpressionTemplateData, IInputBoxOptions, renderViewTree } from './baseDebugView.js';
import { ADD_TO_WATCH_ID, ADD_TO_WATCH_LABEL, COPY_EVALUATE_PATH_ID, COPY_EVALUATE_PATH_LABEL, COPY_VALUE_ID, COPY_VALUE_LABEL, setDataBreakpointInfoResponse } from './debugCommands.js';
import { DebugExpressionRenderer } from './debugExpressionRenderer.js';

const $ = dom.$;
let forgetScopes = true;

let variableInternalContext: Variable | undefined;

interface IVariablesContext {
	sessionId: string | undefined;
	container: DebugProtocol.Variable | DebugProtocol.Scope | DebugProtocol.EvaluateArguments;
	variable: DebugProtocol.Variable;
}

export class VariablesView extends ViewPane implements IDebugViewWithVariables {

	private updateTreeScheduler: RunOnceScheduler;
	private needsRefresh = false;
	private tree!: WorkbenchAsyncDataTree<IStackFrame | null, IExpression | IScope, FuzzyScore>;
	private savedViewState = new Map<string, IAsyncDataTreeViewState>();
	private autoExpandedScopes = new Set<string>();

	public get treeSelection() {
		return this.tree.getSelection();
	}

	constructor(
		options: IViewletViewOptions,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IDebugService private readonly debugService: IDebugService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@IMenuService private readonly menuService: IMenuService
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);

		// Use scheduler to prevent unnecessary flashing
		this.updateTreeScheduler = new RunOnceScheduler(async () => {
			const stackFrame = this.debugService.getViewModel().focusedStackFrame;

			this.needsRefresh = false;
			const input = this.tree.getInput();
			if (input) {
				this.savedViewState.set(input.getId(), this.tree.getViewState());
			}
			if (!stackFrame) {
				await this.tree.setInput(null);
				return;
			}

			const viewState = this.savedViewState.get(stackFrame.getId());
			await this.tree.setInput(stackFrame, viewState);

			// Automatically expand the first non-expensive scope
			const scopes = await stackFrame.getScopes();
			const toExpand = scopes.find(s => !s.expensive);

			// A race condition could be present causing the scopes here to be different from the scopes that the tree just retrieved.
			// If that happened, don't try to reveal anything, it will be straightened out on the next update
			if (toExpand && this.tree.hasNode(toExpand)) {
				this.autoExpandedScopes.add(toExpand.getId());
				await this.tree.expand(toExpand);
			}
		}, 400);
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		this.element.classList.add('debug-pane');
		container.classList.add('debug-variables');
		const treeContainer = renderViewTree(container);
		const expressionRenderer = this.instantiationService.createInstance(DebugExpressionRenderer);
		this.tree = this.instantiationService.createInstance(WorkbenchAsyncDataTree<IStackFrame | null, IExpression | IScope, FuzzyScore>, 'VariablesView', treeContainer, new VariablesDelegate(),
			[
				this.instantiationService.createInstance(VariablesRenderer, expressionRenderer),
				this.instantiationService.createInstance(VisualizedVariableRenderer, expressionRenderer),
				new ScopesRenderer(),
				new ScopeErrorRenderer(),
			],
			this.instantiationService.createInstance(VariablesDataSource), {
			accessibilityProvider: new VariablesAccessibilityProvider(),
			identityProvider: { getId: (element: IExpression | IScope) => element.getId() },
			keyboardNavigationLabelProvider: expressionAndScopeLabelProvider,
			overrideStyles: this.getLocationBasedColors().listOverrideStyles
		});

		this._register(VisualizedVariableRenderer.rendererOnVisualizationRange(this.debugService.getViewModel(), this.tree));
		this.tree.setInput(this.debugService.getViewModel().focusedStackFrame ?? null);

		CONTEXT_VARIABLES_FOCUSED.bindTo(this.tree.contextKeyService);

		this._register(this.debugService.getViewModel().onDidFocusStackFrame(sf => {
			if (!this.isBodyVisible()) {
				this.needsRefresh = true;
				return;
			}

			// Refresh the tree immediately if the user explictly changed stack frames.
			// Otherwise postpone the refresh until user stops stepping.
			const timeout = sf.explicit ? 0 : undefined;
			this.updateTreeScheduler.schedule(timeout);
		}));
		this._register(this.debugService.getViewModel().onWillUpdateViews(() => {
			const stackFrame = this.debugService.getViewModel().focusedStackFrame;
			if (stackFrame && forgetScopes) {
				stackFrame.forgetScopes();
			}
			forgetScopes = true;
			this.tree.updateChildren();
		}));
		this._register(this.tree);
		this._register(this.tree.onMouseDblClick(e => this.onMouseDblClick(e)));
		this._register(this.tree.onContextMenu(async e => await this.onContextMenu(e)));

		this._register(this.onDidChangeBodyVisibility(visible => {
			if (visible && this.needsRefresh) {
				this.updateTreeScheduler.schedule();
			}
		}));
		let horizontalScrolling: boolean | undefined;
		this._register(this.debugService.getViewModel().onDidSelectExpression(e => {
			const variable = e?.expression;
			if (variable && this.tree.hasNode(variable)) {
				horizontalScrolling = this.tree.options.horizontalScrolling;
				if (horizontalScrolling) {
					this.tree.updateOptions({ horizontalScrolling: false });
				}

				this.tree.rerender(variable);
			} else if (!e && horizontalScrolling !== undefined) {
				this.tree.updateOptions({ horizontalScrolling: horizontalScrolling });
				horizontalScrolling = undefined;
			}
		}));
		this._register(this.debugService.getViewModel().onDidEvaluateLazyExpression(async e => {
			if (e instanceof Variable && this.tree.hasNode(e)) {
				await this.tree.updateChildren(e, false, true);
				await this.tree.expand(e);
			}
		}));
		this._register(this.debugService.onDidEndSession(() => {
			this.savedViewState.clear();
			this.autoExpandedScopes.clear();
		}));
	}

	protected override layoutBody(width: number, height: number): void {
		super.layoutBody(height, width);
		this.tree.layout(width, height);
	}

	override focus(): void {
		super.focus();
		this.tree.domFocus();
	}

	collapseAll(): void {
		this.tree.collapseAll();
	}

	private onMouseDblClick(e: ITreeMouseEvent<IExpression | IScope>): void {
		if (this.canSetExpressionValue(e.element)) {
			this.debugService.getViewModel().setSelectedExpression(e.element, false);
		}
	}

	private canSetExpressionValue(e: IExpression | IScope | null): e is IExpression {
		const session = this.debugService.getViewModel().focusedSession;
		if (!session) {
			return false;
		}

		if (e instanceof VisualizedExpression) {
			return !!e.treeItem.canEdit;
		}

		if (!session.capabilities?.supportsSetVariable && !session.capabilities?.supportsSetExpression) {
			return false;
		}

		return e instanceof Variable && !e.presentationHint?.attributes?.includes('readOnly') && !e.presentationHint?.lazy;
	}

	private async onContextMenu(e: ITreeContextMenuEvent<IExpression | IScope>): Promise<void> {
		const element = e.element;

		// Handle scope context menu
		if (element instanceof Scope) {
			return this.openContextMenuForScope(e, element);
		}

		// Handle variable context menu
		if (!(element instanceof Variable) || !element.value) {
			return;
		}

		return openContextMenuForVariableTreeElement(this.contextKeyService, this.menuService, this.contextMenuService, MenuId.DebugVariablesContext, e);
	}

	private openContextMenuForScope(e: ITreeContextMenuEvent<IExpression | IScope>, scope: Scope): void {
		const context = { scope: { name: scope.name } };
		const menu = this.menuService.getMenuActions(MenuId.DebugScopesContext, this.contextKeyService, { arg: context, shouldForwardArgs: false });
		const { secondary } = getContextMenuActions(menu, 'inline');

		this.contextMenuService.showContextMenu({
			getAnchor: () => e.anchor,
			getActions: () => secondary
		});
	}
}

export async function openContextMenuForVariableTreeElement(parentContextKeyService: IContextKeyService, menuService: IMenuService, contextMenuService: IContextMenuService, menuId: MenuId, e: ITreeContextMenuEvent<IExpression | IScope>) {
	const variable = e.element;
	if (!(variable instanceof Variable) || !variable.value) {
		return;
	}

	const contextKeyService = await getContextForVariableMenuWithDataAccess(parentContextKeyService, variable);
	const context: IVariablesContext = getVariablesContext(variable);
	const menu = menuService.getMenuActions(menuId, contextKeyService, { arg: context, shouldForwardArgs: false });

	const { secondary } = getContextMenuActions(menu, 'inline');
	contextMenuService.showContextMenu({
		getAnchor: () => e.anchor,
		getActions: () => secondary
	});
}

const getVariablesContext = (variable: Variable): IVariablesContext => ({
	sessionId: variable.getSession()?.getId(),
	container: variable.parent instanceof Expression
		? { expression: variable.parent.name }
		: (variable.parent as (Variable | Scope)).toDebugProtocolObject(),
	variable: variable.toDebugProtocolObject()
});

/**
 * Gets a context key overlay that has context for the given variable, including data access info.
 */
async function getContextForVariableMenuWithDataAccess(parentContext: IContextKeyService, variable: Variable) {
	const session = variable.getSession();
	if (!session || !session.capabilities.supportsDataBreakpoints) {
		return getContextForVariableMenuBase(parentContext, variable);
	}

	const contextKeys: [string, unknown][] = [];
	const dataBreakpointInfoResponse = await session.dataBreakpointInfo(variable.name, variable.parent.reference);
	const dataBreakpointId = dataBreakpointInfoResponse?.dataId;
	const dataBreakpointAccessTypes = dataBreakpointInfoResponse?.accessTypes;
	setDataBreakpointInfoResponse(dataBreakpointInfoResponse);

	if (!dataBreakpointAccessTypes) {
		contextKeys.push([CONTEXT_BREAK_WHEN_VALUE_CHANGES_SUPPORTED.key, !!dataBreakpointId]);
	} else {
		for (const accessType of dataBreakpointAccessTypes) {
			switch (accessType) {
				case 'read':
					contextKeys.push([CONTEXT_BREAK_WHEN_VALUE_IS_READ_SUPPORTED.key, !!dataBreakpointId]);
					break;
				case 'write':
					contextKeys.push([CONTEXT_BREAK_WHEN_VALUE_CHANGES_SUPPORTED.key, !!dataBreakpointId]);
					break;
				case 'readWrite':
					contextKeys.push([CONTEXT_BREAK_WHEN_VALUE_IS_ACCESSED_SUPPORTED.key, !!dataBreakpointId]);
					break;
			}
		}
	}

	return getContextForVariableMenuBase(parentContext, variable, contextKeys);
}

/**
 * Gets a context key overlay that has context for the given variable.
 */
function getContextForVariableMenuBase(parentContext: IContextKeyService, variable: Variable, additionalContext: [string, unknown][] = []) {
	variableInternalContext = variable;
	return getContextForVariable(parentContext, variable, additionalContext);
}

function isStackFrame(obj: any): obj is IStackFrame {
	return obj instanceof StackFrame;
}

class VariablesDataSource extends AbstractExpressionDataSource<IStackFrame | null, IExpression | IScope> {

	public override hasChildren(element: IStackFrame | null | IExpression | IScope): boolean {
		if (!element) {
			return false;
		}
		if (isStackFrame(element)) {
			return true;
		}

		return element.hasChildren;
	}

	protected override doGetChildren(element: IStackFrame | IExpression | IScope): Promise<(IExpression | IScope)[]> {
		if (isStackFrame(element)) {
			return element.getScopes();
		}

		return element.getChildren();
	}
}

interface IScopeTemplateData {
	name: HTMLElement;
	label: HighlightedLabel;
}

class VariablesDelegate implements IListVirtualDelegate<IExpression | IScope> {

	getHeight(element: IExpression | IScope): number {
		return 22;
	}

	getTemplateId(element: IExpression | IScope): string {
		if (element instanceof ErrorScope) {
			return ScopeErrorRenderer.ID;
		}

		if (element instanceof Scope) {
			return ScopesRenderer.ID;
		}

		if (element instanceof VisualizedExpression) {
			return VisualizedVariableRenderer.ID;
		}

		return VariablesRenderer.ID;
	}
}

class ScopesRenderer implements ITreeRenderer<IScope, FuzzyScore, IScopeTemplateData> {

	static readonly ID = 'scope';

	get templateId(): string {
		return ScopesRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IScopeTemplateData {
		const name = dom.append(container, $('.scope'));
		const label = new HighlightedLabel(name);

		return { name, label };
	}

	renderElement(element: ITreeNode<IScope, FuzzyScore>, index: number, templateData: IScopeTemplateData): void {
		templateData.label.set(element.element.name, createMatches(element.filterData));
	}

	disposeTemplate(templateData: IScopeTemplateData): void {
		templateData.label.dispose();
	}
}

interface IScopeErrorTemplateData {
	error: HTMLElement;
}

class ScopeErrorRenderer implements ITreeRenderer<IScope, FuzzyScore, IScopeErrorTemplateData> {

	static readonly ID = 'scopeError';

	get templateId(): string {
		return ScopeErrorRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IScopeErrorTemplateData {
		const wrapper = dom.append(container, $('.scope'));
		const error = dom.append(wrapper, $('.error'));
		return { error };
	}

	renderElement(element: ITreeNode<IScope, FuzzyScore>, index: number, templateData: IScopeErrorTemplateData): void {
		templateData.error.innerText = element.element.name;
	}

	disposeTemplate(): void {
		// noop
	}
}

export class VisualizedVariableRenderer extends AbstractExpressionsRenderer {
	public static readonly ID = 'viz';

	/**
	 * Registers a helper that rerenders the tree when visualization is requested
	 * or cancelled./
	 */
	public static rendererOnVisualizationRange(model: IViewModel, tree: AsyncDataTree<any, any, any>): IDisposable {
		return model.onDidChangeVisualization(({ original }) => {
			if (!tree.hasNode(original)) {
				return;
			}

			const parent: IExpression = tree.getParentElement(original);
			tree.updateChildren(parent, false, false);
		});

	}

	constructor(
		private readonly expressionRenderer: DebugExpressionRenderer,
		@IDebugService debugService: IDebugService,
		@IContextViewService contextViewService: IContextViewService,
		@IHoverService hoverService: IHoverService,
		@IMenuService private readonly menuService: IMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
	) {
		super(debugService, contextViewService, hoverService);
	}

	public override get templateId(): string {
		return VisualizedVariableRenderer.ID;
	}

	public override renderElement(node: ITreeNode<IExpression, FuzzyScore>, index: number, data: IExpressionTemplateData): void {
		data.elementDisposable.clear();
		super.renderExpressionElement(node.element, node, data);
	}

	protected override renderExpression(expression: IExpression, data: IExpressionTemplateData, highlights: IHighlight[]): void {
		const viz = expression as VisualizedExpression;

		let text = viz.name;
		if (viz.value && typeof viz.name === 'string') {
			text += ':';
		}
		data.label.set(text, highlights, viz.name);
		data.elementDisposable.add(this.expressionRenderer.renderValue(data.value, viz, {
			showChanged: false,
			maxValueLength: 1024,
			colorize: true,
			session: expression.getSession(),
		}));
	}

	protected override getInputBoxOptions(expression: IExpression): IInputBoxOptions | undefined {
		const viz = <VisualizedExpression>expression;
		return {
			initialValue: expression.value,
			ariaLabel: localize('variableValueAriaLabel', "Type new variable value"),
			validationOptions: {
				validation: () => viz.errorMessage ? ({ content: viz.errorMessage }) : null
			},
			onFinish: (value: string, success: boolean) => {
				viz.errorMessage = undefined;
				if (success) {
					viz.edit(value).then(() => {
						// Do not refresh scopes due to a node limitation #15520
						forgetScopes = false;
						this.debugService.getViewModel().updateViews();
					});
				}
			}
		};
	}

	protected override renderActionBar(actionBar: ActionBar, expression: IExpression, _data: IExpressionTemplateData) {
		const viz = expression as VisualizedExpression;
		const contextKeyService = viz.original ? getContextForVariableMenuBase(this.contextKeyService, viz.original) : this.contextKeyService;
		const context = viz.original ? getVariablesContext(viz.original) : undefined;
		const menu = this.menuService.getMenuActions(MenuId.DebugVariablesContext, contextKeyService, { arg: context, shouldForwardArgs: false });

		const { primary } = getContextMenuActions(menu, 'inline');

		if (viz.original) {
			const action = toAction({
				id: 'debugViz', label: localize('removeVisualizer', 'Remove Visualizer'), class: ThemeIcon.asClassName(Codicon.eye), run: () => this.debugService.getViewModel().setVisualizedExpression(viz.original!, undefined)
			});
			action.checked = true;
			primary.push(action);
			actionBar.domNode.style.display = 'initial';
		}
		actionBar.clear();
		actionBar.context = context;
		actionBar.push(primary, { icon: true, label: false });
	}
}

export class VariablesRenderer extends AbstractExpressionsRenderer {

	static readonly ID = 'variable';

	constructor(
		private readonly expressionRenderer: DebugExpressionRenderer,
		@IMenuService private readonly menuService: IMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IDebugVisualizerService private readonly visualization: IDebugVisualizerService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IDebugService debugService: IDebugService,
		@IContextViewService contextViewService: IContextViewService,
		@IHoverService hoverService: IHoverService,
	) {
		super(debugService, contextViewService, hoverService);
	}

	get templateId(): string {
		return VariablesRenderer.ID;
	}

	protected renderExpression(expression: IExpression, data: IExpressionTemplateData, highlights: IHighlight[]): void {
		data.elementDisposable.add(this.expressionRenderer.renderVariable(data, expression as Variable, {
			highlights,
			showChanged: true,
		}));
	}

	public override renderElement(node: ITreeNode<IExpression, FuzzyScore>, index: number, data: IExpressionTemplateData): void {
		data.elementDisposable.clear();
		super.renderExpressionElement(node.element, node, data);
	}

	protected getInputBoxOptions(expression: IExpression): IInputBoxOptions {
		const variable = <Variable>expression;
		return {
			initialValue: expression.value,
			ariaLabel: localize('variableValueAriaLabel', "Type new variable value"),
			validationOptions: {
				validation: () => variable.errorMessage ? ({ content: variable.errorMessage }) : null
			},
			onFinish: (value: string, success: boolean) => {
				variable.errorMessage = undefined;
				const focusedStackFrame = this.debugService.getViewModel().focusedStackFrame;
				if (success && variable.value !== value && focusedStackFrame) {
					variable.setVariable(value, focusedStackFrame)
						// Need to force watch expressions and variables to update since a variable change can have an effect on both
						.then(() => {
							// Do not refresh scopes due to a node limitation #15520
							forgetScopes = false;
							this.debugService.getViewModel().updateViews();
						});
				}
			}
		};
	}

	protected override renderActionBar(actionBar: ActionBar, expression: IExpression, data: IExpressionTemplateData) {
		const variable = expression as Variable;
		const contextKeyService = getContextForVariableMenuBase(this.contextKeyService, variable);

		const context = getVariablesContext(variable);
		const menu = this.menuService.getMenuActions(MenuId.DebugVariablesContext, contextKeyService, { arg: context, shouldForwardArgs: false });
		const { primary } = getContextMenuActions(menu, 'inline');

		actionBar.clear();
		actionBar.context = context;
		actionBar.push(primary, { icon: true, label: false });

		const cts = new CancellationTokenSource();
		data.elementDisposable.add(toDisposable(() => cts.dispose(true)));
		this.visualization.getApplicableFor(expression, cts.token).then(result => {
			data.elementDisposable.add(result);

			const originalExpression = (expression instanceof VisualizedExpression && expression.original) || expression;
			const actions = result.object.map(v => toAction({ id: 'debugViz', label: v.name, class: v.iconClass || 'debug-viz-icon', run: this.useVisualizer(v, originalExpression, cts.token) }));
			if (actions.length === 0) {
				// no-op
			} else if (actions.length === 1) {
				actionBar.push(actions[0], { icon: true, label: false });
			} else {
				actionBar.push(toAction({ id: 'debugViz', label: localize('useVisualizer', 'Visualize Variable...'), class: ThemeIcon.asClassName(Codicon.eye), run: () => this.pickVisualizer(actions, originalExpression, data) }), { icon: true, label: false });
			}
		});
	}

	private pickVisualizer(actions: IAction[], expression: IExpression, data: IExpressionTemplateData) {
		this.contextMenuService.showContextMenu({
			getAnchor: () => data.actionBar!.getContainer(),
			getActions: () => actions,
		});
	}

	private useVisualizer(viz: DebugVisualizer, expression: IExpression, token: CancellationToken) {
		return async () => {
			const resolved = await viz.resolve(token);
			if (token.isCancellationRequested) {
				return;
			}

			if (resolved.type === DebugVisualizationType.Command) {
				viz.execute();
			} else {
				const replacement = await this.visualization.getVisualizedNodeFor(resolved.id, expression);
				if (replacement) {
					this.debugService.getViewModel().setVisualizedExpression(expression, replacement);
				}
			}
		};
	}
}

class VariablesAccessibilityProvider implements IListAccessibilityProvider<IExpression | IScope> {

	getWidgetAriaLabel(): string {
		return localize('variablesAriaTreeLabel', "Debug Variables");
	}

	getAriaLabel(element: IExpression | IScope): string | null {
		if (element instanceof Scope) {
			return localize('variableScopeAriaLabel', "Scope {0}", element.name);
		}
		if (element instanceof Variable) {
			return localize({ key: 'variableAriaLabel', comment: ['Placeholders are variable name and variable value respectivly. They should not be translated.'] }, "{0}, value {1}", element.name, element.value);
		}

		return null;
	}
}

export const SET_VARIABLE_ID = 'debug.setVariable';
CommandsRegistry.registerCommand({
	id: SET_VARIABLE_ID,
	handler: (accessor: ServicesAccessor) => {
		const debugService = accessor.get(IDebugService);
		debugService.getViewModel().setSelectedExpression(variableInternalContext, false);
	}
});

CommandsRegistry.registerCommand({
	metadata: {
		description: COPY_VALUE_LABEL,
	},
	id: COPY_VALUE_ID,
	handler: async (accessor: ServicesAccessor, arg: Variable | Expression | IVariablesContext | undefined, ctx?: (Variable | Expression)[]) => {
		const debugService = accessor.get(IDebugService);
		const clipboardService = accessor.get(IClipboardService);
		let elementContext = '';
		let elements: (Variable | Expression)[];
		if (!arg) {
			const viewService = accessor.get(IViewsService);
			const focusedView = viewService.getFocusedView();
			let view: IDebugViewWithVariables | null | undefined;
			if (focusedView?.id === WATCH_VIEW_ID) {
				view = viewService.getActiveViewWithId<IDebugViewWithVariables>(WATCH_VIEW_ID);
				elementContext = 'watch';
			} else if (focusedView?.id === VARIABLES_VIEW_ID) {
				view = viewService.getActiveViewWithId<IDebugViewWithVariables>(VARIABLES_VIEW_ID);
				elementContext = 'variables';
			}
			if (!view) {
				return;
			}
			elements = view.treeSelection.filter(e => e instanceof Expression || e instanceof Variable);
		} else if (arg instanceof Variable || arg instanceof Expression) {
			elementContext = 'watch';
			elements = [arg];
		} else {
			elementContext = 'variables';
			elements = variableInternalContext ? [variableInternalContext] : [];
		}

		const stackFrame = debugService.getViewModel().focusedStackFrame;
		const session = debugService.getViewModel().focusedSession;
		if (!stackFrame || !session || elements.length === 0) {
			return;
		}

		const evalContext = session.capabilities.supportsClipboardContext ? 'clipboard' : elementContext;
		const toEvaluate = elements.map(element => element instanceof Variable ? (element.evaluateName || element.value) : element.name);

		try {
			const evaluations = await Promise.all(toEvaluate.map(expr => session.evaluate(expr, stackFrame.frameId, evalContext)));
			const result = coalesce(evaluations).map(evaluation => evaluation.body.result);
			if (result.length) {
				clipboardService.writeText(result.join('\n'));
			}
		} catch (e) {
			const result = elements.map(element => element.value);
			clipboardService.writeText(result.join('\n'));
		}
	}
});

export const VIEW_MEMORY_ID = 'workbench.debug.viewlet.action.viewMemory';

const HEX_EDITOR_EXTENSION_ID = 'ms-vscode.hexeditor';
const HEX_EDITOR_EDITOR_ID = 'hexEditor.hexedit';

CommandsRegistry.registerCommand({
	id: VIEW_MEMORY_ID,
	handler: async (accessor: ServicesAccessor, arg: IVariablesContext | IExpression, ctx?: (Variable | Expression)[]) => {
		const debugService = accessor.get(IDebugService);
		let sessionId: string;
		let memoryReference: string;
		if ('sessionId' in arg) { // IVariablesContext
			if (!arg.sessionId || !arg.variable.memoryReference) {
				return;
			}
			sessionId = arg.sessionId;
			memoryReference = arg.variable.memoryReference;
		} else { // IExpression
			if (!arg.memoryReference) {
				return;
			}
			const focused = debugService.getViewModel().focusedSession;
			if (!focused) {
				return;
			}

			sessionId = focused.getId();
			memoryReference = arg.memoryReference;
		}

		const extensionsWorkbenchService = accessor.get(IExtensionsWorkbenchService);
		const editorService = accessor.get(IEditorService);
		const notificationService = accessor.get(INotificationService);
		const extensionService = accessor.get(IExtensionService);
		const telemetryService = accessor.get(ITelemetryService);

		const ext = await extensionService.getExtension(HEX_EDITOR_EXTENSION_ID);
		if (ext || await tryInstallHexEditor(extensionsWorkbenchService, notificationService)) {
			/* __GDPR__
				"debug/didViewMemory" : {
					"owner": "connor4312",
					"debugType" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
				}
			*/
			telemetryService.publicLog('debug/didViewMemory', {
				debugType: debugService.getModel().getSession(sessionId)?.configuration.type,
			});

			await editorService.openEditor({
				resource: getUriForDebugMemory(sessionId, memoryReference),
				options: {
					revealIfOpened: true,
					override: HEX_EDITOR_EDITOR_ID,
				},
			}, SIDE_GROUP);
		}
	}
});

async function tryInstallHexEditor(extensionsWorkbenchService: IExtensionsWorkbenchService, notificationService: INotificationService): Promise<boolean> {
	try {
		await extensionsWorkbenchService.install(HEX_EDITOR_EXTENSION_ID, {
			justification: localize("viewMemory.prompt", "Inspecting binary data requires this extension."),
			enable: true
		}, ProgressLocation.Notification);
		return true;
	} catch (error) {
		notificationService.error(error);
		return false;
	}
}

CommandsRegistry.registerCommand({
	metadata: {
		description: COPY_EVALUATE_PATH_LABEL,
	},
	id: COPY_EVALUATE_PATH_ID,
	handler: async (accessor: ServicesAccessor, context: IVariablesContext | Variable) => {
		const clipboardService = accessor.get(IClipboardService);
		if (context instanceof Variable) {
			await clipboardService.writeText(context.evaluateName!);
		} else {
			await clipboardService.writeText(context.variable.evaluateName!);
		}
	}
});

CommandsRegistry.registerCommand({
	metadata: {
		description: ADD_TO_WATCH_LABEL,
	},
	id: ADD_TO_WATCH_ID,
	handler: async (accessor: ServicesAccessor, context: IVariablesContext) => {
		const debugService = accessor.get(IDebugService);
		debugService.addWatchExpression(context.variable.evaluateName);
	}
});

registerAction2(class extends ViewAction<VariablesView> {
	constructor() {
		super({
			id: 'variables.collapse',
			viewId: VARIABLES_VIEW_ID,
			title: localize('collapse', "Collapse All"),
			f1: false,
			icon: Codicon.collapseAll,
			menu: {
				id: MenuId.ViewTitle,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', VARIABLES_VIEW_ID)
			}
		});
	}

	runInView(_accessor: ServicesAccessor, view: VariablesView) {
		view.collapseAll();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/watchExpressionsView.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/watchExpressionsView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDragAndDropData } from '../../../../base/browser/dnd.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { IHighlight } from '../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { IListVirtualDelegate, ListDragOverEffectPosition, ListDragOverEffectType } from '../../../../base/browser/ui/list/list.js';
import { ElementsDragAndDropData, ListViewTargetSector } from '../../../../base/browser/ui/list/listView.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { ITreeContextMenuEvent, ITreeDragAndDrop, ITreeDragOverReaction, ITreeMouseEvent, ITreeNode } from '../../../../base/browser/ui/tree/tree.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { FuzzyScore } from '../../../../base/common/filters.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { localize } from '../../../../nls.js';
import { getContextMenuActions, } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { Action2, IMenuService, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService, IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { WorkbenchAsyncDataTree } from '../../../../platform/list/browser/listService.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ViewAction, ViewPane } from '../../../browser/parts/views/viewPane.js';
import { IViewletViewOptions } from '../../../browser/parts/views/viewsViewlet.js';
import { FocusedViewContext } from '../../../common/contextkeys.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { CONTEXT_CAN_VIEW_MEMORY, CONTEXT_EXPRESSION_SELECTED, CONTEXT_VARIABLE_IS_READONLY, CONTEXT_VARIABLE_TYPE, CONTEXT_WATCH_EXPRESSIONS_EXIST, CONTEXT_WATCH_EXPRESSIONS_FOCUSED, CONTEXT_WATCH_ITEM_TYPE, IDebugConfiguration, IDebugService, IDebugViewWithVariables, IExpression, CONTEXT_BREAK_WHEN_VALUE_CHANGES_SUPPORTED, CONTEXT_BREAK_WHEN_VALUE_IS_ACCESSED_SUPPORTED, CONTEXT_BREAK_WHEN_VALUE_IS_READ_SUPPORTED, CONTEXT_VARIABLE_EVALUATE_NAME_PRESENT, WATCH_VIEW_ID, CONTEXT_DEBUG_TYPE } from '../common/debug.js';
import { Expression, Variable, VisualizedExpression } from '../common/debugModel.js';
import { AbstractExpressionDataSource, AbstractExpressionsRenderer, expressionAndScopeLabelProvider, IExpressionTemplateData, IInputBoxOptions, renderViewTree } from './baseDebugView.js';
import { COPY_WATCH_EXPRESSION_COMMAND_ID, setDataBreakpointInfoResponse } from './debugCommands.js';
import { DebugExpressionRenderer } from './debugExpressionRenderer.js';
import { watchExpressionsAdd, watchExpressionsRemoveAll } from './debugIcons.js';
import { VariablesRenderer, VisualizedVariableRenderer } from './variablesView.js';

const MAX_VALUE_RENDER_LENGTH_IN_VIEWLET = 1024;
let ignoreViewUpdates = false;
let useCachedEvaluation = false;

export class WatchExpressionsView extends ViewPane implements IDebugViewWithVariables {

	private watchExpressionsUpdatedScheduler: RunOnceScheduler;
	private needsRefresh = false;
	private tree!: WorkbenchAsyncDataTree<IDebugService | IExpression, IExpression, FuzzyScore>;
	private watchExpressionsExist: IContextKey<boolean>;
	private expressionRenderer: DebugExpressionRenderer;

	public get treeSelection() {
		return this.tree.getSelection();
	}

	constructor(
		options: IViewletViewOptions,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IDebugService private readonly debugService: IDebugService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@IMenuService private readonly menuService: IMenuService,
		@ILogService private readonly logService: ILogService
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);

		this.watchExpressionsUpdatedScheduler = new RunOnceScheduler(() => {
			this.needsRefresh = false;
			this.tree.updateChildren();
		}, 50);
		this.watchExpressionsExist = CONTEXT_WATCH_EXPRESSIONS_EXIST.bindTo(contextKeyService);
		this.watchExpressionsExist.set(this.debugService.getModel().getWatchExpressions().length > 0);
		this.expressionRenderer = instantiationService.createInstance(DebugExpressionRenderer);
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		this.element.classList.add('debug-pane');
		container.classList.add('debug-watch');
		const treeContainer = renderViewTree(container);

		const expressionsRenderer = this.instantiationService.createInstance(WatchExpressionsRenderer, this.expressionRenderer);
		this.tree = this.instantiationService.createInstance(WorkbenchAsyncDataTree<IDebugService | IExpression, IExpression, FuzzyScore>, 'WatchExpressions', treeContainer, new WatchExpressionsDelegate(),
			[
				expressionsRenderer,
				this.instantiationService.createInstance(VariablesRenderer, this.expressionRenderer),
				this.instantiationService.createInstance(VisualizedVariableRenderer, this.expressionRenderer),
			],
			this.instantiationService.createInstance(WatchExpressionsDataSource), {
			accessibilityProvider: new WatchExpressionsAccessibilityProvider(),
			identityProvider: { getId: (element: IExpression) => element.getId() },
			keyboardNavigationLabelProvider: {
				getKeyboardNavigationLabel: (e: IExpression) => {
					if (e === this.debugService.getViewModel().getSelectedExpression()?.expression) {
						// Don't filter input box
						return undefined;
					}

					return expressionAndScopeLabelProvider.getKeyboardNavigationLabel(e);
				}
			},
			dnd: new WatchExpressionsDragAndDrop(this.debugService),
			overrideStyles: this.getLocationBasedColors().listOverrideStyles
		});
		this._register(this.tree);
		this.tree.setInput(this.debugService);
		CONTEXT_WATCH_EXPRESSIONS_FOCUSED.bindTo(this.tree.contextKeyService);

		this._register(VisualizedVariableRenderer.rendererOnVisualizationRange(this.debugService.getViewModel(), this.tree));
		this._register(this.tree.onContextMenu(e => this.onContextMenu(e)));
		this._register(this.tree.onMouseDblClick(e => this.onMouseDblClick(e)));
		this._register(this.debugService.getModel().onDidChangeWatchExpressions(async we => {
			this.watchExpressionsExist.set(this.debugService.getModel().getWatchExpressions().length > 0);
			if (!this.isBodyVisible()) {
				this.needsRefresh = true;
			} else {
				if (we && !we.name) {
					// We are adding a new input box, no need to re-evaluate watch expressions
					useCachedEvaluation = true;
				}
				await this.tree.updateChildren();
				useCachedEvaluation = false;
				if (we instanceof Expression) {
					this.tree.reveal(we);
				}
			}
		}));
		this._register(this.debugService.getViewModel().onDidFocusStackFrame(() => {
			if (!this.isBodyVisible()) {
				this.needsRefresh = true;
				return;
			}

			if (!this.watchExpressionsUpdatedScheduler.isScheduled()) {
				this.watchExpressionsUpdatedScheduler.schedule();
			}
		}));
		this._register(this.debugService.getViewModel().onWillUpdateViews(() => {
			if (!ignoreViewUpdates) {
				this.tree.updateChildren();
			}
		}));

		this._register(this.onDidChangeBodyVisibility(visible => {
			if (visible && this.needsRefresh) {
				this.watchExpressionsUpdatedScheduler.schedule();
			}
		}));
		let horizontalScrolling: boolean | undefined;
		this._register(this.debugService.getViewModel().onDidSelectExpression(e => {
			const expression = e?.expression;
			if (expression && this.tree.hasNode(expression)) {
				horizontalScrolling = this.tree.options.horizontalScrolling;
				if (horizontalScrolling) {
					this.tree.updateOptions({ horizontalScrolling: false });
				}

				if (expression.name) {
					// Only rerender if the input is already done since otherwise the tree is not yet aware of the new element
					this.tree.rerender(expression);
				}
			} else if (!expression && horizontalScrolling !== undefined) {
				this.tree.updateOptions({ horizontalScrolling: horizontalScrolling });
				horizontalScrolling = undefined;
			}
		}));

		this._register(this.debugService.getViewModel().onDidEvaluateLazyExpression(async e => {
			if (e instanceof Variable && this.tree.hasNode(e)) {
				await this.tree.updateChildren(e, false, true);
				await this.tree.expand(e);
			}
		}));
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);
		this.tree.layout(height, width);
	}

	override focus(): void {
		super.focus();
		this.tree.domFocus();
	}

	collapseAll(): void {
		this.tree.collapseAll();
	}

	private onMouseDblClick(e: ITreeMouseEvent<IExpression>): void {
		if ((e.browserEvent.target as HTMLElement).className.indexOf('twistie') >= 0) {
			// Ignore double click events on twistie
			return;
		}

		const element = e.element;
		// double click on primitive value: open input box to be able to select and copy value.
		const selectedExpression = this.debugService.getViewModel().getSelectedExpression();
		if ((element instanceof Expression && element !== selectedExpression?.expression) || (element instanceof VisualizedExpression && element.treeItem.canEdit)) {
			this.debugService.getViewModel().setSelectedExpression(element, false);
		} else if (!element) {
			// Double click in watch panel triggers to add a new watch expression
			this.debugService.addWatchExpression();
		}
	}

	private async onContextMenu(e: ITreeContextMenuEvent<IExpression>): Promise<void> {
		const element = e.element;
		if (!element) {
			return;
		}

		const selection = this.tree.getSelection();

		const contextKeyService = element && await getContextForWatchExpressionMenuWithDataAccess(this.contextKeyService, element, this.debugService, this.logService);
		const menu = this.menuService.getMenuActions(MenuId.DebugWatchContext, contextKeyService, { arg: element, shouldForwardArgs: false });
		const { secondary } = getContextMenuActions(menu, 'inline');

		this.contextMenuService.showContextMenu({
			getAnchor: () => e.anchor,
			getActions: () => secondary,
			getActionsContext: () => element && selection.includes(element) ? selection : element ? [element] : []
		});
	}
}

class WatchExpressionsDelegate implements IListVirtualDelegate<IExpression> {

	getHeight(_element: IExpression): number {
		return 22;
	}

	getTemplateId(element: IExpression): string {
		if (element instanceof Expression) {
			return WatchExpressionsRenderer.ID;
		}

		if (element instanceof VisualizedExpression) {
			return VisualizedVariableRenderer.ID;
		}

		// Variable
		return VariablesRenderer.ID;
	}
}

function isDebugService(element: any): element is IDebugService {
	return typeof element.getConfigurationManager === 'function';
}

class WatchExpressionsDataSource extends AbstractExpressionDataSource<IDebugService, IExpression> {

	public override hasChildren(element: IExpression | IDebugService): boolean {
		return isDebugService(element) || element.hasChildren;
	}

	protected override doGetChildren(element: IDebugService | IExpression): Promise<Array<IExpression>> {
		if (isDebugService(element)) {
			const debugService = element;
			const watchExpressions = debugService.getModel().getWatchExpressions();
			const viewModel = debugService.getViewModel();
			return Promise.all(watchExpressions.map(we => !!we.name && !useCachedEvaluation
				? we.evaluate(viewModel.focusedSession!, viewModel.focusedStackFrame!, 'watch').then(() => we)
				: Promise.resolve(we)));
		}

		return element.getChildren();
	}
}


export class WatchExpressionsRenderer extends AbstractExpressionsRenderer {

	static readonly ID = 'watchexpression';

	constructor(
		private readonly expressionRenderer: DebugExpressionRenderer,
		@IMenuService private readonly menuService: IMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IDebugService debugService: IDebugService,
		@IContextViewService contextViewService: IContextViewService,
		@IHoverService hoverService: IHoverService,
		@IConfigurationService private configurationService: IConfigurationService,
	) {
		super(debugService, contextViewService, hoverService);
	}

	get templateId() {
		return WatchExpressionsRenderer.ID;
	}

	public override renderElement(node: ITreeNode<IExpression, FuzzyScore>, index: number, data: IExpressionTemplateData): void {
		data.elementDisposable.clear();
		data.elementDisposable.add(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('debug.showVariableTypes')) {
				super.renderExpressionElement(node.element, node, data);
			}
		}));
		super.renderExpressionElement(node.element, node, data);
	}

	protected renderExpression(expression: IExpression, data: IExpressionTemplateData, highlights: IHighlight[]): void {
		let text: string;
		data.type.textContent = '';
		const showType = this.configurationService.getValue<IDebugConfiguration>('debug').showVariableTypes;
		if (showType && expression.type) {
			text = typeof expression.value === 'string' ? `${expression.name}: ` : expression.name;
			//render type
			data.type.textContent = expression.type + ' =';
		} else {
			text = typeof expression.value === 'string' ? `${expression.name} =` : expression.name;
		}

		let title: string;
		if (expression.type) {
			if (showType) {
				title = `${expression.name}`;
			} else {
				title = expression.type === expression.value ?
					expression.type :
					`${expression.type}`;
			}
		} else {
			title = expression.value;
		}

		data.label.set(text, highlights, title);
		data.elementDisposable.add(this.expressionRenderer.renderValue(data.value, expression, {
			showChanged: true,
			maxValueLength: MAX_VALUE_RENDER_LENGTH_IN_VIEWLET,
			colorize: true,
			session: expression.getSession(),
		}));
	}

	protected getInputBoxOptions(expression: IExpression, settingValue: boolean): IInputBoxOptions {
		if (settingValue) {
			return {
				initialValue: expression.value,
				ariaLabel: localize('typeNewValue', "Type new value"),
				onFinish: async (value: string, success: boolean) => {
					if (success && value) {
						const focusedFrame = this.debugService.getViewModel().focusedStackFrame;
						if (focusedFrame && (expression instanceof Variable || expression instanceof Expression)) {
							await expression.setExpression(value, focusedFrame);
							this.debugService.getViewModel().updateViews();
						}
					}
				}
			};
		}

		return {
			initialValue: expression.name ? expression.name : '',
			ariaLabel: localize('watchExpressionInputAriaLabel', "Type watch expression"),
			placeholder: localize('watchExpressionPlaceholder', "Expression to watch"),
			onFinish: (value: string, success: boolean) => {
				if (success && value) {
					this.debugService.renameWatchExpression(expression.getId(), value);
					ignoreViewUpdates = true;
					this.debugService.getViewModel().updateViews();
					ignoreViewUpdates = false;
				} else if (!expression.name) {
					this.debugService.removeWatchExpressions(expression.getId());
				}
			}
		};
	}

	protected override renderActionBar(actionBar: ActionBar, expression: IExpression) {
		const contextKeyService = getContextForWatchExpressionMenu(this.contextKeyService, expression);
		const context = expression;
		const menu = this.menuService.getMenuActions(MenuId.DebugWatchContext, contextKeyService, { arg: context, shouldForwardArgs: false });

		const { primary } = getContextMenuActions(menu, 'inline');

		actionBar.clear();
		actionBar.context = context;
		actionBar.push(primary, { icon: true, label: false });
	}
}

/**
 * Gets a context key overlay that has context for the given expression.
 */
function getContextForWatchExpressionMenu(parentContext: IContextKeyService, expression: IExpression, additionalContext: [string, unknown][] = []) {
	const session = expression.getSession();
	return parentContext.createOverlay([
		[CONTEXT_VARIABLE_EVALUATE_NAME_PRESENT.key, 'evaluateName' in expression],
		[CONTEXT_WATCH_ITEM_TYPE.key, expression instanceof Expression ? 'expression' : expression instanceof Variable ? 'variable' : undefined],
		[CONTEXT_CAN_VIEW_MEMORY.key, !!session?.capabilities.supportsReadMemoryRequest && expression.memoryReference !== undefined],
		[CONTEXT_VARIABLE_IS_READONLY.key, !!expression.presentationHint?.attributes?.includes('readOnly') || expression.presentationHint?.lazy],
		[CONTEXT_VARIABLE_TYPE.key, expression.type],
		[CONTEXT_DEBUG_TYPE.key, session?.configuration.type],
		...additionalContext
	]);
}

/**
 * Gets a context key overlay that has context for the given expression, including data access info.
 */
async function getContextForWatchExpressionMenuWithDataAccess(parentContext: IContextKeyService, expression: IExpression, debugService: IDebugService, logService: ILogService) {
	const session = expression.getSession();
	if (!session || !session.capabilities.supportsDataBreakpoints) {
		return getContextForWatchExpressionMenu(parentContext, expression);
	}

	const contextKeys: [string, unknown][] = [];
	const stackFrame = debugService.getViewModel().focusedStackFrame;
	let dataBreakpointInfoResponse;

	try {
		// Per DAP spec:
		// - If evaluateName is available: use it as an expression (top-level evaluation)
		// - Otherwise, check if it's a Variable: use name + parent reference (container-relative)
		// - Otherwise: use name as an expression
		if ('evaluateName' in expression && expression.evaluateName) {
			// Use evaluateName if available (more precise for evaluation context)
			dataBreakpointInfoResponse = await session.dataBreakpointInfo(
				expression.evaluateName as string,
				undefined,
				stackFrame?.frameId
			);
		} else if (expression instanceof Variable) {
			// Variable without evaluateName: use name relative to parent container
			dataBreakpointInfoResponse = await session.dataBreakpointInfo(
				expression.name,
				expression.parent.reference,
				stackFrame?.frameId
			);
		} else {
			// Expression without evaluateName: use name as the expression to evaluate
			dataBreakpointInfoResponse = await session.dataBreakpointInfo(
				expression.name,
				undefined,
				stackFrame?.frameId
			);
		}
	} catch (error) {
		// silently continue without data breakpoint support for this item
		logService.error('Failed to get data breakpoint info for watch expression:', error);
	}

	const dataBreakpointId = dataBreakpointInfoResponse?.dataId;
	const dataBreakpointAccessTypes = dataBreakpointInfoResponse?.accessTypes;
	setDataBreakpointInfoResponse(dataBreakpointInfoResponse);

	if (!dataBreakpointAccessTypes) {
		contextKeys.push([CONTEXT_BREAK_WHEN_VALUE_CHANGES_SUPPORTED.key, !!dataBreakpointId]);
	} else {
		for (const accessType of dataBreakpointAccessTypes) {
			switch (accessType) {
				case 'read':
					contextKeys.push([CONTEXT_BREAK_WHEN_VALUE_IS_READ_SUPPORTED.key, !!dataBreakpointId]);
					break;
				case 'write':
					contextKeys.push([CONTEXT_BREAK_WHEN_VALUE_CHANGES_SUPPORTED.key, !!dataBreakpointId]);
					break;
				case 'readWrite':
					contextKeys.push([CONTEXT_BREAK_WHEN_VALUE_IS_ACCESSED_SUPPORTED.key, !!dataBreakpointId]);
					break;
			}
		}
	}

	return getContextForWatchExpressionMenu(parentContext, expression, contextKeys);
}


class WatchExpressionsAccessibilityProvider implements IListAccessibilityProvider<IExpression> {

	getWidgetAriaLabel(): string {
		return localize({ comment: ['Debug is a noun in this context, not a verb.'], key: 'watchAriaTreeLabel' }, "Debug Watch Expressions");
	}

	getAriaLabel(element: IExpression): string {
		if (element instanceof Expression) {
			return localize('watchExpressionAriaLabel', "{0}, value {1}", element.name, element.value);
		}

		// Variable
		return localize('watchVariableAriaLabel', "{0}, value {1}", element.name, element.value);
	}
}

class WatchExpressionsDragAndDrop implements ITreeDragAndDrop<IExpression> {

	constructor(private debugService: IDebugService) { }
	onDragStart?(data: IDragAndDropData, originalEvent: DragEvent): void {
		if (data instanceof ElementsDragAndDropData) {
			originalEvent.dataTransfer!.setData('text/plain', data.elements[0].name);
		}
	}

	onDragOver(data: IDragAndDropData, targetElement: IExpression | undefined, targetIndex: number | undefined, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): boolean | ITreeDragOverReaction {
		if (!(data instanceof ElementsDragAndDropData)) {
			return false;
		}

		const expressions = (data as ElementsDragAndDropData<IExpression>).elements;
		if (!(expressions.length > 0 && expressions[0] instanceof Expression)) {
			return false;
		}

		let dropEffectPosition: ListDragOverEffectPosition | undefined = undefined;
		if (targetIndex === undefined) {
			// Hovering over the list
			dropEffectPosition = ListDragOverEffectPosition.After;
			targetIndex = -1;
		} else {
			// Hovering over an element
			switch (targetSector) {
				case ListViewTargetSector.TOP:
				case ListViewTargetSector.CENTER_TOP:
					dropEffectPosition = ListDragOverEffectPosition.Before; break;
				case ListViewTargetSector.CENTER_BOTTOM:
				case ListViewTargetSector.BOTTOM:
					dropEffectPosition = ListDragOverEffectPosition.After; break;
			}
		}

		return { accept: true, effect: { type: ListDragOverEffectType.Move, position: dropEffectPosition }, feedback: [targetIndex] } satisfies ITreeDragOverReaction;
	}

	getDragURI(element: IExpression): string | null {
		if (!(element instanceof Expression) || element === this.debugService.getViewModel().getSelectedExpression()?.expression) {
			return null;
		}

		return element.getId();
	}

	getDragLabel(elements: IExpression[]): string | undefined {
		if (elements.length === 1) {
			return elements[0].name;
		}

		return undefined;
	}

	drop(data: IDragAndDropData, targetElement: IExpression, targetIndex: number | undefined, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): void {
		if (!(data instanceof ElementsDragAndDropData)) {
			return;
		}

		const draggedElement = (data as ElementsDragAndDropData<IExpression>).elements[0];
		if (!(draggedElement instanceof Expression)) {
			throw new Error('Invalid dragged element');
		}

		const watches = this.debugService.getModel().getWatchExpressions();
		const sourcePosition = watches.indexOf(draggedElement);

		let targetPosition;
		if (targetElement instanceof Expression) {
			targetPosition = watches.indexOf(targetElement);

			switch (targetSector) {
				case ListViewTargetSector.BOTTOM:
				case ListViewTargetSector.CENTER_BOTTOM:
					targetPosition++; break;
			}

			if (sourcePosition < targetPosition) {
				targetPosition--;
			}
		} else {
			targetPosition = watches.length - 1;
		}

		this.debugService.moveWatchExpression(draggedElement.getId(), targetPosition);
	}

	dispose(): void { }
}

registerAction2(class Collapse extends ViewAction<WatchExpressionsView> {
	constructor() {
		super({
			id: 'watch.collapse',
			viewId: WATCH_VIEW_ID,
			title: localize('collapse', "Collapse All"),
			f1: false,
			icon: Codicon.collapseAll,
			precondition: CONTEXT_WATCH_EXPRESSIONS_EXIST,
			menu: {
				id: MenuId.ViewTitle,
				order: 30,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', WATCH_VIEW_ID)
			}
		});
	}

	runInView(_accessor: ServicesAccessor, view: WatchExpressionsView) {
		view.collapseAll();
	}
});

export const ADD_WATCH_ID = 'workbench.debug.viewlet.action.addWatchExpression'; // Use old and long id for backwards compatibility
export const ADD_WATCH_LABEL = localize('addWatchExpression', "Add Expression");

registerAction2(class AddWatchExpressionAction extends Action2 {
	constructor() {
		super({
			id: ADD_WATCH_ID,
			title: ADD_WATCH_LABEL,
			f1: false,
			icon: watchExpressionsAdd,
			menu: {
				id: MenuId.ViewTitle,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', WATCH_VIEW_ID)
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const debugService = accessor.get(IDebugService);
		debugService.addWatchExpression();
	}
});

export const REMOVE_WATCH_EXPRESSIONS_COMMAND_ID = 'workbench.debug.viewlet.action.removeAllWatchExpressions';
export const REMOVE_WATCH_EXPRESSIONS_LABEL = localize('removeAllWatchExpressions', "Remove All Expressions");
registerAction2(class RemoveAllWatchExpressionsAction extends Action2 {
	constructor() {
		super({
			id: REMOVE_WATCH_EXPRESSIONS_COMMAND_ID, // Use old and long id for backwards compatibility
			title: REMOVE_WATCH_EXPRESSIONS_LABEL,
			f1: false,
			icon: watchExpressionsRemoveAll,
			precondition: CONTEXT_WATCH_EXPRESSIONS_EXIST,
			menu: {
				id: MenuId.ViewTitle,
				order: 20,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', WATCH_VIEW_ID)
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const debugService = accessor.get(IDebugService);
		debugService.removeWatchExpressions();
	}
});

registerAction2(class CopyExpression extends ViewAction<WatchExpressionsView> {
	constructor() {
		super({
			id: COPY_WATCH_EXPRESSION_COMMAND_ID,
			title: localize('copyWatchExpression', "Copy Expression"),
			f1: false,
			viewId: WATCH_VIEW_ID,
			precondition: CONTEXT_WATCH_EXPRESSIONS_EXIST,
			keybinding: {
				primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyC,
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.and(
					FocusedViewContext.isEqualTo(WATCH_VIEW_ID),
					CONTEXT_EXPRESSION_SELECTED.negate(),
				),
			},
			menu: {
				id: MenuId.DebugWatchContext,
				order: 20,
				group: '3_modification',
				when: CONTEXT_WATCH_ITEM_TYPE.isEqualTo('expression')
			}
		});
	}

	runInView(accessor: ServicesAccessor, view: WatchExpressionsView, value?: IExpression): void {
		const clipboardService = accessor.get(IClipboardService);
		if (!value) {
			value = view.treeSelection.at(-1);
		}
		if (value) {
			clipboardService.writeText(value.name);
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/welcomeView.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/welcomeView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createCommandUri } from '../../../../base/common/htmlContent.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { isCodeEditor, isDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { localize, localize2 } from '../../../../nls.js';
import { ILocalizedString } from '../../../../platform/action/common/action.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { OpenFileAction, OpenFolderAction } from '../../../browser/actions/workspaceActions.js';
import { ViewPane } from '../../../browser/parts/views/viewPane.js';
import { IViewletViewOptions } from '../../../browser/parts/views/viewsViewlet.js';
import { WorkbenchStateContext } from '../../../common/contextkeys.js';
import { Extensions, IViewDescriptorService, IViewsRegistry, ViewContentGroups } from '../../../common/views.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { CONTEXT_DEBUGGERS_AVAILABLE, CONTEXT_DEBUG_EXTENSION_AVAILABLE, IDebugService } from '../common/debug.js';
import { DEBUG_CONFIGURE_COMMAND_ID, DEBUG_START_COMMAND_ID } from './debugCommands.js';

const debugStartLanguageKey = 'debugStartLanguage';
const CONTEXT_DEBUG_START_LANGUAGE = new RawContextKey<string>(debugStartLanguageKey, undefined);
const CONTEXT_DEBUGGER_INTERESTED_IN_ACTIVE_EDITOR = new RawContextKey<boolean>('debuggerInterestedInActiveEditor', false);

export class WelcomeView extends ViewPane {

	static readonly ID = 'workbench.debug.welcome';
	static readonly LABEL: ILocalizedString = localize2('run', "Run");

	private debugStartLanguageContext: IContextKey<string | undefined>;
	private debuggerInterestedContext: IContextKey<boolean>;

	constructor(
		options: IViewletViewOptions,
		@IThemeService themeService: IThemeService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IDebugService private readonly debugService: IDebugService,
		@IEditorService private readonly editorService: IEditorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IOpenerService openerService: IOpenerService,
		@IStorageService storageSevice: IStorageService,
		@IHoverService hoverService: IHoverService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);

		this.debugStartLanguageContext = CONTEXT_DEBUG_START_LANGUAGE.bindTo(contextKeyService);
		this.debuggerInterestedContext = CONTEXT_DEBUGGER_INTERESTED_IN_ACTIVE_EDITOR.bindTo(contextKeyService);
		const lastSetLanguage = storageSevice.get(debugStartLanguageKey, StorageScope.WORKSPACE);
		this.debugStartLanguageContext.set(lastSetLanguage);

		const setContextKey = () => {
			let editorControl = this.editorService.activeTextEditorControl;
			if (isDiffEditor(editorControl)) {
				editorControl = editorControl.getModifiedEditor();
			}

			if (isCodeEditor(editorControl)) {
				const model = editorControl.getModel();
				const language = model ? model.getLanguageId() : undefined;
				if (language && this.debugService.getAdapterManager().someDebuggerInterestedInLanguage(language)) {
					this.debugStartLanguageContext.set(language);
					this.debuggerInterestedContext.set(true);
					storageSevice.store(debugStartLanguageKey, language, StorageScope.WORKSPACE, StorageTarget.MACHINE);
					return;
				}
			}
			this.debuggerInterestedContext.set(false);
		};

		const disposables = new DisposableStore();
		this._register(disposables);

		this._register(editorService.onDidActiveEditorChange(() => {
			disposables.clear();

			let editorControl = this.editorService.activeTextEditorControl;
			if (isDiffEditor(editorControl)) {
				editorControl = editorControl.getModifiedEditor();
			}

			if (isCodeEditor(editorControl)) {
				disposables.add(editorControl.onDidChangeModelLanguage(setContextKey));
			}

			setContextKey();
		}));
		this._register(this.debugService.getAdapterManager().onDidRegisterDebugger(setContextKey));
		this._register(this.onDidChangeBodyVisibility(visible => {
			if (visible) {
				setContextKey();
			}
		}));
		setContextKey();

		const debugKeybinding = this.keybindingService.lookupKeybinding(DEBUG_START_COMMAND_ID);
		debugKeybindingLabel = debugKeybinding ? ` (${debugKeybinding.getLabel()})` : '';
	}

	override shouldShowWelcome(): boolean {
		return true;
	}
}

const viewsRegistry = Registry.as<IViewsRegistry>(Extensions.ViewsRegistry);
viewsRegistry.registerViewWelcomeContent(WelcomeView.ID, {
	content: localize(
		{
			key: 'openAFileWhichCanBeDebugged',
			comment: [
				'Please do not translate the word "command", it is part of our internal syntax which must not change',
				'{Locked="](command:{0})"}'
			]
		},
		"[Open a file](command:{0}) which can be debugged or run.", OpenFileAction.ID
	),
	when: ContextKeyExpr.and(CONTEXT_DEBUGGERS_AVAILABLE, CONTEXT_DEBUGGER_INTERESTED_IN_ACTIVE_EDITOR.toNegated()),
	group: ViewContentGroups.Open,
});

let debugKeybindingLabel = '';
viewsRegistry.registerViewWelcomeContent(WelcomeView.ID, {
	content: `[${localize('runAndDebugAction', "Run and Debug")}${debugKeybindingLabel}](command:${DEBUG_START_COMMAND_ID})`,
	when: CONTEXT_DEBUGGERS_AVAILABLE,
	group: ViewContentGroups.Debug,
	// Allow inserting more buttons directly after this one (by setting order to 1).
	order: 1
});

viewsRegistry.registerViewWelcomeContent(WelcomeView.ID, {
	content: localize({ key: 'customizeRunAndDebug2', comment: ['{Locked="launch.json"}', '{Locked="["}', '{Locked="]({0})"}'] },
		"To customize Run and Debug [create a launch.json file]({0}).", `${createCommandUri(DEBUG_CONFIGURE_COMMAND_ID, { addNew: true }).toString()}`),
	when: ContextKeyExpr.and(CONTEXT_DEBUGGERS_AVAILABLE, WorkbenchStateContext.notEqualsTo('empty')),
	group: ViewContentGroups.Debug
});

viewsRegistry.registerViewWelcomeContent(WelcomeView.ID, {
	content: localize(
		{
			key: 'customizeRunAndDebugOpenFolder2',
			comment: [
				'{Locked="launch.json"}',
				'{Locked="["}',
				'{Locked="]({0})"}',
			]
		},
		"To customize Run and Debug, [open a folder]({0}) and create a launch.json file.", createCommandUri(OpenFolderAction.ID).toString()),
	when: ContextKeyExpr.and(CONTEXT_DEBUGGERS_AVAILABLE, WorkbenchStateContext.isEqualTo('empty')),
	group: ViewContentGroups.Debug
});

viewsRegistry.registerViewWelcomeContent(WelcomeView.ID, {
	content: localize('allDebuggersDisabled', "All debug extensions are disabled. Enable a debug extension or install a new one from the Marketplace."),
	when: CONTEXT_DEBUG_EXTENSION_AVAILABLE.toNegated(),
	group: ViewContentGroups.Debug
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/media/breakpointWidget.css]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/media/breakpointWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .zone-widget .zone-widget-container.breakpoint-widget {
	display: flex;
	border-color: #007ACC;
	background: var(--vscode-editor-background);

	.breakpoint-select-container {
		display: flex;
		justify-content: center;
		flex-direction: column;
		padding: 0 10px;
		flex-shrink: 0;
	}

	.monaco-select-box {
		min-width: 100px;
		min-height: 18px;
		padding: 2px 20px 2px 8px;
	}

	.breakpoint-select-container:after {
		right: 14px;
	}

	.inputContainer {
		flex: 1;
	}

	.select-breakpoint-container {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-grow: 1;
		width: 0;
	}

	.select-breakpoint-container .monaco-button {
		padding-left: 8px;
		padding-right: 8px;
		line-height: 14px;
		flex-grow: 0;
		width: initial;
	}

	.select-breakpoint-container .select-box-container,
	.select-mode-container {
		display: flex;
		justify-content: center;
		flex-direction: column;
		width: 300px;
	}

	.select-breakpoint-container .select-box-container  {
		width: 300px;
	}

	.select-mode-container .select-box-container  {
		width: 100px;
		margin-right: 10px;
	}

	.select-breakpoint-container:after {
		right: 14px;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/media/callStackEditorContribution.css]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/media/callStackEditorContribution.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .view-overlays .debug-top-stack-frame-line {
	background-color: var(--vscode-editor-stackFrameHighlightBackground);
}

.monaco-editor .view-overlays .debug-focused-stack-frame-line {
	background-color: var(--vscode-editor-focusedStackFrameHighlightBackground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/media/callStackWidget.css]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/media/callStackWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.multiCallStackFrame {
	.header {
		display: flex;

		align-items: center;
		height: 24px;
		background: var(--vscode-multiDiffEditor-headerBackground);
		border-top: 1px solid var(--vscode-multiDiffEditor-border);
		color: var(--vscode-foreground);
		padding: 0 5px;
	}

	.title {
		flex-grow: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		&[role="link"] {
			cursor: pointer;
		}

		.monaco-icon-label::before {
			height: auto;
		}
	}

	&.collapsed {
		.header {
			border-bottom: 1px solid var(--vscode-multiDiffEditor-border);
		}

		.editorParent {
			display: none;
		}
	}

	.collapse-button {
		width: 16px;
		min-height: 1px; /* show even if empty */
		line-height: 0;

		a {
			cursor: pointer;
		}
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-right: 12px;
	}
}

.multiCallStackWidget {
	.multiCallStackFrameContainer {
		background: none !important;
	}
}

.monaco-editor .call-stack-go-to-file-link {
	text-decoration: underline;
	cursor: pointer;
	color: var(--vscode-editorLink-activeForeground) !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/media/debug.contribution.css]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/media/debug.contribution.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.codicon-debug-hint {
	cursor: pointer;
}

.codicon-debug-hint:not([class*='codicon-debug-breakpoint']):not([class*='codicon-debug-stackframe']) {
	opacity: 0.4 !important;
}

.inline-breakpoint-widget.codicon {
	display: flex !important;
	align-items: center;
}

.inline-breakpoint-widget.codicon-debug-breakpoint-disabled {
	opacity: 0.7;
}

.monaco-editor .inline-breakpoint-widget.line-start {
	left: -8px !important;
}

.monaco-editor .debug-breakpoint-placeholder {
	width: 0.9em;
	display: inline-flex;
	vertical-align: middle;
	margin-top: -1px;
}


.codicon-debug-breakpoint-conditional.codicon-debug-stackframe-focused::after,
.codicon-debug-breakpoint-conditional.codicon-debug-stackframe::after,
.codicon-debug-breakpoint.codicon-debug-stackframe-focused::after,
.codicon-debug-breakpoint.codicon-debug-stackframe::after {
	content: var(--vscode-icon-debug-stackframe-dot-content);
	font-family: var(--vscode-icon-debug-stackframe-dot-font-family);
	position: absolute;
}

.monaco-editor .debug-top-stack-frame-column {
	font: normal normal normal 16px/1 codicon;
	text-rendering: auto;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	margin-left: 0;
	margin-right: 4px;
	margin-top: -1px; /* TODO @misolori: figure out a way to not use negative margin for alignment */
	align-items: center;
	width: 0.9em;
	display: inline-flex;
	vertical-align: middle;
}

.debug-var-hover-pre {
	margin: 0;
}

.debug-var-hover-pre span {
	display: inline !important;
}

/* Do not push text with inline decoration when decoration on start of line */
.monaco-editor .debug-top-stack-frame-column.start-of-line {
	position: absolute;
	top: 50%;
	transform: translate(-17px, -50%);
	margin-top: 0px; /* TODO @misolori: figure out a way to not use negative margin for alignment */
}

.monaco-editor .inline-breakpoint-widget {
	cursor: pointer;
}

.monaco-workbench .debug-view-content .monaco-list-row .monaco-tl-contents {
	overflow: hidden;
	text-overflow: ellipsis;
}

/* Expressions */


.monaco-workbench .monaco-list-row .expression {
	display: flex;
}

.monaco-workbench .debug-pane .monaco-list-row .expression,
.monaco-workbench .debug-hover-widget .monaco-list-row .expression {
	font-size: 13px;
	overflow: hidden;
	text-overflow: ellipsis;
	font-family: var(--monaco-monospace-font);
	white-space: pre;
}

.monaco-workbench.mac .debug-pane .monaco-list-row .expression,
.monaco-workbench.mac .debug-hover-widget .monaco-list-row .expression {
	font-size: 11px;
}

.monaco-workbench .monaco-list-row .expression .value {
	margin-left: 6px;
}

.monaco-workbench .monaco-list-row .expression .lazy-button {
	margin-left: 3px;
	display: none;
	border-radius: 5px;
	align-self: center;
}

.monaco-workbench .monaco-list-row .expression.lazy .lazy-button {
	display: inline;
}

/* Links */

.monaco-workbench .monaco-list-row .expression .value a.link:hover {
	text-decoration: underline;
}

.monaco-workbench .monaco-list-row .expression .value a.link.pointer {
	cursor: pointer;
}

/* White color when element is selected and list is focused. White looks better on blue selection background. */
.monaco-workbench .monaco-list:focus .monaco-list-row.selected .expression .name,
.monaco-workbench .monaco-list:focus .monaco-list-row.selected .expression .value {
	color: inherit;
}

.monaco-workbench .monaco-list-row .expression .name.virtual {
	opacity: 0.5;
}

.monaco-workbench .monaco-list-row .expression .name.internal {
	opacity: 0.5;
}

.monaco-workbench .monaco-list-row .expression .unavailable {
	font-style: italic;
}

.monaco-workbench .debug-inline-value {
	background-color: var(--vscode-editor-inlineValuesBackground);
	color: var(--vscode-editor-inlineValuesForeground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/media/debugHover.css]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/media/debugHover.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .debug-hover-widget {
	position: absolute;
	z-index: 50;
	animation-duration: 0.15s;
	animation-name: fadeIn;
	user-select: text;
	-webkit-user-select: text;
	word-break: break-all;
	white-space: pre;
}

.monaco-editor .debug-hover-widget .complex-value {
	max-width: 550px;
}

.monaco-editor .debug-hover-widget .complex-value .title,
.monaco-editor .debug-hover-widget .complex-value .tip {
	padding-left: 15px;
	padding-right: 2px;
	font-size: 11px;
	line-height: 18px;
	word-break: normal;
	text-overflow: ellipsis;
	height: 18px;
	overflow: hidden;
	white-space: pre;
}

.monaco-editor .debug-hover-widget .complex-value .title {
	border-bottom: 1px solid rgba(128, 128, 128, 0.35);
}

.monaco-editor .debug-hover-widget .complex-value .tip {
	border-top: 1px solid rgba(128, 128, 128, 0.35);
	opacity: 0.5;
}

.monaco-editor .debug-hover-widget .debug-hover-tree {
	line-height: 18px;
	cursor: pointer;
}

.monaco-editor .debug-hover-widget .debug-hover-tree .monaco-list-row .monaco-tl-contents {
	user-select: text;
	-webkit-user-select: text;
	white-space: pre;
}

/* Disable tree highlight in debug hover tree. */
.monaco-editor .debug-hover-widget .debug-hover-tree .monaco-list-rows .monaco-list-row:hover:not(.highlighted):not(.selected):not(.focused)  {
	background-color: inherit;
}

.monaco-editor .debug-hover-widget pre {
	margin-top: 0;
	margin-bottom: 0;
}

.monaco-editor .debugHoverHighlight {
	background-color: rgba(173, 214, 255, 0.15);
}

.monaco-editor .debug-hover-widget > .monaco-scrollable-element > .value {
	color: rgba(108, 108, 108, 0.8);
	overflow: auto;
	font-family: var(--monaco-monospace-font);
	max-height: 500px;
	padding: 4px 5px;
	white-space: pre-wrap;
}

.monaco-editor.vs-dark .debugHoverHighlight,
.monaco-editor.hc-theme .debugHoverHighlight {
	background-color: rgba(38, 79, 120, 0.25);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/media/debugToolBar.css]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/media/debugToolBar.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .debug-toolbar {
	position: absolute;
	z-index: 2520; /* Below quick input at 2550, above custom titlebar toolbar at 2500 */
	height: 28px;
	display: flex;
	padding-left: 2px;
	border-radius: 5px;
	left: 0;
	top: 0;
	-webkit-app-region: no-drag;
}

.monaco-workbench .debug-toolbar .monaco-action-bar .action-item {
	margin-right: 4px;
}

.monaco-workbench .debug-toolbar .monaco-action-bar .action-item.select-container {
	margin-right: 2px;
}

.monaco-workbench .debug-toolbar .monaco-action-bar .action-item.select-container .monaco-select-box,
.monaco-workbench .start-debug-action-item .select-container .monaco-select-box {
	padding: 0 24px 0 8px;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.monaco-workbench .debug-toolbar .drag-area {
	cursor: grab;
	width: 20px;
	opacity: 0.5;
	display: flex;
	align-items: center;
	justify-content: center;
}

.monaco-workbench .debug-toolbar .drag-area.dragged {
	cursor: grabbing;
}

.monaco-workbench  .debug-toolbar .monaco-action-bar .action-item .action-label {
	margin-right: 0;
	background-size: 16px;
	background-position: center center;
	background-repeat: no-repeat;
	display: flex;
	align-items: center;
	justify-content: center;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/media/debugViewlet.css]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/media/debugViewlet.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Debug viewlet */

.debug-pane {
	height: 100%;
}

.debug-view-content {
	height: 100%;
}

.monaco-workbench .debug-action.notification:after {
	content: '';
	width: 6px;
	height: 6px;
	background-color: #CC6633;
	position: absolute;
	top: 10px;
	right: 6px;
	border-radius: 10px;
	border: 1px solid white;
}

.monaco-workbench .part > .title > .title-actions .start-debug-action-item {
	display: flex;
	align-items: center;
	line-height: 20px;
	flex-shrink: 1;
}

.monaco-workbench.mac .part > .title > .title-actions .start-debug-action-item {
	border-radius: 5px;
}

.monaco-workbench .part > .title > .title-actions .start-debug-action-item .codicon {
	line-height: inherit;
	flex-shrink: 0;
}

.monaco-workbench .part > .title > .title-actions .start-debug-action-item .codicon-debug-start {
	width: 18px;
	height: 22px;
	padding-left: 3px;
	padding-right: 1px
}

.monaco-workbench .monaco-action-bar .start-debug-action-item .configuration .monaco-select-box {
	border: none;
	margin-top: 0px;
	cursor: pointer;
	line-height: inherit;
	padding-top: 0;
	padding-bottom: 0;

	/* The debug view title is crowded, let this one get narrower than others */
	min-width: 90px;

	white-space: nowrap;
	text-overflow: ellipsis;
}


.monaco-workbench.safari .monaco-action-bar .start-debug-action-item .configuration .monaco-select-box {
	margin-bottom: 0px;
}

.monaco-workbench .monaco-action-bar .start-debug-action-item .configuration.disabled .monaco-select-box {
	opacity: 0.7;
	font-style: italic;
	cursor: initial;
}

/* Debug viewlet trees */

.debug-pane .line-number {
	padding-left: 4px;
	padding-right: 4px;
}

.debug-pane .disabled {
	opacity: 0.65;
	cursor: initial;
}

.debug-pane .monaco-list:focus .monaco-list-row.selected .state.label,
.debug-pane .monaco-list:focus .monaco-list-row.selected .load-all,
.debug-pane .monaco-list:focus .monaco-list-row.selected.focused .state.label {
	color: inherit;
}

/* Call stack */

.debug-pane .call-stack-state-message {
	flex: 1;
	text-align: right;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	margin: 0px 10px;
}

.debug-pane .call-stack-state-message > .label {
	border-radius: 3px;
	padding: 1px 2px;
	font-size: 9px;
}

.debug-pane .debug-call-stack .thread,
.debug-pane .debug-call-stack .session,
.debug-pane .debug-call-stack .stack-frame {
	display: flex;
	padding-right: 12px;
}

.debug-pane .debug-call-stack .thread,
.debug-pane .debug-call-stack .session {
	align-items: center;
}

.debug-pane .debug-call-stack .thread > .name,
.debug-pane .debug-call-stack .session > .name {
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
}

.debug-pane .debug-call-stack .thread > .state.label,
.debug-pane .debug-call-stack .session > .state.label {
	overflow: hidden;
	text-overflow: ellipsis;
	margin: 0 10px;
	text-transform: uppercase;
	align-self: center;
	font-size: 0.8em;
}

.debug-pane .debug-call-stack .monaco-list-row:hover .state.label {
	display: none;
}

.debug-pane .debug-call-stack .monaco-list-row:hover .stack-frame.has-actions .file .line-number {
	display: none;
}

.debug-pane .monaco-list-row .monaco-action-bar {
	display: none;
	flex-shrink: 0;
}

.debug-pane .monaco-list-row:hover .monaco-action-bar,
.debug-pane .monaco-list-row.focused .monaco-action-bar {
	display: initial;
}

.debug-pane .monaco-list-row .monaco-action-bar .action-label {
	padding: 2px;
}

.debug-pane .session .codicon {
	line-height: 22px;
	margin-right: 2px;
}

.debug-pane .debug-call-stack .stack-frame {
	overflow: hidden;
	text-overflow: ellipsis;
}

.debug-pane .debug-call-stack .stack-frame.label {
	text-align: center;
	font-style: italic;
}

.debug-pane .debug-call-stack .stack-frame .label {
	flex: 1;
	flex-shrink: 0;
	min-width: fit-content;
}

.debug-pane .debug-call-stack .stack-frame.label > .file {
	display: none;
}

.debug-pane .debug-call-stack .stack-frame > .file {
	display: flex;
	overflow: hidden;
	justify-content: flex-end;
}

.debug-pane .debug-call-stack .stack-frame > .file > .line-number.unavailable {
	display: none;
}

.debug-pane .debug-call-stack .stack-frame > .file > .file-name {
	overflow: hidden;
	text-overflow: ellipsis;
	margin-right: 0.8em;
}

.debug-pane .debug-call-stack .stack-frame > .file:not(:first-child) {
	margin-left: 0.8em;
}

.debug-pane .debug-call-stack .load-all {
	text-align: center;
}

.debug-pane .debug-call-stack .show-more {
	opacity: 0.5;
	text-align: center;
}

.debug-pane .debug-call-stack .error {
	font-style: italic;
	text-overflow: ellipsis;
	overflow: hidden;
}

/* Variables & Expression view */

.debug-pane .scope {
	font-weight: bold;
	font-size: 11px;
}

.debug-pane .monaco-list-row .expression .actionbar-spacer {
	flex-grow: 1;
}

.debug-pane .monaco-list-row .expression .value {
	height: 22px;
	overflow: hidden;
	white-space: pre;
	text-overflow: ellipsis;
}

.debug-pane .monaco-list-row .expression .value.changed {
	border-radius: 4px;
}

.debug-pane .monaco-inputbox {
	width: 100%;
	line-height: normal;
}

.debug-pane .inputBoxContainer {
	box-sizing: border-box;
	flex-grow: 1;
}

.debug-pane .debug-watch .monaco-inputbox {
	font-family: var(--monaco-monospace-font);
}

.debug-pane .monaco-inputbox > .ibwrapper {
	height: 19px;
}

.debug-pane .monaco-inputbox > .ibwrapper > .input {
	padding: 0px;
	color: initial;
}

.debug-pane .watch-expression {
	display: flex;
}

.debug-pane .watch-expression .expression {
	flex : 1;
}

.debug-pane .debug-variables .scope .error {
	font-style: italic;
	text-overflow: ellipsis;
	overflow: hidden;
	font-family: var(--monaco-monospace-font);
	font-weight: normal;
}
.debug-view-content .monaco-tl-contents .highlight {
	color: unset !important;
	background-color: var(--vscode-list-filterMatchBackground);
	outline: 1px dotted var(--vscode-list-filterMatchBorder);
	outline-offset: -1px;
}

/* Breakpoints */

.debug-pane .monaco-list-row {
	line-height: 22px;
}

.debug-pane .debug-breakpoints .breakpoint {
	display: flex;
	padding-right: 0.8em;
	flex: 1;
	align-items: center;
	margin-left: -19px;
}

.debug-pane .debug-breakpoints .breakpoint-folder,
.debug-pane .debug-breakpoints .exception  {
	margin-left: 0;
}

.debug-pane .debug-breakpoints .breakpoint input {
	flex-shrink: 0;
}

.debug-pane .debug-breakpoints .breakpoint > .codicon {
	width: 19px;
	height: 19px;
	min-width: 19px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.debug-pane .debug-breakpoints .breakpoint > .access-type {
	opacity: 0.7;
	margin-left: 0.9em;
	text-overflow: ellipsis;
	overflow: hidden;
}
.debug-pane .debug-breakpoints .breakpoint > .file-path,
.debug-pane .debug-breakpoints .breakpoint > .condition {
	opacity: 0.7;
	margin-left: 0.9em;
	flex: 1;
	text-overflow: ellipsis;
	overflow: hidden;
}

.debug-pane .debug-breakpoints .breakpoint .name {
	overflow: hidden;
	text-overflow: ellipsis
}

.debug-pane .pane-header .breakpoint-warning {
	margin-left: 3px;
}

.debug-pane .pane-header .breakpoint-warning .monaco-icon-label .codicon {
	display: flex;
	align-items: center;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/media/exceptionWidget.css]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/media/exceptionWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .zone-widget.exception-widget-container {
	overflow: hidden;
}

.monaco-editor .zone-widget .zone-widget-container.exception-widget {
	padding: 6px 10px;
	white-space: pre-wrap;
	user-select: text;
	-webkit-user-select: text;
}

.monaco-editor .zone-widget .zone-widget-container.exception-widget .title {
	display: flex;
}

.monaco-editor .zone-widget .zone-widget-container.exception-widget .title .label {
	font-weight: bold;
	display: flex;
	align-items: center;
}

.monaco-editor .zone-widget .zone-widget-container.exception-widget .title .actions {
	flex: 1;
}

.monaco-editor .zone-widget .zone-widget-container.exception-widget .description,
.monaco-editor .zone-widget .zone-widget-container.exception-widget .stack-trace {
	font-family: var(--monaco-monospace-font);
}

.monaco-editor .zone-widget .zone-widget-container.exception-widget .stack-trace {
	margin-top: 0.5em;
}

.monaco-editor .zone-widget .zone-widget-container.exception-widget .stack-trace a {
	text-decoration: underline;
	cursor: pointer;
}

.monaco-workbench.mac .zone-widget .zone-widget-container.exception-widget {
	font-size: 11px;
}

.monaco-workbench.windows .zone-widget .zone-widget-container.exception-widget,
.monaco-workbench.linux .zone-widget .zone-widget-container.exception-widget {
	font-size: 13px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/media/repl.css]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/media/repl.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Debug repl */

.monaco-workbench .repl {
	height: 100%;
	box-sizing: border-box;
	overflow: hidden;
}

.monaco-workbench .repl .repl-tree .monaco-tl-contents {
	user-select: text;
	-webkit-user-select: text;
	white-space: pre;
}

.monaco-workbench .repl .repl-tree .monaco-tl-contents .expression {
	font-family: var(--vscode-repl-font-family);
	font-size: var(--vscode-repl-font-size);
	line-height: var(--vscode-repl-line-height);
}

.monaco-workbench .repl .repl-tree .monaco-tl-contents .expression .lazy-button {
	cursor: pointer;
}

.monaco-workbench .repl .repl-tree .monaco-tl-twistie {
	background-position-y: calc(100% - (var(--vscode-repl-font-size-for-twistie)));
}

.monaco-workbench .repl .repl-tree.word-wrap .monaco-tl-contents {
	/* Wrap words but also do not trim whitespace #6275 */
	word-wrap: break-word;
	white-space: pre-wrap;
	/* Break on all #7533 */
	word-break: break-all;
}

.monaco-workbench .repl .repl-tree.word-wrap .monaco-tl-contents .expression.nested-variable {
	white-space: pre; /* Preserve whitespace but don't wrap */
}

.monaco-workbench .repl .repl-tree .monaco-tl-twistie.collapsible + .monaco-tl-contents,
.monaco-workbench .repl .repl-tree .monaco-tl-twistie {
	cursor: pointer;
}

.monaco-workbench .repl .repl-tree .output.expression.value-and-source {
	display: flex;
}

.monaco-workbench .repl .repl-tree .output.expression.value-and-source .label {
	margin-right: 4px;
}

.monaco-workbench .repl .repl-tree .output.expression.value-and-source .count-badge-wrapper {
	margin-right: 4px;
}

.monaco-workbench .repl .repl-tree .output.expression.value-and-source .count-badge-wrapper .monaco-count-badge {
	/* Allow the badge to be a bit shorter so it does not look cut off */
	min-height: 16px;
	word-break: keep-all;
}

.monaco-workbench .repl .repl-tree .monaco-tl-contents .arrow {
	position:absolute;
	left: 2px;
}

.monaco-workbench .repl .repl-tree .output.expression.value-and-source .source,
.monaco-workbench .repl .repl-tree .group .source {
	margin-left: auto;
	margin-right: 8px;
	cursor: pointer;
	text-decoration: underline;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-align: right;
	/*Use direction so the source shows elipses on the left*/
	direction: rtl;
	max-width: 400px;
}

.monaco-workbench .repl .repl-tree .output.expression > .value,
.monaco-workbench .repl .repl-tree .evaluation-result.expression > .value {
	margin-left: 0px;
}

.monaco-workbench .repl .repl-tree .output.expression .name:not(:empty) {
	margin-right: 6px;
}

.monaco-workbench .repl .repl-input-wrapper {
	display: flex;
	align-items: center;
}

/* Do not render show more in REPL suggest widget status bar */
.monaco-workbench .repl .repl-input-wrapper .suggest-status-bar .monaco-action-bar.right {
	display: none;
}

.monaco-workbench .repl .repl-input-wrapper .repl-input-chevron {
	padding: 0 6px 0 8px;
	width: 16px;
	height: 100%;
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	font-weight: 600;
}

/* Output coloring  and styling */
.monaco-workbench .repl .repl-tree .output.expression > .ignore {
	font-style: italic;
}

/* ANSI Codes */
.monaco-workbench .repl .repl-tree .output.expression .code-bold	{ font-weight: bold; }
.monaco-workbench .repl .repl-tree .output.expression .code-italic	{ font-style: italic; }
.monaco-workbench .repl .repl-tree .output.expression .code-underline { text-decoration: underline;  text-decoration-style:solid; }
.monaco-workbench .repl .repl-tree .output.expression .code-double-underline { text-decoration: underline;  text-decoration-style:double; }
.monaco-workbench .repl .repl-tree .output.expression .code-strike-through { text-decoration:line-through;  text-decoration-style:solid; }
.monaco-workbench .repl .repl-tree .output.expression .code-overline { text-decoration:overline;  text-decoration-style:solid; }
/* because they can exist at same time we need all the possible underline(or double-underline),overline and strike-through combinations */
.monaco-workbench .repl .repl-tree .output.expression .code-overline.code-underline.code-strike-through { text-decoration: overline underline line-through; text-decoration-style:solid; }
.monaco-workbench .repl .repl-tree .output.expression .code-overline.code-underline { text-decoration: overline underline; text-decoration-style:solid; }
.monaco-workbench .repl .repl-tree .output.expression .code-overline.code-strike-through { text-decoration: overline line-through; text-decoration-style:solid; }
.monaco-workbench .repl .repl-tree .output.expression .code-underline.code-strike-through { text-decoration: underline line-through; text-decoration-style:solid; }
.monaco-workbench .repl .repl-tree .output.expression .code-overline.code-double-underline.code-strike-through { text-decoration: overline underline line-through; text-decoration-style:double; }
.monaco-workbench .repl .repl-tree .output.expression .code-overline.code-double-underline { text-decoration: overline underline; text-decoration-style:double; }
.monaco-workbench .repl .repl-tree .output.expression .code-double-underline.code-strike-through { text-decoration: underline line-through; text-decoration-style:double; }
.monaco-workbench .repl .repl-tree .output.expression .code-dim	{ opacity: 0.4; }
.monaco-workbench .repl .repl-tree .output.expression .code-hidden { opacity: 0; }
.monaco-workbench .repl .repl-tree .output.expression .code-blink { animation: code-blink-key 1s cubic-bezier(1, 0, 0, 1) infinite alternate; }
.monaco-workbench .repl .repl-tree .output.expression .code-rapid-blink { animation: code-blink-key 0.3s cubic-bezier(1, 0, 0, 1) infinite alternate; }
@keyframes code-blink-key {
	to { opacity: 0.4; }
}
.monaco-workbench .repl .repl-tree .output.expression .code-subscript { vertical-align: sub; font-size: smaller; line-height: normal; }
.monaco-workbench .repl .repl-tree .output.expression .code-superscript { vertical-align: super; font-size: smaller; line-height: normal; }
```

--------------------------------------------------------------------------------

````
