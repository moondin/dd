---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 332
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 332 of 552)

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

---[FILE: src/vs/workbench/browser/parts/editor/editorPane.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/editorPane.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Composite } from '../../composite.js';
import { IEditorPane, GroupIdentifier, IEditorMemento, IEditorOpenContext, isEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IEditorGroup, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { LRUCache, Touch } from '../../../../base/common/map.js';
import { URI } from '../../../../base/common/uri.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { isEmptyObject } from '../../../../base/common/types.js';
import { DEFAULT_EDITOR_MIN_DIMENSIONS, DEFAULT_EDITOR_MAX_DIMENSIONS } from './editor.js';
import { joinPath, IExtUri, isEqual } from '../../../../base/common/resources.js';
import { indexOfPath } from '../../../../base/common/extpath.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { ITextResourceConfigurationChangeEvent, ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { IBoundarySashes } from '../../../../base/browser/ui/sash/sash.js';
import { getWindowById } from '../../../../base/browser/dom.js';

/**
 * The base class of editors in the workbench. Editors register themselves for specific editor inputs.
 * Editors are layed out in the editor part of the workbench in editor groups. Multiple editors can be
 * open at the same time. Each editor has a minimized representation that is good enough to provide some
 * information about the state of the editor data.
 *
 * The workbench will keep an editor alive after it has been created and show/hide it based on
 * user interaction. The lifecycle of a editor goes in the order:
 *
 * - `createEditor()`
 * - `setEditorVisible()`
 * - `layout()`
 * - `setInput()`
 * - `focus()`
 * - `dispose()`: when the editor group the editor is in closes
 *
 * During use of the workbench, a editor will often receive a `clearInput()`, `setEditorVisible()`, `layout()` and
 * `focus()` calls, but only one `create()` and `dispose()` call.
 *
 * This class is only intended to be subclassed and not instantiated.
 */
export abstract class EditorPane<MementoType extends object = object> extends Composite<MementoType> implements IEditorPane {

	//#region Events

	readonly onDidChangeSizeConstraints = Event.None;

	protected readonly _onDidChangeControl = this._register(new Emitter<void>());
	readonly onDidChangeControl = this._onDidChangeControl.event;

	//#endregion

	private static readonly EDITOR_MEMENTOS = new Map<string, EditorMemento<unknown>>();

	get minimumWidth() { return DEFAULT_EDITOR_MIN_DIMENSIONS.width; }
	get maximumWidth() { return DEFAULT_EDITOR_MAX_DIMENSIONS.width; }
	get minimumHeight() { return DEFAULT_EDITOR_MIN_DIMENSIONS.height; }
	get maximumHeight() { return DEFAULT_EDITOR_MAX_DIMENSIONS.height; }

	protected _input: EditorInput | undefined;
	get input(): EditorInput | undefined { return this._input; }

	protected _options: IEditorOptions | undefined;
	get options(): IEditorOptions | undefined { return this._options; }

	get window() { return getWindowById(this.group.windowId, true).window; }

	/**
	 * Should be overridden by editors that have their own ScopedContextKeyService
	 */
	get scopedContextKeyService(): IContextKeyService | undefined { return undefined; }

	constructor(
		id: string,
		readonly group: IEditorGroup,
		telemetryService: ITelemetryService,
		themeService: IThemeService,
		storageService: IStorageService
	) {
		super(id, telemetryService, themeService, storageService);
	}

	override create(parent: HTMLElement): void {
		super.create(parent);

		// Create Editor
		this.createEditor(parent);
	}

	/**
	 * Called to create the editor in the parent HTMLElement. Subclasses implement
	 * this method to construct the editor widget.
	 */
	protected abstract createEditor(parent: HTMLElement): void;

	/**
	 * Note: Clients should not call this method, the workbench calls this
	 * method. Calling it otherwise may result in unexpected behavior.
	 *
	 * Sets the given input with the options to the editor. The input is guaranteed
	 * to be different from the previous input that was set using the `input.matches()`
	 * method.
	 *
	 * The provided context gives more information around how the editor was opened.
	 *
	 * The provided cancellation token should be used to test if the operation
	 * was cancelled.
	 */
	async setInput(input: EditorInput, options: IEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		this._input = input;
		this._options = options;
	}

	/**
	 * Called to indicate to the editor that the input should be cleared and
	 * resources associated with the input should be freed.
	 *
	 * This method can be called based on different contexts, e.g. when opening
	 * a different input or different editor control or when closing all editors
	 * in a group.
	 *
	 * To monitor the lifecycle of editor inputs, you should not rely on this
	 * method, rather refer to the listeners on `IEditorGroup` via `IEditorGroupsService`.
	 */
	clearInput(): void {
		this._input = undefined;
		this._options = undefined;
	}

	/**
	 * Note: Clients should not call this method, the workbench calls this
	 * method. Calling it otherwise may result in unexpected behavior.
	 *
	 * Sets the given options to the editor. Clients should apply the options
	 * to the current input.
	 */
	setOptions(options: IEditorOptions | undefined): void {
		this._options = options;
	}

	override setVisible(visible: boolean): void {
		super.setVisible(visible);

		// Propagate to Editor
		this.setEditorVisible(visible);
	}

	/**
	 * Indicates that the editor control got visible or hidden.
	 *
	 * @param visible the state of visibility of this editor
	 */
	protected setEditorVisible(visible: boolean): void {
		// Subclasses can implement
	}

	setBoundarySashes(_sashes: IBoundarySashes) {
		// Subclasses can implement
	}

	protected getEditorMemento<T>(editorGroupService: IEditorGroupsService, configurationService: ITextResourceConfigurationService, key: string, limit: number = 10): IEditorMemento<T> {
		const mementoKey = `${this.getId()}${key}`;

		let editorMemento = EditorPane.EDITOR_MEMENTOS.get(mementoKey);
		if (!editorMemento) {
			editorMemento = this._register(new EditorMemento(this.getId(), key, this.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE), limit, editorGroupService, configurationService));
			EditorPane.EDITOR_MEMENTOS.set(mementoKey, editorMemento);
		}

		return editorMemento as IEditorMemento<T>;
	}

	getViewState(): object | undefined {

		// Subclasses to override
		return undefined;
	}

	protected override saveState(): void {

		// Save all editor memento for this editor type
		for (const [, editorMemento] of EditorPane.EDITOR_MEMENTOS) {
			if (editorMemento.id === this.getId()) {
				editorMemento.saveState();
			}
		}

		super.saveState();
	}

	override dispose(): void {
		this._input = undefined;
		this._options = undefined;

		super.dispose();
	}
}

interface MapGroupToMemento<T> {
	[group: GroupIdentifier]: T;
}

export class EditorMemento<T> extends Disposable implements IEditorMemento<T> {

	private static readonly SHARED_EDITOR_STATE = -1; // pick a number < 0 to be outside group id range

	private cache: LRUCache<string, MapGroupToMemento<T>> | undefined;
	private cleanedUp = false;
	private editorDisposables: Map<EditorInput, IDisposable> | undefined;
	private shareEditorState = false;

