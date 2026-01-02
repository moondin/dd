---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 377
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 377 of 552)

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

---[FILE: src/vs/workbench/contrib/debug/browser/callStackWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/callStackWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { IListRenderer, IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { assertNever } from '../../../../base/common/assert.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { autorun, autorunWithStore, derived, IObservable, ISettableObservable, observableValue, transaction } from '../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Constants } from '../../../../base/common/uint.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorContributionCtor, EditorContributionInstantiation, IEditorContributionDescription } from '../../../../editor/browser/editorExtensions.js';
import { CodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { EmbeddedCodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { IEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { IWordAtPosition } from '../../../../editor/common/core/wordHelper.js';
import { IEditorContribution, IEditorDecorationsCollection } from '../../../../editor/common/editorCommon.js';
import { Location } from '../../../../editor/common/languages.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { ClickLinkGesture, ClickLinkMouseEvent } from '../../../../editor/contrib/gotoSymbol/browser/link/clickLinkGesture.js';
import { localize, localize2 } from '../../../../nls.js';
import { createActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { MenuWorkbenchToolBar } from '../../../../platform/actions/browser/toolbar.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { TextEditorSelectionRevealType } from '../../../../platform/editor/common/editor.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { WorkbenchList } from '../../../../platform/list/browser/listService.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { defaultButtonStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { ResourceLabel } from '../../../browser/labels.js';
import { IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { makeStackFrameColumnDecoration, TOP_STACK_FRAME_DECORATION } from './callStackEditorContribution.js';
import './media/callStackWidget.css';


export class CallStackFrame {
	constructor(
		public readonly name: string,
		public readonly source?: URI,
		public readonly line = 1,
		public readonly column = 1,
	) { }
}

export class SkippedCallFrames {
	constructor(
		public readonly label: string,
		public readonly load: (token: CancellationToken) => Promise<AnyStackFrame[]>,
	) { }
}

export abstract class CustomStackFrame {
	public readonly showHeader = observableValue('CustomStackFrame.showHeader', true);
	public abstract readonly height: IObservable<number>;
	public abstract readonly label: string;
	public icon?: ThemeIcon;
	public abstract render(container: HTMLElement): IDisposable;
	public renderActions?(container: HTMLElement): IDisposable;
}

export type AnyStackFrame = SkippedCallFrames | CallStackFrame | CustomStackFrame;

interface IFrameLikeItem {
	readonly collapsed: ISettableObservable<boolean>;
	readonly height: IObservable<number>;
}

class WrappedCallStackFrame extends CallStackFrame implements IFrameLikeItem {
	public readonly editorHeight = observableValue('WrappedCallStackFrame.height', this.source ? 100 : 0);
	public readonly collapsed = observableValue('WrappedCallStackFrame.collapsed', false);

	public readonly height = derived(reader => {
		return this.collapsed.read(reader) ? CALL_STACK_WIDGET_HEADER_HEIGHT : CALL_STACK_WIDGET_HEADER_HEIGHT + this.editorHeight.read(reader);
	});

	constructor(original: CallStackFrame) {
		super(original.name, original.source, original.line, original.column);
	}
}

class WrappedCustomStackFrame implements IFrameLikeItem {
	public readonly collapsed = observableValue('WrappedCallStackFrame.collapsed', false);

	public readonly height = derived(reader => {
		const headerHeight = this.original.showHeader.read(reader) ? CALL_STACK_WIDGET_HEADER_HEIGHT : 0;
		return this.collapsed.read(reader) ? headerHeight : headerHeight + this.original.height.read(reader);
	});

	constructor(public readonly original: CustomStackFrame) { }
}

const isFrameLike = (item: unknown): item is IFrameLikeItem =>
	item instanceof WrappedCallStackFrame || item instanceof WrappedCustomStackFrame;

type ListItem = WrappedCallStackFrame | SkippedCallFrames | WrappedCustomStackFrame;

const WIDGET_CLASS_NAME = 'multiCallStackWidget';

/**
 * A reusable widget that displays a call stack as a series of editors. Note
 * that this both used in debug's exception widget as well as in the testing
 * call stack view.
 */
export class CallStackWidget extends Disposable {
	private readonly list: WorkbenchList<ListItem>;
	private readonly layoutEmitter = this._register(new Emitter<void>());
	private readonly currentFramesDs = this._register(new DisposableStore());
	private cts?: CancellationTokenSource;

	public get onDidChangeContentHeight() {
		return this.list.onDidChangeContentHeight;
	}

	public get onDidScroll() {
		return this.list.onDidScroll;
	}

	public get contentHeight() {
		return this.list.contentHeight;
	}

	constructor(
		container: HTMLElement,
		containingEditor: ICodeEditor | undefined,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();

		container.classList.add(WIDGET_CLASS_NAME);
		this._register(toDisposable(() => container.classList.remove(WIDGET_CLASS_NAME)));

		this.list = this._register(instantiationService.createInstance(
			WorkbenchList,
			'TestResultStackWidget',
			container,
			new StackDelegate(),
			[
				instantiationService.createInstance(FrameCodeRenderer, containingEditor, this.layoutEmitter.event),
				instantiationService.createInstance(MissingCodeRenderer),
				instantiationService.createInstance(CustomRenderer),
				instantiationService.createInstance(SkippedRenderer, (i) => this.loadFrame(i)),
			],
			{
				multipleSelectionSupport: false,
				mouseSupport: false,
				keyboardSupport: false,
				setRowLineHeight: false,
				alwaysConsumeMouseWheel: false,
				accessibilityProvider: instantiationService.createInstance(StackAccessibilityProvider),
			}
		) as WorkbenchList<ListItem>);
	}

	/** Replaces the call frames display in the view. */
	public setFrames(frames: AnyStackFrame[]): void {
		// cancel any existing load
		this.currentFramesDs.clear();
		this.cts = new CancellationTokenSource();
		this._register(toDisposable(() => this.cts!.dispose(true)));

		this.list.splice(0, this.list.length, this.mapFrames(frames));
	}

	public layout(height?: number, width?: number): void {
		this.list.layout(height, width);
		this.layoutEmitter.fire();
	}

	public collapseAll() {
		transaction(tx => {
			for (let i = 0; i < this.list.length; i++) {
				const frame = this.list.element(i);
				if (isFrameLike(frame)) {
					frame.collapsed.set(true, tx);
				}
			}
		});
	}

	private async loadFrame(replacing: SkippedCallFrames): Promise<void> {
		if (!this.cts) {
			return;
		}

		const frames = await replacing.load(this.cts.token);
		if (this.cts.token.isCancellationRequested) {
			return;
		}

		const index = this.list.indexOf(replacing);
		this.list.splice(index, 1, this.mapFrames(frames));
	}

	private mapFrames(frames: AnyStackFrame[]): ListItem[] {
		const result: ListItem[] = [];
		for (const frame of frames) {
			if (frame instanceof SkippedCallFrames) {
				result.push(frame);
				continue;
			}

			const wrapped = frame instanceof CustomStackFrame
				? new WrappedCustomStackFrame(frame) : new WrappedCallStackFrame(frame);
			result.push(wrapped);

			this.currentFramesDs.add(autorun(reader => {
				const height = wrapped.height.read(reader);
				const idx = this.list.indexOf(wrapped);
				if (idx !== -1) {
					this.list.updateElementHeight(idx, height);
				}
			}));
		}

		return result;
	}
}

class StackAccessibilityProvider implements IListAccessibilityProvider<ListItem> {
	constructor(@ILabelService private readonly labelService: ILabelService) { }

	getAriaLabel(e: ListItem): string | IObservable<string> | null {
		if (e instanceof SkippedCallFrames) {
			return e.label;
		}

		if (e instanceof WrappedCustomStackFrame) {
			return e.original.label;
		}

		if (e instanceof CallStackFrame) {
			if (e.source && e.line) {
				return localize({
					comment: ['{0} is an extension-defined label, then line number and filename'],
					key: 'stackTraceLabel',
				}, '{0}, line {1} in {2}', e.name, e.line, this.labelService.getUriLabel(e.source, { relative: true }));
			}

			return e.name;
		}

		assertNever(e);
	}
	getWidgetAriaLabel(): string {
		return localize('stackTrace', 'Stack Trace');
	}
}

class StackDelegate implements IListVirtualDelegate<ListItem> {
	getHeight(element: ListItem): number {
		if (element instanceof CallStackFrame || element instanceof WrappedCustomStackFrame) {
			return element.height.get();
		}
		if (element instanceof SkippedCallFrames) {
			return CALL_STACK_WIDGET_HEADER_HEIGHT;
		}

		assertNever(element);
	}

	getTemplateId(element: ListItem): string {
		if (element instanceof CallStackFrame) {
			return element.source ? FrameCodeRenderer.templateId : MissingCodeRenderer.templateId;
		}
		if (element instanceof SkippedCallFrames) {
			return SkippedRenderer.templateId;
		}
		if (element instanceof WrappedCustomStackFrame) {
			return CustomRenderer.templateId;
		}

		assertNever(element);
	}
}

interface IStackTemplateData extends IAbstractFrameRendererTemplateData {
	editor: CodeEditorWidget;
	toolbar: MenuWorkbenchToolBar;
}

const editorOptions: IEditorOptions = {
	scrollBeyondLastLine: false,
	scrollbar: {
		vertical: 'hidden',
		horizontal: 'hidden',
		handleMouseWheel: false,
		useShadows: false,
	},
	overviewRulerLanes: 0,
	fixedOverflowWidgets: true,
	overviewRulerBorder: false,
	stickyScroll: { enabled: false },
	minimap: { enabled: false },
	readOnly: true,
	automaticLayout: false,
};

const makeFrameElements = () => dom.h('div.multiCallStackFrame', [
	dom.h('div.header@header', [
		dom.h('div.collapse-button@collapseButton'),
		dom.h('div.title.show-file-icons@title'),
		dom.h('div.actions@actions'),
	]),

	dom.h('div.editorParent', [
		dom.h('div.editorContainer@editor'),
	])
]);

export const CALL_STACK_WIDGET_HEADER_HEIGHT = 24;

interface IAbstractFrameRendererTemplateData {
	container: HTMLElement;
	label: ResourceLabel;
	elements: ReturnType<typeof makeFrameElements>;
	decorations: string[];
	collapse: Button;
	elementStore: DisposableStore;
	templateStore: DisposableStore;
}

abstract class AbstractFrameRenderer<T extends IAbstractFrameRendererTemplateData> implements IListRenderer<ListItem, T> {
	public abstract templateId: string;

	constructor(
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
	) { }

	renderTemplate(container: HTMLElement): T {
		const elements = makeFrameElements();
		container.appendChild(elements.root);


		const templateStore = new DisposableStore();
		container.classList.add('multiCallStackFrameContainer');
		templateStore.add(toDisposable(() => {
			container.classList.remove('multiCallStackFrameContainer');
			elements.root.remove();
		}));

		const label = templateStore.add(this.instantiationService.createInstance(ResourceLabel, elements.title, {}));

		const collapse = templateStore.add(new Button(elements.collapseButton, {}));

		const contentId = generateUuid();
		elements.editor.id = contentId;
		elements.editor.role = 'region';
		elements.collapseButton.setAttribute('aria-controls', contentId);

		return this.finishRenderTemplate({
			container,
			decorations: [],
			elements,
			label,
			collapse,
			elementStore: templateStore.add(new DisposableStore()),
			templateStore,
		});
	}

	protected abstract finishRenderTemplate(data: IAbstractFrameRendererTemplateData): T;

	renderElement(element: ListItem, index: number, template: T): void {
		const { elementStore } = template;
		elementStore.clear();
		const item = element as IFrameLikeItem;

		this.setupCollapseButton(item, template);
	}

	private setupCollapseButton(item: IFrameLikeItem, { elementStore, elements, collapse }: T) {
		elementStore.add(autorun(reader => {
			collapse.element.className = '';
			const collapsed = item.collapsed.read(reader);
			collapse.icon = collapsed ? Codicon.chevronRight : Codicon.chevronDown;
			collapse.element.ariaExpanded = String(!collapsed);
			elements.root.classList.toggle('collapsed', collapsed);
		}));
		const toggleCollapse = () => item.collapsed.set(!item.collapsed.get(), undefined);
		elementStore.add(collapse.onDidClick(toggleCollapse));
		elementStore.add(dom.addDisposableListener(elements.title, 'click', toggleCollapse));
	}

	disposeElement(element: ListItem, index: number, templateData: T): void {
		templateData.elementStore.clear();
	}

	disposeTemplate(templateData: T): void {
		templateData.templateStore.dispose();
	}
}

const CONTEXT_LINES = 2;

/** Renderer for a normal stack frame where code is available. */
class FrameCodeRenderer extends AbstractFrameRenderer<IStackTemplateData> {
	public static readonly templateId = 'f';

	public readonly templateId = FrameCodeRenderer.templateId;

	constructor(
		private readonly containingEditor: ICodeEditor | undefined,
		private readonly onLayout: Event<void>,
		@ITextModelService private readonly modelService: ITextModelService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super(instantiationService);
	}

	protected override finishRenderTemplate(data: IAbstractFrameRendererTemplateData): IStackTemplateData {
		// override default e.g. language contributions, only allow users to click
		// on code in the call stack to go to its source location
		const contributions: IEditorContributionDescription[] = [{
			id: ClickToLocationContribution.ID,
			instantiation: EditorContributionInstantiation.BeforeFirstInteraction,
			ctor: ClickToLocationContribution as EditorContributionCtor,
		}];

		const editor = this.containingEditor
			? this.instantiationService.createInstance(
				EmbeddedCodeEditorWidget,
				data.elements.editor,
				editorOptions,
				{ isSimpleWidget: true, contributions },
				this.containingEditor,
			)
			: this.instantiationService.createInstance(
				CodeEditorWidget,
				data.elements.editor,
				editorOptions,
				{ isSimpleWidget: true, contributions },
			);

		data.templateStore.add(editor);

		const toolbar = data.templateStore.add(this.instantiationService.createInstance(MenuWorkbenchToolBar, data.elements.actions, MenuId.DebugCallStackToolbar, {
			menuOptions: { shouldForwardArgs: true },
			actionViewItemProvider: (action, options) => createActionViewItem(this.instantiationService, action, options),
		}));

		return { ...data, editor, toolbar };
	}

	override renderElement(element: ListItem, index: number, template: IStackTemplateData): void {
		super.renderElement(element, index, template);

		const { elementStore, editor } = template;

		const item = element as WrappedCallStackFrame;
		const uri = item.source!;

		template.label.element.setFile(uri);
		const cts = new CancellationTokenSource();
		elementStore.add(toDisposable(() => cts.dispose(true)));
		this.modelService.createModelReference(uri).then(reference => {
			if (cts.token.isCancellationRequested) {
				return reference.dispose();
			}

			elementStore.add(reference);
			editor.setModel(reference.object.textEditorModel);
			this.setupEditorAfterModel(item, template);
			this.setupEditorLayout(item, template);
		});
	}

	private setupEditorLayout(item: WrappedCallStackFrame, { elementStore, container, editor }: IStackTemplateData) {
		const layout = () => {
			const prev = editor.getContentHeight();
			editor.layout({ width: container.clientWidth, height: prev });

			const next = editor.getContentHeight();
			if (next !== prev) {
				editor.layout({ width: container.clientWidth, height: next });
			}

			item.editorHeight.set(next, undefined);
		};
		elementStore.add(editor.onDidChangeModelDecorations(layout));
		elementStore.add(editor.onDidChangeModelContent(layout));
		elementStore.add(editor.onDidChangeModelOptions(layout));
		elementStore.add(this.onLayout(layout));
		layout();
	}

	private setupEditorAfterModel(item: WrappedCallStackFrame, template: IStackTemplateData): void {
		const range = Range.fromPositions({
			column: item.column ?? 1,
			lineNumber: item.line ?? 1,
		});

		template.toolbar.context = { uri: item.source, range };

		template.editor.setHiddenAreas([
			Range.fromPositions(
				{ column: 1, lineNumber: 1 },
				{ column: 1, lineNumber: Math.max(1, item.line - CONTEXT_LINES - 1) },
			),
			Range.fromPositions(
				{ column: 1, lineNumber: item.line + CONTEXT_LINES + 1 },
				{ column: 1, lineNumber: Constants.MAX_SAFE_SMALL_INTEGER },
			),
		]);

		template.editor.changeDecorations(accessor => {
			for (const d of template.decorations) {
				accessor.removeDecoration(d);
			}
			template.decorations.length = 0;

			const beforeRange = range.setStartPosition(range.startLineNumber, 1);
			const hasCharactersBefore = !!template.editor.getModel()?.getValueInRange(beforeRange).trim();
			const decoRange = range.setEndPosition(range.startLineNumber, Constants.MAX_SAFE_SMALL_INTEGER);

			template.decorations.push(accessor.addDecoration(
				decoRange,
				makeStackFrameColumnDecoration(!hasCharactersBefore),
			));
			template.decorations.push(accessor.addDecoration(
				decoRange,
				TOP_STACK_FRAME_DECORATION,
			));
		});

		item.editorHeight.set(template.editor.getContentHeight(), undefined);
	}
}

interface IMissingTemplateData {
	elements: ReturnType<typeof makeFrameElements>;
	label: ResourceLabel;
}

/** Renderer for a call frame that's missing a URI */
class MissingCodeRenderer implements IListRenderer<ListItem, IMissingTemplateData> {
	public static readonly templateId = 'm';
	public readonly templateId = MissingCodeRenderer.templateId;

	constructor(@IInstantiationService private readonly instantiationService: IInstantiationService) { }

	renderTemplate(container: HTMLElement): IMissingTemplateData {
		const elements = makeFrameElements();
		elements.root.classList.add('missing');
		container.appendChild(elements.root);
		const label = this.instantiationService.createInstance(ResourceLabel, elements.title, {});
		return { elements, label };
	}

	renderElement(element: ListItem, _index: number, templateData: IMissingTemplateData): void {
		const cast = element as CallStackFrame;
		templateData.label.element.setResource({
			name: cast.name,
			description: localize('stackFrameLocation', 'Line {0} column {1}', cast.line, cast.column),
			range: { startLineNumber: cast.line, startColumn: cast.column, endColumn: cast.column, endLineNumber: cast.line },
		}, {
			icon: Codicon.fileBinary,
		});
	}

	disposeTemplate(templateData: IMissingTemplateData): void {
		templateData.label.dispose();
		templateData.elements.root.remove();
	}
}

/** Renderer for a call frame that's missing a URI */
class CustomRenderer extends AbstractFrameRenderer<IAbstractFrameRendererTemplateData> {
	public static readonly templateId = 'c';
	public readonly templateId = CustomRenderer.templateId;

	protected override finishRenderTemplate(data: IAbstractFrameRendererTemplateData): IAbstractFrameRendererTemplateData {
		return data;
	}

	override renderElement(element: ListItem, index: number, template: IAbstractFrameRendererTemplateData): void {
		super.renderElement(element, index, template);

		const item = element as WrappedCustomStackFrame;
		const { elementStore, container, label } = template;

		label.element.setResource({ name: item.original.label }, { icon: item.original.icon });

		elementStore.add(autorun(reader => {
			template.elements.header.style.display = item.original.showHeader.read(reader) ? '' : 'none';
		}));

		elementStore.add(autorunWithStore((reader, store) => {
			if (!item.collapsed.read(reader)) {
				store.add(item.original.render(container));
			}
		}));

		const actions = item.original.renderActions?.(template.elements.actions);
		if (actions) {
			elementStore.add(actions);
		}
	}
}

interface ISkippedTemplateData {
	button: Button;
	current?: SkippedCallFrames;
	store: DisposableStore;
}

/** Renderer for a button to load more call frames */
class SkippedRenderer implements IListRenderer<ListItem, ISkippedTemplateData> {
	public static readonly templateId = 's';
	public readonly templateId = SkippedRenderer.templateId;

	constructor(
		private readonly loadFrames: (fromItem: SkippedCallFrames) => Promise<void>,
		@INotificationService private readonly notificationService: INotificationService,
	) { }

	renderTemplate(container: HTMLElement): ISkippedTemplateData {
		const store = new DisposableStore();
		const button = new Button(container, { title: '', ...defaultButtonStyles });
		const data: ISkippedTemplateData = { button, store };

		store.add(button);
		store.add(button.onDidClick(() => {
			if (!data.current || !button.enabled) {
				return;
			}

			button.enabled = false;
			this.loadFrames(data.current).catch(e => {
				this.notificationService.error(localize('failedToLoadFrames', 'Failed to load stack frames: {0}', e.message));
			});
		}));

		return data;
	}

	renderElement(element: ListItem, index: number, templateData: ISkippedTemplateData): void {
		const cast = element as SkippedCallFrames;
		templateData.button.enabled = true;
		templateData.button.label = cast.label;
		templateData.current = cast;
	}

	disposeTemplate(templateData: ISkippedTemplateData): void {
		templateData.store.dispose();
	}
}

/** A simple contribution that makes all data in the editor clickable to go to the location */
class ClickToLocationContribution extends Disposable implements IEditorContribution {
	public static readonly ID = 'clickToLocation';
	private readonly linkDecorations: IEditorDecorationsCollection;
	private current: { line: number; word: IWordAtPosition } | undefined;

	constructor(
		private readonly editor: ICodeEditor,
		@IEditorService editorService: IEditorService,
	) {
		super();
		this.linkDecorations = editor.createDecorationsCollection();
		this._register(toDisposable(() => this.linkDecorations.clear()));

		const clickLinkGesture = this._register(new ClickLinkGesture(editor));

		this._register(clickLinkGesture.onMouseMoveOrRelevantKeyDown(([mouseEvent, keyboardEvent]) => {
			this.onMove(mouseEvent);
		}));
		this._register(clickLinkGesture.onExecute((e) => {
			const model = this.editor.getModel();
			if (!this.current || !model) {
				return;
			}

			editorService.openEditor({
				resource: model.uri,
				options: {
					selection: Range.fromPositions(new Position(this.current.line, this.current.word.startColumn)),
					selectionRevealType: TextEditorSelectionRevealType.CenterIfOutsideViewport,
				},
			}, e.hasSideBySideModifier ? SIDE_GROUP : undefined);
		}));
	}

	private onMove(mouseEvent: ClickLinkMouseEvent) {
		if (!mouseEvent.hasTriggerModifier) {
			return this.clear();
		}

		const position = mouseEvent.target.position;
		const word = position && this.editor.getModel()?.getWordAtPosition(position);
		if (!word) {
			return this.clear();
		}

		const prev = this.current?.word;
		if (prev && prev.startColumn === word.startColumn && prev.endColumn === word.endColumn && prev.word === word.word) {
			return;
		}

		this.current = { word, line: position.lineNumber };
		this.linkDecorations.set([{
			range: new Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
			options: {
				description: 'call-stack-go-to-file-link',
				inlineClassName: 'call-stack-go-to-file-link',
			},
		}]);
	}

	private clear() {
		this.linkDecorations.clear();
		this.current = undefined;
	}
}

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'callStackWidget.goToFile',
			title: localize2('goToFile', 'Open File'),
			icon: Codicon.goToFile,
			menu: {
				id: MenuId.DebugCallStackToolbar,
				order: 22,
				group: 'navigation',
			},
		});
	}

	async run(accessor: ServicesAccessor, { uri, range }: Location): Promise<void> {
		const editorService = accessor.get(IEditorService);
		await editorService.openEditor({
			resource: uri,
			options: {
				selection: range,
				selectionRevealType: TextEditorSelectionRevealType.CenterIfOutsideViewport,
			},
		});
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debug.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debug.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { FileAccess } from '../../../../base/common/network.js';
import { isMacintosh, isWeb } from '../../../../base/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../../editor/browser/editorExtensions.js';
import * as nls from '../../../../nls.js';
import { AccessibleViewRegistry } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { ICommandActionTitle, Icon } from '../../../../platform/action/common/action.js';
import { MenuId, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { Extensions as ConfigurationExtensions, ConfigurationScope, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { ContextKeyExpr, ContextKeyExpression } from '../../../../platform/contextkey/common/contextkey.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { KeybindingWeight, KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IQuickAccessRegistry, Extensions as QuickAccessExtensions } from '../../../../platform/quickinput/common/quickAccess.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { FocusedViewContext } from '../../../common/contextkeys.js';
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { EditorExtensions } from '../../../common/editor.js';
import { IViewContainersRegistry, IViewsRegistry, ViewContainer, ViewContainerLocation, Extensions as ViewExtensions } from '../../../common/views.js';
import { launchSchemaId } from '../../../services/configuration/common/configuration.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { COPY_NOTEBOOK_VARIABLE_VALUE_ID, COPY_NOTEBOOK_VARIABLE_VALUE_LABEL } from '../../notebook/browser/contrib/notebookVariables/notebookVariableCommands.js';
import { BREAKPOINTS_VIEW_ID, BREAKPOINT_EDITOR_CONTRIBUTION_ID, CALLSTACK_VIEW_ID, CONTEXT_BREAKPOINTS_EXIST, CONTEXT_BREAK_WHEN_VALUE_CHANGES_SUPPORTED, CONTEXT_BREAK_WHEN_VALUE_IS_ACCESSED_SUPPORTED, CONTEXT_BREAK_WHEN_VALUE_IS_READ_SUPPORTED, CONTEXT_CALLSTACK_ITEM_TYPE, CONTEXT_CAN_VIEW_MEMORY, CONTEXT_DEBUGGERS_AVAILABLE, CONTEXT_DEBUG_STATE, CONTEXT_DEBUG_UX, CONTEXT_EXPRESSION_SELECTED, CONTEXT_FOCUSED_SESSION_IS_ATTACH, CONTEXT_FOCUSED_SESSION_IS_NO_DEBUG, CONTEXT_HAS_DEBUGGED, CONTEXT_IN_DEBUG_MODE, CONTEXT_JUMP_TO_CURSOR_SUPPORTED, CONTEXT_LOADED_SCRIPTS_SUPPORTED, CONTEXT_RESTART_FRAME_SUPPORTED, CONTEXT_SET_EXPRESSION_SUPPORTED, CONTEXT_SET_VARIABLE_SUPPORTED, CONTEXT_STACK_FRAME_SUPPORTS_RESTART, CONTEXT_STEP_INTO_TARGETS_SUPPORTED, CONTEXT_SUSPEND_DEBUGGEE_SUPPORTED, CONTEXT_TERMINATE_DEBUGGEE_SUPPORTED, CONTEXT_TERMINATE_THREADS_SUPPORTED, CONTEXT_VARIABLE_EVALUATE_NAME_PRESENT, CONTEXT_VARIABLE_IS_READONLY, CONTEXT_VARIABLE_VALUE, CONTEXT_WATCH_ITEM_TYPE, DEBUG_PANEL_ID, DISASSEMBLY_VIEW_ID, EDITOR_CONTRIBUTION_ID, IDebugService, INTERNAL_CONSOLE_OPTIONS_SCHEMA, LOADED_SCRIPTS_VIEW_ID, REPL_VIEW_ID, State, VARIABLES_VIEW_ID, VIEWLET_ID, WATCH_VIEW_ID, getStateLabel } from '../common/debug.js';
import { DebugWatchAccessibilityAnnouncer } from '../common/debugAccessibilityAnnouncer.js';
import { DebugContentProvider } from '../common/debugContentProvider.js';
import { DebugLifecycle } from '../common/debugLifecycle.js';
import { DebugVisualizerService, IDebugVisualizerService } from '../common/debugVisualizers.js';
import { DisassemblyViewInput } from '../common/disassemblyViewInput.js';
import { ReplAccessibilityAnnouncer } from '../common/replAccessibilityAnnouncer.js';
import { BreakpointEditorContribution } from './breakpointEditorContribution.js';
import { BreakpointsView } from './breakpointsView.js';
import { CallStackEditorContribution } from './callStackEditorContribution.js';
import { CallStackView } from './callStackView.js';
import { registerColors } from './debugColors.js';
import { ADD_CONFIGURATION_ID, ADD_TO_WATCH_ID, ADD_TO_WATCH_LABEL, CALLSTACK_BOTTOM_ID, CALLSTACK_BOTTOM_LABEL, CALLSTACK_DOWN_ID, CALLSTACK_DOWN_LABEL, CALLSTACK_TOP_ID, CALLSTACK_TOP_LABEL, CALLSTACK_UP_ID, CALLSTACK_UP_LABEL, CONTINUE_ID, CONTINUE_LABEL, COPY_EVALUATE_PATH_ID, COPY_EVALUATE_PATH_LABEL, COPY_STACK_TRACE_ID, COPY_VALUE_ID, COPY_VALUE_LABEL, DEBUG_COMMAND_CATEGORY, DEBUG_CONSOLE_QUICK_ACCESS_PREFIX, DEBUG_QUICK_ACCESS_PREFIX, DEBUG_RUN_COMMAND_ID, DEBUG_RUN_LABEL, DEBUG_START_COMMAND_ID, DEBUG_START_LABEL, DISCONNECT_AND_SUSPEND_ID, DISCONNECT_AND_SUSPEND_LABEL, DISCONNECT_ID, DISCONNECT_LABEL, EDIT_EXPRESSION_COMMAND_ID, JUMP_TO_CURSOR_ID, NEXT_DEBUG_CONSOLE_ID, NEXT_DEBUG_CONSOLE_LABEL, OPEN_LOADED_SCRIPTS_LABEL, PAUSE_ID, PAUSE_LABEL, PREV_DEBUG_CONSOLE_ID, PREV_DEBUG_CONSOLE_LABEL, REMOVE_EXPRESSION_COMMAND_ID, RESTART_FRAME_ID, RESTART_LABEL, RESTART_SESSION_ID, SELECT_AND_START_ID, SELECT_AND_START_LABEL, SELECT_DEBUG_CONSOLE_ID, SELECT_DEBUG_CONSOLE_LABEL, SELECT_DEBUG_SESSION_ID, SELECT_DEBUG_SESSION_LABEL, SET_EXPRESSION_COMMAND_ID, SHOW_LOADED_SCRIPTS_ID, STEP_INTO_ID, STEP_INTO_LABEL, STEP_INTO_TARGET_ID, STEP_INTO_TARGET_LABEL, STEP_OUT_ID, STEP_OUT_LABEL, STEP_OVER_ID, STEP_OVER_LABEL, STOP_ID, STOP_LABEL, TERMINATE_THREAD_ID, TOGGLE_INLINE_BREAKPOINT_ID, COPY_ADDRESS_ID, COPY_ADDRESS_LABEL, TOGGLE_BREAKPOINT_ID, BREAK_WHEN_VALUE_CHANGES_ID, BREAK_WHEN_VALUE_IS_ACCESSED_ID, BREAK_WHEN_VALUE_IS_READ_ID } from './debugCommands.js';
import { DebugConsoleQuickAccess } from './debugConsoleQuickAccess.js';
import { RunToCursorAction, SelectionToReplAction, SelectionToWatchExpressionsAction } from './debugEditorActions.js';
import { DebugEditorContribution } from './debugEditorContribution.js';
import * as icons from './debugIcons.js';
import { DebugProgressContribution } from './debugProgress.js';
import { StartDebugQuickAccessProvider } from './debugQuickAccess.js';
import { DebugService } from './debugService.js';
import './debugSettingMigration.js';
import { DebugStatusContribution } from './debugStatus.js';
import { DebugTitleContribution } from './debugTitle.js';
import { DebugToolBar } from './debugToolBar.js';
import { DebugViewPaneContainer } from './debugViewlet.js';
import { DisassemblyView, DisassemblyViewContribution } from './disassemblyView.js';
import { LoadedScriptsView } from './loadedScriptsView.js';
import './media/debug.contribution.css';
import './media/debugHover.css';
import { Repl } from './repl.js';
import { ReplAccessibilityHelp } from './replAccessibilityHelp.js';
import { ReplAccessibleView } from './replAccessibleView.js';
import { RunAndDebugAccessibilityHelp } from './runAndDebugAccessibilityHelp.js';
import { StatusBarColorProvider } from './statusbarColorProvider.js';
import { SET_VARIABLE_ID, VIEW_MEMORY_ID, VariablesView } from './variablesView.js';
import { ADD_WATCH_ID, ADD_WATCH_LABEL, REMOVE_WATCH_EXPRESSIONS_COMMAND_ID, REMOVE_WATCH_EXPRESSIONS_LABEL, WatchExpressionsView } from './watchExpressionsView.js';
import { WelcomeView } from './welcomeView.js';
import { DebugChatContextContribution } from './debugChatIntegration.js';

const debugCategory = nls.localize('debugCategory', "Debug");
registerColors();
registerSingleton(IDebugService, DebugService, InstantiationType.Delayed);
registerSingleton(IDebugVisualizerService, DebugVisualizerService, InstantiationType.Delayed);

// Register Debug Workbench Contributions
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(DebugStatusContribution, LifecyclePhase.Eventually);
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(DebugProgressContribution, LifecyclePhase.Eventually);
if (isWeb) {
	Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(DebugTitleContribution, LifecyclePhase.Eventually);
}
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(DebugToolBar, LifecyclePhase.Restored);
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(DebugContentProvider, LifecyclePhase.Eventually);
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(StatusBarColorProvider, LifecyclePhase.Eventually);
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(DisassemblyViewContribution, LifecyclePhase.Eventually);
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(DebugLifecycle, LifecyclePhase.Eventually);
registerWorkbenchContribution2(DebugChatContextContribution.ID, DebugChatContextContribution, WorkbenchPhase.AfterRestored);

// Register Quick Access
Registry.as<IQuickAccessRegistry>(QuickAccessExtensions.Quickaccess).registerQuickAccessProvider({
	ctor: StartDebugQuickAccessProvider,
	prefix: DEBUG_QUICK_ACCESS_PREFIX,
	contextKey: 'inLaunchConfigurationsPicker',
	placeholder: nls.localize('startDebugPlaceholder', "Type the name of a launch configuration to run."),
	helpEntries: [{
		description: nls.localize('startDebuggingHelp', "Start Debugging"),
		commandId: SELECT_AND_START_ID,
		commandCenterOrder: 50
	}]
});

// Register quick access for debug console
Registry.as<IQuickAccessRegistry>(QuickAccessExtensions.Quickaccess).registerQuickAccessProvider({
	ctor: DebugConsoleQuickAccess,
	prefix: DEBUG_CONSOLE_QUICK_ACCESS_PREFIX,
	contextKey: 'inDebugConsolePicker',
	placeholder: nls.localize('tasksQuickAccessPlaceholder', "Type the name of a debug console to open."),
	helpEntries: [{ description: nls.localize('tasksQuickAccessHelp', "Show All Debug Consoles"), commandId: SELECT_DEBUG_CONSOLE_ID }]
});

registerEditorContribution('editor.contrib.callStack', CallStackEditorContribution, EditorContributionInstantiation.AfterFirstRender);
registerEditorContribution(BREAKPOINT_EDITOR_CONTRIBUTION_ID, BreakpointEditorContribution, EditorContributionInstantiation.AfterFirstRender);
registerEditorContribution(EDITOR_CONTRIBUTION_ID, DebugEditorContribution, EditorContributionInstantiation.BeforeFirstInteraction);

const registerDebugCommandPaletteItem = (id: string, title: ICommandActionTitle, when?: ContextKeyExpression, precondition?: ContextKeyExpression) => {
	MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
		when: ContextKeyExpr.and(CONTEXT_DEBUGGERS_AVAILABLE, when),
		group: debugCategory,
		command: {
			id,
			title,
			category: DEBUG_COMMAND_CATEGORY,
			precondition
		}
	});
};

registerDebugCommandPaletteItem(RESTART_SESSION_ID, RESTART_LABEL);
registerDebugCommandPaletteItem(TERMINATE_THREAD_ID, nls.localize2('terminateThread', "Terminate Thread"), CONTEXT_IN_DEBUG_MODE, CONTEXT_TERMINATE_THREADS_SUPPORTED);
registerDebugCommandPaletteItem(STEP_OVER_ID, STEP_OVER_LABEL, CONTEXT_IN_DEBUG_MODE, CONTEXT_DEBUG_STATE.isEqualTo('stopped'));
registerDebugCommandPaletteItem(STEP_INTO_ID, STEP_INTO_LABEL, CONTEXT_IN_DEBUG_MODE, CONTEXT_DEBUG_STATE.isEqualTo('stopped'));
registerDebugCommandPaletteItem(STEP_INTO_TARGET_ID, STEP_INTO_TARGET_LABEL, CONTEXT_IN_DEBUG_MODE, ContextKeyExpr.and(CONTEXT_STEP_INTO_TARGETS_SUPPORTED, CONTEXT_IN_DEBUG_MODE, CONTEXT_DEBUG_STATE.isEqualTo('stopped')));
registerDebugCommandPaletteItem(STEP_OUT_ID, STEP_OUT_LABEL, CONTEXT_IN_DEBUG_MODE, CONTEXT_DEBUG_STATE.isEqualTo('stopped'));
registerDebugCommandPaletteItem(PAUSE_ID, PAUSE_LABEL, CONTEXT_IN_DEBUG_MODE, ContextKeyExpr.and(CONTEXT_DEBUG_STATE.isEqualTo('running'), CONTEXT_FOCUSED_SESSION_IS_NO_DEBUG.toNegated()));
registerDebugCommandPaletteItem(DISCONNECT_ID, DISCONNECT_LABEL, CONTEXT_IN_DEBUG_MODE, ContextKeyExpr.or(CONTEXT_FOCUSED_SESSION_IS_ATTACH, CONTEXT_TERMINATE_DEBUGGEE_SUPPORTED));
registerDebugCommandPaletteItem(DISCONNECT_AND_SUSPEND_ID, DISCONNECT_AND_SUSPEND_LABEL, CONTEXT_IN_DEBUG_MODE, ContextKeyExpr.or(CONTEXT_FOCUSED_SESSION_IS_ATTACH, ContextKeyExpr.and(CONTEXT_SUSPEND_DEBUGGEE_SUPPORTED, CONTEXT_TERMINATE_DEBUGGEE_SUPPORTED)));
registerDebugCommandPaletteItem(STOP_ID, STOP_LABEL, CONTEXT_IN_DEBUG_MODE, ContextKeyExpr.or(CONTEXT_FOCUSED_SESSION_IS_ATTACH.toNegated(), CONTEXT_TERMINATE_DEBUGGEE_SUPPORTED));
registerDebugCommandPaletteItem(CONTINUE_ID, CONTINUE_LABEL, CONTEXT_IN_DEBUG_MODE, CONTEXT_DEBUG_STATE.isEqualTo('stopped'));
registerDebugCommandPaletteItem(JUMP_TO_CURSOR_ID, nls.localize2('jumpToCursor', "Jump to Cursor"), CONTEXT_JUMP_TO_CURSOR_SUPPORTED);
registerDebugCommandPaletteItem(JUMP_TO_CURSOR_ID, nls.localize2('SetNextStatement', "Set Next Statement"), CONTEXT_JUMP_TO_CURSOR_SUPPORTED);
registerDebugCommandPaletteItem(RunToCursorAction.ID, RunToCursorAction.LABEL, CONTEXT_DEBUGGERS_AVAILABLE);
registerDebugCommandPaletteItem(SelectionToReplAction.ID, SelectionToReplAction.LABEL, CONTEXT_IN_DEBUG_MODE);
registerDebugCommandPaletteItem(SelectionToWatchExpressionsAction.ID, SelectionToWatchExpressionsAction.LABEL);
registerDebugCommandPaletteItem(TOGGLE_INLINE_BREAKPOINT_ID, nls.localize2('inlineBreakpoint', "Inline Breakpoint"));
registerDebugCommandPaletteItem(DEBUG_START_COMMAND_ID, DEBUG_START_LABEL, ContextKeyExpr.and(CONTEXT_DEBUGGERS_AVAILABLE, CONTEXT_DEBUG_STATE.notEqualsTo(getStateLabel(State.Initializing))));
registerDebugCommandPaletteItem(DEBUG_RUN_COMMAND_ID, DEBUG_RUN_LABEL, ContextKeyExpr.and(CONTEXT_DEBUGGERS_AVAILABLE, CONTEXT_DEBUG_STATE.notEqualsTo(getStateLabel(State.Initializing))));
registerDebugCommandPaletteItem(SELECT_AND_START_ID, SELECT_AND_START_LABEL, ContextKeyExpr.and(CONTEXT_DEBUGGERS_AVAILABLE, CONTEXT_DEBUG_STATE.notEqualsTo(getStateLabel(State.Initializing))));
registerDebugCommandPaletteItem(NEXT_DEBUG_CONSOLE_ID, NEXT_DEBUG_CONSOLE_LABEL);
registerDebugCommandPaletteItem(PREV_DEBUG_CONSOLE_ID, PREV_DEBUG_CONSOLE_LABEL);
registerDebugCommandPaletteItem(SHOW_LOADED_SCRIPTS_ID, OPEN_LOADED_SCRIPTS_LABEL, CONTEXT_IN_DEBUG_MODE, CONTEXT_LOADED_SCRIPTS_SUPPORTED);
registerDebugCommandPaletteItem(SELECT_DEBUG_CONSOLE_ID, SELECT_DEBUG_CONSOLE_LABEL);
registerDebugCommandPaletteItem(SELECT_DEBUG_SESSION_ID, SELECT_DEBUG_SESSION_LABEL);
registerDebugCommandPaletteItem(CALLSTACK_TOP_ID, CALLSTACK_TOP_LABEL, CONTEXT_IN_DEBUG_MODE, CONTEXT_DEBUG_STATE.isEqualTo('stopped'));
registerDebugCommandPaletteItem(CALLSTACK_BOTTOM_ID, CALLSTACK_BOTTOM_LABEL, CONTEXT_IN_DEBUG_MODE, CONTEXT_DEBUG_STATE.isEqualTo('stopped'));
registerDebugCommandPaletteItem(CALLSTACK_UP_ID, CALLSTACK_UP_LABEL, CONTEXT_IN_DEBUG_MODE, CONTEXT_DEBUG_STATE.isEqualTo('stopped'));
registerDebugCommandPaletteItem(CALLSTACK_DOWN_ID, CALLSTACK_DOWN_LABEL, CONTEXT_IN_DEBUG_MODE, CONTEXT_DEBUG_STATE.isEqualTo('stopped'));

// Debug callstack context menu
const registerDebugViewMenuItem = (menuId: MenuId, id: string, title: string | ICommandActionTitle, order: number, when?: ContextKeyExpression, precondition?: ContextKeyExpression, group = 'navigation', icon?: Icon) => {
	MenuRegistry.appendMenuItem(menuId, {
		group,
		when,
		order,
		icon,
		command: {
			id,
			title,
			icon,
			precondition
		}
	});
};
registerDebugViewMenuItem(MenuId.DebugCallStackContext, RESTART_SESSION_ID, RESTART_LABEL, 10, CONTEXT_CALLSTACK_ITEM_TYPE.isEqualTo('session'), undefined, '3_modification');
registerDebugViewMenuItem(MenuId.DebugCallStackContext, DISCONNECT_ID, DISCONNECT_LABEL, 20, CONTEXT_CALLSTACK_ITEM_TYPE.isEqualTo('session'), undefined, '3_modification');
registerDebugViewMenuItem(MenuId.DebugCallStackContext, DISCONNECT_AND_SUSPEND_ID, DISCONNECT_AND_SUSPEND_LABEL, 21, ContextKeyExpr.and(CONTEXT_CALLSTACK_ITEM_TYPE.isEqualTo('session'), CONTEXT_SUSPEND_DEBUGGEE_SUPPORTED, CONTEXT_TERMINATE_DEBUGGEE_SUPPORTED), undefined, '3_modification');
registerDebugViewMenuItem(MenuId.DebugCallStackContext, STOP_ID, STOP_LABEL, 30, CONTEXT_CALLSTACK_ITEM_TYPE.isEqualTo('session'), undefined, '3_modification');
registerDebugViewMenuItem(MenuId.DebugCallStackContext, PAUSE_ID, PAUSE_LABEL, 10, ContextKeyExpr.and(CONTEXT_CALLSTACK_ITEM_TYPE.isEqualTo('thread'), ContextKeyExpr.and(CONTEXT_DEBUG_STATE.isEqualTo('running'), CONTEXT_FOCUSED_SESSION_IS_NO_DEBUG.toNegated())));
registerDebugViewMenuItem(MenuId.DebugCallStackContext, CONTINUE_ID, CONTINUE_LABEL, 10, ContextKeyExpr.and(CONTEXT_CALLSTACK_ITEM_TYPE.isEqualTo('thread'), CONTEXT_DEBUG_STATE.isEqualTo('stopped')));
registerDebugViewMenuItem(MenuId.DebugCallStackContext, STEP_OVER_ID, STEP_OVER_LABEL, 20, CONTEXT_CALLSTACK_ITEM_TYPE.isEqualTo('thread'), CONTEXT_DEBUG_STATE.isEqualTo('stopped'));
registerDebugViewMenuItem(MenuId.DebugCallStackContext, STEP_INTO_ID, STEP_INTO_LABEL, 30, CONTEXT_CALLSTACK_ITEM_TYPE.isEqualTo('thread'), CONTEXT_DEBUG_STATE.isEqualTo('stopped'));
registerDebugViewMenuItem(MenuId.DebugCallStackContext, STEP_OUT_ID, STEP_OUT_LABEL, 40, CONTEXT_CALLSTACK_ITEM_TYPE.isEqualTo('thread'), CONTEXT_DEBUG_STATE.isEqualTo('stopped'));
registerDebugViewMenuItem(MenuId.DebugCallStackContext, TERMINATE_THREAD_ID, nls.localize('terminateThread', "Terminate Thread"), 10, CONTEXT_CALLSTACK_ITEM_TYPE.isEqualTo('thread'), CONTEXT_TERMINATE_THREADS_SUPPORTED, 'termination');
registerDebugViewMenuItem(MenuId.DebugCallStackContext, RESTART_FRAME_ID, nls.localize('restartFrame', "Restart Frame"), 10, ContextKeyExpr.and(CONTEXT_CALLSTACK_ITEM_TYPE.isEqualTo('stackFrame'), CONTEXT_RESTART_FRAME_SUPPORTED), CONTEXT_STACK_FRAME_SUPPORTS_RESTART);
registerDebugViewMenuItem(MenuId.DebugCallStackContext, COPY_STACK_TRACE_ID, nls.localize('copyStackTrace', "Copy Call Stack"), 20, CONTEXT_CALLSTACK_ITEM_TYPE.isEqualTo('stackFrame'), undefined, '3_modification');

registerDebugViewMenuItem(MenuId.DebugVariablesContext, VIEW_MEMORY_ID, nls.localize('viewMemory', "View Binary Data"), 15, CONTEXT_CAN_VIEW_MEMORY, CONTEXT_IN_DEBUG_MODE, 'inline', icons.debugInspectMemory);
registerDebugViewMenuItem(MenuId.DebugVariablesContext, SET_VARIABLE_ID, nls.localize('setValue', "Set Value"), 10, ContextKeyExpr.or(CONTEXT_SET_VARIABLE_SUPPORTED, ContextKeyExpr.and(CONTEXT_VARIABLE_EVALUATE_NAME_PRESENT, CONTEXT_SET_EXPRESSION_SUPPORTED)), CONTEXT_VARIABLE_IS_READONLY.toNegated(), '3_modification');
registerDebugViewMenuItem(MenuId.DebugVariablesContext, COPY_VALUE_ID, COPY_VALUE_LABEL, 10, undefined, undefined, '5_cutcopypaste');
registerDebugViewMenuItem(MenuId.DebugVariablesContext, COPY_EVALUATE_PATH_ID, COPY_EVALUATE_PATH_LABEL, 20, CONTEXT_VARIABLE_EVALUATE_NAME_PRESENT, undefined, '5_cutcopypaste');
registerDebugViewMenuItem(MenuId.DebugVariablesContext, ADD_TO_WATCH_ID, ADD_TO_WATCH_LABEL, 100, CONTEXT_VARIABLE_EVALUATE_NAME_PRESENT, undefined, 'z_commands');
registerDebugViewMenuItem(MenuId.DebugVariablesContext, BREAK_WHEN_VALUE_IS_READ_ID, nls.localize('breakWhenValueIsRead', "Break on Value Read"), 200, CONTEXT_BREAK_WHEN_VALUE_IS_READ_SUPPORTED, undefined, 'z_commands');
registerDebugViewMenuItem(MenuId.DebugVariablesContext, BREAK_WHEN_VALUE_CHANGES_ID, nls.localize('breakWhenValueChanges', "Break on Value Change"), 210, CONTEXT_BREAK_WHEN_VALUE_CHANGES_SUPPORTED, undefined, 'z_commands');
registerDebugViewMenuItem(MenuId.DebugVariablesContext, BREAK_WHEN_VALUE_IS_ACCESSED_ID, nls.localize('breakWhenValueIsAccessed', "Break on Value Access"), 220, CONTEXT_BREAK_WHEN_VALUE_IS_ACCESSED_SUPPORTED, undefined, 'z_commands');

registerDebugViewMenuItem(MenuId.DebugHoverContext, VIEW_MEMORY_ID, nls.localize('viewMemory', "View Binary Data"), 15, CONTEXT_CAN_VIEW_MEMORY, CONTEXT_IN_DEBUG_MODE, 'inline', icons.debugInspectMemory);
registerDebugViewMenuItem(MenuId.DebugHoverContext, COPY_VALUE_ID, COPY_VALUE_LABEL, 10, undefined, undefined, '5_cutcopypaste');
registerDebugViewMenuItem(MenuId.DebugHoverContext, COPY_EVALUATE_PATH_ID, COPY_EVALUATE_PATH_LABEL, 20, CONTEXT_VARIABLE_EVALUATE_NAME_PRESENT, undefined, '5_cutcopypaste');
registerDebugViewMenuItem(MenuId.DebugHoverContext, ADD_TO_WATCH_ID, ADD_TO_WATCH_LABEL, 100, CONTEXT_VARIABLE_EVALUATE_NAME_PRESENT, undefined, 'z_commands');
registerDebugViewMenuItem(MenuId.DebugHoverContext, BREAK_WHEN_VALUE_IS_READ_ID, nls.localize('breakWhenValueIsRead', "Break on Value Read"), 200, CONTEXT_BREAK_WHEN_VALUE_IS_READ_SUPPORTED, undefined, 'z_commands');
registerDebugViewMenuItem(MenuId.DebugHoverContext, BREAK_WHEN_VALUE_CHANGES_ID, nls.localize('breakWhenValueChanges', "Break on Value Change"), 210, CONTEXT_BREAK_WHEN_VALUE_CHANGES_SUPPORTED, undefined, 'z_commands');
registerDebugViewMenuItem(MenuId.DebugHoverContext, BREAK_WHEN_VALUE_IS_ACCESSED_ID, nls.localize('breakWhenValueIsAccessed', "Break on Value Access"), 220, CONTEXT_BREAK_WHEN_VALUE_IS_ACCESSED_SUPPORTED, undefined, 'z_commands');

registerDebugViewMenuItem(MenuId.DebugWatchContext, ADD_WATCH_ID, ADD_WATCH_LABEL, 10, undefined, undefined, '3_modification');
registerDebugViewMenuItem(MenuId.DebugWatchContext, EDIT_EXPRESSION_COMMAND_ID, nls.localize('editWatchExpression', "Edit Expression"), 20, CONTEXT_WATCH_ITEM_TYPE.isEqualTo('expression'), undefined, '3_modification');
registerDebugViewMenuItem(MenuId.DebugWatchContext, SET_EXPRESSION_COMMAND_ID, nls.localize('setValue', "Set Value"), 30, ContextKeyExpr.or(ContextKeyExpr.and(CONTEXT_WATCH_ITEM_TYPE.isEqualTo('expression'), CONTEXT_SET_EXPRESSION_SUPPORTED), ContextKeyExpr.and(CONTEXT_WATCH_ITEM_TYPE.isEqualTo('variable'), CONTEXT_SET_VARIABLE_SUPPORTED)), CONTEXT_VARIABLE_IS_READONLY.toNegated(), '3_modification');
registerDebugViewMenuItem(MenuId.DebugWatchContext, COPY_VALUE_ID, nls.localize('copyValue', "Copy Value"), 40, ContextKeyExpr.or(CONTEXT_WATCH_ITEM_TYPE.isEqualTo('expression'), CONTEXT_WATCH_ITEM_TYPE.isEqualTo('variable')), CONTEXT_IN_DEBUG_MODE, '3_modification');
registerDebugViewMenuItem(MenuId.DebugWatchContext, COPY_EVALUATE_PATH_ID, COPY_EVALUATE_PATH_LABEL, 50, CONTEXT_VARIABLE_EVALUATE_NAME_PRESENT, CONTEXT_IN_DEBUG_MODE, '3_modification');
registerDebugViewMenuItem(MenuId.DebugWatchContext, VIEW_MEMORY_ID, nls.localize('viewMemory', "View Binary Data"), 10, CONTEXT_CAN_VIEW_MEMORY, undefined, 'inline', icons.debugInspectMemory);
registerDebugViewMenuItem(MenuId.DebugWatchContext, REMOVE_EXPRESSION_COMMAND_ID, nls.localize('removeWatchExpression', "Remove Expression"), 20, CONTEXT_WATCH_ITEM_TYPE.isEqualTo('expression'), undefined, 'inline', icons.watchExpressionRemove);
registerDebugViewMenuItem(MenuId.DebugWatchContext, REMOVE_WATCH_EXPRESSIONS_COMMAND_ID, REMOVE_WATCH_EXPRESSIONS_LABEL, 20, undefined, undefined, 'z_commands');
registerDebugViewMenuItem(MenuId.DebugWatchContext, BREAK_WHEN_VALUE_IS_READ_ID, nls.localize('breakWhenValueIsRead', "Break on Value Read"), 200, CONTEXT_BREAK_WHEN_VALUE_IS_READ_SUPPORTED, undefined, 'z_commands');
registerDebugViewMenuItem(MenuId.DebugWatchContext, BREAK_WHEN_VALUE_CHANGES_ID, nls.localize('breakWhenValueChanges', "Break on Value Change"), 210, CONTEXT_BREAK_WHEN_VALUE_CHANGES_SUPPORTED, undefined, 'z_commands');
registerDebugViewMenuItem(MenuId.DebugWatchContext, BREAK_WHEN_VALUE_IS_ACCESSED_ID, nls.localize('breakWhenValueIsAccessed', "Break on Value Access"), 220, CONTEXT_BREAK_WHEN_VALUE_IS_ACCESSED_SUPPORTED, undefined, 'z_commands');

registerDebugViewMenuItem(MenuId.NotebookVariablesContext, COPY_NOTEBOOK_VARIABLE_VALUE_ID, COPY_NOTEBOOK_VARIABLE_VALUE_LABEL, 20, CONTEXT_VARIABLE_VALUE);

KeybindingsRegistry.registerKeybindingRule({
	id: COPY_VALUE_ID,
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(
		CONTEXT_EXPRESSION_SELECTED.negate(),
		ContextKeyExpr.or(
			FocusedViewContext.isEqualTo(WATCH_VIEW_ID),
			FocusedViewContext.isEqualTo(VARIABLES_VIEW_ID),
		),
	),
	primary: KeyMod.CtrlCmd | KeyCode.KeyC
});

// Touch Bar
if (isMacintosh) {

	const registerTouchBarEntry = (id: string, title: string | ICommandActionTitle, order: number, when: ContextKeyExpression | undefined, iconUri: URI) => {
		MenuRegistry.appendMenuItem(MenuId.TouchBarContext, {
			command: {
				id,
				title,
				icon: { dark: iconUri }
			},
			when: ContextKeyExpr.and(CONTEXT_DEBUGGERS_AVAILABLE, when),
			group: '9_debug',
			order
		});
	};

	registerTouchBarEntry(DEBUG_RUN_COMMAND_ID, DEBUG_RUN_LABEL, 0, CONTEXT_IN_DEBUG_MODE.toNegated(), FileAccess.asFileUri('vs/workbench/contrib/debug/browser/media/continue-tb.png'));
	registerTouchBarEntry(DEBUG_START_COMMAND_ID, DEBUG_START_LABEL, 1, CONTEXT_IN_DEBUG_MODE.toNegated(), FileAccess.asFileUri('vs/workbench/contrib/debug/browser/media/run-with-debugging-tb.png'));
	registerTouchBarEntry(CONTINUE_ID, CONTINUE_LABEL, 0, CONTEXT_DEBUG_STATE.isEqualTo('stopped'), FileAccess.asFileUri('vs/workbench/contrib/debug/browser/media/continue-tb.png'));
	registerTouchBarEntry(PAUSE_ID, PAUSE_LABEL, 1, ContextKeyExpr.and(CONTEXT_IN_DEBUG_MODE, ContextKeyExpr.and(CONTEXT_DEBUG_STATE.isEqualTo('running'), CONTEXT_FOCUSED_SESSION_IS_NO_DEBUG.toNegated())), FileAccess.asFileUri('vs/workbench/contrib/debug/browser/media/pause-tb.png'));
	registerTouchBarEntry(STEP_OVER_ID, STEP_OVER_LABEL, 2, CONTEXT_IN_DEBUG_MODE, FileAccess.asFileUri('vs/workbench/contrib/debug/browser/media/stepover-tb.png'));
	registerTouchBarEntry(STEP_INTO_ID, STEP_INTO_LABEL, 3, CONTEXT_IN_DEBUG_MODE, FileAccess.asFileUri('vs/workbench/contrib/debug/browser/media/stepinto-tb.png'));
	registerTouchBarEntry(STEP_OUT_ID, STEP_OUT_LABEL, 4, CONTEXT_IN_DEBUG_MODE, FileAccess.asFileUri('vs/workbench/contrib/debug/browser/media/stepout-tb.png'));
	registerTouchBarEntry(RESTART_SESSION_ID, RESTART_LABEL, 5, CONTEXT_IN_DEBUG_MODE, FileAccess.asFileUri('vs/workbench/contrib/debug/browser/media/restart-tb.png'));
	registerTouchBarEntry(STOP_ID, STOP_LABEL, 6, CONTEXT_IN_DEBUG_MODE, FileAccess.asFileUri('vs/workbench/contrib/debug/browser/media/stop-tb.png'));
}

// Editor Title Menu's "Run/Debug" dropdown item

MenuRegistry.appendMenuItem(MenuId.EditorTitle, { submenu: MenuId.EditorTitleRun, isSplitButton: { togglePrimaryAction: true }, title: nls.localize2('run', "Run or Debug..."), icon: icons.debugRun, group: 'navigation', order: -1 });

// Debug menu

MenuRegistry.appendMenuItem(MenuId.MenubarMainMenu, {
	submenu: MenuId.MenubarDebugMenu,
	title: {
		...nls.localize2('runMenu', "Run"),
		mnemonicTitle: nls.localize({ key: 'mRun', comment: ['&& denotes a mnemonic'] }, "&&Run")
	},
	order: 6
});

MenuRegistry.appendMenuItem(MenuId.MenubarDebugMenu, {
	group: '1_debug',
	command: {
		id: DEBUG_START_COMMAND_ID,
		title: nls.localize({ key: 'miStartDebugging', comment: ['&& denotes a mnemonic'] }, "&&Start Debugging")
	},
	order: 1,
	when: CONTEXT_DEBUGGERS_AVAILABLE
});

MenuRegistry.appendMenuItem(MenuId.MenubarDebugMenu, {
	group: '1_debug',
	command: {
		id: DEBUG_RUN_COMMAND_ID,
		title: nls.localize({ key: 'miRun', comment: ['&& denotes a mnemonic'] }, "Run &&Without Debugging")
	},
	order: 2,
	when: CONTEXT_DEBUGGERS_AVAILABLE
});

MenuRegistry.appendMenuItem(MenuId.MenubarDebugMenu, {
	group: '1_debug',
	command: {
		id: STOP_ID,
		title: nls.localize({ key: 'miStopDebugging', comment: ['&& denotes a mnemonic'] }, "&&Stop Debugging"),
		precondition: CONTEXT_IN_DEBUG_MODE
	},
	order: 3,
	when: CONTEXT_DEBUGGERS_AVAILABLE
});

MenuRegistry.appendMenuItem(MenuId.MenubarDebugMenu, {
	group: '1_debug',
	command: {
		id: RESTART_SESSION_ID,
		title: nls.localize({ key: 'miRestart Debugging', comment: ['&& denotes a mnemonic'] }, "&&Restart Debugging"),
		precondition: CONTEXT_IN_DEBUG_MODE
	},
	order: 4,
	when: CONTEXT_DEBUGGERS_AVAILABLE
});

// Configuration

MenuRegistry.appendMenuItem(MenuId.MenubarDebugMenu, {
	group: '2_configuration',
	command: {
		id: ADD_CONFIGURATION_ID,
		title: nls.localize({ key: 'miAddConfiguration', comment: ['&& denotes a mnemonic'] }, "A&&dd Configuration...")
	},
	order: 2,
	when: CONTEXT_DEBUGGERS_AVAILABLE
});

// Step Commands
MenuRegistry.appendMenuItem(MenuId.MenubarDebugMenu, {
	group: '3_step',
	command: {
		id: STEP_OVER_ID,
		title: nls.localize({ key: 'miStepOver', comment: ['&& denotes a mnemonic'] }, "Step &&Over"),
		precondition: CONTEXT_DEBUG_STATE.isEqualTo('stopped')
	},
	order: 1,
	when: CONTEXT_DEBUGGERS_AVAILABLE
});

MenuRegistry.appendMenuItem(MenuId.MenubarDebugMenu, {
	group: '3_step',
	command: {
		id: STEP_INTO_ID,
		title: nls.localize({ key: 'miStepInto', comment: ['&& denotes a mnemonic'] }, "Step &&Into"),
		precondition: CONTEXT_DEBUG_STATE.isEqualTo('stopped')
	},
	order: 2,
	when: CONTEXT_DEBUGGERS_AVAILABLE
});

MenuRegistry.appendMenuItem(MenuId.MenubarDebugMenu, {
	group: '3_step',
	command: {
		id: STEP_OUT_ID,
		title: nls.localize({ key: 'miStepOut', comment: ['&& denotes a mnemonic'] }, "Step O&&ut"),
		precondition: CONTEXT_DEBUG_STATE.isEqualTo('stopped')
	},
	order: 3,
	when: CONTEXT_DEBUGGERS_AVAILABLE
});

MenuRegistry.appendMenuItem(MenuId.MenubarDebugMenu, {
	group: '3_step',
	command: {
		id: CONTINUE_ID,
		title: nls.localize({ key: 'miContinue', comment: ['&& denotes a mnemonic'] }, "&&Continue"),
		precondition: CONTEXT_DEBUG_STATE.isEqualTo('stopped')
	},
	order: 4,
	when: CONTEXT_DEBUGGERS_AVAILABLE
});

// New Breakpoints

MenuRegistry.appendMenuItem(MenuId.MenubarNewBreakpointMenu, {
	group: '1_breakpoints',
	command: {
		id: TOGGLE_INLINE_BREAKPOINT_ID,
		title: nls.localize({ key: 'miInlineBreakpoint', comment: ['&& denotes a mnemonic'] }, "Inline Breakp&&oint")
	},
	order: 2,
	when: CONTEXT_DEBUGGERS_AVAILABLE
});

MenuRegistry.appendMenuItem(MenuId.MenubarDebugMenu, {
	group: '4_new_breakpoint',
	title: nls.localize({ key: 'miNewBreakpoint', comment: ['&& denotes a mnemonic'] }, "&&New Breakpoint"),
	submenu: MenuId.MenubarNewBreakpointMenu,
	order: 2,
	when: CONTEXT_DEBUGGERS_AVAILABLE
});

// Disassembly

MenuRegistry.appendMenuItem(MenuId.DebugDisassemblyContext, {
	group: '1_edit',
	command: {
		id: COPY_ADDRESS_ID,
		title: COPY_ADDRESS_LABEL,
	},
	order: 2,
	when: CONTEXT_DEBUGGERS_AVAILABLE
});

MenuRegistry.appendMenuItem(MenuId.DebugDisassemblyContext, {
	group: '3_breakpoints',
	command: {
		id: TOGGLE_BREAKPOINT_ID,
		title: nls.localize({ key: 'miToggleBreakpoint', comment: ['&& denotes a mnemonic'] }, "Toggle Breakpoint"),
	},
	order: 2,
	when: CONTEXT_DEBUGGERS_AVAILABLE
});

// Breakpoint actions are registered from breakpointsView.ts

// Install Debuggers
MenuRegistry.appendMenuItem(MenuId.MenubarDebugMenu, {
	group: 'z_install',
	command: {
		id: 'debug.installAdditionalDebuggers',
		title: nls.localize({ key: 'miInstallAdditionalDebuggers', comment: ['&& denotes a mnemonic'] }, "&&Install Additional Debuggers...")
	},
	order: 1
});

// register repl panel

const VIEW_CONTAINER: ViewContainer = Registry.as<IViewContainersRegistry>(ViewExtensions.ViewContainersRegistry).registerViewContainer({
	id: DEBUG_PANEL_ID,
	title: nls.localize2({ comment: ['Debug is a noun in this context, not a verb.'], key: 'debugPanel' }, "Debug Console"),
	icon: icons.debugConsoleViewIcon,
	ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [DEBUG_PANEL_ID, { mergeViewWithContainerWhenSingleView: true }]),
	storageId: DEBUG_PANEL_ID,
	hideIfEmpty: true,
	order: 2,
}, ViewContainerLocation.Panel, { doNotRegisterOpenCommand: true });

Registry.as<IViewsRegistry>(ViewExtensions.ViewsRegistry).registerViews([{
	id: REPL_VIEW_ID,
	name: nls.localize2({ comment: ['Debug is a noun in this context, not a verb.'], key: 'debugPanel' }, "Debug Console"),
	containerIcon: icons.debugConsoleViewIcon,
	canToggleVisibility: true,
	canMoveView: true,
	when: CONTEXT_DEBUGGERS_AVAILABLE,
	ctorDescriptor: new SyncDescriptor(Repl),
	openCommandActionDescriptor: {
		id: 'workbench.debug.action.toggleRepl',
		mnemonicTitle: nls.localize({ key: 'miToggleDebugConsole', comment: ['&& denotes a mnemonic'] }, "De&&bug Console"),
		keybindings: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyY },
		order: 2
	}
}], VIEW_CONTAINER);


const viewContainer = Registry.as<IViewContainersRegistry>(ViewExtensions.ViewContainersRegistry).registerViewContainer({
	id: VIEWLET_ID,
	title: nls.localize2('run and debug', "Run and Debug"),
	openCommandActionDescriptor: {
		id: VIEWLET_ID,
		mnemonicTitle: nls.localize({ key: 'miViewRun', comment: ['&& denotes a mnemonic'] }, "&&Run"),
		keybindings: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyD },
		order: 3
	},
	ctorDescriptor: new SyncDescriptor(DebugViewPaneContainer),
	icon: icons.runViewIcon,
	alwaysUseContainerInfo: true,
	order: 3,
}, ViewContainerLocation.Sidebar);

// Register default debug views
const viewsRegistry = Registry.as<IViewsRegistry>(ViewExtensions.ViewsRegistry);
viewsRegistry.registerViews([{ id: VARIABLES_VIEW_ID, name: nls.localize2('variables', "Variables"), containerIcon: icons.variablesViewIcon, ctorDescriptor: new SyncDescriptor(VariablesView), order: 10, weight: 40, canToggleVisibility: true, canMoveView: true, focusCommand: { id: 'workbench.debug.action.focusVariablesView' }, when: CONTEXT_DEBUG_UX.isEqualTo('default') }], viewContainer);
viewsRegistry.registerViews([{ id: WATCH_VIEW_ID, name: nls.localize2('watch', "Watch"), containerIcon: icons.watchViewIcon, ctorDescriptor: new SyncDescriptor(WatchExpressionsView), order: 20, weight: 10, canToggleVisibility: true, canMoveView: true, focusCommand: { id: 'workbench.debug.action.focusWatchView' }, when: CONTEXT_DEBUG_UX.isEqualTo('default') }], viewContainer);
viewsRegistry.registerViews([{ id: CALLSTACK_VIEW_ID, name: nls.localize2('callStack', "Call Stack"), containerIcon: icons.callStackViewIcon, ctorDescriptor: new SyncDescriptor(CallStackView), order: 30, weight: 30, canToggleVisibility: true, canMoveView: true, focusCommand: { id: 'workbench.debug.action.focusCallStackView' }, when: CONTEXT_DEBUG_UX.isEqualTo('default') }], viewContainer);
viewsRegistry.registerViews([{ id: BREAKPOINTS_VIEW_ID, name: nls.localize2('breakpoints', "Breakpoints"), containerIcon: icons.breakpointsViewIcon, ctorDescriptor: new SyncDescriptor(BreakpointsView), order: 40, weight: 20, canToggleVisibility: true, canMoveView: true, focusCommand: { id: 'workbench.debug.action.focusBreakpointsView' }, when: ContextKeyExpr.or(CONTEXT_BREAKPOINTS_EXIST, CONTEXT_DEBUG_UX.isEqualTo('default'), CONTEXT_HAS_DEBUGGED) }], viewContainer);
viewsRegistry.registerViews([{ id: WelcomeView.ID, name: WelcomeView.LABEL, containerIcon: icons.runViewIcon, ctorDescriptor: new SyncDescriptor(WelcomeView), order: 1, weight: 40, canToggleVisibility: true, when: CONTEXT_DEBUG_UX.isEqualTo('simple') }], viewContainer);
viewsRegistry.registerViews([{ id: LOADED_SCRIPTS_VIEW_ID, name: nls.localize2('loadedScripts', "Loaded Scripts"), containerIcon: icons.loadedScriptsViewIcon, ctorDescriptor: new SyncDescriptor(LoadedScriptsView), order: 35, weight: 5, canToggleVisibility: true, canMoveView: true, collapsed: true, when: ContextKeyExpr.and(CONTEXT_LOADED_SCRIPTS_SUPPORTED, CONTEXT_DEBUG_UX.isEqualTo('default')) }], viewContainer);

// Register disassembly view

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(DisassemblyView, DISASSEMBLY_VIEW_ID, nls.localize('disassembly', "Disassembly")),
	[new SyncDescriptor(DisassemblyViewInput)]
);

