---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 350
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 350 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatContextActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatContextActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { asArray } from '../../../../../base/common/arrays.js';
import { DeferredPromise, isThenable } from '../../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { DisposableStore, toDisposable } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { autorun, observableValue } from '../../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { isObject } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { EditorContextKeys } from '../../../../../editor/common/editorContextKeys.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { AbstractGotoSymbolQuickAccessProvider, IGotoSymbolQuickPickItem } from '../../../../../editor/contrib/quickAccess/browser/gotoSymbolQuickAccess.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IListService } from '../../../../../platform/list/browser/listService.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { AnythingQuickAccessProviderRunOptions } from '../../../../../platform/quickinput/common/quickAccess.js';
import { IQuickInputService, IQuickPickItem, IQuickPickItemWithResource, QuickPickItem } from '../../../../../platform/quickinput/common/quickInput.js';
import { resolveCommandsContext } from '../../../../browser/parts/editor/editorCommandsContext.js';
import { ResourceContextKey } from '../../../../common/contextkeys.js';
import { EditorResourceAccessor, isEditorCommandsContext, SideBySideEditor } from '../../../../common/editor.js';
import { IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { ExplorerFolderContext } from '../../../files/common/files.js';
import { CTX_INLINE_CHAT_V2_ENABLED } from '../../../inlineChat/common/inlineChat.js';
import { AnythingQuickAccessProvider } from '../../../search/browser/anythingQuickAccess.js';
import { isSearchTreeFileMatch, isSearchTreeMatch } from '../../../search/browser/searchTreeModel/searchTreeCommon.js';
import { ISymbolQuickPickItem, SymbolsQuickAccessProvider } from '../../../search/browser/symbolsQuickAccess.js';
import { SearchContext } from '../../../search/common/constants.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { IChatRequestVariableEntry, OmittedState } from '../../common/chatVariableEntries.js';
import { ChatAgentLocation, isSupportedChatFileScheme } from '../../common/constants.js';
import { IChatWidget, IChatWidgetService, IQuickChatService } from '../chat.js';
import { IChatContextPickerItem, IChatContextPickService, IChatContextValueItem, isChatContextPickerPickItem } from '../chatContextPickService.js';
import { isQuickChat } from '../chatWidget.js';
import { resizeImage } from '../chatImageUtils.js';
import { registerPromptActions } from '../promptSyntax/promptFileActions.js';
import { CHAT_CATEGORY } from './chatActions.js';

export function registerChatContextActions() {
	registerAction2(AttachContextAction);
	registerAction2(AttachFileToChatAction);
	registerAction2(AttachFolderToChatAction);
	registerAction2(AttachSelectionToChatAction);
	registerAction2(AttachSearchResultAction);
	registerPromptActions();
}

async function withChatView(accessor: ServicesAccessor): Promise<IChatWidget | undefined> {
	const chatWidgetService = accessor.get(IChatWidgetService);

	const lastFocusedWidget = chatWidgetService.lastFocusedWidget;
	if (!lastFocusedWidget || lastFocusedWidget.location === ChatAgentLocation.Chat) {
		return chatWidgetService.revealWidget(); // only show chat view if we either have no chat view or its located in view container
	}
	return lastFocusedWidget;
}

abstract class AttachResourceAction extends Action2 {

	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const instaService = accessor.get(IInstantiationService);
		const widget = await instaService.invokeFunction(withChatView);
		if (!widget) {
			return;
		}
		return instaService.invokeFunction(this.runWithWidget.bind(this), widget, ...args);
	}

	abstract runWithWidget(accessor: ServicesAccessor, widget: IChatWidget, ...args: unknown[]): Promise<void>;

	protected _getResources(accessor: ServicesAccessor, ...args: unknown[]): URI[] {
		const editorService = accessor.get(IEditorService);

		const contexts = isEditorCommandsContext(args[1]) ? this._getEditorResources(accessor, args) : Array.isArray(args[1]) ? args[1] : [args[0]];
		const files = [];
		for (const context of contexts) {
			let uri;
			if (URI.isUri(context)) {
				uri = context;
			} else if (isSearchTreeFileMatch(context)) {
				uri = context.resource;
			} else if (isSearchTreeMatch(context)) {
				uri = context.parent().resource;
			} else if (!context && editorService.activeTextEditorControl) {
				uri = EditorResourceAccessor.getCanonicalUri(editorService.activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY });
			}

			if (uri && [Schemas.file, Schemas.vscodeRemote, Schemas.untitled].includes(uri.scheme)) {
				files.push(uri);
			}
		}

		return files;
	}

	private _getEditorResources(accessor: ServicesAccessor, ...args: unknown[]): URI[] {
		const resolvedContext = resolveCommandsContext(args, accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IListService));

		return resolvedContext.groupedEditors
			.flatMap(groupedEditor => groupedEditor.editors)
			.map(editor => EditorResourceAccessor.getCanonicalUri(editor, { supportSideBySide: SideBySideEditor.PRIMARY }))
			.filter(uri => uri !== undefined);
	}
}

class AttachFileToChatAction extends AttachResourceAction {

	static readonly ID = 'workbench.action.chat.attachFile';

	constructor() {
		super({
			id: AttachFileToChatAction.ID,
			title: localize2('workbench.action.chat.attachFile.label', "Add File to Chat"),
			category: CHAT_CATEGORY,
			precondition: ChatContextKeys.enabled,
			f1: true,
			menu: [{
				id: MenuId.SearchContext,
				group: 'z_chat',
				order: 1,
				when: ContextKeyExpr.and(ChatContextKeys.enabled, SearchContext.FileMatchOrMatchFocusKey, SearchContext.SearchResultHeaderFocused.negate()),
			}, {
				id: MenuId.ExplorerContext,
				group: '5_chat',
				order: 1,
				when: ContextKeyExpr.and(
					ChatContextKeys.enabled,
					ExplorerFolderContext.negate(),
					ContextKeyExpr.or(
						ResourceContextKey.Scheme.isEqualTo(Schemas.file),
						ResourceContextKey.Scheme.isEqualTo(Schemas.vscodeRemote)
					)
				),
			}, {
				id: MenuId.EditorTitleContext,
				group: '2_chat',
				order: 1,
				when: ContextKeyExpr.and(
					ChatContextKeys.enabled,
					ContextKeyExpr.or(
						ResourceContextKey.Scheme.isEqualTo(Schemas.file),
						ResourceContextKey.Scheme.isEqualTo(Schemas.vscodeRemote)
					)
				),
			}, {
				id: MenuId.EditorContext,
				group: '1_chat',
				order: 2,
				when: ContextKeyExpr.and(
					ChatContextKeys.enabled,
					ContextKeyExpr.or(
						ResourceContextKey.Scheme.isEqualTo(Schemas.file),
						ResourceContextKey.Scheme.isEqualTo(Schemas.vscodeRemote),
						ResourceContextKey.Scheme.isEqualTo(Schemas.untitled),
						ResourceContextKey.Scheme.isEqualTo(Schemas.vscodeUserData)
					)
				)
			}]
		});
	}

	override async runWithWidget(accessor: ServicesAccessor, widget: IChatWidget, ...args: unknown[]): Promise<void> {
		const files = this._getResources(accessor, ...args);
		if (!files.length) {
			return;
		}
		if (widget) {
			widget.focusInput();
			for (const file of files) {
				widget.attachmentModel.addFile(file);
			}
		}
	}
}

class AttachFolderToChatAction extends AttachResourceAction {

	static readonly ID = 'workbench.action.chat.attachFolder';

	constructor() {
		super({
			id: AttachFolderToChatAction.ID,
			title: localize2('workbench.action.chat.attachFolder.label', "Add Folder to Chat"),
			category: CHAT_CATEGORY,
			f1: false,
			menu: {
				id: MenuId.ExplorerContext,
				group: '5_chat',
				order: 1,
				when: ContextKeyExpr.and(
					ChatContextKeys.enabled,
					ExplorerFolderContext,
					ContextKeyExpr.or(
						ResourceContextKey.Scheme.isEqualTo(Schemas.file),
						ResourceContextKey.Scheme.isEqualTo(Schemas.vscodeRemote)
					)
				)
			}
		});
	}

	override async runWithWidget(accessor: ServicesAccessor, widget: IChatWidget, ...args: unknown[]): Promise<void> {
		const folders = this._getResources(accessor, ...args);
		if (!folders.length) {
			return;
		}
		if (widget) {
			widget.focusInput();
			for (const folder of folders) {
				widget.attachmentModel.addFolder(folder);
			}
		}
	}
}

class AttachSelectionToChatAction extends Action2 {

	static readonly ID = 'workbench.action.chat.attachSelection';

