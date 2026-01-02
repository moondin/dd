---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 476
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 476 of 552)

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

---[FILE: src/vs/workbench/contrib/testing/browser/testResultsView/testResultsOutput.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/testResultsView/testResultsOutput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { Delayer } from '../../../../../base/common/async.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { Event } from '../../../../../base/common/event.js';
import { Iterable } from '../../../../../base/common/iterator.js';
import { Disposable, DisposableStore, IDisposable, IReference, MutableDisposable, combinedDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { ScrollEvent } from '../../../../../base/common/scrollable.js';
import { URI } from '../../../../../base/common/uri.js';
import { ICodeEditor, IDiffEditorConstructionOptions } from '../../../../../editor/browser/editorBrowser.js';
import { CodeEditorWidget } from '../../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { EmbeddedCodeEditorWidget } from '../../../../../editor/browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { DiffEditorWidget } from '../../../../../editor/browser/widget/diffEditor/diffEditorWidget.js';
import { EmbeddedDiffEditorWidget } from '../../../../../editor/browser/widget/diffEditor/embeddedDiffEditorWidget.js';
import { IMarkdownRendererService } from '../../../../../platform/markdown/browser/markdownRenderer.js';
import { IDiffEditorOptions, IEditorOptions } from '../../../../../editor/common/config/editorOptions.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { peekViewResultsBackground } from '../../../../../editor/contrib/peekView/browser/peekView.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { TerminalCapabilityStore } from '../../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';
import { formatMessageForTerminal } from '../../../../../platform/terminal/common/terminalStrings.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { IEditorConfiguration } from '../../../../browser/parts/editor/textEditor.js';
import { EditorModel } from '../../../../common/editor/editorModel.js';
import { PANEL_BACKGROUND, SIDE_BAR_BACKGROUND } from '../../../../common/theme.js';
import { IViewDescriptorService, ViewContainerLocation } from '../../../../common/views.js';
import { CALL_STACK_WIDGET_HEADER_HEIGHT } from '../../../debug/browser/callStackWidget.js';
import { DetachedProcessInfo } from '../../../terminal/browser/detachedTerminal.js';
import { IDetachedTerminalInstance, ITerminalService } from '../../../terminal/browser/terminal.js';
import { getXtermScaledDimensions } from '../../../terminal/browser/xterm/xtermTerminal.js';
import { TERMINAL_BACKGROUND_COLOR } from '../../../terminal/common/terminalColorRegistry.js';
import { Testing } from '../../common/constants.js';
import { MutableObservableValue } from '../../common/observableValue.js';
import { ITaskRawOutput, ITestResult, ITestRunTaskResults, LiveTestResult, TestResultItemChangeReason } from '../../common/testResult.js';
import { ITestMessage, TestMessageType, getMarkId } from '../../common/testTypes.js';
import { colorizeTestMessageInEditor } from '../testMessageColorizer.js';
import { InspectSubject, MessageSubject, TaskSubject, TestOutputSubject } from './testResultsSubject.js';


class SimpleDiffEditorModel extends EditorModel {
	public readonly original: ITextModel;
	public readonly modified: ITextModel;

	constructor(
		private readonly _original: IReference<IResolvedTextEditorModel>,
		private readonly _modified: IReference<IResolvedTextEditorModel>,
	) {
		super();
		this.original = this._original.object.textEditorModel;
		this.modified = this._modified.object.textEditorModel;
	}

	public override dispose() {
		super.dispose();
		this._original.dispose();
		this._modified.dispose();
	}
}


export interface IPeekOutputRenderer extends IDisposable {
	readonly onDidContentSizeChange?: Event<void>;
	onScrolled?(evt: ScrollEvent): void;
	/** Updates the displayed test. Should clear if it cannot display the test. */
	update(subject: InspectSubject): Promise<boolean>;
	/** Recalculate content layout. Returns the height it should be rendered at. */
	layout(dimension: dom.IDimension, hasMultipleFrames: boolean): number | undefined;
	/** Dispose the content provider. */
	dispose(): void;
}

const commonEditorOptions: IEditorOptions = {
	scrollBeyondLastLine: false,
	links: true,
	lineNumbers: 'off',
	glyphMargin: false,
	scrollbar: {
		vertical: 'hidden',
		horizontal: 'auto',
		useShadows: false,
		verticalHasArrows: false,
		horizontalHasArrows: false,
		handleMouseWheel: false,
	},
	overviewRulerLanes: 0,
	fixedOverflowWidgets: true,
	readOnly: true,
	stickyScroll: { enabled: false },
	minimap: { enabled: false },
	automaticLayout: false,
};

const diffEditorOptions: IDiffEditorConstructionOptions = {
	...commonEditorOptions,
	enableSplitViewResizing: true,
	isInEmbeddedEditor: true,
	renderOverviewRuler: false,
	ignoreTrimWhitespace: false,
	renderSideBySide: true,
	useInlineViewWhenSpaceIsLimited: false,
	originalAriaLabel: localize('testingOutputExpected', 'Expected result'),
	modifiedAriaLabel: localize('testingOutputActual', 'Actual result'),
	diffAlgorithm: 'advanced',
};

function applyEditorMirrorOptions<T extends IEditorOptions>(base: T, cfg: IConfigurationService, update: (options: Partial<IEditorOptions>) => void) {
	const immutable = new Set(Object.keys(base));
	function applyCurrent() {
		const configuration = cfg.getValue<IEditorConfiguration>('editor');

		let changed = false;
		const patch: Partial<IEditorOptions> = {};
		for (const [key, value] of Object.entries(configuration)) {
			if (!immutable.has(key) && (base as Record<string, unknown>)[key] !== value) {
				(patch as Record<string, unknown>)[key] = value;
				changed = true;
			}
		}

		return changed ? patch : undefined;
	}

	Object.assign(base, applyCurrent());

	return cfg.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration('editor')) {
			const patch = applyCurrent();
			if (patch) {
				update(patch);
				Object.assign(base, patch);
			}
		}
	});
}

export class DiffContentProvider extends Disposable implements IPeekOutputRenderer {
	private readonly widget = this._register(new MutableDisposable<DiffEditorWidget>());
	private readonly model = this._register(new MutableDisposable());
	private dimension?: dom.IDimension;
	private helper?: ScrollHelper;

	public get onDidContentSizeChange() {
		return this.widget.value?.onDidContentSizeChange || Event.None;
	}

	constructor(
		private readonly editor: ICodeEditor | undefined,
		private readonly container: HTMLElement,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITextModelService private readonly modelService: ITextModelService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();
	}

	public async update(subject: InspectSubject) {
		if (!(subject instanceof MessageSubject)) {
			this.clear();
			return false;
		}
		const message = subject.message;
		if (!ITestMessage.isDiffable(message)) {
			this.clear();
			return false;
		}

		const [original, modified] = await Promise.all([
			this.modelService.createModelReference(subject.expectedUri),
			this.modelService.createModelReference(subject.actualUri),
		]);

		const model = this.model.value = new SimpleDiffEditorModel(original, modified);
		if (!this.widget.value) {
			const options = { ...diffEditorOptions };
			const listener = applyEditorMirrorOptions(
				options,
				this.configurationService,
				u => editor.updateOptions(u)
			);

			const editor = this.widget.value = this.editor ? this.instantiationService.createInstance(
				EmbeddedDiffEditorWidget,
				this.container,
				options,
				{},
				this.editor,
			) : this.instantiationService.createInstance(
				DiffEditorWidget,
				this.container,
				options,
				{},
			);

			Event.once(editor.onDidDispose)(() => {
				listener.dispose();
			});

			if (this.dimension) {
				editor.layout(this.dimension);
			}
		}

		this.widget.value.setModel(model);
		this.widget.value.updateOptions(this.getOptions(
			isMultiline(message.expected) || isMultiline(message.actual)
		));

		return true;
	}

	private clear() {
		this.model.clear();
		this.widget.clear();
	}

	public layout(dimensions: dom.IDimension, hasMultipleFrames: boolean) {
		this.dimension = dimensions;
		const editor = this.widget.value;
		if (!editor) {
			return;
		}

		editor.layout(dimensions);
		const height = Math.max(
			editor.getOriginalEditor().getContentHeight(),
			editor.getModifiedEditor().getContentHeight()
		);
		editor.updateOptions({ scrollbar: { ...commonEditorOptions.scrollbar, handleMouseWheel: !hasMultipleFrames } });
		this.helper = new ScrollHelper(hasMultipleFrames, height, dimensions.height);
		return height;
	}

	public onScrolled(evt: ScrollEvent): void {
		this.helper?.onScrolled(evt, this.widget.value?.getDomNode(), this.widget.value?.getOriginalEditor());
	}

	protected getOptions(isMultiline: boolean): IDiffEditorOptions {
		return isMultiline
			? { ...diffEditorOptions, lineNumbers: 'on' }
			: { ...diffEditorOptions, lineNumbers: 'off' };
	}
}


export class MarkdownTestMessagePeek extends Disposable implements IPeekOutputRenderer {

	private readonly rendered = this._register(new DisposableStore());

	private element?: HTMLElement;

	constructor(
		private readonly container: HTMLElement,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
	) {
		super();
		this._register(toDisposable(() => this.clear()));
	}

	public async update(subject: InspectSubject) {
		this.clear();
		if (!(subject instanceof MessageSubject)) {
			return false;
		}

		const message = subject.message;
		if (ITestMessage.isDiffable(message) || typeof message.message === 'string') {
			return false;
		}


		const rendered = this.rendered.add(this.markdownRendererService.render(message.message, {}));
		rendered.element.style.userSelect = 'text';
		rendered.element.classList.add('preview-text');
		this.container.appendChild(rendered.element);
		this.element = rendered.element;
		this.rendered.add(toDisposable(() => rendered.element.remove()));

		return true;
	}

	public layout(dimension: dom.IDimension): number | undefined {
		if (!this.element) {
			return undefined;
		}

		this.element.style.width = `${dimension.width - 32}px`;
		return this.element.clientHeight;
	}

	private clear() {
		this.rendered.clear();
		this.element = undefined;
	}
}

class ScrollHelper {
	constructor(
		private readonly hasMultipleFrames: boolean,
		private readonly contentHeight: number,
		private readonly viewHeight: number,
	) { }

	public onScrolled(evt: ScrollEvent, container: HTMLElement | undefined | null, editor: ICodeEditor | undefined) {
		if (!editor || !container) {
			return;
		}

		let delta = Math.max(0, evt.scrollTop - (this.hasMultipleFrames ? CALL_STACK_WIDGET_HEADER_HEIGHT : 0));
		delta = Math.min(Math.max(0, this.contentHeight - this.viewHeight), delta);

		editor.setScrollTop(delta);
		container.style.transform = `translateY(${delta}px)`;
	}
}

export class PlainTextMessagePeek extends Disposable implements IPeekOutputRenderer {
	private readonly widgetDecorations = this._register(new MutableDisposable());
	private readonly widget = this._register(new MutableDisposable<CodeEditorWidget>());
	private readonly model = this._register(new MutableDisposable());
	private dimension?: dom.IDimension;
	private helper?: ScrollHelper;

	public get onDidContentSizeChange() {
		return this.widget.value?.onDidContentSizeChange || Event.None;
	}

	constructor(
		private readonly editor: ICodeEditor | undefined,
		private readonly container: HTMLElement,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITextModelService private readonly modelService: ITextModelService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();
	}

	public async update(subject: InspectSubject): Promise<boolean> {
		if (!(subject instanceof MessageSubject)) {
			this.clear();
			return false;
		}

		const message = subject.message;
		if (ITestMessage.isDiffable(message) || message.type === TestMessageType.Output || typeof message.message !== 'string') {
			this.clear();
			return false;
		}

		const modelRef = this.model.value = await this.modelService.createModelReference(subject.messageUri);
		if (!this.widget.value) {
			const options = { ...commonEditorOptions };
			const listener = applyEditorMirrorOptions(
				options,
				this.configurationService,
				u => editor.updateOptions(u)
			);

			const editor = this.widget.value = this.editor ? this.instantiationService.createInstance(
				EmbeddedCodeEditorWidget,
				this.container,
				options,
				{},
				this.editor,
			) : this.instantiationService.createInstance(
				CodeEditorWidget,
				this.container,
				options,
				{ isSimpleWidget: true }
			);

			Event.once(editor.onDidDispose)(() => {
				listener.dispose();
			});

			if (this.dimension) {
				editor.layout(this.dimension);
			}
		}

		this.widget.value.setModel(modelRef.object.textEditorModel);
		this.widget.value.updateOptions(commonEditorOptions);
		this.widgetDecorations.value = colorizeTestMessageInEditor(message.message, this.widget.value);
		return true;
	}

	private clear() {
		this.widgetDecorations.clear();
		this.widget.clear();
		this.model.clear();
	}

	onScrolled(evt: ScrollEvent): void {
		this.helper?.onScrolled(evt, this.widget.value?.getDomNode(), this.widget.value);
	}

	public layout(dimensions: dom.IDimension, hasMultipleFrames: boolean) {
		this.dimension = dimensions;
		const editor = this.widget.value;
		if (!editor) {
			return;
		}

		editor.layout(dimensions);
		const height = editor.getContentHeight();
		this.helper = new ScrollHelper(hasMultipleFrames, height, dimensions.height);
		editor.updateOptions({ scrollbar: { ...commonEditorOptions.scrollbar, handleMouseWheel: !hasMultipleFrames } });

		return height;
	}
}

export class TerminalMessagePeek extends Disposable implements IPeekOutputRenderer {
	private dimensions?: dom.IDimension;
	private readonly terminalCwd = this._register(new MutableObservableValue<string>(''));
	private readonly xtermLayoutDelayer = this._register(new Delayer(50));

	/** Active terminal instance. */
	private readonly terminal = this._register(new MutableDisposable<IDetachedTerminalInstance>());
	/** Listener for streaming result data */
	private readonly outputDataListener = this._register(new MutableDisposable());

	constructor(
		private readonly container: HTMLElement,
		private readonly isInPeekView: boolean,
		@ITerminalService private readonly terminalService: ITerminalService,
		@IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService,
		@IWorkspaceContextService private readonly workspaceContext: IWorkspaceContextService,
	) {
		super();
	}

	private async makeTerminal() {
		const prev = this.terminal.value;
		if (prev) {
			prev.xterm.clearBuffer();
			prev.xterm.clearSearchDecorations();
			// clearBuffer tries to retain the prompt. Reset prompt, scrolling state, etc.
			prev.xterm.write(`\x1bc`);
			return prev;
		}

		const capabilities = new TerminalCapabilityStore();
		const cwd = this.terminalCwd;
		capabilities.add(TerminalCapability.CwdDetection, {
			type: TerminalCapability.CwdDetection,
			get cwds() { return [cwd.value]; },
			onDidChangeCwd: cwd.onDidChange,
			getCwd: () => cwd.value,
			updateCwd: () => { },
		});

		return this.terminal.value = await this.terminalService.createDetachedTerminal({
			rows: 10,
			cols: 80,
			readonly: true,
			capabilities,
			processInfo: new DetachedProcessInfo({ initialCwd: cwd.value }),
			colorProvider: {
				getBackgroundColor: theme => {
					const terminalBackground = theme.getColor(TERMINAL_BACKGROUND_COLOR);
					if (terminalBackground) {
						return terminalBackground;
					}
					if (this.isInPeekView) {
						return theme.getColor(peekViewResultsBackground);
					}
					const location = this.viewDescriptorService.getViewLocationById(Testing.ResultsViewId);
					return location === ViewContainerLocation.Panel
						? theme.getColor(PANEL_BACKGROUND)
						: theme.getColor(SIDE_BAR_BACKGROUND);
				},
			}
		});
	}

	public async update(subject: InspectSubject): Promise<boolean> {
		this.outputDataListener.clear();
		if (subject instanceof TaskSubject) {
			await this.updateForTaskSubject(subject);
		} else if (subject instanceof TestOutputSubject || (subject instanceof MessageSubject && subject.message.type === TestMessageType.Output)) {
			await this.updateForTestSubject(subject);
		} else {
			this.clear();
			return false;
		}

		return true;
	}

	private async updateForTestSubject(subject: TestOutputSubject | MessageSubject) {
		const that = this;
		const testItem = subject instanceof TestOutputSubject ? subject.test.item : subject.test;
		const terminal = await this.updateGenerically<ITaskRawOutput>({
			subject,
			noOutputMessage: localize('caseNoOutput', 'The test case did not report any output.'),
			getTarget: result => result?.tasks[subject.taskIndex].output,
			*doInitialWrite(output, results) {
				that.updateCwd(testItem.uri);
				const state = subject instanceof TestOutputSubject ? subject.test : results.getStateById(testItem.extId);
				if (!state) {
					return;
				}

				for (const message of state.tasks[subject.taskIndex].messages) {
					if (message.type === TestMessageType.Output) {
						yield* output.getRangeIter(message.offset, message.length);
					}
				}
			},
			doListenForMoreData: (output, result, write) => result.onChange(e => {
				if (e.reason === TestResultItemChangeReason.NewMessage && e.item.item.extId === testItem.extId && e.message.type === TestMessageType.Output) {
					for (const chunk of output.getRangeIter(e.message.offset, e.message.length)) {
						write(chunk.buffer);
					}
				}
			}),
		});

		if (subject instanceof MessageSubject && subject.message.type === TestMessageType.Output && subject.message.marker !== undefined) {
			terminal?.xterm.selectMarkedRange(getMarkId(subject.message.marker, true), getMarkId(subject.message.marker, false), /* scrollIntoView= */ true);
		}
	}

	private updateForTaskSubject(subject: TaskSubject) {
		return this.updateGenerically<ITestRunTaskResults>({
			subject,
			noOutputMessage: localize('runNoOutput', 'The test run did not record any output.'),
			getTarget: result => result?.tasks[subject.taskIndex],
			doInitialWrite: (task, result) => {
				// Update the cwd and use the first test to try to hint at the correct cwd,
				// but often this will fall back to the first workspace folder.
				this.updateCwd(Iterable.find(result.tests, t => !!t.item.uri)?.item.uri);
				return task.output.buffers;
			},
			doListenForMoreData: (task, _result, write) => task.output.onDidWriteData(e => write(e.buffer)),
		});
	}

	private async updateGenerically<T>(opts: {
		subject: InspectSubject;
		noOutputMessage: string;
		getTarget: (result: ITestResult) => T | undefined;
		doInitialWrite: (target: T, result: LiveTestResult) => Iterable<VSBuffer>;
		doListenForMoreData: (target: T, result: LiveTestResult, write: (s: Uint8Array) => void) => IDisposable;
	}) {
		const result = opts.subject.result;
		const target = opts.getTarget(result);
		if (!target) {
			return this.clear();
		}

		const terminal = await this.makeTerminal();
		let didWriteData = false;

		const pendingWrites = new MutableObservableValue(0);
		if (result instanceof LiveTestResult) {
			for (const chunk of opts.doInitialWrite(target, result)) {
				didWriteData ||= chunk.byteLength > 0;
				pendingWrites.value++;
				terminal.xterm.write(chunk.buffer, () => pendingWrites.value--);
			}
		} else {
			didWriteData = true;
			this.writeNotice(terminal, localize('runNoOutputForPast', 'Test output is only available for new test runs.'));
		}

		this.attachTerminalToDom(terminal);
		this.outputDataListener.clear();

		if (result instanceof LiveTestResult && !result.completedAt) {
			const l1 = result.onComplete(() => {
				if (!didWriteData) {
					this.writeNotice(terminal, opts.noOutputMessage);
				}
			});
			const l2 = opts.doListenForMoreData(target, result, data => {
				terminal.xterm.write(data);
				didWriteData ||= data.byteLength > 0;
			});

			this.outputDataListener.value = combinedDisposable(l1, l2);
		}

		if (!this.outputDataListener.value && !didWriteData) {
			this.writeNotice(terminal, opts.noOutputMessage);
		}

		// Ensure pending writes finish, otherwise the selection in `updateForTestSubject`
		// can happen before the markers are processed.
		if (pendingWrites.value > 0) {
			await new Promise<void>(resolve => {
				const l = pendingWrites.onDidChange(() => {
					if (pendingWrites.value === 0) {
						l.dispose();
						resolve();
					}
				});
			});
		}

		return terminal;
	}

	private updateCwd(testUri?: URI) {
		const wf = (testUri && this.workspaceContext.getWorkspaceFolder(testUri))
			|| this.workspaceContext.getWorkspace().folders[0];
		if (wf) {
			this.terminalCwd.value = wf.uri.fsPath;
		}
	}

	private writeNotice(terminal: IDetachedTerminalInstance, str: string) {
		terminal.xterm.write(formatMessageForTerminal(str));
	}

	private attachTerminalToDom(terminal: IDetachedTerminalInstance) {
		terminal.xterm.write('\x1b[?25l'); // hide cursor
		dom.scheduleAtNextAnimationFrame(dom.getWindow(this.container), () => this.layoutTerminal(terminal));
		terminal.attachToElement(this.container, { enableGpu: false });
	}

	private clear() {
		this.outputDataListener.clear();
		this.xtermLayoutDelayer.cancel();
		this.terminal.clear();
	}

	public layout(dimensions: dom.IDimension) {
		this.dimensions = dimensions;
		if (this.terminal.value) {
			this.layoutTerminal(this.terminal.value, dimensions.width, dimensions.height);
			return dimensions.height;
		}

		return undefined;
	}

	private layoutTerminal(
		{ xterm }: IDetachedTerminalInstance,
		width = this.dimensions?.width ?? this.container.clientWidth,
		height = this.dimensions?.height ?? this.container.clientHeight
	) {
		width -= 10 + 20; // scrollbar width + margin
		this.xtermLayoutDelayer.trigger(() => {
			const scaled = getXtermScaledDimensions(dom.getWindow(this.container), xterm.getFont(), width, height);
			if (scaled) {
				xterm.resize(scaled.cols, scaled.rows);
			}
		});
	}
}

