---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 439
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 439 of 552)

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

---[FILE: src/vs/workbench/contrib/processExplorer/browser/processExplorerControl.ts]---
Location: vscode-main/src/vs/workbench/contrib/processExplorer/browser/processExplorerControl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/processExplorer.css';
import { localize } from '../../../../nls.js';
import { $, append, Dimension, getDocument } from '../../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { IIdentityProvider, IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { IDataSource, ITreeRenderer, ITreeNode, ITreeContextMenuEvent } from '../../../../base/browser/ui/tree/tree.js';
import { ProcessItem } from '../../../../base/common/processes.js';
import { IRemoteDiagnosticError, isRemoteDiagnosticError } from '../../../../platform/diagnostics/common/diagnostics.js';
import { ByteSize } from '../../../../platform/files/common/files.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { WorkbenchDataTree } from '../../../../platform/list/browser/listService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IAction, Separator, toAction } from '../../../../base/common/actions.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { RenderIndentGuides } from '../../../../base/browser/ui/tree/abstractTree.js';
import { Delayer } from '../../../../base/common/async.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IManagedHover } from '../../../../base/browser/ui/hover/hover.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IResolvedProcessInformation } from '../../../../platform/process/common/process.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { Schemas } from '../../../../base/common/network.js';
import { isWeb } from '../../../../base/common/platform.js';

const DEBUG_FLAGS_PATTERN = /\s--inspect(?:-brk|port)?=(?<port>\d+)?/;
const DEBUG_PORT_PATTERN = /\s--inspect-port=(?<port>\d+)/;

//#region --- process explorer tree

interface IProcessTree {
	readonly processes: IProcessInformation;
}

interface IProcessInformation {
	readonly processRoots: IMachineProcessInformation[];
}

interface IMachineProcessInformation {
	readonly name: string;
	readonly rootProcess: ProcessItem | IRemoteDiagnosticError;
}

function isMachineProcessInformation(item: unknown): item is IMachineProcessInformation {
	const candidate = item as IMachineProcessInformation | undefined;

	return !!candidate?.name && !!candidate?.rootProcess;
}

function isProcessInformation(item: unknown): item is IProcessInformation {
	const candidate = item as IProcessInformation | undefined;

	return !!candidate?.processRoots;
}

function isProcessItem(item: unknown): item is ProcessItem {
	const candidate = item as ProcessItem | undefined;

	return typeof candidate?.pid === 'number';
}

class ProcessListDelegate implements IListVirtualDelegate<IMachineProcessInformation | ProcessItem | IRemoteDiagnosticError> {

	getHeight() {
		return 22;
	}

	getTemplateId(element: IProcessInformation | IMachineProcessInformation | ProcessItem | IRemoteDiagnosticError) {
		if (isProcessItem(element)) {
			return 'process';
		}

		if (isMachineProcessInformation(element)) {
			return 'machine';
		}

		if (isRemoteDiagnosticError(element)) {
			return 'error';
		}

		if (isProcessInformation(element)) {
			return 'header';
		}

		return '';
	}
}

class ProcessTreeDataSource implements IDataSource<IProcessTree, IProcessInformation | IMachineProcessInformation | ProcessItem | IRemoteDiagnosticError> {

	hasChildren(element: IProcessTree | IProcessInformation | IMachineProcessInformation | ProcessItem | IRemoteDiagnosticError): boolean {
		if (isRemoteDiagnosticError(element)) {
			return false;
		}

		if (isProcessItem(element)) {
			return !!element.children?.length;
		}

		return true;
	}

	getChildren(element: IProcessTree | IProcessInformation | IMachineProcessInformation | ProcessItem | IRemoteDiagnosticError) {
		if (isProcessItem(element)) {
			return element.children ?? [];
		}

		if (isRemoteDiagnosticError(element)) {
			return [];
		}

		if (isProcessInformation(element)) {
			if (element.processRoots.length > 1) {
				return element.processRoots; // If there are multiple process roots, return these, otherwise go directly to the root process
			}

			if (element.processRoots.length > 0) {
				return [element.processRoots[0].rootProcess];
			}

			return [];
		}

		if (isMachineProcessInformation(element)) {
			return [element.rootProcess];
		}

		return element.processes ? [element.processes] : [];
	}
}

function createRow(container: HTMLElement, extraClass?: string) {
	const row = append(container, $('.row'));
	if (extraClass) {
		row.classList.add(extraClass);
	}

	const name = append(row, $('.cell.name'));
	const cpu = append(row, $('.cell.cpu'));
	const memory = append(row, $('.cell.memory'));
	const pid = append(row, $('.cell.pid'));

	return { name, cpu, memory, pid };
}

interface IProcessRowTemplateData {
	readonly name: HTMLElement;
}

interface IProcessItemTemplateData extends IProcessRowTemplateData {
	readonly cpu: HTMLElement;
	readonly memory: HTMLElement;
	readonly pid: HTMLElement;
	readonly hover?: ProcessItemHover;
}

class ProcessHeaderTreeRenderer implements ITreeRenderer<IProcessInformation, void, IProcessItemTemplateData> {

	readonly templateId: string = 'header';

	renderTemplate(container: HTMLElement): IProcessItemTemplateData {
		container.previousElementSibling?.classList.add('force-no-twistie'); // hack, but no API for hiding twistie on tree

		return createRow(container, 'header');
	}

	renderElement(node: ITreeNode<IProcessInformation, void>, index: number, templateData: IProcessItemTemplateData): void {
		templateData.name.textContent = localize('processName', "Process Name");
		templateData.cpu.textContent = localize('processCpu', "CPU (%)");
		templateData.pid.textContent = localize('processPid', "PID");
		templateData.memory.textContent = localize('processMemory', "Memory (MB)");
	}

	disposeTemplate(templateData: unknown): void {
		// Nothing to do
	}
}

class MachineRenderer implements ITreeRenderer<IMachineProcessInformation, void, IProcessRowTemplateData> {

	readonly templateId: string = 'machine';

	renderTemplate(container: HTMLElement): IProcessRowTemplateData {
		return createRow(container);
	}

	renderElement(node: ITreeNode<IMachineProcessInformation, void>, index: number, templateData: IProcessRowTemplateData): void {
		templateData.name.textContent = node.element.name;
	}

	disposeTemplate(templateData: IProcessRowTemplateData): void {
		// Nothing to do
	}
}

class ErrorRenderer implements ITreeRenderer<IRemoteDiagnosticError, void, IProcessRowTemplateData> {

	readonly templateId: string = 'error';

	renderTemplate(container: HTMLElement): IProcessRowTemplateData {
		return createRow(container);
	}

	renderElement(node: ITreeNode<IRemoteDiagnosticError, void>, index: number, templateData: IProcessRowTemplateData): void {
		templateData.name.textContent = node.element.errorMessage;
	}

	disposeTemplate(templateData: IProcessRowTemplateData): void {
		// Nothing to do
	}
}

class ProcessItemHover extends Disposable {

	private hover: IManagedHover;
	private content = '';

	constructor(
		container: HTMLElement,
		@IHoverService hoverService: IHoverService
	) {
		super();

		this.hover = this._register(hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), container, this.content));
	}

	update(content: string): void {
		if (this.content !== content) {
			this.content = content;
			this.hover.update(content);
		}
	}
}

class ProcessRenderer implements ITreeRenderer<ProcessItem, void, IProcessItemTemplateData> {

	readonly templateId: string = 'process';

	constructor(
		private model: ProcessExplorerModel,
		@IHoverService private readonly hoverService: IHoverService
	) { }

	renderTemplate(container: HTMLElement): IProcessItemTemplateData {
		const row = createRow(container);

		return {
			name: row.name,
			cpu: row.cpu,
			memory: row.memory,
			pid: row.pid,
			hover: new ProcessItemHover(row.name, this.hoverService)
		};
	}

	renderElement(node: ITreeNode<ProcessItem, void>, index: number, templateData: IProcessItemTemplateData): void {
		const { element } = node;

		const pid = element.pid.toFixed(0);

		templateData.name.textContent = this.model.getName(element.pid, element.name);
		templateData.cpu.textContent = element.load.toFixed(0);
		templateData.memory.textContent = (element.mem / ByteSize.MB).toFixed(0);
		templateData.pid.textContent = pid;
		templateData.pid.parentElement!.id = `pid-${pid}`;

		templateData.hover?.update(element.cmd);
	}

	disposeTemplate(templateData: IProcessItemTemplateData): void {
		templateData.hover?.dispose();
	}
}

class ProcessAccessibilityProvider implements IListAccessibilityProvider<IMachineProcessInformation | ProcessItem | IRemoteDiagnosticError> {

	getWidgetAriaLabel(): string {
		return localize('processExplorer', "Process Explorer");
	}

	getAriaLabel(element: IMachineProcessInformation | ProcessItem | IRemoteDiagnosticError): string | null {
		if (isProcessItem(element) || isMachineProcessInformation(element)) {
			return element.name;
		}

		if (isRemoteDiagnosticError(element)) {
			return element.hostName;
		}

		return null;
	}
}

class ProcessIdentityProvider implements IIdentityProvider<IMachineProcessInformation | ProcessItem | IRemoteDiagnosticError> {

	getId(element: IRemoteDiagnosticError | ProcessItem | IMachineProcessInformation): { toString(): string } {
		if (isProcessItem(element)) {
			return element.pid.toString();
		}

		if (isRemoteDiagnosticError(element)) {
			return element.hostName;
		}

		if (isProcessInformation(element)) {
			return 'processes';
		}

		if (isMachineProcessInformation(element)) {
			return element.name;
		}

		return 'header';
	}
}

//#endregion

export abstract class ProcessExplorerControl extends Disposable {

	private dimensions: Dimension | undefined = undefined;

	private readonly model: ProcessExplorerModel;
	private tree: WorkbenchDataTree<IProcessTree, IProcessTree | IMachineProcessInformation | ProcessItem | IProcessInformation | IRemoteDiagnosticError> | undefined;

	private readonly delayer = this._register(new Delayer(1000));

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IProductService private readonly productService: IProductService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@ICommandService private readonly commandService: ICommandService,
		@IClipboardService private readonly clipboardService: IClipboardService
	) {
		super();

		this.model = new ProcessExplorerModel(this.productService);
	}

	protected killProcess?(pid: number, signal: string): Promise<void>;
	protected abstract resolveProcesses(): Promise<IResolvedProcessInformation>;

	protected create(container: HTMLElement): void {
		this.createProcessTree(container);

		this.update();
	}

	private createProcessTree(container: HTMLElement): void {
		container.classList.add('process-explorer');
		container.id = 'process-explorer';

		const renderers = [
			this.instantiationService.createInstance(ProcessRenderer, this.model),
			new ProcessHeaderTreeRenderer(),
			new MachineRenderer(),
			new ErrorRenderer()
		];

		this.tree = this._register(this.instantiationService.createInstance(
			WorkbenchDataTree<IProcessTree, IProcessTree | IMachineProcessInformation | ProcessItem | IProcessInformation | IRemoteDiagnosticError>,
			'processExplorer',
			container,
			new ProcessListDelegate(),
			renderers,
			new ProcessTreeDataSource(),
			{
				accessibilityProvider: new ProcessAccessibilityProvider(),
				identityProvider: new ProcessIdentityProvider(),
				expandOnlyOnTwistieClick: true,
				renderIndentGuides: RenderIndentGuides.OnHover
			}));

		this._register(this.tree.onKeyDown(e => this.onTreeKeyDown(e)));
		this._register(this.tree.onContextMenu(e => this.onTreeContextMenu(container, e)));

		this.tree.setInput(this.model);
		this.layoutTree();
	}

	private async onTreeKeyDown(e: KeyboardEvent): Promise<void> {
		const event = new StandardKeyboardEvent(e);
		if (event.keyCode === KeyCode.KeyE && event.altKey) {
			const selectionPids = this.getSelectedPids();
			await Promise.all(selectionPids.map(pid => this.killProcess?.(pid, 'SIGTERM')));
		}
	}

	private onTreeContextMenu(container: HTMLElement, e: ITreeContextMenuEvent<IProcessTree | IMachineProcessInformation | ProcessItem | IProcessInformation | IRemoteDiagnosticError | null>): void {
		if (!isProcessItem(e.element)) {
			return;
		}

		const item = e.element;
		const pid = Number(item.pid);

		const actions: IAction[] = [];

		if (typeof this.killProcess === 'function') {
			actions.push(toAction({ id: 'killProcess', label: localize('killProcess', "Kill Process"), run: () => this.killProcess?.(pid, 'SIGTERM') }));
			actions.push(toAction({ id: 'forceKillProcess', label: localize('forceKillProcess', "Force Kill Process"), run: () => this.killProcess?.(pid, 'SIGKILL') }));

			actions.push(new Separator());
		}

		actions.push(toAction({
			id: 'copy',
			label: localize('copy', "Copy"),
			run: () => {
				const selectionPids = this.getSelectedPids();

				if (!selectionPids?.includes(pid)) {
					selectionPids.length = 0; // If the selection does not contain the right clicked item, copy the right clicked item only.
					selectionPids.push(pid);
				}

				// eslint-disable-next-line no-restricted-syntax
				const rows = selectionPids?.map(e => getDocument(container).getElementById(`pid-${e}`)).filter(e => !!e);
				if (rows) {
					const text = rows.map(e => e.innerText).filter(e => !!e);
					this.clipboardService.writeText(text.join('\n'));
				}
			}
		}));

		actions.push(toAction({
			id: 'copyAll',
			label: localize('copyAll', "Copy All"),
			run: () => {
				// eslint-disable-next-line no-restricted-syntax
				const processList = getDocument(container).getElementById('process-explorer');
				if (processList) {
					this.clipboardService.writeText(processList.innerText);
				}
			}
		}));

		if (this.isDebuggable(item.cmd)) {
			actions.push(new Separator());
			actions.push(toAction({ id: 'debug', label: localize('debug', "Debug"), run: () => this.attachTo(item) }));
		}

		this.contextMenuService.showContextMenu({
			getAnchor: () => e.anchor,
			getActions: () => actions
		});
	}

	private isDebuggable(cmd: string): boolean {
		if (isWeb) {
			return false;
		}

		const matches = DEBUG_FLAGS_PATTERN.exec(cmd);

		return (matches && matches.groups!.port !== '0') || cmd.indexOf('node ') >= 0 || cmd.indexOf('node.exe') >= 0;
	}

	private attachTo(item: ProcessItem): void {
		const config: { type: string; request: string; name: string; port?: number; processId?: string } = {
			type: 'node',
			request: 'attach',
			name: `process ${item.pid}`
		};

		let matches = DEBUG_FLAGS_PATTERN.exec(item.cmd);
		if (matches) {
			config.port = Number(matches.groups!.port);
		} else {
			config.processId = String(item.pid); // no port -> try to attach via pid (send SIGUSR1)
		}

		// a debug-port=n or inspect-port=n overrides the port
		matches = DEBUG_PORT_PATTERN.exec(item.cmd);
		if (matches) {
			config.port = Number(matches.groups!.port); // override port
		}

		this.commandService.executeCommand('debug.startFromConfig', config);
	}

	private getSelectedPids(): number[] {
		return coalesce(this.tree?.getSelection()?.map(e => {
			if (!isProcessItem(e)) {
				return undefined;
			}

			return e.pid;
		}) ?? []);
	}

	private async update(): Promise<void> {
		const { processes, pidToNames } = await this.resolveProcesses();

		this.model.update(processes, pidToNames);

		this.tree?.updateChildren();
		this.layoutTree();

		this.delayer.trigger(() => this.update());
	}

	focus(): void {
		this.tree?.domFocus();
	}

	layout(dimension: Dimension): void {
		this.dimensions = dimension;

		this.layoutTree();
	}

	private layoutTree(): void {
		if (this.dimensions && this.tree) {
			this.tree.layout(this.dimensions.height, this.dimensions.width);
		}
	}
}

class ProcessExplorerModel implements IProcessTree {

	processes: IProcessInformation = { processRoots: [] };

	private readonly mapPidToName = new Map<number, string>();

	constructor(@IProductService private productService: IProductService) { }

	update(processRoots: IMachineProcessInformation[], pidToNames: [number, string][]): void {

		// PID to Names
		this.mapPidToName.clear();

		for (const [pid, name] of pidToNames) {
			this.mapPidToName.set(pid, name);
		}

		// Processes
		processRoots.forEach((info, index) => {
			if (isProcessItem(info.rootProcess)) {
				info.rootProcess.name = index === 0 ? this.productService.applicationName : 'remote-server';
			}
		});

		this.processes = { processRoots };
	}

	getName(pid: number, fallback: string): string {
		return this.mapPidToName.get(pid) ?? fallback;
	}
}

export class BrowserProcessExplorerControl extends ProcessExplorerControl {

	constructor(
		container: HTMLElement,
		@IInstantiationService instantiationService: IInstantiationService,
		@IProductService productService: IProductService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@ICommandService commandService: ICommandService,
		@IClipboardService clipboardService: IClipboardService,
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@ILabelService private readonly labelService: ILabelService
	) {
		super(instantiationService, productService, contextMenuService, commandService, clipboardService);

		this.create(container);
	}

