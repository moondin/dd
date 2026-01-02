---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 438
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 438 of 552)

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

---[FILE: src/vs/workbench/contrib/preferences/browser/settingsWidgets.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/settingsWidgets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserFeatures } from '../../../../base/browser/canIUse.js';
import * as DOM from '../../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { applyDragImage } from '../../../../base/browser/ui/dnd/dnd.js';
import { InputBox } from '../../../../base/browser/ui/inputbox/inputBox.js';
import { SelectBox } from '../../../../base/browser/ui/selectBox/selectBox.js';
import { Toggle, unthemedToggleStyles } from '../../../../base/browser/ui/toggle/toggle.js';
import { IAction } from '../../../../base/common/actions.js';
import { disposableTimeout } from '../../../../base/common/async.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { isIOS } from '../../../../base/common/platform.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { isDefined, isUndefinedOrNull } from '../../../../base/common/types.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { defaultButtonStyles, getInputBoxStyle, getSelectBoxStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { hasNativeContextMenu } from '../../../../platform/window/common/window.js';
import { SettingValueType } from '../../../services/preferences/common/preferences.js';
import { settingsSelectBackground, settingsSelectBorder, settingsSelectForeground, settingsSelectListBorder, settingsTextInputBackground, settingsTextInputBorder, settingsTextInputForeground } from '../common/settingsEditorColorRegistry.js';
import './media/settingsWidgets.css';
import { settingsDiscardIcon, settingsEditIcon, settingsRemoveIcon } from './preferencesIcons.js';

const $ = DOM.$;

type EditKey = 'none' | 'create' | number;

type RowElementGroup = {
	rowElement: HTMLElement;
	keyElement: HTMLElement;
	valueElement?: HTMLElement;
};

type IListViewItem<TDataItem extends object> = TDataItem & {
	editing?: boolean;
	selected?: boolean;
};

export class ListSettingListModel<TDataItem extends object> {
	protected _dataItems: TDataItem[] = [];
	private _editKey: EditKey | null = null;
	private _selectedIdx: number | null = null;
	private _newDataItem: TDataItem;

	get items(): IListViewItem<TDataItem>[] {
		const items = this._dataItems.map((item, i) => {
			const editing = typeof this._editKey === 'number' && this._editKey === i;
			return {
				...item,
				editing,
				selected: i === this._selectedIdx || editing
			};
		});

		if (this._editKey === 'create') {
			items.push({
				editing: true,
				selected: true,
				...this._newDataItem,
			});
		}

		return items;
	}

	constructor(newItem: TDataItem) {
		this._newDataItem = newItem;
	}

	setEditKey(key: EditKey): void {
		this._editKey = key;
	}

	setValue(listData: TDataItem[]): void {
		this._dataItems = listData;
	}

	select(idx: number | null): void {
		this._selectedIdx = idx;
	}

	getSelected(): number | null {
		return this._selectedIdx;
	}

	selectNext(): void {
		if (typeof this._selectedIdx === 'number') {
			this._selectedIdx = Math.min(this._selectedIdx + 1, this._dataItems.length - 1);
		} else {
			this._selectedIdx = 0;
		}
	}

	selectPrevious(): void {
		if (typeof this._selectedIdx === 'number') {
			this._selectedIdx = Math.max(this._selectedIdx - 1, 0);
		} else {
			this._selectedIdx = 0;
		}
	}
}

export interface ISettingListChangeEvent<TDataItem extends object> {
	type: 'change';
	originalItem: TDataItem;
	newItem: TDataItem;
	targetIndex: number;
}

export interface ISettingListAddEvent<TDataItem extends object> {
	type: 'add';
	newItem: TDataItem;
	targetIndex: number;
}

export interface ISettingListMoveEvent<TDataItem extends object> {
	type: 'move';
	originalItem: TDataItem;
	newItem: TDataItem;
	targetIndex: number;
	sourceIndex: number;
}

export interface ISettingListRemoveEvent<TDataItem extends object> {
	type: 'remove';
	originalItem: TDataItem;
	targetIndex: number;
}

export interface ISettingListResetEvent<TDataItem extends object> {
	type: 'reset';
	originalItem: TDataItem;
	targetIndex: number;
}

export type SettingListEvent<TDataItem extends object> = ISettingListChangeEvent<TDataItem> | ISettingListAddEvent<TDataItem> | ISettingListMoveEvent<TDataItem> | ISettingListRemoveEvent<TDataItem> | ISettingListResetEvent<TDataItem>;

export abstract class AbstractListSettingWidget<TDataItem extends object> extends Disposable {
	private listElement: HTMLElement;
	private rowElements: HTMLElement[] = [];

	protected readonly _onDidChangeList = this._register(new Emitter<SettingListEvent<TDataItem>>());
	protected readonly model = new ListSettingListModel<TDataItem>(this.getEmptyItem());
	protected readonly listDisposables = this._register(new DisposableStore());

	readonly onDidChangeList: Event<SettingListEvent<TDataItem>> = this._onDidChangeList.event;

	get domNode(): HTMLElement {
		return this.listElement;
	}

	get items(): TDataItem[] {
		return this.model.items;
	}

	protected get isReadOnly(): boolean {
		return false;
	}

	constructor(
		private container: HTMLElement,
		@IThemeService protected readonly themeService: IThemeService,
		@IContextViewService protected readonly contextViewService: IContextViewService,
		@IConfigurationService protected readonly configurationService: IConfigurationService,
	) {
		super();

		this.listElement = DOM.append(container, $('div'));
		this.listElement.setAttribute('role', 'list');
		this.getContainerClasses().forEach(c => this.listElement.classList.add(c));
		DOM.append(container, this.renderAddButton());
		this.renderList();

		this._register(DOM.addDisposableListener(this.listElement, DOM.EventType.POINTER_DOWN, e => this.onListClick(e)));
		this._register(DOM.addDisposableListener(this.listElement, DOM.EventType.DBLCLICK, e => this.onListDoubleClick(e)));

		this._register(DOM.addStandardDisposableListener(this.listElement, 'keydown', (e: StandardKeyboardEvent) => {
			if (e.equals(KeyCode.UpArrow)) {
				this.selectPreviousRow();
			} else if (e.equals(KeyCode.DownArrow)) {
				this.selectNextRow();
			} else {
				return;
			}

			e.preventDefault();
			e.stopPropagation();
		}));
	}

	setValue(listData: TDataItem[]): void {
		this.model.setValue(listData);
		this.renderList();
	}

	abstract isItemNew(item: TDataItem): boolean;
	protected abstract getEmptyItem(): TDataItem;
	protected abstract getContainerClasses(): string[];
	protected abstract getActionsForItem(item: TDataItem, idx: number): IAction[];
	protected abstract renderItem(item: TDataItem, idx: number): RowElementGroup;
	protected abstract renderEdit(item: TDataItem, idx: number): HTMLElement;
	protected abstract addTooltipsToRow(rowElement: RowElementGroup, item: TDataItem): void;
	protected abstract getLocalizedStrings(): {
		deleteActionTooltip: string;
		editActionTooltip: string;
		addButtonLabel: string;
	};

	protected renderHeader(): HTMLElement | undefined {
		return;
	}

	protected isAddButtonVisible(): boolean {
		return true;
	}

	protected renderList(): void {
		const focused = DOM.isAncestorOfActiveElement(this.listElement);

		DOM.clearNode(this.listElement);
		this.listDisposables.clear();

		const newMode = this.model.items.some(item => !!(item.editing && this.isItemNew(item)));
		this.container.classList.toggle('setting-list-hide-add-button', !this.isAddButtonVisible() || newMode);

		if (this.model.items.length) {
			this.listElement.tabIndex = 0;
		} else {
			this.listElement.removeAttribute('tabIndex');
		}

		const header = this.renderHeader();

		if (header) {
			this.listElement.appendChild(header);
		}

		this.rowElements = this.model.items.map((item, i) => this.renderDataOrEditItem(item, i, focused));
		this.rowElements.forEach(rowElement => this.listElement.appendChild(rowElement));

	}

	protected createBasicSelectBox(value: IObjectEnumData): SelectBox {
		const selectBoxOptions = value.options.map(({ value, description }) => ({ text: value, description }));
		const selected = value.options.findIndex(option => value.data === option.value);

		const styles = getSelectBoxStyles({
			selectBackground: settingsSelectBackground,
			selectForeground: settingsSelectForeground,
			selectBorder: settingsSelectBorder,
			selectListBorder: settingsSelectListBorder
		});


		const selectBox = new SelectBox(selectBoxOptions, selected, this.contextViewService, styles, {
			useCustomDrawn: !hasNativeContextMenu(this.configurationService) || !(isIOS && BrowserFeatures.pointerEvents)
		});
		return selectBox;
	}

	protected editSetting(idx: number): void {
		this.model.setEditKey(idx);
		this.renderList();
	}

	public cancelEdit(): void {
		this.model.setEditKey('none');
		this.renderList();
	}

	protected handleItemChange(originalItem: TDataItem, changedItem: TDataItem, idx: number) {
		this.model.setEditKey('none');

		if (this.isItemNew(originalItem)) {
			this._onDidChangeList.fire({
				type: 'add',
				newItem: changedItem,
				targetIndex: idx,
			});
		} else {
			this._onDidChangeList.fire({
				type: 'change',
				originalItem,
				newItem: changedItem,
				targetIndex: idx,
			});
		}

		this.renderList();
	}

	protected renderDataOrEditItem(item: IListViewItem<TDataItem>, idx: number, listFocused: boolean): HTMLElement {
		const rowElement = item.editing ?
			this.renderEdit(item, idx) :
			this.renderDataItem(item, idx, listFocused);

		rowElement.setAttribute('role', 'listitem');

		return rowElement;
	}

	private renderDataItem(item: IListViewItem<TDataItem>, idx: number, listFocused: boolean): HTMLElement {
		const rowElementGroup = this.renderItem(item, idx);
		const rowElement = rowElementGroup.rowElement;

		rowElement.setAttribute('data-index', idx + '');
		rowElement.setAttribute('tabindex', item.selected ? '0' : '-1');
		rowElement.classList.toggle('selected', item.selected);

		const actionBar = new ActionBar(rowElement);
		this.listDisposables.add(actionBar);

		actionBar.push(this.getActionsForItem(item, idx), { icon: true, label: true });
		this.addTooltipsToRow(rowElementGroup, item);

		if (item.selected && listFocused) {
			disposableTimeout(() => rowElement.focus(), undefined, this.listDisposables);
		}

		this.listDisposables.add(DOM.addDisposableListener(rowElement, 'click', (e) => {
			// There is a parent list widget, which is the one that holds the list of settings.
			// Prevent the parent widget from trying to interpret this click event.
			e.stopPropagation();
		}));

		return rowElement;
	}

	private renderAddButton(): HTMLElement {
		const rowElement = $('.setting-list-new-row');

		const startAddButton = this._register(new Button(rowElement, defaultButtonStyles));
		startAddButton.label = this.getLocalizedStrings().addButtonLabel;
		startAddButton.element.classList.add('setting-list-addButton');

		this._register(startAddButton.onDidClick(() => {
			this.model.setEditKey('create');
			this.renderList();
		}));

		return rowElement;
	}

	private onListClick(e: PointerEvent): void {
		const targetIdx = this.getClickedItemIndex(e);
		if (targetIdx < 0) {
			return;
		}

		e.preventDefault();
		e.stopImmediatePropagation();
		if (this.model.getSelected() === targetIdx) {
			return;
		}

		this.selectRow(targetIdx);
	}

	private onListDoubleClick(e: MouseEvent): void {
		const targetIdx = this.getClickedItemIndex(e);
		if (targetIdx < 0) {
			return;
		}

		if (this.isReadOnly) {
			return;
		}

		const item = this.model.items[targetIdx];
		if (item) {
			this.editSetting(targetIdx);
			e.preventDefault();
			e.stopPropagation();
		}
	}

	private getClickedItemIndex(e: MouseEvent): number {
		if (!e.target) {
			return -1;
		}

		const actionbar = DOM.findParentWithClass(e.target as HTMLElement, 'monaco-action-bar');
		if (actionbar) {
			// Don't handle doubleclicks inside the action bar
			return -1;
		}

		const element = DOM.findParentWithClass(e.target as HTMLElement, 'setting-list-row');
		if (!element) {
			return -1;
		}

		const targetIdxStr = element.getAttribute('data-index');
		if (!targetIdxStr) {
			return -1;
		}

		const targetIdx = parseInt(targetIdxStr);
		return targetIdx;
	}

	private selectRow(idx: number): void {
		this.model.select(idx);
		this.rowElements.forEach(row => row.classList.remove('selected'));

		const selectedRow = this.rowElements[this.model.getSelected()!];

		selectedRow.classList.add('selected');
		selectedRow.focus();
	}

	private selectNextRow(): void {
		this.model.selectNext();
		this.selectRow(this.model.getSelected()!);
	}

	private selectPreviousRow(): void {
		this.model.selectPrevious();
		this.selectRow(this.model.getSelected()!);
	}
}

interface IListSetValueOptions {
	showAddButton?: boolean;
	keySuggester?: IObjectKeySuggester;
	isReadOnly?: boolean;
}

export interface IListDataItem {
	value: ObjectKey;
	sibling?: string;
}

interface ListSettingWidgetDragDetails<TListDataItem extends IListDataItem> {
	element: HTMLElement;
	item: TListDataItem;
	itemIndex: number;
}

export class ListSettingWidget<TListDataItem extends IListDataItem> extends AbstractListSettingWidget<TListDataItem> {
	private keyValueSuggester: IObjectKeySuggester | undefined;
	private showAddButton: boolean = true;
	private isEditable: boolean = true;

	override setValue(listData: TListDataItem[], options?: IListSetValueOptions) {
		this.keyValueSuggester = options?.keySuggester;
		this.isEditable = options?.isReadOnly === undefined ? true : !options.isReadOnly;
		this.showAddButton = this.isEditable ? (options?.showAddButton ?? true) : false;
		super.setValue(listData);
	}

	constructor(
		container: HTMLElement,
		@IThemeService themeService: IThemeService,
		@IContextViewService contextViewService: IContextViewService,
		@IHoverService protected readonly hoverService: IHoverService,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super(container, themeService, contextViewService, configurationService);
	}

	protected getEmptyItem(): TListDataItem {
		// eslint-disable-next-line local/code-no-dangerous-type-assertions
		return {
			value: {
				type: 'string',
				data: ''
			}
		} as TListDataItem;
	}

	protected override isAddButtonVisible(): boolean {
		return this.showAddButton;
	}

	protected getContainerClasses(): string[] {
		return ['setting-list-widget'];
	}

	protected getActionsForItem(item: TListDataItem, idx: number): IAction[] {
		if (this.isReadOnly) {
			return [];
		}
		return [
			{
				class: ThemeIcon.asClassName(settingsEditIcon),
				enabled: true,
				id: 'workbench.action.editListItem',
				tooltip: this.getLocalizedStrings().editActionTooltip,
				run: () => this.editSetting(idx)
			},
			{
				class: ThemeIcon.asClassName(settingsRemoveIcon),
				enabled: true,
				id: 'workbench.action.removeListItem',
				tooltip: this.getLocalizedStrings().deleteActionTooltip,
				run: () => this._onDidChangeList.fire({ type: 'remove', originalItem: item, targetIndex: idx })
			}
		] as IAction[];
	}

	private dragDetails: ListSettingWidgetDragDetails<TListDataItem> | undefined;

	protected renderItem(item: TListDataItem, idx: number): RowElementGroup {
		const rowElement = $('.setting-list-row');
		const valueElement = DOM.append(rowElement, $('.setting-list-value'));
		const siblingElement = DOM.append(rowElement, $('.setting-list-sibling'));

		valueElement.textContent = item.value.data.toString();
		if (item.sibling) {
			siblingElement.textContent = `when: ${item.sibling}`;
		} else {
			siblingElement.textContent = null;
			valueElement.classList.add('no-sibling');
		}

		this.addDragAndDrop(rowElement, item, idx);
		return { rowElement, keyElement: valueElement, valueElement: siblingElement };
	}

	protected addDragAndDrop(rowElement: HTMLElement, item: TListDataItem, idx: number) {
		if (this.model.items.every(item => !item.editing)) {
			rowElement.draggable = true;
			rowElement.classList.add('draggable');
		} else {
			rowElement.draggable = false;
			rowElement.classList.remove('draggable');
		}

		this.listDisposables.add(DOM.addDisposableListener(rowElement, DOM.EventType.DRAG_START, (ev) => {
			this.dragDetails = {
				element: rowElement,
				item,
				itemIndex: idx
			};

			applyDragImage(ev, rowElement, item.value.data);
		}));
		this.listDisposables.add(DOM.addDisposableListener(rowElement, DOM.EventType.DRAG_OVER, (ev) => {
			if (!this.dragDetails) {
				return false;
			}
			ev.preventDefault();
			if (ev.dataTransfer) {
				ev.dataTransfer.dropEffect = 'move';
			}
			return true;
		}));
		let counter = 0;
		this.listDisposables.add(DOM.addDisposableListener(rowElement, DOM.EventType.DRAG_ENTER, (ev) => {
			counter++;
			rowElement.classList.add('drag-hover');
		}));
		this.listDisposables.add(DOM.addDisposableListener(rowElement, DOM.EventType.DRAG_LEAVE, (ev) => {
			counter--;
			if (!counter) {
				rowElement.classList.remove('drag-hover');
			}
		}));
		this.listDisposables.add(DOM.addDisposableListener(rowElement, DOM.EventType.DROP, (ev) => {
			// cancel the op if we dragged to a completely different setting
			if (!this.dragDetails) {
				return false;
			}
			ev.preventDefault();
			counter = 0;
			if (this.dragDetails.element !== rowElement) {
				this._onDidChangeList.fire({
					type: 'move',
					originalItem: this.dragDetails.item,
					sourceIndex: this.dragDetails.itemIndex,
					newItem: item,
					targetIndex: idx
				});
			}
			return true;
		}));
		this.listDisposables.add(DOM.addDisposableListener(rowElement, DOM.EventType.DRAG_END, (ev) => {
			counter = 0;
			rowElement.classList.remove('drag-hover');
			ev.dataTransfer?.clearData();
			if (this.dragDetails) {
				this.dragDetails = undefined;
			}
		}));
	}

