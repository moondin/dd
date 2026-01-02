---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 356
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 356 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/simpleBrowserEditorOverlay.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/simpleBrowserEditorOverlay.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import '../media/simpleBrowserOverlay.css';
import { combinedDisposable, DisposableMap, DisposableStore, toDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun, derivedOpts, observableFromEvent, observableSignalFromEvent } from '../../../../../base/common/observable.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { localize } from '../../../../../nls.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { IEditorGroup, IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { EditorGroupView } from '../../../../browser/parts/editor/editorGroupView.js';
import { Event } from '../../../../../base/common/event.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { EditorResourceAccessor, SideBySideEditor } from '../../../../common/editor.js';
import { isEqual, joinPath } from '../../../../../base/common/resources.js';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { IHostService } from '../../../../services/host/browser/host.js';
import { IChatWidgetService } from '../chat.js';
import { Button, ButtonWithDropdown } from '../../../../../base/browser/ui/button/button.js';
import { defaultButtonStyles } from '../../../../../platform/theme/browser/defaultStyles.js';
import { addDisposableListener } from '../../../../../base/browser/dom.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { cleanupOldImages, createFileForMedia } from '../chatImageUtils.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { URI } from '../../../../../base/common/uri.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IChatRequestVariableEntry } from '../../common/chatVariableEntries.js';
import { IPreferencesService } from '../../../../services/preferences/common/preferences.js';
import { IBrowserElementsService } from '../../../../services/browserElements/browser/browserElementsService.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IAction, toAction } from '../../../../../base/common/actions.js';
import { BrowserType } from '../../../../../platform/browserElements/common/browserElements.js';

class SimpleBrowserOverlayWidget {

	private readonly _domNode: HTMLElement;

	private readonly imagesFolder: URI;

	private readonly _showStore = new DisposableStore();

	private _timeout: Timeout | undefined = undefined;

	private _activeBrowserType: BrowserType | undefined = undefined;

	constructor(
		private readonly _editor: IEditorGroup,
		private readonly _container: HTMLElement,
		@IHostService private readonly _hostService: IHostService,
		@IChatWidgetService private readonly _chatWidgetService: IChatWidgetService,
		@IFileService private readonly fileService: IFileService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@ILogService private readonly logService: ILogService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IPreferencesService private readonly _preferencesService: IPreferencesService,
		@IBrowserElementsService private readonly _browserElementsService: IBrowserElementsService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
	) {
		this._showStore.add(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('chat.sendElementsToChat.enabled')) {
				if (this.configurationService.getValue('chat.sendElementsToChat.enabled')) {
					this.showElement(this._domNode);
				} else {
					this.hideElement(this._domNode);
				}
			}
		}));

		this.imagesFolder = joinPath(this.environmentService.workspaceStorageHome, 'vscode-chat-images');
		cleanupOldImages(this.fileService, this.logService, this.imagesFolder);

		this._domNode = document.createElement('div');
		this._domNode.className = 'element-selection-message';

		const mainContent = document.createElement('div');
		mainContent.className = 'element-selection-main-content';

		const message = document.createElement('span');
		const startSelectionMessage = localize('elementSelectionMessage', 'Add element to chat');
		message.textContent = startSelectionMessage;
		mainContent.appendChild(message);

		let cts: CancellationTokenSource;
		const actions: IAction[] = [];
		actions.push(
			toAction({
				id: 'singleSelection',
				label: localize('selectElementDropdown', 'Select an Element'),
				enabled: true,
				run: async () => { await startElementSelection(); }
			}),
			toAction({
				id: 'continuousSelection',
				label: localize('continuousSelectionDropdown', 'Continuous Selection'),
				enabled: true,
				run: async () => {
					this._editor.focus();
					cts = new CancellationTokenSource();
					// start selection
					message.textContent = localize('elementSelectionInProgress', 'Selecting element...');
					this.hideElement(startButton.element);
					this.showElement(cancelButton.element);
					cancelButton.label = localize('finishSelectionLabel', 'Done');
					while (!cts.token.isCancellationRequested) {
						try {
							await this.addElementToChat(cts);
						} catch (err) {
							this.logService.error('Failed to select this element.', err);
							cts.cancel();
							break;
						}
					}

					// stop selection
					message.textContent = localize('elementSelectionComplete', 'Element added to chat');
					finishedSelecting();
				}
			}));

		const startButton = this._showStore.add(new ButtonWithDropdown(mainContent, {
			actions: actions,
			addPrimaryActionToDropdown: false,
			contextMenuProvider: this.contextMenuService,
			supportShortLabel: true,
			title: localize('selectAnElement', 'Click to select an element.'),
			supportIcons: true,
			...defaultButtonStyles
		}));

		startButton.primaryButton.label = localize('startSelection', 'Start');
		startButton.element.classList.add('element-selection-start');

		const cancelButton = this._showStore.add(new Button(mainContent, { ...defaultButtonStyles, supportIcons: true, title: localize('cancelSelection', 'Click to cancel selection.') }));
		cancelButton.element.className = 'element-selection-cancel hidden';
		const cancelButtonLabel = localize('cancelSelectionLabel', 'Cancel');
		cancelButton.label = cancelButtonLabel;

		const configure = this._showStore.add(new Button(mainContent, { supportIcons: true, title: localize('chat.configureElements', "Configure Attachments Sent") }));
		configure.icon = Codicon.gear;

		const collapseOverlay = this._showStore.add(new Button(mainContent, { supportIcons: true, title: localize('chat.hideOverlay', "Collapse Overlay") }));
		collapseOverlay.icon = Codicon.chevronRight;

		const nextSelection = this._showStore.add(new Button(mainContent, { supportIcons: true, title: localize('chat.nextSelection', "Select Again") }));
		nextSelection.icon = Codicon.close;
		nextSelection.element.classList.add('hidden');

		// shown if the overlay is collapsed
		const expandContainer = document.createElement('div');
		expandContainer.className = 'element-expand-container hidden';
		const expandOverlay = this._showStore.add(new Button(expandContainer, { supportIcons: true, title: localize('chat.expandOverlay', "Expand Overlay") }));
		expandOverlay.icon = Codicon.layout;

		this._domNode.appendChild(mainContent);
		this._domNode.appendChild(expandContainer);

		const resetButtons = () => {
			this.hideElement(nextSelection.element);
			this.showElement(startButton.element);
			this.showElement(collapseOverlay.element);
		};

		const finishedSelecting = () => {
			// stop selection
			this.hideElement(cancelButton.element);
			cancelButton.label = cancelButtonLabel;
			this.hideElement(collapseOverlay.element);
			this.showElement(nextSelection.element);

			// wait 3 seconds before showing the start button again unless cancelled out.
			this._timeout = setTimeout(() => {
				message.textContent = startSelectionMessage;
				resetButtons();
			}, 3000);
		};

		const startElementSelection = async () => {
			cts = new CancellationTokenSource();
			this._editor.focus();

			// start selection
			message.textContent = localize('elementSelectionInProgress', 'Selecting element...');
			this.hideElement(startButton.element);
			this.showElement(cancelButton.element);
			await this.addElementToChat(cts);

			// stop selection
			message.textContent = localize('elementSelectionComplete', 'Element added to chat');
			finishedSelecting();
		};

		this._showStore.add(addDisposableListener(startButton.primaryButton.element, 'click', async () => {
			await startElementSelection();
		}));

		this._showStore.add(addDisposableListener(cancelButton.element, 'click', () => {
			cts.cancel();
			message.textContent = localize('elementCancelMessage', 'Selection canceled');
			finishedSelecting();
		}));

		this._showStore.add(addDisposableListener(collapseOverlay.element, 'click', () => {
			this.hideElement(mainContent);
			this.showElement(expandContainer);
		}));

		this._showStore.add(addDisposableListener(expandOverlay.element, 'click', () => {
			this.showElement(mainContent);
			this.hideElement(expandContainer);
		}));

		this._showStore.add(addDisposableListener(nextSelection.element, 'click', () => {
			clearTimeout(this._timeout);
			message.textContent = startSelectionMessage;
			resetButtons();
		}));

		this._showStore.add(addDisposableListener(configure.element, 'click', () => {
			this._preferencesService.openSettings({ jsonEditor: false, query: '@id:chat.sendElementsToChat.enabled,chat.sendElementsToChat.attachCSS,chat.sendElementsToChat.attachImages' });
		}));
	}

	setActiveBrowserType(type: BrowserType | undefined) {
		this._activeBrowserType = type;
	}

	hideElement(element: HTMLElement) {
		if (element.classList.contains('hidden')) {
			return;
		}
		element.classList.add('hidden');
	}

	showElement(element: HTMLElement) {
		if (!element.classList.contains('hidden')) {
			return;
		}
		element.classList.remove('hidden');
	}

	async addElementToChat(cts: CancellationTokenSource) {
		// eslint-disable-next-line no-restricted-syntax
		const editorContainer = this._container.querySelector('.editor-container') as HTMLDivElement;
		const editorContainerPosition = editorContainer ? editorContainer.getBoundingClientRect() : this._container.getBoundingClientRect();

		const elementData = await this._browserElementsService.getElementData(editorContainerPosition, cts.token, this._activeBrowserType);
		if (!elementData) {
			throw new Error('Element data not found');
		}
		const bounds = elementData.bounds;
		const toAttach: IChatRequestVariableEntry[] = [];

		const widget = await this._chatWidgetService.revealWidget() ?? this._chatWidgetService.lastFocusedWidget;
		let value = 'Attached HTML and CSS Context\n\n' + elementData.outerHTML;
		if (this.configurationService.getValue('chat.sendElementsToChat.attachCSS')) {
			value += '\n\n' + elementData.computedStyle;
		}
		toAttach.push({
			id: 'element-' + Date.now(),
			name: this.getDisplayNameFromOuterHTML(elementData.outerHTML),
			fullName: this.getDisplayNameFromOuterHTML(elementData.outerHTML),
			value: value,
			kind: 'element',
			icon: ThemeIcon.fromId(Codicon.layout.id),
		});

		if (this.configurationService.getValue('chat.sendElementsToChat.attachImages')) {
			// remove container so we don't block anything on screenshot
			this._domNode.style.display = 'none';

			// Wait 1 extra frame to make sure overlay is gone
			await new Promise(resolve => setTimeout(resolve, 100));

			const screenshot = await this._hostService.getScreenshot(bounds);
			if (!screenshot) {
				throw new Error('Screenshot failed');
			}
			const fileReference = await createFileForMedia(this.fileService, this.imagesFolder, screenshot.buffer, 'image/png');
			toAttach.push({
				id: 'element-screenshot-' + Date.now(),
				name: 'Element Screenshot',
				fullName: 'Element Screenshot',
				kind: 'image',
				value: screenshot.buffer,
				references: fileReference ? [{ reference: fileReference, kind: 'reference' }] : [],
			});

			this._domNode.style.display = '';
		}

		widget?.attachmentModel?.addContext(...toAttach);
	}


	getDisplayNameFromOuterHTML(outerHTML: string): string {
		const firstElementMatch = outerHTML.match(/^<(\w+)([^>]*?)>/);
		if (!firstElementMatch) {
			throw new Error('No outer element found');
		}

		const tagName = firstElementMatch[1];
		const idMatch = firstElementMatch[2].match(/\s+id\s*=\s*["']([^"']+)["']/i);
		const id = idMatch ? `#${idMatch[1]}` : '';
		const classMatch = firstElementMatch[2].match(/\s+class\s*=\s*["']([^"']+)["']/i);
		const className = classMatch ? `.${classMatch[1].replace(/\s+/g, '.')}` : '';
		return `${tagName}${id}${className}`;
	}

	dispose() {
		this._showStore.dispose();
	}

	getDomNode(): HTMLElement {
		return this._domNode;
	}
}

class SimpleBrowserOverlayController {

	private readonly _store = new DisposableStore();

	private readonly _domNode = document.createElement('div');

	constructor(
		container: HTMLElement,
		group: IEditorGroup,
		@IInstantiationService instaService: IInstantiationService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IBrowserElementsService private readonly _browserElementsService: IBrowserElementsService,
	) {

		if (!this.configurationService.getValue('chat.sendElementsToChat.enabled')) {
			return;
		}

		this._domNode.classList.add('chat-simple-browser-overlay');
		this._domNode.style.position = 'absolute';
		this._domNode.style.bottom = `5px`;
		this._domNode.style.right = `5px`;
		this._domNode.style.zIndex = `100`;

		const widget = instaService.createInstance(SimpleBrowserOverlayWidget, group, container);
		this._domNode.appendChild(widget.getDomNode());
		this._store.add(toDisposable(() => this._domNode.remove()));
		this._store.add(widget);

		const connectingWebviewElement = document.createElement('div');
		connectingWebviewElement.className = 'connecting-webview-element';


		const getActiveBrowserType = () => {
			const editor = group.activeEditorPane;
			const isSimpleBrowser = editor?.input.editorId === 'mainThreadWebview-simpleBrowser.view';
			const isLiveServer = editor?.input.editorId === 'mainThreadWebview-browserPreview';
			return isSimpleBrowser ? BrowserType.SimpleBrowser : isLiveServer ? BrowserType.LiveServer : undefined;
		};

		let cts = new CancellationTokenSource();
		const show = async () => {
			// Show the connecting indicator while establishing the session
			connectingWebviewElement.textContent = localize('connectingWebviewElement', 'Connecting to webview...');
			if (!container.contains(connectingWebviewElement)) {
				container.appendChild(connectingWebviewElement);
			}

			cts = new CancellationTokenSource();
			const activeBrowserType = getActiveBrowserType();
			if (activeBrowserType) {
				try {
					await this._browserElementsService.startDebugSession(cts.token, activeBrowserType);
				} catch (error) {
					connectingWebviewElement.textContent = localize('reopenErrorWebviewElement', 'Please reopen the preview.');
					return;
				}
			}

			if (!container.contains(this._domNode)) {
				container.appendChild(this._domNode);
			}
			connectingWebviewElement.remove();
		};

		const hide = () => {
			if (container.contains(this._domNode)) {
				cts.cancel();
				this._domNode.remove();
			}
			connectingWebviewElement.remove();
		};

		const activeEditorSignal = observableSignalFromEvent(this, Event.any(group.onDidActiveEditorChange, group.onDidModelChange));

		const activeUriObs = derivedOpts({ equalsFn: isEqual }, r => {

			activeEditorSignal.read(r); // signal

			const editor = group.activeEditorPane;

			const activeBrowser = getActiveBrowserType();
			widget.setActiveBrowserType(activeBrowser);

			if (activeBrowser) {
				const uri = EditorResourceAccessor.getOriginalUri(editor?.input, { supportSideBySide: SideBySideEditor.PRIMARY });
				return uri;
			}
			return undefined;
		});

		this._store.add(autorun(r => {

			const data = activeUriObs.read(r);

			if (!data) {
				hide();
				return;
			}

			show();
		}));
	}

	dispose(): void {
		this._store.dispose();
	}
}

export class SimpleBrowserOverlay implements IWorkbenchContribution {

	static readonly ID = 'chat.simpleBrowser.overlay';

	private readonly _store = new DisposableStore();

	constructor(
		@IEditorGroupsService editorGroupsService: IEditorGroupsService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		const editorGroups = observableFromEvent(
			this,
			Event.any(editorGroupsService.onDidAddGroup, editorGroupsService.onDidRemoveGroup),
			() => editorGroupsService.groups
		);

		const overlayWidgets = new DisposableMap<IEditorGroup>();

		this._store.add(autorun(r => {

			const toDelete = new Set(overlayWidgets.keys());
			const groups = editorGroups.read(r);


			for (const group of groups) {

				if (!(group instanceof EditorGroupView)) {
					// TODO@jrieken better with https://github.com/microsoft/vscode/tree/ben/layout-group-container
					continue;
				}

				toDelete.delete(group); // we keep the widget for this group!

				if (!overlayWidgets.has(group)) {

					const scopedInstaService = instantiationService.createChild(
						new ServiceCollection([IContextKeyService, group.scopedContextKeyService])
					);

					const container = group.element;


					const ctrl = scopedInstaService.createInstance(SimpleBrowserOverlayController, container, group);
					overlayWidgets.set(group, combinedDisposable(ctrl, scopedInstaService));
				}
			}

			for (const group of toDelete) {
				overlayWidgets.deleteAndDispose(group);
			}
		}));
	}

