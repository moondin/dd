---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 376
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 376 of 552)

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

---[FILE: src/vs/workbench/contrib/debug/browser/breakpointsView.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/breakpointsView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { IKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { Gesture } from '../../../../base/browser/touch.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { AriaRole } from '../../../../base/browser/ui/aria/aria.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IconLabel } from '../../../../base/browser/ui/iconLabel/iconLabel.js';
import { InputBox } from '../../../../base/browser/ui/inputbox/inputBox.js';
import { IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { Orientation } from '../../../../base/browser/ui/splitview/splitview.js';
import { ICompressedTreeElement, ICompressedTreeNode } from '../../../../base/browser/ui/tree/compressedObjectTreeModel.js';
import { ICompressibleTreeRenderer } from '../../../../base/browser/ui/tree/objectTree.js';
import { ITreeContextMenuEvent, ITreeNode } from '../../../../base/browser/ui/tree/tree.js';
import { Action } from '../../../../base/common/actions.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { DisposableStore, dispose, toDisposable } from '../../../../base/common/lifecycle.js';
import * as resources from '../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { Constants } from '../../../../base/common/uint.js';
import { isCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { localize, localize2 } from '../../../../nls.js';
import { getActionBarActions, getContextMenuActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { Action2, IMenu, IMenuService, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService, IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { TextEditorSelectionRevealType } from '../../../../platform/editor/common/editor.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { WorkbenchCompressibleObjectTree } from '../../../../platform/list/browser/listService.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { defaultInputBoxStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ViewAction, ViewPane } from '../../../browser/parts/views/viewPane.js';
import { IViewletViewOptions } from '../../../browser/parts/views/viewsViewlet.js';
import { IEditorPane } from '../../../common/editor.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { ACTIVE_GROUP, IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { BREAKPOINTS_VIEW_ID, BREAKPOINT_EDITOR_CONTRIBUTION_ID, CONTEXT_BREAKPOINTS_EXIST, CONTEXT_BREAKPOINTS_FOCUSED, CONTEXT_BREAKPOINT_HAS_MODES, CONTEXT_BREAKPOINT_INPUT_FOCUSED, CONTEXT_BREAKPOINT_ITEM_IS_DATA_BYTES, CONTEXT_BREAKPOINT_ITEM_TYPE, CONTEXT_BREAKPOINT_SUPPORTS_CONDITION, CONTEXT_DEBUGGERS_AVAILABLE, CONTEXT_IN_DEBUG_MODE, CONTEXT_SET_DATA_BREAKPOINT_BYTES_SUPPORTED, DEBUG_SCHEME, DataBreakpointSetType, DataBreakpointSource, DebuggerString, IBaseBreakpoint, IBreakpoint, IBreakpointEditorContribution, IBreakpointUpdateData, IDataBreakpoint, IDataBreakpointInfoResponse, IDebugModel, IDebugService, IEnablement, IExceptionBreakpoint, IFunctionBreakpoint, IInstructionBreakpoint, State } from '../common/debug.js';
import { Breakpoint, DataBreakpoint, ExceptionBreakpoint, FunctionBreakpoint, InstructionBreakpoint } from '../common/debugModel.js';
import { DisassemblyViewInput } from '../common/disassemblyViewInput.js';
import * as icons from './debugIcons.js';
import { DisassemblyView } from './disassemblyView.js';
import { equals } from '../../../../base/common/arrays.js';

const $ = dom.$;

function createCheckbox(disposables: DisposableStore): HTMLInputElement {
	const checkbox = <HTMLInputElement>$('input');
	checkbox.type = 'checkbox';
	checkbox.tabIndex = -1;
	disposables.add(Gesture.ignoreTarget(checkbox));

	return checkbox;
}

const MAX_VISIBLE_BREAKPOINTS = 9;
export function getExpandedBodySize(model: IDebugModel, sessionId: string | undefined, countLimit: number): number {
	const length = model.getBreakpoints().length + model.getExceptionBreakpointsForSession(sessionId).length + model.getFunctionBreakpoints().length + model.getDataBreakpoints().length + model.getInstructionBreakpoints().length;
	return Math.min(countLimit, length) * 22;
}
type BreakpointItem = IBreakpoint | IFunctionBreakpoint | IDataBreakpoint | IExceptionBreakpoint | IInstructionBreakpoint;

/**
 * Represents a file node in the breakpoints tree that groups breakpoints by file.
 */
export class BreakpointsFolderItem {
	constructor(
		readonly uri: URI,
		readonly breakpoints: IBreakpoint[]
	) { }

	getId(): string {
		return this.uri.toString();
	}

	get enabled(): boolean {
		return this.breakpoints.every(bp => bp.enabled);
	}

	get indeterminate(): boolean {
		const enabledCount = this.breakpoints.filter(bp => bp.enabled).length;
		return enabledCount > 0 && enabledCount < this.breakpoints.length;
	}
}

type BreakpointTreeElement = BreakpointsFolderItem | BreakpointItem;

interface InputBoxData {
	breakpoint: IFunctionBreakpoint | IExceptionBreakpoint | IDataBreakpoint;
	type: 'condition' | 'hitCount' | 'name';
}

function getModeKindForBreakpoint(breakpoint: IBreakpoint) {
	const kind = breakpoint instanceof Breakpoint ? 'source' : breakpoint instanceof InstructionBreakpoint ? 'instruction' : 'exception';
	return kind;
}

export class BreakpointsView extends ViewPane {

	private tree!: WorkbenchCompressibleObjectTree<BreakpointTreeElement, void>;
	private needsRefresh = false;
	private needsStateChange = false;
	private ignoreLayout = false;
	private menu: IMenu;
	private breakpointItemType: IContextKey<string | undefined>;
	private breakpointIsDataBytes: IContextKey<boolean | undefined>;
	private breakpointHasMultipleModes: IContextKey<boolean>;
	private breakpointSupportsCondition: IContextKey<boolean>;
	private _inputBoxData: InputBoxData | undefined;
	breakpointInputFocused: IContextKey<boolean>;
	private autoFocusedElement: BreakpointItem | undefined;
	private collapsedState = new Set<string>();

	private hintContainer: IconLabel | undefined;
	private hintDelayer: RunOnceScheduler;

	private getPresentation(): 'tree' | 'list' {
		return this.configurationService.getValue<'tree' | 'list'>('debug.breakpointsView.presentation');
	}

	constructor(
		options: IViewletViewOptions,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IDebugService private readonly debugService: IDebugService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IEditorService private readonly editorService: IEditorService,
		@IContextViewService private readonly contextViewService: IContextViewService,
		@IConfigurationService configurationService: IConfigurationService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IOpenerService openerService: IOpenerService,
		@ILabelService private readonly labelService: ILabelService,
		@IMenuService menuService: IMenuService,
		@IHoverService hoverService: IHoverService,
		@ILanguageService private readonly languageService: ILanguageService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);

		this.menu = menuService.createMenu(MenuId.DebugBreakpointsContext, contextKeyService);
		this._register(this.menu);
		this.breakpointItemType = CONTEXT_BREAKPOINT_ITEM_TYPE.bindTo(contextKeyService);
		this.breakpointIsDataBytes = CONTEXT_BREAKPOINT_ITEM_IS_DATA_BYTES.bindTo(contextKeyService);
		this.breakpointHasMultipleModes = CONTEXT_BREAKPOINT_HAS_MODES.bindTo(contextKeyService);
		this.breakpointSupportsCondition = CONTEXT_BREAKPOINT_SUPPORTS_CONDITION.bindTo(contextKeyService);
		this.breakpointInputFocused = CONTEXT_BREAKPOINT_INPUT_FOCUSED.bindTo(contextKeyService);
		this._register(this.debugService.getModel().onDidChangeBreakpoints(() => this.onBreakpointsChange()));
		this._register(this.debugService.getViewModel().onDidFocusSession(() => this.onBreakpointsChange()));
		this._register(this.debugService.onDidChangeState(() => this.onStateChange()));
		this.hintDelayer = this._register(new RunOnceScheduler(() => this.updateBreakpointsHint(true), 4000));
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		this.element.classList.add('debug-pane');
		container.classList.add('debug-breakpoints');

		this.tree = this.instantiationService.createInstance(
			WorkbenchCompressibleObjectTree<BreakpointTreeElement, void>,
			'BreakpointsView',
			container,
			new BreakpointsDelegate(this),
			[
				this.instantiationService.createInstance(BreakpointsFolderRenderer),
				this.instantiationService.createInstance(BreakpointsRenderer, this.menu, this.breakpointHasMultipleModes, this.breakpointSupportsCondition, this.breakpointItemType),
				new ExceptionBreakpointsRenderer(this.menu, this.breakpointHasMultipleModes, this.breakpointSupportsCondition, this.breakpointItemType, this.debugService, this.hoverService),
				new ExceptionBreakpointInputRenderer(this, this.debugService, this.contextViewService),
				this.instantiationService.createInstance(FunctionBreakpointsRenderer, this.menu, this.breakpointSupportsCondition, this.breakpointItemType),
				new FunctionBreakpointInputRenderer(this, this.debugService, this.contextViewService, this.hoverService, this.labelService),
				this.instantiationService.createInstance(DataBreakpointsRenderer, this.menu, this.breakpointHasMultipleModes, this.breakpointSupportsCondition, this.breakpointItemType, this.breakpointIsDataBytes),
				new DataBreakpointInputRenderer(this, this.debugService, this.contextViewService, this.hoverService, this.labelService),
				this.instantiationService.createInstance(InstructionBreakpointsRenderer),
			],
			{
				compressionEnabled: this.getPresentation() === 'tree',
				hideTwistiesOfChildlessElements: true,
				identityProvider: {
					getId: (element: BreakpointTreeElement) => element.getId()
				},
				keyboardNavigationLabelProvider: {
					getKeyboardNavigationLabel: (element: BreakpointTreeElement) => {
						if (element instanceof BreakpointsFolderItem) {
							return resources.basenameOrAuthority(element.uri);
						}
						if (element instanceof Breakpoint) {
							return `${resources.basenameOrAuthority(element.uri)}:${element.lineNumber}`;
						}
						if (element instanceof FunctionBreakpoint) {
							return element.name;
						}
						if (element instanceof DataBreakpoint) {
							return element.description;
						}
						if (element instanceof ExceptionBreakpoint) {
							return element.label || element.filter;
						}
						if (element instanceof InstructionBreakpoint) {
							return `0x${element.address.toString(16)}`;
						}
						return '';
					},
					getCompressedNodeKeyboardNavigationLabel: (elements: BreakpointTreeElement[]) => {
						return elements.map(e => {
							if (e instanceof BreakpointsFolderItem) {
								return resources.basenameOrAuthority(e.uri);
							}
							return '';
						}).join('/');
					}
				},
				accessibilityProvider: new BreakpointsAccessibilityProvider(this.debugService, this.labelService),
				multipleSelectionSupport: false,
				overrideStyles: this.getLocationBasedColors().listOverrideStyles
			}
		);
		this._register(this.tree);

		CONTEXT_BREAKPOINTS_FOCUSED.bindTo(this.tree.contextKeyService);

		this._register(this.tree.onContextMenu(this.onTreeContextMenu, this));

		this._register(this.tree.onMouseMiddleClick(async ({ element }) => {
			if (element instanceof Breakpoint) {
				await this.debugService.removeBreakpoints(element.getId());
			} else if (element instanceof FunctionBreakpoint) {
				await this.debugService.removeFunctionBreakpoints(element.getId());
			} else if (element instanceof DataBreakpoint) {
				await this.debugService.removeDataBreakpoints(element.getId());
			} else if (element instanceof InstructionBreakpoint) {
				await this.debugService.removeInstructionBreakpoints(element.instructionReference, element.offset);
			} else if (element instanceof BreakpointsFolderItem) {
				await this.debugService.removeBreakpoints(element.breakpoints.map(bp => bp.getId()));
			}
		}));

		this._register(this.tree.onDidOpen(async e => {
			const element = e.element;
			if (!element) {
				return;
			}

			if (dom.isMouseEvent(e.browserEvent) && e.browserEvent.button === 1) { // middle click
				return;
			}

			if (element instanceof Breakpoint) {
				openBreakpointSource(element, e.sideBySide, e.editorOptions.preserveFocus || false, e.editorOptions.pinned || !e.editorOptions.preserveFocus, this.debugService, this.editorService);
			}
			if (element instanceof InstructionBreakpoint) {
				const disassemblyView = await this.editorService.openEditor(DisassemblyViewInput.instance);
				// Focus on double click
				(disassemblyView as DisassemblyView).goToInstructionAndOffset(element.instructionReference, element.offset, dom.isMouseEvent(e.browserEvent) && e.browserEvent.detail === 2);
			}
			if (dom.isMouseEvent(e.browserEvent) && e.browserEvent.detail === 2 && element instanceof FunctionBreakpoint && element !== this.inputBoxData?.breakpoint) {
				// double click
				this.renderInputBox({ breakpoint: element, type: 'name' });
			}
		}));

		// Track collapsed state and update size (items are collapsed by default)
		this._register(this.tree.onDidChangeCollapseState(e => {
			const element = e.node.element;
			if (element instanceof BreakpointsFolderItem) {
				if (e.node.collapsed) {
					this.collapsedState.add(element.getId());
				} else {
					this.collapsedState.delete(element.getId());
				}
				this.updateSize();
			}
		}));

		// React to configuration changes
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('debug.breakpointsView.presentation')) {
				const presentation = this.getPresentation();
				this.tree.updateOptions({ compressionEnabled: presentation === 'tree' });
				this.onBreakpointsChange();
			}
		}));

		this.setTreeInput();

		this._register(this.onDidChangeBodyVisibility(visible => {
			if (visible) {
				if (this.needsRefresh) {
					this.onBreakpointsChange();
				}

				if (this.needsStateChange) {
					this.onStateChange();
				}
			}
		}));

		const containerModel = this.viewDescriptorService.getViewContainerModel(this.viewDescriptorService.getViewContainerByViewId(this.id)!);
		this._register(containerModel.onDidChangeAllViewDescriptors(() => {
			this.updateSize();
		}));
	}

	protected override renderHeaderTitle(container: HTMLElement, title: string): void {
		super.renderHeaderTitle(container, title);

		const iconLabelContainer = dom.append(container, $('span.breakpoint-warning'));
		this.hintContainer = this._register(new IconLabel(iconLabelContainer, {
			supportIcons: true, hoverDelegate: {
				showHover: (options, focus?) => this.hoverService.showInstantHover({ content: options.content, target: this.hintContainer!.element }, focus),
				delay: this.configurationService.getValue<number>('workbench.hover.delay')
			}
		}));
		dom.hide(this.hintContainer.element);
	}

	override focus(): void {
		super.focus();
		this.tree?.domFocus();
	}

	renderInputBox(data: InputBoxData | undefined): void {
		this._inputBoxData = data;
		this.onBreakpointsChange();
		this._inputBoxData = undefined;
	}

	get inputBoxData(): InputBoxData | undefined {
		return this._inputBoxData;
	}

	protected override layoutBody(height: number, width: number): void {
		if (this.ignoreLayout) {
			return;
		}

		super.layoutBody(height, width);
		this.tree?.layout(height, width);
		try {
			this.ignoreLayout = true;
			this.updateSize();
		} finally {
			this.ignoreLayout = false;
		}
	}

	private onTreeContextMenu(e: ITreeContextMenuEvent<BreakpointTreeElement | null>): void {
		const element = e.element;
		if (element instanceof BreakpointsFolderItem) {
			// For folder items, show file-level context menu
			this.breakpointItemType.set('breakpointFolder');
			const { secondary } = getContextMenuActions(this.menu.getActions({ arg: element, shouldForwardArgs: false }), 'inline');
			this.contextMenuService.showContextMenu({
				getAnchor: () => e.anchor,
				getActions: () => secondary,
				getActionsContext: () => element
			});
			return;
		}

		const type = element instanceof Breakpoint ? 'breakpoint' : element instanceof ExceptionBreakpoint ? 'exceptionBreakpoint' :
			element instanceof FunctionBreakpoint ? 'functionBreakpoint' : element instanceof DataBreakpoint ? 'dataBreakpoint' :
				element instanceof InstructionBreakpoint ? 'instructionBreakpoint' : undefined;
		this.breakpointItemType.set(type);
		const session = this.debugService.getViewModel().focusedSession;
		const conditionSupported = element instanceof ExceptionBreakpoint ? element.supportsCondition : (!session || !!session.capabilities.supportsConditionalBreakpoints);
		this.breakpointSupportsCondition.set(conditionSupported);
		this.breakpointIsDataBytes.set(element instanceof DataBreakpoint && element.src.type === DataBreakpointSetType.Address);
		this.breakpointHasMultipleModes.set(this.debugService.getModel().getBreakpointModes(getModeKindForBreakpoint(element as IBreakpoint)).length > 1);

		const { secondary } = getContextMenuActions(this.menu.getActions({ arg: e.element, shouldForwardArgs: false }), 'inline');

		this.contextMenuService.showContextMenu({
			getAnchor: () => e.anchor,
			getActions: () => secondary,
			getActionsContext: () => element
		});
	}

	private updateSize(): void {
		const containerModel = this.viewDescriptorService.getViewContainerModel(this.viewDescriptorService.getViewContainerByViewId(this.id)!);

		// Calculate visible row count from tree's content height
		// Each row is 22px high
		const rowHeight = 22;

		this.minimumBodySize = this.orientation === Orientation.VERTICAL ? Math.min(MAX_VISIBLE_BREAKPOINTS * rowHeight, this.tree.contentHeight) : 170;
		this.maximumBodySize = this.orientation === Orientation.VERTICAL && containerModel.visibleViewDescriptors.length > 1 ? this.tree.contentHeight : Number.POSITIVE_INFINITY;
	}

	private updateBreakpointsHint(delayed = false): void {
		if (!this.hintContainer) {
			return;
		}

		const currentType = this.debugService.getViewModel().focusedSession?.configuration.type;
		const dbg = currentType ? this.debugService.getAdapterManager().getDebugger(currentType) : undefined;
		const message = dbg?.strings?.[DebuggerString.UnverifiedBreakpoints];
		const debuggerHasUnverifiedBps = message && this.debugService.getModel().getBreakpoints().filter(bp => {
			if (bp.verified || !bp.enabled) {
				return false;
			}

			const langId = this.languageService.guessLanguageIdByFilepathOrFirstLine(bp.uri);
			return langId && dbg.interestedInLanguage(langId);
		});

		if (message && debuggerHasUnverifiedBps?.length && this.debugService.getModel().areBreakpointsActivated()) {
			if (delayed) {
				const mdown = new MarkdownString(undefined, { isTrusted: true }).appendMarkdown(message);
				this.hintContainer.setLabel('$(warning)', undefined, { title: { markdown: mdown, markdownNotSupportedFallback: message } });
				dom.show(this.hintContainer.element);
			} else {
				this.hintDelayer.schedule();
			}
		} else {
			dom.hide(this.hintContainer.element);
		}
	}

	private onBreakpointsChange(): void {
		if (this.isBodyVisible()) {
			if (this.tree) {
				this.setTreeInput();
				this.needsRefresh = false;
			}
			this.updateBreakpointsHint();
			this.updateSize();
		} else {
			this.needsRefresh = true;
		}
	}

	private onStateChange(): void {
		if (this.isBodyVisible()) {
			this.needsStateChange = false;
			const thread = this.debugService.getViewModel().focusedThread;
			let found = false;
			if (thread && thread.stoppedDetails && thread.stoppedDetails.hitBreakpointIds && thread.stoppedDetails.hitBreakpointIds.length > 0) {
				const hitBreakpointIds = thread.stoppedDetails.hitBreakpointIds;
				const elements = this.flatElements;
				const hitElement = elements.find(e => {
					const id = e.getIdFromAdapter(thread.session.getId());
					return typeof id === 'number' && hitBreakpointIds.indexOf(id) !== -1;
				});
				if (hitElement) {
					this.tree.setFocus([hitElement]);
					this.tree.setSelection([hitElement]);
					found = true;
					this.autoFocusedElement = hitElement;
				}
			}
			if (!found) {
				// Deselect breakpoint in breakpoint view when no longer stopped on it #125528
				const focus = this.tree.getFocus();
				const selection = this.tree.getSelection();
				if (this.autoFocusedElement && equals(focus, selection) && selection.includes(this.autoFocusedElement)) {
					this.tree.setFocus([]);
					this.tree.setSelection([]);
				}
				this.autoFocusedElement = undefined;
			}
			this.updateBreakpointsHint();
		} else {
			this.needsStateChange = true;
		}
	}

	private setTreeInput(): void {
		const treeInput = this.getTreeElements();
		this.tree.setChildren(null, treeInput);
	}

	private getTreeElements(): ICompressedTreeElement<BreakpointTreeElement>[] {
		const model = this.debugService.getModel();
		const sessionId = this.debugService.getViewModel().focusedSession?.getId();
		const showAsTree = this.getPresentation() === 'tree';

		const result: ICompressedTreeElement<BreakpointTreeElement>[] = [];

		// Exception breakpoints at the top (root level)
		for (const exBp of model.getExceptionBreakpointsForSession(sessionId)) {
			result.push({ element: exBp, incompressible: true });
		}

		// Function breakpoints (root level)
		for (const funcBp of model.getFunctionBreakpoints()) {
			result.push({ element: funcBp, incompressible: true });
		}

		// Data breakpoints (root level)
		for (const dataBp of model.getDataBreakpoints()) {
			result.push({ element: dataBp, incompressible: true });
		}

		// Source breakpoints - group by file if showAsTree is enabled
		const sourceBreakpoints = model.getBreakpoints();
		if (showAsTree && sourceBreakpoints.length > 0) {
			// Group breakpoints by URI
			const breakpointsByUri = new Map<string, IBreakpoint[]>();
			for (const bp of sourceBreakpoints) {
				const key = bp.uri.toString();
				if (!breakpointsByUri.has(key)) {
					breakpointsByUri.set(key, []);
				}
				breakpointsByUri.get(key)!.push(bp);
			}

			// Create folder items for each file
			for (const [uriStr, breakpoints] of breakpointsByUri) {
				const uri = URI.parse(uriStr);
				const folderItem = new BreakpointsFolderItem(uri, breakpoints);

				// Sort breakpoints by line number
				breakpoints.sort((a, b) => a.lineNumber - b.lineNumber);

				const children: ICompressedTreeElement<BreakpointTreeElement>[] = breakpoints.map(bp => ({
					element: bp,
					incompressible: false
				}));

				result.push({
					element: folderItem,
					incompressible: false,
					collapsed: this.collapsedState.has(folderItem.getId()) || !this.collapsedState.has(`_init_${folderItem.getId()}`),
					children
				});

				// Mark as initialized (will be collapsed by default on first render)
				if (!this.collapsedState.has(`_init_${folderItem.getId()}`)) {
					this.collapsedState.add(`_init_${folderItem.getId()}`);
					this.collapsedState.add(folderItem.getId());
				}
			}
		} else {
			// Flat mode - just add all source breakpoints
			for (const bp of sourceBreakpoints) {
				result.push({ element: bp, incompressible: true });
			}
		}

		// Instruction breakpoints (root level)
		for (const instrBp of model.getInstructionBreakpoints()) {
			result.push({ element: instrBp, incompressible: true });
		}

		return result;
	}

	private get flatElements(): BreakpointItem[] {
		const model = this.debugService.getModel();
		const sessionId = this.debugService.getViewModel().focusedSession?.getId();
		const elements = (<ReadonlyArray<IEnablement>>model.getExceptionBreakpointsForSession(sessionId)).concat(model.getFunctionBreakpoints()).concat(model.getDataBreakpoints()).concat(model.getBreakpoints()).concat(model.getInstructionBreakpoints());

		return elements as BreakpointItem[];
	}
}

