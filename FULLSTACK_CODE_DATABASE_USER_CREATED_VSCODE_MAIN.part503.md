---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 503
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 503 of 552)

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

---[FILE: src/vs/workbench/services/editor/common/editorGroupsService.ts]---
Location: vscode-main/src/vs/workbench/services/editor/common/editorGroupsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { IInstantiationService, createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IEditorPane, GroupIdentifier, EditorInputWithOptions, CloseDirection, IEditorPartOptions, IEditorPartOptionsChangeEvent, EditorsOrder, IVisibleEditorPane, IEditorCloseEvent, IUntypedEditorInput, isEditorInput, IEditorWillMoveEvent, IMatchEditorOptions, IActiveEditorChangeEvent, IFindEditorOptions, IToolbarActions } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDimension } from '../../../../editor/common/core/2d/dimension.js';
import { DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { ContextKeyValue, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { URI } from '../../../../base/common/uri.js';
import { IGroupModelChangeEvent } from '../../../common/editor/editorGroupModel.js';
import { IRectangle } from '../../../../platform/window/common/window.js';
import { IMenuChangeEvent, MenuId } from '../../../../platform/actions/common/actions.js';
import { DeepPartial } from '../../../../base/common/types.js';

export const IEditorGroupsService = createDecorator<IEditorGroupsService>('editorGroupsService');

export const enum GroupDirection {
	UP,
	DOWN,
	LEFT,
	RIGHT
}

export const enum GroupOrientation {
	HORIZONTAL,
	VERTICAL
}

export const enum GroupLocation {
	FIRST,
	LAST,
	NEXT,
	PREVIOUS
}

export interface IFindGroupScope {
	readonly direction?: GroupDirection;
	readonly location?: GroupLocation;
}

export const enum GroupsArrangement {
	/**
	 * Make the current active group consume the entire
	 * editor area.
	 */
	MAXIMIZE,

	/**
	 * Make the current active group consume the maximum
	 * amount of space possible.
	 */
	EXPAND,

	/**
	 * Size all groups evenly.
	 */
	EVEN
}

export interface GroupLayoutArgument {

	/**
	 * Only applies when there are multiple groups
	 * arranged next to each other in a row or column.
	 * If provided, their sum must be 1 to be applied
	 * per row or column.
	 */
	readonly size?: number;

	/**
	 * Editor groups  will be laid out orthogonal to the
	 * parent orientation.
	 */
	readonly groups?: GroupLayoutArgument[];
}

export interface EditorGroupLayout {

	/**
	 * The initial orientation of the editor groups at the root.
	 */
	readonly orientation: GroupOrientation;

	/**
	 * The editor groups at the root of the layout.
	 */
	readonly groups: GroupLayoutArgument[];
}

export const enum MergeGroupMode {
	COPY_EDITORS,
	MOVE_EDITORS
}

export interface IMergeGroupOptions {
	mode?: MergeGroupMode;
	readonly index?: number;

	/**
	 * Set this to prevent editors already present in the
	 * target group from moving to a different index as
	 * they are in the source group.
	 */
	readonly preserveExistingIndex?: boolean;
}

export interface ICloseEditorOptions {
	readonly preserveFocus?: boolean;
}

export type ICloseEditorsFilter = {
	readonly except?: EditorInput;
	readonly direction?: CloseDirection;
	readonly savedOnly?: boolean;
	readonly excludeSticky?: boolean;
};

export interface ICloseAllEditorsOptions {
	readonly excludeSticky?: boolean;
	readonly excludeConfirming?: boolean;
}

export interface IEditorReplacement {
	readonly editor: EditorInput;
	readonly replacement: EditorInput;
	readonly options?: IEditorOptions;

	/**
	 * Skips asking the user for confirmation and doesn't
	 * save the document. Only use this if you really need to!
	 */
	readonly forceReplaceDirty?: boolean;
}

export function isEditorReplacement(replacement: unknown): replacement is IEditorReplacement {
	const candidate = replacement as IEditorReplacement | undefined;

	return isEditorInput(candidate?.editor) && isEditorInput(candidate?.replacement);
}

export const enum GroupsOrder {

	/**
	 * Groups sorted by creation order (oldest one first)
	 */
	CREATION_TIME,

	/**
	 * Groups sorted by most recent activity (most recent active first)
	 */
	MOST_RECENTLY_ACTIVE,

	/**
	 * Groups sorted by grid widget order
	 */
	GRID_APPEARANCE
}

export interface IEditorSideGroup {

	/**
	 * Open an editor in this group.
	 *
	 * @returns a promise that resolves around an IEditor instance unless
	 * the call failed, or the editor was not opened as active editor.
	 */
	openEditor(editor: EditorInput, options?: IEditorOptions): Promise<IEditorPane | undefined>;
}

export interface IEditorDropTargetDelegate {

	/**
	 * A helper to figure out if the drop target contains the provided group.
	 */
	containsGroup?(groupView: IEditorGroup): boolean;
}

/**
 * The basic primitive to work with editor groups. This interface is both implemented
 * by editor part component as well as the editor groups service that operates across
 * all opened editor parts.
 */
export interface IEditorGroupsContainer {

	/**
	 * An event for when the active editor group changes. The active editor
	 * group is the default location for new editors to open.
	 */
	readonly onDidChangeActiveGroup: Event<IEditorGroup>;

	/**
	 * An event for when a new group was added.
	 */
	readonly onDidAddGroup: Event<IEditorGroup>;

	/**
	 * An event for when a group was removed.
	 */
	readonly onDidRemoveGroup: Event<IEditorGroup>;

	/**
	 * An event for when a group was moved.
	 */
	readonly onDidMoveGroup: Event<IEditorGroup>;

	/**
	 * An event for when a group gets activated.
	 */
	readonly onDidActivateGroup: Event<IEditorGroup>;

	/**
	 * An event for when the index of a group changes.
	 */
	readonly onDidChangeGroupIndex: Event<IEditorGroup>;

	/**
	 * An event for when the locked state of a group changes.
	 */
	readonly onDidChangeGroupLocked: Event<IEditorGroup>;

	/**
	 * An event for when the maximized state of a group changes.
	 */
	readonly onDidChangeGroupMaximized: Event<boolean>;

	/**
	 * An event that notifies when container options change.
	 */
	readonly onDidChangeEditorPartOptions: Event<IEditorPartOptionsChangeEvent>;

	/**
	 * A property that indicates when groups have been created
	 * and are ready to be used in the container.
	 */
	readonly isReady: boolean;

	/**
	 * A promise that resolves when groups have been created
	 * and are ready to be used in the container.
	 *
	 * Await this promise to safely work on the editor groups model
	 * (for example, install editor group listeners).
	 *
	 * Use the `whenRestored` property to await visible editors
	 * having fully resolved.
	 */
	readonly whenReady: Promise<void>;

	/**
	 * A promise that resolves when groups have been restored in
	 * the container.
	 *
	 * For groups with active editor, the promise will resolve
	 * when the visible editor has finished to resolve.
	 *
	 * Use the `whenReady` property to not await editors to
	 * resolve.
	 */
	readonly whenRestored: Promise<void>;

	/**
	 * Find out if the container has UI state to restore
	 * from a previous session.
	 */
	readonly hasRestorableState: boolean;

	/**
	 * An active group is the default location for new editors to open.
	 */
	readonly activeGroup: IEditorGroup;

	/**
	 * A side group allows a subset of methods on a group that is either
	 * created to the side or picked if already there.
	 */
	readonly sideGroup: IEditorSideGroup;

	/**
	 * All groups that are currently visible in the container in the order
	 * of their creation (oldest first).
	 */
	readonly groups: readonly IEditorGroup[];

	/**
	 * The number of editor groups that are currently opened in the
	 * container.
	 */
	readonly count: number;

	/**
	 * The current layout orientation of the root group.
	 */
	readonly orientation: GroupOrientation;

	/**
	 * Access the options of the container.
	 */
	readonly partOptions: IEditorPartOptions;

	/**
	 * Enforce container options temporarily.
	 */
	enforcePartOptions(options: DeepPartial<IEditorPartOptions>): IDisposable;

	/**
	 * Get all groups that are currently visible in the container.
	 *
	 * @param order the order of the editors to use
	 */
	getGroups(order: GroupsOrder): readonly IEditorGroup[];

	/**
	 * Allows to convert a group identifier to a group.
	 */
	getGroup(identifier: GroupIdentifier): IEditorGroup | undefined;

	/**
	 * Set a group as active. An active group is the default location for new editors to open.
	 */
	activateGroup(group: IEditorGroup | GroupIdentifier): IEditorGroup;

	/**
	 * Returns the size of a group.
	 */
	getSize(group: IEditorGroup | GroupIdentifier): { width: number; height: number };

	/**
	 * Sets the size of a group.
	 */
	setSize(group: IEditorGroup | GroupIdentifier, size: { width: number; height: number }): void;

	/**
	 * Arrange all groups in the container according to the provided arrangement.
	 */
	arrangeGroups(arrangement: GroupsArrangement, target?: IEditorGroup | GroupIdentifier): void;

	/**
	 * Toggles the target goup size to maximize/unmaximize.
	 */
	toggleMaximizeGroup(group?: IEditorGroup | GroupIdentifier): void;

	/**
	 * Toggles the target goup size to expand/distribute even.
	 */
	toggleExpandGroup(group?: IEditorGroup | GroupIdentifier): void;

	/**
	 * Applies the provided layout by either moving existing groups or creating new groups.
	 */
	applyLayout(layout: EditorGroupLayout): void;

	/**
	 * Returns an editor layout of the container.
	 */
	getLayout(): EditorGroupLayout;

	/**
	 * Sets the orientation of the root group to be either vertical or horizontal.
	 */
	setGroupOrientation(orientation: GroupOrientation): void;

	/**
	 * Find a group in a specific scope:
	 * * `GroupLocation.FIRST`: the first group
	 * * `GroupLocation.LAST`: the last group
	 * * `GroupLocation.NEXT`: the next group from either the active one or `source`
	 * * `GroupLocation.PREVIOUS`: the previous group from either the active one or `source`
	 * * `GroupDirection.UP`: the next group above the active one or `source`
	 * * `GroupDirection.DOWN`: the next group below the active one or `source`
	 * * `GroupDirection.LEFT`: the next group to the left of the active one or `source`
	 * * `GroupDirection.RIGHT`: the next group to the right of the active one or `source`
	 *
	 * @param scope the scope of the group to search in
	 * @param source optional source to search from
	 * @param wrap optionally wrap around if reaching the edge of groups
	 */
	findGroup(scope: IFindGroupScope, source?: IEditorGroup | GroupIdentifier, wrap?: boolean): IEditorGroup | undefined;

	/**
	 * Add a new group to the container. A new group is added by splitting a provided one in
	 * one of the four directions.
	 *
	 * @param location the group from which to split to add a new group
	 * @param direction the direction of where to split to
	 */
	addGroup(location: IEditorGroup | GroupIdentifier, direction: GroupDirection): IEditorGroup;

	/**
	 * Remove a group from the container.
	 */
	removeGroup(group: IEditorGroup | GroupIdentifier): void;

	/**
	 * Move a group to a new group in the container.
	 *
	 * @param group the group to move
	 * @param location the group from which to split to add the moved group
	 * @param direction the direction of where to split to
	 */
	moveGroup(group: IEditorGroup | GroupIdentifier, location: IEditorGroup | GroupIdentifier, direction: GroupDirection): IEditorGroup;

	/**
	 * Merge the editors of a group into a target group. By default, all editors will
	 * move and the source group will close. This behaviour can be configured via the
	 * `IMergeGroupOptions` options.
	 *
	 * @param group the group to merge
	 * @param target the target group to merge into
	 * @param options controls how the merge should be performed. by default all editors
	 * will be moved over to the target and the source group will close. Configure to
	 * `MOVE_EDITORS_KEEP_GROUP` to prevent the source group from closing. Set to
	 * `COPY_EDITORS` to copy the editors into the target instead of moding them.
	 *
	 * @returns if merging was successful
	 */
	mergeGroup(group: IEditorGroup | GroupIdentifier, target: IEditorGroup | GroupIdentifier, options?: IMergeGroupOptions): boolean;

	/**
	 * Merge all editor groups into the target one.
	 *
	 * @returns if merging was successful
	 */
	mergeAllGroups(target: IEditorGroup | GroupIdentifier): boolean;

	/**
	 * Copy a group to a new group in the container.
	 *
	 * @param group the group to copy
	 * @param location the group from which to split to add the copied group
	 * @param direction the direction of where to split to
	 */
	copyGroup(group: IEditorGroup | GroupIdentifier, location: IEditorGroup | GroupIdentifier, direction: GroupDirection): IEditorGroup;

	/**
	 * Allows to register a drag and drop target for editors
	 * on the provided `container`.
	 */
	createEditorDropTarget(container: unknown /* HTMLElement */, delegate: IEditorDropTargetDelegate): IDisposable;
}

/**
 * An editor part is a viewer of editor groups. There can be multiple editor
 * parts opened in multiple windows.
 */
export interface IEditorPart extends IEditorGroupsContainer {

	/**
	 * An event for when the editor part is layed out.
	 */
	readonly onDidLayout: Event<IDimension>;

	/**
	 * An event for when the editor part is scrolled.
	 */
	readonly onDidScroll: Event<void>;

	/**
	 * An event for when the editor part is disposed.
	 */
	readonly onWillDispose: Event<void>;

	/**
	 * The identifier of the window the editor part is contained in.
	 */
	readonly windowId: number;

	/**
	 * The size of the editor part.
	 */
	readonly contentDimension: IDimension;

	/**
	 * Find out if an editor group is currently maximized.
	 */
	hasMaximizedGroup(): boolean;

	/**
	 * Enable or disable centered editor layout.
	 */
	centerLayout(active: boolean): void;

	/**
	 * Find out if the editor layout is currently centered.
	 */
	isLayoutCentered(): boolean;
}

export interface IAuxiliaryEditorPart extends IEditorPart {

	/**
	 * Close this auxiliary editor part after moving all
	 * editors of all groups back to the main editor part.
	 *
	 * @returns `false` if an editor could not be moved back.
	 */
	close(): boolean;
}

export interface IEditorWorkingSet {
	readonly id: string;
	readonly name: string;
}

export interface IEditorWorkingSetOptions {
	readonly preserveFocus?: boolean;
}

export interface IEditorGroupContextKeyProvider<T extends ContextKeyValue> {

	/**
	 * The context key that needs to be set for each editor group context and the global context.
	 */
	readonly contextKey: RawContextKey<T>;

	/**
	 * Retrieves the context key value for the given editor group.
	 */
	readonly getGroupContextKeyValue: (group: IEditorGroup) => T;

	/**
	 * An event that is fired when there was a change leading to the context key value to be re-evaluated.
	 */
	readonly onDidChange?: Event<void>;
}

/**
 * The main service to interact with editor groups across all opened editor parts.
 */
export interface IEditorGroupsService extends IEditorGroupsContainer {

	readonly _serviceBrand: undefined;

	/**
	 * An event for when a new auxiliary editor part is created.
	 */
	readonly onDidCreateAuxiliaryEditorPart: Event<IAuxiliaryEditorPart>;

	/**
	 * Provides access to the main window editor part.
	 */
	readonly mainPart: IEditorPart;

	/**
	 * Provides access to all editor parts.
	 */
	readonly parts: ReadonlyArray<IEditorPart>;

	/**
	 * Get the editor part that contains the group with the provided identifier.
	 */
	getPart(group: IEditorGroup | GroupIdentifier): IEditorPart;

	/**
	 * Get the editor part that is rooted in the provided container.
	 */
	getPart(container: unknown /* HTMLElement */): IEditorPart;

	/**
	 * Opens a new window with a full editor part instantiated
	 * in there at the optional position and size on screen.
	 */
	createAuxiliaryEditorPart(options?: { bounds?: Partial<IRectangle>; compact?: boolean; alwaysOnTop?: boolean }): Promise<IAuxiliaryEditorPart>;

	/**
	 * Returns the instantiation service that is scoped to the
	 * provided editor part. Use this method when building UI
	 * that contributes to auxiliary editor parts to ensure the
	 * UI is scoped to that part.
	 */
	getScopedInstantiationService(part: IEditorPart): IInstantiationService;

	/**
	 * Save a new editor working set from the currently opened
	 * editors and group layout.
	 */
	saveWorkingSet(name: string): IEditorWorkingSet;

	/**
	 * Returns all known editor working sets.
	 */
	getWorkingSets(): IEditorWorkingSet[];

	/**
	 * Applies the working set. Use `empty` to apply an empty working set.
	 *
	 * @returns `true` when the working set as applied.
	 */
	applyWorkingSet(workingSet: IEditorWorkingSet | 'empty', options?: IEditorWorkingSetOptions): Promise<boolean>;

	/**
	 * Deletes a working set.
	 */
	deleteWorkingSet(workingSet: IEditorWorkingSet): void;

	/**
	 * Registers a context key provider. This provider sets a context key for each scoped editor group context and the global context.
	 *
	 * @param provider - The context key provider to be registered.
	 * @returns - A disposable object to unregister the provider.
	 */
	registerContextKeyProvider<T extends ContextKeyValue>(provider: IEditorGroupContextKeyProvider<T>): IDisposable;
}

export const enum OpenEditorContext {
	NEW_EDITOR = 1,
	MOVE_EDITOR = 2,
	COPY_EDITOR = 3
}

export interface IActiveEditorActions {
	readonly actions: IToolbarActions;
	readonly onDidChange: Event<IMenuChangeEvent | void>;
}

export interface IEditorGroup {

	/**
	 * An event which fires whenever the underlying group model changes.
	 */
	readonly onDidModelChange: Event<IGroupModelChangeEvent>;

	/**
	 * An event that is fired when the group gets disposed.
	 */
	readonly onWillDispose: Event<void>;

	/**
	 * An event that is fired when the active editor in the group changed.
	 */
	readonly onDidActiveEditorChange: Event<IActiveEditorChangeEvent>;

	/**
	 * An event that is fired when an editor is about to close.
	 */
	readonly onWillCloseEditor: Event<IEditorCloseEvent>;

	/**
	 * An event that is fired when an editor is closed.
	 */
	readonly onDidCloseEditor: Event<IEditorCloseEvent>;

	/**
	 * An event that is fired when an editor is about to move to
	 * a different group.
	 */
	readonly onWillMoveEditor: Event<IEditorWillMoveEvent>;

	/**
	 * A unique identifier of this group that remains identical even if the
	 * group is moved to different locations.
	 */
	readonly id: GroupIdentifier;

	/**
	 * The identifier of the window this editor group is part of.
	 */
	readonly windowId: number;

	/**
	 * A number that indicates the position of this group in the visual
	 * order of groups from left to right and top to bottom. The lowest
	 * index will likely be top-left while the largest index in most
	 * cases should be bottom-right, but that depends on the grid.
	 */
	readonly index: number;

	/**
	 * A human readable label for the group. This label can change depending
	 * on the layout of all editor groups. Clients should listen on the
	 * `onDidGroupModelChange` event to react to that.
	 */
	readonly label: string;

	/**
	 * A human readable label for the group to be used by screen readers.
	 */
	readonly ariaLabel: string;

	/**
	 * The active editor pane is the currently visible editor pane of the group.
	 */
	readonly activeEditorPane: IVisibleEditorPane | undefined;

	/**
	 * The active editor is the currently visible editor of the group
	 * within the current active editor pane.
	 */
	readonly activeEditor: EditorInput | null;

	/**
	 * All selected editor in this group in sequential order.
	 * The active editor is always part of the selection.
	 */
	readonly selectedEditors: EditorInput[];

	/**
	 * The editor in the group that is in preview mode if any. There can
	 * only ever be one editor in preview mode.
	 */
	readonly previewEditor: EditorInput | null;

	/**
	 * The number of opened editors in this group.
	 */
	readonly count: number;

	/**
	 * Whether the group has editors or not.
	 */
	readonly isEmpty: boolean;

	/**
	 * Whether this editor group is locked or not. Locked editor groups
	 * will only be considered for editors to open in when the group is
	 * explicitly provided for the editor.
	 *
	 * Note: editor group locking only applies when more than one group
	 * is opened.
	 */
	readonly isLocked: boolean;

	/**
	 * The number of sticky editors in this group.
	 */
	readonly stickyCount: number;

	/**
	 * All opened editors in the group in sequential order of their appearance.
	 */
	readonly editors: readonly EditorInput[];

	/**
	 * The scoped context key service for this group.
	 */
	readonly scopedContextKeyService: IContextKeyService;

	/**
	 * Get all editors that are currently opened in the group.
	 *
	 * @param order the order of the editors to use
	 * @param options options to select only specific editors as instructed
	 */
	getEditors(order: EditorsOrder, options?: { excludeSticky?: boolean }): readonly EditorInput[];

	/**
	 * Finds all editors for the given resource that are currently
	 * opened in the group. This method will return an entry for
	 * each editor that reports a `resource` that matches the
	 * provided one.
	 *
	 * @param resource the resource of the editor to find
	 * @param options whether to support side by side editors or not
	 */
	findEditors(resource: URI, options?: IFindEditorOptions): readonly EditorInput[];

	/**
	 * Returns the editor at a specific index of the group.
	 */
	getEditorByIndex(index: number): EditorInput | undefined;

	/**
	 * Returns the index of the editor in the group or -1 if not opened.
	 */
	getIndexOfEditor(editor: EditorInput): number;

	/**
	 * Whether the editor is the first in the group.
	 */
	isFirst(editor: EditorInput): boolean;

	/**
	 * Whether the editor is the last in the group.
	 */
	isLast(editor: EditorInput): boolean;

	/**
	 * Open an editor in this group.
	 *
	 * @returns a promise that resolves around an IEditor instance unless
	 * the call failed, or the editor was not opened as active editor.
	 */
	openEditor(editor: EditorInput, options?: IEditorOptions): Promise<IEditorPane | undefined>;

	/**
	 * Opens editors in this group.
	 *
	 * @returns a promise that resolves around an IEditor instance unless
	 * the call failed, or the editor was not opened as active editor. Since
	 * a group can only ever have one active editor, even if many editors are
	 * opened, the result will only be one editor.
	 */
	openEditors(editors: EditorInputWithOptions[]): Promise<IEditorPane | undefined>;

	/**
	 * Find out if the provided editor is pinned in the group.
	 */
	isPinned(editorOrIndex: EditorInput | number): boolean;

	/**
	 * Find out if the provided editor or index of editor is sticky in the group.
	 */
	isSticky(editorOrIndex: EditorInput | number): boolean;

	/**
	 * Find out if the provided editor or index of editor is transient in the group.
	 */
	isTransient(editorOrIndex: EditorInput | number): boolean;

	/**
	 * Find out if the provided editor is active in the group.
	 */
	isActive(editor: EditorInput | IUntypedEditorInput): boolean;

	/**
	 * Whether the editor is selected in the group.
	 */
	isSelected(editor: EditorInput): boolean;

	/**
	 * Set a new selection for this group. This will replace the current
	 * selection with the new selection.
	 *
	 * @param activeSelectedEditor the editor to set as active selected editor
	 * @param inactiveSelectedEditors the inactive editors to set as selected
	 */
	setSelection(activeSelectedEditor: EditorInput, inactiveSelectedEditors: EditorInput[]): Promise<void>;

	/**
	 * Find out if a certain editor is included in the group.
	 *
	 * @param candidate the editor to find
	 * @param options fine tune how to match editors
	 */
	contains(candidate: EditorInput | IUntypedEditorInput, options?: IMatchEditorOptions): boolean;

	/**
	 * Move an editor from this group either within this group or to another group.
	 *
	 * @returns whether the editor was moved or not.
	 */
	moveEditor(editor: EditorInput, target: IEditorGroup, options?: IEditorOptions): boolean;

	/**
	 * Move editors from this group either within this group or to another group.
	 *
	 * @returns whether all editors were moved or not.
	 */
	moveEditors(editors: EditorInputWithOptions[], target: IEditorGroup): boolean;

	/**
	 * Copy an editor from this group to another group.
	 *
	 * Note: It is currently not supported to show the same editor more than once in the same group.
	 */
	copyEditor(editor: EditorInput, target: IEditorGroup, options?: IEditorOptions): void;

	/**
	 * Copy editors from this group to another group.
	 *
	 * Note: It is currently not supported to show the same editor more than once in the same group.
	 */
	copyEditors(editors: EditorInputWithOptions[], target: IEditorGroup): void;

	/**
	 * Close an editor from the group. This may trigger a confirmation dialog if
	 * the editor is dirty and thus returns a promise as value.
	 *
	 * @param editor the editor to close, or the currently active editor
	 * if unspecified.
	 *
	 * @returns a promise when the editor is closed or not. If `true`, the editor
	 * is closed and if `false` there was a veto closing the editor, e.g. when it
	 * is dirty.
	 */
	closeEditor(editor?: EditorInput, options?: ICloseEditorOptions): Promise<boolean>;

	/**
	 * Closes specific editors in this group. This may trigger a confirmation dialog if
	 * there are dirty editors and thus returns a promise as value.
	 *
	 * @returns a promise whether the editors were closed or not. If `true`, the editors
	 * were closed and if `false` there was a veto closing the editors, e.g. when one
	 * is dirty.
	 */
	closeEditors(editors: EditorInput[] | ICloseEditorsFilter, options?: ICloseEditorOptions): Promise<boolean>;

	/**
	 * Closes all editors from the group. This may trigger a confirmation dialog if
	 * there are dirty editors and thus returns a promise as value.
	 *
	 * @returns a promise if confirmation is needed when all editors are closed.
	 */
	closeAllEditors(options: { excludeConfirming: true }): boolean;
	closeAllEditors(options?: ICloseAllEditorsOptions): Promise<boolean>;

	/**
	 * Replaces editors in this group with the provided replacement.
	 *
	 * @param editors the editors to replace
	 *
	 * @returns a promise that is resolved when the replaced active
	 * editor (if any) has finished loading.
	 */
	replaceEditors(editors: IEditorReplacement[]): Promise<void>;

	/**
	 * Set an editor to be pinned. A pinned editor is not replaced
	 * when another editor opens at the same location.
	 *
	 * @param editor the editor to pin, or the currently active editor
	 * if unspecified.
	 */
	pinEditor(editor?: EditorInput): void;

	/**
	 * Set an editor to be sticky. A sticky editor is showing in the beginning
	 * of the tab stripe and will not be impacted by close operations.
	 *
	 * @param editor the editor to make sticky, or the currently active editor
	 * if unspecified.
	 */
	stickEditor(editor?: EditorInput): void;

	/**
	 * Set an editor to be non-sticky and thus moves back to a location after
	 * sticky editors and can be closed normally.
	 *
	 * @param editor the editor to make unsticky, or the currently active editor
	 * if unspecified.
	 */
	unstickEditor(editor?: EditorInput): void;

	/**
	 * Whether this editor group should be locked or not.
	 *
	 * See {@linkcode IEditorGroup.isLocked `isLocked`}
	 */
	lock(locked: boolean): void;

	/**
	 * Move keyboard focus into the group.
	 */
	focus(): void;

	/**
	 * Create the editor actions for the current active editor.
	 */
	createEditorActions(disposables: DisposableStore, menuId?: MenuId): IActiveEditorActions;
}

export function isEditorGroup(obj: unknown): obj is IEditorGroup {
	const group = obj as IEditorGroup | undefined;

	return !!group && typeof group.id === 'number' && Array.isArray(group.editors);
}

//#region Editor Group Helpers

export function preferredSideBySideGroupDirection(configurationService: IConfigurationService): GroupDirection.DOWN | GroupDirection.RIGHT {
	const openSideBySideDirection = configurationService.getValue('workbench.editor.openSideBySideDirection');

	if (openSideBySideDirection === 'down') {
		return GroupDirection.DOWN;
	}

	return GroupDirection.RIGHT;
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/editor/common/editorPaneService.ts]---
Location: vscode-main/src/vs/workbench/services/editor/common/editorPaneService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IWillInstantiateEditorPaneEvent } from '../../../common/editor.js';
import { Event } from '../../../../base/common/event.js';

export const IEditorPaneService = createDecorator<IEditorPaneService>('editorPaneService');

export interface IEditorPaneService {

	readonly _serviceBrand: undefined;

	/**
	 * Emitted when an editor pane is about to be instantiated.
	 */
	readonly onWillInstantiateEditorPane: Event<IWillInstantiateEditorPaneEvent>;

	/**
	 * Returns whether a editor pane with the given type id has been instantiated.
	 */
	didInstantiateEditorPane(typeId: string): boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/editor/common/editorResolverService.ts]---
Location: vscode-main/src/vs/workbench/services/editor/common/editorResolverService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as glob from '../../../../base/common/glob.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { posix } from '../../../../base/common/path.js';
import { basename } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { workbenchConfigurationNodeBase } from '../../../common/configuration.js';
import { Extensions as ConfigurationExtensions, IConfigurationNode, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IResourceEditorInput, ITextResourceEditorInput } from '../../../../platform/editor/common/editor.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorInputWithOptions, EditorInputWithOptionsAndGroup, IResourceDiffEditorInput, IResourceMultiDiffEditorInput, IResourceMergeEditorInput, IUntitledTextResourceEditorInput, IUntypedEditorInput } from '../../../common/editor.js';
import { IEditorGroup } from './editorGroupsService.js';
import { PreferredGroup } from './editorService.js';
import { AtLeastOne } from '../../../../base/common/types.js';

export const IEditorResolverService = createDecorator<IEditorResolverService>('editorResolverService');

//#region Editor Associations

// Static values for registered editors

export type EditorAssociation = {
	readonly viewType: string;
	readonly filenamePattern?: string;
};

export type EditorAssociations = readonly EditorAssociation[];

export const editorsAssociationsSettingId = 'workbench.editorAssociations';

const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);