// Register configuration
const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
configurationRegistry.registerConfiguration({
	id: 'debug',
	order: 20,
	title: nls.localize('debugConfigurationTitle', "Debug"),
	type: 'object',
	properties: {
		'debug.showVariableTypes': {
			type: 'boolean',
			description: nls.localize({ comment: ['This is the description for a setting'], key: 'showVariableTypes' }, "Show variable type in variable pane during debug session"),
			default: false
		},
		'debug.allowBreakpointsEverywhere': {
			type: 'boolean',
			description: nls.localize({ comment: ['This is the description for a setting'], key: 'allowBreakpointsEverywhere' }, "Allow setting breakpoints in any file."),
			default: false
		},
		'debug.gutterMiddleClickAction': {
			type: 'string',
			enum: ['logpoint', 'conditionalBreakpoint', 'triggeredBreakpoint', 'none'],
			description: nls.localize({ comment: ['This is the description for a setting'], key: 'gutterMiddleClickAction' }, 'Controls the action to perform when clicking the editor gutter with the middle mouse button.'),
			enumDescriptions: [
				nls.localize('debug.gutterMiddleClickAction.logpoint', "Add Logpoint."),
				nls.localize('debug.gutterMiddleClickAction.conditionalBreakpoint', "Add Conditional Breakpoint."),
				nls.localize('debug.gutterMiddleClickAction.triggeredBreakpoint', "Add Triggered Breakpoint."),
				nls.localize('debug.gutterMiddleClickAction.none', "Don't perform any action."),
			],
			default: 'logpoint',
		},
		'debug.openExplorerOnEnd': {
			type: 'boolean',
			description: nls.localize({ comment: ['This is the description for a setting'], key: 'openExplorerOnEnd' }, "Automatically open the explorer view at the end of a debug session."),
			default: false
		},
		'debug.closeReadonlyTabsOnEnd': {
			type: 'boolean',
			description: nls.localize({ comment: ['This is the description for a setting'], key: 'closeReadonlyTabsOnEnd' }, "At the end of a debug session, all the read-only tabs associated with that session will be closed"),
			default: false
		},
		'debug.inlineValues': {
			type: 'string',
			'enum': ['on', 'off', 'auto'],
			description: nls.localize({ comment: ['This is the description for a setting'], key: 'inlineValues' }, "Show variable values inline in editor while debugging."),
			'enumDescriptions': [
				nls.localize('inlineValues.on', "Always show variable values inline in editor while debugging."),
				nls.localize('inlineValues.off', "Never show variable values inline in editor while debugging."),
				nls.localize('inlineValues.focusNoScroll', "Show variable values inline in editor while debugging when the language supports inline value locations."),
			],
			default: 'auto'
		},
		'debug.toolBarLocation': {
			enum: ['floating', 'docked', 'commandCenter', 'hidden'],
			markdownDescription: nls.localize({ comment: ['This is the description for a setting'], key: 'toolBarLocation' }, "Controls the location of the debug toolbar. Either `floating` in all views, `docked` in the debug view, `commandCenter` (requires {0}), or `hidden`.", '`#window.commandCenter#`'),
			default: 'floating',
			markdownEnumDescriptions: [
				nls.localize('debugToolBar.floating', "Show debug toolbar in all views."),
				nls.localize('debugToolBar.docked', "Show debug toolbar only in debug views."),
				nls.localize('debugToolBar.commandCenter', "`(Experimental)` Show debug toolbar in the command center."),
				nls.localize('debugToolBar.hidden', "Do not show debug toolbar."),
			]
		},
		'debug.showInStatusBar': {
			enum: ['never', 'always', 'onFirstSessionStart'],
			enumDescriptions: [nls.localize('never', "Never show debug item in status bar"), nls.localize('always', "Always show debug item in status bar"), nls.localize('onFirstSessionStart', "Show debug item in status bar only after debug was started for the first time")],
			description: nls.localize({ comment: ['This is the description for a setting'], key: 'showInStatusBar' }, "Controls when the debug status bar item should be visible."),
			default: 'onFirstSessionStart'
		},
		'debug.internalConsoleOptions': INTERNAL_CONSOLE_OPTIONS_SCHEMA,
		'debug.console.closeOnEnd': {
			type: 'boolean',
			description: nls.localize('debug.console.closeOnEnd', "Controls if the Debug Console should be automatically closed when the debug session ends."),
			default: false
		},
		'debug.terminal.clearBeforeReusing': {
			type: 'boolean',
			description: nls.localize({ comment: ['This is the description for a setting'], key: 'debug.terminal.clearBeforeReusing' }, "Before starting a new debug session in an integrated or external terminal, clear the terminal."),
			default: false
		},
		'debug.openDebug': {
			enum: ['neverOpen', 'openOnSessionStart', 'openOnFirstSessionStart', 'openOnDebugBreak'],
			default: 'openOnDebugBreak',
			description: nls.localize('openDebug', "Controls when the debug view should open.")
		},
		'debug.showSubSessionsInToolBar': {
			type: 'boolean',
			description: nls.localize({ comment: ['This is the description for a setting'], key: 'showSubSessionsInToolBar' }, "Controls whether the debug sub-sessions are shown in the debug tool bar. When this setting is false the stop command on a sub-session will also stop the parent session."),
			default: false
		},
		'debug.console.fontSize': {
			type: 'number',
			description: nls.localize('debug.console.fontSize', "Controls the font size in pixels in the Debug Console."),
			default: isMacintosh ? 12 : 14,
		},
		'debug.console.fontFamily': {
			type: 'string',
			description: nls.localize('debug.console.fontFamily', "Controls the font family in the Debug Console."),
			default: 'default'
		},
		'debug.console.lineHeight': {
			type: 'number',
			description: nls.localize('debug.console.lineHeight', "Controls the line height in pixels in the Debug Console. Use 0 to compute the line height from the font size."),
			default: 0
		},
		'debug.console.wordWrap': {
			type: 'boolean',
			description: nls.localize('debug.console.wordWrap', "Controls if the lines should wrap in the Debug Console."),
			default: true
		},
		'debug.console.historySuggestions': {
			type: 'boolean',
			description: nls.localize('debug.console.historySuggestions', "Controls if the Debug Console should suggest previously typed input."),
			default: true
		},
		'debug.console.collapseIdenticalLines': {
			type: 'boolean',
			description: nls.localize('debug.console.collapseIdenticalLines', "Controls if the Debug Console should collapse identical lines and show a number of occurrences with a badge."),
			default: true
		},
		'debug.console.acceptSuggestionOnEnter': {
			enum: ['off', 'on'],
			description: nls.localize('debug.console.acceptSuggestionOnEnter', "Controls whether suggestions should be accepted on Enter in the Debug Console. Enter is also used to evaluate whatever is typed in the Debug Console."),
			default: 'off'
		},
		'debug.console.maximumLines': {
			type: 'number',
			description: nls.localize('debug.console.maximumLines', "Controls the maximum number of lines in the Debug Console."),
			default: 10000
		},
		'launch': {
			type: 'object',
			description: nls.localize({ comment: ['This is the description for a setting'], key: 'launch' }, "Global debug launch configuration. Should be used as an alternative to 'launch.json' that is shared across workspaces."),
			default: { configurations: [], compounds: [] },
			$ref: launchSchemaId,
			disallowConfigurationDefault: true
		},
		'debug.focusWindowOnBreak': {
			type: 'boolean',
			description: nls.localize('debug.focusWindowOnBreak', "Controls whether the workbench window should be focused when the debugger breaks."),
			default: true
		},
		'debug.focusEditorOnBreak': {
			type: 'boolean',
			description: nls.localize('debug.focusEditorOnBreak', "Controls whether the editor should be focused when the debugger breaks."),
			default: true
		},
		'debug.onTaskErrors': {
			enum: ['debugAnyway', 'showErrors', 'prompt', 'abort'],
			enumDescriptions: [nls.localize('debugAnyway', "Ignore task errors and start debugging."), nls.localize('showErrors', "Show the Problems view and do not start debugging."), nls.localize('prompt', "Prompt user."), nls.localize('cancel', "Cancel debugging.")],
			description: nls.localize('debug.onTaskErrors', "Controls what to do when errors are encountered after running a preLaunchTask."),
			default: 'prompt'
		},
		'debug.showBreakpointsInOverviewRuler': {
			type: 'boolean',
			description: nls.localize({ comment: ['This is the description for a setting'], key: 'showBreakpointsInOverviewRuler' }, "Controls whether breakpoints should be shown in the overview ruler."),
			default: false
		},
		'debug.breakpointsView.presentation': {
			type: 'string',
			description: nls.localize('debug.breakpointsView.presentation', "Controls whether breakpoints are displayed in a tree view grouped by file, or as a flat list."),
			enum: ['tree', 'list'],
			default: 'list'
		},
		'debug.showInlineBreakpointCandidates': {
			type: 'boolean',
			description: nls.localize({ comment: ['This is the description for a setting'], key: 'showInlineBreakpointCandidates' }, "Controls whether inline breakpoints candidate decorations should be shown in the editor while debugging."),
			default: true
		},
		'debug.saveBeforeStart': {
			description: nls.localize('debug.saveBeforeStart', "Controls what editors to save before starting a debug session."),
			enum: ['allEditorsInActiveGroup', 'nonUntitledEditorsInActiveGroup', 'none'],
			enumDescriptions: [
				nls.localize('debug.saveBeforeStart.allEditorsInActiveGroup', "Save all editors in the active group before starting a debug session."),
				nls.localize('debug.saveBeforeStart.nonUntitledEditorsInActiveGroup', "Save all editors in the active group except untitled ones before starting a debug session."),
				nls.localize('debug.saveBeforeStart.none', "Don't save any editors before starting a debug session."),
			],
			default: 'allEditorsInActiveGroup',
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE
		},
		'debug.confirmOnExit': {
			description: nls.localize('debug.confirmOnExit', "Controls whether to confirm when the window closes if there are active debug sessions."),
			type: 'string',
			enum: ['never', 'always'],
			enumDescriptions: [
				nls.localize('debug.confirmOnExit.never', "Never confirm."),
				nls.localize('debug.confirmOnExit.always', "Always confirm if there are debug sessions."),
			],
			default: 'never'
		},
		'debug.disassemblyView.showSourceCode': {
			type: 'boolean',
			default: true,
			description: nls.localize('debug.disassemblyView.showSourceCode', "Show Source Code in Disassembly View.")
		},
		'debug.autoExpandLazyVariables': {
			type: 'string',
			enum: ['auto', 'on', 'off'],
			default: 'auto',
			enumDescriptions: [
				nls.localize('debug.autoExpandLazyVariables.auto', "When in screen reader optimized mode, automatically expand lazy variables."),
				nls.localize('debug.autoExpandLazyVariables.on', "Always automatically expand lazy variables."),
				nls.localize('debug.autoExpandLazyVariables.off', "Never automatically expand lazy variables.")
			],
			description: nls.localize('debug.autoExpandLazyVariables', "Controls whether variables that are lazily resolved, such as getters, are automatically resolved and expanded by the debugger.")
		},
		'debug.enableStatusBarColor': {
			type: 'boolean',
			description: nls.localize('debug.enableStatusBarColor', "Color of the status bar when the debugger is active."),
			default: true
		},
		'debug.hideLauncherWhileDebugging': {
			type: 'boolean',
			markdownDescription: nls.localize({ comment: ['This is the description for a setting'], key: 'debug.hideLauncherWhileDebugging' }, "Hide 'Start Debugging' control in title bar of 'Run and Debug' view while debugging is active. Only relevant when {0} is not `docked`.", '`#debug.toolBarLocation#`'),
			default: false
		},
		'debug.hideSlowPreLaunchWarning': {
			type: 'boolean',
			markdownDescription: nls.localize('debug.hideSlowPreLaunchWarning', "Hide the warning shown when a `preLaunchTask` has been running for a while."),
			default: false
		}
	}
});