class BreakpointsDelegate implements IListVirtualDelegate<BreakpointTreeElement> {

	constructor(private view: BreakpointsView) {
		// noop
	}

	getHeight(_element: BreakpointTreeElement): number {
		return 22;
	}

	getTemplateId(element: BreakpointTreeElement): string {
		if (element instanceof BreakpointsFolderItem) {
			return BreakpointsFolderRenderer.ID;
		}
		if (element instanceof Breakpoint) {
			return BreakpointsRenderer.ID;
		}
		if (element instanceof FunctionBreakpoint) {
			const inputBoxBreakpoint = this.view.inputBoxData?.breakpoint;
			if (!element.name || (inputBoxBreakpoint && inputBoxBreakpoint.getId() === element.getId())) {
				return FunctionBreakpointInputRenderer.ID;
			}

			return FunctionBreakpointsRenderer.ID;
		}
		if (element instanceof ExceptionBreakpoint) {
			const inputBoxBreakpoint = this.view.inputBoxData?.breakpoint;
			if (inputBoxBreakpoint && inputBoxBreakpoint.getId() === element.getId()) {
				return ExceptionBreakpointInputRenderer.ID;
			}
			return ExceptionBreakpointsRenderer.ID;
		}
		if (element instanceof DataBreakpoint) {
			const inputBoxBreakpoint = this.view.inputBoxData?.breakpoint;
			if (inputBoxBreakpoint && inputBoxBreakpoint.getId() === element.getId()) {
				return DataBreakpointInputRenderer.ID;
			}

			return DataBreakpointsRenderer.ID;
		}
		if (element instanceof InstructionBreakpoint) {
			return InstructionBreakpointsRenderer.ID;
		}

		return '';
	}
}

interface IBaseBreakpointTemplateData {
	breakpoint: HTMLElement;
	name: HTMLElement;
	checkbox: HTMLInputElement;
	context: BreakpointItem;
	actionBar: ActionBar;
	templateDisposables: DisposableStore;
	elementDisposables: DisposableStore;
	badge: HTMLElement;
}

interface IBaseBreakpointWithIconTemplateData extends IBaseBreakpointTemplateData {
	icon: HTMLElement;
}

interface IBreakpointTemplateData extends IBaseBreakpointWithIconTemplateData {
	filePath: HTMLElement;
}

interface IExceptionBreakpointTemplateData extends IBaseBreakpointTemplateData {
	condition: HTMLElement;
}

interface IFunctionBreakpointTemplateData extends IBaseBreakpointWithIconTemplateData {
	condition: HTMLElement;
}

interface IDataBreakpointTemplateData extends IBaseBreakpointWithIconTemplateData {
	accessType: HTMLElement;
	condition: HTMLElement;
}

interface IInstructionBreakpointTemplateData extends IBaseBreakpointWithIconTemplateData {
	address: HTMLElement;
}

interface IFunctionBreakpointInputTemplateData {
	inputBox: InputBox;
	checkbox: HTMLInputElement;
	icon: HTMLElement;
	breakpoint: IFunctionBreakpoint;
	templateDisposables: DisposableStore;
	elementDisposables: DisposableStore;
	type: 'hitCount' | 'condition' | 'name';
	updating?: boolean;
}

interface IDataBreakpointInputTemplateData {
	inputBox: InputBox;
	checkbox: HTMLInputElement;
	icon: HTMLElement;
	breakpoint: IDataBreakpoint;
	elementDisposables: DisposableStore;
	templateDisposables: DisposableStore;
	type: 'hitCount' | 'condition' | 'name';
	updating?: boolean;
}

interface IExceptionBreakpointInputTemplateData {
	inputBox: InputBox;
	checkbox: HTMLInputElement;
	currentBreakpoint?: IExceptionBreakpoint;
	templateDisposables: DisposableStore;
	elementDisposables: DisposableStore;
}

interface IBreakpointsFolderTemplateData {
	container: HTMLElement;
	checkbox: HTMLInputElement;
	name: HTMLElement;
	actionBar: ActionBar;
	context: BreakpointsFolderItem;
	templateDisposables: DisposableStore;
	elementDisposables: DisposableStore;
}

const breakpointIdToActionBarDomeNode = new Map<string, HTMLElement>();

class BreakpointsFolderRenderer implements ICompressibleTreeRenderer<BreakpointsFolderItem, void, IBreakpointsFolderTemplateData> {

	static readonly ID = 'breakpointFolder';

	constructor(
		@IDebugService private readonly debugService: IDebugService,
		@ILabelService private readonly labelService: ILabelService,
		@IHoverService private readonly hoverService: IHoverService,
	) { }

	get templateId() {
		return BreakpointsFolderRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IBreakpointsFolderTemplateData {
		const data: IBreakpointsFolderTemplateData = Object.create(null);
		data.elementDisposables = new DisposableStore();
		data.templateDisposables = new DisposableStore();
		data.templateDisposables.add(data.elementDisposables);

		data.container = container;
		container.classList.add('breakpoint', 'breakpoint-folder');

		data.templateDisposables.add(toDisposable(() => {
			container.classList.remove('breakpoint', 'breakpoint-folder');
		}));

		data.checkbox = createCheckbox(data.templateDisposables);
		data.templateDisposables.add(dom.addStandardDisposableListener(data.checkbox, 'change', (e) => {
			const enabled = data.checkbox.checked;
			for (const bp of data.context.breakpoints) {
				this.debugService.enableOrDisableBreakpoints(enabled, bp);
			}
		}));

		dom.append(data.container, data.checkbox);
		data.name = dom.append(data.container, $('span.name'));
		dom.append(data.container, $('span.file-path'));

		data.actionBar = new ActionBar(data.container);
		data.templateDisposables.add(data.actionBar);

		return data;
	}

	renderElement(node: ITreeNode<BreakpointsFolderItem, void>, _index: number, data: IBreakpointsFolderTemplateData): void {
		const folderItem = node.element;
		data.context = folderItem;

		data.name.textContent = this.labelService.getUriBasenameLabel(folderItem.uri);
		data.container.classList.toggle('disabled', !this.debugService.getModel().areBreakpointsActivated());

		const fullPath = this.labelService.getUriLabel(folderItem.uri, { relative: true });
		data.elementDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.container, fullPath));

		// Set checkbox state
		if (folderItem.indeterminate) {
			data.checkbox.checked = false;
			data.checkbox.indeterminate = true;
		} else {
			data.checkbox.indeterminate = false;
			data.checkbox.checked = folderItem.enabled;
		}

		// Add remove action
		data.actionBar.clear();
		const removeAction = data.elementDisposables.add(new Action(
			'debug.removeBreakpointsInFile',
			localize('removeBreakpointsInFile', "Remove Breakpoints in File"),
			ThemeIcon.asClassName(Codicon.close),
			true,
			async () => {
				for (const bp of folderItem.breakpoints) {
					await this.debugService.removeBreakpoints(bp.getId());
				}
			}
		));
		data.actionBar.push(removeAction, { icon: true, label: false });
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<BreakpointsFolderItem>, void>, _index: number, data: IBreakpointsFolderTemplateData): void {
		const elements = node.element.elements;
		const folderItem = elements[elements.length - 1];
		data.context = folderItem;

		// For compressed nodes, show the combined path
		const names = elements.map(e => resources.basenameOrAuthority(e.uri));
		data.name.textContent = names.join('/');

		const fullPath = this.labelService.getUriLabel(folderItem.uri, { relative: true });
		data.elementDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.container, fullPath));

		// Set checkbox state
		if (folderItem.indeterminate) {
			data.checkbox.checked = false;
			data.checkbox.indeterminate = true;
		} else {
			data.checkbox.indeterminate = false;
			data.checkbox.checked = folderItem.enabled;
		}

		// Add remove action
		data.actionBar.clear();
		const removeAction = data.elementDisposables.add(new Action(
			'debug.removeBreakpointsInFile',
			localize('removeBreakpointsInFile', "Remove Breakpoints in File"),
			ThemeIcon.asClassName(Codicon.close),
			true,
			async () => {
				for (const bp of folderItem.breakpoints) {
					await this.debugService.removeBreakpoints(bp.getId());
				}
			}
		));
		data.actionBar.push(removeAction, { icon: true, label: false });
	}

	disposeElement(element: ITreeNode<BreakpointsFolderItem, void>, index: number, templateData: IBreakpointsFolderTemplateData): void {
		templateData.elementDisposables.clear();
	}

	disposeCompressedElements(node: ITreeNode<ICompressedTreeNode<BreakpointsFolderItem>, void>, index: number, templateData: IBreakpointsFolderTemplateData): void {
		templateData.elementDisposables.clear();
	}

	disposeTemplate(templateData: IBreakpointsFolderTemplateData): void {
		templateData.templateDisposables.dispose();
	}
}

class BreakpointsRenderer implements ICompressibleTreeRenderer<IBreakpoint, void, IBreakpointTemplateData> {

	constructor(
		private menu: IMenu,
		private breakpointHasMultipleModes: IContextKey<boolean>,
		private breakpointSupportsCondition: IContextKey<boolean>,
		private breakpointItemType: IContextKey<string | undefined>,
		@IDebugService private readonly debugService: IDebugService,
		@IHoverService private readonly hoverService: IHoverService,
		@ILabelService private readonly labelService: ILabelService,
		@ITextModelService private readonly textModelService: ITextModelService
	) {
		// noop
	}

	static readonly ID = 'breakpoints';

	get templateId() {
		return BreakpointsRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IBreakpointTemplateData {
		const data: IBreakpointTemplateData = Object.create(null);
		data.elementDisposables = new DisposableStore();
		data.templateDisposables = new DisposableStore();
		data.templateDisposables.add(data.elementDisposables);

		data.breakpoint = container;
		container.classList.add('breakpoint');

		data.templateDisposables.add(toDisposable(() => {
			container.classList.remove('breakpoint');
		}));

		data.icon = $('.icon');
		data.checkbox = createCheckbox(data.templateDisposables);

		data.templateDisposables.add(dom.addStandardDisposableListener(data.checkbox, 'change', (e) => {
			this.debugService.enableOrDisableBreakpoints(!data.context.enabled, data.context);
		}));

		dom.append(data.breakpoint, data.icon);
		dom.append(data.breakpoint, data.checkbox);

		data.name = dom.append(data.breakpoint, $('span.name'));

		data.filePath = dom.append(data.breakpoint, $('span.file-path'));
		data.actionBar = new ActionBar(data.breakpoint);
		data.templateDisposables.add(data.actionBar);
		const badgeContainer = dom.append(data.breakpoint, $('.badge-container'));
		data.badge = dom.append(badgeContainer, $('span.line-number.monaco-count-badge'));

		return data;
	}

	renderElement(node: ITreeNode<IBreakpoint, void>, index: number, data: IBreakpointTemplateData): void {
		const breakpoint = node.element;
		data.context = breakpoint;

		if (node.depth > 1) {
			this.renderBreakpointLineLabel(breakpoint, data);
		} else {
			this.renderBreakpointFileLabel(breakpoint, data);
		}

		this.renderBreakpointCommon(breakpoint, data);
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<IBreakpoint>, void>, index: number, data: IBreakpointTemplateData): void {
		const breakpoint = node.element.elements[node.element.elements.length - 1];
		data.context = breakpoint;
		this.renderBreakpointFileLabel(breakpoint, data);
		this.renderBreakpointCommon(breakpoint, data);
	}

	private renderBreakpointCommon(breakpoint: IBreakpoint, data: IBreakpointTemplateData): void {
		data.breakpoint.classList.toggle('disabled', !this.debugService.getModel().areBreakpointsActivated());
		let badgeContent = breakpoint.lineNumber.toString();
		if (breakpoint.column) {
			badgeContent += `:${breakpoint.column}`;
		}
		if (breakpoint.modeLabel) {
			badgeContent = `${breakpoint.modeLabel}: ${badgeContent}`;
		}
		data.badge.textContent = badgeContent;
		data.checkbox.checked = breakpoint.enabled;

		const { message, icon } = getBreakpointMessageAndIcon(this.debugService.state, this.debugService.getModel().areBreakpointsActivated(), breakpoint, this.labelService, this.debugService.getModel());
		data.icon.className = ThemeIcon.asClassName(icon);
		data.elementDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.breakpoint, breakpoint.message || message || ''));

		const debugActive = this.debugService.state === State.Running || this.debugService.state === State.Stopped;
		if (debugActive && !breakpoint.verified) {
			data.breakpoint.classList.add('disabled');
		}

		const session = this.debugService.getViewModel().focusedSession;
		this.breakpointSupportsCondition.set(!session || !!session.capabilities.supportsConditionalBreakpoints);
		this.breakpointItemType.set('breakpoint');
		this.breakpointHasMultipleModes.set(this.debugService.getModel().getBreakpointModes('source').length > 1);
		const { primary } = getActionBarActions(this.menu.getActions({ arg: breakpoint, shouldForwardArgs: true }), 'inline');
		data.actionBar.clear();
		data.actionBar.push(primary, { icon: true, label: false });
		breakpointIdToActionBarDomeNode.set(breakpoint.getId(), data.actionBar.domNode);
	}

	private renderBreakpointFileLabel(breakpoint: IBreakpoint, data: IBreakpointTemplateData): void {
		data.name.textContent = resources.basenameOrAuthority(breakpoint.uri);
		data.filePath.textContent = this.labelService.getUriLabel(resources.dirname(breakpoint.uri), { relative: true });
	}

	private renderBreakpointLineLabel(breakpoint: IBreakpoint, data: IBreakpointTemplateData): void {
		data.name.textContent = localize('loading', "Loading...");
		data.filePath.textContent = '';

		this.textModelService.createModelReference(breakpoint.uri).then(reference => {
			if (data.context !== breakpoint) {
				reference.dispose();
				return;
			}
			data.elementDisposables.add(reference);
			const model = reference.object.textEditorModel;
			if (model && breakpoint.lineNumber <= model.getLineCount()) {
				const lineContent = model.getLineContent(breakpoint.lineNumber).trim();
				data.name.textContent = lineContent || localize('emptyLine', "(empty line)");
			} else {
				data.name.textContent = localize('lineNotFound', "(line not found)");
			}
		}).catch(() => {
			if (data.context === breakpoint) {
				data.name.textContent = localize('cannotLoadLine', "(cannot load line)");
			}
		});
	}

	disposeElement(node: ITreeNode<IBreakpoint, void>, index: number, template: IBreakpointTemplateData): void {
		template.elementDisposables.clear();
	}

	disposeCompressedElements(node: ITreeNode<ICompressedTreeNode<IBreakpoint>, void>, index: number, template: IBreakpointTemplateData): void {
		template.elementDisposables.clear();
	}

	disposeTemplate(templateData: IBreakpointTemplateData): void {
		templateData.templateDisposables.dispose();
	}
}

class ExceptionBreakpointsRenderer implements ICompressibleTreeRenderer<IExceptionBreakpoint, void, IExceptionBreakpointTemplateData> {

	constructor(
		private menu: IMenu,
		private breakpointHasMultipleModes: IContextKey<boolean>,
		private breakpointSupportsCondition: IContextKey<boolean>,
		private breakpointItemType: IContextKey<string | undefined>,
		private debugService: IDebugService,
		private readonly hoverService: IHoverService,
	) {
		// noop
	}

	static readonly ID = 'exceptionbreakpoints';

	get templateId() {
		return ExceptionBreakpointsRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IExceptionBreakpointTemplateData {
		const data: IExceptionBreakpointTemplateData = Object.create(null);
		data.elementDisposables = new DisposableStore();
		data.templateDisposables = new DisposableStore();
		data.templateDisposables.add(data.elementDisposables);
		data.breakpoint = dom.append(container, $('.breakpoint'));

		data.checkbox = createCheckbox(data.templateDisposables);
		data.templateDisposables.add(dom.addStandardDisposableListener(data.checkbox, 'change', (e) => {
			this.debugService.enableOrDisableBreakpoints(!data.context.enabled, data.context);
		}));

		dom.append(data.breakpoint, data.checkbox);

		data.name = dom.append(data.breakpoint, $('span.name'));
		data.condition = dom.append(data.breakpoint, $('span.condition'));
		data.breakpoint.classList.add('exception');

		data.actionBar = new ActionBar(data.breakpoint);
		data.templateDisposables.add(data.actionBar);
		const badgeContainer = dom.append(data.breakpoint, $('.badge-container'));
		data.badge = dom.append(badgeContainer, $('span.line-number.monaco-count-badge'));

		return data;
	}

	renderElement(node: ITreeNode<IExceptionBreakpoint, void>, index: number, data: IExceptionBreakpointTemplateData): void {
		const exceptionBreakpoint = node.element;
		this.renderExceptionBreakpoint(exceptionBreakpoint, data);
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<IExceptionBreakpoint>, void>, index: number, data: IExceptionBreakpointTemplateData): void {
		const exceptionBreakpoint = node.element.elements[node.element.elements.length - 1];
		this.renderExceptionBreakpoint(exceptionBreakpoint, data);
	}

	private renderExceptionBreakpoint(exceptionBreakpoint: IExceptionBreakpoint, data: IExceptionBreakpointTemplateData): void {
		data.context = exceptionBreakpoint;
		data.name.textContent = exceptionBreakpoint.label || `${exceptionBreakpoint.filter} exceptions`;
		const exceptionBreakpointtitle = exceptionBreakpoint.verified ? (exceptionBreakpoint.description || data.name.textContent) : exceptionBreakpoint.message || localize('unverifiedExceptionBreakpoint', "Unverified Exception Breakpoint");
		data.elementDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.breakpoint, exceptionBreakpointtitle));
		data.breakpoint.classList.toggle('disabled', !exceptionBreakpoint.verified);
		data.checkbox.checked = exceptionBreakpoint.enabled;
		data.condition.textContent = exceptionBreakpoint.condition || '';
		data.elementDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.condition, localize('expressionCondition', "Expression condition: {0}", exceptionBreakpoint.condition)));

		if (exceptionBreakpoint.modeLabel) {
			data.badge.textContent = exceptionBreakpoint.modeLabel;
			data.badge.style.display = 'block';
		} else {
			data.badge.style.display = 'none';
		}

		this.breakpointSupportsCondition.set((exceptionBreakpoint as ExceptionBreakpoint).supportsCondition);
		this.breakpointItemType.set('exceptionBreakpoint');
		this.breakpointHasMultipleModes.set(this.debugService.getModel().getBreakpointModes('exception').length > 1);
		const { primary } = getActionBarActions(this.menu.getActions({ arg: exceptionBreakpoint, shouldForwardArgs: true }), 'inline');
		data.actionBar.clear();
		data.actionBar.push(primary, { icon: true, label: false });
		breakpointIdToActionBarDomeNode.set(exceptionBreakpoint.getId(), data.actionBar.domNode);
	}

	disposeElement(node: ITreeNode<IExceptionBreakpoint, void>, index: number, templateData: IExceptionBreakpointTemplateData): void {
		templateData.elementDisposables.clear();
	}

	disposeCompressedElements(node: ITreeNode<ICompressedTreeNode<IExceptionBreakpoint>, void>, index: number, templateData: IExceptionBreakpointTemplateData): void {
		templateData.elementDisposables.clear();
	}

	disposeTemplate(templateData: IExceptionBreakpointTemplateData): void {
		templateData.templateDisposables.dispose();
	}
}

class FunctionBreakpointsRenderer implements ICompressibleTreeRenderer<FunctionBreakpoint, void, IFunctionBreakpointTemplateData> {