	constructor() {
		super({
			id: AttachSelectionToChatAction.ID,
			title: localize2('workbench.action.chat.attachSelection.label', "Add Selection to Chat"),
			category: CHAT_CATEGORY,
			f1: true,
			precondition: ChatContextKeys.enabled,
			menu: {
				id: MenuId.EditorContext,
				group: '1_chat',
				order: 1,
				when: ContextKeyExpr.and(
					ChatContextKeys.enabled,
					EditorContextKeys.hasNonEmptySelection,
					ContextKeyExpr.or(
						ResourceContextKey.Scheme.isEqualTo(Schemas.file),
						ResourceContextKey.Scheme.isEqualTo(Schemas.vscodeRemote),
						ResourceContextKey.Scheme.isEqualTo(Schemas.untitled),
						ResourceContextKey.Scheme.isEqualTo(Schemas.vscodeUserData)
					)
				)
			}
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	override async run(accessor: ServicesAccessor, ...args: any[]): Promise<void> {
		const editorService = accessor.get(IEditorService);

		const widget = await accessor.get(IInstantiationService).invokeFunction(withChatView);
		if (!widget) {
			return;
		}

		const [_, matches] = args;
		// If we have search matches, it means this is coming from the search widget
		if (matches && matches.length > 0) {
			const uris = new Map<URI, Range | undefined>();
			for (const match of matches) {
				if (isSearchTreeFileMatch(match)) {
					uris.set(match.resource, undefined);
				} else {
					const context = { uri: match._parent.resource, range: match._range };
					const range = uris.get(context.uri);
					if (!range ||
						range.startLineNumber !== context.range.startLineNumber && range.endLineNumber !== context.range.endLineNumber) {
						uris.set(context.uri, context.range);
						widget.attachmentModel.addFile(context.uri, context.range);
					}
				}
			}
			// Add the root files for all of the ones that didn't have a match
			for (const uri of uris) {
				const [resource, range] = uri;
				if (!range) {
					widget.attachmentModel.addFile(resource);
				}
			}
		} else {
			const activeEditor = editorService.activeTextEditorControl;
			const activeUri = EditorResourceAccessor.getCanonicalUri(editorService.activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY });
			if (activeEditor && activeUri && [Schemas.file, Schemas.vscodeRemote, Schemas.untitled].includes(activeUri.scheme)) {
				const selection = activeEditor.getSelection();
				if (selection) {
					widget.focusInput();
					const range = selection.isEmpty() ? new Range(selection.startLineNumber, 1, selection.startLineNumber + 1, 1) : selection;
					widget.attachmentModel.addFile(activeUri, range);
				}
			}
		}
	}
}

export class AttachSearchResultAction extends Action2 {

	private static readonly Name = 'searchResults';

	constructor() {
		super({
			id: 'workbench.action.chat.insertSearchResults',
			title: localize2('chat.insertSearchResults', 'Add Search Results to Chat'),
			category: CHAT_CATEGORY,
			f1: false,
			menu: [{
				id: MenuId.SearchContext,
				group: 'z_chat',
				order: 3,
				when: ContextKeyExpr.and(
					ChatContextKeys.enabled,
					SearchContext.SearchResultHeaderFocused),
			}]
		});
	}
	async run(accessor: ServicesAccessor) {
		const logService = accessor.get(ILogService);
		const widget = await accessor.get(IInstantiationService).invokeFunction(withChatView);

		if (!widget) {
			logService.trace('InsertSearchResultAction: no chat view available');
			return;
		}

		const editor = widget.inputEditor;
		const originalRange = editor.getSelection() ?? editor.getModel()?.getFullModelRange().collapseToEnd();

		if (!originalRange) {
			logService.trace('InsertSearchResultAction: no selection');
			return;
		}

		let insertText = `#${AttachSearchResultAction.Name}`;
		const varRange = new Range(originalRange.startLineNumber, originalRange.startColumn, originalRange.endLineNumber, originalRange.startLineNumber + insertText.length);
		// check character before the start of the range. If it's not a space, add a space
		const model = editor.getModel();
		if (model && model.getValueInRange(new Range(originalRange.startLineNumber, originalRange.startColumn - 1, originalRange.startLineNumber, originalRange.startColumn)) !== ' ') {
			insertText = ' ' + insertText;
		}
		const success = editor.executeEdits('chatInsertSearch', [{ range: varRange, text: insertText + ' ' }]);
		if (!success) {
			logService.trace(`InsertSearchResultAction: failed to insert "${insertText}"`);
			return;
		}
	}
}

/** This is our type */
interface IContextPickItemItem extends IQuickPickItem {
	kind: 'contextPick';
	item: IChatContextValueItem | IChatContextPickerItem;
}

/** These are the types we get from "platform QP" */
type IQuickPickServicePickItem = IGotoSymbolQuickPickItem | ISymbolQuickPickItem | IQuickPickItemWithResource;

function isIContextPickItemItem(obj: unknown): obj is IContextPickItemItem {
	return (
		isObject(obj)
		&& typeof (<IContextPickItemItem>obj).kind === 'string'
		&& (<IContextPickItemItem>obj).kind === 'contextPick'
	);
}

function isIGotoSymbolQuickPickItem(obj: unknown): obj is IGotoSymbolQuickPickItem {
	return (
		isObject(obj)
		&& typeof (obj as IGotoSymbolQuickPickItem).symbolName === 'string'
		&& !!(obj as IGotoSymbolQuickPickItem).uri
		&& !!(obj as IGotoSymbolQuickPickItem).range);
}

function isIQuickPickItemWithResource(obj: unknown): obj is IQuickPickItemWithResource {
	return (
		isObject(obj)
		&& URI.isUri((obj as IQuickPickItemWithResource).resource));
}


export class AttachContextAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.chat.attachContext',
			title: localize2('workbench.action.chat.attachContext.label.2', "Add Context..."),
			icon: Codicon.attach,
			category: CHAT_CATEGORY,
			keybinding: {
				when: ContextKeyExpr.and(ChatContextKeys.inChatInput, ChatContextKeys.location.isEqualTo(ChatAgentLocation.Chat)),
				primary: KeyMod.CtrlCmd | KeyCode.Slash,
				weight: KeybindingWeight.EditorContrib
			},
			menu: {
				when: ContextKeyExpr.and(
					ContextKeyExpr.or(
						ChatContextKeys.location.isEqualTo(ChatAgentLocation.Chat),
						ContextKeyExpr.and(ChatContextKeys.location.isEqualTo(ChatAgentLocation.EditorInline), CTX_INLINE_CHAT_V2_ENABLED)
					),
					ContextKeyExpr.or(
						ChatContextKeys.lockedToCodingAgent.negate(),
						ChatContextKeys.agentSupportsAttachments
					)
				),
				id: MenuId.ChatInputAttachmentToolbar,
				group: 'navigation',
				order: 3
			},

		});
	}

	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {

		const instantiationService = accessor.get(IInstantiationService);
		const widgetService = accessor.get(IChatWidgetService);
		const contextKeyService = accessor.get(IContextKeyService);
		const keybindingService = accessor.get(IKeybindingService);
		const contextPickService = accessor.get(IChatContextPickService);

		const context = args[0] as { widget?: IChatWidget; placeholder?: string } | undefined;
		const widget = context?.widget ?? widgetService.lastFocusedWidget;
		if (!widget) {
			return;
		}

		const quickPickItems: IContextPickItemItem[] = [];

		for (const item of contextPickService.items) {

			if (item.isEnabled && !await item.isEnabled(widget)) {
				continue;
			}

			quickPickItems.push({
				kind: 'contextPick',
				item,
				label: item.label,
				iconClass: ThemeIcon.asClassName(item.icon),
				keybinding: item.commandId ? keybindingService.lookupKeybinding(item.commandId, contextKeyService) : undefined,
			});
		}

		instantiationService.invokeFunction(this._show.bind(this), widget, quickPickItems, context?.placeholder);
	}

	private _show(accessor: ServicesAccessor, widget: IChatWidget, additionPicks: IContextPickItemItem[] | undefined, placeholder?: string) {
		const quickInputService = accessor.get(IQuickInputService);
		const quickChatService = accessor.get(IQuickChatService);
		const instantiationService = accessor.get(IInstantiationService);
		const commandService = accessor.get(ICommandService);

		const providerOptions: AnythingQuickAccessProviderRunOptions = {
			filter: (pick) => {
				if (isIQuickPickItemWithResource(pick) && pick.resource) {
					return instantiationService.invokeFunction(accessor => isSupportedChatFileScheme(accessor, pick.resource!.scheme));
				}
				return true;
			},
			additionPicks,
			handleAccept: async (item: IQuickPickServicePickItem | IContextPickItemItem, isBackgroundAccept: boolean) => {

				if (isIContextPickItemItem(item)) {

					let isDone = true;
					if (item.item.type === 'valuePick') {
						this._handleContextPick(item.item, widget);

					} else if (item.item.type === 'pickerPick') {
						isDone = await this._handleContextPickerItem(quickInputService, commandService, item.item, widget);
					}

					if (!isDone) {
						// restart picker when sub-picker didn't return anything
						instantiationService.invokeFunction(this._show.bind(this), widget, additionPicks, placeholder);
						return;
					}

				} else {
					instantiationService.invokeFunction(this._handleQPPick.bind(this), widget, isBackgroundAccept, item);
				}
				if (isQuickChat(widget)) {
					quickChatService.open();
				}
			}
		};

		quickInputService.quickAccess.show('', {
			enabledProviderPrefixes: [
				AnythingQuickAccessProvider.PREFIX,
				SymbolsQuickAccessProvider.PREFIX,
				AbstractGotoSymbolQuickAccessProvider.PREFIX
			],
			placeholder: placeholder ?? localize('chatContext.attach.placeholder', 'Search attachments'),
			providerOptions,
		});
	}

	private async _handleQPPick(accessor: ServicesAccessor, widget: IChatWidget, isInBackground: boolean, pick: IQuickPickServicePickItem) {
		const fileService = accessor.get(IFileService);
		const textModelService = accessor.get(ITextModelService);

		const toAttach: IChatRequestVariableEntry[] = [];

		if (isIQuickPickItemWithResource(pick) && pick.resource) {
			if (/\.(png|jpg|jpeg|bmp|gif|tiff)$/i.test(pick.resource.path)) {
				// checks if the file is an image
				if (URI.isUri(pick.resource)) {
					// read the image and attach a new file context.
					const readFile = await fileService.readFile(pick.resource);
					const resizedImage = await resizeImage(readFile.value.buffer);
					toAttach.push({
						id: pick.resource.toString(),
						name: pick.label,
						fullName: pick.label,
						value: resizedImage,
						kind: 'image',
						references: [{ reference: pick.resource, kind: 'reference' }]
					});
				}
			} else {
				let omittedState = OmittedState.NotOmitted;
				try {
					const createdModel = await textModelService.createModelReference(pick.resource);
					createdModel.dispose();
				} catch {
					omittedState = OmittedState.Full;
				}

				toAttach.push({
					kind: 'file',
					id: pick.resource.toString(),
					value: pick.resource,
					name: pick.label,
					omittedState
				});
			}
		} else if (isIGotoSymbolQuickPickItem(pick) && pick.uri && pick.range) {
			toAttach.push({
				kind: 'generic',
				id: JSON.stringify({ uri: pick.uri, range: pick.range.decoration }),
				value: { uri: pick.uri, range: pick.range.decoration },
				fullName: pick.label,
				name: pick.symbolName!,
			});
		}


		widget.attachmentModel.addContext(...toAttach);

		if (!isInBackground) {
			// Set focus back into the input once the user is done attaching items
			// so that the user can start typing their message
			widget.focusInput();
		}
	}

	private async _handleContextPick(item: IChatContextValueItem, widget: IChatWidget) {

		const value = await item.asAttachment(widget);
		if (Array.isArray(value)) {
			widget.attachmentModel.addContext(...value);
		} else if (value) {
			widget.attachmentModel.addContext(value);
		}
	}

	private async _handleContextPickerItem(quickInputService: IQuickInputService, commandService: ICommandService, item: IChatContextPickerItem, widget: IChatWidget): Promise<boolean> {

		const pickerConfig = item.asPicker(widget);

		const store = new DisposableStore();

		const goBackItem: IQuickPickItem = {
			label: localize('goBack', 'Go back ↩'),
			alwaysShow: true
		};
		const configureItem = pickerConfig.configure ? {
			label: pickerConfig.configure.label,
			commandId: pickerConfig.configure.commandId,
			alwaysShow: true
		} : undefined;
		const extraPicks: QuickPickItem[] = [{ type: 'separator' }];
		if (configureItem) {
			extraPicks.push(configureItem);
		}
		extraPicks.push(goBackItem);

		const qp = store.add(quickInputService.createQuickPick({ useSeparators: true }));

		const cts = new CancellationTokenSource();
		store.add(qp.onDidHide(() => cts.cancel()));
		store.add(toDisposable(() => cts.dispose(true)));

		qp.placeholder = pickerConfig.placeholder;
		qp.matchOnDescription = true;
		qp.matchOnDetail = true;
		// qp.ignoreFocusOut = true;
		qp.canAcceptInBackground = true;
		qp.busy = true;
		qp.show();

		if (isThenable(pickerConfig.picks)) {
			const items = await (pickerConfig.picks.then(value => {
				return ([] as QuickPickItem[]).concat(value, extraPicks);
			}));

			qp.items = items;
			qp.busy = false;
		} else {
			const query = observableValue<string>('attachContext.query', qp.value);
			store.add(qp.onDidChangeValue(() => query.set(qp.value, undefined)));

			const picksObservable = pickerConfig.picks(query, cts.token);
			store.add(autorun(reader => {
				const { busy, picks } = picksObservable.read(reader);
				qp.items = ([] as QuickPickItem[]).concat(picks, extraPicks);
				qp.busy = busy;
			}));
		}

		if (cts.token.isCancellationRequested) {
			pickerConfig.dispose?.();
			return true; // picker got hidden already
		}

		const defer = new DeferredPromise<boolean>();
		const addPromises: Promise<void>[] = [];

		store.add(qp.onDidAccept(async e => {
			const noop = 'noop';
			const [selected] = qp.selectedItems;
			if (isChatContextPickerPickItem(selected)) {
				const attachment = selected.asAttachment();
				if (!attachment || attachment === noop) {
					return;
				}
				if (isThenable(attachment)) {
					addPromises.push(attachment.then(v => {
						if (v !== noop) {
							widget.attachmentModel.addContext(...asArray(v));
						}
					}));
				} else {
					widget.attachmentModel.addContext(...asArray(attachment));
				}
			}
			if (selected === goBackItem) {
				if (pickerConfig.goBack?.()) {
					// Custom goBack handled the navigation, stay in the picker
					return; // Don't complete, keep picker open
				}
				// Default behavior: go back to main picker
				defer.complete(false);
			}
			if (selected === configureItem) {
				defer.complete(true);
				commandService.executeCommand(configureItem.commandId);
			}
			if (!e.inBackground) {
				defer.complete(true);
			}
		}));

		store.add(qp.onDidHide(() => {
			defer.complete(true);
			pickerConfig.dispose?.();
		}));

		try {
			const result = await defer.p;
			qp.busy = true; // if still visible
			await Promise.all(addPromises);
			return result;
		} finally {
			store.dispose();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatContinueInAction.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatContinueInAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../base/common/codicons.js';
import { h } from '../../../../../base/browser/dom.js';
import { Disposable, IDisposable, markAsSingleton } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { basename } from '../../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { URI } from '../../../../../base/common/uri.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { isITextModel } from '../../../../../editor/common/model.js';
import { localize, localize2 } from '../../../../../nls.js';
import { ActionWidgetDropdownActionViewItem } from '../../../../../platform/actions/browser/actionWidgetDropdownActionViewItem.js';
import { IActionViewItemService } from '../../../../../platform/actions/browser/actionViewItemService.js';
import { Action2, MenuId, MenuItemAction } from '../../../../../platform/actions/common/actions.js';
import { IActionWidgetService } from '../../../../../platform/actionWidget/browser/actionWidget.js';
import { IActionWidgetDropdownAction, IActionWidgetDropdownActionProvider } from '../../../../../platform/actionWidget/browser/actionWidgetDropdown.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { ResourceContextKey } from '../../../../common/contextkeys.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IChatAgentService } from '../../common/chatAgents.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { chatEditingWidgetFileStateContextKey, ModifiedFileEntryState } from '../../common/chatEditingService.js';
import { ChatModel } from '../../common/chatModel.js';
import { ChatRequestParser } from '../../common/chatRequestParser.js';
import { IChatService } from '../../common/chatService.js';
import { IChatSessionsExtensionPoint, IChatSessionsService } from '../../common/chatSessionsService.js';
import { ChatAgentLocation } from '../../common/constants.js';
import { PROMPT_LANGUAGE_ID } from '../../common/promptSyntax/promptTypes.js';
import { AgentSessionProviders, getAgentSessionProviderIcon, getAgentSessionProviderName } from '../agentSessions/agentSessions.js';
import { IChatWidgetService } from '../chat.js';
import { ctxHasEditorModification } from '../chatEditing/chatEditingEditorContextKeys.js';
import { CHAT_SETUP_ACTION_ID } from './chatActions.js';
import { PromptFileVariableKind, toPromptFileVariableEntry } from '../../common/chatVariableEntries.js';

export const enum ActionLocation {
	ChatWidget = 'chatWidget',
	Editor = 'editor'
}

export class ContinueChatInSessionAction extends Action2 {

	static readonly ID = 'workbench.action.chat.continueChatInSession';

	constructor() {
		super({
			id: ContinueChatInSessionAction.ID,
			title: localize2('continueChatInSession', "Continue Chat in..."),
			tooltip: localize('continueChatInSession', "Continue Chat in..."),
			precondition: ContextKeyExpr.and(
				ChatContextKeys.enabled,
				ChatContextKeys.requestInProgress.negate(),
				ChatContextKeys.remoteJobCreating.negate(),
				ChatContextKeys.hasCanDelegateProviders,
			),
			menu: [{
				id: MenuId.ChatExecute,
				group: 'navigation',
				order: 3.4,
				when: ContextKeyExpr.and(
					ChatContextKeys.lockedToCodingAgent.negate(),
					ChatContextKeys.hasCanDelegateProviders,
				),
			},
			{
				id: MenuId.EditorContent,
				group: 'continueIn',
				when: ContextKeyExpr.and(
					ContextKeyExpr.equals(ResourceContextKey.Scheme.key, Schemas.untitled),
					ContextKeyExpr.equals(ResourceContextKey.LangId.key, PROMPT_LANGUAGE_ID),
					ContextKeyExpr.notEquals(chatEditingWidgetFileStateContextKey.key, ModifiedFileEntryState.Modified),
					ctxHasEditorModification.negate(),
					ChatContextKeys.hasCanDelegateProviders,
				),
			}
			]
		});
	}

	override async run(): Promise<void> {
		// Handled by a custom action item
	}
}
export class ChatContinueInSessionActionItem extends ActionWidgetDropdownActionViewItem {
	constructor(
		action: MenuItemAction,
		private readonly location: ActionLocation,
		@IActionWidgetService actionWidgetService: IActionWidgetService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IChatSessionsService chatSessionsService: IChatSessionsService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IOpenerService openerService: IOpenerService
	) {
		super(action, {
			actionProvider: ChatContinueInSessionActionItem.actionProvider(chatSessionsService, instantiationService, location),
			actionBarActions: ChatContinueInSessionActionItem.getActionBarActions(openerService)
		}, actionWidgetService, keybindingService, contextKeyService);
	}

	protected static getActionBarActions(openerService: IOpenerService) {
		const learnMoreUrl = 'https://aka.ms/vscode-continue-chat-in';
		return [{
			id: 'workbench.action.chat.continueChatInSession.learnMore',
			label: localize('chat.learnMore', "Learn More"),
			tooltip: localize('chat.learnMore', "Learn More"),
			class: undefined,
			enabled: true,
			run: async () => {
				await openerService.open(URI.parse(learnMoreUrl));
			}
		}];
	}

	private static actionProvider(chatSessionsService: IChatSessionsService, instantiationService: IInstantiationService, location: ActionLocation): IActionWidgetDropdownActionProvider {
		return {
			getActions: () => {
				const actions: IActionWidgetDropdownAction[] = [];
				const contributions = chatSessionsService.getAllChatSessionContributions();

				// Continue in Background
				const backgroundContrib = contributions.find(contrib => contrib.type === AgentSessionProviders.Background);
				if (backgroundContrib && backgroundContrib.canDelegate !== false) {
					actions.push(this.toAction(AgentSessionProviders.Background, backgroundContrib, instantiationService, location));
				}

				// Continue in Cloud
				const cloudContrib = contributions.find(contrib => contrib.type === AgentSessionProviders.Cloud);
				if (cloudContrib && cloudContrib.canDelegate !== false) {
					actions.push(this.toAction(AgentSessionProviders.Cloud, cloudContrib, instantiationService, location));
				}

				// Offer actions to enter setup if we have no contributions
				if (actions.length === 0) {
					actions.push(this.toSetupAction(AgentSessionProviders.Background, instantiationService));
					actions.push(this.toSetupAction(AgentSessionProviders.Cloud, instantiationService));
				}

				return actions;
			}
		};
	}

	private static toAction(provider: AgentSessionProviders, contrib: IChatSessionsExtensionPoint, instantiationService: IInstantiationService, location: ActionLocation): IActionWidgetDropdownAction {
		return {
			id: contrib.type,
			enabled: true,
			icon: getAgentSessionProviderIcon(provider),
			class: undefined,
			description: `@${contrib.name}`,
			label: getAgentSessionProviderName(provider),
			tooltip: localize('continueSessionIn', "Continue in {0}", getAgentSessionProviderName(provider)),
			category: { label: localize('continueIn', "Continue In"), order: 0, showHeader: true },
			run: () => instantiationService.invokeFunction(accessor => {
				if (location === ActionLocation.Editor) {
					return new CreateRemoteAgentJobFromEditorAction().run(accessor, contrib);
				}
				return new CreateRemoteAgentJobAction().run(accessor, contrib);
			})
		};
	}

	private static toSetupAction(provider: AgentSessionProviders, instantiationService: IInstantiationService): IActionWidgetDropdownAction {
		return {
			id: provider,
			enabled: true,
			icon: getAgentSessionProviderIcon(provider),
			class: undefined,
			label: getAgentSessionProviderName(provider),
			tooltip: localize('continueSessionIn', "Continue in {0}", getAgentSessionProviderName(provider)),
			category: { label: localize('continueIn', "Continue In"), order: 0, showHeader: true },
			run: () => instantiationService.invokeFunction(accessor => {
				const commandService = accessor.get(ICommandService);
				return commandService.executeCommand(CHAT_SETUP_ACTION_ID);
			})
		};
	}

	protected override renderLabel(element: HTMLElement): IDisposable | null {
		if (this.location === ActionLocation.Editor) {
			const view = h('span.action-widget-delegate-label', [
				h('span', { className: ThemeIcon.asClassName(Codicon.forward) }),
				h('span', [localize('continueInEllipsis', "Continue in...")])
			]);
			element.appendChild(view.root);
			return null;
		} else {
			const icon = this.contextKeyService.contextMatchesRules(ChatContextKeys.remoteJobCreating) ? Codicon.sync : Codicon.forward;
			element.classList.add(...ThemeIcon.asClassNameArray(icon));
			return super.renderLabel(element);
		}
	}
}

const NEW_CHAT_SESSION_ACTION_ID = 'workbench.action.chat.openNewSessionEditor';

class CreateRemoteAgentJobAction {
	constructor() { }

	private openUntitledEditor(commandService: ICommandService, continuationTarget: IChatSessionsExtensionPoint) {
		commandService.executeCommand(`${NEW_CHAT_SESSION_ACTION_ID}.${continuationTarget.type}`);
	}

	async run(accessor: ServicesAccessor, continuationTarget: IChatSessionsExtensionPoint) {
		const contextKeyService = accessor.get(IContextKeyService);
		const commandService = accessor.get(ICommandService);
		const widgetService = accessor.get(IChatWidgetService);
		const chatAgentService = accessor.get(IChatAgentService);
		const chatService = accessor.get(IChatService);
		const editorService = accessor.get(IEditorService);

		const remoteJobCreatingKey = ChatContextKeys.remoteJobCreating.bindTo(contextKeyService);

		try {
			remoteJobCreatingKey.set(true);

			const widget = widgetService.lastFocusedWidget;
			if (!widget || !widget.viewModel) {
				return this.openUntitledEditor(commandService, continuationTarget);
			}

			// todo@connor4312: remove 'as' cast
			const chatModel = widget.viewModel.model as ChatModel;
			if (!chatModel) {
				return;
			}

			const sessionResource = widget.viewModel.sessionResource;
			const chatRequests = chatModel.getRequests();
			let userPrompt = widget.getInput();
			if (!userPrompt) {
				if (!chatRequests.length) {
					return this.openUntitledEditor(commandService, continuationTarget);
				}
				userPrompt = 'implement this.';
			}

			const attachedContext = widget.input.getAttachedAndImplicitContext(sessionResource);
			widget.input.acceptInput(true);

			// For inline editor mode, add selection or cursor information
			if (widget.location === ChatAgentLocation.EditorInline) {
				const activeEditor = editorService.activeTextEditorControl;
				if (activeEditor) {
					const model = activeEditor.getModel();
					let activeEditorUri: URI | undefined = undefined;
					if (model && isITextModel(model)) {
						activeEditorUri = model.uri as URI;
					}
					const selection = activeEditor.getSelection();
					if (activeEditorUri && selection) {
						attachedContext.add({
							kind: 'file',
							id: 'vscode.implicit.selection',
							name: basename(activeEditorUri),
							value: {
								uri: activeEditorUri,
								range: selection
							},
						});
					}
				}
			}

			const defaultAgent = chatAgentService.getDefaultAgent(ChatAgentLocation.Chat);
			const instantiationService = accessor.get(IInstantiationService);
			const requestParser = instantiationService.createInstance(ChatRequestParser);
			const continuationTargetType = continuationTarget.type;

			// Add the request to the model first
			const parsedRequest = requestParser.parseChatRequest(sessionResource, userPrompt, ChatAgentLocation.Chat);
			const addedRequest = chatModel.addRequest(
				parsedRequest,
				{ variables: attachedContext.asArray() },
				0,
				undefined,
				defaultAgent
			);

			await chatService.removeRequest(sessionResource, addedRequest.id);
			const requestData = await chatService.sendRequest(sessionResource, userPrompt, {
				agentIdSilent: continuationTargetType,
				attachedContext: attachedContext.asArray(),
				userSelectedModelId: widget.input.currentLanguageModel,
				...widget.getModeRequestOptions()
			});

			if (requestData) {
				await widget.handleDelegationExitIfNeeded(defaultAgent, requestData.agent);
			}
		} catch (e) {
			console.error('Error creating remote coding agent job', e);
			throw e;
		} finally {
			remoteJobCreatingKey.set(false);
		}
	}
}

class CreateRemoteAgentJobFromEditorAction {
	constructor() { }

	async run(accessor: ServicesAccessor, continuationTarget: IChatSessionsExtensionPoint) {

		try {
			const editorService = accessor.get(IEditorService);
			const activeEditor = editorService.activeTextEditorControl;
			const commandService = accessor.get(ICommandService);

			if (!activeEditor) {
				return;
			}
			const model = activeEditor.getModel();
			if (!model || !isITextModel(model)) {
				return;
			}
			const uri = model.uri;
			const attachedContext = [toPromptFileVariableEntry(uri, PromptFileVariableKind.PromptFile, undefined, false, [])];
			const prompt = `Follow instructions in [${basename(uri)}](${uri.toString()}).`;
			await commandService.executeCommand(`${NEW_CHAT_SESSION_ACTION_ID}.${continuationTarget.type}`, { prompt, attachedContext });
		} catch (e) {
			console.error('Error creating remote agent job from editor', e);
			throw e;
		}
	}
}

export class ContinueChatInSessionActionRendering extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'chat.continueChatInSessionActionRendering';

	constructor(
		@IActionViewItemService actionViewItemService: IActionViewItemService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();
		const disposable = actionViewItemService.register(MenuId.EditorContent, ContinueChatInSessionAction.ID, (action, options, instantiationService2) => {
			if (!(action instanceof MenuItemAction)) {
				return undefined;
			}
			return instantiationService.createInstance(ChatContinueInSessionActionItem, action, ActionLocation.Editor);
		});
		markAsSingleton(disposable);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatCopyActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatCopyActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { localize2 } from '../../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { katexContainerClassName, katexContainerLatexAttributeName } from '../../../markdown/common/markedKatexExtension.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { IChatRequestViewModel, IChatResponseViewModel, isChatTreeItem, isRequestVM, isResponseVM } from '../../common/chatViewModel.js';
import { ChatTreeItem, IChatWidgetService } from '../chat.js';
import { CHAT_CATEGORY, stringifyItem } from './chatActions.js';

export function registerChatCopyActions() {
	registerAction2(class CopyAllAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.copyAll',
				title: localize2('interactive.copyAll.label', "Copy All"),
				f1: false,
				category: CHAT_CATEGORY,
				menu: {
					id: MenuId.ChatContext,
					when: ChatContextKeys.responseIsFiltered.negate(),
					group: 'copy',
				}
			});
		}

		run(accessor: ServicesAccessor, context?: ChatTreeItem) {
			const clipboardService = accessor.get(IClipboardService);
			const chatWidgetService = accessor.get(IChatWidgetService);
			const widget = (context?.sessionResource && chatWidgetService.getWidgetBySessionResource(context.sessionResource)) || chatWidgetService.lastFocusedWidget;
			if (widget) {
				const viewModel = widget.viewModel;
				const sessionAsText = viewModel?.getItems()
					.filter((item): item is (IChatRequestViewModel | IChatResponseViewModel) => isRequestVM(item) || (isResponseVM(item) && !item.errorDetails?.responseIsFiltered))
					.map(item => stringifyItem(item))
					.join('\n\n');
				if (sessionAsText) {
					clipboardService.writeText(sessionAsText);
				}
			}
		}
	});

	registerAction2(class CopyItemAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.copyItem',
				title: localize2('interactive.copyItem.label', "Copy"),
				f1: false,
				category: CHAT_CATEGORY,
				menu: {
					id: MenuId.ChatContext,
					when: ChatContextKeys.responseIsFiltered.negate(),
					group: 'copy',
				}
			});
		}

		async run(accessor: ServicesAccessor, ...args: unknown[]) {
			const chatWidgetService = accessor.get(IChatWidgetService);
			const clipboardService = accessor.get(IClipboardService);

			const widget = chatWidgetService.lastFocusedWidget;
			let item = args[0] as ChatTreeItem | undefined;
			if (!isChatTreeItem(item)) {
				item = widget?.getFocus();
				if (!item) {
					return;
				}
			}

			// If there is a text selection, and focus is inside the widget, copy the selected text.
			// Otherwise, context menu with no selection -> copy the full item
			const nativeSelection = dom.getActiveWindow().getSelection();
			const selectedText = nativeSelection?.toString();
			if (widget && selectedText && selectedText.length > 0 && dom.isAncestor(dom.getActiveElement(), widget.domNode)) {
				await clipboardService.writeText(selectedText);
				return;
			}

			const text = stringifyItem(item, false);
			await clipboardService.writeText(text);
		}
	});

	registerAction2(class CopyKatexMathSourceAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.copyKatexMathSource',
				title: localize2('chat.copyKatexMathSource.label', "Copy Math Source"),
				f1: false,
				category: CHAT_CATEGORY,
				menu: {
					id: MenuId.ChatContext,
					group: 'copy',
					when: ChatContextKeys.isKatexMathElement,
				}
			});
		}

		async run(accessor: ServicesAccessor, ...args: unknown[]) {
			const chatWidgetService = accessor.get(IChatWidgetService);
			const clipboardService = accessor.get(IClipboardService);

			const widget = chatWidgetService.lastFocusedWidget;
			let item = args[0] as ChatTreeItem | undefined;
			if (!isChatTreeItem(item)) {
				item = widget?.getFocus();
				if (!item) {
					return;
				}
			}

			// Try to find a KaTeX element from the selection or active element
			let selectedElement: Node | null = null;

			// If there is a selection, and focus is inside the widget, extract the inner KaTeX element.
			const activeElement = dom.getActiveElement();
			const nativeSelection = dom.getActiveWindow().getSelection();
			if (widget && nativeSelection && nativeSelection.rangeCount > 0 && dom.isAncestor(activeElement, widget.domNode)) {
				const range = nativeSelection.getRangeAt(0);
				selectedElement = range.commonAncestorContainer;

				// If it's a text node, get its parent element
				if (selectedElement.nodeType === Node.TEXT_NODE) {
					selectedElement = selectedElement.parentElement;
				}
			}

			// Otherwise, fallback to querying from the active element
			if (!selectedElement) {
				// eslint-disable-next-line no-restricted-syntax
				selectedElement = activeElement?.querySelector(`.${katexContainerClassName}`) ?? null;
			}

			// Extract the LaTeX source from the annotation element
			const katexElement = dom.isHTMLElement(selectedElement) ? selectedElement.closest(`.${katexContainerClassName}`) : null;
			const latexSource = katexElement?.getAttribute(katexContainerLatexAttributeName) || '';
			if (latexSource) {
				await clipboardService.writeText(latexSource);
			}
		}
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatDeveloperActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatDeveloperActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../base/common/codicons.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { localize2 } from '../../../../../nls.js';
import { Categories } from '../../../../../platform/action/common/actionCommonCategories.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { IChatService } from '../../common/chatService.js';
import { IChatWidgetService } from '../chat.js';