AccessibleViewRegistry.register(new ReplAccessibleView());
AccessibleViewRegistry.register(new ReplAccessibilityHelp());
AccessibleViewRegistry.register(new RunAndDebugAccessibilityHelp());
registerWorkbenchContribution2(ReplAccessibilityAnnouncer.ID, ReplAccessibilityAnnouncer, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(DebugWatchAccessibilityAnnouncer.ID, DebugWatchAccessibilityAnnouncer, WorkbenchPhase.AfterRestored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugActionViewItems.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugActionViewItems.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { IAction } from '../../../../base/common/actions.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import * as dom from '../../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { SelectBox, ISelectOptionItem, SeparatorSelectOption } from '../../../../base/browser/ui/selectBox/selectBox.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IDebugService, IDebugSession, IDebugConfiguration, IConfig, ILaunch, State } from '../common/debug.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { selectBorder, selectBackground, asCssVariable } from '../../../../platform/theme/common/colorRegistry.js';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { IDisposable, dispose } from '../../../../base/common/lifecycle.js';
import { ADD_CONFIGURATION_ID } from './debugCommands.js';
import { BaseActionViewItem, IBaseActionViewItemOptions, SelectActionViewItem } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { debugStart } from './debugIcons.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { defaultSelectBoxStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { AccessibilityCommandId } from '../../accessibility/common/accessibilityCommands.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { hasNativeContextMenu } from '../../../../platform/window/common/window.js';
import { Gesture, EventType as TouchEventType } from '../../../../base/browser/touch.js';

const $ = dom.$;

export class StartDebugActionViewItem extends BaseActionViewItem {

	private container!: HTMLElement;
	private start!: HTMLElement;
	private selectBox: SelectBox;
	private debugOptions: { label: string; handler: (() => Promise<boolean>) }[] = [];
	private toDispose: IDisposable[];
	private selected = 0;
	private providers: { label: string; type: string; pick: () => Promise<{ launch: ILaunch; config: IConfig } | undefined> }[] = [];

	constructor(
		private context: unknown,
		action: IAction,
		options: IBaseActionViewItemOptions,
		@IDebugService private readonly debugService: IDebugService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ICommandService private readonly commandService: ICommandService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IContextViewService contextViewService: IContextViewService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IHoverService private readonly hoverService: IHoverService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService
	) {
		super(context, action, options);
		this.toDispose = [];
		this.selectBox = new SelectBox([], -1, contextViewService, defaultSelectBoxStyles, { ariaLabel: nls.localize('debugLaunchConfigurations', 'Debug Launch Configurations'), useCustomDrawn: !hasNativeContextMenu(this.configurationService) });
		this.selectBox.setFocusable(false);
		this.toDispose.push(this.selectBox);

		this.registerListeners();
	}

	private registerListeners(): void {
		this.toDispose.push(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('launch')) {
				this.updateOptions();
			}
		}));
		this.toDispose.push(this.debugService.getConfigurationManager().onDidSelectConfiguration(() => {
			this.updateOptions();
		}));
	}

	override render(container: HTMLElement): void {
		this.container = container;
		container.classList.add('start-debug-action-item');
		this.start = dom.append(container, $(ThemeIcon.asCSSSelector(debugStart)));
		const keybinding = this.keybindingService.lookupKeybinding(this.action.id)?.getLabel();
		const keybindingLabel = keybinding ? ` (${keybinding})` : '';
		const title = this.action.label + keybindingLabel;
		this.toDispose.push(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.start, title));
		this.start.setAttribute('role', 'button');
		this._setAriaLabel(title);

		this._register(Gesture.addTarget(this.start));
		for (const event of [dom.EventType.CLICK, TouchEventType.Tap]) {
			this.toDispose.push(dom.addDisposableListener(this.start, event, () => {
				this.start.blur();
				if (this.debugService.state !== State.Initializing) {
					this.actionRunner.run(this.action, this.context);
				}
			}));
		}

		this.toDispose.push(dom.addDisposableListener(this.start, dom.EventType.MOUSE_DOWN, (e: MouseEvent) => {
			if (this.action.enabled && e.button === 0) {
				this.start.classList.add('active');
			}
		}));
		this.toDispose.push(dom.addDisposableListener(this.start, dom.EventType.MOUSE_UP, () => {
			this.start.classList.remove('active');
		}));
		this.toDispose.push(dom.addDisposableListener(this.start, dom.EventType.MOUSE_OUT, () => {
			this.start.classList.remove('active');
		}));

		this.toDispose.push(dom.addDisposableListener(this.start, dom.EventType.KEY_DOWN, (e: KeyboardEvent) => {
			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.RightArrow)) {
				this.start.tabIndex = -1;
				this.selectBox.focus();
				event.stopPropagation();
			}
		}));
		this.toDispose.push(this.selectBox.onDidSelect(async e => {
			const target = this.debugOptions[e.index];
			const shouldBeSelected = target.handler ? await target.handler() : false;
			if (shouldBeSelected) {
				this.selected = e.index;
			} else {
				// Some select options should not remain selected https://github.com/microsoft/vscode/issues/31526
				this.selectBox.select(this.selected);
			}
		}));

		const selectBoxContainer = $('.configuration');
		this.selectBox.render(dom.append(container, selectBoxContainer));
		this.toDispose.push(dom.addDisposableListener(selectBoxContainer, dom.EventType.KEY_DOWN, (e: KeyboardEvent) => {
			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.LeftArrow)) {
				this.selectBox.setFocusable(false);
				this.start.tabIndex = 0;
				this.start.focus();
				event.stopPropagation();
				event.preventDefault();
			}
		}));
		this.container.style.border = `1px solid ${asCssVariable(selectBorder)}`;
		selectBoxContainer.style.borderLeft = `1px solid ${asCssVariable(selectBorder)}`;
		this.container.style.backgroundColor = asCssVariable(selectBackground);

		const configManager = this.debugService.getConfigurationManager();
		const updateDynamicConfigs = () => configManager.getDynamicProviders().then(providers => {
			if (providers.length !== this.providers.length) {
				this.providers = providers;
				this.updateOptions();
			}
		});

		this.toDispose.push(configManager.onDidChangeConfigurationProviders(updateDynamicConfigs));
		updateDynamicConfigs();
		this.updateOptions();
	}

	override setActionContext(context: any): void {
		this.context = context;
	}

	override isEnabled(): boolean {
		return true;
	}

	override focus(fromRight?: boolean): void {
		if (fromRight) {
			this.selectBox.focus();
		} else {
			this.start.tabIndex = 0;
			this.start.focus();
		}
	}

	override blur(): void {
		this.start.tabIndex = -1;
		this.selectBox.blur();
		this.container.blur();
	}

	override setFocusable(focusable: boolean): void {
		if (focusable) {
			this.start.tabIndex = 0;
		} else {
			this.start.tabIndex = -1;
			this.selectBox.setFocusable(false);
		}
	}

	override dispose(): void {
		this.toDispose = dispose(this.toDispose);
		super.dispose();
	}

	private updateOptions(): void {
		this.selected = 0;
		this.debugOptions = [];
		const manager = this.debugService.getConfigurationManager();
		const inWorkspace = this.contextService.getWorkbenchState() === WorkbenchState.WORKSPACE;
		let lastGroup: string | undefined;
		const disabledIdxs: number[] = [];
		manager.getAllConfigurations().forEach(({ launch, name, presentation }) => {
			if (lastGroup !== presentation?.group) {
				lastGroup = presentation?.group;
				if (this.debugOptions.length) {
					this.debugOptions.push({ label: SeparatorSelectOption.text, handler: () => Promise.resolve(false) });
					disabledIdxs.push(this.debugOptions.length - 1);
				}
			}
			if (name === manager.selectedConfiguration.name && launch === manager.selectedConfiguration.launch) {
				this.selected = this.debugOptions.length;
			}

			const label = inWorkspace ? `${name} (${launch.name})` : name;
			this.debugOptions.push({
				label, handler: async () => {
					await manager.selectConfiguration(launch, name);
					return true;
				}
			});
		});

		// Only take 3 elements from the recent dynamic configurations to not clutter the dropdown
		manager.getRecentDynamicConfigurations().slice(0, 3).forEach(({ name, type }) => {
			if (type === manager.selectedConfiguration.type && manager.selectedConfiguration.name === name) {
				this.selected = this.debugOptions.length;
			}
			this.debugOptions.push({
				label: name,
				handler: async () => {
					await manager.selectConfiguration(undefined, name, undefined, { type });
					return true;
				}
			});
		});

		if (this.debugOptions.length === 0) {
			this.debugOptions.push({ label: nls.localize('noConfigurations', "No Configurations"), handler: async () => false });
		}

		this.debugOptions.push({ label: SeparatorSelectOption.text, handler: () => Promise.resolve(false) });
		disabledIdxs.push(this.debugOptions.length - 1);

		this.providers.forEach(p => {

			this.debugOptions.push({
				label: `${p.label}...`,
				handler: async () => {
					const picked = await p.pick();
					if (picked) {
						await manager.selectConfiguration(picked.launch, picked.config.name, picked.config, { type: p.type });
						return true;
					}
					return false;
				}
			});
		});

		manager.getLaunches().filter(l => !l.hidden).forEach(l => {
			const label = inWorkspace ? nls.localize("addConfigTo", "Add Config ({0})...", l.name) : nls.localize('addConfiguration', "Add Configuration...");
			this.debugOptions.push({
				label, handler: async () => {
					await this.commandService.executeCommand(ADD_CONFIGURATION_ID, l.uri.toString());
					return false;
				}
			});
		});

		this.selectBox.setOptions(this.debugOptions.map((data, index): ISelectOptionItem => ({ text: data.label, isDisabled: disabledIdxs.indexOf(index) !== -1 })), this.selected);
	}

	private _setAriaLabel(title: string): void {
		let ariaLabel = title;
		let keybinding: string | undefined;
		const verbose = this.configurationService.getValue(AccessibilityVerbositySettingId.Debug);
		if (verbose) {
			keybinding = this.keybindingService.lookupKeybinding(AccessibilityCommandId.OpenAccessibilityHelp, this.contextKeyService)?.getLabel() ?? undefined;
		}
		if (keybinding) {
			ariaLabel = nls.localize('commentLabelWithKeybinding', "{0}, use ({1}) for accessibility help", ariaLabel, keybinding);
		} else {
			ariaLabel = nls.localize('commentLabelWithKeybindingNoKeybinding', "{0}, run the command Open Accessibility Help which is currently not triggerable via keybinding.", ariaLabel);
		}
		this.start.ariaLabel = ariaLabel;
	}
}

