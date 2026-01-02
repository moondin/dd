---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 427
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 427 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/browser/viewParts/notebookViewZones.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewParts/notebookViewZones.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FastDomNode, createFastDomNode } from '../../../../../base/browser/fastDomNode.js';
import { onUnexpectedError } from '../../../../../base/common/errors.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { localize2 } from '../../../../../nls.js';
import { Categories } from '../../../../../platform/action/common/actionCommonCategories.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { IsDevelopmentContext } from '../../../../../platform/contextkey/common/contextkeys.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { getNotebookEditorFromEditorPane, INotebookViewCellsUpdateEvent, INotebookViewZone, INotebookViewZoneChangeAccessor } from '../notebookBrowser.js';
import { NotebookCellListView } from '../view/notebookCellListView.js';
import { ICoordinatesConverter } from '../view/notebookRenderingCommon.js';
import { CellViewModel } from '../viewModel/notebookViewModelImpl.js';

const invalidFunc = () => { throw new Error(`Invalid notebook view zone change accessor`); };

interface IZoneWidget {
	whitespaceId: string;
	isInHiddenArea: boolean;
	zone: INotebookViewZone;
	domNode: FastDomNode<HTMLElement>;
}

export class NotebookViewZones extends Disposable {
	private _zones: { [key: string]: IZoneWidget };
	public domNode: FastDomNode<HTMLElement>;

	constructor(private readonly listView: NotebookCellListView<CellViewModel>, private readonly coordinator: ICoordinatesConverter) {
		super();
		this.domNode = createFastDomNode(document.createElement('div'));
		this.domNode.setClassName('view-zones');
		this.domNode.setPosition('absolute');
		this.domNode.setAttribute('role', 'presentation');
		this.domNode.setAttribute('aria-hidden', 'true');
		this.domNode.setWidth('100%');
		this._zones = {};

		this.listView.containerDomNode.appendChild(this.domNode.domNode);
	}

	changeViewZones(callback: (changeAccessor: INotebookViewZoneChangeAccessor) => void): boolean {
		let zonesHaveChanged = false;
		const changeAccessor: INotebookViewZoneChangeAccessor = {
			addZone: (zone: INotebookViewZone): string => {
				zonesHaveChanged = true;
				return this._addZone(zone);
			},
			removeZone: (id: string): void => {
				zonesHaveChanged = true;
				// TODO: validate if zones have changed layout
				this._removeZone(id);
			},
			layoutZone: (id: string): void => {
				zonesHaveChanged = true;
				// TODO: validate if zones have changed layout
				this._layoutZone(id);
			}
		};

		safeInvoke1Arg(callback, changeAccessor);

		// Invalidate changeAccessor
		changeAccessor.addZone = invalidFunc;
		changeAccessor.removeZone = invalidFunc;
		changeAccessor.layoutZone = invalidFunc;

		return zonesHaveChanged;
	}

	getViewZoneLayoutInfo(viewZoneId: string): { height: number; top: number } | null {
		const zoneWidget = this._zones[viewZoneId];
		if (!zoneWidget) {
			return null;
		}
		const top = this.listView.getWhitespacePosition(zoneWidget.whitespaceId);
		const height = zoneWidget.zone.heightInPx;
		return { height: height, top: top };
	}

	onCellsChanged(e: INotebookViewCellsUpdateEvent): void {
		const splices = e.splices.slice().reverse();
		splices.forEach(splice => {
			const [start, deleted, newCells] = splice;
			const fromIndex = start;
			const toIndex = start + deleted;

			// 1, 2, 0
			// delete cell index 1 and 2
			// from index 1, to index 3 (exclusive): [1, 3)
			// if we have whitespace afterModelPosition 3, which is after cell index 2

			for (const id in this._zones) {
				const zone = this._zones[id].zone;

				const cellBeforeWhitespaceIndex = zone.afterModelPosition - 1;

				if (cellBeforeWhitespaceIndex >= fromIndex && cellBeforeWhitespaceIndex < toIndex) {
					// The cell this whitespace was after has been deleted
					//  => move whitespace to before first deleted cell
					zone.afterModelPosition = fromIndex;
					this._updateWhitespace(this._zones[id]);
				} else if (cellBeforeWhitespaceIndex >= toIndex) {
					// adjust afterModelPosition for all other cells
					const insertLength = newCells.length;
					const offset = insertLength - deleted;
					zone.afterModelPosition += offset;
					this._updateWhitespace(this._zones[id]);
				}
			}
		});
	}

	onHiddenRangesChange() {
		for (const id in this._zones) {
			this._updateWhitespace(this._zones[id]);
		}
	}

	private _updateWhitespace(zone: IZoneWidget) {
		const whitespaceId = zone.whitespaceId;
		const viewPosition = this.coordinator.convertModelIndexToViewIndex(zone.zone.afterModelPosition);
		const isInHiddenArea = this._isInHiddenRanges(zone.zone);
		zone.isInHiddenArea = isInHiddenArea;
		this.listView.changeOneWhitespace(whitespaceId, viewPosition, isInHiddenArea ? 0 : zone.zone.heightInPx);
	}

	layout() {
		for (const id in this._zones) {
			this._layoutZone(id);
		}
	}

	private _addZone(zone: INotebookViewZone): string {
		const viewPosition = this.coordinator.convertModelIndexToViewIndex(zone.afterModelPosition);
		const whitespaceId = this.listView.insertWhitespace(viewPosition, zone.heightInPx);
		const isInHiddenArea = this._isInHiddenRanges(zone);
		const myZone: IZoneWidget = {
			whitespaceId: whitespaceId,
			zone: zone,
			domNode: createFastDomNode(zone.domNode),
			isInHiddenArea: isInHiddenArea
		};

		this._zones[whitespaceId] = myZone;
		myZone.domNode.setPosition('absolute');
		myZone.domNode.domNode.style.width = '100%';
		myZone.domNode.setDisplay('none');
		myZone.domNode.setAttribute('notebook-view-zone', whitespaceId);
		this.domNode.appendChild(myZone.domNode);
		return whitespaceId;
	}

	private _removeZone(id: string): void {
		this.listView.removeWhitespace(id);
		const zoneWidget = this._zones[id];
		if (zoneWidget) {
			// safely remove the dom node from its parent
			try {
				this.domNode.removeChild(zoneWidget.domNode);
			} catch {
				// ignore the error
			}
		}

		delete this._zones[id];
	}

	private _layoutZone(id: string): void {
		const zoneWidget = this._zones[id];
		if (!zoneWidget) {
			return;
		}

		this._updateWhitespace(this._zones[id]);

		const isInHiddenArea = this._isInHiddenRanges(zoneWidget.zone);

		if (isInHiddenArea) {
			zoneWidget.domNode.setDisplay('none');
		} else {
			const top = this.listView.getWhitespacePosition(zoneWidget.whitespaceId);
			zoneWidget.domNode.setTop(top);
			zoneWidget.domNode.setDisplay('block');
			zoneWidget.domNode.setHeight(zoneWidget.zone.heightInPx);
		}
	}

	private _isInHiddenRanges(zone: INotebookViewZone) {
		// The view zone is between two cells (zone.afterModelPosition - 1, zone.afterModelPosition)
		const afterIndex = zone.afterModelPosition;

		// In notebook, the first cell (markdown cell) in a folding range is always visible, so we need to check the cell after the notebook view zone
		return !this.coordinator.modelIndexIsVisible(afterIndex);

	}

	override dispose(): void {
		super.dispose();
		this._zones = {};
	}
}

function safeInvoke1Arg(func: Function, arg1: unknown): void {
	try {
		func(arg1);
	} catch (e) {
		onUnexpectedError(e);
	}
}

class ToggleNotebookViewZoneDeveloperAction extends Action2 {
	static viewZoneIds: string[] = [];
	constructor() {
		super({
			id: 'notebook.developer.addViewZones',
			title: localize2('workbench.notebook.developer.addViewZones', "Toggle Notebook View Zones"),
			category: Categories.Developer,
			precondition: IsDevelopmentContext,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);

		if (!editor) {
			return;
		}

		if (ToggleNotebookViewZoneDeveloperAction.viewZoneIds.length > 0) {
			// remove all view zones
			editor.changeViewZones(accessor => {
				// remove all view zones in reverse order, to follow how we handle this in the prod code
				ToggleNotebookViewZoneDeveloperAction.viewZoneIds.reverse().forEach(id => {
					accessor.removeZone(id);
				});
				ToggleNotebookViewZoneDeveloperAction.viewZoneIds = [];
			});
		} else {
			editor.changeViewZones(accessor => {
				const cells = editor.getCellsInRange();
				if (cells.length === 0) {
					return;
				}

				const viewZoneIds: string[] = [];
				for (let i = 0; i < cells.length; i++) {
					const domNode = document.createElement('div');
					domNode.innerText = `View Zone ${i}`;
					domNode.style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
					const viewZoneId = accessor.addZone({
						afterModelPosition: i,
						heightInPx: 200,
						domNode: domNode,
					});
					viewZoneIds.push(viewZoneId);
				}
				ToggleNotebookViewZoneDeveloperAction.viewZoneIds = viewZoneIds;
			});
		}
	}
}

registerAction2(ToggleNotebookViewZoneDeveloperAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookCellStatusBarService.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookCellStatusBarService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { INotebookCellStatusBarItemList, INotebookCellStatusBarItemProvider } from './notebookCommon.js';

export const INotebookCellStatusBarService = createDecorator<INotebookCellStatusBarService>('notebookCellStatusBarService');

export interface INotebookCellStatusBarService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeProviders: Event<void>;
	readonly onDidChangeItems: Event<void>;

	registerCellStatusBarItemProvider(provider: INotebookCellStatusBarItemProvider): IDisposable;

	getStatusBarItemsForCell(docUri: URI, cellIndex: number, viewType: string, token: CancellationToken): Promise<INotebookCellStatusBarItemList[]>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookCommon.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookCommon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IDiffResult } from '../../../../base/common/diff/diff.js';
import { Event } from '../../../../base/common/event.js';
import * as glob from '../../../../base/common/glob.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { Mimes } from '../../../../base/common/mime.js';
import { Schemas } from '../../../../base/common/network.js';
import { basename } from '../../../../base/common/path.js';
import { isWindows } from '../../../../base/common/platform.js';
import { ISplice } from '../../../../base/common/sequence.js';
import { ThemeColor } from '../../../../base/common/themables.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { Range } from '../../../../editor/common/core/range.js';
import * as editorCommon from '../../../../editor/common/editorCommon.js';
import { Command, WorkspaceEditMetadata } from '../../../../editor/common/languages.js';
import { IReadonlyTextBuffer, ITextModel } from '../../../../editor/common/model.js';
import { IAccessibilityInformation } from '../../../../platform/accessibility/common/accessibility.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { IFileReadLimits } from '../../../../platform/files/common/files.js';
import { UndoRedoGroup } from '../../../../platform/undoRedo/common/undoRedo.js';
import { IRevertOptions, ISaveOptions, IUntypedEditorInput } from '../../../common/editor.js';
import { NotebookTextModel } from './model/notebookTextModel.js';
import { ICellExecutionError } from './notebookExecutionStateService.js';
import { INotebookTextModelLike } from './notebookKernelService.js';
import { ICellRange } from './notebookRange.js';
import { RegisteredEditorPriority } from '../../../services/editor/common/editorResolverService.js';
import { generateMetadataUri, generate as generateUri, extractCellOutputDetails, parseMetadataUri, parse as parseUri } from '../../../services/notebook/common/notebookDocumentService.js';
import { IWorkingCopyBackupMeta, IWorkingCopySaveEvent } from '../../../services/workingCopy/common/workingCopy.js';
import { SnapshotContext } from '../../../services/workingCopy/common/fileWorkingCopy.js';

export const NOTEBOOK_EDITOR_ID = 'workbench.editor.notebook';
export const NOTEBOOK_DIFF_EDITOR_ID = 'workbench.editor.notebookTextDiffEditor';
export const NOTEBOOK_MULTI_DIFF_EDITOR_ID = 'workbench.editor.notebookMultiTextDiffEditor';
export const INTERACTIVE_WINDOW_EDITOR_ID = 'workbench.editor.interactive';
export const REPL_EDITOR_ID = 'workbench.editor.repl';
export const NOTEBOOK_OUTPUT_EDITOR_ID = 'workbench.editor.notebookOutputEditor';

export const EXECUTE_REPL_COMMAND_ID = 'replNotebook.input.execute';

export enum CellKind {
	Markup = 1,
	Code = 2
}

export const NOTEBOOK_DISPLAY_ORDER: readonly string[] = [
	'application/json',
	'application/javascript',
	'text/html',
	'image/svg+xml',
	Mimes.latex,
	Mimes.markdown,
	'image/png',
	'image/jpeg',
	Mimes.text
];

export const ACCESSIBLE_NOTEBOOK_DISPLAY_ORDER: readonly string[] = [
	Mimes.latex,
	Mimes.markdown,
	'application/json',
	'text/html',
	'image/svg+xml',
	'image/png',
	'image/jpeg',
	Mimes.text,
];

/**
 * A mapping of extension IDs who contain renderers, to notebook ids who they
 * should be treated as the same in the renderer selection logic. This is used
 * to prefer the 1st party Jupyter renderers even though they're in a separate
 * extension, for instance. See #136247.
 */
export const RENDERER_EQUIVALENT_EXTENSIONS: ReadonlyMap<string, ReadonlySet<string>> = new Map([
	['ms-toolsai.jupyter', new Set(['jupyter-notebook', 'interactive'])],
	['ms-toolsai.jupyter-renderers', new Set(['jupyter-notebook', 'interactive'])],
]);

export const RENDERER_NOT_AVAILABLE = '_notAvailable';

export type ContributedNotebookRendererEntrypoint = string | { readonly extends: string; readonly path: string };

export enum NotebookRunState {
	Running = 1,
	Idle = 2
}

export type NotebookDocumentMetadata = Record<string, unknown>;

export enum NotebookCellExecutionState {
	Unconfirmed = 1,
	Pending = 2,
	Executing = 3
}
export enum NotebookExecutionState {
	Unconfirmed = 1,
	Pending = 2,
	Executing = 3
}

export interface INotebookCellPreviousExecutionResult {
	executionOrder?: number;
	success?: boolean;
	duration?: number;
}

export interface NotebookCellMetadata {
	/**
	 * custom metadata
	 */
	[key: string]: unknown;
}

export interface NotebookCellInternalMetadata {
	/**
	 * Used only for diffing of Notebooks.
	 * This is not persisted and generally useful only when diffing two notebooks.
	 * Useful only after we've manually matched a few cells together so we know which cells are matching.
	 */
	internalId?: string;
	executionId?: string;
	executionOrder?: number;
	lastRunSuccess?: boolean;
	runStartTime?: number;
	runStartTimeAdjustment?: number;
	runEndTime?: number;
	renderDuration?: { [key: string]: number };
	error?: ICellExecutionError;
}

export interface NotebookCellCollapseState {
	inputCollapsed?: boolean;
	outputCollapsed?: boolean;
}

export interface NotebookCellDefaultCollapseConfig {
	codeCell?: NotebookCellCollapseState;
	markupCell?: NotebookCellCollapseState;
}

export type InteractiveWindowCollapseCodeCells = 'always' | 'never' | 'fromEditor';

export type TransientCellMetadata = { readonly [K in keyof NotebookCellMetadata]?: boolean };
export type CellContentMetadata = { readonly [K in keyof NotebookCellMetadata]?: boolean };
export type TransientDocumentMetadata = { readonly [K in keyof NotebookDocumentMetadata]?: boolean };

export interface TransientOptions {
	readonly transientOutputs: boolean;
	readonly transientCellMetadata: TransientCellMetadata;
	readonly transientDocumentMetadata: TransientDocumentMetadata;
	readonly cellContentMetadata: CellContentMetadata;
}

/** Note: enum values are used for sorting */
export const enum NotebookRendererMatch {
	/** Renderer has a hard dependency on an available kernel */
	WithHardKernelDependency = 0,
	/** Renderer works better with an available kernel */
	WithOptionalKernelDependency = 1,
	/** Renderer is kernel-agnostic */
	Pure = 2,
	/** Renderer is for a different mimeType or has a hard dependency which is unsatisfied */
	Never = 3,
}

/**
 * Renderer messaging requirement. While this allows for 'optional' messaging,
 * VS Code effectively treats it the same as true right now. "Partial
 * activation" of extensions is a very tricky problem, which could allow
 * solving this. But for now, optional is mostly only honored for aznb.
 */
export const enum RendererMessagingSpec {
	Always = 'always',
	Never = 'never',
	Optional = 'optional',
}

export type NotebookRendererEntrypoint = { readonly extends: string | undefined; readonly path: URI };

export interface INotebookRendererInfo {
	readonly id: string;
	readonly displayName: string;
	readonly entrypoint: NotebookRendererEntrypoint;
	readonly extensionLocation: URI;
	readonly extensionId: ExtensionIdentifier;
	readonly messaging: RendererMessagingSpec;

	readonly mimeTypes: readonly string[];

	readonly isBuiltin: boolean;