	constructor(
		readonly id: string,
		private readonly key: string,
		private readonly memento: T,
		private readonly limit: number,
		private readonly editorGroupService: IEditorGroupsService,
		private readonly configurationService: ITextResourceConfigurationService
	) {
		super();

		this.updateConfiguration(undefined);
		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.configurationService.onDidChangeConfiguration(e => this.updateConfiguration(e)));
	}

	private updateConfiguration(e: ITextResourceConfigurationChangeEvent | undefined): void {
		if (!e || e.affectsConfiguration(undefined, 'workbench.editor.sharedViewState')) {
			this.shareEditorState = this.configurationService.getValue(undefined, 'workbench.editor.sharedViewState') === true;
		}
	}

	saveEditorState(group: IEditorGroup, resource: URI, state: T): void;
	saveEditorState(group: IEditorGroup, editor: EditorInput, state: T): void;
	saveEditorState(group: IEditorGroup, resourceOrEditor: URI | EditorInput, state: T): void {
		const resource = this.doGetResource(resourceOrEditor);
		if (!resource || !group) {
			return; // we are not in a good state to save any state for a resource
		}

		const cache = this.doLoad();

		// Ensure mementos for resource map
		let mementosForResource = cache.get(resource.toString());
		if (!mementosForResource) {
			mementosForResource = Object.create(null) as MapGroupToMemento<T>;
			cache.set(resource.toString(), mementosForResource);
		}

		// Store state for group
		mementosForResource[group.id] = state;

		// Store state as most recent one based on settings
		if (this.shareEditorState) {
			mementosForResource[EditorMemento.SHARED_EDITOR_STATE] = state;
		}

		// Automatically clear when editor input gets disposed if any
		if (isEditorInput(resourceOrEditor)) {
			this.clearEditorStateOnDispose(resource, resourceOrEditor);
		}
	}

	loadEditorState(group: IEditorGroup, resource: URI): T | undefined;
	loadEditorState(group: IEditorGroup, editor: EditorInput): T | undefined;
	loadEditorState(group: IEditorGroup, resourceOrEditor: URI | EditorInput): T | undefined {
		const resource = this.doGetResource(resourceOrEditor);
		if (!resource || !group) {
			return; // we are not in a good state to load any state for a resource
		}

		const cache = this.doLoad();

		const mementosForResource = cache.get(resource.toString());
		if (mementosForResource) {
			const mementoForResourceAndGroup = mementosForResource[group.id];

			// Return state for group if present
			if (mementoForResourceAndGroup) {
				return mementoForResourceAndGroup;
			}

			// Return most recent state based on settings otherwise
			if (this.shareEditorState) {
				return mementosForResource[EditorMemento.SHARED_EDITOR_STATE];
			}
		}

		return undefined;
	}

	clearEditorState(resource: URI, group?: IEditorGroup): void;
	clearEditorState(editor: EditorInput, group?: IEditorGroup): void;
	clearEditorState(resourceOrEditor: URI | EditorInput, group?: IEditorGroup): void {
		if (isEditorInput(resourceOrEditor)) {
			this.editorDisposables?.delete(resourceOrEditor);
		}

		const resource = this.doGetResource(resourceOrEditor);
		if (resource) {
			const cache = this.doLoad();

			// Clear state for group
			if (group) {
				const mementosForResource = cache.get(resource.toString());
				if (mementosForResource) {
					delete mementosForResource[group.id];

					if (isEmptyObject(mementosForResource)) {
						cache.delete(resource.toString());
					}
				}
			}

			// Clear state across all groups for resource
			else {
				cache.delete(resource.toString());
			}
		}
	}

	clearEditorStateOnDispose(resource: URI, editor: EditorInput): void {
		if (!this.editorDisposables) {
			this.editorDisposables = new Map<EditorInput, IDisposable>();
		}

		if (!this.editorDisposables.has(editor)) {
			this.editorDisposables.set(editor, Event.once(editor.onWillDispose)(() => {
				this.clearEditorState(resource);
				this.editorDisposables?.delete(editor);
			}));
		}
	}

	moveEditorState(source: URI, target: URI, comparer: IExtUri): void {
		const cache = this.doLoad();

		// We need a copy of the keys to not iterate over
		// newly inserted elements.
		const cacheKeys = [...cache.keys()];
		for (const cacheKey of cacheKeys) {
			const resource = URI.parse(cacheKey);

			if (!comparer.isEqualOrParent(resource, source)) {
				continue; // not matching our resource
			}

			// Determine new resulting target resource
			let targetResource: URI;
			if (isEqual(source, resource)) {
				targetResource = target; // file got moved
			} else {
				const index = indexOfPath(resource.path, source.path);
				targetResource = joinPath(target, resource.path.substr(index + source.path.length + 1)); // parent folder got moved
			}

			// Don't modify LRU state
			const value = cache.get(cacheKey, Touch.None);
			if (value) {
				cache.delete(cacheKey);
				cache.set(targetResource.toString(), value);
			}
		}
	}

	private doGetResource(resourceOrEditor: URI | EditorInput): URI | undefined {
		if (isEditorInput(resourceOrEditor)) {
			return resourceOrEditor.resource;
		}

		return resourceOrEditor;
	}

	private doLoad(): LRUCache<string, MapGroupToMemento<T>> {
		if (!this.cache) {
			this.cache = new LRUCache<string, MapGroupToMemento<T>>(this.limit);

			// Restore from serialized map state
			const rawEditorMemento = this.memento[this.key as keyof T];
			if (Array.isArray(rawEditorMemento)) {
				this.cache.fromJSON(rawEditorMemento);
			}
		}

		return this.cache;
	}

	saveState(): void {
		const cache = this.doLoad();

		// Cleanup once during session
		if (!this.cleanedUp) {
			this.cleanUp();
			this.cleanedUp = true;
		}

		(this.memento as Record<string, unknown>)[this.key] = cache.toJSON();
	}

	private cleanUp(): void {
		const cache = this.doLoad();

		// Remove groups from states that no longer exist. Since we modify the
		// cache and its is a LRU cache make a copy to ensure iteration succeeds
		const entries = [...cache.entries()];
		for (const [resource, mapGroupToMementos] of entries) {
			for (const group of Object.keys(mapGroupToMementos)) {
				const groupId: GroupIdentifier = Number(group);
				if (groupId === EditorMemento.SHARED_EDITOR_STATE && this.shareEditorState) {
					continue; // skip over shared entries if sharing is enabled
				}

				if (!this.editorGroupService.getGroup(groupId)) {
					delete mapGroupToMementos[groupId];
					if (isEmptyObject(mapGroupToMementos)) {
						cache.delete(resource);
					}
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/editorPanes.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/editorPanes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { IAction } from '../../../../base/common/actions.js';
import { Emitter } from '../../../../base/common/event.js';
import Severity from '../../../../base/common/severity.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { EditorExtensions, EditorInputCapabilities, IEditorOpenContext, IVisibleEditorPane, isEditorOpenError } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { Dimension, show, hide, IDomNodePagePosition, isAncestor, getActiveElement, getWindowById, isEditableElement, $ } from '../../../../base/browser/dom.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IEditorPaneRegistry, IEditorPaneDescriptor } from '../../editor.js';
import { IWorkbenchLayoutService } from '../../../services/layout/browser/layoutService.js';
import { EditorPane } from './editorPane.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IEditorProgressService, LongRunningOperation } from '../../../../platform/progress/common/progress.js';
import { IEditorGroupView, DEFAULT_EDITOR_MIN_DIMENSIONS, DEFAULT_EDITOR_MAX_DIMENSIONS, IInternalEditorOpenOptions } from './editor.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { ErrorPlaceholderEditor, IErrorEditorPlaceholderOptions, WorkspaceTrustRequiredPlaceholderEditor } from './editorPlaceholder.js';
import { EditorOpenSource, IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IDialogService, IPromptButton, IPromptCancelButton } from '../../../../platform/dialogs/common/dialogs.js';
import { IBoundarySashes } from '../../../../base/browser/ui/sash/sash.js';
import { IHostService } from '../../../services/host/browser/host.js';

export interface IOpenEditorResult {

	/**
	 * The editor pane used for opening. This can be a generic
	 * placeholder in certain cases, e.g. when workspace trust
	 * is required, or an editor fails to restore.
	 *
	 * Will be `undefined` if an error occurred while trying to
	 * open the editor and in cases where no placeholder is being
	 * used.
	 */
	readonly pane?: EditorPane;

	/**
	 * Whether the editor changed as a result of opening.
	 */
	readonly changed?: boolean;

	/**
	 * This property is set when an editor fails to restore and
	 * is shown with a generic place holder. It allows callers
	 * to still present the error to the user in that case.
	 */
	readonly error?: Error;

	/**
	 * This property indicates whether the open editor operation was
	 * cancelled or not. The operation may have been cancelled
	 * in case another editor open operation was triggered right
	 * after cancelling this one out.
	 */
	readonly cancelled?: boolean;
}

export class EditorPanes extends Disposable {

	//#region Events

	private readonly _onDidFocus = this._register(new Emitter<void>());
	readonly onDidFocus = this._onDidFocus.event;

	private _onDidChangeSizeConstraints = this._register(new Emitter<{ width: number; height: number } | undefined>());
	readonly onDidChangeSizeConstraints = this._onDidChangeSizeConstraints.event;

	//#endregion

	get minimumWidth() { return this._activeEditorPane?.minimumWidth ?? DEFAULT_EDITOR_MIN_DIMENSIONS.width; }
	get minimumHeight() { return this._activeEditorPane?.minimumHeight ?? DEFAULT_EDITOR_MIN_DIMENSIONS.height; }
	get maximumWidth() { return this._activeEditorPane?.maximumWidth ?? DEFAULT_EDITOR_MAX_DIMENSIONS.width; }
	get maximumHeight() { return this._activeEditorPane?.maximumHeight ?? DEFAULT_EDITOR_MAX_DIMENSIONS.height; }

	private _activeEditorPane: EditorPane | null = null;
	get activeEditorPane(): IVisibleEditorPane | null { return this._activeEditorPane as IVisibleEditorPane | null; }

	private readonly editorPanes: EditorPane[] = [];
	private readonly mapEditorPaneToPendingSetInput = new Map<EditorPane, Promise<void>>();

	private readonly activeEditorPaneDisposables = this._register(new DisposableStore());

	private pagePosition: IDomNodePagePosition | undefined;
	private boundarySashes: IBoundarySashes | undefined;

	private readonly editorOperation: LongRunningOperation;
	private readonly editorPanesRegistry = Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane);

	constructor(
		private readonly editorGroupParent: HTMLElement,
		private readonly editorPanesParent: HTMLElement,
		private readonly groupView: IEditorGroupView,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IEditorProgressService editorProgressService: IEditorProgressService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustService: IWorkspaceTrustManagementService,
		@ILogService private readonly logService: ILogService,
		@IDialogService private readonly dialogService: IDialogService,
		@IHostService private readonly hostService: IHostService
	) {
		super();

		this.editorOperation = this._register(new LongRunningOperation(editorProgressService));

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.workspaceTrustService.onDidChangeTrust(() => this.onDidChangeWorkspaceTrust()));
	}

	private onDidChangeWorkspaceTrust() {

		// If the active editor pane requires workspace trust
		// we need to re-open it anytime trust changes to
		// account for it.
		// For that we explicitly call into the group-view
		// to handle errors properly.
		const editor = this._activeEditorPane?.input;
		const options = this._activeEditorPane?.options;
		if (editor?.hasCapability(EditorInputCapabilities.RequiresTrust)) {
			this.groupView.openEditor(editor, options);
		}
	}

	async openEditor(editor: EditorInput, options: IEditorOptions | undefined, internalOptions: IInternalEditorOpenOptions | undefined, context: IEditorOpenContext = Object.create(null)): Promise<IOpenEditorResult> {
		try {
			return await this.doOpenEditor(this.getEditorPaneDescriptor(editor), editor, options, internalOptions, context);
		} catch (error) {

			// First check if caller instructed us to ignore error handling
			if (options?.ignoreError) {
				return { error };
			}

			// In case of an error when opening an editor, we still want to show
			// an editor in the desired location to preserve the user intent and
			// view state (e.g. when restoring).
			//
			// For that reason we have place holder editors that can convey a
			// message with actions the user can click on.

			return this.doShowError(error, editor, options, internalOptions, context);
		}
	}

	private async doShowError(error: Error, editor: EditorInput, options: IEditorOptions | undefined, internalOptions: IInternalEditorOpenOptions | undefined, context?: IEditorOpenContext): Promise<IOpenEditorResult> {

		// Always log the error to figure out what is going on
		this.logService.error(error);

		// Show as modal dialog when explicit user action unless disabled
		let errorHandled = false;
		if (options?.source === EditorOpenSource.USER && (!isEditorOpenError(error) || error.allowDialog)) {
			errorHandled = await this.doShowErrorDialog(error, editor);
		}

		// Return early if the user dealt with the error already
		if (errorHandled) {
			return { error };
		}

		// Show as editor placeholder: pass over the error to display
		const editorPlaceholderOptions: IErrorEditorPlaceholderOptions = { ...options };
		if (!isCancellationError(error)) {
			editorPlaceholderOptions.error = error;
		}

		return {
			...(await this.doOpenEditor(ErrorPlaceholderEditor.DESCRIPTOR, editor, editorPlaceholderOptions, internalOptions, context)),
			error
		};
	}

	private async doShowErrorDialog(error: Error, editor: EditorInput): Promise<boolean> {
		let severity = Severity.Error;
		let message: string | undefined = undefined;
		let detail: string | undefined = toErrorMessage(error);
		let errorActions: readonly IAction[] | undefined = undefined;

		if (isEditorOpenError(error)) {
			errorActions = error.actions;
			severity = error.forceSeverity ?? Severity.Error;
			if (error.forceMessage) {
				message = error.message;
				detail = undefined;
			}
		}

		if (!message) {
			message = localize('editorOpenErrorDialog', "Unable to open '{0}'", editor.getName());
		}

		const buttons: IPromptButton<IAction | undefined>[] = [];
		if (errorActions && errorActions.length > 0) {
			for (const errorAction of errorActions) {
				buttons.push({
					label: errorAction.label,
					run: () => errorAction
				});
			}
		} else {
			buttons.push({
				label: localize({ key: 'ok', comment: ['&& denotes a mnemonic'] }, "&&OK"),
				run: () => undefined
			});
		}

		let cancelButton: IPromptCancelButton<undefined> | undefined = undefined;
		if (buttons.length === 1) {
			cancelButton = {
				run: () => {
					errorHandled = true; // treat cancel as handled and do not show placeholder

					return undefined;
				}
			};
		}

		let errorHandled = false;  // by default, show placeholder

		const { result } = await this.dialogService.prompt({
			type: severity,
			message,
			detail,
			buttons,
			cancelButton
		});

		if (result) {
			const errorActionResult = result.run();
			if (errorActionResult instanceof Promise) {
				errorActionResult.catch(error => this.dialogService.error(toErrorMessage(error)));
			}

			errorHandled = true; // treat custom error action as handled and do not show placeholder
		}

		return errorHandled;
	}

	private async doOpenEditor(descriptor: IEditorPaneDescriptor, editor: EditorInput, options: IEditorOptions | undefined, internalOptions: IInternalEditorOpenOptions | undefined, context: IEditorOpenContext = Object.create(null)): Promise<IOpenEditorResult> {

		// Editor pane
		const pane = this.doShowEditorPane(descriptor);

		// Remember current active element for deciding to restore focus later
		const activeElement = getActiveElement();

		// Apply input to pane
		const { changed, cancelled } = await this.doSetInput(pane, editor, options, context);

		// Make sure to pass focus to the pane or otherwise
		// make sure that the pane window is visible unless
		// this has been explicitly disabled.
		if (!cancelled) {
			const focus = !options?.preserveFocus;
			if (focus && this.shouldRestoreFocus(activeElement)) {
				pane.focus();
			} else if (!internalOptions?.preserveWindowOrder) {
				this.hostService.moveTop(getWindowById(this.groupView.windowId, true).window);
			}
		}

		return { pane, changed, cancelled };
	}

	private shouldRestoreFocus(expectedActiveElement: Element | null): boolean {
		if (!this.layoutService.isRestored()) {
			return true; // restore focus if we are not restored yet on startup
		}

		if (!expectedActiveElement) {
			return true; // restore focus if nothing was focused
		}

		const activeElement = getActiveElement();
		if (!activeElement || activeElement === expectedActiveElement.ownerDocument.body) {
			return true; // restore focus if nothing is focused currently
		}

		const same = expectedActiveElement === activeElement;
		if (same) {
			return true; // restore focus if same element is still active
		}

		if (!isEditableElement(activeElement)) {

			// This is to avoid regressions from not restoring focus as we used to:
			// Only allow a different input element (or textarea) to remain focused
			// but not other elements that do not accept text input.

			return true;
		}

		if (isAncestor(activeElement, this.editorGroupParent)) {
			return true; // restore focus if active element is still inside our editor group
		}

		return false; // do not restore focus
	}

	private getEditorPaneDescriptor(editor: EditorInput): IEditorPaneDescriptor {
		if (editor.hasCapability(EditorInputCapabilities.RequiresTrust) && !this.workspaceTrustService.isWorkspaceTrusted()) {
			// Workspace trust: if an editor signals it needs workspace trust
			// but the current workspace is untrusted, we fallback to a generic
			// editor descriptor to indicate this an do NOT load the registered
			// editor.
			return WorkspaceTrustRequiredPlaceholderEditor.DESCRIPTOR;
		}

		return assertReturnsDefined(this.editorPanesRegistry.getEditorPane(editor));
	}

	private doShowEditorPane(descriptor: IEditorPaneDescriptor): EditorPane {

		// Return early if the currently active editor pane can handle the input
		if (this._activeEditorPane && descriptor.describes(this._activeEditorPane)) {
			return this._activeEditorPane;
		}

		// Hide active one first
		this.doHideActiveEditorPane();

		// Create editor pane
		const editorPane = this.doCreateEditorPane(descriptor);

		// Set editor as active
		this.doSetActiveEditorPane(editorPane);

		// Show editor
		const container = assertReturnsDefined(editorPane.getContainer());
		this.editorPanesParent.appendChild(container);
		show(container);

		// Indicate to editor that it is now visible
		editorPane.setVisible(true);

		// Layout
		if (this.pagePosition) {
			editorPane.layout(new Dimension(this.pagePosition.width, this.pagePosition.height), { top: this.pagePosition.top, left: this.pagePosition.left });
		}

		// Boundary sashes
		if (this.boundarySashes) {
			editorPane.setBoundarySashes(this.boundarySashes);
		}

		return editorPane;
	}

	private doCreateEditorPane(descriptor: IEditorPaneDescriptor): EditorPane {

		// Instantiate editor
		const editorPane = this.doInstantiateEditorPane(descriptor);

		// Create editor container as needed
		if (!editorPane.getContainer()) {
			const editorPaneContainer = $('.editor-instance');

			// It is cruicial to append the container to its parent before
			// passing on to the create() method of the pane so that the
			// right `window` can be determined in floating window cases.
			this.editorPanesParent.appendChild(editorPaneContainer);

			try {
				editorPane.create(editorPaneContainer);
			} catch (error) {

				// At this point the editor pane container is not healthy
				// and as such, we remove it from the pane parent and hide
				// it so that we have a chance to show an error placeholder.
				// Not doing so would result in multiple `.editor-instance`
				// lingering around in the DOM.

				editorPaneContainer.remove();
				hide(editorPaneContainer);

				throw error;
			}
		}

		return editorPane;
	}

	private doInstantiateEditorPane(descriptor: IEditorPaneDescriptor): EditorPane {

		// Return early if already instantiated
		const existingEditorPane = this.editorPanes.find(editorPane => descriptor.describes(editorPane));
		if (existingEditorPane) {
			return existingEditorPane;
		}

		// Otherwise instantiate new
		const editorPane = this._register(descriptor.instantiate(this.instantiationService, this.groupView));
		this.editorPanes.push(editorPane);

		return editorPane;
	}

	private doSetActiveEditorPane(editorPane: EditorPane | null) {
		this._activeEditorPane = editorPane;

		// Clear out previous active editor pane listeners
		this.activeEditorPaneDisposables.clear();

		// Listen to editor pane changes
		if (editorPane) {
			this.activeEditorPaneDisposables.add(editorPane.onDidChangeSizeConstraints(e => this._onDidChangeSizeConstraints.fire(e)));
			this.activeEditorPaneDisposables.add(editorPane.onDidFocus(() => this._onDidFocus.fire()));
		}

		// Indicate that size constraints could have changed due to new editor
		this._onDidChangeSizeConstraints.fire(undefined);
	}

	private async doSetInput(editorPane: EditorPane, editor: EditorInput, options: IEditorOptions | undefined, context: IEditorOpenContext): Promise<{ changed: boolean; cancelled: boolean }> {

		// If the input did not change, return early and only
		// apply the options unless the options instruct us to
		// force open it even if it is the same
		let inputMatches = editorPane.input?.matches(editor);
		if (inputMatches && !options?.forceReload) {

			// We have to await a pending `setInput()` call for this
			// pane before we can call into `setOptions()`, otherwise
			// we risk calling when the input is not yet fully applied.
			if (this.mapEditorPaneToPendingSetInput.has(editorPane)) {
				await this.mapEditorPaneToPendingSetInput.get(editorPane);
			}

			// At this point, the input might have changed, so we check again
			inputMatches = editorPane.input?.matches(editor);
			if (inputMatches) {
				editorPane.setOptions(options);
			}

			return { changed: false, cancelled: !inputMatches };
		}

		// Start a new editor input operation to report progress
		// and to support cancellation. Any new operation that is
		// started will cancel the previous one.
		const operation = this.editorOperation.start(this.layoutService.isRestored() ? 800 : 3200);

		let cancelled = false;
		try {

			// Clear the current input before setting new input
			// This ensures that a slow loading input will not
			// be visible for the duration of the new input to
			// load (https://github.com/microsoft/vscode/issues/34697)
			editorPane.clearInput();

			// Set the input to the editor pane and keep track of it
			const pendingSetInput = editorPane.setInput(editor, options, context, operation.token);
			this.mapEditorPaneToPendingSetInput.set(editorPane, pendingSetInput);
			await pendingSetInput;

			if (!operation.isCurrent()) {
				cancelled = true;
			}
		} catch (error) {
			if (!operation.isCurrent()) {
				cancelled = true;
			} else {
				throw error;
			}
		} finally {
			if (operation.isCurrent()) {
				this.mapEditorPaneToPendingSetInput.delete(editorPane);
			}
			operation.stop();
		}

		return { changed: !inputMatches, cancelled };
	}

	private doHideActiveEditorPane(): void {
		if (!this._activeEditorPane) {
			return;
		}

		// Stop any running operation
		this.editorOperation.stop();

		// Indicate to editor pane before removing the editor from
		// the DOM to give a chance to persist certain state that
		// might depend on still being the active DOM element.
		this.safeRun(() => this._activeEditorPane?.clearInput());
		this.safeRun(() => this._activeEditorPane?.setVisible(false));

		// Clear any pending setInput promise
		this.mapEditorPaneToPendingSetInput.delete(this._activeEditorPane);

		// Remove editor pane from parent
		const editorPaneContainer = this._activeEditorPane.getContainer();
		if (editorPaneContainer) {
			editorPaneContainer.remove();
			hide(editorPaneContainer);
		}

		// Clear active editor pane
		this.doSetActiveEditorPane(null);
	}

	closeEditor(editor: EditorInput): void {
		if (this._activeEditorPane?.input && editor.matches(this._activeEditorPane.input)) {
			this.doHideActiveEditorPane();
		}
	}

	setVisible(visible: boolean): void {
		this.safeRun(() => this._activeEditorPane?.setVisible(visible));
	}

	layout(pagePosition: IDomNodePagePosition): void {
		this.pagePosition = pagePosition;

		this.safeRun(() => this._activeEditorPane?.layout(new Dimension(pagePosition.width, pagePosition.height), pagePosition));
	}

	setBoundarySashes(sashes: IBoundarySashes): void {
		this.boundarySashes = sashes;

		this.safeRun(() => this._activeEditorPane?.setBoundarySashes(sashes));
	}

	private safeRun(fn: () => void): void {

		// We delegate many calls to the active editor pane which
		// can be any kind of editor. We must ensure that our calls
		// do not throw, for example in `layout()` because that can
		// mess with the grid layout.

		try {
			fn();
		} catch (error) {
			this.logService.error(error);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/editorPart.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/editorPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { Part } from '../../part.js';
import { Dimension, $, EventHelper, addDisposableGenericMouseDownListener, getWindow, isAncestorOfActiveElement, getActiveElement, isHTMLElement } from '../../../../base/browser/dom.js';
import { Event, Emitter, Relay, PauseableEmitter } from '../../../../base/common/event.js';
import { contrastBorder, editorBackground } from '../../../../platform/theme/common/colorRegistry.js';
import { GroupDirection, GroupsArrangement, GroupOrientation, IMergeGroupOptions, MergeGroupMode, GroupsOrder, GroupLocation, IFindGroupScope, EditorGroupLayout, GroupLayoutArgument, IEditorSideGroup, IEditorDropTargetDelegate, IEditorPart } from '../../../services/editor/common/editorGroupsService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IView, orthogonal, LayoutPriority, IViewSize, Direction, SerializableGrid, Sizing, ISerializedGrid, ISerializedNode, Orientation, GridBranchNode, isGridBranchNode, GridNode, createSerializedGrid, Grid } from '../../../../base/browser/ui/grid/grid.js';
import { GroupIdentifier, EditorInputWithOptions, IEditorPartOptions, IEditorPartOptionsChangeEvent, GroupModelChangeKind } from '../../../common/editor.js';
import { EDITOR_GROUP_BORDER, EDITOR_PANE_BACKGROUND } from '../../../common/theme.js';
import { distinct, coalesce } from '../../../../base/common/arrays.js';
import { IEditorGroupView, getEditorPartOptions, impactsEditorPartOptions, IEditorPartCreationOptions, IEditorPartsView, IEditorGroupsView, IEditorGroupViewOptions } from './editor.js';
import { EditorGroupView } from './editorGroupView.js';
import { IConfigurationService, IConfigurationChangeEvent } from '../../../../platform/configuration/common/configuration.js';
import { IDisposable, dispose, toDisposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { IStorageService, IStorageValueChangeEvent, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ISerializedEditorGroupModel, isSerializedEditorGroupModel } from '../../../common/editor/editorGroupModel.js';
import { EditorDropTarget } from './editorDropTarget.js';
import { Color } from '../../../../base/common/color.js';
import { CenteredViewLayout, CenteredViewState } from '../../../../base/browser/ui/centered/centeredViewLayout.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Parts, IWorkbenchLayoutService, Position } from '../../../services/layout/browser/layoutService.js';
import { DeepPartial, assertType } from '../../../../base/common/types.js';
import { CompositeDragAndDropObserver } from '../../dnd.js';
import { DeferredPromise, Promises } from '../../../../base/common/async.js';
import { findGroup } from '../../../services/editor/common/editorGroupFinder.js';
import { SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { IBoundarySashes } from '../../../../base/browser/ui/sash/sash.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { EditorPartMaximizedEditorGroupContext, EditorPartMultipleEditorGroupsContext, IsAuxiliaryWindowContext } from '../../../common/contextkeys.js';
import { mainWindow } from '../../../../base/browser/window.js';

export interface IEditorPartUIState {
	readonly serializedGrid: ISerializedGrid;
	readonly activeGroup: GroupIdentifier;
	readonly mostRecentActiveGroups: GroupIdentifier[];
}

interface IEditorPartMemento {
	'editorpart.state'?: IEditorPartUIState;
	'editorpart.centeredview'?: CenteredViewState;
}

class GridWidgetView<T extends IView> implements IView {

	readonly element: HTMLElement = $('.grid-view-container');

	get minimumWidth(): number { return this.gridWidget ? this.gridWidget.minimumWidth : 0; }
	get maximumWidth(): number { return this.gridWidget ? this.gridWidget.maximumWidth : Number.POSITIVE_INFINITY; }
	get minimumHeight(): number { return this.gridWidget ? this.gridWidget.minimumHeight : 0; }
	get maximumHeight(): number { return this.gridWidget ? this.gridWidget.maximumHeight : Number.POSITIVE_INFINITY; }

	private _onDidChange = new Relay<{ width: number; height: number } | undefined>();
	readonly onDidChange = this._onDidChange.event;

	private _gridWidget: Grid<T> | undefined;

	get gridWidget(): Grid<T> | undefined {
		return this._gridWidget;
	}

	set gridWidget(grid: Grid<T> | undefined) {
		this.element.textContent = '';

		if (grid) {
			this.element.appendChild(grid.element);
			this._onDidChange.input = grid.onDidChange;
		} else {
			this._onDidChange.input = Event.None;
		}

		this._gridWidget = grid;
	}

	layout(width: number, height: number, top: number, left: number): void {
		this.gridWidget?.layout(width, height, top, left);
	}

	dispose(): void {
		this._onDidChange.dispose();
	}
}

export class EditorPart extends Part<IEditorPartMemento> implements IEditorPart, IEditorGroupsView {

	private static readonly EDITOR_PART_UI_STATE_STORAGE_KEY = 'editorpart.state';
	private static readonly EDITOR_PART_CENTERED_VIEW_STORAGE_KEY = 'editorpart.centeredview';

	//#region Events

	private readonly _onDidFocus = this._register(new Emitter<void>());
	readonly onDidFocus = this._onDidFocus.event;

	private readonly _onDidLayout = this._register(new Emitter<Dimension>());
	readonly onDidLayout = this._onDidLayout.event;

	private readonly _onDidChangeActiveGroup = this._register(new Emitter<IEditorGroupView>());
	readonly onDidChangeActiveGroup = this._onDidChangeActiveGroup.event;

	private readonly _onDidChangeGroupIndex = this._register(new Emitter<IEditorGroupView>());
	readonly onDidChangeGroupIndex = this._onDidChangeGroupIndex.event;

	private readonly _onDidChangeGroupLabel = this._register(new Emitter<IEditorGroupView>());
	readonly onDidChangeGroupLabel = this._onDidChangeGroupLabel.event;

	private readonly _onDidChangeGroupLocked = this._register(new Emitter<IEditorGroupView>());
	readonly onDidChangeGroupLocked = this._onDidChangeGroupLocked.event;

	private readonly _onDidChangeGroupMaximized = this._register(new Emitter<boolean>());
	readonly onDidChangeGroupMaximized = this._onDidChangeGroupMaximized.event;

	private readonly _onDidActivateGroup = this._register(new Emitter<IEditorGroupView>());
	readonly onDidActivateGroup = this._onDidActivateGroup.event;

	private readonly _onDidAddGroup = this._register(new PauseableEmitter<IEditorGroupView>());
	readonly onDidAddGroup = this._onDidAddGroup.event;

	private readonly _onDidRemoveGroup = this._register(new PauseableEmitter<IEditorGroupView>());
	readonly onDidRemoveGroup = this._onDidRemoveGroup.event;

	private readonly _onDidMoveGroup = this._register(new Emitter<IEditorGroupView>());
	readonly onDidMoveGroup = this._onDidMoveGroup.event;

	private readonly onDidSetGridWidget = this._register(new Emitter<{ width: number; height: number } | undefined>());

	private readonly _onDidChangeSizeConstraints = this._register(new Relay<{ width: number; height: number } | undefined>());
	readonly onDidChangeSizeConstraints = Event.any(this.onDidSetGridWidget.event, this._onDidChangeSizeConstraints.event);

	private readonly _onDidScroll = this._register(new Relay<void>());
	readonly onDidScroll = Event.any(this.onDidSetGridWidget.event, this._onDidScroll.event);

	private readonly _onDidChangeEditorPartOptions = this._register(new Emitter<IEditorPartOptionsChangeEvent>());
	readonly onDidChangeEditorPartOptions = this._onDidChangeEditorPartOptions.event;

	private readonly _onWillDispose = this._register(new Emitter<void>());
	readonly onWillDispose = this._onWillDispose.event;

	//#endregion

	private readonly workspaceMemento = this.getMemento(StorageScope.WORKSPACE, StorageTarget.USER);
	private readonly profileMemento = this.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);

	private readonly groupViews = new Map<GroupIdentifier, IEditorGroupView>();
	private mostRecentActiveGroups: GroupIdentifier[] = [];

	protected readonly container = $('.content');

	readonly scopedInstantiationService: IInstantiationService;
	private readonly scopedContextKeyService: IContextKeyService;

	private centeredLayoutWidget!: CenteredViewLayout;

	private gridWidget!: SerializableGrid<IEditorGroupView>;
	private readonly gridWidgetDisposables = this._register(new DisposableStore());
	private readonly gridWidgetView = this._register(new GridWidgetView<IEditorGroupView>());

	constructor(
		protected readonly editorPartsView: IEditorPartsView,
		id: string,
		private readonly groupsLabel: string,
		readonly windowId: number,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IStorageService storageService: IStorageService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IHostService private readonly hostService: IHostService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService
	) {
		super(id, { hasTitle: false }, themeService, storageService, layoutService);

		this.scopedContextKeyService = this._register(this.contextKeyService.createScoped(this.container));
		this.scopedInstantiationService = this._register(this.instantiationService.createChild(new ServiceCollection(
			[IContextKeyService, this.scopedContextKeyService]
		)));

		this._partOptions = getEditorPartOptions(this.configurationService, this.themeService);

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.configurationService.onDidChangeConfiguration(e => this.onConfigurationUpdated(e)));
		this._register(this.themeService.onDidFileIconThemeChange(() => this.handleChangedPartOptions()));
		this._register(this.onDidChangeMementoValue(StorageScope.WORKSPACE, this._store)(e => this.onDidChangeMementoState(e)));
	}

	private onConfigurationUpdated(event: IConfigurationChangeEvent): void {
		if (impactsEditorPartOptions(event)) {
			this.handleChangedPartOptions();
		}
	}

	private handleChangedPartOptions(): void {
		const oldPartOptions = this._partOptions;
		const newPartOptions = getEditorPartOptions(this.configurationService, this.themeService);

		for (const enforcedPartOptions of this.enforcedPartOptions) {
			Object.assign(newPartOptions, enforcedPartOptions); // check for overrides
		}

		this._partOptions = newPartOptions;

		this._onDidChangeEditorPartOptions.fire({ oldPartOptions, newPartOptions });
	}

	private enforcedPartOptions: DeepPartial<IEditorPartOptions>[] = [];

	private _partOptions: IEditorPartOptions;
	get partOptions(): IEditorPartOptions { return this._partOptions; }

	enforcePartOptions(options: DeepPartial<IEditorPartOptions>): IDisposable {
		this.enforcedPartOptions.push(options);
		this.handleChangedPartOptions();

		return toDisposable(() => {
			this.enforcedPartOptions.splice(this.enforcedPartOptions.indexOf(options), 1);
			this.handleChangedPartOptions();
		});
	}

	private top = 0;
	private left = 0;
	private _contentDimension!: Dimension;
	get contentDimension(): Dimension { return this._contentDimension; }

	private _activeGroup!: IEditorGroupView;
	get activeGroup(): IEditorGroupView {
		return this._activeGroup;
	}

	readonly sideGroup: IEditorSideGroup = {
		openEditor: (editor, options) => {
			const [group] = this.scopedInstantiationService.invokeFunction(accessor => findGroup(accessor, { editor, options }, SIDE_GROUP));

			return group.openEditor(editor, options);
		}
	};

	get groups(): IEditorGroupView[] {
		return Array.from(this.groupViews.values());
	}

	get count(): number {
		return this.groupViews.size;
	}

	get orientation(): GroupOrientation {
		return (this.gridWidget && this.gridWidget.orientation === Orientation.VERTICAL) ? GroupOrientation.VERTICAL : GroupOrientation.HORIZONTAL;
	}

	private _isReady = false;
	get isReady(): boolean { return this._isReady; }

	private readonly whenReadyPromise = new DeferredPromise<void>();
	readonly whenReady = this.whenReadyPromise.p;

	private readonly whenRestoredPromise = new DeferredPromise<void>();
	readonly whenRestored = this.whenRestoredPromise.p;

	get hasRestorableState(): boolean {
		return !!this.workspaceMemento[EditorPart.EDITOR_PART_UI_STATE_STORAGE_KEY];
	}

	private _willRestoreState = false;
	get willRestoreState(): boolean { return this._willRestoreState; }

	getGroups(order = GroupsOrder.CREATION_TIME): IEditorGroupView[] {
		switch (order) {
			case GroupsOrder.CREATION_TIME:
				return this.groups;

			case GroupsOrder.MOST_RECENTLY_ACTIVE: {
				const mostRecentActive = coalesce(this.mostRecentActiveGroups.map(groupId => this.getGroup(groupId)));

				// there can be groups that got never active, even though they exist. in this case
				// make sure to just append them at the end so that all groups are returned properly
				return distinct([...mostRecentActive, ...this.groups]);
			}
			case GroupsOrder.GRID_APPEARANCE: {
				const views: IEditorGroupView[] = [];
				if (this.gridWidget) {
					this.fillGridNodes(views, this.gridWidget.getViews());
				}

				return views;
			}
		}
	}

	private fillGridNodes(target: IEditorGroupView[], node: GridBranchNode<IEditorGroupView> | GridNode<IEditorGroupView>): void {
		if (isGridBranchNode(node)) {
			node.children.forEach(child => this.fillGridNodes(target, child));
		} else {
			target.push(node.view);
		}
	}

	hasGroup(identifier: GroupIdentifier): boolean {
		return this.groupViews.has(identifier);
	}

	getGroup(identifier: GroupIdentifier): IEditorGroupView | undefined {
		return this.groupViews.get(identifier);
	}

	findGroup(scope: IFindGroupScope, source: IEditorGroupView | GroupIdentifier = this.activeGroup, wrap?: boolean): IEditorGroupView | undefined {

		// by direction
		if (typeof scope.direction === 'number') {
			return this.doFindGroupByDirection(scope.direction, source, wrap);
		}

		// by location
		if (typeof scope.location === 'number') {
			return this.doFindGroupByLocation(scope.location, source, wrap);
		}

		throw new Error('invalid arguments');
	}

	private doFindGroupByDirection(direction: GroupDirection, source: IEditorGroupView | GroupIdentifier, wrap?: boolean): IEditorGroupView | undefined {
		const sourceGroupView = this.assertGroupView(source);

		// Find neighbours and sort by our MRU list
		const neighbours = this.gridWidget.getNeighborViews(sourceGroupView, this.toGridViewDirection(direction), wrap);
		neighbours.sort(((n1, n2) => this.mostRecentActiveGroups.indexOf(n1.id) - this.mostRecentActiveGroups.indexOf(n2.id)));

		return neighbours[0];
	}

	private doFindGroupByLocation(location: GroupLocation, source: IEditorGroupView | GroupIdentifier, wrap?: boolean): IEditorGroupView | undefined {
		const sourceGroupView = this.assertGroupView(source);
		const groups = this.getGroups(GroupsOrder.GRID_APPEARANCE);
		const index = groups.indexOf(sourceGroupView);

		switch (location) {
			case GroupLocation.FIRST:
				return groups[0];
			case GroupLocation.LAST:
				return groups[groups.length - 1];
			case GroupLocation.NEXT: {
				let nextGroup: IEditorGroupView | undefined = groups[index + 1];
				if (!nextGroup && wrap) {
					nextGroup = this.doFindGroupByLocation(GroupLocation.FIRST, source);
				}

				return nextGroup;
			}
			case GroupLocation.PREVIOUS: {
				let previousGroup: IEditorGroupView | undefined = groups[index - 1];
				if (!previousGroup && wrap) {
					previousGroup = this.doFindGroupByLocation(GroupLocation.LAST, source);
				}

				return previousGroup;
			}
		}
	}

	activateGroup(group: IEditorGroupView | GroupIdentifier, preserveWindowOrder?: boolean): IEditorGroupView {
		const groupView = this.assertGroupView(group);
		this.doSetGroupActive(groupView);

		// Ensure window on top unless disabled
		if (!preserveWindowOrder) {
			this.hostService.moveTop(getWindow(this.element));
		}

		return groupView;
	}

	restoreGroup(group: IEditorGroupView | GroupIdentifier): IEditorGroupView {
		const groupView = this.assertGroupView(group);
		this.doRestoreGroup(groupView);

		return groupView;
	}

	getSize(group: IEditorGroupView | GroupIdentifier): { width: number; height: number } {
		const groupView = this.assertGroupView(group);

		return this.gridWidget.getViewSize(groupView);
	}

	setSize(group: IEditorGroupView | GroupIdentifier, size: { width: number; height: number }): void {
		const groupView = this.assertGroupView(group);

		this.gridWidget.resizeView(groupView, size);
	}

	arrangeGroups(arrangement: GroupsArrangement, target: IEditorGroupView | GroupIdentifier = this.activeGroup): void {
		if (this.count < 2) {
			return; // require at least 2 groups to show
		}

		if (!this.gridWidget) {
			return; // we have not been created yet
		}

		const groupView = this.assertGroupView(target);

		switch (arrangement) {
			case GroupsArrangement.EVEN:
				this.gridWidget.distributeViewSizes();
				break;
			case GroupsArrangement.MAXIMIZE:
				if (this.groups.length < 2) {
					return; // need at least 2 groups to be maximized
				}
				this.gridWidget.maximizeView(groupView);
				groupView.focus();
				break;
			case GroupsArrangement.EXPAND:
				this.gridWidget.expandView(groupView);
				break;
		}
	}

	toggleMaximizeGroup(target: IEditorGroupView | GroupIdentifier = this.activeGroup): void {
		if (this.hasMaximizedGroup()) {
			this.unmaximizeGroup();
		} else {
			this.arrangeGroups(GroupsArrangement.MAXIMIZE, target);
		}
	}

	toggleExpandGroup(target: IEditorGroupView | GroupIdentifier = this.activeGroup): void {
		if (this.isGroupExpanded(this.activeGroup)) {
			this.arrangeGroups(GroupsArrangement.EVEN);
		} else {
			this.arrangeGroups(GroupsArrangement.EXPAND, target);
		}
	}

	private unmaximizeGroup(): void {
		this.gridWidget.exitMaximizedView();
		this._activeGroup.focus(); // When making views visible the focus can be affected, so restore it
	}

	hasMaximizedGroup(): boolean {
		return this.gridWidget.hasMaximizedView();
	}

	private isGroupMaximized(targetGroup: IEditorGroupView): boolean {
		return this.gridWidget.isViewMaximized(targetGroup);
	}

	isGroupExpanded(targetGroup: IEditorGroupView): boolean {
		return this.gridWidget.isViewExpanded(targetGroup);
	}

	setGroupOrientation(orientation: GroupOrientation): void {
		if (!this.gridWidget) {
			return; // we have not been created yet
		}

		const newOrientation = (orientation === GroupOrientation.HORIZONTAL) ? Orientation.HORIZONTAL : Orientation.VERTICAL;
		if (this.gridWidget.orientation !== newOrientation) {
			this.gridWidget.orientation = newOrientation;
		}
	}

	applyLayout(layout: EditorGroupLayout): void {
		const restoreFocus = this.shouldRestoreFocus(this.container);

		// Determine how many groups we need overall
		let layoutGroupsCount = 0;
		function countGroups(groups: GroupLayoutArgument[]): void {
			for (const group of groups) {
				if (Array.isArray(group.groups)) {
					countGroups(group.groups);
				} else {
					layoutGroupsCount++;
				}
			}
		}
		countGroups(layout.groups);

		// If we currently have too many groups, merge them into the last one
		let currentGroupViews = this.getGroups(GroupsOrder.GRID_APPEARANCE);
		if (layoutGroupsCount < currentGroupViews.length) {
			const lastGroupInLayout = currentGroupViews[layoutGroupsCount - 1];
			currentGroupViews.forEach((group, index) => {
				if (index >= layoutGroupsCount) {
					this.mergeGroup(group, lastGroupInLayout);
				}
			});

			currentGroupViews = this.getGroups(GroupsOrder.GRID_APPEARANCE);
		}

		const activeGroup = this.activeGroup;

		// Prepare grid descriptor to create new grid from
		const gridDescriptor = createSerializedGrid({
			orientation: this.toGridViewOrientation(
				layout.orientation,
				this.isTwoDimensionalGrid() ?
					this.gridWidget.orientation :			// preserve original orientation for 2-dimensional grids
					orthogonal(this.gridWidget.orientation) // otherwise flip (fix https://github.com/microsoft/vscode/issues/52975)
			),
			groups: layout.groups
		});

		// Recreate gridwidget with descriptor
		this.doApplyGridState(gridDescriptor, activeGroup.id, currentGroupViews);

		// Restore focus as needed
		if (restoreFocus) {
			this._activeGroup.focus();
		}
	}

	getLayout(): EditorGroupLayout {

		// Example return value:
		// { orientation: 0, groups: [ { groups: [ { size: 0.4 }, { size: 0.6 } ], size: 0.5 }, { groups: [ {}, {} ], size: 0.5 } ] }

		const serializedGrid = this.gridWidget.serialize();
		const orientation = serializedGrid.orientation === Orientation.HORIZONTAL ? GroupOrientation.HORIZONTAL : GroupOrientation.VERTICAL;
		const root = this.serializedNodeToGroupLayoutArgument(serializedGrid.root);

		return {
			orientation,
			groups: root.groups as GroupLayoutArgument[]
		};
	}

	private serializedNodeToGroupLayoutArgument(serializedNode: ISerializedNode): GroupLayoutArgument {
		if (serializedNode.type === 'branch') {
			return {
				size: serializedNode.size,
				groups: serializedNode.data.map(node => this.serializedNodeToGroupLayoutArgument(node))
			};
		}

		return { size: serializedNode.size };
	}

	protected shouldRestoreFocus(target: Element | undefined): boolean {
		if (!target) {
			return false;
		}

		const activeElement = getActiveElement();
		if (activeElement === target.ownerDocument.body) {
			return true; // always restore focus if nothing is focused currently
		}

		// otherwise check for the active element being an ancestor of the target
		return isAncestorOfActiveElement(target);
	}

	private isTwoDimensionalGrid(): boolean {
		const views = this.gridWidget.getViews();
		if (isGridBranchNode(views)) {
			// the grid is 2-dimensional if any children
			// of the grid is a branch node
			return views.children.some(child => isGridBranchNode(child));
		}

		return false;
	}

	addGroup(location: IEditorGroupView | GroupIdentifier, direction: GroupDirection, groupToCopy?: IEditorGroupView): IEditorGroupView {
		const locationView = this.assertGroupView(location);

		let newGroupView: IEditorGroupView;

		// Same groups view: add to grid widget directly
		if (locationView.groupsView === this) {
			const restoreFocus = this.shouldRestoreFocus(locationView.element);

			const shouldExpand = this.groupViews.size > 1 && this.isGroupExpanded(locationView);
			newGroupView = this.doCreateGroupView(groupToCopy);

			// Add to grid widget
			this.gridWidget.addView(
				newGroupView,
				this.getSplitSizingStyle(),
				locationView,
				this.toGridViewDirection(direction),
			);

			// Update container
			this.updateContainer();

			// Event
			this._onDidAddGroup.fire(newGroupView);

			// Notify group index change given a new group was added
			this.notifyGroupIndexChange();

			// Expand new group, if the reference view was previously expanded
			if (shouldExpand) {
				this.arrangeGroups(GroupsArrangement.EXPAND, newGroupView);
			}

			// Restore focus if we had it previously after completing the grid
			// operation. That operation might cause reparenting of grid views
			// which moves focus to the <body> element otherwise.
			if (restoreFocus) {
				locationView.focus();
			}
		}

		// Different group view: add to grid widget of that group
		else {
			newGroupView = locationView.groupsView.addGroup(locationView, direction, groupToCopy);
		}

		return newGroupView;
	}

	private getSplitSizingStyle(): Sizing {
		switch (this._partOptions.splitSizing) {
			case 'distribute':
				return Sizing.Distribute;
			case 'split':
				return Sizing.Split;
			default:
				return Sizing.Auto;
		}
	}

	private doCreateGroupView(from?: IEditorGroupView | ISerializedEditorGroupModel | null, options?: IEditorGroupViewOptions): IEditorGroupView {

		// Create group view
		let groupView: IEditorGroupView;
		if (from instanceof EditorGroupView) {
			groupView = EditorGroupView.createCopy(from, this.editorPartsView, this, this.groupsLabel, this.count, this.scopedInstantiationService, options);
		} else if (isSerializedEditorGroupModel(from)) {
			groupView = EditorGroupView.createFromSerialized(from, this.editorPartsView, this, this.groupsLabel, this.count, this.scopedInstantiationService, options);
		} else {
			groupView = EditorGroupView.createNew(this.editorPartsView, this, this.groupsLabel, this.count, this.scopedInstantiationService, options);
		}

		// Keep in map
		this.groupViews.set(groupView.id, groupView);

		// Track focus
		const groupDisposables = new DisposableStore();
		groupDisposables.add(groupView.onDidFocus(() => {
			this.doSetGroupActive(groupView);

			this._onDidFocus.fire();
		}));

		// Track group changes
		groupDisposables.add(groupView.onDidModelChange(e => {
			switch (e.kind) {
				case GroupModelChangeKind.GROUP_LOCKED:
					this._onDidChangeGroupLocked.fire(groupView);
					break;
				case GroupModelChangeKind.GROUP_INDEX:
					this._onDidChangeGroupIndex.fire(groupView);
					break;
				case GroupModelChangeKind.GROUP_LABEL:
					this._onDidChangeGroupLabel.fire(groupView);
					break;
			}
		}));

		// Track active editor change after it occurred
		groupDisposables.add(groupView.onDidActiveEditorChange(() => {
			this.updateContainer();
		}));

		// Track dispose
		Event.once(groupView.onWillDispose)(() => {
			dispose(groupDisposables);
			this.groupViews.delete(groupView.id);
			this.doUpdateMostRecentActive(groupView);
		});

		return groupView;
	}

	private doSetGroupActive(group: IEditorGroupView): void {
		if (this._activeGroup !== group) {
			const previousActiveGroup = this._activeGroup;
			this._activeGroup = group;

			// Update list of most recently active groups
			this.doUpdateMostRecentActive(group, true);

			// Mark previous one as inactive
			if (previousActiveGroup && !previousActiveGroup.disposed) {
				previousActiveGroup.setActive(false);
			}

			// Mark group as new active
			group.setActive(true);

			// Expand the group if it is currently minimized
			this.doRestoreGroup(group);

			// Event
			this._onDidChangeActiveGroup.fire(group);
		}

		// Always fire the event that a group has been activated
		// even if its the same group that is already active to
		// signal the intent even when nothing has changed.
		this._onDidActivateGroup.fire(group);
	}

	private doRestoreGroup(group: IEditorGroupView): void {
		if (!this.gridWidget) {
			return; // method is called as part of state restore very early
		}

		try {
			if (this.hasMaximizedGroup() && !this.isGroupMaximized(group)) {
				this.unmaximizeGroup();
			}

			const viewSize = this.gridWidget.getViewSize(group);
			if (viewSize.width === group.minimumWidth || viewSize.height === group.minimumHeight) {
				this.arrangeGroups(GroupsArrangement.EXPAND, group);
			}
		} catch (error) {
			// ignore: method might be called too early before view is known to grid
		}
	}

	private doUpdateMostRecentActive(group: IEditorGroupView, makeMostRecentlyActive?: boolean): void {
		const index = this.mostRecentActiveGroups.indexOf(group.id);

		// Remove from MRU list
		if (index !== -1) {
			this.mostRecentActiveGroups.splice(index, 1);
		}

		// Add to front as needed
		if (makeMostRecentlyActive) {
			this.mostRecentActiveGroups.unshift(group.id);
		}
	}

	private toGridViewDirection(direction: GroupDirection): Direction {
		switch (direction) {
			case GroupDirection.UP: return Direction.Up;
			case GroupDirection.DOWN: return Direction.Down;
			case GroupDirection.LEFT: return Direction.Left;
			case GroupDirection.RIGHT: return Direction.Right;
		}
	}

	private toGridViewOrientation(orientation: GroupOrientation, fallback: Orientation): Orientation {
		if (typeof orientation === 'number') {
			return orientation === GroupOrientation.HORIZONTAL ? Orientation.HORIZONTAL : Orientation.VERTICAL;
		}

		return fallback;
	}

	removeGroup(group: IEditorGroupView | GroupIdentifier, preserveFocus?: boolean): void {
		const groupView = this.assertGroupView(group);
		if (this.count === 1) {
			return; // Cannot remove the last root group
		}

		// Remove empty group
		if (groupView.isEmpty) {
			this.doRemoveEmptyGroup(groupView, preserveFocus);
		}

		// Remove group with editors
		else {
			this.doRemoveGroupWithEditors(groupView);
		}
	}

	private doRemoveGroupWithEditors(groupView: IEditorGroupView): void {
		const mostRecentlyActiveGroups = this.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE);

		let lastActiveGroup: IEditorGroupView;
		if (this._activeGroup === groupView) {
			lastActiveGroup = mostRecentlyActiveGroups[1];
		} else {
			lastActiveGroup = mostRecentlyActiveGroups[0];
		}

		// Removing a group with editors should merge these editors into the
		// last active group and then remove this group.
		this.mergeGroup(groupView, lastActiveGroup);
	}

	private doRemoveEmptyGroup(groupView: IEditorGroupView, preserveFocus?: boolean): void {
		const restoreFocus = !preserveFocus && this.shouldRestoreFocus(this.container);

		// Activate next group if the removed one was active
		if (this._activeGroup === groupView) {
			const mostRecentlyActiveGroups = this.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE);
			const nextActiveGroup = mostRecentlyActiveGroups[1]; // [0] will be the current group we are about to dispose
			this.doSetGroupActive(nextActiveGroup);
		}

		// Remove from grid widget & dispose
		this.gridWidget.removeView(groupView, this.getSplitSizingStyle());
		groupView.dispose();

		// Restore focus if we had it previously after completing the grid
		// operation. That operation might cause reparenting of grid views
		// which moves focus to the <body> element otherwise.
		if (restoreFocus) {
			this._activeGroup.focus();
		}

		// Notify group index change given a group was removed
		this.notifyGroupIndexChange();

		// Update container
		this.updateContainer();

		// Event
		this._onDidRemoveGroup.fire(groupView);
	}

	moveGroup(group: IEditorGroupView | GroupIdentifier, location: IEditorGroupView | GroupIdentifier, direction: GroupDirection): IEditorGroupView {
		const sourceView = this.assertGroupView(group);
		const targetView = this.assertGroupView(location);

		if (sourceView.id === targetView.id) {
			throw new Error('Cannot move group into its own');
		}

		const restoreFocus = this.shouldRestoreFocus(sourceView.element);
		let movedView: IEditorGroupView;

		// Same groups view: move via grid widget API
		if (sourceView.groupsView === targetView.groupsView) {
			this.gridWidget.moveView(sourceView, this.getSplitSizingStyle(), targetView, this.toGridViewDirection(direction));
			movedView = sourceView;
		}

		// Different groups view: move via groups view API
		else {
			movedView = targetView.groupsView.addGroup(targetView, direction, sourceView);
			sourceView.closeAllEditors();
			this.removeGroup(sourceView, restoreFocus);
		}

		// Restore focus if we had it previously after completing the grid
		// operation. That operation might cause reparenting of grid views
		// which moves focus to the <body> element otherwise.
		if (restoreFocus) {
			movedView.focus();
		}

		// Event
		this._onDidMoveGroup.fire(movedView);

		// Notify group index change given a group was moved
		this.notifyGroupIndexChange();

		return movedView;
	}

	copyGroup(group: IEditorGroupView | GroupIdentifier, location: IEditorGroupView | GroupIdentifier, direction: GroupDirection): IEditorGroupView {
		const groupView = this.assertGroupView(group);
		const locationView = this.assertGroupView(location);

		const restoreFocus = this.shouldRestoreFocus(groupView.element);

		// Copy the group view
		const copiedGroupView = this.addGroup(locationView, direction, groupView);

		// Restore focus if we had it
		if (restoreFocus) {
			copiedGroupView.focus();
		}

		return copiedGroupView;
	}

	mergeGroup(group: IEditorGroupView | GroupIdentifier, target: IEditorGroupView | GroupIdentifier, options?: IMergeGroupOptions): boolean {
		const sourceView = this.assertGroupView(group);
		const targetView = this.assertGroupView(target);

		// Collect editors to move/copy
		const editors: EditorInputWithOptions[] = [];
		let index = (options && typeof options.index === 'number') ? options.index : targetView.count;
		for (const editor of sourceView.editors) {
			const inactive = !sourceView.isActive(editor) || this._activeGroup !== sourceView;

			let actualIndex: number | undefined;
			if (targetView.contains(editor) &&
				(
					// Do not configure an `index` for editors that are sticky in
					// the target, otherwise there is a chance of losing that state
					// when the editor is moved.
					// See https://github.com/microsoft/vscode/issues/239549
					targetView.isSticky(editor) ||
					// Do not configure an `index` when we are explicitly instructed
					options?.preserveExistingIndex
				)
			) {
				// leave `index` as `undefined`
			} else {
				actualIndex = index;
				index++;
			}

			editors.push({
				editor,
				options: {
					index: actualIndex,
					inactive,
					preserveFocus: inactive
				}
			});
		}

		// Move/Copy editors over into target
		let result = true;
		if (options?.mode === MergeGroupMode.COPY_EDITORS) {
			sourceView.copyEditors(editors, targetView);
		} else {
			result = sourceView.moveEditors(editors, targetView);
		}

		// Remove source if the view is now empty and not already removed
		if (sourceView.isEmpty && !sourceView.disposed /* could have been disposed already via workbench.editor.closeEmptyGroups setting */) {
			this.removeGroup(sourceView, true);
		}

		return result;
	}

	mergeAllGroups(target: IEditorGroupView | GroupIdentifier, options?: IMergeGroupOptions): boolean {
		const targetView = this.assertGroupView(target);

		let result = true;
		for (const group of this.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE)) {
			if (group === targetView) {
				continue; // keep target
			}

			const merged = this.mergeGroup(group, targetView, options);
			if (!merged) {
				result = false;
			}
		}

		return result;
	}

	protected assertGroupView(group: IEditorGroupView | GroupIdentifier): IEditorGroupView {
		let groupView: IEditorGroupView | undefined;
		if (typeof group === 'number') {
			groupView = this.editorPartsView.getGroup(group);
		} else {
			groupView = group;
		}

		if (!groupView) {
			throw new Error('Invalid editor group provided!');
		}

		return groupView;
	}

	createEditorDropTarget(container: unknown, delegate: IEditorDropTargetDelegate): IDisposable {
		assertType(isHTMLElement(container));

		return this.scopedInstantiationService.createInstance(EditorDropTarget, container, delegate);
	}

	//#region Part

	// TODO @sbatten @joao find something better to prevent editor taking over #79897
	get minimumWidth(): number { return Math.min(this.centeredLayoutWidget.minimumWidth, this.layoutService.getMaximumEditorDimensions(this.layoutService.getContainer(getWindow(this.container))).width); }
	get maximumWidth(): number { return this.centeredLayoutWidget.maximumWidth; }
	get minimumHeight(): number { return Math.min(this.centeredLayoutWidget.minimumHeight, this.layoutService.getMaximumEditorDimensions(this.layoutService.getContainer(getWindow(this.container))).height); }
	get maximumHeight(): number { return this.centeredLayoutWidget.maximumHeight; }

	get snap(): boolean { return this.layoutService.getPanelAlignment() === 'center'; }

	override get onDidChange(): Event<IViewSize | undefined> { return Event.any(this.centeredLayoutWidget.onDidChange, this.onDidSetGridWidget.event); }
	readonly priority: LayoutPriority = LayoutPriority.High;

	private get gridSeparatorBorder(): Color {
		return this.theme.getColor(EDITOR_GROUP_BORDER) || this.theme.getColor(contrastBorder) || Color.transparent;
	}

	override updateStyles(): void {
		this.container.style.backgroundColor = this.getColor(editorBackground) || '';

		const separatorBorderStyle = { separatorBorder: this.gridSeparatorBorder, background: this.theme.getColor(EDITOR_PANE_BACKGROUND) || Color.transparent };
		this.gridWidget.style(separatorBorderStyle);
		this.centeredLayoutWidget.styles(separatorBorderStyle);
	}

	protected override createContentArea(parent: HTMLElement, options?: IEditorPartCreationOptions): HTMLElement {

		// Container
		this.element = parent;
		if (this.windowId !== mainWindow.vscodeWindowId) {
			this.container.classList.add('auxiliary');
		}
		parent.appendChild(this.container);

		// Grid control
		this._willRestoreState = !options || options.restorePreviousState;
		this.doCreateGridControl();

		// Centered layout widget
		this.centeredLayoutWidget = this._register(new CenteredViewLayout(this.container, this.gridWidgetView, this.profileMemento[EditorPart.EDITOR_PART_CENTERED_VIEW_STORAGE_KEY], this._partOptions.centeredLayoutFixedWidth));
		this._register(this.onDidChangeEditorPartOptions(e => this.centeredLayoutWidget.setFixedWidth(e.newPartOptions.centeredLayoutFixedWidth ?? false)));

		// Drag & Drop support
		this.setupDragAndDropSupport(parent, this.container);

		// Context keys
		this.handleContextKeys();

		// Signal ready
		this.whenReadyPromise.complete();
		this._isReady = true;

		// Signal restored
		Promises.settled(this.groups.map(group => group.whenRestored)).finally(() => {
			this.whenRestoredPromise.complete();
		});

		return this.container;
	}

	private handleContextKeys(): void {
		const isAuxiliaryWindowContext = IsAuxiliaryWindowContext.bindTo(this.scopedContextKeyService);
		isAuxiliaryWindowContext.set(this.windowId !== mainWindow.vscodeWindowId);

		const multipleEditorGroupsContext = EditorPartMultipleEditorGroupsContext.bindTo(this.scopedContextKeyService);
		const maximizedEditorGroupContext = EditorPartMaximizedEditorGroupContext.bindTo(this.scopedContextKeyService);

		const updateContextKeys = () => {
			const groupCount = this.count;
			if (groupCount > 1) {
				multipleEditorGroupsContext.set(true);
			} else {
				multipleEditorGroupsContext.reset();
			}

			if (this.hasMaximizedGroup()) {
				maximizedEditorGroupContext.set(true);
			} else {
				maximizedEditorGroupContext.reset();
			}
		};

		updateContextKeys();

		this._register(this.onDidAddGroup(() => updateContextKeys()));
		this._register(this.onDidRemoveGroup(() => updateContextKeys()));
		this._register(this.onDidChangeGroupMaximized(() => updateContextKeys()));
	}

	private setupDragAndDropSupport(parent: HTMLElement, container: HTMLElement): void {

		// Editor drop target
		this._register(this.createEditorDropTarget(container, Object.create(null)));

		// No drop in the editor
		const overlay = $('.drop-block-overlay');
		parent.appendChild(overlay);

		// Hide the block if a mouse down event occurs #99065
		this._register(addDisposableGenericMouseDownListener(overlay, () => overlay.classList.remove('visible')));

		this._register(CompositeDragAndDropObserver.INSTANCE.registerTarget(this.element, {
			onDragStart: e => overlay.classList.add('visible'),
			onDragEnd: e => overlay.classList.remove('visible')
		}));

		let horizontalOpenerTimeout: Timeout | undefined;
		let verticalOpenerTimeout: Timeout | undefined;
		let lastOpenHorizontalPosition: Position | undefined;
		let lastOpenVerticalPosition: Position | undefined;
		const openPartAtPosition = (position: Position) => {
			if (!this.layoutService.isVisible(Parts.PANEL_PART) && position === this.layoutService.getPanelPosition()) {
				this.layoutService.setPartHidden(false, Parts.PANEL_PART);
			} else if (!this.layoutService.isVisible(Parts.AUXILIARYBAR_PART) && position === (this.layoutService.getSideBarPosition() === Position.RIGHT ? Position.LEFT : Position.RIGHT)) {
				this.layoutService.setPartHidden(false, Parts.AUXILIARYBAR_PART);
			}
		};

		const clearAllTimeouts = () => {
			if (horizontalOpenerTimeout) {
				clearTimeout(horizontalOpenerTimeout);
				horizontalOpenerTimeout = undefined;
			}

			if (verticalOpenerTimeout) {
				clearTimeout(verticalOpenerTimeout);
				verticalOpenerTimeout = undefined;
			}
		};

		this._register(CompositeDragAndDropObserver.INSTANCE.registerTarget(overlay, {
			onDragOver: e => {
				EventHelper.stop(e.eventData, true);
				if (e.eventData.dataTransfer) {
					e.eventData.dataTransfer.dropEffect = 'none';
				}

				const boundingRect = overlay.getBoundingClientRect();

				let openHorizontalPosition: Position | undefined = undefined;
				let openVerticalPosition: Position | undefined = undefined;
				const proximity = 100;
				if (e.eventData.clientX < boundingRect.left + proximity) {
					openHorizontalPosition = Position.LEFT;
				}

				if (e.eventData.clientX > boundingRect.right - proximity) {
					openHorizontalPosition = Position.RIGHT;
				}

				if (e.eventData.clientY > boundingRect.bottom - proximity) {
					openVerticalPosition = Position.BOTTOM;
				}

				if (e.eventData.clientY < boundingRect.top + proximity) {
					openVerticalPosition = Position.TOP;
				}

				if (horizontalOpenerTimeout && openHorizontalPosition !== lastOpenHorizontalPosition) {
					clearTimeout(horizontalOpenerTimeout);
					horizontalOpenerTimeout = undefined;
				}

				if (verticalOpenerTimeout && openVerticalPosition !== lastOpenVerticalPosition) {
					clearTimeout(verticalOpenerTimeout);
					verticalOpenerTimeout = undefined;
				}

				if (!horizontalOpenerTimeout && openHorizontalPosition !== undefined) {
					lastOpenHorizontalPosition = openHorizontalPosition;
					horizontalOpenerTimeout = setTimeout(() => openPartAtPosition(openHorizontalPosition), 200);
				}

				if (!verticalOpenerTimeout && openVerticalPosition !== undefined) {
					lastOpenVerticalPosition = openVerticalPosition;
					verticalOpenerTimeout = setTimeout(() => openPartAtPosition(openVerticalPosition), 200);
				}
			},
			onDragLeave: () => clearAllTimeouts(),
			onDragEnd: () => clearAllTimeouts(),
			onDrop: () => clearAllTimeouts()
		}));
	}

	centerLayout(active: boolean): void {
		this.centeredLayoutWidget.activate(active);
	}

	isLayoutCentered(): boolean {
		if (this.centeredLayoutWidget) {
			return this.centeredLayoutWidget.isActive();
		}

		return false;
	}

	private doCreateGridControl(): void {

		// Grid Widget (with previous UI state)
		let restoreError = false;
		if (this._willRestoreState) {
			restoreError = !this.doCreateGridControlWithPreviousState();
		}

		// Grid Widget (no previous UI state or failed to restore)
		if (!this.gridWidget || restoreError) {
			const initialGroup = this.doCreateGroupView();
			this.doSetGridWidget(new SerializableGrid(initialGroup));

			// Ensure a group is active
			this.doSetGroupActive(initialGroup);
		}

		// Update container
		this.updateContainer();

		// Notify group index change we created the entire grid
		this.notifyGroupIndexChange();
	}

	private doCreateGridControlWithPreviousState(): boolean {
		const state: IEditorPartUIState | undefined = this.loadState();
		if (state?.serializedGrid) {
			try {

				// MRU
				this.mostRecentActiveGroups = state.mostRecentActiveGroups;

				// Grid Widget
				this.doCreateGridControlWithState(state.serializedGrid, state.activeGroup);
			} catch (error) {

				// Log error
				onUnexpectedError(new Error(`Error restoring editor grid widget: ${error} (with state: ${JSON.stringify(state)})`));

				// Clear any state we have from the failing restore
				this.disposeGroups();

				return false; // failure
			}
		}

		return true; // success
	}

	private doCreateGridControlWithState(serializedGrid: ISerializedGrid, activeGroupId: GroupIdentifier, editorGroupViewsToReuse?: IEditorGroupView[], options?: IEditorGroupViewOptions): void {

		// Determine group views to reuse if any
		let reuseGroupViews: IEditorGroupView[];
		if (editorGroupViewsToReuse) {
			reuseGroupViews = editorGroupViewsToReuse.slice(0); // do not modify original array
		} else {
			reuseGroupViews = [];
		}

		// Create new
		const groupViews: IEditorGroupView[] = [];
		const gridWidget = SerializableGrid.deserialize(serializedGrid, {
			fromJSON: (serializedEditorGroup: ISerializedEditorGroupModel | null) => {
				let groupView: IEditorGroupView;
				if (reuseGroupViews.length > 0) {
					groupView = reuseGroupViews.shift()!;
				} else {
					groupView = this.doCreateGroupView(serializedEditorGroup, options);
				}

				groupViews.push(groupView);

				if (groupView.id === activeGroupId) {
					this.doSetGroupActive(groupView);
				}

				return groupView;
			}
		}, { styles: { separatorBorder: this.gridSeparatorBorder } });

		// If the active group was not found when restoring the grid
		// make sure to make at least one group active. We always need
		// an active group.
		if (!this._activeGroup) {
			this.doSetGroupActive(groupViews[0]);
		}

		// Validate MRU group views matches grid widget state
		if (this.mostRecentActiveGroups.some(groupId => !this.getGroup(groupId))) {
			this.mostRecentActiveGroups = groupViews.map(group => group.id);
		}

		// Set it
		this.doSetGridWidget(gridWidget);
	}

	private doSetGridWidget(gridWidget: SerializableGrid<IEditorGroupView>): void {
		let boundarySashes: IBoundarySashes = {};

		if (this.gridWidget) {
			boundarySashes = this.gridWidget.boundarySashes;
			this.gridWidget.dispose();
		}

		this.gridWidget = gridWidget;
		this.gridWidget.boundarySashes = boundarySashes;
		this.gridWidgetView.gridWidget = gridWidget;

		this._onDidChangeSizeConstraints.input = gridWidget.onDidChange;
		this._onDidScroll.input = gridWidget.onDidScroll;
		this.gridWidgetDisposables.clear();
		this.gridWidgetDisposables.add(gridWidget.onDidChangeViewMaximized(maximized => this._onDidChangeGroupMaximized.fire(maximized)));

		this.onDidSetGridWidget.fire(undefined);
	}

	private updateContainer(): void {
		this.container.classList.toggle('empty', this.isEmpty);
	}

	private notifyGroupIndexChange(): void {
		this.getGroups(GroupsOrder.GRID_APPEARANCE).forEach((group, index) => group.notifyIndexChanged(index));
	}

	notifyGroupsLabelChange(newLabel: string) {
		for (const group of this.groups) {
			group.notifyLabelChanged(newLabel);
		}
	}

	private get isEmpty(): boolean {
		return this.count === 1 && this._activeGroup.isEmpty;
	}

	setBoundarySashes(sashes: IBoundarySashes): void {
		this.gridWidget.boundarySashes = sashes;
		this.centeredLayoutWidget.boundarySashes = sashes;
	}

	override layout(width: number, height: number, top: number, left: number): void {
		this.top = top;
		this.left = left;

		// Layout contents
		const contentAreaSize = super.layoutContents(width, height).contentSize;

		// Layout editor container
		this.doLayout(Dimension.lift(contentAreaSize), top, left);
	}

	private doLayout(dimension: Dimension, top = this.top, left = this.left): void {
		this._contentDimension = dimension;

		// Layout Grid
		this.centeredLayoutWidget.layout(this._contentDimension.width, this._contentDimension.height, top, left);

		// Event
		this._onDidLayout.fire(dimension);
	}

	protected override saveState(): void {

		// Persist grid UI state
		if (this.gridWidget) {
			if (this.isEmpty) {
				delete this.workspaceMemento[EditorPart.EDITOR_PART_UI_STATE_STORAGE_KEY];
			} else {
				this.workspaceMemento[EditorPart.EDITOR_PART_UI_STATE_STORAGE_KEY] = this.createState();
			}
		}

		// Persist centered view state
		if (this.centeredLayoutWidget) {
			const centeredLayoutState = this.centeredLayoutWidget.state;
			if (this.centeredLayoutWidget.isDefault(centeredLayoutState)) {
				delete this.profileMemento[EditorPart.EDITOR_PART_CENTERED_VIEW_STORAGE_KEY];
			} else {
				this.profileMemento[EditorPart.EDITOR_PART_CENTERED_VIEW_STORAGE_KEY] = centeredLayoutState;
			}
		}

		super.saveState();
	}

	protected loadState(): IEditorPartUIState | undefined {
		return this.workspaceMemento[EditorPart.EDITOR_PART_UI_STATE_STORAGE_KEY];
	}

	createState(): IEditorPartUIState {
		return {
			serializedGrid: this.gridWidget.serialize(),
			activeGroup: this._activeGroup.id,
			mostRecentActiveGroups: this.mostRecentActiveGroups
		};
	}

	applyState(state: IEditorPartUIState | 'empty', options?: IEditorGroupViewOptions): Promise<void> {
		if (state === 'empty') {
			return this.doApplyEmptyState();
		} else {
			return this.doApplyState(state, options);
		}
	}

	private async doApplyState(state: IEditorPartUIState, options?: IEditorGroupViewOptions): Promise<void> {
		const groups = await this.doPrepareApplyState();

		// Pause add/remove events for groups during the duration of applying the state
		// This ensures that we can do this transition atomically with the new state
		// being ready when the events are fired. This is important because usually there
		// is never the state where no groups are present, but for this transition we
		// need to temporarily dispose all groups to restore the new set.

		this._onDidAddGroup.pause();
		this._onDidRemoveGroup.pause();

		this.disposeGroups();

		// MRU
		this.mostRecentActiveGroups = state.mostRecentActiveGroups;

		// Grid Widget
		try {
			this.doApplyGridState(state.serializedGrid, state.activeGroup, undefined, options);
		} finally {
			// It is very important to keep this order: first resume the events for
			// removed groups and then for added groups. Many listeners may store
			// groups in sets by their identifier and groups can have the same
			// identifier before and after.
			this._onDidRemoveGroup.resume();
			this._onDidAddGroup.resume();
		}

		// Restore editors that were not closed before and are now opened now
		await this.activeGroup.openEditors(
			groups
				.flatMap(group => group.editors)
				.filter(editor => this.editorPartsView.groups.every(groupView => !groupView.contains(editor)))
				.map(editor => ({
					editor, options: { pinned: true, preserveFocus: true, inactive: true }
				}))
		);
	}

	private async doApplyEmptyState(): Promise<void> {
		await this.doPrepareApplyState();

		this.mergeAllGroups(this.activeGroup);
	}

	private async doPrepareApplyState(): Promise<IEditorGroupView[]> {

		// Before disposing groups, try to close as many editors as
		// possible, but skip over those that would trigger a dialog
		// (for example when being dirty). This is to be able to later
		// restore these editors after state has been applied.

		const groups = this.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE);
		for (const group of groups) {
			await group.closeAllEditors({ excludeConfirming: true });
		}

		return groups;
	}

	private doApplyGridState(gridState: ISerializedGrid, activeGroupId: GroupIdentifier, editorGroupViewsToReuse?: IEditorGroupView[], options?: IEditorGroupViewOptions): void {

		// Recreate grid widget from state
		this.doCreateGridControlWithState(gridState, activeGroupId, editorGroupViewsToReuse, options);

		// Layout
		this.doLayout(this._contentDimension);

		// Update container
		this.updateContainer();

		// Events for groups that got added
		for (const groupView of this.getGroups(GroupsOrder.GRID_APPEARANCE)) {
			if (!editorGroupViewsToReuse?.includes(groupView)) {
				this._onDidAddGroup.fire(groupView);
			}
		}

		// Notify group index change given layout has changed
		this.notifyGroupIndexChange();
	}

	private onDidChangeMementoState(e: IStorageValueChangeEvent): void {
		if (e.external && e.scope === StorageScope.WORKSPACE) {
			this.reloadMemento(e.scope);

			const state = this.loadState();
			if (state) {
				this.applyState(state);
			}
		}
	}

	toJSON(): object {
		return {
			type: Parts.EDITOR_PART
		};
	}

	private disposeGroups(): void {
		for (const group of this.groups) {
			group.dispose();

			this._onDidRemoveGroup.fire(group);
		}

		this.groupViews.clear();
		this.mostRecentActiveGroups = [];
	}

	override dispose(): void {

		// Event
		this._onWillDispose.fire();

		// Forward to all groups
		this.disposeGroups();

		// Grid widget
		this.gridWidget?.dispose();

		super.dispose();
	}

	//#endregion
}