export class FocusSessionActionViewItem extends SelectActionViewItem<IDebugSession> {
	constructor(
		action: IAction,
		session: IDebugSession | undefined,
		@IDebugService protected readonly debugService: IDebugService,
		@IContextViewService contextViewService: IContextViewService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super(null, action, [], -1, contextViewService, defaultSelectBoxStyles, { ariaLabel: nls.localize('debugSession', 'Debug Session'), useCustomDrawn: !hasNativeContextMenu(configurationService) });

		this._register(this.debugService.getViewModel().onDidFocusSession(() => {
			const session = this.getSelectedSession();
			if (session) {
				const index = this.getSessions().indexOf(session);
				this.select(index);
			}
		}));

		this._register(this.debugService.onDidNewSession(session => {
			const sessionListeners: IDisposable[] = [];
			sessionListeners.push(session.onDidChangeName(() => this.update()));
			sessionListeners.push(session.onDidEndAdapter(() => dispose(sessionListeners)));
			this.update();
		}));
		this.getSessions().forEach(session => {
			this._register(session.onDidChangeName(() => this.update()));
		});
		this._register(this.debugService.onDidEndSession(() => this.update()));

		const selectedSession = session ? this.mapFocusedSessionToSelected(session) : undefined;
		this.update(selectedSession);
	}