	protected renderEdit(item: TListDataItem, idx: number): HTMLElement {
		const rowElement = $('.setting-list-edit-row');
		let valueInput: InputBox | SelectBox;
		let currentDisplayValue: string;
		let currentEnumOptions: IObjectEnumOption[] | undefined;

		if (this.keyValueSuggester) {
			const enumData = this.keyValueSuggester(this.model.items.map(({ value: { data } }) => data), idx);
			item = {
				...item,
				value: {
					type: 'enum',
					data: item.value.data,
					options: enumData ? enumData.options : []
				}
			};
		}

		switch (item.value.type) {
			case 'string':
				valueInput = this.renderInputBox(item.value, rowElement);
				break;
			case 'enum':
				valueInput = this.renderDropdown(item.value, rowElement);
				currentEnumOptions = item.value.options;
				if (item.value.options.length) {
					currentDisplayValue = this.isItemNew(item) ?
						currentEnumOptions[0].value : item.value.data;
				}
				break;
		}

		const updatedInputBoxItem = (): TListDataItem => {
			const inputBox = valueInput as InputBox;
			// eslint-disable-next-line local/code-no-dangerous-type-assertions
			return {
				value: {
					type: 'string',
					data: inputBox.value
				},
				sibling: siblingInput?.value
			} as TListDataItem;
		};
		const updatedSelectBoxItem = (selectedValue: string): TListDataItem => {
			// eslint-disable-next-line local/code-no-dangerous-type-assertions
			return {
				value: {
					type: 'enum',
					data: selectedValue,
					options: currentEnumOptions ?? []
				}
			} as TListDataItem;
		};
		const onKeyDown = (e: StandardKeyboardEvent) => {
			if (e.equals(KeyCode.Enter)) {
				this.handleItemChange(item, updatedInputBoxItem(), idx);
			} else if (e.equals(KeyCode.Escape)) {
				this.cancelEdit();
				e.preventDefault();
			}
			rowElement?.focus();
		};

		if (item.value.type !== 'string') {
			const selectBox = valueInput as SelectBox;
			this.listDisposables.add(
				selectBox.onDidSelect(({ selected }) => {
					currentDisplayValue = selected;
				})
			);
		} else {
			const inputBox = valueInput as InputBox;
			this.listDisposables.add(
				DOM.addStandardDisposableListener(inputBox.inputElement, DOM.EventType.KEY_DOWN, onKeyDown)
			);
		}

		let siblingInput: InputBox | undefined;
		if (!isUndefinedOrNull(item.sibling)) {
			siblingInput = new InputBox(rowElement, this.contextViewService, {
				placeholder: this.getLocalizedStrings().siblingInputPlaceholder,
				inputBoxStyles: getInputBoxStyle({
					inputBackground: settingsTextInputBackground,
					inputForeground: settingsTextInputForeground,
					inputBorder: settingsTextInputBorder
				})
			});
			siblingInput.element.classList.add('setting-list-siblingInput');
			this.listDisposables.add(siblingInput);
			siblingInput.value = item.sibling;

			this.listDisposables.add(
				DOM.addStandardDisposableListener(siblingInput.inputElement, DOM.EventType.KEY_DOWN, onKeyDown)
			);
		} else if (valueInput instanceof InputBox) {
			valueInput.element.classList.add('no-sibling');
		}

		const okButton = this.listDisposables.add(new Button(rowElement, defaultButtonStyles));
		okButton.label = localize('okButton', "OK");
		okButton.element.classList.add('setting-list-ok-button');

		this.listDisposables.add(okButton.onDidClick(() => {
			if (item.value.type === 'string') {
				this.handleItemChange(item, updatedInputBoxItem(), idx);
			} else {
				this.handleItemChange(item, updatedSelectBoxItem(currentDisplayValue), idx);
			}
		}));

		const cancelButton = this.listDisposables.add(new Button(rowElement, { secondary: true, ...defaultButtonStyles }));
		cancelButton.label = localize('cancelButton', "Cancel");
		cancelButton.element.classList.add('setting-list-cancel-button');

		this.listDisposables.add(cancelButton.onDidClick(() => this.cancelEdit()));

		this.listDisposables.add(
			disposableTimeout(() => {
				valueInput.focus();
				if (valueInput instanceof InputBox) {
					valueInput.select();
				}
			})
		);

		return rowElement;
	}

	override isItemNew(item: TListDataItem): boolean {
		return item.value.data === '';
	}

	protected addTooltipsToRow(rowElementGroup: RowElementGroup, { value, sibling }: TListDataItem) {
		const title = isUndefinedOrNull(sibling)
			? localize('listValueHintLabel', "List item `{0}`", value.data)
			: localize('listSiblingHintLabel', "List item `{0}` with sibling `${1}`", value.data, sibling);

		const { rowElement } = rowElementGroup;
		this.listDisposables.add(this.hoverService.setupDelayedHover(rowElement, { content: title }));
		rowElement.setAttribute('aria-label', title);
	}

	protected getLocalizedStrings() {
		return {
			deleteActionTooltip: localize('removeItem', "Remove Item"),
			editActionTooltip: localize('editItem', "Edit Item"),
			addButtonLabel: localize('addItem', "Add Item"),
			inputPlaceholder: localize('itemInputPlaceholder', "Item..."),
			siblingInputPlaceholder: localize('listSiblingInputPlaceholder', "Sibling..."),
		};
	}

	private renderInputBox(value: ObjectValue, rowElement: HTMLElement): InputBox {
		const valueInput = new InputBox(rowElement, this.contextViewService, {
			placeholder: this.getLocalizedStrings().inputPlaceholder,
			inputBoxStyles: getInputBoxStyle({
				inputBackground: settingsTextInputBackground,
				inputForeground: settingsTextInputForeground,
				inputBorder: settingsTextInputBorder
			})
		});

		valueInput.element.classList.add('setting-list-valueInput');
		this.listDisposables.add(valueInput);
		valueInput.value = value.data.toString();

		return valueInput;
	}

	private renderDropdown(value: ObjectKey, rowElement: HTMLElement): SelectBox {
		if (value.type !== 'enum') {
			throw new Error('Valuetype must be enum.');
		}
		const selectBox = this.createBasicSelectBox(value);

		const wrapper = $('.setting-list-object-list-row');
		selectBox.render(wrapper);
		rowElement.appendChild(wrapper);

		return selectBox;
	}
}

export class ExcludeSettingWidget extends ListSettingWidget<IIncludeExcludeDataItem> {
	protected override getContainerClasses() {
		return ['setting-list-include-exclude-widget'];
	}

	protected override addDragAndDrop(rowElement: HTMLElement, item: IIncludeExcludeDataItem, idx: number) {
		return;
	}

	protected override addTooltipsToRow(rowElementGroup: RowElementGroup, item: IIncludeExcludeDataItem): void {
		let title = isUndefinedOrNull(item.sibling)
			? localize('excludePatternHintLabel', "Exclude files matching `{0}`", item.value.data)
			: localize('excludeSiblingHintLabel', "Exclude files matching `{0}`, only when a file matching `{1}` is present", item.value.data, item.sibling);

		if (item.source) {
			title += localize('excludeIncludeSource', ". Default value provided by `{0}`", item.source);
		}

		const markdownTitle = new MarkdownString().appendMarkdown(title);

		const { rowElement } = rowElementGroup;
		this.listDisposables.add(this.hoverService.setupDelayedHover(rowElement, { content: markdownTitle }));
		rowElement.setAttribute('aria-label', title);
	}

	protected override getLocalizedStrings() {
		return {
			deleteActionTooltip: localize('removeExcludeItem', "Remove Exclude Item"),
			editActionTooltip: localize('editExcludeItem', "Edit Exclude Item"),
			addButtonLabel: localize('addPattern', "Add Pattern"),
			inputPlaceholder: localize('excludePatternInputPlaceholder', "Exclude Pattern..."),
			siblingInputPlaceholder: localize('excludeSiblingInputPlaceholder', "When Pattern Is Present..."),
		};
	}
}

export class IncludeSettingWidget extends ListSettingWidget<IIncludeExcludeDataItem> {
	protected override getContainerClasses() {
		return ['setting-list-include-exclude-widget'];
	}

	protected override addDragAndDrop(rowElement: HTMLElement, item: IIncludeExcludeDataItem, idx: number) {
		return;
	}

	protected override addTooltipsToRow(rowElementGroup: RowElementGroup, item: IIncludeExcludeDataItem): void {
		let title = isUndefinedOrNull(item.sibling)
			? localize('includePatternHintLabel', "Include files matching `{0}`", item.value.data)
			: localize('includeSiblingHintLabel', "Include files matching `{0}`, only when a file matching `{1}` is present", item.value.data, item.sibling);

		if (item.source) {
			title += localize('excludeIncludeSource', ". Default value provided by `{0}`", item.source);
		}

		const markdownTitle = new MarkdownString().appendMarkdown(title);

		const { rowElement } = rowElementGroup;
		this.listDisposables.add(this.hoverService.setupDelayedHover(rowElement, { content: markdownTitle }));
		rowElement.setAttribute('aria-label', title);
	}

	protected override getLocalizedStrings() {
		return {
			deleteActionTooltip: localize('removeIncludeItem', "Remove Include Item"),
			editActionTooltip: localize('editIncludeItem', "Edit Include Item"),
			addButtonLabel: localize('addPattern', "Add Pattern"),
			inputPlaceholder: localize('includePatternInputPlaceholder', "Include Pattern..."),
			siblingInputPlaceholder: localize('includeSiblingInputPlaceholder', "When Pattern Is Present..."),
		};
	}
}

interface IObjectStringData {
	type: 'string';
	data: string;
}

export interface IObjectEnumOption {
	value: string;
	description?: string;
}

interface IObjectEnumData {
	type: 'enum';
	data: string;
	options: IObjectEnumOption[];
}

interface IObjectBoolData {
	type: 'boolean';
	data: boolean;
}

type ObjectKey = IObjectStringData | IObjectEnumData;
export type ObjectValue = IObjectStringData | IObjectEnumData | IObjectBoolData;
type ObjectWidget = InputBox | SelectBox;

export interface IObjectDataItem {
	key: ObjectKey;
	value: ObjectValue;
	keyDescription?: string;
	source?: string;
	removable: boolean;
	resetable: boolean;
}

export interface IIncludeExcludeDataItem {
	value: ObjectKey;
	elementType: SettingValueType;
	sibling?: string;
	source?: string;
}

export interface IObjectValueSuggester {
	(key: string): ObjectValue | undefined;
}

export interface IObjectKeySuggester {
	(existingKeys: string[], idx?: number): IObjectEnumData | undefined;
}

interface IObjectSetValueOptions {
	settingKey: string;
	showAddButton: boolean;
	isReadOnly?: boolean;
	keySuggester?: IObjectKeySuggester;
	valueSuggester?: IObjectValueSuggester;
}

interface IObjectRenderEditWidgetOptions {
	isKey: boolean;
	idx: number;
	readonly originalItem: IObjectDataItem;
	readonly changedItem: IObjectDataItem;
	update(keyOrValue: ObjectKey | ObjectValue): void;
}

export class ObjectSettingDropdownWidget extends AbstractListSettingWidget<IObjectDataItem> {
	private editable: boolean = true;
	private currentSettingKey: string = '';
	private showAddButton: boolean = true;
	private keySuggester: IObjectKeySuggester = () => undefined;
	private valueSuggester: IObjectValueSuggester = () => undefined;

	constructor(
		container: HTMLElement,
		@IThemeService themeService: IThemeService,
		@IContextViewService contextViewService: IContextViewService,
		@IHoverService private readonly hoverService: IHoverService,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super(container, themeService, contextViewService, configurationService);
	}

	override setValue(listData: IObjectDataItem[], options?: IObjectSetValueOptions): void {
		this.editable = !options?.isReadOnly;
		this.showAddButton = options?.showAddButton ?? this.showAddButton;
		this.keySuggester = options?.keySuggester ?? this.keySuggester;
		this.valueSuggester = options?.valueSuggester ?? this.valueSuggester;

		if (isDefined(options) && options.settingKey !== this.currentSettingKey) {
			this.model.setEditKey('none');
			this.model.select(null);
			this.currentSettingKey = options.settingKey;
		}

		super.setValue(listData);
	}

	override isItemNew(item: IObjectDataItem): boolean {
		return item.key.data === '' && item.value.data === '';
	}

	protected override isAddButtonVisible(): boolean {
		return this.showAddButton;
	}

	protected override get isReadOnly(): boolean {
		return !this.editable;
	}

	protected getEmptyItem(): IObjectDataItem {
		return {
			key: { type: 'string', data: '' },
			value: { type: 'string', data: '' },
			removable: true,
			resetable: false
		};
	}

	protected getContainerClasses() {
		return ['setting-list-object-widget'];
	}

	protected getActionsForItem(item: IObjectDataItem, idx: number): IAction[] {
		if (this.isReadOnly) {
			return [];
		}

		const actions: IAction[] = [
			{
				class: ThemeIcon.asClassName(settingsEditIcon),
				enabled: true,
				id: 'workbench.action.editListItem',
				label: '',
				tooltip: this.getLocalizedStrings().editActionTooltip,
				run: () => this.editSetting(idx)
			},
		];

		if (item.resetable) {
			actions.push({
				class: ThemeIcon.asClassName(settingsDiscardIcon),
				enabled: true,
				id: 'workbench.action.resetListItem',
				label: '',
				tooltip: this.getLocalizedStrings().resetActionTooltip,
				run: () => this._onDidChangeList.fire({ type: 'reset', originalItem: item, targetIndex: idx })
			});
		}

		if (item.removable) {
			actions.push({
				class: ThemeIcon.asClassName(settingsRemoveIcon),
				enabled: true,
				id: 'workbench.action.removeListItem',
				label: '',
				tooltip: this.getLocalizedStrings().deleteActionTooltip,
				run: () => this._onDidChangeList.fire({ type: 'remove', originalItem: item, targetIndex: idx })
			});
		}

		return actions;
	}

	protected override renderHeader() {
		const header = $('.setting-list-row-header');
		const keyHeader = DOM.append(header, $('.setting-list-object-key'));
		const valueHeader = DOM.append(header, $('.setting-list-object-value'));
		const { keyHeaderText, valueHeaderText } = this.getLocalizedStrings();

		keyHeader.textContent = keyHeaderText;
		valueHeader.textContent = valueHeaderText;

		return header;
	}

	protected renderItem(item: IObjectDataItem, idx: number): RowElementGroup {
		const rowElement = $('.setting-list-row');
		rowElement.classList.add('setting-list-object-row');

		const keyElement = DOM.append(rowElement, $('.setting-list-object-key'));
		const valueElement = DOM.append(rowElement, $('.setting-list-object-value'));

		keyElement.textContent = item.key.data;
		valueElement.textContent = item.value.data.toString();

		return { rowElement, keyElement, valueElement };
	}

	protected renderEdit(item: IObjectDataItem, idx: number): HTMLElement {
		const rowElement = $('.setting-list-edit-row.setting-list-object-row');

		const changedItem = { ...item };
		const onKeyChange = (key: ObjectKey) => {
			changedItem.key = key;
			okButton.enabled = key.data !== '';

			const suggestedValue = this.valueSuggester(key.data) ?? item.value;

			if (this.shouldUseSuggestion(item.value, changedItem.value, suggestedValue)) {
				onValueChange(suggestedValue);
				renderLatestValue();
			}
		};
		const onValueChange = (value: ObjectValue) => {
			changedItem.value = value;
		};

		let keyWidget: ObjectWidget | undefined;
		let keyElement: HTMLElement;

		if (this.showAddButton) {
			if (this.isItemNew(item)) {
				const suggestedKey = this.keySuggester(this.model.items.map(({ key: { data } }) => data));

				if (isDefined(suggestedKey)) {
					changedItem.key = suggestedKey;
					const suggestedValue = this.valueSuggester(changedItem.key.data);
					onValueChange(suggestedValue ?? changedItem.value);
				}
			}

			const { widget, element } = this.renderEditWidget(changedItem.key, {
				idx,
				isKey: true,
				originalItem: item,
				changedItem,
				update: onKeyChange,
			});
			keyWidget = widget;
			keyElement = element;
		} else {
			keyElement = $('.setting-list-object-key');
			keyElement.textContent = item.key.data;
		}

		let valueWidget: ObjectWidget;
		const valueContainer = $('.setting-list-object-value-container');

		const renderLatestValue = () => {
			const { widget, element } = this.renderEditWidget(changedItem.value, {
				idx,
				isKey: false,
				originalItem: item,
				changedItem,
				update: onValueChange,
			});

			valueWidget = widget;

			DOM.clearNode(valueContainer);
			valueContainer.append(element);
		};

		renderLatestValue();

		rowElement.append(keyElement, valueContainer);

		const okButton = this.listDisposables.add(new Button(rowElement, defaultButtonStyles));
		okButton.enabled = changedItem.key.data !== '';
		okButton.label = localize('okButton', "OK");
		okButton.element.classList.add('setting-list-ok-button');

		this.listDisposables.add(okButton.onDidClick(() => this.handleItemChange(item, changedItem, idx)));

		const cancelButton = this.listDisposables.add(new Button(rowElement, { secondary: true, ...defaultButtonStyles }));
		cancelButton.label = localize('cancelButton', "Cancel");
		cancelButton.element.classList.add('setting-list-cancel-button');

		this.listDisposables.add(cancelButton.onDidClick(() => this.cancelEdit()));

		this.listDisposables.add(
			disposableTimeout(() => {
				const widget = keyWidget ?? valueWidget;

				widget.focus();

				if (widget instanceof InputBox) {
					widget.select();
				}
			})
		);

		return rowElement;
	}

	private renderEditWidget(
		keyOrValue: ObjectKey | ObjectValue,
		options: IObjectRenderEditWidgetOptions,
	) {
		switch (keyOrValue.type) {
			case 'string':
				return this.renderStringEditWidget(keyOrValue, options);
			case 'enum':
				return this.renderEnumEditWidget(keyOrValue, options);
			case 'boolean':
				return this.renderEnumEditWidget(
					{
						type: 'enum',
						data: keyOrValue.data.toString(),
						options: [{ value: 'true' }, { value: 'false' }],
					},
					options,
				);
		}
	}

	private renderStringEditWidget(
		keyOrValue: IObjectStringData,
		{ idx, isKey, originalItem, changedItem, update }: IObjectRenderEditWidgetOptions,
	) {
		const wrapper = $(isKey ? '.setting-list-object-input-key' : '.setting-list-object-input-value');
		const inputBox = new InputBox(wrapper, this.contextViewService, {
			placeholder: isKey
				? localize('objectKeyInputPlaceholder', "Key")
				: localize('objectValueInputPlaceholder', "Value"),
			inputBoxStyles: getInputBoxStyle({
				inputBackground: settingsTextInputBackground,
				inputForeground: settingsTextInputForeground,
				inputBorder: settingsTextInputBorder
			})
		});

		inputBox.element.classList.add('setting-list-object-input');

		this.listDisposables.add(inputBox);
		inputBox.value = keyOrValue.data;

		this.listDisposables.add(inputBox.onDidChange(value => update({ ...keyOrValue, data: value })));

		const onKeyDown = (e: StandardKeyboardEvent) => {
			if (e.equals(KeyCode.Enter)) {
				this.handleItemChange(originalItem, changedItem, idx);
			} else if (e.equals(KeyCode.Escape)) {
				this.cancelEdit();
				e.preventDefault();
			}
		};

		this.listDisposables.add(
			DOM.addStandardDisposableListener(inputBox.inputElement, DOM.EventType.KEY_DOWN, onKeyDown)
		);

		return { widget: inputBox, element: wrapper };
	}

