---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 372
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 372 of 552)

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

---[FILE: src/vs/workbench/contrib/codeEditor/browser/outline/documentSymbolsOutline.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/outline/documentSymbolsOutline.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { OutlineConfigCollapseItemsValues, IBreadcrumbsDataSource, IBreadcrumbsOutlineElement, IOutline, IOutlineCreator, IOutlineListConfig, IOutlineService, OutlineChangeEvent, OutlineConfigKeys, OutlineTarget, } from '../../../../services/outline/browser/outline.js';
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../../common/contributions.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { LifecyclePhase } from '../../../../services/lifecycle/common/lifecycle.js';
import { IEditorPane } from '../../../../common/editor.js';
import { DocumentSymbolComparator, DocumentSymbolAccessibilityProvider, DocumentSymbolRenderer, DocumentSymbolFilter, DocumentSymbolGroupRenderer, DocumentSymbolIdentityProvider, DocumentSymbolNavigationLabelProvider, DocumentSymbolVirtualDelegate, DocumentSymbolDragAndDrop } from './documentSymbolsTree.js';
import { ICodeEditor, isCodeEditor, isDiffEditor } from '../../../../../editor/browser/editorBrowser.js';
import { OutlineGroup, OutlineElement, OutlineModel, TreeElement, IOutlineMarker, IOutlineModelService } from '../../../../../editor/contrib/documentSymbols/browser/outlineModel.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { raceCancellation, TimeoutTimer, timeout, Barrier } from '../../../../../base/common/async.js';
import { onUnexpectedError } from '../../../../../base/common/errors.js';
import { URI } from '../../../../../base/common/uri.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { ITextResourceConfigurationService } from '../../../../../editor/common/services/textResourceConfiguration.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IPosition } from '../../../../../editor/common/core/position.js';
import { ScrollType } from '../../../../../editor/common/editorCommon.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { IEditorOptions, TextEditorSelectionRevealType } from '../../../../../platform/editor/common/editor.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { IModelContentChangedEvent } from '../../../../../editor/common/textModelEvents.js';
import { IDataSource } from '../../../../../base/browser/ui/tree/tree.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { localize } from '../../../../../nls.js';
import { IMarkerDecorationsService } from '../../../../../editor/common/services/markerDecorations.js';
import { MarkerSeverity } from '../../../../../platform/markers/common/markers.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { ILanguageFeaturesService } from '../../../../../editor/common/services/languageFeatures.js';

type DocumentSymbolItem = OutlineGroup | OutlineElement;

class DocumentSymbolBreadcrumbsSource implements IBreadcrumbsDataSource<DocumentSymbolItem> {

	private _breadcrumbs: IBreadcrumbsOutlineElement<DocumentSymbolItem>[] = [];

	constructor(
		private readonly _editor: ICodeEditor,
		@ITextResourceConfigurationService private readonly _textResourceConfigurationService: ITextResourceConfigurationService,
	) { }

	getBreadcrumbElements(): readonly IBreadcrumbsOutlineElement<DocumentSymbolItem>[] {
		return this._breadcrumbs;
	}

	clear(): void {
		this._breadcrumbs = [];
	}

	update(model: OutlineModel, position: IPosition): void {
		const newElements = this._computeBreadcrumbs(model, position);
		this._breadcrumbs = newElements.map(element => ({
			element,
			label: element instanceof OutlineElement ? element.symbol.name : ''
		}));
	}

	private _computeBreadcrumbs(model: OutlineModel, position: IPosition): Array<OutlineGroup | OutlineElement> {
		let item: OutlineGroup | OutlineElement | undefined = model.getItemEnclosingPosition(position);
		if (!item) {
			return [];
		}
		const chain: Array<OutlineGroup | OutlineElement> = [];
		while (item) {
			chain.push(item);
			const parent: any = item.parent;
			if (parent instanceof OutlineModel) {
				break;
			}
			if (parent instanceof OutlineGroup && parent.parent && parent.parent.children.size === 1) {
				break;
			}
			item = parent;
		}
		const result: Array<OutlineGroup | OutlineElement> = [];
		for (let i = chain.length - 1; i >= 0; i--) {
			const element = chain[i];
			if (this._isFiltered(element)) {
				break;
			}
			result.push(element);
		}
		if (result.length === 0) {
			return [];
		}
		return result;
	}

	private _isFiltered(element: TreeElement): boolean {
		if (!(element instanceof OutlineElement)) {
			return false;
		}
		const key = `breadcrumbs.${DocumentSymbolFilter.kindToConfigName[element.symbol.kind]}`;
		let uri: URI | undefined;
		if (this._editor && this._editor.getModel()) {
			const model = this._editor.getModel() as ITextModel;
			uri = model.uri;
		}
		return !this._textResourceConfigurationService.getValue<boolean>(uri, key);
	}
}


class DocumentSymbolsOutline implements IOutline<DocumentSymbolItem> {

	private readonly _disposables = new DisposableStore();
	private readonly _onDidChange = new Emitter<OutlineChangeEvent>();

	readonly onDidChange: Event<OutlineChangeEvent> = this._onDidChange.event;

	private _outlineModel?: OutlineModel;
	private readonly _outlineDisposables = new DisposableStore();

	private readonly _breadcrumbsDataSource: DocumentSymbolBreadcrumbsSource;

	readonly config: IOutlineListConfig<DocumentSymbolItem>;

	readonly outlineKind = 'documentSymbols';

	get activeElement(): DocumentSymbolItem | undefined {
		const posistion = this._editor.getPosition();
		if (!posistion || !this._outlineModel) {
			return undefined;
		} else {
			return this._outlineModel.getItemEnclosingPosition(posistion);
		}
	}

	constructor(
		private readonly _editor: ICodeEditor,
		target: OutlineTarget,
		firstLoadBarrier: Barrier,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@ICodeEditorService private readonly _codeEditorService: ICodeEditorService,
		@IOutlineModelService private readonly _outlineModelService: IOutlineModelService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IMarkerDecorationsService private readonly _markerDecorationsService: IMarkerDecorationsService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {

		this._breadcrumbsDataSource = new DocumentSymbolBreadcrumbsSource(_editor, textResourceConfigurationService);
		const delegate = new DocumentSymbolVirtualDelegate();
		const renderers = [new DocumentSymbolGroupRenderer(), instantiationService.createInstance(DocumentSymbolRenderer, true, target)];
		const treeDataSource: IDataSource<this, DocumentSymbolItem> = {
			getChildren: (parent) => {
				if (parent instanceof OutlineElement || parent instanceof OutlineGroup) {
					return parent.children.values();
				}
				if (parent === this && this._outlineModel) {
					return this._outlineModel.children.values();
				}
				return [];
			}
		};
		const comparator = new DocumentSymbolComparator();
		const initialState = textResourceConfigurationService.getValue<OutlineConfigCollapseItemsValues>(_editor.getModel()?.uri, OutlineConfigKeys.collapseItems);
		const options = {
			collapseByDefault: target === OutlineTarget.Breadcrumbs || (target === OutlineTarget.OutlinePane && initialState === OutlineConfigCollapseItemsValues.Collapsed),
			expandOnlyOnTwistieClick: true,
			multipleSelectionSupport: false,
			identityProvider: new DocumentSymbolIdentityProvider(),
			keyboardNavigationLabelProvider: new DocumentSymbolNavigationLabelProvider(),
			accessibilityProvider: new DocumentSymbolAccessibilityProvider(localize('document', "Document Symbols")),
			filter: target === OutlineTarget.OutlinePane
				? instantiationService.createInstance(DocumentSymbolFilter, 'outline')
				: target === OutlineTarget.Breadcrumbs
					? instantiationService.createInstance(DocumentSymbolFilter, 'breadcrumbs')
					: undefined,
			dnd: instantiationService.createInstance(DocumentSymbolDragAndDrop),
		};

		this.config = {
			breadcrumbsDataSource: this._breadcrumbsDataSource,
			delegate,
			renderers,
			treeDataSource,
			comparator,
			options,
			quickPickDataSource: { getQuickPickElements: () => { throw new Error('not implemented'); } },
		};


		// update as language, model, providers changes
		this._disposables.add(_languageFeaturesService.documentSymbolProvider.onDidChange(_ => this._createOutline()));
		this._disposables.add(this._editor.onDidChangeModel(_ => this._createOutline()));
		this._disposables.add(this._editor.onDidChangeModelLanguage(_ => this._createOutline()));

		// update soon'ish as model content change
		const updateSoon = new TimeoutTimer();
		this._disposables.add(updateSoon);
		this._disposables.add(this._editor.onDidChangeModelContent(event => {
			const model = this._editor.getModel();
			if (model) {
				const timeout = _outlineModelService.getDebounceValue(model);
				updateSoon.cancelAndSet(() => this._createOutline(event), timeout);
			}
		}));

		// stop when editor dies
		this._disposables.add(this._editor.onDidDispose(() => this._outlineDisposables.clear()));

		// initial load
		this._createOutline().finally(() => firstLoadBarrier.open());
	}

	dispose(): void {
		this._disposables.dispose();
		this._outlineDisposables.dispose();
	}

	get isEmpty(): boolean {
		return !this._outlineModel || TreeElement.empty(this._outlineModel);
	}

	get uri() {
		return this._outlineModel?.uri;
	}

	async reveal(entry: DocumentSymbolItem, options: IEditorOptions, sideBySide: boolean, select: boolean): Promise<void> {
		const model = OutlineModel.get(entry);
		if (!model || !(entry instanceof OutlineElement)) {
			return;
		}
		await this._codeEditorService.openCodeEditor({
			resource: model.uri,
			options: {
				...options,
				selection: select ? entry.symbol.range : Range.collapseToStart(entry.symbol.selectionRange),
				selectionRevealType: TextEditorSelectionRevealType.NearTopIfOutsideViewport,
			}
		}, this._editor, sideBySide);
	}

	preview(entry: DocumentSymbolItem): IDisposable {
		if (!(entry instanceof OutlineElement)) {
			return Disposable.None;
		}

		const { symbol } = entry;
		this._editor.revealRangeInCenterIfOutsideViewport(symbol.range, ScrollType.Smooth);
		const decorationsCollection = this._editor.createDecorationsCollection([{
			range: symbol.range,
			options: {
				description: 'document-symbols-outline-range-highlight',
				className: 'rangeHighlight',
				isWholeLine: true
			}
		}]);
		return toDisposable(() => decorationsCollection.clear());
	}

	captureViewState(): IDisposable {
		const viewState = this._editor.saveViewState();
		return toDisposable(() => {
			if (viewState) {
				this._editor.restoreViewState(viewState);
			}
		});
	}

	private async _createOutline(contentChangeEvent?: IModelContentChangedEvent): Promise<void> {

		this._outlineDisposables.clear();
		if (!contentChangeEvent) {
			this._setOutlineModel(undefined);
		}

		if (!this._editor.hasModel()) {
			return;
		}
		const buffer = this._editor.getModel();
		if (!this._languageFeaturesService.documentSymbolProvider.has(buffer)) {
			return;
		}

		const cts = new CancellationTokenSource();
		const versionIdThen = buffer.getVersionId();
		const timeoutTimer = new TimeoutTimer();

		this._outlineDisposables.add(timeoutTimer);
		this._outlineDisposables.add(toDisposable(() => cts.dispose(true)));

		try {
			const model = await this._outlineModelService.getOrCreate(buffer, cts.token);
			if (cts.token.isCancellationRequested) {
				// cancelled -> do nothing
				return;
			}

			if (TreeElement.empty(model) || !this._editor.hasModel()) {
				// empty -> no outline elements
				this._setOutlineModel(model);
				return;
			}

			// heuristic: when the symbols-to-lines ratio changes by 50% between edits
			// wait a little (and hope that the next change isn't as drastic).
			if (contentChangeEvent && this._outlineModel && buffer.getLineCount() >= 25) {
				const newSize = TreeElement.size(model);
				const newLength = buffer.getValueLength();
				const newRatio = newSize / newLength;
				const oldSize = TreeElement.size(this._outlineModel);
				const oldLength = newLength - contentChangeEvent.changes.reduce((prev, value) => prev + value.rangeLength, 0);
				const oldRatio = oldSize / oldLength;
				if (newRatio <= oldRatio * 0.5 || newRatio >= oldRatio * 1.5) {
					// wait for a better state and ignore current model when more
					// typing has happened
					const value = await raceCancellation(timeout(2000).then(() => true), cts.token, false);
					if (!value) {
						return;
					}
				}
			}

			// feature: show markers with outline element
			this._applyMarkersToOutline(model);
			this._outlineDisposables.add(this._markerDecorationsService.onDidChangeMarker(textModel => {
				if (isEqual(model.uri, textModel.uri)) {
					this._applyMarkersToOutline(model);
					this._onDidChange.fire({});
				}
			}));
			this._outlineDisposables.add(this._configurationService.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration(OutlineConfigKeys.problemsEnabled) || e.affectsConfiguration('problems.visibility')) {
					const problem = this._configurationService.getValue('problems.visibility');
					const config = this._configurationService.getValue(OutlineConfigKeys.problemsEnabled);

					if (!problem || !config) {
						model.updateMarker([]);
					} else {
						this._applyMarkersToOutline(model);
					}
					this._onDidChange.fire({});
				}
				if (e.affectsConfiguration('outline')) {
					// outline filtering, problems on/off
					this._onDidChange.fire({});
				}
				if (e.affectsConfiguration('breadcrumbs') && this._editor.hasModel()) {
					// breadcrumbs filtering
					this._breadcrumbsDataSource.update(model, this._editor.getPosition());
					this._onDidChange.fire({});
				}
			}));

			// feature: toggle icons
			this._outlineDisposables.add(this._configurationService.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration(OutlineConfigKeys.icons)) {
					this._onDidChange.fire({});
				}
				if (e.affectsConfiguration('outline')) {
					this._onDidChange.fire({});
				}
			}));

			// feature: update active when cursor changes
			this._outlineDisposables.add(this._editor.onDidChangeCursorPosition(_ => {
				timeoutTimer.cancelAndSet(() => {
					if (!buffer.isDisposed() && versionIdThen === buffer.getVersionId() && this._editor.hasModel()) {
						this._breadcrumbsDataSource.update(model, this._editor.getPosition());
						this._onDidChange.fire({ affectOnlyActiveElement: true });
					}
				}, 150);
			}));

			// update properties, send event
			this._setOutlineModel(model);

		} catch (err) {
			this._setOutlineModel(undefined);
			onUnexpectedError(err);
		}
	}

	private _applyMarkersToOutline(model: OutlineModel | undefined): void {
		const problem = this._configurationService.getValue('problems.visibility');
		const config = this._configurationService.getValue(OutlineConfigKeys.problemsEnabled);
		if (!model || !problem || !config) {
			return;
		}
		const markers: IOutlineMarker[] = [];
		for (const [range, marker] of this._markerDecorationsService.getLiveMarkers(model.uri)) {
			if (marker.severity === MarkerSeverity.Error || marker.severity === MarkerSeverity.Warning) {
				markers.push({ ...range, severity: marker.severity });
			}
		}
		model.updateMarker(markers);
	}

	private _setOutlineModel(model: OutlineModel | undefined) {
		const position = this._editor.getPosition();
		if (!position || !model) {
			this._outlineModel = undefined;
			this._breadcrumbsDataSource.clear();
		} else {
			if (!this._outlineModel?.merge(model)) {
				this._outlineModel = model;
			}
			this._breadcrumbsDataSource.update(model, position);
		}
		this._onDidChange.fire({});
	}
}

class DocumentSymbolsOutlineCreator implements IOutlineCreator<IEditorPane, DocumentSymbolItem> {

	readonly dispose: () => void;

	constructor(
		@IOutlineService outlineService: IOutlineService
	) {
		const reg = outlineService.registerOutlineCreator(this);
		this.dispose = () => reg.dispose();
	}

	matches(candidate: IEditorPane): candidate is IEditorPane {
		const ctrl = candidate.getControl();
		return isCodeEditor(ctrl) || isDiffEditor(ctrl);
	}

	async createOutline(pane: IEditorPane, target: OutlineTarget, _token: CancellationToken): Promise<IOutline<DocumentSymbolItem> | undefined> {
		const control = pane.getControl();
		let editor: ICodeEditor | undefined;
		if (isCodeEditor(control)) {
			editor = control;
		} else if (isDiffEditor(control)) {
			editor = control.getModifiedEditor();
		}
		if (!editor) {
			return undefined;
		}
		const firstLoadBarrier = new Barrier();
		const result = editor.invokeWithinContext(accessor => accessor.get(IInstantiationService).createInstance(DocumentSymbolsOutline, editor, target, firstLoadBarrier));
		await firstLoadBarrier.wait();
		return result;
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(DocumentSymbolsOutlineCreator, LifecyclePhase.Eventually);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/outline/documentSymbolsTree.css]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/outline/documentSymbolsTree.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-list .monaco-list-row.focused.selected .outline-element .monaco-highlighted-label,
.monaco-list .monaco-list-row.focused.selected .outline-element-decoration {
	/* make sure selection color wins when a label is being selected */
	color: inherit !important;
}

.monaco-list .outline-element {
	display: flex;
	flex: 1;
	flex-flow: row nowrap;
	align-items: center;
}

.monaco-list .outline-element .monaco-highlighted-label {
	color: var(--outline-element-color);
}

.monaco-breadcrumbs .outline-element .outline-element-decoration,
.monaco-list .outline-element .outline-element-decoration {
	opacity: 0.75;
	font-size: 90%;
	font-weight: 600;
	padding: 0 12px 0 5px;
	margin-left: auto;
	text-align: center;
	color: var(--outline-element-color);
}

/* when showing in breadcrumbs than hide a few things, like markers or descriptions */
.monaco-breadcrumbs .outline-element .monaco-icon-label-container .monaco-icon-description-container,
.monaco-breadcrumbs .outline-element .outline-element-decoration {
	display: none;
}

.monaco-list .outline-element .outline-element-decoration.bubble {
	font-family: codicon;
	font-size: 14px;
	opacity: 0.4;
	padding-right: 8px;
}

.monaco-list .outline-element .outline-element-icon {
	padding-right: 6px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/outline/documentSymbolsTree.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/outline/documentSymbolsTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDragAndDropData } from '../../../../../base/browser/dnd.js';
import * as dom from '../../../../../base/browser/dom.js';
import { HighlightedLabel } from '../../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { IconLabel, IIconLabelValueOptions } from '../../../../../base/browser/ui/iconLabel/iconLabel.js';
import { IIdentityProvider, IKeyboardNavigationLabelProvider, IListVirtualDelegate } from '../../../../../base/browser/ui/list/list.js';
import { ElementsDragAndDropData } from '../../../../../base/browser/ui/list/listView.js';
import { IListAccessibilityProvider } from '../../../../../base/browser/ui/list/listWidget.js';
import { ITreeDragAndDrop, ITreeDragOverReaction, ITreeFilter, ITreeNode, ITreeRenderer } from '../../../../../base/browser/ui/tree/tree.js';
import { safeIntl } from '../../../../../base/common/date.js';
import { createMatches, FuzzyScore } from '../../../../../base/common/filters.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { URI } from '../../../../../base/common/uri.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { DocumentSymbol, getAriaLabelForSymbol, SymbolKind, symbolKindNames, SymbolKinds, SymbolTag } from '../../../../../editor/common/languages.js';
import { ITextResourceConfigurationService } from '../../../../../editor/common/services/textResourceConfiguration.js';
import { OutlineElement, OutlineGroup, OutlineModel } from '../../../../../editor/contrib/documentSymbols/browser/outlineModel.js';
import '../../../../../editor/contrib/symbolIcons/browser/symbolIcons.js'; // The codicon symbol colors are defined here and must be loaded to get colors
import { localize } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { fillInSymbolsDragData, IResourceStat } from '../../../../../platform/dnd/browser/dnd.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { MarkerSeverity } from '../../../../../platform/markers/common/markers.js';
import { withSelection } from '../../../../../platform/opener/common/opener.js';
import { listErrorForeground, listWarningForeground } from '../../../../../platform/theme/common/colorRegistry.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { fillEditorsDragData } from '../../../../browser/dnd.js';
import { IOutlineComparator, OutlineConfigKeys, OutlineTarget } from '../../../../services/outline/browser/outline.js';
import './documentSymbolsTree.css';

export type DocumentSymbolItem = OutlineGroup | OutlineElement;

export class DocumentSymbolNavigationLabelProvider implements IKeyboardNavigationLabelProvider<DocumentSymbolItem> {