	protected override getActionContext(_: string, index: number): IDebugSession {
		return this.getSessions()[index];
	}

	private update(session?: IDebugSession) {
		if (!session) {
			session = this.getSelectedSession();
		}
		const sessions = this.getSessions();
		const names = sessions.map(s => {
			const label = s.getLabel();
			if (s.parentSession) {
				// Indent child sessions so they look like children
				return `\u00A0\u00A0${label}`;
			}

			return label;
		});
		this.setOptions(names.map((data): ISelectOptionItem => ({ text: data })), session ? sessions.indexOf(session) : undefined);
	}

	private getSelectedSession(): IDebugSession | undefined {
		const session = this.debugService.getViewModel().focusedSession;
		return session ? this.mapFocusedSessionToSelected(session) : undefined;
	}

	protected getSessions(): ReadonlyArray<IDebugSession> {
		const showSubSessions = this.configurationService.getValue<IDebugConfiguration>('debug').showSubSessionsInToolBar;
		const sessions = this.debugService.getModel().getSessions();

		return showSubSessions ? sessions : sessions.filter(s => !s.parentSession);
	}

	protected mapFocusedSessionToSelected(focusedSession: IDebugSession): IDebugSession {
		const showSubSessions = this.configurationService.getValue<IDebugConfiguration>('debug').showSubSessionsInToolBar;
		while (focusedSession.parentSession && !showSubSessions) {
			focusedSession = focusedSession.parentSession;
		}
		return focusedSession;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugAdapterManager.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugAdapterManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../../base/common/async.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IJSONSchema, IJSONSchemaMap } from '../../../../base/common/jsonSchema.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import Severity from '../../../../base/common/severity.js';
import * as strings from '../../../../base/common/strings.js';
import { isCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { IEditorModel } from '../../../../editor/common/editorCommon.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { ITextModel } from '../../../../editor/common/model.js';
import * as nls from '../../../../nls.js';
import { IMenuService, MenuId, MenuItemAction } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Extensions as JSONExtensions, IJSONContributionRegistry } from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { Breakpoints } from '../common/breakpoints.js';
import { CONTEXT_DEBUGGERS_AVAILABLE, CONTEXT_DEBUG_EXTENSION_AVAILABLE, IAdapterDescriptor, IAdapterManager, IConfig, IConfigurationManager, IDebugAdapter, IDebugAdapterDescriptorFactory, IDebugAdapterFactory, IDebugConfiguration, IDebugSession, IGuessedDebugger, INTERNAL_CONSOLE_OPTIONS_SCHEMA } from '../common/debug.js';
import { Debugger } from '../common/debugger.js';
import { breakpointsExtPoint, debuggersExtPoint, launchSchema, presentationSchema } from '../common/debugSchemas.js';
import { TaskDefinitionRegistry } from '../../tasks/common/taskDefinitionRegistry.js';
import { ITaskService } from '../../tasks/common/taskService.js';
import { launchSchemaId } from '../../../services/configuration/common/configuration.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { ILifecycleService, LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';

const jsonRegistry = Registry.as<IJSONContributionRegistry>(JSONExtensions.JSONContribution);

export interface IAdapterManagerDelegate {
	readonly onDidNewSession: Event<IDebugSession>;
	configurationManager(): IConfigurationManager;
}

export class AdapterManager extends Disposable implements IAdapterManager {

	private debuggers: Debugger[];
	private adapterDescriptorFactories: IDebugAdapterDescriptorFactory[];
	private debugAdapterFactories = new Map<string, IDebugAdapterFactory>();
	private debuggersAvailable!: IContextKey<boolean>;
	private debugExtensionsAvailable!: IContextKey<boolean>;
	private readonly _onDidRegisterDebugger = new Emitter<void>();
	private readonly _onDidDebuggersExtPointRead = new Emitter<void>();
	private breakpointContributions: Breakpoints[] = [];
	private debuggerWhenKeys = new Set<string>();
	private taskLabels: string[] = [];

	/** Extensions that were already active before any debugger activation events */
	private earlyActivatedExtensions: Set<string> | undefined;

	private usedDebugTypes = new Set<string>();

	constructor(
		private readonly delegate: IAdapterManagerDelegate,
		@IEditorService private readonly editorService: IEditorService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ICommandService private readonly commandService: ICommandService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IDialogService private readonly dialogService: IDialogService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@ITaskService private readonly tasksService: ITaskService,
		@IMenuService private readonly menuService: IMenuService,
	) {
		super();
		this.adapterDescriptorFactories = [];
		this.debuggers = [];
		this.registerListeners();
		this.contextKeyService.bufferChangeEvents(() => {
			this.debuggersAvailable = CONTEXT_DEBUGGERS_AVAILABLE.bindTo(contextKeyService);
			this.debugExtensionsAvailable = CONTEXT_DEBUG_EXTENSION_AVAILABLE.bindTo(contextKeyService);
		});
		this._register(this.contextKeyService.onDidChangeContext(e => {
			if (e.affectsSome(this.debuggerWhenKeys)) {
				this.debuggersAvailable.set(this.hasEnabledDebuggers());
				this.updateDebugAdapterSchema();
			}
		}));
		this._register(this.onDidDebuggersExtPointRead(() => {
			this.debugExtensionsAvailable.set(this.debuggers.length > 0);
		}));

		// generous debounce since this will end up calling `resolveTask` internally
		const updateTaskScheduler = this._register(new RunOnceScheduler(() => this.updateTaskLabels(), 5000));

		this._register(Event.any(tasksService.onDidChangeTaskConfig, tasksService.onDidChangeTaskProviders)(() => {
			updateTaskScheduler.cancel();
			updateTaskScheduler.schedule();
		}));
		this.lifecycleService.when(LifecyclePhase.Eventually)
			.then(() => this.debugExtensionsAvailable.set(this.debuggers.length > 0)); // If no extensions with a debugger contribution are loaded

		this._register(delegate.onDidNewSession(s => {
			this.usedDebugTypes.add(s.configuration.type);
		}));

		updateTaskScheduler.schedule();
	}

	private registerListeners(): void {
		debuggersExtPoint.setHandler((extensions, delta) => {
			delta.added.forEach(added => {
				added.value.forEach(rawAdapter => {
					if (!rawAdapter.type || (typeof rawAdapter.type !== 'string')) {
						added.collector.error(nls.localize('debugNoType', "Debugger 'type' can not be omitted and must be of type 'string'."));
					}

					if (rawAdapter.type !== '*') {
						const existing = this.getDebugger(rawAdapter.type);
						if (existing) {
							existing.merge(rawAdapter, added.description);
						} else {
							const dbg = this.instantiationService.createInstance(Debugger, this, rawAdapter, added.description);
							dbg.when?.keys().forEach(key => this.debuggerWhenKeys.add(key));
							this.debuggers.push(dbg);
						}
					}
				});
			});

			// take care of all wildcard contributions
			extensions.forEach(extension => {
				extension.value.forEach(rawAdapter => {
					if (rawAdapter.type === '*') {
						this.debuggers.forEach(dbg => dbg.merge(rawAdapter, extension.description));
					}
				});
			});

			delta.removed.forEach(removed => {
				const removedTypes = removed.value.map(rawAdapter => rawAdapter.type);
				this.debuggers = this.debuggers.filter(d => removedTypes.indexOf(d.type) === -1);
			});

			this.updateDebugAdapterSchema();
			this._onDidDebuggersExtPointRead.fire();
		});

		breakpointsExtPoint.setHandler(extensions => {
			this.breakpointContributions = extensions.flatMap(ext => ext.value.map(breakpoint => this.instantiationService.createInstance(Breakpoints, breakpoint)));
		});
	}

	private updateTaskLabels() {
		this.tasksService.getKnownTasks().then(tasks => {
			this.taskLabels = tasks.map(task => task._label);
			this.updateDebugAdapterSchema();
		});
	}

	private updateDebugAdapterSchema() {
		// update the schema to include all attributes, snippets and types from extensions.
		const items = (<IJSONSchema>launchSchema.properties!['configurations'].items);
		const taskSchema = TaskDefinitionRegistry.getJsonSchema();
		const definitions: IJSONSchemaMap = {
			'common': {
				properties: {
					'name': {
						type: 'string',
						description: nls.localize('debugName', "Name of configuration; appears in the launch configuration dropdown menu."),
						default: 'Launch'
					},
					'debugServer': {
						type: 'number',
						description: nls.localize('debugServer', "For debug extension development only: if a port is specified VS Code tries to connect to a debug adapter running in server mode"),
						default: 4711
					},
					'preLaunchTask': {
						anyOf: [taskSchema, {
							type: ['string']
						}],
						default: '',
						defaultSnippets: [{ body: { task: '', type: '' } }],
						description: nls.localize('debugPrelaunchTask', "Task to run before debug session starts."),
						examples: this.taskLabels,
					},
					'postDebugTask': {
						anyOf: [taskSchema, {
							type: ['string'],
						}],
						default: '',
						defaultSnippets: [{ body: { task: '', type: '' } }],
						description: nls.localize('debugPostDebugTask', "Task to run after debug session ends."),
						examples: this.taskLabels,
					},
					'presentation': presentationSchema,
					'internalConsoleOptions': INTERNAL_CONSOLE_OPTIONS_SCHEMA,
					'suppressMultipleSessionWarning': {
						type: 'boolean',
						description: nls.localize('suppressMultipleSessionWarning', "Disable the warning when trying to start the same debug configuration more than once."),
						default: true
					}
				}
			}
		};
		launchSchema.definitions = definitions;
		items.oneOf = [];
		items.defaultSnippets = [];
		this.debuggers.forEach(adapter => {
			const schemaAttributes = adapter.getSchemaAttributes(definitions);
			if (schemaAttributes && items.oneOf) {
				items.oneOf.push(...schemaAttributes);
			}
			const configurationSnippets = adapter.configurationSnippets;
			if (configurationSnippets && items.defaultSnippets) {
				items.defaultSnippets.push(...configurationSnippets);
			}
		});
		jsonRegistry.registerSchema(launchSchemaId, launchSchema);
	}

	registerDebugAdapterFactory(debugTypes: string[], debugAdapterLauncher: IDebugAdapterFactory): IDisposable {
		debugTypes.forEach(debugType => this.debugAdapterFactories.set(debugType, debugAdapterLauncher));
		this.debuggersAvailable.set(this.hasEnabledDebuggers());
		this._onDidRegisterDebugger.fire();

		return {
			dispose: () => {
				debugTypes.forEach(debugType => this.debugAdapterFactories.delete(debugType));
			}
		};
	}

	hasEnabledDebuggers(): boolean {
		for (const [type] of this.debugAdapterFactories) {
			const dbg = this.getDebugger(type);
			if (dbg && dbg.enabled) {
				return true;
			}
		}

		return false;
	}

	createDebugAdapter(session: IDebugSession): IDebugAdapter | undefined {
		const factory = this.debugAdapterFactories.get(session.configuration.type);
		if (factory) {
			return factory.createDebugAdapter(session);
		}
		return undefined;
	}