	private renderEnumEditWidget(
		keyOrValue: IObjectEnumData,
		{ isKey, changedItem, update }: IObjectRenderEditWidgetOptions,
	) {
		const selectBox = this.createBasicSelectBox(keyOrValue);

		const changedKeyOrValue = isKey ? changedItem.key : changedItem.value;
		this.listDisposables.add(
			selectBox.onDidSelect(({ selected }) =>
				update(
					changedKeyOrValue.type === 'boolean'
						? { ...changedKeyOrValue, data: selected === 'true' ? true : false }
						: { ...changedKeyOrValue, data: selected },
				)
			)
		);

		const wrapper = $('.setting-list-object-input');
		wrapper.classList.add(
			isKey ? 'setting-list-object-input-key' : 'setting-list-object-input-value',
		);

		selectBox.render(wrapper);

		// Switch to the first item if the user set something invalid in the json
		const selected = keyOrValue.options.findIndex(option => keyOrValue.data === option.value);
		if (selected === -1 && keyOrValue.options.length) {
			update(
				changedKeyOrValue.type === 'boolean'
					? { ...changedKeyOrValue, data: true }
					: { ...changedKeyOrValue, data: keyOrValue.options[0].value }
			);
		} else if (changedKeyOrValue.type === 'boolean') {
			// https://github.com/microsoft/vscode/issues/129581
			update({ ...changedKeyOrValue, data: keyOrValue.data === 'true' });
		}

		return { widget: selectBox, element: wrapper };
	}

	private shouldUseSuggestion(originalValue: ObjectValue, previousValue: ObjectValue, newValue: ObjectValue): boolean {
		// suggestion is exactly the same
		if (newValue.type !== 'enum' && newValue.type === previousValue.type && newValue.data === previousValue.data) {
			return false;
		}

		// item is new, use suggestion
		if (originalValue.data === '') {
			return true;
		}

		if (previousValue.type === newValue.type && newValue.type !== 'enum') {
			return false;
		}

		// check if all enum options are the same
		if (previousValue.type === 'enum' && newValue.type === 'enum') {
			const previousEnums = new Set(previousValue.options.map(({ value }) => value));
			newValue.options.forEach(({ value }) => previousEnums.delete(value));

			// all options are the same
			if (previousEnums.size === 0) {
				return false;
			}
		}

		return true;
	}

	protected addTooltipsToRow(rowElementGroup: RowElementGroup, item: IObjectDataItem): void {
		const { keyElement, valueElement, rowElement } = rowElementGroup;

		let accessibleDescription;
		if (item.source) {
			accessibleDescription = localize('objectPairHintLabelWithSource', "The property `{0}` is set to `{1}` by `{2}`.", item.key.data, item.value.data, item.source);
		} else {
			accessibleDescription = localize('objectPairHintLabel', "The property `{0}` is set to `{1}`.", item.key.data, item.value.data);
		}

		const markdownString = new MarkdownString().appendMarkdown(accessibleDescription);

		const keyDescription: string | MarkdownString = this.getEnumDescription(item.key) ?? item.keyDescription ?? markdownString;
		this.listDisposables.add(this.hoverService.setupDelayedHover(keyElement, { content: keyDescription }));

		const valueDescription: string | MarkdownString = this.getEnumDescription(item.value) ?? markdownString;
		this.listDisposables.add(this.hoverService.setupDelayedHover(valueElement!, { content: valueDescription }));

		rowElement.setAttribute('aria-label', accessibleDescription);
	}

	private getEnumDescription(keyOrValue: ObjectKey | ObjectValue): string | undefined {
		const enumDescription = keyOrValue.type === 'enum'
			? keyOrValue.options.find(({ value }) => keyOrValue.data === value)?.description
			: undefined;
		return enumDescription;
	}

	protected getLocalizedStrings() {
		return {
			deleteActionTooltip: localize('removeItem', "Remove Item"),
			resetActionTooltip: localize('resetItem', "Reset Item"),
			editActionTooltip: localize('editItem', "Edit Item"),
			addButtonLabel: localize('addItem', "Add Item"),
			keyHeaderText: localize('objectKeyHeader', "Item"),
			valueHeaderText: localize('objectValueHeader', "Value"),
		};
	}
}

interface IBoolObjectSetValueOptions {
	settingKey: string;
}

export interface IBoolObjectDataItem {
	key: IObjectStringData;
	value: IObjectBoolData;
	keyDescription?: string;
	source?: string;
	removable: false;
	resetable: boolean;
}

export class ObjectSettingCheckboxWidget extends AbstractListSettingWidget<IBoolObjectDataItem> {
	private currentSettingKey: string = '';

	constructor(
		container: HTMLElement,
		@IThemeService themeService: IThemeService,
		@IContextViewService contextViewService: IContextViewService,
		@IHoverService private readonly hoverService: IHoverService,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super(container, themeService, contextViewService, configurationService);
	}

	override setValue(listData: IBoolObjectDataItem[], options?: IBoolObjectSetValueOptions): void {
		if (isDefined(options) && options.settingKey !== this.currentSettingKey) {
			this.model.setEditKey('none');
			this.model.select(null);
			this.currentSettingKey = options.settingKey;
		}

		super.setValue(listData);
	}

	override isItemNew(item: IBoolObjectDataItem): boolean {
		return !item.key.data && !item.value.data;
	}

	protected getEmptyItem(): IBoolObjectDataItem {
		return {
			key: { type: 'string', data: '' },
			value: { type: 'boolean', data: false },
			removable: false,
			resetable: true
		};
	}

	protected getContainerClasses() {
		return ['setting-list-object-widget'];
	}

	protected getActionsForItem(item: IBoolObjectDataItem, idx: number): IAction[] {
		return [];
	}

	protected override isAddButtonVisible(): boolean {
		return false;
	}

	protected override renderHeader() {
		return undefined;
	}

	protected override renderDataOrEditItem(item: IListViewItem<IBoolObjectDataItem>, idx: number, listFocused: boolean): HTMLElement {
		const rowElement = this.renderEdit(item, idx);
		rowElement.setAttribute('role', 'listitem');
		return rowElement;
	}

	protected renderItem(item: IBoolObjectDataItem, idx: number): RowElementGroup {
		// Return just the containers, since we always render in edit mode anyway
		const rowElement = $('.blank-row');
		const keyElement = $('.blank-row-key');
		return { rowElement, keyElement };
	}

	protected renderEdit(item: IBoolObjectDataItem, idx: number): HTMLElement {
		const rowElement = $('.setting-list-edit-row.setting-list-object-row.setting-item-bool');

		const changedItem = { ...item };
		const onValueChange = (newValue: boolean) => {
			changedItem.value.data = newValue;
			this.handleItemChange(item, changedItem, idx);
		};
		const checkboxDescription = item.keyDescription ? `${item.keyDescription} (${item.key.data})` : item.key.data;
		const { element, widget: checkbox } = this.renderEditWidget((changedItem.value as IObjectBoolData).data, checkboxDescription, onValueChange);
		rowElement.appendChild(element);

		const valueElement = DOM.append(rowElement, $('.setting-list-object-value'));
		valueElement.textContent = checkboxDescription;

		// We add the tooltips here, because the method is not called by default
		// for widgets in edit mode
		const rowElementGroup = { rowElement, keyElement: valueElement, valueElement: checkbox.domNode };
		this.addTooltipsToRow(rowElementGroup, item);

		this._register(DOM.addDisposableListener(valueElement, DOM.EventType.MOUSE_DOWN, e => {
			const targetElement = <HTMLElement>e.target;
			if (targetElement.tagName.toLowerCase() !== 'a') {
				checkbox.checked = !checkbox.checked;
				onValueChange(checkbox.checked);
			}
			DOM.EventHelper.stop(e);
		}));

		return rowElement;
	}

	private renderEditWidget(
		value: boolean,
		checkboxDescription: string,
		onValueChange: (newValue: boolean) => void
	) {
		const checkbox = new Toggle({
			icon: Codicon.check,
			actionClassName: 'setting-value-checkbox',
			isChecked: value,
			title: checkboxDescription,
			...unthemedToggleStyles
		});

		this.listDisposables.add(checkbox);

		const wrapper = $('.setting-list-object-input');
		wrapper.classList.add('setting-list-object-input-key-checkbox');
		checkbox.domNode.classList.add('setting-value-checkbox');
		wrapper.appendChild(checkbox.domNode);

		this._register(DOM.addDisposableListener(wrapper, DOM.EventType.MOUSE_DOWN, e => {
			checkbox.checked = !checkbox.checked;
			onValueChange(checkbox.checked);

			// Without this line, the settings editor assumes
			// we lost focus on this setting completely.
			e.stopImmediatePropagation();
		}));

		return { widget: checkbox, element: wrapper };
	}

	protected addTooltipsToRow(rowElementGroup: RowElementGroup, item: IBoolObjectDataItem): void {
		const accessibleDescription = localize('objectPairHintLabel', "The property `{0}` is set to `{1}`.", item.key.data, item.value.data);
		const title = item.keyDescription ?? accessibleDescription;
		const { rowElement, keyElement, valueElement } = rowElementGroup;

		this.listDisposables.add(this.hoverService.setupDelayedHover(keyElement, { content: title }));
		valueElement!.setAttribute('aria-label', accessibleDescription);
		rowElement.setAttribute('aria-label', accessibleDescription);
	}