export function registerChatDeveloperActions() {
	registerAction2(LogChatInputHistoryAction);
	registerAction2(LogChatIndexAction);
}

class LogChatInputHistoryAction extends Action2 {
	static readonly ID = 'workbench.action.chat.logInputHistory';

	constructor() {
		super({
			id: LogChatInputHistoryAction.ID,
			title: localize2('workbench.action.chat.logInputHistory.label', "Log Chat Input History"),
			icon: Codicon.attach,
			category: Categories.Developer,
			f1: true,
			precondition: ChatContextKeys.enabled
		});
	}

	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const chatWidgetService = accessor.get(IChatWidgetService);
		chatWidgetService.lastFocusedWidget?.logInputHistory();
	}
}

class LogChatIndexAction extends Action2 {
	static readonly ID = 'workbench.action.chat.logChatIndex';

	constructor() {
		super({
			id: LogChatIndexAction.ID,
			title: localize2('workbench.action.chat.logChatIndex.label', "Log Chat Index"),
			icon: Codicon.attach,
			category: Categories.Developer,
			f1: true,
			precondition: ChatContextKeys.enabled
		});
	}

	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const chatService = accessor.get(IChatService);
		chatService.logChatIndex();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatElicitationActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatElicitationActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { localize2 } from '../../../../../nls.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { ElicitationState } from '../../common/chatService.js';
import { isResponseVM } from '../../common/chatViewModel.js';
import { IChatWidgetService } from '../chat.js';
import { CHAT_CATEGORY } from './chatActions.js';

export const AcceptElicitationRequestActionId = 'workbench.action.chat.acceptElicitation';

class AcceptElicitationRequestAction extends Action2 {
	constructor() {
		super({
			id: AcceptElicitationRequestActionId,
			title: localize2('chat.acceptElicitation', "Accept Request"),
			f1: false,
			category: CHAT_CATEGORY,
			keybinding: {
				when: ContextKeyExpr.and(ChatContextKeys.inChatSession, ChatContextKeys.Editing.hasElicitationRequest),
				primary: KeyMod.CtrlCmd | KeyCode.Enter,
				weight: KeybindingWeight.WorkbenchContrib + 1,
			},
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const chatWidgetService = accessor.get(IChatWidgetService);
		const widget = chatWidgetService.lastFocusedWidget;
		if (!widget) {
			return;
		}

		const items = widget.viewModel?.getItems();
		if (!items?.length) {
			return;
		}

		for (let i = items.length - 1; i >= 0; i--) {
			const item = items[i];
			if (!isResponseVM(item)) {
				continue;
			}

			for (const content of item.response.value) {
				if (content.kind === 'elicitation2' && content.state.get() === ElicitationState.Pending) {
					await content.accept(true);
					widget.focusInput();
					return;
				}
			}
		}
	}
}

export function registerChatElicitationActions(): void {
	registerAction2(AcceptElicitationRequestAction);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatExecuteActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatExecuteActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../base/common/codicons.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { basename } from '../../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { assertType } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { EditorContextKeys } from '../../../../../editor/common/editorContextKeys.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { IChatMode, IChatModeService } from '../../common/chatModes.js';
import { chatVariableLeader } from '../../common/chatParserTypes.js';
import { IChatService } from '../../common/chatService.js';
import { ChatAgentLocation, ChatConfiguration, ChatModeKind, } from '../../common/constants.js';
import { ILanguageModelChatMetadata } from '../../common/languageModels.js';
import { ILanguageModelToolsService } from '../../common/languageModelToolsService.js';
import { IChatWidget, IChatWidgetService } from '../chat.js';
import { getEditingSessionContext } from '../chatEditing/chatEditingActions.js';
import { ctxHasEditorModification } from '../chatEditing/chatEditingEditorContextKeys.js';
import { ACTION_ID_NEW_CHAT, CHAT_CATEGORY, handleCurrentEditingSession, handleModeSwitch } from './chatActions.js';
import { ContinueChatInSessionAction } from './chatContinueInAction.js';

export interface IVoiceChatExecuteActionContext {
	readonly disableTimeout?: boolean;
}

export interface IChatExecuteActionContext {
	widget?: IChatWidget;
	inputValue?: string;
	voice?: IVoiceChatExecuteActionContext;
}

abstract class SubmitAction extends Action2 {
	async run(accessor: ServicesAccessor, ...args: unknown[]) {
		const context = args[0] as IChatExecuteActionContext | undefined;
		const telemetryService = accessor.get(ITelemetryService);
		const widgetService = accessor.get(IChatWidgetService);
		const widget = context?.widget ?? widgetService.lastFocusedWidget;
		if (widget?.viewModel?.editing) {
			const configurationService = accessor.get(IConfigurationService);
			const dialogService = accessor.get(IDialogService);
			const chatService = accessor.get(IChatService);
			const chatModel = chatService.getSession(widget.viewModel.sessionResource);
			if (!chatModel) {
				return;
			}

			const session = chatModel.editingSession;
			if (!session) {
				return;
			}

			const requestId = widget.viewModel?.editing.id;

			if (requestId) {
				const chatRequests = chatModel.getRequests();
				const itemIndex = chatRequests.findIndex(request => request.id === requestId);
				const editsToUndo = chatRequests.length - itemIndex;

				const requestsToRemove = chatRequests.slice(itemIndex);
				const requestIdsToRemove = new Set(requestsToRemove.map(request => request.id));
				const entriesModifiedInRequestsToRemove = session.entries.get().filter((entry) => requestIdsToRemove.has(entry.lastModifyingRequestId)) ?? [];
				const shouldPrompt = entriesModifiedInRequestsToRemove.length > 0 && configurationService.getValue('chat.editing.confirmEditRequestRemoval') === true;

				let message: string;
				if (editsToUndo === 1) {
					if (entriesModifiedInRequestsToRemove.length === 1) {
						message = localize('chat.removeLast.confirmation.message2', "This will remove your last request and undo the edits made to {0}. Do you want to proceed?", basename(entriesModifiedInRequestsToRemove[0].modifiedURI));
					} else {
						message = localize('chat.removeLast.confirmation.multipleEdits.message', "This will remove your last request and undo edits made to {0} files in your working set. Do you want to proceed?", entriesModifiedInRequestsToRemove.length);
					}
				} else {
					if (entriesModifiedInRequestsToRemove.length === 1) {
						message = localize('chat.remove.confirmation.message2', "This will remove all subsequent requests and undo edits made to {0}. Do you want to proceed?", basename(entriesModifiedInRequestsToRemove[0].modifiedURI));
					} else {
						message = localize('chat.remove.confirmation.multipleEdits.message', "This will remove all subsequent requests and undo edits made to {0} files in your working set. Do you want to proceed?", entriesModifiedInRequestsToRemove.length);
					}
				}

				const confirmation = shouldPrompt
					? await dialogService.confirm({
						title: editsToUndo === 1
							? localize('chat.removeLast.confirmation.title', "Do you want to undo your last edit?")
							: localize('chat.remove.confirmation.title', "Do you want to undo {0} edits?", editsToUndo),
						message: message,
						primaryButton: localize('chat.remove.confirmation.primaryButton', "Yes"),
						checkbox: { label: localize('chat.remove.confirmation.checkbox', "Don't ask again"), checked: false },
						type: 'info'
					})
					: { confirmed: true };

				type EditUndoEvent = {
					editRequestType: string;
					outcome: 'cancelled' | 'applied';
					editsUndoCount: number;
				};

				type EditUndoEventClassification = {
					owner: 'justschen';
					comment: 'Event used to gain insights into when there are pending changes to undo, and whether edited requests are applied or cancelled.';
					editRequestType: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Current entry point for editing a request.' };
					outcome: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the edit was cancelled or applied.' };
					editsUndoCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Number of edits that would be undone.'; 'isMeasurement': true };
				};

				if (!confirmation.confirmed) {
					telemetryService.publicLog2<EditUndoEvent, EditUndoEventClassification>('chat.undoEditsConfirmation', {
						editRequestType: configurationService.getValue<string>('chat.editRequests'),
						outcome: 'cancelled',
						editsUndoCount: editsToUndo
					});
					return;
				} else if (editsToUndo > 0) {
					telemetryService.publicLog2<EditUndoEvent, EditUndoEventClassification>('chat.undoEditsConfirmation', {
						editRequestType: configurationService.getValue<string>('chat.editRequests'),
						outcome: 'applied',
						editsUndoCount: editsToUndo
					});
				}

				if (confirmation.checkboxChecked) {
					await configurationService.updateValue('chat.editing.confirmEditRequestRemoval', false);
				}

				// Restore the snapshot to what it was before the request(s) that we deleted
				const snapshotRequestId = chatRequests[itemIndex].id;
				await session.restoreSnapshot(snapshotRequestId, undefined);
			}
		} else if (widget?.viewModel?.model.checkpoint) {
			widget.viewModel.model.setCheckpoint(undefined);
		}
		widget?.acceptInput(context?.inputValue);
	}
}

const whenNotInProgress = ChatContextKeys.requestInProgress.negate();

export class ChatSubmitAction extends SubmitAction {
	static readonly ID = 'workbench.action.chat.submit';

	constructor() {
		const menuCondition = ChatContextKeys.chatModeKind.isEqualTo(ChatModeKind.Ask);
		const precondition = ContextKeyExpr.and(
			ChatContextKeys.inputHasText,
			whenNotInProgress,
		);

		super({
			id: ChatSubmitAction.ID,
			title: localize2('interactive.submit.label', "Send"),
			f1: false,
			category: CHAT_CATEGORY,
			icon: Codicon.send,
			precondition,
			toggled: {
				condition: ChatContextKeys.lockedToCodingAgent,
				icon: Codicon.send,
				tooltip: localize('sendToAgent', "Send to Agent"),
			},
			keybinding: {
				when: ContextKeyExpr.and(
					ChatContextKeys.inChatInput,
					ChatContextKeys.withinEditSessionDiff.negate(),
				),
				primary: KeyCode.Enter,
				weight: KeybindingWeight.EditorContrib
			},
			menu: [
				{
					id: MenuId.ChatExecute,
					order: 4,
					when: ContextKeyExpr.and(
						whenNotInProgress,
						menuCondition,
						ChatContextKeys.withinEditSessionDiff.negate(),
					),
					group: 'navigation',
					alt: {
						id: 'workbench.action.chat.sendToNewChat',
						title: localize2('chat.newChat.label', "Send to New Chat"),
						icon: Codicon.plus
					}
				}, {
					id: MenuId.ChatEditorInlineExecute,
					group: 'navigation',
					order: 4,
					when: ContextKeyExpr.and(
						ContextKeyExpr.or(ctxHasEditorModification.negate(), ChatContextKeys.inputHasText),
						whenNotInProgress,
						ChatContextKeys.requestInProgress.negate(),
						menuCondition
					),
				}]
		});
	}
}

export class ChatDelegateToEditSessionAction extends Action2 {
	static readonly ID = 'workbench.action.chat.delegateToEditSession';

	constructor() {
		super({
			id: ChatDelegateToEditSessionAction.ID,
			title: localize2('interactive.submit.panel.label', "Send to Edit Session"),
			f1: false,
			category: CHAT_CATEGORY,
			icon: Codicon.commentDiscussion,
			keybinding: {
				when: ContextKeyExpr.and(
					ChatContextKeys.inChatInput,
					ChatContextKeys.withinEditSessionDiff,
				),
				primary: KeyCode.Enter,
				weight: KeybindingWeight.EditorContrib
			},
			menu: [
				{
					id: MenuId.ChatExecute,
					order: 4,
					when: ContextKeyExpr.and(
						whenNotInProgress,
						ChatContextKeys.withinEditSessionDiff,
					),
					group: 'navigation',
				}
			]
		});
	}

	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const context = args[0] as IChatExecuteActionContext | undefined;
		const widgetService = accessor.get(IChatWidgetService);
		const inlineWidget = context?.widget ?? widgetService.lastFocusedWidget;
		const locationData = inlineWidget?.locationData;

		if (inlineWidget && locationData?.type === ChatAgentLocation.EditorInline && locationData.delegateSessionResource) {
			const sessionWidget = widgetService.getWidgetBySessionResource(locationData.delegateSessionResource);

			if (sessionWidget) {
				await widgetService.reveal(sessionWidget);
				sessionWidget.attachmentModel.addContext({
					id: 'vscode.delegate.inline',
					kind: 'file',
					modelDescription: `User's chat context`,
					name: 'delegate-inline',
					value: { range: locationData.wholeRange, uri: locationData.document },
				});
				sessionWidget.acceptInput(inlineWidget.getInput(), {
					noCommandDetection: true,
					enableImplicitContext: false,
				});

				inlineWidget.setInput('');
				locationData.close();
			}
		}
	}
}

export const ToggleAgentModeActionId = 'workbench.action.chat.toggleAgentMode';

export interface IToggleChatModeArgs {
	modeId: ChatModeKind | string;
	sessionResource: URI | undefined;
}

type ChatModeChangeClassification = {
	owner: 'digitarald';
	comment: 'Reporting when agent is switched between different modes';
	fromMode?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The previous agent name' };
	mode?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The new agent name' };
	requestCount?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Number of requests in the current chat session'; 'isMeasurement': true };
	storage?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Source of the target mode (builtin, local, user, extension)' };
	extensionId?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Extension ID if the target mode is from an extension' };
	toolsCount?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Number of custom tools in the target mode'; 'isMeasurement': true };
	handoffsCount?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Number of handoffs in the target mode'; 'isMeasurement': true };
};

type ChatModeChangeEvent = {
	fromMode: string;
	mode: string;
	requestCount: number;
	storage?: string;
	extensionId?: string;
	toolsCount?: number;
	handoffsCount?: number;
};

class ToggleChatModeAction extends Action2 {

	static readonly ID = ToggleAgentModeActionId;

	constructor() {
		super({
			id: ToggleChatModeAction.ID,
			title: localize2('interactive.toggleAgent.label', "Switch to Next Agent"),
			f1: true,
			category: CHAT_CATEGORY,
			precondition: ContextKeyExpr.and(
				ChatContextKeys.enabled,
				ChatContextKeys.requestInProgress.negate())
		});
	}

	async run(accessor: ServicesAccessor, ...args: unknown[]) {
		const commandService = accessor.get(ICommandService);
		const configurationService = accessor.get(IConfigurationService);
		const instaService = accessor.get(IInstantiationService);
		const modeService = accessor.get(IChatModeService);
		const telemetryService = accessor.get(ITelemetryService);
		const chatWidgetService = accessor.get(IChatWidgetService);

		const arg = args.at(0) as IToggleChatModeArgs | undefined;
		let widget: IChatWidget | undefined;
		if (arg?.sessionResource) {
			widget = chatWidgetService.getWidgetBySessionResource(arg.sessionResource);
		} else {
			widget = getEditingSessionContext(accessor, args)?.chatWidget;
		}

		if (!widget) {
			return;
		}

		const chatSession = widget.viewModel?.model;
		const requestCount = chatSession?.getRequests().length ?? 0;
		const switchToMode = (arg && modeService.findModeById(arg.modeId)) ?? this.getNextMode(widget, requestCount, configurationService, modeService);

		const currentMode = widget.input.currentModeObs.get();
		if (switchToMode.id === currentMode.id) {
			return;
		}

		const chatModeCheck = await instaService.invokeFunction(handleModeSwitch, widget.input.currentModeKind, switchToMode.kind, requestCount, widget.viewModel?.model);
		if (!chatModeCheck) {
			return;
		}

		// Send telemetry for mode change
		const storage = switchToMode.source?.storage ?? 'builtin';
		const extensionId = switchToMode.source?.storage === 'extension' ? switchToMode.source.extensionId.value : undefined;
		const toolsCount = switchToMode.customTools?.get()?.length ?? 0;
		const handoffsCount = switchToMode.handOffs?.get()?.length ?? 0;

		telemetryService.publicLog2<ChatModeChangeEvent, ChatModeChangeClassification>('chat.modeChange', {
			fromMode: currentMode.name.get(),
			mode: switchToMode.name.get(),
			requestCount: requestCount,
			storage,
			extensionId,
			toolsCount,
			handoffsCount
		});

		widget.input.setChatMode(switchToMode.id);

		if (chatModeCheck.needToClearSession) {
			await commandService.executeCommand(ACTION_ID_NEW_CHAT);
		}
	}

	private getNextMode(chatWidget: IChatWidget, requestCount: number, configurationService: IConfigurationService, modeService: IChatModeService): IChatMode {
		const modes = modeService.getModes();
		const flat = [
			...modes.builtin.filter(mode => {
				return mode.kind !== ChatModeKind.Edit || configurationService.getValue(ChatConfiguration.Edits2Enabled) || requestCount === 0;
			}),
			...(modes.custom ?? []),
		];

		const curModeIndex = flat.findIndex(mode => mode.id === chatWidget.input.currentModeObs.get().id);
		const newMode = flat[(curModeIndex + 1) % flat.length];
		return newMode;
	}
}

class SwitchToNextModelAction extends Action2 {
	static readonly ID = 'workbench.action.chat.switchToNextModel';

	constructor() {
		super({
			id: SwitchToNextModelAction.ID,
			title: localize2('interactive.switchToNextModel.label', "Switch to Next Model"),
			category: CHAT_CATEGORY,
			f1: true,
			precondition: ChatContextKeys.enabled,
		});
	}

	override run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const widgetService = accessor.get(IChatWidgetService);
		const widget = widgetService.lastFocusedWidget;
		widget?.input.switchToNextModel();
	}
}

export const ChatOpenModelPickerActionId = 'workbench.action.chat.openModelPicker';
class OpenModelPickerAction extends Action2 {
	static readonly ID = ChatOpenModelPickerActionId;

