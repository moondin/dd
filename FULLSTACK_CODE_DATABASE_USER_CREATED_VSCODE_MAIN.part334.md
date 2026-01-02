---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 334
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 334 of 552)

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

---[FILE: src/vs/workbench/browser/parts/editor/multiEditorTabsControl.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/multiEditorTabsControl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/multieditortabscontrol.css';
import { isLinux, isMacintosh, isWindows } from '../../../../base/common/platform.js';
import { shorten } from '../../../../base/common/labels.js';
import { EditorResourceAccessor, Verbosity, IEditorPartOptions, SideBySideEditor, DEFAULT_EDITOR_ASSOCIATION, EditorInputCapabilities, IUntypedEditorInput, preventEditorClose, EditorCloseMethod, EditorsOrder, IToolbarActions } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { computeEditorAriaLabel } from '../../editor.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { EventType as TouchEventType, GestureEvent, Gesture } from '../../../../base/browser/touch.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { ResourceLabels, IResourceLabel, DEFAULT_LABELS_CONTAINER } from '../../labels.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { EditorCommandsContextActionRunner, EditorTabsControl } from './editorTabsControl.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IDisposable, dispose, DisposableStore, combinedDisposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { ScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { ScrollbarVisibility } from '../../../../base/common/scrollable.js';
import { getOrSet } from '../../../../base/common/map.js';
import { IThemeService, registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { TAB_INACTIVE_BACKGROUND, TAB_ACTIVE_BACKGROUND, TAB_BORDER, EDITOR_DRAG_AND_DROP_BACKGROUND, TAB_UNFOCUSED_ACTIVE_BACKGROUND, TAB_UNFOCUSED_ACTIVE_BORDER, TAB_ACTIVE_BORDER, TAB_HOVER_BACKGROUND, TAB_HOVER_BORDER, TAB_UNFOCUSED_HOVER_BACKGROUND, TAB_UNFOCUSED_HOVER_BORDER, EDITOR_GROUP_HEADER_TABS_BACKGROUND, WORKBENCH_BACKGROUND, TAB_ACTIVE_BORDER_TOP, TAB_UNFOCUSED_ACTIVE_BORDER_TOP, TAB_ACTIVE_MODIFIED_BORDER, TAB_INACTIVE_MODIFIED_BORDER, TAB_UNFOCUSED_ACTIVE_MODIFIED_BORDER, TAB_UNFOCUSED_INACTIVE_MODIFIED_BORDER, TAB_UNFOCUSED_INACTIVE_BACKGROUND, TAB_HOVER_FOREGROUND, TAB_UNFOCUSED_HOVER_FOREGROUND, EDITOR_GROUP_HEADER_TABS_BORDER, TAB_LAST_PINNED_BORDER, TAB_SELECTED_BORDER_TOP } from '../../../common/theme.js';
import { activeContrastBorder, contrastBorder, editorBackground } from '../../../../platform/theme/common/colorRegistry.js';
import { ResourcesDropHandler, DraggedEditorIdentifier, DraggedEditorGroupIdentifier, extractTreeDropData, isWindowDraggedOver } from '../../dnd.js';
import { Color } from '../../../../base/common/color.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { MergeGroupMode, IMergeGroupOptions } from '../../../services/editor/common/editorGroupsService.js';
import { addDisposableListener, EventType, EventHelper, Dimension, scheduleAtNextAnimationFrame, findParentWithClass, clearNode, DragAndDropObserver, isMouseEvent, getWindow, $ } from '../../../../base/browser/dom.js';
import { localize } from '../../../../nls.js';
import { IEditorGroupsView, EditorServiceImpl, IEditorGroupView, IInternalEditorOpenOptions, IEditorPartsView, prepareMoveCopyEditors } from './editor.js';
import { CloseEditorTabAction, UnpinEditorAction } from './editorActions.js';
import { assertReturnsAllDefined, assertReturnsDefined } from '../../../../base/common/types.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { basenameOrAuthority } from '../../../../base/common/resources.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { IPathService } from '../../../services/path/common/pathService.js';
import { IPath, win32, posix } from '../../../../base/common/path.js';
import { coalesce, insert } from '../../../../base/common/arrays.js';
import { isHighContrast } from '../../../../platform/theme/common/theme.js';
import { isSafari } from '../../../../base/browser/browser.js';
import { equals } from '../../../../base/common/objects.js';
import { EditorActivation, IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { UNLOCK_GROUP_COMMAND_ID } from './editorCommands.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { ITreeViewsDnDService } from '../../../../editor/common/services/treeViewsDndService.js';
import { DraggedTreeItemsIdentifier } from '../../../../editor/common/services/treeViewsDnd.js';
import { IEditorResolverService } from '../../../services/editor/common/editorResolverService.js';
import { IEditorTitleControlDimensions } from './editorTitleControl.js';
import { StickyEditorGroupModel, UnstickyEditorGroupModel } from '../../../common/editor/filteredEditorGroupModel.js';
import { IReadonlyEditorGroupModel } from '../../../common/editor/editorGroupModel.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { BugIndicatingError } from '../../../../base/common/errors.js';
import { applyDragImage } from '../../../../base/browser/ui/dnd/dnd.js';

interface IEditorInputLabel {
	readonly editor: EditorInput;

	readonly name?: string;
	description?: string;
	readonly forceDescription?: boolean;
	readonly title?: string;
	readonly ariaLabel?: string;
}

interface IMultiEditorTabsControlLayoutOptions {

	/**
	 * Whether to force revealing the active tab, even when
	 * the dimensions have not changed. This can be the case
	 * when a tab was made active and needs to be revealed.
	 */
	readonly forceRevealActiveTab?: true;
}

interface IScheduledMultiEditorTabsControlLayout extends IDisposable {

	/**
	 * Associated options with the layout call.
	 */
	options?: IMultiEditorTabsControlLayoutOptions;
}

export class MultiEditorTabsControl extends EditorTabsControl {

	private static readonly SCROLLBAR_SIZES = {
		default: 3 as const,
		large: 10 as const
	};

	private static readonly TAB_WIDTH = {
		compact: 38 as const,
		shrink: 80 as const,
		fit: 120 as const
	};

	private static readonly DRAG_OVER_OPEN_TAB_THRESHOLD = 1500;

	private static readonly MOUSE_WHEEL_EVENT_THRESHOLD = 150;
	private static readonly MOUSE_WHEEL_DISTANCE_THRESHOLD = 1.5;

	private titleContainer: HTMLElement | undefined;
	private tabsAndActionsContainer: HTMLElement | undefined;
	private tabsContainer: HTMLElement | undefined;
	private tabsScrollbar: ScrollableElement | undefined;
	private tabSizingFixedDisposables: DisposableStore | undefined;

	private readonly closeEditorAction = this._register(this.instantiationService.createInstance(CloseEditorTabAction, CloseEditorTabAction.ID, CloseEditorTabAction.LABEL));
	private readonly unpinEditorAction = this._register(this.instantiationService.createInstance(UnpinEditorAction, UnpinEditorAction.ID, UnpinEditorAction.LABEL));

	private readonly tabResourceLabels = this._register(this.instantiationService.createInstance(ResourceLabels, DEFAULT_LABELS_CONTAINER));
	private tabLabels: IEditorInputLabel[] = [];
	private activeTabLabel: IEditorInputLabel | undefined;

	private tabActionBars: ActionBar[] = [];
	private tabDisposables: IDisposable[] = [];

	private dimensions: IEditorTitleControlDimensions & { used?: Dimension } = {
		container: Dimension.None,
		available: Dimension.None
	};

	private readonly layoutScheduler = this._register(new MutableDisposable<IScheduledMultiEditorTabsControlLayout>());
	private blockRevealActiveTab: boolean | undefined;

	private path: IPath = isWindows ? win32 : posix;

	private lastMouseWheelEventTime = 0;
	private isMouseOverTabs = false;

	constructor(
		parent: HTMLElement,
		editorPartsView: IEditorPartsView,
		groupsView: IEditorGroupsView,
		groupView: IEditorGroupView,
		tabsModel: IReadonlyEditorGroupModel,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IKeybindingService keybindingService: IKeybindingService,
		@INotificationService notificationService: INotificationService,
		@IQuickInputService quickInputService: IQuickInputService,
		@IThemeService themeService: IThemeService,
		@IEditorService private readonly editorService: EditorServiceImpl,
		@IPathService private readonly pathService: IPathService,
		@ITreeViewsDnDService private readonly treeViewsDragAndDropService: ITreeViewsDnDService,
		@IEditorResolverService editorResolverService: IEditorResolverService,
		@IHostService hostService: IHostService,
	) {
		super(parent, editorPartsView, groupsView, groupView, tabsModel, contextMenuService, instantiationService, contextKeyService, keybindingService, notificationService, quickInputService, themeService, editorResolverService, hostService);

		// Resolve the correct path library for the OS we are on
		// If we are connected to remote, this accounts for the
		// remote OS.
		(async () => this.path = await this.pathService.path)();

		// React to decorations changing for our resource labels
		this._register(this.tabResourceLabels.onDidChangeDecorations(() => this.doHandleDecorationsChange()));
	}

	protected override create(parent: HTMLElement): HTMLElement {
		super.create(parent);

		this.titleContainer = parent;

		// Tabs and Actions Container (are on a single row with flex side-by-side)
		this.tabsAndActionsContainer = $('.tabs-and-actions-container');
		this.titleContainer.appendChild(this.tabsAndActionsContainer);

		// Tabs Container
		this.tabsContainer = $('.tabs-container', {
			role: 'tablist',
			draggable: true
		});
		this._register(Gesture.addTarget(this.tabsContainer));

		this.tabSizingFixedDisposables = this._register(new DisposableStore());
		this.updateTabSizing(false);

		// Tabs Scrollbar
		this.tabsScrollbar = this.createTabsScrollbar(this.tabsContainer);
		this.tabsAndActionsContainer.appendChild(this.tabsScrollbar.getDomNode());

		// Tabs Container listeners
		this.registerTabsContainerListeners(this.tabsContainer, this.tabsScrollbar);

		// Create Editor Toolbar
		this.createEditorActionsToolBar(this.tabsAndActionsContainer, ['editor-actions']);

		// Set tabs control visibility
		this.updateTabsControlVisibility();

		return this.tabsAndActionsContainer;
	}

	private createTabsScrollbar(scrollable: HTMLElement): ScrollableElement {
		const tabsScrollbar = this._register(new ScrollableElement(scrollable, {
			horizontal: this.getTabsScrollbarVisibility(),
			horizontalScrollbarSize: this.getTabsScrollbarSizing(),
			vertical: ScrollbarVisibility.Hidden,
			scrollYToX: true,
			useShadows: false
		}));

		this._register(tabsScrollbar.onScroll(e => {
			if (e.scrollLeftChanged) {
				scrollable.scrollLeft = e.scrollLeft;
			}
		}));

		return tabsScrollbar;
	}

	private updateTabsScrollbarSizing(): void {
		this.tabsScrollbar?.updateOptions({
			horizontalScrollbarSize: this.getTabsScrollbarSizing()
		});
	}

	private updateTabsScrollbarVisibility(): void {
		this.tabsScrollbar?.updateOptions({
			horizontal: this.getTabsScrollbarVisibility()
		});
	}

	private updateTabSizing(fromEvent: boolean): void {
		const [tabsContainer, tabSizingFixedDisposables] = assertReturnsAllDefined(this.tabsContainer, this.tabSizingFixedDisposables);

		tabSizingFixedDisposables.clear();

		const options = this.groupsView.partOptions;
		if (options.tabSizing === 'fixed') {
			tabsContainer.style.setProperty('--tab-sizing-fixed-min-width', `${options.tabSizingFixedMinWidth}px`);
			tabsContainer.style.setProperty('--tab-sizing-fixed-max-width', `${options.tabSizingFixedMaxWidth}px`);

			// For https://github.com/microsoft/vscode/issues/40290 we want to
			// preserve the current tab widths as long as the mouse is over the
			// tabs so that you can quickly close them via mouse click. For that
			// we track mouse movements over the tabs container.

			tabSizingFixedDisposables.add(addDisposableListener(tabsContainer, EventType.MOUSE_ENTER, () => {
				this.isMouseOverTabs = true;
			}));
			tabSizingFixedDisposables.add(addDisposableListener(tabsContainer, EventType.MOUSE_LEAVE, () => {
				this.isMouseOverTabs = false;
				this.updateTabsFixedWidth(false);
			}));
		} else if (fromEvent) {
			tabsContainer.style.removeProperty('--tab-sizing-fixed-min-width');
			tabsContainer.style.removeProperty('--tab-sizing-fixed-max-width');
			this.updateTabsFixedWidth(false);
		}
	}

	private updateTabsFixedWidth(fixed: boolean): void {
		this.forEachTab((editor, tabIndex, tabContainer) => {
			if (fixed) {
				const { width } = tabContainer.getBoundingClientRect();
				tabContainer.style.setProperty('--tab-sizing-current-width', `${width}px`);
			} else {
				tabContainer.style.removeProperty('--tab-sizing-current-width');
			}
		});
	}

	private getTabsScrollbarSizing(): number {
		if (this.groupsView.partOptions.titleScrollbarSizing !== 'large') {
			return MultiEditorTabsControl.SCROLLBAR_SIZES.default;
		}

		return MultiEditorTabsControl.SCROLLBAR_SIZES.large;
	}

	private getTabsScrollbarVisibility(): ScrollbarVisibility {
		switch (this.groupsView.partOptions.titleScrollbarVisibility) {
			case 'visible': return ScrollbarVisibility.Visible;
			case 'hidden': return ScrollbarVisibility.Hidden;
			default: return ScrollbarVisibility.Auto;
		}
	}

	private registerTabsContainerListeners(tabsContainer: HTMLElement, tabsScrollbar: ScrollableElement): void {

		// Forward scrolling inside the container to our custom scrollbar
		this._register(addDisposableListener(tabsContainer, EventType.SCROLL, () => {
			if (tabsContainer.classList.contains('scroll')) {
				tabsScrollbar.setScrollPosition({
					scrollLeft: tabsContainer.scrollLeft // during DND the container gets scrolled so we need to update the custom scrollbar
				});
			}
		}));

		// New file when double-clicking on tabs container (but not tabs)
		for (const eventType of [TouchEventType.Tap, EventType.DBLCLICK]) {
			this._register(addDisposableListener(tabsContainer, eventType, (e: MouseEvent | GestureEvent) => {
				if (eventType === EventType.DBLCLICK) {
					if (e.target !== tabsContainer) {
						return; // ignore if target is not tabs container
					}
				} else {
					if ((<GestureEvent>e).tapCount !== 2) {
						return; // ignore single taps
					}

					if ((<GestureEvent>e).initialTarget !== tabsContainer) {
						return; // ignore if target is not tabs container
					}
				}

				EventHelper.stop(e);

				this.editorService.openEditor({
					resource: undefined,
					options: {
						pinned: true,
						index: this.groupView.count, // always at the end
						override: DEFAULT_EDITOR_ASSOCIATION.id
					}
				}, this.groupView.id);
			}));
		}

		// Prevent auto-scrolling (https://github.com/microsoft/vscode/issues/16690)
		this._register(addDisposableListener(tabsContainer, EventType.MOUSE_DOWN, e => {
			if (e.button === 1) {
				e.preventDefault();
			}
		}));

		// Prevent auto-pasting (https://github.com/microsoft/vscode/issues/201696)
		if (isLinux) {
			this._register(addDisposableListener(tabsContainer, EventType.MOUSE_UP, e => {
				if (e.button === 1) {
					e.preventDefault();
				}
			}));
		}

		// Drag & Drop support
		let lastDragEvent: DragEvent | undefined = undefined;
		let isNewWindowOperation = false;
		this._register(new DragAndDropObserver(tabsContainer, {
			onDragStart: e => {
				isNewWindowOperation = this.onGroupDragStart(e, tabsContainer);
			},

			onDrag: e => {
				lastDragEvent = e;
			},

			onDragEnter: e => {

				// Always enable support to scroll while dragging
				tabsContainer.classList.add('scroll');

				// Return if the target is not on the tabs container
				if (e.target !== tabsContainer) {
					return;
				}

				// Return if transfer is unsupported
				if (!this.isSupportedDropTransfer(e)) {
					if (e.dataTransfer) {
						e.dataTransfer.dropEffect = 'none';
					}

					return;
				}

				// Update the dropEffect to "copy" if there is no local data to be dragged because
				// in that case we can only copy the data into and not move it from its source
				if (!this.editorTransfer.hasData(DraggedEditorIdentifier.prototype)) {
					if (e.dataTransfer) {
						e.dataTransfer.dropEffect = 'copy';
					}
				}

				this.updateDropFeedback(tabsContainer, true, e);
			},

			onDragLeave: e => {
				this.updateDropFeedback(tabsContainer, false, e);
				tabsContainer.classList.remove('scroll');
			},

			onDragEnd: e => {
				this.updateDropFeedback(tabsContainer, false, e);
				tabsContainer.classList.remove('scroll');

				this.onGroupDragEnd(e, lastDragEvent, tabsContainer, isNewWindowOperation);
			},

			onDrop: e => {
				this.updateDropFeedback(tabsContainer, false, e);
				tabsContainer.classList.remove('scroll');

				if (e.target === tabsContainer) {
					const isGroupTransfer = this.groupTransfer.hasData(DraggedEditorGroupIdentifier.prototype);
					this.onDrop(e, isGroupTransfer ? this.groupView.count : this.tabsModel.count, tabsContainer);
				}
			}
		}));

		// Mouse-wheel support to switch to tabs optionally
		this._register(addDisposableListener(tabsContainer, EventType.MOUSE_WHEEL, (e: WheelEvent) => {
			const activeEditor = this.groupView.activeEditor;
			if (!activeEditor || this.groupView.count < 2) {
				return;  // need at least 2 open editors
			}

			// Shift-key enables or disables this behaviour depending on the setting
			if (this.groupsView.partOptions.scrollToSwitchTabs === true) {
				if (e.shiftKey) {
					return; // 'on': only enable this when Shift-key is not pressed
				}
			} else {
				if (!e.shiftKey) {
					return; // 'off': only enable this when Shift-key is pressed
				}
			}

			// Ignore event if the last one happened too recently (https://github.com/microsoft/vscode/issues/96409)
			// The restriction is relaxed according to the absolute value of `deltaX` and `deltaY`
			// to support discrete (mouse wheel) and contiguous scrolling (touchpad) equally well
			const now = Date.now();
			if (now - this.lastMouseWheelEventTime < MultiEditorTabsControl.MOUSE_WHEEL_EVENT_THRESHOLD - 2 * (Math.abs(e.deltaX) + Math.abs(e.deltaY))) {
				return;
			}

			this.lastMouseWheelEventTime = now;

			// Figure out scrolling direction but ignore it if too subtle
			let tabSwitchDirection: number;
			if (e.deltaX + e.deltaY < - MultiEditorTabsControl.MOUSE_WHEEL_DISTANCE_THRESHOLD) {
				tabSwitchDirection = -1;
			} else if (e.deltaX + e.deltaY > MultiEditorTabsControl.MOUSE_WHEEL_DISTANCE_THRESHOLD) {
				tabSwitchDirection = 1;
			} else {
				return;
			}

			const nextEditor = this.groupView.getEditorByIndex(this.groupView.getIndexOfEditor(activeEditor) + tabSwitchDirection);
			if (!nextEditor) {
				return;
			}

			// Open it
			this.groupView.openEditor(nextEditor);

			// Disable normal scrolling, opening the editor will already reveal it properly
			EventHelper.stop(e, true);
		}));

		// Context menu
		const showContextMenu = (e: Event) => {
			EventHelper.stop(e);

			// Find target anchor
			let anchor: HTMLElement | StandardMouseEvent = tabsContainer;
			if (isMouseEvent(e)) {
				anchor = new StandardMouseEvent(getWindow(this.parent), e);
			}

			// Show it
			this.contextMenuService.showContextMenu({
				getAnchor: () => anchor,
				menuId: MenuId.EditorTabsBarContext,
				contextKeyService: this.contextKeyService,
				menuActionOptions: { shouldForwardArgs: true },
				getActionsContext: () => ({ groupId: this.groupView.id }),
				getKeyBinding: action => this.getKeybinding(action),
				onHide: () => this.groupView.focus()
			});
		};

		this._register(addDisposableListener(tabsContainer, TouchEventType.Contextmenu, e => showContextMenu(e)));
		this._register(addDisposableListener(tabsContainer, EventType.CONTEXT_MENU, e => showContextMenu(e)));
	}

	private doHandleDecorationsChange(): void {

		// A change to decorations potentially has an impact on the size of tabs
		// so we need to trigger a layout in that case to adjust things
		this.layout(this.dimensions);
	}

	protected override updateEditorActionsToolbar(): void {
		super.updateEditorActionsToolbar();

		// Changing the actions in the toolbar can have an impact on the size of the
		// tab container, so we need to layout the tabs to make sure the active is visible
		this.layout(this.dimensions);
	}

	openEditor(editor: EditorInput, options?: IInternalEditorOpenOptions): boolean {
		const changed = this.handleOpenedEditors();

		// Respect option to focus tab control if provided
		if (options?.focusTabControl) {
			this.withTab(editor, (editor, tabIndex, tabContainer) => tabContainer.focus());
		}

		return changed;
	}

	openEditors(editors: EditorInput[]): boolean {
		return this.handleOpenedEditors();
	}

	private handleOpenedEditors(): boolean {

		// Set tabs control visibility
		this.updateTabsControlVisibility();

		// Create tabs as needed
		const [tabsContainer, tabsScrollbar] = assertReturnsAllDefined(this.tabsContainer, this.tabsScrollbar);
		for (let i = tabsContainer.children.length; i < this.tabsModel.count; i++) {
			tabsContainer.appendChild(this.createTab(i, tabsContainer, tabsScrollbar));
		}

		// Make sure to recompute tab labels and detect
		// if a label change occurred that requires a
		// redraw of tabs.

		const activeEditorChanged = this.didActiveEditorChange();
		const oldTabLabels = this.tabLabels;
		this.computeTabLabels();

		// Redraw and update in these cases
		let didChange = false;
		if (
			activeEditorChanged ||																				// active editor changed
			oldTabLabels.length !== this.tabLabels.length ||													// number of tabs changed
			oldTabLabels.some((label, index) => !this.equalsEditorInputLabel(label, this.tabLabels.at(index))) 	// editor labels changed
		) {
			this.redraw({ forceRevealActiveTab: true });
			didChange = true;
		}

		// Otherwise only layout for revealing
		else {
			this.layout(this.dimensions, { forceRevealActiveTab: true });
		}

		return didChange;
	}

	private didActiveEditorChange(): boolean {
		if (
			!this.activeTabLabel?.editor && this.tabsModel.activeEditor || 							// active editor changed from null => editor
			this.activeTabLabel?.editor && !this.tabsModel.activeEditor || 							// active editor changed from editor => null
			(!this.activeTabLabel?.editor || !this.tabsModel.isActive(this.activeTabLabel.editor))	// active editor changed from editorA => editorB
		) {
			return true;
		}

		return false;
	}

	private equalsEditorInputLabel(labelA: IEditorInputLabel | undefined, labelB: IEditorInputLabel | undefined): boolean {
		if (labelA === labelB) {
			return true;
		}

		if (!labelA || !labelB) {
			return false;
		}

		return labelA.name === labelB.name &&
			labelA.description === labelB.description &&
			labelA.forceDescription === labelB.forceDescription &&
			labelA.title === labelB.title &&
			labelA.ariaLabel === labelB.ariaLabel;
	}

	beforeCloseEditor(editor: EditorInput): void {

		// Fix tabs width if the mouse is over tabs and before closing
		// a tab (except the last tab) when tab sizing is 'fixed'.
		// This helps keeping the close button stable under
		// the mouse and allows for rapid closing of tabs.

		if (this.isMouseOverTabs && this.groupsView.partOptions.tabSizing === 'fixed') {
			const closingLastTab = this.tabsModel.isLast(editor);
			this.updateTabsFixedWidth(!closingLastTab);
		}
	}

	closeEditor(editor: EditorInput): void {
		this.handleClosedEditors();
	}

	closeEditors(editors: EditorInput[]): void {
		this.handleClosedEditors();
	}

	private handleClosedEditors(): void {

		// There are tabs to show
		if (this.tabsModel.count) {

			// Remove tabs that got closed
			const tabsContainer = assertReturnsDefined(this.tabsContainer);
			while (tabsContainer.children.length > this.tabsModel.count) {

				// Remove one tab from container (must be the last to keep indexes in order!)
				tabsContainer.lastChild?.remove();

				// Remove associated tab label and widget
				dispose(this.tabDisposables.pop());
			}

			// A removal of a label requires to recompute all labels
			this.computeTabLabels();

			// Redraw all tabs
			this.redraw({ forceRevealActiveTab: true });
		}

		// No tabs to show
		else {
			if (this.tabsContainer) {
				clearNode(this.tabsContainer);
			}

			this.tabDisposables = dispose(this.tabDisposables);
			this.tabResourceLabels.clear();
			this.tabLabels = [];
			this.activeTabLabel = undefined;
			this.tabActionBars = [];

			this.clearEditorActionsToolbar();
			this.updateTabsControlVisibility();
		}
	}

	moveEditor(editor: EditorInput, fromTabIndex: number, targetTabIndex: number): void {

		// Move the editor label
		const editorLabel = this.tabLabels[fromTabIndex];
		this.tabLabels.splice(fromTabIndex, 1);
		this.tabLabels.splice(targetTabIndex, 0, editorLabel);

		// Redraw tabs in the range of the move
		this.forEachTab((editor, tabIndex, tabContainer, tabLabelWidget, tabLabel, tabActionBar) => {
			this.redrawTab(editor, tabIndex, tabContainer, tabLabelWidget, tabLabel, tabActionBar);
		},
			Math.min(fromTabIndex, targetTabIndex), // from: smallest of fromTabIndex/targetTabIndex
			Math.max(fromTabIndex, targetTabIndex)	//   to: largest of fromTabIndex/targetTabIndex
		);

		// Moving an editor requires a layout to keep the active editor visible
		this.layout(this.dimensions, { forceRevealActiveTab: true });
	}

	pinEditor(editor: EditorInput): void {
		this.withTab(editor, (editor, tabIndex, tabContainer, tabLabelWidget, tabLabel) => this.redrawTabLabel(editor, tabIndex, tabContainer, tabLabelWidget, tabLabel));
	}

	stickEditor(editor: EditorInput): void {
		this.doHandleStickyEditorChange(editor);
	}

	unstickEditor(editor: EditorInput): void {
		this.doHandleStickyEditorChange(editor);
	}

	private doHandleStickyEditorChange(editor: EditorInput): void {

		// Update tab
		this.withTab(editor, (editor, tabIndex, tabContainer, tabLabelWidget, tabLabel, tabActionBar) => this.redrawTab(editor, tabIndex, tabContainer, tabLabelWidget, tabLabel, tabActionBar));

		// Sticky change has an impact on each tab's border because
		// it potentially moves the border to the last pinned tab
		this.forEachTab((editor, tabIndex, tabContainer, tabLabelWidget, tabLabel) => {
			this.redrawTabBorders(tabIndex, tabContainer);
		});

		// A change to the sticky state requires a layout to keep the active editor visible
		this.layout(this.dimensions, { forceRevealActiveTab: true });
	}

	setActive(isGroupActive: boolean): void {

		// Activity has an impact on each tab's active indication
		this.forEachTab((editor, tabIndex, tabContainer, tabLabelWidget, tabLabel, tabActionBar) => {
			this.redrawTabSelectedActiveAndDirty(isGroupActive, editor, tabContainer, tabActionBar);
		});

		// Activity has an impact on the toolbar, so we need to update and layout
		this.updateEditorActionsToolbar();
		this.layout(this.dimensions, { forceRevealActiveTab: true });
	}

	updateEditorSelections(): void {
		this.forEachTab((editor, tabIndex, tabContainer, tabLabelWidget, tabLabel, tabActionBar) => {
			this.redrawTabSelectedActiveAndDirty(this.groupsView.activeGroup === this.groupView, editor, tabContainer, tabActionBar);
		});
	}

	private updateEditorLabelScheduler = this._register(new RunOnceScheduler(() => this.doUpdateEditorLabels(), 0));

	updateEditorLabel(editor: EditorInput): void {

		// Update all labels to account for changes to tab labels
		// Since this method may be called a lot of times from
		// individual editors, we collect all those requests and
		// then run the update once because we have to update
		// all opened tabs in the group at once.
		this.updateEditorLabelScheduler.schedule();
	}

	private doUpdateEditorLabels(): void {

		// A change to a label requires to recompute all labels
		this.computeTabLabels();

		// As such we need to redraw each label
		this.forEachTab((editor, tabIndex, tabContainer, tabLabelWidget, tabLabel) => {
			this.redrawTabLabel(editor, tabIndex, tabContainer, tabLabelWidget, tabLabel);
		});

		// A change to a label requires a layout to keep the active editor visible
		this.layout(this.dimensions);
	}

	updateEditorDirty(editor: EditorInput): void {
		this.withTab(editor, (editor, tabIndex, tabContainer, tabLabelWidget, tabLabel, tabActionBar) => this.redrawTabSelectedActiveAndDirty(this.groupsView.activeGroup === this.groupView, editor, tabContainer, tabActionBar));
	}

	override updateOptions(oldOptions: IEditorPartOptions, newOptions: IEditorPartOptions): void {
		super.updateOptions(oldOptions, newOptions);

		// A change to a label format options requires to recompute all labels
		if (oldOptions.labelFormat !== newOptions.labelFormat) {
			this.computeTabLabels();
		}

		// Update tabs scrollbar sizing
		if (oldOptions.titleScrollbarSizing !== newOptions.titleScrollbarSizing) {
			this.updateTabsScrollbarSizing();
		}

		// Update tabs scrollbar visibility
		if (oldOptions.titleScrollbarVisibility !== newOptions.titleScrollbarVisibility) {
			this.updateTabsScrollbarVisibility();
		}

		// Update editor actions
		if (oldOptions.alwaysShowEditorActions !== newOptions.alwaysShowEditorActions) {
			this.updateEditorActionsToolbar();
		}

		// Update tabs sizing
		if (
			oldOptions.tabSizingFixedMinWidth !== newOptions.tabSizingFixedMinWidth ||
			oldOptions.tabSizingFixedMaxWidth !== newOptions.tabSizingFixedMaxWidth ||
			oldOptions.tabSizing !== newOptions.tabSizing
		) {
			this.updateTabSizing(true);
		}

		// Redraw tabs when other options change
		if (
			oldOptions.labelFormat !== newOptions.labelFormat ||
			oldOptions.tabActionLocation !== newOptions.tabActionLocation ||
			oldOptions.tabActionCloseVisibility !== newOptions.tabActionCloseVisibility ||
			oldOptions.tabActionUnpinVisibility !== newOptions.tabActionUnpinVisibility ||
			oldOptions.tabSizing !== newOptions.tabSizing ||
			oldOptions.pinnedTabSizing !== newOptions.pinnedTabSizing ||
			oldOptions.showIcons !== newOptions.showIcons ||
			oldOptions.hasIcons !== newOptions.hasIcons ||
			oldOptions.highlightModifiedTabs !== newOptions.highlightModifiedTabs ||
			oldOptions.wrapTabs !== newOptions.wrapTabs ||
			oldOptions.showTabIndex !== newOptions.showTabIndex ||
			!equals(oldOptions.decorations, newOptions.decorations)
		) {
			this.redraw();
		}
	}

	override updateStyles(): void {
		this.redraw();
	}

	private forEachTab(fn: (editor: EditorInput, tabIndex: number, tabContainer: HTMLElement, tabLabelWidget: IResourceLabel, tabLabel: IEditorInputLabel, tabActionBar: ActionBar) => void, fromTabIndex?: number, toTabIndex?: number): void {
		this.tabsModel.getEditors(EditorsOrder.SEQUENTIAL).forEach((editor: EditorInput, tabIndex: number) => {
			if (typeof fromTabIndex === 'number' && fromTabIndex > tabIndex) {
				return; // do nothing if we are not yet at `fromIndex`
			}

			if (typeof toTabIndex === 'number' && toTabIndex < tabIndex) {
				return; // do nothing if we are beyond `toIndex`
			}

			this.doWithTab(tabIndex, editor, fn);
		});
	}

	private withTab(editor: EditorInput, fn: (editor: EditorInput, tabIndex: number, tabContainer: HTMLElement, tabLabelWidget: IResourceLabel, tabLabel: IEditorInputLabel, tabActionBar: ActionBar) => void): void {
		this.doWithTab(this.tabsModel.indexOf(editor), editor, fn);
	}

	private doWithTab(tabIndex: number, editor: EditorInput, fn: (editor: EditorInput, tabIndex: number, tabContainer: HTMLElement, tabLabelWidget: IResourceLabel, tabLabel: IEditorInputLabel, tabActionBar: ActionBar) => void): void {
		const tabsContainer = assertReturnsDefined(this.tabsContainer);
		const tabContainer = tabsContainer.children[tabIndex] as HTMLElement;
		const tabResourceLabel = this.tabResourceLabels.get(tabIndex);
		const tabLabel = this.tabLabels[tabIndex];
		const tabActionBar = this.tabActionBars[tabIndex];
		if (tabContainer && tabResourceLabel && tabLabel) {
			fn(editor, tabIndex, tabContainer, tabResourceLabel, tabLabel, tabActionBar);
		}
	}

	private createTab(tabIndex: number, tabsContainer: HTMLElement, tabsScrollbar: ScrollableElement): HTMLElement {

		// Tab Container
		const tabContainer = $('.tab', {
			draggable: true,
			role: 'tab'
		});

		// Gesture Support
		const gestureDisposable = Gesture.addTarget(tabContainer);

		// Tab Border Top
		const tabBorderTopContainer = $('.tab-border-top-container');
		tabContainer.appendChild(tabBorderTopContainer);

		// Tab Editor Label
		const editorLabel = this.tabResourceLabels.create(tabContainer, { hoverTargetOverride: tabContainer });

		// Tab Actions
		const tabActionsContainer = $('.tab-actions');
		tabContainer.appendChild(tabActionsContainer);

		const that = this;
		const tabActionRunner = new EditorCommandsContextActionRunner({
			groupId: this.groupView.id,
			get editorIndex() { return that.toEditorIndex(tabIndex); }
		});

		const tabActionBar = new ActionBar(tabActionsContainer, { ariaLabel: localize('ariaLabelTabActions', "Tab actions"), actionRunner: tabActionRunner });
		const tabActionListener = tabActionBar.onWillRun(e => {
			if (e.action.id === this.closeEditorAction.id) {
				this.blockRevealActiveTabOnce();
			}
		});

		const tabActionBarDisposable = combinedDisposable(tabActionRunner, tabActionBar, tabActionListener, toDisposable(insert(this.tabActionBars, tabActionBar)));

		// Tab Fade Hider
		// Hides the tab fade to the right when tab action left and sizing shrink/fixed, ::after, ::before are already used
		const tabShadowHider = $('.tab-fade-hider');
		tabContainer.appendChild(tabShadowHider);

		// Tab Border Bottom
		const tabBorderBottomContainer = $('.tab-border-bottom-container');
		tabContainer.appendChild(tabBorderBottomContainer);

		// Eventing
		const eventsDisposable = this.registerTabListeners(tabContainer, tabIndex, tabsContainer, tabsScrollbar);

		this.tabDisposables.push(combinedDisposable(gestureDisposable, eventsDisposable, tabActionBarDisposable, editorLabel));

		return tabContainer;
	}

	private toEditorIndex(tabIndex: number): number {

		// Given a `tabIndex` that is relative to the tabs model
		// returns the `editorIndex` relative to the entire group

		const editor = assertReturnsDefined(this.tabsModel.getEditorByIndex(tabIndex));

		return this.groupView.getIndexOfEditor(editor);
	}

	private lastSingleSelectSelectedEditor: EditorInput | undefined;
	private registerTabListeners(tab: HTMLElement, tabIndex: number, tabsContainer: HTMLElement, tabsScrollbar: ScrollableElement): IDisposable {
		const disposables = new DisposableStore();

		const handleClickOrTouch = async (e: MouseEvent | GestureEvent, preserveFocus: boolean): Promise<void> => {
			tab.blur(); // prevent flicker of focus outline on tab until editor got focus

			if (isMouseEvent(e) && (e.button !== 0 /* middle/right mouse button */ || (isMacintosh && e.ctrlKey /* macOS context menu */))) {
				if (e.button === 1) {
					e.preventDefault(); // required to prevent auto-scrolling (https://github.com/microsoft/vscode/issues/16690)
				}

				return;
			}

			if (this.originatesFromTabActionBar(e)) {
				return; // not when clicking on actions
			}

			// Open tabs editor
			const editor = this.tabsModel.getEditorByIndex(tabIndex);
			if (editor) {
				if (e.shiftKey) {
					let anchor: EditorInput;
					if (this.lastSingleSelectSelectedEditor && this.tabsModel.isSelected(this.lastSingleSelectSelectedEditor)) {
						// The last selected editor is the anchor
						anchor = this.lastSingleSelectSelectedEditor;
					} else {
						// The active editor is the anchor
						const activeEditor = assertReturnsDefined(this.groupView.activeEditor);
						this.lastSingleSelectSelectedEditor = activeEditor;
						anchor = activeEditor;
					}
					await this.selectEditorsBetween(editor, anchor);
				} else if ((e.ctrlKey && !isMacintosh) || (e.metaKey && isMacintosh)) {
					if (this.tabsModel.isSelected(editor)) {
						await this.unselectEditor(editor);
					} else {
						await this.selectEditor(editor);
						this.lastSingleSelectSelectedEditor = editor;
					}
				} else {
					// Even if focus is preserved make sure to activate the group.
					// If a new active editor is selected, keep the current selection on key
					// down such that drag and drop can operate over the selection. The selection
					// is removed on key up in this case.
					const inactiveSelection = this.tabsModel.isSelected(editor) ? this.groupView.selectedEditors.filter(e => !e.matches(editor)) : [];
					await this.groupView.openEditor(editor, { preserveFocus, activation: EditorActivation.ACTIVATE }, { inactiveSelection, focusTabControl: true });
				}
			}
		};

		const showContextMenu = (e: Event) => {
			EventHelper.stop(e);

			const editor = this.tabsModel.getEditorByIndex(tabIndex);
			if (editor) {
				this.onTabContextMenu(editor, e, tab);
			}
		};

		// Open on Click / Touch
		disposables.add(addDisposableListener(tab, EventType.MOUSE_DOWN, e => handleClickOrTouch(e, false)));
		disposables.add(addDisposableListener(tab, TouchEventType.Tap, (e: GestureEvent) => handleClickOrTouch(e, true))); // Preserve focus on touch #125470

		// Touch Scroll Support
		disposables.add(addDisposableListener(tab, TouchEventType.Change, (e: GestureEvent) => {
			tabsScrollbar.setScrollPosition({ scrollLeft: tabsScrollbar.getScrollPosition().scrollLeft - e.translationX });
		}));

		// Update selection & prevent flicker of focus outline on tab until editor got focus
		disposables.add(addDisposableListener(tab, EventType.MOUSE_UP, async e => {
			EventHelper.stop(e);

			tab.blur();

			if (isMouseEvent(e) && (e.button !== 0 /* middle/right mouse button */ || (isMacintosh && e.ctrlKey /* macOS context menu */))) {
				return;
			}

			if (this.originatesFromTabActionBar(e)) {
				return; // not when clicking on actions
			}

			const isCtrlCmd = (e.ctrlKey && !isMacintosh) || (e.metaKey && isMacintosh);
			if (!isCtrlCmd && !e.shiftKey && this.groupView.selectedEditors.length > 1) {
				await this.unselectAllEditors();
			}
		}));

		// Close on mouse middle click
		disposables.add(addDisposableListener(tab, EventType.AUXCLICK, e => {
			if (e.button === 1 /* Middle Button*/) {
				EventHelper.stop(e, true /* for https://github.com/microsoft/vscode/issues/56715 */);

				const editor = this.tabsModel.getEditorByIndex(tabIndex);
				if (editor) {
					if (preventEditorClose(this.tabsModel, editor, EditorCloseMethod.MOUSE, this.groupsView.partOptions)) {
						return;
					}

					this.blockRevealActiveTabOnce();
					this.closeEditorAction.run({ groupId: this.groupView.id, editorIndex: this.groupView.getIndexOfEditor(editor) });
				}
			}
		}));

		// Context menu on Shift+F10
		disposables.add(addDisposableListener(tab, EventType.KEY_DOWN, e => {
			const event = new StandardKeyboardEvent(e);
			if (event.shiftKey && event.keyCode === KeyCode.F10) {
				showContextMenu(e);
			}
		}));

		// Context menu on touch context menu gesture
		disposables.add(addDisposableListener(tab, TouchEventType.Contextmenu, (e: GestureEvent) => {
			showContextMenu(e);
		}));

		// Keyboard accessibility
		disposables.add(addDisposableListener(tab, EventType.KEY_UP, e => {
			const event = new StandardKeyboardEvent(e);
			let handled = false;

			// Run action on Enter/Space
			if (event.equals(KeyCode.Enter) || event.equals(KeyCode.Space)) {
				handled = true;
				const editor = this.tabsModel.getEditorByIndex(tabIndex);
				if (editor) {
					this.groupView.openEditor(editor);
				}
			}

			// Navigate in editors
			else if ([KeyCode.LeftArrow, KeyCode.RightArrow, KeyCode.UpArrow, KeyCode.DownArrow, KeyCode.Home, KeyCode.End].some(kb => event.equals(kb))) {
				let editorIndex = this.toEditorIndex(tabIndex);
				if (event.equals(KeyCode.LeftArrow) || event.equals(KeyCode.UpArrow)) {
					editorIndex = editorIndex - 1;
				} else if (event.equals(KeyCode.RightArrow) || event.equals(KeyCode.DownArrow)) {
					editorIndex = editorIndex + 1;
				} else if (event.equals(KeyCode.Home)) {
					editorIndex = 0;
				} else {
					editorIndex = this.groupView.count - 1;
				}

				const target = this.groupView.getEditorByIndex(editorIndex);
				if (target) {
					handled = true;
					this.groupView.openEditor(target, { preserveFocus: true }, { focusTabControl: true });
				}
			}

			if (handled) {
				EventHelper.stop(e, true);
			}

			// moving in the tabs container can have an impact on scrolling position, so we need to update the custom scrollbar
			tabsScrollbar.setScrollPosition({
				scrollLeft: tabsContainer.scrollLeft
			});
		}));

		// Double click: either pin or toggle maximized
		for (const eventType of [TouchEventType.Tap, EventType.DBLCLICK]) {
			disposables.add(addDisposableListener(tab, eventType, (e: MouseEvent | GestureEvent) => {
				if (eventType === EventType.DBLCLICK) {
					EventHelper.stop(e);
				} else if ((<GestureEvent>e).tapCount !== 2) {
					return; // ignore single taps
				}

				const editor = this.tabsModel.getEditorByIndex(tabIndex);
				if (editor && this.tabsModel.isPinned(editor)) {
					switch (this.groupsView.partOptions.doubleClickTabToToggleEditorGroupSizes) {
						case 'maximize':
							this.groupsView.toggleMaximizeGroup(this.groupView);
							break;
						case 'expand':
							this.groupsView.toggleExpandGroup(this.groupView);
							break;
						case 'off':
							break;
					}

				} else {
					this.groupView.pinEditor(editor);
				}
			}));
		}

		// Context menu
		disposables.add(addDisposableListener(tab, EventType.CONTEXT_MENU, e => {
			EventHelper.stop(e, true);

			const editor = this.tabsModel.getEditorByIndex(tabIndex);
			if (editor) {
				this.onTabContextMenu(editor, e, tab);
			}
		}, true /* use capture to fix https://github.com/microsoft/vscode/issues/19145 */));

		// Drag & Drop support
		let lastDragEvent: DragEvent | undefined = undefined;
		let isNewWindowOperation = false;
		disposables.add(new DragAndDropObserver(tab, {
			onDragStart: e => {
				const editor = this.tabsModel.getEditorByIndex(tabIndex);
				if (!editor) {
					return;
				}

				isNewWindowOperation = this.isNewWindowOperation(e);
				const selectedEditors = this.groupView.selectedEditors;
				this.editorTransfer.setData(selectedEditors.map(e => new DraggedEditorIdentifier({ editor: e, groupId: this.groupView.id })), DraggedEditorIdentifier.prototype);

				if (e.dataTransfer) {
					e.dataTransfer.effectAllowed = 'copyMove';
					if (selectedEditors.length > 1) {
						const label = `${editor.getName()} + ${selectedEditors.length - 1}`;
						applyDragImage(e, tab, label);
					} else {
						e.dataTransfer.setDragImage(tab, 0, 0); // top left corner of dragged tab set to cursor position to make room for drop-border feedback
					}
				}

				// Apply some datatransfer types to allow for dragging the element outside of the application
				this.doFillResourceDataTransfers(selectedEditors, e, isNewWindowOperation);

				scheduleAtNextAnimationFrame(getWindow(this.parent), () => this.updateDropFeedback(tab, false, e, tabIndex));
			},

			onDrag: e => {
				lastDragEvent = e;
			},

			onDragEnter: e => {

				// Return if transfer is unsupported
				if (!this.isSupportedDropTransfer(e)) {
					if (e.dataTransfer) {
						e.dataTransfer.dropEffect = 'none';
					}

					return;
				}

				// Update the dropEffect to "copy" if there is no local data to be dragged because
				// in that case we can only copy the data into and not move it from its source
				if (!this.editorTransfer.hasData(DraggedEditorIdentifier.prototype)) {
					if (e.dataTransfer) {
						e.dataTransfer.dropEffect = 'copy';
					}
				}

				this.updateDropFeedback(tab, true, e, tabIndex);
			},

			onDragOver: (e, dragDuration) => {
				if (dragDuration >= MultiEditorTabsControl.DRAG_OVER_OPEN_TAB_THRESHOLD) {
					const draggedOverTab = this.tabsModel.getEditorByIndex(tabIndex);
					if (draggedOverTab && this.tabsModel.activeEditor !== draggedOverTab) {
						this.groupView.openEditor(draggedOverTab, { preserveFocus: true });
					}
				}

				this.updateDropFeedback(tab, true, e, tabIndex);
			},

			onDragEnd: async e => {
				this.updateDropFeedback(tab, false, e, tabIndex);
				const draggedEditors = this.editorTransfer.getData(DraggedEditorIdentifier.prototype);
				this.editorTransfer.clearData(DraggedEditorIdentifier.prototype);

				if (
					!isNewWindowOperation ||
					isWindowDraggedOver() ||
					!draggedEditors ||
					draggedEditors.length === 0
				) {
					return; // drag to open in new window is disabled
				}

				const auxiliaryEditorPart = await this.maybeCreateAuxiliaryEditorPartAt(e, tab);
				if (!auxiliaryEditorPart) {
					return;
				}

				const targetGroup = auxiliaryEditorPart.activeGroup;
				const editorsWithOptions = prepareMoveCopyEditors(this.groupView, draggedEditors.map(editor => editor.identifier.editor));
				if (this.isMoveOperation(lastDragEvent ?? e, targetGroup.id, draggedEditors[0].identifier.editor)) {
					this.groupView.moveEditors(editorsWithOptions, targetGroup);
				} else {
					this.groupView.copyEditors(editorsWithOptions, targetGroup);
				}

				targetGroup.focus();
			},

			onDrop: e => {
				this.updateDropFeedback(tab, false, e, tabIndex);

				// compute the target index
				let targetIndex = tabIndex;
				if (this.getTabDragOverLocation(e, tab) === 'right') {
					targetIndex++;
				}

				this.onDrop(e, targetIndex, tabsContainer);
			}
		}));

		return disposables;
	}

	private isSupportedDropTransfer(e: DragEvent): boolean {
		if (this.groupTransfer.hasData(DraggedEditorGroupIdentifier.prototype)) {
			const data = this.groupTransfer.getData(DraggedEditorGroupIdentifier.prototype);
			if (Array.isArray(data) && data.length > 0) {
				const group = data[0];
				if (group.identifier === this.groupView.id) {
					return false; // groups cannot be dropped on group it originates from
				}
			}

			return true;
		}

		if (this.editorTransfer.hasData(DraggedEditorIdentifier.prototype)) {
			return true; // (local) editors can always be dropped
		}

		if (e.dataTransfer && e.dataTransfer.types.length > 0) {
			return true; // optimistically allow external data (// see https://github.com/microsoft/vscode/issues/25789)
		}

		return false;
	}

	private updateDropFeedback(element: HTMLElement, isDND: boolean, e: DragEvent, tabIndex?: number): void {
		const isTab = (typeof tabIndex === 'number');

		let dropTarget;
		if (isDND) {
			if (isTab) {
				dropTarget = this.computeDropTarget(e, tabIndex, element);
			} else {
				dropTarget = { leftElement: element.lastElementChild as HTMLElement, rightElement: undefined };
			}
		} else {
			dropTarget = undefined;
		}

		this.updateDropTarget(dropTarget);
	}

	private dropTarget: { leftElement: HTMLElement | undefined; rightElement: HTMLElement | undefined } | undefined;
	private updateDropTarget(newTarget: { leftElement: HTMLElement | undefined; rightElement: HTMLElement | undefined } | undefined): void {
		const oldTargets = this.dropTarget;
		if (oldTargets === newTarget || oldTargets && newTarget && oldTargets.leftElement === newTarget.leftElement && oldTargets.rightElement === newTarget.rightElement) {
			return;
		}

		const dropClassLeft = 'drop-target-left';
		const dropClassRight = 'drop-target-right';

		if (oldTargets) {
			oldTargets.leftElement?.classList.remove(dropClassLeft);
			oldTargets.rightElement?.classList.remove(dropClassRight);
		}

		if (newTarget) {
			newTarget.leftElement?.classList.add(dropClassLeft);
			newTarget.rightElement?.classList.add(dropClassRight);
		}

		this.dropTarget = newTarget;
	}

	private getTabDragOverLocation(e: DragEvent, tab: HTMLElement): 'left' | 'right' {
		const rect = tab.getBoundingClientRect();
		const offsetXRelativeToParent = e.clientX - rect.left;

		return offsetXRelativeToParent <= rect.width / 2 ? 'left' : 'right';
	}

	private computeDropTarget(e: DragEvent, tabIndex: number, targetTab: HTMLElement): { leftElement: HTMLElement | undefined; rightElement: HTMLElement | undefined } | undefined {
		const isLeftSideOfTab = this.getTabDragOverLocation(e, targetTab) === 'left';
		const isLastTab = tabIndex === this.tabsModel.count - 1;
		const isFirstTab = tabIndex === 0;

		// Before first tab
		if (isLeftSideOfTab && isFirstTab) {
			return { leftElement: undefined, rightElement: targetTab };
		}

		// After last tab
		if (!isLeftSideOfTab && isLastTab) {
			return { leftElement: targetTab, rightElement: undefined };
		}

		// Between two tabs
		const tabBefore = isLeftSideOfTab ? targetTab.previousElementSibling : targetTab;
		const tabAfter = isLeftSideOfTab ? targetTab : targetTab.nextElementSibling;

		return { leftElement: tabBefore as HTMLElement, rightElement: tabAfter as HTMLElement };
	}

	private async selectEditor(editor: EditorInput): Promise<void> {
		if (this.groupView.isActive(editor)) {
			return;
		}

		await this.groupView.setSelection(editor, this.groupView.selectedEditors);
	}

	private async selectEditorsBetween(target: EditorInput, anchor: EditorInput): Promise<void> {
		const editorIndex = this.groupView.getIndexOfEditor(target);
		if (editorIndex === -1) {
			throw new BugIndicatingError();
		}

		const anchorEditorIndex = this.groupView.getIndexOfEditor(anchor);
		if (anchorEditorIndex === -1) {
			throw new BugIndicatingError();
		}

		let selection = this.groupView.selectedEditors;

		// Unselect editors on other side of anchor in relation to the target
		let currentEditorIndex = anchorEditorIndex;
		while (currentEditorIndex >= 0 && currentEditorIndex <= this.groupView.count - 1) {
			currentEditorIndex = anchorEditorIndex < editorIndex ? currentEditorIndex - 1 : currentEditorIndex + 1;

			const currentEditor = this.groupView.getEditorByIndex(currentEditorIndex);
			if (!currentEditor) {
				break;
			}

			if (!this.groupView.isSelected(currentEditor)) {
				break;
			}

			selection = selection.filter(editor => !editor.matches(currentEditor));
		}

		// Select editors between anchor and target
		const fromEditorIndex = anchorEditorIndex < editorIndex ? anchorEditorIndex : editorIndex;
		const toEditorIndex = anchorEditorIndex < editorIndex ? editorIndex : anchorEditorIndex;

		const editorsToSelect = this.groupView.getEditors(EditorsOrder.SEQUENTIAL).slice(fromEditorIndex, toEditorIndex + 1);
		for (const editor of editorsToSelect) {
			if (!this.groupView.isSelected(editor)) {
				selection.push(editor);
			}
		}

		const inactiveSelectedEditors = selection.filter(editor => !editor.matches(target));
		await this.groupView.setSelection(target, inactiveSelectedEditors);
	}

	private async unselectEditor(editor: EditorInput): Promise<void> {
		const isUnselectingActiveEditor = this.groupView.isActive(editor);

		// If there is only one editor selected, do not unselect it
		if (isUnselectingActiveEditor && this.groupView.selectedEditors.length === 1) {
			return;
		}

		let newActiveEditor = assertReturnsDefined(this.groupView.activeEditor);

		// If active editor is bing unselected then find the most recently opened selected editor
		// that is not the editor being unselected
		if (isUnselectingActiveEditor) {
			const recentEditors = this.groupView.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE);
			for (let i = 1; i < recentEditors.length; i++) { // First one is the active editor
				const recentEditor = recentEditors[i];
				if (this.groupView.isSelected(recentEditor)) {
					newActiveEditor = recentEditor;
					break;
				}
			}
		}

		const inactiveSelectedEditors = this.groupView.selectedEditors.filter(e => !e.matches(editor) && !e.matches(newActiveEditor));
		await this.groupView.setSelection(newActiveEditor, inactiveSelectedEditors);
	}

	private async unselectAllEditors(): Promise<void> {
		if (this.groupView.selectedEditors.length > 1) {
			const activeEditor = assertReturnsDefined(this.groupView.activeEditor);
			await this.groupView.setSelection(activeEditor, []);
		}
	}

	private computeTabLabels(): void {
		const { labelFormat } = this.groupsView.partOptions;
		const { verbosity, shortenDuplicates } = this.getLabelConfigFlags(labelFormat);

		// Build labels and descriptions for each editor
		const labels: IEditorInputLabel[] = [];
		let activeEditorTabIndex = -1;
		this.tabsModel.getEditors(EditorsOrder.SEQUENTIAL).forEach((editor: EditorInput, tabIndex: number) => {
			labels.push({
				editor,
				name: editor.getName(),
				description: editor.getDescription(verbosity),
				forceDescription: editor.hasCapability(EditorInputCapabilities.ForceDescription),
				title: editor.getTitle(Verbosity.LONG),
				ariaLabel: computeEditorAriaLabel(editor, tabIndex, this.groupView, this.editorPartsView.count)
			});

			if (editor === this.tabsModel.activeEditor) {
				activeEditorTabIndex = tabIndex;
			}
		});

		// Shorten labels as needed
		if (shortenDuplicates) {
			this.shortenTabLabels(labels);
		}

		// Remember for fast lookup
		this.tabLabels = labels;
		this.activeTabLabel = labels[activeEditorTabIndex];
	}

	private shortenTabLabels(labels: IEditorInputLabel[]): void {

		// Gather duplicate titles, while filtering out invalid descriptions
		const mapNameToDuplicates = new Map<string, IEditorInputLabel[]>();
		for (const label of labels) {
			if (typeof label.description === 'string') {
				getOrSet(mapNameToDuplicates, label.name, []).push(label);
			} else {
				label.description = '';
			}
		}

		// Identify duplicate names and shorten descriptions
		for (const [, duplicateLabels] of mapNameToDuplicates) {

			// Remove description if the title isn't duplicated
			// and we have no indication to enforce description
			if (duplicateLabels.length === 1 && !duplicateLabels[0].forceDescription) {
				duplicateLabels[0].description = '';

				continue;
			}

			// Identify duplicate descriptions
			const mapDescriptionToDuplicates = new Map<string, IEditorInputLabel[]>();
			for (const duplicateLabel of duplicateLabels) {
				getOrSet(mapDescriptionToDuplicates, duplicateLabel.description, []).push(duplicateLabel);
			}

			// For editors with duplicate descriptions, check whether any long descriptions differ
			let useLongDescriptions = false;
			for (const [, duplicateLabels] of mapDescriptionToDuplicates) {
				if (!useLongDescriptions && duplicateLabels.length > 1) {
					const [first, ...rest] = duplicateLabels.map(({ editor }) => editor.getDescription(Verbosity.LONG));
					useLongDescriptions = rest.some(description => description !== first);
				}
			}

			// If so, replace all descriptions with long descriptions
			if (useLongDescriptions) {
				mapDescriptionToDuplicates.clear();
				for (const duplicateLabel of duplicateLabels) {
					duplicateLabel.description = duplicateLabel.editor.getDescription(Verbosity.LONG);
					getOrSet(mapDescriptionToDuplicates, duplicateLabel.description, []).push(duplicateLabel);
				}
			}

			// Obtain final set of descriptions
			const descriptions: string[] = [];
			for (const [description] of mapDescriptionToDuplicates) {
				descriptions.push(description);
			}

			// Remove description if all descriptions are identical unless forced
			if (descriptions.length === 1) {
				for (const label of mapDescriptionToDuplicates.get(descriptions[0]) || []) {
					if (!label.forceDescription) {
						label.description = '';
					}
				}

				continue;
			}

			// Shorten descriptions
			const shortenedDescriptions = shorten(descriptions, this.path.sep);
			descriptions.forEach((description, tabIndex) => {
				for (const label of mapDescriptionToDuplicates.get(description) || []) {
					label.description = shortenedDescriptions[tabIndex];
				}
			});
		}
	}

	private getLabelConfigFlags(value: string | undefined) {
		switch (value) {
			case 'short':
				return { verbosity: Verbosity.SHORT, shortenDuplicates: false };
			case 'medium':
				return { verbosity: Verbosity.MEDIUM, shortenDuplicates: false };
			case 'long':
				return { verbosity: Verbosity.LONG, shortenDuplicates: false };
			default:
				return { verbosity: Verbosity.MEDIUM, shortenDuplicates: true };
		}
	}

	private redraw(options?: IMultiEditorTabsControlLayoutOptions): void {

		// Border below tabs if any with explicit high contrast support
		if (this.tabsAndActionsContainer) {
			let tabsContainerBorderColor = this.getColor(EDITOR_GROUP_HEADER_TABS_BORDER);
			if (!tabsContainerBorderColor && isHighContrast(this.theme.type)) {
				tabsContainerBorderColor = this.getColor(TAB_BORDER) || this.getColor(contrastBorder);
			}

			if (tabsContainerBorderColor) {
				this.tabsAndActionsContainer.classList.add('tabs-border-bottom');
				this.tabsAndActionsContainer.style.setProperty('--tabs-border-bottom-color', tabsContainerBorderColor.toString());
			} else {
				this.tabsAndActionsContainer.classList.remove('tabs-border-bottom');
				this.tabsAndActionsContainer.style.removeProperty('--tabs-border-bottom-color');
			}
		}

		// For each tab
		this.forEachTab((editor, tabIndex, tabContainer, tabLabelWidget, tabLabel, tabActionBar) => {
			this.redrawTab(editor, tabIndex, tabContainer, tabLabelWidget, tabLabel, tabActionBar);
		});

		// Update Editor Actions Toolbar
		this.updateEditorActionsToolbar();

		// Ensure the active tab is always revealed
		this.layout(this.dimensions, options);
	}

	private redrawTab(editor: EditorInput, tabIndex: number, tabContainer: HTMLElement, tabLabelWidget: IResourceLabel, tabLabel: IEditorInputLabel, tabActionBar: ActionBar): void {
		const isTabSticky = this.tabsModel.isSticky(tabIndex);
		const options = this.groupsView.partOptions;

		// Label
		this.redrawTabLabel(editor, tabIndex, tabContainer, tabLabelWidget, tabLabel);

		// Action
		const hasUnpinAction = isTabSticky && options.tabActionUnpinVisibility;
		const hasCloseAction = !hasUnpinAction && options.tabActionCloseVisibility;
		const hasAction = hasUnpinAction || hasCloseAction;

		let tabAction;
		if (hasAction) {
			tabAction = hasUnpinAction ? this.unpinEditorAction : this.closeEditorAction;
		} else {
			// Even if the action is not visible, add it as it contains the dirty indicator
			tabAction = isTabSticky ? this.unpinEditorAction : this.closeEditorAction;
		}

		if (!tabActionBar.hasAction(tabAction)) {
			if (!tabActionBar.isEmpty()) {
				tabActionBar.clear();
			}

			tabActionBar.push(tabAction, { icon: true, label: false, keybinding: this.getKeybindingLabel(tabAction) });
		}

		tabContainer.classList.toggle(`pinned-action-off`, isTabSticky && !hasUnpinAction);
		tabContainer.classList.toggle(`close-action-off`, !hasUnpinAction && !hasCloseAction);

		for (const option of ['left', 'right']) {
			tabContainer.classList.toggle(`tab-actions-${option}`, hasAction && options.tabActionLocation === option);
		}

		const tabSizing = isTabSticky && options.pinnedTabSizing === 'shrink' ? 'shrink' /* treat sticky shrink tabs as tabSizing: 'shrink' */ : options.tabSizing;
		for (const option of ['fit', 'shrink', 'fixed']) {
			tabContainer.classList.toggle(`sizing-${option}`, tabSizing === option);
		}

		tabContainer.classList.toggle('has-icon', options.showIcons && options.hasIcons);

		tabContainer.classList.toggle('sticky', isTabSticky);
		for (const option of ['normal', 'compact', 'shrink']) {
			tabContainer.classList.toggle(`sticky-${option}`, isTabSticky && options.pinnedTabSizing === option);
		}

		// If not wrapping tabs, sticky compact/shrink tabs need a position to remain at their location
		// when scrolling to stay in view (requirement for position: sticky)
		if (!options.wrapTabs && isTabSticky && options.pinnedTabSizing !== 'normal') {
			let stickyTabWidth = 0;
			switch (options.pinnedTabSizing) {
				case 'compact':
					stickyTabWidth = MultiEditorTabsControl.TAB_WIDTH.compact;
					break;
				case 'shrink':
					stickyTabWidth = MultiEditorTabsControl.TAB_WIDTH.shrink;
					break;
			}

			tabContainer.style.left = `${tabIndex * stickyTabWidth}px`;
		} else {
			tabContainer.style.left = 'auto';
		}

		// Borders / outline
		this.redrawTabBorders(tabIndex, tabContainer);

		// Selection / active / dirty state
		this.redrawTabSelectedActiveAndDirty(this.groupsView.activeGroup === this.groupView, editor, tabContainer, tabActionBar);
	}

	private redrawTabLabel(editor: EditorInput, tabIndex: number, tabContainer: HTMLElement, tabLabelWidget: IResourceLabel, tabLabel: IEditorInputLabel): void {
		const options = this.groupsView.partOptions;

		// Unless tabs are sticky compact, show the full label and description
		// Sticky compact tabs will only show an icon if icons are enabled
		// or their first character of the name otherwise
		let name: string | undefined;
		let namePrefix: string | undefined;
		let forceLabel = false;
		let fileDecorationBadges = Boolean(options.decorations?.badges);
		const fileDecorationColors = Boolean(options.decorations?.colors);
		let description: string;
		if (options.pinnedTabSizing === 'compact' && this.tabsModel.isSticky(tabIndex)) {
			const isShowingIcons = options.showIcons && options.hasIcons;
			name = isShowingIcons ? '' : tabLabel.name?.charAt(0).toUpperCase();
			description = '';
			forceLabel = true;
			fileDecorationBadges = false; // not enough space when sticky tabs are compact
		} else {
			name = tabLabel.name;
			namePrefix = options.showTabIndex ? `${this.toEditorIndex(tabIndex) + 1}: ` : undefined;
			description = tabLabel.description || '';
		}

		if (tabLabel.ariaLabel) {
			tabContainer.setAttribute('aria-label', tabLabel.ariaLabel);
			// Set aria-description to empty string so that screen readers would not read the title as well
			// More details https://github.com/microsoft/vscode/issues/95378
			tabContainer.setAttribute('aria-description', '');
		}

		// Label
		tabLabelWidget.setResource(
			{ name, description, resource: EditorResourceAccessor.getOriginalUri(editor, { supportSideBySide: SideBySideEditor.BOTH }) },
			{
				title: this.getHoverTitle(editor),
				extraClasses: coalesce(['tab-label', fileDecorationBadges ? 'tab-label-has-badge' : undefined].concat(editor.getLabelExtraClasses())),
				italic: !this.tabsModel.isPinned(editor),
				forceLabel,
				fileDecorations: {
					colors: fileDecorationColors,
					badges: fileDecorationBadges
				},
				icon: editor.getIcon(),
				hideIcon: options.showIcons === false,
				namePrefix,
			}
		);

		// Tests helper
		const resource = EditorResourceAccessor.getOriginalUri(editor, { supportSideBySide: SideBySideEditor.PRIMARY });
		if (resource) {
			tabContainer.setAttribute('data-resource-name', basenameOrAuthority(resource));
		} else {
			tabContainer.removeAttribute('data-resource-name');
		}
	}

	private redrawTabSelectedActiveAndDirty(isGroupActive: boolean, editor: EditorInput, tabContainer: HTMLElement, tabActionBar: ActionBar): void {
		const isTabActive = this.tabsModel.isActive(editor);
		const hasModifiedBorderTop = this.doRedrawTabDirty(isGroupActive, isTabActive, editor, tabContainer);

		this.doRedrawTabActive(isGroupActive, !hasModifiedBorderTop, editor, tabContainer, tabActionBar);
	}

	private doRedrawTabActive(isGroupActive: boolean, allowBorderTop: boolean, editor: EditorInput, tabContainer: HTMLElement, tabActionBar: ActionBar): void {
		const isActive = this.tabsModel.isActive(editor);
		const isSelected = this.tabsModel.isSelected(editor);

		tabContainer.classList.toggle('active', isActive);
		tabContainer.classList.toggle('selected', isSelected);
		tabContainer.setAttribute('aria-selected', isActive ? 'true' : 'false');
		tabContainer.tabIndex = isActive ? 0 : -1; // Only active tab can be focused into
		tabActionBar.setFocusable(isActive);

		// Set border BOTTOM if theme defined color
		if (isActive) {
			const activeTabBorderColorBottom = this.getColor(isGroupActive ? TAB_ACTIVE_BORDER : TAB_UNFOCUSED_ACTIVE_BORDER);
			tabContainer.classList.toggle('tab-border-bottom', !!activeTabBorderColorBottom);
			tabContainer.style.setProperty('--tab-border-bottom-color', activeTabBorderColorBottom ?? '');
		}

		// Set border TOP if theme defined color
		let tabBorderColorTop: string | null = null;
		if (allowBorderTop) {
			if (isActive) {
				tabBorderColorTop = this.getColor(isGroupActive ? TAB_ACTIVE_BORDER_TOP : TAB_UNFOCUSED_ACTIVE_BORDER_TOP);
			}

			if (tabBorderColorTop === null && isSelected) {
				tabBorderColorTop = this.getColor(TAB_SELECTED_BORDER_TOP);
			}
		}

		tabContainer.classList.toggle('tab-border-top', !!tabBorderColorTop);
		tabContainer.style.setProperty('--tab-border-top-color', tabBorderColorTop ?? '');
	}

	private doRedrawTabDirty(isGroupActive: boolean, isTabActive: boolean, editor: EditorInput, tabContainer: HTMLElement): boolean {
		let hasModifiedBorderColor = false;

		// Tab: dirty (unless saving)
		if (editor.isDirty() && !editor.isSaving()) {
			tabContainer.classList.add('dirty');

			// Highlight modified tabs with a border if configured
			if (this.groupsView.partOptions.highlightModifiedTabs) {
				let modifiedBorderColor: string | null;
				if (isGroupActive && isTabActive) {
					modifiedBorderColor = this.getColor(TAB_ACTIVE_MODIFIED_BORDER);
				} else if (isGroupActive && !isTabActive) {
					modifiedBorderColor = this.getColor(TAB_INACTIVE_MODIFIED_BORDER);
				} else if (!isGroupActive && isTabActive) {
					modifiedBorderColor = this.getColor(TAB_UNFOCUSED_ACTIVE_MODIFIED_BORDER);
				} else {
					modifiedBorderColor = this.getColor(TAB_UNFOCUSED_INACTIVE_MODIFIED_BORDER);
				}

				if (modifiedBorderColor) {
					hasModifiedBorderColor = true;

					tabContainer.classList.add('dirty-border-top');
					tabContainer.style.setProperty('--tab-dirty-border-top-color', modifiedBorderColor);
				}
			} else {
				tabContainer.classList.remove('dirty-border-top');
				tabContainer.style.removeProperty('--tab-dirty-border-top-color');
			}
		}

		// Tab: not dirty
		else {
			tabContainer.classList.remove('dirty', 'dirty-border-top');
			tabContainer.style.removeProperty('--tab-dirty-border-top-color');
		}

		return hasModifiedBorderColor;
	}

	private redrawTabBorders(tabIndex: number, tabContainer: HTMLElement): void {
		const isTabSticky = this.tabsModel.isSticky(tabIndex);
		const isTabLastSticky = isTabSticky && this.tabsModel.stickyCount === tabIndex + 1;
		const showLastStickyTabBorderColor = this.tabsModel.stickyCount !== this.tabsModel.count;

		// Borders / Outline
		const borderRightColor = ((isTabLastSticky && showLastStickyTabBorderColor ? this.getColor(TAB_LAST_PINNED_BORDER) : undefined) || this.getColor(TAB_BORDER) || this.getColor(contrastBorder));
		tabContainer.style.borderRight = borderRightColor ? `1px solid ${borderRightColor}` : '';
		tabContainer.style.outlineColor = this.getColor(activeContrastBorder) || '';
	}

	protected override prepareEditorActions(editorActions: IToolbarActions): IToolbarActions {
		const isGroupActive = this.groupsView.activeGroup === this.groupView;

		// Active: allow all actions
		if (isGroupActive) {
			return editorActions;
		}

		// Inactive: only show "Unlock" and secondary actions
		else {
			return {
				primary: this.groupsView.partOptions.alwaysShowEditorActions ? editorActions.primary : editorActions.primary.filter(action => action.id === UNLOCK_GROUP_COMMAND_ID),
				secondary: editorActions.secondary
			};
		}
	}

	getHeight(): number {

		// Return quickly if our used dimensions are known
		if (this.dimensions.used) {
			return this.dimensions.used.height;
		}

		// Otherwise compute via browser APIs
		else {
			return this.computeHeight();
		}
	}

	private computeHeight(): number {
		let height: number;

		if (!this.visible) {
			height = 0;
		} else if (this.groupsView.partOptions.wrapTabs && this.tabsAndActionsContainer?.classList.contains('wrapping')) {
			// Wrap: we need to ask `offsetHeight` to get
			// the real height of the title area with wrapping.
			height = this.tabsAndActionsContainer.offsetHeight;
		} else {
			height = this.tabHeight;
		}

		return height;
	}

	layout(dimensions: IEditorTitleControlDimensions, options?: IMultiEditorTabsControlLayoutOptions): Dimension {

		// Remember dimensions that we get
		Object.assign(this.dimensions, dimensions);

		if (this.visible) {
			if (!this.layoutScheduler.value) {

				// The layout of tabs can be an expensive operation because we access DOM properties
				// that can result in the browser doing a full page layout to validate them. To buffer
				// this a little bit we try at least to schedule this work on the next animation frame
				// when we have restored or when idle otherwise.

				const disposable = scheduleAtNextAnimationFrame(getWindow(this.parent), () => {
					this.doLayout(this.dimensions, this.layoutScheduler.value?.options /* ensure to pick up latest options */);

					this.layoutScheduler.clear();
				});
				this.layoutScheduler.value = { options, dispose: () => disposable.dispose() };
			}

			// Make sure to keep options updated
			if (options?.forceRevealActiveTab) {
				this.layoutScheduler.value.options = {
					...this.layoutScheduler.value.options,
					forceRevealActiveTab: true
				};
			}
		}

		// First time layout: compute the dimensions and store it
		if (!this.dimensions.used) {
			this.dimensions.used = new Dimension(dimensions.container.width, this.computeHeight());
		}

		return this.dimensions.used;
	}

	private doLayout(dimensions: IEditorTitleControlDimensions, options?: IMultiEditorTabsControlLayoutOptions): void {

		// Layout tabs
		if (dimensions.container !== Dimension.None && dimensions.available !== Dimension.None) {
			this.doLayoutTabs(dimensions, options);
		}

		// Remember the dimensions used in the control so that we can
		// return it fast from the `layout` call without having to
		// compute it over and over again
		const oldDimension = this.dimensions.used;
		const newDimension = this.dimensions.used = new Dimension(dimensions.container.width, this.computeHeight());

		// In case the height of the title control changed from before
		// (currently only possible if wrapping changed on/off), we need
		// to signal this to the outside via a `relayout` call so that
		// e.g. the editor control can be adjusted accordingly.
		if (oldDimension && oldDimension.height !== newDimension.height) {
			this.groupView.relayout();
		}
	}

	private doLayoutTabs(dimensions: IEditorTitleControlDimensions, options?: IMultiEditorTabsControlLayoutOptions): void {

		// Always first layout tabs with wrapping support even if wrapping
		// is disabled. The result indicates if tabs wrap and if not, we
		// need to proceed with the layout without wrapping because even
		// if wrapping is enabled in settings, there are cases where
		// wrapping is disabled (e.g. due to space constraints)
		const tabsWrapMultiLine = this.doLayoutTabsWrapping(dimensions);
		if (!tabsWrapMultiLine) {
			this.doLayoutTabsNonWrapping(options);
		}
	}

	private doLayoutTabsWrapping(dimensions: IEditorTitleControlDimensions): boolean {
		const [tabsAndActionsContainer, tabsContainer, editorToolbarContainer, tabsScrollbar] = assertReturnsAllDefined(this.tabsAndActionsContainer, this.tabsContainer, this.editorActionsToolbarContainer, this.tabsScrollbar);

		// Handle wrapping tabs according to setting:
		// - enabled: only add class if tabs wrap and don't exceed available dimensions
		// - disabled: remove class and margin-right variable

		const didTabsWrapMultiLine = tabsAndActionsContainer.classList.contains('wrapping');
		let tabsWrapMultiLine = didTabsWrapMultiLine;

		function updateTabsWrapping(enabled: boolean): void {
			tabsWrapMultiLine = enabled;

			// Toggle the `wrapped` class to enable wrapping
			tabsAndActionsContainer.classList.toggle('wrapping', tabsWrapMultiLine);

			// Update `last-tab-margin-right` CSS variable to account for the absolute
			// positioned editor actions container when tabs wrap. The margin needs to
			// be the width of the editor actions container to avoid screen cheese.
			tabsContainer.style.setProperty('--last-tab-margin-right', tabsWrapMultiLine ? `${editorToolbarContainer.offsetWidth}px` : '0');

			// Remove old css classes that are not needed anymore
			for (const tab of tabsContainer.children) {
				tab.classList.remove('last-in-row');
			}
		}

		// Setting enabled: selectively enable wrapping if possible
		if (this.groupsView.partOptions.wrapTabs) {
			const visibleTabsWidth = tabsContainer.offsetWidth;
			const allTabsWidth = tabsContainer.scrollWidth;
			const lastTabFitsWrapped = () => {
				const lastTab = this.getLastTab();
				if (!lastTab) {
					return true; // no tab always fits
				}

				const lastTabOverlapWithToolbarWidth = lastTab.offsetWidth + editorToolbarContainer.offsetWidth - dimensions.available.width;
				if (lastTabOverlapWithToolbarWidth > 1) {
					// Allow for slight rounding errors related to zooming here
					// https://github.com/microsoft/vscode/issues/116385
					return false;
				}

				return true;
			};

			// If tabs wrap or should start to wrap (when width exceeds visible width)
			// we must trigger `updateWrapping` to set the `last-tab-margin-right`
			// accordingly based on the number of actions. The margin is important to
			// properly position the last tab apart from the actions
			//
			// We already check here if the last tab would fit when wrapped given the
			// editor toolbar will also show right next to it. This ensures we are not
			// enabling wrapping only to disable it again in the code below (this fixes
			// flickering issue https://github.com/microsoft/vscode/issues/115050)
			if (tabsWrapMultiLine || (allTabsWidth > visibleTabsWidth && lastTabFitsWrapped())) {
				updateTabsWrapping(true);
			}

			// Tabs wrap multiline: remove wrapping under certain size constraint conditions
			if (tabsWrapMultiLine) {
				if (
					(tabsContainer.offsetHeight > dimensions.available.height) ||							// if height exceeds available height
					(allTabsWidth === visibleTabsWidth && tabsContainer.offsetHeight === this.tabHeight) ||	// if wrapping is not needed anymore
					(!lastTabFitsWrapped())																	// if last tab does not fit anymore
				) {
					updateTabsWrapping(false);
				}
			}
		}

		// Setting disabled: remove CSS traces only if tabs did wrap
		else if (didTabsWrapMultiLine) {
			updateTabsWrapping(false);
		}

		// If we transitioned from non-wrapping to wrapping, we need
		// to update the scrollbar to have an equal `width` and
		// `scrollWidth`. Otherwise a scrollbar would appear which is
		// never desired when wrapping.
		if (tabsWrapMultiLine && !didTabsWrapMultiLine) {
			const visibleTabsWidth = tabsContainer.offsetWidth;
			tabsScrollbar.setScrollDimensions({
				width: visibleTabsWidth,
				scrollWidth: visibleTabsWidth
			});
		}

		// Update the `last-in-row` class on tabs when wrapping
		// is enabled (it doesn't do any harm otherwise). This
		// class controls additional properties of tab when it is
		// the last tab in a row
		if (tabsWrapMultiLine) {

			// Using a map here to change classes after the for loop is
			// crucial for performance because changing the class on a
			// tab can result in layouts of the rendering engine.
			const tabs = new Map<HTMLElement, boolean /* last in row */>();

			let currentTabsPosY: number | undefined = undefined;
			let lastTab: HTMLElement | undefined = undefined;
			for (const child of tabsContainer.children) {
				const tab = child as HTMLElement;
				const tabPosY = tab.offsetTop;

				// Marks a new or the first row of tabs
				if (tabPosY !== currentTabsPosY) {
					currentTabsPosY = tabPosY;
					if (lastTab) {
						tabs.set(lastTab, true); // previous tab must be last in row then
					}
				}

				// Always remember last tab and ensure the
				// last-in-row class is not present until
				// we know the tab is last
				lastTab = tab;
				tabs.set(tab, false);
			}

			// Last tab overally is always last-in-row
			if (lastTab) {
				tabs.set(lastTab, true);
			}

			for (const [tab, lastInRow] of tabs) {
				tab.classList.toggle('last-in-row', lastInRow);
			}
		}

		return tabsWrapMultiLine;
	}

	private doLayoutTabsNonWrapping(options?: IMultiEditorTabsControlLayoutOptions): void {
		const [tabsContainer, tabsScrollbar] = assertReturnsAllDefined(this.tabsContainer, this.tabsScrollbar);

		//
		// Synopsis
		// - allTabsWidth:   			sum of all tab widths
		// - stickyTabsWidth:			sum of all sticky tab widths (unless `pinnedTabSizing: normal`)
		// - visibleContainerWidth: 	size of tab container
		// - availableContainerWidth: 	size of tab container minus size of sticky tabs
		//
		// [------------------------------ All tabs width ---------------------------------------]
		// [------------------- Visible container width -------------------]
		//                         [------ Available container width ------]
		// [ Sticky A ][ Sticky B ][ Tab C ][ Tab D ][ Tab E ][ Tab F ][ Tab G ][ Tab H ][ Tab I ]
		//                 Active Tab Width [-------]
		// [------- Active Tab Pos X -------]
		// [-- Sticky Tabs Width --]
		//

		const visibleTabsWidth = tabsContainer.offsetWidth;
		const allTabsWidth = tabsContainer.scrollWidth;

		// Compute width of sticky tabs depending on pinned tab sizing
		// - compact: sticky-tabs * TAB_SIZES.compact
		// -  shrink: sticky-tabs * TAB_SIZES.shrink
		// -  normal: 0 (sticky tabs inherit look and feel from non-sticky tabs)
		let stickyTabsWidth = 0;
		if (this.tabsModel.stickyCount > 0) {
			let stickyTabWidth = 0;
			switch (this.groupsView.partOptions.pinnedTabSizing) {
				case 'compact':
					stickyTabWidth = MultiEditorTabsControl.TAB_WIDTH.compact;
					break;
				case 'shrink':
					stickyTabWidth = MultiEditorTabsControl.TAB_WIDTH.shrink;
					break;
			}

			stickyTabsWidth = this.tabsModel.stickyCount * stickyTabWidth;
		}

		const activeTabAndIndex = this.tabsModel.activeEditor ? this.getTabAndIndex(this.tabsModel.activeEditor) : undefined;
		const [activeTab, activeTabIndex] = activeTabAndIndex ?? [undefined, undefined];

		// Figure out if active tab is positioned static which has an
		// impact on whether to reveal the tab or not later
		let activeTabPositionStatic = this.groupsView.partOptions.pinnedTabSizing !== 'normal' && typeof activeTabIndex === 'number' && this.tabsModel.isSticky(activeTabIndex);

		// Special case: we have sticky tabs but the available space for showing tabs
		// is little enough that we need to disable sticky tabs sticky positioning
		// so that tabs can be scrolled at naturally.
		let availableTabsContainerWidth = visibleTabsWidth - stickyTabsWidth;
		if (this.tabsModel.stickyCount > 0 && availableTabsContainerWidth < MultiEditorTabsControl.TAB_WIDTH.fit) {
			tabsContainer.classList.add('disable-sticky-tabs');

			availableTabsContainerWidth = visibleTabsWidth;
			stickyTabsWidth = 0;
			activeTabPositionStatic = false;
		} else {
			tabsContainer.classList.remove('disable-sticky-tabs');
		}

		let activeTabPosX: number | undefined;
		let activeTabWidth: number | undefined;

		if (!this.blockRevealActiveTab && activeTab) {
			activeTabPosX = activeTab.offsetLeft;
			activeTabWidth = activeTab.offsetWidth;
		}

		// Update scrollbar
		const { width: oldVisibleTabsWidth, scrollWidth: oldAllTabsWidth } = tabsScrollbar.getScrollDimensions();
		tabsScrollbar.setScrollDimensions({
			width: visibleTabsWidth,
			scrollWidth: allTabsWidth
		});
		const dimensionsChanged = oldVisibleTabsWidth !== visibleTabsWidth || oldAllTabsWidth !== allTabsWidth;

		// Revealing the active tab is skipped under some conditions:
		if (
			this.blockRevealActiveTab ||							// explicitly disabled
			typeof activeTabPosX !== 'number' ||					// invalid dimension
			typeof activeTabWidth !== 'number' ||					// invalid dimension
			activeTabPositionStatic ||								// static tab (sticky)
			(!dimensionsChanged && !options?.forceRevealActiveTab) 	// dimensions did not change and we have low layout priority (https://github.com/microsoft/vscode/issues/133631)
		) {
			this.blockRevealActiveTab = false;
			return;
		}

		// Reveal the active one
		const tabsContainerScrollPosX = tabsScrollbar.getScrollPosition().scrollLeft;
		const activeTabFits = activeTabWidth <= availableTabsContainerWidth;
		const adjustedActiveTabPosX = activeTabPosX - stickyTabsWidth;

		//
		// Synopsis
		// - adjustedActiveTabPosX: the adjusted tabPosX takes the width of sticky tabs into account
		//   conceptually the scrolling only begins after sticky tabs so in order to reveal a tab fully
		//   the actual position needs to be adjusted for sticky tabs.
		//
		// Tab is overflowing to the right: Scroll minimally until the element is fully visible to the right
		// Note: only try to do this if we actually have enough width to give to show the tab fully!
		//
		// Example: Tab G should be made active and needs to be fully revealed as such.
		//
		// [-------------------------------- All tabs width -----------------------------------------]
		// [-------------------- Visible container width --------------------]
		//                           [----- Available container width -------]
		//     [ Sticky A ][ Sticky B ][ Tab C ][ Tab D ][ Tab E ][ Tab F ][ Tab G ][ Tab H ][ Tab I ]
		//                     Active Tab Width [-------]
		//     [------- Active Tab Pos X -------]
		//                             [-------- Adjusted Tab Pos X -------]
		//     [-- Sticky Tabs Width --]
		//
		//
		if (activeTabFits && tabsContainerScrollPosX + availableTabsContainerWidth < adjustedActiveTabPosX + activeTabWidth) {
			tabsScrollbar.setScrollPosition({
				scrollLeft: tabsContainerScrollPosX + ((adjustedActiveTabPosX + activeTabWidth) /* right corner of tab */ - (tabsContainerScrollPosX + availableTabsContainerWidth) /* right corner of view port */)
			});
		}

		//
		// Tab is overlflowing to the left or does not fit: Scroll it into view to the left
		//
		// Example: Tab C should be made active and needs to be fully revealed as such.
		//
		// [----------------------------- All tabs width ----------------------------------------]
		//     [------------------ Visible container width ------------------]
		//                           [----- Available container width -------]
		// [ Sticky A ][ Sticky B ][ Tab C ][ Tab D ][ Tab E ][ Tab F ][ Tab G ][ Tab H ][ Tab I ]
		//                 Active Tab Width [-------]
		// [------- Active Tab Pos X -------]
		//      Adjusted Tab Pos X []
		// [-- Sticky Tabs Width --]
		//
		//
		else if (tabsContainerScrollPosX > adjustedActiveTabPosX || !activeTabFits) {
			tabsScrollbar.setScrollPosition({
				scrollLeft: adjustedActiveTabPosX
			});
		}
	}

	private updateTabsControlVisibility(): void {
		const tabsAndActionsContainer = assertReturnsDefined(this.tabsAndActionsContainer);
		tabsAndActionsContainer.classList.toggle('empty', !this.visible);

		// Reset dimensions if hidden
		if (!this.visible && this.dimensions) {
			this.dimensions.used = undefined;
		}
	}

	private get visible(): boolean {
		return this.tabsModel.count > 0;
	}

	private getTabAndIndex(editor: EditorInput): [HTMLElement, number /* index */] | undefined {
		const tabIndex = this.tabsModel.indexOf(editor);
		const tab = this.getTabAtIndex(tabIndex);
		if (tab) {
			return [tab, tabIndex];
		}

		return undefined;
	}

	private getTabAtIndex(tabIndex: number): HTMLElement | undefined {
		if (tabIndex >= 0) {
			const tabsContainer = assertReturnsDefined(this.tabsContainer);

			return tabsContainer.children[tabIndex] as HTMLElement | undefined;
		}

		return undefined;
	}

	private getLastTab(): HTMLElement | undefined {
		return this.getTabAtIndex(this.tabsModel.count - 1);
	}

	private blockRevealActiveTabOnce(): void {

		// When closing tabs through the tab close button or gesture, the user
		// might want to rapidly close tabs in sequence and as such revealing
		// the active tab after each close would be annoying. As such we block
		// the automated revealing of the active tab once after the close is
		// triggered.
		this.blockRevealActiveTab = true;
	}

	private originatesFromTabActionBar(e: MouseEvent | GestureEvent): boolean {
		let element: HTMLElement;
		if (isMouseEvent(e)) {
			element = (e.target || e.srcElement) as HTMLElement;
		} else {
			element = (e as GestureEvent).initialTarget as HTMLElement;
		}

		return !!findParentWithClass(element, 'action-item', 'tab');
	}

	private async onDrop(e: DragEvent, targetTabIndex: number, tabsContainer: HTMLElement): Promise<void> {
		EventHelper.stop(e, true);

		this.updateDropFeedback(tabsContainer, false, e, targetTabIndex);
		tabsContainer.classList.remove('scroll');

		let targetEditorIndex = this.tabsModel instanceof UnstickyEditorGroupModel ? targetTabIndex + this.groupView.stickyCount : targetTabIndex;
		const options: IEditorOptions = {
			sticky: this.tabsModel instanceof StickyEditorGroupModel && this.tabsModel.stickyCount === targetEditorIndex,
			index: targetEditorIndex
		};

		// Check for group transfer
		if (this.groupTransfer.hasData(DraggedEditorGroupIdentifier.prototype)) {
			const data = this.groupTransfer.getData(DraggedEditorGroupIdentifier.prototype);
			if (Array.isArray(data) && data.length > 0) {
				const sourceGroup = this.editorPartsView.getGroup(data[0].identifier);
				if (sourceGroup) {
					const mergeGroupOptions: IMergeGroupOptions = { index: targetEditorIndex };
					if (!this.isMoveOperation(e, sourceGroup.id)) {
						mergeGroupOptions.mode = MergeGroupMode.COPY_EDITORS;
					}

					this.groupsView.mergeGroup(sourceGroup, this.groupView, mergeGroupOptions);
				}

				this.groupView.focus();
				this.groupTransfer.clearData(DraggedEditorGroupIdentifier.prototype);
			}
		}

		// Check for editor transfer
		else if (this.editorTransfer.hasData(DraggedEditorIdentifier.prototype)) {
			const data = this.editorTransfer.getData(DraggedEditorIdentifier.prototype);
			if (Array.isArray(data) && data.length > 0) {
				const sourceGroup = this.editorPartsView.getGroup(data[0].identifier.groupId);
				if (sourceGroup) {
					for (const de of data) {
						const editor = de.identifier.editor;

						// Only allow moving/copying from a single group source
						if (sourceGroup.id !== de.identifier.groupId) {
							continue;
						}

						// Keep the same order when moving / copying editors within the same group
						const sourceEditorIndex = sourceGroup.getIndexOfEditor(editor);
						if (sourceGroup === this.groupView && sourceEditorIndex < targetEditorIndex) {
							targetEditorIndex--;
						}

						if (this.isMoveOperation(e, de.identifier.groupId, editor)) {
							sourceGroup.moveEditor(editor, this.groupView, { ...options, index: targetEditorIndex });
						} else {
							sourceGroup.copyEditor(editor, this.groupView, { ...options, index: targetEditorIndex });
						}

						targetEditorIndex++;
					}
				}
			}

			this.groupView.focus();
			this.editorTransfer.clearData(DraggedEditorIdentifier.prototype);
		}

		// Check for tree items
		else if (this.treeItemsTransfer.hasData(DraggedTreeItemsIdentifier.prototype)) {
			const data = this.treeItemsTransfer.getData(DraggedTreeItemsIdentifier.prototype);
			if (Array.isArray(data) && data.length > 0) {
				const editors: IUntypedEditorInput[] = [];
				for (const id of data) {
					const dataTransferItem = await this.treeViewsDragAndDropService.removeDragOperationTransfer(id.identifier);
					if (dataTransferItem) {
						const treeDropData = await extractTreeDropData(dataTransferItem);
						editors.push(...treeDropData.map(editor => ({ ...editor, options: { ...editor.options, pinned: true, index: targetEditorIndex } })));
					}
				}

				this.editorService.openEditors(editors, this.groupView, { validateTrust: true });
			}

			this.treeItemsTransfer.clearData(DraggedTreeItemsIdentifier.prototype);
		}

		// Check for URI transfer
		else {
			const dropHandler = this.instantiationService.createInstance(ResourcesDropHandler, { allowWorkspaceOpen: false });
			dropHandler.handleDrop(e, getWindow(this.parent), () => this.groupView, () => this.groupView.focus(), options);
		}
	}

	override dispose(): void {
		super.dispose();

		this.tabDisposables = dispose(this.tabDisposables);
	}
}

registerThemingParticipant((theme, collector) => {

	// Add bottom border to tabs when wrapping
	const borderColor = theme.getColor(TAB_BORDER);
	if (borderColor) {
		collector.addRule(`
			.monaco-workbench .part.editor > .content .editor-group-container > .title > .tabs-and-actions-container.wrapping .tabs-container > .tab {
				border-bottom: 1px solid ${borderColor};
			}
		`);
	}

	// Styling with Outline color (e.g. high contrast theme)
	const activeContrastBorderColor = theme.getColor(activeContrastBorder);
	if (activeContrastBorderColor) {
		collector.addRule(`
			.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab.active,
			.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab.active:hover  {
				outline: 1px solid;
				outline-offset: -5px;
			}

			.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.selected:not(.active):not(:hover)  {
				outline: 1px dotted;
				outline-offset: -5px;
			}

			.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab.active:focus {
				outline-style: dashed;
			}

			.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.active {
				outline: 1px dotted;
				outline-offset: -5px;
			}

			.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab:hover  {
				outline: 1px dashed;
				outline-offset: -5px;
			}

			.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.active > .tab-actions .action-label,
			.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.active:hover > .tab-actions .action-label,
			.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.dirty > .tab-actions .action-label,
			.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sticky > .tab-actions .action-label,
			.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab:hover > .tab-actions .action-label {
				opacity: 1 !important;
			}
		`);
	}

	// High Contrast Border Color for Editor Actions
	const contrastBorderColor = theme.getColor(contrastBorder);
	if (contrastBorderColor) {
		collector.addRule(`
			.monaco-workbench .part.editor > .content .editor-group-container > .title .editor-actions {
				outline: 1px solid ${contrastBorderColor}
			}
		`);
	}

	// Hover Background
	const tabHoverBackground = theme.getColor(TAB_HOVER_BACKGROUND);
	if (tabHoverBackground) {
		collector.addRule(`
			.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab:not(.selected):hover {
				background-color: ${tabHoverBackground} !important;
			}
		`);
	}

	const tabUnfocusedHoverBackground = theme.getColor(TAB_UNFOCUSED_HOVER_BACKGROUND);
	if (tabUnfocusedHoverBackground) {
		collector.addRule(`
			.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab:not(.selected):hover  {
				background-color: ${tabUnfocusedHoverBackground} !important;
			}
		`);
	}

	// Hover Foreground
	const tabHoverForeground = theme.getColor(TAB_HOVER_FOREGROUND);
	if (tabHoverForeground) {
		collector.addRule(`
			.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab:not(.selected):hover  {
				color: ${tabHoverForeground} !important;
			}
		`);
	}

	const tabUnfocusedHoverForeground = theme.getColor(TAB_UNFOCUSED_HOVER_FOREGROUND);
	if (tabUnfocusedHoverForeground) {
		collector.addRule(`
			.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab:not(.selected):hover  {
				color: ${tabUnfocusedHoverForeground} !important;
			}
		`);
	}

	// Hover Border
	//
	// Unfortunately we need to copy a lot of CSS over from the
	// multiEditorTabsControl.css because we want to reuse the same
	// styles we already have for the normal bottom-border.
	const tabHoverBorder = theme.getColor(TAB_HOVER_BORDER);
	if (tabHoverBorder) {
		collector.addRule(`
			.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab:hover > .tab-border-bottom-container {
				display: block;
				position: absolute;
				left: 0;
				pointer-events: none;
				width: 100%;
				z-index: 10;
				bottom: 0;
				height: 1px;
				background-color: ${tabHoverBorder};
			}
		`);
	}

	const tabUnfocusedHoverBorder = theme.getColor(TAB_UNFOCUSED_HOVER_BORDER);
	if (tabUnfocusedHoverBorder) {
		collector.addRule(`
			.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab:hover > .tab-border-bottom-container  {
				display: block;
				position: absolute;
				left: 0;
				pointer-events: none;
				width: 100%;
				z-index: 10;
				bottom: 0;
				height: 1px;
				background-color: ${tabUnfocusedHoverBorder};
			}
		`);
	}

	// Fade out styles via linear gradient (when tabs are set to shrink or fixed)
	// But not when:
	// - in high contrast theme
	// - if we have a contrast border (which draws an outline - https://github.com/microsoft/vscode/issues/109117)
	// - on Safari (https://github.com/microsoft/vscode/issues/108996)
	if (!isHighContrast(theme.type) && !isSafari && !activeContrastBorderColor) {
		const workbenchBackground = WORKBENCH_BACKGROUND(theme);
		const editorBackgroundColor = theme.getColor(editorBackground);
		const editorGroupHeaderTabsBackground = theme.getColor(EDITOR_GROUP_HEADER_TABS_BACKGROUND);
		const editorDragAndDropBackground = theme.getColor(EDITOR_DRAG_AND_DROP_BACKGROUND);

		let adjustedTabBackground: Color | undefined;
		if (editorGroupHeaderTabsBackground && editorBackgroundColor) {
			adjustedTabBackground = editorGroupHeaderTabsBackground.flatten(editorBackgroundColor, editorBackgroundColor, workbenchBackground);
		}

		let adjustedTabDragBackground: Color | undefined;
		if (editorGroupHeaderTabsBackground && editorBackgroundColor && editorDragAndDropBackground && editorBackgroundColor) {
			adjustedTabDragBackground = editorGroupHeaderTabsBackground.flatten(editorBackgroundColor, editorDragAndDropBackground, editorBackgroundColor, workbenchBackground);
		}

		// Adjust gradient for focused and unfocused hover background
		const makeTabHoverBackgroundRule = (color: Color, colorDrag: Color, hasFocus = false) => `
			.monaco-workbench .part.editor > .content:not(.dragged-over) .editor-group-container${hasFocus ? '.active' : ''} > .title .tabs-container > .tab.sizing-shrink:not(.dragged):not(.sticky-compact):hover > .tab-label > .monaco-icon-label-container::after,
			.monaco-workbench .part.editor > .content:not(.dragged-over) .editor-group-container${hasFocus ? '.active' : ''} > .title .tabs-container > .tab.sizing-fixed:not(.dragged):not(.sticky-compact):hover > .tab-label > .monaco-icon-label-container::after {
				background: linear-gradient(to left, ${color}, transparent) !important;
			}

			.monaco-workbench .part.editor > .content.dragged-over .editor-group-container${hasFocus ? '.active' : ''} > .title .tabs-container > .tab.sizing-shrink:not(.dragged):not(.sticky-compact):hover > .tab-label > .monaco-icon-label-container::after,
			.monaco-workbench .part.editor > .content.dragged-over .editor-group-container${hasFocus ? '.active' : ''} > .title .tabs-container > .tab.sizing-fixed:not(.dragged):not(.sticky-compact):hover > .tab-label > .monaco-icon-label-container::after {
				background: linear-gradient(to left, ${colorDrag}, transparent) !important;
			}
		`;

		// Adjust gradient for (focused) hover background
		if (tabHoverBackground && adjustedTabBackground && adjustedTabDragBackground) {
			const adjustedColor = tabHoverBackground.flatten(adjustedTabBackground);
			const adjustedColorDrag = tabHoverBackground.flatten(adjustedTabDragBackground);
			collector.addRule(makeTabHoverBackgroundRule(adjustedColor, adjustedColorDrag, true));
		}

		// Adjust gradient for unfocused hover background
		if (tabUnfocusedHoverBackground && adjustedTabBackground && adjustedTabDragBackground) {
			const adjustedColor = tabUnfocusedHoverBackground.flatten(adjustedTabBackground);
			const adjustedColorDrag = tabUnfocusedHoverBackground.flatten(adjustedTabDragBackground);
			collector.addRule(makeTabHoverBackgroundRule(adjustedColor, adjustedColorDrag));
		}

		// Adjust gradient for drag and drop background
		if (editorDragAndDropBackground && adjustedTabDragBackground) {
			const adjustedColorDrag = editorDragAndDropBackground.flatten(adjustedTabDragBackground);
			collector.addRule(`
				.monaco-workbench .part.editor > .content.dragged-over .editor-group-container.active > .title .tabs-container > .tab.sizing-shrink.dragged-over:not(.active):not(.dragged):not(.sticky-compact) > .tab-label > .monaco-icon-label-container::after,
				.monaco-workbench .part.editor > .content.dragged-over .editor-group-container:not(.active) > .title .tabs-container > .tab.sizing-shrink.dragged-over:not(.dragged):not(.sticky-compact) > .tab-label > .monaco-icon-label-container::after,
				.monaco-workbench .part.editor > .content.dragged-over .editor-group-container.active > .title .tabs-container > .tab.sizing-fixed.dragged-over:not(.active):not(.dragged):not(.sticky-compact) > .tab-label > .monaco-icon-label-container::after,
				.monaco-workbench .part.editor > .content.dragged-over .editor-group-container:not(.active) > .title .tabs-container > .tab.sizing-fixed.dragged-over:not(.dragged):not(.sticky-compact) > .tab-label > .monaco-icon-label-container::after {
					background: linear-gradient(to left, ${adjustedColorDrag}, transparent) !important;
				}
		`);
		}

		const makeTabBackgroundRule = (color: Color, colorDrag: Color, focused: boolean, active: boolean) => `
				.monaco-workbench .part.editor > .content:not(.dragged-over) .editor-group-container${focused ? '.active' : ':not(.active)'} > .title .tabs-container > .tab.sizing-shrink${active ? '.active' : ''}:not(.dragged):not(.sticky-compact) > .tab-label > .monaco-icon-label-container::after,
				.monaco-workbench .part.editor > .content:not(.dragged-over) .editor-group-container${focused ? '.active' : ':not(.active)'} > .title .tabs-container > .tab.sizing-fixed${active ? '.active' : ''}:not(.dragged):not(.sticky-compact) > .tab-label > .monaco-icon-label-container::after {
					background: linear-gradient(to left, ${color}, transparent);
				}

				.monaco-workbench .part.editor > .content.dragged-over .editor-group-container${focused ? '.active' : ':not(.active)'} > .title .tabs-container > .tab.sizing-shrink${active ? '.active' : ''}:not(.dragged):not(.sticky-compact) > .tab-label > .monaco-icon-label-container::after,
				.monaco-workbench .part.editor > .content.dragged-over .editor-group-container${focused ? '.active' : ':not(.active)'} > .title .tabs-container > .tab.sizing-fixed${active ? '.active' : ''}:not(.dragged):not(.sticky-compact) > .tab-label > .monaco-icon-label-container::after {
					background: linear-gradient(to left, ${colorDrag}, transparent);
				}
		`;

		// Adjust gradient for focused active tab background
		const tabActiveBackground = theme.getColor(TAB_ACTIVE_BACKGROUND);
		if (tabActiveBackground && adjustedTabBackground && adjustedTabDragBackground) {
			const adjustedColor = tabActiveBackground.flatten(adjustedTabBackground);
			const adjustedColorDrag = tabActiveBackground.flatten(adjustedTabDragBackground);
			collector.addRule(makeTabBackgroundRule(adjustedColor, adjustedColorDrag, true, true));
		}

		// Adjust gradient for unfocused active tab background
		const tabUnfocusedActiveBackground = theme.getColor(TAB_UNFOCUSED_ACTIVE_BACKGROUND);
		if (tabUnfocusedActiveBackground && adjustedTabBackground && adjustedTabDragBackground) {
			const adjustedColor = tabUnfocusedActiveBackground.flatten(adjustedTabBackground);
			const adjustedColorDrag = tabUnfocusedActiveBackground.flatten(adjustedTabDragBackground);
			collector.addRule(makeTabBackgroundRule(adjustedColor, adjustedColorDrag, false, true));
		}

		// Adjust gradient for focused inactive tab background
		const tabInactiveBackground = theme.getColor(TAB_INACTIVE_BACKGROUND);
		if (tabInactiveBackground && adjustedTabBackground && adjustedTabDragBackground) {
			const adjustedColor = tabInactiveBackground.flatten(adjustedTabBackground);
			const adjustedColorDrag = tabInactiveBackground.flatten(adjustedTabDragBackground);
			collector.addRule(makeTabBackgroundRule(adjustedColor, adjustedColorDrag, true, false));
		}

		// Adjust gradient for unfocused inactive tab background
		const tabUnfocusedInactiveBackground = theme.getColor(TAB_UNFOCUSED_INACTIVE_BACKGROUND);
		if (tabUnfocusedInactiveBackground && adjustedTabBackground && adjustedTabDragBackground) {
			const adjustedColor = tabUnfocusedInactiveBackground.flatten(adjustedTabBackground);
			const adjustedColorDrag = tabUnfocusedInactiveBackground.flatten(adjustedTabDragBackground);
			collector.addRule(makeTabBackgroundRule(adjustedColor, adjustedColorDrag, false, false));
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/multiRowEditorTabsControl.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/multiRowEditorTabsControl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Dimension } from '../../../../base/browser/dom.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IEditorGroupsView, IEditorGroupView, IEditorPartsView, IInternalEditorOpenOptions } from './editor.js';
import { IEditorTabsControl } from './editorTabsControl.js';
import { MultiEditorTabsControl } from './multiEditorTabsControl.js';
import { IEditorPartOptions } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { StickyEditorGroupModel, UnstickyEditorGroupModel } from '../../../common/editor/filteredEditorGroupModel.js';
import { IEditorTitleControlDimensions } from './editorTitleControl.js';
import { IReadonlyEditorGroupModel } from '../../../common/editor/editorGroupModel.js';

export class MultiRowEditorControl extends Disposable implements IEditorTabsControl {

	private readonly stickyEditorTabsControl: IEditorTabsControl;
	private readonly unstickyEditorTabsControl: IEditorTabsControl;

	private activeControl: IEditorTabsControl | undefined;

	constructor(
		private readonly parent: HTMLElement,
		editorPartsView: IEditorPartsView,
		private readonly groupsView: IEditorGroupsView,
		private readonly groupView: IEditorGroupView,
		private readonly model: IReadonlyEditorGroupModel,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();

		const stickyModel = this._register(new StickyEditorGroupModel(this.model));
		const unstickyModel = this._register(new UnstickyEditorGroupModel(this.model));

		this.stickyEditorTabsControl = this._register(this.instantiationService.createInstance(MultiEditorTabsControl, this.parent, editorPartsView, this.groupsView, this.groupView, stickyModel));
		this.unstickyEditorTabsControl = this._register(this.instantiationService.createInstance(MultiEditorTabsControl, this.parent, editorPartsView, this.groupsView, this.groupView, unstickyModel));

		this.handleTabBarsStateChange();
	}

	private handleTabBarsStateChange(): void {
		this.activeControl = this.model.activeEditor ? this.getEditorTabsController(this.model.activeEditor) : undefined;
		this.handleTabBarsLayoutChange();
	}

	private handleTabBarsLayoutChange(): void {
		if (this.groupView.count === 0) {
			// Do nothing as no tab bar is visible
			return;
		}

		const hadTwoTabBars = this.parent.classList.contains('two-tab-bars');
		const hasTwoTabBars = this.groupView.count !== this.groupView.stickyCount && this.groupView.stickyCount > 0;

		// Ensure action toolbar is only visible once
		this.parent.classList.toggle('two-tab-bars', hasTwoTabBars);

		if (hadTwoTabBars !== hasTwoTabBars) {
			this.groupView.relayout();
		}
	}

	private didActiveControlChange() {
		return this.activeControl !== (this.model.activeEditor ? this.getEditorTabsController(this.model.activeEditor) : undefined);
	}

	private getEditorTabsController(editor: EditorInput): IEditorTabsControl {
		return this.model.isSticky(editor) ? this.stickyEditorTabsControl : this.unstickyEditorTabsControl;
	}

	openEditor(editor: EditorInput, options: IInternalEditorOpenOptions): boolean {
		const didActiveControlChange = this.didActiveControlChange();
		const didOpenEditorChange = this.getEditorTabsController(editor).openEditor(editor, options);

		const didChange = didOpenEditorChange || didActiveControlChange;
		if (didChange) {
			this.handleOpenedEditors();
		}
		return didChange;
	}

	openEditors(editors: EditorInput[]): boolean {
		const stickyEditors = editors.filter(e => this.model.isSticky(e));
		const unstickyEditors = editors.filter(e => !this.model.isSticky(e));

		const didActiveControlChange = this.didActiveControlChange();
		const didChangeOpenEditorsSticky = this.stickyEditorTabsControl.openEditors(stickyEditors);
		const didChangeOpenEditorsUnSticky = this.unstickyEditorTabsControl.openEditors(unstickyEditors);

		const didChange = didChangeOpenEditorsSticky || didChangeOpenEditorsUnSticky || didActiveControlChange;
		if (didChange) {
			this.handleOpenedEditors();
		}

		return didChange;
	}

	private handleOpenedEditors(): void {
		this.handleTabBarsStateChange();
	}

	beforeCloseEditor(editor: EditorInput): void {
		this.getEditorTabsController(editor).beforeCloseEditor(editor);
	}

	closeEditor(editor: EditorInput): void {
		// Has to be called on both tab bars as the editor could be either sticky or not
		this.stickyEditorTabsControl.closeEditor(editor);
		this.unstickyEditorTabsControl.closeEditor(editor);

		this.handleClosedEditors();
	}

	closeEditors(editors: EditorInput[]): void {
		const stickyEditors = editors.filter(e => this.model.isSticky(e));
		const unstickyEditors = editors.filter(e => !this.model.isSticky(e));

		this.stickyEditorTabsControl.closeEditors(stickyEditors);
		this.unstickyEditorTabsControl.closeEditors(unstickyEditors);

		this.handleClosedEditors();
	}

	private handleClosedEditors(): void {
		this.handleTabBarsStateChange();
	}

	moveEditor(editor: EditorInput, fromIndex: number, targetIndex: number, stickyStateChange: boolean): void {
		if (stickyStateChange) {
			// If sticky state changes, move editor between tab bars
			if (this.model.isSticky(editor)) {
				this.stickyEditorTabsControl.openEditor(editor);
				this.unstickyEditorTabsControl.closeEditor(editor);
			} else {
				this.stickyEditorTabsControl.closeEditor(editor);
				this.unstickyEditorTabsControl.openEditor(editor);
			}

			this.handleTabBarsStateChange();

		} else {
			if (this.model.isSticky(editor)) {
				this.stickyEditorTabsControl.moveEditor(editor, fromIndex, targetIndex, stickyStateChange);
			} else {
				this.unstickyEditorTabsControl.moveEditor(editor, fromIndex - this.model.stickyCount, targetIndex - this.model.stickyCount, stickyStateChange);
			}
		}
	}

	pinEditor(editor: EditorInput): void {
		this.getEditorTabsController(editor).pinEditor(editor);
	}

	stickEditor(editor: EditorInput): void {
		this.unstickyEditorTabsControl.closeEditor(editor);
		this.stickyEditorTabsControl.openEditor(editor);

		this.handleTabBarsStateChange();
	}

	unstickEditor(editor: EditorInput): void {
		this.stickyEditorTabsControl.closeEditor(editor);
		this.unstickyEditorTabsControl.openEditor(editor);

		this.handleTabBarsStateChange();
	}

	setActive(isActive: boolean): void {
		this.stickyEditorTabsControl.setActive(isActive);
		this.unstickyEditorTabsControl.setActive(isActive);
	}

	updateEditorSelections(): void {
		this.stickyEditorTabsControl.updateEditorSelections();
		this.unstickyEditorTabsControl.updateEditorSelections();
	}

	updateEditorLabel(editor: EditorInput): void {
		this.getEditorTabsController(editor).updateEditorLabel(editor);
	}

	updateEditorDirty(editor: EditorInput): void {
		this.getEditorTabsController(editor).updateEditorDirty(editor);
	}

	updateOptions(oldOptions: IEditorPartOptions, newOptions: IEditorPartOptions): void {
		this.stickyEditorTabsControl.updateOptions(oldOptions, newOptions);
		this.unstickyEditorTabsControl.updateOptions(oldOptions, newOptions);
	}

	layout(dimensions: IEditorTitleControlDimensions): Dimension {
		const stickyDimensions = this.stickyEditorTabsControl.layout(dimensions);
		const unstickyAvailableDimensions = {
			container: dimensions.container,
			available: new Dimension(dimensions.available.width, dimensions.available.height - stickyDimensions.height)
		};
		const unstickyDimensions = this.unstickyEditorTabsControl.layout(unstickyAvailableDimensions);

		return new Dimension(
			dimensions.container.width,
			stickyDimensions.height + unstickyDimensions.height
		);
	}

	getHeight(): number {
		return this.stickyEditorTabsControl.getHeight() + this.unstickyEditorTabsControl.getHeight();
	}

	override dispose(): void {
		this.parent.classList.toggle('two-tab-bars', false);

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/noEditorTabsControl.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/noEditorTabsControl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/singleeditortabscontrol.css';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { EditorTabsControl } from './editorTabsControl.js';
import { Dimension } from '../../../../base/browser/dom.js';
import { IEditorTitleControlDimensions } from './editorTitleControl.js';
import { IToolbarActions } from '../../../common/editor.js';

export class NoEditorTabsControl extends EditorTabsControl {
	private activeEditor: EditorInput | null = null;

	protected prepareEditorActions(editorActions: IToolbarActions): IToolbarActions {
		return {
			primary: [],
			secondary: []
		};
	}

	openEditor(editor: EditorInput): boolean {
		return this.handleOpenedEditors();
	}

	openEditors(editors: EditorInput[]): boolean {
		return this.handleOpenedEditors();
	}

	private handleOpenedEditors(): boolean {
		const didChange = this.activeEditorChanged();
		this.activeEditor = this.tabsModel.activeEditor;
		return didChange;
	}

	private activeEditorChanged(): boolean {
		if (
			!this.activeEditor && this.tabsModel.activeEditor || 				// active editor changed from null => editor
			this.activeEditor && !this.tabsModel.activeEditor || 				// active editor changed from editor => null
			(!this.activeEditor || !this.tabsModel.isActive(this.activeEditor))	// active editor changed from editorA => editorB
		) {
			return true;
		}
		return false;
	}

	beforeCloseEditor(editor: EditorInput): void { }

	closeEditor(editor: EditorInput): void {
		this.handleClosedEditors();
	}

	closeEditors(editors: EditorInput[]): void {
		this.handleClosedEditors();
	}

	private handleClosedEditors(): void {
		this.activeEditor = this.tabsModel.activeEditor;
	}

	moveEditor(editor: EditorInput, fromIndex: number, targetIndex: number): void { }

	pinEditor(editor: EditorInput): void { }

	stickEditor(editor: EditorInput): void { }

	unstickEditor(editor: EditorInput): void { }

	setActive(isActive: boolean): void { }

	updateEditorSelections(): void { }

	updateEditorLabel(editor: EditorInput): void { }

	updateEditorDirty(editor: EditorInput): void { }

	getHeight(): number {
		return 0;
	}

	layout(dimensions: IEditorTitleControlDimensions): Dimension {
		return new Dimension(dimensions.container.width, this.getHeight());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/sideBySideEditor.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/sideBySideEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/sidebysideeditor.css';
import { localize } from '../../../../nls.js';
import { Dimension, $, clearNode } from '../../../../base/browser/dom.js';
import { multibyteAwareBtoa } from '../../../../base/common/strings.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IEditorControl, IEditorPane, IEditorOpenContext, EditorExtensions, SIDE_BY_SIDE_EDITOR_ID, SideBySideEditor as Side, IEditorPaneSelection, IEditorPaneWithSelection, IEditorPaneSelectionChangeEvent, isEditorPaneWithSelection, EditorPaneSelectionCompareResult } from '../../../common/editor.js';
import { SideBySideEditorInput } from '../../../common/editor/sideBySideEditorInput.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { EditorPane } from './editorPane.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IEditorPaneRegistry } from '../../editor.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IEditorGroup, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { SplitView, Sizing, Orientation } from '../../../../base/browser/ui/splitview/splitview.js';
import { Event, Relay, Emitter } from '../../../../base/common/event.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IConfigurationChangeEvent, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { DEFAULT_EDITOR_MIN_DIMENSIONS } from './editor.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { SIDE_BY_SIDE_EDITOR_HORIZONTAL_BORDER, SIDE_BY_SIDE_EDITOR_VERTICAL_BORDER } from '../../../common/theme.js';
import { AbstractEditorWithViewState } from './editorWithViewState.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { IBoundarySashes } from '../../../../base/browser/ui/sash/sash.js';

interface ISideBySideEditorViewState {
	primary: object;
	secondary: object;
	focus: Side.PRIMARY | Side.SECONDARY | undefined;
	ratio: number | undefined;
}

function isSideBySideEditorViewState(thing: unknown): thing is ISideBySideEditorViewState {
	const candidate = thing as ISideBySideEditorViewState | undefined;

	return typeof candidate?.primary === 'object' && typeof candidate.secondary === 'object';
}

interface ISideBySideEditorOptions extends IEditorOptions {

	/**
	 * Whether the editor options should apply to
	 * the primary or secondary side.
	 *
	 * If a target side is provided, that side will
	 * also receive keyboard focus unless focus is
	 * to be preserved.
	 */
	target?: Side.PRIMARY | Side.SECONDARY;
}

export class SideBySideEditor extends AbstractEditorWithViewState<ISideBySideEditorViewState> implements IEditorPaneWithSelection {

	static readonly ID: string = SIDE_BY_SIDE_EDITOR_ID;

	static SIDE_BY_SIDE_LAYOUT_SETTING = 'workbench.editor.splitInGroupLayout';

	private static readonly VIEW_STATE_PREFERENCE_KEY = 'sideBySideEditorViewState';

	//#region Layout Constraints

	private get minimumPrimaryWidth() { return this.primaryEditorPane ? this.primaryEditorPane.minimumWidth : 0; }
	private get maximumPrimaryWidth() { return this.primaryEditorPane ? this.primaryEditorPane.maximumWidth : Number.POSITIVE_INFINITY; }
	private get minimumPrimaryHeight() { return this.primaryEditorPane ? this.primaryEditorPane.minimumHeight : 0; }
	private get maximumPrimaryHeight() { return this.primaryEditorPane ? this.primaryEditorPane.maximumHeight : Number.POSITIVE_INFINITY; }

	private get minimumSecondaryWidth() { return this.secondaryEditorPane ? this.secondaryEditorPane.minimumWidth : 0; }
	private get maximumSecondaryWidth() { return this.secondaryEditorPane ? this.secondaryEditorPane.maximumWidth : Number.POSITIVE_INFINITY; }
	private get minimumSecondaryHeight() { return this.secondaryEditorPane ? this.secondaryEditorPane.minimumHeight : 0; }
	private get maximumSecondaryHeight() { return this.secondaryEditorPane ? this.secondaryEditorPane.maximumHeight : Number.POSITIVE_INFINITY; }

	override set minimumWidth(value: number) { /* noop */ }
	override set maximumWidth(value: number) { /* noop */ }
	override set minimumHeight(value: number) { /* noop */ }
	override set maximumHeight(value: number) { /* noop */ }

	override get minimumWidth() { return this.minimumPrimaryWidth + this.minimumSecondaryWidth; }
	override get maximumWidth() { return this.maximumPrimaryWidth + this.maximumSecondaryWidth; }
	override get minimumHeight() { return this.minimumPrimaryHeight + this.minimumSecondaryHeight; }
	override get maximumHeight() { return this.maximumPrimaryHeight + this.maximumSecondaryHeight; }

	private _boundarySashes: IBoundarySashes | undefined;

	//#endregion

	//#region Events

	private onDidCreateEditors = this._register(new Emitter<{ width: number; height: number } | undefined>());

	private _onDidChangeSizeConstraints = this._register(new Relay<{ width: number; height: number } | undefined>());
	override readonly onDidChangeSizeConstraints = Event.any(this.onDidCreateEditors.event, this._onDidChangeSizeConstraints.event);

	private readonly _onDidChangeSelection = this._register(new Emitter<IEditorPaneSelectionChangeEvent>());
	readonly onDidChangeSelection = this._onDidChangeSelection.event;

	//#endregion

	private primaryEditorPane: EditorPane | undefined = undefined;
	private secondaryEditorPane: EditorPane | undefined = undefined;

	private primaryEditorContainer: HTMLElement | undefined;
	private secondaryEditorContainer: HTMLElement | undefined;

	private splitview: SplitView | undefined;

	private readonly splitviewDisposables = this._register(new DisposableStore());
	private readonly editorDisposables = this._register(new DisposableStore());

	private orientation: Orientation;
	private dimension = new Dimension(0, 0);

	private lastFocusedSide: Side.PRIMARY | Side.SECONDARY | undefined = undefined;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@IEditorService editorService: IEditorService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService
	) {
		super(SideBySideEditor.ID, group, SideBySideEditor.VIEW_STATE_PREFERENCE_KEY, telemetryService, instantiationService, storageService, textResourceConfigurationService, themeService, editorService, editorGroupService);

		this.orientation = this.configurationService.getValue<'vertical' | 'horizontal'>(SideBySideEditor.SIDE_BY_SIDE_LAYOUT_SETTING) === 'vertical' ? Orientation.VERTICAL : Orientation.HORIZONTAL;

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.configurationService.onDidChangeConfiguration(e => this.onConfigurationUpdated(e)));
	}

	private onConfigurationUpdated(event: IConfigurationChangeEvent): void {
		if (event.affectsConfiguration(SideBySideEditor.SIDE_BY_SIDE_LAYOUT_SETTING)) {
			this.orientation = this.configurationService.getValue<'vertical' | 'horizontal'>(SideBySideEditor.SIDE_BY_SIDE_LAYOUT_SETTING) === 'vertical' ? Orientation.VERTICAL : Orientation.HORIZONTAL;

			// If config updated from event, re-create the split
			// editor using the new layout orientation if it was
			// already created.
			if (this.splitview) {
				this.recreateSplitview();
			}
		}
	}

	private recreateSplitview(): void {
		const container = assertReturnsDefined(this.getContainer());

		// Clear old (if any) but remember ratio
		const ratio = this.getSplitViewRatio();
		if (this.splitview) {
			this.splitview.el.remove();
			this.splitviewDisposables.clear();
		}

		// Create new
		this.createSplitView(container, ratio);

		this.layout(this.dimension);
	}

	private getSplitViewRatio(): number | undefined {
		let ratio: number | undefined = undefined;

		if (this.splitview) {
			const leftViewSize = this.splitview.getViewSize(0);
			const rightViewSize = this.splitview.getViewSize(1);

			// Only return a ratio when the view size is significantly
			// enough different for left and right view sizes
			if (Math.abs(leftViewSize - rightViewSize) > 1) {
				const totalSize = this.splitview.orientation === Orientation.HORIZONTAL ? this.dimension.width : this.dimension.height;
				ratio = leftViewSize / totalSize;
			}
		}

		return ratio;
	}

	protected createEditor(parent: HTMLElement): void {
		parent.classList.add('side-by-side-editor');

		// Editor pane containers
		this.secondaryEditorContainer = $('.side-by-side-editor-container.editor-instance');
		this.primaryEditorContainer = $('.side-by-side-editor-container.editor-instance');

		// Split view
		this.createSplitView(parent);
	}

	private createSplitView(parent: HTMLElement, ratio?: number): void {

		// Splitview widget
		this.splitview = this.splitviewDisposables.add(new SplitView(parent, { orientation: this.orientation }));
		this.splitviewDisposables.add(this.splitview.onDidSashReset(() => this.splitview?.distributeViewSizes()));

		if (this.orientation === Orientation.HORIZONTAL) {
			this.splitview.orthogonalEndSash = this._boundarySashes?.bottom;
		} else {
			this.splitview.orthogonalStartSash = this._boundarySashes?.left;
			this.splitview.orthogonalEndSash = this._boundarySashes?.right;
		}

		// Figure out sizing
		let leftSizing: number | Sizing = Sizing.Distribute;
		let rightSizing: number | Sizing = Sizing.Distribute;
		if (ratio) {
			const totalSize = this.splitview.orientation === Orientation.HORIZONTAL ? this.dimension.width : this.dimension.height;

			leftSizing = Math.round(totalSize * ratio);
			rightSizing = totalSize - leftSizing;

			// We need to call `layout` for the `ratio` to have any effect
			this.splitview.layout(this.orientation === Orientation.HORIZONTAL ? this.dimension.width : this.dimension.height);
		}

		// Secondary (left)
		const secondaryEditorContainer = assertReturnsDefined(this.secondaryEditorContainer);
		this.splitview.addView({
			element: secondaryEditorContainer,
			layout: size => this.layoutPane(this.secondaryEditorPane, size),
			minimumSize: this.orientation === Orientation.HORIZONTAL ? DEFAULT_EDITOR_MIN_DIMENSIONS.width : DEFAULT_EDITOR_MIN_DIMENSIONS.height,
			maximumSize: Number.POSITIVE_INFINITY,
			onDidChange: Event.None
		}, leftSizing);

		// Primary (right)
		const primaryEditorContainer = assertReturnsDefined(this.primaryEditorContainer);
		this.splitview.addView({
			element: primaryEditorContainer,
			layout: size => this.layoutPane(this.primaryEditorPane, size),
			minimumSize: this.orientation === Orientation.HORIZONTAL ? DEFAULT_EDITOR_MIN_DIMENSIONS.width : DEFAULT_EDITOR_MIN_DIMENSIONS.height,
			maximumSize: Number.POSITIVE_INFINITY,
			onDidChange: Event.None
		}, rightSizing);

		this.updateStyles();
	}

	override getTitle(): string {
		if (this.input) {
			return this.input.getName();
		}

		return localize('sideBySideEditor', "Side by Side Editor");
	}

	override async setInput(input: SideBySideEditorInput, options: ISideBySideEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		const oldInput = this.input;
		await super.setInput(input, options, context, token);

		// Create new side by side editors if either we have not
		// been created before or the input no longer matches.
		if (!oldInput || !input.matches(oldInput)) {
			if (oldInput) {
				this.disposeEditors();
			}

			this.createEditors(input);
		}

		// Restore any previous view state
		const { primary, secondary, viewState } = this.loadViewState(input, options, context);
		this.lastFocusedSide = viewState?.focus;

		if (typeof viewState?.ratio === 'number' && this.splitview) {
			const totalSize = this.splitview.orientation === Orientation.HORIZONTAL ? this.dimension.width : this.dimension.height;

			this.splitview.resizeView(0, Math.round(totalSize * viewState.ratio));
		} else {
			this.splitview?.distributeViewSizes();
		}

		// Set input to both sides
		await Promise.all([
			this.secondaryEditorPane?.setInput(input.secondary, secondary, context, token),
			this.primaryEditorPane?.setInput(input.primary, primary, context, token)
		]);

		// Update focus if target is provided
		if (typeof options?.target === 'number') {
			this.lastFocusedSide = options.target;
		}
	}

	private loadViewState(input: SideBySideEditorInput, options: ISideBySideEditorOptions | undefined, context: IEditorOpenContext): { primary: IEditorOptions | undefined; secondary: IEditorOptions | undefined; viewState: ISideBySideEditorViewState | undefined } {
		const viewState = isSideBySideEditorViewState(options?.viewState) ? options?.viewState : this.loadEditorViewState(input, context);

		let primaryOptions: IEditorOptions = Object.create(null);
		let secondaryOptions: IEditorOptions | undefined = undefined;

		// Depending on the optional `target` property, we apply
		// the provided options to either the primary or secondary
		// side

		if (options?.target === Side.SECONDARY) {
			secondaryOptions = { ...options };
		} else {
			primaryOptions = { ...options };
		}

		primaryOptions.viewState = viewState?.primary;

		if (viewState?.secondary) {
			if (!secondaryOptions) {
				secondaryOptions = { viewState: viewState.secondary };
			} else {
				secondaryOptions.viewState = viewState?.secondary;
			}
		}

		return { primary: primaryOptions, secondary: secondaryOptions, viewState };
	}

	private createEditors(newInput: SideBySideEditorInput): void {

		// Create editors
		this.secondaryEditorPane = this.doCreateEditor(newInput.secondary, assertReturnsDefined(this.secondaryEditorContainer));
		this.primaryEditorPane = this.doCreateEditor(newInput.primary, assertReturnsDefined(this.primaryEditorContainer));

		// Layout
		this.layout(this.dimension);

		// Eventing
		this._onDidChangeSizeConstraints.input = Event.any(
			Event.map(this.secondaryEditorPane.onDidChangeSizeConstraints, () => undefined),
			Event.map(this.primaryEditorPane.onDidChangeSizeConstraints, () => undefined)
		);
		this.onDidCreateEditors.fire(undefined);

		// Track focus and signal active control change via event
		this.editorDisposables.add(this.primaryEditorPane.onDidFocus(() => this.onDidFocusChange(Side.PRIMARY)));
		this.editorDisposables.add(this.secondaryEditorPane.onDidFocus(() => this.onDidFocusChange(Side.SECONDARY)));
	}

	private doCreateEditor(editorInput: EditorInput, container: HTMLElement): EditorPane {
		const editorPaneDescriptor = Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).getEditorPane(editorInput);
		if (!editorPaneDescriptor) {
			throw new Error('No editor pane descriptor for editor found');
		}

		// Create editor pane and make visible
		const editorPane = editorPaneDescriptor.instantiate(this.instantiationService, this.group);
		editorPane.create(container);
		editorPane.setVisible(this.isVisible());

		// Track selections if supported
		if (isEditorPaneWithSelection(editorPane)) {
			this.editorDisposables.add(editorPane.onDidChangeSelection(e => this._onDidChangeSelection.fire(e)));
		}

		// Track for disposal
		this.editorDisposables.add(editorPane);

		return editorPane;
	}

	private onDidFocusChange(side: Side.PRIMARY | Side.SECONDARY): void {
		this.lastFocusedSide = side;

		// Signal to outside that our active control changed
		this._onDidChangeControl.fire();
	}

	getSelection(): IEditorPaneSelection | undefined {
		const lastFocusedEditorPane = this.getLastFocusedEditorPane();
		if (isEditorPaneWithSelection(lastFocusedEditorPane)) {
			const selection = lastFocusedEditorPane.getSelection();
			if (selection) {
				return new SideBySideAwareEditorPaneSelection(selection, lastFocusedEditorPane === this.primaryEditorPane ? Side.PRIMARY : Side.SECONDARY);
			}
		}

		return undefined;
	}

	override setOptions(options: ISideBySideEditorOptions | undefined): void {
		super.setOptions(options);

		// Update focus if target is provided
		if (typeof options?.target === 'number') {
			this.lastFocusedSide = options.target;
		}

		// Apply to focused side
		this.getLastFocusedEditorPane()?.setOptions(options);
	}

	protected override setEditorVisible(visible: boolean): void {

		// Forward to both sides
		this.primaryEditorPane?.setVisible(visible);
		this.secondaryEditorPane?.setVisible(visible);

		super.setEditorVisible(visible);
	}

	override clearInput(): void {
		super.clearInput();

		// Forward to both sides
		this.primaryEditorPane?.clearInput();
		this.secondaryEditorPane?.clearInput();

		// Since we do not keep side editors alive
		// we dispose any editor created for recreation
		this.disposeEditors();
	}

	override focus(): void {
		super.focus();

		this.getLastFocusedEditorPane()?.focus();
	}

	private getLastFocusedEditorPane(): EditorPane | undefined {
		if (this.lastFocusedSide === Side.SECONDARY) {
			return this.secondaryEditorPane;
		}

		return this.primaryEditorPane;
	}

	layout(dimension: Dimension): void {
		this.dimension = dimension;

		const splitview = assertReturnsDefined(this.splitview);
		splitview.layout(this.orientation === Orientation.HORIZONTAL ? dimension.width : dimension.height);
	}

	override setBoundarySashes(sashes: IBoundarySashes) {
		this._boundarySashes = sashes;

		if (this.splitview) {
			this.splitview.orthogonalEndSash = sashes.bottom;
		}
	}

	private layoutPane(pane: EditorPane | undefined, size: number): void {
		pane?.layout(this.orientation === Orientation.HORIZONTAL ? new Dimension(size, this.dimension.height) : new Dimension(this.dimension.width, size));
	}

	override getControl(): IEditorControl | undefined {
		return this.getLastFocusedEditorPane()?.getControl();
	}

	getPrimaryEditorPane(): IEditorPane | undefined {
		return this.primaryEditorPane;
	}

	getSecondaryEditorPane(): IEditorPane | undefined {
		return this.secondaryEditorPane;
	}

	protected tracksEditorViewState(input: EditorInput): boolean {
		return input instanceof SideBySideEditorInput;
	}

	protected computeEditorViewState(resource: URI): ISideBySideEditorViewState | undefined {
		if (!this.input || !isEqual(resource, this.toEditorViewStateResource(this.input))) {
			return; // unexpected state
		}

		const primarViewState = this.primaryEditorPane?.getViewState();
		const secondaryViewState = this.secondaryEditorPane?.getViewState();

		if (!primarViewState || !secondaryViewState) {
			return; // we actually need view states
		}

		return {
			primary: primarViewState,
			secondary: secondaryViewState,
			focus: this.lastFocusedSide,
			ratio: this.getSplitViewRatio()
		};
	}

	protected toEditorViewStateResource(input: EditorInput): URI | undefined {
		let primary: URI | undefined;
		let secondary: URI | undefined;

		if (input instanceof SideBySideEditorInput) {
			primary = input.primary.resource;
			secondary = input.secondary.resource;
		}

		if (!secondary || !primary) {
			return undefined;
		}

		// create a URI that is the Base64 concatenation of original + modified resource
		return URI.from({ scheme: 'sideBySide', path: `${multibyteAwareBtoa(secondary.toString())}${multibyteAwareBtoa(primary.toString())}` });
	}

	override updateStyles(): void {
		super.updateStyles();

		if (this.primaryEditorContainer) {
			if (this.orientation === Orientation.HORIZONTAL) {
				this.primaryEditorContainer.style.borderLeftWidth = '1px';
				this.primaryEditorContainer.style.borderLeftStyle = 'solid';
				this.primaryEditorContainer.style.borderLeftColor = this.getColor(SIDE_BY_SIDE_EDITOR_VERTICAL_BORDER) ?? '';

				this.primaryEditorContainer.style.borderTopWidth = '0';
			} else {
				this.primaryEditorContainer.style.borderTopWidth = '1px';
				this.primaryEditorContainer.style.borderTopStyle = 'solid';
				this.primaryEditorContainer.style.borderTopColor = this.getColor(SIDE_BY_SIDE_EDITOR_HORIZONTAL_BORDER) ?? '';

				this.primaryEditorContainer.style.borderLeftWidth = '0';
			}
		}
	}

	override dispose(): void {
		this.disposeEditors();

		super.dispose();
	}

	private disposeEditors(): void {
		this.editorDisposables.clear();

		this.secondaryEditorPane = undefined;
		this.primaryEditorPane = undefined;

		this.lastFocusedSide = undefined;

		if (this.secondaryEditorContainer) {
			clearNode(this.secondaryEditorContainer);
		}

		if (this.primaryEditorContainer) {
			clearNode(this.primaryEditorContainer);
		}
	}
}

class SideBySideAwareEditorPaneSelection implements IEditorPaneSelection {

	constructor(
		private readonly selection: IEditorPaneSelection,
		private readonly side: Side.PRIMARY | Side.SECONDARY
	) { }

	compare(other: IEditorPaneSelection): EditorPaneSelectionCompareResult {
		if (!(other instanceof SideBySideAwareEditorPaneSelection)) {
			return EditorPaneSelectionCompareResult.DIFFERENT;
		}

		if (this.side !== other.side) {
			return EditorPaneSelectionCompareResult.DIFFERENT;
		}

		return this.selection.compare(other.selection);
	}

	restore(options: IEditorOptions): ISideBySideEditorOptions {
		const sideBySideEditorOptions: ISideBySideEditorOptions = {
			...options,
			target: this.side
		};

		return this.selection.restore(sideBySideEditorOptions);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/singleEditorTabsControl.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/singleEditorTabsControl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/singleeditortabscontrol.css';
import { EditorResourceAccessor, Verbosity, IEditorPartOptions, SideBySideEditor, preventEditorClose, EditorCloseMethod, IToolbarActions } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { EditorTabsControl } from './editorTabsControl.js';
import { ResourceLabel, IResourceLabel } from '../../labels.js';
import { TAB_ACTIVE_FOREGROUND, TAB_UNFOCUSED_ACTIVE_FOREGROUND } from '../../../common/theme.js';
import { EventType as TouchEventType, GestureEvent, Gesture } from '../../../../base/browser/touch.js';
import { addDisposableListener, EventType, EventHelper, Dimension, isAncestor, DragAndDropObserver, isHTMLElement, $ } from '../../../../base/browser/dom.js';
import { CLOSE_EDITOR_COMMAND_ID, UNLOCK_GROUP_COMMAND_ID } from './editorCommands.js';
import { Color } from '../../../../base/common/color.js';
import { assertReturnsDefined, assertReturnsAllDefined } from '../../../../base/common/types.js';
import { equals } from '../../../../base/common/objects.js';
import { toDisposable } from '../../../../base/common/lifecycle.js';
import { defaultBreadcrumbsWidgetStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { IEditorTitleControlDimensions } from './editorTitleControl.js';
import { BreadcrumbsControlFactory } from './breadcrumbsControl.js';

interface IRenderedEditorLabel {
	readonly editor?: EditorInput;
	readonly pinned: boolean;
}

export class SingleEditorTabsControl extends EditorTabsControl {

	private titleContainer: HTMLElement | undefined;
	private editorLabel: IResourceLabel | undefined;
	private activeLabel: IRenderedEditorLabel = Object.create(null);

	private breadcrumbsControlFactory: BreadcrumbsControlFactory | undefined;
	private get breadcrumbsControl() { return this.breadcrumbsControlFactory?.control; }

	protected override create(parent: HTMLElement): HTMLElement {
		super.create(parent);

		const titleContainer = this.titleContainer = parent;
		titleContainer.draggable = true;

		// Container listeners
		this.registerContainerListeners(titleContainer);

		// Gesture Support
		this._register(Gesture.addTarget(titleContainer));

		const labelContainer = $('.label-container');
		titleContainer.appendChild(labelContainer);

		// Editor Label
		this.editorLabel = this._register(this.instantiationService.createInstance(ResourceLabel, labelContainer, {})).element;
		this._register(addDisposableListener(this.editorLabel.element, EventType.CLICK, e => this.onTitleLabelClick(e)));

		// Breadcrumbs
		this.breadcrumbsControlFactory = this._register(this.instantiationService.createInstance(BreadcrumbsControlFactory, labelContainer, this.groupView, {
			showFileIcons: false,
			showSymbolIcons: true,
			showDecorationColors: false,
			widgetStyles: { ...defaultBreadcrumbsWidgetStyles, breadcrumbsBackground: Color.transparent.toString() },
			showPlaceholder: false,
			dragEditor: true,
		}));
		this._register(this.breadcrumbsControlFactory.onDidEnablementChange(() => this.handleBreadcrumbsEnablementChange()));
		titleContainer.classList.toggle('breadcrumbs', Boolean(this.breadcrumbsControl));
		this._register(toDisposable(() => titleContainer.classList.remove('breadcrumbs'))); // important to remove because the container is a shared dom node

		// Create editor actions toolbar
		this.createEditorActionsToolBar(titleContainer, ['title-actions']);

		return titleContainer;
	}

	private registerContainerListeners(titleContainer: HTMLElement): void {

		// Drag & Drop support
		let lastDragEvent: DragEvent | undefined = undefined;
		let isNewWindowOperation = false;
		this._register(new DragAndDropObserver(titleContainer, {
			onDragStart: e => { isNewWindowOperation = this.onGroupDragStart(e, titleContainer); },
			onDrag: e => { lastDragEvent = e; },
			onDragEnd: e => { this.onGroupDragEnd(e, lastDragEvent, titleContainer, isNewWindowOperation); },
		}));

		// Pin on double click
		this._register(addDisposableListener(titleContainer, EventType.DBLCLICK, e => this.onTitleDoubleClick(e)));

		// Detect mouse click
		this._register(addDisposableListener(titleContainer, EventType.AUXCLICK, e => this.onTitleAuxClick(e)));

		// Detect touch
		this._register(addDisposableListener(titleContainer, TouchEventType.Tap, (e: GestureEvent) => this.onTitleTap(e)));

		// Context Menu
		for (const event of [EventType.CONTEXT_MENU, TouchEventType.Contextmenu]) {
			this._register(addDisposableListener(titleContainer, event, e => {
				if (this.tabsModel.activeEditor) {
					this.onTabContextMenu(this.tabsModel.activeEditor, e, titleContainer);
				}
			}));
		}
	}

	private onTitleLabelClick(e: MouseEvent): void {
		EventHelper.stop(e, false);

		// delayed to let the onTitleClick() come first which can cause a focus change which can close quick access
		setTimeout(() => this.quickInputService.quickAccess.show());
	}

	private onTitleDoubleClick(e: MouseEvent): void {
		EventHelper.stop(e);

		this.groupView.pinEditor();
	}

	private onTitleAuxClick(e: MouseEvent): void {
		if (e.button === 1 /* Middle Button */ && this.tabsModel.activeEditor) {
			EventHelper.stop(e, true /* for https://github.com/microsoft/vscode/issues/56715 */);

			if (!preventEditorClose(this.tabsModel, this.tabsModel.activeEditor, EditorCloseMethod.MOUSE, this.groupsView.partOptions)) {
				this.groupView.closeEditor(this.tabsModel.activeEditor);
			}
		}
	}

	private onTitleTap(e: GestureEvent): void {

		// We only want to open the quick access picker when
		// the tap occurred over the editor label, so we need
		// to check on the target
		// (https://github.com/microsoft/vscode/issues/107543)
		const target = e.initialTarget;
		if (!(isHTMLElement(target)) || !this.editorLabel || !isAncestor(target, this.editorLabel.element)) {
			return;
		}

		// TODO@rebornix gesture tap should open the quick access
		// editorGroupView will focus on the editor again when there
		// are mouse/pointer/touch down events we need to wait a bit as
		// `GesureEvent.Tap` is generated from `touchstart` and then
		// `touchend` events, which are not an atom event.
		setTimeout(() => this.quickInputService.quickAccess.show(), 50);
	}

	openEditor(editor: EditorInput): boolean {
		return this.doHandleOpenEditor();
	}

	openEditors(editors: EditorInput[]): boolean {
		return this.doHandleOpenEditor();
	}

	private doHandleOpenEditor(): boolean {
		const activeEditorChanged = this.ifActiveEditorChanged(() => this.redraw());
		if (!activeEditorChanged) {
			this.ifActiveEditorPropertiesChanged(() => this.redraw());
		}

		return activeEditorChanged;
	}

	beforeCloseEditor(editor: EditorInput): void {
		// Nothing to do before closing an editor
	}

	closeEditor(editor: EditorInput): void {
		this.ifActiveEditorChanged(() => this.redraw());
	}

	closeEditors(editors: EditorInput[]): void {
		this.ifActiveEditorChanged(() => this.redraw());
	}

	moveEditor(editor: EditorInput, fromIndex: number, targetIndex: number): void {
		this.ifActiveEditorChanged(() => this.redraw());
	}

	pinEditor(editor: EditorInput): void {
		this.ifEditorIsActive(editor, () => this.redraw());
	}

	stickEditor(editor: EditorInput): void { }

	unstickEditor(editor: EditorInput): void { }

	setActive(isActive: boolean): void {
		this.redraw();
	}

	updateEditorSelections(): void { }

	updateEditorLabel(editor: EditorInput): void {
		this.ifEditorIsActive(editor, () => this.redraw());
	}

	updateEditorDirty(editor: EditorInput): void {
		this.ifEditorIsActive(editor, () => {
			const titleContainer = assertReturnsDefined(this.titleContainer);

			// Signal dirty (unless saving)
			if (editor.isDirty() && !editor.isSaving()) {
				titleContainer.classList.add('dirty');
			}

			// Otherwise, clear dirty
			else {
				titleContainer.classList.remove('dirty');
			}
		});
	}

	override updateOptions(oldOptions: IEditorPartOptions, newOptions: IEditorPartOptions): void {
		super.updateOptions(oldOptions, newOptions);

		if (oldOptions.labelFormat !== newOptions.labelFormat || !equals(oldOptions.decorations, newOptions.decorations)) {
			this.redraw();
		}
	}

	override updateStyles(): void {
		this.redraw();
	}

	protected handleBreadcrumbsEnablementChange(): void {
		const titleContainer = assertReturnsDefined(this.titleContainer);
		titleContainer.classList.toggle('breadcrumbs', Boolean(this.breadcrumbsControl));

		this.redraw();
	}

	private ifActiveEditorChanged(fn: () => void): boolean {
		if (
			!this.activeLabel.editor && this.tabsModel.activeEditor || 						// active editor changed from null => editor
			this.activeLabel.editor && !this.tabsModel.activeEditor || 						// active editor changed from editor => null
			(!this.activeLabel.editor || !this.tabsModel.isActive(this.activeLabel.editor))	// active editor changed from editorA => editorB
		) {
			fn();

			return true;
		}

		return false;
	}

	private ifActiveEditorPropertiesChanged(fn: () => void): void {
		if (!this.activeLabel.editor || !this.tabsModel.activeEditor) {
			return; // need an active editor to check for properties changed
		}

		if (this.activeLabel.pinned !== this.tabsModel.isPinned(this.tabsModel.activeEditor)) {
			fn(); // only run if pinned state has changed
		}
	}

	private ifEditorIsActive(editor: EditorInput, fn: () => void): void {
		if (this.tabsModel.isActive(editor)) {
			fn();  // only run if editor is current active
		}
	}

	private redraw(): void {
		const editor = this.tabsModel.activeEditor ?? undefined;
		const options = this.groupsView.partOptions;

		const isEditorPinned = editor ? this.tabsModel.isPinned(editor) : false;
		const isGroupActive = this.groupsView.activeGroup === this.groupView;

		this.activeLabel = { editor, pinned: isEditorPinned };

		// Update Breadcrumbs
		if (this.breadcrumbsControl) {
			if (isGroupActive) {
				this.breadcrumbsControl.update();
				this.breadcrumbsControl.domNode.classList.toggle('preview', !isEditorPinned);
			} else {
				this.breadcrumbsControl.hide();
			}
		}

		// Clear if there is no editor
		const [titleContainer, editorLabel] = assertReturnsAllDefined(this.titleContainer, this.editorLabel);
		if (!editor) {
			titleContainer.classList.remove('dirty');
			editorLabel.clear();
			this.clearEditorActionsToolbar();
		}

		// Otherwise render it
		else {

			// Dirty state
			this.updateEditorDirty(editor);

			// Editor Label
			const { labelFormat } = this.groupsView.partOptions;
			let description: string;
			if (this.breadcrumbsControl && !this.breadcrumbsControl.isHidden()) {
				description = ''; // hide description when showing breadcrumbs
			} else if (labelFormat === 'default' && !isGroupActive) {
				description = ''; // hide description when group is not active and style is 'default'
			} else {
				description = editor.getDescription(this.getVerbosity(labelFormat)) || '';
			}

			editorLabel.setResource(
				{
					resource: EditorResourceAccessor.getOriginalUri(editor, { supportSideBySide: SideBySideEditor.BOTH }),
					name: editor.getName(),
					description
				},
				{
					title: this.getHoverTitle(editor),
					italic: !isEditorPinned,
					extraClasses: ['single-tab', 'title-label'].concat(editor.getLabelExtraClasses()),
					fileDecorations: {
						colors: Boolean(options.decorations?.colors),
						badges: Boolean(options.decorations?.badges)
					},
					icon: editor.getIcon(),
					hideIcon: options.showIcons === false,
				}
			);

			if (isGroupActive) {
				titleContainer.style.color = this.getColor(TAB_ACTIVE_FOREGROUND) || '';
			} else {
				titleContainer.style.color = this.getColor(TAB_UNFOCUSED_ACTIVE_FOREGROUND) || '';
			}

			// Update Editor Actions Toolbar
			this.updateEditorActionsToolbar();
		}
	}

	private getVerbosity(style: string | undefined): Verbosity {
		switch (style) {
			case 'short': return Verbosity.SHORT;
			case 'long': return Verbosity.LONG;
			default: return Verbosity.MEDIUM;
		}
	}

	protected override prepareEditorActions(editorActions: IToolbarActions): IToolbarActions {
		const isGroupActive = this.groupsView.activeGroup === this.groupView;

		// Active: allow all actions
		if (isGroupActive) {
			return editorActions;
		}

		// Inactive: only show "Close, "Unlock" and secondary actions
		else {
			return {
				primary: this.groupsView.partOptions.alwaysShowEditorActions ? editorActions.primary : editorActions.primary.filter(action => action.id === CLOSE_EDITOR_COMMAND_ID || action.id === UNLOCK_GROUP_COMMAND_ID),
				secondary: editorActions.secondary
			};
		}
	}

	getHeight(): number {
		return this.tabHeight;
	}

	layout(dimensions: IEditorTitleControlDimensions): Dimension {
		this.breadcrumbsControl?.layout(undefined);

		return new Dimension(dimensions.container.width, this.getHeight());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/textCodeEditor.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/textCodeEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { ITextEditorPane } from '../../../common/editor.js';
import { applyTextEditorOptions } from '../../../common/editor/editorOptions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ITextEditorOptions } from '../../../../platform/editor/common/editor.js';
import { isEqual } from '../../../../base/common/resources.js';
import { IEditorOptions as ICodeEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { CodeEditorWidget, ICodeEditorWidgetOptions } from '../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { IEditorViewState, ScrollType } from '../../../../editor/common/editorCommon.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { AbstractTextEditor } from './textEditor.js';
import { Dimension } from '../../../../base/browser/dom.js';

/**
 * A text editor using the code editor widget.
 */
export abstract class AbstractTextCodeEditor<T extends IEditorViewState> extends AbstractTextEditor<T> implements ITextEditorPane {

	protected editorControl: ICodeEditor | undefined = undefined;

	override get scopedContextKeyService(): IContextKeyService | undefined {
		return this.editorControl?.invokeWithinContext(accessor => accessor.get(IContextKeyService));
	}

	override getTitle(): string {
		if (this.input) {
			return this.input.getName();
		}

		return localize('textEditor', "Text Editor");
	}

	protected createEditorControl(parent: HTMLElement, initialOptions: ICodeEditorOptions): void {
		this.editorControl = this._register(this.instantiationService.createInstance(CodeEditorWidget, parent, initialOptions, this.getCodeEditorWidgetOptions()));
	}

	protected getCodeEditorWidgetOptions(): ICodeEditorWidgetOptions {
		return Object.create(null);
	}

	protected updateEditorControlOptions(options: ICodeEditorOptions): void {
		this.editorControl?.updateOptions(options);
	}

	protected getMainControl(): ICodeEditor | undefined {
		return this.editorControl;
	}

	override getControl(): ICodeEditor | undefined {
		return this.editorControl;
	}

	protected override computeEditorViewState(resource: URI): T | undefined {
		if (!this.editorControl) {
			return undefined;
		}

		const model = this.editorControl.getModel();
		if (!model) {
			return undefined; // view state always needs a model
		}

		const modelUri = model.uri;
		if (!modelUri) {
			return undefined; // model URI is needed to make sure we save the view state correctly
		}

		if (!isEqual(modelUri, resource)) {
			return undefined; // prevent saving view state for a model that is not the expected one
		}

		return this.editorControl.saveViewState() as unknown as T ?? undefined;
	}

	override setOptions(options: ITextEditorOptions | undefined): void {
		super.setOptions(options);

		if (options) {
			applyTextEditorOptions(options, assertReturnsDefined(this.editorControl), ScrollType.Smooth);
		}
	}

	override focus(): void {
		super.focus();

		this.editorControl?.focus();
	}

	override hasFocus(): boolean {
		return this.editorControl?.hasTextFocus() || super.hasFocus();
	}

	protected override setEditorVisible(visible: boolean): void {
		super.setEditorVisible(visible);

		if (visible) {
			this.editorControl?.onVisible();
		} else {
			this.editorControl?.onHide();
		}
	}

	override layout(dimension: Dimension): void {
		this.editorControl?.layout(dimension);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/textDiffEditor.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/textDiffEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { deepClone } from '../../../../base/common/objects.js';
import { isObject, assertReturnsDefined } from '../../../../base/common/types.js';
import { ICodeEditor, IDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { IDiffEditorOptions, IEditorOptions as ICodeEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { AbstractTextEditor, IEditorConfiguration } from './textEditor.js';
import { TEXT_DIFF_EDITOR_ID, IEditorFactoryRegistry, EditorExtensions, ITextDiffEditorPane, IEditorOpenContext, isEditorInput, isTextEditorViewState, createTooLargeFileError } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { applyTextEditorOptions } from '../../../common/editor/editorOptions.js';
import { DiffEditorInput } from '../../../common/editor/diffEditorInput.js';
import { TextDiffEditorModel } from '../../../common/editor/textDiffEditorModel.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITextResourceConfigurationChangeEvent, ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { TextFileOperationError, TextFileOperationResult } from '../../../services/textfile/common/textfiles.js';
import { ScrollType, IDiffEditorViewState, IDiffEditorModel, IDiffEditorViewModel } from '../../../../editor/common/editorCommon.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import { IEditorGroup, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { EditorActivation, ITextEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { isEqual } from '../../../../base/common/resources.js';
import { Dimension } from '../../../../base/browser/dom.js';
import { multibyteAwareBtoa } from '../../../../base/common/strings.js';
import { ByteSize, FileOperationError, FileOperationResult, IFileService, TooLargeFileOperationError } from '../../../../platform/files/common/files.js';
import { IBoundarySashes } from '../../../../base/browser/ui/sash/sash.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { DiffEditorWidget } from '../../../../editor/browser/widget/diffEditor/diffEditorWidget.js';

/**
 * The text editor that leverages the diff text editor for the editing experience.
 */
export class TextDiffEditor extends AbstractTextEditor<IDiffEditorViewState> implements ITextDiffEditorPane {
	static readonly ID = TEXT_DIFF_EDITOR_ID;

	private diffEditorControl: IDiffEditor | undefined = undefined;

	private inputLifecycleStopWatch: StopWatch | undefined = undefined;

	override get scopedContextKeyService(): IContextKeyService | undefined {
		if (!this.diffEditorControl) {
			return undefined;
		}

		const originalEditor = this.diffEditorControl.getOriginalEditor();
		const modifiedEditor = this.diffEditorControl.getModifiedEditor();

		return (originalEditor.hasTextFocus() ? originalEditor : modifiedEditor).invokeWithinContext(accessor => accessor.get(IContextKeyService));
	}

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IStorageService storageService: IStorageService,
		@ITextResourceConfigurationService configurationService: ITextResourceConfigurationService,
		@IEditorService editorService: IEditorService,
		@IThemeService themeService: IThemeService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@IFileService fileService: IFileService,
		@IPreferencesService private readonly preferencesService: IPreferencesService
	) {
		super(TextDiffEditor.ID, group, telemetryService, instantiationService, storageService, configurationService, themeService, editorService, editorGroupService, fileService);
	}

	override getTitle(): string {
		if (this.input) {
			return this.input.getName();
		}

		return localize('textDiffEditor', "Text Diff Editor");
	}

	protected override createEditorControl(parent: HTMLElement, configuration: ICodeEditorOptions): void {
		this.diffEditorControl = this._register(this.instantiationService.createInstance(DiffEditorWidget, parent, configuration, {}));
	}

	protected updateEditorControlOptions(options: ICodeEditorOptions): void {
		this.diffEditorControl?.updateOptions(options);
	}

	protected getMainControl(): ICodeEditor | undefined {
		return this.diffEditorControl?.getModifiedEditor();
	}

	private _previousViewModel: IDiffEditorViewModel | null = null;

	override async setInput(input: DiffEditorInput, options: ITextEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		if (this._previousViewModel) {
			this._previousViewModel.dispose();
			this._previousViewModel = null;
		}

		// Cleanup previous things associated with the input
		this.inputLifecycleStopWatch = undefined;

		// Set input and resolve
		await super.setInput(input, options, context, token);

		try {
			const resolvedModel = await input.resolve();

			// Check for cancellation
			if (token.isCancellationRequested) {
				return undefined;
			}

			// Fallback to open as binary if not text
			if (!(resolvedModel instanceof TextDiffEditorModel)) {
				this.openAsBinary(input, options);
				return undefined;
			}

			// Set Editor Model
			const control = assertReturnsDefined(this.diffEditorControl);
			const resolvedDiffEditorModel = resolvedModel;

			const vm = resolvedDiffEditorModel.textDiffEditorModel ? control.createViewModel(resolvedDiffEditorModel.textDiffEditorModel) : null;
			this._previousViewModel = vm;
			await vm?.waitForDiff();
			control.setModel(vm);

			// Restore view state (unless provided by options)
			let hasPreviousViewState = false;
			if (!isTextEditorViewState(options?.viewState)) {
				hasPreviousViewState = this.restoreTextDiffEditorViewState(input, options, context, control);
			}

			// Apply options to editor if any
			let optionsGotApplied = false;
			if (options) {
				optionsGotApplied = applyTextEditorOptions(options, control, ScrollType.Immediate);
			}

			if (!optionsGotApplied && !hasPreviousViewState) {
				control.revealFirstDiff();
			}

			// Since the resolved model provides information about being readonly
			// or not, we apply it here to the editor even though the editor input
			// was already asked for being readonly or not. The rationale is that
			// a resolved model might have more specific information about being
			// readonly or not that the input did not have.
			control.updateOptions({
				...this.getReadonlyConfiguration(resolvedDiffEditorModel.modifiedModel?.isReadonly()),
				originalEditable: !resolvedDiffEditorModel.originalModel?.isReadonly()
			});

			control.handleInitialized();

			// Start to measure input lifecycle
			this.inputLifecycleStopWatch = new StopWatch(false);
		} catch (error) {
			await this.handleSetInputError(error, input, options);
		}
	}

	private async handleSetInputError(error: Error, input: DiffEditorInput, options: ITextEditorOptions | undefined): Promise<void> {

		// Handle case where content appears to be binary
		if (this.isFileBinaryError(error)) {
			return this.openAsBinary(input, options);
		}

		// Handle case where a file is too large to open without confirmation
		if ((<FileOperationError>error).fileOperationResult === FileOperationResult.FILE_TOO_LARGE) {
			let message: string;
			if (error instanceof TooLargeFileOperationError) {
				message = localize('fileTooLargeForHeapErrorWithSize', "At least one file is not displayed in the text compare editor because it is very large ({0}).", ByteSize.formatSize(error.size));
			} else {
				message = localize('fileTooLargeForHeapErrorWithoutSize', "At least one file is not displayed in the text compare editor because it is very large.");
			}

			throw createTooLargeFileError(this.group, input, options, message, this.preferencesService);
		}

		// Otherwise make sure the error bubbles up
		throw error;
	}

	private restoreTextDiffEditorViewState(editor: DiffEditorInput, options: ITextEditorOptions | undefined, context: IEditorOpenContext, control: IDiffEditor): boolean {
		const editorViewState = this.loadEditorViewState(editor, context);
		if (editorViewState) {
			if (options?.selection && editorViewState.modified) {
				editorViewState.modified.cursorState = []; // prevent duplicate selections via options
			}

			control.restoreViewState(editorViewState);

			if (options?.revealIfVisible) {
				control.revealFirstDiff();
			}

			return true;
		}

		return false;
	}

	private openAsBinary(input: DiffEditorInput, options: ITextEditorOptions | undefined): void {
		const original = input.original;
		const modified = input.modified;

		const binaryDiffInput = this.instantiationService.createInstance(DiffEditorInput, input.getName(), input.getDescription(), original, modified, true);

		// Forward binary flag to input if supported
		const fileEditorFactory = Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).getFileEditorFactory();
		if (fileEditorFactory.isFileEditor(original)) {
			original.setForceOpenAsBinary();
		}

		if (fileEditorFactory.isFileEditor(modified)) {
			modified.setForceOpenAsBinary();
		}

		// Replace this editor with the binary one
		this.group.replaceEditors([{
			editor: input,
			replacement: binaryDiffInput,
			options: {
				...options,
				// Make sure to not steal away the currently active group
				// because we are triggering another openEditor() call
				// and do not control the initial intent that resulted
				// in us now opening as binary.
				activation: EditorActivation.PRESERVE,
				pinned: this.group.isPinned(input),
				sticky: this.group.isSticky(input)
			}
		}]);
	}

	override setOptions(options: ITextEditorOptions | undefined): void {
		super.setOptions(options);

		if (options) {
			applyTextEditorOptions(options, assertReturnsDefined(this.diffEditorControl), ScrollType.Smooth);
		}
	}

	protected override shouldHandleConfigurationChangeEvent(e: ITextResourceConfigurationChangeEvent, resource: URI): boolean {
		if (super.shouldHandleConfigurationChangeEvent(e, resource)) {
			return true;
		}

		return e.affectsConfiguration(resource, 'diffEditor') || e.affectsConfiguration(resource, 'accessibility.verbosity.diffEditor');
	}

	protected override computeConfiguration(configuration: IEditorConfiguration): ICodeEditorOptions {
		const editorConfiguration = super.computeConfiguration(configuration);

		// Handle diff editor specially by merging in diffEditor configuration
		if (isObject(configuration.diffEditor)) {
			const diffEditorConfiguration: IDiffEditorOptions = deepClone(configuration.diffEditor);

			// User settings defines `diffEditor.codeLens`, but here we rename that to `diffEditor.diffCodeLens` to avoid collisions with `editor.codeLens`.
			diffEditorConfiguration.diffCodeLens = diffEditorConfiguration.codeLens;
			delete diffEditorConfiguration.codeLens;

			// User settings defines `diffEditor.wordWrap`, but here we rename that to `diffEditor.diffWordWrap` to avoid collisions with `editor.wordWrap`.
			diffEditorConfiguration.diffWordWrap = <'off' | 'on' | 'inherit' | undefined>diffEditorConfiguration.wordWrap;
			delete diffEditorConfiguration.wordWrap;

			Object.assign(editorConfiguration, diffEditorConfiguration);
		}

		const verbose = configuration.accessibility?.verbosity?.diffEditor ?? false;
		(editorConfiguration as IDiffEditorOptions).accessibilityVerbose = verbose;

		return editorConfiguration;
	}

	protected override getConfigurationOverrides(configuration: IEditorConfiguration): IDiffEditorOptions {
		return {
			...super.getConfigurationOverrides(configuration),
			...this.getReadonlyConfiguration(this.input?.isReadonly()),
			originalEditable: this.input instanceof DiffEditorInput && !this.input.original.isReadonly(),
			lineDecorationsWidth: '2ch'
		};
	}

	protected override updateReadonly(input: EditorInput): void {
		if (input instanceof DiffEditorInput) {
			this.diffEditorControl?.updateOptions({
				...this.getReadonlyConfiguration(input.isReadonly()),
				originalEditable: !input.original.isReadonly(),
			});
		} else {
			super.updateReadonly(input);
		}
	}

	private isFileBinaryError(error: Error[]): boolean;
	private isFileBinaryError(error: Error): boolean;
	private isFileBinaryError(error: Error | Error[]): boolean {
		if (Array.isArray(error)) {
			const errors = error;

			return errors.some(error => this.isFileBinaryError(error));
		}

		return (<TextFileOperationError>error).textFileOperationResult === TextFileOperationResult.FILE_IS_BINARY;
	}

	override clearInput(): void {
		if (this._previousViewModel) {
			this._previousViewModel.dispose();
			this._previousViewModel = null;
		}

		super.clearInput();

		// Log input lifecycle telemetry
		const inputLifecycleElapsed = this.inputLifecycleStopWatch?.elapsed();
		this.inputLifecycleStopWatch = undefined;
		if (typeof inputLifecycleElapsed === 'number') {
			this.logInputLifecycleTelemetry(inputLifecycleElapsed, this.getControl()?.getModel()?.modified?.getLanguageId());
		}

		// Clear Model
		this.diffEditorControl?.setModel(null);
	}

	private logInputLifecycleTelemetry(duration: number, languageId: string | undefined): void {
		let collapseUnchangedRegions = false;
		if (this.diffEditorControl instanceof DiffEditorWidget) {
			collapseUnchangedRegions = this.diffEditorControl.collapseUnchangedRegions;
		}
		this.telemetryService.publicLog2<{
			editorVisibleTimeMs: number;
			languageId: string;
			collapseUnchangedRegions: boolean;
		}, {
			owner: 'hediet';
			editorVisibleTimeMs: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates the time the diff editor was visible to the user' };
			languageId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates for which language the diff editor was shown' };
			collapseUnchangedRegions: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates whether unchanged regions were collapsed' };
			comment: 'This event gives insight about how long the diff editor was visible to the user.';
		}>('diffEditor.editorVisibleTime', {
			editorVisibleTimeMs: duration,
			languageId: languageId ?? '',
			collapseUnchangedRegions,
		});
	}

	override getControl(): IDiffEditor | undefined {
		return this.diffEditorControl;
	}

	override focus(): void {
		super.focus();

		this.diffEditorControl?.focus();
	}

	override hasFocus(): boolean {
		return this.diffEditorControl?.hasTextFocus() || super.hasFocus();
	}

	protected override setEditorVisible(visible: boolean): void {
		super.setEditorVisible(visible);

		if (visible) {
			this.diffEditorControl?.onVisible();
		} else {
			this.diffEditorControl?.onHide();
		}
	}

	override layout(dimension: Dimension): void {
		this.diffEditorControl?.layout(dimension);
	}

	override setBoundarySashes(sashes: IBoundarySashes) {
		this.diffEditorControl?.setBoundarySashes(sashes);
	}

	protected override tracksEditorViewState(input: EditorInput): boolean {
		return input instanceof DiffEditorInput;
	}

	protected override computeEditorViewState(resource: URI): IDiffEditorViewState | undefined {
		if (!this.diffEditorControl) {
			return undefined;
		}

		const model = this.diffEditorControl.getModel();
		if (!model?.modified || !model.original) {
			return undefined; // view state always needs a model
		}

		const modelUri = this.toEditorViewStateResource(model);
		if (!modelUri) {
			return undefined; // model URI is needed to make sure we save the view state correctly
		}

		if (!isEqual(modelUri, resource)) {
			return undefined; // prevent saving view state for a model that is not the expected one
		}

		return this.diffEditorControl.saveViewState() ?? undefined;
	}

	protected override toEditorViewStateResource(modelOrInput: IDiffEditorModel | EditorInput): URI | undefined {
		let original: URI | undefined;
		let modified: URI | undefined;

		if (modelOrInput instanceof DiffEditorInput) {
			original = modelOrInput.original.resource;
			modified = modelOrInput.modified.resource;
		} else if (!isEditorInput(modelOrInput)) {
			original = modelOrInput.original.uri;
			modified = modelOrInput.modified.uri;
		}

		if (!original || !modified) {
			return undefined;
		}

		// create a URI that is the Base64 concatenation of original + modified resource
		return URI.from({ scheme: 'diff', path: `${multibyteAwareBtoa(original.toString())}${multibyteAwareBtoa(modified.toString())}` });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/textEditor.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/textEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import { distinct, deepClone } from '../../../../base/common/objects.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { isObject, assertReturnsDefined } from '../../../../base/common/types.js';
import { MutableDisposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { IEditorOpenContext, IEditorPaneSelection, EditorPaneSelectionCompareResult, EditorPaneSelectionChangeReason, IEditorPaneWithSelection, IEditorPaneSelectionChangeEvent, IEditorPaneScrollPosition, IEditorPaneWithScrolling } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { computeEditorAriaLabel } from '../../editor.js';
import { AbstractEditorWithViewState } from './editorWithViewState.js';
import { IEditorViewState } from '../../../../editor/common/editorCommon.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ITextResourceConfigurationChangeEvent, ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { IEditorOptions as ICodeEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { IEditorGroup, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IEditorOptions, ITextEditorOptions, TextEditorSelectionRevealType, TextEditorSelectionSource } from '../../../../platform/editor/common/editor.js';
import { ICursorPositionChangedEvent } from '../../../../editor/common/cursorEvents.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';

export interface IEditorConfiguration {
	editor: object;
	diffEditor: object;
	accessibility?: {
		verbosity?: {
			diffEditor?: boolean;
		};
	};
	problems?: {
		visibility?: boolean;
	};
}

/**
 * The base class of editors that leverage any kind of text editor for the editing experience.
 */
export abstract class AbstractTextEditor<T extends IEditorViewState> extends AbstractEditorWithViewState<T> implements IEditorPaneWithSelection, IEditorPaneWithScrolling {

	private static readonly VIEW_STATE_PREFERENCE_KEY = 'textEditorViewState';

	protected readonly _onDidChangeSelection = this._register(new Emitter<IEditorPaneSelectionChangeEvent>());
	readonly onDidChangeSelection = this._onDidChangeSelection.event;

	protected readonly _onDidChangeScroll = this._register(new Emitter<void>());
	readonly onDidChangeScroll = this._onDidChangeScroll.event;

	private editorContainer: HTMLElement | undefined;

	private hasPendingConfigurationChange: boolean | undefined;
	private lastAppliedEditorOptions?: ICodeEditorOptions;

	private readonly inputListener = this._register(new MutableDisposable());

	constructor(
		id: string,
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IStorageService storageService: IStorageService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@IThemeService themeService: IThemeService,
		@IEditorService editorService: IEditorService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@IFileService protected readonly fileService: IFileService
	) {
		super(id, group, AbstractTextEditor.VIEW_STATE_PREFERENCE_KEY, telemetryService, instantiationService, storageService, textResourceConfigurationService, themeService, editorService, editorGroupService);

		// Listen to configuration changes
		this._register(this.textResourceConfigurationService.onDidChangeConfiguration(e => this.handleConfigurationChangeEvent(e)));

		// ARIA: if a group is added or removed, update the editor's ARIA
		// label so that it appears in the label for when there are > 1 groups

		this._register(Event.any(this.editorGroupService.onDidAddGroup, this.editorGroupService.onDidRemoveGroup)(() => {
			const ariaLabel = this.computeAriaLabel();

			this.editorContainer?.setAttribute('aria-label', ariaLabel);
			this.updateEditorControlOptions({ ariaLabel });
		}));

		// Listen to file system provider changes
		this._register(this.fileService.onDidChangeFileSystemProviderCapabilities(e => this.onDidChangeFileSystemProvider(e.scheme)));
		this._register(this.fileService.onDidChangeFileSystemProviderRegistrations(e => this.onDidChangeFileSystemProvider(e.scheme)));
	}

	private handleConfigurationChangeEvent(e: ITextResourceConfigurationChangeEvent): void {
		const resource = this.getActiveResource();
		if (!this.shouldHandleConfigurationChangeEvent(e, resource)) {
			return;
		}

		if (this.isVisible()) {
			this.updateEditorConfiguration(resource);
		} else {
			this.hasPendingConfigurationChange = true;
		}
	}

	protected shouldHandleConfigurationChangeEvent(e: ITextResourceConfigurationChangeEvent, resource: URI | undefined): boolean {
		return e.affectsConfiguration(resource, 'editor') || e.affectsConfiguration(resource, 'problems.visibility');
	}

	private consumePendingConfigurationChangeEvent(): void {
		if (this.hasPendingConfigurationChange) {
			this.updateEditorConfiguration();
			this.hasPendingConfigurationChange = false;
		}
	}

	protected computeConfiguration(configuration: IEditorConfiguration): ICodeEditorOptions {

		// Specific editor options always overwrite user configuration
		const editorConfiguration: ICodeEditorOptions = isObject(configuration.editor) ? deepClone(configuration.editor) : Object.create(null);
		Object.assign(editorConfiguration, this.getConfigurationOverrides(configuration));

		// ARIA label
		editorConfiguration.ariaLabel = this.computeAriaLabel();

		return editorConfiguration;
	}

	protected computeAriaLabel(): string {
		return this.input ? computeEditorAriaLabel(this.input, undefined, this.group, this.editorGroupService.count) : localize('editor', "Editor");
	}

	private onDidChangeFileSystemProvider(scheme: string): void {
		if (!this.input) {
			return;
		}

		if (this.getActiveResource()?.scheme === scheme) {
			this.updateReadonly(this.input);
		}
	}

	private onDidChangeInputCapabilities(input: EditorInput): void {
		if (this.input === input) {
			this.updateReadonly(input);
		}
	}

	protected updateReadonly(input: EditorInput): void {
		this.updateEditorControlOptions({ ...this.getReadonlyConfiguration(input.isReadonly()) });
	}

	protected getReadonlyConfiguration(isReadonly: boolean | IMarkdownString | undefined): { readOnly: boolean; readOnlyMessage: IMarkdownString | undefined } {
		return {
			readOnly: !!isReadonly,
			readOnlyMessage: typeof isReadonly !== 'boolean' ? isReadonly : undefined
		};
	}

	protected getConfigurationOverrides(configuration: IEditorConfiguration): ICodeEditorOptions {
		return {
			overviewRulerLanes: 3,
			lineNumbersMinChars: 3,
			fixedOverflowWidgets: true,
			...this.getReadonlyConfiguration(this.input?.isReadonly()),
			renderValidationDecorations: configuration.problems?.visibility !== false ? 'on' : 'off'
		};
	}

	protected createEditor(parent: HTMLElement): void {

		// Create editor control
		this.editorContainer = parent;
		this.createEditorControl(parent, this.computeConfiguration(this.textResourceConfigurationService.getValue<IEditorConfiguration>(this.getActiveResource())));

		// Listeners
		this.registerCodeEditorListeners();
	}

	private registerCodeEditorListeners(): void {
		const mainControl = this.getMainControl();
		if (mainControl) {
			this._register(mainControl.onDidChangeModelLanguage(() => this.updateEditorConfiguration()));
			this._register(mainControl.onDidChangeModel(() => this.updateEditorConfiguration()));
			this._register(mainControl.onDidChangeCursorPosition(e => this._onDidChangeSelection.fire({ reason: this.toEditorPaneSelectionChangeReason(e) })));
			this._register(mainControl.onDidChangeModelContent(() => this._onDidChangeSelection.fire({ reason: EditorPaneSelectionChangeReason.EDIT })));
			this._register(mainControl.onDidScrollChange(() => this._onDidChangeScroll.fire()));
		}
	}

	private toEditorPaneSelectionChangeReason(e: ICursorPositionChangedEvent): EditorPaneSelectionChangeReason {
		switch (e.source) {
			case TextEditorSelectionSource.PROGRAMMATIC: return EditorPaneSelectionChangeReason.PROGRAMMATIC;
			case TextEditorSelectionSource.NAVIGATION: return EditorPaneSelectionChangeReason.NAVIGATION;
			case TextEditorSelectionSource.JUMP: return EditorPaneSelectionChangeReason.JUMP;
			default: return EditorPaneSelectionChangeReason.USER;
		}
	}

	getSelection(): IEditorPaneSelection | undefined {
		const mainControl = this.getMainControl();
		if (mainControl) {
			const selection = mainControl.getSelection();
			if (selection) {
				return new TextEditorPaneSelection(selection);
			}
		}

		return undefined;
	}

	/**
	 * This method creates and returns the text editor control to be used.
	 * Subclasses must override to provide their own editor control that
	 * should be used (e.g. a text diff editor).
	 *
	 * The passed in configuration object should be passed to the editor
	 * control when creating it.
	 */
	protected abstract createEditorControl(parent: HTMLElement, initialOptions: ICodeEditorOptions): void;

	/**
	 * The method asks to update the editor control options and is called
	 * whenever there is change to the options.
	 */
	protected abstract updateEditorControlOptions(options: ICodeEditorOptions): void;

	/**
	 * This method returns the main, dominant instance of `ICodeEditor`
	 * for the editor pane. E.g. for a diff editor, this is the right
	 * hand (modified) side.
	 */
	protected abstract getMainControl(): ICodeEditor | undefined;

	override async setInput(input: EditorInput, options: ITextEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		await super.setInput(input, options, context, token);

		// Update our listener for input capabilities
		this.inputListener.value = input.onDidChangeCapabilities(() => this.onDidChangeInputCapabilities(input));

		// Update editor options after having set the input. We do this because there can be
		// editor input specific options (e.g. an ARIA label depending on the input showing)
		this.updateEditorConfiguration();

		// Update aria label on editor
		const editorContainer = assertReturnsDefined(this.editorContainer);
		editorContainer.setAttribute('aria-label', this.computeAriaLabel());
	}

	override clearInput(): void {

		// Clear input listener
		this.inputListener.clear();

		super.clearInput();
	}

	getScrollPosition(): IEditorPaneScrollPosition {
		const editor = this.getMainControl();
		if (!editor) {
			throw new Error('Control has not yet been initialized');
		}

		return {
			// The top position can vary depending on the view zones (find widget for example)
			scrollTop: editor.getScrollTop() - editor.getTopForLineNumber(1),
			scrollLeft: editor.getScrollLeft(),
		};
	}

	setScrollPosition(scrollPosition: IEditorPaneScrollPosition): void {
		const editor = this.getMainControl();
		if (!editor) {
			throw new Error('Control has not yet been initialized');
		}

		editor.setScrollTop(scrollPosition.scrollTop);
		if (scrollPosition.scrollLeft) {
			editor.setScrollLeft(scrollPosition.scrollLeft);
		}
	}

	protected override setEditorVisible(visible: boolean): void {
		if (visible) {
			this.consumePendingConfigurationChangeEvent();
		}

		super.setEditorVisible(visible);
	}

	protected override toEditorViewStateResource(input: EditorInput): URI | undefined {
		return input.resource;
	}

	private updateEditorConfiguration(resource = this.getActiveResource()): void {
		let configuration: IEditorConfiguration | undefined = undefined;
		if (resource) {
			configuration = this.textResourceConfigurationService.getValue<IEditorConfiguration>(resource);
		}

		if (!configuration) {
			return;
		}

		const editorConfiguration = this.computeConfiguration(configuration);

		// Try to figure out the actual editor options that changed from the last time we updated the editor.
		// We do this so that we are not overwriting some dynamic editor settings (e.g. word wrap) that might
		// have been applied to the editor directly.
		let editorSettingsToApply = editorConfiguration;
		if (this.lastAppliedEditorOptions) {
			editorSettingsToApply = distinct(this.lastAppliedEditorOptions, editorSettingsToApply);
		}

		if (Object.keys(editorSettingsToApply).length > 0) {
			this.lastAppliedEditorOptions = editorConfiguration;

			this.updateEditorControlOptions(editorSettingsToApply);
		}
	}

	private getActiveResource(): URI | undefined {
		const mainControl = this.getMainControl();
		if (mainControl) {
			const model = mainControl.getModel();
			if (model) {
				return model.uri;
			}
		}

		if (this.input) {
			return this.input.resource;
		}

		return undefined;
	}

	override dispose(): void {
		this.lastAppliedEditorOptions = undefined;

		super.dispose();
	}
}

export class TextEditorPaneSelection implements IEditorPaneSelection {

	private static readonly TEXT_EDITOR_SELECTION_THRESHOLD = 10; // number of lines to move in editor to justify for significant change

	constructor(
		private readonly textSelection: Selection
	) { }

	compare(other: IEditorPaneSelection): EditorPaneSelectionCompareResult {
		if (!(other instanceof TextEditorPaneSelection)) {
			return EditorPaneSelectionCompareResult.DIFFERENT;
		}

		const thisLineNumber = Math.min(this.textSelection.selectionStartLineNumber, this.textSelection.positionLineNumber);
		const otherLineNumber = Math.min(other.textSelection.selectionStartLineNumber, other.textSelection.positionLineNumber);

		if (thisLineNumber === otherLineNumber) {
			return EditorPaneSelectionCompareResult.IDENTICAL;
		}

		if (Math.abs(thisLineNumber - otherLineNumber) < TextEditorPaneSelection.TEXT_EDITOR_SELECTION_THRESHOLD) {
			return EditorPaneSelectionCompareResult.SIMILAR; // when in close proximity, treat selection as being similar
		}

		return EditorPaneSelectionCompareResult.DIFFERENT;
	}

	restore(options: IEditorOptions): ITextEditorOptions {
		const textEditorOptions: ITextEditorOptions = {
			...options,
			selection: this.textSelection,
			selectionRevealType: TextEditorSelectionRevealType.CenterIfOutsideViewport
		};

		return textEditorOptions;
	}

	log(): string {
		return `line: ${this.textSelection.startLineNumber}-${this.textSelection.endLineNumber}, col:  ${this.textSelection.startColumn}-${this.textSelection.endColumn}`;
	}
}
```

--------------------------------------------------------------------------------

````