	protected getLocalizedStrings() {
		return {
			deleteActionTooltip: localize('removeItem', "Remove Item"),
			resetActionTooltip: localize('resetItem', "Reset Item"),
			editActionTooltip: localize('editItem', "Edit Item"),
			addButtonLabel: localize('addItem', "Add Item"),
			keyHeaderText: localize('objectKeyHeader', "Item"),
			valueHeaderText: localize('objectValueHeader', "Value"),
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/browser/tocTree.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/tocTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../base/browser/dom.js';
import * as domStylesheetsJs from '../../../../base/browser/domStylesheets.js';
import { IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { DefaultStyleController, IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { RenderIndentGuides } from '../../../../base/browser/ui/tree/abstractTree.js';
import { ITreeElement, ITreeNode, ITreeRenderer } from '../../../../base/browser/ui/tree/tree.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IListService, IWorkbenchObjectTreeOptions, WorkbenchObjectTree } from '../../../../platform/list/browser/listService.js';
import { getListStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { editorBackground, focusBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { settingsHeaderForeground, settingsHeaderHoverForeground } from '../common/settingsEditorColorRegistry.js';
import { SettingsTreeFilter } from './settingsTree.js';
import { ISettingsEditorViewState, SearchResultModel, SettingsTreeElement, SettingsTreeGroupElement, SettingsTreeSettingElement } from './settingsTreeModels.js';

const $ = DOM.$;

export class TOCTreeModel {

	private _currentSearchModel: SearchResultModel | null = null;
	private _settingsTreeRoot!: SettingsTreeGroupElement;

	constructor(
		private _viewState: ISettingsEditorViewState,
		@IWorkbenchEnvironmentService private environmentService: IWorkbenchEnvironmentService
	) {
	}

	get settingsTreeRoot(): SettingsTreeGroupElement {
		return this._settingsTreeRoot;
	}

	set settingsTreeRoot(value: SettingsTreeGroupElement) {
		this._settingsTreeRoot = value;
		this.update();
	}

	get currentSearchModel(): SearchResultModel | null {
		return this._currentSearchModel;
	}

	set currentSearchModel(model: SearchResultModel | null) {
		this._currentSearchModel = model;
		this.update();
	}

	get children(): SettingsTreeElement[] {
		return this._settingsTreeRoot.children;
	}

	update(): void {
		if (this._settingsTreeRoot) {
			this.updateGroupCount(this._settingsTreeRoot);
		}
	}

	private updateGroupCount(group: SettingsTreeGroupElement): void {
		group.children.forEach(child => {
			if (child instanceof SettingsTreeGroupElement) {
				this.updateGroupCount(child);
			}
		});

		const childCount = group.children
			.filter(child => child instanceof SettingsTreeGroupElement)
			.reduce((acc, cur) => acc + (<SettingsTreeGroupElement>cur).count!, 0);

		group.count = childCount + this.getGroupCount(group);
	}

	private getGroupCount(group: SettingsTreeGroupElement): number {
		return group.children.filter(child => {
			if (!(child instanceof SettingsTreeSettingElement)) {
				return false;
			}

			if (this._currentSearchModel && !this._currentSearchModel.root.containsSetting(child.setting.key)) {
				return false;
			}

			// Check everything that the SettingsFilter checks except whether it's filtered by a category
			const isRemote = !!this.environmentService.remoteAuthority;
			return child.matchesScope(this._viewState.settingsTarget, isRemote) &&
				child.matchesAllTags(this._viewState.tagFilters) &&
				child.matchesAnyFeature(this._viewState.featureFilters) &&
				child.matchesAnyExtension(this._viewState.extensionFilters) &&
				child.matchesAnyId(this._viewState.idFilters);
		}).length;
	}
}

const TOC_ENTRY_TEMPLATE_ID = 'settings.toc.entry';

interface ITOCEntryTemplate {
	labelElement: HTMLElement;
	countElement: HTMLElement;
	elementDisposables: DisposableStore;
}

export class TOCRenderer implements ITreeRenderer<SettingsTreeGroupElement, never, ITOCEntryTemplate> {

	templateId = TOC_ENTRY_TEMPLATE_ID;

	constructor(private readonly _hoverService: IHoverService) {
	}

	renderTemplate(container: HTMLElement): ITOCEntryTemplate {
		return {
			labelElement: DOM.append(container, $('.settings-toc-entry')),
			countElement: DOM.append(container, $('.settings-toc-count')),
			elementDisposables: new DisposableStore()
		};
	}

	renderElement(node: ITreeNode<SettingsTreeGroupElement>, index: number, template: ITOCEntryTemplate): void {
		template.elementDisposables.clear();

		const element = node.element;
		const count = element.count;
		const label = element.label;

		template.labelElement.textContent = label;
		template.elementDisposables.add(this._hoverService.setupDelayedHover(template.labelElement, { content: label }));

		if (count) {
			template.countElement.textContent = ` (${count})`;
		} else {
			template.countElement.textContent = '';
		}
	}

	disposeTemplate(templateData: ITOCEntryTemplate): void {
		templateData.elementDisposables.dispose();
	}
}

class TOCTreeDelegate implements IListVirtualDelegate<SettingsTreeElement> {
	getTemplateId(element: SettingsTreeElement): string {
		return TOC_ENTRY_TEMPLATE_ID;
	}

	getHeight(element: SettingsTreeElement): number {
		return 22;
	}
}

export function createTOCIterator(model: TOCTreeModel | SettingsTreeGroupElement, tree: TOCTree): Iterable<ITreeElement<SettingsTreeGroupElement>> {
	const groupChildren = <SettingsTreeGroupElement[]>model.children.filter(c => c instanceof SettingsTreeGroupElement);

	return Iterable.map(groupChildren, g => {
		const hasGroupChildren = g.children.some(c => c instanceof SettingsTreeGroupElement);

		return {
			element: g,
			collapsed: undefined,
			collapsible: hasGroupChildren,
			children: g instanceof SettingsTreeGroupElement ?
				createTOCIterator(g, tree) :
				undefined
		};
	});
}

class SettingsAccessibilityProvider implements IListAccessibilityProvider<SettingsTreeGroupElement> {
	getWidgetAriaLabel(): string {
		return localize({
			key: 'settingsTOC',
			comment: ['A label for the table of contents for the full settings list']
		},
			"Settings Table of Contents");
	}

	getAriaLabel(element: SettingsTreeElement): string {
		if (!element) {
			return '';
		}

		if (element instanceof SettingsTreeGroupElement) {
			return localize('groupRowAriaLabel', "{0}, group", element.label);
		}

		return '';
	}

	getAriaLevel(element: SettingsTreeGroupElement): number {
		let i = 1;
		while (element instanceof SettingsTreeGroupElement && element.parent) {
			i++;
			element = element.parent;
		}

		return i;
	}
}

export class TOCTree extends WorkbenchObjectTree<SettingsTreeGroupElement> {
	constructor(
		container: HTMLElement,
		viewState: ISettingsEditorViewState,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IListService listService: IListService,
		@IConfigurationService configurationService: IConfigurationService,
		@IHoverService hoverService: IHoverService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		// test open mode

		const filter = instantiationService.createInstance(SettingsTreeFilter, viewState);
		const options: IWorkbenchObjectTreeOptions<SettingsTreeGroupElement, void> = {
			filter,
			multipleSelectionSupport: false,
			identityProvider: {
				getId(e) {
					return e.id;
				}
			},
			styleController: id => new DefaultStyleController(domStylesheetsJs.createStyleSheet(container), id),
			accessibilityProvider: instantiationService.createInstance(SettingsAccessibilityProvider),
			collapseByDefault: true,
			horizontalScrolling: false,
			hideTwistiesOfChildlessElements: true,
			renderIndentGuides: RenderIndentGuides.None
		};

		super(
			'SettingsTOC',
			container,
			new TOCTreeDelegate(),
			[new TOCRenderer(hoverService)],
			options,
			instantiationService,
			contextKeyService,
			listService,
			configurationService,
		);

		this.style(getListStyles({
			listBackground: editorBackground,
			listFocusOutline: focusBorder,
			listActiveSelectionBackground: editorBackground,
			listActiveSelectionForeground: settingsHeaderForeground,
			listFocusAndSelectionBackground: editorBackground,
			listFocusAndSelectionForeground: settingsHeaderForeground,
			listFocusBackground: editorBackground,
			listFocusForeground: settingsHeaderHoverForeground,
			listHoverForeground: settingsHeaderHoverForeground,
			listHoverBackground: editorBackground,
			listInactiveSelectionBackground: editorBackground,
			listInactiveSelectionForeground: settingsHeaderForeground,
			listInactiveFocusBackground: editorBackground,
			listInactiveFocusOutline: editorBackground,
			treeIndentGuidesStroke: undefined,
			treeInactiveIndentGuidesStroke: undefined
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/browser/media/keybindings.css]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/media/keybindings.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.defineKeybindingWidget {
	padding: 10px;
	position: absolute;
}

.defineKeybindingWidget .message {
	width: 400px;
	text-align: center;
}

.defineKeybindingWidget .monaco-inputbox,
.defineKeybindingWidget .output,
.defineKeybindingWidget .existing {
	margin-top:10px;
	width: 400px;
	display: block;
	text-align: center;
}

.defineKeybindingWidget .input {
	text-align: center;
}

.defineKeybindingWidget .output {
	display: flex;
	justify-content: center;
}

.defineKeybindingWidget .existing .existingText {
	text-decoration: underline;
	cursor: pointer;
}

.defineKeybindingWidget .output .monaco-keybinding {
	margin: 0px 4px;
}

/* Editor decorations */
.monaco-editor .keybindingInfo {
	box-shadow:	inset 0 0 0 1px #B9B9B9;
	background-color: rgba(100, 100, 250, 0.2);
}

.monaco-editor .keybindingError {
	box-shadow:	inset 0 0 0 1px #B9B9B9;
	background-color: rgba(250, 100, 100, 0.2);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/browser/media/keybindingsEditor.css]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/media/keybindingsEditor.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.keybindings-editor {
	padding: 11px 0px 0px 27px;
}

.keybindings-overflow-widgets-container {
	position: absolute;
	top: 0;
	left: 0;
	width: 0;
	height: 0;
	overflow: visible;
	z-index: 5000;
}

/* header styling */

.keybindings-editor > .keybindings-header {
	padding: 0px 10px 11px 0;
}

.keybindings-editor > .keybindings-header > .search-container {
	position: relative;
}

.keybindings-editor > .keybindings-header > .search-container > .keybindings-search-actions-container {
	position: absolute;
	top: 0;
	right: 10px;
	margin-top: 4px;
	display: flex;
}

.keybindings-editor > .keybindings-header > .search-container > .keybindings-search-actions-container > .recording-badge {
	margin-right: 8px;
	padding: 4px;
}

.keybindings-editor > .keybindings-header.small > .search-container > .keybindings-search-actions-container > .recording-badge,
.keybindings-editor > .keybindings-header > .search-container > .keybindings-search-actions-container > .recording-badge.disabled {
	display: none;
}

.keybindings-editor > .keybindings-header > .search-container > .keybindings-search-actions-container .monaco-action-bar .action-item > .icon {
	width:16px;
	height: 18px;
}

.keybindings-editor > .keybindings-header > .search-container > .keybindings-search-actions-container .monaco-action-bar .action-item {
	margin-right: 4px;
}
.keybindings-editor .monaco-action-bar .action-item .monaco-custom-toggle {
	margin: 0;
	padding: 2px;
}

.keybindings-editor .monaco-action-bar .action-item > .codicon {
	display: flex;
	align-items: center;
	justify-content: center;
	color: inherit;
	box-sizing: content-box;
}

.keybindings-editor > .keybindings-header .open-keybindings-container {
	margin-top: 10px;
	display: flex;
}

.keybindings-editor > .keybindings-header .open-keybindings-container > div {
	opacity: 0.7;
}

.keybindings-editor > .keybindings-header .open-keybindings-container > .file-name {
	text-decoration: underline;
	cursor: pointer;
	margin-left: 4px;
}

.keybindings-editor > .keybindings-header .open-keybindings-container > .file-name:focus {
	opacity: 1;
}

/** Table styling **/

.keybindings-editor > .keybindings-body .keybindings-table-container {
	width: 100%;
	border-spacing: 0;
	border-collapse: separate;
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr {
	cursor: default;
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td {
	align-items: center;
	display: flex;
	overflow: hidden;
}

/** Actions column styling **/

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .actions .monaco-action-bar {
	display: none;
	flex: 1;
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-list-row.selected .monaco-table-tr .monaco-table-td .actions .monaco-action-bar,
.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table.focused .monaco-list-row.focused .monaco-table-tr .monaco-table-td .actions .monaco-action-bar,
.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-list-row:hover .monaco-table-tr .monaco-table-td .actions .monaco-action-bar {
	display: flex;
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .monaco-action-bar .action-item > .icon {
	width:16px;
	height: 16px;
	cursor: pointer;
	margin-top: 3px;
}

/** Command column styling **/

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .command.vertical-align-column {
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .command .command-default-label {
	opacity: 0.8;
	margin-top: 2px;
}

/** Keybinding column styling **/

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .keybinding .monaco-highlighted-label {
	padding-left: 10px;
}

/** When column styling **/

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .when {
	width: 100%;
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .when .empty {
	padding-left: 4px;
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .when.input-mode .when-label {
	display: none;
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .when .suggest-input-container {
	padding-left: 10px;
}

/** Source column styling **/
.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .source a {
	cursor: pointer;
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-list-row:not(.focused):not(.selected) .monaco-table-tr .monaco-table-td .source a {
	color: var(--vscode-textLink-foreground);
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .source a:hover {
	text-decoration: underline;
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-list-row:not(.focused):not(.selected) .monaco-table-tr .monaco-table-td .source a:hover {
	color: var(--vscode-textLink-activeForeground);
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-list-row:not(.focused):not(.selected) .monaco-table-tr .monaco-table-td .source a:active {
	color: var(--vscode-textLink-activeForeground);
}

/** columns styling **/

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .command,
.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .command > .command-label,
.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .command > .command-default-label,
.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .command > .command-id-label,
.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .command .monaco-highlighted-label,
.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .source .monaco-highlighted-label,
.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .when .monaco-highlighted-label {
	overflow: hidden;
	text-overflow: ellipsis;
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .hide {
	display: none;
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .code {
	font-family: var(--monaco-monospace-font);
	font-size: 90%;
	display: flex;
	overflow: hidden;
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .code.strong {
	padding: 1px 4px;
	background-color: rgba(128, 128, 128, 0.17);
	border-radius: 4px;
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-tr .monaco-table-td .highlight {
	font-weight: bold;
	color: var(--vscode-list-highlightForeground);
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table.focused .monaco-list-row.selected .monaco-table-td .highlight,
.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table.focused .monaco-list-row.selected.focused .monaco-table-td .highlight {
	color: inherit;
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table .monaco-list-row.selected .monaco-table-tr .monaco-table-td .monaco-keybinding-key,
.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table .monaco-list-row.selected.focused .monaco-table-tr .monaco-table-td .monaco-keybinding-key {
	color: var(--vscode-list-inactiveSelectionForeground);
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table .monaco-list-row.focused .monaco-table-tr .monaco-table-td .monaco-keybinding-key {
	color: var(--vscode-list-focusForeground);
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table.focused .monaco-list-row.selected .monaco-table-tr .monaco-table-td .monaco-keybinding-key {
	color: var(--vscode-list-activeSelectionForeground);
	border-color: var(--vscode-widget-shadow) !important;
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table .monaco-list-row:hover:not(.selected):not(.focused) .monaco-table-tr .monaco-table-td .monaco-keybinding-key {
	color: var(--vscode-list-hoverForeground);
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table .monaco-list-row[data-parity=odd]:not(.focused):not(.selected):not(:hover) .monaco-table-tr,
.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table .monaco-list:not(:focus) .monaco-list-row[data-parity=odd].focused:not(.selected):not(:hover) .monaco-table-tr,
.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table .monaco-list:not(.focused) .monaco-list-row[data-parity=odd].focused:not(.selected):not(:hover) .monaco-table-tr {
	background-color: var(--vscode-keybindingTable-rowsBackground);
}

.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table-th {
	background-color: var(--vscode-keybindingTable-headerBackground);
}

.keybindings-editor .monaco-table-th,
.keybindings-editor .monaco-table-td {
	padding-left: 10px;
}

.keybindings-editor .monaco-table-th[data-col-index="0"],
.keybindings-editor .monaco-table-td[data-col-index="0"] {
	padding-left: 20px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/browser/media/preferencesEditor.css]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/media/preferencesEditor.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.preferences-editor {

	height: 100%;
	overflow: hidden;
	max-width: 1200px;
	margin: auto;

	.preferences-editor-header {
		box-sizing: border-box;
		margin: auto;
		overflow: hidden;
		margin-top: 11px;
		padding-top: 3px;
		padding-left: 24px;
		padding-right: 24px;
		max-width: 1200px;

		.search-container {
			position: relative;

			.suggest-input-container {
				border: 1px solid #ddd;
			}
		}

		.preferences-tabs-container {
			height: 32px;
			display: flex;
			border-bottom: solid 1px;
			margin-top: 10px;
			border-color: var(--vscode-settings-headerBorder);

			.action-item {
				max-width: 300px;
				overflow: hidden;
				text-overflow: ellipsis;

				.action-title {
					text-overflow: ellipsis;
					overflow: hidden;
				}

				.action-details {
					opacity: 0.9;
					text-transform: none;
					margin-left: 0.5em;
					font-size: 10px;
				}

				.action-label {
					font-size: 13px;
					padding: 7px 8px 6.5px 8px;
					opacity: 0.9;
					border-radius: 0;
					color: var(--vscode-foreground);
					overflow: hidden;
					text-overflow: ellipsis;
					background: none !important;
					color: var(--vscode-panelTitle-inactiveForeground);
				}

				.action-label.checked {
					opacity: 1;
					color: var(--vscode-settings-headerForeground);
					border-bottom: 1px solid var(--vscode-panelTitle-activeBorder);
					outline: 1px solid var(--vscode-contrastActiveBorder, transparent);
					outline-offset: -1px;
				}

				.action-label:hover {
					color: var(--vscode-panelTitle-activeForeground);
					border-bottom: 1px solid var(--vscode-panelTitle-activeBorder);
					outline: 1px solid var(--vscode-contrastActiveBorder, transparent);
					outline-offset: -1px;
				}

				.action-label:focus {
					border-bottom: 1px solid var(--vscode-focusBorder);
					outline: 1px solid transparent;
					outline-offset: -1px;
				}

				.action-label.checked:not(:focus) {
					border-bottom-color: var(--vscode-settings-headerForeground);
				}

				.action-label:not(.checked):not(:focus) {
					/* Still maintain a border for alignment, but keep it transparent */
					border-bottom: 1px solid transparent;
				}

				.action-label:not(.checked):hover {
					outline-style: dashed;
				}
			}

		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/browser/media/settingsEditor2.css]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/media/settingsEditor2.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.editor-instance#workbench\.editor\.settings2:focus {
	outline: none;
}

.settings-editor {
	height: 100%;
	overflow: hidden;
	max-width: 1200px;
	margin: auto;
}

.settings-editor:focus {
	outline: none !important;
}

/* header styling */
.settings-editor > .settings-header {
	box-sizing: border-box;
	margin: auto;
	overflow: hidden;
	margin-top: 11px;
	padding-top: 3px;
	padding-left: 24px;
	padding-right: 24px;
	max-width: 1200px;
}

.settings-editor > .settings-header > .search-container {
	position: relative;
}

.monaco-workbench.vs .settings-editor > .settings-header > .search-container > .suggest-input-container {
	border: 1px solid #ddd;
}

.settings-editor > .settings-header > .search-container > .search-container-widgets {
	display: flex;
	align-items: center;
	position: absolute;
	top: 0;
	right: 0;
	height: 100%;
	margin-right: 1px;
}

.settings-editor > .settings-header > .search-container > .search-container-widgets .action-label {
	padding: 3px;
	margin-left: 0px;
	box-sizing: content-box;
}

.settings-editor > .settings-header > .search-container > .search-container-widgets .action-label.monaco-custom-toggle {
	/* To offset the border width. */
	padding: 2.3px;
}

.settings-editor > .settings-header > .search-container > .search-container-widgets > .settings-count-widget {
	margin-right: 3px;
	padding-bottom: 3px;
}

.settings-editor > .settings-header > .search-container > .search-container-widgets > .settings-count-widget:empty {
	visibility: hidden;
}

.settings-editor > .settings-header > .settings-header-controls {
	display: flex;
	flex-wrap: wrap;
	border-bottom: solid 1px;
	margin-top: 10px;
}

.settings-editor > .settings-header > .settings-header-controls .settings-suggestions {
	flex: 0 0 100%;
	width: 100%;
	min-height: 20px;
	margin-bottom: 9px;
}

.settings-editor > .settings-header > .settings-header-controls .settings-suggestions a {
	color: var(--vscode-badge-foreground);
	background: var(--vscode-badge-background);
	cursor: pointer;
	margin-right: 4px;
	padding: 0px 4px 2px;
	border-radius: 4px;
}

.settings-editor > .settings-header > .settings-header-controls .settings-target-container {
	flex: auto;
}

.settings-editor > .settings-header > .settings-header-controls .settings-tabs-widget .action-label {
	opacity: 0.9;
	border-radius: 0;
	color: var(--vscode-foreground);
}

.settings-editor > .settings-header > .settings-header-controls .last-synced-label {
	padding-top: 7px;
	opacity: 0.9;
}

.settings-editor .settings-tabs-widget > .monaco-action-bar .action-item .action-details {
	opacity: 0.9;
}

.settings-editor > .settings-header > .settings-header-controls .settings-tabs-widget .action-label:hover {
	opacity: 1;
}

.settings-editor > .settings-header > .settings-header-controls .settings-tabs-widget .action-label.checked {
	opacity: 1;
	color: var(--vscode-settings-headerForeground);
}
.settings-editor > .settings-header > .settings-header-controls .settings-tabs-widget .action-label.checked:not(:focus) {
	border-bottom-color: var(--vscode-settings-headerForeground);
}

.settings-editor > .settings-header .settings-tabs-widget > .monaco-action-bar .action-item .action-label {
	margin-right: 0px;
}

.settings-editor > .settings-header .settings-tabs-widget .monaco-action-bar .action-item .dropdown-icon {
	/** The tab widget container height is shorter than elsewhere, need to tweak this */
	padding-top: 3px;
}

.settings-editor > .settings-header > .settings-header-controls .settings-tabs-widget > .monaco-action-bar .action-item {
	padding: 0px;
	/* padding must be on action-label because it has the bottom-border, because that's where the .checked class is */
}

.settings-editor > .settings-header > .settings-header-controls .settings-tabs-widget > .monaco-action-bar .action-item .action-label {
	text-transform: none;
	font-size: 13px;
	padding-bottom: 6.5px;
	padding-top: 7px;
	padding-left: 8px;
	padding-right: 8px;
}

.settings-editor > .settings-header > .settings-header-controls .settings-tabs-widget > .monaco-action-bar .action-item .action-label .dropdown-icon {
	padding-top: 2px;
}

.settings-editor > .settings-header > .settings-header-controls .settings-tabs-widget > .monaco-action-bar .action-item .action-label:not(.checked):not(:focus) {
	/* Still maintain a border for alignment, but keep it transparent */
	border-bottom: 1px solid transparent;
}

.settings-editor > .settings-body {
	position: relative;
}

.settings-editor > .settings-body > .no-results-message {
	display: none;
	max-width: 1200px;
	margin: auto;
	margin-top: 20px;
	padding-left: 24px;
	padding-right: 24px;
	box-sizing: border-box;
}

.settings-editor > .settings-body > .monaco-split-view2 {
	margin-top: 14px;
}

.settings-editor > .settings-body > .monaco-split-view2.separator-border .split-view-view:not(:first-child):before {
	z-index: 16; /* Above sticky scroll */
}

.settings-editor > .settings-body .settings-toc-container,
.settings-editor > .settings-body .settings-tree-container {
	height: 100%;
}

.settings-editor > .settings-body .settings-tree-container .settings-group-title-label,
.settings-editor > .settings-body .settings-tree-container .setting-item-label {
	color: var(--vscode-settings-headerForeground);
}

.settings-editor > .settings-body .settings-tree-container .setting-item-extension-toggle .setting-item-extension-toggle-button {
	display: inline-block;
	width: fit-content;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-extension-toggle .setting-item-extension-dismiss-button {
	display: inline-block;
	width: fit-content;
	margin-left: 8px;
}

.settings-editor.no-results > .settings-body .settings-toc-container,
.settings-editor.no-results > .settings-body .settings-tree-container {
	display: none;
}

.settings-editor.no-results > .settings-body > .no-results-message {
	display: block;
}

.settings-editor > .settings-body > .no-results-message a.prominent {
	text-decoration: underline;
}

.settings-editor.narrow-width > .settings-body .settings-tree-container .monaco-list-row .monaco-tl-contents {
	padding-left: 33px;
}

.settings-editor > .settings-body .settings-tree-container .monaco-list-row {
	outline: none !important;
}

.settings-editor > .settings-body .settings-tree-container .monaco-list-row .monaco-tl-twistie {
	/* Hide twisties */
	display: none !important;
}

.settings-editor > .settings-body .settings-tree-container .monaco-list-row.focused .settings-row-inner-container {
	background-color: var(--vscode-settings-focusedRowBackground);
}

.settings-editor > .settings-body .settings-tree-container .monaco-tree-sticky-container .monaco-list-row.focused .settings-row-inner-container {
	background-color: unset; /* Remove Sticky Scroll focus */
}

.settings-editor > .settings-body .settings-tree-container .monaco-list-row:not(.focused) .settings-row-inner-container:hover {
	background-color: var(--vscode-settings-rowHoverBackground);
}

.settings-editor > .settings-body .settings-tree-container .monaco-list:focus-within .monaco-list-row.focused .setting-item-contents,
.settings-editor > .settings-body .settings-tree-container .monaco-list:focus-within .monaco-list-row.focused .settings-group-title-label {
	outline: 1px solid var(--vscode-settings-focusedRowBorder);
}

.settings-editor > .settings-body .settings-tree-container .monaco-list:focus-within .monaco-tree-sticky-container .monaco-list-row.focused .settings-group-title-label {
	outline: none; /* Remove Sticky Scroll focus */
}

.settings-editor > .settings-body .settings-tree-container .settings-editor-tree > .monaco-scrollable-element > .shadow.top {
	z-index: 11;
}

.settings-editor > .settings-body .settings-tree-container .setting-toolbar-container {
	position: absolute;
	left: -22px;
	top: 8px;
	bottom: 0px;
	width: 22px;
	height: 22px;
}

.settings-editor > .settings-body .settings-tree-container .monaco-list-row .mouseover .setting-toolbar-container > .monaco-toolbar .codicon,
.settings-editor > .settings-body .settings-tree-container .monaco-list-row.focused .setting-item-contents .setting-toolbar-container > .monaco-toolbar .codicon,
.settings-editor > .settings-body .settings-tree-container .monaco-list-row .setting-toolbar-container:hover > .monaco-toolbar .codicon,
.settings-editor > .settings-body .settings-tree-container .monaco-list-row .setting-toolbar-container > .monaco-toolbar .active .codicon,
.settings-editor > .settings-header .search-container .search-container-widgets .action-label {
	opacity: 1;
}

.settings-editor > .settings-header .search-container .search-container-widgets .monaco-custom-toggle.disabled {
	pointer-events: initial;
}

.settings-editor > .settings-body .settings-tree-container .setting-toolbar-container > .monaco-toolbar .codicon {
	opacity: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.monaco-workbench.monaco-enable-motion .settings-editor > .settings-body .settings-tree-container .setting-toolbar-container > .monaco-toolbar .codicon {
	transition: opacity .3s;
}

.settings-editor > .settings-body .settings-toc-container {
	width: 100%;
	pointer-events: none;
	z-index: 10;
	position: absolute;
}

.settings-editor > .settings-body .settings-toc-container .monaco-list {
	pointer-events: initial;
}

.settings-editor.narrow-width > .settings-body .settings-toc-container {
	display: none;
}

.settings-editor > .settings-body .settings-toc-container .monaco-list-row:not(.selected) {
	color: var(--vscode-foreground);
	opacity: 0.9;
}

.settings-editor > .settings-body .settings-toc-container .monaco-list-row .monaco-tl-contents {
	display: flex;
}

.settings-editor > .settings-body .settings-toc-container .monaco-list-row .settings-toc-entry {
	overflow: hidden;
	text-overflow: ellipsis;
	line-height: 22px;
	flex-shrink: 1;
}

.settings-editor > .settings-body .settings-toc-container .monaco-list-row .settings-toc-count {
	display: none;
	line-height: 22px;
	opacity: 0.8;
	margin-left: 3px;
}

.settings-editor.search-mode > .settings-body .settings-toc-container .monaco-list-row .settings-toc-count {
	display: block;
}

.settings-editor > .settings-body .settings-toc-container .monaco-list-row.selected .settings-toc-entry {
	font-weight: bold;
}

.settings-editor > .settings-body .settings-tree-container {
	border-spacing: 0;
	border-collapse: separate;
	position: relative;
}

/* Set padding for these two to zero for now, otherwise the ends of the lists get cut off. */
.settings-editor > .settings-body .settings-tree-container .monaco-scrollable-element {
	padding-top: 0px;
}
.settings-editor > .settings-body .settings-toc-container .monaco-scrollable-element {
	padding-top: 0px;
}

.settings-editor > .settings-body .settings-toc-wrapper {
	padding-left: 24px;
}

.settings-editor > .settings-body .settings-toc-wrapper {
	height: 100%;
	max-width: 1200px;
	margin: auto;
}

.settings-editor.narrow-width > .settings-body .settings-tree-container {
	margin-left: 0px;
}

.settings-editor > .settings-body .settings-tree-container .monaco-list-row {
	line-height: 1.4em !important;

	/* so validation messages don't get clipped */
	overflow: visible;
	cursor: default;
}

.settings-editor > .settings-body .settings-tree-container .monaco-list-rows {
	min-height: 100%; /* Avoid the hover being cut off. See #164602 and #165518 */
	overflow: visible !important; /* Allow validation errors to flow out of the tree container. Override inline style from ScrollableElement. */
}

.settings-editor > .settings-body .settings-tree-container .monaco-list-row .monaco-tl-contents {
	max-width: min(100%, 1200px); /* We don't want the widgets to be too long */
	margin: auto;
	box-sizing: border-box;
	padding-left: 24px;
	padding-right: 24px;
	overflow: visible;
}
.settings-editor > .settings-body .settings-tree-container .monaco-list-row .monaco-tl-contents.group-title {
	max-width: min(100%, 1200px); /* Cut off title if too long for window */
}

.settings-editor > .settings-body .settings-tree-container .settings-group-title-label,
.settings-editor > .settings-body .settings-tree-container .setting-item-contents {
	outline-offset: -1px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents {
	position: relative;
	padding: 12px 14px 18px;
	white-space: normal;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-title {
	overflow: hidden;
	text-overflow: ellipsis;
	display: inline-block; /* size to contents for hover to show context button */
	padding-bottom: 2px; /* so that focus outlines wrap around nicely for indicators, especially ones with codicons */
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-modified-indicator {
	display: none;
	border-color: var(--vscode-settings-modifiedItemIndicator);
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents.is-configured .setting-item-modified-indicator {
	display: block;
	content: ' ';
	position: absolute;
	width: 6px;
	border-left-width: 2px;
	border-left-style: solid;
	left: 5px;
	top: 15px;
	bottom: 18px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-bool .setting-item-contents.is-configured .setting-item-modified-indicator,
.settings-editor > .settings-body .settings-tree-container .setting-item-list .setting-item-contents.is-configured .setting-item-modified-indicator {
	bottom: 23px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-title > .setting-indicators-container {
	font-style: italic;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-title .setting-item-overrides,
.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-title .setting-item-ignored {
	/* Hack for subpixel antialiasing */
	color: var(--vscode-foreground);
	opacity: 0.9;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-title > .setting-indicators-container .setting-indicator {
	padding-bottom: 2px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-title > .setting-indicators-container .setting-indicator.setting-item-preview {
	color: var(--vscode-badge-foreground);
	background: var(--vscode-badge-background);
	font-style: italic;
	margin-right: 4px;
	padding: 0px 4px 2px;
	border-radius: 4px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-title .codicon {
	vertical-align: middle;
	padding-left: 1px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-title .setting-item-label .codicon {
	vertical-align: middle;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-title .setting-item-overrides a.modified-scope {
	color: var(--vscode-textLink-foreground);
	text-decoration: var(--text-link-decoration);
	cursor: pointer;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-label {
	margin-right: 7px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-cat-label-container {
	float: left;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-label,
.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-category {
	font-weight: 600;
	user-select: text;
	-webkit-user-select: text;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-category {
	opacity: 0.9;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-deprecation-message {
	margin-top: 3px;
	user-select: text;
	-webkit-user-select: text;
	display: none;
	color: var(--vscode-errorForeground);
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents.is-deprecated .setting-item-deprecation-message {
	display: flex;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents.is-deprecated .setting-item-deprecation-message .codicon {
	color: inherit;
	margin-right: 4px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-description {
	margin-top: -1px;
	user-select: text;
	-webkit-user-select: text;
	color: var(--vscode-foreground);
	opacity: 0.9;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-validation-message {
	display: none;
	background-color: var(--vscode-inputValidation-errorBackground);
	color: var(--vscode-inputValidation-errorForeground);
	border: solid 1px var(--vscode-inputValidation-errorBorder);
}

.settings-editor > .settings-body .settings-tree-container .setting-item .setting-item-contents.invalid-input .setting-item-validation-message {
	display: block;
	position: absolute;
	padding: 5px;
	box-sizing: border-box;
	margin-top: -1px;
	z-index: 1;
}
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-item-contents.invalid-input .setting-item-validation-message {
	position: static;
	margin-top: 1rem;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-text .setting-item-validation-message {
	width: 420px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-number .setting-item-validation-message {
	width: 200px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-number input[type=number]::-webkit-inner-spin-button {
	/* Hide arrow button that shows in type=number fields */
	-webkit-appearance: none !important;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-number input[type=number] {
	/* Hide arrow button that shows in type=number fields */
	-moz-appearance: textfield !important;
	appearance: textfield !important;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-markdown * {
	margin: 0px;
}
.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-markdown *:not(:last-child) {
	margin-bottom: 8px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .edit-in-settings-button {
	opacity: 0.9;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .complex-object-edit-in-settings-button-container {
	margin-top: 9px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .complex-object-edit-in-settings-button-container.hide {
	display: none;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-markdown a,
.settings-editor > .settings-body .settings-tree-container .setting-item-contents .edit-in-settings-button,
.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-markdown a > code {
	color: var(--vscode-textLink-foreground);
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-markdown a,
.settings-editor > .settings-body .settings-tree-container .setting-item-contents .edit-in-settings-button {
	text-decoration: var(--text-link-decoration);
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-markdown a:focus,
.settings-editor > .settings-body .settings-tree-container .setting-item-contents .edit-in-settings-button:focus {
	outline: 1px solid -webkit-focus-ring-color;
	outline-offset: -1px;
	text-decoration: underline;
	outline-color: var(--vscode-focusBorder);
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-markdown a:hover,
.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-markdown a:active,
.settings-editor > .settings-body .settings-tree-container .setting-item-contents .edit-in-settings-button:hover,
.settings-editor > .settings-body .settings-tree-container .setting-item-contents .edit-in-settings-button:active,
.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-markdown a:hover > code,
.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-markdown a:active > code {
	color: var(--vscode-textLink-activeForeground);
}

/* High contrast theme support - ensure proper color visibility */
.monaco-workbench.hc-light .settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-markdown a > code,
.monaco-workbench.hc-black .settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-markdown a > code {
	color: var(--vscode-textPreformat-foreground);
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-markdown a:hover,
.settings-editor > .settings-body .settings-tree-container .edit-in-settings-button:hover {
	cursor: pointer;
	text-decoration: underline;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-markdown code {
	line-height: 15px;
	/** For some reason, this is needed, otherwise <code> will take up 20px height */
	font-family: var(--monaco-monospace-font);
	font-size: 11px;
	color: var(--vscode-textPreformat-foreground);
	background-color: var(--vscode-textPreformat-background);
	padding: 1px 3px;
	border-radius: 4px;
	border: 1px solid var(--vscode-textPreformat-border);
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-markdown .monaco-tokenized-source {
	font-family: var(--monaco-monospace-font);
	white-space: pre;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-enumDescription {
	display: block;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-bool .setting-item-contents,
.settings-editor > .settings-body .settings-tree-container .setting-item-list .setting-item-contents {
	padding-bottom: 26px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-bool .setting-item-description {
	display: flex;
	cursor: pointer;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-bool .setting-item-description.disabled {
	cursor: initial;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-bool .setting-value-checkbox {
	height: 18px;
	width: 18px;
	border: 1px solid transparent;
	border-radius: 3px;
	margin-right: 9px;
	margin-left: 0px;
	padding: 0px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-bool .setting-value-checkbox.codicon:not(.checked)::before {
	opacity: 0;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .setting-item-value {
	margin-top: 9px;
	display: flex;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-number .setting-item-value > .setting-item-control {
	min-width: 200px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-text .setting-item-control {
	width: 420px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-enum .setting-item-value > .setting-item-control,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-text .setting-item-value > .setting-item-control {
	min-width: initial;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-enum .setting-item-value > .setting-item-control > select {
	width: 320px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-contents .monaco-select-box {
	width: initial;
	font: inherit;
	height: 26px;
	padding: 2px 6px;
}

.monaco-select-box-dropdown-container > .select-box-details-pane > .select-box-description-markdown code {
	font-family: var(--monaco-monospace-font);
	font-size: 12px;
	color: var(--vscode-textPreformat-foreground);
	background-color: var(--vscode-textPreformat-background);
	padding: 2px 5px;
	border-radius: 4px;
}

.monaco-select-box-dropdown-container > .select-box-details-pane > .select-box-description-markdown a,
.monaco-select-box-dropdown-container > .select-box-details-pane > .select-box-description-markdown a > code {
	color: var(--vscode-textLink-foreground);
}

.monaco-select-box-dropdown-container > .select-box-details-pane > .select-box-description-markdown a:hover,
.monaco-select-box-dropdown-container > .select-box-details-pane > .select-box-description-markdown a:active,
.monaco-select-box-dropdown-container > .select-box-details-pane > .select-box-description-markdown a:hover > code,
.monaco-select-box-dropdown-container > .select-box-details-pane > .select-box-description-markdown a:active > code {
	color: var(--vscode-textLink-activeForeground);
}

.settings-editor > .settings-body .settings-tree-container .setting-item-new-extensions {
	display: flex;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-new-extensions .settings-new-extensions-button {
	margin: auto;
	margin-bottom: 15px;
	width: initial;
	padding: 4px 10px;
}

.settings-editor > .settings-body .settings-tree-container .group-title {
	cursor: default;
}

.settings-editor > .settings-body .settings-tree-container .settings-group-title-label {
	display: inline-block;
	margin: 0px;
	font-weight: 600;
	height: 100%;
	box-sizing: border-box;
	padding: 10px;
	padding-left: 15px;
	width: 100%;
	position: relative;
	overflow: hidden;
	text-overflow: ellipsis;
}
.settings-editor > .settings-body .settings-tree-container .settings-group-title-label.settings-group-level-1 {
	font-size: 26px;
}
.settings-editor > .settings-body .settings-tree-container .settings-group-title-label.settings-group-level-2 {
	font-size: 22px;
}
.settings-editor > .settings-body .settings-tree-container .settings-group-title-label.settings-group-level-3 {
	font-size: 18px;
}

.settings-editor.search-mode > .settings-body .settings-toc-container .monaco-list-row .settings-toc-count {
	display: block;
}

.settings-editor > .settings-body .settings-tree-container .setting-list-widget .setting-list-object-list-row.select-container {
	width: 320px;
}
.settings-editor > .settings-body .settings-tree-container .setting-list-widget .setting-list-object-list-row.select-container > select {
	width: inherit;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-bool .codicon,
.settings-editor > .settings-body .settings-toc-container .monaco-list-row.focused .codicon,
.settings-editor > .settings-body .settings-tree-container .monaco-list-row.focused .setting-item-contents .codicon {
	color: inherit !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/browser/media/settingsWidgets.css]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/media/settingsWidgets.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-item-value > .setting-item-control {
	width: 100%;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-value,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-object-key {
	margin-right: 3px;
	margin-left: 2px;
}

/* Deal with overflow */
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-value,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-sibling,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-object-key,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-object-value {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.settings-editor > .settings-body .settings-tree-container .setting-item-bool .setting-value-checkbox {
	background-color: var(--vscode-settings-checkboxBackground) !important;
	color: var(--vscode-settings-checkboxForeground) !important;
	border-color: var(--vscode-settings-checkboxBorder) !important;
}
.settings-editor > .settings-body .settings-tree-container .setting-item-bool .setting-list-object-input-key-checkbox {
	margin-left: 4px;
	height: 24px;
}
.settings-editor > .settings-body .settings-tree-container .setting-item-bool .setting-list-object-input-key-checkbox .setting-value-checkbox {
	margin-top: 3px;
}
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-item-bool .setting-list-object-value {
	width: 100%;
	cursor: pointer;
	flex: 1;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-object-key {
	margin-left: 4px;
	width: 40%;
}
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-object-input-key {
	margin-left: 0;
	min-width: 40%;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-value {
	width: 60%;
}
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-sibling {
	width: 40%;
}
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-value.no-sibling {
	width: 100%;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-object-input-value,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-object-value {
	width: 100%;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-row .setting-list-object-value,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-value {
	/* In case the text is too long, we don't want to block the pencil icon. */
	box-sizing: border-box;
	padding-right: 40px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-object-value {
	width: 60%;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-value,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-sibling,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-object-key,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-object-value {
	display: inline-block;
	line-height: 24px;
	min-height: 24px;
	flex: none;
}

/* Use monospace to display glob patterns in include/exclude widget */
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-include-exclude-widget .setting-list-value,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-include-exclude-widget .setting-list-sibling {
	font-family: var(--monaco-monospace-font);
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-sibling {
	opacity: 0.7;
	margin-left: 0.5em;
	font-size: 0.9em;
	white-space: pre;

	/* In case the text is too long, we don't want to block the pencil icon. */
	box-sizing: border-box;
	padding-right: 50px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-row .monaco-action-bar {
	display: none;
	position: absolute;
	right: 0px;
	top: 0px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-row {
	display: flex;
}
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-row:hover {
	background-color: var(--vscode-list-hoverBackground);
	color: var(--vscode-list-hoverForeground);
}
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-row.selected:focus {
	background-color: var(--vscode-list-activeSelectionBackground);
	color: var(--vscode-list-activeSelectionForeground);
}
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-row.selected:not(:focus) {
	background-color: var(--vscode-list-inactiveSelectionBackground);
	color: var(--vscode-list-inactiveSelectionForeground);
}
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-row.draggable {
	cursor: pointer;
	user-select: none;
}
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-row.drag-hover {
	background-color: var(--vscode-list-dropBackground);
}
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-row.drag-hover * {
	pointer-events: none;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-row,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-row-header {
	position: relative;
	max-height: 24px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-row-header {
	font-weight: bold;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-row,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-row-header {
	display: flex;
	padding-right: 4px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-row-header,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-object-row:nth-child(odd):not(:hover):not(:focus):not(.selected),
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-edit-row.setting-list-object-row:nth-child(odd):hover {
	background-color: rgba(130, 130, 130, 0.04);
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-row:hover .monaco-action-bar,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-row.selected .monaco-action-bar {
	display: block;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-row .monaco-action-bar .action-label {
	width: 16px;
	height: 20px;
	padding: 2px;
	margin-right: 2px;
	display: flex;
	color: inherit;
	align-items: center;
	justify-content: center;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-row .monaco-action-bar .setting-listAction-edit {
	margin-right: 4px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .monaco-text-button {
	width: initial;
	white-space: nowrap;
	padding: 4px 14px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-item-control.setting-list-hide-add-button .setting-list-new-row {
	display: none;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .monaco-text-button.setting-list-addButton {
	display: inline-block;
	margin-top: 4px;
	margin-right: 4px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-row,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-edit-row {
	display: flex
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-valueInput,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-siblingInput,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-object-input {
	height: 24px;
	max-width: 320px;
	margin-right: 4px;
}
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-valueInput.no-sibling,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-object-input {
	max-width: unset;
}
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-valueInput.no-sibling {
	/* Add more width to help with string arrays */
	width: 100%;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-object-value-container .setting-list-object-input {
	margin-right: 0;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-ok-button {
	margin: 0 4px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-widget,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-include-exclude-widget,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget {
	margin-bottom: 1px;
	padding: 1px;
}

.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-object-value-container,
.settings-editor > .settings-body .settings-tree-container .setting-item.setting-item-list .setting-list-object-widget .setting-list-object-input select {
	width: 100%;
	height: 24px;
}

.settings-editor > .settings-body .settings-tree-container .setting-list-widget .setting-list-object-list-row.select-container {
	width: 320px;
}
.settings-editor > .settings-body .settings-tree-container .setting-list-widget .setting-list-object-list-row.select-container > select {
	width: inherit;
}

.settings-tabs-widget > .monaco-action-bar .action-item.disabled {
	display: none;
}

.settings-tabs-widget > .monaco-action-bar .action-item {
	max-width: 300px;
	overflow: hidden;
	text-overflow: ellipsis;
}

.settings-tabs-widget > .monaco-action-bar .action-item .action-label {
	text-transform: uppercase;
	font-size: 11px;
	margin-right: 5px;
	cursor: pointer;
	display: flex;
	overflow: hidden;
	text-overflow: ellipsis;
}

.settings-tabs-widget > .monaco-action-bar .action-item .action-label {
	display: block;
	padding: 0px;
	border-radius: initial;
	background: none !important;
}

.settings-tabs-widget > .monaco-action-bar .action-item .action-label.folder-settings {
	display: flex;
}

.settings-tabs-widget > .monaco-action-bar .action-item {
	padding: 3px 0px;
}

.settings-tabs-widget > .monaco-action-bar .action-item .action-title {
	text-overflow: ellipsis;
	overflow: hidden;
}

.settings-tabs-widget > .monaco-action-bar .action-item .action-details {
	text-transform: none;
	margin-left: 0.5em;
	font-size: 10px;
	opacity: 0.7;
}

.settings-tabs-widget .monaco-action-bar .action-item .dropdown-icon {
	padding-left: 0.3em;
	padding-top: 8px;
	font-size: 12px;
}

.settings-tabs-widget .monaco-action-bar .action-item .dropdown-icon.hide {
	display: none;
}

.settings-tabs-widget > .monaco-action-bar .action-item .action-label {
	color: var(--vscode-panelTitle-inactiveForeground);
}

.settings-tabs-widget > .monaco-action-bar .action-item .action-label.checked,
.settings-tabs-widget > .monaco-action-bar .action-item .action-label:hover {
	color: var(--vscode-panelTitle-activeForeground);
	border-bottom: 1px solid var(--vscode-panelTitle-activeBorder);
	outline: 1px solid var(--vscode-contrastActiveBorder, transparent);
	outline-offset: -1px;
}

.settings-tabs-widget > .monaco-action-bar .action-item .action-label:focus {
	border-bottom: 1px solid var(--vscode-focusBorder);
	outline: 1px solid transparent;
	outline-offset: -1px;
}

.settings-tabs-widget > .monaco-action-bar .action-item .action-label:not(.checked):hover {
	outline-style: dashed;
}

.settings-header-widget > .settings-search-controls > .settings-count-widget {
	margin: 6px 0px;
	padding: 0px 8px;
	border-radius: 2px;
	float: left;
}

.settings-header-widget > .settings-search-controls {
	position: absolute;
	right: 10px;
}

.settings-header-widget > .settings-search-controls > .settings-count-widget.hide {
	display: none;
}

.settings-header-widget > .settings-search-container {
	flex: 1;
}

.settings-header-widget > .settings-search-container > .settings-search-input {
	vertical-align: middle;
}

.settings-header-widget > .settings-search-container > .settings-search-input > .monaco-inputbox {
	height: 30px;
}

.monaco-workbench.vs .settings-header-widget > .settings-search-container > .settings-search-input > .monaco-inputbox {
	border: 1px solid #ddd;
}

.settings-header-widget > .settings-search-container > .settings-search-input > .monaco-inputbox .input {
	font-size: 14px;
	padding-left:10px;
}

.monaco-editor .view-zones > .settings-header-widget {
	z-index: 1;
}

.monaco-editor .settings-header-widget .title-container {
	display: flex;
	user-select: none;
	-webkit-user-select: none;
}

.monaco-editor .settings-header-widget .title-container .title {
	font-weight: bold;
	white-space: nowrap;
	text-transform: uppercase;
}

.monaco-editor .settings-header-widget .title-container .message {
	white-space: nowrap;
}

.monaco-editor .dim-configuration {
	color: #b1b1b1;
}

.codicon-settings-edit:hover {
	cursor: pointer;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/common/preferences.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/common/preferences.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { raceTimeout } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { IExtensionRecommendations } from '../../../../base/common/product.js';
import { localize } from '../../../../nls.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IExtensionGalleryService, IGalleryExtension } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IChatEntitlementService } from '../../../services/chat/common/chatEntitlementService.js';
import { ISearchResult, ISettingsEditorModel } from '../../../services/preferences/common/preferences.js';

export interface IWorkbenchSettingsConfiguration {
	workbench: {
		settings: {
			openDefaultSettings: boolean;
			naturalLanguageSearchEndpoint: string;
			naturalLanguageSearchKey: string;
			naturalLanguageSearchAutoIngestFeedback: boolean;
			useNaturalLanguageSearchPost: boolean;
			enableNaturalLanguageSearch: boolean;
			enableNaturalLanguageSearchFeedback: boolean;
		};
	};
}

export interface IEndpointDetails {
	urlBase: string;
	key?: string;
}

export const IPreferencesSearchService = createDecorator<IPreferencesSearchService>('preferencesSearchService');

export interface IPreferencesSearchService {
	readonly _serviceBrand: undefined;

	getLocalSearchProvider(filter: string): ISearchProvider;
	getRemoteSearchProvider(filter: string, newExtensionsOnly?: boolean): ISearchProvider | undefined;
	getAiSearchProvider(filter: string): IAiSearchProvider | undefined;
}

export interface ISearchProvider {
	searchModel(preferencesModel: ISettingsEditorModel, token: CancellationToken): Promise<ISearchResult | null>;
}

export interface IRemoteSearchProvider extends ISearchProvider {
	setFilter(filter: string): void;
}

export interface IAiSearchProvider extends IRemoteSearchProvider {
	getLLMRankedResults(token: CancellationToken): Promise<ISearchResult | null>;
}

export const PREFERENCES_EDITOR_COMMAND_OPEN = 'workbench.preferences.action.openPreferencesEditor';
export const CONTEXT_PREFERENCES_SEARCH_FOCUS = new RawContextKey<boolean>('inPreferencesSearch', false);

export const SETTINGS_EDITOR_COMMAND_CLEAR_SEARCH_RESULTS = 'settings.action.clearSearchResults';
export const SETTINGS_EDITOR_COMMAND_SHOW_AI_RESULTS = 'settings.action.showAIResults';
export const SETTINGS_EDITOR_COMMAND_TOGGLE_AI_SEARCH = 'settings.action.toggleAiSearch';
export const SETTINGS_EDITOR_COMMAND_SHOW_CONTEXT_MENU = 'settings.action.showContextMenu';
export const SETTINGS_EDITOR_COMMAND_SUGGEST_FILTERS = 'settings.action.suggestFilters';

export const CONTEXT_SETTINGS_EDITOR = new RawContextKey<boolean>('inSettingsEditor', false);
export const CONTEXT_SETTINGS_JSON_EDITOR = new RawContextKey<boolean>('inSettingsJSONEditor', false);
export const CONTEXT_SETTINGS_SEARCH_FOCUS = new RawContextKey<boolean>('inSettingsSearch', false);
export const CONTEXT_TOC_ROW_FOCUS = new RawContextKey<boolean>('settingsTocRowFocus', false);
export const CONTEXT_SETTINGS_ROW_FOCUS = new RawContextKey<boolean>('settingRowFocus', false);
export const CONTEXT_KEYBINDINGS_EDITOR = new RawContextKey<boolean>('inKeybindings', false);
export const CONTEXT_KEYBINDINGS_SEARCH_FOCUS = new RawContextKey<boolean>('inKeybindingsSearch', false);
export const CONTEXT_KEYBINDINGS_SEARCH_HAS_VALUE = new RawContextKey<boolean>('keybindingsSearchHasValue', false);
export const CONTEXT_KEYBINDING_FOCUS = new RawContextKey<boolean>('keybindingFocus', false);
export const CONTEXT_WHEN_FOCUS = new RawContextKey<boolean>('whenFocus', false);
export const CONTEXT_AI_SETTING_RESULTS_AVAILABLE = new RawContextKey<boolean>('aiSettingResultsAvailable', false);

export const KEYBINDINGS_EDITOR_COMMAND_SEARCH = 'keybindings.editor.searchKeybindings';
export const KEYBINDINGS_EDITOR_COMMAND_CLEAR_SEARCH_RESULTS = 'keybindings.editor.clearSearchResults';
export const KEYBINDINGS_EDITOR_COMMAND_CLEAR_SEARCH_HISTORY = 'keybindings.editor.clearSearchHistory';
export const KEYBINDINGS_EDITOR_COMMAND_RECORD_SEARCH_KEYS = 'keybindings.editor.recordSearchKeys';
export const KEYBINDINGS_EDITOR_COMMAND_SORTBY_PRECEDENCE = 'keybindings.editor.toggleSortByPrecedence';
export const KEYBINDINGS_EDITOR_COMMAND_DEFINE = 'keybindings.editor.defineKeybinding';
export const KEYBINDINGS_EDITOR_COMMAND_ADD = 'keybindings.editor.addKeybinding';
export const KEYBINDINGS_EDITOR_COMMAND_DEFINE_WHEN = 'keybindings.editor.defineWhenExpression';
export const KEYBINDINGS_EDITOR_COMMAND_ACCEPT_WHEN = 'keybindings.editor.acceptWhenExpression';
export const KEYBINDINGS_EDITOR_COMMAND_REJECT_WHEN = 'keybindings.editor.rejectWhenExpression';
export const KEYBINDINGS_EDITOR_COMMAND_REMOVE = 'keybindings.editor.removeKeybinding';
export const KEYBINDINGS_EDITOR_COMMAND_RESET = 'keybindings.editor.resetKeybinding';
export const KEYBINDINGS_EDITOR_COMMAND_COPY = 'keybindings.editor.copyKeybindingEntry';
export const KEYBINDINGS_EDITOR_COMMAND_COPY_COMMAND = 'keybindings.editor.copyCommandKeybindingEntry';
export const KEYBINDINGS_EDITOR_COMMAND_COPY_COMMAND_TITLE = 'keybindings.editor.copyCommandTitle';
export const KEYBINDINGS_EDITOR_COMMAND_SHOW_SIMILAR = 'keybindings.editor.showConflicts';
export const KEYBINDINGS_EDITOR_COMMAND_FOCUS_KEYBINDINGS = 'keybindings.editor.focusKeybindings';
export const KEYBINDINGS_EDITOR_SHOW_DEFAULT_KEYBINDINGS = 'keybindings.editor.showDefaultKeybindings';
export const KEYBINDINGS_EDITOR_SHOW_USER_KEYBINDINGS = 'keybindings.editor.showUserKeybindings';
export const KEYBINDINGS_EDITOR_SHOW_EXTENSION_KEYBINDINGS = 'keybindings.editor.showExtensionKeybindings';

export const MODIFIED_SETTING_TAG = 'modified';
export const EXTENSION_SETTING_TAG = 'ext:';
export const FEATURE_SETTING_TAG = 'feature:';
export const ID_SETTING_TAG = 'id:';
export const LANGUAGE_SETTING_TAG = 'lang:';
export const GENERAL_TAG_SETTING_TAG = 'tag:';
export const POLICY_SETTING_TAG = 'hasPolicy';
export const WORKSPACE_TRUST_SETTING_TAG = 'workspaceTrust';
export const REQUIRE_TRUSTED_WORKSPACE_SETTING_TAG = 'requireTrustedWorkspace';
export const ADVANCED_SETTING_TAG = 'advanced';
export const KEYBOARD_LAYOUT_OPEN_PICKER = 'workbench.action.openKeyboardLayoutPicker';

export const ENABLE_LANGUAGE_FILTER = true;

export const ENABLE_EXTENSION_TOGGLE_SETTINGS = true;
export const EXTENSION_FETCH_TIMEOUT_MS = 1000;

export const STRING_MATCH_SEARCH_PROVIDER_NAME = 'local';
export const TF_IDF_SEARCH_PROVIDER_NAME = 'tfIdf';
export const FILTER_MODEL_SEARCH_PROVIDER_NAME = 'filterModel';
export const EMBEDDINGS_SEARCH_PROVIDER_NAME = 'embeddingsFull';
export const LLM_RANKED_SEARCH_PROVIDER_NAME = 'llmRanked';

export enum WorkbenchSettingsEditorSettings {
	ShowAISearchToggle = 'workbench.settings.showAISearchToggle',
	EnableNaturalLanguageSearch = 'workbench.settings.enableNaturalLanguageSearch',
}

export type ExtensionToggleData = {
	settingsEditorRecommendedExtensions: IStringDictionary<IExtensionRecommendations>;
	recommendedExtensionsGalleryInfo: IStringDictionary<IGalleryExtension>;
	commonlyUsed: string[];
};

let cachedExtensionToggleData: ExtensionToggleData | undefined;

export async function getExperimentalExtensionToggleData(
	chatEntitlementService: IChatEntitlementService,
	extensionGalleryService: IExtensionGalleryService,
	productService: IProductService,
): Promise<ExtensionToggleData | undefined> {
	if (!ENABLE_EXTENSION_TOGGLE_SETTINGS) {
		return undefined;
	}

	if (!extensionGalleryService.isEnabled()) {
		return undefined;
	}

	if (chatEntitlementService.sentiment.hidden || chatEntitlementService.sentiment.disabled) {
		return undefined;
	}

	if (cachedExtensionToggleData) {
		return cachedExtensionToggleData;
	}

	if (productService.extensionRecommendations && productService.commonlyUsedSettings) {
		const settingsEditorRecommendedExtensions: IStringDictionary<IExtensionRecommendations> = {};
		Object.keys(productService.extensionRecommendations).forEach(extensionId => {
			const extensionInfo = productService.extensionRecommendations![extensionId];
			if (extensionInfo.onSettingsEditorOpen) {
				settingsEditorRecommendedExtensions[extensionId] = extensionInfo;
			}
		});

		const recommendedExtensionsGalleryInfo: IStringDictionary<IGalleryExtension> = {};
		for (const key in settingsEditorRecommendedExtensions) {
			const extensionId = key;
			// Recommend prerelease if not on Stable.
			const isStable = productService.quality === 'stable';
			try {
				const extensions = await raceTimeout(
					extensionGalleryService.getExtensions([{ id: extensionId, preRelease: !isStable }], CancellationToken.None),
					EXTENSION_FETCH_TIMEOUT_MS);
				if (extensions?.length === 1) {
					recommendedExtensionsGalleryInfo[key] = extensions[0];
				} else {
					// same as network connection fail. we do not want a blank settings page: https://github.com/microsoft/vscode/issues/195722
					// so instead of returning partial data we return undefined here
					return undefined;
				}
			} catch (e) {
				// Network connection fail. Return nothing rather than partial data.
				return undefined;
			}
		}

		cachedExtensionToggleData = {
			settingsEditorRecommendedExtensions,
			recommendedExtensionsGalleryInfo,
			commonlyUsed: productService.commonlyUsedSettings
		};
		return cachedExtensionToggleData;
	}
	return undefined;
}

/**
 * Compares two nullable numbers such that null values always come after defined ones.
 */
export function compareTwoNullableNumbers(a: number | undefined, b: number | undefined): number {
	const aOrMax = a ?? Number.MAX_SAFE_INTEGER;
	const bOrMax = b ?? Number.MAX_SAFE_INTEGER;
	if (aOrMax < bOrMax) {
		return -1;
	} else if (aOrMax > bOrMax) {
		return 1;
	} else {
		return 0;
	}
}

export const PREVIEW_INDICATOR_DESCRIPTION = localize('previewIndicatorDescription', "Preview setting: this setting controls a new feature that is still under refinement yet ready to use. Feedback is welcome.");
export const EXPERIMENTAL_INDICATOR_DESCRIPTION = localize('experimentalIndicatorDescription', "Experimental setting: this setting controls a new feature that is actively being developed and may be unstable. It is subject to change or removal.");
export const ADVANCED_INDICATOR_DESCRIPTION = localize('advancedIndicatorDescription', "Advanced setting: this setting is intended for advanced scenarios and configurations. Only modify this if you know what it does.");

export const knownAcronyms = new Set<string>();
[
	'css',
	'html',
	'scss',
	'less',
	'json',
	'js',
	'ts',
	'ie',
	'id',
	'php',
	'scm',
].forEach(str => knownAcronyms.add(str));

export const knownTermMappings = new Map<string, string>();
knownTermMappings.set('power shell', 'PowerShell');
knownTermMappings.set('powershell', 'PowerShell');
knownTermMappings.set('javascript', 'JavaScript');
knownTermMappings.set('typescript', 'TypeScript');
knownTermMappings.set('github', 'GitHub');
knownTermMappings.set('jet brains', 'JetBrains');
knownTermMappings.set('jetbrains', 'JetBrains');
knownTermMappings.set('re sharper', 'ReSharper');
knownTermMappings.set('resharper', 'ReSharper');

export function wordifyKey(key: string): string {
	key = key
		.replace(/\.([a-z0-9])/g, (_, p1) => ` \u203A ${p1.toUpperCase()}`) // Replace dot with spaced '>'
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Camel case to spacing, fooBar => foo Bar
		.replace(/([A-Z]{1,})([A-Z][a-z])/g, '$1 $2') // Split consecutive capitals letters, AISearch => AI Search
		.replace(/^[a-z]/g, match => match.toUpperCase()) // Upper casing all first letters, foo => Foo
		.replace(/\b\w+\b/g, match => { // Upper casing known acronyms
			return knownAcronyms.has(match.toLowerCase()) ?
				match.toUpperCase() :
				match;
		});

	for (const [k, v] of knownTermMappings) {
		key = key.replace(new RegExp(`\\b${k}\\b`, 'gi'), v);
	}

	return key;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/common/preferencesContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/common/preferencesContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, dispose, IDisposable } from '../../../../base/common/lifecycle.js';
import { isEqual } from '../../../../base/common/resources.js';
import * as nls from '../../../../nls.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ConfigurationScope, Extensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { workbenchConfigurationNodeBase } from '../../../common/configuration.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { EditorInputWithOptions } from '../../../common/editor.js';
import { SideBySideEditorInput } from '../../../common/editor/sideBySideEditorInput.js';
import { RegisteredEditorPriority, IEditorResolverService } from '../../../services/editor/common/editorResolverService.js';
import { ITextEditorService } from '../../../services/textfile/common/textEditorService.js';
import { DEFAULT_SETTINGS_EDITOR_SETTING, FOLDER_SETTINGS_PATH, IPreferencesService, USE_SPLIT_JSON_SETTING } from '../../../services/preferences/common/preferences.js';
import { IUserDataProfileService } from '../../../services/userDataProfile/common/userDataProfile.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { SettingsFileSystemProvider } from './settingsFilesystemProvider.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';

export class PreferencesContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.preferences';

	private editorOpeningListener: IDisposable | undefined;

	constructor(
		@IFileService fileService: IFileService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IPreferencesService private readonly preferencesService: IPreferencesService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IWorkspaceContextService private readonly workspaceService: IWorkspaceContextService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IEditorResolverService private readonly editorResolverService: IEditorResolverService,
		@ITextEditorService private readonly textEditorService: ITextEditorService,
	) {
		super();
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(USE_SPLIT_JSON_SETTING) || e.affectsConfiguration(DEFAULT_SETTINGS_EDITOR_SETTING)) {
				this.handleSettingsEditorRegistration();
			}
		}));
		this.handleSettingsEditorRegistration();

		const fileSystemProvider = this._register(this.instantiationService.createInstance(SettingsFileSystemProvider));
		this._register(fileService.registerProvider(SettingsFileSystemProvider.SCHEMA, fileSystemProvider));
	}

	private handleSettingsEditorRegistration(): void {

		// dispose any old listener we had
		dispose(this.editorOpeningListener);

		// install editor opening listener unless user has disabled this
		if (!!this.configurationService.getValue(USE_SPLIT_JSON_SETTING) || !!this.configurationService.getValue(DEFAULT_SETTINGS_EDITOR_SETTING)) {
			this.editorOpeningListener = this.editorResolverService.registerEditor(
				'**/settings.json',
				{
					id: SideBySideEditorInput.ID,
					label: nls.localize('splitSettingsEditorLabel', "Split Settings Editor"),
					priority: RegisteredEditorPriority.builtin,
				},
				{},
				{
					createEditorInput: ({ resource, options }): EditorInputWithOptions => {
						// Global User Settings File
						if (isEqual(resource, this.userDataProfileService.currentProfile.settingsResource)) {
							return { editor: this.preferencesService.createSplitJsonEditorInput(ConfigurationTarget.USER_LOCAL, resource), options };
						}

						// Single Folder Workspace Settings File
						const state = this.workspaceService.getWorkbenchState();
						if (state === WorkbenchState.FOLDER) {
							const folders = this.workspaceService.getWorkspace().folders;
							if (isEqual(resource, folders[0].toResource(FOLDER_SETTINGS_PATH))) {
								return { editor: this.preferencesService.createSplitJsonEditorInput(ConfigurationTarget.WORKSPACE, resource), options };
							}
						}

						// Multi Folder Workspace Settings File
						else if (state === WorkbenchState.WORKSPACE) {
							const folders = this.workspaceService.getWorkspace().folders;
							for (const folder of folders) {
								if (isEqual(resource, folder.toResource(FOLDER_SETTINGS_PATH))) {
									return { editor: this.preferencesService.createSplitJsonEditorInput(ConfigurationTarget.WORKSPACE_FOLDER, resource), options };
								}
							}
						}

						return { editor: this.textEditorService.createTextEditor({ resource }), options };
					}
				}
			);
		}
	}
	override dispose(): void {
		dispose(this.editorOpeningListener);
		super.dispose();
	}
}


const registry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
registry.registerConfiguration({
	...workbenchConfigurationNodeBase,
	'properties': {
		'workbench.settings.enableNaturalLanguageSearch': {
			'type': 'boolean',
			'description': nls.localize('enableNaturalLanguageSettingsSearch', "Controls whether to enable the natural language search mode for settings. The natural language search is provided by a Microsoft online service."),
			'default': true,
			'scope': ConfigurationScope.WINDOW,
			'tags': ['usesOnlineServices']
		},
		'workbench.settings.settingsSearchTocBehavior': {
			'type': 'string',
			'enum': ['hide', 'filter'],
			'enumDescriptions': [
				nls.localize('settingsSearchTocBehavior.hide', "Hide the Table of Contents while searching."),
				nls.localize('settingsSearchTocBehavior.filter', "Filter the Table of Contents to just categories that have matching settings. Clicking on a category will filter the results to that category."),
			],
			'description': nls.localize('settingsSearchTocBehavior', "Controls the behavior of the Settings editor Table of Contents while searching. If this setting is being changed in the Settings editor, the setting will take effect after the search query is modified."),
			'default': 'filter',
			'scope': ConfigurationScope.WINDOW
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/common/settingsEditorColorRegistry.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/common/settingsEditorColorRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Color, RGBA } from '../../../../base/common/color.js';
import { localize } from '../../../../nls.js';
import { editorWidgetBorder, focusBorder, inputBackground, inputBorder, inputForeground, listHoverBackground, registerColor, selectBackground, selectBorder, selectForeground, checkboxBackground, checkboxBorder, checkboxForeground, transparent } from '../../../../platform/theme/common/colorRegistry.js';
import { PANEL_BORDER } from '../../../common/theme.js';

// General setting colors
export const settingsHeaderForeground = registerColor('settings.headerForeground', { light: '#444444', dark: '#e7e7e7', hcDark: '#ffffff', hcLight: '#292929' }, localize('headerForeground', "The foreground color for a section header or active title."));
export const settingsHeaderHoverForeground = registerColor('settings.settingsHeaderHoverForeground', transparent(settingsHeaderForeground, 0.7), localize('settingsHeaderHoverForeground', "The foreground color for a section header or hovered title."));
export const modifiedItemIndicator = registerColor('settings.modifiedItemIndicator', {
	light: new Color(new RGBA(102, 175, 224)),
	dark: new Color(new RGBA(12, 125, 157)),
	hcDark: new Color(new RGBA(0, 73, 122)),
	hcLight: new Color(new RGBA(102, 175, 224)),
}, localize('modifiedItemForeground', "The color of the modified setting indicator."));
export const settingsHeaderBorder = registerColor('settings.headerBorder', PANEL_BORDER, localize('settingsHeaderBorder', "The color of the header container border."));
export const settingsSashBorder = registerColor('settings.sashBorder', PANEL_BORDER, localize('settingsSashBorder', "The color of the Settings editor splitview sash border."));

// Enum control colors
export const settingsSelectBackground = registerColor(`settings.dropdownBackground`, selectBackground, localize('settingsDropdownBackground', "Settings editor dropdown background."));
export const settingsSelectForeground = registerColor('settings.dropdownForeground', selectForeground, localize('settingsDropdownForeground', "Settings editor dropdown foreground."));
export const settingsSelectBorder = registerColor('settings.dropdownBorder', selectBorder, localize('settingsDropdownBorder', "Settings editor dropdown border."));
export const settingsSelectListBorder = registerColor('settings.dropdownListBorder', editorWidgetBorder, localize('settingsDropdownListBorder', "Settings editor dropdown list border. This surrounds the options and separates the options from the description."));

// Bool control colors
export const settingsCheckboxBackground = registerColor('settings.checkboxBackground', checkboxBackground, localize('settingsCheckboxBackground', "Settings editor checkbox background."));
export const settingsCheckboxForeground = registerColor('settings.checkboxForeground', checkboxForeground, localize('settingsCheckboxForeground', "Settings editor checkbox foreground."));
export const settingsCheckboxBorder = registerColor('settings.checkboxBorder', checkboxBorder, localize('settingsCheckboxBorder', "Settings editor checkbox border."));

// Text control colors
export const settingsTextInputBackground = registerColor('settings.textInputBackground', inputBackground, localize('textInputBoxBackground', "Settings editor text input box background."));
export const settingsTextInputForeground = registerColor('settings.textInputForeground', inputForeground, localize('textInputBoxForeground', "Settings editor text input box foreground."));
export const settingsTextInputBorder = registerColor('settings.textInputBorder', inputBorder, localize('textInputBoxBorder', "Settings editor text input box border."));

// Number control colors
export const settingsNumberInputBackground = registerColor('settings.numberInputBackground', inputBackground, localize('numberInputBoxBackground', "Settings editor number input box background."));
export const settingsNumberInputForeground = registerColor('settings.numberInputForeground', inputForeground, localize('numberInputBoxForeground', "Settings editor number input box foreground."));
export const settingsNumberInputBorder = registerColor('settings.numberInputBorder', inputBorder, localize('numberInputBoxBorder', "Settings editor number input box border."));

export const focusedRowBackground = registerColor('settings.focusedRowBackground', {
	dark: transparent(listHoverBackground, .6),
	light: transparent(listHoverBackground, .6),
	hcDark: null,
	hcLight: null,
}, localize('focusedRowBackground', "The background color of a settings row when focused."));

export const rowHoverBackground = registerColor('settings.rowHoverBackground', {
	dark: transparent(listHoverBackground, .3),
	light: transparent(listHoverBackground, .3),
	hcDark: null,
	hcLight: null
}, localize('settings.rowHoverBackground', "The background color of a settings row when hovered."));

export const focusedRowBorder = registerColor('settings.focusedRowBorder', focusBorder, localize('settings.focusedRowBorder', "The color of the row's top and bottom border when the row is focused."));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/common/settingsFilesystemProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/common/settingsFilesystemProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { NotSupportedError } from '../../../../base/common/errors.js';
import { IDisposable, Disposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { FileChangeType, FilePermission, FileSystemProviderCapabilities, FileSystemProviderErrorCode, FileType, IFileChange, IFileDeleteOptions, IFileOverwriteOptions, IFileSystemProviderWithFileReadWriteCapability, IStat, IWatchOptions } from '../../../../platform/files/common/files.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import * as JSONContributionRegistry from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { ILogService, LogLevel } from '../../../../platform/log/common/log.js';
import { isEqual } from '../../../../base/common/resources.js';

const schemaRegistry = Registry.as<JSONContributionRegistry.IJSONContributionRegistry>(JSONContributionRegistry.Extensions.JSONContribution);


export class SettingsFileSystemProvider extends Disposable implements IFileSystemProviderWithFileReadWriteCapability {

	static readonly SCHEMA = Schemas.vscode;

	protected readonly _onDidChangeFile = this._register(new Emitter<readonly IFileChange[]>());
	readonly onDidChangeFile = this._onDidChangeFile.event;

	private static SCHEMA_ASSOCIATIONS = URI.parse(`${Schemas.vscode}://schemas-associations/schemas-associations.json`);

	constructor(
		@IPreferencesService private readonly preferencesService: IPreferencesService,
		@ILogService private readonly logService: ILogService
	) {
		super();
		this._register(schemaRegistry.onDidChangeSchema(schemaUri => {
			this._onDidChangeFile.fire([{ resource: URI.parse(schemaUri), type: FileChangeType.UPDATED }]);
		}));
		this._register(schemaRegistry.onDidChangeSchemaAssociations(() => {
			this._onDidChangeFile.fire([{ resource: SettingsFileSystemProvider.SCHEMA_ASSOCIATIONS, type: FileChangeType.UPDATED }]);
		}));
		this._register(preferencesService.onDidDefaultSettingsContentChanged(uri => {
			this._onDidChangeFile.fire([{ resource: uri, type: FileChangeType.UPDATED }]);
		}));
	}

	readonly capabilities: FileSystemProviderCapabilities = FileSystemProviderCapabilities.Readonly + FileSystemProviderCapabilities.FileReadWrite;

	async readFile(uri: URI): Promise<Uint8Array> {
		if (uri.scheme !== SettingsFileSystemProvider.SCHEMA) {
			throw new NotSupportedError();
		}
		let content: string | undefined;
		if (uri.authority === 'schemas') {
			content = this.getSchemaContent(uri);
		} else if (uri.authority === SettingsFileSystemProvider.SCHEMA_ASSOCIATIONS.authority) {
			content = JSON.stringify(schemaRegistry.getSchemaAssociations());
		} else if (uri.authority === 'defaultsettings') {
			content = this.preferencesService.getDefaultSettingsContent(uri);
		}
		if (content) {
			return VSBuffer.fromString(content).buffer;
		}
		throw FileSystemProviderErrorCode.FileNotFound;
	}

	async stat(uri: URI): Promise<IStat> {
		if (schemaRegistry.hasSchemaContent(uri.toString()) || this.preferencesService.hasDefaultSettingsContent(uri)) {
			const currentTime = Date.now();
			return {
				type: FileType.File,
				permissions: FilePermission.Readonly,
				mtime: currentTime,
				ctime: currentTime,
				size: 0
			};
		}
		if (isEqual(uri, SettingsFileSystemProvider.SCHEMA_ASSOCIATIONS)) {
			const currentTime = Date.now();
			return {
				type: FileType.File,
				permissions: FilePermission.Readonly,
				mtime: currentTime,
				ctime: currentTime,
				size: 0
			};
		}
		throw FileSystemProviderErrorCode.FileNotFound;
	}

	readonly onDidChangeCapabilities = Event.None;

	watch(resource: URI, opts: IWatchOptions): IDisposable { return Disposable.None; }

	async mkdir(resource: URI): Promise<void> { }
	async readdir(resource: URI): Promise<[string, FileType][]> { return []; }

	async rename(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> { }
	async delete(resource: URI, opts: IFileDeleteOptions): Promise<void> { }

	async writeFile() {
		throw new NotSupportedError();
	}

	private getSchemaContent(uri: URI): string {
		const startTime = Date.now();
		const content = schemaRegistry.getSchemaContent(uri.toString()) ?? '{}' /* Use empty schema if not yet registered */;
		const logLevel = this.logService.getLevel();
		if (logLevel === LogLevel.Debug || logLevel === LogLevel.Trace) {
			const endTime = Date.now();
			const uncompressed = JSON.stringify(schemaRegistry.getSchemaContributions().schemas[uri.toString()]);
			this.logService.debug(`${uri.toString()}: ${uncompressed.length} -> ${content.length} (${Math.round((uncompressed.length - content.length) / uncompressed.length * 100)}%) Took ${endTime - startTime}ms`);
		}
		return content;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/common/smartSnippetInserter.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/common/smartSnippetInserter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { JSONScanner, createScanner as createJSONScanner, SyntaxKind as JSONSyntaxKind } from '../../../../base/common/json.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { ITextModel } from '../../../../editor/common/model.js';

export interface InsertSnippetResult {
	position: Position;
	prepend: string;
	append: string;
}

export class SmartSnippetInserter {

	private static hasOpenBrace(scanner: JSONScanner): boolean {

		while (scanner.scan() !== JSONSyntaxKind.EOF) {
			const kind = scanner.getToken();

			if (kind === JSONSyntaxKind.OpenBraceToken) {
				return true;
			}
		}

		return false;
	}

	private static offsetToPosition(model: ITextModel, offset: number): Position {
		let offsetBeforeLine = 0;
		const eolLength = model.getEOL().length;
		const lineCount = model.getLineCount();
		for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
			const lineTotalLength = model.getLineLength(lineNumber) + eolLength;
			const offsetAfterLine = offsetBeforeLine + lineTotalLength;

			if (offsetAfterLine > offset) {
				return new Position(
					lineNumber,
					offset - offsetBeforeLine + 1
				);
			}
			offsetBeforeLine = offsetAfterLine;
		}
		return new Position(
			lineCount,
			model.getLineMaxColumn(lineCount)
		);
	}

	static insertSnippet(model: ITextModel, _position: Position): InsertSnippetResult {

		const desiredPosition = model.getValueLengthInRange(new Range(1, 1, _position.lineNumber, _position.column));

		// <INVALID> [ <BEFORE_OBJECT> { <INVALID> } <AFTER_OBJECT>, <BEFORE_OBJECT> { <INVALID> } <AFTER_OBJECT> ] <INVALID>
		enum State {
			INVALID = 0,
			AFTER_OBJECT = 1,
			BEFORE_OBJECT = 2,
		}
		let currentState = State.INVALID;
		let lastValidPos = -1;
		let lastValidState = State.INVALID;

		const scanner = createJSONScanner(model.getValue());
		let arrayLevel = 0;
		let objLevel = 0;

		const checkRangeStatus = (pos: number, state: State) => {
			if (state !== State.INVALID && arrayLevel === 1 && objLevel === 0) {
				currentState = state;
				lastValidPos = pos;
				lastValidState = state;
			} else {
				if (currentState !== State.INVALID) {
					currentState = State.INVALID;
					lastValidPos = scanner.getTokenOffset();
				}
			}
		};

		while (scanner.scan() !== JSONSyntaxKind.EOF) {
			const currentPos = scanner.getPosition();
			const kind = scanner.getToken();

			let goodKind = false;
			switch (kind) {
				case JSONSyntaxKind.OpenBracketToken:
					goodKind = true;
					arrayLevel++;
					checkRangeStatus(currentPos, State.BEFORE_OBJECT);
					break;
				case JSONSyntaxKind.CloseBracketToken:
					goodKind = true;
					arrayLevel--;
					checkRangeStatus(currentPos, State.INVALID);
					break;
				case JSONSyntaxKind.CommaToken:
					goodKind = true;
					checkRangeStatus(currentPos, State.BEFORE_OBJECT);
					break;
				case JSONSyntaxKind.OpenBraceToken:
					goodKind = true;
					objLevel++;
					checkRangeStatus(currentPos, State.INVALID);
					break;
				case JSONSyntaxKind.CloseBraceToken:
					goodKind = true;
					objLevel--;
					checkRangeStatus(currentPos, State.AFTER_OBJECT);
					break;
				case JSONSyntaxKind.Trivia:
				case JSONSyntaxKind.LineBreakTrivia:
					goodKind = true;
			}

			if (currentPos >= desiredPosition && (currentState !== State.INVALID || lastValidPos !== -1)) {
				let acceptPosition: number;
				let acceptState: State;

				if (currentState !== State.INVALID) {
					acceptPosition = (goodKind ? currentPos : scanner.getTokenOffset());
					acceptState = currentState;
				} else {
					acceptPosition = lastValidPos;
					acceptState = lastValidState;
				}

				if (acceptState as State === State.AFTER_OBJECT) {
					return {
						position: this.offsetToPosition(model, acceptPosition),
						prepend: ',',
						append: ''
					};
				} else {
					scanner.setPosition(acceptPosition);
					return {
						position: this.offsetToPosition(model, acceptPosition),
						prepend: '',
						append: this.hasOpenBrace(scanner) ? ',' : ''
					};
				}
			}
		}

		// no valid position found!
		const modelLineCount = model.getLineCount();
		return {
			position: new Position(modelLineCount, model.getLineMaxColumn(modelLineCount)),
			prepend: '\n[',
			append: ']'
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/test/browser/keybindingsEditorContribution.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/test/browser/keybindingsEditorContribution.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { KeybindingEditorDecorationsRenderer } from '../../browser/keybindingsEditorContribution.js';

suite('KeybindingsEditorContribution', () => {

	function assertUserSettingsFuzzyEquals(a: string, b: string, expected: boolean): void {
		const actual = KeybindingEditorDecorationsRenderer._userSettingsFuzzyEquals(a, b);
		const message = expected ? `${a} == ${b}` : `${a} != ${b}`;
		assert.strictEqual(actual, expected, 'fuzzy: ' + message);
	}

	function assertEqual(a: string, b: string): void {
		assertUserSettingsFuzzyEquals(a, b, true);
	}

	function assertDifferent(a: string, b: string): void {
		assertUserSettingsFuzzyEquals(a, b, false);
	}

	test('_userSettingsFuzzyEquals', () => {
		assertEqual('a', 'a');
		assertEqual('a', 'A');
		assertEqual('ctrl+a', 'CTRL+A');
		assertEqual('ctrl+a', ' CTRL+A ');

		assertEqual('ctrl+shift+a', 'shift+ctrl+a');
		assertEqual('ctrl+shift+a ctrl+alt+b', 'shift+ctrl+a alt+ctrl+b');

		assertDifferent('ctrl+[KeyA]', 'ctrl+a');

		// issue #23335
		assertEqual('cmd+shift+p', 'shift+cmd+p');
		assertEqual('cmd+shift+p', 'shift-cmd-p');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/test/browser/settingsTreeModels.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/test/browser/settingsTreeModels.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { settingKeyToDisplayFormat, parseQuery, IParsedQuery } from '../../browser/settingsTreeModels.js';

suite('SettingsTree', () => {
	test('settingKeyToDisplayFormat', () => {
		assert.deepStrictEqual(
			settingKeyToDisplayFormat('foo.bar'),
			{
				category: 'Foo',
				label: 'Bar'
			});

		assert.deepStrictEqual(
			settingKeyToDisplayFormat('foo.bar.etc'),
			{
				category: 'Foo › Bar',
				label: 'Etc'
			});

		assert.deepStrictEqual(
			settingKeyToDisplayFormat('fooBar.etcSomething'),
			{
				category: 'Foo Bar',
				label: 'Etc Something'
			});

		assert.deepStrictEqual(
			settingKeyToDisplayFormat('foo'),
			{
				category: '',
				label: 'Foo'
			});

		assert.deepStrictEqual(
			settingKeyToDisplayFormat('foo.1leading.number'),
			{
				category: 'Foo › 1leading',
				label: 'Number'
			});

		assert.deepStrictEqual(
			settingKeyToDisplayFormat('foo.1Leading.number'),
			{
				category: 'Foo › 1 Leading',
				label: 'Number'
			});
	});

	test('settingKeyToDisplayFormat - with category', () => {
		assert.deepStrictEqual(
			settingKeyToDisplayFormat('foo.bar', 'foo'),
			{
				category: '',
				label: 'Bar'
			});

		assert.deepStrictEqual(
			settingKeyToDisplayFormat('disableligatures.ligatures', 'disableligatures'),
			{
				category: '',
				label: 'Ligatures'
			});

		assert.deepStrictEqual(
			settingKeyToDisplayFormat('foo.bar.etc', 'foo'),
			{
				category: 'Bar',
				label: 'Etc'
			});

		assert.deepStrictEqual(
			settingKeyToDisplayFormat('fooBar.etcSomething', 'foo'),
			{
				category: 'Foo Bar',
				label: 'Etc Something'
			});

		assert.deepStrictEqual(
			settingKeyToDisplayFormat('foo.bar.etc', 'foo/bar'),
			{
				category: '',
				label: 'Etc'
			});

		assert.deepStrictEqual(
			settingKeyToDisplayFormat('foo.bar.etc', 'something/foo'),
			{
				category: 'Bar',
				label: 'Etc'
			});

		assert.deepStrictEqual(
			settingKeyToDisplayFormat('bar.etc', 'something.bar'),
			{
				category: '',
				label: 'Etc'
			});

		assert.deepStrictEqual(
			settingKeyToDisplayFormat('fooBar.etc', 'fooBar'),
			{
				category: '',
				label: 'Etc'
			});


		assert.deepStrictEqual(
			settingKeyToDisplayFormat('fooBar.somethingElse.etc', 'fooBar'),
			{
				category: 'Something Else',
				label: 'Etc'
			});
	});

	test('settingKeyToDisplayFormat - known acronym/term', () => {
		assert.deepStrictEqual(
			settingKeyToDisplayFormat('css.someCssSetting'),
			{
				category: 'CSS',
				label: 'Some CSS Setting'
			});

		assert.deepStrictEqual(
			settingKeyToDisplayFormat('powershell.somePowerShellSetting'),
			{
				category: 'PowerShell',
				label: 'Some PowerShell Setting'
			});
	});

	test('parseQuery', () => {
		function testParseQuery(input: string, expected: IParsedQuery) {
			assert.deepStrictEqual(
				parseQuery(input),
				expected,
				input
			);
		}

		testParseQuery(
			'',
			<IParsedQuery>{
				tags: [],
				extensionFilters: [],
				query: '',
				featureFilters: [],
				idFilters: [],
				languageFilter: undefined
			});

		testParseQuery(
			'@modified',
			<IParsedQuery>{
				tags: ['modified'],
				extensionFilters: [],
				query: '',
				featureFilters: [],
				idFilters: [],
				languageFilter: undefined
			});

		testParseQuery(
			'@tag:foo',
			<IParsedQuery>{
				tags: ['foo'],
				extensionFilters: [],
				query: '',
				featureFilters: [],
				idFilters: [],
				languageFilter: undefined
			});

		testParseQuery(
			'@modified foo',
			<IParsedQuery>{
				tags: ['modified'],
				extensionFilters: [],
				query: 'foo',
				featureFilters: [],
				idFilters: [],
				languageFilter: undefined
			});

		testParseQuery(
			'@tag:foo @modified',
			<IParsedQuery>{
				tags: ['foo', 'modified'],
				extensionFilters: [],
				query: '',
				featureFilters: [],
				idFilters: [],
				languageFilter: undefined
			});

		testParseQuery(
			'@tag:foo @modified my query',
			<IParsedQuery>{
				tags: ['foo', 'modified'],
				extensionFilters: [],
				query: 'my query',
				featureFilters: [],
				idFilters: [],
				languageFilter: undefined
			});

		testParseQuery(
			'test @modified query',
			<IParsedQuery>{
				tags: ['modified'],
				extensionFilters: [],
				query: 'test  query',
				featureFilters: [],
				idFilters: [],
				languageFilter: undefined
			});

		testParseQuery(
			'test @modified',
			<IParsedQuery>{
				tags: ['modified'],
				extensionFilters: [],
				query: 'test',
				featureFilters: [],
				idFilters: [],
				languageFilter: undefined
			});

		testParseQuery(
			'query has @ for some reason',
			<IParsedQuery>{
				tags: [],
				extensionFilters: [],
				query: 'query has @ for some reason',
				featureFilters: [],
				idFilters: [],
				languageFilter: undefined
			});

		testParseQuery(
			'@ext:github.vscode-pull-request-github',
			<IParsedQuery>{
				tags: [],
				extensionFilters: ['github.vscode-pull-request-github'],
				query: '',
				featureFilters: [],
				idFilters: [],
				languageFilter: undefined
			});

		testParseQuery(
			'@ext:github.vscode-pull-request-github,vscode.git',
			<IParsedQuery>{
				tags: [],
				extensionFilters: ['github.vscode-pull-request-github', 'vscode.git'],
				query: '',
				featureFilters: [],
				idFilters: [],
				languageFilter: undefined
			});
		testParseQuery(
			'@feature:scm',
			<IParsedQuery>{
				tags: [],
				extensionFilters: [],
				featureFilters: ['scm'],
				query: '',
				idFilters: [],
				languageFilter: undefined
			});

		testParseQuery(
			'@feature:scm,terminal',
			<IParsedQuery>{
				tags: [],
				extensionFilters: [],
				featureFilters: ['scm', 'terminal'],
				query: '',
				idFilters: [],
				languageFilter: undefined
			});
		testParseQuery(
			'@id:files.autoSave',
			<IParsedQuery>{
				tags: [],
				extensionFilters: [],
				featureFilters: [],
				query: '',
				idFilters: ['files.autoSave'],
				languageFilter: undefined
			});

		testParseQuery(
			'@id:files.autoSave,terminal.integrated.commandsToSkipShell',
			<IParsedQuery>{
				tags: [],
				extensionFilters: [],
				featureFilters: [],
				query: '',
				idFilters: ['files.autoSave', 'terminal.integrated.commandsToSkipShell'],
				languageFilter: undefined
			});

		testParseQuery(
			'@lang:cpp',
			<IParsedQuery>{
				tags: [],
				extensionFilters: [],
				featureFilters: [],
				query: '',
				idFilters: [],
				languageFilter: 'cpp'
			});

		testParseQuery(
			'@lang:cpp,python',
			<IParsedQuery>{
				tags: [],
				extensionFilters: [],
				featureFilters: [],
				query: '',
				idFilters: [],
				languageFilter: 'cpp'
			});
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/test/common/smartSnippetInserter.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/test/common/smartSnippetInserter.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { SmartSnippetInserter } from '../../common/smartSnippetInserter.js';
import { createTextModel } from '../../../../../editor/test/common/testTextModel.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('SmartSnippetInserter', () => {

	function testSmartSnippetInserter(text: string[], runner: (assert: (desiredPos: Position, pos: Position, prepend: string, append: string) => void) => void): void {
		const model = createTextModel(text.join('\n'));
		runner((desiredPos, pos, prepend, append) => {
			const actual = SmartSnippetInserter.insertSnippet(model, desiredPos);
			const expected = {
				position: pos,
				prepend,
				append
			};
			assert.deepStrictEqual(actual, expected);
		});
		model.dispose();
	}

	test('empty text', () => {
		testSmartSnippetInserter([
		], (assert) => {
			assert(new Position(1, 1), new Position(1, 1), '\n[', ']');
		});

		testSmartSnippetInserter([
			' '
		], (assert) => {
			assert(new Position(1, 1), new Position(1, 2), '\n[', ']');
			assert(new Position(1, 2), new Position(1, 2), '\n[', ']');
		});

		testSmartSnippetInserter([
			'// just some text'
		], (assert) => {
			assert(new Position(1, 1), new Position(1, 18), '\n[', ']');
			assert(new Position(1, 18), new Position(1, 18), '\n[', ']');
		});

		testSmartSnippetInserter([
			'// just some text',
			''
		], (assert) => {
			assert(new Position(1, 1), new Position(2, 1), '\n[', ']');
			assert(new Position(1, 18), new Position(2, 1), '\n[', ']');
			assert(new Position(2, 1), new Position(2, 1), '\n[', ']');
		});
	});

	test('empty array 1', () => {
		testSmartSnippetInserter([
			'// just some text',
			'[]'
		], (assert) => {
			assert(new Position(1, 1), new Position(2, 2), '', '');
			assert(new Position(2, 1), new Position(2, 2), '', '');
			assert(new Position(2, 2), new Position(2, 2), '', '');
			assert(new Position(2, 3), new Position(2, 2), '', '');
		});
	});

	test('empty array 2', () => {
		testSmartSnippetInserter([
			'// just some text',
			'[',
			']'
		], (assert) => {
			assert(new Position(1, 1), new Position(2, 2), '', '');
			assert(new Position(2, 1), new Position(2, 2), '', '');
			assert(new Position(2, 2), new Position(2, 2), '', '');
			assert(new Position(3, 1), new Position(3, 1), '', '');
			assert(new Position(3, 2), new Position(3, 1), '', '');
		});
	});

	test('empty array 3', () => {
		testSmartSnippetInserter([
			'// just some text',
			'[',
			'// just some text',
			']'
		], (assert) => {
			assert(new Position(1, 1), new Position(2, 2), '', '');
			assert(new Position(2, 1), new Position(2, 2), '', '');
			assert(new Position(2, 2), new Position(2, 2), '', '');
			assert(new Position(3, 1), new Position(3, 1), '', '');
			assert(new Position(3, 2), new Position(3, 1), '', '');
			assert(new Position(4, 1), new Position(4, 1), '', '');
			assert(new Position(4, 2), new Position(4, 1), '', '');
		});
	});

	test('one element array 1', () => {
		testSmartSnippetInserter([
			'// just some text',
			'[',
			'{}',
			']'
		], (assert) => {
			assert(new Position(1, 1), new Position(2, 2), '', ',');
			assert(new Position(2, 1), new Position(2, 2), '', ',');
			assert(new Position(2, 2), new Position(2, 2), '', ',');
			assert(new Position(3, 1), new Position(3, 1), '', ',');
			assert(new Position(3, 2), new Position(3, 1), '', ',');
			assert(new Position(3, 3), new Position(3, 3), ',', '');
			assert(new Position(4, 1), new Position(4, 1), ',', '');
			assert(new Position(4, 2), new Position(4, 1), ',', '');
		});
	});

	test('two elements array 1', () => {
		testSmartSnippetInserter([
			'// just some text',
			'[',
			'{},',
			'{}',
			']'
		], (assert) => {
			assert(new Position(1, 1), new Position(2, 2), '', ',');
			assert(new Position(2, 1), new Position(2, 2), '', ',');
			assert(new Position(2, 2), new Position(2, 2), '', ',');
			assert(new Position(3, 1), new Position(3, 1), '', ',');
			assert(new Position(3, 2), new Position(3, 1), '', ',');
			assert(new Position(3, 3), new Position(3, 3), ',', '');
			assert(new Position(3, 4), new Position(3, 4), '', ',');
			assert(new Position(4, 1), new Position(4, 1), '', ',');
			assert(new Position(4, 2), new Position(4, 1), '', ',');
			assert(new Position(4, 3), new Position(4, 3), ',', '');
			assert(new Position(5, 1), new Position(5, 1), ',', '');
			assert(new Position(5, 2), new Position(5, 1), ',', '');
		});
	});

	test('two elements array 2', () => {
		testSmartSnippetInserter([
			'// just some text',
			'[',
			'{},{}',
			']'
		], (assert) => {
			assert(new Position(1, 1), new Position(2, 2), '', ',');
			assert(new Position(2, 1), new Position(2, 2), '', ',');
			assert(new Position(2, 2), new Position(2, 2), '', ',');
			assert(new Position(3, 1), new Position(3, 1), '', ',');
			assert(new Position(3, 2), new Position(3, 1), '', ',');
			assert(new Position(3, 3), new Position(3, 3), ',', '');
			assert(new Position(3, 4), new Position(3, 4), '', ',');
			assert(new Position(3, 5), new Position(3, 4), '', ',');
			assert(new Position(3, 6), new Position(3, 6), ',', '');
			assert(new Position(4, 1), new Position(4, 1), ',', '');
			assert(new Position(4, 2), new Position(4, 1), ',', '');
		});
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/processExplorer/browser/processExplorer.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/processExplorer/browser/processExplorer.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution, registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { IEditorSerializer, EditorExtensions, IEditorFactoryRegistry, GroupIdentifier } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IEditorResolverService, RegisteredEditorPriority } from '../../../services/editor/common/editorResolverService.js';
import { ProcessExplorerEditorInput } from './processExplorerEditorInput.js';
import { Action2, MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { AUX_WINDOW_GROUP, IEditorService } from '../../../services/editor/common/editorService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IRectangle } from '../../../../platform/window/common/window.js';
import { IAuxiliaryWindowService } from '../../../services/auxiliaryWindow/browser/auxiliaryWindowService.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { RemoteNameContext } from '../../../common/contextkeys.js';
import { IsWebContext } from '../../../../platform/contextkey/common/contextkeys.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';

//#region --- process explorer

class ProcessExplorerEditorContribution implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.processExplorerEditor';

	constructor(
		@IEditorResolverService editorResolverService: IEditorResolverService,
		@IInstantiationService instantiationService: IInstantiationService
	) {
		editorResolverService.registerEditor(
			`${ProcessExplorerEditorInput.RESOURCE.scheme}:**/**`,
			{
				id: ProcessExplorerEditorInput.ID,
				label: localize('promptOpenWith.processExplorer.displayName', "Process Explorer"),
				priority: RegisteredEditorPriority.exclusive
			},
			{
				singlePerResource: true,
				canSupportResource: resource => resource.scheme === ProcessExplorerEditorInput.RESOURCE.scheme
			},
			{
				createEditorInput: () => {
					return {
						editor: instantiationService.createInstance(ProcessExplorerEditorInput),
						options: {
							pinned: true
						}
					};
				}
			}
		);
	}
}

registerWorkbenchContribution2(ProcessExplorerEditorContribution.ID, ProcessExplorerEditorContribution, WorkbenchPhase.BlockStartup);

class ProcessExplorerEditorInputSerializer implements IEditorSerializer {

	canSerialize(editorInput: EditorInput): boolean {
		return true;
	}

	serialize(editorInput: EditorInput): string {
		return '';
	}

	deserialize(instantiationService: IInstantiationService): EditorInput {
		return ProcessExplorerEditorInput.instance;
	}
}

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(ProcessExplorerEditorInput.ID, ProcessExplorerEditorInputSerializer);

//#endregion

//#region --- process explorer commands

const supported = ContextKeyExpr.or(IsWebContext.negate(), RemoteNameContext.notEqualsTo('')); // only on desktop or in web with a remote

interface IProcessExplorerWindowState {
	readonly bounds: Partial<IRectangle>;
}

class OpenProcessExplorer extends Action2 {

	static readonly ID = 'workbench.action.openProcessExplorer';

	private static readonly STATE_KEY = 'workbench.processExplorerWindowState';
	private static readonly DEFAULT_STATE: IProcessExplorerWindowState = { bounds: { width: 800, height: 500 } };

	constructor() {
		super({
			id: OpenProcessExplorer.ID,
			title: localize2('openProcessExplorer', 'Open Process Explorer'),
			category: Categories.Developer,
			precondition: supported,
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const editorGroupService = accessor.get(IEditorGroupsService);
		const auxiliaryWindowService = accessor.get(IAuxiliaryWindowService);
		const storageService = accessor.get(IStorageService);

		const pane = await editorService.openEditor({
			resource: ProcessExplorerEditorInput.RESOURCE,
			options: {
				pinned: true,
				revealIfOpened: true,
				auxiliary: {
					...this.loadState(storageService),
					compact: true,
					alwaysOnTop: true
				}
			}
		}, AUX_WINDOW_GROUP);

		if (pane) {
			const listener = pane.input?.onWillDispose(() => {
				listener?.dispose();
				this.saveState(pane.group.id, storageService, editorGroupService, auxiliaryWindowService);
			});
		}
	}

	private loadState(storageService: IStorageService): IProcessExplorerWindowState {
		const stateRaw = storageService.get(OpenProcessExplorer.STATE_KEY, StorageScope.APPLICATION);
		if (!stateRaw) {
			return OpenProcessExplorer.DEFAULT_STATE;
		}

		try {
			return JSON.parse(stateRaw);
		} catch {
			return OpenProcessExplorer.DEFAULT_STATE;
		}
	}

	private saveState(group: GroupIdentifier, storageService: IStorageService, editorGroupService: IEditorGroupsService, auxiliaryWindowService: IAuxiliaryWindowService): void {
		const auxiliaryWindow = auxiliaryWindowService.getWindow(editorGroupService.getPart(group).windowId);
		if (!auxiliaryWindow) {
			return;
		}

		const bounds = auxiliaryWindow.createState().bounds;
		if (!bounds) {
			return;
		}

		storageService.store(OpenProcessExplorer.STATE_KEY, JSON.stringify({ bounds }), StorageScope.APPLICATION, StorageTarget.MACHINE);
	}
}

registerAction2(OpenProcessExplorer);

MenuRegistry.appendMenuItem(MenuId.MenubarHelpMenu, {
	group: '5_tools',
	command: {
		id: OpenProcessExplorer.ID,
		title: localize({ key: 'miOpenProcessExplorerer', comment: ['&& denotes a mnemonic'] }, "Open &&Process Explorer")
	},
	when: supported,
	order: 2
});

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/processExplorer/browser/processExplorer.web.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/processExplorer/browser/processExplorer.web.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { EditorExtensions } from '../../../common/editor.js';
import { ProcessExplorerEditorInput } from './processExplorerEditorInput.js';
import { ProcessExplorerEditor } from './processExplorerEditor.js';

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(ProcessExplorerEditor, ProcessExplorerEditor.ID, localize('processExplorer', "Process Explorer")),
	[new SyncDescriptor(ProcessExplorerEditorInput)]
);
```

--------------------------------------------------------------------------------

````