const isMultiline = (str: string | undefined) => !!str && str.includes('\n');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/testResultsView/testResultsSubject.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/testResultsView/testResultsSubject.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { MarshalledId } from '../../../../../base/common/marshallingIds.js';
import { URI } from '../../../../../base/common/uri.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { TestId } from '../../common/testId.js';
import { ITestResult } from '../../common/testResult.js';
import { IRichLocation, ITestItem, ITestMessage, ITestMessageMenuArgs, ITestRunTask, ITestTaskState, InternalTestItem, TestMessageType, TestResultItem } from '../../common/testTypes.js';
import { TestUriType, buildTestUri } from '../../common/testingUri.js';

export const getMessageArgs = (test: TestResultItem, message: ITestMessage): ITestMessageMenuArgs => ({
	$mid: MarshalledId.TestMessageMenuArgs,
	test: InternalTestItem.serialize(test),
	message: ITestMessage.serialize(message),
});

interface ISubjectCommon {
	controllerId: string;
}

export const inspectSubjectHasStack = (subject: InspectSubject | undefined) =>
	subject instanceof MessageSubject && !!subject.stack?.length;

export class MessageSubject implements ISubjectCommon {
	public readonly test: ITestItem;
	public readonly message: ITestMessage;
	public readonly expectedUri: URI;
	public readonly actualUri: URI;
	public readonly messageUri: URI;
	public readonly revealLocation: IRichLocation | undefined;
	public readonly context: ITestMessageMenuArgs | undefined;

	public get controllerId() {
		return TestId.root(this.test.extId);
	}

	public get isDiffable() {
		return this.message.type === TestMessageType.Error && ITestMessage.isDiffable(this.message);
	}

	public get contextValue() {
		return this.message.type === TestMessageType.Error ? this.message.contextValue : undefined;
	}

	public get stack() {
		return this.message.type === TestMessageType.Error && this.message.stackTrace?.length ? this.message.stackTrace : undefined;
	}

	constructor(public readonly result: ITestResult, test: TestResultItem, public readonly taskIndex: number, public readonly messageIndex: number) {
		this.test = test.item;
		const messages = test.tasks[taskIndex].messages;
		this.messageIndex = messageIndex;

		const parts = { messageIndex, resultId: result.id, taskIndex, testExtId: test.item.extId };
		this.expectedUri = buildTestUri({ ...parts, type: TestUriType.ResultExpectedOutput });
		this.actualUri = buildTestUri({ ...parts, type: TestUriType.ResultActualOutput });
		this.messageUri = buildTestUri({ ...parts, type: TestUriType.ResultMessage });

		const message = this.message = messages[this.messageIndex];
		this.context = getMessageArgs(test, message);
		this.revealLocation = message.location ?? (test.item.uri && test.item.range ? { uri: test.item.uri, range: Range.lift(test.item.range) } : undefined);
	}
}

export class TaskSubject implements ISubjectCommon {
	public readonly outputUri: URI;
	public readonly revealLocation: undefined;

	public get controllerId() {
		return this.result.tasks[this.taskIndex].ctrlId;
	}

	constructor(public readonly result: ITestResult, public readonly taskIndex: number) {
		this.outputUri = buildTestUri({ resultId: result.id, taskIndex, type: TestUriType.TaskOutput });
	}
}

export class TestOutputSubject implements ISubjectCommon {
	public readonly outputUri: URI;
	public readonly revealLocation: undefined;
	public readonly task: ITestRunTask;

	public get controllerId() {
		return TestId.root(this.test.item.extId);
	}

	constructor(public readonly result: ITestResult, public readonly taskIndex: number, public readonly test: TestResultItem) {
		this.outputUri = buildTestUri({ resultId: this.result.id, taskIndex: this.taskIndex, testExtId: this.test.item.extId, type: TestUriType.TestOutput });
		this.task = result.tasks[this.taskIndex];
	}
}

export type InspectSubject = MessageSubject | TaskSubject | TestOutputSubject;

export const equalsSubject = (a: InspectSubject, b: InspectSubject) => (
	(a instanceof MessageSubject && b instanceof MessageSubject && a.message === b.message) ||
	(a instanceof TaskSubject && b instanceof TaskSubject && a.result === b.result && a.taskIndex === b.taskIndex) ||
	(a instanceof TestOutputSubject && b instanceof TestOutputSubject && a.test === b.test && a.taskIndex === b.taskIndex)
);


export const mapFindTestMessage = <T>(test: TestResultItem, fn: (task: ITestTaskState, message: ITestMessage, messageIndex: number, taskIndex: number) => T | undefined) => {
	for (let taskIndex = 0; taskIndex < test.tasks.length; taskIndex++) {
		const task = test.tasks[taskIndex];
		for (let messageIndex = 0; messageIndex < task.messages.length; messageIndex++) {
			const r = fn(task, task.messages[messageIndex], messageIndex, taskIndex);
			if (r !== undefined) {
				return r;
			}
		}
	}

	return undefined;
};