	constructor() {
		super({
			id: OpenModelPickerAction.ID,
			title: localize2('interactive.openModelPicker.label', "Open Model Picker"),
			category: CHAT_CATEGORY,
			f1: false,
			keybinding: {
				primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Period,
				weight: KeybindingWeight.WorkbenchContrib,
				when: ChatContextKeys.inChatInput
			},
			precondition: ChatContextKeys.enabled,
			menu: {
				id: MenuId.ChatInput,
				order: 3,
				group: 'navigation',
				when:
					ContextKeyExpr.and(
						ChatContextKeys.lockedToCodingAgent.negate(),
						ContextKeyExpr.or(
							ContextKeyExpr.equals(ChatContextKeys.location.key, ChatAgentLocation.Chat),
							ContextKeyExpr.equals(ChatContextKeys.location.key, ChatAgentLocation.EditorInline),
							ContextKeyExpr.equals(ChatContextKeys.location.key, ChatAgentLocation.Notebook),
							ContextKeyExpr.equals(ChatContextKeys.location.key, ChatAgentLocation.Terminal))
					)
			}
		});
	}

	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const widgetService = accessor.get(IChatWidgetService);
		const widget = widgetService.lastFocusedWidget;
		if (widget) {
			await widgetService.reveal(widget);
			widget.input.openModelPicker();
		}
	}
}
export class OpenModePickerAction extends Action2 {
	static readonly ID = 'workbench.action.chat.openModePicker';

	constructor() {
		super({
			id: OpenModePickerAction.ID,
			title: localize2('interactive.openModePicker.label', "Open Agent Picker"),
			tooltip: localize('setChatMode', "Set Agent"),
			category: CHAT_CATEGORY,
			f1: false,
			precondition: ChatContextKeys.enabled,
			keybinding: {
				when: ContextKeyExpr.and(
					ChatContextKeys.inChatInput,
					ChatContextKeys.location.isEqualTo(ChatAgentLocation.Chat)),
				primary: KeyMod.CtrlCmd | KeyCode.Period,
				weight: KeybindingWeight.EditorContrib
			},
			menu: [
				{
					id: MenuId.ChatInput,
					order: 1,
					when: ContextKeyExpr.and(
						ChatContextKeys.enabled,
						ChatContextKeys.location.isEqualTo(ChatAgentLocation.Chat),
						ChatContextKeys.inQuickChat.negate(),
						ChatContextKeys.lockedToCodingAgent.negate()),
					group: 'navigation',
				},
			]
		});
	}

	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const widgetService = accessor.get(IChatWidgetService);
		const widget = widgetService.lastFocusedWidget;
		if (widget) {
			widget.input.openModePicker();
		}
	}
}

export class ChatSessionPrimaryPickerAction extends Action2 {
	static readonly ID = 'workbench.action.chat.chatSessionPrimaryPicker';
	constructor() {
		super({
			id: ChatSessionPrimaryPickerAction.ID,
			title: localize2('interactive.openChatSessionPrimaryPicker.label', "Open Picker"),
			category: CHAT_CATEGORY,
			f1: false,
			precondition: ChatContextKeys.enabled,
			menu: {
				id: MenuId.ChatInput,
				order: 4,
				group: 'navigation',
				when:
					ContextKeyExpr.and(
						ChatContextKeys.lockedToCodingAgent,
						ChatContextKeys.chatSessionHasModels
					)
			}
		});
	}

	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const widgetService = accessor.get(IChatWidgetService);
		const widget = widgetService.lastFocusedWidget;
		if (widget) {
			widget.input.openChatSessionPicker();
		}
	}
}

export const ChangeChatModelActionId = 'workbench.action.chat.changeModel';
class ChangeChatModelAction extends Action2 {
	static readonly ID = ChangeChatModelActionId;

	constructor() {
		super({
			id: ChangeChatModelAction.ID,
			title: localize2('interactive.changeModel.label', "Change Model"),
			category: CHAT_CATEGORY,
			f1: false,
			precondition: ChatContextKeys.enabled,
		});
	}

	override run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const modelInfo = args[0] as Pick<ILanguageModelChatMetadata, 'vendor' | 'id' | 'family'>;
		// Type check the arg
		assertType(typeof modelInfo.vendor === 'string' && typeof modelInfo.id === 'string' && typeof modelInfo.family === 'string');
		const widgetService = accessor.get(IChatWidgetService);
		const widgets = widgetService.getAllWidgets();
		for (const widget of widgets) {
			widget.input.switchModel(modelInfo);
		}
	}
}

export class ChatEditingSessionSubmitAction extends SubmitAction {
	static readonly ID = 'workbench.action.edits.submit';

	constructor() {
		const menuCondition = ChatContextKeys.chatModeKind.notEqualsTo(ChatModeKind.Ask);
		const precondition = ContextKeyExpr.and(
			ChatContextKeys.inputHasText,
			whenNotInProgress
		);

		super({
			id: ChatEditingSessionSubmitAction.ID,
			title: localize2('edits.submit.label', "Send"),
			f1: false,
			category: CHAT_CATEGORY,
			icon: Codicon.send,
			precondition,
			menu: [
				{
					id: MenuId.ChatExecute,
					order: 4,
					when: ContextKeyExpr.and(
						ChatContextKeys.requestInProgress.negate(),
						menuCondition),
					group: 'navigation',
					alt: {
						id: 'workbench.action.chat.sendToNewChat',
						title: localize2('chat.newChat.label', "Send to New Chat"),
						icon: Codicon.plus
					}
				}]
		});
	}
}

class SubmitWithoutDispatchingAction extends Action2 {
	static readonly ID = 'workbench.action.chat.submitWithoutDispatching';

	constructor() {
		const precondition = ContextKeyExpr.and(
			ChatContextKeys.inputHasText,
			whenNotInProgress,
			ChatContextKeys.chatModeKind.isEqualTo(ChatModeKind.Ask),
		);

		super({
			id: SubmitWithoutDispatchingAction.ID,
			title: localize2('interactive.submitWithoutDispatch.label', "Send"),
			f1: false,
			category: CHAT_CATEGORY,
			precondition,
			keybinding: {
				when: ChatContextKeys.inChatInput,
				primary: KeyMod.Alt | KeyMod.Shift | KeyCode.Enter,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]) {
		const context = args[0] as IChatExecuteActionContext | undefined;

		const widgetService = accessor.get(IChatWidgetService);
		const widget = context?.widget ?? widgetService.lastFocusedWidget;
		widget?.acceptInput(context?.inputValue, { noCommandDetection: true });
	}
}

export class ChatSubmitWithCodebaseAction extends Action2 {
	static readonly ID = 'workbench.action.chat.submitWithCodebase';

	constructor() {
		const precondition = ContextKeyExpr.and(
			ChatContextKeys.inputHasText,
			whenNotInProgress,
		);

		super({
			id: ChatSubmitWithCodebaseAction.ID,
			title: localize2('actions.chat.submitWithCodebase', "Send with {0}", `${chatVariableLeader}codebase`),
			precondition,
			keybinding: {
				when: ChatContextKeys.inChatInput,
				primary: KeyMod.CtrlCmd | KeyCode.Enter,
				weight: KeybindingWeight.EditorContrib
			},
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]) {
		const context = args[0] as IChatExecuteActionContext | undefined;

		const widgetService = accessor.get(IChatWidgetService);
		const widget = context?.widget ?? widgetService.lastFocusedWidget;
		if (!widget) {
			return;
		}

		const languageModelToolsService = accessor.get(ILanguageModelToolsService);
		const codebaseTool = languageModelToolsService.getToolByName('codebase');
		if (!codebaseTool) {
			return;
		}

		widget.input.attachmentModel.addContext({
			id: codebaseTool.id,
			name: codebaseTool.displayName ?? '',
			fullName: codebaseTool.displayName ?? '',
			value: undefined,
			icon: ThemeIcon.isThemeIcon(codebaseTool.icon) ? codebaseTool.icon : undefined,
			kind: 'tool'
		});
		widget.acceptInput();
	}
}

class SendToNewChatAction extends Action2 {
	constructor() {
		const precondition = ChatContextKeys.inputHasText;

		super({
			id: 'workbench.action.chat.sendToNewChat',
			title: localize2('chat.newChat.label', "Send to New Chat"),
			precondition,
			category: CHAT_CATEGORY,
			f1: false,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Enter,
				when: ChatContextKeys.inChatInput,
			}
		});
	}

	async run(accessor: ServicesAccessor, ...args: unknown[]) {
		const context = args[0] as IChatExecuteActionContext | undefined;

		const widgetService = accessor.get(IChatWidgetService);
		const dialogService = accessor.get(IDialogService);
		const chatService = accessor.get(IChatService);
		const widget = context?.widget ?? widgetService.lastFocusedWidget;
		if (!widget) {
			return;
		}

		const inputBeforeClear = widget.getInput();

		// Cancel any in-progress request before clearing
		if (widget.viewModel) {
			chatService.cancelCurrentRequestForSession(widget.viewModel.sessionResource);
		}

		if (widget.viewModel?.model) {
			if (!(await handleCurrentEditingSession(widget.viewModel.model, undefined, dialogService))) {
				return;
			}
		}

		await widget.clear();
		widget.acceptInput(inputBeforeClear, { storeToHistory: true });
	}
}

export const CancelChatActionId = 'workbench.action.chat.cancel';
export class CancelAction extends Action2 {
	static readonly ID = CancelChatActionId;
	constructor() {
		super({
			id: CancelAction.ID,
			title: localize2('interactive.cancel.label', "Cancel"),
			f1: false,
			category: CHAT_CATEGORY,
			icon: Codicon.stopCircle,
			menu: [{
				id: MenuId.ChatExecute,
				when: ContextKeyExpr.and(
					ChatContextKeys.requestInProgress,
					ChatContextKeys.remoteJobCreating.negate()
				),
				order: 4,
				group: 'navigation',
			}, {
				id: MenuId.ChatEditorInlineExecute,
				when: ContextKeyExpr.and(
					ChatContextKeys.requestInProgress,
					ChatContextKeys.remoteJobCreating.negate()
				),
				order: 4,
				group: 'navigation',
			},
			],
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.Escape,
				win: { primary: KeyMod.Alt | KeyCode.Backspace },
			}
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]) {
		const context = args[0] as IChatExecuteActionContext | undefined;
		const widgetService = accessor.get(IChatWidgetService);
		const widget = context?.widget ?? widgetService.lastFocusedWidget;
		if (!widget) {
			return;
		}

		const chatService = accessor.get(IChatService);
		if (widget.viewModel) {
			chatService.cancelCurrentRequestForSession(widget.viewModel.sessionResource);
		}
	}
}

export const CancelChatEditId = 'workbench.edit.chat.cancel';
export class CancelEdit extends Action2 {
	static readonly ID = CancelChatEditId;
	constructor() {
		super({
			id: CancelEdit.ID,
			title: localize2('interactive.cancelEdit.label', "Cancel Edit"),
			f1: false,
			category: CHAT_CATEGORY,
			icon: Codicon.x,
			menu: [
				{
					id: MenuId.ChatMessageTitle,
					group: 'navigation',
					order: 1,
					when: ContextKeyExpr.and(ChatContextKeys.isRequest, ChatContextKeys.currentlyEditing, ContextKeyExpr.equals(`config.${ChatConfiguration.EditRequests}`, 'input'))
				}
			],
			keybinding: {
				primary: KeyCode.Escape,
				when: ContextKeyExpr.and(ChatContextKeys.inChatInput,
					EditorContextKeys.hoverVisible.toNegated(),
					EditorContextKeys.hasNonEmptySelection.toNegated(),
					EditorContextKeys.hasMultipleSelections.toNegated(),
					ContextKeyExpr.or(ChatContextKeys.currentlyEditing, ChatContextKeys.currentlyEditingInput)),
				weight: KeybindingWeight.EditorContrib - 5
			}
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]) {
		const context = args[0] as IChatExecuteActionContext | undefined;

		const widgetService = accessor.get(IChatWidgetService);
		const widget = context?.widget ?? widgetService.lastFocusedWidget;
		if (!widget) {
			return;
		}
		widget.finishedEditing();
	}
}


export function registerChatExecuteActions() {
	registerAction2(ChatSubmitAction);
	registerAction2(ChatDelegateToEditSessionAction);
	registerAction2(ChatEditingSessionSubmitAction);
	registerAction2(SubmitWithoutDispatchingAction);
	registerAction2(CancelAction);
	registerAction2(SendToNewChatAction);
	registerAction2(ChatSubmitWithCodebaseAction);
	registerAction2(ContinueChatInSessionAction);
	registerAction2(ToggleChatModeAction);
	registerAction2(SwitchToNextModelAction);
	registerAction2(OpenModelPickerAction);
	registerAction2(OpenModePickerAction);
	registerAction2(ChatSessionPrimaryPickerAction);
	registerAction2(ChangeChatModelAction);
	registerAction2(CancelEdit);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatFileTreeActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatFileTreeActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { localize2 } from '../../../../../nls.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { CHAT_CATEGORY } from './chatActions.js';
import { IChatWidgetService } from '../chat.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { IChatResponseViewModel, isResponseVM } from '../../common/chatViewModel.js';

export function registerChatFileTreeActions() {
	registerAction2(class NextFileTreeAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.nextFileTree',
				title: localize2('interactive.nextFileTree.label', "Next File Tree"),
				keybinding: {
					primary: KeyMod.CtrlCmd | KeyCode.F9,
					weight: KeybindingWeight.WorkbenchContrib,
					when: ChatContextKeys.inChatSession,
				},
				precondition: ChatContextKeys.enabled,
				f1: true,
				category: CHAT_CATEGORY,
			});
		}

		run(accessor: ServicesAccessor, ...args: unknown[]) {
			navigateTrees(accessor, false);
		}
	});

	registerAction2(class PreviousFileTreeAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.previousFileTree',
				title: localize2('interactive.previousFileTree.label', "Previous File Tree"),
				keybinding: {
					primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.F9,
					weight: KeybindingWeight.WorkbenchContrib,
					when: ChatContextKeys.inChatSession,
				},
				precondition: ChatContextKeys.enabled,
				f1: true,
				category: CHAT_CATEGORY,
			});
		}

		run(accessor: ServicesAccessor, ...args: unknown[]) {
			navigateTrees(accessor, true);
		}
	});
}

function navigateTrees(accessor: ServicesAccessor, reverse: boolean) {
	const chatWidgetService = accessor.get(IChatWidgetService);
	const widget = chatWidgetService.lastFocusedWidget;
	if (!widget) {
		return;
	}

	const focused = !widget.inputEditor.hasWidgetFocus() && widget.getFocus();
	const focusedResponse = isResponseVM(focused) ? focused : undefined;

	const currentResponse = focusedResponse ?? widget.viewModel?.getItems().reverse().find((item): item is IChatResponseViewModel => isResponseVM(item));
	if (!currentResponse) {
		return;
	}

	widget.reveal(currentResponse);
	const responseFileTrees = widget.getFileTreeInfosForResponse(currentResponse);
	const lastFocusedFileTree = widget.getLastFocusedFileTreeForResponse(currentResponse);
	const focusIdx = lastFocusedFileTree ?
		(lastFocusedFileTree.treeIndex + (reverse ? -1 : 1) + responseFileTrees.length) % responseFileTrees.length :
		reverse ? responseFileTrees.length - 1 : 0;

	responseFileTrees[focusIdx]?.focus();
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatGettingStarted.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatGettingStarted.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { IExtensionManagementService, InstallOperation } from '../../../../../platform/extensionManagement/common/extensionManagement.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { IDefaultChatAgent } from '../../../../../base/common/product.js';
import { IChatWidgetService } from '../chat.js';

export class ChatGettingStartedContribution extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.chatGettingStarted';
	private recentlyInstalled: boolean = false;

	private static readonly hideWelcomeView = 'workbench.chat.hideWelcomeView';

	constructor(
		@IProductService private readonly productService: IProductService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IStorageService private readonly storageService: IStorageService,
		@IChatWidgetService private readonly chatWidgetService: IChatWidgetService,
	) {
		super();

		const defaultChatAgent = this.productService.defaultChatAgent;
		const hideWelcomeView = this.storageService.getBoolean(ChatGettingStartedContribution.hideWelcomeView, StorageScope.APPLICATION, false);
		if (!defaultChatAgent || hideWelcomeView) {
			return;
		}

		this.registerListeners(defaultChatAgent);
	}

	private registerListeners(defaultChatAgent: IDefaultChatAgent): void {

		this._register(this.extensionManagementService.onDidInstallExtensions(async (result) => {
			for (const e of result) {
				if (ExtensionIdentifier.equals(defaultChatAgent.extensionId, e.identifier.id) && e.operation === InstallOperation.Install) {
					this.recentlyInstalled = true;
					return;
				}
			}
		}));

		this._register(this.extensionService.onDidChangeExtensionsStatus(async (event) => {
			for (const ext of event) {
				if (ExtensionIdentifier.equals(defaultChatAgent.extensionId, ext.value)) {
					const extensionStatus = this.extensionService.getExtensionsStatus();
					if (extensionStatus[ext.value].activationTimes && this.recentlyInstalled) {
						this.onDidInstallChat();
						return;
					}
				}
			}
		}));
	}

	private async onDidInstallChat() {

		// Open Chat view
		this.chatWidgetService.revealWidget();

		// Only do this once
		this.storageService.store(ChatGettingStartedContribution.hideWelcomeView, true, StorageScope.APPLICATION, StorageTarget.MACHINE);
		this.recentlyInstalled = false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatImportExport.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatImportExport.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../../base/common/buffer.js';
import { joinPath } from '../../../../../base/common/resources.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { IFileDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { CHAT_CATEGORY } from './chatActions.js';
import { IChatWidgetService } from '../chat.js';
import { IChatEditorOptions } from '../chatEditor.js';
import { ChatEditorInput } from '../chatEditorInput.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { isExportableSessionData } from '../../common/chatModel.js';
import { IChatService } from '../../common/chatService.js';
import { URI } from '../../../../../base/common/uri.js';
import { revive } from '../../../../../base/common/marshalling.js';

const defaultFileName = 'chat.json';
const filters = [{ name: localize('chat.file.label', "Chat Session"), extensions: ['json'] }];

export function registerChatExportActions() {
	registerAction2(class ExportChatAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.export',
				category: CHAT_CATEGORY,
				title: localize2('chat.export.label', "Export Chat..."),
				precondition: ChatContextKeys.enabled,
				f1: true,
			});
		}
		async run(accessor: ServicesAccessor, outputPath?: URI) {
			const widgetService = accessor.get(IChatWidgetService);
			const fileDialogService = accessor.get(IFileDialogService);
			const fileService = accessor.get(IFileService);
			const chatService = accessor.get(IChatService);

			const widget = widgetService.lastFocusedWidget;
			if (!widget || !widget.viewModel) {
				return;
			}

			if (!outputPath) {
				const defaultUri = joinPath(await fileDialogService.defaultFilePath(), defaultFileName);
				const result = await fileDialogService.showSaveDialog({
					defaultUri,
					filters
				});
				if (!result) {
					return;
				}
				outputPath = result;
			}

			const model = chatService.getSession(widget.viewModel.sessionResource);
			if (!model) {
				return;
			}

			// Using toJSON on the model
			const content = VSBuffer.fromString(JSON.stringify(model.toExport(), undefined, 2));
			await fileService.writeFile(outputPath, content);
		}
	});

	registerAction2(class ImportChatAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.import',
				title: localize2('chat.import.label', "Import Chat..."),
				category: CHAT_CATEGORY,
				precondition: ChatContextKeys.enabled,
				f1: true,
			});
		}
		async run(accessor: ServicesAccessor, ...args: unknown[]) {
			const fileDialogService = accessor.get(IFileDialogService);
			const fileService = accessor.get(IFileService);
			const widgetService = accessor.get(IChatWidgetService);

			const defaultUri = joinPath(await fileDialogService.defaultFilePath(), defaultFileName);
			const result = await fileDialogService.showOpenDialog({
				defaultUri,
				canSelectFiles: true,
				filters
			});
			if (!result) {
				return;
			}

			const content = await fileService.readFile(result[0]);
			try {
				const data = revive(JSON.parse(content.value.toString()));
				if (!isExportableSessionData(data)) {
					throw new Error('Invalid chat session data');
				}

				const options: IChatEditorOptions = { target: { data }, pinned: true };
				await widgetService.openSession(ChatEditorInput.getNewEditorUri(), undefined, options);
			} catch (err) {
				throw err;
			}
		}
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatLanguageModelActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatLanguageModelActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Action2, MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputService, IQuickPickItem, QuickPickInput } from '../../../../../platform/quickinput/common/quickInput.js';
import { ILanguageModelsService } from '../../common/languageModels.js';
import { IAuthenticationAccessService } from '../../../../services/authentication/browser/authenticationAccessService.js';
import { localize, localize2 } from '../../../../../nls.js';
import { AllowedExtension, INTERNAL_AUTH_PROVIDER_PREFIX } from '../../../../services/authentication/common/authentication.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { CHAT_CATEGORY } from './chatActions.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';
import { IExtensionsWorkbenchService } from '../../../extensions/common/extensions.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';