	constructor(
		private menu: IMenu,
		private breakpointSupportsCondition: IContextKey<boolean>,
		private breakpointItemType: IContextKey<string | undefined>,
		@IDebugService private readonly debugService: IDebugService,
		@IHoverService private readonly hoverService: IHoverService,
		@ILabelService private readonly labelService: ILabelService
	) {
		// noop
	}

	static readonly ID = 'functionbreakpoints';

	get templateId() {
		return FunctionBreakpointsRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IFunctionBreakpointTemplateData {
		const data: IFunctionBreakpointTemplateData = Object.create(null);
		data.elementDisposables = new DisposableStore();
		data.templateDisposables = new DisposableStore();
		data.templateDisposables.add(data.elementDisposables);
		data.breakpoint = dom.append(container, $('.breakpoint'));

		data.icon = $('.icon');
		data.checkbox = createCheckbox(data.templateDisposables);
		data.templateDisposables.add(dom.addStandardDisposableListener(data.checkbox, 'change', (e) => {
			this.debugService.enableOrDisableBreakpoints(!data.context.enabled, data.context);
		}));

		dom.append(data.breakpoint, data.icon);
		dom.append(data.breakpoint, data.checkbox);

		data.name = dom.append(data.breakpoint, $('span.name'));
		data.condition = dom.append(data.breakpoint, $('span.condition'));

		data.actionBar = new ActionBar(data.breakpoint);
		data.templateDisposables.add(data.actionBar);
		const badgeContainer = dom.append(data.breakpoint, $('.badge-container'));
		data.badge = dom.append(badgeContainer, $('span.line-number.monaco-count-badge'));

		return data;
	}

	renderElement(node: ITreeNode<FunctionBreakpoint, void>, _index: number, data: IFunctionBreakpointTemplateData): void {
		this.renderFunctionBreakpoint(node.element, data);
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<FunctionBreakpoint>, void>, _index: number, data: IFunctionBreakpointTemplateData): void {
		this.renderFunctionBreakpoint(node.element.elements[node.element.elements.length - 1], data);
	}

	private renderFunctionBreakpoint(functionBreakpoint: FunctionBreakpoint, data: IFunctionBreakpointTemplateData): void {
		data.context = functionBreakpoint;
		data.name.textContent = functionBreakpoint.name;
		const { icon, message } = getBreakpointMessageAndIcon(this.debugService.state, this.debugService.getModel().areBreakpointsActivated(), functionBreakpoint, this.labelService, this.debugService.getModel());
		data.icon.className = ThemeIcon.asClassName(icon);
		data.elementDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.icon, message ? message : ''));
		data.checkbox.checked = functionBreakpoint.enabled;
		data.elementDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.breakpoint, message ? message : ''));
		if (functionBreakpoint.condition && functionBreakpoint.hitCondition) {
			data.condition.textContent = localize('expressionAndHitCount', "Condition: {0} | Hit Count: {1}", functionBreakpoint.condition, functionBreakpoint.hitCondition);
		} else {
			data.condition.textContent = functionBreakpoint.condition || functionBreakpoint.hitCondition || '';
		}

		if (functionBreakpoint.modeLabel) {
			data.badge.textContent = functionBreakpoint.modeLabel;
			data.badge.style.display = 'block';
		} else {
			data.badge.style.display = 'none';
		}

		// Mark function breakpoints as disabled if deactivated or if debug type does not support them #9099
		const session = this.debugService.getViewModel().focusedSession;
		data.breakpoint.classList.toggle('disabled', (session && !session.capabilities.supportsFunctionBreakpoints) || !this.debugService.getModel().areBreakpointsActivated());
		if (session && !session.capabilities.supportsFunctionBreakpoints) {
			data.elementDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.breakpoint, localize('functionBreakpointsNotSupported', "Function breakpoints are not supported by this debug type")));
		}

		this.breakpointSupportsCondition.set(!session || !!session.capabilities.supportsConditionalBreakpoints);
		this.breakpointItemType.set('functionBreakpoint');
		const { primary } = getActionBarActions(this.menu.getActions({ arg: functionBreakpoint, shouldForwardArgs: true }), 'inline');
		data.actionBar.clear();
		data.actionBar.push(primary, { icon: true, label: false });
		breakpointIdToActionBarDomeNode.set(functionBreakpoint.getId(), data.actionBar.domNode);
	}

	disposeElement(node: ITreeNode<FunctionBreakpoint, void>, index: number, templateData: IFunctionBreakpointTemplateData): void {
		templateData.elementDisposables.clear();
	}

	disposeCompressedElements(node: ITreeNode<ICompressedTreeNode<FunctionBreakpoint>, void>, index: number, templateData: IFunctionBreakpointTemplateData): void {
		templateData.elementDisposables.clear();
	}

	disposeTemplate(templateData: IFunctionBreakpointTemplateData): void {
		templateData.templateDisposables.dispose();
	}
}

class DataBreakpointsRenderer implements ICompressibleTreeRenderer<DataBreakpoint, void, IDataBreakpointTemplateData> {

	constructor(
		private menu: IMenu,
		private breakpointHasMultipleModes: IContextKey<boolean>,
		private breakpointSupportsCondition: IContextKey<boolean>,
		private breakpointItemType: IContextKey<string | undefined>,
		private breakpointIsDataBytes: IContextKey<boolean | undefined>,
		@IDebugService private readonly debugService: IDebugService,
		@IHoverService private readonly hoverService: IHoverService,
		@ILabelService private readonly labelService: ILabelService
	) {
		// noop
	}

	static readonly ID = 'databreakpoints';

	get templateId() {
		return DataBreakpointsRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IDataBreakpointTemplateData {
		const data: IDataBreakpointTemplateData = Object.create(null);
		data.breakpoint = dom.append(container, $('.breakpoint'));
		data.elementDisposables = new DisposableStore();
		data.templateDisposables = new DisposableStore();
		data.templateDisposables.add(data.elementDisposables);

		data.icon = $('.icon');
		data.checkbox = createCheckbox(data.templateDisposables);
		data.templateDisposables.add(dom.addStandardDisposableListener(data.checkbox, 'change', (e) => {
			this.debugService.enableOrDisableBreakpoints(!data.context.enabled, data.context);
		}));

		dom.append(data.breakpoint, data.icon);
		dom.append(data.breakpoint, data.checkbox);

		data.name = dom.append(data.breakpoint, $('span.name'));
		data.accessType = dom.append(data.breakpoint, $('span.access-type'));
		data.condition = dom.append(data.breakpoint, $('span.condition'));

		data.actionBar = new ActionBar(data.breakpoint);
		data.templateDisposables.add(data.actionBar);
		const badgeContainer = dom.append(data.breakpoint, $('.badge-container'));
		data.badge = dom.append(badgeContainer, $('span.line-number.monaco-count-badge'));

		return data;
	}

	renderElement(node: ITreeNode<DataBreakpoint, void>, _index: number, data: IDataBreakpointTemplateData): void {
		this.renderDataBreakpoint(node.element, data);
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<DataBreakpoint>, void>, _index: number, data: IDataBreakpointTemplateData): void {
		this.renderDataBreakpoint(node.element.elements[node.element.elements.length - 1], data);
	}

	private renderDataBreakpoint(dataBreakpoint: DataBreakpoint, data: IDataBreakpointTemplateData): void {
		data.context = dataBreakpoint;
		data.name.textContent = dataBreakpoint.description;
		const { icon, message } = getBreakpointMessageAndIcon(this.debugService.state, this.debugService.getModel().areBreakpointsActivated(), dataBreakpoint, this.labelService, this.debugService.getModel());
		data.icon.className = ThemeIcon.asClassName(icon);
		data.elementDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.icon, message ? message : ''));
		data.checkbox.checked = dataBreakpoint.enabled;
		data.elementDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.breakpoint, message ? message : ''));

		if (dataBreakpoint.modeLabel) {
			data.badge.textContent = dataBreakpoint.modeLabel;
			data.badge.style.display = 'block';
		} else {
			data.badge.style.display = 'none';
		}

		// Mark data breakpoints as disabled if deactivated or if debug type does not support them
		const session = this.debugService.getViewModel().focusedSession;
		data.breakpoint.classList.toggle('disabled', (session && !session.capabilities.supportsDataBreakpoints) || !this.debugService.getModel().areBreakpointsActivated());
		if (session && !session.capabilities.supportsDataBreakpoints) {
			data.elementDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.breakpoint, localize('dataBreakpointsNotSupported', "Data breakpoints are not supported by this debug type")));
		}
		if (dataBreakpoint.accessType) {
			const accessType = dataBreakpoint.accessType === 'read' ? localize('read', "Read") : dataBreakpoint.accessType === 'write' ? localize('write', "Write") : localize('access', "Access");
			data.accessType.textContent = accessType;
		} else {
			data.accessType.textContent = '';
		}
		if (dataBreakpoint.condition && dataBreakpoint.hitCondition) {
			data.condition.textContent = localize('expressionAndHitCount', "Condition: {0} | Hit Count: {1}", dataBreakpoint.condition, dataBreakpoint.hitCondition);
		} else {
			data.condition.textContent = dataBreakpoint.condition || dataBreakpoint.hitCondition || '';
		}

		this.breakpointSupportsCondition.set(!session || !!session.capabilities.supportsConditionalBreakpoints);
		this.breakpointHasMultipleModes.set(this.debugService.getModel().getBreakpointModes('data').length > 1);
		this.breakpointItemType.set('dataBreakpoint');
		this.breakpointIsDataBytes.set(dataBreakpoint.src.type === DataBreakpointSetType.Address);
		const { primary } = getActionBarActions(this.menu.getActions({ arg: dataBreakpoint, shouldForwardArgs: true }), 'inline');
		data.actionBar.clear();
		data.actionBar.push(primary, { icon: true, label: false });
		breakpointIdToActionBarDomeNode.set(dataBreakpoint.getId(), data.actionBar.domNode);
		this.breakpointIsDataBytes.reset();
	}

	disposeElement(node: ITreeNode<DataBreakpoint, void>, index: number, templateData: IDataBreakpointTemplateData): void {
		templateData.elementDisposables.clear();
	}

	disposeCompressedElements(node: ITreeNode<ICompressedTreeNode<DataBreakpoint>, void>, index: number, templateData: IDataBreakpointTemplateData): void {
		templateData.elementDisposables.clear();
	}

	disposeTemplate(templateData: IBaseBreakpointWithIconTemplateData): void {
		templateData.templateDisposables.dispose();
	}
}

class InstructionBreakpointsRenderer implements ICompressibleTreeRenderer<IInstructionBreakpoint, void, IInstructionBreakpointTemplateData> {

	constructor(
		@IDebugService private readonly debugService: IDebugService,
		@IHoverService private readonly hoverService: IHoverService,
		@ILabelService private readonly labelService: ILabelService
	) {
		// noop
	}

	static readonly ID = 'instructionBreakpoints';

	get templateId() {
		return InstructionBreakpointsRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IInstructionBreakpointTemplateData {
		const data: IInstructionBreakpointTemplateData = Object.create(null);
		data.elementDisposables = new DisposableStore();
		data.templateDisposables = new DisposableStore();
		data.templateDisposables.add(data.elementDisposables);
		data.breakpoint = dom.append(container, $('.breakpoint'));

		data.icon = $('.icon');
		data.checkbox = createCheckbox(data.templateDisposables);
		data.templateDisposables.add(dom.addStandardDisposableListener(data.checkbox, 'change', (e) => {
			this.debugService.enableOrDisableBreakpoints(!data.context.enabled, data.context);
		}));

		dom.append(data.breakpoint, data.icon);
		dom.append(data.breakpoint, data.checkbox);

		data.name = dom.append(data.breakpoint, $('span.name'));

		data.address = dom.append(data.breakpoint, $('span.file-path'));
		data.actionBar = new ActionBar(data.breakpoint);
		data.templateDisposables.add(data.actionBar);
		const badgeContainer = dom.append(data.breakpoint, $('.badge-container'));
		data.badge = dom.append(badgeContainer, $('span.line-number.monaco-count-badge'));

		return data;
	}

	renderElement(node: ITreeNode<IInstructionBreakpoint, void>, index: number, data: IInstructionBreakpointTemplateData): void {
		this.renderInstructionBreakpoint(node.element, data);
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<IInstructionBreakpoint>, void>, index: number, data: IInstructionBreakpointTemplateData): void {
		this.renderInstructionBreakpoint(node.element.elements[node.element.elements.length - 1], data);
	}

	private renderInstructionBreakpoint(breakpoint: IInstructionBreakpoint, data: IInstructionBreakpointTemplateData): void {
		data.context = breakpoint;
		data.breakpoint.classList.toggle('disabled', !this.debugService.getModel().areBreakpointsActivated());

		data.name.textContent = '0x' + breakpoint.address.toString(16);
		data.elementDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.name, localize('debug.decimal.address', "Decimal Address: {0}", breakpoint.address.toString())));
		data.checkbox.checked = breakpoint.enabled;

		const { message, icon } = getBreakpointMessageAndIcon(this.debugService.state, this.debugService.getModel().areBreakpointsActivated(), breakpoint, this.labelService, this.debugService.getModel());
		data.icon.className = ThemeIcon.asClassName(icon);
		data.elementDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.breakpoint, breakpoint.message || message || ''));

		const debugActive = this.debugService.state === State.Running || this.debugService.state === State.Stopped;
		if (debugActive && !breakpoint.verified) {
			data.breakpoint.classList.add('disabled');
		}

		if (breakpoint.modeLabel) {
			data.badge.textContent = breakpoint.modeLabel;
			data.badge.style.display = 'block';
		} else {
			data.badge.style.display = 'none';
		}
	}

	disposeElement(node: ITreeNode<IInstructionBreakpoint, void>, index: number, templateData: IInstructionBreakpointTemplateData): void {
		templateData.elementDisposables.clear();
	}

	disposeCompressedElements(node: ITreeNode<ICompressedTreeNode<IInstructionBreakpoint>, void>, index: number, templateData: IInstructionBreakpointTemplateData): void {
		templateData.elementDisposables.clear();
	}

	disposeTemplate(templateData: IInstructionBreakpointTemplateData): void {
		templateData.templateDisposables.dispose();
	}
}

class FunctionBreakpointInputRenderer implements ICompressibleTreeRenderer<IFunctionBreakpoint, void, IFunctionBreakpointInputTemplateData> {

	constructor(
		private view: BreakpointsView,
		private debugService: IDebugService,
		private contextViewService: IContextViewService,
		private readonly hoverService: IHoverService,
		private labelService: ILabelService
	) { }

	static readonly ID = 'functionbreakpointinput';

	get templateId() {
		return FunctionBreakpointInputRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IFunctionBreakpointInputTemplateData {
		const template: IFunctionBreakpointInputTemplateData = Object.create(null);
		const toDispose = new DisposableStore();

		const breakpoint = dom.append(container, $('.breakpoint'));
		template.icon = $('.icon');
		template.checkbox = createCheckbox(toDispose);

		dom.append(breakpoint, template.icon);
		dom.append(breakpoint, template.checkbox);
		this.view.breakpointInputFocused.set(true);
		const inputBoxContainer = dom.append(breakpoint, $('.inputBoxContainer'));


		const inputBox = new InputBox(inputBoxContainer, this.contextViewService, { inputBoxStyles: defaultInputBoxStyles });

		toDispose.add(inputBox);

		const wrapUp = (success: boolean) => {
			template.updating = true;
			try {
				this.view.breakpointInputFocused.set(false);
				const id = template.breakpoint.getId();

				if (success) {
					if (template.type === 'name') {
						this.debugService.updateFunctionBreakpoint(id, { name: inputBox.value });
					}
					if (template.type === 'condition') {
						this.debugService.updateFunctionBreakpoint(id, { condition: inputBox.value });
					}
					if (template.type === 'hitCount') {
						this.debugService.updateFunctionBreakpoint(id, { hitCondition: inputBox.value });
					}
				} else {
					if (template.type === 'name' && !template.breakpoint.name) {
						this.debugService.removeFunctionBreakpoints(id);
					} else {
						this.view.renderInputBox(undefined);
					}
				}
			} finally {
				template.updating = false;
			}
		};

		toDispose.add(dom.addStandardDisposableListener(inputBox.inputElement, 'keydown', (e: IKeyboardEvent) => {
			const isEscape = e.equals(KeyCode.Escape);
			const isEnter = e.equals(KeyCode.Enter);
			if (isEscape || isEnter) {
				e.preventDefault();
				e.stopPropagation();
				wrapUp(isEnter);
			}
		}));
		toDispose.add(dom.addDisposableListener(inputBox.inputElement, 'blur', () => {
			if (!template.updating) {
				wrapUp(!!inputBox.value);
			}
		}));

		template.inputBox = inputBox;
		template.elementDisposables = new DisposableStore();
		template.templateDisposables = toDispose;
		template.templateDisposables.add(template.elementDisposables);
		return template;
	}

	renderElement(node: ITreeNode<FunctionBreakpoint, void>, _index: number, data: IFunctionBreakpointInputTemplateData): void {
		const functionBreakpoint = node.element;
		data.breakpoint = functionBreakpoint;
		data.type = this.view.inputBoxData?.type || 'name'; // If there is no type set take the 'name' as the default
		const { icon, message } = getBreakpointMessageAndIcon(this.debugService.state, this.debugService.getModel().areBreakpointsActivated(), functionBreakpoint, this.labelService, this.debugService.getModel());

		data.icon.className = ThemeIcon.asClassName(icon);
		data.elementDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.icon, message ? message : ''));
		data.checkbox.checked = functionBreakpoint.enabled;
		data.checkbox.disabled = true;
		data.inputBox.value = functionBreakpoint.name || '';

		let placeholder = localize('functionBreakpointPlaceholder', "Function to break on");
		let ariaLabel = localize('functionBreakPointInputAriaLabel', "Type function breakpoint.");
		if (data.type === 'condition') {
			data.inputBox.value = functionBreakpoint.condition || '';
			placeholder = localize('functionBreakpointExpressionPlaceholder', "Break when expression evaluates to true");
			ariaLabel = localize('functionBreakPointExpresionAriaLabel', "Type expression. Function breakpoint will break when expression evaluates to true");
		} else if (data.type === 'hitCount') {
			data.inputBox.value = functionBreakpoint.hitCondition || '';
			placeholder = localize('functionBreakpointHitCountPlaceholder', "Break when hit count is met");
			ariaLabel = localize('functionBreakPointHitCountAriaLabel', "Type hit count. Function breakpoint will break when hit count is met.");
		}
		data.inputBox.setAriaLabel(ariaLabel);
		data.inputBox.setPlaceHolder(placeholder);

		setTimeout(() => {
			data.inputBox.focus();
			data.inputBox.select();
		}, 0);
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<IFunctionBreakpoint>, void>, _index: number, data: IFunctionBreakpointInputTemplateData): void {
		// Function breakpoints are not compressible
	}

	disposeElement(node: ITreeNode<IFunctionBreakpoint, void>, index: number, templateData: IFunctionBreakpointInputTemplateData): void {
		templateData.elementDisposables.clear();
	}

	disposeCompressedElements(node: ITreeNode<ICompressedTreeNode<IFunctionBreakpoint>, void>, index: number, templateData: IFunctionBreakpointInputTemplateData): void {
		templateData.elementDisposables.clear();
	}

	disposeTemplate(templateData: IFunctionBreakpointInputTemplateData): void {
		templateData.templateDisposables.dispose();
	}
}

class DataBreakpointInputRenderer implements ICompressibleTreeRenderer<IDataBreakpoint, void, IDataBreakpointInputTemplateData> {

	constructor(
		private view: BreakpointsView,
		private debugService: IDebugService,
		private contextViewService: IContextViewService,
		private readonly hoverService: IHoverService,
		private labelService: ILabelService
	) { }

	static readonly ID = 'databreakpointinput';

	get templateId() {
		return DataBreakpointInputRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IDataBreakpointInputTemplateData {
		const template: IDataBreakpointInputTemplateData = Object.create(null);
		const toDispose = new DisposableStore();

		const breakpoint = dom.append(container, $('.breakpoint'));
		template.icon = $('.icon');
		template.checkbox = createCheckbox(toDispose);

		dom.append(breakpoint, template.icon);
		dom.append(breakpoint, template.checkbox);
		this.view.breakpointInputFocused.set(true);
		const inputBoxContainer = dom.append(breakpoint, $('.inputBoxContainer'));


		const inputBox = new InputBox(inputBoxContainer, this.contextViewService, { inputBoxStyles: defaultInputBoxStyles });
		toDispose.add(inputBox);

		const wrapUp = (success: boolean) => {
			template.updating = true;
			try {
				this.view.breakpointInputFocused.set(false);
				const id = template.breakpoint.getId();

				if (success) {
					if (template.type === 'condition') {
						this.debugService.updateDataBreakpoint(id, { condition: inputBox.value });
					}
					if (template.type === 'hitCount') {
						this.debugService.updateDataBreakpoint(id, { hitCondition: inputBox.value });
					}
				} else {
					this.view.renderInputBox(undefined);
				}
			} finally {
				template.updating = false;
			}
		};

		toDispose.add(dom.addStandardDisposableListener(inputBox.inputElement, 'keydown', (e: IKeyboardEvent) => {
			const isEscape = e.equals(KeyCode.Escape);
			const isEnter = e.equals(KeyCode.Enter);
			if (isEscape || isEnter) {
				e.preventDefault();
				e.stopPropagation();
				wrapUp(isEnter);
			}
		}));
		toDispose.add(dom.addDisposableListener(inputBox.inputElement, 'blur', () => {
			if (!template.updating) {
				wrapUp(!!inputBox.value);
			}
		}));

		template.inputBox = inputBox;
		template.elementDisposables = new DisposableStore();
		template.templateDisposables = toDispose;
		template.templateDisposables.add(template.elementDisposables);
		return template;
	}

	renderElement(node: ITreeNode<DataBreakpoint, void>, _index: number, data: IDataBreakpointInputTemplateData): void {
		const dataBreakpoint = node.element;
		data.breakpoint = dataBreakpoint;
		data.type = this.view.inputBoxData?.type || 'condition'; // If there is no type set take the 'condition' as the default
		const { icon, message } = getBreakpointMessageAndIcon(this.debugService.state, this.debugService.getModel().areBreakpointsActivated(), dataBreakpoint, this.labelService, this.debugService.getModel());

		data.icon.className = ThemeIcon.asClassName(icon);
		data.elementDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.icon, message ?? ''));
		data.checkbox.checked = dataBreakpoint.enabled;
		data.checkbox.disabled = true;
		data.inputBox.value = '';
		let placeholder = '';
		let ariaLabel = '';
		if (data.type === 'condition') {
			data.inputBox.value = dataBreakpoint.condition || '';
			placeholder = localize('dataBreakpointExpressionPlaceholder', "Break when expression evaluates to true");
			ariaLabel = localize('dataBreakPointExpresionAriaLabel', "Type expression. Data breakpoint will break when expression evaluates to true");
		} else if (data.type === 'hitCount') {
			data.inputBox.value = dataBreakpoint.hitCondition || '';
			placeholder = localize('dataBreakpointHitCountPlaceholder', "Break when hit count is met");
			ariaLabel = localize('dataBreakPointHitCountAriaLabel', "Type hit count. Data breakpoint will break when hit count is met.");
		}
		data.inputBox.setAriaLabel(ariaLabel);
		data.inputBox.setPlaceHolder(placeholder);