	substituteVariables(debugType: string, folder: IWorkspaceFolder | undefined, config: IConfig): Promise<IConfig> {
		const factory = this.debugAdapterFactories.get(debugType);
		if (factory) {
			return factory.substituteVariables(folder, config);
		}
		return Promise.resolve(config);
	}

	runInTerminal(debugType: string, args: DebugProtocol.RunInTerminalRequestArguments, sessionId: string): Promise<number | undefined> {
		const factory = this.debugAdapterFactories.get(debugType);
		if (factory) {
			return factory.runInTerminal(args, sessionId);
		}
		return Promise.resolve(void 0);
	}

	registerDebugAdapterDescriptorFactory(debugAdapterProvider: IDebugAdapterDescriptorFactory): IDisposable {
		this.adapterDescriptorFactories.push(debugAdapterProvider);
		return {
			dispose: () => {
				this.unregisterDebugAdapterDescriptorFactory(debugAdapterProvider);
			}
		};
	}

	unregisterDebugAdapterDescriptorFactory(debugAdapterProvider: IDebugAdapterDescriptorFactory): void {
		const ix = this.adapterDescriptorFactories.indexOf(debugAdapterProvider);
		if (ix >= 0) {
			this.adapterDescriptorFactories.splice(ix, 1);
		}
	}

	getDebugAdapterDescriptor(session: IDebugSession): Promise<IAdapterDescriptor | undefined> {
		const config = session.configuration;
		const providers = this.adapterDescriptorFactories.filter(p => p.type === config.type && p.createDebugAdapterDescriptor);
		if (providers.length === 1) {
			return providers[0].createDebugAdapterDescriptor(session);
		} else {
			// TODO@AW handle n > 1 case
		}
		return Promise.resolve(undefined);
	}

	getDebuggerLabel(type: string): string | undefined {
		const dbgr = this.getDebugger(type);
		if (dbgr) {
			return dbgr.label;
		}

		return undefined;
	}

	get onDidRegisterDebugger(): Event<void> {
		return this._onDidRegisterDebugger.event;
	}

	get onDidDebuggersExtPointRead(): Event<void> {
		return this._onDidDebuggersExtPointRead.event;
	}

	canSetBreakpointsIn(model: ITextModel): boolean {
		const languageId = model.getLanguageId();
		if (!languageId || languageId === 'jsonc' || languageId === 'log') {
			// do not allow breakpoints in our settings files and output
			return false;
		}
		if (this.configurationService.getValue<IDebugConfiguration>('debug').allowBreakpointsEverywhere) {
			return true;
		}

		return this.breakpointContributions.some(breakpoints => breakpoints.language === languageId && breakpoints.enabled);
	}

	getDebugger(type: string): Debugger | undefined {
		return this.debuggers.find(dbg => strings.equalsIgnoreCase(dbg.type, type));
	}

	getEnabledDebugger(type: string): Debugger | undefined {
		const adapter = this.getDebugger(type);
		return adapter && adapter.enabled ? adapter : undefined;
	}

	someDebuggerInterestedInLanguage(languageId: string): boolean {
		return !!this.debuggers
			.filter(d => d.enabled)
			.find(a => a.interestedInLanguage(languageId));
	}

	async guessDebugger(gettingConfigurations: boolean): Promise<IGuessedDebugger | undefined> {
		const activeTextEditorControl = this.editorService.activeTextEditorControl;
		let candidates: Debugger[] = [];
		let languageLabel: string | null = null;
		let model: IEditorModel | null = null;
		if (isCodeEditor(activeTextEditorControl)) {
			model = activeTextEditorControl.getModel();
			const language = model ? model.getLanguageId() : undefined;
			if (language) {
				languageLabel = this.languageService.getLanguageName(language);
			}
			const adapters = this.debuggers
				.filter(a => a.enabled)
				.filter(a => language && a.interestedInLanguage(language));
			if (adapters.length === 1) {
				return { debugger: adapters[0] };
			}
			if (adapters.length > 1) {
				candidates = adapters;
			}
		}

		// We want to get the debuggers that have configuration providers in the case we are fetching configurations
		// Or if a breakpoint can be set in the current file (good hint that an extension can handle it)
		if ((!languageLabel || gettingConfigurations || (model && this.canSetBreakpointsIn(model))) && candidates.length === 0) {
			await this.activateDebuggers('onDebugInitialConfigurations');

			candidates = this.debuggers
				.filter(a => a.enabled)
				.filter(dbg => dbg.hasInitialConfiguration() || dbg.hasDynamicConfigurationProviders() || dbg.hasConfigurationProvider());
		}

		if (candidates.length === 0 && languageLabel) {
			if (languageLabel.indexOf(' ') >= 0) {
				languageLabel = `'${languageLabel}'`;
			}
			const { confirmed } = await this.dialogService.confirm({
				type: Severity.Warning,
				message: nls.localize('CouldNotFindLanguage', "You don't have an extension for debugging {0}. Should we find a {0} extension in the Marketplace?", languageLabel),
				primaryButton: nls.localize({ key: 'findExtension', comment: ['&& denotes a mnemonic'] }, "&&Find {0} extension", languageLabel)
			});
			if (confirmed) {
				await this.commandService.executeCommand('debug.installAdditionalDebuggers', languageLabel);
			}
			return undefined;
		}

		this.initExtensionActivationsIfNeeded();

		candidates.sort((first, second) => first.label.localeCompare(second.label));
		candidates = candidates.filter(a => !a.isHiddenFromDropdown);

		const suggestedCandidates: Debugger[] = [];
		const otherCandidates: Debugger[] = [];
		candidates.forEach(d => {
			const descriptor = d.getMainExtensionDescriptor();
			if (descriptor.id && !!this.earlyActivatedExtensions?.has(descriptor.id)) {
				// Was activated early
				suggestedCandidates.push(d);
			} else if (this.usedDebugTypes.has(d.type)) {
				// Was used already
				suggestedCandidates.push(d);
			} else {
				otherCandidates.push(d);
			}
		});

		const picks: ({ label: string; pick?: () => IGuessedDebugger | Promise<IGuessedDebugger | undefined>; type?: string } | MenuItemAction)[] = [];
		const dynamic = await this.delegate.configurationManager().getDynamicProviders();
		if (suggestedCandidates.length > 0) {
			picks.push(
				{ type: 'separator', label: nls.localize('suggestedDebuggers', "Suggested") },
				...suggestedCandidates.map(c => ({ label: c.label, pick: () => ({ debugger: c }) })));
		}

		if (otherCandidates.length > 0) {
			if (picks.length > 0) {
				picks.push({ type: 'separator', label: '' });
			}

			picks.push(...otherCandidates.map(c => ({ label: c.label, pick: () => ({ debugger: c }) })));
		}

		if (dynamic.length) {
			if (picks.length) {
				picks.push({ type: 'separator', label: '' });
			}

			for (const d of dynamic) {
				picks.push({
					label: nls.localize('moreOptionsForDebugType', "More {0} options...", d.label),
					pick: async (): Promise<IGuessedDebugger | undefined> => {
						const cfg = await d.pick();
						if (!cfg) { return undefined; }
						return cfg && { debugger: this.getDebugger(d.type)!, withConfig: cfg };
					},
				});
			}
		}

		picks.push(
			{ type: 'separator', label: '' },
			{ label: languageLabel ? nls.localize('installLanguage', "Install an extension for {0}...", languageLabel) : nls.localize('installExt', "Install extension...") }
		);

		const contributed = this.menuService.getMenuActions(MenuId.DebugCreateConfiguration, this.contextKeyService);
		for (const [, action] of contributed) {
			for (const item of action) {
				picks.push(item);
			}
		}

		const placeHolder = nls.localize('selectDebug', "Select debugger");
		return this.quickInputService.pick<{ label: string; debugger?: Debugger } | IQuickPickItem>(picks, { activeItem: picks[0], placeHolder }).then(async picked => {
			if (picked && 'pick' in picked && typeof picked.pick === 'function') {
				return await picked.pick();
			}

			if (picked instanceof MenuItemAction) {
				picked.run();
				return;
			}

			if (picked) {
				this.commandService.executeCommand('debug.installAdditionalDebuggers', languageLabel);
			}

			return undefined;
		});
	}

	private initExtensionActivationsIfNeeded(): void {
		if (!this.earlyActivatedExtensions) {
			this.earlyActivatedExtensions = new Set<string>();

			const status = this.extensionService.getExtensionsStatus();
			for (const id in status) {
				if (!!status[id].activationTimes) {
					this.earlyActivatedExtensions.add(id);
				}
			}
		}
	}