	getKeyboardNavigationLabel(element: DocumentSymbolItem): { toString(): string } {
		if (element instanceof OutlineGroup) {
			return element.label;
		} else {
			return element.symbol.name;
		}
	}
}

export class DocumentSymbolAccessibilityProvider implements IListAccessibilityProvider<DocumentSymbolItem> {

	constructor(private readonly _ariaLabel: string) { }

	getWidgetAriaLabel(): string {
		return this._ariaLabel;
	}
	getAriaLabel(element: DocumentSymbolItem): string | null {
		if (element instanceof OutlineGroup) {
			return element.label;
		} else {
			return getAriaLabelForSymbol(element.symbol.name, element.symbol.kind);
		}
	}
}

export class DocumentSymbolIdentityProvider implements IIdentityProvider<DocumentSymbolItem> {
	getId(element: DocumentSymbolItem): { toString(): string } {
		return element.id;
	}
}

export class DocumentSymbolDragAndDrop implements ITreeDragAndDrop<DocumentSymbolItem> {

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) { }

	getDragURI(element: DocumentSymbolItem): string | null {
		const resource = OutlineModel.get(element)?.uri;
		if (!resource) {
			return null;
		}

		if (element instanceof OutlineElement) {
			const symbolUri = symbolRangeUri(resource, element.symbol);
			return symbolUri.fsPath + (symbolUri.fragment ? '#' + symbolUri.fragment : '');
		} else {
			return resource.fsPath;
		}
	}

	getDragLabel(elements: DocumentSymbolItem[], originalEvent: DragEvent): string | undefined {
		// Multi select not supported
		if (elements.length !== 1) {
			return undefined;
		}

		const element = elements[0];
		return element instanceof OutlineElement ? element.symbol.name : element.label;
	}

	onDragStart(data: IDragAndDropData, originalEvent: DragEvent): void {
		const elements = (data as ElementsDragAndDropData<DocumentSymbolItem, DocumentSymbolItem[]>).elements;
		const item = elements[0];
		if (!item || !originalEvent.dataTransfer) {
			return;
		}

		const resource = OutlineModel.get(item)?.uri;
		if (!resource) {
			return;
		}

		const outlineElements = item instanceof OutlineElement ? [item] : Array.from(item.children.values());

		fillInSymbolsDragData(outlineElements.map(oe => ({
			name: oe.symbol.name,
			fsPath: resource.fsPath,
			range: oe.symbol.range,
			kind: oe.symbol.kind
		})), originalEvent);

		this._instantiationService.invokeFunction(accessor => fillEditorsDragData(accessor, outlineElements.map((oe): IResourceStat => ({
			resource,
			selection: oe.symbol.range,
		})), originalEvent));
	}

	onDragOver(): boolean | ITreeDragOverReaction { return false; }
	drop(): void { }
	dispose(): void { }
}

function symbolRangeUri(resource: URI, symbol: DocumentSymbol): URI {
	return withSelection(resource, symbol.range);
}

class DocumentSymbolGroupTemplate {
	static readonly id = 'DocumentSymbolGroupTemplate';
	constructor(
		readonly labelContainer: HTMLElement,
		readonly label: HighlightedLabel,
	) { }

	dispose() {
		this.label.dispose();
	}
}

class DocumentSymbolTemplate {
	static readonly id = 'DocumentSymbolTemplate';
	constructor(
		readonly container: HTMLElement,
		readonly iconLabel: IconLabel,
		readonly iconClass: HTMLElement,
		readonly decoration: HTMLElement,
	) { }
}

export class DocumentSymbolVirtualDelegate implements IListVirtualDelegate<DocumentSymbolItem> {

	getHeight(_element: DocumentSymbolItem): number {
		return 22;
	}

	getTemplateId(element: DocumentSymbolItem): string {
		return element instanceof OutlineGroup
			? DocumentSymbolGroupTemplate.id
			: DocumentSymbolTemplate.id;
	}
}

export class DocumentSymbolGroupRenderer implements ITreeRenderer<OutlineGroup, FuzzyScore, DocumentSymbolGroupTemplate> {

	readonly templateId: string = DocumentSymbolGroupTemplate.id;

	renderTemplate(container: HTMLElement): DocumentSymbolGroupTemplate {
		const labelContainer = dom.$('.outline-element-label');
		container.classList.add('outline-element');
		dom.append(container, labelContainer);
		return new DocumentSymbolGroupTemplate(labelContainer, new HighlightedLabel(labelContainer));
	}

	renderElement(node: ITreeNode<OutlineGroup, FuzzyScore>, _index: number, template: DocumentSymbolGroupTemplate): void {
		template.label.set(node.element.label, createMatches(node.filterData));
	}

	disposeTemplate(_template: DocumentSymbolGroupTemplate): void {
		_template.dispose();
	}
}

export class DocumentSymbolRenderer implements ITreeRenderer<OutlineElement, FuzzyScore, DocumentSymbolTemplate> {

	readonly templateId: string = DocumentSymbolTemplate.id;

	constructor(
		private _renderMarker: boolean,
		target: OutlineTarget,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IThemeService private readonly _themeService: IThemeService,
	) { }

	renderTemplate(container: HTMLElement): DocumentSymbolTemplate {
		container.classList.add('outline-element');
		const iconLabel = new IconLabel(container, { supportHighlights: true });
		const iconClass = dom.$('.outline-element-icon');
		const decoration = dom.$('.outline-element-decoration');
		container.prepend(iconClass);
		container.appendChild(decoration);
		return new DocumentSymbolTemplate(container, iconLabel, iconClass, decoration);
	}

	renderElement(node: ITreeNode<OutlineElement, FuzzyScore>, _index: number, template: DocumentSymbolTemplate): void {
		const { element } = node;
		const extraClasses = ['nowrap'];
		const options: IIconLabelValueOptions = {
			matches: createMatches(node.filterData),
			labelEscapeNewLines: true,
			extraClasses,
			title: localize('title.template', "{0} ({1})", element.symbol.name, symbolKindNames[element.symbol.kind])
		};
		if (this._configurationService.getValue(OutlineConfigKeys.icons)) {
			// add styles for the icons
			template.iconClass.className = '';
			template.iconClass.classList.add('outline-element-icon', 'inline', ...ThemeIcon.asClassNameArray(SymbolKinds.toIcon(element.symbol.kind)));
		}
		if (element.symbol.tags.indexOf(SymbolTag.Deprecated) >= 0) {
			extraClasses.push(`deprecated`);
			options.matches = [];
		}
		template.iconLabel.setLabel(element.symbol.name, element.symbol.detail, options);

		if (this._renderMarker) {
			this._renderMarkerInfo(element, template);
		}
	}

	private _renderMarkerInfo(element: OutlineElement, template: DocumentSymbolTemplate): void {

		if (!element.marker) {
			dom.hide(template.decoration);
			template.container.style.removeProperty('--outline-element-color');
			return;
		}

		const { count, topSev } = element.marker;
		const color = this._themeService.getColorTheme().getColor(topSev === MarkerSeverity.Error ? listErrorForeground : listWarningForeground);
		const cssColor = color ? color.toString() : 'inherit';

		// color of the label
		const problem = this._configurationService.getValue('problems.visibility');
		const configProblems = this._configurationService.getValue(OutlineConfigKeys.problemsColors);

		if (!problem || !configProblems) {
			template.container.style.removeProperty('--outline-element-color');
		} else {
			template.container.style.setProperty('--outline-element-color', cssColor);
		}

		// badge with color/rollup
		if (problem === undefined) {
			return;
		}

		const configBadges = this._configurationService.getValue(OutlineConfigKeys.problemsBadges);
		if (!configBadges || !problem) {
			dom.hide(template.decoration);
		} else if (count > 0) {
			dom.show(template.decoration);
			template.decoration.classList.remove('bubble');
			template.decoration.textContent = count < 10 ? count.toString() : '+9';
			template.decoration.title = count === 1 ? localize('1.problem', "1 problem in this element") : localize('N.problem', "{0} problems in this element", count);
			template.decoration.style.setProperty('--outline-element-color', cssColor);

		} else {
			dom.show(template.decoration);
			template.decoration.classList.add('bubble');
			template.decoration.textContent = '\uea71';
			template.decoration.title = localize('deep.problem', "Contains elements with problems");
			template.decoration.style.setProperty('--outline-element-color', cssColor);
		}
	}

	disposeTemplate(_template: DocumentSymbolTemplate): void {
		_template.iconLabel.dispose();
	}
}

export class DocumentSymbolFilter implements ITreeFilter<DocumentSymbolItem> {

	static readonly kindToConfigName = Object.freeze({
		[SymbolKind.File]: 'showFiles',
		[SymbolKind.Module]: 'showModules',
		[SymbolKind.Namespace]: 'showNamespaces',
		[SymbolKind.Package]: 'showPackages',
		[SymbolKind.Class]: 'showClasses',
		[SymbolKind.Method]: 'showMethods',
		[SymbolKind.Property]: 'showProperties',
		[SymbolKind.Field]: 'showFields',
		[SymbolKind.Constructor]: 'showConstructors',
		[SymbolKind.Enum]: 'showEnums',
		[SymbolKind.Interface]: 'showInterfaces',
		[SymbolKind.Function]: 'showFunctions',
		[SymbolKind.Variable]: 'showVariables',
		[SymbolKind.Constant]: 'showConstants',
		[SymbolKind.String]: 'showStrings',
		[SymbolKind.Number]: 'showNumbers',
		[SymbolKind.Boolean]: 'showBooleans',
		[SymbolKind.Array]: 'showArrays',
		[SymbolKind.Object]: 'showObjects',
		[SymbolKind.Key]: 'showKeys',
		[SymbolKind.Null]: 'showNull',
		[SymbolKind.EnumMember]: 'showEnumMembers',
		[SymbolKind.Struct]: 'showStructs',
		[SymbolKind.Event]: 'showEvents',
		[SymbolKind.Operator]: 'showOperators',
		[SymbolKind.TypeParameter]: 'showTypeParameters',
	});

	constructor(
		private readonly _prefix: 'breadcrumbs' | 'outline',
		@ITextResourceConfigurationService private readonly _textResourceConfigService: ITextResourceConfigurationService,
	) { }

	filter(element: DocumentSymbolItem): boolean {
		const outline = OutlineModel.get(element);
		if (!(element instanceof OutlineElement)) {
			return true;
		}
		const configName = DocumentSymbolFilter.kindToConfigName[element.symbol.kind];
		const configKey = `${this._prefix}.${configName}`;
		return this._textResourceConfigService.getValue(outline?.uri, configKey);
	}
}

export class DocumentSymbolComparator implements IOutlineComparator<DocumentSymbolItem> {

	private readonly _collator = safeIntl.Collator(undefined, { numeric: true });