export class MainEditorPart extends EditorPart {

	constructor(
		editorPartsView: IEditorPartsView,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IConfigurationService configurationService: IConfigurationService,
		@IStorageService storageService: IStorageService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IHostService hostService: IHostService,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		super(editorPartsView, Parts.EDITOR_PART, '', mainWindow.vscodeWindowId, instantiationService, themeService, configurationService, storageService, layoutService, hostService, contextKeyService);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/editorParts.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/editorParts.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { EditorGroupLayout, GroupDirection, GroupLocation, GroupOrientation, GroupsArrangement, GroupsOrder, IAuxiliaryEditorPart, IEditorGroupContextKeyProvider, IEditorDropTargetDelegate, IEditorGroupsService, IEditorSideGroup, IEditorWorkingSet, IFindGroupScope, IMergeGroupOptions, IEditorWorkingSetOptions, IEditorPart } from '../../../services/editor/common/editorGroupsService.js';
import { Emitter } from '../../../../base/common/event.js';
import { DisposableMap, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { GroupIdentifier, IEditorPartOptions } from '../../../common/editor.js';
import { EditorPart, IEditorPartUIState, MainEditorPart } from './editorPart.js';
import { IEditorGroupView, IEditorPartsView } from './editor.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { distinct } from '../../../../base/common/arrays.js';
import { AuxiliaryEditorPart, IAuxiliaryEditorPartOpenOptions } from './auxiliaryEditorPart.js';
import { MultiWindowParts } from '../../part.js';
import { DeferredPromise } from '../../../../base/common/async.js';
import { IStorageService, IStorageValueChangeEvent, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IAuxiliaryWindowOpenOptions, IAuxiliaryWindowService } from '../../../services/auxiliaryWindow/browser/auxiliaryWindowService.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { ContextKeyValue, IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { isHTMLElement } from '../../../../base/browser/dom.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { DeepPartial } from '../../../../base/common/types.js';
import { IStatusbarService } from '../../../services/statusbar/browser/statusbar.js';
import { mainWindow } from '../../../../base/browser/window.js';

interface IEditorPartsUIState {
	readonly auxiliary: IAuxiliaryEditorPartState[];
	readonly mru: number[];
	// main state is managed by the main part
}

interface IAuxiliaryEditorPartState extends IAuxiliaryWindowOpenOptions {
	readonly state: IEditorPartUIState;
}

interface IEditorWorkingSetState extends IEditorWorkingSet {
	readonly main: IEditorPartUIState;
	readonly auxiliary: IEditorPartsUIState;
}

interface IEditorPartsMemento {
	'editorparts.state'?: IEditorPartsUIState;
}

export class EditorParts extends MultiWindowParts<EditorPart, IEditorPartsMemento> implements IEditorGroupsService, IEditorPartsView {

	declare readonly _serviceBrand: undefined;

	readonly mainPart: MainEditorPart;

	private mostRecentActiveParts: MainEditorPart[];

	constructor(
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
		@IStorageService private readonly storageService: IStorageService,
		@IThemeService themeService: IThemeService,
		@IAuxiliaryWindowService private readonly auxiliaryWindowService: IAuxiliaryWindowService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService
	) {
		super('workbench.editorParts', themeService, storageService);

		this.editorWorkingSets = (() => {
			const workingSetsRaw = this.storageService.get(EditorParts.EDITOR_WORKING_SETS_STORAGE_KEY, StorageScope.WORKSPACE);
			if (workingSetsRaw) {
				return JSON.parse(workingSetsRaw);
			}

			return [];
		})();

		this.mainPart = this._register(this.createMainEditorPart());
		this._register(this.registerPart(this.mainPart));

		this.mostRecentActiveParts = [this.mainPart];

		this.restoreParts();
		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.onDidChangeMementoValue(StorageScope.WORKSPACE, this._store)(e => this.onDidChangeMementoState(e)));
		this.whenReady.then(() => this.registerGroupsContextKeyListeners());
	}

	protected createMainEditorPart(): MainEditorPart {
		return this.instantiationService.createInstance(MainEditorPart, this);
	}

	//#region Scoped Instantiation Services

	private readonly mapPartToInstantiationService = new Map<number /* window ID */, IInstantiationService>();

	getScopedInstantiationService(part: IEditorPart): IInstantiationService {
		if (part === this.mainPart) {
			if (!this.mapPartToInstantiationService.has(part.windowId)) {
				this.instantiationService.invokeFunction(accessor => {
					const editorService = accessor.get(IEditorService);
					const statusbarService = accessor.get(IStatusbarService);

					this.mapPartToInstantiationService.set(part.windowId, this._register(this.mainPart.scopedInstantiationService.createChild(new ServiceCollection(
						[IEditorService, editorService.createScoped(this.mainPart, this._store)],
						[IStatusbarService, statusbarService.createScoped(statusbarService, this._store)]
					))));
				});
			}
		}

		return this.mapPartToInstantiationService.get(part.windowId) ?? this.instantiationService;
	}

	//#endregion

	//#region Auxiliary Editor Parts

	private readonly _onDidCreateAuxiliaryEditorPart = this._register(new Emitter<IAuxiliaryEditorPart>());
	readonly onDidCreateAuxiliaryEditorPart = this._onDidCreateAuxiliaryEditorPart.event;

	async createAuxiliaryEditorPart(options?: IAuxiliaryEditorPartOpenOptions): Promise<IAuxiliaryEditorPart> {
		const { part, instantiationService, disposables } = await this.instantiationService.createInstance(AuxiliaryEditorPart, this).create(this.getGroupsLabel(this._parts.size), options);

		// Keep instantiation service
		this.mapPartToInstantiationService.set(part.windowId, instantiationService);
		disposables.add(toDisposable(() => this.mapPartToInstantiationService.delete(part.windowId)));

		// Events
		this._onDidAddGroup.fire(part.activeGroup);

		this._onDidCreateAuxiliaryEditorPart.fire(part);

		return part;
	}

	//#endregion

	//#region Registration

	override registerPart(part: EditorPart): IDisposable {
		const disposables = this._register(new DisposableStore());
		disposables.add(super.registerPart(part));

		this.registerEditorPartListeners(part, disposables);

		return disposables;
	}

	protected override unregisterPart(part: EditorPart): void {
		super.unregisterPart(part);

		// Notify all parts about a groups label change
		// given it is computed based on the index

		this.parts.forEach((part, index) => {
			if (part === this.mainPart) {
				return;
			}

			part.notifyGroupsLabelChange(this.getGroupsLabel(index));
		});
	}

	private registerEditorPartListeners(part: EditorPart, disposables: DisposableStore): void {
		disposables.add(part.onDidFocus(() => {
			this.doUpdateMostRecentActive(part, true);

			if (this._parts.size > 1) {
				// Either main or auxiliary editor part got focus
				// which we have to treat as a group change event.
				this._onDidActiveGroupChange.fire(this.activeGroup);
			}
		}));
		disposables.add(toDisposable(() => {
			this.doUpdateMostRecentActive(part);

			if (part.windowId !== mainWindow.vscodeWindowId) {
				// An auxiliary editor part is closing which we have
				// to treat as group change event for the next editor
				// part that becomes active.
				// Refs: https://github.com/microsoft/vscode/issues/257058
				this._onDidActiveGroupChange.fire(this.activeGroup);
			}
		}));

		disposables.add(part.onDidChangeActiveGroup(group => this._onDidActiveGroupChange.fire(group)));
		disposables.add(part.onDidAddGroup(group => this._onDidAddGroup.fire(group)));
		disposables.add(part.onDidRemoveGroup(group => this._onDidRemoveGroup.fire(group)));
		disposables.add(part.onDidMoveGroup(group => this._onDidMoveGroup.fire(group)));
		disposables.add(part.onDidActivateGroup(group => this._onDidActivateGroup.fire(group)));
		disposables.add(part.onDidChangeGroupMaximized(maximized => this._onDidChangeGroupMaximized.fire(maximized)));

		disposables.add(part.onDidChangeGroupIndex(group => this._onDidChangeGroupIndex.fire(group)));
		disposables.add(part.onDidChangeGroupLocked(group => this._onDidChangeGroupLocked.fire(group)));
	}

	private doUpdateMostRecentActive(part: EditorPart, makeMostRecentlyActive?: boolean): void {
		const index = this.mostRecentActiveParts.indexOf(part);

		// Remove from MRU list
		if (index !== -1) {
			this.mostRecentActiveParts.splice(index, 1);
		}

		// Add to front as needed
		if (makeMostRecentlyActive) {
			this.mostRecentActiveParts.unshift(part);
		}
	}

	private getGroupsLabel(index: number): string {
		return localize('groupLabel', "Window {0}", index + 1);
	}

	//#endregion

	//#region Helpers

	override getPart(group: IEditorGroupView | GroupIdentifier): EditorPart;
	override getPart(element: HTMLElement): EditorPart;
	override getPart(groupOrElement: IEditorGroupView | GroupIdentifier | HTMLElement): EditorPart {
		if (this._parts.size > 1) {
			if (isHTMLElement(groupOrElement)) {
				const element = groupOrElement;

				return this.getPartByDocument(element.ownerDocument);
			} else {
				const group = groupOrElement;

				let id: GroupIdentifier;
				if (typeof group === 'number') {
					id = group;
				} else {
					id = group.id;
				}

				for (const part of this._parts) {
					if (part.hasGroup(id)) {
						return part;
					}
				}
			}
		}

		return this.mainPart;
	}

	//#endregion

	//#region Lifecycle / State

	private static readonly EDITOR_PARTS_UI_STATE_STORAGE_KEY = 'editorparts.state';

	private readonly workspaceMemento = this.getMemento(StorageScope.WORKSPACE, StorageTarget.USER);

	private _isReady = false;
	get isReady(): boolean { return this._isReady; }

	private readonly whenReadyPromise = new DeferredPromise<void>();
	readonly whenReady = this.whenReadyPromise.p;

	private readonly whenRestoredPromise = new DeferredPromise<void>();
	readonly whenRestored = this.whenRestoredPromise.p;

	private async restoreParts(): Promise<void> {

		// Join on the main part being ready to pick
		// the right moment to begin restoring.
		// The main part is automatically being created
		// as part of the overall startup process.
		await this.mainPart.whenReady;

		// Only attempt to restore auxiliary editor parts
		// when the main part did restore. It is possible
		// that restoring was not attempted because specific
		// editors were opened.
		if (this.mainPart.willRestoreState) {
			const state = this.loadState();
			if (state) {
				await this.restoreState(state);
			}
		}

		const mostRecentActivePart = this.mostRecentActiveParts.at(0);
		mostRecentActivePart?.activeGroup.focus();

		this._isReady = true;
		this.whenReadyPromise.complete();

		// Await restored
		await Promise.allSettled(this.parts.map(part => part.whenRestored));
		this.whenRestoredPromise.complete();
	}

	private loadState(): IEditorPartsUIState | undefined {
		return this.workspaceMemento[EditorParts.EDITOR_PARTS_UI_STATE_STORAGE_KEY];
	}

	protected override saveState(): void {
		const state = this.createState();
		if (state.auxiliary.length === 0) {
			delete this.workspaceMemento[EditorParts.EDITOR_PARTS_UI_STATE_STORAGE_KEY];
		} else {
			this.workspaceMemento[EditorParts.EDITOR_PARTS_UI_STATE_STORAGE_KEY] = state;
		}
	}

	private createState(): IEditorPartsUIState {
		return {
			auxiliary: this.parts.filter(part => part !== this.mainPart).map(part => {
				const auxiliaryWindow = this.auxiliaryWindowService.getWindow(part.windowId);

				return {
					state: part.createState(),
					...auxiliaryWindow?.createState()
				};
			}),
			mru: this.mostRecentActiveParts.map(part => this.parts.indexOf(part))
		};
	}

	private async restoreState(state: IEditorPartsUIState): Promise<void> {
		if (state.auxiliary.length) {
			const auxiliaryEditorPartPromises: Promise<IAuxiliaryEditorPart>[] = [];

			// Create auxiliary editor parts
			for (const auxiliaryEditorPartState of state.auxiliary) {
				auxiliaryEditorPartPromises.push(this.createAuxiliaryEditorPart(auxiliaryEditorPartState));
			}

			// Await creation
			await Promise.allSettled(auxiliaryEditorPartPromises);

			// Update MRU list
			if (state.mru.length === this.parts.length) {
				this.mostRecentActiveParts = state.mru.map(index => this.parts[index]);
			} else {
				this.mostRecentActiveParts = [...this.parts];
			}

			// Await ready
			await Promise.allSettled(this.parts.map(part => part.whenReady));
		}
	}

	get hasRestorableState(): boolean {
		return this.parts.some(part => part.hasRestorableState);
	}

	private onDidChangeMementoState(e: IStorageValueChangeEvent): void {
		if (e.external && e.scope === StorageScope.WORKSPACE) {
			this.reloadMemento(e.scope);

			const state = this.loadState();
			if (state) {
				this.applyState(state);
			}
		}
	}

	private async applyState(state: IEditorPartsUIState | 'empty'): Promise<boolean> {

		// Before closing windows, try to close as many editors as
		// possible, but skip over those that would trigger a dialog
		// (for example when being dirty). This is to be able to have
		// them merge into the main part.

		for (const part of this.parts) {
			if (part === this.mainPart) {
				continue; // main part takes care on its own
			}

			for (const group of part.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE)) {
				await group.closeAllEditors({ excludeConfirming: true });
			}

			const closed = (part as unknown as IAuxiliaryEditorPart).close(); // will move remaining editors to main part
			if (!closed) {
				return false; // this indicates that closing was vetoed
			}
		}

		// Restore auxiliary state unless we are in an empty state
		if (state !== 'empty') {
			await this.restoreState(state);
		}

		return true;
	}

	//#endregion

	//#region Working Sets

	private static readonly EDITOR_WORKING_SETS_STORAGE_KEY = 'editor.workingSets';

	private editorWorkingSets: IEditorWorkingSetState[];

	saveWorkingSet(name: string): IEditorWorkingSet {
		const workingSet: IEditorWorkingSetState = {
			id: generateUuid(),
			name,
			main: this.mainPart.createState(),
			auxiliary: this.createState()
		};

		this.editorWorkingSets.push(workingSet);

		this.saveWorkingSets();

		return {
			id: workingSet.id,
			name: workingSet.name
		};
	}

	getWorkingSets(): IEditorWorkingSet[] {
		return this.editorWorkingSets.map(workingSet => ({ id: workingSet.id, name: workingSet.name }));
	}

	deleteWorkingSet(workingSet: IEditorWorkingSet): void {
		const index = this.indexOfWorkingSet(workingSet);
		if (typeof index === 'number') {
			this.editorWorkingSets.splice(index, 1);

			this.saveWorkingSets();
		}
	}

	async applyWorkingSet(workingSet: IEditorWorkingSet | 'empty', options?: IEditorWorkingSetOptions): Promise<boolean> {
		let workingSetState: IEditorWorkingSetState | 'empty' | undefined;
		if (workingSet === 'empty') {
			workingSetState = 'empty';
		} else {
			workingSetState = this.editorWorkingSets[this.indexOfWorkingSet(workingSet) ?? -1];
		}

		if (!workingSetState) {
			return false;
		}

		// Apply state: begin with auxiliary windows first because it helps to keep
		// editors around that need confirmation by moving them into the main part.
		// Also, in rare cases, the auxiliary part may not be able to apply the state
		// for certain editors that cannot move to the main part.
		const applied = await this.applyState(workingSetState === 'empty' ? workingSetState : workingSetState.auxiliary);
		if (!applied) {
			return false;
		}
		await this.mainPart.applyState(workingSetState === 'empty' ? workingSetState : workingSetState.main, options);

		// Restore Focus unless instructed otherwise
		if (!options?.preserveFocus) {
			const mostRecentActivePart = this.mostRecentActiveParts.at(0);
			if (mostRecentActivePart) {
				await mostRecentActivePart.whenReady;
				mostRecentActivePart.activeGroup.focus();
			}
		}

		return true;
	}

	private indexOfWorkingSet(workingSet: IEditorWorkingSet): number | undefined {
		for (let i = 0; i < this.editorWorkingSets.length; i++) {
			if (this.editorWorkingSets[i].id === workingSet.id) {
				return i;
			}
		}

		return undefined;
	}

	private saveWorkingSets(): void {
		this.storageService.store(EditorParts.EDITOR_WORKING_SETS_STORAGE_KEY, JSON.stringify(this.editorWorkingSets), StorageScope.WORKSPACE, StorageTarget.MACHINE);
	}

	//#endregion

	//#region Events

	private readonly _onDidActiveGroupChange = this._register(new Emitter<IEditorGroupView>());
	readonly onDidChangeActiveGroup = this._onDidActiveGroupChange.event;

	private readonly _onDidAddGroup = this._register(new Emitter<IEditorGroupView>());
	readonly onDidAddGroup = this._onDidAddGroup.event;

	private readonly _onDidRemoveGroup = this._register(new Emitter<IEditorGroupView>());
	readonly onDidRemoveGroup = this._onDidRemoveGroup.event;

	private readonly _onDidMoveGroup = this._register(new Emitter<IEditorGroupView>());
	readonly onDidMoveGroup = this._onDidMoveGroup.event;

	private readonly _onDidActivateGroup = this._register(new Emitter<IEditorGroupView>());
	readonly onDidActivateGroup = this._onDidActivateGroup.event;

	private readonly _onDidChangeGroupIndex = this._register(new Emitter<IEditorGroupView>());
	readonly onDidChangeGroupIndex = this._onDidChangeGroupIndex.event;

	private readonly _onDidChangeGroupLocked = this._register(new Emitter<IEditorGroupView>());
	readonly onDidChangeGroupLocked = this._onDidChangeGroupLocked.event;

	private readonly _onDidChangeGroupMaximized = this._register(new Emitter<boolean>());
	readonly onDidChangeGroupMaximized = this._onDidChangeGroupMaximized.event;

	//#endregion

	//#region Group Management

	get activeGroup(): IEditorGroupView {
		return this.activePart.activeGroup;
	}

	get sideGroup(): IEditorSideGroup {
		return this.activePart.sideGroup;
	}

	get groups(): IEditorGroupView[] {
		return this.getGroups();
	}

	get count(): number {
		return this.groups.length;
	}

	getGroups(order = GroupsOrder.CREATION_TIME): IEditorGroupView[] {
		if (this._parts.size > 1) {
			let parts: EditorPart[];
			switch (order) {
				case GroupsOrder.GRID_APPEARANCE: // we currently do not have a way to compute by appearance over multiple windows
				case GroupsOrder.CREATION_TIME:
					parts = this.parts;
					break;
				case GroupsOrder.MOST_RECENTLY_ACTIVE:
					parts = distinct([...this.mostRecentActiveParts, ...this.parts]); // always ensure all parts are included
					break;
			}

			return parts.flatMap(part => part.getGroups(order));
		}

		return this.mainPart.getGroups(order);
	}

	getGroup(identifier: GroupIdentifier): IEditorGroupView | undefined {
		if (this._parts.size > 1) {
			for (const part of this._parts) {
				const group = part.getGroup(identifier);
				if (group) {
					return group;
				}
			}
		}

		return this.mainPart.getGroup(identifier);
	}

	private assertGroupView(group: IEditorGroupView | GroupIdentifier): IEditorGroupView {
		let groupView: IEditorGroupView | undefined;
		if (typeof group === 'number') {
			groupView = this.getGroup(group);
		} else {
			groupView = group;
		}

		if (!groupView) {
			throw new Error('Invalid editor group provided!');
		}

		return groupView;
	}

	activateGroup(group: IEditorGroupView | GroupIdentifier): IEditorGroupView {
		return this.getPart(group).activateGroup(group);
	}

	getSize(group: IEditorGroupView | GroupIdentifier): { width: number; height: number } {
		return this.getPart(group).getSize(group);
	}

	setSize(group: IEditorGroupView | GroupIdentifier, size: { width: number; height: number }): void {
		this.getPart(group).setSize(group, size);
	}

	arrangeGroups(arrangement: GroupsArrangement, group: IEditorGroupView | GroupIdentifier = this.activePart.activeGroup): void {
		this.getPart(group).arrangeGroups(arrangement, group);
	}

	toggleMaximizeGroup(group: IEditorGroupView | GroupIdentifier = this.activePart.activeGroup): void {
		this.getPart(group).toggleMaximizeGroup(group);
	}

	toggleExpandGroup(group: IEditorGroupView | GroupIdentifier = this.activePart.activeGroup): void {
		this.getPart(group).toggleExpandGroup(group);
	}

	restoreGroup(group: IEditorGroupView | GroupIdentifier): IEditorGroupView {
		return this.getPart(group).restoreGroup(group);
	}

	applyLayout(layout: EditorGroupLayout): void {
		this.activePart.applyLayout(layout);
	}

	getLayout(): EditorGroupLayout {
		return this.activePart.getLayout();
	}

	get orientation() {
		return this.activePart.orientation;
	}

	setGroupOrientation(orientation: GroupOrientation): void {
		this.activePart.setGroupOrientation(orientation);
	}

	findGroup(scope: IFindGroupScope, source: IEditorGroupView | GroupIdentifier = this.activeGroup, wrap?: boolean): IEditorGroupView | undefined {
		const sourcePart = this.getPart(source);
		if (this._parts.size > 1) {
			const groups = this.getGroups(GroupsOrder.GRID_APPEARANCE);

			// Ensure that FIRST/LAST dispatches globally over all parts
			if (scope.location === GroupLocation.FIRST || scope.location === GroupLocation.LAST) {
				return scope.location === GroupLocation.FIRST ? groups[0] : groups[groups.length - 1];
			}

			// Try to find in target part first without wrapping
			const group = sourcePart.findGroup(scope, source, false);
			if (group) {
				return group;
			}

			// Ensure that NEXT/PREVIOUS dispatches globally over all parts
			if (scope.location === GroupLocation.NEXT || scope.location === GroupLocation.PREVIOUS) {
				const sourceGroup = this.assertGroupView(source);
				const index = groups.indexOf(sourceGroup);

				if (scope.location === GroupLocation.NEXT) {
					let nextGroup: IEditorGroupView | undefined = groups[index + 1];
					if (!nextGroup && wrap) {
						nextGroup = groups[0];
					}

					return nextGroup;
				} else {
					let previousGroup: IEditorGroupView | undefined = groups[index - 1];
					if (!previousGroup && wrap) {
						previousGroup = groups[groups.length - 1];
					}

					return previousGroup;
				}
			}
		}

		return sourcePart.findGroup(scope, source, wrap);
	}

	addGroup(location: IEditorGroupView | GroupIdentifier, direction: GroupDirection): IEditorGroupView {
		return this.getPart(location).addGroup(location, direction);
	}

	removeGroup(group: IEditorGroupView | GroupIdentifier): void {
		this.getPart(group).removeGroup(group);
	}

	moveGroup(group: IEditorGroupView | GroupIdentifier, location: IEditorGroupView | GroupIdentifier, direction: GroupDirection): IEditorGroupView {
		return this.getPart(group).moveGroup(group, location, direction);
	}

	mergeGroup(group: IEditorGroupView | GroupIdentifier, target: IEditorGroupView | GroupIdentifier, options?: IMergeGroupOptions): boolean {
		return this.getPart(group).mergeGroup(group, target, options);
	}

	mergeAllGroups(target: IEditorGroupView | GroupIdentifier, options?: IMergeGroupOptions): boolean {
		return this.activePart.mergeAllGroups(target, options);
	}

	copyGroup(group: IEditorGroupView | GroupIdentifier, location: IEditorGroupView | GroupIdentifier, direction: GroupDirection): IEditorGroupView {
		return this.getPart(group).copyGroup(group, location, direction);
	}

	createEditorDropTarget(container: HTMLElement, delegate: IEditorDropTargetDelegate): IDisposable {
		return this.getPart(container).createEditorDropTarget(container, delegate);
	}

	//#endregion

	//#region Editor Group Context Key Handling

	private readonly globalContextKeys = new Map<string, IContextKey<ContextKeyValue>>();
	private readonly scopedContextKeys = new Map<GroupIdentifier, Map<string, IContextKey<ContextKeyValue>>>();

	private registerGroupsContextKeyListeners(): void {
		this._register(this.onDidChangeActiveGroup(() => this.updateGlobalContextKeys()));
		this.groups.forEach(group => this.registerGroupContextKeyProvidersListeners(group));
		this._register(this.onDidAddGroup(group => this.registerGroupContextKeyProvidersListeners(group)));
		this._register(this.onDidRemoveGroup(group => {
			this.scopedContextKeys.delete(group.id);
			this.registeredContextKeys.delete(group.id);
			this.contextKeyProviderDisposables.deleteAndDispose(group.id);
		}));
	}

	private updateGlobalContextKeys(): void {
		const activeGroupScopedContextKeys = this.scopedContextKeys.get(this.activeGroup.id);
		if (!activeGroupScopedContextKeys) {
			return;
		}

		for (const [key, globalContextKey] of this.globalContextKeys) {
			const scopedContextKey = activeGroupScopedContextKeys.get(key);
			if (scopedContextKey) {
				globalContextKey.set(scopedContextKey.get());
			} else {
				globalContextKey.reset();
			}
		}
	}

	bind<T extends ContextKeyValue>(contextKey: RawContextKey<T>, group: IEditorGroupView): IContextKey<T> {

		// Ensure we only bind to the same context key once globaly
		let globalContextKey = this.globalContextKeys.get(contextKey.key);
		if (!globalContextKey) {
			globalContextKey = contextKey.bindTo(this.contextKeyService);
			this.globalContextKeys.set(contextKey.key, globalContextKey);
		}

		// Ensure we only bind to the same context key once per group
		let groupScopedContextKeys = this.scopedContextKeys.get(group.id);
		if (!groupScopedContextKeys) {
			groupScopedContextKeys = new Map<string, IContextKey<ContextKeyValue>>();
			this.scopedContextKeys.set(group.id, groupScopedContextKeys);
		}
		let scopedContextKey = groupScopedContextKeys.get(contextKey.key);
		if (!scopedContextKey) {
			scopedContextKey = contextKey.bindTo(group.scopedContextKeyService);
			groupScopedContextKeys.set(contextKey.key, scopedContextKey);
		}

		const that = this;
		return {
			get(): T | undefined {
				return scopedContextKey.get() as T | undefined;
			},
			set(value: T): void {
				if (that.activeGroup === group) {
					globalContextKey.set(value);
				}
				scopedContextKey.set(value);
			},
			reset(): void {
				if (that.activeGroup === group) {
					globalContextKey.reset();
				}
				scopedContextKey.reset();
			},
		};
	}

	private readonly contextKeyProviders = new Map<string, IEditorGroupContextKeyProvider<ContextKeyValue>>();
	private readonly registeredContextKeys = new Map<GroupIdentifier, Map<string, IContextKey>>();

	registerContextKeyProvider<T extends ContextKeyValue>(provider: IEditorGroupContextKeyProvider<T>): IDisposable {
		if (this.contextKeyProviders.has(provider.contextKey.key) || this.globalContextKeys.has(provider.contextKey.key)) {
			throw new Error(`A context key provider for key ${provider.contextKey.key} already exists.`);
		}

		this.contextKeyProviders.set(provider.contextKey.key, provider);

		const setContextKeyForGroups = () => {
			for (const group of this.groups) {
				this.updateRegisteredContextKey(group, provider);
			}
		};

		// Run initially and on change
		setContextKeyForGroups();
		const onDidChange = provider.onDidChange?.(() => setContextKeyForGroups());

		return toDisposable(() => {
			onDidChange?.dispose();

			this.globalContextKeys.delete(provider.contextKey.key);
			this.scopedContextKeys.forEach(scopedContextKeys => scopedContextKeys.delete(provider.contextKey.key));

			this.contextKeyProviders.delete(provider.contextKey.key);
			this.registeredContextKeys.forEach(registeredContextKeys => registeredContextKeys.delete(provider.contextKey.key));
		});
	}

	private readonly contextKeyProviderDisposables = this._register(new DisposableMap<GroupIdentifier, IDisposable>());
	private registerGroupContextKeyProvidersListeners(group: IEditorGroupView): void {

		// Update context keys from providers for the group when its active editor changes
		const disposable = group.onDidActiveEditorChange(() => {
			for (const contextKeyProvider of this.contextKeyProviders.values()) {
				this.updateRegisteredContextKey(group, contextKeyProvider);
			}
		});

		this.contextKeyProviderDisposables.set(group.id, disposable);
	}

	private updateRegisteredContextKey<T extends ContextKeyValue>(group: IEditorGroupView, provider: IEditorGroupContextKeyProvider<T>): void {

		// Get the group scoped context keys for the provider
		// If the providers context key has not yet been bound
		// to the group, do so now.

		let groupRegisteredContextKeys = this.registeredContextKeys.get(group.id);
		if (!groupRegisteredContextKeys) {
			groupRegisteredContextKeys = new Map<string, IContextKey>();
			this.registeredContextKeys.set(group.id, groupRegisteredContextKeys);
		}

		let scopedRegisteredContextKey = groupRegisteredContextKeys.get(provider.contextKey.key);
		if (!scopedRegisteredContextKey) {
			scopedRegisteredContextKey = this.bind(provider.contextKey, group);
			groupRegisteredContextKeys.set(provider.contextKey.key, scopedRegisteredContextKey);
		}

		// Set the context key value for the group context
		scopedRegisteredContextKey.set(provider.getGroupContextKeyValue(group));
	}

	//#endregion

	//#region Main Editor Part Only

	get partOptions() { return this.mainPart.partOptions; }
	get onDidChangeEditorPartOptions() { return this.mainPart.onDidChangeEditorPartOptions; }

	enforcePartOptions(options: DeepPartial<IEditorPartOptions>): IDisposable {
		return this.mainPart.enforcePartOptions(options);
	}

	//#endregion
}

registerSingleton(IEditorGroupsService, EditorParts, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/editorPlaceholder.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/editorPlaceholder.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/editorplaceholder.css';
import { localize } from '../../../../nls.js';
import { truncate } from '../../../../base/common/strings.js';
import Severity from '../../../../base/common/severity.js';
import { IEditorOpenContext, isEditorOpenError } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { EditorPane } from './editorPane.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { DomScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { ScrollbarVisibility } from '../../../../base/common/scrollable.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { Dimension, size, clearNode, $, EventHelper } from '../../../../base/browser/dom.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { DisposableStore, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { assertReturnsAllDefined } from '../../../../base/common/types.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IWorkspaceContextService, isSingleFolderWorkspaceIdentifier, toWorkspaceIdentifier } from '../../../../platform/workspace/common/workspace.js';
import { EditorOpenSource, IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { computeEditorAriaLabel, EditorPaneDescriptor } from '../../editor.js';
import { ButtonBar } from '../../../../base/browser/ui/button/button.js';
import { defaultButtonStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { SimpleIconLabel } from '../../../../base/browser/ui/iconLabel/simpleIconLabel.js';
import { FileChangeType, FileOperationError, FileOperationResult, IFileService } from '../../../../platform/files/common/files.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import { showWindowLogActionId } from '../../../services/log/common/logConstants.js';

export interface IEditorPlaceholderContents {
	icon: string;
	label: string;
	actions: IEditorPlaceholderContentsAction[];
}

export interface IEditorPlaceholderContentsAction {
	label: string;
	run: () => unknown;
}

export interface IErrorEditorPlaceholderOptions extends IEditorOptions {
	error?: Error;
}

export abstract class EditorPlaceholder extends EditorPane {

	private static readonly PLACEHOLDER_LABEL_MAX_LENGTH = 1024;

	private container: HTMLElement | undefined;
	private scrollbar: DomScrollableElement | undefined;
	private readonly inputDisposable = this._register(new MutableDisposable());

	constructor(
		id: string,
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService
	) {
		super(id, group, telemetryService, themeService, storageService);
	}

	protected createEditor(parent: HTMLElement): void {

		// Container
		this.container = $('.monaco-editor-pane-placeholder', {
			tabIndex: 0 // enable focus support from the editor part (do not remove)
		});
		this.container.style.outline = 'none';

		// Custom Scrollbars
		this.scrollbar = this._register(new DomScrollableElement(this.container, { horizontal: ScrollbarVisibility.Auto, vertical: ScrollbarVisibility.Auto }));
		parent.appendChild(this.scrollbar.getDomNode());
	}

	override async setInput(input: EditorInput, options: IEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		await super.setInput(input, options, context, token);

		// Check for cancellation
		if (token.isCancellationRequested) {
			return;
		}

		// Render Input
		this.inputDisposable.value = await this.renderInput(input, options);
	}

	private async renderInput(input: EditorInput, options: IEditorOptions | undefined): Promise<IDisposable> {
		const [container, scrollbar] = assertReturnsAllDefined(this.container, this.scrollbar);

		// Reset any previous contents
		clearNode(container);

		// Delegate to implementation for contents
		const disposables = new DisposableStore();
		const { icon, label, actions } = await this.getContents(input, options, disposables);
		const truncatedLabel = truncate(label, EditorPlaceholder.PLACEHOLDER_LABEL_MAX_LENGTH);

		// Icon
		const iconContainer = container.appendChild($('.editor-placeholder-icon-container'));
		const iconWidget = disposables.add(new SimpleIconLabel(iconContainer));
		iconWidget.text = icon;

		// Label
		const labelContainer = container.appendChild($('.editor-placeholder-label-container'));
		const labelWidget = $('span');
		labelWidget.textContent = truncatedLabel;
		labelContainer.appendChild(labelWidget);

		// ARIA label
		container.setAttribute('aria-label', `${computeEditorAriaLabel(input, undefined, this.group, undefined)}, ${truncatedLabel}`);

		// Buttons
		if (actions.length) {
			const actionsContainer = container.appendChild($('.editor-placeholder-buttons-container'));
			const buttons = disposables.add(new ButtonBar(actionsContainer));

			for (let i = 0; i < actions.length; i++) {
				const button = disposables.add(buttons.addButton({
					...defaultButtonStyles,
					secondary: i !== 0
				}));

				button.label = actions[i].label;
				disposables.add(button.onDidClick(e => {
					if (e) {
						EventHelper.stop(e, true);
					}

					actions[i].run();
				}));
			}
		}

		// Adjust scrollbar
		scrollbar.scanDomNode();

		return disposables;
	}

	protected abstract getContents(input: EditorInput, options: IEditorOptions | undefined, disposables: DisposableStore): Promise<IEditorPlaceholderContents>;

	override clearInput(): void {
		if (this.container) {
			clearNode(this.container);
		}

		this.inputDisposable.clear();

		super.clearInput();
	}

	layout(dimension: Dimension): void {
		const [container, scrollbar] = assertReturnsAllDefined(this.container, this.scrollbar);

		// Pass on to Container
		size(container, dimension.width, dimension.height);

		// Adjust scrollbar
		scrollbar.scanDomNode();

		// Toggle responsive class
		container.classList.toggle('max-height-200px', dimension.height <= 200);
	}

	override focus(): void {
		super.focus();

		this.container?.focus();
	}

	override dispose(): void {
		this.container?.remove();

		super.dispose();
	}
}

export class WorkspaceTrustRequiredPlaceholderEditor extends EditorPlaceholder {

	static readonly ID = 'workbench.editors.workspaceTrustRequiredEditor';
	private static readonly LABEL = localize('trustRequiredEditor', "Workspace Trust Required");

	static readonly DESCRIPTOR = EditorPaneDescriptor.create(this, this.ID, this.LABEL);

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@ICommandService private readonly commandService: ICommandService,
		@IWorkspaceContextService private readonly workspaceService: IWorkspaceContextService,
		@IStorageService storageService: IStorageService
	) {
		super(WorkspaceTrustRequiredPlaceholderEditor.ID, group, telemetryService, themeService, storageService);
	}

	override getTitle(): string {
		return WorkspaceTrustRequiredPlaceholderEditor.LABEL;
	}

	protected async getContents(): Promise<IEditorPlaceholderContents> {
		return {
			icon: '$(workspace-untrusted)',
			label: isSingleFolderWorkspaceIdentifier(toWorkspaceIdentifier(this.workspaceService.getWorkspace())) ?
				localize('requiresFolderTrustText', "The file is not displayed in the editor because trust has not been granted to the folder.") :
				localize('requiresWorkspaceTrustText', "The file is not displayed in the editor because trust has not been granted to the workspace."),
			actions: [
				{
					label: localize('manageTrust', "Manage Workspace Trust"),
					run: () => this.commandService.executeCommand('workbench.trust.manage')
				}
			]
		};
	}
}

export class ErrorPlaceholderEditor extends EditorPlaceholder {

	private static readonly ID = 'workbench.editors.errorEditor';
	private static readonly LABEL = localize('errorEditor', "Error Editor");

	static readonly DESCRIPTOR = EditorPaneDescriptor.create(this, this.ID, this.LABEL);

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IFileService private readonly fileService: IFileService,
		@IDialogService private readonly dialogService: IDialogService,
		@ICommandService private readonly commandService: ICommandService
	) {
		super(ErrorPlaceholderEditor.ID, group, telemetryService, themeService, storageService);
	}

	protected async getContents(input: EditorInput, options: IErrorEditorPlaceholderOptions, disposables: DisposableStore): Promise<IEditorPlaceholderContents> {
		const resource = input.resource;
		const error = options.error;
		const isFileNotFound = (<FileOperationError | undefined>error)?.fileOperationResult === FileOperationResult.FILE_NOT_FOUND;

		// Error Label
		let label: string;
		if (isFileNotFound) {
			label = localize('unavailableResourceErrorEditorText', "The editor could not be opened because the file was not found.");
		} else if (isEditorOpenError(error) && error.forceMessage) {
			label = error.message;
		} else if (error) {
			label = localize('unknownErrorEditorTextWithError', "The editor could not be opened due to an unexpected error. Please consult the log for more details.");
		} else {
			label = localize('unknownErrorEditorTextWithoutError', "The editor could not be opened due to an unexpected error.");
		}

		// Error Icon
		let icon = '$(error)';
		if (isEditorOpenError(error)) {
			if (error.forceSeverity === Severity.Info) {
				icon = '$(info)';
			} else if (error.forceSeverity === Severity.Warning) {
				icon = '$(warning)';
			}
		}

		// Actions
		let actions: IEditorPlaceholderContentsAction[] | undefined = undefined;
		if (isEditorOpenError(error) && error.actions.length > 0) {
			actions = error.actions.map(action => {
				return {
					label: action.label,
					run: () => {
						const result = action.run();
						if (result instanceof Promise) {
							result.catch(error => this.dialogService.error(toErrorMessage(error)));
						}
					}
				};
			});
		} else {
			actions = [
				{
					label: localize('retry', "Try Again"),
					run: () => this.group.openEditor(input, { ...options, source: EditorOpenSource.USER /* explicit user gesture */ })
				},
				{
					label: localize('showLogs', "Show Logs"),
					run: () => this.commandService.executeCommand(showWindowLogActionId)
				}
			];
		}

		// Auto-reload when file is added
		if (isFileNotFound && resource && this.fileService.hasProvider(resource)) {
			disposables.add(this.fileService.onDidFilesChange(e => {
				if (e.contains(resource, FileChangeType.ADDED, FileChangeType.UPDATED)) {
					this.group.openEditor(input, options);
				}
			}));
		}

		return { icon, label, actions: actions ?? [] };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/editorQuickAccess.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/editorQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/editorquickaccess.css';
import { localize } from '../../../../nls.js';
import { IQuickPickSeparator, quickPickItemScorerAccessor, IQuickPickItemWithResource, IQuickPick } from '../../../../platform/quickinput/common/quickInput.js';
import { PickerQuickAccessProvider, IPickerQuickAccessItem, TriggerAction } from '../../../../platform/quickinput/browser/pickerQuickAccess.js';
import { IEditorGroupsService, GroupsOrder } from '../../../services/editor/common/editorGroupsService.js';
import { EditorsOrder, IEditorIdentifier, EditorResourceAccessor, SideBySideEditor, GroupIdentifier } from '../../../common/editor.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { getIconClasses } from '../../../../editor/common/services/getIconClasses.js';
import { prepareQuery, scoreItemFuzzy, compareItemsByFuzzyScore, FuzzyScorerCache } from '../../../../base/common/fuzzyScorer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';

interface IEditorQuickPickItem extends IQuickPickItemWithResource, IPickerQuickAccessItem {
	groupId: GroupIdentifier;
}

export abstract class BaseEditorQuickAccessProvider extends PickerQuickAccessProvider<IEditorQuickPickItem> {

	private readonly pickState = new class {

		scorerCache: FuzzyScorerCache = Object.create(null);
		isQuickNavigating: boolean | undefined = undefined;

		reset(isQuickNavigating: boolean): void {

			// Caches
			if (!isQuickNavigating) {
				this.scorerCache = Object.create(null);
			}

			// Other
			this.isQuickNavigating = isQuickNavigating;
		}
	};

	constructor(
		prefix: string,
		@IEditorGroupsService protected readonly editorGroupService: IEditorGroupsService,
		@IEditorService protected readonly editorService: IEditorService,
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService
	) {
		super(prefix,
			{
				canAcceptInBackground: true,
				noResultsPick: {
					label: localize('noViewResults', "No matching editors"),
					groupId: -1
				}
			}
		);
	}

	override provide(picker: IQuickPick<IEditorQuickPickItem, { useSeparators: true }>, token: CancellationToken): IDisposable {

		// Reset the pick state for this run
		this.pickState.reset(!!picker.quickNavigate);

		// Start picker
		return super.provide(picker, token);
	}

	protected _getPicks(filter: string): Array<IEditorQuickPickItem | IQuickPickSeparator> {
		const query = prepareQuery(filter);

		// Filtering
		const filteredEditorEntries = this.doGetEditorPickItems().filter(entry => {
			if (!query.normalized) {
				return true;
			}

			// Score on label and description
			const itemScore = scoreItemFuzzy(entry, query, true, quickPickItemScorerAccessor, this.pickState.scorerCache);
			if (!itemScore.score) {
				return false;
			}

			// Apply highlights
			entry.highlights = { label: itemScore.labelMatch, description: itemScore.descriptionMatch };

			return true;
		});

		// Sorting
		if (query.normalized) {
			const groups = this.editorGroupService.getGroups(GroupsOrder.GRID_APPEARANCE).map(group => group.id);
			filteredEditorEntries.sort((entryA, entryB) => {
				if (entryA.groupId !== entryB.groupId) {
					return groups.indexOf(entryA.groupId) - groups.indexOf(entryB.groupId); // older groups first
				}

				return compareItemsByFuzzyScore(entryA, entryB, query, true, quickPickItemScorerAccessor, this.pickState.scorerCache);
			});
		}

		// Grouping (for more than one group)
		const filteredEditorEntriesWithSeparators: Array<IEditorQuickPickItem | IQuickPickSeparator> = [];
		if (this.editorGroupService.count > 1) {
			let lastGroupId: number | undefined = undefined;
			for (const entry of filteredEditorEntries) {
				if (typeof lastGroupId !== 'number' || lastGroupId !== entry.groupId) {
					const group = this.editorGroupService.getGroup(entry.groupId);
					if (group) {
						filteredEditorEntriesWithSeparators.push({ type: 'separator', label: group.label });
					}
					lastGroupId = entry.groupId;
				}

				filteredEditorEntriesWithSeparators.push(entry);
			}
		} else {
			filteredEditorEntriesWithSeparators.push(...filteredEditorEntries);
		}

		return filteredEditorEntriesWithSeparators;
	}

	private doGetEditorPickItems(): Array<IEditorQuickPickItem> {
		const editors = this.doGetEditors();

		const mapGroupIdToGroupAriaLabel = new Map<GroupIdentifier, string>();
		for (const { groupId } of editors) {
			if (!mapGroupIdToGroupAriaLabel.has(groupId)) {
				const group = this.editorGroupService.getGroup(groupId);
				if (group) {
					mapGroupIdToGroupAriaLabel.set(groupId, group.ariaLabel);
				}
			}
		}

		return this.doGetEditors().map(({ editor, groupId }): IEditorQuickPickItem => {
			const resource = EditorResourceAccessor.getOriginalUri(editor, { supportSideBySide: SideBySideEditor.PRIMARY });
			const isDirty = editor.isDirty() && !editor.isSaving();
			const description = editor.getDescription();
			const nameAndDescription = description ? `${editor.getName()} ${description}` : editor.getName();

			return {
				groupId,
				resource,
				label: editor.getName(),
				ariaLabel: (() => {
					if (mapGroupIdToGroupAriaLabel.size > 1) {
						return isDirty ?
							localize('entryAriaLabelWithGroupDirty', "{0}, unsaved changes, {1}", nameAndDescription, mapGroupIdToGroupAriaLabel.get(groupId)) :
							localize('entryAriaLabelWithGroup', "{0}, {1}", nameAndDescription, mapGroupIdToGroupAriaLabel.get(groupId));
					}

					return isDirty ? localize('entryAriaLabelDirty', "{0}, unsaved changes", nameAndDescription) : nameAndDescription;
				})(),
				description,
				iconClasses: getIconClasses(this.modelService, this.languageService, resource, undefined, editor.getIcon()).concat(editor.getLabelExtraClasses()),
				italic: !this.editorGroupService.getGroup(groupId)?.isPinned(editor),
				buttons: (() => {
					return [
						{
							iconClass: isDirty ? ('dirty-editor ' + ThemeIcon.asClassName(Codicon.closeDirty)) : ThemeIcon.asClassName(Codicon.close),
							tooltip: localize('closeEditor', "Close Editor"),
							alwaysVisible: isDirty
						}
					];
				})(),
				trigger: async () => {
					const group = this.editorGroupService.getGroup(groupId);
					if (group) {
						await group.closeEditor(editor, { preserveFocus: true });

						if (!group.contains(editor)) {
							return TriggerAction.REMOVE_ITEM;
						}
					}

					return TriggerAction.NO_ACTION;
				},
				accept: (keyMods, event) => this.editorGroupService.getGroup(groupId)?.openEditor(editor, { preserveFocus: event.inBackground }),
			};
		});
	}

	protected abstract doGetEditors(): IEditorIdentifier[];
}

//#region Active Editor Group Editors by Most Recently Used

export class ActiveGroupEditorsByMostRecentlyUsedQuickAccess extends BaseEditorQuickAccessProvider {

	static PREFIX = 'edt active ';

	constructor(
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@IEditorService editorService: IEditorService,
		@IModelService modelService: IModelService,
		@ILanguageService languageService: ILanguageService
	) {
		super(ActiveGroupEditorsByMostRecentlyUsedQuickAccess.PREFIX, editorGroupService, editorService, modelService, languageService);
	}

	protected doGetEditors(): IEditorIdentifier[] {
		const group = this.editorGroupService.activeGroup;

		return group.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE).map(editor => ({ editor, groupId: group.id }));
	}
}

//#endregion


//#region All Editors by Appearance

export class AllEditorsByAppearanceQuickAccess extends BaseEditorQuickAccessProvider {

	static PREFIX = 'edt ';

	constructor(
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@IEditorService editorService: IEditorService,
		@IModelService modelService: IModelService,
		@ILanguageService languageService: ILanguageService
	) {
		super(AllEditorsByAppearanceQuickAccess.PREFIX, editorGroupService, editorService, modelService, languageService);
	}

	protected doGetEditors(): IEditorIdentifier[] {
		const entries: IEditorIdentifier[] = [];

		for (const group of this.editorGroupService.getGroups(GroupsOrder.GRID_APPEARANCE)) {
			for (const editor of group.getEditors(EditorsOrder.SEQUENTIAL)) {
				entries.push({ editor, groupId: group.id });
			}
		}

		return entries;
	}
}

//#endregion


//#region All Editors by Most Recently Used

export class AllEditorsByMostRecentlyUsedQuickAccess extends BaseEditorQuickAccessProvider {

	static PREFIX = 'edt mru ';

	constructor(
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@IEditorService editorService: IEditorService,
		@IModelService modelService: IModelService,
		@ILanguageService languageService: ILanguageService
	) {
		super(AllEditorsByMostRecentlyUsedQuickAccess.PREFIX, editorGroupService, editorService, modelService, languageService);
	}

	protected doGetEditors(): IEditorIdentifier[] {
		const entries: IEditorIdentifier[] = [];

		for (const editor of this.editorService.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE)) {
			entries.push(editor);
		}

		return entries;
	}
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/editorsObserver.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/editorsObserver.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEditorFactoryRegistry, IEditorIdentifier, GroupIdentifier, EditorExtensions, IEditorPartOptionsChangeEvent, EditorsOrder, GroupModelChangeKind, EditorInputCapabilities } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { SideBySideEditorInput } from '../../../common/editor/sideBySideEditorInput.js';
import { dispose, Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { IEditorGroupsService, IEditorGroup, GroupsOrder, IEditorGroupsContainer } from '../../../services/editor/common/editorGroupsService.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { LinkedMap, Touch, ResourceMap } from '../../../../base/common/map.js';
import { equals } from '../../../../base/common/objects.js';
import { IResourceEditorInputIdentifier } from '../../../../platform/editor/common/editor.js';
import { URI } from '../../../../base/common/uri.js';

interface ISerializedEditorsList {
	entries: ISerializedEditorIdentifier[];
}

interface ISerializedEditorIdentifier {
	groupId: GroupIdentifier;
	index: number;
}

/**
 * A observer of opened editors across all editor groups by most recently used.
 * Rules:
 * - the last editor in the list is the one most recently activated
 * - the first editor in the list is the one that was activated the longest time ago
 * - an editor that opens inactive will be placed behind the currently active editor
 *
 * The observer may start to close editors based on the workbench.editor.limit setting.
 */
export class EditorsObserver extends Disposable {

	private static readonly STORAGE_KEY = 'editors.mru';

	private readonly keyMap = new Map<GroupIdentifier, Map<EditorInput, IEditorIdentifier>>();
	private readonly mostRecentEditorsMap = new LinkedMap<IEditorIdentifier, IEditorIdentifier>();
	private readonly editorsPerResourceCounter = new ResourceMap<Map<string /* typeId/editorId */, number /* counter */>>();

	private readonly _onDidMostRecentlyActiveEditorsChange = this._register(new Emitter<void>());
	readonly onDidMostRecentlyActiveEditorsChange = this._onDidMostRecentlyActiveEditorsChange.event;

	get count(): number {
		return this.mostRecentEditorsMap.size;
	}

	get editors(): IEditorIdentifier[] {
		return [...this.mostRecentEditorsMap.values()];
	}

	hasEditor(editor: IResourceEditorInputIdentifier): boolean {
		const editors = this.editorsPerResourceCounter.get(editor.resource);

		return editors?.has(this.toIdentifier(editor)) ?? false;
	}

	hasEditors(resource: URI): boolean {
		return this.editorsPerResourceCounter.has(resource);
	}

	private toIdentifier(typeId: string, editorId: string | undefined): string;
	private toIdentifier(editor: IResourceEditorInputIdentifier): string;
	private toIdentifier(arg1: string | IResourceEditorInputIdentifier, editorId?: string | undefined): string {
		if (typeof arg1 !== 'string') {
			return this.toIdentifier(arg1.typeId, arg1.editorId);
		}

		if (editorId) {
			return `${arg1}/${editorId}`;
		}

		return arg1;
	}

	private readonly editorGroupsContainer: IEditorGroupsContainer;
	private readonly isScoped: boolean;

	constructor(
		editorGroupsContainer: IEditorGroupsContainer | undefined,
		@IEditorGroupsService private editorGroupService: IEditorGroupsService,
		@IStorageService private readonly storageService: IStorageService
	) {
		super();

		this.editorGroupsContainer = editorGroupsContainer ?? editorGroupService;
		this.isScoped = !!editorGroupsContainer;

		this.registerListeners();
		this.loadState();
	}

	private registerListeners(): void {
		this._register(this.editorGroupsContainer.onDidAddGroup(group => this.onGroupAdded(group)));
		this._register(this.editorGroupService.onDidChangeEditorPartOptions(e => this.onDidChangeEditorPartOptions(e)));
		this._register(this.storageService.onWillSaveState(() => this.saveState()));
	}

	private onGroupAdded(group: IEditorGroup): void {

		// Make sure to add any already existing editor
		// of the new group into our list in LRU order
		const groupEditorsMru = group.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE);
		for (let i = groupEditorsMru.length - 1; i >= 0; i--) {
			this.addMostRecentEditor(group, groupEditorsMru[i], false /* is not active */, true /* is new */);
		}

		// Make sure that active editor is put as first if group is active
		if (this.editorGroupsContainer.activeGroup === group && group.activeEditor) {
			this.addMostRecentEditor(group, group.activeEditor, true /* is active */, false /* already added before */);
		}

		// Group Listeners
		this.registerGroupListeners(group);
	}

	private registerGroupListeners(group: IEditorGroup): void {
		const groupDisposables = new DisposableStore();
		groupDisposables.add(group.onDidModelChange(e => {
			switch (e.kind) {

				// Group gets active: put active editor as most recent
				case GroupModelChangeKind.GROUP_ACTIVE: {
					if (this.editorGroupsContainer.activeGroup === group && group.activeEditor) {
						this.addMostRecentEditor(group, group.activeEditor, true /* is active */, false /* editor already opened */);
					}

					break;
				}

				// Editor opens: put it as second most recent
				//
				// Also check for maximum allowed number of editors and
				// start to close oldest ones if needed.
				case GroupModelChangeKind.EDITOR_OPEN: {
					if (e.editor) {
						this.addMostRecentEditor(group, e.editor, false /* is not active */, true /* is new */);
						this.ensureOpenedEditorsLimit({ groupId: group.id, editor: e.editor }, group.id);
					}

					break;
				}
			}
		}));

		// Editor closes: remove from recently opened
		groupDisposables.add(group.onDidCloseEditor(e => {
			this.removeMostRecentEditor(group, e.editor);
		}));

		// Editor gets active: put active editor as most recent
		// if group is active, otherwise second most recent
		groupDisposables.add(group.onDidActiveEditorChange(e => {
			if (e.editor) {
				this.addMostRecentEditor(group, e.editor, this.editorGroupsContainer.activeGroup === group, false /* editor already opened */);
			}
		}));

		// Make sure to cleanup on dispose
		Event.once(group.onWillDispose)(() => dispose(groupDisposables));
	}

	private onDidChangeEditorPartOptions(event: IEditorPartOptionsChangeEvent): void {
		if (!equals(event.newPartOptions.limit, event.oldPartOptions.limit)) {
			const activeGroup = this.editorGroupsContainer.activeGroup;
			let exclude: IEditorIdentifier | undefined = undefined;
			if (activeGroup.activeEditor) {
				exclude = { editor: activeGroup.activeEditor, groupId: activeGroup.id };
			}

			this.ensureOpenedEditorsLimit(exclude);
		}
	}

	private addMostRecentEditor(group: IEditorGroup, editor: EditorInput, isActive: boolean, isNew: boolean): void {
		const key = this.ensureKey(group, editor);
		const mostRecentEditor = this.mostRecentEditorsMap.first;

		// Active or first entry: add to end of map
		if (isActive || !mostRecentEditor) {
			this.mostRecentEditorsMap.set(key, key, mostRecentEditor ? Touch.AsOld /* make first */ : undefined);
		}

		// Otherwise: insert before most recent
		else {
			// we have most recent editors. as such we
			// put this newly opened editor right before
			// the current most recent one because it cannot
			// be the most recently active one unless
			// it becomes active. but it is still more
			// active then any other editor in the list.
			this.mostRecentEditorsMap.set(key, key, Touch.AsOld /* make first */);
			this.mostRecentEditorsMap.set(mostRecentEditor, mostRecentEditor, Touch.AsOld /* make first */);
		}

		// Update in resource map if this is a new editor
		if (isNew) {
			this.updateEditorResourcesMap(editor, true);
		}

		// Event
		this._onDidMostRecentlyActiveEditorsChange.fire();
	}

	private updateEditorResourcesMap(editor: EditorInput, add: boolean): void {

		// Distill the editor resource and type id with support
		// for side by side editor's primary side too.
		let resource: URI | undefined = undefined;
		let typeId: string | undefined = undefined;
		let editorId: string | undefined = undefined;
		if (editor instanceof SideBySideEditorInput) {
			resource = editor.primary.resource;
			typeId = editor.primary.typeId;
			editorId = editor.primary.editorId;
		} else {
			resource = editor.resource;
			typeId = editor.typeId;
			editorId = editor.editorId;
		}

		if (!resource) {
			return; // require a resource
		}

		const identifier = this.toIdentifier(typeId, editorId);

		// Add entry
		if (add) {
			let editorsPerResource = this.editorsPerResourceCounter.get(resource);
			if (!editorsPerResource) {
				editorsPerResource = new Map<string, number>();
				this.editorsPerResourceCounter.set(resource, editorsPerResource);
			}

			editorsPerResource.set(identifier, (editorsPerResource.get(identifier) ?? 0) + 1);
		}

		// Remove entry
		else {
			const editorsPerResource = this.editorsPerResourceCounter.get(resource);
			if (editorsPerResource) {
				const counter = editorsPerResource.get(identifier) ?? 0;
				if (counter > 1) {
					editorsPerResource.set(identifier, counter - 1);
				} else {
					editorsPerResource.delete(identifier);

					if (editorsPerResource.size === 0) {
						this.editorsPerResourceCounter.delete(resource);
					}
				}
			}
		}
	}

	private removeMostRecentEditor(group: IEditorGroup, editor: EditorInput): void {

		// Update in resource map
		this.updateEditorResourcesMap(editor, false);

		// Update in MRU list
		const key = this.findKey(group, editor);
		if (key) {

			// Remove from most recent editors
			this.mostRecentEditorsMap.delete(key);

			// Remove from key map
			const map = this.keyMap.get(group.id);
			if (map?.delete(key.editor) && map.size === 0) {
				this.keyMap.delete(group.id);
			}

			// Event
			this._onDidMostRecentlyActiveEditorsChange.fire();
		}
	}

	private findKey(group: IEditorGroup, editor: EditorInput): IEditorIdentifier | undefined {
		const groupMap = this.keyMap.get(group.id);
		if (!groupMap) {
			return undefined;
		}

		return groupMap.get(editor);
	}

	private ensureKey(group: IEditorGroup, editor: EditorInput): IEditorIdentifier {
		let groupMap = this.keyMap.get(group.id);
		if (!groupMap) {
			groupMap = new Map();

			this.keyMap.set(group.id, groupMap);
		}

		let key = groupMap.get(editor);
		if (!key) {
			key = { groupId: group.id, editor };
			groupMap.set(editor, key);
		}

		return key;
	}

	private async ensureOpenedEditorsLimit(exclude: IEditorIdentifier | undefined, groupId?: GroupIdentifier): Promise<void> {
		if (
			!this.editorGroupService.partOptions.limit?.enabled ||
			typeof this.editorGroupService.partOptions.limit.value !== 'number' ||
			this.editorGroupService.partOptions.limit.value <= 0
		) {
			return; // return early if not enabled or invalid
		}

		const limit = this.editorGroupService.partOptions.limit.value;

		// In editor group
		if (this.editorGroupService.partOptions.limit?.perEditorGroup) {

			// For specific editor groups
			if (typeof groupId === 'number') {
				const group = this.editorGroupsContainer.getGroup(groupId);
				if (group) {
					await this.doEnsureOpenedEditorsLimit(limit, group.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE).map(editor => ({ editor, groupId })), exclude);
				}
			}

			// For all editor groups
			else {
				for (const group of this.editorGroupsContainer.groups) {
					await this.ensureOpenedEditorsLimit(exclude, group.id);
				}
			}
		}

		// Across all editor groups
		else {
			await this.doEnsureOpenedEditorsLimit(limit, [...this.mostRecentEditorsMap.values()], exclude);
		}
	}