export const getSubjectTestItem = (subject: InspectSubject) => {
	if (subject instanceof MessageSubject) {
		return subject.test;
	}

	if (subject instanceof TaskSubject) {
		return undefined;
	}

	return subject.test.item;
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/testResultsView/testResultsTree.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/testResultsView/testResultsTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { ActionBar } from '../../../../../base/browser/ui/actionbar/actionbar.js';
import { renderLabelWithIcons } from '../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { IIdentityProvider } from '../../../../../base/browser/ui/list/list.js';
import { ICompressedTreeElement, ICompressedTreeNode } from '../../../../../base/browser/ui/tree/compressedObjectTreeModel.js';
import { ICompressibleTreeRenderer } from '../../../../../base/browser/ui/tree/objectTree.js';
import { ITreeContextMenuEvent, ITreeNode } from '../../../../../base/browser/ui/tree/tree.js';
import { Action, ActionRunner, IAction, Separator } from '../../../../../base/common/actions.js';
import { RunOnceScheduler } from '../../../../../base/common/async.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { FuzzyScore } from '../../../../../base/common/filters.js';
import { Iterable } from '../../../../../base/common/iterator.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { MarshalledId } from '../../../../../base/common/marshallingIds.js';
import { autorun } from '../../../../../base/common/observable.js';
import { count } from '../../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { isDefined } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { localize } from '../../../../../nls.js';
import { MenuEntryActionViewItem, fillInActionBarActions } from '../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenuService, MenuId, MenuItemAction } from '../../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { WorkbenchCompressibleObjectTree } from '../../../../../platform/list/browser/listService.js';
import { IProgressService } from '../../../../../platform/progress/common/progress.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { widgetClose } from '../../../../../platform/theme/common/iconRegistry.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { TestCommandId, Testing } from '../../common/constants.js';
import { ITestCoverageService } from '../../common/testCoverageService.js';
import { ITestExplorerFilterState } from '../../common/testExplorerFilterState.js';
import { TestId } from '../../common/testId.js';
import { ITestProfileService } from '../../common/testProfileService.js';
import { ITestResult, ITestRunTaskResults, LiveTestResult, TestResultItemChangeReason, maxCountPriority } from '../../common/testResult.js';
import { ITestResultService } from '../../common/testResultService.js';
import { IRichLocation, ITestItemContext, ITestMessage, InternalTestItem, TestMessageType, TestResultItem, TestResultState, TestRunProfileBitset, testResultStateToContextValues } from '../../common/testTypes.js';
import { TestingContextKeys } from '../../common/testingContextKeys.js';
import { cmpPriority, isFailedState } from '../../common/testingStates.js';
import { TestUriType, buildTestUri } from '../../common/testingUri.js';
import { getTestItemContextOverlay } from '../explorerProjections/testItemContextOverlay.js';
import * as icons from '../icons.js';
import { renderTestMessageAsText } from '../testMessageColorizer.js';
import { InspectSubject, MessageSubject, TaskSubject, TestOutputSubject, getMessageArgs, mapFindTestMessage } from './testResultsSubject.js';


interface ITreeElement {
	type: string;
	context: unknown;
	id: string;
	label: string;
	readonly onDidChange: Event<void>;
	labelWithIcons?: readonly (HTMLSpanElement | string)[];
	icon?: ThemeIcon;
	description?: string;
	ariaLabel?: string;
}

interface ITaskContext {
	testRunName: string;
	controllerId: string;
	resultId: string;
	taskId: string;
}

function getTaskContext(resultId: string, task: ITestRunTaskResults): ITaskContext {
	return { testRunName: task.name, controllerId: task.ctrlId, resultId, taskId: task.id };
}

class TestResultElement implements ITreeElement {
	public readonly changeEmitter = new Emitter<void>();
	public readonly onDidChange = this.changeEmitter.event;
	public readonly type = 'result';
	public readonly context: string;
	public readonly id: string;
	public readonly label: string;

	public get icon() {
		return icons.testingStatesToIcons.get(
			this.value.completedAt === undefined
				? TestResultState.Running
				: maxCountPriority(this.value.counts)
		);
	}

	constructor(public readonly value: ITestResult) {
		this.id = value.id;
		this.context = value.id;
		this.label = value.name;
	}
}

const openCoverageLabel = localize('openTestCoverage', 'View Test Coverage');
const closeCoverageLabel = localize('closeTestCoverage', 'Close Test Coverage');

class CoverageElement implements ITreeElement {
	public readonly type = 'coverage';
	public readonly context: undefined;
	public readonly id: string;
	public readonly onDidChange: Event<void>;

	public get label() {
		return this.isOpen ? closeCoverageLabel : openCoverageLabel;
	}

	public get icon() {
		return this.isOpen ? widgetClose : icons.testingCoverageReport;
	}

	public get isOpen() {
		return this.coverageService.selected.get()?.fromTaskId === this.task.id;
	}

	constructor(
		results: ITestResult,
		public readonly task: ITestRunTaskResults,
		private readonly coverageService: ITestCoverageService,
	) {
		this.id = `coverage-${results.id}/${task.id}`;
		this.onDidChange = Event.fromObservableLight(coverageService.selected);
	}
}

class OlderResultsElement implements ITreeElement {
	public readonly type = 'older';
	public readonly context: undefined;
	public readonly id: string;
	public readonly onDidChange = Event.None;
	public readonly label: string;

	constructor(private readonly n: number) {
		this.label = n === 1
			? localize('oneOlderResult', '1 older result')
			: localize('nOlderResults', '{0} older results', n);
		this.id = `older-${this.n}`;
	}
}

class TestCaseElement implements ITreeElement {
	public readonly type = 'test';
	public readonly context: ActionSpreadArgs<[ITestItemContext, ITaskContext]>;
	public readonly id: string;
	public readonly description?: string;

	public get onDidChange() {
		if (!(this.results instanceof LiveTestResult)) {
			return Event.None;
		}

		return Event.filter(this.results.onChange, e => e.item.item.extId === this.test.item.extId && e.reason !== TestResultItemChangeReason.NewMessage);
	}

	public get state() {
		return this.test.tasks[this.taskIndex].state;
	}

	public get label() {
		return this.test.item.label;
	}

	public get labelWithIcons() {
		return renderLabelWithIcons(this.label);
	}

	public get icon() {
		return icons.testingStatesToIcons.get(this.state);
	}

	public get outputSubject() {
		return new TestOutputSubject(this.results, this.taskIndex, this.test);
	}


	constructor(
		public readonly results: ITestResult,
		public readonly test: TestResultItem,
		public readonly taskIndex: number,
	) {
		this.id = `${results.id}/${test.item.extId}`;

		const parentId = TestId.fromString(test.item.extId).parentId;
		if (parentId) {
			this.description = '';
			for (const part of parentId.idsToRoot()) {
				if (part.isRoot) { break; }
				const test = results.getStateById(part.toString());
				if (!test) { break; }
				if (this.description.length) {
					this.description += ' \u2039 ';
				}

				this.description += test.item.label;
			}
		}

		this.context = new ActionSpreadArgs([
			{
				$mid: MarshalledId.TestItemContext,
				tests: [InternalTestItem.serialize(test)],
			},
			getTaskContext(results.id, results.tasks[this.taskIndex])
		]);
	}
}

class TaskElement implements ITreeElement {
	public readonly changeEmitter = new Emitter<void>();
	public readonly onDidChange = this.changeEmitter.event;
	public readonly type = 'task';
	public readonly context: ITaskContext;
	public readonly id: string;
	public readonly label: string;
	public readonly itemsCache = new CreationCache<TestCaseElement>();

	public get icon() {
		return this.results.tasks[this.index].running ? icons.testingStatesToIcons.get(TestResultState.Running) : undefined;
	}

	constructor(public readonly results: ITestResult, public readonly task: ITestRunTaskResults, public readonly index: number) {
		this.id = `${results.id}/${index}`;
		this.task = results.tasks[index];
		this.context = getTaskContext(results.id, this.task);
		this.label = this.task.name;
	}
}

class TestMessageElement implements ITreeElement {
	public readonly type = 'message';
	public readonly id: string;
	public readonly label: string;
	public readonly uri: URI;
	public readonly location?: IRichLocation;
	public readonly description?: string;
	public readonly contextValue?: string;
	public readonly message: ITestMessage;

	public get onDidChange() {
		if (!(this.result instanceof LiveTestResult)) {
			return Event.None;
		}

		// rerender when the test case changes so it gets retired events
		return Event.filter(this.result.onChange, e => e.item.item.extId === this.test.item.extId && e.reason !== TestResultItemChangeReason.NewMessage);
	}

	public get context() {
		return new ActionSpreadArgs([
			getMessageArgs(this.test, this.message),
			getTaskContext(this.result.id, this.result.tasks[this.taskIndex])
		]);
	}

	public get outputSubject() {
		return new TestOutputSubject(this.result, this.taskIndex, this.test);
	}

	constructor(
		public readonly result: ITestResult,
		public readonly test: TestResultItem,
		public readonly taskIndex: number,
		public readonly messageIndex: number,
	) {
		const m = this.message = test.tasks[taskIndex].messages[messageIndex];

		this.location = m.location;
		this.contextValue = m.type === TestMessageType.Error ? m.contextValue : undefined;
		this.uri = buildTestUri({
			type: TestUriType.ResultMessage,
			messageIndex,
			resultId: result.id,
			taskIndex,
			testExtId: test.item.extId
		});

		this.id = this.uri.toString();

		const asPlaintext = renderTestMessageAsText(m.message);
		const lines = count(asPlaintext.trimEnd(), '\n');
		this.label = firstLine(asPlaintext);
		if (lines > 0) {
			this.description = lines > 1
				? localize('messageMoreLinesN', '+ {0} more lines', lines)
				: localize('messageMoreLines1', '+ 1 more line');
		}
	}
}

type TreeElement = TestResultElement | TestCaseElement | TestMessageElement | TaskElement | CoverageElement | OlderResultsElement;

export class OutputPeekTree extends Disposable {
	private disposed = false;
	private readonly tree: WorkbenchCompressibleObjectTree<TreeElement, FuzzyScore>;
	private readonly treeActions: TreeActionsProvider;
	private readonly requestReveal = this._register(new Emitter<InspectSubject>());
	private readonly contextMenuActionRunner = this._register(new SpreadableActionRunner());

	public readonly onDidRequestReview = this.requestReveal.event;

	constructor(
		container: HTMLElement,
		readonly onDidReveal: Event<{ subject: InspectSubject; preserveFocus: boolean }>,
		options: { showRevealLocationOnMessages: boolean; locationForProgress: string },
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@ITestResultService results: ITestResultService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ITestExplorerFilterState explorerFilter: ITestExplorerFilterState,
		@ITestCoverageService coverageService: ITestCoverageService,
		@IProgressService progressService: IProgressService,
		@ITelemetryService telemetryService: ITelemetryService,
	) {
		super();

		this.treeActions = instantiationService.createInstance(TreeActionsProvider, options.showRevealLocationOnMessages, this.requestReveal,);
		const diffIdentityProvider: IIdentityProvider<TreeElement> = {
			getId(e: TreeElement) {
				return e.id;
			}
		};

		this.tree = this._register(instantiationService.createInstance(
			WorkbenchCompressibleObjectTree,
			'Test Output Peek',
			container,
			{
				getHeight: () => 22,
				getTemplateId: () => TestRunElementRenderer.ID,
			},
			[instantiationService.createInstance(TestRunElementRenderer, this.treeActions)],
			{
				compressionEnabled: true,
				hideTwistiesOfChildlessElements: true,
				identityProvider: diffIdentityProvider,
				alwaysConsumeMouseWheel: false,
				sorter: {
					compare(a, b) {
						if (a instanceof TestCaseElement && b instanceof TestCaseElement) {
							return cmpPriority(a.state, b.state);
						}

						return 0;
					},
				},
				accessibilityProvider: {
					getAriaLabel(element: ITreeElement) {
						return element.ariaLabel || element.label;
					},
					getWidgetAriaLabel() {
						return localize('testingPeekLabel', 'Test Result Messages');
					}
				}
			},
		)) as WorkbenchCompressibleObjectTree<TreeElement, FuzzyScore>;

		const cc = new CreationCache<TreeElement>();

		const getTaskChildren = (taskElem: TaskElement): Iterable<ICompressedTreeElement<TreeElement>> => {
			const { results, index, itemsCache, task } = taskElem;
			const tests = Iterable.filter(results.tests, test => test.tasks[index].state >= TestResultState.Running || test.tasks[index].messages.length > 0);
			let result: Iterable<ICompressedTreeElement<TreeElement>> = Iterable.map(tests, test => ({
				element: itemsCache.getOrCreate(test, () => new TestCaseElement(results, test, index)),
				incompressible: true,
				children: getTestChildren(results, test, index),
			}));

			if (task.coverage.get()) {
				result = Iterable.concat(
					Iterable.single<ICompressedTreeElement<TreeElement>>({
						element: new CoverageElement(results, task, coverageService),
						collapsible: true,
						incompressible: true,
					}),
					result,
				);
			}

			return result;
		};

		const getTestChildren = (result: ITestResult, test: TestResultItem, taskIndex: number): Iterable<ICompressedTreeElement<TreeElement>> => {
			return test.tasks[taskIndex].messages
				.map((m, messageIndex) =>
					m.type === TestMessageType.Error
						? { element: cc.getOrCreate(m, () => new TestMessageElement(result, test, taskIndex, messageIndex)), incompressible: false }
						: undefined
				)
				.filter(isDefined);
		};

		const getResultChildren = (result: ITestResult): ICompressedTreeElement<TreeElement>[] => {
			return result.tasks.map((task, taskIndex) => {
				const taskElem = cc.getOrCreate(task, () => new TaskElement(result, task, taskIndex));
				return ({
					element: taskElem,
					incompressible: false,
					collapsible: true,
					children: getTaskChildren(taskElem),
				});
			});
		};

		const getRootChildren = (): Iterable<ICompressedTreeElement<TreeElement>> => {
			let children: ICompressedTreeElement<TreeElement>[] = [];

			const older = [];

			for (const result of results.results) {
				if (!children.length && result.tasks.length) {
					children = getResultChildren(result);
				} else if (children) {
					const element = cc.getOrCreate(result, () => new TestResultElement(result));
					older.push({
						element,
						incompressible: true,
						collapsible: true,
						collapsed: this.tree.hasElement(element) ? this.tree.isCollapsed(element) : true,
						children: getResultChildren(result)
					});
				}
			}

			if (!children.length) {
				return older;
			}

			if (older.length) {
				children.push({
					element: new OlderResultsElement(older.length),
					incompressible: true,
					collapsible: true,
					collapsed: true,
					children: older,
				});
			}

			return children;
		};

		// Queued result updates to prevent spamming CPU when lots of tests are
		// completing and messaging quickly (#142514)
		const taskChildrenToUpdate = new Set<TaskElement>();
		const taskChildrenUpdate = this._register(new RunOnceScheduler(() => {
			for (const taskNode of taskChildrenToUpdate) {
				if (this.tree.hasElement(taskNode)) {
					this.tree.setChildren(taskNode, getTaskChildren(taskNode), { diffIdentityProvider });
				}
			}
			taskChildrenToUpdate.clear();
		}, 300));

		const queueTaskChildrenUpdate = (taskNode: TaskElement) => {
			taskChildrenToUpdate.add(taskNode);
			if (!taskChildrenUpdate.isScheduled()) {
				taskChildrenUpdate.schedule();
			}
		};

		const attachToResults = (result: LiveTestResult) => {
			const disposable = new DisposableStore();
			disposable.add(result.onNewTask(i => {
				this.tree.setChildren(null, getRootChildren(), { diffIdentityProvider });

				if (result.tasks.length === 1) {
					this.requestReveal.fire(new TaskSubject(result, 0)); // reveal the first task in new runs
				}

				// note: tasks are bounded and their lifetime is equivalent to that of
				// the test result, so this doesn't leak indefinitely.
				const task = result.tasks[i];
				disposable.add(autorun(reader => {
					task.coverage.read(reader); // add it to the autorun
					queueTaskChildrenUpdate(cc.get(task) as TaskElement);
				}));
			}));

			disposable.add(result.onEndTask(index => {
				(cc.get(result.tasks[index]) as TaskElement | undefined)?.changeEmitter.fire();
			}));

			disposable.add(result.onChange(e => {
				// try updating the item in each of its tasks
				for (const [index, task] of result.tasks.entries()) {
					const taskNode = cc.get(task) as TaskElement;
					if (!this.tree.hasElement(taskNode)) {
						continue;
					}

					const itemNode = taskNode.itemsCache.get(e.item);
					if (itemNode && this.tree.hasElement(itemNode)) {
						if (e.reason === TestResultItemChangeReason.NewMessage && e.message.type === TestMessageType.Error) {
							this.tree.setChildren(itemNode, getTestChildren(result, e.item, index), { diffIdentityProvider });
						}
						return;
					}

					queueTaskChildrenUpdate(taskNode);
				}
			}));

			disposable.add(result.onComplete(() => {
				(cc.get(result) as TestResultElement | undefined)?.changeEmitter.fire();
				disposable.dispose();
			}));
		};

		this._register(results.onResultsChanged(e => {
			// little hack here: a result change can cause the peek to be disposed,
			// but this listener will still be queued. Doing stuff with the tree
			// will cause errors.
			if (this.disposed) {
				return;
			}

			if ('completed' in e) {
				(cc.get(e.completed) as TestResultElement | undefined)?.changeEmitter.fire();
			} else if ('started' in e) {
				attachToResults(e.started);
			} else {
				this.tree.setChildren(null, getRootChildren(), { diffIdentityProvider });
			}
		}));

		const revealItem = (element: TreeElement, preserveFocus: boolean) => {
			this.tree.setFocus([element]);
			this.tree.setSelection([element]);
			if (!preserveFocus) {
				this.tree.domFocus();
			}
		};

		this._register(onDidReveal(async ({ subject, preserveFocus = false }) => {
			if (subject instanceof TaskSubject) {
				const resultItem = this.tree.getNode(null).children.find(c => {
					if (c.element instanceof TaskElement) {
						return c.element.results.id === subject.result.id && c.element.index === subject.taskIndex;
					}
					if (c.element instanceof TestResultElement) {
						return c.element.id === subject.result.id;
					}
					return false;
				});

				if (resultItem) {
					revealItem(resultItem.element!, preserveFocus);
				}
				return;
			}

			const revealElement = subject instanceof TestOutputSubject
				? cc.get<TaskElement>(subject.task)?.itemsCache.get(subject.test)
				: cc.get(subject.message);
			if (!revealElement || !this.tree.hasElement(revealElement)) {
				return;
			}

			const parents: TreeElement[] = [];
			for (let parent = this.tree.getParentElement(revealElement); parent; parent = this.tree.getParentElement(parent)) {
				parents.unshift(parent);
			}

			for (const parent of parents) {
				this.tree.expand(parent);
			}

			if (this.tree.getRelativeTop(revealElement) === null) {
				this.tree.reveal(revealElement, 0.5);
			}

			revealItem(revealElement, preserveFocus);
		}));

		this._register(this.tree.onDidOpen(async e => {
			if (e.element instanceof TestMessageElement) {
				this.requestReveal.fire(new MessageSubject(e.element.result, e.element.test, e.element.taskIndex, e.element.messageIndex));
			} else if (e.element instanceof TestCaseElement) {
				const t = e.element;
				const message = mapFindTestMessage(e.element.test, (_t, _m, mesasgeIndex, taskIndex) =>
					new MessageSubject(t.results, t.test, taskIndex, mesasgeIndex));
				this.requestReveal.fire(message || new TestOutputSubject(t.results, 0, t.test));
			} else if (e.element instanceof CoverageElement) {
				const task = e.element.task;
				if (e.element.isOpen) {
					return coverageService.closeCoverage();
				}
				progressService.withProgress(
					{ location: options.locationForProgress },
					() => coverageService.openCoverage(task, true)
				);
			}
		}));

		this._register(this.tree.onDidChangeSelection(evt => {
			for (const element of evt.elements) {
				if (element && 'test' in element) {
					explorerFilter.reveal.set(element.test.item.extId, undefined);
					break;
				}
			}
		}));

		this._register(explorerFilter.onDidSelectTestInExplorer(testId => {
			if (this.tree.getSelection().some(e => e && 'test' in e && e.test.item.extId === testId)) {
				return;
			}

			for (const node of this.tree.getNode(null).children) {
				if (node.element instanceof TaskElement) {
					for (const testNode of node.children) {
						if (testNode.element instanceof TestCaseElement && testNode.element.test.item.extId === testId) {
							this.tree.setSelection([testNode.element]);
							if (this.tree.getRelativeTop(testNode.element) === null) {
								this.tree.reveal(testNode.element, 0.5);
							}
							break;
						}
					}
				}
			}
		}));


		this._register(this.tree.onContextMenu(e => this.onContextMenu(e)));

		this._register(this.tree.onDidChangeCollapseState(e => {
			if (e.node.element instanceof OlderResultsElement && !e.node.collapsed) {
				telemetryService.publicLog2<{}, {
					owner: 'connor4312';
					// we're considering removing or depromoting this feature because we don't think it's used:
					comment: 'Records that test history was used';
				}>('testing.expandOlderResults');
			}
		}));

		this.tree.setChildren(null, getRootChildren());
		for (const result of results.results) {
			if (!result.completedAt && result instanceof LiveTestResult) {
				attachToResults(result);
			}
		}
	}

	public layout(height: number, width: number) {
		this.tree.layout(height, width);
	}

	private onContextMenu(evt: ITreeContextMenuEvent<ITreeElement | null>) {
		if (!evt.element) {
			return;
		}

		const actions = this.treeActions.provideActionBar(evt.element);
		this.contextMenuService.showContextMenu({
			getAnchor: () => evt.anchor,
			getActions: () => actions.secondary.length
				? [...actions.primary, new Separator(), ...actions.secondary]
				: actions.primary,
			getActionsContext: () => evt.element?.context,
			actionRunner: this.contextMenuActionRunner,
		});
	}

	public override dispose() {
		super.dispose();
		this.disposed = true;
	}
}

interface TemplateData {
	label: HTMLElement;
	icon: HTMLElement;
	actionBar: ActionBar;
	elementDisposable: DisposableStore;
	templateDisposable: DisposableStore;
}

class TestRunElementRenderer implements ICompressibleTreeRenderer<ITreeElement, FuzzyScore, TemplateData> {
	public static readonly ID = 'testRunElementRenderer';
	public readonly templateId = TestRunElementRenderer.ID;

	constructor(
		private readonly treeActions: TreeActionsProvider,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) { }

	/** @inheritdoc */
	public renderCompressedElements(node: ITreeNode<ICompressedTreeNode<ITreeElement>, FuzzyScore>, _index: number, templateData: TemplateData): void {
		const chain = node.element.elements;
		const lastElement = chain[chain.length - 1];
		if ((lastElement instanceof TaskElement || lastElement instanceof TestMessageElement) && chain.length >= 2) {
			this.doRender(chain[chain.length - 2], templateData, lastElement);
		} else {
			this.doRender(lastElement, templateData);
		}
	}

	/** @inheritdoc */
	public renderTemplate(container: HTMLElement): TemplateData {
		const templateDisposable = new DisposableStore();
		container.classList.add('testing-stdtree-container');
		const icon = dom.append(container, dom.$('.state'));
		const label = dom.append(container, dom.$('.label'));

		const actionBar = new ActionBar(container, {
			actionRunner: templateDisposable.add(new SpreadableActionRunner()),
			actionViewItemProvider: (action, options) =>
				action instanceof MenuItemAction
					? this.instantiationService.createInstance(MenuEntryActionViewItem, action, { hoverDelegate: options.hoverDelegate })
					: undefined
		});

		const elementDisposable = new DisposableStore();
		templateDisposable.add(elementDisposable);
		templateDisposable.add(actionBar);

		return {
			icon,
			label,
			actionBar,
			elementDisposable,
			templateDisposable,
		};
	}

	/** @inheritdoc */
	public renderElement(element: ITreeNode<ITreeElement, FuzzyScore>, _index: number, templateData: TemplateData): void {
		this.doRender(element.element, templateData);
	}

	/** @inheritdoc */
	public disposeTemplate(templateData: TemplateData): void {
		templateData.templateDisposable.dispose();
	}

	/** Called to render a new element */
	private doRender(element: ITreeElement, templateData: TemplateData, subjectElement?: ITreeElement) {
		templateData.elementDisposable.clear();
		templateData.elementDisposable.add(
			element.onDidChange(() => this.doRender(element, templateData, subjectElement)),
		);
		this.doRenderInner(element, templateData, subjectElement);
	}

	/** Called, and may be re-called, to render or re-render an element */
	private doRenderInner(element: ITreeElement, templateData: TemplateData, subjectElement: ITreeElement | undefined) {
		let { label, labelWithIcons, description } = element;
		if (subjectElement instanceof TestMessageElement) {
			description = subjectElement.label;
			if (element.description) {
				description = `${description} @ ${element.description}`;
			}
		}

		const descriptionElement = description ? dom.$('span.test-label-description', {}, description) : '';
		if (labelWithIcons) {
			dom.reset(templateData.label, ...labelWithIcons, descriptionElement);
		} else {
			dom.reset(templateData.label, label, descriptionElement);
		}

		const icon = element.icon;
		templateData.icon.className = `computed-state ${icon ? ThemeIcon.asClassName(icon) : ''}`;

		const actions = this.treeActions.provideActionBar(element);
		templateData.actionBar.clear();
		templateData.actionBar.context = element.context;
		templateData.actionBar.push(actions.primary, { icon: true, label: false });
	}
}

class TreeActionsProvider {
	constructor(
		private readonly showRevealLocationOnMessages: boolean,
		private readonly requestReveal: Emitter<InspectSubject>,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IMenuService private readonly menuService: IMenuService,
		@ICommandService private readonly commandService: ICommandService,
		@ITestProfileService private readonly testProfileService: ITestProfileService,
		@IEditorService private readonly editorService: IEditorService,
	) { }

	public provideActionBar(element: ITreeElement) {
		const test = element instanceof TestCaseElement ? element.test : undefined;
		const capabilities = test ? this.testProfileService.capabilitiesForTest(test.item) : 0;

		const contextKeys: [string, unknown][] = [
			['peek', Testing.OutputPeekContributionId],
			[TestingContextKeys.peekItemType.key, element.type],
		];

		let id = MenuId.TestPeekElement;
		const primary: IAction[] = [];
		const secondary: IAction[] = [];

		if (element instanceof TaskElement) {
			primary.push(new Action(
				'testing.outputPeek.showResultOutput',
				localize('testing.showResultOutput', "Show Result Output"),
				ThemeIcon.asClassName(Codicon.terminal),
				undefined,
				() => this.requestReveal.fire(new TaskSubject(element.results, element.index)),
			));
			if (element.task.running) {
				primary.push(new Action(
					'testing.outputPeek.cancel',
					localize('testing.cancelRun', 'Cancel Test Run'),
					ThemeIcon.asClassName(icons.testingCancelIcon),
					undefined,
					() => this.commandService.executeCommand(TestCommandId.CancelTestRunAction, element.results.id, element.task.id),
				));
			} else {
				primary.push(new Action(
					'testing.outputPeek.rerun',
					localize('testing.reRunLastRun', 'Rerun Last Run'),
					ThemeIcon.asClassName(icons.testingRerunIcon),
					undefined,
					() => this.commandService.executeCommand(TestCommandId.ReRunLastRun, element.results.id),
				));

				const hasFailedTests = Iterable.some(element.results.tests, test => isFailedState(test.ownComputedState));
				if (hasFailedTests) {
					primary.push(new Action(
						'testing.outputPeek.rerunFailed',
						localize('testing.reRunFailedFromLastRun', 'Rerun Failed Tests'),
						ThemeIcon.asClassName(icons.testingRerunIcon),
						undefined,
						() => this.commandService.executeCommand(TestCommandId.ReRunFailedFromLastRun, element.results.id),
					));
				}

				primary.push(new Action(
					'testing.outputPeek.debug',
					localize('testing.debugLastRun', 'Debug Last Run'),
					ThemeIcon.asClassName(icons.testingDebugIcon),
					undefined,
					() => this.commandService.executeCommand(TestCommandId.DebugLastRun, element.results.id),
				));

				if (hasFailedTests) {
					primary.push(new Action(
						'testing.outputPeek.debugFailed',
						localize('testing.debugFailedFromLastRun', 'Debug Failed Tests'),
						ThemeIcon.asClassName(icons.testingDebugIcon),
						undefined,
						() => this.commandService.executeCommand(TestCommandId.DebugFailedFromLastRun, element.results.id),
					));
				}
			}
		}

		if (element instanceof TestResultElement) {
			// only show if there are no collapsed test nodes that have more specific choices
			if (element.value.tasks.length === 1) {
				primary.push(new Action(
					'testing.outputPeek.showResultOutput',
					localize('testing.showResultOutput', "Show Result Output"),
					ThemeIcon.asClassName(Codicon.terminal),
					undefined,
					() => this.requestReveal.fire(new TaskSubject(element.value, 0)),
				));
			}

			primary.push(new Action(
				'testing.outputPeek.reRunLastRun',
				localize('testing.reRunTest', "Rerun Test"),
				ThemeIcon.asClassName(icons.testingRunIcon),
				undefined,
				() => this.commandService.executeCommand('testing.reRunLastRun', element.value.id),
			));

			const hasFailedTests = Iterable.some(element.value.tests, test => isFailedState(test.ownComputedState));
			if (hasFailedTests) {
				primary.push(new Action(
					'testing.outputPeek.rerunFailedResult',
					localize('testing.reRunFailedFromLastRun', 'Rerun Failed Tests'),
					ThemeIcon.asClassName(icons.testingRerunIcon),
					undefined,
					() => this.commandService.executeCommand(TestCommandId.ReRunFailedFromLastRun, element.value.id),
				));
			}

			if (capabilities & TestRunProfileBitset.Debug) {
				primary.push(new Action(
					'testing.outputPeek.debugLastRun',
					localize('testing.debugTest', "Debug Test"),
					ThemeIcon.asClassName(icons.testingDebugIcon),
					undefined,
					() => this.commandService.executeCommand('testing.debugLastRun', element.value.id),
				));

				if (hasFailedTests) {
					primary.push(new Action(
						'testing.outputPeek.debugFailedResult',
						localize('testing.debugFailedFromLastRun', 'Debug Failed Tests'),
						ThemeIcon.asClassName(icons.testingDebugIcon),
						undefined,
						() => this.commandService.executeCommand(TestCommandId.DebugFailedFromLastRun, element.value.id),
					));
				}
			}
		}

		if (element instanceof TestCaseElement || element instanceof TestMessageElement) {
			contextKeys.push(
				[TestingContextKeys.testResultOutdated.key, element.test.retired],
				[TestingContextKeys.testResultState.key, testResultStateToContextValues[element.test.ownComputedState]],
				...getTestItemContextOverlay(element.test, capabilities),
			);

			const { extId, uri } = element.test.item;
			if (uri) {
				primary.push(new Action(
					'testing.outputPeek.goToTest',
					localize('testing.goToTest', "Go to Test"),
					ThemeIcon.asClassName(Codicon.goToFile),
					undefined,
					() => this.commandService.executeCommand('vscode.revealTest', extId),
				));
			}

			if (element.test.tasks[element.taskIndex].messages.some(m => m.type === TestMessageType.Output)) {
				primary.push(new Action(
					'testing.outputPeek.showResultOutput',
					localize('testing.showResultOutput', "Show Result Output"),
					ThemeIcon.asClassName(Codicon.terminal),
					undefined,
					() => this.requestReveal.fire(element.outputSubject),
				));
			}

			secondary.push(new Action(
				'testing.outputPeek.revealInExplorer',
				localize('testing.revealInExplorer', "Reveal in Test Explorer"),
				ThemeIcon.asClassName(Codicon.listTree),
				undefined,
				() => this.commandService.executeCommand('_revealTestInExplorer', extId),
			));

			if (capabilities & TestRunProfileBitset.Run) {
				primary.push(new Action(
					'testing.outputPeek.runTest',
					localize('run test', 'Run Test'),
					ThemeIcon.asClassName(icons.testingRunIcon),
					undefined,
					() => this.commandService.executeCommand('vscode.runTestsById', TestRunProfileBitset.Run, extId),
				));
			}

			if (capabilities & TestRunProfileBitset.Debug) {
				primary.push(new Action(
					'testing.outputPeek.debugTest',
					localize('debug test', 'Debug Test'),
					ThemeIcon.asClassName(icons.testingDebugIcon),
					undefined,
					() => this.commandService.executeCommand('vscode.runTestsById', TestRunProfileBitset.Debug, extId),
				));
			}

		}

		if (element instanceof TestMessageElement) {
			id = MenuId.TestMessageContext;
			contextKeys.push([TestingContextKeys.testMessageContext.key, element.contextValue]);

			if (this.showRevealLocationOnMessages && element.location) {
				primary.push(new Action(
					'testing.outputPeek.goToError',
					localize('testing.goToError', "Go to Error"),
					ThemeIcon.asClassName(Codicon.debugStackframe),
					undefined,
					() => this.editorService.openEditor({
						resource: element.location!.uri,
						options: {
							selection: element.location!.range,
							preserveFocus: true,
						}
					}),
				));
			}
		}


		const contextOverlay = this.contextKeyService.createOverlay(contextKeys);
		const result = { primary, secondary };
		const menu = this.menuService.getMenuActions(id, contextOverlay, { shouldForwardArgs: true });
		fillInActionBarActions(menu, result, 'inline');
		return result;
	}
}

class CreationCache<T> {
	private readonly v = new WeakMap<object, T>();

	public get<T2 extends T = T>(key: object): T2 | undefined {
		return this.v.get(key) as T2 | undefined;
	}

	public getOrCreate<T2 extends T>(ref: object, factory: () => T2): T2 {
		const existing = this.v.get(ref);
		if (existing) {
			return existing as T2;
		}

		const fresh = factory();
		this.v.set(ref, fresh);
		return fresh;
	}
}

const firstLine = (str: string) => {
	const index = str.indexOf('\n');
	return index === -1 ? str : str.slice(0, index);
};



class ActionSpreadArgs<T extends unknown[]> {
	constructor(public readonly value: T) { }
}

class SpreadableActionRunner extends ActionRunner {
	protected override async runAction(action: IAction, context?: unknown): Promise<void> {
		if (context instanceof ActionSpreadArgs) {
			await action.run(...context.value);
		} else {
			await action.run(context);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/testResultsView/testResultsViewContent.css]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/testResultsView/testResultsViewContent.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .test-output-peek .test-output-peek-tree {
	background-color: var(--vscode-peekViewResult-background);
	color: var(--vscode-peekViewResult-lineForeground);
}

.monaco-editor .test-output-peek .test-output-peek-tree .monaco-list:focus .monaco-list-rows > .monaco-list-row.selected:not(.highlighted) {
	background-color: var(--vscode-peekViewResult-selectionBackground);
	color: var(--vscode-peekViewResult-selectionForeground) !important;
}

.test-output-peek-message-container a {
	color: var(--vscode-textLink-foreground);
}

.test-output-peek-message-container a :hover {
	color: var(--vscode-textLink-activeForeground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/testResultsView/testResultsViewContent.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/testResultsView/testResultsViewContent.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../../../base/browser/keyboardEvent.js';
import { renderLabelWithIcons } from '../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { Orientation, Sizing, SplitView } from '../../../../../base/browser/ui/splitview/splitview.js';
import { findAsync } from '../../../../../base/common/arrays.js';
import { Limiter } from '../../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { Emitter, Event, Relay } from '../../../../../base/common/event.js';
import { KeyCode } from '../../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { observableValue } from '../../../../../base/common/observable.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { localize } from '../../../../../nls.js';
import { FloatingClickMenu } from '../../../../../platform/actions/browser/floatingMenu.js';
import { createActionViewItem } from '../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { MenuWorkbenchToolBar } from '../../../../../platform/actions/browser/toolbar.js';
import { Action2, MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { AnyStackFrame, CallStackFrame, CallStackWidget, CustomStackFrame } from '../../../debug/browser/callStackWidget.js';
import { TestCommandId } from '../../common/constants.js';
import { getTestingConfiguration, TestingConfigKeys, TestingResultsViewLayout } from '../../common/configuration.js';
import { IObservableValue } from '../../common/observableValue.js';
import { capabilityContextKeys, ITestProfileService } from '../../common/testProfileService.js';
import { LiveTestResult } from '../../common/testResult.js';
import { ITestFollowup, ITestService } from '../../common/testService.js';
import { ITestMessageStackFrame, TestRunProfileBitset } from '../../common/testTypes.js';
import { TestingContextKeys } from '../../common/testingContextKeys.js';
import * as icons from '../icons.js';
import { DiffContentProvider, IPeekOutputRenderer, MarkdownTestMessagePeek, PlainTextMessagePeek, TerminalMessagePeek } from './testResultsOutput.js';
import { equalsSubject, getSubjectTestItem, InspectSubject, MessageSubject, TaskSubject, TestOutputSubject } from './testResultsSubject.js';
import { OutputPeekTree } from './testResultsTree.js';
import './testResultsViewContent.css';

/** UI state that can be saved/restored, used to give a nice experience when switching stack frames */
export interface ITestResultsViewContentUiState {
	splitViewWidths: number[];
}

class MessageStackFrame extends CustomStackFrame {
	public override height = observableValue('MessageStackFrame.height', 100);
	public override label: string;
	public override icon = icons.testingViewIcon;

	constructor(
		private readonly message: HTMLElement,
		private readonly followup: FollowupActionWidget,
		private readonly subject: InspectSubject,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@ITestProfileService private readonly profileService: ITestProfileService,
	) {
		super();

		this.label = subject instanceof MessageSubject
			? subject.test.label
			: subject instanceof TestOutputSubject
				? subject.test.item.label
				: subject.result.name;
	}

	public override render(container: HTMLElement): IDisposable {
		this.message.style.visibility = 'visible';
		container.appendChild(this.message);
		return toDisposable(() => this.message.remove());
	}

	public override renderActions(container: HTMLElement): IDisposable {
		const store = new DisposableStore();

		container.appendChild(this.followup.domNode);
		store.add(toDisposable(() => this.followup.domNode.remove()));

		const test = getSubjectTestItem(this.subject);
		const capabilities = test && this.profileService.capabilitiesForTest(test);
		let contextKeyService: IContextKeyService;
		if (capabilities) {
			contextKeyService = this.contextKeyService.createOverlay(capabilityContextKeys(capabilities));
		} else {
			const profiles = this.profileService.getControllerProfiles(this.subject.controllerId);
			contextKeyService = this.contextKeyService.createOverlay([
				[TestingContextKeys.hasRunnableTests.key, profiles.some(p => p.group & TestRunProfileBitset.Run)],
				[TestingContextKeys.hasDebuggableTests.key, profiles.some(p => p.group & TestRunProfileBitset.Debug)],
			]);
		}

		const instaService = store.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, contextKeyService])));

		const toolbar = store.add(instaService.createInstance(MenuWorkbenchToolBar, container, MenuId.TestCallStack, {
			menuOptions: { shouldForwardArgs: true },
			actionViewItemProvider: (action, options) => createActionViewItem(this.instantiationService, action, options),
		}));
		toolbar.context = this.subject;
		store.add(toolbar);

		return store;
	}
}

function runInLast(accessor: ServicesAccessor, bitset: TestRunProfileBitset, subject: InspectSubject) {
	// Let the full command do its thing if we want to run the whole set of tests
	if (subject instanceof TaskSubject) {
		return accessor.get(ICommandService).executeCommand(
			bitset === TestRunProfileBitset.Debug ? TestCommandId.DebugLastRun : TestCommandId.ReRunLastRun,
			subject.result.id,
		);
	}

	const testService = accessor.get(ITestService);
	const plainTest = subject instanceof MessageSubject ? subject.test : subject.test.item;
	const currentTest = testService.collection.getNodeById(plainTest.extId);
	if (!currentTest) {
		return;
	}

	return testService.runTests({
		group: bitset,
		tests: [currentTest],
	});
}

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'testing.callStack.run',
			title: localize('testing.callStack.run', "Rerun Test"),
			icon: icons.testingRunIcon,
			menu: {
				id: MenuId.TestCallStack,
				when: TestingContextKeys.hasRunnableTests,
				group: 'navigation',
			},
		});
	}

	override run(accessor: ServicesAccessor, subject: InspectSubject): void {
		runInLast(accessor, TestRunProfileBitset.Run, subject);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'testing.callStack.debug',
			title: localize('testing.callStack.debug', "Debug Test"),
			icon: icons.testingDebugIcon,
			menu: {
				id: MenuId.TestCallStack,
				when: TestingContextKeys.hasDebuggableTests,
				group: 'navigation',
			},
		});
	}

	override run(accessor: ServicesAccessor, subject: InspectSubject): void {
		runInLast(accessor, TestRunProfileBitset.Debug, subject);
	}
});