	matchesWithoutKernel(mimeType: string): NotebookRendererMatch;
	matches(mimeType: string, kernelProvides: ReadonlyArray<string>): NotebookRendererMatch;
}

export interface INotebookStaticPreloadInfo {
	readonly type: string;
	readonly entrypoint: URI;
	readonly extensionLocation: URI;
	readonly localResourceRoots: readonly URI[];
}

export interface IOrderedMimeType {
	mimeType: string;
	rendererId: string;
	isTrusted: boolean;
}

export interface IOutputItemDto {
	readonly mime: string;
	readonly data: VSBuffer;
}

export interface IOutputDto {
	outputs: IOutputItemDto[];
	outputId: string;
	metadata?: Record<string, any>;
}

export interface ICellOutput {
	readonly versionId: number;
	outputs: IOutputItemDto[];
	metadata?: Record<string, any>;
	outputId: string;
	/**
	 * Alternative output id that's reused when the output is updated.
	 */
	alternativeOutputId: string;
	readonly onDidChangeData: Event<void>;
	replaceData(items: IOutputDto): void;
	appendData(items: IOutputItemDto[]): void;
	appendedSinceVersion(versionId: number, mime: string): VSBuffer | undefined;
	asDto(): IOutputDto;
	bumpVersion(): void;
	dispose(): void;
}

export interface CellInternalMetadataChangedEvent {
	readonly lastRunSuccessChanged?: boolean;
}

export interface INotebookDocumentMetadataTextModel {
	/**
	 * Notebook Metadata Uri.
	 */
	readonly uri: URI;
	/**
	 * Triggered when the Notebook Metadata changes.
	 */
	readonly onDidChange: Event<void>;
	readonly metadata: Readonly<NotebookDocumentMetadata>;
	readonly textBuffer: IReadonlyTextBuffer;
	/**
	 * Text representation of the Notebook Metadata
	 */
	getValue(): string;
	getHash(): string;
}

export interface ICell {
	readonly uri: URI;
	handle: number;
	language: string;
	cellKind: CellKind;
	outputs: ICellOutput[];
	metadata: NotebookCellMetadata;
	internalMetadata: NotebookCellInternalMetadata;
	getHashValue(): number;
	textBuffer: IReadonlyTextBuffer;
	textModel?: ITextModel;
	readonly onDidChangeTextModel: Event<void>;
	getValue(): string;
	readonly onDidChangeOutputs?: Event<NotebookCellOutputsSplice>;
	readonly onDidChangeOutputItems?: Event<void>;
	readonly onDidChangeLanguage: Event<string>;
	readonly onDidChangeMetadata: Event<void>;
	readonly onDidChangeInternalMetadata: Event<CellInternalMetadataChangedEvent>;
}

export interface INotebookSnapshotOptions {
	context: SnapshotContext;
	outputSizeLimit: number;
	transientOptions?: TransientOptions;
}

export interface INotebookTextModel extends INotebookTextModelLike, IDisposable {
	readonly notebookType: string;
	readonly viewType: string;
	metadata: NotebookDocumentMetadata;
	readonly transientOptions: TransientOptions;
	readonly uri: URI;
	readonly versionId: number;
	readonly length: number;
	readonly cells: readonly ICell[];
	reset(cells: ICellDto2[], metadata: NotebookDocumentMetadata, transientOptions: TransientOptions): void;
	createSnapshot(options: INotebookSnapshotOptions): NotebookData;
	restoreSnapshot(snapshot: NotebookData, transientOptions?: TransientOptions): void;
	applyEdits(rawEdits: ICellEditOperation[], synchronous: boolean, beginSelectionState: ISelectionState | undefined, endSelectionsComputer: () => ISelectionState | undefined, undoRedoGroup: UndoRedoGroup | undefined, computeUndoRedo?: boolean): boolean;
	readonly onDidChangeContent: Event<NotebookTextModelChangedEvent>;
	readonly onWillDispose: Event<void>;
}

export type NotebookCellTextModelSplice<T> = [
	start: number,
	deleteCount: number,
	newItems: T[]
];

export type NotebookCellOutputsSplice = {
	start: number /* start */;
	deleteCount: number /* delete count */;
	newOutputs: ICellOutput[];
};

export interface IMainCellDto {
	handle: number;
	url: string;
	source: string[];
	eol: string;
	versionId: number;
	language: string;
	cellKind: CellKind;
	outputs: IOutputDto[];
	metadata?: NotebookCellMetadata;
	internalMetadata?: NotebookCellInternalMetadata;
}

export enum NotebookCellsChangeType {
	ModelChange = 1,
	Move = 2,
	ChangeCellLanguage = 5,
	Initialize = 6,
	ChangeCellMetadata = 7,
	Output = 8,
	OutputItem = 9,
	ChangeCellContent = 10,
	ChangeDocumentMetadata = 11,
	ChangeCellInternalMetadata = 12,
	ChangeCellMime = 13,
	Unknown = 100
}

export interface NotebookCellsInitializeEvent<T> {
	readonly kind: NotebookCellsChangeType.Initialize;
	readonly changes: NotebookCellTextModelSplice<T>[];
}

export interface NotebookCellContentChangeEvent {
	readonly kind: NotebookCellsChangeType.ChangeCellContent;
	readonly index: number;
}

export interface NotebookCellsModelChangedEvent<T> {
	readonly kind: NotebookCellsChangeType.ModelChange;
	readonly changes: NotebookCellTextModelSplice<T>[];
}

export interface NotebookCellsModelMoveEvent<T> {
	readonly kind: NotebookCellsChangeType.Move;
	readonly index: number;
	readonly length: number;
	readonly newIdx: number;
	readonly cells: T[];
}

export interface NotebookOutputChangedEvent {
	readonly kind: NotebookCellsChangeType.Output;
	readonly index: number;
	readonly outputs: IOutputDto[];
	readonly append: boolean;
}

export interface NotebookOutputItemChangedEvent {
	readonly kind: NotebookCellsChangeType.OutputItem;
	readonly index: number;
	readonly outputId: string;
	readonly outputItems: IOutputItemDto[];
	readonly append: boolean;
}

export interface NotebookCellsChangeLanguageEvent {
	readonly kind: NotebookCellsChangeType.ChangeCellLanguage;
	readonly index: number;
	readonly language: string;
}

export interface NotebookCellsChangeMimeEvent {
	readonly kind: NotebookCellsChangeType.ChangeCellMime;
	readonly index: number;
	readonly mime: string | undefined;
}

export interface NotebookCellsChangeMetadataEvent {
	readonly kind: NotebookCellsChangeType.ChangeCellMetadata;
	readonly index: number;
	readonly metadata: NotebookCellMetadata;
}

export interface NotebookCellsChangeInternalMetadataEvent {
	readonly kind: NotebookCellsChangeType.ChangeCellInternalMetadata;
	readonly index: number;
	readonly internalMetadata: NotebookCellInternalMetadata;
}

export interface NotebookDocumentChangeMetadataEvent {
	readonly kind: NotebookCellsChangeType.ChangeDocumentMetadata;
	readonly metadata: NotebookDocumentMetadata;
}

export interface NotebookDocumentUnknownChangeEvent {
	readonly kind: NotebookCellsChangeType.Unknown;
}

export type NotebookRawContentEventDto = NotebookCellsInitializeEvent<IMainCellDto> | NotebookDocumentChangeMetadataEvent | NotebookCellContentChangeEvent | NotebookCellsModelChangedEvent<IMainCellDto> | NotebookCellsModelMoveEvent<IMainCellDto> | NotebookOutputChangedEvent | NotebookOutputItemChangedEvent | NotebookCellsChangeLanguageEvent | NotebookCellsChangeMimeEvent | NotebookCellsChangeMetadataEvent | NotebookCellsChangeInternalMetadataEvent | NotebookDocumentUnknownChangeEvent;

export type NotebookCellsChangedEventDto = {
	readonly rawEvents: NotebookRawContentEventDto[];
	readonly versionId: number;
};

export type NotebookRawContentEvent = (NotebookCellsInitializeEvent<ICell> | NotebookDocumentChangeMetadataEvent | NotebookCellContentChangeEvent | NotebookCellsModelChangedEvent<ICell> | NotebookCellsModelMoveEvent<ICell> | NotebookOutputChangedEvent | NotebookOutputItemChangedEvent | NotebookCellsChangeLanguageEvent | NotebookCellsChangeMimeEvent | NotebookCellsChangeMetadataEvent | NotebookCellsChangeInternalMetadataEvent | NotebookDocumentUnknownChangeEvent) & { transient: boolean };

export enum SelectionStateType {
	Handle = 0,
	Index = 1
}

export interface ISelectionHandleState {
	kind: SelectionStateType.Handle;
	primary: number | null;
	selections: number[];
}

export interface ISelectionIndexState {
	kind: SelectionStateType.Index;
	focus: ICellRange;
	selections: ICellRange[];
}

export type ISelectionState = ISelectionHandleState | ISelectionIndexState;

export type NotebookTextModelChangedEvent = {
	readonly rawEvents: NotebookRawContentEvent[];
	readonly versionId: number;
	readonly synchronous: boolean | undefined;
	readonly endSelectionState: ISelectionState | undefined;
};

export type NotebookTextModelWillAddRemoveEvent = {
	readonly rawEvent: NotebookCellsModelChangedEvent<ICell>;
};

export const enum CellEditType {
	Replace = 1,
	Output = 2,
	Metadata = 3,
	CellLanguage = 4,
	DocumentMetadata = 5,
	Move = 6,
	OutputItems = 7,
	PartialMetadata = 8,
	PartialInternalMetadata = 9,
}

export interface ICellDto2 {
	source: string;
	language: string;
	mime: string | undefined;
	cellKind: CellKind;
	outputs: IOutputDto[];
	metadata?: NotebookCellMetadata;
	internalMetadata?: NotebookCellInternalMetadata;
	collapseState?: NotebookCellCollapseState;
}

export interface ICellReplaceEdit {
	editType: CellEditType.Replace;
	index: number;
	count: number;
	cells: ICellDto2[];
}

export interface ICellOutputEdit {
	editType: CellEditType.Output;
	index: number;
	outputs: IOutputDto[];
	append?: boolean;
}

export interface ICellOutputEditByHandle {
	editType: CellEditType.Output;
	handle: number;
	outputs: IOutputDto[];
	append?: boolean;
}

export interface ICellOutputItemEdit {
	editType: CellEditType.OutputItems;
	outputId: string;
	items: IOutputItemDto[];
	append?: boolean;
}

export interface ICellMetadataEdit {
	editType: CellEditType.Metadata;
	index: number;
	metadata: NotebookCellMetadata;
}

// These types are nullable because we need to use 'null' on the EH side so it is JSON-stringified
export type NullablePartialNotebookCellMetadata = {
	[Key in keyof Partial<NotebookCellMetadata>]: NotebookCellMetadata[Key] | null
};

export interface ICellPartialMetadataEdit {
	editType: CellEditType.PartialMetadata;
	index: number;
	metadata: NullablePartialNotebookCellMetadata;
}

export interface ICellPartialMetadataEditByHandle {
	editType: CellEditType.PartialMetadata;
	handle: number;
	metadata: NullablePartialNotebookCellMetadata;
}

export type NullablePartialNotebookCellInternalMetadata = {
	[Key in keyof Partial<NotebookCellInternalMetadata>]: NotebookCellInternalMetadata[Key] | null
};
export interface ICellPartialInternalMetadataEdit {
	editType: CellEditType.PartialInternalMetadata;
	index: number;
	internalMetadata: NullablePartialNotebookCellInternalMetadata;
}

export interface ICellPartialInternalMetadataEditByHandle {
	editType: CellEditType.PartialInternalMetadata;
	handle: number;
	internalMetadata: NullablePartialNotebookCellInternalMetadata;
}

export interface ICellLanguageEdit {
	editType: CellEditType.CellLanguage;
	index: number;
	language: string;
}

export interface IDocumentMetadataEdit {
	editType: CellEditType.DocumentMetadata;
	metadata: NotebookDocumentMetadata;
}

export interface ICellMoveEdit {
	editType: CellEditType.Move;
	index: number;
	length: number;
	newIdx: number;
}

export type IImmediateCellEditOperation = ICellOutputEditByHandle | ICellPartialMetadataEditByHandle | ICellOutputItemEdit | ICellPartialInternalMetadataEdit | ICellPartialInternalMetadataEditByHandle | ICellPartialMetadataEdit;
export type ICellEditOperation = IImmediateCellEditOperation | ICellReplaceEdit | ICellOutputEdit | ICellMetadataEdit | ICellPartialMetadataEdit | ICellPartialInternalMetadataEdit | IDocumentMetadataEdit | ICellMoveEdit | ICellOutputItemEdit | ICellLanguageEdit;


export interface IWorkspaceNotebookCellEdit {
	metadata?: WorkspaceEditMetadata;
	resource: URI;
	notebookVersionId: number | undefined;
	cellEdit: ICellPartialMetadataEdit | IDocumentMetadataEdit | ICellReplaceEdit;
}

export interface IWorkspaceNotebookCellEditDto {
	metadata?: WorkspaceEditMetadata;
	resource: URI;
	notebookVersionId: number | undefined;
	cellEdit: ICellPartialMetadataEdit | IDocumentMetadataEdit | ICellReplaceEdit;
}

export interface NotebookData {
	readonly cells: ICellDto2[];
	readonly metadata: NotebookDocumentMetadata;
}


export interface INotebookContributionData {
	extension?: ExtensionIdentifier;
	providerDisplayName: string;
	displayName: string;
	filenamePattern: (string | glob.IRelativePattern | INotebookExclusiveDocumentFilter)[];
	priority?: RegisteredEditorPriority;
}

export namespace NotebookMetadataUri {
	export const scheme = Schemas.vscodeNotebookMetadata;
	export function generate(notebook: URI): URI {
		return generateMetadataUri(notebook);
	}
	export function parse(metadata: URI): URI | undefined {
		return parseMetadataUri(metadata);
	}
}

export namespace CellUri {
	export const scheme = Schemas.vscodeNotebookCell;
	export function generate(notebook: URI, handle: number): URI {
		return generateUri(notebook, handle);
	}

	export function parse(cell: URI): { notebook: URI; handle: number } | undefined {
		return parseUri(cell);
	}

	/**
	 * Generates a URI for a cell output in a notebook using the output ID.
	 * Used when URI should be opened as text in the editor.
	 */
	export function generateCellOutputUriWithId(notebook: URI, outputId?: string) {
		return notebook.with({
			scheme: Schemas.vscodeNotebookCellOutput,
			query: new URLSearchParams({
				openIn: 'editor',
				outputId: outputId ?? '',
				notebookScheme: notebook.scheme !== Schemas.file ? notebook.scheme : '',
			}).toString()
		});
	}
	/**
	 * Generates a URI for a cell output in a notebook using the output index.
	 * Used when URI should be opened in notebook editor.
	 */
	export function generateCellOutputUriWithIndex(notebook: URI, cellUri: URI, outputIndex: number): URI {
		return notebook.with({
			scheme: Schemas.vscodeNotebookCellOutput,
			fragment: cellUri.fragment,
			query: new URLSearchParams({
				openIn: 'notebook',
				outputIndex: String(outputIndex),
			}).toString()
		});
	}

	export function generateOutputEditorUri(notebook: URI, cellId: string, cellIndex: number, outputId: string, outputIndex: number): URI {
		return notebook.with({
			scheme: Schemas.vscodeNotebookCellOutput,
			query: new URLSearchParams({
				openIn: 'notebookOutputEditor',
				notebook: notebook.toString(),
				cellIndex: String(cellIndex),
				outputId: outputId,
				outputIndex: String(outputIndex),
			}).toString()
		});
	}

	export function parseCellOutputUri(uri: URI): { notebook: URI; openIn: string; outputId?: string; cellFragment?: string; outputIndex?: number; cellHandle?: number; cellIndex?: number } | undefined {
		return extractCellOutputDetails(uri);
	}

	export function generateCellPropertyUri(notebook: URI, handle: number, scheme: string): URI {
		return CellUri.generate(notebook, handle).with({ scheme: scheme });
	}