	private async doEnsureOpenedEditorsLimit(limit: number, mostRecentEditors: IEditorIdentifier[], exclude?: IEditorIdentifier): Promise<void> {

		// Check for `excludeDirty` setting and apply it by excluding
		// any recent editor that is dirty from the opened editors limit
		let mostRecentEditorsCountingForLimit: IEditorIdentifier[];
		if (this.editorGroupService.partOptions.limit?.excludeDirty) {
			mostRecentEditorsCountingForLimit = mostRecentEditors.filter(({ editor }) => {
				if ((editor.isDirty() && !editor.isSaving()) || editor.hasCapability(EditorInputCapabilities.Scratchpad)) {
					return false; // not dirty editors (unless in the process of saving) or scratchpads
				}

				return true;
			});
		} else {
			mostRecentEditorsCountingForLimit = mostRecentEditors;
		}

		if (limit >= mostRecentEditorsCountingForLimit.length) {
			return; // only if opened editors exceed setting and is valid and enabled
		}

		// Extract least recently used editors that can be closed
		const leastRecentlyClosableEditors = mostRecentEditorsCountingForLimit.reverse().filter(({ editor, groupId }) => {
			if ((editor.isDirty() && !editor.isSaving()) || editor.hasCapability(EditorInputCapabilities.Scratchpad)) {
				return false; // not dirty editors (unless in the process of saving) or scratchpads
			}

			if (exclude && editor === exclude.editor && groupId === exclude.groupId) {
				return false; // never the editor that should be excluded
			}

			if (this.editorGroupsContainer.getGroup(groupId)?.isSticky(editor)) {
				return false; // never sticky editors
			}

			return true;
		});

		// Close editors until we reached the limit again
		let editorsToCloseCount = mostRecentEditorsCountingForLimit.length - limit;
		const mapGroupToEditorsToClose = new Map<GroupIdentifier, EditorInput[]>();
		for (const { groupId, editor } of leastRecentlyClosableEditors) {
			let editorsInGroupToClose = mapGroupToEditorsToClose.get(groupId);
			if (!editorsInGroupToClose) {
				editorsInGroupToClose = [];
				mapGroupToEditorsToClose.set(groupId, editorsInGroupToClose);
			}

			editorsInGroupToClose.push(editor);
			editorsToCloseCount--;

			if (editorsToCloseCount === 0) {
				break; // limit reached
			}
		}

		for (const [groupId, editors] of mapGroupToEditorsToClose) {
			const group = this.editorGroupsContainer.getGroup(groupId);
			if (group) {
				await group.closeEditors(editors, { preserveFocus: true });
			}
		}
	}