export class TestResultsViewContent extends Disposable {
	private static lastSplitWidth?: number;

	private readonly didReveal = this._register(new Emitter<{ subject: InspectSubject; preserveFocus: boolean }>());
	private readonly currentSubjectStore = this._register(new DisposableStore());
	private readonly onCloseEmitter = this._register(new Relay<void>());
	private followupWidget!: FollowupActionWidget;
	private messageContextKeyService!: IContextKeyService;
	private contextKeyTestMessage!: IContextKey<string>;
	private contextKeyResultOutdated!: IContextKey<boolean>;
	private stackContainer!: HTMLElement;
	private callStackWidget!: CallStackWidget;
	private currentTopFrame?: MessageStackFrame;
	private isDoingLayoutUpdate?: boolean;

	private dimension?: dom.Dimension;
	private splitView!: SplitView;
	private messageContainer!: HTMLElement;
	private contentProviders!: IPeekOutputRenderer[];
	private contentProvidersUpdateLimiter = this._register(new Limiter(1));
	private isTreeLeft = false; // Track layout setting

	public current?: InspectSubject;

	/** Fired when a tree item is selected. Populated only on .fillBody() */
	public onDidRequestReveal!: Event<InspectSubject>;

	public readonly onClose = this.onCloseEmitter.event;

	public get uiState(): ITestResultsViewContentUiState {
		return {
			splitViewWidths: Array.from(
				{ length: this.splitView.length },
				(_, i) => this.splitView.getViewSize(i)
			),
		};
	}

	public get onDidChangeContentHeight() {
		return this.callStackWidget.onDidChangeContentHeight;
	}

	public get contentHeight() {
		return this.callStackWidget?.contentHeight || 0;
	}

	private get diffViewIndex() {
		return this.isTreeLeft ? 1 : 0; // Content view index
	}

	private get historyViewIndex() {
		return this.isTreeLeft ? 0 : 1; // Tree view index
	}

	constructor(
		private readonly editor: ICodeEditor | undefined,
		private readonly options: {
			historyVisible: IObservableValue<boolean>;
			showRevealLocationOnMessages: boolean;
			locationForProgress: string;
		},
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITextModelService protected readonly modelService: ITextModelService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();
	}

	private swapViews() {
		const leftSize = this.splitView.getViewSize(0);
		const rightSize = this.splitView.getViewSize(1);
		const leftView = this.splitView.removeView(1);
		const rightView = this.splitView.removeView(0);

		this.splitView.addView(leftView, rightSize);
		this.splitView.addView(rightView, leftSize);
	}

	public fillBody(containerElement: HTMLElement): void {
		const initialSpitWidth = TestResultsViewContent.lastSplitWidth;
		this.splitView = new SplitView(containerElement, { orientation: Orientation.HORIZONTAL });

		const { historyVisible, showRevealLocationOnMessages } = this.options;
		const isInPeekView = this.editor !== undefined;
		const layout = getTestingConfiguration(this.configurationService, TestingConfigKeys.ResultsViewLayout);
		this.isTreeLeft = layout === TestingResultsViewLayout.TreeLeft;
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TestingConfigKeys.ResultsViewLayout)) {
				const newLayout = getTestingConfiguration(this.configurationService, TestingConfigKeys.ResultsViewLayout);
				const newIsTreeLeft = newLayout === TestingResultsViewLayout.TreeLeft;
				if (newIsTreeLeft !== this.isTreeLeft) {
					this.isTreeLeft = newIsTreeLeft;
					this.swapViews();
				}
			}
		}));

		const messageContainer = this.messageContainer = dom.$('.test-output-peek-message-container');
		this.stackContainer = dom.append(containerElement, dom.$('.test-output-call-stack-container'));
		this.callStackWidget = this._register(this.instantiationService.createInstance(CallStackWidget, this.stackContainer, this.editor));
		this.followupWidget = this._register(this.instantiationService.createInstance(FollowupActionWidget, this.editor));
		this.onCloseEmitter.input = this.followupWidget.onClose;

		this.contentProviders = [
			this._register(this.instantiationService.createInstance(DiffContentProvider, this.editor, messageContainer)),
			this._register(this.instantiationService.createInstance(MarkdownTestMessagePeek, messageContainer)),
			this._register(this.instantiationService.createInstance(TerminalMessagePeek, messageContainer, isInPeekView)),
			this._register(this.instantiationService.createInstance(PlainTextMessagePeek, this.editor, messageContainer)),
		];

		this.messageContextKeyService = this._register(this.contextKeyService.createScoped(containerElement));
		this.contextKeyTestMessage = TestingContextKeys.testMessageContext.bindTo(this.messageContextKeyService);
		this.contextKeyResultOutdated = TestingContextKeys.testResultOutdated.bindTo(this.messageContextKeyService);

		const treeContainer = dom.append(containerElement, dom.$('.test-output-peek-tree.testing-stdtree'));
		const tree = this._register(this.instantiationService.createInstance(
			OutputPeekTree,
			treeContainer,
			this.didReveal.event,
			{ showRevealLocationOnMessages, locationForProgress: this.options.locationForProgress },
		));

		this.onDidRequestReveal = tree.onDidRequestReview;

		// Add views in the correct order based on layout setting
		const stackView = {
			onDidChange: Event.None,
			element: this.stackContainer,
			minimumSize: 200,
			maximumSize: Number.MAX_VALUE,
			layout: (width: number) => {
				TestResultsViewContent.lastSplitWidth = width;

				if (this.dimension) {
					this.callStackWidget?.layout(this.dimension.height, width);
					this.layoutContentWidgets(this.dimension, width);
				}
			},
		};

		const treeView = {
			onDidChange: Event.None,
			element: treeContainer,
			minimumSize: 100,
			maximumSize: Number.MAX_VALUE,
			layout: (width: number) => {
				if (this.dimension) {
					tree.layout(this.dimension.height, width);
				}
			},
		};

		this.splitView.addView(stackView, Sizing.Distribute);
		this.splitView.addView(treeView, Sizing.Distribute);
		if (this.isTreeLeft) {
			this.swapViews();
		}

		// Configure visibility for the tree view
		this.splitView.setViewVisible(this.historyViewIndex, historyVisible.value);
		this._register(historyVisible.onDidChange(visible => {
			this.splitView.setViewVisible(this.historyViewIndex, visible);
		}));

		if (initialSpitWidth) {
			queueMicrotask(() => this.splitView.resizeView(this.diffViewIndex, initialSpitWidth));
		}
	}

	/**
	 * Shows a message in-place without showing or changing the peek location.
	 * This is mostly used if peeking a message without a location.
	 */
	public reveal(opts: {
		subject: InspectSubject;
		preserveFocus: boolean;
	}) {
		this.didReveal.fire(opts);

		if (this.current && equalsSubject(this.current, opts.subject)) {
			return Promise.resolve();
		}

		this.current = opts.subject;
		return this.contentProvidersUpdateLimiter.queue(async () => {
			this.currentSubjectStore.clear();
			const callFrames = this.getCallFrames(opts.subject) || [];
			const topFrame = await this.prepareTopFrame(opts.subject, callFrames);
			this.setCallStackFrames(topFrame, callFrames);

			this.followupWidget.show(opts.subject);
			this.populateFloatingClick(opts.subject);
		});
	}

	private setCallStackFrames(messageFrame: AnyStackFrame, stack: ITestMessageStackFrame[]) {
		this.callStackWidget.setFrames([messageFrame, ...stack.map(frame => new CallStackFrame(
			frame.label,
			frame.uri,
			frame.position?.lineNumber,
			frame.position?.column,
		))]);
	}

	/**
	 * Collapses all displayed stack frames.
	 */
	public collapseStack() {
		this.callStackWidget.collapseAll();
	}

	private getCallFrames(subject: InspectSubject) {
		if (!(subject instanceof MessageSubject)) {
			return undefined;
		}
		const frames = subject.stack;
		if (!frames?.length || !this.editor) {
			return frames;
		}

		// If the test extension just sets the top frame as the same location
		// where the message is displayed, in the case of a peek in an editor,
		// don't show it again because it's just a duplicate
		const topFrame = frames[0];
		const peekLocation = subject.revealLocation;
		const isTopFrameSame = peekLocation && topFrame.position && topFrame.uri
			&& topFrame.position.lineNumber === peekLocation.range.startLineNumber
			&& topFrame.position.column === peekLocation.range.startColumn
			&& this.uriIdentityService.extUri.isEqual(topFrame.uri, peekLocation.uri);

		return isTopFrameSame ? frames.slice(1) : frames;
	}

	private async prepareTopFrame(subject: InspectSubject, callFrames: ITestMessageStackFrame[]) {
		// ensure the messageContainer is in the DOM so renderers can calculate the
		// dimensions before it's rendered in the list.
		this.messageContainer.style.visibility = 'hidden';
		this.stackContainer.appendChild(this.messageContainer);

		const topFrame = this.currentTopFrame = this.instantiationService.createInstance(MessageStackFrame, this.messageContainer, this.followupWidget, subject);

		const hasMultipleFrames = callFrames.length > 0;
		topFrame.showHeader.set(hasMultipleFrames, undefined);

		const provider = await findAsync(this.contentProviders, p => p.update(subject));
		if (provider) {
			const width = this.splitView.getViewSize(this.diffViewIndex);
			if (width !== -1 && this.dimension) {
				topFrame.height.set(provider.layout({ width, height: this.dimension?.height }, hasMultipleFrames)!, undefined);
			}

			if (provider.onScrolled) {
				this.currentSubjectStore.add(this.callStackWidget.onDidScroll(evt => {
					provider.onScrolled!(evt);
				}));
			}

			if (provider.onDidContentSizeChange) {
				this.currentSubjectStore.add(provider.onDidContentSizeChange(() => {
					const width = this.splitView.getViewSize(this.diffViewIndex);
					if (this.dimension && !this.isDoingLayoutUpdate && width !== -1) {
						this.isDoingLayoutUpdate = true;
						topFrame.height.set(provider.layout({ width, height: this.dimension.height }, hasMultipleFrames)!, undefined);
						this.isDoingLayoutUpdate = false;
					}
				}));
			}
		}

		return topFrame;
	}

	private layoutContentWidgets(dimension: dom.Dimension, width = this.splitView.getViewSize(this.diffViewIndex)) {
		this.isDoingLayoutUpdate = true;
		for (const provider of this.contentProviders) {
			const frameHeight = provider.layout({ height: dimension.height, width }, !!this.currentTopFrame?.showHeader.get());
			if (frameHeight) {
				this.currentTopFrame?.height.set(frameHeight, undefined);
			}
		}
		this.isDoingLayoutUpdate = false;
	}

	private populateFloatingClick(subject: InspectSubject) {
		if (!(subject instanceof MessageSubject)) {
			return;
		}

		this.currentSubjectStore.add(toDisposable(() => {
			this.contextKeyResultOutdated.reset();
			this.contextKeyTestMessage.reset();
		}));

		this.contextKeyTestMessage.set(subject.contextValue || '');
		if (subject.result instanceof LiveTestResult) {
			this.contextKeyResultOutdated.set(subject.result.getStateById(subject.test.extId)?.retired ?? false);
			this.currentSubjectStore.add(subject.result.onChange(ev => {
				if (ev.item.item.extId === subject.test.extId) {
					this.contextKeyResultOutdated.set(ev.item.retired ?? false);
				}
			}));
		} else {
			this.contextKeyResultOutdated.set(true);
		}

		const instaService = this.currentSubjectStore.add(this.instantiationService
			.createChild(new ServiceCollection([IContextKeyService, this.messageContextKeyService])));

		this.currentSubjectStore.add(instaService.createInstance(FloatingClickMenu, {
			container: this.messageContainer,
			menuId: MenuId.TestMessageContent,
			getActionArg: () => (subject as MessageSubject).context,
		}));
	}

	public onLayoutBody(height: number, width: number) {
		this.dimension = new dom.Dimension(width, height);
		this.splitView.layout(width);
	}

	public onWidth(width: number) {
		this.splitView.layout(width);
	}


}

const FOLLOWUP_ANIMATION_MIN_TIME = 500;

class FollowupActionWidget extends Disposable {
	private readonly el = dom.h('div.testing-followup-action', []);
	private readonly visibleStore = this._register(new DisposableStore());
	private readonly onCloseEmitter = this._register(new Emitter<void>());
	public readonly onClose = this.onCloseEmitter.event;

	public get domNode() {
		return this.el.root;
	}

	constructor(
		private readonly editor: ICodeEditor | undefined,
		@ITestService private readonly testService: ITestService,
		@IQuickInputService private readonly quickInput: IQuickInputService,
	) {
		super();
	}

	public show(subject: InspectSubject) {
		this.visibleStore.clear();
		if (subject instanceof MessageSubject) {
			this.showMessage(subject);
		}
	}

	private async showMessage(subject: MessageSubject) {
		const cts = this.visibleStore.add(new CancellationTokenSource());
		const start = Date.now();

		// Wait for completion otherwise results will not be available to the ext host:
		if (subject.result instanceof LiveTestResult && !subject.result.completedAt) {
			await new Promise(r => Event.once((subject.result as LiveTestResult).onComplete)(r));
		}

		const followups = await this.testService.provideTestFollowups({
			extId: subject.test.extId,
			messageIndex: subject.messageIndex,
			resultId: subject.result.id,
			taskIndex: subject.taskIndex,
		}, cts.token);


		if (!followups.followups.length || cts.token.isCancellationRequested) {
			followups.dispose();
			return;
		}

		this.visibleStore.add(followups);

		dom.clearNode(this.el.root);
		this.el.root.classList.toggle('animated', Date.now() - start > FOLLOWUP_ANIMATION_MIN_TIME);

		this.el.root.appendChild(this.makeFollowupLink(followups.followups[0]));
		if (followups.followups.length > 1) {
			this.el.root.appendChild(this.makeMoreLink(followups.followups));
		}

		this.visibleStore.add(toDisposable(() => {
			this.el.root.remove();
		}));
	}

	private makeFollowupLink(first: ITestFollowup) {
		const link = this.makeLink(() => this.actionFollowup(link, first));
		dom.reset(link, ...renderLabelWithIcons(first.message));
		return link;
	}

	private makeMoreLink(followups: ITestFollowup[]) {
		const link = this.makeLink(() =>
			this.quickInput.pick(followups.map((f, i) => ({
				label: f.message,
				index: i
			}))).then(picked => {
				if (picked?.length) {
					followups[picked[0].index].execute();
				}
			})
		);

		link.innerText = localize('testFollowup.more', '+{0} More...', followups.length - 1);
		return link;
	}