class ManageLanguageModelAuthenticationAction extends Action2 {
	static readonly ID = 'workbench.action.chat.manageLanguageModelAuthentication';

	constructor() {
		super({
			id: ManageLanguageModelAuthenticationAction.ID,
			title: localize2('manageLanguageModelAuthentication', 'Manage Language Model Access...'),
			category: CHAT_CATEGORY,
			precondition: ChatContextKeys.enabled,
			menu: [{
				id: MenuId.AccountsContext,
				order: 100,
			}],
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const quickInputService = accessor.get(IQuickInputService);
		const languageModelsService = accessor.get(ILanguageModelsService);
		const authenticationAccessService = accessor.get(IAuthenticationAccessService);
		const dialogService = accessor.get(IDialogService);
		const extensionService = accessor.get(IExtensionService);
		const extensionsWorkbenchService = accessor.get(IExtensionsWorkbenchService);
		const productService = accessor.get(IProductService);

		// Get all registered language models
		const modelIds = languageModelsService.getLanguageModelIds();

		// Group models by owning extension and collect all allowed extensions
		const extensionAuth = new Map<string, AllowedExtension[]>();

		const ownerToAccountLabel = new Map<string, string>();
		for (const modelId of modelIds) {
			const model = languageModelsService.lookupLanguageModel(modelId);
			if (!model?.auth) {
				continue; // Skip if model is not found
			}
			const ownerId = model.extension.value;
			if (extensionAuth.has(ownerId)) {
				// If the owner already exists, just continue
				continue;
			}

			// Get allowed extensions for this model's auth provider
			try {
				// Use providerLabel as the providerId and accountLabel (or default)
				const providerId = INTERNAL_AUTH_PROVIDER_PREFIX + ownerId;
				const accountLabel = model.auth.accountLabel || 'Language Models';
				ownerToAccountLabel.set(ownerId, accountLabel);
				const allowedExtensions = authenticationAccessService.readAllowedExtensions(
					providerId,
					accountLabel
				).filter(ext => !ext.trusted); // Filter out trusted extensions because those should not be modified

				if (productService.trustedExtensionAuthAccess && !Array.isArray(productService.trustedExtensionAuthAccess)) {
					const trustedExtensions = productService.trustedExtensionAuthAccess[providerId];
					// If the provider is trusted, add all trusted extensions to the allowed list
					for (const ext of trustedExtensions) {
						const index = allowedExtensions.findIndex(a => a.id === ext);
						if (index !== -1) {
							allowedExtensions.splice(index, 1);
						}
						const extension = await extensionService.getExtension(ext);
						if (!extension) {
							continue; // Skip if the extension is not found
						}
						allowedExtensions.push({
							id: ext,
							name: extension.displayName || extension.name,
							allowed: true, // Assume trusted extensions are allowed by default
							trusted: true // Mark as trusted
						});
					}
				}

				// Only grab extensions that are gettable from the extension service
				const filteredExtensions = new Array<AllowedExtension>();
				for (const ext of allowedExtensions) {
					if (await extensionService.getExtension(ext.id)) {
						filteredExtensions.push(ext);
					}
				}

				extensionAuth.set(ownerId, filteredExtensions);
				// Add all allowed extensions to the set for this owner
			} catch (error) {
				// Handle error by ensuring the owner is in the map
				if (!extensionAuth.has(ownerId)) {
					extensionAuth.set(ownerId, []);
				}
			}
		}

		if (extensionAuth.size === 0) {
			dialogService.prompt({
				type: 'info',
				message: localize('noLanguageModels', 'No language models requiring authentication found.'),
				detail: localize('noLanguageModelsDetail', 'There are currently no language models that require authentication.')
			});
			return;
		}

		const items: QuickPickInput<IQuickPickItem & { extension?: AllowedExtension; ownerId?: string }>[] = [];
		// Create QuickPick items grouped by owner extension
		for (const [ownerId, allowedExtensions] of extensionAuth) {
			const extension = await extensionService.getExtension(ownerId);
			if (!extension) {
				// If the extension is not found, skip it
				continue;
			}
			// Add separator for the owning extension
			items.push({
				type: 'separator',
				id: ownerId,
				label: localize('extensionOwner', '{0}', extension.displayName || extension.name),
				buttons: [{
					iconClass: ThemeIcon.asClassName(Codicon.info),
					tooltip: localize('openExtension', 'Open Extension'),
				}]
			});

			// Add allowed extensions as checkboxes (visual representation)
			let addedTrustedSeparator = false;
			if (allowedExtensions.length > 0) {
				for (const allowedExt of allowedExtensions) {
					if (allowedExt.trusted && !addedTrustedSeparator) {
						items.push({
							type: 'separator',
							label: localize('trustedExtension', 'Trusted by Microsoft'),
						});
						addedTrustedSeparator = true;
					}
					items.push({
						label: allowedExt.name,
						ownerId,
						id: allowedExt.id,
						picked: allowedExt.allowed ?? false,
						extension: allowedExt,
						disabled: allowedExt.trusted, // Don't allow toggling trusted extensions
						buttons: [{
							iconClass: ThemeIcon.asClassName(Codicon.info),
							tooltip: localize('openExtension', 'Open Extension'),
						}]
					});
				}
			} else {
				items.push({
					label: localize('noAllowedExtensions', 'No extensions have access'),
					description: localize('noAccessDescription', 'No extensions are currently allowed to use models from {0}', ownerId),
					pickable: false
				});
			}
		}

		// Show the QuickPick
		const result = await quickInputService.pick(
			items,
			{
				canPickMany: true,
				sortByLabel: true,
				onDidTriggerSeparatorButton(context) {
					// Handle separator button clicks
					const extId = context.separator.id;
					if (extId) {
						// Open the extension in the editor
						void extensionsWorkbenchService.open(extId);
					}
				},
				onDidTriggerItemButton(context) {
					// Handle item button clicks
					const extId = context.item.id;
					if (extId) {
						// Open the extension in the editor
						void extensionsWorkbenchService.open(extId);
					}
				},
				title: localize('languageModelAuthTitle', 'Manage Language Model Access'),
				placeHolder: localize('languageModelAuthPlaceholder', 'Choose which extensions can access language models'),
			}
		);
		if (!result) {
			return;
		}

		for (const [ownerId, allowedExtensions] of extensionAuth) {
			// diff with result to find out which extensions are allowed or not
			// but we need to only look at the result items that have the ownerId
			const allowedSet = new Set(result
				.filter(item => item.ownerId === ownerId)
				// only save items that are not trusted automatically
				.filter(item => !item.extension?.trusted)
				.map(item => item.id!));

			for (const allowedExt of allowedExtensions) {
				allowedExt.allowed = allowedSet.has(allowedExt.id);
			}

			authenticationAccessService.updateAllowedExtensions(
				INTERNAL_AUTH_PROVIDER_PREFIX + ownerId,
				ownerToAccountLabel.get(ownerId) || 'Language Models',
				allowedExtensions
			);
		}

	}
}

export function registerLanguageModelActions() {
	registerAction2(ManageLanguageModelAuthenticationAction);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatMoveActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatMoveActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { URI } from '../../../../../base/common/uri.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2, MenuId, MenuRegistry, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, ContextKeyExpression } from '../../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { ActiveEditorContext } from '../../../../common/contextkeys.js';
import { ViewContainerLocation } from '../../../../common/views.js';
import { IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { ACTIVE_GROUP, AUX_WINDOW_GROUP, IEditorService } from '../../../../services/editor/common/editorService.js';
import { IViewsService } from '../../../../services/views/common/viewsService.js';
import { isChatViewTitleActionContext } from '../../common/chatActions.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { ChatAgentLocation } from '../../common/constants.js';
import { ChatViewId, IChatWidgetService } from '../chat.js';
import { ChatEditor, IChatEditorOptions } from '../chatEditor.js';
import { ChatEditorInput } from '../chatEditorInput.js';
import { ChatViewPane } from '../chatViewPane.js';
import { CHAT_CATEGORY } from './chatActions.js';

enum MoveToNewLocation {
	Editor = 'Editor',
	Window = 'Window'
}

export function registerMoveActions() {
	registerAction2(class GlobalMoveToEditorAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.openInEditor',
				title: localize2('chat.openInEditor.label', "Move Chat into Editor Area"),
				category: CHAT_CATEGORY,
				precondition: ChatContextKeys.enabled,
				f1: true,
				menu: {
					id: MenuId.ViewTitle,
					when: ContextKeyExpr.equals('view', ChatViewId),
					order: 0,
					group: '1_open'
				},
			});
		}

		async run(accessor: ServicesAccessor, ...args: unknown[]) {
			const context = args[0];
			executeMoveToAction(accessor, MoveToNewLocation.Editor, isChatViewTitleActionContext(context) ? context.sessionResource : undefined);
		}
	});

	registerAction2(class GlobalMoveToNewWindowAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.openInNewWindow',
				title: localize2('chat.openInNewWindow.label', "Move Chat into New Window"),
				category: CHAT_CATEGORY,
				precondition: ChatContextKeys.enabled,
				f1: true,
				menu: {
					id: MenuId.ViewTitle,
					when: ContextKeyExpr.equals('view', ChatViewId),
					order: 0,
					group: '1_open'
				},
			});
		}

		async run(accessor: ServicesAccessor, ...args: unknown[]) {
			const context = args[0];
			executeMoveToAction(accessor, MoveToNewLocation.Window, isChatViewTitleActionContext(context) ? context.sessionResource : undefined);
		}
	});

	registerAction2(class GlobalMoveToSidebarAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.openInSidebar',
				title: localize2('interactiveSession.openInSidebar.label', "Move Chat into Side Bar"),
				category: CHAT_CATEGORY,
				precondition: ChatContextKeys.enabled,
				f1: true
			});
		}

		async run(accessor: ServicesAccessor, ...args: unknown[]) {
			return moveToSidebar(accessor);
		}
	});

	function appendOpenChatInViewMenuItem(menuId: MenuId, title: string, icon: ThemeIcon, locationContextKey: ContextKeyExpression) {
		MenuRegistry.appendMenuItem(menuId, {
			command: { id: 'workbench.action.chat.openInSidebar', title, icon },
			when: ContextKeyExpr.and(
				ActiveEditorContext.isEqualTo(ChatEditorInput.EditorID),
				locationContextKey
			),
			group: menuId === MenuId.CompactWindowEditorTitle ? 'navigation' : undefined,
			order: 0
		});
	}

	[MenuId.EditorTitle, MenuId.CompactWindowEditorTitle].forEach(id => {
		appendOpenChatInViewMenuItem(id, localize('interactiveSession.openInSecondarySidebar.label', "Move Chat into Secondary Side Bar"), Codicon.layoutSidebarRightDock, ChatContextKeys.panelLocation.isEqualTo(ViewContainerLocation.AuxiliaryBar));
		appendOpenChatInViewMenuItem(id, localize('interactiveSession.openInPrimarySidebar.label', "Move Chat into Primary Side Bar"), Codicon.layoutSidebarLeftDock, ChatContextKeys.panelLocation.isEqualTo(ViewContainerLocation.Sidebar));
		appendOpenChatInViewMenuItem(id, localize('interactiveSession.openInPanel.label', "Move Chat into Panel"), Codicon.layoutPanelDock, ChatContextKeys.panelLocation.isEqualTo(ViewContainerLocation.Panel));
	});
}

async function executeMoveToAction(accessor: ServicesAccessor, moveTo: MoveToNewLocation, sessionResource?: URI) {
	const widgetService = accessor.get(IChatWidgetService);

	const auxiliary = { compact: true, bounds: { width: 800, height: 640 } };

	const widget = (sessionResource ? widgetService.getWidgetBySessionResource(sessionResource) : undefined)
		?? widgetService.lastFocusedWidget;
	if (!widget || !widget.viewModel || widget.location !== ChatAgentLocation.Chat) {
		await widgetService.openSession(ChatEditorInput.getNewEditorUri(), moveTo === MoveToNewLocation.Window ? AUX_WINDOW_GROUP : ACTIVE_GROUP, { pinned: true, auxiliary });
		return;
	}

	const existingWidget = widgetService.getWidgetBySessionResource(widget.viewModel.sessionResource);
	if (!existingWidget) {
		// Do NOT attempt to open a session that isn't already open since we cannot guarantee its state.
		await widgetService.openSession(ChatEditorInput.getNewEditorUri(), moveTo === MoveToNewLocation.Window ? AUX_WINDOW_GROUP : ACTIVE_GROUP, { pinned: true, auxiliary });
		return;
	}

	// Save off the session resource before clearing
	const resourceToOpen = widget.viewModel.sessionResource;

	// Todo: can possibly go away with https://github.com/microsoft/vscode/pull/278476
	const modelInputState = existingWidget.getViewState();

	await widget.clear();

	const options: IChatEditorOptions = { pinned: true, modelInputState, auxiliary };
	await widgetService.openSession(resourceToOpen, moveTo === MoveToNewLocation.Window ? AUX_WINDOW_GROUP : ACTIVE_GROUP, options);
}