		setTimeout(() => {
			data.inputBox.focus();
			data.inputBox.select();
		}, 0);
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<IDataBreakpoint>, void>, _index: number, data: IDataBreakpointInputTemplateData): void {
		// Data breakpoints are not compressible
	}

	disposeElement(node: ITreeNode<IDataBreakpoint, void>, index: number, templateData: IDataBreakpointInputTemplateData): void {
		templateData.elementDisposables.clear();
	}

	disposeCompressedElements(node: ITreeNode<ICompressedTreeNode<IDataBreakpoint>, void>, index: number, templateData: IDataBreakpointInputTemplateData): void {
		templateData.elementDisposables.clear();
	}

	disposeTemplate(templateData: IDataBreakpointInputTemplateData): void {
		templateData.templateDisposables.dispose();
	}
}

class ExceptionBreakpointInputRenderer implements ICompressibleTreeRenderer<IExceptionBreakpoint, void, IExceptionBreakpointInputTemplateData> {

	constructor(
		private view: BreakpointsView,
		private debugService: IDebugService,
		private contextViewService: IContextViewService,
	) {
		// noop
	}

	static readonly ID = 'exceptionbreakpointinput';

	get templateId() {
		return ExceptionBreakpointInputRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IExceptionBreakpointInputTemplateData {
		const toDispose = new DisposableStore();

		const breakpoint = dom.append(container, $('.breakpoint'));
		breakpoint.classList.add('exception');
		const checkbox = createCheckbox(toDispose);

		dom.append(breakpoint, checkbox);
		this.view.breakpointInputFocused.set(true);
		const inputBoxContainer = dom.append(breakpoint, $('.inputBoxContainer'));
		const inputBox = new InputBox(inputBoxContainer, this.contextViewService, {
			ariaLabel: localize('exceptionBreakpointAriaLabel', "Type exception breakpoint condition"),
			inputBoxStyles: defaultInputBoxStyles
		});


		toDispose.add(inputBox);
		const wrapUp = (success: boolean) => {
			if (!templateData.currentBreakpoint) {
				return;
			}

			this.view.breakpointInputFocused.set(false);
			let newCondition = templateData.currentBreakpoint.condition;
			if (success) {
				newCondition = inputBox.value !== '' ? inputBox.value : undefined;
			}
			this.debugService.setExceptionBreakpointCondition(templateData.currentBreakpoint, newCondition);
		};

		toDispose.add(dom.addStandardDisposableListener(inputBox.inputElement, 'keydown', (e: IKeyboardEvent) => {
			const isEscape = e.equals(KeyCode.Escape);
			const isEnter = e.equals(KeyCode.Enter);
			if (isEscape || isEnter) {
				e.preventDefault();
				e.stopPropagation();
				wrapUp(isEnter);
			}
		}));
		toDispose.add(dom.addDisposableListener(inputBox.inputElement, 'blur', () => {
			// Need to react with a timeout on the blur event due to possible concurent splices #56443
			setTimeout(() => {
				wrapUp(true);
			});
		}));

		const elementDisposables = new DisposableStore();
		toDispose.add(elementDisposables);

		const templateData: IExceptionBreakpointInputTemplateData = {
			inputBox,
			checkbox,
			templateDisposables: toDispose,
			elementDisposables: new DisposableStore(),
		};

		return templateData;
	}

	renderElement(node: ITreeNode<ExceptionBreakpoint, void>, _index: number, data: IExceptionBreakpointInputTemplateData): void {
		const exceptionBreakpoint = node.element;
		const placeHolder = exceptionBreakpoint.conditionDescription || localize('exceptionBreakpointPlaceholder', "Break when expression evaluates to true");
		data.inputBox.setPlaceHolder(placeHolder);
		data.currentBreakpoint = exceptionBreakpoint;
		data.checkbox.checked = exceptionBreakpoint.enabled;
		data.checkbox.disabled = true;
		data.inputBox.value = exceptionBreakpoint.condition || '';
		setTimeout(() => {
			data.inputBox.focus();
			data.inputBox.select();
		}, 0);
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<IExceptionBreakpoint>, void>, _index: number, data: IExceptionBreakpointInputTemplateData): void {
		// Exception breakpoints are not compressible
	}

	disposeElement(node: ITreeNode<IExceptionBreakpoint, void>, index: number, templateData: IExceptionBreakpointInputTemplateData): void {
		templateData.elementDisposables.clear();
	}

	disposeCompressedElements(node: ITreeNode<ICompressedTreeNode<IExceptionBreakpoint>, void>, index: number, templateData: IExceptionBreakpointInputTemplateData): void {
		templateData.elementDisposables.clear();
	}

	disposeTemplate(templateData: IExceptionBreakpointInputTemplateData): void {
		templateData.templateDisposables.dispose();
	}
}

class BreakpointsAccessibilityProvider implements IListAccessibilityProvider<BreakpointTreeElement> {

	constructor(
		private readonly debugService: IDebugService,
		private readonly labelService: ILabelService
	) { }

	getWidgetAriaLabel(): string {
		return localize('breakpoints', "Breakpoints");
	}

	getRole(): AriaRole {
		return 'checkbox';
	}

	isChecked(element: BreakpointTreeElement) {
		if (element instanceof BreakpointsFolderItem) {
			return element.enabled;
		}
		return element.enabled;
	}

	getAriaLabel(element: BreakpointTreeElement): string | null {
		if (element instanceof BreakpointsFolderItem) {
			return localize('breakpointFolder', "Breakpoints in {0}, {1} breakpoints", resources.basenameOrAuthority(element.uri), element.breakpoints.length);
		}

		if (element instanceof ExceptionBreakpoint) {
			return element.toString();
		}

		const { message } = getBreakpointMessageAndIcon(this.debugService.state, this.debugService.getModel().areBreakpointsActivated(), element as IBreakpoint | IDataBreakpoint | IFunctionBreakpoint, this.labelService, this.debugService.getModel());
		const toString = element.toString();

		return message ? `${toString}, ${message}` : toString;
	}
}

export function openBreakpointSource(breakpoint: IBreakpoint, sideBySide: boolean, preserveFocus: boolean, pinned: boolean, debugService: IDebugService, editorService: IEditorService): Promise<IEditorPane | undefined> {
	if (breakpoint.uri.scheme === DEBUG_SCHEME && debugService.state === State.Inactive) {
		return Promise.resolve(undefined);
	}

	const selection = breakpoint.endLineNumber ? {
		startLineNumber: breakpoint.lineNumber,
		endLineNumber: breakpoint.endLineNumber,
		startColumn: breakpoint.column || 1,
		endColumn: breakpoint.endColumn || Constants.MAX_SAFE_SMALL_INTEGER
	} : {
		startLineNumber: breakpoint.lineNumber,
		startColumn: breakpoint.column || 1,
		endLineNumber: breakpoint.lineNumber,
		endColumn: breakpoint.column || Constants.MAX_SAFE_SMALL_INTEGER
	};

	return editorService.openEditor({
		resource: breakpoint.uri,
		options: {
			preserveFocus,
			selection,
			revealIfOpened: true,
			selectionRevealType: TextEditorSelectionRevealType.CenterIfOutsideViewport,
			pinned
		}
	}, sideBySide ? SIDE_GROUP : ACTIVE_GROUP);
}

export function getBreakpointMessageAndIcon(state: State, breakpointsActivated: boolean, breakpoint: BreakpointItem, labelService: ILabelService, debugModel: IDebugModel): { message?: string; icon: ThemeIcon; showAdapterUnverifiedMessage?: boolean } {
	const debugActive = state === State.Running || state === State.Stopped;

	const breakpointIcon = breakpoint instanceof DataBreakpoint ? icons.dataBreakpoint : breakpoint instanceof FunctionBreakpoint ? icons.functionBreakpoint : breakpoint.logMessage ? icons.logBreakpoint : icons.breakpoint;

	if (!breakpoint.enabled || !breakpointsActivated) {
		return {
			icon: breakpointIcon.disabled,
			message: breakpoint.logMessage ? localize('disabledLogpoint', "Disabled Logpoint") : localize('disabledBreakpoint', "Disabled Breakpoint"),
		};
	}

	const appendMessage = (text: string): string => {
		return ('message' in breakpoint && breakpoint.message) ? text.concat(', ' + breakpoint.message) : text;
	};

	if (debugActive && breakpoint instanceof Breakpoint && breakpoint.pending) {
		return {
			icon: icons.breakpoint.pending
		};
	}

	if (debugActive && !breakpoint.verified) {
		return {
			icon: breakpointIcon.unverified,
			message: ('message' in breakpoint && breakpoint.message) ? breakpoint.message : (breakpoint.logMessage ? localize('unverifiedLogpoint', "Unverified Logpoint") : localize('unverifiedBreakpoint', "Unverified Breakpoint")),
			showAdapterUnverifiedMessage: true
		};
	}

	if (breakpoint instanceof DataBreakpoint) {
		if (!breakpoint.supported) {
			return {
				icon: breakpointIcon.unverified,
				message: localize('dataBreakpointUnsupported', "Data breakpoints not supported by this debug type"),
			};
		}

		return {
			icon: breakpointIcon.regular,
			message: breakpoint.message || localize('dataBreakpoint', "Data Breakpoint")
		};
	}

	if (breakpoint instanceof FunctionBreakpoint) {
		if (!breakpoint.supported) {
			return {
				icon: breakpointIcon.unverified,
				message: localize('functionBreakpointUnsupported', "Function breakpoints not supported by this debug type"),
			};
		}
		const messages: string[] = [];
		messages.push(breakpoint.message || localize('functionBreakpoint', "Function Breakpoint"));
		if (breakpoint.condition) {
			messages.push(localize('expression', "Condition: {0}", breakpoint.condition));
		}
		if (breakpoint.hitCondition) {
			messages.push(localize('hitCount', "Hit Count: {0}", breakpoint.hitCondition));
		}

		return {
			icon: breakpointIcon.regular,
			message: appendMessage(messages.join('\n'))
		};
	}

	if (breakpoint instanceof InstructionBreakpoint) {
		if (!breakpoint.supported) {
			return {
				icon: breakpointIcon.unverified,
				message: localize('instructionBreakpointUnsupported', "Instruction breakpoints not supported by this debug type"),
			};
		}
		const messages: string[] = [];
		if (breakpoint.message) {
			messages.push(breakpoint.message);
		} else if (breakpoint.instructionReference) {
			messages.push(localize('instructionBreakpointAtAddress', "Instruction breakpoint at address {0}", breakpoint.instructionReference));
		} else {
			messages.push(localize('instructionBreakpoint', "Instruction breakpoint"));
		}

		if (breakpoint.hitCondition) {
			messages.push(localize('hitCount', "Hit Count: {0}", breakpoint.hitCondition));
		}

		return {
			icon: breakpointIcon.regular,
			message: appendMessage(messages.join('\n'))
		};
	}

	// can change this when all breakpoint supports dependent breakpoint condition
	let triggeringBreakpoint: IBreakpoint | undefined;
	if (breakpoint instanceof Breakpoint && breakpoint.triggeredBy) {
		triggeringBreakpoint = debugModel.getBreakpoints().find(bp => bp.getId() === breakpoint.triggeredBy);
	}

	if (breakpoint.logMessage || breakpoint.condition || breakpoint.hitCondition || triggeringBreakpoint) {
		const messages: string[] = [];
		let icon = breakpoint.logMessage ? icons.logBreakpoint.regular : icons.conditionalBreakpoint.regular;
		if (!breakpoint.supported) {
			icon = icons.debugBreakpointUnsupported;
			messages.push(localize('breakpointUnsupported', "Breakpoints of this type are not supported by the debugger"));
		}

		if (breakpoint.logMessage) {
			messages.push(localize('logMessage', "Log Message: {0}", breakpoint.logMessage));
		}
		if (breakpoint.condition) {
			messages.push(localize('expression', "Condition: {0}", breakpoint.condition));
		}
		if (breakpoint.hitCondition) {
			messages.push(localize('hitCount', "Hit Count: {0}", breakpoint.hitCondition));
		}
		if (triggeringBreakpoint) {
			messages.push(localize('triggeredBy', "Hit after breakpoint: {0}", `${labelService.getUriLabel(triggeringBreakpoint.uri, { relative: true })}: ${triggeringBreakpoint.lineNumber}`));
		}

		return {
			icon,
			message: appendMessage(messages.join('\n'))
		};
	}

	const message = ('message' in breakpoint && breakpoint.message) ? breakpoint.message : breakpoint instanceof Breakpoint && labelService ? labelService.getUriLabel(breakpoint.uri) : localize('breakpoint', "Breakpoint");
	return {
		icon: breakpointIcon.regular,
		message
	};
}

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.debug.viewlet.action.addFunctionBreakpointAction',
			title: {
				...localize2('addFunctionBreakpoint', "Add Function Breakpoint"),
				mnemonicTitle: localize({ key: 'miFunctionBreakpoint', comment: ['&& denotes a mnemonic'] }, "&&Function Breakpoint..."),
			},
			f1: true,
			icon: icons.watchExpressionsAddFuncBreakpoint,
			menu: [{
				id: MenuId.ViewTitle,
				group: 'navigation',
				order: 10,
				when: ContextKeyExpr.equals('view', BREAKPOINTS_VIEW_ID)
			}, {
				id: MenuId.MenubarNewBreakpointMenu,
				group: '1_breakpoints',
				order: 3,
				when: CONTEXT_DEBUGGERS_AVAILABLE
			}]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const debugService = accessor.get(IDebugService);
		const viewService = accessor.get(IViewsService);
		await viewService.openView(BREAKPOINTS_VIEW_ID);
		debugService.addFunctionBreakpoint();
	}
});

abstract class MemoryBreakpointAction extends Action2 {
	async run(accessor: ServicesAccessor, existingBreakpoint?: IDataBreakpoint): Promise<void> {
		const debugService = accessor.get(IDebugService);
		const session = debugService.getViewModel().focusedSession;
		if (!session) {
			return;
		}

		let defaultValue = undefined;
		if (existingBreakpoint && existingBreakpoint.src.type === DataBreakpointSetType.Address) {
			defaultValue = `${existingBreakpoint.src.address} + ${existingBreakpoint.src.bytes}`;
		}

		const quickInput = accessor.get(IQuickInputService);
		const notifications = accessor.get(INotificationService);
		const range = await this.getRange(quickInput, defaultValue);
		if (!range) {
			return;
		}

		let info: IDataBreakpointInfoResponse | undefined;
		try {
			info = await session.dataBytesBreakpointInfo(range.address, range.bytes);
		} catch (e) {
			notifications.error(localize('dataBreakpointError', "Failed to set data breakpoint at {0}: {1}", range.address, e.message));
		}

		if (!info?.dataId) {
			return;
		}

		let accessType: DebugProtocol.DataBreakpointAccessType = 'write';
		if (info.accessTypes && info.accessTypes?.length > 1) {
			const accessTypes = info.accessTypes.map(type => ({ label: type }));
			const selectedAccessType = await quickInput.pick(accessTypes, { placeHolder: localize('dataBreakpointAccessType', "Select the access type to monitor") });
			if (!selectedAccessType) {
				return;
			}

			accessType = selectedAccessType.label;
		}

		const src: DataBreakpointSource = { type: DataBreakpointSetType.Address, ...range };
		if (existingBreakpoint) {
			await debugService.removeDataBreakpoints(existingBreakpoint.getId());
		}

		await debugService.addDataBreakpoint({
			description: info.description,
			src,
			canPersist: true,
			accessTypes: info.accessTypes,
			accessType: accessType,
			initialSessionData: { session, dataId: info.dataId }
		});
	}

	private getRange(quickInput: IQuickInputService, defaultValue?: string) {
		return new Promise<{ address: string; bytes: number } | undefined>(resolve => {
			const disposables = new DisposableStore();
			const input = disposables.add(quickInput.createInputBox());
			input.prompt = localize('dataBreakpointMemoryRangePrompt', "Enter a memory range in which to break");
			input.placeholder = localize('dataBreakpointMemoryRangePlaceholder', 'Absolute range (0x1234 - 0x1300) or range of bytes after an address (0x1234 + 0xff)');
			if (defaultValue) {
				input.value = defaultValue;
				input.valueSelection = [0, defaultValue.length];
			}
			disposables.add(input.onDidChangeValue(e => {
				const err = this.parseAddress(e, false);
				input.validationMessage = err?.error;
			}));
			disposables.add(input.onDidAccept(() => {
				const r = this.parseAddress(input.value, true);
				if ('error' in r) {
					input.validationMessage = r.error;
				} else {
					resolve(r);
				}
				input.dispose();
			}));
			disposables.add(input.onDidHide(() => {
				resolve(undefined);
				disposables.dispose();
			}));
			input.ignoreFocusOut = true;
			input.show();
		});
	}

	private parseAddress(range: string, isFinal: false): { error: string } | undefined;
	private parseAddress(range: string, isFinal: true): { error: string } | { address: string; bytes: number };
	private parseAddress(range: string, isFinal: boolean): { error: string } | { address: string; bytes: number } | undefined {
		const parts = /^(\S+)\s*(?:([+-])\s*(\S+))?/.exec(range);
		if (!parts) {
			return { error: localize('dataBreakpointAddrFormat', 'Address should be a range of numbers the form "[Start] - [End]" or "[Start] + [Bytes]"') };
		}

		const isNum = (e: string) => isFinal ? /^0x[0-9a-f]*|[0-9]*$/i.test(e) : /^0x[0-9a-f]+|[0-9]+$/i.test(e);
		const [, startStr, sign = '+', endStr = '1'] = parts;

		for (const n of [startStr, endStr]) {
			if (!isNum(n)) {
				return { error: localize('dataBreakpointAddrStartEnd', 'Number must be a decimal integer or hex value starting with \"0x\", got {0}', n) };
			}
		}

		if (!isFinal) {
			return;
		}

		const start = BigInt(startStr);
		const end = BigInt(endStr);
		const address = `0x${start.toString(16)}`;
		if (sign === '-') {
			if (start > end) {
				return { error: localize('dataBreakpointAddrOrder', 'End ({1}) should be greater than Start ({0})', startStr, endStr) };
			}
			return { address, bytes: Number(end - start) };
		}

		return { address, bytes: Number(end) };
	}
}

registerAction2(class extends MemoryBreakpointAction {
	constructor() {
		super({
			id: 'workbench.debug.viewlet.action.addDataBreakpointOnAddress',
			title: {
				...localize2('addDataBreakpointOnAddress', "Add Data Breakpoint at Address"),
				mnemonicTitle: localize({ key: 'miDataBreakpoint', comment: ['&& denotes a mnemonic'] }, "&&Data Breakpoint..."),
			},
			f1: true,
			icon: icons.watchExpressionsAddDataBreakpoint,
			menu: [{
				id: MenuId.ViewTitle,
				group: 'navigation',
				order: 11,
				when: ContextKeyExpr.and(CONTEXT_SET_DATA_BREAKPOINT_BYTES_SUPPORTED, ContextKeyExpr.equals('view', BREAKPOINTS_VIEW_ID))
			}, {
				id: MenuId.MenubarNewBreakpointMenu,
				group: '1_breakpoints',
				order: 4,
				when: CONTEXT_SET_DATA_BREAKPOINT_BYTES_SUPPORTED
			}]
		});
	}
});