	protected override async resolveProcesses(): Promise<IResolvedProcessInformation> {
		const connection = this.remoteAgentService.getConnection();
		if (!connection) {
			return { pidToNames: [], processes: [] };
		}

		const processes: { name: string; rootProcess: ProcessItem | IRemoteDiagnosticError }[] = [];

		const hostName = this.labelService.getHostLabel(Schemas.vscodeRemote, connection.remoteAuthority);
		const result = await this.remoteAgentService.getDiagnosticInfo({ includeProcesses: true });
		if (result) {
			if (isRemoteDiagnosticError(result)) {
				processes.push({ name: result.hostName, rootProcess: result });
			} else if (result.processes) {
				processes.push({ name: hostName, rootProcess: result.processes });
			}
		}

		return { pidToNames: [], processes };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/processExplorer/browser/processExplorerEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/processExplorer/browser/processExplorerEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Dimension } from '../../../../base/browser/dom.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { EditorPane } from '../../../browser/parts/editor/editorPane.js';
import { IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import { BrowserProcessExplorerControl, ProcessExplorerControl } from './processExplorerControl.js';

export class ProcessExplorerEditor extends EditorPane {

	static readonly ID: string = 'workbench.editor.processExplorer';

	protected processExplorerControl: ProcessExplorerControl | undefined = undefined;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IInstantiationService protected readonly instantiationService: IInstantiationService
	) {
		super(ProcessExplorerEditor.ID, group, telemetryService, themeService, storageService);
	}

	protected override createEditor(parent: HTMLElement): void {
		this.processExplorerControl = this._register(this.instantiationService.createInstance(BrowserProcessExplorerControl, parent));
	}

	override focus(): void {
		this.processExplorerControl?.focus();
	}

	override layout(dimension: Dimension): void {
		this.processExplorerControl?.layout(dimension);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/processExplorer/browser/processExplorerEditorInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/processExplorer/browser/processExplorerEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { EditorInputCapabilities, IUntypedEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';

const processExplorerEditorIcon = registerIcon('process-explorer-editor-label-icon', Codicon.serverProcess, localize('processExplorerEditorLabelIcon', 'Icon of the process explorer editor label.'));

export class ProcessExplorerEditorInput extends EditorInput {

	static readonly ID = 'workbench.editor.processExplorer';

	static readonly RESOURCE = URI.from({
		scheme: 'process-explorer',
		path: 'default'
	});

	private static _instance: ProcessExplorerEditorInput;
	static get instance() {
		if (!ProcessExplorerEditorInput._instance || ProcessExplorerEditorInput._instance.isDisposed()) {
			ProcessExplorerEditorInput._instance = new ProcessExplorerEditorInput();
		}

		return ProcessExplorerEditorInput._instance;
	}

	override get typeId(): string { return ProcessExplorerEditorInput.ID; }

	override get editorId(): string | undefined { return ProcessExplorerEditorInput.ID; }

	override get capabilities(): EditorInputCapabilities { return EditorInputCapabilities.Readonly | EditorInputCapabilities.Singleton; }

	readonly resource = ProcessExplorerEditorInput.RESOURCE;

	override getName(): string {
		return localize('processExplorerInputName', "Process Explorer");
	}

	override getIcon(): ThemeIcon {
		return processExplorerEditorIcon;
	}

	override matches(other: EditorInput | IUntypedEditorInput): boolean {
		if (super.matches(other)) {
			return true;
		}

		return other instanceof ProcessExplorerEditorInput;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/processExplorer/browser/media/processExplorer.css]---
Location: vscode-main/src/vs/workbench/contrib/processExplorer/browser/media/processExplorer.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.process-explorer .row {
	display: flex;
}

.process-explorer .row .cell:not(:first-of-type) {
	padding-left: 10px;
}

.process-explorer .row .cell:not(:last-of-type) {
	padding-right: 10px;
}

.process-explorer .row .cell {
	border-right: 1px solid var(--vscode-tree-tableColumnsBorder);
}

.process-explorer .row.header {
	font-weight: 600;
	border-bottom: 1px solid var(--vscode-tree-tableColumnsBorder);
}

.process-explorer .row.header .cell {
	overflow: hidden;
	text-overflow: ellipsis;
}

.process-explorer .monaco-tl-twistie.force-no-twistie {
	background-image: none !important;
	width: 0 !important;
	padding-right: 0 !important;
	visibility: hidden;
}

.process-explorer .row .cell.name {
	text-align: left;
	flex-grow: 1;
	overflow: hidden;
	text-overflow: ellipsis;
}

.process-explorer .row .cell.cpu {
	flex: 0 0 60px;
}

.process-explorer .row .cell.memory {
	flex: 0 0 90px;
}

.process-explorer .row .cell.pid {
	flex: 0 0 50px;
}

.mac:not(.fullscreen) .process-explorer .monaco-list:focus::before {
	/* Rounded corners to make focus outline appear properly (unless fullscreen) */
	border-bottom-right-radius: 10px;
	border-bottom-left-radius: 10px;
}

.mac.macos-tahoe:not(.fullscreen) .process-explorer .monaco-list:focus::before {
	/* macOS Tahoe increased rounded corners size */
	border-bottom-right-radius: 16px;
	border-bottom-left-radius: 16px;
}

.process-explorer .monaco-list-row:first-of-type {
	border-bottom: 1px solid var(--vscode-tree-tableColumnsBorder);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/processExplorer/electron-browser/processExplorer.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/processExplorer/electron-browser/processExplorer.contribution.ts

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
import { NativeProcessExplorerEditor } from './processExplorerEditor.js';
import { ProcessExplorerEditorInput } from '../browser/processExplorerEditorInput.js';

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(NativeProcessExplorerEditor, NativeProcessExplorerEditor.ID, localize('processExplorer', "Process Explorer")),
	[new SyncDescriptor(ProcessExplorerEditorInput)]
);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/processExplorer/electron-browser/processExplorerControl.ts]---
Location: vscode-main/src/vs/workbench/contrib/processExplorer/electron-browser/processExplorerControl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IProcessService, IResolvedProcessInformation } from '../../../../platform/process/common/process.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { ProcessExplorerControl } from '../browser/processExplorerControl.js';

export class NativeProcessExplorerControl extends ProcessExplorerControl {

	constructor(
		container: HTMLElement,
		@IInstantiationService instantiationService: IInstantiationService,
		@IProductService productService: IProductService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@ICommandService commandService: ICommandService,
		@IProcessService private readonly processService: IProcessService,
		@IClipboardService clipboardService: IClipboardService
	) {
		super(instantiationService, productService, contextMenuService, commandService, clipboardService);

		this.create(container);
	}

	protected override killProcess(pid: number, signal: string): Promise<void> {
		return this.nativeHostService.killProcess(pid, signal);
	}

	protected override resolveProcesses(): Promise<IResolvedProcessInformation> {
		return this.processService.resolveProcesses();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/processExplorer/electron-browser/processExplorerEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/processExplorer/electron-browser/processExplorerEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import { ProcessExplorerEditor } from '../browser/processExplorerEditor.js';
import { NativeProcessExplorerControl } from './processExplorerControl.js';

export class NativeProcessExplorerEditor extends ProcessExplorerEditor {

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IInstantiationService instantiationService: IInstantiationService
	) {
		super(group, telemetryService, themeService, storageService, instantiationService);
	}

	protected override createEditor(parent: HTMLElement): void {
		this.processExplorerControl = this._register(this.instantiationService.createInstance(NativeProcessExplorerControl, parent));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/quickaccess/browser/commandsQuickAccess.ts]---
Location: vscode-main/src/vs/workbench/contrib/quickaccess/browser/commandsQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isFirefox } from '../../../../base/browser/browser.js';
import { raceTimeout, timeout } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { stripIcons } from '../../../../base/common/iconLabels.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Language } from '../../../../base/common/platform.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IEditor } from '../../../../editor/common/editorCommon.js';
import { AbstractEditorCommandsQuickAccessProvider } from '../../../../editor/contrib/quickAccess/browser/commandsQuickAccess.js';
import { localize, localize2 } from '../../../../nls.js';
import { isLocalizedString } from '../../../../platform/action/common/action.js';
import { Action2, IMenuService, MenuId, MenuItemAction, SubmenuItemAction } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationChangeEvent, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { CommandsHistory, ICommandQuickPick } from '../../../../platform/quickinput/browser/commandsQuickAccess.js';
import { TriggerAction } from '../../../../platform/quickinput/browser/pickerQuickAccess.js';
import { DefaultQuickAccessFilterValue } from '../../../../platform/quickinput/common/quickAccess.js';
import { IQuickInputService, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IWorkbenchQuickAccessConfiguration } from '../../../browser/quickaccess.js';
import { CommandInformationResult, IAiRelatedInformationService, RelatedInformationType } from '../../../services/aiRelatedInformation/common/aiRelatedInformation.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { createKeybindingCommandQuery } from '../../../services/preferences/browser/keybindingsEditorModel.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { CHAT_OPEN_ACTION_ID } from '../../chat/browser/actions/chatActions.js';
import { ASK_QUICK_QUESTION_ACTION_ID } from '../../chat/browser/actions/chatQuickInputActions.js';
import { IChatAgentService } from '../../chat/common/chatAgents.js';
import { ChatAgentLocation } from '../../chat/common/constants.js';

export class CommandsQuickAccessProvider extends AbstractEditorCommandsQuickAccessProvider {

	private static AI_RELATED_INFORMATION_MAX_PICKS = 5;
	private static AI_RELATED_INFORMATION_DEBOUNCE = 200;

	// If extensions are not yet registered, we wait for a little moment to give them
	// a chance to register so that the complete set of commands shows up as result
	// We do not want to delay functionality beyond that time though to keep the commands
	// functional.
	private readonly extensionRegistrationRace: Promise<boolean | undefined>;

	private useAiRelatedInfo = false;

	protected get activeTextEditorControl(): IEditor | undefined { return this.editorService.activeTextEditorControl; }

	get defaultFilterValue(): DefaultQuickAccessFilterValue | undefined {
		if (this.configuration.preserveInput) {
			return DefaultQuickAccessFilterValue.LAST;
		}

		return undefined;
	}

	constructor(
		@IEditorService private readonly editorService: IEditorService,
		@IMenuService private readonly menuService: IMenuService,
		@IExtensionService extensionService: IExtensionService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IKeybindingService keybindingService: IKeybindingService,
		@ICommandService commandService: ICommandService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IDialogService dialogService: IDialogService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@IPreferencesService private readonly preferencesService: IPreferencesService,
		@IProductService private readonly productService: IProductService,
		@IAiRelatedInformationService private readonly aiRelatedInformationService: IAiRelatedInformationService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
	) {
		super({
			showAlias: !Language.isDefaultVariant(),
			noResultsPick: () => ({
				label: localize('noCommandResults', "No matching commands"),
				commandId: ''
			}),
		}, instantiationService, keybindingService, commandService, telemetryService, dialogService);

		this.extensionRegistrationRace = raceTimeout(extensionService.whenInstalledExtensionsRegistered(), 800);
		this._register(configurationService.onDidChangeConfiguration((e) => this.updateOptions(e)));
		this.updateOptions();
	}

	private get configuration() {
		const commandPaletteConfig = this.configurationService.getValue<IWorkbenchQuickAccessConfiguration>().workbench.commandPalette;

		return {
			preserveInput: commandPaletteConfig.preserveInput,
			showAskInChat: commandPaletteConfig.showAskInChat,
			experimental: commandPaletteConfig.experimental
		};
	}

	private updateOptions(e?: IConfigurationChangeEvent): void {
		if (e && !e.affectsConfiguration('workbench.commandPalette.experimental')) {
			return;
		}

		const config = this.configuration;
		const suggestedCommandIds = config.experimental.suggestCommands && this.productService.commandPaletteSuggestedCommandIds?.length
			? new Set(this.productService.commandPaletteSuggestedCommandIds)
			: undefined;
		this.options.suggestedCommandIds = suggestedCommandIds;
		this.useAiRelatedInfo = config.experimental.enableNaturalLanguageSearch;
	}

	protected async getCommandPicks(token: CancellationToken): Promise<Array<ICommandQuickPick>> {

		// wait for extensions registration or 800ms once
		await this.extensionRegistrationRace;

		if (token.isCancellationRequested) {
			return [];
		}

		return [
			...this.getCodeEditorCommandPicks(),
			...this.getGlobalCommandPicks()
		].map(picks => ({
			...picks,
			buttons: [{
				iconClass: ThemeIcon.asClassName(Codicon.gear),
				tooltip: localize('configure keybinding', "Configure Keybinding"),
			}],
			trigger: (): TriggerAction => {
				this.preferencesService.openGlobalKeybindingSettings(false, { query: createKeybindingCommandQuery(picks.commandId, picks.commandWhen) });
				return TriggerAction.CLOSE_PICKER;
			},
		}));
	}

	protected hasAdditionalCommandPicks(filter: string, token: CancellationToken): boolean {
		if (
			!this.useAiRelatedInfo
			|| token.isCancellationRequested
			|| filter === ''
			|| !this.aiRelatedInformationService.isEnabled()
		) {
			return false;
		}

		return true;
	}

	protected async getAdditionalCommandPicks(allPicks: ICommandQuickPick[], picksSoFar: ICommandQuickPick[], filter: string, token: CancellationToken): Promise<Array<ICommandQuickPick | IQuickPickSeparator>> {
		if (!this.hasAdditionalCommandPicks(filter, token)) {
			return [];
		}

		let additionalPicks: (ICommandQuickPick | IQuickPickSeparator)[] = [];
		try {
			// Wait a bit to see if the user is still typing
			await timeout(CommandsQuickAccessProvider.AI_RELATED_INFORMATION_DEBOUNCE, token);
			additionalPicks = await this.getRelatedInformationPicks(allPicks, picksSoFar, filter, token);
		} catch (e) {
			// Ignore and continue to add "Ask in Chat" option
		}

		// If enabled in settings, add "Ask in Chat" option after a separator (if needed).
		if (this.configuration.showAskInChat) {
			const defaultAgent = this.chatAgentService.getDefaultAgent(ChatAgentLocation.Chat);
			if (defaultAgent) {
				if (picksSoFar.length || additionalPicks.length) {
					additionalPicks.push({
						type: 'separator'
					});
				}

				additionalPicks.push({
					label: localize('commandsQuickAccess.askInChat', "Ask in Chat: {0}", filter),
					commandId: this.configuration.experimental.askChatLocation === 'quickChat' ? ASK_QUICK_QUESTION_ACTION_ID : CHAT_OPEN_ACTION_ID,
					args: [filter],
					buttons: [{
						iconClass: ThemeIcon.asClassName(Codicon.gear),
						tooltip: localize('commandsQuickAccess.configureAskInChatSetting', "Configure visibility"),
					}],
					trigger: () => {
						void this.preferencesService.openSettings({ jsonEditor: false, query: 'workbench.commandPalette.showAskInChat' });
						return TriggerAction.CLOSE_PICKER;
					},
				});
			}
		}

		return additionalPicks;
	}

	private async getRelatedInformationPicks(allPicks: ICommandQuickPick[], picksSoFar: ICommandQuickPick[], filter: string, token: CancellationToken) {
		const relatedInformation = await this.aiRelatedInformationService.getRelatedInformation(
			filter,
			[RelatedInformationType.CommandInformation],
			token
		) as CommandInformationResult[];

		// Sort by weight descending to get the most relevant results first
		relatedInformation.sort((a, b) => b.weight - a.weight);

		const setOfPicksSoFar = new Set(picksSoFar.map(p => p.commandId));
		const additionalPicks = new Array<ICommandQuickPick | IQuickPickSeparator>();

		for (const info of relatedInformation) {
			if (additionalPicks.length === CommandsQuickAccessProvider.AI_RELATED_INFORMATION_MAX_PICKS) {
				break;
			}
			const pick = allPicks.find(p => p.commandId === info.command && !setOfPicksSoFar.has(p.commandId));
			if (pick) {
				additionalPicks.push(pick);
			}
		}

		return additionalPicks;
	}

	private getGlobalCommandPicks(): ICommandQuickPick[] {
		const globalCommandPicks: ICommandQuickPick[] = [];
		const scopedContextKeyService = this.editorService.activeEditorPane?.scopedContextKeyService || this.editorGroupService.activeGroup.scopedContextKeyService;
		const globalCommandsMenu = this.menuService.getMenuActions(MenuId.CommandPalette, scopedContextKeyService);
		const globalCommandsMenuActions = globalCommandsMenu
			.reduce((r, [, actions]) => [...r, ...actions], <Array<MenuItemAction | SubmenuItemAction | string>>[])
			.filter(action => action instanceof MenuItemAction && action.enabled) as MenuItemAction[];

		for (const action of globalCommandsMenuActions) {

			// Label
			let label = (typeof action.item.title === 'string' ? action.item.title : action.item.title.value) || action.item.id;

			// Category
			const category = typeof action.item.category === 'string' ? action.item.category : action.item.category?.value;
			if (category) {
				label = localize('commandWithCategory', "{0}: {1}", category, label);
			}

			// Alias
			const aliasLabel = typeof action.item.title !== 'string' ? action.item.title.original : undefined;
			const aliasCategory = (category && action.item.category && typeof action.item.category !== 'string') ? action.item.category.original : undefined;
			const commandAlias = (aliasLabel && category) ?
				aliasCategory ? `${aliasCategory}: ${aliasLabel}` : `${category}: ${aliasLabel}` :
				aliasLabel;

			const metadataDescription = action.item.metadata?.description;
			const commandDescription = metadataDescription === undefined || isLocalizedString(metadataDescription)
				? metadataDescription
				// TODO: this type will eventually not be a string and when that happens, this should simplified.
				: { value: metadataDescription, original: metadataDescription };
			globalCommandPicks.push({
				commandId: action.item.id,
				commandWhen: action.item.precondition?.serialize(),
				commandAlias,
				label: stripIcons(label),
				commandDescription,
				commandCategory: category,
			});
		}

		return globalCommandPicks;
	}
}

//#region Actions

export class ShowAllCommandsAction extends Action2 {

	static readonly ID = 'workbench.action.showCommands';

	constructor() {
		super({
			id: ShowAllCommandsAction.ID,
			title: localize2('showTriggerActions', 'Show All Commands'),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: undefined,
				primary: !isFirefox ? (KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyP) : undefined,
				secondary: [KeyCode.F1]
			},
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		accessor.get(IQuickInputService).quickAccess.show(CommandsQuickAccessProvider.PREFIX);
	}
}

export class ClearCommandHistoryAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.clearCommandHistory',
			title: localize2('clearCommandHistory', 'Clear Command History'),
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);
		const storageService = accessor.get(IStorageService);
		const dialogService = accessor.get(IDialogService);

		const commandHistoryLength = CommandsHistory.getConfiguredCommandHistoryLength(configurationService);
		if (commandHistoryLength > 0) {

			// Ask for confirmation
			const { confirmed } = await dialogService.confirm({
				type: 'warning',
				message: localize('confirmClearMessage', "Do you want to clear the history of recently used commands?"),
				detail: localize('confirmClearDetail', "This action is irreversible!"),
				primaryButton: localize({ key: 'clearButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Clear")
			});

			if (!confirmed) {
				return;
			}

			CommandsHistory.clearHistory(configurationService, storageService);
		}
	}
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/quickaccess/browser/quickAccess.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/quickaccess/browser/quickAccess.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { IQuickAccessRegistry, Extensions } from '../../../../platform/quickinput/common/quickAccess.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { HelpQuickAccessProvider } from '../../../../platform/quickinput/browser/helpQuickAccess.js';
import { ViewQuickAccessProvider, OpenViewPickerAction, QuickAccessViewPickerAction } from './viewQuickAccess.js';
import { CommandsQuickAccessProvider, ShowAllCommandsAction, ClearCommandHistoryAction } from './commandsQuickAccess.js';
import { MenuRegistry, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { KeyMod } from '../../../../base/common/keyCodes.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { inQuickPickContext, getQuickNavigateHandler } from '../../../browser/quickaccess.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';

//#region Quick Access Proviers

const quickAccessRegistry = Registry.as<IQuickAccessRegistry>(Extensions.Quickaccess);

quickAccessRegistry.registerQuickAccessProvider({
	ctor: HelpQuickAccessProvider,
	prefix: HelpQuickAccessProvider.PREFIX,
	placeholder: localize('helpQuickAccessPlaceholder', "Type '{0}' to get help on the actions you can take from here.", HelpQuickAccessProvider.PREFIX),
	helpEntries: [{
		description: localize('helpQuickAccess', "Show all Quick Access Providers"),
		commandCenterOrder: 70,
		commandCenterLabel: localize('more', 'More')
	}]
});

quickAccessRegistry.registerQuickAccessProvider({
	ctor: ViewQuickAccessProvider,
	prefix: ViewQuickAccessProvider.PREFIX,
	contextKey: 'inViewsPicker',
	placeholder: localize('viewQuickAccessPlaceholder', "Type the name of a view, output channel or terminal to open."),
	helpEntries: [{ description: localize('viewQuickAccess', "Open View"), commandId: OpenViewPickerAction.ID }]
});

quickAccessRegistry.registerQuickAccessProvider({
	ctor: CommandsQuickAccessProvider,
	prefix: CommandsQuickAccessProvider.PREFIX,
	contextKey: 'inCommandsPicker',
	placeholder: localize('commandsQuickAccessPlaceholder', "Type the name of a command to run."),
	helpEntries: [{ description: localize('commandsQuickAccess', "Show and Run Commands"), commandId: ShowAllCommandsAction.ID, commandCenterOrder: 20 }]
});

//#endregion


//#region Menu contributions

MenuRegistry.appendMenuItem(MenuId.MenubarViewMenu, {
	group: '1_open',
	command: {
		id: ShowAllCommandsAction.ID,
		title: localize({ key: 'miCommandPalette', comment: ['&& denotes a mnemonic'] }, "&&Command Palette...")
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarHelpMenu, {
	group: '1_welcome',
	command: {
		id: ShowAllCommandsAction.ID,
		title: localize({ key: 'miShowAllCommands', comment: ['&& denotes a mnemonic'] }, "Show All Commands")
	},
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.MenubarViewMenu, {
	group: '1_open',
	command: {
		id: OpenViewPickerAction.ID,
		title: localize({ key: 'miOpenView', comment: ['&& denotes a mnemonic'] }, "&&Open View...")
	},
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.MenubarGoMenu, {
	group: '5_infile_nav',
	command: {
		id: 'workbench.action.gotoLine',
		title: localize({ key: 'miGotoLine', comment: ['&& denotes a mnemonic'] }, "Go to &&Line/Column...")
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.GlobalActivity, {
	group: '1_command',
	command: {
		id: ShowAllCommandsAction.ID,
		title: localize('commandPalette', "Command Palette...")
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.EditorContext, {
	group: 'z_commands',
	when: EditorContextKeys.editorSimpleInput.toNegated(),
	command: {
		id: ShowAllCommandsAction.ID,
		title: localize('commandPalette', "Command Palette..."),
	},
	order: 1
});

//#endregion


//#region Workbench actions and commands

registerAction2(ClearCommandHistoryAction);
registerAction2(ShowAllCommandsAction);
registerAction2(OpenViewPickerAction);
registerAction2(QuickAccessViewPickerAction);

const inViewsPickerContextKey = 'inViewsPicker';
const inViewsPickerContext = ContextKeyExpr.and(inQuickPickContext, ContextKeyExpr.has(inViewsPickerContextKey));
const viewPickerKeybinding = QuickAccessViewPickerAction.KEYBINDING;

const quickAccessNavigateNextInViewPickerId = 'workbench.action.quickOpenNavigateNextInViewPicker';
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: quickAccessNavigateNextInViewPickerId,
	weight: KeybindingWeight.WorkbenchContrib + 50,
	handler: getQuickNavigateHandler(quickAccessNavigateNextInViewPickerId, true),
	when: inViewsPickerContext,
	primary: viewPickerKeybinding.primary,
	linux: viewPickerKeybinding.linux,
	mac: viewPickerKeybinding.mac
});

const quickAccessNavigatePreviousInViewPickerId = 'workbench.action.quickOpenNavigatePreviousInViewPicker';
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: quickAccessNavigatePreviousInViewPickerId,
	weight: KeybindingWeight.WorkbenchContrib + 50,
	handler: getQuickNavigateHandler(quickAccessNavigatePreviousInViewPickerId, false),
	when: inViewsPickerContext,
	primary: viewPickerKeybinding.primary | KeyMod.Shift,
	linux: viewPickerKeybinding.linux,
	mac: {
		primary: viewPickerKeybinding.mac.primary | KeyMod.Shift
	}
});

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/quickaccess/browser/viewQuickAccess.ts]---
Location: vscode-main/src/vs/workbench/contrib/quickaccess/browser/viewQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { IQuickPickSeparator, IQuickInputService, ItemActivation } from '../../../../platform/quickinput/common/quickInput.js';
import { IPickerQuickAccessItem, PickerQuickAccessProvider } from '../../../../platform/quickinput/browser/pickerQuickAccess.js';
import { IViewDescriptorService, ViewContainer, ViewContainerLocation } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { IOutputService } from '../../../services/output/common/output.js';
import { ITerminalGroupService, ITerminalService } from '../../terminal/browser/terminal.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { PaneCompositeDescriptor } from '../../../browser/panecomposite.js';
import { matchesFuzzy } from '../../../../base/common/filters.js';
import { fuzzyContains } from '../../../../base/common/strings.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { Action2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeyMod, KeyCode } from '../../../../base/common/keyCodes.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { IDebugService, REPL_VIEW_ID } from '../../debug/common/debug.js';

interface IViewQuickPickItem extends IPickerQuickAccessItem {
	containerLabel: string;
}

export class ViewQuickAccessProvider extends PickerQuickAccessProvider<IViewQuickPickItem> {

	static PREFIX = 'view ';

	constructor(
		@IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService,
		@IViewsService private readonly viewsService: IViewsService,
		@IOutputService private readonly outputService: IOutputService,
		@ITerminalService private readonly terminalService: ITerminalService,
		@ITerminalGroupService private readonly terminalGroupService: ITerminalGroupService,
		@IDebugService private readonly debugService: IDebugService,
		@IPaneCompositePartService private readonly paneCompositeService: IPaneCompositePartService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService
	) {
		super(ViewQuickAccessProvider.PREFIX, {
			noResultsPick: {
				label: localize('noViewResults', "No matching views"),
				containerLabel: ''
			}
		});
	}

	protected _getPicks(filter: string): Array<IViewQuickPickItem | IQuickPickSeparator> {
		const filteredViewEntries = this.doGetViewPickItems().filter(entry => {
			if (!filter) {
				return true;
			}

			// Match fuzzy on label
			entry.highlights = { label: matchesFuzzy(filter, entry.label, true) ?? undefined };

			// Return if we have a match on label or container
			return entry.highlights.label || fuzzyContains(entry.containerLabel, filter);
		});

		// Map entries to container labels
		const mapEntryToContainer = new Map<string, string>();
		for (const entry of filteredViewEntries) {
			if (!mapEntryToContainer.has(entry.label)) {
				mapEntryToContainer.set(entry.label, entry.containerLabel);
			}
		}

		// Add separators for containers
		const filteredViewEntriesWithSeparators: Array<IViewQuickPickItem | IQuickPickSeparator> = [];
		let lastContainer: string | undefined = undefined;
		for (const entry of filteredViewEntries) {
			if (lastContainer !== entry.containerLabel) {
				lastContainer = entry.containerLabel;

				// When the entry container has a parent container, set container
				// label as Parent / Child. For example, `Views / Explorer`.
				let separatorLabel: string;
				if (mapEntryToContainer.has(lastContainer)) {
					separatorLabel = `${mapEntryToContainer.get(lastContainer)} / ${lastContainer}`;
				} else {
					separatorLabel = lastContainer;
				}

				filteredViewEntriesWithSeparators.push({ type: 'separator', label: separatorLabel });

			}

			filteredViewEntriesWithSeparators.push(entry);
		}

		return filteredViewEntriesWithSeparators;
	}

	private doGetViewPickItems(): Array<IViewQuickPickItem> {
		const viewEntries: Array<IViewQuickPickItem> = [];

		const getViewEntriesForPaneComposite = (paneComposite: PaneCompositeDescriptor, viewContainer: ViewContainer): IViewQuickPickItem[] => {
			const viewContainerModel = this.viewDescriptorService.getViewContainerModel(viewContainer);
			const result: IViewQuickPickItem[] = [];
			for (const view of viewContainerModel.allViewDescriptors) {
				if (this.contextKeyService.contextMatchesRules(view.when)) {
					result.push({
						label: view.name.value,
						containerLabel: viewContainerModel.title,
						accept: () => this.viewsService.openView(view.id, true)
					});
				}
			}

			return result;
		};

		const addPaneComposites = (location: ViewContainerLocation, containerLabel: string) => {
			const paneComposites = this.paneCompositeService.getPaneComposites(location);
			const visiblePaneCompositeIds = this.paneCompositeService.getVisiblePaneCompositeIds(location);

			paneComposites.sort((a, b) => {
				let aIndex = visiblePaneCompositeIds.findIndex(id => a.id === id);
				let bIndex = visiblePaneCompositeIds.findIndex(id => b.id === id);

				if (aIndex < 0) {
					aIndex = paneComposites.indexOf(a) + visiblePaneCompositeIds.length;
				}

				if (bIndex < 0) {
					bIndex = paneComposites.indexOf(b) + visiblePaneCompositeIds.length;
				}

				return aIndex - bIndex;
			});

			for (const paneComposite of paneComposites) {
				if (this.includeViewContainer(paneComposite)) {
					const viewContainer = this.viewDescriptorService.getViewContainerById(paneComposite.id);
					if (viewContainer) {
						viewEntries.push({
							label: this.viewDescriptorService.getViewContainerModel(viewContainer).title,
							containerLabel,
							accept: () => this.paneCompositeService.openPaneComposite(paneComposite.id, location, true)
						});
					}
				}
			}
		};

		// Viewlets / Panels
		addPaneComposites(ViewContainerLocation.Sidebar, localize('views', "Side Bar"));
		addPaneComposites(ViewContainerLocation.Panel, localize('panels', "Panel"));
		addPaneComposites(ViewContainerLocation.AuxiliaryBar, localize('secondary side bar', "Secondary Side Bar"));

		const addPaneCompositeViews = (location: ViewContainerLocation) => {
			const paneComposites = this.paneCompositeService.getPaneComposites(location);
			for (const paneComposite of paneComposites) {
				const viewContainer = this.viewDescriptorService.getViewContainerById(paneComposite.id);
				if (viewContainer) {
					viewEntries.push(...getViewEntriesForPaneComposite(paneComposite, viewContainer));
				}
			}
		};

		// Side Bar / Panel Views
		addPaneCompositeViews(ViewContainerLocation.Sidebar);
		addPaneCompositeViews(ViewContainerLocation.Panel);
		addPaneCompositeViews(ViewContainerLocation.AuxiliaryBar);

		// Terminals
		this.terminalGroupService.groups.forEach((group, groupIndex) => {
			group.terminalInstances.forEach((terminal, terminalIndex) => {
				const label = localize('terminalTitle', "{0}: {1}", `${groupIndex + 1}.${terminalIndex + 1}`, terminal.title);
				viewEntries.push({
					label,
					containerLabel: localize('terminals', "Terminal"),
					accept: async () => {
						await this.terminalGroupService.showPanel(true);
						this.terminalService.setActiveInstance(terminal);
					}
				});
			});
		});

		// Debug Consoles
		this.debugService.getModel().getSessions(true).filter(s => s.hasSeparateRepl()).forEach((session, _) => {
			const label = session.name;
			viewEntries.push({
				label,
				containerLabel: localize('debugConsoles', "Debug Console"),
				accept: async () => {
					await this.debugService.focusStackFrame(undefined, undefined, session, { explicit: true });

					if (!this.viewsService.isViewVisible(REPL_VIEW_ID)) {
						await this.viewsService.openView(REPL_VIEW_ID, true);
					}
				}
			});

		});

		// Output Channels
		const channels = this.outputService.getChannelDescriptors();
		for (const channel of channels) {
			viewEntries.push({
				label: channel.label,
				containerLabel: localize('channels', "Output"),
				accept: () => this.outputService.showChannel(channel.id)
			});
		}

		return viewEntries;
	}

	private includeViewContainer(container: PaneCompositeDescriptor): boolean {
		const viewContainer = this.viewDescriptorService.getViewContainerById(container.id);
		if (viewContainer?.hideIfEmpty) {
			return this.viewDescriptorService.getViewContainerModel(viewContainer).activeViewDescriptors.length > 0;
		}

		return true;
	}
}


//#region Actions

export class OpenViewPickerAction extends Action2 {

	static readonly ID = 'workbench.action.openView';

	constructor() {
		super({
			id: OpenViewPickerAction.ID,
			title: localize2('openView', 'Open View'),
			category: Categories.View,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		accessor.get(IQuickInputService).quickAccess.show(ViewQuickAccessProvider.PREFIX);
	}
}

export class QuickAccessViewPickerAction extends Action2 {

	static readonly ID = 'workbench.action.quickOpenView';
	static readonly KEYBINDING = {
		primary: KeyMod.CtrlCmd | KeyCode.KeyQ,
		mac: { primary: KeyMod.WinCtrl | KeyCode.KeyQ },
		linux: { primary: 0 }
	};

	constructor() {
		super({
			id: QuickAccessViewPickerAction.ID,
			title: localize2('quickOpenView', 'Quick Open View'),
			category: Categories.View,
			f1: false, // hide quick pickers from command palette to not confuse with the other entry that shows a input field
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: undefined,
				...QuickAccessViewPickerAction.KEYBINDING
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const keybindingService = accessor.get(IKeybindingService);
		const quickInputService = accessor.get(IQuickInputService);

		const keys = keybindingService.lookupKeybindings(QuickAccessViewPickerAction.ID);

		quickInputService.quickAccess.show(ViewQuickAccessProvider.PREFIX, { quickNavigateConfiguration: { keybindings: keys }, itemActivation: ItemActivation.FIRST });
	}
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/relauncher/browser/relauncher.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/relauncher/browser/relauncher.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../../base/common/async.js';
import { Disposable, dispose, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { isLinux, isMacintosh, isNative } from '../../../../base/common/platform.js';
import { isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { ConfigurationTarget, IConfigurationChangeEvent, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IUserDataSyncEnablementService, IUserDataSyncService, SyncStatus } from '../../../../platform/userDataSync/common/userDataSync.js';
import { IWindowsConfiguration, IWindowSettings, MenuSettings, MenuStyleConfiguration, TitleBarSetting, TitlebarStyle } from '../../../../platform/window/common/window.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IUserDataSyncWorkbenchService } from '../../../services/userDataSync/common/userDataSync.js';

interface IConfiguration extends IWindowsConfiguration {
	update?: { mode?: string };
	debug?: { console?: { wordWrap?: boolean } };
	editor?: { accessibilitySupport?: 'on' | 'off' | 'auto' };
	security?: { workspace?: { trust?: { enabled?: boolean } }; restrictUNCAccess?: boolean };
	window: IWindowSettings;
	workbench?: { enableExperiments?: boolean };
	telemetry?: { feedback?: { enabled?: boolean } };
	chat?: { extensionUnification?: { enabled?: boolean } };
	_extensionsGallery?: { enablePPE?: boolean };
	accessibility?: { verbosity?: { debug?: boolean } };
}

export class SettingsChangeRelauncher extends Disposable implements IWorkbenchContribution {

	private static SETTINGS = [
		TitleBarSetting.TITLE_BAR_STYLE,
		MenuSettings.MenuStyle,
		'window.nativeTabs',
		'window.nativeFullScreen',
		'window.clickThroughInactive',
		'window.controlsStyle',
		'update.mode',
		'editor.accessibilitySupport',
		'security.workspace.trust.enabled',
		'workbench.enableExperiments',
		'_extensionsGallery.enablePPE',
		'security.restrictUNCAccess',
		'accessibility.verbosity.debug',
		'telemetry.feedback.enabled',
		'chat.extensionUnification.enabled'
	];

	private readonly titleBarStyle = new ChangeObserver<TitlebarStyle>('string');
	private readonly menuStyle = new ChangeObserver<MenuStyleConfiguration>('string');
	private readonly nativeTabs = new ChangeObserver('boolean');
	private readonly nativeFullScreen = new ChangeObserver('boolean');
	private readonly clickThroughInactive = new ChangeObserver('boolean');
	private readonly controlsStyle = new ChangeObserver('string');
	private readonly updateMode = new ChangeObserver('string');
	private accessibilitySupport: 'on' | 'off' | 'auto' | undefined;
	private readonly workspaceTrustEnabled = new ChangeObserver('boolean');
	private readonly experimentsEnabled = new ChangeObserver('boolean');
	private readonly enablePPEExtensionsGallery = new ChangeObserver('boolean');
	private readonly restrictUNCAccess = new ChangeObserver('boolean');
	private readonly accessibilityVerbosityDebug = new ChangeObserver('boolean');
	private readonly telemetryFeedbackEnabled = new ChangeObserver('boolean');
	private readonly extensionUnificationEnabled = new ChangeObserver('boolean');

	constructor(
		@IHostService private readonly hostService: IHostService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IUserDataSyncService private readonly userDataSyncService: IUserDataSyncService,
		@IUserDataSyncEnablementService private readonly userDataSyncEnablementService: IUserDataSyncEnablementService,
		@IUserDataSyncWorkbenchService userDataSyncWorkbenchService: IUserDataSyncWorkbenchService,
		@IProductService private readonly productService: IProductService,
		@IDialogService private readonly dialogService: IDialogService
	) {
		super();

		this.update(false);
		this._register(this.configurationService.onDidChangeConfiguration(e => this.onConfigurationChange(e)));
		this._register(userDataSyncWorkbenchService.onDidTurnOnSync(e => this.update(true)));
	}

	private onConfigurationChange(e: IConfigurationChangeEvent): void {
		if (e && !SettingsChangeRelauncher.SETTINGS.some(key => e.affectsConfiguration(key))) {
			return;
		}

		// Skip if turning on sync is in progress
		if (this.isTurningOnSyncInProgress()) {
			return;
		}

		this.update(e.source !== ConfigurationTarget.DEFAULT /* do not ask to relaunch if defaults changed */);
	}

	private isTurningOnSyncInProgress(): boolean {
		return !this.userDataSyncEnablementService.isEnabled() && this.userDataSyncService.status === SyncStatus.Syncing;
	}

	private update(askToRelaunch: boolean): void {
		let changed = false;

		function processChanged(didChange: boolean) {
			changed = changed || didChange;
		}

		const config = this.configurationService.getValue<IConfiguration>();
		if (isNative) {

			// Titlebar style
			processChanged((config.window.titleBarStyle === TitlebarStyle.NATIVE || config.window.titleBarStyle === TitlebarStyle.CUSTOM) && this.titleBarStyle.handleChange(config.window?.titleBarStyle));

			// Windows/Linux: Menu style
			processChanged(!isMacintosh && this.menuStyle.handleChange(config.window?.menuStyle));

			// macOS: Native tabs
			processChanged(isMacintosh && this.nativeTabs.handleChange(config.window?.nativeTabs));

			// macOS: Native fullscreen
			processChanged(isMacintosh && this.nativeFullScreen.handleChange(config.window?.nativeFullScreen));

			// macOS: Click through (accept first mouse)
			processChanged(isMacintosh && this.clickThroughInactive.handleChange(config.window?.clickThroughInactive));

			// Windows/Linux: Window controls style
			processChanged(!isMacintosh && this.controlsStyle.handleChange(config.window?.controlsStyle));

			// Update mode
			processChanged(this.updateMode.handleChange(config.update?.mode));

			// On linux turning on accessibility support will also pass this flag to the chrome renderer, thus a restart is required
			if (isLinux && typeof config.editor?.accessibilitySupport === 'string' && config.editor.accessibilitySupport !== this.accessibilitySupport) {
				this.accessibilitySupport = config.editor.accessibilitySupport;
				if (this.accessibilitySupport === 'on') {
					changed = true;
				}
			}

			// Workspace trust
			processChanged(this.workspaceTrustEnabled.handleChange(config?.security?.workspace?.trust?.enabled));

			// UNC host access restrictions
			processChanged(this.restrictUNCAccess.handleChange(config?.security?.restrictUNCAccess));

			// Debug accessibility verbosity
			processChanged(this.accessibilityVerbosityDebug.handleChange(config?.accessibility?.verbosity?.debug));
		}

		// Experiments
		processChanged(this.experimentsEnabled.handleChange(config.workbench?.enableExperiments));

		// Profiles
		processChanged(this.productService.quality !== 'stable' && this.enablePPEExtensionsGallery.handleChange(config._extensionsGallery?.enablePPE));

		// Enable Feedback
		processChanged(this.telemetryFeedbackEnabled.handleChange(config.telemetry?.feedback?.enabled));

		// Extension Unification (only when turning on)
		processChanged(this.extensionUnificationEnabled.handleChange(config.chat?.extensionUnification?.enabled) && config.chat?.extensionUnification?.enabled === true);

		if (askToRelaunch && changed && this.hostService.hasFocus) {
			this.doConfirm(
				isNative ?
					localize('relaunchSettingMessage', "A setting has changed that requires a restart to take effect.") :
					localize('relaunchSettingMessageWeb', "A setting has changed that requires a reload to take effect."),
				isNative ?
					localize('relaunchSettingDetail', "Press the restart button to restart {0} and enable the setting.", this.productService.nameLong) :
					localize('relaunchSettingDetailWeb', "Press the reload button to reload {0} and enable the setting.", this.productService.nameLong),
				isNative ?
					localize({ key: 'restart', comment: ['&& denotes a mnemonic'] }, "&&Restart") :
					localize({ key: 'restartWeb', comment: ['&& denotes a mnemonic'] }, "&&Reload"),
				() => this.hostService.restart()
			);
		}
	}

	private async doConfirm(message: string, detail: string, primaryButton: string, confirmedFn: () => void): Promise<void> {
		const { confirmed } = await this.dialogService.confirm({ message, detail, primaryButton });
		if (confirmed) {
			confirmedFn();
		}
	}
}

interface TypeNameToType {
	readonly boolean: boolean;
	readonly string: string;
}

class ChangeObserver<T> {

	static create<TTypeName extends 'boolean' | 'string'>(typeName: TTypeName): ChangeObserver<TypeNameToType[TTypeName]> {
		return new ChangeObserver(typeName);
	}

	constructor(private readonly typeName: string) { }

	private lastValue: T | undefined = undefined;

	/**
	 * Returns if there was a change compared to the last value
	 */
	handleChange(value: T | undefined): boolean {
		if (typeof value === this.typeName && value !== this.lastValue) {
			this.lastValue = value;
			return true;
		}

		return false;
	}
}

export class WorkspaceChangeExtHostRelauncher extends Disposable implements IWorkbenchContribution {

	private firstFolderResource?: URI;
	private extensionHostRestarter: RunOnceScheduler;

	private onDidChangeWorkspaceFoldersUnbind: IDisposable | undefined;

	constructor(
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IExtensionService extensionService: IExtensionService,
		@IHostService hostService: IHostService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService
	) {
		super();

		this.extensionHostRestarter = this._register(new RunOnceScheduler(async () => {
			if (!!environmentService.extensionTestsLocationURI) {
				return; // no restart when in tests: see https://github.com/microsoft/vscode/issues/66936
			}

			if (environmentService.remoteAuthority) {
				hostService.reload(); // TODO@aeschli, workaround
			} else if (isNative) {
				const stopped = await extensionService.stopExtensionHosts(localize('restartExtensionHost.reason', "Changing workspace folders"));
				if (stopped) {
					extensionService.startExtensionHosts();
				}
			}
		}, 10));

		this.contextService.getCompleteWorkspace()
			.then(workspace => {
				this.firstFolderResource = workspace.folders.length > 0 ? workspace.folders[0].uri : undefined;
				this.handleWorkbenchState();
				this._register(this.contextService.onDidChangeWorkbenchState(() => setTimeout(() => this.handleWorkbenchState())));
			});

		this._register(toDisposable(() => {
			this.onDidChangeWorkspaceFoldersUnbind?.dispose();
		}));
	}

	private handleWorkbenchState(): void {

		// React to folder changes when we are in workspace state
		if (this.contextService.getWorkbenchState() === WorkbenchState.WORKSPACE) {

			// Update our known first folder path if we entered workspace
			const workspace = this.contextService.getWorkspace();
			this.firstFolderResource = workspace.folders.length > 0 ? workspace.folders[0].uri : undefined;

			// Install workspace folder listener
			if (!this.onDidChangeWorkspaceFoldersUnbind) {
				this.onDidChangeWorkspaceFoldersUnbind = this.contextService.onDidChangeWorkspaceFolders(() => this.onDidChangeWorkspaceFolders());
			}
		}

		// Ignore the workspace folder changes in EMPTY or FOLDER state
		else {
			dispose(this.onDidChangeWorkspaceFoldersUnbind);
			this.onDidChangeWorkspaceFoldersUnbind = undefined;
		}
	}

	private onDidChangeWorkspaceFolders(): void {
		const workspace = this.contextService.getWorkspace();

		// Restart extension host if first root folder changed (impact on deprecated workspace.rootPath API)
		const newFirstFolderResource = workspace.folders.length > 0 ? workspace.folders[0].uri : undefined;
		if (!isEqual(this.firstFolderResource, newFirstFolderResource)) {
			this.firstFolderResource = newFirstFolderResource;

			this.extensionHostRestarter.schedule(); // buffer calls to extension host restart
		}
	}
}

const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchRegistry.registerWorkbenchContribution(SettingsChangeRelauncher, LifecyclePhase.Restored);
workbenchRegistry.registerWorkbenchContribution(WorkspaceChangeExtHostRelauncher, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/remote/browser/explorerViewItems.ts]---
Location: vscode-main/src/vs/workbench/contrib/remote/browser/explorerViewItems.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { IRemoteExplorerService, REMOTE_EXPLORER_TYPE_KEY } from '../../../services/remote/common/remoteExplorerService.js';
import { ISelectOptionItem } from '../../../../base/browser/ui/selectBox/selectBox.js';
import { IViewDescriptor } from '../../../common/views.js';
import { isStringArray } from '../../../../base/common/types.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IStorageService, StorageScope } from '../../../../platform/storage/common/storage.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { Action2, MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { VIEWLET_ID } from './remoteExplorer.js';
import { getVirtualWorkspaceLocation } from '../../../../platform/workspace/common/virtualWorkspace.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { Disposable, DisposableMap } from '../../../../base/common/lifecycle.js';

interface IRemoteSelectItem extends ISelectOptionItem {
	authority: string[];
	virtualWorkspace?: string;
	dispose(): void;
}

export const SELECTED_REMOTE_IN_EXPLORER = new RawContextKey<string>('selectedRemoteInExplorer', '');

export class SwitchRemoteViewItem extends Disposable {
	private switchRemoteMenu: MenuId;
	private completedRemotes: DisposableMap<string, IRemoteSelectItem> = this._register(new DisposableMap());
	private readonly selectedRemoteContext: IContextKey<string>;

	constructor(
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IRemoteExplorerService private remoteExplorerService: IRemoteExplorerService,
		@IWorkbenchEnvironmentService private environmentService: IWorkbenchEnvironmentService,
		@IStorageService private readonly storageService: IStorageService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService
	) {
		super();
		this.selectedRemoteContext = SELECTED_REMOTE_IN_EXPLORER.bindTo(contextKeyService);

		this.switchRemoteMenu = MenuId.for('workbench.remote.menu.switchRemoteMenu');
		this._register(MenuRegistry.appendMenuItem(MenuId.ViewContainerTitle, {
			submenu: this.switchRemoteMenu,
			title: nls.localize('switchRemote.label', "Switch Remote"),
			group: 'navigation',
			when: ContextKeyExpr.equals('viewContainer', VIEWLET_ID),
			order: 1,
			isSelection: true
		}));
		this._register(remoteExplorerService.onDidChangeTargetType(e => {
			this.select(e);
		}));
	}

	public setSelectionForConnection(): boolean {
		let isSetForConnection = false;
		if (this.completedRemotes.size > 0) {
			let authority: string[] | undefined;
			const remoteAuthority = this.environmentService.remoteAuthority;
			let virtualWorkspace: string | undefined;
			if (!remoteAuthority) {
				virtualWorkspace = getVirtualWorkspaceLocation(this.workspaceContextService.getWorkspace())?.scheme;
			}
			isSetForConnection = true;
			const explorerType: string[] | undefined = remoteAuthority ? [remoteAuthority.split('+')[0]]
				: (virtualWorkspace ? [virtualWorkspace]
					: (this.storageService.get(REMOTE_EXPLORER_TYPE_KEY, StorageScope.WORKSPACE)?.split(',') ?? this.storageService.get(REMOTE_EXPLORER_TYPE_KEY, StorageScope.PROFILE)?.split(',')));
			if (explorerType !== undefined) {
				authority = this.getAuthorityForExplorerType(explorerType);
			}
			if (authority) {
				this.select(authority);
			}
		}
		return isSetForConnection;
	}

	private select(authority: string[]) {
		this.selectedRemoteContext.set(authority[0]);
		this.remoteExplorerService.targetType = authority;
	}

	private getAuthorityForExplorerType(explorerType: string[]): string[] | undefined {
		let authority: string[] | undefined;
		for (const option of this.completedRemotes) {
			for (const authorityOption of option[1].authority) {
				for (const explorerOption of explorerType) {
					if (authorityOption === explorerOption) {
						authority = option[1].authority;
						break;
					} else if (option[1].virtualWorkspace === explorerOption) {
						authority = option[1].authority;
						break;
					}
				}
			}
		}
		return authority;
	}

	public removeOptionItems(views: IViewDescriptor[]) {
		for (const view of views) {
			if (view.group && view.group.startsWith('targets') && view.remoteAuthority && (!view.when || this.contextKeyService.contextMatchesRules(view.when))) {
				const authority = isStringArray(view.remoteAuthority) ? view.remoteAuthority : [view.remoteAuthority];
				this.completedRemotes.deleteAndDispose(authority[0]);
			}
		}
	}

	public createOptionItems(views: IViewDescriptor[]) {
		const startingCount = this.completedRemotes.size;
		for (const view of views) {
			if (view.group && view.group.startsWith('targets') && view.remoteAuthority && (!view.when || this.contextKeyService.contextMatchesRules(view.when))) {
				const text = view.name;
				const authority = isStringArray(view.remoteAuthority) ? view.remoteAuthority : [view.remoteAuthority];
				if (this.completedRemotes.has(authority[0])) {
					continue;
				}
				const thisCapture = this;
				const action = registerAction2(class extends Action2 {
					constructor() {
						super({
							id: `workbench.action.remoteExplorer.show.${authority[0]}`,
							title: text,
							toggled: SELECTED_REMOTE_IN_EXPLORER.isEqualTo(authority[0]),
							menu: {
								id: thisCapture.switchRemoteMenu
							}
						});
					}
					async run(): Promise<void> {
						thisCapture.select(authority);
					}
				});
				this.completedRemotes.set(authority[0], { text: text.value, authority, virtualWorkspace: view.virtualWorkspace, dispose: () => action.dispose() });
			}
		}
		if (this.completedRemotes.size > startingCount) {
			this.setSelectionForConnection();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/remote/browser/remote.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/remote/browser/remote.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContributionsRegistry, WorkbenchPhase, Extensions as WorkbenchExtensions, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ShowCandidateContribution } from './showCandidate.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { TunnelFactoryContribution } from './tunnelFactory.js';
import { RemoteAgentConnectionStatusListener, RemoteMarkers } from './remote.js';
import { RemoteStatusIndicator } from './remoteIndicator.js';
import { AutomaticPortForwarding, ForwardedPortsView, PortRestore } from './remoteExplorer.js';
import { InitialRemoteConnectionHealthContribution } from './remoteConnectionHealth.js';

const workbenchContributionsRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
registerWorkbenchContribution2(ShowCandidateContribution.ID, ShowCandidateContribution, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(TunnelFactoryContribution.ID, TunnelFactoryContribution, WorkbenchPhase.BlockRestore);
workbenchContributionsRegistry.registerWorkbenchContribution(RemoteAgentConnectionStatusListener, LifecyclePhase.Eventually);
registerWorkbenchContribution2(RemoteStatusIndicator.ID, RemoteStatusIndicator, WorkbenchPhase.BlockStartup);
workbenchContributionsRegistry.registerWorkbenchContribution(ForwardedPortsView, LifecyclePhase.Restored);
workbenchContributionsRegistry.registerWorkbenchContribution(PortRestore, LifecyclePhase.Eventually);
workbenchContributionsRegistry.registerWorkbenchContribution(AutomaticPortForwarding, LifecyclePhase.Eventually);
workbenchContributionsRegistry.registerWorkbenchContribution(RemoteMarkers, LifecyclePhase.Eventually);
workbenchContributionsRegistry.registerWorkbenchContribution(InitialRemoteConnectionHealthContribution, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/remote/browser/remote.ts]---
Location: vscode-main/src/vs/workbench/contrib/remote/browser/remote.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/remoteViewlet.css';
import * as nls from '../../../../nls.js';
import * as dom from '../../../../base/browser/dom.js';
import { URI } from '../../../../base/common/uri.js';
import { IWorkbenchLayoutService } from '../../../services/layout/browser/layoutService.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IExtensionService, isProposedApiEnabled } from '../../../services/extensions/common/extensions.js';
import { FilterViewPaneContainer } from '../../../browser/parts/views/viewsViewlet.js';
import { VIEWLET_ID } from './remoteExplorer.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IViewDescriptor, IViewsRegistry, Extensions, ViewContainerLocation, IViewContainersRegistry, IViewDescriptorService } from '../../../common/views.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IProgress, IProgressStep, IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ReconnectionWaitEvent, PersistentConnectionEventType } from '../../../../platform/remote/common/remoteAgentConnection.js';
import Severity from '../../../../base/common/severity.js';
import { ReloadWindowAction } from '../../../browser/actions/windowActions.js';
import { Disposable, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { SwitchRemoteViewItem } from './explorerViewItems.js';
import { isStringArray } from '../../../../base/common/types.js';
import { HelpInformation, IRemoteExplorerService } from '../../../services/remote/common/remoteExplorerService.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { ViewPane, IViewPaneOptions } from '../../../browser/parts/views/viewPane.js';
import { IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { ITreeRenderer, ITreeNode, IAsyncDataSource } from '../../../../base/browser/ui/tree/tree.js';
import { WorkbenchAsyncDataTree } from '../../../../platform/list/browser/listService.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { IExtensionPointUser } from '../../../services/extensions/common/extensionsRegistry.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import * as icons from './remoteIcons.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { ITimerService } from '../../../services/timer/browser/timerService.js';
import { getRemoteName } from '../../../../platform/remote/common/remoteHosts.js';
import { getVirtualWorkspaceLocation } from '../../../../platform/workspace/common/virtualWorkspace.js';
import { IWalkthroughsService } from '../../welcomeGettingStarted/browser/gettingStartedService.js';
import { Schemas } from '../../../../base/common/network.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';

interface IViewModel {
	readonly onDidChangeHelpInformation: Event<void>;
	helpInformation: HelpInformation[];
}

class HelpTreeVirtualDelegate implements IListVirtualDelegate<IHelpItem> {
	getHeight(element: IHelpItem): number {
		return 22;
	}

	getTemplateId(element: IHelpItem): string {
		return 'HelpItemTemplate';
	}
}

interface IHelpItemTemplateData {
	parent: HTMLElement;
	icon: HTMLElement;
}

class HelpTreeRenderer implements ITreeRenderer<HelpModel | IHelpItem, IHelpItem, IHelpItemTemplateData> {
	templateId: string = 'HelpItemTemplate';

	renderTemplate(container: HTMLElement): IHelpItemTemplateData {
		container.classList.add('remote-help-tree-node-item');
		const icon = dom.append(container, dom.$('.remote-help-tree-node-item-icon'));
		const parent = container;
		return { parent, icon };
	}

	renderElement(element: ITreeNode<IHelpItem, IHelpItem>, index: number, templateData: IHelpItemTemplateData): void {
		const container = templateData.parent;
		dom.append(container, templateData.icon);
		templateData.icon.classList.add(...element.element.iconClasses);
		const labelContainer = dom.append(container, dom.$('.help-item-label'));
		labelContainer.innerText = element.element.label;
	}

	disposeTemplate(templateData: IHelpItemTemplateData): void {

	}
}

class HelpDataSource implements IAsyncDataSource<HelpModel, IHelpItem> {
	hasChildren(element: HelpModel) {
		return element instanceof HelpModel;
	}

	getChildren(element: HelpModel) {
		if (element instanceof HelpModel && element.items) {
			return element.items;
		}

		return [];
	}
}
interface IHelpItem {
	icon: ThemeIcon;
	iconClasses: string[];
	label: string;
	values: HelpItemValue[];
	handleClick(): Promise<void>;
}

class HelpModel extends Disposable {
	items: IHelpItem[] | undefined;

	constructor(
		private viewModel: IViewModel,
		private openerService: IOpenerService,
		private quickInputService: IQuickInputService,
		private commandService: ICommandService,
		private remoteExplorerService: IRemoteExplorerService,
		private environmentService: IWorkbenchEnvironmentService,
		private workspaceContextService: IWorkspaceContextService,
		private walkthroughsService: IWalkthroughsService
	) {
		super();

		this.updateItems();
		this._register(viewModel.onDidChangeHelpInformation(() => this.updateItems()));
	}

	private createHelpItemValue(info: HelpInformation, infoKey: Exclude<keyof HelpInformation, 'extensionDescription' | 'remoteName' | 'virtualWorkspace'>) {
		return new HelpItemValue(this.commandService,
			this.walkthroughsService,
			info.extensionDescription,
			(typeof info.remoteName === 'string') ? [info.remoteName] : info.remoteName,
			info.virtualWorkspace,
			info[infoKey]);
	}

	private updateItems() {
		const helpItems: IHelpItem[] = [];

		const getStarted = this.viewModel.helpInformation.filter(info => info.getStarted);
		if (getStarted.length) {
			const helpItemValues = getStarted.map((info: HelpInformation) => this.createHelpItemValue(info, 'getStarted'));
			const getStartedHelpItem = this.items?.find(item => item.icon === icons.getStartedIcon) ?? new GetStartedHelpItem(
				icons.getStartedIcon,
				nls.localize('remote.help.getStarted', "Get Started"),
				helpItemValues,
				this.quickInputService,
				this.environmentService,
				this.openerService,
				this.remoteExplorerService,
				this.workspaceContextService,
				this.commandService
			);
			getStartedHelpItem.values = helpItemValues;
			helpItems.push(getStartedHelpItem);
		}

		const documentation = this.viewModel.helpInformation.filter(info => info.documentation);
		if (documentation.length) {
			const helpItemValues = documentation.map((info: HelpInformation) => this.createHelpItemValue(info, 'documentation'));
			const documentationHelpItem = this.items?.find(item => item.icon === icons.documentationIcon) ?? new HelpItem(
				icons.documentationIcon,
				nls.localize('remote.help.documentation', "Read Documentation"),
				helpItemValues,
				this.quickInputService,
				this.environmentService,
				this.openerService,
				this.remoteExplorerService,
				this.workspaceContextService
			);
			documentationHelpItem.values = helpItemValues;
			helpItems.push(documentationHelpItem);
		}

		const issues = this.viewModel.helpInformation.filter(info => info.issues);
		if (issues.length) {
			const helpItemValues = issues.map((info: HelpInformation) => this.createHelpItemValue(info, 'issues'));
			const reviewIssuesHelpItem = this.items?.find(item => item.icon === icons.reviewIssuesIcon) ?? new HelpItem(
				icons.reviewIssuesIcon,
				nls.localize('remote.help.issues', "Review Issues"),
				helpItemValues,
				this.quickInputService,
				this.environmentService,
				this.openerService,
				this.remoteExplorerService,
				this.workspaceContextService
			);
			reviewIssuesHelpItem.values = helpItemValues;
			helpItems.push(reviewIssuesHelpItem);
		}

		if (helpItems.length) {
			const helpItemValues = this.viewModel.helpInformation.map(info => this.createHelpItemValue(info, 'reportIssue'));
			const issueReporterItem = this.items?.find(item => item.icon === icons.reportIssuesIcon) ?? new IssueReporterItem(
				icons.reportIssuesIcon,
				nls.localize('remote.help.report', "Report Issue"),
				helpItemValues,
				this.quickInputService,
				this.environmentService,
				this.commandService,
				this.openerService,
				this.remoteExplorerService,
				this.workspaceContextService
			);
			issueReporterItem.values = helpItemValues;
			helpItems.push(issueReporterItem);
		}

		if (helpItems.length) {
			this.items = helpItems;
		}
	}
}

class HelpItemValue {
	private _url: string | undefined;
	private _description: string | undefined;

	constructor(private commandService: ICommandService, private walkthroughService: IWalkthroughsService, public extensionDescription: IExtensionDescription, public readonly remoteAuthority: string[] | undefined, public readonly virtualWorkspace: string | undefined, private urlOrCommandOrId?: string | { id: string }) {
	}

	get description(): Promise<string | undefined> {
		return this.getUrl().then(() => this._description);
	}

	get url(): Promise<string> {
		return this.getUrl();
	}

	private async getUrl(): Promise<string> {
		if (this._url === undefined) {
			if (typeof this.urlOrCommandOrId === 'string') {
				const url = URI.parse(this.urlOrCommandOrId);
				if (url.authority) {
					this._url = this.urlOrCommandOrId;
				} else {
					const urlCommand = this.commandService.executeCommand<string>(this.urlOrCommandOrId).then((result) => {
						// if executing this command times out, cache its value whenever it eventually resolves
						this._url = result;
						return this._url;
					});
					// We must be defensive. The command may never return, meaning that no help at all is ever shown!
					const emptyString: Promise<string> = new Promise(resolve => setTimeout(() => resolve(''), 500));
					this._url = await Promise.race([urlCommand, emptyString]);
				}
			} else if (this.urlOrCommandOrId?.id) {
				try {
					const walkthroughId = `${this.extensionDescription.id}#${this.urlOrCommandOrId.id}`;
					const walkthrough = await this.walkthroughService.getWalkthrough(walkthroughId);
					this._description = walkthrough.title;
					this._url = walkthroughId;
				} catch { }
			}
		}
		if (this._url === undefined) {
			this._url = '';
		}
		return this._url;
	}
}

abstract class HelpItemBase implements IHelpItem {
	public iconClasses: string[] = [];
	constructor(
		public icon: ThemeIcon,
		public label: string,
		public values: HelpItemValue[],
		private quickInputService: IQuickInputService,
		private environmentService: IWorkbenchEnvironmentService,
		private remoteExplorerService: IRemoteExplorerService,
		private workspaceContextService: IWorkspaceContextService
	) {
		this.iconClasses.push(...ThemeIcon.asClassNameArray(icon));
		this.iconClasses.push('remote-help-tree-node-item-icon');
	}

	protected async getActions(): Promise<{
		label: string;
		url: string;
		description: string;
		extensionDescription: IExtensionDescription;
	}[]> {
		return (await Promise.all(this.values.map(async (value) => {
			return {
				label: value.extensionDescription.displayName || value.extensionDescription.identifier.value,
				description: await value.description ?? await value.url,
				url: await value.url,
				extensionDescription: value.extensionDescription
			};
		}))).filter(item => item.description);
	}

	async handleClick() {
		const remoteAuthority = this.environmentService.remoteAuthority;
		if (remoteAuthority) {
			for (let i = 0; i < this.remoteExplorerService.targetType.length; i++) {
				if (remoteAuthority.startsWith(this.remoteExplorerService.targetType[i])) {
					for (const value of this.values) {
						if (value.remoteAuthority) {
							for (const authority of value.remoteAuthority) {
								if (remoteAuthority.startsWith(authority)) {
									await this.takeAction(value.extensionDescription, await value.url);
									return;
								}
							}
						}
					}
				}
			}
		} else {
			const virtualWorkspace = getVirtualWorkspaceLocation(this.workspaceContextService.getWorkspace())?.scheme;
			if (virtualWorkspace) {
				for (let i = 0; i < this.remoteExplorerService.targetType.length; i++) {
					for (const value of this.values) {
						if (value.virtualWorkspace && value.remoteAuthority) {
							for (const authority of value.remoteAuthority) {
								if (this.remoteExplorerService.targetType[i].startsWith(authority) && virtualWorkspace.startsWith(value.virtualWorkspace)) {
									await this.takeAction(value.extensionDescription, await value.url);
									return;
								}
							}
						}

					}
				}
			}
		}

		if (this.values.length > 1) {
			const actions = await this.getActions();

			if (actions.length) {
				const action = await this.quickInputService.pick(actions, { placeHolder: nls.localize('pickRemoteExtension', "Select url to open") });
				if (action) {
					await this.takeAction(action.extensionDescription, action.url);
				}
			}
		} else {
			await this.takeAction(this.values[0].extensionDescription, await this.values[0].url);
		}

	}

	protected abstract takeAction(extensionDescription: IExtensionDescription, url?: string): Promise<void>;
}

class GetStartedHelpItem extends HelpItemBase {
	constructor(
		icon: ThemeIcon,
		label: string,
		values: HelpItemValue[],
		quickInputService: IQuickInputService,
		environmentService: IWorkbenchEnvironmentService,
		private openerService: IOpenerService,
		remoteExplorerService: IRemoteExplorerService,
		workspaceContextService: IWorkspaceContextService,
		private commandService: ICommandService
	) {
		super(icon, label, values, quickInputService, environmentService, remoteExplorerService, workspaceContextService);
	}

	protected async takeAction(extensionDescription: IExtensionDescription, urlOrWalkthroughId: string): Promise<void> {
		if ([Schemas.http, Schemas.https].includes(URI.parse(urlOrWalkthroughId).scheme)) {
			this.openerService.open(urlOrWalkthroughId, { allowCommands: true });
			return;
		}

		this.commandService.executeCommand('workbench.action.openWalkthrough', urlOrWalkthroughId);
	}
}

class HelpItem extends HelpItemBase {
	constructor(
		icon: ThemeIcon,
		label: string,
		values: HelpItemValue[],
		quickInputService: IQuickInputService,
		environmentService: IWorkbenchEnvironmentService,
		private openerService: IOpenerService,
		remoteExplorerService: IRemoteExplorerService,
		workspaceContextService: IWorkspaceContextService
	) {
		super(icon, label, values, quickInputService, environmentService, remoteExplorerService, workspaceContextService);
	}

	protected async takeAction(extensionDescription: IExtensionDescription, url: string): Promise<void> {
		await this.openerService.open(URI.parse(url), { allowCommands: true });
	}
}

class IssueReporterItem extends HelpItemBase {
	constructor(
		icon: ThemeIcon,
		label: string,
		values: HelpItemValue[],
		quickInputService: IQuickInputService,
		environmentService: IWorkbenchEnvironmentService,
		private commandService: ICommandService,
		private openerService: IOpenerService,
		remoteExplorerService: IRemoteExplorerService,
		workspaceContextService: IWorkspaceContextService
	) {
		super(icon, label, values, quickInputService, environmentService, remoteExplorerService, workspaceContextService);
	}

	protected override async getActions(): Promise<{
		label: string;
		description: string;
		url: string;
		extensionDescription: IExtensionDescription;
	}[]> {
		return Promise.all(this.values.map(async (value) => {
			return {
				label: value.extensionDescription.displayName || value.extensionDescription.identifier.value,
				description: '',
				url: await value.url,
				extensionDescription: value.extensionDescription
			};
		}));
	}

	protected async takeAction(extensionDescription: IExtensionDescription, url: string): Promise<void> {
		if (!url) {
			await this.commandService.executeCommand('workbench.action.openIssueReporter', [extensionDescription.identifier.value]);
		} else {
			await this.openerService.open(URI.parse(url));
		}
	}
}

class HelpPanel extends ViewPane {
	static readonly ID = '~remote.helpPanel';
	static readonly TITLE = nls.localize2('remote.help', "Help and feedback");
	private tree!: WorkbenchAsyncDataTree<HelpModel, IHelpItem, IHelpItem>;

	constructor(
		protected viewModel: IViewModel,
		options: IViewPaneOptions,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IOpenerService openerService: IOpenerService,
		@IQuickInputService protected quickInputService: IQuickInputService,
		@ICommandService protected commandService: ICommandService,
		@IRemoteExplorerService protected readonly remoteExplorerService: IRemoteExplorerService,
		@IWorkbenchEnvironmentService protected readonly environmentService: IWorkbenchEnvironmentService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IWalkthroughsService private readonly walkthroughsService: IWalkthroughsService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		container.classList.add('remote-help');
		const treeContainer = document.createElement('div');
		treeContainer.classList.add('remote-help-content');
		container.appendChild(treeContainer);

		this.tree = this.instantiationService.createInstance(WorkbenchAsyncDataTree<HelpModel, IHelpItem, IHelpItem>,
			'RemoteHelp',
			treeContainer,
			new HelpTreeVirtualDelegate(),
			[new HelpTreeRenderer()],
			new HelpDataSource(),
			{
				accessibilityProvider: {
					getAriaLabel: (item: HelpItemBase) => {
						return item.label;
					},
					getWidgetAriaLabel: () => nls.localize('remotehelp', "Remote Help")
				}
			}
		);

		const model = this._register(new HelpModel(this.viewModel, this.openerService, this.quickInputService, this.commandService, this.remoteExplorerService, this.environmentService, this.workspaceContextService, this.walkthroughsService));

		this.tree.setInput(model);

		this._register(Event.debounce(this.tree.onDidOpen, (last, event) => event, 75, true)(e => {
			e.element?.handleClick();
		}));
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);
		this.tree.layout(height, width);
	}
}

class HelpPanelDescriptor implements IViewDescriptor {
	readonly id = HelpPanel.ID;
	readonly name = HelpPanel.TITLE;
	readonly ctorDescriptor: SyncDescriptor<HelpPanel>;
	readonly canToggleVisibility = true;
	readonly hideByDefault = false;
	readonly group = 'help@50';
	readonly order = -10;

	constructor(viewModel: IViewModel) {
		this.ctorDescriptor = new SyncDescriptor(HelpPanel, [viewModel]);
	}
}

class RemoteViewPaneContainer extends FilterViewPaneContainer implements IViewModel {
	private helpPanelDescriptor = new HelpPanelDescriptor(this);
	helpInformation: HelpInformation[] = [];
	private _onDidChangeHelpInformation = new Emitter<void>();
	public onDidChangeHelpInformation: Event<void> = this._onDidChangeHelpInformation.event;
	private hasRegisteredHelpView: boolean = false;
	private remoteSwitcher: SwitchRemoteViewItem | undefined;

	constructor(
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IStorageService storageService: IStorageService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IExtensionService extensionService: IExtensionService,
		@IRemoteExplorerService private readonly remoteExplorerService: IRemoteExplorerService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@ILogService logService: ILogService,
	) {
		super(VIEWLET_ID, remoteExplorerService.onDidChangeTargetType, configurationService, layoutService, telemetryService, storageService, instantiationService, themeService, contextMenuService, extensionService, contextService, viewDescriptorService, logService);
		this.addConstantViewDescriptors([this.helpPanelDescriptor]);
		this._register(this.remoteSwitcher = this.instantiationService.createInstance(SwitchRemoteViewItem));
		this._register(this.remoteExplorerService.onDidChangeHelpInformation(extensions => {
			this._setHelpInformation(extensions);
		}));

		this._setHelpInformation(this.remoteExplorerService.helpInformation);
		const viewsRegistry = Registry.as<IViewsRegistry>(Extensions.ViewsRegistry);

		this.remoteSwitcher.createOptionItems(viewsRegistry.getViews(this.viewContainer));
		this._register(viewsRegistry.onViewsRegistered(e => {
			const remoteViews: IViewDescriptor[] = [];
			for (const view of e) {
				if (view.viewContainer.id === VIEWLET_ID) {
					remoteViews.push(...view.views);
				}
			}
			if (remoteViews.length > 0) {
				this.remoteSwitcher!.createOptionItems(remoteViews);
			}
		}));
		this._register(viewsRegistry.onViewsDeregistered(e => {
			if (e.viewContainer.id === VIEWLET_ID) {
				this.remoteSwitcher!.removeOptionItems(e.views);
			}
		}));
	}

	private _setHelpInformation(extensions: readonly IExtensionPointUser<HelpInformation>[]) {
		const helpInformation: HelpInformation[] = [];
		for (const extension of extensions) {
			this._handleRemoteInfoExtensionPoint(extension, helpInformation);
		}

		this.helpInformation = helpInformation;
		this._onDidChangeHelpInformation.fire();

		const viewsRegistry = Registry.as<IViewsRegistry>(Extensions.ViewsRegistry);
		if (this.helpInformation.length && !this.hasRegisteredHelpView) {
			const view = viewsRegistry.getView(this.helpPanelDescriptor.id);
			if (!view) {
				viewsRegistry.registerViews([this.helpPanelDescriptor], this.viewContainer);
			}
			this.hasRegisteredHelpView = true;
		} else if (this.hasRegisteredHelpView) {
			viewsRegistry.deregisterViews([this.helpPanelDescriptor], this.viewContainer);
			this.hasRegisteredHelpView = false;
		}
	}

	private _handleRemoteInfoExtensionPoint(extension: IExtensionPointUser<HelpInformation>, helpInformation: HelpInformation[]) {
		if (!isProposedApiEnabled(extension.description, 'contribRemoteHelp')) {
			return;
		}

		if (!extension.value.documentation && !extension.value.getStarted && !extension.value.issues) {
			return;
		}

		helpInformation.push({
			extensionDescription: extension.description,
			getStarted: extension.value.getStarted,
			documentation: extension.value.documentation,
			reportIssue: extension.value.reportIssue,
			issues: extension.value.issues,
			remoteName: extension.value.remoteName,
			virtualWorkspace: extension.value.virtualWorkspace
		});
	}

	protected getFilterOn(viewDescriptor: IViewDescriptor): string | undefined {
		return isStringArray(viewDescriptor.remoteAuthority) ? viewDescriptor.remoteAuthority[0] : viewDescriptor.remoteAuthority;
	}

	protected setFilter(viewDescriptor: IViewDescriptor): void {
		this.remoteExplorerService.targetType = isStringArray(viewDescriptor.remoteAuthority) ? viewDescriptor.remoteAuthority : [viewDescriptor.remoteAuthority!];
	}

	getTitle(): string {
		const title = nls.localize('remote.explorer', "Remote Explorer");
		return title;
	}
}

Registry.as<IViewContainersRegistry>(Extensions.ViewContainersRegistry).registerViewContainer(
	{
		id: VIEWLET_ID,
		title: nls.localize2('remote.explorer', "Remote Explorer"),
		ctorDescriptor: new SyncDescriptor(RemoteViewPaneContainer),
		hideIfEmpty: true,
		viewOrderDelegate: {
			getOrder: (group?: string) => {
				if (!group) {
					return;
				}

				let matches = /^targets@(\d+)$/.exec(group);
				if (matches) {
					return -1000;
				}

				matches = /^details(@(\d+))?$/.exec(group);

				if (matches) {
					return -500 + Number(matches[2]);
				}

				matches = /^help(@(\d+))?$/.exec(group);
				if (matches) {
					return -10;
				}

				return;
			}
		},
		icon: icons.remoteExplorerViewIcon,
		order: 4
	}, ViewContainerLocation.Sidebar);

export class RemoteMarkers implements IWorkbenchContribution {

	constructor(
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@ITimerService timerService: ITimerService,
	) {
		remoteAgentService.getEnvironment().then(remoteEnv => {
			if (remoteEnv) {
				timerService.setPerformanceMarks('server', remoteEnv.marks);
			}
		});
	}
}

class VisibleProgress {

	public readonly location: ProgressLocation;
	private _isDisposed: boolean;
	private _lastReport: string | null;
	private _currentProgressPromiseResolve: (() => void) | null;
	private _currentProgress: IProgress<IProgressStep> | null;
	private _currentTimer: ReconnectionTimer | null;

	public get lastReport(): string | null {
		return this._lastReport;
	}

	constructor(progressService: IProgressService, location: ProgressLocation, initialReport: string | null, buttons: string[], onDidCancel: (choice: number | undefined, lastReport: string | null) => void) {
		this.location = location;
		this._isDisposed = false;
		this._lastReport = initialReport;
		this._currentProgressPromiseResolve = null;
		this._currentProgress = null;
		this._currentTimer = null;

		const promise = new Promise<void>((resolve) => this._currentProgressPromiseResolve = resolve);

		progressService.withProgress(
			{ location: location, buttons: buttons },
			(progress) => { if (!this._isDisposed) { this._currentProgress = progress; } return promise; },
			(choice) => onDidCancel(choice, this._lastReport)
		);

		if (this._lastReport) {
			this.report();
		}
	}

	public dispose(): void {
		this._isDisposed = true;
		if (this._currentProgressPromiseResolve) {
			this._currentProgressPromiseResolve();
			this._currentProgressPromiseResolve = null;
		}
		this._currentProgress = null;
		if (this._currentTimer) {
			this._currentTimer.dispose();
			this._currentTimer = null;
		}
	}

	public report(message?: string) {
		if (message) {
			this._lastReport = message;
		}

		if (this._lastReport && this._currentProgress) {
			this._currentProgress.report({ message: this._lastReport });
		}
	}

	public startTimer(completionTime: number): void {
		this.stopTimer();
		this._currentTimer = new ReconnectionTimer(this, completionTime);
	}

	public stopTimer(): void {
		if (this._currentTimer) {
			this._currentTimer.dispose();
			this._currentTimer = null;
		}
	}
}

class ReconnectionTimer implements IDisposable {
	private readonly _parent: VisibleProgress;
	private readonly _completionTime: number;
	private readonly _renderInterval: IDisposable;

	constructor(parent: VisibleProgress, completionTime: number) {
		this._parent = parent;
		this._completionTime = completionTime;
		this._renderInterval = dom.disposableWindowInterval(mainWindow, () => this._render(), 1000);
		this._render();
	}

	public dispose(): void {
		this._renderInterval.dispose();
	}

	private _render() {
		const remainingTimeMs = this._completionTime - Date.now();
		if (remainingTimeMs < 0) {
			return;
		}
		const remainingTime = Math.ceil(remainingTimeMs / 1000);
		if (remainingTime === 1) {
			this._parent.report(nls.localize('reconnectionWaitOne', "Attempting to reconnect in {0} second...", remainingTime));
		} else {
			this._parent.report(nls.localize('reconnectionWaitMany', "Attempting to reconnect in {0} seconds...", remainingTime));
		}
	}
}

/**
 * The time when a prompt is shown to the user
 */
const DISCONNECT_PROMPT_TIME = 40 * 1000; // 40 seconds

export class RemoteAgentConnectionStatusListener extends Disposable implements IWorkbenchContribution {

	private _reloadWindowShown: boolean = false;

	constructor(
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@IProgressService progressService: IProgressService,
		@IDialogService dialogService: IDialogService,
		@ICommandService commandService: ICommandService,
		@IQuickInputService quickInputService: IQuickInputService,
		@ILogService logService: ILogService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@ITelemetryService telemetryService: ITelemetryService
	) {
		super();
		const connection = remoteAgentService.getConnection();
		if (connection) {
			let quickInputVisible = false;
			this._register(quickInputService.onShow(() => quickInputVisible = true));
			this._register(quickInputService.onHide(() => quickInputVisible = false));

			let visibleProgress: VisibleProgress | null = null;
			let reconnectWaitEvent: ReconnectionWaitEvent | null = null;
			const disposableListener = this._register(new MutableDisposable());

			function showProgress(location: ProgressLocation.Dialog | ProgressLocation.Notification | null, buttons: { label: string; callback: () => void }[], initialReport: string | null = null): VisibleProgress {
				if (visibleProgress) {
					visibleProgress.dispose();
					visibleProgress = null;
				}

				if (!location) {
					location = quickInputVisible ? ProgressLocation.Notification : ProgressLocation.Dialog;
				}

				return new VisibleProgress(
					progressService, location, initialReport, buttons.map(button => button.label),
					(choice, lastReport) => {
						// Handle choice from dialog
						if (typeof choice !== 'undefined' && buttons[choice]) {
							buttons[choice].callback();
						} else {
							if (location === ProgressLocation.Dialog) {
								visibleProgress = showProgress(ProgressLocation.Notification, buttons, lastReport);
							} else {
								hideProgress();
							}
						}
					}
				);
			}

			function hideProgress() {
				if (visibleProgress) {
					visibleProgress.dispose();
					visibleProgress = null;
				}
			}

			let reconnectionToken: string = '';
			let lastIncomingDataTime: number = 0;
			let reconnectionAttempts: number = 0;

			const reconnectButton = {
				label: nls.localize('reconnectNow', "Reconnect Now"),
				callback: () => {
					reconnectWaitEvent?.skipWait();
				}
			};

			const reloadButton = {
				label: nls.localize('reloadWindow', "Reload Window"),
				callback: () => {

					type ReconnectReloadClassification = {
						owner: 'alexdima';
						comment: 'The reload button in the builtin permanent reconnection failure dialog was pressed';
						remoteName: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The name of the resolver.' };
						reconnectionToken: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The identifier of the connection.' };
						millisSinceLastIncomingData: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Elapsed time (in ms) since data was last received.' };
						attempt: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The reconnection attempt counter.' };
					};
					type ReconnectReloadEvent = {
						remoteName: string | undefined;
						reconnectionToken: string;
						millisSinceLastIncomingData: number;
						attempt: number;
					};
					telemetryService.publicLog2<ReconnectReloadEvent, ReconnectReloadClassification>('remoteReconnectionReload', {
						remoteName: getRemoteName(environmentService.remoteAuthority),
						reconnectionToken: reconnectionToken,
						millisSinceLastIncomingData: Date.now() - lastIncomingDataTime,
						attempt: reconnectionAttempts
					});

					commandService.executeCommand(ReloadWindowAction.ID);
				}
			};

			// Possible state transitions:
			// ConnectionGain      -> ConnectionLost
			// ConnectionLost      -> ReconnectionWait, ReconnectionRunning
			// ReconnectionWait    -> ReconnectionRunning
			// ReconnectionRunning -> ConnectionGain, ReconnectionPermanentFailure

			this._register(connection.onDidStateChange((e) => {
				visibleProgress?.stopTimer();
				disposableListener.clear();

				switch (e.type) {
					case PersistentConnectionEventType.ConnectionLost:
						reconnectionToken = e.reconnectionToken;
						lastIncomingDataTime = Date.now() - e.millisSinceLastIncomingData;
						reconnectionAttempts = 0;

						type RemoteConnectionLostClassification = {
							owner: 'alexdima';
							comment: 'The remote connection state is now `ConnectionLost`';
							remoteName: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The name of the resolver.' };
							reconnectionToken: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The identifier of the connection.' };
						};
						type RemoteConnectionLostEvent = {
							remoteName: string | undefined;
							reconnectionToken: string;
						};
						telemetryService.publicLog2<RemoteConnectionLostEvent, RemoteConnectionLostClassification>('remoteConnectionLost', {
							remoteName: getRemoteName(environmentService.remoteAuthority),
							reconnectionToken: e.reconnectionToken,
						});

						if (visibleProgress || e.millisSinceLastIncomingData > DISCONNECT_PROMPT_TIME) {
							if (!visibleProgress) {
								visibleProgress = showProgress(null, [reconnectButton, reloadButton]);
							}
							visibleProgress.report(nls.localize('connectionLost', "Connection Lost"));
						}
						break;

					case PersistentConnectionEventType.ReconnectionWait:
						if (visibleProgress) {
							reconnectWaitEvent = e;
							visibleProgress = showProgress(null, [reconnectButton, reloadButton]);
							visibleProgress.startTimer(Date.now() + 1000 * e.durationSeconds);
						}
						break;

					case PersistentConnectionEventType.ReconnectionRunning:
						reconnectionToken = e.reconnectionToken;
						lastIncomingDataTime = Date.now() - e.millisSinceLastIncomingData;
						reconnectionAttempts = e.attempt;

						type RemoteReconnectionRunningClassification = {
							owner: 'alexdima';
							comment: 'The remote connection state is now `ReconnectionRunning`';
							remoteName: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The name of the resolver.' };
							reconnectionToken: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The identifier of the connection.' };
							millisSinceLastIncomingData: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Elapsed time (in ms) since data was last received.' };
							attempt: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The reconnection attempt counter.' };
						};
						type RemoteReconnectionRunningEvent = {
							remoteName: string | undefined;
							reconnectionToken: string;
							millisSinceLastIncomingData: number;
							attempt: number;
						};
						telemetryService.publicLog2<RemoteReconnectionRunningEvent, RemoteReconnectionRunningClassification>('remoteReconnectionRunning', {
							remoteName: getRemoteName(environmentService.remoteAuthority),
							reconnectionToken: e.reconnectionToken,
							millisSinceLastIncomingData: e.millisSinceLastIncomingData,
							attempt: e.attempt
						});

						if (visibleProgress || e.millisSinceLastIncomingData > DISCONNECT_PROMPT_TIME) {
							visibleProgress = showProgress(null, [reloadButton]);
							visibleProgress.report(nls.localize('reconnectionRunning', "Disconnected. Attempting to reconnect..."));

							// Register to listen for quick input is opened
							disposableListener.value = quickInputService.onShow(() => {
								// Need to move from dialog if being shown and user needs to type in a prompt
								if (visibleProgress && visibleProgress.location === ProgressLocation.Dialog) {
									visibleProgress = showProgress(ProgressLocation.Notification, [reloadButton], visibleProgress.lastReport);
								}
							});
						}

						break;

					case PersistentConnectionEventType.ReconnectionPermanentFailure:
						reconnectionToken = e.reconnectionToken;
						lastIncomingDataTime = Date.now() - e.millisSinceLastIncomingData;
						reconnectionAttempts = e.attempt;

						type RemoteReconnectionPermanentFailureClassification = {
							owner: 'alexdima';
							comment: 'The remote connection state is now `ReconnectionPermanentFailure`';
							remoteName: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The name of the resolver.' };
							reconnectionToken: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The identifier of the connection.' };
							millisSinceLastIncomingData: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Elapsed time (in ms) since data was last received.' };
							attempt: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The reconnection attempt counter.' };
							handled: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The error was handled by the resolver.' };
						};
						type RemoteReconnectionPermanentFailureEvent = {
							remoteName: string | undefined;
							reconnectionToken: string;
							millisSinceLastIncomingData: number;
							attempt: number;
							handled: boolean;
						};
						telemetryService.publicLog2<RemoteReconnectionPermanentFailureEvent, RemoteReconnectionPermanentFailureClassification>('remoteReconnectionPermanentFailure', {
							remoteName: getRemoteName(environmentService.remoteAuthority),
							reconnectionToken: e.reconnectionToken,
							millisSinceLastIncomingData: e.millisSinceLastIncomingData,
							attempt: e.attempt,
							handled: e.handled
						});

						hideProgress();

						if (e.handled) {
							logService.info(`Error handled: Not showing a notification for the error.`);
							console.log(`Error handled: Not showing a notification for the error.`);
						} else if (!this._reloadWindowShown) {
							this._reloadWindowShown = true;
							dialogService.confirm({
								type: Severity.Error,
								message: nls.localize('reconnectionPermanentFailure', "Cannot reconnect. Please reload the window."),
								primaryButton: nls.localize({ key: 'reloadWindow.dialog', comment: ['&& denotes a mnemonic'] }, "&&Reload Window")
							}).then(result => {
								if (result.confirmed) {
									commandService.executeCommand(ReloadWindowAction.ID);
								}
							});
						}
						break;

					case PersistentConnectionEventType.ConnectionGain:
						reconnectionToken = e.reconnectionToken;
						lastIncomingDataTime = Date.now() - e.millisSinceLastIncomingData;
						reconnectionAttempts = e.attempt;

						type RemoteConnectionGainClassification = {
							owner: 'alexdima';
							comment: 'The remote connection state is now `ConnectionGain`';
							remoteName: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The name of the resolver.' };
							reconnectionToken: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The identifier of the connection.' };
							millisSinceLastIncomingData: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Elapsed time (in ms) since data was last received.' };
							attempt: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The reconnection attempt counter.' };
						};
						type RemoteConnectionGainEvent = {
							remoteName: string | undefined;
							reconnectionToken: string;
							millisSinceLastIncomingData: number;
							attempt: number;
						};
						telemetryService.publicLog2<RemoteConnectionGainEvent, RemoteConnectionGainClassification>('remoteConnectionGain', {
							remoteName: getRemoteName(environmentService.remoteAuthority),
							reconnectionToken: e.reconnectionToken,
							millisSinceLastIncomingData: e.millisSinceLastIncomingData,
							attempt: e.attempt
						});

						hideProgress();
						break;
				}
			}));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/remote/browser/remoteConnectionHealth.ts]---
Location: vscode-main/src/vs/workbench/contrib/remote/browser/remoteConnectionHealth.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IRemoteAgentService, remoteConnectionLatencyMeasurer } from '../../../services/remote/common/remoteAgentService.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { localize } from '../../../../nls.js';
import { isWeb } from '../../../../base/common/platform.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { getRemoteName } from '../../../../platform/remote/common/remoteHosts.js';
import { IBannerService } from '../../../services/banner/browser/bannerService.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { Codicon } from '../../../../base/common/codicons.js';
import Severity from '../../../../base/common/severity.js';


const REMOTE_UNSUPPORTED_CONNECTION_CHOICE_KEY = 'remote.unsupportedConnectionChoice';
const BANNER_REMOTE_UNSUPPORTED_CONNECTION_DISMISSED_KEY = 'workbench.banner.remote.unsupportedConnection.dismissed';

export class InitialRemoteConnectionHealthContribution implements IWorkbenchContribution {

	constructor(
		@IRemoteAgentService private readonly _remoteAgentService: IRemoteAgentService,
		@IWorkbenchEnvironmentService private readonly _environmentService: IWorkbenchEnvironmentService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@IBannerService private readonly bannerService: IBannerService,
		@IDialogService private readonly dialogService: IDialogService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IHostService private readonly hostService: IHostService,
		@IStorageService private readonly storageService: IStorageService,
		@IProductService private readonly productService: IProductService,
	) {
		if (this._environmentService.remoteAuthority) {
			this._checkInitialRemoteConnectionHealth();
		}
	}

	private async _confirmConnection(): Promise<boolean> {
		const enum ConnectionChoice {
			Allow = 1,
			LearnMore = 2,
			Cancel = 0
		}

		const { result, checkboxChecked } = await this.dialogService.prompt<ConnectionChoice>({
			type: Severity.Warning,
			message: localize('unsupportedGlibcWarning', "You are about to connect to an OS version that is unsupported by {0}.", this.productService.nameLong),
			buttons: [
				{
					label: localize({ key: 'allow', comment: ['&& denotes a mnemonic'] }, "&&Allow"),
					run: () => ConnectionChoice.Allow
				},
				{
					label: localize({ key: 'learnMore', comment: ['&& denotes a mnemonic'] }, "&&Learn More"),
					run: async () => { await this.openerService.open('https://aka.ms/vscode-remote/faq/old-linux'); return ConnectionChoice.LearnMore; }
				}
			],
			cancelButton: {
				run: () => ConnectionChoice.Cancel
			},
			checkbox: {
				label: localize('remember', "Do not show again"),
			}
		});

		if (result === ConnectionChoice.LearnMore) {
			return await this._confirmConnection();
		}

		const allowed = result === ConnectionChoice.Allow;
		if (allowed && checkboxChecked) {
			this.storageService.store(`${REMOTE_UNSUPPORTED_CONNECTION_CHOICE_KEY}.${this._environmentService.remoteAuthority}`, allowed, StorageScope.PROFILE, StorageTarget.MACHINE);
		}

		return allowed;
	}

	private async _checkInitialRemoteConnectionHealth(): Promise<void> {
		try {
			const environment = await this._remoteAgentService.getRawEnvironment();

			if (environment && environment.isUnsupportedGlibc) {
				let allowed = this.storageService.getBoolean(`${REMOTE_UNSUPPORTED_CONNECTION_CHOICE_KEY}.${this._environmentService.remoteAuthority}`, StorageScope.PROFILE);
				if (allowed === undefined) {
					allowed = await this._confirmConnection();
				}
				if (allowed) {
					const bannerDismissedVersion = this.storageService.get(`${BANNER_REMOTE_UNSUPPORTED_CONNECTION_DISMISSED_KEY}`, StorageScope.PROFILE) ?? '';
					// Ignore patch versions and dismiss the banner if the major and minor versions match.
					const shouldShowBanner = bannerDismissedVersion.slice(0, bannerDismissedVersion.lastIndexOf('.')) !== this.productService.version.slice(0, this.productService.version.lastIndexOf('.'));
					if (shouldShowBanner) {
						const actions = [
							{
								label: localize('unsupportedGlibcBannerLearnMore', "Learn More"),
								href: 'https://aka.ms/vscode-remote/faq/old-linux'
							}
						];
						this.bannerService.show({
							id: 'unsupportedGlibcWarning.banner',
							message: localize('unsupportedGlibcWarning.banner', "You are connected to an OS version that is unsupported by {0}.", this.productService.nameLong),
							actions,
							icon: Codicon.warning,
							closeLabel: `Do not show again in v${this.productService.version}`,
							onClose: () => {
								this.storageService.store(`${BANNER_REMOTE_UNSUPPORTED_CONNECTION_DISMISSED_KEY}`, this.productService.version, StorageScope.PROFILE, StorageTarget.MACHINE);
							}
						});
					}
				} else {
					this.hostService.openWindow({ forceReuseWindow: true, remoteAuthority: null });
					return;
				}
			}

			type RemoteConnectionSuccessClassification = {
				owner: 'alexdima';
				comment: 'The initial connection succeeded';
				web: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Is web ui.' };
				connectionTimeMs: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Time, in ms, until connected' };
				remoteName: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The name of the resolver.' };
			};
			type RemoteConnectionSuccessEvent = {
				web: boolean;
				connectionTimeMs: number | undefined;
				remoteName: string | undefined;
			};
			this._telemetryService.publicLog2<RemoteConnectionSuccessEvent, RemoteConnectionSuccessClassification>('remoteConnectionSuccess', {
				web: isWeb,
				connectionTimeMs: await this._remoteAgentService.getConnection()?.getInitialConnectionTimeMs(),
				remoteName: getRemoteName(this._environmentService.remoteAuthority)
			});

			await this._measureExtHostLatency();

		} catch (err) {

			type RemoteConnectionFailureClassification = {
				owner: 'alexdima';
				comment: 'The initial connection failed';
				web: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Is web ui.' };
				remoteName: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The name of the resolver.' };
				connectionTimeMs: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Time, in ms, until connection failure' };
				message: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Error message' };
			};
			type RemoteConnectionFailureEvent = {
				web: boolean;
				remoteName: string | undefined;
				connectionTimeMs: number | undefined;
				message: string;
			};
			this._telemetryService.publicLog2<RemoteConnectionFailureEvent, RemoteConnectionFailureClassification>('remoteConnectionFailure', {
				web: isWeb,
				connectionTimeMs: await this._remoteAgentService.getConnection()?.getInitialConnectionTimeMs(),
				remoteName: getRemoteName(this._environmentService.remoteAuthority),
				message: err ? err.message : ''
			});

		}
	}

	private async _measureExtHostLatency() {
		const measurement = await remoteConnectionLatencyMeasurer.measure(this._remoteAgentService);
		if (measurement === undefined) {
			return;
		}

		type RemoteConnectionLatencyClassification = {
			owner: 'connor4312';
			comment: 'The latency to the remote extension host';
			web: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Whether this is running on web' };
			remoteName: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Anonymized remote name' };
			latencyMs: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Latency to the remote, in milliseconds' };
		};
		type RemoteConnectionLatencyEvent = {
			web: boolean;
			remoteName: string | undefined;
			latencyMs: number;
		};

		this._telemetryService.publicLog2<RemoteConnectionLatencyEvent, RemoteConnectionLatencyClassification>('remoteConnectionLatency', {
			web: isWeb,
			remoteName: getRemoteName(this._environmentService.remoteAuthority),
			latencyMs: measurement.current
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/remote/browser/remoteExplorer.ts]---
Location: vscode-main/src/vs/workbench/contrib/remote/browser/remoteExplorer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../../../nls.js';
import { Disposable, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { Extensions, IViewContainersRegistry, IViewsRegistry, ViewContainer, ViewContainerLocation } from '../../../common/views.js';
import { IRemoteExplorerService, PORT_AUTO_FALLBACK_SETTING, PORT_AUTO_FORWARD_SETTING, PORT_AUTO_SOURCE_SETTING, PORT_AUTO_SOURCE_SETTING_HYBRID, PORT_AUTO_SOURCE_SETTING_OUTPUT, PORT_AUTO_SOURCE_SETTING_PROCESS, PortsEnablement, TUNNEL_VIEW_CONTAINER_ID, TUNNEL_VIEW_ID } from '../../../services/remote/common/remoteExplorerService.js';
import { Attributes, AutoTunnelSource, forwardedPortsFeaturesEnabled, forwardedPortsViewEnabled, makeAddress, mapHasAddressLocalhostOrAllInterfaces, OnPortForward, Tunnel, TunnelCloseReason, TunnelSource } from '../../../services/remote/common/tunnelModel.js';
import { ForwardPortAction, OpenPortInBrowserAction, TunnelPanel, TunnelPanelDescriptor, TunnelViewModel, OpenPortInPreviewAction, openPreviewEnabledContext } from './tunnelView.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IStatusbarEntry, IStatusbarEntryAccessor, IStatusbarService, StatusbarAlignment } from '../../../services/statusbar/browser/statusbar.js';
import { UrlFinder } from './urlFinder.js';
import Severity from '../../../../base/common/severity.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { INotificationHandle, INotificationService, IPromptChoice } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { ITerminalService } from '../../terminal/browser/terminal.js';
import { IDebugService } from '../../debug/common/debug.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { isWeb, OperatingSystem } from '../../../../base/common/platform.js';
import { ITunnelService, RemoteTunnel, TunnelPrivacyId } from '../../../../platform/tunnel/common/tunnel.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { IActivityService, NumberBadge } from '../../../services/activity/common/activity.js';
import { portsViewIcon } from './remoteIcons.js';
import { Event } from '../../../../base/common/event.js';
import { IExternalUriOpenerService } from '../../externalUriOpener/common/externalUriOpenerService.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IWorkbenchConfigurationService } from '../../../services/configuration/common/configuration.js';
import { IRemoteAgentEnvironment } from '../../../../platform/remote/common/remoteAgentEnvironment.js';
import { toAction } from '../../../../base/common/actions.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { IStorageService, StorageScope } from '../../../../platform/storage/common/storage.js';

export const VIEWLET_ID = 'workbench.view.remote';

export class ForwardedPortsView extends Disposable implements IWorkbenchContribution {
	private readonly contextKeyListener = this._register(new MutableDisposable<IDisposable>());
	private readonly activityBadge = this._register(new MutableDisposable<IDisposable>());
	private entryAccessor: IStatusbarEntryAccessor | undefined;
	private hasPortsInSession: boolean = false;

	constructor(
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IRemoteExplorerService private readonly remoteExplorerService: IRemoteExplorerService,
		@ITunnelService private readonly tunnelService: ITunnelService,
		@IActivityService private readonly activityService: IActivityService,
		@IStatusbarService private readonly statusbarService: IStatusbarService,
	) {
		super();
		this._register(Registry.as<IViewsRegistry>(Extensions.ViewsRegistry).registerViewWelcomeContent(TUNNEL_VIEW_ID, {
			content: this.environmentService.remoteAuthority ? nls.localize('remoteNoPorts', "No forwarded ports. Forward a port to access your running services locally.\n[Forward a Port]({0})", `command:${ForwardPortAction.INLINE_ID}`)
				: nls.localize('noRemoteNoPorts', "No forwarded ports. Forward a port to access your locally running services over the internet.\n[Forward a Port]({0})", `command:${ForwardPortAction.INLINE_ID}`),
		}));
		this.enableBadgeAndStatusBar();
		this.enableForwardedPortsFeatures();
		if (!this.environmentService.remoteAuthority) {
			this._register(Event.once(this.tunnelService.onTunnelOpened)(() => {
				this.hasPortsInSession = true;
			}));
		}
	}

	private async getViewContainer(): Promise<ViewContainer | null> {
		return Registry.as<IViewContainersRegistry>(Extensions.ViewContainersRegistry).registerViewContainer({
			id: TUNNEL_VIEW_CONTAINER_ID,
			title: nls.localize2('ports', "Ports"),
			icon: portsViewIcon,
			ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [TUNNEL_VIEW_CONTAINER_ID, { mergeViewWithContainerWhenSingleView: true }]),
			storageId: TUNNEL_VIEW_CONTAINER_ID,
			hideIfEmpty: true,
			order: 5
		}, ViewContainerLocation.Panel);
	}

	private async enableForwardedPortsFeatures() {
		this.contextKeyListener.clear();

		const featuresEnabled: boolean = !!forwardedPortsFeaturesEnabled.getValue(this.contextKeyService);
		const viewEnabled: boolean = !!forwardedPortsViewEnabled.getValue(this.contextKeyService);

		if (featuresEnabled || viewEnabled) {
			// Also enable the view if it isn't already.
			if (!viewEnabled) {
				this.contextKeyService.createKey(forwardedPortsViewEnabled.key, true);
			}
			const viewContainer = await this.getViewContainer();
			const tunnelPanelDescriptor = new TunnelPanelDescriptor(new TunnelViewModel(this.remoteExplorerService, this.tunnelService), this.environmentService);
			const viewsRegistry = Registry.as<IViewsRegistry>(Extensions.ViewsRegistry);
			if (viewContainer) {
				this.remoteExplorerService.enablePortsFeatures(!featuresEnabled);
				viewsRegistry.registerViews([tunnelPanelDescriptor], viewContainer);
			}
		} else {
			this.contextKeyListener.value = this.contextKeyService.onDidChangeContext(e => {
				if (e.affectsSome(new Set([...forwardedPortsFeaturesEnabled.keys(), ...forwardedPortsViewEnabled.keys()]))) {
					this.enableForwardedPortsFeatures();
				}
			});
		}
	}

	private enableBadgeAndStatusBar() {
		const disposable = Registry.as<IViewsRegistry>(Extensions.ViewsRegistry).onViewsRegistered(e => {
			if (e.find(view => view.views.find(viewDescriptor => viewDescriptor.id === TUNNEL_VIEW_ID))) {
				this._register(Event.debounce(this.remoteExplorerService.tunnelModel.onForwardPort, (_last, e) => e, 50)(() => {
					this.updateActivityBadge();
					this.updateStatusBar();
				}));
				this._register(Event.debounce(this.remoteExplorerService.tunnelModel.onClosePort, (_last, e) => e, 50)(() => {
					this.updateActivityBadge();
					this.updateStatusBar();
				}));

				this.updateActivityBadge();
				this.updateStatusBar();
				disposable.dispose();
			}
		});
	}

	private async updateActivityBadge() {
		if (this.remoteExplorerService.tunnelModel.forwarded.size > 0) {
			this.activityBadge.value = this.activityService.showViewActivity(TUNNEL_VIEW_ID, {
				badge: new NumberBadge(this.remoteExplorerService.tunnelModel.forwarded.size, n => n === 1 ? nls.localize('1forwardedPort', "1 forwarded port") : nls.localize('nForwardedPorts', "{0} forwarded ports", n))
			});
		} else {
			this.activityBadge.clear();
		}
	}

	private updateStatusBar() {
		if (!this.environmentService.remoteAuthority && !this.hasPortsInSession) {
			// We only want to show the ports status bar entry when the user has taken an action that indicates that they might care about it.
			return;
		}

		if (!this.entryAccessor) {
			this._register(this.entryAccessor = this.statusbarService.addEntry(this.entry, 'status.forwardedPorts', StatusbarAlignment.LEFT, 40));
		} else {
			this.entryAccessor.update(this.entry);
		}
	}

	private get entry(): IStatusbarEntry {
		let tooltip: string;
		const count = this.remoteExplorerService.tunnelModel.forwarded.size + this.remoteExplorerService.tunnelModel.detected.size;
		const text = `${count}`;
		if (count === 0) {
			tooltip = nls.localize('remote.forwardedPorts.statusbarTextNone', "No Ports Forwarded");
		} else {
			const allTunnels = Array.from(this.remoteExplorerService.tunnelModel.forwarded.values());
			allTunnels.push(...Array.from(this.remoteExplorerService.tunnelModel.detected.values()));
			tooltip = nls.localize('remote.forwardedPorts.statusbarTooltip', "Forwarded Ports: {0}",
				allTunnels.map(forwarded => forwarded.remotePort).join(', '));
		}
		return {
			name: nls.localize('status.forwardedPorts', "Forwarded Ports"),
			text: `$(radio-tower) ${text}`,
			ariaLabel: tooltip,
			tooltip,
			command: `${TUNNEL_VIEW_ID}.focus`
		};
	}
}

export class PortRestore implements IWorkbenchContribution {
	constructor(
		@IRemoteExplorerService private readonly remoteExplorerService: IRemoteExplorerService,
		@ILogService private readonly logService: ILogService
	) {
		if (!this.remoteExplorerService.tunnelModel.environmentTunnelsSet) {
			Event.once(this.remoteExplorerService.tunnelModel.onEnvironmentTunnelsSet)(async () => {
				await this.restore();
			});
		} else {
			this.restore();
		}
	}

	private async restore() {
		this.logService.trace('ForwardedPorts: Doing first restore.');
		return this.remoteExplorerService.restore();
	}
}


export class AutomaticPortForwarding extends Disposable implements IWorkbenchContribution {
	private procForwarder: ProcAutomaticPortForwarding | undefined;
	private outputForwarder: OutputAutomaticPortForwarding | undefined;
	private portListener: IDisposable | undefined;

	constructor(
		@ITerminalService private readonly terminalService: ITerminalService,
		@INotificationService private readonly notificationService: INotificationService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IExternalUriOpenerService private readonly externalOpenerService: IExternalUriOpenerService,
		@IRemoteExplorerService private readonly remoteExplorerService: IRemoteExplorerService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IWorkbenchConfigurationService private readonly configurationService: IWorkbenchConfigurationService,
		@IDebugService private readonly debugService: IDebugService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@ITunnelService private readonly tunnelService: ITunnelService,
		@IHostService private readonly hostService: IHostService,
		@ILogService private readonly logService: ILogService,
		@IStorageService private readonly storageService: IStorageService,
		@IPreferencesService private readonly preferencesService: IPreferencesService,
	) {
		super();
		if (!environmentService.remoteAuthority) {
			return;
		}

		configurationService.whenRemoteConfigurationLoaded().then(() => remoteAgentService.getEnvironment()).then(environment => {
			this.setup(environment);
			this._register(configurationService.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration(PORT_AUTO_SOURCE_SETTING)) {
					this.setup(environment);
				} else if (e.affectsConfiguration(PORT_AUTO_FALLBACK_SETTING) && !this.portListener) {
					this.listenForPorts();
				}
			}));
		});

		if (!this.storageService.getBoolean('processPortForwardingFallback', StorageScope.WORKSPACE, true)) {
			this.configurationService.updateValue(PORT_AUTO_FALLBACK_SETTING, 0, ConfigurationTarget.WORKSPACE);
		}
	}

	private getPortAutoFallbackNumber(): number {
		const fallbackAt = this.configurationService.inspect<number>(PORT_AUTO_FALLBACK_SETTING);
		if ((fallbackAt.value !== undefined) && (fallbackAt.value === 0 || (fallbackAt.value !== fallbackAt.defaultValue))) {
			return fallbackAt.value;
		}
		const inspectSource = this.configurationService.inspect(PORT_AUTO_SOURCE_SETTING);
		if (inspectSource.applicationValue === PORT_AUTO_SOURCE_SETTING_PROCESS ||
			inspectSource.userValue === PORT_AUTO_SOURCE_SETTING_PROCESS ||
			inspectSource.userLocalValue === PORT_AUTO_SOURCE_SETTING_PROCESS ||
			inspectSource.userRemoteValue === PORT_AUTO_SOURCE_SETTING_PROCESS ||
			inspectSource.workspaceFolderValue === PORT_AUTO_SOURCE_SETTING_PROCESS ||
			inspectSource.workspaceValue === PORT_AUTO_SOURCE_SETTING_PROCESS) {
			return 0;
		}
		return fallbackAt.value ?? 20;
	}

	private listenForPorts() {
		let fallbackAt = this.getPortAutoFallbackNumber();
		if (fallbackAt === 0) {
			this.portListener?.dispose();
			return;
		}

		if (this.procForwarder && !this.portListener && (this.configurationService.getValue(PORT_AUTO_SOURCE_SETTING) === PORT_AUTO_SOURCE_SETTING_PROCESS)) {
			this.portListener = this._register(this.remoteExplorerService.tunnelModel.onForwardPort(async () => {
				fallbackAt = this.getPortAutoFallbackNumber();
				if (fallbackAt === 0) {
					this.portListener?.dispose();
					return;
				}
				if (Array.from(this.remoteExplorerService.tunnelModel.forwarded.values()).filter(tunnel => tunnel.source.source === TunnelSource.Auto).length > fallbackAt) {
					await this.configurationService.updateValue(PORT_AUTO_SOURCE_SETTING, PORT_AUTO_SOURCE_SETTING_HYBRID);
					this.notificationService.notify({
						message: nls.localize('remote.autoForwardPortsSource.fallback', "Over 20 ports have been automatically forwarded. The `process` based automatic port forwarding has been switched to `hybrid` in settings. Some ports may no longer be detected."),
						severity: Severity.Warning,
						actions: {
							primary: [
								toAction({
									id: 'switchBack',
									label: nls.localize('remote.autoForwardPortsSource.fallback.switchBack', "Undo"),
									run: async () => {
										await this.configurationService.updateValue(PORT_AUTO_SOURCE_SETTING, PORT_AUTO_SOURCE_SETTING_PROCESS);
										await this.configurationService.updateValue(PORT_AUTO_FALLBACK_SETTING, 0, ConfigurationTarget.WORKSPACE);
										this.portListener?.dispose();
										this.portListener = undefined;
									}
								}),
								toAction({
									id: 'showPortSourceSetting',
									label: nls.localize('remote.autoForwardPortsSource.fallback.showPortSourceSetting', "Show Setting"),
									run: async () => {
										await this.preferencesService.openSettings({
											query: 'remote.autoForwardPortsSource'
										});
									}
								})
							]
						}
					});
				}
			}));
		} else {
			this.portListener?.dispose();
			this.portListener = undefined;
		}
	}


	private setup(environment: IRemoteAgentEnvironment | null) {
		const alreadyForwarded = this.procForwarder?.forwarded;
		const isSwitch = this.outputForwarder || this.procForwarder;
		this.procForwarder?.dispose();
		this.procForwarder = undefined;
		this.outputForwarder?.dispose();
		this.outputForwarder = undefined;
		if (environment?.os !== OperatingSystem.Linux) {
			if (this.configurationService.inspect<string>(PORT_AUTO_SOURCE_SETTING).default?.value !== PORT_AUTO_SOURCE_SETTING_OUTPUT) {
				Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration)
					.registerDefaultConfigurations([{ overrides: { 'remote.autoForwardPortsSource': PORT_AUTO_SOURCE_SETTING_OUTPUT } }]);
			}
			this.outputForwarder = this._register(new OutputAutomaticPortForwarding(this.terminalService, this.notificationService, this.openerService, this.externalOpenerService,
				this.remoteExplorerService, this.configurationService, this.debugService, this.tunnelService, this.hostService, this.logService, this.contextKeyService, () => false));
		} else {
			const useProc = () => (this.configurationService.getValue(PORT_AUTO_SOURCE_SETTING) === PORT_AUTO_SOURCE_SETTING_PROCESS);
			if (useProc()) {
				this.procForwarder = this._register(new ProcAutomaticPortForwarding(false, alreadyForwarded, !isSwitch, this.configurationService, this.remoteExplorerService, this.notificationService,
					this.openerService, this.externalOpenerService, this.tunnelService, this.hostService, this.logService, this.contextKeyService));
			} else if (this.configurationService.getValue(PORT_AUTO_SOURCE_SETTING) === PORT_AUTO_SOURCE_SETTING_HYBRID) {
				this.procForwarder = this._register(new ProcAutomaticPortForwarding(true, alreadyForwarded, !isSwitch, this.configurationService, this.remoteExplorerService, this.notificationService,
					this.openerService, this.externalOpenerService, this.tunnelService, this.hostService, this.logService, this.contextKeyService));
			}
			this.outputForwarder = this._register(new OutputAutomaticPortForwarding(this.terminalService, this.notificationService, this.openerService, this.externalOpenerService,
				this.remoteExplorerService, this.configurationService, this.debugService, this.tunnelService, this.hostService, this.logService, this.contextKeyService, useProc));
		}
		this.listenForPorts();
	}
}

class OnAutoForwardedAction extends Disposable {
	private lastNotifyTime: Date;
	private static NOTIFY_COOL_DOWN = 5000; // milliseconds
	private lastNotification: INotificationHandle | undefined;
	private lastShownPort: number | undefined;
	private doActionTunnels: RemoteTunnel[] | undefined;
	private alreadyOpenedOnce: Set<string> = new Set();

	constructor(private readonly notificationService: INotificationService,
		private readonly remoteExplorerService: IRemoteExplorerService,
		private readonly openerService: IOpenerService,
		private readonly externalOpenerService: IExternalUriOpenerService,
		private readonly tunnelService: ITunnelService,
		private readonly hostService: IHostService,
		private readonly logService: ILogService,
		private readonly contextKeyService: IContextKeyService) {
		super();
		this.lastNotifyTime = new Date();
		this.lastNotifyTime.setFullYear(this.lastNotifyTime.getFullYear() - 1);
	}

	public async doAction(tunnels: RemoteTunnel[]): Promise<void> {
		this.logService.trace(`ForwardedPorts: (OnAutoForwardedAction) Starting action for ${tunnels[0]?.tunnelRemotePort}`);
		this.doActionTunnels = tunnels;
		const tunnel = await this.portNumberHeuristicDelay();
		this.logService.trace(`ForwardedPorts: (OnAutoForwardedAction) Heuristic chose ${tunnel?.tunnelRemotePort}`);
		if (tunnel) {
			const allAttributes = await this.remoteExplorerService.tunnelModel.getAttributes([{ port: tunnel.tunnelRemotePort, host: tunnel.tunnelRemoteHost }]);
			const attributes = allAttributes?.get(tunnel.tunnelRemotePort)?.onAutoForward;
			this.logService.trace(`ForwardedPorts: (OnAutoForwardedAction) onAutoForward action is ${attributes}`);
			switch (attributes) {
				case OnPortForward.OpenBrowserOnce: {
					if (this.alreadyOpenedOnce.has(tunnel.localAddress)) {
						break;
					}
					this.alreadyOpenedOnce.add(tunnel.localAddress);
					// Intentionally do not break so that the open browser path can be run.
				}
				case OnPortForward.OpenBrowser: {
					const address = makeAddress(tunnel.tunnelRemoteHost, tunnel.tunnelRemotePort);
					await OpenPortInBrowserAction.run(this.remoteExplorerService.tunnelModel, this.openerService, address);
					break;
				}
				case OnPortForward.OpenPreview: {
					const address = makeAddress(tunnel.tunnelRemoteHost, tunnel.tunnelRemotePort);
					await OpenPortInPreviewAction.run(this.remoteExplorerService.tunnelModel, this.openerService, this.externalOpenerService, address);
					break;
				}
				case OnPortForward.Silent: break;
				default: {
					const elapsed = new Date().getTime() - this.lastNotifyTime.getTime();
					this.logService.trace(`ForwardedPorts: (OnAutoForwardedAction) time elapsed since last notification ${elapsed} ms`);
					if (elapsed > OnAutoForwardedAction.NOTIFY_COOL_DOWN) {
						await this.showNotification(tunnel);
					}
				}
			}
		}
	}

	public hide(removedPorts: number[]) {
		if (this.doActionTunnels) {
			this.doActionTunnels = this.doActionTunnels.filter(value => !removedPorts.includes(value.tunnelRemotePort));
		}
		if (this.lastShownPort && removedPorts.indexOf(this.lastShownPort) >= 0) {
			this.lastNotification?.close();
		}
	}

	private newerTunnel: RemoteTunnel | undefined;
	private async portNumberHeuristicDelay(): Promise<RemoteTunnel | undefined> {
		this.logService.trace(`ForwardedPorts: (OnAutoForwardedAction) Starting heuristic delay`);
		if (!this.doActionTunnels || this.doActionTunnels.length === 0) {
			return;
		}
		this.doActionTunnels = this.doActionTunnels.sort((a, b) => a.tunnelRemotePort - b.tunnelRemotePort);
		const firstTunnel = this.doActionTunnels.shift()!;
		// Heuristic.
		if (firstTunnel.tunnelRemotePort % 1000 === 0) {
			this.logService.trace(`ForwardedPorts: (OnAutoForwardedAction) Heuristic chose tunnel because % 1000: ${firstTunnel.tunnelRemotePort}`);
			this.newerTunnel = firstTunnel;
			return firstTunnel;
			// 9229 is the node inspect port
		} else if (firstTunnel.tunnelRemotePort < 10000 && firstTunnel.tunnelRemotePort !== 9229) {
			this.logService.trace(`ForwardedPorts: (OnAutoForwardedAction) Heuristic chose tunnel because < 10000: ${firstTunnel.tunnelRemotePort}`);
			this.newerTunnel = firstTunnel;
			return firstTunnel;
		}

		this.logService.trace(`ForwardedPorts: (OnAutoForwardedAction) Waiting for "better" tunnel than ${firstTunnel.tunnelRemotePort}`);
		this.newerTunnel = undefined;
		return new Promise(resolve => {
			setTimeout(() => {
				if (this.newerTunnel) {
					resolve(undefined);
				} else if (this.doActionTunnels?.includes(firstTunnel)) {
					resolve(firstTunnel);
				} else {
					resolve(undefined);
				}
			}, 3000);
		});
	}

	private async basicMessage(tunnel: RemoteTunnel) {
		const properties = await this.remoteExplorerService.tunnelModel.getAttributes([{ host: tunnel.tunnelRemoteHost, port: tunnel.tunnelRemotePort }], false);
		const label = properties?.get(tunnel.tunnelRemotePort)?.label;
		return nls.localize('remote.tunnelsView.automaticForward', "Your application{0} running on port {1} is available.  ",
			label ? ` (${label})` : '',
			tunnel.tunnelRemotePort);
	}

	private linkMessage() {
		return nls.localize(
			{ key: 'remote.tunnelsView.notificationLink2', comment: ['[See all forwarded ports]({0}) is a link. Only translate `See all forwarded ports`. Do not change brackets and parentheses or {0}'] },
			"[See all forwarded ports]({0})", `command:${TunnelPanel.ID}.focus`);
	}

	private async showNotification(tunnel: RemoteTunnel) {
		if (!await this.hostService.hadLastFocus()) {
			return;
		}

		this.lastNotification?.close();
		let message = await this.basicMessage(tunnel);
		const choices = [this.openBrowserChoice(tunnel)];
		if (!isWeb || openPreviewEnabledContext.getValue(this.contextKeyService)) {
			choices.push(this.openPreviewChoice(tunnel));
		}

		if ((tunnel.tunnelLocalPort !== tunnel.tunnelRemotePort) && this.tunnelService.canElevate && this.tunnelService.isPortPrivileged(tunnel.tunnelRemotePort)) {
			// Privileged ports are not on Windows, so it's safe to use "superuser"
			message += nls.localize('remote.tunnelsView.elevationMessage', "You'll need to run as superuser to use port {0} locally.  ", tunnel.tunnelRemotePort);
			choices.unshift(this.elevateChoice(tunnel));
		}

		if (tunnel.privacy === TunnelPrivacyId.Private && isWeb && this.tunnelService.canChangePrivacy) {
			choices.push(this.makePublicChoice(tunnel));
		}

		message += this.linkMessage();

		this.lastNotification = this.notificationService.prompt(Severity.Info, message, choices, { neverShowAgain: { id: 'remote.tunnelsView.autoForwardNeverShow', isSecondary: true } });
		this.lastShownPort = tunnel.tunnelRemotePort;
		this.lastNotifyTime = new Date();
		this.lastNotification.onDidClose(() => {
			this.lastNotification = undefined;
			this.lastShownPort = undefined;
		});
	}

	private makePublicChoice(tunnel: RemoteTunnel): IPromptChoice {
		return {
			label: nls.localize('remote.tunnelsView.makePublic', "Make Public"),
			run: async () => {
				const oldTunnelDetails = mapHasAddressLocalhostOrAllInterfaces(this.remoteExplorerService.tunnelModel.forwarded, tunnel.tunnelRemoteHost, tunnel.tunnelRemotePort);
				await this.remoteExplorerService.close({ host: tunnel.tunnelRemoteHost, port: tunnel.tunnelRemotePort }, TunnelCloseReason.Other);
				return this.remoteExplorerService.forward({
					remote: { host: tunnel.tunnelRemoteHost, port: tunnel.tunnelRemotePort },
					local: tunnel.tunnelLocalPort,
					name: oldTunnelDetails?.name,
					elevateIfNeeded: true,
					privacy: TunnelPrivacyId.Public,
					source: oldTunnelDetails?.source
				});
			}
		};
	}

	private openBrowserChoice(tunnel: RemoteTunnel): IPromptChoice {
		const address = makeAddress(tunnel.tunnelRemoteHost, tunnel.tunnelRemotePort);
		return {
			label: OpenPortInBrowserAction.LABEL,
			run: () => OpenPortInBrowserAction.run(this.remoteExplorerService.tunnelModel, this.openerService, address)
		};
	}

	private openPreviewChoice(tunnel: RemoteTunnel): IPromptChoice {
		const address = makeAddress(tunnel.tunnelRemoteHost, tunnel.tunnelRemotePort);
		return {
			label: OpenPortInPreviewAction.LABEL,
			run: () => OpenPortInPreviewAction.run(this.remoteExplorerService.tunnelModel, this.openerService, this.externalOpenerService, address)
		};
	}

	private elevateChoice(tunnel: RemoteTunnel): IPromptChoice {
		return {
			// Privileged ports are not on Windows, so it's ok to stick to just "sudo".
			label: nls.localize('remote.tunnelsView.elevationButton', "Use Port {0} as Sudo...", tunnel.tunnelRemotePort),
			run: async () => {
				await this.remoteExplorerService.close({ host: tunnel.tunnelRemoteHost, port: tunnel.tunnelRemotePort }, TunnelCloseReason.Other);
				const newTunnel = await this.remoteExplorerService.forward({
					remote: { host: tunnel.tunnelRemoteHost, port: tunnel.tunnelRemotePort },
					local: tunnel.tunnelRemotePort,
					elevateIfNeeded: true,
					source: AutoTunnelSource
				});
				if (!newTunnel || (typeof newTunnel === 'string')) {
					return;
				}
				this.lastNotification?.close();
				this.lastShownPort = newTunnel.tunnelRemotePort;
				this.lastNotification = this.notificationService.prompt(Severity.Info,
					await this.basicMessage(newTunnel) + this.linkMessage(),
					[this.openBrowserChoice(newTunnel), this.openPreviewChoice(tunnel)],
					{ neverShowAgain: { id: 'remote.tunnelsView.autoForwardNeverShow', isSecondary: true } });
				this.lastNotification.onDidClose(() => {
					this.lastNotification = undefined;
					this.lastShownPort = undefined;
				});
			}
		};
	}
}

class OutputAutomaticPortForwarding extends Disposable {
	private portsFeatures?: IDisposable;
	private urlFinder?: UrlFinder;
	private notifier: OnAutoForwardedAction;

	constructor(
		private readonly terminalService: ITerminalService,
		readonly notificationService: INotificationService,
		readonly openerService: IOpenerService,
		readonly externalOpenerService: IExternalUriOpenerService,
		private readonly remoteExplorerService: IRemoteExplorerService,
		private readonly configurationService: IConfigurationService,
		private readonly debugService: IDebugService,
		readonly tunnelService: ITunnelService,
		readonly hostService: IHostService,
		readonly logService: ILogService,
		readonly contextKeyService: IContextKeyService,
		readonly privilegedOnly: () => boolean
	) {
		super();
		this.notifier = new OnAutoForwardedAction(notificationService, remoteExplorerService, openerService, externalOpenerService, tunnelService, hostService, logService, contextKeyService);
		this._register(configurationService.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration(PORT_AUTO_FORWARD_SETTING)) {
				this.tryStartStopUrlFinder();
			}
		}));

		this.portsFeatures = this._register(this.remoteExplorerService.onEnabledPortsFeatures(() => {
			this.tryStartStopUrlFinder();
		}));
		this.tryStartStopUrlFinder();

		if (configurationService.getValue(PORT_AUTO_SOURCE_SETTING) === PORT_AUTO_SOURCE_SETTING_HYBRID) {
			this._register(this.tunnelService.onTunnelClosed(tunnel => this.notifier.hide([tunnel.port])));
		}
	}

	private tryStartStopUrlFinder() {
		if (this.configurationService.getValue(PORT_AUTO_FORWARD_SETTING)) {
			this.startUrlFinder();
		} else {
			this.stopUrlFinder();
		}
	}

	private startUrlFinder() {
		if (!this.urlFinder && (this.remoteExplorerService.portsFeaturesEnabled !== PortsEnablement.AdditionalFeatures)) {
			return;
		}
		this.portsFeatures?.dispose();
		this.urlFinder = this._register(new UrlFinder(this.terminalService, this.debugService));
		this._register(this.urlFinder.onDidMatchLocalUrl(async (localUrl) => {
			if (mapHasAddressLocalhostOrAllInterfaces(this.remoteExplorerService.tunnelModel.detected, localUrl.host, localUrl.port)) {
				return;
			}
			const attributes = (await this.remoteExplorerService.tunnelModel.getAttributes([localUrl]))?.get(localUrl.port);
			if (attributes?.onAutoForward === OnPortForward.Ignore) {
				return;
			}
			if (this.privilegedOnly() && !this.tunnelService.isPortPrivileged(localUrl.port)) {
				return;
			}
			const forwarded = await this.remoteExplorerService.forward({ remote: localUrl, source: AutoTunnelSource }, attributes ?? null);
			if (forwarded && (typeof forwarded !== 'string')) {
				this.notifier.doAction([forwarded]);
			}
		}));
	}

	private stopUrlFinder() {
		if (this.urlFinder) {
			this.urlFinder.dispose();
			this.urlFinder = undefined;
		}
	}
}

class ProcAutomaticPortForwarding extends Disposable {
	private candidateListener: IDisposable | undefined;
	private autoForwarded: Set<string> = new Set();
	private notifiedOnly: Set<string> = new Set();
	private notifier: OnAutoForwardedAction;
	private initialCandidates: Set<string> = new Set();
	private portsFeatures: IDisposable | undefined;

	constructor(
		private readonly unforwardOnly: boolean,
		readonly alreadyAutoForwarded: Set<string> | undefined,
		private readonly needsInitialCandidates: boolean,
		private readonly configurationService: IConfigurationService,
		readonly remoteExplorerService: IRemoteExplorerService,
		readonly notificationService: INotificationService,
		readonly openerService: IOpenerService,
		readonly externalOpenerService: IExternalUriOpenerService,
		readonly tunnelService: ITunnelService,
		readonly hostService: IHostService,
		readonly logService: ILogService,
		readonly contextKeyService: IContextKeyService,
	) {
		super();
		this.notifier = new OnAutoForwardedAction(notificationService, remoteExplorerService, openerService, externalOpenerService, tunnelService, hostService, logService, contextKeyService);
		alreadyAutoForwarded?.forEach(port => this.autoForwarded.add(port));
		this.initialize();
	}

	get forwarded(): Set<string> {
		return this.autoForwarded;
	}

	private async initialize() {
		if (!this.remoteExplorerService.tunnelModel.environmentTunnelsSet) {
			await new Promise<void>(resolve => this.remoteExplorerService.tunnelModel.onEnvironmentTunnelsSet(() => resolve()));
		}

		this._register(this.configurationService.onDidChangeConfiguration(async (e) => {
			if (e.affectsConfiguration(PORT_AUTO_FORWARD_SETTING)) {
				await this.startStopCandidateListener();
			}
		}));

		this.portsFeatures = this._register(this.remoteExplorerService.onEnabledPortsFeatures(async () => {
			await this.startStopCandidateListener();
		}));

		this.startStopCandidateListener();
	}

	private async startStopCandidateListener() {
		if (this.configurationService.getValue(PORT_AUTO_FORWARD_SETTING)) {
			await this.startCandidateListener();
		} else {
			this.stopCandidateListener();
		}
	}

	private stopCandidateListener() {
		if (this.candidateListener) {
			this.candidateListener.dispose();
			this.candidateListener = undefined;
		}
	}

	private async startCandidateListener() {
		if (this.candidateListener || (this.remoteExplorerService.portsFeaturesEnabled !== PortsEnablement.AdditionalFeatures)) {
			return;
		}
		this.portsFeatures?.dispose();

		// Capture list of starting candidates so we don't auto forward them later.
		await this.setInitialCandidates();

		// Need to check the setting again, since it may have changed while we waited for the initial candidates to be set.
		if (this.configurationService.getValue(PORT_AUTO_FORWARD_SETTING)) {
			this.candidateListener = this._register(this.remoteExplorerService.tunnelModel.onCandidatesChanged(this.handleCandidateUpdate, this));
		}
	}

	private async setInitialCandidates() {
		if (!this.needsInitialCandidates) {
			this.logService.debug(`ForwardedPorts: (ProcForwarding) Not setting initial candidates`);
			return;
		}
		let startingCandidates = this.remoteExplorerService.tunnelModel.candidatesOrUndefined;
		if (!startingCandidates) {
			await new Promise<void>(resolve => this.remoteExplorerService.tunnelModel.onCandidatesChanged(() => resolve()));
			startingCandidates = this.remoteExplorerService.tunnelModel.candidates;
		}

		for (const value of startingCandidates) {
			this.initialCandidates.add(makeAddress(value.host, value.port));
		}
		this.logService.debug(`ForwardedPorts: (ProcForwarding) Initial candidates set to ${startingCandidates.map(candidate => candidate.port).join(', ')}`);
	}

	private async forwardCandidates(): Promise<RemoteTunnel[] | undefined> {
		let attributes: Map<number, Attributes> | undefined;
		const allTunnels: RemoteTunnel[] = [];
		this.logService.trace(`ForwardedPorts: (ProcForwarding) Attempting to forward ${this.remoteExplorerService.tunnelModel.candidates.length} candidates`);
		for (const value of this.remoteExplorerService.tunnelModel.candidates) {
			if (!value.detail) {
				this.logService.trace(`ForwardedPorts: (ProcForwarding) Port ${value.port} missing detail`);
				continue;
			}

			if (!attributes) {
				attributes = await this.remoteExplorerService.tunnelModel.getAttributes(this.remoteExplorerService.tunnelModel.candidates);
			}

			const portAttributes = attributes?.get(value.port);

			const address = makeAddress(value.host, value.port);
			if (this.initialCandidates.has(address) && (portAttributes?.onAutoForward === undefined)) {
				continue;
			}
			if (this.notifiedOnly.has(address) || this.autoForwarded.has(address)) {
				continue;
			}
			const alreadyForwarded = mapHasAddressLocalhostOrAllInterfaces(this.remoteExplorerService.tunnelModel.forwarded, value.host, value.port);
			if (mapHasAddressLocalhostOrAllInterfaces(this.remoteExplorerService.tunnelModel.detected, value.host, value.port)) {
				continue;
			}

			if (portAttributes?.onAutoForward === OnPortForward.Ignore) {
				this.logService.trace(`ForwardedPorts: (ProcForwarding) Port ${value.port} is ignored`);
				continue;
			}
			const forwarded = await this.remoteExplorerService.forward({ remote: value, source: AutoTunnelSource }, portAttributes ?? null);
			if (!alreadyForwarded && forwarded) {
				this.logService.trace(`ForwardedPorts: (ProcForwarding) Port ${value.port} has been forwarded`);
				this.autoForwarded.add(address);
			} else if (forwarded) {
				this.logService.trace(`ForwardedPorts: (ProcForwarding) Port ${value.port} has been notified`);
				this.notifiedOnly.add(address);
			}
			if (forwarded && (typeof forwarded !== 'string')) {
				allTunnels.push(forwarded);
			}
		}
		this.logService.trace(`ForwardedPorts: (ProcForwarding) Forwarded ${allTunnels.length} candidates`);
		if (allTunnels.length === 0) {
			return undefined;
		}
		return allTunnels;
	}

	private async handleCandidateUpdate(removed: Map<string, { host: string; port: number }>) {
		const removedPorts: number[] = [];
		let autoForwarded: Map<string, string | Tunnel>;
		if (this.unforwardOnly) {
			autoForwarded = new Map();
			for (const entry of this.remoteExplorerService.tunnelModel.forwarded.entries()) {
				if (entry[1].source.source === TunnelSource.Auto) {
					autoForwarded.set(entry[0], entry[1]);
				}
			}
		} else {
			autoForwarded = new Map(this.autoForwarded.entries());
		}

		for (const removedPort of removed) {
			const key = removedPort[0];
			let value = removedPort[1];
			const forwardedValue = mapHasAddressLocalhostOrAllInterfaces(autoForwarded, value.host, value.port);
			if (forwardedValue) {
				if (typeof forwardedValue === 'string') {
					this.autoForwarded.delete(key);
				} else {
					value = { host: forwardedValue.remoteHost, port: forwardedValue.remotePort };
				}
				await this.remoteExplorerService.close(value, TunnelCloseReason.AutoForwardEnd);
				removedPorts.push(value.port);
			} else if (this.notifiedOnly.delete(key)) {
				removedPorts.push(value.port);
			} else {
				this.initialCandidates.delete(key);
			}
		}

		if (this.unforwardOnly) {
			return;
		}

		if (removedPorts.length > 0) {
			await this.notifier.hide(removedPorts);
		}

		const tunnels = await this.forwardCandidates();
		if (tunnels) {
			await this.notifier.doAction(tunnels);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/remote/browser/remoteIcons.ts]---
Location: vscode-main/src/vs/workbench/contrib/remote/browser/remoteIcons.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';

import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';

export const getStartedIcon = registerIcon('remote-explorer-get-started', Codicon.star, nls.localize('getStartedIcon', 'Getting started icon in the remote explorer view.'));
export const documentationIcon = registerIcon('remote-explorer-documentation', Codicon.book, nls.localize('documentationIcon', 'Documentation icon in the remote explorer view.'));
export const feedbackIcon = registerIcon('remote-explorer-feedback', Codicon.twitter, nls.localize('feedbackIcon', 'Feedback icon in the remote explorer view.'));
export const reviewIssuesIcon = registerIcon('remote-explorer-review-issues', Codicon.issues, nls.localize('reviewIssuesIcon', 'Review issue icon in the remote explorer view.'));
export const reportIssuesIcon = registerIcon('remote-explorer-report-issues', Codicon.comment, nls.localize('reportIssuesIcon', 'Report issue icon in the remote explorer view.'));
export const remoteExplorerViewIcon = registerIcon('remote-explorer-view-icon', Codicon.remoteExplorer, nls.localize('remoteExplorerViewIcon', 'View icon of the remote explorer view.'));

export const portsViewIcon = registerIcon('ports-view-icon', Codicon.plug, nls.localize('portsViewIcon', 'View icon of the remote ports view.'));
export const portIcon = registerIcon('ports-view-icon', Codicon.plug, nls.localize('portIcon', 'Icon representing a remote port.'));
export const privatePortIcon = registerIcon('private-ports-view-icon', Codicon.lock, nls.localize('privatePortIcon', 'Icon representing a private remote port.'));

export const forwardPortIcon = registerIcon('ports-forward-icon', Codicon.plus, nls.localize('forwardPortIcon', 'Icon for the forward action.'));
export const stopForwardIcon = registerIcon('ports-stop-forward-icon', Codicon.x, nls.localize('stopForwardIcon', 'Icon for the stop forwarding action.'));
export const openBrowserIcon = registerIcon('ports-open-browser-icon', Codicon.globe, nls.localize('openBrowserIcon', 'Icon for the open browser action.'));
export const openPreviewIcon = registerIcon('ports-open-preview-icon', Codicon.openPreview, nls.localize('openPreviewIcon', 'Icon for the open preview action.'));
export const copyAddressIcon = registerIcon('ports-copy-address-icon', Codicon.clippy, nls.localize('copyAddressIcon', 'Icon for the copy local address action.'));
export const labelPortIcon = registerIcon('ports-label-icon', Codicon.tag, nls.localize('labelPortIcon', 'Icon for the label port action.'));
export const forwardedPortWithoutProcessIcon = registerIcon('ports-forwarded-without-process-icon', Codicon.circleOutline, nls.localize('forwardedPortWithoutProcessIcon', 'Icon for forwarded ports that don\'t have a running process.'));
export const forwardedPortWithProcessIcon = registerIcon('ports-forwarded-with-process-icon', Codicon.circleFilled, nls.localize('forwardedPortWithProcessIcon', 'Icon for forwarded ports that do have a running process.'));
```

--------------------------------------------------------------------------------

````