	private makeLink(onClick: () => void) {
		const link = document.createElement('a');
		link.tabIndex = 0;
		this.visibleStore.add(dom.addDisposableListener(link, 'click', onClick));
		this.visibleStore.add(dom.addDisposableListener(link, 'keydown', e => {
			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.Space) || event.equals(KeyCode.Enter)) {
				onClick();
			}
		}));

		return link;
	}

	private actionFollowup(link: HTMLAnchorElement, fu: ITestFollowup) {
		if (link.ariaDisabled !== 'true') {
			link.ariaDisabled = 'true';
			fu.execute();

			if (this.editor) {
				this.onCloseEmitter.fire();
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/configuration.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/configuration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { observableFromEvent } from '../../../../base/common/observable.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IConfigurationNode } from '../../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ConfigurationKeyValuePairs, Extensions, IConfigurationMigrationRegistry } from '../../../common/configuration.js';

export const enum TestingConfigKeys {
	AutoOpenPeekView = 'testing.automaticallyOpenPeekView',
	AutoOpenPeekViewDuringContinuousRun = 'testing.automaticallyOpenPeekViewDuringAutoRun',
	OpenResults = 'testing.automaticallyOpenTestResults',
	FollowRunningTest = 'testing.followRunningTest',
	DefaultGutterClickAction = 'testing.defaultGutterClickAction',
	GutterEnabled = 'testing.gutterEnabled',
	SaveBeforeTest = 'testing.saveBeforeTest',
	AlwaysRevealTestOnStateChange = 'testing.alwaysRevealTestOnStateChange',
	CountBadge = 'testing.countBadge',
	ShowAllMessages = 'testing.showAllMessages',
	CoveragePercent = 'testing.displayedCoveragePercent',
	ShowCoverageInExplorer = 'testing.showCoverageInExplorer',
	CoverageBarThresholds = 'testing.coverageBarThresholds',
	CoverageToolbarEnabled = 'testing.coverageToolbarEnabled',
	ResultsViewLayout = 'testing.resultsView.layout',
}

export const enum AutoOpenTesting {
	NeverOpen = 'neverOpen',
	OpenOnTestStart = 'openOnTestStart',
	OpenOnTestFailure = 'openOnTestFailure',
	OpenExplorerOnTestStart = 'openExplorerOnTestStart',
}

export const enum AutoOpenPeekViewWhen {
	FailureVisible = 'failureInVisibleDocument',
	FailureAnywhere = 'failureAnywhere',
	Never = 'never',
}

export const enum DefaultGutterClickAction {
	Run = 'run',
	Debug = 'debug',
	Coverage = 'runWithCoverage',
	ContextMenu = 'contextMenu',
}

export const enum TestingCountBadge {
	Failed = 'failed',
	Off = 'off',
	Passed = 'passed',
	Skipped = 'skipped',
}

export const enum TestingDisplayedCoveragePercent {
	TotalCoverage = 'totalCoverage',
	Statement = 'statement',
	Minimum = 'minimum',
}

export const enum TestingResultsViewLayout {
	TreeLeft = 'treeLeft',
	TreeRight = 'treeRight',
}

export const testingConfiguration: IConfigurationNode = {
	id: 'testing',
	order: 21,
	title: localize('testConfigurationTitle', "Testing"),
	type: 'object',
	properties: {
		[TestingConfigKeys.AutoOpenPeekView]: {
			description: localize('testing.automaticallyOpenPeekView', "Configures when the error Peek view is automatically opened."),
			enum: [
				AutoOpenPeekViewWhen.FailureAnywhere,
				AutoOpenPeekViewWhen.FailureVisible,
				AutoOpenPeekViewWhen.Never,
			],
			default: AutoOpenPeekViewWhen.Never,
			enumDescriptions: [
				localize('testing.automaticallyOpenPeekView.failureAnywhere', "Open automatically no matter where the failure is."),
				localize('testing.automaticallyOpenPeekView.failureInVisibleDocument', "Open automatically when a test fails in a visible document."),
				localize('testing.automaticallyOpenPeekView.never', "Never automatically open."),
			],
		},
		[TestingConfigKeys.ShowAllMessages]: {
			description: localize('testing.showAllMessages', "Controls whether to show messages from all test runs."),
			type: 'boolean',
			default: false,
		},
		[TestingConfigKeys.AutoOpenPeekViewDuringContinuousRun]: {
			description: localize('testing.automaticallyOpenPeekViewDuringContinuousRun', "Controls whether to automatically open the Peek view during continuous run mode."),
			type: 'boolean',
			default: false,
		},
		[TestingConfigKeys.CountBadge]: {
			description: localize('testing.countBadge', 'Controls the count badge on the Testing icon on the Activity Bar.'),
			enum: [
				TestingCountBadge.Failed,
				TestingCountBadge.Off,
				TestingCountBadge.Passed,
				TestingCountBadge.Skipped,
			],
			enumDescriptions: [
				localize('testing.countBadge.failed', 'Show the number of failed tests'),
				localize('testing.countBadge.off', 'Disable the testing count badge'),
				localize('testing.countBadge.passed', 'Show the number of passed tests'),
				localize('testing.countBadge.skipped', 'Show the number of skipped tests'),
			],
			default: TestingCountBadge.Failed,
		},
		[TestingConfigKeys.FollowRunningTest]: {
			description: localize('testing.followRunningTest', 'Controls whether the running test should be followed in the Test Explorer view.'),
			type: 'boolean',
			default: false,
		},
		[TestingConfigKeys.DefaultGutterClickAction]: {
			description: localize('testing.defaultGutterClickAction', 'Controls the action to take when left-clicking on a test decoration in the gutter.'),
			enum: [
				DefaultGutterClickAction.Run,
				DefaultGutterClickAction.Debug,
				DefaultGutterClickAction.Coverage,
				DefaultGutterClickAction.ContextMenu,
			],
			enumDescriptions: [
				localize('testing.defaultGutterClickAction.run', 'Run the test.'),
				localize('testing.defaultGutterClickAction.debug', 'Debug the test.'),
				localize('testing.defaultGutterClickAction.coverage', 'Run the test with coverage.'),
				localize('testing.defaultGutterClickAction.contextMenu', 'Open the context menu for more options.'),
			],
			default: DefaultGutterClickAction.Run,
		},
		[TestingConfigKeys.GutterEnabled]: {
			description: localize('testing.gutterEnabled', 'Controls whether test decorations are shown in the editor gutter.'),
			type: 'boolean',
			default: true,
		},
		[TestingConfigKeys.SaveBeforeTest]: {
			description: localize('testing.saveBeforeTest', 'Control whether save all dirty editors before running a test.'),
			type: 'boolean',
			default: true,
		},
		[TestingConfigKeys.OpenResults]: {
			enum: [
				AutoOpenTesting.NeverOpen,
				AutoOpenTesting.OpenOnTestStart,
				AutoOpenTesting.OpenOnTestFailure,
				AutoOpenTesting.OpenExplorerOnTestStart,
			],
			enumDescriptions: [
				localize('testing.openTesting.neverOpen', 'Never automatically open the testing views'),
				localize('testing.openTesting.openOnTestStart', 'Open the test results view when tests start'),
				localize('testing.openTesting.openOnTestFailure', 'Open the test result view on any test failure'),
				localize('testing.openTesting.openExplorerOnTestStart', 'Open the test explorer when tests start'),
			],
			default: 'openOnTestStart',
			description: localize('testing.openTesting', "Controls when the testing view should open.")
		},
		[TestingConfigKeys.AlwaysRevealTestOnStateChange]: {
			markdownDescription: localize('testing.alwaysRevealTestOnStateChange', "Always reveal the executed test when {0} is on. If this setting is turned off, only failed tests will be revealed.", '`#testing.followRunningTest#`'),
			type: 'boolean',
			default: false,
		},
		[TestingConfigKeys.ShowCoverageInExplorer]: {
			description: localize('testing.ShowCoverageInExplorer', "Whether test coverage should be down in the File Explorer view."),
			type: 'boolean',
			default: true,
		},
		[TestingConfigKeys.CoveragePercent]: {
			markdownDescription: localize('testing.displayedCoveragePercent', "Configures what percentage is displayed by default for test coverage."),
			default: TestingDisplayedCoveragePercent.TotalCoverage,
			enum: [
				TestingDisplayedCoveragePercent.TotalCoverage,
				TestingDisplayedCoveragePercent.Statement,
				TestingDisplayedCoveragePercent.Minimum,
			],
			enumDescriptions: [
				localize('testing.displayedCoveragePercent.totalCoverage', 'A calculation of the combined statement, function, and branch coverage.'),
				localize('testing.displayedCoveragePercent.statement', 'The statement coverage.'),
				localize('testing.displayedCoveragePercent.minimum', 'The minimum of statement, function, and branch coverage.'),
			],
		},
		[TestingConfigKeys.CoverageBarThresholds]: {
			markdownDescription: localize('testing.coverageBarThresholds', "Configures the colors used for percentages in test coverage bars."),
			default: { red: 0, yellow: 60, green: 90 },
			properties: {
				red: { type: 'number', minimum: 0, maximum: 100, default: 0 },
				yellow: { type: 'number', minimum: 0, maximum: 100, default: 60 },
				green: { type: 'number', minimum: 0, maximum: 100, default: 90 },
			},
		},
		[TestingConfigKeys.CoverageToolbarEnabled]: {
			description: localize('testing.coverageToolbarEnabled', 'Controls whether the coverage toolbar is shown in the editor.'),
			type: 'boolean',
			default: false, // todo@connor4312: disabled by default until UI sync
		},
		[TestingConfigKeys.ResultsViewLayout]: {
			description: localize('testing.resultsView.layout', 'Controls the layout of the Test Results view.'),
			enum: [
				TestingResultsViewLayout.TreeRight,
				TestingResultsViewLayout.TreeLeft,
			],
			enumDescriptions: [
				localize('testing.resultsView.layout.treeRight', 'Show the test run tree on the right side with details on the left.'),
				localize('testing.resultsView.layout.treeLeft', 'Show the test run tree on the left side with details on the right.'),
			],
			default: TestingResultsViewLayout.TreeRight,
		},
	}
};

Registry.as<IConfigurationMigrationRegistry>(Extensions.ConfigurationMigration)
	.registerConfigurationMigrations([{
		key: 'testing.openTesting',
		migrateFn: (value: AutoOpenTesting): ConfigurationKeyValuePairs => {
			return [[TestingConfigKeys.OpenResults, { value }]];
		}
	}, {
		key: 'testing.automaticallyOpenResults', // insiders only during 1.96, remove after 1.97
		migrateFn: (value: AutoOpenTesting): ConfigurationKeyValuePairs => {
			return [[TestingConfigKeys.OpenResults, { value }]];
		}
	}]);

export interface ITestingCoverageBarThresholds {
	red: number;
	green: number;
	yellow: number;
}

export interface ITestingConfiguration {
	[TestingConfigKeys.AutoOpenPeekView]: AutoOpenPeekViewWhen;
	[TestingConfigKeys.AutoOpenPeekViewDuringContinuousRun]: boolean;
	[TestingConfigKeys.CountBadge]: TestingCountBadge;
	[TestingConfigKeys.FollowRunningTest]: boolean;
	[TestingConfigKeys.DefaultGutterClickAction]: DefaultGutterClickAction;
	[TestingConfigKeys.GutterEnabled]: boolean;
	[TestingConfigKeys.SaveBeforeTest]: boolean;
	[TestingConfigKeys.OpenResults]: AutoOpenTesting;
	[TestingConfigKeys.AlwaysRevealTestOnStateChange]: boolean;
	[TestingConfigKeys.ShowAllMessages]: boolean;
	[TestingConfigKeys.CoveragePercent]: TestingDisplayedCoveragePercent;
	[TestingConfigKeys.ShowCoverageInExplorer]: boolean;
	[TestingConfigKeys.CoverageBarThresholds]: ITestingCoverageBarThresholds;
	[TestingConfigKeys.CoverageToolbarEnabled]: boolean;
	[TestingConfigKeys.ResultsViewLayout]: TestingResultsViewLayout;
}

export const getTestingConfiguration = <K extends TestingConfigKeys>(config: IConfigurationService, key: K) => config.getValue<ITestingConfiguration[K]>(key);

export const observeTestingConfiguration = <K extends TestingConfigKeys>(config: IConfigurationService, key: K) => observableFromEvent(config.onDidChangeConfiguration, () =>
	getTestingConfiguration(config, key));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/constants.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/constants.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { stripIcons } from '../../../../base/common/iconLabels.js';
import { localize } from '../../../../nls.js';
import { TestResultState, TestRunProfileBitset } from './testTypes.js';

export const enum Testing {
	// marked as "extension" so that any existing test extensions are assigned to it.
	ViewletId = 'workbench.view.extension.test',
	ExplorerViewId = 'workbench.view.testing',
	OutputPeekContributionId = 'editor.contrib.testingOutputPeek',
	DecorationsContributionId = 'editor.contrib.testingDecorations',
	CoverageDecorationsContributionId = 'editor.contrib.coverageDecorations',
	CoverageViewId = 'workbench.view.testCoverage',

	ResultsPanelId = 'workbench.panel.testResults',
	ResultsViewId = 'workbench.panel.testResults.view',

	MessageLanguageId = 'vscodeInternalTestMessage'
}

export const enum TestExplorerViewMode {
	List = 'list',
	Tree = 'true'
}

export const enum TestExplorerViewSorting {
	ByLocation = 'location',
	ByStatus = 'status',
	ByDuration = 'duration',
}

const testStateNames: { [K in TestResultState]: string } = {
	[TestResultState.Errored]: localize('testState.errored', 'Errored'),
	[TestResultState.Failed]: localize('testState.failed', 'Failed'),
	[TestResultState.Passed]: localize('testState.passed', 'Passed'),
	[TestResultState.Queued]: localize('testState.queued', 'Queued'),
	[TestResultState.Running]: localize('testState.running', 'Running'),
	[TestResultState.Skipped]: localize('testState.skipped', 'Skipped'),
	[TestResultState.Unset]: localize('testState.unset', 'Not yet run'),
};

export const labelForTestInState = (label: string, state: TestResultState) => localize({
	key: 'testing.treeElementLabel',
	comment: ['label then the unit tests state, for example "Addition Tests (Running)"'],
}, '{0} ({1})', stripIcons(label), testStateNames[state]);

export const testConfigurationGroupNames: Partial<Record<TestRunProfileBitset, string | undefined>> = {
	[TestRunProfileBitset.Debug]: localize('testGroup.debug', 'Debug'),
	[TestRunProfileBitset.Run]: localize('testGroup.run', 'Run'),
	[TestRunProfileBitset.Coverage]: localize('testGroup.coverage', 'Coverage'),
};

export const enum TestCommandId {
	CancelTestRefreshAction = 'testing.cancelTestRefresh',
	CancelTestRunAction = 'testing.cancelRun',
	ClearTestResultsAction = 'testing.clearTestResults',
	CollapseAllAction = 'testing.collapseAll',
	ConfigureTestProfilesAction = 'testing.configureProfile',
	ContinousRunUsingForTest = 'testing.continuousRunUsingForTest',
	CoverageAtCursor = 'testing.coverageAtCursor',
	CoverageByUri = 'testing.coverage.uri',
	CoverageClear = 'testing.coverage.close',
	CoverageCurrentFile = 'testing.coverageCurrentFile',
	CoverageFilterToTest = 'testing.coverageFilterToTest',
	CoverageFilterToTestInEditor = 'testing.coverageFilterToTestInEditor',
	CoverageGoToNextMissedLine = 'testing.coverage.goToNextMissedLine',
	CoverageGoToPreviousMissedLine = 'testing.coverage.goToPreviousMissedLine',
	CoverageLastRun = 'testing.coverageLastRun',
	CoverageSelectedAction = 'testing.coverageSelected',
	CoverageToggleInExplorer = 'testing.toggleCoverageInExplorer',
	CoverageToggleToolbar = 'testing.coverageToggleToolbar',
	CoverageViewChangeSorting = 'testing.coverageViewChangeSorting',
	CoverageViewCollapseAll = 'testing.coverageViewCollapseAll',
	DebugAction = 'testing.debug',
	DebugAllAction = 'testing.debugAll',
	DebugAtCursor = 'testing.debugAtCursor',
	DebugByUri = 'testing.debug.uri',
	DebugCurrentFile = 'testing.debugCurrentFile',
	DebugFailedTests = 'testing.debugFailTests',
	DebugFailedFromLastRun = 'testing.debugFailedFromLastRun',
	DebugLastRun = 'testing.debugLastRun',
	DebugSelectedAction = 'testing.debugSelected',
	FilterAction = 'workbench.actions.treeView.testExplorer.filter',
	GetExplorerSelection = '_testing.getExplorerSelection',
	GetSelectedProfiles = 'testing.getSelectedProfiles',
	GoToTest = 'testing.editFocusedTest',
	GoToRelatedTest = 'testing.goToRelatedTest',
	PeekRelatedTest = 'testing.peekRelatedTest',
	GoToRelatedCode = 'testing.goToRelatedCode',
	PeekRelatedCode = 'testing.peekRelatedCode',
	HideTestAction = 'testing.hideTest',
	OpenCoverage = 'testing.openCoverage',
	OpenOutputPeek = 'testing.openOutputPeek',
	RefreshTestsAction = 'testing.refreshTests',
	ReRunFailedTests = 'testing.reRunFailTests',
	ReRunFailedFromLastRun = 'testing.reRunFailedFromLastRun',
	ReRunLastRun = 'testing.reRunLastRun',
	RunAction = 'testing.run',
	RunAllAction = 'testing.runAll',
	RunAllWithCoverageAction = 'testing.coverageAll',
	RunAtCursor = 'testing.runAtCursor',
	RunByUri = 'testing.run.uri',
	RunCurrentFile = 'testing.runCurrentFile',
	RunSelectedAction = 'testing.runSelected',
	RunUsingProfileAction = 'testing.runUsing',
	RunWithCoverageAction = 'testing.coverage',
	SearchForTestExtension = 'testing.searchForTestExtension',
	SelectDefaultTestProfiles = 'testing.selectDefaultTestProfiles',
	ShowMostRecentOutputAction = 'testing.showMostRecentOutput',
	StartContinousRun = 'testing.startContinuousRun',
	StartContinousRunFromExtension = 'testing.startContinuousRunFromExtension',
	StopContinousRunFromExtension = 'testing.stopContinuousRunFromExtension',
	StopContinousRun = 'testing.stopContinuousRun',
	TestingSortByDurationAction = 'testing.sortByDuration',
	TestingSortByLocationAction = 'testing.sortByLocation',
	TestingSortByStatusAction = 'testing.sortByStatus',
	TestingViewAsListAction = 'testing.viewAsList',
	TestingViewAsTreeAction = 'testing.viewAsTree',
	ToggleContinousRunForTest = 'testing.toggleContinuousRunForTest',
	ToggleResultsViewLayoutAction = 'testing.toggleResultsViewLayout',
	ToggleInlineTestOutput = 'testing.toggleInlineTestOutput',
	UnhideAllTestsAction = 'testing.unhideAllTests',
	UnhideTestAction = 'testing.unhideTest',
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/getComputedState.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/getComputedState.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Iterable } from '../../../../base/common/iterator.js';
import { TestResultState } from './testTypes.js';
import { makeEmptyCounts, maxPriority, statePriority } from './testingStates.js';

/**
 * Accessor for nodes in get and refresh computed state.
 */
export interface IComputedStateAccessor<T> {
	getOwnState(item: T): TestResultState | undefined;
	getCurrentComputedState(item: T): TestResultState;
	setComputedState(item: T, state: TestResultState): void;
	getChildren(item: T): Iterable<T>;
	getParents(item: T): Iterable<T>;
}

export interface IComputedStateAndDurationAccessor<T> extends IComputedStateAccessor<T> {
	getOwnDuration(item: T): number | undefined;
	getCurrentComputedDuration(item: T): number | undefined;
	setComputedDuration(item: T, duration: number | undefined): void;
}

const isDurationAccessor = <T>(accessor: IComputedStateAccessor<T>): accessor is IComputedStateAndDurationAccessor<T> => 'getOwnDuration' in accessor;

/**
 * Gets the computed state for the node.
 * @param force whether to refresh the computed state for this node, even
 * if it was previously set.
 */

const getComputedState = <T extends object>(accessor: IComputedStateAccessor<T>, node: T, force = false) => {
	let computed = accessor.getCurrentComputedState(node);
	if (computed === undefined || force) {
		computed = accessor.getOwnState(node) ?? TestResultState.Unset;

		let childrenCount = 0;
		const stateMap = makeEmptyCounts();

		for (const child of accessor.getChildren(node)) {
			const childComputed = getComputedState(accessor, child);
			childrenCount++;
			stateMap[childComputed]++;

			// If all children are skipped, make the current state skipped too if unset (#131537)
			computed = childComputed === TestResultState.Skipped && computed === TestResultState.Unset
				? TestResultState.Skipped : maxPriority(computed, childComputed);
		}

		if (childrenCount > LARGE_NODE_THRESHOLD) {
			largeNodeChildrenStates.set(node, stateMap);
		}

		accessor.setComputedState(node, computed);
	}

	return computed;
};

const getComputedDuration = <T>(accessor: IComputedStateAndDurationAccessor<T>, node: T, force = false): number | undefined => {
	let computed = accessor.getCurrentComputedDuration(node);
	if (computed === undefined || force) {
		const own = accessor.getOwnDuration(node);
		if (own !== undefined) {
			computed = own;
		} else {
			computed = undefined;
			for (const child of accessor.getChildren(node)) {
				const d = getComputedDuration(accessor, child);
				if (d !== undefined) {
					computed = (computed || 0) + d;
				}
			}
		}

		accessor.setComputedDuration(node, computed);
	}

	return computed;
};

const LARGE_NODE_THRESHOLD = 64;

/**
 * Map of how many nodes have in each state. This is used to optimize state
 * computation in large nodes with children above the `LARGE_NODE_THRESHOLD`.
 */
const largeNodeChildrenStates = new WeakMap<object, { [K in TestResultState]: number }>();

/**
 * Refreshes the computed state for the node and its parents. Any changes
 * elements cause `addUpdated` to be called.
 */
export const refreshComputedState = <T extends object>(
	accessor: IComputedStateAccessor<T>,
	node: T,
	explicitNewComputedState?: TestResultState,
	refreshDuration = true,
) => {
	const oldState = accessor.getCurrentComputedState(node);
	const oldPriority = statePriority[oldState];
	const newState = explicitNewComputedState ?? getComputedState(accessor, node, true);
	const newPriority = statePriority[newState];
	const toUpdate = new Set<T>();

	if (newPriority !== oldPriority) {
		accessor.setComputedState(node, newState);
		toUpdate.add(node);

		let moveFromState = oldState;
		let moveToState = newState;

		for (const parent of accessor.getParents(node)) {
			const lnm = largeNodeChildrenStates.get(parent);
			if (lnm) {
				lnm[moveFromState]--;
				lnm[moveToState]++;
			}

			const prev = accessor.getCurrentComputedState(parent);
			if (newPriority > oldPriority) {
				// Update all parents to ensure they're at least this priority.
				if (prev !== undefined && statePriority[prev] >= newPriority) {
					break;
				}

				if (lnm && lnm[moveToState] > 1) {
					break;
				}

				// moveToState remains the same, the new higher priority node state
				accessor.setComputedState(parent, newState);
				toUpdate.add(parent);
			} else /* newProirity < oldPriority */ {
				// Update all parts whose statese might have been based on this one
				if (prev === undefined || statePriority[prev] > oldPriority) {
					break;
				}

				if (lnm && lnm[moveFromState] > 0) {
					break;
				}

				moveToState = getComputedState(accessor, parent, true);
				accessor.setComputedState(parent, moveToState);
				toUpdate.add(parent);
			}

			moveFromState = prev;
		}
	}

	if (isDurationAccessor(accessor) && refreshDuration) {
		for (const parent of Iterable.concat(Iterable.single(node), accessor.getParents(node))) {
			const oldDuration = accessor.getCurrentComputedDuration(parent);
			const newDuration = getComputedDuration(accessor, parent, true);
			if (oldDuration === newDuration) {
				break;
			}

			accessor.setComputedDuration(parent, newDuration);
			toUpdate.add(parent);
		}
	}

	return toUpdate;
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/mainThreadTestCollection.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/mainThreadTestCollection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { LinkedList } from '../../../../base/common/linkedList.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { URI } from '../../../../base/common/uri.js';
import { IMainThreadTestCollection } from './testService.js';
import { AbstractIncrementalTestCollection, ITestUriCanonicalizer, IncrementalChangeCollector, IncrementalTestCollectionItem, InternalTestItem, TestDiffOpType, TestsDiff } from './testTypes.js';

export class MainThreadTestCollection extends AbstractIncrementalTestCollection<IncrementalTestCollectionItem> implements IMainThreadTestCollection {
	private testsByUrl = new ResourceMap<Set<IncrementalTestCollectionItem>>();

	private busyProvidersChangeEmitter = new Emitter<number>();
	private expandPromises = new WeakMap<IncrementalTestCollectionItem, {
		pendingLvl: number;
		doneLvl: number;
		prom: Promise<void>;
	}>();

	/**
	 * @inheritdoc
	 */
	public get busyProviders() {
		return this.busyControllerCount;
	}

	/**
	 * @inheritdoc
	 */
	public get rootItems() {
		return this.roots;
	}

	/**
	 * @inheritdoc
	 */
	public get all() {
		return this.getIterator();
	}

	public get rootIds() {
		return Iterable.map(this.roots.values(), r => r.item.extId);
	}

	public readonly onBusyProvidersChange = this.busyProvidersChangeEmitter.event;

	constructor(uriIdentityService: ITestUriCanonicalizer, private readonly expandActual: (id: string, levels: number) => Promise<void>) {
		super(uriIdentityService);
	}

	/**
	 * @inheritdoc
	 */
	public expand(testId: string, levels: number): Promise<void> {
		const test = this.items.get(testId);
		if (!test) {
			return Promise.resolve();
		}

		// simple cache to avoid duplicate/unnecessary expansion calls
		const existing = this.expandPromises.get(test);
		if (existing && existing.pendingLvl >= levels) {
			return existing.prom;
		}

		const prom = this.expandActual(test.item.extId, levels);
		const record = { doneLvl: existing ? existing.doneLvl : -1, pendingLvl: levels, prom };
		this.expandPromises.set(test, record);

		return prom.then(() => {
			record.doneLvl = levels;
		});
	}

	/**
	 * @inheritdoc
	 */
	public getNodeById(id: string) {
		return this.items.get(id);
	}

	/**
	 * @inheritdoc
	 */
	public getNodeByUrl(uri: URI): Iterable<IncrementalTestCollectionItem> {
		return this.testsByUrl.get(uri) || Iterable.empty();
	}

	/**
	 * @inheritdoc
	 */
	public getReviverDiff() {
		const ops: TestsDiff = [{ op: TestDiffOpType.IncrementPendingExtHosts, amount: this.pendingRootCount }];

		const queue = [this.rootIds];
		while (queue.length) {
			for (const child of queue.pop()!) {
				const item = this.items.get(child)!;
				ops.push({
					op: TestDiffOpType.Add,
					item: {
						controllerId: item.controllerId,
						expand: item.expand,
						item: item.item,
					}
				});
				queue.push(item.children);
			}
		}

		return ops;
	}

	/**
	 * Applies the diff to the collection.
	 */
	public override apply(diff: TestsDiff) {
		const prevBusy = this.busyControllerCount;
		super.apply(diff);

		if (prevBusy !== this.busyControllerCount) {
			this.busyProvidersChangeEmitter.fire(this.busyControllerCount);
		}
	}

	/**
	 * Clears everything from the collection, and returns a diff that applies
	 * that action.
	 */
	public clear() {
		const ops: TestsDiff = [];
		for (const root of this.roots) {
			ops.push({ op: TestDiffOpType.Remove, itemId: root.item.extId });
		}

		this.roots.clear();
		this.items.clear();

		return ops;
	}

	/**
	 * @override
	 */
	protected createItem(internal: InternalTestItem): IncrementalTestCollectionItem {
		return { ...internal, children: new Set() };
	}

	private readonly changeCollector: IncrementalChangeCollector<IncrementalTestCollectionItem> = {
		add: node => {
			if (!node.item.uri) {
				return;
			}

			const s = this.testsByUrl.get(node.item.uri);
			if (!s) {
				this.testsByUrl.set(node.item.uri, new Set([node]));
			} else {
				s.add(node);
			}
		},
		remove: node => {
			if (!node.item.uri) {
				return;
			}

			const s = this.testsByUrl.get(node.item.uri);
			if (!s) {
				return;
			}

			s.delete(node);
			if (s.size === 0) {
				this.testsByUrl.delete(node.item.uri);
			}
		},
	};

	protected override createChangeCollector(): IncrementalChangeCollector<IncrementalTestCollectionItem> {
		return this.changeCollector;
	}

	private *getIterator() {
		const queue = new LinkedList<Iterable<string>>();
		queue.push(this.rootIds);

		while (queue.size > 0) {
			for (const id of queue.pop()!) {
				const node = this.getNodeById(id)!;
				yield node;
				queue.push(node.children);
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/observableUtils.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/observableUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../base/common/lifecycle.js';
import { IObservableWithChange, IObserver } from '../../../../base/common/observable.js';

export function onObservableChange<T>(observable: IObservableWithChange<unknown, T>, callback: (value: T) => void): IDisposable {
	const o: IObserver = {
		beginUpdate() { },
		endUpdate() { },
		handlePossibleChange(observable) {
			observable.reportChanges();
		},
		handleChange<T2, TChange>(_observable: IObservableWithChange<T2, TChange>, change: TChange) {
			callback(change as unknown as T);
		}
	};

	observable.addObserver(o);
	return {
		dispose() {
			observable.removeObserver(o);
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/observableValue.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/observableValue.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { StoredValue } from './storedValue.js';

export interface IObservableValue<T> {
	readonly onDidChange: Event<T>;
	readonly value: T;
}

export const staticObservableValue = <T>(value: T): IObservableValue<T> => ({
	onDidChange: Event.None,
	value,
});

export class MutableObservableValue<T> extends Disposable implements IObservableValue<T> {
	private readonly changeEmitter = this._register(new Emitter<T>());

	public readonly onDidChange = this.changeEmitter.event;

	public get value() {
		return this._value;
	}

	public set value(v: T) {
		if (v !== this._value) {
			this._value = v;
			this.changeEmitter.fire(v);
		}
	}

	public static stored<T>(stored: StoredValue<T>, defaultValue: T) {
		const o = new MutableObservableValue(stored.get(defaultValue));
		o._register(stored);
		o._register(o.onDidChange(value => stored.store(value)));
		return o;
	}

	constructor(private _value: T) {
		super();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/storedValue.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/storedValue.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IStorageService, IStorageValueChangeEvent, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';

export interface IStoredValueSerialization<T> {
	deserialize(data: string): T;
	serialize(data: T): string;
}

const defaultSerialization: IStoredValueSerialization<any> = {
	deserialize: d => JSON.parse(d),
	serialize: d => JSON.stringify(d),
};

interface IStoredValueOptions<T> {
	key: string;
	scope: StorageScope;
	target: StorageTarget;
	serialization?: IStoredValueSerialization<T>;
}

/**
 * todo@connor4312: is this worthy to be in common?
 */
export class StoredValue<T> extends Disposable {
	private readonly serialization: IStoredValueSerialization<T>;
	private readonly key: string;
	private readonly scope: StorageScope;
	private readonly target: StorageTarget;
	private value?: T;

	/**
	 * Emitted whenever the value is updated or deleted.
	 */
	public readonly onDidChange: Event<IStorageValueChangeEvent>;

	constructor(
		options: IStoredValueOptions<T>,
		@IStorageService private readonly storage: IStorageService,
	) {
		super();

		this.key = options.key;
		this.scope = options.scope;
		this.target = options.target;
		this.serialization = options.serialization ?? defaultSerialization;
		this.onDidChange = this.storage.onDidChangeValue(this.scope, this.key, this._store);
	}

	/**
	 * Reads the value, returning the undefined if it's not set.
	 */
	public get(): T | undefined;

	/**
	 * Reads the value, returning the default value if it's not set.
	 */
	public get(defaultValue: T): T;

	public get(defaultValue?: T): T | undefined {
		if (this.value === undefined) {
			const value = this.storage.get(this.key, this.scope);
			this.value = value === undefined ? defaultValue : this.serialization.deserialize(value);
		}

		return this.value;
	}

	/**
	 * Persists changes to the value.
	 * @param value
	 */
	public store(value: T) {
		this.value = value;
		this.storage.store(this.key, this.serialization.serialize(value), this.scope, this.target);
	}

	/**
	 * Delete an element stored under the provided key from storage.
	 */
	public delete() {
		this.storage.remove(this.key, this.scope);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testCoverage.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testCoverage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { deepClone } from '../../../../base/common/objects.js';
import { ITransaction, observableSignal } from '../../../../base/common/observable.js';
import { IPrefixTreeNode, WellDefinedPrefixTree } from '../../../../base/common/prefixTree.js';
import { URI } from '../../../../base/common/uri.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { TestId } from './testId.js';
import { LiveTestResult } from './testResult.js';
import { CoverageDetails, DetailType, ICoverageCount, IFileCoverage } from './testTypes.js';

export interface ICoverageAccessor {
	getCoverageDetails: (id: string, testId: string | undefined, token: CancellationToken) => Promise<CoverageDetails[]>;
}

let incId = 0;

/**
 * Class that exposese coverage information for a run.
 */
export class TestCoverage {
	private readonly fileCoverage = new ResourceMap<FileCoverage>();
	public readonly didAddCoverage = observableSignal<IPrefixTreeNode<AbstractFileCoverage>[]>(this);
	public readonly tree = new WellDefinedPrefixTree<AbstractFileCoverage>();
	public readonly associatedData = new Map<unknown, unknown>();

	constructor(
		public readonly result: LiveTestResult,
		public readonly fromTaskId: string,
		private readonly uriIdentityService: IUriIdentityService,
		private readonly accessor: ICoverageAccessor,
	) { }

	/** Gets all test IDs that were included in this test run. */
	public *allPerTestIDs() {
		const seen = new Set<string>();
		for (const root of this.tree.nodes) {
			if (root.value && root.value.perTestData) {
				for (const id of root.value.perTestData) {
					if (!seen.has(id)) {
						seen.add(id);
						yield id;
					}
				}
			}
		}
	}

	public append(coverage: IFileCoverage, tx: ITransaction | undefined) {
		const previous = this.getComputedForUri(coverage.uri);
		const result = this.result;
		const applyDelta = (kind: 'statement' | 'branch' | 'declaration', node: ComputedFileCoverage) => {
			if (!node[kind]) {
				if (coverage[kind]) {
					node[kind] = { ...coverage[kind]! };
				}
			} else {
				node[kind]!.covered += (coverage[kind]?.covered || 0) - (previous?.[kind]?.covered || 0);
				node[kind]!.total += (coverage[kind]?.total || 0) - (previous?.[kind]?.total || 0);
			}
		};

		// We insert using the non-canonical path to normalize for casing differences
		// between URIs, but when inserting an intermediate node always use 'a' canonical
		// version.
		const canonical = [...this.treePathForUri(coverage.uri, /* canonical = */ true)];
		const chain: IPrefixTreeNode<AbstractFileCoverage>[] = [];

		this.tree.mutatePath(this.treePathForUri(coverage.uri, /* canonical = */ false), node => {
			chain.push(node);

			if (chain.length === canonical.length) {
				// we reached our destination node, apply the coverage as necessary:
				if (node.value) {
					const v = node.value;
					// if ID was generated from a test-specific coverage, reassign it to get its real ID in the extension host.
					v.id = coverage.id;
					v.statement = coverage.statement;
					v.branch = coverage.branch;
					v.declaration = coverage.declaration;
				} else {
					const v = node.value = new FileCoverage(coverage, result, this.accessor);
					this.fileCoverage.set(coverage.uri, v);
				}
			} else {
				// Otherwise, if this is not a partial per-test coverage, merge the
				// coverage changes into the chain. Per-test coverages are not complete
				// and we don't want to consider them for computation.
				if (!node.value) {
					// clone because later intersertions can modify the counts:
					const intermediate = deepClone(coverage);
					intermediate.id = String(incId++);
					intermediate.uri = this.treePathToUri(canonical.slice(0, chain.length));
					node.value = new ComputedFileCoverage(intermediate, result);
				} else {
					applyDelta('statement', node.value);
					applyDelta('branch', node.value);
					applyDelta('declaration', node.value);
					node.value.didChange.trigger(tx);
				}
			}

			if (coverage.testIds) {
				node.value!.perTestData ??= new Set();
				for (const id of coverage.testIds) {
					node.value!.perTestData.add(id);
				}
			}
		});

		if (chain) {
			this.didAddCoverage.trigger(tx, chain);
		}
	}

	/**
	 * Builds a new tree filtered to per-test coverage data for the given ID.
	 */
	public filterTreeForTest(testId: TestId) {
		const tree = new WellDefinedPrefixTree<AbstractFileCoverage>();
		for (const node of this.tree.values()) {
			if (node instanceof FileCoverage) {
				if (!node.perTestData?.has(testId.toString())) {
					continue;
				}

				const canonical = [...this.treePathForUri(node.uri, /* canonical = */ true)];
				const chain: IPrefixTreeNode<AbstractFileCoverage>[] = [];
				tree.mutatePath(this.treePathForUri(node.uri, /* canonical = */ false), n => {
					chain.push(n);
					n.value ??= new BypassedFileCoverage(this.treePathToUri(canonical.slice(0, chain.length)), node.fromResult);
				});
			}
		}

		return tree;
	}

	/**
	 * Gets coverage information for all files.
	 */
	public getAllFiles() {
		return this.fileCoverage;
	}

	/**
	 * Gets coverage information for a specific file.
	 */
	public getUri(uri: URI) {
		return this.fileCoverage.get(uri);
	}

	/**
	 * Gets computed information for a file, including DFS-computed information
	 * from child tests.
	 */
	public getComputedForUri(uri: URI) {
		return this.tree.find(this.treePathForUri(uri, /* canonical = */ false));
	}

	private *treePathForUri(uri: URI, canconicalPath: boolean) {
		yield uri.scheme;
		yield uri.authority;

		const path = !canconicalPath && this.uriIdentityService.extUri.ignorePathCasing(uri) ? uri.path.toLowerCase() : uri.path;
		yield* path.split('/');
	}

	private treePathToUri(path: string[]) {
		return URI.from({ scheme: path[0], authority: path[1], path: path.slice(2).join('/') });
	}
}

export const getTotalCoveragePercent = (statement: ICoverageCount, branch: ICoverageCount | undefined, function_: ICoverageCount | undefined) => {
	let numerator = statement.covered;
	let denominator = statement.total;

	if (branch) {
		numerator += branch.covered;
		denominator += branch.total;
	}

	if (function_) {
		numerator += function_.covered;
		denominator += function_.total;
	}

	return denominator === 0 ? 1 : numerator / denominator;
};

export abstract class AbstractFileCoverage {
	public id: string;
	public readonly uri: URI;
	public statement: ICoverageCount;
	public branch?: ICoverageCount;
	public declaration?: ICoverageCount;
	public readonly didChange = observableSignal(this);

	/**
	 * Gets the total coverage percent based on information provided.
	 * This is based on the Clover total coverage formula
	 */
	public get tpc() {
		return getTotalCoveragePercent(this.statement, this.branch, this.declaration);
	}

	/**
	 * Per-test coverage data for this file, if available.
	 */
	public perTestData?: Set<string>;

	constructor(coverage: IFileCoverage, public readonly fromResult: LiveTestResult) {
		this.id = coverage.id;
		this.uri = coverage.uri;
		this.statement = coverage.statement;
		this.branch = coverage.branch;
		this.declaration = coverage.declaration;
	}
}

/**
 * File coverage info computed from children in the tree, not provided by the
 * extension.
 */
export class ComputedFileCoverage extends AbstractFileCoverage { }

/**
 * A virtual node that doesn't have any added coverage info.
 */
export class BypassedFileCoverage extends ComputedFileCoverage {
	constructor(uri: URI, result: LiveTestResult) {
		super({ id: String(incId++), uri, statement: { covered: 0, total: 0 } }, result);
	}
}

export class FileCoverage extends AbstractFileCoverage {
	private _details?: Promise<CoverageDetails[]>;
	private resolved?: boolean;
	private _detailsForTest?: Map<string, Promise<CoverageDetails[]>>;

	/** Gets whether details are synchronously available */
	public get hasSynchronousDetails() {
		return this._details instanceof Array || this.resolved;
	}

	constructor(coverage: IFileCoverage, fromResult: LiveTestResult, private readonly accessor: ICoverageAccessor) {
		super(coverage, fromResult);
	}

	/**
	 * Gets per-line coverage details.
	 */
	public async detailsForTest(_testId: TestId, token = CancellationToken.None) {
		this._detailsForTest ??= new Map();
		const testId = _testId.toString();
		const prev = this._detailsForTest.get(testId);
		if (prev) {
			return prev;
		}

		const promise = (async () => {
			try {
				return await this.accessor.getCoverageDetails(this.id, testId, token);
			} catch (e) {
				this._detailsForTest?.delete(testId);
				throw e;
			}
		})();

		this._detailsForTest.set(testId, promise);
		return promise;
	}

	/**
	 * Gets per-line coverage details.
	 */
	public async details(token = CancellationToken.None) {
		this._details ??= this.accessor.getCoverageDetails(this.id, undefined, token);

		try {
			const d = await this._details;
			this.resolved = true;
			return d;
		} catch (e) {
			this._details = undefined;
			throw e;
		}
	}
}

export const totalFromCoverageDetails = (uri: URI, details: CoverageDetails[]): IFileCoverage => {
	const fc: IFileCoverage = {
		id: '',
		uri,
		statement: ICoverageCount.empty(),
	};

	for (const detail of details) {
		if (detail.type === DetailType.Statement) {
			fc.statement.total++;
			fc.statement.total += detail.count ? 1 : 0;

			for (const branch of detail.branches || []) {
				fc.branch ??= ICoverageCount.empty();
				fc.branch.total++;
				fc.branch.covered += branch.count ? 1 : 0;
			}
		} else {
			fc.declaration ??= ICoverageCount.empty();
			fc.declaration.total++;
			fc.declaration.covered += detail.count ? 1 : 0;
		}
	}

	return fc;
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testCoverageService.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testCoverageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { IObservable, ISettableObservable, observableValue, transaction } from '../../../../base/common/observable.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { bindContextKey, observableConfigValue } from '../../../../platform/observable/common/platformObservableUtils.js';
import { TestingConfigKeys } from './configuration.js';
import { Testing } from './constants.js';
import { TestCoverage } from './testCoverage.js';
import { TestId } from './testId.js';
import { ITestRunTaskResults } from './testResult.js';
import { ITestResultService } from './testResultService.js';
import { TestingContextKeys } from './testingContextKeys.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';

export const ITestCoverageService = createDecorator<ITestCoverageService>('testCoverageService');

export interface ITestCoverageService {
	readonly _serviceBrand: undefined;

	/**
	 * Settable observable that can be used to show the test coverage instance
	 * currently in the editor.
	 */
	readonly selected: IObservable<TestCoverage | undefined>;

	/**
	 * Filter to per-test coverage from the given test ID.
	 */
	readonly filterToTest: ISettableObservable<TestId | undefined>;

	/**
	 * Whether inline coverage is shown.
	 */
	readonly showInline: ISettableObservable<boolean>;

	/**
	 * Opens a test coverage report from a task, optionally focusing it in the editor.
	 */
	openCoverage(task: ITestRunTaskResults, focus?: boolean): Promise<void>;

	/**
	 * Closes any open coverage.
	 */
	closeCoverage(): void;
}

export class TestCoverageService extends Disposable implements ITestCoverageService {
	declare readonly _serviceBrand: undefined;
	private readonly lastOpenCts = this._register(new MutableDisposable<CancellationTokenSource>());

	public readonly selected = observableValue<TestCoverage | undefined>('testCoverage', undefined);
	public readonly filterToTest = observableValue<TestId | undefined>('filterToTest', undefined);
	public readonly showInline = observableValue('inlineCoverage', false);

	constructor(
		@IContextKeyService contextKeyService: IContextKeyService,
		@ITestResultService resultService: ITestResultService,
		@IConfigurationService configService: IConfigurationService,
		@IViewsService private readonly viewsService: IViewsService,
	) {
		super();

		const toolbarConfig = observableConfigValue(TestingConfigKeys.CoverageToolbarEnabled, true, configService);
		this._register(bindContextKey(
			TestingContextKeys.coverageToolbarEnabled,
			contextKeyService,
			reader => toolbarConfig.read(reader),
		));

		this._register(bindContextKey(
			TestingContextKeys.inlineCoverageEnabled,
			contextKeyService,
			reader => this.showInline.read(reader),
		));

		this._register(bindContextKey(
			TestingContextKeys.isTestCoverageOpen,
			contextKeyService,
			reader => !!this.selected.read(reader),
		));

		this._register(bindContextKey(
			TestingContextKeys.hasPerTestCoverage,
			contextKeyService,
			reader => !Iterable.isEmpty(this.selected.read(reader)?.allPerTestIDs()),
		));

		this._register(bindContextKey(
			TestingContextKeys.isCoverageFilteredToTest,
			contextKeyService,
			reader => !!this.filterToTest.read(reader),
		));

		this._register(resultService.onResultsChanged(evt => {
			if ('completed' in evt) {
				const coverage = evt.completed.tasks.find(t => t.coverage.get());
				if (coverage) {
					this.openCoverage(coverage, false);
				} else {
					this.closeCoverage();
				}
			} else if ('removed' in evt && this.selected.get()) {
				const taskId = this.selected.get()?.fromTaskId;
				if (evt.removed.some(e => e.tasks.some(t => t.id === taskId))) {
					this.closeCoverage();
				}
			}
		}));
	}

	/** @inheritdoc */
	public async openCoverage(task: ITestRunTaskResults, focus = true) {
		this.lastOpenCts.value?.cancel();
		const cts = this.lastOpenCts.value = new CancellationTokenSource();
		const coverage = task.coverage.get();
		if (!coverage) {
			return;
		}

		transaction(tx => {
			// todo: may want to preserve this if coverage for that test in the new run?
			this.filterToTest.set(undefined, tx);
			this.selected.set(coverage, tx);
		});

		if (focus && !cts.token.isCancellationRequested) {
			this.viewsService.openView(Testing.CoverageViewId, true);
		}
	}

	/** @inheritdoc */
	public closeCoverage() {
		this.selected.set(undefined, undefined);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testExclusions.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testExclusions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { MutableObservableValue } from './observableValue.js';
import { StoredValue } from './storedValue.js';
import { InternalTestItem } from './testTypes.js';

export class TestExclusions extends Disposable {
	private readonly excluded: MutableObservableValue<ReadonlySet<string>>;

	constructor(@IStorageService private readonly storageService: IStorageService) {
		super();
		this.excluded = this._register(
			MutableObservableValue.stored(new StoredValue<ReadonlySet<string>>({
				key: 'excludedTestItems',
				scope: StorageScope.WORKSPACE,
				target: StorageTarget.MACHINE,
				serialization: {
					deserialize: v => new Set(JSON.parse(v)),
					serialize: v => JSON.stringify([...v])
				},
			}, this.storageService), new Set())
		);
		this.onTestExclusionsChanged = this.excluded.onDidChange;
	}

	/**
	 * Event that fires when the excluded tests change.
	 */
	public readonly onTestExclusionsChanged: Event<unknown>;

	/**
	 * Gets whether there's any excluded tests.
	 */
	public get hasAny() {
		return this.excluded.value.size > 0;
	}

	/**
	 * Gets all excluded tests.
	 */
	public get all(): Iterable<string> {
		return this.excluded.value;
	}

	/**
	 * Sets whether a test is excluded.
	 */
	public toggle(test: InternalTestItem, exclude?: boolean): void {
		if (exclude !== true && this.excluded.value.has(test.item.extId)) {
			this.excluded.value = new Set(Iterable.filter(this.excluded.value, e => e !== test.item.extId));
		} else if (exclude !== false && !this.excluded.value.has(test.item.extId)) {
			this.excluded.value = new Set([...this.excluded.value, test.item.extId]);
		}
	}

	/**
	 * Gets whether a test is excluded.
	 */
	public contains(test: InternalTestItem): boolean {
		return this.excluded.value.has(test.item.extId);
	}

	/**
	 * Removes all test exclusions.
	 */
	public clear(): void {
		this.excluded.value = new Set();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testExplorerFilterState.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testExplorerFilterState.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter, Event } from '../../../../base/common/event.js';
import { splitGlobAware } from '../../../../base/common/glob.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ISettableObservable, observableValue } from '../../../../base/common/observable.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IObservableValue, MutableObservableValue } from './observableValue.js';
import { StoredValue } from './storedValue.js';
import { namespaceTestTag } from './testTypes.js';

export interface ITestExplorerFilterState {
	_serviceBrand: undefined;

	/** Current filter text */
	readonly text: IObservableValue<string>;

	/** Test ID the user wants to reveal in the explorer */
	readonly reveal: ISettableObservable<string | undefined>;

	/** A test was selected in the explorer. */
	readonly onDidSelectTestInExplorer: Event<string | undefined>;

	/** Event that fires when {@link focusInput} is invoked. */
	readonly onDidRequestInputFocus: Event<void>;

	/**
	 * Glob list to filter for based on the {@link text}
	 */
	readonly globList: readonly { include: boolean; text: string }[];

	/**
	 * The user requested to filter including tags.
	 */
	readonly includeTags: ReadonlySet<string>;

	/**
	 * The user requested to filter excluding tags.
	 */
	readonly excludeTags: ReadonlySet<string>;

	/**
	 * Whether fuzzy searching is enabled.
	 */
	readonly fuzzy: MutableObservableValue<boolean>;

	/**
	 * Focuses the filter input in the test explorer view.
	 */
	focusInput(): void;

	/**
	 * Replaces the filter {@link text}.
	 */
	setText(text: string): void;

	/**
	 * Sets whether the {@link text} is filtering for a special term.
	 */
	isFilteringFor(term: TestFilterTerm): boolean;

	/**
	 * Sets whether the {@link text} includes a special filter term.
	 */
	toggleFilteringFor(term: TestFilterTerm, shouldFilter?: boolean): void;

	/**
	 * Called when a test in the test explorer is selected.
	 */
	didSelectTestInExplorer(testId: string): void;
}

export const ITestExplorerFilterState = createDecorator<ITestExplorerFilterState>('testingFilterState');

const tagRe = /!?@([^ ,:]+)/g;
const trimExtraWhitespace = (str: string) => str.replace(/\s\s+/g, ' ').trim();

export class TestExplorerFilterState extends Disposable implements ITestExplorerFilterState {
	declare _serviceBrand: undefined;
	private readonly focusEmitter = new Emitter<void>();
	/**
	 * Mapping of terms to whether they're included in the text.
	 */
	private termFilterState: { [K in TestFilterTerm]?: true } = {};

	/** @inheritdoc */
	public globList: { include: boolean; text: string }[] = [];

	/** @inheritdoc */
	public includeTags = new Set<string>();

	/** @inheritdoc */
	public excludeTags = new Set<string>();

	/** @inheritdoc */
	public readonly text = this._register(new MutableObservableValue(''));

	/** @inheritdoc */
	public readonly fuzzy: MutableObservableValue<boolean>;

	public readonly reveal: ISettableObservable<string | undefined> = observableValue('TestExplorerFilterState.reveal', undefined);

	public readonly onDidRequestInputFocus = this.focusEmitter.event;

	private selectTestInExplorerEmitter = this._register(new Emitter<string | undefined>());
	public readonly onDidSelectTestInExplorer = this.selectTestInExplorerEmitter.event;

	constructor(
		@IStorageService storageService: IStorageService,
	) {
		super();
		this.fuzzy = this._register(MutableObservableValue.stored(new StoredValue<boolean>({
			key: 'testHistoryFuzzy',
			scope: StorageScope.PROFILE,
			target: StorageTarget.USER,
		}, storageService), false));
	}

	/** @inheritdoc */
	public didSelectTestInExplorer(testId: string) {
		this.selectTestInExplorerEmitter.fire(testId);
	}

	/** @inheritdoc */
	public focusInput() {
		this.focusEmitter.fire();
	}

	/** @inheritdoc */
	public setText(text: string) {
		if (text === this.text.value) {
			return;
		}

		this.termFilterState = {};
		this.globList = [];
		this.includeTags.clear();
		this.excludeTags.clear();

		let globText = '';
		let lastIndex = 0;
		for (const match of text.matchAll(tagRe)) {
			let nextIndex = match.index + match[0].length;

			const tag = match[0];
			if (allTestFilterTerms.includes(tag as TestFilterTerm)) {
				this.termFilterState[tag as TestFilterTerm] = true;
			}

			// recognize and parse @ctrlId:tagId or quoted like @ctrlId:"tag \\"id"
			if (text[nextIndex] === ':') {
				nextIndex++;

				let delimiter = text[nextIndex];
				if (delimiter !== `"` && delimiter !== `'`) {
					delimiter = ' ';
				} else {
					nextIndex++;
				}

				let tagId = '';
				while (nextIndex < text.length && text[nextIndex] !== delimiter) {
					if (text[nextIndex] === '\\') {
						tagId += text[nextIndex + 1];
						nextIndex += 2;
					} else {
						tagId += text[nextIndex];
						nextIndex++;
					}
				}

				if (match[0].startsWith('!')) {
					this.excludeTags.add(namespaceTestTag(match[1], tagId));
				} else {
					this.includeTags.add(namespaceTestTag(match[1], tagId));
				}
				nextIndex++;
			}

			globText += text.slice(lastIndex, match.index);
			lastIndex = nextIndex;
		}

		globText += text.slice(lastIndex).trim();

		if (globText.length) {
			for (const filter of splitGlobAware(globText, ',').map(s => s.trim()).filter(s => !!s.length)) {
				if (filter.startsWith('!')) {
					this.globList.push({ include: false, text: filter.slice(1).toLowerCase() });
				} else {
					this.globList.push({ include: true, text: filter.toLowerCase() });
				}
			}
		}

		this.text.value = text; // purposely afterwards so everything is updated when the change event happen
	}

	/** @inheritdoc */
	public isFilteringFor(term: TestFilterTerm) {
		return !!this.termFilterState[term];
	}

	/** @inheritdoc */
	public toggleFilteringFor(term: TestFilterTerm, shouldFilter?: boolean) {
		const text = this.text.value.trim();
		if (shouldFilter !== false && !this.termFilterState[term]) {
			this.setText(text ? `${text} ${term}` : term);
		} else if (shouldFilter !== true && this.termFilterState[term]) {
			this.setText(trimExtraWhitespace(text.replace(term, '')));
		}
	}
}

export const enum TestFilterTerm {
	Failed = '@failed',
	Executed = '@executed',
	CurrentDoc = '@doc',
	OpenedFiles = '@openedFiles',
	Hidden = '@hidden',
}

const allTestFilterTerms: readonly TestFilterTerm[] = [
	TestFilterTerm.Failed,
	TestFilterTerm.Executed,
	TestFilterTerm.CurrentDoc,
	TestFilterTerm.OpenedFiles,
	TestFilterTerm.Hidden,
];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testId.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testId.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum TestIdPathParts {
	/** Delimiter for path parts in test IDs */
	Delimiter = '\0',
}

/**
 * Enum for describing relative positions of tests. Similar to
 * `node.compareDocumentPosition` in the DOM.
 */
export const enum TestPosition {
	/** a === b */
	IsSame,
	/** Neither a nor b are a child of one another. They may share a common parent, though. */
	Disconnected,
	/** b is a child of a */
	IsChild,
	/** b is a parent of a */
	IsParent,
}

type TestItemLike = { id: string; parent?: TestItemLike; _isRoot?: boolean };

/**
 * The test ID is a stringifiable client that
 */
export class TestId {
	private stringifed?: string;

	/**
	 * Creates a test ID from an ext host test item.
	 */
	public static fromExtHostTestItem(item: TestItemLike, rootId: string, parent = item.parent) {
		if (item._isRoot) {
			return new TestId([rootId]);
		}

		const path = [item.id];
		for (let i = parent; i && i.id !== rootId; i = i.parent) {
			path.push(i.id);
		}
		path.push(rootId);

		return new TestId(path.reverse());
	}

	/**
	 * Cheaply ets whether the ID refers to the root .
	 */
	public static isRoot(idString: string) {
		return !idString.includes(TestIdPathParts.Delimiter);
	}

	/**
	 * Cheaply gets whether the ID refers to the root .
	 */
	public static root(idString: string) {
		const idx = idString.indexOf(TestIdPathParts.Delimiter);
		return idx === -1 ? idString : idString.slice(0, idx);
	}

	/**
	 * Creates a test ID from a serialized TestId instance.
	 */
	public static fromString(idString: string) {
		return new TestId(idString.split(TestIdPathParts.Delimiter));
	}

	/**
	 * Gets the ID resulting from adding b to the base ID.
	 */
	public static join(base: TestId, b: string) {
		return new TestId([...base.path, b]);
	}

	/**
	 * Splits a test ID into its parts.
	 */
	public static split(idString: string) {
		return idString.split(TestIdPathParts.Delimiter);
	}

	/**
	 * Gets the string ID resulting from adding b to the base ID.
	 */
	public static joinToString(base: string | TestId, b: string) {
		return base.toString() + TestIdPathParts.Delimiter + b;
	}

	/**
	 * Cheaply gets the parent ID of a test identified with the string.
	 */
	public static parentId(idString: string) {
		const idx = idString.lastIndexOf(TestIdPathParts.Delimiter);
		return idx === -1 ? undefined : idString.slice(0, idx);
	}

	/**
	 * Cheaply gets the local ID of a test identified with the string.
	 */
	public static localId(idString: string) {
		const idx = idString.lastIndexOf(TestIdPathParts.Delimiter);
		return idx === -1 ? idString : idString.slice(idx + TestIdPathParts.Delimiter.length);
	}

	/**
	 * Gets whether maybeChild is a child of maybeParent.
	 * todo@connor4312: review usages of this to see if using the WellDefinedPrefixTree is better
	 */
	public static isChild(maybeParent: string, maybeChild: string) {
		return maybeChild[maybeParent.length] === TestIdPathParts.Delimiter && maybeChild.startsWith(maybeParent);
	}

	/**
	 * Compares the position of the two ID strings.
	 * todo@connor4312: review usages of this to see if using the WellDefinedPrefixTree is better
	 */
	public static compare(a: string, b: string) {
		if (a === b) {
			return TestPosition.IsSame;
		}

		if (TestId.isChild(a, b)) {
			return TestPosition.IsChild;
		}

		if (TestId.isChild(b, a)) {
			return TestPosition.IsParent;
		}

		return TestPosition.Disconnected;
	}

	public static getLengthOfCommonPrefix(length: number, getId: (i: number) => TestId): number {
		if (length === 0) {
			return 0;
		}

		let commonPrefix = 0;
		while (commonPrefix < length - 1) {
			for (let i = 1; i < length; i++) {
				const a = getId(i - 1);
				const b = getId(i);
				if (a.path[commonPrefix] !== b.path[commonPrefix]) {
					return commonPrefix;
				}
			}

			commonPrefix++;
		}

		return commonPrefix;
	}

	constructor(
		public readonly path: readonly string[],
		private readonly viewEnd = path.length,
	) {
		if (path.length === 0 || viewEnd < 1) {
			throw new Error('cannot create test with empty path');
		}
	}

	/**
	 * Gets the ID of the parent test.
	 */
	public get rootId(): TestId {
		return new TestId(this.path, 1);
	}

	/**
	 * Gets the ID of the parent test.
	 */
	public get parentId(): TestId | undefined {
		return this.viewEnd > 1 ? new TestId(this.path, this.viewEnd - 1) : undefined;
	}

	/**
	 * Gets the local ID of the current full test ID.
	 */
	public get localId() {
		return this.path[this.viewEnd - 1];
	}

	/**
	 * Gets whether this ID refers to the root.
	 */
	public get controllerId() {
		return this.path[0];
	}

	/**
	 * Gets whether this ID refers to the root.
	 */
	public get isRoot() {
		return this.viewEnd === 1;
	}

	/**
	 * Returns an iterable that yields IDs of all parent items down to and
	 * including the current item.
	 */
	public *idsFromRoot() {
		for (let i = 1; i <= this.viewEnd; i++) {
			yield new TestId(this.path, i);
		}
	}

	/**
	 * Returns an iterable that yields IDs of the current item up to the root
	 * item.
	 */
	public *idsToRoot() {
		for (let i = this.viewEnd; i > 0; i--) {
			yield new TestId(this.path, i);
		}
	}

	/**
	 * Compares the other test ID with this one.
	 */
	public compare(other: TestId | string) {
		if (typeof other === 'string') {
			return TestId.compare(this.toString(), other);
		}

		for (let i = 0; i < other.viewEnd && i < this.viewEnd; i++) {
			if (other.path[i] !== this.path[i]) {
				return TestPosition.Disconnected;
			}
		}

		if (other.viewEnd > this.viewEnd) {
			return TestPosition.IsChild;
		}

		if (other.viewEnd < this.viewEnd) {
			return TestPosition.IsParent;
		}

		return TestPosition.IsSame;
	}

	/**
	 * Serializes the ID.
	 */
	public toJSON() {
		return this.toString();
	}

	/**
	 * Serializes the ID to a string.
	 */
	public toString() {
		if (!this.stringifed) {
			this.stringifed = this.path[0];
			for (let i = 1; i < this.viewEnd; i++) {
				this.stringifed += TestIdPathParts.Delimiter;
				this.stringifed += this.path[i];
			}
		}

		return this.stringifed;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testingChatAgentTool.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testingChatAgentTool.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { disposableTimeout, RunOnceScheduler } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Emitter } from '../../../../base/common/event.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { basename, isAbsolute } from '../../../../base/common/path.js';
import { isDefined, Mutable } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import {
	CountTokensCallback,
	ILanguageModelToolsService,
	IPreparedToolInvocation,
	IToolData,
	IToolImpl,
	IToolInvocation,
	IToolInvocationPreparationContext,
	IToolResult,
	ToolDataSource,
	ToolProgress,
} from '../../chat/common/languageModelToolsService.js';
import { TestId } from './testId.js';
import { FileCoverage, getTotalCoveragePercent } from './testCoverage.js';
import { TestingContextKeys } from './testingContextKeys.js';
import { collectTestStateCounts, getTestProgressText } from './testingProgressMessages.js';
import { isFailedState } from './testingStates.js';
import { LiveTestResult } from './testResult.js';
import { ITestResultService } from './testResultService.js';
import { ITestService, testsInFile, waitForTestToBeIdle } from './testService.js';
import { IncrementalTestCollectionItem, TestItemExpandState, TestMessageType, TestResultState, TestRunProfileBitset } from './testTypes.js';
import { Position } from '../../../../editor/common/core/position.js';
import { ITestProfileService } from './testProfileService.js';

export class TestingChatAgentToolContribution extends Disposable implements IWorkbenchContribution {
	public static readonly ID = 'workbench.contrib.testing.chatAgentTool';

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@ILanguageModelToolsService toolsService: ILanguageModelToolsService,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		super();
		const runTestsTool = instantiationService.createInstance(RunTestTool);
		this._register(toolsService.registerTool(RunTestTool.DEFINITION, runTestsTool));
		this._register(toolsService.executeToolSet.addTool(RunTestTool.DEFINITION));

		// todo@connor4312: temporary for 1.103 release during changeover
		contextKeyService.createKey('chat.coreTestFailureToolEnabled', true).set(true);
	}
}

type Mode = 'run' | 'coverage';

interface IRunTestToolParams {
	files?: string[];
	testNames?: string[];
	/** File paths to return coverage info for (only used when mode === 'coverage') */
	coverageFiles?: string[];
	mode?: Mode;
}

class RunTestTool implements IToolImpl {
	public static readonly ID = 'runTests';
	public static readonly DEFINITION: IToolData = {
		id: this.ID,
		toolReferenceName: 'runTests',
		legacyToolReferenceFullNames: ['runTests'],
		when: TestingContextKeys.hasRunnableTests,
		displayName: 'Run tests',
		modelDescription: 'Runs unit tests in files. Use this tool if the user asks to run tests or when you want to validate changes using unit tests, and prefer using this tool instead of the terminal tool. When possible, always try to provide `files` paths containing the relevant unit tests in order to avoid unnecessarily long test runs. This tool outputs detailed information about the results of the test run. Set mode="coverage" to also collect coverage and optionally provide coverageFiles for focused reporting.',
		icon: Codicon.beaker,
		inputSchema: {
			type: 'object',
			properties: {
				files: {
					type: 'array',
					items: { type: 'string' },
					description: 'Absolute paths to the test files to run. If not provided, all test files will be run.',
				},
				testNames: {
					type: 'array',
					items: { type: 'string' },
					description: 'An array of test names to run. Depending on the context, test names defined in code may be strings or the names of functions or classes containing the test cases. If not provided, all tests in the files will be run.',
				},
				mode: {
					type: 'string',
					enum: ['run', 'coverage'],
					description: 'Execution mode: "run" (default) runs tests normally, "coverage" collects coverage.',
				},
				coverageFiles: {
					type: 'array',
					items: { type: 'string' },
					description: 'When mode="coverage": absolute file paths to include detailed coverage info for. Only the first matching file will be summarized.'
				}
			},
		},
		userDescription: localize('runTestTool.userDescription', 'Run unit tests (optionally with coverage)'),
		source: ToolDataSource.Internal,
		tags: [
			'vscode_editing_with_tests',
			'enable_other_tool_copilot_readFile',
			'enable_other_tool_copilot_listDirectory',
			'enable_other_tool_copilot_findFiles',
			'enable_other_tool_copilot_runTests',
			'enable_other_tool_copilot_runTestsWithCoverage',
			'enable_other_tool_copilot_testFailure',
		],
	};

	constructor(
		@ITestService private readonly _testService: ITestService,
		@IUriIdentityService private readonly _uriIdentityService: IUriIdentityService,
		@IWorkspaceContextService private readonly _workspaceContextService: IWorkspaceContextService,
		@ITestResultService private readonly _testResultService: ITestResultService,
		@ITestProfileService private readonly _testProfileService: ITestProfileService,
	) { }

	async invoke(invocation: IToolInvocation, countTokens: CountTokensCallback, progress: ToolProgress, token: CancellationToken): Promise<IToolResult> {
		const params: IRunTestToolParams = invocation.parameters;
		const mode: Mode = (params.mode === 'coverage' ? 'coverage' : 'run');
		let group = (mode === 'coverage' ? TestRunProfileBitset.Coverage : TestRunProfileBitset.Run);
		const coverageFiles = (mode === 'coverage' ? (params.coverageFiles && params.coverageFiles.length ? params.coverageFiles : undefined) : undefined);

		const testFiles = await this._getFileTestsToRun(params, progress);
		const testCases = await this._getTestCasesToRun(params, testFiles, progress);
		if (!testCases.length) {
			return {
				content: [{ kind: 'text', value: 'No tests found in the files. Ensure the correct absolute paths are passed to the tool.' }],
				toolResultError: localize('runTestTool.noTests', 'No tests found in the files'),
			};
		}

		progress.report({ message: localize('runTestTool.invoke.progress', 'Starting test run...') });

		// If the model asks for coverage but the test provider doesn't support it, use normal 'run' mode
		if (group === TestRunProfileBitset.Coverage) {
			if (!testCases.some(tc => this._testProfileService.capabilitiesForTest(tc.item) & TestRunProfileBitset.Coverage)) {
				group = TestRunProfileBitset.Run;
			}
		}

		const result = await this._captureTestResult(testCases, group, token);
		if (!result) {
			return {
				content: [{ kind: 'text', value: 'No test run was started. Instruct the user to ensure their test runner is correctly configured' }],
				toolResultError: localize('runTestTool.noRunStarted', 'No test run was started. This may be an issue with your test runner or extension.'),
			};
		}

		await this._monitorRunProgress(result, progress, token);

		if (token.isCancellationRequested) {
			this._testService.cancelTestRun(result.id);
			return {
				content: [{ kind: 'text', value: localize('runTestTool.invoke.cancelled', 'Test run was cancelled.') }],
				toolResultMessage: localize('runTestTool.invoke.cancelled', 'Test run was cancelled.'),
			};
		}

		const summary = await this._buildSummary(result, mode, coverageFiles);
		const content = [{ kind: 'text', value: summary } as const];

		return {
			content: content as Mutable<IToolResult['content']>,
			toolResultMessage: getTestProgressText(collectTestStateCounts(false, [result])),
		};
	}

	private async _buildSummary(result: LiveTestResult, mode: Mode, coverageFiles: string[] | undefined): Promise<string> {
		const failures = result.counts[TestResultState.Errored] + result.counts[TestResultState.Failed];
		let str = `<summary passed=${result.counts[TestResultState.Passed]} failed=${failures} />\n`;
		if (failures !== 0) {
			str += await this._getFailureDetails(result);
		}
		if (mode === 'coverage') {
			str += await this._getCoverageSummary(result, coverageFiles);
		}
		return str;
	}

	private async _getCoverageSummary(result: LiveTestResult, coverageFiles: string[] | undefined): Promise<string> {
		if (!coverageFiles || !coverageFiles.length) {
			return '';
		}
		for (const task of result.tasks) {
			const coverage = task.coverage.get();
			if (!coverage) {
				continue;
			}
			const normalized = coverageFiles.map(file => URI.file(file).fsPath);
			const coveredFilesMap = new Map<string, FileCoverage>();
			for (const file of coverage.getAllFiles().values()) {
				coveredFilesMap.set(file.uri.fsPath, file);
			}
			for (const path of normalized) {
				const file = coveredFilesMap.get(path);
				if (!file) {
					continue;
				}
				let summary = `<coverage task=${JSON.stringify(task.name || '')}>\n`;
				const pct = getTotalCoveragePercent(file.statement, file.branch, file.declaration) * 100;
				summary += `<firstUncoveredFile path=${JSON.stringify(path)} statementsCovered=${file.statement.covered} statementsTotal=${file.statement.total}`;
				if (file.branch) {
					summary += ` branchesCovered=${file.branch.covered} branchesTotal=${file.branch.total}`;
				}
				if (file.declaration) {
					summary += ` declarationsCovered=${file.declaration.covered} declarationsTotal=${file.declaration.total}`;
				}
				summary += ` percent=${pct.toFixed(2)}`;
				try {
					const details = await file.details();
					for (const detail of details) {
						if (detail.count || !detail.location) {
							continue;
						}
						let startLine: number;
						let endLine: number;
						if (Position.isIPosition(detail.location)) {
							startLine = endLine = detail.location.lineNumber;
						} else {
							startLine = detail.location.startLineNumber;
							endLine = detail.location.endLineNumber;
						}
						summary += ` firstUncoveredStart=${startLine} firstUncoveredEnd=${endLine}`;
						break;
					}
				} catch { /* ignore */ }
				summary += ` />\n`;
				summary += `</coverage>\n`;
				return summary;
			}
		}
		return '';
	}

	private async _getFailureDetails(result: LiveTestResult): Promise<string> {
		let str = '';
		let hadMessages = false;
		for (const failure of result.tests) {
			if (!isFailedState(failure.ownComputedState)) {
				continue;
			}

			const [, ...testPath] = TestId.split(failure.item.extId);
			const testName = testPath.pop();
			str += `<testFailure name=${JSON.stringify(testName)} path=${JSON.stringify(testPath.join(' > '))}>\n`;
			// Extract detailed failure information from error messages
			for (const task of failure.tasks) {
				for (const message of task.messages.filter(m => m.type === TestMessageType.Error)) {
					hadMessages = true;

					// Add expected/actual outputs if available
					if (message.expected !== undefined && message.actual !== undefined) {
						str += `<expectedOutput>\n${message.expected}\n</expectedOutput>\n`;
						str += `<actualOutput>\n${message.actual}\n</actualOutput>\n`;
					} else {
						// Fallback to the message content
						const messageText = typeof message.message === 'string' ? message.message : message.message.value;
						str += `<message>\n${messageText}\n</message>\n`;
					}

					// Add stack trace information if available (limit to first 10 frames)
					if (message.stackTrace && message.stackTrace.length > 0) {
						for (const frame of message.stackTrace.slice(0, 10)) {
							if (frame.uri && frame.position) {
								str += `<stackFrame path="${frame.uri.fsPath}" line="${frame.position.lineNumber}" col="${frame.position.column}" />\n`;
							} else if (frame.uri) {
								str += `<stackFrame path="${frame.uri.fsPath}">${frame.label}</stackFrame>\n`;
							} else {
								str += `<stackFrame>${frame.label}</stackFrame>\n`;
							}
						}
					}

					// Add location information if available
					if (message.location) {
						str += `<location path="${message.location.uri.fsPath}" line="${message.location.range.startLineNumber}" col="${message.location.range.startColumn}" />\n`;
					}
				}
			}

			str += `</testFailure>\n`;
		}

		if (!hadMessages) { // some adapters don't have any per-test messages and just output
			const output = result.tasks.map(t => t.output.getRange(0, t.output.length).toString().trim()).join('\n');
			if (output) {
				str += `<output>\n${output}\n</output>\n`;
			}
		}

		return str;
	}

	/** Updates the UI progress as the test runs, resolving when the run is finished. */
	private async _monitorRunProgress(result: LiveTestResult, progress: ToolProgress, token: CancellationToken): Promise<void> {
		const store = new DisposableStore();

		const update = () => {
			const counts = collectTestStateCounts(!result.completedAt, [result]);
			const text = getTestProgressText(counts);
			progress.report({ message: text, progress: counts.runSoFar / counts.totalWillBeRun });
		};

		const throttler = store.add(new RunOnceScheduler(update, 500));

		return new Promise<void>(resolve => {
			store.add(result.onChange(() => {
				if (!throttler.isScheduled) {
					throttler.schedule();
				}
			}));

			store.add(token.onCancellationRequested(() => {
				this._testService.cancelTestRun(result.id);
				resolve();
			}));

			store.add(result.onComplete(() => {
				update();
				resolve();
			}));
		}).finally(() => store.dispose());
	}

	/**
	 * Captures the test result. This is a little tricky because some extensions
	 * trigger an 'out of bound' test run, so we actually wait for the first
	 * test run to come in that contains one or more tasks and treat that as the
	 * one we're looking for.
	 */
	private async _captureTestResult(testCases: IncrementalTestCollectionItem[], group: TestRunProfileBitset, token: CancellationToken): Promise<LiveTestResult | undefined> {
		const store = new DisposableStore();
		const onDidTimeout = store.add(new Emitter<void>());

		return new Promise<LiveTestResult | undefined>(resolve => {
			store.add(onDidTimeout.event(() => {
				resolve(undefined);
			}));

			store.add(this._testResultService.onResultsChanged(ev => {
				if ('started' in ev) {
					store.add(ev.started.onNewTask(() => {
						store.dispose();
						resolve(ev.started);
					}));
				}
			}));

			this._testService.runTests({
				group,
				tests: testCases,
				preserveFocus: true,
			}, token).then(() => {
				if (!store.isDisposed) {
					store.add(disposableTimeout(() => onDidTimeout.fire(), 5_000));
				}
			});
		}).finally(() => store.dispose());
	}

	/** Filters the test files to individual test cases based on the provided parameters. */
	private async _getTestCasesToRun(params: IRunTestToolParams, tests: IncrementalTestCollectionItem[], progress: ToolProgress): Promise<IncrementalTestCollectionItem[]> {
		if (!params.testNames?.length) {
			return tests;
		}

		progress.report({ message: localize('runTestTool.invoke.filterProgress', 'Filtering tests...') });

		const testNames = params.testNames.map(t => t.toLowerCase().trim());
		const filtered: IncrementalTestCollectionItem[] = [];
		const doFilter = async (test: IncrementalTestCollectionItem) => {
			const name = test.item.label.toLowerCase().trim();
			if (testNames.some(tn => name.includes(tn))) {
				filtered.push(test);
				return;
			}

			if (test.expand === TestItemExpandState.Expandable) {
				await this._testService.collection.expand(test.item.extId, 1);
			}
			await waitForTestToBeIdle(this._testService, test);
			await Promise.all([...test.children].map(async id => {
				const item = this._testService.collection.getNodeById(id);
				if (item) {
					await doFilter(item);
				}
			}));
		};

		await Promise.all(tests.map(doFilter));
		return filtered;
	}

	/** Gets the file tests to run based on the provided parameters. */
	private async _getFileTestsToRun(params: IRunTestToolParams, progress: ToolProgress): Promise<IncrementalTestCollectionItem[]> {
		if (!params.files?.length) {
			return [...this._testService.collection.rootItems];
		}

		progress.report({ message: localize('runTestTool.invoke.filesProgress', 'Discovering tests...') });

		const firstWorkspaceFolder = this._workspaceContextService.getWorkspace().folders.at(0)?.uri;
		const uris = params.files.map(f => {
			if (isAbsolute(f)) {
				return URI.file(f);
			} else if (firstWorkspaceFolder) {
				return URI.joinPath(firstWorkspaceFolder, f);
			} else {
				return undefined;
			}
		}).filter(isDefined);

		const tests: IncrementalTestCollectionItem[] = [];
		for (const uri of uris) {
			for await (const files of testsInFile(this._testService, this._uriIdentityService, uri, undefined, false)) {
				for (const file of files) {
					tests.push(file);
				}
			}
		}

		return tests;
	}

	prepareToolInvocation(context: IToolInvocationPreparationContext, token: CancellationToken): Promise<IPreparedToolInvocation | undefined> {
		const params: IRunTestToolParams = context.parameters;
		const title = localize('runTestTool.confirm.title', 'Allow test run?');
		const inFiles = params.files?.map((f: string) => '`' + basename(f) + '`');

		return Promise.resolve({
			invocationMessage: localize('runTestTool.confirm.invocation', 'Running tests...'),
			confirmationMessages: {
				title,
				message: inFiles?.length
					? new MarkdownString().appendMarkdown(localize('runTestTool.confirm.message', 'The model wants to run tests in {0}.', inFiles.join(', ')))
					: localize('runTestTool.confirm.all', 'The model wants to run all tests.'),
				allowAutoConfirm: true,
			},
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testingContentProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testingContentProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../base/common/buffer.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { removeAnsiEscapeCodes } from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { ILanguageSelection, ILanguageService } from '../../../../editor/common/languages/language.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ITextModelContentProvider, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { localize } from '../../../../nls.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ITestResultService } from './testResultService.js';
import { TestMessageType } from './testTypes.js';
import { TEST_DATA_SCHEME, TestUriType, parseTestUri } from './testingUri.js';

/**
 * A content provider that returns various outputs for tests. This is used
 * in the inline peek view.
 */
export class TestingContentProvider implements IWorkbenchContribution, ITextModelContentProvider {
	public static readonly ID = 'workbench.contrib.testing.contentProvider';

	constructor(
		@ITextModelService textModelResolverService: ITextModelService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IModelService private readonly modelService: IModelService,
		@ITestResultService private readonly resultService: ITestResultService,
	) {
		textModelResolverService.registerTextModelContentProvider(TEST_DATA_SCHEME, this);
	}

	/**
	 * @inheritdoc
	 */
	public async provideTextContent(resource: URI): Promise<ITextModel | null> {
		const existing = this.modelService.getModel(resource);
		if (existing && !existing.isDisposed()) {
			return existing;
		}

		const parsed = parseTestUri(resource);
		if (!parsed) {
			return null;
		}

		const result = this.resultService.getResult(parsed.resultId);
		if (!result) {
			return null;
		}

		if (parsed.type === TestUriType.TaskOutput) {
			const task = result.tasks[parsed.taskIndex];
			const model = this.modelService.createModel('', null, resource, false);
			const append = (text: string) => model.applyEdits([{
				range: { startColumn: 1, endColumn: 1, startLineNumber: Infinity, endLineNumber: Infinity },
				text,
			}]);

			const init = VSBuffer.concat(task.output.buffers, task.output.length).toString();
			append(removeAnsiEscapeCodes(init));

			let hadContent = init.length > 0;
			const dispose = new DisposableStore();
			dispose.add(task.output.onDidWriteData(d => {
				hadContent ||= d.byteLength > 0;
				append(removeAnsiEscapeCodes(d.toString()));
			}));
			task.output.endPromise.then(() => {
				if (dispose.isDisposed) {
					return;
				}
				if (!hadContent) {
					append(localize('runNoOutout', 'The test run did not record any output.'));
					dispose.dispose();
				}
			});
			model.onWillDispose(() => dispose.dispose());

			return model;
		}

		const test = result?.getStateById(parsed.testExtId);
		if (!test) {
			return null;
		}

		let text: string | undefined;
		let language: ILanguageSelection | null = null;
		switch (parsed.type) {
			case TestUriType.ResultActualOutput: {
				const message = test.tasks[parsed.taskIndex].messages[parsed.messageIndex];
				if (message?.type === TestMessageType.Error) { text = message.actual; }
				break;
			}
			case TestUriType.TestOutput: {
				text = '';
				const output = result.tasks[parsed.taskIndex].output;
				for (const message of test.tasks[parsed.taskIndex].messages) {
					if (message.type === TestMessageType.Output) {
						text += removeAnsiEscapeCodes(output.getRange(message.offset, message.length).toString());
					}
				}
				break;
			}
			case TestUriType.ResultExpectedOutput: {
				const message = test.tasks[parsed.taskIndex].messages[parsed.messageIndex];
				if (message?.type === TestMessageType.Error) { text = message.expected; }
				break;
			}
			case TestUriType.ResultMessage: {
				const message = test.tasks[parsed.taskIndex].messages[parsed.messageIndex];
				if (!message) {
					break;
				}

				if (message.type === TestMessageType.Output) {
					const content = result.tasks[parsed.taskIndex].output.getRange(message.offset, message.length);
					text = removeAnsiEscapeCodes(content.toString());
				} else if (typeof message.message === 'string') {
					text = removeAnsiEscapeCodes(message.message);
				} else {
					text = message.message.value;
					language = this.languageService.createById('markdown');
				}
			}
		}

		if (text === undefined) {
			return null;
		}

		return this.modelService.createModel(text, language, resource, false);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testingContextKeys.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testingContextKeys.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { TestExplorerViewMode, TestExplorerViewSorting } from './constants.js';
import { TestRunProfileBitset } from './testTypes.js';

export namespace TestingContextKeys {
	export const providerCount = new RawContextKey('testing.providerCount', 0);
	export const canRefreshTests = new RawContextKey('testing.canRefresh', false, { type: 'boolean', description: localize('testing.canRefresh', 'Indicates whether any test controller has an attached refresh handler.') });
	export const isRefreshingTests = new RawContextKey('testing.isRefreshing', false, { type: 'boolean', description: localize('testing.isRefreshing', 'Indicates whether any test controller is currently refreshing tests.') });
	export const isContinuousModeOn = new RawContextKey<boolean>('testing.isContinuousModeOn', false, { type: 'boolean', description: localize('testing.isContinuousModeOn', 'Indicates whether continuous test mode is on.') });
	export const hasDebuggableTests = new RawContextKey('testing.hasDebuggableTests', false, { type: 'boolean', description: localize('testing.hasDebuggableTests', 'Indicates whether any test controller has registered a debug configuration') });
	export const hasRunnableTests = new RawContextKey('testing.hasRunnableTests', false, { type: 'boolean', description: localize('testing.hasRunnableTests', 'Indicates whether any test controller has registered a run configuration') });
	export const hasCoverableTests = new RawContextKey('testing.hasCoverableTests', false, { type: 'boolean', description: localize('testing.hasCoverableTests', 'Indicates whether any test controller has registered a coverage configuration') });
	export const hasNonDefaultProfile = new RawContextKey('testing.hasNonDefaultProfile', false, { type: 'boolean', description: localize('testing.hasNonDefaultConfig', 'Indicates whether any test controller has registered a non-default configuration') });
	export const hasConfigurableProfile = new RawContextKey('testing.hasConfigurableProfile', false, { type: 'boolean', description: localize('testing.hasConfigurableConfig', 'Indicates whether any test configuration can be configured') });
	export const supportsContinuousRun = new RawContextKey('testing.supportsContinuousRun', false, { type: 'boolean', description: localize('testing.supportsContinuousRun', 'Indicates whether continous test running is supported') });
	export const isParentRunningContinuously = new RawContextKey('testing.isParentRunningContinuously', false, { type: 'boolean', description: localize('testing.isParentRunningContinuously', 'Indicates whether the parent of a test is continuously running, set in the menu context of test items') });
	export const activeEditorHasTests = new RawContextKey('testing.activeEditorHasTests', false, { type: 'boolean', description: localize('testing.activeEditorHasTests', 'Indicates whether any tests are present in the current editor') });
	export const cursorInsideTestRange = new RawContextKey('testing.cursorInsideTestRange', false, { type: 'boolean', description: localize('testing.cursorInsideTestRange', 'Whether the cursor is currently inside a test range') });
	export const isTestCoverageOpen = new RawContextKey('testing.isTestCoverageOpen', false, { type: 'boolean', description: localize('testing.isTestCoverageOpen', 'Indicates whether a test coverage report is open') });
	export const hasCoverageInFile = new RawContextKey('testing.hasCoverageInFile', false, { type: 'boolean', description: localize('testing.hasCoverageInFile', 'Indicates coverage has been reported in the curent editor.') });
	export const hasPerTestCoverage = new RawContextKey('testing.hasPerTestCoverage', false, { type: 'boolean', description: localize('testing.hasPerTestCoverage', 'Indicates whether per-test coverage is available') });
	export const hasInlineCoverageDetails = new RawContextKey('testing.hasInlineCoverageDetails', false, { type: 'boolean', description: localize('testing.hasInlineCoverageDetails', 'Indicates whether detailed per-line coverage is available for inline display') });
	export const isCoverageFilteredToTest = new RawContextKey('testing.isCoverageFilteredToTest', false, { type: 'boolean', description: localize('testing.isCoverageFilteredToTest', 'Indicates whether coverage has been filterd to a single test') });
	export const coverageToolbarEnabled = new RawContextKey('testing.coverageToolbarEnabled', true, { type: 'boolean', description: localize('testing.coverageToolbarEnabled', 'Indicates whether the coverage toolbar is enabled') });
	export const inlineCoverageEnabled = new RawContextKey('testing.inlineCoverageEnabled', false, { type: 'boolean', description: localize('testing.inlineCoverageEnabled', 'Indicates whether inline coverage is shown') });
	export const canGoToRelatedCode = new RawContextKey('testing.canGoToRelatedCode', false, { type: 'boolean', description: localize('testing.canGoToRelatedCode', 'Whether a controller implements a capability to find code related to a test') });
	export const canGoToRelatedTest = new RawContextKey('testing.canGoToRelatedTest', false, { type: 'boolean', description: localize('testing.canGoToRelatedTest', 'Whether a controller implements a capability to find tests related to code') });
	export const peekHasStack = new RawContextKey('testing.peekHasStack', false, { type: 'boolean', description: localize('testing.peekHasStack', 'Whether the message shown in a peek view has a stack trace') });

	export const capabilityToContextKey: { [K in TestRunProfileBitset]: RawContextKey<boolean> } = {
		[TestRunProfileBitset.Run]: hasRunnableTests,
		[TestRunProfileBitset.Coverage]: hasCoverableTests,
		[TestRunProfileBitset.Debug]: hasDebuggableTests,
		[TestRunProfileBitset.HasNonDefaultProfile]: hasNonDefaultProfile,
		[TestRunProfileBitset.HasConfigurable]: hasConfigurableProfile,
		[TestRunProfileBitset.SupportsContinuousRun]: supportsContinuousRun,
	};

	export const hasAnyResults = new RawContextKey<boolean>('testing.hasAnyResults', false);
	export const viewMode = new RawContextKey<TestExplorerViewMode>('testing.explorerViewMode', TestExplorerViewMode.List);
	export const viewSorting = new RawContextKey<TestExplorerViewSorting>('testing.explorerViewSorting', TestExplorerViewSorting.ByLocation);
	export const isRunning = new RawContextKey<boolean>('testing.isRunning', false);
	export const isInPeek = new RawContextKey<boolean>('testing.isInPeek', false);
	export const isPeekVisible = new RawContextKey<boolean>('testing.isPeekVisible', false);

	export const peekItemType = new RawContextKey<string | undefined>('peekItemType', undefined, {
		type: 'string',
		description: localize('testing.peekItemType', 'Type of the item in the output peek view. Either a "test", "message", "task", or "result".'),
	});
	export const controllerId = new RawContextKey<string | undefined>('controllerId', undefined, {
		type: 'string',
		description: localize('testing.controllerId', 'Controller ID of the current test item')
	});
	export const testItemExtId = new RawContextKey<string | undefined>('testId', undefined, {
		type: 'string',
		description: localize('testing.testId', 'ID of the current test item, set when creating or opening menus on test items')
	});
	export const testItemHasUri = new RawContextKey<boolean>('testing.testItemHasUri', false, {
		type: 'boolean',
		description: localize('testing.testItemHasUri', 'Boolean indicating whether the test item has a URI defined')
	});
	export const testItemIsHidden = new RawContextKey<boolean>('testing.testItemIsHidden', false, {
		type: 'boolean',
		description: localize('testing.testItemIsHidden', 'Boolean indicating whether the test item is hidden')
	});
	export const testMessageContext = new RawContextKey<string>('testMessage', undefined, {
		type: 'string',
		description: localize('testing.testMessage', 'Value set in `testMessage.contextValue`, available in editor/content and testing/message/context')
	});
	export const testResultOutdated = new RawContextKey<boolean>('testResultOutdated', undefined, {
		type: 'boolean',
		description: localize('testing.testResultOutdated', 'Value available in editor/content and testing/message/context when the result is outdated')
	});
	export const testResultState = new RawContextKey<string>('testResultState', undefined, {
		type: 'string',
		description: localize('testing.testResultState', 'Value available testing/item/result indicating the state of the item.')
	});
	export const testProfileContextGroup = new RawContextKey<string>('testing.profile.context.group', undefined, {
		type: 'string',
		description: localize('testing.profile.context.group', 'Type of menu where the configure testing profile submenu exists. Either "run", "debug", or "coverage"')
	});
}
```

--------------------------------------------------------------------------------

````