registerAction2(class extends MemoryBreakpointAction {
	constructor() {
		super({
			id: 'workbench.debug.viewlet.action.editDataBreakpointOnAddress',
			title: localize2('editDataBreakpointOnAddress', "Edit Address..."),
			menu: [{
				id: MenuId.DebugBreakpointsContext,
				when: ContextKeyExpr.and(CONTEXT_SET_DATA_BREAKPOINT_BYTES_SUPPORTED, CONTEXT_BREAKPOINT_ITEM_IS_DATA_BYTES),
				group: 'navigation',
				order: 15,
			}]
		});
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.debug.viewlet.action.toggleBreakpointsActivatedAction',
			title: localize2('activateBreakpoints', 'Toggle Activate Breakpoints'),
			f1: true,
			icon: icons.breakpointsActivate,
			menu: {
				id: MenuId.ViewTitle,
				group: 'navigation',
				order: 20,
				when: ContextKeyExpr.equals('view', BREAKPOINTS_VIEW_ID)
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const debugService = accessor.get(IDebugService);
		debugService.setBreakpointsActivated(!debugService.getModel().areBreakpointsActivated());
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.debug.viewlet.action.removeBreakpoint',
			title: localize('removeBreakpoint', "Remove Breakpoint"),
			icon: Codicon.removeClose,
			menu: [{
				id: MenuId.DebugBreakpointsContext,
				group: '3_modification',
				order: 10,
				when: CONTEXT_BREAKPOINT_ITEM_TYPE.notEqualsTo('exceptionBreakpoint')
			}, {
				id: MenuId.DebugBreakpointsContext,
				group: 'inline',
				order: 20,
				when: CONTEXT_BREAKPOINT_ITEM_TYPE.notEqualsTo('exceptionBreakpoint')
			}]
		});
	}

	async run(accessor: ServicesAccessor, breakpoint: IBaseBreakpoint): Promise<void> {
		const debugService = accessor.get(IDebugService);
		if (breakpoint instanceof Breakpoint) {
			await debugService.removeBreakpoints(breakpoint.getId());
		} else if (breakpoint instanceof FunctionBreakpoint) {
			await debugService.removeFunctionBreakpoints(breakpoint.getId());
		} else if (breakpoint instanceof DataBreakpoint) {
			await debugService.removeDataBreakpoints(breakpoint.getId());
		} else if (breakpoint instanceof InstructionBreakpoint) {
			await debugService.removeInstructionBreakpoints(breakpoint.instructionReference, breakpoint.offset);
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.debug.viewlet.action.removeAllBreakpoints',
			title: {
				...localize2('removeAllBreakpoints', "Remove All Breakpoints"),
				mnemonicTitle: localize({ key: 'miRemoveAllBreakpoints', comment: ['&& denotes a mnemonic'] }, "Remove &&All Breakpoints"),
			},
			f1: true,
			icon: icons.breakpointsRemoveAll,
			menu: [{
				id: MenuId.ViewTitle,
				group: 'navigation',
				order: 30,
				when: ContextKeyExpr.equals('view', BREAKPOINTS_VIEW_ID)
			}, {
				id: MenuId.DebugBreakpointsContext,
				group: '3_modification',
				order: 20,
				when: ContextKeyExpr.and(CONTEXT_BREAKPOINTS_EXIST, CONTEXT_BREAKPOINT_ITEM_TYPE.notEqualsTo('exceptionBreakpoint'))
			}, {
				id: MenuId.MenubarDebugMenu,
				group: '5_breakpoints',
				order: 3,
				when: CONTEXT_DEBUGGERS_AVAILABLE
			}]
		});
	}

	run(accessor: ServicesAccessor): void {
		const debugService = accessor.get(IDebugService);
		debugService.removeBreakpoints();
		debugService.removeFunctionBreakpoints();
		debugService.removeDataBreakpoints();
		debugService.removeInstructionBreakpoints();
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.debug.viewlet.action.enableAllBreakpoints',
			title: {
				...localize2('enableAllBreakpoints', "Enable All Breakpoints"),
				mnemonicTitle: localize({ key: 'miEnableAllBreakpoints', comment: ['&& denotes a mnemonic'] }, "&&Enable All Breakpoints"),
			},
			f1: true,
			precondition: CONTEXT_DEBUGGERS_AVAILABLE,
			menu: [{
				id: MenuId.DebugBreakpointsContext,
				group: 'z_commands',
				order: 10,
				when: ContextKeyExpr.and(CONTEXT_BREAKPOINTS_EXIST, CONTEXT_BREAKPOINT_ITEM_TYPE.notEqualsTo('exceptionBreakpoint'))
			}, {
				id: MenuId.MenubarDebugMenu,
				group: '5_breakpoints',
				order: 1,
				when: CONTEXT_DEBUGGERS_AVAILABLE
			}]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const debugService = accessor.get(IDebugService);
		await debugService.enableOrDisableBreakpoints(true);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.debug.viewlet.action.disableAllBreakpoints',
			title: {
				...localize2('disableAllBreakpoints', "Disable All Breakpoints"),
				mnemonicTitle: localize({ key: 'miDisableAllBreakpoints', comment: ['&& denotes a mnemonic'] }, "Disable A&&ll Breakpoints"),
			},
			f1: true,
			precondition: CONTEXT_DEBUGGERS_AVAILABLE,
			menu: [{
				id: MenuId.DebugBreakpointsContext,
				group: 'z_commands',
				order: 20,
				when: ContextKeyExpr.and(CONTEXT_BREAKPOINTS_EXIST, CONTEXT_BREAKPOINT_ITEM_TYPE.notEqualsTo('exceptionBreakpoint'))
			}, {
				id: MenuId.MenubarDebugMenu,
				group: '5_breakpoints',
				order: 2,
				when: CONTEXT_DEBUGGERS_AVAILABLE
			}]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const debugService = accessor.get(IDebugService);
		await debugService.enableOrDisableBreakpoints(false);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.debug.viewlet.action.reapplyBreakpointsAction',
			title: localize2('reapplyAllBreakpoints', 'Reapply All Breakpoints'),
			f1: true,
			precondition: CONTEXT_IN_DEBUG_MODE,
			menu: [{
				id: MenuId.DebugBreakpointsContext,
				group: 'z_commands',
				order: 30,
				when: ContextKeyExpr.and(CONTEXT_BREAKPOINTS_EXIST, CONTEXT_BREAKPOINT_ITEM_TYPE.notEqualsTo('exceptionBreakpoint'))
			}]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const debugService = accessor.get(IDebugService);
		await debugService.setBreakpointsActivated(true);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.debug.viewlet.action.toggleBreakpointsPresentation',
			title: localize2('toggleBreakpointsPresentation', "Toggle Breakpoints View Presentation"),
			f1: true,
			icon: icons.breakpointsViewIcon,
			menu: {
				id: MenuId.ViewTitle,
				group: 'navigation',
				order: 10,
				when: ContextKeyExpr.equals('view', BREAKPOINTS_VIEW_ID)
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);
		const currentPresentation = configurationService.getValue<'list' | 'tree'>('debug.breakpointsView.presentation');
		const newPresentation = currentPresentation === 'tree' ? 'list' : 'tree';
		await configurationService.updateValue('debug.breakpointsView.presentation', newPresentation);
	}
});

registerAction2(class extends ViewAction<BreakpointsView> {
	constructor() {
		super({
			id: 'debug.editBreakpoint',
			viewId: BREAKPOINTS_VIEW_ID,
			title: localize('editCondition', "Edit Condition..."),
			icon: Codicon.edit,
			precondition: CONTEXT_BREAKPOINT_SUPPORTS_CONDITION,
			menu: [{
				id: MenuId.DebugBreakpointsContext,
				when: CONTEXT_BREAKPOINT_ITEM_TYPE.notEqualsTo('functionBreakpoint'),
				group: 'navigation',
				order: 10
			}, {
				id: MenuId.DebugBreakpointsContext,
				group: 'inline',
				order: 10
			}]
		});
	}

	async runInView(accessor: ServicesAccessor, view: BreakpointsView, breakpoint: ExceptionBreakpoint | Breakpoint | FunctionBreakpoint | DataBreakpoint): Promise<void> {
		const debugService = accessor.get(IDebugService);
		const editorService = accessor.get(IEditorService);
		if (breakpoint instanceof Breakpoint) {
			const editor = await openBreakpointSource(breakpoint, false, false, true, debugService, editorService);
			if (editor) {
				const codeEditor = editor.getControl();
				if (isCodeEditor(codeEditor)) {
					codeEditor.getContribution<IBreakpointEditorContribution>(BREAKPOINT_EDITOR_CONTRIBUTION_ID)?.showBreakpointWidget(breakpoint.lineNumber, breakpoint.column);
				}
			}
		} else if (breakpoint instanceof FunctionBreakpoint) {
			const contextMenuService = accessor.get(IContextMenuService);
			const actions: Action[] = [new Action('breakpoint.editCondition', localize('editCondition', "Edit Condition..."), undefined, true, async () => view.renderInputBox({ breakpoint, type: 'condition' })),
			new Action('breakpoint.editCondition', localize('editHitCount', "Edit Hit Count..."), undefined, true, async () => view.renderInputBox({ breakpoint, type: 'hitCount' }))];
			const domNode = breakpointIdToActionBarDomeNode.get(breakpoint.getId());

			if (domNode) {
				contextMenuService.showContextMenu({
					getActions: () => actions,
					getAnchor: () => domNode,
					onHide: () => dispose(actions)
				});
			}
		} else {
			view.renderInputBox({ breakpoint, type: 'condition' });
		}
	}
});


registerAction2(class extends ViewAction<BreakpointsView> {
	constructor() {
		super({
			id: 'debug.editFunctionBreakpoint',
			viewId: BREAKPOINTS_VIEW_ID,
			title: localize('editBreakpoint', "Edit Function Condition..."),
			menu: [{
				id: MenuId.DebugBreakpointsContext,
				group: 'navigation',
				order: 10,
				when: CONTEXT_BREAKPOINT_ITEM_TYPE.isEqualTo('functionBreakpoint')
			}]
		});
	}

	runInView(_accessor: ServicesAccessor, view: BreakpointsView, breakpoint: IFunctionBreakpoint) {
		view.renderInputBox({ breakpoint, type: 'name' });
	}
});

registerAction2(class extends ViewAction<BreakpointsView> {
	constructor() {
		super({
			id: 'debug.editFunctionBreakpointHitCount',
			viewId: BREAKPOINTS_VIEW_ID,
			title: localize('editHitCount', "Edit Hit Count..."),
			precondition: CONTEXT_BREAKPOINT_SUPPORTS_CONDITION,
			menu: [{
				id: MenuId.DebugBreakpointsContext,
				group: 'navigation',
				order: 20,
				when: ContextKeyExpr.or(CONTEXT_BREAKPOINT_ITEM_TYPE.isEqualTo('functionBreakpoint'), CONTEXT_BREAKPOINT_ITEM_TYPE.isEqualTo('dataBreakpoint'))
			}]
		});
	}

	runInView(_accessor: ServicesAccessor, view: BreakpointsView, breakpoint: IFunctionBreakpoint) {
		view.renderInputBox({ breakpoint, type: 'hitCount' });
	}
});

registerAction2(class extends ViewAction<BreakpointsView> {
	constructor() {
		super({
			id: 'debug.editBreakpointMode',
			viewId: BREAKPOINTS_VIEW_ID,
			title: localize('editMode', "Edit Mode..."),
			menu: [{
				id: MenuId.DebugBreakpointsContext,
				group: 'navigation',
				order: 20,
				when: ContextKeyExpr.and(
					CONTEXT_BREAKPOINT_HAS_MODES,
					ContextKeyExpr.or(CONTEXT_BREAKPOINT_ITEM_TYPE.isEqualTo('breakpoint'), CONTEXT_BREAKPOINT_ITEM_TYPE.isEqualTo('exceptionBreakpoint'), CONTEXT_BREAKPOINT_ITEM_TYPE.isEqualTo('instructionBreakpoint'))
				)
			}]
		});
	}

	async runInView(accessor: ServicesAccessor, view: BreakpointsView, breakpoint: IBreakpoint) {
		const debugService = accessor.get(IDebugService);
		const kind = getModeKindForBreakpoint(breakpoint);
		const modes = debugService.getModel().getBreakpointModes(kind);
		const picked = await accessor.get(IQuickInputService).pick(
			modes.map(mode => ({ label: mode.label, description: mode.description, mode: mode.mode })),
			{ placeHolder: localize('selectBreakpointMode', "Select Breakpoint Mode") }
		);

		if (!picked) {
			return;
		}

		if (kind === 'source') {
			const data = new Map<string, IBreakpointUpdateData>();
			data.set(breakpoint.getId(), { mode: picked.mode, modeLabel: picked.label });
			debugService.updateBreakpoints(breakpoint.originalUri, data, false);
		} else if (breakpoint instanceof InstructionBreakpoint) {
			debugService.removeInstructionBreakpoints(breakpoint.instructionReference, breakpoint.offset);
			debugService.addInstructionBreakpoint({ ...breakpoint.toJSON(), mode: picked.mode, modeLabel: picked.label });
		} else if (breakpoint instanceof ExceptionBreakpoint) {
			breakpoint.mode = picked.mode;
			breakpoint.modeLabel = picked.label;
			debugService.setExceptionBreakpointCondition(breakpoint, breakpoint.condition); // no-op to trigger a re-send
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/breakpointWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/breakpointWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { ISelectOptionItem, SelectBox } from '../../../../base/browser/ui/selectBox/selectBox.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import * as lifecycle from '../../../../base/common/lifecycle.js';
import { URI as uri } from '../../../../base/common/uri.js';
import { IActiveCodeEditor, ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorCommand, ServicesAccessor, registerEditorCommand } from '../../../../editor/browser/editorExtensions.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { CodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { EditorOption, IEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { IPosition, Position } from '../../../../editor/common/core/position.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { IDecorationOptions } from '../../../../editor/common/editorCommon.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { CompletionContext, CompletionItemKind, CompletionList } from '../../../../editor/common/languages.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../editor/common/languages/modesRegistry.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { CompletionOptions, provideSuggestionItems } from '../../../../editor/contrib/suggest/browser/suggest.js';
import { ZoneWidget } from '../../../../editor/contrib/zoneWidget/browser/zoneWidget.js';
import * as nls from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService, createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { defaultButtonStyles, defaultSelectBoxStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { editorForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { IColorTheme, IThemeService } from '../../../../platform/theme/common/themeService.js';
import { hasNativeContextMenu } from '../../../../platform/window/common/window.js';
import { getSimpleCodeEditorWidgetOptions, getSimpleEditorOptions } from '../../codeEditor/browser/simpleEditorOptions.js';
import { BREAKPOINT_EDITOR_CONTRIBUTION_ID, CONTEXT_BREAKPOINT_WIDGET_VISIBLE, CONTEXT_IN_BREAKPOINT_WIDGET, BreakpointWidgetContext as Context, DEBUG_SCHEME, IBreakpoint, IBreakpointEditorContribution, IBreakpointUpdateData, IDebugService } from '../common/debug.js';
import './media/breakpointWidget.css';

const $ = dom.$;
const IPrivateBreakpointWidgetService = createDecorator<IPrivateBreakpointWidgetService>('privateBreakpointWidgetService');
interface IPrivateBreakpointWidgetService {
	readonly _serviceBrand: undefined;
	close(success: boolean): void;
}
const DECORATION_KEY = 'breakpointwidgetdecoration';

function isPositionInCurlyBracketBlock(input: IActiveCodeEditor): boolean {
	const model = input.getModel();
	const bracketPairs = model.bracketPairs.getBracketPairsInRange(Range.fromPositions(input.getPosition()));
	return bracketPairs.some(p => p.openingBracketInfo.bracketText === '{');
}

function createDecorations(theme: IColorTheme, placeHolder: string): IDecorationOptions[] {
	const transparentForeground = theme.getColor(editorForeground)?.transparent(0.4);
	return [{
		range: {
			startLineNumber: 0,
			endLineNumber: 0,
			startColumn: 0,
			endColumn: 1
		},
		renderOptions: {
			after: {
				contentText: placeHolder,
				color: transparentForeground ? transparentForeground.toString() : undefined
			}
		}
	}];
}

export class BreakpointWidget extends ZoneWidget implements IPrivateBreakpointWidgetService {
	declare readonly _serviceBrand: undefined;

	private selectContainer!: HTMLElement;
	private inputContainer!: HTMLElement;
	private selectBreakpointContainer!: HTMLElement;
	private input!: IActiveCodeEditor;
	private selectBreakpointBox!: SelectBox;
	private selectModeBox?: SelectBox;
	private store: lifecycle.DisposableStore;
	private conditionInput = '';
	private hitCountInput = '';
	private logMessageInput = '';
	private modeInput?: DebugProtocol.BreakpointMode;
	private breakpoint: IBreakpoint | undefined;
	private context: Context;
	private heightInPx: number | undefined;
	private triggeredByBreakpointInput: IBreakpoint | undefined;

	constructor(editor: ICodeEditor, private lineNumber: number, private column: number | undefined, context: Context | undefined,
		@IContextViewService private readonly contextViewService: IContextViewService,
		@IDebugService private readonly debugService: IDebugService,
		@IThemeService private readonly themeService: IThemeService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IModelService private readonly modelService: IModelService,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@ILabelService private readonly labelService: ILabelService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@IHoverService private readonly hoverService: IHoverService
	) {
		super(editor, { showFrame: true, showArrow: false, frameWidth: 1, isAccessible: true });

		this.store = new lifecycle.DisposableStore();
		const model = this.editor.getModel();
		if (model) {
			const uri = model.uri;
			const breakpoints = this.debugService.getModel().getBreakpoints({ lineNumber: this.lineNumber, column: this.column, uri });
			this.breakpoint = breakpoints.length ? breakpoints[0] : undefined;
		}

		if (context === undefined) {
			if (this.breakpoint && !this.breakpoint.condition && !this.breakpoint.hitCondition && this.breakpoint.logMessage) {
				this.context = Context.LOG_MESSAGE;
			} else if (this.breakpoint && !this.breakpoint.condition && this.breakpoint.hitCondition) {
				this.context = Context.HIT_COUNT;
			} else if (this.breakpoint && this.breakpoint.triggeredBy) {
				this.context = Context.TRIGGER_POINT;
			} else {
				this.context = Context.CONDITION;
			}
		} else {
			this.context = context;
		}

		this.store.add(this.debugService.getModel().onDidChangeBreakpoints(e => {
			if (this.breakpoint && e && e.removed && e.removed.indexOf(this.breakpoint) >= 0) {
				this.dispose();
			}
		}));
		this.store.add(this.codeEditorService.registerDecorationType('breakpoint-widget', DECORATION_KEY, {}));

		this.create();
	}

	private get placeholder(): string {
		const acceptString = this.keybindingService.lookupKeybinding(AcceptBreakpointWidgetInputAction.ID)?.getLabel() || 'Enter';
		const closeString = this.keybindingService.lookupKeybinding(CloseBreakpointWidgetCommand.ID)?.getLabel() || 'Escape';
		switch (this.context) {
			case Context.LOG_MESSAGE:
				return nls.localize('breakpointWidgetLogMessagePlaceholder', "Message to log when breakpoint is hit. Expressions within {} are interpolated. '{0}' to accept, '{1}' to cancel.", acceptString, closeString);
			case Context.HIT_COUNT:
				return nls.localize('breakpointWidgetHitCountPlaceholder', "Break when hit count condition is met. '{0}' to accept, '{1}' to cancel.", acceptString, closeString);
			default:
				return nls.localize('breakpointWidgetExpressionPlaceholder', "Break when expression evaluates to true. '{0}' to accept, '{1}' to cancel.", acceptString, closeString);
		}
	}

	private getInputValue(breakpoint: IBreakpoint | undefined): string {
		switch (this.context) {
			case Context.LOG_MESSAGE:
				return breakpoint && breakpoint.logMessage ? breakpoint.logMessage : this.logMessageInput;
			case Context.HIT_COUNT:
				return breakpoint && breakpoint.hitCondition ? breakpoint.hitCondition : this.hitCountInput;
			default:
				return breakpoint && breakpoint.condition ? breakpoint.condition : this.conditionInput;
		}
	}

	private rememberInput(): void {
		if (this.context !== Context.TRIGGER_POINT) {
			const value = this.input.getModel().getValue();
			switch (this.context) {
				case Context.LOG_MESSAGE:
					this.logMessageInput = value;
					break;
				case Context.HIT_COUNT:
					this.hitCountInput = value;
					break;
				default:
					this.conditionInput = value;
			}
		}
	}

	private setInputMode(): void {
		if (this.editor.hasModel()) {
			// Use plaintext language for log messages, otherwise respect underlying editor language #125619
			const languageId = this.context === Context.LOG_MESSAGE ? PLAINTEXT_LANGUAGE_ID : this.editor.getModel().getLanguageId();
			this.input.getModel().setLanguage(languageId);
		}
	}

	override show(rangeOrPos: IRange | IPosition): void {
		const lineNum = this.input.getModel().getLineCount();
		super.show(rangeOrPos, lineNum + 1);
	}

	fitHeightToContent(): void {
		const lineNum = this.input.getModel().getLineCount();
		this._relayout(lineNum + 1);
	}

	protected _fillContainer(container: HTMLElement): void {
		this.setCssClass('breakpoint-widget');
		const selectBox = this.store.add(new SelectBox([
			{ text: nls.localize('expression', "Expression") },
			{ text: nls.localize('hitCount', "Hit Count") },
			{ text: nls.localize('logMessage', "Log Message") },
			{ text: nls.localize('triggeredBy', "Wait for Breakpoint") },
		] satisfies ISelectOptionItem[], this.context, this.contextViewService, defaultSelectBoxStyles, { ariaLabel: nls.localize('breakpointType', 'Breakpoint Type'), useCustomDrawn: !hasNativeContextMenu(this._configurationService) }));
		this.selectContainer = $('.breakpoint-select-container');
		selectBox.render(dom.append(container, this.selectContainer));
		this.store.add(selectBox.onDidSelect(e => {
			this.rememberInput();
			this.context = e.index;
			this.updateContextInput();
		}));

		this.createModesInput(container);

		this.inputContainer = $('.inputContainer');
		this.store.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.inputContainer, this.placeholder));
		this.createBreakpointInput(dom.append(container, this.inputContainer));

		this.input.getModel().setValue(this.getInputValue(this.breakpoint));
		this.store.add(this.input.getModel().onDidChangeContent(() => {
			this.fitHeightToContent();
		}));
		this.input.setPosition({ lineNumber: 1, column: this.input.getModel().getLineMaxColumn(1) });

		this.createTriggerBreakpointInput(container);

		this.updateContextInput();
		// Due to an electron bug we have to do the timeout, otherwise we do not get focus
		setTimeout(() => this.focusInput(), 150);
	}

	private createModesInput(container: HTMLElement) {
		const modes = this.debugService.getModel().getBreakpointModes('source');
		if (modes.length <= 1) {
			return;
		}

		const sb = this.selectModeBox = new SelectBox(
			[
				{ text: nls.localize('bpMode', 'Mode'), isDisabled: true },
				...modes.map(mode => ({ text: mode.label, description: mode.description })),
			],
			modes.findIndex(m => m.mode === this.breakpoint?.mode) + 1,
			this.contextViewService,
			defaultSelectBoxStyles,
			{ useCustomDrawn: !hasNativeContextMenu(this._configurationService) }
		);
		this.store.add(sb);
		this.store.add(sb.onDidSelect(e => {
			this.modeInput = modes[e.index - 1];
		}));

		const modeWrapper = $('.select-mode-container');
		const selectionWrapper = $('.select-box-container');
		dom.append(modeWrapper, selectionWrapper);
		sb.render(selectionWrapper);
		dom.append(container, modeWrapper);
	}

	private createTriggerBreakpointInput(container: HTMLElement) {
		const breakpoints = this.debugService.getModel().getBreakpoints().filter(bp => bp !== this.breakpoint && !bp.logMessage);
		const breakpointOptions: ISelectOptionItem[] = [
			{ text: nls.localize('noTriggerByBreakpoint', 'None'), isDisabled: true },
			...breakpoints.map(bp => ({
				text: `${this.labelService.getUriLabel(bp.uri, { relative: true })}: ${bp.lineNumber}`,
				description: nls.localize('triggerByLoading', 'Loading...')
			})),
		];

		const index = breakpoints.findIndex((bp) => this.breakpoint?.triggeredBy === bp.getId());
		for (const [i, bp] of breakpoints.entries()) {
			this.textModelService.createModelReference(bp.uri).then(ref => {
				try {
					breakpointOptions[i + 1].description = ref.object.textEditorModel.getLineContent(bp.lineNumber).trim();
				} finally {
					ref.dispose();
				}
			}).catch(() => {
				breakpointOptions[i + 1].description = nls.localize('noBpSource', 'Could not load source.');
			});
		}

		const selectBreakpointBox = this.selectBreakpointBox = this.store.add(new SelectBox(breakpointOptions, index + 1, this.contextViewService, defaultSelectBoxStyles, { ariaLabel: nls.localize('selectBreakpoint', 'Select breakpoint'), useCustomDrawn: !hasNativeContextMenu(this._configurationService) }));
		this.store.add(selectBreakpointBox.onDidSelect(e => {
			if (e.index === 0) {
				this.triggeredByBreakpointInput = undefined;
			} else {
				this.triggeredByBreakpointInput = breakpoints[e.index - 1];
			}
		}));
		this.selectBreakpointContainer = $('.select-breakpoint-container');
		this.store.add(dom.addDisposableListener(this.selectBreakpointContainer, dom.EventType.KEY_DOWN, e => {
			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.Escape)) {
				this.close(false);
			}
		}));

		const selectionWrapper = $('.select-box-container');
		dom.append(this.selectBreakpointContainer, selectionWrapper);
		selectBreakpointBox.render(selectionWrapper);

		dom.append(container, this.selectBreakpointContainer);

		const closeButton = new Button(this.selectBreakpointContainer, defaultButtonStyles);
		closeButton.label = nls.localize('ok', "OK");
		this.store.add(closeButton.onDidClick(() => this.close(true)));
		this.store.add(closeButton);
	}

	private updateContextInput() {
		if (this.context === Context.TRIGGER_POINT) {
			this.inputContainer.hidden = true;
			this.selectBreakpointContainer.hidden = false;
		} else {
			this.inputContainer.hidden = false;
			this.selectBreakpointContainer.hidden = true;
			this.setInputMode();
			const value = this.getInputValue(this.breakpoint);
			this.input.getModel().setValue(value);
			this.focusInput();
		}
	}

	protected override _doLayout(heightInPixel: number, widthInPixel: number): void {
		this.heightInPx = heightInPixel;
		this.input.layout({ height: heightInPixel, width: widthInPixel - 113 });
		this.centerInputVertically();
	}

	protected override _onWidth(widthInPixel: number): void {
		if (typeof this.heightInPx === 'number') {
			this._doLayout(this.heightInPx, widthInPixel);
		}
	}

	private createBreakpointInput(container: HTMLElement): void {
		const scopedInstatiationService = this.instantiationService.createChild(new ServiceCollection(
			[IPrivateBreakpointWidgetService, this]
		));
		this.store.add(scopedInstatiationService);

		const options = this.createEditorOptions();
		const codeEditorWidgetOptions = getSimpleCodeEditorWidgetOptions();
		this.input = <IActiveCodeEditor>scopedInstatiationService.createInstance(CodeEditorWidget, container, options, codeEditorWidgetOptions);

		CONTEXT_IN_BREAKPOINT_WIDGET.bindTo(this.input.contextKeyService).set(true);
		const model = this.modelService.createModel('', null, uri.parse(`${DEBUG_SCHEME}:${this.editor.getId()}:breakpointinput`), true);
		if (this.editor.hasModel()) {
			model.setLanguage(this.editor.getModel().getLanguageId());
		}
		this.input.setModel(model);
		this.setInputMode();
		this.store.add(model);
		const setDecorations = () => {
			const value = this.input.getModel().getValue();
			const decorations = !!value ? [] : createDecorations(this.themeService.getColorTheme(), this.placeholder);
			this.input.setDecorationsByType('breakpoint-widget', DECORATION_KEY, decorations);
		};
		this.store.add(this.input.getModel().onDidChangeContent(() => setDecorations()));
		this.store.add(this.themeService.onDidColorThemeChange(() => setDecorations()));

		this.store.add(this.languageFeaturesService.completionProvider.register({ scheme: DEBUG_SCHEME, hasAccessToAllModels: true }, {
			_debugDisplayName: 'breakpointWidget',
			provideCompletionItems: (model: ITextModel, position: Position, _context: CompletionContext, token: CancellationToken): Promise<CompletionList> => {
				let suggestionsPromise: Promise<CompletionList>;
				const underlyingModel = this.editor.getModel();
				if (underlyingModel && (this.context === Context.CONDITION || (this.context === Context.LOG_MESSAGE && isPositionInCurlyBracketBlock(this.input)))) {
					suggestionsPromise = provideSuggestionItems(this.languageFeaturesService.completionProvider, underlyingModel, new Position(this.lineNumber, 1), new CompletionOptions(undefined, new Set<CompletionItemKind>().add(CompletionItemKind.Snippet)), _context, token).then(suggestions => {

						let overwriteBefore = 0;
						if (this.context === Context.CONDITION) {
							overwriteBefore = position.column - 1;
						} else {
							// Inside the currly brackets, need to count how many useful characters are behind the position so they would all be taken into account
							const value = this.input.getModel().getValue();
							while ((position.column - 2 - overwriteBefore >= 0) && value[position.column - 2 - overwriteBefore] !== '{' && value[position.column - 2 - overwriteBefore] !== ' ') {
								overwriteBefore++;
							}
						}

						return {
							suggestions: suggestions.items.map(s => {
								s.completion.range = Range.fromPositions(position.delta(0, -overwriteBefore), position);
								return s.completion;
							})
						};
					});
				} else {
					suggestionsPromise = Promise.resolve({ suggestions: [] });
				}

				return suggestionsPromise;
			}
		}));

		this.store.add(this._configurationService.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('editor.fontSize') || e.affectsConfiguration('editor.lineHeight')) {
				this.input.updateOptions(this.createEditorOptions());
				this.centerInputVertically();
			}
		}));
	}

	private createEditorOptions(): IEditorOptions {
		const editorConfig = this._configurationService.getValue<IEditorOptions>('editor');
		const options = getSimpleEditorOptions(this._configurationService);
		options.fontSize = editorConfig.fontSize;
		options.fontFamily = editorConfig.fontFamily;
		options.lineHeight = editorConfig.lineHeight;
		options.fontLigatures = editorConfig.fontLigatures;
		options.ariaLabel = this.placeholder;
		return options;
	}

	private centerInputVertically() {
		if (this.container && typeof this.heightInPx === 'number') {
			const lineHeight = this.input.getOption(EditorOption.lineHeight);
			const lineNum = this.input.getModel().getLineCount();
			const newTopMargin = (this.heightInPx - lineNum * lineHeight) / 2;
			this.inputContainer.style.marginTop = newTopMargin + 'px';
		}
	}

	close(success: boolean): void {
		if (success) {
			// if there is already a breakpoint on this location - remove it.

			let condition: string | undefined = undefined;
			let hitCondition: string | undefined = undefined;
			let logMessage: string | undefined = undefined;
			let triggeredBy: string | undefined = undefined;
			let mode: string | undefined = undefined;
			let modeLabel: string | undefined = undefined;

			this.rememberInput();

			if (this.conditionInput || this.context === Context.CONDITION) {
				condition = this.conditionInput;
			}
			if (this.hitCountInput || this.context === Context.HIT_COUNT) {
				hitCondition = this.hitCountInput;
			}
			if (this.logMessageInput || this.context === Context.LOG_MESSAGE) {
				logMessage = this.logMessageInput;
			}
			if (this.selectModeBox) {
				mode = this.modeInput?.mode;
				modeLabel = this.modeInput?.label;
			}
			if (this.context === Context.TRIGGER_POINT) {
				// currently, trigger points don't support additional conditions:
				condition = undefined;
				hitCondition = undefined;
				logMessage = undefined;
				triggeredBy = this.triggeredByBreakpointInput?.getId();
			}

			if (this.breakpoint) {
				const data = new Map<string, IBreakpointUpdateData>();
				data.set(this.breakpoint.getId(), {
					condition,
					hitCondition,
					logMessage,
					triggeredBy,
					mode,
					modeLabel,
				});
				this.debugService.updateBreakpoints(this.breakpoint.originalUri, data, false).then(undefined, onUnexpectedError);
			} else {
				const model = this.editor.getModel();
				if (model) {
					this.debugService.addBreakpoints(model.uri, [{
						lineNumber: this.lineNumber,
						column: this.column,
						enabled: true,
						condition,
						hitCondition,
						logMessage,
						triggeredBy,
						mode,
						modeLabel,
					}]);
				}
			}
		}

		this.dispose();
	}

	private focusInput() {
		if (this.context === Context.TRIGGER_POINT) {
			this.selectBreakpointBox.focus();
		} else {
			this.input.focus();
		}
	}

	override dispose(): void {
		super.dispose();
		this.input.dispose();
		lifecycle.dispose(this.store);
		setTimeout(() => this.editor.focus(), 0);
	}
}