const editorAssociationsConfigurationNode: IConfigurationNode = {
	...workbenchConfigurationNodeBase,
	properties: {
		'workbench.editorAssociations': {
			type: 'object',
			markdownDescription: localize('editor.editorAssociations', "Configure [glob patterns](https://aka.ms/vscode-glob-patterns) to editors (for example `\"*.hex\": \"hexEditor.hexedit\"`). These have precedence over the default behavior."),
			additionalProperties: {
				type: 'string'
			}
		}
	}
};

export interface IEditorType {
	readonly id: string;
	readonly displayName: string;
	readonly providerDisplayName: string;
}

configurationRegistry.registerConfiguration(editorAssociationsConfigurationNode);
//#endregion

//#region EditorResolverService types
export enum RegisteredEditorPriority {
	builtin = 'builtin',
	option = 'option',
	exclusive = 'exclusive',
	default = 'default'
}

/**
 * If we didn't resolve an editor dictates what to do with the opening state
 * ABORT = Do not continue with opening the editor
 * NONE = Continue as if the resolution has been disabled as the service could not resolve one
 */
export const enum ResolvedStatus {
	ABORT = 1,
	NONE = 2,
}

export type ResolvedEditor = EditorInputWithOptionsAndGroup | ResolvedStatus;

export type RegisteredEditorOptions = {
	/**
	 * If your editor cannot be opened in multiple groups for the same resource
	 */
	singlePerResource?: boolean | (() => boolean);

	/**
	 * Whether or not you can support opening the given resource.
	 * If omitted we assume you can open everything
	 */
	canSupportResource?: (resource: URI) => boolean;
};

export type RegisteredEditorInfo = {
	id: string;
	label: string;
	detail?: string;
	priority: RegisteredEditorPriority;
};

type EditorInputFactoryResult = EditorInputWithOptions | Promise<EditorInputWithOptions>;

export type EditorInputFactoryFunction = (editorInput: IResourceEditorInput | ITextResourceEditorInput, group: IEditorGroup) => EditorInputFactoryResult;

export type UntitledEditorInputFactoryFunction = (untitledEditorInput: IUntitledTextResourceEditorInput, group: IEditorGroup) => EditorInputFactoryResult;

export type DiffEditorInputFactoryFunction = (diffEditorInput: IResourceDiffEditorInput, group: IEditorGroup) => EditorInputFactoryResult;

export type MultiDiffEditorInputFactoryFunction = (multiDiffEditorInput: IResourceMultiDiffEditorInput, group: IEditorGroup) => EditorInputFactoryResult;

export type MergeEditorInputFactoryFunction = (mergeEditorInput: IResourceMergeEditorInput, group: IEditorGroup) => EditorInputFactoryResult;

type EditorInputFactories = {
	createEditorInput?: EditorInputFactoryFunction;
	createUntitledEditorInput?: UntitledEditorInputFactoryFunction;
	createDiffEditorInput?: DiffEditorInputFactoryFunction;
	createMultiDiffEditorInput?: MultiDiffEditorInputFactoryFunction;
	createMergeEditorInput?: MergeEditorInputFactoryFunction;
};

export type EditorInputFactoryObject = AtLeastOne<EditorInputFactories>;

export interface IEditorResolverService {
	readonly _serviceBrand: undefined;
	/**
	 * Given a resource finds the editor associations that match it from the user's settings
	 * @param resource The resource to match
	 * @return The matching associations
	 */
	getAssociationsForResource(resource: URI): EditorAssociations;

	/**
	 * Updates the user's association to include a specific editor ID as a default for the given glob pattern
	 * @param globPattern The glob pattern (must be a string as settings don't support relative glob)
	 * @param editorID The ID of the editor to make a user default
	 */
	updateUserAssociations(globPattern: string, editorID: string): void;

	/**
	 * Emitted when an editor is registered or unregistered.
	 */
	readonly onDidChangeEditorRegistrations: Event<void>;

	/**
	 * Given a callback, run the callback pausing the registration emitter
	 */
	bufferChangeEvents(callback: Function): void;

	/**
	 * Registers a specific editor. Editors with the same glob pattern and ID will be grouped together by the resolver.
	 * This allows for registration of the factories in different locations
	 * @param globPattern The glob pattern for this registration
	 * @param editorInfo Information about the registration
	 * @param options Specific options which apply to this registration
	 * @param editorFactoryObject The editor input factory functions
	 */
	registerEditor(
		globPattern: string | glob.IRelativePattern,
		editorInfo: RegisteredEditorInfo,
		options: RegisteredEditorOptions,
		editorFactoryObject: EditorInputFactoryObject
	): IDisposable;

	/**
	 * Given an editor resolves it to the suitable ResolvedEditor based on user extensions, settings, and built-in editors
	 * @param editor The editor to resolve
	 * @param preferredGroup The group you want to open the editor in
	 * @returns An EditorInputWithOptionsAndGroup if there is an available editor or a status of how to proceed
	 */
	resolveEditor(editor: IUntypedEditorInput, preferredGroup: PreferredGroup | undefined): Promise<ResolvedEditor>;

	/**
	 * Given a resource returns all the editor ids that match that resource. If there is exclusive editor we return an empty array
	 * @param resource The resource
	 * @returns A list of editor ids
	 */
	getEditors(resource: URI): RegisteredEditorInfo[];

	/**
	 * A set of all the editors that are registered to the editor resolver.
	 */
	getEditors(): RegisteredEditorInfo[];

	/**
	 * Get a complete list of editor associations.
	 */
	getAllUserAssociations(): EditorAssociations;
}

//#endregion

//#region Util functions
export function priorityToRank(priority: RegisteredEditorPriority): number {
	switch (priority) {
		case RegisteredEditorPriority.exclusive:
			return 5;
		case RegisteredEditorPriority.default:
			return 4;
		case RegisteredEditorPriority.builtin:
			return 3;
		// Text editor is priority 2
		case RegisteredEditorPriority.option:
		default:
			return 1;
	}
}

