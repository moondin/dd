---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 479
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 479 of 552)

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

---[FILE: src/vs/workbench/contrib/typeHierarchy/browser/typeHierarchyPeek.ts]---
Location: vscode-main/src/vs/workbench/contrib/typeHierarchy/browser/typeHierarchyPeek.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/typeHierarchy.css';
import { Dimension, isKeyboardEvent } from '../../../../base/browser/dom.js';
import { Orientation, Sizing, SplitView } from '../../../../base/browser/ui/splitview/splitview.js';
import { IAsyncDataTreeViewState } from '../../../../base/browser/ui/tree/asyncDataTree.js';
import { ITreeNode, TreeMouseEventTarget } from '../../../../base/browser/ui/tree/tree.js';
import { Color } from '../../../../base/common/color.js';
import { Event } from '../../../../base/common/event.js';
import { FuzzyScore } from '../../../../base/common/filters.js';
import { DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { EmbeddedCodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { IEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { IPosition } from '../../../../editor/common/core/position.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { ScrollType } from '../../../../editor/common/editorCommon.js';
import { IModelDecorationOptions, TrackedRangeStickiness, IModelDeltaDecoration, OverviewRulerLane } from '../../../../editor/common/model.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import * as peekView from '../../../../editor/contrib/peekView/browser/peekView.js';
import { localize } from '../../../../nls.js';
import { getFlatActionBarActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchAsyncDataTreeOptions, WorkbenchAsyncDataTree } from '../../../../platform/list/browser/listService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IColorTheme, IThemeService, themeColorFromId } from '../../../../platform/theme/common/themeService.js';
import * as typeHTree from './typeHierarchyTree.js';
import { TypeHierarchyDirection, TypeHierarchyModel } from '../common/typeHierarchy.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';

// Todo: copied from call hierarchy, to extract
const enum State {
	Loading = 'loading',
	Message = 'message',
	Data = 'data'
}

class LayoutInfo {

	static store(info: LayoutInfo, storageService: IStorageService): void {
		storageService.store('typeHierarchyPeekLayout', JSON.stringify(info), StorageScope.PROFILE, StorageTarget.MACHINE);
	}

	static retrieve(storageService: IStorageService): LayoutInfo {
		const value = storageService.get('typeHierarchyPeekLayout', StorageScope.PROFILE, '{}');
		const defaultInfo: LayoutInfo = { ratio: 0.7, height: 17 };
		try {
			return { ...defaultInfo, ...JSON.parse(value) };
		} catch {
			return defaultInfo;
		}
	}

	constructor(
		public ratio: number,
		public height: number
	) { }
}

class TypeHierarchyTree extends WorkbenchAsyncDataTree<TypeHierarchyModel, typeHTree.Type, FuzzyScore> { }

export class TypeHierarchyTreePeekWidget extends peekView.PeekViewWidget {

	static readonly TitleMenu = new MenuId('typehierarchy/title');

	private _parent!: HTMLElement;
	private _message!: HTMLElement;
	private _splitView!: SplitView;
	private _tree!: TypeHierarchyTree;
	private _treeViewStates = new Map<TypeHierarchyDirection, IAsyncDataTreeViewState>();
	private _editor!: EmbeddedCodeEditorWidget;
	private _dim!: Dimension;
	private _layoutInfo!: LayoutInfo;

	private readonly _previewDisposable = new DisposableStore();

	constructor(
		editor: ICodeEditor,
		private readonly _where: IPosition,
		private _direction: TypeHierarchyDirection,
		@IThemeService themeService: IThemeService,
		@peekView.IPeekViewService private readonly _peekViewService: peekView.IPeekViewService,
		@IEditorService private readonly _editorService: IEditorService,
		@ITextModelService private readonly _textModelService: ITextModelService,
		@IStorageService private readonly _storageService: IStorageService,
		@IMenuService private readonly _menuService: IMenuService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super(editor, { showFrame: true, showArrow: true, isResizeable: true, isAccessible: true }, _instantiationService);
		this.create();
		this._peekViewService.addExclusiveWidget(editor, this);
		this._applyTheme(themeService.getColorTheme());
		this._disposables.add(themeService.onDidColorThemeChange(this._applyTheme, this));
		this._disposables.add(this._previewDisposable);
	}

	override dispose(): void {
		LayoutInfo.store(this._layoutInfo, this._storageService);
		this._splitView.dispose();
		this._tree.dispose();
		this._editor.dispose();
		super.dispose();
	}

	get direction(): TypeHierarchyDirection {
		return this._direction;
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

	protected override _fillHead(container: HTMLElement): void {
		super._fillHead(container, true);

		const menu = this._menuService.createMenu(TypeHierarchyTreePeekWidget.TitleMenu, this._contextKeyService);
		const updateToolbar = () => {
			const actions = getFlatActionBarActions(menu.getActions());
			this._actionbarWidget!.clear();
			this._actionbarWidget!.push(actions, { label: false, icon: true });
		};
		this._disposables.add(menu);
		this._disposables.add(menu.onDidChange(updateToolbar));
		updateToolbar();
	}

	protected _fillBody(parent: HTMLElement): void {

		this._layoutInfo = LayoutInfo.retrieve(this._storageService);
		this._dim = new Dimension(0, 0);

		this._parent = parent;
		parent.classList.add('type-hierarchy');

		const message = document.createElement('div');
		message.classList.add('message');
		parent.appendChild(message);
		this._message = message;
		this._message.tabIndex = 0;

		const container = document.createElement('div');
		container.classList.add('results');
		parent.appendChild(container);

		this._splitView = new SplitView(container, { orientation: Orientation.HORIZONTAL });

		// editor stuff
		const editorContainer = document.createElement('div');
		editorContainer.classList.add('editor');
		container.appendChild(editorContainer);
		const editorOptions: IEditorOptions = {
			scrollBeyondLastLine: false,
			scrollbar: {
				verticalScrollbarSize: 14,
				horizontal: 'auto',
				useShadows: true,
				verticalHasArrows: false,
				horizontalHasArrows: false,
				alwaysConsumeMouseWheel: false
			},
			overviewRulerLanes: 2,
			fixedOverflowWidgets: true,
			minimap: {
				enabled: false
			}
		};
		this._editor = this._instantiationService.createInstance(
			EmbeddedCodeEditorWidget,
			editorContainer,
			editorOptions,
			{},
			this.editor
		);

		// tree stuff
		const treeContainer = document.createElement('div');
		treeContainer.classList.add('tree');
		container.appendChild(treeContainer);
		const options: IWorkbenchAsyncDataTreeOptions<typeHTree.Type, FuzzyScore> = {
			sorter: new typeHTree.Sorter(),
			accessibilityProvider: new typeHTree.AccessibilityProvider(() => this._direction),
			identityProvider: new typeHTree.IdentityProvider(() => this._direction),
			expandOnlyOnTwistieClick: true,
			overrideStyles: {
				listBackground: peekView.peekViewResultsBackground
			}
		};
		this._tree = this._instantiationService.createInstance(
			TypeHierarchyTree,
			'TypeHierarchyPeek',
			treeContainer,
			new typeHTree.VirtualDelegate(),
			[this._instantiationService.createInstance(typeHTree.TypeRenderer)],
			this._instantiationService.createInstance(typeHTree.DataSource, () => this._direction),
			options
		);

		// split stuff
		this._splitView.addView({
			onDidChange: Event.None,
			element: editorContainer,
			minimumSize: 200,
			maximumSize: Number.MAX_VALUE,
			layout: (width) => {
				if (this._dim.height) {
					this._editor.layout({ height: this._dim.height, width });
				}
			}
		}, Sizing.Distribute);

		this._splitView.addView({
			onDidChange: Event.None,
			element: treeContainer,
			minimumSize: 100,
			maximumSize: Number.MAX_VALUE,
			layout: (width) => {
				if (this._dim.height) {
					this._tree.layout(this._dim.height, width);
				}
			}
		}, Sizing.Distribute);

		this._disposables.add(this._splitView.onDidSashChange(() => {
			if (this._dim.width) {
				this._layoutInfo.ratio = this._splitView.getViewSize(0) / this._dim.width;
			}
		}));

		// update editor
		this._disposables.add(this._tree.onDidChangeFocus(this._updatePreview, this));

		this._disposables.add(this._editor.onMouseDown(e => {
			const { event, target } = e;
			if (event.detail !== 2) {
				return;
			}
			const [focus] = this._tree.getFocus();
			if (!focus) {
				return;
			}
			this.dispose();
			this._editorService.openEditor({
				resource: focus.item.uri,
				options: { selection: target.range! }
			});

		}));

		this._disposables.add(this._tree.onMouseDblClick(e => {
			if (e.target === TreeMouseEventTarget.Twistie) {
				return;
			}

			if (e.element) {
				this.dispose();
				this._editorService.openEditor({
					resource: e.element.item.uri,
					options: { selection: e.element.item.selectionRange, pinned: true }
				});
			}
		}));

		this._disposables.add(this._tree.onDidChangeSelection(e => {
			const [element] = e.elements;
			// don't close on click
			if (element && isKeyboardEvent(e.browserEvent)) {
				this.dispose();
				this._editorService.openEditor({
					resource: element.item.uri,
					options: { selection: element.item.selectionRange, pinned: true }
				});
			}
		}));
	}

	private async _updatePreview() {
		const [element] = this._tree.getFocus();
		if (!element) {
			return;
		}

		this._previewDisposable.clear();

		// update: editor and editor highlights
		const options: IModelDecorationOptions = {
			description: 'type-hierarchy-decoration',
			stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
			className: 'type-decoration',
			overviewRuler: {
				color: themeColorFromId(peekView.peekViewEditorMatchHighlight),
				position: OverviewRulerLane.Center
			},
		};

		let previewUri: URI;
		if (this._direction === TypeHierarchyDirection.Supertypes) {
			// supertypes: show super types and highlight focused type
			previewUri = element.parent ? element.parent.item.uri : element.model.root.uri;
		} else {
			// subtypes: show sub types and highlight focused type
			previewUri = element.item.uri;
		}

		const value = await this._textModelService.createModelReference(previewUri);
		this._editor.setModel(value.object.textEditorModel);

		// set decorations for type ranges
		const decorations: IModelDeltaDecoration[] = [];
		let fullRange: IRange | undefined;
		const loc = { uri: element.item.uri, range: element.item.selectionRange };
		if (loc.uri.toString() === previewUri.toString()) {
			decorations.push({ range: loc.range, options });
			fullRange = !fullRange ? loc.range : Range.plusRange(loc.range, fullRange);
		}
		if (fullRange) {
			this._editor.revealRangeInCenter(fullRange, ScrollType.Immediate);
			const decorationsCollection = this._editor.createDecorationsCollection(decorations);
			this._previewDisposable.add(toDisposable(() => decorationsCollection.clear()));
		}
		this._previewDisposable.add(value);

		// update: title
		const title = this._direction === TypeHierarchyDirection.Supertypes
			? localize('supertypes', "Supertypes of '{0}'", element.model.root.name)
			: localize('subtypes', "Subtypes of '{0}'", element.model.root.name);
		this.setTitle(title);
	}

	showLoading(): void {
		this._parent.dataset['state'] = State.Loading;
		this.setTitle(localize('title.loading', "Loading..."));
		this._show();
	}

	showMessage(message: string): void {
		this._parent.dataset['state'] = State.Message;
		this.setTitle('');
		this.setMetaTitle('');
		this._message.innerText = message;
		this._show();
		this._message.focus();
	}

	async showModel(model: TypeHierarchyModel): Promise<void> {

		this._show();
		const viewState = this._treeViewStates.get(this._direction);

		await this._tree.setInput(model, viewState);

		const root = <ITreeNode<typeHTree.Type, FuzzyScore>>this._tree.getNode(model).children[0];
		await this._tree.expand(root.element);

		if (root.children.length === 0) {
			this.showMessage(this._direction === TypeHierarchyDirection.Supertypes
				? localize('empt.supertypes', "No supertypes of '{0}'", model.root.name)
				: localize('empt.subtypes', "No subtypes of '{0}'", model.root.name));

		} else {
			this._parent.dataset['state'] = State.Data;
			if (!viewState || this._tree.getFocus().length === 0) {
				this._tree.setFocus([root.children[0].element]);
			}
			this._tree.domFocus();
			this._updatePreview();
		}
	}

	getModel(): TypeHierarchyModel | undefined {
		return this._tree.getInput();
	}

	getFocused(): typeHTree.Type | undefined {
		return this._tree.getFocus()[0];
	}

	async updateDirection(newDirection: TypeHierarchyDirection): Promise<void> {
		const model = this._tree.getInput();
		if (model && newDirection !== this._direction) {
			this._treeViewStates.set(this._direction, this._tree.getViewState());
			this._direction = newDirection;
			await this.showModel(model);
		}
	}

	private _show() {
		if (!this._isShowing) {
			this.editor.revealLineInCenterIfOutsideViewport(this._where.lineNumber, ScrollType.Smooth);
			super.show(Range.fromPositions(this._where), this._layoutInfo.height);
		}
	}

	protected override _onWidth(width: number) {
		if (this._dim) {
			this._doLayoutBody(this._dim.height, width);
		}
	}

	protected override _doLayoutBody(height: number, width: number): void {
		if (this._dim.height !== height || this._dim.width !== width) {
			super._doLayoutBody(height, width);
			this._dim = new Dimension(width, height);
			this._layoutInfo.height = this._viewZone ? this._viewZone.heightInLines : this._layoutInfo.height;
			this._splitView.layout(width);
			this._splitView.resizeView(0, width * this._layoutInfo.ratio);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/typeHierarchy/browser/typeHierarchyTree.ts]---
Location: vscode-main/src/vs/workbench/contrib/typeHierarchy/browser/typeHierarchyTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAsyncDataSource, ITreeRenderer, ITreeNode, ITreeSorter } from '../../../../base/browser/ui/tree/tree.js';
import { TypeHierarchyDirection, TypeHierarchyItem, TypeHierarchyModel } from '../common/typeHierarchy.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IIdentityProvider, IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { FuzzyScore, createMatches } from '../../../../base/common/filters.js';
import { IconLabel } from '../../../../base/browser/ui/iconLabel/iconLabel.js';
import { SymbolKinds, SymbolTag } from '../../../../editor/common/languages.js';
import { compare } from '../../../../base/common/strings.js';
import { Range } from '../../../../editor/common/core/range.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { localize } from '../../../../nls.js';
import { ThemeIcon } from '../../../../base/common/themables.js';

export class Type {
	constructor(
		readonly item: TypeHierarchyItem,
		readonly model: TypeHierarchyModel,
		readonly parent: Type | undefined
	) { }

	static compare(a: Type, b: Type): number {
		let res = compare(a.item.uri.toString(), b.item.uri.toString());
		if (res === 0) {
			res = Range.compareRangesUsingStarts(a.item.range, b.item.range);
		}
		return res;
	}
}

export class DataSource implements IAsyncDataSource<TypeHierarchyModel, Type> {

	constructor(
		public getDirection: () => TypeHierarchyDirection,
	) { }

	hasChildren(): boolean {
		return true;
	}

	async getChildren(element: TypeHierarchyModel | Type): Promise<Type[]> {
		if (element instanceof TypeHierarchyModel) {
			return element.roots.map(root => new Type(root, element, undefined));
		}

		const { model, item } = element;

		if (this.getDirection() === TypeHierarchyDirection.Supertypes) {
			return (await model.provideSupertypes(item, CancellationToken.None)).map(item => {
				return new Type(
					item,
					model,
					element
				);
			});
		} else {
			return (await model.provideSubtypes(item, CancellationToken.None)).map(item => {
				return new Type(
					item,
					model,
					element
				);
			});
		}
	}
}

export class Sorter implements ITreeSorter<Type> {

	compare(element: Type, otherElement: Type): number {
		return Type.compare(element, otherElement);
	}
}

export class IdentityProvider implements IIdentityProvider<Type> {

	constructor(
		public getDirection: () => TypeHierarchyDirection
	) { }

	getId(element: Type): { toString(): string } {
		let res = this.getDirection() + JSON.stringify(element.item.uri) + JSON.stringify(element.item.range);
		if (element.parent) {
			res += this.getId(element.parent);
		}
		return res;
	}
}

class TypeRenderingTemplate {
	constructor(
		readonly icon: HTMLDivElement,
		readonly label: IconLabel
	) { }
}

export class TypeRenderer implements ITreeRenderer<Type, FuzzyScore, TypeRenderingTemplate> {

	static readonly id = 'TypeRenderer';

	templateId: string = TypeRenderer.id;

	renderTemplate(container: HTMLElement): TypeRenderingTemplate {
		container.classList.add('typehierarchy-element');
		const icon = document.createElement('div');
		container.appendChild(icon);
		const label = new IconLabel(container, { supportHighlights: true });
		return new TypeRenderingTemplate(icon, label);
	}

	renderElement(node: ITreeNode<Type, FuzzyScore>, _index: number, template: TypeRenderingTemplate): void {
		const { element, filterData } = node;
		const deprecated = element.item.tags?.includes(SymbolTag.Deprecated);
		template.icon.classList.add('inline', ...ThemeIcon.asClassNameArray(SymbolKinds.toIcon(element.item.kind)));
		template.label.setLabel(
			element.item.name,
			element.item.detail,
			{ labelEscapeNewLines: true, matches: createMatches(filterData), strikethrough: deprecated }
		);
	}
	disposeTemplate(template: TypeRenderingTemplate): void {
		template.label.dispose();
	}
}

export class VirtualDelegate implements IListVirtualDelegate<Type> {

	getHeight(_element: Type): number {
		return 22;
	}

	getTemplateId(_element: Type): string {
		return TypeRenderer.id;
	}
}

export class AccessibilityProvider implements IListAccessibilityProvider<Type> {

	constructor(
		public getDirection: () => TypeHierarchyDirection
	) { }

	getWidgetAriaLabel(): string {
		return localize('tree.aria', "Type Hierarchy");
	}

	getAriaLabel(element: Type): string | null {
		if (this.getDirection() === TypeHierarchyDirection.Supertypes) {
			return localize('supertypes', "supertypes of {0}", element.item.name);
		} else {
			return localize('subtypes', "subtypes of {0}", element.item.name);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/typeHierarchy/browser/media/typeHierarchy.css]---
Location: vscode-main/src/vs/workbench/contrib/typeHierarchy/browser/media/typeHierarchy.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .type-hierarchy .results,
.monaco-workbench .type-hierarchy .message {
	display: none;
}

.monaco-workbench .type-hierarchy[data-state="data"] .results {
	display: inherit;
	height: 100%;
}

.monaco-workbench .type-hierarchy[data-state="message"] .message {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
}

.monaco-workbench .type-hierarchy .editor,
.monaco-workbench .type-hierarchy .tree {
	height: 100%;
}

.monaco-editor .type-hierarchy .tree {
	background-color: var(--vscode-peekViewResult-background);
	color: var(--vscode-peekViewResult-fileForeground);
}

.monaco-editor .type-hierarchy .tree .monaco-list:focus .monaco-list-rows > .monaco-list-row.selected:not(.highlighted) {
	background-color: var(--vscode-peekViewResult-selectionBackground);
	color: var(--vscode-peekViewResult-selectionForeground) !important;
}

.monaco-workbench .type-hierarchy .tree .typehierarchy-element {
	display: flex;
	flex: 1;
	flex-flow: row nowrap;
	align-items: center;
}

.monaco-workbench .type-hierarchy .tree .typehierarchy-element .monaco-icon-label {
	padding-left: 4px;
}

.monaco-editor .type-hierarchy .type-decoration {
	background-color: var(--vscode-peekViewEditor-matchHighlightBackground);
	border: 2px solid var(--vscode-peekViewEditor-matchHighlightBorder);
	box-sizing: border-box;
}

.monaco-editor .type-hierarchy .editor .monaco-editor .monaco-editor-background,
.monaco-editor .type-hierarchy .editor .monaco-editor .inputarea.ime-input {
	background-color: var(--vscode-peekViewEditor-background);
}

.monaco-editor .type-hierarchy .editor .monaco-editor .margin {
	background-color: var(--vscode-peekViewEditorGutter-background);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/typeHierarchy/common/typeHierarchy.ts]---
Location: vscode-main/src/vs/workbench/contrib/typeHierarchy/common/typeHierarchy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IRange, Range } from '../../../../editor/common/core/range.js';
import { SymbolKind, ProviderResult, SymbolTag } from '../../../../editor/common/languages.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { LanguageFeatureRegistry } from '../../../../editor/common/languageFeatureRegistry.js';
import { URI } from '../../../../base/common/uri.js';
import { IPosition, Position } from '../../../../editor/common/core/position.js';
import { isNonEmptyArray } from '../../../../base/common/arrays.js';
import { onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { IDisposable, RefCountedDisposable } from '../../../../base/common/lifecycle.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { assertType } from '../../../../base/common/types.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';

export const enum TypeHierarchyDirection {
	Subtypes = 'subtypes',
	Supertypes = 'supertypes'
}

export interface TypeHierarchyItem {
	_sessionId: string;
	_itemId: string;
	kind: SymbolKind;
	name: string;
	detail?: string;
	uri: URI;
	range: IRange;
	selectionRange: IRange;
	tags?: SymbolTag[];
}

export interface TypeHierarchySession {
	roots: TypeHierarchyItem[];
	dispose(): void;
}

export interface TypeHierarchyProvider {
	prepareTypeHierarchy(document: ITextModel, position: IPosition, token: CancellationToken): ProviderResult<TypeHierarchySession>;
	provideSupertypes(item: TypeHierarchyItem, token: CancellationToken): ProviderResult<TypeHierarchyItem[]>;
	provideSubtypes(item: TypeHierarchyItem, token: CancellationToken): ProviderResult<TypeHierarchyItem[]>;
}

export const TypeHierarchyProviderRegistry = new LanguageFeatureRegistry<TypeHierarchyProvider>();



export class TypeHierarchyModel {

	static async create(model: ITextModel, position: IPosition, token: CancellationToken): Promise<TypeHierarchyModel | undefined> {
		const [provider] = TypeHierarchyProviderRegistry.ordered(model);
		if (!provider) {
			return undefined;
		}
		const session = await provider.prepareTypeHierarchy(model, position, token);
		if (!session) {
			return undefined;
		}
		return new TypeHierarchyModel(session.roots.reduce((p, c) => p + c._sessionId, ''), provider, session.roots, new RefCountedDisposable(session));
	}

	readonly root: TypeHierarchyItem;

	private constructor(
		readonly id: string,
		readonly provider: TypeHierarchyProvider,
		readonly roots: TypeHierarchyItem[],
		readonly ref: RefCountedDisposable,
	) {
		this.root = roots[0];
	}

	dispose(): void {
		this.ref.release();
	}

	fork(item: TypeHierarchyItem): TypeHierarchyModel {
		const that = this;
		return new class extends TypeHierarchyModel {
			constructor() {
				super(that.id, that.provider, [item], that.ref.acquire());
			}
		};
	}

	async provideSupertypes(item: TypeHierarchyItem, token: CancellationToken): Promise<TypeHierarchyItem[]> {
		try {
			const result = await this.provider.provideSupertypes(item, token);
			if (isNonEmptyArray(result)) {
				return result;
			}
		} catch (e) {
			onUnexpectedExternalError(e);
		}
		return [];
	}

	async provideSubtypes(item: TypeHierarchyItem, token: CancellationToken): Promise<TypeHierarchyItem[]> {
		try {
			const result = await this.provider.provideSubtypes(item, token);
			if (isNonEmptyArray(result)) {
				return result;
			}
		} catch (e) {
			onUnexpectedExternalError(e);
		}
		return [];
	}
}

// --- API command support

const _models = new Map<string, TypeHierarchyModel>();

CommandsRegistry.registerCommand('_executePrepareTypeHierarchy', async (accessor, ...args) => {
	const [resource, position] = args;
	assertType(URI.isUri(resource));
	assertType(Position.isIPosition(position));

	const modelService = accessor.get(IModelService);
	let textModel = modelService.getModel(resource);
	let textModelReference: IDisposable | undefined;
	if (!textModel) {
		const textModelService = accessor.get(ITextModelService);
		const result = await textModelService.createModelReference(resource);
		textModel = result.object.textEditorModel;
		textModelReference = result;
	}

	try {
		const model = await TypeHierarchyModel.create(textModel, position, CancellationToken.None);
		if (!model) {
			return [];
		}

		_models.forEach((value, key, map) => {
			if (map.size > 10) {
				value.dispose();
				_models.delete(key);
			}
		});

		for (const root of model.roots) {
			_models.set(root._sessionId, model);
		}

		return model.roots;

	} finally {
		textModelReference?.dispose();
	}
});

function isTypeHierarchyItemDto(obj: unknown): obj is TypeHierarchyItem {
	const item = obj as TypeHierarchyItem;
	return typeof obj === 'object'
		&& typeof item.name === 'string'
		&& typeof item.kind === 'number'
		&& URI.isUri(item.uri)
		&& Range.isIRange(item.range)
		&& Range.isIRange(item.selectionRange);
}

CommandsRegistry.registerCommand('_executeProvideSupertypes', async (_accessor, ...args) => {
	const [item] = args;
	assertType(isTypeHierarchyItemDto(item));

	// find model
	const model = _models.get(item._sessionId);
	if (!model) {
		return [];
	}

	return model.provideSupertypes(item, CancellationToken.None);
});

CommandsRegistry.registerCommand('_executeProvideSubtypes', async (_accessor, ...args) => {
	const [item] = args;
	assertType(isTypeHierarchyItemDto(item));

	// find model
	const model = _models.get(item._sessionId);
	if (!model) {
		return [];
	}

	return model.provideSubtypes(item, CancellationToken.None);
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/update/browser/releaseNotesEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/update/browser/releaseNotesEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/releasenoteseditor.css';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { escapeMarkdownSyntaxTokens } from '../../../../base/common/htmlContent.js';
import { KeybindingParser } from '../../../../base/common/keybindingParser.js';
import { escape } from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { TokenizationRegistry } from '../../../../editor/common/languages.js';
import { generateTokensCSSForColorMap } from '../../../../editor/common/languages/supports/tokenization.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import * as nls from '../../../../nls.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { asTextOrError, IRequestService } from '../../../../platform/request/common/request.js';
import { DEFAULT_MARKDOWN_STYLES, renderMarkdownDocument } from '../../markdown/browser/markdownDocumentRenderer.js';
import { WebviewInput } from '../../webviewPanel/browser/webviewEditorInput.js';
import { IWebviewWorkbenchService } from '../../webviewPanel/browser/webviewWorkbenchService.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { ACTIVE_GROUP, IEditorService } from '../../../services/editor/common/editorService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { getTelemetryLevel, supportsTelemetry } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { IConfigurationChangeEvent, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { TelemetryLevel } from '../../../../platform/telemetry/common/telemetry.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { SimpleSettingRenderer } from '../../markdown/browser/markdownSettingRenderer.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Schemas } from '../../../../base/common/network.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { dirname } from '../../../../base/common/resources.js';
import { asWebviewUri } from '../../webview/common/webview.js';

export class ReleaseNotesManager extends Disposable {
	private readonly _simpleSettingRenderer: SimpleSettingRenderer;
	private readonly _releaseNotesCache = new Map<string, Promise<string>>();

	private _currentReleaseNotes: WebviewInput | undefined = undefined;
	private _lastMeta: { text: string; base: URI } | undefined;

	constructor(
		@IEnvironmentService private readonly _environmentService: IEnvironmentService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@IOpenerService private readonly _openerService: IOpenerService,
		@IRequestService private readonly _requestService: IRequestService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IEditorService private readonly _editorService: IEditorService,
		@IEditorGroupsService private readonly _editorGroupService: IEditorGroupsService,
		@ICodeEditorService private readonly _codeEditorService: ICodeEditorService,
		@IWebviewWorkbenchService private readonly _webviewWorkbenchService: IWebviewWorkbenchService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IProductService private readonly _productService: IProductService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();

		this._register(TokenizationRegistry.onDidChange(() => {
			return this.updateHtml();
		}));

		this._register(_configurationService.onDidChangeConfiguration((e) => this.onDidChangeConfiguration(e)));
		this._register(_webviewWorkbenchService.onDidChangeActiveWebviewEditor((e) => this.onDidChangeActiveWebviewEditor(e)));
		this._simpleSettingRenderer = this._instantiationService.createInstance(SimpleSettingRenderer);
	}

	private async updateHtml() {
		if (!this._currentReleaseNotes || !this._lastMeta) {
			return;
		}
		const html = await this.renderBody(this._lastMeta);
		if (this._currentReleaseNotes) {
			this._currentReleaseNotes.webview.setHtml(html);
		}
	}

	private async getBase(useCurrentFile: boolean) {
		if (useCurrentFile) {
			const currentFileUri = this._codeEditorService.getActiveCodeEditor()?.getModel()?.uri;
			if (currentFileUri) {
				return dirname(currentFileUri);
			}
		}
		return URI.parse('https://code.visualstudio.com/raw');
	}

	public async show(version: string, useCurrentFile: boolean): Promise<boolean> {
		const releaseNoteText = await this.loadReleaseNotes(version, useCurrentFile);
		const base = await this.getBase(useCurrentFile);
		this._lastMeta = { text: releaseNoteText, base };
		const html = await this.renderBody(this._lastMeta);
		const title = nls.localize('releaseNotesInputName', "Release Notes: {0}", version);

		const activeEditorPane = this._editorService.activeEditorPane;
		if (this._currentReleaseNotes) {
			this._currentReleaseNotes.setWebviewTitle(title);
			this._currentReleaseNotes.webview.setHtml(html);
			this._webviewWorkbenchService.revealWebview(this._currentReleaseNotes, activeEditorPane ? activeEditorPane.group : this._editorGroupService.activeGroup, false);
		} else {
			this._currentReleaseNotes = this._webviewWorkbenchService.openWebview(
				{
					title,
					options: {
						tryRestoreScrollPosition: true,
						enableFindWidget: true,
						disableServiceWorker: useCurrentFile ? false : true,
					},
					contentOptions: {
						localResourceRoots: useCurrentFile ? [base] : [],
						allowScripts: true
					},
					extension: undefined
				},
				'releaseNotes',
				title,
				undefined,
				{ group: ACTIVE_GROUP, preserveFocus: false });

			const disposables = new DisposableStore();

			disposables.add(this._currentReleaseNotes.webview.onDidClickLink(uri => this.onDidClickLink(URI.parse(uri))));

			disposables.add(this._currentReleaseNotes.webview.onMessage(e => {
				if (e.message.type === 'showReleaseNotes') {
					this._configurationService.updateValue('update.showReleaseNotes', e.message.value);
				} else if (e.message.type === 'clickSetting') {
					const x = this._currentReleaseNotes?.webview.container.offsetLeft + e.message.value.x;
					const y = this._currentReleaseNotes?.webview.container.offsetTop + e.message.value.y;
					this._simpleSettingRenderer.updateSetting(URI.parse(e.message.value.uri), x, y);
				}
			}));

			disposables.add(this._currentReleaseNotes.onWillDispose(() => {
				disposables.dispose();
				this._currentReleaseNotes = undefined;
			}));

			this._currentReleaseNotes.webview.setHtml(html);
		}

		return true;
	}

	private async loadReleaseNotes(version: string, useCurrentFile: boolean): Promise<string> {
		const match = /^(\d+\.\d+)\./.exec(version);
		if (!match) {
			throw new Error('not found');
		}

		const versionLabel = match[1].replace(/\./g, '_');
		const baseUrl = 'https://code.visualstudio.com/raw';
		const url = `${baseUrl}/v${versionLabel}.md`;
		const unassigned = nls.localize('unassigned', "unassigned");

		const escapeMdHtml = (text: string): string => {
			return escape(text).replace(/\\/g, '\\\\');
		};

		const patchKeybindings = (text: string): string => {
			const kb = (match: string, kb: string) => {
				const keybinding = this._keybindingService.lookupKeybinding(kb);

				if (!keybinding) {
					return unassigned;
				}

				return keybinding.getLabel() || unassigned;
			};

			const kbstyle = (match: string, kb: string) => {
				const keybinding = KeybindingParser.parseKeybinding(kb);

				if (!keybinding) {
					return unassigned;
				}

				const resolvedKeybindings = this._keybindingService.resolveKeybinding(keybinding);

				if (resolvedKeybindings.length === 0) {
					return unassigned;
				}

				return resolvedKeybindings[0].getLabel() || unassigned;
			};

			const kbCode = (match: string, binding: string) => {
				const resolved = kb(match, binding);
				return resolved ? `<code title="${binding}">${escapeMdHtml(resolved)}</code>` : resolved;
			};

			const kbstyleCode = (match: string, binding: string) => {
				const resolved = kbstyle(match, binding);
				return resolved ? `<code title="${binding}">${escapeMdHtml(resolved)}</code>` : resolved;
			};

			return text
				.replace(/`kb\(([a-z.\d\-]+)\)`/gi, kbCode)
				.replace(/`kbstyle\(([^\)]+)\)`/gi, kbstyleCode)
				.replace(/kb\(([a-z.\d\-]+)\)/gi, (match, binding) => escapeMarkdownSyntaxTokens(kb(match, binding)))
				.replace(/kbstyle\(([^\)]+)\)/gi, (match, binding) => escapeMarkdownSyntaxTokens(kbstyle(match, binding)));
		};

		const fetchReleaseNotes = async () => {
			let text;
			try {
				if (useCurrentFile) {
					const file = this._codeEditorService.getActiveCodeEditor()?.getModel()?.getValue();
					text = file ? file.substring(file.indexOf('#')) : undefined;
				} else {
					text = await asTextOrError(await this._requestService.request({ url }, CancellationToken.None));
				}
			} catch {
				throw new Error('Failed to fetch release notes');
			}

			if (!text || (!/^#\s/.test(text) && !useCurrentFile)) { // release notes always starts with `#` followed by whitespace, except when using the current file
				throw new Error('Invalid release notes');
			}

			return patchKeybindings(text);
		};

		// Don't cache the current file
		if (useCurrentFile) {
			return fetchReleaseNotes();
		}
		if (!this._releaseNotesCache.has(version)) {
			this._releaseNotesCache.set(version, (async () => {
				try {
					return await fetchReleaseNotes();
				} catch (err) {
					this._releaseNotesCache.delete(version);
					throw err;
				}
			})());
		}

		return this._releaseNotesCache.get(version)!;
	}

	private async onDidClickLink(uri: URI) {
		if (uri.scheme === Schemas.codeSetting) {
			// handled in receive message
		} else {
			this.addGAParameters(uri, 'ReleaseNotes')
				.then(updated => this._openerService.open(updated, { allowCommands: ['workbench.action.openSettings', 'summarize.release.notes'] }))
				.then(undefined, onUnexpectedError);
		}
	}

	private async addGAParameters(uri: URI, origin: string, experiment = '1'): Promise<URI> {
		if (supportsTelemetry(this._productService, this._environmentService) && getTelemetryLevel(this._configurationService) === TelemetryLevel.USAGE) {
			if (uri.scheme === 'https' && uri.authority === 'code.visualstudio.com') {
				return uri.with({ query: `${uri.query ? uri.query + '&' : ''}utm_source=VsCode&utm_medium=${encodeURIComponent(origin)}&utm_content=${encodeURIComponent(experiment)}` });
			}
		}
		return uri;
	}

	private async renderBody(fileContent: { text: string; base: URI }) {
		const nonce = generateUuid();

		const processedContent = await renderReleaseNotesMarkdown(fileContent.text, this._extensionService, this._languageService, this._simpleSettingRenderer);

		const colorMap = TokenizationRegistry.getColorMap();
		const css = colorMap ? generateTokensCSSForColorMap(colorMap) : '';
		const showReleaseNotes = Boolean(this._configurationService.getValue<boolean>('update.showReleaseNotes'));

		return `<!DOCTYPE html>
		<html>
			<head>
				<base href="${asWebviewUri(fileContent.base).toString(true)}/" >
				<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https: data:; media-src https:; style-src 'nonce-${nonce}' https://code.visualstudio.com; script-src 'nonce-${nonce}';">
				<style nonce="${nonce}">
					${DEFAULT_MARKDOWN_STYLES}
					${css}

					/* codesetting */

					code:has(.codesetting) {
						background-color: var(--vscode-textPreformat-background);
						color: var(--vscode-textPreformat-foreground);
						padding-left: 1px;
						margin-right: 3px;
						padding-right: 0px;
					}

					code:has(.codesetting):focus {
						border: 1px solid var(--vscode-button-border, transparent);
					}

					.codesetting {
						color: var(--vscode-textPreformat-foreground);
						padding: 0px 1px 1px 0px;
						font-size: 0px;
						overflow: hidden;
						text-overflow: ellipsis;
						outline-offset: 2px !important;
						box-sizing: border-box;
						text-align: center;
						cursor: pointer;
						display: inline;
						margin-right: 3px;
					}
					.codesetting svg {
						font-size: 12px;
						text-align: center;
						cursor: pointer;
						border: 1px solid var(--vscode-button-secondaryBorder, transparent);
						outline: 1px solid transparent;
						line-height: 9px;
						margin-bottom: -5px;
						padding-left: 0px;
						padding-top: 2px;
						padding-bottom: 2px;
						padding-right: 2px;
						display: inline-block;
						text-decoration: none;
						text-rendering: auto;
						text-transform: none;
						-webkit-font-smoothing: antialiased;
						-moz-osx-font-smoothing: grayscale;
						user-select: none;
						-webkit-user-select: none;
					}
					.codesetting .setting-name {
						font-size: 13px;
						padding-left: 2px;
						padding-right: 3px;
						padding-top: 1px;
						padding-bottom: 1px;
						margin-top: -3px;
					}
					.codesetting:hover {
						color: var(--vscode-textPreformat-foreground) !important;
						text-decoration: none !important;
					}
					code:has(.codesetting):hover {
						filter: brightness(140%);
						text-decoration: none !important;
					}
					.codesetting:focus {
						outline: 0 !important;
						text-decoration: none !important;
						color: var(--vscode-button-hoverForeground) !important;
					}
					.codesetting .separator {
						width: 1px;
						height: 14px;
						margin-bottom: -3px;
						display: inline-block;
						background-color: var(--vscode-editor-background);
						font-size: 12px;
						margin-right: 4px;
					}

					header { display: flex; align-items: center; padding-top: 1em; }

					/* Release notes enhancements from vscode-docs */
					html {
						font-size: 10px;
						height: 100%;
						overscroll-behavior: none;
					}

					body {
						margin: 0 auto;
						max-width: 980px;
						height: auto;
						overflow-y: auto;
						overscroll-behavior: none;
					}

					/* Scroll to top button */
					#scroll-to-top {
						position: fixed;
						width: 40px;
						height: 40px;
						right: 25px;
						bottom: 25px;
						background-color: var(--vscode-button-background, #444);
						border-color: var(--vscode-button-border);
						border-radius: 50%;
						cursor: pointer;
						box-shadow: 1px 1px 1px rgba(0,0,0,.25);
						outline: none;
						display: flex;
						justify-content: center;
						align-items: center;
					}

					#scroll-to-top:hover {
						background-color: var(--vscode-button-hoverBackground);
						box-shadow: 2px 2px 2px rgba(0,0,0,.25);
					}

					body.vscode-high-contrast #scroll-to-top {
						border-width: 2px;
						border-style: solid;
						box-shadow: none;
					}

					#scroll-to-top span.icon::before {
						content: "";
						display: block;
						background: var(--vscode-button-foreground);
						/* Chevron up icon */
						-webkit-mask-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxNiAxNiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTYgMTY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO30KCS5zdDF7ZmlsbDpub25lO30KPC9zdHlsZT4KPHRpdGxlPnVwY2hldnJvbjwvdGl0bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik04LDUuMWwtNy4zLDcuM0wwLDExLjZsOC04bDgsOGwtMC43LDAuN0w4LDUuMXoiLz4KPHJlY3QgY2xhc3M9InN0MSIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+Cjwvc3ZnPgo=');
						mask-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxNiAxNiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTYgMTY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO30KCS5zdDF7ZmlsbDpub25lO30KPC9zdHlsZT4KPHRpdGxlPnVwY2hldnJvbjwvdGl0bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik04LDUuMWwtNy4zLDcuM0wwLDExLjZsOC04bDgsOGwtMC43LDAuN0w4LDUuMXoiLz4KPHJlY3QgY2xhc3M9InN0MSIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+Cjwvc3ZnPgo=');
						width: 16px;
						height: 16px;
					}

					/* Header styling */
					h2 {
						margin-top: 1.2em;
						scroll-margin-top: 1.2em;
					}

					h2:not(:first-of-type) {
						margin-top: 4em;
						scroll-margin-top: 1em;
					}

					h3 {
						margin-top: 4em;
						scroll-margin-top: 1em;
					}

					h2 + h3 {
						margin-top: 0;
					}

					/* Highlights table styling */
					.highlights-table {
						border-collapse: collapse;
						border: none;
					}

					.highlights-table th {
						vertical-align: top;
						border: none;
						padding-top: 2em;
						font-weight: bold;
					}

					.highlights-table td {
						vertical-align: top;
						border: none;
					}

					.highlights-table tr:nth-child(2) td {
						padding-bottom: 1em;
					}

					/* Main content layout */
					.toc-nav-layout {
						display: flex;
						align-items: flex-start;
					}

					/* TOC Navigation */
					#toc-nav {
						position: sticky;
						top: 20px;
						width: 10vw;
						min-width: 120px;
						margin-right: 32px;
						margin-top: 2em;
					}

					#toc-nav > div {
						font-weight: bold;
						font-size: 1em;
						margin-bottom: 1em;
						text-transform: uppercase;
					}

					#toc-nav ul {
						list-style: none;
						padding: 0;
						margin: 0;
					}

					#toc-nav ul li {
						margin-bottom: 0.5em;
					}

					#toc-nav a {
						color: var(--vscode-editor-foreground, #ccc);
						text-decoration: none !important;
						transition: background-color 0.2s, color 0.2s;
						padding: 4px 6px;
						margin: -4px -6px;
						border-radius: 4px;
						display: block;
						outline: none;
					}

					#toc-nav a:hover {
						background-color: var(--vscode-button-secondaryHoverBackground, #1177bb);
						color: var(--vscode-button-secondaryForeground, #ffffff);
						cursor: pointer;
						text-decoration: none !important;
					}

					/* Main content area */
					.notes-main {
						flex: 1;
						min-width: 0;
					}

					/* Responsive breakpoint - Hide TOC on smaller screens */
					@media (max-width: 576px) {
						#toc-nav {
							display: none;
						}

						.toc-nav-layout {
							flex-direction: column;
						}

						.notes-main {
							margin-left: 0;
						}
					}
				</style>
			</head>
			<body>
				${processedContent}
				<script nonce="${nonce}">
					const vscode = acquireVsCodeApi();
					const container = document.createElement('p');
					container.style.display = 'flex';
					container.style.alignItems = 'center';

					const input = document.createElement('input');
					input.type = 'checkbox';
					input.id = 'showReleaseNotes';
					input.checked = ${showReleaseNotes};
					container.appendChild(input);

					const label = document.createElement('label');
					label.htmlFor = 'showReleaseNotes';
					label.textContent = '${nls.localize('showOnUpdate', "Show release notes after an update")}';
					container.appendChild(label);

					const beforeElement = document.querySelector("body > h1")?.nextElementSibling;
					if (beforeElement) {
						document.body.insertBefore(container, beforeElement);
					} else {
						document.body.appendChild(container);
					}

					window.addEventListener('message', event => {
						if (event.data.type === 'showReleaseNotes') {
							input.checked = event.data.value;
						}
					});

					window.addEventListener('click', event => {
						const href = event.target.href ?? event.target.parentElement?.href ?? event.target.parentElement?.parentElement?.href;
						if (href && (href.startsWith('${Schemas.codeSetting}'))) {
							vscode.postMessage({ type: 'clickSetting', value: { uri: href, x: event.clientX, y: event.clientY }});
						}
					});

					window.addEventListener('keypress', event => {
						if (event.keyCode === 13) {
							if (event.target.children.length > 0 && event.target.children[0].href) {
								const clientRect = event.target.getBoundingClientRect();
								vscode.postMessage({ type: 'clickSetting', value: { uri: event.target.children[0].href, x: clientRect.right , y: clientRect.bottom }});
							}
						}
					});

					input.addEventListener('change', event => {
						vscode.postMessage({ type: 'showReleaseNotes', value: input.checked }, '*');
					});
				</script>
			</body>
		</html>`;
	}

	private onDidChangeConfiguration(e: IConfigurationChangeEvent): void {
		if (e.affectsConfiguration('update.showReleaseNotes')) {
			this.updateCheckboxWebview();
		}
	}

	private onDidChangeActiveWebviewEditor(input: WebviewInput | undefined): void {
		if (input && input === this._currentReleaseNotes) {
			this.updateCheckboxWebview();
		}
	}

	private updateCheckboxWebview() {
		if (this._currentReleaseNotes) {
			this._currentReleaseNotes.webview.postMessage({
				type: 'showReleaseNotes',
				value: this._configurationService.getValue<boolean>('update.showReleaseNotes')
			});
		}
	}
}

export async function renderReleaseNotesMarkdown(
	text: string,
	extensionService: IExtensionService,
	languageService: ILanguageService,
	simpleSettingRenderer: SimpleSettingRenderer,
): Promise<TrustedHTML> {
	// Remove HTML comment markers around table of contents navigation
	text = text
		.toString()
		.replace(/<!--\s*TOC\s*/gi, '')
		.replace(/\s*Navigation End\s*-->/gi, '');

	return renderMarkdownDocument(text, extensionService, languageService, {
		sanitizerConfig: {
			allowRelativeMediaPaths: true,
			allowedLinkProtocols: {
				override: [Schemas.http, Schemas.https, Schemas.command, Schemas.codeSetting]
			},
			allowedTags: { augment: ['nav', 'svg', 'path'] },
			allowedAttributes: { augment: ['aria-role', 'viewBox', 'fill', 'xmlns', 'd'] }
		},
		markedExtensions: [{
			renderer: {
				html: simpleSettingRenderer.getHtmlRenderer(),
				codespan: simpleSettingRenderer.getCodeSpanRenderer(),
			}
		}]
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/update/browser/update.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/update/browser/update.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import '../../../../platform/update/common/update.config.contribution.js';
import { localize, localize2 } from '../../../../nls.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { MenuId, registerAction2, Action2 } from '../../../../platform/actions/common/actions.js';
import { ProductContribution, UpdateContribution, CONTEXT_UPDATE_STATE, SwitchProductQualityContribution, RELEASE_NOTES_URL, showReleaseNotesInEditor, DOWNLOAD_URL } from './update.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import product from '../../../../platform/product/common/product.js';
import { IUpdateService, StateType } from '../../../../platform/update/common/update.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { isWindows } from '../../../../base/common/platform.js';
import { IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { mnemonicButtonLabel } from '../../../../base/common/labels.js';
import { ShowCurrentReleaseNotesActionId, ShowCurrentReleaseNotesFromCurrentFileActionId } from '../common/update.js';
import { IsWebContext } from '../../../../platform/contextkey/common/contextkeys.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { URI } from '../../../../base/common/uri.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';

const workbench = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);

workbench.registerWorkbenchContribution(ProductContribution, LifecyclePhase.Restored);
workbench.registerWorkbenchContribution(UpdateContribution, LifecyclePhase.Restored);
workbench.registerWorkbenchContribution(SwitchProductQualityContribution, LifecyclePhase.Restored);

// Release notes

export class ShowCurrentReleaseNotesAction extends Action2 {

	constructor() {
		super({
			id: ShowCurrentReleaseNotesActionId,
			title: {
				...localize2('showReleaseNotes', "Show Release Notes"),
				mnemonicTitle: localize({ key: 'mshowReleaseNotes', comment: ['&& denotes a mnemonic'] }, "Show &&Release Notes"),
			},
			category: { value: product.nameShort, original: product.nameShort },
			f1: true,
			precondition: RELEASE_NOTES_URL,
			menu: [{
				id: MenuId.MenubarHelpMenu,
				group: '1_welcome',
				order: 5,
				when: RELEASE_NOTES_URL,
			}]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const instantiationService = accessor.get(IInstantiationService);
		const productService = accessor.get(IProductService);
		const openerService = accessor.get(IOpenerService);

		try {
			await showReleaseNotesInEditor(instantiationService, productService.version, false);
		} catch (err) {
			if (productService.releaseNotesUrl) {
				await openerService.open(URI.parse(productService.releaseNotesUrl));
			} else {
				throw new Error(localize('update.noReleaseNotesOnline', "This version of {0} does not have release notes online", productService.nameLong));
			}
		}
	}
}

export class ShowCurrentReleaseNotesFromCurrentFileAction extends Action2 {

	constructor() {
		super({
			id: ShowCurrentReleaseNotesFromCurrentFileActionId,
			title: {
				...localize2('showReleaseNotesCurrentFile', "Open Current File as Release Notes"),
				mnemonicTitle: localize({ key: 'mshowReleaseNotes', comment: ['&& denotes a mnemonic'] }, "Show &&Release Notes"),
			},
			category: localize2('developerCategory', "Developer"),
			f1: true,
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const instantiationService = accessor.get(IInstantiationService);
		const productService = accessor.get(IProductService);

		try {
			await showReleaseNotesInEditor(instantiationService, productService.version, true);
		} catch (err) {
			throw new Error(localize('releaseNotesFromFileNone', "Cannot open the current file as Release Notes"));
		}
	}
}

registerAction2(ShowCurrentReleaseNotesAction);
registerAction2(ShowCurrentReleaseNotesFromCurrentFileAction);

// Update

export class CheckForUpdateAction extends Action2 {

	constructor() {
		super({
			id: 'update.checkForUpdate',
			title: localize2('checkForUpdates', 'Check for Updates...'),
			category: { value: product.nameShort, original: product.nameShort },
			f1: true,
			precondition: CONTEXT_UPDATE_STATE.isEqualTo(StateType.Idle),
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const updateService = accessor.get(IUpdateService);
		return updateService.checkForUpdates(true);
	}
}

class DownloadUpdateAction extends Action2 {
	constructor() {
		super({
			id: 'update.downloadUpdate',
			title: localize2('downloadUpdate', 'Download Update'),
			category: { value: product.nameShort, original: product.nameShort },
			f1: true,
			precondition: CONTEXT_UPDATE_STATE.isEqualTo(StateType.AvailableForDownload)
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		await accessor.get(IUpdateService).downloadUpdate();
	}
}

class InstallUpdateAction extends Action2 {
	constructor() {
		super({
			id: 'update.installUpdate',
			title: localize2('installUpdate', 'Install Update'),
			category: { value: product.nameShort, original: product.nameShort },
			f1: true,
			precondition: CONTEXT_UPDATE_STATE.isEqualTo(StateType.Downloaded)
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		await accessor.get(IUpdateService).applyUpdate();
	}
}

class RestartToUpdateAction extends Action2 {
	constructor() {
		super({
			id: 'update.restartToUpdate',
			title: localize2('restartToUpdate', 'Restart to Update'),
			category: { value: product.nameShort, original: product.nameShort },
			f1: true,
			precondition: CONTEXT_UPDATE_STATE.isEqualTo(StateType.Ready)
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		await accessor.get(IUpdateService).quitAndInstall();
	}
}

class DownloadAction extends Action2 {

	static readonly ID = 'workbench.action.download';

	constructor() {
		super({
			id: DownloadAction.ID,
			title: localize2('openDownloadPage', "Download {0}", product.nameLong),
			precondition: ContextKeyExpr.and(IsWebContext, DOWNLOAD_URL), // Only show when running in a web browser and a download url is available
			f1: true,
			menu: [{
				id: MenuId.StatusBarWindowIndicatorMenu,
				when: ContextKeyExpr.and(IsWebContext, DOWNLOAD_URL)
			}]
		});
	}

	run(accessor: ServicesAccessor): void {
		const productService = accessor.get(IProductService);
		const openerService = accessor.get(IOpenerService);

		if (productService.downloadUrl) {
			openerService.open(URI.parse(productService.downloadUrl));
		}
	}
}

registerAction2(DownloadAction);
registerAction2(CheckForUpdateAction);
registerAction2(DownloadUpdateAction);
registerAction2(InstallUpdateAction);
registerAction2(RestartToUpdateAction);

if (isWindows) {
	class DeveloperApplyUpdateAction extends Action2 {
		constructor() {
			super({
				id: '_update.applyupdate',
				title: localize2('applyUpdate', 'Apply Update...'),
				category: Categories.Developer,
				f1: true,
				precondition: CONTEXT_UPDATE_STATE.isEqualTo(StateType.Idle)
			});
		}

		async run(accessor: ServicesAccessor): Promise<void> {
			const updateService = accessor.get(IUpdateService);
			const fileDialogService = accessor.get(IFileDialogService);

			const updatePath = await fileDialogService.showOpenDialog({
				title: localize('pickUpdate', "Apply Update"),
				filters: [{ name: 'Setup', extensions: ['exe'] }],
				canSelectFiles: true,
				openLabel: mnemonicButtonLabel(localize({ key: 'updateButton', comment: ['&& denotes a mnemonic'] }, "&&Update"))
			});

			if (!updatePath || !updatePath[0]) {
				return;
			}

			await updateService._applySpecificUpdate(updatePath[0].fsPath);
		}
	}

	registerAction2(DeveloperApplyUpdateAction);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/update/browser/update.ts]---
Location: vscode-main/src/vs/workbench/contrib/update/browser/update.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import severity from '../../../../base/common/severity.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IActivityService, NumberBadge, IBadge, ProgressBadge } from '../../../services/activity/common/activity.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IUpdateService, State as UpdateState, StateType, IUpdate, DisablementReason } from '../../../../platform/update/common/update.js';
import { INotificationService, NotificationPriority, Severity } from '../../../../platform/notification/common/notification.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IBrowserWorkbenchEnvironmentService } from '../../../services/environment/browser/environmentService.js';
import { ReleaseNotesManager } from './releaseNotesEditor.js';
import { isMacintosh, isWeb, isWindows } from '../../../../base/common/platform.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { RawContextKey, IContextKey, IContextKeyService, ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { MenuRegistry, MenuId, registerAction2, Action2 } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IUserDataSyncEnablementService, IUserDataSyncService, IUserDataSyncStoreManagementService, SyncStatus, UserDataSyncStoreType } from '../../../../platform/userDataSync/common/userDataSync.js';
import { IsWebContext } from '../../../../platform/contextkey/common/contextkeys.js';
import { Promises } from '../../../../base/common/async.js';
import { IUserDataSyncWorkbenchService } from '../../../services/userDataSync/common/userDataSync.js';
import { Event } from '../../../../base/common/event.js';
import { toAction } from '../../../../base/common/actions.js';

export const CONTEXT_UPDATE_STATE = new RawContextKey<string>('updateState', StateType.Uninitialized);
export const MAJOR_MINOR_UPDATE_AVAILABLE = new RawContextKey<boolean>('majorMinorUpdateAvailable', false);
export const RELEASE_NOTES_URL = new RawContextKey<string>('releaseNotesUrl', '');
export const DOWNLOAD_URL = new RawContextKey<string>('downloadUrl', '');

let releaseNotesManager: ReleaseNotesManager | undefined = undefined;

export function showReleaseNotesInEditor(instantiationService: IInstantiationService, version: string, useCurrentFile: boolean) {
	if (!releaseNotesManager) {
		releaseNotesManager = instantiationService.createInstance(ReleaseNotesManager);
	}

	return releaseNotesManager.show(version, useCurrentFile);
}

async function openLatestReleaseNotesInBrowser(accessor: ServicesAccessor) {
	const openerService = accessor.get(IOpenerService);
	const productService = accessor.get(IProductService);

	if (productService.releaseNotesUrl) {
		const uri = URI.parse(productService.releaseNotesUrl);
		await openerService.open(uri);
	} else {
		throw new Error(nls.localize('update.noReleaseNotesOnline', "This version of {0} does not have release notes online", productService.nameLong));
	}
}

async function showReleaseNotes(accessor: ServicesAccessor, version: string) {
	const instantiationService = accessor.get(IInstantiationService);
	try {
		await showReleaseNotesInEditor(instantiationService, version, false);
	} catch (err) {
		try {
			await instantiationService.invokeFunction(openLatestReleaseNotesInBrowser);
		} catch (err2) {
			throw new Error(`${err.message} and ${err2.message}`);
		}
	}
}

interface IVersion {
	major: number;
	minor: number;
	patch: number;
}

function parseVersion(version: string): IVersion | undefined {
	const match = /([0-9]+)\.([0-9]+)\.([0-9]+)/.exec(version);

	if (!match) {
		return undefined;
	}

	return {
		major: parseInt(match[1]),
		minor: parseInt(match[2]),
		patch: parseInt(match[3])
	};
}

function isMajorMinorUpdate(before: IVersion, after: IVersion): boolean {
	return before.major < after.major || before.minor < after.minor;
}

export class ProductContribution implements IWorkbenchContribution {

	private static readonly KEY = 'releaseNotes/lastVersion';

	constructor(
		@IStorageService storageService: IStorageService,
		@IInstantiationService instantiationService: IInstantiationService,
		@INotificationService notificationService: INotificationService,
		@IBrowserWorkbenchEnvironmentService environmentService: IBrowserWorkbenchEnvironmentService,
		@IOpenerService openerService: IOpenerService,
		@IConfigurationService configurationService: IConfigurationService,
		@IHostService hostService: IHostService,
		@IProductService productService: IProductService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		if (productService.releaseNotesUrl) {
			const releaseNotesUrlKey = RELEASE_NOTES_URL.bindTo(contextKeyService);
			releaseNotesUrlKey.set(productService.releaseNotesUrl);
		}
		if (productService.downloadUrl) {
			const downloadUrlKey = DOWNLOAD_URL.bindTo(contextKeyService);
			downloadUrlKey.set(productService.downloadUrl);
		}

		if (isWeb) {
			return;
		}

		hostService.hadLastFocus().then(async hadLastFocus => {
			if (!hadLastFocus) {
				return;
			}

			const lastVersion = parseVersion(storageService.get(ProductContribution.KEY, StorageScope.APPLICATION, ''));
			const currentVersion = parseVersion(productService.version);
			const shouldShowReleaseNotes = configurationService.getValue<boolean>('update.showReleaseNotes');
			const releaseNotesUrl = productService.releaseNotesUrl;

			// was there a major/minor update? if so, open release notes
			if (shouldShowReleaseNotes && !environmentService.skipReleaseNotes && releaseNotesUrl && lastVersion && currentVersion && isMajorMinorUpdate(lastVersion, currentVersion)) {
				showReleaseNotesInEditor(instantiationService, productService.version, false)
					.then(undefined, () => {
						notificationService.prompt(
							severity.Info,
							nls.localize('read the release notes', "Welcome to {0} v{1}! Would you like to read the Release Notes?", productService.nameLong, productService.version),
							[{
								label: nls.localize('releaseNotes', "Release Notes"),
								run: () => {
									const uri = URI.parse(releaseNotesUrl);
									openerService.open(uri);
								}
							}],
							{ priority: NotificationPriority.OPTIONAL }
						);
					});
			}

			storageService.store(ProductContribution.KEY, productService.version, StorageScope.APPLICATION, StorageTarget.MACHINE);
		});
	}
}

export class UpdateContribution extends Disposable implements IWorkbenchContribution {

	private state: UpdateState;
	private readonly badgeDisposable = this._register(new MutableDisposable());
	private updateStateContextKey: IContextKey<string>;
	private majorMinorUpdateAvailableContextKey: IContextKey<boolean>;

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@INotificationService private readonly notificationService: INotificationService,
		@IDialogService private readonly dialogService: IDialogService,
		@IUpdateService private readonly updateService: IUpdateService,
		@IActivityService private readonly activityService: IActivityService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IProductService private readonly productService: IProductService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IHostService private readonly hostService: IHostService
	) {
		super();
		this.state = updateService.state;
		this.updateStateContextKey = CONTEXT_UPDATE_STATE.bindTo(this.contextKeyService);
		this.majorMinorUpdateAvailableContextKey = MAJOR_MINOR_UPDATE_AVAILABLE.bindTo(this.contextKeyService);

		this._register(updateService.onStateChange(this.onUpdateStateChange, this));
		this.onUpdateStateChange(this.updateService.state);

		/*
		The `update/lastKnownVersion` and `update/updateNotificationTime` storage keys are used in
		combination to figure out when to show a message to the user that he should update.

		This message should appear if the user has received an update notification but hasn't
		updated since 5 days.
		*/

		const currentVersion = this.productService.commit;
		const lastKnownVersion = this.storageService.get('update/lastKnownVersion', StorageScope.APPLICATION);

		// if current version != stored version, clear both fields
		if (currentVersion !== lastKnownVersion) {
			this.storageService.remove('update/lastKnownVersion', StorageScope.APPLICATION);
			this.storageService.remove('update/updateNotificationTime', StorageScope.APPLICATION);
		}

		this.registerGlobalActivityActions();
	}

	private async onUpdateStateChange(state: UpdateState): Promise<void> {
		this.updateStateContextKey.set(state.type);

		switch (state.type) {
			case StateType.Disabled:
				if (state.reason === DisablementReason.RunningAsAdmin) {
					this.notificationService.notify({
						severity: Severity.Info,
						message: nls.localize('update service disabled', "Updates are disabled because you are running the user-scope installation of {0} as Administrator.", this.productService.nameLong),
						actions: {
							primary: [
								toAction({
									id: '',
									label: nls.localize('learn more', "Learn More"),
									run: () => this.openerService.open('https://aka.ms/vscode-windows-setup')
								})
							]
						},
						neverShowAgain: { id: 'no-updates-running-as-admin', }
					});
				}
				break;

			case StateType.Idle:
				if (state.error) {
					this.onError(state.error);
				} else if (this.state.type === StateType.CheckingForUpdates && this.state.explicit && await this.hostService.hadLastFocus()) {
					this.onUpdateNotAvailable();
				}
				break;

			case StateType.AvailableForDownload:
				this.onUpdateAvailable(state.update);
				break;

			case StateType.Downloaded:
				this.onUpdateDownloaded(state.update);
				break;

			case StateType.Ready: {
				const productVersion = state.update.productVersion;
				if (productVersion) {
					const currentVersion = parseVersion(this.productService.version);
					const nextVersion = parseVersion(productVersion);
					this.majorMinorUpdateAvailableContextKey.set(Boolean(currentVersion && nextVersion && isMajorMinorUpdate(currentVersion, nextVersion)));
					this.onUpdateReady(state.update);
				}
				break;
			}
		}

		let badge: IBadge | undefined = undefined;

		if (state.type === StateType.AvailableForDownload || state.type === StateType.Downloaded || state.type === StateType.Ready) {
			badge = new NumberBadge(1, () => nls.localize('updateIsReady', "New {0} update available.", this.productService.nameShort));
		} else if (state.type === StateType.CheckingForUpdates) {
			badge = new ProgressBadge(() => nls.localize('checkingForUpdates', "Checking for {0} updates...", this.productService.nameShort));
		} else if (state.type === StateType.Downloading) {
			badge = new ProgressBadge(() => nls.localize('downloading', "Downloading {0} update...", this.productService.nameShort));
		} else if (state.type === StateType.Updating) {
			badge = new ProgressBadge(() => nls.localize('updating', "Updating {0}...", this.productService.nameShort));
		}

		this.badgeDisposable.clear();

		if (badge) {
			this.badgeDisposable.value = this.activityService.showGlobalActivity({ badge });
		}

		this.state = state;
	}

	private onError(error: string): void {
		if (/The request timed out|The network connection was lost/i.test(error)) {
			return;
		}

		error = error.replace(/See https:\/\/github\.com\/Squirrel\/Squirrel\.Mac\/issues\/182 for more information/, 'This might mean the application was put on quarantine by macOS. See [this link](https://github.com/microsoft/vscode/issues/7426#issuecomment-425093469) for more information');

		this.notificationService.notify({
			severity: Severity.Error,
			message: error,
			source: nls.localize('update service', "Update Service"),
		});
	}

	private onUpdateNotAvailable(): void {
		this.dialogService.info(nls.localize('noUpdatesAvailable', "There are currently no updates available."));
	}

	// linux
	private onUpdateAvailable(update: IUpdate): void {
		if (!this.shouldShowNotification()) {
			return;
		}

		const productVersion = update.productVersion;
		if (!productVersion) {
			return;
		}

		this.notificationService.prompt(
			severity.Info,
			nls.localize('thereIsUpdateAvailable', "There is an available update."),
			[{
				label: nls.localize('download update', "Download Update"),
				run: () => this.updateService.downloadUpdate()
			}, {
				label: nls.localize('later', "Later"),
				run: () => { }
			}, {
				label: nls.localize('releaseNotes', "Release Notes"),
				run: () => {
					this.instantiationService.invokeFunction(accessor => showReleaseNotes(accessor, productVersion));
				}
			}],
			{ priority: NotificationPriority.OPTIONAL }
		);
	}

	// windows fast updates
	private onUpdateDownloaded(update: IUpdate): void {
		if (isMacintosh) {
			return;
		}
		if (this.configurationService.getValue('update.enableWindowsBackgroundUpdates') && this.productService.target === 'user') {
			return;
		}

		if (!this.shouldShowNotification()) {
			return;
		}

		const productVersion = update.productVersion;
		if (!productVersion) {
			return;
		}

		this.notificationService.prompt(
			severity.Info,
			nls.localize('updateAvailable', "There's an update available: {0} {1}", this.productService.nameLong, productVersion),
			[{
				label: nls.localize('installUpdate', "Install Update"),
				run: () => this.updateService.applyUpdate()
			}, {
				label: nls.localize('later', "Later"),
				run: () => { }
			}, {
				label: nls.localize('releaseNotes', "Release Notes"),
				run: () => {
					this.instantiationService.invokeFunction(accessor => showReleaseNotes(accessor, productVersion));
				}
			}],
			{ priority: NotificationPriority.OPTIONAL }
		);
	}

	// windows and mac
	private onUpdateReady(update: IUpdate): void {
		if (!(isWindows && this.productService.target !== 'user') && !this.shouldShowNotification()) {
			return;
		}

		const actions = [{
			label: nls.localize('updateNow', "Update Now"),
			run: () => this.updateService.quitAndInstall()
		}, {
			label: nls.localize('later', "Later"),
			run: () => { }
		}];

		const productVersion = update.productVersion;
		if (productVersion) {
			actions.push({
				label: nls.localize('releaseNotes', "Release Notes"),
				run: () => {
					this.instantiationService.invokeFunction(accessor => showReleaseNotes(accessor, productVersion));
				}
			});
		}

		// windows user fast updates and mac
		this.notificationService.prompt(
			severity.Info,
			nls.localize('updateAvailableAfterRestart', "Restart {0} to apply the latest update.", this.productService.nameLong),
			actions,
			{
				sticky: true,
				priority: NotificationPriority.OPTIONAL
			}
		);
	}

	private shouldShowNotification(): boolean {
		const currentVersion = this.productService.commit;
		const currentMillis = new Date().getTime();
		const lastKnownVersion = this.storageService.get('update/lastKnownVersion', StorageScope.APPLICATION);

		// if version != stored version, save version and date
		if (currentVersion !== lastKnownVersion) {
			this.storageService.store('update/lastKnownVersion', currentVersion, StorageScope.APPLICATION, StorageTarget.MACHINE);
			this.storageService.store('update/updateNotificationTime', currentMillis, StorageScope.APPLICATION, StorageTarget.MACHINE);
		}

		const updateNotificationMillis = this.storageService.getNumber('update/updateNotificationTime', StorageScope.APPLICATION, currentMillis);
		const diffDays = (currentMillis - updateNotificationMillis) / (1000 * 60 * 60 * 24);

		return diffDays > 5;
	}

	private registerGlobalActivityActions(): void {
		CommandsRegistry.registerCommand('update.check', () => this.updateService.checkForUpdates(true));
		MenuRegistry.appendMenuItem(MenuId.GlobalActivity, {
			group: '7_update',
			command: {
				id: 'update.check',
				title: nls.localize('checkForUpdates', "Check for Updates...")
			},
			when: CONTEXT_UPDATE_STATE.isEqualTo(StateType.Idle)
		});

		CommandsRegistry.registerCommand('update.checking', () => { });
		MenuRegistry.appendMenuItem(MenuId.GlobalActivity, {
			group: '7_update',
			command: {
				id: 'update.checking',
				title: nls.localize('checkingForUpdates2', "Checking for Updates..."),
				precondition: ContextKeyExpr.false()
			},
			when: CONTEXT_UPDATE_STATE.isEqualTo(StateType.CheckingForUpdates)
		});

		CommandsRegistry.registerCommand('update.downloadNow', () => this.updateService.downloadUpdate());
		MenuRegistry.appendMenuItem(MenuId.GlobalActivity, {
			group: '7_update',
			command: {
				id: 'update.downloadNow',
				title: nls.localize('download update_1', "Download Update (1)")
			},
			when: CONTEXT_UPDATE_STATE.isEqualTo(StateType.AvailableForDownload)
		});

		CommandsRegistry.registerCommand('update.downloading', () => { });
		MenuRegistry.appendMenuItem(MenuId.GlobalActivity, {
			group: '7_update',
			command: {
				id: 'update.downloading',
				title: nls.localize('DownloadingUpdate', "Downloading Update..."),
				precondition: ContextKeyExpr.false()
			},
			when: CONTEXT_UPDATE_STATE.isEqualTo(StateType.Downloading)
		});

		CommandsRegistry.registerCommand('update.install', () => this.updateService.applyUpdate());
		MenuRegistry.appendMenuItem(MenuId.GlobalActivity, {
			group: '7_update',
			command: {
				id: 'update.install',
				title: nls.localize('installUpdate...', "Install Update... (1)")
			},
			when: CONTEXT_UPDATE_STATE.isEqualTo(StateType.Downloaded)
		});

		CommandsRegistry.registerCommand('update.updating', () => { });
		MenuRegistry.appendMenuItem(MenuId.GlobalActivity, {
			group: '7_update',
			command: {
				id: 'update.updating',
				title: nls.localize('installingUpdate', "Installing Update..."),
				precondition: ContextKeyExpr.false()
			},
			when: CONTEXT_UPDATE_STATE.isEqualTo(StateType.Updating)
		});

		if (this.productService.quality === 'stable') {
			CommandsRegistry.registerCommand('update.showUpdateReleaseNotes', () => {
				if (this.updateService.state.type !== StateType.Ready) {
					return;
				}

				const productVersion = this.updateService.state.update.productVersion;
				if (productVersion) {
					this.instantiationService.invokeFunction(accessor => showReleaseNotes(accessor, productVersion));
				}

			});
			MenuRegistry.appendMenuItem(MenuId.GlobalActivity, {
				group: '7_update',
				order: 1,
				command: {
					id: 'update.showUpdateReleaseNotes',
					title: nls.localize('showUpdateReleaseNotes', "Show Update Release Notes")
				},
				when: ContextKeyExpr.and(CONTEXT_UPDATE_STATE.isEqualTo(StateType.Ready), MAJOR_MINOR_UPDATE_AVAILABLE)
			});
		}

		CommandsRegistry.registerCommand('update.restart', () => this.updateService.quitAndInstall());
		MenuRegistry.appendMenuItem(MenuId.GlobalActivity, {
			group: '7_update',
			order: 2,
			command: {
				id: 'update.restart',
				title: nls.localize('restartToUpdate', "Restart to Update (1)")
			},
			when: CONTEXT_UPDATE_STATE.isEqualTo(StateType.Ready)
		});

		CommandsRegistry.registerCommand('_update.state', () => {
			return this.state;
		});
	}
}

export class SwitchProductQualityContribution extends Disposable implements IWorkbenchContribution {

	constructor(
		@IProductService private readonly productService: IProductService,
		@IBrowserWorkbenchEnvironmentService private readonly environmentService: IBrowserWorkbenchEnvironmentService
	) {
		super();

		this.registerGlobalActivityActions();
	}

	private registerGlobalActivityActions(): void {
		const quality = this.productService.quality;
		const productQualityChangeHandler = this.environmentService.options?.productQualityChangeHandler;
		if (productQualityChangeHandler && (quality === 'stable' || quality === 'insider')) {
			const newQuality = quality === 'stable' ? 'insider' : 'stable';
			const commandId = `update.switchQuality.${newQuality}`;
			const isSwitchingToInsiders = newQuality === 'insider';
			this._register(registerAction2(class SwitchQuality extends Action2 {
				constructor() {
					super({
						id: commandId,
						title: isSwitchingToInsiders ? nls.localize('switchToInsiders', "Switch to Insiders Version...") : nls.localize('switchToStable', "Switch to Stable Version..."),
						precondition: IsWebContext,
						menu: {
							id: MenuId.GlobalActivity,
							when: IsWebContext,
							group: '7_update',
						}
					});
				}

				async run(accessor: ServicesAccessor): Promise<void> {
					const dialogService = accessor.get(IDialogService);
					const userDataSyncEnablementService = accessor.get(IUserDataSyncEnablementService);
					const userDataSyncStoreManagementService = accessor.get(IUserDataSyncStoreManagementService);
					const storageService = accessor.get(IStorageService);
					const userDataSyncWorkbenchService = accessor.get(IUserDataSyncWorkbenchService);
					const userDataSyncService = accessor.get(IUserDataSyncService);
					const notificationService = accessor.get(INotificationService);

					try {
						const selectSettingsSyncServiceDialogShownKey = 'switchQuality.selectSettingsSyncServiceDialogShown';
						const userDataSyncStore = userDataSyncStoreManagementService.userDataSyncStore;
						let userDataSyncStoreType: UserDataSyncStoreType | undefined;
						if (userDataSyncStore && isSwitchingToInsiders && userDataSyncEnablementService.isEnabled()
							&& !storageService.getBoolean(selectSettingsSyncServiceDialogShownKey, StorageScope.APPLICATION, false)) {
							userDataSyncStoreType = await this.selectSettingsSyncService(dialogService);
							if (!userDataSyncStoreType) {
								return;
							}
							storageService.store(selectSettingsSyncServiceDialogShownKey, true, StorageScope.APPLICATION, StorageTarget.USER);
							if (userDataSyncStoreType === 'stable') {
								// Update the stable service type in the current window, so that it uses stable service after switched to insiders version (after reload).
								await userDataSyncStoreManagementService.switch(userDataSyncStoreType);
							}
						}

						const res = await dialogService.confirm({
							type: 'info',
							message: nls.localize('relaunchMessage', "Changing the version requires a reload to take effect"),
							detail: newQuality === 'insider' ?
								nls.localize('relaunchDetailInsiders', "Press the reload button to switch to the Insiders version of VS Code.") :
								nls.localize('relaunchDetailStable', "Press the reload button to switch to the Stable version of VS Code."),
							primaryButton: nls.localize({ key: 'reload', comment: ['&& denotes a mnemonic'] }, "&&Reload")
						});

						if (res.confirmed) {
							const promises: Promise<unknown>[] = [];

							// If sync is happening wait until it is finished before reload
							if (userDataSyncService.status === SyncStatus.Syncing) {
								promises.push(Event.toPromise(Event.filter(userDataSyncService.onDidChangeStatus, status => status !== SyncStatus.Syncing)));
							}

							// If user chose the sync service then synchronise the store type option in insiders service, so that other clients using insiders service are also updated.
							if (isSwitchingToInsiders && userDataSyncStoreType) {
								promises.push(userDataSyncWorkbenchService.synchroniseUserDataSyncStoreType());
							}

							await Promises.settled(promises);

							productQualityChangeHandler(newQuality);
						} else {
							// Reset
							if (userDataSyncStoreType) {
								storageService.remove(selectSettingsSyncServiceDialogShownKey, StorageScope.APPLICATION);
							}
						}
					} catch (error) {
						notificationService.error(error);
					}
				}

				private async selectSettingsSyncService(dialogService: IDialogService): Promise<UserDataSyncStoreType | undefined> {
					const { result } = await dialogService.prompt<UserDataSyncStoreType>({
						type: Severity.Info,
						message: nls.localize('selectSyncService.message', "Choose the settings sync service to use after changing the version"),
						detail: nls.localize('selectSyncService.detail', "The Insiders version of VS Code will synchronize your settings, keybindings, extensions, snippets and UI State using separate insiders settings sync service by default."),
						buttons: [
							{
								label: nls.localize({ key: 'use insiders', comment: ['&& denotes a mnemonic'] }, "&&Insiders"),
								run: () => 'insiders'
							},
							{
								label: nls.localize({ key: 'use stable', comment: ['&& denotes a mnemonic'] }, "&&Stable (current)"),
								run: () => 'stable'
							}
						],
						cancelButton: true
					});
					return result;
				}
			}));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/update/browser/media/releasenoteseditor.css]---
Location: vscode-main/src/vs/workbench/contrib/update/browser/media/releasenoteseditor.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.file-icons-enabled .show-file-icons .webview-vs_code_release_notes-name-file-icon.file-icon::before {
	content: ' ';
	background-image: url('../../../../browser/media/code-icon.svg');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/update/common/update.ts]---
Location: vscode-main/src/vs/workbench/contrib/update/common/update.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const ShowCurrentReleaseNotesActionId = 'update.showCurrentReleaseNotes';
export const ShowCurrentReleaseNotesFromCurrentFileActionId = 'developer.showCurrentFileAsReleaseNotes';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/update/test/browser/releaseNotesRenderer.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/update/test/browser/releaseNotesRenderer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { assertSnapshot } from '../../../../../base/test/common/snapshot.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { ContextMenuService } from '../../../../../platform/contextview/browser/contextMenuService.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';
import { SimpleSettingRenderer } from '../../../markdown/browser/markdownSettingRenderer.js';
import { IPreferencesService } from '../../../../services/preferences/common/preferences.js';
import { renderReleaseNotesMarkdown } from '../../browser/releaseNotesEditor.js';
import { URI } from '../../../../../base/common/uri.js';
import { Emitter } from '../../../../../base/common/event.js';


suite('Release notes renderer', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let extensionService: IExtensionService;
	let languageService: ILanguageService;

	setup(() => {
		instantiationService = store.add(new TestInstantiationService());
		extensionService = instantiationService.get(IExtensionService);
		languageService = instantiationService.get(ILanguageService);

		instantiationService.stub(IContextMenuService, store.add(instantiationService.createInstance(ContextMenuService)));
	});

	test('Should render TOC', async () => {
		const content = `<table class="highlights-table">
	<tr>
		<th>a</th>
	</tr>
</table>

<br>

> text

<!-- TOC
<div class="toc-nav-layout">
	<nav id="toc-nav">
		<div>In this update</div>
		<ul>
			<li><a href="#chat">test</a></li>
		</ul>
	</nav>
	<div class="notes-main">
Navigation End -->

## Test`;

		const result = await renderReleaseNotesMarkdown(content, extensionService, languageService, instantiationService.createInstance(SimpleSettingRenderer));
		await assertSnapshot(result.toString());
	});

	test('Should render code settings', async () => {
		// Stub preferences service with a known setting so the SimpleSettingRenderer treats it as valid
		const testSettingId = 'editor.wordWrap';
		instantiationService.stub(IPreferencesService, <Partial<IPreferencesService>>{
			_serviceBrand: undefined,
			onDidDefaultSettingsContentChanged: new Emitter<URI>().event,
			userSettingsResource: URI.parse('test://test'),
			workspaceSettingsResource: null,
			getFolderSettingsResource: () => null,
			createPreferencesEditorModel: async () => null,
			getDefaultSettingsContent: () => undefined,
			hasDefaultSettingsContent: () => false,
			createSettings2EditorModel: () => { throw new Error('not needed'); },
			openPreferences: async () => undefined,
			openRawDefaultSettings: async () => undefined,
			openSettings: async () => undefined,
			openApplicationSettings: async () => undefined,
			openUserSettings: async () => undefined,
			openRemoteSettings: async () => undefined,
			openWorkspaceSettings: async () => undefined,
			openFolderSettings: async () => undefined,
			openGlobalKeybindingSettings: async () => undefined,
			openDefaultKeybindingsFile: async () => undefined,
			openLanguageSpecificSettings: async () => undefined,
			getEditableSettingsURI: async () => null,
			getSetting: (id: string) => {
				if (id === testSettingId) {
					// Provide the minimal fields accessed by SimpleSettingRenderer
					return {
						key: testSettingId,
						value: 'off',
						type: 'string'
					};
				}
				return undefined;
			},
			createSplitJsonEditorInput: () => { throw new Error('not needed'); }
		});

		const content = `Here is a setting: \`setting(${testSettingId}:on)\` and another \`setting(${testSettingId}:off)\``;
		const result = await renderReleaseNotesMarkdown(content, extensionService, languageService, instantiationService.createInstance(SimpleSettingRenderer));
		await assertSnapshot(result.toString());
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/update/test/browser/__snapshots__/Release_notes_renderer_Should_render_code_settings.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/update/test/browser/__snapshots__/Release_notes_renderer_Should_render_code_settings.0.snap

```text
<p>Here is a setting: <code tabindex="0"><a href="code-setting://editor.wordWrap/on" class="codesetting" title="View or change setting" aria-role="button"><svg width="14" height="14" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M9.1 4.4L8.6 2H7.4l-.5 2.4-.7.3-2-1.3-.9.8 1.3 2-.2.7-2.4.5v1.2l2.4.5.3.8-1.3 2 .8.8 2-1.3.8.3.4 2.3h1.2l.5-2.4.8-.3 2 1.3.8-.8-1.3-2 .3-.8 2.3-.4V7.4l-2.4-.5-.3-.8 1.3-2-.8-.8-2 1.3-.7-.2zM9.4 1l.5 2.4L12 2.1l2 2-1.4 2.1 2.4.4v2.8l-2.4.5L14 12l-2 2-2.1-1.4-.5 2.4H6.6l-.5-2.4L4 13.9l-2-2 1.4-2.1L1 9.4V6.6l2.4-.5L2.1 4l2-2 2.1 1.4.4-2.4h2.8zm.6 7c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM8 9c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"></path></svg>
			<span class="separator"></span>
			<span class="setting-name">editor.wordWrap</span>
		</a></code> and another <code tabindex="0"><a href="code-setting://editor.wordWrap/off" class="codesetting" title="View or change setting" aria-role="button"><svg width="14" height="14" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M9.1 4.4L8.6 2H7.4l-.5 2.4-.7.3-2-1.3-.9.8 1.3 2-.2.7-2.4.5v1.2l2.4.5.3.8-1.3 2 .8.8 2-1.3.8.3.4 2.3h1.2l.5-2.4.8-.3 2 1.3.8-.8-1.3-2 .3-.8 2.3-.4V7.4l-2.4-.5-.3-.8 1.3-2-.8-.8-2 1.3-.7-.2zM9.4 1l.5 2.4L12 2.1l2 2-1.4 2.1 2.4.4v2.8l-2.4.5L14 12l-2 2-2.1-1.4-.5 2.4H6.6l-.5-2.4L4 13.9l-2-2 1.4-2.1L1 9.4V6.6l2.4-.5L2.1 4l2-2 2.1 1.4.4-2.4h2.8zm.6 7c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM8 9c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"></path></svg>
			<span class="separator"></span>
			<span class="setting-name">editor.wordWrap</span>
		</a></code></p>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/update/test/browser/__snapshots__/Release_notes_renderer_Should_render_TOC.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/update/test/browser/__snapshots__/Release_notes_renderer_Should_render_TOC.0.snap

```text
<table class="highlights-table">
    <tbody><tr>
        <th>a</th>
    </tr>
</tbody></table>

<br>

<blockquote>
<p>text</p>
</blockquote>
<div class="toc-nav-layout">
    <nav id="toc-nav">
        <div>In this update</div>
        <ul>
            <li><a href="#chat">test</a></li>
        </ul>
    </nav>
    <div class="notes-main">

<h2 id="test">Test</h2>
</div></div>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/url/browser/externalUriResolver.ts]---
Location: vscode-main/src/vs/workbench/contrib/url/browser/externalUriResolver.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IBrowserWorkbenchEnvironmentService } from '../../../services/environment/browser/environmentService.js';

export class ExternalUriResolverContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.externalUriResolver';

	constructor(
		@IOpenerService _openerService: IOpenerService,
		@IBrowserWorkbenchEnvironmentService _workbenchEnvironmentService: IBrowserWorkbenchEnvironmentService,
	) {
		super();

		if (_workbenchEnvironmentService.options?.resolveExternalUri) {
			this._register(_openerService.registerExternalUriResolver({
				resolveExternalUri: async (resource) => {
					return {
						resolved: await _workbenchEnvironmentService.options!.resolveExternalUri!(resource),
						dispose: () => {
							// TODO@mjbvz - do we need to do anything here?
						}
					};
				}
			}));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/url/browser/trustedDomains.ts]---
Location: vscode-main/src/vs/workbench/contrib/url/browser/trustedDomains.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { localize, localize2 } from '../../../../nls.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IBrowserWorkbenchEnvironmentService } from '../../../services/environment/browser/environmentService.js';

const TRUSTED_DOMAINS_URI = URI.parse('trustedDomains:/Trusted Domains');

export const TRUSTED_DOMAINS_STORAGE_KEY = 'http.linkProtectionTrustedDomains';
export const TRUSTED_DOMAINS_CONTENT_STORAGE_KEY = 'http.linkProtectionTrustedDomainsContent';

export const manageTrustedDomainSettingsCommand = {
	id: 'workbench.action.manageTrustedDomain',
	description: {
		description: localize2('trustedDomain.manageTrustedDomain', 'Manage Trusted Domains'),
		args: []
	},
	handler: async (accessor: ServicesAccessor) => {
		const editorService = accessor.get(IEditorService);
		editorService.openEditor({ resource: TRUSTED_DOMAINS_URI, languageId: 'jsonc', options: { pinned: true } });
		return;
	}
};

type ConfigureTrustedDomainsQuickPickItem = IQuickPickItem & ({ id: 'manage' } | { id: 'trust'; toTrust: string });

export async function configureOpenerTrustedDomainsHandler(
	trustedDomains: string[],
	domainToConfigure: string,
	resource: URI,
	quickInputService: IQuickInputService,
	storageService: IStorageService,
	editorService: IEditorService,
	telemetryService: ITelemetryService,
) {
	const parsedDomainToConfigure = URI.parse(domainToConfigure);
	const toplevelDomainSegements = parsedDomainToConfigure.authority.split('.');
	const domainEnd = toplevelDomainSegements.slice(toplevelDomainSegements.length - 2).join('.');
	const topLevelDomain = '*.' + domainEnd;
	const options: ConfigureTrustedDomainsQuickPickItem[] = [];

	options.push({
		type: 'item',
		label: localize('trustedDomain.trustDomain', 'Trust {0}', domainToConfigure),
		id: 'trust',
		toTrust: domainToConfigure,
		picked: true
	});

	const isIP =
		toplevelDomainSegements.length === 4 &&
		toplevelDomainSegements.every(segment =>
			Number.isInteger(+segment) || Number.isInteger(+segment.split(':')[0]));

	if (isIP) {
		if (parsedDomainToConfigure.authority.includes(':')) {
			const base = parsedDomainToConfigure.authority.split(':')[0];
			options.push({
				type: 'item',
				label: localize('trustedDomain.trustAllPorts', 'Trust {0} on all ports', base),
				toTrust: base + ':*',
				id: 'trust'
			});
		}
	} else {
		options.push({
			type: 'item',
			label: localize('trustedDomain.trustSubDomain', 'Trust {0} and all its subdomains', domainEnd),
			toTrust: topLevelDomain,
			id: 'trust'
		});
	}

	options.push({
		type: 'item',
		label: localize('trustedDomain.trustAllDomains', 'Trust all domains (disables link protection)'),
		toTrust: '*',
		id: 'trust'
	});
	options.push({
		type: 'item',
		label: localize('trustedDomain.manageTrustedDomains', 'Manage Trusted Domains'),
		id: 'manage'
	});

	const pickedResult = await quickInputService.pick<ConfigureTrustedDomainsQuickPickItem>(
		options, { activeItem: options[0] }
	);

	if (pickedResult && pickedResult.id) {
		switch (pickedResult.id) {
			case 'manage':
				await editorService.openEditor({
					resource: TRUSTED_DOMAINS_URI.with({ fragment: resource.toString() }),
					languageId: 'jsonc',
					options: { pinned: true }
				});
				return trustedDomains;
			case 'trust': {
				const itemToTrust = pickedResult.toTrust;
				if (trustedDomains.indexOf(itemToTrust) === -1) {
					storageService.remove(TRUSTED_DOMAINS_CONTENT_STORAGE_KEY, StorageScope.APPLICATION);
					storageService.store(
						TRUSTED_DOMAINS_STORAGE_KEY,
						JSON.stringify([...trustedDomains, itemToTrust]),
						StorageScope.APPLICATION,
						StorageTarget.USER
					);

					return [...trustedDomains, itemToTrust];
				}
			}
		}
	}

	return [];
}

export interface IStaticTrustedDomains {
	readonly defaultTrustedDomains: string[];
	readonly trustedDomains: string[];
}

export async function readTrustedDomains(accessor: ServicesAccessor): Promise<IStaticTrustedDomains> {
	const { defaultTrustedDomains, trustedDomains } = readStaticTrustedDomains(accessor);
	return {
		defaultTrustedDomains,
		trustedDomains,
	};
}

export function readStaticTrustedDomains(accessor: ServicesAccessor): IStaticTrustedDomains {
	const storageService = accessor.get(IStorageService);
	const productService = accessor.get(IProductService);
	const environmentService = accessor.get(IBrowserWorkbenchEnvironmentService);

	const defaultTrustedDomains = [
		...productService.linkProtectionTrustedDomains ?? [],
		...environmentService.options?.additionalTrustedDomains ?? []
	];

	let trustedDomains: string[] = [];
	try {
		const trustedDomainsSrc = storageService.get(TRUSTED_DOMAINS_STORAGE_KEY, StorageScope.APPLICATION);
		if (trustedDomainsSrc) {
			trustedDomains = JSON.parse(trustedDomainsSrc);
		}
	} catch (err) { }

	return {
		defaultTrustedDomains,
		trustedDomains,
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/url/browser/trustedDomainService.ts]---
Location: vscode-main/src/vs/workbench/contrib/url/browser/trustedDomainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WindowIdleValue } from '../../../../base/browser/dom.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IInstantiationService, createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope } from '../../../../platform/storage/common/storage.js';
import { TRUSTED_DOMAINS_STORAGE_KEY, readStaticTrustedDomains } from './trustedDomains.js';
import { isURLDomainTrusted } from '../common/trustedDomains.js';
import { Event, Emitter } from '../../../../base/common/event.js';

export const ITrustedDomainService = createDecorator<ITrustedDomainService>('ITrustedDomainService');

export interface ITrustedDomainService {
	_serviceBrand: undefined;
	readonly onDidChangeTrustedDomains: Event<void>;
	isValid(resource: URI): boolean;
}

export class TrustedDomainService extends Disposable implements ITrustedDomainService {
	_serviceBrand: undefined;

	private _staticTrustedDomainsResult!: WindowIdleValue<string[]>;

	private _onDidChangeTrustedDomains: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidChangeTrustedDomains: Event<void> = this._onDidChangeTrustedDomains.event;

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IStorageService private readonly _storageService: IStorageService,
	) {
		super();

		const initStaticDomainsResult = () => {
			return new WindowIdleValue(mainWindow, () => {
				const { defaultTrustedDomains, trustedDomains, } = this._instantiationService.invokeFunction(readStaticTrustedDomains);
				return [
					...defaultTrustedDomains,
					...trustedDomains
				];
			});
		};
		this._staticTrustedDomainsResult = initStaticDomainsResult();
		this._register(this._storageService.onDidChangeValue(StorageScope.APPLICATION, TRUSTED_DOMAINS_STORAGE_KEY, this._store)(() => {
			this._staticTrustedDomainsResult?.dispose();
			this._staticTrustedDomainsResult = initStaticDomainsResult();
			this._onDidChangeTrustedDomains.fire();
		}));
	}

	isValid(resource: URI): boolean {
		const { defaultTrustedDomains, trustedDomains, } = this._instantiationService.invokeFunction(readStaticTrustedDomains);
		const allTrustedDomains = [...defaultTrustedDomains, ...trustedDomains];

		return isURLDomainTrusted(resource, allTrustedDomains);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/url/browser/trustedDomainsFileSystemProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/url/browser/trustedDomainsFileSystemProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { parse } from '../../../../base/common/json.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IFileDeleteOptions, IFileOverwriteOptions, FileSystemProviderCapabilities, FileType, IFileWriteOptions, IFileService, IStat, IWatchOptions, IFileSystemProviderWithFileReadWriteCapability } from '../../../../platform/files/common/files.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { readTrustedDomains, TRUSTED_DOMAINS_CONTENT_STORAGE_KEY, TRUSTED_DOMAINS_STORAGE_KEY } from './trustedDomains.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';

const TRUSTED_DOMAINS_SCHEMA = 'trustedDomains';

const TRUSTED_DOMAINS_STAT: IStat = {
	type: FileType.File,
	ctime: Date.now(),
	mtime: Date.now(),
	size: 0
};

const CONFIG_HELP_TEXT_PRE = `// Links matching one or more entries in the list below can be opened without link protection.
// The following examples show what entries can look like:
// - "https://microsoft.com": Matches this specific domain using https
// - "https://microsoft.com:8080": Matches this specific domain on this port using https
// - "https://microsoft.com:*": Matches this specific domain on any port using https
// - "https://microsoft.com/foo": Matches https://microsoft.com/foo and https://microsoft.com/foo/bar,
//   but not https://microsoft.com/foobar or https://microsoft.com/bar
// - "https://*.microsoft.com": Match all domains ending in "microsoft.com" using https
// - "microsoft.com": Match this specific domain using either http or https
// - "*.microsoft.com": Match all domains ending in "microsoft.com" using either http or https
// - "http://192.168.0.1: Matches this specific IP using http
// - "http://192.168.0.*: Matches all IP's with this prefix using http
// - "*": Match all domains using either http or https
//
`;

const CONFIG_HELP_TEXT_AFTER = `//
// You can use the "Manage Trusted Domains" command to open this file.
// Save this file to apply the trusted domains rules.
`;

const CONFIG_PLACEHOLDER_TEXT = `[
	// "https://microsoft.com"
]`;

function computeTrustedDomainContent(defaultTrustedDomains: string[], trustedDomains: string[], configuring?: string) {
	let content = CONFIG_HELP_TEXT_PRE;

	if (defaultTrustedDomains.length > 0) {
		content += `// By default, VS Code trusts "localhost" as well as the following domains:\n`;
		defaultTrustedDomains.forEach(d => {
			content += `// - "${d}"\n`;
		});
	} else {
		content += `// By default, VS Code trusts "localhost".\n`;
	}

	content += CONFIG_HELP_TEXT_AFTER;

	content += configuring ? `\n// Currently configuring trust for ${configuring}\n` : '';

	if (trustedDomains.length === 0) {
		content += CONFIG_PLACEHOLDER_TEXT;
	} else {
		content += JSON.stringify(trustedDomains, null, 2);
	}

	return content;
}

export class TrustedDomainsFileSystemProvider implements IFileSystemProviderWithFileReadWriteCapability, IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.trustedDomainsFileSystemProvider';

	readonly capabilities = FileSystemProviderCapabilities.FileReadWrite;

	readonly onDidChangeCapabilities = Event.None;
	readonly onDidChangeFile = Event.None;

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IStorageService private readonly storageService: IStorageService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		this.fileService.registerProvider(TRUSTED_DOMAINS_SCHEMA, this);
	}

	stat(resource: URI): Promise<IStat> {
		return Promise.resolve(TRUSTED_DOMAINS_STAT);
	}

	async readFile(resource: URI): Promise<Uint8Array> {
		let trustedDomainsContent = this.storageService.get(
			TRUSTED_DOMAINS_CONTENT_STORAGE_KEY,
			StorageScope.APPLICATION
		);

		const configuring: string | undefined = resource.fragment;

		const { defaultTrustedDomains, trustedDomains } = await this.instantiationService.invokeFunction(readTrustedDomains);
		if (
			!trustedDomainsContent ||
			trustedDomainsContent.indexOf(CONFIG_HELP_TEXT_PRE) === -1 ||
			trustedDomainsContent.indexOf(CONFIG_HELP_TEXT_AFTER) === -1 ||
			trustedDomainsContent.indexOf(configuring ?? '') === -1 ||
			[...defaultTrustedDomains, ...trustedDomains].some(d => !assertReturnsDefined(trustedDomainsContent).includes(d))
		) {
			trustedDomainsContent = computeTrustedDomainContent(defaultTrustedDomains, trustedDomains, configuring);
		}

		const buffer = VSBuffer.fromString(trustedDomainsContent).buffer;
		return buffer;
	}

	writeFile(resource: URI, content: Uint8Array, opts: IFileWriteOptions): Promise<void> {
		try {
			const trustedDomainsContent = VSBuffer.wrap(content).toString();
			const trustedDomains = parse(trustedDomainsContent);

			this.storageService.store(TRUSTED_DOMAINS_CONTENT_STORAGE_KEY, trustedDomainsContent, StorageScope.APPLICATION, StorageTarget.USER);
			this.storageService.store(
				TRUSTED_DOMAINS_STORAGE_KEY,
				JSON.stringify(trustedDomains) || '',
				StorageScope.APPLICATION,
				StorageTarget.USER
			);
		} catch (err) { }

		return Promise.resolve();
	}

	watch(resource: URI, opts: IWatchOptions): IDisposable {
		return {
			dispose() {
				return;
			}
		};
	}
	mkdir(resource: URI): Promise<void> {
		return Promise.resolve(undefined!);
	}
	readdir(resource: URI): Promise<[string, FileType][]> {
		return Promise.resolve(undefined!);
	}
	delete(resource: URI, opts: IFileDeleteOptions): Promise<void> {
		return Promise.resolve(undefined!);
	}
	rename(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> {
		return Promise.resolve(undefined!);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/url/browser/trustedDomainsValidator.ts]---
Location: vscode-main/src/vs/workbench/contrib/url/browser/trustedDomainsValidator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas, matchesScheme } from '../../../../base/common/network.js';
import Severity from '../../../../base/common/severity.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IOpenerService, OpenOptions } from '../../../../platform/opener/common/opener.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ITrustedDomainService } from './trustedDomainService.js';
import { isURLDomainTrusted } from '../common/trustedDomains.js';
import { configureOpenerTrustedDomainsHandler, readStaticTrustedDomains } from './trustedDomains.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';

export class OpenerValidatorContributions implements IWorkbenchContribution {

	constructor(
		@IOpenerService private readonly _openerService: IOpenerService,
		@IStorageService private readonly _storageService: IStorageService,
		@IDialogService private readonly _dialogService: IDialogService,
		@IProductService private readonly _productService: IProductService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@IEditorService private readonly _editorService: IEditorService,
		@IClipboardService private readonly _clipboardService: IClipboardService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IWorkspaceTrustManagementService private readonly _workspaceTrustService: IWorkspaceTrustManagementService,
		@ITrustedDomainService private readonly _trustedDomainService: ITrustedDomainService,
	) {
		this._openerService.registerValidator({ shouldOpen: (uri, options) => this.validateLink(uri, options) });
	}

	async validateLink(resource: URI | string, openOptions?: OpenOptions): Promise<boolean> {
		if (!matchesScheme(resource, Schemas.http) && !matchesScheme(resource, Schemas.https)) {
			return true;
		}

		if (openOptions?.fromWorkspace && this._workspaceTrustService.isWorkspaceTrusted() && !this._configurationService.getValue('workbench.trustedDomains.promptInTrustedWorkspace')) {
			return true;
		}

		const originalResource = resource;
		let resourceUri: URI;
		if (typeof resource === 'string') {
			resourceUri = URI.parse(resource);
		} else {
			resourceUri = resource;
		}

		if (this._trustedDomainService.isValid(resourceUri)) {
			return true;
		} else {
			const { scheme, authority, path, query, fragment } = resourceUri;
			let formattedLink = `${scheme}://${authority}${path}`;

			const linkTail = `${query ? '?' + query : ''}${fragment ? '#' + fragment : ''}`;


			const remainingLength = Math.max(0, 60 - formattedLink.length);
			const linkTailLengthToKeep = Math.min(Math.max(5, remainingLength), linkTail.length);

			if (linkTailLengthToKeep === linkTail.length) {
				formattedLink += linkTail;
			} else {
				// keep the first char ? or #
				// add ... and keep the tail end as much as possible
				formattedLink += linkTail.charAt(0) + '...' + linkTail.substring(linkTail.length - linkTailLengthToKeep + 1);
			}

			const { result } = await this._dialogService.prompt<boolean>({
				type: Severity.Info,
				message: localize(
					'openExternalLinkAt',
					'Do you want {0} to open the external website?',
					this._productService.nameShort
				),
				detail: typeof originalResource === 'string' ? originalResource : formattedLink,
				buttons: [
					{
						label: localize({ key: 'open', comment: ['&& denotes a mnemonic'] }, '&&Open'),
						run: () => true
					},
					{
						label: localize({ key: 'copy', comment: ['&& denotes a mnemonic'] }, '&&Copy'),
						run: () => {
							this._clipboardService.writeText(typeof originalResource === 'string' ? originalResource : resourceUri.toString(true));
							return false;
						}
					},
					{
						label: localize({ key: 'configureTrustedDomains', comment: ['&& denotes a mnemonic'] }, 'Configure &&Trusted Domains'),
						run: async () => {
							const { trustedDomains, } = this._instantiationService.invokeFunction(readStaticTrustedDomains);
							const domainToOpen = `${scheme}://${authority}`;
							const pickedDomains = await configureOpenerTrustedDomainsHandler(
								trustedDomains,
								domainToOpen,
								resourceUri,
								this._quickInputService,
								this._storageService,
								this._editorService,
								this._telemetryService,
							);
							// Trust all domains
							if (pickedDomains.indexOf('*') !== -1) {
								return true;
							}
							// Trust current domain
							if (isURLDomainTrusted(resourceUri, pickedDomains)) {
								return true;
							}
							return false;
						}
					}
				],
				cancelButton: {
					run: () => false
				}
			});

			return result;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/url/browser/url.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/url/browser/url.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { localize, localize2 } from '../../../../nls.js';
import { MenuId, MenuRegistry, Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IURLService } from '../../../../platform/url/common/url.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { ExternalUriResolverContribution } from './externalUriResolver.js';
import { manageTrustedDomainSettingsCommand } from './trustedDomains.js';
import { TrustedDomainsFileSystemProvider } from './trustedDomainsFileSystemProvider.js';
import { OpenerValidatorContributions } from './trustedDomainsValidator.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { ConfigurationScope, Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { workbenchConfigurationNodeBase } from '../../../common/configuration.js';
import { ITrustedDomainService, TrustedDomainService } from './trustedDomainService.js';
import { registerSingleton, InstantiationType } from '../../../../platform/instantiation/common/extensions.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';

class OpenUrlAction extends Action2 {

	static readonly STORAGE_KEY = 'workbench.action.url.openUrl.lastInput';

	constructor() {
		super({
			id: 'workbench.action.url.openUrl',
			title: localize2('openUrl', 'Open URL'),
			category: Categories.Developer,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const quickInputService = accessor.get(IQuickInputService);
		const urlService = accessor.get(IURLService);
		const storageService = accessor.get(IStorageService);

		const value = storageService.get(OpenUrlAction.STORAGE_KEY, StorageScope.WORKSPACE, '');

		return quickInputService.input({ prompt: localize('urlToOpen', "URL to open"), value }).then(input => {
			if (input) {
				const uri = URI.parse(input);
				urlService.open(uri, { originalUrl: input });
				storageService.store(OpenUrlAction.STORAGE_KEY, input, StorageScope.WORKSPACE, StorageTarget.MACHINE);
			}
		});
	}
}

registerAction2(OpenUrlAction);

/**
 * Trusted Domains Contribution
 */

CommandsRegistry.registerCommand(manageTrustedDomainSettingsCommand);
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: manageTrustedDomainSettingsCommand.id,
		title: manageTrustedDomainSettingsCommand.description.description
	}
});

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(
	OpenerValidatorContributions,
	LifecyclePhase.Restored
);
registerWorkbenchContribution2(
	TrustedDomainsFileSystemProvider.ID,
	TrustedDomainsFileSystemProvider,
	WorkbenchPhase.BlockRestore // registration only
);
registerWorkbenchContribution2(
	ExternalUriResolverContribution.ID,
	ExternalUriResolverContribution,
	WorkbenchPhase.BlockRestore // registration only
);


const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
configurationRegistry.registerConfiguration({
	...workbenchConfigurationNodeBase,
	properties: {
		'workbench.trustedDomains.promptInTrustedWorkspace': {
			scope: ConfigurationScope.APPLICATION,
			type: 'boolean',
			default: false,
			description: localize('workbench.trustedDomains.promptInTrustedWorkspace', "When enabled, trusted domain prompts will appear when opening links in trusted workspaces.")
		}
	}
});

registerSingleton(ITrustedDomainService, TrustedDomainService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/url/common/trustedDomains.ts]---
Location: vscode-main/src/vs/workbench/contrib/url/common/trustedDomains.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { URI } from '../../../../base/common/uri.js';
import { testUrlMatchesGlob } from './urlGlob.js';


/**
 * Check whether a domain like https://www.microsoft.com matches
 * the list of trusted domains.
 *
 * - Schemes must match
 * - There's no subdomain matching. For example https://microsoft.com doesn't match https://www.microsoft.com
 * - Star matches all subdomains. For example https://*.microsoft.com matches https://www.microsoft.com and https://foo.bar.microsoft.com
 */

export function isURLDomainTrusted(url: URI, trustedDomains: string[]): boolean {
	url = URI.parse(normalizeURL(url));
	trustedDomains = trustedDomains.map(normalizeURL);

	if (isLocalhostAuthority(url.authority)) {
		return true;
	}

	for (let i = 0; i < trustedDomains.length; i++) {
		if (trustedDomains[i] === '*') {
			return true;
		}

		if (testUrlMatchesGlob(url, trustedDomains[i])) {
			return true;
		}
	}

	return false;
}
/**
 * Case-normalize some case-insensitive URLs, such as github.
 */

export function normalizeURL(url: string | URI): string {
	const caseInsensitiveAuthorities = ['github.com'];
	try {
		const parsed = typeof url === 'string' ? URI.parse(url, true) : url;
		if (caseInsensitiveAuthorities.includes(parsed.authority)) {
			return parsed.with({ path: parsed.path.toLowerCase() }).toString(true);
		} else {
			return parsed.toString(true);
		}
	} catch { return url.toString(); }
}
const rLocalhost = /^(.+\.)?localhost(:\d+)?$/i;
const r127 = /^127.0.0.1(:\d+)?$/;

export function isLocalhostAuthority(authority: string) {
	return rLocalhost.test(authority) || r127.test(authority);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/url/common/urlGlob.ts]---
Location: vscode-main/src/vs/workbench/contrib/url/common/urlGlob.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';

/**
 * Normalizes a URL by removing trailing slashes and query/fragment components.
 * @param url The URL to normalize.
 * @returns URI - The normalized URI object.
 */
function normalizeURL(url: string | URI): URI {
	const uri = typeof url === 'string' ? URI.parse(url) : url;
	return uri.with({
		// Remove trailing slashes
		path: uri.path.replace(/\/+$/, ''),
		// Remove query and fragment
		query: null,
		fragment: null,
	});
}

/**
 * Checks if a given URL matches a glob URL pattern.
 * The glob URL pattern can contain wildcards (*) and subdomain matching (*.)
 * @param uri The URL to check.
 * @param globUrl The glob URL pattern to match against.
 * @returns boolean - True if the URL matches the glob URL pattern, false otherwise.
 */
export function testUrlMatchesGlob(uri: string | URI, globUrl: string): boolean {
	const normalizedUrl = normalizeURL(uri);
	let normalizedGlobUrl: URI;

	const globHasScheme = /^[^./:]*:\/\//.test(globUrl);
	// if the glob does not have a scheme we assume the scheme is http or https
	// so if the url doesn't have a scheme of http or https we return false
	if (!globHasScheme) {
		if (normalizedUrl.scheme !== 'http' && normalizedUrl.scheme !== 'https') {
			return false;
		}
		normalizedGlobUrl = normalizeURL(`${normalizedUrl.scheme}://${globUrl}`);
	} else {
		normalizedGlobUrl = normalizeURL(globUrl);
	}

	return (
		doMemoUrlMatch(normalizedUrl.scheme, normalizedGlobUrl.scheme) &&
		// The authority is the only thing that should do port logic.
		doMemoUrlMatch(normalizedUrl.authority, normalizedGlobUrl.authority, true) &&
		(
			//
			normalizedGlobUrl.path === '/' ||
			doMemoUrlMatch(normalizedUrl.path, normalizedGlobUrl.path)
		)
	);
}

/**
 * @param normalizedUrlPart The normalized URL part to match.
 * @param normalizedGlobUrlPart The normalized glob URL part to match against.
 * @param includePortLogic Whether to include port logic in the matching process.
 * @returns boolean - True if the URL part matches the glob URL part, false otherwise.
 */
function doMemoUrlMatch(
	normalizedUrlPart: string,
	normalizedGlobUrlPart: string,
	includePortLogic: boolean = false,
) {
	const memo = Array.from({ length: normalizedUrlPart.length + 1 }).map(() =>
		Array.from({ length: normalizedGlobUrlPart.length + 1 }).map(() => undefined),
	);

	return doUrlPartMatch(memo, includePortLogic, normalizedUrlPart, normalizedGlobUrlPart, 0, 0);
}

/**
 * Recursively checks if a URL part matches a glob URL part.
 * This function uses memoization to avoid recomputing results for the same inputs.
 * It handles various cases such as exact matches, wildcard matches, and port logic.
 * @param memo A memoization table to avoid recomputing results for the same inputs.
 * @param includePortLogic Whether to include port logic in the matching process.
 * @param urlPart The URL part to match with.
 * @param globUrlPart The glob URL part to match against.
 * @param urlOffset The current offset in the URL part.
 * @param globUrlOffset The current offset in the glob URL part.
 * @returns boolean - True if the URL part matches the glob URL part, false otherwise.
 */
function doUrlPartMatch(
	memo: (boolean | undefined)[][],
	includePortLogic: boolean,
	urlPart: string,
	globUrlPart: string,
	urlOffset: number,
	globUrlOffset: number
): boolean {
	if (memo[urlOffset]?.[globUrlOffset] !== undefined) {
		return memo[urlOffset][globUrlOffset]!;
	}

	const options = [];

	// We've reached the end of the url.
	if (urlOffset === urlPart.length) {
		// We're also at the end of the glob url as well so we have an exact match.
		if (globUrlOffset === globUrlPart.length) {
			return true;
		}

		if (includePortLogic && globUrlPart[globUrlOffset] + globUrlPart[globUrlOffset + 1] === ':*') {
			// any port match. Consume a port if it exists otherwise nothing. Always consume the base.
			return globUrlOffset + 2 === globUrlPart.length;
		}

		return false;
	}

	// Some path remaining in url
	if (globUrlOffset === globUrlPart.length) {
		const remaining = urlPart.slice(urlOffset);
		return remaining[0] === '/';
	}

	if (urlPart[urlOffset] === globUrlPart[globUrlOffset]) {
		// Exact match.
		options.push(doUrlPartMatch(memo, includePortLogic, urlPart, globUrlPart, urlOffset + 1, globUrlOffset + 1));
	}

	if (globUrlPart[globUrlOffset] + globUrlPart[globUrlOffset + 1] === '*.') {
		// Any subdomain match. Either consume one thing that's not a / or : and don't advance base or consume nothing and do.
		if (!['/', ':'].includes(urlPart[urlOffset])) {
			options.push(doUrlPartMatch(memo, includePortLogic, urlPart, globUrlPart, urlOffset + 1, globUrlOffset));
		}
		options.push(doUrlPartMatch(memo, includePortLogic, urlPart, globUrlPart, urlOffset, globUrlOffset + 2));
	}

	if (globUrlPart[globUrlOffset] === '*') {
		// Any match. Either consume one thing and don't advance base or consume nothing and do.
		if (urlOffset + 1 === urlPart.length) {
			// If we're at the end of the input url consume one from both.
			options.push(doUrlPartMatch(memo, includePortLogic, urlPart, globUrlPart, urlOffset + 1, globUrlOffset + 1));
		} else {
			options.push(doUrlPartMatch(memo, includePortLogic, urlPart, globUrlPart, urlOffset + 1, globUrlOffset));
		}
		options.push(doUrlPartMatch(memo, includePortLogic, urlPart, globUrlPart, urlOffset, globUrlOffset + 1));
	}

	if (includePortLogic && globUrlPart[globUrlOffset] + globUrlPart[globUrlOffset + 1] === ':*') {
		// any port match. Consume a port if it exists otherwise nothing. Always consume the base.
		if (urlPart[urlOffset] === ':') {
			let endPortIndex = urlOffset + 1;
			do { endPortIndex++; } while (/[0-9]/.test(urlPart[endPortIndex]));
			options.push(doUrlPartMatch(memo, includePortLogic, urlPart, globUrlPart, endPortIndex, globUrlOffset + 2));
		} else {
			options.push(doUrlPartMatch(memo, includePortLogic, urlPart, globUrlPart, urlOffset, globUrlOffset + 2));
		}
	}

	return (memo[urlOffset][globUrlOffset] = options.some(a => a === true));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/url/test/browser/mockTrustedDomainService.ts]---
Location: vscode-main/src/vs/workbench/contrib/url/test/browser/mockTrustedDomainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../../base/common/event.js';
import { URI } from '../../../../../base/common/uri.js';
import { ITrustedDomainService } from '../../browser/trustedDomainService.js';
import { isURLDomainTrusted } from '../../common/trustedDomains.js';

export class MockTrustedDomainService implements ITrustedDomainService {
	_serviceBrand: undefined;

	constructor(private readonly _trustedDomains: string[] = []) {
	}

	readonly onDidChangeTrustedDomains: Event<void> = Event.None;

	isValid(resource: URI): boolean {
		return isURLDomainTrusted(resource, this._trustedDomains);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/url/test/browser/trustedDomains.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/url/test/browser/trustedDomains.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';

import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { isURLDomainTrusted } from '../../common/trustedDomains.js';

function linkAllowedByRules(link: string, rules: string[]) {
	assert.ok(isURLDomainTrusted(URI.parse(link), rules), `Link\n${link}\n should be allowed by rules\n${JSON.stringify(rules)}`);
}
function linkNotAllowedByRules(link: string, rules: string[]) {
	assert.ok(!isURLDomainTrusted(URI.parse(link), rules), `Link\n${link}\n should NOT be allowed by rules\n${JSON.stringify(rules)}`);
}

suite('Link protection domain matching', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	test('simple', () => {
		linkNotAllowedByRules('https://x.org', []);

		linkAllowedByRules('https://x.org', ['https://x.org']);
		linkAllowedByRules('https://x.org/foo', ['https://x.org']);

		linkNotAllowedByRules('https://x.org', ['http://x.org']);
		linkNotAllowedByRules('http://x.org', ['https://x.org']);

		linkNotAllowedByRules('https://www.x.org', ['https://x.org']);

		linkAllowedByRules('https://www.x.org', ['https://www.x.org', 'https://y.org']);
	});

	test('localhost', () => {
		linkAllowedByRules('https://127.0.0.1', []);
		linkAllowedByRules('https://127.0.0.1:3000', []);
		linkAllowedByRules('https://localhost', []);
		linkAllowedByRules('https://localhost:3000', []);
		linkAllowedByRules('https://dev.localhost', []);
		linkAllowedByRules('https://dev.localhost:3000', []);
		linkAllowedByRules('https://app.localhost', []);
		linkAllowedByRules('https://api.localhost:8080', []);
		linkAllowedByRules('https://myapp.dev.localhost:8080', []);
	});

	test('* star', () => {
		linkAllowedByRules('https://a.x.org', ['https://*.x.org']);
		linkAllowedByRules('https://a.b.x.org', ['https://*.x.org']);
	});

	test('no scheme', () => {
		linkAllowedByRules('https://a.x.org', ['a.x.org']);
		linkAllowedByRules('https://a.x.org', ['*.x.org']);
		linkAllowedByRules('https://a.b.x.org', ['*.x.org']);
		linkAllowedByRules('https://x.org', ['*.x.org']);
		// https://github.com/microsoft/vscode/issues/249353
		linkAllowedByRules('https://x.org:3000', ['*.x.org:3000']);
	});

	test('sub paths', () => {
		linkAllowedByRules('https://x.org/foo', ['https://x.org/foo']);
		linkAllowedByRules('https://x.org/foo/bar', ['https://x.org/foo']);

		linkAllowedByRules('https://x.org/foo', ['https://x.org/foo/']);
		linkAllowedByRules('https://x.org/foo/bar', ['https://x.org/foo/']);

		linkAllowedByRules('https://x.org/foo', ['x.org/foo']);
		linkAllowedByRules('https://x.org/foo', ['*.org/foo']);

		linkNotAllowedByRules('https://x.org/bar', ['https://x.org/foo']);
		linkNotAllowedByRules('https://x.org/bar', ['x.org/foo']);
		linkNotAllowedByRules('https://x.org/bar', ['*.org/foo']);

		linkAllowedByRules('https://x.org/foo/bar', ['https://x.org/foo']);
		linkNotAllowedByRules('https://x.org/foo2', ['https://x.org/foo']);

		linkNotAllowedByRules('https://www.x.org/foo', ['https://x.org/foo']);

		linkNotAllowedByRules('https://a.x.org/bar', ['https://*.x.org/foo']);
		linkNotAllowedByRules('https://a.b.x.org/bar', ['https://*.x.org/foo']);

		linkAllowedByRules('https://github.com', ['https://github.com/foo/bar', 'https://github.com']);
	});

	test('ports', () => {
		linkNotAllowedByRules('https://x.org:8080/foo/bar', ['https://x.org:8081/foo']);
		linkAllowedByRules('https://x.org:8080/foo/bar', ['https://x.org:*/foo']);
		linkAllowedByRules('https://x.org/foo/bar', ['https://x.org:*/foo']);
		linkAllowedByRules('https://x.org:8080/foo/bar', ['https://x.org:8080/foo']);
	});

	test('ip addresses', () => {
		linkAllowedByRules('http://192.168.1.7/', ['http://192.168.1.7/']);
		linkAllowedByRules('http://192.168.1.7/', ['http://192.168.1.7']);
		linkAllowedByRules('http://192.168.1.7/', ['http://192.168.1.*']);

		linkNotAllowedByRules('http://192.168.1.7:3000/', ['http://192.168.*.6:*']);
		linkAllowedByRules('http://192.168.1.7:3000/', ['http://192.168.1.7:3000/']);
		linkAllowedByRules('http://192.168.1.7:3000/', ['http://192.168.1.7:*']);
		linkAllowedByRules('http://192.168.1.7:3000/', ['http://192.168.1.*:*']);
		linkNotAllowedByRules('http://192.168.1.7:3000/', ['http://192.168.*.6:*']);
	});

	test('scheme match', () => {
		linkAllowedByRules('http://192.168.1.7/', ['http://*']);
		linkAllowedByRules('http://twitter.com', ['http://*']);
		linkAllowedByRules('http://twitter.com/hello', ['http://*']);
		linkNotAllowedByRules('https://192.168.1.7/', ['http://*']);
		linkNotAllowedByRules('https://twitter.com/', ['http://*']);
	});

	test('case normalization', () => {
		// https://github.com/microsoft/vscode/issues/99294
		linkAllowedByRules('https://github.com/microsoft/vscode/issues/new', ['https://github.com/microsoft']);
		linkAllowedByRules('https://github.com/microsoft/vscode/issues/new', ['https://github.com/microsoft']);
	});

	test('ignore query & fragment - https://github.com/microsoft/vscode/issues/156839', () => {
		linkAllowedByRules('https://github.com/login/oauth/authorize?foo=4', ['https://github.com/login/oauth/authorize']);
		linkAllowedByRules('https://github.com/login/oauth/authorize#foo', ['https://github.com/login/oauth/authorize']);
	});

	test('ensure individual parts of url are compared and wildcard does not leak out', () => {
		linkNotAllowedByRules('https://x.org/github.com', ['https://*.github.com']);
		linkNotAllowedByRules('https://x.org/y.github.com', ['https://*.github.com']);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/userDataProfile/browser/userDataProfile.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/userDataProfile/browser/userDataProfile.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { UserDataProfilesWorkbenchContribution } from './userDataProfile.js';
import './userDataProfileActions.js';

registerWorkbenchContribution2(UserDataProfilesWorkbenchContribution.ID, UserDataProfilesWorkbenchContribution, WorkbenchPhase.BlockRestore);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/userDataProfile/browser/userDataProfile.ts]---
Location: vscode-main/src/vs/workbench/contrib/userDataProfile/browser/userDataProfile.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { isWeb } from '../../../../base/common/platform.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { localize, localize2 } from '../../../../nls.js';
import { Action2, MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ILifecycleService, LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { CURRENT_PROFILE_CONTEXT, HAS_PROFILES_CONTEXT, IS_CURRENT_PROFILE_TRANSIENT_CONTEXT, IUserDataProfileManagementService, IUserDataProfileService, PROFILES_CATEGORY, PROFILES_TITLE, isProfileURL } from '../../../services/userDataProfile/common/userDataProfile.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { URI } from '../../../../base/common/uri.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IWorkspaceTagsService } from '../../tags/common/workspaceTags.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { EditorExtensions, IEditorFactoryRegistry } from '../../../common/editor.js';
import { UserDataProfilesEditor, UserDataProfilesEditorInput, UserDataProfilesEditorInputSerializer } from './userDataProfilesEditor.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IUserDataProfilesEditor } from '../common/userDataProfile.js';
import { IURLService } from '../../../../platform/url/common/url.js';
import { IBrowserWorkbenchEnvironmentService } from '../../../services/environment/browser/environmentService.js';

export const OpenProfileMenu = new MenuId('OpenProfile');
const ProfilesMenu = new MenuId('Profiles');

export class UserDataProfilesWorkbenchContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.userDataProfiles';

	private readonly currentProfileContext: IContextKey<string>;
	private readonly isCurrentProfileTransientContext: IContextKey<boolean>;
	private readonly hasProfilesContext: IContextKey<boolean>;

	constructor(
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IUserDataProfileManagementService private readonly userDataProfileManagementService: IUserDataProfileManagementService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IWorkspaceTagsService private readonly workspaceTagsService: IWorkspaceTagsService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IEditorGroupsService private readonly editorGroupsService: IEditorGroupsService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IURLService private readonly urlService: IURLService,
		@IBrowserWorkbenchEnvironmentService environmentService: IBrowserWorkbenchEnvironmentService,
	) {
		super();

		this.currentProfileContext = CURRENT_PROFILE_CONTEXT.bindTo(contextKeyService);
		this.isCurrentProfileTransientContext = IS_CURRENT_PROFILE_TRANSIENT_CONTEXT.bindTo(contextKeyService);

		this.currentProfileContext.set(this.userDataProfileService.currentProfile.id);
		this.isCurrentProfileTransientContext.set(!!this.userDataProfileService.currentProfile.isTransient);
		this._register(this.userDataProfileService.onDidChangeCurrentProfile(e => {
			this.currentProfileContext.set(this.userDataProfileService.currentProfile.id);
			this.isCurrentProfileTransientContext.set(!!this.userDataProfileService.currentProfile.isTransient);
		}));

		this.hasProfilesContext = HAS_PROFILES_CONTEXT.bindTo(contextKeyService);
		this.hasProfilesContext.set(this.userDataProfilesService.profiles.length > 1);
		this._register(this.userDataProfilesService.onDidChangeProfiles(e => this.hasProfilesContext.set(this.userDataProfilesService.profiles.length > 1)));

		this.registerEditor();
		this.registerActions();

		this._register(this.urlService.registerHandler(this));

		if (isWeb) {
			lifecycleService.when(LifecyclePhase.Eventually).then(() => userDataProfilesService.cleanUp());
		}

		this.reportWorkspaceProfileInfo();

		if (environmentService.options?.profileToPreview) {
			lifecycleService.when(LifecyclePhase.Restored).then(() => this.handleURL(URI.revive(environmentService.options!.profileToPreview!)));
		}
	}

	async handleURL(uri: URI): Promise<boolean> {
		if (isProfileURL(uri)) {
			const editor = await this.openProfilesEditor();
			if (editor) {
				editor.createNewProfile(uri);
				return true;
			}
		}
		return false;
	}

	private async openProfilesEditor(): Promise<IUserDataProfilesEditor | undefined> {
		const editor = await this.editorGroupsService.activeGroup.openEditor(new UserDataProfilesEditorInput(this.instantiationService));
		return editor as IUserDataProfilesEditor;
	}

	private registerEditor(): void {
		Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
			EditorPaneDescriptor.create(
				UserDataProfilesEditor,
				UserDataProfilesEditor.ID,
				localize('userdataprofilesEditor', "Profiles Editor")
			),
			[
				new SyncDescriptor(UserDataProfilesEditorInput)
			]
		);
		Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(UserDataProfilesEditorInput.ID, UserDataProfilesEditorInputSerializer);
	}

	private registerActions(): void {
		this.registerProfileSubMenu();
		this._register(this.registerManageProfilesAction());
		this._register(this.registerSwitchProfileAction());

		this.registerOpenProfileSubMenu();
		this.registerNewWindowWithProfileAction();
		this.registerProfilesActions();
		this._register(this.userDataProfilesService.onDidChangeProfiles(() => this.registerProfilesActions()));

		this._register(this.registerExportCurrentProfileAction());

		this.registerCreateFromCurrentProfileAction();
		this.registerNewProfileAction();
		this.registerDeleteProfileAction();

		this.registerHelpAction();
	}

	private registerProfileSubMenu(): void {
		const getProfilesTitle = () => {
			return localize('profiles', "Profile ({0})", this.userDataProfileService.currentProfile.name);
		};
		MenuRegistry.appendMenuItem(MenuId.GlobalActivity, {
			get title() {
				return getProfilesTitle();
			},
			submenu: ProfilesMenu,
			group: '2_configuration',
			order: 1,
			when: HAS_PROFILES_CONTEXT
		});
		MenuRegistry.appendMenuItem(MenuId.MenubarPreferencesMenu, {
			get title() {
				return getProfilesTitle();
			},
			submenu: ProfilesMenu,
			group: '2_configuration',
			order: 1,
			when: HAS_PROFILES_CONTEXT
		});
	}

	private registerOpenProfileSubMenu(): void {
		MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
			title: localize('New Profile Window', "New Window with Profile"),
			submenu: OpenProfileMenu,
			group: '1_new',
			order: 4,
		});
	}

	private readonly profilesDisposable = this._register(new MutableDisposable<DisposableStore>());
	private registerProfilesActions(): void {
		this.profilesDisposable.value = new DisposableStore();
		for (const profile of this.userDataProfilesService.profiles) {
			if (!profile.isTransient) {
				this.profilesDisposable.value.add(this.registerProfileEntryAction(profile));
				this.profilesDisposable.value.add(this.registerNewWindowAction(profile));
			}
		}
	}

	private registerProfileEntryAction(profile: IUserDataProfile): IDisposable {
		const that = this;
		return registerAction2(class ProfileEntryAction extends Action2 {
			constructor() {
				super({
					id: `workbench.profiles.actions.profileEntry.${profile.id}`,
					title: profile.name,
					metadata: {
						description: localize2('change profile', "Switch to {0} profile", profile.name),
					},
					toggled: ContextKeyExpr.equals(CURRENT_PROFILE_CONTEXT.key, profile.id),
					menu: [
						{
							id: ProfilesMenu,
							group: '0_profiles',
						}
					]
				});
			}
			async run(accessor: ServicesAccessor) {
				if (that.userDataProfileService.currentProfile.id !== profile.id) {
					return that.userDataProfileManagementService.switchProfile(profile);
				}
			}
		});
	}

	private registerNewWindowWithProfileAction(): IDisposable {
		return registerAction2(class NewWindowWithProfileAction extends Action2 {
			constructor() {
				super({
					id: `workbench.profiles.actions.newWindowWithProfile`,
					title: localize2('newWindowWithProfile', "New Window with Profile..."),
					category: PROFILES_CATEGORY,
					precondition: HAS_PROFILES_CONTEXT,
					f1: true,
				});
			}
			async run(accessor: ServicesAccessor) {
				const quickInputService = accessor.get(IQuickInputService);
				const userDataProfilesService = accessor.get(IUserDataProfilesService);
				const hostService = accessor.get(IHostService);

				const pick = await quickInputService.pick(
					userDataProfilesService.profiles.map(profile => ({
						label: profile.name,
						profile
					})),
					{
						title: localize('new window with profile', "New Window with Profile"),
						placeHolder: localize('pick profile', "Select Profile"),
						canPickMany: false
					});
				if (pick) {
					return hostService.openWindow({ remoteAuthority: null, forceProfile: pick.profile.name });
				}
			}
		});
	}

	private registerNewWindowAction(profile: IUserDataProfile): IDisposable {
		const disposables = new DisposableStore();

		const id = `workbench.action.openProfile.${profile.name.replace('/\s+/', '_')}`;

		disposables.add(registerAction2(class NewWindowAction extends Action2 {

			constructor() {
				super({
					id,
					title: localize2('openShort', "{0}", profile.name),
					metadata: {
						description: localize2('open profile', "Open New Window with {0} Profile", profile.name),
					},
					menu: {
						id: OpenProfileMenu,
						group: '0_profiles',
						when: HAS_PROFILES_CONTEXT
					}
				});
			}

			override run(accessor: ServicesAccessor): Promise<void> {
				const hostService = accessor.get(IHostService);
				return hostService.openWindow({ remoteAuthority: null, forceProfile: profile.name });
			}
		}));

		disposables.add(MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
			command: {
				id,
				category: PROFILES_CATEGORY,
				title: localize2('open', "Open {0} Profile", profile.name),
				precondition: HAS_PROFILES_CONTEXT
			},
		}));

		return disposables;
	}

	private registerSwitchProfileAction(): IDisposable {
		const that = this;
		return registerAction2(class SwitchProfileAction extends Action2 {
			constructor() {
				super({
					id: `workbench.profiles.actions.switchProfile`,
					title: localize2('switchProfile', 'Switch Profile...'),
					category: PROFILES_CATEGORY,
					f1: true,
				});
			}
			async run(accessor: ServicesAccessor) {
				const quickInputService = accessor.get(IQuickInputService);

				const items: Array<IQuickPickItem & { profile: IUserDataProfile }> = [];
				for (const profile of that.userDataProfilesService.profiles) {
					items.push({
						id: profile.id,
						label: profile.id === that.userDataProfileService.currentProfile.id ? `$(check) ${profile.name}` : profile.name,
						profile,
					});
				}

				const result = await quickInputService.pick(items.sort((a, b) => a.profile.name.localeCompare(b.profile.name)), {
					placeHolder: localize('selectProfile', "Select Profile")
				});
				if (result) {
					await that.userDataProfileManagementService.switchProfile(result.profile);
				}
			}
		});
	}

	private registerManageProfilesAction(): IDisposable {
		const disposables = new DisposableStore();
		disposables.add(registerAction2(class ManageProfilesAction extends Action2 {
			constructor() {
				super({
					id: `workbench.profiles.actions.manageProfiles`,
					title: {
						...localize2('manage profiles', "Profiles"),
						mnemonicTitle: localize({ key: 'miOpenProfiles', comment: ['&& denotes a mnemonic'] }, "&&Profiles"),
					},
					menu: [
						{
							id: MenuId.GlobalActivity,
							group: '2_configuration',
							order: 1,
							when: HAS_PROFILES_CONTEXT.negate()
						},
						{
							id: MenuId.MenubarPreferencesMenu,
							group: '2_configuration',
							order: 1,
							when: HAS_PROFILES_CONTEXT.negate()
						},
						{
							id: ProfilesMenu,
							group: '1_manage',
							order: 1,
						},
					]
				});
			}
			run(accessor: ServicesAccessor) {
				const editorGroupsService = accessor.get(IEditorGroupsService);
				const instantiationService = accessor.get(IInstantiationService);
				return editorGroupsService.activeGroup.openEditor(new UserDataProfilesEditorInput(instantiationService));
			}
		}));
		disposables.add(MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
			command: {
				id: 'workbench.profiles.actions.manageProfiles',
				category: Categories.Preferences,
				title: localize2('open profiles', "Open Profiles (UI)"),
			},
		}));

		return disposables;
	}

	private registerExportCurrentProfileAction(): IDisposable {
		const that = this;
		const disposables = new DisposableStore();
		const id = 'workbench.profiles.actions.exportProfile';
		disposables.add(registerAction2(class ExportProfileAction extends Action2 {
			constructor() {
				super({
					id,
					title: localize2('export profile', "Export Profile..."),
					category: PROFILES_CATEGORY,
					f1: true,
				});
			}

			async run() {
				const editor = await that.openProfilesEditor();
				editor?.selectProfile(that.userDataProfileService.currentProfile);
			}
		}));
		disposables.add(MenuRegistry.appendMenuItem(MenuId.MenubarShare, {
			command: {
				id,
				title: localize2('export profile in share', "Export Profile ({0})...", that.userDataProfileService.currentProfile.name),
			},
		}));
		return disposables;
	}


	private registerCreateFromCurrentProfileAction(): void {
		const that = this;
		this._register(registerAction2(class CreateFromCurrentProfileAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.profiles.actions.createFromCurrentProfile',
					title: localize2('save profile as', "Save Current Profile As..."),
					category: PROFILES_CATEGORY,
					f1: true,
				});
			}

			async run() {
				const editor = await that.openProfilesEditor();
				editor?.createNewProfile(that.userDataProfileService.currentProfile);
			}
		}));
	}

	private registerNewProfileAction(): void {
		const that = this;
		this._register(registerAction2(class CreateProfileAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.profiles.actions.createProfile',
					title: localize2('create profile', "New Profile..."),
					category: PROFILES_CATEGORY,
					f1: true,
					menu: [
						{
							id: OpenProfileMenu,
							group: '1_manage_profiles',
							order: 1
						}
					]
				});
			}

			async run(accessor: ServicesAccessor) {
				const editor = await that.openProfilesEditor();
				return editor?.createNewProfile();
			}
		}));
	}

	private registerDeleteProfileAction(): void {
		this._register(registerAction2(class DeleteProfileAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.profiles.actions.deleteProfile',
					title: localize2('delete profile', "Delete Profile..."),
					category: PROFILES_CATEGORY,
					f1: true,
					precondition: HAS_PROFILES_CONTEXT,
				});
			}

			async run(accessor: ServicesAccessor) {
				const quickInputService = accessor.get(IQuickInputService);
				const userDataProfileService = accessor.get(IUserDataProfileService);
				const userDataProfilesService = accessor.get(IUserDataProfilesService);
				const userDataProfileManagementService = accessor.get(IUserDataProfileManagementService);
				const notificationService = accessor.get(INotificationService);

				const profiles = userDataProfilesService.profiles.filter(p => !p.isDefault && !p.isTransient);
				if (profiles.length) {
					const picks = await quickInputService.pick(
						profiles.map(profile => ({
							label: profile.name,
							description: profile.id === userDataProfileService.currentProfile.id ? localize('current', "Current") : undefined,
							profile
						})),
						{
							title: localize('delete specific profile', "Delete Profile..."),
							placeHolder: localize('pick profile to delete', "Select Profiles to Delete"),
							canPickMany: true
						});
					if (picks) {
						try {
							await Promise.all(picks.map(pick => userDataProfileManagementService.removeProfile(pick.profile)));
						} catch (error) {
							notificationService.error(error);
						}
					}
				}
			}
		}));
	}

	private registerHelpAction(): void {
		this._register(registerAction2(class HelpAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.profiles.actions.help',
					title: PROFILES_TITLE,
					category: Categories.Help,
					menu: [{
						id: MenuId.CommandPalette,
					}],
				});
			}
			run(accessor: ServicesAccessor): unknown {
				return accessor.get(IOpenerService).open(URI.parse('https://aka.ms/vscode-profiles-help'));
			}
		}));
	}

	private async reportWorkspaceProfileInfo(): Promise<void> {
		await this.lifecycleService.when(LifecyclePhase.Eventually);

		type UserProfilesCountClassification = {
			owner: 'sandy081';
			comment: 'Report the number of user profiles excluding the default profile';
			count: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of user profiles excluding the default profile' };
		};
		type UserProfilesCountEvent = {
			count: number;
		};
		if (this.userDataProfilesService.profiles.length > 1) {
			this.telemetryService.publicLog2<UserProfilesCountEvent, UserProfilesCountClassification>('profiles:count', { count: this.userDataProfilesService.profiles.length - 1 });
		}

		const workspaceId = await this.workspaceTagsService.getTelemetryWorkspaceId(this.workspaceContextService.getWorkspace(), this.workspaceContextService.getWorkbenchState());
		type WorkspaceProfileInfoClassification = {
			owner: 'sandy081';
			comment: 'Report profile information of the current workspace';
			workspaceId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'A UUID given to a workspace to identify it.' };
			defaultProfile: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the profile of the workspace is default or not.' };
		};
		type WorkspaceProfileInfoEvent = {
			workspaceId: string | undefined;
			defaultProfile: boolean;
		};
		this.telemetryService.publicLog2<WorkspaceProfileInfoEvent, WorkspaceProfileInfoClassification>('workspaceProfileInfo', {
			workspaceId,
			defaultProfile: this.userDataProfileService.currentProfile.isDefault
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/userDataProfile/browser/userDataProfileActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/userDataProfile/browser/userDataProfileActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize2 } from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { PROFILES_CATEGORY } from '../../../services/userDataProfile/common/userDataProfile.js';

class CreateTransientProfileAction extends Action2 {
	static readonly ID = 'workbench.profiles.actions.createTemporaryProfile';
	static readonly TITLE = localize2('create temporary profile', "New Window with Temporary Profile");
	constructor() {
		super({
			id: CreateTransientProfileAction.ID,
			title: CreateTransientProfileAction.TITLE,
			category: PROFILES_CATEGORY,
			f1: true,
		});
	}

	async run(accessor: ServicesAccessor) {
		accessor.get(IHostService).openWindow({ forceTempProfile: true });
	}
}

registerAction2(CreateTransientProfileAction);

// Developer Actions

registerAction2(class CleanupProfilesAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.profiles.actions.cleanupProfiles',
			title: localize2('cleanup profile', "Cleanup Profiles"),
			category: Categories.Developer,
			f1: true,
		});
	}

	async run(accessor: ServicesAccessor) {
		return accessor.get(IUserDataProfilesService).cleanUp();
	}
});

registerAction2(class ResetWorkspacesAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.profiles.actions.resetWorkspaces',
			title: localize2('reset workspaces', "Reset Workspace Profiles Associations"),
			category: Categories.Developer,
			f1: true,
		});
	}

	async run(accessor: ServicesAccessor) {
		const userDataProfilesService = accessor.get(IUserDataProfilesService);
		return userDataProfilesService.resetWorkspaces();
	}
});
```

--------------------------------------------------------------------------------

````