	async activateDebuggers(activationEvent: string, debugType?: string): Promise<void> {
		this.initExtensionActivationsIfNeeded();

		const promises: Promise<any>[] = [
			this.extensionService.activateByEvent(activationEvent),
			this.extensionService.activateByEvent('onDebug')
		];
		if (debugType) {
			promises.push(this.extensionService.activateByEvent(`${activationEvent}:${debugType}`));
		}
		await Promise.all(promises);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugANSIHandling.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugANSIHandling.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IHighlight } from '../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { Color, RGBA } from '../../../../base/common/color.js';
import { isDefined } from '../../../../base/common/types.js';
import { editorHoverBackground, listActiveSelectionBackground, listFocusBackground, listInactiveFocusBackground, listInactiveSelectionBackground } from '../../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { PANEL_BACKGROUND, SIDE_BAR_BACKGROUND } from '../../../common/theme.js';
import { ansiColorIdentifiers } from '../../terminal/common/terminalColorRegistry.js';
import { ILinkDetector } from './linkDetector.js';

/**
 * @param text The content to stylize.
 * @returns An {@link HTMLSpanElement} that contains the potentially stylized text.
 */
export function handleANSIOutput(text: string, linkDetector: ILinkDetector, workspaceFolder: IWorkspaceFolder | undefined, highlights: IHighlight[] | undefined): HTMLSpanElement {

	const root: HTMLSpanElement = document.createElement('span');
	const textLength: number = text.length;

	let styleNames: string[] = [];
	let customFgColor: RGBA | string | undefined;
	let customBgColor: RGBA | string | undefined;
	let customUnderlineColor: RGBA | string | undefined;
	let colorsInverted: boolean = false;
	let currentPos: number = 0;
	let unprintedChars = 0;
	let buffer: string = '';

	while (currentPos < textLength) {

		let sequenceFound: boolean = false;

		// Potentially an ANSI escape sequence.
		// See http://ascii-table.com/ansi-escape-sequences.php & https://en.wikipedia.org/wiki/ANSI_escape_code
		if (text.charCodeAt(currentPos) === 27 && text.charAt(currentPos + 1) === '[') {

			const startPos: number = currentPos;
			currentPos += 2; // Ignore 'Esc[' as it's in every sequence.

			let ansiSequence: string = '';

			while (currentPos < textLength) {
				const char: string = text.charAt(currentPos);
				ansiSequence += char;

				currentPos++;

				// Look for a known sequence terminating character.
				if (char.match(/^[ABCDHIJKfhmpsu]$/)) {
					sequenceFound = true;
					break;
				}

			}

			if (sequenceFound) {

				unprintedChars += 2 + ansiSequence.length;

				// Flush buffer with previous styles.
				appendStylizedStringToContainer(root, buffer, styleNames, linkDetector, workspaceFolder, customFgColor, customBgColor, customUnderlineColor, highlights, currentPos - buffer.length - unprintedChars);

				buffer = '';

				/*
				 * Certain ranges that are matched here do not contain real graphics rendition sequences. For
				 * the sake of having a simpler expression, they have been included anyway.
				 */
				if (ansiSequence.match(/^(?:[34][0-8]|9[0-7]|10[0-7]|[0-9]|2[1-5,7-9]|[34]9|5[8,9]|1[0-9])(?:;[349][0-7]|10[0-7]|[013]|[245]|[34]9)?(?:;[012]?[0-9]?[0-9])*;?m$/)) {

					const styleCodes: number[] = ansiSequence.slice(0, -1) // Remove final 'm' character.
						.split(';')										   // Separate style codes.
						.filter(elem => elem !== '')			           // Filter empty elems as '34;m' -> ['34', ''].
						.map(elem => parseInt(elem, 10));		           // Convert to numbers.

					if (styleCodes[0] === 38 || styleCodes[0] === 48 || styleCodes[0] === 58) {
						// Advanced color code - can't be combined with formatting codes like simple colors can
						// Ignores invalid colors and additional info beyond what is necessary
						const colorType = (styleCodes[0] === 38) ? 'foreground' : ((styleCodes[0] === 48) ? 'background' : 'underline');

						if (styleCodes[1] === 5) {
							set8BitColor(styleCodes, colorType);
						} else if (styleCodes[1] === 2) {
							set24BitColor(styleCodes, colorType);
						}
					} else {
						setBasicFormatters(styleCodes);
					}

				} else {
					// Unsupported sequence so simply hide it.
				}

			} else {
				currentPos = startPos;
			}
		}

		if (sequenceFound === false) {
			buffer += text.charAt(currentPos);
			currentPos++;
		}
	}

	// Flush remaining text buffer if not empty.
	if (buffer) {
		appendStylizedStringToContainer(root, buffer, styleNames, linkDetector, workspaceFolder, customFgColor, customBgColor, customUnderlineColor, highlights, currentPos - buffer.length);
	}

	return root;

	/**
	 * Change the foreground or background color by clearing the current color
	 * and adding the new one.
	 * @param colorType If `'foreground'`, will change the foreground color, if
	 * 	`'background'`, will change the background color, and if `'underline'`
	 * will set the underline color.
	 * @param color Color to change to. If `undefined` or not provided,
	 * will clear current color without adding a new one.
	 */
	function changeColor(colorType: 'foreground' | 'background' | 'underline', color?: RGBA | string): void {
		if (colorType === 'foreground') {
			customFgColor = color;
		} else if (colorType === 'background') {
			customBgColor = color;
		} else if (colorType === 'underline') {
			customUnderlineColor = color;
		}
		styleNames = styleNames.filter(style => style !== `code-${colorType}-colored`);
		if (color !== undefined) {
			styleNames.push(`code-${colorType}-colored`);
		}
	}

	/**
	 * Swap foreground and background colors.  Used for color inversion.  Caller should check
	 * [] flag to make sure it is appropriate to turn ON or OFF (if it is already inverted don't call
	 */
	function reverseForegroundAndBackgroundColors(): void {
		const oldFgColor = customFgColor;
		changeColor('foreground', customBgColor);
		changeColor('background', oldFgColor);
	}

	/**
	 * Calculate and set basic ANSI formatting. Supports ON/OFF of bold, italic, underline,
	 * double underline,  crossed-out/strikethrough, overline, dim, blink, rapid blink,
	 * reverse/invert video, hidden, superscript, subscript and alternate font codes,
	 * clearing/resetting of foreground, background and underline colors,
	 * setting normal foreground and background colors, and bright foreground and
	 * background colors. Not to be used for codes containing advanced colors.
	 * Will ignore invalid codes.
	 * @param styleCodes Array of ANSI basic styling numbers, which will be
	 * applied in order. New colors and backgrounds clear old ones; new formatting
	 * does not.
	 * @see {@link https://en.wikipedia.org/wiki/ANSI_escape_code#SGR }
	 */
	function setBasicFormatters(styleCodes: number[]): void {
		for (const code of styleCodes) {
			switch (code) {
				case 0: {  // reset (everything)
					styleNames = [];
					customFgColor = undefined;
					customBgColor = undefined;
					break;
				}
				case 1: { // bold
					styleNames = styleNames.filter(style => style !== `code-bold`);
					styleNames.push('code-bold');
					break;
				}
				case 2: { // dim
					styleNames = styleNames.filter(style => style !== `code-dim`);
					styleNames.push('code-dim');
					break;
				}
				case 3: { // italic
					styleNames = styleNames.filter(style => style !== `code-italic`);
					styleNames.push('code-italic');
					break;
				}
				case 4: { // underline
					styleNames = styleNames.filter(style => (style !== `code-underline` && style !== `code-double-underline`));
					styleNames.push('code-underline');
					break;
				}
				case 5: { // blink
					styleNames = styleNames.filter(style => style !== `code-blink`);
					styleNames.push('code-blink');
					break;
				}
				case 6: { // rapid blink
					styleNames = styleNames.filter(style => style !== `code-rapid-blink`);
					styleNames.push('code-rapid-blink');
					break;
				}
				case 7: { // invert foreground and background
					if (!colorsInverted) {
						colorsInverted = true;
						reverseForegroundAndBackgroundColors();
					}
					break;
				}
				case 8: { // hidden
					styleNames = styleNames.filter(style => style !== `code-hidden`);
					styleNames.push('code-hidden');
					break;
				}
				case 9: { // strike-through/crossed-out
					styleNames = styleNames.filter(style => style !== `code-strike-through`);
					styleNames.push('code-strike-through');
					break;
				}
				case 10: { // normal default font
					styleNames = styleNames.filter(style => !style.startsWith('code-font'));
					break;
				}
				case 11: case 12: case 13: case 14: case 15: case 16: case 17: case 18: case 19: case 20: { // font codes (and 20 is 'blackletter' font code)
					styleNames = styleNames.filter(style => !style.startsWith('code-font'));
					styleNames.push(`code-font-${code - 10}`);
					break;
				}
				case 21: { // double underline
					styleNames = styleNames.filter(style => (style !== `code-underline` && style !== `code-double-underline`));
					styleNames.push('code-double-underline');
					break;
				}
				case 22: { // normal intensity (bold off and dim off)
					styleNames = styleNames.filter(style => (style !== `code-bold` && style !== `code-dim`));
					break;
				}
				case 23: { // Neither italic or blackletter (font 10)
					styleNames = styleNames.filter(style => (style !== `code-italic` && style !== `code-font-10`));
					break;
				}
				case 24: { // not underlined (Neither singly nor doubly underlined)
					styleNames = styleNames.filter(style => (style !== `code-underline` && style !== `code-double-underline`));
					break;
				}
				case 25: { // not blinking
					styleNames = styleNames.filter(style => (style !== `code-blink` && style !== `code-rapid-blink`));
					break;
				}
				case 27: { // not reversed/inverted
					if (colorsInverted) {
						colorsInverted = false;
						reverseForegroundAndBackgroundColors();
					}
					break;
				}
				case 28: { // not hidden (reveal)
					styleNames = styleNames.filter(style => style !== `code-hidden`);
					break;
				}
				case 29: { // not crossed-out
					styleNames = styleNames.filter(style => style !== `code-strike-through`);
					break;
				}
				case 53: { // overlined
					styleNames = styleNames.filter(style => style !== `code-overline`);
					styleNames.push('code-overline');
					break;
				}
				case 55: { // not overlined
					styleNames = styleNames.filter(style => style !== `code-overline`);
					break;
				}
				case 39: {  // default foreground color
					changeColor('foreground', undefined);
					break;
				}
				case 49: {  // default background color
					changeColor('background', undefined);
					break;
				}
				case 59: {  // default underline color
					changeColor('underline', undefined);
					break;
				}
				case 73: { // superscript
					styleNames = styleNames.filter(style => (style !== `code-superscript` && style !== `code-subscript`));
					styleNames.push('code-superscript');
					break;
				}
				case 74: { // subscript
					styleNames = styleNames.filter(style => (style !== `code-superscript` && style !== `code-subscript`));
					styleNames.push('code-subscript');
					break;
				}
				case 75: { // neither superscript or subscript
					styleNames = styleNames.filter(style => (style !== `code-superscript` && style !== `code-subscript`));
					break;
				}
				default: {
					setBasicColor(code);
					break;
				}
			}
		}
	}

	/**
	 * Calculate and set styling for complicated 24-bit ANSI color codes.
	 * @param styleCodes Full list of integer codes that make up the full ANSI
	 * sequence, including the two defining codes and the three RGB codes.
	 * @param colorType If `'foreground'`, will set foreground color, if
	 * `'background'`, will set background color, and if it is `'underline'`
	 * will set the underline color.
	 * @see {@link https://en.wikipedia.org/wiki/ANSI_escape_code#24-bit }
	 */
	function set24BitColor(styleCodes: number[], colorType: 'foreground' | 'background' | 'underline'): void {
		if (styleCodes.length >= 5 &&
			styleCodes[2] >= 0 && styleCodes[2] <= 255 &&
			styleCodes[3] >= 0 && styleCodes[3] <= 255 &&
			styleCodes[4] >= 0 && styleCodes[4] <= 255) {
			const customColor = new RGBA(styleCodes[2], styleCodes[3], styleCodes[4]);
			changeColor(colorType, customColor);
		}
	}

	/**
	 * Calculate and set styling for advanced 8-bit ANSI color codes.
	 * @param styleCodes Full list of integer codes that make up the ANSI
	 * sequence, including the two defining codes and the one color code.
	 * @param colorType If `'foreground'`, will set foreground color, if
	 * `'background'`, will set background color and if it is `'underline'`
	 * will set the underline color.
	 * @see {@link https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit }
	 */
	function set8BitColor(styleCodes: number[], colorType: 'foreground' | 'background' | 'underline'): void {
		let colorNumber = styleCodes[2];
		const color = calcANSI8bitColor(colorNumber);

		if (color) {
			changeColor(colorType, color);
		} else if (colorNumber >= 0 && colorNumber <= 15) {
			if (colorType === 'underline') {
				// for underline colors we just decode the 0-15 color number to theme color, set and return
				const colorName = ansiColorIdentifiers[colorNumber];
				changeColor(colorType, `--vscode-debug-ansi-${colorName}`);
				return;
			}
			// Need to map to one of the four basic color ranges (30-37, 90-97, 40-47, 100-107)
			colorNumber += 30;
			if (colorNumber >= 38) {
				// Bright colors
				colorNumber += 52;
			}
			if (colorType === 'background') {
				colorNumber += 10;
			}
			setBasicColor(colorNumber);
		}
	}

	/**
	 * Calculate and set styling for basic bright and dark ANSI color codes. Uses
	 * theme colors if available. Automatically distinguishes between foreground
	 * and background colors; does not support color-clearing codes 39 and 49.
	 * @param styleCode Integer color code on one of the following ranges:
	 * [30-37, 90-97, 40-47, 100-107]. If not on one of these ranges, will do
	 * nothing.
	 */
	function setBasicColor(styleCode: number): void {
		let colorType: 'foreground' | 'background' | undefined;
		let colorIndex: number | undefined;

		if (styleCode >= 30 && styleCode <= 37) {
			colorIndex = styleCode - 30;
			colorType = 'foreground';
		} else if (styleCode >= 90 && styleCode <= 97) {
			colorIndex = (styleCode - 90) + 8; // High-intensity (bright)
			colorType = 'foreground';
		} else if (styleCode >= 40 && styleCode <= 47) {
			colorIndex = styleCode - 40;
			colorType = 'background';
		} else if (styleCode >= 100 && styleCode <= 107) {
			colorIndex = (styleCode - 100) + 8; // High-intensity (bright)
			colorType = 'background';
		}

		if (colorIndex !== undefined && colorType) {
			const colorName = ansiColorIdentifiers[colorIndex];
			changeColor(colorType, `--vscode-debug-ansi-${colorName.replaceAll('.', '-')}`);
		}
	}
}

/**
 * @param root The {@link HTMLElement} to append the content to.
 * @param stringContent The text content to be appended.
 * @param cssClasses The list of CSS styles to apply to the text content.
 * @param linkDetector The {@link ILinkDetector} responsible for generating links from {@param stringContent}.
 * @param customTextColor If provided, will apply custom color with inline style.
 * @param customBackgroundColor If provided, will apply custom backgroundColor with inline style.
 * @param customUnderlineColor If provided, will apply custom textDecorationColor with inline style.
 * @param highlights The ranges to highlight.
 * @param offset The starting index of the stringContent in the original text.
 */
export function appendStylizedStringToContainer(
	root: HTMLElement,
	stringContent: string,
	cssClasses: string[],
	linkDetector: ILinkDetector,
	workspaceFolder: IWorkspaceFolder | undefined,
	customTextColor: RGBA | string | undefined,
	customBackgroundColor: RGBA | string | undefined,
	customUnderlineColor: RGBA | string | undefined,
	highlights: IHighlight[] | undefined,
	offset: number,
): void {
	if (!root || !stringContent) {
		return;
	}

	const container = linkDetector.linkify(
		stringContent,
		true,
		workspaceFolder,
		undefined,
		undefined,
		highlights?.map(h => ({ start: h.start - offset, end: h.end - offset, extraClasses: h.extraClasses })),
	);

	container.className = cssClasses.join(' ');
	if (customTextColor) {
		container.style.color =
			typeof customTextColor === 'string' ? `var(${customTextColor})` : Color.Format.CSS.formatRGB(new Color(customTextColor));
	}
	if (customBackgroundColor) {
		container.style.backgroundColor =
			typeof customBackgroundColor === 'string' ? `var(${customBackgroundColor})` : Color.Format.CSS.formatRGB(new Color(customBackgroundColor));
	}
	if (customUnderlineColor) {
		container.style.textDecorationColor =
			typeof customUnderlineColor === 'string' ? `var(${customUnderlineColor})` : Color.Format.CSS.formatRGB(new Color(customUnderlineColor));
	}

	root.appendChild(container);
}

/**
 * Calculate the color from the color set defined in the ANSI 8-bit standard.
 * Standard and high intensity colors are not defined in the standard as specific
 * colors, so these and invalid colors return `undefined`.
 * @see {@link https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit } for info.
 * @param colorNumber The number (ranging from 16 to 255) referring to the color
 * desired.
 */
export function calcANSI8bitColor(colorNumber: number): RGBA | undefined {
	if (colorNumber % 1 !== 0) {
		// Should be integer
		return;
	} if (colorNumber >= 16 && colorNumber <= 231) {
		// Converts to one of 216 RGB colors
		colorNumber -= 16;

		let blue: number = colorNumber % 6;
		colorNumber = (colorNumber - blue) / 6;
		let green: number = colorNumber % 6;
		colorNumber = (colorNumber - green) / 6;
		let red: number = colorNumber;

		// red, green, blue now range on [0, 5], need to map to [0,255]
		const convFactor: number = 255 / 5;
		blue = Math.round(blue * convFactor);
		green = Math.round(green * convFactor);
		red = Math.round(red * convFactor);

		return new RGBA(red, green, blue);
	} else if (colorNumber >= 232 && colorNumber <= 255) {
		// Converts to a grayscale value
		colorNumber -= 232;
		const colorLevel: number = Math.round(colorNumber / 23 * 255);
		return new RGBA(colorLevel, colorLevel, colorLevel);
	} else {
		return;
	}
}

registerThemingParticipant((theme, collector) => {
	const areas = [
		{ selector: '.monaco-workbench .sidebar, .monaco-workbench .auxiliarybar', bg: theme.getColor(SIDE_BAR_BACKGROUND) },
		{ selector: '.monaco-workbench .panel', bg: theme.getColor(PANEL_BACKGROUND) },
		{ selector: '.monaco-workbench .monaco-list-row.selected', bg: theme.getColor(listInactiveSelectionBackground) },
		{ selector: '.monaco-workbench .monaco-list-row.focused', bg: theme.getColor(listInactiveFocusBackground) },
		{ selector: '.monaco-workbench .monaco-list:focus .monaco-list-row.focused', bg: theme.getColor(listFocusBackground) },
		{ selector: '.monaco-workbench .monaco-list:focus .monaco-list-row.selected', bg: theme.getColor(listActiveSelectionBackground) },
		{ selector: '.debug-hover-widget', bg: theme.getColor(editorHoverBackground) },
	];

	for (const { selector, bg } of areas) {
		const content = ansiColorIdentifiers
			.map(color => {
				const actual = theme.getColor(color);
				if (!actual) { return undefined; }
				// this uses the default contrast ratio of 4 (from the terminal),
				// we may want to make this configurable in the future, but this is
				// good to keep things sane to start with.
				return `--vscode-debug-ansi-${color.replaceAll('.', '-')}:${bg ? bg.ensureConstrast(actual, 4) : actual}`;
			})
			.filter(isDefined);

		collector.addRule(`${selector} { ${content.join(';')} }`);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugChatIntegration.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugChatIntegration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { autorun, debouncedObservable, derived, IObservable, ISettableObservable, ObservablePromise, observableValue } from '../../../../base/common/observable.js';
import { basename } from '../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Range } from '../../../../editor/common/core/range.js';
import { localize } from '../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IChatWidget, IChatWidgetService } from '../../chat/browser/chat.js';
import { ChatContextPick, IChatContextPicker, IChatContextPickerItem, IChatContextPickService } from '../../chat/browser/chatContextPickService.js';
import { ChatContextKeys } from '../../chat/common/chatContextKeys.js';
import { IChatRequestFileEntry, IChatRequestVariableEntry, IDebugVariableEntry } from '../../chat/common/chatVariableEntries.js';
import { IDebugService, IExpression, IScope, IStackFrame, State } from '../common/debug.js';
import { Variable } from '../common/debugModel.js';

const enum PickerMode {
	Main = 'main',
	Expression = 'expression',
}

class DebugSessionContextPick implements IChatContextPickerItem {
	readonly type = 'pickerPick';
	readonly label = localize('chatContext.debugSession', 'Debug Session...');
	readonly icon = Codicon.debug;
	readonly ordinal = -200;

	constructor(
		@IDebugService private readonly debugService: IDebugService,
	) { }

	isEnabled(): boolean {
		// Only enabled when there's a focused session that is stopped (paused)
		const viewModel = this.debugService.getViewModel();
		const focusedSession = viewModel.focusedSession;
		return !!focusedSession && focusedSession.state === State.Stopped;
	}

	asPicker(_widget: IChatWidget): IChatContextPicker {
		const store = new DisposableStore();
		const mode: ISettableObservable<PickerMode> = observableValue('debugPicker.mode', PickerMode.Main);
		const query: ISettableObservable<string> = observableValue('debugPicker.query', '');

		const picksObservable = this.createPicksObservable(mode, query, store);

		return {
			placeholder: localize('selectDebugData', 'Select debug data to attach'),
			picks: (_queryObs: IObservable<string>, token: CancellationToken) => {
				// Connect the external query observable to our internal one
				store.add(autorun(reader => {
					query.set(_queryObs.read(reader), undefined);
				}));

				const cts = new CancellationTokenSource(token);
				store.add(toDisposable(() => cts.dispose(true)));

				return picksObservable;
			},
			goBack: () => {
				if (mode.get() === PickerMode.Expression) {
					mode.set(PickerMode.Main, undefined);
					return true; // Stay in picker
				}
				return false; // Go back to main context menu
			},
			dispose: () => store.dispose(),
		};
	}

	private createPicksObservable(
		mode: ISettableObservable<PickerMode>,
		query: IObservable<string>,
		store: DisposableStore
	): IObservable<{ busy: boolean; picks: ChatContextPick[] }> {
		const debouncedQuery = debouncedObservable(query, 300);

		return derived(reader => {
			const currentMode = mode.read(reader);

			if (currentMode === PickerMode.Expression) {
				return this.getExpressionPicks(debouncedQuery, store);
			} else {
				return this.getMainPicks(mode);
			}
		}).flatten();
	}

	private getMainPicks(mode: ISettableObservable<PickerMode>): IObservable<{ busy: boolean; picks: ChatContextPick[] }> {
		// Return an observable that resolves to the main picks
		const promise = derived(_reader => {
			return new ObservablePromise(this.buildMainPicks(mode));
		});

		return promise.map((value, reader) => {
			const result = value.promiseResult.read(reader);
			return { picks: result?.data || [], busy: result === undefined };
		});
	}

	private async buildMainPicks(mode: ISettableObservable<PickerMode>): Promise<ChatContextPick[]> {
		const picks: ChatContextPick[] = [];
		const viewModel = this.debugService.getViewModel();
		const stackFrame = viewModel.focusedStackFrame;
		const session = viewModel.focusedSession;

		if (!session || !stackFrame) {
			return picks;
		}

		// Add "Expression Value..." option at the top
		picks.push({
			label: localize('expressionValue', 'Expression Value...'),
			iconClass: ThemeIcon.asClassName(Codicon.symbolVariable),
			asAttachment: () => {
				// Switch to expression mode
				mode.set(PickerMode.Expression, undefined);
				return 'noop';
			},
		});

		// Add watch expressions section
		const watches = this.debugService.getModel().getWatchExpressions();
		if (watches.length > 0) {
			picks.push({ type: 'separator', label: localize('watchExpressions', 'Watch Expressions') });
			for (const watch of watches) {
				picks.push({
					label: watch.name,
					description: watch.value,
					iconClass: ThemeIcon.asClassName(Codicon.eye),
					asAttachment: (): IChatRequestVariableEntry[] => createDebugAttachments(stackFrame, createDebugVariableEntry(watch)),
				});
			}
		}

		// Add scopes and their variables
		let scopes: IScope[] = [];
		try {
			scopes = await stackFrame.getScopes();
		} catch {
			// Ignore errors when fetching scopes
		}

		for (const scope of scopes) {
			// Include variables from non-expensive scopes
			if (scope.expensive && !scope.childrenHaveBeenLoaded) {
				continue;
			}

			picks.push({ type: 'separator', label: scope.name });
			try {
				const variables = await scope.getChildren();
				if (variables.length > 1) {
					picks.push({
						label: localize('allVariablesInScope', 'All variables in {0}', scope.name),
						iconClass: ThemeIcon.asClassName(Codicon.symbolNamespace),
						asAttachment: (): IChatRequestVariableEntry[] => createDebugAttachments(stackFrame, createScopeEntry(scope, variables)),
					});
				}
				for (const variable of variables) {
					picks.push({
						label: variable.name,
						description: formatVariableDescription(variable),
						iconClass: ThemeIcon.asClassName(Codicon.symbolVariable),
						asAttachment: (): IChatRequestVariableEntry[] => createDebugAttachments(stackFrame, createDebugVariableEntry(variable)),
					});
				}
			} catch {
				// Ignore errors when fetching variables
			}
		}

		return picks;
	}

	private getExpressionPicks(
		query: IObservable<string>,
		_store: DisposableStore
	): IObservable<{ busy: boolean; picks: ChatContextPick[] }> {
		const promise = derived((reader) => {
			const queryValue = query.read(reader);
			const cts = new CancellationTokenSource();
			reader.store.add(toDisposable(() => cts.dispose(true)));
			return new ObservablePromise(this.evaluateExpression(queryValue, cts.token));
		});

		return promise.map((value, r) => {
			const result = value.promiseResult.read(r);
			return { picks: result?.data || [], busy: result === undefined };
		});
	}

	private async evaluateExpression(expression: string, token: CancellationToken): Promise<ChatContextPick[]> {
		if (!expression.trim()) {
			return [{
				label: localize('typeExpression', 'Type an expression to evaluate...'),
				disabled: true,
				asAttachment: () => 'noop',
			}];
		}

		const viewModel = this.debugService.getViewModel();
		const session = viewModel.focusedSession;
		const stackFrame = viewModel.focusedStackFrame;

		if (!session || !stackFrame) {
			return [{
				label: localize('noDebugSession', 'No active debug session'),
				disabled: true,
				asAttachment: () => 'noop',
			}];
		}

		try {
			const response = await session.evaluate(expression, stackFrame.frameId, 'watch');

			if (token.isCancellationRequested) {
				return [];
			}

			if (response?.body) {
				const resultValue = response.body.result;
				const resultType = response.body.type;
				return [{
					label: expression,
					description: formatExpressionResult(resultValue, resultType),
					iconClass: ThemeIcon.asClassName(Codicon.symbolVariable),
					asAttachment: (): IChatRequestVariableEntry[] => createDebugAttachments(stackFrame, {
						kind: 'debugVariable',
						id: `debug-expression:${expression}`,
						name: expression,
						fullName: expression,
						icon: Codicon.debug,
						value: resultValue,
						expression: expression,
						type: resultType,
						modelDescription: formatModelDescription(expression, resultValue, resultType),
					}),
				}];
			} else {
				return [{
					label: expression,
					description: localize('noResult', 'No result'),
					disabled: true,
					asAttachment: () => 'noop',
				}];
			}
		} catch (err) {
			return [{
				label: expression,
				description: err instanceof Error ? err.message : localize('evaluationError', 'Evaluation error'),
				disabled: true,
				asAttachment: () => 'noop',
			}];
		}
	}
}

function createDebugVariableEntry(expression: IExpression): IDebugVariableEntry {
	return {
		kind: 'debugVariable',
		id: `debug-variable:${expression.getId()}`,
		name: expression.name,
		fullName: expression.name,
		icon: Codicon.debug,
		value: expression.value,
		expression: expression.name,
		type: expression.type,
		modelDescription: formatModelDescription(expression.name, expression.value, expression.type),
	};
}

function createPausedLocationEntry(stackFrame: IStackFrame): IChatRequestFileEntry {
	const uri = stackFrame.source.uri;
	let range = Range.lift(stackFrame.range);
	if (range.isEmpty()) {
		range = range.setEndPosition(range.startLineNumber + 1, 1);
	}

	return {
		kind: 'file',
		value: { uri, range },
		id: `debug-paused-location:${uri.toString()}:${range.startLineNumber}`,
		name: basename(uri),
		modelDescription: 'The debugger is currently paused at this location',
	};
}

function createDebugAttachments(stackFrame: IStackFrame, variableEntry: IDebugVariableEntry): IChatRequestVariableEntry[] {
	return [
		createPausedLocationEntry(stackFrame),
		variableEntry,
	];
}

function createScopeEntry(scope: IScope, variables: IExpression[]): IDebugVariableEntry {
	const variablesSummary = variables.map(v => `${v.name}: ${v.value}`).join('\n');
	return {
		kind: 'debugVariable',
		id: `debug-scope:${scope.name}`,
		name: `Scope: ${scope.name}`,
		fullName: `Scope: ${scope.name}`,
		icon: Codicon.debug,
		value: variablesSummary,
		expression: scope.name,
		type: 'scope',
		modelDescription: `Debug scope "${scope.name}" with ${variables.length} variables:\n${variablesSummary}`,
	};
}

function formatVariableDescription(expression: IExpression): string {
	const value = expression.value;
	const type = expression.type;
	if (type && value) {
		return `${type}: ${value}`;
	}
	return value || type || '';
}

function formatExpressionResult(value: string, type?: string): string {
	if (type && value) {
		return `${type}: ${value}`;
	}
	return value || type || '';
}

function formatModelDescription(name: string, value: string, type?: string): string {
	let description = `Debug variable "${name}"`;
	if (type) {
		description += ` of type ${type}`;
	}
	description += ` with value: ${value}`;
	return description;
}

export class DebugChatContextContribution extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.chat.debugChatContextContribution';

	constructor(
		@IChatContextPickService contextPickService: IChatContextPickService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();
		this._register(contextPickService.registerChatContextItem(instantiationService.createInstance(DebugSessionContextPick)));
	}
}

// Context menu action: Add variable to chat
registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.debug.action.addVariableToChat',
			title: localize('addToChat', 'Add to Chat'),
			f1: false,
			menu: {
				id: MenuId.DebugVariablesContext,
				group: 'z_commands',
				order: 110,
				when: ChatContextKeys.enabled
			}
		});
	}

	override async run(accessor: ServicesAccessor, context: unknown): Promise<void> {
		const chatWidgetService = accessor.get(IChatWidgetService);
		const debugService = accessor.get(IDebugService);
		const widget = await chatWidgetService.revealWidget();
		if (!widget) {
			return;
		}

		// Context is the variable from the variables view
		const entry = createDebugVariableEntryFromContext(context);
		if (entry) {
			const stackFrame = debugService.getViewModel().focusedStackFrame;
			if (stackFrame) {
				widget.attachmentModel.addContext(createPausedLocationEntry(stackFrame));
			}
			widget.attachmentModel.addContext(entry);
		}
	}
});

// Context menu action: Add watch expression to chat
registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.debug.action.addWatchExpressionToChat',
			title: localize('addToChat', 'Add to Chat'),
			f1: false,
			menu: {
				id: MenuId.DebugWatchContext,
				group: 'z_commands',
				order: 110,
				when: ChatContextKeys.enabled
			}
		});
	}

	override async run(accessor: ServicesAccessor, context: IExpression): Promise<void> {
		const chatWidgetService = accessor.get(IChatWidgetService);
		const debugService = accessor.get(IDebugService);
		const widget = await chatWidgetService.revealWidget();
		if (!context || !widget) {
			return;
		}

		// Context is the expression (watch expression or variable under it)
		const stackFrame = debugService.getViewModel().focusedStackFrame;
		if (stackFrame) {
			widget.attachmentModel.addContext(createPausedLocationEntry(stackFrame));
		}
		widget.attachmentModel.addContext(createDebugVariableEntry(context));
	}
});

// Context menu action: Add scope to chat
registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.debug.action.addScopeToChat',
			title: localize('addToChat', 'Add to Chat'),
			f1: false,
			menu: {
				id: MenuId.DebugScopesContext,
				group: 'z_commands',
				order: 1,
				when: ChatContextKeys.enabled
			}
		});
	}

	override async run(accessor: ServicesAccessor, context: IScopesContext): Promise<void> {
		const chatWidgetService = accessor.get(IChatWidgetService);
		const debugService = accessor.get(IDebugService);
		const widget = await chatWidgetService.revealWidget();
		if (!context || !widget) {
			return;
		}

		// Get the actual scope and its variables
		const viewModel = debugService.getViewModel();
		const stackFrame = viewModel.focusedStackFrame;
		if (!stackFrame) {
			return;
		}

		try {
			const scopes = await stackFrame.getScopes();
			const scope = scopes.find(s => s.name === context.scope.name);
			if (scope) {
				const variables = await scope.getChildren();
				widget.attachmentModel.addContext(createPausedLocationEntry(stackFrame));
				widget.attachmentModel.addContext(createScopeEntry(scope, variables));
			}
		} catch {
			// Ignore errors
		}
	}
});

interface IScopesContext {
	scope: { name: string };
}

interface IVariablesContext {
	sessionId: string | undefined;
	variable: { name: string; value: string; type?: string; evaluateName?: string };
}

