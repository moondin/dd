---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 384
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 384 of 552)

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

---[FILE: src/vs/workbench/contrib/debug/common/debugVisualizers.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/common/debugVisualizers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IDisposable, IReference, toDisposable } from '../../../../base/common/lifecycle.js';
import { isDefined } from '../../../../base/common/types.js';
import { ContextKeyExpr, ContextKeyExpression, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { CONTEXT_VARIABLE_NAME, CONTEXT_VARIABLE_TYPE, CONTEXT_VARIABLE_VALUE, MainThreadDebugVisualization, IDebugVisualization, IDebugVisualizationContext, IExpression, IExpressionContainer, IDebugVisualizationTreeItem, IDebugSession } from './debug.js';
import { getContextForVariable } from './debugContext.js';
import { Scope, Variable, VisualizedExpression } from './debugModel.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { ExtensionsRegistry } from '../../../services/extensions/common/extensionsRegistry.js';

export const IDebugVisualizerService = createDecorator<IDebugVisualizerService>('debugVisualizerService');

interface VisualizerHandle {
	id: string;
	extensionId: ExtensionIdentifier;
	provideDebugVisualizers(context: IDebugVisualizationContext, token: CancellationToken): Promise<IDebugVisualization[]>;
	resolveDebugVisualizer(viz: IDebugVisualization, token: CancellationToken): Promise<MainThreadDebugVisualization>;
	executeDebugVisualizerCommand(id: number): Promise<void>;
	disposeDebugVisualizers(ids: number[]): void;
}

interface VisualizerTreeHandle {
	getTreeItem(element: IDebugVisualizationContext): Promise<IDebugVisualizationTreeItem | undefined>;
	getChildren(element: number): Promise<IDebugVisualizationTreeItem[]>;
	disposeItem(element: number): void;
	editItem?(item: number, value: string): Promise<IDebugVisualizationTreeItem | undefined>;
}

export class DebugVisualizer {
	public get name() {
		return this.viz.name;
	}

	public get iconPath() {
		return this.viz.iconPath;
	}

	public get iconClass() {
		return this.viz.iconClass;
	}

	constructor(private readonly handle: VisualizerHandle, private readonly viz: IDebugVisualization) { }

	public async resolve(token: CancellationToken) {
		return this.viz.visualization ??= await this.handle.resolveDebugVisualizer(this.viz, token);
	}

	public async execute() {
		await this.handle.executeDebugVisualizerCommand(this.viz.id);
	}
}

export interface IDebugVisualizerService {
	_serviceBrand: undefined;

	/**
	 * Gets visualizers applicable for the given Expression.
	 */
	getApplicableFor(expression: IExpression, token: CancellationToken): Promise<IReference<DebugVisualizer[]>>;

	/**
	 * Registers a new visualizer (called from the main thread debug service)
	 */
	register(handle: VisualizerHandle): IDisposable;

	/**
	 * Registers a new visualizer tree.
	 */
	registerTree(treeId: string, handle: VisualizerTreeHandle): IDisposable;

	/**
	 * Sets that a certa tree should be used for the visualized node
	 */
	getVisualizedNodeFor(treeId: string, expr: IExpression): Promise<VisualizedExpression | undefined>;

	/**
	 * Gets children for a visualized tree node.
	 */
	getVisualizedChildren(session: IDebugSession | undefined, treeId: string, treeElementId: number): Promise<IExpression[]>;

	/**
	 * Gets children for a visualized tree node.
	 */
	editTreeItem(treeId: string, item: IDebugVisualizationTreeItem, newValue: string): Promise<void>;
}

const emptyRef: IReference<DebugVisualizer[]> = { object: [], dispose: () => { } };

export class DebugVisualizerService implements IDebugVisualizerService {
	declare public readonly _serviceBrand: undefined;

	private readonly handles = new Map</* extId + \0 + vizId */ string, VisualizerHandle>();
	private readonly trees = new Map</* extId + \0 + treeId */ string, VisualizerTreeHandle>();
	private readonly didActivate = new Map<string, Promise<void>>();
	private registrations: { expr: ContextKeyExpression; id: string; extensionId: ExtensionIdentifier }[] = [];

	constructor(
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@ILogService private readonly logService: ILogService,
	) {
		visualizersExtensionPoint.setHandler((_, { added, removed }) => {
			this.registrations = this.registrations.filter(r =>
				!removed.some(e => ExtensionIdentifier.equals(e.description.identifier, r.extensionId)));
			added.forEach(e => this.processExtensionRegistration(e.description));
		});
	}

	/** @inheritdoc */
	public async getApplicableFor(variable: IExpression, token: CancellationToken): Promise<IReference<DebugVisualizer[]>> {
		if (!(variable instanceof Variable)) {
			return emptyRef;
		}
		const threadId = variable.getThreadId();
		if (threadId === undefined) { // an expression, not a variable
			return emptyRef;
		}

		const context = this.getVariableContext(threadId, variable);
		const overlay = getContextForVariable(this.contextKeyService, variable, [
			[CONTEXT_VARIABLE_NAME.key, variable.name],
			[CONTEXT_VARIABLE_VALUE.key, variable.value],
			[CONTEXT_VARIABLE_TYPE.key, variable.type],
		]);

		const maybeVisualizers = await Promise.all(this.registrations.map(async registration => {
			if (!overlay.contextMatchesRules(registration.expr)) {
				return;
			}

			let prom = this.didActivate.get(registration.id);
			if (!prom) {
				prom = this.extensionService.activateByEvent(`onDebugVisualizer:${registration.id}`);
				this.didActivate.set(registration.id, prom);
			}

			await prom;
			if (token.isCancellationRequested) {
				return;
			}

			const handle = this.handles.get(toKey(registration.extensionId, registration.id));
			return handle && { handle, result: await handle.provideDebugVisualizers(context, token) };
		}));

		const ref = {
			object: maybeVisualizers.filter(isDefined).flatMap(v => v.result.map(r => new DebugVisualizer(v.handle, r))),
			dispose: () => {
				for (const viz of maybeVisualizers) {
					viz?.handle.disposeDebugVisualizers(viz.result.map(r => r.id));
				}
			},
		};

		if (token.isCancellationRequested) {
			ref.dispose();
		}

		return ref;
	}

	/** @inheritdoc */
	public register(handle: VisualizerHandle): IDisposable {
		const key = toKey(handle.extensionId, handle.id);
		this.handles.set(key, handle);
		return toDisposable(() => this.handles.delete(key));
	}

	/** @inheritdoc */
	public registerTree(treeId: string, handle: VisualizerTreeHandle): IDisposable {
		this.trees.set(treeId, handle);
		return toDisposable(() => this.trees.delete(treeId));
	}

	/** @inheritdoc */
	public async getVisualizedNodeFor(treeId: string, expr: IExpression): Promise<VisualizedExpression | undefined> {
		if (!(expr instanceof Variable)) {
			return;
		}

		const threadId = expr.getThreadId();
		if (threadId === undefined) {
			return;
		}

		const tree = this.trees.get(treeId);
		if (!tree) {
			return;
		}

		try {
			const treeItem = await tree.getTreeItem(this.getVariableContext(threadId, expr));
			if (!treeItem) {
				return;
			}

			return new VisualizedExpression(expr.getSession(), this, treeId, treeItem, expr);
		} catch (e) {
			this.logService.warn('Failed to get visualized node', e);
			return;
		}
	}

	/** @inheritdoc */
	public async getVisualizedChildren(session: IDebugSession | undefined, treeId: string, treeElementId: number): Promise<IExpression[]> {
		const node = this.trees.get(treeId);
		const children = await node?.getChildren(treeElementId) || [];
		return children.map(c => new VisualizedExpression(session, this, treeId, c, undefined));
	}

	/** @inheritdoc */
	public async editTreeItem(treeId: string, treeItem: IDebugVisualizationTreeItem, newValue: string): Promise<void> {
		const newItem = await this.trees.get(treeId)?.editItem?.(treeItem.id, newValue);
		if (newItem) {
			Object.assign(treeItem, newItem); // replace in-place so rerenders work
		}
	}

	private getVariableContext(threadId: number, variable: Variable) {
		const context: IDebugVisualizationContext = {
			sessionId: variable.getSession()?.getId() || '',
			containerId: (variable.parent instanceof Variable ? variable.reference : undefined),
			threadId,
			variable: {
				name: variable.name,
				value: variable.value,
				type: variable.type,
				evaluateName: variable.evaluateName,
				variablesReference: variable.reference || 0,
				indexedVariables: variable.indexedVariables,
				memoryReference: variable.memoryReference,
				namedVariables: variable.namedVariables,
				presentationHint: variable.presentationHint,
			}
		};

		for (let p: IExpressionContainer = variable; p instanceof Variable; p = p.parent) {
			if (p.parent instanceof Scope) {
				context.frameId = p.parent.stackFrame.frameId;
			}
		}

		return context;
	}

	private processExtensionRegistration(ext: IExtensionDescription) {
		const viz = ext.contributes?.debugVisualizers;
		if (!(viz instanceof Array)) {
			return;
		}

		for (const { when, id } of viz) {
			try {
				const expr = ContextKeyExpr.deserialize(when);
				if (expr) {
					this.registrations.push({ expr, id, extensionId: ext.identifier });
				}
			} catch (e) {
				this.logService.error(`Error processing debug visualizer registration from extension '${ext.identifier.value}'`, e);
			}
		}
	}
}

const toKey = (extensionId: ExtensionIdentifier, id: string) => `${ExtensionIdentifier.toKey(extensionId)}\0${id}`;

const visualizersExtensionPoint = ExtensionsRegistry.registerExtensionPoint<{ id: string; when: string }[]>({
	extensionPoint: 'debugVisualizers',
	jsonSchema: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				id: {
					type: 'string',
					description: 'Name of the debug visualizer'
				},
				when: {
					type: 'string',
					description: 'Condition when the debug visualizer is applicable'
				}
			},
			required: ['id', 'when']
		}
	},
	activationEventsGenerator: function* (contribs) {
		for (const contrib of contribs) {
			if (contrib.id) {
				yield `onDebugVisualizer:${contrib.id}`;
			}
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/common/disassemblyViewInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/common/disassemblyViewInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditorInput } from '../../../common/editor/editorInput.js';
import { localize } from '../../../../nls.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';

const DisassemblyEditorIcon = registerIcon('disassembly-editor-label-icon', Codicon.debug, localize('disassemblyEditorLabelIcon', 'Icon of the disassembly editor label.'));

export class DisassemblyViewInput extends EditorInput {

	static readonly ID = 'debug.disassemblyView.input';

	override get typeId(): string {
		return DisassemblyViewInput.ID;
	}

	static _instance: DisassemblyViewInput;
	static get instance() {
		if (!DisassemblyViewInput._instance || DisassemblyViewInput._instance.isDisposed()) {
			DisassemblyViewInput._instance = new DisassemblyViewInput();
		}

		return DisassemblyViewInput._instance;
	}

	readonly resource = undefined;

	override getName(): string {
		return localize('disassemblyInputName', "Disassembly");
	}

	override getIcon(): ThemeIcon {
		return DisassemblyEditorIcon;
	}

	override matches(other: unknown): boolean {
		return other instanceof DisassemblyViewInput;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/common/loadedScriptsPicker.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/common/loadedScriptsPicker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../../../nls.js';
import { matchesFuzzy } from '../../../../base/common/filters.js';
import { Source } from './debugSource.js';
import { IQuickInputService, IQuickPickItem, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { IDebugService, IDebugSession } from './debug.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { getIconClasses } from '../../../../editor/common/services/getIconClasses.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';

import { dirname } from '../../../../base/common/resources.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';

export interface IPickerDebugItem extends IQuickPickItem {
	accept(): void;
}

/**
 * This function takes a regular quickpick and makes one for loaded scripts that has persistent headers
 * e.g. when some picks are filtered out, the ones that are visible still have its header.
 */
export async function showLoadedScriptMenu(accessor: ServicesAccessor) {
	const quickInputService = accessor.get(IQuickInputService);
	const debugService = accessor.get(IDebugService);
	const editorService = accessor.get(IEditorService);
	const sessions = debugService.getModel().getSessions(false);
	const modelService = accessor.get(IModelService);
	const languageService = accessor.get(ILanguageService);
	const labelService = accessor.get(ILabelService);

	const localDisposableStore = new DisposableStore();
	const quickPick = quickInputService.createQuickPick<IPickerDebugItem>({ useSeparators: true });
	localDisposableStore.add(quickPick);
	quickPick.matchOnLabel = quickPick.matchOnDescription = quickPick.matchOnDetail = quickPick.sortByLabel = false;
	quickPick.placeholder = nls.localize('moveFocusedView.selectView', "Search loaded scripts by name");
	quickPick.items = await _getPicks(quickPick.value, sessions, editorService, modelService, languageService, labelService);

	localDisposableStore.add(quickPick.onDidChangeValue(async () => {
		quickPick.items = await _getPicks(quickPick.value, sessions, editorService, modelService, languageService, labelService);
	}));
	localDisposableStore.add(quickPick.onDidAccept(() => {
		const selectedItem = quickPick.selectedItems[0];
		selectedItem.accept();
		quickPick.hide();
		localDisposableStore.dispose();
	}));
	quickPick.show();
}

async function _getPicksFromSession(session: IDebugSession, filter: string, editorService: IEditorService, modelService: IModelService, languageService: ILanguageService, labelService: ILabelService): Promise<Array<IPickerDebugItem | IQuickPickSeparator>> {
	const items: Array<IPickerDebugItem | IQuickPickSeparator> = [];
	items.push({ type: 'separator', label: session.name });
	const sources = await session.getLoadedSources();

	sources.forEach((element: Source) => {
		const pick = _createPick(element, filter, editorService, modelService, languageService, labelService);
		if (pick) {
			items.push(pick);
		}

	});
	return items;
}
async function _getPicks(filter: string, sessions: IDebugSession[], editorService: IEditorService, modelService: IModelService, languageService: ILanguageService, labelService: ILabelService): Promise<Array<IPickerDebugItem | IQuickPickSeparator>> {
	const loadedScriptPicks: Array<IPickerDebugItem | IQuickPickSeparator> = [];


	const picks = await Promise.all(
		sessions.map((session) => _getPicksFromSession(session, filter, editorService, modelService, languageService, labelService))
	);

	for (const row of picks) {
		for (const elem of row) {
			loadedScriptPicks.push(elem);
		}
	}
	return loadedScriptPicks;
}

function _createPick(source: Source, filter: string, editorService: IEditorService, modelService: IModelService, languageService: ILanguageService, labelService: ILabelService): IPickerDebugItem | undefined {

	const label = labelService.getUriBasenameLabel(source.uri);
	const desc = labelService.getUriLabel(dirname(source.uri));

	// manually filter so that headers don't get filtered out
	const labelHighlights = matchesFuzzy(filter, label, true);
	const descHighlights = matchesFuzzy(filter, desc, true);
	if (labelHighlights || descHighlights) {
		return {
			label,
			description: desc === '.' ? undefined : desc,
			highlights: { label: labelHighlights ?? undefined, description: descHighlights ?? undefined },
			iconClasses: getIconClasses(modelService, languageService, source.uri),
			accept: () => {
				if (source.available) {
					source.openInEditor(editorService, { startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 });
				}
			}
		};
	}
	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/common/replAccessibilityAnnouncer.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/common/replAccessibilityAnnouncer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IDebugService } from './debug.js';

export class ReplAccessibilityAnnouncer extends Disposable implements IWorkbenchContribution {
	static ID = 'debug.replAccessibilityAnnouncer';
	constructor(
		@IDebugService debugService: IDebugService,
		@IAccessibilityService accessibilityService: IAccessibilityService,
		@ILogService logService: ILogService
	) {
		super();
		const viewModel = debugService.getViewModel();
		const mutableDispoable = this._register(new MutableDisposable());
		this._register(viewModel.onDidFocusSession((session) => {
			mutableDispoable.clear();
			if (!session) {
				return;
			}
			mutableDispoable.value = session.onDidChangeReplElements((element) => {
				if (!element || !('originalExpression' in element)) {
					// element was removed or hasn't been resolved yet
					return;
				}
				const value = element.toString();
				accessibilityService.status(value);
				logService.trace('ReplAccessibilityAnnouncer#onDidChangeReplElements', element.originalExpression + ': ' + value);
			});
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/common/replModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/common/replModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import severity from '../../../../base/common/severity.js';
import { isObject, isString } from '../../../../base/common/types.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import * as nls from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDebugConfiguration, IDebugSession, IExpression, INestingReplElement, IReplElement, IReplElementSource, IStackFrame } from './debug.js';
import { ExpressionContainer } from './debugModel.js';

let topReplElementCounter = 0;
const getUniqueId = () => `topReplElement:${topReplElementCounter++}`;

/**
 * General case of data from DAP the `output` event. {@link ReplVariableElement}
 * is used instead only if there is a `variablesReference` with no `output` text.
 */
export class ReplOutputElement implements INestingReplElement {

	private _count = 1;
	private _onDidChangeCount = new Emitter<void>();

	constructor(
		public session: IDebugSession,
		private id: string,
		public value: string,
		public severity: severity,
		public sourceData?: IReplElementSource,
		public readonly expression?: IExpression,
	) {
	}

	toString(includeSource = false): string {
		let valueRespectCount = this.value;
		for (let i = 1; i < this.count; i++) {
			valueRespectCount += (valueRespectCount.endsWith('\n') ? '' : '\n') + this.value;
		}
		const sourceStr = (this.sourceData && includeSource) ? ` ${this.sourceData.source.name}` : '';
		return valueRespectCount + sourceStr;
	}

	getId(): string {
		return this.id;
	}

	getChildren(): Promise<IReplElement[]> {
		return this.expression?.getChildren() || Promise.resolve([]);
	}

	set count(value: number) {
		this._count = value;
		this._onDidChangeCount.fire();
	}

	get count(): number {
		return this._count;
	}

	get onDidChangeCount(): Event<void> {
		return this._onDidChangeCount.event;
	}

	get hasChildren() {
		return !!this.expression?.hasChildren;
	}
}

/** Top-level variable logged via DAP output when there's no `output` string */
export class ReplVariableElement implements INestingReplElement {
	public readonly hasChildren: boolean;
	private readonly id = generateUuid();

	constructor(
		private readonly session: IDebugSession,
		public readonly expression: IExpression,
		public readonly severity: severity,
		public readonly sourceData?: IReplElementSource,
	) {
		this.hasChildren = expression.hasChildren;
	}

	getSession() {
		return this.session;
	}

	getChildren(): IReplElement[] | Promise<IReplElement[]> {
		return this.expression.getChildren();
	}

	toString(): string {
		return this.expression.toString();
	}

	getId(): string {
		return this.id;
	}
}

export class RawObjectReplElement implements IExpression, INestingReplElement {

	private static readonly MAX_CHILDREN = 1000; // upper bound of children per value

	constructor(private id: string, public name: string, public valueObj: any, public sourceData?: IReplElementSource, public annotation?: string) { }

	getId(): string {
		return this.id;
	}

	getSession(): IDebugSession | undefined {
		return undefined;
	}

	get value(): string {
		if (this.valueObj === null) {
			return 'null';
		} else if (Array.isArray(this.valueObj)) {
			return `Array[${this.valueObj.length}]`;
		} else if (isObject(this.valueObj)) {
			return 'Object';
		} else if (isString(this.valueObj)) {
			return `"${this.valueObj}"`;
		}

		return String(this.valueObj) || '';
	}

	get hasChildren(): boolean {
		return (Array.isArray(this.valueObj) && this.valueObj.length > 0) || (isObject(this.valueObj) && Object.getOwnPropertyNames(this.valueObj).length > 0);
	}

	evaluateLazy(): Promise<void> {
		throw new Error('Method not implemented.');
	}

	getChildren(): Promise<IExpression[]> {
		let result: IExpression[] = [];
		if (Array.isArray(this.valueObj)) {
			result = (<any[]>this.valueObj).slice(0, RawObjectReplElement.MAX_CHILDREN)
				.map((v, index) => new RawObjectReplElement(`${this.id}:${index}`, String(index), v));
		} else if (isObject(this.valueObj)) {
			result = Object.getOwnPropertyNames(this.valueObj).slice(0, RawObjectReplElement.MAX_CHILDREN)
				.map((key, index) => new RawObjectReplElement(`${this.id}:${index}`, key, this.valueObj[key]));
		}

		return Promise.resolve(result);
	}

	toString(): string {
		return `${this.name}\n${this.value}`;
	}
}

export class ReplEvaluationInput implements IReplElement {
	private id: string;

	constructor(public value: string) {
		this.id = generateUuid();
	}

	toString(): string {
		return this.value;
	}

	getId(): string {
		return this.id;
	}
}

export class ReplEvaluationResult extends ExpressionContainer implements IReplElement {
	private _available = true;

	get available(): boolean {
		return this._available;
	}

	constructor(public readonly originalExpression: string) {
		super(undefined, undefined, 0, generateUuid());
	}

	override async evaluateExpression(expression: string, session: IDebugSession | undefined, stackFrame: IStackFrame | undefined, context: string): Promise<boolean> {
		const result = await super.evaluateExpression(expression, session, stackFrame, context);
		this._available = result;

		return result;
	}

	override toString(): string {
		return `${this.value}`;
	}
}

export class ReplGroup implements INestingReplElement {

	private children: IReplElement[] = [];
	private id: string;
	private ended = false;
	static COUNTER = 0;

	constructor(
		public readonly session: IDebugSession,
		public name: string,
		public autoExpand: boolean,
		public sourceData?: IReplElementSource
	) {
		this.id = `replGroup:${ReplGroup.COUNTER++}`;
	}

	get hasChildren() {
		return true;
	}

	getId(): string {
		return this.id;
	}

	toString(includeSource = false): string {
		const sourceStr = (includeSource && this.sourceData) ? ` ${this.sourceData.source.name}` : '';
		return this.name + sourceStr;
	}

	addChild(child: IReplElement): void {
		const lastElement = this.children.length ? this.children[this.children.length - 1] : undefined;
		if (lastElement instanceof ReplGroup && !lastElement.hasEnded) {
			lastElement.addChild(child);
		} else {
			this.children.push(child);
		}
	}

	getChildren(): IReplElement[] {
		return this.children;
	}

	end(): void {
		const lastElement = this.children.length ? this.children[this.children.length - 1] : undefined;
		if (lastElement instanceof ReplGroup && !lastElement.hasEnded) {
			lastElement.end();
		} else {
			this.ended = true;
		}
	}

	get hasEnded(): boolean {
		return this.ended;
	}
}

function areSourcesEqual(first: IReplElementSource | undefined, second: IReplElementSource | undefined): boolean {
	if (!first && !second) {
		return true;
	}
	if (first && second) {
		return first.column === second.column && first.lineNumber === second.lineNumber && first.source.uri.toString() === second.source.uri.toString();
	}

	return false;
}

export interface INewReplElementData {
	output: string;
	expression?: IExpression;
	sev: severity;
	source?: IReplElementSource;
}

export class ReplModel {
	private replElements: IReplElement[] = [];
	private readonly _onDidChangeElements = new Emitter<IReplElement | undefined>();
	readonly onDidChangeElements = this._onDidChangeElements.event;

	constructor(private readonly configurationService: IConfigurationService) { }

	getReplElements(): IReplElement[] {
		return this.replElements;
	}

	async addReplExpression(session: IDebugSession, stackFrame: IStackFrame | undefined, expression: string): Promise<void> {
		this.addReplElement(new ReplEvaluationInput(expression));
		const result = new ReplEvaluationResult(expression);
		await result.evaluateExpression(expression, session, stackFrame, 'repl');
		this.addReplElement(result);
	}

	appendToRepl(session: IDebugSession, { output, expression, sev, source }: INewReplElementData): void {
		const clearAnsiSequence = '\u001b[2J';
		const clearAnsiIndex = output.lastIndexOf(clearAnsiSequence);
		if (clearAnsiIndex !== -1) {
			// [2J is the ansi escape sequence for clearing the display http://ascii-table.com/ansi-escape-sequences.php
			this.removeReplExpressions();
			this.appendToRepl(session, { output: nls.localize('consoleCleared', "Console was cleared"), sev: severity.Ignore });
			output = output.substring(clearAnsiIndex + clearAnsiSequence.length);
		}

		if (expression) {
			// if there is an output string, prefer to show that, since the DA could
			// have formatted it nicely e.g. with ANSI color codes.
			this.addReplElement(output
				? new ReplOutputElement(session, getUniqueId(), output, sev, source, expression)
				: new ReplVariableElement(session, expression, sev, source));
			return;
		}

		this.appendOutputToRepl(session, output, sev, source);
	}

	private appendOutputToRepl(session: IDebugSession, output: string, sev: severity, source?: IReplElementSource): void {
		const config = this.configurationService.getValue<IDebugConfiguration>('debug');
		const previousElement = this.replElements.length ? this.replElements[this.replElements.length - 1] : undefined;

		// Handle concatenation of incomplete lines first
		if (previousElement instanceof ReplOutputElement && previousElement.severity === sev && areSourcesEqual(previousElement.sourceData, source)) {
			if (!previousElement.value.endsWith('\n') && !previousElement.value.endsWith('\r\n') && previousElement.count === 1) {
				// Concatenate with previous incomplete line
				const combinedOutput = previousElement.value + output;
				this.replElements[this.replElements.length - 1] = new ReplOutputElement(
					session, getUniqueId(), combinedOutput, sev, source);
				this._onDidChangeElements.fire(undefined);

				// If the combined output now forms a complete line and collapsing is enabled,
				// check if it can be collapsed with previous elements
				if (config.console.collapseIdenticalLines && combinedOutput.endsWith('\n')) {
					this.tryCollapseCompleteLine(sev, source);
				}

				// If the combined output contains multiple lines, apply line-level collapsing
				if (config.console.collapseIdenticalLines && combinedOutput.includes('\n')) {
					const lines = this.splitIntoLines(combinedOutput);
					if (lines.length > 1) {
						this.applyLineLevelCollapsing(session, sev, source);
					}
				}
				return;
			}
		}

		// If collapsing is enabled and the output contains line breaks, parse and collapse at line level
		if (config.console.collapseIdenticalLines && output.includes('\n')) {
			this.processMultiLineOutput(session, output, sev, source);
		} else {
			// For simple output without line breaks, use the original logic
			if (previousElement instanceof ReplOutputElement && previousElement.severity === sev && areSourcesEqual(previousElement.sourceData, source)) {
				if (previousElement.value === output && config.console.collapseIdenticalLines) {
					previousElement.count++;
					// No need to fire an event, just the count updates and badge will adjust automatically
					return;
				}
			}

			const element = new ReplOutputElement(session, getUniqueId(), output, sev, source);
			this.addReplElement(element);
		}
	}

	private tryCollapseCompleteLine(sev: severity, source?: IReplElementSource): void {
		// Try to collapse the last element with the second-to-last if they are identical complete lines
		if (this.replElements.length < 2) {
			return;
		}

		const lastElement = this.replElements[this.replElements.length - 1];
		const secondToLastElement = this.replElements[this.replElements.length - 2];

		if (lastElement instanceof ReplOutputElement &&
			secondToLastElement instanceof ReplOutputElement &&
			lastElement.severity === sev &&
			secondToLastElement.severity === sev &&
			areSourcesEqual(lastElement.sourceData, source) &&
			areSourcesEqual(secondToLastElement.sourceData, source) &&
			lastElement.value === secondToLastElement.value &&
			lastElement.count === 1 &&
			lastElement.value.endsWith('\n')) {

			// Collapse the last element into the second-to-last
			secondToLastElement.count += lastElement.count;
			this.replElements.pop();
			this._onDidChangeElements.fire(undefined);
		}
	}

	private processMultiLineOutput(session: IDebugSession, output: string, sev: severity, source?: IReplElementSource): void {
		// Split output into lines, preserving line endings
		const lines = this.splitIntoLines(output);

		for (const line of lines) {
			if (line.length === 0) { continue; }

			const previousElement = this.replElements.length ? this.replElements[this.replElements.length - 1] : undefined;

			// Check if this line can be collapsed with the previous one
			if (previousElement instanceof ReplOutputElement &&
				previousElement.severity === sev &&
				areSourcesEqual(previousElement.sourceData, source) &&
				previousElement.value === line) {
				previousElement.count++;
				// No need to fire an event, just the count updates and badge will adjust automatically
			} else {
				const element = new ReplOutputElement(session, getUniqueId(), line, sev, source);
				this.addReplElement(element);
			}
		}
	}

	private splitIntoLines(text: string): string[] {
		// Split text into lines while preserving line endings, using indexOf for efficiency
		const lines: string[] = [];
		let start = 0;

		while (start < text.length) {
			const nextLF = text.indexOf('\n', start);
			if (nextLF === -1) {
				lines.push(text.substring(start));
				break;
			}
			lines.push(text.substring(start, nextLF + 1));
			start = nextLF + 1;
		}

		return lines;
	}

	private applyLineLevelCollapsing(session: IDebugSession, sev: severity, source?: IReplElementSource): void {
		// Apply line-level collapsing to the last element if it contains multiple lines
		const lastElement = this.replElements[this.replElements.length - 1];
		if (!(lastElement instanceof ReplOutputElement) || lastElement.severity !== sev || !areSourcesEqual(lastElement.sourceData, source)) {
			return;
		}

		const lines = this.splitIntoLines(lastElement.value);
		if (lines.length <= 1) {
			return; // No multiple lines to collapse
		}

		// Remove the last element and reprocess it as multiple lines
		this.replElements.pop();

		// Process each line and try to collapse with existing elements
		for (const line of lines) {
			if (line.length === 0) { continue; }

			const previousElement = this.replElements.length ? this.replElements[this.replElements.length - 1] : undefined;

			// Check if this line can be collapsed with the previous one
			if (previousElement instanceof ReplOutputElement &&
				previousElement.severity === sev &&
				areSourcesEqual(previousElement.sourceData, source) &&
				previousElement.value === line) {
				previousElement.count++;
			} else {
				const element = new ReplOutputElement(session, getUniqueId(), line, sev, source);
				this.addReplElement(element);
			}
		}

		this._onDidChangeElements.fire(undefined);
	}

	startGroup(session: IDebugSession, name: string, autoExpand: boolean, sourceData?: IReplElementSource): void {
		const group = new ReplGroup(session, name, autoExpand, sourceData);
		this.addReplElement(group);
	}

	endGroup(): void {
		const lastElement = this.replElements[this.replElements.length - 1];
		if (lastElement instanceof ReplGroup) {
			lastElement.end();
		}
	}

	private addReplElement(newElement: IReplElement): void {
		const lastElement = this.replElements.length ? this.replElements[this.replElements.length - 1] : undefined;
		if (lastElement instanceof ReplGroup && !lastElement.hasEnded) {
			lastElement.addChild(newElement);
		} else {
			this.replElements.push(newElement);
			const config = this.configurationService.getValue<IDebugConfiguration>('debug');
			if (this.replElements.length > config.console.maximumLines) {
				this.replElements.splice(0, this.replElements.length - config.console.maximumLines);
			}
		}
		this._onDidChangeElements.fire(newElement);
	}

	removeReplExpressions(): void {
		if (this.replElements.length > 0) {
			this.replElements = [];
			this._onDidChangeElements.fire(undefined);
		}
	}

	/** Returns a new REPL model that's a copy of this one. */
	clone() {
		const newRepl = new ReplModel(this.configurationService);
		newRepl.replElements = this.replElements.slice();
		return newRepl;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/electron-browser/extensionHostDebugService.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/electron-browser/extensionHostDebugService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExtensionHostDebugService } from '../../../../platform/debug/common/extensionHostDebug.js';
import { registerMainProcessRemoteService } from '../../../../platform/ipc/electron-browser/services.js';
import { ExtensionHostDebugChannelClient, ExtensionHostDebugBroadcastChannel } from '../../../../platform/debug/common/extensionHostDebugIpc.js';

registerMainProcessRemoteService(IExtensionHostDebugService, ExtensionHostDebugBroadcastChannel.ChannelName, { channelClientCtor: ExtensionHostDebugChannelClient });
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/node/debugAdapter.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/node/debugAdapter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as cp from 'child_process';
import * as net from 'net';
import * as stream from 'stream';
import * as objects from '../../../../base/common/objects.js';
import * as path from '../../../../base/common/path.js';
import * as platform from '../../../../base/common/platform.js';
import * as strings from '../../../../base/common/strings.js';
import { Promises } from '../../../../base/node/pfs.js';
import * as nls from '../../../../nls.js';
import { IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { IDebugAdapterExecutable, IDebugAdapterNamedPipeServer, IDebugAdapterServer, IDebuggerContribution, IPlatformSpecificAdapterContribution } from '../common/debug.js';
import { AbstractDebugAdapter } from '../common/abstractDebugAdapter.js';
import { killTree } from '../../../../base/node/processes.js';

/**
 * An implementation that communicates via two streams with the debug adapter.
 */
export abstract class StreamDebugAdapter extends AbstractDebugAdapter {

	private static readonly TWO_CRLF = '\r\n\r\n';
	private static readonly HEADER_LINESEPARATOR = /\r?\n/;	// allow for non-RFC 2822 conforming line separators
	private static readonly HEADER_FIELDSEPARATOR = /: */;

	private outputStream!: stream.Writable;
	private rawData = Buffer.allocUnsafe(0);
	private contentLength = -1;

	constructor() {
		super();
	}

	protected connect(readable: stream.Readable, writable: stream.Writable): void {

		this.outputStream = writable;
		this.rawData = Buffer.allocUnsafe(0);
		this.contentLength = -1;

		readable.on('data', (data: Buffer) => this.handleData(data));
	}

	sendMessage(message: DebugProtocol.ProtocolMessage): void {

		if (this.outputStream) {
			const json = JSON.stringify(message);
			this.outputStream.write(`Content-Length: ${Buffer.byteLength(json, 'utf8')}${StreamDebugAdapter.TWO_CRLF}${json}`, 'utf8');
		}
	}

	private handleData(data: Buffer): void {

		this.rawData = Buffer.concat([this.rawData, data]);

		while (true) {
			if (this.contentLength >= 0) {
				if (this.rawData.length >= this.contentLength) {
					const message = this.rawData.toString('utf8', 0, this.contentLength);
					this.rawData = this.rawData.slice(this.contentLength);
					this.contentLength = -1;
					if (message.length > 0) {
						try {
							this.acceptMessage(<DebugProtocol.ProtocolMessage>JSON.parse(message));
						} catch (e) {
							this._onError.fire(new Error((e.message || e) + '\n' + message));
						}
					}
					continue;	// there may be more complete messages to process
				}
			} else {
				const idx = this.rawData.indexOf(StreamDebugAdapter.TWO_CRLF);
				if (idx !== -1) {
					const header = this.rawData.toString('utf8', 0, idx);
					const lines = header.split(StreamDebugAdapter.HEADER_LINESEPARATOR);
					for (const h of lines) {
						const kvPair = h.split(StreamDebugAdapter.HEADER_FIELDSEPARATOR);
						if (kvPair[0] === 'Content-Length') {
							this.contentLength = Number(kvPair[1]);
						}
					}
					this.rawData = this.rawData.slice(idx + StreamDebugAdapter.TWO_CRLF.length);
					continue;
				}
			}
			break;
		}
	}
}

export abstract class NetworkDebugAdapter extends StreamDebugAdapter {

	protected socket?: net.Socket;

	protected abstract createConnection(connectionListener: () => void): net.Socket;

	startSession(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			let connected = false;

			this.socket = this.createConnection(() => {
				this.connect(this.socket!, this.socket!);
				resolve();
				connected = true;
			});

			this.socket.on('close', () => {
				if (connected) {
					this._onError.fire(new Error('connection closed'));
				} else {
					reject(new Error('connection closed'));
				}
			});

			this.socket.on('error', error => {
				// On ipv6 posix this can be an AggregateError which lacks a message. Use the first.
				if (error instanceof AggregateError) {
					error = error.errors[0];
				}

				if (connected) {
					this._onError.fire(error);
				} else {
					reject(error);
				}
			});
		});
	}

	async stopSession(): Promise<void> {
		await this.cancelPendingRequests();
		if (this.socket) {
			this.socket.end();
			this.socket = undefined;
		}
	}
}

/**
 * An implementation that connects to a debug adapter via a socket.
*/
export class SocketDebugAdapter extends NetworkDebugAdapter {

	constructor(private adapterServer: IDebugAdapterServer) {
		super();
	}

	protected createConnection(connectionListener: () => void): net.Socket {
		return net.createConnection(this.adapterServer.port, this.adapterServer.host || '127.0.0.1', connectionListener);
	}
}

/**
 * An implementation that connects to a debug adapter via a NamedPipe (on Windows)/UNIX Domain Socket (on non-Windows).
 */
export class NamedPipeDebugAdapter extends NetworkDebugAdapter {

	constructor(private adapterServer: IDebugAdapterNamedPipeServer) {
		super();
	}

	protected createConnection(connectionListener: () => void): net.Socket {
		return net.createConnection(this.adapterServer.path, connectionListener);
	}
}

/**
 * An implementation that launches the debug adapter as a separate process and communicates via stdin/stdout.
*/
export class ExecutableDebugAdapter extends StreamDebugAdapter {

	private serverProcess: cp.ChildProcess | undefined;

	constructor(private adapterExecutable: IDebugAdapterExecutable, private debugType: string) {
		super();
	}

	async startSession(): Promise<void> {

		const command = this.adapterExecutable.command;
		const args = this.adapterExecutable.args;
		const options = this.adapterExecutable.options || {};

		try {
			// verify executables asynchronously
			if (command) {
				if (path.isAbsolute(command)) {
					const commandExists = await Promises.exists(command);
					if (!commandExists) {
						throw new Error(nls.localize('debugAdapterBinNotFound', "Debug adapter executable '{0}' does not exist.", command));
					}
				} else {
					// relative path
					if (command.indexOf('/') < 0 && command.indexOf('\\') < 0) {
						// no separators: command looks like a runtime name like 'node' or 'mono'
						// TODO: check that the runtime is available on PATH
					}
				}
			} else {
				throw new Error(nls.localize({ key: 'debugAdapterCannotDetermineExecutable', comment: ['Adapter executable file not found'] },
					"Cannot determine executable for debug adapter '{0}'.", this.debugType));
			}

			let env = process.env;
			if (options.env && Object.keys(options.env).length > 0) {
				env = objects.mixin(objects.deepClone(process.env), options.env);
			}

			if (command === 'node') {
				if (Array.isArray(args) && args.length > 0) {
					const isElectron = !!process.env['ELECTRON_RUN_AS_NODE'] || !!process.versions['electron'];
					const forkOptions: cp.ForkOptions = {
						env: env,
						execArgv: isElectron ? ['-e', 'delete process.env.ELECTRON_RUN_AS_NODE;require(process.argv[1])'] : [],
						silent: true
					};
					if (options.cwd) {
						forkOptions.cwd = options.cwd;
					}
					const child = cp.fork(args[0], args.slice(1), forkOptions);
					if (!child.pid) {
						throw new Error(nls.localize('unableToLaunchDebugAdapter', "Unable to launch debug adapter from '{0}'.", args[0]));
					}
					this.serverProcess = child;
				} else {
					throw new Error(nls.localize('unableToLaunchDebugAdapterNoArgs', "Unable to launch debug adapter."));
				}
			} else {
				let spawnCommand = command;
				let spawnArgs = args;
				const spawnOptions: cp.SpawnOptions = {
					env: env
				};
				if (options.cwd) {
					spawnOptions.cwd = options.cwd;
				}
				if (platform.isWindows && (command.endsWith('.bat') || command.endsWith('.cmd'))) {
					// https://github.com/microsoft/vscode/issues/224184
					spawnOptions.shell = true;
					spawnCommand = `"${command}"`;
					spawnArgs = args.map(a => {
						a = a.replace(/"/g, '\\"'); // Escape existing double quotes with \
						// Wrap in double quotes
						return `"${a}"`;
					});
				}

				this.serverProcess = cp.spawn(spawnCommand, spawnArgs, spawnOptions);
			}

			this.serverProcess.on('error', err => {
				this._onError.fire(err);
			});
			this.serverProcess.on('exit', (code, signal) => {
				this._onExit.fire(code);
			});

			this.serverProcess.stdout!.on('close', () => {
				this._onError.fire(new Error('read error'));
			});
			this.serverProcess.stdout!.on('error', error => {
				this._onError.fire(error);
			});

			this.serverProcess.stdin!.on('error', error => {
				this._onError.fire(error);
			});

			this.serverProcess.stderr!.resume();

			// finally connect to the DA
			this.connect(this.serverProcess.stdout!, this.serverProcess.stdin!);

		} catch (err) {
			this._onError.fire(err);
		}
	}

	async stopSession(): Promise<void> {

		if (!this.serverProcess) {
			return Promise.resolve(undefined);
		}

		// when killing a process in windows its child
		// processes are *not* killed but become root
		// processes. Therefore we use TASKKILL.EXE
		await this.cancelPendingRequests();
		if (platform.isWindows) {
			return killTree(this.serverProcess!.pid!, true).catch(() => {
				this.serverProcess?.kill();
			});
		} else {
			this.serverProcess.kill('SIGTERM');
			return Promise.resolve(undefined);
		}
	}

	private static extract(platformContribution: IPlatformSpecificAdapterContribution, extensionFolderPath: string): IDebuggerContribution | undefined {
		if (!platformContribution) {
			return undefined;
		}

		const result: IDebuggerContribution = Object.create(null);
		if (platformContribution.runtime) {
			if (platformContribution.runtime.indexOf('./') === 0) {	// TODO
				result.runtime = path.join(extensionFolderPath, platformContribution.runtime);
			} else {
				result.runtime = platformContribution.runtime;
			}
		}
		if (platformContribution.runtimeArgs) {
			result.runtimeArgs = platformContribution.runtimeArgs;
		}
		if (platformContribution.program) {
			if (!path.isAbsolute(platformContribution.program)) {
				result.program = path.join(extensionFolderPath, platformContribution.program);
			} else {
				result.program = platformContribution.program;
			}
		}
		if (platformContribution.args) {
			result.args = platformContribution.args;
		}

		const contribution = platformContribution as IDebuggerContribution;

		if (contribution.win) {
			result.win = ExecutableDebugAdapter.extract(contribution.win, extensionFolderPath);
		}
		if (contribution.winx86) {
			result.winx86 = ExecutableDebugAdapter.extract(contribution.winx86, extensionFolderPath);
		}
		if (contribution.windows) {
			result.windows = ExecutableDebugAdapter.extract(contribution.windows, extensionFolderPath);
		}
		if (contribution.osx) {
			result.osx = ExecutableDebugAdapter.extract(contribution.osx, extensionFolderPath);
		}
		if (contribution.linux) {
			result.linux = ExecutableDebugAdapter.extract(contribution.linux, extensionFolderPath);
		}
		return result;
	}

	static platformAdapterExecutable(extensionDescriptions: IExtensionDescription[], debugType: string): IDebugAdapterExecutable | undefined {
		let result: IDebuggerContribution = Object.create(null);
		debugType = debugType.toLowerCase();

		// merge all contributions into one
		for (const ed of extensionDescriptions) {
			if (ed.contributes) {
				const debuggers = <IDebuggerContribution[]>ed.contributes['debuggers'];
				if (debuggers && debuggers.length > 0) {
					debuggers.filter(dbg => typeof dbg.type === 'string' && strings.equalsIgnoreCase(dbg.type, debugType)).forEach(dbg => {
						// extract relevant attributes and make them absolute where needed
						const extractedDbg = ExecutableDebugAdapter.extract(dbg, ed.extensionLocation.fsPath);

						// merge
						result = objects.mixin(result, extractedDbg, ed.isBuiltin);
					});
				}
			}
		}

		// select the right platform
		let platformInfo: IPlatformSpecificAdapterContribution | undefined;
		if (platform.isWindows && !process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432')) {
			platformInfo = result.winx86 || result.win || result.windows;
		} else if (platform.isWindows) {
			platformInfo = result.win || result.windows;
		} else if (platform.isMacintosh) {
			platformInfo = result.osx;
		} else if (platform.isLinux) {
			platformInfo = result.linux;
		}
		platformInfo = platformInfo || result;

		// these are the relevant attributes
		const program = platformInfo.program || result.program;
		const args = platformInfo.args || result.args;
		const runtime = platformInfo.runtime || result.runtime;
		const runtimeArgs = platformInfo.runtimeArgs || result.runtimeArgs;

		if (runtime) {
			return {
				type: 'executable',
				command: runtime,
				args: (runtimeArgs || []).concat(typeof program === 'string' ? [program] : []).concat(args || [])
			};
		} else if (program) {
			return {
				type: 'executable',
				command: program,
				args: args || []
			};
		}

		// nothing found
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/node/telemetryApp.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/node/telemetryApp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Server } from '../../../../base/parts/ipc/node/ipc.cp.js';
import { TelemetryAppenderChannel } from '../../../../platform/telemetry/common/telemetryIpc.js';
import { OneDataSystemAppender } from '../../../../platform/telemetry/node/1dsAppender.js';

const appender = new OneDataSystemAppender(undefined, false, process.argv[2], JSON.parse(process.argv[3]), process.argv[4]);
process.once('exit', () => appender.flush());

const channel = new TelemetryAppenderChannel([appender]);
const server = new Server('telemetry');
server.registerChannel('telemetryAppender', channel);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/node/terminals.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/node/terminals.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as cp from 'child_process';
import { getDriveLetter } from '../../../../base/common/extpath.js';
import * as platform from '../../../../base/common/platform.js';

function spawnAsPromised(command: string, args: string[]): Promise<string> {
	return new Promise((resolve, reject) => {
		let stdout = '';
		const child = cp.spawn(command, args);
		if (child.pid) {
			child.stdout.on('data', (data: Buffer) => {
				stdout += data.toString();
			});
		}
		child.on('error', err => {
			reject(err);
		});
		child.on('close', code => {
			resolve(stdout);
		});
	});
}

export async function hasChildProcesses(processId: number | undefined): Promise<boolean> {
	if (processId) {

		// if shell has at least one child process, assume that shell is busy
		if (platform.isWindows) {
			const windowsProcessTree = await import('@vscode/windows-process-tree');
			return new Promise<boolean>(resolve => {
				windowsProcessTree.getProcessTree(processId, processTree => {
					resolve(!!processTree && processTree.children.length > 0);
				});
			});
		} else {
			return spawnAsPromised('/usr/bin/pgrep', ['-lP', String(processId)]).then(stdout => {
				const r = stdout.trim();
				if (r.length === 0 || r.indexOf(' tmux') >= 0) { // ignore 'tmux'; see #43683
					return false;
				} else {
					return true;
				}
			}, error => {
				return true;
			});
		}
	}
	// fall back to safe side
	return Promise.resolve(true);
}

const enum ShellType { cmd, powershell, bash }


export function prepareCommand(shell: string, args: string[], argsCanBeInterpretedByShell: boolean, cwd?: string, env?: { [key: string]: string | null }): string {

	shell = shell.trim().toLowerCase();

	// try to determine the shell type
	let shellType;
	if (shell.indexOf('powershell') >= 0 || shell.indexOf('pwsh') >= 0) {
		shellType = ShellType.powershell;
	} else if (shell.indexOf('cmd.exe') >= 0) {
		shellType = ShellType.cmd;
	} else if (shell.indexOf('bash') >= 0) {
		shellType = ShellType.bash;
	} else if (platform.isWindows) {
		shellType = ShellType.cmd; // pick a good default for Windows
	} else {
		shellType = ShellType.bash;	// pick a good default for anything else
	}

	let quote: (s: string) => string;
	// begin command with a space to avoid polluting shell history
	let command = ' ';

	switch (shellType) {

		case ShellType.powershell:

			quote = (s: string) => {
				s = s.replace(/\'/g, '\'\'');
				if (s.length > 0 && s.charAt(s.length - 1) === '\\') {
					return `'${s}\\'`;
				}
				return `'${s}'`;
			};

			if (cwd) {
				const driveLetter = getDriveLetter(cwd);
				if (driveLetter) {
					command += `${driveLetter}:; `;
				}
				command += `cd ${quote(cwd)}; `;
			}
			if (env) {
				for (const key in env) {
					const value = env[key];
					if (value === null) {
						command += `Remove-Item env:${key}; `;
					} else {
						command += `\${env:${key}}='${value}'; `;
					}
				}
			}
			if (args.length > 0) {
				const arg = args.shift()!;
				const cmd = argsCanBeInterpretedByShell ? arg : quote(arg);
				command += (cmd[0] === '\'') ? `& ${cmd} ` : `${cmd} `;
				for (const a of args) {
					command += (a === '<' || a === '>' || argsCanBeInterpretedByShell) ? a : quote(a);
					command += ' ';
				}
			}
			break;

		case ShellType.cmd:

			quote = (s: string) => {
				// Note: Wrapping in cmd /C "..." complicates the escaping.
				// cmd /C "node -e "console.log(process.argv)" """A^>0"""" # prints "A>0"
				// cmd /C "node -e "console.log(process.argv)" "foo^> bar"" # prints foo> bar
				// Outside of the cmd /C, it could be a simple quoting, but here, the ^ is needed too
				s = s.replace(/\"/g, '""');
				s = s.replace(/([><!^&|])/g, '^$1');
				return (' "'.split('').some(char => s.includes(char)) || s.length === 0) ? `"${s}"` : s;
			};

			if (cwd) {
				const driveLetter = getDriveLetter(cwd);
				if (driveLetter) {
					command += `${driveLetter}: && `;
				}
				command += `cd ${quote(cwd)} && `;
			}
			if (env) {
				command += 'cmd /C "';
				for (const key in env) {
					let value = env[key];
					if (value === null) {
						command += `set "${key}=" && `;
					} else {
						value = value.replace(/[&^|<>]/g, s => `^${s}`);
						command += `set "${key}=${value}" && `;
					}
				}
			}
			for (const a of args) {
				command += (a === '<' || a === '>' || argsCanBeInterpretedByShell) ? a : quote(a);
				command += ' ';
			}
			if (env) {
				command += '"';
			}
			break;

		case ShellType.bash: {

			quote = (s: string) => {
				s = s.replace(/(["'\\\$!><#()\[\]*&^| ;{}?`])/g, '\\$1');
				return s.length === 0 ? `""` : s;
			};

			const hardQuote = (s: string) => {
				return /[^\w@%\/+=,.:^-]/.test(s) ? `'${s.replace(/'/g, '\'\\\'\'')}'` : s;
			};

			if (cwd) {
				command += `cd ${quote(cwd)} ; `;
			}
			if (env) {
				command += '/usr/bin/env';
				for (const key in env) {
					const value = env[key];
					if (value === null) {
						command += ` -u ${hardQuote(key)}`;
					} else {
						command += ` ${hardQuote(`${key}=${value}`)}`;
					}
				}
				command += ' ';
			}
			for (const a of args) {
				command += (a === '<' || a === '>' || argsCanBeInterpretedByShell) ? a : quote(a);
				command += ' ';
			}
			break;
		}
	}

	return command;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/browser/baseDebugView.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/browser/baseDebugView.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable no-restricted-syntax */

import assert from 'assert';
import * as dom from '../../../../../base/browser/dom.js';
import { HighlightedLabel } from '../../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { isWindows } from '../../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { NullHoverService } from '../../../../../platform/hover/test/browser/nullHoverService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { renderViewTree } from '../../browser/baseDebugView.js';
import { DebugExpressionRenderer } from '../../browser/debugExpressionRenderer.js';
import { isStatusbarInDebugMode } from '../../browser/statusbarColorProvider.js';
import { State } from '../../common/debug.js';
import { Expression, Scope, StackFrame, Thread, Variable } from '../../common/debugModel.js';
import { MockSession } from '../common/mockDebug.js';
import { createTestSession } from './callStack.test.js';
import { createMockDebugModel } from './mockDebugModel.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
const $ = dom.$;


suite('Debug - Base Debug View', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	let renderer: DebugExpressionRenderer;
	let configurationService: TestConfigurationService;

	function assertVariable(session: MockSession, scope: Scope, disposables: Pick<DisposableStore, 'add'>, displayType: boolean) {
		let variable = new Variable(session, 1, scope, 2, 'foo', 'bar.foo', undefined, 0, 0, undefined, {}, 'string');
		let expression = $('.');
		let name = $('.');
		let type = $('.');
		let value = $('.');
		const label = new HighlightedLabel(name);
		const lazyButton = $('.');
		const store = disposables.add(new DisposableStore());
		store.add(renderer.renderVariable({ expression, name, type, value, label, lazyButton }, variable, { showChanged: false }));

		assert.strictEqual(label.element.textContent, 'foo');
		assert.strictEqual(value.textContent, '');

		variable.value = 'hey';
		expression = $('.');
		name = $('.');
		type = $('.');
		value = $('.');
		store.add(renderer.renderVariable({ expression, name, type, value, label, lazyButton }, variable, { showChanged: false }));
		assert.strictEqual(value.textContent, 'hey');
		assert.strictEqual(label.element.textContent, displayType ? 'foo: ' : 'foo =');
		assert.strictEqual(type.textContent, displayType ? 'string =' : '');

		variable.value = isWindows ? 'C:\\foo.js:5' : '/foo.js:5';
		expression = $('.');
		name = $('.');
		type = $('.');
		value = $('.');
		store.add(renderer.renderVariable({ expression, name, type, value, label, lazyButton }, variable, { showChanged: false }));
		assert.ok(value.querySelector('a'));
		assert.strictEqual(value.querySelector('a')!.textContent, variable.value);

		variable = new Variable(session, 1, scope, 2, 'console', 'console', '5', 0, 0, undefined, { kind: 'virtual' });
		expression = $('.');
		name = $('.');
		type = $('.');
		value = $('.');
		store.add(renderer.renderVariable({ expression, name, type, value, label, lazyButton }, variable, { showChanged: false }));
		assert.strictEqual(name.className, 'virtual');
		assert.strictEqual(label.element.textContent, 'console =');
		assert.strictEqual(value.className, 'value number');

		variable = new Variable(session, 1, scope, 2, 'xpto', 'xpto.xpto', undefined, 0, 0, undefined, {}, 'custom-type');
		store.add(renderer.renderVariable({ expression, name, type, value, label, lazyButton }, variable, { showChanged: false }));
		assert.strictEqual(label.element.textContent, 'xpto');
		assert.strictEqual(value.textContent, '');
		variable.value = '2';
		expression = $('.');
		name = $('.');
		type = $('.');
		value = $('.');
		store.add(renderer.renderVariable({ expression, name, type, value, label, lazyButton }, variable, { showChanged: false }));
		assert.strictEqual(value.textContent, '2');
		assert.strictEqual(label.element.textContent, displayType ? 'xpto: ' : 'xpto =');
		assert.strictEqual(type.textContent, displayType ? 'custom-type =' : '');

		label.dispose();
	}

	/**
	 * Instantiate services for use by the functions being tested.
	 */
	setup(() => {
		const instantiationService: TestInstantiationService = workbenchInstantiationService(undefined, disposables);
		configurationService = instantiationService.createInstance(TestConfigurationService);
		instantiationService.stub(IConfigurationService, configurationService);
		instantiationService.stub(IHoverService, NullHoverService);
		renderer = instantiationService.createInstance(DebugExpressionRenderer);
	});

	test('render view tree', () => {
		const container = $('.container');
		const treeContainer = renderViewTree(container);

		assert.strictEqual(treeContainer.className, 'debug-view-content file-icon-themable-tree');
		assert.strictEqual(container.childElementCount, 1);
		assert.strictEqual(container.firstChild, treeContainer);
		assert.strictEqual(dom.isHTMLDivElement(treeContainer), true);
	});

	test('render expression value', () => {
		let container = $('.container');
		const store = disposables.add(new DisposableStore());
		store.add(renderer.renderValue(container, 'render \n me', {}));
		assert.strictEqual(container.className, 'container value');
		assert.strictEqual(container.textContent, 'render \n me');

		const expression = new Expression('console');
		expression.value = 'Object';
		container = $('.container');
		store.add(renderer.renderValue(container, expression, { colorize: true }));
		assert.strictEqual(container.className, 'container value unavailable error');

		expression.available = true;
		expression.value = '"string value"';
		container = $('.container');
		store.add(renderer.renderValue(container, expression, { colorize: true }));
		assert.strictEqual(container.className, 'container value string');
		assert.strictEqual(container.textContent, '"string value"');

		expression.type = 'boolean';
		container = $('.container');
		store.add(renderer.renderValue(container, expression, { colorize: true }));
		assert.strictEqual(container.className, 'container value boolean');
		assert.strictEqual(container.textContent, expression.value);

		expression.value = 'this is a long string';
		container = $('.container');
		store.add(renderer.renderValue(container, expression, { colorize: true, maxValueLength: 4 }));
		assert.strictEqual(container.textContent, 'this...');

		expression.value = isWindows ? 'C:\\foo.js:5' : '/foo.js:5';
		container = $('.container');
		store.add(renderer.renderValue(container, expression, { colorize: true }));
		assert.ok(container.querySelector('a'));
		assert.strictEqual(container.querySelector('a')!.textContent, expression.value);
	});

	test('render variable', () => {
		const session = new MockSession();
		const thread = new Thread(session, 'mockthread', 1);
		const range = {
			startLineNumber: 1,
			startColumn: 1,
			endLineNumber: undefined!,
			endColumn: undefined!
		};
		const stackFrame = new StackFrame(thread, 1, null!, 'app.js', 'normal', range, 0, true);
		const scope = new Scope(stackFrame, 1, 'local', 1, false, 10, 10);

		configurationService.setUserConfiguration('debug.showVariableTypes', false);
		assertVariable(session, scope, disposables, false);

	});

	test('render variable with display type setting', () => {
		const session = new MockSession();
		const thread = new Thread(session, 'mockthread', 1);
		const range = {
			startLineNumber: 1,
			startColumn: 1,
			endLineNumber: undefined!,
			endColumn: undefined!
		};
		const stackFrame = new StackFrame(thread, 1, null!, 'app.js', 'normal', range, 0, true);
		const scope = new Scope(stackFrame, 1, 'local', 1, false, 10, 10);

		configurationService.setUserConfiguration('debug.showVariableTypes', true);
		assertVariable(session, scope, disposables, true);
	});

	test('statusbar in debug mode', () => {
		const model = createMockDebugModel(disposables);
		const session = disposables.add(createTestSession(model));
		const session2 = disposables.add(createTestSession(model, undefined, { suppressDebugStatusbar: true }));
		assert.strictEqual(isStatusbarInDebugMode(State.Inactive, []), false);
		assert.strictEqual(isStatusbarInDebugMode(State.Initializing, [session]), false);
		assert.strictEqual(isStatusbarInDebugMode(State.Running, [session]), true);
		assert.strictEqual(isStatusbarInDebugMode(State.Stopped, [session]), true);

		assert.strictEqual(isStatusbarInDebugMode(State.Running, [session2]), false);
		assert.strictEqual(isStatusbarInDebugMode(State.Running, [session, session2]), true);

		session.configuration.noDebug = true;
		assert.strictEqual(isStatusbarInDebugMode(State.Running, [session]), false);
		assert.strictEqual(isStatusbarInDebugMode(State.Running, [session, session2]), false);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/browser/breakpoints.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/browser/breakpoints.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { dispose } from '../../../../../base/common/lifecycle.js';
import { URI as uri } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { OverviewRulerLane } from '../../../../../editor/common/model.js';
import { LanguageService } from '../../../../../editor/common/services/languageService.js';
import { createTextModel } from '../../../../../editor/test/common/testTextModel.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { createBreakpointDecorations } from '../../browser/breakpointEditorContribution.js';
import { getBreakpointMessageAndIcon, getExpandedBodySize } from '../../browser/breakpointsView.js';
import { DataBreakpointSetType, IBreakpointData, IBreakpointUpdateData, IDebugService, State } from '../../common/debug.js';
import { Breakpoint, DebugModel } from '../../common/debugModel.js';
import { createTestSession } from './callStack.test.js';
import { createMockDebugModel, mockUriIdentityService } from './mockDebugModel.js';
import { MockDebugService, MockDebugStorage } from '../common/mockDebug.js';
import { MockLabelService } from '../../../../services/label/test/common/mockLabelService.js';
import { TestStorageService } from '../../../../test/common/workbenchTestServices.js';

function addBreakpointsAndCheckEvents(model: DebugModel, uri: uri, data: IBreakpointData[]) {
	let eventCount = 0;
	const toDispose = model.onDidChangeBreakpoints(e => {
		assert.strictEqual(e?.sessionOnly, false);
		assert.strictEqual(e?.changed, undefined);
		assert.strictEqual(e?.removed, undefined);
		const added = e?.added;
		assert.notStrictEqual(added, undefined);
		assert.strictEqual(added!.length, data.length);
		eventCount++;
		dispose(toDispose);
		for (let i = 0; i < data.length; i++) {
			assert.strictEqual(e.added![i] instanceof Breakpoint, true);
			assert.strictEqual((e.added![i] as Breakpoint).lineNumber, data[i].lineNumber);
		}
	});
	const bps = model.addBreakpoints(uri, data);
	assert.strictEqual(eventCount, 1);
	return bps;
}

suite('Debug - Breakpoints', () => {
	let model: DebugModel;
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		model = createMockDebugModel(disposables);
	});

	// Breakpoints

	test('simple', () => {
		const modelUri = uri.file('/myfolder/myfile.js');

		addBreakpointsAndCheckEvents(model, modelUri, [{ lineNumber: 5, enabled: true }, { lineNumber: 10, enabled: false }]);
		assert.strictEqual(model.areBreakpointsActivated(), true);
		assert.strictEqual(model.getBreakpoints().length, 2);

		let eventCount = 0;
		const toDispose = model.onDidChangeBreakpoints(e => {
			eventCount++;
			assert.strictEqual(e?.added, undefined);
			assert.strictEqual(e?.sessionOnly, false);
			assert.strictEqual(e?.removed?.length, 2);
			assert.strictEqual(e?.changed, undefined);

			dispose(toDispose);
		});

		model.removeBreakpoints(model.getBreakpoints());
		assert.strictEqual(eventCount, 1);
		assert.strictEqual(model.getBreakpoints().length, 0);
	});

	test('toggling', () => {
		const modelUri = uri.file('/myfolder/myfile.js');

		addBreakpointsAndCheckEvents(model, modelUri, [{ lineNumber: 5, enabled: true }, { lineNumber: 10, enabled: false }]);
		addBreakpointsAndCheckEvents(model, modelUri, [{ lineNumber: 12, enabled: true, condition: 'fake condition' }]);
		assert.strictEqual(model.getBreakpoints().length, 3);
		const bp = model.getBreakpoints().pop();
		if (bp) {
			model.removeBreakpoints([bp]);
		}
		assert.strictEqual(model.getBreakpoints().length, 2);

		model.setBreakpointsActivated(false);
		assert.strictEqual(model.areBreakpointsActivated(), false);
		model.setBreakpointsActivated(true);
		assert.strictEqual(model.areBreakpointsActivated(), true);
	});

	test('two files', () => {
		const modelUri1 = uri.file('/myfolder/my file first.js');
		const modelUri2 = uri.file('/secondfolder/second/second file.js');
		addBreakpointsAndCheckEvents(model, modelUri1, [{ lineNumber: 5, enabled: true }, { lineNumber: 10, enabled: false }]);
		assert.strictEqual(getExpandedBodySize(model, undefined, 9), 44);

		addBreakpointsAndCheckEvents(model, modelUri2, [{ lineNumber: 1, enabled: true }, { lineNumber: 2, enabled: true }, { lineNumber: 3, enabled: false }]);
		assert.strictEqual(getExpandedBodySize(model, undefined, 9), 110);

		assert.strictEqual(model.getBreakpoints().length, 5);
		assert.strictEqual(model.getBreakpoints({ uri: modelUri1 }).length, 2);
		assert.strictEqual(model.getBreakpoints({ uri: modelUri2 }).length, 3);
		assert.strictEqual(model.getBreakpoints({ lineNumber: 5 }).length, 1);
		assert.strictEqual(model.getBreakpoints({ column: 5 }).length, 0);

		const bp = model.getBreakpoints()[0];
		const update = new Map<string, IBreakpointUpdateData>();
		update.set(bp.getId(), { lineNumber: 100 });
		let eventFired = false;
		const toDispose = model.onDidChangeBreakpoints(e => {
			eventFired = true;
			assert.strictEqual(e?.added, undefined);
			assert.strictEqual(e?.removed, undefined);
			assert.strictEqual(e?.changed?.length, 1);
			dispose(toDispose);
		});
		model.updateBreakpoints(update);
		assert.strictEqual(eventFired, true);
		assert.strictEqual(bp.lineNumber, 100);

		assert.strictEqual(model.getBreakpoints({ enabledOnly: true }).length, 3);
		model.enableOrDisableAllBreakpoints(false);
		model.getBreakpoints().forEach(bp => {
			assert.strictEqual(bp.enabled, false);
		});
		assert.strictEqual(model.getBreakpoints({ enabledOnly: true }).length, 0);

		model.setEnablement(bp, true);
		assert.strictEqual(bp.enabled, true);

		model.removeBreakpoints(model.getBreakpoints({ uri: modelUri1 }));
		assert.strictEqual(getExpandedBodySize(model, undefined, 9), 66);

		assert.strictEqual(model.getBreakpoints().length, 3);
	});

	test('conditions', () => {
		const modelUri1 = uri.file('/myfolder/my file first.js');
		addBreakpointsAndCheckEvents(model, modelUri1, [{ lineNumber: 5, condition: 'i < 5', hitCondition: '17' }, { lineNumber: 10, condition: 'j < 3' }]);
		const breakpoints = model.getBreakpoints();

		assert.strictEqual(breakpoints[0].condition, 'i < 5');
		assert.strictEqual(breakpoints[0].hitCondition, '17');
		assert.strictEqual(breakpoints[1].condition, 'j < 3');
		assert.strictEqual(!!breakpoints[1].hitCondition, false);

		assert.strictEqual(model.getBreakpoints().length, 2);
		model.removeBreakpoints(model.getBreakpoints());
		assert.strictEqual(model.getBreakpoints().length, 0);
	});

	test('function breakpoints', () => {
		model.addFunctionBreakpoint({ name: 'foo' }, '1');
		model.addFunctionBreakpoint({ name: 'bar' }, '2');
		model.updateFunctionBreakpoint('1', { name: 'fooUpdated' });
		model.updateFunctionBreakpoint('2', { name: 'barUpdated' });

		const functionBps = model.getFunctionBreakpoints();
		assert.strictEqual(functionBps[0].name, 'fooUpdated');
		assert.strictEqual(functionBps[1].name, 'barUpdated');

		model.removeFunctionBreakpoints();
		assert.strictEqual(model.getFunctionBreakpoints().length, 0);
	});

	test('multiple sessions', () => {
		const modelUri = uri.file('/myfolder/myfile.js');
		addBreakpointsAndCheckEvents(model, modelUri, [{ lineNumber: 5, enabled: true, condition: 'x > 5' }, { lineNumber: 10, enabled: false }]);
		const breakpoints = model.getBreakpoints();
		const session = disposables.add(createTestSession(model));
		const data = new Map<string, DebugProtocol.Breakpoint>();

		assert.strictEqual(breakpoints[0].lineNumber, 5);
		assert.strictEqual(breakpoints[1].lineNumber, 10);

		data.set(breakpoints[0].getId(), { verified: false, line: 10 });
		data.set(breakpoints[1].getId(), { verified: true, line: 50 });
		model.setBreakpointSessionData(session.getId(), {}, data);
		assert.strictEqual(breakpoints[0].lineNumber, 5);
		assert.strictEqual(breakpoints[1].lineNumber, 50);

		const session2 = disposables.add(createTestSession(model));
		const data2 = new Map<string, DebugProtocol.Breakpoint>();
		data2.set(breakpoints[0].getId(), { verified: true, line: 100 });
		data2.set(breakpoints[1].getId(), { verified: true, line: 500 });
		model.setBreakpointSessionData(session2.getId(), {}, data2);

		// Breakpoint is verified only once, show that line
		assert.strictEqual(breakpoints[0].lineNumber, 100);
		// Breakpoint is verified two times, show the original line
		assert.strictEqual(breakpoints[1].lineNumber, 10);

		model.setBreakpointSessionData(session.getId(), {}, undefined);
		// No more double session verification
		assert.strictEqual(breakpoints[0].lineNumber, 100);
		assert.strictEqual(breakpoints[1].lineNumber, 500);

		assert.strictEqual(breakpoints[0].supported, false);
		const data3 = new Map<string, DebugProtocol.Breakpoint>();
		data3.set(breakpoints[0].getId(), { verified: true, line: 500 });
		model.setBreakpointSessionData(session2.getId(), { supportsConditionalBreakpoints: true }, data2);
		assert.strictEqual(breakpoints[0].supported, true);
	});

	test('exception breakpoints', () => {
		let eventCount = 0;
		disposables.add(model.onDidChangeBreakpoints(() => eventCount++));
		model.setExceptionBreakpointsForSession('session-id-1', [{ filter: 'uncaught', label: 'UNCAUGHT', default: true }]);
		assert.strictEqual(eventCount, 1);
		let exceptionBreakpoints = model.getExceptionBreakpointsForSession('session-id-1');
		assert.strictEqual(exceptionBreakpoints.length, 1);
		assert.strictEqual(exceptionBreakpoints[0].filter, 'uncaught');
		assert.strictEqual(exceptionBreakpoints[0].enabled, true);

		model.setExceptionBreakpointsForSession('session-id-2', [{ filter: 'uncaught', label: 'UNCAUGHT' }, { filter: 'caught', label: 'CAUGHT' }]);
		assert.strictEqual(eventCount, 2);
		exceptionBreakpoints = model.getExceptionBreakpointsForSession('session-id-2');
		assert.strictEqual(exceptionBreakpoints.length, 2);
		assert.strictEqual(exceptionBreakpoints[0].filter, 'uncaught');
		assert.strictEqual(exceptionBreakpoints[0].enabled, true);
		assert.strictEqual(exceptionBreakpoints[1].filter, 'caught');
		assert.strictEqual(exceptionBreakpoints[1].label, 'CAUGHT');
		assert.strictEqual(exceptionBreakpoints[1].enabled, false);

		model.setExceptionBreakpointsForSession('session-id-3', [{ filter: 'all', label: 'ALL' }]);
		assert.strictEqual(eventCount, 3);
		assert.strictEqual(model.getExceptionBreakpointsForSession('session-id-3').length, 1);
		exceptionBreakpoints = model.getExceptionBreakpoints();
		assert.strictEqual(exceptionBreakpoints[0].filter, 'uncaught');
		assert.strictEqual(exceptionBreakpoints[0].enabled, true);
		assert.strictEqual(exceptionBreakpoints[1].filter, 'caught');
		assert.strictEqual(exceptionBreakpoints[1].label, 'CAUGHT');
		assert.strictEqual(exceptionBreakpoints[1].enabled, false);
		assert.strictEqual(exceptionBreakpoints[2].filter, 'all');
		assert.strictEqual(exceptionBreakpoints[2].label, 'ALL');
	});

	test('exception breakpoints multiple sessions', () => {
		let eventCount = 0;
		disposables.add(model.onDidChangeBreakpoints(() => eventCount++));

		model.setExceptionBreakpointsForSession('session-id-4', [{ filter: 'uncaught', label: 'UNCAUGHT', default: true }, { filter: 'caught', label: 'CAUGHT' }]);
		model.setExceptionBreakpointFallbackSession('session-id-4');
		assert.strictEqual(eventCount, 1);
		let exceptionBreakpointsForSession = model.getExceptionBreakpointsForSession('session-id-4');
		assert.strictEqual(exceptionBreakpointsForSession.length, 2);
		assert.strictEqual(exceptionBreakpointsForSession[0].filter, 'uncaught');
		assert.strictEqual(exceptionBreakpointsForSession[1].filter, 'caught');

		model.setExceptionBreakpointsForSession('session-id-5', [{ filter: 'all', label: 'ALL' }, { filter: 'caught', label: 'CAUGHT' }]);
		assert.strictEqual(eventCount, 2);
		exceptionBreakpointsForSession = model.getExceptionBreakpointsForSession('session-id-5');
		let exceptionBreakpointsForUndefined = model.getExceptionBreakpointsForSession(undefined);
		assert.strictEqual(exceptionBreakpointsForSession.length, 2);
		assert.strictEqual(exceptionBreakpointsForSession[0].filter, 'caught');
		assert.strictEqual(exceptionBreakpointsForSession[1].filter, 'all');
		assert.strictEqual(exceptionBreakpointsForUndefined.length, 2);
		assert.strictEqual(exceptionBreakpointsForUndefined[0].filter, 'uncaught');
		assert.strictEqual(exceptionBreakpointsForUndefined[1].filter, 'caught');

		model.removeExceptionBreakpointsForSession('session-id-4');
		assert.strictEqual(eventCount, 2);
		exceptionBreakpointsForUndefined = model.getExceptionBreakpointsForSession(undefined);
		assert.strictEqual(exceptionBreakpointsForUndefined.length, 2);
		assert.strictEqual(exceptionBreakpointsForUndefined[0].filter, 'uncaught');
		assert.strictEqual(exceptionBreakpointsForUndefined[1].filter, 'caught');

		model.setExceptionBreakpointFallbackSession('session-id-5');
		assert.strictEqual(eventCount, 2);
		exceptionBreakpointsForUndefined = model.getExceptionBreakpointsForSession(undefined);
		assert.strictEqual(exceptionBreakpointsForUndefined.length, 2);
		assert.strictEqual(exceptionBreakpointsForUndefined[0].filter, 'caught');
		assert.strictEqual(exceptionBreakpointsForUndefined[1].filter, 'all');

		const exceptionBreakpoints = model.getExceptionBreakpoints();
		assert.strictEqual(exceptionBreakpoints.length, 3);
	});

	test('instruction breakpoints', () => {
		let eventCount = 0;
		disposables.add(model.onDidChangeBreakpoints(() => eventCount++));
		//address: string, offset: number, condition?: string, hitCondition?: string
		model.addInstructionBreakpoint({ instructionReference: '0xCCCCFFFF', offset: 0, address: 0n, canPersist: false });

		assert.strictEqual(eventCount, 1);
		let instructionBreakpoints = model.getInstructionBreakpoints();
		assert.strictEqual(instructionBreakpoints.length, 1);
		assert.strictEqual(instructionBreakpoints[0].instructionReference, '0xCCCCFFFF');
		assert.strictEqual(instructionBreakpoints[0].offset, 0);

		model.addInstructionBreakpoint({ instructionReference: '0xCCCCEEEE', offset: 1, address: 0n, canPersist: false });
		assert.strictEqual(eventCount, 2);
		instructionBreakpoints = model.getInstructionBreakpoints();
		assert.strictEqual(instructionBreakpoints.length, 2);
		assert.strictEqual(instructionBreakpoints[0].instructionReference, '0xCCCCFFFF');
		assert.strictEqual(instructionBreakpoints[0].offset, 0);
		assert.strictEqual(instructionBreakpoints[1].instructionReference, '0xCCCCEEEE');
		assert.strictEqual(instructionBreakpoints[1].offset, 1);
	});

	test('data breakpoints', () => {
		let eventCount = 0;
		disposables.add(model.onDidChangeBreakpoints(() => eventCount++));

		model.addDataBreakpoint({ description: 'label', src: { type: DataBreakpointSetType.Variable, dataId: 'id' }, canPersist: true, accessTypes: ['read'], accessType: 'read' }, '1');
		model.addDataBreakpoint({ description: 'second', src: { type: DataBreakpointSetType.Variable, dataId: 'secondId' }, canPersist: false, accessTypes: ['readWrite'], accessType: 'readWrite' }, '2');
		model.updateDataBreakpoint('1', { condition: 'aCondition' });
		model.updateDataBreakpoint('2', { hitCondition: '10' });
		const dataBreakpoints = model.getDataBreakpoints();
		assert.strictEqual(dataBreakpoints[0].canPersist, true);
		assert.deepStrictEqual(dataBreakpoints[0].src, { type: DataBreakpointSetType.Variable, dataId: 'id' });
		assert.strictEqual(dataBreakpoints[0].accessType, 'read');
		assert.strictEqual(dataBreakpoints[0].condition, 'aCondition');
		assert.strictEqual(dataBreakpoints[1].canPersist, false);
		assert.strictEqual(dataBreakpoints[1].description, 'second');
		assert.strictEqual(dataBreakpoints[1].accessType, 'readWrite');
		assert.strictEqual(dataBreakpoints[1].hitCondition, '10');

		assert.strictEqual(eventCount, 4);

		model.removeDataBreakpoints(dataBreakpoints[0].getId());
		assert.strictEqual(eventCount, 5);
		assert.strictEqual(model.getDataBreakpoints().length, 1);

		model.removeDataBreakpoints();
		assert.strictEqual(model.getDataBreakpoints().length, 0);
		assert.strictEqual(eventCount, 6);
	});

	test('message and class name', () => {
		const modelUri = uri.file('/myfolder/my file first.js');
		addBreakpointsAndCheckEvents(model, modelUri, [
			{ lineNumber: 5, enabled: true, condition: 'x > 5' },
			{ lineNumber: 10, enabled: false },
			{ lineNumber: 12, enabled: true, logMessage: 'hello' },
			{ lineNumber: 15, enabled: true, hitCondition: '12' },
			{ lineNumber: 500, enabled: true },
		]);
		const breakpoints = model.getBreakpoints();
		const ls = new MockLabelService();

		let result = getBreakpointMessageAndIcon(State.Stopped, true, breakpoints[0], ls, model);
		assert.strictEqual(result.message, 'Condition: x > 5');
		assert.strictEqual(result.icon.id, 'debug-breakpoint-conditional');

		result = getBreakpointMessageAndIcon(State.Stopped, true, breakpoints[1], ls, model);
		assert.strictEqual(result.message, 'Disabled Breakpoint');
		assert.strictEqual(result.icon.id, 'debug-breakpoint-disabled');

		result = getBreakpointMessageAndIcon(State.Stopped, true, breakpoints[2], ls, model);
		assert.strictEqual(result.message, 'Log Message: hello');
		assert.strictEqual(result.icon.id, 'debug-breakpoint-log');

		result = getBreakpointMessageAndIcon(State.Stopped, true, breakpoints[3], ls, model);
		assert.strictEqual(result.message, 'Hit Count: 12');
		assert.strictEqual(result.icon.id, 'debug-breakpoint-conditional');

		result = getBreakpointMessageAndIcon(State.Stopped, true, breakpoints[4], ls, model);
		assert.strictEqual(result.message, ls.getUriLabel(breakpoints[4].uri));
		assert.strictEqual(result.icon.id, 'debug-breakpoint');

		result = getBreakpointMessageAndIcon(State.Stopped, false, breakpoints[2], ls, model);
		assert.strictEqual(result.message, 'Disabled Logpoint');
		assert.strictEqual(result.icon.id, 'debug-breakpoint-log-disabled');

		model.addDataBreakpoint({ description: 'label', canPersist: true, accessTypes: ['read'], accessType: 'read', src: { type: DataBreakpointSetType.Variable, dataId: 'id' } });
		const dataBreakpoints = model.getDataBreakpoints();
		result = getBreakpointMessageAndIcon(State.Stopped, true, dataBreakpoints[0], ls, model);
		assert.strictEqual(result.message, 'Data Breakpoint');
		assert.strictEqual(result.icon.id, 'debug-breakpoint-data');

		const functionBreakpoint = model.addFunctionBreakpoint({ name: 'foo' }, '1');
		result = getBreakpointMessageAndIcon(State.Stopped, true, functionBreakpoint, ls, model);
		assert.strictEqual(result.message, 'Function Breakpoint');
		assert.strictEqual(result.icon.id, 'debug-breakpoint-function');

		const data = new Map<string, DebugProtocol.Breakpoint>();
		data.set(breakpoints[0].getId(), { verified: false, line: 10 });
		data.set(breakpoints[1].getId(), { verified: true, line: 50 });
		data.set(breakpoints[2].getId(), { verified: true, line: 50, message: 'world' });
		data.set(functionBreakpoint.getId(), { verified: true });
		model.setBreakpointSessionData('mocksessionid', { supportsFunctionBreakpoints: false, supportsDataBreakpoints: true, supportsLogPoints: true }, data);

		result = getBreakpointMessageAndIcon(State.Stopped, true, breakpoints[0], ls, model);
		assert.strictEqual(result.message, 'Unverified Breakpoint');
		assert.strictEqual(result.icon.id, 'debug-breakpoint-unverified');

		result = getBreakpointMessageAndIcon(State.Stopped, true, functionBreakpoint, ls, model);
		assert.strictEqual(result.message, 'Function breakpoints not supported by this debug type');
		assert.strictEqual(result.icon.id, 'debug-breakpoint-function-unverified');

		result = getBreakpointMessageAndIcon(State.Stopped, true, breakpoints[2], ls, model);
		assert.strictEqual(result.message, 'Log Message: hello, world');
		assert.strictEqual(result.icon.id, 'debug-breakpoint-log');
	});

	test('decorations', () => {
		const modelUri = uri.file('/myfolder/my file first.js');
		const languageId = 'testMode';
		const textModel = createTextModel(
			['this is line one', 'this is line two', '    this is line three it has whitespace at start', 'this is line four', 'this is line five'].join('\n'),
			languageId
		);
		addBreakpointsAndCheckEvents(model, modelUri, [
			{ lineNumber: 1, enabled: true, condition: 'x > 5' },
			{ lineNumber: 2, column: 4, enabled: false },
			{ lineNumber: 3, enabled: true, logMessage: 'hello' },
			{ lineNumber: 500, enabled: true },
		]);
		const breakpoints = model.getBreakpoints();

		const instantiationService = new TestInstantiationService();
		const debugService = new MockDebugService();
		debugService.getModel = () => model;
		instantiationService.stub(IDebugService, debugService);
		instantiationService.stub(ILabelService, new MockLabelService());
		instantiationService.stub(ILanguageService, disposables.add(new LanguageService()));
		let decorations = instantiationService.invokeFunction(accessor => createBreakpointDecorations(accessor, textModel, breakpoints, State.Running, true, true));
		assert.strictEqual(decorations.length, 3); // last breakpoint filtered out since it has a large line number
		assert.deepStrictEqual(decorations[0].range, new Range(1, 1, 1, 2));
		assert.deepStrictEqual(decorations[1].range, new Range(2, 4, 2, 5));
		assert.deepStrictEqual(decorations[2].range, new Range(3, 5, 3, 6));
		assert.strictEqual(decorations[0].options.beforeContentClassName, undefined);
		assert.strictEqual(decorations[1].options.before?.inlineClassName, `debug-breakpoint-placeholder`);
		assert.strictEqual(decorations[0].options.overviewRuler?.position, OverviewRulerLane.Left);
		const expected = new MarkdownString(undefined, { isTrusted: true, supportThemeIcons: true }).appendCodeblock(languageId, 'Condition: x > 5');
		assert.deepStrictEqual(decorations[0].options.glyphMarginHoverMessage, expected);

		decorations = instantiationService.invokeFunction(accessor => createBreakpointDecorations(accessor, textModel, breakpoints, State.Running, true, false));
		assert.strictEqual(decorations[0].options.overviewRuler, null);

		textModel.dispose();
		instantiationService.dispose();
	});

	test('updates when storage changes', () => {
		const storage1 = disposables.add(new TestStorageService());
		const debugStorage1 = disposables.add(new MockDebugStorage(storage1));
		// eslint-disable-next-line local/code-no-any-casts
		const model1 = disposables.add(new DebugModel(debugStorage1, <any>{ isDirty: (e: any) => false }, mockUriIdentityService, new NullLogService()));

		// 1. create breakpoints in the first model
		const modelUri = uri.file('/myfolder/my file first.js');
		const first = [
			{ lineNumber: 1, enabled: true, condition: 'x > 5' },
			{ lineNumber: 2, column: 4, enabled: false },
		];

		addBreakpointsAndCheckEvents(model1, modelUri, first);
		debugStorage1.storeBreakpoints(model1);
		const stored = storage1.get('debug.breakpoint', StorageScope.WORKSPACE);

		// 2. hydrate a new model and ensure external breakpoints get applied
		const storage2 = disposables.add(new TestStorageService());
		// eslint-disable-next-line local/code-no-any-casts
		const model2 = disposables.add(new DebugModel(disposables.add(new MockDebugStorage(storage2)), <any>{ isDirty: (e: any) => false }, mockUriIdentityService, new NullLogService()));
		storage2.store('debug.breakpoint', stored, StorageScope.WORKSPACE, StorageTarget.USER, /* external= */ true);
		assert.deepStrictEqual(model2.getBreakpoints().map(b => b.getId()), model1.getBreakpoints().map(b => b.getId()));

		// 3. ensure non-external changes are ignored
		storage2.store('debug.breakpoint', '[]', StorageScope.WORKSPACE, StorageTarget.USER, /* external= */ false);
		assert.deepStrictEqual(model2.getBreakpoints().map(b => b.getId()), model1.getBreakpoints().map(b => b.getId()));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/browser/callStack.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/browser/callStack.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as sinon from 'sinon';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { Constants } from '../../../../../base/common/uint.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { upcastDeepPartial, upcastPartial } from '../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { TestAccessibilityService } from '../../../../../platform/accessibility/test/common/testAccessibilityService.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { createDecorationsForStackFrame } from '../../browser/callStackEditorContribution.js';
import { getContext, getContextForContributedActions, getSpecificSourceName } from '../../browser/callStackView.js';
import { debugStackframe, debugStackframeFocused } from '../../browser/debugIcons.js';
import { getStackFrameThreadAndSessionToFocus } from '../../browser/debugService.js';
import { DebugSession } from '../../browser/debugSession.js';
import { IDebugService, IDebugSessionOptions, State } from '../../common/debug.js';
import { DebugModel, StackFrame, Thread } from '../../common/debugModel.js';
import { Source } from '../../common/debugSource.js';
import { MockRawSession } from '../common/mockDebug.js';
import { createMockDebugModel, mockUriIdentityService } from './mockDebugModel.js';
import { RawDebugSession } from '../../browser/rawDebugSession.js';

const mockWorkspaceContextService = upcastDeepPartial<IWorkspaceContextService>({
	getWorkspace: () => {
		return {
			folders: []
		};
	}
});

export function createTestSession(model: DebugModel, name = 'mockSession', options?: IDebugSessionOptions): DebugSession {
	return new DebugSession(generateUuid(), { resolved: { name, type: 'node', request: 'launch' }, unresolved: undefined }, undefined, model, options, {
		getViewModel(): any {
			return {
				updateViews(): void {
					// noop
				}
			};
		}
	} as IDebugService, undefined!, undefined!, new TestConfigurationService({ debug: { console: { collapseIdenticalLines: true } } }), undefined!, mockWorkspaceContextService, undefined!, undefined!, undefined!, mockUriIdentityService, new TestInstantiationService(), undefined!, undefined!, new NullLogService(), undefined!, undefined!, new TestAccessibilityService());
}

function createTwoStackFrames(session: DebugSession): { firstStackFrame: StackFrame; secondStackFrame: StackFrame } {
	const thread = new class extends Thread {
		public override getCallStack(): StackFrame[] {
			return [firstStackFrame, secondStackFrame];
		}
	}(session, 'mockthread', 1);

	const firstSource = new Source({
		name: 'internalModule.js',
		path: 'a/b/c/d/internalModule.js',
		sourceReference: 10,
	}, 'aDebugSessionId', mockUriIdentityService, new NullLogService());
	const secondSource = new Source({
		name: 'internalModule.js',
		path: 'z/x/c/d/internalModule.js',
		sourceReference: 11,
	}, 'aDebugSessionId', mockUriIdentityService, new NullLogService());

	const firstStackFrame = new StackFrame(thread, 0, firstSource, 'app.js', 'normal', { startLineNumber: 1, startColumn: 2, endLineNumber: 1, endColumn: 10 }, 0, true);
	const secondStackFrame = new StackFrame(thread, 1, secondSource, 'app2.js', 'normal', { startLineNumber: 1, startColumn: 2, endLineNumber: 1, endColumn: 10 }, 1, true);

	return { firstStackFrame, secondStackFrame };
}

suite('Debug - CallStack', () => {
	let model: DebugModel;
	let mockRawSession: MockRawSession;
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		model = createMockDebugModel(disposables);
		mockRawSession = new MockRawSession();
	});

	teardown(() => {
		sinon.restore();
	});

	// Threads

	test('threads simple', () => {
		const threadId = 1;
		const threadName = 'firstThread';
		const session = createTestSession(model);
		disposables.add(session);
		model.addSession(session);

		assert.strictEqual(model.getSessions(true).length, 1);
		model.rawUpdate({
			sessionId: session.getId(),
			threads: [{
				id: threadId,
				name: threadName
			}]
		});

		assert.strictEqual(session.getThread(threadId)!.name, threadName);

		model.clearThreads(session.getId(), true);
		assert.strictEqual(session.getThread(threadId), undefined);
		assert.strictEqual(model.getSessions(true).length, 1);
	});

	test('threads multiple with allThreadsStopped', async () => {
		const threadId1 = 1;
		const threadName1 = 'firstThread';
		const threadId2 = 2;
		const threadName2 = 'secondThread';
		const stoppedReason = 'breakpoint';

		// Add the threads
		const session = createTestSession(model);
		disposables.add(session);
		model.addSession(session);

		session.raw = upcastPartial<RawDebugSession>(mockRawSession);

		model.rawUpdate({
			sessionId: session.getId(),
			threads: [{
				id: threadId1,
				name: threadName1
			}]
		});

		// Stopped event with all threads stopped
		model.rawUpdate({
			sessionId: session.getId(),
			threads: [{
				id: threadId1,
				name: threadName1
			}, {
				id: threadId2,
				name: threadName2
			}],
			stoppedDetails: {
				reason: stoppedReason,
				threadId: 1,
				allThreadsStopped: true
			},
		});

		const thread1 = session.getThread(threadId1)!;
		const thread2 = session.getThread(threadId2)!;

		// at the beginning, callstacks are obtainable but not available
		assert.strictEqual(session.getAllThreads().length, 2);
		assert.strictEqual(thread1.name, threadName1);
		assert.strictEqual(thread1.stopped, true);
		assert.strictEqual(thread1.getCallStack().length, 0);
		assert.strictEqual(thread1.stoppedDetails!.reason, stoppedReason);
		assert.strictEqual(thread2.name, threadName2);
		assert.strictEqual(thread2.stopped, true);
		assert.strictEqual(thread2.getCallStack().length, 0);
		assert.strictEqual(thread2.stoppedDetails!.reason, undefined);

		// after calling getCallStack, the callstack becomes available
		// and results in a request for the callstack in the debug adapter
		await thread1.fetchCallStack();
		assert.notStrictEqual(thread1.getCallStack().length, 0);

		await thread2.fetchCallStack();
		assert.notStrictEqual(thread2.getCallStack().length, 0);

		// calling multiple times getCallStack doesn't result in multiple calls
		// to the debug adapter
		await thread1.fetchCallStack();
		await thread2.fetchCallStack();

		// clearing the callstack results in the callstack not being available
		thread1.clearCallStack();
		assert.strictEqual(thread1.stopped, true);
		assert.strictEqual(thread1.getCallStack().length, 0);

		thread2.clearCallStack();
		assert.strictEqual(thread2.stopped, true);
		assert.strictEqual(thread2.getCallStack().length, 0);

		model.clearThreads(session.getId(), true);
		assert.strictEqual(session.getThread(threadId1), undefined);
		assert.strictEqual(session.getThread(threadId2), undefined);
		assert.strictEqual(session.getAllThreads().length, 0);
	});

	test('allThreadsStopped in multiple events', async () => {
		const threadId1 = 1;
		const threadName1 = 'firstThread';
		const threadId2 = 2;
		const threadName2 = 'secondThread';
		const stoppedReason = 'breakpoint';

		// Add the threads
		const session = createTestSession(model);
		disposables.add(session);
		model.addSession(session);

		session.raw = upcastPartial<RawDebugSession>(mockRawSession);

		// Stopped event with all threads stopped
		model.rawUpdate({
			sessionId: session.getId(),
			threads: [{
				id: threadId1,
				name: threadName1
			}, {
				id: threadId2,
				name: threadName2
			}],
			stoppedDetails: {
				reason: stoppedReason,
				threadId: threadId1,
				allThreadsStopped: true
			},
		});

		model.rawUpdate({
			sessionId: session.getId(),
			threads: [{
				id: threadId1,
				name: threadName1
			}, {
				id: threadId2,
				name: threadName2
			}],
			stoppedDetails: {
				reason: stoppedReason,
				threadId: threadId2,
				allThreadsStopped: true
			},
		});

		const thread1 = session.getThread(threadId1)!;
		const thread2 = session.getThread(threadId2)!;

		assert.strictEqual(thread1.stoppedDetails?.reason, stoppedReason);
		assert.strictEqual(thread2.stoppedDetails?.reason, stoppedReason);
	});

	test('threads multiple without allThreadsStopped', async () => {
		const sessionStub = sinon.spy(mockRawSession, 'stackTrace');

		const stoppedThreadId = 1;
		const stoppedThreadName = 'stoppedThread';
		const runningThreadId = 2;
		const runningThreadName = 'runningThread';
		const stoppedReason = 'breakpoint';
		const session = createTestSession(model);
		disposables.add(session);
		model.addSession(session);

		session.raw = upcastPartial<RawDebugSession>(mockRawSession);

		// Add the threads
		model.rawUpdate({
			sessionId: session.getId(),
			threads: [{
				id: stoppedThreadId,
				name: stoppedThreadName
			}]
		});

		// Stopped event with only one thread stopped
		model.rawUpdate({
			sessionId: session.getId(),
			threads: [{
				id: 1,
				name: stoppedThreadName
			}, {
				id: runningThreadId,
				name: runningThreadName
			}],
			stoppedDetails: {
				reason: stoppedReason,
				threadId: 1,
				allThreadsStopped: false
			}
		});

		const stoppedThread = session.getThread(stoppedThreadId)!;
		const runningThread = session.getThread(runningThreadId)!;

		// the callstack for the stopped thread is obtainable but not available
		// the callstack for the running thread is not obtainable nor available
		assert.strictEqual(stoppedThread.name, stoppedThreadName);
		assert.strictEqual(stoppedThread.stopped, true);
		assert.strictEqual(session.getAllThreads().length, 2);
		assert.strictEqual(stoppedThread.getCallStack().length, 0);
		assert.strictEqual(stoppedThread.stoppedDetails!.reason, stoppedReason);
		assert.strictEqual(runningThread.name, runningThreadName);
		assert.strictEqual(runningThread.stopped, false);
		assert.strictEqual(runningThread.getCallStack().length, 0);
		assert.strictEqual(runningThread.stoppedDetails, undefined);

		// after calling getCallStack, the callstack becomes available
		// and results in a request for the callstack in the debug adapter
		await stoppedThread.fetchCallStack();
		assert.notStrictEqual(stoppedThread.getCallStack().length, 0);
		assert.strictEqual(runningThread.getCallStack().length, 0);
		assert.strictEqual(sessionStub.callCount, 1);

		// calling getCallStack on the running thread returns empty array
		// and does not return in a request for the callstack in the debug
		// adapter
		await runningThread.fetchCallStack();
		assert.strictEqual(runningThread.getCallStack().length, 0);
		assert.strictEqual(sessionStub.callCount, 1);

		// clearing the callstack results in the callstack not being available
		stoppedThread.clearCallStack();
		assert.strictEqual(stoppedThread.stopped, true);
		assert.strictEqual(stoppedThread.getCallStack().length, 0);

		model.clearThreads(session.getId(), true);
		assert.strictEqual(session.getThread(stoppedThreadId), undefined);
		assert.strictEqual(session.getThread(runningThreadId), undefined);
		assert.strictEqual(session.getAllThreads().length, 0);
	});

	test('stack frame get specific source name', () => {
		const session = createTestSession(model);
		disposables.add(session);
		model.addSession(session);
		const { firstStackFrame, secondStackFrame } = createTwoStackFrames(session);

		assert.strictEqual(getSpecificSourceName(firstStackFrame), '.../b/c/d/internalModule.js');
		assert.strictEqual(getSpecificSourceName(secondStackFrame), '.../x/c/d/internalModule.js');
	});

	test('stack frame toString()', () => {
		const session = createTestSession(model);
		disposables.add(session);
		const thread = new Thread(session, 'mockthread', 1);
		const firstSource = new Source({
			name: 'internalModule.js',
			path: 'a/b/c/d/internalModule.js',
			sourceReference: 10,
		}, 'aDebugSessionId', mockUriIdentityService, new NullLogService());
		const stackFrame = new StackFrame(thread, 1, firstSource, 'app', 'normal', { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 10 }, 1, true);
		assert.strictEqual(stackFrame.toString(), 'app (internalModule.js:1)');

		const secondSource = new Source(undefined, 'aDebugSessionId', mockUriIdentityService, new NullLogService());
		const stackFrame2 = new StackFrame(thread, 2, secondSource, 'module', 'normal', { startLineNumber: undefined!, startColumn: undefined!, endLineNumber: undefined!, endColumn: undefined! }, 2, true);
		assert.strictEqual(stackFrame2.toString(), 'module');
	});

	test('debug child sessions are added in correct order', () => {
		const session = disposables.add(createTestSession(model));
		model.addSession(session);
		const secondSession = disposables.add(createTestSession(model, 'mockSession2'));
		model.addSession(secondSession);
		const firstChild = disposables.add(createTestSession(model, 'firstChild', { parentSession: session }));
		model.addSession(firstChild);
		const secondChild = disposables.add(createTestSession(model, 'secondChild', { parentSession: session }));
		model.addSession(secondChild);
		const thirdSession = disposables.add(createTestSession(model, 'mockSession3'));
		model.addSession(thirdSession);
		const anotherChild = disposables.add(createTestSession(model, 'secondChild', { parentSession: secondSession }));
		model.addSession(anotherChild);

		const sessions = model.getSessions();
		assert.strictEqual(sessions[0].getId(), session.getId());
		assert.strictEqual(sessions[1].getId(), firstChild.getId());
		assert.strictEqual(sessions[2].getId(), secondChild.getId());
		assert.strictEqual(sessions[3].getId(), secondSession.getId());
		assert.strictEqual(sessions[4].getId(), anotherChild.getId());
		assert.strictEqual(sessions[5].getId(), thirdSession.getId());
	});

	test('decorations', () => {
		const session = createTestSession(model);
		disposables.add(session);
		model.addSession(session);
		const { firstStackFrame, secondStackFrame } = createTwoStackFrames(session);
		let decorations = createDecorationsForStackFrame(firstStackFrame, true, false);
		assert.strictEqual(decorations.length, 3);
		assert.deepStrictEqual(decorations[0].range, new Range(1, 2, 1, 3));
		assert.strictEqual(decorations[0].options.glyphMarginClassName, ThemeIcon.asClassName(debugStackframe));
		assert.deepStrictEqual(decorations[1].range, new Range(1, 2, 1, Constants.MAX_SAFE_SMALL_INTEGER));
		assert.strictEqual(decorations[1].options.className, 'debug-top-stack-frame-line');
		assert.strictEqual(decorations[1].options.isWholeLine, true);

		decorations = createDecorationsForStackFrame(secondStackFrame, true, false);
		assert.strictEqual(decorations.length, 2);
		assert.deepStrictEqual(decorations[0].range, new Range(1, 2, 1, 3));
		assert.strictEqual(decorations[0].options.glyphMarginClassName, ThemeIcon.asClassName(debugStackframeFocused));
		assert.deepStrictEqual(decorations[1].range, new Range(1, 2, 1, Constants.MAX_SAFE_SMALL_INTEGER));
		assert.strictEqual(decorations[1].options.className, 'debug-focused-stack-frame-line');
		assert.strictEqual(decorations[1].options.isWholeLine, true);

		decorations = createDecorationsForStackFrame(firstStackFrame, true, false);
		assert.strictEqual(decorations.length, 3);
		assert.deepStrictEqual(decorations[0].range, new Range(1, 2, 1, 3));
		assert.strictEqual(decorations[0].options.glyphMarginClassName, ThemeIcon.asClassName(debugStackframe));
		assert.deepStrictEqual(decorations[1].range, new Range(1, 2, 1, Constants.MAX_SAFE_SMALL_INTEGER));
		assert.strictEqual(decorations[1].options.className, 'debug-top-stack-frame-line');
		assert.strictEqual(decorations[1].options.isWholeLine, true);
		// Inline decoration gets rendered in this case
		assert.strictEqual(decorations[2].options.before?.inlineClassName, 'debug-top-stack-frame-column');
		assert.deepStrictEqual(decorations[2].range, new Range(1, 2, 1, Constants.MAX_SAFE_SMALL_INTEGER));
	});

	test('contexts', () => {
		const session = createTestSession(model);
		disposables.add(session);
		model.addSession(session);
		const { firstStackFrame, secondStackFrame } = createTwoStackFrames(session);
		let context = getContext(firstStackFrame);
		assert.strictEqual(context?.sessionId, firstStackFrame.thread.session.getId());
		assert.strictEqual(context?.threadId, firstStackFrame.thread.getId());
		assert.strictEqual(context?.frameId, firstStackFrame.getId());

		context = getContext(secondStackFrame.thread);
		assert.strictEqual(context?.sessionId, secondStackFrame.thread.session.getId());
		assert.strictEqual(context?.threadId, secondStackFrame.thread.getId());
		assert.strictEqual(context?.frameId, undefined);

		context = getContext(session);
		assert.strictEqual(context?.sessionId, session.getId());
		assert.strictEqual(context?.threadId, undefined);
		assert.strictEqual(context?.frameId, undefined);

		let contributedContext = getContextForContributedActions(firstStackFrame);
		assert.strictEqual(contributedContext, firstStackFrame.source.raw.path);
		contributedContext = getContextForContributedActions(firstStackFrame.thread);
		assert.strictEqual(contributedContext, firstStackFrame.thread.threadId);
		contributedContext = getContextForContributedActions(session);
		assert.strictEqual(contributedContext, session.getId());
	});

	test('focusStackFrameThreadAndSession', () => {
		const threadId1 = 1;
		const threadName1 = 'firstThread';
		const threadId2 = 2;
		const threadName2 = 'secondThread';
		const stoppedReason = 'breakpoint';

		// Add the threads
		const session = new class extends DebugSession {
			override get state(): State {
				return State.Stopped;
			}
		}(generateUuid(), { resolved: { name: 'stoppedSession', type: 'node', request: 'launch' }, unresolved: undefined }, undefined, model, undefined, undefined!, undefined!, undefined!, undefined!, undefined!, mockWorkspaceContextService, undefined!, undefined!, undefined!, mockUriIdentityService, new TestInstantiationService(), undefined!, undefined!, new NullLogService(), undefined!, undefined!, new TestAccessibilityService());
		disposables.add(session);

		const runningSession = createTestSession(model);
		disposables.add(runningSession);
		model.addSession(runningSession);
		model.addSession(session);

		session.raw = upcastPartial<RawDebugSession>(mockRawSession);

		model.rawUpdate({
			sessionId: session.getId(),
			threads: [{
				id: threadId1,
				name: threadName1
			}]
		});

		// Stopped event with all threads stopped
		model.rawUpdate({
			sessionId: session.getId(),
			threads: [{
				id: threadId1,
				name: threadName1
			}, {
				id: threadId2,
				name: threadName2
			}],
			stoppedDetails: {
				reason: stoppedReason,
				threadId: 1,
				allThreadsStopped: true
			},
		});

		const thread = session.getThread(threadId1)!;
		const runningThread = session.getThread(threadId2);

		let toFocus = getStackFrameThreadAndSessionToFocus(model, undefined);
		// Verify stopped session and stopped thread get focused
		assert.deepStrictEqual(toFocus, { stackFrame: undefined, thread: thread, session: session });

		toFocus = getStackFrameThreadAndSessionToFocus(model, undefined, undefined, runningSession);
		assert.deepStrictEqual(toFocus, { stackFrame: undefined, thread: undefined, session: runningSession });

		toFocus = getStackFrameThreadAndSessionToFocus(model, undefined, thread);
		assert.deepStrictEqual(toFocus, { stackFrame: undefined, thread: thread, session: session });

		toFocus = getStackFrameThreadAndSessionToFocus(model, undefined, runningThread);
		assert.deepStrictEqual(toFocus, { stackFrame: undefined, thread: runningThread, session: session });

		const stackFrame = new StackFrame(thread, 5, undefined!, 'stackframename2', undefined, undefined!, 1, true);
		toFocus = getStackFrameThreadAndSessionToFocus(model, stackFrame);
		assert.deepStrictEqual(toFocus, { stackFrame: stackFrame, thread: thread, session: session });
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/browser/debugANSIHandling.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/browser/debugANSIHandling.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { isHTMLSpanElement } from '../../../../../base/browser/dom.js';
import { Color, RGBA } from '../../../../../base/common/color.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { registerColors } from '../../../terminal/common/terminalColorRegistry.js';
import { appendStylizedStringToContainer, calcANSI8bitColor, handleANSIOutput } from '../../browser/debugANSIHandling.js';
import { DebugSession } from '../../browser/debugSession.js';
import { LinkDetector } from '../../browser/linkDetector.js';
import { DebugModel } from '../../common/debugModel.js';
import { createTestSession } from './callStack.test.js';
import { createMockDebugModel } from './mockDebugModel.js';

suite('Debug - ANSI Handling', () => {

	let disposables: DisposableStore;
	let model: DebugModel;
	let session: DebugSession;
	let linkDetector: LinkDetector;

	/**
	 * Instantiate services for use by the functions being tested.
	 */
	setup(() => {
		disposables = new DisposableStore();
		model = createMockDebugModel(disposables);
		session = createTestSession(model);

		const instantiationService: TestInstantiationService = <TestInstantiationService>workbenchInstantiationService(undefined, disposables);
		linkDetector = instantiationService.createInstance(LinkDetector);
		registerColors();
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('appendStylizedStringToContainer', () => {
		const root: HTMLSpanElement = document.createElement('span');
		let child: Node;

		assert.strictEqual(0, root.children.length);

		appendStylizedStringToContainer(root, 'content1', ['class1', 'class2'], linkDetector, session.root, undefined, undefined, undefined, undefined, 0);
		appendStylizedStringToContainer(root, 'content2', ['class2', 'class3'], linkDetector, session.root, undefined, undefined, undefined, undefined, 0);

		assert.strictEqual(2, root.children.length);

		child = root.firstChild!;
		if (isHTMLSpanElement(child)) {
			assert.strictEqual('content1', child.textContent);
			assert(child.classList.contains('class1'));
			assert(child.classList.contains('class2'));
		} else {
			assert.fail('Unexpected assertion error');
		}

		child = root.lastChild!;
		if (isHTMLSpanElement(child)) {
			assert.strictEqual('content2', child.textContent);
			assert(child.classList.contains('class2'));
			assert(child.classList.contains('class3'));
		} else {
			assert.fail('Unexpected assertion error');
		}
	});

	/**
	 * Apply an ANSI sequence to {@link #getSequenceOutput}.
	 *
	 * @param sequence The ANSI sequence to stylize.
	 * @returns An {@link HTMLSpanElement} that contains the stylized text.
	 */
	function getSequenceOutput(sequence: string): HTMLSpanElement {
		const root: HTMLSpanElement = handleANSIOutput(sequence, linkDetector, session.root, []);
		assert.strictEqual(1, root.children.length);
		const child: Node = root.lastChild!;
		if (isHTMLSpanElement(child)) {
			return child;
		} else {
			assert.fail('Unexpected assertion error');
		}
	}

	/**
	 * Assert that a given ANSI sequence maintains added content following the ANSI code, and that
	 * the provided {@param assertion} passes.
	 *
	 * @param sequence The ANSI sequence to verify. The provided sequence should contain ANSI codes
	 * only, and should not include actual text content as it is provided by this function.
	 * @param assertion The function used to verify the output.
	 */
	function assertSingleSequenceElement(sequence: string, assertion: (child: HTMLSpanElement) => void): void {
		const child: HTMLSpanElement = getSequenceOutput(sequence + 'content');
		assert.strictEqual('content', child.textContent);
		assertion(child);
	}

	/**
	 * Assert that a given DOM element has the custom inline CSS style matching
	 * the color value provided.
	 * @param element The HTML span element to look at.
	 * @param colorType If `foreground`, will check the element's css `color`;
	 * if `background`, will check the element's css `backgroundColor`.
	 * if `underline`, will check the elements css `textDecorationColor`.
	 * @param color RGBA object to compare color to. If `undefined` or not provided,
	 * will assert that no value is set.
	 * @param message Optional custom message to pass to assertion.
	 * @param colorShouldMatch Optional flag (defaults TO true) which allows caller to indicate that the color SHOULD NOT MATCH
	 * (for testing changes to theme colors where we need color to have changed but we don't know exact color it should have
	 * changed to (but we do know the color it should NO LONGER BE))
	 */
	function assertInlineColor(element: HTMLSpanElement, colorType: 'background' | 'foreground' | 'underline', color?: RGBA | undefined, message?: string, colorShouldMatch: boolean = true): void {
		if (color !== undefined) {
			const cssColor = Color.Format.CSS.formatRGB(
				new Color(color)
			);
			if (colorType === 'background') {
				const styleBefore = element.style.backgroundColor;
				element.style.backgroundColor = cssColor;
				assert((styleBefore === element.style.backgroundColor) === colorShouldMatch, message || `Incorrect ${colorType} color style found (found color: ${styleBefore}, expected ${cssColor}).`);
			} else if (colorType === 'foreground') {
				const styleBefore = element.style.color;
				element.style.color = cssColor;
				assert((styleBefore === element.style.color) === colorShouldMatch, message || `Incorrect ${colorType} color style found (found color: ${styleBefore}, expected ${cssColor}).`);
			} else {
				const styleBefore = element.style.textDecorationColor;
				element.style.textDecorationColor = cssColor;
				assert((styleBefore === element.style.textDecorationColor) === colorShouldMatch, message || `Incorrect ${colorType} color style found (found color: ${styleBefore}, expected ${cssColor}).`);
			}
		} else {
			if (colorType === 'background') {
				assert(!element.style.backgroundColor, message || `Defined ${colorType} color style found when it should not have been defined`);
			} else if (colorType === 'foreground') {
				assert(!element.style.color, message || `Defined ${colorType} color style found when it should not have been defined`);
			} else {
				assert(!element.style.textDecorationColor, message || `Defined ${colorType} color style found when it should not have been defined`);
			}
		}

	}

	test('Expected single sequence operation', () => {

		// Bold code
		assertSingleSequenceElement('\x1b[1m', (child) => {
			assert(child.classList.contains('code-bold'), 'Bold formatting not detected after bold ANSI code.');
		});

		// Italic code
		assertSingleSequenceElement('\x1b[3m', (child) => {
			assert(child.classList.contains('code-italic'), 'Italic formatting not detected after italic ANSI code.');
		});

		// Underline code
		assertSingleSequenceElement('\x1b[4m', (child) => {
			assert(child.classList.contains('code-underline'), 'Underline formatting not detected after underline ANSI code.');
		});

		for (let i = 30; i <= 37; i++) {
			const customClassName: string = 'code-foreground-colored';

			// Foreground colour class
			assertSingleSequenceElement('\x1b[' + i + 'm', (child) => {
				assert(child.classList.contains(customClassName), `Custom foreground class not found on element after foreground ANSI code #${i}.`);
			});

			// Cancellation code removes colour class
			assertSingleSequenceElement('\x1b[' + i + ';39m', (child) => {
				assert(child.classList.contains(customClassName) === false, 'Custom foreground class still found after foreground cancellation code.');
				assertInlineColor(child, 'foreground', undefined, 'Custom color style still found after foreground cancellation code.');
			});
		}

		for (let i = 40; i <= 47; i++) {
			const customClassName: string = 'code-background-colored';

			// Foreground colour class
			assertSingleSequenceElement('\x1b[' + i + 'm', (child) => {
				assert(child.classList.contains(customClassName), `Custom background class not found on element after background ANSI code #${i}.`);
			});

			// Cancellation code removes colour class
			assertSingleSequenceElement('\x1b[' + i + ';49m', (child) => {
				assert(child.classList.contains(customClassName) === false, 'Custom background class still found after background cancellation code.');
				assertInlineColor(child, 'foreground', undefined, 'Custom color style still found after background cancellation code.');
			});
		}

		// check all basic colors for underlines (full range is checked elsewhere, here we check cancelation)
		for (let i = 0; i <= 255; i++) {
			const customClassName: string = 'code-underline-colored';

			// Underline colour class
			assertSingleSequenceElement('\x1b[58;5;' + i + 'm', (child) => {
				assert(child.classList.contains(customClassName), `Custom underline color class not found on element after underline color ANSI code 58;5;${i}m.`);
			});

			// Cancellation underline color code removes colour class
			assertSingleSequenceElement('\x1b[58;5;' + i + 'm\x1b[59m', (child) => {
				assert(child.classList.contains(customClassName) === false, 'Custom underline color class still found after underline color cancellation code 59m.');
				assertInlineColor(child, 'underline', undefined, 'Custom underline color style still found after underline color cancellation code 59m.');
			});
		}

		// Different codes do not cancel each other
		assertSingleSequenceElement('\x1b[1;3;4;30;41m', (child) => {
			assert.strictEqual(5, child.classList.length, 'Incorrect number of classes found for different ANSI codes.');

			assert(child.classList.contains('code-bold'));
			assert(child.classList.contains('code-italic'), 'Different ANSI codes should not cancel each other.');
			assert(child.classList.contains('code-underline'), 'Different ANSI codes should not cancel each other.');
			assert(child.classList.contains('code-foreground-colored'), 'Different ANSI codes should not cancel each other.');
			assert(child.classList.contains('code-background-colored'), 'Different ANSI codes should not cancel each other.');
		});

		// Different codes do not ACCUMULATE more than one copy of each class
		assertSingleSequenceElement('\x1b[1;1;2;2;3;3;4;4;5;5;6;6;8;8;9;9;21;21;53;53;73;73;74;74m', (child) => {
			assert(child.classList.contains('code-bold'));
			assert(child.classList.contains('code-italic'), 'italic missing Doubles of each Different ANSI codes should not cancel each other or accumulate.');
			assert(child.classList.contains('code-underline') === false, 'underline PRESENT and double underline should have removed it- Doubles of each Different ANSI codes should not cancel each other or accumulate.');
			assert(child.classList.contains('code-dim'), 'dim missing Doubles of each Different ANSI codes should not cancel each other or accumulate.');
			assert(child.classList.contains('code-blink'), 'blink missing Doubles of each Different ANSI codes should not cancel each other or accumulate.');
			assert(child.classList.contains('code-rapid-blink'), 'rapid blink mkssing Doubles of each Different ANSI codes should not cancel each other or accumulate.');
			assert(child.classList.contains('code-double-underline'), 'double underline missing Doubles of each Different ANSI codes should not cancel each other or accumulate.');
			assert(child.classList.contains('code-hidden'), 'hidden missing Doubles of each Different ANSI codes should not cancel each other or accumulate.');
			assert(child.classList.contains('code-strike-through'), 'strike-through missing Doubles of each Different ANSI codes should not cancel each other or accumulate.');
			assert(child.classList.contains('code-overline'), 'overline missing Doubles of each Different ANSI codes should not cancel each other or accumulate.');
			assert(child.classList.contains('code-superscript') === false, 'superscript PRESENT and subscript should have removed it- Doubles of each Different ANSI codes should not cancel each other or accumulate.');
			assert(child.classList.contains('code-subscript'), 'subscript missing Doubles of each Different ANSI codes should not cancel each other or accumulate.');

			assert.strictEqual(10, child.classList.length, 'Incorrect number of classes found for each style code sent twice ANSI codes.');
		});



		// More Different codes do not cancel each other
		assertSingleSequenceElement('\x1b[1;2;5;6;21;8;9m', (child) => {
			assert.strictEqual(7, child.classList.length, 'Incorrect number of classes found for different ANSI codes.');

			assert(child.classList.contains('code-bold'));
			assert(child.classList.contains('code-dim'), 'Different ANSI codes should not cancel each other.');
			assert(child.classList.contains('code-blink'), 'Different ANSI codes should not cancel each other.');
			assert(child.classList.contains('code-rapid-blink'), 'Different ANSI codes should not cancel each other.');
			assert(child.classList.contains('code-double-underline'), 'Different ANSI codes should not cancel each other.');
			assert(child.classList.contains('code-hidden'), 'Different ANSI codes should not cancel each other.');
			assert(child.classList.contains('code-strike-through'), 'Different ANSI codes should not cancel each other.');
		});



		// New foreground codes don't remove old background codes and vice versa
		assertSingleSequenceElement('\x1b[40;31;42;33m', (child) => {
			assert.strictEqual(2, child.classList.length);

			assert(child.classList.contains('code-background-colored'), 'New foreground ANSI code should not cancel existing background formatting.');
			assert(child.classList.contains('code-foreground-colored'), 'New background ANSI code should not cancel existing foreground formatting.');
		});

		// Duplicate codes do not change output
		assertSingleSequenceElement('\x1b[1;1;4;1;4;4;1;4m', (child) => {
			assert(child.classList.contains('code-bold'), 'Duplicate formatting codes should have no effect.');
			assert(child.classList.contains('code-underline'), 'Duplicate formatting codes should have no effect.');
		});

		// Extra terminating semicolon does not change output
		assertSingleSequenceElement('\x1b[1;4;m', (child) => {
			assert(child.classList.contains('code-bold'), 'Extra semicolon after ANSI codes should have no effect.');
			assert(child.classList.contains('code-underline'), 'Extra semicolon after ANSI codes should have no effect.');
		});

		// Cancellation code removes multiple codes
		assertSingleSequenceElement('\x1b[1;4;30;41;32;43;34;45;36;47;0m', (child) => {
			assert.strictEqual(0, child.classList.length, 'Cancellation ANSI code should clear ALL formatting.');
			assertInlineColor(child, 'background', undefined, 'Cancellation ANSI code should clear ALL formatting.');
			assertInlineColor(child, 'foreground', undefined, 'Cancellation ANSI code should clear ALL formatting.');
		});

	});

	test('Expected single 8-bit color sequence operation', () => {
		// Basic and bright color codes specified with 8-bit color code format
		for (let i = 0; i <= 15; i++) {
			// As these are controlled by theme, difficult to check actual color value
			// Foreground codes should add standard classes
			assertSingleSequenceElement('\x1b[38;5;' + i + 'm', (child) => {
				assert(child.classList.contains('code-foreground-colored'), `Custom color class not found after foreground 8-bit color code 38;5;${i}`);
			});

			// Background codes should add standard classes
			assertSingleSequenceElement('\x1b[48;5;' + i + 'm', (child) => {
				assert(child.classList.contains('code-background-colored'), `Custom color class not found after background 8-bit color code 48;5;${i}`);
			});
		}

		// 8-bit advanced colors
		for (let i = 16; i <= 255; i++) {
			// Foreground codes should add custom class and inline style
			assertSingleSequenceElement('\x1b[38;5;' + i + 'm', (child) => {
				assert(child.classList.contains('code-foreground-colored'), `Custom color class not found after foreground 8-bit color code 38;5;${i}`);
				assertInlineColor(child, 'foreground', (calcANSI8bitColor(i) as RGBA), `Incorrect or no color styling found after foreground 8-bit color code 38;5;${i}`);
			});

			// Background codes should add custom class and inline style
			assertSingleSequenceElement('\x1b[48;5;' + i + 'm', (child) => {
				assert(child.classList.contains('code-background-colored'), `Custom color class not found after background 8-bit color code 48;5;${i}`);
				assertInlineColor(child, 'background', (calcANSI8bitColor(i) as RGBA), `Incorrect or no color styling found after background 8-bit color code 48;5;${i}`);
			});

			// Color underline codes should add custom class and inline style
			assertSingleSequenceElement('\x1b[58;5;' + i + 'm', (child) => {
				assert(child.classList.contains('code-underline-colored'), `Custom color class not found after underline 8-bit color code 58;5;${i}`);
				assertInlineColor(child, 'underline', (calcANSI8bitColor(i) as RGBA), `Incorrect or no color styling found after underline 8-bit color code 58;5;${i}`);
			});
		}

		// Bad (nonexistent) color should not render
		assertSingleSequenceElement('\x1b[48;5;300m', (child) => {
			assert.strictEqual(0, child.classList.length, 'Bad ANSI color codes should have no effect.');
		});

		// Should ignore any codes after the ones needed to determine color
		assertSingleSequenceElement('\x1b[48;5;100;42;77;99;4;24m', (child) => {
			assert(child.classList.contains('code-background-colored'));
			assert.strictEqual(1, child.classList.length);
			assertInlineColor(child, 'background', (calcANSI8bitColor(100) as RGBA));
		});
	});

	test('Expected single 24-bit color sequence operation', () => {
		// 24-bit advanced colors
		for (let r = 0; r <= 255; r += 64) {
			for (let g = 0; g <= 255; g += 64) {
				for (let b = 0; b <= 255; b += 64) {
					const color = new RGBA(r, g, b);
					// Foreground codes should add class and inline style
					assertSingleSequenceElement(`\x1b[38;2;${r};${g};${b}m`, (child) => {
						assert(child.classList.contains('code-foreground-colored'), 'DOM should have "code-foreground-colored" class for advanced ANSI colors.');
						assertInlineColor(child, 'foreground', color);
					});

					// Background codes should add class and inline style
					assertSingleSequenceElement(`\x1b[48;2;${r};${g};${b}m`, (child) => {
						assert(child.classList.contains('code-background-colored'), 'DOM should have "code-foreground-colored" class for advanced ANSI colors.');
						assertInlineColor(child, 'background', color);
					});

					// Underline color codes should add class and inline style
					assertSingleSequenceElement(`\x1b[58;2;${r};${g};${b}m`, (child) => {
						assert(child.classList.contains('code-underline-colored'), 'DOM should have "code-underline-colored" class for advanced ANSI colors.');
						assertInlineColor(child, 'underline', color);
					});
				}
			}
		}

		// Invalid color should not render
		assertSingleSequenceElement('\x1b[38;2;4;4m', (child) => {
			assert.strictEqual(0, child.classList.length, `Invalid color code "38;2;4;4" should not add a class (classes found: ${child.classList}).`);
			assert(!child.style.color, `Invalid color code "38;2;4;4" should not add a custom color CSS (found color: ${child.style.color}).`);
		});

		// Bad (nonexistent) color should not render
		assertSingleSequenceElement('\x1b[48;2;150;300;5m', (child) => {
			assert.strictEqual(0, child.classList.length, `Nonexistent color code "48;2;150;300;5" should not add a class (classes found: ${child.classList}).`);
		});

		// Should ignore any codes after the ones needed to determine color
		assertSingleSequenceElement('\x1b[48;2;100;42;77;99;200;75m', (child) => {
			assert(child.classList.contains('code-background-colored'), `Color code with extra (valid) items "48;2;100;42;77;99;200;75" should still treat initial part as valid code and add class "code-background-custom".`);
			assert.strictEqual(1, child.classList.length, `Color code with extra items "48;2;100;42;77;99;200;75" should add one and only one class. (classes found: ${child.classList}).`);
			assertInlineColor(child, 'background', new RGBA(100, 42, 77), `Color code "48;2;100;42;77;99;200;75" should  style background-color as rgb(100,42,77).`);
		});
	});


	/**
	 * Assert that a given ANSI sequence produces the expected number of {@link HTMLSpanElement} children. For
	 * each child, run the provided assertion.
	 *
	 * @param sequence The ANSI sequence to verify.
	 * @param assertions A set of assertions to run on the resulting children.
	 */
	function assertMultipleSequenceElements(sequence: string, assertions: Array<(child: HTMLSpanElement) => void>, elementsExpected?: number): void {
		if (elementsExpected === undefined) {
			elementsExpected = assertions.length;
		}
		const root: HTMLSpanElement = handleANSIOutput(sequence, linkDetector, session.root, []);
		assert.strictEqual(elementsExpected, root.children.length);
		for (let i = 0; i < elementsExpected; i++) {
			const child: Node = root.children[i];
			if (isHTMLSpanElement(child)) {
				assertions[i](child);
			} else {
				assert.fail('Unexpected assertion error');
			}
		}
	}

	test('Expected multiple sequence operation', () => {

		// Multiple codes affect the same text
		assertSingleSequenceElement('\x1b[1m\x1b[3m\x1b[4m\x1b[32m', (child) => {
			assert(child.classList.contains('code-bold'), 'Bold class not found after multiple different ANSI codes.');
			assert(child.classList.contains('code-italic'), 'Italic class not found after multiple different ANSI codes.');
			assert(child.classList.contains('code-underline'), 'Underline class not found after multiple different ANSI codes.');
			assert(child.classList.contains('code-foreground-colored'), 'Foreground color class not found after multiple different ANSI codes.');
		});

		// Consecutive codes do not affect previous ones
		assertMultipleSequenceElements('\x1b[1mbold\x1b[32mgreen\x1b[4munderline\x1b[3mitalic\x1b[0mnothing', [
			(bold) => {
				assert.strictEqual(1, bold.classList.length);
				assert(bold.classList.contains('code-bold'), 'Bold class not found after bold ANSI code.');
			},
			(green) => {
				assert.strictEqual(2, green.classList.length);
				assert(green.classList.contains('code-bold'), 'Bold class not found after both bold and color ANSI codes.');
				assert(green.classList.contains('code-foreground-colored'), 'Color class not found after color ANSI code.');
			},
			(underline) => {
				assert.strictEqual(3, underline.classList.length);
				assert(underline.classList.contains('code-bold'), 'Bold class not found after bold, color, and underline ANSI codes.');
				assert(underline.classList.contains('code-foreground-colored'), 'Color class not found after color and underline ANSI codes.');
				assert(underline.classList.contains('code-underline'), 'Underline class not found after underline ANSI code.');
			},
			(italic) => {
				assert.strictEqual(4, italic.classList.length);
				assert(italic.classList.contains('code-bold'), 'Bold class not found after bold, color, underline, and italic ANSI codes.');
				assert(italic.classList.contains('code-foreground-colored'), 'Color class not found after color, underline, and italic ANSI codes.');
				assert(italic.classList.contains('code-underline'), 'Underline class not found after underline and italic ANSI codes.');
				assert(italic.classList.contains('code-italic'), 'Italic class not found after italic ANSI code.');
			},
			(nothing) => {
				assert.strictEqual(0, nothing.classList.length, 'One or more style classes still found after reset ANSI code.');
			},
		], 5);

		// Consecutive codes with ENDING/OFF codes do not LEAVE affect previous ones
		assertMultipleSequenceElements('\x1b[1mbold\x1b[22m\x1b[32mgreen\x1b[4munderline\x1b[24m\x1b[3mitalic\x1b[23mjustgreen\x1b[0mnothing', [
			(bold) => {
				assert.strictEqual(1, bold.classList.length);
				assert(bold.classList.contains('code-bold'), 'Bold class not found after bold ANSI code.');
			},
			(green) => {
				assert.strictEqual(1, green.classList.length);
				assert(green.classList.contains('code-bold') === false, 'Bold class found after both bold WAS TURNED OFF with 22m');
				assert(green.classList.contains('code-foreground-colored'), 'Color class not found after color ANSI code.');
			},
			(underline) => {
				assert.strictEqual(2, underline.classList.length);
				assert(underline.classList.contains('code-foreground-colored'), 'Color class not found after color and underline ANSI codes.');
				assert(underline.classList.contains('code-underline'), 'Underline class not found after underline ANSI code.');
			},
			(italic) => {
				assert.strictEqual(2, italic.classList.length);
				assert(italic.classList.contains('code-foreground-colored'), 'Color class not found after color, underline, and italic ANSI codes.');
				assert(italic.classList.contains('code-underline') === false, 'Underline class found after underline WAS TURNED OFF with 24m');
				assert(italic.classList.contains('code-italic'), 'Italic class not found after italic ANSI code.');
			},
			(justgreen) => {
				assert.strictEqual(1, justgreen.classList.length);
				assert(justgreen.classList.contains('code-italic') === false, 'Italic class found after italic WAS TURNED OFF with 23m');
				assert(justgreen.classList.contains('code-foreground-colored'), 'Color class not found after color ANSI code.');
			},
			(nothing) => {
				assert.strictEqual(0, nothing.classList.length, 'One or more style classes still found after reset ANSI code.');
			},
		], 6);

		// more Consecutive codes with ENDING/OFF codes do not LEAVE affect previous ones
		assertMultipleSequenceElements('\x1b[2mdim\x1b[22m\x1b[32mgreen\x1b[5mslowblink\x1b[25m\x1b[6mrapidblink\x1b[25mjustgreen\x1b[0mnothing', [
			(dim) => {
				assert.strictEqual(1, dim.classList.length);
				assert(dim.classList.contains('code-dim'), 'Dim class not found after dim ANSI code 2m.');
			},
			(green) => {
				assert.strictEqual(1, green.classList.length);
				assert(green.classList.contains('code-dim') === false, 'Dim class found after dim WAS TURNED OFF with 22m');
				assert(green.classList.contains('code-foreground-colored'), 'Color class not found after color ANSI code.');
			},
			(slowblink) => {
				assert.strictEqual(2, slowblink.classList.length);
				assert(slowblink.classList.contains('code-foreground-colored'), 'Color class not found after color and blink ANSI codes.');
				assert(slowblink.classList.contains('code-blink'), 'Blink class not found after underline ANSI code 5m.');
			},
			(rapidblink) => {
				assert.strictEqual(2, rapidblink.classList.length);
				assert(rapidblink.classList.contains('code-foreground-colored'), 'Color class not found after color, blink, and rapid blink ANSI codes.');
				assert(rapidblink.classList.contains('code-blink') === false, 'blink class found after underline WAS TURNED OFF with 25m');
				assert(rapidblink.classList.contains('code-rapid-blink'), 'Rapid blink class not found after rapid blink ANSI code 6m.');
			},
			(justgreen) => {
				assert.strictEqual(1, justgreen.classList.length);
				assert(justgreen.classList.contains('code-rapid-blink') === false, 'Rapid blink class found after rapid blink WAS TURNED OFF with 25m');
				assert(justgreen.classList.contains('code-foreground-colored'), 'Color class not found after color ANSI code.');
			},
			(nothing) => {
				assert.strictEqual(0, nothing.classList.length, 'One or more style classes still found after reset ANSI code.');
			},
		], 6);

		// more Consecutive codes with ENDING/OFF codes do not LEAVE affect previous ones
		assertMultipleSequenceElements('\x1b[8mhidden\x1b[28m\x1b[32mgreen\x1b[9mcrossedout\x1b[29m\x1b[21mdoubleunderline\x1b[24mjustgreen\x1b[0mnothing', [
			(hidden) => {
				assert.strictEqual(1, hidden.classList.length);
				assert(hidden.classList.contains('code-hidden'), 'Hidden class not found after dim ANSI code 8m.');
			},
			(green) => {
				assert.strictEqual(1, green.classList.length);
				assert(green.classList.contains('code-hidden') === false, 'Hidden class found after Hidden WAS TURNED OFF with 28m');
				assert(green.classList.contains('code-foreground-colored'), 'Color class not found after color ANSI code.');
			},
			(crossedout) => {
				assert.strictEqual(2, crossedout.classList.length);
				assert(crossedout.classList.contains('code-foreground-colored'), 'Color class not found after color and hidden ANSI codes.');
				assert(crossedout.classList.contains('code-strike-through'), 'strike-through class not found after crossout/strikethrough ANSI code 9m.');
			},
			(doubleunderline) => {
				assert.strictEqual(2, doubleunderline.classList.length);
				assert(doubleunderline.classList.contains('code-foreground-colored'), 'Color class not found after color, hidden, and crossedout ANSI codes.');
				assert(doubleunderline.classList.contains('code-strike-through') === false, 'strike-through class found after strike-through WAS TURNED OFF with 29m');
				assert(doubleunderline.classList.contains('code-double-underline'), 'Double underline class not found after double underline ANSI code 21m.');
			},
			(justgreen) => {
				assert.strictEqual(1, justgreen.classList.length);
				assert(justgreen.classList.contains('code-double-underline') === false, 'Double underline class found after double underline WAS TURNED OFF with 24m');
				assert(justgreen.classList.contains('code-foreground-colored'), 'Color class not found after color ANSI code.');
			},
			(nothing) => {
				assert.strictEqual(0, nothing.classList.length, 'One or more style classes still found after reset ANSI code.');
			},
		], 6);

		// underline, double underline are mutually exclusive, test underline->double underline->off and double underline->underline->off
		assertMultipleSequenceElements('\x1b[4munderline\x1b[21mdouble underline\x1b[24munderlineOff\x1b[21mdouble underline\x1b[4munderline\x1b[24munderlineOff', [
			(underline) => {
				assert.strictEqual(1, underline.classList.length);
				assert(underline.classList.contains('code-underline'), 'Underline class not found after underline ANSI code 4m.');
			},
			(doubleunderline) => {
				assert(doubleunderline.classList.contains('code-underline') === false, 'Underline class found after double underline code 21m');
				assert(doubleunderline.classList.contains('code-double-underline'), 'Double underline class not found after double underline code 21m');
				assert.strictEqual(1, doubleunderline.classList.length, 'should have found only double underline');
			},
			(nothing) => {
				assert.strictEqual(0, nothing.classList.length, 'One or more style classes still found after underline off code 4m.');
			},
			(doubleunderline) => {
				assert(doubleunderline.classList.contains('code-double-underline'), 'Double underline class not found after double underline code 21m');
				assert.strictEqual(1, doubleunderline.classList.length, 'should have found only double underline');
			},
			(underline) => {
				assert(underline.classList.contains('code-double-underline') === false, 'Double underline class found after underline code 4m');
				assert(underline.classList.contains('code-underline'), 'Underline class not found after underline ANSI code 4m.');
				assert.strictEqual(1, underline.classList.length, 'should have found only underline');
			},
			(nothing) => {
				assert.strictEqual(0, nothing.classList.length, 'One or more style classes still found after underline off code 4m.');
			},
		], 6);

		// underline and strike-through and overline can exist at the same time and
		// in any combination
		assertMultipleSequenceElements('\x1b[4munderline\x1b[9mand strikethough\x1b[53mand overline\x1b[24munderlineOff\x1b[55moverlineOff\x1b[29mstriklethoughOff', [
			(underline) => {
				assert.strictEqual(1, underline.classList.length, 'should have found only underline');
				assert(underline.classList.contains('code-underline'), 'Underline class not found after underline ANSI code 4m.');
			},
			(strikethrough) => {
				assert(strikethrough.classList.contains('code-underline'), 'Underline class NOT found after strikethrough code 9m');
				assert(strikethrough.classList.contains('code-strike-through'), 'Strike through class not found after strikethrough code 9m');
				assert.strictEqual(2, strikethrough.classList.length, 'should have found underline and strikethrough');
			},
			(overline) => {
				assert(overline.classList.contains('code-underline'), 'Underline class NOT found after overline code 53m');
				assert(overline.classList.contains('code-strike-through'), 'Strike through class not found after overline code 53m');
				assert(overline.classList.contains('code-overline'), 'Overline class not found after overline code 53m');
				assert.strictEqual(3, overline.classList.length, 'should have found underline,strikethrough and overline');
			},
			(underlineoff) => {
				assert(underlineoff.classList.contains('code-underline') === false, 'Underline class found after underline off code 24m');
				assert(underlineoff.classList.contains('code-strike-through'), 'Strike through class not found after underline off code 24m');
				assert(underlineoff.classList.contains('code-overline'), 'Overline class not found after underline off code 24m');
				assert.strictEqual(2, underlineoff.classList.length, 'should have found strikethrough and overline');
			},
			(overlineoff) => {
				assert(overlineoff.classList.contains('code-underline') === false, 'Underline class found after overline off code 55m');
				assert(overlineoff.classList.contains('code-overline') === false, 'Overline class found after overline off code 55m');
				assert(overlineoff.classList.contains('code-strike-through'), 'Strike through class not found after overline off code 55m');
				assert.strictEqual(1, overlineoff.classList.length, 'should have found only strikethrough');
			},
			(nothing) => {
				assert(nothing.classList.contains('code-strike-through') === false, 'Strike through class found after strikethrough off code 29m');
				assert.strictEqual(0, nothing.classList.length, 'One or more style classes still found after strikethough OFF code 29m');
			},
		], 6);

		// double underline and strike-through and overline can exist at the same time and
		// in any combination
		assertMultipleSequenceElements('\x1b[21mdoubleunderline\x1b[9mand strikethough\x1b[53mand overline\x1b[29mstriklethoughOff\x1b[55moverlineOff\x1b[24munderlineOff', [
			(doubleunderline) => {
				assert.strictEqual(1, doubleunderline.classList.length, 'should have found only doubleunderline');
				assert(doubleunderline.classList.contains('code-double-underline'), 'Double underline class not found after double underline ANSI code 21m.');
			},
			(strikethrough) => {
				assert(strikethrough.classList.contains('code-double-underline'), 'Double nderline class NOT found after strikethrough code 9m');
				assert(strikethrough.classList.contains('code-strike-through'), 'Strike through class not found after strikethrough code 9m');
				assert.strictEqual(2, strikethrough.classList.length, 'should have found doubleunderline and strikethrough');
			},
			(overline) => {
				assert(overline.classList.contains('code-double-underline'), 'Double underline class NOT found after overline code 53m');
				assert(overline.classList.contains('code-strike-through'), 'Strike through class not found after overline code 53m');
				assert(overline.classList.contains('code-overline'), 'Overline class not found after overline code 53m');
				assert.strictEqual(3, overline.classList.length, 'should have found doubleunderline,overline and strikethrough');
			},
			(strikethrougheoff) => {
				assert(strikethrougheoff.classList.contains('code-double-underline'), 'Double underline class NOT found after strikethrough off code 29m');
				assert(strikethrougheoff.classList.contains('code-overline'), 'Overline class NOT found after strikethrough off code 29m');
				assert(strikethrougheoff.classList.contains('code-strike-through') === false, 'Strike through class found after strikethrough off code 29m');
				assert.strictEqual(2, strikethrougheoff.classList.length, 'should have found doubleunderline and overline');
			},
			(overlineoff) => {
				assert(overlineoff.classList.contains('code-double-underline'), 'Double underline class NOT found after overline off code 55m');
				assert(overlineoff.classList.contains('code-strike-through') === false, 'Strike through class found after overline off code 55m');
				assert(overlineoff.classList.contains('code-overline') === false, 'Overline class found after overline off code 55m');
				assert.strictEqual(1, overlineoff.classList.length, 'Should have found only double underline');
			},
			(nothing) => {
				assert(nothing.classList.contains('code-double-underline') === false, 'Double underline class found after underline off code 24m');
				assert.strictEqual(0, nothing.classList.length, 'One or more style classes still found after underline OFF code 24m');
			},
		], 6);

		// superscript and subscript are mutually exclusive, test superscript->subscript->off and subscript->superscript->off
		assertMultipleSequenceElements('\x1b[73msuperscript\x1b[74msubscript\x1b[75mneither\x1b[74msubscript\x1b[73msuperscript\x1b[75mneither', [
			(superscript) => {
				assert.strictEqual(1, superscript.classList.length, 'should only be superscript class');
				assert(superscript.classList.contains('code-superscript'), 'Superscript class not found after superscript ANSI code 73m.');
			},
			(subscript) => {
				assert(subscript.classList.contains('code-superscript') === false, 'Superscript class found after subscript code 74m');
				assert(subscript.classList.contains('code-subscript'), 'Subscript class not found after subscript code 74m');
				assert.strictEqual(1, subscript.classList.length, 'should have found only subscript class');
			},
			(nothing) => {
				assert.strictEqual(0, nothing.classList.length, 'One or more style classes still found after superscript/subscript off code 75m.');
			},
			(subscript) => {
				assert(subscript.classList.contains('code-subscript'), 'Subscript class not found after subscript code 74m');
				assert.strictEqual(1, subscript.classList.length, 'should have found only subscript class');
			},
			(superscript) => {
				assert(superscript.classList.contains('code-subscript') === false, 'Subscript class found after superscript code 73m');
				assert(superscript.classList.contains('code-superscript'), 'Superscript class not found after superscript ANSI code 73m.');
				assert.strictEqual(1, superscript.classList.length, 'should have found only superscript class');
			},
			(nothing) => {
				assert.strictEqual(0, nothing.classList.length, 'One or more style classes still found after superscipt/subscript off code 75m.');
			},
		], 6);

		// Consecutive font codes switch to new font class and remove previous and then final switch to default font removes class
		assertMultipleSequenceElements('\x1b[11mFont1\x1b[12mFont2\x1b[13mFont3\x1b[14mFont4\x1b[15mFont5\x1b[10mdefaultFont', [
			(font1) => {
				assert.strictEqual(1, font1.classList.length);
				assert(font1.classList.contains('code-font-1'), 'font 1 class NOT found after switch to font 1 with ANSI code 11m');
			},
			(font2) => {
				assert.strictEqual(1, font2.classList.length);
				assert(font2.classList.contains('code-font-1') === false, 'font 1 class found after switch to font 2 with ANSI code 12m');
				assert(font2.classList.contains('code-font-2'), 'font 2 class NOT found after switch to font 2 with ANSI code 12m');
			},
			(font3) => {
				assert.strictEqual(1, font3.classList.length);
				assert(font3.classList.contains('code-font-2') === false, 'font 2 class found after switch to font 3 with ANSI code 13m');
				assert(font3.classList.contains('code-font-3'), 'font 3 class NOT found after switch to font 3 with ANSI code 13m');
			},
			(font4) => {
				assert.strictEqual(1, font4.classList.length);
				assert(font4.classList.contains('code-font-3') === false, 'font 3 class found after switch to font 4 with ANSI code 14m');
				assert(font4.classList.contains('code-font-4'), 'font 4 class NOT found after switch to font 4 with ANSI code 14m');
			},
			(font5) => {
				assert.strictEqual(1, font5.classList.length);
				assert(font5.classList.contains('code-font-4') === false, 'font 4 class found after switch to font 5 with ANSI code 15m');
				assert(font5.classList.contains('code-font-5'), 'font 5 class NOT found after switch to font 5 with ANSI code 15m');
			},
			(defaultfont) => {
				assert.strictEqual(0, defaultfont.classList.length, 'One or more font style classes still found after reset to default font with ANSI code 10m.');
			},
		], 6);

		// More Consecutive font codes switch to new font class and remove previous and then final switch to default font removes class
		assertMultipleSequenceElements('\x1b[16mFont6\x1b[17mFont7\x1b[18mFont8\x1b[19mFont9\x1b[20mFont10\x1b[10mdefaultFont', [
			(font6) => {
				assert.strictEqual(1, font6.classList.length);
				assert(font6.classList.contains('code-font-6'), 'font 6 class NOT found after switch to font 6 with ANSI code 16m');
			},
			(font7) => {
				assert.strictEqual(1, font7.classList.length);
				assert(font7.classList.contains('code-font-6') === false, 'font 6 class found after switch to font 7 with ANSI code 17m');
				assert(font7.classList.contains('code-font-7'), 'font 7 class NOT found after switch to font 7 with ANSI code 17m');
			},
			(font8) => {
				assert.strictEqual(1, font8.classList.length);
				assert(font8.classList.contains('code-font-7') === false, 'font 7 class found after switch to font 8 with ANSI code 18m');
				assert(font8.classList.contains('code-font-8'), 'font 8 class NOT found after switch to font 8 with ANSI code 18m');
			},
			(font9) => {
				assert.strictEqual(1, font9.classList.length);
				assert(font9.classList.contains('code-font-8') === false, 'font 8 class found after switch to font 9 with ANSI code 19m');
				assert(font9.classList.contains('code-font-9'), 'font 9 class NOT found after switch to font 9 with ANSI code 19m');
			},
			(font10) => {
				assert.strictEqual(1, font10.classList.length);
				assert(font10.classList.contains('code-font-9') === false, 'font 9 class found after switch to font 10 with ANSI code 20m');
				assert(font10.classList.contains('code-font-10'), `font 10 class NOT found after switch to font 10 with ANSI code 20m (${font10.classList})`);
			},
			(defaultfont) => {
				assert.strictEqual(0, defaultfont.classList.length, 'One or more font style classes (2nd series) still found after reset to default font with ANSI code 10m.');
			},
		], 6);

		// Blackletter font codes can be turned off with other font codes or 23m
		assertMultipleSequenceElements('\x1b[3mitalic\x1b[20mfont10blacklatter\x1b[23mitalicAndBlackletterOff\x1b[20mFont10Again\x1b[11mFont1\x1b[10mdefaultFont', [
			(italic) => {
				assert.strictEqual(1, italic.classList.length);
				assert(italic.classList.contains('code-italic'), 'italic class NOT found after italic code ANSI code 3m');
			},
			(font10) => {
				assert.strictEqual(2, font10.classList.length);
				assert(font10.classList.contains('code-italic'), 'no itatic class found after switch to font 10 (blackletter) with ANSI code 20m');
				assert(font10.classList.contains('code-font-10'), 'font 10 class NOT found after switch to font 10 with ANSI code 20m');
			},
			(italicAndBlackletterOff) => {
				assert.strictEqual(0, italicAndBlackletterOff.classList.length, 'italic or blackletter (font10) class found after both switched off with ANSI code 23m');
			},
			(font10) => {
				assert.strictEqual(1, font10.classList.length);
				assert(font10.classList.contains('code-font-10'), 'font 10 class NOT found after switch to font 10 with ANSI code 20m');
			},
			(font1) => {
				assert.strictEqual(1, font1.classList.length);
				assert(font1.classList.contains('code-font-10') === false, 'font 10 class found after switch to font 1 with ANSI code 11m');
				assert(font1.classList.contains('code-font-1'), 'font 1 class NOT found after switch to font 1 with ANSI code 11m');
			},
			(defaultfont) => {
				assert.strictEqual(0, defaultfont.classList.length, 'One or more font style classes (2nd series) still found after reset to default font with ANSI code 10m.');
			},
		], 6);

		// italic can be turned on/off with affecting font codes 1-9  (italic off will clear 'blackletter'(font 23) as per spec)
		assertMultipleSequenceElements('\x1b[3mitalic\x1b[12mfont2\x1b[23mitalicOff\x1b[3mitalicFont2\x1b[10mjustitalic\x1b[23mnothing', [
			(italic) => {
				assert.strictEqual(1, italic.classList.length);
				assert(italic.classList.contains('code-italic'), 'italic class NOT found after italic code ANSI code 3m');
			},
			(font10) => {
				assert.strictEqual(2, font10.classList.length);
				assert(font10.classList.contains('code-italic'), 'no itatic class found after switch to font 2 with ANSI code 12m');
				assert(font10.classList.contains('code-font-2'), 'font 2 class NOT found after switch to font 2 with ANSI code 12m');
			},
			(italicOff) => {
				assert.strictEqual(1, italicOff.classList.length, 'italic class found after both switched off with ANSI code 23m');
				assert(italicOff.classList.contains('code-italic') === false, 'itatic class found after switching it OFF with ANSI code 23m');
				assert(italicOff.classList.contains('code-font-2'), 'font 2 class NOT found after switching italic off with ANSI code 23m');
			},
			(italicFont2) => {
				assert.strictEqual(2, italicFont2.classList.length);
				assert(italicFont2.classList.contains('code-italic'), 'no itatic class found after italic ANSI code 3m');
				assert(italicFont2.classList.contains('code-font-2'), 'font 2 class NOT found after italic ANSI code 3m');
			},
			(justitalic) => {
				assert.strictEqual(1, justitalic.classList.length);
				assert(justitalic.classList.contains('code-font-2') === false, 'font 2 class found after switch to default font with ANSI code 10m');
				assert(justitalic.classList.contains('code-italic'), 'italic class NOT found after switch to default font with ANSI code 10m');
			},
			(nothing) => {
				assert.strictEqual(0, nothing.classList.length, 'One or more classes still found after final italic removal with ANSI code 23m.');
			},
		], 6);

		// Reverse video reverses Foreground/Background colors WITH both SET and can called in sequence
		assertMultipleSequenceElements('\x1b[38;2;10;20;30mfg10,20,30\x1b[48;2;167;168;169mbg167,168,169\x1b[7m8ReverseVideo\x1b[7mDuplicateReverseVideo\x1b[27mReverseOff\x1b[27mDupReverseOff', [
			(fg10_20_30) => {
				assert.strictEqual(1, fg10_20_30.classList.length, 'Foreground ANSI color code should add one class.');
				assert(fg10_20_30.classList.contains('code-foreground-colored'), 'Foreground ANSI color codes should add custom foreground color class.');
				assertInlineColor(fg10_20_30, 'foreground', new RGBA(10, 20, 30), '24-bit RGBA ANSI color code (10,20,30) should add matching color inline style.');
			},
			(bg167_168_169) => {
				assert.strictEqual(2, bg167_168_169.classList.length, 'background ANSI color codes should only add a single class.');
				assert(bg167_168_169.classList.contains('code-background-colored'), 'Background ANSI color codes should add custom background color class.');
				assertInlineColor(bg167_168_169, 'background', new RGBA(167, 168, 169), '24-bit RGBA ANSI background color code (167,168,169) should add matching color inline style.');
				assert(bg167_168_169.classList.contains('code-foreground-colored'), 'Still Foreground ANSI color codes should add custom foreground color class.');
				assertInlineColor(bg167_168_169, 'foreground', new RGBA(10, 20, 30), 'Still 24-bit RGBA ANSI color code (10,20,30) should add matching color inline style.');
			},
			(reverseVideo) => {
				assert.strictEqual(2, reverseVideo.classList.length, 'background ANSI color codes should only add a single class.');
				assert(reverseVideo.classList.contains('code-background-colored'), 'Background ANSI color codes should add custom background color class.');
				assertInlineColor(reverseVideo, 'foreground', new RGBA(167, 168, 169), 'Reversed 24-bit RGBA ANSI foreground color code (167,168,169) should add matching former background color inline style.');
				assert(reverseVideo.classList.contains('code-foreground-colored'), 'Still Foreground ANSI color codes should add custom foreground color class.');
				assertInlineColor(reverseVideo, 'background', new RGBA(10, 20, 30), 'Reversed 24-bit RGBA ANSI background color code (10,20,30) should add matching former foreground color inline style.');
			},
			(dupReverseVideo) => {
				assert.strictEqual(2, dupReverseVideo.classList.length, 'After second Reverse Video - background ANSI color codes should only add a single class.');
				assert(dupReverseVideo.classList.contains('code-background-colored'), 'After second Reverse Video - Background ANSI color codes should add custom background color class.');
				assertInlineColor(dupReverseVideo, 'foreground', new RGBA(167, 168, 169), 'After second Reverse Video - Reversed 24-bit RGBA ANSI foreground color code (167,168,169) should add matching former background color inline style.');
				assert(dupReverseVideo.classList.contains('code-foreground-colored'), 'After second Reverse Video - Still Foreground ANSI color codes should add custom foreground color class.');
				assertInlineColor(dupReverseVideo, 'background', new RGBA(10, 20, 30), 'After second Reverse Video - Reversed 24-bit RGBA ANSI background color code (10,20,30) should add matching former foreground color inline style.');
			},
			(reversedBack) => {
				assert.strictEqual(2, reversedBack.classList.length, 'Reversed Back - background ANSI color codes should only add a single class.');
				assert(reversedBack.classList.contains('code-background-colored'), 'Reversed Back - Background ANSI color codes should add custom background color class.');
				assertInlineColor(reversedBack, 'background', new RGBA(167, 168, 169), 'Reversed Back - 24-bit RGBA ANSI background color code (167,168,169) should add matching color inline style.');
				assert(reversedBack.classList.contains('code-foreground-colored'), 'Reversed Back -  Foreground ANSI color codes should add custom foreground color class.');
				assertInlineColor(reversedBack, 'foreground', new RGBA(10, 20, 30), 'Reversed Back -  24-bit RGBA ANSI color code (10,20,30) should add matching color inline style.');
			},
			(dupReversedBack) => {
				assert.strictEqual(2, dupReversedBack.classList.length, '2nd Reversed Back - background ANSI color codes should only add a single class.');
				assert(dupReversedBack.classList.contains('code-background-colored'), '2nd Reversed Back - Background ANSI color codes should add custom background color class.');
				assertInlineColor(dupReversedBack, 'background', new RGBA(167, 168, 169), '2nd Reversed Back - 24-bit RGBA ANSI background color code (167,168,169) should add matching color inline style.');
				assert(dupReversedBack.classList.contains('code-foreground-colored'), '2nd Reversed Back -  Foreground ANSI color codes should add custom foreground color class.');
				assertInlineColor(dupReversedBack, 'foreground', new RGBA(10, 20, 30), '2nd Reversed Back -  24-bit RGBA ANSI color code (10,20,30) should add matching color inline style.');
			},
		], 6);

		// Reverse video reverses Foreground/Background colors WITH ONLY foreground color SET
		assertMultipleSequenceElements('\x1b[38;2;10;20;30mfg10,20,30\x1b[7m8ReverseVideo\x1b[27mReverseOff', [
			(fg10_20_30) => {
				assert.strictEqual(1, fg10_20_30.classList.length, 'Foreground ANSI color code should add one class.');
				assert(fg10_20_30.classList.contains('code-foreground-colored'), 'Foreground ANSI color codes should add custom foreground color class.');
				assertInlineColor(fg10_20_30, 'foreground', new RGBA(10, 20, 30), '24-bit RGBA ANSI color code (10,20,30) should add matching color inline style.');
			},
			(reverseVideo) => {
				assert.strictEqual(1, reverseVideo.classList.length, 'Background ANSI color codes should only add a single class.');
				assert(reverseVideo.classList.contains('code-background-colored'), 'Background ANSI color codes should add custom background color class.');
				assert(reverseVideo.classList.contains('code-foreground-colored') === false, 'After Reverse with NO background the Foreground ANSI color codes should NOT BE SET.');
				assertInlineColor(reverseVideo, 'background', new RGBA(10, 20, 30), 'Reversed 24-bit RGBA ANSI background color code (10,20,30) should add matching former foreground color inline style.');
			},
			(reversedBack) => {
				assert.strictEqual(1, reversedBack.classList.length, 'Reversed Back - background ANSI color codes should only add a single class.');
				assert(reversedBack.classList.contains('code-background-colored') === false, 'AFTER Reversed Back - Background ANSI color should NOT BE SET.');
				assert(reversedBack.classList.contains('code-foreground-colored'), 'Reversed Back -  Foreground ANSI color codes should add custom foreground color class.');
				assertInlineColor(reversedBack, 'foreground', new RGBA(10, 20, 30), 'Reversed Back -  24-bit RGBA ANSI color code (10,20,30) should add matching color inline style.');
			},
		], 3);

		// Reverse video reverses Foreground/Background colors WITH ONLY background color SET
		assertMultipleSequenceElements('\x1b[48;2;167;168;169mbg167,168,169\x1b[7m8ReverseVideo\x1b[27mReverseOff', [
			(bg167_168_169) => {
				assert.strictEqual(1, bg167_168_169.classList.length, 'Background ANSI color code should add one class.');
				assert(bg167_168_169.classList.contains('code-background-colored'), 'Background ANSI color codes should add custom foreground color class.');
				assertInlineColor(bg167_168_169, 'background', new RGBA(167, 168, 169), '24-bit RGBA ANSI color code (167, 168, 169) should add matching background color inline style.');
			},
			(reverseVideo) => {
				assert.strictEqual(1, reverseVideo.classList.length, 'After ReverseVideo Foreground ANSI color codes should only add a single class.');
				assert(reverseVideo.classList.contains('code-foreground-colored'), 'After ReverseVideo Foreground ANSI color codes should add custom background color class.');
				assert(reverseVideo.classList.contains('code-background-colored') === false, 'After Reverse with NO foreground color the background ANSI color codes should BE SET.');
				assertInlineColor(reverseVideo, 'foreground', new RGBA(167, 168, 169), 'Reversed 24-bit RGBA ANSI background color code (10,20,30) should add matching former background color inline style.');
			},
			(reversedBack) => {
				assert.strictEqual(1, reversedBack.classList.length, 'Reversed Back - background ANSI color codes should only add a single class.');
				assert(reversedBack.classList.contains('code-foreground-colored') === false, 'AFTER Reversed Back - Foreground ANSI color should NOT BE SET.');
				assert(reversedBack.classList.contains('code-background-colored'), 'Reversed Back -  Background ANSI color codes should add custom background color class.');
				assertInlineColor(reversedBack, 'background', new RGBA(167, 168, 169), 'Reversed Back -  24-bit RGBA ANSI color code (10,20,30) should add matching background color inline style.');
			},
		], 3);

		// Underline color Different types of color codes still cancel each other
		assertMultipleSequenceElements('\x1b[58;2;101;102;103m24bitUnderline101,102,103\x1b[58;5;3m8bitsimpleUnderline\x1b[58;2;104;105;106m24bitUnderline104,105,106\x1b[58;5;101m8bitadvanced\x1b[58;2;200;200;200munderline200,200,200\x1b[59mUnderlineColorResetToDefault', [
			(adv24Bit) => {
				assert.strictEqual(1, adv24Bit.classList.length, 'Underline ANSI color codes should only add a single class (1).');
				assert(adv24Bit.classList.contains('code-underline-colored'), 'Underline ANSI color codes should add custom underline color class.');
				assertInlineColor(adv24Bit, 'underline', new RGBA(101, 102, 103), '24-bit RGBA ANSI color code (101,102,103) should add matching color inline style.');
			},
			(adv8BitSimple) => {
				assert.strictEqual(1, adv8BitSimple.classList.length, 'Multiple underline ANSI color codes should only add a single class (2).');
				assert(adv8BitSimple.classList.contains('code-underline-colored'), 'Underline ANSI color codes should add custom underline color class.');
				// changed to simple theme color, don't know exactly what it should be, but it should NO LONGER BE 101,102,103
				assertInlineColor(adv8BitSimple, 'underline', new RGBA(101, 102, 103), 'Change to theme color SHOULD NOT STILL BE 24-bit RGBA ANSI color code (101,102,103) should add matching color inline style.', false);
			},
			(adv24BitAgain) => {
				assert.strictEqual(1, adv24BitAgain.classList.length, 'Multiple underline ANSI color codes should only add a single class (3).');
				assert(adv24BitAgain.classList.contains('code-underline-colored'), 'Underline ANSI color codes should add custom underline color class.');
				assertInlineColor(adv24BitAgain, 'underline', new RGBA(104, 105, 106), '24-bit RGBA ANSI color code (100,100,100) should add matching color inline style.');
			},
			(adv8BitAdvanced) => {
				assert.strictEqual(1, adv8BitAdvanced.classList.length, 'Multiple underline ANSI color codes should only add a single class (4).');
				assert(adv8BitAdvanced.classList.contains('code-underline-colored'), 'Underline ANSI color codes should add custom underline color class.');
				// changed to 8bit advanced color, don't know exactly what it should be, but it should NO LONGER BE 104,105,106
				assertInlineColor(adv8BitAdvanced, 'underline', new RGBA(104, 105, 106), 'Change to theme color SHOULD NOT BE 24-bit RGBA ANSI color code (104,105,106) should add matching color inline style.', false);
			},
			(adv24BitUnderlin200) => {
				assert.strictEqual(1, adv24BitUnderlin200.classList.length, 'Multiple underline ANSI color codes should only add a single class 4.');
				assert(adv24BitUnderlin200.classList.contains('code-underline-colored'), 'Underline ANSI color codes should add custom underline color class.');
				assertInlineColor(adv24BitUnderlin200, 'underline', new RGBA(200, 200, 200), 'after change underline color SHOULD BE 24-bit RGBA ANSI color code (200,200,200) should add matching color inline style.');
			},
			(underlineColorResetToDefault) => {
				assert.strictEqual(0, underlineColorResetToDefault.classList.length, 'After Underline Color reset to default NO underline color class should be set.');
				assertInlineColor(underlineColorResetToDefault, 'underline', undefined, 'after RESET TO DEFAULT underline color SHOULD NOT BE SET (no color inline style.)');
			},
		], 6);

		// Different types of color codes still cancel each other
		assertMultipleSequenceElements('\x1b[34msimple\x1b[38;2;101;102;103m24bit\x1b[38;5;3m8bitsimple\x1b[38;2;104;105;106m24bitAgain\x1b[38;5;101m8bitadvanced', [
			(simple) => {
				assert.strictEqual(1, simple.classList.length, 'Foreground ANSI color code should add one class.');
				assert(simple.classList.contains('code-foreground-colored'), 'Foreground ANSI color codes should add custom foreground color class.');
			},
			(adv24Bit) => {
				assert.strictEqual(1, adv24Bit.classList.length, 'Multiple foreground ANSI color codes should only add a single class.');
				assert(adv24Bit.classList.contains('code-foreground-colored'), 'Foreground ANSI color codes should add custom foreground color class.');
				assertInlineColor(adv24Bit, 'foreground', new RGBA(101, 102, 103), '24-bit RGBA ANSI color code (101,102,103) should add matching color inline style.');
			},
			(adv8BitSimple) => {
				assert.strictEqual(1, adv8BitSimple.classList.length, 'Multiple foreground ANSI color codes should only add a single class.');
				assert(adv8BitSimple.classList.contains('code-foreground-colored'), 'Foreground ANSI color codes should add custom foreground color class.');
				//color is theme based, so we can't check what it should be but we know it should NOT BE 101,102,103 anymore
				assertInlineColor(adv8BitSimple, 'foreground', new RGBA(101, 102, 103), 'SHOULD NOT LONGER BE 24-bit RGBA ANSI color code (101,102,103) after simple color change.', false);
			},
			(adv24BitAgain) => {
				assert.strictEqual(1, adv24BitAgain.classList.length, 'Multiple foreground ANSI color codes should only add a single class.');
				assert(adv24BitAgain.classList.contains('code-foreground-colored'), 'Foreground ANSI color codes should add custom foreground color class.');
				assertInlineColor(adv24BitAgain, 'foreground', new RGBA(104, 105, 106), '24-bit RGBA ANSI color code (104,105,106) should add matching color inline style.');
			},
			(adv8BitAdvanced) => {
				assert.strictEqual(1, adv8BitAdvanced.classList.length, 'Multiple foreground ANSI color codes should only add a single class.');
				assert(adv8BitAdvanced.classList.contains('code-foreground-colored'), 'Foreground ANSI color codes should add custom foreground color class.');
				// color should NO LONGER BE 104,105,106
				assertInlineColor(adv8BitAdvanced, 'foreground', new RGBA(104, 105, 106), 'SHOULD NOT LONGER BE 24-bit RGBA ANSI color code (104,105,106) after advanced color change.', false);
			}
		], 5);

	});

	/**
	 * Assert that the provided ANSI sequence exactly matches the text content of the resulting
	 * {@link HTMLSpanElement}.
	 *
	 * @param sequence The ANSI sequence to verify.
	 */
	function assertSequencestrictEqualToContent(sequence: string): void {
		const child: HTMLSpanElement = getSequenceOutput(sequence);
		assert(child.textContent === sequence);
	}

	test('Invalid codes treated as regular text', () => {

		// Individual components of ANSI code start are printed
		assertSequencestrictEqualToContent('\x1b');
		assertSequencestrictEqualToContent('[');

		// Unsupported sequence prints both characters
		assertSequencestrictEqualToContent('\x1b[');

		// Random strings are displayed properly
		for (let i = 0; i < 50; i++) {
			const uuid: string = generateUuid();
			assertSequencestrictEqualToContent(uuid);
		}

	});

	/**
	 * Assert that a given ANSI sequence maintains added content following the ANSI code, and that
	 * the expression itself is thrown away.
	 *
	 * @param sequence The ANSI sequence to verify. The provided sequence should contain ANSI codes
	 * only, and should not include actual text content as it is provided by this function.
	 */
	function assertEmptyOutput(sequence: string) {
		const child: HTMLSpanElement = getSequenceOutput(sequence + 'content');
		assert.strictEqual('content', child.textContent);
		assert.strictEqual(0, child.classList.length);
	}

	test('Empty sequence output', () => {

		const sequences: string[] = [
			// No colour codes
			'',
			'\x1b[;m',
			'\x1b[1;;m',
			'\x1b[m',
			'\x1b[99m'
		];

		sequences.forEach(sequence => {
			assertEmptyOutput(sequence);
		});

		// Check other possible ANSI terminators
		const terminators: string[] = 'ABCDHIJKfhmpsu'.split('');

		terminators.forEach(terminator => {
			assertEmptyOutput('\x1b[content' + terminator);
		});

	});

	test('calcANSI8bitColor', () => {
		// Invalid values
		// Negative (below range), simple range, decimals
		for (let i = -10; i <= 15; i += 0.5) {
			assert(calcANSI8bitColor(i) === undefined, 'Values less than 16 passed to calcANSI8bitColor should return undefined.');
		}
		// In-range range decimals
		for (let i = 16.5; i < 254; i += 1) {
			assert(calcANSI8bitColor(i) === undefined, 'Floats passed to calcANSI8bitColor should return undefined.');
		}
		// Above range
		for (let i = 256; i < 300; i += 0.5) {
			assert(calcANSI8bitColor(i) === undefined, 'Values grather than 255 passed to calcANSI8bitColor should return undefined.');
		}

		// All valid colors
		for (let red = 0; red <= 5; red++) {
			for (let green = 0; green <= 5; green++) {
				for (let blue = 0; blue <= 5; blue++) {
					const colorOut: any = calcANSI8bitColor(16 + red * 36 + green * 6 + blue);
					assert(colorOut.r === Math.round(red * (255 / 5)), 'Incorrect red value encountered for color');
					assert(colorOut.g === Math.round(green * (255 / 5)), 'Incorrect green value encountered for color');
					assert(colorOut.b === Math.round(blue * (255 / 5)), 'Incorrect balue value encountered for color');
				}
			}
		}

		// All grays
		for (let i = 232; i <= 255; i++) {
			const grayOut: any = calcANSI8bitColor(i);
			assert(grayOut.r === grayOut.g);
			assert(grayOut.r === grayOut.b);
			assert(grayOut.r === Math.round((i - 232) / 23 * 255));
		}
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/browser/debugConfigurationManager.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/browser/debugConfigurationManager.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ContextKeyService } from '../../../../../platform/contextkey/browser/contextKeyService.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { UriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentityService.js';
import { ConfigurationManager } from '../../browser/debugConfigurationManager.js';
import { DebugConfigurationProviderTriggerKind, IAdapterManager, IConfig, IDebugAdapterExecutable, IDebugSession } from '../../common/debug.js';
import { IPreferencesService } from '../../../../services/preferences/common/preferences.js';
import { TestQuickInputService } from '../../../../test/browser/workbenchTestServices.js';
import { TestHistoryService, TestContextService, TestExtensionService, TestStorageService } from '../../../../test/common/workbenchTestServices.js';

suite('debugConfigurationManager', () => {
	const configurationProviderType = 'custom-type';
	let _debugConfigurationManager: ConfigurationManager;
	let disposables: DisposableStore;

	const adapterManager = <IAdapterManager>{
		getDebugAdapterDescriptor(session: IDebugSession, config: IConfig): Promise<IDebugAdapterExecutable | undefined> {
			return Promise.resolve(undefined);
		},

		activateDebuggers(activationEvent: string, debugType?: string): Promise<void> {
			return Promise.resolve();
		},

		get onDidDebuggersExtPointRead(): Event<void> {
			return Event.None;
		}
	};

	const preferencesService = <IPreferencesService>{
		userSettingsResource: URI.file('/tmp/settings.json')
	};

	const configurationService = new TestConfigurationService();
	setup(() => {
		disposables = new DisposableStore();
		const fileService = disposables.add(new FileService(new NullLogService()));
		const instantiationService = disposables.add(new TestInstantiationService(new ServiceCollection([IPreferencesService, preferencesService], [IConfigurationService, configurationService])));
		_debugConfigurationManager = new ConfigurationManager(
			adapterManager,
			new TestContextService(),
			configurationService,
			new TestQuickInputService(),
			instantiationService,
			new TestStorageService(),
			new TestExtensionService(),
			new TestHistoryService(),
			new UriIdentityService(fileService),
			disposables.add(new ContextKeyService(configurationService)),
			new NullLogService());
	});

	teardown(() => disposables.dispose());

	ensureNoDisposablesAreLeakedInTestSuite();

	test('resolves configuration based on type', async () => {
		disposables.add(_debugConfigurationManager.registerDebugConfigurationProvider({
			type: configurationProviderType,
			resolveDebugConfiguration: (folderUri, config, token) => {
				assert.strictEqual(config.type, configurationProviderType);
				return Promise.resolve({
					...config,
					configurationResolved: true
				});
			},
			triggerKind: DebugConfigurationProviderTriggerKind.Initial
		}));

		const initialConfig: IConfig = {
			type: configurationProviderType,
			request: 'launch',
			name: 'configName',
		};

		const resultConfig = await _debugConfigurationManager.resolveConfigurationByProviders(undefined, configurationProviderType, initialConfig, CancellationToken.None);
		// eslint-disable-next-line local/code-no-any-casts
		assert.strictEqual((resultConfig as any).configurationResolved, true, 'Configuration should be updated by test provider');
	});

	test('resolves configuration from second provider if type changes', async () => {
		const secondProviderType = 'second-provider';
		disposables.add(_debugConfigurationManager.registerDebugConfigurationProvider({
			type: configurationProviderType,
			resolveDebugConfiguration: (folderUri, config, token) => {
				assert.strictEqual(config.type, configurationProviderType);
				return Promise.resolve({
					...config,
					type: secondProviderType
				});
			},
			triggerKind: DebugConfigurationProviderTriggerKind.Initial
		}));
		disposables.add(_debugConfigurationManager.registerDebugConfigurationProvider({
			type: secondProviderType,
			resolveDebugConfiguration: (folderUri, config, token) => {
				assert.strictEqual(config.type, secondProviderType);
				return Promise.resolve({
					...config,
					configurationResolved: true
				});
			},
			triggerKind: DebugConfigurationProviderTriggerKind.Initial
		}));

		const initialConfig: IConfig = {
			type: configurationProviderType,
			request: 'launch',
			name: 'configName',
		};

		const resultConfig = await _debugConfigurationManager.resolveConfigurationByProviders(undefined, configurationProviderType, initialConfig, CancellationToken.None);
		assert.strictEqual(resultConfig!.type, secondProviderType);
		// eslint-disable-next-line local/code-no-any-casts
		assert.strictEqual((resultConfig as any).configurationResolved, true, 'Configuration should be updated by test provider');
	});

	teardown(() => disposables.clear());
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/browser/debugHover.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/browser/debugHover.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { findExpressionInStackFrame } from '../../browser/debugHover.js';
import type { IExpression, IScope } from '../../common/debug.js';
import { Scope, StackFrame, Thread, Variable } from '../../common/debugModel.js';
import { Source } from '../../common/debugSource.js';
import { createTestSession } from './callStack.test.js';
import { createMockDebugModel, mockUriIdentityService } from './mockDebugModel.js';

suite('Debug - Hover', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	test('find expression in stack frame', async () => {
		const model = createMockDebugModel(disposables);
		const session = disposables.add(createTestSession(model));

		const thread = new class extends Thread {
			public override getCallStack(): StackFrame[] {
				return [stackFrame];
			}
		}(session, 'mockthread', 1);

		const firstSource = new Source({
			name: 'internalModule.js',
			path: 'a/b/c/d/internalModule.js',
			sourceReference: 10,
		}, 'aDebugSessionId', mockUriIdentityService, new NullLogService());

		const stackFrame = new class extends StackFrame {
			override getScopes(): Promise<IScope[]> {
				return Promise.resolve([scope]);
			}
		}(thread, 1, firstSource, 'app.js', 'normal', { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 10 }, 1, true);


		const scope = new class extends Scope {
			override getChildren(): Promise<IExpression[]> {
				return Promise.resolve([variableA]);
			}
		}(stackFrame, 1, 'local', 1, false, 10, 10);

		const variableA = new class extends Variable {
			override getChildren(): Promise<IExpression[]> {
				return Promise.resolve([variableB]);
			}
		}(session, 1, scope, 2, 'A', 'A', undefined, 0, 0, undefined, {}, 'string');
		const variableB = new Variable(session, 1, scope, 2, 'B', 'A.B', undefined, 0, 0, undefined, {}, 'string');

		assert.strictEqual(await findExpressionInStackFrame(stackFrame, []), undefined);
		assert.strictEqual(await findExpressionInStackFrame(stackFrame, ['A']), variableA);
		assert.strictEqual(await findExpressionInStackFrame(stackFrame, ['doesNotExist', 'no']), undefined);
		assert.strictEqual(await findExpressionInStackFrame(stackFrame, ['a']), undefined);
		assert.strictEqual(await findExpressionInStackFrame(stackFrame, ['B']), undefined);
		assert.strictEqual(await findExpressionInStackFrame(stackFrame, ['A', 'B']), variableB);
		assert.strictEqual(await findExpressionInStackFrame(stackFrame, ['A', 'C']), undefined);

		// We do not search in expensive scopes
		scope.expensive = true;
		assert.strictEqual(await findExpressionInStackFrame(stackFrame, ['A']), undefined);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/browser/debugMemory.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/browser/debugMemory.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { decodeBase64, encodeBase64, VSBuffer } from '../../../../../base/common/buffer.js';
import { Emitter } from '../../../../../base/common/event.js';
import { mockObject, MockObject } from '../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { MemoryRangeType } from '../../common/debug.js';
import { MemoryRegion } from '../../common/debugModel.js';
import { MockSession } from '../common/mockDebug.js';

suite('Debug - Memory', () => {
	const dapResponseCommon = {
		command: 'someCommand',
		type: 'response',
		seq: 1,
		request_seq: 1,
		success: true,
	};

	ensureNoDisposablesAreLeakedInTestSuite();

	suite('MemoryRegion', () => {
		let memory: VSBuffer;
		let unreadable: number;
		let invalidateMemoryEmitter: Emitter<DebugProtocol.MemoryEvent>;
		let session: MockObject<MockSession, 'onDidInvalidateMemory'>;
		let region: MemoryRegion;

		setup(() => {
			const memoryBuf = new Uint8Array(1024);
			for (let i = 0; i < memoryBuf.length; i++) {
				memoryBuf[i] = i; // will be 0-255
			}
			memory = VSBuffer.wrap(memoryBuf);
			invalidateMemoryEmitter = new Emitter();
			unreadable = 0;

			session = mockObject<MockSession>()({
				onDidInvalidateMemory: invalidateMemoryEmitter.event
			});

			session.readMemory.callsFake((ref: string, fromOffset: number, count: number) => {
				const res: DebugProtocol.ReadMemoryResponse = ({
					...dapResponseCommon,
					body: {
						address: '0',
						data: encodeBase64(memory.slice(fromOffset, fromOffset + Math.max(0, count - unreadable))),
						unreadableBytes: unreadable
					}
				});

				unreadable = 0;

				return Promise.resolve(res);
			});

			session.writeMemory.callsFake((ref: string, fromOffset: number, data: string): DebugProtocol.WriteMemoryResponse => {
				const decoded = decodeBase64(data);
				for (let i = 0; i < decoded.byteLength; i++) {
					memory.buffer[fromOffset + i] = decoded.buffer[i];
				}

				return ({
					...dapResponseCommon,
					body: {
						bytesWritten: decoded.byteLength,
						offset: fromOffset,
					}
				});
			});

			// eslint-disable-next-line local/code-no-any-casts
			region = new MemoryRegion('ref', session as any);
		});

		teardown(() => {
			region.dispose();
		});

		test('reads a simple range', async () => {
			assert.deepStrictEqual(await region.read(10, 14), [
				{ type: MemoryRangeType.Valid, offset: 10, length: 4, data: VSBuffer.wrap(new Uint8Array([10, 11, 12, 13])) }
			]);
		});

		test('reads a non-contiguous range', async () => {
			unreadable = 3;
			assert.deepStrictEqual(await region.read(10, 14), [
				{ type: MemoryRangeType.Valid, offset: 10, length: 1, data: VSBuffer.wrap(new Uint8Array([10])) },
				{ type: MemoryRangeType.Unreadable, offset: 11, length: 3 },
			]);
		});
	});
});
```

--------------------------------------------------------------------------------

````