async function moveToSidebar(accessor: ServicesAccessor): Promise<void> {
	const viewsService = accessor.get(IViewsService);
	const editorService = accessor.get(IEditorService);
	const editorGroupService = accessor.get(IEditorGroupsService);

	const chatEditor = editorService.activeEditorPane;
	const chatEditorInput = chatEditor?.input;
	let view: ChatViewPane;
	if (chatEditor instanceof ChatEditor && chatEditorInput instanceof ChatEditorInput && chatEditorInput.sessionResource) {
		const previousViewState = chatEditor.widget.getViewState();
		await editorService.closeEditor({ editor: chatEditor.input, groupId: editorGroupService.activeGroup.id });
		view = await viewsService.openView(ChatViewId) as ChatViewPane;

		// Todo: can possibly go away with https://github.com/microsoft/vscode/pull/278476
		const newModel = await view.loadSession(chatEditorInput.sessionResource);
		if (previousViewState && newModel && !newModel.inputModel.state.get()) {
			newModel.inputModel.setState(previousViewState);
		}
	} else {
		view = await viewsService.openView(ChatViewId) as ChatViewPane;
	}

	view.focus();
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatNewActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatNewActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../base/common/codicons.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { localize2 } from '../../../../../nls.js';
import { Action2, MenuId, MenuRegistry, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { CommandsRegistry } from '../../../../../platform/commands/common/commands.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ActiveEditorContext } from '../../../../common/contextkeys.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { IChatEditingSession } from '../../common/chatEditingService.js';
import { IChatService } from '../../common/chatService.js';
import { ChatAgentLocation, ChatModeKind } from '../../common/constants.js';
import { ChatViewId, IChatWidgetService } from '../chat.js';
import { EditingSessionAction, getEditingSessionContext } from '../chatEditing/chatEditingActions.js';
import { ChatEditorInput } from '../chatEditorInput.js';
import { ACTION_ID_NEW_CHAT, ACTION_ID_NEW_EDIT_SESSION, CHAT_CATEGORY, handleCurrentEditingSession } from './chatActions.js';
import { clearChatEditor } from './chatClear.js';

export interface INewEditSessionActionContext {

	/**
	 * An initial prompt to write to the chat.
	 */
	inputValue?: string;

	/**
	 * Selects opening in agent mode or not. If not set, the current mode is used.
	 * This is ignored when coming from a chat view title context.
	 */
	agentMode?: boolean;

	/**
	 * Whether the inputValue is partial and should wait for further user input.
	 * If false or not set, the prompt is sent immediately.
	 */
	isPartialQuery?: boolean;
}

export function registerNewChatActions() {

	// Add "New Chat" submenu to Chat view menu
	MenuRegistry.appendMenuItem(MenuId.ViewTitle, {
		submenu: MenuId.ChatNewMenu,
		title: localize2('chat.newEdits.label', "New Chat"),
		icon: Codicon.plus,
		when: ContextKeyExpr.equals('view', ChatViewId),
		group: 'navigation',
		order: -1,
		isSplitButton: true
	});

	registerAction2(class NewChatEditorAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chatEditor.newChat',
				title: localize2('chat.newChat.label', "New Chat"),
				icon: Codicon.plus,
				f1: false,
				precondition: ChatContextKeys.enabled,
			});
		}
		async run(accessor: ServicesAccessor, ...args: unknown[]) {
			await clearChatEditor(accessor);
		}
	});

	registerAction2(class NewChatAction extends Action2 {
		constructor() {
			super({
				id: ACTION_ID_NEW_CHAT,
				title: localize2('chat.newEdits.label', "New Chat"),
				category: CHAT_CATEGORY,
				icon: Codicon.plus,
				precondition: ContextKeyExpr.and(ChatContextKeys.enabled, ChatContextKeys.location.isEqualTo(ChatAgentLocation.Chat)),
				f1: true,
				menu: [
					{
						id: MenuId.ChatContext,
						group: 'z_clear'
					},
					{
						id: MenuId.ChatNewMenu,
						group: '1_open',
						order: 1,
					},
					{
						id: MenuId.CompactWindowEditorTitle,
						group: 'navigation',
						when: ContextKeyExpr.and(ActiveEditorContext.isEqualTo(ChatEditorInput.EditorID), ChatContextKeys.lockedToCodingAgent.negate()),
						order: 1
					}
				],
				keybinding: {
					weight: KeybindingWeight.WorkbenchContrib + 1,
					primary: KeyMod.CtrlCmd | KeyCode.KeyN,
					secondary: [KeyMod.CtrlCmd | KeyCode.KeyL],
					mac: {
						primary: KeyMod.CtrlCmd | KeyCode.KeyN,
						secondary: [KeyMod.WinCtrl | KeyCode.KeyL]
					},
					when: ChatContextKeys.inChatSession
				}
			});
		}

		async run(accessor: ServicesAccessor, ...args: unknown[]) {
			const executeCommandContext = args[0] as INewEditSessionActionContext | undefined;

			// Context from toolbar or lastFocusedWidget
			const context = getEditingSessionContext(accessor, args);
			const { editingSession, chatWidget: widget } = context ?? {};
			if (!widget) {
				return;
			}

			const dialogService = accessor.get(IDialogService);

			const model = widget.viewModel?.model;
			if (model && !(await handleCurrentEditingSession(model, undefined, dialogService))) {
				return;
			}

			await editingSession?.stop();
			await widget.clear();
			widget.attachmentModel.clear(true);
			widget.input.relatedFiles?.clear();
			widget.focusInput();

			if (!executeCommandContext) {
				return;
			}

			if (typeof executeCommandContext.agentMode === 'boolean') {
				widget.input.setChatMode(executeCommandContext.agentMode ? ChatModeKind.Agent : ChatModeKind.Edit);
			}

			if (executeCommandContext.inputValue) {
				if (executeCommandContext.isPartialQuery) {
					widget.setInput(executeCommandContext.inputValue);
				} else {
					widget.acceptInput(executeCommandContext.inputValue);
				}
			}
		}
	});
	CommandsRegistry.registerCommandAlias(ACTION_ID_NEW_EDIT_SESSION, ACTION_ID_NEW_CHAT);

	MenuRegistry.appendMenuItem(MenuId.ChatViewSessionTitleNavigationToolbar, {
		command: {
			id: ACTION_ID_NEW_CHAT,
			title: localize2('chat.goBack', "Go Back"),
			icon: Codicon.arrowLeft,
		},
		group: 'navigation',
		order: 1
	});

	registerAction2(class UndoChatEditInteractionAction extends EditingSessionAction {
		constructor() {
			super({
				id: 'workbench.action.chat.undoEdit',
				title: localize2('chat.undoEdit.label', "Undo Last Edit"),
				category: CHAT_CATEGORY,
				icon: Codicon.discard,
				precondition: ContextKeyExpr.and(ChatContextKeys.chatEditingCanUndo, ChatContextKeys.enabled),
				f1: true,
				menu: [{
					id: MenuId.ViewTitle,
					when: ContextKeyExpr.equals('view', ChatViewId),
					group: 'navigation',
					order: -3,
					isHiddenByDefault: true
				}]
			});
		}

		async runEditingSessionAction(accessor: ServicesAccessor, editingSession: IChatEditingSession) {
			await editingSession.undoInteraction();
		}
	});

	registerAction2(class RedoChatEditInteractionAction extends EditingSessionAction {
		constructor() {
			super({
				id: 'workbench.action.chat.redoEdit',
				title: localize2('chat.redoEdit.label', "Redo Last Edit"),
				category: CHAT_CATEGORY,
				icon: Codicon.redo,
				precondition: ContextKeyExpr.and(ChatContextKeys.chatEditingCanRedo, ChatContextKeys.enabled),
				f1: true,
				menu: [
					{
						id: MenuId.ViewTitle,
						when: ContextKeyExpr.equals('view', ChatViewId),
						group: 'navigation',
						order: -2,
						isHiddenByDefault: true
					}
				]
			});
		}

		async runEditingSessionAction(accessor: ServicesAccessor, editingSession: IChatEditingSession) {
			const chatService = accessor.get(IChatService);
			await editingSession.redoInteraction();
			chatService.getSession(editingSession.chatSessionResource)?.setCheckpoint(undefined);
		}
	});

	registerAction2(class RedoChatCheckpoints extends EditingSessionAction {
		constructor() {
			super({
				id: 'workbench.action.chat.redoEdit2',
				title: localize2('chat.redoEdit.label2', "Redo"),
				tooltip: localize2('chat.redoEdit.tooltip', "Reapply discarded workspace changes and chat"),
				category: CHAT_CATEGORY,
				precondition: ContextKeyExpr.and(ChatContextKeys.chatEditingCanRedo, ChatContextKeys.enabled),
				f1: true,
				menu: [{
					id: MenuId.ChatMessageRestoreCheckpoint,
					when: ChatContextKeys.lockedToCodingAgent.negate(),
					group: 'navigation',
					order: -1
				}]
			});
		}

		async runEditingSessionAction(accessor: ServicesAccessor, editingSession: IChatEditingSession) {
			const widget = accessor.get(IChatWidgetService);

			while (editingSession.canRedo.get()) {
				await editingSession.redoInteraction();
			}

			const currentWidget = widget.getWidgetBySessionResource(editingSession.chatSessionResource);
			const requestText = currentWidget?.viewModel?.model.checkpoint?.message.text;

			// if the input has the same text that we just restored, clear it.
			if (currentWidget?.inputEditor.getValue() === requestText) {
				currentWidget?.input.setValue('', false);
			}

			currentWidget?.viewModel?.model.setCheckpoint(undefined);
			currentWidget?.focusInput();
		}
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatPromptNavigationActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatPromptNavigationActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { localize2 } from '../../../../../nls.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { CHAT_CATEGORY } from './chatActions.js';
import { IChatWidgetService } from '../chat.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { IChatRequestViewModel, isRequestVM, isResponseVM } from '../../common/chatViewModel.js';

export function registerChatPromptNavigationActions() {
	registerAction2(class NextUserPromptAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.nextUserPrompt',
				title: localize2('interactive.nextUserPrompt.label', "Next User Prompt"),
				keybinding: {
					primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.DownArrow,
					weight: KeybindingWeight.WorkbenchContrib,
					when: ChatContextKeys.inChatSession,
				},
				precondition: ChatContextKeys.enabled,
				f1: true,
				category: CHAT_CATEGORY,
			});
		}

		run(accessor: ServicesAccessor, ...args: unknown[]) {
			navigateUserPrompts(accessor, false);
		}
	});

	registerAction2(class PreviousUserPromptAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.previousUserPrompt',
				title: localize2('interactive.previousUserPrompt.label', "Previous User Prompt"),
				keybinding: {
					primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.UpArrow,
					weight: KeybindingWeight.WorkbenchContrib,
					when: ChatContextKeys.inChatSession,
				},
				precondition: ChatContextKeys.enabled,
				f1: true,
				category: CHAT_CATEGORY,
			});
		}

		run(accessor: ServicesAccessor, ...args: unknown[]) {
			navigateUserPrompts(accessor, true);
		}
	});
}

function navigateUserPrompts(accessor: ServicesAccessor, reverse: boolean) {
	const chatWidgetService = accessor.get(IChatWidgetService);
	const widget = chatWidgetService.lastFocusedWidget;
	if (!widget) {
		return;
	}

	const items = widget.viewModel?.getItems();
	if (!items || items.length === 0) {
		return;
	}

	// Get all user prompts (requests) in the conversation
	const userPrompts = items.filter((item): item is IChatRequestViewModel => isRequestVM(item));
	if (userPrompts.length === 0) {
		return;
	}

	// Find the currently focused item
	const focused = widget.getFocus();
	let currentIndex = -1;

	if (focused) {
		if (isRequestVM(focused)) {
			// If a request is focused, find its index in the user prompts array
			currentIndex = userPrompts.findIndex(prompt => prompt.id === focused.id);
		} else if (isResponseVM(focused)) {
			// If a response is focused, find the associated request's index
			// Response view models have a requestId property
			currentIndex = userPrompts.findIndex(prompt => prompt.id === focused.requestId);
		}
	}

	// Calculate next index
	let nextIndex: number;
	if (currentIndex === -1) {
		// No current focus, go to first or last prompt based on direction
		nextIndex = reverse ? userPrompts.length - 1 : 0;
	} else {
		// Navigate to next/previous prompt
		nextIndex = reverse ? currentIndex - 1 : currentIndex + 1;

		// Clamp instead of wrap and stay at boundaries when trying to navigate past ends
		if (nextIndex < 0) {
			nextIndex = 0; // already at first, do not move further
		} else if (nextIndex >= userPrompts.length) {
			nextIndex = userPrompts.length - 1; // already at last, do not move further
		}

		// avoid re-focusing if we didn't actually move
		if (nextIndex === currentIndex) {
			return; // no change in focus
		}
	}

	// Focus and reveal the selected user prompt
	const targetPrompt = userPrompts[nextIndex];
	if (targetPrompt) {
		widget.focus(targetPrompt);
		widget.reveal(targetPrompt);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatQuickInputActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatQuickInputActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../base/common/codicons.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { Selection } from '../../../../../editor/common/core/selection.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { CHAT_CATEGORY } from './chatActions.js';
import { IQuickChatOpenOptions, IQuickChatService } from '../chat.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';

export const ASK_QUICK_QUESTION_ACTION_ID = 'workbench.action.quickchat.toggle';
export function registerQuickChatActions() {
	registerAction2(QuickChatGlobalAction);
	registerAction2(AskQuickChatAction);

	registerAction2(class OpenInChatViewAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.quickchat.openInChatView',
				title: localize2('chat.openInChatView.label', "Open in Chat View"),
				f1: false,
				category: CHAT_CATEGORY,
				icon: Codicon.chatSparkle,
				menu: {
					id: MenuId.ChatInputSide,
					group: 'navigation',
					order: 10
				}
			});
		}

		run(accessor: ServicesAccessor) {
			const quickChatService = accessor.get(IQuickChatService);
			quickChatService.openInChatView();
		}
	});

	registerAction2(class CloseQuickChatAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.quickchat.close',
				title: localize2('chat.closeQuickChat.label', "Close Quick Chat"),
				f1: false,
				category: CHAT_CATEGORY,
				icon: Codicon.close,
				menu: {
					id: MenuId.ChatInputSide,
					group: 'navigation',
					order: 20
				}
			});
		}

		run(accessor: ServicesAccessor) {
			const quickChatService = accessor.get(IQuickChatService);
			quickChatService.close();
		}
	});

}

class QuickChatGlobalAction extends Action2 {
	constructor() {
		super({
			id: ASK_QUICK_QUESTION_ACTION_ID,
			title: localize2('quickChat', 'Open Quick Chat'),
			precondition: ChatContextKeys.enabled,
			icon: Codicon.chatSparkle,
			f1: false,
			category: CHAT_CATEGORY,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.KeyL,
			},
			menu: {
				id: MenuId.ChatTitleBarMenu,
				group: 'a_open',
				order: 4
			},
			metadata: {
				description: localize('toggle.desc', 'Toggle the quick chat'),
				args: [{
					name: 'args',
					schema: {
						anyOf: [
							{
								type: 'object',
								required: ['query'],
								properties: {
									query: {
										description: localize('toggle.query', "The query to open the quick chat with"),
										type: 'string'
									},
									isPartialQuery: {
										description: localize('toggle.isPartialQuery', "Whether the query is partial; it will wait for more user input"),
										type: 'boolean'
									}
								},
							},
							{
								type: 'string',
								description: localize('toggle.query', "The query to open the quick chat with")
							}
						]
					}
				}]
			},
		});
	}

	override run(accessor: ServicesAccessor, query?: string | Omit<IQuickChatOpenOptions, 'selection'>): void {
		const quickChatService = accessor.get(IQuickChatService);
		let options: IQuickChatOpenOptions | undefined;
		switch (typeof query) {
			case 'string': options = { query }; break;
			case 'object': options = query; break;
		}
		if (options?.query) {
			options.selection = new Selection(1, options.query.length + 1, 1, options.query.length + 1);
		}
		quickChatService.toggle(options);
	}
}

class AskQuickChatAction extends Action2 {
	constructor() {
		super({
			id: `workbench.action.openQuickChat`,
			category: CHAT_CATEGORY,
			title: localize2('interactiveSession.open', "Open Quick Chat"),
			precondition: ChatContextKeys.enabled,
			f1: true
		});
	}

	override run(accessor: ServicesAccessor, query?: string): void {
		const quickChatService = accessor.get(IQuickChatService);
		quickChatService.toggle(query ? {
			query,
			selection: new Selection(1, query.length + 1, 1, query.length + 1)
		} : undefined);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatTitleActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatTitleActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../base/common/codicons.js';
import { marked } from '../../../../../base/common/marked/marked.js';
import { basename } from '../../../../../base/common/resources.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { IBulkEditService } from '../../../../../editor/browser/services/bulkEditService.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { ResourceNotebookCellEdit } from '../../../bulkEdit/browser/bulkCellEdits.js';
import { MENU_INLINE_CHAT_WIDGET_SECONDARY } from '../../../inlineChat/common/inlineChat.js';
import { INotebookEditor } from '../../../notebook/browser/notebookBrowser.js';
import { CellEditType, CellKind, NOTEBOOK_EDITOR_ID } from '../../../notebook/common/notebookCommon.js';
import { NOTEBOOK_IS_ACTIVE_EDITOR } from '../../../notebook/common/notebookContextKeys.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { applyingChatEditsFailedContextKey, isChatEditingActionContext } from '../../common/chatEditingService.js';
import { ChatAgentVoteDirection, ChatAgentVoteDownReason, IChatService } from '../../common/chatService.js';
import { isResponseVM } from '../../common/chatViewModel.js';
import { ChatModeKind } from '../../common/constants.js';
import { IChatWidgetService } from '../chat.js';
import { CHAT_CATEGORY } from './chatActions.js';

export const MarkUnhelpfulActionId = 'workbench.action.chat.markUnhelpful';
const enableFeedbackConfig = 'config.telemetry.feedback.enabled';

export function registerChatTitleActions() {
	registerAction2(class MarkHelpfulAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.markHelpful',
				title: localize2('interactive.helpful.label', "Helpful"),
				f1: false,
				category: CHAT_CATEGORY,
				icon: Codicon.thumbsup,
				toggled: ChatContextKeys.responseVote.isEqualTo('up'),
				menu: [{
					id: MenuId.ChatMessageFooter,
					group: 'navigation',
					order: 2,
					when: ContextKeyExpr.and(ChatContextKeys.extensionParticipantRegistered, ChatContextKeys.isResponse, ChatContextKeys.responseHasError.negate(), ContextKeyExpr.has(enableFeedbackConfig))
				}, {
					id: MENU_INLINE_CHAT_WIDGET_SECONDARY,
					group: 'navigation',
					order: 1,
					when: ContextKeyExpr.and(ChatContextKeys.extensionParticipantRegistered, ChatContextKeys.isResponse, ChatContextKeys.responseHasError.negate(), ContextKeyExpr.has(enableFeedbackConfig))
				}]
			});
		}