function isVariablesContext(context: unknown): context is IVariablesContext {
	return typeof context === 'object' && context !== null && 'variable' in context && 'sessionId' in context;
}

function createDebugVariableEntryFromContext(context: unknown): IDebugVariableEntry | undefined {
	// The context can be either a Variable directly, or an IVariablesContext object
	if (context instanceof Variable) {
		return createDebugVariableEntry(context);
	}

	// Handle IVariablesContext format from the variables view
	if (isVariablesContext(context)) {
		const variable = context.variable;
		return {
			kind: 'debugVariable',
			id: `debug-variable:${variable.name}`,
			name: variable.name,
			fullName: variable.evaluateName ?? variable.name,
			icon: Codicon.debug,
			value: variable.value,
			expression: variable.evaluateName ?? variable.name,
			type: variable.type,
			modelDescription: formatModelDescription(variable.evaluateName || variable.name, variable.value, variable.type),
		};
	}

	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugColors.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugColors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerColor, foreground, editorInfoForeground, editorWarningForeground, errorForeground, badgeBackground, badgeForeground, listDeemphasizedForeground, contrastBorder, inputBorder, toolbarHoverBackground } from '../../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Color } from '../../../../base/common/color.js';
import { localize } from '../../../../nls.js';
import * as icons from './debugIcons.js';
import { isHighContrast } from '../../../../platform/theme/common/theme.js';

export const debugToolBarBackground = registerColor('debugToolBar.background', {
	dark: '#333333',
	light: '#F3F3F3',
	hcDark: '#000000',
	hcLight: '#FFFFFF'
}, localize('debugToolBarBackground', "Debug toolbar background color."));

export const debugToolBarBorder = registerColor('debugToolBar.border', null, localize('debugToolBarBorder', "Debug toolbar border color."));

export const debugIconStartForeground = registerColor('debugIcon.startForeground', {
	dark: '#89D185',
	light: '#388A34',
	hcDark: '#89D185',
	hcLight: '#388A34'
}, localize('debugIcon.startForeground', "Debug toolbar icon for start debugging."));

export function registerColors() {

	const debugTokenExpressionName = registerColor('debugTokenExpression.name', { dark: '#c586c0', light: '#9b46b0', hcDark: foreground, hcLight: foreground }, 'Foreground color for the token names shown in the debug views (ie. the Variables or Watch view).');
	const debugTokenExpressionType = registerColor('debugTokenExpression.type', { dark: '#4A90E2', light: '#4A90E2', hcDark: foreground, hcLight: foreground }, 'Foreground color for the token types shown in the debug views (ie. the Variables or Watch view).');
	const debugTokenExpressionValue = registerColor('debugTokenExpression.value', { dark: '#cccccc99', light: '#6c6c6ccc', hcDark: foreground, hcLight: foreground }, 'Foreground color for the token values shown in the debug views (ie. the Variables or Watch view).');
	const debugTokenExpressionString = registerColor('debugTokenExpression.string', { dark: '#ce9178', light: '#a31515', hcDark: '#f48771', hcLight: '#a31515' }, 'Foreground color for strings in the debug views (ie. the Variables or Watch view).');
	const debugTokenExpressionBoolean = registerColor('debugTokenExpression.boolean', { dark: '#4e94ce', light: '#0000ff', hcDark: '#75bdfe', hcLight: '#0000ff' }, 'Foreground color for booleans in the debug views (ie. the Variables or Watch view).');
	const debugTokenExpressionNumber = registerColor('debugTokenExpression.number', { dark: '#b5cea8', light: '#098658', hcDark: '#89d185', hcLight: '#098658' }, 'Foreground color for numbers in the debug views (ie. the Variables or Watch view).');
	const debugTokenExpressionError = registerColor('debugTokenExpression.error', { dark: '#f48771', light: '#e51400', hcDark: '#f48771', hcLight: '#e51400' }, 'Foreground color for expression errors in the debug views (ie. the Variables or Watch view) and for error logs shown in the debug console.');

	const debugViewExceptionLabelForeground = registerColor('debugView.exceptionLabelForeground', { dark: foreground, light: '#FFF', hcDark: foreground, hcLight: foreground }, 'Foreground color for a label shown in the CALL STACK view when the debugger breaks on an exception.');
	const debugViewExceptionLabelBackground = registerColor('debugView.exceptionLabelBackground', { dark: '#6C2022', light: '#A31515', hcDark: '#6C2022', hcLight: '#A31515' }, 'Background color for a label shown in the CALL STACK view when the debugger breaks on an exception.');
	const debugViewStateLabelForeground = registerColor('debugView.stateLabelForeground', foreground, 'Foreground color for a label in the CALL STACK view showing the current session\'s or thread\'s state.');
	const debugViewStateLabelBackground = registerColor('debugView.stateLabelBackground', '#88888844', 'Background color for a label in the CALL STACK view showing the current session\'s or thread\'s state.');
	const debugViewValueChangedHighlight = registerColor('debugView.valueChangedHighlight', '#569CD6', 'Color used to highlight value changes in the debug views (ie. in the Variables view).');

	const debugConsoleInfoForeground = registerColor('debugConsole.infoForeground', { dark: editorInfoForeground, light: editorInfoForeground, hcDark: foreground, hcLight: foreground }, 'Foreground color for info messages in debug REPL console.');
	const debugConsoleWarningForeground = registerColor('debugConsole.warningForeground', { dark: editorWarningForeground, light: editorWarningForeground, hcDark: '#008000', hcLight: editorWarningForeground }, 'Foreground color for warning messages in debug REPL console.');
	const debugConsoleErrorForeground = registerColor('debugConsole.errorForeground', errorForeground, 'Foreground color for error messages in debug REPL console.');
	const debugConsoleSourceForeground = registerColor('debugConsole.sourceForeground', foreground, 'Foreground color for source filenames in debug REPL console.');
	const debugConsoleInputIconForeground = registerColor('debugConsoleInputIcon.foreground', foreground, 'Foreground color for debug console input marker icon.');

	const debugIconPauseForeground = registerColor('debugIcon.pauseForeground', {
		dark: '#75BEFF',
		light: '#007ACC',
		hcDark: '#75BEFF',
		hcLight: '#007ACC'
	}, localize('debugIcon.pauseForeground', "Debug toolbar icon for pause."));

	const debugIconStopForeground = registerColor('debugIcon.stopForeground', {
		dark: '#F48771',
		light: '#A1260D',
		hcDark: '#F48771',
		hcLight: '#A1260D'
	}, localize('debugIcon.stopForeground', "Debug toolbar icon for stop."));

	const debugIconDisconnectForeground = registerColor('debugIcon.disconnectForeground', {
		dark: '#F48771',
		light: '#A1260D',
		hcDark: '#F48771',
		hcLight: '#A1260D'
	}, localize('debugIcon.disconnectForeground', "Debug toolbar icon for disconnect."));

	const debugIconRestartForeground = registerColor('debugIcon.restartForeground', {
		dark: '#89D185',
		light: '#388A34',
		hcDark: '#89D185',
		hcLight: '#388A34'
	}, localize('debugIcon.restartForeground', "Debug toolbar icon for restart."));

	const debugIconStepOverForeground = registerColor('debugIcon.stepOverForeground', {
		dark: '#75BEFF',
		light: '#007ACC',
		hcDark: '#75BEFF',
		hcLight: '#007ACC'
	}, localize('debugIcon.stepOverForeground', "Debug toolbar icon for step over."));

	const debugIconStepIntoForeground = registerColor('debugIcon.stepIntoForeground', {
		dark: '#75BEFF',
		light: '#007ACC',
		hcDark: '#75BEFF',
		hcLight: '#007ACC'
	}, localize('debugIcon.stepIntoForeground', "Debug toolbar icon for step into."));

	const debugIconStepOutForeground = registerColor('debugIcon.stepOutForeground', {
		dark: '#75BEFF',
		light: '#007ACC',
		hcDark: '#75BEFF',
		hcLight: '#007ACC'
	}, localize('debugIcon.stepOutForeground', "Debug toolbar icon for step over."));

	const debugIconContinueForeground = registerColor('debugIcon.continueForeground', {
		dark: '#75BEFF',
		light: '#007ACC',
		hcDark: '#75BEFF',
		hcLight: '#007ACC'
	}, localize('debugIcon.continueForeground', "Debug toolbar icon for continue."));

	const debugIconStepBackForeground = registerColor('debugIcon.stepBackForeground', {
		dark: '#75BEFF',
		light: '#007ACC',
		hcDark: '#75BEFF',
		hcLight: '#007ACC'
	}, localize('debugIcon.stepBackForeground', "Debug toolbar icon for step back."));

	registerThemingParticipant((theme, collector) => {
		// All these colours provide a default value so they will never be undefined, hence the `!`
		const badgeBackgroundColor = theme.getColor(badgeBackground)!;
		const badgeForegroundColor = theme.getColor(badgeForeground)!;
		const listDeemphasizedForegroundColor = theme.getColor(listDeemphasizedForeground)!;
		const debugViewExceptionLabelForegroundColor = theme.getColor(debugViewExceptionLabelForeground)!;
		const debugViewExceptionLabelBackgroundColor = theme.getColor(debugViewExceptionLabelBackground)!;
		const debugViewStateLabelForegroundColor = theme.getColor(debugViewStateLabelForeground)!;
		const debugViewStateLabelBackgroundColor = theme.getColor(debugViewStateLabelBackground)!;
		const debugViewValueChangedHighlightColor = theme.getColor(debugViewValueChangedHighlight)!;
		const toolbarHoverBackgroundColor = theme.getColor(toolbarHoverBackground);

		collector.addRule(`
			/* Text colour of the call stack row's filename */
			.debug-pane .debug-call-stack .monaco-list-row:not(.selected) .stack-frame > .file .file-name {
				color: ${listDeemphasizedForegroundColor}
			}

			/* Line & column number "badge" for selected call stack row */
			.debug-pane .monaco-list-row.selected .line-number {
				background-color: ${badgeBackgroundColor};
				color: ${badgeForegroundColor};
			}

			/* Line & column number "badge" for unselected call stack row (basically all other rows) */
			.debug-pane .line-number {
				background-color: ${badgeBackgroundColor.transparent(0.6)};
				color: ${badgeForegroundColor.transparent(0.6)};
			}

			/* State "badge" displaying the active session's current state.
			* Only visible when there are more active debug sessions/threads running.
			*/
			.debug-pane .debug-call-stack .thread > .state.label,
			.debug-pane .debug-call-stack .session > .state.label {
				background-color: ${debugViewStateLabelBackgroundColor};
				color: ${debugViewStateLabelForegroundColor};
			}

			/* State "badge" displaying the active session's current state.
			* Only visible when there are more active debug sessions/threads running
			* and thread paused due to a thrown exception.
			*/
			.debug-pane .debug-call-stack .thread > .state.label.exception,
			.debug-pane .debug-call-stack .session > .state.label.exception {
				background-color: ${debugViewExceptionLabelBackgroundColor};
				color: ${debugViewExceptionLabelForegroundColor};
			}

			/* Info "badge" shown when the debugger pauses due to a thrown exception. */
			.debug-pane .call-stack-state-message > .label.exception {
				background-color: ${debugViewExceptionLabelBackgroundColor};
				color: ${debugViewExceptionLabelForegroundColor};
			}

			/* Animation of changed values in Debug viewlet */
			@keyframes debugViewletValueChanged {
				0%   { background-color: ${debugViewValueChangedHighlightColor.transparent(0)} }
				5%   { background-color: ${debugViewValueChangedHighlightColor.transparent(0.9)} }
				100% { background-color: ${debugViewValueChangedHighlightColor.transparent(0.3)} }
			}

			.debug-pane .monaco-list-row .expression .value.changed {
				background-color: ${debugViewValueChangedHighlightColor.transparent(0.3)};
				animation-name: debugViewletValueChanged;
				animation-duration: 1s;
				animation-fill-mode: forwards;
			}

			.monaco-list-row .expression .lazy-button:hover {
				background-color: ${toolbarHoverBackgroundColor}
			}
		`);

		const contrastBorderColor = theme.getColor(contrastBorder);

		if (contrastBorderColor) {
			collector.addRule(`
			.debug-pane .line-number {
				border: 1px solid ${contrastBorderColor};
			}
			`);
		}

		// Use fully-opaque colors for line-number badges
		if (isHighContrast(theme.type)) {
			collector.addRule(`
			.debug-pane .line-number {
				background-color: ${badgeBackgroundColor};
				color: ${badgeForegroundColor};
			}`);
		}

		const tokenNameColor = theme.getColor(debugTokenExpressionName)!;
		const tokenTypeColor = theme.getColor(debugTokenExpressionType)!;
		const tokenValueColor = theme.getColor(debugTokenExpressionValue)!;
		const tokenStringColor = theme.getColor(debugTokenExpressionString)!;
		const tokenBooleanColor = theme.getColor(debugTokenExpressionBoolean)!;
		const tokenErrorColor = theme.getColor(debugTokenExpressionError)!;
		const tokenNumberColor = theme.getColor(debugTokenExpressionNumber)!;

		collector.addRule(`
			.monaco-workbench .monaco-list-row .expression .name {
				color: ${tokenNameColor};
			}

			.monaco-workbench .monaco-list-row .expression .type {
				color: ${tokenTypeColor};
			}

			.monaco-workbench .monaco-list-row .expression .value,
			.monaco-workbench .debug-hover-widget .value {
				color: ${tokenValueColor};
			}

			.monaco-workbench .monaco-list-row .expression .value.string,
			.monaco-workbench .debug-hover-widget .value.string {
				color: ${tokenStringColor};
			}

			.monaco-workbench .monaco-list-row .expression .value.boolean,
			.monaco-workbench .debug-hover-widget .value.boolean {
				color: ${tokenBooleanColor};
			}

			.monaco-workbench .monaco-list-row .expression .error,
			.monaco-workbench .debug-hover-widget .error,
			.monaco-workbench .debug-pane .debug-variables .scope .error {
				color: ${tokenErrorColor};
			}

			.monaco-workbench .monaco-list-row .expression .value.number,
			.monaco-workbench .debug-hover-widget .value.number {
				color: ${tokenNumberColor};
			}
		`);

		const debugConsoleInputBorderColor = theme.getColor(inputBorder) || Color.fromHex('#80808060');
		const debugConsoleInfoForegroundColor = theme.getColor(debugConsoleInfoForeground)!;
		const debugConsoleWarningForegroundColor = theme.getColor(debugConsoleWarningForeground)!;
		const debugConsoleErrorForegroundColor = theme.getColor(debugConsoleErrorForeground)!;
		const debugConsoleSourceForegroundColor = theme.getColor(debugConsoleSourceForeground)!;
		const debugConsoleInputIconForegroundColor = theme.getColor(debugConsoleInputIconForeground)!;

		collector.addRule(`
			.repl .repl-input-wrapper {
				border-top: 1px solid ${debugConsoleInputBorderColor};
			}

			.monaco-workbench .repl .repl-tree .output .expression .value.info {
				color: ${debugConsoleInfoForegroundColor};
			}

			.monaco-workbench .repl .repl-tree .output .expression .value.warn {
				color: ${debugConsoleWarningForegroundColor};
			}

			.monaco-workbench .repl .repl-tree .output .expression .value.error {
				color: ${debugConsoleErrorForegroundColor};
			}

			.monaco-workbench .repl .repl-tree .output .expression .source {
				color: ${debugConsoleSourceForegroundColor};
			}

			.monaco-workbench .repl .repl-tree .monaco-tl-contents .arrow {
				color: ${debugConsoleInputIconForegroundColor};
			}
		`);

		if (!theme.defines(debugConsoleInputIconForeground)) {
			collector.addRule(`
				.monaco-workbench.vs .repl .repl-tree .monaco-tl-contents .arrow {
					opacity: 0.25;
				}

				.monaco-workbench.vs-dark .repl .repl-tree .monaco-tl-contents .arrow {
					opacity: 0.4;
				}

				.monaco-workbench.hc-black .repl .repl-tree .monaco-tl-contents .arrow,
				.monaco-workbench.hc-light .repl .repl-tree .monaco-tl-contents .arrow {
					opacity: 1;
				}
			`);
		}

		const debugIconStartColor = theme.getColor(debugIconStartForeground);
		if (debugIconStartColor) {
			collector.addRule(`.monaco-workbench ${ThemeIcon.asCSSSelector(icons.debugStart)} { color: ${debugIconStartColor}; }`);
		}

		const debugIconPauseColor = theme.getColor(debugIconPauseForeground);
		if (debugIconPauseColor) {
			collector.addRule(`.monaco-workbench .part > .title > .title-actions .action-label${ThemeIcon.asCSSSelector(icons.debugPause)}, .monaco-workbench ${ThemeIcon.asCSSSelector(icons.debugPause)} { color: ${debugIconPauseColor}; }`);
		}

		const debugIconStopColor = theme.getColor(debugIconStopForeground);
		if (debugIconStopColor) {
			collector.addRule(`.monaco-workbench .part > .title > .title-actions .action-label${ThemeIcon.asCSSSelector(icons.debugStop)},.monaco-workbench ${ThemeIcon.asCSSSelector(icons.debugStop)} { color: ${debugIconStopColor}; }`);
		}

		const debugIconDisconnectColor = theme.getColor(debugIconDisconnectForeground);
		if (debugIconDisconnectColor) {
			collector.addRule(`.monaco-workbench .part > .title > .title-actions .action-label${ThemeIcon.asCSSSelector(icons.debugDisconnect)},.monaco-workbench .debug-view-content ${ThemeIcon.asCSSSelector(icons.debugDisconnect)}, .monaco-workbench .debug-toolbar ${ThemeIcon.asCSSSelector(icons.debugDisconnect)}, .monaco-workbench .command-center-center ${ThemeIcon.asCSSSelector(icons.debugDisconnect)} { color: ${debugIconDisconnectColor}; }`);
		}

		const debugIconRestartColor = theme.getColor(debugIconRestartForeground);
		if (debugIconRestartColor) {
			collector.addRule(`.monaco-workbench ${ThemeIcon.asCSSSelector(icons.debugRestart)}, .monaco-workbench ${ThemeIcon.asCSSSelector(icons.debugRestartFrame)}, .monaco-workbench .part > .title > .title-actions .action-label${ThemeIcon.asCSSSelector(icons.debugRestart)}, .monaco-workbench .part > .title > .title-actions .action-label${ThemeIcon.asCSSSelector(icons.debugRestartFrame)} { color: ${debugIconRestartColor}; }`);
		}

		const debugIconStepOverColor = theme.getColor(debugIconStepOverForeground);
		if (debugIconStepOverColor) {
			collector.addRule(`.monaco-workbench .part > .title > .title-actions .action-label${ThemeIcon.asCSSSelector(icons.debugStepOver)}, .monaco-workbench ${ThemeIcon.asCSSSelector(icons.debugStepOver)} { color: ${debugIconStepOverColor}; }`);
		}

		const debugIconStepIntoColor = theme.getColor(debugIconStepIntoForeground);
		if (debugIconStepIntoColor) {
			collector.addRule(`.monaco-workbench .part > .title > .title-actions .action-label${ThemeIcon.asCSSSelector(icons.debugStepInto)}, .monaco-workbench .part > .title > .title-actions .action-label${ThemeIcon.asCSSSelector(icons.debugStepInto)}, .monaco-workbench ${ThemeIcon.asCSSSelector(icons.debugStepInto)} { color: ${debugIconStepIntoColor}; }`);
		}

		const debugIconStepOutColor = theme.getColor(debugIconStepOutForeground);
		if (debugIconStepOutColor) {
			collector.addRule(`.monaco-workbench .part > .title > .title-actions .action-label${ThemeIcon.asCSSSelector(icons.debugStepOut)}, .monaco-workbench .part > .title > .title-actions .action-label${ThemeIcon.asCSSSelector(icons.debugStepOut)}, .monaco-workbench ${ThemeIcon.asCSSSelector(icons.debugStepOut)} { color: ${debugIconStepOutColor}; }`);
		}

		const debugIconContinueColor = theme.getColor(debugIconContinueForeground);
		if (debugIconContinueColor) {
			collector.addRule(`.monaco-workbench .part > .title > .title-actions .action-label${ThemeIcon.asCSSSelector(icons.debugContinue)}, .monaco-workbench ${ThemeIcon.asCSSSelector(icons.debugContinue)}, .monaco-workbench .part > .title > .title-actions .action-label${ThemeIcon.asCSSSelector(icons.debugReverseContinue)}, .monaco-workbench ${ThemeIcon.asCSSSelector(icons.debugReverseContinue)} { color: ${debugIconContinueColor}; }`);
		}

		const debugIconStepBackColor = theme.getColor(debugIconStepBackForeground);
		if (debugIconStepBackColor) {
			collector.addRule(`.monaco-workbench .part > .title > .title-actions .action-label${ThemeIcon.asCSSSelector(icons.debugStepBack)}, .monaco-workbench ${ThemeIcon.asCSSSelector(icons.debugStepBack)} { color: ${debugIconStepBackColor}; }`);
		}
	});
}
```

--------------------------------------------------------------------------------

````
