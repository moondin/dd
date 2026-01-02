---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 461
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 461 of 552)

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

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalTabsList.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalTabsList.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IListService, WorkbenchList } from '../../../../platform/list/browser/listService.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { ITerminalConfigurationService, ITerminalGroupService, ITerminalInstance, ITerminalService, ITerminalEditingService, TerminalDataTransfers } from './terminal.js';
import { localize } from '../../../../nls.js';
import * as DOM from '../../../../base/browser/dom.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { MenuItemAction } from '../../../../platform/actions/common/actions.js';
import { MenuEntryActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { TerminalCommandId } from '../common/terminal.js';
import { ITerminalBackend, TerminalLocation, TerminalSettingId } from '../../../../platform/terminal/common/terminal.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Action } from '../../../../base/common/actions.js';
import { DEFAULT_LABELS_CONTAINER, IResourceLabel, ResourceLabels } from '../../../browser/labels.js';
import { IDecorationData, IDecorationsProvider, IDecorationsService } from '../../../services/decorations/common/decorations.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import Severity from '../../../../base/common/severity.js';
import { Disposable, DisposableStore, dispose, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { IListDragAndDrop, IListDragOverReaction, IListRenderer, ListDragOverEffectPosition, ListDragOverEffectType } from '../../../../base/browser/ui/list/list.js';
import { DataTransfers, IDragAndDropData } from '../../../../base/browser/dnd.js';
import { disposableTimeout } from '../../../../base/common/async.js';
import { ElementsDragAndDropData, ListViewTargetSector, NativeDragAndDropData } from '../../../../base/browser/ui/list/listView.js';
import { URI } from '../../../../base/common/uri.js';
import { getColorClass, getIconId, getUriClasses } from './terminalIcon.js';
import { IEditableData } from '../../../common/views.js';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { InputBox, MessageType } from '../../../../base/browser/ui/inputbox/inputBox.js';
import { createSingleCallFunction } from '../../../../base/common/functional.js';
import { IKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { CodeDataTransfers, containsDragType, getPathForFile } from '../../../../platform/dnd/browser/dnd.js';
import { terminalStrings } from '../common/terminalStrings.js';
import { ILifecycleService } from '../../../services/lifecycle/common/lifecycle.js';
import { IProcessDetails } from '../../../../platform/terminal/common/terminalProcess.js';
import { TerminalContextKeys } from '../common/terminalContextKey.js';
import { getTerminalResourcesFromDragEvent, parseTerminalUri } from './terminalUri.js';
import { getInstanceHoverInfo } from './terminalTooltip.js';
import { defaultInputBoxStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { Emitter } from '../../../../base/common/event.js';
import { Schemas } from '../../../../base/common/network.js';
import { getColorForSeverity } from './terminalStatusList.js';
import { TerminalContextActionRunner } from './terminalContextMenu.js';
import type { IHoverAction } from '../../../../base/browser/ui/hover/hover.js';
import { HoverPosition } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IStorageService, StorageScope } from '../../../../platform/storage/common/storage.js';
import { TerminalStorageKeys } from '../common/terminalStorageKeys.js';
import { isObject } from '../../../../base/common/types.js';

const $ = DOM.$;

export const enum TerminalTabsListSizes {
	TabHeight = 22,
	NarrowViewWidth = 46,
	WideViewMinimumWidth = 80,
	DefaultWidth = 120,
	MidpointViewWidth = (TerminalTabsListSizes.NarrowViewWidth + TerminalTabsListSizes.WideViewMinimumWidth) / 2,
	ActionbarMinimumWidth = 105,
	MaximumWidth = 500
}

export class TerminalTabList extends WorkbenchList<ITerminalInstance> {
	private _decorationsProvider: TabDecorationsProvider | undefined;
	private _terminalTabsSingleSelectedContextKey: IContextKey<boolean>;
	private _isSplitContextKey: IContextKey<boolean>;

	constructor(
		container: HTMLElement,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IListService listService: IListService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@ITerminalGroupService private readonly _terminalGroupService: ITerminalGroupService,
		@ITerminalEditingService private readonly _terminalEditingService: ITerminalEditingService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IDecorationsService decorationsService: IDecorationsService,
		@IThemeService private readonly _themeService: IThemeService,
		@IStorageService private readonly _storageService: IStorageService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IHoverService private readonly _hoverService: IHoverService,
	) {
		super('TerminalTabsList', container,
			{
				getHeight: () => TerminalTabsListSizes.TabHeight,
				getTemplateId: () => 'terminal.tabs'
			},
			[instantiationService.createInstance(TerminalTabsRenderer, container, instantiationService.createInstance(ResourceLabels, DEFAULT_LABELS_CONTAINER), () => this.getSelectedElements())],
			{
				horizontalScrolling: false,
				supportDynamicHeights: false,
				selectionNavigation: true,
				identityProvider: {
					getId: e => e?.instanceId
				},
				accessibilityProvider: instantiationService.createInstance(TerminalTabsAccessibilityProvider),
				smoothScrolling: _configurationService.getValue<boolean>('workbench.list.smoothScrolling'),
				multipleSelectionSupport: true,
				paddingBottom: TerminalTabsListSizes.TabHeight,
				dnd: instantiationService.createInstance(TerminalTabsDragAndDrop),
				openOnSingleClick: true
			},
			contextKeyService,
			listService,
			_configurationService,
			instantiationService,
		);

		const instanceDisposables: IDisposable[] = [
			this._terminalGroupService.onDidChangeInstances(() => this.refresh()),
			this._terminalGroupService.onDidChangeGroups(() => this.refresh()),
			this._terminalGroupService.onDidShow(() => this.refresh()),
			this._terminalGroupService.onDidChangeInstanceCapability(() => this.refresh()),
			this._terminalService.onAnyInstanceTitleChange(() => this.refresh()),
			this._terminalService.onAnyInstanceIconChange(() => this.refresh()),
			this._terminalService.onAnyInstancePrimaryStatusChange(() => this.refresh()),
			this._terminalService.onDidChangeConnectionState(() => this.refresh()),
			this._themeService.onDidColorThemeChange(() => this.refresh()),
			this._terminalGroupService.onDidChangeActiveInstance(e => {
				if (e) {
					const i = this._terminalGroupService.instances.indexOf(e);
					this.setSelection([i]);
					this.reveal(i);
				}
				this.refresh();
			}),
			this._storageService.onDidChangeValue(StorageScope.APPLICATION, TerminalStorageKeys.TabsShowDetailed, this.disposables)(() => this.refresh()),
		];

		// Dispose of instance listeners on shutdown to avoid extra work and so tabs don't disappear
		// briefly
		this.disposables.add(lifecycleService.onWillShutdown(e => {
			dispose(instanceDisposables);
			instanceDisposables.length = 0;
		}));
		this.disposables.add(toDisposable(() => {
			dispose(instanceDisposables);
			instanceDisposables.length = 0;
		}));

		this.disposables.add(this.onMouseDblClick(async e => {
			if (!e.element) {
				e.browserEvent.preventDefault();
				e.browserEvent.stopPropagation();
				const instance = await this._terminalService.createTerminal({ location: TerminalLocation.Panel });
				this._terminalGroupService.setActiveInstance(instance);
				await instance.focusWhenReady();
				return;
			}

			if (this._terminalEditingService.getEditingTerminal()?.instanceId === e.element.instanceId) {
				return;
			}

			if (this._getFocusMode() === 'doubleClick' && this.getFocus().length === 1) {
				e.element.focus(true);
			}
		}));

		// on left click, if focus mode = single click, focus the element
		// unless multi-selection is in progress
		this.disposables.add(this.onMouseClick(async e => {
			if (this._terminalEditingService.getEditingTerminal()?.instanceId === e.element?.instanceId) {
				return;
			}

			if (e.browserEvent.altKey && e.element) {
				await this._terminalService.createTerminal({ location: { parentTerminal: e.element } });
			} else if (this._getFocusMode() === 'singleClick') {
				if (this.getSelection().length <= 1) {
					e.element?.focus(true);
				}
			}
		}));

		// on right click, set the focus to that element
		// unless multi-selection is in progress
		this.disposables.add(this.onContextMenu(e => {
			if (!e.element) {
				this.setSelection([]);
				return;
			}
			const selection = this.getSelectedElements();
			if (!selection || !selection.find(s => e.element === s)) {
				this.setFocus(e.index !== undefined ? [e.index] : []);
			}
		}));

		this._terminalTabsSingleSelectedContextKey = TerminalContextKeys.tabsSingularSelection.bindTo(contextKeyService);
		this._isSplitContextKey = TerminalContextKeys.splitTerminalTabFocused.bindTo(contextKeyService);

		this.disposables.add(this.onDidChangeSelection(e => this._updateContextKey()));
		this.disposables.add(this.onDidChangeFocus(() => this._updateContextKey()));

		this.disposables.add(this.onDidOpen(async e => {
			const instance = e.element;
			if (!instance) {
				return;
			}
			this._terminalGroupService.setActiveInstance(instance);
			if (!e.editorOptions.preserveFocus) {
				await instance.focusWhenReady();
			}
		}));
		if (!this._decorationsProvider) {
			this._decorationsProvider = this.disposables.add(instantiationService.createInstance(TabDecorationsProvider));
			this.disposables.add(decorationsService.registerDecorationsProvider(this._decorationsProvider));
		}
		this.refresh();
	}

	private _getFocusMode(): 'singleClick' | 'doubleClick' {
		return this._configurationService.getValue<'singleClick' | 'doubleClick'>(TerminalSettingId.TabsFocusMode);
	}

	refresh(cancelEditing: boolean = true): void {
		if (cancelEditing && this._terminalEditingService.isEditable(undefined)) {
			this.domFocus();
		}

		this.splice(0, this.length, this._terminalGroupService.instances.slice());
	}

	focusHover(): void {
		const instance = this.getSelectedElements()[0];
		if (!instance) {
			return;
		}

		this._hoverService.showInstantHover({
			...getInstanceHoverInfo(instance, this._storageService),
			target: this.getHTMLElement(),
			trapFocus: true
		}, true);
	}

	private _updateContextKey() {
		this._terminalTabsSingleSelectedContextKey.set(this.getSelectedElements().length === 1);
		const instance = this.getFocusedElements();
		this._isSplitContextKey.set(instance.length > 0 && this._terminalGroupService.instanceIsSplit(instance[0]));
	}
}

class TerminalTabsRenderer implements IListRenderer<ITerminalInstance, ITerminalTabEntryTemplate> {
	templateId = 'terminal.tabs';

	constructor(
		private readonly _container: HTMLElement,
		private readonly _labels: ResourceLabels,
		private readonly _getSelection: () => ITerminalInstance[],
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITerminalConfigurationService private readonly _terminalConfigurationService: ITerminalConfigurationService,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@ITerminalGroupService private readonly _terminalGroupService: ITerminalGroupService,
		@ITerminalEditingService private readonly _terminalEditingService: ITerminalEditingService,
		@IHoverService private readonly _hoverService: IHoverService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IListService private readonly _listService: IListService,
		@IStorageService private readonly _storageService: IStorageService,
		@IThemeService private readonly _themeService: IThemeService,
		@IContextViewService private readonly _contextViewService: IContextViewService,
		@ICommandService private readonly _commandService: ICommandService,
	) {
	}

	renderTemplate(container: HTMLElement): ITerminalTabEntryTemplate {
		const element = DOM.append(container, $('.terminal-tabs-entry'));
		const context: { hoverActions?: IHoverAction[] } = {};
		const templateDisposables = new DisposableStore();

		const label = templateDisposables.add(this._labels.create(element, {
			supportHighlights: true,
			supportDescriptionHighlights: true,
			supportIcons: true,
			hoverDelegate: {
				delay: 0,
				showHover: options => {
					return this._hoverService.showDelayedHover({
						...options,
						actions: context.hoverActions,
						target: element,
						appearance: {
							showPointer: true
						},
						position: {
							hoverPosition: this._terminalConfigurationService.config.tabs.location === 'left' ? HoverPosition.RIGHT : HoverPosition.LEFT
						}
					}, { groupId: 'terminal-tabs-list' });
				}
			}
		}));

		const actionsContainer = DOM.append(label.element, $('.actions'));



		const actionBar = templateDisposables.add(new ActionBar(actionsContainer, {
			actionRunner: templateDisposables.add(new TerminalContextActionRunner()),
			actionViewItemProvider: (action, options) =>
				action instanceof MenuItemAction
					? templateDisposables.add(this._instantiationService.createInstance(MenuEntryActionViewItem, action, { hoverDelegate: options.hoverDelegate }))
					: undefined
		}));

		return {
			element,
			label,
			actionBar,
			context,
			elementDisposables: new DisposableStore(),
			templateDisposables
		};
	}

	shouldHideText(): boolean {
		return this._container ? this.getContainerWidthCachedForTask() < TerminalTabsListSizes.MidpointViewWidth : false;
	}

	shouldHideActionBar(): boolean {
		return this._container ? this.getContainerWidthCachedForTask() <= TerminalTabsListSizes.ActionbarMinimumWidth : false;
	}

	private _cachedContainerWidth = -1;
	getContainerWidthCachedForTask(): number {
		if (this._cachedContainerWidth === -1) {
			this._cachedContainerWidth = this._container.clientWidth;
			queueMicrotask(() => this._cachedContainerWidth = -1);
		}
		return this._cachedContainerWidth;
	}

	renderElement(instance: ITerminalInstance, index: number, template: ITerminalTabEntryTemplate): void {
		const hasText = !this.shouldHideText();

		const group = this._terminalGroupService.getGroupForInstance(instance);
		if (!group) {
			throw new Error(`Could not find group for instance "${instance.instanceId}"`);
		}

		template.element.classList.toggle('has-text', hasText);
		template.element.classList.toggle('is-active', this._terminalGroupService.activeInstance === instance);

		let prefix: string = '';
		if (group.terminalInstances.length > 1) {
			const terminalIndex = group.terminalInstances.indexOf(instance);
			if (terminalIndex === 0) {
				prefix = `┌ `;
			} else if (terminalIndex === group.terminalInstances.length - 1) {
				prefix = `└ `;
			} else {
				prefix = `├ `;
			}
		}

		const hoverInfo = getInstanceHoverInfo(instance, this._storageService);
		template.context.hoverActions = hoverInfo.actions;

		const iconId = this._instantiationService.invokeFunction(getIconId, instance);
		const hasActionbar = !this.shouldHideActionBar();
		let label: string = '';
		if (!hasText) {
			const primaryStatus = instance.statusList.primary;
			// Don't show ignore severity
			if (primaryStatus && primaryStatus.severity > Severity.Ignore) {
				label = `${prefix}$(${primaryStatus.icon?.id || iconId})`;
			} else {
				label = `${prefix}$(${iconId})`;
			}
		} else {
			this.fillActionBar(instance, template);
			label = prefix;
			// Only add the title if the icon is set, this prevents the title jumping around for
			// example when launching with a ShellLaunchConfig.name and no icon
			if (instance.icon) {
				label += `$(${iconId}) ${instance.title}`;
			}
		}

		if (!hasActionbar) {
			template.actionBar.clear();
		}

		// Kill terminal on middle click
		template.elementDisposables.add(DOM.addDisposableListener(template.element, DOM.EventType.AUXCLICK, e => {
			e.stopImmediatePropagation();
			if (e.button === 1/*middle*/) {
				this._terminalService.safeDisposeTerminal(instance);
			}
		}));

		const extraClasses: string[] = [];
		const colorClass = getColorClass(instance);
		if (colorClass) {
			extraClasses.push(colorClass);
		}
		const uriClasses = getUriClasses(instance, this._themeService.getColorTheme().type);
		if (uriClasses) {
			extraClasses.push(...uriClasses);
		}

		template.label.setResource({
			resource: instance.resource,
			name: label,
			description: hasText ? instance.description : undefined
		}, {
			fileDecorations: {
				colors: true,
				badges: hasText
			},
			title: {
				markdown: hoverInfo.content,
				markdownNotSupportedFallback: undefined
			},
			extraClasses
		});
		const editableData = this._terminalEditingService.getEditableData(instance);
		template.label.element.classList.toggle('editable-tab', !!editableData);
		if (editableData) {
			// eslint-disable-next-line no-restricted-syntax
			template.elementDisposables.add(this._renderInputBox(template.label.element.querySelector('.monaco-icon-label-container')!, instance, editableData));
			template.actionBar.clear();
		}
	}

	private _renderInputBox(container: HTMLElement, instance: ITerminalInstance, editableData: IEditableData): IDisposable {

		const value = instance.title || '';

		const inputBox = new InputBox(container, this._contextViewService, {
			validationOptions: {
				validation: (value) => {
					const message = editableData.validationMessage(value);
					if (!message || message.severity !== Severity.Error) {
						return null;
					}

					return {
						content: message.content,
						formatContent: true,
						type: MessageType.ERROR
					};
				}
			},
			ariaLabel: localize('terminalInputAriaLabel', "Type terminal name. Press Enter to confirm or Escape to cancel."),
			inputBoxStyles: defaultInputBoxStyles
		});
		inputBox.element.style.height = '22px';
		inputBox.value = value;
		inputBox.focus();
		inputBox.select({ start: 0, end: value.length });

		const done = createSingleCallFunction((success: boolean, finishEditing: boolean) => {
			inputBox.element.style.display = 'none';
			const value = inputBox.value;
			dispose(toDispose);
			inputBox.element.remove();
			if (finishEditing) {
				editableData.onFinish(value, success);
			}
		});

		const showInputBoxNotification = () => {
			if (inputBox.isInputValid()) {
				const message = editableData.validationMessage(inputBox.value);
				if (message) {
					inputBox.showMessage({
						content: message.content,
						formatContent: true,
						type: message.severity === Severity.Info ? MessageType.INFO : message.severity === Severity.Warning ? MessageType.WARNING : MessageType.ERROR
					});
				} else {
					inputBox.hideMessage();
				}
			}
		};
		showInputBoxNotification();

		const toDispose = [
			inputBox,
			DOM.addStandardDisposableListener(inputBox.inputElement, DOM.EventType.KEY_DOWN, (e: IKeyboardEvent) => {
				e.stopPropagation();
				if (e.equals(KeyCode.Enter)) {
					done(inputBox.isInputValid(), true);
				} else if (e.equals(KeyCode.Escape)) {
					done(false, true);
				}
			}),
			DOM.addStandardDisposableListener(inputBox.inputElement, DOM.EventType.KEY_UP, (e: IKeyboardEvent) => {
				showInputBoxNotification();
			}),
			DOM.addDisposableListener(inputBox.inputElement, DOM.EventType.BLUR, () => {
				done(inputBox.isInputValid(), true);
			})
		];

		return toDisposable(() => {
			done(false, false);
		});
	}

	disposeElement(instance: ITerminalInstance, index: number, templateData: ITerminalTabEntryTemplate): void {
		templateData.elementDisposables.clear();
		templateData.actionBar.clear();
	}

	disposeTemplate(templateData: ITerminalTabEntryTemplate): void {
		templateData.elementDisposables.dispose();
		templateData.templateDisposables.dispose();
	}

	fillActionBar(instance: ITerminalInstance, template: ITerminalTabEntryTemplate): void {
		// If the instance is within the selection, split all selected
		const actions = [
			template.elementDisposables.add(new Action(TerminalCommandId.SplitActiveTab, terminalStrings.split.short, ThemeIcon.asClassName(Codicon.splitHorizontal), true, async () => {
				this._runForSelectionOrInstance(instance, async e => {
					this._terminalService.createTerminal({ location: { parentTerminal: e } });
				});
			})),
		];
		if (instance.shellLaunchConfig.tabActions) {
			for (const action of instance.shellLaunchConfig.tabActions) {
				actions.push(template.elementDisposables.add(new Action(action.id, action.label, action.icon ? ThemeIcon.asClassName(action.icon) : undefined, true, async () => {
					this._runForSelectionOrInstance(instance, e => this._commandService.executeCommand(action.id, instance));
				})));
			}
		}
		actions.push(template.elementDisposables.add(new Action(TerminalCommandId.KillActiveTab, terminalStrings.kill.short, ThemeIcon.asClassName(Codicon.trashcan), true, async () => {
			this._runForSelectionOrInstance(instance, e => this._terminalService.safeDisposeTerminal(e));
		})));
		// TODO: Cache these in a way that will use the correct instance
		template.actionBar.clear();
		for (const action of actions) {
			template.actionBar.push(action, { icon: true, label: false, keybinding: this._keybindingService.lookupKeybinding(action.id)?.getLabel() });
		}
	}

	private _runForSelectionOrInstance(instance: ITerminalInstance, callback: (instance: ITerminalInstance) => void) {
		const selection = this._getSelection();
		if (selection.includes(instance)) {
			for (const s of selection) {
				if (s) {
					callback(s);
				}
			}
		} else {
			callback(instance);
		}
		this._terminalGroupService.focusTabs();
		this._listService.lastFocusedList?.focusNext();
	}
}

interface ITerminalTabEntryTemplate {
	readonly element: HTMLElement;
	readonly label: IResourceLabel;
	readonly actionBar: ActionBar;
	context: {
		hoverActions?: IHoverAction[];
	};
	readonly elementDisposables: DisposableStore;
	readonly templateDisposables: DisposableStore;
}


class TerminalTabsAccessibilityProvider implements IListAccessibilityProvider<ITerminalInstance> {
	constructor(
		@ITerminalGroupService private readonly _terminalGroupService: ITerminalGroupService,
	) { }

	getWidgetAriaLabel(): string {
		return localize('terminal.tabs', "Terminal tabs");
	}

	getAriaLabel(instance: ITerminalInstance): string {
		let ariaLabel: string = '';
		const tab = this._terminalGroupService.getGroupForInstance(instance);
		if (tab && tab.terminalInstances?.length > 1) {
			const terminalIndex = tab.terminalInstances.indexOf(instance);
			ariaLabel = localize({
				key: 'splitTerminalAriaLabel',
				comment: [
					`The terminal's ID`,
					`The terminal's title`,
					`The terminal's split number`,
					`The terminal group's total split number`
				]
			}, "Terminal {0} {1}, split {2} of {3}", instance.instanceId, instance.title, terminalIndex + 1, tab.terminalInstances.length);
		} else {
			ariaLabel = localize({
				key: 'terminalAriaLabel',
				comment: [
					`The terminal's ID`,
					`The terminal's title`
				]
			}, "Terminal {0} {1}", instance.instanceId, instance.title);
		}
		return ariaLabel;
	}
}

class TerminalTabsDragAndDrop extends Disposable implements IListDragAndDrop<ITerminalInstance> {
	private _autoFocusInstance: ITerminalInstance | undefined;
	private _autoFocusDisposable: IDisposable = Disposable.None;
	private _primaryBackend: ITerminalBackend | undefined;

	constructor(
		@ITerminalService private readonly _terminalService: ITerminalService,
		@ITerminalGroupService private readonly _terminalGroupService: ITerminalGroupService,
		@ITerminalEditingService private readonly _terminalEditingService: ITerminalEditingService,
		@IListService private readonly _listService: IListService,
	) {
		super();
		this._primaryBackend = this._terminalService.getPrimaryBackend();
	}

	getDragURI(instance: ITerminalInstance): string | null {
		if (this._terminalEditingService.getEditingTerminal()?.instanceId === instance.instanceId) {
			return null;
		}

		return instance.resource.toString();
	}

	getDragLabel?(elements: ITerminalInstance[], originalEvent: DragEvent): string | undefined {
		return elements.length === 1 ? elements[0].title : undefined;
	}

	onDragLeave() {
		this._autoFocusInstance = undefined;
		this._autoFocusDisposable.dispose();
		this._autoFocusDisposable = Disposable.None;
	}

	onDragStart(data: IDragAndDropData, originalEvent: DragEvent): void {
		if (!originalEvent.dataTransfer) {
			return;
		}
		const dndData: unknown = data.getData();
		if (!Array.isArray(dndData)) {
			return;
		}
		// Attach terminals type to event
		const terminals = (dndData as unknown[]).filter(isTerminalInstance);
		if (terminals.length > 0) {
			originalEvent.dataTransfer.setData(TerminalDataTransfers.Terminals, JSON.stringify(terminals.map(e => e.resource.toString())));
		}
	}

	onDragOver(data: IDragAndDropData, targetInstance: ITerminalInstance | undefined, targetIndex: number | undefined, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): boolean | IListDragOverReaction {
		if (data instanceof NativeDragAndDropData) {
			if (!containsDragType(originalEvent, DataTransfers.FILES, DataTransfers.RESOURCES, TerminalDataTransfers.Terminals, CodeDataTransfers.FILES)) {
				return false;
			}
		}

		const didChangeAutoFocusInstance = this._autoFocusInstance !== targetInstance;
		if (didChangeAutoFocusInstance) {
			this._autoFocusDisposable.dispose();
			this._autoFocusInstance = targetInstance;
		}

		if (!targetInstance && !containsDragType(originalEvent, TerminalDataTransfers.Terminals)) {
			return data instanceof ElementsDragAndDropData;
		}

		if (didChangeAutoFocusInstance && targetInstance) {
			this._autoFocusDisposable = disposableTimeout(() => {
				this._terminalService.setActiveInstance(targetInstance);
				this._autoFocusInstance = undefined;
			}, 500, this._store);
		}

		return {
			feedback: targetIndex ? [targetIndex] : undefined,
			accept: true,
			effect: { type: ListDragOverEffectType.Move, position: ListDragOverEffectPosition.Over }
		};
	}

	async drop(data: IDragAndDropData, targetInstance: ITerminalInstance | undefined, targetIndex: number | undefined, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): Promise<void> {
		this._autoFocusDisposable.dispose();
		this._autoFocusInstance = undefined;

		let sourceInstances: ITerminalInstance[] | undefined;
		const promises: Promise<IProcessDetails | undefined>[] = [];
		const resources = getTerminalResourcesFromDragEvent(originalEvent);
		if (resources) {
			for (const uri of resources) {
				const instance = this._terminalService.getInstanceFromResource(uri);
				if (instance) {
					if (Array.isArray(sourceInstances)) {
						sourceInstances.push(instance);
					} else {
						sourceInstances = [instance];
					}
					this._terminalService.moveToTerminalView(instance);
				} else if (this._primaryBackend) {
					const terminalIdentifier = parseTerminalUri(uri);
					if (terminalIdentifier.instanceId) {
						promises.push(this._primaryBackend.requestDetachInstance(terminalIdentifier.workspaceId, terminalIdentifier.instanceId));
					}
				}
			}
		}

		if (promises.length) {
			let processes = await Promise.all(promises);
			processes = processes.filter(p => p !== undefined);
			let lastInstance: ITerminalInstance | undefined;
			for (const attachPersistentProcess of processes) {
				lastInstance = await this._terminalService.createTerminal({ config: { attachPersistentProcess } });
			}
			if (lastInstance) {
				this._terminalService.setActiveInstance(lastInstance);
			}
			return;
		}

		if (sourceInstances === undefined) {
			if (!(data instanceof ElementsDragAndDropData)) {
				this._handleExternalDrop(targetInstance, originalEvent);
				return;
			}

			const draggedElement = data.getData();
			if (!draggedElement || !Array.isArray(draggedElement)) {
				return;
			}

			sourceInstances = [];
			for (const e of draggedElement) {
				if (isTerminalInstance(e)) {
					sourceInstances.push(e as ITerminalInstance);
				}
			}
		}

		if (!targetInstance) {
			this._terminalGroupService.moveGroupToEnd(sourceInstances);
			this._terminalService.setActiveInstance(sourceInstances[0]);
			const targetGroup = this._terminalGroupService.getGroupForInstance(sourceInstances[0]);
			if (targetGroup) {
				const index = this._terminalGroupService.groups.indexOf(targetGroup);
				this._listService.lastFocusedList?.setSelection([index]);
			}
			return;
		}

		this._terminalGroupService.moveGroup(sourceInstances, targetInstance);
		this._terminalService.setActiveInstance(sourceInstances[0]);
		const targetGroup = this._terminalGroupService.getGroupForInstance(sourceInstances[0]);
		if (targetGroup) {
			const index = this._terminalGroupService.groups.indexOf(targetGroup);
			this._listService.lastFocusedList?.setSelection([index]);
		}
	}

	private async _handleExternalDrop(instance: ITerminalInstance | undefined, e: DragEvent) {
		if (!instance || !e.dataTransfer) {
			return;
		}

		// Check if files were dragged from the tree explorer
		let resource: URI | undefined;
		const rawResources = e.dataTransfer.getData(DataTransfers.RESOURCES);
		if (rawResources) {
			resource = URI.parse(JSON.parse(rawResources)[0]);
		}

		const rawCodeFiles = e.dataTransfer.getData(CodeDataTransfers.FILES);
		if (!resource && rawCodeFiles) {
			resource = URI.file(JSON.parse(rawCodeFiles)[0]);
		}

		if (!resource && e.dataTransfer.files.length > 0 && getPathForFile(e.dataTransfer.files[0])) {
			// Check if the file was dragged from the filesystem
			resource = URI.file(getPathForFile(e.dataTransfer.files[0])!);
		}

		if (!resource) {
			return;
		}

		this._terminalService.setActiveInstance(instance);

		instance.focus();
		await instance.sendPath(resource, false);
	}
}

class TabDecorationsProvider extends Disposable implements IDecorationsProvider {
	readonly label: string = localize('label', "Terminal");

	private readonly _onDidChange = this._register(new Emitter<URI[]>());
	readonly onDidChange = this._onDidChange.event;

	constructor(
		@ITerminalService private readonly _terminalService: ITerminalService
	) {
		super();
		this._register(this._terminalService.onAnyInstancePrimaryStatusChange(e => this._onDidChange.fire([e.resource])));
	}

	provideDecorations(resource: URI): IDecorationData | undefined {
		if (resource.scheme !== Schemas.vscodeTerminal) {
			return undefined;
		}

		const instance = this._terminalService.getInstanceFromResource(resource);
		if (!instance) {
			return undefined;
		}

		const primaryStatus = instance?.statusList?.primary;
		if (!primaryStatus?.icon) {
			return undefined;
		}

		return {
			color: getColorForSeverity(primaryStatus.severity),
			letter: primaryStatus.icon,
			tooltip: primaryStatus.tooltip
		};
	}
}

function isTerminalInstance(obj: unknown): obj is ITerminalInstance {
	return isObject(obj) && 'instanceId' in obj;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalTelemetry.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalTelemetry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getWindowById } from '../../../../base/browser/dom.js';
import { isAuxiliaryWindow } from '../../../../base/browser/window.js';
import { timeout } from '../../../../base/common/async.js';
import { Event } from '../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { basename } from '../../../../base/common/path.js';
import { isString } from '../../../../base/common/types.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { TelemetryTrustedValue } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { TerminalCapability } from '../../../../platform/terminal/common/capabilities/capabilities.js';
import { TerminalLocation, type IShellLaunchConfig, type ShellIntegrationInjectionFailureReason } from '../../../../platform/terminal/common/terminal.js';
import type { IWorkbenchContribution } from '../../../common/contributions.js';
import { ILifecycleService } from '../../../services/lifecycle/common/lifecycle.js';
import { ITerminalEditorService, ITerminalService, type ITerminalInstance } from './terminal.js';

export class TerminalTelemetryContribution extends Disposable implements IWorkbenchContribution {
	static ID = 'terminalTelemetry';

	constructor(
		@ILifecycleService lifecycleService: ILifecycleService,
		@ITerminalService terminalService: ITerminalService,
		@ITerminalEditorService terminalEditorService: ITerminalEditorService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
	) {
		super();

		this._register(terminalService.onDidCreateInstance(async instance => {
			const store = new DisposableStore();
			this._store.add(store);

			await Promise.race([
				// Wait for process ready so the shell launch config is fully resolved, then
				// allow another 10 seconds for the shell integration to be fully initialized
				instance.processReady.then(() => {
					return timeout(10000);
				}),
				// If the terminal is disposed, it's ready to report on immediately
				Event.toPromise(instance.onDisposed, store),
				// If the app is shutting down, flush
				Event.toPromise(lifecycleService.onWillShutdown, store),
			]);

			// Determine window status, this is done some time after the process is ready and could
			// reflect the terminal being moved.
			let isInAuxWindow = false;
			try {
				const input = terminalEditorService.getInputFromResource(instance.resource);
				const windowId = input.group?.windowId;
				isInAuxWindow = !!(windowId && isAuxiliaryWindow(getWindowById(windowId, true).window));
			} catch {
			}

			this._logCreateInstance(instance, isInAuxWindow);
			this._store.delete(store);
		}));
	}

	private _logCreateInstance(instance: ITerminalInstance, isInAuxWindow: boolean): void {
		const slc = instance.shellLaunchConfig;
		const commandDetection = instance.capabilities.get(TerminalCapability.CommandDetection);

		type TerminalCreationTelemetryData = {
			location: string;

			shellType: TelemetryTrustedValue<string>;
			promptType: TelemetryTrustedValue<string | undefined>;

			isCustomPtyImplementation: boolean;
			isExtensionOwnedTerminal: boolean;
			isLoginShell: boolean;
			isReconnect: boolean;
			hasRemoteAuthority: boolean;

			shellIntegrationQuality: number;
			shellIntegrationInjected: boolean;
			shellIntegrationInjectionFailureReason: ShellIntegrationInjectionFailureReason | undefined;

			terminalSessionId: string;
		};
		type TerminalCreationTelemetryClassification = {
			owner: 'tyriar';
			comment: 'Track details about terminal creation, such as the shell type';

			location: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The location of the terminal.' };

			shellType: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The detected shell type for the terminal.' };
			promptType: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The detected prompt type for the terminal.' };

			isCustomPtyImplementation: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the terminal was using a custom PTY implementation.' };
			isExtensionOwnedTerminal: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the terminal was created by an extension.' };
			isLoginShell: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the arguments contain -l or --login.' };
			isReconnect: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the terminal is reconnecting to an existing instance.' };
			hasRemoteAuthority: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the terminal has a remote authority, this is likely a connection terminal when undefined in a window with a remote authority.' };

			shellIntegrationQuality: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The shell integration quality (rich=2, basic=1 or none=0).' };
			shellIntegrationInjected: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the shell integration script was injected.' };
			shellIntegrationInjectionFailureReason: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Info about shell integration injection.' };

			terminalSessionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The session ID of the terminal instance.' };
		};
		this._telemetryService.publicLog2<TerminalCreationTelemetryData, TerminalCreationTelemetryClassification>('terminal/createInstance', {
			location: (instance.target === TerminalLocation.Panel
				? 'view'
				: instance.target === TerminalLocation.Editor
					? (isInAuxWindow ? 'editor-auxwindow' : 'editor')
					: 'unknown'),

			shellType: new TelemetryTrustedValue(getSanitizedShellType(slc)),
			promptType: new TelemetryTrustedValue(instance.capabilities.get(TerminalCapability.PromptTypeDetection)?.promptType),

			isCustomPtyImplementation: !!slc.customPtyImplementation,
			isExtensionOwnedTerminal: !!slc.isExtensionOwnedTerminal,
			isLoginShell: (isString(slc.args) ? slc.args.split(' ') : slc.args)?.some(arg => arg === '-l' || arg === '--login') ?? false,
			isReconnect: !!slc.attachPersistentProcess,
			hasRemoteAuthority: instance.hasRemoteAuthority,

			shellIntegrationQuality: commandDetection?.hasRichCommandDetection ? 2 : commandDetection ? 1 : 0,
			shellIntegrationInjected: instance.usedShellIntegrationInjection,
			shellIntegrationInjectionFailureReason: instance.shellIntegrationInjectionFailureReason,
			terminalSessionId: instance.sessionId,
		});
	}
}

// #region Shell Type

const enum AllowedShellType {
	Unknown = 'unknown',

	// Windows only
	CommandPrompt = 'cmd',
	Cygwin = 'cygwin-bash',
	GitBash = 'git-bash',
	Msys2 = 'msys2-bash',
	WindowsPowerShell = 'windows-powershell',
	Wsl = 'wsl',


	// Common Unix shells
	Bash = 'bash',
	Fish = 'fish',
	Pwsh = 'pwsh',
	PwshPreview = 'pwsh-preview',
	Sh = 'sh',
	Ssh = 'ssh',
	Tmux = 'tmux',
	Zsh = 'zsh',

	// More shells
	Amm = 'amm',
	Ash = 'ash',
	Csh = 'csh',
	Dash = 'dash',
	Elvish = 'elvish',
	Ion = 'ion',
	Ksh = 'ksh',
	Mksh = 'mksh',
	Msh = 'msh',
	NuShell = 'nu',
	Plan9Shell = 'rc',
	SchemeShell = 'scsh',
	Tcsh = 'tcsh',
	Termux = 'termux',
	Xonsh = 'xonsh',

	// Lanugage REPLs
	// These are expected to be very low since they are not typically the default shell
	Clojure = 'clj',
	CommonLispSbcl = 'sbcl',
	Crystal = 'crystal',
	Deno = 'deno',
	Elixir = 'iex',
	Erlang = 'erl',
	FSharp = 'fsi',
	Go = 'go',
	HaskellGhci = 'ghci',
	Java = 'jshell',
	Julia = 'julia',
	Lua = 'lua',
	Node = 'node',
	Ocaml = 'ocaml',
	Perl = 'perl',
	Php = 'php',
	PrologSwipl = 'swipl',
	Python = 'python',
	R = 'R',
	RubyIrb = 'irb',
	Scala = 'scala',
	SchemeRacket = 'racket',
	SmalltalkGnu = 'gst',
	SmalltalkPharo = 'pharo',
	Tcl = 'tclsh',
	TsNode = 'ts-node',
}

// Types that match the executable name directly
const shellTypeExecutableAllowList: Set<string> = new Set([
	// Windows only
	AllowedShellType.CommandPrompt,
	AllowedShellType.Wsl,

	// Common Unix shells
	AllowedShellType.Bash,
	AllowedShellType.Fish,
	AllowedShellType.Pwsh,
	AllowedShellType.Sh,
	AllowedShellType.Ssh,
	AllowedShellType.Tmux,
	AllowedShellType.Zsh,

	// More shells
	AllowedShellType.Amm,
	AllowedShellType.Ash,
	AllowedShellType.Csh,
	AllowedShellType.Dash,
	AllowedShellType.Elvish,
	AllowedShellType.Ion,
	AllowedShellType.Ksh,
	AllowedShellType.Mksh,
	AllowedShellType.Msh,
	AllowedShellType.NuShell,
	AllowedShellType.Plan9Shell,
	AllowedShellType.SchemeShell,
	AllowedShellType.Tcsh,
	AllowedShellType.Termux,
	AllowedShellType.Xonsh,

	// Lanugage REPLs
	AllowedShellType.Clojure,
	AllowedShellType.CommonLispSbcl,
	AllowedShellType.Crystal,
	AllowedShellType.Deno,
	AllowedShellType.Elixir,
	AllowedShellType.Erlang,
	AllowedShellType.FSharp,
	AllowedShellType.Go,
	AllowedShellType.HaskellGhci,
	AllowedShellType.Java,
	AllowedShellType.Julia,
	AllowedShellType.Lua,
	AllowedShellType.Node,
	AllowedShellType.Ocaml,
	AllowedShellType.Perl,
	AllowedShellType.Php,
	AllowedShellType.PrologSwipl,
	AllowedShellType.Python,
	AllowedShellType.R,
	AllowedShellType.RubyIrb,
	AllowedShellType.Scala,
	AllowedShellType.SchemeRacket,
	AllowedShellType.SmalltalkGnu,
	AllowedShellType.SmalltalkPharo,
	AllowedShellType.Tcl,
	AllowedShellType.TsNode,
]) satisfies Set<AllowedShellType>;

// Dynamic executables that map to a single type
const shellTypeExecutableRegexAllowList: { regex: RegExp; type: AllowedShellType }[] = [
	{ regex: /^(?:pwsh|powershell)-preview$/i, type: AllowedShellType.PwshPreview },
	{ regex: /^python(?:\d+(?:\.\d+)?)?$/i, type: AllowedShellType.Python },
];

// Path-based look ups
const shellTypePathRegexAllowList: { regex: RegExp; type: AllowedShellType }[] = [
	// Cygwin uses bash.exe, so look up based on the path
	{ regex: /\\Cygwin(?:64)?\\.+\\bash\.exe$/i, type: AllowedShellType.Cygwin },
	// Git bash uses bash.exe, so look up based on the path
	{ regex: /\\Git\\.+\\bash\.exe$/i, type: AllowedShellType.GitBash },
	// Msys2 uses bash.exe, so look up based on the path
	{ regex: /\\msys(?:32|64)\\.+\\(?:bash|msys2)\.exe$/i, type: AllowedShellType.Msys2 },
	// WindowsPowerShell should always be installed on this path, we cannot just look at the
	// executable name since powershell is the CLI on other platforms sometimes (eg. snap package)
	{ regex: /\\WindowsPowerShell\\v1.0\\powershell.exe$/i, type: AllowedShellType.WindowsPowerShell },
	// WSL executables will represent some other shell in the end, but it's difficult to determine
	// when we log
	{ regex: /\\Windows\\(?:System32|SysWOW64|Sysnative)\\(?:bash|wsl)\.exe$/i, type: AllowedShellType.Wsl },
];

function getSanitizedShellType(slc: IShellLaunchConfig): AllowedShellType {
	if (!slc.executable) {
		return AllowedShellType.Unknown;
	}
	const executableFile = basename(slc.executable);
	const executableFileWithoutExt = executableFile.replace(/\.[^\.]+$/, '');
	for (const entry of shellTypePathRegexAllowList) {
		if (entry.regex.test(slc.executable)) {
			return entry.type;
		}
	}
	for (const entry of shellTypeExecutableRegexAllowList) {
		if (entry.regex.test(executableFileWithoutExt)) {
			return entry.type;
		}
	}
	if ((shellTypeExecutableAllowList).has(executableFileWithoutExt)) {
		return executableFileWithoutExt as AllowedShellType;
	}
	return AllowedShellType.Unknown;
}

// #endregion Shell Type
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalTestHelpers.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalTestHelpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../../base/common/async.js';
import type { Terminal } from '@xterm/xterm';

export async function writeP(terminal: Terminal, data: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const failTimeout = timeout(2000);
		failTimeout.then(() => reject('Writing to xterm is taking longer than 2 seconds'));
		terminal.write(data, () => {
			failTimeout.cancel();
			resolve();
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalTooltip.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalTooltip.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { ITerminalInstance } from './terminal.js';
import { asArray } from '../../../../base/common/arrays.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import type { IHoverAction } from '../../../../base/browser/ui/hover/hover.js';
import { TerminalCapability } from '../../../../platform/terminal/common/capabilities/capabilities.js';
import { TerminalStatus } from './terminalStatusList.js';
import Severity from '../../../../base/common/severity.js';
import { StorageScope, StorageTarget, type IStorageService } from '../../../../platform/storage/common/storage.js';
import { TerminalStorageKeys } from '../common/terminalStorageKeys.js';
import type { ITerminalStatusHoverAction } from '../common/terminal.js';
import { basename } from '../../../../base/common/path.js';

export function getInstanceHoverInfo(instance: ITerminalInstance, storageService: IStorageService): { content: MarkdownString; actions: IHoverAction[] } {
	const showDetailed = parseInt(storageService.get(TerminalStorageKeys.TabsShowDetailed, StorageScope.APPLICATION) ?? '0');
	let statusString = '';
	const statuses = instance.statusList.statuses;
	const actions: ITerminalStatusHoverAction[] = [];
	for (const status of statuses) {
		if (showDetailed) {
			if (status.detailedTooltip ?? status.tooltip) {
				statusString += `\n\n---\n\n${status.icon ? `$(${status.icon?.id}) ` : ''}` + (status.detailedTooltip ?? status.tooltip ?? '');
			}
		} else {
			if (status.tooltip) {
				statusString += `\n\n---\n\n${status.icon ? `$(${status.icon?.id}) ` : ''}` + (status.tooltip ?? '');
			}
		}
		if (status.hoverActions) {
			actions.push(...status.hoverActions);
		}
	}
	actions.push({
		commandId: 'toggleDetailedInfo',
		label: showDetailed ? localize('hideDetails', 'Hide Details') : localize('showDetails', 'Show Details'),
		run() {
			storageService.store(TerminalStorageKeys.TabsShowDetailed, (showDetailed + 1) % 2, StorageScope.APPLICATION, StorageTarget.USER);
		},
	});

	const shellProcessString = getShellProcessTooltip(instance, !!showDetailed);
	const content = new MarkdownString(instance.title + shellProcessString + statusString, { supportThemeIcons: true });

	return { content, actions };
}

export function getShellProcessTooltip(instance: ITerminalInstance, showDetailed: boolean): string {
	const lines: string[] = [];

	if (instance.processId && instance.processId > 0) {
		lines.push(localize({ key: 'shellProcessTooltip.processId', comment: ['The first arg is "PID" which shouldn\'t be translated'] }, "Process ID ({0}): {1}", 'PID', instance.processId) + '\n');
	}

	if (instance.shellLaunchConfig.executable) {
		let commandLine = '';
		if (!showDetailed && instance.shellLaunchConfig.executable.length > 32) {
			const base = basename(instance.shellLaunchConfig.executable);
			const sepIndex = instance.shellLaunchConfig.executable.length - base.length - 1;
			const sep = instance.shellLaunchConfig.executable.substring(sepIndex, sepIndex + 1);
			commandLine += `…${sep}${base}`;
		} else {
			commandLine += instance.shellLaunchConfig.executable;
		}
		const args = asArray(instance.injectedArgs || instance.shellLaunchConfig.args || []).map(x => x.match(/\s/) ? `'${x}'` : x).join(' ');
		if (args) {
			commandLine += ` ${args}`;
		}

		lines.push(localize('shellProcessTooltip.commandLine', 'Command line: {0}', commandLine));
	}

	return lines.length ? `\n\n---\n\n${lines.join('\n')}` : '';
}

export function refreshShellIntegrationInfoStatus(instance: ITerminalInstance) {
	if (!instance.xterm) {
		return;
	}
	const cmdDetectionType = (
		instance.capabilities.get(TerminalCapability.CommandDetection)?.hasRichCommandDetection
			? localize('shellIntegration.rich', 'Rich')
			: instance.capabilities.has(TerminalCapability.CommandDetection)
				? localize('shellIntegration.basic', 'Basic')
				: instance.usedShellIntegrationInjection
					? localize('shellIntegration.injectionFailed', "Injection failed to activate")
					: localize('shellIntegration.no', 'No')
	);

	const detailedAdditions: string[] = [];
	if (instance.shellType) {
		detailedAdditions.push(`Shell type: \`${instance.shellType}\``);
	}
	const cwd = instance.cwd;
	if (cwd) {
		detailedAdditions.push(`Current working directory: \`${cwd}\``);
	}
	const seenSequences = Array.from(instance.xterm.shellIntegration.seenSequences);
	if (seenSequences.length > 0) {
		detailedAdditions.push(`Seen sequences: ${seenSequences.map(e => `\`${e}\``).join(', ')}`);
	}
	const promptType = instance.capabilities.get(TerminalCapability.PromptTypeDetection)?.promptType;
	if (promptType) {
		detailedAdditions.push(`Prompt type: \`${promptType}\``);
	}
	const combinedString = instance.capabilities.get(TerminalCapability.CommandDetection)?.promptInputModel.getCombinedString();
	if (combinedString !== undefined) {
		detailedAdditions.push(`Prompt input: \`\`\`${combinedString}\`\`\``);
	}
	const detailedAdditionsString = detailedAdditions.length > 0
		? '\n\n' + detailedAdditions.map(e => `- ${e}`).join('\n')
		: '';

	instance.statusList.add({
		id: TerminalStatus.ShellIntegrationInfo,
		severity: Severity.Info,
		tooltip: `${localize('shellIntegration', "Shell integration")}: ${cmdDetectionType}`,
		detailedTooltip: `${localize('shellIntegration', "Shell integration")}: ${cmdDetectionType}${detailedAdditionsString}`
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalUri.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalUri.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { ITerminalInstance, TerminalDataTransfers } from './terminal.js';

export interface ITerminalUriMetadata {
	title?: string;
	commandId?: string;
	commandLine?: string;
}

export function parseTerminalUri(resource: URI): ITerminalIdentifier {
	const [, workspaceId, instanceId] = resource.path.split('/');
	if (!workspaceId || !Number.parseInt(instanceId)) {
		throw new Error(`Could not parse terminal uri for resource ${resource}`);
	}
	return { workspaceId, instanceId: Number.parseInt(instanceId) };
}

export function getTerminalUri(workspaceId: string, instanceId: number, title?: string, commandId?: string): URI {
	const params = new URLSearchParams();
	if (commandId) {
		params.set('command', commandId);
	}
	return URI.from({
		scheme: Schemas.vscodeTerminal,
		path: `/${workspaceId}/${instanceId}`,
		fragment: title || undefined,
		query: commandId ? params.toString() : undefined
	});
}


export interface ITerminalIdentifier {
	workspaceId: string;
	instanceId: number | undefined;
}

export interface IPartialDragEvent {
	dataTransfer: Pick<DataTransfer, 'getData'> | null;
}

export function getTerminalResourcesFromDragEvent(event: IPartialDragEvent): URI[] | undefined {
	const resources = event.dataTransfer?.getData(TerminalDataTransfers.Terminals);
	if (resources) {
		const json = JSON.parse(resources);
		const result = [];
		for (const entry of json) {
			result.push(URI.parse(entry));
		}
		return result.length === 0 ? undefined : result;
	}
	return undefined;
}

export function getInstanceFromResource<T extends Pick<ITerminalInstance, 'resource'>>(instances: T[], resource: URI | undefined): T | undefined {
	if (resource) {
		for (const instance of instances) {
			// Note that the URI's workspace and instance id might not originally be from this window
			// Don't bother checking the scheme and assume instances only contains terminals
			if (instance.resource.path === resource.path) {
				return instance;
			}
		}
	}
	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalView.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import * as dom from '../../../../base/browser/dom.js';
import * as domStylesheetsJs from '../../../../base/browser/domStylesheets.js';
import * as cssJs from '../../../../base/browser/cssValue.js';
import { Action, IAction } from '../../../../base/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextMenuService, IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IThemeService, Themable } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { switchTerminalShowTabsTitle } from './terminalActions.js';
import { INotificationService, IPromptChoice, Severity } from '../../../../platform/notification/common/notification.js';
import { ICreateTerminalOptions, ITerminalConfigurationService, ITerminalGroupService, ITerminalInstance, ITerminalService, TerminalConnectionState, TerminalDataTransfers } from './terminal.js';
import { ViewPane, IViewPaneOptions } from '../../../browser/parts/views/viewPane.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IMenu, IMenuService, MenuId, MenuItemAction } from '../../../../platform/actions/common/actions.js';
import { ITerminalProfileResolverService, ITerminalProfileService, TerminalCommandId } from '../common/terminal.js';
import { TerminalSettingId, ITerminalProfile, TerminalLocation } from '../../../../platform/terminal/common/terminal.js';
import { ActionViewItem, IBaseActionViewItemOptions, SelectActionViewItem } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { asCssVariable, selectBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { ISelectOptionItem, SeparatorSelectOption } from '../../../../base/browser/ui/selectBox/selectBox.js';
import { IActionViewItem } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { TerminalTabbedView } from './terminalTabbedView.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { renderLabelWithIcons } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { getColorForSeverity } from './terminalStatusList.js';
import { getFlatContextMenuActions, MenuEntryActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { DropdownWithPrimaryActionViewItem } from '../../../../platform/actions/browser/dropdownWithPrimaryActionViewItem.js';
import { DisposableMap, DisposableStore, dispose, IDisposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { isDark } from '../../../../platform/theme/common/theme.js';
import { getColorClass, getUriClasses } from './terminalIcon.js';
import { getTerminalActionBarArgs } from './terminalMenus.js';
import { TerminalContextKeys } from '../common/terminalContextKey.js';
import { getInstanceHoverInfo } from './terminalTooltip.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { TerminalCapability } from '../../../../platform/terminal/common/capabilities/capabilities.js';
import { defaultSelectBoxStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { Event } from '../../../../base/common/event.js';
import { IHoverDelegate, IHoverDelegateOptions } from '../../../../base/browser/ui/hover/hoverDelegate.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { InstanceContext, TerminalContextActionRunner } from './terminalContextMenu.js';
import { MicrotaskDelay } from '../../../../base/common/symbols.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { hasNativeContextMenu } from '../../../../platform/window/common/window.js';
import { hasKey } from '../../../../base/common/types.js';

export class TerminalViewPane extends ViewPane {
	private _parentDomElement: HTMLElement | undefined;
	private _terminalTabbedView?: TerminalTabbedView;
	get terminalTabbedView(): TerminalTabbedView | undefined { return this._terminalTabbedView; }
	private _isInitialized: boolean = false;
	/**
	 * Tracks an active promise of terminal creation requested by this component. This helps prevent
	 * double creation for example when toggling a terminal's visibility and focusing it.
	 */
	private _isTerminalBeingCreated: boolean = false;
	private readonly _newDropdown: MutableDisposable<DropdownWithPrimaryActionViewItem> = this._register(new MutableDisposable());
	private readonly _dropdownMenu: IMenu;
	private readonly _singleTabMenu: IMenu;
	private _viewShowing: IContextKey<boolean>;
	private readonly _disposableStore = this._register(new DisposableStore());
	private readonly _actionDisposables: DisposableMap<TerminalCommandId> = this._register(new DisposableMap());

	constructor(
		options: IViewPaneOptions,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@ITerminalConfigurationService private readonly _terminalConfigurationService: ITerminalConfigurationService,
		@ITerminalGroupService private readonly _terminalGroupService: ITerminalGroupService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IOpenerService openerService: IOpenerService,
		@IMenuService private readonly _menuService: IMenuService,
		@ITerminalProfileService private readonly _terminalProfileService: ITerminalProfileService,
		@ITerminalProfileResolverService private readonly _terminalProfileResolverService: ITerminalProfileResolverService,
	) {
		super(options, keybindingService, contextMenuService, _configurationService, _contextKeyService, viewDescriptorService, _instantiationService, openerService, themeService, hoverService);
		this._register(this._terminalService.onDidRegisterProcessSupport(() => {
			this._onDidChangeViewWelcomeState.fire();
		}));

		this._register(this._terminalService.onDidChangeInstances(() => {
			// If the first terminal is opened, hide the welcome view
			// and if the last one is closed, show it again
			if (this._hasWelcomeScreen() && this._terminalGroupService.instances.length <= 1) {
				this._onDidChangeViewWelcomeState.fire();
			}
			if (!this._parentDomElement) { return; }
			// If we do not have the tab view yet, create it now.
			if (!this._terminalTabbedView) {
				this._createTabsView();
			}
			this.layoutBody(this._parentDomElement.offsetHeight, this._parentDomElement.offsetWidth);
		}));
		this._dropdownMenu = this._register(this._menuService.createMenu(MenuId.TerminalNewDropdownContext, this._contextKeyService));
		this._singleTabMenu = this._register(this._menuService.createMenu(MenuId.TerminalTabContext, this._contextKeyService));
		this._register(this._terminalProfileService.onDidChangeAvailableProfiles(profiles => this._updateTabActionBar(profiles)));
		this._viewShowing = TerminalContextKeys.viewShowing.bindTo(this._contextKeyService);
		this._register(this.onDidChangeBodyVisibility(e => {
			if (e) {
				this._terminalTabbedView?.rerenderTabs();
			}
		}));
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (this._parentDomElement && (e.affectsConfiguration(TerminalSettingId.ShellIntegrationDecorationsEnabled) || e.affectsConfiguration(TerminalSettingId.ShellIntegrationEnabled))) {
				this._updateForShellIntegration(this._parentDomElement);
			}
		}));
		const shellIntegrationDisposable = this._register(new MutableDisposable());
		shellIntegrationDisposable.value = this._terminalService.onAnyInstanceAddedCapabilityType(c => {
			if (c === TerminalCapability.CommandDetection && this._gutterDecorationsEnabled()) {
				this._parentDomElement?.classList.add('shell-integration');
				shellIntegrationDisposable.clear();
			}
		});
	}

	private _updateForShellIntegration(container: HTMLElement) {
		container.classList.toggle('shell-integration', this._gutterDecorationsEnabled());
	}

	private _gutterDecorationsEnabled(): boolean {
		const decorationsEnabled = this._configurationService.getValue(TerminalSettingId.ShellIntegrationDecorationsEnabled);
		return (decorationsEnabled === 'both' || decorationsEnabled === 'gutter') && this._configurationService.getValue(TerminalSettingId.ShellIntegrationEnabled);
	}

	private _initializeTerminal(checkRestoredTerminals: boolean) {
		if (this.isBodyVisible() && this._terminalService.isProcessSupportRegistered && this._terminalService.connectionState === TerminalConnectionState.Connected) {
			const wasInitialized = this._isInitialized;
			this._isInitialized = true;

			let hideOnStartup: 'never' | 'whenEmpty' | 'always' = 'never';
			if (!wasInitialized) {
				hideOnStartup = this._configurationService.getValue(TerminalSettingId.HideOnStartup);
				if (hideOnStartup === 'always') {
					this._terminalGroupService.hidePanel();
				}
			}

			let shouldCreate = this._terminalGroupService.groups.length === 0;
			// When triggered just after reconnection, also check there are no groups that could be
			// getting restored currently
			if (checkRestoredTerminals) {
				shouldCreate &&= this._terminalService.restoredGroupCount === 0;
			}
			if (!shouldCreate) {
				return;
			}
			if (!wasInitialized) {
				switch (hideOnStartup) {
					case 'never':
						this._isTerminalBeingCreated = true;
						this._terminalService.createTerminal({ location: TerminalLocation.Panel }).finally(() => this._isTerminalBeingCreated = false);
						break;
					case 'whenEmpty':
						if (this._terminalService.restoredGroupCount === 0) {
							this._terminalGroupService.hidePanel();
						}
						break;
				}
				return;
			}

			if (!this._isTerminalBeingCreated) {
				this._isTerminalBeingCreated = true;
				this._terminalService.createTerminal({ location: TerminalLocation.Panel }).finally(() => this._isTerminalBeingCreated = false);
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		if (!this._parentDomElement) {
			this._updateForShellIntegration(container);
		}
		this._parentDomElement = container;
		this._parentDomElement.classList.add('integrated-terminal');
		domStylesheetsJs.createStyleSheet(this._parentDomElement);
		this._instantiationService.createInstance(TerminalThemeIconStyle, this._parentDomElement);

		if (!this.shouldShowWelcome()) {
			this._createTabsView();
		}

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TerminalSettingId.FontFamily) || e.affectsConfiguration('editor.fontFamily')) {
				if (!this._terminalConfigurationService.configFontIsMonospace()) {
					const choices: IPromptChoice[] = [{
						label: nls.localize('terminal.useMonospace', "Use 'monospace'"),
						run: () => this.configurationService.updateValue(TerminalSettingId.FontFamily, 'monospace'),
					}];
					this._notificationService.prompt(Severity.Warning, nls.localize('terminal.monospaceOnly', "The terminal only supports monospace fonts. Be sure to restart VS Code if this is a newly installed font."), choices);
				}
			}
		}));
		this._register(this.onDidChangeBodyVisibility(async visible => {
			this._viewShowing.set(visible);
			if (visible) {
				if (this._hasWelcomeScreen()) {
					this._onDidChangeViewWelcomeState.fire();
				}
				this._initializeTerminal(false);
				// we don't know here whether or not it should be focused, so
				// defer focusing the panel to the focus() call
				// to prevent overriding preserveFocus for extensions
				this._terminalGroupService.showPanel(false);
			} else {
				for (const instance of this._terminalGroupService.instances) {
					instance.resetFocusContextKey();
				}
			}
			this._terminalGroupService.updateVisibility();
		}));
		this._register(this._terminalService.onDidChangeConnectionState(() => this._initializeTerminal(true)));
		this.layoutBody(this._parentDomElement.offsetHeight, this._parentDomElement.offsetWidth);
	}

	private _createTabsView(): void {
		if (!this._parentDomElement) {
			return;
		}
		this._terminalTabbedView = this._register(this.instantiationService.createInstance(TerminalTabbedView, this._parentDomElement));
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);
		this._terminalTabbedView?.layout(width, height);
	}

	override createActionViewItem(action: Action, options: IBaseActionViewItemOptions): IActionViewItem | undefined {
		switch (action.id) {
			case TerminalCommandId.Split: {
				// Split needs to be special cased to force splitting within the panel, not the editor
				const that = this;
				const store = new DisposableStore();
				const panelOnlySplitAction = store.add(new class extends Action {
					constructor() {
						super(action.id, action.label, action.class, action.enabled);
						this.checked = action.checked;
						this.tooltip = action.tooltip;
					}
					override async run() {
						const instance = that._terminalGroupService.activeInstance;
						if (instance) {
							const newInstance = await that._terminalService.createTerminal({ location: { parentTerminal: instance } });
							return newInstance?.focusWhenReady();
						}
						return;
					}
				});
				const item = store.add(new ActionViewItem(action, panelOnlySplitAction, { ...options, icon: true, label: false, keybinding: this._getKeybindingLabel(action) }));
				this._actionDisposables.set(action.id, store);
				return item;
			}
			case TerminalCommandId.SwitchTerminal: {
				const item = this._instantiationService.createInstance(SwitchTerminalActionViewItem, action);
				this._actionDisposables.set(action.id, item);
				return item;
			}
			case TerminalCommandId.Focus: {
				if (action instanceof MenuItemAction) {
					const actions = getFlatContextMenuActions(this._singleTabMenu.getActions({ shouldForwardArgs: true }));
					const item = this._instantiationService.createInstance(SingleTerminalTabActionViewItem, action, actions);
					this._actionDisposables.set(action.id, item);
					return item;
				}
				break;
			}
			case TerminalCommandId.New: {
				if (action instanceof MenuItemAction) {
					this._disposableStore.clear();
					const actions = getTerminalActionBarArgs(TerminalLocation.Panel, this._terminalProfileService.availableProfiles, this._getDefaultProfileName(), this._terminalProfileService.contributedProfiles, this._terminalService, this._dropdownMenu, this._disposableStore);
					this._newDropdown.value = this._instantiationService.createInstance(DropdownWithPrimaryActionViewItem, action, actions.dropdownAction, actions.dropdownMenuActions, actions.className, {
						hoverDelegate: options.hoverDelegate,
						getKeyBinding: (action: IAction) => this._keybindingService.lookupKeybinding(action.id, this._contextKeyService)
					});
					this._newDropdown.value?.update(actions.dropdownAction, actions.dropdownMenuActions);
					return this._newDropdown.value;
				}
			}
		}
		return super.createActionViewItem(action, options);
	}

	private _getDefaultProfileName(): string {
		let defaultProfileName;
		try {
			defaultProfileName = this._terminalProfileService.getDefaultProfileName();
		} catch (e) {
			defaultProfileName = this._terminalProfileResolverService.defaultProfileName;
		}
		return defaultProfileName!;
	}

	private _getKeybindingLabel(action: IAction): string | undefined {
		return this._keybindingService.lookupKeybinding(action.id)?.getLabel() ?? undefined;
	}

	private _updateTabActionBar(profiles: ITerminalProfile[]): void {
		this._disposableStore.clear();
		const actions = getTerminalActionBarArgs(TerminalLocation.Panel, profiles, this._getDefaultProfileName(), this._terminalProfileService.contributedProfiles, this._terminalService, this._dropdownMenu, this._disposableStore);
		this._newDropdown.value?.update(actions.dropdownAction, actions.dropdownMenuActions);
	}

	override focus() {
		super.focus();
		if (this._terminalService.connectionState === TerminalConnectionState.Connected) {
			if (this._terminalGroupService.instances.length === 0 && !this._isTerminalBeingCreated) {
				this._isTerminalBeingCreated = true;
				this._terminalService.createTerminal({ location: TerminalLocation.Panel }).finally(() => this._isTerminalBeingCreated = false);
			}
			this._terminalGroupService.showPanel(true);
			return;
		}

		// If the terminal is waiting to reconnect to remote terminals, then there is no TerminalInstance yet that can
		// be focused. So wait for connection to finish, then focus.
		const previousActiveElement = this.element.ownerDocument.activeElement;
		if (previousActiveElement) {
			// TODO: Improve lifecycle management this event should be disposed after first fire
			this._register(this._terminalService.onDidChangeConnectionState(() => {
				// Only focus the terminal if the activeElement has not changed since focus() was called
				// TODO: Hack
				if (previousActiveElement && dom.isActiveElement(previousActiveElement)) {
					this._terminalGroupService.showPanel(true);
				}
			}));
		}
	}

	private _hasWelcomeScreen(): boolean {
		return !this._terminalService.isProcessSupportRegistered;
	}

	override shouldShowWelcome(): boolean {
		return this._hasWelcomeScreen() && this._terminalService.instances.length === 0;
	}
}

class SwitchTerminalActionViewItem extends SelectActionViewItem {
	constructor(
		action: IAction,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@ITerminalGroupService private readonly _terminalGroupService: ITerminalGroupService,
		@IContextViewService contextViewService: IContextViewService,
		@ITerminalProfileService terminalProfileService: ITerminalProfileService,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super(null, action, getTerminalSelectOpenItems(_terminalService, _terminalGroupService), _terminalGroupService.activeGroupIndex, contextViewService, defaultSelectBoxStyles, { ariaLabel: nls.localize('terminals', 'Open Terminals.'), optionsAsChildren: true, useCustomDrawn: !hasNativeContextMenu(configurationService) });
		this._register(_terminalService.onDidChangeInstances(() => this._updateItems(), this));
		this._register(_terminalService.onDidChangeActiveGroup(() => this._updateItems(), this));
		this._register(_terminalService.onDidChangeActiveInstance(() => this._updateItems(), this));
		this._register(_terminalService.onAnyInstanceTitleChange(() => this._updateItems(), this));
		this._register(_terminalGroupService.onDidChangeGroups(() => this._updateItems(), this));
		this._register(_terminalService.onDidChangeConnectionState(() => this._updateItems(), this));
		this._register(terminalProfileService.onDidChangeAvailableProfiles(() => this._updateItems(), this));
		this._register(_terminalService.onAnyInstancePrimaryStatusChange(() => this._updateItems(), this));
	}

	override render(container: HTMLElement): void {
		super.render(container);
		container.classList.add('switch-terminal');
		container.style.borderColor = asCssVariable(selectBorder);
	}

	private _updateItems(): void {
		const options = getTerminalSelectOpenItems(this._terminalService, this._terminalGroupService);
		this.setOptions(options, this._terminalGroupService.activeGroupIndex);
	}
}

function getTerminalSelectOpenItems(terminalService: ITerminalService, terminalGroupService: ITerminalGroupService): ISelectOptionItem[] {
	let items: ISelectOptionItem[];
	if (terminalService.connectionState === TerminalConnectionState.Connected) {
		items = terminalGroupService.getGroupLabels().map(label => {
			return { text: label };
		});
	} else {
		items = [{ text: nls.localize('terminalConnectingLabel', "Starting...") }];
	}
	items.push(SeparatorSelectOption);
	items.push({ text: switchTerminalShowTabsTitle });
	return items;
}

class SingleTerminalTabActionViewItem extends MenuEntryActionViewItem {
	private _color: string | undefined;
	private _altCommand: string | undefined;
	private _class: string | undefined;
	private readonly _elementDisposables: IDisposable[] = [];

	constructor(
		action: MenuItemAction,
		private readonly _actions: IAction[],
		@IKeybindingService keybindingService: IKeybindingService,
		@INotificationService notificationService: INotificationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IThemeService themeService: IThemeService,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@ITerminalConfigurationService private readonly _terminaConfigurationService: ITerminalConfigurationService,
		@ITerminalGroupService private readonly _terminalGroupService: ITerminalGroupService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@ICommandService private readonly _commandService: ICommandService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IAccessibilityService _accessibilityService: IAccessibilityService
	) {
		super(action, {
			draggable: true,
			hoverDelegate: _instantiationService.createInstance(SingleTabHoverDelegate)
		}, keybindingService, notificationService, contextKeyService, themeService, contextMenuService, _accessibilityService);

		// Register listeners to update the tab
		this._register(Event.debounce<ITerminalInstance | undefined, Set<ITerminalInstance>>(Event.any(
			this._terminalService.onAnyInstancePrimaryStatusChange,
			this._terminalGroupService.onDidChangeActiveInstance,
			Event.map(this._terminalService.onAnyInstanceIconChange, e => e.instance),
			this._terminalService.onAnyInstanceTitleChange,
			this._terminalService.onDidChangeInstanceCapability,
		), (last, e) => {
			if (!last) {
				last = new Set();
			}
			if (e) {
				last.add(e);
			}
			return last;
		}, MicrotaskDelay)(merged => {
			for (const e of merged) {
				this.updateLabel(e);
			}
		}));

		// Clean up on dispose
		this._register(toDisposable(() => dispose(this._elementDisposables)));
	}

	override async onClick(event: MouseEvent): Promise<void> {
		this._terminalGroupService.lastAccessedMenu = 'inline-tab';
		if (event.altKey && this._menuItemAction.alt) {
			this._commandService.executeCommand(this._menuItemAction.alt.id, { location: TerminalLocation.Panel } satisfies ICreateTerminalOptions);
		} else {
			this._openContextMenu();
		}
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	protected override updateLabel(e?: ITerminalInstance): void {
		// Only update if it's the active instance
		if (e && e !== this._terminalGroupService.activeInstance) {
			return;
		}

		if (this._elementDisposables.length === 0 && this.element && this.label) {
			// Right click opens context menu
			this._elementDisposables.push(dom.addDisposableListener(this.element, dom.EventType.CONTEXT_MENU, e => {
				if (e.button === 2) {
					this._openContextMenu();
					e.stopPropagation();
					e.preventDefault();
				}
			}));
			// Middle click kills
			this._elementDisposables.push(dom.addDisposableListener(this.element, dom.EventType.AUXCLICK, e => {
				if (e.button === 1) {
					const instance = this._terminalGroupService.activeInstance;
					if (instance) {
						this._terminalService.safeDisposeTerminal(instance);
					}
					e.preventDefault();
				}
			}));
			// Drag and drop
			this._elementDisposables.push(dom.addDisposableListener(this.element, dom.EventType.DRAG_START, e => {
				const instance = this._terminalGroupService.activeInstance;
				if (e.dataTransfer && instance) {
					e.dataTransfer.setData(TerminalDataTransfers.Terminals, JSON.stringify([instance.resource.toString()]));
				}
			}));
		}
		if (this.label) {
			const label = this.label;
			const instance = this._terminalGroupService.activeInstance;
			if (!instance) {
				dom.reset(label, '');
				return;
			}
			label.classList.add('single-terminal-tab');
			let colorStyle = '';
			const primaryStatus = instance.statusList.primary;
			if (primaryStatus) {
				const colorKey = getColorForSeverity(primaryStatus.severity);
				this._themeService.getColorTheme();
				const foundColor = this._themeService.getColorTheme().getColor(colorKey);
				if (foundColor) {
					colorStyle = foundColor.toString();
				}
			}
			label.style.color = colorStyle;
			dom.reset(label, ...renderLabelWithIcons(this._instantiationService.invokeFunction(getSingleTabLabel, instance, this._terminaConfigurationService.config.tabs.separator, ThemeIcon.isThemeIcon(this._commandAction.item.icon) ? this._commandAction.item.icon : undefined)));

			if (this._altCommand) {
				label.classList.remove(this._altCommand);
				this._altCommand = undefined;
			}
			if (this._color) {
				label.classList.remove(this._color);
				this._color = undefined;
			}
			if (this._class) {
				label.classList.remove(this._class);
				label.classList.remove('terminal-uri-icon');
				this._class = undefined;
			}
			const colorClass = getColorClass(instance);
			if (colorClass) {
				this._color = colorClass;
				label.classList.add(colorClass);
			}
			const uriClasses = getUriClasses(instance, this._themeService.getColorTheme().type);
			if (uriClasses) {
				this._class = uriClasses?.[0];
				label.classList.add(...uriClasses);
			}
			if (this._commandAction.item.icon) {
				this._altCommand = `alt-command`;
				label.classList.add(this._altCommand);
			}
			this.updateTooltip();
		}
	}

	private _openContextMenu() {
		const actionRunner = new TerminalContextActionRunner();
		this._contextMenuService.showContextMenu({
			actionRunner,
			getAnchor: () => this.element!,
			getActions: () => this._actions,
			// The context is always the active instance in the terminal view
			getActionsContext: () => {
				const instance = this._terminalGroupService.activeInstance;
				return instance ? [new InstanceContext(instance)] : [];
			},
			onHide: () => actionRunner.dispose()
		});
	}
}

function getSingleTabLabel(accessor: ServicesAccessor, instance: ITerminalInstance | undefined, separator: string, icon?: ThemeIcon) {
	// Don't even show the icon if there is no title as the icon would shift around when the title
	// is added
	if (!instance || !instance.title) {
		return '';
	}
	const iconId = ThemeIcon.isThemeIcon(instance.icon) ? instance.icon.id : accessor.get(ITerminalProfileResolverService).getDefaultIcon().id;
	const label = `$(${icon?.id || iconId}) ${getSingleTabTitle(instance, separator)}`;

	const primaryStatus = instance.statusList.primary;
	if (!primaryStatus?.icon) {
		return label;
	}
	return `${label} $(${primaryStatus.icon.id})`;
}

function getSingleTabTitle(instance: ITerminalInstance | undefined, separator: string): string {
	if (!instance) {
		return '';
	}
	return !instance.description ? instance.title : `${instance.title} ${separator} ${instance.description}`;
}

class TerminalThemeIconStyle extends Themable {
	private _styleElement: HTMLElement;
	constructor(
		container: HTMLElement,
		@IThemeService private readonly _themeService: IThemeService,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@ITerminalGroupService private readonly _terminalGroupService: ITerminalGroupService
	) {
		super(_themeService);
		this._registerListeners();
		this._styleElement = domStylesheetsJs.createStyleSheet(container);
		this._register(toDisposable(() => this._styleElement.remove()));
		this.updateStyles();
	}

	private _registerListeners(): void {
		this._register(this._terminalService.onAnyInstanceIconChange(() => this.updateStyles()));
		this._register(this._terminalService.onDidChangeInstances(() => this.updateStyles()));
		this._register(this._terminalGroupService.onDidChangeGroups(() => this.updateStyles()));
	}

	override updateStyles(): void {
		super.updateStyles();
		const colorTheme = this._themeService.getColorTheme();

		// TODO: add a rule collector to avoid duplication
		let css = '';

		// Add icons
		for (const instance of this._terminalService.instances) {
			const icon = instance.icon;
			if (!icon) {
				continue;
			}
			let uri = undefined;
			if (icon instanceof URI) {
				uri = icon;
			} else if (icon instanceof Object && hasKey(icon, { light: true, dark: true })) {
				uri = isDark(colorTheme.type) ? icon.dark : icon.light;
			}
			const iconClasses = getUriClasses(instance, colorTheme.type);
			if (uri instanceof URI && iconClasses && iconClasses.length > 1) {
				css += (
					`.monaco-workbench .${iconClasses[0]} .monaco-highlighted-label .codicon, .monaco-action-bar .terminal-uri-icon.single-terminal-tab.action-label:not(.alt-command) .codicon` +
					`{background-image: ${cssJs.asCSSUrl(uri)};}`
				);
			}
		}

		// Add colors
		for (const instance of this._terminalService.instances) {
			const colorClass = getColorClass(instance);
			if (!colorClass || !instance.color) {
				continue;
			}
			const color = colorTheme.getColor(instance.color);
			if (color) {
				// exclude status icons (file-icon) and inline action icons (trashcan, horizontalSplit, rerunTask)
				css += (
					`.monaco-workbench .${colorClass} .codicon:first-child:not(.codicon-split-horizontal):not(.codicon-trashcan):not(.file-icon):not(.codicon-rerun-task)` +
					`{ color: ${color} !important; }`
				);
			}
		}

		this._styleElement.textContent = css;
	}
}

class SingleTabHoverDelegate implements IHoverDelegate {
	private _lastHoverHideTime: number = 0;

	readonly placement = 'element';

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IHoverService private readonly _hoverService: IHoverService,
		@IStorageService private readonly _storageService: IStorageService,
		@ITerminalGroupService private readonly _terminalGroupService: ITerminalGroupService,
	) {
	}

	get delay(): number {
		return Date.now() - this._lastHoverHideTime < 200
			? 0  // show instantly when a hover was recently shown
			: this._configurationService.getValue<number>('workbench.hover.delay');
	}

	showHover(options: IHoverDelegateOptions, focus?: boolean) {
		const instance = this._terminalGroupService.activeInstance;
		if (!instance) {
			return;
		}
		const hoverInfo = getInstanceHoverInfo(instance, this._storageService);
		return this._hoverService.showInstantHover({
			...options,
			content: hoverInfo.content,
			actions: hoverInfo.actions
		}, focus);
	}

	onDidHideHover() {
		this._lastHoverHideTime = Date.now();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/xterm-private.d.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/xterm-private.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IBufferCell } from '@xterm/xterm';

export type XtermAttributes = Omit<IBufferCell, 'getWidth' | 'getChars' | 'getCode'> & { clone?(): XtermAttributes };

export interface IXtermCore {
	viewport?: {
		readonly scrollBarWidth: number;
		_innerRefresh(): void;
	};

	_inputHandler: {
		_curAttrData: XtermAttributes;
	};

	_renderService: {
		dimensions: {
			css: {
				cell: {
					width: number;
					height: number;
				}
			}
		},
		_renderer: {
			value?: unknown;
		};
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/media/terminal.css]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/media/terminal.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .pane-body.integrated-terminal {
	align-content: flex-start;
	align-items: baseline;
	display: flex;
	flex-direction: column;
	background-color: transparent !important;
	user-select: initial;
	-webkit-user-select: initial;
	position: relative;
	/* Create stacking context before to terminal canvases. */
	z-index: 0;
}

.terminal-command-decoration.hide {
	visibility: hidden;
}
.monaco-workbench .part.panel .pane-body.integrated-terminal .terminal-outer-container {
	background-color: var(--vscode-terminal-background, var(--vscode-panel-background));
}
.monaco-workbench .pane-body.integrated-terminal .terminal-outer-container,
.monaco-workbench .pane-body.integrated-terminal .terminal-groups-container,
.monaco-workbench .pane-body.integrated-terminal .terminal-group,
.monaco-workbench .pane-body.integrated-terminal .terminal-split-pane,
.monaco-workbench .terminal-editor .terminal-split-pane,
.monaco-workbench .terminal-editor .terminal-outer-container {
	height: 100%;
}
.monaco-workbench .part.sidebar .pane-body.integrated-terminal .terminal-outer-container,
.monaco-workbench .part.auxiliarybar .pane-body.integrated-terminal .terminal-outer-container {
	background-color: var(--vscode-terminal-background, var(--vscode-sideBar-background));
}

.monaco-workbench .pane-body.integrated-terminal .split-view-view:not(:first-child),
.monaco-workbench .pane-body.integrated-terminal .tabs-container {
	border-color: var(--vscode-terminal-border);
}

.monaco-workbench .pane-body.integrated-terminal .terminal-drop-overlay {
	background-color: var(--vscode-terminal-dropBackground, var(--vscode-editorGroup-dropBackground));
}

.monaco-workbench .pane-body.integrated-terminal .terminal-tabs-entry.is-active::before {
	background-color: var(--vscode-terminal-tab-activeBorder);
}
/* Override monaco's styles for terminal editors */
.monaco-workbench .terminal-editor .xterm textarea:focus {
	opacity: 0 !important;
	outline: 0 !important;
}

.monaco-workbench .xterm .xterm-helper-textarea:focus {
	/* Override the general vscode style applies `opacity:1!important` to textareas */
	opacity: 0 !important;
}

.monaco-workbench .terminal-tab:not(.terminal-uri-icon)::before {
	background-image: none !important;
}

.monaco-workbench .terminal-editor .terminal-wrapper {
	background-color: var(--vscode-terminal-background, var(--vscode-editorPane-background));
}
.monaco-workbench .terminal-editor .terminal-wrapper,
.monaco-workbench .pane-body.integrated-terminal .terminal-wrapper {
	display: block;
	height: 100%;
	box-sizing: border-box;
}

.monaco-workbench .xterm {
	/* All terminals have at least 20px left padding for the gutter */
	padding-left: 20px;
}

.monaco-workbench .xterm .xterm-scrollable-element {
	/* Offset the scrollable element such that:
	 * - The terminal grid will be positioned to the right of the gutter
	 * - Elements are not hidden in the gutter */
	margin-left: -20px;
	padding-left: 20px;
}

.monaco-workbench .terminal-editor .xterm,
.monaco-workbench .pane-body.integrated-terminal .xterm {
	/* Bottom align the terminal within the split pane */
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
}

.terminal-side-view .terminal.xterm {
	/* Top align the terminal within the split pane when the panel is vertical */
	top: 0;
}

.monaco-workbench .terminal-editor .terminal-wrapper.fixed-dims .xterm,
.monaco-workbench .pane-body.integrated-terminal .terminal-wrapper.fixed-dims .xterm {
	position: static;
}

.monaco-workbench .terminal-editor .xterm-viewport,
.monaco-workbench .pane-body.integrated-terminal .xterm-viewport {
	z-index: 30;
}

.monaco-workbench .terminal-editor .xterm-decoration-overview-ruler,
.monaco-workbench .pane-body.integrated-terminal .xterm-decoration-overview-ruler {
	z-index: 31; /* Must be higher than .xterm-viewport */
	pointer-events: none;
}

.monaco-workbench .terminal-editor .xterm-screen,
.monaco-workbench .pane-body.integrated-terminal .xterm-screen {
	z-index: 31;
}

.xterm .xterm-screen {
	cursor: text;
}

.monaco-workbench .simple-find-part-wrapper.result-count {
	z-index: 33 !important;
}

.xterm .xterm-accessibility {
	z-index: 32 !important;
	pointer-events: none;
}

/* Apply cursor styles to xterm-screen as well due to how .xterm-viewport/.xterm are positioned */
.xterm.enable-mouse-events .xterm-screen  { cursor: default; }
.xterm.xterm-cursor-pointer .xterm-screen { cursor: pointer; }
.xterm.column-select.focus .xterm-screen  { cursor: crosshair; }

.monaco-workbench .terminal-editor .xterm a:not(.xterm-invalid-link),
.monaco-workbench .pane-body.integrated-terminal .xterm a:not(.xterm-invalid-link) {
	/* To support message box sizing */
	position: relative;
}

.monaco-workbench .terminal-editor .terminal-wrapper > div,
.monaco-workbench .pane-body.integrated-terminal .terminal-wrapper > div {
	height: 100%;
}

.monaco-workbench .terminal-editor .xterm-viewport,
.monaco-workbench .pane-body.integrated-terminal .xterm-viewport {
	box-sizing: border-box;
}

.monaco-workbench .terminal-editor .terminal-wrapper.fixed-dims,
.monaco-workbench .pane-body.integrated-terminal .terminal-wrapper.fixed-dims {
	/* The viewport should be positioned against this so it does't conflict with a fixed dimensions terminal horizontal scroll bar*/
	position: relative;
}

.monaco-workbench .terminal-editor .terminal-wrapper:not(.fixed-dims) .xterm-viewport,
.monaco-workbench .pane-body.integrated-terminal .terminal-wrapper:not(.fixed-dims) .xterm-viewport {
	/* Override xterm.js' position so the area that accepts mouse events extends to the edge of the scroll bar */
	right: 14px;
}

.monaco-workbench .pane-body.integrated-terminal .split-view-view {
	box-sizing: border-box;
	overflow: hidden;
}

.monaco-workbench .pane-body.integrated-terminal .split-view-view:first-child .tabs-container {
	border-right-width: 1px;
	border-right-style: solid;
}
.monaco-workbench .pane-body.integrated-terminal .split-view-view:last-child .tabs-container {
	border-left-width: 1px;
	border-left-style: solid;
}

/* border-color is set by theme key terminal.border */
.monaco-workbench .pane-body.integrated-terminal .terminal-group .monaco-split-view2.horizontal .split-view-view:not(:first-child) {
	border-left-width: 1px;
	border-left-style: solid;
}
.monaco-workbench .pane-body.integrated-terminal .terminal-group .monaco-split-view2.vertical .split-view-view:not(:first-child) {
	border-top-width: 1px;
	border-top-style: solid;
}

/* Use the default cursor when alt is active to help with clicking to move cursor */
.monaco-workbench .pane-body.integrated-terminal .terminal-groups-container.alt-active .xterm {
	cursor: default;
}

.monaco-workbench .pane-body.integrated-terminal .xterm {
	user-select: none;
	-webkit-user-select: none;
}
.monaco-workbench .pane-body.integrated-terminal .monaco-split-view2.vertical .split-view-view:not(:last-child) .xterm {
	/* When vertical and NOT the bottom terminal, align to the top instead to prevent the output jumping around erratically */
	top: 0;
	bottom: auto;
}

.monaco-workbench .pane-body.integrated-terminal .xterm:focus {
	/* Hide outline when focus jumps from xterm to the text area */
	outline: none;
}

.monaco-workbench.hc-black .pane-body.integrated-terminal .xterm.focus::before,
.monaco-workbench.hc-black .pane-body.integrated-terminal .xterm:focus::before,
.monaco-workbench.hc-light .pane-body.integrated-terminal .xterm:focus::before,
.monaco-workbench.hc-light .pane-body.integrated-terminal .xterm.focus::before {
	display: block;
	content: "";
	border: 1px solid;
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 32;
	pointer-events: none;
}

.monaco-workbench.hc-black .pane-body.integrated-terminal .monaco-split-view2.horizontal .split-view-view:not(:only-child) .xterm.focus::before,
.monaco-workbench.hc-black .pane-body.integrated-terminal .monaco-split-view2.horizontal .split-view-view:not(:only-child) .xterm:focus::before,
.monaco-workbench.hc-light .pane-body.integrated-terminal .monaco-split-view2.horizontal .split-view-view:not(:only-child) .xterm.focus::before,
.monaco-workbench.hc-light .pane-body.integrated-terminal .monaco-split-view2.horizontal .split-view-view:not(:only-child) .xterm:focus::before {
	right: 0;
}

.monaco-workbench .pane-body.integrated-terminal .xterm .xterm-helpers {
	position: absolute;
	top: 0;
}

.monaco-workbench.vs-dark.mac .pane-body.integrated-terminal .terminal-groups-container:not(.alt-active) .terminal:not(.enable-mouse-events),
.monaco-workbench.hc-black.mac .pane-body.integrated-terminal .terminal-groups-container:not(.alt-active) .terminal:not(.enable-mouse-events) {
	cursor: -webkit-image-set(url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAL0lEQVQoz2NgCD3x//9/BhBYBWdhgFVAiVW4JBFKGIa4AqD0//9D3pt4I4tAdAMAHTQ/j5Zom30AAAAASUVORK5CYII=') 1x, url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAz0lEQVRIx2NgYGBY/R8I/vx5eelX3n82IJ9FxGf6tksvf/8FiTMQAcAGQMDvSwu09abffY8QYSAScNk45G198eX//yev73/4///701eh//kZSARckrNBRvz//+8+6ZohwCzjGNjdgQxkAg7B9WADeBjIBqtJCbhRA0YNoIkBSNmaPEMoNmA0FkYNoFKhapJ6FGyAH3nauaSmPfwI0v/3OukVi0CIZ+F25KrtYcx/CTIy0e+rC7R1Z4KMICVTQQ14feVXIbR695u14+Ir4gwAAD49E54wc1kWAAAAAElFTkSuQmCC') 2x) 5 8, text;
}

/* Override default xterm style to make !important so it takes precedence over custom mac cursor */
.xterm.xterm-cursor-pointer,
.xterm .xterm-cursor-pointer {
	cursor: pointer!important;
}

.monaco-workbench .part.sidebar > .title > .title-actions .switch-terminal,
.monaco-pane-view .pane > .pane-header .monaco-action-bar .switch-terminal {
	border-width: 1px;
	border-style: solid;
}

.part.panel > .title > .title-actions .switch-terminal > .monaco-select-box {
	border-width: 1px;
	border-style: solid;
}

.monaco-workbench .part.sidebar > .title > .title-actions .switch-terminal {
	display: flex;
	align-items: center;
	font-size: 11px;
	margin-right: 0.3em;
	height: 20px;
	flex-shrink: 1;
	margin-top: 7px;
}

.monaco-workbench.mac .part.sidebar > .title > .title-actions .switch-terminal {
	border-radius: 4px;
}

.monaco-workbench .part.sidebar > .title > .title-actions .switch-terminal > .monaco-select-box {
	border: none !important;
	display: block !important;
	background-color: unset !important;
}

.monaco-pane-view .pane > .pane-header .monaco-action-bar .switch-terminal.action-item.select-container {
	border: none !important;
}

.monaco-workbench .part.sidebar > .title > .title-actions .switch-terminal > .monaco-select-box {
	padding: 0 22px 0 6px;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-container {
	height: 100%;
	display: flex;
	flex-direction: column;
}

.monaco-workbench .terminal-overflow-guard {
	overflow: hidden;
	position: relative;
	height: 100%;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-list-container {
	height: 100%;
	overflow: hidden;
	position: relative;
	display: flex;
	flex-direction: column;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-list-container > .tabs-list {
	flex: 1;
	min-height: 0;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-container > .monaco-toolbar {
	padding: 4px 0 2px;
	margin: auto;
}
.monaco-workbench .pane-body.integrated-terminal .terminal-tabs-entry.is-active::before {
	display: block;
	position: absolute;
	content: "";
	left: 0;
	top: 0;
	bottom: 0;
	width: 1px;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-container.has-text > .monaco-toolbar {
	padding: 4px 7px 2px;
	margin: 0;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-container.has-text > .monaco-toolbar {
	text-align: left;
}

.monaco-workbench .pane-body.integrated-terminal .terminal-tabs-chat-entry {
	flex-shrink: 0;
	height: 22px;
	line-height: 22px;
	display: flex;
	align-items: center;
	padding: 0;
	cursor: pointer;
	background-color: transparent;
	color: inherit;
}

.monaco-workbench .pane-body.integrated-terminal .terminal-tabs-chat-entry .terminal-tabs-entry {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4px;
	width: 100%;
	height: 100%;
	padding: 0;
	box-sizing: border-box;
	overflow: hidden;
}

.monaco-workbench .pane-body.integrated-terminal .terminal-tabs-chat-entry .terminal-tabs-entry:hover {
	background-color: var(--vscode-toolbar-hoverBackground);
}

.monaco-workbench .pane-body.integrated-terminal .tabs-list-container.drop-target {
	background-color: var(--vscode-list-dropBackground);
}

.monaco-workbench .pane-body.integrated-terminal .terminal-tabs-chat-entry .terminal-tabs-chat-entry-label {
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-container.has-text .terminal-tabs-chat-entry .terminal-tabs-entry {
	justify-content: center;
	padding: 0 10px;
}

.monaco-workbench .pane-body.integrated-terminal .terminal-tabs-chat-entry .terminal-tabs-chat-entry-label:empty {
	display: none;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-list .terminal-tabs-entry {
	text-align: center;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-container.has-text .tabs-list .terminal-tabs-entry {
	padding-left: 10px;
	padding-right: 10px;
	text-align: left;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-container.has-text .tabs-list .terminal-tabs-entry .monaco-icon-label::after {
	margin-right: 0;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-container:not(.has-text) .terminal-tabs-entry .codicon {
	/* Force inherit when no text is showing as the regular icon gets replaced by the status icon */
	color: inherit;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-container:not(.has-text) .monaco-icon-description-container {
	/* The description element doesn't go away once created sometimes so force hide */
	display: none;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-list .codicon {
	vertical-align: text-bottom;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-list .actions {
	display: none;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-list .editable-tab .monaco-icon-name-container {
	display: none;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-list .editable-tab .monaco-inputbox {
	min-width: 0;
	width: 100%;
	box-sizing: border-box;
	height: 22px;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-list .editable-tab .monaco-inputbox > .ibwrapper > .input {
	padding: 0 6px;
	height: 100%;
	line-height: 22px;
	box-sizing: border-box;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-list .actions .action-label {
	padding: 2px;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-list .monaco-list-row:hover .actions,
.monaco-workbench .pane-body.integrated-terminal .tabs-list:focus-within .monaco-list-row.selected .actions,
.monaco-workbench .pane-body.integrated-terminal .tabs-list:focus-within .monaco-list-row.focused .actions {
	display: block;
}

.monaco-action-bar .action-item .single-terminal-tab {
	display: flex !important;
	align-items: center;
}

.monaco-action-bar .action-item .single-terminal-tab .codicon:first-child {
	margin-right: 4px;
}

.monaco-action-bar .action-item .single-terminal-tab .codicon:nth-child(2) {
	margin-left: 4px;
	color: inherit;
}

.monaco-workbench .pane-body.integrated-terminal .tabs-container.has-text .tabs-list .terminal-tabs-entry .uri-icon {
	background-repeat: no-repeat;
	background-size: contain;
	margin-right: 4px;
	height: 100%;
}

.monaco-workbench .terminal-uri-icon .monaco-highlighted-label .codicon,
.monaco-action-bar .terminal-uri-icon.single-terminal-tab.action-label .codicon {
	background-size: 16px;
}
.monaco-workbench .terminal-uri-icon .monaco-highlighted-label .codicon::before,
.monaco-action-bar .terminal-uri-icon.single-terminal-tab.action-label:not(.alt-command) .codicon::before {
	content: '';
	display: inline-block;
	width: 16px;
	height: 16px;
}

.monaco-workbench .pane-body.integrated-terminal .terminal-drop-overlay {
	display: block;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	pointer-events: none;
	opacity: 0; /* hidden initially */
	z-index: 34;
}
.monaco-workbench.monaco-enable-motion .pane-body.integrated-terminal .terminal-drop-overlay {
	transition: left 70ms ease-out, right 70ms ease-out, top 70ms ease-out, bottom 70ms ease-out, opacity 150ms ease-out;
}
.monaco-workbench .pane-body.integrated-terminal .terminal-group > .monaco-split-view2.horizontal .terminal-drop-overlay.drop-before {
	right: 50%;
}
.monaco-workbench .pane-body.integrated-terminal .terminal-group > .monaco-split-view2.horizontal .terminal-drop-overlay.drop-after {
	left: 50%
}
.monaco-workbench .pane-body.integrated-terminal .terminal-group > .monaco-split-view2.vertical .terminal-drop-overlay.drop-before {
	bottom: 50%;
}
.monaco-workbench .pane-body.integrated-terminal .terminal-group > .monaco-split-view2.vertical .terminal-drop-overlay.drop-after {
	top: 50%;
}

.monaco-workbench .terminal .terminal-command-decoration:not(.default):hover {
	cursor: pointer;
}
.monaco-workbench .terminal .terminal-command-decoration:not(.default):hover::before {
	border-radius: 5px;
	background-color: var(--vscode-toolbar-hoverBackground);
}
.monaco-workbench .terminal .terminal-command-decoration {
	color: var(--vscode-terminalCommandDecoration-successBackground);
}
.monaco-workbench .terminal .terminal-command-decoration.error {
	color: var(--vscode-terminalCommandDecoration-errorBackground);
}
.monaco-workbench .terminal .terminal-command-decoration.default {
	pointer-events: none;
	color: var(--vscode-terminalCommandDecoration-defaultBackground);
}

.terminal-scroll-highlight {
	left: 0;
	right: 0;
	border-left: 5px solid #ffffff;
	border-left-width: 5px !important;
	pointer-events: none;
}

.terminal-range-highlight {
	outline: 1px solid var(--vscode-focusBorder);
	pointer-events: none;
}

.terminal-command-guide {
	left: 0;
	border: 1.5px solid #ffffff;
	width: 0px !important;
	border-color: var(--vscode-terminalCommandGuide-foreground);
	box-sizing: border-box;
	transform: translateX(3px);
	pointer-events: none;
}
.terminal-command-guide.top {
	border-top-left-radius: 1px;
	border-top-right-radius: 1px;
}
.terminal-command-guide.bottom {
	border-bottom-left-radius: 1px;
	border-bottom-right-radius: 1px;
}

.terminal-scroll-highlight-outline {
	border-left: 1px solid #ffffff;
	border-right: 1px solid #ffffff;
	pointer-events: none;
}
.terminal-scroll-highlight-outline.top {
	border-top: 1px solid #ffffff;
}
.terminal-scroll-highlight-outline.bottom {
	border-bottom: 1px solid #ffffff;
}

.terminal-scroll-highlight,
.terminal-scroll-highlight.terminal-scroll-highlight-outline {
	border-color: var(--vscode-focusBorder);
}

.monaco-workbench.hc-black .editor-instance .xterm.focus::before,
.monaco-workbench.hc-black .pane-body.integrated-terminal .xterm.focus::before,
.monaco-workbench.hc-black .editor-instance .xterm:focus::before,
.monaco-workbench.hc-black .pane-body.integrated-terminal .xterm:focus::before,
.monaco-workbench.hc-light .editor-instance .xterm.focus::before,
.monaco-workbench.hc-light .pane-body.integrated-terminal .xterm.focus::before,
.monaco-workbench.hc-light .editor-instance .xterm:focus::before,
.monaco-workbench.hc-light .pane-body.integrated-terminal .xterm:focus::before {
	border-color: var(--vscode-contrastActiveBorder);
}

.monaco-workbench .integrated-terminal .hoverHighlight {
	background-color: var(--vscode-terminal-hoverHighlightBackground);
}

.monaco-workbench .xterm.terminal.hide {
	visibility: hidden;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/media/terminalVoice.css]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/media/terminalVoice.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.terminal-voice {
	background-color: var(--vscode-terminal-background, var(--vscode-panel-background));
	padding: 2px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	white-space: nowrap;
	z-index: 1000;
}

.terminal-voice.codicon.codicon-mic-filled {
	display: flex;
	align-items: center;
	width: 16px;
	height: 16px;
}

.terminal-voice.recording.codicon.codicon-mic-filled {
	color: var(--vscode-activityBarBadge-background);
	animation: ani-terminal-speech 1s infinite;
}

@keyframes ani-terminal-speech {
	0% {
		color: var(--vscode-terminalCursor-background);
	}

	50% {
		color: var(--vscode-activityBarBadge-background);
	}

	100% {
		color: var(--vscode-terminalCursor-background);
	}
}

.terminal-voice-progress-text {
	font-style: italic;
	color: var(--vscode-editorGhostText-foreground) !important;
	border: 1px solid var(--vscode-editorGhostText-border);
	z-index: 1000;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/media/widgets.css]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/media/widgets.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .terminal-widget-container {
	position: absolute;
	left: 0;
	bottom: 0;
	right: 0;
	top: 0;
	overflow: visible;
}

.monaco-workbench .terminal-overlay-widget {
	position: absolute;
	left: 0;
	bottom: 0;
	color: #3794ff;
}

.monaco-workbench .terminal-hover-target {
	position: absolute;
	z-index: 33;
}

.monaco-workbench .terminal-env-var-info {
	position: absolute;
	right: 10px; /* room for scroll bar */
	top: 0;
	width: 28px;
	height: 28px;
	text-align: center;
	z-index: 32;
	opacity: 0.5;
}

.monaco-workbench .terminal-env-var-info:hover,
.monaco-workbench .terminal-env-var-info.requires-action {
	opacity: 1;
}

.monaco-workbench .terminal-env-var-info.codicon {
	line-height: 28px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/media/xterm.css]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/media/xterm.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 * Copyright (c) 2014 The xterm.js authors. All rights reserved.
 * Copyright (c) 2012-2013, Christopher Jeffrey (MIT License)
 * https://github.com/chjj/term.js
 * @license MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Originally forked from (with the author's permission):
 *   Fabrice Bellard's javascript vt100 for jslinux:
 *   http://bellard.org/jslinux/
 *   Copyright (c) 2011 Fabrice Bellard
 *   The original design remains. The terminal itself
 *   has been extended to include xterm CSI codes, among
 *   other features.
 */

/**
 *  Default styles for xterm.js
 */

.xterm {
	cursor: text;
	position: relative;
	user-select: none;
	-ms-user-select: none;
	-webkit-user-select: none;
}

.xterm.focus,
.xterm:focus {
	outline: none;
}

.xterm .xterm-helpers {
	position: absolute;
	top: 0;
	/**
	 * The z-index of the helpers must be higher than the canvases in order for
	 * IMEs to appear on top.
	 */
	z-index: 5;
}

.xterm .xterm-helper-textarea {
	padding: 0;
	border: 0;
	margin: 0;
	/* Move textarea out of the screen to the far left, so that the cursor is not visible */
	position: absolute;
	opacity: 0;
	left: -9999em;
	top: 0;
	width: 0;
	height: 0;
	z-index: -5;
	/** Prevent wrapping so the IME appears against the textarea at the correct position */
	white-space: nowrap;
	overflow: hidden;
	resize: none;
}

.xterm .composition-view {
	/* TODO: Composition position got messed up somewhere */
	background: #000;
	color: #FFF;
	display: none;
	position: absolute;
	white-space: nowrap;
	z-index: 1;
}

.xterm .composition-view.active {
	display: block;
}

.xterm .xterm-viewport {
	position: absolute;
	right: 0;
	left: 0;
	top: 0;
	bottom: 0;
}

.xterm .xterm-screen {
	position: relative;
}

.xterm .xterm-screen canvas {
	position: absolute;
	left: 0;
	top: 0;
}

.xterm-char-measure-element {
	display: inline-block;
	visibility: hidden;
	position: absolute;
	top: 0;
	left: -9999em;
	line-height: normal;
}

.xterm.enable-mouse-events {
	/* When mouse events are enabled (eg. tmux), revert to the standard pointer cursor */
	cursor: default;
}

.xterm.xterm-cursor-pointer,
.xterm .xterm-cursor-pointer {
	cursor: pointer;
}

.xterm.column-select.focus {
	/* Column selection mode */
	cursor: crosshair;
}

.xterm .xterm-accessibility:not(.debug),
.xterm .xterm-message {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	z-index: 10;
	color: transparent;
	pointer-events: none;
}

.xterm .xterm-accessibility-tree:not(.debug) *::selection {
	color: transparent;
}

.xterm .xterm-accessibility-tree {
	font-family: monospace;
	user-select: text;
	white-space: pre;
}

.xterm .xterm-accessibility-tree > div {
	transform-origin: left;
	width: fit-content;
}

.xterm .live-region {
	position: absolute;
	left: -9999px;
	width: 1px;
	height: 1px;
	overflow: hidden;
}

.xterm-dim {
	/* Dim should not apply to background, so the opacity of the foreground color is applied
	 * explicitly in the generated class and reset to 1 here */
	opacity: 1 !important;
}

.xterm-underline-1 {
	text-decoration: underline;
}

.xterm-underline-2 {
	text-decoration: double underline;
}

.xterm-underline-3 {
	text-decoration: wavy underline;
}

.xterm-underline-4 {
	text-decoration: dotted underline;
}

.xterm-underline-5 {
	text-decoration: dashed underline;
}

.xterm-overline {
	text-decoration: overline;
}

.xterm-overline.xterm-underline-1 {
	text-decoration: overline underline;
}

.xterm-overline.xterm-underline-2 {
	text-decoration: overline double underline;
}

.xterm-overline.xterm-underline-3 {
	text-decoration: overline wavy underline;
}

.xterm-overline.xterm-underline-4 {
	text-decoration: overline dotted underline;
}

.xterm-overline.xterm-underline-5 {
	text-decoration: overline dashed underline;
}

.xterm-strikethrough {
	text-decoration: line-through;
}

.xterm-screen .xterm-decoration-container .xterm-decoration {
	z-index: 6;
	position: absolute;
}

.xterm-screen .xterm-decoration-container .xterm-decoration.xterm-decoration-top-layer {
	z-index: 7;
}

.xterm-decoration-overview-ruler {
	z-index: 8;
	position: absolute;
	top: 0;
	right: 0;
	pointer-events: none;
}

.xterm-decoration-top {
	z-index: 2;
	position: relative;
}



/* Derived from vs/base/browser/ui/scrollbar/media/scrollbar.css */

/* xterm.js customization: Override xterm's cursor style */
.xterm .xterm-scrollable-element > .scrollbar {
	cursor: default;
}

/* Arrows */
.xterm .xterm-scrollable-element > .scrollbar > .scra {
	cursor: pointer;
	font-size: 11px !important;
}

.xterm .xterm-scrollable-element > .visible {
	opacity: 1;

	/* Background rule added for IE9 - to allow clicks on dom node */
	background: rgba(0, 0, 0, 0);

	transition: opacity 100ms linear;
	/* In front of peek view */
	z-index: 11;
}

.xterm .xterm-scrollable-element > .invisible {
	opacity: 0;
	pointer-events: none;
}

.xterm .xterm-scrollable-element > .invisible.fade {
	transition: opacity 800ms linear;
}

/* Scrollable Content Inset Shadow */
.xterm .xterm-scrollable-element > .shadow {
	position: absolute;
	display: none;
}

.xterm .xterm-scrollable-element > .shadow.top {
	display: block;
	top: 0;
	left: 3px;
	height: 3px;
	width: 100%;
	box-shadow: var(--vscode-scrollbar-shadow, #000) 0 6px 6px -6px inset;
}

.xterm .xterm-scrollable-element > .shadow.left {
	display: block;
	top: 3px;
	left: 0;
	height: 100%;
	width: 3px;
	box-shadow: var(--vscode-scrollbar-shadow, #000) 6px 0 6px -6px inset;
}

.xterm .xterm-scrollable-element > .shadow.top-left-corner {
	display: block;
	top: 0;
	left: 0;
	height: 3px;
	width: 3px;
}

.xterm .xterm-scrollable-element > .shadow.top.left {
	box-shadow: var(--vscode-scrollbar-shadow, #000) 6px 0 6px -6px inset;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/widgets/terminalHoverWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/widgets/terminalHoverWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { IMarkdownString } from '../../../../../base/common/htmlContent.js';
import { Widget } from '../../../../../base/browser/ui/widget.js';
import { ITerminalWidget } from './widgets.js';
import * as dom from '../../../../../base/browser/dom.js';
import type { IViewportRange } from '@xterm/xterm';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TerminalSettingId } from '../../../../../platform/terminal/common/terminal.js';
import type { IHoverAction, IHoverTarget } from '../../../../../base/browser/ui/hover/hover.js';

const $ = dom.$;

export interface ILinkHoverTargetOptions {
	readonly viewportRange: IViewportRange;
	readonly cellDimensions: { width: number; height: number };
	readonly terminalDimensions: { width: number; height: number };
	readonly modifierDownCallback?: () => void;
	readonly modifierUpCallback?: () => void;
}

export class TerminalHover extends Disposable implements ITerminalWidget {
	readonly id = 'hover';

	constructor(
		private readonly _targetOptions: ILinkHoverTargetOptions,
		private readonly _text: IMarkdownString,
		private readonly _actions: IHoverAction[] | undefined,
		private readonly _linkHandler: (url: string) => unknown,
		@IHoverService private readonly _hoverService: IHoverService,
		@IConfigurationService private readonly _configurationService: IConfigurationService
	) {
		super();
	}

	attach(container: HTMLElement): void {
		const showLinkHover = this._configurationService.getValue(TerminalSettingId.ShowLinkHover);
		if (!showLinkHover) {
			return;
		}
		const target = new CellHoverTarget(container, this._targetOptions);
		const hover = this._hoverService.showInstantHover({
			target,
			content: this._text,
			actions: this._actions,
			linkHandler: this._linkHandler,
			// .xterm-hover lets xterm know that the hover is part of a link
			additionalClasses: ['xterm-hover']
		});
		if (hover) {
			this._register(hover);
		}
	}
}

class CellHoverTarget extends Widget implements IHoverTarget {
	private _domNode: HTMLElement;
	private readonly _targetElements: HTMLElement[] = [];

	get targetElements(): readonly HTMLElement[] { return this._targetElements; }

	constructor(
		container: HTMLElement,
		private readonly _options: ILinkHoverTargetOptions
	) {
		super();

		this._domNode = $('div.terminal-hover-targets.xterm-hover');
		const rowCount = this._options.viewportRange.end.y - this._options.viewportRange.start.y + 1;

		// Add top target row
		const width = (this._options.viewportRange.end.y > this._options.viewportRange.start.y ? this._options.terminalDimensions.width - this._options.viewportRange.start.x : this._options.viewportRange.end.x - this._options.viewportRange.start.x + 1) * this._options.cellDimensions.width;
		const topTarget = $('div.terminal-hover-target.hoverHighlight');
		topTarget.style.left = `${this._options.viewportRange.start.x * this._options.cellDimensions.width}px`;
		topTarget.style.bottom = `${(this._options.terminalDimensions.height - this._options.viewportRange.start.y - 1) * this._options.cellDimensions.height}px`;
		topTarget.style.width = `${width}px`;
		topTarget.style.height = `${this._options.cellDimensions.height}px`;
		this._targetElements.push(this._domNode.appendChild(topTarget));

		// Add middle target rows
		if (rowCount > 2) {
			const middleTarget = $('div.terminal-hover-target.hoverHighlight');
			middleTarget.style.left = `0px`;
			middleTarget.style.bottom = `${(this._options.terminalDimensions.height - this._options.viewportRange.start.y - 1 - (rowCount - 2)) * this._options.cellDimensions.height}px`;
			middleTarget.style.width = `${this._options.terminalDimensions.width * this._options.cellDimensions.width}px`;
			middleTarget.style.height = `${(rowCount - 2) * this._options.cellDimensions.height}px`;
			this._targetElements.push(this._domNode.appendChild(middleTarget));
		}

		// Add bottom target row
		if (rowCount > 1) {
			const bottomTarget = $('div.terminal-hover-target.hoverHighlight');
			bottomTarget.style.left = `0px`;
			bottomTarget.style.bottom = `${(this._options.terminalDimensions.height - this._options.viewportRange.end.y - 1) * this._options.cellDimensions.height}px`;
			bottomTarget.style.width = `${(this._options.viewportRange.end.x + 1) * this._options.cellDimensions.width}px`;
			bottomTarget.style.height = `${this._options.cellDimensions.height}px`;
			this._targetElements.push(this._domNode.appendChild(bottomTarget));
		}

		if (this._options.modifierDownCallback && this._options.modifierUpCallback) {
			let down = false;
			this._register(dom.addDisposableListener(container.ownerDocument, 'keydown', e => {
				if (e.ctrlKey && !down) {
					down = true;
					this._options.modifierDownCallback!();
				}
			}));
			this._register(dom.addDisposableListener(container.ownerDocument, 'keyup', e => {
				if (!e.ctrlKey) {
					down = false;
					this._options.modifierUpCallback!();
				}
			}));
		}

		container.appendChild(this._domNode);
		this._register(toDisposable(() => this._domNode?.remove()));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/widgets/widgetManager.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/widgets/widgetManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { ITerminalWidget } from './widgets.js';

export class TerminalWidgetManager implements IDisposable {
	private _container: HTMLElement | undefined;
	private _attached: Map<string, ITerminalWidget> = new Map();

	attachToElement(terminalWrapper: HTMLElement) {
		if (!this._container) {
			this._container = document.createElement('div');
			this._container.classList.add('terminal-widget-container');
			terminalWrapper.appendChild(this._container);
		}
	}

	dispose(): void {
		if (this._container) {
			this._container.remove();
			this._container = undefined;
		}
		this._attached.forEach(w => w.dispose());
		this._attached.clear();
	}

	attachWidget(widget: ITerminalWidget): IDisposable | undefined {
		if (!this._container) {
			return;
		}
		this._attached.get(widget.id)?.dispose();
		widget.attach(this._container);
		this._attached.set(widget.id, widget);
		return {
			dispose: () => {
				const current = this._attached.get(widget.id);
				if (current === widget) {
					this._attached.delete(widget.id);
					widget.dispose();
				}
			}
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/widgets/widgets.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/widgets/widgets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../../base/common/lifecycle.js';

export interface ITerminalWidget extends IDisposable {
	/**
	 * Only one widget of each ID can be displayed at once.
	 */
	id: string;
	attach(container: HTMLElement): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/xterm/decorationAddon.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/xterm/decorationAddon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IDecoration, ITerminalAddon, Terminal } from '@xterm/xterm';
import * as dom from '../../../../../base/browser/dom.js';
import { IAction, Separator } from '../../../../../base/common/actions.js';
import { Emitter } from '../../../../../base/common/event.js';
import { Disposable, DisposableMap, DisposableStore, IDisposable, dispose, toDisposable } from '../../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { localize } from '../../../../../nls.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { INotificationService, Severity } from '../../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { IQuickInputService, IQuickPickItem } from '../../../../../platform/quickinput/common/quickInput.js';
import { CommandInvalidationReason, ICommandDetectionCapability, IMarkProperties, ITerminalCapabilityStore, ITerminalCommand, TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { TerminalSettingId, type IDecorationAddon } from '../../../../../platform/terminal/common/terminal.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { terminalDecorationMark } from '../terminalIcons.js';
import { DecorationSelector, getTerminalCommandDecorationState, getTerminalDecorationHoverContent, updateLayout } from './decorationStyles.js';
import { TERMINAL_COMMAND_DECORATION_DEFAULT_BACKGROUND_COLOR, TERMINAL_COMMAND_DECORATION_ERROR_BACKGROUND_COLOR, TERMINAL_COMMAND_DECORATION_SUCCESS_BACKGROUND_COLOR } from '../../common/terminalColorRegistry.js';
import { ILifecycleService } from '../../../../services/lifecycle/common/lifecycle.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { IChatContextPickService } from '../../../chat/browser/chatContextPickService.js';
import { IChatWidgetService } from '../../../chat/browser/chat.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { TerminalContext } from '../../../chat/browser/actions/chatContext.js';
import { getTerminalUri, parseTerminalUri } from '../terminalUri.js';
import { URI } from '../../../../../base/common/uri.js';
import { ChatAgentLocation } from '../../../chat/common/constants.js';
import { isString } from '../../../../../base/common/types.js';

interface IDisposableDecoration { decoration: IDecoration; disposables: IDisposable[]; command?: ITerminalCommand; markProperties?: IMarkProperties }

export class DecorationAddon extends Disposable implements ITerminalAddon, IDecorationAddon {
	protected _terminal: Terminal | undefined;
	private _capabilityDisposables: DisposableMap<TerminalCapability> = this._register(new DisposableMap());
	private _decorations: Map<number, IDisposableDecoration> = new Map();
	private _placeholderDecoration: IDecoration | undefined;
	private _showGutterDecorations?: boolean;
	private _showOverviewRulerDecorations?: boolean;
	private readonly _registeredMenuItems: Map<ITerminalCommand, IAction[]> = new Map();

	private readonly _onDidRequestRunCommand = this._register(new Emitter<{ command: ITerminalCommand; noNewLine?: boolean }>());
	readonly onDidRequestRunCommand = this._onDidRequestRunCommand.event;
	private readonly _onDidRequestCopyAsHtml = this._register(new Emitter<{ command: ITerminalCommand }>());
	readonly onDidRequestCopyAsHtml = this._onDidRequestCopyAsHtml.event;

	constructor(
		private readonly _resource: URI | undefined,
		private readonly _capabilities: ITerminalCapabilityStore,
		@IClipboardService private readonly _clipboardService: IClipboardService,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IThemeService private readonly _themeService: IThemeService,
		@IOpenerService private readonly _openerService: IOpenerService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@ICommandService private readonly _commandService: ICommandService,
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IHoverService private readonly _hoverService: IHoverService,
		@IChatContextPickService private readonly _contextPickService: IChatContextPickService,
		@IChatWidgetService private readonly _chatWidgetService: IChatWidgetService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) {
		super();
		this._register(toDisposable(() => this._dispose()));
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TerminalSettingId.FontSize) || e.affectsConfiguration(TerminalSettingId.LineHeight)) {
				this.refreshLayouts();
			} else if (e.affectsConfiguration('workbench.colorCustomizations')) {
				this._refreshStyles(true);
			} else if (e.affectsConfiguration(TerminalSettingId.ShellIntegrationDecorationsEnabled)) {
				this._removeCapabilityDisposables(TerminalCapability.CommandDetection);
				this._updateDecorationVisibility();
			}
		}));
		this._register(this._themeService.onDidColorThemeChange(() => this._refreshStyles(true)));
		this._updateDecorationVisibility();
		this._register(this._capabilities.onDidAddCapability(c => this._createCapabilityDisposables(c.id)));
		this._register(this._capabilities.onDidRemoveCapability(c => this._removeCapabilityDisposables(c.id)));
		this._register(lifecycleService.onWillShutdown(() => this._disposeAllDecorations()));
	}

	private _createCapabilityDisposables(c: TerminalCapability): void {
		const capability = this._capabilities.get(c);
		if (!capability || this._capabilityDisposables.has(c)) {
			return;
		}
		const store = new DisposableStore();
		switch (capability.type) {
			case TerminalCapability.BufferMarkDetection:
				store.add(capability.onMarkAdded(mark => this.registerMarkDecoration(mark)));
				break;
			case TerminalCapability.CommandDetection: {
				const disposables = this._getCommandDetectionListeners(capability);
				for (const d of disposables) {
					store.add(d);
				}
				break;
			}
		}
		this._capabilityDisposables.set(c, store);
	}

	private _removeCapabilityDisposables(c: TerminalCapability): void {
		this._capabilityDisposables.deleteAndDispose(c);
	}

	registerMarkDecoration(mark: IMarkProperties): IDecoration | undefined {
		if (!this._terminal || (!this._showGutterDecorations && !this._showOverviewRulerDecorations)) {
			return undefined;
		}
		if (mark.hidden) {
			return undefined;
		}
		return this.registerCommandDecoration(undefined, undefined, mark);
	}

	private _updateDecorationVisibility(): void {
		const showDecorations = this._configurationService.getValue(TerminalSettingId.ShellIntegrationDecorationsEnabled);
		this._showGutterDecorations = (showDecorations === 'both' || showDecorations === 'gutter');
		this._showOverviewRulerDecorations = (showDecorations === 'both' || showDecorations === 'overviewRuler');
		this._disposeAllDecorations();
		if (this._showGutterDecorations || this._showOverviewRulerDecorations) {
			this._attachToCommandCapability();
			this._updateGutterDecorationVisibility();
		}
		const currentCommand = this._capabilities.get(TerminalCapability.CommandDetection)?.executingCommandObject;
		if (currentCommand) {
			this.registerCommandDecoration(currentCommand, true);
		}
	}

	private _disposeAllDecorations(): void {
		this._placeholderDecoration?.dispose();
		for (const value of this._decorations.values()) {
			value.decoration.dispose();
			dispose(value.disposables);
		}
	}

	private _updateGutterDecorationVisibility(): void {
		// eslint-disable-next-line no-restricted-syntax
		const commandDecorationElements = this._terminal?.element?.querySelectorAll(DecorationSelector.CommandDecoration);
		if (commandDecorationElements) {
			for (const commandDecorationElement of commandDecorationElements) {
				this._updateCommandDecorationVisibility(commandDecorationElement);
			}
		}
	}

	private _updateCommandDecorationVisibility(commandDecorationElement: Element): void {
		if (this._showGutterDecorations) {
			commandDecorationElement.classList.remove(DecorationSelector.Hide);
		} else {
			commandDecorationElement.classList.add(DecorationSelector.Hide);
		}
	}

	public refreshLayouts(): void {
		updateLayout(this._configurationService, this._placeholderDecoration?.element);
		for (const decoration of this._decorations) {
			updateLayout(this._configurationService, decoration[1].decoration.element);
		}
	}

	private _refreshStyles(refreshOverviewRulerColors?: boolean): void {
		if (refreshOverviewRulerColors) {
			for (const decoration of this._decorations.values()) {
				const color = this._getDecorationCssColor(decoration.command)?.toString() ?? '';
				if (decoration.decoration.options?.overviewRulerOptions) {
					decoration.decoration.options.overviewRulerOptions.color = color;
				} else if (decoration.decoration.options) {
					decoration.decoration.options.overviewRulerOptions = { color };
				}
			}
		}
		this._updateClasses(this._placeholderDecoration?.element);
		for (const decoration of this._decorations.values()) {
			this._updateClasses(decoration.decoration.element, decoration.command, decoration.markProperties);
		}
	}

	private _dispose(): void {
		for (const disposable of this._capabilityDisposables.values()) {
			dispose(disposable);
		}
		this.clearDecorations();
	}

	private _clearPlaceholder(): void {
		this._placeholderDecoration?.dispose();
		this._placeholderDecoration = undefined;
	}

	public clearDecorations(): void {
		this._placeholderDecoration?.marker.dispose();
		this._clearPlaceholder();
		this._disposeAllDecorations();
		this._decorations.clear();
	}

	private _attachToCommandCapability(): void {
		if (this._capabilities.has(TerminalCapability.CommandDetection)) {
			const capability = this._capabilities.get(TerminalCapability.CommandDetection)!;
			const disposables = this._getCommandDetectionListeners(capability);
			const store = new DisposableStore();
			for (const d of disposables) {
				store.add(d);
			}
			this._capabilityDisposables.set(TerminalCapability.CommandDetection, store);
		}
	}

	private _getCommandDetectionListeners(capability: ICommandDetectionCapability): IDisposable[] {
		this._removeCapabilityDisposables(TerminalCapability.CommandDetection);

		const commandDetectionListeners = [];
		// Command started
		if (capability.executingCommandObject?.marker) {
			this.registerCommandDecoration(capability.executingCommandObject, true);
		}
		commandDetectionListeners.push(capability.onCommandStarted(command => this.registerCommandDecoration(command, true)));
		// Command finished
		for (const command of capability.commands) {
			this.registerCommandDecoration(command);
		}
		commandDetectionListeners.push(capability.onCommandFinished(command => {
			const buffer = this._terminal?.buffer?.active;
			const marker = command.promptStartMarker;

			// Edge case: Handle case where tsc watch commands clears buffer, but decoration of that tsc command re-appears
			const shouldRegisterDecoration = (
				command.exitCode === undefined ||
				// Only register decoration if the cursor is at or below the promptStart marker.
				(buffer && marker && buffer.baseY + buffer.cursorY >= marker.line)
			);

			if (shouldRegisterDecoration) {
				this.registerCommandDecoration(command);
			}

			if (command.exitCode) {
				this._accessibilitySignalService.playSignal(AccessibilitySignal.terminalCommandFailed);
			} else {
				this._accessibilitySignalService.playSignal(AccessibilitySignal.terminalCommandSucceeded);
			}
		}));
		// Command invalidated
		commandDetectionListeners.push(capability.onCommandInvalidated(commands => {
			for (const command of commands) {
				const id = command.marker?.id;
				if (id) {
					const match = this._decorations.get(id);
					if (match) {
						match.decoration.dispose();
						dispose(match.disposables);
					}
				}
			}
		}));
		// Current command invalidated
		commandDetectionListeners.push(capability.onCurrentCommandInvalidated((request) => {
			if (request.reason === CommandInvalidationReason.NoProblemsReported) {
				const lastDecoration = Array.from(this._decorations.entries())[this._decorations.size - 1];
				lastDecoration?.[1].decoration.dispose();
			} else if (request.reason === CommandInvalidationReason.Windows) {
				this._clearPlaceholder();
			}
		}));
		return commandDetectionListeners;
	}

	activate(terminal: Terminal): void {
		this._terminal = terminal;
		this._attachToCommandCapability();
	}

	registerCommandDecoration(command?: ITerminalCommand, beforeCommandExecution?: boolean, markProperties?: IMarkProperties): IDecoration | undefined {
		if (!this._terminal || (beforeCommandExecution && !command) || (!this._showGutterDecorations && !this._showOverviewRulerDecorations)) {
			return undefined;
		}
		const marker = command?.marker || markProperties?.marker;
		if (!marker) {
			throw new Error(`cannot add a decoration for a command ${JSON.stringify(command)} with no marker`);
		}
		this._clearPlaceholder();
		const color = this._getDecorationCssColor(command)?.toString() ?? '';
		const decoration = this._terminal.registerDecoration({
			marker,
			overviewRulerOptions: this._showOverviewRulerDecorations ? (beforeCommandExecution
				? { color, position: 'left' }
				: { color, position: command?.exitCode ? 'right' : 'left' }) : undefined
		});
		if (!decoration) {
			return undefined;
		}
		if (beforeCommandExecution) {
			this._placeholderDecoration = decoration;
		}
		decoration.onRender(element => {
			if (element.classList.contains(DecorationSelector.OverviewRuler)) {
				return;
			}
			if (!this._decorations.get(decoration.marker.id)) {
				decoration.onDispose(() => this._decorations.delete(decoration.marker.id));
				this._decorations.set(decoration.marker.id,
					{
						decoration,
						disposables: this._createDisposables(element, command, markProperties),
						command,
						markProperties: command?.markProperties || markProperties
					});
			}
			if (!element.classList.contains(DecorationSelector.Codicon) || command?.marker?.line === 0) {
				// first render or buffer was cleared
				updateLayout(this._configurationService, element);
				this._updateClasses(element, command, command?.markProperties || markProperties);
			}
		});
		return decoration;
	}

	registerMenuItems(command: ITerminalCommand, items: IAction[]): IDisposable {
		const existingItems = this._registeredMenuItems.get(command);
		if (existingItems) {
			existingItems.push(...items);
		} else {
			this._registeredMenuItems.set(command, [...items]);
		}
		return toDisposable(() => {
			const commandItems = this._registeredMenuItems.get(command);
			if (commandItems) {
				for (const item of items.values()) {
					const index = commandItems.indexOf(item);
					if (index !== -1) {
						commandItems.splice(index, 1);
					}
				}
			}
		});
	}

	private _createDisposables(element: HTMLElement, command?: ITerminalCommand, markProperties?: IMarkProperties): IDisposable[] {
		if (command?.exitCode === undefined && !command?.markProperties) {
			return [];
		} else if (command?.markProperties || markProperties) {
			return [this._createHover(element, command || markProperties, markProperties?.hoverMessage)];
		}
		return [...this._createContextMenu(element, command), this._createHover(element, command)];
	}

	private _createHover(element: HTMLElement, command: ITerminalCommand | undefined, hoverMessage?: string) {
		return this._hoverService.setupDelayedHover(element, () => ({
			content: new MarkdownString(getTerminalDecorationHoverContent(command, hoverMessage, true))
		}));
	}

	private _updateClasses(element?: HTMLElement, command?: ITerminalCommand, markProperties?: IMarkProperties): void {
		if (!element) {
			return;
		}
		for (const classes of element.classList) {
			element.classList.remove(classes);
		}
		element.classList.add(DecorationSelector.CommandDecoration, DecorationSelector.Codicon, DecorationSelector.XtermDecoration);

		if (markProperties) {
			element.classList.add(DecorationSelector.DefaultColor, ...ThemeIcon.asClassNameArray(terminalDecorationMark));
			if (!markProperties.hoverMessage) {
				//disable the mouse pointer
				element.classList.add(DecorationSelector.Default);
			}
		} else {
			// command decoration
			const state = getTerminalCommandDecorationState(command);
			this._updateCommandDecorationVisibility(element);
			for (const className of state.classNames) {
				element.classList.add(className);
			}
			element.classList.add(...ThemeIcon.asClassNameArray(state.icon));
		}
		element.removeAttribute('title');
		element.removeAttribute('aria-label');
	}

	private _createContextMenu(element: HTMLElement, command: ITerminalCommand): IDisposable[] {
		// When the xterm Decoration gets disposed of, its element gets removed from the dom
		// along with its listeners
		return [
			dom.addDisposableListener(element, dom.EventType.MOUSE_DOWN, async (e) => {
				e.stopImmediatePropagation();
			}),
			dom.addDisposableListener(element, dom.EventType.CLICK, async (e) => {
				e.stopImmediatePropagation();
				const actions = await this._getCommandActions(command);
				this._contextMenuService.showContextMenu({ getAnchor: () => element, getActions: () => actions });
			}),
			dom.addDisposableListener(element, dom.EventType.CONTEXT_MENU, async (e) => {
				e.stopImmediatePropagation();
				const chatActions = await this._getCommandActions(command);
				const actions = this._getContextMenuActions();
				this._contextMenuService.showContextMenu({ getAnchor: () => element, getActions: () => [...actions, ...chatActions] });
			}),
		];
	}
	private _getContextMenuActions(): IAction[] {
		const label = localize('workbench.action.terminal.toggleVisibility', "Toggle Visibility");
		return [
			{
				class: undefined, tooltip: label, id: 'terminal.toggleVisibility', label, enabled: true,
				run: async () => {
					this._showToggleVisibilityQuickPick();
				}
			}
		];
	}

	private async _getCommandActions(command: ITerminalCommand): Promise<IAction[]> {

		const actions: IAction[] = [];
		const registeredMenuItems = this._registeredMenuItems.get(command);
		if (registeredMenuItems?.length) {
			actions.push(...registeredMenuItems, new Separator());
		}

		const attachToChatAction = this._createAttachToChatAction(command);
		if (attachToChatAction) {
			actions.push(attachToChatAction, new Separator());
		}

		if (command.command !== '') {
			const labelRun = localize("terminal.rerunCommand", 'Rerun Command');
			actions.push({
				class: undefined, tooltip: labelRun, id: 'terminal.rerunCommand', label: labelRun, enabled: true,
				run: async () => {
					if (command.command === '') {
						return;
					}
					if (!command.isTrusted) {
						const shouldRun = await new Promise<boolean>(r => {
							this._notificationService.prompt(Severity.Info, localize('rerun', 'Do you want to run the command: {0}', command.command), [{
								label: localize('yes', 'Yes'),
								run: () => r(true)
							}, {
								label: localize('no', 'No'),
								run: () => r(false)
							}]);
						});
						if (!shouldRun) {
							return;
						}
					}
					this._onDidRequestRunCommand.fire({ command });
				}
			});
			// The second section is the clipboard section
			actions.push(new Separator());
			const labelCopy = localize("terminal.copyCommand", 'Copy Command');
			actions.push({
				class: undefined, tooltip: labelCopy, id: 'terminal.copyCommand', label: labelCopy, enabled: true,
				run: () => this._clipboardService.writeText(command.command)
			});
		}
		if (command.hasOutput()) {
			const labelCopyCommandAndOutput = localize("terminal.copyCommandAndOutput", 'Copy Command and Output');
			actions.push({
				class: undefined, tooltip: labelCopyCommandAndOutput, id: 'terminal.copyCommandAndOutput', label: labelCopyCommandAndOutput, enabled: true,
				run: () => {
					const output = command.getOutput();
					if (isString(output)) {
						this._clipboardService.writeText(`${command.command !== '' ? command.command + '\n' : ''}${output}`);
					}
				}
			});
			const labelText = localize("terminal.copyOutput", 'Copy Output');
			actions.push({
				class: undefined, tooltip: labelText, id: 'terminal.copyOutput', label: labelText, enabled: true,
				run: () => {
					const text = command.getOutput();
					if (isString(text)) {
						this._clipboardService.writeText(text);
					}
				}
			});
			const labelHtml = localize("terminal.copyOutputAsHtml", 'Copy Output as HTML');
			actions.push({
				class: undefined, tooltip: labelHtml, id: 'terminal.copyOutputAsHtml', label: labelHtml, enabled: true,
				run: () => this._onDidRequestCopyAsHtml.fire({ command })
			});
		}
		if (actions.length > 0) {
			actions.push(new Separator());
		}
		const labelRunRecent = localize('workbench.action.terminal.runRecentCommand', "Run Recent Command");
		actions.push({
			class: undefined, tooltip: labelRunRecent, id: 'workbench.action.terminal.runRecentCommand', label: labelRunRecent, enabled: true,
			run: () => this._commandService.executeCommand('workbench.action.terminal.runRecentCommand')
		});
		const labelGoToRecent = localize('workbench.action.terminal.goToRecentDirectory', "Go To Recent Directory");
		actions.push({
			class: undefined, tooltip: labelRunRecent, id: 'workbench.action.terminal.goToRecentDirectory', label: labelGoToRecent, enabled: true,
			run: () => this._commandService.executeCommand('workbench.action.terminal.goToRecentDirectory')
		});

		actions.push(new Separator());

		const labelAbout = localize("terminal.learnShellIntegration", 'Learn About Shell Integration');
		actions.push({
			class: undefined, tooltip: labelAbout, id: 'terminal.learnShellIntegration', label: labelAbout, enabled: true,
			run: () => this._openerService.open('https://code.visualstudio.com/docs/terminal/shell-integration')
		});
		return actions;
	}

	private _createAttachToChatAction(command: ITerminalCommand): IAction | undefined {
		const chatIsEnabled = this._chatWidgetService.getWidgetsByLocations(ChatAgentLocation.Chat).some(w => w.attachmentCapabilities.supportsTerminalAttachments);
		if (!chatIsEnabled) {
			return undefined;
		}
		const labelAttachToChat = localize("terminal.attachToChat", 'Attach To Chat');
		return {
			class: undefined, tooltip: labelAttachToChat, id: 'terminal.attachToChat', label: labelAttachToChat, enabled: true,
			run: async () => {
				let widget = this._chatWidgetService.lastFocusedWidget ?? this._chatWidgetService.getWidgetsByLocations(ChatAgentLocation.Chat)?.find(w => w.attachmentCapabilities.supportsTerminalAttachments);

				// If no widget found (e.g., after window reload when chat hasn't been focused), open chat view
				if (!widget) {
					widget = await this._chatWidgetService.revealWidget();
				}

				if (!widget) {
					return;
				}

				let terminalContext: TerminalContext | undefined;
				if (this._resource) {
					const parsedUri = parseTerminalUri(this._resource);
					terminalContext = this._instantiationService.createInstance(TerminalContext, getTerminalUri(parsedUri.workspaceId, parsedUri.instanceId!, undefined, command.id));
				}

				if (terminalContext && widget.attachmentCapabilities.supportsTerminalAttachments) {
					try {
						const attachment = await terminalContext.asAttachment(widget);
						if (attachment) {
							widget.attachmentModel.addContext(attachment);
							widget.focusInput();
							return;
						}
					} catch (err) {
					}
					this._store.add(this._contextPickService.registerChatContextItem(terminalContext));
				}
			}
		};
	}

	private _showToggleVisibilityQuickPick() {
		const quickPick = this._register(this._quickInputService.createQuickPick());
		quickPick.hideInput = true;
		quickPick.hideCheckAll = true;
		quickPick.canSelectMany = true;
		quickPick.title = localize('toggleVisibility', 'Toggle visibility');
		const configValue = this._configurationService.getValue(TerminalSettingId.ShellIntegrationDecorationsEnabled);
		const gutterIcon: IQuickPickItem = {
			label: localize('gutter', 'Gutter command decorations'),
			picked: configValue !== 'never' && configValue !== 'overviewRuler'
		};
		const overviewRulerIcon: IQuickPickItem = {
			label: localize('overviewRuler', 'Overview ruler command decorations'),
			picked: configValue !== 'never' && configValue !== 'gutter'
		};
		quickPick.items = [gutterIcon, overviewRulerIcon];
		const selectedItems: IQuickPickItem[] = [];
		if (configValue !== 'never') {
			if (configValue !== 'gutter') {
				selectedItems.push(gutterIcon);
			}
			if (configValue !== 'overviewRuler') {
				selectedItems.push(overviewRulerIcon);
			}
		}
		quickPick.selectedItems = selectedItems;
		this._register(quickPick.onDidChangeSelection(async e => {
			let newValue: 'both' | 'gutter' | 'overviewRuler' | 'never' = 'never';
			if (e.includes(gutterIcon)) {
				if (e.includes(overviewRulerIcon)) {
					newValue = 'both';
				} else {
					newValue = 'gutter';
				}
			} else if (e.includes(overviewRulerIcon)) {
				newValue = 'overviewRuler';
			}
			await this._configurationService.updateValue(TerminalSettingId.ShellIntegrationDecorationsEnabled, newValue);
		}));
		quickPick.ok = false;
		quickPick.show();
	}

	private _getDecorationCssColor(command?: ITerminalCommand): string | undefined {
		let colorId: string;
		if (command?.exitCode === undefined) {
			colorId = TERMINAL_COMMAND_DECORATION_DEFAULT_BACKGROUND_COLOR;
		} else {
			colorId = command.exitCode ? TERMINAL_COMMAND_DECORATION_ERROR_BACKGROUND_COLOR : TERMINAL_COMMAND_DECORATION_SUCCESS_BACKGROUND_COLOR;
		}
		return this._themeService.getColorTheme().getColor(colorId)?.toString();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/xterm/decorationStyles.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/xterm/decorationStyles.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { fromNow, getDurationString } from '../../../../../base/common/date.js';
import { isNumber } from '../../../../../base/common/types.js';
import type { ThemeIcon } from '../../../../../base/common/themables.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import type { ITerminalCommand } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { TerminalSettingId } from '../../../../../platform/terminal/common/terminal.js';
import { terminalDecorationError, terminalDecorationIncomplete, terminalDecorationSuccess } from '../terminalIcons.js';

const enum DecorationStyles {
	DefaultDimension = 16,
	MarginLeft = -17,
}

export const enum DecorationSelector {
	CommandDecoration = 'terminal-command-decoration',
	Hide = 'hide',
	ErrorColor = 'error',
	DefaultColor = 'default-color',
	Default = 'default',
	Codicon = 'codicon',
	XtermDecoration = 'xterm-decoration',
	OverviewRuler = '.xterm-decoration-overview-ruler',
}

export function getTerminalDecorationHoverContent(command: ITerminalCommand | undefined, hoverMessage?: string, showCommandActions?: boolean): string {
	let hoverContent = showCommandActions ? `${localize('terminalPromptContextMenu', "Show Command Actions")}\n\n---\n\n` : '';
	if (!command) {
		if (hoverMessage) {
			hoverContent = hoverMessage;
		} else {
			return '';
		}
	} else if (command.markProperties || hoverMessage) {
		if (command.markProperties?.hoverMessage || hoverMessage) {
			hoverContent = command.markProperties?.hoverMessage || hoverMessage || '';
		} else {
			return '';
		}
	} else {
		if (isNumber(command.duration)) {
			const durationText = getDurationString(command.duration);
			if (command.exitCode) {
				if (command.exitCode === -1) {
					hoverContent += localize('terminalPromptCommandFailed.duration', 'Command executed {0}, took {1} and failed', fromNow(command.timestamp, true), durationText);
				} else {
					hoverContent += localize('terminalPromptCommandFailedWithExitCode.duration', 'Command executed {0}, took {1} and failed (Exit Code {2})', fromNow(command.timestamp, true), durationText, command.exitCode);
				}
			} else {
				hoverContent += localize('terminalPromptCommandSuccess.duration', 'Command executed {0} and took {1}', fromNow(command.timestamp, true), durationText);
			}
		} else {
			if (command.exitCode) {
				if (command.exitCode === -1) {
					hoverContent += localize('terminalPromptCommandFailed', 'Command executed {0} and failed', fromNow(command.timestamp, true));
				} else {
					hoverContent += localize('terminalPromptCommandFailedWithExitCode', 'Command executed {0} and failed (Exit Code {1})', fromNow(command.timestamp, true), command.exitCode);
				}
			} else {
				hoverContent += localize('terminalPromptCommandSuccess', 'Command executed {0} now');
			}
		}
	}
	return hoverContent;
}

export interface ITerminalCommandDecorationPersistedState {
	exitCode?: number;
	timestamp?: number;
	duration?: number;
}

export const enum TerminalCommandDecorationStatus {
	Unknown = 'unknown',
	Running = 'running',
	Success = 'success',
	Error = 'error'
}

export interface ITerminalCommandDecorationState {
	status: TerminalCommandDecorationStatus;
	icon: ThemeIcon;
	classNames: string[];
	exitCode?: number;
	exitCodeText: string;
	startTimestamp?: number;
	startText: string;
	duration?: number;
	durationText: string;
	hoverMessage: string;
}

const unknownText = localize('terminalCommandDecoration.unknown', 'Unknown');
const runningText = localize('terminalCommandDecoration.running', 'Running');

export function getTerminalCommandDecorationTooltip(command?: ITerminalCommand, storedState?: ITerminalCommandDecorationPersistedState): string {
	if (command) {
		return getTerminalDecorationHoverContent(command);
	}
	if (!storedState) {
		return '';
	}
	const timestamp = storedState.timestamp;
	const exitCode = storedState.exitCode;
	const duration = storedState.duration;
	if (typeof timestamp !== 'number' || timestamp === undefined) {
		return '';
	}
	let hoverContent = '';
	const fromNowText = fromNow(timestamp, true);
	if (typeof duration === 'number') {
		const durationText = getDurationString(Math.max(duration, 0));
		if (exitCode) {
			if (exitCode === -1) {
				hoverContent += localize('terminalPromptCommandFailed.duration', 'Command executed {0}, took {1} and failed', fromNowText, durationText);
			} else {
				hoverContent += localize('terminalPromptCommandFailedWithExitCode.duration', 'Command executed {0}, took {1} and failed (Exit Code {2})', fromNowText, durationText, exitCode);
			}
		} else {
			hoverContent += localize('terminalPromptCommandSuccess.duration', 'Command executed {0} and took {1}', fromNowText, durationText);
		}
	} else {
		if (exitCode) {
			if (exitCode === -1) {
				hoverContent += localize('terminalPromptCommandFailed', 'Command executed {0} and failed', fromNowText);
			} else {
				hoverContent += localize('terminalPromptCommandFailedWithExitCode', 'Command executed {0} and failed (Exit Code {1})', fromNowText, exitCode);
			}
		} else {
			hoverContent += localize('terminalPromptCommandSuccess.', 'Command executed {0} ', fromNowText);
		}
	}
	return hoverContent;
}

export function getTerminalCommandDecorationState(
	command: ITerminalCommand | undefined,
	storedState?: ITerminalCommandDecorationPersistedState,
	now: number = Date.now()
): ITerminalCommandDecorationState {
	let status = TerminalCommandDecorationStatus.Unknown;
	const exitCode: number | undefined = command?.exitCode ?? storedState?.exitCode;
	let exitCodeText = unknownText;
	const startTimestamp: number | undefined = command?.timestamp ?? storedState?.timestamp;
	let startText = unknownText;
	let durationMs: number | undefined;
	let durationText = unknownText;

	if (typeof startTimestamp === 'number') {
		startText = new Date(startTimestamp).toLocaleString();
	}

	if (command) {
		if (command.exitCode === undefined) {
			status = TerminalCommandDecorationStatus.Running;
			exitCodeText = runningText;
			durationMs = startTimestamp !== undefined ? Math.max(0, now - startTimestamp) : undefined;
		} else if (command.exitCode !== 0) {
			status = TerminalCommandDecorationStatus.Error;
			exitCodeText = String(command.exitCode);
			durationMs = command.duration ?? (startTimestamp !== undefined ? Math.max(0, now - startTimestamp) : undefined);
		} else {
			status = TerminalCommandDecorationStatus.Success;
			exitCodeText = String(command.exitCode);
			durationMs = command.duration ?? (startTimestamp !== undefined ? Math.max(0, now - startTimestamp) : undefined);
		}
	} else if (storedState) {
		if (storedState.exitCode === undefined) {
			status = TerminalCommandDecorationStatus.Running;
			exitCodeText = runningText;
			durationMs = startTimestamp !== undefined ? Math.max(0, now - startTimestamp) : undefined;
		} else if (storedState.exitCode !== 0) {
			status = TerminalCommandDecorationStatus.Error;
			exitCodeText = String(storedState.exitCode);
			durationMs = storedState.duration;
		} else {
			status = TerminalCommandDecorationStatus.Success;
			exitCodeText = String(storedState.exitCode);
			durationMs = storedState.duration;
		}
	}

	if (typeof durationMs === 'number') {
		durationText = getDurationString(Math.max(durationMs, 0));
	}

	const classNames: string[] = [];
	let icon = terminalDecorationIncomplete;
	switch (status) {
		case TerminalCommandDecorationStatus.Running:
		case TerminalCommandDecorationStatus.Unknown:
			classNames.push(DecorationSelector.DefaultColor, DecorationSelector.Default);
			icon = terminalDecorationIncomplete;
			break;
		case TerminalCommandDecorationStatus.Error:
			classNames.push(DecorationSelector.ErrorColor);
			icon = terminalDecorationError;
			break;
		case TerminalCommandDecorationStatus.Success:
			classNames.push('success');
			icon = terminalDecorationSuccess;
			break;
	}

	const hoverMessage = getTerminalCommandDecorationTooltip(command, storedState);

	return {
		status,
		icon,
		classNames,
		exitCode,
		exitCodeText,
		startTimestamp,
		startText,
		duration: durationMs,
		durationText,
		hoverMessage
	};
}

export function updateLayout(configurationService: IConfigurationService, element?: HTMLElement): void {
	if (!element) {
		return;
	}
	const fontSize = configurationService.inspect(TerminalSettingId.FontSize).value;
	const defaultFontSize = configurationService.inspect(TerminalSettingId.FontSize).defaultValue;
	const lineHeight = configurationService.inspect(TerminalSettingId.LineHeight).value;
	if (isNumber(fontSize) && isNumber(defaultFontSize) && isNumber(lineHeight)) {
		const scalar = (fontSize / defaultFontSize) <= 1 ? (fontSize / defaultFontSize) : 1;
		// must be inlined to override the inlined styles from xterm
		element.style.width = `${scalar * DecorationStyles.DefaultDimension}px`;
		element.style.height = `${scalar * DecorationStyles.DefaultDimension * lineHeight}px`;
		element.style.fontSize = `${scalar * DecorationStyles.DefaultDimension}px`;
		element.style.marginLeft = `${scalar * DecorationStyles.MarginLeft}px`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/xterm/lineDataEventAddon.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/xterm/lineDataEventAddon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { Disposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { OperatingSystem } from '../../../../../base/common/platform.js';
import type { Terminal as XTermTerminal, IBuffer, ITerminalAddon } from '@xterm/xterm';

/**
 * Provides extensions to the xterm object in a modular, testable way.
 */
export class LineDataEventAddon extends Disposable implements ITerminalAddon {

	private _xterm?: XTermTerminal;
	private _isOsSet = false;

	private readonly _onLineData = this._register(new Emitter<string>());
	readonly onLineData = this._onLineData.event;

	constructor(private readonly _initializationPromise?: Promise<void>) {
		super();
	}

	async activate(xterm: XTermTerminal) {
		this._xterm = xterm;

		// IMPORTANT: Instantiate the buffer namespace object here before it's disposed.
		const buffer = xterm.buffer;

		// If there is an initialization promise, wait for it before registering the event
		await this._initializationPromise;

		// Fire onLineData when a line feed occurs, taking into account wrapped lines
		this._register(xterm.onLineFeed(() => {
			const newLine = buffer.active.getLine(buffer.active.baseY + buffer.active.cursorY);
			if (newLine && !newLine.isWrapped) {
				this._sendLineData(buffer.active, buffer.active.baseY + buffer.active.cursorY - 1);
			}
		}));

		// Fire onLineData when disposing object to flush last line
		this._register(toDisposable(() => {
			this._sendLineData(buffer.active, buffer.active.baseY + buffer.active.cursorY);
		}));
	}

	setOperatingSystem(os: OperatingSystem) {
		if (this._isOsSet || !this._xterm) {
			return;
		}
		this._isOsSet = true;

		// Force line data to be sent when the cursor is moved, the main purpose for
		// this is because ConPTY will often not do a line feed but instead move the
		// cursor, in which case we still want to send the current line's data to tasks.
		if (os === OperatingSystem.Windows) {
			const xterm = this._xterm;
			this._register(xterm.parser.registerCsiHandler({ final: 'H' }, () => {
				const buffer = xterm.buffer;
				this._sendLineData(buffer.active, buffer.active.baseY + buffer.active.cursorY);
				return false;
			}));
		}
	}

	private _sendLineData(buffer: IBuffer, lineIndex: number): void {
		let line = buffer.getLine(lineIndex);
		if (!line) {
			return;
		}
		let lineData = line.translateToString(true);
		while (lineIndex > 0 && line.isWrapped) {
			line = buffer.getLine(--lineIndex);
			if (!line) {
				break;
			}
			lineData = line.translateToString(false) + lineData;
		}
		this._onLineData.fire(lineData);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/xterm/markNavigationAddon.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/xterm/markNavigationAddon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../../../base/common/arrays.js';
import { Disposable, DisposableStore, MutableDisposable, dispose } from '../../../../../base/common/lifecycle.js';
import { IMarkTracker } from '../terminal.js';
import { ITerminalCapabilityStore, ITerminalCommand, TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import type { Terminal, IMarker, ITerminalAddon, IDecoration, IBufferRange } from '@xterm/xterm';
import { timeout } from '../../../../../base/common/async.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { TERMINAL_OVERVIEW_RULER_CURSOR_FOREGROUND_COLOR } from '../../common/terminalColorRegistry.js';
import { getWindow } from '../../../../../base/browser/dom.js';
import { ICurrentPartialCommand, isFullTerminalCommand } from '../../../../../platform/terminal/common/capabilities/commandDetection/terminalCommand.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TerminalContribSettingId } from '../../terminalContribExports.js';

enum Boundary {
	Top,
	Bottom
}

export const enum ScrollPosition {
	Top,
	Middle
}

interface IScrollToMarkerOptions {
	hideDecoration?: boolean;
	/** Scroll even if the line is within the viewport */
	forceScroll?: boolean;
	bufferRange?: IBufferRange;
}

export class MarkNavigationAddon extends Disposable implements IMarkTracker, ITerminalAddon {
	private _currentMarker: IMarker | Boundary = Boundary.Bottom;
	private _selectionStart: IMarker | Boundary | null = null;
	private _isDisposable: boolean = false;
	protected _terminal: Terminal | undefined;
	private _navigationDecorations: IDecoration[] | undefined;

	private _activeCommandGuide?: ITerminalCommand;
	private readonly _commandGuideDecorations = this._register(new MutableDisposable<DisposableStore>());

	activate(terminal: Terminal): void {
		this._terminal = terminal;
		this._register(this._terminal.onData(() => {
			this._currentMarker = Boundary.Bottom;
		}));
	}

	constructor(
		private readonly _capabilities: ITerminalCapabilityStore,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IThemeService private readonly _themeService: IThemeService
	) {
		super();
	}

	private _getMarkers(skipEmptyCommands?: boolean): readonly IMarker[] {
		const commandCapability = this._capabilities.get(TerminalCapability.CommandDetection);
		const partialCommandCapability = this._capabilities.get(TerminalCapability.PartialCommandDetection);
		const markCapability = this._capabilities.get(TerminalCapability.BufferMarkDetection);
		let markers: IMarker[] = [];
		if (commandCapability) {
			markers = coalesce(commandCapability.commands.filter(e => skipEmptyCommands ? e.exitCode !== undefined : true).map(e => e.promptStartMarker ?? e.marker));
			// Allow navigating to the current command iff it has been executed, this ignores the
			// skipEmptyCommands flag intenionally as chances are it's not going to be empty if an
			// executed marker exists when this is requested.
			if (commandCapability.currentCommand?.promptStartMarker && commandCapability.currentCommand.commandExecutedMarker) {
				markers.push(commandCapability.currentCommand?.promptStartMarker);
			}
		} else if (partialCommandCapability) {
			markers.push(...partialCommandCapability.commands);
		}

		if (markCapability && !skipEmptyCommands) {
			let next = markCapability.markers().next()?.value;
			const arr: IMarker[] = [];
			while (next) {
				arr.push(next);
				next = markCapability.markers().next()?.value;
			}
			markers = arr;
		}
		return markers;
	}

	private _findCommand(marker: IMarker): ITerminalCommand | ICurrentPartialCommand | undefined {
		const commandCapability = this._capabilities.get(TerminalCapability.CommandDetection);
		if (commandCapability) {
			const command = commandCapability.commands.find(e => e.marker?.line === marker.line || e.promptStartMarker?.line === marker.line);
			if (command) {
				return command;
			}
			if (commandCapability.currentCommand) {
				return commandCapability.currentCommand;
			}
		}
		return undefined;
	}

	clear(): void {
		// Clear the current marker so successive focus/selection actions are performed from the
		// bottom of the buffer
		this._currentMarker = Boundary.Bottom;
		this._resetNavigationDecorations();
		this._selectionStart = null;
	}

	private _resetNavigationDecorations() {
		if (this._navigationDecorations) {
			dispose(this._navigationDecorations);
		}
		this._navigationDecorations = [];
	}

	private _isEmptyCommand(marker: IMarker | Boundary) {
		if (marker === Boundary.Bottom) {
			return true;
		}

		if (marker === Boundary.Top) {
			return !this._getMarkers(true).map(e => e.line).includes(0);
		}

		return !this._getMarkers(true).includes(marker);
	}

	scrollToPreviousMark(scrollPosition: ScrollPosition = ScrollPosition.Middle, retainSelection: boolean = false, skipEmptyCommands: boolean = true): void {
		if (!this._terminal) {
			return;
		}
		if (!retainSelection) {
			this._selectionStart = null;
		}

		let markerIndex;
		const currentLineY = typeof this._currentMarker === 'object'
			? this.getTargetScrollLine(this._currentMarker.line, scrollPosition)
			: Math.min(getLine(this._terminal, this._currentMarker), this._terminal.buffer.active.baseY);
		const viewportY = this._terminal.buffer.active.viewportY;
		if (typeof this._currentMarker === 'object' ? !this._isMarkerInViewport(this._terminal, this._currentMarker) : currentLineY !== viewportY) {
			// The user has scrolled, find the line based on the current scroll position. This only
			// works when not retaining selection
			const markersBelowViewport = this._getMarkers(skipEmptyCommands).filter(e => e.line >= viewportY).length;
			// -1 will scroll to the top
			markerIndex = this._getMarkers(skipEmptyCommands).length - markersBelowViewport - 1;
		} else if (this._currentMarker === Boundary.Bottom) {
			markerIndex = this._getMarkers(skipEmptyCommands).length - 1;
		} else if (this._currentMarker === Boundary.Top) {
			markerIndex = -1;
		} else if (this._isDisposable) {
			markerIndex = this._findPreviousMarker(skipEmptyCommands);
			this._currentMarker.dispose();
			this._isDisposable = false;
		} else {
			if (skipEmptyCommands && this._isEmptyCommand(this._currentMarker)) {
				markerIndex = this._findPreviousMarker(true);
			} else {
				markerIndex = this._getMarkers(skipEmptyCommands).indexOf(this._currentMarker) - 1;
			}
		}

		if (markerIndex < 0) {
			this._currentMarker = Boundary.Top;
			this._terminal.scrollToTop();
			this._resetNavigationDecorations();
			return;
		}

		this._currentMarker = this._getMarkers(skipEmptyCommands)[markerIndex];
		this._scrollToCommand(this._currentMarker, scrollPosition);
	}

	scrollToNextMark(scrollPosition: ScrollPosition = ScrollPosition.Middle, retainSelection: boolean = false, skipEmptyCommands: boolean = true): void {
		if (!this._terminal) {
			return;
		}
		if (!retainSelection) {
			this._selectionStart = null;
		}

		let markerIndex;
		const currentLineY = typeof this._currentMarker === 'object'
			? this.getTargetScrollLine(this._currentMarker.line, scrollPosition)
			: Math.min(getLine(this._terminal, this._currentMarker), this._terminal.buffer.active.baseY);
		const viewportY = this._terminal.buffer.active.viewportY;
		if (typeof this._currentMarker === 'object' ? !this._isMarkerInViewport(this._terminal, this._currentMarker) : currentLineY !== viewportY) {
			// The user has scrolled, find the line based on the current scroll position. This only
			// works when not retaining selection
			const markersAboveViewport = this._getMarkers(skipEmptyCommands).filter(e => e.line <= viewportY).length;
			// markers.length will scroll to the bottom
			markerIndex = markersAboveViewport;
		} else if (this._currentMarker === Boundary.Bottom) {
			markerIndex = this._getMarkers(skipEmptyCommands).length;
		} else if (this._currentMarker === Boundary.Top) {
			markerIndex = 0;
		} else if (this._isDisposable) {
			markerIndex = this._findNextMarker(skipEmptyCommands);
			this._currentMarker.dispose();
			this._isDisposable = false;
		} else {
			if (skipEmptyCommands && this._isEmptyCommand(this._currentMarker)) {
				markerIndex = this._findNextMarker(true);
			} else {
				markerIndex = this._getMarkers(skipEmptyCommands).indexOf(this._currentMarker) + 1;
			}
		}

		if (markerIndex >= this._getMarkers(skipEmptyCommands).length) {
			this._currentMarker = Boundary.Bottom;
			this._terminal.scrollToBottom();
			this._resetNavigationDecorations();
			return;
		}

		this._currentMarker = this._getMarkers(skipEmptyCommands)[markerIndex];
		this._scrollToCommand(this._currentMarker, scrollPosition);
	}

	private _scrollToCommand(marker: IMarker, position: ScrollPosition): void {
		const command = this._findCommand(marker);
		if (command) {
			this.revealCommand(command, position);
		} else {
			this._scrollToMarker(marker, position);
		}
	}

	private _scrollToMarker(start: IMarker | number, position: ScrollPosition, end?: IMarker | number, options?: IScrollToMarkerOptions): void {
		if (!this._terminal) {
			return;
		}
		if (!this._isMarkerInViewport(this._terminal, start) || options?.forceScroll) {
			const line = this.getTargetScrollLine(toLineIndex(start), position);
			this._terminal.scrollToLine(line);
		}
		if (!options?.hideDecoration) {
			if (options?.bufferRange) {
				this._highlightBufferRange(options.bufferRange);
			} else {
				this.registerTemporaryDecoration(start, end, true);
			}
		}
	}

	private _createMarkerForOffset(marker: IMarker | number, offset: number): IMarker {
		if (offset === 0 && isMarker(marker)) {
			return marker;
		} else {
			const offsetMarker = this._terminal?.registerMarker(-this._terminal.buffer.active.cursorY + toLineIndex(marker) - this._terminal.buffer.active.baseY + offset);
			if (offsetMarker) {
				return offsetMarker;
			} else {
				throw new Error(`Could not register marker with offset ${toLineIndex(marker)}, ${offset}`);
			}
		}
	}

	revealCommand(command: ITerminalCommand | ICurrentPartialCommand, position: ScrollPosition = ScrollPosition.Middle): void {
		const marker = isFullTerminalCommand(command) ? command.marker : command.commandStartMarker;
		if (!this._terminal || !marker) {
			return;
		}
		const line = toLineIndex(marker);
		const promptRowCount = command.getPromptRowCount();
		const commandRowCount = command.getCommandRowCount();
		this._scrollToMarker(
			line - (promptRowCount - 1),
			position,
			line + (commandRowCount - 1)
		);
	}

	revealRange(range: IBufferRange): void {
		this._scrollToMarker(
			range.start.y - 1,
			ScrollPosition.Middle,
			range.end.y - 1,
			{
				bufferRange: range,
				// Ensure scroll shows the line when sticky scroll is enabled
				forceScroll: !!this._configurationService.getValue(TerminalContribSettingId.StickyScrollEnabled)
			}
		);
	}

	showCommandGuide(command: ITerminalCommand | undefined): void {
		if (!this._terminal) {
			return;
		}
		if (!command) {
			this._commandGuideDecorations.clear();
			this._activeCommandGuide = undefined;
			return;
		}
		if (this._activeCommandGuide === command) {
			return;
		}
		if (command.marker) {
			this._activeCommandGuide = command;

			// Highlight output
			const store = this._commandGuideDecorations.value = new DisposableStore();
			if (!command.executedMarker || !command.endMarker) {
				return;
			}
			const startLine = command.marker.line - (command.getPromptRowCount() - 1);
			const decorationCount = toLineIndex(command.endMarker) - startLine;
			// Abort if the command is excessively long to avoid performance on hover/leave
			if (decorationCount > 200) {
				return;
			}
			for (let i = 0; i < decorationCount; i++) {
				const decoration = this._terminal.registerDecoration({
					marker: this._createMarkerForOffset(startLine, i)
				});
				if (decoration) {
					store.add(decoration);
					let renderedElement: HTMLElement | undefined;
					store.add(decoration.onRender(element => {
						if (!renderedElement) {
							renderedElement = element;
							element.classList.add('terminal-command-guide');
							if (i === 0) {
								element.classList.add('top');
							}
							if (i === decorationCount - 1) {
								element.classList.add('bottom');
							}
						}
						if (this._terminal?.element) {
							element.style.marginLeft = `-${getWindow(this._terminal.element).getComputedStyle(this._terminal.element).paddingLeft}`;
						}
					}));
				}
			}
		}
	}


	private _scrollState: { viewportY: number } | undefined;

	saveScrollState(): void {
		this._scrollState = { viewportY: this._terminal?.buffer.active.viewportY ?? 0 };
	}

	restoreScrollState(): void {
		if (this._scrollState && this._terminal) {
			this._terminal.scrollToLine(this._scrollState.viewportY);
			this._scrollState = undefined;
		}
	}

	private _highlightBufferRange(range: IBufferRange): void {
		if (!this._terminal) {
			return;
		}

		this._resetNavigationDecorations();
		const startLine = range.start.y;
		const decorationCount = range.end.y - range.start.y + 1;
		for (let i = 0; i < decorationCount; i++) {
			const decoration = this._terminal.registerDecoration({
				marker: this._createMarkerForOffset(startLine - 1, i),
				x: range.start.x - 1,
				width: (range.end.x - 1) - (range.start.x - 1) + 1,
				overviewRulerOptions: undefined
			});
			if (decoration) {
				this._navigationDecorations?.push(decoration);
				let renderedElement: HTMLElement | undefined;

				decoration.onRender(element => {
					if (!renderedElement) {
						renderedElement = element;
						element.classList.add('terminal-range-highlight');
					}
				});
				decoration.onDispose(() => { this._navigationDecorations = this._navigationDecorations?.filter(d => d !== decoration); });
			}
		}
	}

	registerTemporaryDecoration(marker: IMarker | number, endMarker: IMarker | number | undefined, showOutline: boolean): void {
		if (!this._terminal) {
			return;
		}
		this._resetNavigationDecorations();
		const color = this._themeService.getColorTheme().getColor(TERMINAL_OVERVIEW_RULER_CURSOR_FOREGROUND_COLOR);
		const startLine = toLineIndex(marker);
		const decorationCount = endMarker ? toLineIndex(endMarker) - startLine + 1 : 1;
		for (let i = 0; i < decorationCount; i++) {
			const decoration = this._terminal.registerDecoration({
				marker: this._createMarkerForOffset(marker, i),
				width: this._terminal.cols,
				overviewRulerOptions: i === 0 ? {
					color: color?.toString() || '#a0a0a0cc'
				} : undefined
			});
			if (decoration) {
				this._navigationDecorations?.push(decoration);
				let renderedElement: HTMLElement | undefined;

				decoration.onRender(element => {
					if (!renderedElement) {
						renderedElement = element;
						element.classList.add('terminal-scroll-highlight');
						if (showOutline) {
							element.classList.add('terminal-scroll-highlight-outline');
						}
						if (i === 0) {
							element.classList.add('top');
						}
						if (i === decorationCount - 1) {
							element.classList.add('bottom');
						}
					} else {
						element.classList.add('terminal-scroll-highlight');
					}
					if (this._terminal?.element) {
						element.style.marginLeft = `-${getWindow(this._terminal.element).getComputedStyle(this._terminal.element).paddingLeft}`;
					}
				});
				// TODO: This is not efficient for a large decorationCount
				decoration.onDispose(() => { this._navigationDecorations = this._navigationDecorations?.filter(d => d !== decoration); });
				// Number picked to align with symbol highlight in the editor
				if (showOutline) {
					timeout(350).then(() => {
						if (renderedElement) {
							renderedElement.classList.remove('terminal-scroll-highlight-outline');
						}
					});
				}
			}
		}
	}

	scrollToLine(line: number, position: ScrollPosition): void {
		this._terminal?.scrollToLine(this.getTargetScrollLine(line, position));
	}

	getTargetScrollLine(line: number, position: ScrollPosition): number {
		// Middle is treated as 1/4 of the viewport's size because context below is almost always
		// more important than context above in the terminal.
		if (this._terminal && position === ScrollPosition.Middle) {
			return Math.max(line - Math.floor(this._terminal.rows / 4), 0);
		}
		return line;
	}

	private _isMarkerInViewport(terminal: Terminal, marker: IMarker | number) {
		const viewportY = terminal.buffer.active.viewportY;
		const line = toLineIndex(marker);
		return line >= viewportY && line < viewportY + terminal.rows;
	}

	scrollToClosestMarker(startMarkerId: string, endMarkerId?: string, highlight?: boolean | undefined): void {
		const detectionCapability = this._capabilities.get(TerminalCapability.BufferMarkDetection);
		if (!detectionCapability) {
			return;
		}
		const startMarker = detectionCapability.getMark(startMarkerId);
		if (!startMarker) {
			return;
		}
		const endMarker = endMarkerId ? detectionCapability.getMark(endMarkerId) : startMarker;
		this._scrollToMarker(startMarker, ScrollPosition.Top, endMarker, { hideDecoration: !highlight });
	}

	selectToPreviousMark(): void {
		if (!this._terminal) {
			return;
		}
		if (this._selectionStart === null) {
			this._selectionStart = this._currentMarker;
		}
		if (this._capabilities.has(TerminalCapability.CommandDetection)) {
			this.scrollToPreviousMark(ScrollPosition.Middle, true, true);
		} else {
			this.scrollToPreviousMark(ScrollPosition.Middle, true, false);
		}
		selectLines(this._terminal, this._currentMarker, this._selectionStart);
	}

	selectToNextMark(): void {
		if (!this._terminal) {
			return;
		}
		if (this._selectionStart === null) {
			this._selectionStart = this._currentMarker;
		}
		if (this._capabilities.has(TerminalCapability.CommandDetection)) {
			this.scrollToNextMark(ScrollPosition.Middle, true, true);
		} else {
			this.scrollToNextMark(ScrollPosition.Middle, true, false);
		}
		selectLines(this._terminal, this._currentMarker, this._selectionStart);
	}

	selectToPreviousLine(): void {
		if (!this._terminal) {
			return;
		}
		if (this._selectionStart === null) {
			this._selectionStart = this._currentMarker;
		}
		this.scrollToPreviousLine(this._terminal, ScrollPosition.Middle, true);
		selectLines(this._terminal, this._currentMarker, this._selectionStart);
	}

	selectToNextLine(): void {
		if (!this._terminal) {
			return;
		}
		if (this._selectionStart === null) {
			this._selectionStart = this._currentMarker;
		}
		this.scrollToNextLine(this._terminal, ScrollPosition.Middle, true);
		selectLines(this._terminal, this._currentMarker, this._selectionStart);
	}

	scrollToPreviousLine(xterm: Terminal, scrollPosition: ScrollPosition = ScrollPosition.Middle, retainSelection: boolean = false): void {
		if (!retainSelection) {
			this._selectionStart = null;
		}

		if (this._currentMarker === Boundary.Top) {
			xterm.scrollToTop();
			return;
		}

		if (this._currentMarker === Boundary.Bottom) {
			this._currentMarker = this._registerMarkerOrThrow(xterm, this._getOffset(xterm) - 1);
		} else {
			const offset = this._getOffset(xterm);
			if (this._isDisposable) {
				this._currentMarker.dispose();
			}
			this._currentMarker = this._registerMarkerOrThrow(xterm, offset - 1);
		}
		this._isDisposable = true;
		this._scrollToMarker(this._currentMarker, scrollPosition);
	}

	scrollToNextLine(xterm: Terminal, scrollPosition: ScrollPosition = ScrollPosition.Middle, retainSelection: boolean = false): void {
		if (!retainSelection) {
			this._selectionStart = null;
		}

		if (this._currentMarker === Boundary.Bottom) {
			xterm.scrollToBottom();
			return;
		}

		if (this._currentMarker === Boundary.Top) {
			this._currentMarker = this._registerMarkerOrThrow(xterm, this._getOffset(xterm) + 1);
		} else {
			const offset = this._getOffset(xterm);
			if (this._isDisposable) {
				this._currentMarker.dispose();
			}
			this._currentMarker = this._registerMarkerOrThrow(xterm, offset + 1);
		}
		this._isDisposable = true;
		this._scrollToMarker(this._currentMarker, scrollPosition);
	}

	private _registerMarkerOrThrow(xterm: Terminal, cursorYOffset: number): IMarker {
		const marker = xterm.registerMarker(cursorYOffset);
		if (!marker) {
			throw new Error(`Could not create marker for ${cursorYOffset}`);
		}
		return marker;
	}

	private _getOffset(xterm: Terminal): number {
		if (this._currentMarker === Boundary.Bottom) {
			return 0;
		} else if (this._currentMarker === Boundary.Top) {
			return 0 - (xterm.buffer.active.baseY + xterm.buffer.active.cursorY);
		} else {
			let offset = getLine(xterm, this._currentMarker);
			offset -= xterm.buffer.active.baseY + xterm.buffer.active.cursorY;
			return offset;
		}
	}

	private _findPreviousMarker(skipEmptyCommands: boolean = false): number {
		if (this._currentMarker === Boundary.Top) {
			return 0;
		} else if (this._currentMarker === Boundary.Bottom) {
			return this._getMarkers(skipEmptyCommands).length - 1;
		}

		let i;
		for (i = this._getMarkers(skipEmptyCommands).length - 1; i >= 0; i--) {
			if (this._getMarkers(skipEmptyCommands)[i].line < this._currentMarker.line) {
				return i;
			}
		}

		return -1;
	}

	private _findNextMarker(skipEmptyCommands: boolean = false): number {
		if (this._currentMarker === Boundary.Top) {
			return 0;
		} else if (this._currentMarker === Boundary.Bottom) {
			return this._getMarkers(skipEmptyCommands).length - 1;
		}

		let i;
		for (i = 0; i < this._getMarkers(skipEmptyCommands).length; i++) {
			if (this._getMarkers(skipEmptyCommands)[i].line > this._currentMarker.line) {
				return i;
			}
		}

		return this._getMarkers(skipEmptyCommands).length;
	}
}

export function getLine(xterm: Terminal, marker: IMarker | Boundary): number {
	// Use the _second last_ row as the last row is likely the prompt
	if (marker === Boundary.Bottom) {
		return xterm.buffer.active.baseY + xterm.rows - 1;
	}

	if (marker === Boundary.Top) {
		return 0;
	}

	return marker.line;
}

export function selectLines(xterm: Terminal, start: IMarker | Boundary, end: IMarker | Boundary | null): void {
	if (end === null) {
		end = Boundary.Bottom;
	}

	let startLine = getLine(xterm, start);
	let endLine = getLine(xterm, end);

	if (startLine > endLine) {
		const temp = startLine;
		startLine = endLine;
		endLine = temp;
	}

	// Subtract a line as the marker is on the line the command run, we do not want the next
	// command in the selection for the current command
	endLine -= 1;

	xterm.selectLines(startLine, endLine);
}

function isMarker(value: IMarker | number): value is IMarker {
	return typeof value !== 'number';
}

function toLineIndex(line: IMarker | number): number {
	return isMarker(line) ? line.line : line;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/xterm/xtermAddonImporter.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/xterm/xtermAddonImporter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { ClipboardAddon as ClipboardAddonType } from '@xterm/addon-clipboard';
import type { ImageAddon as ImageAddonType } from '@xterm/addon-image';
import type { LigaturesAddon as LigaturesAddonType } from '@xterm/addon-ligatures';
import type { ProgressAddon as ProgressAddonType } from '@xterm/addon-progress';
import type { SearchAddon as SearchAddonType } from '@xterm/addon-search';
import type { SerializeAddon as SerializeAddonType } from '@xterm/addon-serialize';
import type { Unicode11Addon as Unicode11AddonType } from '@xterm/addon-unicode11';
import type { WebglAddon as WebglAddonType } from '@xterm/addon-webgl';
import { importAMDNodeModule } from '../../../../../amdX.js';

export interface IXtermAddonNameToCtor {
	clipboard: typeof ClipboardAddonType;
	image: typeof ImageAddonType;
	ligatures: typeof LigaturesAddonType;
	progress: typeof ProgressAddonType;
	search: typeof SearchAddonType;
	serialize: typeof SerializeAddonType;
	unicode11: typeof Unicode11AddonType;
	webgl: typeof WebglAddonType;
}

// This interface lets a maps key and value be linked with generics
interface IImportedXtermAddonMap extends Map<keyof IXtermAddonNameToCtor, IXtermAddonNameToCtor[keyof IXtermAddonNameToCtor]> {
	get<K extends keyof IXtermAddonNameToCtor>(name: K): IXtermAddonNameToCtor[K] | undefined;
	set<K extends keyof IXtermAddonNameToCtor>(name: K, value: IXtermAddonNameToCtor[K]): this;
}

const importedAddons: IImportedXtermAddonMap = new Map();

/**
 * Exposes a simple interface to consumers, encapsulating the messy import xterm
 * addon import and caching logic.
 */
export class XtermAddonImporter {
	async importAddon<T extends keyof IXtermAddonNameToCtor>(name: T): Promise<IXtermAddonNameToCtor[T]> {
		let addon = importedAddons.get(name);
		if (!addon) {
			switch (name) {
				case 'clipboard': addon = (await importAMDNodeModule<typeof import('@xterm/addon-clipboard')>('@xterm/addon-clipboard', 'lib/addon-clipboard.js')).ClipboardAddon as IXtermAddonNameToCtor[T]; break;
				case 'image': addon = (await importAMDNodeModule<typeof import('@xterm/addon-image')>('@xterm/addon-image', 'lib/addon-image.js')).ImageAddon as IXtermAddonNameToCtor[T]; break;
				case 'ligatures': addon = (await importAMDNodeModule<typeof import('@xterm/addon-ligatures')>('@xterm/addon-ligatures', 'lib/addon-ligatures.js')).LigaturesAddon as IXtermAddonNameToCtor[T]; break;
				case 'progress': addon = (await importAMDNodeModule<typeof import('@xterm/addon-progress')>('@xterm/addon-progress', 'lib/addon-progress.js')).ProgressAddon as IXtermAddonNameToCtor[T]; break;
				case 'search': addon = (await importAMDNodeModule<typeof import('@xterm/addon-search')>('@xterm/addon-search', 'lib/addon-search.js')).SearchAddon as IXtermAddonNameToCtor[T]; break;
				case 'serialize': addon = (await importAMDNodeModule<typeof import('@xterm/addon-serialize')>('@xterm/addon-serialize', 'lib/addon-serialize.js')).SerializeAddon as IXtermAddonNameToCtor[T]; break;
				case 'unicode11': addon = (await importAMDNodeModule<typeof import('@xterm/addon-unicode11')>('@xterm/addon-unicode11', 'lib/addon-unicode11.js')).Unicode11Addon as IXtermAddonNameToCtor[T]; break;
				case 'webgl': addon = (await importAMDNodeModule<typeof import('@xterm/addon-webgl')>('@xterm/addon-webgl', 'lib/addon-webgl.js')).WebglAddon as IXtermAddonNameToCtor[T]; break;
			}
			if (!addon) {
				throw new Error(`Could not load addon ${name}`);
			}
			importedAddons.set(name, addon);
		}
		return addon as IXtermAddonNameToCtor[T];
	}
}
```

--------------------------------------------------------------------------------

````