		run(accessor: ServicesAccessor, ...args: unknown[]) {
			const item = args[0];
			if (!isResponseVM(item)) {
				return;
			}

			const chatService = accessor.get(IChatService);
			chatService.notifyUserAction({
				agentId: item.agent?.id,
				command: item.slashCommand?.name,
				sessionResource: item.session.sessionResource,
				requestId: item.requestId,
				result: item.result,
				action: {
					kind: 'vote',
					direction: ChatAgentVoteDirection.Up,
					reason: undefined
				}
			});
			item.setVote(ChatAgentVoteDirection.Up);
			item.setVoteDownReason(undefined);
		}
	});

	registerAction2(class MarkUnhelpfulAction extends Action2 {
		constructor() {
			super({
				id: MarkUnhelpfulActionId,
				title: localize2('interactive.unhelpful.label', "Unhelpful"),
				f1: false,
				category: CHAT_CATEGORY,
				icon: Codicon.thumbsdown,
				toggled: ChatContextKeys.responseVote.isEqualTo('down'),
				menu: [{
					id: MenuId.ChatMessageFooter,
					group: 'navigation',
					order: 3,
					when: ContextKeyExpr.and(ChatContextKeys.extensionParticipantRegistered, ChatContextKeys.isResponse, ContextKeyExpr.has(enableFeedbackConfig))
				}, {
					id: MENU_INLINE_CHAT_WIDGET_SECONDARY,
					group: 'navigation',
					order: 2,
					when: ContextKeyExpr.and(ChatContextKeys.extensionParticipantRegistered, ChatContextKeys.isResponse, ChatContextKeys.responseHasError.negate(), ContextKeyExpr.has(enableFeedbackConfig))
				}]
			});
		}

		run(accessor: ServicesAccessor, ...args: unknown[]) {
			const item = args[0];
			if (!isResponseVM(item)) {
				return;
			}

			const reason = args[1];
			if (typeof reason !== 'string') {
				return;
			}

			item.setVote(ChatAgentVoteDirection.Down);
			item.setVoteDownReason(reason as ChatAgentVoteDownReason);

			const chatService = accessor.get(IChatService);
			chatService.notifyUserAction({
				agentId: item.agent?.id,
				command: item.slashCommand?.name,
				sessionResource: item.session.sessionResource,
				requestId: item.requestId,
				result: item.result,
				action: {
					kind: 'vote',
					direction: ChatAgentVoteDirection.Down,
					reason: item.voteDownReason
				}
			});
		}
	});

	registerAction2(class ReportIssueForBugAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.reportIssueForBug',
				title: localize2('interactive.reportIssueForBug.label', "Report Issue"),
				f1: false,
				category: CHAT_CATEGORY,
				icon: Codicon.report,
				menu: [{
					id: MenuId.ChatMessageFooter,
					group: 'navigation',
					order: 4,
					when: ContextKeyExpr.and(ChatContextKeys.responseSupportsIssueReporting, ChatContextKeys.isResponse, ContextKeyExpr.has(enableFeedbackConfig))
				}, {
					id: MENU_INLINE_CHAT_WIDGET_SECONDARY,
					group: 'navigation',
					order: 3,
					when: ContextKeyExpr.and(ChatContextKeys.responseSupportsIssueReporting, ChatContextKeys.isResponse, ContextKeyExpr.has(enableFeedbackConfig))
				}]
			});
		}

		run(accessor: ServicesAccessor, ...args: unknown[]) {
			const item = args[0];
			if (!isResponseVM(item)) {
				return;
			}

			const chatService = accessor.get(IChatService);
			chatService.notifyUserAction({
				agentId: item.agent?.id,
				command: item.slashCommand?.name,
				sessionResource: item.session.sessionResource,
				requestId: item.requestId,
				result: item.result,
				action: {
					kind: 'bug'
				}
			});
		}
	});

	registerAction2(class RetryChatAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.retry',
				title: localize2('chat.retry.label', "Retry"),
				f1: false,
				category: CHAT_CATEGORY,
				icon: Codicon.refresh,
				menu: [
					{
						id: MenuId.ChatMessageFooter,
						group: 'navigation',
						when: ContextKeyExpr.and(
							ChatContextKeys.isResponse,
							ContextKeyExpr.in(ChatContextKeys.itemId.key, ChatContextKeys.lastItemId.key))
					},
					{
						id: MenuId.ChatEditingWidgetToolbar,
						group: 'navigation',
						when: applyingChatEditsFailedContextKey,
						order: 0
					}
				]
			});
		}

		async run(accessor: ServicesAccessor, ...args: unknown[]) {
			const chatWidgetService = accessor.get(IChatWidgetService);

			let item = args[0];
			if (isChatEditingActionContext(item)) {
				// Resolve chat editing action context to the last response VM
				item = chatWidgetService.getWidgetBySessionResource(item.sessionResource)?.viewModel?.getItems().at(-1);
			}
			if (!isResponseVM(item)) {
				return;
			}

			const chatService = accessor.get(IChatService);
			const chatModel = chatService.getSession(item.sessionResource);
			const chatRequests = chatModel?.getRequests();
			if (!chatRequests) {
				return;
			}
			const itemIndex = chatRequests?.findIndex(request => request.id === item.requestId);
			const widget = chatWidgetService.getWidgetBySessionResource(item.sessionResource);
			const mode = widget?.input.currentModeKind;
			if (chatModel && (mode === ChatModeKind.Edit || mode === ChatModeKind.Agent)) {
				const configurationService = accessor.get(IConfigurationService);
				const dialogService = accessor.get(IDialogService);
				const currentEditingSession = widget?.viewModel?.model.editingSession;
				if (!currentEditingSession) {
					return;
				}

				// Prompt if the last request modified the working set and the user hasn't already disabled the dialog
				const entriesModifiedInLastRequest = currentEditingSession.entries.get().filter((entry) => entry.lastModifyingRequestId === item.requestId);
				const shouldPrompt = entriesModifiedInLastRequest.length > 0 && configurationService.getValue('chat.editing.confirmEditRequestRetry') === true;
				const confirmation = shouldPrompt
					? await dialogService.confirm({
						title: localize('chat.retryLast.confirmation.title2', "Do you want to retry your last request?"),
						message: entriesModifiedInLastRequest.length === 1
							? localize('chat.retry.confirmation.message2', "This will undo edits made to {0} since this request.", basename(entriesModifiedInLastRequest[0].modifiedURI))
							: localize('chat.retryLast.confirmation.message2', "This will undo edits made to {0} files in your working set since this request. Do you want to proceed?", entriesModifiedInLastRequest.length),
						primaryButton: localize('chat.retry.confirmation.primaryButton', "Yes"),
						checkbox: { label: localize('chat.retry.confirmation.checkbox', "Don't ask again"), checked: false },
						type: 'info'
					})
					: { confirmed: true };

				if (!confirmation.confirmed) {
					return;
				}

				if (confirmation.checkboxChecked) {
					await configurationService.updateValue('chat.editing.confirmEditRequestRetry', false);
				}

				// Reset the snapshot to the first stop (undefined undo index)
				const snapshotRequest = chatRequests[itemIndex];
				if (snapshotRequest) {
					await currentEditingSession.restoreSnapshot(snapshotRequest.id, undefined);
				}
			}
			const request = chatModel?.getRequests().find(candidate => candidate.id === item.requestId);
			const languageModelId = widget?.input.currentLanguageModel;

			chatService.resendRequest(request!, {
				userSelectedModelId: languageModelId,
				attempt: (request?.attempt ?? -1) + 1,
				...widget?.getModeRequestOptions(),
			});
		}
	});

	registerAction2(class InsertToNotebookAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.insertIntoNotebook',
				title: localize2('interactive.insertIntoNotebook.label', "Insert into Notebook"),
				f1: false,
				category: CHAT_CATEGORY,
				icon: Codicon.insert,
				menu: {
					id: MenuId.ChatMessageFooter,
					group: 'navigation',
					isHiddenByDefault: true,
					when: ContextKeyExpr.and(NOTEBOOK_IS_ACTIVE_EDITOR, ChatContextKeys.isResponse, ChatContextKeys.responseIsFiltered.negate())
				}
			});
		}

		async run(accessor: ServicesAccessor, ...args: unknown[]) {
			const item = args[0];
			if (!isResponseVM(item)) {
				return;
			}

			const editorService = accessor.get(IEditorService);

			if (editorService.activeEditorPane?.getId() === NOTEBOOK_EDITOR_ID) {
				const notebookEditor = editorService.activeEditorPane.getControl() as INotebookEditor;

				if (!notebookEditor.hasModel()) {
					return;
				}

				if (notebookEditor.isReadOnly) {
					return;
				}

				const value = item.response.toString();
				const splitContents = splitMarkdownAndCodeBlocks(value);

				const focusRange = notebookEditor.getFocus();
				const index = Math.max(focusRange.end, 0);
				const bulkEditService = accessor.get(IBulkEditService);

				await bulkEditService.apply(
					[
						new ResourceNotebookCellEdit(notebookEditor.textModel.uri,
							{
								editType: CellEditType.Replace,
								index: index,
								count: 0,
								cells: splitContents.map(content => {
									const kind = content.type === 'markdown' ? CellKind.Markup : CellKind.Code;
									const language = content.type === 'markdown' ? 'markdown' : content.language;
									const mime = content.type === 'markdown' ? 'text/markdown' : `text/x-${content.language}`;
									return {
										cellKind: kind,
										language,
										mime,
										source: content.content,
										outputs: [],
										metadata: {}
									};
								})
							}
						)
					],
					{ quotableLabel: 'Insert into Notebook' }
				);
			}
		}
	});
}

interface MarkdownContent {
	type: 'markdown';
	content: string;
}

interface CodeContent {
	type: 'code';
	language: string;
	content: string;
}

type Content = MarkdownContent | CodeContent;

function splitMarkdownAndCodeBlocks(markdown: string): Content[] {
	const lexer = new marked.Lexer();
	const tokens = lexer.lex(markdown);

	const splitContent: Content[] = [];

	let markdownPart = '';
	tokens.forEach((token) => {
		if (token.type === 'code') {
			if (markdownPart.trim()) {
				splitContent.push({ type: 'markdown', content: markdownPart });
				markdownPart = '';
			}
			splitContent.push({
				type: 'code',
				language: token.lang || '',
				content: token.text,
			});
		} else {
			markdownPart += token.raw;
		}
	});

	if (markdownPart.trim()) {
		splitContent.push({ type: 'markdown', content: markdownPart });
	}

	return splitContent;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatToolActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatToolActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $ } from '../../../../../base/browser/dom.js';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Iterable } from '../../../../../base/common/iterator.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { markAsSingleton } from '../../../../../base/common/lifecycle.js';
import { autorun } from '../../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { localize, localize2 } from '../../../../../nls.js';
import { IActionViewItemService } from '../../../../../platform/actions/browser/actionViewItemService.js';
import { MenuEntryActionViewItem } from '../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { Action2, MenuId, MenuItemAction, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IWorkbenchContribution, registerWorkbenchContribution2, WorkbenchPhase } from '../../../../common/contributions.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { ConfirmedReason, IChatToolInvocation, ToolConfirmKind } from '../../common/chatService.js';
import { isResponseVM } from '../../common/chatViewModel.js';
import { ChatModeKind } from '../../common/constants.js';
import { IChatWidget, IChatWidgetService } from '../chat.js';
import { ToolsScope } from '../chatSelectedTools.js';
import { CHAT_CATEGORY } from './chatActions.js';
import { showToolsPicker } from './chatToolPicker.js';


type SelectedToolData = {
	enabled: number;
	total: number;
};
type SelectedToolClassification = {
	owner: 'connor4312';
	comment: 'Details the capabilities of the MCP server';
	enabled: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Number of enabled chat tools' };
	total: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Number of total chat tools' };
};

export const AcceptToolConfirmationActionId = 'workbench.action.chat.acceptTool';
export const SkipToolConfirmationActionId = 'workbench.action.chat.skipTool';
export const AcceptToolPostConfirmationActionId = 'workbench.action.chat.acceptToolPostExecution';
export const SkipToolPostConfirmationActionId = 'workbench.action.chat.skipToolPostExecution';

abstract class ToolConfirmationAction extends Action2 {
	protected abstract getReason(): ConfirmedReason;

	run(accessor: ServicesAccessor, ...args: unknown[]) {
		const chatWidgetService = accessor.get(IChatWidgetService);
		const widget = chatWidgetService.lastFocusedWidget;
		const lastItem = widget?.viewModel?.getItems().at(-1);
		if (!isResponseVM(lastItem)) {
			return;
		}

		for (const item of lastItem.model.response.value) {
			const state = item.kind === 'toolInvocation' ? item.state.get() : undefined;
			if (state?.type === IChatToolInvocation.StateKind.WaitingForConfirmation || state?.type === IChatToolInvocation.StateKind.WaitingForPostApproval) {
				state.confirm(this.getReason());
				break;
			}
		}

		// Return focus to the chat input, in case it was in the tool confirmation editor
		widget?.focusInput();
	}
}

class AcceptToolConfirmation extends ToolConfirmationAction {
	constructor() {
		super({
			id: AcceptToolConfirmationActionId,
			title: localize2('chat.accept', "Accept"),
			f1: false,
			category: CHAT_CATEGORY,
			keybinding: {
				when: ContextKeyExpr.and(ChatContextKeys.inChatSession, ChatContextKeys.Editing.hasToolConfirmation),
				primary: KeyMod.CtrlCmd | KeyCode.Enter,
				// Override chatEditor.action.accept
				weight: KeybindingWeight.WorkbenchContrib + 1,
			},
		});
	}

	protected override getReason(): ConfirmedReason {
		return { type: ToolConfirmKind.UserAction };
	}
}

class SkipToolConfirmation extends ToolConfirmationAction {
	constructor() {
		super({
			id: SkipToolConfirmationActionId,
			title: localize2('chat.skip', "Skip"),
			f1: false,
			category: CHAT_CATEGORY,
			keybinding: {
				when: ContextKeyExpr.and(ChatContextKeys.inChatSession, ChatContextKeys.Editing.hasToolConfirmation),
				primary: KeyMod.CtrlCmd | KeyCode.Enter | KeyMod.Alt,
				// Override chatEditor.action.accept
				weight: KeybindingWeight.WorkbenchContrib + 1,
			},
		});
	}

	protected override getReason(): ConfirmedReason {
		return { type: ToolConfirmKind.Skipped };
	}
}

class ConfigureToolsAction extends Action2 {
	public static ID = 'workbench.action.chat.configureTools';

	constructor() {
		super({
			id: ConfigureToolsAction.ID,
			title: localize('label', "Configure Tools..."),
			icon: Codicon.tools,
			f1: false,
			category: CHAT_CATEGORY,
			precondition: ChatContextKeys.chatModeKind.isEqualTo(ChatModeKind.Agent),
			menu: [{
				when: ContextKeyExpr.and(ChatContextKeys.chatModeKind.isEqualTo(ChatModeKind.Agent), ChatContextKeys.lockedToCodingAgent.negate()),
				id: MenuId.ChatInput,
				group: 'navigation',
				order: 100,
			}]
		});
	}

	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {

		const instaService = accessor.get(IInstantiationService);
		const chatWidgetService = accessor.get(IChatWidgetService);
		const telemetryService = accessor.get(ITelemetryService);

		let widget = chatWidgetService.lastFocusedWidget;
		if (!widget) {
			type ChatActionContext = { widget: IChatWidget };
			function isChatActionContext(obj: unknown): obj is ChatActionContext {
				return !!obj && typeof obj === 'object' && !!(obj as ChatActionContext).widget;
			}
			const context = args[0];
			if (isChatActionContext(context)) {
				widget = context.widget;
			}
		}

		if (!widget) {
			return;
		}

		let placeholder;
		let description;
		const { entriesScope, entriesMap } = widget.input.selectedToolsModel;
		switch (entriesScope) {
			case ToolsScope.Session:
				placeholder = localize('chat.tools.placeholder.session', "Select tools for this chat session");
				description = localize('chat.tools.description.session', "The selected tools were configured only for this chat session.");
				break;
			case ToolsScope.Agent:
				placeholder = localize('chat.tools.placeholder.agent', "Select tools for this custom agent");
				description = localize('chat.tools.description.agent', "The selected tools are configured by the '{0}' custom agent. Changes to the tools will be applied to the custom agent file as well.", widget.input.currentModeObs.get().label.get());
				break;
			case ToolsScope.Agent_ReadOnly:
				placeholder = localize('chat.tools.placeholder.readOnlyAgent', "Select tools for this custom agent");
				description = localize('chat.tools.description.readOnlyAgent', "The selected tools are configured by the '{0}' custom agent. Changes to the tools will only be used for this session and will not change the '{0}' custom agent.", widget.input.currentModeObs.get().label.get());
				break;
			case ToolsScope.Global:
				placeholder = localize('chat.tools.placeholder.global', "Select tools that are available to chat.");
				description = localize('chat.tools.description.global', "The selected tools will be applied globally for all chat sessions that use the default agent.");
				break;

		}

		// Create a cancellation token that cancels when the mode changes
		const cts = new CancellationTokenSource();
		const initialMode = widget.input.currentModeObs.get();
		const modeListener = autorun(reader => {
			if (initialMode.id !== widget.input.currentModeObs.read(reader).id) {
				cts.cancel();
			}
		});

		try {
			const result = await instaService.invokeFunction(showToolsPicker, placeholder, description, () => entriesMap.get(), cts.token);
			if (result) {
				widget.input.selectedToolsModel.set(result, false);
			}
		} finally {
			modeListener.dispose();
			cts.dispose();
		}

		const tools = widget.input.selectedToolsModel.entriesMap.get();
		telemetryService.publicLog2<SelectedToolData, SelectedToolClassification>('chat/selectedTools', {
			total: tools.size,
			enabled: Iterable.reduce(tools, (prev, [_, enabled]) => enabled ? prev + 1 : prev, 0),
		});
	}
}

class ConfigureToolsActionRendering implements IWorkbenchContribution {

	static readonly ID = 'chat.configureToolsActionRendering';

	constructor(
		@IActionViewItemService actionViewItemService: IActionViewItemService,
	) {
		const disposable = actionViewItemService.register(MenuId.ChatInput, ConfigureToolsAction.ID, (action, _opts, instantiationService) => {
			if (!(action instanceof MenuItemAction)) {
				return undefined;
			}
			return instantiationService.createInstance(class extends MenuEntryActionViewItem {
				private warningElement!: HTMLElement;

				override render(container: HTMLElement): void {
					super.render(container);

					// Add warning indicator element
					this.warningElement = $(`.tool-warning-indicator${ThemeIcon.asCSSSelector(Codicon.warning)}`);
					this.warningElement.style.display = 'none';
					container.appendChild(this.warningElement);
					container.style.position = 'relative';

					// Set up context key listeners
					this.updateWarningState();
					this._register(this._contextKeyService.onDidChangeContext(() => {
						this.updateWarningState();
					}));
				}

				private updateWarningState(): void {
					const wasShown = this.warningElement.style.display === 'block';
					const shouldBeShown = this.isAboveToolLimit();

					if (!wasShown && shouldBeShown) {
						this.warningElement.style.display = 'block';
						this.updateTooltip();
					} else if (wasShown && !shouldBeShown) {
						this.warningElement.style.display = 'none';
						this.updateTooltip();
					}
				}

				protected override getTooltip(): string {
					if (this.isAboveToolLimit()) {
						const warningMessage = localize('chatTools.tooManyEnabled', 'More than {0} tools are enabled, you may experience degraded tool calling.', this._contextKeyService.getContextKeyValue(ChatContextKeys.chatToolGroupingThreshold.key));
						return `${warningMessage}`;
					}

					return super.getTooltip();
				}

				private isAboveToolLimit() {
					const rawToolLimit = this._contextKeyService.getContextKeyValue(ChatContextKeys.chatToolGroupingThreshold.key);
					const rawToolCount = this._contextKeyService.getContextKeyValue(ChatContextKeys.chatToolCount.key);
					if (rawToolLimit === undefined || rawToolCount === undefined) {
						return false;
					}

					const toolLimit = Number(rawToolLimit || 0);
					const toolCount = Number(rawToolCount || 0);
					return toolCount > toolLimit;
				}
			}, action, undefined);
		});

		// Reduces flicker a bit on reload/restart
		markAsSingleton(disposable);
	}
}