class AcceptBreakpointWidgetInputAction extends EditorCommand {
	static ID = 'breakpointWidget.action.acceptInput';
	constructor() {
		super({
			id: AcceptBreakpointWidgetInputAction.ID,
			precondition: CONTEXT_BREAKPOINT_WIDGET_VISIBLE,
			kbOpts: {
				kbExpr: CONTEXT_IN_BREAKPOINT_WIDGET,
				primary: KeyCode.Enter,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor): void {
		accessor.get(IPrivateBreakpointWidgetService).close(true);
	}
}

class CloseBreakpointWidgetCommand extends EditorCommand {
	static ID = 'closeBreakpointWidget';
	constructor() {
		super({
			id: CloseBreakpointWidgetCommand.ID,
			precondition: CONTEXT_BREAKPOINT_WIDGET_VISIBLE,
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: KeyCode.Escape,
				secondary: [KeyMod.Shift | KeyCode.Escape],
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): void {
		const debugContribution = editor.getContribution<IBreakpointEditorContribution>(BREAKPOINT_EDITOR_CONTRIBUTION_ID);
		if (debugContribution) {
			// if focus is in outer editor we need to use the debug contribution to close
			return debugContribution.closeBreakpointWidget();
		}

		accessor.get(IPrivateBreakpointWidgetService).close(false);
	}
}

registerEditorCommand(new AcceptBreakpointWidgetInputAction());
registerEditorCommand(new CloseBreakpointWidgetCommand());
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/callStackEditorContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/callStackEditorContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from '../../../../base/common/arrays.js';
import { Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Constants } from '../../../../base/common/uint.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { Range } from '../../../../editor/common/core/range.js';
import { IEditorContribution, IEditorDecorationsCollection } from '../../../../editor/common/editorCommon.js';
import { GlyphMarginLane, IModelDecorationOptions, IModelDeltaDecoration, OverviewRulerLane, TrackedRangeStickiness } from '../../../../editor/common/model.js';
import { localize } from '../../../../nls.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { registerColor } from '../../../../platform/theme/common/colorRegistry.js';
import { themeColorFromId } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { debugStackframe, debugStackframeFocused } from './debugIcons.js';
import { IDebugService, IStackFrame } from '../common/debug.js';
import './media/callStackEditorContribution.css';

export const topStackFrameColor = registerColor('editor.stackFrameHighlightBackground', { dark: '#ffff0033', light: '#ffff6673', hcDark: '#ffff0033', hcLight: '#ffff6673' }, localize('topStackFrameLineHighlight', 'Background color for the highlight of line at the top stack frame position.'));
export const focusedStackFrameColor = registerColor('editor.focusedStackFrameHighlightBackground', { dark: '#7abd7a4d', light: '#cee7ce73', hcDark: '#7abd7a4d', hcLight: '#cee7ce73' }, localize('focusedStackFrameLineHighlight', 'Background color for the highlight of line at focused stack frame position.'));
const stickiness = TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges;

// we need a separate decoration for glyph margin, since we do not want it on each line of a multi line statement.
const TOP_STACK_FRAME_MARGIN: IModelDecorationOptions = {
	description: 'top-stack-frame-margin',
	glyphMarginClassName: ThemeIcon.asClassName(debugStackframe),
	glyphMargin: { position: GlyphMarginLane.Right },
	zIndex: 9999,
	stickiness,
	overviewRuler: {
		position: OverviewRulerLane.Full,
		color: themeColorFromId(topStackFrameColor)
	}
};
const FOCUSED_STACK_FRAME_MARGIN: IModelDecorationOptions = {
	description: 'focused-stack-frame-margin',
	glyphMarginClassName: ThemeIcon.asClassName(debugStackframeFocused),
	glyphMargin: { position: GlyphMarginLane.Right },
	zIndex: 9999,
	stickiness,
	overviewRuler: {
		position: OverviewRulerLane.Full,
		color: themeColorFromId(focusedStackFrameColor)
	}
};
export const TOP_STACK_FRAME_DECORATION: IModelDecorationOptions = {
	description: 'top-stack-frame-decoration',
	isWholeLine: true,
	className: 'debug-top-stack-frame-line',
	stickiness
};
export const FOCUSED_STACK_FRAME_DECORATION: IModelDecorationOptions = {
	description: 'focused-stack-frame-decoration',
	isWholeLine: true,
	className: 'debug-focused-stack-frame-line',
	stickiness
};

export const makeStackFrameColumnDecoration = (noCharactersBefore: boolean): IModelDecorationOptions => ({
	description: 'top-stack-frame-inline-decoration',
	before: {
		content: '\uEB8B',
		inlineClassName: noCharactersBefore ? 'debug-top-stack-frame-column start-of-line' : 'debug-top-stack-frame-column',
		inlineClassNameAffectsLetterSpacing: true
	},
});

export function createDecorationsForStackFrame(stackFrame: IStackFrame, isFocusedSession: boolean, noCharactersBefore: boolean): IModelDeltaDecoration[] {
	// only show decorations for the currently focused thread.
	const result: IModelDeltaDecoration[] = [];
	const columnUntilEOLRange = new Range(stackFrame.range.startLineNumber, stackFrame.range.startColumn, stackFrame.range.startLineNumber, Constants.MAX_SAFE_SMALL_INTEGER);
	const range = new Range(stackFrame.range.startLineNumber, stackFrame.range.startColumn, stackFrame.range.startLineNumber, stackFrame.range.startColumn + 1);

	// compute how to decorate the editor. Different decorations are used if this is a top stack frame, focused stack frame,
	// an exception or a stack frame that did not change the line number (we only decorate the columns, not the whole line).
	const topStackFrame = stackFrame.thread.getTopStackFrame();
	if (stackFrame.getId() === topStackFrame?.getId()) {
		if (isFocusedSession) {
			result.push({
				options: TOP_STACK_FRAME_MARGIN,
				range
			});
		}

		result.push({
			options: TOP_STACK_FRAME_DECORATION,
			range: columnUntilEOLRange
		});

		if (stackFrame.range.startColumn > 1) {
			result.push({
				options: makeStackFrameColumnDecoration(noCharactersBefore),
				range: columnUntilEOLRange
			});
		}
	} else {
		if (isFocusedSession) {
			result.push({
				options: FOCUSED_STACK_FRAME_MARGIN,
				range
			});
		}

		result.push({
			options: FOCUSED_STACK_FRAME_DECORATION,
			range: columnUntilEOLRange
		});
	}

	return result;
}

export class CallStackEditorContribution extends Disposable implements IEditorContribution {
	private decorations: IEditorDecorationsCollection;

	constructor(
		private readonly editor: ICodeEditor,
		@IDebugService private readonly debugService: IDebugService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ILogService private readonly logService: ILogService,
	) {
		super();
		this.decorations = this.editor.createDecorationsCollection();

		const setDecorations = () => this.decorations.set(this.createCallStackDecorations());
		this._register(Event.any(this.debugService.getViewModel().onDidFocusStackFrame, this.debugService.getModel().onDidChangeCallStack)(() => {
			setDecorations();
		}));
		this._register(this.editor.onDidChangeModel(e => {
			if (e.newModelUrl) {
				setDecorations();
			}
		}));
		setDecorations();
	}

	private createCallStackDecorations(): IModelDeltaDecoration[] {
		const editor = this.editor;
		if (!editor.hasModel()) {
			return [];
		}

		const focusedStackFrame = this.debugService.getViewModel().focusedStackFrame;
		const decorations: IModelDeltaDecoration[] = [];
		this.debugService.getModel().getSessions().forEach(s => {
			const isSessionFocused = s === focusedStackFrame?.thread.session;
			s.getAllThreads().forEach(t => {
				if (t.stopped) {
					const callStack = t.getCallStack();
					const stackFrames: IStackFrame[] = [];
					if (callStack.length > 0) {
						// Always decorate top stack frame, and decorate focused stack frame if it is not the top stack frame
						if (focusedStackFrame && !focusedStackFrame.equals(callStack[0])) {
							stackFrames.push(focusedStackFrame);
						}
						stackFrames.push(callStack[0]);
					}

					stackFrames.forEach(candidateStackFrame => {
						if (candidateStackFrame && this.uriIdentityService.extUri.isEqual(candidateStackFrame.source.uri, editor.getModel()?.uri)) {
							if (candidateStackFrame.range.startLineNumber > editor.getModel()?.getLineCount() || candidateStackFrame.range.startLineNumber < 1) {
								this.logService.warn(`CallStackEditorContribution: invalid stack frame line number: ${candidateStackFrame.range.startLineNumber}`);
								return;
							}

							const noCharactersBefore = editor.getModel().getLineFirstNonWhitespaceColumn(candidateStackFrame.range.startLineNumber) >= candidateStackFrame.range.startColumn;
							decorations.push(...createDecorationsForStackFrame(candidateStackFrame, isSessionFocused, noCharactersBefore));
						}
					});
				}
			});
		});

		// Deduplicate same decorations so colors do not stack #109045
		return distinct(decorations, d => `${d.options.className} ${d.options.glyphMarginClassName} ${d.range.startLineNumber} ${d.range.startColumn}`);
	}

	override dispose(): void {
		super.dispose();
		this.decorations.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/callStackView.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/callStackView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { AriaRole } from '../../../../base/browser/ui/aria/aria.js';
import { HighlightedLabel } from '../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import type { IManagedHover } from '../../../../base/browser/ui/hover/hover.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { ITreeCompressionDelegate } from '../../../../base/browser/ui/tree/asyncDataTree.js';
import { ICompressedTreeNode } from '../../../../base/browser/ui/tree/compressedObjectTreeModel.js';
import { ICompressibleTreeRenderer } from '../../../../base/browser/ui/tree/objectTree.js';
import { IAsyncDataSource, ITreeContextMenuEvent, ITreeNode } from '../../../../base/browser/ui/tree/tree.js';
import { Action } from '../../../../base/common/actions.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Event } from '../../../../base/common/event.js';
import { createMatches, FuzzyScore, IMatch } from '../../../../base/common/filters.js';
import { DisposableStore, dispose, IDisposable } from '../../../../base/common/lifecycle.js';
import { posix } from '../../../../base/common/path.js';
import { commonSuffixLength } from '../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { localize } from '../../../../nls.js';
import { ICommandActionTitle, Icon } from '../../../../platform/action/common/action.js';
import { getActionBarActions, getContextMenuActions, MenuEntryActionViewItem, SubmenuEntryActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenuService, MenuId, MenuItemAction, MenuRegistry, registerAction2, SubmenuItemAction } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, ContextKeyExpression, ContextKeyValue, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { WorkbenchCompressibleAsyncDataTree } from '../../../../platform/list/browser/listService.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { asCssVariable, textLinkForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ViewAction, ViewPane } from '../../../browser/parts/views/viewPane.js';
import { IViewletViewOptions } from '../../../browser/parts/views/viewsViewlet.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { CALLSTACK_VIEW_ID, CONTEXT_CALLSTACK_FOCUSED, CONTEXT_CALLSTACK_ITEM_STOPPED, CONTEXT_CALLSTACK_ITEM_TYPE, CONTEXT_CALLSTACK_SESSION_HAS_ONE_THREAD, CONTEXT_CALLSTACK_SESSION_IS_ATTACH, CONTEXT_DEBUG_STATE, CONTEXT_FOCUSED_SESSION_IS_NO_DEBUG, CONTEXT_STACK_FRAME_SUPPORTS_RESTART, getStateLabel, IDebugModel, IDebugService, IDebugSession, IRawStoppedDetails, isFrameDeemphasized, IStackFrame, IThread, State } from '../common/debug.js';
import { StackFrame, Thread, ThreadAndSessionIds } from '../common/debugModel.js';
import { isSessionAttach } from '../common/debugUtils.js';
import { renderViewTree } from './baseDebugView.js';
import { CONTINUE_ID, CONTINUE_LABEL, DISCONNECT_ID, DISCONNECT_LABEL, PAUSE_ID, PAUSE_LABEL, RESTART_LABEL, RESTART_SESSION_ID, STEP_INTO_ID, STEP_INTO_LABEL, STEP_OUT_ID, STEP_OUT_LABEL, STEP_OVER_ID, STEP_OVER_LABEL, STOP_ID, STOP_LABEL } from './debugCommands.js';
import * as icons from './debugIcons.js';
import { createDisconnectMenuItemAction } from './debugToolBar.js';

const $ = dom.$;

type CallStackItem = IStackFrame | IThread | IDebugSession | string | ThreadAndSessionIds | IStackFrame[];

interface ICallStackItemContext {
	sessionId: string;
	threadId?: string;
	frameId?: string;
	frameName?: string;
	frameLocation?: { range: IRange; source: DebugProtocol.Source };
}

function getSessionContext(element: IDebugSession): ICallStackItemContext {
	return {
		sessionId: element.getId()
	};
}

function getThreadContext(element: IThread): ICallStackItemContext {
	return {
		...getSessionContext(element.session),
		threadId: element.getId()
	};
}

function getStackFrameContext(element: StackFrame): ICallStackItemContext {
	return {
		...getThreadContext(element.thread),
		frameId: element.getId(),
		frameName: element.name,
		frameLocation: { range: element.range, source: element.source.raw }
	};
}

export function getContext(element: CallStackItem | null): ICallStackItemContext | undefined {
	if (element instanceof StackFrame) {
		return getStackFrameContext(element);
	} else if (element instanceof Thread) {
		return getThreadContext(element);
	} else if (isDebugSession(element)) {
		return getSessionContext(element);
	} else {
		return undefined;
	}
}

// Extensions depend on this context, should not be changed even though it is not fully deterministic
export function getContextForContributedActions(element: CallStackItem | null): string | number {
	if (element instanceof StackFrame) {
		if (element.source.inMemory) {
			return element.source.raw.path || element.source.reference || element.source.name;
		}

		return element.source.uri.toString();
	}
	if (element instanceof Thread) {
		return element.threadId;
	}
	if (isDebugSession(element)) {
		return element.getId();
	}

	return '';
}

export function getSpecificSourceName(stackFrame: IStackFrame): string {
	// To reduce flashing of the path name and the way we fetch stack frames
	// We need to compute the source name based on the other frames in the stale call stack
	let callStack = (<Thread>stackFrame.thread).getStaleCallStack();
	callStack = callStack.length > 0 ? callStack : stackFrame.thread.getCallStack();
	const otherSources = callStack.map(sf => sf.source).filter(s => s !== stackFrame.source);
	let suffixLength = 0;
	otherSources.forEach(s => {
		if (s.name === stackFrame.source.name) {
			suffixLength = Math.max(suffixLength, commonSuffixLength(stackFrame.source.uri.path, s.uri.path));
		}
	});
	if (suffixLength === 0) {
		return stackFrame.source.name;
	}

	const from = Math.max(0, stackFrame.source.uri.path.lastIndexOf(posix.sep, stackFrame.source.uri.path.length - suffixLength - 1));
	return (from > 0 ? '...' : '') + stackFrame.source.uri.path.substring(from);
}

async function expandTo(session: IDebugSession, tree: WorkbenchCompressibleAsyncDataTree<IDebugModel, CallStackItem, FuzzyScore>): Promise<void> {
	if (session.parentSession) {
		await expandTo(session.parentSession, tree);
	}
	await tree.expand(session);
}

export class CallStackView extends ViewPane {
	private stateMessage!: HTMLSpanElement;
	private stateMessageLabel!: HTMLSpanElement;
	private stateMessageLabelHover!: IManagedHover;
	private onCallStackChangeScheduler: RunOnceScheduler;
	private needsRefresh = false;
	private ignoreSelectionChangedEvent = false;
	private ignoreFocusStackFrameEvent = false;

	private dataSource!: CallStackDataSource;
	private tree!: WorkbenchCompressibleAsyncDataTree<IDebugModel, CallStackItem, FuzzyScore>;
	private autoExpandedSessions = new Set<IDebugSession>();
	private selectionNeedsUpdate = false;

	constructor(
		private options: IViewletViewOptions,
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
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);

		// Create scheduler to prevent unnecessary flashing of tree when reacting to changes
		this.onCallStackChangeScheduler = this._register(new RunOnceScheduler(async () => {
			// Only show the global pause message if we do not display threads.
			// Otherwise there will be a pause message per thread and there is no need for a global one.
			const sessions = this.debugService.getModel().getSessions();
			if (sessions.length === 0) {
				this.autoExpandedSessions.clear();
			}

			const thread = sessions.length === 1 && sessions[0].getAllThreads().length === 1 ? sessions[0].getAllThreads()[0] : undefined;
			const stoppedDetails = sessions.length === 1 ? sessions[0].getStoppedDetails() : undefined;
			if (stoppedDetails && (thread || typeof stoppedDetails.threadId !== 'number')) {
				this.stateMessageLabel.textContent = stoppedDescription(stoppedDetails);
				this.stateMessageLabelHover.update(stoppedText(stoppedDetails));
				this.stateMessageLabel.classList.toggle('exception', stoppedDetails.reason === 'exception');
				this.stateMessage.hidden = false;
			} else if (sessions.length === 1 && sessions[0].state === State.Running) {
				this.stateMessageLabel.textContent = localize({ key: 'running', comment: ['indicates state'] }, "Running");
				this.stateMessageLabelHover.update(sessions[0].getLabel());
				this.stateMessageLabel.classList.remove('exception');
				this.stateMessage.hidden = false;
			} else {
				this.stateMessage.hidden = true;
			}
			this.updateActions();

			this.needsRefresh = false;
			await this.tree.updateChildren();
			try {
				const toExpand = new Set<IDebugSession>();
				sessions.forEach(s => {
					// Automatically expand sessions that have children, but only do this once.
					if (s.parentSession && !this.autoExpandedSessions.has(s.parentSession)) {
						toExpand.add(s.parentSession);
					}
				});
				for (const session of toExpand) {
					await expandTo(session, this.tree);
					this.autoExpandedSessions.add(session);
				}
			} catch (e) {
				// Ignore tree expand errors if element no longer present
			}
			if (this.selectionNeedsUpdate) {
				this.selectionNeedsUpdate = false;
				await this.updateTreeSelection();
			}
		}, 50));
	}

	protected override renderHeaderTitle(container: HTMLElement): void {
		super.renderHeaderTitle(container, this.options.title);

		this.stateMessage = dom.append(container, $('span.call-stack-state-message'));
		this.stateMessage.hidden = true;
		this.stateMessageLabel = dom.append(this.stateMessage, $('span.label'));
		this.stateMessageLabelHover = this._register(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.stateMessage, ''));
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);
		this.element.classList.add('debug-pane');
		container.classList.add('debug-call-stack');
		const treeContainer = renderViewTree(container);

		this.dataSource = new CallStackDataSource(this.debugService);
		this.tree = this.instantiationService.createInstance(WorkbenchCompressibleAsyncDataTree<IDebugModel, CallStackItem, FuzzyScore>, 'CallStackView', treeContainer, new CallStackDelegate(), new CallStackCompressionDelegate(this.debugService), [
			this.instantiationService.createInstance(SessionsRenderer),
			this.instantiationService.createInstance(ThreadsRenderer),
			this.instantiationService.createInstance(StackFramesRenderer),
			this.instantiationService.createInstance(ErrorsRenderer),
			new LoadMoreRenderer(),
			new ShowMoreRenderer()
		], this.dataSource, {
			accessibilityProvider: new CallStackAccessibilityProvider(),
			compressionEnabled: true,
			autoExpandSingleChildren: true,
			identityProvider: {
				getId: (element: CallStackItem) => {
					if (typeof element === 'string') {
						return element;
					}
					if (element instanceof Array) {
						return `showMore ${element[0].getId()}`;
					}

					return element.getId();
				}
			},
			keyboardNavigationLabelProvider: {
				getKeyboardNavigationLabel: (e: CallStackItem) => {
					if (isDebugSession(e)) {
						return e.getLabel();
					}
					if (e instanceof Thread) {
						return `${e.name} ${e.stateLabel}`;
					}
					if (e instanceof StackFrame || typeof e === 'string') {
						return e;
					}
					if (e instanceof ThreadAndSessionIds) {
						return LoadMoreRenderer.LABEL;
					}

					return localize('showMoreStackFrames2', "Show More Stack Frames");
				},
				getCompressedNodeKeyboardNavigationLabel: (e: CallStackItem[]) => {
					const firstItem = e[0];
					if (isDebugSession(firstItem)) {
						return firstItem.getLabel();
					}
					return '';
				}
			},
			expandOnlyOnTwistieClick: true,
			overrideStyles: this.getLocationBasedColors().listOverrideStyles
		});

		CONTEXT_CALLSTACK_FOCUSED.bindTo(this.tree.contextKeyService);

		this.tree.setInput(this.debugService.getModel());
		this._register(this.tree);
		this._register(this.tree.onDidOpen(async e => {
			if (this.ignoreSelectionChangedEvent) {
				return;
			}

			const focusStackFrame = (stackFrame: IStackFrame | undefined, thread: IThread | undefined, session: IDebugSession, options: { explicit?: boolean; preserveFocus?: boolean; sideBySide?: boolean; pinned?: boolean } = {}) => {
				this.ignoreFocusStackFrameEvent = true;
				try {
					this.debugService.focusStackFrame(stackFrame, thread, session, { ...options, ...{ explicit: true } });
				} finally {
					this.ignoreFocusStackFrameEvent = false;
				}
			};

			const element = e.element;
			if (element instanceof StackFrame) {
				const opts = {
					preserveFocus: e.editorOptions.preserveFocus,
					sideBySide: e.sideBySide,
					pinned: e.editorOptions.pinned
				};
				focusStackFrame(element, element.thread, element.thread.session, opts);
			}
			if (element instanceof Thread) {
				focusStackFrame(undefined, element, element.session);
			}
			if (isDebugSession(element)) {
				focusStackFrame(undefined, undefined, element);
			}
			if (element instanceof ThreadAndSessionIds) {
				const session = this.debugService.getModel().getSession(element.sessionId);
				const thread = session && session.getThread(element.threadId);
				if (thread) {
					const totalFrames = thread.stoppedDetails?.totalFrames;
					const remainingFramesCount = typeof totalFrames === 'number' ? (totalFrames - thread.getCallStack().length) : undefined;
					// Get all the remaining frames
					await (<Thread>thread).fetchCallStack(remainingFramesCount);
					await this.tree.updateChildren();
				}
			}
			if (element instanceof Array) {
				element.forEach(sf => this.dataSource.deemphasizedStackFramesToShow.add(sf));
				this.tree.updateChildren();
			}
		}));

		this._register(this.debugService.getModel().onDidChangeCallStack(() => {
			if (!this.isBodyVisible()) {
				this.needsRefresh = true;
				return;
			}

			if (!this.onCallStackChangeScheduler.isScheduled()) {
				this.onCallStackChangeScheduler.schedule();
			}
		}));
		const onFocusChange = Event.any<unknown>(this.debugService.getViewModel().onDidFocusStackFrame, this.debugService.getViewModel().onDidFocusSession);
		this._register(onFocusChange(async () => {
			if (this.ignoreFocusStackFrameEvent) {
				return;
			}
			if (!this.isBodyVisible()) {
				this.needsRefresh = true;
				this.selectionNeedsUpdate = true;
				return;
			}
			if (this.onCallStackChangeScheduler.isScheduled()) {
				this.selectionNeedsUpdate = true;
				return;
			}

			await this.updateTreeSelection();
		}));
		this._register(this.tree.onContextMenu(e => this.onContextMenu(e)));

		// Schedule the update of the call stack tree if the viewlet is opened after a session started #14684
		if (this.debugService.state === State.Stopped) {
			this.onCallStackChangeScheduler.schedule(0);
		}

		this._register(this.onDidChangeBodyVisibility(visible => {
			if (visible && this.needsRefresh) {
				this.onCallStackChangeScheduler.schedule();
			}
		}));

		this._register(this.debugService.onDidNewSession(s => {
			const sessionListeners: IDisposable[] = [];
			sessionListeners.push(s.onDidChangeName(() => {
				// this.tree.updateChildren is called on a delay after a session is added,
				// so don't rerender if the tree doesn't have the node yet
				if (this.tree.hasNode(s)) {
					this.tree.rerender(s);
				}
			}));
			sessionListeners.push(s.onDidEndAdapter(() => dispose(sessionListeners)));
			if (s.parentSession) {
				// A session we already expanded has a new child session, allow to expand it again.
				this.autoExpandedSessions.delete(s.parentSession);
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

	private async updateTreeSelection(): Promise<void> {
		if (!this.tree || !this.tree.getInput()) {
			// Tree not initialized yet
			return;
		}

		const updateSelectionAndReveal = (element: IStackFrame | IDebugSession) => {
			this.ignoreSelectionChangedEvent = true;
			try {
				this.tree.setSelection([element]);
				// If the element is outside of the screen bounds,
				// position it in the middle
				if (this.tree.getRelativeTop(element) === null) {
					this.tree.reveal(element, 0.5);
				} else {
					this.tree.reveal(element);
				}
			} catch (e) { }
			finally {
				this.ignoreSelectionChangedEvent = false;
			}
		};

		const thread = this.debugService.getViewModel().focusedThread;
		const session = this.debugService.getViewModel().focusedSession;
		const stackFrame = this.debugService.getViewModel().focusedStackFrame;
		if (!thread) {
			if (!session) {
				this.tree.setSelection([]);
			} else {
				updateSelectionAndReveal(session);
			}
		} else {
			// Ignore errors from this expansions because we are not aware if we rendered the threads and sessions or we hide them to declutter the view
			try {
				await expandTo(thread.session, this.tree);
			} catch (e) { }
			try {
				await this.tree.expand(thread);
			} catch (e) { }

			const toReveal = stackFrame || session;
			if (toReveal) {
				updateSelectionAndReveal(toReveal);
			}
		}
	}

	private onContextMenu(e: ITreeContextMenuEvent<CallStackItem>): void {
		const element = e.element;
		let overlay: [string, ContextKeyValue][] = [];
		if (isDebugSession(element)) {
			overlay = getSessionContextOverlay(element);
		} else if (element instanceof Thread) {
			overlay = getThreadContextOverlay(element);
		} else if (element instanceof StackFrame) {
			overlay = getStackFrameContextOverlay(element);
		}

		const contextKeyService = this.contextKeyService.createOverlay(overlay);
		const menu = this.menuService.getMenuActions(MenuId.DebugCallStackContext, contextKeyService, { arg: getContextForContributedActions(element), shouldForwardArgs: true });
		const result = getContextMenuActions(menu, 'inline');
		this.contextMenuService.showContextMenu({
			getAnchor: () => e.anchor,
			getActions: () => result.secondary,
			getActionsContext: () => getContext(element)
		});
	}
}

interface IThreadTemplateData {
	thread: HTMLElement;
	name: HTMLElement;
	stateLabel: HTMLSpanElement;
	label: HighlightedLabel;
	actionBar: ActionBar;
	elementDisposable: DisposableStore;
	templateDisposable: IDisposable;
}

interface ISessionTemplateData {
	session: HTMLElement;
	name: HTMLElement;
	stateLabel: HTMLSpanElement;
	label: HighlightedLabel;
	actionBar: ActionBar;
	elementDisposable: DisposableStore;
	templateDisposable: IDisposable;
}

interface IErrorTemplateData {
	label: HTMLElement;
	templateDisposable: DisposableStore;
}

interface ILabelTemplateData {
	label: HTMLElement;
}

interface IStackFrameTemplateData {
	stackFrame: HTMLElement;
	file: HTMLElement;
	fileName: HTMLElement;
	lineNumber: HTMLElement;
	label: HighlightedLabel;
	actionBar: ActionBar;
	templateDisposable: DisposableStore;
	elementDisposables: DisposableStore;
}

function getSessionContextOverlay(session: IDebugSession): [string, ContextKeyValue][] {
	return [
		[CONTEXT_CALLSTACK_ITEM_TYPE.key, 'session'],
		[CONTEXT_CALLSTACK_SESSION_IS_ATTACH.key, isSessionAttach(session)],
		[CONTEXT_CALLSTACK_ITEM_STOPPED.key, session.state === State.Stopped],
		[CONTEXT_CALLSTACK_SESSION_HAS_ONE_THREAD.key, session.getAllThreads().length === 1],
	];
}

class SessionsRenderer implements ICompressibleTreeRenderer<IDebugSession, FuzzyScore, ISessionTemplateData> {
	static readonly ID = 'session';

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IHoverService private readonly hoverService: IHoverService,
		@IMenuService private readonly menuService: IMenuService,
	) { }

	get templateId(): string {
		return SessionsRenderer.ID;
	}

	renderTemplate(container: HTMLElement): ISessionTemplateData {
		const session = dom.append(container, $('.session'));
		dom.append(session, $(ThemeIcon.asCSSSelector(icons.callstackViewSession)));
		const name = dom.append(session, $('.name'));
		const stateLabel = dom.append(session, $('span.state.label.monaco-count-badge.long'));
		const templateDisposable = new DisposableStore();
		const label = templateDisposable.add(new HighlightedLabel(name));

		const stopActionViewItemDisposables = templateDisposable.add(new DisposableStore());
		const actionBar = templateDisposable.add(new ActionBar(session, {
			actionViewItemProvider: (action, options) => {
				if ((action.id === STOP_ID || action.id === DISCONNECT_ID) && action instanceof MenuItemAction) {
					stopActionViewItemDisposables.clear();
					const item = this.instantiationService.invokeFunction(accessor => createDisconnectMenuItemAction(action as MenuItemAction, stopActionViewItemDisposables, accessor, { ...options, menuAsChild: false }));
					if (item) {
						return item;
					}
				}

				if (action instanceof MenuItemAction) {
					return this.instantiationService.createInstance(MenuEntryActionViewItem, action, { hoverDelegate: options.hoverDelegate });
				} else if (action instanceof SubmenuItemAction) {
					return this.instantiationService.createInstance(SubmenuEntryActionViewItem, action, { hoverDelegate: options.hoverDelegate });
				}

				return undefined;
			}
		}));

		const elementDisposable = templateDisposable.add(new DisposableStore());
		return { session, name, stateLabel, label, actionBar, elementDisposable, templateDisposable };
	}

	renderElement(element: ITreeNode<IDebugSession, FuzzyScore>, _: number, data: ISessionTemplateData): void {
		this.doRenderElement(element.element, createMatches(element.filterData), data);
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<IDebugSession>, FuzzyScore>, _index: number, templateData: ISessionTemplateData): void {
		const lastElement = node.element.elements[node.element.elements.length - 1];
		const matches = createMatches(node.filterData);
		this.doRenderElement(lastElement, matches, templateData);
	}

	private doRenderElement(session: IDebugSession, matches: IMatch[], data: ISessionTemplateData): void {
		const sessionHover = data.elementDisposable.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.session, localize({ key: 'session', comment: ['Session is a noun'] }, "Session")));
		data.label.set(session.getLabel(), matches);
		const stoppedDetails = session.getStoppedDetails();
		const thread = session.getAllThreads().find(t => t.stopped);

		const contextKeyService = this.contextKeyService.createOverlay(getSessionContextOverlay(session));
		const menu = data.elementDisposable.add(this.menuService.createMenu(MenuId.DebugCallStackContext, contextKeyService));

		const setupActionBar = () => {
			data.actionBar.clear();

			const { primary } = getActionBarActions(menu.getActions({ arg: getContextForContributedActions(session), shouldForwardArgs: true }), 'inline');
			data.actionBar.push(primary, { icon: true, label: false });
			// We need to set our internal context on the action bar, since our commands depend on that one
			// While the external context our extensions rely on
			data.actionBar.context = getContext(session);
		};
		data.elementDisposable.add(menu.onDidChange(() => setupActionBar()));
		setupActionBar();

		data.stateLabel.style.display = '';

		if (stoppedDetails) {
			data.stateLabel.textContent = stoppedDescription(stoppedDetails);
			sessionHover.update(`${session.getLabel()}: ${stoppedText(stoppedDetails)}`);
			data.stateLabel.classList.toggle('exception', stoppedDetails.reason === 'exception');
		} else if (thread && thread.stoppedDetails) {
			data.stateLabel.textContent = stoppedDescription(thread.stoppedDetails);
			sessionHover.update(`${session.getLabel()}: ${stoppedText(thread.stoppedDetails)}`);
			data.stateLabel.classList.toggle('exception', thread.stoppedDetails.reason === 'exception');
		} else {
			data.stateLabel.textContent = localize({ key: 'running', comment: ['indicates state'] }, "Running");
			data.stateLabel.classList.remove('exception');
		}
	}

	disposeTemplate(templateData: ISessionTemplateData): void {
		templateData.templateDisposable.dispose();
	}

	disposeElement(_element: ITreeNode<IDebugSession, FuzzyScore>, _: number, templateData: ISessionTemplateData): void {
		templateData.elementDisposable.clear();
	}

	disposeCompressedElements(node: ITreeNode<ICompressedTreeNode<IDebugSession>, FuzzyScore>, index: number, templateData: ISessionTemplateData): void {
		templateData.elementDisposable.clear();
	}
}

function getThreadContextOverlay(thread: IThread): [string, ContextKeyValue][] {
	return [
		[CONTEXT_CALLSTACK_ITEM_TYPE.key, 'thread'],
		[CONTEXT_CALLSTACK_ITEM_STOPPED.key, thread.stopped]
	];
}

class ThreadsRenderer implements ICompressibleTreeRenderer<IThread, FuzzyScore, IThreadTemplateData> {
	static readonly ID = 'thread';

	constructor(
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IHoverService private readonly hoverService: IHoverService,
		@IMenuService private readonly menuService: IMenuService,
	) { }

	get templateId(): string {
		return ThreadsRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IThreadTemplateData {
		const thread = dom.append(container, $('.thread'));
		const name = dom.append(thread, $('.name'));
		const stateLabel = dom.append(thread, $('span.state.label.monaco-count-badge.long'));

		const templateDisposable = new DisposableStore();
		const label = templateDisposable.add(new HighlightedLabel(name));

		const actionBar = templateDisposable.add(new ActionBar(thread));
		const elementDisposable = templateDisposable.add(new DisposableStore());

		return { thread, name, stateLabel, label, actionBar, elementDisposable, templateDisposable };
	}

	renderElement(element: ITreeNode<IThread, FuzzyScore>, _index: number, data: IThreadTemplateData): void {
		const thread = element.element;
		data.elementDisposable.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.thread, thread.name));
		data.label.set(thread.name, createMatches(element.filterData));
		data.stateLabel.textContent = thread.stateLabel;
		data.stateLabel.classList.toggle('exception', thread.stoppedDetails?.reason === 'exception');

		const contextKeyService = this.contextKeyService.createOverlay(getThreadContextOverlay(thread));
		const menu = data.elementDisposable.add(this.menuService.createMenu(MenuId.DebugCallStackContext, contextKeyService));

		const setupActionBar = () => {
			data.actionBar.clear();

			const { primary } = getActionBarActions(menu.getActions({ arg: getContextForContributedActions(thread), shouldForwardArgs: true }), 'inline');
			data.actionBar.push(primary, { icon: true, label: false });
			// We need to set our internal context on the action bar, since our commands depend on that one
			// While the external context our extensions rely on
			data.actionBar.context = getContext(thread);
		};
		data.elementDisposable.add(menu.onDidChange(() => setupActionBar()));
		setupActionBar();
	}

	renderCompressedElements(_node: ITreeNode<ICompressedTreeNode<IThread>, FuzzyScore>, _index: number, _templateData: IThreadTemplateData): void {
		throw new Error('Method not implemented.');
	}

	disposeElement(_element: ITreeNode<IThread, FuzzyScore>, _index: number, templateData: IThreadTemplateData): void {
		templateData.elementDisposable.clear();
	}

	disposeTemplate(templateData: IThreadTemplateData): void {
		templateData.templateDisposable.dispose();
	}
}

function getStackFrameContextOverlay(stackFrame: IStackFrame): [string, ContextKeyValue][] {
	return [
		[CONTEXT_CALLSTACK_ITEM_TYPE.key, 'stackFrame'],
		[CONTEXT_STACK_FRAME_SUPPORTS_RESTART.key, stackFrame.canRestart]
	];
}

class StackFramesRenderer implements ICompressibleTreeRenderer<IStackFrame, FuzzyScore, IStackFrameTemplateData> {
	static readonly ID = 'stackFrame';

	constructor(
		@IHoverService private readonly hoverService: IHoverService,
		@ILabelService private readonly labelService: ILabelService,
		@INotificationService private readonly notificationService: INotificationService,
	) { }

	get templateId(): string {
		return StackFramesRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IStackFrameTemplateData {
		const stackFrame = dom.append(container, $('.stack-frame'));
		const labelDiv = dom.append(stackFrame, $('span.label.expression'));
		const file = dom.append(stackFrame, $('.file'));
		const fileName = dom.append(file, $('span.file-name'));
		const wrapper = dom.append(file, $('span.line-number-wrapper'));
		const lineNumber = dom.append(wrapper, $('span.line-number.monaco-count-badge'));

		const templateDisposable = new DisposableStore();
		const elementDisposables = new DisposableStore();
		templateDisposable.add(elementDisposables);
		const label = templateDisposable.add(new HighlightedLabel(labelDiv));
		const actionBar = templateDisposable.add(new ActionBar(stackFrame));

		return { file, fileName, label, lineNumber, stackFrame, actionBar, templateDisposable, elementDisposables };
	}

	renderElement(element: ITreeNode<IStackFrame, FuzzyScore>, index: number, data: IStackFrameTemplateData): void {
		const stackFrame = element.element;
		data.stackFrame.classList.toggle('disabled', !stackFrame.source || !stackFrame.source.available || isFrameDeemphasized(stackFrame));
		data.stackFrame.classList.toggle('label', stackFrame.presentationHint === 'label');
		const hasActions = !!stackFrame.thread.session.capabilities.supportsRestartFrame && stackFrame.presentationHint !== 'label' && stackFrame.presentationHint !== 'subtle' && stackFrame.canRestart;
		data.stackFrame.classList.toggle('has-actions', hasActions);

		let title = stackFrame.source.inMemory ? stackFrame.source.uri.path : this.labelService.getUriLabel(stackFrame.source.uri);
		if (stackFrame.source.raw.origin) {
			title += `\n${stackFrame.source.raw.origin}`;
		}
		data.elementDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.file, title));

		data.label.set(stackFrame.name, createMatches(element.filterData), stackFrame.name);
		data.fileName.textContent = getSpecificSourceName(stackFrame);
		if (stackFrame.range.startLineNumber !== undefined) {
			data.lineNumber.textContent = `${stackFrame.range.startLineNumber}`;
			if (stackFrame.range.startColumn) {
				data.lineNumber.textContent += `:${stackFrame.range.startColumn}`;
			}
			data.lineNumber.classList.remove('unavailable');
		} else {
			data.lineNumber.classList.add('unavailable');
		}

		data.actionBar.clear();
		if (hasActions) {
			const action = data.elementDisposables.add(new Action('debug.callStack.restartFrame', localize('restartFrame', "Restart Frame"), ThemeIcon.asClassName(icons.debugRestartFrame), true, async () => {
				try {
					await stackFrame.restart();
				} catch (e) {
					this.notificationService.error(e);
				}
			}));
			data.actionBar.push(action, { icon: true, label: false });
		}
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<IStackFrame>, FuzzyScore>, index: number, templateData: IStackFrameTemplateData): void {
		throw new Error('Method not implemented.');
	}
	disposeElement(element: ITreeNode<IStackFrame, FuzzyScore>, index: number, templateData: IStackFrameTemplateData): void {
		templateData.elementDisposables.clear();
	}

	disposeTemplate(templateData: IStackFrameTemplateData): void {
		templateData.templateDisposable.dispose();
	}
}

class ErrorsRenderer implements ICompressibleTreeRenderer<string, FuzzyScore, IErrorTemplateData> {
	static readonly ID = 'error';

	get templateId(): string {
		return ErrorsRenderer.ID;
	}

	constructor(
		@IHoverService private readonly hoverService: IHoverService
	) {
	}

	renderTemplate(container: HTMLElement): IErrorTemplateData {
		const label = dom.append(container, $('.error'));

		return { label, templateDisposable: new DisposableStore() };
	}

	renderElement(element: ITreeNode<string, FuzzyScore>, index: number, data: IErrorTemplateData): void {
		const error = element.element;
		data.label.textContent = error;
		data.templateDisposable.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.label, error));
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<string>, FuzzyScore>, index: number, templateData: IErrorTemplateData): void {
		throw new Error('Method not implemented.');
	}

	disposeTemplate(templateData: IErrorTemplateData): void {
		// noop
	}
}

class LoadMoreRenderer implements ICompressibleTreeRenderer<ThreadAndSessionIds, FuzzyScore, ILabelTemplateData> {
	static readonly ID = 'loadMore';
	static readonly LABEL = localize('loadAllStackFrames', "Load More Stack Frames");

	constructor() { }

	get templateId(): string {
		return LoadMoreRenderer.ID;
	}

	renderTemplate(container: HTMLElement): ILabelTemplateData {
		const label = dom.append(container, $('.load-all'));
		label.style.color = asCssVariable(textLinkForeground);
		return { label };
	}

	renderElement(element: ITreeNode<ThreadAndSessionIds, FuzzyScore>, index: number, data: ILabelTemplateData): void {
		data.label.textContent = LoadMoreRenderer.LABEL;
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<ThreadAndSessionIds>, FuzzyScore>, index: number, templateData: ILabelTemplateData): void {
		throw new Error('Method not implemented.');
	}

	disposeTemplate(templateData: ILabelTemplateData): void {
		// noop
	}
}

class ShowMoreRenderer implements ICompressibleTreeRenderer<IStackFrame[], FuzzyScore, ILabelTemplateData> {
	static readonly ID = 'showMore';

	constructor() { }


	get templateId(): string {
		return ShowMoreRenderer.ID;
	}

	renderTemplate(container: HTMLElement): ILabelTemplateData {
		const label = dom.append(container, $('.show-more'));
		label.style.color = asCssVariable(textLinkForeground);
		return { label };
	}

	renderElement(element: ITreeNode<IStackFrame[], FuzzyScore>, index: number, data: ILabelTemplateData): void {
		const stackFrames = element.element;
		if (stackFrames.every(sf => !!(sf.source && sf.source.origin && sf.source.origin === stackFrames[0].source.origin))) {
			data.label.textContent = localize('showMoreAndOrigin', "Show {0} More: {1}", stackFrames.length, stackFrames[0].source.origin);
		} else {
			data.label.textContent = localize('showMoreStackFrames', "Show {0} More Stack Frames", stackFrames.length);
		}
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<IStackFrame[]>, FuzzyScore>, index: number, templateData: ILabelTemplateData): void {
		throw new Error('Method not implemented.');
	}

	disposeTemplate(templateData: ILabelTemplateData): void {
		// noop
	}
}

class CallStackDelegate implements IListVirtualDelegate<CallStackItem> {

	getHeight(element: CallStackItem): number {
		if (element instanceof StackFrame && element.presentationHint === 'label') {
			return 16;
		}
		if (element instanceof ThreadAndSessionIds || element instanceof Array) {
			return 16;
		}

		return 22;
	}

	getTemplateId(element: CallStackItem): string {
		if (isDebugSession(element)) {
			return SessionsRenderer.ID;
		}
		if (element instanceof Thread) {
			return ThreadsRenderer.ID;
		}
		if (element instanceof StackFrame) {
			return StackFramesRenderer.ID;
		}
		if (typeof element === 'string') {
			return ErrorsRenderer.ID;
		}
		if (element instanceof ThreadAndSessionIds) {
			return LoadMoreRenderer.ID;
		}

		// element instanceof Array
		return ShowMoreRenderer.ID;
	}
}

function stoppedText(stoppedDetails: IRawStoppedDetails): string {
	return stoppedDetails.text ?? stoppedDescription(stoppedDetails);
}

function stoppedDescription(stoppedDetails: IRawStoppedDetails): string {
	return stoppedDetails.description ||
		(stoppedDetails.reason ? localize({ key: 'pausedOn', comment: ['indicates reason for program being paused'] }, "Paused on {0}", stoppedDetails.reason) : localize('paused', "Paused"));
}

function isDebugModel(obj: unknown): obj is IDebugModel {
	return !!obj && typeof (obj as IDebugModel).getSessions === 'function';
}

function isDebugSession(obj: unknown): obj is IDebugSession {
	return !!obj && typeof (obj as IDebugSession).getAllThreads === 'function';
}

class CallStackDataSource implements IAsyncDataSource<IDebugModel, CallStackItem> {
	deemphasizedStackFramesToShow = new WeakSet<IStackFrame>();

	constructor(private debugService: IDebugService) { }

	hasChildren(element: IDebugModel | CallStackItem): boolean {
		if (isDebugSession(element)) {
			const threads = element.getAllThreads();
			return (threads.length > 1) || (threads.length === 1 && threads[0].stopped) || !!(this.debugService.getModel().getSessions().find(s => s.parentSession === element));
		}

		return isDebugModel(element) || (element instanceof Thread && element.stopped);
	}

	async getChildren(element: IDebugModel | CallStackItem): Promise<CallStackItem[]> {
		if (isDebugModel(element)) {
			const sessions = element.getSessions();
			if (sessions.length === 0) {
				return Promise.resolve([]);
			}
			if (sessions.length > 1 || this.debugService.getViewModel().isMultiSessionView()) {
				return Promise.resolve(sessions.filter(s => !s.parentSession));
			}

			const threads = sessions[0].getAllThreads();
			// Only show the threads in the call stack if there is more than 1 thread.
			return threads.length === 1 ? this.getThreadChildren(<Thread>threads[0]) : Promise.resolve(threads);
		} else if (isDebugSession(element)) {
			const childSessions = this.debugService.getModel().getSessions().filter(s => s.parentSession === element);
			const threads: CallStackItem[] = element.getAllThreads();
			if (threads.length === 1) {
				// Do not show thread when there is only one to be compact.
				const children = await this.getThreadChildren(<Thread>threads[0]);
				return children.concat(childSessions);
			}

			return Promise.resolve(threads.concat(childSessions));
		} else {
			return this.getThreadChildren(<Thread>element);
		}
	}

	private getThreadChildren(thread: Thread): Promise<CallStackItem[]> {
		return this.getThreadCallstack(thread).then(children => {
			// Check if some stack frames should be hidden under a parent element since they are deemphasized
			const result: CallStackItem[] = [];
			children.forEach((child, index) => {
				if (child instanceof StackFrame && child.source && isFrameDeemphasized(child)) {
					// Check if the user clicked to show the deemphasized source
					if (!this.deemphasizedStackFramesToShow.has(child)) {
						if (result.length) {
							const last = result[result.length - 1];
							if (last instanceof Array) {
								// Collect all the stackframes that will be "collapsed"
								last.push(child);
								return;
							}
						}

						const nextChild = index < children.length - 1 ? children[index + 1] : undefined;
						if (nextChild instanceof StackFrame && nextChild.source && isFrameDeemphasized(nextChild)) {
							// Start collecting stackframes that will be "collapsed"
							result.push([child]);
							return;
						}
					}
				}

				result.push(child);
			});

			return result;
		});
	}

	private async getThreadCallstack(thread: Thread): Promise<Array<IStackFrame | string | ThreadAndSessionIds>> {
		let callStack: Array<IStackFrame | string | ThreadAndSessionIds> = thread.getCallStack();
		if (!callStack || !callStack.length) {
			await thread.fetchCallStack();
			callStack = thread.getCallStack();
		}

		if (callStack.length === 1 && thread.session.capabilities.supportsDelayedStackTraceLoading && thread.stoppedDetails && thread.stoppedDetails.totalFrames && thread.stoppedDetails.totalFrames > 1) {
			// To reduce flashing of the call stack view simply append the stale call stack
			// once we have the correct data the tree will refresh and we will no longer display it.
			callStack = callStack.concat(thread.getStaleCallStack().slice(1));
		}

		if (thread.stoppedDetails && thread.stoppedDetails.framesErrorMessage) {
			callStack = callStack.concat([thread.stoppedDetails.framesErrorMessage]);
		}
		if (!thread.reachedEndOfCallStack && thread.stoppedDetails) {
			callStack = callStack.concat([new ThreadAndSessionIds(thread.session.getId(), thread.threadId)]);
		}

		return callStack;
	}
}

class CallStackAccessibilityProvider implements IListAccessibilityProvider<CallStackItem> {

	getWidgetAriaLabel(): string {
		return localize({ comment: ['Debug is a noun in this context, not a verb.'], key: 'callStackAriaLabel' }, "Debug Call Stack");
	}

	getWidgetRole(): AriaRole {
		// Use treegrid as a role since each element can have additional actions inside #146210
		return 'treegrid';
	}

	getRole(_element: CallStackItem): AriaRole | undefined {
		return 'row';
	}

	getAriaLabel(element: CallStackItem): string {
		if (element instanceof Thread) {
			return localize({ key: 'threadAriaLabel', comment: ['Placeholders stand for the thread name and the thread state.For example "Thread 1" and "Stopped'] }, "Thread {0} {1}", element.name, element.stateLabel);
		}
		if (element instanceof StackFrame) {
			return localize('stackFrameAriaLabel', "Stack Frame {0}, line {1}, {2}", element.name, element.range.startLineNumber, getSpecificSourceName(element));
		}
		if (isDebugSession(element)) {
			const thread = element.getAllThreads().find(t => t.stopped);
			const state = thread ? thread.stateLabel : localize({ key: 'running', comment: ['indicates state'] }, "Running");
			return localize({ key: 'sessionLabel', comment: ['Placeholders stand for the session name and the session state. For example "Launch Program" and "Running"'] }, "Session {0} {1}", element.getLabel(), state);
		}
		if (typeof element === 'string') {
			return element;
		}
		if (element instanceof Array) {
			return localize('showMoreStackFrames', "Show {0} More Stack Frames", element.length);
		}

		// element instanceof ThreadAndSessionIds
		return LoadMoreRenderer.LABEL;
	}
}

class CallStackCompressionDelegate implements ITreeCompressionDelegate<CallStackItem> {

	constructor(private readonly debugService: IDebugService) { }

	isIncompressible(stat: CallStackItem): boolean {
		if (isDebugSession(stat)) {
			if (stat.compact) {
				return false;
			}
			const sessions = this.debugService.getModel().getSessions();
			if (sessions.some(s => s.parentSession === stat && s.compact)) {
				return false;
			}

			return true;
		}

		return true;
	}
}

registerAction2(class Collapse extends ViewAction<CallStackView> {
	constructor() {
		super({
			id: 'callStack.collapse',
			viewId: CALLSTACK_VIEW_ID,
			title: localize('collapse', "Collapse All"),
			f1: false,
			icon: Codicon.collapseAll,
			precondition: CONTEXT_DEBUG_STATE.isEqualTo(getStateLabel(State.Stopped)),
			menu: {
				id: MenuId.ViewTitle,
				order: 10,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', CALLSTACK_VIEW_ID)
			}
		});
	}

	runInView(_accessor: ServicesAccessor, view: CallStackView) {
		view.collapseAll();
	}
});

function registerCallStackInlineMenuItem(id: string, title: string | ICommandActionTitle, icon: Icon, when: ContextKeyExpression, order: number, precondition?: ContextKeyExpression): void {
	MenuRegistry.appendMenuItem(MenuId.DebugCallStackContext, {
		group: 'inline',
		order,
		when,
		command: { id, title, icon, precondition }
	});
}

const threadOrSessionWithOneThread = ContextKeyExpr.or(CONTEXT_CALLSTACK_ITEM_TYPE.isEqualTo('thread'), ContextKeyExpr.and(CONTEXT_CALLSTACK_ITEM_TYPE.isEqualTo('session'), CONTEXT_CALLSTACK_SESSION_HAS_ONE_THREAD))!;
registerCallStackInlineMenuItem(PAUSE_ID, PAUSE_LABEL, icons.debugPause, ContextKeyExpr.and(threadOrSessionWithOneThread, CONTEXT_CALLSTACK_ITEM_STOPPED.toNegated())!, 10, CONTEXT_FOCUSED_SESSION_IS_NO_DEBUG.toNegated());
registerCallStackInlineMenuItem(CONTINUE_ID, CONTINUE_LABEL, icons.debugContinue, ContextKeyExpr.and(threadOrSessionWithOneThread, CONTEXT_CALLSTACK_ITEM_STOPPED)!, 10);
registerCallStackInlineMenuItem(STEP_OVER_ID, STEP_OVER_LABEL, icons.debugStepOver, threadOrSessionWithOneThread, 20, CONTEXT_CALLSTACK_ITEM_STOPPED);
registerCallStackInlineMenuItem(STEP_INTO_ID, STEP_INTO_LABEL, icons.debugStepInto, threadOrSessionWithOneThread, 30, CONTEXT_CALLSTACK_ITEM_STOPPED);
registerCallStackInlineMenuItem(STEP_OUT_ID, STEP_OUT_LABEL, icons.debugStepOut, threadOrSessionWithOneThread, 40, CONTEXT_CALLSTACK_ITEM_STOPPED);
registerCallStackInlineMenuItem(RESTART_SESSION_ID, RESTART_LABEL, icons.debugRestart, CONTEXT_CALLSTACK_ITEM_TYPE.isEqualTo('session'), 50);
registerCallStackInlineMenuItem(STOP_ID, STOP_LABEL, icons.debugStop, ContextKeyExpr.and(CONTEXT_CALLSTACK_SESSION_IS_ATTACH.toNegated(), CONTEXT_CALLSTACK_ITEM_TYPE.isEqualTo('session'))!, 60);
registerCallStackInlineMenuItem(DISCONNECT_ID, DISCONNECT_LABEL, icons.debugDisconnect, ContextKeyExpr.and(CONTEXT_CALLSTACK_SESSION_IS_ATTACH, CONTEXT_CALLSTACK_ITEM_TYPE.isEqualTo('session'))!, 60);
```

--------------------------------------------------------------------------------

````