	dispose(): void {
		this._store.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/notebook/chatEditingModifiedNotebookDiff.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/notebook/chatEditingModifiedNotebookDiff.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { computeDiff } from '../../../../notebook/common/notebookDiff.js';
import { INotebookEditorModelResolverService } from '../../../../notebook/common/notebookEditorModelResolverService.js';
import { INotebookLoggingService } from '../../../../notebook/common/notebookLoggingService.js';
import { INotebookEditorWorkerService } from '../../../../notebook/common/services/notebookWorkerService.js';
import { IEditSessionEntryDiff, ISnapshotEntry } from '../../../common/chatEditingService.js';


export class ChatEditingModifiedNotebookDiff {
	static NewModelCounter: number = 0;
	constructor(
		private readonly original: ISnapshotEntry,
		private readonly modified: ISnapshotEntry,
		@INotebookEditorWorkerService private readonly notebookEditorWorkerService: INotebookEditorWorkerService,
		@INotebookLoggingService private readonly notebookLoggingService: INotebookLoggingService,
		@INotebookEditorModelResolverService private readonly notebookEditorModelService: INotebookEditorModelResolverService,
	) {

	}

	async computeDiff(): Promise<IEditSessionEntryDiff> {

		let added = 0;
		let removed = 0;

		const disposables = new DisposableStore();
		try {
			const [modifiedRef, originalRef] = await Promise.all([
				this.notebookEditorModelService.resolve(this.modified.snapshotUri),
				this.notebookEditorModelService.resolve(this.original.snapshotUri)
			]);
			disposables.add(modifiedRef);
			disposables.add(originalRef);
			const notebookDiff = await this.notebookEditorWorkerService.computeDiff(this.original.snapshotUri, this.modified.snapshotUri);
			const result = computeDiff(originalRef.object.notebook, modifiedRef.object.notebook, notebookDiff);
			result.cellDiffInfo.forEach(diff => {
				switch (diff.type) {
					case 'modified':
					case 'insert':
						added++;
						break;
					case 'delete':
						removed++;
						break;
					default:
						break;
				}
			});
		} catch (e) {
			this.notebookLoggingService.error('Notebook Chat', 'Error computing diff:\n' + e);
		} finally {
			disposables.dispose();
		}

		return {
			added,
			removed,
			identical: added === 0 && removed === 0,
			quitEarly: false,
			isFinal: true,
			modifiedURI: this.modified.snapshotUri,
			originalURI: this.original.snapshotUri,
			isBusy: false,
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/notebook/chatEditingModifiedNotebookSnapshot.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/notebook/chatEditingModifiedNotebookSnapshot.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { decodeBase64, encodeBase64, VSBuffer } from '../../../../../../base/common/buffer.js';
import { filter } from '../../../../../../base/common/objects.js';
import { URI, UriComponents } from '../../../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { SnapshotContext } from '../../../../../services/workingCopy/common/fileWorkingCopy.js';
import { NotebookCellTextModel } from '../../../../notebook/common/model/notebookCellTextModel.js';
import { NotebookTextModel } from '../../../../notebook/common/model/notebookTextModel.js';
import { CellEditType, ICellDto2, ICellEditOperation, INotebookTextModel, IOutputItemDto, NotebookData, NotebookSetting, TransientOptions } from '../../../../notebook/common/notebookCommon.js';

const BufferMarker = 'ArrayBuffer-4f56482b-5a03-49ba-8356-210d3b0c1c3d';

type ChatEditingSnapshotNotebookContentQueryData = { session: UriComponents; requestId: string | undefined; undoStop: string | undefined; viewType: string };
export const ChatEditingNotebookSnapshotScheme = 'chat-editing-notebook-snapshot-model';

export function getNotebookSnapshotFileURI(chatSessionResource: URI, requestId: string | undefined, undoStop: string | undefined, path: string, viewType: string): URI {
	return URI.from({
		scheme: ChatEditingNotebookSnapshotScheme,
		path,
		query: JSON.stringify({ session: chatSessionResource, requestId: requestId ?? '', undoStop: undoStop ?? '', viewType } satisfies ChatEditingSnapshotNotebookContentQueryData),
	});
}

export function parseNotebookSnapshotFileURI(resource: URI): ChatEditingSnapshotNotebookContentQueryData {
	const data: ChatEditingSnapshotNotebookContentQueryData = JSON.parse(resource.query);
	return { session: data.session, requestId: data.requestId ?? '', undoStop: data.undoStop ?? '', viewType: data.viewType };
}

export function createSnapshot(notebook: INotebookTextModel, transientOptions: TransientOptions | undefined, outputSizeConfig: IConfigurationService | number): string {
	const outputSizeLimit = (typeof outputSizeConfig === 'number' ? outputSizeConfig : outputSizeConfig.getValue<number>(NotebookSetting.outputBackupSizeLimit)) * 1024;
	return serializeSnapshot(notebook.createSnapshot({ context: SnapshotContext.Backup, outputSizeLimit, transientOptions }), transientOptions);
}

export function restoreSnapshot(notebook: INotebookTextModel, snapshot: string): void {
	try {
		const { transientOptions, data } = deserializeSnapshot(snapshot);
		notebook.restoreSnapshot(data, transientOptions);
		const edits: ICellEditOperation[] = [];
		data.cells.forEach((cell, index) => {
			const internalId = cell.internalMetadata?.internalId;
			if (internalId) {
				edits.push({ editType: CellEditType.PartialInternalMetadata, index, internalMetadata: { internalId } });
			}
		});
		notebook.applyEdits(edits, true, undefined, () => undefined, undefined, false);
	}
	catch (ex) {
		console.error('Error restoring Notebook snapshot', ex);
	}
}

export class SnapshotComparer {
	private readonly data: NotebookData;
	private readonly transientOptions: TransientOptions | undefined;
	constructor(initialCotent: string) {
		const { transientOptions, data } = deserializeSnapshot(initialCotent);
		this.transientOptions = transientOptions;
		this.data = data;
	}

	isEqual(notebook: NotebookData | NotebookTextModel): boolean {
		if (notebook.cells.length !== this.data.cells.length) {
			return false;
		}
		const transientDocumentMetadata = this.transientOptions?.transientDocumentMetadata || {};
		const notebookMetadata = filter(notebook.metadata || {}, key => !transientDocumentMetadata[key]);
		const comparerMetadata = filter(this.data.metadata || {}, key => !transientDocumentMetadata[key]);
		// When comparing ignore transient items.
		if (JSON.stringify(notebookMetadata) !== JSON.stringify(comparerMetadata)) {
			return false;
		}
		const transientCellMetadata = this.transientOptions?.transientCellMetadata || {};
		for (let i = 0; i < notebook.cells.length; i++) {
			const notebookCell = notebook.cells[i];
			const comparerCell = this.data.cells[i];
			if (notebookCell instanceof NotebookCellTextModel) {
				if (!notebookCell.fastEqual(comparerCell, true)) {
					return false;
				}
			} else {
				if (notebookCell.cellKind !== comparerCell.cellKind) {
					return false;
				}
				if (notebookCell.language !== comparerCell.language) {
					return false;
				}
				if (notebookCell.mime !== comparerCell.mime) {
					return false;
				}
				if (notebookCell.source !== comparerCell.source) {
					return false;
				}
				if (!this.transientOptions?.transientOutputs && notebookCell.outputs.length !== comparerCell.outputs.length) {
					return false;
				}
				// When comparing ignore transient items.
				const cellMetadata = filter(notebookCell.metadata || {}, key => !transientCellMetadata[key]);
				const comparerCellMetadata = filter(comparerCell.metadata || {}, key => !transientCellMetadata[key]);
				if (JSON.stringify(cellMetadata) !== JSON.stringify(comparerCellMetadata)) {
					return false;
				}

				// When comparing ignore transient items.
				if (JSON.stringify(sanitizeCellDto2(notebookCell, true, this.transientOptions)) !== JSON.stringify(sanitizeCellDto2(comparerCell, true, this.transientOptions))) {
					return false;
				}
			}
		}

		return true;
	}
}

function sanitizeCellDto2(cell: ICellDto2, ignoreInternalMetadata?: boolean, transientOptions?: TransientOptions): ICellDto2 {
	const transientCellMetadata = transientOptions?.transientCellMetadata || {};
	const outputs = transientOptions?.transientOutputs ? [] : cell.outputs.map(output => {
		// Ensure we're in full control of the data being stored.
		// Possible we have classes instead of plain objects.
		return {
			outputId: output.outputId,
			metadata: output.metadata,
			outputs: output.outputs.map(item => {
				return {
					data: item.data,
					mime: item.mime,
				} satisfies IOutputItemDto;
			}),
		};
	});
	// Ensure we're in full control of the data being stored.
	// Possible we have classes instead of plain objects.
	return {
		cellKind: cell.cellKind,
		language: cell.language,
		metadata: cell.metadata ? filter(cell.metadata, key => !transientCellMetadata[key]) : cell.metadata,
		outputs,
		mime: cell.mime,
		source: cell.source,
		collapseState: cell.collapseState,
		internalMetadata: ignoreInternalMetadata ? undefined : cell.internalMetadata
	} satisfies ICellDto2;
}

function serializeSnapshot(data: NotebookData, transientOptions: TransientOptions | undefined): string {
	const dataDto: NotebookData = {
		// Never pass transient options, as we're after a backup here.
		// Else we end up stripping outputs from backups.
		// Whether its persisted or not is up to the serializer.
		// However when reloading/restoring we need to preserve outputs.
		cells: data.cells.map(cell => sanitizeCellDto2(cell)),
		metadata: data.metadata,
	};
	return JSON.stringify([
		JSON.stringify(transientOptions)
		, JSON.stringify(dataDto, (_key, value) => {
			if (value instanceof VSBuffer) {
				return {
					type: BufferMarker,
					data: encodeBase64(value)
				};
			}
			return value;
		})
	]);
}

export function deserializeSnapshot(snapshot: string): { transientOptions: TransientOptions | undefined; data: NotebookData } {
	const [transientOptionsStr, dataStr] = JSON.parse(snapshot);
	const transientOptions = transientOptionsStr ? JSON.parse(transientOptionsStr) as TransientOptions : undefined;

	const data: NotebookData = JSON.parse(dataStr, (_key, value) => {
		if (value && value.type === BufferMarker) {
			return decodeBase64(value.data);
		}
		return value;
	});

	return { transientOptions, data };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/notebook/chatEditingNewNotebookContentEdits.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/notebook/chatEditingNewNotebookContentEdits.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../../../base/common/buffer.js';
import { TextEdit } from '../../../../../../editor/common/languages.js';
import { NotebookTextModel } from '../../../../notebook/common/model/notebookTextModel.js';
import { CellEditType, ICellEditOperation } from '../../../../notebook/common/notebookCommon.js';
import { INotebookService } from '../../../../notebook/common/notebookService.js';


/**
 * When asking LLM to generate a new notebook, LLM might end up generating the notebook
 * using the raw file format.
 * E.g. assume we ask LLM to generate a new Github Issues notebook, LLM might end up
 * genrating the notebook using the JSON format of github issues file.
 * Such a format is not known to copilot extension and those are sent over as regular
 * text edits for the Notebook URI.
 *
 * In such cases we should accumulate all of the edits, generate the content and deserialize the content
 * into a notebook, then generate notebooke edits to insert these cells.
 */
export class ChatEditingNewNotebookContentEdits {
	private readonly textEdits: TextEdit[] = [];
	constructor(
		private readonly notebook: NotebookTextModel,
		@INotebookService private readonly _notebookService: INotebookService,
	) {
	}

	acceptTextEdits(edits: TextEdit[]): void {
		if (edits.length) {
			this.textEdits.push(...edits);
		}
	}

	async generateEdits(): Promise<ICellEditOperation[]> {
		if (this.notebook.cells.length) {
			console.error(`Notebook edits not generated as notebook already has cells`);
			return [];
		}
		const content = this.generateContent();
		if (!content) {
			return [];
		}

		const notebookEdits: ICellEditOperation[] = [];
		try {
			const { serializer } = await this._notebookService.withNotebookDataProvider(this.notebook.viewType);
			const data = await serializer.dataToNotebook(VSBuffer.fromString(content));
			for (let i = 0; i < data.cells.length; i++) {
				notebookEdits.push({
					editType: CellEditType.Replace,
					index: i,
					count: 0,
					cells: [data.cells[i]]
				});
			}
		} catch (ex) {
			console.error(`Failed to generate notebook edits from text edits ${content}`, ex);
			return [];
		}

		return notebookEdits;
	}

	private generateContent() {
		try {
			return applyTextEdits(this.textEdits);
		} catch (ex) {
			console.error('Failed to generate content from text edits', ex);
			return '';
		}
	}
}

function applyTextEdits(edits: TextEdit[]): string {
	let output = '';
	for (const edit of edits) {
		output = output.slice(0, edit.range.startColumn)
			+ edit.text
			+ output.slice(edit.range.endColumn);
	}
	return output;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/notebook/chatEditingNotebookCellEntry.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/notebook/chatEditingNotebookCellEntry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { IObservable, observableValue, transaction } from '../../../../../../base/common/observable.js';
import { URI } from '../../../../../../base/common/uri.js';
import { IRange } from '../../../../../../editor/common/core/range.js';
import { IDocumentDiff } from '../../../../../../editor/common/diff/documentDiffProvider.js';
import { DetailedLineRangeMapping } from '../../../../../../editor/common/diff/rangeMapping.js';
import { TextEdit } from '../../../../../../editor/common/languages.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { CellEditState } from '../../../../notebook/browser/notebookBrowser.js';
import { INotebookEditorService } from '../../../../notebook/browser/services/notebookEditorService.js';
import { NotebookCellTextModel } from '../../../../notebook/common/model/notebookCellTextModel.js';
import { CellKind } from '../../../../notebook/common/notebookCommon.js';
import { ModifiedFileEntryState } from '../../../common/chatEditingService.js';
import { IChatResponseModel } from '../../../common/chatModel.js';
import { ChatEditingTextModelChangeService } from '../chatEditingTextModelChangeService.js';


/**
 * This is very closely similar to the ChatEditingModifiedDocumentEntry class.
 * Most of the code has been borrowed from there, as a cell is effectively a document.
 * Hence most of the same functionality applies.
 */
export class ChatEditingNotebookCellEntry extends Disposable {
	public get isDisposed(): boolean {
		return this._store.isDisposed;
	}

	public get isEditFromUs(): boolean {
		return this._textModelChangeService.isEditFromUs;
	}

	public get allEditsAreFromUs(): boolean {
		return this._textModelChangeService.allEditsAreFromUs;
	}
	public get diffInfo(): IObservable<IDocumentDiff> {
		return this._textModelChangeService.diffInfo;
	}
	private readonly _maxModifiedLineNumber = observableValue<number>(this, 0);
	readonly maxModifiedLineNumber = this._maxModifiedLineNumber;

	protected readonly _stateObs = observableValue<ModifiedFileEntryState>(this, ModifiedFileEntryState.Modified);
	readonly state: IObservable<ModifiedFileEntryState> = this._stateObs;
	private readonly initialContent: string;
	private readonly _textModelChangeService: ChatEditingTextModelChangeService;
	constructor(
		public readonly notebookUri: URI,
		public readonly cell: NotebookCellTextModel,
		private readonly modifiedModel: ITextModel,
		private readonly originalModel: ITextModel,
		isExternalEditInProgress: (() => boolean) | undefined,
		disposables: DisposableStore,
		@INotebookEditorService private readonly notebookEditorService: INotebookEditorService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();
		this.initialContent = this.originalModel.getValue();
		this._register(disposables);
		this._textModelChangeService = this._register(this.instantiationService.createInstance(ChatEditingTextModelChangeService, this.originalModel, this.modifiedModel, this.state, isExternalEditInProgress));

		this._register(this._textModelChangeService.onDidAcceptOrRejectAllHunks(action => {
			this.revertMarkdownPreviewState();
			this._stateObs.set(action, undefined);
		}));

		this._register(this._textModelChangeService.onDidUserEditModel(() => {
			const didResetToOriginalContent = this.modifiedModel.getValue() === this.initialContent;
			if (this._stateObs.get() === ModifiedFileEntryState.Modified && didResetToOriginalContent) {
				this._stateObs.set(ModifiedFileEntryState.Rejected, undefined);
			}
		}));

	}

	public hasModificationAt(range: IRange): boolean {
		return this._textModelChangeService.hasHunkAt(range);
	}

	public clearCurrentEditLineDecoration() {
		if (this.modifiedModel.isDisposed()) {
			return;
		}
		this._textModelChangeService.clearCurrentEditLineDecoration();
	}

	async acceptAgentEdits(textEdits: TextEdit[], isLastEdits: boolean, responseModel: IChatResponseModel | undefined): Promise<void> {
		const { maxLineNumber } = await this._textModelChangeService.acceptAgentEdits(this.modifiedModel.uri, textEdits, isLastEdits, responseModel);

		transaction((tx) => {
			if (!isLastEdits) {
				this._stateObs.set(ModifiedFileEntryState.Modified, tx);
				this._maxModifiedLineNumber.set(maxLineNumber, tx);

			} else {
				this._maxModifiedLineNumber.set(0, tx);
			}
		});
	}

	revertMarkdownPreviewState(): void {
		if (this.cell.cellKind !== CellKind.Markup) {
			return;
		}

		const notebookEditor = this.notebookEditorService.retrieveExistingWidgetFromURI(this.notebookUri)?.value;
		if (notebookEditor) {
			const vm = notebookEditor.getCellByHandle(this.cell.handle);
			if (vm?.getEditState() === CellEditState.Editing &&
				(vm.editStateSource === 'chatEdit' || vm.editStateSource === 'chatEditNavigation')) {
				vm?.updateEditState(CellEditState.Preview, 'chatEdit');
			}
		}
	}

	public async keep(change: DetailedLineRangeMapping): Promise<boolean> {
		return this._textModelChangeService.diffInfo.get().keep(change);
	}

	public async undo(change: DetailedLineRangeMapping): Promise<boolean> {
		return this._textModelChangeService.diffInfo.get().undo(change);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/notebook/chatEditingNotebookEditorIntegration.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/notebook/chatEditingNotebookEditorIntegration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ActionViewItem } from '../../../../../../base/browser/ui/actionbar/actionViewItems.js';
import { Disposable, IDisposable, toDisposable } from '../../../../../../base/common/lifecycle.js';
import { autorun, debouncedObservable, IObservable, ISettableObservable, observableFromEvent, observableValue } from '../../../../../../base/common/observable.js';
import { basename } from '../../../../../../base/common/resources.js';
import { assertType } from '../../../../../../base/common/types.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { LineRange } from '../../../../../../editor/common/core/ranges/lineRange.js';
import { nullDocumentDiff } from '../../../../../../editor/common/diff/documentDiffProvider.js';
import { PrefixSumComputer } from '../../../../../../editor/common/model/prefixSumComputer.js';
import { localize } from '../../../../../../nls.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { MenuId } from '../../../../../../platform/actions/common/actions.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../../../platform/log/common/log.js';
import { IEditorPane, IResourceDiffEditorInput } from '../../../../../common/editor.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';
import { NotebookDeletedCellDecorator } from '../../../../notebook/browser/diff/inlineDiff/notebookDeletedCellDecorator.js';
import { NotebookInsertedCellDecorator } from '../../../../notebook/browser/diff/inlineDiff/notebookInsertedCellDecorator.js';
import { NotebookModifiedCellDecorator } from '../../../../notebook/browser/diff/inlineDiff/notebookModifiedCellDecorator.js';
import { INotebookTextDiffEditor } from '../../../../notebook/browser/diff/notebookDiffEditorBrowser.js';
import { CellEditState, getNotebookEditorFromEditorPane, ICellViewModel, INotebookEditor } from '../../../../notebook/browser/notebookBrowser.js';
import { INotebookEditorService } from '../../../../notebook/browser/services/notebookEditorService.js';
import { NotebookCellTextModel } from '../../../../notebook/common/model/notebookCellTextModel.js';
import { NotebookTextModel } from '../../../../notebook/common/model/notebookTextModel.js';
import { CellKind } from '../../../../notebook/common/notebookCommon.js';
import { IModifiedFileEntryChangeHunk, IModifiedFileEntryEditorIntegration } from '../../../common/chatEditingService.js';
import { ChatEditingCodeEditorIntegration, IDocumentDiff2 } from '../chatEditingCodeEditorIntegration.js';
import { ChatEditingModifiedNotebookEntry } from '../chatEditingModifiedNotebookEntry.js';
import { countChanges, ICellDiffInfo, sortCellChanges } from './notebookCellChanges.js';
import { OverlayToolbarDecorator } from './overlayToolbarDecorator.js';

export class ChatEditingNotebookEditorIntegration extends Disposable implements IModifiedFileEntryEditorIntegration {
	private integration: ChatEditingNotebookEditorWidgetIntegration;
	private notebookEditor: INotebookEditor;
	constructor(
		_entry: ChatEditingModifiedNotebookEntry,
		editor: IEditorPane,
		notebookModel: NotebookTextModel,
		originalModel: NotebookTextModel,
		cellChanges: IObservable<ICellDiffInfo[]>,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		const notebookEditor = getNotebookEditorFromEditorPane(editor);
		assertType(notebookEditor);
		this.notebookEditor = notebookEditor;
		this.integration = this.instantiationService.createInstance(ChatEditingNotebookEditorWidgetIntegration, _entry, notebookEditor, notebookModel, originalModel, cellChanges);
		this._register(editor.onDidChangeControl(() => {
			const notebookEditor = getNotebookEditorFromEditorPane(editor);
			if (notebookEditor && notebookEditor !== this.notebookEditor) {
				this.notebookEditor = notebookEditor;
				this.integration.dispose();
				this.integration = this.instantiationService.createInstance(ChatEditingNotebookEditorWidgetIntegration, _entry, notebookEditor, notebookModel, originalModel, cellChanges);
			}
		}));
	}
	public get currentIndex(): IObservable<number> {
		return this.integration.currentIndex;
	}
	reveal(firstOrLast: boolean): void {
		return this.integration.reveal(firstOrLast);
	}
	next(wrap: boolean): boolean {
		return this.integration.next(wrap);
	}
	previous(wrap: boolean): boolean {
		return this.integration.previous(wrap);
	}
	enableAccessibleDiffView(): void {
		this.integration.enableAccessibleDiffView();
	}
	acceptNearestChange(change: IModifiedFileEntryChangeHunk | undefined): Promise<void> {
		return this.integration.acceptNearestChange(change);
	}
	rejectNearestChange(change: IModifiedFileEntryChangeHunk | undefined): Promise<void> {
		return this.integration.rejectNearestChange(change);
	}
	toggleDiff(change: IModifiedFileEntryChangeHunk | undefined, show?: boolean): Promise<void> {
		return this.integration.toggleDiff(change, show);
	}

	public override dispose(): void {
		this.integration.dispose();
		super.dispose();
	}
}

class ChatEditingNotebookEditorWidgetIntegration extends Disposable implements IModifiedFileEntryEditorIntegration {
	private readonly _currentIndex = observableValue(this, -1);
	readonly currentIndex: IObservable<number> = this._currentIndex;

	private deletedCellDecorator: NotebookDeletedCellDecorator | undefined;
	private insertedCellDecorator: NotebookInsertedCellDecorator | undefined;
	private modifiedCellDecorator: NotebookModifiedCellDecorator | undefined;
	private overlayToolbarDecorator: OverlayToolbarDecorator | undefined;

	private readonly cellEditorIntegrations = new Map<NotebookCellTextModel, { integration: ChatEditingCodeEditorIntegration; diff: ISettableObservable<IDocumentDiff2> }>();

	private readonly markdownEditState = observableValue<string>(this, '');

	private markupCellListeners = new Map<number, IDisposable>();

	private sortedCellChanges: ICellDiffInfo[] = [];
	private changeIndexComputer: PrefixSumComputer = new PrefixSumComputer(new Uint32Array(0));

	constructor(
		private readonly _entry: ChatEditingModifiedNotebookEntry,
		private readonly notebookEditor: INotebookEditor,
		private readonly notebookModel: NotebookTextModel,
		originalModel: NotebookTextModel,
		private readonly cellChanges: IObservable<ICellDiffInfo[]>,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IEditorService private readonly _editorService: IEditorService,
		@INotebookEditorService notebookEditorService: INotebookEditorService,
		@IAccessibilitySignalService private readonly accessibilitySignalService: IAccessibilitySignalService,
		@ILogService private readonly logService: ILogService,
	) {
		super();

		const onDidChangeVisibleRanges = debouncedObservable(observableFromEvent(notebookEditor.onDidChangeVisibleRanges, () => notebookEditor.visibleRanges), 50);

		this._register(toDisposable(() => {
			this.markupCellListeners.forEach((v) => v.dispose());
		}));

		let originalReadonly: boolean | undefined = undefined;
		const shouldBeReadonly = _entry.isCurrentlyBeingModifiedBy.map(value => !!value);
		this._register(autorun(r => {
			const isReadOnly = shouldBeReadonly.read(r);
			const notebookEditor = notebookEditorService.retrieveExistingWidgetFromURI(_entry.modifiedURI)?.value;
			if (!notebookEditor) {
				return;
			}
			if (isReadOnly) {
				originalReadonly ??= notebookEditor.isReadOnly;
				notebookEditor.setOptions({ isReadOnly: true });
			} else if (originalReadonly === false) {
				notebookEditor.setOptions({ isReadOnly: false });
				// Ensure all cells area editable.
				// We make use of chatEditingCodeEditorIntegration to handle cell diffing and navigation.
				// However that also makes the cell read-only. We need to ensure that the cell is editable.
				// E.g. first we make notebook readonly (in here), then cells end up being readonly because notebook is readonly.
				// Then chatEditingCodeEditorIntegration makes cells readonly and keeps track of the original readonly state.
				// However the cell is already readonly because the notebook is readonly.
				// So when we restore the notebook to editable (in here), the cell is made editable again.
				// But when chatEditingCodeEditorIntegration attempts to restore, it will restore the original readonly state.
				// & from the perpspective of chatEditingCodeEditorIntegration, the cell was readonly & should continue to be readonly.
				// To get around this, we wait for a few ms before restoring the original readonly state for each cell.
				const timeout = setTimeout(() => {
					notebookEditor.setOptions({ isReadOnly: true });
					notebookEditor.setOptions({ isReadOnly: false });
					disposable.dispose();
				}, 100);
				const disposable = toDisposable(() => clearTimeout(timeout));
				r.store.add(disposable);
			}
		}));

		// INIT when not streaming nor diffing the response anymore, once per request, and when having changes
		let lastModifyingRequestId: string | undefined;
		this._store.add(autorun(r => {

			if (!_entry.isCurrentlyBeingModifiedBy.read(r)
				&& !_entry.isProcessingResponse.read(r)
				&& lastModifyingRequestId !== _entry.lastModifyingRequestId
				&& cellChanges.read(r).some(c => c.type !== 'unchanged' && !c.diff.read(r).identical)
			) {
				lastModifyingRequestId = _entry.lastModifyingRequestId;
				// Check if any of the changes are visible, if not, reveal the first change.
				const visibleChange = this.sortedCellChanges.find(c => {
					if (c.type === 'unchanged') {
						return false;
					}
					const index = c.modifiedCellIndex ?? c.originalCellIndex;
					return this.notebookEditor.visibleRanges.some(range => index >= range.start && index < range.end);
				});

				if (!visibleChange) {
					this.reveal(true);
				}
			}
		}));

		this._register(autorun(r => {
			this.sortedCellChanges = sortCellChanges(cellChanges.read(r));
			const indexes: number[] = [];
			for (const change of this.sortedCellChanges) {
				indexes.push(change.type === 'insert' || change.type === 'delete' ? 1
					: change.type === 'modified' ? change.diff.read(r).changes.length
						: 0);
			}

			this.changeIndexComputer = new PrefixSumComputer(new Uint32Array(indexes));
			if (this.changeIndexComputer.getTotalSum() === 0) {
				this.revertMarkupCellState();
			}
		}));

		// Build cell integrations (responsible for navigating changes within a cell and decorating cell text changes)
		this._register(autorun(r => {
			if (this.notebookEditor.textModel !== this.notebookModel) {
				return;
			}
			const sortedCellChanges = sortCellChanges(cellChanges.read(r));

			const changes = sortedCellChanges.filter(c => c.type !== 'delete');
			onDidChangeVisibleRanges.read(r);
			if (!changes.length) {
				this.cellEditorIntegrations.forEach(({ diff }) => {
					diff.set({ ...diff.read(undefined), ...nullDocumentDiff }, undefined);
				});
				return;
			}
			this.markdownEditState.read(r);

			const validCells = new Set<NotebookCellTextModel>();
			changes.forEach((change) => {
				if (change.modifiedCellIndex === undefined || change.modifiedCellIndex >= notebookModel.cells.length) {
					return;
				}
				const cell = notebookModel.cells[change.modifiedCellIndex];
				const editor = notebookEditor.codeEditors.find(([vm,]) => vm.handle === notebookModel.cells[change.modifiedCellIndex].handle)?.[1];
				const modifiedModel = change.modifiedModel.promiseResult.read(r)?.data;
				const originalModel = change.originalModel.promiseResult.read(r)?.data;
				if (!cell || !originalModel || !modifiedModel) {
					return;
				}
				if (cell.cellKind === CellKind.Markup && !this.markupCellListeners.has(cell.handle)) {
					const cellModel = this.notebookEditor.getViewModel()?.viewCells.find(c => c.handle === cell.handle);
					if (cellModel) {
						const listener = cellModel.onDidChangeState((e) => {
							if (e.editStateChanged) {
								setTimeout(() => this.markdownEditState.set(cellModel.handle + '-' + cellModel.getEditState(), undefined), 0);
							}
						});
						this.markupCellListeners.set(cell.handle, listener);
					}
				}
				if (!editor) {
					return;
				}
				const diff = {
					...change.diff.read(r),
					modifiedModel,
					originalModel,
					keep: change.keep,
					undo: change.undo
				} satisfies IDocumentDiff2;
				validCells.add(cell);
				const currentDiff = this.cellEditorIntegrations.get(cell);
				if (currentDiff) {
					// Do not unnecessarily trigger a change event
					if (!areDocumentDiff2Equal(currentDiff.diff.read(undefined), diff)) {
						currentDiff.diff.set(diff, undefined);
					}
				} else {
					const diff2 = observableValue(`diff${cell.handle}`, diff);
					const integration = this.instantiationService.createInstance(ChatEditingCodeEditorIntegration, _entry, editor, diff2, true);
					this.cellEditorIntegrations.set(cell, { integration, diff: diff2 });
					this._register(integration);
					this._register(editor.onDidDispose(() => {
						this.cellEditorIntegrations.get(cell)?.integration.dispose();
						this.cellEditorIntegrations.delete(cell);
					}));
					this._register(editor.onDidChangeModel(() => {
						if (editor.getModel() !== cell.textModel) {
							this.cellEditorIntegrations.get(cell)?.integration.dispose();
							this.cellEditorIntegrations.delete(cell);
						}
					}));
				}
			});

			// Dispose old integrations as the editors are no longer valid.
			this.cellEditorIntegrations.forEach((v, cell) => {
				if (!validCells.has(cell)) {
					v.integration.dispose();
					this.cellEditorIntegrations.delete(cell);
				}
			});
		}));

		const cellsAreVisible = onDidChangeVisibleRanges.map(v => v.length > 0);
		const debouncedChanges = debouncedObservable(cellChanges, 10);
		this._register(autorun(r => {
			if (this.notebookEditor.textModel !== this.notebookModel || !cellsAreVisible.read(r) || !this.notebookEditor.getViewModel()) {
				return;
			}
			// We can have inserted cells that have been accepted, in those cases we do not want any decorators on them.
			const changes = debouncedChanges.read(r).filter(c => c.type === 'insert' ? !c.diff.read(r).identical : true);
			const modifiedChanges = changes.filter(c => c.type === 'modified');

			this.createDecorators();
			// If all cells are just inserts, then no need to show any decorations.
			if (changes.every(c => c.type === 'insert')) {
				this.insertedCellDecorator?.apply([]);
				this.modifiedCellDecorator?.apply([]);
				this.deletedCellDecorator?.apply([], originalModel);
				this.overlayToolbarDecorator?.decorate([]);
			} else {
				this.insertedCellDecorator?.apply(changes);
				this.modifiedCellDecorator?.apply(modifiedChanges);
				this.deletedCellDecorator?.apply(changes, originalModel);
				this.overlayToolbarDecorator?.decorate(changes.filter(c => c.type === 'insert' || c.type === 'modified'));
			}
		}));
	}

	private getCurrentChange() {
		const currentIndex = Math.min(this._currentIndex.get(), this.changeIndexComputer.getTotalSum() - 1);
		const index = this.changeIndexComputer.getIndexOf(currentIndex);
		const change = this.sortedCellChanges[index.index];

		return change ? { change, index: index.remainder } : undefined;
	}

	private updateCurrentIndex(change: ICellDiffInfo, indexInCell: number = 0) {
		const index = this.sortedCellChanges.indexOf(change);
		const changeIndex = this.changeIndexComputer.getPrefixSum(index - 1);
		const currentIndex = Math.min(changeIndex + indexInCell, this.changeIndexComputer.getTotalSum() - 1);
		this._currentIndex.set(currentIndex, undefined);
	}

	private createDecorators() {
		const cellChanges = this.cellChanges.get();
		const accessibilitySignalService = this.accessibilitySignalService;

		this.insertedCellDecorator ??= this._register(this.instantiationService.createInstance(NotebookInsertedCellDecorator, this.notebookEditor));
		this.modifiedCellDecorator ??= this._register(this.instantiationService.createInstance(NotebookModifiedCellDecorator, this.notebookEditor));
		this.overlayToolbarDecorator ??= this._register(this.instantiationService.createInstance(OverlayToolbarDecorator, this.notebookEditor, this.notebookModel));

		if (this.deletedCellDecorator) {
			this._store.delete(this.deletedCellDecorator);
			this.deletedCellDecorator.dispose();
		}
		this.deletedCellDecorator = this._register(this.instantiationService.createInstance(NotebookDeletedCellDecorator, this.notebookEditor, {
			className: 'chat-diff-change-content-widget',
			telemetrySource: 'chatEditingNotebookHunk',
			menuId: MenuId.ChatEditingEditorHunk,
			actionViewItemProvider: (action, options) => {
				if (!action.class) {
					return new class extends ActionViewItem {
						constructor() {
							super(undefined, action, { ...options, keybindingNotRenderedWithLabel: true /* hide keybinding for actions without icon */, icon: false, label: true });
						}
					};
				}
				return undefined;
			},
			argFactory: (deletedCellIndex: number) => {
				return {
					accept() {
						const entry = cellChanges.find(c => c.type === 'delete' && c.originalCellIndex === deletedCellIndex);
						if (entry) {
							return entry.keep(entry.diff.get().changes[0]);
						}
						accessibilitySignalService.playSignal(AccessibilitySignal.editsKept, { allowManyInParallel: true });
						return Promise.resolve(true);
					},
					reject() {
						const entry = cellChanges.find(c => c.type === 'delete' && c.originalCellIndex === deletedCellIndex);
						if (entry) {
							return entry.undo(entry.diff.get().changes[0]);
						}
						accessibilitySignalService.playSignal(AccessibilitySignal.editsUndone, { allowManyInParallel: true });
						return Promise.resolve(true);
					},
				} satisfies IModifiedFileEntryChangeHunk;
			}
		}));
	}

	getCell(modifiedCellIndex: number) {
		const cell = this.notebookModel.cells[modifiedCellIndex];
		const integration = this.cellEditorIntegrations.get(cell)?.integration;
		return integration;
	}

	reveal(firstOrLast: boolean): void {
		const changes = this.sortedCellChanges.filter(c => c.type !== 'unchanged');
		if (!changes.length) {
			return;
		}
		const change = firstOrLast ? changes[0] : changes[changes.length - 1];
		this._revealFirstOrLast(change, firstOrLast);
	}

	private _revealFirstOrLast(change: ICellDiffInfo, firstOrLast: boolean = true) {
		switch (change.type) {
			case 'insert':
			case 'modified':
				{
					this.blur(this.getCurrentChange()?.change);
					const index = firstOrLast || change.type === 'insert' ? 0 : change.diff.get().changes.length - 1;
					return this._revealChange(change, index);
				}
			case 'delete':
				this.blur(this.getCurrentChange()?.change);
				// reveal the deleted cell decorator
				this.deletedCellDecorator?.reveal(change.originalCellIndex);
				this.updateCurrentIndex(change);
				return true;
			default:
				break;
		}

		return false;
	}

	private _revealChange(change: ICellDiffInfo, indexInCell: number) {
		switch (change.type) {
			case 'insert':
			case 'modified':
				{
					const textChange = change.diff.get().changes[indexInCell];
					const cellViewModel = this.getCellViewModel(change);
					if (cellViewModel) {
						this.updateCurrentIndex(change, indexInCell);
						this.revealChangeInView(cellViewModel, textChange?.modified, change)
							.catch(err => { this.logService.warn(`Error revealing change in view: ${err}`); });
						return true;
					}
					break;
				}
			case 'delete':
				this.updateCurrentIndex(change);
				// reveal the deleted cell decorator
				this.deletedCellDecorator?.reveal(change.originalCellIndex);
				return true;
			default:
				break;
		}

		return false;
	}

	private getCellViewModel(change: ICellDiffInfo) {
		if (change.type === 'delete' || change.modifiedCellIndex === undefined || change.modifiedCellIndex >= this.notebookModel.cells.length) {
			return undefined;
		}
		const cell = this.notebookModel.cells[change.modifiedCellIndex];
		const cellViewModel = this.notebookEditor.getViewModel()?.viewCells.find(c => c.handle === cell.handle);
		return cellViewModel;
	}

	private async revealChangeInView(cell: ICellViewModel, lines: LineRange | undefined, change: ICellDiffInfo): Promise<void> {
		const targetLines = lines ?? new LineRange(0, 0);
		if (change.type === 'modified' && cell.cellKind === CellKind.Markup && cell.getEditState() === CellEditState.Preview) {
			cell.updateEditState(CellEditState.Editing, 'chatEditNavigation');
		}

		const focusTarget = cell.cellKind === CellKind.Code || change.type === 'modified' ? 'editor' : 'container';
		await this.notebookEditor.focusNotebookCell(cell, focusTarget, { focusEditorLine: targetLines.startLineNumber });
		await this.notebookEditor.revealRangeInCenterAsync(cell, new Range(targetLines.startLineNumber, 0, targetLines.endLineNumberExclusive, 0));
	}

	private revertMarkupCellState() {
		for (const change of this.sortedCellChanges) {
			const cellViewModel = this.getCellViewModel(change);
			if (cellViewModel?.cellKind === CellKind.Markup && cellViewModel.getEditState() === CellEditState.Editing &&
				(cellViewModel.editStateSource === 'chatEditNavigation' || cellViewModel.editStateSource === 'chatEdit')) {
				cellViewModel.updateEditState(CellEditState.Preview, 'chatEdit');
			}
		}
	}

	private blur(change: ICellDiffInfo | undefined) {
		if (!change) {
			return;
		}
		const cellViewModel = this.getCellViewModel(change);
		if (cellViewModel?.cellKind === CellKind.Markup && cellViewModel.getEditState() === CellEditState.Editing && cellViewModel.editStateSource === 'chatEditNavigation') {
			cellViewModel.updateEditState(CellEditState.Preview, 'chatEditNavigation');
		}
	}

	next(wrap: boolean): boolean {
		const changes = this.sortedCellChanges.filter(c => c.type !== 'unchanged');
		const currentChange = this.getCurrentChange();
		if (!currentChange) {
			const firstChange = changes[0];

			if (firstChange) {
				return this._revealFirstOrLast(firstChange);
			}

			return false;
		}

		// go to next
		// first check if we are at the end of the current change
		switch (currentChange.change.type) {
			case 'modified':
				{
					const cellIntegration = this.getCell(currentChange.change.modifiedCellIndex);
					if (cellIntegration) {
						if (cellIntegration.next(false)) {
							this.updateCurrentIndex(currentChange.change, cellIntegration.currentIndex.get());
							return true;
						}
					}

					const isLastChangeInCell = currentChange.index >= lastChangeIndex(currentChange.change);
					const index = isLastChangeInCell ? 0 : currentChange.index + 1;
					const change = isLastChangeInCell ? changes[changes.indexOf(currentChange.change) + 1] : currentChange.change;

					if (change) {
						if (isLastChangeInCell) {
							this.blur(currentChange.change);
						}

						if (this._revealChange(change, index)) {
							return true;
						}
					}
				}
				break;
			case 'insert':
			case 'delete':
				{
					this.blur(currentChange.change);
					// go to next change directly
					const nextChange = changes[changes.indexOf(currentChange.change) + 1];
					if (nextChange && this._revealFirstOrLast(nextChange, true)) {
						return true;
					}
				}
				break;
			default:
				break;
		}

		if (wrap) {
			const firstChange = changes[0];
			if (firstChange) {
				return this._revealFirstOrLast(firstChange, true);
			}
		}

		return false;
	}

	previous(wrap: boolean): boolean {
		const changes = this.sortedCellChanges.filter(c => c.type !== 'unchanged');
		const currentChange = this.getCurrentChange();
		if (!currentChange) {
			const lastChange = changes[changes.length - 1];
			if (lastChange) {
				return this._revealFirstOrLast(lastChange, false);
			}

			return false;
		}

		// go to previous
		// first check if we are at the start of the current change
		switch (currentChange.change.type) {
			case 'modified':
				{
					const cellIntegration = this.getCell(currentChange.change.modifiedCellIndex);
					if (cellIntegration) {
						if (cellIntegration.previous(false)) {
							this.updateCurrentIndex(currentChange.change, cellIntegration.currentIndex.get());
							return true;
						}
					}

					const isFirstChangeInCell = currentChange.index <= 0;
					const change = isFirstChangeInCell ? changes[changes.indexOf(currentChange.change) - 1] : currentChange.change;

					if (change) {
						const index = isFirstChangeInCell ? lastChangeIndex(change) : currentChange.index - 1;
						if (isFirstChangeInCell) {
							this.blur(currentChange.change);
						}
						if (this._revealChange(change, index)) {
							return true;
						}
					}
				}
				break;
			case 'insert':
			case 'delete':
				{
					this.blur(currentChange.change);
					// go to previous change directly
					const prevChange = changes[changes.indexOf(currentChange.change) - 1];
					if (prevChange && this._revealFirstOrLast(prevChange, false)) {
						return true;
					}
				}
				break;
			default:
				break;
		}

		if (wrap) {
			const lastChange = changes[changes.length - 1];
			if (lastChange) {
				return this._revealFirstOrLast(lastChange, false);
			}
		}

		return false;
	}

	enableAccessibleDiffView(): void {
		const cell = this.notebookEditor.getActiveCell()?.model;
		if (cell) {
			const integration = this.cellEditorIntegrations.get(cell)?.integration;
			integration?.enableAccessibleDiffView();
		}
	}

	private getfocusedIntegration(): ChatEditingCodeEditorIntegration | undefined {
		const first = this.notebookEditor.getSelectionViewModels()[0];
		if (first) {
			return this.cellEditorIntegrations.get(first.model)?.integration;
		}
		return undefined;
	}

	async acceptNearestChange(hunk: IModifiedFileEntryChangeHunk | undefined): Promise<void> {
		if (hunk) {
			await hunk.accept();
		} else {
			const current = this.getCurrentChange();
			const focused = this.getfocusedIntegration();
			// delete changes can't be focused
			if (current && !focused || current?.change.type === 'delete') {
				current.change.keep(current?.change.diff.get().changes[current.index]);
			} else if (focused) {
				await focused.acceptNearestChange();
			}

			this._currentIndex.set(this._currentIndex.get() - 1, undefined);
			this.next(true);
		}
	}

	async rejectNearestChange(hunk: IModifiedFileEntryChangeHunk | undefined): Promise<void> {
		if (hunk) {
			await hunk.reject();
		} else {
			const current = this.getCurrentChange();
			const focused = this.getfocusedIntegration();
			// delete changes can't be focused
			if (current && !focused || current?.change.type === 'delete') {
				current.change.undo(current.change.diff.get().changes[current.index]);
			} else if (focused) {
				await focused.rejectNearestChange();
			}

			this._currentIndex.set(this._currentIndex.get() - 1, undefined);
			this.next(true);
		}

	}
	async toggleDiff(_change: IModifiedFileEntryChangeHunk | undefined, _show?: boolean): Promise<void> {
		const diffInput: IResourceDiffEditorInput = {
			original: { resource: this._entry.originalURI },
			modified: { resource: this._entry.modifiedURI },
			label: localize('diff.generic', '{0} (changes from chat)', basename(this._entry.modifiedURI))
		};
		await this._editorService.openEditor(diffInput);

	}
}

export class ChatEditingNotebookDiffEditorIntegration extends Disposable implements IModifiedFileEntryEditorIntegration {
	private readonly _currentIndex = observableValue(this, -1);
	readonly currentIndex: IObservable<number> = this._currentIndex;

	constructor(
		private readonly notebookDiffEditor: INotebookTextDiffEditor,
		private readonly cellChanges: IObservable<ICellDiffInfo[]>
	) {
		super();

		this._store.add(autorun(r => {
			const index = notebookDiffEditor.currentChangedIndex.read(r);
			const numberOfCellChanges = cellChanges.read(r).filter(c => !c.diff.read(r).identical);
			if (numberOfCellChanges.length && index >= 0 && index < numberOfCellChanges.length) {
				// Notebook Diff editor only supports navigating through changes to cells.
				// However in chat we take changes to lines in the cells into account.
				// So if we're on the second cell and first cell has 3 changes, then we're on the 4th change.
				const changesSoFar = countChanges(numberOfCellChanges.slice(0, index + 1));
				this._currentIndex.set(changesSoFar - 1, undefined);
			} else {
				this._currentIndex.set(-1, undefined);
			}
		}));
	}

	reveal(firstOrLast: boolean): void {
		const changes = sortCellChanges(this.cellChanges.get().filter(c => c.type !== 'unchanged'));
		if (!changes.length) {
			return undefined;
		}
		if (firstOrLast) {
			this.notebookDiffEditor.firstChange();
		} else {
			this.notebookDiffEditor.lastChange();
		}
	}

	next(_wrap: boolean): boolean {
		const changes = this.cellChanges.get().filter(c => !c.diff.get().identical).length;
		if (this.notebookDiffEditor.currentChangedIndex.get() === changes - 1) {
			return false;
		}
		this.notebookDiffEditor.nextChange();
		return true;
	}

	previous(_wrap: boolean): boolean {
		const changes = this.cellChanges.get().filter(c => !c.diff.get().identical).length;
		if (this.notebookDiffEditor.currentChangedIndex.get() === changes - 1) {
			return false;
		}
		this.notebookDiffEditor.nextChange();
		return true;
	}

	enableAccessibleDiffView(): void {
		//
	}
	async acceptNearestChange(change: IModifiedFileEntryChangeHunk): Promise<void> {
		await change.accept();
		this.next(true);
	}
	async rejectNearestChange(change: IModifiedFileEntryChangeHunk): Promise<void> {
		await change.reject();
		this.next(true);
	}
	async toggleDiff(_change: IModifiedFileEntryChangeHunk | undefined, _show?: boolean): Promise<void> {
		//
	}
}

function areDocumentDiff2Equal(diff1: IDocumentDiff2, diff2: IDocumentDiff2): boolean {
	if (diff1.changes !== diff2.changes) {
		return false;
	}
	if (diff1.identical !== diff2.identical) {
		return false;
	}
	if (diff1.moves !== diff2.moves) {
		return false;
	}
	if (diff1.originalModel !== diff2.originalModel) {
		return false;
	}
	if (diff1.modifiedModel !== diff2.modifiedModel) {
		return false;
	}
	if (diff1.keep !== diff2.keep) {
		return false;
	}
	if (diff1.undo !== diff2.undo) {
		return false;
	}
	if (diff1.quitEarly !== diff2.quitEarly) {
		return false;
	}
	return true;
}

function lastChangeIndex(change: ICellDiffInfo): number {
	if (change.type === 'modified') {
		return change.diff.get().changes.length - 1;
	}
	return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/notebook/chatEditingNotebookFileSystemProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/notebook/chatEditingNotebookFileSystemProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { Event } from '../../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../../../base/common/map.js';
import { ReadableStreamEvents } from '../../../../../../base/common/stream.js';
import { URI } from '../../../../../../base/common/uri.js';
import { FileSystemProviderCapabilities, FileType, IFileChange, IFileDeleteOptions, IFileOpenOptions, IFileOverwriteOptions, IFileReadStreamOptions, IFileService, IFileSystemProvider, IFileWriteOptions, IStat, IWatchOptions } from '../../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchContribution } from '../../../../../common/contributions.js';
import { IChatEditingService } from '../../../common/chatEditingService.js';
import { LocalChatSessionUri } from '../../../common/chatUri.js';
import { ChatEditingNotebookSnapshotScheme } from './chatEditingModifiedNotebookSnapshot.js';


export class ChatEditingNotebookFileSystemProviderContrib extends Disposable implements IWorkbenchContribution {
	static ID = 'chatEditingNotebookFileSystemProviderContribution';
	constructor(
		@IFileService private readonly fileService: IFileService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {

		super();
		const fileSystemProvider = instantiationService.createInstance(ChatEditingNotebookFileSystemProvider);
		this._register(this.fileService.registerProvider(ChatEditingNotebookSnapshotScheme, fileSystemProvider));
	}
}

type ChatEditingSnapshotNotebookContentQueryData = { sessionId: string; requestId: string | undefined; undoStop: string | undefined; viewType: string };

export class ChatEditingNotebookFileSystemProvider implements IFileSystemProvider {
	private static registeredFiles = new ResourceMap<VSBuffer>();
	public readonly capabilities: FileSystemProviderCapabilities = FileSystemProviderCapabilities.Readonly | FileSystemProviderCapabilities.FileAtomicRead | FileSystemProviderCapabilities.FileReadWrite;
	public static registerFile(resource: URI, buffer: VSBuffer): IDisposable {
		ChatEditingNotebookFileSystemProvider.registeredFiles.set(resource, buffer);
		return {
			dispose() {
				if (ChatEditingNotebookFileSystemProvider.registeredFiles.get(resource) === buffer) {
					ChatEditingNotebookFileSystemProvider.registeredFiles.delete(resource);
				}
			}
		};
	}

	constructor(@IChatEditingService private readonly _chatEditingService: IChatEditingService) { }

	readonly onDidChangeCapabilities = Event.None;
	readonly onDidChangeFile: Event<readonly IFileChange[]> = Event.None;
	watch(_resource: URI, _opts: IWatchOptions): IDisposable {
		return Disposable.None;
	}
	async stat(_resource: URI): Promise<IStat> {
		return {
			type: FileType.File,
			ctime: 0,
			mtime: 0,
			size: 0
		};
	}
	mkdir(_resource: URI): Promise<void> {
		throw new Error('Method not implemented1.');
	}
	readdir(_resource: URI): Promise<[string, FileType][]> {
		throw new Error('Method not implemented2.');
	}
	delete(_resource: URI, _opts: IFileDeleteOptions): Promise<void> {
		throw new Error('Method not implemented3.');
	}
	rename(_from: URI, _to: URI, _opts: IFileOverwriteOptions): Promise<void> {
		throw new Error('Method not implemented4.');
	}
	copy?(_from: URI, _to: URI, _opts: IFileOverwriteOptions): Promise<void> {
		throw new Error('Method not implemented5.');
	}
	async readFile(resource: URI): Promise<Uint8Array> {
		const buffer = ChatEditingNotebookFileSystemProvider.registeredFiles.get(resource);
		if (buffer) {
			return buffer.buffer;
		}
		const queryData = JSON.parse(resource.query) as ChatEditingSnapshotNotebookContentQueryData;
		if (!queryData.viewType) {
			throw new Error('File not found, viewType not found');
		}
		const session = this._chatEditingService.getEditingSession(LocalChatSessionUri.forSession(queryData.sessionId));
		if (!session || !queryData.requestId) {
			throw new Error('File not found, session not found');
		}
		const snapshotEntry = await session.getSnapshotContents(queryData.requestId, resource, queryData.undoStop || undefined);
		if (!snapshotEntry) {
			throw new Error('File not found, snapshot not found');
		}

		return snapshotEntry.buffer;
	}

	writeFile?(__resource: URI, _content: Uint8Array, _opts: IFileWriteOptions): Promise<void> {
		throw new Error('Method not implemented7.');
	}
	readFileStream?(__resource: URI, _opts: IFileReadStreamOptions, _token: CancellationToken): ReadableStreamEvents<Uint8Array> {
		throw new Error('Method not implemented8.');
	}
	open?(__resource: URI, _opts: IFileOpenOptions): Promise<number> {
		throw new Error('Method not implemented9.');
	}
	close?(_fd: number): Promise<void> {
		throw new Error('Method not implemented10.');
	}
	read?(_fd: number, _pos: number, _data: Uint8Array, _offset: number, _length: number): Promise<number> {
		throw new Error('Method not implemented11.');
	}
	write?(_fd: number, _pos: number, _data: Uint8Array, _offset: number, _length: number): Promise<number> {
		throw new Error('Method not implemented12.');
	}
	cloneFile?(_from: URI, __to: URI): Promise<void> {
		throw new Error('Method not implemented13.');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/notebook/helpers.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/notebook/helpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { NotebookTextModel } from '../../../../notebook/common/model/notebookTextModel.js';
import { CellEditType, ICell, ICellDto2, ICellEditOperation, ICellReplaceEdit, NotebookCellsChangeType, NotebookCellsModelMoveEvent, NotebookCellTextModelSplice, NotebookTextModelChangedEvent } from '../../../../notebook/common/notebookCommon.js';
import { ICellDiffInfo, sortCellChanges } from './notebookCellChanges.js';


export function adjustCellDiffForKeepingADeletedCell(originalCellIndex: number,
	cellDiffInfo: ICellDiffInfo[],
	applyEdits: typeof NotebookTextModel.prototype.applyEdits,
): ICellDiffInfo[] {
	// Delete this cell from original as well.
	const edit: ICellReplaceEdit = { cells: [], count: 1, editType: CellEditType.Replace, index: originalCellIndex, };
	applyEdits([edit], true, undefined, () => undefined, undefined, true);
	const diffs = sortCellChanges(cellDiffInfo)
		.filter(d => !(d.type === 'delete' && d.originalCellIndex === originalCellIndex))
		.map(diff => {
			if (diff.type !== 'insert' && diff.originalCellIndex > originalCellIndex) {
				return {
					...diff,
					originalCellIndex: diff.originalCellIndex - 1,
				};
			}
			return diff;
		});
	return diffs;
}

export function adjustCellDiffForRevertingADeletedCell(originalCellIndex: number,
	cellDiffInfo: ICellDiffInfo[],
	cellToInsert: ICellDto2,
	applyEdits: typeof NotebookTextModel.prototype.applyEdits,
	createModifiedCellDiffInfo: (modifiedCellIndex: number, originalCellIndex: number) => ICellDiffInfo,
): ICellDiffInfo[] {
	cellDiffInfo = sortCellChanges(cellDiffInfo);
	const indexOfEntry = cellDiffInfo.findIndex(d => d.originalCellIndex === originalCellIndex);
	if (indexOfEntry === -1) {
		// Not possible.
		return cellDiffInfo;
	}

	let modifiedCellIndex = -1;
	for (let i = 0; i < cellDiffInfo.length; i++) {
		const diff = cellDiffInfo[i];
		if (i < indexOfEntry) {
			modifiedCellIndex = Math.max(modifiedCellIndex, diff.modifiedCellIndex ?? modifiedCellIndex);
			continue;
		}
		if (i === indexOfEntry) {
			const edit: ICellReplaceEdit = { cells: [cellToInsert], count: 0, editType: CellEditType.Replace, index: modifiedCellIndex + 1, };
			applyEdits([edit], true, undefined, () => undefined, undefined, true);
			cellDiffInfo[i] = createModifiedCellDiffInfo(modifiedCellIndex + 1, originalCellIndex);
			continue;
		} else {
			// Increase the original index for all entries after this.
			if (typeof diff.modifiedCellIndex === 'number') {
				diff.modifiedCellIndex++;
				cellDiffInfo[i] = { ...diff };
			}
		}
	}

	return cellDiffInfo;
}

export function adjustCellDiffForRevertingAnInsertedCell(modifiedCellIndex: number,
	cellDiffInfo: ICellDiffInfo[],
	applyEdits: typeof NotebookTextModel.prototype.applyEdits,
): ICellDiffInfo[] {
	if (modifiedCellIndex === -1) {
		// Not possible.
		return cellDiffInfo;
	}
	cellDiffInfo = sortCellChanges(cellDiffInfo)
		.filter(d => !(d.type === 'insert' && d.modifiedCellIndex === modifiedCellIndex))
		.map(d => {
			if (d.type === 'insert' && d.modifiedCellIndex === modifiedCellIndex) {
				return d;
			}
			if (d.type !== 'delete' && d.modifiedCellIndex > modifiedCellIndex) {
				return {
					...d,
					modifiedCellIndex: d.modifiedCellIndex - 1,
				};
			}
			return d;
		});
	const edit: ICellReplaceEdit = { cells: [], count: 1, editType: CellEditType.Replace, index: modifiedCellIndex, };
	applyEdits([edit], true, undefined, () => undefined, undefined, true);
	return cellDiffInfo;
}

export function adjustCellDiffForKeepingAnInsertedCell(modifiedCellIndex: number,
	cellDiffInfo: ICellDiffInfo[],
	cellToInsert: ICellDto2,
	applyEdits: typeof NotebookTextModel.prototype.applyEdits,
	createModifiedCellDiffInfo: (modifiedCellIndex: number, originalCellIndex: number) => ICellDiffInfo,
): ICellDiffInfo[] {
	cellDiffInfo = sortCellChanges(cellDiffInfo);
	if (modifiedCellIndex === -1) {
		// Not possible.
		return cellDiffInfo;
	}
	const indexOfEntry = cellDiffInfo.findIndex(d => d.modifiedCellIndex === modifiedCellIndex);
	if (indexOfEntry === -1) {
		// Not possible.
		return cellDiffInfo;
	}
	let originalCellIndex = -1;
	for (let i = 0; i < cellDiffInfo.length; i++) {
		const diff = cellDiffInfo[i];
		if (i < indexOfEntry) {
			originalCellIndex = Math.max(originalCellIndex, diff.originalCellIndex ?? originalCellIndex);
			continue;
		}
		if (i === indexOfEntry) {
			const edit: ICellReplaceEdit = { cells: [cellToInsert], count: 0, editType: CellEditType.Replace, index: originalCellIndex + 1 };
			applyEdits([edit], true, undefined, () => undefined, undefined, true);
			cellDiffInfo[i] = createModifiedCellDiffInfo(modifiedCellIndex, originalCellIndex + 1);
			continue;
		} else {
			// Increase the original index for all entries after this.
			if (typeof diff.originalCellIndex === 'number') {
				diff.originalCellIndex++;
				cellDiffInfo[i] = { ...diff };
			}
		}
	}
	return cellDiffInfo;
}

export function adjustCellDiffAndOriginalModelBasedOnCellAddDelete(change: NotebookCellTextModelSplice<ICell>,
	cellDiffInfo: ICellDiffInfo[],
	modifiedModelCellCount: number,
	originalModelCellCount: number,
	applyEdits: typeof NotebookTextModel.prototype.applyEdits,
	createModifiedCellDiffInfo: (modifiedCellIndex: number, originalCellIndex: number) => ICellDiffInfo,
): ICellDiffInfo[] {
	cellDiffInfo = sortCellChanges(cellDiffInfo);
	const numberOfCellsInserted = change[2].length;
	const numberOfCellsDeleted = change[1];
	const cells = change[2].map(cell => {
		return {
			cellKind: cell.cellKind,
			language: cell.language,
			metadata: cell.metadata,
			outputs: cell.outputs,
			source: cell.getValue(),
			mime: undefined,
			internalMetadata: cell.internalMetadata
		} satisfies ICellDto2;
	});
	let diffEntryIndex = -1;
	let indexToInsertInOriginalModel: number | undefined = undefined;
	if (cells.length) {
		for (let i = 0; i < cellDiffInfo.length; i++) {
			const diff = cellDiffInfo[i];
			if (typeof diff.modifiedCellIndex === 'number' && diff.modifiedCellIndex === change[0]) {
				diffEntryIndex = i;

				if (typeof diff.originalCellIndex === 'number') {
					indexToInsertInOriginalModel = diff.originalCellIndex;
				}
				break;
			}
			if (typeof diff.originalCellIndex === 'number') {
				indexToInsertInOriginalModel = diff.originalCellIndex + 1;
			}
		}

		const edit: ICellEditOperation = {
			editType: CellEditType.Replace,
			cells,
			index: indexToInsertInOriginalModel ?? 0,
			count: change[1]
		};
		applyEdits([edit], true, undefined, () => undefined, undefined, true);
	}
	// If cells were deleted we handled that with this.disposeDeletedCellEntries();
	if (numberOfCellsDeleted) {
		// Adjust the indexes.
		let numberOfOriginalCellsRemovedSoFar = 0;
		let numberOfModifiedCellsRemovedSoFar = 0;
		const modifiedIndexesToRemove = new Set<number>();
		for (let i = 0; i < numberOfCellsDeleted; i++) {
			modifiedIndexesToRemove.add(change[0] + i);
		}
		const itemsToRemove = new Set<ICellDiffInfo>();
		for (let i = 0; i < cellDiffInfo.length; i++) {
			const diff = cellDiffInfo[i];
			if (i < diffEntryIndex) {
				continue;
			}

			let changed = false;
			if (typeof diff.modifiedCellIndex === 'number' && modifiedIndexesToRemove.has(diff.modifiedCellIndex)) {
				// This will be removed.
				numberOfModifiedCellsRemovedSoFar++;
				if (typeof diff.originalCellIndex === 'number') {
					numberOfOriginalCellsRemovedSoFar++;
				}
				itemsToRemove.add(diff);
				continue;
			}
			if (typeof diff.modifiedCellIndex === 'number' && numberOfModifiedCellsRemovedSoFar) {
				diff.modifiedCellIndex -= numberOfModifiedCellsRemovedSoFar;
				changed = true;
			}
			if (typeof diff.originalCellIndex === 'number' && numberOfOriginalCellsRemovedSoFar) {
				diff.originalCellIndex -= numberOfOriginalCellsRemovedSoFar;
				changed = true;
			}
			if (changed) {
				cellDiffInfo[i] = { ...diff };
			}
		}
		if (itemsToRemove.size) {
			Array.from(itemsToRemove)
				.filter(diff => typeof diff.originalCellIndex === 'number')
				.forEach(diff => {
					const edit: ICellEditOperation = {
						editType: CellEditType.Replace,
						cells: [],
						index: diff.originalCellIndex,
						count: 1
					};
					applyEdits([edit], true, undefined, () => undefined, undefined, true);
				});
		}
		cellDiffInfo = cellDiffInfo.filter(d => !itemsToRemove.has(d));
	}

	if (numberOfCellsInserted && diffEntryIndex >= 0) {
		for (let i = 0; i < cellDiffInfo.length; i++) {
			const diff = cellDiffInfo[i];
			if (i < diffEntryIndex) {
				continue;
			}
			let changed = false;
			if (typeof diff.modifiedCellIndex === 'number') {
				diff.modifiedCellIndex += numberOfCellsInserted;
				changed = true;
			}
			if (typeof diff.originalCellIndex === 'number') {
				diff.originalCellIndex += numberOfCellsInserted;
				changed = true;
			}
			if (changed) {
				cellDiffInfo[i] = { ...diff };
			}
		}
	}

	// For inserted cells, we need to ensure that we create a corresponding CellEntry.
	// So that any edits to the inserted cell is handled and mirrored over to the corresponding cell in original model.
	cells.forEach((_, i) => {
		const originalCellIndex = i + (indexToInsertInOriginalModel ?? 0);
		const modifiedCellIndex = change[0] + i;
		const unchangedCell = createModifiedCellDiffInfo(modifiedCellIndex, originalCellIndex);
		cellDiffInfo.splice((diffEntryIndex === -1 ? cellDiffInfo.length : diffEntryIndex) + i, 0, unchangedCell);
	});
	return cellDiffInfo;
}

/**
 * Given the movements of cells in modified notebook, adjust the ICellDiffInfo[] array
 * and generate edits for the old notebook (if required).
 * TODO@DonJayamanne Handle bulk moves (movements of more than 1 cell).
 */
export function adjustCellDiffAndOriginalModelBasedOnCellMovements(event: NotebookCellsModelMoveEvent<ICell>, cellDiffInfo: ICellDiffInfo[]): [ICellDiffInfo[], ICellEditOperation[]] | undefined {
	const minimumIndex = Math.min(event.index, event.newIdx);
	const maximumIndex = Math.max(event.index, event.newIdx);
	const cellDiffs = cellDiffInfo.slice();
	const indexOfEntry = cellDiffs.findIndex(d => d.modifiedCellIndex === event.index);
	const indexOfEntryToPlaceBelow = cellDiffs.findIndex(d => d.modifiedCellIndex === event.newIdx);
	if (indexOfEntry === -1 || indexOfEntryToPlaceBelow === -1) {
		return undefined;
	}
	// Create a new object so that the observable value is triggered.
	// Besides we'll be updating the values of this object in place.
	const entryToBeMoved = { ...cellDiffs[indexOfEntry] };
	const moveDirection = event.newIdx > event.index ? 'down' : 'up';


	const startIndex = cellDiffs.findIndex(d => d.modifiedCellIndex === minimumIndex);
	const endIndex = cellDiffs.findIndex(d => d.modifiedCellIndex === maximumIndex);
	const movingExistingCell = typeof entryToBeMoved.originalCellIndex === 'number';
	let originalCellsWereEffected = false;
	for (let i = 0; i < cellDiffs.length; i++) {
		const diff = cellDiffs[i];
		let changed = false;
		if (moveDirection === 'down') {
			if (i > startIndex && i <= endIndex) {
				if (typeof diff.modifiedCellIndex === 'number') {
					changed = true;
					diff.modifiedCellIndex = diff.modifiedCellIndex - 1;
				}
				if (typeof diff.originalCellIndex === 'number' && movingExistingCell) {
					diff.originalCellIndex = diff.originalCellIndex - 1;
					originalCellsWereEffected = true;
					changed = true;
				}
			}
		} else {
			if (i >= startIndex && i < endIndex) {
				if (typeof diff.modifiedCellIndex === 'number') {
					changed = true;
					diff.modifiedCellIndex = diff.modifiedCellIndex + 1;
				}
				if (typeof diff.originalCellIndex === 'number' && movingExistingCell) {
					diff.originalCellIndex = diff.originalCellIndex + 1;
					originalCellsWereEffected = true;
					changed = true;
				}
			}
		}
		// Create a new object so that the observable value is triggered.
		// Do only if there's a change.
		if (changed) {
			cellDiffs[i] = { ...diff };
		}
	}
	entryToBeMoved.modifiedCellIndex = event.newIdx;
	const originalCellIndex = entryToBeMoved.originalCellIndex;
	if (moveDirection === 'down') {
		cellDiffs.splice(endIndex + 1, 0, entryToBeMoved);
		cellDiffs.splice(startIndex, 1);
		// If we're moving a new cell up/down, then we need just adjust just the modified indexes of the cells in between.
		// If we're moving an existing up/down, then we need to adjust the original indexes as well.
		if (typeof entryToBeMoved.originalCellIndex === 'number') {
			entryToBeMoved.originalCellIndex = cellDiffs.slice(0, endIndex).reduce((lastOriginalIndex, diff) => typeof diff.originalCellIndex === 'number' ? Math.max(lastOriginalIndex, diff.originalCellIndex) : lastOriginalIndex, -1) + 1;
		}
	} else {
		cellDiffs.splice(endIndex, 1);
		cellDiffs.splice(startIndex, 0, entryToBeMoved);
		// If we're moving a new cell up/down, then we need just adjust just the modified indexes of the cells in between.
		// If we're moving an existing up/down, then we need to adjust the original indexes as well.
		if (typeof entryToBeMoved.originalCellIndex === 'number') {
			entryToBeMoved.originalCellIndex = cellDiffs.slice(0, startIndex).reduce((lastOriginalIndex, diff) => typeof diff.originalCellIndex === 'number' ? Math.max(lastOriginalIndex, diff.originalCellIndex) : lastOriginalIndex, -1) + 1;
		}
	}

	// If this is a new cell that we're moving, and there are no existing cells in between, then we can just move the new cell.
	// I.e. no need to update the original notebook model.
	if (typeof entryToBeMoved.originalCellIndex === 'number' && originalCellsWereEffected && typeof originalCellIndex === 'number' && entryToBeMoved.originalCellIndex !== originalCellIndex) {
		const edit: ICellEditOperation = {
			editType: CellEditType.Move,
			index: originalCellIndex,
			length: event.length,
			newIdx: entryToBeMoved.originalCellIndex
		};

		return [cellDiffs, [edit]];
	}

	return [cellDiffs, []];
}

export function getCorrespondingOriginalCellIndex(modifiedCellIndex: number, cellDiffInfo: ICellDiffInfo[]): number | undefined {
	const entry = cellDiffInfo.find(d => d.modifiedCellIndex === modifiedCellIndex);
	return entry?.originalCellIndex;
}

/**
 *
 * This isn't great, but necessary.
 * ipynb extension updates metadata when new cells are inserted (to ensure the metadata is correct)
 * Details of why thats required is in ipynb extension, but its necessary.
 * However as a result of this, those edits appear here and are assumed to be user edits.
 * As a result `_allEditsAreFromUs` is set to false.
 */
export function isTransientIPyNbExtensionEvent(notebookKind: string, e: NotebookTextModelChangedEvent) {
	if (notebookKind !== 'jupyter-notebook') {
		return false;
	}
	if (e.rawEvents.every(event => {
		if (event.kind !== NotebookCellsChangeType.ChangeCellMetadata) {
			return false;
		}
		if (JSON.stringify(event.metadata || {}) === JSON.stringify({ execution_count: null, metadata: {} })) {
			return true;
		}
		return true;

	})) {
		return true;
	}

	return false;
}

export function calculateNotebookRewriteRatio(cellsDiff: ICellDiffInfo[], originalModel: NotebookTextModel, modifiedModel: NotebookTextModel): number {
	const totalNumberOfUpdatedLines = cellsDiff.reduce((totalUpdatedLines, value) => {
		const getUpadtedLineCount = () => {
			if (value.type === 'unchanged') {
				return 0;
			}
			if (value.type === 'delete') {
				return originalModel.cells[value.originalCellIndex].textModel?.getLineCount() ?? 0;
			}
			if (value.type === 'insert') {
				return modifiedModel.cells[value.modifiedCellIndex].textModel?.getLineCount() ?? 0;
			}
			return value.diff.get().changes.reduce((maxLineNumber, change) => {
				return Math.max(maxLineNumber, change.modified.endLineNumberExclusive);
			}, 0);
		};

		return totalUpdatedLines + getUpadtedLineCount();
	}, 0);

	const totalNumberOfLines = modifiedModel.cells.reduce((totalLines, cell) => totalLines + (cell.textModel?.getLineCount() ?? 0), 0);
	return totalNumberOfLines === 0 ? 0 : Math.min(1, totalNumberOfUpdatedLines / totalNumberOfLines);

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/notebook/notebookCellChanges.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/notebook/notebookCellChanges.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ISettableObservable, ObservablePromise } from '../../../../../../base/common/observable.js';
import { IDocumentDiff } from '../../../../../../editor/common/diff/documentDiffProvider.js';
import { DetailedLineRangeMapping } from '../../../../../../editor/common/diff/rangeMapping.js';
import { ITextModel } from '../../../../../../editor/common/model.js';


/**
 * This structure is used to represent the state of a Notebook document compared to the original.
 * Its similar to the IDocumentDiff object, that tells us what cells are unmodified, modified, inserted or deleted.
 *
 * All entries will contain a IDocumentDiff
 * Even when there are no changes, diff will contain the number of lines in the document.
 * This way we can always calculate the total number of lines in the document.
 */
export type ICellDiffInfo = |
	{
		originalCellIndex: number;
		modifiedCellIndex: number;
		type: 'unchanged';
	} & IDocumentDiffWithModelsAndActions |
	{
		originalCellIndex: number;
		modifiedCellIndex: number;
		type: 'modified';
	} & IDocumentDiffWithModelsAndActions |
	{
		modifiedCellIndex: undefined;
		originalCellIndex: number;
		type: 'delete';
	} & IDocumentDiffWithModelsAndActions |
	{
		modifiedCellIndex: number;
		originalCellIndex: undefined;
		type: 'insert';
	} & IDocumentDiffWithModelsAndActions;



interface IDocumentDiffWithModelsAndActions {
	/**
	 * The changes between the original and modified document.
	 */
	diff: ISettableObservable<IDocumentDiff>;
	/**
	 * The original model.
	 * Cell text models load asynchronously, so this is an observable promise.
	 */
	originalModel: ObservablePromise<ITextModel>;
	/**
	 * The modified model.
	 * Cell text models load asynchronously, so this is an observable promise.
	 */
	modifiedModel: ObservablePromise<ITextModel>;
	keep(changes: DetailedLineRangeMapping): Promise<boolean>;
	undo(changes: DetailedLineRangeMapping): Promise<boolean>;
}


export function countChanges(changes: ICellDiffInfo[]): number {
	return changes.reduce((count, change) => {
		const diff = change.diff.get();
		// When we accept some of the cell insert/delete the items might still be in the list.
		if (diff.identical) {
			return count;
		}
		switch (change.type) {
			case 'delete':
				return count + 1; // We want to see 1 deleted entry in the pill for navigation
			case 'insert':
				return count + 1; // We want to see 1 new entry in the pill for navigation
			case 'modified':
				return count + diff.changes.length;
			default:
				return count;
		}
	}, 0);

}

export function sortCellChanges(changes: ICellDiffInfo[]): ICellDiffInfo[] {
	const indexes = new Map<ICellDiffInfo, number>();
	changes.forEach((c, i) => indexes.set(c, i));
	return [...changes].sort((a, b) => {
		// For unchanged and modified, use modifiedCellIndex
		if ((a.type === 'unchanged' || a.type === 'modified') &&
			(b.type === 'unchanged' || b.type === 'modified')) {
			return a.modifiedCellIndex - b.modifiedCellIndex;
		}

		// For delete entries, use originalCellIndex
		if (a.type === 'delete' && b.type === 'delete') {
			return a.originalCellIndex - b.originalCellIndex;
		}

		// For insert entries, use modifiedCellIndex
		if (a.type === 'insert' && b.type === 'insert') {
			return a.modifiedCellIndex - b.modifiedCellIndex;
		}

		if (a.type === 'delete' && b.type === 'insert') {
			// If the deleted cell comes before the inserted cell, we want the delete to come first
			// As this means the cell was deleted before it was inserted
			// We would like to see the deleted cell first in the list
			// Else in the UI it would look weird to see an inserted cell before a deleted cell,
			// When the users operation was to first delete the cell and then insert a new one
			// I.e. this is merely just a simple way to ensure we have a stable sort.
			return indexes.get(a)! - indexes.get(b)!;
		}
		if (a.type === 'insert' && b.type === 'delete') {
			// If the deleted cell comes before the inserted cell, we want the delete to come first
			// As this means the cell was deleted before it was inserted
			// We would like to see the deleted cell first in the list
			// Else in the UI it would look weird to see an inserted cell before a deleted cell,
			// When the users operation was to first delete the cell and then insert a new one
			// I.e. this is merely just a simple way to ensure we have a stable sort.
			return indexes.get(a)! - indexes.get(b)!;
		}

		if ((a.type === 'delete' && b.type !== 'insert') || (a.type !== 'insert' && b.type === 'delete')) {
			return a.originalCellIndex - b.originalCellIndex;
		}

		// Mixed types: compare based on available indices
		const aIndex = a.type === 'delete' ? a.originalCellIndex :
			(a.type === 'insert' ? a.modifiedCellIndex : a.modifiedCellIndex);
		const bIndex = b.type === 'delete' ? b.originalCellIndex :
			(b.type === 'insert' ? b.modifiedCellIndex : b.modifiedCellIndex);

		return aIndex - bIndex;
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/notebook/overlayToolbarDecorator.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/notebook/overlayToolbarDecorator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ActionViewItem } from '../../../../../../base/browser/ui/actionbar/actionViewItems.js';
import { Disposable, DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { MenuWorkbenchToolBar, HiddenItemStrategy } from '../../../../../../platform/actions/browser/toolbar.js';
import { MenuId } from '../../../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../../../platform/instantiation/common/serviceCollection.js';
import { CellEditState, INotebookEditor } from '../../../../notebook/browser/notebookBrowser.js';
import { NotebookTextModel } from '../../../../notebook/common/model/notebookTextModel.js';
import { CellKind } from '../../../../notebook/common/notebookCommon.js';
import { IModifiedFileEntryChangeHunk } from '../../../common/chatEditingService.js';
import { ICellDiffInfo } from './notebookCellChanges.js';


export class OverlayToolbarDecorator extends Disposable {

	private _timeout: Timeout | undefined = undefined;
	private readonly overlayDisposables = this._register(new DisposableStore());

	constructor(
		private readonly notebookEditor: INotebookEditor,
		private readonly notebookModel: NotebookTextModel,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IAccessibilitySignalService private readonly accessibilitySignalService: IAccessibilitySignalService,
	) {
		super();
	}

	decorate(changes: ICellDiffInfo[]) {
		if (this._timeout !== undefined) {
			clearTimeout(this._timeout);
		}
		this._timeout = setTimeout(() => {
			this._timeout = undefined;
			this.createMarkdownPreviewToolbars(changes);
		}, 100);
	}

	private createMarkdownPreviewToolbars(changes: ICellDiffInfo[]) {
		this.overlayDisposables.clear();

		const accessibilitySignalService = this.accessibilitySignalService;
		const editor = this.notebookEditor;
		for (const change of changes) {
			const cellViewModel = this.getCellViewModel(change);

			if (!cellViewModel || cellViewModel.cellKind !== CellKind.Markup) {
				continue;
			}
			const toolbarContainer = document.createElement('div');

			let overlayId: string | undefined = undefined;
			editor.changeCellOverlays((accessor) => {
				toolbarContainer.style.right = '44px';
				overlayId = accessor.addOverlay({
					cell: cellViewModel,
					domNode: toolbarContainer,
				});
			});

			const removeOverlay = () => {
				editor.changeCellOverlays(accessor => {
					if (overlayId) {
						accessor.removeOverlay(overlayId);
					}
				});
			};

			this.overlayDisposables.add({ dispose: removeOverlay });

			const toolbar = document.createElement('div');
			toolbarContainer.appendChild(toolbar);
			toolbar.className = 'chat-diff-change-content-widget';
			toolbar.classList.add('hover'); // Show by default
			toolbar.style.position = 'relative';
			toolbar.style.top = '18px';
			toolbar.style.zIndex = '10';
			toolbar.style.display = cellViewModel.getEditState() === CellEditState.Editing ? 'none' : 'block';

			this.overlayDisposables.add(cellViewModel.onDidChangeState((e) => {
				if (e.editStateChanged) {
					if (cellViewModel.getEditState() === CellEditState.Editing) {
						toolbar.style.display = 'none';
					} else {
						toolbar.style.display = 'block';
					}
				}
			}));

			const scopedInstaService = this._register(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, this.notebookEditor.scopedContextKeyService])));
			const toolbarWidget = scopedInstaService.createInstance(MenuWorkbenchToolBar, toolbar, MenuId.ChatEditingEditorHunk, {
				telemetrySource: 'chatEditingNotebookHunk',
				hiddenItemStrategy: HiddenItemStrategy.NoHide,
				toolbarOptions: { primaryGroup: () => true },
				menuOptions: {
					renderShortTitle: true,
					arg: {
						async accept() {
							accessibilitySignalService.playSignal(AccessibilitySignal.editsKept, { allowManyInParallel: true });
							removeOverlay();
							toolbarWidget.dispose();
							for (const singleChange of change.diff.get().changes) {
								await change.keep(singleChange);
							}
							return true;
						},
						async reject() {
							accessibilitySignalService.playSignal(AccessibilitySignal.editsUndone, { allowManyInParallel: true });
							removeOverlay();
							toolbarWidget.dispose();
							for (const singleChange of change.diff.get().changes) {
								await change.undo(singleChange);
							}
							return true;
						}
					} satisfies IModifiedFileEntryChangeHunk,
				},
				actionViewItemProvider: (action, options) => {
					if (!action.class) {
						return new class extends ActionViewItem {
							constructor() {
								super(undefined, action, { ...options, keybindingNotRenderedWithLabel: true /* hide keybinding for actions without icon */, icon: false, label: true });
							}
						};
					}
					return undefined;
				}
			});

			this.overlayDisposables.add(toolbarWidget);
		}
	}

	private getCellViewModel(change: ICellDiffInfo) {
		if (change.type === 'delete' || change.modifiedCellIndex === undefined) {
			return undefined;
		}
		const cell = this.notebookModel.cells[change.modifiedCellIndex];
		const cellViewModel = this.notebookEditor.getViewModel()?.viewCells.find(c => c.handle === cell.handle);
		return cellViewModel;
	}

	override dispose(): void {
		super.dispose();
		if (this._timeout !== undefined) {
			clearTimeout(this._timeout);
		}
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatManagement/chatManagement.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatManagement/chatManagement.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode } from '../../../../../base/common/keyCodes.js';
import { isObject, isString } from '../../../../../base/common/types.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { SyncDescriptor } from '../../../../../platform/instantiation/common/descriptors.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { IEditorPaneRegistry, EditorPaneDescriptor } from '../../../../browser/editor.js';
import { EditorExtensions, IEditorFactoryRegistry, IEditorSerializer } from '../../../../common/editor.js';
import { EditorInput } from '../../../../common/editor/editorInput.js';
import { IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { CONTEXT_MODELS_EDITOR, CONTEXT_MODELS_SEARCH_FOCUS, MANAGE_CHAT_COMMAND_ID } from '../../common/constants.js';
import { CHAT_CATEGORY } from '../actions/chatActions.js';
import { ChatManagementEditor, ModelsManagementEditor } from './chatManagementEditor.js';
import { ChatManagementEditorInput, ModelsManagementEditorInput } from './chatManagementEditorInput.js';

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		ChatManagementEditor,
		ChatManagementEditor.ID,
		localize('chatManagementEditor', "Chat Management Editor")
	),
	[
		new SyncDescriptor(ChatManagementEditorInput)
	]
);

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		ModelsManagementEditor,
		ModelsManagementEditor.ID,
		localize('modelsManagementEditor', "Models Management Editor")
	),
	[
		new SyncDescriptor(ModelsManagementEditorInput)
	]
);

class ChatManagementEditorInputSerializer implements IEditorSerializer {

	canSerialize(editorInput: EditorInput): boolean {
		return true;
	}

	serialize(input: ChatManagementEditorInput): string {
		return '';
	}

	deserialize(instantiationService: IInstantiationService): ChatManagementEditorInput {
		return instantiationService.createInstance(ChatManagementEditorInput);
	}
}

class ModelsManagementEditorInputSerializer implements IEditorSerializer {

	canSerialize(editorInput: EditorInput): boolean {
		return true;
	}

	serialize(input: ModelsManagementEditorInput): string {
		return '';
	}

	deserialize(instantiationService: IInstantiationService): ModelsManagementEditorInput {
		return instantiationService.createInstance(ModelsManagementEditorInput);
	}
}

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(ChatManagementEditorInput.ID, ChatManagementEditorInputSerializer);
Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(ModelsManagementEditorInput.ID, ModelsManagementEditorInputSerializer);

interface IOpenManageCopilotEditorActionOptions {
	query?: string;
	section?: string;
}

function sanitizeString(arg: unknown): string | undefined {
	return isString(arg) ? arg : undefined;
}

function sanitizeOpenManageCopilotEditorArgs(input: unknown): IOpenManageCopilotEditorActionOptions {
	if (!isObject(input)) {
		input = {};
	}

	const args = <IOpenManageCopilotEditorActionOptions>input;

	return {
		query: sanitizeString(args?.query),
		section: sanitizeString(args?.section)
	};
}

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: MANAGE_CHAT_COMMAND_ID,
			title: localize2('openAiManagement', "Manage Language Models"),
			category: CHAT_CATEGORY,
			precondition: ContextKeyExpr.and(ChatContextKeys.enabled, ContextKeyExpr.or(
				ChatContextKeys.Entitlement.planFree,
				ChatContextKeys.Entitlement.planPro,
				ChatContextKeys.Entitlement.planProPlus,
				ChatContextKeys.Entitlement.internal
			)),
			f1: true,
		});
	}
	async run(accessor: ServicesAccessor, args: string | IOpenManageCopilotEditorActionOptions) {
		const editorGroupsService = accessor.get(IEditorGroupsService);
		args = sanitizeOpenManageCopilotEditorArgs(args);
		return editorGroupsService.activeGroup.openEditor(new ModelsManagementEditorInput(), { pinned: true });
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'chat.models.action.clearSearchResults',
			precondition: CONTEXT_MODELS_EDITOR,
			keybinding: {
				primary: KeyCode.Escape,
				weight: KeybindingWeight.EditorContrib,
				when: CONTEXT_MODELS_SEARCH_FOCUS
			},
			title: localize2('models.clearResults', "Clear Models Search Results")
		});
	}

	run(accessor: ServicesAccessor) {
		const activeEditorPane = accessor.get(IEditorService).activeEditorPane;
		if (activeEditorPane instanceof ModelsManagementEditor) {
			activeEditorPane.clearSearch();
		}
		return null;
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatManagement/chatManagementEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatManagement/chatManagementEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/chatManagementEditor.css';
import * as DOM from '../../../../../base/browser/dom.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { IEditorOptions } from '../../../../../platform/editor/common/editor.js';
import { EditorPane } from '../../../../browser/parts/editor/editorPane.js';
import { IEditorOpenContext } from '../../../../common/editor.js';
import { IEditorGroup } from '../../../../services/editor/common/editorGroupsService.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { ChatManagementEditorInput, CHAT_MANAGEMENT_SECTION_USAGE, CHAT_MANAGEMENT_SECTION_MODELS, ModelsManagementEditorInput } from './chatManagementEditorInput.js';
import { ChatModelsWidget } from './chatModelsWidget.js';
import { Button } from '../../../../../base/browser/ui/button/button.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { localize } from '../../../../../nls.js';
import { defaultButtonStyles } from '../../../../../platform/theme/browser/defaultStyles.js';
import { IChatEntitlementService, ChatEntitlement } from '../../../../services/chat/common/chatEntitlementService.js';
import { ChatUsageWidget } from './chatUsageWidget.js';
import { Orientation, Sizing, SplitView } from '../../../../../base/browser/ui/splitview/splitview.js';
import { IListVirtualDelegate } from '../../../../../base/browser/ui/list/list.js';
import { WorkbenchList } from '../../../../../platform/list/browser/listService.js';
import { Event } from '../../../../../base/common/event.js';
import { Dimension } from '../../../../../base/browser/dom.js';
import { registerColor } from '../../../../../platform/theme/common/colorRegistry.js';
import { PANEL_BORDER } from '../../../../common/theme.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { CONTEXT_MODELS_EDITOR } from '../../common/constants.js';

const $ = DOM.$;

export class ModelsManagementEditor extends EditorPane {

	static readonly ID: string = 'workbench.editor.modelsManagement';

	private readonly editorDisposables = this._register(new DisposableStore());
	private dimension: Dimension | undefined;
	private modelsWidget: ChatModelsWidget | undefined;
	private bodyContainer: HTMLElement | undefined;

	private readonly inModelsEditorContextKey: IContextKey<boolean>;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		super(ModelsManagementEditor.ID, group, telemetryService, themeService, storageService);
		this.inModelsEditorContextKey = CONTEXT_MODELS_EDITOR.bindTo(contextKeyService);
	}

	protected override createEditor(parent: HTMLElement): void {
		this.editorDisposables.clear();
		this.bodyContainer = DOM.append(parent, $('.ai-models-management-editor'));
		this.modelsWidget = this.editorDisposables.add(this.instantiationService.createInstance(ChatModelsWidget));
		this.bodyContainer.appendChild(this.modelsWidget.element);
	}

	override async setInput(input: ModelsManagementEditorInput, options: IEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		this.inModelsEditorContextKey.set(true);
		await super.setInput(input, options, context, token);
		if (this.dimension) {
			this.layout(this.dimension);
		}
		this.modelsWidget?.render();
	}

	override layout(dimension: Dimension): void {
		this.dimension = dimension;
		if (this.bodyContainer) {
			this.modelsWidget?.layout(dimension.height - 15, this.bodyContainer!.clientWidth - 24);
		}
	}

	override focus(): void {
		super.focus();
		this.modelsWidget?.focusSearch();
	}

	override clearInput(): void {
		this.inModelsEditorContextKey.set(false);
		super.clearInput();
	}

	clearSearch(): void {
		this.modelsWidget?.clearSearch();
	}
}

export const chatManagementSashBorder = registerColor('chatManagement.sashBorder', PANEL_BORDER, localize('chatManagementSashBorder', "The color of the Chat Management editor splitview sash border."));

function isNewUser(chatEntitlementService: IChatEntitlementService): boolean {
	return !chatEntitlementService.sentiment.installed ||
		chatEntitlementService.entitlement === ChatEntitlement.Available;
}

interface SectionItem {
	id: string;
	label: string;
}

export class ChatManagementEditor extends EditorPane {

	static readonly ID: string = 'workbench.editor.chatManagement';

	private container: HTMLElement | undefined;
	private splitView: SplitView<number> | undefined;
	private sectionsList: WorkbenchList<SectionItem> | undefined;
	private headerContainer!: HTMLElement;
	private contentsContainer!: HTMLElement;

	private planBadge!: HTMLElement;
	private actionButton!: Button;

	private chatUsageWidget!: ChatUsageWidget;
	private modelsWidget!: ChatModelsWidget;

	private dimension: Dimension | undefined;
	private selectedSection: string = CHAT_MANAGEMENT_SECTION_USAGE;
	private sections: SectionItem[] = [];

	private readonly commandService: ICommandService;
	private readonly chatEntitlementService: IChatEntitlementService;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ICommandService commandService: ICommandService,
		@IChatEntitlementService chatEntitlementService: IChatEntitlementService
	) {
		super(ChatManagementEditor.ID, group, telemetryService, themeService, storageService);
		this.commandService = commandService;
		this.chatEntitlementService = chatEntitlementService;
	}

	protected override createEditor(parent: HTMLElement): void {
		this.container = DOM.append(parent, $('.ai-management-editor'));

		// Header spans across entire width
		this.renderHeader(this.container);

		// Create split view container
		const splitViewContainer = DOM.append(this.container, $('.split-view-container'));

		const sidebarView = DOM.append(splitViewContainer, $('.sidebar-view'));
		const sidebarContainer = DOM.append(sidebarView, $('.sidebar-container'));

		const contentsView = DOM.append(splitViewContainer, $('.contents-view'));
		this.contentsContainer = DOM.append(contentsView, $('.contents-container'));

		this.splitView = new SplitView(splitViewContainer, {
			orientation: Orientation.HORIZONTAL,
			proportionalLayout: true
		});

		this.renderSidebar(sidebarContainer);
		this.renderContents(this.contentsContainer);

		this.splitView.addView({
			onDidChange: Event.None,
			element: sidebarView,
			minimumSize: 150,
			maximumSize: 350,
			layout: (width, _, height) => {
				sidebarContainer.style.width = `${width}px`;
				if (this.sectionsList && height !== undefined) {
					this.sectionsList.layout(height, width);
				}
			}
		}, 200, undefined, true);

		this.splitView.addView({
			onDidChange: Event.None,
			element: contentsView,
			minimumSize: 550,
			maximumSize: Number.POSITIVE_INFINITY,
			layout: (width, _, height) => {
				contentsView.style.width = `${width}px`;
				if (height !== undefined) {
					this.layoutContents(width, height);
				}
			}
		}, Sizing.Distribute, undefined, true);

		this.updateStyles();

		// Update header data when quotas or entitlements change
		this.updateHeaderData();
		this._register(this.chatEntitlementService.onDidChangeQuotaRemaining(() => this.updateHeaderData()));
		this._register(this.chatEntitlementService.onDidChangeEntitlement(() => this.updateHeaderData()));
	}

	override updateStyles(): void {
		const borderColor = this.theme.getColor(chatManagementSashBorder)!;
		this.splitView?.style({ separatorBorder: borderColor });
	}

	private renderSidebar(parent: HTMLElement): void {
		// Define sections
		this.sections = [
			{ id: CHAT_MANAGEMENT_SECTION_USAGE, label: localize('plan.usage', 'Usage') },
			{ id: CHAT_MANAGEMENT_SECTION_MODELS, label: localize('plan.models', 'Models') }
		];

		const delegate = new SectionItemDelegate();
		const renderer = new SectionItemRenderer();

		this.sectionsList = this._register(this.instantiationService.createInstance(
			WorkbenchList<SectionItem>,
			'ChatManagementSections',
			parent,
			delegate,
			[renderer],
			{
				multipleSelectionSupport: false,
				setRowLineHeight: false,
				horizontalScrolling: false,
				accessibilityProvider: {
					getAriaLabel(element: SectionItem) {
						return element.label;
					},
					getWidgetAriaLabel() {
						return localize('sectionsListAriaLabel', "Sections");
					}
				},
				openOnSingleClick: true,
				identityProvider: {
					getId(element: SectionItem) {
						return element.id;
					}
				}
			}
		));

		this.sectionsList.splice(0, this.sectionsList.length, this.sections);
		this.sectionsList.setSelection([0]);

		this._register(this.sectionsList.onDidChangeSelection(e => {
			if (e.elements.length > 0) {
				this.selectedSection = e.elements[0].id;
				this.renderSelectedSection();
			}
		}));
	}

	private renderHeader(parent: HTMLElement): void {
		this.headerContainer = DOM.append(parent, $('.ai-management-header'));
		const headerTitleContainer = DOM.append(this.headerContainer, $('.header-title-container'));
		const headerTitleWrapper = DOM.append(headerTitleContainer, $('.header-title-wrapper'));

		// Copilot label
		const tile = DOM.append(headerTitleWrapper, $('.ai-management-editor-title'));
		tile.textContent = localize('plan.copilot', 'Copilot');

		// Plan badge
		this.planBadge = DOM.append(headerTitleWrapper, $('.plan-badge'));

		// Action button container in title
		const titleButtonContainer = DOM.append(headerTitleContainer, $('.header-upgrade-button-container'));
		this.actionButton = this._register(new Button(titleButtonContainer, { ...defaultButtonStyles }));
		this.actionButton.element.classList.add('header-upgrade-button');
		this.actionButton.element.style.display = 'none';
	}

	private renderContents(parent: HTMLElement): void {
		// Body container for widgets
		const bodyContainer = DOM.append(parent, $('.ai-management-body'));

		// Create widgets
		this.chatUsageWidget = this._register(this.instantiationService.createInstance(ChatUsageWidget));
		this.modelsWidget = this._register(this.instantiationService.createInstance(ChatModelsWidget));

		// Append widgets to body
		bodyContainer.appendChild(this.chatUsageWidget.element);
		bodyContainer.appendChild(this.modelsWidget.element);

		// Initially show only the selected section
		this.renderSelectedSection();
	}

	private renderSelectedSection(): void {
		// Hide all widgets
		this.chatUsageWidget.element.style.display = 'none';
		this.modelsWidget.element.style.display = 'none';

		// Show selected widget
		if (this.selectedSection === CHAT_MANAGEMENT_SECTION_USAGE) {
			this.chatUsageWidget.element.style.display = '';
		} else if (this.selectedSection === CHAT_MANAGEMENT_SECTION_MODELS) {
			this.modelsWidget.element.style.display = '';
		}

		// Trigger layout
		if (this.dimension) {
			this.layout(this.dimension);
		}
	}

	private layoutContents(width: number, height: number): void {
		if (!this.contentsContainer) {
			return;
		}

		if (this.selectedSection === CHAT_MANAGEMENT_SECTION_MODELS) {
			this.modelsWidget.layout(height - 30, width - 30);
		}
	}

	selectSection(sectionId: string): void {
		const index = this.sections.findIndex(s => s.id === sectionId);
		if (index >= 0) {
			this.sectionsList?.setFocus([index]);
			this.sectionsList?.setSelection([index]);
		}
	}

	private updateHeaderData(): void {
		const newUser = isNewUser(this.chatEntitlementService);
		const anonymousUser = this.chatEntitlementService.anonymous;
		const disabled = this.chatEntitlementService.sentiment.disabled || this.chatEntitlementService.sentiment.untrusted;
		const signedOut = this.chatEntitlementService.entitlement === ChatEntitlement.Unknown;
		const isFreePlan = this.chatEntitlementService.entitlement === ChatEntitlement.Free;

		// Set plan name and toggle visibility based on plan type
		if (anonymousUser || isFreePlan) {
			if (anonymousUser) {
				// Hide badge for anonymous users, only show "Copilot" label
				this.planBadge.style.display = 'none';
			} else {
				// Show "Free" badge for free plan
				this.planBadge.style.display = '';
				this.planBadge.textContent = localize('plan.free', 'Free');
			}
		} else {
			this.planBadge.style.display = '';
			// Extract just the plan type (Pro, Pro+, Business, Enterprise)
			const planName = this.getCurrentPlanName();
			this.planBadge.textContent = planName.replace('Copilot ', '');
		}

		const shouldUpgrade = this.shouldShowUpgradeButton();

		// Configure action button
		if (newUser || signedOut || disabled || shouldUpgrade) {
			this.actionButton.element.style.display = '';

			let buttonLabel: string;
			let commandId: string;

			if (shouldUpgrade && !isFreePlan && !anonymousUser) {
				// Upgrade for paid plans
				if (this.chatEntitlementService.entitlement === ChatEntitlement.Pro) {
					buttonLabel = localize('plan.upgradeToProPlus', 'Upgrade to Copilot Pro+');
				} else {
					buttonLabel = localize('plan.upgradeToPro', 'Upgrade to Copilot Pro');
				}
				commandId = 'workbench.action.chat.upgradePlan';
			} else if (shouldUpgrade && (isFreePlan || anonymousUser)) {
				// Upgrade case for free plan
				buttonLabel = localize('upgradeToCopilotPro', 'Upgrade to Copilot Pro');
				commandId = 'workbench.action.chat.upgradePlan';
			} else if (newUser) {
				buttonLabel = localize('enableAIFeatures', "Use AI Features");
				commandId = newUser && anonymousUser ? 'workbench.action.chat.triggerSetupAnonymousWithoutDialog' : 'workbench.action.chat.triggerSetup';
			} else if (anonymousUser) {
				buttonLabel = localize('enableMoreAIFeatures', "Enable more AI Features");
				commandId = 'workbench.action.chat.triggerSetup';
			} else if (disabled) {
				buttonLabel = localize('enableCopilotButton', "Enable AI Features");
				commandId = 'workbench.action.chat.triggerSetup';
			} else {
				buttonLabel = localize('signInToUseAIFeatures', "Sign in to use AI Features");
				commandId = 'workbench.action.chat.triggerSetup';
			}

			this.actionButton.label = buttonLabel;
			this.actionButton.onDidClick(() => {
				this.commandService.executeCommand(commandId);
			});
		} else {
			this.actionButton.element.style.display = 'none';
		}
	}

	private getCurrentPlanName(): string {
		const entitlement = this.chatEntitlementService.entitlement;
		switch (entitlement) {
			case ChatEntitlement.Pro:
				return localize('plan.proName', 'Copilot Pro');
			case ChatEntitlement.ProPlus:
				return localize('plan.proPlusName', 'Copilot Pro+');
			case ChatEntitlement.Business:
				return localize('plan.businessName', 'Copilot Business');
			case ChatEntitlement.Enterprise:
				return localize('plan.enterpriseName', 'Copilot Enterprise');
			default:
				return localize('plan.freeName', 'Copilot Free');
		}
	}

	private shouldShowUpgradeButton(): boolean {
		const entitlement = this.chatEntitlementService.entitlement;
		return entitlement === ChatEntitlement.Available ||
			entitlement === ChatEntitlement.Free ||
			entitlement === ChatEntitlement.Pro;
	}

	override async setInput(input: ChatManagementEditorInput, options: IEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		await super.setInput(input, options, context, token);

		if (this.dimension) {
			this.layout(this.dimension);
		}
	}

	override layout(dimension: Dimension): void {
		this.dimension = dimension;

		if (this.container && this.splitView) {
			const headerHeight = this.headerContainer?.offsetHeight || 0;
			const splitViewHeight = dimension.height - headerHeight;
			this.splitView.layout(this.container.clientWidth, splitViewHeight);
			this.splitView.el.style.height = `${splitViewHeight}px`;
		}
	}

	override focus(): void {
		super.focus();
		this.sectionsList?.domFocus();
	}
}

class SectionItemDelegate implements IListVirtualDelegate<SectionItem> {
	getHeight(element: SectionItem) {
		return 22;
	}
	getTemplateId() { return 'sectionItem'; }
}

interface ISectionItemTemplateData {
	readonly label: HTMLElement;
}

class SectionItemRenderer {
	readonly templateId = 'sectionItem';

	renderTemplate(container: HTMLElement): ISectionItemTemplateData {
		container.classList.add('section-list-item');
		const label = DOM.append(container, $('.section-list-item-label'));
		return { label };
	}

	renderElement(element: SectionItem, index: number, templateData: ISectionItemTemplateData): void {
		templateData.label.textContent = element.label;
	}

	disposeTemplate(templateData: ISectionItemTemplateData): void {
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatManagement/chatManagementEditorInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatManagement/chatManagementEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import * as nls from '../../../../../nls.js';
import { registerIcon } from '../../../../../platform/theme/common/iconRegistry.js';
import { IUntypedEditorInput } from '../../../../common/editor.js';
import { EditorInput } from '../../../../common/editor/editorInput.js';

const ChatManagementEditorIcon = registerIcon('ai-management-editor-label-icon', Codicon.copilot, nls.localize('aiManagementEditorLabelIcon', 'Icon of the AI Management editor label.'));
const ModelsManagementEditorIcon = registerIcon('models-management-editor-label-icon', Codicon.settings, nls.localize('modelsManagementEditorLabelIcon', 'Icon of the Models Management editor label.'));

export const CHAT_MANAGEMENT_SECTION_USAGE = 'usage';
export const CHAT_MANAGEMENT_SECTION_MODELS = 'models';

export class ChatManagementEditorInput extends EditorInput {

	static readonly ID: string = 'workbench.input.chatManagement';

	readonly resource = undefined;

	constructor() {
		super();
	}

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		return super.matches(otherInput) || otherInput instanceof ChatManagementEditorInput;
	}

	override get typeId(): string {
		return ChatManagementEditorInput.ID;
	}

	override getName(): string {
		return nls.localize('aiManagementEditorInputName', "Manage Copilot");
	}

	override getIcon(): ThemeIcon {
		return ChatManagementEditorIcon;
	}

	override async resolve(): Promise<null> {
		return null;
	}
}

export class ModelsManagementEditorInput extends EditorInput {

	static readonly ID: string = 'workbench.input.modelsManagement';

	readonly resource = undefined;

	constructor() {
		super();
	}

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		return super.matches(otherInput) || otherInput instanceof ModelsManagementEditorInput;
	}

	override get typeId(): string {
		return ModelsManagementEditorInput.ID;
	}

	override getName(): string {
		return nls.localize('modelsManagementEditorInputName', "Language Models");
	}

	override getIcon(): ThemeIcon {
		return ModelsManagementEditorIcon;
	}

	override async resolve(): Promise<null> {
		return null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatManagement/chatModelsViewModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatManagement/chatModelsViewModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct, coalesce } from '../../../../../base/common/arrays.js';
import { IMatch, IFilter, or, matchesCamelCase, matchesWords, matchesBaseContiguousSubString } from '../../../../../base/common/filters.js';
import { Emitter } from '../../../../../base/common/event.js';
import { ILanguageModelsService, ILanguageModelChatMetadata, IUserFriendlyLanguageModel } from '../../../chat/common/languageModels.js';
import { IChatEntitlementService } from '../../../../services/chat/common/chatEntitlementService.js';
import { localize } from '../../../../../nls.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';

export const MODEL_ENTRY_TEMPLATE_ID = 'model.entry.template';
export const VENDOR_ENTRY_TEMPLATE_ID = 'vendor.entry.template';
export const GROUP_ENTRY_TEMPLATE_ID = 'group.entry.template';

const wordFilter = or(matchesBaseContiguousSubString, matchesWords);
const CAPABILITY_REGEX = /@capability:\s*([^\s]+)/gi;
const VISIBLE_REGEX = /@visible:\s*(true|false)/i;
const PROVIDER_REGEX = /@provider:\s*((".+?")|([^\s]+))/gi;

export const SEARCH_SUGGESTIONS = {
	FILTER_TYPES: [
		'@provider:',
		'@capability:',
		'@visible:'
	],
	CAPABILITIES: [
		'@capability:tools',
		'@capability:vision',
		'@capability:agent'
	],
	VISIBILITY: [
		'@visible:true',
		'@visible:false'
	]
};

export interface IVendorEntry {
	vendor: string;
	vendorDisplayName: string;
	managementCommand?: string;
}

export interface IModelEntry {
	vendor: string;
	vendorDisplayName: string;
	identifier: string;
	metadata: ILanguageModelChatMetadata;
}

export interface IModelItemEntry {
	type: 'model';
	id: string;
	modelEntry: IModelEntry;
	templateId: string;
	providerMatches?: IMatch[];
	modelNameMatches?: IMatch[];
	modelIdMatches?: IMatch[];
	capabilityMatches?: string[];
}

export interface IVendorItemEntry {
	type: 'vendor';
	id: string;
	vendorEntry: IVendorEntry;
	templateId: string;
	collapsed: boolean;
}

export interface IGroupItemEntry {
	type: 'group';
	id: string;
	group: string;
	label: string;
	templateId: string;
	collapsed: boolean;
}

export function isVendorEntry(entry: IViewModelEntry): entry is IVendorItemEntry {
	return entry.type === 'vendor';
}

export function isGroupEntry(entry: IViewModelEntry): entry is IGroupItemEntry {
	return entry.type === 'group';
}

export type IViewModelEntry = IModelItemEntry | IVendorItemEntry | IGroupItemEntry;

export interface IViewModelChangeEvent {
	at: number;
	removed: number;
	added: IViewModelEntry[];
}

export const enum ChatModelGroup {
	Vendor = 'vendor',
	Visibility = 'visibility'
}

export class ChatModelsViewModel extends Disposable {

	private readonly _onDidChange = this._register(new Emitter<IViewModelChangeEvent>());
	readonly onDidChange = this._onDidChange.event;

	private readonly _onDidChangeGrouping = this._register(new Emitter<ChatModelGroup>());
	readonly onDidChangeGrouping = this._onDidChangeGrouping.event;

	private modelEntries: IModelEntry[];
	private readonly collapsedGroups = new Set<string>();
	private searchValue: string = '';
	private modelsSorted: boolean = false;

	private _groupBy: ChatModelGroup = ChatModelGroup.Vendor;
	get groupBy(): ChatModelGroup { return this._groupBy; }
	set groupBy(groupBy: ChatModelGroup) {
		if (this._groupBy !== groupBy) {
			this._groupBy = groupBy;
			this.collapsedGroups.clear();
			this.modelEntries = this.sortModels(this.modelEntries);
			this.filter(this.searchValue);
			this._onDidChangeGrouping.fire(groupBy);
		}
	}

	constructor(
		@ILanguageModelsService private readonly languageModelsService: ILanguageModelsService,
		@IChatEntitlementService private readonly chatEntitlementService: IChatEntitlementService
	) {
		super();
		this.modelEntries = [];
		this._register(this.chatEntitlementService.onDidChangeEntitlement(() => this.refresh()));
	}

	private readonly _viewModelEntries: IViewModelEntry[] = [];
	get viewModelEntries(): readonly IViewModelEntry[] {
		return this._viewModelEntries;
	}
	private splice(at: number, removed: number, added: IViewModelEntry[]): void {
		this._viewModelEntries.splice(at, removed, ...added);
		if (this.selectedEntry) {
			this.selectedEntry = this._viewModelEntries.find(entry => entry.id === this.selectedEntry?.id);
		}
		this._onDidChange.fire({ at, removed, added });
	}

	selectedEntry: IViewModelEntry | undefined;

	public shouldRefilter(): boolean {
		return !this.modelsSorted;
	}

	filter(searchValue: string): readonly IViewModelEntry[] {
		this.searchValue = searchValue;
		if (!this.modelsSorted) {
			this.modelEntries = this.sortModels(this.modelEntries);
		}
		const filtered = this.filterModels(this.modelEntries, searchValue);
		this.splice(0, this._viewModelEntries.length, filtered);
		return this.viewModelEntries;
	}

	private filterModels(modelEntries: IModelEntry[], searchValue: string): IViewModelEntry[] {
		let visible: boolean | undefined;

		const visibleMatches = VISIBLE_REGEX.exec(searchValue);
		if (visibleMatches && visibleMatches[1]) {
			visible = visibleMatches[1].toLowerCase() === 'true';
			searchValue = searchValue.replace(VISIBLE_REGEX, '');
		}

		const providerNames: string[] = [];
		let providerMatch: RegExpExecArray | null;
		PROVIDER_REGEX.lastIndex = 0;
		while ((providerMatch = PROVIDER_REGEX.exec(searchValue)) !== null) {
			const providerName = providerMatch[2] ? providerMatch[2].substring(1, providerMatch[2].length - 1) : providerMatch[3];
			providerNames.push(providerName);
		}
		if (providerNames.length > 0) {
			searchValue = searchValue.replace(PROVIDER_REGEX, '');
		}

		const capabilities: string[] = [];
		let capabilityMatch: RegExpExecArray | null;
		CAPABILITY_REGEX.lastIndex = 0;
		while ((capabilityMatch = CAPABILITY_REGEX.exec(searchValue)) !== null) {
			capabilities.push(capabilityMatch[1].toLowerCase());
		}
		if (capabilities.length > 0) {
			searchValue = searchValue.replace(CAPABILITY_REGEX, '');
		}

		const quoteAtFirstChar = searchValue.charAt(0) === '"';
		const quoteAtLastChar = searchValue.charAt(searchValue.length - 1) === '"';
		const completeMatch = quoteAtFirstChar && quoteAtLastChar;
		if (quoteAtFirstChar) {
			searchValue = searchValue.substring(1);
		}
		if (quoteAtLastChar) {
			searchValue = searchValue.substring(0, searchValue.length - 1);
		}
		searchValue = searchValue.trim();

		const isFiltering = searchValue !== '' || capabilities.length > 0 || providerNames.length > 0 || visible !== undefined;

		const result: IViewModelEntry[] = [];
		const words = searchValue.split(' ');
		const allVendors = new Set(this.modelEntries.map(m => m.vendor));
		const showHeaders = allVendors.size > 1;
		const addedGroups = new Set<string>();
		const lowerProviders = providerNames.map(p => p.toLowerCase().trim());

		for (const modelEntry of modelEntries) {
			if (visible !== undefined) {
				if ((modelEntry.metadata.isUserSelectable ?? false) !== visible) {
					continue;
				}
			}

			if (lowerProviders.length > 0) {
				const matchesProvider = lowerProviders.some(provider =>
					modelEntry.vendor.toLowerCase() === provider ||
					modelEntry.vendorDisplayName.toLowerCase() === provider
				);
				if (!matchesProvider) {
					continue;
				}
			}

			// Filter by capabilities
			let matchedCapabilities: string[] = [];
			if (capabilities.length > 0) {
				if (!modelEntry.metadata.capabilities) {
					continue;
				}
				let matchesAll = true;
				for (const capability of capabilities) {
					const matchedForThisCapability = this.getMatchingCapabilities(modelEntry, capability);
					if (matchedForThisCapability.length === 0) {
						matchesAll = false;
						break;
					}
					matchedCapabilities.push(...matchedForThisCapability);
				}
				if (!matchesAll) {
					continue;
				}
				matchedCapabilities = distinct(matchedCapabilities);
			}

			// Filter by text
			let modelMatches: ModelItemMatches | undefined;
			if (searchValue) {
				modelMatches = new ModelItemMatches(modelEntry, searchValue, words, completeMatch);
				if (!modelMatches.modelNameMatches && !modelMatches.modelIdMatches && !modelMatches.providerMatches && !modelMatches.capabilityMatches) {
					continue;
				}
			}

			if (this.groupBy === ChatModelGroup.Vendor) {
				if (showHeaders) {
					if (!addedGroups.has(modelEntry.vendor)) {
						const isCollapsed = !isFiltering && this.collapsedGroups.has(modelEntry.vendor);
						const vendorInfo = this.languageModelsService.getVendors().find(v => v.vendor === modelEntry.vendor);
						result.push({
							type: 'vendor',
							id: `vendor-${modelEntry.vendor}`,
							vendorEntry: {
								vendor: modelEntry.vendor,
								vendorDisplayName: modelEntry.vendorDisplayName,
								managementCommand: vendorInfo?.managementCommand
							},
							templateId: VENDOR_ENTRY_TEMPLATE_ID,
							collapsed: isCollapsed
						});
						addedGroups.add(modelEntry.vendor);
					}

					if (!isFiltering && this.collapsedGroups.has(modelEntry.vendor)) {
						continue;
					}
				}
			} else if (this.groupBy === ChatModelGroup.Visibility) {
				const isVisible = modelEntry.metadata.isUserSelectable ?? false;
				const groupKey = isVisible ? 'visible' : 'hidden';
				if (!addedGroups.has(groupKey)) {
					const isCollapsed = !isFiltering && this.collapsedGroups.has(groupKey);
					result.push({
						type: 'group',
						id: `group-${groupKey}`,
						group: groupKey,
						label: isVisible ? localize('visible', "Visible") : localize('hidden', "Hidden"),
						templateId: GROUP_ENTRY_TEMPLATE_ID,
						collapsed: isCollapsed
					});
					addedGroups.add(groupKey);
				}

				if (!isFiltering && this.collapsedGroups.has(groupKey)) {
					continue;
				}
			}

			const modelId = ChatModelsViewModel.getId(modelEntry);
			result.push({
				type: 'model',
				id: modelId,
				templateId: MODEL_ENTRY_TEMPLATE_ID,
				modelEntry,
				modelNameMatches: modelMatches?.modelNameMatches || undefined,
				modelIdMatches: modelMatches?.modelIdMatches || undefined,
				providerMatches: modelMatches?.providerMatches || undefined,
				capabilityMatches: matchedCapabilities.length ? matchedCapabilities : undefined,
			});
		}
		return result;
	}

	private getMatchingCapabilities(modelEntry: IModelEntry, capability: string): string[] {
		const matchedCapabilities: string[] = [];
		if (!modelEntry.metadata.capabilities) {
			return matchedCapabilities;
		}

		switch (capability) {
			case 'tools':
			case 'toolcalling':
				if (modelEntry.metadata.capabilities.toolCalling === true) {
					matchedCapabilities.push('toolCalling');
				}
				break;
			case 'vision':
				if (modelEntry.metadata.capabilities.vision === true) {
					matchedCapabilities.push('vision');
				}
				break;
			case 'agent':
			case 'agentmode':
				if (modelEntry.metadata.capabilities.agentMode === true) {
					matchedCapabilities.push('agentMode');
				}
				break;
			default:
				// Check edit tools
				if (modelEntry.metadata.capabilities.editTools) {
					for (const tool of modelEntry.metadata.capabilities.editTools) {
						if (tool.toLowerCase().includes(capability)) {
							matchedCapabilities.push(tool);
						}
					}
				}
				break;
		}
		return matchedCapabilities;
	}

	private sortModels(modelEntries: IModelEntry[]): IModelEntry[] {
		if (this.groupBy === ChatModelGroup.Visibility) {
			modelEntries.sort((a, b) => {
				const aVisible = a.metadata.isUserSelectable ?? false;
				const bVisible = b.metadata.isUserSelectable ?? false;
				if (aVisible === bVisible) {
					if (a.vendor === b.vendor) {
						return a.metadata.name.localeCompare(b.metadata.name);
					}
					if (a.vendor === 'copilot') { return -1; }
					if (b.vendor === 'copilot') { return 1; }
					return a.vendorDisplayName.localeCompare(b.vendorDisplayName);
				}
				return aVisible ? -1 : 1;
			});
		} else if (this.groupBy === ChatModelGroup.Vendor) {
			modelEntries.sort((a, b) => {
				if (a.vendor === b.vendor) {
					return a.metadata.name.localeCompare(b.metadata.name);
				}
				if (a.vendor === 'copilot') { return -1; }
				if (b.vendor === 'copilot') { return 1; }
				return a.vendorDisplayName.localeCompare(b.vendorDisplayName);
			});
		}
		this.modelsSorted = true;
		return modelEntries;
	}

	getVendors(): IUserFriendlyLanguageModel[] {
		return [...this.languageModelsService.getVendors()].sort((a, b) => {
			if (a.vendor === 'copilot') { return -1; }
			if (b.vendor === 'copilot') { return 1; }
			return a.displayName.localeCompare(b.displayName);
		});
	}

	async refresh(): Promise<void> {
		this.modelEntries = [];
		for (const vendor of this.getVendors()) {
			const modelIdentifiers = await this.languageModelsService.selectLanguageModels({ vendor: vendor.vendor }, vendor.vendor === 'copilot');
			const models = coalesce(modelIdentifiers.map(identifier => {
				const metadata = this.languageModelsService.lookupLanguageModel(identifier);
				if (!metadata) {
					return undefined;
				}
				if (vendor.vendor === 'copilot' && metadata.id === 'auto') {
					return undefined;
				}
				return {
					vendor: vendor.vendor,
					vendorDisplayName: vendor.displayName,
					identifier,
					metadata
				};
			}));

			this.modelEntries.push(...models.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name)));
			const modelEntries = distinct(this.modelEntries, modelEntry => ChatModelsViewModel.getId(modelEntry));

			if (this._groupBy === ChatModelGroup.Visibility) {
				this.modelEntries = this.sortModels(modelEntries);
			} else {
				this.modelEntries = modelEntries;
				if (models.every(m => !m.metadata.isUserSelectable)) {
					this.collapsedGroups.add(vendor.vendor);
				}
			}

			this.modelEntries = this._groupBy === ChatModelGroup.Visibility ? this.sortModels(modelEntries) : modelEntries;
			this.filter(this.searchValue);
		}
	}

	toggleVisibility(model: IModelItemEntry): void {
		const isVisible = model.modelEntry.metadata.isUserSelectable ?? false;
		const newVisibility = !isVisible;
		this.languageModelsService.updateModelPickerPreference(model.modelEntry.identifier, newVisibility);
		const metadata = this.languageModelsService.lookupLanguageModel(model.modelEntry.identifier);
		const index = this.viewModelEntries.indexOf(model);
		if (metadata && index !== -1) {
			model.id = ChatModelsViewModel.getId(model.modelEntry);
			model.modelEntry.metadata = metadata;
			if (this.groupBy === ChatModelGroup.Visibility) {
				this.modelsSorted = false;
			}
			this.splice(index, 1, [model]);
		}
	}

	private static getId(modelEntry: IModelEntry): string {
		return `${modelEntry.identifier}.${modelEntry.metadata.version}-visible:${modelEntry.metadata.isUserSelectable}`;
	}

	toggleCollapsed(viewModelEntry: IViewModelEntry): void {
		const id = isGroupEntry(viewModelEntry) ? viewModelEntry.group : isVendorEntry(viewModelEntry) ? viewModelEntry.vendorEntry.vendor : undefined;
		if (!id) {
			return;
		}
		this.selectedEntry = viewModelEntry;
		if (!this.collapsedGroups.delete(id)) {
			this.collapsedGroups.add(id);
		}
		this.filter(this.searchValue);
	}

	collapseAll(): void {
		const allGroupIds = new Set<string>();
		for (const entry of this.viewModelEntries) {
			if (isVendorEntry(entry)) {
				allGroupIds.add(entry.vendorEntry.vendor);
			} else if (isGroupEntry(entry)) {
				allGroupIds.add(entry.group);
			}
		}
		for (const id of allGroupIds) {
			this.collapsedGroups.add(id);
		}
		this.filter(this.searchValue);
	}

	getConfiguredVendors(): IVendorEntry[] {
		const result: IVendorEntry[] = [];
		const seenVendors = new Set<string>();
		for (const modelEntry of this.modelEntries) {
			if (!seenVendors.has(modelEntry.vendor)) {
				seenVendors.add(modelEntry.vendor);
				const vendorInfo = this.languageModelsService.getVendors().find(v => v.vendor === modelEntry.vendor);
				result.push({
					vendor: modelEntry.vendor,
					vendorDisplayName: modelEntry.vendorDisplayName,
					managementCommand: vendorInfo?.managementCommand
				});
			}
		}
		return result;
	}
}

class ModelItemMatches {

	readonly modelNameMatches: IMatch[] | null = null;
	readonly modelIdMatches: IMatch[] | null = null;
	readonly providerMatches: IMatch[] | null = null;
	readonly capabilityMatches: IMatch[] | null = null;

	constructor(modelEntry: IModelEntry, searchValue: string, words: string[], completeMatch: boolean) {
		if (!completeMatch) {
			// Match against model name
			this.modelNameMatches = modelEntry.metadata.name ?
				this.matches(searchValue, modelEntry.metadata.name, (word, wordToMatchAgainst) => matchesWords(word, wordToMatchAgainst, true), words) :
				null;

			this.modelIdMatches = this.matches(searchValue, modelEntry.identifier, or(matchesWords, matchesCamelCase), words);

			// Match against vendor display name
			this.providerMatches = this.matches(searchValue, modelEntry.vendorDisplayName, (word, wordToMatchAgainst) => matchesWords(word, wordToMatchAgainst, true), words);

			// Match against capabilities
			if (modelEntry.metadata.capabilities) {
				const capabilityStrings: string[] = [];
				if (modelEntry.metadata.capabilities.toolCalling) {
					capabilityStrings.push('tools', 'toolCalling');
				}
				if (modelEntry.metadata.capabilities.vision) {
					capabilityStrings.push('vision');
				}
				if (modelEntry.metadata.capabilities.agentMode) {
					capabilityStrings.push('agent', 'agentMode');
				}
				if (modelEntry.metadata.capabilities.editTools) {
					capabilityStrings.push(...modelEntry.metadata.capabilities.editTools);
				}

				const capabilityString = capabilityStrings.join(' ');
				if (capabilityString) {
					this.capabilityMatches = this.matches(searchValue, capabilityString, or(matchesWords, matchesCamelCase), words);
				}
			}
		}
	}

	private matches(searchValue: string | null, wordToMatchAgainst: string, wordMatchesFilter: IFilter, words: string[]): IMatch[] | null {
		let matches = searchValue ? wordFilter(searchValue, wordToMatchAgainst) : null;
		if (!matches) {
			matches = this.matchesWords(words, wordToMatchAgainst, wordMatchesFilter);
		}
		if (matches) {
			matches = this.filterAndSort(matches);
		}
		return matches;
	}

	private matchesWords(words: string[], wordToMatchAgainst: string, wordMatchesFilter: IFilter): IMatch[] | null {
		let matches: IMatch[] | null = [];
		for (const word of words) {
			const wordMatches = wordMatchesFilter(word, wordToMatchAgainst);
			if (wordMatches) {
				matches = [...(matches || []), ...wordMatches];
			} else {
				matches = null;
				break;
			}
		}
		return matches;
	}

	private filterAndSort(matches: IMatch[]): IMatch[] {
		return distinct(matches, (a => a.start + '.' + a.end))
			.filter(match => !matches.some(m => !(m.start === match.start && m.end === match.end) && (m.start <= match.start && m.end >= match.end)))
			.sort((a, b) => a.start - b.start);
	}
}
```

--------------------------------------------------------------------------------

````
