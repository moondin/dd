---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 343
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 343 of 552)

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

---[FILE: src/vs/workbench/contrib/bulkEdit/test/browser/bulkEditPreview.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/bulkEdit/test/browser/bulkEditPreview.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Event } from '../../../../../base/common/event.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { mock } from '../../../../test/common/workbenchTestServices.js';
import { InstantiationService } from '../../../../../platform/instantiation/common/instantiationService.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { URI } from '../../../../../base/common/uri.js';
import { BulkFileOperations } from '../../browser/preview/bulkEditPreview.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { ResourceFileEdit, ResourceTextEdit } from '../../../../../editor/browser/services/bulkEditService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('BulkEditPreview', function () {

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instaService: IInstantiationService;

	setup(function () {

		const fileService: IFileService = new class extends mock<IFileService>() {
			override onDidFilesChange = Event.None;
			override async exists() {
				return true;
			}
		};

		const modelService: IModelService = new class extends mock<IModelService>() {
			override getModel() {
				return null;
			}
			override getModels() {
				return [];
			}
		};

		instaService = new InstantiationService(new ServiceCollection(
			[IFileService, fileService],
			[IModelService, modelService],
		));
	});

	test('one needsConfirmation unchecks all of file', async function () {

		const edits = [
			new ResourceFileEdit(undefined, URI.parse('some:///uri1'), undefined, { label: 'cat1', needsConfirmation: true }),
			new ResourceFileEdit(URI.parse('some:///uri1'), URI.parse('some:///uri2'), undefined, { label: 'cat2', needsConfirmation: false }),
		];

		const ops = await instaService.invokeFunction(BulkFileOperations.create, edits);
		store.add(ops);
		assert.strictEqual(ops.fileOperations.length, 1);
		assert.strictEqual(ops.checked.isChecked(edits[0]), false);
	});

	test('has categories', async function () {

		const edits = [
			new ResourceFileEdit(undefined, URI.parse('some:///uri1'), undefined, { label: 'uri1', needsConfirmation: true }),
			new ResourceFileEdit(undefined, URI.parse('some:///uri2'), undefined, { label: 'uri2', needsConfirmation: false }),
		];


		const ops = await instaService.invokeFunction(BulkFileOperations.create, edits);
		store.add(ops);
		assert.strictEqual(ops.categories.length, 2);
		assert.strictEqual(ops.categories[0].metadata.label, 'uri1'); // unconfirmed!
		assert.strictEqual(ops.categories[1].metadata.label, 'uri2');
	});

	test('has not categories', async function () {

		const edits = [
			new ResourceFileEdit(undefined, URI.parse('some:///uri1'), undefined, { label: 'uri1', needsConfirmation: true }),
			new ResourceFileEdit(undefined, URI.parse('some:///uri2'), undefined, { label: 'uri1', needsConfirmation: false }),
		];

		const ops = await instaService.invokeFunction(BulkFileOperations.create, edits);
		store.add(ops);
		assert.strictEqual(ops.categories.length, 1);
		assert.strictEqual(ops.categories[0].metadata.label, 'uri1'); // unconfirmed!
		assert.strictEqual(ops.categories[0].metadata.label, 'uri1');
	});

	test('category selection', async function () {

		const edits = [
			new ResourceFileEdit(undefined, URI.parse('some:///uri1'), undefined, { label: 'C1', needsConfirmation: false }),
			new ResourceTextEdit(URI.parse('some:///uri2'), { text: 'foo', range: new Range(1, 1, 1, 1) }, undefined, { label: 'C2', needsConfirmation: false }),
		];


		const ops = await instaService.invokeFunction(BulkFileOperations.create, edits);
		store.add(ops);

		assert.strictEqual(ops.checked.isChecked(edits[0]), true);
		assert.strictEqual(ops.checked.isChecked(edits[1]), true);

		assert.ok(edits === ops.getWorkspaceEdit());

		// NOT taking to create, but the invalid text edit will
		// go through
		ops.checked.updateChecked(edits[0], false);
		const newEdits = ops.getWorkspaceEdit();
		assert.ok(edits !== newEdits);

		assert.strictEqual(edits.length, 2);
		assert.strictEqual(newEdits.length, 1);
	});

	test('fix bad metadata', async function () {

		// bogous edit that wants creation to be confirmed, but not it's textedit-child...

		const edits = [
			new ResourceFileEdit(undefined, URI.parse('some:///uri1'), undefined, { label: 'C1', needsConfirmation: true }),
			new ResourceTextEdit(URI.parse('some:///uri1'), { text: 'foo', range: new Range(1, 1, 1, 1) }, undefined, { label: 'C2', needsConfirmation: false })
		];

		const ops = await instaService.invokeFunction(BulkFileOperations.create, edits);
		store.add(ops);

		assert.strictEqual(ops.checked.isChecked(edits[0]), false);
		assert.strictEqual(ops.checked.isChecked(edits[1]), false);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/callHierarchy/browser/callHierarchy.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/callHierarchy/browser/callHierarchy.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { CallHierarchyProviderRegistry, CallHierarchyDirection, CallHierarchyModel } from '../common/callHierarchy.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { CallHierarchyTreePeekWidget } from './callHierarchyPeek.js';
import { Event } from '../../../../base/common/event.js';
import { registerEditorContribution, EditorAction2, EditorContributionInstantiation } from '../../../../editor/browser/editorExtensions.js';
import { IEditorContribution } from '../../../../editor/common/editorCommon.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { IContextKeyService, RawContextKey, IContextKey, ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { PeekContext } from '../../../../editor/contrib/peekView/browser/peekView.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { Range } from '../../../../editor/common/core/range.js';
import { IPosition } from '../../../../editor/common/core/position.js';
import { MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { isCancellationError } from '../../../../base/common/errors.js';

const _ctxHasCallHierarchyProvider = new RawContextKey<boolean>('editorHasCallHierarchyProvider', false, localize('editorHasCallHierarchyProvider', 'Whether a call hierarchy provider is available'));
const _ctxCallHierarchyVisible = new RawContextKey<boolean>('callHierarchyVisible', false, localize('callHierarchyVisible', 'Whether call hierarchy peek is currently showing'));
const _ctxCallHierarchyDirection = new RawContextKey<string>('callHierarchyDirection', undefined, { type: 'string', description: localize('callHierarchyDirection', 'Whether call hierarchy shows incoming or outgoing calls') });

function sanitizedDirection(candidate: string): CallHierarchyDirection {
	return candidate === CallHierarchyDirection.CallsFrom || candidate === CallHierarchyDirection.CallsTo
		? candidate
		: CallHierarchyDirection.CallsTo;
}

class CallHierarchyController implements IEditorContribution {

	static readonly Id = 'callHierarchy';

	static get(editor: ICodeEditor): CallHierarchyController | null {
		return editor.getContribution<CallHierarchyController>(CallHierarchyController.Id);
	}

	private static readonly _StorageDirection = 'callHierarchy/defaultDirection';

	private readonly _ctxHasProvider: IContextKey<boolean>;
	private readonly _ctxIsVisible: IContextKey<boolean>;
	private readonly _ctxDirection: IContextKey<string>;
	private readonly _dispoables = new DisposableStore();
	private readonly _sessionDisposables = new DisposableStore();

	private _widget?: CallHierarchyTreePeekWidget;

	constructor(
		private readonly _editor: ICodeEditor,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IStorageService private readonly _storageService: IStorageService,
		@ICodeEditorService private readonly _editorService: ICodeEditorService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		this._ctxIsVisible = _ctxCallHierarchyVisible.bindTo(this._contextKeyService);
		this._ctxHasProvider = _ctxHasCallHierarchyProvider.bindTo(this._contextKeyService);
		this._ctxDirection = _ctxCallHierarchyDirection.bindTo(this._contextKeyService);
		this._dispoables.add(Event.any<unknown>(_editor.onDidChangeModel, _editor.onDidChangeModelLanguage, CallHierarchyProviderRegistry.onDidChange)(() => {
			this._ctxHasProvider.set(_editor.hasModel() && CallHierarchyProviderRegistry.has(_editor.getModel()));
		}));
		this._dispoables.add(this._sessionDisposables);
	}

	dispose(): void {
		this._ctxHasProvider.reset();
		this._ctxIsVisible.reset();
		this._dispoables.dispose();
	}

	async startCallHierarchyFromEditor(): Promise<void> {
		this._sessionDisposables.clear();

		if (!this._editor.hasModel()) {
			return;
		}

		const document = this._editor.getModel();
		const position = this._editor.getPosition();
		if (!CallHierarchyProviderRegistry.has(document)) {
			return;
		}

		const cts = new CancellationTokenSource();
		const model = CallHierarchyModel.create(document, position, cts.token);
		const direction = sanitizedDirection(this._storageService.get(CallHierarchyController._StorageDirection, StorageScope.PROFILE, CallHierarchyDirection.CallsTo));

		this._showCallHierarchyWidget(position, direction, model, cts);
	}

	async startCallHierarchyFromCallHierarchy(): Promise<void> {
		if (!this._widget) {
			return;
		}
		const model = this._widget.getModel();
		const call = this._widget.getFocused();
		if (!call || !model) {
			return;
		}
		const newEditor = await this._editorService.openCodeEditor({ resource: call.item.uri }, this._editor);
		if (!newEditor) {
			return;
		}
		const newModel = model.fork(call.item);
		this._sessionDisposables.clear();

		CallHierarchyController.get(newEditor)?._showCallHierarchyWidget(
			Range.lift(newModel.root.selectionRange).getStartPosition(),
			this._widget.direction,
			Promise.resolve(newModel),
			new CancellationTokenSource()
		);
	}

	private _showCallHierarchyWidget(position: IPosition, direction: CallHierarchyDirection, model: Promise<CallHierarchyModel | undefined>, cts: CancellationTokenSource) {

		this._ctxIsVisible.set(true);
		this._ctxDirection.set(direction);
		Event.any<unknown>(this._editor.onDidChangeModel, this._editor.onDidChangeModelLanguage)(this.endCallHierarchy, this, this._sessionDisposables);
		this._widget = this._instantiationService.createInstance(CallHierarchyTreePeekWidget, this._editor, position, direction);
		this._widget.showLoading();
		this._sessionDisposables.add(this._widget.onDidClose(() => {
			this.endCallHierarchy();
			this._storageService.store(CallHierarchyController._StorageDirection, this._widget!.direction, StorageScope.PROFILE, StorageTarget.USER);
		}));
		this._sessionDisposables.add({ dispose() { cts.dispose(true); } });
		this._sessionDisposables.add(this._widget);

		model.then(model => {
			if (cts.token.isCancellationRequested) {
				return; // nothing
			}
			if (model) {
				this._sessionDisposables.add(model);
				this._widget!.showModel(model);
			}
			else {
				this._widget!.showMessage(localize('no.item', "No results"));
			}
		}).catch(err => {
			if (isCancellationError(err)) {
				this.endCallHierarchy();
				return;
			}
			this._widget!.showMessage(localize('error', "Failed to show call hierarchy"));
		});
	}

	showOutgoingCalls(): void {
		this._widget?.updateDirection(CallHierarchyDirection.CallsFrom);
		this._ctxDirection.set(CallHierarchyDirection.CallsFrom);
	}

	showIncomingCalls(): void {
		this._widget?.updateDirection(CallHierarchyDirection.CallsTo);
		this._ctxDirection.set(CallHierarchyDirection.CallsTo);
	}

	endCallHierarchy(): void {
		this._sessionDisposables.clear();
		this._ctxIsVisible.set(false);
		this._editor.focus();
	}
}

registerEditorContribution(CallHierarchyController.Id, CallHierarchyController, EditorContributionInstantiation.Eager); // eager because it needs to define a context key

registerAction2(class PeekCallHierarchyAction extends EditorAction2 {

	constructor() {
		super({
			id: 'editor.showCallHierarchy',
			title: localize2('title', 'Peek Call Hierarchy'),
			menu: {
				id: MenuId.EditorContextPeek,
				group: 'navigation',
				order: 1000,
				when: ContextKeyExpr.and(
					_ctxHasCallHierarchyProvider,
					PeekContext.notInPeekEditor,
					EditorContextKeys.isInEmbeddedEditor.toNegated(),
				),
			},
			keybinding: {
				when: EditorContextKeys.editorTextFocus,
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.Shift + KeyMod.Alt + KeyCode.KeyH
			},
			precondition: ContextKeyExpr.and(
				_ctxHasCallHierarchyProvider,
				PeekContext.notInPeekEditor
			),
			f1: true
		});
	}

	async runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		return CallHierarchyController.get(editor)?.startCallHierarchyFromEditor();
	}
});

registerAction2(class extends EditorAction2 {

	constructor() {
		super({
			id: 'editor.showIncomingCalls',
			title: localize2('title.incoming', 'Show Incoming Calls'),
			icon: registerIcon('callhierarchy-incoming', Codicon.callIncoming, localize('showIncomingCallsIcons', 'Icon for incoming calls in the call hierarchy view.')),
			precondition: ContextKeyExpr.and(_ctxCallHierarchyVisible, _ctxCallHierarchyDirection.isEqualTo(CallHierarchyDirection.CallsFrom)),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.Shift + KeyMod.Alt + KeyCode.KeyH,
			},
			menu: {
				id: CallHierarchyTreePeekWidget.TitleMenu,
				when: _ctxCallHierarchyDirection.isEqualTo(CallHierarchyDirection.CallsFrom),
				order: 1,
			}
		});
	}

	runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor) {
		return CallHierarchyController.get(editor)?.showIncomingCalls();
	}
});

registerAction2(class extends EditorAction2 {

	constructor() {
		super({
			id: 'editor.showOutgoingCalls',
			title: localize2('title.outgoing', 'Show Outgoing Calls'),
			icon: registerIcon('callhierarchy-outgoing', Codicon.callOutgoing, localize('showOutgoingCallsIcon', 'Icon for outgoing calls in the call hierarchy view.')),
			precondition: ContextKeyExpr.and(_ctxCallHierarchyVisible, _ctxCallHierarchyDirection.isEqualTo(CallHierarchyDirection.CallsTo)),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.Shift + KeyMod.Alt + KeyCode.KeyH,
			},
			menu: {
				id: CallHierarchyTreePeekWidget.TitleMenu,
				when: _ctxCallHierarchyDirection.isEqualTo(CallHierarchyDirection.CallsTo),
				order: 1
			}
		});
	}

	runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor) {
		return CallHierarchyController.get(editor)?.showOutgoingCalls();
	}
});


registerAction2(class extends EditorAction2 {

	constructor() {
		super({
			id: 'editor.refocusCallHierarchy',
			title: localize2('title.refocus', 'Refocus Call Hierarchy'),
			precondition: _ctxCallHierarchyVisible,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.Shift + KeyCode.Enter
			}
		});
	}

	async runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		return CallHierarchyController.get(editor)?.startCallHierarchyFromCallHierarchy();
	}
});


registerAction2(class extends EditorAction2 {

	constructor() {
		super({
			id: 'editor.closeCallHierarchy',
			title: localize('close', 'Close'),
			icon: Codicon.close,
			precondition: _ctxCallHierarchyVisible,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib + 10,
				primary: KeyCode.Escape,
				when: ContextKeyExpr.not('config.editor.stablePeek')
			},
			menu: {
				id: CallHierarchyTreePeekWidget.TitleMenu,
				order: 1000
			}
		});
	}

	runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		return CallHierarchyController.get(editor)?.endCallHierarchy();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/callHierarchy/browser/callHierarchyPeek.ts]---