export function globMatchesResource(globPattern: string | glob.IRelativePattern, resource: URI): boolean {
	const excludedSchemes = new Set([
		Schemas.extension,
		Schemas.webviewPanel,
		Schemas.vscodeWorkspaceTrust,
		Schemas.vscodeSettings
	]);
	// We want to say that the above schemes match no glob patterns
	if (excludedSchemes.has(resource.scheme)) {
		return false;
	}
	const matchOnPath = typeof globPattern === 'string' && globPattern.indexOf(posix.sep) >= 0;
	const target = matchOnPath ? `${resource.scheme}:${resource.path}` : basename(resource);
	return glob.match(globPattern, target, { ignoreCase: true });
}
//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/editor/common/editorService.ts]---
Location: vscode-main/src/vs/workbench/services/editor/common/editorService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IResourceEditorInput, IEditorOptions, IResourceEditorInputIdentifier, ITextResourceEditorInput } from '../../../../platform/editor/common/editor.js';
import { IEditorPane, GroupIdentifier, IUntitledTextResourceEditorInput, IResourceDiffEditorInput, ITextDiffEditorPane, IEditorIdentifier, ISaveOptions, IRevertOptions, EditorsOrder, IVisibleEditorPane, IEditorCloseEvent, IUntypedEditorInput, IFindEditorOptions, IEditorWillOpenEvent, ITextResourceDiffEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { Event } from '../../../../base/common/event.js';
import { IEditor, IDiffEditor } from '../../../../editor/common/editorCommon.js';
import { ICloseEditorOptions, IEditorGroup, IEditorGroupsContainer, isEditorGroup } from './editorGroupsService.js';
import { URI } from '../../../../base/common/uri.js';
import { IGroupModelChangeEvent } from '../../../common/editor/editorGroupModel.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';

export const IEditorService = createDecorator<IEditorService>('editorService');

/**
 * Open an editor in the currently active group.
 */
export const ACTIVE_GROUP = -1;
export type ACTIVE_GROUP_TYPE = typeof ACTIVE_GROUP;

/**
 * Open an editor to the side of the active group.
 */
export const SIDE_GROUP = -2;
export type SIDE_GROUP_TYPE = typeof SIDE_GROUP;

/**
 * Open an editor in a new auxiliary window.
 */
export const AUX_WINDOW_GROUP = -3;
export type AUX_WINDOW_GROUP_TYPE = typeof AUX_WINDOW_GROUP;

export type PreferredGroup = IEditorGroup | GroupIdentifier | SIDE_GROUP_TYPE | ACTIVE_GROUP_TYPE | AUX_WINDOW_GROUP_TYPE;

export function isPreferredGroup(obj: unknown): obj is PreferredGroup {
	const candidate = obj as PreferredGroup | undefined;

	return typeof obj === 'number' || isEditorGroup(candidate);
}

export interface ISaveEditorsOptions extends ISaveOptions {

	/**
	 * If true, will ask for a location of the editor to save to.
	 */
	readonly saveAs?: boolean;
}

export interface ISaveEditorsResult {

	/**
	 * Whether the save operation was successful.
	 */
	readonly success: boolean;

	/**
	 * Resulting editors after the save operation.
	 */
	readonly editors: Array<EditorInput | IUntypedEditorInput>;
}

export interface IUntypedEditorReplacement {

	/**
	 * The editor to replace.
	 */
	readonly editor: EditorInput;

	/**
	 * The replacement for the editor.
	 */
	readonly replacement: IUntypedEditorInput;

	/**
	 * Skips asking the user for confirmation and doesn't
	 * save the document. Only use this if you really need to!
	*/
	forceReplaceDirty?: boolean;
}

export interface IBaseSaveRevertAllEditorOptions {

	/**
	 * Whether to include untitled editors as well.
	 */
	readonly includeUntitled?: {

		/**
		 * Whether to include scratchpad editors.
		 * Scratchpads are not included if not specified.
		 */
		readonly includeScratchpad: boolean;

	} | boolean;

	/**
	 * Whether to exclude sticky editors.
	 */
	readonly excludeSticky?: boolean;
}

export interface ISaveAllEditorsOptions extends ISaveEditorsOptions, IBaseSaveRevertAllEditorOptions { }

export interface IRevertAllEditorsOptions extends IRevertOptions, IBaseSaveRevertAllEditorOptions { }

export interface IOpenEditorsOptions {

	/**
	 * Whether to validate trust when opening editors
	 * that are potentially not inside the workspace.
	 */
	readonly validateTrust?: boolean;
}

export interface IEditorsChangeEvent {
	/**
	 * The group which had the editor change
	 */
	groupId: GroupIdentifier;
	/*
	 * The event fired from the model
	 */
	event: IGroupModelChangeEvent;
}

export interface IEditorService {

	readonly _serviceBrand: undefined;

	/**
	 * Emitted when the currently active editor changes.
	 *
	 * @see {@link IEditorService.activeEditorPane}
	 */
	readonly onDidActiveEditorChange: Event<void>;

	/**
	 * Emitted when any of the current visible editors changes.
	 *
	 * @see {@link IEditorService.visibleEditorPanes}
	 */
	readonly onDidVisibleEditorsChange: Event<void>;

	/**
	 * An aggregated event for any change to any editor across
	 * all groups.
	 */
	readonly onDidEditorsChange: Event<IEditorsChangeEvent>;

	/**
	 * Emitted when an editor is about to open.
	 */
	readonly onWillOpenEditor: Event<IEditorWillOpenEvent>;

	/**
	 * Emitted when an editor is closed.
	 */
	readonly onDidCloseEditor: Event<IEditorCloseEvent>;

	/**
	 * The currently active editor pane or `undefined` if none. The editor pane is
	 * the workbench container for editors of any kind.
	 *
	 * @see {@link IEditorService.activeEditor} for access to the active editor input
	 */
	readonly activeEditorPane: IVisibleEditorPane | undefined;

	/**
	 * The currently active editor or `undefined` if none. An editor is active when it is
	 * located in the currently active editor group. It will be `undefined` if the active
	 * editor group has no editors open.
	 */
	readonly activeEditor: EditorInput | undefined;

	/**
	 * The currently active text editor control or `undefined` if there is currently no active
	 * editor or the active editor widget is neither a text nor a diff editor.
	 *
	 * @see {@link IEditorService.activeEditor}
	 */
	readonly activeTextEditorControl: IEditor | IDiffEditor | undefined;

	/**
	 * The currently active text editor language id or `undefined` if there is currently no active
	 * editor or the active editor control is neither a text nor a diff editor. If the active
	 * editor is a diff editor, the modified side's language id will be taken.
	 */
	readonly activeTextEditorLanguageId: string | undefined;

	/**
	 * All editor panes that are currently visible across all editor groups.
	 *
	 * @see {@link IEditorService.visibleEditors} for access to the visible editor inputs
	 */
	readonly visibleEditorPanes: readonly IVisibleEditorPane[];

	/**
	 * All editors that are currently visible. An editor is visible when it is opened in an
	 * editor group and active in that group. Multiple editor groups can be opened at the same time.
	 */
	readonly visibleEditors: readonly EditorInput[];

	/**
	 * All text editor widgets that are currently visible across all editor groups. A text editor
	 * widget is either a text or a diff editor.
	 *
	 * This property supports side-by-side editors as well, by returning both sides if they are
	 * text editor widgets.
	 */
	readonly visibleTextEditorControls: readonly (IEditor | IDiffEditor)[];

	/**
	 * All text editor widgets that are currently visible across all editor groups. A text editor
	 * widget is either a text or a diff editor.
	 *
	 * This property supports side-by-side editors as well, by returning both sides if they are
	 * text editor widgets.
	 *
	 * @param order the order of the editors to use
	 */
	getVisibleTextEditorControls(order: EditorsOrder): readonly (IEditor | IDiffEditor)[];

	/**
	 * All editors that are opened across all editor groups in sequential order
	 * of appearance.
	 *
	 * This includes active as well as inactive editors in each editor group.
	 */
	readonly editors: readonly EditorInput[];

	/**
	 * The total number of editors that are opened either inactive or active.
	 */
	readonly count: number;

	/**
	 * All editors that are opened across all editor groups with their group
	 * identifier.
	 *
	 * @param order the order of the editors to use
	 * @param options whether to exclude sticky editors or not
	 */
	getEditors(order: EditorsOrder, options?: { excludeSticky?: boolean }): readonly IEditorIdentifier[];

	/**
	 * Open an editor in an editor group.
	 *
	 * @param editor the editor to open
	 * @param options the options to use for the editor
	 * @param group the target group. If unspecified, the editor will open in the currently
	 * active group. Use `SIDE_GROUP` to open the editor in a new editor group to the side
	 * of the currently active group.
	 *
	 * @returns the editor that opened or `undefined` if the operation failed or the editor was not
	 * opened to be active.
	 */
	openEditor(editor: IResourceEditorInput, group?: PreferredGroup): Promise<IEditorPane | undefined>;
	openEditor(editor: ITextResourceEditorInput | IUntitledTextResourceEditorInput, group?: PreferredGroup): Promise<IEditorPane | undefined>;
	openEditor(editor: ITextResourceDiffEditorInput | IResourceDiffEditorInput, group?: PreferredGroup): Promise<ITextDiffEditorPane | undefined>;
	openEditor(editor: IUntypedEditorInput, group?: PreferredGroup): Promise<IEditorPane | undefined>;

	/**
	 * @deprecated using this method is a sign that your editor has not adopted the editor
	 * resolver yet. Please use `IEditorResolverService.registerEditor` to make your editor
	 * known to the workbench and then use untyped editor inputs for opening:
	 *
	 * ```ts
	 * editorService.openEditor({ resource });
	 * ```
	 *
	 * If you already have an `EditorInput` in hand and must use it for opening, use `group.openEditor`
	 * instead, via `IEditorGroupsService`.
	 */
	openEditor(editor: EditorInput, options?: IEditorOptions, group?: PreferredGroup): Promise<IEditorPane | undefined>;

	/**
	 * Open editors in an editor group.
	 *
	 * @param editors the editors to open with associated options
	 * @param group the target group. If unspecified, the editor will open in the currently
	 * active group. Use `SIDE_GROUP` to open the editor in a new editor group to the side
	 * of the currently active group.
	 *
	 * @returns the editors that opened. The array can be empty or have less elements for editors
	 * that failed to open or were instructed to open as inactive.
	 */
	openEditors(editors: IUntypedEditorInput[], group?: PreferredGroup, options?: IOpenEditorsOptions): Promise<readonly IEditorPane[]>;

	/**
	 * Replaces editors in an editor group with the provided replacement.
	 *
	 * @param replacements the editors to replace
	 * @param group the editor group
	 *
	 * @returns a promise that is resolved when the replaced active
	 * editor (if any) has finished loading.
	 */
	replaceEditors(replacements: IUntypedEditorReplacement[], group: IEditorGroup | GroupIdentifier): Promise<void>;

	/**
	 * Find out if the provided editor is opened in any editor group.
	 *
	 * Note: An editor can be opened but not actively visible.
	 *
	 * Note: This method will return `true` if a side by side editor
	 * is opened where the `primary` editor matches too.
	 */
	isOpened(editor: IResourceEditorInputIdentifier): boolean;

	/**
	 * Find out if the provided editor is visible in any editor group.
	 */
	isVisible(editor: EditorInput): boolean;

	/**
	 * Close an editor in a specific editor group.
	 */
	closeEditor(editor: IEditorIdentifier, options?: ICloseEditorOptions): Promise<void>;

	/**
	 * Close multiple editors in specific editor groups.
	 */
	closeEditors(editors: readonly IEditorIdentifier[], options?: ICloseEditorOptions): Promise<void>;

	/**
	 * This method will return an entry for each editor that reports
	 * a `resource` that matches the provided one in the group or
	 * across all groups.
	 *
	 * It is possible that multiple editors are returned in case the
	 * same resource is opened in different editors. To find the specific
	 * editor, use the `IResourceEditorInputIdentifier` as input.
	 */
	findEditors(resource: URI, options?: IFindEditorOptions): readonly IEditorIdentifier[];
	findEditors(editor: IResourceEditorInputIdentifier, options?: IFindEditorOptions): readonly IEditorIdentifier[];

	/**
	 * Save the provided list of editors.
	 */
	save(editors: IEditorIdentifier | readonly IEditorIdentifier[], options?: ISaveEditorsOptions): Promise<ISaveEditorsResult>;

	/**
	 * Save all editors.
	 */
	saveAll(options?: ISaveAllEditorsOptions): Promise<ISaveEditorsResult>;

	/**
	 * Reverts the provided list of editors.
	 *
	 * @returns `true` if all editors reverted and `false` otherwise.
	 */
	revert(editors: IEditorIdentifier | readonly IEditorIdentifier[], options?: IRevertOptions): Promise<boolean>;

	/**
	 * Reverts all editors.
	 *
	 * @returns `true` if all editors reverted and `false` otherwise.
	 */
	revertAll(options?: IRevertAllEditorsOptions): Promise<boolean>;

	/**
	 * Create a scoped editor service that only operates on the provided
	 * editor group container. Use `main` to create a scoped editor service
	 * to the main editor group container of the main window.
	 */
	createScoped(editorGroupsContainer: IEditorGroupsContainer, disposables: DisposableStore): IEditorService;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/editor/test/browser/customEditorLabelService.test.ts]---
Location: vscode-main/src/vs/workbench/services/editor/test/browser/customEditorLabelService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { CustomEditorLabelService } from '../../common/customEditorLabelService.js';
import { ITestInstantiationService, TestServiceAccessor, workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';

suite('Custom Editor Label Service', () => {

	const disposables = new DisposableStore();

	setup(() => { });

	teardown(async () => {
		disposables.clear();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	async function createCustomLabelService(instantiationService: ITestInstantiationService = workbenchInstantiationService(undefined, disposables)): Promise<[CustomEditorLabelService, TestConfigurationService, TestServiceAccessor]> {
		const configService = new TestConfigurationService();
		await configService.setUserConfiguration(CustomEditorLabelService.SETTING_ID_ENABLED, true);
		instantiationService.stub(IConfigurationService, configService);

		const customLabelService = disposables.add(instantiationService.createInstance(CustomEditorLabelService));
		return [customLabelService, configService, instantiationService.createInstance(TestServiceAccessor)];
	}

	async function updatePattern(configService: TestConfigurationService, value: unknown): Promise<void> {
		await configService.setUserConfiguration(CustomEditorLabelService.SETTING_ID_PATTERNS, value);
		configService.onDidChangeConfigurationEmitter.fire({
			affectsConfiguration: (key: string) => key === CustomEditorLabelService.SETTING_ID_PATTERNS,
			source: ConfigurationTarget.USER,
			affectedKeys: new Set(CustomEditorLabelService.SETTING_ID_PATTERNS),
			change: {
				keys: [],
				overrides: []
			}
		});
	}

	test('Custom Labels: filename.extname', async () => {
		const [customLabelService, configService] = await createCustomLabelService();

		await updatePattern(configService, {
			'**': '${filename}.${extname}'
		});

		const filenames = [
			'file.txt',
			'file.txt1.tx2',
			'.file.txt',
		];

		for (const filename of filenames) {
			const label = customLabelService.getName(URI.file(filename));
			assert.strictEqual(label, filename);
		}

		let label = customLabelService.getName(URI.file('file'));
		assert.strictEqual(label, 'file.${extname}');

		label = customLabelService.getName(URI.file('.file'));
		assert.strictEqual(label, '.file.${extname}');
	});

	test('Custom Labels: filename', async () => {
		const [customLabelService, configService] = await createCustomLabelService();

		await updatePattern(configService, {
			'**': '${filename}',
		});

		assert.strictEqual(customLabelService.getName(URI.file('file')), 'file');
		assert.strictEqual(customLabelService.getName(URI.file('file.txt')), 'file');
		assert.strictEqual(customLabelService.getName(URI.file('file.txt1.txt2')), 'file');
		assert.strictEqual(customLabelService.getName(URI.file('folder/file.txt1.txt2')), 'file');

		assert.strictEqual(customLabelService.getName(URI.file('.file')), '.file');
		assert.strictEqual(customLabelService.getName(URI.file('.file.txt')), '.file');
		assert.strictEqual(customLabelService.getName(URI.file('.file.txt1.txt2')), '.file');
		assert.strictEqual(customLabelService.getName(URI.file('folder/.file.txt1.txt2')), '.file');
	});

	test('Custom Labels: extname(N)', async () => {
		const [customLabelService, configService] = await createCustomLabelService();

		await updatePattern(configService, {
			'**/ext/**': '${extname}',
			'**/ext0/**': '${extname(0)}',
			'**/ext1/**': '${extname(1)}',
			'**/ext2/**': '${extname(2)}',
			'**/extMinus1/**': '${extname(-1)}',
			'**/extMinus2/**': '${extname(-2)}',
		});

		interface IExt {
			extname?: string;
			ext0?: string;
			ext1?: string;
			ext2?: string;
			extMinus1?: string;
			extMinus2?: string;
		}

		function assertExtname(filename: string, ext: IExt): void {
			assert.strictEqual(customLabelService.getName(URI.file(`test/ext/${filename}`)), ext.extname ?? '${extname}', filename);
			assert.strictEqual(customLabelService.getName(URI.file(`test/ext0/${filename}`)), ext.ext0 ?? '${extname(0)}', filename);
			assert.strictEqual(customLabelService.getName(URI.file(`test/ext1/${filename}`)), ext.ext1 ?? '${extname(1)}', filename);
			assert.strictEqual(customLabelService.getName(URI.file(`test/ext2/${filename}`)), ext.ext2 ?? '${extname(2)}', filename);
			assert.strictEqual(customLabelService.getName(URI.file(`test/extMinus1/${filename}`)), ext.extMinus1 ?? '${extname(-1)}', filename);
			assert.strictEqual(customLabelService.getName(URI.file(`test/extMinus2/${filename}`)), ext.extMinus2 ?? '${extname(-2)}', filename);
		}

		assertExtname('file.txt', {
			extname: 'txt',
			ext0: 'txt',
			extMinus1: 'txt',
		});

		assertExtname('file.txt1.txt2', {
			extname: 'txt1.txt2',
			ext0: 'txt2',
			ext1: 'txt1',
			extMinus1: 'txt1',
			extMinus2: 'txt2',
		});

		assertExtname('.file.txt1.txt2', {
			extname: 'txt1.txt2',
			ext0: 'txt2',
			ext1: 'txt1',
			extMinus1: 'txt1',
			extMinus2: 'txt2',
		});

		assertExtname('.file.txt1.txt2.txt3.txt4', {
			extname: 'txt1.txt2.txt3.txt4',
			ext0: 'txt4',
			ext1: 'txt3',
			ext2: 'txt2',
			extMinus1: 'txt1',
			extMinus2: 'txt2',
		});

		assertExtname('file', {});
		assertExtname('.file', {});
	});

	test('Custom Labels: dirname(N)', async () => {
		const [customLabelService, configService] = await createCustomLabelService();

		await updatePattern(configService, {
			'**': '${dirname},${dirname(0)},${dirname(1)},${dirname(2)},${dirname(-1)},${dirname(-2)}',
		});

		interface IDir {
			dirname?: string;
			dir0?: string;
			dir1?: string;
			dir2?: string;
			dirMinus1?: string;
			dirMinus2?: string;
		}

		function assertDirname(path: string, dir: IDir): void {
			assert.strictEqual(customLabelService.getName(URI.file(path))?.split(',')[0], dir.dirname ?? '${dirname}', path);
			assert.strictEqual(customLabelService.getName(URI.file(path))?.split(',')[1], dir.dir0 ?? '${dirname(0)}', path);
			assert.strictEqual(customLabelService.getName(URI.file(path))?.split(',')[2], dir.dir1 ?? '${dirname(1)}', path);
			assert.strictEqual(customLabelService.getName(URI.file(path))?.split(',')[3], dir.dir2 ?? '${dirname(2)}', path);
			assert.strictEqual(customLabelService.getName(URI.file(path))?.split(',')[4], dir.dirMinus1 ?? '${dirname(-1)}', path);
			assert.strictEqual(customLabelService.getName(URI.file(path))?.split(',')[5], dir.dirMinus2 ?? '${dirname(-2)}', path);
		}

		assertDirname('folder/file.txt', {
			dirname: 'folder',
			dir0: 'folder',
			dirMinus1: 'folder',
		});

		assertDirname('root/folder/file.txt', {
			dirname: 'folder',
			dir0: 'folder',
			dir1: 'root',
			dirMinus1: 'root',
			dirMinus2: 'folder',
		});

		assertDirname('root/.folder/file.txt', {
			dirname: '.folder',
			dir0: '.folder',
			dir1: 'root',
			dirMinus1: 'root',
			dirMinus2: '.folder',
		});

		assertDirname('root/parent/folder/file.txt', {
			dirname: 'folder',
			dir0: 'folder',
			dir1: 'parent',
			dir2: 'root',
			dirMinus1: 'root',
			dirMinus2: 'parent',
		});

		assertDirname('file.txt', {});
	});

	test('Custom Labels: no pattern match', async () => {
		const [customLabelService, configService] = await createCustomLabelService();

		await updatePattern(configService, {
			'**/folder/**': 'folder',
			'file': 'file',
		});

		assert.strictEqual(customLabelService.getName(URI.file('file')), undefined);
		assert.strictEqual(customLabelService.getName(URI.file('file.txt')), undefined);
		assert.strictEqual(customLabelService.getName(URI.file('file.txt1.txt2')), undefined);
		assert.strictEqual(customLabelService.getName(URI.file('folder1/file.txt1.txt2')), undefined);

		assert.strictEqual(customLabelService.getName(URI.file('.file')), undefined);
		assert.strictEqual(customLabelService.getName(URI.file('.file.txt')), undefined);
		assert.strictEqual(customLabelService.getName(URI.file('.file.txt1.txt2')), undefined);
		assert.strictEqual(customLabelService.getName(URI.file('folder1/file.txt1.txt2')), undefined);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/editor/test/browser/editorGroupsService.test.ts]---
Location: vscode-main/src/vs/workbench/services/editor/test/browser/editorGroupsService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { workbenchInstantiationService, registerTestEditor, TestFileEditorInput, TestEditorPart, TestServiceAccessor, ITestInstantiationService, workbenchTeardown, createEditorParts, TestEditorParts } from '../../../../test/browser/workbenchTestServices.js';
import { GroupDirection, GroupsOrder, MergeGroupMode, GroupOrientation, GroupLocation, isEditorGroup, IEditorGroupsService, GroupsArrangement, IEditorGroupContextKeyProvider } from '../../common/editorGroupsService.js';
import { CloseDirection, IEditorPartOptions, EditorsOrder, EditorInputCapabilities, GroupModelChangeKind, SideBySideEditor, IEditorFactoryRegistry, EditorExtensions } from '../../../../common/editor.js';
import { URI } from '../../../../../base/common/uri.js';
import { SyncDescriptor } from '../../../../../platform/instantiation/common/descriptors.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { MockScopableContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ConfirmResult } from '../../../../../platform/dialogs/common/dialogs.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { SideBySideEditorInput } from '../../../../common/editor/sideBySideEditorInput.js';
import { IGroupModelChangeEvent, IGroupEditorMoveEvent, IGroupEditorOpenEvent } from '../../../../common/editor/editorGroupModel.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { IContextKeyService, RawContextKey } from '../../../../../platform/contextkey/common/contextkey.js';
import { Emitter } from '../../../../../base/common/event.js';
import { isEqual } from '../../../../../base/common/resources.js';

suite('EditorGroupsService', () => {

	const TEST_EDITOR_ID = 'MyFileEditorForEditorGroupService';
	const TEST_EDITOR_INPUT_ID = 'testEditorInputForEditorGroupService';

	const disposables = new DisposableStore();

	let testLocalInstantiationService: ITestInstantiationService | undefined = undefined;

	setup(() => {
		disposables.add(registerTestEditor(TEST_EDITOR_ID, [new SyncDescriptor(TestFileEditorInput), new SyncDescriptor(SideBySideEditorInput)], TEST_EDITOR_INPUT_ID));
	});

	teardown(async () => {
		if (testLocalInstantiationService) {
			await workbenchTeardown(testLocalInstantiationService);
			testLocalInstantiationService = undefined;
		}

		disposables.clear();
	});

	async function createParts(instantiationService = workbenchInstantiationService(undefined, disposables)): Promise<[TestEditorParts, TestInstantiationService]> {
		instantiationService.invokeFunction(accessor => Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).start(accessor));
		const parts = await createEditorParts(instantiationService, disposables);
		instantiationService.stub(IEditorGroupsService, parts);

		testLocalInstantiationService = instantiationService;

		return [parts, instantiationService];
	}

	async function createPart(instantiationService?: TestInstantiationService): Promise<[TestEditorPart, TestInstantiationService]> {
		const [parts, testInstantiationService] = await createParts(instantiationService);
		return [parts.testMainPart, testInstantiationService];
	}

	function createTestFileEditorInput(resource: URI, typeId: string): TestFileEditorInput {
		return disposables.add(new TestFileEditorInput(resource, typeId));
	}

	test('groups basics', async function () {
		const instantiationService = workbenchInstantiationService({ contextKeyService: instantiationService => instantiationService.createInstance(MockScopableContextKeyService) }, disposables);
		const [part] = await createPart(instantiationService);

		let activeGroupModelChangeCounter = 0;
		const activeGroupModelChangeListener = part.onDidChangeActiveGroup(() => {
			activeGroupModelChangeCounter++;
		});

		let groupAddedCounter = 0;
		const groupAddedListener = part.onDidAddGroup(() => {
			groupAddedCounter++;
		});

		let groupRemovedCounter = 0;
		const groupRemovedListener = part.onDidRemoveGroup(() => {
			groupRemovedCounter++;
		});

		let groupMovedCounter = 0;
		const groupMovedListener = part.onDidMoveGroup(() => {
			groupMovedCounter++;
		});

		// always a root group
		const rootGroup = part.groups[0];
		assert.strictEqual(isEditorGroup(rootGroup), true);
		assert.strictEqual(part.groups.length, 1);
		assert.strictEqual(part.count, 1);
		assert.strictEqual(rootGroup, part.getGroup(rootGroup.id));
		assert.ok(part.activeGroup === rootGroup);
		assert.strictEqual(rootGroup.label, 'Group 1');

		let mru = part.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE);
		assert.strictEqual(mru.length, 1);
		assert.strictEqual(mru[0], rootGroup);

		const rightGroup = part.addGroup(rootGroup, GroupDirection.RIGHT);
		assert.strictEqual(rightGroup, part.getGroup(rightGroup.id));
		assert.strictEqual(groupAddedCounter, 1);
		assert.strictEqual(part.groups.length, 2);
		assert.strictEqual(part.count, 2);
		assert.ok(part.activeGroup === rootGroup);
		assert.strictEqual(rootGroup.label, 'Group 1');
		assert.strictEqual(rightGroup.label, 'Group 2');

		mru = part.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE);
		assert.strictEqual(mru.length, 2);
		assert.strictEqual(mru[0], rootGroup);
		assert.strictEqual(mru[1], rightGroup);

		assert.strictEqual(activeGroupModelChangeCounter, 0);

		let rootGroupActiveChangeCounter = 0;
		const rootGroupModelChangeListener = rootGroup.onDidModelChange(e => {
			if (e.kind === GroupModelChangeKind.GROUP_ACTIVE) {
				rootGroupActiveChangeCounter++;
			}
		});

		let rightGroupActiveChangeCounter = 0;
		const rightGroupModelChangeListener = rightGroup.onDidModelChange(e => {
			if (e.kind === GroupModelChangeKind.GROUP_ACTIVE) {
				rightGroupActiveChangeCounter++;
			}
		});

		part.activateGroup(rightGroup);
		assert.ok(part.activeGroup === rightGroup);
		assert.strictEqual(activeGroupModelChangeCounter, 1);
		assert.strictEqual(rootGroupActiveChangeCounter, 1);
		assert.strictEqual(rightGroupActiveChangeCounter, 1);

		rootGroupModelChangeListener.dispose();
		rightGroupModelChangeListener.dispose();

		mru = part.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE);
		assert.strictEqual(mru.length, 2);
		assert.strictEqual(mru[0], rightGroup);
		assert.strictEqual(mru[1], rootGroup);

		const downGroup = part.addGroup(rightGroup, GroupDirection.DOWN);
		let didDispose = false;
		disposables.add(downGroup.onWillDispose(() => {
			didDispose = true;
		}));
		assert.strictEqual(groupAddedCounter, 2);
		assert.strictEqual(part.groups.length, 3);
		assert.ok(part.activeGroup === rightGroup);
		assert.ok(!downGroup.activeEditorPane);
		assert.strictEqual(rootGroup.label, 'Group 1');
		assert.strictEqual(rightGroup.label, 'Group 2');
		assert.strictEqual(downGroup.label, 'Group 3');

		mru = part.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE);
		assert.strictEqual(mru.length, 3);
		assert.strictEqual(mru[0], rightGroup);
		assert.strictEqual(mru[1], rootGroup);
		assert.strictEqual(mru[2], downGroup);

		const gridOrder = part.getGroups(GroupsOrder.GRID_APPEARANCE);
		assert.strictEqual(gridOrder.length, 3);
		assert.strictEqual(gridOrder[0], rootGroup);
		assert.strictEqual(gridOrder[0].index, 0);
		assert.strictEqual(gridOrder[1], rightGroup);
		assert.strictEqual(gridOrder[1].index, 1);
		assert.strictEqual(gridOrder[2], downGroup);
		assert.strictEqual(gridOrder[2].index, 2);

		part.moveGroup(downGroup, rightGroup, GroupDirection.DOWN);
		assert.strictEqual(groupMovedCounter, 1);

		part.removeGroup(downGroup);
		assert.ok(!part.getGroup(downGroup.id));
		assert.ok(!part.hasGroup(downGroup.id));
		assert.strictEqual(didDispose, true);
		assert.strictEqual(groupRemovedCounter, 1);
		assert.strictEqual(part.groups.length, 2);
		assert.ok(part.activeGroup === rightGroup);
		assert.strictEqual(rootGroup.label, 'Group 1');
		assert.strictEqual(rightGroup.label, 'Group 2');

		mru = part.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE);
		assert.strictEqual(mru.length, 2);
		assert.strictEqual(mru[0], rightGroup);
		assert.strictEqual(mru[1], rootGroup);

		const rightGroupContextKeyService = part.activeGroup.scopedContextKeyService;
		const rootGroupContextKeyService = rootGroup.scopedContextKeyService;

		assert.ok(rightGroupContextKeyService);
		assert.ok(rootGroupContextKeyService);
		assert.ok(rightGroupContextKeyService !== rootGroupContextKeyService);

		part.removeGroup(rightGroup);
		assert.strictEqual(groupRemovedCounter, 2);
		assert.strictEqual(part.groups.length, 1);
		assert.ok(part.activeGroup === rootGroup);

		mru = part.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE);
		assert.strictEqual(mru.length, 1);
		assert.strictEqual(mru[0], rootGroup);

		part.removeGroup(rootGroup); // cannot remove root group
		assert.strictEqual(part.groups.length, 1);
		assert.strictEqual(groupRemovedCounter, 2);
		assert.ok(part.activeGroup === rootGroup);

		part.setGroupOrientation(part.orientation === GroupOrientation.HORIZONTAL ? GroupOrientation.VERTICAL : GroupOrientation.HORIZONTAL);

		activeGroupModelChangeListener.dispose();
		groupAddedListener.dispose();
		groupRemovedListener.dispose();
		groupMovedListener.dispose();
	});

	test('sideGroup', async () => {
		const instantiationService = workbenchInstantiationService({ contextKeyService: instantiationService => instantiationService.createInstance(MockScopableContextKeyService) }, disposables);
		const [part] = await createPart(instantiationService);

		const rootGroup = part.activeGroup;

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);
		const input3 = createTestFileEditorInput(URI.file('foo/bar3'), TEST_EDITOR_INPUT_ID);

		await rootGroup.openEditor(input1, { pinned: true });
		await part.sideGroup.openEditor(input2, { pinned: true });
		assert.strictEqual(part.count, 2);

		part.activateGroup(rootGroup);
		await part.sideGroup.openEditor(input3, { pinned: true });
		assert.strictEqual(part.count, 2);
	});

	test('save & restore state', async function () {
		const [part, instantiationService] = await createPart();

		const rootGroup = part.groups[0];
		const rightGroup = part.addGroup(rootGroup, GroupDirection.RIGHT);
		const downGroup = part.addGroup(rightGroup, GroupDirection.DOWN);

		const rootGroupInput = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		await rootGroup.openEditor(rootGroupInput, { pinned: true });

		const rightGroupInput = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);
		await rightGroup.openEditor(rightGroupInput, { pinned: true });

		assert.strictEqual(part.groups.length, 3);

		part.testSaveState();
		part.dispose();

		const [restoredPart] = await createPart(instantiationService);

		assert.strictEqual(restoredPart.groups.length, 3);
		assert.ok(restoredPart.getGroup(rootGroup.id));
		assert.ok(restoredPart.hasGroup(rootGroup.id));
		assert.ok(restoredPart.getGroup(rightGroup.id));
		assert.ok(restoredPart.hasGroup(rightGroup.id));
		assert.ok(restoredPart.getGroup(downGroup.id));
		assert.ok(restoredPart.hasGroup(downGroup.id));

		restoredPart.clearState();
	});

	test('groups index / labels', async function () {
		const [part] = await createPart();

		const rootGroup = part.groups[0];
		const rightGroup = part.addGroup(rootGroup, GroupDirection.RIGHT);
		const downGroup = part.addGroup(rightGroup, GroupDirection.DOWN);

		let groupIndexChangedCounter = 0;
		const groupIndexChangedListener = part.onDidChangeGroupIndex(() => {
			groupIndexChangedCounter++;
		});

		let indexChangeCounter = 0;
		const labelChangeListener = downGroup.onDidModelChange(e => {
			if (e.kind === GroupModelChangeKind.GROUP_INDEX) {
				indexChangeCounter++;
			}
		});

		assert.strictEqual(rootGroup.index, 0);
		assert.strictEqual(rightGroup.index, 1);
		assert.strictEqual(downGroup.index, 2);
		assert.strictEqual(rootGroup.label, 'Group 1');
		assert.strictEqual(rightGroup.label, 'Group 2');
		assert.strictEqual(downGroup.label, 'Group 3');

		part.removeGroup(rightGroup);
		assert.strictEqual(rootGroup.index, 0);
		assert.strictEqual(downGroup.index, 1);
		assert.strictEqual(rootGroup.label, 'Group 1');
		assert.strictEqual(downGroup.label, 'Group 2');
		assert.strictEqual(indexChangeCounter, 1);
		assert.strictEqual(groupIndexChangedCounter, 1);

		part.moveGroup(downGroup, rootGroup, GroupDirection.UP);
		assert.strictEqual(downGroup.index, 0);
		assert.strictEqual(rootGroup.index, 1);
		assert.strictEqual(downGroup.label, 'Group 1');
		assert.strictEqual(rootGroup.label, 'Group 2');
		assert.strictEqual(indexChangeCounter, 2);
		assert.strictEqual(groupIndexChangedCounter, 3);

		const newFirstGroup = part.addGroup(downGroup, GroupDirection.UP);
		assert.strictEqual(newFirstGroup.index, 0);
		assert.strictEqual(downGroup.index, 1);
		assert.strictEqual(rootGroup.index, 2);
		assert.strictEqual(newFirstGroup.label, 'Group 1');
		assert.strictEqual(downGroup.label, 'Group 2');
		assert.strictEqual(rootGroup.label, 'Group 3');
		assert.strictEqual(indexChangeCounter, 3);
		assert.strictEqual(groupIndexChangedCounter, 6);

		labelChangeListener.dispose();
		groupIndexChangedListener.dispose();
	});

	test('groups label', async function () {
		const [part] = await createPart();

		const rootGroup = part.groups[0];
		const rightGroup = part.addGroup(rootGroup, GroupDirection.RIGHT);

		let partLabelChangedCounter = 0;
		const groupIndexChangedListener = part.onDidChangeGroupLabel(() => {
			partLabelChangedCounter++;
		});

		let rootGroupLabelChangeCounter = 0;
		const rootGroupLabelChangeListener = rootGroup.onDidModelChange(e => {
			if (e.kind === GroupModelChangeKind.GROUP_LABEL) {
				rootGroupLabelChangeCounter++;
			}
		});

		let rightGroupLabelChangeCounter = 0;
		const rightGroupLabelChangeListener = rightGroup.onDidModelChange(e => {
			if (e.kind === GroupModelChangeKind.GROUP_LABEL) {
				rightGroupLabelChangeCounter++;
			}
		});

		assert.strictEqual(rootGroup.label, 'Group 1');
		assert.strictEqual(rightGroup.label, 'Group 2');

		part.notifyGroupsLabelChange('Window 2');

		assert.strictEqual(rootGroup.label, 'Window 2: Group 1');
		assert.strictEqual(rightGroup.label, 'Window 2: Group 2');

		assert.strictEqual(rootGroupLabelChangeCounter, 1);
		assert.strictEqual(rightGroupLabelChangeCounter, 1);
		assert.strictEqual(partLabelChangedCounter, 2);

		part.notifyGroupsLabelChange('Window 3');

		assert.strictEqual(rootGroup.label, 'Window 3: Group 1');
		assert.strictEqual(rightGroup.label, 'Window 3: Group 2');

		assert.strictEqual(rootGroupLabelChangeCounter, 2);
		assert.strictEqual(rightGroupLabelChangeCounter, 2);
		assert.strictEqual(partLabelChangedCounter, 4);

		rootGroupLabelChangeListener.dispose();
		rightGroupLabelChangeListener.dispose();
		groupIndexChangedListener.dispose();
	});

	test('copy/merge groups', async () => {
		const [part] = await createPart();

		let groupAddedCounter = 0;
		const groupAddedListener = part.onDidAddGroup(() => {
			groupAddedCounter++;
		});

		let groupRemovedCounter = 0;
		const groupRemovedListener = part.onDidRemoveGroup(() => {
			groupRemovedCounter++;
		});

		const rootGroup = part.groups[0];
		let rootGroupDisposed = false;
		const disposeListener = rootGroup.onWillDispose(() => {
			rootGroupDisposed = true;
		});

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);

		await rootGroup.openEditor(input, { pinned: true });
		const rightGroup = part.addGroup(rootGroup, GroupDirection.RIGHT);
		part.activateGroup(rightGroup);
		const downGroup = part.copyGroup(rootGroup, rightGroup, GroupDirection.DOWN);
		assert.strictEqual(groupAddedCounter, 2);
		assert.strictEqual(downGroup.count, 1);
		assert.ok(downGroup.activeEditor instanceof TestFileEditorInput);
		let res = part.mergeGroup(rootGroup, rightGroup, { mode: MergeGroupMode.COPY_EDITORS });
		assert.strictEqual(res, true);
		assert.strictEqual(rightGroup.count, 1);
		assert.ok(rightGroup.activeEditor instanceof TestFileEditorInput);
		res = part.mergeGroup(rootGroup, rightGroup, { mode: MergeGroupMode.MOVE_EDITORS });
		assert.strictEqual(res, true);
		assert.strictEqual(rootGroup.count, 0);
		res = part.mergeGroup(rootGroup, downGroup);
		assert.strictEqual(res, true);
		assert.strictEqual(groupRemovedCounter, 1);
		assert.strictEqual(rootGroupDisposed, true);

		groupAddedListener.dispose();
		groupRemovedListener.dispose();
		disposeListener.dispose();
		part.dispose();
	});

	test('merge all groups', async () => {
		const [part] = await createPart();

		const rootGroup = part.groups[0];

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);
		const input3 = createTestFileEditorInput(URI.file('foo/bar3'), TEST_EDITOR_INPUT_ID);

		await rootGroup.openEditor(input1, { pinned: true });

		const rightGroup = part.addGroup(rootGroup, GroupDirection.RIGHT);
		await rightGroup.openEditor(input2, { pinned: true });

		const downGroup = part.copyGroup(rootGroup, rightGroup, GroupDirection.DOWN);
		await downGroup.openEditor(input3, { pinned: true });

		part.activateGroup(rootGroup);

		assert.strictEqual(rootGroup.count, 1);

		const result = part.mergeAllGroups(part.activeGroup);
		assert.strictEqual(result, true);
		assert.strictEqual(rootGroup.count, 3);

		part.dispose();
	});

	test('whenReady / whenRestored', async () => {
		const [part] = await createPart();

		await part.whenReady;
		assert.strictEqual(part.isReady, true);
		await part.whenRestored;
	});

	test('options', async () => {
		const [part] = await createPart();

		let oldOptions!: IEditorPartOptions;
		let newOptions!: IEditorPartOptions;
		disposables.add(part.onDidChangeEditorPartOptions(event => {
			oldOptions = event.oldPartOptions;
			newOptions = event.newPartOptions;
		}));

		const currentOptions = part.partOptions;
		assert.ok(currentOptions);

		disposables.add(part.enforcePartOptions({ showTabs: 'single' }));
		assert.strictEqual(part.partOptions.showTabs, 'single');
		assert.strictEqual(newOptions.showTabs, 'single');
		assert.strictEqual(oldOptions, currentOptions);
	});

	test('editor basics', async function () {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		let activeEditorChangeCounter = 0;
		let editorDidOpenCounter = 0;
		const editorOpenEvents: IGroupModelChangeEvent[] = [];
		let editorCloseCounter = 0;
		const editorCloseEvents: IGroupModelChangeEvent[] = [];
		let editorPinCounter = 0;
		let editorStickyCounter = 0;
		let editorCapabilitiesCounter = 0;
		const editorGroupModelChangeListener = group.onDidModelChange(e => {
			if (e.kind === GroupModelChangeKind.EDITOR_OPEN) {
				assert.ok(e.editor);
				editorDidOpenCounter++;
				editorOpenEvents.push(e);
			} else if (e.kind === GroupModelChangeKind.EDITOR_PIN) {
				assert.ok(e.editor);
				editorPinCounter++;
			} else if (e.kind === GroupModelChangeKind.EDITOR_STICKY) {
				assert.ok(e.editor);
				editorStickyCounter++;
			} else if (e.kind === GroupModelChangeKind.EDITOR_CAPABILITIES) {
				assert.ok(e.editor);
				editorCapabilitiesCounter++;
			} else if (e.kind === GroupModelChangeKind.EDITOR_CLOSE) {
				assert.ok(e.editor);
				editorCloseCounter++;
				editorCloseEvents.push(e);
			}
		});
		const activeEditorChangeListener = group.onDidActiveEditorChange(e => {
			assert.ok(e.editor);
			activeEditorChangeCounter++;
		});

		let editorCloseCounter1 = 0;
		const editorCloseListener = group.onDidCloseEditor(() => {
			editorCloseCounter1++;
		});

		let editorWillCloseCounter = 0;
		const editorWillCloseListener = group.onWillCloseEditor(() => {
			editorWillCloseCounter++;
		});

		let editorDidCloseCounter = 0;
		const editorDidCloseListener = group.onDidCloseEditor(() => {
			editorDidCloseCounter++;
		});

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const inputInactive = createTestFileEditorInput(URI.file('foo/bar/inactive'), TEST_EDITOR_INPUT_ID);

		await group.openEditor(input, { pinned: true });
		await group.openEditor(inputInactive, { inactive: true });

		assert.strictEqual(group.isActive(input), true);
		assert.strictEqual(group.isActive(inputInactive), false);
		assert.strictEqual(group.contains(input), true);
		assert.strictEqual(group.contains(inputInactive), true);
		assert.strictEqual(group.isEmpty, false);
		assert.strictEqual(group.count, 2);
		assert.strictEqual(editorCapabilitiesCounter, 0);
		assert.strictEqual(editorDidOpenCounter, 2);
		assert.strictEqual((editorOpenEvents[0] as IGroupEditorOpenEvent).editorIndex, 0);
		assert.strictEqual((editorOpenEvents[1] as IGroupEditorOpenEvent).editorIndex, 1);
		assert.strictEqual(editorOpenEvents[0].editor, input);
		assert.strictEqual(editorOpenEvents[1].editor, inputInactive);
		assert.strictEqual(activeEditorChangeCounter, 1);
		assert.strictEqual(group.getEditorByIndex(0), input);
		assert.strictEqual(group.getEditorByIndex(1), inputInactive);
		assert.strictEqual(group.getIndexOfEditor(input), 0);
		assert.strictEqual(group.getIndexOfEditor(inputInactive), 1);
		assert.strictEqual(group.isFirst(input), true);
		assert.strictEqual(group.isFirst(inputInactive), false);
		assert.strictEqual(group.isLast(input), false);
		assert.strictEqual(group.isLast(inputInactive), true);

		input.capabilities = EditorInputCapabilities.RequiresTrust;
		assert.strictEqual(editorCapabilitiesCounter, 1);

		inputInactive.capabilities = EditorInputCapabilities.Singleton;
		assert.strictEqual(editorCapabilitiesCounter, 2);

		assert.strictEqual(group.previewEditor, inputInactive);
		assert.strictEqual(group.isPinned(inputInactive), false);
		group.pinEditor(inputInactive);
		assert.strictEqual(editorPinCounter, 1);
		assert.strictEqual(group.isPinned(inputInactive), true);
		assert.ok(!group.previewEditor);

		assert.strictEqual(group.activeEditor, input);
		assert.strictEqual(group.activeEditorPane?.getId(), TEST_EDITOR_ID);
		assert.strictEqual(group.count, 2);

		const mru = group.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE);
		assert.strictEqual(mru[0], input);
		assert.strictEqual(mru[1], inputInactive);

		await group.openEditor(inputInactive);
		assert.strictEqual(activeEditorChangeCounter, 2);
		assert.strictEqual(group.activeEditor, inputInactive);

		await group.openEditor(input);
		const closed = await group.closeEditor(inputInactive);
		assert.strictEqual(closed, true);

		assert.strictEqual(activeEditorChangeCounter, 3);
		assert.strictEqual(editorCloseCounter, 1);
		assert.strictEqual((editorCloseEvents[0] as IGroupEditorOpenEvent).editorIndex, 1);
		assert.strictEqual(editorCloseEvents[0].editor, inputInactive);
		assert.strictEqual(editorCloseCounter1, 1);
		assert.strictEqual(editorWillCloseCounter, 1);
		assert.strictEqual(editorDidCloseCounter, 1);

		assert.ok(inputInactive.gotDisposed);

		assert.strictEqual(group.activeEditor, input);

		assert.strictEqual(editorStickyCounter, 0);
		group.stickEditor(input);
		assert.strictEqual(editorStickyCounter, 1);
		group.unstickEditor(input);
		assert.strictEqual(editorStickyCounter, 2);

		editorCloseListener.dispose();
		editorWillCloseListener.dispose();
		editorDidCloseListener.dispose();
		activeEditorChangeListener.dispose();
		editorGroupModelChangeListener.dispose();
	});

	test('openEditors / closeEditors', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const inputInactive = createTestFileEditorInput(URI.file('foo/bar/inactive'), TEST_EDITOR_INPUT_ID);

		await group.openEditors([
			{ editor: input, options: { pinned: true } },
			{ editor: inputInactive }
		]);

		assert.strictEqual(group.count, 2);
		assert.strictEqual(group.getEditorByIndex(0), input);
		assert.strictEqual(group.getEditorByIndex(1), inputInactive);

		await group.closeEditors([input, inputInactive]);

		assert.ok(input.gotDisposed);
		assert.ok(inputInactive.gotDisposed);

		assert.strictEqual(group.isEmpty, true);
	});

	test('closeEditor - dirty editor handling', async () => {
		const [part, instantiationService] = await createPart();

		const accessor = instantiationService.createInstance(TestServiceAccessor);
		accessor.fileDialogService.setConfirmResult(ConfirmResult.DONT_SAVE);

		const group = part.activeGroup;

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		input.dirty = true;

		await group.openEditor(input);

		accessor.fileDialogService.setConfirmResult(ConfirmResult.CANCEL);
		let closed = await group.closeEditor(input);
		assert.strictEqual(closed, false);

		assert.ok(!input.gotDisposed);

		accessor.fileDialogService.setConfirmResult(ConfirmResult.DONT_SAVE);
		closed = await group.closeEditor(input);
		assert.strictEqual(closed, true);

		assert.ok(input.gotDisposed);
	});

	test('closeEditor (one, opened in multiple groups)', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const rightGroup = part.addGroup(group, GroupDirection.RIGHT);

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const inputInactive = createTestFileEditorInput(URI.file('foo/bar/inactive'), TEST_EDITOR_INPUT_ID);

		await group.openEditors([{ editor: input, options: { pinned: true } }, { editor: inputInactive }]);
		await rightGroup.openEditors([{ editor: input, options: { pinned: true } }, { editor: inputInactive }]);

		let closed = await rightGroup.closeEditor(input);
		assert.strictEqual(closed, true);

		assert.ok(!input.gotDisposed);

		closed = await group.closeEditor(input);
		assert.strictEqual(closed, true);

		assert.ok(input.gotDisposed);
	});

	test('closeEditors - dirty editor handling', async () => {
		const [part, instantiationService] = await createPart();

		const accessor = instantiationService.createInstance(TestServiceAccessor);
		accessor.fileDialogService.setConfirmResult(ConfirmResult.DONT_SAVE);
		let closeResult = false;

		const group = part.activeGroup;

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		input1.dirty = true;

		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);

		await group.openEditor(input1);
		await group.openEditor(input2);

		accessor.fileDialogService.setConfirmResult(ConfirmResult.CANCEL);
		closeResult = await group.closeEditors([input1, input2]);
		assert.strictEqual(closeResult, false);

		assert.ok(!input1.gotDisposed);
		assert.ok(!input2.gotDisposed);

		accessor.fileDialogService.setConfirmResult(ConfirmResult.DONT_SAVE);
		closeResult = await group.closeEditors([input1, input2]);
		assert.strictEqual(closeResult, true);

		assert.ok(input1.gotDisposed);
		assert.ok(input2.gotDisposed);
	});

	test('closeEditors (except one)', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);
		const input3 = createTestFileEditorInput(URI.file('foo/bar3'), TEST_EDITOR_INPUT_ID);

		await group.openEditors([
			{ editor: input1, options: { pinned: true } },
			{ editor: input2, options: { pinned: true } },
			{ editor: input3 }
		]);

		assert.strictEqual(group.count, 3);
		assert.strictEqual(group.getEditorByIndex(0), input1);
		assert.strictEqual(group.getEditorByIndex(1), input2);
		assert.strictEqual(group.getEditorByIndex(2), input3);

		await group.closeEditors({ except: input2 });
		assert.strictEqual(group.count, 1);
		assert.strictEqual(group.getEditorByIndex(0), input2);
	});

	test('closeEditors (except one, sticky editor)', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);
		const input3 = createTestFileEditorInput(URI.file('foo/bar3'), TEST_EDITOR_INPUT_ID);

		await group.openEditors([
			{ editor: input1, options: { pinned: true, sticky: true } },
			{ editor: input2, options: { pinned: true } },
			{ editor: input3 }
		]);

		assert.strictEqual(group.count, 3);
		assert.strictEqual(group.stickyCount, 1);
		assert.strictEqual(group.getEditorByIndex(0), input1);
		assert.strictEqual(group.getEditorByIndex(1), input2);
		assert.strictEqual(group.getEditorByIndex(2), input3);

		await group.closeEditors({ except: input2, excludeSticky: true });

		assert.strictEqual(group.count, 2);
		assert.strictEqual(group.stickyCount, 1);
		assert.strictEqual(group.getEditorByIndex(0), input1);
		assert.strictEqual(group.getEditorByIndex(1), input2);

		await group.closeEditors({ except: input2 });

		assert.strictEqual(group.count, 1);
		assert.strictEqual(group.stickyCount, 0);
		assert.strictEqual(group.getEditorByIndex(0), input2);
	});

	test('closeEditors (saved only)', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);
		const input3 = createTestFileEditorInput(URI.file('foo/bar3'), TEST_EDITOR_INPUT_ID);

		await group.openEditors([
			{ editor: input1, options: { pinned: true } },
			{ editor: input2, options: { pinned: true } },
			{ editor: input3 }
		]);

		assert.strictEqual(group.count, 3);
		assert.strictEqual(group.getEditorByIndex(0), input1);
		assert.strictEqual(group.getEditorByIndex(1), input2);
		assert.strictEqual(group.getEditorByIndex(2), input3);

		await group.closeEditors({ savedOnly: true });
		assert.strictEqual(group.count, 0);
	});

	test('closeEditors (saved only, sticky editor)', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);
		const input3 = createTestFileEditorInput(URI.file('foo/bar3'), TEST_EDITOR_INPUT_ID);

		await group.openEditors([
			{ editor: input1, options: { pinned: true, sticky: true } },
			{ editor: input2, options: { pinned: true } },
			{ editor: input3 }
		]);

		assert.strictEqual(group.count, 3);
		assert.strictEqual(group.stickyCount, 1);
		assert.strictEqual(group.getEditorByIndex(0), input1);
		assert.strictEqual(group.getEditorByIndex(1), input2);
		assert.strictEqual(group.getEditorByIndex(2), input3);

		await group.closeEditors({ savedOnly: true, excludeSticky: true });

		assert.strictEqual(group.count, 1);
		assert.strictEqual(group.stickyCount, 1);
		assert.strictEqual(group.getEditorByIndex(0), input1);

		await group.closeEditors({ savedOnly: true });
		assert.strictEqual(group.count, 0);
	});

	test('closeEditors (direction: right)', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);
		const input3 = createTestFileEditorInput(URI.file('foo/bar3'), TEST_EDITOR_INPUT_ID);

		await group.openEditors([
			{ editor: input1, options: { pinned: true } },
			{ editor: input2, options: { pinned: true } },
			{ editor: input3 }
		]);

		assert.strictEqual(group.count, 3);
		assert.strictEqual(group.getEditorByIndex(0), input1);
		assert.strictEqual(group.getEditorByIndex(1), input2);
		assert.strictEqual(group.getEditorByIndex(2), input3);

		await group.closeEditors({ direction: CloseDirection.RIGHT, except: input2 });
		assert.strictEqual(group.count, 2);
		assert.strictEqual(group.getEditorByIndex(0), input1);
		assert.strictEqual(group.getEditorByIndex(1), input2);
	});

	test('closeEditors (direction: right, sticky editor)', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);
		const input3 = createTestFileEditorInput(URI.file('foo/bar3'), TEST_EDITOR_INPUT_ID);

		await group.openEditors([
			{ editor: input1, options: { pinned: true, sticky: true } },
			{ editor: input2, options: { pinned: true } },
			{ editor: input3 }
		]);

		assert.strictEqual(group.count, 3);
		assert.strictEqual(group.stickyCount, 1);
		assert.strictEqual(group.getEditorByIndex(0), input1);
		assert.strictEqual(group.getEditorByIndex(1), input2);
		assert.strictEqual(group.getEditorByIndex(2), input3);

		await group.closeEditors({ direction: CloseDirection.RIGHT, except: input2, excludeSticky: true });
		assert.strictEqual(group.count, 2);
		assert.strictEqual(group.stickyCount, 1);
		assert.strictEqual(group.getEditorByIndex(0), input1);
		assert.strictEqual(group.getEditorByIndex(1), input2);

		await group.closeEditors({ direction: CloseDirection.RIGHT, except: input2 });
		assert.strictEqual(group.count, 2);
		assert.strictEqual(group.getEditorByIndex(0), input1);
		assert.strictEqual(group.getEditorByIndex(1), input2);
	});

	test('closeEditors (direction: left)', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);
		const input3 = createTestFileEditorInput(URI.file('foo/bar3'), TEST_EDITOR_INPUT_ID);

		await group.openEditors([
			{ editor: input1, options: { pinned: true } },
			{ editor: input2, options: { pinned: true } },
			{ editor: input3 }
		]);

		assert.strictEqual(group.count, 3);
		assert.strictEqual(group.getEditorByIndex(0), input1);
		assert.strictEqual(group.getEditorByIndex(1), input2);
		assert.strictEqual(group.getEditorByIndex(2), input3);

		await group.closeEditors({ direction: CloseDirection.LEFT, except: input2 });
		assert.strictEqual(group.count, 2);
		assert.strictEqual(group.getEditorByIndex(0), input2);
		assert.strictEqual(group.getEditorByIndex(1), input3);
	});

	test('closeEditors (direction: left, sticky editor)', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);
		const input3 = createTestFileEditorInput(URI.file('foo/bar3'), TEST_EDITOR_INPUT_ID);

		await group.openEditors([
			{ editor: input1, options: { pinned: true, sticky: true } },
			{ editor: input2, options: { pinned: true } },
			{ editor: input3 }
		]);

		assert.strictEqual(group.count, 3);
		assert.strictEqual(group.stickyCount, 1);
		assert.strictEqual(group.getEditorByIndex(0), input1);
		assert.strictEqual(group.getEditorByIndex(1), input2);
		assert.strictEqual(group.getEditorByIndex(2), input3);

		await group.closeEditors({ direction: CloseDirection.LEFT, except: input2, excludeSticky: true });
		assert.strictEqual(group.count, 3);
		assert.strictEqual(group.stickyCount, 1);
		assert.strictEqual(group.getEditorByIndex(0), input1);
		assert.strictEqual(group.getEditorByIndex(1), input2);
		assert.strictEqual(group.getEditorByIndex(2), input3);

		await group.closeEditors({ direction: CloseDirection.LEFT, except: input2 });
		assert.strictEqual(group.count, 2);
		assert.strictEqual(group.getEditorByIndex(0), input2);
		assert.strictEqual(group.getEditorByIndex(1), input3);
	});

	test('closeAllEditors', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const inputInactive = createTestFileEditorInput(URI.file('foo/bar/inactive'), TEST_EDITOR_INPUT_ID);

		await group.openEditors([
			{ editor: input, options: { pinned: true } },
			{ editor: inputInactive }
		]);

		assert.strictEqual(group.count, 2);
		assert.strictEqual(group.getEditorByIndex(0), input);
		assert.strictEqual(group.getEditorByIndex(1), inputInactive);

		await group.closeAllEditors();
		assert.strictEqual(group.isEmpty, true);
	});

	test('closeAllEditors - dirty editor handling', async () => {
		const [part, instantiationService] = await createPart();
		let closeResult = true;

		const accessor = instantiationService.createInstance(TestServiceAccessor);
		accessor.fileDialogService.setConfirmResult(ConfirmResult.DONT_SAVE);

		const group = part.activeGroup;

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		input1.dirty = true;

		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);

		await group.openEditor(input1);
		await group.openEditor(input2);

		accessor.fileDialogService.setConfirmResult(ConfirmResult.CANCEL);
		closeResult = await group.closeAllEditors();

		assert.strictEqual(closeResult, false);
		assert.ok(!input1.gotDisposed);
		assert.ok(!input2.gotDisposed);

		accessor.fileDialogService.setConfirmResult(ConfirmResult.DONT_SAVE);
		closeResult = await group.closeAllEditors();

		assert.strictEqual(closeResult, true);
		assert.ok(input1.gotDisposed);
		assert.ok(input2.gotDisposed);
	});

	test('closeAllEditors (sticky editor)', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const inputInactive = createTestFileEditorInput(URI.file('foo/bar/inactive'), TEST_EDITOR_INPUT_ID);

		await group.openEditors([
			{ editor: input, options: { pinned: true, sticky: true } },
			{ editor: inputInactive }
		]);

		assert.strictEqual(group.count, 2);
		assert.strictEqual(group.stickyCount, 1);

		await group.closeAllEditors({ excludeSticky: true });

		assert.strictEqual(group.count, 1);
		assert.strictEqual(group.stickyCount, 1);
		assert.strictEqual(group.getEditorByIndex(0), input);

		await group.closeAllEditors();

		assert.strictEqual(group.isEmpty, true);
	});

	test('moveEditor (same group)', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const inputInactive = createTestFileEditorInput(URI.file('foo/bar/inactive'), TEST_EDITOR_INPUT_ID);

		const moveEvents: IGroupModelChangeEvent[] = [];
		const editorGroupModelChangeListener = group.onDidModelChange(e => {
			if (e.kind === GroupModelChangeKind.EDITOR_MOVE) {
				assert.ok(e.editor);
				moveEvents.push(e);
			}
		});

		await group.openEditors([{ editor: input, options: { pinned: true } }, { editor: inputInactive }]);
		assert.strictEqual(group.count, 2);
		assert.strictEqual(group.getEditorByIndex(0), input);
		assert.strictEqual(group.getEditorByIndex(1), inputInactive);
		group.moveEditor(inputInactive, group, { index: 0 });
		assert.strictEqual(moveEvents.length, 1);
		assert.strictEqual((moveEvents[0] as IGroupEditorOpenEvent).editorIndex, 0);
		assert.strictEqual((moveEvents[0] as IGroupEditorMoveEvent).oldEditorIndex, 1);
		assert.strictEqual(moveEvents[0].editor, inputInactive);
		assert.strictEqual(group.getEditorByIndex(0), inputInactive);
		assert.strictEqual(group.getEditorByIndex(1), input);

		const res = group.moveEditors([{ editor: inputInactive, options: { index: 1 } }], group);
		assert.strictEqual(res, true);
		assert.strictEqual(moveEvents.length, 2);
		assert.strictEqual((moveEvents[1] as IGroupEditorOpenEvent).editorIndex, 1);
		assert.strictEqual((moveEvents[1] as IGroupEditorMoveEvent).oldEditorIndex, 0);
		assert.strictEqual(moveEvents[1].editor, inputInactive);
		assert.strictEqual(group.getEditorByIndex(0), input);
		assert.strictEqual(group.getEditorByIndex(1), inputInactive);

		editorGroupModelChangeListener.dispose();
	});

	test('moveEditor (across groups)', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const rightGroup = part.addGroup(group, GroupDirection.RIGHT);

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const inputInactive = createTestFileEditorInput(URI.file('foo/bar/inactive'), TEST_EDITOR_INPUT_ID);

		await group.openEditors([{ editor: input, options: { pinned: true } }, { editor: inputInactive }]);
		assert.strictEqual(group.count, 2);
		assert.strictEqual(group.getEditorByIndex(0), input);
		assert.strictEqual(group.getEditorByIndex(1), inputInactive);
		group.moveEditor(inputInactive, rightGroup, { index: 0 });
		assert.strictEqual(group.count, 1);
		assert.strictEqual(group.getEditorByIndex(0), input);
		assert.strictEqual(rightGroup.count, 1);
		assert.strictEqual(rightGroup.getEditorByIndex(0), inputInactive);
	});

	test('moveEditors (across groups)', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const rightGroup = part.addGroup(group, GroupDirection.RIGHT);

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);
		const input3 = createTestFileEditorInput(URI.file('foo/bar3'), TEST_EDITOR_INPUT_ID);

		await group.openEditors([{ editor: input1, options: { pinned: true } }, { editor: input2, options: { pinned: true } }, { editor: input3, options: { pinned: true } }]);
		assert.strictEqual(group.getEditorByIndex(0), input1);
		assert.strictEqual(group.getEditorByIndex(1), input2);
		assert.strictEqual(group.getEditorByIndex(2), input3);
		group.moveEditors([{ editor: input2 }, { editor: input3 }], rightGroup);
		assert.strictEqual(group.count, 1);
		assert.strictEqual(rightGroup.count, 2);
		assert.strictEqual(group.getEditorByIndex(0), input1);
		assert.strictEqual(rightGroup.getEditorByIndex(0), input2);
		assert.strictEqual(rightGroup.getEditorByIndex(1), input3);
	});

	test('copyEditor (across groups)', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const rightGroup = part.addGroup(group, GroupDirection.RIGHT);

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const inputInactive = createTestFileEditorInput(URI.file('foo/bar/inactive'), TEST_EDITOR_INPUT_ID);

		await group.openEditors([{ editor: input, options: { pinned: true } }, { editor: inputInactive }]);
		assert.strictEqual(group.count, 2);
		assert.strictEqual(group.getEditorByIndex(0), input);
		assert.strictEqual(group.getEditorByIndex(1), inputInactive);
		group.copyEditor(inputInactive, rightGroup, { index: 0 });
		assert.strictEqual(group.count, 2);
		assert.strictEqual(group.getEditorByIndex(0), input);
		assert.strictEqual(group.getEditorByIndex(1), inputInactive);
		assert.strictEqual(rightGroup.count, 1);
		assert.strictEqual(rightGroup.getEditorByIndex(0), inputInactive);
	});

	test('copyEditors (across groups)', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const rightGroup = part.addGroup(group, GroupDirection.RIGHT);

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);
		const input3 = createTestFileEditorInput(URI.file('foo/bar3'), TEST_EDITOR_INPUT_ID);

		await group.openEditors([{ editor: input1, options: { pinned: true } }, { editor: input2, options: { pinned: true } }, { editor: input3, options: { pinned: true } }]);
		assert.strictEqual(group.getEditorByIndex(0), input1);
		assert.strictEqual(group.getEditorByIndex(1), input2);
		assert.strictEqual(group.getEditorByIndex(2), input3);
		group.copyEditors([{ editor: input1 }, { editor: input2 }, { editor: input3 }], rightGroup);
		[group, rightGroup].forEach(group => {
			assert.strictEqual(group.getEditorByIndex(0), input1);
			assert.strictEqual(group.getEditorByIndex(1), input2);
			assert.strictEqual(group.getEditorByIndex(2), input3);
		});
	});

	test('replaceEditors', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const inputInactive = createTestFileEditorInput(URI.file('foo/bar/inactive'), TEST_EDITOR_INPUT_ID);

		await group.openEditor(input);
		assert.strictEqual(group.count, 1);
		assert.strictEqual(group.getEditorByIndex(0), input);

		await group.replaceEditors([{ editor: input, replacement: inputInactive }]);
		assert.strictEqual(group.count, 1);
		assert.strictEqual(group.getEditorByIndex(0), inputInactive);
	});

	test('replaceEditors - dirty editor handling', async () => {
		const [part, instantiationService] = await createPart();

		const accessor = instantiationService.createInstance(TestServiceAccessor);
		accessor.fileDialogService.setConfirmResult(ConfirmResult.DONT_SAVE);

		const group = part.activeGroup;

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		input1.dirty = true;

		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);

		await group.openEditor(input1);
		assert.strictEqual(group.activeEditor, input1);

		accessor.fileDialogService.setConfirmResult(ConfirmResult.CANCEL);
		await group.replaceEditors([{ editor: input1, replacement: input2 }]);

		assert.strictEqual(group.activeEditor, input1);
		assert.ok(!input1.gotDisposed);

		accessor.fileDialogService.setConfirmResult(ConfirmResult.DONT_SAVE);
		await group.replaceEditors([{ editor: input1, replacement: input2 }]);

		assert.strictEqual(group.activeEditor, input2);
		assert.ok(input1.gotDisposed);
	});

	test('replaceEditors - forceReplaceDirty flag', async () => {
		const [part, instantiationService] = await createPart();

		const accessor = instantiationService.createInstance(TestServiceAccessor);
		accessor.fileDialogService.setConfirmResult(ConfirmResult.DONT_SAVE);

		const group = part.activeGroup;

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		input1.dirty = true;

		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);

		await group.openEditor(input1);
		assert.strictEqual(group.activeEditor, input1);
		accessor.fileDialogService.setConfirmResult(ConfirmResult.CANCEL);
		await group.replaceEditors([{ editor: input1, replacement: input2, forceReplaceDirty: false }]);

		assert.strictEqual(group.activeEditor, input1);
		assert.ok(!input1.gotDisposed);

		await group.replaceEditors([{ editor: input1, replacement: input2, forceReplaceDirty: true }]);

		assert.strictEqual(group.activeEditor, input2);
		assert.ok(input1.gotDisposed);
	});

	test('replaceEditors - proper index handling', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);
		const input3 = createTestFileEditorInput(URI.file('foo/bar3'), TEST_EDITOR_INPUT_ID);
		const input4 = createTestFileEditorInput(URI.file('foo/bar4'), TEST_EDITOR_INPUT_ID);
		const input5 = createTestFileEditorInput(URI.file('foo/bar5'), TEST_EDITOR_INPUT_ID);

		const input6 = createTestFileEditorInput(URI.file('foo/bar6'), TEST_EDITOR_INPUT_ID);
		const input7 = createTestFileEditorInput(URI.file('foo/bar7'), TEST_EDITOR_INPUT_ID);
		const input8 = createTestFileEditorInput(URI.file('foo/bar8'), TEST_EDITOR_INPUT_ID);

		await group.openEditor(input1, { pinned: true });
		await group.openEditor(input2, { pinned: true });
		await group.openEditor(input3, { pinned: true });
		await group.openEditor(input4, { pinned: true });
		await group.openEditor(input5, { pinned: true });

		await group.replaceEditors([
			{ editor: input1, replacement: input6 },
			{ editor: input3, replacement: input7 },
			{ editor: input5, replacement: input8 }
		]);

		assert.strictEqual(group.getEditorByIndex(0), input6);
		assert.strictEqual(group.getEditorByIndex(1), input2);
		assert.strictEqual(group.getEditorByIndex(2), input7);
		assert.strictEqual(group.getEditorByIndex(3), input4);
		assert.strictEqual(group.getEditorByIndex(4), input8);
	});

	test('replaceEditors - should be able to replace when side by side editor is involved with same input side by side', async () => {
		const [part, instantiationService] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const sideBySideInput = instantiationService.createInstance(SideBySideEditorInput, undefined, undefined, input, input);

		await group.openEditor(input);
		assert.strictEqual(group.count, 1);
		assert.strictEqual(group.getEditorByIndex(0), input);

		await group.replaceEditors([{ editor: input, replacement: sideBySideInput }]);
		assert.strictEqual(group.count, 1);
		assert.strictEqual(group.getEditorByIndex(0), sideBySideInput);

		await group.replaceEditors([{ editor: sideBySideInput, replacement: input }]);
		assert.strictEqual(group.count, 1);
		assert.strictEqual(group.getEditorByIndex(0), input);
	});

	test('find editors', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		const group2 = part.addGroup(group, GroupDirection.RIGHT);
		assert.strictEqual(group.isEmpty, true);

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar1'), `${TEST_EDITOR_INPUT_ID}-1`);
		const input3 = createTestFileEditorInput(URI.file('foo/bar3'), TEST_EDITOR_INPUT_ID);
		const input4 = createTestFileEditorInput(URI.file('foo/bar4'), TEST_EDITOR_INPUT_ID);
		const input5 = createTestFileEditorInput(URI.file('foo/bar4'), `${TEST_EDITOR_INPUT_ID}-1`);

		await group.openEditor(input1, { pinned: true });
		await group.openEditor(input2, { pinned: true });
		await group.openEditor(input3, { pinned: true });
		await group.openEditor(input4, { pinned: true });
		await group2.openEditor(input5, { pinned: true });

		let foundEditors = group.findEditors(URI.file('foo/bar1'));
		assert.strictEqual(foundEditors.length, 2);
		foundEditors = group2.findEditors(URI.file('foo/bar4'));
		assert.strictEqual(foundEditors.length, 1);
	});

	test('find editors (side by side support)', async () => {
		const [part, instantiationService] = await createPart();

		const accessor = instantiationService.createInstance(TestServiceAccessor);

		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const secondaryInput = createTestFileEditorInput(URI.file('foo/bar-secondary'), TEST_EDITOR_INPUT_ID);
		const primaryInput = createTestFileEditorInput(URI.file('foo/bar-primary'), `${TEST_EDITOR_INPUT_ID}-1`);

		const sideBySideEditor = new SideBySideEditorInput(undefined, undefined, secondaryInput, primaryInput, accessor.editorService);
		await group.openEditor(sideBySideEditor, { pinned: true });

		let foundEditors = group.findEditors(URI.file('foo/bar-secondary'));
		assert.strictEqual(foundEditors.length, 0);

		foundEditors = group.findEditors(URI.file('foo/bar-secondary'), { supportSideBySide: SideBySideEditor.PRIMARY });
		assert.strictEqual(foundEditors.length, 0);

		foundEditors = group.findEditors(URI.file('foo/bar-primary'), { supportSideBySide: SideBySideEditor.PRIMARY });
		assert.strictEqual(foundEditors.length, 1);

		foundEditors = group.findEditors(URI.file('foo/bar-secondary'), { supportSideBySide: SideBySideEditor.SECONDARY });
		assert.strictEqual(foundEditors.length, 1);

		foundEditors = group.findEditors(URI.file('foo/bar-primary'), { supportSideBySide: SideBySideEditor.SECONDARY });
		assert.strictEqual(foundEditors.length, 0);

		foundEditors = group.findEditors(URI.file('foo/bar-secondary'), { supportSideBySide: SideBySideEditor.ANY });
		assert.strictEqual(foundEditors.length, 1);

		foundEditors = group.findEditors(URI.file('foo/bar-primary'), { supportSideBySide: SideBySideEditor.ANY });
		assert.strictEqual(foundEditors.length, 1);
	});

	test('find neighbour group (left/right)', async function () {
		const [part] = await createPart();
		const rootGroup = part.activeGroup;
		const rightGroup = part.addGroup(rootGroup, GroupDirection.RIGHT);

		assert.strictEqual(rightGroup, part.findGroup({ direction: GroupDirection.RIGHT }, rootGroup));
		assert.strictEqual(rootGroup, part.findGroup({ direction: GroupDirection.LEFT }, rightGroup));
	});

	test('find neighbour group (up/down)', async function () {
		const [part] = await createPart();
		const rootGroup = part.activeGroup;
		const downGroup = part.addGroup(rootGroup, GroupDirection.DOWN);

		assert.strictEqual(downGroup, part.findGroup({ direction: GroupDirection.DOWN }, rootGroup));
		assert.strictEqual(rootGroup, part.findGroup({ direction: GroupDirection.UP }, downGroup));
	});

	test('find group by location (left/right)', async function () {
		const [part] = await createPart();
		const rootGroup = part.activeGroup;
		const rightGroup = part.addGroup(rootGroup, GroupDirection.RIGHT);
		const downGroup = part.addGroup(rightGroup, GroupDirection.DOWN);

		assert.strictEqual(rootGroup, part.findGroup({ location: GroupLocation.FIRST }));
		assert.strictEqual(downGroup, part.findGroup({ location: GroupLocation.LAST }));

		assert.strictEqual(rightGroup, part.findGroup({ location: GroupLocation.NEXT }, rootGroup));
		assert.strictEqual(rootGroup, part.findGroup({ location: GroupLocation.PREVIOUS }, rightGroup));

		assert.strictEqual(downGroup, part.findGroup({ location: GroupLocation.NEXT }, rightGroup));
		assert.strictEqual(rightGroup, part.findGroup({ location: GroupLocation.PREVIOUS }, downGroup));
	});

	test('applyLayout (2x2)', async function () {
		const [part] = await createPart();

		part.applyLayout({ groups: [{ groups: [{}, {}] }, { groups: [{}, {}] }], orientation: GroupOrientation.HORIZONTAL });

		assert.strictEqual(part.groups.length, 4);
	});

	test('getLayout', async function () {
		const [part] = await createPart();

		// 2x2
		part.applyLayout({ groups: [{ groups: [{}, {}] }, { groups: [{}, {}] }], orientation: GroupOrientation.HORIZONTAL });
		let layout = part.getLayout();

		assert.strictEqual(layout.orientation, GroupOrientation.HORIZONTAL);
		assert.strictEqual(layout.groups.length, 2);
		assert.strictEqual(layout.groups[0].groups!.length, 2);
		assert.strictEqual(layout.groups[1].groups!.length, 2);

		// 3 columns
		part.applyLayout({ groups: [{}, {}, {}], orientation: GroupOrientation.VERTICAL });
		layout = part.getLayout();

		assert.strictEqual(layout.orientation, GroupOrientation.VERTICAL);
		assert.strictEqual(layout.groups.length, 3);
		assert.ok(typeof layout.groups[0].size === 'number');
		assert.ok(typeof layout.groups[1].size === 'number');
		assert.ok(typeof layout.groups[2].size === 'number');
	});

	test('centeredLayout', async function () {
		const [part] = await createPart();

		part.centerLayout(true);

		assert.strictEqual(part.isLayoutCentered(), true);
	});

	test('sticky editors', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;

		assert.strictEqual(group.stickyCount, 0);
		assert.strictEqual(group.getEditors(EditorsOrder.SEQUENTIAL).length, 0);
		assert.strictEqual(group.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE).length, 0);
		assert.strictEqual(group.getEditors(EditorsOrder.SEQUENTIAL, { excludeSticky: true }).length, 0);
		assert.strictEqual(group.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE, { excludeSticky: true }).length, 0);

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const inputInactive = createTestFileEditorInput(URI.file('foo/bar/inactive'), TEST_EDITOR_INPUT_ID);

		await group.openEditor(input, { pinned: true });
		await group.openEditor(inputInactive, { inactive: true });

		assert.strictEqual(group.stickyCount, 0);
		assert.strictEqual(group.isSticky(input), false);
		assert.strictEqual(group.isSticky(inputInactive), false);

		assert.strictEqual(group.getEditors(EditorsOrder.SEQUENTIAL).length, 2);
		assert.strictEqual(group.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE).length, 2);
		assert.strictEqual(group.getEditors(EditorsOrder.SEQUENTIAL, { excludeSticky: true }).length, 2);
		assert.strictEqual(group.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE, { excludeSticky: true }).length, 2);

		group.stickEditor(input);

		assert.strictEqual(group.stickyCount, 1);
		assert.strictEqual(group.isSticky(input), true);
		assert.strictEqual(group.isSticky(inputInactive), false);

		assert.strictEqual(group.getEditors(EditorsOrder.SEQUENTIAL).length, 2);
		assert.strictEqual(group.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE).length, 2);
		assert.strictEqual(group.getEditors(EditorsOrder.SEQUENTIAL, { excludeSticky: true }).length, 1);
		assert.strictEqual(group.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE, { excludeSticky: true }).length, 1);

		group.unstickEditor(input);

		assert.strictEqual(group.stickyCount, 0);
		assert.strictEqual(group.isSticky(input), false);
		assert.strictEqual(group.isSticky(inputInactive), false);

		assert.strictEqual(group.getIndexOfEditor(input), 0);
		assert.strictEqual(group.getIndexOfEditor(inputInactive), 1);

		assert.strictEqual(group.getEditors(EditorsOrder.SEQUENTIAL).length, 2);
		assert.strictEqual(group.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE).length, 2);
		assert.strictEqual(group.getEditors(EditorsOrder.SEQUENTIAL, { excludeSticky: true }).length, 2);
		assert.strictEqual(group.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE, { excludeSticky: true }).length, 2);

		let editorMoveCounter = 0;
		const editorGroupModelChangeListener = group.onDidModelChange(e => {
			if (e.kind === GroupModelChangeKind.EDITOR_MOVE) {
				assert.ok(e.editor);
				editorMoveCounter++;
			}
		});

		group.stickEditor(inputInactive);

		assert.strictEqual(group.stickyCount, 1);
		assert.strictEqual(group.isSticky(input), false);
		assert.strictEqual(group.isSticky(inputInactive), true);

		assert.strictEqual(group.getIndexOfEditor(input), 1);
		assert.strictEqual(group.getIndexOfEditor(inputInactive), 0);
		assert.strictEqual(editorMoveCounter, 1);

		assert.strictEqual(group.getEditors(EditorsOrder.SEQUENTIAL).length, 2);
		assert.strictEqual(group.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE).length, 2);
		assert.strictEqual(group.getEditors(EditorsOrder.SEQUENTIAL, { excludeSticky: true }).length, 1);
		assert.strictEqual(group.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE, { excludeSticky: true }).length, 1);

		const inputSticky = createTestFileEditorInput(URI.file('foo/bar/sticky'), TEST_EDITOR_INPUT_ID);

		await group.openEditor(inputSticky, { sticky: true });

		assert.strictEqual(group.stickyCount, 2);
		assert.strictEqual(group.isSticky(input), false);
		assert.strictEqual(group.isSticky(inputInactive), true);
		assert.strictEqual(group.isSticky(inputSticky), true);

		assert.strictEqual(group.getIndexOfEditor(inputInactive), 0);
		assert.strictEqual(group.getIndexOfEditor(inputSticky), 1);
		assert.strictEqual(group.getIndexOfEditor(input), 2);

		await group.openEditor(input, { sticky: true });

		assert.strictEqual(group.stickyCount, 3);
		assert.strictEqual(group.isSticky(input), true);
		assert.strictEqual(group.isSticky(inputInactive), true);
		assert.strictEqual(group.isSticky(inputSticky), true);

		assert.strictEqual(group.getIndexOfEditor(inputInactive), 0);
		assert.strictEqual(group.getIndexOfEditor(inputSticky), 1);
		assert.strictEqual(group.getIndexOfEditor(input), 2);

		editorGroupModelChangeListener.dispose();
	});

	test('sticky: true wins over index', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;

		assert.strictEqual(group.stickyCount, 0);

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const inputInactive = createTestFileEditorInput(URI.file('foo/bar/inactive'), TEST_EDITOR_INPUT_ID);
		const inputSticky = createTestFileEditorInput(URI.file('foo/bar/sticky'), TEST_EDITOR_INPUT_ID);

		await group.openEditor(input, { pinned: true });
		await group.openEditor(inputInactive, { inactive: true });
		await group.openEditor(inputSticky, { sticky: true, index: 2 });

		assert.strictEqual(group.stickyCount, 1);
		assert.strictEqual(group.isSticky(inputSticky), true);

		assert.strictEqual(group.getIndexOfEditor(input), 1);
		assert.strictEqual(group.getIndexOfEditor(inputInactive), 2);
		assert.strictEqual(group.getIndexOfEditor(inputSticky), 0);
	});

	test('selection: setSelection, isSelected, selectedEditors', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;

		const input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);
		const input3 = createTestFileEditorInput(URI.file('foo/bar3'), TEST_EDITOR_INPUT_ID);

		function isSelection(inputs: TestFileEditorInput[]): boolean {
			for (const input of inputs) {
				if (group.selectedEditors.indexOf(input) === -1) {
					return false;
				}
			}
			return inputs.length === group.selectedEditors.length;
		}

		// Active: input1, Selected: input1
		await group.openEditors([input1, input2, input3].map(editor => ({ editor, options: { pinned: true } })));

		assert.strictEqual(group.isActive(input1), true);
		assert.strictEqual(group.isSelected(input1), true);
		assert.strictEqual(group.isSelected(input2), false);
		assert.strictEqual(group.isSelected(input3), false);

		assert.strictEqual(isSelection([input1]), true);

		// Active: input1, Selected: input1, input3
		await group.setSelection(input1, [input3]);

		assert.strictEqual(group.isActive(input1), true);
		assert.strictEqual(group.isSelected(input1), true);
		assert.strictEqual(group.isSelected(input2), false);
		assert.strictEqual(group.isSelected(input3), true);

		assert.strictEqual(isSelection([input1, input3]), true);

		// Active: input2, Selected: input1, input3
		await group.setSelection(input2, [input1, input3]);

		assert.strictEqual(group.isSelected(input1), true);
		assert.strictEqual(group.isActive(input2), true);
		assert.strictEqual(group.isSelected(input2), true);
		assert.strictEqual(group.isSelected(input3), true);

		assert.strictEqual(isSelection([input1, input2, input3]), true);

		await group.setSelection(input1, []);

		// Selected: input3
		assert.strictEqual(group.isActive(input1), true);
		assert.strictEqual(group.isSelected(input1), true);
		assert.strictEqual(group.isSelected(input2), false);
		assert.strictEqual(group.isSelected(input3), false);

		assert.strictEqual(isSelection([input1]), true);
	});

	test('moveEditor with context (across groups)', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const rightGroup = part.addGroup(group, GroupDirection.RIGHT);

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const inputInactive = createTestFileEditorInput(URI.file('foo/bar/inactive'), TEST_EDITOR_INPUT_ID);
		const thirdInput = createTestFileEditorInput(URI.file('foo/bar/third'), TEST_EDITOR_INPUT_ID);

		let leftFiredCount = 0;
		const leftGroupListener = group.onWillMoveEditor(() => {
			leftFiredCount++;
		});

		let rightFiredCount = 0;
		const rightGroupListener = rightGroup.onWillMoveEditor(() => {
			rightFiredCount++;
		});

		await group.openEditors([{ editor: input, options: { pinned: true } }, { editor: inputInactive }, { editor: thirdInput }]);
		assert.strictEqual(leftFiredCount, 0);
		assert.strictEqual(rightFiredCount, 0);

		let result = group.moveEditor(input, rightGroup);
		assert.strictEqual(result, true);
		assert.strictEqual(leftFiredCount, 1);
		assert.strictEqual(rightFiredCount, 0);

		result = group.moveEditor(inputInactive, rightGroup);
		assert.strictEqual(result, true);
		assert.strictEqual(leftFiredCount, 2);
		assert.strictEqual(rightFiredCount, 0);

		result = rightGroup.moveEditor(inputInactive, group);
		assert.strictEqual(result, true);
		assert.strictEqual(leftFiredCount, 2);
		assert.strictEqual(rightFiredCount, 1);

		leftGroupListener.dispose();
		rightGroupListener.dispose();
	});

	test('moveEditor disabled', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const rightGroup = part.addGroup(group, GroupDirection.RIGHT);

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const inputInactive = createTestFileEditorInput(URI.file('foo/bar/inactive'), TEST_EDITOR_INPUT_ID);
		const thirdInput = createTestFileEditorInput(URI.file('foo/bar/third'), TEST_EDITOR_INPUT_ID);

		await group.openEditors([{ editor: input, options: { pinned: true } }, { editor: inputInactive }, { editor: thirdInput }]);

		input.setMoveDisabled('disabled');
		const result = group.moveEditor(input, rightGroup);

		assert.strictEqual(result, false);
		assert.strictEqual(group.count, 3);
	});

	test('onWillOpenEditor', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const rightGroup = part.addGroup(group, GroupDirection.RIGHT);

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const secondInput = createTestFileEditorInput(URI.file('foo/bar/second'), TEST_EDITOR_INPUT_ID);
		const thirdInput = createTestFileEditorInput(URI.file('foo/bar/third'), TEST_EDITOR_INPUT_ID);

		let leftFiredCount = 0;
		const leftGroupListener = group.onWillOpenEditor(() => {
			leftFiredCount++;
		});

		let rightFiredCount = 0;
		const rightGroupListener = rightGroup.onWillOpenEditor(() => {
			rightFiredCount++;
		});

		await group.openEditor(input);
		assert.strictEqual(leftFiredCount, 1);
		assert.strictEqual(rightFiredCount, 0);

		rightGroup.openEditor(secondInput);
		assert.strictEqual(leftFiredCount, 1);
		assert.strictEqual(rightFiredCount, 1);

		group.openEditor(thirdInput);
		assert.strictEqual(leftFiredCount, 2);
		assert.strictEqual(rightFiredCount, 1);

		// Ensure move fires the open event too
		rightGroup.moveEditor(secondInput, group);
		assert.strictEqual(leftFiredCount, 3);
		assert.strictEqual(rightFiredCount, 1);

		leftGroupListener.dispose();
		rightGroupListener.dispose();
	});

	test('copyEditor with context (across groups)', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);
		let firedCount = 0;
		const moveListener = group.onWillMoveEditor(() => firedCount++);

		const rightGroup = part.addGroup(group, GroupDirection.RIGHT);
		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const inputInactive = createTestFileEditorInput(URI.file('foo/bar/inactive'), TEST_EDITOR_INPUT_ID);
		await group.openEditors([{ editor: input, options: { pinned: true } }, { editor: inputInactive }]);
		assert.strictEqual(firedCount, 0);

		group.copyEditor(inputInactive, rightGroup, { index: 0 });

		assert.strictEqual(firedCount, 0);
		moveListener.dispose();
	});

	test('locked groups - basics', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;

		const rightGroup = part.addGroup(group, GroupDirection.RIGHT);

		let leftFiredCountFromPart = 0;
		let rightFiredCountFromPart = 0;
		const partListener = part.onDidChangeGroupLocked(g => {
			if (g === group) {
				leftFiredCountFromPart++;
			} else if (g === rightGroup) {
				rightFiredCountFromPart++;
			}
		});

		let leftFiredCountFromGroup = 0;
		const leftGroupListener = group.onDidModelChange(e => {
			if (e.kind === GroupModelChangeKind.GROUP_LOCKED) {
				leftFiredCountFromGroup++;
			}
		});

		let rightFiredCountFromGroup = 0;
		const rightGroupListener = rightGroup.onDidModelChange(e => {
			if (e.kind === GroupModelChangeKind.GROUP_LOCKED) {
				rightFiredCountFromGroup++;
			}
		});

		rightGroup.lock(true);
		rightGroup.lock(true);

		assert.strictEqual(leftFiredCountFromGroup, 0);
		assert.strictEqual(leftFiredCountFromPart, 0);
		assert.strictEqual(rightFiredCountFromGroup, 1);
		assert.strictEqual(rightFiredCountFromPart, 1);

		rightGroup.lock(false);
		rightGroup.lock(false);

		assert.strictEqual(leftFiredCountFromGroup, 0);
		assert.strictEqual(leftFiredCountFromPart, 0);
		assert.strictEqual(rightFiredCountFromGroup, 2);
		assert.strictEqual(rightFiredCountFromPart, 2);

		group.lock(true);
		group.lock(true);

		assert.strictEqual(leftFiredCountFromGroup, 1);
		assert.strictEqual(leftFiredCountFromPart, 1);
		assert.strictEqual(rightFiredCountFromGroup, 2);
		assert.strictEqual(rightFiredCountFromPart, 2);

		group.lock(false);
		group.lock(false);

		assert.strictEqual(leftFiredCountFromGroup, 2);
		assert.strictEqual(leftFiredCountFromPart, 2);
		assert.strictEqual(rightFiredCountFromGroup, 2);
		assert.strictEqual(rightFiredCountFromPart, 2);

		partListener.dispose();
		leftGroupListener.dispose();
		rightGroupListener.dispose();
	});

	test('locked groups - single group is can be locked', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;

		group.lock(true);
		assert.strictEqual(group.isLocked, true);

		const rightGroup = part.addGroup(group, GroupDirection.RIGHT);
		rightGroup.lock(true);

		assert.strictEqual(rightGroup.isLocked, true);

		part.removeGroup(group);
		assert.strictEqual(rightGroup.isLocked, true);

		const rightGroup2 = part.addGroup(rightGroup, GroupDirection.RIGHT);
		rightGroup.lock(true);
		rightGroup2.lock(true);

		assert.strictEqual(rightGroup.isLocked, true);
		assert.strictEqual(rightGroup2.isLocked, true);

		part.removeGroup(rightGroup2);

		assert.strictEqual(rightGroup.isLocked, true);
	});

	test('locked groups - auto locking via setting', async () => {
		const instantiationService = workbenchInstantiationService(undefined, disposables);
		const configurationService = new TestConfigurationService();
		await configurationService.setUserConfiguration('workbench', { 'editor': { 'autoLockGroups': { 'testEditorInputForEditorGroupService': true } } });
		instantiationService.stub(IConfigurationService, configurationService);

		const [part] = await createPart(instantiationService);

		const rootGroup = part.activeGroup;
		let rightGroup = part.addGroup(rootGroup, GroupDirection.RIGHT);

		let input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		let input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);

		// First editor opens in right group: Locked=true
		await rightGroup.openEditor(input1, { pinned: true });
		assert.strictEqual(rightGroup.isLocked, true);

		// Second editors opens in now unlocked right group: Locked=false
		rightGroup.lock(false);
		await rightGroup.openEditor(input2, { pinned: true });
		assert.strictEqual(rightGroup.isLocked, false);

		//First editor opens in root group without other groups being opened: Locked=false
		await rightGroup.closeAllEditors();
		part.removeGroup(rightGroup);
		await rootGroup.closeAllEditors();

		input1 = createTestFileEditorInput(URI.file('foo/bar1'), TEST_EDITOR_INPUT_ID);
		input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);

		await rootGroup.openEditor(input1, { pinned: true });
		assert.strictEqual(rootGroup.isLocked, false);
		rightGroup = part.addGroup(rootGroup, GroupDirection.RIGHT);
		assert.strictEqual(rootGroup.isLocked, false);
		const leftGroup = part.addGroup(rootGroup, GroupDirection.LEFT);
		assert.strictEqual(rootGroup.isLocked, false);
		part.removeGroup(leftGroup);
		assert.strictEqual(rootGroup.isLocked, false);
	});

	test('maximize editor group', async () => {
		const instantiationService = workbenchInstantiationService(undefined, disposables);
		const [part] = await createPart(instantiationService);

		const rootGroup = part.activeGroup;
		const editorPartSize = part.getSize(rootGroup);

		// If there is only one group, it should not be considered maximized
		assert.strictEqual(part.hasMaximizedGroup(), false);

		const rightGroup = part.addGroup(rootGroup, GroupDirection.RIGHT);
		const rightBottomGroup = part.addGroup(rightGroup, GroupDirection.DOWN);

		const sizeRootGroup = part.getSize(rootGroup);
		const sizeRightGroup = part.getSize(rightGroup);
		const sizeRightBottomGroup = part.getSize(rightBottomGroup);

		let maximizedValue;
		const maxiizeGroupEventDisposable = part.onDidChangeGroupMaximized((maximized) => {
			maximizedValue = maximized;
		});

		assert.strictEqual(part.hasMaximizedGroup(), false);

		part.arrangeGroups(GroupsArrangement.MAXIMIZE, rootGroup);

		assert.strictEqual(part.hasMaximizedGroup(), true);

		// getSize()
		assert.deepStrictEqual(part.getSize(rootGroup), editorPartSize);
		assert.deepStrictEqual(part.getSize(rightGroup), { width: 0, height: 0 });
		assert.deepStrictEqual(part.getSize(rightBottomGroup), { width: 0, height: 0 });

		assert.deepStrictEqual(maximizedValue, true);

		part.toggleMaximizeGroup();

		assert.strictEqual(part.hasMaximizedGroup(), false);

		// Size is restored
		assert.deepStrictEqual(part.getSize(rootGroup), sizeRootGroup);
		assert.deepStrictEqual(part.getSize(rightGroup), sizeRightGroup);
		assert.deepStrictEqual(part.getSize(rightBottomGroup), sizeRightBottomGroup);

		assert.deepStrictEqual(maximizedValue, false);
		maxiizeGroupEventDisposable.dispose();
	});

	test('transient editors - basics', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const inputTransient = createTestFileEditorInput(URI.file('foo/bar/inactive'), TEST_EDITOR_INPUT_ID);

		await group.openEditor(input, { pinned: true });
		await group.openEditor(inputTransient, { transient: true });

		assert.strictEqual(group.isTransient(input), false);
		assert.strictEqual(group.isTransient(inputTransient), true);

		await group.openEditor(input, { pinned: true });
		await group.openEditor(inputTransient, { transient: true });

		assert.strictEqual(group.isTransient(inputTransient), true);

		await group.openEditor(inputTransient, { transient: false });
		assert.strictEqual(group.isTransient(inputTransient), false);

		await group.openEditor(inputTransient, { transient: true });
		assert.strictEqual(group.isTransient(inputTransient), false); // cannot make a non-transient editor transient when already opened
	});

	test('transient editors - pinning clears transient', async () => {
		const [part] = await createPart();
		const group = part.activeGroup;

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const inputTransient = createTestFileEditorInput(URI.file('foo/bar/inactive'), TEST_EDITOR_INPUT_ID);

		await group.openEditor(input, { pinned: true });
		await group.openEditor(inputTransient, { transient: true });

		assert.strictEqual(group.isTransient(input), false);
		assert.strictEqual(group.isTransient(inputTransient), true);

		await group.openEditor(input, { pinned: true });
		await group.openEditor(inputTransient, { pinned: true, transient: true });

		assert.strictEqual(group.isTransient(inputTransient), false);
	});

	test('transient editors - overrides enablePreview setting', async function () {
		const instantiationService = workbenchInstantiationService(undefined, disposables);
		const configurationService = new TestConfigurationService();
		await configurationService.setUserConfiguration('workbench', { 'editor': { 'enablePreview': false } });
		instantiationService.stub(IConfigurationService, configurationService);

		const [part] = await createPart(instantiationService);

		const group = part.activeGroup;
		assert.strictEqual(group.isEmpty, true);

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);

		await group.openEditor(input, { pinned: false });
		assert.strictEqual(group.isPinned(input), true);

		await group.openEditor(input2, { transient: true });
		assert.strictEqual(group.isPinned(input2), false);

		group.focus();
		assert.strictEqual(group.isPinned(input2), true);
	});

	test('working sets - create / apply state', async function () {
		const [part] = await createPart();

		const input = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);

		const pane1 = await part.activeGroup.openEditor(input, { pinned: true });
		const pane2 = await part.sideGroup.openEditor(input2, { pinned: true });

		const state = part.createState();

		await pane2?.group.closeAllEditors();
		await pane1?.group.closeAllEditors();

		assert.strictEqual(part.count, 1);
		assert.strictEqual(part.activeGroup.isEmpty, true);

		await part.applyState(state);

		assert.strictEqual(part.count, 2);

		assert.strictEqual(part.groups[0].contains(input), true);
		assert.strictEqual(part.groups[1].contains(input2), true);

		for (const group of part.groups) {
			await group.closeAllEditors();
		}

		const emptyState = part.createState();

		await part.applyState(emptyState);
		assert.strictEqual(part.count, 1);

		const input3 = createTestFileEditorInput(URI.file('foo/bar3'), TEST_EDITOR_INPUT_ID);
		input3.dirty = true;
		await part.activeGroup.openEditor(input3, { pinned: true });

		await part.applyState(emptyState);

		assert.strictEqual(part.count, 1);
		assert.strictEqual(part.groups[0].contains(input3), true); // dirty editors enforce to be there even when state is empty

		await part.applyState('empty');

		assert.strictEqual(part.count, 1);
		assert.strictEqual(part.groups[0].contains(input3), true); // dirty editors enforce to be there even when state is empty

		input3.dirty = false;

		await part.applyState('empty');

		assert.strictEqual(part.count, 1);
		assert.strictEqual(part.activeGroup.isEmpty, true);
	});

	test('context key provider', async function () {
		const disposables = new DisposableStore();

		// Instantiate workbench and setup initial state
		const instantiationService = workbenchInstantiationService({ contextKeyService: instantiationService => instantiationService.createInstance(MockScopableContextKeyService) }, disposables);
		const rootContextKeyService = instantiationService.get(IContextKeyService);

		const [parts] = await createParts(instantiationService);

		const input1 = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);
		const input3 = createTestFileEditorInput(URI.file('foo/bar3'), TEST_EDITOR_INPUT_ID);

		const group1 = parts.activeGroup;
		const group2 = parts.addGroup(group1, GroupDirection.RIGHT);

		await group2.openEditor(input2, { pinned: true });
		await group1.openEditor(input1, { pinned: true });

		// Create context key provider
		const rawContextKey = new RawContextKey<number>('testContextKey', parts.activeGroup.id);
		const contextKeyProvider: IEditorGroupContextKeyProvider<number> = {
			contextKey: rawContextKey,
			getGroupContextKeyValue: (group) => group.id
		};
		disposables.add(parts.registerContextKeyProvider(contextKeyProvider));

		// Initial state: group1 is active
		assert.strictEqual(parts.activeGroup.id, group1.id);

		let globalContextKeyValue = rootContextKeyService.getContextKeyValue(rawContextKey.key);
		let group1ContextKeyValue = group1.scopedContextKeyService.getContextKeyValue(rawContextKey.key);
		let group2ContextKeyValue = group2.scopedContextKeyService.getContextKeyValue(rawContextKey.key);
		assert.strictEqual(globalContextKeyValue, group1.id);
		assert.strictEqual(group1ContextKeyValue, group1.id);
		assert.strictEqual(group2ContextKeyValue, group2.id);

		// Make group2 active and ensure both gloabal and local context key values are updated
		parts.activateGroup(group2);

		globalContextKeyValue = rootContextKeyService.getContextKeyValue(rawContextKey.key);
		group1ContextKeyValue = group1.scopedContextKeyService.getContextKeyValue(rawContextKey.key);
		group2ContextKeyValue = group2.scopedContextKeyService.getContextKeyValue(rawContextKey.key);
		assert.strictEqual(globalContextKeyValue, group2.id);
		assert.strictEqual(group1ContextKeyValue, group1.id);
		assert.strictEqual(group2ContextKeyValue, group2.id);

		// Add a new group and ensure both gloabal and local context key values are updated
		// Group 3 will be active
		const group3 = parts.addGroup(group2, GroupDirection.RIGHT);
		await group3.openEditor(input3, { pinned: true });

		globalContextKeyValue = rootContextKeyService.getContextKeyValue(rawContextKey.key);
		group1ContextKeyValue = group1.scopedContextKeyService.getContextKeyValue(rawContextKey.key);
		group2ContextKeyValue = group2.scopedContextKeyService.getContextKeyValue(rawContextKey.key);
		const group3ContextKeyValue = group3.scopedContextKeyService.getContextKeyValue(rawContextKey.key);
		assert.strictEqual(globalContextKeyValue, group3.id);
		assert.strictEqual(group1ContextKeyValue, group1.id);
		assert.strictEqual(group2ContextKeyValue, group2.id);
		assert.strictEqual(group3ContextKeyValue, group3.id);

		disposables.dispose();
	});

	test('context key provider: onDidChange', async function () {
		const disposables = new DisposableStore();

		// Instantiate workbench and setup initial state
		const instantiationService = workbenchInstantiationService({ contextKeyService: instantiationService => instantiationService.createInstance(MockScopableContextKeyService) }, disposables);
		const rootContextKeyService = instantiationService.get(IContextKeyService);

		const parts = await createEditorParts(instantiationService, disposables);

		const input1 = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);

		const group1 = parts.activeGroup;
		const group2 = parts.addGroup(group1, GroupDirection.RIGHT);

		await group2.openEditor(input2, { pinned: true });
		await group1.openEditor(input1, { pinned: true });

		// Create context key provider
		let offset = 0;
		const _onDidChange = new Emitter<void>();

		const rawContextKey = new RawContextKey<number>('testContextKey', parts.activeGroup.id);
		const contextKeyProvider: IEditorGroupContextKeyProvider<number> = {
			contextKey: rawContextKey,
			getGroupContextKeyValue: (group) => group.id + offset,
			onDidChange: _onDidChange.event
		};
		disposables.add(parts.registerContextKeyProvider(contextKeyProvider));

		// Initial state: group1 is active
		assert.strictEqual(parts.activeGroup.id, group1.id);

		let globalContextKeyValue = rootContextKeyService.getContextKeyValue(rawContextKey.key);
		let group1ContextKeyValue = group1.scopedContextKeyService.getContextKeyValue(rawContextKey.key);
		let group2ContextKeyValue = group2.scopedContextKeyService.getContextKeyValue(rawContextKey.key);
		assert.strictEqual(globalContextKeyValue, group1.id + offset);
		assert.strictEqual(group1ContextKeyValue, group1.id + offset);
		assert.strictEqual(group2ContextKeyValue, group2.id + offset);

		// Make a change to the context key provider and fire onDidChange such that all context key values are updated
		offset = 10;
		_onDidChange.fire();

		globalContextKeyValue = rootContextKeyService.getContextKeyValue(rawContextKey.key);
		group1ContextKeyValue = group1.scopedContextKeyService.getContextKeyValue(rawContextKey.key);
		group2ContextKeyValue = group2.scopedContextKeyService.getContextKeyValue(rawContextKey.key);
		assert.strictEqual(globalContextKeyValue, group1.id + offset);
		assert.strictEqual(group1ContextKeyValue, group1.id + offset);
		assert.strictEqual(group2ContextKeyValue, group2.id + offset);

		disposables.dispose();
	});

	test('context key provider: active editor change', async function () {
		const disposables = new DisposableStore();

		// Instantiate workbench and setup initial state
		const instantiationService = workbenchInstantiationService({ contextKeyService: instantiationService => instantiationService.createInstance(MockScopableContextKeyService) }, disposables);
		const rootContextKeyService = instantiationService.get(IContextKeyService);

		const parts = await createEditorParts(instantiationService, disposables);

		const input1 = createTestFileEditorInput(URI.file('foo/bar'), TEST_EDITOR_INPUT_ID);
		const input2 = createTestFileEditorInput(URI.file('foo/bar2'), TEST_EDITOR_INPUT_ID);

		const group1 = parts.activeGroup;

		await group1.openEditor(input2, { pinned: true });
		await group1.openEditor(input1, { pinned: true });

		// Create context key provider
		const rawContextKey = new RawContextKey<string>('testContextKey', input1.resource.toString());
		const contextKeyProvider: IEditorGroupContextKeyProvider<string> = {
			contextKey: rawContextKey,
			getGroupContextKeyValue: (group) => group.activeEditor?.resource?.toString() ?? '',
		};
		disposables.add(parts.registerContextKeyProvider(contextKeyProvider));

		// Initial state: input1 is active
		assert.strictEqual(isEqual(group1.activeEditor?.resource, input1.resource), true);

		let globalContextKeyValue = rootContextKeyService.getContextKeyValue(rawContextKey.key);
		let group1ContextKeyValue = group1.scopedContextKeyService.getContextKeyValue(rawContextKey.key);
		assert.strictEqual(globalContextKeyValue, input1.resource.toString());
		assert.strictEqual(group1ContextKeyValue, input1.resource.toString());

		// Make input2 active and ensure both gloabal and local context key values are updated
		await group1.openEditor(input2);

		globalContextKeyValue = rootContextKeyService.getContextKeyValue(rawContextKey.key);
		group1ContextKeyValue = group1.scopedContextKeyService.getContextKeyValue(rawContextKey.key);
		assert.strictEqual(globalContextKeyValue, input2.resource.toString());
		assert.strictEqual(group1ContextKeyValue, input2.resource.toString());

		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/editor/test/browser/editorResolverService.test.ts]---
Location: vscode-main/src/vs/workbench/services/editor/test/browser/editorResolverService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { EditorPart } from '../../../../browser/parts/editor/editorPart.js';
import { DiffEditorInput } from '../../../../common/editor/diffEditorInput.js';
import { EditorResolverService } from '../../browser/editorResolverService.js';
import { IEditorGroupsService } from '../../common/editorGroupsService.js';
import { IEditorResolverService, ResolvedStatus, RegisteredEditorPriority } from '../../common/editorResolverService.js';
import { createEditorPart, ITestInstantiationService, TestFileEditorInput, TestServiceAccessor, workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';

suite('EditorResolverService', () => {

	const TEST_EDITOR_INPUT_ID = 'testEditorInputForEditorResolverService';
	const disposables = new DisposableStore();

	teardown(() => disposables.clear());

	ensureNoDisposablesAreLeakedInTestSuite();

	async function createEditorResolverService(instantiationService: ITestInstantiationService = workbenchInstantiationService(undefined, disposables)): Promise<[EditorPart, EditorResolverService, TestServiceAccessor]> {
		const part = await createEditorPart(instantiationService, disposables);
		instantiationService.stub(IEditorGroupsService, part);

		const editorResolverService = instantiationService.createInstance(EditorResolverService);
		instantiationService.stub(IEditorResolverService, editorResolverService);
		disposables.add(editorResolverService);

		return [part, editorResolverService, instantiationService.createInstance(TestServiceAccessor)];
	}

	function constructDisposableFileEditorInput(uri: URI, typeId: string, store: DisposableStore): TestFileEditorInput {
		const editor = new TestFileEditorInput(uri, typeId);
		store.add(editor);
		return editor;
	}

	test('Simple Resolve', async () => {
		const [part, service] = await createEditorResolverService();
		const registeredEditor = service.registerEditor('*.test',
			{
				id: 'TEST_EDITOR',
				label: 'Test Editor Label',
				detail: 'Test Editor Details',
				priority: RegisteredEditorPriority.default
			},
			{},
			{
				createEditorInput: ({ resource, options }, group) => ({ editor: new TestFileEditorInput(URI.parse(resource.toString()), TEST_EDITOR_INPUT_ID) }),
			}
		);

		const resultingResolution = await service.resolveEditor({ resource: URI.file('my://resource-basics.test') }, part.activeGroup);
		assert.ok(resultingResolution);
		assert.notStrictEqual(typeof resultingResolution, 'number');
		if (resultingResolution !== ResolvedStatus.ABORT && resultingResolution !== ResolvedStatus.NONE) {
			assert.strictEqual(resultingResolution.editor.typeId, TEST_EDITOR_INPUT_ID);
			resultingResolution.editor.dispose();
		}
		registeredEditor.dispose();
	});

	test('Untitled Resolve', async () => {
		const UNTITLED_TEST_EDITOR_INPUT_ID = 'UNTITLED_TEST_INPUT';
		const [part, service] = await createEditorResolverService();
		const registeredEditor = service.registerEditor('*.test',
			{
				id: 'TEST_EDITOR',
				label: 'Test Editor Label',
				detail: 'Test Editor Details',
				priority: RegisteredEditorPriority.default
			},
			{},
			{
				createEditorInput: ({ resource, options }, group) => ({ editor: new TestFileEditorInput(URI.parse(resource.toString()), TEST_EDITOR_INPUT_ID) }),
				createUntitledEditorInput: ({ resource, options }, group) => ({ editor: new TestFileEditorInput((resource ? resource : URI.from({ scheme: Schemas.untitled })), UNTITLED_TEST_EDITOR_INPUT_ID) }),
			}
		);

		// Untyped untitled - no resource
		let resultingResolution = await service.resolveEditor({ resource: undefined }, part.activeGroup);
		assert.ok(resultingResolution);
		// We don't expect untitled to match the *.test glob
		assert.strictEqual(typeof resultingResolution, 'number');

		// Untyped untitled - with untitled resource
		resultingResolution = await service.resolveEditor({ resource: URI.from({ scheme: Schemas.untitled, path: 'foo.test' }) }, part.activeGroup);
		assert.ok(resultingResolution);
		assert.notStrictEqual(typeof resultingResolution, 'number');
		if (resultingResolution !== ResolvedStatus.ABORT && resultingResolution !== ResolvedStatus.NONE) {
			assert.strictEqual(resultingResolution.editor.typeId, UNTITLED_TEST_EDITOR_INPUT_ID);
			resultingResolution.editor.dispose();
		}

		// Untyped untitled - file resource with forceUntitled
		resultingResolution = await service.resolveEditor({ resource: URI.file('/fake.test'), forceUntitled: true }, part.activeGroup);
		assert.ok(resultingResolution);
		assert.notStrictEqual(typeof resultingResolution, 'number');
		if (resultingResolution !== ResolvedStatus.ABORT && resultingResolution !== ResolvedStatus.NONE) {
			assert.strictEqual(resultingResolution.editor.typeId, UNTITLED_TEST_EDITOR_INPUT_ID);
			resultingResolution.editor.dispose();
		}

		registeredEditor.dispose();
	});

	test('Side by side Resolve', async () => {
		const [part, service] = await createEditorResolverService();
		const registeredEditorPrimary = service.registerEditor('*.test-primary',
			{
				id: 'TEST_EDITOR_PRIMARY',
				label: 'Test Editor Label Primary',
				detail: 'Test Editor Details Primary',
				priority: RegisteredEditorPriority.default
			},
			{},
			{
				createEditorInput: ({ resource, options }, group) => ({ editor: constructDisposableFileEditorInput(URI.parse(resource.toString()), TEST_EDITOR_INPUT_ID, disposables) }),
			}
		);

		const registeredEditorSecondary = service.registerEditor('*.test-secondary',
			{
				id: 'TEST_EDITOR_SECONDARY',
				label: 'Test Editor Label Secondary',
				detail: 'Test Editor Details Secondary',
				priority: RegisteredEditorPriority.default
			},
			{},
			{
				createEditorInput: ({ resource, options }, group) => ({ editor: constructDisposableFileEditorInput(URI.parse(resource.toString()), TEST_EDITOR_INPUT_ID, disposables) }),
			}
		);

		const resultingResolution = await service.resolveEditor({
			primary: { resource: URI.file('my://resource-basics.test-primary') },
			secondary: { resource: URI.file('my://resource-basics.test-secondary') }
		}, part.activeGroup);
		assert.ok(resultingResolution);
		assert.notStrictEqual(typeof resultingResolution, 'number');
		if (resultingResolution !== ResolvedStatus.ABORT && resultingResolution !== ResolvedStatus.NONE) {
			assert.strictEqual(resultingResolution.editor.typeId, 'workbench.editorinputs.sidebysideEditorInput');
			resultingResolution.editor.dispose();
		} else {
			assert.fail();
		}
		registeredEditorPrimary.dispose();
		registeredEditorSecondary.dispose();
	});

	test('Diff editor Resolve', async () => {
		const [part, service, accessor] = await createEditorResolverService();
		const registeredEditor = service.registerEditor('*.test-diff',
			{
				id: 'TEST_EDITOR',
				label: 'Test Editor Label',
				detail: 'Test Editor Details',
				priority: RegisteredEditorPriority.default
			},
			{},
			{
				createEditorInput: ({ resource, options }, group) => ({ editor: constructDisposableFileEditorInput(URI.parse(resource.toString()), TEST_EDITOR_INPUT_ID, disposables) }),
				createDiffEditorInput: ({ modified, original, options }, group) => ({
					editor: accessor.instantiationService.createInstance(
						DiffEditorInput,
						'name',
						'description',
						constructDisposableFileEditorInput(URI.parse(original.toString()), TEST_EDITOR_INPUT_ID, disposables),
						constructDisposableFileEditorInput(URI.parse(modified.toString()), TEST_EDITOR_INPUT_ID, disposables),
						undefined)
				})
			}
		);

		const resultingResolution = await service.resolveEditor({
			original: { resource: URI.file('my://resource-basics.test-diff') },
			modified: { resource: URI.file('my://resource-basics.test-diff') }
		}, part.activeGroup);
		assert.ok(resultingResolution);
		assert.notStrictEqual(typeof resultingResolution, 'number');
		if (resultingResolution !== ResolvedStatus.ABORT && resultingResolution !== ResolvedStatus.NONE) {
			assert.strictEqual(resultingResolution.editor.typeId, 'workbench.editors.diffEditorInput');
			resultingResolution.editor.dispose();
		} else {
			assert.fail();
		}
		registeredEditor.dispose();
	});

	test('Diff editor Resolve - Different Types', async () => {
		const [part, service, accessor] = await createEditorResolverService();
		let diffOneCounter = 0;
		let diffTwoCounter = 0;
		let defaultDiffCounter = 0;
		const registeredEditor = service.registerEditor('*.test-diff',
			{
				id: 'TEST_EDITOR',
				label: 'Test Editor Label',
				detail: 'Test Editor Details',
				priority: RegisteredEditorPriority.default
			},
			{},
			{
				createEditorInput: ({ resource, options }, group) => ({ editor: constructDisposableFileEditorInput(URI.parse(resource.toString()), TEST_EDITOR_INPUT_ID, disposables) }),
				createDiffEditorInput: ({ modified, original, options }, group) => {
					diffOneCounter++;
					return {
						editor: accessor.instantiationService.createInstance(
							DiffEditorInput,
							'name',
							'description',
							constructDisposableFileEditorInput(URI.parse(original.toString()), TEST_EDITOR_INPUT_ID, disposables),
							constructDisposableFileEditorInput(URI.parse(modified.toString()), TEST_EDITOR_INPUT_ID, disposables),
							undefined)
					};
				}
			}
		);

		const secondRegisteredEditor = service.registerEditor('*.test-secondDiff',
			{
				id: 'TEST_EDITOR_2',
				label: 'Test Editor Label',
				detail: 'Test Editor Details',
				priority: RegisteredEditorPriority.default
			},
			{},
			{
				createEditorInput: ({ resource, options }, group) => ({ editor: new TestFileEditorInput(URI.parse(resource.toString()), TEST_EDITOR_INPUT_ID) }),
				createDiffEditorInput: ({ modified, original, options }, group) => {
					diffTwoCounter++;
					return {
						editor: accessor.instantiationService.createInstance(
							DiffEditorInput,
							'name',
							'description',
							constructDisposableFileEditorInput(URI.parse(original.toString()), TEST_EDITOR_INPUT_ID, disposables),
							constructDisposableFileEditorInput(URI.parse(modified.toString()), TEST_EDITOR_INPUT_ID, disposables),
							undefined)
					};
				}
			}
		);

		const defaultRegisteredEditor = service.registerEditor('*',
			{
				id: 'default',
				label: 'Test Editor Label',
				detail: 'Test Editor Details',
				priority: RegisteredEditorPriority.option
			},
			{},
			{
				createEditorInput: ({ resource, options }, group) => ({ editor: new TestFileEditorInput(URI.parse(resource.toString()), TEST_EDITOR_INPUT_ID) }),
				createDiffEditorInput: ({ modified, original, options }, group) => {
					defaultDiffCounter++;
					return {
						editor: accessor.instantiationService.createInstance(
							DiffEditorInput,
							'name',
							'description',
							constructDisposableFileEditorInput(URI.parse(original.toString()), TEST_EDITOR_INPUT_ID, disposables),
							constructDisposableFileEditorInput(URI.parse(modified.toString()), TEST_EDITOR_INPUT_ID, disposables),
							undefined)
					};
				}
			}
		);

		let resultingResolution = await service.resolveEditor({
			original: { resource: URI.file('my://resource-basics.test-diff') },
			modified: { resource: URI.file('my://resource-basics.test-diff') }
		}, part.activeGroup);
		assert.ok(resultingResolution);
		assert.notStrictEqual(typeof resultingResolution, 'number');
		if (resultingResolution !== ResolvedStatus.ABORT && resultingResolution !== ResolvedStatus.NONE) {
			assert.strictEqual(diffOneCounter, 1);
			assert.strictEqual(diffTwoCounter, 0);
			assert.strictEqual(defaultDiffCounter, 0);
			assert.strictEqual(resultingResolution.editor.typeId, 'workbench.editors.diffEditorInput');
			resultingResolution.editor.dispose();
		} else {
			assert.fail();
		}

		resultingResolution = await service.resolveEditor({
			original: { resource: URI.file('my://resource-basics.test-secondDiff') },
			modified: { resource: URI.file('my://resource-basics.test-secondDiff') }
		}, part.activeGroup);
		assert.ok(resultingResolution);
		assert.notStrictEqual(typeof resultingResolution, 'number');
		if (resultingResolution !== ResolvedStatus.ABORT && resultingResolution !== ResolvedStatus.NONE) {
			assert.strictEqual(diffOneCounter, 1);
			assert.strictEqual(diffTwoCounter, 1);
			assert.strictEqual(defaultDiffCounter, 0);
			assert.strictEqual(resultingResolution.editor.typeId, 'workbench.editors.diffEditorInput');
			resultingResolution.editor.dispose();
		} else {
			assert.fail();
		}

		resultingResolution = await service.resolveEditor({
			original: { resource: URI.file('my://resource-basics.test-secondDiff') },
			modified: { resource: URI.file('my://resource-basics.test-diff') }
		}, part.activeGroup);
		assert.ok(resultingResolution);
		assert.notStrictEqual(typeof resultingResolution, 'number');
		if (resultingResolution !== ResolvedStatus.ABORT && resultingResolution !== ResolvedStatus.NONE) {
			assert.strictEqual(diffOneCounter, 1);
			assert.strictEqual(diffTwoCounter, 1);
			assert.strictEqual(defaultDiffCounter, 1);
			assert.strictEqual(resultingResolution.editor.typeId, 'workbench.editors.diffEditorInput');
			resultingResolution.editor.dispose();
		} else {
			assert.fail();
		}

		resultingResolution = await service.resolveEditor({
			original: { resource: URI.file('my://resource-basics.test-diff') },
			modified: { resource: URI.file('my://resource-basics.test-secondDiff') }
		}, part.activeGroup);
		assert.ok(resultingResolution);
		assert.notStrictEqual(typeof resultingResolution, 'number');
		if (resultingResolution !== ResolvedStatus.ABORT && resultingResolution !== ResolvedStatus.NONE) {
			assert.strictEqual(diffOneCounter, 1);
			assert.strictEqual(diffTwoCounter, 1);
			assert.strictEqual(defaultDiffCounter, 2);
			assert.strictEqual(resultingResolution.editor.typeId, 'workbench.editors.diffEditorInput');
			resultingResolution.editor.dispose();
		} else {
			assert.fail();
		}

		resultingResolution = await service.resolveEditor({
			original: { resource: URI.file('my://resource-basics.test-secondDiff') },
			modified: { resource: URI.file('my://resource-basics.test-diff') },
			options: { override: 'TEST_EDITOR' }
		}, part.activeGroup);
		assert.ok(resultingResolution);
		assert.notStrictEqual(typeof resultingResolution, 'number');
		if (resultingResolution !== ResolvedStatus.ABORT && resultingResolution !== ResolvedStatus.NONE) {
			assert.strictEqual(diffOneCounter, 2);
			assert.strictEqual(diffTwoCounter, 1);
			assert.strictEqual(defaultDiffCounter, 2);
			assert.strictEqual(resultingResolution.editor.typeId, 'workbench.editors.diffEditorInput');
			resultingResolution.editor.dispose();
		} else {
			assert.fail();
		}

		registeredEditor.dispose();
		secondRegisteredEditor.dispose();
		defaultRegisteredEditor.dispose();
	});

	test('Registry & Events', async () => {
		const [, service] = await createEditorResolverService();

		let eventCounter = 0;
		disposables.add(service.onDidChangeEditorRegistrations(() => {
			eventCounter++;
		}));

		const editors = service.getEditors();

		const registeredEditor = service.registerEditor('*.test',
			{
				id: 'TEST_EDITOR',
				label: 'Test Editor Label',
				detail: 'Test Editor Details',
				priority: RegisteredEditorPriority.default
			},
			{},
			{
				createEditorInput: ({ resource, options }, group) => ({ editor: new TestFileEditorInput(URI.parse(resource.toString()), TEST_EDITOR_INPUT_ID) })
			}
		);

		assert.strictEqual(eventCounter, 1);
		assert.strictEqual(service.getEditors().length, editors.length + 1);
		assert.strictEqual(service.getEditors().some(editor => editor.id === 'TEST_EDITOR'), true);

		registeredEditor.dispose();

		assert.strictEqual(eventCounter, 2);
		assert.strictEqual(service.getEditors().length, editors.length);
		assert.strictEqual(service.getEditors().some(editor => editor.id === 'TEST_EDITOR'), false);
	});

	test('Multiple registrations to same glob and id #155859', async () => {
		const [part, service, accessor] = await createEditorResolverService();
		const testEditorInfo = {
			id: 'TEST_EDITOR',
			label: 'Test Editor Label',
			detail: 'Test Editor Details',
			priority: RegisteredEditorPriority.default
		};
		const registeredSingleEditor = service.registerEditor('*.test',
			testEditorInfo,
			{},
			{
				createEditorInput: ({ resource, options }, group) => ({ editor: new TestFileEditorInput(URI.parse(resource.toString()), TEST_EDITOR_INPUT_ID) })
			}
		);

		const registeredDiffEditor = service.registerEditor('*.test',
			testEditorInfo,
			{},
			{
				createDiffEditorInput: ({ modified, original, options }, group) => ({
					editor: accessor.instantiationService.createInstance(
						DiffEditorInput,
						'name',
						'description',
						constructDisposableFileEditorInput(URI.parse(original.toString()), TEST_EDITOR_INPUT_ID, disposables),
						constructDisposableFileEditorInput(URI.parse(modified.toString()), TEST_EDITOR_INPUT_ID, disposables),
						undefined)
				})
			}
		);

		// Resolve a diff
		let resultingResolution = await service.resolveEditor({
			original: { resource: URI.file('my://resource-basics.test') },
			modified: { resource: URI.file('my://resource-basics.test') }
		}, part.activeGroup);
		assert.ok(resultingResolution);
		assert.notStrictEqual(typeof resultingResolution, 'number');
		if (resultingResolution !== ResolvedStatus.ABORT && resultingResolution !== ResolvedStatus.NONE) {
			assert.strictEqual(resultingResolution.editor.typeId, 'workbench.editors.diffEditorInput');
			resultingResolution.editor.dispose();
		} else {
			assert.fail();
		}

		// Remove diff registration
		registeredDiffEditor.dispose();

		// Resolve a diff again, expected failure
		resultingResolution = await service.resolveEditor({
			original: { resource: URI.file('my://resource-basics.test') },
			modified: { resource: URI.file('my://resource-basics.test') }
		}, part.activeGroup);
		assert.ok(resultingResolution);
		assert.strictEqual(typeof resultingResolution, 'number');
		if (resultingResolution !== ResolvedStatus.NONE) {
			assert.fail();
		}

		registeredSingleEditor.dispose();
	});
});
```

--------------------------------------------------------------------------------

````
