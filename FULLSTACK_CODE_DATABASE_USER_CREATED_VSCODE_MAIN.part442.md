---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 442
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 442 of 552)

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

---[FILE: src/vs/workbench/contrib/scm/browser/quickDiffWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/scm/browser/quickDiffWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import * as dom from '../../../../base/browser/dom.js';
import * as domStylesheetsJs from '../../../../base/browser/domStylesheets.js';
import { Action, ActionRunner, IAction } from '../../../../base/common/actions.js';
import { Event } from '../../../../base/common/event.js';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { ISelectOptionItem } from '../../../../base/browser/ui/selectBox/selectBox.js';
import { SelectActionViewItem } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { defaultSelectBoxStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { IColorTheme, IThemeService } from '../../../../platform/theme/common/themeService.js';
import { peekViewBorder, peekViewTitleBackground, peekViewTitleForeground, peekViewTitleInfoForeground, PeekViewWidget } from '../../../../editor/contrib/peekView/browser/peekView.js';
import { editorBackground } from '../../../../platform/theme/common/colorRegistry.js';
import { IMenu, IMenuService, MenuId, MenuItemAction, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { ICodeEditor, IEditorMouseEvent, MouseTargetType } from '../../../../editor/browser/editorBrowser.js';
import { EditorAction, registerEditorAction } from '../../../../editor/browser/editorExtensions.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { EmbeddedDiffEditorWidget } from '../../../../editor/browser/widget/diffEditor/embeddedDiffEditorWidget.js';
import { IEditorContribution, ScrollType } from '../../../../editor/common/editorCommon.js';
import { IQuickDiffModelService, QuickDiffModel } from './quickDiffModel.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { rot } from '../../../../base/common/numbers.js';
import { ISplice } from '../../../../base/common/sequence.js';
import { ChangeType, getChangeHeight, getChangeType, getChangeTypeColor, getModifiedEndLineNumber, IQuickDiffService, lineIntersectsChange, QuickDiff, QuickDiffChange } from '../common/quickDiff.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { TextCompareEditorActiveContext } from '../../../common/contextkeys.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IChange } from '../../../../editor/common/diff/legacyLinesDiffComputer.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { basename } from '../../../../base/common/resources.js';
import { EditorOption, IDiffEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { getFlatActionBarActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IActionBarOptions } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { gotoNextLocation, gotoPreviousLocation } from '../../../../platform/theme/common/iconRegistry.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Color } from '../../../../base/common/color.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { getOuterEditor } from '../../../../editor/browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { quickDiffDecorationCount } from './quickDiffDecorator.js';
import { hasNativeContextMenu } from '../../../../platform/window/common/window.js';

export const isQuickDiffVisible = new RawContextKey<boolean>('dirtyDiffVisible', false);

export interface IQuickDiffSelectItem extends ISelectOptionItem {
	providerId: string;
}

export class QuickDiffPickerViewItem extends SelectActionViewItem<IQuickDiffSelectItem> {
	private optionsItems: IQuickDiffSelectItem[] = [];

	constructor(
		action: IAction,
		@IContextViewService contextViewService: IContextViewService,
		@IThemeService themeService: IThemeService,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		const styles = { ...defaultSelectBoxStyles };
		const theme = themeService.getColorTheme();
		const editorBackgroundColor = theme.getColor(editorBackground);
		const peekTitleColor = theme.getColor(peekViewTitleBackground);
		const opaqueTitleColor = peekTitleColor?.makeOpaque(editorBackgroundColor!) ?? editorBackgroundColor!;
		styles.selectBackground = opaqueTitleColor.lighten(.6).toString();
		super(null, action, [], 0, contextViewService, styles, { ariaLabel: nls.localize('remotes', 'Switch quick diff base'), useCustomDrawn: !hasNativeContextMenu(configurationService) });
	}

	public setSelection(quickDiffs: QuickDiff[], providerId: string) {
		this.optionsItems = quickDiffs.map(quickDiff => ({ providerId: quickDiff.id, text: quickDiff.label }));
		const index = this.optionsItems.findIndex(item => item.providerId === providerId);
		this.setOptions(this.optionsItems, index);
	}

	protected override getActionContext(_: string, index: number): IQuickDiffSelectItem {
		return this.optionsItems[index];
	}

	override render(container: HTMLElement): void {
		super.render(container);
		this.setFocusable(true);
	}
}

export class QuickDiffPickerBaseAction extends Action {

	public static readonly ID = 'quickDiff.base.switch';
	public static readonly LABEL = nls.localize('quickDiff.base.switch', "Switch Quick Diff Base");

	constructor(private readonly callback: (event?: IQuickDiffSelectItem) => void) {
		super(QuickDiffPickerBaseAction.ID, QuickDiffPickerBaseAction.LABEL, undefined, undefined);
	}

	override async run(event?: IQuickDiffSelectItem): Promise<void> {
		return this.callback(event);
	}
}

class QuickDiffWidgetActionRunner extends ActionRunner {

	protected override runAction(action: IAction, context: unknown[]): Promise<void> {
		if (action instanceof MenuItemAction) {
			return action.run(...context);
		}

		return super.runAction(action, context);
	}
}

class QuickDiffWidgetEditorAction extends Action {

	private editor: ICodeEditor;
	private action: EditorAction;
	private instantiationService: IInstantiationService;

	constructor(
		editor: ICodeEditor,
		action: EditorAction,
		cssClass: string,
		@IKeybindingService keybindingService: IKeybindingService,
		@IInstantiationService instantiationService: IInstantiationService
	) {
		const keybinding = keybindingService.lookupKeybinding(action.id);
		const label = action.label + (keybinding ? ` (${keybinding.getLabel()})` : '');

		super(action.id, label, cssClass);

		this.instantiationService = instantiationService;
		this.action = action;
		this.editor = editor;
	}

	override run(): Promise<void> {
		return Promise.resolve(this.instantiationService.invokeFunction(accessor => this.action.run(accessor, this.editor, null)));
	}
}

class QuickDiffWidget extends PeekViewWidget {

	private diffEditor!: EmbeddedDiffEditorWidget;
	private title: string;
	private menu: IMenu | undefined;
	private _index: number = 0;
	private _providerId: string = '';
	private change: IChange | undefined;
	private height: number | undefined = undefined;
	private dropdown: QuickDiffPickerViewItem | undefined;
	private dropdownContainer: HTMLElement | undefined;

	constructor(
		editor: ICodeEditor,
		private model: QuickDiffModel,
		@IThemeService private readonly themeService: IThemeService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IMenuService private readonly menuService: IMenuService,
		@IContextKeyService private contextKeyService: IContextKeyService,
		@IQuickDiffService private readonly quickDiffService: IQuickDiffService
	) {
		super(editor, { isResizeable: true, frameWidth: 1, keepEditorSelection: true, className: 'dirty-diff' }, instantiationService);

		this._disposables.add(themeService.onDidColorThemeChange(this._applyTheme, this));
		this._applyTheme(themeService.getColorTheme());

		if (!Iterable.isEmpty(this.model.originalTextModels)) {
			contextKeyService = contextKeyService.createOverlay([
				['originalResourceScheme', Iterable.first(this.model.originalTextModels)?.uri.scheme],
				['originalResourceSchemes', Iterable.map(this.model.originalTextModels, textModel => textModel.uri.scheme)]]);
		}

		this.create();
		if (editor.hasModel()) {
			this.title = basename(editor.getModel().uri);
		} else {
			this.title = '';
		}
		this.setTitle(this.title);
	}

	get providerId(): string {
		return this._providerId;
	}

	get index(): number {
		return this._index;
	}

	get visibleRange(): Range | undefined {
		const visibleRanges = this.diffEditor.getModifiedEditor().getVisibleRanges();
		return visibleRanges.length >= 0 ? visibleRanges[0] : undefined;
	}

	showChange(index: number, usePosition: boolean = true): void {
		const labeledChange = this.model.changes[index];
		const change = labeledChange.change;
		this._index = index;
		this.contextKeyService.createKey('originalResource', this.model.changes[index].original.toString());
		this.contextKeyService.createKey('originalResourceScheme', this.model.changes[index].original.scheme);
		this.updateActions();

		this.change = change;
		this._providerId = labeledChange.providerId;

		if (Iterable.isEmpty(this.model.originalTextModels)) {
			return;
		}

		const onFirstDiffUpdate = Event.once(this.diffEditor.onDidUpdateDiff);

		// TODO@joao TODO@alex need this setTimeout probably because the
		// non-side-by-side diff still hasn't created the view zones
		onFirstDiffUpdate(() => setTimeout(() => this.revealChange(change), 0));

		const diffEditorModel = this.model.getDiffEditorModel(labeledChange.original);
		if (!diffEditorModel) {
			return;
		}
		this.diffEditor.setModel(diffEditorModel);

		const position = new Position(getModifiedEndLineNumber(change), 1);

		const lineHeight = this.editor.getOption(EditorOption.lineHeight);
		const editorHeight = this.editor.getLayoutInfo().height;
		const editorHeightInLines = Math.floor(editorHeight / lineHeight);
		const height = Math.min(
			getChangeHeight(change) + 2 /* arrow, frame, header */ + 6 /* 3 lines above/below the change */,
			Math.floor(editorHeightInLines / 3));

		this.renderTitle();
		this.updateDropdown();

		const changeType = getChangeType(change);
		const changeTypeColor = getChangeTypeColor(this.themeService.getColorTheme(), changeType);
		this.style({ frameColor: changeTypeColor, arrowColor: changeTypeColor });

		const providerSpecificChanges: IChange[] = [];
		let contextIndex = index;
		for (const change of this.model.changes) {
			if (change.providerId === this.model.changes[this._index].providerId) {
				providerSpecificChanges.push(change.change);
				if (labeledChange === change) {
					contextIndex = providerSpecificChanges.length - 1;
				}
			}
		}
		this._actionbarWidget!.context = [diffEditorModel.modified.uri, providerSpecificChanges, contextIndex];
		if (usePosition) {
			// In order to account for the 1px border-top of the content element we
			// have to add 1px. The pixel value needs to be expressed as a fraction
			// of the line height.
			this.show(position, height + (1 / lineHeight));
			this.editor.setPosition(position);
			this.editor.focus();
		}
	}

	private renderTitle(): void {
		const providerChanges = this.model.quickDiffChanges.get(this._providerId)!;
		const providerIndex = providerChanges.indexOf(this._index);

		let detail: string;
		if (!this.shouldUseDropdown()) {
			const label = this.model.quickDiffs
				.find(quickDiff => quickDiff.id === this._providerId)?.label ?? '';

			detail = this.model.changes.length > 1
				? nls.localize('changes', "{0} - {1} of {2} changes", label, providerIndex + 1, providerChanges.length)
				: nls.localize('change', "{0} - {1} of {2} change", label, providerIndex + 1, providerChanges.length);
			this.dropdownContainer!.style.display = 'none';
		} else {
			detail = this.model.changes.length > 1
				? nls.localize('multiChanges', "{0} of {1} changes", providerIndex + 1, providerChanges.length)
				: nls.localize('multiChange', "{0} of {1} change", providerIndex + 1, providerChanges.length);
			this.dropdownContainer!.style.display = 'inherit';
		}

		this.setTitle(this.title, detail);
	}

	private switchQuickDiff(event?: IQuickDiffSelectItem) {
		const newProviderId = event?.providerId;
		if (newProviderId === this.model.changes[this._index].providerId) {
			return;
		}
		let closestGreaterIndex = this._index < this.model.changes.length - 1 ? this._index + 1 : 0;
		for (let i = closestGreaterIndex; i !== this._index; i < this.model.changes.length - 1 ? i++ : i = 0) {
			if (this.model.changes[i].providerId === newProviderId) {
				closestGreaterIndex = i;
				break;
			}
		}
		let closestLesserIndex = this._index > 0 ? this._index - 1 : this.model.changes.length - 1;
		for (let i = closestLesserIndex; i !== this._index; i > 0 ? i-- : i = this.model.changes.length - 1) {
			if (this.model.changes[i].providerId === newProviderId) {
				closestLesserIndex = i;
				break;
			}
		}
		const closestIndex = Math.abs(this.model.changes[closestGreaterIndex].change.modifiedEndLineNumber - this.model.changes[this._index].change.modifiedEndLineNumber)
			< Math.abs(this.model.changes[closestLesserIndex].change.modifiedEndLineNumber - this.model.changes[this._index].change.modifiedEndLineNumber)
			? closestGreaterIndex : closestLesserIndex;
		this.showChange(closestIndex, false);
	}

	private shouldUseDropdown(): boolean {
		const quickDiffs = this.getQuickDiffsContainingChange();
		return quickDiffs.length > 1;
	}

	private updateActions(): void {
		if (!this._actionbarWidget) {
			return;
		}
		const previous = this.instantiationService.createInstance(QuickDiffWidgetEditorAction, this.editor, new ShowPreviousChangeAction(this.editor), ThemeIcon.asClassName(gotoPreviousLocation));
		const next = this.instantiationService.createInstance(QuickDiffWidgetEditorAction, this.editor, new ShowNextChangeAction(this.editor), ThemeIcon.asClassName(gotoNextLocation));

		this._disposables.add(previous);
		this._disposables.add(next);

		if (this.menu) {
			this.menu.dispose();
		}
		this.menu = this.menuService.createMenu(MenuId.SCMChangeContext, this.contextKeyService);
		const actions = getFlatActionBarActions(this.menu.getActions({ shouldForwardArgs: true }));
		this._actionbarWidget.clear();
		this._actionbarWidget.push(actions.reverse(), { label: false, icon: true });
		this._actionbarWidget.push([next, previous], { label: false, icon: true });
		this._actionbarWidget.push(this._disposables.add(new Action('peekview.close', nls.localize('label.close', "Close"), ThemeIcon.asClassName(Codicon.close), true, () => this.dispose())), { label: false, icon: true });
	}

	private updateDropdown(): void {
		const quickDiffs = this.getQuickDiffsContainingChange();
		this.dropdown?.setSelection(quickDiffs, this._providerId);
	}

	private getQuickDiffsContainingChange(): QuickDiff[] {
		const change = this.model.changes[this._index];

		const quickDiffsWithChange = this.model.changes
			.filter(c => change.change2.modified.intersectsOrTouches(c.change2.modified))
			.map(c => c.providerId);

		return this.model.quickDiffs
			.filter(quickDiff => quickDiffsWithChange.includes(quickDiff.id) &&
				this.quickDiffService.isQuickDiffProviderVisible(quickDiff.id));
	}

	protected override _fillHead(container: HTMLElement): void {
		super._fillHead(container, true);

		// Render an empty picker which will be populated later
		const action = new QuickDiffPickerBaseAction((event?: IQuickDiffSelectItem) => this.switchQuickDiff(event));
		this._disposables.add(action);

		this.dropdownContainer = dom.prepend(this._titleElement!, dom.$('.dropdown'));
		this.dropdown = this.instantiationService.createInstance(QuickDiffPickerViewItem, action);
		this.dropdown.render(this.dropdownContainer);
	}

	protected override _getActionBarOptions(): IActionBarOptions {
		const actionRunner = new QuickDiffWidgetActionRunner();
		this._disposables.add(actionRunner);

		// close widget on successful action
		this._disposables.add(actionRunner.onDidRun(e => {
			if (!(e.action instanceof QuickDiffWidgetEditorAction) && !e.error) {
				this.dispose();
			}
		}));

		return {
			...super._getActionBarOptions(),
			actionRunner
		};
	}

	protected _fillBody(container: HTMLElement): void {
		const options: IDiffEditorOptions = {
			diffAlgorithm: 'advanced',
			fixedOverflowWidgets: true,
			ignoreTrimWhitespace: false,
			minimap: { enabled: false },
			readOnly: false,
			renderGutterMenu: false,
			renderIndicators: false,
			renderOverviewRuler: false,
			renderSideBySide: false,
			scrollbar: {
				verticalScrollbarSize: 14,
				horizontal: 'auto',
				useShadows: true,
				verticalHasArrows: false,
				horizontalHasArrows: false
			},
			scrollBeyondLastLine: false,
			stickyScroll: { enabled: false }
		};

		this.diffEditor = this.instantiationService.createInstance(EmbeddedDiffEditorWidget, container, options, {}, this.editor);
		this._disposables.add(this.diffEditor);
	}

	protected override _onWidth(width: number): void {
		if (typeof this.height === 'undefined') {
			return;
		}

		this.diffEditor.layout({ height: this.height, width });
	}

	protected override _doLayoutBody(height: number, width: number): void {
		super._doLayoutBody(height, width);
		this.diffEditor.layout({ height, width });

		if (typeof this.height === 'undefined' && this.change) {
			this.revealChange(this.change);
		}

		this.height = height;
	}

	private revealChange(change: IChange): void {
		let start: number, end: number;

		if (change.modifiedEndLineNumber === 0) { // deletion
			start = change.modifiedStartLineNumber;
			end = change.modifiedStartLineNumber + 1;
		} else if (change.originalEndLineNumber > 0) { // modification
			start = change.modifiedStartLineNumber - 1;
			end = change.modifiedEndLineNumber + 1;
		} else { // insertion
			start = change.modifiedStartLineNumber;
			end = change.modifiedEndLineNumber;
		}

		this.diffEditor.revealLinesInCenter(start, end, ScrollType.Immediate);
	}

	private _applyTheme(theme: IColorTheme) {
		const borderColor = theme.getColor(peekViewBorder) || Color.transparent;
		this.style({
			arrowColor: borderColor,
			frameColor: borderColor,
			headerBackgroundColor: theme.getColor(peekViewTitleBackground) || Color.transparent,
			primaryHeadingColor: theme.getColor(peekViewTitleForeground),
			secondaryHeadingColor: theme.getColor(peekViewTitleInfoForeground)
		});
	}

	protected override revealRange(range: Range) {
		this.editor.revealLineInCenterIfOutsideViewport(range.endLineNumber, ScrollType.Smooth);
	}

	override hasFocus(): boolean {
		return this.diffEditor.hasTextFocus();
	}

	override dispose() {
		this.dropdown?.dispose();
		this.menu?.dispose();
		super.dispose();
	}
}

export class QuickDiffEditorController extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.quickdiff';

	static get(editor: ICodeEditor): QuickDiffEditorController | null {
		return editor.getContribution<QuickDiffEditorController>(QuickDiffEditorController.ID);
	}

	private model: QuickDiffModel | null = null;
	private widget: QuickDiffWidget | null = null;
	private readonly isQuickDiffVisible!: IContextKey<boolean>;
	private session: IDisposable = Disposable.None;
	private mouseDownInfo: { lineNumber: number } | null = null;
	private enabled = false;
	private readonly gutterActionDisposables = new DisposableStore();
	private stylesheet: HTMLStyleElement;

	constructor(
		private editor: ICodeEditor,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IQuickDiffModelService private readonly quickDiffModelService: IQuickDiffModelService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();
		this.enabled = !contextKeyService.getContextKeyValue('isInDiffEditor');
		this.stylesheet = domStylesheetsJs.createStyleSheet(undefined, undefined, this._store);

		if (this.enabled) {
			this.isQuickDiffVisible = isQuickDiffVisible.bindTo(contextKeyService);
			this._register(editor.onDidChangeModel(() => this.close()));

			const onDidChangeGutterAction = Event.filter(configurationService.onDidChangeConfiguration, e => e.affectsConfiguration('scm.diffDecorationsGutterAction'));
			this._register(onDidChangeGutterAction(this.onDidChangeGutterAction, this));
			this.onDidChangeGutterAction();
		}
	}

	private onDidChangeGutterAction(): void {
		const gutterAction = this.configurationService.getValue<'diff' | 'none'>('scm.diffDecorationsGutterAction');

		this.gutterActionDisposables.clear();

		if (gutterAction === 'diff') {
			this.gutterActionDisposables.add(this.editor.onMouseDown(e => this.onEditorMouseDown(e)));
			this.gutterActionDisposables.add(this.editor.onMouseUp(e => this.onEditorMouseUp(e)));
			this.stylesheet.textContent = `
				.monaco-editor .dirty-diff-glyph {
					cursor: pointer;
				}

				.monaco-editor .margin-view-overlays .dirty-diff-glyph:hover::before {
					height: 100%;
					width: 6px;
					left: -6px;
				}

				.monaco-editor .margin-view-overlays .dirty-diff-deleted:hover::after {
					bottom: 0;
					border-top-width: 0;
					border-bottom-width: 0;
				}
			`;
		} else {
			this.stylesheet.textContent = ``;
		}
	}

	canNavigate(): boolean {
		return !this.widget || (this.widget?.index === -1) || (!!this.model && this.model.changes.length > 1);
	}

	refresh(): void {
		this.widget?.showChange(this.widget.index, false);
	}

	next(lineNumber?: number): void {
		if (!this.assertWidget()) {
			return;
		}
		if (!this.widget || !this.model) {
			return;
		}

		let index: number;
		if (this.editor.hasModel() && (typeof lineNumber === 'number' || !this.widget.providerId)) {
			index = this.model.findNextClosestChange(typeof lineNumber === 'number' ? lineNumber : this.editor.getPosition().lineNumber, true, this.widget.providerId);
		} else {
			const providerChanges: number[] = this.model.quickDiffChanges.get(this.widget.providerId) ?? this.model.quickDiffChanges.values().next().value!;
			const mapIndex = providerChanges.findIndex(value => value === this.widget!.index);
			index = providerChanges[rot(mapIndex + 1, providerChanges.length)];
		}

		this.widget.showChange(index);
	}

	previous(lineNumber?: number): void {
		if (!this.assertWidget()) {
			return;
		}
		if (!this.widget || !this.model) {
			return;
		}

		let index: number;
		if (this.editor.hasModel() && (typeof lineNumber === 'number' || !this.widget.providerId)) {
			index = this.model.findPreviousClosestChange(typeof lineNumber === 'number' ? lineNumber : this.editor.getPosition().lineNumber, true, this.widget.providerId);
		} else {
			const providerChanges: number[] = this.model.quickDiffChanges.get(this.widget.providerId) ?? this.model.quickDiffChanges.values().next().value!;
			const mapIndex = providerChanges.findIndex(value => value === this.widget!.index);
			index = providerChanges[rot(mapIndex - 1, providerChanges.length)];
		}

		this.widget.showChange(index);
	}

	close(): void {
		this.session.dispose();
		this.session = Disposable.None;
	}

	private assertWidget(): boolean {
		if (!this.enabled) {
			return false;
		}

		if (this.widget) {
			if (!this.model || this.model.changes.length === 0) {
				this.close();
				return false;
			}

			return true;
		}

		const editorModel = this.editor.getModel();

		if (!editorModel) {
			return false;
		}

		const modelRef = this.quickDiffModelService.createQuickDiffModelReference(editorModel.uri);

		if (!modelRef) {
			return false;
		}

		if (modelRef.object.changes.length === 0) {
			modelRef.dispose();
			return false;
		}

		this.model = modelRef.object;
		this.widget = this.instantiationService.createInstance(QuickDiffWidget, this.editor, this.model);
		this.isQuickDiffVisible.set(true);

		const disposables = new DisposableStore();
		disposables.add(Event.once(this.widget.onDidClose)(this.close, this));
		const onDidModelChange = Event.chain(this.model.onDidChange, $ =>
			$.filter(e => e.diff.length > 0)
				.map(e => e.diff)
		);

		onDidModelChange(this.onDidModelChange, this, disposables);

		disposables.add(modelRef);
		disposables.add(this.widget);
		disposables.add(toDisposable(() => {
			this.model = null;
			this.widget = null;
			this.isQuickDiffVisible.set(false);
			this.editor.focus();
		}));

		this.session = disposables;
		return true;
	}

	private onDidModelChange(splices: ISplice<QuickDiffChange>[]): void {
		if (!this.model || !this.widget || this.widget.hasFocus()) {
			return;
		}

		for (const splice of splices) {
			if (splice.start <= this.widget.index) {
				this.next();
				return;
			}
		}

		this.refresh();
	}

	private onEditorMouseDown(e: IEditorMouseEvent): void {
		this.mouseDownInfo = null;

		const range = e.target.range;

		if (!range) {
			return;
		}

		if (!e.event.leftButton) {
			return;
		}

		if (e.target.type !== MouseTargetType.GUTTER_LINE_DECORATIONS) {
			return;
		}
		if (!e.target.element) {
			return;
		}
		if (e.target.element.className.indexOf('dirty-diff-glyph') < 0) {
			return;
		}

		const data = e.target.detail;
		const offsetLeftInGutter = e.target.element.offsetLeft;
		const gutterOffsetX = data.offsetX - offsetLeftInGutter;

		// TODO@joao TODO@alex TODO@martin this is such that we don't collide with folding
		if (gutterOffsetX < -3 || gutterOffsetX > 3) { // dirty diff decoration on hover is 6px wide
			return;
		}

		this.mouseDownInfo = { lineNumber: range.startLineNumber };
	}

	private onEditorMouseUp(e: IEditorMouseEvent): void {
		if (!this.mouseDownInfo) {
			return;
		}

		const { lineNumber } = this.mouseDownInfo;
		this.mouseDownInfo = null;

		const range = e.target.range;

		if (!range || range.startLineNumber !== lineNumber) {
			return;
		}

		if (e.target.type !== MouseTargetType.GUTTER_LINE_DECORATIONS) {
			return;
		}

		const editorModel = this.editor.getModel();

		if (!editorModel) {
			return;
		}

		const modelRef = this.quickDiffModelService.createQuickDiffModelReference(editorModel.uri);

		if (!modelRef) {
			return;
		}

		try {
			const index = modelRef.object.changes
				.findIndex(change => lineIntersectsChange(lineNumber, change.change));

			if (index < 0) {
				return;
			}

			if (index === this.widget?.index) {
				this.close();
			} else {
				this.next(lineNumber);
			}
		} finally {
			modelRef.dispose();
		}
	}

	override dispose(): void {
		this.gutterActionDisposables.dispose();
		super.dispose();
	}
}

export class ShowPreviousChangeAction extends EditorAction {

	constructor(private readonly outerEditor?: ICodeEditor) {
		super({
			id: 'editor.action.dirtydiff.previous',
			label: nls.localize2('show previous change', "Show Previous Change"),
			precondition: TextCompareEditorActiveContext.toNegated(),
			kbOpts: { kbExpr: EditorContextKeys.editorTextFocus, primary: KeyMod.Shift | KeyMod.Alt | KeyCode.F3, weight: KeybindingWeight.EditorContrib }
		});
	}

	run(accessor: ServicesAccessor): void {
		const outerEditor = this.outerEditor ?? getOuterEditorFromDiffEditor(accessor);

		if (!outerEditor) {
			return;
		}

		const controller = QuickDiffEditorController.get(outerEditor);

		if (!controller) {
			return;
		}

		if (!controller.canNavigate()) {
			return;
		}

		controller.previous();
	}
}
registerEditorAction(ShowPreviousChangeAction);

export class ShowNextChangeAction extends EditorAction {

	constructor(private readonly outerEditor?: ICodeEditor) {
		super({
			id: 'editor.action.dirtydiff.next',
			label: nls.localize2('show next change', "Show Next Change"),
			precondition: TextCompareEditorActiveContext.toNegated(),
			kbOpts: { kbExpr: EditorContextKeys.editorTextFocus, primary: KeyMod.Alt | KeyCode.F3, weight: KeybindingWeight.EditorContrib }
		});
	}

	run(accessor: ServicesAccessor): void {
		const outerEditor = this.outerEditor ?? getOuterEditorFromDiffEditor(accessor);

		if (!outerEditor) {
			return;
		}

		const controller = QuickDiffEditorController.get(outerEditor);

		if (!controller) {
			return;
		}

		if (!controller.canNavigate()) {
			return;
		}

		controller.next();
	}
}
registerEditorAction(ShowNextChangeAction);

export class GotoPreviousChangeAction extends EditorAction {

	constructor() {
		super({
			id: 'workbench.action.editor.previousChange',
			label: nls.localize2('move to previous change', "Go to Previous Change"),
			precondition: ContextKeyExpr.and(TextCompareEditorActiveContext.toNegated(), quickDiffDecorationCount.notEqualsTo(0)),
			kbOpts: { kbExpr: EditorContextKeys.editorTextFocus, primary: KeyMod.Shift | KeyMod.Alt | KeyCode.F5, weight: KeybindingWeight.EditorContrib }
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const outerEditor = getOuterEditorFromDiffEditor(accessor);
		const accessibilitySignalService = accessor.get(IAccessibilitySignalService);
		const accessibilityService = accessor.get(IAccessibilityService);
		const codeEditorService = accessor.get(ICodeEditorService);
		const quickDiffModelService = accessor.get(IQuickDiffModelService);

		if (!outerEditor || !outerEditor.hasModel()) {
			return;
		}

		const modelRef = quickDiffModelService.createQuickDiffModelReference(outerEditor.getModel().uri);
		try {
			if (!modelRef || modelRef.object.changes.length === 0) {
				return;
			}

			const lineNumber = outerEditor.getPosition().lineNumber;
			const index = modelRef.object.findPreviousClosestChange(lineNumber, false);
			const change = modelRef.object.changes[index];
			await playAccessibilitySymbolForChange(change.change, accessibilitySignalService);
			setPositionAndSelection(change.change, outerEditor, accessibilityService, codeEditorService);
		} finally {
			modelRef?.dispose();
		}
	}
}
registerEditorAction(GotoPreviousChangeAction);

export class GotoNextChangeAction extends EditorAction {

	constructor() {
		super({
			id: 'workbench.action.editor.nextChange',
			label: nls.localize2('move to next change', "Go to Next Change"),
			precondition: ContextKeyExpr.and(TextCompareEditorActiveContext.toNegated(), quickDiffDecorationCount.notEqualsTo(0)),
			kbOpts: { kbExpr: EditorContextKeys.editorTextFocus, primary: KeyMod.Alt | KeyCode.F5, weight: KeybindingWeight.EditorContrib }
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const accessibilitySignalService = accessor.get(IAccessibilitySignalService);
		const outerEditor = getOuterEditorFromDiffEditor(accessor);
		const accessibilityService = accessor.get(IAccessibilityService);
		const codeEditorService = accessor.get(ICodeEditorService);
		const quickDiffModelService = accessor.get(IQuickDiffModelService);

		if (!outerEditor || !outerEditor.hasModel()) {
			return;
		}

		const modelRef = quickDiffModelService.createQuickDiffModelReference(outerEditor.getModel().uri);
		try {
			if (!modelRef || modelRef.object.changes.length === 0) {
				return;
			}

			const lineNumber = outerEditor.getPosition().lineNumber;
			const index = modelRef.object.findNextClosestChange(lineNumber, false);
			const change = modelRef.object.changes[index].change;
			await playAccessibilitySymbolForChange(change, accessibilitySignalService);
			setPositionAndSelection(change, outerEditor, accessibilityService, codeEditorService);
		} finally {
			modelRef?.dispose();
		}
	}
}
registerEditorAction(GotoNextChangeAction);

MenuRegistry.appendMenuItem(MenuId.MenubarGoMenu, {
	group: '7_change_nav',
	command: {
		id: 'editor.action.dirtydiff.next',
		title: nls.localize({ key: 'miGotoNextChange', comment: ['&& denotes a mnemonic'] }, "Next &&Change")
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarGoMenu, {
	group: '7_change_nav',
	command: {
		id: 'editor.action.dirtydiff.previous',
		title: nls.localize({ key: 'miGotoPreviousChange', comment: ['&& denotes a mnemonic'] }, "Previous &&Change")
	},
	order: 2
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'closeQuickDiff',
	weight: KeybindingWeight.EditorContrib + 50,
	primary: KeyCode.Escape,
	secondary: [KeyMod.Shift | KeyCode.Escape],
	when: ContextKeyExpr.and(isQuickDiffVisible),
	handler: (accessor: ServicesAccessor) => {
		const outerEditor = getOuterEditorFromDiffEditor(accessor);

		if (!outerEditor) {
			return;
		}

		const controller = QuickDiffEditorController.get(outerEditor);

		if (!controller) {
			return;
		}

		controller.close();
	}
});

function setPositionAndSelection(change: IChange, editor: ICodeEditor, accessibilityService: IAccessibilityService, codeEditorService: ICodeEditorService) {
	const position = new Position(change.modifiedStartLineNumber, 1);
	editor.setPosition(position);
	editor.revealPositionInCenter(position);
	if (accessibilityService.isScreenReaderOptimized()) {
		editor.setSelection({ startLineNumber: change.modifiedStartLineNumber, startColumn: 0, endLineNumber: change.modifiedStartLineNumber, endColumn: Number.MAX_VALUE });
		codeEditorService.getActiveCodeEditor()?.writeScreenReaderContent('diff-navigation');
	}
}

async function playAccessibilitySymbolForChange(change: IChange, accessibilitySignalService: IAccessibilitySignalService) {
	const changeType = getChangeType(change);
	switch (changeType) {
		case ChangeType.Add:
			accessibilitySignalService.playSignal(AccessibilitySignal.diffLineInserted, { allowManyInParallel: true, source: 'quickDiffDecoration' });
			break;
		case ChangeType.Delete:
			accessibilitySignalService.playSignal(AccessibilitySignal.diffLineDeleted, { allowManyInParallel: true, source: 'quickDiffDecoration' });
			break;
		case ChangeType.Modify:
			accessibilitySignalService.playSignal(AccessibilitySignal.diffLineModified, { allowManyInParallel: true, source: 'quickDiffDecoration' });
			break;
	}
}

function getOuterEditorFromDiffEditor(accessor: ServicesAccessor): ICodeEditor | null {
	const diffEditors = accessor.get(ICodeEditorService).listDiffEditors();

	for (const diffEditor of diffEditors) {
		if (diffEditor.hasTextFocus() && diffEditor instanceof EmbeddedDiffEditorWidget) {
			return diffEditor.getParentEditor();
		}
	}

	return getOuterEditor(accessor);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/scm/browser/scm.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/scm/browser/scm.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContributionsRegistry, registerWorkbenchContribution2, Extensions as WorkbenchExtensions, WorkbenchPhase } from '../../../common/contributions.js';
import { QuickDiffWorkbenchController } from './quickDiffDecorator.js';
import { VIEWLET_ID, ISCMService, VIEW_PANE_ID, ISCMProvider, ISCMViewService, REPOSITORIES_VIEW_PANE_ID, HISTORY_VIEW_PANE_ID } from '../common/scm.js';
import { KeyMod, KeyCode } from '../../../../base/common/keyCodes.js';
import { MenuRegistry, MenuId, registerAction2, Action2 } from '../../../../platform/actions/common/actions.js';
import { SCMActiveResourceContextKeyController, SCMActiveRepositoryController } from './activity.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions, ConfigurationScope } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IContextKeyService, ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { SCMService } from '../common/scmService.js';
import { IViewContainersRegistry, ViewContainerLocation, Extensions as ViewContainerExtensions, IViewsRegistry } from '../../../common/views.js';
import { SCMViewPaneContainer } from './scmViewPaneContainer.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { ModesRegistry } from '../../../../editor/common/languages/modesRegistry.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { ContextKeys, SCMViewPane } from './scmViewPane.js';
import { RepositoryPicker, SCMViewService } from './scmViewService.js';
import { SCMRepositoriesViewPane } from './scmRepositoriesViewPane.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { Context as SuggestContext } from '../../../../editor/contrib/suggest/browser/suggest.js';
import { MANAGE_TRUST_COMMAND_ID, WorkspaceTrustContext } from '../../workspace/common/workspace.js';
import { IQuickDiffService } from '../common/quickDiff.js';
import { QuickDiffService } from '../common/quickDiffService.js';
import { getActiveElement, isActiveElement } from '../../../../base/browser/dom.js';
import { SCMWorkingSetController } from './workingSet.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { IListService, WorkbenchList } from '../../../../platform/list/browser/listService.js';
import { isSCMRepository } from './util.js';
import { SCMHistoryViewPane } from './scmHistoryViewPane.js';
import { QuickDiffModelService, IQuickDiffModelService } from './quickDiffModel.js';
import { QuickDiffEditorController } from './quickDiffWidget.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../../editor/browser/editorExtensions.js';
import { RemoteNameContext, ResourceContextKey } from '../../../common/contextkeys.js';
import { AccessibleViewRegistry } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { SCMAccessibilityHelp } from './scmAccessibilityHelp.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { SCMHistoryItemContextContribution } from './scmHistoryChatContext.js';
import { ChatContextKeys } from '../../chat/common/chatContextKeys.js';
import { CHAT_SETUP_SUPPORT_ANONYMOUS_ACTION_ID } from '../../chat/browser/actions/chatActions.js';
import product from '../../../../platform/product/common/product.js';

ModesRegistry.registerLanguage({
	id: 'scminput',
	extensions: [],
	aliases: [], // hide from language selector
	mimetypes: ['text/x-scm-input']
});

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench)
	.registerWorkbenchContribution(QuickDiffWorkbenchController, LifecyclePhase.Restored);

registerEditorContribution(QuickDiffEditorController.ID,
	QuickDiffEditorController, EditorContributionInstantiation.AfterFirstRender);

const sourceControlViewIcon = registerIcon('source-control-view-icon', Codicon.sourceControl, localize('sourceControlViewIcon', 'View icon of the Source Control view.'));

const viewContainer = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry).registerViewContainer({
	id: VIEWLET_ID,
	title: localize2('source control', 'Source Control'),
	ctorDescriptor: new SyncDescriptor(SCMViewPaneContainer),
	storageId: 'workbench.scm.views.state',
	icon: sourceControlViewIcon,
	alwaysUseContainerInfo: true,
	order: 2,
	hideIfEmpty: true,
}, ViewContainerLocation.Sidebar, { doNotRegisterOpenCommand: true });

const viewsRegistry = Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry);
const containerTitle = localize('source control view', "Source Control");

viewsRegistry.registerViewWelcomeContent(VIEW_PANE_ID, {
	content: localize('no open repo', "No source control providers registered."),
	when: 'default'
});

viewsRegistry.registerViewWelcomeContent(VIEW_PANE_ID, {
	content: localize('no open repo in an untrusted workspace', "None of the registered source control providers work in Restricted Mode."),
	when: ContextKeyExpr.and(ContextKeyExpr.equals('scm.providerCount', 0), WorkspaceTrustContext.IsEnabled, WorkspaceTrustContext.IsTrusted.toNegated())
});

viewsRegistry.registerViewWelcomeContent(VIEW_PANE_ID, {
	content: `[${localize('manageWorkspaceTrustAction', "Manage Workspace Trust")}](command:${MANAGE_TRUST_COMMAND_ID})`,
	when: ContextKeyExpr.and(ContextKeyExpr.equals('scm.providerCount', 0), WorkspaceTrustContext.IsEnabled, WorkspaceTrustContext.IsTrusted.toNegated())
});

viewsRegistry.registerViewWelcomeContent(HISTORY_VIEW_PANE_ID, {
	content: localize('no history items', "The selected source control provider does not have any source control history items."),
	when: ContextKeys.SCMHistoryItemCount.isEqualTo(0)
});

viewsRegistry.registerViews([{
	id: REPOSITORIES_VIEW_PANE_ID,
	containerTitle,
	name: localize2('scmRepositories', "Repositories"),
	singleViewPaneContainerTitle: localize('source control repositories', "Source Control Repositories"),
	ctorDescriptor: new SyncDescriptor(SCMRepositoriesViewPane),
	canToggleVisibility: true,
	hideByDefault: true,
	canMoveView: true,
	weight: 20,
	order: 0,
	when: ContextKeyExpr.and(ContextKeyExpr.has('scm.providerCount'), ContextKeyExpr.notEquals('scm.providerCount', 0)),
	// readonly when = ContextKeyExpr.or(ContextKeyExpr.equals('config.scm.alwaysShowProviders', true), ContextKeyExpr.and(ContextKeyExpr.notEquals('scm.providerCount', 0), ContextKeyExpr.notEquals('scm.providerCount', 1)));
	containerIcon: sourceControlViewIcon
}], viewContainer);

viewsRegistry.registerViews([{
	id: VIEW_PANE_ID,
	containerTitle,
	name: localize2('scmChanges', 'Changes'),
	singleViewPaneContainerTitle: containerTitle,
	ctorDescriptor: new SyncDescriptor(SCMViewPane),
	canToggleVisibility: true,
	canMoveView: true,
	weight: 40,
	order: 1,
	containerIcon: sourceControlViewIcon,
	openCommandActionDescriptor: {
		id: viewContainer.id,
		mnemonicTitle: localize({ key: 'miViewSCM', comment: ['&& denotes a mnemonic'] }, "Source &&Control"),
		keybindings: {
			primary: 0,
			win: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyG },
			linux: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyG },
			mac: { primary: KeyMod.WinCtrl | KeyMod.Shift | KeyCode.KeyG },
		},
		order: 2,
	}
}], viewContainer);

viewsRegistry.registerViews([{
	id: HISTORY_VIEW_PANE_ID,
	containerTitle,
	name: localize2('scmGraph', "Graph"),
	singleViewPaneContainerTitle: localize('source control graph', "Source Control Graph"),
	ctorDescriptor: new SyncDescriptor(SCMHistoryViewPane),
	canToggleVisibility: true,
	canMoveView: true,
	weight: 40,
	order: 2,
	when: ContextKeyExpr.and(
		ContextKeyExpr.has('scm.historyProviderCount'),
		ContextKeyExpr.notEquals('scm.historyProviderCount', 0),
	),
	containerIcon: sourceControlViewIcon
}], viewContainer);

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench)
	.registerWorkbenchContribution(SCMActiveRepositoryController, LifecyclePhase.Restored);

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench)
	.registerWorkbenchContribution(SCMActiveResourceContextKeyController, LifecyclePhase.Restored);

registerWorkbenchContribution2(
	SCMWorkingSetController.ID,
	SCMWorkingSetController,
	WorkbenchPhase.AfterRestored
);

registerWorkbenchContribution2(
	SCMHistoryItemContextContribution.ID,
	SCMHistoryItemContextContribution,
	WorkbenchPhase.AfterRestored
);

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
	id: 'scm',
	order: 5,
	title: localize('scmConfigurationTitle', "Source Control"),
	type: 'object',
	scope: ConfigurationScope.RESOURCE,
	properties: {
		'scm.diffDecorations': {
			type: 'string',
			enum: ['all', 'gutter', 'overview', 'minimap', 'none'],
			enumDescriptions: [
				localize('scm.diffDecorations.all', "Show the diff decorations in all available locations."),
				localize('scm.diffDecorations.gutter', "Show the diff decorations only in the editor gutter."),
				localize('scm.diffDecorations.overviewRuler', "Show the diff decorations only in the overview ruler."),
				localize('scm.diffDecorations.minimap', "Show the diff decorations only in the minimap."),
				localize('scm.diffDecorations.none', "Do not show the diff decorations.")
			],
			default: 'all',
			description: localize('diffDecorations', "Controls diff decorations in the editor.")
		},
		'scm.diffDecorationsGutterWidth': {
			type: 'number',
			enum: [1, 2, 3, 4, 5],
			default: 3,
			description: localize('diffGutterWidth', "Controls the width(px) of diff decorations in gutter (added & modified).")
		},
		'scm.diffDecorationsGutterVisibility': {
			type: 'string',
			enum: ['always', 'hover'],
			enumDescriptions: [
				localize('scm.diffDecorationsGutterVisibility.always', "Show the diff decorator in the gutter at all times."),
				localize('scm.diffDecorationsGutterVisibility.hover', "Show the diff decorator in the gutter only on hover.")
			],
			description: localize('scm.diffDecorationsGutterVisibility', "Controls the visibility of the Source Control diff decorator in the gutter."),
			default: 'always'
		},
		'scm.diffDecorationsGutterAction': {
			type: 'string',
			enum: ['diff', 'none'],
			enumDescriptions: [
				localize('scm.diffDecorationsGutterAction.diff', "Show the inline diff Peek view on click."),
				localize('scm.diffDecorationsGutterAction.none', "Do nothing.")
			],
			description: localize('scm.diffDecorationsGutterAction', "Controls the behavior of Source Control diff gutter decorations."),
			default: 'diff'
		},
		'scm.diffDecorationsGutterPattern': {
			type: 'object',
			description: localize('diffGutterPattern', "Controls whether a pattern is used for the diff decorations in gutter."),
			additionalProperties: false,
			properties: {
				'added': {
					type: 'boolean',
					description: localize('diffGutterPatternAdded', "Use pattern for the diff decorations in gutter for added lines."),
				},
				'modified': {
					type: 'boolean',
					description: localize('diffGutterPatternModifed', "Use pattern for the diff decorations in gutter for modified lines."),
				},
			},
			default: {
				'added': false,
				'modified': true
			}
		},
		'scm.diffDecorationsIgnoreTrimWhitespace': {
			type: 'string',
			enum: ['true', 'false', 'inherit'],
			enumDescriptions: [
				localize('scm.diffDecorationsIgnoreTrimWhitespace.true', "Ignore leading and trailing whitespace."),
				localize('scm.diffDecorationsIgnoreTrimWhitespace.false', "Do not ignore leading and trailing whitespace."),
				localize('scm.diffDecorationsIgnoreTrimWhitespace.inherit', "Inherit from `diffEditor.ignoreTrimWhitespace`.")
			],
			description: localize('diffDecorationsIgnoreTrimWhitespace', "Controls whether leading and trailing whitespace is ignored in Source Control diff gutter decorations."),
			default: 'false'
		},
		'scm.alwaysShowActions': {
			type: 'boolean',
			description: localize('alwaysShowActions', "Controls whether inline actions are always visible in the Source Control view."),
			default: false
		},
		'scm.countBadge': {
			type: 'string',
			enum: ['all', 'focused', 'off'],
			enumDescriptions: [
				localize('scm.countBadge.all', "Show the sum of all Source Control Provider count badges."),
				localize('scm.countBadge.focused', "Show the count badge of the focused Source Control Provider."),
				localize('scm.countBadge.off', "Disable the Source Control count badge.")
			],
			description: localize('scm.countBadge', "Controls the count badge on the Source Control icon on the Activity Bar."),
			default: 'all'
		},
		'scm.providerCountBadge': {
			type: 'string',
			enum: ['hidden', 'auto', 'visible'],
			enumDescriptions: [
				localize('scm.providerCountBadge.hidden', "Hide Source Control Provider count badges."),
				localize('scm.providerCountBadge.auto', "Only show count badge for Source Control Provider when non-zero."),
				localize('scm.providerCountBadge.visible', "Show Source Control Provider count badges.")
			],
			markdownDescription: localize('scm.providerCountBadge', "Controls the count badges on Source Control Provider headers. These headers appear in the Source Control view when there is more than one provider or when the {0} setting is enabled, and in the Source Control Repositories view.", '\`#scm.alwaysShowRepositories#\`'),
			default: 'hidden'
		},
		'scm.defaultViewMode': {
			type: 'string',
			enum: ['tree', 'list'],
			enumDescriptions: [
				localize('scm.defaultViewMode.tree', "Show the repository changes as a tree."),
				localize('scm.defaultViewMode.list', "Show the repository changes as a list.")
			],
			description: localize('scm.defaultViewMode', "Controls the default Source Control repository view mode."),
			default: 'list'
		},
		'scm.defaultViewSortKey': {
			type: 'string',
			enum: ['name', 'path', 'status'],
			enumDescriptions: [
				localize('scm.defaultViewSortKey.name', "Sort the repository changes by file name."),
				localize('scm.defaultViewSortKey.path', "Sort the repository changes by path."),
				localize('scm.defaultViewSortKey.status', "Sort the repository changes by Source Control status.")
			],
			description: localize('scm.defaultViewSortKey', "Controls the default Source Control repository changes sort order when viewed as a list."),
			default: 'path'
		},
		'scm.autoReveal': {
			type: 'boolean',
			description: localize('autoReveal', "Controls whether the Source Control view should automatically reveal and select files when opening them."),
			default: true
		},
		'scm.inputFontFamily': {
			type: 'string',
			markdownDescription: localize('inputFontFamily', "Controls the font for the input message. Use `default` for the workbench user interface font family, `editor` for the `#editor.fontFamily#`'s value, or a custom font family."),
			default: 'default'
		},
		'scm.inputFontSize': {
			type: 'number',
			markdownDescription: localize('inputFontSize', "Controls the font size for the input message in pixels."),
			default: 13
		},
		'scm.inputMaxLineCount': {
			type: 'number',
			markdownDescription: localize('inputMaxLines', "Controls the maximum number of lines that the input will auto-grow to."),
			minimum: 1,
			maximum: 50,
			default: 10
		},
		'scm.inputMinLineCount': {
			type: 'number',
			markdownDescription: localize('inputMinLines', "Controls the minimum number of lines that the input will auto-grow from."),
			minimum: 1,
			maximum: 50,
			default: 1
		},
		'scm.alwaysShowRepositories': {
			type: 'boolean',
			markdownDescription: localize('alwaysShowRepository', "Controls whether repositories should always be visible in the Source Control view."),
			default: false
		},
		'scm.repositories.sortOrder': {
			type: 'string',
			enum: ['discovery time', 'name', 'path'],
			enumDescriptions: [
				localize('scm.repositoriesSortOrder.discoveryTime', "Repositories in the Source Control Repositories view are sorted by discovery time. Repositories in the Source Control view are sorted in the order that they were selected."),
				localize('scm.repositoriesSortOrder.name', "Repositories in the Source Control Repositories and Source Control views are sorted by repository name."),
				localize('scm.repositoriesSortOrder.path', "Repositories in the Source Control Repositories and Source Control views are sorted by repository path.")
			],
			description: localize('repositoriesSortOrder', "Controls the sort order of the repositories in the source control repositories view."),
			default: 'discovery time'
		},
		'scm.repositories.visible': {
			type: 'number',
			description: localize('providersVisible', "Controls how many repositories are visible in the Source Control Repositories section. Set to 0, to be able to manually resize the view."),
			default: 10
		},
		'scm.repositories.selectionMode': {
			type: 'string',
			enum: ['multiple', 'single'],
			enumDescriptions: [
				localize('scm.repositories.selectionMode.multiple', "Multiple repositories can be selected at the same time."),
				localize('scm.repositories.selectionMode.single', "Only one repository can be selected at a time.")
			],
			description: localize('scm.repositories.selectionMode', "Controls the selection mode of the repositories in the Source Control Repositories view."),
			default: 'multiple'
		},
		'scm.repositories.explorer': {
			type: 'boolean',
			markdownDescription: localize('scm.repositories.explorer', "Controls whether to show repository artifacts in the Source Control Repositories view. This feature is experimental and only works when {0} is set to `{1}`.", '\`#scm.repositories.selectionMode#\`', 'single'),
			default: false,
			tags: ['experimental']
		},
		'scm.showActionButton': {
			type: 'boolean',
			markdownDescription: localize('showActionButton', "Controls whether an action button can be shown in the Source Control view."),
			default: true
		},
		'scm.showInputActionButton': {
			type: 'boolean',
			markdownDescription: localize('showInputActionButton', "Controls whether an action button can be shown in the Source Control input."),
			default: true
		},
		'scm.workingSets.enabled': {
			type: 'boolean',
			description: localize('scm.workingSets.enabled', "Controls whether to store editor working sets when switching between source control history item groups."),
			default: false
		},
		'scm.workingSets.default': {
			type: 'string',
			enum: ['empty', 'current'],
			enumDescriptions: [
				localize('scm.workingSets.default.empty', "Use an empty working set when switching to a source control history item group that does not have a working set."),
				localize('scm.workingSets.default.current', "Use the current working set when switching to a source control history item group that does not have a working set.")
			],
			description: localize('scm.workingSets.default', "Controls the default working set to use when switching to a source control history item group that does not have a working set."),
			default: 'current'
		},
		'scm.compactFolders': {
			type: 'boolean',
			description: localize('scm.compactFolders', "Controls whether the Source Control view should render folders in a compact form. In such a form, single child folders will be compressed in a combined tree element."),
			default: true
		},
		'scm.graph.pageOnScroll': {
			type: 'boolean',
			description: localize('scm.graph.pageOnScroll', "Controls whether the Source Control Graph view will load the next page of items when you scroll to the end of the list."),
			default: true
		},
		'scm.graph.pageSize': {
			type: 'number',
			description: localize('scm.graph.pageSize', "The number of items to show in the Source Control Graph view by default and when loading more items."),
			minimum: 1,
			maximum: 1000,
			default: 50
		},
		'scm.graph.badges': {
			type: 'string',
			enum: ['all', 'filter'],
			enumDescriptions: [
				localize('scm.graph.badges.all', "Show badges of all history item groups in the Source Control Graph view."),
				localize('scm.graph.badges.filter', "Show only the badges of history item groups used as a filter in the Source Control Graph view.")
			],
			description: localize('scm.graph.badges', "Controls which badges are shown in the Source Control Graph view. The badges are shown on the right side of the graph indicating the names of history item groups."),
			default: 'filter'
		},
		'scm.graph.showIncomingChanges': {
			type: 'boolean',
			description: localize('scm.graph.showIncomingChanges', "Controls whether to show incoming changes in the Source Control Graph view."),
			default: true
		},
		'scm.graph.showOutgoingChanges': {
			type: 'boolean',
			description: localize('scm.graph.showOutgoingChanges', "Controls whether to show outgoing changes in the Source Control Graph view."),
			default: true
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'scm.acceptInput',
	metadata: { description: localize('scm accept', "Source Control: Accept Input"), args: [] },
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.has('scmRepository'),
	primary: KeyMod.CtrlCmd | KeyCode.Enter,
	handler: accessor => {
		const contextKeyService = accessor.get(IContextKeyService);
		const context = contextKeyService.getContext(getActiveElement());
		const repositoryId = context.getValue<string | undefined>('scmRepository');

		if (!repositoryId) {
			return Promise.resolve(null);
		}

		const scmService = accessor.get(ISCMService);
		const repository = scmService.getRepository(repositoryId);

		if (!repository?.provider.acceptInputCommand) {
			return Promise.resolve(null);
		}

		const id = repository.provider.acceptInputCommand.id;
		const args = repository.provider.acceptInputCommand.arguments;
		const commandService = accessor.get(ICommandService);

		return commandService.executeCommand(id, ...(args || []));
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'scm.clearInput',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(ContextKeyExpr.has('scmRepository'), SuggestContext.Visible.toNegated(), EditorContextKeys.hasNonEmptySelection.toNegated()),
	primary: KeyCode.Escape,
	handler: async (accessor) => {
		const scmService = accessor.get(ISCMService);
		const contextKeyService = accessor.get(IContextKeyService);

		const context = contextKeyService.getContext(getActiveElement());
		const repositoryId = context.getValue<string | undefined>('scmRepository');
		const repository = repositoryId ? scmService.getRepository(repositoryId) : undefined;
		repository?.input.setValue('', true);
	}
});

const viewNextCommitCommand = {
	description: { description: localize('scm view next commit', "Source Control: View Next Commit"), args: [] },
	weight: KeybindingWeight.WorkbenchContrib,
	handler: (accessor: ServicesAccessor) => {
		const contextKeyService = accessor.get(IContextKeyService);
		const scmService = accessor.get(ISCMService);
		const context = contextKeyService.getContext(getActiveElement());
		const repositoryId = context.getValue<string | undefined>('scmRepository');
		const repository = repositoryId ? scmService.getRepository(repositoryId) : undefined;
		repository?.input.showNextHistoryValue();
	}
};

const viewPreviousCommitCommand = {
	description: { description: localize('scm view previous commit', "Source Control: View Previous Commit"), args: [] },
	weight: KeybindingWeight.WorkbenchContrib,
	handler: (accessor: ServicesAccessor) => {
		const contextKeyService = accessor.get(IContextKeyService);
		const scmService = accessor.get(ISCMService);
		const context = contextKeyService.getContext(getActiveElement());
		const repositoryId = context.getValue<string | undefined>('scmRepository');
		const repository = repositoryId ? scmService.getRepository(repositoryId) : undefined;
		repository?.input.showPreviousHistoryValue();
	}
};

KeybindingsRegistry.registerCommandAndKeybindingRule({
	...viewNextCommitCommand,
	id: 'scm.viewNextCommit',
	when: ContextKeyExpr.and(ContextKeyExpr.has('scmRepository'), ContextKeyExpr.has('scmInputIsInLastPosition'), SuggestContext.Visible.toNegated()),
	primary: KeyCode.DownArrow
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	...viewPreviousCommitCommand,
	id: 'scm.viewPreviousCommit',
	when: ContextKeyExpr.and(ContextKeyExpr.has('scmRepository'), ContextKeyExpr.has('scmInputIsInFirstPosition'), SuggestContext.Visible.toNegated()),
	primary: KeyCode.UpArrow
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	...viewNextCommitCommand,
	id: 'scm.forceViewNextCommit',
	when: ContextKeyExpr.has('scmRepository'),
	primary: KeyMod.Alt | KeyCode.DownArrow
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	...viewPreviousCommitCommand,
	id: 'scm.forceViewPreviousCommit',
	when: ContextKeyExpr.has('scmRepository'),
	primary: KeyMod.Alt | KeyCode.UpArrow
});

CommandsRegistry.registerCommand('scm.openInIntegratedTerminal', async (accessor, ...providers: ISCMProvider[]) => {
	if (!providers || providers.length === 0) {
		return;
	}

	const commandService = accessor.get(ICommandService);
	const listService = accessor.get(IListService);

	let provider = providers.length === 1 ? providers[0] : undefined;

	if (!provider) {
		const list = listService.lastFocusedList;
		const element = list?.getHTMLElement();

		if (list instanceof WorkbenchList && element && isActiveElement(element)) {
			const [index] = list.getFocus();
			const focusedElement = list.element(index);

			// Source Control Repositories
			if (isSCMRepository(focusedElement)) {
				provider = focusedElement.provider;
			}
		}
	}

	if (!provider?.rootUri) {
		return;
	}

	await commandService.executeCommand('openInIntegratedTerminal', provider.rootUri);
});

CommandsRegistry.registerCommand('scm.openInTerminal', async (accessor, provider: ISCMProvider) => {
	if (!provider || !provider.rootUri) {
		return;
	}

	const commandService = accessor.get(ICommandService);
	await commandService.executeCommand('openInTerminal', provider.rootUri);
});

CommandsRegistry.registerCommand('scm.setActiveProvider', async (accessor) => {
	const instantiationService = accessor.get(IInstantiationService);
	const scmViewService = accessor.get(ISCMViewService);

	const placeHolder = localize('scmActiveRepositoryPlaceHolder', "Select the active repository, type to filter all repositories");
	const autoQuickItemDescription = localize('scmActiveRepositoryAutoDescription', "The active repository is updated based on active editor");
	const repositoryPicker = instantiationService.createInstance(RepositoryPicker, placeHolder, autoQuickItemDescription);

	const result = await repositoryPicker.pickRepository();
	if (result?.repository) {
		const repository = result.repository !== 'auto' ? result.repository : undefined;
		scmViewService.pinActiveRepository(repository);
	}
});

MenuRegistry.appendMenuItem(MenuId.SCMSourceControl, {
	group: '99_terminal',
	command: {
		id: 'scm.openInTerminal',
		title: localize('open in external terminal', "Open in External Terminal")
	},
	when: ContextKeyExpr.and(
		RemoteNameContext.isEqualTo(''),
		ContextKeyExpr.equals('scmProviderHasRootUri', true),
		ContextKeyExpr.or(
			ContextKeyExpr.equals('config.terminal.sourceControlRepositoriesKind', 'external'),
			ContextKeyExpr.equals('config.terminal.sourceControlRepositoriesKind', 'both')))
});

MenuRegistry.appendMenuItem(MenuId.SCMSourceControl, {
	group: '99_terminal',
	command: {
		id: 'scm.openInIntegratedTerminal',
		title: localize('open in integrated terminal', "Open in Integrated Terminal")
	},
	when: ContextKeyExpr.and(
		ContextKeyExpr.equals('scmProviderHasRootUri', true),
		ContextKeyExpr.or(
			ContextKeyExpr.equals('config.terminal.sourceControlRepositoriesKind', 'integrated'),
			ContextKeyExpr.equals('config.terminal.sourceControlRepositoriesKind', 'both')))
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.scm.action.focusPreviousInput',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeys.RepositoryVisibilityCount.notEqualsTo(0),
	handler: async accessor => {
		const viewsService = accessor.get(IViewsService);
		const scmView = await viewsService.openView<SCMViewPane>(VIEW_PANE_ID);
		if (scmView) {
			scmView.focusPreviousInput();
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.scm.action.focusNextInput',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeys.RepositoryVisibilityCount.notEqualsTo(0),
	handler: async accessor => {
		const viewsService = accessor.get(IViewsService);
		const scmView = await viewsService.openView<SCMViewPane>(VIEW_PANE_ID);
		if (scmView) {
			scmView.focusNextInput();
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.scm.action.focusPreviousResourceGroup',
	weight: KeybindingWeight.WorkbenchContrib,
	handler: async accessor => {
		const viewsService = accessor.get(IViewsService);
		const scmView = await viewsService.openView<SCMViewPane>(VIEW_PANE_ID);
		if (scmView) {
			scmView.focusPreviousResourceGroup();
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.scm.action.focusNextResourceGroup',
	weight: KeybindingWeight.WorkbenchContrib,
	handler: async accessor => {
		const viewsService = accessor.get(IViewsService);
		const scmView = await viewsService.openView<SCMViewPane>(VIEW_PANE_ID);
		if (scmView) {
			scmView.focusNextResourceGroup();
		}
	}
});

MenuRegistry.appendMenuItem(MenuId.EditorLineNumberContext, {
	title: localize('quickDiffDecoration', "Diff Decorations"),
	submenu: MenuId.SCMQuickDiffDecorations,
	when: ContextKeyExpr.or(
		ContextKeyExpr.equals('config.scm.diffDecorations', 'all'),
		ContextKeyExpr.equals('config.scm.diffDecorations', 'gutter')),
	group: '9_quickDiffDecorations'
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'scm.editor.triggerSetup',
			title: localize('scmEditorResolveMergeConflict', "Resolve Conflicts with AI"),
			icon: Codicon.chatSparkle,
			f1: false,
			menu: {
				id: MenuId.EditorContent,
				when: ContextKeyExpr.and(
					ChatContextKeys.Setup.hidden.negate(),
					ChatContextKeys.Setup.disabled.negate(),
					ChatContextKeys.Setup.installed.negate(),
					ContextKeyExpr.in(ResourceContextKey.Resource.key, 'git.mergeChanges'),
					ContextKeyExpr.equals('git.activeResourceHasMergeConflicts', true)
				)
			}
		});
	}

	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const commandService = accessor.get(ICommandService);

		const result = await commandService.executeCommand(CHAT_SETUP_SUPPORT_ANONYMOUS_ACTION_ID);
		if (!result) {
			return;
		}

		const command = product.defaultChatAgent?.resolveMergeConflictsCommand;
		if (!command) {
			return;
		}

		await commandService.executeCommand(command, ...args);
	}
});


registerSingleton(ISCMService, SCMService, InstantiationType.Delayed);
registerSingleton(ISCMViewService, SCMViewService, InstantiationType.Delayed);
registerSingleton(IQuickDiffService, QuickDiffService, InstantiationType.Delayed);
registerSingleton(IQuickDiffModelService, QuickDiffModelService, InstantiationType.Delayed);

AccessibleViewRegistry.register(new SCMAccessibilityHelp());
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/scm/browser/scmAccessibilityHelp.ts]---
Location: vscode-main/src/vs/workbench/contrib/scm/browser/scmAccessibilityHelp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { AccessibleViewType, AccessibleContentProvider, IAccessibleViewContentProvider, AccessibleViewProviderId } from '../../../../platform/accessibility/browser/accessibleView.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { FocusedViewContext, SidebarFocusContext } from '../../../common/contextkeys.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { HISTORY_VIEW_PANE_ID, ISCMViewService, REPOSITORIES_VIEW_PANE_ID, VIEW_PANE_ID } from '../common/scm.js';

export class SCMAccessibilityHelp implements IAccessibleViewImplementation {
	readonly name = 'scm';
	readonly type = AccessibleViewType.Help;
	readonly priority = 100;
	readonly when = ContextKeyExpr.or(
		ContextKeyExpr.and(ContextKeyExpr.equals('activeViewlet', 'workbench.view.scm'), SidebarFocusContext),
		ContextKeyExpr.equals(FocusedViewContext.key, REPOSITORIES_VIEW_PANE_ID),
		ContextKeyExpr.equals(FocusedViewContext.key, VIEW_PANE_ID),
		ContextKeyExpr.equals(FocusedViewContext.key, HISTORY_VIEW_PANE_ID)
	);

	getProvider(accessor: ServicesAccessor): AccessibleContentProvider {
		const commandService = accessor.get(ICommandService);
		const scmViewService = accessor.get(ISCMViewService);
		const viewsService = accessor.get(IViewsService);

		return new SCMAccessibilityHelpContentProvider(commandService, scmViewService, viewsService);
	}
}

class SCMAccessibilityHelpContentProvider extends Disposable implements IAccessibleViewContentProvider {
	readonly id = AccessibleViewProviderId.SourceControl;
	readonly verbositySettingKey = AccessibilityVerbositySettingId.SourceControl;
	readonly options = { type: AccessibleViewType.Help };

	private _focusedView: string | undefined;

	constructor(
		@ICommandService private readonly _commandService: ICommandService,
		@ISCMViewService private readonly _scmViewService: ISCMViewService,
		@IViewsService private readonly _viewsService: IViewsService
	) {
		super();
		this._focusedView = this._viewsService.getFocusedViewName();
	}

	onClose(): void {
		switch (this._focusedView) {
			case 'Source Control':
				this._commandService.executeCommand('workbench.scm');
				break;
			case 'Source Control Repositories':
				this._commandService.executeCommand('workbench.scm.repositories');
				break;
			case 'Source Control Graph':
				this._commandService.executeCommand('workbench.scm.history');
				break;
			default:
				this._commandService.executeCommand('workbench.view.scm');
		}
	}

	provideContent(): string {
		const content: string[] = [];

		// Active Repository State
		if (this._scmViewService.visibleRepositories.length > 1) {
			const repositoryList = this._scmViewService.visibleRepositories.map(r => r.provider.name).join(', ');
			content.push(localize('state-msg1', "Visible repositories: {0}", repositoryList));
		}

		const focusedRepository = this._scmViewService.focusedRepository;
		if (focusedRepository) {
			content.push(localize('state-msg2', "Repository: {0}", focusedRepository.provider.name));

			// History Item Reference
			const currentHistoryItemRef = focusedRepository.provider.historyProvider.get()?.historyItemRef.get();
			if (currentHistoryItemRef) {
				content.push(localize('state-msg3', "History item reference: {0}", currentHistoryItemRef.name));
			}

			// Commit Message
			if (focusedRepository.input.visible && focusedRepository.input.enabled && focusedRepository.input.value !== '') {
				content.push(localize('state-msg4', "Commit message: {0}", focusedRepository.input.value));
			}

			// Action Button
			const actionButton = focusedRepository.provider.actionButton.get();
			if (actionButton) {
				const label = actionButton.command.tooltip ?? actionButton.command.title;
				const enablementLabel = actionButton.enabled ? localize('enabled', "enabled") : localize('disabled', "disabled");
				content.push(localize('state-msg5', "Action button: {0}, {1}", label, enablementLabel));
			}

			// Resource Groups
			const resourceGroups: string[] = [];
			for (const resourceGroup of focusedRepository.provider.groups) {
				resourceGroups.push(`${resourceGroup.label} (${resourceGroup.resources.length} resource(s))`);
			}

			focusedRepository.provider.groups.map(g => g.label).join(', ');
			content.push(localize('state-msg6', "Resource groups: {0}", resourceGroups.join(', ')));
		}

		// Source Control Repositories
		content.push(localize('scm-repositories-msg1', "Use the \"Source Control: Focus on Source Control Repositories View\" command to open the Source Control Repositories view."));
		content.push(localize('scm-repositories-msg2', "The Source Control Repositories view lists all repositories from the workspace and is only shown when the workspace contains more than one repository."));
		content.push(localize('scm-repositories-msg3', "Once the Source Control Repositories view is opened you can:"));
		content.push(localize('scm-repositories-msg4', " - Use the up/down arrow keys to navigate the list of repositories."));
		content.push(localize('scm-repositories-msg5', " - Use the Enter or Space keys to select a repository."));
		content.push(localize('scm-repositories-msg6', " - Use Shift + up/down keys to select multiple repositories."));

		// Source Control
		content.push(localize('scm-msg1', "Use the \"Source Control: Focus on Source Control View\" command to open the Source Control view."));
		content.push(localize('scm-msg2', "The Source Control view displays the resource groups and resources of the repository. If the workspace contains more than one repository it will list the resource groups and resources of the repositories selected in the Source Control Repositories view."));
		content.push(localize('scm-msg3', "Once the Source Control view is opened you can:"));
		content.push(localize('scm-msg4', " - Use the up/down arrow keys to navigate the list of repositories, resource groups and resources."));
		content.push(localize('scm-msg5', " - Use the Space key to expand or collapse a resource group."));

		// Source Control Graph
		content.push(localize('scm-graph-msg1', "Use the \"Source Control: Focus on Source Control Graph View\" command to open the Source Control Graph view."));
		content.push(localize('scm-graph-msg2', "The Source Control Graph view displays a graph history items of the repository. If the workspace contains more than one repository it will list the history items of the active repository."));
		content.push(localize('scm-graph-msg3', "Once the Source Control Graph view is opened you can:"));
		content.push(localize('scm-graph-msg4', " - Use the up/down arrow keys to navigate the list of history items."));
		content.push(localize('scm-graph-msg5', " - Use the Space key to open the history item details in the multi-file diff editor."));

		return content.join('\n');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/scm/browser/scmHistory.ts]---
Location: vscode-main/src/vs/workbench/contrib/scm/browser/scmHistory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { deepClone } from '../../../../base/common/objects.js';
import { badgeBackground, chartsBlue, chartsPurple, foreground } from '../../../../platform/theme/common/colorRegistry.js';
import { asCssVariable, ColorIdentifier, registerColor } from '../../../../platform/theme/common/colorUtils.js';
import { ISCMHistoryItem, ISCMHistoryItemGraphNode, ISCMHistoryItemRef, ISCMHistoryItemViewModel, SCMIncomingHistoryItemId, SCMOutgoingHistoryItemId } from '../common/history.js';
import { rot } from '../../../../base/common/numbers.js';
import { $, svgElem } from '../../../../base/browser/dom.js';
import { PANEL_BACKGROUND } from '../../../common/theme.js';
import { DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { IMarkdownString, isEmptyMarkdownString, isMarkdownString, MarkdownString } from '../../../../base/common/htmlContent.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';
import { findLastIdx } from '../../../../base/common/arraysFind.js';

export const SWIMLANE_HEIGHT = 22;
export const SWIMLANE_WIDTH = 11;
const SWIMLANE_CURVE_RADIUS = 5;
const CIRCLE_RADIUS = 4;
const CIRCLE_STROKE_WIDTH = 2;

/**
 * History item reference colors (local, remote, base)
 */
export const historyItemRefColor = registerColor('scmGraph.historyItemRefColor', chartsBlue, localize('scmGraphHistoryItemRefColor', "History item reference color."));
export const historyItemRemoteRefColor = registerColor('scmGraph.historyItemRemoteRefColor', chartsPurple, localize('scmGraphHistoryItemRemoteRefColor', "History item remote reference color."));
export const historyItemBaseRefColor = registerColor('scmGraph.historyItemBaseRefColor', '#EA5C00', localize('scmGraphHistoryItemBaseRefColor', "History item base reference color."));

/**
 * History item hover color
 */
export const historyItemHoverDefaultLabelForeground = registerColor('scmGraph.historyItemHoverDefaultLabelForeground', foreground, localize('scmGraphHistoryItemHoverDefaultLabelForeground', "History item hover default label foreground color."));
export const historyItemHoverDefaultLabelBackground = registerColor('scmGraph.historyItemHoverDefaultLabelBackground', badgeBackground, localize('scmGraphHistoryItemHoverDefaultLabelBackground', "History item hover default label background color."));
export const historyItemHoverLabelForeground = registerColor('scmGraph.historyItemHoverLabelForeground', PANEL_BACKGROUND, localize('scmGraphHistoryItemHoverLabelForeground', "History item hover label foreground color."));
export const historyItemHoverAdditionsForeground = registerColor('scmGraph.historyItemHoverAdditionsForeground', { light: '#587C0C', dark: '#81B88B', hcDark: '#A1E3AD', hcLight: '#374E06' }, localize('scmGraph.HistoryItemHoverAdditionsForeground', "History item hover additions foreground color."));
export const historyItemHoverDeletionsForeground = registerColor('scmGraph.historyItemHoverDeletionsForeground', { light: '#AD0707', dark: '#C74E39', hcDark: '#C74E39', hcLight: '#AD0707' }, localize('scmGraph.HistoryItemHoverDeletionsForeground', "History item hover deletions foreground color."));

/**
 * History graph color registry
 */
export const colorRegistry: ColorIdentifier[] = [
	registerColor('scmGraph.foreground1', '#FFB000', localize('scmGraphForeground1', "Source control graph foreground color (1).")),
	registerColor('scmGraph.foreground2', '#DC267F', localize('scmGraphForeground2', "Source control graph foreground color (2).")),
	registerColor('scmGraph.foreground3', '#994F00', localize('scmGraphForeground3', "Source control graph foreground color (3).")),
	registerColor('scmGraph.foreground4', '#40B0A6', localize('scmGraphForeground4', "Source control graph foreground color (4).")),
	registerColor('scmGraph.foreground5', '#B66DFF', localize('scmGraphForeground5', "Source control graph foreground color (5).")),
];

function getLabelColorIdentifier(historyItem: ISCMHistoryItem, colorMap: Map<string, ColorIdentifier | undefined>): ColorIdentifier | undefined {
	if (historyItem.id === SCMIncomingHistoryItemId) {
		return historyItemRemoteRefColor;
	} else if (historyItem.id === SCMOutgoingHistoryItemId) {
		return historyItemRefColor;
	} else {
		for (const ref of historyItem.references ?? []) {
			const colorIdentifier = colorMap.get(ref.id);
			if (colorIdentifier !== undefined) {
				return colorIdentifier;
			}
		}
	}

	return undefined;
}

function createPath(colorIdentifier: string, strokeWidth = 1): SVGPathElement {
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute('fill', 'none');
	path.setAttribute('stroke-width', `${strokeWidth}px`);
	path.setAttribute('stroke-linecap', 'round');
	path.style.stroke = asCssVariable(colorIdentifier);

	return path;
}

function drawCircle(index: number, radius: number, strokeWidth: number, colorIdentifier?: string): SVGCircleElement {
	const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	circle.setAttribute('cx', `${SWIMLANE_WIDTH * (index + 1)}`);
	circle.setAttribute('cy', `${SWIMLANE_WIDTH}`);
	circle.setAttribute('r', `${radius}`);

	circle.style.strokeWidth = `${strokeWidth}px`;
	if (colorIdentifier) {
		circle.style.fill = asCssVariable(colorIdentifier);
	}

	return circle;
}

function drawDashedCircle(index: number, radius: number, strokeWidth: number, colorIdentifier: string): SVGCircleElement {
	const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	circle.setAttribute('cx', `${SWIMLANE_WIDTH * (index + 1)}`);
	circle.setAttribute('cy', `${SWIMLANE_WIDTH}`);
	circle.setAttribute('r', `${CIRCLE_RADIUS + 1}`);

	circle.style.stroke = asCssVariable(colorIdentifier);
	circle.style.strokeWidth = `${strokeWidth}px`;
	circle.style.strokeDasharray = '4,2';

	return circle;
}

function drawVerticalLine(x1: number, y1: number, y2: number, color: string, strokeWidth = 1): SVGPathElement {
	const path = createPath(color, strokeWidth);
	path.setAttribute('d', `M ${x1} ${y1} V ${y2}`);

	return path;
}

function findLastIndex(nodes: ISCMHistoryItemGraphNode[], id: string): number {
	for (let i = nodes.length - 1; i >= 0; i--) {
		if (nodes[i].id === id) {
			return i;
		}
	}

	return -1;
}

export function renderSCMHistoryItemGraph(historyItemViewModel: ISCMHistoryItemViewModel): SVGElement {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.classList.add('graph');

	const historyItem = historyItemViewModel.historyItem;
	const inputSwimlanes = historyItemViewModel.inputSwimlanes;
	const outputSwimlanes = historyItemViewModel.outputSwimlanes;

	// Find the history item in the input swimlanes
	const inputIndex = inputSwimlanes.findIndex(node => node.id === historyItem.id);

	// Circle index - use the input swimlane index if present, otherwise add it to the end
	const circleIndex = inputIndex !== -1 ? inputIndex : inputSwimlanes.length;

	// Circle color - use the output swimlane color if present, otherwise the input swimlane color
	const circleColor = circleIndex < outputSwimlanes.length ? outputSwimlanes[circleIndex].color :
		circleIndex < inputSwimlanes.length ? inputSwimlanes[circleIndex].color : historyItemRefColor;

	let outputSwimlaneIndex = 0;
	for (let index = 0; index < inputSwimlanes.length; index++) {
		const color = inputSwimlanes[index].color;

		// Current commit
		if (inputSwimlanes[index].id === historyItem.id) {
			// Base commit
			if (index !== circleIndex) {
				const d: string[] = [];
				const path = createPath(color);

				// Draw /
				d.push(`M ${SWIMLANE_WIDTH * (index + 1)} 0`);
				d.push(`A ${SWIMLANE_WIDTH} ${SWIMLANE_WIDTH} 0 0 1 ${SWIMLANE_WIDTH * (index)} ${SWIMLANE_WIDTH}`);

				// Draw -
				d.push(`H ${SWIMLANE_WIDTH * (circleIndex + 1)}`);

				path.setAttribute('d', d.join(' '));
				svg.append(path);
			} else {
				outputSwimlaneIndex++;
			}
		} else {
			// Not the current commit
			if (outputSwimlaneIndex < outputSwimlanes.length &&
				inputSwimlanes[index].id === outputSwimlanes[outputSwimlaneIndex].id) {
				if (index === outputSwimlaneIndex) {
					// Draw |
					const path = drawVerticalLine(SWIMLANE_WIDTH * (index + 1), 0, SWIMLANE_HEIGHT, color);
					svg.append(path);
				} else {
					const d: string[] = [];
					const path = createPath(color);

					// Draw |
					d.push(`M ${SWIMLANE_WIDTH * (index + 1)} 0`);
					d.push(`V 6`);

					// Draw /
					d.push(`A ${SWIMLANE_CURVE_RADIUS} ${SWIMLANE_CURVE_RADIUS} 0 0 1 ${(SWIMLANE_WIDTH * (index + 1)) - SWIMLANE_CURVE_RADIUS} ${SWIMLANE_HEIGHT / 2}`);

					// Draw -
					d.push(`H ${(SWIMLANE_WIDTH * (outputSwimlaneIndex + 1)) + SWIMLANE_CURVE_RADIUS}`);

					// Draw /
					d.push(`A ${SWIMLANE_CURVE_RADIUS} ${SWIMLANE_CURVE_RADIUS} 0 0 0 ${SWIMLANE_WIDTH * (outputSwimlaneIndex + 1)} ${(SWIMLANE_HEIGHT / 2) + SWIMLANE_CURVE_RADIUS}`);

					// Draw |
					d.push(`V ${SWIMLANE_HEIGHT}`);

					path.setAttribute('d', d.join(' '));
					svg.append(path);
				}

				outputSwimlaneIndex++;
			}
		}
	}

	// Add remaining parent(s)
	for (let i = 1; i < historyItem.parentIds.length; i++) {
		const parentOutputIndex = findLastIndex(outputSwimlanes, historyItem.parentIds[i]);
		if (parentOutputIndex === -1) {
			continue;
		}

		// Draw -\
		const d: string[] = [];
		const path = createPath(outputSwimlanes[parentOutputIndex].color);

		// Draw \
		d.push(`M ${SWIMLANE_WIDTH * parentOutputIndex} ${SWIMLANE_HEIGHT / 2}`);
		d.push(`A ${SWIMLANE_WIDTH} ${SWIMLANE_WIDTH} 0 0 1 ${SWIMLANE_WIDTH * (parentOutputIndex + 1)} ${SWIMLANE_HEIGHT}`);

		// Draw -
		d.push(`M ${SWIMLANE_WIDTH * parentOutputIndex} ${SWIMLANE_HEIGHT / 2}`);
		d.push(`H ${SWIMLANE_WIDTH * (circleIndex + 1)} `);

		path.setAttribute('d', d.join(' '));
		svg.append(path);
	}

	// Draw | to *
	if (inputIndex !== -1) {
		const path = drawVerticalLine(SWIMLANE_WIDTH * (circleIndex + 1), 0, SWIMLANE_HEIGHT / 2, inputSwimlanes[inputIndex].color);
		svg.append(path);
	}

	// Draw | from *
	if (historyItem.parentIds.length > 0) {
		const path = drawVerticalLine(SWIMLANE_WIDTH * (circleIndex + 1), SWIMLANE_HEIGHT / 2, SWIMLANE_HEIGHT, circleColor);
		svg.append(path);
	}

	// Draw *
	if (historyItemViewModel.kind === 'HEAD') {
		// HEAD
		const outerCircle = drawCircle(circleIndex, CIRCLE_RADIUS + 3, CIRCLE_STROKE_WIDTH, circleColor);
		svg.append(outerCircle);

		const innerCircle = drawCircle(circleIndex, CIRCLE_STROKE_WIDTH, CIRCLE_RADIUS);
		svg.append(innerCircle);
	} else if (historyItemViewModel.kind === 'incoming-changes' || historyItemViewModel.kind === 'outgoing-changes') {
		// Incoming/Outgoing changes
		const outerCircle = drawCircle(circleIndex, CIRCLE_RADIUS + 3, CIRCLE_STROKE_WIDTH, circleColor);
		svg.append(outerCircle);

		const innerCircle = drawCircle(circleIndex, CIRCLE_RADIUS + 1, CIRCLE_STROKE_WIDTH + 1);
		svg.append(innerCircle);

		const dashedCircle = drawDashedCircle(circleIndex, CIRCLE_RADIUS + 1, CIRCLE_STROKE_WIDTH - 1, circleColor);
		svg.append(dashedCircle);
	} else {
		if (historyItem.parentIds.length > 1) {
			// Multi-parent node
			const circleOuter = drawCircle(circleIndex, CIRCLE_RADIUS + 2, CIRCLE_STROKE_WIDTH, circleColor);
			svg.append(circleOuter);

			const circleInner = drawCircle(circleIndex, CIRCLE_RADIUS - 1, CIRCLE_STROKE_WIDTH, circleColor);
			svg.append(circleInner);
		} else {
			// Node
			const circle = drawCircle(circleIndex, CIRCLE_RADIUS + 1, CIRCLE_STROKE_WIDTH, circleColor);
			svg.append(circle);
		}
	}

	// Set dimensions
	svg.style.height = `${SWIMLANE_HEIGHT}px`;
	svg.style.width = `${SWIMLANE_WIDTH * (Math.max(inputSwimlanes.length, outputSwimlanes.length, 1) + 1)}px`;

	return svg;
}

export function renderSCMHistoryGraphPlaceholder(columns: ISCMHistoryItemGraphNode[], highlightIndex?: number): HTMLElement {
	const elements = svgElem('svg', {
		style: { height: `${SWIMLANE_HEIGHT}px`, width: `${SWIMLANE_WIDTH * (columns.length + 1)}px`, }
	});

	// Draw |
	for (let index = 0; index < columns.length; index++) {
		const strokeWidth = index === highlightIndex ? 3 : 1;
		const path = drawVerticalLine(SWIMLANE_WIDTH * (index + 1), 0, SWIMLANE_HEIGHT, columns[index].color, strokeWidth);
		elements.root.append(path);
	}

	return elements.root;
}

export function toISCMHistoryItemViewModelArray(
	historyItems: ISCMHistoryItem[],
	colorMap = new Map<string, ColorIdentifier | undefined>(),
	currentHistoryItemRef?: ISCMHistoryItemRef,
	currentHistoryItemRemoteRef?: ISCMHistoryItemRef,
	currentHistoryItemBaseRef?: ISCMHistoryItemRef,
	addIncomingChanges?: boolean,
	addOutgoingChanges?: boolean,
	mergeBase?: string
): ISCMHistoryItemViewModel[] {
	let colorIndex = -1;
	const viewModels: ISCMHistoryItemViewModel[] = [];

	for (let index = 0; index < historyItems.length; index++) {
		const historyItem = historyItems[index];

		const kind = historyItem.id === currentHistoryItemRef?.revision ? 'HEAD' : 'node';
		const outputSwimlanesFromPreviousItem = viewModels.at(-1)?.outputSwimlanes ?? [];
		const inputSwimlanes = outputSwimlanesFromPreviousItem.map(i => deepClone(i));
		const outputSwimlanes: ISCMHistoryItemGraphNode[] = [];

		let firstParentAdded = false;

		// Add first parent to the output
		if (historyItem.parentIds.length > 0) {
			for (const node of inputSwimlanes) {
				if (node.id === historyItem.id) {
					if (!firstParentAdded) {
						outputSwimlanes.push({
							id: historyItem.parentIds[0],
							color: getLabelColorIdentifier(historyItem, colorMap) ?? node.color
						});
						firstParentAdded = true;
					}

					continue;
				}

				outputSwimlanes.push(deepClone(node));
			}
		}

		// Add unprocessed parent(s) to the output
		for (let i = firstParentAdded ? 1 : 0; i < historyItem.parentIds.length; i++) {
			// Color index (label -> next color)
			let colorIdentifier: string | undefined;

			if (i === 0) {
				colorIdentifier = getLabelColorIdentifier(historyItem, colorMap);
			} else {
				const historyItemParent = historyItems
					.find(h => h.id === historyItem.parentIds[i]);
				colorIdentifier = historyItemParent ? getLabelColorIdentifier(historyItemParent, colorMap) : undefined;
			}

			if (!colorIdentifier) {
				colorIndex = rot(colorIndex + 1, colorRegistry.length);
				colorIdentifier = colorRegistry[colorIndex];
			}

			outputSwimlanes.push({
				id: historyItem.parentIds[i],
				color: colorIdentifier
			});
		}

		// Add colors to references
		const references = (historyItem.references ?? [])
			.map(ref => {
				let color = colorMap.get(ref.id);
				if (colorMap.has(ref.id) && color === undefined) {
					// Find the history item in the input swimlanes
					const inputIndex = inputSwimlanes.findIndex(node => node.id === historyItem.id);

					// Circle index - use the input swimlane index if present, otherwise add it to the end
					const circleIndex = inputIndex !== -1 ? inputIndex : inputSwimlanes.length;

					// Circle color - use the output swimlane color if present, otherwise the input swimlane color
					color = circleIndex < outputSwimlanes.length ? outputSwimlanes[circleIndex].color :
						circleIndex < inputSwimlanes.length ? inputSwimlanes[circleIndex].color : historyItemRefColor;
				}

				return { ...ref, color };
			});

		// Sort references
		references.sort((ref1, ref2) =>
			compareHistoryItemRefs(ref1, ref2, currentHistoryItemRef, currentHistoryItemRemoteRef, currentHistoryItemBaseRef));

		viewModels.push({
			historyItem: {
				...historyItem,
				references
			},
			kind,
			inputSwimlanes,
			outputSwimlanes
		} satisfies ISCMHistoryItemViewModel);
	}

	// Add incoming/outgoing changes history item view models. While working
	// with the view models is a little bit more complex, we are doing this
	// after creating the view models so that we can use the swimlane colors
	// to add the incoming/outgoing changes history items view models to the
	// correct swimlanes.
	addIncomingOutgoingChangesHistoryItems(
		viewModels,
		currentHistoryItemRef,
		currentHistoryItemRemoteRef,
		addIncomingChanges,
		addOutgoingChanges,
		mergeBase
	);

	return viewModels;
}

export function getHistoryItemIndex(historyItemViewModel: ISCMHistoryItemViewModel): number {
	const historyItem = historyItemViewModel.historyItem;
	const inputSwimlanes = historyItemViewModel.inputSwimlanes;

	// Find the history item in the input swimlanes
	const inputIndex = inputSwimlanes.findIndex(node => node.id === historyItem.id);

	// Circle index - use the input swimlane index if present, otherwise add it to the end
	return inputIndex !== -1 ? inputIndex : inputSwimlanes.length;
}

function addIncomingOutgoingChangesHistoryItems(
	viewModels: ISCMHistoryItemViewModel[],
	currentHistoryItemRef?: ISCMHistoryItemRef,
	currentHistoryItemRemoteRef?: ISCMHistoryItemRef,
	addIncomingChanges?: boolean,
	addOutgoingChanges?: boolean,
	mergeBase?: string
): void {
	if (currentHistoryItemRef?.revision !== currentHistoryItemRemoteRef?.revision && mergeBase) {
		// Incoming changes node
		if (addIncomingChanges && currentHistoryItemRemoteRef && currentHistoryItemRemoteRef.revision !== mergeBase) {
			// Find the before/after indices using the merge base (might not be present if the merge base history item is not loaded yet)
			const beforeHistoryItemIndex = findLastIdx(viewModels, vm => vm.outputSwimlanes.some(node => node.id === mergeBase));
			const afterHistoryItemIndex = viewModels.findIndex(vm => vm.historyItem.id === mergeBase);

			if (beforeHistoryItemIndex !== -1 && afterHistoryItemIndex !== -1) {
				// There is a known edge case in which the incoming changes have already
				// been merged. For this scenario, we will not be showing the incoming
				// changes history item. https://github.com/microsoft/vscode/issues/276064
				const incomingChangeMerged = viewModels[beforeHistoryItemIndex].historyItem.parentIds.length === 2 &&
					viewModels[beforeHistoryItemIndex].historyItem.parentIds.includes(mergeBase);

				if (!incomingChangeMerged) {
					// Update the before node so that the incoming and outgoing swimlanes
					// point to the `incoming-changes` node instead of the merge base
					viewModels[beforeHistoryItemIndex] = {
						...viewModels[beforeHistoryItemIndex],
						inputSwimlanes: viewModels[beforeHistoryItemIndex].inputSwimlanes
							.map(node => {
								return node.id === mergeBase && node.color === historyItemRemoteRefColor
									? { ...node, id: SCMIncomingHistoryItemId }
									: node;
							}),
						outputSwimlanes: viewModels[beforeHistoryItemIndex].outputSwimlanes
							.map(node => {
								return node.id === mergeBase && node.color === historyItemRemoteRefColor
									? { ...node, id: SCMIncomingHistoryItemId }
									: node;
							})
					};

					// Create incoming changes node
					const inputSwimlanes = viewModels[beforeHistoryItemIndex].outputSwimlanes.map(i => deepClone(i));
					const outputSwimlanes = viewModels[afterHistoryItemIndex].inputSwimlanes.map(i => deepClone(i));
					const displayIdLength = viewModels[0].historyItem.displayId?.length ?? 0;

					const incomingChangesHistoryItem = {
						id: SCMIncomingHistoryItemId,
						displayId: '0'.repeat(displayIdLength),
						parentIds: [mergeBase],
						author: currentHistoryItemRemoteRef?.name,
						subject: localize('incomingChanges', 'Incoming Changes'),
						message: ''
					} satisfies ISCMHistoryItem;

					// Insert incoming changes node
					viewModels.splice(afterHistoryItemIndex, 0, {
						historyItem: incomingChangesHistoryItem,
						kind: 'incoming-changes',
						inputSwimlanes,
						outputSwimlanes
					});
				}
			}
		}

		// Outgoing changes node
		if (addOutgoingChanges && currentHistoryItemRef?.revision && currentHistoryItemRef.revision !== mergeBase) {
			// Find the index of the current history item view model (might not be present if the current history item is not loaded yet)
			const currentHistoryItemRefIndex = viewModels.findIndex(vm => vm.kind === 'HEAD' && vm.historyItem.id === currentHistoryItemRef.revision);

			if (currentHistoryItemRefIndex !== -1) {
				// Create outgoing changes node
				const outgoingChangesHistoryItem = {
					id: SCMOutgoingHistoryItemId,
					displayId: viewModels[0].historyItem.displayId
						? '0'.repeat(viewModels[0].historyItem.displayId.length)
						: undefined,
					parentIds: [currentHistoryItemRef.revision],
					author: currentHistoryItemRef?.name,
					subject: localize('outgoingChanges', 'Outgoing Changes'),
					message: ''
				} satisfies ISCMHistoryItem;

				// Copy the input swimlanes from the current history item ref
				const inputSwimlanes = viewModels[currentHistoryItemRefIndex].inputSwimlanes.slice(0);

				// Copy the input swimlanes and add the current history item ref
				const outputSwimlanes = inputSwimlanes.slice(0).concat({
					id: currentHistoryItemRef.revision,
					color: historyItemRefColor
				} satisfies ISCMHistoryItemGraphNode);

				// Insert outgoing changes node
				viewModels.splice(currentHistoryItemRefIndex, 0, {
					historyItem: outgoingChangesHistoryItem,
					kind: 'outgoing-changes',
					inputSwimlanes,
					outputSwimlanes
				});

				// Update the input swimlane for the current history item
				// ref so that it connects with the outgoing changes node
				viewModels[currentHistoryItemRefIndex + 1].inputSwimlanes.push({
					id: currentHistoryItemRef.revision,
					color: historyItemRefColor
				} satisfies ISCMHistoryItemGraphNode);
			}
		}
	}
}

export function compareHistoryItemRefs(
	ref1: ISCMHistoryItemRef,
	ref2: ISCMHistoryItemRef,
	currentHistoryItemRef?: ISCMHistoryItemRef,
	currentHistoryItemRemoteRef?: ISCMHistoryItemRef,
	currentHistoryItemBaseRef?: ISCMHistoryItemRef
): number {
	const getHistoryItemRefOrder = (ref: ISCMHistoryItemRef) => {
		if (ref.id === currentHistoryItemRef?.id) {
			return 1;
		} else if (ref.id === currentHistoryItemRemoteRef?.id) {
			return 2;
		} else if (ref.id === currentHistoryItemBaseRef?.id) {
			return 3;
		} else if (ref.color !== undefined) {
			return 4;
		}

		return 99;
	};

	// Assign order (current > remote > base > color)
	const ref1Order = getHistoryItemRefOrder(ref1);
	const ref2Order = getHistoryItemRefOrder(ref2);

	return ref1Order - ref2Order;
}

export function toHistoryItemHoverContent(markdownRendererService: IMarkdownRendererService, historyItem: ISCMHistoryItem, includeReferences: boolean): { content: string | IMarkdownString | HTMLElement; disposables: IDisposable } {
	const disposables = new DisposableStore();

	if (historyItem.tooltip === undefined) {
		return { content: historyItem.message, disposables };
	}

	if (isMarkdownString(historyItem.tooltip)) {
		return { content: historyItem.tooltip, disposables };
	}

	// References as "injected" into the hover here since the extension does
	// not know that color used in the graph to render the history item at which
	// the reference is pointing to. They are being added before the last element
	// of the array which is assumed to contain the hover commands.
	const tooltipSections = historyItem.tooltip.slice();

	if (includeReferences && historyItem.references?.length) {
		const markdownString = new MarkdownString('', { supportHtml: true, supportThemeIcons: true });

		for (const reference of historyItem.references) {
			const labelIconId = ThemeIcon.isThemeIcon(reference.icon) ? reference.icon.id : '';

			const labelBackgroundColor = reference.color ? asCssVariable(reference.color) : asCssVariable(historyItemHoverDefaultLabelBackground);
			const labelForegroundColor = reference.color ? asCssVariable(historyItemHoverLabelForeground) : asCssVariable(historyItemHoverDefaultLabelForeground);
			markdownString.appendMarkdown(`<span style="color:${labelForegroundColor};background-color:${labelBackgroundColor};border-radius:10px;">&nbsp;$(${labelIconId})&nbsp;`);
			markdownString.appendText(reference.name);
			markdownString.appendMarkdown('&nbsp;&nbsp;</span>');
		}

		markdownString.appendMarkdown(`\n\n---\n\n`);
		tooltipSections.splice(tooltipSections.length - 1, 0, markdownString);
	}

	// Render tooltip content
	const hoverContainer = $('.history-item-hover-container');
	for (const markdownString of tooltipSections) {
		if (isEmptyMarkdownString(markdownString)) {
			continue;
		}

		const renderedContent = markdownRendererService.render(markdownString);
		hoverContainer.appendChild(renderedContent.element);
		disposables.add(renderedContent);
	}

	return { content: hoverContainer, disposables };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/scm/browser/scmHistoryChatContext.ts]---
Location: vscode-main/src/vs/workbench/contrib/scm/browser/scmHistoryChatContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../../base/common/arrays.js';
import { ThrottledDelayer } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { fromNow } from '../../../../base/common/date.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { basename } from '../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ITextModelContentProvider, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { localize } from '../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { CodeDataTransfers } from '../../../../platform/dnd/browser/dnd.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IChatWidget, IChatWidgetService } from '../../chat/browser/chat.js';
import { IChatContextPickerItem, IChatContextPickerPickItem, IChatContextPickService, picksWithPromiseFn } from '../../chat/browser/chatContextPickService.js';
import { ChatContextKeys } from '../../chat/common/chatContextKeys.js';
import { ISCMHistoryItemChangeVariableEntry, ISCMHistoryItemVariableEntry } from '../../chat/common/chatVariableEntries.js';
import { ScmHistoryItemResolver } from '../../multiDiffEditor/browser/scmMultiDiffSourceResolver.js';
import { ISCMHistoryItem, ISCMHistoryItemChange } from '../common/history.js';
import { ISCMProvider, ISCMService, ISCMViewService } from '../common/scm.js';

export interface SCMHistoryItemTransferData {
	readonly name: string;
	readonly resource: UriComponents;
	readonly historyItem: ISCMHistoryItem;
}

export function extractSCMHistoryItemDropData(e: DragEvent): SCMHistoryItemTransferData[] | undefined {
	if (!e.dataTransfer?.types.includes(CodeDataTransfers.SCM_HISTORY_ITEM)) {
		return undefined;
	}

	const data = e.dataTransfer?.getData(CodeDataTransfers.SCM_HISTORY_ITEM);
	if (!data) {
		return undefined;
	}

	return JSON.parse(data) as SCMHistoryItemTransferData[];
}

export class SCMHistoryItemContextContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.chat.scmHistoryItemContextContribution';

	constructor(
		@IChatContextPickService contextPickService: IChatContextPickService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ITextModelService textModelResolverService: ITextModelService
	) {
		super();
		this._store.add(contextPickService.registerChatContextItem(
			instantiationService.createInstance(SCMHistoryItemContext)));

		this._store.add(textModelResolverService.registerTextModelContentProvider(
			ScmHistoryItemResolver.scheme,
			instantiationService.createInstance(SCMHistoryItemContextContentProvider)));

		this._store.add(textModelResolverService.registerTextModelContentProvider(
			SCMHistoryItemChangeRangeContentProvider.scheme,
			instantiationService.createInstance(SCMHistoryItemChangeRangeContentProvider)));
	}
}

class SCMHistoryItemContext implements IChatContextPickerItem {
	readonly type = 'pickerPick';
	readonly label = localize('chatContext.scmHistoryItems', 'Source Control...');
	readonly icon = Codicon.gitCommit;

	private readonly _delayer = new ThrottledDelayer<IChatContextPickerPickItem[]>(200);

	public static asAttachment(provider: ISCMProvider, historyItem: ISCMHistoryItem): ISCMHistoryItemVariableEntry {
		const historyItemParentId = historyItem.parentIds.length > 0 ? historyItem.parentIds[0] : undefined;
		const multiDiffSourceUri = ScmHistoryItemResolver.getMultiDiffSourceUri(provider, historyItem.id, historyItemParentId, historyItem.displayId);
		const attachmentName = `$(${Codicon.repo.id})\u00A0${provider.name}\u00A0$(${Codicon.gitCommit.id})\u00A0${historyItem.displayId ?? historyItem.id}`;

		return {
			id: historyItem.id,
			name: attachmentName,
			value: multiDiffSourceUri,
			historyItem: {
				...historyItem,
				references: []
			},
			kind: 'scmHistoryItem'
		} satisfies ISCMHistoryItemVariableEntry;
	}

	constructor(
		@ISCMViewService private readonly _scmViewService: ISCMViewService
	) { }

	isEnabled(widget: IChatWidget): Promise<boolean> | boolean {
		const activeRepository = this._scmViewService.activeRepository.get();
		const supported = !!widget.attachmentCapabilities.supportsSourceControlAttachments;
		return activeRepository?.repository.provider.historyProvider.get() !== undefined && supported;
	}

	asPicker(_widget: IChatWidget) {
		return {
			placeholder: localize('chatContext.scmHistoryItems.placeholder', 'Select a change'),
			picks: picksWithPromiseFn((query: string, token: CancellationToken) => {
				const filterText = query.trim() !== '' ? query.trim() : undefined;
				const activeRepository = this._scmViewService.activeRepository.get();
				const historyProvider = activeRepository?.repository.provider.historyProvider.get();
				if (!activeRepository || !historyProvider) {
					return Promise.resolve([]);
				}

				const historyItemRefs = coalesce([
					historyProvider.historyItemRef.get(),
					historyProvider.historyItemRemoteRef.get(),
					historyProvider.historyItemBaseRef.get(),
				]).map(ref => ref.id);

				return this._delayer.trigger(() => {
					return historyProvider.provideHistoryItems({ historyItemRefs, filterText, limit: 100 }, token)
						.then(historyItems => {
							if (!historyItems) {
								return [];
							}

							return historyItems.map(historyItem => {
								const details = [`${historyItem.displayId ?? historyItem.id}`];
								if (historyItem.author) {
									details.push(historyItem.author);
								}
								if (historyItem.statistics) {
									details.push(`${historyItem.statistics.files} ${localize('files', 'file(s)')}`);
								}
								if (historyItem.timestamp) {
									details.push(fromNow(historyItem.timestamp, true, true));
								}

								return {
									iconClass: ThemeIcon.asClassName(Codicon.gitCommit),
									label: historyItem.subject,
									detail: details.join(`$(${Codicon.circleSmallFilled.id})`),
									asAttachment: () => SCMHistoryItemContext.asAttachment(activeRepository.repository.provider, historyItem)
								} satisfies IChatContextPickerPickItem;
							});
						});
				});
			})
		};
	}
}

class SCMHistoryItemContextContentProvider implements ITextModelContentProvider {
	constructor(
		@IModelService private readonly _modelService: IModelService,
		@ISCMService private readonly _scmService: ISCMService
	) { }

	async provideTextContent(resource: URI): Promise<ITextModel | null> {
		const uriFields = ScmHistoryItemResolver.parseUri(resource);
		if (!uriFields) {
			return null;
		}

		const textModel = this._modelService.getModel(resource);
		if (textModel) {
			return textModel;
		}

		const { repositoryId, historyItemId } = uriFields;
		const repository = this._scmService.getRepository(repositoryId);
		const historyProvider = repository?.provider.historyProvider.get();
		if (!repository || !historyProvider) {
			return null;
		}

		const historyItemContext = await historyProvider.resolveHistoryItemChatContext(historyItemId);
		if (!historyItemContext) {
			return null;
		}

		return this._modelService.createModel(historyItemContext, null, resource, false);
	}
}

export interface ScmHistoryItemChangeRangeUriFields {
	readonly repositoryId: string;
	readonly start: string;
	readonly end: string;
}

export class SCMHistoryItemChangeRangeContentProvider implements ITextModelContentProvider {
	static readonly scheme = 'scm-history-item-change-range';
	constructor(
		@IModelService private readonly _modelService: IModelService,
		@ISCMService private readonly _scmService: ISCMService
	) { }

	async provideTextContent(resource: URI): Promise<ITextModel | null> {
		const uriFields = this._parseUri(resource);
		if (!uriFields) {
			return null;
		}

		const textModel = this._modelService.getModel(resource);
		if (textModel) {
			return textModel;
		}

		const { repositoryId, start, end } = uriFields;
		const repository = this._scmService.getRepository(repositoryId);
		const historyProvider = repository?.provider.historyProvider.get();
		if (!repository || !historyProvider) {
			return null;
		}

		const historyItemChangeRangeContext = await historyProvider.resolveHistoryItemChangeRangeChatContext(end, start, resource.path);
		if (!historyItemChangeRangeContext) {
			return null;
		}

		return this._modelService.createModel(historyItemChangeRangeContext, null, resource, false);
	}

	private _parseUri(uri: URI): ScmHistoryItemChangeRangeUriFields | undefined {
		if (uri.scheme !== SCMHistoryItemChangeRangeContentProvider.scheme) {
			return undefined;
		}

		let query: ScmHistoryItemChangeRangeUriFields;
		try {
			query = JSON.parse(uri.query) as ScmHistoryItemChangeRangeUriFields;
		} catch (e) {
			return undefined;
		}

		if (typeof query !== 'object' || query === null) {
			return undefined;
		}

		const { repositoryId, start, end } = query;
		if (typeof repositoryId !== 'string' || typeof start !== 'string' || typeof end !== 'string') {
			return undefined;
		}

		return { repositoryId, start, end };
	}
}

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.scm.action.graph.addHistoryItemToChat',
			title: localize('chat.action.scmHistoryItemContext', 'Add to Chat'),
			f1: false,
			menu: {
				id: MenuId.SCMHistoryItemContext,
				group: 'z_chat',
				order: 1,
				when: ChatContextKeys.enabled
			}
		});
	}

	override async run(accessor: ServicesAccessor, provider: ISCMProvider, historyItem: ISCMHistoryItem): Promise<void> {
		const chatWidgetService = accessor.get(IChatWidgetService);
		const widget = await chatWidgetService.revealWidget();
		if (!provider || !historyItem || !widget) {
			return;
		}

		widget.attachmentModel.addContext(SCMHistoryItemContext.asAttachment(provider, historyItem));
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.scm.action.graph.summarizeHistoryItem',
			title: localize('chat.action.scmHistoryItemSummarize', 'Explain Changes'),
			f1: false,
			menu: {
				id: MenuId.SCMHistoryItemContext,
				group: 'z_chat',
				order: 2,
				when: ChatContextKeys.enabled
			}
		});
	}

	override async run(accessor: ServicesAccessor, provider: ISCMProvider, historyItem: ISCMHistoryItem): Promise<void> {
		const chatWidgetService = accessor.get(IChatWidgetService);
		const widget = await chatWidgetService.revealWidget();
		if (!provider || !historyItem || !widget) {
			return;
		}

		widget.attachmentModel.addContext(SCMHistoryItemContext.asAttachment(provider, historyItem));
		await widget.acceptInput('Summarize the attached history item');
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.scm.action.graph.addHistoryItemChangeToChat',
			title: localize('chat.action.scmHistoryItemContext', 'Add to Chat'),
			f1: false,
			menu: {
				id: MenuId.SCMHistoryItemChangeContext,
				group: 'z_chat',
				order: 1,
				when: ChatContextKeys.enabled
			}
		});
	}

	override async run(accessor: ServicesAccessor, historyItem: ISCMHistoryItem, historyItemChange: ISCMHistoryItemChange): Promise<void> {
		const chatWidgetService = accessor.get(IChatWidgetService);
		const widget = await chatWidgetService.revealWidget();
		if (!historyItem || !historyItemChange.modifiedUri || !widget) {
			return;
		}

		widget.attachmentModel.addContext({
			id: historyItemChange.uri.toString(),
			name: `${basename(historyItemChange.modifiedUri)}`,
			value: historyItemChange.modifiedUri,
			historyItem: historyItem,
			kind: 'scmHistoryItemChange',
		} satisfies ISCMHistoryItemChangeVariableEntry);
	}
});
```

--------------------------------------------------------------------------------

````