Location: vscode-main/src/vs/workbench/contrib/callHierarchy/browser/callHierarchyPeek.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/callHierarchy.css';
import * as peekView from '../../../../editor/contrib/peekView/browser/peekView.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { CallHierarchyDirection, CallHierarchyModel } from '../common/callHierarchy.js';
import { WorkbenchAsyncDataTree, IWorkbenchAsyncDataTreeOptions } from '../../../../platform/list/browser/listService.js';
import { FuzzyScore } from '../../../../base/common/filters.js';
import * as callHTree from './callHierarchyTree.js';
import { IAsyncDataTreeViewState } from '../../../../base/browser/ui/tree/asyncDataTree.js';
import { localize } from '../../../../nls.js';
import { ScrollType } from '../../../../editor/common/editorCommon.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { SplitView, Orientation, Sizing } from '../../../../base/browser/ui/splitview/splitview.js';
import { Dimension, isKeyboardEvent } from '../../../../base/browser/dom.js';
import { Event } from '../../../../base/common/event.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { EmbeddedCodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { IEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { toDisposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { TrackedRangeStickiness, IModelDeltaDecoration, IModelDecorationOptions, OverviewRulerLane } from '../../../../editor/common/model.js';
import { themeColorFromId, IThemeService, IColorTheme } from '../../../../platform/theme/common/themeService.js';
import { IPosition } from '../../../../editor/common/core/position.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { Color } from '../../../../base/common/color.js';
import { TreeMouseEventTarget, ITreeNode } from '../../../../base/browser/ui/tree/tree.js';
import { URI } from '../../../../base/common/uri.js';
import { MenuId, IMenuService } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { getFlatActionBarActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';

const enum State {
	Loading = 'loading',
	Message = 'message',
	Data = 'data'
}

class LayoutInfo {

	static store(info: LayoutInfo, storageService: IStorageService): void {
		storageService.store('callHierarchyPeekLayout', JSON.stringify(info), StorageScope.PROFILE, StorageTarget.MACHINE);
	}

	static retrieve(storageService: IStorageService): LayoutInfo {
		const value = storageService.get('callHierarchyPeekLayout', StorageScope.PROFILE, '{}');
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

class CallHierarchyTree extends WorkbenchAsyncDataTree<CallHierarchyModel, callHTree.Call, FuzzyScore> { }

export class CallHierarchyTreePeekWidget extends peekView.PeekViewWidget {

	static readonly TitleMenu = new MenuId('callhierarchy/title');

	private _parent!: HTMLElement;
	private _message!: HTMLElement;
	private _splitView!: SplitView;
	private _tree!: CallHierarchyTree;
	private _treeViewStates = new Map<CallHierarchyDirection, IAsyncDataTreeViewState>();
	private _editor!: EmbeddedCodeEditorWidget;
	private _dim!: Dimension;
	private _layoutInfo!: LayoutInfo;

	private readonly _previewDisposable = new DisposableStore();

	constructor(
		editor: ICodeEditor,
		private readonly _where: IPosition,
		private _direction: CallHierarchyDirection,
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

	get direction(): CallHierarchyDirection {
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

		const menu = this._menuService.createMenu(CallHierarchyTreePeekWidget.TitleMenu, this._contextKeyService);
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
		parent.classList.add('call-hierarchy');

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
		const options: IWorkbenchAsyncDataTreeOptions<callHTree.Call, FuzzyScore> = {
			sorter: new callHTree.Sorter(),
			accessibilityProvider: new callHTree.AccessibilityProvider(() => this._direction),
			identityProvider: new callHTree.IdentityProvider(() => this._direction),
			expandOnlyOnTwistieClick: true,
			overrideStyles: {
				listBackground: peekView.peekViewResultsBackground
			}
		};
		this._tree = this._instantiationService.createInstance(
			CallHierarchyTree,
			'CallHierarchyPeek',
			treeContainer,
			new callHTree.VirtualDelegate(),
			[this._instantiationService.createInstance(callHTree.CallRenderer)],
			this._instantiationService.createInstance(callHTree.DataSource, () => this._direction),
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
			description: 'call-hierarchy-decoration',
			stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
			className: 'call-decoration',
			overviewRuler: {
				color: themeColorFromId(peekView.peekViewEditorMatchHighlight),
				position: OverviewRulerLane.Center
			},
		};

		let previewUri: URI;
		if (this._direction === CallHierarchyDirection.CallsFrom) {
			// outgoing calls: show caller and highlight focused calls
			previewUri = element.parent ? element.parent.item.uri : element.model.root.uri;

		} else {
			// incoming calls: show caller and highlight focused calls
			previewUri = element.item.uri;
		}

		const value = await this._textModelService.createModelReference(previewUri);
		this._editor.setModel(value.object.textEditorModel);

		// set decorations for caller ranges (if in the same file)
		const decorations: IModelDeltaDecoration[] = [];
		let fullRange: IRange | undefined;
		let locations = element.locations;
		if (!locations) {
			locations = [{ uri: element.item.uri, range: element.item.selectionRange }];
		}
		for (const loc of locations) {
			if (loc.uri.toString() === previewUri.toString()) {
				decorations.push({ range: loc.range, options });
				fullRange = !fullRange ? loc.range : Range.plusRange(loc.range, fullRange);
			}
		}
		if (fullRange) {
			this._editor.revealRangeInCenter(fullRange, ScrollType.Immediate);
			const decorationsCollection = this._editor.createDecorationsCollection(decorations);
			this._previewDisposable.add(toDisposable(() => decorationsCollection.clear()));
		}
		this._previewDisposable.add(value);

		// update: title
		const title = this._direction === CallHierarchyDirection.CallsFrom
			? localize('callFrom', "Calls from '{0}'", element.model.root.name)
			: localize('callsTo', "Callers of '{0}'", element.model.root.name);
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

	async showModel(model: CallHierarchyModel): Promise<void> {

		this._show();
		const viewState = this._treeViewStates.get(this._direction);

		await this._tree.setInput(model, viewState);

		const root = <ITreeNode<callHTree.Call, FuzzyScore>>this._tree.getNode(model).children[0];
		await this._tree.expand(root.element);

		if (root.children.length === 0) {
			//
			this.showMessage(this._direction === CallHierarchyDirection.CallsFrom
				? localize('empt.callsFrom', "No calls from '{0}'", model.root.name)
				: localize('empt.callsTo', "No callers of '{0}'", model.root.name));

		} else {
			this._parent.dataset['state'] = State.Data;
			if (!viewState || this._tree.getFocus().length === 0) {
				this._tree.setFocus([root.children[0].element]);
			}
			this._tree.domFocus();
			this._updatePreview();
		}
	}

	getModel(): CallHierarchyModel | undefined {
		return this._tree.getInput();
	}

	getFocused(): callHTree.Call | undefined {
		return this._tree.getFocus()[0];
	}

	async updateDirection(newDirection: CallHierarchyDirection): Promise<void> {
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

---[FILE: src/vs/workbench/contrib/callHierarchy/browser/callHierarchyTree.ts]---
Location: vscode-main/src/vs/workbench/contrib/callHierarchy/browser/callHierarchyTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAsyncDataSource, ITreeRenderer, ITreeNode, ITreeSorter } from '../../../../base/browser/ui/tree/tree.js';
import { CallHierarchyItem, CallHierarchyDirection, CallHierarchyModel, } from '../common/callHierarchy.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IIdentityProvider, IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { FuzzyScore, createMatches } from '../../../../base/common/filters.js';
import { IconLabel } from '../../../../base/browser/ui/iconLabel/iconLabel.js';
import { SymbolKinds, Location, SymbolTag } from '../../../../editor/common/languages.js';
import { compare } from '../../../../base/common/strings.js';
import { Range } from '../../../../editor/common/core/range.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { localize } from '../../../../nls.js';
import { ThemeIcon } from '../../../../base/common/themables.js';

export class Call {
	constructor(
		readonly item: CallHierarchyItem,
		readonly locations: Location[] | undefined,
		readonly model: CallHierarchyModel,
		readonly parent: Call | undefined
	) { }

	static compare(a: Call, b: Call): number {
		let res = compare(a.item.uri.toString(), b.item.uri.toString());
		if (res === 0) {
			res = Range.compareRangesUsingStarts(a.item.range, b.item.range);
		}
		return res;
	}
}

export class DataSource implements IAsyncDataSource<CallHierarchyModel, Call> {

	constructor(
		public getDirection: () => CallHierarchyDirection,
	) { }

	hasChildren(): boolean {
		return true;
	}

	async getChildren(element: CallHierarchyModel | Call): Promise<Call[]> {
		if (element instanceof CallHierarchyModel) {
			return element.roots.map(root => new Call(root, undefined, element, undefined));
		}

		const { model, item } = element;

		if (this.getDirection() === CallHierarchyDirection.CallsFrom) {
			return (await model.resolveOutgoingCalls(item, CancellationToken.None)).map(call => {
				return new Call(
					call.to,
					call.fromRanges.map(range => ({ range, uri: item.uri })),
					model,
					element
				);
			});

		} else {
			return (await model.resolveIncomingCalls(item, CancellationToken.None)).map(call => {
				return new Call(
					call.from,
					call.fromRanges.map(range => ({ range, uri: call.from.uri })),
					model,
					element
				);
			});
		}
	}
}

export class Sorter implements ITreeSorter<Call> {

	compare(element: Call, otherElement: Call): number {
		return Call.compare(element, otherElement);
	}
}

export class IdentityProvider implements IIdentityProvider<Call> {

	constructor(
		public getDirection: () => CallHierarchyDirection
	) { }

	getId(element: Call): { toString(): string } {
		let res = this.getDirection() + JSON.stringify(element.item.uri) + JSON.stringify(element.item.range);
		if (element.parent) {
			res += this.getId(element.parent);
		}
		return res;
	}
}

class CallRenderingTemplate {
	constructor(
		readonly icon: HTMLDivElement,
		readonly label: IconLabel
	) { }
}

export class CallRenderer implements ITreeRenderer<Call, FuzzyScore, CallRenderingTemplate> {

	static readonly id = 'CallRenderer';

	templateId: string = CallRenderer.id;

	renderTemplate(container: HTMLElement): CallRenderingTemplate {
		container.classList.add('callhierarchy-element');
		const icon = document.createElement('div');
		container.appendChild(icon);
		const label = new IconLabel(container, { supportHighlights: true });
		return new CallRenderingTemplate(icon, label);
	}

	renderElement(node: ITreeNode<Call, FuzzyScore>, _index: number, template: CallRenderingTemplate): void {
		const { element, filterData } = node;
		const deprecated = element.item.tags?.includes(SymbolTag.Deprecated);
		template.icon.className = '';
		template.icon.classList.add('inline', ...ThemeIcon.asClassNameArray(SymbolKinds.toIcon(element.item.kind)));
		template.label.setLabel(
			element.item.name,
			element.item.detail,
			{ labelEscapeNewLines: true, matches: createMatches(filterData), strikethrough: deprecated }
		);
	}
	disposeTemplate(template: CallRenderingTemplate): void {
		template.label.dispose();
	}
}

export class VirtualDelegate implements IListVirtualDelegate<Call> {

	getHeight(_element: Call): number {
		return 22;
	}

	getTemplateId(_element: Call): string {
		return CallRenderer.id;
	}
}

export class AccessibilityProvider implements IListAccessibilityProvider<Call> {

	constructor(
		public getDirection: () => CallHierarchyDirection
	) { }

	getWidgetAriaLabel(): string {
		return localize('tree.aria', "Call Hierarchy");
	}

	getAriaLabel(element: Call): string | null {
		if (this.getDirection() === CallHierarchyDirection.CallsFrom) {
			return localize('from', "calls from {0}", element.item.name);
		} else {
			return localize('to', "callers of {0}", element.item.name);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/callHierarchy/browser/media/callHierarchy.css]---
Location: vscode-main/src/vs/workbench/contrib/callHierarchy/browser/media/callHierarchy.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .call-hierarchy .results,
.monaco-workbench .call-hierarchy .message {
	display: none;
}

.monaco-workbench .call-hierarchy[data-state="data"] .results {
	display: inherit;
	height: 100%;
}

.monaco-workbench .call-hierarchy[data-state="message"] .message {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
}

.monaco-workbench .call-hierarchy .editor,
.monaco-workbench .call-hierarchy .tree {
	height: 100%;
}

.monaco-editor .call-hierarchy .tree {
	background-color: var(--vscode-peekViewResult-background);
	color: var(--vscode-peekViewResult-fileForeground);
}

.monaco-workbench .call-hierarchy .tree .callhierarchy-element {
	display: flex;
	flex: 1;
	flex-flow: row nowrap;
	align-items: center;
}

.monaco-workbench .call-hierarchy .tree .callhierarchy-element .monaco-icon-label {
	padding-left: 4px;
}

.monaco-editor .call-hierarchy .tree .monaco-list:focus .monaco-list-rows > .monaco-list-row.selected:not(.highlighted) {
	background-color: var(--vscode-peekViewResult-selectionBackground);
	color: var(--vscode-peekViewResult-selectionForeground) !important;
}

.monaco-editor .call-hierarchy .call-decoration {
	background-color: var(--vscode-peekViewEditor-matchHighlightBackground);
	border: 2px solid var(--vscode-peekViewEditor-matchHighlightBorder);
	box-sizing: border-box;
}

.monaco-editor .call-hierarchy .editor .monaco-editor .monaco-editor-background,
.monaco-editor .call-hierarchy .editor .monaco-editor .inputarea.ime-input {
	background-color: var(--vscode-peekViewEditor-background);
}

.monaco-editor .call-hierarchy .editor .monaco-editor .margin {
	background-color: var(--vscode-peekViewEditorGutter-background);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/callHierarchy/common/callHierarchy.ts]---
Location: vscode-main/src/vs/workbench/contrib/callHierarchy/common/callHierarchy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IRange } from '../../../../editor/common/core/range.js';
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

export const enum CallHierarchyDirection {
	CallsTo = 'incomingCalls',
	CallsFrom = 'outgoingCalls'
}

export interface CallHierarchyItem {
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

export interface IncomingCall {
	from: CallHierarchyItem;
	fromRanges: IRange[];
}

export interface OutgoingCall {
	fromRanges: IRange[];
	to: CallHierarchyItem;
}

export interface CallHierarchySession {
	roots: CallHierarchyItem[];
	dispose(): void;
}

export interface CallHierarchyProvider {

	prepareCallHierarchy(document: ITextModel, position: IPosition, token: CancellationToken): ProviderResult<CallHierarchySession>;

	provideIncomingCalls(item: CallHierarchyItem, token: CancellationToken): ProviderResult<IncomingCall[]>;

	provideOutgoingCalls(item: CallHierarchyItem, token: CancellationToken): ProviderResult<OutgoingCall[]>;
}

export const CallHierarchyProviderRegistry = new LanguageFeatureRegistry<CallHierarchyProvider>();


export class CallHierarchyModel {

	static async create(model: ITextModel, position: IPosition, token: CancellationToken): Promise<CallHierarchyModel | undefined> {
		const [provider] = CallHierarchyProviderRegistry.ordered(model);
		if (!provider) {
			return undefined;
		}
		const session = await provider.prepareCallHierarchy(model, position, token);
		if (!session) {
			return undefined;
		}
		return new CallHierarchyModel(session.roots.reduce((p, c) => p + c._sessionId, ''), provider, session.roots, new RefCountedDisposable(session));
	}

	readonly root: CallHierarchyItem;

	private constructor(
		readonly id: string,
		readonly provider: CallHierarchyProvider,
		readonly roots: CallHierarchyItem[],
		readonly ref: RefCountedDisposable,
	) {
		this.root = roots[0];
	}

	dispose(): void {
		this.ref.release();
	}

	fork(item: CallHierarchyItem): CallHierarchyModel {
		const that = this;
		return new class extends CallHierarchyModel {
			constructor() {
				super(that.id, that.provider, [item], that.ref.acquire());
			}
		};
	}

	async resolveIncomingCalls(item: CallHierarchyItem, token: CancellationToken): Promise<IncomingCall[]> {
		try {
			const result = await this.provider.provideIncomingCalls(item, token);
			if (isNonEmptyArray(result)) {
				return result;
			}
		} catch (e) {
			onUnexpectedExternalError(e);
		}
		return [];
	}

	async resolveOutgoingCalls(item: CallHierarchyItem, token: CancellationToken): Promise<OutgoingCall[]> {
		try {
			const result = await this.provider.provideOutgoingCalls(item, token);
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

const _models = new Map<string, CallHierarchyModel>();

CommandsRegistry.registerCommand('_executePrepareCallHierarchy', async (accessor, ...args) => {
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
		const model = await CallHierarchyModel.create(textModel, position, CancellationToken.None);
		if (!model) {
			return [];
		}
		//
		_models.set(model.id, model);
		_models.forEach((value, key, map) => {
			if (map.size > 10) {
				value.dispose();
				_models.delete(key);
			}
		});
		return [model.root];

	} finally {
		textModelReference?.dispose();
	}
});

function isCallHierarchyItemDto(obj: unknown): obj is CallHierarchyItem {
	return true;
}

CommandsRegistry.registerCommand('_executeProvideIncomingCalls', async (_accessor, ...args) => {
	const [item] = args;
	assertType(isCallHierarchyItemDto(item));

	// find model
	const model = _models.get(item._sessionId);
	if (!model) {
		return [];
	}

	return model.resolveIncomingCalls(item, CancellationToken.None);
});

CommandsRegistry.registerCommand('_executeProvideOutgoingCalls', async (_accessor, ...args) => {
	const [item] = args;
	assertType(isCallHierarchyItemDto(item));

	// find model
	const model = _models.get(item._sessionId);
	if (!model) {
		return [];
	}

	return model.resolveOutgoingCalls(item, CancellationToken.None);
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chat.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chat.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../../base/common/async.js';
import { Event } from '../../../../base/common/event.js';
import { MarkdownString, isMarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable, DisposableMap } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import { PolicyCategory } from '../../../../base/common/policy.js';
import { registerEditorFeature } from '../../../../editor/common/editorFeatures.js';
import * as nls from '../../../../nls.js';
import { AccessibleViewRegistry } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { Extensions as ConfigurationExtensions, ConfigurationScope, IConfigurationNode, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { McpAccessValue, McpAutoStartValue, mcpAccessConfig, mcpAutoStartConfig, mcpGalleryServiceEnablementConfig, mcpGalleryServiceUrlConfig } from '../../../../platform/mcp/common/mcpManagement.js';
import product from '../../../../platform/product/common/product.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { Extensions, IConfigurationMigrationRegistry } from '../../../common/configuration.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { EditorExtensions, IEditorFactoryRegistry } from '../../../common/editor.js';
import { IWorkbenchAssignmentService } from '../../../services/assignment/common/assignmentService.js';
import { ChatEntitlement, IChatEntitlementService } from '../../../services/chat/common/chatEntitlementService.js';
import { IEditorResolverService, RegisteredEditorPriority } from '../../../services/editor/common/editorResolverService.js';
import { AddConfigurationType, AssistedTypes } from '../../mcp/browser/mcpCommandsAddConfiguration.js';
import { allDiscoverySources, discoverySourceSettingsLabel, mcpDiscoverySection, mcpServerSamplingSection } from '../../mcp/common/mcpConfiguration.js';
import { ChatAgentNameService, ChatAgentService, IChatAgentNameService, IChatAgentService } from '../common/chatAgents.js';
import { CodeMapperService, ICodeMapperService } from '../common/chatCodeMapperService.js';
import '../common/chatColors.js';
import { IChatEditingService } from '../common/chatEditingService.js';
import { IChatLayoutService } from '../common/chatLayoutService.js';
import { ChatModeService, IChatMode, IChatModeService } from '../common/chatModes.js';
import { ChatResponseResourceFileSystemProvider } from '../common/chatResponseResourceFileSystemProvider.js';
import { IChatService } from '../common/chatService.js';
import { ChatService } from '../common/chatServiceImpl.js';
import { IChatSessionsService } from '../common/chatSessionsService.js';
import { ChatSlashCommandService, IChatSlashCommandService } from '../common/chatSlashCommands.js';
import { ChatTodoListService, IChatTodoListService } from '../common/chatTodoListService.js';
import { ChatTransferService, IChatTransferService } from '../common/chatTransferService.js';
import { IChatVariablesService } from '../common/chatVariables.js';
import { ChatWidgetHistoryService, IChatWidgetHistoryService } from '../common/chatWidgetHistoryService.js';
import { ChatAgentLocation, ChatConfiguration, ChatModeKind } from '../common/constants.js';
import { ILanguageModelIgnoredFilesService, LanguageModelIgnoredFilesService } from '../common/ignoredFiles.js';
import { ILanguageModelsService, LanguageModelsService } from '../common/languageModels.js';
import { ILanguageModelStatsService, LanguageModelStatsService } from '../common/languageModelStats.js';
import { ILanguageModelToolsConfirmationService } from '../common/languageModelToolsConfirmationService.js';
import { ILanguageModelToolsService } from '../common/languageModelToolsService.js';
import { ChatPromptFilesExtensionPointHandler } from '../common/promptSyntax/chatPromptFilesContribution.js';
import { PromptsConfig } from '../common/promptSyntax/config/config.js';
import { INSTRUCTIONS_DEFAULT_SOURCE_FOLDER, INSTRUCTION_FILE_EXTENSION, LEGACY_MODE_DEFAULT_SOURCE_FOLDER, LEGACY_MODE_FILE_EXTENSION, PROMPT_DEFAULT_SOURCE_FOLDER, PROMPT_FILE_EXTENSION } from '../common/promptSyntax/config/promptFileLocations.js';
import { PromptLanguageFeaturesProvider } from '../common/promptSyntax/promptFileContributions.js';
import { AGENT_DOCUMENTATION_URL, INSTRUCTIONS_DOCUMENTATION_URL, PROMPT_DOCUMENTATION_URL } from '../common/promptSyntax/promptTypes.js';
import { IPromptsService } from '../common/promptSyntax/service/promptsService.js';
import { PromptsService } from '../common/promptSyntax/service/promptsServiceImpl.js';
import { LanguageModelToolsExtensionPointHandler } from '../common/tools/languageModelToolsContribution.js';
import { BuiltinToolsContribution } from '../common/tools/tools.js';
import { IVoiceChatService, VoiceChatService } from '../common/voiceChatService.js';
import { registerChatAccessibilityActions } from './actions/chatAccessibilityActions.js';
import { AgentChatAccessibilityHelp, EditsChatAccessibilityHelp, PanelChatAccessibilityHelp, QuickChatAccessibilityHelp } from './actions/chatAccessibilityHelp.js';
import { ACTION_ID_NEW_CHAT, CopilotTitleBarMenuRendering, ModeOpenChatGlobalAction, registerChatActions } from './actions/chatActions.js';
import { CodeBlockActionRendering, registerChatCodeBlockActions, registerChatCodeCompareBlockActions } from './actions/chatCodeblockActions.js';
import { ChatContextContributions } from './actions/chatContext.js';
import { registerChatContextActions } from './actions/chatContextActions.js';
import { ContinueChatInSessionActionRendering } from './actions/chatContinueInAction.js';
import { registerChatCopyActions } from './actions/chatCopyActions.js';
import { registerChatDeveloperActions } from './actions/chatDeveloperActions.js';
import { ChatSubmitAction, registerChatExecuteActions } from './actions/chatExecuteActions.js';
import { registerChatFileTreeActions } from './actions/chatFileTreeActions.js';
import { ChatGettingStartedContribution } from './actions/chatGettingStarted.js';
import { registerChatExportActions } from './actions/chatImportExport.js';
import { registerLanguageModelActions } from './actions/chatLanguageModelActions.js';
import { registerMoveActions } from './actions/chatMoveActions.js';
import { registerNewChatActions } from './actions/chatNewActions.js';
import { registerChatPromptNavigationActions } from './actions/chatPromptNavigationActions.js';
import { registerQuickChatActions } from './actions/chatQuickInputActions.js';
import { ChatAgentRecommendation } from './actions/chatAgentRecommendationActions.js';
import { registerChatTitleActions } from './actions/chatTitleActions.js';
import { registerChatElicitationActions } from './actions/chatElicitationActions.js';
import { registerChatToolActions } from './actions/chatToolActions.js';
import { ChatTransferContribution } from './actions/chatTransfer.js';
import './agentSessions/agentSessions.contribution.js';
import { IChatAccessibilityService, IChatCodeBlockContextProviderService, IChatWidgetService, IQuickChatService } from './chat.js';
import { ChatAccessibilityService } from './chatAccessibilityService.js';
import './chatAttachmentModel.js';
import './chatStatusWidget.js';
import { ChatAttachmentResolveService, IChatAttachmentResolveService } from './chatAttachmentResolveService.js';
import { ChatMarkdownAnchorService, IChatMarkdownAnchorService } from './chatContentParts/chatMarkdownAnchorService.js';
import { ChatContextPickService, IChatContextPickService } from './chatContextPickService.js';
import { ChatInputBoxContentProvider } from './chatEdinputInputContentProvider.js';
import { ChatEditingEditorAccessibility } from './chatEditing/chatEditingEditorAccessibility.js';
import { registerChatEditorActions } from './chatEditing/chatEditingEditorActions.js';
import { ChatEditingEditorContextKeys } from './chatEditing/chatEditingEditorContextKeys.js';
import { ChatEditingEditorOverlay } from './chatEditing/chatEditingEditorOverlay.js';
import { ChatEditingService } from './chatEditing/chatEditingServiceImpl.js';
import { ChatEditingNotebookFileSystemProviderContrib } from './chatEditing/notebook/chatEditingNotebookFileSystemProvider.js';
import { SimpleBrowserOverlay } from './chatEditing/simpleBrowserEditorOverlay.js';
import { ChatEditor, IChatEditorOptions } from './chatEditor.js';
import { ChatEditorInput, ChatEditorInputSerializer } from './chatEditorInput.js';
import { ChatLayoutService } from './chatLayoutService.js';
import './chatManagement/chatManagement.contribution.js';
import { agentSlashCommandToMarkdown, agentToMarkdown } from './chatMarkdownDecorationsRenderer.js';
import { ChatOutputRendererService, IChatOutputRendererService } from './chatOutputItemRenderer.js';
import { ChatCompatibilityNotifier, ChatExtensionPointHandler } from './chatParticipant.contribution.js';
import { ChatPasteProvidersFeature } from './chatPasteProviders.js';
import { QuickChatService } from './chatQuick.js';
import { ChatResponseAccessibleView } from './chatResponseAccessibleView.js';
import { ChatTerminalOutputAccessibleView } from './chatTerminalOutputAccessibleView.js';
import { ChatSetupContribution, ChatTeardownContribution } from './chatSetup/chatSetupContributions.js';
import { ChatStatusBarEntry } from './chatStatus/chatStatusEntry.js';
import { ChatVariablesService } from './chatVariables.js';
import { ChatWidget } from './chatWidget.js';
import { ChatCodeBlockContextProviderService } from './codeBlockContextProviderService.js';
import { ChatDynamicVariableModel } from './contrib/chatDynamicVariables.js';
import { ChatImplicitContextContribution } from './contrib/chatImplicitContext.js';
import './contrib/chatInputCompletions.js';
import './contrib/chatInputEditorContrib.js';
import './contrib/chatInputEditorHover.js';
import { ChatRelatedFilesContribution } from './contrib/chatInputRelatedFilesContrib.js';
import { LanguageModelToolsConfirmationService } from './languageModelToolsConfirmationService.js';
import { LanguageModelToolsService, globalAutoApproveDescription } from './languageModelToolsService.js';
import './promptSyntax/promptCodingAgentActionContribution.js';
import './promptSyntax/promptToolsCodeLensProvider.js';
import { PromptUrlHandler } from './promptSyntax/promptUrlHandler.js';
import { ConfigureToolSets, UserToolSetsContributions } from './tools/toolSetsContribution.js';
import { ChatViewsWelcomeHandler } from './viewsWelcome/chatViewsWelcomeHandler.js';
import { ChatWidgetService } from './chatWidgetService.js';
import { ChatWindowNotifier } from './chatWindowNotifier.js';

const toolReferenceNameEnumValues: string[] = [];
const toolReferenceNameEnumDescriptions: string[] = [];

// Register configuration
const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
configurationRegistry.registerConfiguration({
	id: 'chatSidebar',
	title: nls.localize('interactiveSessionConfigurationTitle', "Chat"),
	type: 'object',
	properties: {
		'chat.fontSize': {
			type: 'number',
			description: nls.localize('chat.fontSize', "Controls the font size in pixels in chat messages."),
			default: 13,
			minimum: 6,
			maximum: 100
		},
		'chat.fontFamily': {
			type: 'string',
			description: nls.localize('chat.fontFamily', "Controls the font family in chat messages."),
			default: 'default'
		},
		'chat.editor.fontSize': {
			type: 'number',
			description: nls.localize('interactiveSession.editor.fontSize', "Controls the font size in pixels in chat codeblocks."),
			default: isMacintosh ? 12 : 14,
		},
		'chat.editor.fontFamily': {
			type: 'string',
			description: nls.localize('interactiveSession.editor.fontFamily', "Controls the font family in chat codeblocks."),
			default: 'default'
		},
		'chat.editor.fontWeight': {
			type: 'string',
			description: nls.localize('interactiveSession.editor.fontWeight', "Controls the font weight in chat codeblocks."),
			default: 'default'
		},
		'chat.editor.wordWrap': {
			type: 'string',
			description: nls.localize('interactiveSession.editor.wordWrap', "Controls whether lines should wrap in chat codeblocks."),
			default: 'off',
			enum: ['on', 'off']
		},
		'chat.editor.lineHeight': {
			type: 'number',
			description: nls.localize('interactiveSession.editor.lineHeight', "Controls the line height in pixels in chat codeblocks. Use 0 to compute the line height from the font size."),
			default: 0
		},
		'chat.commandCenter.enabled': {
			type: 'boolean',
			markdownDescription: nls.localize('chat.commandCenter.enabled', "Controls whether the command center shows a menu for actions to control chat (requires {0}).", '`#window.commandCenter#`'),
			default: true
		},
		'chat.implicitContext.enabled': {
			type: 'object',
			description: nls.localize('chat.implicitContext.enabled.1', "Enables automatically using the active editor as chat context for specified chat locations."),
			additionalProperties: {
				type: 'string',
				enum: ['never', 'first', 'always'],
				description: nls.localize('chat.implicitContext.value', "The value for the implicit context."),
				enumDescriptions: [
					nls.localize('chat.implicitContext.value.never', "Implicit context is never enabled."),
					nls.localize('chat.implicitContext.value.first', "Implicit context is enabled for the first interaction."),
					nls.localize('chat.implicitContext.value.always', "Implicit context is always enabled.")
				]
			},
			default: {
				'panel': 'always',
			}
		},
		'chat.implicitContext.suggestedContext': {
			type: 'boolean',
			markdownDescription: nls.localize('chat.implicitContext.suggestedContext', "Controls whether the new implicit context flow is shown. In Ask and Edit modes, the context will automatically be included. When using an agent, context will be suggested as an attachment. Selections are always included as context."),
			default: true,
		},
		'chat.editing.autoAcceptDelay': {
			type: 'number',
			markdownDescription: nls.localize('chat.editing.autoAcceptDelay', "Delay after which changes made by chat are automatically accepted. Values are in seconds, `0` means disabled and `100` seconds is the maximum."),
			default: 0,
			minimum: 0,
			maximum: 100
		},
		'chat.editing.confirmEditRequestRemoval': {
			type: 'boolean',
			scope: ConfigurationScope.APPLICATION,
			markdownDescription: nls.localize('chat.editing.confirmEditRequestRemoval', "Whether to show a confirmation before removing a request and its associated edits."),
			default: true,
		},
		'chat.editing.confirmEditRequestRetry': {
			type: 'boolean',
			scope: ConfigurationScope.APPLICATION,
			markdownDescription: nls.localize('chat.editing.confirmEditRequestRetry', "Whether to show a confirmation before retrying a request and its associated edits."),
			default: true,
		},
		'chat.experimental.detectParticipant.enabled': {
			type: 'boolean',
			deprecationMessage: nls.localize('chat.experimental.detectParticipant.enabled.deprecated', "This setting is deprecated. Please use `chat.detectParticipant.enabled` instead."),
			description: nls.localize('chat.experimental.detectParticipant.enabled', "Enables chat participant autodetection for panel chat."),
			default: null
		},
		'chat.detectParticipant.enabled': {
			type: 'boolean',
			description: nls.localize('chat.detectParticipant.enabled', "Enables chat participant autodetection for panel chat."),
			default: true
		},
		'chat.renderRelatedFiles': {
			type: 'boolean',
			description: nls.localize('chat.renderRelatedFiles', "Controls whether related files should be rendered in the chat input."),
			default: false
		},
		'chat.notifyWindowOnConfirmation': {
			type: 'boolean',
			description: nls.localize('chat.notifyWindowOnConfirmation', "Controls whether a chat session should present the user with an OS notification when a confirmation is needed while the window is not in focus. This includes a window badge as well as notification toast."),
			default: true,
		},
		[ChatConfiguration.GlobalAutoApprove]: {
			default: false,
			markdownDescription: globalAutoApproveDescription.value,
			type: 'boolean',
			scope: ConfigurationScope.APPLICATION_MACHINE,
			tags: ['experimental'],
			policy: {
				name: 'ChatToolsAutoApprove',
				category: PolicyCategory.InteractiveSession,
				minimumVersion: '1.99',
				value: (account) => account.chat_preview_features_enabled === false ? false : undefined,
				localization: {
					description: {
						key: 'autoApprove2.description',
						value: nls.localize('autoApprove2.description', 'Global auto approve also known as "YOLO mode" disables manual approval completely for all tools in all workspaces, allowing the agent to act fully autonomously. This is extremely dangerous and is *never* recommended, even containerized environments like Codespaces and Dev Containers have user keys forwarded into the container that could be compromised.\n\nThis feature disables critical security protections and makes it much easier for an attacker to compromise the machine.')
					}
				},
			}
		},
		[ChatConfiguration.AutoApproveEdits]: {
			default: {
				'**/*': true,
				'**/.vscode/*.json': false,
				'**/.git/**': false,
				'**/{package.json,package-lock.json,server.xml,build.rs,web.config,.gitattributes,.env}': false,
				'**/*.{code-workspace,csproj,fsproj,vbproj,vcxproj,proj,targets,props}': false,
			},
			markdownDescription: nls.localize('chat.tools.autoApprove.edits', "Controls whether edits made by chat are automatically approved. The default is to approve all edits except those made to certain files which have the potential to cause immediate unintended side-effects, such as `**/.vscode/*.json`.\n\nSet to `true` to automatically approve edits to matching files, `false` to always require explicit approval. The last pattern matching a given file will determine whether the edit is automatically approved."),
			type: 'object',
			additionalProperties: {
				type: 'boolean',
			}
		},
		[ChatConfiguration.AutoApprovedUrls]: {
			default: {},
			markdownDescription: nls.localize('chat.tools.fetchPage.approvedUrls', "Controls which URLs are automatically approved when requested by chat tools. Keys are URL patterns and values can be `true` to approve both requests and responses, `false` to deny, or an object with `approveRequest` and `approveResponse` properties for granular control.\n\nExamples:\n- `\"https://example.com\": true` - Approve all requests to example.com\n- `\"https://*.example.com\": true` - Approve all requests to any subdomain of example.com\n- `\"https://example.com/api/*\": { \"approveRequest\": true, \"approveResponse\": false }` - Approve requests but not responses for example.com/api paths"),
			type: 'object',
			additionalProperties: {
				oneOf: [
					{ type: 'boolean' },
					{
						type: 'object',
						properties: {
							approveRequest: { type: 'boolean' },
							approveResponse: { type: 'boolean' }
						}
					}
				]
			}
		},
		[ChatConfiguration.EligibleForAutoApproval]: {
			default: {},
			markdownDescription: nls.localize('chat.tools.eligibleForAutoApproval', 'Controls which tools are eligible for automatic approval. Tools set to \'false\' will always present a confirmation and will never offer the option to auto-approve. The default behavior (or setting a tool to \'true\') may result in the tool offering auto-approval options.'),
			type: 'object',
			propertyNames: {
				enum: toolReferenceNameEnumValues,
				enumDescriptions: toolReferenceNameEnumDescriptions,
			},
			additionalProperties: {
				type: 'boolean',
			},
			tags: ['experimental'],
			examples: [
				{
					'fetch': false,
					'runTask': false
				}
			],
			policy: {
				name: 'ChatToolsEligibleForAutoApproval',
				category: PolicyCategory.InteractiveSession,
				minimumVersion: '1.107',
				localization: {
					description: {
						key: 'chat.tools.eligibleForAutoApproval',
						value: nls.localize('chat.tools.eligibleForAutoApproval', 'Controls which tools are eligible for automatic approval. Tools set to \'false\' will always present a confirmation and will never offer the option to auto-approve. The default behavior (or setting a tool to \'true\') may result in the tool offering auto-approval options.')
					}
				},
			}
		},
		[ChatConfiguration.SuspendThrottling]: { // TODO@deepak1556 remove this once https://github.com/microsoft/vscode/issues/263554 is resolved.
			type: 'boolean',
			description: nls.localize('chat.suspendThrottling', "Controls whether background throttling is suspended when a chat request is in progress, allowing the chat session to continue even when the window is not in focus."),
			default: true,
			tags: ['preview']
		},
		'chat.sendElementsToChat.enabled': {
			default: true,
			description: nls.localize('chat.sendElementsToChat.enabled', "Controls whether elements can be sent to chat from the Simple Browser."),
			type: 'boolean',
			tags: ['preview']
		},
		'chat.sendElementsToChat.attachCSS': {
			default: true,
			markdownDescription: nls.localize('chat.sendElementsToChat.attachCSS', "Controls whether CSS of the selected element will be added to the chat. {0} must be enabled.", '`#chat.sendElementsToChat.enabled#`'),
			type: 'boolean',
			tags: ['preview']
		},
		'chat.sendElementsToChat.attachImages': {
			default: true,
			markdownDescription: nls.localize('chat.sendElementsToChat.attachImages', "Controls whether a screenshot of the selected element will be added to the chat. {0} must be enabled.", '`#chat.sendElementsToChat.enabled#`'),
			type: 'boolean',
			tags: ['experimental']
		},
		'chat.undoRequests.restoreInput': {
			default: true,
			markdownDescription: nls.localize('chat.undoRequests.restoreInput', "Controls whether the input of the chat should be restored when an undo request is made. The input will be filled with the text of the request that was restored."),
			type: 'boolean',
		},
		'chat.editRequests': {
			markdownDescription: nls.localize('chat.editRequests', "Enables editing of requests in the chat. This allows you to change the request content and resubmit it to the model."),
			type: 'string',
			enum: ['inline', 'hover', 'input', 'none'],
			default: 'inline',
		},
		[ChatConfiguration.ChatViewWelcomeEnabled]: {
			type: 'boolean',
			default: true,
			description: nls.localize('chat.welcome.enabled', "Show welcome banner when chat is empty."),
		},
		[ChatConfiguration.ChatViewSessionsEnabled]: {
			type: 'boolean',
			default: true,
			description: nls.localize('chat.viewSessions.enabled', "Show chat agent sessions when chat is empty or to the side when chat view is wide enough."),
		},
		[ChatConfiguration.ChatViewSessionsOrientation]: {
			type: 'string',
			enum: ['stacked', 'sideBySide'],
			enumDescriptions: [
				nls.localize('chat.viewSessions.orientation.stacked', "Display chat sessions vertically stacked above the chat input unless a chat session is visible."),
				nls.localize('chat.viewSessions.orientation.sideBySide', "Display chat sessions side by side if space is sufficient, otherwise fallback to stacked above the chat input unless a chat session is visible.")
			],
			default: 'sideBySide',
			description: nls.localize('chat.viewSessions.orientation', "Controls the orientation of the chat agent sessions view when it is shown alongside the chat."),
		},
		[ChatConfiguration.ChatViewTitleEnabled]: {
			type: 'boolean',
			default: true,
			description: nls.localize('chat.viewTitle.enabled', "Show the title of the chat above the chat in the chat view."),
		},
		[ChatConfiguration.NotifyWindowOnResponseReceived]: {
			type: 'boolean',
			default: true,
			description: nls.localize('chat.notifyWindowOnResponseReceived', "Controls whether a chat session should present the user with an OS notification when a response is received while the window is not in focus. This includes a window badge as well as notification toast."),
		},
		'chat.checkpoints.enabled': {
			type: 'boolean',
			default: true,
			description: nls.localize('chat.checkpoints.enabled', "Enables checkpoints in chat. Checkpoints allow you to restore the chat to a previous state."),
		},
		'chat.checkpoints.showFileChanges': {
			type: 'boolean',
			description: nls.localize('chat.checkpoints.showFileChanges', "Controls whether to show chat checkpoint file changes."),
			default: false
		},
		[mcpAccessConfig]: {
			type: 'string',
			description: nls.localize('chat.mcp.access', "Controls access to installed Model Context Protocol servers."),
			enum: [
				McpAccessValue.None,
				McpAccessValue.Registry,
				McpAccessValue.All
			],
			enumDescriptions: [
				nls.localize('chat.mcp.access.none', "No access to MCP servers."),
				nls.localize('chat.mcp.access.registry', "Allows access to MCP servers installed from the registry that VS Code is connected to."),
				nls.localize('chat.mcp.access.any', "Allow access to any installed MCP server.")
			],
			default: McpAccessValue.All,
			policy: {
				name: 'ChatMCP',
				category: PolicyCategory.InteractiveSession,
				minimumVersion: '1.99',
				value: (account) => {
					if (account.mcp === false) {
						return McpAccessValue.None;
					}
					if (account.mcpAccess === 'registry_only') {
						return McpAccessValue.Registry;
					}
					return undefined;
				},
				localization: {
					description: {
						key: 'chat.mcp.access',
						value: nls.localize('chat.mcp.access', "Controls access to installed Model Context Protocol servers.")
					},
					enumDescriptions: [
						{
							key: 'chat.mcp.access.none', value: nls.localize('chat.mcp.access.none', "No access to MCP servers."),
						},
						{
							key: 'chat.mcp.access.registry', value: nls.localize('chat.mcp.access.registry', "Allows access to MCP servers installed from the registry that VS Code is connected to."),
						},
						{
							key: 'chat.mcp.access.any', value: nls.localize('chat.mcp.access.any', "Allow access to any installed MCP server.")
						}
					]
				},
			}
		},
		[mcpAutoStartConfig]: {
			type: 'string',
			description: nls.localize('chat.mcp.autostart', "Controls whether MCP servers should be automatically started when the chat messages are submitted."),
			default: McpAutoStartValue.NewAndOutdated,
			enum: [
				McpAutoStartValue.Never,
				McpAutoStartValue.OnlyNew,
				McpAutoStartValue.NewAndOutdated
			],
			enumDescriptions: [
				nls.localize('chat.mcp.autostart.never', "Never automatically start MCP servers."),
				nls.localize('chat.mcp.autostart.onlyNew', "Only automatically start new MCP servers that have never been run."),
				nls.localize('chat.mcp.autostart.newAndOutdated', "Automatically start new and outdated MCP servers that are not yet running.")
			],
			tags: ['experimental'],
		},
		[mcpServerSamplingSection]: {
			type: 'object',
			description: nls.localize('chat.mcp.serverSampling', "Configures which models are exposed to MCP servers for sampling (making model requests in the background). This setting can be edited in a graphical way under the `{0}` command.", 'MCP: ' + nls.localize('mcp.list', 'List Servers')),
			scope: ConfigurationScope.RESOURCE,
			additionalProperties: {
				type: 'object',
				properties: {
					allowedDuringChat: {
						type: 'boolean',
						description: nls.localize('chat.mcp.serverSampling.allowedDuringChat', "Whether this server is make sampling requests during its tool calls in a chat session."),
						default: true,
					},
					allowedOutsideChat: {
						type: 'boolean',
						description: nls.localize('chat.mcp.serverSampling.allowedOutsideChat', "Whether this server is allowed to make sampling requests outside of a chat session."),
						default: false,
					},
					allowedModels: {
						type: 'array',
						items: {
							type: 'string',
							description: nls.localize('chat.mcp.serverSampling.model', "A model the MCP server has access to."),
						},
					}
				}
			},
		},
		[AssistedTypes[AddConfigurationType.NuGetPackage].enabledConfigKey]: {
			type: 'boolean',
			description: nls.localize('chat.mcp.assisted.nuget.enabled.description', "Enables NuGet packages for AI-assisted MCP server installation. Used to install MCP servers by name from the central registry for .NET packages (NuGet.org)."),
			default: false,
			tags: ['experimental'],
			experiment: {
				mode: 'startup'
			}
		},
		[ChatConfiguration.Edits2Enabled]: {
			type: 'boolean',
			description: nls.localize('chat.edits2Enabled', "Enable the new Edits mode that is based on tool-calling. When this is enabled, models that don't support tool-calling are unavailable for Edits mode."),
			default: false,
		},
		[ChatConfiguration.ExtensionToolsEnabled]: {
			type: 'boolean',
			description: nls.localize('chat.extensionToolsEnabled', "Enable using tools contributed by third-party extensions."),
			default: true,
			policy: {
				name: 'ChatAgentExtensionTools',
				category: PolicyCategory.InteractiveSession,
				minimumVersion: '1.99',
				localization: {
					description: {
						key: 'chat.extensionToolsEnabled',
						value: nls.localize('chat.extensionToolsEnabled', "Enable using tools contributed by third-party extensions.")
					}
				},
			}
		},
		[ChatConfiguration.AgentEnabled]: {
			type: 'boolean',
			description: nls.localize('chat.agent.enabled.description', "When enabled, agent mode can be activated from chat and tools in agentic contexts with side effects can be used."),
			default: true,
			policy: {
				name: 'ChatAgentMode',
				category: PolicyCategory.InteractiveSession,
				minimumVersion: '1.99',
				value: (account) => account.chat_agent_enabled === false ? false : undefined,
				localization: {
					description: {
						key: 'chat.agent.enabled.description',
						value: nls.localize('chat.agent.enabled.description', "When enabled, agent mode can be activated from chat and tools in agentic contexts with side effects can be used."),
					}
				}
			}
		},
		[ChatConfiguration.EnableMath]: {
			type: 'boolean',
			description: nls.localize('chat.mathEnabled.description', "Enable math rendering in chat responses using KaTeX."),
			default: true,
			tags: ['preview'],
		},
		[ChatConfiguration.ShowCodeBlockProgressAnimation]: {
			type: 'boolean',
			description: nls.localize('chat.codeBlock.showProgressAnimation.description', "When applying edits, show a progress animation in the code block pill. If disabled, shows the progress percentage instead."),
			default: true,
			tags: ['experimental'],
		},
		['chat.statusWidget.sku']: {
			type: 'string',
			enum: ['free', 'anonymous'],
			enumDescriptions: [
				nls.localize('chat.statusWidget.sku.free', "Show status widget for free tier users."),
				nls.localize('chat.statusWidget.sku.anonymous', "Show status widget for anonymous users.")
			],
			description: nls.localize('chat.statusWidget.enabled.description', "Controls which user type should see the status widget in new chat sessions when quota is exceeded."),
			default: undefined,
			tags: ['experimental', 'advanced'],
			experiment: {
				mode: 'auto'
			}
		},
		[mcpDiscoverySection]: {
			type: 'object',
			properties: Object.fromEntries(allDiscoverySources.map(k => [k, { type: 'boolean', description: discoverySourceSettingsLabel[k] }])),
			additionalProperties: false,
			default: Object.fromEntries(allDiscoverySources.map(k => [k, false])),
			markdownDescription: nls.localize('mcp.discovery.enabled', "Configures discovery of Model Context Protocol servers from configuration from various other applications."),
		},
		[mcpGalleryServiceEnablementConfig]: {
			type: 'boolean',
			default: false,
			tags: ['preview'],
			description: nls.localize('chat.mcp.gallery.enabled', "Enables the default Marketplace for Model Context Protocol (MCP) servers."),
			included: product.quality === 'stable'
		},
		[mcpGalleryServiceUrlConfig]: {
			type: 'string',
			description: nls.localize('mcp.gallery.serviceUrl', "Configure the MCP Gallery service URL to connect to"),
			default: '',
			scope: ConfigurationScope.APPLICATION,
			tags: ['usesOnlineServices', 'advanced'],
			included: false,
			policy: {
				name: 'McpGalleryServiceUrl',
				category: PolicyCategory.InteractiveSession,
				minimumVersion: '1.101',
				value: (account) => account.mcpRegistryUrl,
				localization: {
					description: {
						key: 'mcp.gallery.serviceUrl',
						value: nls.localize('mcp.gallery.serviceUrl', "Configure the MCP Gallery service URL to connect to"),
					}
				}
			},
		},
		[PromptsConfig.INSTRUCTIONS_LOCATION_KEY]: {
			type: 'object',
			title: nls.localize(
				'chat.instructions.config.locations.title',
				"Instructions File Locations",
			),
			markdownDescription: nls.localize(
				'chat.instructions.config.locations.description',
				"Specify location(s) of instructions files (`*{0}`) that can be attached in Chat sessions. [Learn More]({1}).\n\nRelative paths are resolved from the root folder(s) of your workspace.",
				INSTRUCTION_FILE_EXTENSION,
				INSTRUCTIONS_DOCUMENTATION_URL,
			),
			default: {
				[INSTRUCTIONS_DEFAULT_SOURCE_FOLDER]: true,
			},
			additionalProperties: { type: 'boolean' },
			restricted: true,
			tags: ['prompts', 'reusable prompts', 'prompt snippets', 'instructions'],
			examples: [
				{
					[INSTRUCTIONS_DEFAULT_SOURCE_FOLDER]: true,
				},
				{
					[INSTRUCTIONS_DEFAULT_SOURCE_FOLDER]: true,
					'/Users/vscode/repos/instructions': true,
				},
			],
		},
		[PromptsConfig.PROMPT_LOCATIONS_KEY]: {
			type: 'object',
			title: nls.localize(
				'chat.reusablePrompts.config.locations.title',
				"Prompt File Locations",
			),
			markdownDescription: nls.localize(
				'chat.reusablePrompts.config.locations.description',
				"Specify location(s) of reusable prompt files (`*{0}`) that can be run in Chat sessions. [Learn More]({1}).\n\nRelative paths are resolved from the root folder(s) of your workspace.",
				PROMPT_FILE_EXTENSION,
				PROMPT_DOCUMENTATION_URL,
			),
			default: {
				[PROMPT_DEFAULT_SOURCE_FOLDER]: true,
			},
			additionalProperties: { type: 'boolean' },
			unevaluatedProperties: { type: 'boolean' },
			restricted: true,
			tags: ['prompts', 'reusable prompts', 'prompt snippets', 'instructions'],
			examples: [
				{
					[PROMPT_DEFAULT_SOURCE_FOLDER]: true,
				},
				{
					[PROMPT_DEFAULT_SOURCE_FOLDER]: true,
					'/Users/vscode/repos/prompts': true,
				},
			],
		},
		[PromptsConfig.MODE_LOCATION_KEY]: {
			type: 'object',
			title: nls.localize(
				'chat.mode.config.locations.title',
				"Mode File Locations",
			),
			markdownDescription: nls.localize(
				'chat.mode.config.locations.description',
				"Specify location(s) of custom chat mode files (`*{0}`). [Learn More]({1}).\n\nRelative paths are resolved from the root folder(s) of your workspace.",
				LEGACY_MODE_FILE_EXTENSION,
				AGENT_DOCUMENTATION_URL,
			),
			default: {
				[LEGACY_MODE_DEFAULT_SOURCE_FOLDER]: true,
			},
			deprecationMessage: nls.localize('chat.mode.config.locations.deprecated', "This setting is deprecated and will be removed in future releases. Chat modes are now called custom agents and are located in `.github/agents`"),
			additionalProperties: { type: 'boolean' },
			unevaluatedProperties: { type: 'boolean' },
			restricted: true,
			tags: ['experimental', 'prompts', 'reusable prompts', 'prompt snippets', 'instructions'],
			examples: [
				{
					[LEGACY_MODE_DEFAULT_SOURCE_FOLDER]: true,
				},
				{
					[LEGACY_MODE_DEFAULT_SOURCE_FOLDER]: true,
					'/Users/vscode/repos/chatmodes': true,
				},
			],
		},
		[PromptsConfig.USE_AGENT_MD]: {
			type: 'boolean',
			title: nls.localize('chat.useAgentMd.title', "Use AGENTS.md file",),
			markdownDescription: nls.localize('chat.useAgentMd.description', "Controls whether instructions from `AGENTS.md` file found in a workspace roots are attached to all chat requests.",),
			default: true,
			restricted: true,
			disallowConfigurationDefault: true,
			tags: ['prompts', 'reusable prompts', 'prompt snippets', 'instructions']
		},
		[PromptsConfig.USE_NESTED_AGENT_MD]: {
			type: 'boolean',
			title: nls.localize('chat.useNestedAgentMd.title', "Use nested AGENTS.md files",),
			markdownDescription: nls.localize('chat.useNestedAgentMd.description', "Controls whether instructions from nested `AGENTS.md` files found in the workspace are listed in all chat requests. The language model can load these skills on-demand if the `read` tool is available.",),
			default: false,
			restricted: true,
			disallowConfigurationDefault: true,
			tags: ['experimental', 'prompts', 'reusable prompts', 'prompt snippets', 'instructions']
		},
		[PromptsConfig.USE_AGENT_SKILLS]: {
			type: 'boolean',
			title: nls.localize('chat.useAgentSkills.title', "Use Agent skills",),
			markdownDescription: nls.localize('chat.useAgentSkills.description', "Controls whether skills are provided as specialized capabilities to the chat requests. Skills are loaded from `.github/skills`, `.claude/skills`, and `~/.claude/skills`. The language model can load these skills on-demand if the `read` tool is available. Learn more about [Agent Skills](https://aka.ms/vscode-agent-skills).",),
			default: false,
			restricted: true,
			disallowConfigurationDefault: true,
			tags: ['experimental', 'prompts', 'reusable prompts', 'prompt snippets', 'instructions']
		},
		[PromptsConfig.PROMPT_FILES_SUGGEST_KEY]: {
			type: 'object',
			scope: ConfigurationScope.RESOURCE,
			title: nls.localize(
				'chat.promptFilesRecommendations.title',
				"Prompt File Recommendations",
			),
			markdownDescription: nls.localize(
				'chat.promptFilesRecommendations.description',
				"Configure which prompt files to recommend in the chat welcome view. Each key is a prompt file name, and the value can be `true` to always recommend, `false` to never recommend, or a [when clause](https://aka.ms/vscode-when-clause) expression like `resourceExtname == .js` or `resourceLangId == markdown`.",
			),
			default: {},
			additionalProperties: {
				oneOf: [
					{ type: 'boolean' },
					{ type: 'string' }
				]
			},
			tags: ['prompts', 'reusable prompts', 'prompt snippets', 'instructions'],
			examples: [
				{
					'plan': true,
					'a11y-audit': 'resourceExtname == .html',
					'document': 'resourceLangId == markdown'
				}
			],
		},
		[ChatConfiguration.TodosShowWidget]: {
			type: 'boolean',
			default: true,
			description: nls.localize('chat.tools.todos.showWidget', "Controls whether to show the todo list widget above the chat input. When enabled, the widget displays todo items created by the agent and updates as progress is made."),
			tags: ['experimental'],
			experiment: {
				mode: 'auto'
			}
		},
		'chat.todoListTool.writeOnly': {
			type: 'boolean',
			default: false,
			description: nls.localize('chat.todoListTool.writeOnly', "When enabled, the todo tool operates in write-only mode, requiring the agent to remember todos in context."),
			tags: ['experimental'],
			experiment: {
				mode: 'auto'
			}
		},
		'chat.todoListTool.descriptionField': {
			type: 'boolean',
			default: true,
			description: nls.localize('chat.todoListTool.descriptionField', "When enabled, todo items include detailed descriptions for implementation context. This provides more information but uses additional tokens and may slow down responses."),
			tags: ['experimental'],
			experiment: {
				mode: 'auto'
			}
		},
		[ChatConfiguration.ThinkingStyle]: {
			type: 'string',
			default: 'fixedScrolling',
			enum: ['collapsed', 'collapsedPreview', 'fixedScrolling'],
			enumDescriptions: [
				nls.localize('chat.agent.thinkingMode.collapsed', "Thinking parts will be collapsed by default."),
				nls.localize('chat.agent.thinkingMode.collapsedPreview', "Thinking parts will be expanded first, then collapse once we reach a part that is not thinking."),
				nls.localize('chat.agent.thinkingMode.fixedScrolling', "Show thinking in a fixed-height streaming panel that auto-scrolls; click header to expand to full height."),
			],
			description: nls.localize('chat.agent.thinkingStyle', "Controls how thinking is rendered."),
			tags: ['experimental'],
		},
		[ChatConfiguration.ThinkingGenerateTitles]: {
			type: 'boolean',
			default: true,
			description: nls.localize('chat.agent.thinking.generateTitles', "Controls whether to use an LLM to generate summary titles for thinking sections."),
			tags: ['experimental'],
		},
		'chat.agent.thinking.collapsedTools': {
			type: 'string',
			default: 'always',
			enum: ['off', 'withThinking', 'always'],
			enumDescriptions: [
				nls.localize('chat.agent.thinking.collapsedTools.off', "Tool calls are shown separately, not collapsed into thinking."),
				nls.localize('chat.agent.thinking.collapsedTools.withThinking', "Tool calls are collapsed into thinking sections when thinking is present."),
				nls.localize('chat.agent.thinking.collapsedTools.always', "Tool calls are always collapsed, even without thinking."),
			],
			markdownDescription: nls.localize('chat.agent.thinking.collapsedTools', "Controls how tool calls are displayed in relation to thinking sections."),
			tags: ['experimental'],
		},
		'chat.disableAIFeatures': {
			type: 'boolean',
			description: nls.localize('chat.disableAIFeatures', "Disable and hide built-in AI features provided by GitHub Copilot, including chat and inline suggestions."),
			default: false,
			scope: ConfigurationScope.WINDOW
		},
		'chat.allowAnonymousAccess': { // TODO@bpasero remove me eventually
			type: 'boolean',
			description: nls.localize('chat.allowAnonymousAccess', "Controls whether anonymous access is allowed in chat."),
			default: false,
			tags: ['experimental'],
			experiment: {
				mode: 'auto'
			}
		},
		[ChatConfiguration.RestoreLastPanelSession]: { // TODO@bpasero review this setting later
			type: 'boolean',
			description: nls.localize('chat.restoreLastPanelSession', "Controls whether the last session is restored in panel after restart."),
			default: false,
			tags: ['experimental'],
			experiment: {
				mode: 'auto'
			}
		},
		[ChatConfiguration.ExitAfterDelegation]: {
			type: 'boolean',
			description: nls.localize('chat.exitAfterDelegation', "Controls whether the chat panel automatically exits after delegating a request to another session."),
			default: true,
			tags: ['preview'],
		},
		'chat.extensionUnification.enabled': {
			type: 'boolean',
			description: nls.localize('chat.extensionUnification.enabled', "Enables the unification of GitHub Copilot extensions. When enabled, all GitHub Copilot functionality is served from the GitHub Copilot Chat extension. When disabled, the GitHub Copilot and GitHub Copilot Chat extensions operate independently."),
			default: true,
			tags: ['experimental'],
			experiment: {
				mode: 'auto'
			}
		},
		[ChatConfiguration.SubagentToolCustomAgents]: {
			type: 'boolean',
			description: nls.localize('chat.subagentTool.customAgents', "Whether the runSubagent tool is able to use custom agents. When enabled, the tool can take the name of a custom agent, but it must be given the exact name of the agent."),
			default: false,
			tags: ['experimental'],
		}
	}
});
Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		ChatEditor,
		ChatEditorInput.EditorID,
		nls.localize('chat', "Chat")
	),
	[
		new SyncDescriptor(ChatEditorInput)
	]
);
Registry.as<IConfigurationMigrationRegistry>(Extensions.ConfigurationMigration).registerConfigurationMigrations([
	{
		key: 'chat.experimental.detectParticipant.enabled',
		migrateFn: (value, _accessor) => ([
			['chat.experimental.detectParticipant.enabled', { value: undefined }],
			['chat.detectParticipant.enabled', { value: value !== false }]
		])
	},
	{
		key: 'chat.useClaudeSkills',
		migrateFn: (value, _accessor) => ([
			['chat.useClaudeSkills', { value: undefined }],
			['chat.useAgentSkills', { value }]
		])
	},
	{
		key: mcpDiscoverySection,
		migrateFn: (value: unknown) => {
			if (typeof value === 'boolean') {
				return { value: Object.fromEntries(allDiscoverySources.map(k => [k, value])) };
			}

			return { value };
		}
	},
]);

class ChatResolverContribution extends Disposable {

	static readonly ID = 'workbench.contrib.chatResolver';

	private readonly _editorRegistrations = this._register(new DisposableMap<string>());

	constructor(
		@IChatSessionsService chatSessionsService: IChatSessionsService,
		@IEditorResolverService private readonly editorResolverService: IEditorResolverService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		this._registerEditor(Schemas.vscodeChatEditor);
		this._registerEditor(Schemas.vscodeLocalChatSession);

		this._register(chatSessionsService.onDidChangeContentProviderSchemes((e) => {
			for (const scheme of e.added) {
				this._registerEditor(scheme);
			}
			for (const scheme of e.removed) {
				this._editorRegistrations.deleteAndDispose(scheme);
			}
		}));

		for (const scheme of chatSessionsService.getContentProviderSchemes()) {
			this._registerEditor(scheme);
		}
	}

	private _registerEditor(scheme: string): void {
		this._editorRegistrations.set(scheme, this.editorResolverService.registerEditor(`${scheme}:**/**`,
			{
				id: ChatEditorInput.EditorID,
				label: nls.localize('chat', "Chat"),
				priority: RegisteredEditorPriority.builtin
			},
			{
				singlePerResource: true,
				canSupportResource: resource => resource.scheme === scheme,
			},
			{
				createEditorInput: ({ resource, options }) => {
					return {
						editor: this.instantiationService.createInstance(ChatEditorInput, resource, options as IChatEditorOptions),
						options
					};
				}
			}
		));
	}
}

class ChatAgentSettingContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.chatAgentSetting';

	constructor(
		@IWorkbenchAssignmentService private readonly experimentService: IWorkbenchAssignmentService,
		@IChatEntitlementService private readonly entitlementService: IChatEntitlementService,
	) {
		super();
		this.registerMaxRequestsSetting();
	}


	private registerMaxRequestsSetting(): void {
		let lastNode: IConfigurationNode | undefined;
		const registerMaxRequestsSetting = () => {
			const treatmentId = this.entitlementService.entitlement === ChatEntitlement.Free ?
				'chatAgentMaxRequestsFree' :
				'chatAgentMaxRequestsPro';
			this.experimentService.getTreatment<number>(treatmentId).then((value) => {
				const defaultValue = value ?? (this.entitlementService.entitlement === ChatEntitlement.Free ? 25 : 25);
				const node: IConfigurationNode = {
					id: 'chatSidebar',
					title: nls.localize('interactiveSessionConfigurationTitle', "Chat"),
					type: 'object',
					properties: {
						'chat.agent.maxRequests': {
							type: 'number',
							markdownDescription: nls.localize('chat.agent.maxRequests', "The maximum number of requests to allow per-turn when using an agent. When the limit is reached, will ask to confirm to continue."),
							default: defaultValue,
						},
					}
				};
				configurationRegistry.updateConfigurations({ remove: lastNode ? [lastNode] : [], add: [node] });
				lastNode = node;
			});
		};
		this._register(Event.runAndSubscribe(Event.debounce(this.entitlementService.onDidChangeEntitlement, () => { }, 1000), () => registerMaxRequestsSetting()));
	}
}


/**
 * Workbench contribution to register actions for custom chat modes via events
 */
class ChatAgentActionsContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.chatAgentActions';

	private readonly _modeActionDisposables = new DisposableMap<string>();

	constructor(
		@IChatModeService private readonly chatModeService: IChatModeService,
	) {
		super();
		this._store.add(this._modeActionDisposables);

		// Register actions for existing custom modes
		const { custom } = this.chatModeService.getModes();
		for (const mode of custom) {
			this._registerModeAction(mode);
		}

		// Listen for custom mode changes by tracking snapshots
		this._register(this.chatModeService.onDidChangeChatModes(() => {
			const { custom } = this.chatModeService.getModes();
			const currentModeIds = new Set<string>();
			const currentModeNames = new Map<string, string>();

			for (const mode of custom) {
				const modeName = mode.name.get();
				if (currentModeNames.has(modeName)) {
					// If there is a name collision, the later one in the list wins
					currentModeIds.delete(currentModeNames.get(modeName)!);
				}

				currentModeNames.set(modeName, mode.id);
				currentModeIds.add(mode.id);
			}

			// Remove modes that no longer exist and those replaced by modes later in the list with same name
			for (const modeId of this._modeActionDisposables.keys()) {
				if (!currentModeIds.has(modeId)) {
					this._modeActionDisposables.deleteAndDispose(modeId);
				}
			}

			// Register new modes
			for (const mode of custom) {
				if (currentModeIds.has(mode.id) && !this._modeActionDisposables.has(mode.id)) {
					this._registerModeAction(mode);
				}
			}
		}));
	}

	private _registerModeAction(mode: IChatMode): void {
		const actionClass = class extends ModeOpenChatGlobalAction {
			constructor() {
				super(mode);
			}
		};
		this._modeActionDisposables.set(mode.id, registerAction2(actionClass));
	}
}

class ToolReferenceNamesContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.toolReferenceNames';

	constructor(
		@ILanguageModelToolsService private readonly _languageModelToolsService: ILanguageModelToolsService,
	) {
		super();
		this._updateToolReferenceNames();
		this._register(this._languageModelToolsService.onDidChangeTools(() => this._updateToolReferenceNames()));
	}

	private _updateToolReferenceNames(): void {
		const tools =
			Array.from(this._languageModelToolsService.getTools())
				.filter((tool): tool is typeof tool & { toolReferenceName: string } => typeof tool.toolReferenceName === 'string')
				.sort((a, b) => a.toolReferenceName.localeCompare(b.toolReferenceName));
		toolReferenceNameEnumValues.length = 0;
		toolReferenceNameEnumDescriptions.length = 0;
		for (const tool of tools) {
			toolReferenceNameEnumValues.push(tool.toolReferenceName);
			toolReferenceNameEnumDescriptions.push(nls.localize(
				'chat.toolReferenceName.description',
				"{0} - {1}",
				tool.toolReferenceName,
				tool.userDescription || tool.displayName
			));
		}
		configurationRegistry.notifyConfigurationSchemaUpdated({
			id: 'chatSidebar',
			properties: {
				[ChatConfiguration.EligibleForAutoApproval]: {}
			}
		});
	}
}

AccessibleViewRegistry.register(new ChatTerminalOutputAccessibleView());
AccessibleViewRegistry.register(new ChatResponseAccessibleView());
AccessibleViewRegistry.register(new PanelChatAccessibilityHelp());
AccessibleViewRegistry.register(new QuickChatAccessibilityHelp());
AccessibleViewRegistry.register(new EditsChatAccessibilityHelp());
AccessibleViewRegistry.register(new AgentChatAccessibilityHelp());

registerEditorFeature(ChatInputBoxContentProvider);

class ChatSlashStaticSlashCommandsContribution extends Disposable {

	static readonly ID = 'workbench.contrib.chatSlashStaticSlashCommands';

	constructor(
		@IChatSlashCommandService slashCommandService: IChatSlashCommandService,
		@ICommandService commandService: ICommandService,
		@IChatAgentService chatAgentService: IChatAgentService,
		@IChatWidgetService chatWidgetService: IChatWidgetService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();
		this._store.add(slashCommandService.registerSlashCommand({
			command: 'clear',
			detail: nls.localize('clear', "Start a new chat"),
			sortText: 'z2_clear',
			executeImmediately: true,
			locations: [ChatAgentLocation.Chat]
		}, async () => {
			commandService.executeCommand(ACTION_ID_NEW_CHAT);
		}));
		this._store.add(slashCommandService.registerSlashCommand({
			command: 'help',
			detail: '',
			sortText: 'z1_help',
			executeImmediately: true,
			locations: [ChatAgentLocation.Chat],
			modes: [ChatModeKind.Ask]
		}, async (prompt, progress, _history, _location, sessionResource) => {
			const defaultAgent = chatAgentService.getDefaultAgent(ChatAgentLocation.Chat);
			const agents = chatAgentService.getAgents();

			// Report prefix
			if (defaultAgent?.metadata.helpTextPrefix) {
				if (isMarkdownString(defaultAgent.metadata.helpTextPrefix)) {
					progress.report({ content: defaultAgent.metadata.helpTextPrefix, kind: 'markdownContent' });
				} else {
					progress.report({ content: new MarkdownString(defaultAgent.metadata.helpTextPrefix), kind: 'markdownContent' });
				}
				progress.report({ content: new MarkdownString('\n\n'), kind: 'markdownContent' });
			}

			// Report agent list
			const agentText = (await Promise.all(agents
				.filter(a => !a.isDefault && !a.isCore)
				.filter(a => a.locations.includes(ChatAgentLocation.Chat))
				.map(async a => {
					const description = a.description ? `- ${a.description}` : '';
					const agentMarkdown = instantiationService.invokeFunction(accessor => agentToMarkdown(a, sessionResource, true, accessor));
					const agentLine = `- ${agentMarkdown} ${description}`;
					const commandText = a.slashCommands.map(c => {
						const description = c.description ? `- ${c.description}` : '';
						return `\t* ${agentSlashCommandToMarkdown(a, c, sessionResource)} ${description}`;
					}).join('\n');

					return (agentLine + '\n' + commandText).trim();
				}))).join('\n');
			progress.report({ content: new MarkdownString(agentText, { isTrusted: { enabledCommands: [ChatSubmitAction.ID] } }), kind: 'markdownContent' });

			// Report help text ending
			if (defaultAgent?.metadata.helpTextPostfix) {
				progress.report({ content: new MarkdownString('\n\n'), kind: 'markdownContent' });
				if (isMarkdownString(defaultAgent.metadata.helpTextPostfix)) {
					progress.report({ content: defaultAgent.metadata.helpTextPostfix, kind: 'markdownContent' });
				} else {
					progress.report({ content: new MarkdownString(defaultAgent.metadata.helpTextPostfix), kind: 'markdownContent' });
				}
			}

			// Without this, the response will be done before it renders and so it will not stream. This ensures that if the response starts
			// rendering during the next 200ms, then it will be streamed. Once it starts streaming, the whole response streams even after
			// it has received all response data has been received.
			await timeout(200);
		}));
	}
}
Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(ChatEditorInput.TypeID, ChatEditorInputSerializer);

registerWorkbenchContribution2(ChatResolverContribution.ID, ChatResolverContribution, WorkbenchPhase.BlockStartup);
registerWorkbenchContribution2(ChatSlashStaticSlashCommandsContribution.ID, ChatSlashStaticSlashCommandsContribution, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(ChatExtensionPointHandler.ID, ChatExtensionPointHandler, WorkbenchPhase.BlockStartup);
registerWorkbenchContribution2(LanguageModelToolsExtensionPointHandler.ID, LanguageModelToolsExtensionPointHandler, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatPromptFilesExtensionPointHandler.ID, ChatPromptFilesExtensionPointHandler, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatCompatibilityNotifier.ID, ChatCompatibilityNotifier, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(CopilotTitleBarMenuRendering.ID, CopilotTitleBarMenuRendering, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(CodeBlockActionRendering.ID, CodeBlockActionRendering, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ContinueChatInSessionActionRendering.ID, ContinueChatInSessionActionRendering, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatImplicitContextContribution.ID, ChatImplicitContextContribution, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(ChatRelatedFilesContribution.ID, ChatRelatedFilesContribution, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(ChatViewsWelcomeHandler.ID, ChatViewsWelcomeHandler, WorkbenchPhase.BlockStartup);
registerWorkbenchContribution2(ChatGettingStartedContribution.ID, ChatGettingStartedContribution, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(ChatSetupContribution.ID, ChatSetupContribution, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatTeardownContribution.ID, ChatTeardownContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatStatusBarEntry.ID, ChatStatusBarEntry, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(BuiltinToolsContribution.ID, BuiltinToolsContribution, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(ChatAgentSettingContribution.ID, ChatAgentSettingContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatAgentActionsContribution.ID, ChatAgentActionsContribution, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(ToolReferenceNamesContribution.ID, ToolReferenceNamesContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatAgentRecommendation.ID, ChatAgentRecommendation, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(ChatEditingEditorAccessibility.ID, ChatEditingEditorAccessibility, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatEditingEditorOverlay.ID, ChatEditingEditorOverlay, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(SimpleBrowserOverlay.ID, SimpleBrowserOverlay, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatEditingEditorContextKeys.ID, ChatEditingEditorContextKeys, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatTransferContribution.ID, ChatTransferContribution, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatContextContributions.ID, ChatContextContributions, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatResponseResourceFileSystemProvider.ID, ChatResponseResourceFileSystemProvider, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(PromptUrlHandler.ID, PromptUrlHandler, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatEditingNotebookFileSystemProviderContrib.ID, ChatEditingNotebookFileSystemProviderContrib, WorkbenchPhase.BlockStartup);
registerWorkbenchContribution2(UserToolSetsContributions.ID, UserToolSetsContributions, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(PromptLanguageFeaturesProvider.ID, PromptLanguageFeaturesProvider, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(ChatWindowNotifier.ID, ChatWindowNotifier, WorkbenchPhase.AfterRestored);

registerChatActions();
registerChatAccessibilityActions();
registerChatCopyActions();
registerChatCodeBlockActions();
registerChatCodeCompareBlockActions();
registerChatFileTreeActions();
registerChatPromptNavigationActions();
registerChatTitleActions();
registerChatExecuteActions();
registerQuickChatActions();
registerChatExportActions();
registerMoveActions();
registerNewChatActions();
registerChatContextActions();
registerChatDeveloperActions();
registerChatEditorActions();
registerChatElicitationActions();
registerChatToolActions();
registerLanguageModelActions();
registerAction2(ConfigureToolSets);
registerEditorFeature(ChatPasteProvidersFeature);


registerSingleton(IChatTransferService, ChatTransferService, InstantiationType.Delayed);
registerSingleton(IChatService, ChatService, InstantiationType.Delayed);
registerSingleton(IChatWidgetService, ChatWidgetService, InstantiationType.Delayed);
registerSingleton(IQuickChatService, QuickChatService, InstantiationType.Delayed);
registerSingleton(IChatAccessibilityService, ChatAccessibilityService, InstantiationType.Delayed);
registerSingleton(IChatWidgetHistoryService, ChatWidgetHistoryService, InstantiationType.Delayed);
registerSingleton(ILanguageModelsService, LanguageModelsService, InstantiationType.Delayed);
registerSingleton(ILanguageModelStatsService, LanguageModelStatsService, InstantiationType.Delayed);
registerSingleton(IChatSlashCommandService, ChatSlashCommandService, InstantiationType.Delayed);
registerSingleton(IChatAgentService, ChatAgentService, InstantiationType.Delayed);
registerSingleton(IChatAgentNameService, ChatAgentNameService, InstantiationType.Delayed);
registerSingleton(IChatVariablesService, ChatVariablesService, InstantiationType.Delayed);
registerSingleton(ILanguageModelToolsService, LanguageModelToolsService, InstantiationType.Delayed);
registerSingleton(ILanguageModelToolsConfirmationService, LanguageModelToolsConfirmationService, InstantiationType.Delayed);
registerSingleton(IVoiceChatService, VoiceChatService, InstantiationType.Delayed);
registerSingleton(IChatCodeBlockContextProviderService, ChatCodeBlockContextProviderService, InstantiationType.Delayed);
registerSingleton(ICodeMapperService, CodeMapperService, InstantiationType.Delayed);
registerSingleton(IChatEditingService, ChatEditingService, InstantiationType.Delayed);
registerSingleton(IChatMarkdownAnchorService, ChatMarkdownAnchorService, InstantiationType.Delayed);
registerSingleton(ILanguageModelIgnoredFilesService, LanguageModelIgnoredFilesService, InstantiationType.Delayed);
registerSingleton(IPromptsService, PromptsService, InstantiationType.Delayed);
registerSingleton(IChatContextPickService, ChatContextPickService, InstantiationType.Delayed);
registerSingleton(IChatModeService, ChatModeService, InstantiationType.Delayed);
registerSingleton(IChatAttachmentResolveService, ChatAttachmentResolveService, InstantiationType.Delayed);
registerSingleton(IChatTodoListService, ChatTodoListService, InstantiationType.Delayed);
registerSingleton(IChatOutputRendererService, ChatOutputRendererService, InstantiationType.Delayed);
registerSingleton(IChatLayoutService, ChatLayoutService, InstantiationType.Delayed);

ChatWidget.CONTRIBS.push(ChatDynamicVariableModel);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chat.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chat.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMouseWheelEvent } from '../../../../base/browser/mouseEvent.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { EditDeltaInfo } from '../../../../editor/common/textModelEditSource.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { PreferredGroup } from '../../../services/editor/common/editorService.js';
import { IChatAgentAttachmentCapabilities, IChatAgentCommand, IChatAgentData } from '../common/chatAgents.js';
import { IChatResponseModel, IChatModelInputState } from '../common/chatModel.js';
import { IChatMode } from '../common/chatModes.js';
import { IParsedChatRequest } from '../common/chatParserTypes.js';
import { CHAT_PROVIDER_ID } from '../common/chatParticipantContribTypes.js';
import { IChatElicitationRequest, IChatLocationData, IChatSendRequestOptions } from '../common/chatService.js';
import { IChatRequestViewModel, IChatResponseViewModel, IChatViewModel } from '../common/chatViewModel.js';
import { ChatAgentLocation, ChatModeKind } from '../common/constants.js';
import { ChatAttachmentModel } from './chatAttachmentModel.js';
import { IChatEditorOptions } from './chatEditor.js';
import { ChatInputPart } from './chatInputPart.js';
import { ChatWidget, IChatWidgetContrib } from './chatWidget.js';
import { ICodeBlockActionContext } from './codeBlockPart.js';

export const IChatWidgetService = createDecorator<IChatWidgetService>('chatWidgetService');

export interface IChatWidgetService {

	readonly _serviceBrand: undefined;

	/**
	 * Returns the most recently focused widget if any.
	 *
	 * ⚠️ Consider carefully if this is appropriate for your use case. If you
	 * can know what session you're interacting with, prefer {@link getWidgetBySessionResource}
	 * or similar methods to work nicely with multiple chat widgets.
	 */
	readonly lastFocusedWidget: IChatWidget | undefined;

	readonly onDidAddWidget: Event<IChatWidget>;

	/**
	 * Fires when a chat session is no longer open in any chat widget.
	 */
	readonly onDidBackgroundSession: Event<URI>;

	/**
	 * Reveals the widget, focusing its input unless `preserveFocus` is true.
	 */
	reveal(widget: IChatWidget, preserveFocus?: boolean): Promise<boolean>;

	/**
	 * Reveals the last active widget, or creates a new chat if necessary.
	 */
	revealWidget(preserveFocus?: boolean): Promise<IChatWidget | undefined>;

	getAllWidgets(): ReadonlyArray<IChatWidget>;
	getWidgetByInputUri(uri: URI): IChatWidget | undefined;
	openSession(sessionResource: URI, target?: typeof ChatViewPaneTarget): Promise<IChatWidget | undefined>;
	openSession(sessionResource: URI, target?: PreferredGroup, options?: IChatEditorOptions): Promise<IChatWidget | undefined>;
	openSession(sessionResource: URI, target?: typeof ChatViewPaneTarget | PreferredGroup, options?: IChatEditorOptions): Promise<IChatWidget | undefined>;

	getWidgetBySessionResource(sessionResource: URI): IChatWidget | undefined;

	getWidgetsByLocations(location: ChatAgentLocation): ReadonlyArray<IChatWidget>;

	/**
	 * An IChatWidget registers itself when created.
	 */
	register(newWidget: IChatWidget): IDisposable;
}

export const ChatViewPaneTarget = Symbol('ChatViewPaneTarget');

export const IQuickChatService = createDecorator<IQuickChatService>('quickChatService');
export interface IQuickChatService {
	readonly _serviceBrand: undefined;
	readonly onDidClose: Event<void>;
	readonly enabled: boolean;
	readonly focused: boolean;
	/** Defined when quick chat is open */
	readonly sessionResource?: URI;
	toggle(options?: IQuickChatOpenOptions): void;
	focus(): void;
	open(options?: IQuickChatOpenOptions): void;
	close(): void;
	openInChatView(): void;
}

export interface IQuickChatOpenOptions {
	/**
	 * The query for quick chat.
	 */
	query: string;
	/**
	 * Whether the query is partial and will await more input from the user.
	 */
	isPartialQuery?: boolean;
	/**
	 * An optional selection range to apply to the query text box.
	 */
	selection?: Selection;
}

export const IChatAccessibilityService = createDecorator<IChatAccessibilityService>('chatAccessibilityService');
export interface IChatAccessibilityService {
	readonly _serviceBrand: undefined;
	acceptRequest(uri: URI): void;
	disposeRequest(requestId: URI): void;
	acceptResponse(widget: ChatWidget, container: HTMLElement, response: IChatResponseViewModel | string | undefined, requestId: URI | undefined, isVoiceInput?: boolean): void;
	acceptElicitation(message: IChatElicitationRequest): void;
}

export interface IChatCodeBlockInfo {
	readonly ownerMarkdownPartId: string;
	readonly codeBlockIndex: number;
	readonly elementId: string;
	readonly uri: URI | undefined;
	readonly uriPromise: Promise<URI | undefined>;
	codemapperUri: URI | undefined;
	readonly chatSessionResource: URI | undefined;
	focus(): void;
	readonly languageId?: string | undefined;
	readonly editDeltaInfo?: EditDeltaInfo | undefined;
}

export interface IChatFileTreeInfo {
	treeDataId: string;
	treeIndex: number;
	focus(): void;
}

export type ChatTreeItem = IChatRequestViewModel | IChatResponseViewModel;

export interface IChatListItemRendererOptions {
	readonly renderStyle?: 'compact' | 'minimal';
	readonly noHeader?: boolean;
	readonly noFooter?: boolean;
	readonly editableCodeBlock?: boolean;
	readonly renderDetectedCommandsWithRequest?: boolean;
	readonly restorable?: boolean;
	readonly editable?: boolean;
	readonly renderTextEditsAsSummary?: (uri: URI) => boolean;
	readonly referencesExpandedWhenEmptyResponse?: boolean | ((mode: ChatModeKind) => boolean);
	readonly progressMessageAtBottomOfResponse?: boolean | ((mode: ChatModeKind) => boolean);
}

export interface IChatWidgetViewOptions {
	autoScroll?: boolean | ((mode: ChatModeKind) => boolean);
	renderInputOnTop?: boolean;
	renderFollowups?: boolean;
	renderStyle?: 'compact' | 'minimal';
	renderInputToolbarBelowInput?: boolean;
	supportsFileReferences?: boolean;
	filter?: (item: ChatTreeItem) => boolean;
	/** Action triggered when 'clear' is called on the widget. */
	clear?: () => Promise<void>;
	rendererOptions?: IChatListItemRendererOptions;
	menus?: {
		/**
		 * The menu that is inside the input editor, use for send, dictation
		 */
		executeToolbar?: MenuId;
		/**
		 * The menu that next to the input editor, use for close, config etc
		 */
		inputSideToolbar?: MenuId;
		/**
		 * The telemetry source for all commands of this widget
		 */
		telemetrySource?: string;
	};
	defaultElementHeight?: number;
	editorOverflowWidgetsDomNode?: HTMLElement;
	enableImplicitContext?: boolean;
	enableWorkingSet?: 'explicit' | 'implicit';
	supportsChangingModes?: boolean;
	dndContainer?: HTMLElement;
	defaultMode?: IChatMode;
}

export interface IChatViewViewContext {
	viewId: string;
}

export function isIChatViewViewContext(context: IChatWidgetViewContext): context is IChatViewViewContext {
	return typeof (context as IChatViewViewContext).viewId === 'string';
}

export interface IChatResourceViewContext {
	isQuickChat?: boolean;
	isInlineChat?: boolean;
}

export function isIChatResourceViewContext(context: IChatWidgetViewContext): context is IChatResourceViewContext {
	return !isIChatViewViewContext(context);
}

export type IChatWidgetViewContext = IChatViewViewContext | IChatResourceViewContext | {};

export interface IChatAcceptInputOptions {
	noCommandDetection?: boolean;
	isVoiceInput?: boolean;
	enableImplicitContext?: boolean; // defaults to true
	// Whether to store the input to history. This defaults to 'true' if the input
	// box's current content is being accepted, or 'false' if a specific input
	// is being submitted to the widget.
	storeToHistory?: boolean;
}

export interface IChatWidgetViewModelChangeEvent {
	readonly previousSessionResource: URI | undefined;
	readonly currentSessionResource: URI | undefined;
}

export interface IChatWidget {
	readonly domNode: HTMLElement;
	readonly onDidChangeViewModel: Event<IChatWidgetViewModelChangeEvent>;
	readonly onDidAcceptInput: Event<void>;
	readonly onDidHide: Event<void>;
	readonly onDidShow: Event<void>;
	readonly onDidSubmitAgent: Event<{ agent: IChatAgentData; slashCommand?: IChatAgentCommand }>;
	readonly onDidChangeAgent: Event<{ agent: IChatAgentData; slashCommand?: IChatAgentCommand }>;
	readonly onDidChangeParsedInput: Event<void>;
	readonly onDidFocus: Event<void>;
	readonly location: ChatAgentLocation;
	readonly viewContext: IChatWidgetViewContext;
	readonly viewModel: IChatViewModel | undefined;
	readonly inputEditor: ICodeEditor;
	readonly supportsFileReferences: boolean;
	readonly attachmentCapabilities: IChatAgentAttachmentCapabilities;
	readonly parsedInput: IParsedChatRequest;
	readonly lockedAgentId: string | undefined;
	lastSelectedAgent: IChatAgentData | undefined;
	readonly scopedContextKeyService: IContextKeyService;
	readonly input: ChatInputPart;
	readonly attachmentModel: ChatAttachmentModel;
	readonly locationData?: IChatLocationData;
	readonly contribs: readonly IChatWidgetContrib[];

	readonly supportsChangingModes: boolean;

	getContrib<T extends IChatWidgetContrib>(id: string): T | undefined;
	reveal(item: ChatTreeItem): void;
	focus(item: ChatTreeItem): void;
	getSibling(item: ChatTreeItem, type: 'next' | 'previous'): ChatTreeItem | undefined;
	getFocus(): ChatTreeItem | undefined;
	setInput(query?: string): void;
	getInput(): string;
	refreshParsedInput(): void;
	logInputHistory(): void;
	acceptInput(query?: string, options?: IChatAcceptInputOptions): Promise<IChatResponseModel | undefined>;
	startEditing(requestId: string): void;
	finishedEditing(completedEdit?: boolean): void;
	rerunLastRequest(): Promise<void>;
	setInputPlaceholder(placeholder: string): void;
	resetInputPlaceholder(): void;
	/**
	 * Focuses the response item in the list.
	 * @param lastFocused Focuses the most recently focused response. Otherwise, focuses the last response.
	 */
	focusResponseItem(lastFocused?: boolean): void;
	focusInput(): void;
	hasInputFocus(): boolean;
	getModeRequestOptions(): Partial<IChatSendRequestOptions>;
	getCodeBlockInfoForEditor(uri: URI): IChatCodeBlockInfo | undefined;
	getCodeBlockInfosForResponse(response: IChatResponseViewModel): IChatCodeBlockInfo[];
	getFileTreeInfosForResponse(response: IChatResponseViewModel): IChatFileTreeInfo[];
	getLastFocusedFileTreeForResponse(response: IChatResponseViewModel): IChatFileTreeInfo | undefined;
	clear(): Promise<void>;
	getViewState(): IChatModelInputState | undefined;
	lockToCodingAgent(name: string, displayName: string, agentId?: string): void;
	handleDelegationExitIfNeeded(sourceAgent: Pick<IChatAgentData, 'id' | 'name'> | undefined, targetAgent: IChatAgentData | undefined): Promise<void>;

	delegateScrollFromMouseWheelEvent(event: IMouseWheelEvent): void;
}


export interface ICodeBlockActionContextProvider {
	getCodeBlockContext(editor?: ICodeEditor): ICodeBlockActionContext | undefined;
}

export const IChatCodeBlockContextProviderService = createDecorator<IChatCodeBlockContextProviderService>('chatCodeBlockContextProviderService');
export interface IChatCodeBlockContextProviderService {
	readonly _serviceBrand: undefined;
	readonly providers: ICodeBlockActionContextProvider[];
	registerProvider(provider: ICodeBlockActionContextProvider, id: string): IDisposable;
}

export const ChatViewId = `workbench.panel.chat.view.${CHAT_PROVIDER_ID}`;
export const ChatViewContainerId = 'workbench.panel.chat';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatAccessibilityProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatAccessibilityProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AriaRole } from '../../../../base/browser/ui/aria/aria.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { marked } from '../../../../base/common/marked/marked.js';
import { isDefined } from '../../../../base/common/types.js';
import { localize } from '../../../../nls.js';
import { IAccessibleViewService } from '../../../../platform/accessibility/browser/accessibleView.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { migrateLegacyTerminalToolSpecificData } from '../common/chat.js';
import { IChatToolInvocation } from '../common/chatService.js';
import { IChatResponseViewModel, isRequestVM, isResponseVM } from '../common/chatViewModel.js';
import { isToolResultInputOutputDetails, isToolResultOutputDetails, toolContentToA11yString } from '../common/languageModelToolsService.js';
import { CancelChatActionId } from './actions/chatExecuteActions.js';
import { AcceptToolConfirmationActionId } from './actions/chatToolActions.js';
import { ChatTreeItem } from './chat.js';

export const getToolConfirmationAlert = (accessor: ServicesAccessor, toolInvocation: IChatToolInvocation[]) => {
	const keybindingService = accessor.get(IKeybindingService);
	const contextKeyService = accessor.get(IContextKeyService);

	const acceptKb = keybindingService.lookupKeybinding(AcceptToolConfirmationActionId, contextKeyService)?.getAriaLabel();
	const cancelKb = keybindingService.lookupKeybinding(CancelChatActionId, contextKeyService)?.getAriaLabel();
	const text = toolInvocation.map(v => {
		const state = v.state.get();
		if (state.type === IChatToolInvocation.StateKind.WaitingForPostApproval) {
			const detail = isToolResultInputOutputDetails(state.resultDetails)
				? state.resultDetails.input
				: isToolResultOutputDetails(state.resultDetails)
					? undefined
					: toolContentToA11yString(state.contentForModel);
			return {
				title: localize('toolPostApprovalTitle', "Approve results of tool"),
				detail: detail,
			};
		}

		if (!(v.confirmationMessages?.message && state.type === IChatToolInvocation.StateKind.WaitingForConfirmation)) {
			return;
		}

		let input = '';
		if (v.toolSpecificData) {
			if (v.toolSpecificData.kind === 'terminal') {
				const terminalData = migrateLegacyTerminalToolSpecificData(v.toolSpecificData);
				input = terminalData.commandLine.toolEdited ?? terminalData.commandLine.original;
			} else if (v.toolSpecificData.kind === 'extensions') {
				input = JSON.stringify(v.toolSpecificData.extensions);
			} else if (v.toolSpecificData.kind === 'input') {
				input = JSON.stringify(v.toolSpecificData.rawInput);
			}
		}
		const titleObj = v.confirmationMessages?.title;
		const title = typeof titleObj === 'string' ? titleObj : titleObj?.value || '';
		return {
			title: (title + (input ? ': ' + input : '')).trim(),
			detail: undefined,
		};
	}).filter(isDefined);

	let message = acceptKb && cancelKb
		? localize('toolInvocationsHintKb', "Chat confirmation required: {0}. Press {1} to accept or {2} to cancel.", text.map(t => t.title).join(', '), acceptKb, cancelKb)
		: localize('toolInvocationsHint', "Chat confirmation required: {0}", text.map(t => t.title).join(', '));

	if (text.some(t => t.detail)) {
		message += ' ' + localize('toolInvocationsHintDetails', "Details: {0}", text.map(t => t.detail ? t.detail : '').join(' '));
	}

	return message;
};

export class ChatAccessibilityProvider implements IListAccessibilityProvider<ChatTreeItem> {

	constructor(
		@IAccessibleViewService private readonly _accessibleViewService: IAccessibleViewService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
	}
	getWidgetRole(): AriaRole {
		return 'list';
	}

	getRole(element: ChatTreeItem): AriaRole | undefined {
		return 'listitem';
	}

	getWidgetAriaLabel(): string {
		return localize('chat', "Chat");
	}

	getAriaLabel(element: ChatTreeItem): string {
		if (isRequestVM(element)) {
			return element.messageText;
		}

		if (isResponseVM(element)) {
			return this._getLabelWithInfo(element);
		}

		return '';
	}

	private _getLabelWithInfo(element: IChatResponseViewModel): string {
		const accessibleViewHint = this._accessibleViewService.getOpenAriaHint(AccessibilityVerbositySettingId.Chat);
		let label: string = '';

		const toolInvocation = element.response.value.filter(v => v.kind === 'toolInvocation');
		let toolInvocationHint = '';
		if (toolInvocation.length) {
			const waitingForConfirmation = toolInvocation.filter(v => {
				const state = v.state.get().type;
				return state === IChatToolInvocation.StateKind.WaitingForConfirmation || state === IChatToolInvocation.StateKind.WaitingForPostApproval;
			});
			if (waitingForConfirmation.length) {
				toolInvocationHint = this._instantiationService.invokeFunction(getToolConfirmationAlert, toolInvocation);
			}
		}
		const tableCount = marked.lexer(element.response.toString()).filter(token => token.type === 'table')?.length ?? 0;
		let tableCountHint = '';
		switch (tableCount) {
			case 0:
				break;
			case 1:
				tableCountHint = localize('singleTableHint', "1 table ");
				break;
			default:
				tableCountHint = localize('multiTableHint', "{0} tables ", tableCount);
				break;
		}

		const fileTreeCount = element.response.value.filter(v => v.kind === 'treeData').length ?? 0;
		let fileTreeCountHint = '';
		switch (fileTreeCount) {
			case 0:
				break;
			case 1:
				fileTreeCountHint = localize('singleFileTreeHint', "1 file tree ");
				break;
			default:
				fileTreeCountHint = localize('multiFileTreeHint', "{0} file trees ", fileTreeCount);
				break;
		}

		const elicitationCount = element.response.value.filter(v => v.kind === 'elicitation2' || v.kind === 'elicitationSerialized');
		let elicitationHint = '';
		for (const elicitation of elicitationCount) {
			const title = typeof elicitation.title === 'string' ? elicitation.title : elicitation.title.value;
			const message = typeof elicitation.message === 'string' ? elicitation.message : elicitation.message.value;
			elicitationHint += title + ' ' + message;
		}

		const codeBlockCount = marked.lexer(element.response.toString()).filter(token => token.type === 'code')?.length ?? 0;
		switch (codeBlockCount) {
			case 0:
				label = accessibleViewHint
					? localize('noCodeBlocksHint', "{0}{1}{2}{3}{4} {5}", toolInvocationHint, fileTreeCountHint, elicitationHint, tableCountHint, element.response.toString(), accessibleViewHint)
					: localize('noCodeBlocks', "{0}{1}{2} {3}", fileTreeCountHint, elicitationHint, tableCountHint, element.response.toString());
				break;
			case 1:
				label = accessibleViewHint
					? localize('singleCodeBlockHint', "{0}{1}{2}1 code block: {3} {4}{5}", toolInvocationHint, fileTreeCountHint, elicitationHint, tableCountHint, element.response.toString(), accessibleViewHint)
					: localize('singleCodeBlock', "{0}{1}1 code block: {2} {3}", fileTreeCountHint, elicitationHint, tableCountHint, element.response.toString());
				break;
			default:
				label = accessibleViewHint
					? localize('multiCodeBlockHint', "{0}{1}{2}{3} code blocks: {4}{5} {6}", toolInvocationHint, fileTreeCountHint, elicitationHint, tableCountHint, codeBlockCount, element.response.toString(), accessibleViewHint)
					: localize('multiCodeBlock', "{0}{1}{2} code blocks: {3} {4}", fileTreeCountHint, elicitationHint, codeBlockCount, tableCountHint, element.response.toString());
				break;
		}
		return label;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatAccessibilityService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatAccessibilityService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { renderAsPlaintext } from '../../../../base/browser/markdownRenderer.js';
import { alert, status } from '../../../../base/browser/ui/aria/aria.js';
import { Event } from '../../../../base/common/event.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable, DisposableMap, DisposableStore } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { AccessibilityProgressSignalScheduler } from '../../../../platform/accessibilitySignal/browser/progressAccessibilitySignalScheduler.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { FocusMode } from '../../../../platform/native/common/native.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { AccessibilityVoiceSettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { ElicitationState, IChatElicitationRequest, IChatService } from '../common/chatService.js';
import { IChatResponseViewModel } from '../common/chatViewModel.js';
import { ChatConfiguration } from '../common/constants.js';
import { IChatAccessibilityService, IChatWidgetService } from './chat.js';
import { ChatWidget } from './chatWidget.js';

const CHAT_RESPONSE_PENDING_ALLOWANCE_MS = 4000;
export class ChatAccessibilityService extends Disposable implements IChatAccessibilityService {
	declare readonly _serviceBrand: undefined;

	private _pendingSignalMap: DisposableMap<URI, AccessibilityProgressSignalScheduler> = this._register(new DisposableMap());

	private readonly notifications: Set<DisposableStore> = new Set();

	constructor(
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IHostService private readonly _hostService: IHostService,
		@IChatWidgetService private readonly _widgetService: IChatWidgetService,
		@IChatService private readonly _chatService: IChatService,
	) {
		super();
		this._register(this._widgetService.onDidBackgroundSession(e => {
			const session = this._chatService.getSession(e);
			if (!session) {
				return;
			}
			const requestInProgress = session.requestInProgress.get();
			if (!requestInProgress) {
				return;
			}
			alert(localize('chat.backgroundRequest', "Chat session will continue in the background."));
			this.disposeRequest(e);
		}));
	}

	override dispose(): void {
		for (const ds of Array.from(this.notifications)) {
			ds.dispose();
		}
		this.notifications.clear();
		super.dispose();
	}

	acceptRequest(uri: URI): void {
		this._accessibilitySignalService.playSignal(AccessibilitySignal.chatRequestSent, { allowManyInParallel: true });
		this._pendingSignalMap.set(uri, this._instantiationService.createInstance(AccessibilityProgressSignalScheduler, CHAT_RESPONSE_PENDING_ALLOWANCE_MS, undefined));
	}

	disposeRequest(requestId: URI): void {
		this._pendingSignalMap.deleteAndDispose(requestId);
	}

	acceptResponse(widget: ChatWidget, container: HTMLElement, response: IChatResponseViewModel | string | undefined, requestId: URI, isVoiceInput?: boolean): void {
		this._pendingSignalMap.deleteAndDispose(requestId);
		const isPanelChat = typeof response !== 'string';
		const responseContent = typeof response === 'string' ? response : response?.response.toString();
		this._accessibilitySignalService.playSignal(AccessibilitySignal.chatResponseReceived, { allowManyInParallel: true });
		if (!response || !responseContent) {
			return;
		}
		const plainTextResponse = renderAsPlaintext(new MarkdownString(responseContent));
		const errorDetails = isPanelChat && response.errorDetails ? ` ${response.errorDetails.message}` : '';
		this._showOSNotification(widget, container, plainTextResponse + errorDetails);
		if (!isVoiceInput || this._configurationService.getValue(AccessibilityVoiceSettingId.AutoSynthesize) !== 'on') {
			status(plainTextResponse + errorDetails);
		}
	}
	acceptElicitation(elicitation: IChatElicitationRequest): void {
		if (elicitation.state.get() !== ElicitationState.Pending) {
			return;
		}
		const title = typeof elicitation.title === 'string' ? elicitation.title : elicitation.title.value;
		const message = typeof elicitation.message === 'string' ? elicitation.message : elicitation.message.value;
		alert(title + ' ' + message);
		this._accessibilitySignalService.playSignal(AccessibilitySignal.chatUserActionRequired, { allowManyInParallel: true });
	}

	private async _showOSNotification(widget: ChatWidget, container: HTMLElement, responseContent: string): Promise<void> {
		if (!this._configurationService.getValue(ChatConfiguration.NotifyWindowOnResponseReceived)) {
			return;
		}

		const targetWindow = dom.getWindow(container);
		if (!targetWindow) {
			return;
		}

		if (targetWindow.document.hasFocus()) {
			return;
		}

		// Don't show notification if there's no meaningful content
		if (!responseContent || !responseContent.trim()) {
			return;
		}

		await this._hostService.focus(targetWindow, { mode: FocusMode.Notify });

		// Dispose any previous unhandled notifications to avoid replacement/coalescing.
		for (const ds of Array.from(this.notifications)) {
			ds.dispose();
			this.notifications.delete(ds);
		}

		const title = widget?.viewModel?.model.title ? localize('chatTitle', "Chat: {0}", widget.viewModel.model.title) : localize('chat.untitledChat', "Untitled Chat");
		const notification = await dom.triggerNotification(title,
			{
				detail: localize('notificationDetail', "New chat response.")
			}
		);
		if (!notification) {
			return;
		}

		const disposables = new DisposableStore();
		disposables.add(notification);
		this.notifications.add(disposables);

		disposables.add(Event.once(notification.onClick)(async () => {
			await this._hostService.focus(targetWindow, { mode: FocusMode.Force });
			await this._widgetService.reveal(widget);
			widget.focusInput();
			disposables.dispose();
			this.notifications.delete(disposables);
		}));

		disposables.add(this._hostService.onDidChangeFocus(focus => {
			if (focus) {
				disposables.dispose();
				this.notifications.delete(disposables);
			}
		}));
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatAgentHover.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatAgentHover.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { IManagedHoverOptions } from '../../../../base/browser/ui/hover/hover.js';
import { renderIcon } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { FileAccess } from '../../../../base/common/network.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { getFullyQualifiedId, IChatAgentData, IChatAgentNameService, IChatAgentService } from '../common/chatAgents.js';
import { showExtensionsWithIdsCommandId } from '../../extensions/browser/extensionsActions.js';
import { IExtensionsWorkbenchService } from '../../extensions/common/extensions.js';
import { verifiedPublisherIcon } from '../../../services/extensionManagement/common/extensionsIcons.js';

export class ChatAgentHover extends Disposable {
	public readonly domNode: HTMLElement;

	private readonly icon: HTMLElement;
	private readonly name: HTMLElement;
	private readonly extensionName: HTMLElement;
	private readonly publisherName: HTMLElement;
	private readonly description: HTMLElement;

	private readonly _onDidChangeContents = this._register(new Emitter<void>());
	public readonly onDidChangeContents: Event<void> = this._onDidChangeContents.event;

	constructor(
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
		@IExtensionsWorkbenchService private readonly extensionService: IExtensionsWorkbenchService,
		@IChatAgentNameService private readonly chatAgentNameService: IChatAgentNameService,
	) {
		super();

		const hoverElement = dom.h(
			'.chat-agent-hover@root',
			[
				dom.h('.chat-agent-hover-header', [
					dom.h('.chat-agent-hover-icon@icon'),
					dom.h('.chat-agent-hover-details', [
						dom.h('.chat-agent-hover-name@name'),
						dom.h('.chat-agent-hover-extension', [
							dom.h('.chat-agent-hover-extension-name@extensionName'),
							dom.h('.chat-agent-hover-separator@separator'),
							dom.h('.chat-agent-hover-publisher@publisher'),
						]),
					]),
				]),
				dom.h('.chat-agent-hover-warning@warning'),
				dom.h('span.chat-agent-hover-description@description'),
			]);
		this.domNode = hoverElement.root;

		this.icon = hoverElement.icon;
		this.name = hoverElement.name;
		this.extensionName = hoverElement.extensionName;
		this.description = hoverElement.description;

		hoverElement.separator.textContent = '|';

		const verifiedBadge = dom.$('span.extension-verified-publisher', undefined, renderIcon(verifiedPublisherIcon));

		this.publisherName = dom.$('span.chat-agent-hover-publisher-name');
		dom.append(
			hoverElement.publisher,
			verifiedBadge,
			this.publisherName);

		hoverElement.warning.appendChild(renderIcon(Codicon.warning));
		hoverElement.warning.appendChild(dom.$('span', undefined, localize('reservedName', "This chat extension is using a reserved name.")));
	}

	setAgent(id: string): void {
		const agent = this.chatAgentService.getAgent(id)!;
		if (agent.metadata.icon instanceof URI) {
			const avatarIcon = dom.$<HTMLImageElement>('img.icon');
			avatarIcon.src = FileAccess.uriToBrowserUri(agent.metadata.icon).toString(true);
			this.icon.replaceChildren(dom.$('.avatar', undefined, avatarIcon));
		} else if (agent.metadata.themeIcon) {
			const avatarIcon = dom.$(ThemeIcon.asCSSSelector(agent.metadata.themeIcon));
			this.icon.replaceChildren(dom.$('.avatar.codicon-avatar', undefined, avatarIcon));
		}

		this.domNode.classList.toggle('noExtensionName', !!agent.isDynamic);

		const isAllowed = this.chatAgentNameService.getAgentNameRestriction(agent);
		this.name.textContent = isAllowed ? `@${agent.name}` : getFullyQualifiedId(agent);
		this.extensionName.textContent = agent.extensionDisplayName;
		this.publisherName.textContent = agent.publisherDisplayName ?? agent.extensionPublisherId;

		let description = agent.description ?? '';
		if (description) {
			if (!description.match(/[\.\?\!] *$/)) {
				description += '.';
			}
		}

		this.description.textContent = description;
		this.domNode.classList.toggle('allowedName', isAllowed);

		this.domNode.classList.toggle('verifiedPublisher', false);
		if (!agent.isDynamic) {
			const cancel = this._register(new CancellationTokenSource());
			this.extensionService.getExtensions([{ id: agent.extensionId.value }], cancel.token).then(extensions => {
				cancel.dispose();
				const extension = extensions[0];
				if (extension?.publisherDomain?.verified) {
					this.domNode.classList.toggle('verifiedPublisher', true);
					this._onDidChangeContents.fire();
				}
			});
		}
	}
}

export function getChatAgentHoverOptions(getAgent: () => IChatAgentData | undefined, commandService: ICommandService): IManagedHoverOptions {
	return {
		actions: [
			{
				commandId: showExtensionsWithIdsCommandId,
				label: localize('viewExtensionLabel', "View Extension"),
				run: () => {
					const agent = getAgent();
					if (agent) {
						commandService.executeCommand(showExtensionsWithIdsCommandId, [agent.extensionId.value]);
					}
				},
			}
		]
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatAttachmentModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatAttachmentModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { Emitter } from '../../../../base/common/event.js';
import { basename } from '../../../../base/common/resources.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IChatRequestFileEntry, IChatRequestVariableEntry, isPromptFileVariableEntry } from '../common/chatVariableEntries.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ISharedWebContentExtractorService } from '../../../../platform/webContentExtractor/common/webContentExtractor.js';
import { Schemas } from '../../../../base/common/network.js';
import { IChatAttachmentResolveService } from './chatAttachmentResolveService.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { equals } from '../../../../base/common/objects.js';
import { Iterable } from '../../../../base/common/iterator.js';

export interface IChatAttachmentChangeEvent {
	readonly deleted: readonly string[];
	readonly added: readonly IChatRequestVariableEntry[];
	readonly updated: readonly IChatRequestVariableEntry[];
}

export class ChatAttachmentModel extends Disposable {

	private readonly _attachments = new Map<string, IChatRequestVariableEntry>();

	private _onDidChange = this._register(new Emitter<IChatAttachmentChangeEvent>());
	readonly onDidChange = this._onDidChange.event;

	constructor(
		@IFileService private readonly fileService: IFileService,
		@ISharedWebContentExtractorService private readonly webContentExtractorService: ISharedWebContentExtractorService,
		@IChatAttachmentResolveService private readonly chatAttachmentResolveService: IChatAttachmentResolveService,
	) {
		super();
	}

	get attachments(): ReadonlyArray<IChatRequestVariableEntry> {
		return Array.from(this._attachments.values());
	}

	get size(): number {
		return this._attachments.size;
	}

	get fileAttachments(): URI[] {
		return this.attachments.filter(file => file.kind === 'file' && URI.isUri(file.value))
			.map(file => file.value as URI);
	}

	getAttachmentIDs() {
		return new Set(this._attachments.keys());
	}

	async addFile(uri: URI, range?: IRange) {
		if (/\.(png|jpe?g|gif|bmp|webp)$/i.test(uri.path)) {
			const context = await this.asImageVariableEntry(uri);
			if (context) {
				this.addContext(context);
			}
			return;
		} else {
			this.addContext(this.asFileVariableEntry(uri, range));
		}
	}

	addFolder(uri: URI) {
		this.addContext({
			kind: 'directory',
			value: uri,
			id: uri.toString(),
			name: basename(uri),
		});
	}

	clear(clearStickyAttachments: boolean = false): void {
		if (clearStickyAttachments) {
			const deleted = Array.from(this._attachments.keys());
			this._attachments.clear();
			this._onDidChange.fire({ deleted, added: [], updated: [] });
		} else {
			const deleted: string[] = [];
			const allIds = Array.from(this._attachments.keys());
			for (const id of allIds) {
				const entry = this._attachments.get(id);
				if (entry && !isPromptFileVariableEntry(entry)) {
					this._attachments.delete(id);
					deleted.push(id);
				}
			}
			this._onDidChange.fire({ deleted, added: [], updated: [] });
		}
	}

	addContext(...attachments: IChatRequestVariableEntry[]) {
		attachments = attachments.filter(attachment => !this._attachments.has(attachment.id));
		this.updateContext(Iterable.empty(), attachments);
	}

	clearAndSetContext(...attachments: IChatRequestVariableEntry[]) {
		this.updateContext(Array.from(this._attachments.keys()), attachments);
	}

	delete(...variableEntryIds: string[]) {
		this.updateContext(variableEntryIds, Iterable.empty());
	}

	updateContext(toDelete: Iterable<string>, upsert: Iterable<IChatRequestVariableEntry>) {
		const deleted: string[] = [];
		const added: IChatRequestVariableEntry[] = [];
		const updated: IChatRequestVariableEntry[] = [];

		for (const id of toDelete) {
			const item = this._attachments.get(id);
			if (item) {
				this._attachments.delete(id);
				deleted.push(id);
			}
		}

		for (const item of upsert) {
			const oldItem = this._attachments.get(item.id);
			if (!oldItem) {
				this._attachments.set(item.id, item);
				added.push(item);
			} else if (!equals(oldItem, item)) {
				this._attachments.set(item.id, item);
				updated.push(item);
			}
		}

		if (deleted.length > 0 || added.length > 0 || updated.length > 0) {
			this._onDidChange.fire({ deleted, added, updated });
		}
	}

	// ---- create utils

	asFileVariableEntry(uri: URI, range?: IRange): IChatRequestFileEntry {
		return {
			kind: 'file',
			value: range ? { uri, range } : uri,
			id: uri.toString() + (range?.toString() ?? ''),
			name: basename(uri),
		};
	}

	// Gets an image variable for a given URI, which may be a file or a web URL
	async asImageVariableEntry(uri: URI): Promise<IChatRequestVariableEntry | undefined> {
		if (uri.scheme === Schemas.file && await this.fileService.canHandleResource(uri)) {
			return await this.chatAttachmentResolveService.resolveImageEditorAttachContext(uri);
		} else if (uri.scheme === Schemas.http || uri.scheme === Schemas.https) {
			const extractedImages = await this.webContentExtractorService.readImage(uri, CancellationToken.None);
			if (extractedImages) {
				return await this.chatAttachmentResolveService.resolveImageEditorAttachContext(uri, extractedImages);
			}
		}

		return undefined;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatAttachmentResolveService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatAttachmentResolveService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../base/common/buffer.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { basename } from '../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { SymbolKinds } from '../../../../editor/common/languages.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { localize } from '../../../../nls.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IDraggedResourceEditorInput, MarkerTransferData, DocumentSymbolTransferData, NotebookCellOutputTransferData } from '../../../../platform/dnd/browser/dnd.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { isUntitledResourceEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IExtensionService, isProposedApiEnabled } from '../../../services/extensions/common/extensions.js';
import { UntitledTextEditorInput } from '../../../services/untitled/common/untitledTextEditorInput.js';
import { createNotebookOutputVariableEntry, NOTEBOOK_CELL_OUTPUT_MIME_TYPE_LIST_FOR_CHAT_CONST } from '../../notebook/browser/contrib/chat/notebookChatUtils.js';
import { getOutputViewModelFromId } from '../../notebook/browser/controller/cellOutputActions.js';
import { getNotebookEditorFromEditorPane } from '../../notebook/browser/notebookBrowser.js';
import { SCMHistoryItemTransferData } from '../../scm/browser/scmHistoryChatContext.js';
import { CHAT_ATTACHABLE_IMAGE_MIME_TYPES, getAttachableImageExtension } from '../common/chatModel.js';
import { IChatRequestVariableEntry, OmittedState, IDiagnosticVariableEntry, IDiagnosticVariableEntryFilterData, ISymbolVariableEntry, toPromptFileVariableEntry, PromptFileVariableKind, ISCMHistoryItemVariableEntry } from '../common/chatVariableEntries.js';
import { getPromptsTypeForLanguageId, PromptsType } from '../common/promptSyntax/promptTypes.js';
import { imageToHash } from './chatPasteProviders.js';
import { resizeImage } from './chatImageUtils.js';

export const IChatAttachmentResolveService = createDecorator<IChatAttachmentResolveService>('IChatAttachmentResolveService');

export interface IChatAttachmentResolveService {
	_serviceBrand: undefined;

	resolveEditorAttachContext(editor: EditorInput | IDraggedResourceEditorInput): Promise<IChatRequestVariableEntry | undefined>;
	resolveUntitledEditorAttachContext(editor: IDraggedResourceEditorInput): Promise<IChatRequestVariableEntry | undefined>;
	resolveResourceAttachContext(resource: URI, isDirectory: boolean): Promise<IChatRequestVariableEntry | undefined>;

	resolveImageEditorAttachContext(resource: URI, data?: VSBuffer, mimeType?: string): Promise<IChatRequestVariableEntry | undefined>;
	resolveImageAttachContext(images: ImageTransferData[]): Promise<IChatRequestVariableEntry[]>;
	resolveMarkerAttachContext(markers: MarkerTransferData[]): IDiagnosticVariableEntry[];
	resolveSymbolsAttachContext(symbols: DocumentSymbolTransferData[]): ISymbolVariableEntry[];
	resolveNotebookOutputAttachContext(data: NotebookCellOutputTransferData): IChatRequestVariableEntry[];
	resolveSourceControlHistoryItemAttachContext(data: SCMHistoryItemTransferData[]): ISCMHistoryItemVariableEntry[];
}

export class ChatAttachmentResolveService implements IChatAttachmentResolveService {
	_serviceBrand: undefined;

	constructor(
		@IFileService private fileService: IFileService,
		@IEditorService private editorService: IEditorService,
		@ITextModelService private textModelService: ITextModelService,
		@IExtensionService private extensionService: IExtensionService,
		@IDialogService private dialogService: IDialogService
	) { }

	// --- EDITORS ---

	public async resolveEditorAttachContext(editor: EditorInput | IDraggedResourceEditorInput): Promise<IChatRequestVariableEntry | undefined> {
		// untitled editor
		if (isUntitledResourceEditorInput(editor)) {
			return await this.resolveUntitledEditorAttachContext(editor);
		}

		if (!editor.resource) {
			return undefined;
		}

		let stat;
		try {
			stat = await this.fileService.stat(editor.resource);
		} catch {
			return undefined;
		}

		if (!stat.isDirectory && !stat.isFile) {
			return undefined;
		}

		const imageContext = await this.resolveImageEditorAttachContext(editor.resource);
		if (imageContext) {
			return this.extensionService.extensions.some(ext => isProposedApiEnabled(ext, 'chatReferenceBinaryData')) ? imageContext : undefined;
		}

		return await this.resolveResourceAttachContext(editor.resource, stat.isDirectory);
	}

	public async resolveUntitledEditorAttachContext(editor: IDraggedResourceEditorInput): Promise<IChatRequestVariableEntry | undefined> {
		// If the resource is known, we can use it directly
		if (editor.resource) {
			return await this.resolveResourceAttachContext(editor.resource, false);
		}

		// Otherwise, we need to check if the contents are already open in another editor
		const openUntitledEditors = this.editorService.editors.filter(editor => editor instanceof UntitledTextEditorInput) as UntitledTextEditorInput[];
		for (const canidate of openUntitledEditors) {
			const model = await canidate.resolve();
			const contents = model.textEditorModel?.getValue();
			if (contents === editor.contents) {
				return await this.resolveResourceAttachContext(canidate.resource, false);
			}
		}

		return undefined;
	}

	public async resolveResourceAttachContext(resource: URI, isDirectory: boolean): Promise<IChatRequestVariableEntry | undefined> {
		let omittedState = OmittedState.NotOmitted;

		if (!isDirectory) {

			let languageId: string | undefined;
			try {
				const createdModel = await this.textModelService.createModelReference(resource);
				languageId = createdModel.object.getLanguageId();
				createdModel.dispose();
			} catch {
				omittedState = OmittedState.Full;
			}

			if (/\.(svg)$/i.test(resource.path)) {
				omittedState = OmittedState.Full;
			}
			if (languageId) {
				const promptsType = getPromptsTypeForLanguageId(languageId);
				if (promptsType === PromptsType.prompt) {
					return toPromptFileVariableEntry(resource, PromptFileVariableKind.PromptFile);
				} else if (promptsType === PromptsType.instructions) {
					return toPromptFileVariableEntry(resource, PromptFileVariableKind.Instruction);
				}
			}
		}

		return {
			kind: isDirectory ? 'directory' : 'file',
			value: resource,
			id: resource.toString(),
			name: basename(resource),
			omittedState
		};
	}

	// --- IMAGES ---

	public async resolveImageEditorAttachContext(resource: URI, data?: VSBuffer, mimeType?: string): Promise<IChatRequestVariableEntry | undefined> {
		if (!resource) {
			return undefined;
		}

		if (mimeType) {
			if (!getAttachableImageExtension(mimeType)) {
				return undefined;
			}
		} else {
			const match = SUPPORTED_IMAGE_EXTENSIONS_REGEX.exec(resource.path);
			if (!match) {
				return undefined;
			}

			mimeType = getMimeTypeFromPath(match);
		}
		const fileName = basename(resource);

		let dataBuffer: VSBuffer | undefined;
		if (data) {
			dataBuffer = data;
		} else {

			let stat;
			try {
				stat = await this.fileService.stat(resource);
			} catch {
				return undefined;
			}

			const readFile = await this.fileService.readFile(resource);

			if (stat.size > 30 * 1024 * 1024) { // 30 MB
				this.dialogService.error(localize('imageTooLarge', 'Image is too large'), localize('imageTooLargeMessage', 'The image {0} is too large to be attached.', fileName));
				throw new Error('Image is too large');
			}

			dataBuffer = readFile.value;
		}

		const isPartiallyOmitted = /\.gif$/i.test(resource.path);
		const imageFileContext = await this.resolveImageAttachContext([{
			id: resource.toString(),
			name: fileName,
			data: dataBuffer.buffer,
			icon: Codicon.fileMedia,
			resource: resource,
			mimeType: mimeType,
			omittedState: isPartiallyOmitted ? OmittedState.Partial : OmittedState.NotOmitted
		}]);

		return imageFileContext[0];
	}

	public resolveImageAttachContext(images: ImageTransferData[]): Promise<IChatRequestVariableEntry[]> {
		return Promise.all(images.map(async image => ({
			id: image.id || await imageToHash(image.data),
			name: image.name,
			fullName: image.resource ? image.resource.path : undefined,
			value: await resizeImage(image.data, image.mimeType),
			icon: image.icon,
			kind: 'image',
			isFile: false,
			isDirectory: false,
			omittedState: image.omittedState || OmittedState.NotOmitted,
			references: image.resource ? [{ reference: image.resource, kind: 'reference' }] : []
		})));
	}

	// --- MARKERS ---

	public resolveMarkerAttachContext(markers: MarkerTransferData[]): IDiagnosticVariableEntry[] {
		return markers.map((marker): IDiagnosticVariableEntry => {
			let filter: IDiagnosticVariableEntryFilterData;
			if (!('severity' in marker)) {
				filter = { filterUri: URI.revive(marker.uri), filterSeverity: MarkerSeverity.Warning };
			} else {
				filter = IDiagnosticVariableEntryFilterData.fromMarker(marker);
			}

			return IDiagnosticVariableEntryFilterData.toEntry(filter);
		});
	}

	// --- SYMBOLS ---

	public resolveSymbolsAttachContext(symbols: DocumentSymbolTransferData[]): ISymbolVariableEntry[] {
		return symbols.map(symbol => {
			const resource = URI.file(symbol.fsPath);
			return {
				kind: 'symbol',
				id: symbolId(resource, symbol.range),
				value: { uri: resource, range: symbol.range },
				symbolKind: symbol.kind,
				icon: SymbolKinds.toIcon(symbol.kind),
				fullName: symbol.name,
				name: symbol.name,
			};
		});
	}

	// --- NOTEBOOKS ---

	public resolveNotebookOutputAttachContext(data: NotebookCellOutputTransferData): IChatRequestVariableEntry[] {
		const notebookEditor = getNotebookEditorFromEditorPane(this.editorService.activeEditorPane);
		if (!notebookEditor) {
			return [];
		}

		const outputViewModel = getOutputViewModelFromId(data.outputId, notebookEditor);
		if (!outputViewModel) {
			return [];
		}

		const mimeType = outputViewModel.pickedMimeType?.mimeType;
		if (mimeType && NOTEBOOK_CELL_OUTPUT_MIME_TYPE_LIST_FOR_CHAT_CONST.includes(mimeType)) {

			const entry = createNotebookOutputVariableEntry(outputViewModel, mimeType, notebookEditor);
			if (!entry) {
				return [];
			}

			return [entry];
		}

		return [];
	}

	// --- SOURCE CONTROL ---

	public resolveSourceControlHistoryItemAttachContext(data: SCMHistoryItemTransferData[]): ISCMHistoryItemVariableEntry[] {
		return data.map(d => ({
			id: d.historyItem.id,
			name: d.name,
			value: URI.revive(d.resource),
			historyItem: {
				...d.historyItem,
				references: []
			},
			kind: 'scmHistoryItem'
		} satisfies ISCMHistoryItemVariableEntry));
	}
}

function symbolId(resource: URI, range?: IRange): string {
	let rangePart = '';
	if (range) {
		rangePart = `:${range.startLineNumber}`;
		if (range.startLineNumber !== range.endLineNumber) {
			rangePart += `-${range.endLineNumber}`;
		}
	}
	return resource.fsPath + rangePart;
}

export type ImageTransferData = {
	data: Uint8Array;
	name: string;
	icon?: ThemeIcon;
	resource?: URI;
	id?: string;
	mimeType?: string;
	omittedState?: OmittedState;
};
const SUPPORTED_IMAGE_EXTENSIONS_REGEX = new RegExp(`\\.(${Object.keys(CHAT_ATTACHABLE_IMAGE_MIME_TYPES).join('|')})$`, 'i');

function getMimeTypeFromPath(match: RegExpExecArray): string | undefined {
	const ext = match[1].toLowerCase();
	return CHAT_ATTACHABLE_IMAGE_MIME_TYPES[ext];
}
```

--------------------------------------------------------------------------------

````