	private saveState(): void {
		if (this.isScoped) {
			return; // do not persist state when scoped
		}

		if (this.mostRecentEditorsMap.isEmpty()) {
			this.storageService.remove(EditorsObserver.STORAGE_KEY, StorageScope.WORKSPACE);
		} else {
			this.storageService.store(EditorsObserver.STORAGE_KEY, JSON.stringify(this.serialize()), StorageScope.WORKSPACE, StorageTarget.MACHINE);
		}
	}

	private serialize(): ISerializedEditorsList {
		const registry = Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory);

		const entries = [...this.mostRecentEditorsMap.values()];
		const mapGroupToSerializableEditorsOfGroup = new Map<IEditorGroup, EditorInput[]>();

		return {
			entries: coalesce(entries.map(({ editor, groupId }) => {

				// Find group for entry
				const group = this.editorGroupsContainer.getGroup(groupId);
				if (!group) {
					return undefined;
				}

				// Find serializable editors of group
				let serializableEditorsOfGroup = mapGroupToSerializableEditorsOfGroup.get(group);
				if (!serializableEditorsOfGroup) {
					serializableEditorsOfGroup = group.getEditors(EditorsOrder.SEQUENTIAL).filter(editor => {
						const editorSerializer = registry.getEditorSerializer(editor);

						return editorSerializer?.canSerialize(editor);
					});
					mapGroupToSerializableEditorsOfGroup.set(group, serializableEditorsOfGroup);
				}

				// Only store the index of the editor of that group
				// which can be undefined if the editor is not serializable
				const index = serializableEditorsOfGroup.indexOf(editor);
				if (index === -1) {
					return undefined;
				}

				return { groupId, index };
			}))
		};
	}

	private async loadState(): Promise<void> {
		if (this.editorGroupsContainer === this.editorGroupService.mainPart || this.editorGroupsContainer === this.editorGroupService) {
			await this.editorGroupService.whenReady;
		}

		// Previous state: Load editors map from persisted state
		// unless we are running in scoped mode
		let hasRestorableState = false;
		if (!this.isScoped) {
			const serialized = this.storageService.get(EditorsObserver.STORAGE_KEY, StorageScope.WORKSPACE);
			if (serialized) {
				hasRestorableState = true;
				this.deserialize(JSON.parse(serialized));
			}
		}

		// No previous state: best we can do is add each editor
		// from oldest to most recently used editor group
		if (!hasRestorableState) {
			const groups = this.editorGroupsContainer.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE);
			for (let i = groups.length - 1; i >= 0; i--) {
				const group = groups[i];
				const groupEditorsMru = group.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE);
				for (let i = groupEditorsMru.length - 1; i >= 0; i--) {
					this.addMostRecentEditor(group, groupEditorsMru[i], true /* enforce as active to preserve order */, true /* is new */);
				}
			}
		}

		// Ensure we listen on group changes for those that exist on startup
		for (const group of this.editorGroupsContainer.groups) {
			this.registerGroupListeners(group);
		}
	}

	private deserialize(serialized: ISerializedEditorsList): void {
		const mapValues: [IEditorIdentifier, IEditorIdentifier][] = [];

		for (const { groupId, index } of serialized.entries) {

			// Find group for entry
			const group = this.editorGroupsContainer.getGroup(groupId);
			if (!group) {
				continue;
			}

			// Find editor for entry
			const editor = group.getEditorByIndex(index);
			if (!editor) {
				continue;
			}

			// Make sure key is registered as well
			const editorIdentifier = this.ensureKey(group, editor);
			mapValues.push([editorIdentifier, editorIdentifier]);

			// Update in resource map
			this.updateEditorResourcesMap(editor, true);
		}

		// Fill map with deserialized values
		this.mostRecentEditorsMap.fromJSON(mapValues);
	}
}
```

--------------------------------------------------------------------------------

````