export function registerChatToolActions() {
	registerAction2(AcceptToolConfirmation);
	registerAction2(SkipToolConfirmation);
	registerAction2(ConfigureToolsAction);
	registerWorkbenchContribution2(ConfigureToolsActionRendering.ID, ConfigureToolsActionRendering, WorkbenchPhase.BlockRestore);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatToolPicker.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatToolPicker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { assertNever } from '../../../../../base/common/assert.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { createMarkdownCommandLink } from '../../../../../base/common/htmlContent.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import Severity from '../../../../../base/common/severity.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { URI } from '../../../../../base/common/uri.js';
import { localize } from '../../../../../nls.js';
import { CommandsRegistry, ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputButton, IQuickInputService, IQuickPickItem, IQuickTreeItem } from '../../../../../platform/quickinput/common/quickInput.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { ExtensionEditorTab, IExtensionsWorkbenchService } from '../../../extensions/common/extensions.js';
import { McpCommandIds } from '../../../mcp/common/mcpCommandIds.js';
import { IMcpRegistry } from '../../../mcp/common/mcpRegistryTypes.js';
import { IMcpServer, IMcpService, IMcpWorkbenchService, McpConnectionState, McpServerCacheState, McpServerEditorTab } from '../../../mcp/common/mcpTypes.js';
import { startServerAndWaitForLiveTools } from '../../../mcp/common/mcpTypesUtils.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { ILanguageModelToolsService, IToolData, ToolDataSource, ToolSet } from '../../common/languageModelToolsService.js';
import { ConfigureToolSets } from '../tools/toolSetsContribution.js';

const enum BucketOrdinal { User, BuiltIn, Mcp, Extension }

// Legacy QuickPick types (existing implementation)
type BucketPick = IQuickPickItem & { picked: boolean; ordinal: BucketOrdinal; status?: string; toolset?: ToolSet; children: (ToolPick | ToolSetPick)[] };
type ToolSetPick = IQuickPickItem & { picked: boolean; toolset: ToolSet; parent: BucketPick };
type ToolPick = IQuickPickItem & { picked: boolean; tool: IToolData; parent: BucketPick };
type ActionableButton = IQuickInputButton & { action: () => void };

// New QuickTree types for tree-based implementation

/**
 * Base interface for all tree items in the QuickTree implementation.
 * Extends IQuickTreeItem with common properties for tool picker items.
 */
interface IToolTreeItem extends IQuickTreeItem {
	readonly itemType: 'bucket' | 'toolset' | 'tool' | 'callback';
	readonly ordinal?: BucketOrdinal;
	readonly buttons?: readonly ActionableButton[];
}

/**
 * Bucket tree item - represents a category of tools (User, BuiltIn, MCP Server, Extension).
 * For MCP servers, the bucket directly represents the server and stores the toolset.
 */
interface IBucketTreeItem extends IToolTreeItem {
	readonly itemType: 'bucket';
	readonly ordinal: BucketOrdinal;
	toolset?: ToolSet; // For MCP servers where the bucket represents the ToolSet - mutable
	readonly status?: string;
	readonly children: AnyTreeItem[];
	checked: boolean | 'mixed' | undefined;
	readonly sortOrder: number;
}

/**
 * ToolSet tree item - represents a collection of tools that can be managed together.
 * Used for regular (non-MCP) toolsets that appear as intermediate nodes in the tree.
 */
interface IToolSetTreeItem extends IToolTreeItem {
	readonly itemType: 'toolset';
	readonly toolset: ToolSet;
	children: AnyTreeItem[] | undefined;
	checked: boolean | 'mixed';
}

/**
 * Tool tree item - represents an individual tool that can be selected/deselected.
 * This is a leaf node in the tree structure.
 */
interface IToolTreeItemData extends IToolTreeItem {
	readonly itemType: 'tool';
	readonly tool: IToolData;
	checked: boolean;
}

/**
 * Callback tree item - represents action items like "Add MCP Server" or "Configure Tool Sets".
 * These are non-selectable items that execute actions when clicked. Can return
 * false to keep the picker open.
 */
interface ICallbackTreeItem extends IToolTreeItem {
	readonly itemType: 'callback';
	readonly run: () => boolean | void;
	readonly pickable: false;
}

type AnyTreeItem = IBucketTreeItem | IToolSetTreeItem | IToolTreeItemData | ICallbackTreeItem;

// Type guards for new QuickTree types
function isBucketTreeItem(item: AnyTreeItem): item is IBucketTreeItem {
	return item.itemType === 'bucket';
}
function isToolSetTreeItem(item: AnyTreeItem): item is IToolSetTreeItem {
	return item.itemType === 'toolset';
}
function isToolTreeItem(item: AnyTreeItem): item is IToolTreeItemData {
	return item.itemType === 'tool';
}
function isCallbackTreeItem(item: AnyTreeItem): item is ICallbackTreeItem {
	return item.itemType === 'callback';
}

/**
 * Maps different icon types (ThemeIcon or URI-based) to QuickTreeItem icon properties.
 * Handles the conversion between ToolSet/IToolData icon formats and tree item requirements.
 * Provides a default tool icon when no icon is specified.
 *
 * @param icon - Icon to map (ThemeIcon, URI object, or undefined)
 * @param useDefaultToolIcon - Whether to use a default tool icon when none is provided
 * @returns Object with iconClass (for ThemeIcon) or iconPath (for URIs) properties
 */
function mapIconToTreeItem(icon: ThemeIcon | { dark: URI; light?: URI } | undefined, useDefaultToolIcon: boolean = false): Pick<IQuickTreeItem, 'iconClass' | 'iconPath'> {
	if (!icon) {
		if (useDefaultToolIcon) {
			return { iconClass: ThemeIcon.asClassName(Codicon.tools) };
		}
		return {};
	}

	if (ThemeIcon.isThemeIcon(icon)) {
		return { iconClass: ThemeIcon.asClassName(icon) };
	} else {
		return { iconPath: icon };
	}
}

function createToolTreeItemFromData(tool: IToolData, checked: boolean): IToolTreeItemData {
	const iconProps = mapIconToTreeItem(tool.icon, true); // Use default tool icon if none provided

	return {
		itemType: 'tool',
		tool,
		id: tool.id,
		label: tool.toolReferenceName ?? tool.displayName,
		description: tool.userDescription ?? tool.modelDescription,
		checked,
		...iconProps
	};
}

function createToolSetTreeItem(toolset: ToolSet, checked: boolean, editorService: IEditorService): IToolSetTreeItem {
	const iconProps = mapIconToTreeItem(toolset.icon);
	const buttons = [];
	if (toolset.source.type === 'user') {
		const resource = toolset.source.file;
		buttons.push({
			iconClass: ThemeIcon.asClassName(Codicon.edit),
			tooltip: localize('editUserBucket', "Edit Tool Set"),
			action: () => editorService.openEditor({ resource })
		});
	}
	return {
		itemType: 'toolset',
		toolset,
		buttons,
		id: toolset.id,
		label: toolset.referenceName,
		description: toolset.description,
		checked,
		children: undefined,
		collapsed: true,
		...iconProps
	};
}

/**
 * New QuickTree implementation of the tools picker.
 * Uses IQuickTree to provide a true hierarchical tree structure with:
 * - Collapsible nodes for buckets and toolsets
 * - Checkbox state management with parent-child relationships
 * - Special handling for MCP servers (server as bucket, tools as direct children)
 * - Built-in filtering and search capabilities
 *
 * @param accessor - Service accessor for dependency injection
 * @param placeHolder - Placeholder text shown in the picker
 * @param description - Optional description text shown in the picker
 * @param toolsEntries - Optional initial selection state for tools and toolsets
 * @param token - Optional cancellation token to close the picker when cancelled
 * @returns Promise resolving to the final selection map, or undefined if cancelled
 */
export async function showToolsPicker(
	accessor: ServicesAccessor,
	placeHolder: string,
	description?: string,
	getToolsEntries?: () => ReadonlyMap<ToolSet | IToolData, boolean>,
	token?: CancellationToken
): Promise<ReadonlyMap<ToolSet | IToolData, boolean> | undefined> {

	const quickPickService = accessor.get(IQuickInputService);
	const mcpService = accessor.get(IMcpService);
	const mcpRegistry = accessor.get(IMcpRegistry);
	const commandService = accessor.get(ICommandService);
	const extensionsWorkbenchService = accessor.get(IExtensionsWorkbenchService);
	const editorService = accessor.get(IEditorService);
	const mcpWorkbenchService = accessor.get(IMcpWorkbenchService);
	const toolsService = accessor.get(ILanguageModelToolsService);
	const toolLimit = accessor.get(IContextKeyService).getContextKeyValue<number>(ChatContextKeys.chatToolGroupingThreshold.key);

	const mcpServerByTool = new Map<string, IMcpServer>();
	for (const server of mcpService.servers.get()) {
		for (const tool of server.tools.get()) {
			mcpServerByTool.set(tool.id, server);
		}
	}

	function computeItems(previousToolsEntries?: ReadonlyMap<ToolSet | IToolData, boolean>) {
		// Create default entries if none provided
		let toolsEntries = getToolsEntries ? new Map(getToolsEntries()) : undefined;
		if (!toolsEntries) {
			const defaultEntries = new Map();
			for (const tool of toolsService.getTools()) {
				if (tool.canBeReferencedInPrompt) {
					defaultEntries.set(tool, false);
				}
			}
			for (const toolSet of toolsService.toolSets.get()) {
				defaultEntries.set(toolSet, false);
			}
			toolsEntries = defaultEntries;
		}
		previousToolsEntries?.forEach((value, key) => {
			toolsEntries.set(key, value);
		});

		// Build tree structure
		const treeItems: AnyTreeItem[] = [];
		const bucketMap = new Map<string, IBucketTreeItem>();

		const getKey = (source: ToolDataSource): string => {
			switch (source.type) {
				case 'mcp':
				case 'extension':
					return ToolDataSource.toKey(source);
				case 'internal':
					return BucketOrdinal.BuiltIn.toString();
				case 'user':
					return BucketOrdinal.User.toString();
				case 'external':
					throw new Error('should not be reachable');
				default:
					assertNever(source);
			}
		};

		const mcpServers = new Map(mcpService.servers.get().map(s => [s.definition.id, { server: s, seen: false }]));
		const createBucket = (source: ToolDataSource, key: string): IBucketTreeItem | undefined => {
			if (source.type === 'mcp') {
				const mcpServerEntry = mcpServers.get(source.definitionId);
				if (!mcpServerEntry) {
					return undefined;
				}
				mcpServerEntry.seen = true;
				const mcpServer = mcpServerEntry.server;
				const buttons: ActionableButton[] = [];
				const collection = mcpRegistry.collections.get().find(c => c.id === mcpServer.collection.id);
				if (collection?.source) {
					buttons.push({
						iconClass: ThemeIcon.asClassName(Codicon.settingsGear),
						tooltip: localize('configMcpCol', "Configure {0}", collection.label),
						action: () => collection.source ? collection.source instanceof ExtensionIdentifier ? extensionsWorkbenchService.open(collection.source.value, { tab: ExtensionEditorTab.Features, feature: 'mcp' }) : mcpWorkbenchService.open(collection.source, { tab: McpServerEditorTab.Configuration }) : undefined
					});
				} else if (collection?.presentation?.origin) {
					buttons.push({
						iconClass: ThemeIcon.asClassName(Codicon.settingsGear),
						tooltip: localize('configMcpCol', "Configure {0}", collection.label),
						action: () => editorService.openEditor({
							resource: collection!.presentation!.origin,
						})
					});
				}
				if (mcpServer.connectionState.get().state === McpConnectionState.Kind.Error) {
					buttons.push({
						iconClass: ThemeIcon.asClassName(Codicon.warning),
						tooltip: localize('mcpShowOutput', "Show Output"),
						action: () => mcpServer.showOutput(),
					});
				}
				const cacheState = mcpServer.cacheState.get();
				const children: AnyTreeItem[] = [];
				let collapsed = true;
				if (cacheState === McpServerCacheState.Unknown || cacheState === McpServerCacheState.Outdated) {
					collapsed = false;
					children.push({
						itemType: 'callback',
						iconClass: ThemeIcon.asClassName(Codicon.sync),
						label: localize('mcpUpdate', "Update Tools"),
						pickable: false,
						run: () => {
							treePicker.busy = true;
							(async () => {
								const ok = await startServerAndWaitForLiveTools(mcpServer, { promptType: 'all-untrusted' });
								if (!ok) {
									mcpServer.showOutput();
									treePicker.hide();
									return;
								}
								treePicker.busy = false;
								computeItems(collectResults());
							})();
							return false;
						},
					});
				}
				const bucket: IBucketTreeItem = {
					itemType: 'bucket',
					ordinal: BucketOrdinal.Mcp,
					id: key,
					label: source.label,
					checked: undefined,
					collapsed,
					children,
					buttons,
					sortOrder: 2,
				};
				const iconPath = mcpServer.serverMetadata.get()?.icons.getUrl(22);
				if (iconPath) {
					bucket.iconPath = iconPath;
				} else {
					bucket.iconClass = ThemeIcon.asClassName(Codicon.mcp);
				}
				return bucket;
			} else if (source.type === 'extension') {
				return {
					itemType: 'bucket',
					ordinal: BucketOrdinal.Extension,
					id: key,
					label: source.label,
					checked: undefined,
					children: [],
					buttons: [],
					collapsed: true,
					iconClass: ThemeIcon.asClassName(Codicon.extensions),
					sortOrder: 3,
				};
			} else if (source.type === 'internal') {
				return {
					itemType: 'bucket',
					ordinal: BucketOrdinal.BuiltIn,
					id: key,
					label: localize('defaultBucketLabel', "Built-In"),
					checked: undefined,
					children: [],
					buttons: [],
					collapsed: false,
					sortOrder: 1,
				};
			} else {
				return {
					itemType: 'bucket',
					ordinal: BucketOrdinal.User,
					id: key,
					label: localize('userBucket', "User Defined Tool Sets"),
					checked: undefined,
					children: [],
					buttons: [],
					collapsed: true,
					sortOrder: 4,
				};
			}
		};

		const getBucket = (source: ToolDataSource): IBucketTreeItem | undefined => {
			const key = getKey(source);
			let bucket = bucketMap.get(key);
			if (!bucket) {
				bucket = createBucket(source, key);
				if (bucket) {
					bucketMap.set(key, bucket);
				}
			}
			return bucket;
		};

		for (const toolSet of toolsService.toolSets.get()) {
			if (!toolsEntries.has(toolSet)) {
				continue;
			}
			const bucket = getBucket(toolSet.source);
			if (!bucket) {
				continue;
			}
			const toolSetChecked = toolsEntries.get(toolSet) === true;
			if (toolSet.source.type === 'mcp') {
				// bucket represents the toolset
				bucket.toolset = toolSet;
				if (toolSetChecked) {
					bucket.checked = toolSetChecked;
				}
				// all mcp tools are part of toolsService.getTools()
			} else {
				const treeItem = createToolSetTreeItem(toolSet, toolSetChecked, editorService);
				bucket.children.push(treeItem);
				const children = [];
				for (const tool of toolSet.getTools()) {
					const toolChecked = toolSetChecked || toolsEntries.get(tool) === true;
					const toolTreeItem = createToolTreeItemFromData(tool, toolChecked);
					children.push(toolTreeItem);
				}
				if (children.length > 0) {
					treeItem.children = children;
				}
			}
		}
		for (const tool of toolsService.getTools()) {
			if (!tool.canBeReferencedInPrompt || !toolsEntries.has(tool)) {
				continue;
			}
			const bucket = getBucket(tool.source);
			if (!bucket) {
				continue;
			}
			const toolChecked = bucket.checked === true || toolsEntries.get(tool) === true;
			const toolTreeItem = createToolTreeItemFromData(tool, toolChecked);
			bucket.children.push(toolTreeItem);
		}

		// Show entries for MCP servers that don't have any tools in them and might need to be started.
		for (const { server, seen } of mcpServers.values()) {
			const cacheState = server.cacheState.get();
			if (!seen && (cacheState === McpServerCacheState.Unknown || cacheState === McpServerCacheState.Outdated)) {
				getBucket({ type: 'mcp', definitionId: server.definition.id, label: server.definition.label, instructions: '', serverLabel: '', collectionId: server.collection.id });
			}
		}

		// Convert bucket map to sorted tree items
		const sortedBuckets = Array.from(bucketMap.values()).sort((a, b) => {
			if (a.sortOrder !== b.sortOrder) {
				return a.sortOrder - b.sortOrder;
			}
			return a.label.localeCompare(b.label);
		});
		for (const bucket of sortedBuckets) {
			treeItems.push(bucket);
			// Sort children alphabetically
			bucket.children.sort((a, b) => a.label.localeCompare(b.label));
			for (const child of bucket.children) {
				if (isToolSetTreeItem(child) && child.children) {
					child.children.sort((a, b) => a.label.localeCompare(b.label));
				}
			}
		}
		if (treeItems.length === 0) {
			treePicker.placeholder = localize('noTools', "Add tools to chat");
		} else {
			treePicker.placeholder = placeHolder;
		}
		treePicker.setItemTree(treeItems);
	}

	// Create and configure the tree picker
	const store = new DisposableStore();
	const treePicker = store.add(quickPickService.createQuickTree<AnyTreeItem>());

	treePicker.placeholder = placeHolder;
	treePicker.ignoreFocusOut = true;
	treePicker.description = description;
	treePicker.matchOnDescription = true;
	treePicker.matchOnLabel = true;
	treePicker.sortByLabel = false;

	computeItems();

	// Handle button triggers
	store.add(treePicker.onDidTriggerItemButton(e => {
		if (e.button && typeof (e.button as ActionableButton).action === 'function') {
			(e.button as ActionableButton).action();
			store.dispose();
		}
	}));

	const updateToolLimitMessage = () => {
		if (toolLimit) {
			let count = 0;
			const traverse = (items: readonly AnyTreeItem[]) => {
				for (const item of items) {
					if (isBucketTreeItem(item) || isToolSetTreeItem(item)) {
						if (item.children) {
							traverse(item.children);
						}
					} else if (isToolTreeItem(item) && item.checked) {
						count++;
					}
				}
			};
			traverse(treePicker.itemTree);
			if (count > toolLimit) {
				treePicker.severity = Severity.Warning;
				treePicker.validationMessage = localize('toolLimitExceeded', "{0} tools are enabled. You may experience degraded tool calling above {1} tools.", count, createMarkdownCommandLink({ title: String(toolLimit), id: '_chat.toolPicker.closeAndOpenVirtualThreshold' }));
			} else {
				treePicker.severity = Severity.Ignore;
				treePicker.validationMessage = undefined;
			}
		}
	};
	updateToolLimitMessage();

	const collectResults = () => {

		const result = new Map<IToolData | ToolSet, boolean>();
		const traverse = (items: readonly AnyTreeItem[]) => {
			for (const item of items) {
				if (isBucketTreeItem(item)) {
					if (item.toolset) { // MCP server
						// MCP toolset is enabled only if all tools are enabled
						const allChecked = item.checked === true;
						result.set(item.toolset, allChecked);
					}
					traverse(item.children);
				} else if (isToolSetTreeItem(item)) {
					result.set(item.toolset, item.checked === true);
					if (item.children) {
						traverse(item.children);
					}
				} else if (isToolTreeItem(item)) {
					result.set(item.tool, item.checked || result.get(item.tool) === true); // tools can be in user tool sets and other buckets
				}
			}
		};

		traverse(treePicker.itemTree);
		return result;
	};

	// Temporary command to close the picker and open settings, for use in the validation message
	store.add(CommandsRegistry.registerCommand({
		id: '_chat.toolPicker.closeAndOpenVirtualThreshold',
		handler: () => {
			treePicker.hide();
			commandService.executeCommand('workbench.action.openSettings', 'github.copilot.chat.virtualTools.threshold');
		}
	}));

	// Handle checkbox state changes
	store.add(treePicker.onDidChangeCheckedLeafItems(() => updateToolLimitMessage()));

	// Handle acceptance
	let didAccept = false;
	const didAcceptFinalItem = store.add(new Emitter<void>());
	store.add(treePicker.onDidAccept(() => {
		// Check if a callback item was activated
		const activeItems = treePicker.activeItems;
		const callbackItem = activeItems.find(isCallbackTreeItem);
		if (!callbackItem) {
			didAccept = true;
			treePicker.hide();
			return;
		}

		const ret = callbackItem.run();
		if (ret !== false) {
			didAcceptFinalItem.fire();
		}
	}));

	const addMcpServerButton = {
		iconClass: ThemeIcon.asClassName(Codicon.mcp),
		tooltip: localize('addMcpServer', 'Add MCP Server...')
	};
	const installExtension = {
		iconClass: ThemeIcon.asClassName(Codicon.extensions),
		tooltip: localize('addExtensionButton', 'Install Extension...')
	};
	const configureToolSets = {
		iconClass: ThemeIcon.asClassName(Codicon.gear),
		tooltip: localize('configToolSets', 'Configure Tool Sets...')
	};
	treePicker.title = localize('configureTools', "Configure Tools");
	treePicker.buttons = [addMcpServerButton, installExtension, configureToolSets];
	store.add(treePicker.onDidTriggerButton(button => {
		if (button === addMcpServerButton) {
			commandService.executeCommand(McpCommandIds.AddConfiguration);
		} else if (button === installExtension) {
			extensionsWorkbenchService.openSearch('@tag:language-model-tools');
		} else if (button === configureToolSets) {
			commandService.executeCommand(ConfigureToolSets.ID);
		}
		treePicker.hide();
	}));

	// Close picker when cancelled (e.g., when mode changes)
	if (token) {
		store.add(token.onCancellationRequested(() => {
			treePicker.hide();
		}));
	}

	treePicker.show();

	await Promise.race([Event.toPromise(Event.any(treePicker.onDidHide, didAcceptFinalItem.event), store)]);

	store.dispose();

	return didAccept ? collectResults() : undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatTransfer.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatTransfer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IChatTransferService } from '../../common/chatTransferService.js';

export class ChatTransferContribution extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.chatTransfer';

	constructor(
		@IChatTransferService chatTransferService: IChatTransferService,
	) {
		super();
		chatTransferService.checkAndSetTransferredWorkspaceTrust();
	}
}
```

--------------------------------------------------------------------------------

````