	export function parseCellPropertyUri(uri: URI, propertyScheme: string) {
		if (uri.scheme !== propertyScheme) {
			return undefined;
		}

		return CellUri.parse(uri.with({ scheme: scheme }));
	}
}

const normalizeSlashes = (str: string) => isWindows ? str.replace(/\//g, '\\') : str;

interface IMimeTypeWithMatcher {
	pattern: string;
	matches: glob.ParsedPattern;
}

export class MimeTypeDisplayOrder {
	private readonly order: IMimeTypeWithMatcher[];

	constructor(
		initialValue: readonly string[] = [],
		private readonly defaultOrder = NOTEBOOK_DISPLAY_ORDER,
	) {
		this.order = [...new Set(initialValue)].map(pattern => ({
			pattern,
			matches: glob.parse(normalizeSlashes(pattern), { ignoreCase: true })
		}));
	}

	/**
	 * Returns a sorted array of the input mimeTypes.
	 */
	public sort(mimeTypes: Iterable<string>): string[] {
		const remaining = new Map(Iterable.map(mimeTypes, m => [m, normalizeSlashes(m)]));
		let sorted: string[] = [];

		for (const { matches } of this.order) {
			for (const [original, normalized] of remaining) {
				if (matches(normalized)) {
					sorted.push(original);
					remaining.delete(original);
					break;
				}
			}
		}

		if (remaining.size) {
			sorted = sorted.concat([...remaining.keys()].sort(
				(a, b) => this.defaultOrder.indexOf(a) - this.defaultOrder.indexOf(b),
			));
		}

		return sorted;
	}

	/**
	 * Records that the user selected the given mimetype over the other
	 * possible mimeTypes, prioritizing it for future reference.
	 */
	public prioritize(chosenMimetype: string, otherMimeTypes: readonly string[]) {
		const chosenIndex = this.findIndex(chosenMimetype);
		if (chosenIndex === -1) {
			// always first, nothing more to do
			this.order.unshift({ pattern: chosenMimetype, matches: glob.parse(normalizeSlashes(chosenMimetype), { ignoreCase: true }) });
			return;
		}

		// Get the other mimeTypes that are before the chosenMimetype. Then, move
		// them after it, retaining order.
		const uniqueIndices = new Set(otherMimeTypes.map(m => this.findIndex(m, chosenIndex)));
		uniqueIndices.delete(-1);
		const otherIndices = Array.from(uniqueIndices).sort();
		this.order.splice(chosenIndex + 1, 0, ...otherIndices.map(i => this.order[i]));

		for (let oi = otherIndices.length - 1; oi >= 0; oi--) {
			this.order.splice(otherIndices[oi], 1);
		}
	}

	/**
	 * Gets an array of in-order mimetype preferences.
	 */
	public toArray() {
		return this.order.map(o => o.pattern);
	}

	private findIndex(mimeType: string, maxIndex = this.order.length) {
		const normalized = normalizeSlashes(mimeType);
		for (let i = 0; i < maxIndex; i++) {
			if (this.order[i].matches(normalized)) {
				return i;
			}
		}

		return -1;
	}
}

interface IMutableSplice<T> extends ISplice<T> {
	readonly toInsert: T[];
	deleteCount: number;
}

export function diff<T>(before: T[], after: T[], contains: (a: T) => boolean, equal: (a: T, b: T) => boolean = (a: T, b: T) => a === b): ISplice<T>[] {
	const result: IMutableSplice<T>[] = [];

	function pushSplice(start: number, deleteCount: number, toInsert: T[]): void {
		if (deleteCount === 0 && toInsert.length === 0) {
			return;
		}

		const latest = result[result.length - 1];

		if (latest && latest.start + latest.deleteCount === start) {
			latest.deleteCount += deleteCount;
			latest.toInsert.push(...toInsert);
		} else {
			result.push({ start, deleteCount, toInsert });
		}
	}

	let beforeIdx = 0;
	let afterIdx = 0;

	while (true) {
		if (beforeIdx === before.length) {
			pushSplice(beforeIdx, 0, after.slice(afterIdx));
			break;
		}

		if (afterIdx === after.length) {
			pushSplice(beforeIdx, before.length - beforeIdx, []);
			break;
		}

		const beforeElement = before[beforeIdx];
		const afterElement = after[afterIdx];

		if (equal(beforeElement, afterElement)) {
			// equal
			beforeIdx += 1;
			afterIdx += 1;
			continue;
		}

		if (contains(afterElement)) {
			// `afterElement` exists before, which means some elements before `afterElement` are deleted
			pushSplice(beforeIdx, 1, []);
			beforeIdx += 1;
		} else {
			// `afterElement` added
			pushSplice(beforeIdx, 0, [afterElement]);
			afterIdx += 1;
		}
	}

	return result;
}

export interface ICellEditorViewState {
	selections: editorCommon.ICursorState[];
}

export const NOTEBOOK_EDITOR_CURSOR_BOUNDARY = new RawContextKey<'none' | 'top' | 'bottom' | 'both'>('notebookEditorCursorAtBoundary', 'none');

export const NOTEBOOK_EDITOR_CURSOR_LINE_BOUNDARY = new RawContextKey<'none' | 'start' | 'end' | 'both'>('notebookEditorCursorAtLineBoundary', 'none');

export interface INotebookLoadOptions {
	/**
	 * Go to disk bypassing any cache of the model if any.
	 */
	forceReadFromFile?: boolean;
	/**
	 * If provided, the size of the file will be checked against the limits
	 * and an error will be thrown if any limit is exceeded.
	 */
	readonly limits?: IFileReadLimits;
}

export type NotebookEditorModelCreationOptions = {
	limits?: IFileReadLimits;
	scratchpad?: boolean;
	viewType?: string;
};

export interface IResolvedNotebookEditorModel extends INotebookEditorModel {
	notebook: NotebookTextModel;
}

export interface INotebookEditorModel extends IDisposable {
	readonly onDidChangeDirty: Event<void>;
	readonly onDidSave: Event<IWorkingCopySaveEvent>;
	readonly onDidChangeOrphaned: Event<void>;
	readonly onDidChangeReadonly: Event<void>;
	readonly onDidRevertUntitled: Event<void>;
	readonly resource: URI;
	readonly viewType: string;
	readonly notebook: INotebookTextModel | undefined;
	readonly hasErrorState: boolean;
	isResolved(): boolean;
	isDirty(): boolean;
	isModified(): boolean;
	isReadonly(): boolean | IMarkdownString;
	isOrphaned(): boolean;
	hasAssociatedFilePath(): boolean;
	load(options?: INotebookLoadOptions): Promise<IResolvedNotebookEditorModel>;
	save(options?: ISaveOptions): Promise<boolean>;
	saveAs(target: URI): Promise<IUntypedEditorInput | undefined>;
	revert(options?: IRevertOptions): Promise<void>;
}

export interface INotebookDiffEditorModel extends IDisposable {
	original: { notebook: NotebookTextModel; resource: URI; viewType: string };
	modified: { notebook: NotebookTextModel; resource: URI; viewType: string };
}

export interface NotebookDocumentBackupData extends IWorkingCopyBackupMeta {
	readonly viewType: string;
	readonly backupId?: string;
	readonly mtime?: number;
}

export enum NotebookEditorPriority {
	default = 'default',
	option = 'option',
}

export interface INotebookFindOptions {
	regex?: boolean;
	wholeWord?: boolean;
	caseSensitive?: boolean;
	wordSeparators?: string;
	includeMarkupInput?: boolean;
	includeMarkupPreview?: boolean;
	includeCodeInput?: boolean;
	includeOutput?: boolean;
	findScope?: INotebookFindScope;
}

export interface INotebookFindScope {
	findScopeType: NotebookFindScopeType;
	selectedCellRanges?: ICellRange[];
	selectedTextRanges?: Range[];
}

export enum NotebookFindScopeType {
	Cells = 'cells',
	Text = 'text',
	None = 'none'
}

export interface INotebookExclusiveDocumentFilter {
	include?: string | glob.IRelativePattern;
	exclude?: string | glob.IRelativePattern;
}

export interface INotebookDocumentFilter {
	viewType?: string | string[];
	filenamePattern?: string | glob.IRelativePattern | INotebookExclusiveDocumentFilter;
}

//TODO@rebornix test

export function isDocumentExcludePattern(filenamePattern: string | glob.IRelativePattern | INotebookExclusiveDocumentFilter): filenamePattern is { include: string | glob.IRelativePattern; exclude: string | glob.IRelativePattern } {
	const arg = filenamePattern as INotebookExclusiveDocumentFilter;

	if ((typeof arg.include === 'string' || glob.isRelativePattern(arg.include))
		&& (typeof arg.exclude === 'string' || glob.isRelativePattern(arg.exclude))) {
		return true;
	}

	return false;
}
export function notebookDocumentFilterMatch(filter: INotebookDocumentFilter, viewType: string, resource: URI): boolean {
	if (Array.isArray(filter.viewType) && filter.viewType.indexOf(viewType) >= 0) {
		return true;
	}

	if (filter.viewType === viewType) {
		return true;
	}

	if (filter.filenamePattern) {
		const filenamePattern = isDocumentExcludePattern(filter.filenamePattern) ? filter.filenamePattern.include : (filter.filenamePattern as string | glob.IRelativePattern);
		const excludeFilenamePattern = isDocumentExcludePattern(filter.filenamePattern) ? filter.filenamePattern.exclude : undefined;

		if (glob.match(filenamePattern, basename(resource.fsPath), { ignoreCase: true })) {
			if (excludeFilenamePattern) {
				if (glob.match(excludeFilenamePattern, basename(resource.fsPath), { ignoreCase: true })) {
					// should exclude
					return false;
				}
			}
			return true;
		}
	}
	return false;
}

export interface INotebookCellStatusBarItemProvider {
	viewType: string;
	onDidChangeStatusBarItems?: Event<void>;
	provideCellStatusBarItems(uri: URI, index: number, token: CancellationToken): Promise<INotebookCellStatusBarItemList | undefined>;
}


export interface INotebookDiffResult {
	cellsDiff: IDiffResult;
	metadataChanged: boolean;
}

export interface INotebookCellStatusBarItem {
	readonly alignment: CellStatusbarAlignment;
	readonly priority?: number;
	readonly text: string;
	readonly color?: string | ThemeColor;
	readonly backgroundColor?: string | ThemeColor;
	readonly tooltip?: string | IMarkdownString;
	readonly command?: string | Command;
	readonly accessibilityInformation?: IAccessibilityInformation;
	readonly opacity?: string;
	readonly onlyShowWhenActive?: boolean;
}

export interface INotebookCellStatusBarItemList {
	items: INotebookCellStatusBarItem[];
	dispose?(): void;
}

export type ShowCellStatusBarType = 'hidden' | 'visible' | 'visibleAfterExecute';
export const NotebookSetting = {
	displayOrder: 'notebook.displayOrder',
	cellToolbarLocation: 'notebook.cellToolbarLocation',
	cellToolbarVisibility: 'notebook.cellToolbarVisibility',
	showCellStatusBar: 'notebook.showCellStatusBar',
	cellExecutionTimeVerbosity: 'notebook.cellExecutionTimeVerbosity',
	textDiffEditorPreview: 'notebook.diff.enablePreview',
	diffOverviewRuler: 'notebook.diff.overviewRuler',
	experimentalInsertToolbarAlignment: 'notebook.experimental.insertToolbarAlignment',
	compactView: 'notebook.compactView',
	focusIndicator: 'notebook.cellFocusIndicator',
	insertToolbarLocation: 'notebook.insertToolbarLocation',
	globalToolbar: 'notebook.globalToolbar',
	stickyScrollEnabled: 'notebook.stickyScroll.enabled',
	stickyScrollMode: 'notebook.stickyScroll.mode',
	undoRedoPerCell: 'notebook.undoRedoPerCell',
	consolidatedOutputButton: 'notebook.consolidatedOutputButton',
	openOutputInPreviewEditor: 'notebook.output.openInPreviewEditor.enabled',
	showFoldingControls: 'notebook.showFoldingControls',
	dragAndDropEnabled: 'notebook.dragAndDropEnabled',
	cellEditorOptionsCustomizations: 'notebook.editorOptionsCustomizations',
	consolidatedRunButton: 'notebook.consolidatedRunButton',
	openGettingStarted: 'notebook.experimental.openGettingStarted',
	globalToolbarShowLabel: 'notebook.globalToolbarShowLabel',
	markupFontSize: 'notebook.markup.fontSize',
	markdownLineHeight: 'notebook.markdown.lineHeight',
	interactiveWindowCollapseCodeCells: 'interactiveWindow.collapseCellInputCode',
	outputScrollingDeprecated: 'notebook.experimental.outputScrolling',
	outputScrolling: 'notebook.output.scrolling',
	textOutputLineLimit: 'notebook.output.textLineLimit',
	LinkifyOutputFilePaths: 'notebook.output.linkifyFilePaths',
	minimalErrorRendering: 'notebook.output.minimalErrorRendering',
	formatOnSave: 'notebook.formatOnSave.enabled',
	insertFinalNewline: 'notebook.insertFinalNewline',
	defaultFormatter: 'notebook.defaultFormatter',
	formatOnCellExecution: 'notebook.formatOnCellExecution',
	codeActionsOnSave: 'notebook.codeActionsOnSave',
	outputWordWrap: 'notebook.output.wordWrap',
	outputLineHeightDeprecated: 'notebook.outputLineHeight',
	outputLineHeight: 'notebook.output.lineHeight',
	outputFontSizeDeprecated: 'notebook.outputFontSize',
	outputFontSize: 'notebook.output.fontSize',
	outputFontFamilyDeprecated: 'notebook.outputFontFamily',
	outputFontFamily: 'notebook.output.fontFamily',
	findFilters: 'notebook.find.filters',
	logging: 'notebook.logging',
	confirmDeleteRunningCell: 'notebook.confirmDeleteRunningCell',
	remoteSaving: 'notebook.experimental.remoteSave',
	gotoSymbolsAllSymbols: 'notebook.gotoSymbols.showAllSymbols',
	outlineShowMarkdownHeadersOnly: 'notebook.outline.showMarkdownHeadersOnly',
	outlineShowCodeCells: 'notebook.outline.showCodeCells',
	outlineShowCodeCellSymbols: 'notebook.outline.showCodeCellSymbols',
	breadcrumbsShowCodeCells: 'notebook.breadcrumbs.showCodeCells',
	scrollToRevealCell: 'notebook.scrolling.revealNextCellOnExecute',
	cellChat: 'notebook.experimental.cellChat',
	cellGenerate: 'notebook.experimental.generate',
	notebookVariablesView: 'notebook.variablesView',
	notebookInlineValues: 'notebook.inlineValues',
	InteractiveWindowPromptToSave: 'interactiveWindow.promptToSaveOnClose',
	cellFailureDiagnostics: 'notebook.cellFailureDiagnostics',
	outputBackupSizeLimit: 'notebook.backup.sizeLimit',
	multiCursor: 'notebook.multiCursor.enabled',
	markupFontFamily: 'notebook.markup.fontFamily',
} as const;

export const enum CellStatusbarAlignment {
	Left = 1,
	Right = 2
}

export class NotebookWorkingCopyTypeIdentifier {

	private static _prefix = 'notebook/';

	static create(notebookType: string, viewType?: string): string {
		return `${NotebookWorkingCopyTypeIdentifier._prefix}${notebookType}/${viewType ?? notebookType}`;
	}

	static parse(candidate: string): { notebookType: string; viewType: string } | undefined {
		if (candidate.startsWith(NotebookWorkingCopyTypeIdentifier._prefix)) {
			const split = candidate.substring(NotebookWorkingCopyTypeIdentifier._prefix.length).split('/');
			if (split.length === 2) {
				return { notebookType: split[0], viewType: split[1] };
			}
		}
		return undefined;
	}
}

export interface NotebookExtensionDescription {
	readonly id: ExtensionIdentifier;
	readonly location: UriComponents | undefined;
}

const textDecoder = new TextDecoder();

/**
 * Given a stream of individual stdout outputs, this function will return the compressed lines, escaping some of the common terminal escape codes.
 * E.g. some terminal escape codes would result in the previous line getting cleared, such if we had 3 lines and
 * last line contained such a code, then the result string would be just the first two lines.
 * @returns a single VSBuffer with the concatenated and compressed data, and whether any compression was done.
 */
export function compressOutputItemStreams(outputs: Uint8Array[]) {
	const buffers: Uint8Array[] = [];
	let startAppending = false;

	// Pick the first set of outputs with the same mime type.
	for (const output of outputs) {
		if ((buffers.length === 0 || startAppending)) {
			buffers.push(output);
			startAppending = true;
		}
	}

	let didCompression = compressStreamBuffer(buffers);
	const concatenated = VSBuffer.concat(buffers.map(buffer => VSBuffer.wrap(buffer)));
	const data = formatStreamText(concatenated);
	didCompression = didCompression || data.byteLength !== concatenated.byteLength;
	return { data, didCompression };
}

export const MOVE_CURSOR_1_LINE_COMMAND = `${String.fromCharCode(27)}[A`;
const MOVE_CURSOR_1_LINE_COMMAND_BYTES = MOVE_CURSOR_1_LINE_COMMAND.split('').map(c => c.charCodeAt(0));
const LINE_FEED = 10;
function compressStreamBuffer(streams: Uint8Array[]) {
	let didCompress = false;
	streams.forEach((stream, index) => {
		if (index === 0 || stream.length < MOVE_CURSOR_1_LINE_COMMAND.length) {
			return;
		}

		const previousStream = streams[index - 1];

		// Remove the previous line if required.
		const command = stream.subarray(0, MOVE_CURSOR_1_LINE_COMMAND.length);
		if (command[0] === MOVE_CURSOR_1_LINE_COMMAND_BYTES[0] && command[1] === MOVE_CURSOR_1_LINE_COMMAND_BYTES[1] && command[2] === MOVE_CURSOR_1_LINE_COMMAND_BYTES[2]) {
			const lastIndexOfLineFeed = previousStream.lastIndexOf(LINE_FEED);
			if (lastIndexOfLineFeed === -1) {
				return;
			}

			didCompress = true;
			streams[index - 1] = previousStream.subarray(0, lastIndexOfLineFeed);
			streams[index] = stream.subarray(MOVE_CURSOR_1_LINE_COMMAND.length);
		}
	});
	return didCompress;
}



/**
 * Took this from jupyter/notebook
 * https://github.com/jupyter/notebook/blob/b8b66332e2023e83d2ee04f83d8814f567e01a4e/notebook/static/base/js/utils.js
 * Remove characters that are overridden by backspace characters
 */
function fixBackspace(txt: string) {
	let tmp = txt;
	do {
		txt = tmp;
		// Cancel out anything-but-newline followed by backspace
		tmp = txt.replace(/[^\n]\x08/gm, '');
	} while (tmp.length < txt.length);
	return txt;
}

/**
 * Remove chunks that should be overridden by the effect of carriage return characters
 * From https://github.com/jupyter/notebook/blob/master/notebook/static/base/js/utils.js
 */
function fixCarriageReturn(txt: string) {
	txt = txt.replace(/\r+\n/gm, '\n'); // \r followed by \n --> newline
	while (txt.search(/\r[^$]/g) > -1) {
		const base = txt.match(/^(.*)\r+/m)![1];
		let insert = txt.match(/\r+(.*)$/m)![1];
		insert = insert + base.slice(insert.length, base.length);
		txt = txt.replace(/\r+.*$/m, '\r').replace(/^.*\r/m, insert);
	}
	return txt;
}

const BACKSPACE_CHARACTER = '\b'.charCodeAt(0);
const CARRIAGE_RETURN_CHARACTER = '\r'.charCodeAt(0);
function formatStreamText(buffer: VSBuffer): VSBuffer {
	// We have special handling for backspace and carriage return characters.
	// Don't unnecessary decode the bytes if we don't need to perform any processing.
	if (!buffer.buffer.includes(BACKSPACE_CHARACTER) && !buffer.buffer.includes(CARRIAGE_RETURN_CHARACTER)) {
		return buffer;
	}
	// Do the same thing jupyter is doing
	return VSBuffer.fromString(fixCarriageReturn(fixBackspace(textDecoder.decode(buffer.buffer))));
}

export interface INotebookKernelSourceAction {
	readonly label: string;
	readonly description?: string;
	readonly detail?: string;
	readonly command?: string | Command;
	readonly documentation?: UriComponents | string;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookContextKeys.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookContextKeys.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ContextKeyExpr, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { INTERACTIVE_WINDOW_EDITOR_ID, NOTEBOOK_EDITOR_ID, REPL_EDITOR_ID } from './notebookCommon.js';



//#region Context Keys
export const HAS_OPENED_NOTEBOOK = new RawContextKey<boolean>('userHasOpenedNotebook', false);
export const KEYBINDING_CONTEXT_NOTEBOOK_FIND_WIDGET_FOCUSED = new RawContextKey<boolean>('notebookFindWidgetFocused', false);
export const InteractiveWindowOpen = new RawContextKey<boolean>('interactiveWindowOpen', false);
export const MOST_RECENT_REPL_EDITOR = new RawContextKey<string>('mostRecentReplEditor', undefined);

// Is Notebook
export const NOTEBOOK_IS_ACTIVE_EDITOR = ContextKeyExpr.equals('activeEditor', NOTEBOOK_EDITOR_ID);
export const INTERACTIVE_WINDOW_IS_ACTIVE_EDITOR = ContextKeyExpr.equals('activeEditor', INTERACTIVE_WINDOW_EDITOR_ID);
export const REPL_NOTEBOOK_IS_ACTIVE_EDITOR = ContextKeyExpr.equals('activeEditor', REPL_EDITOR_ID);
export const NOTEBOOK_OR_COMPOSITE_IS_ACTIVE_EDITOR = ContextKeyExpr.or(NOTEBOOK_IS_ACTIVE_EDITOR, INTERACTIVE_WINDOW_IS_ACTIVE_EDITOR, REPL_NOTEBOOK_IS_ACTIVE_EDITOR);
export const IS_COMPOSITE_NOTEBOOK = new RawContextKey<boolean>('isCompositeNotebook', false);

// Editor keys
// based on the focus of the notebook editor widget
export const NOTEBOOK_EDITOR_FOCUSED = new RawContextKey<boolean>('notebookEditorFocused', false);
// always true within the cell list html element
export const NOTEBOOK_CELL_LIST_FOCUSED = new RawContextKey<boolean>('notebookCellListFocused', false);
export const NOTEBOOK_OUTPUT_FOCUSED = new RawContextKey<boolean>('notebookOutputFocused', false);
// an input html element within the output webview has focus
export const NOTEBOOK_OUTPUT_INPUT_FOCUSED = new RawContextKey<boolean>('notebookOutputInputFocused', false);
export const NOTEBOOK_EDITOR_EDITABLE = new RawContextKey<boolean>('notebookEditable', true);
export const NOTEBOOK_HAS_RUNNING_CELL = new RawContextKey<boolean>('notebookHasRunningCell', false);
export const NOTEBOOK_HAS_SOMETHING_RUNNING = new RawContextKey<boolean>('notebookHasSomethingRunning', false);
export const NOTEBOOK_USE_CONSOLIDATED_OUTPUT_BUTTON = new RawContextKey<boolean>('notebookUseConsolidatedOutputButton', false);
export const NOTEBOOK_BREAKPOINT_MARGIN_ACTIVE = new RawContextKey<boolean>('notebookBreakpointMargin', false);
export const NOTEBOOK_CELL_TOOLBAR_LOCATION = new RawContextKey<'left' | 'right' | 'hidden'>('notebookCellToolbarLocation', 'left');
export const NOTEBOOK_CURSOR_NAVIGATION_MODE = new RawContextKey<boolean>('notebookCursorNavigationMode', false);
export const NOTEBOOK_LAST_CELL_FAILED = new RawContextKey<boolean>('notebookLastCellFailed', false);

// Cell keys
export const NOTEBOOK_VIEW_TYPE = new RawContextKey<string>('notebookType', undefined);
export const NOTEBOOK_CELL_TYPE = new RawContextKey<'code' | 'markup'>('notebookCellType', undefined);
export const NOTEBOOK_CELL_EDITABLE = new RawContextKey<boolean>('notebookCellEditable', false);
export const NOTEBOOK_CELL_FOCUSED = new RawContextKey<boolean>('notebookCellFocused', false);
export const NOTEBOOK_CELL_EDITOR_FOCUSED = new RawContextKey<boolean>('notebookCellEditorFocused', false);
export const NOTEBOOK_CELL_MARKDOWN_EDIT_MODE = new RawContextKey<boolean>('notebookCellMarkdownEditMode', false);
export const NOTEBOOK_CELL_LINE_NUMBERS = new RawContextKey<'on' | 'off' | 'inherit'>('notebookCellLineNumbers', 'inherit');
export type NotebookCellExecutionStateContext = 'idle' | 'pending' | 'executing' | 'succeeded' | 'failed';
export const NOTEBOOK_CELL_EXECUTION_STATE = new RawContextKey<NotebookCellExecutionStateContext>('notebookCellExecutionState', undefined);
export const NOTEBOOK_CELL_EXECUTING = new RawContextKey<boolean>('notebookCellExecuting', false); // This only exists to simplify a context key expression, see #129625
export const NOTEBOOK_CELL_HAS_OUTPUTS = new RawContextKey<boolean>('notebookCellHasOutputs', false);
export const NOTEBOOK_CELL_IS_FIRST_OUTPUT = new RawContextKey<boolean>('notebookCellIsFirstOutput', false);
export const NOTEBOOK_CELL_HAS_HIDDEN_OUTPUTS = new RawContextKey<boolean>('hasHiddenOutputs', false);
export const NOTEBOOK_CELL_OUTPUT_MIMETYPE = new RawContextKey<string>('notebookCellOutputMimeType', undefined);
export const NOTEBOOK_CELL_INPUT_COLLAPSED = new RawContextKey<boolean>('notebookCellInputIsCollapsed', false);
export const NOTEBOOK_CELL_OUTPUT_COLLAPSED = new RawContextKey<boolean>('notebookCellOutputIsCollapsed', false);
export const NOTEBOOK_CELL_RESOURCE = new RawContextKey<string>('notebookCellResource', '');
export const NOTEBOOK_CELL_HAS_ERROR_DIAGNOSTICS = new RawContextKey<boolean>('notebookCellHasErrorDiagnostics', false);
export const NOTEBOOK_CELL_OUTPUT_MIME_TYPE_LIST_FOR_CHAT = new RawContextKey<string[]>('notebookCellOutputMimeTypeListForChat', []);

// Kernels
export const NOTEBOOK_KERNEL = new RawContextKey<string>('notebookKernel', undefined);
export const NOTEBOOK_KERNEL_COUNT = new RawContextKey<number>('notebookKernelCount', 0);
export const NOTEBOOK_KERNEL_SOURCE_COUNT = new RawContextKey<number>('notebookKernelSourceCount', 0);
export const NOTEBOOK_KERNEL_SELECTED = new RawContextKey<boolean>('notebookKernelSelected', false);
export const NOTEBOOK_INTERRUPTIBLE_KERNEL = new RawContextKey<boolean>('notebookInterruptibleKernel', false);
export const NOTEBOOK_MISSING_KERNEL_EXTENSION = new RawContextKey<boolean>('notebookMissingKernelExtension', false);
export const NOTEBOOK_HAS_OUTPUTS = new RawContextKey<boolean>('notebookHasOutputs', false);
export const KERNEL_HAS_VARIABLE_PROVIDER = new RawContextKey<boolean>('kernelHasVariableProvider', false);

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookDiff.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookDiff.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDiffChange } from '../../../../base/common/diff/diff.js';
import { CellKind, INotebookDiffResult } from './notebookCommon.js';

export type CellDiffInfo = {
	originalCellIndex: number;
	modifiedCellIndex: number;
	type: 'unchanged' | 'modified';
} |
{
	originalCellIndex: number;
	type: 'delete';
} |
{
	modifiedCellIndex: number;
	type: 'insert';
};

interface ICell {
	cellKind: CellKind;
	getHashValue(): number;
	equal(cell: ICell): boolean;
}
// interface INotebookDiffResult {
// 	cellsDiff: IDiffResult;
// 	metadataChanged: boolean;
// }

export function computeDiff(originalModel: { readonly cells: readonly ICell[] }, modifiedModel: { readonly cells: readonly ICell[] }, diffResult: INotebookDiffResult) {
	const cellChanges = diffResult.cellsDiff.changes;
	const cellDiffInfo: CellDiffInfo[] = [];
	let originalCellIndex = 0;
	let modifiedCellIndex = 0;

	let firstChangeIndex = -1;

	for (let i = 0; i < cellChanges.length; i++) {
		const change = cellChanges[i];
		// common cells

		for (let j = 0; j < change.originalStart - originalCellIndex; j++) {
			const originalCell = originalModel.cells[originalCellIndex + j];
			const modifiedCell = modifiedModel.cells[modifiedCellIndex + j];
			if (originalCell.getHashValue() === modifiedCell.getHashValue()) {
				cellDiffInfo.push({
					originalCellIndex: originalCellIndex + j,
					modifiedCellIndex: modifiedCellIndex + j,
					type: 'unchanged'
				});
			} else {
				if (firstChangeIndex === -1) {
					firstChangeIndex = cellDiffInfo.length;
				}
				cellDiffInfo.push({
					originalCellIndex: originalCellIndex + j,
					modifiedCellIndex: modifiedCellIndex + j,
					type: 'modified'
				});
			}
		}

		const modifiedLCS = computeModifiedLCS(change, originalModel, modifiedModel);
		if (modifiedLCS.length && firstChangeIndex === -1) {
			firstChangeIndex = cellDiffInfo.length;
		}

		cellDiffInfo.push(...modifiedLCS);
		originalCellIndex = change.originalStart + change.originalLength;
		modifiedCellIndex = change.modifiedStart + change.modifiedLength;
	}

	for (let i = originalCellIndex; i < originalModel.cells.length; i++) {
		cellDiffInfo.push({
			originalCellIndex: i,
			modifiedCellIndex: i - originalCellIndex + modifiedCellIndex,
			type: 'unchanged'
		});
	}

	return {
		cellDiffInfo,
		firstChangeIndex
	};
}

function computeModifiedLCS(change: IDiffChange, originalModel: { readonly cells: readonly ICell[] }, modifiedModel: { readonly cells: readonly ICell[] }) {
	const result: CellDiffInfo[] = [];
	// modified cells
	const modifiedLen = Math.min(change.originalLength, change.modifiedLength);

	for (let j = 0; j < modifiedLen; j++) {
		const originalCell = originalModel.cells[change.originalStart + j];
		const modifiedCell = modifiedModel.cells[change.modifiedStart + j];
		if (originalCell.cellKind !== modifiedCell.cellKind) {
			result.push({
				originalCellIndex: change.originalStart + j,
				type: 'delete'
			});
			result.push({
				modifiedCellIndex: change.modifiedStart + j,
				type: 'insert'
			});
		} else {
			const isTheSame = originalCell.equal(modifiedCell);
			result.push({
				originalCellIndex: change.originalStart + j,
				modifiedCellIndex: change.modifiedStart + j,
				type: isTheSame ? 'unchanged' : 'modified'
			});
		}
	}

	for (let j = modifiedLen; j < change.originalLength; j++) {
		// deletion
		result.push({
			originalCellIndex: change.originalStart + j,
			type: 'delete'
		});
	}

	for (let j = modifiedLen; j < change.modifiedLength; j++) {
		result.push({
			modifiedCellIndex: change.modifiedStart + j,
			type: 'insert'
		});
	}

	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookDiffEditorInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookDiffEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IResourceDiffEditorInput, IResourceSideBySideEditorInput, isResourceDiffEditorInput, IUntypedEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { EditorModel } from '../../../common/editor/editorModel.js';
import { URI } from '../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotebookDiffEditorModel, IResolvedNotebookEditorModel } from './notebookCommon.js';
import { DiffEditorInput } from '../../../common/editor/diffEditorInput.js';
import { NotebookEditorInput } from './notebookEditorInput.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';

class NotebookDiffEditorModel extends EditorModel implements INotebookDiffEditorModel {
	constructor(
		readonly original: IResolvedNotebookEditorModel,
		readonly modified: IResolvedNotebookEditorModel,
	) {
		super();
	}
}

export class NotebookDiffEditorInput extends DiffEditorInput {
	static create(instantiationService: IInstantiationService, resource: URI, name: string | undefined, description: string | undefined, originalResource: URI, viewType: string) {
		const original = NotebookEditorInput.getOrCreate(instantiationService, originalResource, undefined, viewType);
		const modified = NotebookEditorInput.getOrCreate(instantiationService, resource, undefined, viewType);
		return instantiationService.createInstance(NotebookDiffEditorInput, name, description, original, modified, viewType);
	}

	static override readonly ID: string = 'workbench.input.diffNotebookInput';

	private _modifiedTextModel: IResolvedNotebookEditorModel | null = null;
	private _originalTextModel: IResolvedNotebookEditorModel | null = null;

	override get resource() {
		return this.modified.resource;
	}

	override get editorId() {
		return this.viewType;
	}

	private _cachedModel: NotebookDiffEditorModel | undefined = undefined;

	constructor(
		name: string | undefined,
		description: string | undefined,
		override readonly original: NotebookEditorInput,
		override readonly modified: NotebookEditorInput,
		public readonly viewType: string,
		@IEditorService editorService: IEditorService
	) {
		super(
			name,
			description,
			original,
			modified,
			undefined,
			editorService
		);
	}

	override get typeId(): string {
		return NotebookDiffEditorInput.ID;
	}

	override async resolve(): Promise<NotebookDiffEditorModel> {
		const [originalEditorModel, modifiedEditorModel] = await Promise.all([
			this.original.resolve(),
			this.modified.resolve(),
		]);

		this._cachedModel?.dispose();

		// TODO@rebornix check how we restore the editor in text diff editor
		if (!modifiedEditorModel) {
			throw new Error(`Fail to resolve modified editor model for resource ${this.modified.resource} with notebookType ${this.viewType}`);
		}

		if (!originalEditorModel) {
			throw new Error(`Fail to resolve original editor model for resource ${this.original.resource} with notebookType ${this.viewType}`);
		}

		this._originalTextModel = originalEditorModel;
		this._modifiedTextModel = modifiedEditorModel;
		this._cachedModel = new NotebookDiffEditorModel(this._originalTextModel, this._modifiedTextModel);
		return this._cachedModel;
	}

	override toUntyped(): IResourceDiffEditorInput & IResourceSideBySideEditorInput {
		const original = { resource: this.original.resource };
		const modified = { resource: this.resource };
		return {
			original,
			modified,
			primary: modified,
			secondary: original,
			options: {
				override: this.viewType
			}
		};
	}

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		if (this === otherInput) {
			return true;
		}

		if (otherInput instanceof NotebookDiffEditorInput) {
			return this.modified.matches(otherInput.modified)
				&& this.original.matches(otherInput.original)
				&& this.viewType === otherInput.viewType;
		}

		if (isResourceDiffEditorInput(otherInput)) {
			return this.modified.matches(otherInput.modified)
				&& this.original.matches(otherInput.original)
				&& this.editorId !== undefined
				&& (this.editorId === otherInput.options?.override || otherInput.options?.override === undefined);
		}

		return false;
	}

	override dispose() {
		super.dispose();
		this._cachedModel?.dispose();
		this._cachedModel = undefined;
		this.original.dispose();
		this.modified.dispose();
		this._originalTextModel = null;
		this._modifiedTextModel = null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookEditorInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as glob from '../../../../base/common/glob.js';
import { GroupIdentifier, ISaveOptions, IMoveResult, IRevertOptions, EditorInputCapabilities, Verbosity, IUntypedEditorInput, IFileLimitedEditorInputOptions, isResourceEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { INotebookService, SimpleNotebookProviderInfo } from './notebookService.js';
import { URI } from '../../../../base/common/uri.js';
import { isEqual, toLocalResource } from '../../../../base/common/resources.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { INotebookEditorModelResolverService } from './notebookEditorModelResolverService.js';
import { IDisposable, IReference } from '../../../../base/common/lifecycle.js';
import { CellEditType, CellUri, IResolvedNotebookEditorModel } from './notebookCommon.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { Schemas } from '../../../../base/common/network.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { AbstractResourceEditorInput } from '../../../common/editor/resourceEditorInput.js';
import { IResourceEditorInput } from '../../../../platform/editor/common/editor.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { IWorkingCopyIdentifier } from '../../../services/workingCopy/common/workingCopy.js';
import { NotebookProviderInfo } from './notebookProvider.js';
import { NotebookPerfMarks } from './notebookPerformance.js';
import { IFilesConfigurationService } from '../../../services/filesConfiguration/common/filesConfigurationService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { localize } from '../../../../nls.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { ICustomEditorLabelService } from '../../../services/editor/common/customEditorLabelService.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IPathService } from '../../../services/path/common/pathService.js';
import { isAbsolute } from '../../../../base/common/path.js';

export interface NotebookEditorInputOptions {
	startDirty?: boolean;
	/**
	 * backupId for webview
	 */
	_backupId?: string;
	_workingCopy?: IWorkingCopyIdentifier;
}

export class NotebookEditorInput extends AbstractResourceEditorInput {

	static getOrCreate(instantiationService: IInstantiationService, resource: URI, preferredResource: URI | undefined, viewType: string, options: NotebookEditorInputOptions = {}) {
		const editor = instantiationService.createInstance(NotebookEditorInput, resource, preferredResource, viewType, options);
		if (preferredResource) {
			editor.setPreferredResource(preferredResource);
		}
		return editor;
	}

	static readonly ID: string = 'workbench.input.notebook';

	protected editorModelReference: IReference<IResolvedNotebookEditorModel> | null = null;
	private _sideLoadedListener: IDisposable;
	private _defaultDirtyState: boolean = false;

	constructor(
		resource: URI,
		preferredResource: URI | undefined,
		public readonly viewType: string,
		public readonly options: NotebookEditorInputOptions,
		@INotebookService private readonly _notebookService: INotebookService,
		@INotebookEditorModelResolverService private readonly _notebookModelResolverService: INotebookEditorModelResolverService,
		@IFileDialogService private readonly _fileDialogService: IFileDialogService,
		@ILabelService labelService: ILabelService,
		@IFileService fileService: IFileService,
		@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
		@IExtensionService extensionService: IExtensionService,
		@IEditorService editorService: IEditorService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@ICustomEditorLabelService customEditorLabelService: ICustomEditorLabelService,
		@IWorkbenchEnvironmentService protected readonly environmentService: IWorkbenchEnvironmentService,
		@IPathService private readonly pathService: IPathService
	) {
		super(resource, preferredResource, labelService, fileService, filesConfigurationService, textResourceConfigurationService, customEditorLabelService);
		this._defaultDirtyState = !!options.startDirty;

		// Automatically resolve this input when the "wanted" model comes to life via
		// some other way. This happens only once per input and resolve disposes
		// this listener
		this._sideLoadedListener = _notebookService.onDidAddNotebookDocument(e => {
			if (e.viewType === this.viewType && e.uri.toString() === this.resource.toString()) {
				this.resolve().catch(onUnexpectedError);
			}
		});

		this._register(extensionService.onWillStop(e => {
			if (!e.auto && !this.isDirty()) {
				return;
			}

			const reason = e.auto
				? localize('vetoAutoExtHostRestart', "An extension provided notebook for '{0}' is still open that would close otherwise.", this.getName())
				: localize('vetoExtHostRestart', "An extension provided notebook for '{0}' could not be saved.", this.getName());

			e.veto((async () => {
				const editors = editorService.findEditors(this);
				if (e.auto) {
					return true;
				}
				if (editors.length > 0) {
					const result = await editorService.save(editors[0]);
					if (result.success) {
						return false; // Don't Veto
					}
				}
				return true; // Veto
			})(), reason);
		}));
	}

	override dispose() {
		this._sideLoadedListener.dispose();
		this.editorModelReference?.dispose();
		this.editorModelReference = null;
		super.dispose();
	}

	override get typeId(): string {
		return NotebookEditorInput.ID;
	}

	override get editorId(): string | undefined {
		return this.viewType;
	}

	override get capabilities(): EditorInputCapabilities {
		let capabilities = EditorInputCapabilities.None;

		if (this.resource.scheme === Schemas.untitled) {
			capabilities |= EditorInputCapabilities.Untitled;
		}

		if (this.editorModelReference) {
			if (this.editorModelReference.object.isReadonly()) {
				capabilities |= EditorInputCapabilities.Readonly;
			}
		} else {
			if (this.filesConfigurationService.isReadonly(this.resource)) {
				capabilities |= EditorInputCapabilities.Readonly;
			}
		}

		if (!(capabilities & EditorInputCapabilities.Readonly)) {
			capabilities |= EditorInputCapabilities.CanDropIntoEditor;
		}

		return capabilities;
	}

	override getDescription(verbosity = Verbosity.MEDIUM): string | undefined {
		if (!this.hasCapability(EditorInputCapabilities.Untitled) || this.editorModelReference?.object.hasAssociatedFilePath()) {
			return super.getDescription(verbosity);
		}

		return undefined; // no description for untitled notebooks without associated file path
	}

	override isReadonly(): boolean | IMarkdownString {
		if (!this.editorModelReference) {
			return this.filesConfigurationService.isReadonly(this.resource);
		}
		return this.editorModelReference.object.isReadonly();
	}

	override isDirty() {
		if (!this.editorModelReference) {
			return this._defaultDirtyState;
		}
		return this.editorModelReference.object.isDirty();
	}

	override isSaving(): boolean {
		const model = this.editorModelReference?.object;
		if (!model || !model.isDirty() || model.hasErrorState || this.hasCapability(EditorInputCapabilities.Untitled)) {
			return false; // require the model to be dirty, file-backed and not in an error state
		}

		// if a short auto save is configured, treat this as being saved
		return this.filesConfigurationService.hasShortAutoSaveDelay(this);
	}

	override async save(group: GroupIdentifier, options?: ISaveOptions): Promise<EditorInput | IUntypedEditorInput | undefined> {
		if (this.editorModelReference) {

			if (this.hasCapability(EditorInputCapabilities.Untitled)) {
				return this.saveAs(group, options);
			} else {
				await this.editorModelReference.object.save(options);
			}

			return this;
		}

		return undefined;
	}

	override async saveAs(group: GroupIdentifier, options?: ISaveOptions): Promise<IUntypedEditorInput | undefined> {
		if (!this.editorModelReference) {
			return undefined;
		}

		const provider = this._notebookService.getContributedNotebookType(this.viewType);

		if (!provider) {
			return undefined;
		}

		const pathCandidate = this.hasCapability(EditorInputCapabilities.Untitled)
			? await this._suggestName(provider)
			: this.editorModelReference.object.resource;

		let target: URI | undefined;
		if (this.editorModelReference.object.hasAssociatedFilePath()) {
			target = pathCandidate;
		} else {
			target = await this._fileDialogService.pickFileToSave(pathCandidate, options?.availableFileSystems);
			if (!target) {
				return undefined; // save cancelled
			}
		}

		if (!provider.matches(target)) {
			const patterns = provider.selectors.map(pattern => {
				if (typeof pattern === 'string') {
					return pattern;
				}

				if (glob.isRelativePattern(pattern)) {
					return `${pattern} (base ${pattern.base})`;
				}

				if (pattern.exclude) {
					return `${pattern.include} (exclude: ${pattern.exclude})`;
				} else {
					return `${pattern.include}`;
				}

			}).join(', ');
			throw new Error(`File name ${target} is not supported by ${provider.providerDisplayName}.\n\nPlease make sure the file name matches following patterns:\n${patterns}`);
		}

		return await this.editorModelReference.object.saveAs(target);
	}

	private async _suggestName(provider: NotebookProviderInfo) {
		const resource = await this.ensureAbsolutePath(this.ensureProviderExtension(provider));
		const remoteAuthority = this.environmentService.remoteAuthority;
		return toLocalResource(resource, remoteAuthority, this.pathService.defaultUriScheme);
	}

	private async ensureAbsolutePath(resource: URI): Promise<URI> {
		if (resource.scheme !== Schemas.untitled || isAbsolute(resource.path)) {
			return resource;
		}

		const defaultFilePath = await this._fileDialogService.defaultFilePath();
		return URI.joinPath(defaultFilePath, resource.path);
	}

	private ensureProviderExtension(provider: NotebookProviderInfo) {
		const firstSelector = provider.selectors[0];
		let selectorStr = firstSelector && typeof firstSelector === 'string' ? firstSelector : undefined;
		if (!selectorStr && firstSelector) {
			const include = (firstSelector as { include?: string }).include;
			if (typeof include === 'string') {
				selectorStr = include;
			}
		}

		const resource = this.resource;
		if (selectorStr) {
			const matches = /^\*\.([A-Za-z_-]*)$/.exec(selectorStr);
			if (matches && matches.length > 1) {
				const fileExt = matches[1];
				if (!resource.path.endsWith(fileExt)) {
					return resource.with({ path: resource.path + '.' + fileExt });
				}
			}
		}

		return resource;
	}

	// called when users rename a notebook document
	override async rename(group: GroupIdentifier, target: URI): Promise<IMoveResult | undefined> {
		if (this.editorModelReference) {
			return { editor: { resource: target }, options: { override: this.viewType } };

		}
		return undefined;
	}

	override async revert(_group: GroupIdentifier, options?: IRevertOptions): Promise<void> {
		if (this.editorModelReference && this.editorModelReference.object.isDirty()) {
			await this.editorModelReference.object.revert(options);
		}
	}

	override async resolve(_options?: IFileLimitedEditorInputOptions, perf?: NotebookPerfMarks): Promise<IResolvedNotebookEditorModel | null> {
		if (!await this._notebookService.canResolve(this.viewType)) {
			return null;
		}

		perf?.mark('extensionActivated');

		// we are now loading the notebook and don't need to listen to
		// "other" loading anymore
		this._sideLoadedListener.dispose();

		if (!this.editorModelReference) {
			const scratchpad = this.capabilities & EditorInputCapabilities.Scratchpad ? true : false;
			const ref = await this._notebookModelResolverService.resolve(this.resource, this.viewType, { limits: this.ensureLimits(_options), scratchpad, viewType: this.editorId });
			if (this.editorModelReference) {
				// Re-entrant, double resolve happened. Dispose the addition references and proceed
				// with the truth.
				ref.dispose();
				return (<IReference<IResolvedNotebookEditorModel>>this.editorModelReference).object;
			}
			this.editorModelReference = ref;
			if (this.isDisposed()) {
				this.editorModelReference.dispose();
				this.editorModelReference = null;
				return null;
			}
			this._register(this.editorModelReference.object.onDidChangeDirty(() => this._onDidChangeDirty.fire()));
			this._register(this.editorModelReference.object.onDidChangeReadonly(() => this._onDidChangeCapabilities.fire()));
			this._register(this.editorModelReference.object.onDidRevertUntitled(() => this.dispose()));
			if (this.editorModelReference.object.isDirty()) {
				this._onDidChangeDirty.fire();
			}
		} else {
			this.editorModelReference.object.load({ limits: this.ensureLimits(_options) });
		}

		if (this.options._backupId) {
			const info = await this._notebookService.withNotebookDataProvider(this.editorModelReference.object.notebook.viewType);
			if (!(info instanceof SimpleNotebookProviderInfo)) {
				throw new Error('CANNOT open file notebook with this provider');
			}

			const data = await info.serializer.dataToNotebook(VSBuffer.fromString(JSON.stringify({ __webview_backup: this.options._backupId })));
			this.editorModelReference.object.notebook.applyEdits([
				{
					editType: CellEditType.Replace,
					index: 0,
					count: this.editorModelReference.object.notebook.length,
					cells: data.cells
				}
			], true, undefined, () => undefined, undefined, false);

			if (this.options._workingCopy) {
				this.options._backupId = undefined;
				this.options._workingCopy = undefined;
				this.options.startDirty = undefined;
			}
		}

		return this.editorModelReference.object;
	}

	override toUntyped(): IResourceEditorInput {
		return {
			resource: this.resource,
			options: {
				override: this.viewType
			}
		};
	}

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		if (super.matches(otherInput)) {
			return true;
		}
		if (otherInput instanceof NotebookEditorInput) {
			return this.viewType === otherInput.viewType && isEqual(this.resource, otherInput.resource);
		}
		if (isResourceEditorInput(otherInput) && otherInput.resource.scheme === CellUri.scheme) {
			return isEqual(this.resource, CellUri.parse(otherInput.resource)?.notebook);
		}
		return false;
	}
}

export interface ICompositeNotebookEditorInput {
	readonly editorInputs: NotebookEditorInput[];
}

export function isCompositeNotebookEditorInput(thing: unknown): thing is ICompositeNotebookEditorInput {
	return !!thing
		&& typeof thing === 'object'
		&& Array.isArray((<ICompositeNotebookEditorInput>thing).editorInputs)
		&& ((<ICompositeNotebookEditorInput>thing).editorInputs.every(input => input instanceof NotebookEditorInput));
}

export function isNotebookEditorInput(thing: EditorInput | undefined): thing is NotebookEditorInput {
	return !!thing
		&& typeof thing === 'object'
		&& thing.typeId === NotebookEditorInput.ID;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookEditorModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookEditorModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBufferReadableStream, streamToBuffer } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { CancellationError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { assertType, hasKey } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IWriteFileOptions, IFileStatWithMetadata, FileOperationError, FileOperationResult } from '../../../../platform/files/common/files.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IRevertOptions, ISaveOptions, IUntypedEditorInput } from '../../../common/editor.js';
import { EditorModel } from '../../../common/editor/editorModel.js';
import { NotebookTextModel } from './model/notebookTextModel.js';
import { INotebookEditorModel, INotebookLoadOptions, IResolvedNotebookEditorModel, NotebookCellsChangeType, NotebookSetting } from './notebookCommon.js';
import { INotebookLoggingService } from './notebookLoggingService.js';
import { INotebookSerializer, INotebookService, SimpleNotebookProviderInfo } from './notebookService.js';
import { IFilesConfigurationService } from '../../../services/filesConfiguration/common/filesConfigurationService.js';
import { IFileWorkingCopyModelConfiguration, SnapshotContext } from '../../../services/workingCopy/common/fileWorkingCopy.js';
import { IFileWorkingCopyManager } from '../../../services/workingCopy/common/fileWorkingCopyManager.js';
import { IStoredFileWorkingCopy, IStoredFileWorkingCopyModel, IStoredFileWorkingCopyModelContentChangedEvent, IStoredFileWorkingCopyModelFactory, IStoredFileWorkingCopySaveEvent, StoredFileWorkingCopyState } from '../../../services/workingCopy/common/storedFileWorkingCopy.js';
import { IUntitledFileWorkingCopy, IUntitledFileWorkingCopyModel, IUntitledFileWorkingCopyModelContentChangedEvent, IUntitledFileWorkingCopyModelFactory } from '../../../services/workingCopy/common/untitledFileWorkingCopy.js';
import { WorkingCopyCapabilities } from '../../../services/workingCopy/common/workingCopy.js';

//#region --- simple content provider

export class SimpleNotebookEditorModel extends EditorModel implements INotebookEditorModel {

	private readonly _onDidChangeDirty = this._register(new Emitter<void>());
	private readonly _onDidSave = this._register(new Emitter<IStoredFileWorkingCopySaveEvent>());
	private readonly _onDidChangeOrphaned = this._register(new Emitter<void>());
	private readonly _onDidChangeReadonly = this._register(new Emitter<void>());
	private readonly _onDidRevertUntitled = this._register(new Emitter<void>());

	readonly onDidChangeDirty: Event<void> = this._onDidChangeDirty.event;
	readonly onDidSave: Event<IStoredFileWorkingCopySaveEvent> = this._onDidSave.event;
	readonly onDidChangeOrphaned: Event<void> = this._onDidChangeOrphaned.event;
	readonly onDidChangeReadonly: Event<void> = this._onDidChangeReadonly.event;
	readonly onDidRevertUntitled: Event<void> = this._onDidRevertUntitled.event;

	private _workingCopy?: IStoredFileWorkingCopy<NotebookFileWorkingCopyModel> | IUntitledFileWorkingCopy<NotebookFileWorkingCopyModel>;
	private readonly _workingCopyListeners = this._register(new DisposableStore());
	private readonly scratchPad: boolean;

	constructor(
		readonly resource: URI,
		private readonly _hasAssociatedFilePath: boolean,
		readonly viewType: string,
		private readonly _workingCopyManager: IFileWorkingCopyManager<NotebookFileWorkingCopyModel, NotebookFileWorkingCopyModel>,
		scratchpad: boolean,
		@IFilesConfigurationService private readonly _filesConfigurationService: IFilesConfigurationService,
	) {
		super();

		this.scratchPad = scratchpad;
	}

	override dispose(): void {
		this._workingCopy?.dispose();
		super.dispose();
	}

	get notebook(): NotebookTextModel | undefined {
		return this._workingCopy?.model?.notebookModel;
	}

	override isResolved(): this is IResolvedNotebookEditorModel {
		return Boolean(this._workingCopy?.model?.notebookModel);
	}

	async canDispose(): Promise<boolean> {
		if (!this._workingCopy) {
			return true;
		}

		if (SimpleNotebookEditorModel._isStoredFileWorkingCopy(this._workingCopy)) {
			return this._workingCopyManager.stored.canDispose(this._workingCopy);
		} else {
			return true;
		}
	}

	isDirty(): boolean {
		return this._workingCopy?.isDirty() ?? false;
	}

	isModified(): boolean {
		return this._workingCopy?.isModified() ?? false;
	}

	isOrphaned(): boolean {
		return SimpleNotebookEditorModel._isStoredFileWorkingCopy(this._workingCopy) && this._workingCopy.hasState(StoredFileWorkingCopyState.ORPHAN);
	}

	hasAssociatedFilePath(): boolean {
		return !SimpleNotebookEditorModel._isStoredFileWorkingCopy(this._workingCopy) && !!this._workingCopy?.hasAssociatedFilePath;
	}

	isReadonly(): boolean | IMarkdownString {
		if (SimpleNotebookEditorModel._isStoredFileWorkingCopy(this._workingCopy)) {
			return this._workingCopy?.isReadonly();
		} else {
			return this._filesConfigurationService.isReadonly(this.resource);
		}
	}

	get hasErrorState(): boolean {
		if (this._workingCopy && hasKey(this._workingCopy, { hasState: true })) {
			return this._workingCopy.hasState(StoredFileWorkingCopyState.ERROR);
		}

		return false;
	}

	async revert(options?: IRevertOptions): Promise<void> {
		assertType(this.isResolved());
		return this._workingCopy!.revert(options);
	}

	async save(options?: ISaveOptions): Promise<boolean> {
		assertType(this.isResolved());
		return this._workingCopy!.save(options);
	}

	async load(options?: INotebookLoadOptions): Promise<IResolvedNotebookEditorModel> {
		if (!this._workingCopy || !this._workingCopy.model) {
			if (this.resource.scheme === Schemas.untitled) {
				if (this._hasAssociatedFilePath) {
					this._workingCopy = await this._workingCopyManager.resolve({ associatedResource: this.resource });
				} else {
					this._workingCopy = await this._workingCopyManager.resolve({ untitledResource: this.resource, isScratchpad: this.scratchPad });
				}
				this._register(this._workingCopy.onDidRevert(() => this._onDidRevertUntitled.fire()));
			} else {
				this._workingCopy = await this._workingCopyManager.resolve(this.resource, {
					limits: options?.limits,
					reload: options?.forceReadFromFile ? { async: false, force: true } : undefined
				});
				this._workingCopyListeners.add(this._workingCopy.onDidSave(e => this._onDidSave.fire(e)));
				this._workingCopyListeners.add(this._workingCopy.onDidChangeOrphaned(() => this._onDidChangeOrphaned.fire()));
				this._workingCopyListeners.add(this._workingCopy.onDidChangeReadonly(() => this._onDidChangeReadonly.fire()));
			}
			this._workingCopyListeners.add(this._workingCopy.onDidChangeDirty(() => this._onDidChangeDirty.fire(), undefined));

			this._workingCopyListeners.add(this._workingCopy.onWillDispose(() => {
				this._workingCopyListeners.clear();
				this._workingCopy?.model?.dispose();
			}));
		} else {
			await this._workingCopyManager.resolve(this.resource, {
				reload: {
					async: !options?.forceReadFromFile,
					force: options?.forceReadFromFile
				},
				limits: options?.limits
			});
		}

		assertType(this.isResolved());
		return this;
	}

	async saveAs(target: URI): Promise<IUntypedEditorInput | undefined> {
		const newWorkingCopy = await this._workingCopyManager.saveAs(this.resource, target);
		if (!newWorkingCopy) {
			return undefined;
		}
		// this is a little hacky because we leave the new working copy alone. BUT
		// the newly created editor input will pick it up and claim ownership of it.
		return { resource: newWorkingCopy.resource };
	}

	private static _isStoredFileWorkingCopy(candidate?: IStoredFileWorkingCopy<NotebookFileWorkingCopyModel> | IUntitledFileWorkingCopy<NotebookFileWorkingCopyModel>): candidate is IStoredFileWorkingCopy<NotebookFileWorkingCopyModel> {
		const isUntitled = candidate && candidate.capabilities & WorkingCopyCapabilities.Untitled;

		return !isUntitled;
	}
}

export class NotebookFileWorkingCopyModel extends Disposable implements IStoredFileWorkingCopyModel, IUntitledFileWorkingCopyModel {

	private readonly _onDidChangeContent = this._register(new Emitter<IStoredFileWorkingCopyModelContentChangedEvent & IUntitledFileWorkingCopyModelContentChangedEvent>());
	readonly onDidChangeContent = this._onDidChangeContent.event;

	readonly onWillDispose: Event<void>;

	readonly configuration: IFileWorkingCopyModelConfiguration | undefined = undefined;
	save: ((options: IWriteFileOptions, token: CancellationToken) => Promise<IFileStatWithMetadata>) | undefined;

	constructor(
		private readonly _notebookModel: NotebookTextModel,
		private readonly _notebookService: INotebookService,
		private readonly _configurationService: IConfigurationService,
		private readonly _telemetryService: ITelemetryService,
		private readonly _notebookLogService: INotebookLoggingService,
	) {
		super();

		this.onWillDispose = _notebookModel.onWillDispose.bind(_notebookModel);

		this._register(_notebookModel.onDidChangeContent(e => {
			for (const rawEvent of e.rawEvents) {
				if (rawEvent.kind === NotebookCellsChangeType.Initialize) {
					continue;
				}
				if (rawEvent.transient) {
					continue;
				}
				this._onDidChangeContent.fire({
					isRedoing: false, //todo@rebornix forward this information from notebook model
					isUndoing: false,
					isInitial: false, //_notebookModel.cells.length === 0 // todo@jrieken non transient metadata?
				});
				break;
			}
		}));

		const saveWithReducedCommunication = this._configurationService.getValue(NotebookSetting.remoteSaving);

		if (saveWithReducedCommunication || _notebookModel.uri.scheme === Schemas.vscodeRemote) {
			this.configuration = {
				// Intentionally pick a larger delay for triggering backups to allow auto-save
				// to complete first on the optimized save path
				backupDelay: 10000
			};
		}

		// Override save behavior to avoid transferring the buffer across the wire 3 times
		if (saveWithReducedCommunication) {
			this.setSaveDelegate().catch(error => this._notebookLogService.error('WorkingCopyModel', `Failed to set save delegate: ${error}`));
		}
	}

	private async setSaveDelegate() {
		// make sure we wait for a serializer to resolve before we try to handle saves in the EH
		await this.getNotebookSerializer();

		this.save = async (options: IWriteFileOptions, token: CancellationToken) => {
			try {
				let serializer = this._notebookService.tryGetDataProviderSync(this.notebookModel.viewType)?.serializer;

				if (!serializer) {
					this._notebookLogService.info('WorkingCopyModel', 'No serializer found for notebook model, checking if provider still needs to be resolved');
					serializer = await this.getNotebookSerializer().catch(error => {
						this._notebookLogService.error('WorkingCopyModel', `Failed to get notebook serializer: ${error}`);
						// The serializer was set initially but somehow is no longer available
						this.save = undefined;
						throw new NotebookSaveError('Failed to get notebook serializer');
					});
				}

				if (token.isCancellationRequested) {
					throw new CancellationError();
				}

				const stat = await serializer.save(this._notebookModel.uri, this._notebookModel.versionId, options, token);
				return stat;
			} catch (error) {
				if (!token.isCancellationRequested && error.name !== 'Canceled') {
					type notebookSaveErrorData = {
						isRemote: boolean;
						isIPyNbWorkerSerializer: boolean;
						error: string;
					};
					type notebookSaveErrorClassification = {
						owner: 'amunger';
						comment: 'Detect if we are having issues saving a notebook on the Extension Host';
						isRemote: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Whether the save is happening on a remote file system' };
						isIPyNbWorkerSerializer: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Whether the IPynb files are serialized in workers' };
						error: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Info about the error that occurred' };
					};
					const isIPynb = this._notebookModel.viewType === 'jupyter-notebook' || this._notebookModel.viewType === 'interactive';
					const errorMessage = getSaveErrorMessage(error);
					this._telemetryService.publicLogError2<notebookSaveErrorData, notebookSaveErrorClassification>('notebook/SaveError', {
						isRemote: this._notebookModel.uri.scheme === Schemas.vscodeRemote,
						isIPyNbWorkerSerializer: isIPynb && this._configurationService.getValue<boolean>('ipynb.experimental.serialization'),
						error: errorMessage
					});
				}

				throw error;
			}
		};
	}

	override dispose(): void {
		this._notebookModel.dispose();
		super.dispose();
	}

	get notebookModel() {
		return this._notebookModel;
	}

	async snapshot(context: SnapshotContext, token: CancellationToken): Promise<VSBufferReadableStream> {
		return this._notebookService.createNotebookTextDocumentSnapshot(this._notebookModel.uri, context, token);
	}

	async update(stream: VSBufferReadableStream, token: CancellationToken): Promise<void> {
		const serializer = await this.getNotebookSerializer();

		const bytes = await streamToBuffer(stream);
		const data = await serializer.dataToNotebook(bytes);

		if (token.isCancellationRequested) {
			throw new CancellationError();
		}

		this._notebookLogService.info('WorkingCopyModel', 'Notebook content updated from file system - ' + this._notebookModel.uri.toString());
		this._notebookModel.reset(data.cells, data.metadata, serializer.options);
	}

	async getNotebookSerializer(): Promise<INotebookSerializer> {
		const info = await this._notebookService.withNotebookDataProvider(this.notebookModel.viewType);
		if (!(info instanceof SimpleNotebookProviderInfo)) {
			const message = 'CANNOT open notebook with this provider';
			throw new NotebookSaveError(message);
		}

		return info.serializer;
	}

	get versionId() {
		return this._notebookModel.alternativeVersionId;
	}

	pushStackElement(): void {
		this._notebookModel.pushStackElement();
	}
}

export class NotebookFileWorkingCopyModelFactory implements IStoredFileWorkingCopyModelFactory<NotebookFileWorkingCopyModel>, IUntitledFileWorkingCopyModelFactory<NotebookFileWorkingCopyModel> {

	constructor(
		private readonly _viewType: string,
		@INotebookService private readonly _notebookService: INotebookService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@INotebookLoggingService private readonly _notebookLogService: INotebookLoggingService
	) { }

	async createModel(resource: URI, stream: VSBufferReadableStream, token: CancellationToken): Promise<NotebookFileWorkingCopyModel> {

		const notebookModel = this._notebookService.getNotebookTextModel(resource) ??
			await this._notebookService.createNotebookTextModel(this._viewType, resource, stream);

		return new NotebookFileWorkingCopyModel(notebookModel, this._notebookService, this._configurationService, this._telemetryService, this._notebookLogService);
	}
}

//#endregion

class NotebookSaveError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'NotebookSaveError';
	}
}

function getSaveErrorMessage(error: Error): string {
	if (error.name === 'NotebookSaveError') {
		return error.message;
	} else if (error instanceof FileOperationError) {
		switch (error.fileOperationResult) {
			case FileOperationResult.FILE_IS_DIRECTORY:
				return 'File is a directory';
			case FileOperationResult.FILE_NOT_FOUND:
				return 'File not found';
			case FileOperationResult.FILE_NOT_MODIFIED_SINCE:
				return 'File not modified since';
			case FileOperationResult.FILE_MODIFIED_SINCE:
				return 'File modified since';
			case FileOperationResult.FILE_MOVE_CONFLICT:
				return 'File move conflict';
			case FileOperationResult.FILE_WRITE_LOCKED:
				return 'File write locked';
			case FileOperationResult.FILE_PERMISSION_DENIED:
				return 'File permission denied';
			case FileOperationResult.FILE_TOO_LARGE:
				return 'File too large';
			case FileOperationResult.FILE_INVALID_PATH:
				return 'File invalid path';
			case FileOperationResult.FILE_NOT_DIRECTORY:
				return 'File not directory';
			case FileOperationResult.FILE_OTHER_ERROR:
				return 'File other error';
		}
	}
	return 'Unknown error';
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookEditorModelResolverService.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookEditorModelResolverService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { URI } from '../../../../base/common/uri.js';
import { IResolvedNotebookEditorModel, NotebookEditorModelCreationOptions } from './notebookCommon.js';
import { IReference } from '../../../../base/common/lifecycle.js';
import { Event, IWaitUntil } from '../../../../base/common/event.js';
import { NotebookTextModel } from './model/notebookTextModel.js';

export const INotebookEditorModelResolverService = createDecorator<INotebookEditorModelResolverService>('INotebookModelResolverService');

/**
 * A notebook file can only be opened ONCE per notebook type.
 * This event fires when a file is already open as type A
 * and there is request to open it as type B. Listeners must
 * do cleanup (close editor, release references) or the request fails
 */
export interface INotebookConflictEvent extends IWaitUntil {
	resource: URI;
	viewType: string;
}

export interface IUntitledNotebookResource {
	/**
	 * Depending on the value of `untitledResource` will
	 * resolve a untitled notebook that:
	 * - gets a unique name if `undefined` (e.g. `Untitled-1')
	 * - uses the resource directly if the scheme is `untitled:`
	 * - converts any other resource scheme to `untitled:` and will
	 *   assume an associated file path
	 *
	 * Untitled notebook editors with associated path behave slightly
	 * different from other untitled editors:
	 * - they are dirty right when opening
	 * - they will not ask for a file path when saving but use the associated path
	 */
	untitledResource: URI | undefined;
}

export interface INotebookEditorModelResolverService {
	readonly _serviceBrand: undefined;

	readonly onDidSaveNotebook: Event<URI>;
	readonly onDidChangeDirty: Event<IResolvedNotebookEditorModel>;

	readonly onWillFailWithConflict: Event<INotebookConflictEvent>;

	isDirty(resource: URI): boolean;

	createUntitledNotebookTextModel(viewType: string): Promise<NotebookTextModel>;

	resolve(resource: URI, viewType?: string, creationOptions?: NotebookEditorModelCreationOptions): Promise<IReference<IResolvedNotebookEditorModel>>;
	resolve(resource: IUntitledNotebookResource, viewType: string, creationOtions?: NotebookEditorModelCreationOptions): Promise<IReference<IResolvedNotebookEditorModel>>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookEditorModelResolverServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookEditorModelResolverServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { URI } from '../../../../base/common/uri.js';
import { CellUri, IResolvedNotebookEditorModel, NotebookEditorModelCreationOptions, NotebookSetting, NotebookWorkingCopyTypeIdentifier } from './notebookCommon.js';
import { NotebookFileWorkingCopyModel, NotebookFileWorkingCopyModelFactory, SimpleNotebookEditorModel } from './notebookEditorModel.js';
import { combinedDisposable, DisposableStore, dispose, IDisposable, IReference, ReferenceCollection, toDisposable } from '../../../../base/common/lifecycle.js';
import { INotebookService } from './notebookService.js';
import { AsyncEmitter, Emitter, Event } from '../../../../base/common/event.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { INotebookConflictEvent, INotebookEditorModelResolverService, IUntitledNotebookResource } from './notebookEditorModelResolverService.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { FileWorkingCopyManager, IFileWorkingCopyManager } from '../../../services/workingCopy/common/fileWorkingCopyManager.js';
import { Schemas } from '../../../../base/common/network.js';
import { NotebookProviderInfo } from './notebookProvider.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IFileReadLimits } from '../../../../platform/files/common/files.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { INotebookLoggingService } from './notebookLoggingService.js';
import { parse } from '../../../services/notebook/common/notebookDocumentService.js';

class NotebookModelReferenceCollection extends ReferenceCollection<Promise<IResolvedNotebookEditorModel>> {

	private readonly _disposables = new DisposableStore();
	private readonly _workingCopyManagers = new Map<string, IFileWorkingCopyManager<NotebookFileWorkingCopyModel, NotebookFileWorkingCopyModel>>();
	private readonly _modelListener = new Map<IResolvedNotebookEditorModel, IDisposable>();

	private readonly _onDidSaveNotebook = new Emitter<URI>();
	readonly onDidSaveNotebook: Event<URI> = this._onDidSaveNotebook.event;

	private readonly _onDidChangeDirty = new Emitter<IResolvedNotebookEditorModel>();
	readonly onDidChangeDirty: Event<IResolvedNotebookEditorModel> = this._onDidChangeDirty.event;

	private readonly _dirtyStates = new ResourceMap<boolean>();

	private readonly modelsToDispose = new Set<string>();
	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@INotebookService private readonly _notebookService: INotebookService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@INotebookLoggingService private readonly _notebookLoggingService: INotebookLoggingService,
	) {
		super();
	}

	dispose(): void {
		this._disposables.dispose();
		this._onDidSaveNotebook.dispose();
		this._onDidChangeDirty.dispose();
		dispose(this._modelListener.values());
		dispose(this._workingCopyManagers.values());
	}

	isDirty(resource: URI): boolean {
		return this._dirtyStates.get(resource) ?? false;
	}

	isListeningToModel(uri: URI): boolean {
		for (const key of this._modelListener.keys()) {
			if (key.resource.toString() === uri.toString()) {
				return true;
			}
		}
		return false;
	}

	protected async createReferencedObject(key: string, notebookType: string, hasAssociatedFilePath: boolean, limits?: IFileReadLimits, isScratchpad?: boolean, viewType?: string): Promise<IResolvedNotebookEditorModel> {
		// Untrack as being disposed
		this.modelsToDispose.delete(key);

		const uri = URI.parse(key);

		const workingCopyTypeId = NotebookWorkingCopyTypeIdentifier.create(notebookType, viewType);
		let workingCopyManager = this._workingCopyManagers.get(workingCopyTypeId);
		if (!workingCopyManager) {
			const factory = new NotebookFileWorkingCopyModelFactory(notebookType, this._notebookService, this._configurationService, this._telemetryService, this._notebookLoggingService);
			workingCopyManager = this._instantiationService.createInstance(
				FileWorkingCopyManager<NotebookFileWorkingCopyModel, NotebookFileWorkingCopyModel>,
				workingCopyTypeId,
				factory,
				factory,
			);
			this._workingCopyManagers.set(workingCopyTypeId, workingCopyManager);
		}

		const isScratchpadView = isScratchpad || (notebookType === 'interactive' && this._configurationService.getValue<boolean>(NotebookSetting.InteractiveWindowPromptToSave) !== true);
		const model = this._instantiationService.createInstance(SimpleNotebookEditorModel, uri, hasAssociatedFilePath, notebookType, workingCopyManager, isScratchpadView);
		const result = await model.load({ limits });


		// Whenever a notebook model is dirty we automatically reference it so that
		// we can ensure that at least one reference exists. That guarantees that
		// a model with unsaved changes is never disposed.
		let onDirtyAutoReference: IReference<any> | undefined;

		this._modelListener.set(result, combinedDisposable(
			result.onDidSave(() => this._onDidSaveNotebook.fire(result.resource)),
			result.onDidChangeDirty(() => {
				const isDirty = result.isDirty();
				this._dirtyStates.set(result.resource, isDirty);

				// isDirty -> add reference
				// !isDirty -> free reference
				if (isDirty && !onDirtyAutoReference) {
					onDirtyAutoReference = this.acquire(key, notebookType);
				} else if (onDirtyAutoReference) {
					onDirtyAutoReference.dispose();
					onDirtyAutoReference = undefined;
				}

				this._onDidChangeDirty.fire(result);
			}),
			toDisposable(() => onDirtyAutoReference?.dispose()),
		));
		return result;
	}

	protected destroyReferencedObject(key: string, object: Promise<IResolvedNotebookEditorModel>): void {
		this.modelsToDispose.add(key);

		(async () => {
			try {
				const model = await object;

				if (!this.modelsToDispose.has(key)) {
					// return if model has been acquired again meanwhile
					return;
				}

				if (model instanceof SimpleNotebookEditorModel) {
					await model.canDispose();
				}

				if (!this.modelsToDispose.has(key)) {
					// return if model has been acquired again meanwhile
					return;
				}

				// Finally we can dispose the model
				this._modelListener.get(model)?.dispose();
				this._modelListener.delete(model);
				model.dispose();
			} catch (err) {
				this._notebookLoggingService.error('NotebookModelCollection', 'FAILED to destory notebook - ' + err);
			} finally {
				this.modelsToDispose.delete(key); // Untrack as being disposed
			}
		})();
	}
}

export class NotebookModelResolverServiceImpl implements INotebookEditorModelResolverService {

	readonly _serviceBrand: undefined;

	private readonly _data: NotebookModelReferenceCollection;

	readonly onDidSaveNotebook: Event<URI>;
	readonly onDidChangeDirty: Event<IResolvedNotebookEditorModel>;

	private readonly _onWillFailWithConflict = new AsyncEmitter<INotebookConflictEvent>();
	readonly onWillFailWithConflict = this._onWillFailWithConflict.event;

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@INotebookService private readonly _notebookService: INotebookService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IUriIdentityService private readonly _uriIdentService: IUriIdentityService,
	) {
		this._data = instantiationService.createInstance(NotebookModelReferenceCollection);
		this.onDidSaveNotebook = this._data.onDidSaveNotebook;
		this.onDidChangeDirty = this._data.onDidChangeDirty;
	}

	dispose() {
		this._data.dispose();
	}

	isDirty(resource: URI): boolean {
		return this._data.isDirty(resource);
	}

	private createUntitledUri(notebookType: string) {
		const info = this._notebookService.getContributedNotebookType(assertReturnsDefined(notebookType));
		if (!info) {
			throw new Error('UNKNOWN notebook type: ' + notebookType);
		}

		const suffix = NotebookProviderInfo.possibleFileEnding(info.selectors) ?? '';
		for (let counter = 1; ; counter++) {
			const candidate = URI.from({ scheme: Schemas.untitled, path: `Untitled-${counter}${suffix}`, query: notebookType });
			if (!this._notebookService.getNotebookTextModel(candidate) && !this._data.isListeningToModel(candidate)) {
				return candidate;
			}
		}
	}

	private async validateResourceViewType(uri: URI | undefined, viewType: string | undefined) {
		if (!uri && !viewType) {
			throw new Error('Must provide at least one of resource or viewType');
		}

		if (uri?.scheme === CellUri.scheme) {
			const originalUri = uri;
			uri = parse(uri)?.notebook;
			if (!uri) {
				throw new Error(`CANNOT open a cell-uri as notebook. Tried with ${originalUri.toString()}`);
			}
		}

		const resource = this._uriIdentService.asCanonicalUri(uri ?? this.createUntitledUri(viewType!));

		const existingNotebook = this._notebookService.getNotebookTextModel(resource);
		if (!viewType) {
			if (existingNotebook) {
				viewType = existingNotebook.viewType;
			} else {
				await this._extensionService.whenInstalledExtensionsRegistered();
				const providers = this._notebookService.getContributedNotebookTypes(resource);
				viewType = providers.find(provider => provider.priority === 'exclusive')?.id ??
					providers.find(provider => provider.priority === 'default')?.id ??
					providers[0]?.id;
			}
		}

		if (!viewType) {
			throw new Error(`Missing viewType for '${resource}'`);
		}

		if (existingNotebook && existingNotebook.viewType !== viewType) {

			await this._onWillFailWithConflict.fireAsync({ resource: resource, viewType }, CancellationToken.None);

			// check again, listener should have done cleanup
			const existingViewType2 = this._notebookService.getNotebookTextModel(resource)?.viewType;
			if (existingViewType2 && existingViewType2 !== viewType) {
				throw new Error(`A notebook with view type '${existingViewType2}' already exists for '${resource}', CANNOT create another notebook with view type ${viewType}`);
			}
		}
		return { resource, viewType };
	}

	public async createUntitledNotebookTextModel(viewType: string) {
		const resource = this._uriIdentService.asCanonicalUri(this.createUntitledUri(viewType));

		return (await this._notebookService.createNotebookTextModel(viewType, resource));
	}

	async resolve(resource: URI, viewType?: string, options?: NotebookEditorModelCreationOptions): Promise<IReference<IResolvedNotebookEditorModel>>;
	async resolve(resource: IUntitledNotebookResource, viewType: string, options: NotebookEditorModelCreationOptions): Promise<IReference<IResolvedNotebookEditorModel>>;
	async resolve(arg0: URI | IUntitledNotebookResource, viewType?: string, options?: NotebookEditorModelCreationOptions): Promise<IReference<IResolvedNotebookEditorModel>> {
		let resource: URI | undefined;
		let hasAssociatedFilePath;
		if (URI.isUri(arg0)) {
			resource = arg0;
		} else if (arg0.untitledResource) {
			if (arg0.untitledResource.scheme === Schemas.untitled) {
				resource = arg0.untitledResource;
			} else {
				resource = arg0.untitledResource.with({ scheme: Schemas.untitled });
				hasAssociatedFilePath = true;
			}
		}

		const validated = await this.validateResourceViewType(resource, viewType);

		const reference = this._data.acquire(validated.resource.toString(), validated.viewType, hasAssociatedFilePath, options?.limits, options?.scratchpad, options?.viewType);
		try {
			const model = await reference.object;
			return {
				object: model,
				dispose() { reference.dispose(); }
			};
		} catch (err) {
			reference.dispose();
			throw err;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookExecutionService.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookExecutionService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../base/common/lifecycle.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { NotebookCellTextModel } from './model/notebookCellTextModel.js';
import { INotebookTextModel, IOutputDto, IOutputItemDto } from './notebookCommon.js';
import { INotebookCellExecution } from './notebookExecutionStateService.js';

export enum CellExecutionUpdateType {
	Output = 1,
	OutputItems = 2,
	ExecutionState = 3,
}

export interface ICellExecuteOutputEdit {
	editType: CellExecutionUpdateType.Output;
	cellHandle: number;
	append?: boolean;
	outputs: IOutputDto[];
}

export interface ICellExecuteOutputItemEdit {
	editType: CellExecutionUpdateType.OutputItems;
	append?: boolean;
	outputId: string;
	items: IOutputItemDto[];
}

export const INotebookExecutionService = createDecorator<INotebookExecutionService>('INotebookExecutionService');

export interface INotebookExecutionService {
	_serviceBrand: undefined;

	executeNotebookCells(notebook: INotebookTextModel, cells: Iterable<NotebookCellTextModel>, contextKeyService: IContextKeyService): Promise<void>;
	cancelNotebookCells(notebook: INotebookTextModel, cells: Iterable<NotebookCellTextModel>): Promise<void>;
	cancelNotebookCellHandles(notebook: INotebookTextModel, cells: Iterable<number>): Promise<void>;
	registerExecutionParticipant(participant: ICellExecutionParticipant): IDisposable;
}

export interface ICellExecutionParticipant {
	onWillExecuteCell(executions: INotebookCellExecution[]): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookExecutionStateService.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookExecutionStateService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { NotebookCellExecutionState, NotebookExecutionState } from './notebookCommon.js';
import { CellExecutionUpdateType, ICellExecuteOutputEdit, ICellExecuteOutputItemEdit } from './notebookExecutionService.js';

export type ICellExecuteUpdate = ICellExecuteOutputEdit | ICellExecuteOutputItemEdit | ICellExecutionStateUpdate;

export interface ICellExecutionStateUpdate {
	editType: CellExecutionUpdateType.ExecutionState;
	executionOrder?: number;
	runStartTime?: number;
	didPause?: boolean;
	isPaused?: boolean;
}

export interface ICellErrorStackFrame {
	/**
	 * The location of this stack frame. This should be provided as a URI if the
	 * location of the call frame can be accessed by the editor.
	 */
	readonly uri?: UriComponents;

	readonly location?: IRange;

	/**
	 * The name of the stack frame, typically a method or function name.
	 */
	readonly label: string;
}

export interface ICellExecutionError {
	name: string;
	message: string;
	stack: string | ICellErrorStackFrame[] | undefined;
	uri: UriComponents;
	location: IRange | undefined;
}

export interface ICellExecutionComplete {
	runEndTime?: number;
	lastRunSuccess?: boolean;
	error?: ICellExecutionError;
}
export enum NotebookExecutionType {
	cell,
	notebook
}
export interface ICellExecutionStateChangedEvent {
	type: NotebookExecutionType.cell;
	notebook: URI;
	cellHandle: number;
	changed?: INotebookCellExecution; // undefined -> execution was completed
	affectsCell(cell: URI): boolean;
	affectsNotebook(notebook: URI): boolean;
}
export interface IExecutionStateChangedEvent {
	type: NotebookExecutionType.notebook;
	notebook: URI;
	changed?: INotebookExecution; // undefined -> execution was completed
	affectsNotebook(notebook: URI): boolean;
}
export interface INotebookFailStateChangedEvent {
	visible: boolean;
	notebook: URI;
}

export interface IFailedCellInfo {
	cellHandle: number;
	disposable: IDisposable;
	visible: boolean;
}

export const INotebookExecutionStateService = createDecorator<INotebookExecutionStateService>('INotebookExecutionStateService');

export interface INotebookExecutionStateService {
	_serviceBrand: undefined;

	readonly onDidChangeExecution: Event<ICellExecutionStateChangedEvent | IExecutionStateChangedEvent>;
	readonly onDidChangeLastRunFailState: Event<INotebookFailStateChangedEvent>;

	forceCancelNotebookExecutions(notebookUri: URI): void;
	getCellExecutionsForNotebook(notebook: URI): INotebookCellExecution[];
	getCellExecutionsByHandleForNotebook(notebook: URI): Map<number, INotebookCellExecution> | undefined;
	getCellExecution(cellUri: URI): INotebookCellExecution | undefined;
	createCellExecution(notebook: URI, cellHandle: number): INotebookCellExecution;
	getExecution(notebook: URI): INotebookExecution | undefined;
	createExecution(notebook: URI): INotebookExecution;
	getLastFailedCellForNotebook(notebook: URI): number | undefined;
	getLastCompletedCellForNotebook(notebook: URI): number | undefined;
}

export interface INotebookCellExecution {
	readonly notebook: URI;
	readonly cellHandle: number;
	readonly state: NotebookCellExecutionState;
	readonly didPause: boolean;
	readonly isPaused: boolean;

	confirm(): void;
	update(updates: ICellExecuteUpdate[]): void;
	complete(complete: ICellExecutionComplete): void;
}
export interface INotebookExecution {
	readonly notebook: URI;
	readonly state: NotebookExecutionState;

	confirm(): void;
	begin(): void;
	complete(): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookKernelService.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookKernelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction } from '../../../../base/common/actions.js';
import { AsyncIterableProducer } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { INotebookKernelSourceAction } from './notebookCommon.js';

export interface ISelectedNotebooksChangeEvent {
	notebook: URI;
	oldKernel: string | undefined;
	newKernel: string | undefined;
}

export interface INotebookKernelMatchResult {
	readonly selected: INotebookKernel | undefined;
	readonly suggestions: INotebookKernel[];
	readonly all: INotebookKernel[];
	readonly hidden: INotebookKernel[];
}


export interface INotebookKernelChangeEvent {
	label?: true;
	description?: true;
	detail?: true;
	supportedLanguages?: true;
	hasExecutionOrder?: true;
	hasInterruptHandler?: true;
	hasVariableProvider?: true;
}

export interface VariablesResult {
	id: number;
	name: string;
	value: string;
	type?: string;
	hasNamedChildren: boolean;
	indexedChildrenCount: number;
}

export const variablePageSize = 100;

export interface INotebookKernel {
	readonly id: string;
	readonly viewType: string;
	readonly onDidChange: Event<Readonly<INotebookKernelChangeEvent>>;
	readonly extension: ExtensionIdentifier;

	readonly localResourceRoot: URI;
	readonly preloadUris: URI[];
	readonly preloadProvides: string[];

	label: string;
	description?: string;
	detail?: string;
	supportedLanguages: string[];
	implementsInterrupt?: boolean;
	implementsExecutionOrder?: boolean;
	hasVariableProvider?: boolean;

	executeNotebookCellsRequest(uri: URI, cellHandles: number[]): Promise<void>;
	cancelNotebookCellExecution(uri: URI, cellHandles: number[]): Promise<void>;

	provideVariables(notebookUri: URI, parentId: number | undefined, kind: 'named' | 'indexed', start: number, token: CancellationToken): AsyncIterableProducer<VariablesResult>;
}

export const enum ProxyKernelState {
	Disconnected = 1,
	Connected = 2,
	Initializing = 3
}

export interface INotebookProxyKernelChangeEvent extends INotebookKernelChangeEvent {
	connectionState?: true;
}

export interface INotebookKernelDetectionTask {
	readonly notebookType: string;
}

export interface ISourceAction {
	readonly action: IAction;
	readonly onDidChangeState: Event<void>;
	readonly isPrimary?: boolean;
	execution: Promise<void> | undefined;
	runAction: () => Promise<void>;
}

export interface INotebookSourceActionChangeEvent {
	notebook?: URI;
	viewType: string;
}

export interface IKernelSourceActionProvider {
	readonly viewType: string;
	onDidChangeSourceActions?: Event<void>;
	provideKernelSourceActions(): Promise<INotebookKernelSourceAction[]>;
}

export interface INotebookTextModelLike { uri: URI; notebookType: string }

export const INotebookKernelService = createDecorator<INotebookKernelService>('INotebookKernelService');

export interface INotebookKernelService {
	_serviceBrand: undefined;

	readonly onDidAddKernel: Event<INotebookKernel>;
	readonly onDidRemoveKernel: Event<INotebookKernel>;
	readonly onDidChangeSelectedNotebooks: Event<ISelectedNotebooksChangeEvent>;
	readonly onDidChangeNotebookAffinity: Event<void>;
	readonly onDidNotebookVariablesUpdate: Event<URI>;
	registerKernel(kernel: INotebookKernel): IDisposable;

	getMatchingKernel(notebook: INotebookTextModelLike): INotebookKernelMatchResult;

	/**
	 * Returns the selected or only available kernel.
	 */
	getSelectedOrSuggestedKernel(notebook: INotebookTextModelLike): INotebookKernel | undefined;

	/**
	 * Bind a notebook document to a kernel. A notebook is only bound to one kernel
	 * but a kernel can be bound to many notebooks (depending on its configuration)
	 */
	selectKernelForNotebook(kernel: INotebookKernel, notebook: INotebookTextModelLike): void;

	/**
	 * Set the kernel that a notebook should use when it starts up
	 */
	preselectKernelForNotebook(kernel: INotebookKernel, notebook: INotebookTextModelLike): void;

	/**
	 * Set a perference of a kernel for a certain notebook. Higher values win, `undefined` removes the preference
	 */
	updateKernelNotebookAffinity(kernel: INotebookKernel, notebook: URI, preference: number | undefined): void;

	//#region Kernel detection tasks
	readonly onDidChangeKernelDetectionTasks: Event<string>;
	registerNotebookKernelDetectionTask(task: INotebookKernelDetectionTask): IDisposable;
	getKernelDetectionTasks(notebook: INotebookTextModelLike): INotebookKernelDetectionTask[];
	//#endregion

	//#region Kernel source actions
	readonly onDidChangeSourceActions: Event<INotebookSourceActionChangeEvent>;
	getSourceActions(notebook: INotebookTextModelLike, contextKeyService: IContextKeyService | undefined): ISourceAction[];
	getRunningSourceActions(notebook: INotebookTextModelLike): ISourceAction[];
	registerKernelSourceActionProvider(viewType: string, provider: IKernelSourceActionProvider): IDisposable;
	getKernelSourceActions2(notebook: INotebookTextModelLike): Promise<INotebookKernelSourceAction[]>;
	//#endregion

	notifyVariablesChange(notebookUri: URI): void;
}

export const INotebookKernelHistoryService = createDecorator<INotebookKernelHistoryService>('INotebookKernelHistoryService');
export interface INotebookKernelHistoryService {
	_serviceBrand: undefined;
	getKernels(notebook: INotebookTextModelLike): { selected: INotebookKernel | undefined; all: INotebookKernel[] };
	addMostRecentKernel(kernel: INotebookKernel): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookKeymapService.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookKeymapService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const INotebookKeymapService = createDecorator<INotebookKeymapService>('notebookKeymapService');

export interface INotebookKeymapService {
	readonly _serviceBrand: undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookLoggingService.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookLoggingService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const INotebookLoggingService = createDecorator<INotebookLoggingService>('INotebookLoggingService');

export interface INotebookLoggingService {
	readonly _serviceBrand: undefined;
	info(category: string, output: string): void;
	warn(category: string, output: string): void;
	error(category: string, output: string): void;
	debug(category: string, output: string): void;
	trace(category: string, output: string): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookOutputRenderer.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookOutputRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as glob from '../../../../base/common/glob.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { INotebookRendererInfo, ContributedNotebookRendererEntrypoint, NotebookRendererMatch, RendererMessagingSpec, NotebookRendererEntrypoint, INotebookStaticPreloadInfo as INotebookStaticPreloadInfo } from './notebookCommon.js';

class DependencyList {
	private readonly value: ReadonlySet<string>;
	public readonly defined: boolean;

	constructor(value: Iterable<string>) {
		this.value = new Set(value);
		this.defined = this.value.size > 0;
	}

	/** Gets whether any of the 'available' dependencies match the ones in this list */
	public matches(available: ReadonlyArray<string>) {
		// For now this is simple, but this may expand to support globs later
		// @see https://github.com/microsoft/vscode/issues/119899
		return available.some(v => this.value.has(v));
	}
}

export class NotebookOutputRendererInfo implements INotebookRendererInfo {

	readonly id: string;
	readonly entrypoint: NotebookRendererEntrypoint;
	readonly displayName: string;
	readonly extensionLocation: URI;
	readonly extensionId: ExtensionIdentifier;
	readonly hardDependencies: DependencyList;
	readonly optionalDependencies: DependencyList;
	readonly messaging: RendererMessagingSpec;

	readonly mimeTypes: readonly string[];
	private readonly mimeTypeGlobs: glob.ParsedPattern[];

	readonly isBuiltin: boolean;

	constructor(descriptor: {
		readonly id: string;
		readonly displayName: string;
		readonly entrypoint: ContributedNotebookRendererEntrypoint;
		readonly mimeTypes: readonly string[];
		readonly extension: IExtensionDescription;
		readonly dependencies: readonly string[] | undefined;
		readonly optionalDependencies: readonly string[] | undefined;
		readonly requiresMessaging: RendererMessagingSpec | undefined;
	}) {
		this.id = descriptor.id;
		this.extensionId = descriptor.extension.identifier;
		this.extensionLocation = descriptor.extension.extensionLocation;
		this.isBuiltin = descriptor.extension.isBuiltin;

		if (typeof descriptor.entrypoint === 'string') {
			this.entrypoint = {
				extends: undefined,
				path: joinPath(this.extensionLocation, descriptor.entrypoint)
			};
		} else {
			this.entrypoint = {
				extends: descriptor.entrypoint.extends,
				path: joinPath(this.extensionLocation, descriptor.entrypoint.path)
			};
		}

		this.displayName = descriptor.displayName;
		this.mimeTypes = descriptor.mimeTypes;
		this.mimeTypeGlobs = this.mimeTypes.map(pattern => glob.parse(pattern, { ignoreCase: true }));
		this.hardDependencies = new DependencyList(descriptor.dependencies ?? Iterable.empty());
		this.optionalDependencies = new DependencyList(descriptor.optionalDependencies ?? Iterable.empty());
		this.messaging = descriptor.requiresMessaging ?? RendererMessagingSpec.Never;
	}

	public matchesWithoutKernel(mimeType: string) {
		if (!this.matchesMimeTypeOnly(mimeType)) {
			return NotebookRendererMatch.Never;
		}

		if (this.hardDependencies.defined) {
			return NotebookRendererMatch.WithHardKernelDependency;
		}

		if (this.optionalDependencies.defined) {
			return NotebookRendererMatch.WithOptionalKernelDependency;
		}

		return NotebookRendererMatch.Pure;
	}

	public matches(mimeType: string, kernelProvides: ReadonlyArray<string>) {
		if (!this.matchesMimeTypeOnly(mimeType)) {
			return NotebookRendererMatch.Never;
		}

		if (this.hardDependencies.defined) {
			return this.hardDependencies.matches(kernelProvides)
				? NotebookRendererMatch.WithHardKernelDependency
				: NotebookRendererMatch.Never;
		}

		return this.optionalDependencies.matches(kernelProvides)
			? NotebookRendererMatch.WithOptionalKernelDependency
			: NotebookRendererMatch.Pure;
	}

	private matchesMimeTypeOnly(mimeType: string) {
		if (this.entrypoint.extends) { // We're extending another renderer
			return false;
		}

		return this.mimeTypeGlobs.some(pattern => pattern(mimeType)) || this.mimeTypes.some(pattern => pattern === mimeType);
	}
}

export class NotebookStaticPreloadInfo implements INotebookStaticPreloadInfo {

	readonly type: string;
	readonly entrypoint: URI;
	readonly extensionLocation: URI;
	readonly localResourceRoots: readonly URI[];

	constructor(descriptor: {
		readonly type: string;
		readonly entrypoint: string;
		readonly localResourceRoots: readonly string[];
		readonly extension: IExtensionDescription;
	}) {
		this.type = descriptor.type;

		this.entrypoint = joinPath(descriptor.extension.extensionLocation, descriptor.entrypoint);
		this.extensionLocation = descriptor.extension.extensionLocation;
		this.localResourceRoots = descriptor.localResourceRoots.map(root => joinPath(descriptor.extension.extensionLocation, root));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookPerformance.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookPerformance.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export type PerfName = 'startTime' | 'extensionActivated' | 'inputLoaded' | 'webviewCommLoaded' | 'customMarkdownLoaded' | 'editorLoaded';

type PerformanceMark = { [key in PerfName]?: number };

export class NotebookPerfMarks {
	private _marks: PerformanceMark = {};

	get value(): PerformanceMark {
		return { ...this._marks };
	}

	mark(name: PerfName): void {
		if (this._marks[name]) {
			console.error(`Skipping overwrite of notebook perf value: ${name}`);
			return;
		}

		this._marks[name] = Date.now();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as glob from '../../../../base/common/glob.js';
import { URI } from '../../../../base/common/uri.js';
import { basename } from '../../../../base/common/path.js';
import { INotebookExclusiveDocumentFilter, isDocumentExcludePattern, TransientOptions } from './notebookCommon.js';
import { RegisteredEditorPriority } from '../../../services/editor/common/editorResolverService.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';

type NotebookSelector = string | glob.IRelativePattern | INotebookExclusiveDocumentFilter;

export interface NotebookEditorDescriptor {
	readonly extension?: ExtensionIdentifier;
	readonly id: string;
	readonly displayName: string;
	readonly selectors: readonly { filenamePattern?: string; excludeFileNamePattern?: string }[];
	readonly priority: RegisteredEditorPriority;
	readonly providerDisplayName: string;
}

interface INotebookEditorDescriptorDto {
	readonly _selectors: readonly NotebookSelector[];
}

export class NotebookProviderInfo {

	readonly extension?: ExtensionIdentifier;
	readonly id: string;
	readonly displayName: string;
	readonly priority: RegisteredEditorPriority;
	readonly providerDisplayName: string;

	public _selectors: NotebookSelector[];
	get selectors() {
		return this._selectors;
	}
	private _options: TransientOptions;
	get options() {
		return this._options;
	}

	constructor(descriptor: NotebookEditorDescriptor) {
		this.extension = descriptor.extension;
		this.id = descriptor.id;
		this.displayName = descriptor.displayName;
		this._selectors = descriptor.selectors?.map(selector => ({
			include: selector.filenamePattern,
			exclude: selector.excludeFileNamePattern || ''
		}))
			|| (descriptor as unknown as INotebookEditorDescriptorDto)._selectors
			|| [];
		this.priority = descriptor.priority;
		this.providerDisplayName = descriptor.providerDisplayName;
		this._options = {
			transientCellMetadata: {},
			transientDocumentMetadata: {},
			transientOutputs: false,
			cellContentMetadata: {}
		};
	}

	update(args: { selectors?: NotebookSelector[]; options?: TransientOptions }) {
		if (args.selectors) {
			this._selectors = args.selectors;
		}

		if (args.options) {
			this._options = args.options;
		}
	}

	matches(resource: URI): boolean {
		return this.selectors?.some(selector => NotebookProviderInfo.selectorMatches(selector, resource));
	}

	static selectorMatches(selector: NotebookSelector, resource: URI): boolean {
		if (typeof selector === 'string' || glob.isRelativePattern(selector)) {
			if (glob.match(selector, basename(resource.fsPath), { ignoreCase: true })) {
				return true;
			}
		}

		if (!isDocumentExcludePattern(selector)) {
			return false;
		}

		const filenamePattern = selector.include;
		const excludeFilenamePattern = selector.exclude;

		if (glob.match(filenamePattern, basename(resource.fsPath), { ignoreCase: true })) {
			if (excludeFilenamePattern) {
				if (glob.match(excludeFilenamePattern, basename(resource.fsPath), { ignoreCase: true })) {
					return false;
				}
			}
			return true;
		}

		return false;
	}

	static possibleFileEnding(selectors: NotebookSelector[]): string | undefined {
		for (const selector of selectors) {
			const ending = NotebookProviderInfo._possibleFileEnding(selector);
			if (ending) {
				return ending;
			}
		}
		return undefined;
	}

	private static _possibleFileEnding(selector: NotebookSelector): string | undefined {

		const pattern = /^.*(\.[a-zA-Z0-9_-]+)$/;

		let candidate: string | undefined;

		if (typeof selector === 'string') {
			candidate = selector;
		} else if (glob.isRelativePattern(selector)) {
			candidate = selector.pattern;
		} else if (selector.include) {
			return NotebookProviderInfo._possibleFileEnding(selector.include);
		}

		if (candidate) {
			const match = pattern.exec(candidate);
			if (match) {
				return match[1];
			}
		}

		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookRange.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookRange.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * [start, end]
 */
export interface ICellRange {
	/**
	 * zero based index
	 */
	start: number;

	/**
	 * zero based index
	 */
	end: number;
}


export function isICellRange(candidate: unknown): candidate is ICellRange {
	if (!candidate || typeof candidate !== 'object') {
		return false;
	}
	return typeof (candidate as ICellRange).start === 'number'
		&& typeof (candidate as ICellRange).end === 'number';
}

export function cellIndexesToRanges(indexes: number[]) {
	indexes.sort((a, b) => a - b);
	const first = indexes.shift();

	if (first === undefined) {
		return [];
	}

	return indexes.reduce(function (ranges, num) {
		if (num <= ranges[0][1]) {
			ranges[0][1] = num + 1;
		} else {
			ranges.unshift([num, num + 1]);
		}
		return ranges;
	}, [[first, first + 1]]).reverse().map(val => ({ start: val[0], end: val[1] }));
}

export function cellRangesToIndexes(ranges: ICellRange[]) {
	const indexes = ranges.reduce((a, b) => {
		for (let i = b.start; i < b.end; i++) {
			a.push(i);
		}

		return a;
	}, [] as number[]);

	return indexes;
}

export function reduceCellRanges(ranges: ICellRange[]): ICellRange[] {
	const sorted = ranges.sort((a, b) => a.start - b.start);
	const first = sorted[0];

	if (!first) {
		return [];
	}

	const reduced = sorted.reduce((prev: ICellRange[], curr) => {
		const last = prev[prev.length - 1];
		if (last.end >= curr.start) {
			last.end = Math.max(last.end, curr.end);
		} else {
			prev.push(curr);
		}
		return prev;
	}, [first] as ICellRange[]);

	if (reduced.length > 1) {
		// remove the (0, 0) range
		return reduced.filter(range => !(range.start === range.end && range.start === 0));
	}

	return reduced;
}

export function cellRangesEqual(a: ICellRange[], b: ICellRange[]) {
	a = reduceCellRanges(a);
	b = reduceCellRanges(b);
	if (a.length !== b.length) {
		return false;
	}

	for (let i = 0; i < a.length; i++) {
		if (a[i].start !== b[i].start || a[i].end !== b[i].end) {
			return false;
		}
	}

	return true;
}

/**
 * todo@rebornix test and sort
 * @param range
 * @param other
 * @returns
 */

export function cellRangeContains(range: ICellRange, other: ICellRange): boolean {
	return other.start >= range.start && other.end <= range.end;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookRendererMessagingService.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookRendererMessagingService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const INotebookRendererMessagingService = createDecorator<INotebookRendererMessagingService>('INotebookRendererMessagingService');

export interface INotebookRendererMessagingService {
	readonly _serviceBrand: undefined;

	/**
	 * Event that fires when a message should be posted to extension hosts.
	 */
	readonly onShouldPostMessage: Event<{ editorId: string; rendererId: string; message: unknown }>;

	/**
	 * Prepares messaging for the given renderer ID.
	 */
	prepare(rendererId: string): void;
	/**
	 * Gets messaging scoped for a specific editor.
	 */
	getScoped(editorId: string): IScopedRendererMessaging;

	/**
	 * Called when the main thread gets a message for a renderer.
	 */
	receiveMessage(editorId: string | undefined, rendererId: string, message: unknown): Promise<boolean>;
}

export interface IScopedRendererMessaging extends IDisposable {
	/**
	 * Method called when a message is received. Should return a boolean
	 * indicating whether a renderer received it.
	 */
	receiveMessageHandler?: (rendererId: string, message: unknown) => Promise<boolean>;

	/**
	 * Sends a message to an extension from a renderer.
	 */
	postMessage(rendererId: string, message: unknown): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/notebookService.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/notebookService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { URI } from '../../../../base/common/uri.js';
import { NotebookProviderInfo } from './notebookProvider.js';
import { Event } from '../../../../base/common/event.js';
import { INotebookRendererInfo, NotebookData, TransientOptions, IOrderedMimeType, IOutputDto, INotebookContributionData, NotebookExtensionDescription, INotebookStaticPreloadInfo } from './notebookCommon.js';
import { NotebookTextModel } from './model/notebookTextModel.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { NotebookCellTextModel } from './model/notebookCellTextModel.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { VSBuffer, VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { IFileStatWithMetadata, IWriteFileOptions } from '../../../../platform/files/common/files.js';
import { ITextQuery } from '../../../services/search/common/search.js';
import { NotebookPriorityInfo } from '../../search/common/search.js';
import { INotebookFileMatchNoModel } from '../../search/common/searchNotebookHelpers.js';
import { SnapshotContext } from '../../../services/workingCopy/common/fileWorkingCopy.js';


export const INotebookService = createDecorator<INotebookService>('notebookService');

export interface INotebookContentProvider {
	options: TransientOptions;

	open(uri: URI, backupId: string | VSBuffer | undefined, untitledDocumentData: VSBuffer | undefined, token: CancellationToken): Promise<{ data: NotebookData; transientOptions: TransientOptions }>;
	backup(uri: URI, token: CancellationToken): Promise<string | VSBuffer>;
}

export interface INotebookSerializer {
	options: TransientOptions;
	dataToNotebook(data: VSBuffer): Promise<NotebookData>;
	notebookToData(data: NotebookData): Promise<VSBuffer>;
	save(uri: URI, versionId: number, options: IWriteFileOptions, token: CancellationToken): Promise<IFileStatWithMetadata>;
	searchInNotebooks(textQuery: ITextQuery, token: CancellationToken, allPriorityInfo: Map<string, NotebookPriorityInfo[]>): Promise<{ results: INotebookFileMatchNoModel<URI>[]; limitHit: boolean }>;
}

export interface INotebookRawData {
	data: NotebookData;
	transientOptions: TransientOptions;
}

export class SimpleNotebookProviderInfo {
	constructor(
		readonly viewType: string,
		readonly serializer: INotebookSerializer,
		readonly extensionData: NotebookExtensionDescription
	) { }
}

export interface INotebookService {
	readonly _serviceBrand: undefined;
	canResolve(viewType: string): Promise<boolean>;

	readonly onAddViewType: Event<string>;
	readonly onWillRemoveViewType: Event<string>;
	readonly onDidChangeOutputRenderers: Event<void>;
	readonly onWillAddNotebookDocument: Event<NotebookTextModel>;
	readonly onDidAddNotebookDocument: Event<NotebookTextModel>;

	readonly onWillRemoveNotebookDocument: Event<NotebookTextModel>;
	readonly onDidRemoveNotebookDocument: Event<NotebookTextModel>;

	registerNotebookSerializer(viewType: string, extensionData: NotebookExtensionDescription, serializer: INotebookSerializer): IDisposable;
	withNotebookDataProvider(viewType: string): Promise<SimpleNotebookProviderInfo>;
	tryGetDataProviderSync(viewType: string): SimpleNotebookProviderInfo | undefined;

	getOutputMimeTypeInfo(textModel: NotebookTextModel, kernelProvides: readonly string[] | undefined, output: IOutputDto): readonly IOrderedMimeType[];

	getViewTypeProvider(viewType: string): string | undefined;
	getRendererInfo(id: string): INotebookRendererInfo | undefined;
	getRenderers(): INotebookRendererInfo[];

	getStaticPreloads(viewType: string): Iterable<INotebookStaticPreloadInfo>;

	/** Updates the preferred renderer for the given mimetype in the workspace. */
	updateMimePreferredRenderer(viewType: string, mimeType: string, rendererId: string, otherMimetypes: readonly string[]): void;
	saveMimeDisplayOrder(target: ConfigurationTarget): void;

	createNotebookTextModel(viewType: string, uri: URI, stream?: VSBufferReadableStream): Promise<NotebookTextModel>;
	createNotebookTextDocumentSnapshot(uri: URI, context: SnapshotContext, token: CancellationToken): Promise<VSBufferReadableStream>;
	restoreNotebookTextModelFromSnapshot(uri: URI, viewType: string, snapshot: VSBufferReadableStream): Promise<NotebookTextModel>;
	getNotebookTextModel(uri: URI): NotebookTextModel | undefined;
	getNotebookTextModels(): Iterable<NotebookTextModel>;
	listNotebookDocuments(): readonly NotebookTextModel[];

	/**	Register a notebook type that we will handle. The notebook editor will be registered for notebook types contributed by extensions */
	registerContributedNotebookType(viewType: string, data: INotebookContributionData): IDisposable;
	getContributedNotebookType(viewType: string): NotebookProviderInfo | undefined;
	getContributedNotebookTypes(resource?: URI): readonly NotebookProviderInfo[];
	hasSupportedNotebooks(resource: URI): boolean;
	getNotebookProviderResourceRoots(): URI[];

	setToCopy(items: NotebookCellTextModel[], isCopy: boolean): void;
	getToCopy(): { items: NotebookCellTextModel[]; isCopy: boolean } | undefined;
	clearEditorCache(): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/model/cellEdit.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/model/cellEdit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IResourceUndoRedoElement, UndoRedoElementType } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { URI } from '../../../../../base/common/uri.js';
import { NotebookCellTextModel } from './notebookCellTextModel.js';
import { ISelectionState, NotebookCellMetadata } from '../notebookCommon.js';

/**
 * It should not modify Undo/Redo stack
 */
export interface ITextCellEditingDelegate {
	insertCell?(index: number, cell: NotebookCellTextModel, endSelections?: ISelectionState): void;
	deleteCell?(index: number, endSelections?: ISelectionState): void;
	replaceCell?(index: number, count: number, cells: NotebookCellTextModel[], endSelections?: ISelectionState): void;
	moveCell?(fromIndex: number, length: number, toIndex: number, beforeSelections: ISelectionState | undefined, endSelections?: ISelectionState): void;
	updateCellMetadata?(index: number, newMetadata: NotebookCellMetadata): void;
}

export class MoveCellEdit implements IResourceUndoRedoElement {
	type: UndoRedoElementType.Resource = UndoRedoElementType.Resource;
	get label() {
		return this.length === 1 ? 'Move Cell' : 'Move Cells';
	}
	code: string = 'undoredo.textBufferEdit';

	constructor(
		public resource: URI,
		private fromIndex: number,
		private length: number,
		private toIndex: number,
		private editingDelegate: ITextCellEditingDelegate,
		private beforedSelections: ISelectionState | undefined,
		private endSelections: ISelectionState | undefined
	) {
	}

	undo(): void {
		if (!this.editingDelegate.moveCell) {
			throw new Error('Notebook Move Cell not implemented for Undo/Redo');
		}

		this.editingDelegate.moveCell(this.toIndex, this.length, this.fromIndex, this.endSelections, this.beforedSelections);
	}

	redo(): void {
		if (!this.editingDelegate.moveCell) {
			throw new Error('Notebook Move Cell not implemented for Undo/Redo');
		}

		this.editingDelegate.moveCell(this.fromIndex, this.length, this.toIndex, this.beforedSelections, this.endSelections);
	}
}

export class SpliceCellsEdit implements IResourceUndoRedoElement {
	type: UndoRedoElementType.Resource = UndoRedoElementType.Resource;
	get label() {
		// Compute the most appropriate labels
		if (this.diffs.length === 1 && this.diffs[0][1].length === 0) {
			return this.diffs[0][2].length > 1 ? 'Insert Cells' : 'Insert Cell';
		}
		if (this.diffs.length === 1 && this.diffs[0][2].length === 0) {
			return this.diffs[0][1].length > 1 ? 'Delete Cells' : 'Delete Cell';
		}
		// Default to Insert Cell
		return 'Insert Cell';
	}
	code: string = 'undoredo.textBufferEdit';
	constructor(
		public resource: URI,
		private diffs: [number, NotebookCellTextModel[], NotebookCellTextModel[]][],
		private editingDelegate: ITextCellEditingDelegate,
		private beforeHandles: ISelectionState | undefined,
		private endHandles: ISelectionState | undefined
	) {
	}

	undo(): void {
		if (!this.editingDelegate.replaceCell) {
			throw new Error('Notebook Replace Cell not implemented for Undo/Redo');
		}

		this.diffs.forEach(diff => {
			this.editingDelegate.replaceCell!(diff[0], diff[2].length, diff[1], this.beforeHandles);
		});
	}

	redo(): void {
		if (!this.editingDelegate.replaceCell) {
			throw new Error('Notebook Replace Cell not implemented for Undo/Redo');
		}

		this.diffs.reverse().forEach(diff => {
			this.editingDelegate.replaceCell!(diff[0], diff[1].length, diff[2], this.endHandles);
		});
	}
}

export class CellMetadataEdit implements IResourceUndoRedoElement {
	type: UndoRedoElementType.Resource = UndoRedoElementType.Resource;
	label: string = 'Update Cell Metadata';
	code: string = 'undoredo.textBufferEdit';
	constructor(
		public resource: URI,
		readonly index: number,
		readonly oldMetadata: NotebookCellMetadata,
		readonly newMetadata: NotebookCellMetadata,
		private editingDelegate: ITextCellEditingDelegate,
	) {

	}

	undo(): void {
		if (!this.editingDelegate.updateCellMetadata) {
			return;
		}

		this.editingDelegate.updateCellMetadata(this.index, this.oldMetadata);
	}

	redo(): void | Promise<void> {
		if (!this.editingDelegate.updateCellMetadata) {
			return;
		}

		this.editingDelegate.updateCellMetadata(this.index, this.newMetadata);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/model/notebookCellOutputTextModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/model/notebookCellOutputTextModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../../base/common/buffer.js';
import { Emitter } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ICellOutput, IOutputDto, IOutputItemDto, compressOutputItemStreams } from '../notebookCommon.js';
import { isTextStreamMime } from '../../../../../base/common/mime.js';

export class NotebookCellOutputTextModel extends Disposable implements ICellOutput {

	private _onDidChangeData = this._register(new Emitter<void>());
	onDidChangeData = this._onDidChangeData.event;

	get outputs() {
		return this._rawOutput.outputs || [];
	}

	get metadata(): Record<string, unknown> | undefined {
		return this._rawOutput.metadata;
	}

	get outputId(): string {
		return this._rawOutput.outputId;
	}

	/**
	 * Alternative output id that's reused when the output is updated.
	 */
	private _alternativeOutputId: string;

	get alternativeOutputId(): string {
		return this._alternativeOutputId;
	}

	private _versionId = 0;

	get versionId() {
		return this._versionId;
	}

	constructor(
		private _rawOutput: IOutputDto
	) {
		super();

		this._alternativeOutputId = this._rawOutput.outputId;
	}

	replaceData(rawData: IOutputDto) {
		this.versionedBufferLengths = {};
		this._rawOutput = rawData;
		this.optimizeOutputItems();
		this._versionId = this._versionId + 1;
		this._onDidChangeData.fire();
	}

	appendData(items: IOutputItemDto[]) {
		this.trackBufferLengths();
		this._rawOutput.outputs.push(...items);
		this.optimizeOutputItems();
		this._versionId = this._versionId + 1;
		this._onDidChangeData.fire();
	}

	private trackBufferLengths() {
		this.outputs.forEach(output => {
			if (isTextStreamMime(output.mime)) {
				if (!this.versionedBufferLengths[output.mime]) {
					this.versionedBufferLengths[output.mime] = {};
				}
				this.versionedBufferLengths[output.mime][this.versionId] = output.data.byteLength;
			}
		});
	}

	// mime: versionId: buffer length
	private versionedBufferLengths: Record<string, Record<number, number>> = {};

	appendedSinceVersion(versionId: number, mime: string): VSBuffer | undefined {
		const bufferLength = this.versionedBufferLengths[mime]?.[versionId];
		const output = this.outputs.find(output => output.mime === mime);
		if (bufferLength && output) {
			return output.data.slice(bufferLength);
		}

		return undefined;
	}

	private optimizeOutputItems() {
		if (this.outputs.length > 1 && this.outputs.every(item => isTextStreamMime(item.mime))) {
			// Look for the mimes in the items, and keep track of their order.
			// Merge the streams into one output item, per mime type.
			const mimeOutputs = new Map<string, Uint8Array[]>();
			const mimeTypes: string[] = [];
			this.outputs.forEach(item => {
				let items: Uint8Array[];
				if (mimeOutputs.has(item.mime)) {
					items = mimeOutputs.get(item.mime)!;
				} else {
					items = [];
					mimeOutputs.set(item.mime, items);
					mimeTypes.push(item.mime);
				}
				items.push(item.data.buffer);
			});
			this.outputs.length = 0;
			mimeTypes.forEach(mime => {
				const compressionResult = compressOutputItemStreams(mimeOutputs.get(mime)!);
				this.outputs.push({
					mime,
					data: compressionResult.data
				});
				if (compressionResult.didCompression) {
					// we can't rely on knowing buffer lengths if we've erased previous lines
					this.versionedBufferLengths = {};
				}
			});
		}
	}

	asDto(): IOutputDto {
		return {
			// data: this._data,
			metadata: this._rawOutput.metadata,
			outputs: this._rawOutput.outputs,
			outputId: this._rawOutput.outputId
		};
	}

	bumpVersion() {
		this._versionId = this._versionId + 1;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/model/notebookCellTextModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/model/notebookCellTextModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import { hash, StringSHA1 } from '../../../../../base/common/hash.js';
import { Disposable, DisposableStore, dispose } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import * as UUID from '../../../../../base/common/uuid.js';
import { Range } from '../../../../../editor/common/core/range.js';
import * as model from '../../../../../editor/common/model.js';
import { PieceTreeTextBuffer } from '../../../../../editor/common/model/pieceTreeTextBuffer/pieceTreeTextBuffer.js';
import { createTextBuffer, TextModel } from '../../../../../editor/common/model/textModel.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../../editor/common/languages/modesRegistry.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { NotebookCellOutputTextModel } from './notebookCellOutputTextModel.js';
import { CellInternalMetadataChangedEvent, CellKind, ICell, ICellDto2, ICellOutput, IOutputItemDto, NotebookCellCollapseState, NotebookCellDefaultCollapseConfig, NotebookCellInternalMetadata, NotebookCellMetadata, NotebookCellOutputsSplice, TransientCellMetadata, TransientOptions } from '../notebookCommon.js';
import { ThrottledDelayer } from '../../../../../base/common/async.js';
import { ILanguageDetectionService } from '../../../../services/languageDetection/common/languageDetectionWorkerService.js';
import { toFormattedString } from '../../../../../base/common/jsonFormatter.js';
import { IModelContentChangedEvent } from '../../../../../editor/common/textModelEvents.js';
import { splitLines } from '../../../../../base/common/strings.js';
import { INotebookLoggingService } from '../notebookLoggingService.js';

export class NotebookCellTextModel extends Disposable implements ICell {
	private readonly _onDidChangeTextModel = this._register(new Emitter<void>());
	readonly onDidChangeTextModel: Event<void> = this._onDidChangeTextModel.event;
	private readonly _onDidChangeOutputs = this._register(new Emitter<NotebookCellOutputsSplice>());
	readonly onDidChangeOutputs: Event<NotebookCellOutputsSplice> = this._onDidChangeOutputs.event;

	private readonly _onDidChangeOutputItems = this._register(new Emitter<void>());
	readonly onDidChangeOutputItems: Event<void> = this._onDidChangeOutputItems.event;

	private readonly _onDidChangeContent = this._register(new Emitter<'content' | 'language' | 'mime' | { type: 'model'; event: IModelContentChangedEvent }>());
	readonly onDidChangeContent: Event<'content' | 'language' | 'mime' | { type: 'model'; event: IModelContentChangedEvent }> = this._onDidChangeContent.event;

	private readonly _onDidChangeMetadata = this._register(new Emitter<void>());
	readonly onDidChangeMetadata: Event<void> = this._onDidChangeMetadata.event;

	private readonly _onDidChangeInternalMetadata = this._register(new Emitter<CellInternalMetadataChangedEvent>());
	readonly onDidChangeInternalMetadata: Event<CellInternalMetadataChangedEvent> = this._onDidChangeInternalMetadata.event;

	private readonly _onDidChangeLanguage = this._register(new Emitter<string>());
	readonly onDidChangeLanguage: Event<string> = this._onDidChangeLanguage.event;

	private _outputs: NotebookCellOutputTextModel[];

	get outputs(): ICellOutput[] {
		return this._outputs;
	}

	private _metadata: NotebookCellMetadata;

	get metadata() {
		return this._metadata;
	}

	set metadata(newMetadata: NotebookCellMetadata) {
		this._metadata = newMetadata;
		this._hash = null;
		this._onDidChangeMetadata.fire();
	}

	private _internalMetadata: NotebookCellInternalMetadata;

	get internalMetadata() {
		return this._internalMetadata;
	}

	set internalMetadata(newInternalMetadata: NotebookCellInternalMetadata) {
		const lastRunSuccessChanged = this._internalMetadata.lastRunSuccess !== newInternalMetadata.lastRunSuccess;
		newInternalMetadata = {
			...newInternalMetadata,
			...{ runStartTimeAdjustment: computeRunStartTimeAdjustment(this._internalMetadata, newInternalMetadata) }
		};
		this._internalMetadata = newInternalMetadata;
		this._hash = null;
		this._onDidChangeInternalMetadata.fire({ lastRunSuccessChanged });
	}

	get language() {
		return this._language;
	}

	set language(newLanguage: string) {
		if (this._textModel
			// 1. the language update is from workspace edit, checking if it's the same as text model's mode
			&& this._textModel.getLanguageId() === this._languageService.getLanguageIdByLanguageName(newLanguage)
			// 2. the text model's mode might be the same as the `this.language`, even if the language friendly name is not the same, we should not trigger an update
			&& this._textModel.getLanguageId() === this._languageService.getLanguageIdByLanguageName(this.language)) {
			return;
		}


		this._hasLanguageSetExplicitly = true;
		this._setLanguageInternal(newLanguage);
	}

	public get mime(): string | undefined {
		return this._mime;
	}

	public set mime(newMime: string | undefined) {
		if (this._mime === newMime) {
			return;
		}
		this._mime = newMime;
		this._hash = null;
		this._onDidChangeContent.fire('mime');
	}

	private _textBuffer!: model.ITextBuffer;

	get textBuffer() {
		if (this._textBuffer) {
			return this._textBuffer;
		}

		this._textBuffer = this._register(createTextBuffer(this._source, this._defaultEOL).textBuffer);

		this._register(this._textBuffer.onDidChangeContent(() => {
			this._hash = null;
			if (!this._textModel) {
				this._onDidChangeContent.fire('content');
			}
			this.autoDetectLanguage();
		}));

		return this._textBuffer;
	}

	private _textBufferHash: string | null = null;
	private _hash: number | null = null;

	private _versionId: number = 1;
	private _alternativeId: number = 1;
	get alternativeId(): number {
		return this._alternativeId;
	}

	private readonly _textModelDisposables = this._register(new DisposableStore());
	private _textModel: TextModel | undefined = undefined;
	get textModel(): TextModel | undefined {
		return this._textModel;
	}

	set textModel(m: TextModel | undefined) {
		if (this._textModel === m) {
			return;
		}

		this._textModelDisposables.clear();
		this._textModel = m;
		if (this._textModel) {
			this.setRegisteredLanguage(this._languageService, this._textModel.getLanguageId(), this.language);

			// Listen to language changes on the model
			this._textModelDisposables.add(this._textModel.onDidChangeLanguage((e) => this.setRegisteredLanguage(this._languageService, e.newLanguage, this.language)));
			this._textModelDisposables.add(this._textModel.onWillDispose(() => this.textModel = undefined));
			this._textModelDisposables.add(this._textModel.onDidChangeContent((e) => {
				if (this._textModel) {
					this._versionId = this._textModel.getVersionId();
					this._alternativeId = this._textModel.getAlternativeVersionId();
				}
				this._textBufferHash = null;
				this._onDidChangeContent.fire('content');
				this._onDidChangeContent.fire({ type: 'model', event: e });
			}));

			this._textModel._overwriteVersionId(this._versionId);
			this._textModel._overwriteAlternativeVersionId(this._versionId);
			this._onDidChangeTextModel.fire();
		}
	}

	private setRegisteredLanguage(languageService: ILanguageService, newLanguage: string, currentLanguage: string) {
		// The language defined in the cell might not be supported in the editor so the text model might be using the default fallback
		// If so let's not modify the language
		const isFallBackLanguage = (newLanguage === PLAINTEXT_LANGUAGE_ID || newLanguage === 'jupyter');
		if (!languageService.isRegisteredLanguageId(currentLanguage) && isFallBackLanguage) {
			// notify to display warning, but don't change the language
			this._onDidChangeLanguage.fire(currentLanguage);
		} else {
			this.language = newLanguage;
		}
	}
	private static readonly AUTO_DETECT_LANGUAGE_THROTTLE_DELAY = 600;
	private readonly autoDetectLanguageThrottler = this._register(new ThrottledDelayer<void>(NotebookCellTextModel.AUTO_DETECT_LANGUAGE_THROTTLE_DELAY));
	private _autoLanguageDetectionEnabled: boolean = false;
	private _hasLanguageSetExplicitly: boolean = false;
	get hasLanguageSetExplicitly(): boolean { return this._hasLanguageSetExplicitly; }

	private _source: string;
	private _language: string;
	private _mime: string | undefined;
	public readonly cellKind: CellKind;
	public readonly collapseState: NotebookCellCollapseState | undefined;

	constructor(
		readonly uri: URI,
		public readonly handle: number,
		cell: ICellDto2,
		public readonly transientOptions: TransientOptions,
		private readonly _languageService: ILanguageService,
		private readonly _defaultEOL: model.DefaultEndOfLine,
		defaultCollapseConfig: NotebookCellDefaultCollapseConfig | undefined,
		private readonly _languageDetectionService: ILanguageDetectionService | undefined = undefined,
		private readonly _notebookLoggingService: INotebookLoggingService
	) {
		super();
		this._source = cell.source;
		this._language = cell.language;
		this._mime = cell.mime;
		this.cellKind = cell.cellKind;
		// Compute collapse state: use cell's state if provided, otherwise use default config for this cell kind
		const defaultConfig = cell.cellKind === CellKind.Code ? defaultCollapseConfig?.codeCell : defaultCollapseConfig?.markupCell;
		this.collapseState = cell.collapseState ?? (defaultConfig ?? undefined);
		this._outputs = cell.outputs.map(op => new NotebookCellOutputTextModel(op));
		this._metadata = cell.metadata ?? {};
		this._internalMetadata = cell.internalMetadata ?? {};
	}

	enableAutoLanguageDetection() {
		this._autoLanguageDetectionEnabled = true;
		this.autoDetectLanguage();
	}

	async autoDetectLanguage(): Promise<void> {
		if (this._autoLanguageDetectionEnabled) {
			this.autoDetectLanguageThrottler.trigger(() => this._doAutoDetectLanguage());
		}
	}

	private async _doAutoDetectLanguage(): Promise<void> {
		if (this.hasLanguageSetExplicitly) {
			return;
		}

		const newLanguage = await this._languageDetectionService?.detectLanguage(this.uri);
		if (!newLanguage) {
			return;
		}

		if (this._textModel
			&& this._textModel.getLanguageId() === this._languageService.getLanguageIdByLanguageName(newLanguage)
			&& this._textModel.getLanguageId() === this._languageService.getLanguageIdByLanguageName(this.language)) {
			return;
		}

		this._setLanguageInternal(newLanguage);
	}

	private _setLanguageInternal(newLanguage: string) {
		const newLanguageId = this._languageService.getLanguageIdByLanguageName(newLanguage);

		if (newLanguageId === null) {
			return;
		}

		if (this._textModel) {
			const languageId = this._languageService.createById(newLanguageId);
			this._textModel.setLanguage(languageId.languageId);
		}

		if (this._language === newLanguage) {
			return;
		}

		this._language = newLanguage;
		this._hash = null;
		this._onDidChangeLanguage.fire(newLanguage);
		this._onDidChangeContent.fire('language');
	}

	resetTextBuffer(textBuffer: model.ITextBuffer) {
		this._textBuffer = textBuffer;
	}

	getValue(): string {
		const fullRange = this.getFullModelRange();
		const eol = this.textBuffer.getEOL();
		if (eol === '\n') {
			return this.textBuffer.getValueInRange(fullRange, model.EndOfLinePreference.LF);
		} else {
			return this.textBuffer.getValueInRange(fullRange, model.EndOfLinePreference.CRLF);
		}
	}

	getTextBufferHash() {
		if (this._textBufferHash !== null) {
			return this._textBufferHash;
		}

		const shaComputer = new StringSHA1();
		const snapshot = this.textBuffer.createSnapshot(false);
		let text: string | null;
		while ((text = snapshot.read())) {
			shaComputer.update(text);
		}
		this._textBufferHash = shaComputer.digest();
		return this._textBufferHash;
	}

	getHashValue(): number {
		if (this._hash !== null) {
			return this._hash;
		}

		this._hash = hash([hash(this.language), this.getTextBufferHash(), this._getPersisentMetadata(), this.transientOptions.transientOutputs ? [] : this._outputs.map(op => ({
			outputs: op.outputs.map(output => ({
				mime: output.mime,
				data: Array.from(output.data.buffer)
			})),
			metadata: op.metadata
		}))]);
		return this._hash;
	}

	private _getPersisentMetadata() {
		return getFormattedMetadataJSON(this.transientOptions.transientCellMetadata, this.metadata, this.language);
	}

	getTextLength(): number {
		return this.textBuffer.getLength();
	}

	getFullModelRange() {
		const lineCount = this.textBuffer.getLineCount();
		return new Range(1, 1, lineCount, this.textBuffer.getLineLength(lineCount) + 1);
	}

	spliceNotebookCellOutputs(splice: NotebookCellOutputsSplice): void {
		this._notebookLoggingService.trace('textModelEdits', `splicing outputs at ${splice.start} length: ${splice.deleteCount} with ${splice.newOutputs.length} new outputs`);
		if (splice.deleteCount > 0 && splice.newOutputs.length > 0) {
			const commonLen = Math.min(splice.deleteCount, splice.newOutputs.length);
			// update
			for (let i = 0; i < commonLen; i++) {
				const currentOutput = this.outputs[splice.start + i];
				const newOutput = splice.newOutputs[i];

				this.replaceOutput(currentOutput.outputId, newOutput);
			}

			const removed = this.outputs.splice(splice.start + commonLen, splice.deleteCount - commonLen, ...splice.newOutputs.slice(commonLen));
			removed.forEach(output => output.dispose());
			this._onDidChangeOutputs.fire({ start: splice.start + commonLen, deleteCount: splice.deleteCount - commonLen, newOutputs: splice.newOutputs.slice(commonLen) });
		} else {
			const removed = this.outputs.splice(splice.start, splice.deleteCount, ...splice.newOutputs);
			removed.forEach(output => output.dispose());
			this._onDidChangeOutputs.fire(splice);
		}
	}

	replaceOutput(outputId: string, newOutputItem: ICellOutput) {
		const outputIndex = this.outputs.findIndex(output => output.outputId === outputId);

		if (outputIndex < 0) {
			return false;
		}

		this._notebookLoggingService.trace('textModelEdits', `replacing an output item at index ${outputIndex}`);
		const output = this.outputs[outputIndex];
		// convert to dto and dispose the cell output model
		output.replaceData({
			outputs: newOutputItem.outputs,
			outputId: newOutputItem.outputId,
			metadata: newOutputItem.metadata
		});
		newOutputItem.dispose();
		this._onDidChangeOutputItems.fire();
		return true;
	}

	changeOutputItems(outputId: string, append: boolean, items: IOutputItemDto[]): boolean {
		const outputIndex = this.outputs.findIndex(output => output.outputId === outputId);

		if (outputIndex < 0) {
			return false;
		}

		const output = this.outputs[outputIndex];
		this._notebookLoggingService.trace('textModelEdits', `${append ? 'appending' : 'replacing'} ${items.length} output items to for output index ${outputIndex}`);
		if (append) {
			output.appendData(items);
		} else {
			output.replaceData({ outputId: outputId, outputs: items, metadata: output.metadata });
		}
		this._onDidChangeOutputItems.fire();
		return true;
	}

	private _outputNotEqualFastCheck(left: ICellOutput[], right: ICellOutput[]) {
		if (left.length !== right.length) {
			return false;
		}

		for (let i = 0; i < this.outputs.length; i++) {
			const l = left[i];
			const r = right[i];

			if (l.outputs.length !== r.outputs.length) {
				return false;
			}

			for (let k = 0; k < l.outputs.length; k++) {
				if (l.outputs[k].mime !== r.outputs[k].mime) {
					return false;
				}

				if (l.outputs[k].data.byteLength !== r.outputs[k].data.byteLength) {
					return false;
				}
			}
		}

		return true;
	}

	equal(b: NotebookCellTextModel): boolean {
		if (this.language !== b.language) {
			return false;
		}

		if (this.outputs.length !== b.outputs.length) {
			return false;
		}

		if (this.getTextLength() !== b.getTextLength()) {
			return false;
		}

		if (!this.transientOptions.transientOutputs) {
			// compare outputs

			if (!this._outputNotEqualFastCheck(this.outputs, b.outputs)) {
				return false;
			}
		}

		return this.getHashValue() === b.getHashValue();
	}

	/**
	 * Only compares
	 * - language
	 * - mime
	 * - cellKind
	 * - internal metadata (conditionally)
	 * - source
	 */
	fastEqual(b: ICellDto2, ignoreMetadata: boolean): boolean {
		if (this.language !== b.language) {
			return false;
		}

		if (this.mime !== b.mime) {
			return false;
		}

		if (this.cellKind !== b.cellKind) {
			return false;
		}

		if (!ignoreMetadata) {
			if (this.internalMetadata?.executionOrder !== b.internalMetadata?.executionOrder
				|| this.internalMetadata?.lastRunSuccess !== b.internalMetadata?.lastRunSuccess
				|| this.internalMetadata?.runStartTime !== b.internalMetadata?.runStartTime
				|| this.internalMetadata?.runStartTimeAdjustment !== b.internalMetadata?.runStartTimeAdjustment
				|| this.internalMetadata?.runEndTime !== b.internalMetadata?.runEndTime) {
				return false;
			}
		}

		// Once we attach the cell text buffer to an editor, the source of truth is the text buffer instead of the original source
		if (this._textBuffer) {
			if (!NotebookCellTextModel.linesAreEqual(this.textBuffer.getLinesContent(), b.source)) {
				return false;
			}
		} else if (this._source !== b.source) {
			return false;
		}

		return true;
	}

	private static linesAreEqual(aLines: string[], b: string) {
		const bLines = splitLines(b);
		if (aLines.length !== bLines.length) {
			return false;
		}
		for (let i = 0; i < aLines.length; i++) {
			if (aLines[i] !== bLines[i]) {
				return false;
			}
		}
		return true;
	}

	override dispose() {
		dispose(this._outputs);
		// Manually release reference to previous text buffer to avoid large leaks
		// in case someone leaks a CellTextModel reference
		const emptyDisposedTextBuffer = new PieceTreeTextBuffer([], '', '\n', false, false, true, true);
		emptyDisposedTextBuffer.dispose();
		this._textBuffer = emptyDisposedTextBuffer;
		super.dispose();
	}
}

export function cloneNotebookCellTextModel(cell: NotebookCellTextModel) {
	return {
		source: cell.getValue(),
		language: cell.language,
		mime: cell.mime,
		cellKind: cell.cellKind,
		outputs: cell.outputs.map(output => ({
			outputs: output.outputs,
			/* paste should generate new outputId */ outputId: UUID.generateUuid()
		})),
		metadata: {}
	};
}

function computeRunStartTimeAdjustment(oldMetadata: NotebookCellInternalMetadata, newMetadata: NotebookCellInternalMetadata): number | undefined {
	if (oldMetadata.runStartTime !== newMetadata.runStartTime && typeof newMetadata.runStartTime === 'number') {
		const offset = Date.now() - newMetadata.runStartTime;
		return offset < 0 ? Math.abs(offset) : 0;
	} else {
		return newMetadata.runStartTimeAdjustment;
	}
}


export function getFormattedMetadataJSON(transientCellMetadata: TransientCellMetadata | undefined, metadata: NotebookCellMetadata, language?: string, sortKeys?: boolean): string {
	let filteredMetadata: { [key: string]: any } = {};

	if (transientCellMetadata) {
		const keys = new Set([...Object.keys(metadata)]);
		for (const key of keys) {
			if (!(transientCellMetadata[key as keyof NotebookCellMetadata])
			) {
				filteredMetadata[key] = metadata[key as keyof NotebookCellMetadata];
			}
		}
	} else {
		filteredMetadata = metadata;
	}

	const obj = {
		language,
		...filteredMetadata
	};
	// Give preference to the language we have been given.
	// Metadata can contain `language` due to round-tripping of cell metadata.
	// I.e. we add it here, and then from SCM when we revert the cell, we get this same metadata back with the `language` property.
	if (language) {
		obj.language = language;
	}
	const metadataSource = toFormattedString(sortKeys ? sortObjectPropertiesRecursively(obj) : obj, {});

	return metadataSource;
}


/**
 * Sort the JSON to ensure when diffing, the JSON keys are sorted & matched correctly in diff view.
 */
export function sortObjectPropertiesRecursively(obj: any): any {
	if (Array.isArray(obj)) {
		return obj.map(sortObjectPropertiesRecursively);
	}
	if (obj !== undefined && obj !== null && typeof obj === 'object' && Object.keys(obj).length > 0) {
		return (
			Object.keys(obj)
				.sort()
				.reduce<Record<string, any>>((sortedObj, prop) => {
					sortedObj[prop] = sortObjectPropertiesRecursively(obj[prop]);
					return sortedObj;
				}, {})
		);
	}
	return obj;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/model/notebookMetadataTextModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/model/notebookMetadataTextModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { toFormattedString } from '../../../../../base/common/jsonFormatter.js';
import { INotebookDocumentMetadataTextModel, INotebookTextModel, NotebookCellMetadata, NotebookCellsChangeType, NotebookDocumentMetadata, NotebookMetadataUri, TransientDocumentMetadata } from '../notebookCommon.js';
import { StringSHA1 } from '../../../../../base/common/hash.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { DefaultEndOfLine, EndOfLinePreference, ITextBuffer } from '../../../../../editor/common/model.js';
import { Emitter } from '../../../../../base/common/event.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { createTextBuffer } from '../../../../../editor/common/model/textModel.js';

export function getFormattedNotebookMetadataJSON(transientMetadata: TransientDocumentMetadata | undefined, metadata: NotebookDocumentMetadata) {
	let filteredMetadata: { [key: string]: any } = {};

	if (transientMetadata) {
		const keys = new Set([...Object.keys(metadata)]);
		for (const key of keys) {
			if (!(transientMetadata[key as keyof NotebookCellMetadata])
			) {
				filteredMetadata[key] = metadata[key as keyof NotebookCellMetadata];
			}
		}
	} else {
		filteredMetadata = metadata;
	}

	const metadataSource = toFormattedString(filteredMetadata, {});

	return metadataSource;
}

export class NotebookDocumentMetadataTextModel extends Disposable implements INotebookDocumentMetadataTextModel {
	public readonly uri: URI;
	public get metadata(): NotebookDocumentMetadata {
		return this.notebookModel.metadata;
	}
	private readonly _onDidChange = this._register(new Emitter<void>());
	public readonly onDidChange = this._onDidChange.event;

	private _textBufferHash: string | null = null;
	private _textBuffer?: ITextBuffer;
	get textBuffer() {
		if (this._textBuffer) {
			return this._textBuffer;
		}

		const source = getFormattedNotebookMetadataJSON(this.notebookModel.transientOptions.transientDocumentMetadata, this.metadata);
		this._textBuffer = this._register(createTextBuffer(source, DefaultEndOfLine.LF).textBuffer);

		this._register(this._textBuffer.onDidChangeContent(() => {
			this._onDidChange.fire();
		}));

		return this._textBuffer;
	}

	constructor(public readonly notebookModel: INotebookTextModel) {
		super();
		this.uri = NotebookMetadataUri.generate(this.notebookModel.uri);
		this._register(this.notebookModel.onDidChangeContent((e) => {
			if (e.rawEvents.some(event => event.kind === NotebookCellsChangeType.ChangeDocumentMetadata || event.kind === NotebookCellsChangeType.ModelChange)) {
				this._textBuffer?.dispose();
				this._textBuffer = undefined;
				this._textBufferHash = null;
				this._onDidChange.fire();
			}
		}));
	}

	getHash() {
		if (this._textBufferHash !== null) {
			return this._textBufferHash;
		}

		const shaComputer = new StringSHA1();
		const snapshot = this.textBuffer.createSnapshot(false);
		let text: string | null;
		while ((text = snapshot.read())) {
			shaComputer.update(text);
		}
		this._textBufferHash = shaComputer.digest();
		return this._textBufferHash;
	}

	public getValue() {
		const fullRange = this.getFullModelRange();
		const eol = this.textBuffer.getEOL();
		if (eol === '\n') {
			return this.textBuffer.getValueInRange(fullRange, EndOfLinePreference.LF);
		} else {
			return this.textBuffer.getValueInRange(fullRange, EndOfLinePreference.CRLF);
		}
	}
	private getFullModelRange() {
		const lineCount = this.textBuffer.getLineCount();
		return new Range(1, 1, lineCount, this.textBuffer.getLineLength(lineCount) + 1);
	}

}
```

--------------------------------------------------------------------------------

````