	compareByPosition(a: DocumentSymbolItem, b: DocumentSymbolItem): number {
		if (a instanceof OutlineGroup && b instanceof OutlineGroup) {
			return a.order - b.order;
		} else if (a instanceof OutlineElement && b instanceof OutlineElement) {
			return Range.compareRangesUsingStarts(a.symbol.range, b.symbol.range) || this._collator.value.compare(a.symbol.name, b.symbol.name);
		}
		return 0;
	}
	compareByType(a: DocumentSymbolItem, b: DocumentSymbolItem): number {
		if (a instanceof OutlineGroup && b instanceof OutlineGroup) {
			return a.order - b.order;
		} else if (a instanceof OutlineElement && b instanceof OutlineElement) {
			return a.symbol.kind - b.symbol.kind || this._collator.value.compare(a.symbol.name, b.symbol.name);
		}
		return 0;
	}
	compareByName(a: DocumentSymbolItem, b: DocumentSymbolItem): number {
		if (a instanceof OutlineGroup && b instanceof OutlineGroup) {
			return a.order - b.order;
		} else if (a instanceof OutlineElement && b instanceof OutlineElement) {
			return this._collator.value.compare(a.symbol.name, b.symbol.name) || Range.compareRangesUsingStarts(a.symbol.range, b.symbol.range);
		}
		return 0;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/quickaccess/gotoLineQuickAccess.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/quickaccess/gotoLineQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../../base/common/event.js';
import { localize, localize2 } from '../../../../../nls.js';
import { IKeyMods, IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IRange } from '../../../../../editor/common/core/range.js';
import { AbstractGotoLineQuickAccessProvider } from '../../../../../editor/contrib/quickAccess/browser/gotoLineQuickAccess.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { IQuickAccessRegistry, Extensions as QuickAccessExtensions } from '../../../../../platform/quickinput/common/quickAccess.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IWorkbenchEditorConfiguration } from '../../../../common/editor.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { KeyMod, KeyCode } from '../../../../../base/common/keyCodes.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IQuickAccessTextEditorContext } from '../../../../../editor/contrib/quickAccess/browser/editorNavigationQuickAccess.js';
import { ITextEditorOptions } from '../../../../../platform/editor/common/editor.js';
import { IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';

export class GotoLineQuickAccessProvider extends AbstractGotoLineQuickAccessProvider {

	protected readonly onDidActiveTextEditorControlChange: Event<void>;

	constructor(
		@IEditorService private readonly editorService: IEditorService,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IStorageService protected override readonly storageService: IStorageService
	) {
		super();
		this.onDidActiveTextEditorControlChange = this.editorService.onDidActiveEditorChange;
	}

	private get configuration() {
		const editorConfig = this.configurationService.getValue<IWorkbenchEditorConfiguration>().workbench?.editor;

		return {
			openEditorPinned: !editorConfig?.enablePreviewFromQuickOpen || !editorConfig?.enablePreview
		};
	}

	protected get activeTextEditorControl() {
		return this.editorService.activeTextEditorControl;
	}

	protected override gotoLocation(context: IQuickAccessTextEditorContext, options: { range: IRange; keyMods: IKeyMods; forceSideBySide?: boolean; preserveFocus?: boolean }): void {

		// Check for sideBySide use
		if ((options.keyMods.alt || (this.configuration.openEditorPinned && options.keyMods.ctrlCmd) || options.forceSideBySide) && this.editorService.activeEditor) {
			context.restoreViewState?.(); // since we open to the side, restore view state in this editor

			const editorOptions: ITextEditorOptions = {
				selection: options.range,
				pinned: options.keyMods.ctrlCmd || this.configuration.openEditorPinned,
				preserveFocus: options.preserveFocus
			};

			this.editorGroupService.sideGroup.openEditor(this.editorService.activeEditor, editorOptions);
		}

		// Otherwise let parent handle it
		else {
			super.gotoLocation(context, options);
		}
	}
}

class GotoLineAction extends Action2 {

	static readonly ID = 'workbench.action.gotoLine';

	constructor() {
		super({
			id: GotoLineAction.ID,
			title: localize2('gotoLine', 'Go to Line/Column...'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: null,
				primary: KeyMod.CtrlCmd | KeyCode.KeyG,
				mac: { primary: KeyMod.WinCtrl | KeyCode.KeyG }
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		accessor.get(IQuickInputService).quickAccess.show(GotoLineQuickAccessProvider.GO_TO_LINE_PREFIX);
	}
}

registerAction2(GotoLineAction);

Registry.as<IQuickAccessRegistry>(QuickAccessExtensions.Quickaccess).registerQuickAccessProvider({
	ctor: GotoLineQuickAccessProvider,
	prefix: AbstractGotoLineQuickAccessProvider.GO_TO_LINE_PREFIX,
	placeholder: localize('gotoLineQuickAccessPlaceholder', "Type the line number and optional column to go to (e.g. :42:5 for line 42, column 5). Type :: to go to a character offset (e.g. ::1024 for character 1024 from the start of the file). Use negative values to navigate backwards."),
	helpEntries: [{ description: localize('gotoLineQuickAccess', "Go to Line/Column"), commandId: GotoLineAction.ID }]
});

class GotoOffsetAction extends Action2 {

	static readonly ID = 'workbench.action.gotoOffset';

	constructor() {
		super({
			id: GotoOffsetAction.ID,
			title: localize2('gotoOffset', 'Go to Offset...'),
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		accessor.get(IQuickInputService).quickAccess.show(GotoLineQuickAccessProvider.GO_TO_OFFSET_PREFIX);
	}
}

registerAction2(GotoOffsetAction);

Registry.as<IQuickAccessRegistry>(QuickAccessExtensions.Quickaccess).registerQuickAccessProvider({
	ctor: GotoLineQuickAccessProvider,
	prefix: GotoLineQuickAccessProvider.GO_TO_OFFSET_PREFIX,
	placeholder: localize('gotoLineQuickAccessPlaceholder', "Type the line number and optional column to go to (e.g. :42:5 for line 42, column 5). Type :: to go to a character offset (e.g. ::1024 for character 1024 from the start of the file). Use negative values to navigate backwards."),
	helpEntries: [{ description: localize('gotoOffsetQuickAccess', "Go to Offset"), commandId: GotoOffsetAction.ID }]
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/quickaccess/gotoSymbolQuickAccess.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/quickaccess/gotoSymbolQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../../base/common/event.js';
import { localize, localize2 } from '../../../../../nls.js';
import { IKeyMods, IQuickPickSeparator, IQuickInputService, IQuickPick, ItemActivation } from '../../../../../platform/quickinput/common/quickInput.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IRange } from '../../../../../editor/common/core/range.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { IQuickAccessRegistry, Extensions as QuickaccessExtensions } from '../../../../../platform/quickinput/common/quickAccess.js';
import { AbstractGotoSymbolQuickAccessProvider, IGotoSymbolQuickPickItem } from '../../../../../editor/contrib/quickAccess/browser/gotoSymbolQuickAccess.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IWorkbenchEditorConfiguration } from '../../../../common/editor.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { DisposableStore, IDisposable, toDisposable, Disposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { timeout } from '../../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { registerAction2, Action2, MenuId } from '../../../../../platform/actions/common/actions.js';
import { KeyMod, KeyCode } from '../../../../../base/common/keyCodes.js';
import { prepareQuery } from '../../../../../base/common/fuzzyScorer.js';
import { SymbolKind } from '../../../../../editor/common/languages.js';
import { fuzzyScore } from '../../../../../base/common/filters.js';
import { onUnexpectedError } from '../../../../../base/common/errors.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IQuickAccessTextEditorContext } from '../../../../../editor/contrib/quickAccess/browser/editorNavigationQuickAccess.js';
import { IOutlineService, OutlineTarget } from '../../../../services/outline/browser/outline.js';
import { isCompositeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { ITextEditorOptions } from '../../../../../platform/editor/common/editor.js';
import { IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { IOutlineModelService } from '../../../../../editor/contrib/documentSymbols/browser/outlineModel.js';
import { ILanguageFeaturesService } from '../../../../../editor/common/services/languageFeatures.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { accessibilityHelpIsShown, accessibleViewIsShown } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { matchesFuzzyIconAware, parseLabelWithIcons } from '../../../../../base/common/iconLabels.js';

export class GotoSymbolQuickAccessProvider extends AbstractGotoSymbolQuickAccessProvider {

	protected readonly onDidActiveTextEditorControlChange: Event<void>;

	constructor(
		@IEditorService private readonly editorService: IEditorService,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@IOutlineService private readonly outlineService: IOutlineService,
		@IOutlineModelService outlineModelService: IOutlineModelService,
	) {
		super(languageFeaturesService, outlineModelService, {
			openSideBySideDirection: () => this.configuration.openSideBySideDirection
		});
		this.onDidActiveTextEditorControlChange = this.editorService.onDidActiveEditorChange;
	}

	//#region DocumentSymbols (text editor required)

	private get configuration() {
		const editorConfig = this.configurationService.getValue<IWorkbenchEditorConfiguration>().workbench?.editor;

		return {
			openEditorPinned: !editorConfig?.enablePreviewFromQuickOpen || !editorConfig?.enablePreview,
			openSideBySideDirection: editorConfig?.openSideBySideDirection
		};
	}

	protected get activeTextEditorControl() {

		// TODO: this distinction should go away by adopting `IOutlineService`
		// for all editors (either text based ones or not). Currently text based
		// editors are not yet using the new outline service infrastructure but the
		// "classical" document symbols approach.
		if (isCompositeEditor(this.editorService.activeEditorPane?.getControl())) {
			return undefined;
		}

		return this.editorService.activeTextEditorControl;
	}

	protected override gotoLocation(context: IQuickAccessTextEditorContext, options: { range: IRange; keyMods: IKeyMods; forceSideBySide?: boolean; preserveFocus?: boolean }): void {

		// Check for sideBySide use
		if ((options.keyMods.alt || (this.configuration.openEditorPinned && options.keyMods.ctrlCmd) || options.forceSideBySide) && this.editorService.activeEditor) {
			context.restoreViewState?.(); // since we open to the side, restore view state in this editor

			const editorOptions: ITextEditorOptions = {
				selection: options.range,
				pinned: options.keyMods.ctrlCmd || this.configuration.openEditorPinned,
				preserveFocus: options.preserveFocus
			};

			this.editorGroupService.sideGroup.openEditor(this.editorService.activeEditor, editorOptions);
		}

		// Otherwise let parent handle it
		else {
			super.gotoLocation(context, options);
		}
	}

	//#endregion

	//#region public methods to use this picker from other pickers

	private static readonly SYMBOL_PICKS_TIMEOUT = 8000;

	async getSymbolPicks(model: ITextModel, filter: string, options: { extraContainerLabel?: string }, disposables: DisposableStore, token: CancellationToken): Promise<Array<IGotoSymbolQuickPickItem | IQuickPickSeparator>> {

		// If the registry does not know the model, we wait for as long as
		// the registry knows it. This helps in cases where a language
		// registry was not activated yet for providing any symbols.
		// To not wait forever, we eventually timeout though.
		const result = await Promise.race([
			this.waitForLanguageSymbolRegistry(model, disposables),
			timeout(GotoSymbolQuickAccessProvider.SYMBOL_PICKS_TIMEOUT)
		]);

		if (!result || token.isCancellationRequested) {
			return [];
		}

		return this.doGetSymbolPicks(this.getDocumentSymbols(model, token), prepareQuery(filter), options, token, model);
	}

	//#endregion

	protected override provideWithoutTextEditor(picker: IQuickPick<IGotoSymbolQuickPickItem, { useSeparators: true }>): IDisposable {
		if (this.canPickWithOutlineService()) {
			return this.doGetOutlinePicks(picker);
		}
		return super.provideWithoutTextEditor(picker);
	}

	private canPickWithOutlineService(): boolean {
		return this.editorService.activeEditorPane ? this.outlineService.canCreateOutline(this.editorService.activeEditorPane) : false;
	}

	private doGetOutlinePicks(picker: IQuickPick<IGotoSymbolQuickPickItem, { useSeparators: true }>): IDisposable {
		const pane = this.editorService.activeEditorPane;
		if (!pane) {
			return Disposable.None;
		}
		const cts = new CancellationTokenSource();

		const disposables = new DisposableStore();
		disposables.add(toDisposable(() => cts.dispose(true)));

		picker.busy = true;

		this.outlineService.createOutline(pane, OutlineTarget.QuickPick, cts.token).then(outline => {

			if (!outline) {
				return;
			}
			if (cts.token.isCancellationRequested) {
				outline.dispose();
				return;
			}

			disposables.add(outline);

			const viewState = outline.captureViewState();
			disposables.add(toDisposable(() => {
				if (picker.selectedItems.length === 0) {
					viewState.dispose();
				}
			}));

			const entries = outline.config.quickPickDataSource.getQuickPickElements();

			const items: IGotoSymbolQuickPickItem[] = entries.map((entry, idx) => {
				return {
					kind: SymbolKind.File,
					index: idx,
					score: 0,
					label: entry.label,
					description: entry.description,
					ariaLabel: entry.ariaLabel,
					iconClasses: entry.iconClasses
				};
			});

			disposables.add(picker.onDidAccept(() => {
				picker.hide();
				const [entry] = picker.selectedItems;
				if (entry && entries[entry.index]) {
					outline.reveal(entries[entry.index].element, {}, false, false);
				}
			}));

			const updatePickerItems = () => {
				const filteredItems = items.filter(item => {
					if (picker.value === '@') {
						// default, no filtering, scoring...
						item.score = 0;
						item.highlights = undefined;
						return true;
					}

					const trimmedQuery = picker.value.substring(AbstractGotoSymbolQuickAccessProvider.PREFIX.length).trim();
					const parsedLabel = parseLabelWithIcons(item.label);
					const score = fuzzyScore(trimmedQuery, trimmedQuery.toLowerCase(), 0,
						parsedLabel.text, parsedLabel.text.toLowerCase(), 0,
						{ firstMatchCanBeWeak: true, boostFullMatch: true });

					if (!score) {
						return false;
					}

					item.score = score[1];
					item.highlights = { label: matchesFuzzyIconAware(trimmedQuery, parsedLabel) ?? undefined };
					return true;
				});

				if (filteredItems.length === 0) {
					const label = localize('empty', 'No matching entries');
					picker.items = [{ label, index: -1, kind: SymbolKind.String }];
					picker.ariaLabel = label;
				} else {
					picker.items = filteredItems;
				}
			};
			updatePickerItems();
			disposables.add(picker.onDidChangeValue(updatePickerItems));

			const previewDisposable = new MutableDisposable();
			disposables.add(previewDisposable);

			disposables.add(picker.onDidChangeActive(() => {
				const [entry] = picker.activeItems;
				if (entry && entries[entry.index]) {
					previewDisposable.value = outline.preview(entries[entry.index].element);
				} else {
					previewDisposable.clear();
				}
			}));

		}).catch(err => {
			onUnexpectedError(err);
			picker.hide();
		}).finally(() => {
			picker.busy = false;
		});

		return disposables;
	}
}

class GotoSymbolAction extends Action2 {

	static readonly ID = 'workbench.action.gotoSymbol';

	constructor() {
		super({
			id: GotoSymbolAction.ID,
			title: {
				...localize2('gotoSymbol', "Go to Symbol in Editor..."),
				mnemonicTitle: localize({ key: 'miGotoSymbolInEditor', comment: ['&& denotes a mnemonic'] }, "Go to &&Symbol in Editor..."),
			},
			f1: true,
			keybinding: {
				when: ContextKeyExpr.and(accessibleViewIsShown.negate(), accessibilityHelpIsShown.negate()),
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyO
			},
			menu: [{
				id: MenuId.MenubarGoMenu,
				group: '4_symbol_nav',
				order: 1
			}]
		});
	}

	run(accessor: ServicesAccessor) {
		accessor.get(IQuickInputService).quickAccess.show(GotoSymbolQuickAccessProvider.PREFIX, { itemActivation: ItemActivation.NONE });
	}
}

registerAction2(GotoSymbolAction);

Registry.as<IQuickAccessRegistry>(QuickaccessExtensions.Quickaccess).registerQuickAccessProvider({
	ctor: GotoSymbolQuickAccessProvider,
	prefix: AbstractGotoSymbolQuickAccessProvider.PREFIX,
	contextKey: 'inFileSymbolsPicker',
	placeholder: localize('gotoSymbolQuickAccessPlaceholder', "Type the name of a symbol to go to."),
	helpEntries: [
		{
			description: localize('gotoSymbolQuickAccess', "Go to Symbol in Editor"),
			prefix: AbstractGotoSymbolQuickAccessProvider.PREFIX,
			commandId: GotoSymbolAction.ID,
			commandCenterOrder: 40
		},
		{
			description: localize('gotoSymbolByCategoryQuickAccess', "Go to Symbol in Editor by Category"),
			prefix: AbstractGotoSymbolQuickAccessProvider.PREFIX_BY_CATEGORY
		}
	]
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/suggestEnabledInput/suggestEnabledInput.css]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/suggestEnabledInput/suggestEnabledInput.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.suggest-input-container {
	padding: 2px 6px;
	border-radius: 2px;
}

.suggest-input-container .monaco-editor-background,
.suggest-input-container .monaco-editor,
.suggest-input-container .mtk1 {
	color: inherit;
}

.suggest-input-container .suggest-input-placeholder {
	position: absolute;
	z-index: 1;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	pointer-events: none;
	margin-top: 1px;
}

.suggest-input-container .monaco-editor,
.suggest-input-container .monaco-editor .lines-content {
	background: none !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/browser/suggestEnabledInput/suggestEnabledInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/browser/suggestEnabledInput/suggestEnabledInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, Dimension, append } from '../../../../../base/browser/dom.js';
import { DEFAULT_FONT_FAMILY } from '../../../../../base/browser/fonts.js';
import { IHistoryNavigationWidget } from '../../../../../base/browser/history.js';
import { Widget } from '../../../../../base/browser/ui/widget.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { HistoryNavigator } from '../../../../../base/common/history.js';
import { KeyCode } from '../../../../../base/common/keyCodes.js';
import { mixin } from '../../../../../base/common/objects.js';
import { isMacintosh } from '../../../../../base/common/platform.js';
import { URI as uri } from '../../../../../base/common/uri.js';
import './suggestEnabledInput.css';
import { IEditorConstructionOptions } from '../../../../../editor/browser/config/editorConfiguration.js';
import { EditorExtensionsRegistry } from '../../../../../editor/browser/editorExtensions.js';
import { CodeEditorWidget } from '../../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { IEditorOptions } from '../../../../../editor/common/config/editorOptions.js';
import { EditOperation } from '../../../../../editor/common/core/editOperation.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { ensureValidWordDefinition, getWordAtText } from '../../../../../editor/common/core/wordHelper.js';
import * as languages from '../../../../../editor/common/languages.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { ILanguageFeaturesService } from '../../../../../editor/common/services/languageFeatures.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ContextMenuController } from '../../../../../editor/contrib/contextmenu/browser/contextmenu.js';
import { SnippetController2 } from '../../../../../editor/contrib/snippet/browser/snippetController2.js';
import { SuggestController } from '../../../../../editor/contrib/suggest/browser/suggestController.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IHistoryNavigationContext, registerAndCreateHistoryNavigationContext } from '../../../../../platform/history/browser/contextScopedHistoryWidget.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { ColorIdentifier, asCssVariable, asCssVariableWithDefault, inputBackground, inputBorder, inputForeground, inputPlaceholderForeground } from '../../../../../platform/theme/common/colorRegistry.js';
import { MenuPreventer } from '../menuPreventer.js';
import { SelectionClipboardContributionID } from '../selectionClipboard.js';
import { getSimpleEditorOptions, setupSimpleEditorSelectionStyling } from '../simpleEditorOptions.js';

export interface SuggestResultsProvider {
	/**
	 * Provider function for suggestion results.
	 *
	 * @param query the full text of the input.
	 */
	provideResults: (query: string) => (Partial<languages.CompletionItem> & ({ label: string }) | string)[];

	/**
	 * Trigger characters for this input. Suggestions will appear when one of these is typed,
	 * or upon `ctrl+space` triggering at a word boundary.
	 *
	 * Defaults to the empty array.
	 */
	triggerCharacters?: string[];

	/**
	 * Optional regular expression that describes what a word is
	 *
	 * Defaults to space separated words.
	 */
	wordDefinition?: RegExp;

	/**
	 * Show suggestions even if the trigger character is not present.
	 *
	 * Defaults to false.
	 */
	alwaysShowSuggestions?: boolean;

	/**
	 * Defines the sorting function used when showing results.
	 *
	 * Defaults to the identity function.
	 */
	sortKey?: (result: string) => string;
}

interface SuggestEnabledInputOptions {
	/**
	 * The text to show when no input is present.
	 *
	 * Defaults to the empty string.
	 */
	placeholderText?: string;

	/**
	 * Initial value to be shown
	 */
	value?: string;

	/**
	 * Context key tracking the focus state of this element
	 */
	focusContextKey?: IContextKey<boolean>;

	/**
	 * Place overflow widgets inside an external DOM node.
	 * Defaults to an internal DOM node.
	 */
	overflowWidgetsDomNode?: HTMLElement;

	/**
	 * Override the default styling of the input.
	 */
	styleOverrides?: ISuggestEnabledInputStyleOverrides;
}

export interface ISuggestEnabledInputStyleOverrides {
	inputBackground?: ColorIdentifier;
	inputForeground?: ColorIdentifier;
	inputBorder?: ColorIdentifier;
	inputPlaceholderForeground?: ColorIdentifier;
}

export class SuggestEnabledInput extends Widget {

	private readonly _onShouldFocusResults = new Emitter<void>();
	readonly onShouldFocusResults: Event<void> = this._onShouldFocusResults.event;

	private readonly _onInputDidChange = new Emitter<string | undefined>();
	readonly onInputDidChange: Event<string | undefined> = this._onInputDidChange.event;

	private readonly _onDidFocus = this._register(new Emitter<void>());
	readonly onDidFocus = this._onDidFocus.event;

	private readonly _onDidBlur = this._register(new Emitter<void>());
	readonly onDidBlur = this._onDidBlur.event;

	readonly inputWidget: CodeEditorWidget;
	private readonly inputModel: ITextModel;
	protected stylingContainer: HTMLDivElement;
	readonly element: HTMLElement;
	private placeholderText: HTMLDivElement;

	constructor(
		id: string,
		parent: HTMLElement,
		suggestionProvider: SuggestResultsProvider,
		ariaLabel: string,
		resourceHandle: string,
		options: SuggestEnabledInputOptions,
		@IInstantiationService defaultInstantiationService: IInstantiationService,
		@IModelService modelService: IModelService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		super();

		this.stylingContainer = append(parent, $('.suggest-input-container'));
		this.element = parent;
		this.placeholderText = append(this.stylingContainer, $('.suggest-input-placeholder', undefined, options.placeholderText || ''));

		const editorOptions: IEditorConstructionOptions = mixin(
			getSimpleEditorOptions(configurationService),
			getSuggestEnabledInputOptions(ariaLabel));
		editorOptions.overflowWidgetsDomNode = options.overflowWidgetsDomNode;

		const scopedContextKeyService = this.getScopedContextKeyService(contextKeyService);

		const instantiationService = scopedContextKeyService
			? this._register(defaultInstantiationService.createChild(new ServiceCollection([IContextKeyService, scopedContextKeyService])))
			: defaultInstantiationService;

		this.inputWidget = this._register(instantiationService.createInstance(CodeEditorWidget, this.stylingContainer,
			editorOptions,
			{
				contributions: EditorExtensionsRegistry.getSomeEditorContributions([
					SuggestController.ID,
					SnippetController2.ID,
					ContextMenuController.ID,
					MenuPreventer.ID,
					SelectionClipboardContributionID,
				]),
				isSimpleWidget: true,
			}));

		this._register(configurationService.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('editor.accessibilitySupport') ||
				e.affectsConfiguration('editor.cursorBlinking')) {
				const accessibilitySupport = configurationService.getValue<'auto' | 'off' | 'on'>('editor.accessibilitySupport');
				const cursorBlinking = configurationService.getValue<'blink' | 'smooth' | 'phase' | 'expand' | 'solid'>('editor.cursorBlinking');
				this.inputWidget.updateOptions({
					accessibilitySupport,
					cursorBlinking
				});
			}
		}));

		this._register(this.inputWidget.onDidFocusEditorText(() => this._onDidFocus.fire()));
		this._register(this.inputWidget.onDidBlurEditorText(() => this._onDidBlur.fire()));

		const scopeHandle = uri.parse(resourceHandle);
		this.inputModel = modelService.createModel('', null, scopeHandle, true);
		this._register(this.inputModel);
		this.inputWidget.setModel(this.inputModel);

		this._register(this.inputWidget.onDidPaste(() => this.setValue(this.getValue()))); // setter cleanses

		this._register((this.inputWidget.onDidFocusEditorText(() => {
			if (options.focusContextKey) { options.focusContextKey.set(true); }
			this.stylingContainer.classList.add('synthetic-focus');
		})));
		this._register((this.inputWidget.onDidBlurEditorText(() => {
			if (options.focusContextKey) { options.focusContextKey.set(false); }
			this.stylingContainer.classList.remove('synthetic-focus');
		})));

		this._register(Event.chain(this.inputWidget.onKeyDown, $ => $.filter(e => e.keyCode === KeyCode.Enter))(e => { e.preventDefault(); /** Do nothing. Enter causes new line which is not expected. */ }, this));
		this._register(Event.chain(this.inputWidget.onKeyDown, $ => $.filter(e => e.keyCode === KeyCode.DownArrow && (isMacintosh ? e.metaKey : e.ctrlKey)))(() => this._onShouldFocusResults.fire(), this));

		let preexistingContent = this.getValue();
		const inputWidgetModel = this.inputWidget.getModel();
		if (inputWidgetModel) {
			this._register(inputWidgetModel.onDidChangeContent(() => {
				const content = this.getValue();
				this.placeholderText.style.visibility = content ? 'hidden' : 'visible';
				if (preexistingContent.trim() === content.trim()) { return; }
				this._onInputDidChange.fire(undefined);
				preexistingContent = content;
			}));
		}

		const validatedSuggestProvider = {
			provideResults: suggestionProvider.provideResults,
			sortKey: suggestionProvider.sortKey || (a => a),
			triggerCharacters: suggestionProvider.triggerCharacters || [],
			wordDefinition: suggestionProvider.wordDefinition ? ensureValidWordDefinition(suggestionProvider.wordDefinition) : undefined,
			alwaysShowSuggestions: !!suggestionProvider.alwaysShowSuggestions,
		};

		this.setValue(options.value || '');

		this._register(languageFeaturesService.completionProvider.register({ scheme: scopeHandle.scheme, pattern: '**/' + scopeHandle.path, hasAccessToAllModels: true }, {
			_debugDisplayName: `suggestEnabledInput/${id}`,
			triggerCharacters: validatedSuggestProvider.triggerCharacters,
			provideCompletionItems: (model: ITextModel, position: Position, _context: languages.CompletionContext) => {
				const query = model.getValue();

				const zeroIndexedColumn = position.column - 1;
				let alreadyTypedCount = 0, zeroIndexedWordStart = 0;

				if (validatedSuggestProvider.wordDefinition) {
					const wordAtText = getWordAtText(position.column, validatedSuggestProvider.wordDefinition, query, 0);
					alreadyTypedCount = wordAtText?.word.length ?? 0;
					zeroIndexedWordStart = wordAtText ? wordAtText.startColumn - 1 : 0;
				} else {
					zeroIndexedWordStart = query.lastIndexOf(' ', zeroIndexedColumn - 1) + 1;
					alreadyTypedCount = zeroIndexedColumn - zeroIndexedWordStart;
				}

				// dont show suggestions if the user has typed something, but hasn't used the trigger character
				if (!validatedSuggestProvider.alwaysShowSuggestions && alreadyTypedCount > 0 && validatedSuggestProvider.triggerCharacters?.indexOf(query[zeroIndexedWordStart]) === -1) {
					return { suggestions: [] };
				}

				return {
					suggestions: suggestionProvider.provideResults(query).map((result): languages.CompletionItem => {
						let label: string;
						let rest: Partial<languages.CompletionItem> | undefined;
						if (typeof result === 'string') {
							label = result;
						} else {
							label = result.label;
							rest = result;
						}

						return {
							label,
							insertText: label,
							range: Range.fromPositions(position.delta(0, -alreadyTypedCount), position),
							sortText: validatedSuggestProvider.sortKey(label),
							kind: languages.CompletionItemKind.Keyword,
							...rest
						};
					})
				};
			}
		}));

		this.style(options.styleOverrides || {});
	}

	protected getScopedContextKeyService(_contextKeyService: IContextKeyService): IContextKeyService | undefined {
		return undefined;
	}

	public updateAriaLabel(label: string): void {
		this.inputWidget.updateOptions({ ariaLabel: label });
	}

	public setValue(val: string) {
		val = val.replace(/\s/g, ' ');
		const fullRange = this.inputModel.getFullModelRange();
		this.inputWidget.executeEdits('suggestEnabledInput.setValue', [EditOperation.replace(fullRange, val)]);
		this.inputWidget.setScrollTop(0);
		this.inputWidget.setPosition(new Position(1, val.length + 1));
	}

	public getValue(): string {
		return this.inputWidget.getValue();
	}

	private style(styleOverrides: ISuggestEnabledInputStyleOverrides): void {
		this.stylingContainer.style.backgroundColor = asCssVariable(styleOverrides.inputBackground ?? inputBackground);
		this.stylingContainer.style.color = asCssVariable(styleOverrides.inputForeground ?? inputForeground);
		this.placeholderText.style.color = asCssVariable(styleOverrides.inputPlaceholderForeground ?? inputPlaceholderForeground);
		this.stylingContainer.style.borderWidth = '1px';
		this.stylingContainer.style.borderStyle = 'solid';
		this.stylingContainer.style.borderColor = asCssVariableWithDefault(styleOverrides.inputBorder ?? inputBorder, 'transparent');

		// eslint-disable-next-line no-restricted-syntax
		const cursor = this.stylingContainer.getElementsByClassName('cursor')[0] as HTMLDivElement;
		if (cursor) {
			cursor.style.backgroundColor = asCssVariable(styleOverrides.inputForeground ?? inputForeground);
		}
	}

	public focus(selectAll?: boolean): void {
		this.inputWidget.focus();

		if (selectAll && this.inputWidget.getValue()) {
			this.selectAll();
		}
	}

	public onHide(): void {
		this.inputWidget.onHide();
	}

	public layout(dimension: Dimension): void {
		this.inputWidget.layout(dimension);
		this.placeholderText.style.width = `${dimension.width - 2}px`;
	}

	private selectAll(): void {
		this.inputWidget.setSelection(new Range(1, 1, 1, this.getValue().length + 1));
	}
}

export interface ISuggestEnabledHistoryOptions {
	id: string;
	ariaLabel: string;
	parent: HTMLElement;
	suggestionProvider: SuggestResultsProvider;
	resourceHandle: string;
	suggestOptions: SuggestEnabledInputOptions;
	history: string[];
}

export class SuggestEnabledInputWithHistory extends SuggestEnabledInput implements IHistoryNavigationWidget {
	protected readonly history: HistoryNavigator<string>;

	constructor(
		{ id, parent, ariaLabel, suggestionProvider, resourceHandle, suggestOptions, history }: ISuggestEnabledHistoryOptions,
		@IInstantiationService instantiationService: IInstantiationService,
		@IModelService modelService: IModelService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		super(id, parent, suggestionProvider, ariaLabel, resourceHandle, suggestOptions, instantiationService, modelService, contextKeyService, languageFeaturesService, configurationService);
		this.history = this._register(new HistoryNavigator<string>(new Set(history), 100));
	}

	public addToHistory(): void {
		const value = this.getValue();
		if (value && value !== this.getCurrentValue()) {
			this.history.add(value);
		}
	}

	public getHistory(): string[] {
		return this.history.getHistory();
	}

	public showNextValue(): void {
		if (!this.history.has(this.getValue())) {
			this.addToHistory();
		}

		let next = this.getNextValue();
		if (next) {
			next = next === this.getValue() ? this.getNextValue() : next;
		}

		this.setValue(next ?? '');
	}

	public showPreviousValue(): void {
		if (!this.history.has(this.getValue())) {
			this.addToHistory();
		}

		let previous = this.getPreviousValue();
		if (previous) {
			previous = previous === this.getValue() ? this.getPreviousValue() : previous;
		}

		if (previous) {
			this.setValue(previous);
			this.inputWidget.setPosition({ lineNumber: 0, column: 0 });
		}
	}

	public clearHistory(): void {
		this.history.clear();
	}

	private getCurrentValue(): string | null {
		let currentValue = this.history.current();
		if (!currentValue) {
			currentValue = this.history.last();
			this.history.next();
		}
		return currentValue;
	}

	private getPreviousValue(): string | null {
		return this.history.previous() || this.history.first();
	}

	private getNextValue(): string | null {
		return this.history.next();
	}
}

export class ContextScopedSuggestEnabledInputWithHistory extends SuggestEnabledInputWithHistory {
	private historyContext!: IHistoryNavigationContext;

	constructor(
		options: ISuggestEnabledHistoryOptions,
		@IInstantiationService instantiationService: IInstantiationService,
		@IModelService modelService: IModelService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		super(options, instantiationService, modelService, contextKeyService, languageFeaturesService, configurationService);

		const { historyNavigationBackwardsEnablement, historyNavigationForwardsEnablement } = this.historyContext;
		this._register(this.inputWidget.onDidChangeCursorPosition(({ position }) => {
			const viewModel = this.inputWidget._getViewModel()!;
			const lastLineNumber = viewModel.getLineCount();
			const lastLineCol = viewModel.getLineLength(lastLineNumber) + 1;
			const viewPosition = viewModel.coordinatesConverter.convertModelPositionToViewPosition(position);
			historyNavigationBackwardsEnablement.set(viewPosition.lineNumber === 1 && viewPosition.column === 1);
			historyNavigationForwardsEnablement.set(viewPosition.lineNumber === lastLineNumber && viewPosition.column === lastLineCol);
		}));
	}

	protected override getScopedContextKeyService(contextKeyService: IContextKeyService) {
		const scopedContextKeyService = this._register(contextKeyService.createScoped(this.element));
		this.historyContext = this._register(registerAndCreateHistoryNavigationContext(
			scopedContextKeyService,
			this,
		));

		return scopedContextKeyService;
	}
}

setupSimpleEditorSelectionStyling('.suggest-input-container');

function getSuggestEnabledInputOptions(ariaLabel?: string): IEditorOptions {
	return {
		fontSize: 13,
		lineHeight: 20,
		wordWrap: 'off',
		scrollbar: { vertical: 'hidden', },
		roundedSelection: false,
		guides: {
			indentation: false
		},
		cursorWidth: 1,
		fontFamily: DEFAULT_FONT_FAMILY,
		ariaLabel: ariaLabel || '',
		snippetSuggestions: 'none',
		suggest: { filterGraceful: false, showIcons: false },
		autoClosingBrackets: 'never'
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/common/languageConfigurationExtensionPoint.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/common/languageConfigurationExtensionPoint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { ParseError, parse, getNodeType } from '../../../../base/common/json.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import * as types from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { CharacterPair, CommentRule, EnterAction, ExplicitLanguageConfiguration, FoldingMarkers, FoldingRules, IAutoClosingPair, IAutoClosingPairConditional, IndentAction, IndentationRule, OnEnterRule } from '../../../../editor/common/languages/languageConfiguration.js';
import { ILanguageConfigurationService } from '../../../../editor/common/languages/languageConfigurationRegistry.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { Extensions, IJSONContributionRegistry } from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { getParseErrorMessage } from '../../../../base/common/jsonErrorMessages.js';
import { IExtensionResourceLoaderService } from '../../../../platform/extensionResourceLoader/common/extensionResourceLoader.js';
import { hash } from '../../../../base/common/hash.js';
import { Disposable } from '../../../../base/common/lifecycle.js';

interface IRegExp {
	pattern: string;
	flags?: string;
}

interface IIndentationRules {
	decreaseIndentPattern: string | IRegExp;
	increaseIndentPattern: string | IRegExp;
	indentNextLinePattern?: string | IRegExp;
	unIndentedLinePattern?: string | IRegExp;
}

interface IEnterAction {
	indent: 'none' | 'indent' | 'indentOutdent' | 'outdent';
	appendText?: string;
	removeText?: number;
}

interface IOnEnterRule {
	beforeText: string | IRegExp;
	afterText?: string | IRegExp;
	previousLineText?: string | IRegExp;
	action: IEnterAction;
}

/**
 * Serialized form of a language configuration
 */
export interface ILanguageConfiguration {
	comments?: CommentRule;
	brackets?: CharacterPair[];
	autoClosingPairs?: Array<CharacterPair | IAutoClosingPairConditional>;
	surroundingPairs?: Array<CharacterPair | IAutoClosingPair>;
	colorizedBracketPairs?: Array<CharacterPair>;
	wordPattern?: string | IRegExp;
	indentationRules?: IIndentationRules;
	folding?: {
		offSide?: boolean;
		markers?: {
			start?: string | IRegExp;
			end?: string | IRegExp;
		};
	};
	autoCloseBefore?: string;
	onEnterRules?: IOnEnterRule[];
}

function isStringArr(something: string[] | null): something is string[] {
	if (!Array.isArray(something)) {
		return false;
	}
	for (let i = 0, len = something.length; i < len; i++) {
		if (typeof something[i] !== 'string') {
			return false;
		}
	}
	return true;

}

function isCharacterPair(something: CharacterPair | null): boolean {
	return (
		isStringArr(something)
		&& something.length === 2
	);
}

export class LanguageConfigurationFileHandler extends Disposable {

	/**
	 * A map from language id to a hash computed from the config files locations.
	 */
	private readonly _done = new Map<string, number>();

	constructor(
		@ILanguageService private readonly _languageService: ILanguageService,
		@IExtensionResourceLoaderService private readonly _extensionResourceLoaderService: IExtensionResourceLoaderService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@ILanguageConfigurationService private readonly _languageConfigurationService: ILanguageConfigurationService,
	) {
		super();

		this._register(this._languageService.onDidRequestBasicLanguageFeatures(async (languageIdentifier) => {
			// Modes can be instantiated before the extension points have finished registering
			this._extensionService.whenInstalledExtensionsRegistered().then(() => {
				this._loadConfigurationsForMode(languageIdentifier);
			});
		}));
		this._register(this._languageService.onDidChange(() => {
			// reload language configurations as necessary
			for (const [languageId] of this._done) {
				this._loadConfigurationsForMode(languageId);
			}
		}));
	}

	private async _loadConfigurationsForMode(languageId: string): Promise<void> {
		const configurationFiles = this._languageService.getConfigurationFiles(languageId);
		const configurationHash = hash(configurationFiles.map(uri => uri.toString()));

		if (this._done.get(languageId) === configurationHash) {
			return;
		}
		this._done.set(languageId, configurationHash);

		const configs = await Promise.all(configurationFiles.map(configFile => this._readConfigFile(configFile)));
		for (const config of configs) {
			this._handleConfig(languageId, config);
		}
	}

	private async _readConfigFile(configFileLocation: URI): Promise<ILanguageConfiguration> {
		try {
			const contents = await this._extensionResourceLoaderService.readExtensionResource(configFileLocation);
			const errors: ParseError[] = [];
			let configuration = <ILanguageConfiguration>parse(contents, errors);
			if (errors.length) {
				console.error(nls.localize('parseErrors', "Errors parsing {0}: {1}", configFileLocation.toString(), errors.map(e => (`[${e.offset}, ${e.length}] ${getParseErrorMessage(e.error)}`)).join('\n')));
			}
			if (getNodeType(configuration) !== 'object') {
				console.error(nls.localize('formatError', "{0}: Invalid format, JSON object expected.", configFileLocation.toString()));
				configuration = {};
			}
			return configuration;
		} catch (err) {
			console.error(err);
			return {};
		}
	}

	private static _extractValidCommentRule(languageId: string, configuration: ILanguageConfiguration): CommentRule | undefined {
		const source = configuration.comments;
		if (typeof source === 'undefined') {
			return undefined;
		}
		if (!types.isObject(source)) {
			console.warn(`[${languageId}]: language configuration: expected \`comments\` to be an object.`);
			return undefined;
		}

		let result: CommentRule | undefined = undefined;
		if (typeof source.lineComment !== 'undefined') {
			if (typeof source.lineComment === 'string') {
				result = result || {};
				result.lineComment = source.lineComment;
			} else if (types.isObject(source.lineComment)) {
				const lineCommentObj = source.lineComment;
				if (typeof lineCommentObj.comment === 'string') {
					result = result || {};
					result.lineComment = {
						comment: lineCommentObj.comment,
						noIndent: lineCommentObj.noIndent
					};
				} else {
					console.warn(`[${languageId}]: language configuration: expected \`comments.lineComment.comment\` to be a string.`);
				}
			} else {
				console.warn(`[${languageId}]: language configuration: expected \`comments.lineComment\` to be a string or an object with comment property.`);
			}
		}
		if (typeof source.blockComment !== 'undefined') {
			if (!isCharacterPair(source.blockComment)) {
				console.warn(`[${languageId}]: language configuration: expected \`comments.blockComment\` to be an array of two strings.`);
			} else {
				result = result || {};
				result.blockComment = source.blockComment;
			}
		}
		return result;
	}

	private static _extractValidBrackets(languageId: string, configuration: ILanguageConfiguration): CharacterPair[] | undefined {
		const source = configuration.brackets;
		if (typeof source === 'undefined') {
			return undefined;
		}
		if (!Array.isArray(source)) {
			console.warn(`[${languageId}]: language configuration: expected \`brackets\` to be an array.`);
			return undefined;
		}

		let result: CharacterPair[] | undefined = undefined;
		for (let i = 0, len = source.length; i < len; i++) {
			const pair = source[i];
			if (!isCharacterPair(pair)) {
				console.warn(`[${languageId}]: language configuration: expected \`brackets[${i}]\` to be an array of two strings.`);
				continue;
			}

			result = result || [];
			result.push(pair);
		}
		return result;
	}

	private static _extractValidAutoClosingPairs(languageId: string, configuration: ILanguageConfiguration): IAutoClosingPairConditional[] | undefined {
		const source = configuration.autoClosingPairs;
		if (typeof source === 'undefined') {
			return undefined;
		}
		if (!Array.isArray(source)) {
			console.warn(`[${languageId}]: language configuration: expected \`autoClosingPairs\` to be an array.`);
			return undefined;
		}

		let result: IAutoClosingPairConditional[] | undefined = undefined;
		for (let i = 0, len = source.length; i < len; i++) {
			const pair = source[i];
			if (Array.isArray(pair)) {
				if (!isCharacterPair(pair)) {
					console.warn(`[${languageId}]: language configuration: expected \`autoClosingPairs[${i}]\` to be an array of two strings or an object.`);
					continue;
				}
				result = result || [];
				result.push({ open: pair[0], close: pair[1] });
			} else {
				if (!types.isObject(pair)) {
					console.warn(`[${languageId}]: language configuration: expected \`autoClosingPairs[${i}]\` to be an array of two strings or an object.`);
					continue;
				}
				if (typeof pair.open !== 'string') {
					console.warn(`[${languageId}]: language configuration: expected \`autoClosingPairs[${i}].open\` to be a string.`);
					continue;
				}
				if (typeof pair.close !== 'string') {
					console.warn(`[${languageId}]: language configuration: expected \`autoClosingPairs[${i}].close\` to be a string.`);
					continue;
				}
				if (typeof pair.notIn !== 'undefined') {
					if (!isStringArr(pair.notIn)) {
						console.warn(`[${languageId}]: language configuration: expected \`autoClosingPairs[${i}].notIn\` to be a string array.`);
						continue;
					}
				}
				result = result || [];
				result.push({ open: pair.open, close: pair.close, notIn: pair.notIn });
			}
		}
		return result;
	}

	private static _extractValidSurroundingPairs(languageId: string, configuration: ILanguageConfiguration): IAutoClosingPair[] | undefined {
		const source = configuration.surroundingPairs;
		if (typeof source === 'undefined') {
			return undefined;
		}
		if (!Array.isArray(source)) {
			console.warn(`[${languageId}]: language configuration: expected \`surroundingPairs\` to be an array.`);
			return undefined;
		}

		let result: IAutoClosingPair[] | undefined = undefined;
		for (let i = 0, len = source.length; i < len; i++) {
			const pair = source[i];
			if (Array.isArray(pair)) {
				if (!isCharacterPair(pair)) {
					console.warn(`[${languageId}]: language configuration: expected \`surroundingPairs[${i}]\` to be an array of two strings or an object.`);
					continue;
				}
				result = result || [];
				result.push({ open: pair[0], close: pair[1] });
			} else {
				if (!types.isObject(pair)) {
					console.warn(`[${languageId}]: language configuration: expected \`surroundingPairs[${i}]\` to be an array of two strings or an object.`);
					continue;
				}
				if (typeof pair.open !== 'string') {
					console.warn(`[${languageId}]: language configuration: expected \`surroundingPairs[${i}].open\` to be a string.`);
					continue;
				}
				if (typeof pair.close !== 'string') {
					console.warn(`[${languageId}]: language configuration: expected \`surroundingPairs[${i}].close\` to be a string.`);
					continue;
				}
				result = result || [];
				result.push({ open: pair.open, close: pair.close });
			}
		}
		return result;
	}

	private static _extractValidColorizedBracketPairs(languageId: string, configuration: ILanguageConfiguration): CharacterPair[] | undefined {
		const source = configuration.colorizedBracketPairs;
		if (typeof source === 'undefined') {
			return undefined;
		}
		if (!Array.isArray(source)) {
			console.warn(`[${languageId}]: language configuration: expected \`colorizedBracketPairs\` to be an array.`);
			return undefined;
		}

		const result: CharacterPair[] = [];
		for (let i = 0, len = source.length; i < len; i++) {
			const pair = source[i];
			if (!isCharacterPair(pair)) {
				console.warn(`[${languageId}]: language configuration: expected \`colorizedBracketPairs[${i}]\` to be an array of two strings.`);
				continue;
			}
			result.push([pair[0], pair[1]]);

		}
		return result;
	}

	private static _extractValidOnEnterRules(languageId: string, configuration: ILanguageConfiguration): OnEnterRule[] | undefined {
		const source = configuration.onEnterRules;
		if (typeof source === 'undefined') {
			return undefined;
		}
		if (!Array.isArray(source)) {
			console.warn(`[${languageId}]: language configuration: expected \`onEnterRules\` to be an array.`);
			return undefined;
		}

		let result: OnEnterRule[] | undefined = undefined;
		for (let i = 0, len = source.length; i < len; i++) {
			const onEnterRule = source[i];
			if (!types.isObject(onEnterRule)) {
				console.warn(`[${languageId}]: language configuration: expected \`onEnterRules[${i}]\` to be an object.`);
				continue;
			}
			if (!types.isObject(onEnterRule.action)) {
				console.warn(`[${languageId}]: language configuration: expected \`onEnterRules[${i}].action\` to be an object.`);
				continue;
			}
			let indentAction: IndentAction;
			if (onEnterRule.action.indent === 'none') {
				indentAction = IndentAction.None;
			} else if (onEnterRule.action.indent === 'indent') {
				indentAction = IndentAction.Indent;
			} else if (onEnterRule.action.indent === 'indentOutdent') {
				indentAction = IndentAction.IndentOutdent;
			} else if (onEnterRule.action.indent === 'outdent') {
				indentAction = IndentAction.Outdent;
			} else {
				console.warn(`[${languageId}]: language configuration: expected \`onEnterRules[${i}].action.indent\` to be 'none', 'indent', 'indentOutdent' or 'outdent'.`);
				continue;
			}
			const action: EnterAction = { indentAction };
			if (onEnterRule.action.appendText) {
				if (typeof onEnterRule.action.appendText === 'string') {
					action.appendText = onEnterRule.action.appendText;
				} else {
					console.warn(`[${languageId}]: language configuration: expected \`onEnterRules[${i}].action.appendText\` to be undefined or a string.`);
				}
			}
			if (onEnterRule.action.removeText) {
				if (typeof onEnterRule.action.removeText === 'number') {
					action.removeText = onEnterRule.action.removeText;
				} else {
					console.warn(`[${languageId}]: language configuration: expected \`onEnterRules[${i}].action.removeText\` to be undefined or a number.`);
				}
			}
			const beforeText = this._parseRegex(languageId, `onEnterRules[${i}].beforeText`, onEnterRule.beforeText);
			if (!beforeText) {
				continue;
			}
			const resultingOnEnterRule: OnEnterRule = { beforeText, action };
			if (onEnterRule.afterText) {
				const afterText = this._parseRegex(languageId, `onEnterRules[${i}].afterText`, onEnterRule.afterText);
				if (afterText) {
					resultingOnEnterRule.afterText = afterText;
				}
			}
			if (onEnterRule.previousLineText) {
				const previousLineText = this._parseRegex(languageId, `onEnterRules[${i}].previousLineText`, onEnterRule.previousLineText);
				if (previousLineText) {
					resultingOnEnterRule.previousLineText = previousLineText;
				}
			}
			result = result || [];
			result.push(resultingOnEnterRule);
		}

		return result;
	}

	public static extractValidConfig(languageId: string, configuration: ILanguageConfiguration): ExplicitLanguageConfiguration {

		const comments = this._extractValidCommentRule(languageId, configuration);
		const brackets = this._extractValidBrackets(languageId, configuration);
		const autoClosingPairs = this._extractValidAutoClosingPairs(languageId, configuration);
		const surroundingPairs = this._extractValidSurroundingPairs(languageId, configuration);
		const colorizedBracketPairs = this._extractValidColorizedBracketPairs(languageId, configuration);
		const autoCloseBefore = (typeof configuration.autoCloseBefore === 'string' ? configuration.autoCloseBefore : undefined);
		const wordPattern = (configuration.wordPattern ? this._parseRegex(languageId, `wordPattern`, configuration.wordPattern) : undefined);
		const indentationRules = (configuration.indentationRules ? this._mapIndentationRules(languageId, configuration.indentationRules) : undefined);
		let folding: FoldingRules | undefined = undefined;
		if (configuration.folding) {
			const rawMarkers = configuration.folding.markers;
			const startMarker = (rawMarkers && rawMarkers.start ? this._parseRegex(languageId, `folding.markers.start`, rawMarkers.start) : undefined);
			const endMarker = (rawMarkers && rawMarkers.end ? this._parseRegex(languageId, `folding.markers.end`, rawMarkers.end) : undefined);
			const markers: FoldingMarkers | undefined = (startMarker && endMarker ? { start: startMarker, end: endMarker } : undefined);
			folding = {
				offSide: configuration.folding.offSide,
				markers
			};
		}
		const onEnterRules = this._extractValidOnEnterRules(languageId, configuration);

		const richEditConfig: ExplicitLanguageConfiguration = {
			comments,
			brackets,
			wordPattern,
			indentationRules,
			onEnterRules,
			autoClosingPairs,
			surroundingPairs,
			colorizedBracketPairs,
			autoCloseBefore,
			folding,
			__electricCharacterSupport: undefined,
		};
		return richEditConfig;
	}

	private _handleConfig(languageId: string, configuration: ILanguageConfiguration): void {
		const richEditConfig = LanguageConfigurationFileHandler.extractValidConfig(languageId, configuration);
		this._languageConfigurationService.register(languageId, richEditConfig, 50);
	}

	private static _parseRegex(languageId: string, confPath: string, value: string | IRegExp): RegExp | undefined {
		if (typeof value === 'string') {
			try {
				return new RegExp(value, '');
			} catch (err) {
				console.warn(`[${languageId}]: Invalid regular expression in \`${confPath}\`: `, err);
				return undefined;
			}
		}
		if (types.isObject(value)) {
			if (typeof value.pattern !== 'string') {
				console.warn(`[${languageId}]: language configuration: expected \`${confPath}.pattern\` to be a string.`);
				return undefined;
			}
			if (typeof value.flags !== 'undefined' && typeof value.flags !== 'string') {
				console.warn(`[${languageId}]: language configuration: expected \`${confPath}.flags\` to be a string.`);
				return undefined;
			}
			try {
				return new RegExp(value.pattern, value.flags);
			} catch (err) {
				console.warn(`[${languageId}]: Invalid regular expression in \`${confPath}\`: `, err);
				return undefined;
			}
		}
		console.warn(`[${languageId}]: language configuration: expected \`${confPath}\` to be a string or an object.`);
		return undefined;
	}

	private static _mapIndentationRules(languageId: string, indentationRules: IIndentationRules): IndentationRule | undefined {
		const increaseIndentPattern = this._parseRegex(languageId, `indentationRules.increaseIndentPattern`, indentationRules.increaseIndentPattern);
		if (!increaseIndentPattern) {
			return undefined;
		}
		const decreaseIndentPattern = this._parseRegex(languageId, `indentationRules.decreaseIndentPattern`, indentationRules.decreaseIndentPattern);
		if (!decreaseIndentPattern) {
			return undefined;
		}

		const result: IndentationRule = {
			increaseIndentPattern: increaseIndentPattern,
			decreaseIndentPattern: decreaseIndentPattern
		};

		if (indentationRules.indentNextLinePattern) {
			result.indentNextLinePattern = this._parseRegex(languageId, `indentationRules.indentNextLinePattern`, indentationRules.indentNextLinePattern);
		}
		if (indentationRules.unIndentedLinePattern) {
			result.unIndentedLinePattern = this._parseRegex(languageId, `indentationRules.unIndentedLinePattern`, indentationRules.unIndentedLinePattern);
		}

		return result;
	}
}

const schemaId = 'vscode://schemas/language-configuration';
const schema: IJSONSchema = {
	allowComments: true,
	allowTrailingCommas: true,
	default: {
		comments: {
			blockComment: ['/*', '*/'],
			lineComment: '//'
		},
		brackets: [['(', ')'], ['[', ']'], ['{', '}']],
		autoClosingPairs: [['(', ')'], ['[', ']'], ['{', '}']],
		surroundingPairs: [['(', ')'], ['[', ']'], ['{', '}']]
	},
	definitions: {
		openBracket: {
			type: 'string',
			description: nls.localize('schema.openBracket', 'The opening bracket character or string sequence.')
		},
		closeBracket: {
			type: 'string',
			description: nls.localize('schema.closeBracket', 'The closing bracket character or string sequence.')
		},
		bracketPair: {
			type: 'array',
			items: [{
				$ref: '#/definitions/openBracket'
			}, {
				$ref: '#/definitions/closeBracket'
			}]
		}
	},
	properties: {
		comments: {
			default: {
				blockComment: ['/*', '*/'],
				lineComment: { comment: '//', noIndent: false }
			},
			description: nls.localize('schema.comments', 'Defines the comment symbols'),
			type: 'object',
			properties: {
				blockComment: {
					type: 'array',
					description: nls.localize('schema.blockComments', 'Defines how block comments are marked.'),
					items: [{
						type: 'string',
						description: nls.localize('schema.blockComment.begin', 'The character sequence that starts a block comment.')
					}, {
						type: 'string',
						description: nls.localize('schema.blockComment.end', 'The character sequence that ends a block comment.')
					}]
				},
				lineComment: {
					type: 'object',
					description: nls.localize('schema.lineComment.object', 'Configuration for line comments.'),
					properties: {
						comment: {
							type: 'string',
							description: nls.localize('schema.lineComment.comment', 'The character sequence that starts a line comment.')
						},
						noIndent: {
							type: 'boolean',
							description: nls.localize('schema.lineComment.noIndent', 'Whether the comment token should not be indented and placed at the first column. Defaults to false.'),
							default: false
						}
					},
					required: ['comment'],
					additionalProperties: false
				}
			}
		},
		brackets: {
			default: [['(', ')'], ['[', ']'], ['{', '}']],
			markdownDescription: nls.localize('schema.brackets', 'Defines the bracket symbols that increase or decrease the indentation. When bracket pair colorization is enabled and {0} is not defined, this also defines the bracket pairs that are colorized by their nesting level.', '\`colorizedBracketPairs\`'),
			type: 'array',
			items: {
				$ref: '#/definitions/bracketPair'
			}
		},
		colorizedBracketPairs: {
			default: [['(', ')'], ['[', ']'], ['{', '}']],
			markdownDescription: nls.localize('schema.colorizedBracketPairs', 'Defines the bracket pairs that are colorized by their nesting level if bracket pair colorization is enabled. Any brackets included here that are not included in {0} will be automatically included in {0}.', '\`brackets\`'),
			type: 'array',
			items: {
				$ref: '#/definitions/bracketPair'
			}
		},
		autoClosingPairs: {
			default: [['(', ')'], ['[', ']'], ['{', '}']],
			description: nls.localize('schema.autoClosingPairs', 'Defines the bracket pairs. When a opening bracket is entered, the closing bracket is inserted automatically.'),
			type: 'array',
			items: {
				oneOf: [{
					$ref: '#/definitions/bracketPair'
				}, {
					type: 'object',
					properties: {
						open: {
							$ref: '#/definitions/openBracket'
						},
						close: {
							$ref: '#/definitions/closeBracket'
						},
						notIn: {
							type: 'array',
							description: nls.localize('schema.autoClosingPairs.notIn', 'Defines a list of scopes where the auto pairs are disabled.'),
							items: {
								enum: ['string', 'comment']
							}
						}
					}
				}]
			}
		},
		autoCloseBefore: {
			default: ';:.,=}])> \n\t',
			description: nls.localize('schema.autoCloseBefore', 'Defines what characters must be after the cursor in order for bracket or quote autoclosing to occur when using the \'languageDefined\' autoclosing setting. This is typically the set of characters which can not start an expression.'),
			type: 'string',
		},
		surroundingPairs: {
			default: [['(', ')'], ['[', ']'], ['{', '}']],
			description: nls.localize('schema.surroundingPairs', 'Defines the bracket pairs that can be used to surround a selected string.'),
			type: 'array',
			items: {
				oneOf: [{
					$ref: '#/definitions/bracketPair'
				}, {
					type: 'object',
					properties: {
						open: {
							$ref: '#/definitions/openBracket'
						},
						close: {
							$ref: '#/definitions/closeBracket'
						}
					}
				}]
			}
		},
		wordPattern: {
			default: '',
			description: nls.localize('schema.wordPattern', 'Defines what is considered to be a word in the programming language.'),
			type: ['string', 'object'],
			properties: {
				pattern: {
					type: 'string',
					description: nls.localize('schema.wordPattern.pattern', 'The RegExp pattern used to match words.'),
					default: '',
				},
				flags: {
					type: 'string',
					description: nls.localize('schema.wordPattern.flags', 'The RegExp flags used to match words.'),
					default: 'g',
					pattern: '^([gimuy]+)$',
					patternErrorMessage: nls.localize('schema.wordPattern.flags.errorMessage', 'Must match the pattern `/^([gimuy]+)$/`.')
				}
			}
		},
		indentationRules: {
			default: {
				increaseIndentPattern: '',
				decreaseIndentPattern: ''
			},
			description: nls.localize('schema.indentationRules', 'The language\'s indentation settings.'),
			type: 'object',
			properties: {
				increaseIndentPattern: {
					type: ['string', 'object'],
					description: nls.localize('schema.indentationRules.increaseIndentPattern', 'If a line matches this pattern, then all the lines after it should be indented once (until another rule matches).'),
					properties: {
						pattern: {
							type: 'string',
							description: nls.localize('schema.indentationRules.increaseIndentPattern.pattern', 'The RegExp pattern for increaseIndentPattern.'),
							default: '',
						},
						flags: {
							type: 'string',
							description: nls.localize('schema.indentationRules.increaseIndentPattern.flags', 'The RegExp flags for increaseIndentPattern.'),
							default: '',
							pattern: '^([gimuy]+)$',
							patternErrorMessage: nls.localize('schema.indentationRules.increaseIndentPattern.errorMessage', 'Must match the pattern `/^([gimuy]+)$/`.')
						}
					}
				},
				decreaseIndentPattern: {
					type: ['string', 'object'],
					description: nls.localize('schema.indentationRules.decreaseIndentPattern', 'If a line matches this pattern, then all the lines after it should be unindented once (until another rule matches).'),
					properties: {
						pattern: {
							type: 'string',
							description: nls.localize('schema.indentationRules.decreaseIndentPattern.pattern', 'The RegExp pattern for decreaseIndentPattern.'),
							default: '',
						},
						flags: {
							type: 'string',
							description: nls.localize('schema.indentationRules.decreaseIndentPattern.flags', 'The RegExp flags for decreaseIndentPattern.'),
							default: '',
							pattern: '^([gimuy]+)$',
							patternErrorMessage: nls.localize('schema.indentationRules.decreaseIndentPattern.errorMessage', 'Must match the pattern `/^([gimuy]+)$/`.')
						}
					}
				},
				indentNextLinePattern: {
					type: ['string', 'object'],
					description: nls.localize('schema.indentationRules.indentNextLinePattern', 'If a line matches this pattern, then **only the next line** after it should be indented once.'),
					properties: {
						pattern: {
							type: 'string',
							description: nls.localize('schema.indentationRules.indentNextLinePattern.pattern', 'The RegExp pattern for indentNextLinePattern.'),
							default: '',
						},
						flags: {
							type: 'string',
							description: nls.localize('schema.indentationRules.indentNextLinePattern.flags', 'The RegExp flags for indentNextLinePattern.'),
							default: '',
							pattern: '^([gimuy]+)$',
							patternErrorMessage: nls.localize('schema.indentationRules.indentNextLinePattern.errorMessage', 'Must match the pattern `/^([gimuy]+)$/`.')
						}
					}
				},
				unIndentedLinePattern: {
					type: ['string', 'object'],
					description: nls.localize('schema.indentationRules.unIndentedLinePattern', 'If a line matches this pattern, then its indentation should not be changed and it should not be evaluated against the other rules.'),
					properties: {
						pattern: {
							type: 'string',
							description: nls.localize('schema.indentationRules.unIndentedLinePattern.pattern', 'The RegExp pattern for unIndentedLinePattern.'),
							default: '',
						},
						flags: {
							type: 'string',
							description: nls.localize('schema.indentationRules.unIndentedLinePattern.flags', 'The RegExp flags for unIndentedLinePattern.'),
							default: '',
							pattern: '^([gimuy]+)$',
							patternErrorMessage: nls.localize('schema.indentationRules.unIndentedLinePattern.errorMessage', 'Must match the pattern `/^([gimuy]+)$/`.')
						}
					}
				}
			}
		},
		folding: {
			type: 'object',
			description: nls.localize('schema.folding', 'The language\'s folding settings.'),
			properties: {
				offSide: {
					type: 'boolean',
					description: nls.localize('schema.folding.offSide', 'A language adheres to the off-side rule if blocks in that language are expressed by their indentation. If set, empty lines belong to the subsequent block.'),
				},
				markers: {
					type: 'object',
					description: nls.localize('schema.folding.markers', 'Language specific folding markers such as \'#region\' and \'#endregion\'. The start and end regexes will be tested against the contents of all lines and must be designed efficiently'),
					properties: {
						start: {
							type: 'string',
							description: nls.localize('schema.folding.markers.start', 'The RegExp pattern for the start marker. The regexp must start with \'^\'.')
						},
						end: {
							type: 'string',
							description: nls.localize('schema.folding.markers.end', 'The RegExp pattern for the end marker. The regexp must start with \'^\'.')
						},
					}
				}
			}
		},
		onEnterRules: {
			type: 'array',
			description: nls.localize('schema.onEnterRules', 'The language\'s rules to be evaluated when pressing Enter.'),
			items: {
				type: 'object',
				description: nls.localize('schema.onEnterRules', 'The language\'s rules to be evaluated when pressing Enter.'),
				required: ['beforeText', 'action'],
				properties: {
					beforeText: {
						type: ['string', 'object'],
						description: nls.localize('schema.onEnterRules.beforeText', 'This rule will only execute if the text before the cursor matches this regular expression.'),
						properties: {
							pattern: {
								type: 'string',
								description: nls.localize('schema.onEnterRules.beforeText.pattern', 'The RegExp pattern for beforeText.'),
								default: '',
							},
							flags: {
								type: 'string',
								description: nls.localize('schema.onEnterRules.beforeText.flags', 'The RegExp flags for beforeText.'),
								default: '',
								pattern: '^([gimuy]+)$',
								patternErrorMessage: nls.localize('schema.onEnterRules.beforeText.errorMessage', 'Must match the pattern `/^([gimuy]+)$/`.')
							}
						}
					},
					afterText: {
						type: ['string', 'object'],
						description: nls.localize('schema.onEnterRules.afterText', 'This rule will only execute if the text after the cursor matches this regular expression.'),
						properties: {
							pattern: {
								type: 'string',
								description: nls.localize('schema.onEnterRules.afterText.pattern', 'The RegExp pattern for afterText.'),
								default: '',
							},
							flags: {
								type: 'string',
								description: nls.localize('schema.onEnterRules.afterText.flags', 'The RegExp flags for afterText.'),
								default: '',
								pattern: '^([gimuy]+)$',
								patternErrorMessage: nls.localize('schema.onEnterRules.afterText.errorMessage', 'Must match the pattern `/^([gimuy]+)$/`.')
							}
						}
					},
					previousLineText: {
						type: ['string', 'object'],
						description: nls.localize('schema.onEnterRules.previousLineText', 'This rule will only execute if the text above the line matches this regular expression.'),
						properties: {
							pattern: {
								type: 'string',
								description: nls.localize('schema.onEnterRules.previousLineText.pattern', 'The RegExp pattern for previousLineText.'),
								default: '',
							},
							flags: {
								type: 'string',
								description: nls.localize('schema.onEnterRules.previousLineText.flags', 'The RegExp flags for previousLineText.'),
								default: '',
								pattern: '^([gimuy]+)$',
								patternErrorMessage: nls.localize('schema.onEnterRules.previousLineText.errorMessage', 'Must match the pattern `/^([gimuy]+)$/`.')
							}
						}
					},
					action: {
						type: ['string', 'object'],
						description: nls.localize('schema.onEnterRules.action', 'The action to execute.'),
						required: ['indent'],
						default: { 'indent': 'indent' },
						properties: {
							indent: {
								type: 'string',
								description: nls.localize('schema.onEnterRules.action.indent', "Describe what to do with the indentation"),
								default: 'indent',
								enum: ['none', 'indent', 'indentOutdent', 'outdent'],
								markdownEnumDescriptions: [
									nls.localize('schema.onEnterRules.action.indent.none', "Insert new line and copy the previous line's indentation."),
									nls.localize('schema.onEnterRules.action.indent.indent', "Insert new line and indent once (relative to the previous line's indentation)."),
									nls.localize('schema.onEnterRules.action.indent.indentOutdent', "Insert two new lines:\n - the first one indented which will hold the cursor\n - the second one at the same indentation level"),
									nls.localize('schema.onEnterRules.action.indent.outdent', "Insert new line and outdent once (relative to the previous line's indentation).")
								]
							},
							appendText: {
								type: 'string',
								description: nls.localize('schema.onEnterRules.action.appendText', 'Describes text to be appended after the new line and after the indentation.'),
								default: '',
							},
							removeText: {
								type: 'number',
								description: nls.localize('schema.onEnterRules.action.removeText', 'Describes the number of characters to remove from the new line\'s indentation.'),
								default: 0,
							}
						}
					}
				}
			}
		}

	}
};
const schemaRegistry = Registry.as<IJSONContributionRegistry>(Extensions.JSONContribution);
schemaRegistry.registerSchema(schemaId, schema);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/electron-browser/codeEditor.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/electron-browser/codeEditor.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './displayChangeRemeasureFonts.js';
import './inputClipboardActions.js';
import './selectionClipboard.js';
import './sleepResumeRepaintMinimap.js';
import './startDebugTextMate.js';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/electron-browser/displayChangeRemeasureFonts.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/electron-browser/displayChangeRemeasureFonts.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ThrottledDelayer } from '../../../../base/common/async.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { FontMeasurements } from '../../../../editor/browser/config/fontMeasurements.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContribution, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';

class DisplayChangeRemeasureFonts extends Disposable implements IWorkbenchContribution {

	private readonly _delayer = this._register(new ThrottledDelayer(2000));

	constructor(
		@INativeHostService nativeHostService: INativeHostService
	) {
		super();

		this._register(nativeHostService.onDidChangeDisplay(() => {
			this._delayer.trigger(() => {
				FontMeasurements.clearAllFontInfos();
				return Promise.resolve();
			});
		}));
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(DisplayChangeRemeasureFonts, LifecyclePhase.Eventually);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/electron-browser/inputClipboardActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/electron-browser/inputClipboardActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import * as platform from '../../../../base/common/platform.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { getActiveWindow } from '../../../../base/browser/dom.js';

if (platform.isMacintosh) {

	// On the mac, cmd+x, cmd+c and cmd+v do not result in cut / copy / paste
	// We therefore add a basic keybinding rule that invokes document.execCommand
	// This is to cover <input>s...

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: 'execCut',
		primary: KeyMod.CtrlCmd | KeyCode.KeyX,
		handler: bindExecuteCommand('cut'),
		weight: 0,
		when: undefined,
	});
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: 'execCopy',
		primary: KeyMod.CtrlCmd | KeyCode.KeyC,
		handler: bindExecuteCommand('copy'),
		weight: 0,
		when: undefined,
	});
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: 'execPaste',
		primary: KeyMod.CtrlCmd | KeyCode.KeyV,
		handler: bindExecuteCommand('paste'),
		weight: 0,
		when: undefined,
	});

	function bindExecuteCommand(command: 'cut' | 'copy' | 'paste') {
		return () => {
			getActiveWindow().document.execCommand(command);
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/electron-browser/selectionClipboard.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/electron-browser/selectionClipboard.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import * as platform from '../../../../base/common/platform.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { registerEditorContribution, EditorAction, ServicesAccessor, registerEditorAction, EditorContributionInstantiation } from '../../../../editor/browser/editorExtensions.js';
import { ConfigurationChangedEvent, EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { ICursorSelectionChangedEvent } from '../../../../editor/common/cursorEvents.js';
import { Range } from '../../../../editor/common/core/range.js';
import { IEditorContribution, Handler } from '../../../../editor/common/editorCommon.js';
import { EndOfLinePreference } from '../../../../editor/common/model.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { SelectionClipboardContributionID } from '../browser/selectionClipboard.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { Event } from '../../../../base/common/event.js';
import { addDisposableListener, onDidRegisterWindow } from '../../../../base/browser/dom.js';

export class SelectionClipboard extends Disposable implements IEditorContribution {
	private static readonly SELECTION_LENGTH_LIMIT = 65536;

	constructor(editor: ICodeEditor, @IClipboardService clipboardService: IClipboardService) {
		super();

		if (platform.isLinux) {
			let isEnabled = editor.getOption(EditorOption.selectionClipboard);

			this._register(editor.onDidChangeConfiguration((e: ConfigurationChangedEvent) => {
				if (e.hasChanged(EditorOption.selectionClipboard)) {
					isEnabled = editor.getOption(EditorOption.selectionClipboard);
				}
			}));

			const setSelectionToClipboard = this._register(new RunOnceScheduler(() => {
				if (!editor.hasModel()) {
					return;
				}
				const model = editor.getModel();
				let selections = editor.getSelections();
				selections = selections.slice(0);
				selections.sort(Range.compareRangesUsingStarts);

				let resultLength = 0;
				for (const sel of selections) {
					if (sel.isEmpty()) {
						// Only write if all cursors have selection
						return;
					}
					resultLength += model.getValueLengthInRange(sel);
				}

				if (resultLength > SelectionClipboard.SELECTION_LENGTH_LIMIT) {
					// This is a large selection!
					// => do not write it to the selection clipboard
					return;
				}

				const result: string[] = [];
				for (const sel of selections) {
					result.push(model.getValueInRange(sel, EndOfLinePreference.TextDefined));
				}

				const textToCopy = result.join(model.getEOL());
				clipboardService.writeText(textToCopy, 'selection');
			}, 100));

			this._register(editor.onDidChangeCursorSelection((e: ICursorSelectionChangedEvent) => {
				if (!isEnabled) {
					return;
				}
				if (e.source === 'restoreState') {
					// do not set selection to clipboard if this selection change
					// was caused by restoring editors...
					return;
				}
				setSelectionToClipboard.schedule();
			}));
		}
	}

	public override dispose(): void {
		super.dispose();
	}
}

class LinuxSelectionClipboardPastePreventer extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.linuxSelectionClipboardPastePreventer';

	constructor(
		@IConfigurationService configurationService: IConfigurationService
	) {
		super();

		this._register(Event.runAndSubscribe(onDidRegisterWindow, ({ window, disposables }) => {
			disposables.add(addDisposableListener(window.document, 'mouseup', e => {
				if (e.button === 1) {
					// middle button
					const config = configurationService.getValue<{ selectionClipboard: boolean }>('editor');
					if (!config.selectionClipboard) {
						// selection clipboard is disabled
						// try to stop the upcoming paste
						e.preventDefault();
					}
				}
			}));
		}, { window: mainWindow, disposables: this._store }));
	}
}

class PasteSelectionClipboardAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.selectionClipboardPaste',
			label: nls.localize2('actions.pasteSelectionClipboard', "Paste Selection Clipboard"),
			precondition: EditorContextKeys.writable
		});
	}

	public async run(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): Promise<void> {
		const clipboardService = accessor.get(IClipboardService);

		// read selection clipboard
		const text = await clipboardService.readText('selection');

		editor.trigger('keyboard', Handler.Paste, {
			text: text,
			pasteOnNewLine: false,
			multicursorText: null
		});
	}
}

registerEditorContribution(SelectionClipboardContributionID, SelectionClipboard, EditorContributionInstantiation.Eager); // eager because it needs to listen to selection change events
if (platform.isLinux) {
	registerWorkbenchContribution2(LinuxSelectionClipboardPastePreventer.ID, LinuxSelectionClipboardPastePreventer, WorkbenchPhase.BlockRestore); // eager because it listens to mouse-up events globally
	registerEditorAction(PasteSelectionClipboardAction);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/electron-browser/sleepResumeRepaintMinimap.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/electron-browser/sleepResumeRepaintMinimap.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContribution, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { Disposable } from '../../../../base/common/lifecycle.js';

class SleepResumeRepaintMinimap extends Disposable implements IWorkbenchContribution {

	constructor(
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@INativeHostService nativeHostService: INativeHostService
	) {
		super();

		this._register(nativeHostService.onDidResumeOS(() => {
			codeEditorService.listCodeEditors().forEach(editor => editor.render(true));
		}));
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(SleepResumeRepaintMinimap, LifecyclePhase.Eventually);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/electron-browser/startDebugTextMate.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/electron-browser/startDebugTextMate.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { Range } from '../../../../editor/common/core/range.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { ITextMateTokenizationService } from '../../../services/textMate/browser/textMateTokenizationFeature.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { Constants } from '../../../../base/common/uint.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { INativeWorkbenchEnvironmentService } from '../../../services/environment/electron-browser/environmentService.js';
import { ILoggerService } from '../../../../platform/log/common/log.js';
import { joinPath } from '../../../../base/common/resources.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';

class StartDebugTextMate extends Action2 {

	private static resource = URI.parse(`inmemory:///tm-log.txt`);

	constructor() {
		super({
			id: 'editor.action.startDebugTextMate',
			title: nls.localize2('startDebugTextMate', "Start TextMate Syntax Grammar Logging"),
			category: Categories.Developer,
			f1: true
		});
	}

	private _getOrCreateModel(modelService: IModelService): ITextModel {
		const model = modelService.getModel(StartDebugTextMate.resource);
		if (model) {
			return model;
		}
		return modelService.createModel('', null, StartDebugTextMate.resource);
	}

	private _append(model: ITextModel, str: string) {
		const lineCount = model.getLineCount();
		model.applyEdits([{
			range: new Range(lineCount, Constants.MAX_SAFE_SMALL_INTEGER, lineCount, Constants.MAX_SAFE_SMALL_INTEGER),
			text: str
		}]);
	}

	async run(accessor: ServicesAccessor) {
		const textMateService = accessor.get(ITextMateTokenizationService);
		const modelService = accessor.get(IModelService);
		const editorService = accessor.get(IEditorService);
		const codeEditorService = accessor.get(ICodeEditorService);
		const hostService = accessor.get(IHostService);
		const environmentService = accessor.get(INativeWorkbenchEnvironmentService);
		const loggerService = accessor.get(ILoggerService);
		const fileService = accessor.get(IFileService);

		const pathInTemp = joinPath(environmentService.tmpDir, `vcode-tm-log-${generateUuid()}.txt`);
		await fileService.createFile(pathInTemp);
		const logger = loggerService.createLogger(pathInTemp, { name: 'debug textmate' });
		const model = this._getOrCreateModel(modelService);
		const append = (str: string) => {
			this._append(model, str + '\n');
			scrollEditor();
			logger.info(str);
			logger.flush();
		};
		await hostService.openWindow([{ fileUri: pathInTemp }], { forceNewWindow: true });
		const textEditorPane = await editorService.openEditor({
			resource: model.uri,
			options: { pinned: true }
		});
		if (!textEditorPane) {
			return;
		}
		const scrollEditor = () => {
			const editors = codeEditorService.listCodeEditors();
			for (const editor of editors) {
				if (editor.hasModel()) {
					if (editor.getModel().uri.toString() === StartDebugTextMate.resource.toString()) {
						editor.revealLine(editor.getModel().getLineCount());
					}
				}
			}
		};

		append(`// Open the file you want to test to the side and watch here`);
		append(`// Output mirrored at ${pathInTemp}`);

		textMateService.startDebugMode(
			(str) => {
				this._append(model, str + '\n');
				scrollEditor();
				logger.info(str);
				logger.flush();
			},
			() => {

			}
		);
	}
}

registerAction2(StartDebugTextMate);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/test/browser/saveParticipant.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/test/browser/saveParticipant.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { FinalNewLineParticipant, TrimFinalNewLinesParticipant, TrimWhitespaceParticipant } from '../../browser/saveParticipants.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { workbenchInstantiationService, TestServiceAccessor } from '../../../../test/browser/workbenchTestServices.js';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { Selection } from '../../../../../editor/common/core/selection.js';
import { TextFileEditorModel } from '../../../../services/textfile/common/textFileEditorModel.js';
import { IResolvedTextFileEditorModel, snapshotToString } from '../../../../services/textfile/common/textfiles.js';
import { SaveReason } from '../../../../common/editor.js';
import { TextFileEditorModelManager } from '../../../../services/textfile/common/textFileEditorModelManager.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';

suite('Save Participants', function () {

	const disposables = new DisposableStore();
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);
		disposables.add(<TextFileEditorModelManager>accessor.textFileService.files);
	});

	teardown(() => {
		disposables.clear();
	});

	test('insert final new line', async function () {
		const model: IResolvedTextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/final_new_line.txt'), 'utf8', undefined) as IResolvedTextFileEditorModel);

		await model.resolve();
		const configService = new TestConfigurationService();
		configService.setUserConfiguration('files', { 'insertFinalNewline': true });
		const participant = new FinalNewLineParticipant(configService, undefined!);

		// No new line for empty lines
		let lineContent = '';
		model.textEditorModel.setValue(lineContent);
		await participant.participate(model, { reason: SaveReason.EXPLICIT });
		assert.strictEqual(snapshotToString(model.createSnapshot()!), lineContent);

		// No new line if last line already empty
		lineContent = `Hello New Line${model.textEditorModel.getEOL()}`;
		model.textEditorModel.setValue(lineContent);
		await participant.participate(model, { reason: SaveReason.EXPLICIT });
		assert.strictEqual(snapshotToString(model.createSnapshot()!), lineContent);

		// New empty line added (single line)
		lineContent = 'Hello New Line';
		model.textEditorModel.setValue(lineContent);
		await participant.participate(model, { reason: SaveReason.EXPLICIT });
		assert.strictEqual(snapshotToString(model.createSnapshot()!), `${lineContent}${model.textEditorModel.getEOL()}`);

		// New empty line added (multi line)
		lineContent = `Hello New Line${model.textEditorModel.getEOL()}Hello New Line${model.textEditorModel.getEOL()}Hello New Line`;
		model.textEditorModel.setValue(lineContent);
		await participant.participate(model, { reason: SaveReason.EXPLICIT });
		assert.strictEqual(snapshotToString(model.createSnapshot()!), `${lineContent}${model.textEditorModel.getEOL()}`);
	});

	test('trim final new lines', async function () {
		const model: IResolvedTextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/trim_final_new_line.txt'), 'utf8', undefined) as IResolvedTextFileEditorModel);

		await model.resolve();
		const configService = new TestConfigurationService();
		configService.setUserConfiguration('files', { 'trimFinalNewlines': true });
		const participant = new TrimFinalNewLinesParticipant(configService, undefined!);
		const textContent = 'Trim New Line';
		const eol = `${model.textEditorModel.getEOL()}`;

		// No new line removal if last line is not new line
		let lineContent = `${textContent}`;
		model.textEditorModel.setValue(lineContent);
		await participant.participate(model, { reason: SaveReason.EXPLICIT });
		assert.strictEqual(snapshotToString(model.createSnapshot()!), lineContent);

		// No new line removal if last line is single new line
		lineContent = `${textContent}${eol}`;
		model.textEditorModel.setValue(lineContent);
		await participant.participate(model, { reason: SaveReason.EXPLICIT });
		assert.strictEqual(snapshotToString(model.createSnapshot()!), lineContent);

		// Remove new line (single line with two new lines)
		lineContent = `${textContent}${eol}${eol}`;
		model.textEditorModel.setValue(lineContent);
		await participant.participate(model, { reason: SaveReason.EXPLICIT });
		assert.strictEqual(snapshotToString(model.createSnapshot()!), `${textContent}${eol}`);

		// Remove new lines (multiple lines with multiple new lines)
		lineContent = `${textContent}${eol}${textContent}${eol}${eol}${eol}`;
		model.textEditorModel.setValue(lineContent);
		await participant.participate(model, { reason: SaveReason.EXPLICIT });
		assert.strictEqual(snapshotToString(model.createSnapshot()!), `${textContent}${eol}${textContent}${eol}`);
	});

	test('trim final new lines bug#39750', async function () {
		const model: IResolvedTextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/trim_final_new_line.txt'), 'utf8', undefined) as IResolvedTextFileEditorModel);

		await model.resolve();
		const configService = new TestConfigurationService();
		configService.setUserConfiguration('files', { 'trimFinalNewlines': true });
		const participant = new TrimFinalNewLinesParticipant(configService, undefined!);
		const textContent = 'Trim New Line';

		// single line
		const lineContent = `${textContent}`;
		model.textEditorModel.setValue(lineContent);

		// apply edits and push to undo stack.
		const textEdits = [{ range: new Range(1, 14, 1, 14), text: '.', forceMoveMarkers: false }];
		model.textEditorModel.pushEditOperations([new Selection(1, 14, 1, 14)], textEdits, () => { return [new Selection(1, 15, 1, 15)]; });

		// undo
		await model.textEditorModel.undo();
		assert.strictEqual(snapshotToString(model.createSnapshot()!), `${textContent}`);

		// trim final new lines should not mess the undo stack
		await participant.participate(model, { reason: SaveReason.EXPLICIT });
		await model.textEditorModel.redo();
		assert.strictEqual(snapshotToString(model.createSnapshot()!), `${textContent}.`);
	});

	test('trim final new lines bug#46075', async function () {
		const model: IResolvedTextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/trim_final_new_line.txt'), 'utf8', undefined) as IResolvedTextFileEditorModel);

		await model.resolve();
		const configService = new TestConfigurationService();
		configService.setUserConfiguration('files', { 'trimFinalNewlines': true });
		const participant = new TrimFinalNewLinesParticipant(configService, undefined!);
		const textContent = 'Test';
		const eol = `${model.textEditorModel.getEOL()}`;
		const content = `${textContent}${eol}${eol}`;
		model.textEditorModel.setValue(content);

		// save many times
		for (let i = 0; i < 10; i++) {
			await participant.participate(model, { reason: SaveReason.EXPLICIT });
		}

		// confirm trimming
		assert.strictEqual(snapshotToString(model.createSnapshot()!), `${textContent}${eol}`);

		// undo should go back to previous content immediately
		await model.textEditorModel.undo();
		assert.strictEqual(snapshotToString(model.createSnapshot()!), `${textContent}${eol}${eol}`);
		await model.textEditorModel.redo();
		assert.strictEqual(snapshotToString(model.createSnapshot()!), `${textContent}${eol}`);
	});

	test('trim whitespace', async function () {
		const model: IResolvedTextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/trim_final_new_line.txt'), 'utf8', undefined) as IResolvedTextFileEditorModel);

		await model.resolve();
		const configService = new TestConfigurationService();
		configService.setUserConfiguration('files', { 'trimTrailingWhitespace': true });
		const participant = new TrimWhitespaceParticipant(configService, undefined!);
		const textContent = 'Test';
		const content = `${textContent} 	`;
		model.textEditorModel.setValue(content);

		// save many times
		for (let i = 0; i < 10; i++) {
			await participant.participate(model, { reason: SaveReason.EXPLICIT });
		}

		// confirm trimming
		assert.strictEqual(snapshotToString(model.createSnapshot()!), `${textContent}`);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/test/node/autoindent.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/test/node/autoindent.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { extname, join } from '../../../../../base/common/path.js';
import assert from 'assert';
import { DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ILanguageConfigurationService } from '../../../../../editor/common/languages/languageConfigurationRegistry.js';
import { getReindentEditOperations } from '../../../../../editor/contrib/indentation/common/indentation.js';
import { IRelaxedTextModelCreationOptions, createModelServices, instantiateTextModel } from '../../../../../editor/test/common/testTextModel.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILanguageConfiguration, LanguageConfigurationFileHandler } from '../../common/languageConfigurationExtensionPoint.js';
import { parse } from '../../../../../base/common/json.js';
import { IRange } from '../../../../../editor/common/core/range.js';
import { ISingleEditOperation } from '../../../../../editor/common/core/editOperation.js';
import { trimTrailingWhitespace } from '../../../../../editor/common/commands/trimTrailingWhitespaceCommand.js';
import { execSync } from 'child_process';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { EncodedTokenizationResult, IState, ITokenizationSupport, TokenizationRegistry } from '../../../../../editor/common/languages.js';
import { NullState } from '../../../../../editor/common/languages/nullTokenize.js';
import { MetadataConsts, StandardTokenType } from '../../../../../editor/common/encodedTokenAttributes.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { FileAccess } from '../../../../../base/common/network.js';

function getIRange(range: IRange): IRange {
	return {
		startLineNumber: range.startLineNumber,
		startColumn: range.startColumn,
		endLineNumber: range.endLineNumber,
		endColumn: range.endColumn
	};
}

const enum LanguageId {
	TypeScript = 'ts-test'
}

function forceTokenizationFromLineToLine(model: ITextModel, startLine: number, endLine: number): void {
	for (let line = startLine; line <= endLine; line++) {
		model.tokenization.forceTokenization(line);
	}
}

function registerLanguage(instantiationService: TestInstantiationService, languageId: LanguageId): IDisposable {
	const disposables = new DisposableStore();
	const languageService = instantiationService.get(ILanguageService);
	disposables.add(registerLanguageConfiguration(instantiationService, languageId));
	disposables.add(languageService.registerLanguage({ id: languageId }));
	return disposables;
}

function registerLanguageConfiguration(instantiationService: TestInstantiationService, languageId: LanguageId): IDisposable {
	const languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
	let configPath: string;
	switch (languageId) {
		case LanguageId.TypeScript:
			configPath = FileAccess.asFileUri('vs/workbench/contrib/codeEditor/test/node/language-configuration.json').fsPath;
			break;
		default:
			throw new Error('Unknown languageId');
	}
	const configContent = fs.readFileSync(configPath, { encoding: 'utf-8' });
	const parsedConfig = <ILanguageConfiguration>parse(configContent, []);
	const languageConfig = LanguageConfigurationFileHandler.extractValidConfig(languageId, parsedConfig);
	return languageConfigurationService.register(languageId, languageConfig);
}

interface StandardTokenTypeData {
	startIndex: number;
	standardTokenType: StandardTokenType;
}

function registerTokenizationSupport(instantiationService: TestInstantiationService, tokens: StandardTokenTypeData[][], languageId: LanguageId): IDisposable {
	let lineIndex = 0;
	const languageService = instantiationService.get(ILanguageService);
	const tokenizationSupport: ITokenizationSupport = {
		getInitialState: () => NullState,
		tokenize: undefined!,
		tokenizeEncoded: (line: string, hasEOL: boolean, state: IState): EncodedTokenizationResult => {
			const tokensOnLine = tokens[lineIndex++];
			const encodedLanguageId = languageService.languageIdCodec.encodeLanguageId(languageId);
			const result = new Uint32Array(2 * tokensOnLine.length);
			for (let i = 0; i < tokensOnLine.length; i++) {
				result[2 * i] = tokensOnLine[i].startIndex;
				result[2 * i + 1] =
					((encodedLanguageId << MetadataConsts.LANGUAGEID_OFFSET)
						| (tokensOnLine[i].standardTokenType << MetadataConsts.TOKEN_TYPE_OFFSET));
			}
			return new EncodedTokenizationResult(result, [], state);
		}
	};
	return TokenizationRegistry.register(languageId, tokenizationSupport);
}

suite('Auto-Reindentation - TypeScript/JavaScript', () => {

	const languageId = LanguageId.TypeScript;
	const options: IRelaxedTextModelCreationOptions = {};
	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let languageConfigurationService: ILanguageConfigurationService;

	setup(() => {
		disposables = new DisposableStore();
		instantiationService = createModelServices(disposables);
		languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
		disposables.add(instantiationService);
		disposables.add(registerLanguage(instantiationService, languageId));
		disposables.add(registerLanguageConfiguration(instantiationService, languageId));
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	// Test which can be ran to find cases of incorrect indentation...
	test.skip('Find Cases of Incorrect Indentation with the Reindent Lines Command', () => {

		// ./scripts/test.sh --inspect --grep='Find Cases of Incorrect Indentation with the Reindent Lines Command' --timeout=15000

		function walkDirectoryAndReindent(directory: string, languageId: string) {
			const files = fs.readdirSync(directory, { withFileTypes: true });
			const directoriesToRecurseOn: string[] = [];
			for (const file of files) {
				if (file.isDirectory()) {
					directoriesToRecurseOn.push(join(directory, file.name));
				} else {
					const filePathName = join(directory, file.name);
					const fileExtension = extname(filePathName);
					if (fileExtension !== '.ts') {
						continue;
					}
					const fileContents = fs.readFileSync(filePathName, { encoding: 'utf-8' });
					const modelOptions: IRelaxedTextModelCreationOptions = {
						tabSize: 4,
						insertSpaces: false
					};
					const model = disposables.add(instantiateTextModel(instantiationService, fileContents, languageId, modelOptions));
					const lineCount = model.getLineCount();
					const editOperations: ISingleEditOperation[] = [];
					for (let line = 1; line <= lineCount - 1; line++) {
						/*
						NOTE: Uncomment in order to ignore incorrect JS DOC indentation
						const lineContent = model.getLineContent(line);
						const trimmedLineContent = lineContent.trim();
						if (trimmedLineContent.length === 0 || trimmedLineContent.startsWith('*') || trimmedLineContent.startsWith('/*')) {
							continue;
						}
						*/
						const lineContent = model.getLineContent(line);
						const trimmedLineContent = lineContent.trim();
						if (trimmedLineContent.length === 0) {
							continue;
						}
						const editOperation = getReindentEditOperations(model, languageConfigurationService, line, line + 1);
						/*
						NOTE: Uncomment in order to see actual incorrect indentation diff
						model.applyEdits(editOperation);
						*/
						editOperations.push(...editOperation);
					}
					model.applyEdits(editOperations);
					model.applyEdits(trimTrailingWhitespace(model, [], true));
					fs.writeFileSync(filePathName, model.getValue());
				}
			}
			for (const directory of directoriesToRecurseOn) {
				walkDirectoryAndReindent(directory, languageId);
			}
		}

		walkDirectoryAndReindent('/Users/aiday/Desktop/Test/vscode-test', 'ts-test');
		const output = execSync('cd /Users/aiday/Desktop/Test/vscode-test && git diff --shortstat', { encoding: 'utf-8' });
		console.log('\ngit diff --shortstat:\n', output);
	});

	// Unit tests for increase and decrease indent patterns...

	/**
	 * First increase indent and decrease indent patterns:
	 *
	 * - decreaseIndentPattern: /^(.*\*\/)?\s*\}.*$/
	 *  - In (https://macromates.com/manual/en/appendix)
	 * 	  Either we have white space before the closing bracket, or we have a multi line comment ending on that line followed by whitespaces
	 *    This is followed by any character.
	 *    Textmate decrease indent pattern is as follows: /^(.*\*\/)?\s*\}[;\s]*$/
	 *    Presumably allowing multi line comments ending on that line implies that } is itself not part of a multi line comment
	 *
	 * - increaseIndentPattern: /^.*\{[^}"']*$/
	 *  - In (https://macromates.com/manual/en/appendix)
	 *    This regex means that we increase the indent when we have any characters followed by the opening brace, followed by characters
	 *    except for closing brace }, double quotes " or single quote '.
	 *    The } is checked in order to avoid the indentation in the following case `int arr[] = { 1, 2, 3 };`
	 *    The double quote and single quote are checked in order to avoid the indentation in the following case: str = "foo {";
	 */

	test('Issue #25437', () => {
		// issue: https://github.com/microsoft/vscode/issues/25437
		// fix: https://github.com/microsoft/vscode/commit/8c82a6c6158574e098561c28d470711f1b484fc8
		// explanation: var foo = `{`; should not increase indentation

		// increaseIndentPattern: /^.*\{[^}"']*$/ -> /^.*\{[^}"'`]*$/

		const fileContents = [
			'const foo = `{`;',
			'    ',
		].join('\n');
		const tokens: StandardTokenTypeData[][] = [
			[
				{ startIndex: 0, standardTokenType: StandardTokenType.Other },
				{ startIndex: 5, standardTokenType: StandardTokenType.Other },
				{ startIndex: 6, standardTokenType: StandardTokenType.Other },
				{ startIndex: 9, standardTokenType: StandardTokenType.Other },
				{ startIndex: 10, standardTokenType: StandardTokenType.Other },
				{ startIndex: 11, standardTokenType: StandardTokenType.Other },
				{ startIndex: 12, standardTokenType: StandardTokenType.String },
				{ startIndex: 13, standardTokenType: StandardTokenType.String },
				{ startIndex: 14, standardTokenType: StandardTokenType.String },
				{ startIndex: 15, standardTokenType: StandardTokenType.Other },
				{ startIndex: 16, standardTokenType: StandardTokenType.Other }
			],
			[
				{ startIndex: 0, standardTokenType: StandardTokenType.Other },
				{ startIndex: 4, standardTokenType: StandardTokenType.Other }]
		];
		disposables.add(registerTokenizationSupport(instantiationService, tokens, languageId));
		const model = disposables.add(instantiateTextModel(instantiationService, fileContents, languageId, options));
		forceTokenizationFromLineToLine(model, 1, 2);
		const editOperations = getReindentEditOperations(model, languageConfigurationService, 1, model.getLineCount());
		assert.deepStrictEqual(editOperations.length, 1);
		const operation = editOperations[0];
		assert.deepStrictEqual(getIRange(operation.range), {
			'startLineNumber': 2,
			'startColumn': 1,
			'endLineNumber': 2,
			'endColumn': 5,
		});
		assert.deepStrictEqual(operation.text, '');
	});

	test('Enriching the hover', () => {
		// issue: -
		// fix: https://github.com/microsoft/vscode/commit/19ae0932c45b1096443a8c1335cf1e02eb99e16d
		// explanation:
		//  - decrease indent on ) and ] also
		//  - increase indent on ( and [ also

		// decreaseIndentPattern: /^(.*\*\/)?\s*\}.*$/ -> /^(.*\*\/)?\s*[\}\]\)].*$/
		// increaseIndentPattern: /^.*\{[^}"'`]*$/ -> /^.*(\{[^}"'`]*|\([^)"'`]*|\[[^\]"'`]*)$/

		let fileContents = [
			'function foo(',
			'    bar: string',
			'    ){}',
		].join('\n');
		let model = disposables.add(instantiateTextModel(instantiationService, fileContents, languageId, options));
		let editOperations = getReindentEditOperations(model, languageConfigurationService, 1, model.getLineCount());
		assert.deepStrictEqual(editOperations.length, 1);
		let operation = editOperations[0];
		assert.deepStrictEqual(getIRange(operation.range), {
			'startLineNumber': 3,
			'startColumn': 1,
			'endLineNumber': 3,
			'endColumn': 5,
		});
		assert.deepStrictEqual(operation.text, '');

		fileContents = [
			'function foo(',
			'bar: string',
			'){}',
		].join('\n');
		model = disposables.add(instantiateTextModel(instantiationService, fileContents, languageId, options));
		editOperations = getReindentEditOperations(model, languageConfigurationService, 1, model.getLineCount());
		assert.deepStrictEqual(editOperations.length, 1);
		operation = editOperations[0];
		assert.deepStrictEqual(getIRange(operation.range), {
			'startLineNumber': 2,
			'startColumn': 1,
			'endLineNumber': 2,
			'endColumn': 1,
		});
		assert.deepStrictEqual(operation.text, '    ');
	});

	test('Issue #86176', () => {
		// issue: https://github.com/microsoft/vscode/issues/86176
		// fix: https://github.com/microsoft/vscode/commit/d89e2e17a5d1ba37c99b1d3929eb6180a5bfc7a8
		// explanation: When quotation marks are present on the first line of an if statement or for loop, following line should not be indented

		// increaseIndentPattern: /^((?!\/\/).)*(\{[^}"'`]*|\([^)"'`]*|\[[^\]"'`]*)$/ -> /^((?!\/\/).)*(\{([^}"'`]*|(\t|[ ])*\/\/.*)|\([^)"'`]*|\[[^\]"'`]*)$/
		// explanation: after open brace, do not decrease indent if it is followed on the same line by "<whitespace characters> // <any characters>"
		// todo@aiday-mar: should also apply for when it follows ( and [

		const fileContents = [
			`if () { // '`,
			`x = 4`,
			`}`
		].join('\n');
		const model = disposables.add(instantiateTextModel(instantiationService, fileContents, languageId, options));
		const editOperations = getReindentEditOperations(model, languageConfigurationService, 1, model.getLineCount());
		assert.deepStrictEqual(editOperations.length, 1);
		const operation = editOperations[0];
		assert.deepStrictEqual(getIRange(operation.range), {
			'startLineNumber': 2,
			'startColumn': 1,
			'endLineNumber': 2,
			'endColumn': 1,
		});
		assert.deepStrictEqual(operation.text, '    ');
	});

	test('Issue #141816', () => {

		// issue: https://github.com/microsoft/vscode/issues/141816
		// fix: https://github.com/microsoft/vscode/pull/141997/files
		// explanation: if (, [, {, is followed by a forward slash then assume we are in a regex pattern, and do not indent

		// increaseIndentPattern: /^((?!\/\/).)*(\{([^}"'`]*|(\t|[ ])*\/\/.*)|\([^)"'`]*|\[[^\]"'`]*)$/ -> /^((?!\/\/).)*(\{([^}"'`/]*|(\t|[ ])*\/\/.*)|\([^)"'`/]*|\[[^\]"'`/]*)$/
		// -> Final current increase indent pattern at of writing

		const fileContents = [
			'const r = /{/;',
			'   ',
		].join('\n');
		const tokens: StandardTokenTypeData[][] = [
			[
				{ startIndex: 0, standardTokenType: StandardTokenType.Other },
				{ startIndex: 5, standardTokenType: StandardTokenType.Other },
				{ startIndex: 6, standardTokenType: StandardTokenType.Other },
				{ startIndex: 7, standardTokenType: StandardTokenType.Other },
				{ startIndex: 8, standardTokenType: StandardTokenType.Other },
				{ startIndex: 9, standardTokenType: StandardTokenType.RegEx },
				{ startIndex: 10, standardTokenType: StandardTokenType.RegEx },
				{ startIndex: 11, standardTokenType: StandardTokenType.RegEx },
				{ startIndex: 12, standardTokenType: StandardTokenType.RegEx },
				{ startIndex: 13, standardTokenType: StandardTokenType.Other },
				{ startIndex: 14, standardTokenType: StandardTokenType.Other }
			],
			[
				{ startIndex: 0, standardTokenType: StandardTokenType.Other },
				{ startIndex: 4, standardTokenType: StandardTokenType.Other }
			]
		];
		disposables.add(registerTokenizationSupport(instantiationService, tokens, languageId));
		const model = disposables.add(instantiateTextModel(instantiationService, fileContents, languageId, options));
		forceTokenizationFromLineToLine(model, 1, 2);
		const editOperations = getReindentEditOperations(model, languageConfigurationService, 1, model.getLineCount());
		assert.deepStrictEqual(editOperations.length, 1);
		const operation = editOperations[0];
		assert.deepStrictEqual(getIRange(operation.range), {
			'startLineNumber': 2,
			'startColumn': 1,
			'endLineNumber': 2,
			'endColumn': 4,
		});
		assert.deepStrictEqual(operation.text, '');
	});

	test('Issue #29886', () => {
		// issue: https://github.com/microsoft/vscode/issues/29886
		// fix: https://github.com/microsoft/vscode/commit/7910b3d7bab8a721aae98dc05af0b5e1ea9d9782

		// decreaseIndentPattern: /^(.*\*\/)?\s*[\}\]\)].*$/ -> /^((?!.*?\/\*).*\*\/)?\s*[\}\]\)].*$/
		// -> Final current decrease indent pattern at the time of writing

		// explanation: Positive lookahead: (?= «pattern») matches if pattern matches what comes after the current location in the input string.
		// Negative lookahead: (?! «pattern») matches if pattern does not match what comes after the current location in the input string
		// The change proposed is to not decrease the indent if there is a multi-line comment ending on the same line before the closing parentheses

		const fileContents = [
			'function foo() {',
			'    bar(/*  */)',
			'};',
		].join('\n');
		const model = disposables.add(instantiateTextModel(instantiationService, fileContents, languageId, options));
		const editOperations = getReindentEditOperations(model, languageConfigurationService, 1, model.getLineCount());
		assert.deepStrictEqual(editOperations.length, 0);
	});

	test('Issue #209859: do not do reindentation for tokens inside of a string', () => {

		// issue: https://github.com/microsoft/vscode/issues/209859

		const tokens: StandardTokenTypeData[][] = [
			[
				{ startIndex: 0, standardTokenType: StandardTokenType.Other },
				{ startIndex: 12, standardTokenType: StandardTokenType.String },
			],
			[
				{ startIndex: 0, standardTokenType: StandardTokenType.String },
			],
			[
				{ startIndex: 0, standardTokenType: StandardTokenType.String },
			],
			[
				{ startIndex: 0, standardTokenType: StandardTokenType.String },
			]
		];
		disposables.add(registerTokenizationSupport(instantiationService, tokens, languageId));
		const fileContents = [
			'const foo = `some text',
			'         which is strangely',
			'    indented. It should',
			'   not be reindented.`'
		].join('\n');
		const model = disposables.add(instantiateTextModel(instantiationService, fileContents, languageId, options));
		forceTokenizationFromLineToLine(model, 1, 4);
		const editOperations = getReindentEditOperations(model, languageConfigurationService, 1, model.getLineCount());
		assert.deepStrictEqual(editOperations.length, 0);
	});

	// Failing tests inferred from the current regexes...

	test.skip('Incorrect deindentation after `*/}` string', () => {

		// explanation: If */ was not before the }, the regex does not allow characters before the }, so there would not be an indent
		// Here since there is */ before the }, the regex allows all the characters before, hence there is a deindent

		const fileContents = [
			`const obj = {`,
			`    obj1: {`,
			`        brace : '*/}'`,
			`    }`,
			`}`,
		].join('\n');
		const model = disposables.add(instantiateTextModel(instantiationService, fileContents, languageId, options));
		const editOperations = getReindentEditOperations(model, languageConfigurationService, 1, model.getLineCount());
		assert.deepStrictEqual(editOperations.length, 0);
	});

	// Failing tests from issues...

	test.skip('Issue #56275', () => {

		// issue: https://github.com/microsoft/vscode/issues/56275
		// explanation: If */ was not before the }, the regex does not allow characters before the }, so there would not be an indent
		// Here since there is */ before the }, the regex allows all the characters before, hence there is a deindent

		let fileContents = [
			'function foo() {',
			'    var bar = (/b*/);',
			'}',
		].join('\n');
		let model = disposables.add(instantiateTextModel(instantiationService, fileContents, languageId, options));
		let editOperations = getReindentEditOperations(model, languageConfigurationService, 1, model.getLineCount());
		assert.deepStrictEqual(editOperations.length, 0);

		fileContents = [
			'function foo() {',
			'    var bar = "/b*/)";',
			'}',
		].join('\n');
		model = disposables.add(instantiateTextModel(instantiationService, fileContents, languageId, options));
		editOperations = getReindentEditOperations(model, languageConfigurationService, 1, model.getLineCount());
		assert.deepStrictEqual(editOperations.length, 0);
	});

	test.skip('Issue #116843', () => {

		// issue: https://github.com/microsoft/vscode/issues/116843
		// related: https://github.com/microsoft/vscode/issues/43244
		// explanation: When you have an arrow function, you don't have { or }, but you would expect indentation to still be done in that way

		// TODO: requires exploring indent/outdent pairs instead

		const fileContents = [
			'const add1 = (n) =>',
			'	n + 1;',
		].join('\n');
		const model = disposables.add(instantiateTextModel(instantiationService, fileContents, languageId, options));
		const editOperations = getReindentEditOperations(model, languageConfigurationService, 1, model.getLineCount());
		assert.deepStrictEqual(editOperations.length, 0);
	});

	test.skip('Issue #185252', () => {

		// issue: https://github.com/microsoft/vscode/issues/185252
		// explanation: Reindenting the comment correctly

		const fileContents = [
			'/*',
			' * This is a comment.',
			' */',
		].join('\n');
		const model = disposables.add(instantiateTextModel(instantiationService, fileContents, languageId, options));
		const editOperations = getReindentEditOperations(model, languageConfigurationService, 1, model.getLineCount());
		assert.deepStrictEqual(editOperations.length, 0);
	});

	test.skip('Issue 43244: incorrect indentation when signature of function call spans several lines', () => {

		// issue: https://github.com/microsoft/vscode/issues/43244

		const fileContents = [
			'function callSomeOtherFunction(one: number, two: number) { }',
			'function someFunction() {',
			'    callSomeOtherFunction(4,',
			'        5)',
			'}',
		].join('\n');
		const model = disposables.add(instantiateTextModel(instantiationService, fileContents, languageId, options));
		const editOperations = getReindentEditOperations(model, languageConfigurationService, 1, model.getLineCount());
		assert.deepStrictEqual(editOperations.length, 0);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeEditor/test/node/language-configuration.json]---
Location: vscode-main/src/vs/workbench/contrib/codeEditor/test/node/language-configuration.json

```json
{
	// Note that this file should stay in sync with 'javascript-language-basics/javascript-language-configuration.json'
	"comments": {
		"lineComment": "//",
		"blockComment": [
			"/*",
			"*/"
		]
	},
	"brackets": [
		[
			"${",
			"}"
		],
		[
			"{",
			"}"
		],
		[
			"[",
			"]"
		],
		[
			"(",
			")"
		]
	],
	"autoClosingPairs": [
		{
			"open": "{",
			"close": "}"
		},
		{
			"open": "[",
			"close": "]"
		},
		{
			"open": "(",
			"close": ")"
		},
		{
			"open": "'",
			"close": "'",
			"notIn": [
				"string",
				"comment"
			]
		},
		{
			"open": "\"",
			"close": "\"",
			"notIn": [
				"string"
			]
		},
		{
			"open": "`",
			"close": "`",
			"notIn": [
				"string",
				"comment"
			]
		},
		{
			"open": "/**",
			"close": " */",
			"notIn": [
				"string"
			]
		}
	],
	"surroundingPairs": [
		[
			"{",
			"}"
		],
		[
			"[",
			"]"
		],
		[
			"(",
			")"
		],
		[
			"'",
			"'"
		],
		[
			"\"",
			"\""
		],
		[
			"`",
			"`"
		],
		[
			"<",
			">"
		]
	],
	"colorizedBracketPairs": [
		[
			"(",
			")"
		],
		[
			"[",
			"]"
		],
		[
			"{",
			"}"
		],
		[
			"<",
			">"
		]
	],
	"autoCloseBefore": ";:.,=}])>` \n\t",
	"folding": {
		"markers": {
			"start": "^\\s*//\\s*#?region\\b",
			"end": "^\\s*//\\s*#?endregion\\b"
		}
	},
	"wordPattern": {
		"pattern": "(-?\\d*\\.\\d\\w*)|([^\\`\\@\\~\\!\\%\\^\\&\\*\\(\\)\\-\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>/\\?\\s]+)",
	},
	"indentationRules": {
		"decreaseIndentPattern": {
			"pattern": "^\\s*[\\}\\]\\)].*$"
		},
		"increaseIndentPattern": {
			"pattern": "^.*(\\{[^}]*|\\([^)]*|\\[[^\\]]*)$"
		},
		// e.g.  * ...| or */| or *-----*/|
		"unIndentedLinePattern": {
			"pattern": "^(\\t|[ ])*[ ]\\*[^/]*\\*/\\s*$|^(\\t|[ ])*[ ]\\*/\\s*$|^(\\t|[ ])*\\*([ ]([^\\*]|\\*(?!/))*)?$"
		},
		"indentNextLinePattern": {
			"pattern": "^((.*=>\\s*)|((.*[^\\w]+|\\s*)(if|while|for)\\s*\\(.*\\)\\s*))$"
		}
	},
	"onEnterRules": [
		{
			// e.g. /** | */
			"beforeText": {
				"pattern": "^\\s*/\\*\\*(?!/)([^\\*]|\\*(?!/))*$"
			},
			"afterText": {
				"pattern": "^\\s*\\*/$"
			},
			"action": {
				"indent": "indentOutdent",
				"appendText": " * "
			}
		},
		{
			// e.g. /** ...|
			"beforeText": {
				"pattern": "^\\s*/\\*\\*(?!/)([^\\*]|\\*(?!/))*$"
			},
			"action": {
				"indent": "none",
				"appendText": " * "
			}
		},
		{
			// e.g.  * ...|
			"beforeText": {
				"pattern": "^(\\t|[ ])*\\*([ ]([^\\*]|\\*(?!/))*)?$"
			},
			"previousLineText": {
				"pattern": "(?=^(\\s*(/\\*\\*|\\*)).*)(?=(?!(\\s*\\*/)))"
			},
			"action": {
				"indent": "none",
				"appendText": "* "
			}
		},
		{
			// e.g.  */|
			"beforeText": {
				"pattern": "^(\\t|[ ])*[ ]\\*/\\s*$"
			},
			"action": {
				"indent": "none",
				"removeText": 1
			},
		},
		{
			// e.g.  *-----*/|
			"beforeText": {
				"pattern": "^(\\t|[ ])*[ ]\\*[^/]*\\*/\\s*$"
			},
			"action": {
				"indent": "none",
				"removeText": 1
			},
		},
		{
			"beforeText": {
				"pattern": "^\\s*(\\bcase\\s.+:|\\bdefault:)$"
			},
			"afterText": {
				"pattern": "^(?!\\s*(\\bcase\\b|\\bdefault\\b))"
			},
			"action": {
				"indent": "indent"
			}
		},
		{
			// Decrease indentation after single line if/else if/else, for, or while
			"previousLineText": "^\\s*(((else ?)?if|for|while)\\s*\\(.*\\)\\s*|else\\s*)$",
			// But make sure line doesn't have braces or is not another if statement
			"beforeText": "^\\s+([^{i\\s]|i(?!f\\b))",
			"action": {
				"indent": "outdent"
			}
		},
		// Indent when pressing enter from inside ()
		{
			"beforeText": "^.*\\([^\\)]*$",
			"afterText": "^\\s*\\).*$",
			"action": {
				"indent": "indentOutdent",
				"appendText": "\t",
			}
		},
		// Indent when pressing enter from inside {}
		{
			"beforeText": "^.*\\{[^\\}]*$",
			"afterText": "^\\s*\\}.*$",
			"action": {
				"indent": "indentOutdent",
				"appendText": "\t",
			}
		},
		// Indent when pressing enter from inside []
		{
			"beforeText": "^.*\\[[^\\]]*$",
			"afterText": "^\\s*\\].*$",
			"action": {
				"indent": "indentOutdent",
				"appendText": "\t",
			}
		},
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/commands/common/commands.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/commands/common/commands.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { safeStringify } from '../../../../base/common/objects.js';
import * as nls from '../../../../nls.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';

type RunnableCommand = string | { command: string; args: any[] };

type CommandArgs = {
	commands: RunnableCommand[];
};

/** Runs several commands passed to it as an argument */
class RunCommands extends Action2 {

	constructor() {
		super({
			id: 'runCommands',
			title: nls.localize2('runCommands', "Run Commands"),
			f1: false,
			metadata: {
				description: nls.localize('runCommands.description', "Run several commands"),
				args: [
					{
						name: 'args',
						schema: {
							type: 'object',
							required: ['commands'],
							properties: {
								commands: {
									type: 'array',
									description: nls.localize('runCommands.commands', "Commands to run"),
									items: {
										anyOf: [
											{
												$ref: 'vscode://schemas/keybindings#/definitions/commandNames'
											},
											{
												type: 'string',
											},
											{
												type: 'object',
												required: ['command'],
												properties: {
													command: {
														'anyOf': [
															{
																$ref: 'vscode://schemas/keybindings#/definitions/commandNames'
															},
															{
																type: 'string'
															},
														]
													}
												},
												$ref: 'vscode://schemas/keybindings#/definitions/commandsSchemas'
											}
										]
									}
								}
							}
						}
					}
				]
			}
		});
	}

	// dev decisions:
	// - this command takes a single argument-object because
	//	- keybinding definitions don't allow running commands with several arguments
	//  - and we want to be able to take on different other arguments in future, e.g., `runMode : 'serial' | 'concurrent'`
	async run(accessor: ServicesAccessor, args: unknown) {

		const notificationService = accessor.get(INotificationService);

		if (!this._isCommandArgs(args)) {
			notificationService.error(nls.localize('runCommands.invalidArgs', "'runCommands' has received an argument with incorrect type. Please, review the argument passed to the command."));
			return;
		}

		if (args.commands.length === 0) {
			notificationService.warn(nls.localize('runCommands.noCommandsToRun', "'runCommands' has not received commands to run. Did you forget to pass commands in the 'runCommands' argument?"));
			return;
		}

		const commandService = accessor.get(ICommandService);
		const logService = accessor.get(ILogService);

		let i = 0;
		try {
			for (; i < args.commands.length; ++i) {

				const cmd = args.commands[i];

				logService.debug(`runCommands: executing ${i}-th command: ${safeStringify(cmd)}`);

				await this._runCommand(commandService, cmd);

				logService.debug(`runCommands: executed ${i}-th command`);
			}
		} catch (err) {
			logService.debug(`runCommands: executing ${i}-th command resulted in an error: ${err instanceof Error ? err.message : safeStringify(err)}`);

			notificationService.error(err);
		}
	}

	private _isCommandArgs(args: unknown): args is CommandArgs {
		if (!args || typeof args !== 'object') {
			return false;
		}
		if (!('commands' in args) || !Array.isArray(args.commands)) {
			return false;
		}
		for (const cmd of args.commands) {
			if (typeof cmd === 'string') {
				continue;
			}
			if (typeof cmd === 'object' && typeof cmd.command === 'string') {
				continue;
			}
			return false;
		}
		return true;
	}

	private _runCommand(commandService: ICommandService, cmd: RunnableCommand) {
		let commandID: string, commandArgs;

		if (typeof cmd === 'string') {
			commandID = cmd;
		} else {
			commandID = cmd.command;
			commandArgs = cmd.args;
		}

		if (commandArgs === undefined) {
			return commandService.executeCommand(commandID);
		} else {
			if (Array.isArray(commandArgs)) {
				return commandService.executeCommand(commandID, ...commandArgs);
			} else {
				return commandService.executeCommand(commandID, commandArgs);
			}
		}
	}
}

registerAction2(RunCommands);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentColors.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentColors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Color } from '../../../../base/common/color.js';
import * as languages from '../../../../editor/common/languages.js';
import { peekViewTitleBackground } from '../../../../editor/contrib/peekView/browser/peekView.js';
import * as nls from '../../../../nls.js';
import { contrastBorder, disabledForeground, listFocusOutline, registerColor, transparent } from '../../../../platform/theme/common/colorRegistry.js';
import { IColorTheme } from '../../../../platform/theme/common/themeService.js';

const resolvedCommentViewIcon = registerColor('commentsView.resolvedIcon', { dark: disabledForeground, light: disabledForeground, hcDark: contrastBorder, hcLight: contrastBorder }, nls.localize('resolvedCommentIcon', 'Icon color for resolved comments.'));
const unresolvedCommentViewIcon = registerColor('commentsView.unresolvedIcon', { dark: listFocusOutline, light: listFocusOutline, hcDark: contrastBorder, hcLight: contrastBorder }, nls.localize('unresolvedCommentIcon', 'Icon color for unresolved comments.'));

registerColor('editorCommentsWidget.replyInputBackground', peekViewTitleBackground, nls.localize('commentReplyInputBackground', 'Background color for comment reply input box.'));
const resolvedCommentBorder = registerColor('editorCommentsWidget.resolvedBorder', { dark: resolvedCommentViewIcon, light: resolvedCommentViewIcon, hcDark: contrastBorder, hcLight: contrastBorder }, nls.localize('resolvedCommentBorder', 'Color of borders and arrow for resolved comments.'));
const unresolvedCommentBorder = registerColor('editorCommentsWidget.unresolvedBorder', { dark: unresolvedCommentViewIcon, light: unresolvedCommentViewIcon, hcDark: contrastBorder, hcLight: contrastBorder }, nls.localize('unresolvedCommentBorder', 'Color of borders and arrow for unresolved comments.'));
export const commentThreadRangeBackground = registerColor('editorCommentsWidget.rangeBackground', transparent(unresolvedCommentBorder, .1), nls.localize('commentThreadRangeBackground', 'Color of background for comment ranges.'));
export const commentThreadRangeActiveBackground = registerColor('editorCommentsWidget.rangeActiveBackground', transparent(unresolvedCommentBorder, .1), nls.localize('commentThreadActiveRangeBackground', 'Color of background for currently selected or hovered comment range.'));

const commentThreadStateBorderColors = new Map([
	[languages.CommentThreadState.Unresolved, unresolvedCommentBorder],
	[languages.CommentThreadState.Resolved, resolvedCommentBorder],
]);

const commentThreadStateIconColors = new Map([
	[languages.CommentThreadState.Unresolved, unresolvedCommentViewIcon],
	[languages.CommentThreadState.Resolved, resolvedCommentViewIcon],
]);

export const commentThreadStateColorVar = '--comment-thread-state-color';
export const commentViewThreadStateColorVar = '--comment-view-thread-state-color';
export const commentThreadStateBackgroundColorVar = '--comment-thread-state-background-color';

function getCommentThreadStateColor(state: languages.CommentThreadState | undefined, theme: IColorTheme, map: Map<languages.CommentThreadState, string>): Color | undefined {
	const colorId = (state !== undefined) ? map.get(state) : undefined;
	return (colorId !== undefined) ? theme.getColor(colorId) : undefined;
}

export function getCommentThreadStateBorderColor(state: languages.CommentThreadState | undefined, theme: IColorTheme): Color | undefined {
	return getCommentThreadStateColor(state, theme, commentThreadStateBorderColors);
}

export function getCommentThreadStateIconColor(state: languages.CommentThreadState | undefined, theme: IColorTheme): Color | undefined {
	return getCommentThreadStateColor(state, theme, commentThreadStateIconColors);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentFormActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentFormActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Button, ButtonWithDropdown } from '../../../../base/browser/ui/button/button.js';
import { ActionRunner, IAction } from '../../../../base/common/actions.js';
import { DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { IMenu, SubmenuItemAction } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { defaultButtonStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { CommentCommandId } from '../common/commentCommandIds.js';

export class CommentFormActions implements IDisposable {
	private _buttonElements: HTMLElement[] = [];
	private readonly _toDispose = new DisposableStore();
	private _actions: IAction[] = [];

	constructor(
		private readonly keybindingService: IKeybindingService,
		private readonly contextKeyService: IContextKeyService,
		private readonly contextMenuService: IContextMenuService,
		private container: HTMLElement,
		private actionHandler: (action: IAction) => void,
		private readonly maxActions?: number,
		private readonly supportDropdowns?: boolean,
	) { }

	setActions(menu: IMenu, hasOnlySecondaryActions: boolean = false) {
		this._toDispose.clear();

		this._buttonElements.forEach(b => b.remove());
		this._buttonElements = [];

		const groups = menu.getActions({ shouldForwardArgs: true });
		let isPrimary: boolean = !hasOnlySecondaryActions;
		for (const group of groups) {
			const [, actions] = group;

			this._actions = actions;
			for (const current of actions) {
				const dropDownActions = this.supportDropdowns && current instanceof SubmenuItemAction ? current.actions : [];
				const action = dropDownActions.length ? dropDownActions[0] : current;
				let keybinding = this.keybindingService.lookupKeybinding(action.id, this.contextKeyService)?.getLabel();
				if (!keybinding && isPrimary) {
					keybinding = this.keybindingService.lookupKeybinding(CommentCommandId.Submit, this.contextKeyService)?.getLabel();
				}
				const title = keybinding ? `${action.label} (${keybinding})` : action.label;
				const actionHandler = this.actionHandler;
				const button = dropDownActions.length ? new ButtonWithDropdown(this.container, {
					contextMenuProvider: this.contextMenuService,
					actions: dropDownActions,
					actionRunner: this._toDispose.add(new class extends ActionRunner {
						protected override async runAction(action: IAction, context?: unknown): Promise<void> {
							return actionHandler(action);
						}
					}),
					secondary: !isPrimary,
					title,
					addPrimaryActionToDropdown: false,
					...defaultButtonStyles
				}) : new Button(this.container, { secondary: !isPrimary, title, ...defaultButtonStyles });

				isPrimary = false;
				this._buttonElements.push(button.element);

				this._toDispose.add(button);
				this._toDispose.add(button.onDidClick(() => this.actionHandler(action)));

				button.enabled = action.enabled;
				button.label = action.label;
				if ((this.maxActions !== undefined) && (this._buttonElements.length >= this.maxActions)) {
					console.warn(`An extension has contributed more than the allowable number of actions to a comments menu.`);
					return;
				}
			}
		}
	}

	triggerDefaultAction() {
		if (this._actions.length) {
			const lastAction = this._actions[0];

			if (lastAction.enabled) {
				return this.actionHandler(lastAction);
			}
		}
	}

	dispose() {
		this._toDispose.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentGlyphWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentGlyphWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { Color } from '../../../../base/common/color.js';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidgetPosition } from '../../../../editor/browser/editorBrowser.js';
import { IModelDecorationOptions, OverviewRulerLane } from '../../../../editor/common/model.js';
import { ModelDecorationOptions } from '../../../../editor/common/model/textModel.js';
import { darken, editorBackground, editorForeground, listInactiveSelectionBackground, opaque, registerColor } from '../../../../platform/theme/common/colorRegistry.js';
import { themeColorFromId } from '../../../../platform/theme/common/themeService.js';
import { IEditorDecorationsCollection } from '../../../../editor/common/editorCommon.js';
import { CommentThreadState } from '../../../../editor/common/languages.js';
import { Disposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { Emitter } from '../../../../base/common/event.js';

export const overviewRulerCommentingRangeForeground = registerColor('editorGutter.commentRangeForeground', { dark: opaque(listInactiveSelectionBackground, editorBackground), light: darken(opaque(listInactiveSelectionBackground, editorBackground), .05), hcDark: Color.white, hcLight: Color.black }, nls.localize('editorGutterCommentRangeForeground', 'Editor gutter decoration color for commenting ranges. This color should be opaque.'));
const overviewRulerCommentForeground = registerColor('editorOverviewRuler.commentForeground', overviewRulerCommentingRangeForeground, nls.localize('editorOverviewRuler.commentForeground', 'Editor overview ruler decoration color for resolved comments. This color should be opaque.'));
const overviewRulerCommentUnresolvedForeground = registerColor('editorOverviewRuler.commentUnresolvedForeground', overviewRulerCommentForeground, nls.localize('editorOverviewRuler.commentUnresolvedForeground', 'Editor overview ruler decoration color for unresolved comments. This color should be opaque.'));
const overviewRulerCommentDraftForeground = registerColor('editorOverviewRuler.commentDraftForeground', overviewRulerCommentUnresolvedForeground, nls.localize('editorOverviewRuler.commentDraftForeground', 'Editor overview ruler decoration color for comment threads with draft comments. This color should be opaque.'));

const editorGutterCommentGlyphForeground = registerColor('editorGutter.commentGlyphForeground', { dark: editorForeground, light: editorForeground, hcDark: Color.black, hcLight: Color.white }, nls.localize('editorGutterCommentGlyphForeground', 'Editor gutter decoration color for commenting glyphs.'));
registerColor('editorGutter.commentUnresolvedGlyphForeground', editorGutterCommentGlyphForeground, nls.localize('editorGutterCommentUnresolvedGlyphForeground', 'Editor gutter decoration color for commenting glyphs for unresolved comment threads.'));
registerColor('editorGutter.commentDraftGlyphForeground', editorGutterCommentGlyphForeground, nls.localize('editorGutterCommentDraftGlyphForeground', 'Editor gutter decoration color for commenting glyphs for comment threads with draft comments.'));

export class CommentGlyphWidget extends Disposable {
	public static description = 'comment-glyph-widget';
	private _lineNumber!: number;
	private _editor: ICodeEditor;
	private _threadState: CommentThreadState | undefined;
	private _threadHasDraft: boolean = false;
	private readonly _commentsDecorations: IEditorDecorationsCollection;
	private _commentsOptions: ModelDecorationOptions;

	private readonly _onDidChangeLineNumber = this._register(new Emitter<number>());
	public readonly onDidChangeLineNumber = this._onDidChangeLineNumber.event;

	constructor(editor: ICodeEditor, lineNumber: number) {
		super();
		this._commentsOptions = this.createDecorationOptions();
		this._editor = editor;
		this._commentsDecorations = this._editor.createDecorationsCollection();
		this._register(this._commentsDecorations.onDidChange(e => {
			const range = (this._commentsDecorations.length > 0 ? this._commentsDecorations.getRange(0) : null);
			if (range && range.endLineNumber !== this._lineNumber) {
				this._lineNumber = range.endLineNumber;
				this._onDidChangeLineNumber.fire(this._lineNumber);
			}
		}));
		this._register(toDisposable(() => this._commentsDecorations.clear()));
		this.setLineNumber(lineNumber);
	}

	private createDecorationOptions(): ModelDecorationOptions {
		// Priority: draft > unresolved > resolved
		let className: string;
		if (this._threadHasDraft) {
			className = 'comment-range-glyph comment-thread-draft';
		} else {
			const unresolved = this._threadState === CommentThreadState.Unresolved;
			className = `comment-range-glyph comment-thread${unresolved ? '-unresolved' : ''}`;
		}

		const decorationOptions: IModelDecorationOptions = {
			description: CommentGlyphWidget.description,
			isWholeLine: true,
			overviewRuler: {
				color: themeColorFromId(this._threadHasDraft ? overviewRulerCommentDraftForeground :
					(this._threadState === CommentThreadState.Unresolved ? overviewRulerCommentUnresolvedForeground : overviewRulerCommentForeground)),
				position: OverviewRulerLane.Center
			},
			collapseOnReplaceEdit: true,
			linesDecorationsClassName: className
		};

		return ModelDecorationOptions.createDynamic(decorationOptions);
	}

	setThreadState(state: CommentThreadState | undefined, hasDraft: boolean = false): void {
		if (this._threadState !== state || this._threadHasDraft !== hasDraft) {
			this._threadState = state;
			this._threadHasDraft = hasDraft;
			this._commentsOptions = this.createDecorationOptions();
			this._updateDecorations();
		}
	}

	private _updateDecorations(): void {
		const commentsDecorations = [{
			range: {
				startLineNumber: this._lineNumber, startColumn: 1,
				endLineNumber: this._lineNumber, endColumn: 1
			},
			options: this._commentsOptions
		}];

		this._commentsDecorations.set(commentsDecorations);
	}

	setLineNumber(lineNumber: number): void {
		this._lineNumber = lineNumber;
		this._updateDecorations();
	}

	getPosition(): IContentWidgetPosition {
		const range = (this._commentsDecorations.length > 0 ? this._commentsDecorations.getRange(0) : null);

		return {
			position: {
				lineNumber: range ? range.endLineNumber : this._lineNumber,
				column: 1
			},
			preference: [ContentWidgetPositionPreference.EXACT]
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentMenus.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentMenus.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../base/common/lifecycle.js';
import { Comment } from '../../../../editor/common/languages.js';
import { IMenu, IMenuActionOptions, IMenuCreateOptions, IMenuService, MenuId, MenuItemAction, SubmenuItemAction } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';

export class CommentMenus implements IDisposable {
	constructor(
		@IMenuService private readonly menuService: IMenuService
	) { }

	getCommentThreadTitleActions(contextKeyService: IContextKeyService): IMenu {
		return this.getMenu(MenuId.CommentThreadTitle, contextKeyService);
	}

	getCommentThreadActions(contextKeyService: IContextKeyService): IMenu {
		return this.getMenu(MenuId.CommentThreadActions, contextKeyService);
	}

	getCommentEditorActions(contextKeyService: IContextKeyService): IMenu {
		return this.getMenu(MenuId.CommentEditorActions, contextKeyService);
	}

	getCommentThreadAdditionalActions(contextKeyService: IContextKeyService): IMenu {
		return this.getMenu(MenuId.CommentThreadAdditionalActions, contextKeyService, { emitEventsForSubmenuChanges: true });
	}

	getCommentTitleActions(comment: Comment, contextKeyService: IContextKeyService): IMenu {
		return this.getMenu(MenuId.CommentTitle, contextKeyService);
	}

	getCommentActions(comment: Comment, contextKeyService: IContextKeyService): IMenu {
		return this.getMenu(MenuId.CommentActions, contextKeyService);
	}

	getCommentThreadTitleContextActions(contextKeyService: IContextKeyService) {
		return this.getActions(MenuId.CommentThreadTitleContext, contextKeyService, { shouldForwardArgs: true });
	}

	private getMenu(menuId: MenuId, contextKeyService: IContextKeyService, options?: IMenuCreateOptions): IMenu {
		return this.menuService.createMenu(menuId, contextKeyService, options);
	}

	private getActions(menuId: MenuId, contextKeyService: IContextKeyService, options?: IMenuActionOptions): Array<MenuItemAction | SubmenuItemAction> {
		return this.menuService.getMenuActions(menuId, contextKeyService, options).map((value) => value[1]).flat();
	}

	dispose(): void {

	}
}
```

--------------------------------------------------------------------------------

````
