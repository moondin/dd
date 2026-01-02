---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 352
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 352 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatChangesSummaryPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatChangesSummaryPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { $ } from '../../../../../base/browser/dom.js';
import { ButtonWithIcon } from '../../../../../base/browser/ui/button/button.js';
import { IListRenderer, IListVirtualDelegate } from '../../../../../base/browser/ui/list/list.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Emitter } from '../../../../../base/common/event.js';
import { Iterable } from '../../../../../base/common/iterator.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun, IObservable } from '../../../../../base/common/observable.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { URI } from '../../../../../base/common/uri.js';
import { localize2 } from '../../../../../nls.js';
import { FileKind } from '../../../../../platform/files/common/files.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { WorkbenchList } from '../../../../../platform/list/browser/listService.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { IResourceLabel, ResourceLabels } from '../../../../browser/labels.js';
import { IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { createFileIconThemableTreeContainerScope } from '../../../files/browser/views/explorerView.js';
import { MultiDiffEditorInput } from '../../../multiDiffEditor/browser/multiDiffEditorInput.js';
import { MultiDiffEditorItem } from '../../../multiDiffEditor/browser/multiDiffSourceResolverService.js';
import { IChatEditingSession, IEditSessionEntryDiff } from '../../common/chatEditingService.js';
import { IChatService } from '../../common/chatService.js';
import { IChatChangesSummaryPart as IChatFileChangesSummaryPart, IChatRendererContent } from '../../common/chatViewModel.js';
import { ChatTreeItem } from '../chat.js';
import { ResourcePool } from './chatCollections.js';
import { IChatContentPart, IChatContentPartRenderContext } from './chatContentParts.js';

export class ChatCheckpointFileChangesSummaryContentPart extends Disposable implements IChatContentPart {

	public readonly domNode: HTMLElement;

	public readonly ELEMENT_HEIGHT = 22;
	public readonly MAX_ITEMS_SHOWN = 6;

	private readonly _onDidChangeHeight = this._register(new Emitter<void>());
	public readonly onDidChangeHeight = this._onDidChangeHeight.event;

	private readonly diffsBetweenRequests = new Map<string, IObservable<IEditSessionEntryDiff | undefined>>();

	private fileChangesDiffsObservable: IObservable<readonly IEditSessionEntryDiff[]>;

	private list!: WorkbenchList<IEditSessionEntryDiff>;
	private isCollapsed: boolean = true;

	constructor(
		private readonly content: IChatFileChangesSummaryPart,
		context: IChatContentPartRenderContext,
		@IHoverService private readonly hoverService: IHoverService,
		@IChatService private readonly chatService: IChatService,
		@IEditorService private readonly editorService: IEditorService,
		@IEditorGroupsService private readonly editorGroupsService: IEditorGroupsService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		this.fileChangesDiffsObservable = this.computeFileChangesDiffs(content);

		const headerDomNode = $('.checkpoint-file-changes-summary-header');
		this.domNode = $('.checkpoint-file-changes-summary', undefined, headerDomNode);
		this.domNode.tabIndex = 0;

		this._register(this.renderHeader(headerDomNode));
		this._register(this.renderFilesList(this.domNode));
	}

	private computeFileChangesDiffs({ requestId, sessionResource }: IChatFileChangesSummaryPart) {
		return this.chatService.chatModels
			.map(models => Iterable.find(models, m => isEqual(m.sessionResource, sessionResource)))
			.map(model => model?.editingSession?.getDiffsForFilesInRequest(requestId))
			.map((diffs, r) => diffs?.read(r) || Iterable.empty());
	}

	public getCachedEntryDiffBetweenRequests(editSession: IChatEditingSession, uri: URI, startRequestId: string, stopRequestId: string): IObservable<IEditSessionEntryDiff | undefined> | undefined {
		const key = `${uri}\0${startRequestId}\0${stopRequestId}`;
		let observable = this.diffsBetweenRequests.get(key);
		if (!observable) {
			observable = editSession.getEntryDiffBetweenRequests(uri, startRequestId, stopRequestId);
			this.diffsBetweenRequests.set(key, observable);
		}
		return observable;
	}

	private renderHeader(container: HTMLElement): IDisposable {
		const viewListButtonContainer = container.appendChild($('.chat-file-changes-label'));
		const viewListButton = new ButtonWithIcon(viewListButtonContainer, {});

		this._register(autorun(r => {
			const diffs = this.fileChangesDiffsObservable.read(r);
			viewListButton.label = diffs.length === 1 ? `Changed 1 file` : `Changed ${diffs.length} files`;
		}));

		const setExpansionState = () => {
			viewListButton.icon = this.isCollapsed ? Codicon.chevronRight : Codicon.chevronDown;
			this.domNode.classList.toggle('chat-file-changes-collapsed', this.isCollapsed);
			this._onDidChangeHeight.fire();
		};
		setExpansionState();

		const disposables = new DisposableStore();
		disposables.add(viewListButton);
		disposables.add(viewListButton.onDidClick(() => {
			this.isCollapsed = !this.isCollapsed;
			setExpansionState();
		}));
		disposables.add(this.renderViewAllFileChangesButton(viewListButton.element));
		return toDisposable(() => disposables.dispose());
	}

	private renderViewAllFileChangesButton(container: HTMLElement): IDisposable {
		const button = container.appendChild($('.chat-view-changes-icon'));
		this.hoverService.setupDelayedHover(button, () => ({
			content: localize2('chat.viewFileChangesSummary', 'View All File Changes')
		}));
		button.classList.add(...ThemeIcon.asClassNameArray(Codicon.diffMultiple));
		button.setAttribute('role', 'button');
		button.tabIndex = 0;

		return dom.addDisposableListener(button, 'click', (e) => {
			const resources: { originalUri: URI; modifiedUri?: URI }[] = this.fileChangesDiffsObservable.get().map(diff => ({
				originalUri: diff.originalURI,
				modifiedUri: diff.modifiedURI
			}));

			const source = URI.parse(`multi-diff-editor:${new Date().getMilliseconds().toString() + Math.random().toString()}`);
			const input = this.instantiationService.createInstance(
				MultiDiffEditorInput,
				source,
				'Checkpoint File Changes',
				resources.map(resource => {
					return new MultiDiffEditorItem(
						resource.originalUri,
						resource.modifiedUri,
						undefined,
					);
				}),
				false
			);
			this.editorGroupsService.activeGroup.openEditor(input);
			dom.EventHelper.stop(e, true);
		});
	}

	private renderFilesList(container: HTMLElement): IDisposable {
		const store = new DisposableStore();
		this.list = store.add(this.instantiationService.createInstance(CollapsibleChangesSummaryListPool)).get();
		const listNode = this.list.getHTMLElement();
		container.appendChild(listNode.parentElement!);

		store.add(this.list.onDidOpen((item) => {
			const diff = item.element;
			if (!diff) {
				return;
			}

			const input = {
				original: { resource: diff.originalURI },
				modified: { resource: diff.modifiedURI },
				options: { preserveFocus: true }
			};

			this.editorService.openEditor(input);
		}));

		store.add(this.list.onContextMenu(e => {
			dom.EventHelper.stop(e.browserEvent, true);
		}));

		store.add(autorun((r) => {
			const diffs = this.fileChangesDiffsObservable.read(r);

			const itemsShown = Math.min(diffs.length, this.MAX_ITEMS_SHOWN);
			const height = itemsShown * this.ELEMENT_HEIGHT;
			this.list.layout(height);
			listNode.style.height = height + 'px';

			this.list.splice(0, this.list.length, diffs);
		}));

		return store;
	}

	hasSameContent(other: IChatRendererContent, followingContent: IChatRendererContent[], element: ChatTreeItem): boolean {
		return other.kind === 'changesSummary' && other.requestId === this.content.requestId;
	}

	addDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}
}

interface IChatFileChangesSummaryListWrapper extends IDisposable {
	list: WorkbenchList<IEditSessionEntryDiff>;
}

class CollapsibleChangesSummaryListPool extends Disposable {

	private _resourcePool: ResourcePool<IChatFileChangesSummaryListWrapper>;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IThemeService private readonly themeService: IThemeService
	) {
		super();
		this._resourcePool = this._register(new ResourcePool(() => this.listFactory()));
	}

	private listFactory(): IChatFileChangesSummaryListWrapper {
		const container = $('.chat-summary-list');
		const store = new DisposableStore();
		store.add(createFileIconThemableTreeContainerScope(container, this.themeService));
		const resourceLabels = store.add(this.instantiationService.createInstance(ResourceLabels, { onDidChangeVisibility: () => Disposable.None }));
		const list = store.add(this.instantiationService.createInstance(
			WorkbenchList<IEditSessionEntryDiff>,
			'ChatListRenderer',
			container,
			new CollapsibleChangesSummaryListDelegate(),
			[this.instantiationService.createInstance(CollapsibleChangesSummaryListRenderer, resourceLabels)],
			{
				alwaysConsumeMouseWheel: false
			}
		));
		return {
			list: list,
			dispose: () => {
				store.dispose();
			}
		};
	}

	get(): WorkbenchList<IEditSessionEntryDiff> {
		return this._resourcePool.get().list;
	}
}

interface ICollapsibleChangesSummaryListTemplate extends IDisposable {
	readonly label: IResourceLabel;
	changesElement?: HTMLElement;
}

class CollapsibleChangesSummaryListDelegate implements IListVirtualDelegate<IEditSessionEntryDiff> {

	getHeight(element: IEditSessionEntryDiff): number {
		return 22;
	}

	getTemplateId(element: IEditSessionEntryDiff): string {
		return CollapsibleChangesSummaryListRenderer.TEMPLATE_ID;
	}
}

class CollapsibleChangesSummaryListRenderer implements IListRenderer<IEditSessionEntryDiff, ICollapsibleChangesSummaryListTemplate> {

	static TEMPLATE_ID = 'collapsibleChangesSummaryListRenderer';
	static CHANGES_SUMMARY_CLASS_NAME = 'insertions-and-deletions';

	readonly templateId: string = CollapsibleChangesSummaryListRenderer.TEMPLATE_ID;

	constructor(private labels: ResourceLabels) { }

	renderTemplate(container: HTMLElement): ICollapsibleChangesSummaryListTemplate {
		const label = this.labels.create(container, { supportHighlights: true, supportIcons: true });
		return { label, dispose: () => label.dispose() };
	}

	renderElement(data: IEditSessionEntryDiff, index: number, templateData: ICollapsibleChangesSummaryListTemplate): void {
		const label = templateData.label;
		label.setFile(data.modifiedURI, {
			fileKind: FileKind.FILE,
			title: data.modifiedURI.path
		});
		const labelElement = label.element;

		templateData.changesElement?.remove();

		if (!data.identical && !data.isBusy) {
			const changesSummary = labelElement.appendChild($(`.${CollapsibleChangesSummaryListRenderer.CHANGES_SUMMARY_CLASS_NAME}`));

			const added = changesSummary.appendChild($(`.insertions`));
			added.textContent = `+${data.added}`;

			const removed = changesSummary.appendChild($(`.deletions`));
			removed.textContent = `-${data.removed}`;

			templateData.changesElement = changesSummary;
		}
	}

	disposeTemplate(templateData: ICollapsibleChangesSummaryListTemplate): void {
		templateData.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatCodeCitationContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatCodeCitationContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { Button } from '../../../../../base/browser/ui/button/button.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../nls.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { ChatTreeItem } from '../chat.js';
import { IChatContentPart, IChatContentPartRenderContext } from './chatContentParts.js';
import { getCodeCitationsMessage } from '../../common/chatModel.js';
import { IChatCodeCitations, IChatRendererContent } from '../../common/chatViewModel.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';

type ChatCodeCitationOpenedClassification = {
	owner: 'roblourens';
	comment: 'Indicates when a user opens chat code citations';
};

export class ChatCodeCitationContentPart extends Disposable implements IChatContentPart {
	public readonly domNode: HTMLElement;

	constructor(
		citations: IChatCodeCitations,
		context: IChatContentPartRenderContext,
		@IEditorService private readonly editorService: IEditorService,
		@ITelemetryService private readonly telemetryService: ITelemetryService
	) {
		super();

		const label = getCodeCitationsMessage(citations.citations);
		const elements = dom.h('.chat-code-citation-message@root', [
			dom.h('span.chat-code-citation-label@label'),
			dom.h('.chat-code-citation-button-container@button'),
		]);
		elements.label.textContent = label + ' - ';
		const button = this._register(new Button(elements.button, {
			buttonBackground: undefined,
			buttonBorder: undefined,
			buttonForeground: undefined,
			buttonHoverBackground: undefined,
			buttonSecondaryBackground: undefined,
			buttonSecondaryForeground: undefined,
			buttonSecondaryHoverBackground: undefined,
			buttonSeparator: undefined
		}));
		button.label = localize('viewMatches', "View matches");
		this._register(button.onDidClick(() => {
			const citationText = `# Code Citations\n\n` + citations.citations.map(c => `## License: ${c.license}\n${c.value.toString()}\n\n\`\`\`\n${c.snippet}\n\`\`\`\n\n`).join('\n');
			this.editorService.openEditor({ resource: undefined, contents: citationText, languageId: 'markdown' });
			this.telemetryService.publicLog2<{}, ChatCodeCitationOpenedClassification>('openedChatCodeCitations');
		}));
		this.domNode = elements.root;
	}

	hasSameContent(other: IChatRendererContent, followingContent: IChatRendererContent[], element: ChatTreeItem): boolean {
		return other.kind === 'codeCitations';
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatCollapsibleContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatCollapsibleContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $ } from '../../../../../base/browser/dom.js';
import { ButtonWithIcon } from '../../../../../base/browser/ui/button/button.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Emitter } from '../../../../../base/common/event.js';
import { IMarkdownString, MarkdownString } from '../../../../../base/common/htmlContent.js';
import { Disposable, IDisposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun, IObservable, observableValue } from '../../../../../base/common/observable.js';
import { IChatRendererContent } from '../../common/chatViewModel.js';
import { ChatTreeItem } from '../chat.js';
import { IChatContentPart, IChatContentPartRenderContext } from './chatContentParts.js';
import { renderFileWidgets } from '../chatInlineAnchorWidget.js';
import { IChatMarkdownAnchorService } from './chatMarkdownAnchorService.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IMarkdownRenderer } from '../../../../../platform/markdown/browser/markdownRenderer.js';
import { IRenderedMarkdown } from '../../../../../base/browser/markdownRenderer.js';


export abstract class ChatCollapsibleContentPart extends Disposable implements IChatContentPart {

	private _domNode?: HTMLElement;
	private readonly _renderedTitleWithWidgets = this._register(new MutableDisposable<IRenderedMarkdown>());

	protected readonly _onDidChangeHeight = this._register(new Emitter<void>());
	public readonly onDidChangeHeight = this._onDidChangeHeight.event;

	protected readonly hasFollowingContent: boolean;
	protected _isExpanded = observableValue<boolean>(this, false);
	protected _collapseButton: ButtonWithIcon | undefined;

	constructor(
		private title: IMarkdownString | string,
		protected readonly context: IChatContentPartRenderContext,
	) {
		super();
		this.hasFollowingContent = this.context.contentIndex + 1 < this.context.content.length;
	}

	get domNode(): HTMLElement {
		this._domNode ??= this.init();
		return this._domNode;
	}

	protected init(): HTMLElement {
		const referencesLabel = this.title;


		const buttonElement = $('.chat-used-context-label', undefined);

		const collapseButton = this._register(new ButtonWithIcon(buttonElement, {
			buttonBackground: undefined,
			buttonBorder: undefined,
			buttonForeground: undefined,
			buttonHoverBackground: undefined,
			buttonSecondaryBackground: undefined,
			buttonSecondaryForeground: undefined,
			buttonSecondaryHoverBackground: undefined,
			buttonSeparator: undefined
		}));
		this._collapseButton = collapseButton;
		this._domNode = $('.chat-used-context', undefined, buttonElement);
		collapseButton.label = referencesLabel;

		this._register(collapseButton.onDidClick(() => {
			const value = this._isExpanded.get();
			this._isExpanded.set(!value, undefined);
		}));

		this._register(autorun(r => {
			const expanded = this._isExpanded.read(r);
			collapseButton.icon = expanded ? Codicon.chevronDown : Codicon.chevronRight;
			this._domNode?.classList.toggle('chat-used-context-collapsed', !expanded);
			this.updateAriaLabel(collapseButton.element, typeof referencesLabel === 'string' ? referencesLabel : referencesLabel.value, expanded);

			if (this._domNode?.isConnected) {
				queueMicrotask(() => {
					this._onDidChangeHeight.fire();
				});
			}
		}));

		const content = this.initContent();
		this._domNode.appendChild(content);
		return this._domNode;
	}

	protected abstract initContent(): HTMLElement;

	abstract hasSameContent(other: IChatRendererContent, followingContent: IChatRendererContent[], element: ChatTreeItem): boolean;

	private updateAriaLabel(element: HTMLElement, label: string, expanded?: boolean): void {
		element.ariaLabel = label;
		element.ariaExpanded = String(expanded);
	}

	addDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}

	get expanded(): IObservable<boolean> {
		return this._isExpanded;
	}

	protected isExpanded(): boolean {
		return this._isExpanded.get();
	}

	protected setExpanded(value: boolean): void {
		this._isExpanded.set(value, undefined);
	}

	protected setTitle(title: string): void {
		this.title = title;
		if (this._collapseButton) {
			this._collapseButton.label = title;
			this.updateAriaLabel(this._collapseButton.element, title, this.isExpanded());
		}
	}


	// Render collapsible dropdown title with widgets
	protected setTitleWithWidgets(content: MarkdownString, instantiationService: IInstantiationService, chatMarkdownAnchorService: IChatMarkdownAnchorService, chatContentMarkdownRenderer: IMarkdownRenderer): void {
		if (this._store.isDisposed || !this._collapseButton) {
			return;
		}

		const result = chatContentMarkdownRenderer.render(content);
		result.element.classList.add('collapsible-title-content');

		renderFileWidgets(result.element, instantiationService, chatMarkdownAnchorService, this._store);

		const labelElement = this._collapseButton.labelElement;
		labelElement.textContent = '';
		labelElement.appendChild(result.element);

		const textContent = result.element.textContent || '';
		this.updateAriaLabel(this._collapseButton.element, textContent, this.isExpanded());

		this._renderedTitleWithWidgets.value = result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatCollections.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatCollections.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable, Disposable } from '../../../../../base/common/lifecycle.js';

export class ResourcePool<T extends IDisposable> extends Disposable {
	private readonly pool: T[] = [];

	private _inUse = new Set<T>;
	public get inUse(): ReadonlySet<T> {
		return this._inUse;
	}

	constructor(
		private readonly _itemFactory: () => T,
	) {
		super();
	}

	get(): T {
		if (this.pool.length > 0) {
			const item = this.pool.pop()!;
			this._inUse.add(item);
			return item;
		}

		const item = this._register(this._itemFactory());
		this._inUse.add(item);
		return item;
	}

	release(item: T): void {
		this._inUse.delete(item);
		this.pool.push(item);
	}
}

export interface IDisposableReference<T> extends IDisposable {
	object: T;
	isStale: () => boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatCommandContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatCommandContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { Button } from '../../../../../base/browser/ui/button/button.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../nls.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { defaultButtonStyles } from '../../../../../platform/theme/browser/defaultStyles.js';
import { IChatContentPart, IChatContentPartRenderContext } from './chatContentParts.js';
import { IChatProgressRenderableResponseContent } from '../../common/chatModel.js';
import { IChatCommandButton } from '../../common/chatService.js';
import { isResponseVM } from '../../common/chatViewModel.js';

const $ = dom.$;

export class ChatCommandButtonContentPart extends Disposable implements IChatContentPart {
	public readonly domNode: HTMLElement;

	constructor(
		commandButton: IChatCommandButton,
		context: IChatContentPartRenderContext,
		@ICommandService private readonly commandService: ICommandService
	) {
		super();

		this.domNode = $('.chat-command-button');
		const enabled = !isResponseVM(context.element) || !context.element.isStale;
		const tooltip = enabled ?
			commandButton.command.tooltip :
			localize('commandButtonDisabled', "Button not available in restored chat");
		const button = this._register(new Button(this.domNode, { ...defaultButtonStyles, supportIcons: true, title: tooltip }));
		button.label = commandButton.command.title;
		button.enabled = enabled;

		// TODO still need telemetry for command buttons
		this._register(button.onDidClick(() => this.commandService.executeCommand(commandButton.command.id, ...(commandButton.command.arguments ?? []))));
	}

	hasSameContent(other: IChatProgressRenderableResponseContent): boolean {
		// No other change allowed for this content type
		return other.kind === 'command';
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatConfirmationContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatConfirmationContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../nls.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IChatProgressRenderableResponseContent } from '../../common/chatModel.js';
import { IChatConfirmation, IChatSendRequestOptions, IChatService } from '../../common/chatService.js';
import { isResponseVM } from '../../common/chatViewModel.js';
import { IChatWidgetService } from '../chat.js';
import { SimpleChatConfirmationWidget } from './chatConfirmationWidget.js';
import { IChatContentPart, IChatContentPartRenderContext } from './chatContentParts.js';

export class ChatConfirmationContentPart extends Disposable implements IChatContentPart {
	public readonly domNode: HTMLElement;

	private readonly _onDidChangeHeight = this._register(new Emitter<void>());
	public readonly onDidChangeHeight = this._onDidChangeHeight.event;

	constructor(
		confirmation: IChatConfirmation,
		context: IChatContentPartRenderContext,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IChatService private readonly chatService: IChatService,
		@IChatWidgetService chatWidgetService: IChatWidgetService,
	) {
		super();

		const element = context.element;
		const buttons = confirmation.buttons
			? confirmation.buttons.map(button => ({
				label: button,
				data: confirmation.data,
				isSecondary: button !== confirmation.buttons?.[0],
			}))
			: [
				{ label: localize('accept', "Accept"), data: confirmation.data },
				{ label: localize('dismiss', "Dismiss"), data: confirmation.data, isSecondary: true },
			];
		const confirmationWidget = this._register(this.instantiationService.createInstance(SimpleChatConfirmationWidget, context, { title: confirmation.title, buttons, message: confirmation.message }));
		confirmationWidget.setShowButtons(!confirmation.isUsed);

		this._register(confirmationWidget.onDidChangeHeight(() => this._onDidChangeHeight.fire()));

		this._register(confirmationWidget.onDidClick(async e => {
			if (isResponseVM(element)) {
				const prompt = `${e.label}: "${confirmation.title}"`;
				const options: IChatSendRequestOptions = e.isSecondary ?
					{ rejectedConfirmationData: [e.data] } :
					{ acceptedConfirmationData: [e.data] };
				options.agentId = element.agent?.id;
				options.slashCommand = element.slashCommand?.name;
				options.confirmation = e.label;
				const widget = chatWidgetService.getWidgetBySessionResource(element.sessionResource);
				options.userSelectedModelId = widget?.input.currentLanguageModel;
				options.modeInfo = widget?.input.currentModeInfo;
				options.location = widget?.location;
				Object.assign(options, widget?.getModeRequestOptions());

				if (await this.chatService.sendRequest(element.sessionResource, prompt, options)) {
					confirmation.isUsed = true;
					confirmationWidget.setShowButtons(false);
					this._onDidChangeHeight.fire();
				}
			}
		}));

		this.domNode = confirmationWidget.domNode;
	}

	hasSameContent(other: IChatProgressRenderableResponseContent): boolean {
		// No other change allowed for this content type
		return other.kind === 'confirmation';
	}

	addDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatConfirmationWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatConfirmationWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { IRenderedMarkdown } from '../../../../../base/browser/markdownRenderer.js';
import { Button, ButtonWithDropdown, IButton, IButtonOptions } from '../../../../../base/browser/ui/button/button.js';
import { Action, Separator } from '../../../../../base/common/actions.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { IMarkdownString, MarkdownString } from '../../../../../base/common/htmlContent.js';
import { Disposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import type { ThemeIcon } from '../../../../../base/common/themables.js';
import { localize } from '../../../../../nls.js';
import { MenuWorkbenchToolBar } from '../../../../../platform/actions/browser/toolbar.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { IMarkdownRendererService } from '../../../../../platform/markdown/browser/markdownRenderer.js';
import { defaultButtonStyles } from '../../../../../platform/theme/browser/defaultStyles.js';
import { renderFileWidgets } from '../chatInlineAnchorWidget.js';
import { IChatContentPartRenderContext } from './chatContentParts.js';
import { IChatMarkdownAnchorService } from './chatMarkdownAnchorService.js';
import { ChatMarkdownContentPart, IChatMarkdownContentPartOptions } from './chatMarkdownContentPart.js';
import './media/chatConfirmationWidget.css';

export interface IChatConfirmationButton<T> {
	label: string;
	isSecondary?: boolean;
	tooltip?: string;
	data: T;
	disabled?: boolean;
	readonly onDidChangeDisablement?: Event<boolean>;
	moreActions?: (IChatConfirmationButton<T> | Separator)[];
}

export interface IChatConfirmationWidgetOptions<T> {
	title: string | IMarkdownString;
	message: string | IMarkdownString;
	subtitle?: string | IMarkdownString;
	buttons: IChatConfirmationButton<T>[];
	toolbarData?: { arg: unknown; partType: string; partSource?: string };
}

export class ChatQueryTitlePart extends Disposable {
	private readonly _onDidChangeHeight = this._register(new Emitter<void>());
	public readonly onDidChangeHeight = this._onDidChangeHeight.event;
	private readonly _renderedTitle = this._register(new MutableDisposable<IRenderedMarkdown>());

	public get title() {
		return this._title;
	}

	public set title(value: string | IMarkdownString) {
		this._title = value;

		const next = this._renderer.render(this.toMdString(value), {
			asyncRenderCallback: () => this._onDidChangeHeight.fire(),
		});

		const previousEl = this._renderedTitle.value?.element;
		if (previousEl?.parentElement) {
			previousEl.replaceWith(next.element);
		} else {
			this.element.appendChild(next.element); // unreachable?
		}

		this._renderedTitle.value = next;
	}

	constructor(
		private readonly element: HTMLElement,
		private _title: IMarkdownString | string,
		subtitle: string | IMarkdownString | undefined,
		@IMarkdownRendererService private readonly _renderer: IMarkdownRendererService,
	) {
		super();

		element.classList.add('chat-query-title-part');

		this._renderedTitle.value = _renderer.render(this.toMdString(_title), {
			asyncRenderCallback: () => this._onDidChangeHeight.fire(),
		});
		element.append(this._renderedTitle.value.element);
		if (subtitle) {
			const str = this.toMdString(subtitle);
			const renderedTitle = this._register(_renderer.render(str, {
				asyncRenderCallback: () => this._onDidChangeHeight.fire(),
			}));
			const wrapper = document.createElement('small');
			wrapper.appendChild(renderedTitle.element);
			element.append(wrapper);
		}
	}

	private toMdString(value: string | IMarkdownString) {
		if (typeof value === 'string') {
			return new MarkdownString('', { supportThemeIcons: true }).appendText(value);
		} else {
			return new MarkdownString(value.value, { supportThemeIcons: true, isTrusted: value.isTrusted });
		}
	}
}

abstract class BaseSimpleChatConfirmationWidget<T> extends Disposable {
	private _onDidClick = this._register(new Emitter<IChatConfirmationButton<T>>());
	get onDidClick(): Event<IChatConfirmationButton<T>> { return this._onDidClick.event; }

	protected _onDidChangeHeight = this._register(new Emitter<void>());
	get onDidChangeHeight(): Event<void> { return this._onDidChangeHeight.event; }

	private _domNode: HTMLElement;
	get domNode(): HTMLElement {
		return this._domNode;
	}

	setShowButtons(showButton: boolean): void {
		this.domNode.classList.toggle('hideButtons', !showButton);
	}

	private readonly messageElement: HTMLElement;

	constructor(
		protected readonly context: IChatContentPartRenderContext,
		options: IChatConfirmationWidgetOptions<T>,
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
		@IMarkdownRendererService protected readonly _markdownRendererService: IMarkdownRendererService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		super();

		const { title, subtitle, message, buttons } = options;

		const elements = dom.h('.chat-confirmation-widget-container@container', [
			dom.h('.chat-confirmation-widget@root', [
				dom.h('.chat-confirmation-widget-title@title'),
				dom.h('.chat-confirmation-widget-message-container', [
					dom.h('.chat-confirmation-widget-message@message'),
					dom.h('.chat-buttons-container@buttonsContainer', [
						dom.h('.chat-buttons@buttons'),
						dom.h('.chat-toolbar@toolbar'),
					]),
				]),
			]),
		]);
		configureAccessibilityContainer(elements.container, title, message);
		this._domNode = elements.root;

		const titlePart = this._register(instantiationService.createInstance(
			ChatQueryTitlePart,
			elements.title,
			title,
			subtitle
		));

		this._register(titlePart.onDidChangeHeight(() => this._onDidChangeHeight.fire()));

		this.messageElement = elements.message;

		// Create buttons
		buttons.forEach(buttonData => {
			const buttonOptions: IButtonOptions = { ...defaultButtonStyles, secondary: buttonData.isSecondary, title: buttonData.tooltip, disabled: buttonData.disabled };

			let button: IButton;
			if (buttonData.moreActions) {
				button = new ButtonWithDropdown(elements.buttons, {
					...buttonOptions,
					contextMenuProvider: contextMenuService,
					addPrimaryActionToDropdown: false,
					actions: buttonData.moreActions.map(action => {
						if (action instanceof Separator) {
							return action;
						}
						return this._register(new Action(
							action.label,
							action.label,
							undefined,
							!action.disabled,
							() => {
								this._onDidClick.fire(action);
								return Promise.resolve();
							},
						));
					}),
				});
			} else {
				button = new Button(elements.buttons, buttonOptions);
			}

			this._register(button);
			button.label = buttonData.label;
			this._register(button.onDidClick(() => this._onDidClick.fire(buttonData)));
			if (buttonData.onDidChangeDisablement) {
				this._register(buttonData.onDidChangeDisablement(disabled => button.enabled = !disabled));
			}
		});

		// Create toolbar if actions are provided
		if (options?.toolbarData) {
			const overlay = contextKeyService.createOverlay([
				['chatConfirmationPartType', options.toolbarData.partType],
				['chatConfirmationPartSource', options.toolbarData.partSource],
			]);
			const nestedInsta = this._register(instantiationService.createChild(new ServiceCollection([IContextKeyService, overlay])));
			const toolbar = this._register(nestedInsta.createInstance(
				MenuWorkbenchToolBar,
				elements.toolbar,
				MenuId.ChatConfirmationMenu,
				{
					// buttonConfigProvider: () => ({ showLabel: false, showIcon: true }),
					menuOptions: {
						arg: options.toolbarData.arg,
						shouldForwardArgs: true,
					}
				}
			));

			this._register(toolbar.onDidChangeMenuItems(() => this._onDidChangeHeight.fire()));
		}
	}

	protected renderMessage(element: HTMLElement): void {
		this.messageElement.append(element);
	}
}

/** @deprecated Use ChatConfirmationWidget instead */
export class SimpleChatConfirmationWidget<T> extends BaseSimpleChatConfirmationWidget<T> {
	private _renderedMessage: HTMLElement | undefined;

	constructor(
		context: IChatContentPartRenderContext,
		options: IChatConfirmationWidgetOptions<T>,
		@IInstantiationService instantiationService: IInstantiationService,
		@IMarkdownRendererService markdownRendererService: IMarkdownRendererService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		super(context, options, instantiationService, markdownRendererService, contextMenuService, contextKeyService);
		this.updateMessage(options.message);
	}

	public updateMessage(message: string | IMarkdownString): void {
		this._renderedMessage?.remove();
		const renderedMessage = this._register(this._markdownRendererService.render(
			typeof message === 'string' ? new MarkdownString(message) : message,
			{ asyncRenderCallback: () => this._onDidChangeHeight.fire() }
		));
		this.renderMessage(renderedMessage.element);
		this._renderedMessage = renderedMessage.element;
	}
}

export interface IChatConfirmationWidget2Options<T> {
	title: string | IMarkdownString;
	message: string | IMarkdownString | HTMLElement;
	icon?: ThemeIcon;
	subtitle?: string | IMarkdownString;
	buttons: IChatConfirmationButton<T>[];
	toolbarData?: { arg: unknown; partType: string; partSource?: string };
}

abstract class BaseChatConfirmationWidget<T> extends Disposable {
	private _onDidClick = this._register(new Emitter<IChatConfirmationButton<T>>());
	get onDidClick(): Event<IChatConfirmationButton<T>> { return this._onDidClick.event; }

	protected _onDidChangeHeight = this._register(new Emitter<void>());
	get onDidChangeHeight(): Event<void> { return this._onDidChangeHeight.event; }

	private _domNode: HTMLElement;
	get domNode(): HTMLElement {
		return this._domNode;
	}

	private _buttonsDomNode: HTMLElement;

	setShowButtons(showButton: boolean): void {
		this.domNode.classList.toggle('hideButtons', !showButton);
	}

	private readonly messageElement: HTMLElement;
	private readonly markdownContentPart = this._register(new MutableDisposable<ChatMarkdownContentPart>());

	public get codeblocksPartId() {
		return this.markdownContentPart.value?.codeblocksPartId;
	}

	public get codeblocks() {
		return this.markdownContentPart.value?.codeblocks;
	}

	constructor(
		protected readonly _context: IChatContentPartRenderContext,
		options: IChatConfirmationWidget2Options<T>,
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
		@IMarkdownRendererService protected readonly markdownRendererService: IMarkdownRendererService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IChatMarkdownAnchorService private readonly chatMarkdownAnchorService: IChatMarkdownAnchorService,
	) {
		super();

		const { title, subtitle, message, buttons, icon } = options;

		const elements = dom.h('.chat-confirmation-widget-container@container', [
			dom.h('.chat-confirmation-widget2@root', [
				dom.h('.chat-confirmation-widget-title', [
					dom.h('.chat-title@title'),
					dom.h('.chat-toolbar-container@buttonsContainer', [
						dom.h('.chat-toolbar@toolbar'),
					]),
				]),
				dom.h('.chat-confirmation-widget-message@message'),
				dom.h('.chat-confirmation-widget-buttons', [
					dom.h('.chat-buttons@buttons'),
				]),
			]),]);

		configureAccessibilityContainer(elements.container, title, message);
		this._domNode = elements.root;
		this._buttonsDomNode = elements.buttons;

		const titlePart = this._register(instantiationService.createInstance(
			ChatQueryTitlePart,
			elements.title,
			new MarkdownString(icon ? `$(${icon.id}) ${typeof title === 'string' ? title : title.value}` : typeof title === 'string' ? title : title.value),
			subtitle,
		));

		this._register(titlePart.onDidChangeHeight(() => this._onDidChangeHeight.fire()));

		this.messageElement = elements.message;

		this.updateButtons(buttons);

		// Create toolbar if actions are provided
		if (options?.toolbarData) {
			const overlay = contextKeyService.createOverlay([
				['chatConfirmationPartType', options.toolbarData.partType],
				['chatConfirmationPartSource', options.toolbarData.partSource],
			]);
			const nestedInsta = this._register(instantiationService.createChild(new ServiceCollection([IContextKeyService, overlay])));
			this._register(nestedInsta.createInstance(
				MenuWorkbenchToolBar,
				elements.toolbar,
				MenuId.ChatConfirmationMenu,
				{
					// buttonConfigProvider: () => ({ showLabel: false, showIcon: true }),
					menuOptions: {
						arg: options.toolbarData.arg,
						shouldForwardArgs: true,
					}
				}
			));
		}
	}

	updateButtons(buttons: IChatConfirmationButton<T>[]) {
		while (this._buttonsDomNode.children.length > 0) {
			this._buttonsDomNode.children[0].remove();
		}
		for (const buttonData of buttons) {
			const buttonOptions: IButtonOptions = { ...defaultButtonStyles, secondary: buttonData.isSecondary, title: buttonData.tooltip, disabled: buttonData.disabled };

			let button: IButton;
			if (buttonData.moreActions) {
				button = new ButtonWithDropdown(this._buttonsDomNode, {
					...buttonOptions,
					contextMenuProvider: this.contextMenuService,
					addPrimaryActionToDropdown: false,
					actions: buttonData.moreActions.map(action => {
						if (action instanceof Separator) {
							return action;
						}
						return this._register(new Action(
							action.label,
							action.label,
							undefined,
							!action.disabled,
							() => {
								this._onDidClick.fire(action);
								return Promise.resolve();
							},
						));
					}),
				});
			} else {
				button = new Button(this._buttonsDomNode, buttonOptions);
			}

			this._register(button);
			button.label = buttonData.label;
			this._register(button.onDidClick(() => this._onDidClick.fire(buttonData)));
			if (buttonData.onDidChangeDisablement) {
				this._register(buttonData.onDidChangeDisablement(disabled => button.enabled = !disabled));
			}
		}
	}

	protected renderMessage(element: HTMLElement | IMarkdownString | string): void {
		this.markdownContentPart.clear();

		if (!dom.isHTMLElement(element)) {
			const part = this._register(this.instantiationService.createInstance(ChatMarkdownContentPart,
				{
					kind: 'markdownContent',
					content: typeof element === 'string' ? new MarkdownString().appendMarkdown(element) : element
				},
				this._context,
				this._context.editorPool,
				false,
				this._context.codeBlockStartIndex,
				this.markdownRendererService,
				undefined,
				this._context.currentWidth(),
				this._context.codeBlockModelCollection,
				{
					allowInlineDiffs: true,
					horizontalPadding: 6,
				} satisfies IChatMarkdownContentPartOptions,
			));
			renderFileWidgets(part.domNode, this.instantiationService, this.chatMarkdownAnchorService, this._store);
			this._register(part.onDidChangeHeight(() => this._onDidChangeHeight.fire()));

			this.markdownContentPart.value = part;
			element = part.domNode;
		}

		for (const child of this.messageElement.children) {
			child.remove();
		}
		this.messageElement.append(element);
	}
}
export class ChatConfirmationWidget<T> extends BaseChatConfirmationWidget<T> {
	private _renderedMessage: HTMLElement | undefined;

	constructor(
		context: IChatContentPartRenderContext,
		options: IChatConfirmationWidget2Options<T>,
		@IInstantiationService instantiationService: IInstantiationService,
		@IMarkdownRendererService markdownRendererService: IMarkdownRendererService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IChatMarkdownAnchorService chatMarkdownAnchorService: IChatMarkdownAnchorService,
	) {
		super(context, options, instantiationService, markdownRendererService, contextMenuService, contextKeyService, chatMarkdownAnchorService);
		this.renderMessage(options.message);
	}

	public updateMessage(message: string | IMarkdownString): void {
		this._renderedMessage?.remove();
		const renderedMessage = this._register(this.markdownRendererService.render(
			typeof message === 'string' ? new MarkdownString(message) : message,
			{ asyncRenderCallback: () => this._onDidChangeHeight.fire() }
		));
		this.renderMessage(renderedMessage.element);
		this._renderedMessage = renderedMessage.element;
	}
}
export class ChatCustomConfirmationWidget<T> extends BaseChatConfirmationWidget<T> {
	constructor(
		context: IChatContentPartRenderContext,
		options: IChatConfirmationWidget2Options<T>,
		@IInstantiationService instantiationService: IInstantiationService,
		@IMarkdownRendererService markdownRendererService: IMarkdownRendererService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IChatMarkdownAnchorService chatMarkdownAnchorService: IChatMarkdownAnchorService,
	) {
		super(context, options, instantiationService, markdownRendererService, contextMenuService, contextKeyService, chatMarkdownAnchorService);
		this.renderMessage(options.message);
	}
}

function configureAccessibilityContainer(container: HTMLElement, title: string | IMarkdownString, message?: string | IMarkdownString | HTMLElement): void {
	container.tabIndex = 0;
	const titleAsString = typeof title === 'string' ? title : title.value;
	const messageAsString = typeof message === 'string' ? message : message && 'value' in message ? message.value : message && 'textContent' in message ? message.textContent : '';
	container.setAttribute('aria-label', localize('chat.confirmationWidget.ariaLabel', "Chat Confirmation Dialog {0} {1}", titleAsString, messageAsString));
	container.classList.add('chat-confirmation-widget-container');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatContentCodePools.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatContentCodePools.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IChatRendererDelegate } from '../chatListRenderer.js';
import { ChatEditorOptions } from '../chatOptions.js';
import { CodeBlockPart, CodeCompareBlockPart } from '../codeBlockPart.js';
import { ResourcePool, IDisposableReference } from './chatCollections.js';

export class EditorPool extends Disposable {

	private readonly _pool: ResourcePool<CodeBlockPart>;

	inUse(): Iterable<CodeBlockPart> {
		return this._pool.inUse;
	}

	constructor(
		options: ChatEditorOptions,
		delegate: IChatRendererDelegate,
		overflowWidgetsDomNode: HTMLElement | undefined,
		private readonly isSimpleWidget: boolean = false,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();
		this._pool = this._register(new ResourcePool(() => {
			return instantiationService.createInstance(CodeBlockPart, options, MenuId.ChatCodeBlock, delegate, overflowWidgetsDomNode, this.isSimpleWidget);
		}));
	}

	get(): IDisposableReference<CodeBlockPart> {
		const codeBlock = this._pool.get();
		let stale = false;
		return {
			object: codeBlock,
			isStale: () => stale,
			dispose: () => {
				codeBlock.reset();
				stale = true;
				this._pool.release(codeBlock);
			}
		};
	}
}

export class DiffEditorPool extends Disposable {

	private readonly _pool: ResourcePool<CodeCompareBlockPart>;

	public inUse(): Iterable<CodeCompareBlockPart> {
		return this._pool.inUse;
	}

	constructor(
		options: ChatEditorOptions,
		delegate: IChatRendererDelegate,
		overflowWidgetsDomNode: HTMLElement | undefined,
		private readonly isSimpleWidget: boolean = false,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();
		this._pool = this._register(new ResourcePool(() => {
			return instantiationService.createInstance(CodeCompareBlockPart, options, MenuId.ChatCompareBlock, delegate, overflowWidgetsDomNode, this.isSimpleWidget);
		}));
	}

	get(): IDisposableReference<CodeCompareBlockPart> {
		const codeBlock = this._pool.get();
		let stale = false;
		return {
			object: codeBlock,
			isStale: () => stale,
			dispose: () => {
				codeBlock.reset();
				stale = true;
				this._pool.release(codeBlock);
			}
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatContentParts.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatContentParts.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { ChatTreeItem, IChatCodeBlockInfo } from '../chat.js';
import { IChatRendererContent } from '../../common/chatViewModel.js';
import { CodeBlockModelCollection } from '../../common/codeBlockModelCollection.js';
import { DiffEditorPool, EditorPool } from './chatContentCodePools.js';

export interface IChatContentPart extends IDisposable {
	domNode: HTMLElement | undefined;

	/**
	 * Used to indicate a part's ownership of a code block.
	 */
	codeblocksPartId?: string;

	/**
	 * Codeblocks that were rendered by this part into CodeBlockModelCollection.
	 */
	codeblocks?: IChatCodeBlockInfo[];

	/**
	 * Returns true if the other content is equivalent to what is already rendered in this content part.
	 * Returns false if a rerender is needed.
	 * followingContent is all the content that will be rendered after this content part (to support progress messages' behavior).
	 */
	hasSameContent(other: IChatRendererContent, followingContent: IChatRendererContent[], element: ChatTreeItem): boolean;

	addDisposable?(disposable: IDisposable): void;
}

export interface IChatContentPartRenderContext {
	readonly element: ChatTreeItem;
	readonly elementIndex: number;
	readonly container: HTMLElement;
	readonly content: ReadonlyArray<IChatRendererContent>;
	readonly contentIndex: number;
	readonly preceedingContentParts: ReadonlyArray<IChatContentPart>;
	readonly editorPool: EditorPool;
	readonly codeBlockStartIndex: number;
	readonly diffEditorPool: DiffEditorPool;
	readonly codeBlockModelCollection: CodeBlockModelCollection;
	currentWidth(): number;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatElicitationContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatElicitationContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { IMarkdownString, isMarkdownString, MarkdownString } from '../../../../../base/common/htmlContent.js';
import { Disposable, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun } from '../../../../../base/common/observable.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { IChatProgressRenderableResponseContent } from '../../common/chatModel.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { ElicitationState, IChatElicitationRequest, IChatElicitationRequestSerialized } from '../../common/chatService.js';
import { IChatAccessibilityService } from '../chat.js';
import { AcceptElicitationRequestActionId } from '../actions/chatElicitationActions.js';
import { ChatConfirmationWidget, IChatConfirmationButton } from './chatConfirmationWidget.js';
import { IChatContentPart, IChatContentPartRenderContext } from './chatContentParts.js';
import { IAction } from '../../../../../base/common/actions.js';

export class ChatElicitationContentPart extends Disposable implements IChatContentPart {
	public readonly domNode: HTMLElement;

	private readonly _onDidChangeHeight = this._register(new Emitter<void>());
	public readonly onDidChangeHeight = this._onDidChangeHeight.event;

	private readonly _confirmWidget: ChatConfirmationWidget<unknown>;

	public get codeblocks() {
		return this._confirmWidget.codeblocks;
	}

	public get codeblocksPartId() {
		return this._confirmWidget.codeblocksPartId;
	}

	constructor(
		private readonly elicitation: IChatElicitationRequest | IChatElicitationRequestSerialized,
		context: IChatContentPartRenderContext,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IChatAccessibilityService private readonly chatAccessibilityService: IChatAccessibilityService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
	) {
		super();

		const buttons: IChatConfirmationButton<unknown>[] = [];
		if (elicitation.kind === 'elicitation2') {
			const acceptKeybinding = this.keybindingService.lookupKeybinding(AcceptElicitationRequestActionId);
			const acceptTooltip = acceptKeybinding ? `${elicitation.acceptButtonLabel} (${acceptKeybinding.getLabel()})` : elicitation.acceptButtonLabel;

			buttons.push({
				label: elicitation.acceptButtonLabel,
				tooltip: acceptTooltip,
				data: true,
				moreActions: elicitation.moreActions?.map((action: IAction) => ({
					label: action.label,
					data: action,
					run: action.run
				}))
			});
			if (elicitation.rejectButtonLabel && elicitation.reject) {
				buttons.push({ label: elicitation.rejectButtonLabel, data: false, isSecondary: true });
			}

			this._register(autorun(reader => {
				if (elicitation.isHidden?.read(reader)) {
					this.domNode.remove();
				}
			}));

			const hasElicitationKey = ChatContextKeys.Editing.hasElicitationRequest.bindTo(this.contextKeyService);
			this._register(autorun(reader => {
				hasElicitationKey.set(elicitation.state.read(reader) === ElicitationState.Pending);
			}));
			this._register(toDisposable(() => hasElicitationKey.reset()));

			this.chatAccessibilityService.acceptElicitation(elicitation);
		}

		const confirmationWidget = this._register(this.instantiationService.createInstance(ChatConfirmationWidget, context, {
			title: elicitation.title,
			subtitle: elicitation.subtitle,
			buttons,
			message: this.getMessageToRender(elicitation),
			toolbarData: { partType: 'elicitation', partSource: elicitation.source?.type, arg: elicitation },
		}));
		this._confirmWidget = confirmationWidget;
		confirmationWidget.setShowButtons(elicitation.kind === 'elicitation2' && elicitation.state.get() === ElicitationState.Pending);

		this._register(confirmationWidget.onDidChangeHeight(() => this._onDidChangeHeight.fire()));

		this._register(confirmationWidget.onDidClick(async e => {
			if (elicitation.kind !== 'elicitation2') {
				return;
			}

			let result: boolean | IAction | undefined;
			if (typeof e.data === 'boolean' && e.data === true) {
				result = e.data;
			} else if (e.data && typeof e.data === 'object' && 'run' in e.data && 'label' in e.data) {
				result = e.data as IAction;
			} else {
				result = undefined;
			}
			if (result !== undefined) {
				await elicitation.accept(result);
			} else if (elicitation.reject) {
				await elicitation.reject();
			}

			confirmationWidget.setShowButtons(false);
			confirmationWidget.updateMessage(this.getMessageToRender(elicitation));

			this._onDidChangeHeight.fire();
		}));

		this.domNode = confirmationWidget.domNode;
		this.domNode.tabIndex = 0;
		const messageToRender = this.getMessageToRender(elicitation);
		this.domNode.ariaLabel = elicitation.title + ' ' + (typeof messageToRender === 'string' ? messageToRender : messageToRender.value || '');
	}

	private getMessageToRender(elicitation: IChatElicitationRequest | IChatElicitationRequestSerialized): IMarkdownString | string {
		if (!elicitation.acceptedResult) {
			return elicitation.message;
		}

		const messageMd = isMarkdownString(elicitation.message) ? MarkdownString.lift(elicitation.message) : new MarkdownString(elicitation.message);
		messageMd.appendCodeblock('json', JSON.stringify(elicitation.acceptedResult, null, 2));
		return messageMd;
	}

	hasSameContent(other: IChatProgressRenderableResponseContent): boolean {
		// No other change allowed for this content type
		return other === this.elicitation;
	}

	addDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatErrorConfirmationPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatErrorConfirmationPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { Button, IButtonOptions } from '../../../../../base/browser/ui/button/button.js';
import { Emitter } from '../../../../../base/common/event.js';
import { IMarkdownString } from '../../../../../base/common/htmlContent.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { IMarkdownRenderer } from '../../../../../platform/markdown/browser/markdownRenderer.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { defaultButtonStyles } from '../../../../../platform/theme/browser/defaultStyles.js';
import { ChatErrorLevel, IChatResponseErrorDetailsConfirmationButton, IChatSendRequestOptions, IChatService } from '../../common/chatService.js';
import { assertIsResponseVM, IChatErrorDetailsPart, IChatRendererContent } from '../../common/chatViewModel.js';
import { IChatWidgetService } from '../chat.js';
import { IChatContentPart, IChatContentPartRenderContext } from './chatContentParts.js';
import { ChatErrorWidget } from './chatErrorContentPart.js';

const $ = dom.$;

export class ChatErrorConfirmationContentPart extends Disposable implements IChatContentPart {
	public readonly domNode: HTMLElement;

	private readonly _onDidChangeHeight = this._register(new Emitter<void>());
	public readonly onDidChangeHeight = this._onDidChangeHeight.event;

	constructor(
		kind: ChatErrorLevel,
		content: IMarkdownString,
		private readonly errorDetails: IChatErrorDetailsPart,
		confirmationButtons: IChatResponseErrorDetailsConfirmationButton[],
		renderer: IMarkdownRenderer,
		context: IChatContentPartRenderContext,
		@IInstantiationService instantiationService: IInstantiationService,
		@IChatWidgetService chatWidgetService: IChatWidgetService,
		@IChatService chatService: IChatService,
	) {
		super();

		const element = context.element;
		assertIsResponseVM(element);

		this.domNode = $('.chat-error-confirmation');
		this.domNode.append(this._register(new ChatErrorWidget(kind, content, renderer)).domNode);

		const buttonOptions: IButtonOptions = { ...defaultButtonStyles };

		const buttonContainer = dom.append(this.domNode, $('.chat-buttons-container'));
		confirmationButtons.forEach(buttonData => {
			const button = this._register(new Button(buttonContainer, buttonOptions));
			button.label = buttonData.label;

			this._register(button.onDidClick(async () => {
				const prompt = buttonData.label;
				const options: IChatSendRequestOptions = buttonData.isSecondary ?
					{ rejectedConfirmationData: [buttonData.data] } :
					{ acceptedConfirmationData: [buttonData.data] };
				options.agentId = element.agent?.id;
				options.slashCommand = element.slashCommand?.name;
				options.confirmation = buttonData.label;
				const widget = chatWidgetService.getWidgetBySessionResource(element.sessionResource);
				options.userSelectedModelId = widget?.input.currentLanguageModel;
				Object.assign(options, widget?.getModeRequestOptions());
				if (await chatService.sendRequest(element.sessionResource, prompt, options)) {
					this._onDidChangeHeight.fire();
				}
			}));
		});
	}

	hasSameContent(other: IChatRendererContent): boolean {
		return other.kind === this.errorDetails.kind && other.isLast === this.errorDetails.isLast;
	}

	addDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatErrorContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatErrorContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { renderIcon } from '../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { IMarkdownString } from '../../../../../base/common/htmlContent.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IMarkdownRenderer } from '../../../../../platform/markdown/browser/markdownRenderer.js';
import { ChatErrorLevel } from '../../common/chatService.js';
import { IChatRendererContent } from '../../common/chatViewModel.js';
import { IChatContentPart } from './chatContentParts.js';

const $ = dom.$;

export class ChatErrorContentPart extends Disposable implements IChatContentPart {
	public readonly domNode: HTMLElement;

	constructor(
		kind: ChatErrorLevel,
		content: IMarkdownString,
		private readonly errorDetails: IChatRendererContent,
		renderer: IMarkdownRenderer,
	) {
		super();

		this.domNode = this._register(new ChatErrorWidget(kind, content, renderer)).domNode;
	}

	hasSameContent(other: IChatRendererContent): boolean {
		return other.kind === this.errorDetails.kind;
	}
}

export class ChatErrorWidget extends Disposable {
	public readonly domNode: HTMLElement;

	constructor(
		kind: ChatErrorLevel,
		content: IMarkdownString,
		renderer: IMarkdownRenderer,
	) {
		super();

		this.domNode = $('.chat-notification-widget');
		this.domNode.tabIndex = 0;
		let icon;
		let iconClass;
		switch (kind) {
			case ChatErrorLevel.Warning:
				icon = Codicon.warning;
				iconClass = '.chat-warning-codicon';
				break;
			case ChatErrorLevel.Error:
				icon = Codicon.error;
				iconClass = '.chat-error-codicon';
				break;
			case ChatErrorLevel.Info:
				icon = Codicon.info;
				iconClass = '.chat-info-codicon';
				break;
		}
		this.domNode.appendChild($(iconClass, undefined, renderIcon(icon)));
		const markdownContent = this._register(renderer.render(content));
		this.domNode.appendChild(markdownContent.element);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatExtensionsContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatExtensionsContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/chatExtensionsContent.css';
import * as dom from '../../../../../base/browser/dom.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ExtensionsList, getExtensions } from '../../../extensions/browser/extensionsViewer.js';
import { IExtensionsWorkbenchService } from '../../../extensions/common/extensions.js';
import { IChatExtensionsContent } from '../../common/chatService.js';
import { IChatRendererContent } from '../../common/chatViewModel.js';
import { ChatTreeItem, ChatViewId, IChatCodeBlockInfo } from '../chat.js';
import { IChatContentPart } from './chatContentParts.js';
import { PagedModel } from '../../../../../base/common/paging.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { localize } from '../../../../../nls.js';

export class ChatExtensionsContentPart extends Disposable implements IChatContentPart {
	public readonly domNode: HTMLElement;

	private _onDidChangeHeight = this._register(new Emitter<void>());
	public readonly onDidChangeHeight = this._onDidChangeHeight.event;

	public get codeblocks(): IChatCodeBlockInfo[] {
		return [];
	}

	public get codeblocksPartId(): string | undefined {
		return undefined;
	}

	constructor(
		private readonly extensionsContent: IChatExtensionsContent,
		@IExtensionsWorkbenchService extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();

		this.domNode = dom.$('.chat-extensions-content-part');
		const loadingElement = dom.append(this.domNode, dom.$('.loading-extensions-element'));
		dom.append(loadingElement, dom.$(ThemeIcon.asCSSSelector(ThemeIcon.modify(Codicon.loading, 'spin'))), dom.$('span.loading-message', undefined, localize('chat.extensions.loading', 'Loading extensions...')));

		const extensionsList = dom.append(this.domNode, dom.$('.extensions-list'));
		const list = this._register(instantiationService.createInstance(ExtensionsList, extensionsList, ChatViewId, { alwaysConsumeMouseWheel: false }, { onFocus: Event.None, onBlur: Event.None, filters: {} }));
		getExtensions(extensionsContent.extensions, extensionsWorkbenchService).then(extensions => {
			loadingElement.remove();
			if (this._store.isDisposed) {
				return;
			}
			list.setModel(new PagedModel(extensions));
			list.layout();
			this._onDidChangeHeight.fire();
		});
	}

	hasSameContent(other: IChatRendererContent, followingContent: IChatRendererContent[], element: ChatTreeItem): boolean {
		return other.kind === 'extensions' && other.extensions.length === this.extensionsContent.extensions.length && other.extensions.every(ext => this.extensionsContent.extensions.includes(ext));
	}

	addDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatMarkdownAnchorService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatMarkdownAnchorService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener, isActiveElement } from '../../../../../base/browser/dom.js';
import { Disposable, IDisposable, combinedDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { createDecorator } from '../../../../../platform/instantiation/common/instantiation.js';
import { InlineAnchorWidget } from '../chatInlineAnchorWidget.js';


export const IChatMarkdownAnchorService = createDecorator<IChatMarkdownAnchorService>('chatMarkdownAnchorService');

export interface IChatMarkdownAnchorService {

	readonly _serviceBrand: undefined;

	/**
	 * Returns the currently focused anchor if any
	 */
	readonly lastFocusedAnchor: InlineAnchorWidget | undefined;

	register(widget: InlineAnchorWidget): IDisposable;
}

export class ChatMarkdownAnchorService extends Disposable implements IChatMarkdownAnchorService {

	declare readonly _serviceBrand: undefined;

	private _widgets: InlineAnchorWidget[] = [];
	private _lastFocusedWidget: InlineAnchorWidget | undefined = undefined;

	get lastFocusedAnchor(): InlineAnchorWidget | undefined {
		return this._lastFocusedWidget;
	}

	private setLastFocusedList(widget: InlineAnchorWidget | undefined): void {
		this._lastFocusedWidget = widget;
	}

	register(widget: InlineAnchorWidget): IDisposable {
		if (this._widgets.some(other => other === widget)) {
			throw new Error('Cannot register the same widget multiple times');
		}

		// Keep in our lists list
		this._widgets.push(widget);

		const element = widget.getHTMLElement();

		// Check for currently being focused
		if (isActiveElement(element)) {
			this.setLastFocusedList(widget);
		}

		return combinedDisposable(
			addDisposableListener(element, 'focus', () => this.setLastFocusedList(widget)),
			toDisposable(() => this._widgets.splice(this._widgets.indexOf(widget), 1)),
			addDisposableListener(element, 'blur', () => {
				if (this._lastFocusedWidget === widget) {
					this.setLastFocusedList(undefined);
				}
			}),
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatMarkdownContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatMarkdownContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { allowedMarkdownHtmlAttributes, MarkdownRendererMarkedOptions, type MarkdownRenderOptions } from '../../../../../base/browser/markdownRenderer.js';
import { StandardMouseEvent } from '../../../../../base/browser/mouseEvent.js';
import { status } from '../../../../../base/browser/ui/aria/aria.js';
import { HoverStyle } from '../../../../../base/browser/ui/hover/hover.js';
import { HoverPosition } from '../../../../../base/browser/ui/hover/hoverWidget.js';
import { DomScrollableElement } from '../../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { coalesce } from '../../../../../base/common/arrays.js';
import { findLast } from '../../../../../base/common/arraysFind.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Emitter } from '../../../../../base/common/event.js';
import { Lazy } from '../../../../../base/common/lazy.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun, autorunSelfDisposable, derived } from '../../../../../base/common/observable.js';
import { ScrollbarVisibility } from '../../../../../base/common/scrollable.js';
import { equalsIgnoreCase } from '../../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { URI } from '../../../../../base/common/uri.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { getIconClasses } from '../../../../../editor/common/services/getIconClasses.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { EditDeltaInfo } from '../../../../../editor/common/textModelEditSource.js';
import { localize } from '../../../../../nls.js';
import { getFlatContextMenuActions } from '../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenuService, MenuId } from '../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IOpenEditorOptions, registerOpenEditorListeners } from '../../../../../platform/editor/browser/editor.js';
import { FileKind } from '../../../../../platform/files/common/files.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { IMarkdownRenderer } from '../../../../../platform/markdown/browser/markdownRenderer.js';
import { IEditorService, SIDE_GROUP } from '../../../../services/editor/common/editorService.js';
import { AccessibilityWorkbenchSettingId } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { IAiEditTelemetryService } from '../../../editTelemetry/browser/telemetry/aiEditTelemetry/aiEditTelemetryService.js';
import { MarkedKatexSupport } from '../../../markdown/browser/markedKatexSupport.js';
import { extractCodeblockUrisFromText, IMarkdownVulnerability } from '../../common/annotations.js';
import { IEditSessionEntryDiff } from '../../common/chatEditingService.js';
import { IChatProgressRenderableResponseContent } from '../../common/chatModel.js';
import { IChatMarkdownContent, IChatService, IChatUndoStop } from '../../common/chatService.js';
import { isRequestVM, isResponseVM } from '../../common/chatViewModel.js';
import { CodeBlockEntry, CodeBlockModelCollection } from '../../common/codeBlockModelCollection.js';
import { ChatConfiguration } from '../../common/constants.js';
import { IChatCodeBlockInfo } from '../chat.js';
import { allowedChatMarkdownHtmlTags } from '../chatContentMarkdownRenderer.js';
import { IMarkdownDiffBlockData, MarkdownDiffBlockPart, parseUnifiedDiff } from '../chatDiffBlockPart.js';
import { ChatEditingActionContext } from '../chatEditing/chatEditingActions.js';
import { ChatMarkdownDecorationsRenderer } from '../chatMarkdownDecorationsRenderer.js';
import { CodeBlockPart, ICodeBlockData, ICodeBlockRenderOptions, localFileLanguageId, parseLocalFileData } from '../codeBlockPart.js';
import '../media/chatCodeBlockPill.css';
import { IDisposableReference } from './chatCollections.js';
import { EditorPool } from './chatContentCodePools.js';
import { IChatContentPart, IChatContentPartRenderContext } from './chatContentParts.js';
import { ChatExtensionsContentPart } from './chatExtensionsContentPart.js';
import './media/chatMarkdownPart.css';

const $ = dom.$;

export interface IChatMarkdownContentPartOptions {
	readonly codeBlockRenderOptions?: ICodeBlockRenderOptions;
	readonly allowInlineDiffs?: boolean;
	readonly horizontalPadding?: number;
	readonly accessibilityOptions?: {
		/**
		 * Message to announce to screen readers as a status update if VerboseChatProgressUpdates is enabled.
		 * Will also be used as the aria-label for the container.
		 * */
		statusMessage?: string;
	};
}

interface IMarkdownPartCodeBlockInfo extends IChatCodeBlockInfo {
	isStreamingEdit: boolean;
}

export class ChatMarkdownContentPart extends Disposable implements IChatContentPart {

	private static ID_POOL = 0;

	readonly codeblocksPartId = String(++ChatMarkdownContentPart.ID_POOL);
	readonly domNode: HTMLElement;

	private readonly allRefs: IDisposableReference<CodeBlockPart | CollapsedCodeBlock | MarkdownDiffBlockPart>[] = [];

	private readonly _onDidChangeHeight = this._register(new Emitter<void>());
	readonly onDidChangeHeight = this._onDidChangeHeight.event;

	private readonly _codeblocks: IMarkdownPartCodeBlockInfo[] = [];
	public get codeblocks(): IChatCodeBlockInfo[] {
		return this._codeblocks;
	}

	private readonly mathLayoutParticipants = new Set<() => void>();

	constructor(
		private readonly markdown: IChatMarkdownContent,
		context: IChatContentPartRenderContext,
		private readonly editorPool: EditorPool,
		fillInIncompleteTokens = false,
		codeBlockStartIndex = 0,
		renderer: IMarkdownRenderer,
		markdownRenderOptions: MarkdownRenderOptions | undefined,
		currentWidth: number,
		private readonly codeBlockModelCollection: CodeBlockModelCollection,
		private readonly rendererOptions: IChatMarkdownContentPartOptions,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IAiEditTelemetryService private readonly aiEditTelemetryService: IAiEditTelemetryService,
	) {
		super();

		const element = context.element;
		const inUndoStop = (findLast(context.content, e => e.kind === 'undoStop', context.contentIndex) as IChatUndoStop | undefined)?.id;

		// We release editors in order so that it's more likely that the same editor will
		// be assigned if this element is re-rendered right away, like it often is during
		// progressive rendering
		const orderedDisposablesList: IDisposable[] = [];

		// Need to track the index of the codeblock within the response so it can have a unique ID,
		// and within this part to find it within the codeblocks array
		let globalCodeBlockIndexStart = codeBlockStartIndex;
		let thisPartCodeBlockIndexStart = 0;

		this.domNode = $('div.chat-markdown-part');

		if (this.rendererOptions.accessibilityOptions?.statusMessage) {
			this.domNode.ariaLabel = this.rendererOptions.accessibilityOptions.statusMessage;
			if (configurationService.getValue<boolean>(AccessibilityWorkbenchSettingId.VerboseChatProgressUpdates)) {
				status(this.rendererOptions.accessibilityOptions.statusMessage);
			}
		}

		const enableMath = configurationService.getValue<boolean>(ChatConfiguration.EnableMath);

		const doRenderMarkdown = () => {
			if (this._store.isDisposed) {
				return;
			}

			// TODO: Move katex support into chatMarkdownRenderer
			const markedExtensions = enableMath
				? coalesce([MarkedKatexSupport.getExtension(dom.getWindow(context.container), {
					throwOnError: false
				})])
				: [];

			// Enables github-flavored-markdown + line breaks with single newlines
			// (which matches typical expectations but isn't "proper" in markdown)
			const markedOpts: MarkdownRendererMarkedOptions = {
				gfm: true,
				breaks: true,
			};

			const result = this._register(renderer.render(markdown.content, {
				sanitizerConfig: MarkedKatexSupport.getSanitizerOptions({
					allowedTags: allowedChatMarkdownHtmlTags,
					allowedAttributes: allowedMarkdownHtmlAttributes,
				}),
				fillInIncompleteTokens,
				codeBlockRendererSync: (languageId, text, raw) => {
					const isCodeBlockComplete = !isResponseVM(context.element) || context.element.isComplete || !raw || codeblockHasClosingBackticks(raw);
					if ((!text || (text.startsWith('<vscode_codeblock_uri') && !text.includes('\n'))) && !isCodeBlockComplete) {
						const hideEmptyCodeblock = $('div');
						hideEmptyCodeblock.style.display = 'none';
						return hideEmptyCodeblock;
					}
					if (languageId === 'diff' && raw && this.rendererOptions.allowInlineDiffs) {
						const match = raw.match(/^```diff:(\w+)/);
						if (match && isResponseVM(context.element)) {
							const actualLanguageId = match[1];
							const codeBlockUri = extractCodeblockUrisFromText(text);
							const { before, after } = parseUnifiedDiff(codeBlockUri?.textWithoutResult ?? text);
							const diffData: IMarkdownDiffBlockData = {
								element: context.element,
								codeBlockIndex: globalCodeBlockIndexStart++,
								languageId: actualLanguageId,
								beforeContent: before,
								afterContent: after,
								codeBlockResource: codeBlockUri?.uri,
								isReadOnly: true,
								horizontalPadding: this.rendererOptions.horizontalPadding,
							};
							const diffPart = this.instantiationService.createInstance(MarkdownDiffBlockPart, diffData, context.diffEditorPool, context.currentWidth());
							const ref: IDisposableReference<MarkdownDiffBlockPart> = {
								object: diffPart,
								isStale: () => false,
								dispose: () => diffPart.dispose()
							};
							this.allRefs.push(ref);
							this._register(diffPart.onDidChangeContentHeight(() => this._onDidChangeHeight.fire()));
							orderedDisposablesList.push(ref);
							return diffPart.element;
						}
					}
					if (languageId === 'vscode-extensions') {
						const chatExtensions = this._register(instantiationService.createInstance(ChatExtensionsContentPart, { kind: 'extensions', extensions: text.split(',') }));
						this._register(chatExtensions.onDidChangeHeight(() => this._onDidChangeHeight.fire()));
						return chatExtensions.domNode;
					}
					const globalIndex = globalCodeBlockIndexStart++;
					const thisPartIndex = thisPartCodeBlockIndexStart++;
					let textModel: Promise<ITextModel> | undefined;
					let range: Range | undefined;
					let vulns: readonly IMarkdownVulnerability[] | undefined;
					let codeblockEntry: CodeBlockEntry | undefined;
					if (equalsIgnoreCase(languageId, localFileLanguageId)) {
						try {
							const parsedBody = parseLocalFileData(text);
							range = parsedBody.range && Range.lift(parsedBody.range);
							textModel = this.textModelService.createModelReference(parsedBody.uri).then(ref => ref.object.textEditorModel);
						} catch (e) {
							return $('div');
						}
					} else {
						if (isResponseVM(element) || isRequestVM(element)) {
							const modelEntry = this.codeBlockModelCollection.getOrCreate(element.sessionResource, element, globalIndex);
							const fastUpdateModelEntry = this.codeBlockModelCollection.updateSync(element.sessionResource, element, globalIndex, { text, languageId, isComplete: isCodeBlockComplete });
							vulns = modelEntry.vulns;
							codeblockEntry = fastUpdateModelEntry;
							textModel = modelEntry.model;
						} else {
							textModel = undefined;
						}
					}

					const hideToolbar = isResponseVM(element) && element.errorDetails?.responseIsFiltered;
					const renderOptions = {
						...this.rendererOptions.codeBlockRenderOptions,
					};
					if (hideToolbar !== undefined) {
						renderOptions.hideToolbar = hideToolbar;
					}
					const codeBlockInfo: ICodeBlockData = { languageId, textModel, codeBlockIndex: globalIndex, codeBlockPartIndex: thisPartIndex, element, range, parentContextKeyService: contextKeyService, vulns, codemapperUri: codeblockEntry?.codemapperUri, renderOptions, chatSessionResource: element.sessionResource };

					if (element.isCompleteAddedRequest || !codeblockEntry?.codemapperUri || !codeblockEntry.isEdit) {
						const ref = this.renderCodeBlock(codeBlockInfo, text, isCodeBlockComplete, currentWidth);
						this.allRefs.push(ref);

						// Attach this after updating text/layout of the editor, so it should only be fired when the size updates later (horizontal scrollbar, wrapping)
						// not during a renderElement OR a progressive render (when we will be firing this event anyway at the end of the render)
						this._register(ref.object.onDidChangeContentHeight(() => this._onDidChangeHeight.fire()));

						const ownerMarkdownPartId = this.codeblocksPartId;
						const info: IMarkdownPartCodeBlockInfo = new class implements IMarkdownPartCodeBlockInfo {
							readonly ownerMarkdownPartId = ownerMarkdownPartId;
							readonly codeBlockIndex = globalIndex;
							readonly elementId = element.id;
							readonly chatSessionResource = element.sessionResource;
							readonly languageId = languageId;
							readonly isStreamingEdit = false;
							readonly editDeltaInfo = EditDeltaInfo.fromText(text);
							codemapperUri = undefined; // will be set async
							get uri() {
								// here we must do a getter because the ref.object is rendered
								// async and the uri might be undefined when it's read immediately
								return ref.object.uri;
							}
							readonly uriPromise = textModel?.then(model => model.uri) ?? Promise.resolve(undefined);
							focus() {
								ref.object.focus();
							}
						}();
						this._codeblocks.push(info);
						orderedDisposablesList.push(ref);
						return ref.object.element;
					} else {
						const requestId = isRequestVM(element) ? element.id : element.requestId;
						const ref = this.renderCodeBlockPill(element.sessionResource, requestId, inUndoStop, codeBlockInfo.codemapperUri, this.markdown.fromSubagent);
						if (isResponseVM(codeBlockInfo.element)) {
							// TODO@joyceerhl: remove this code when we change the codeblockUri API to make the URI available synchronously
							this.codeBlockModelCollection.update(codeBlockInfo.element.sessionResource, codeBlockInfo.element, codeBlockInfo.codeBlockIndex, { text, languageId: codeBlockInfo.languageId, isComplete: isCodeBlockComplete }).then((e) => {
								// Update the existing object's codemapperUri
								this._codeblocks[codeBlockInfo.codeBlockPartIndex].codemapperUri = e.codemapperUri;
								this._onDidChangeHeight.fire();
							});
						}
						this.allRefs.push(ref);
						const ownerMarkdownPartId = this.codeblocksPartId;
						const info: IMarkdownPartCodeBlockInfo = new class implements IMarkdownPartCodeBlockInfo {
							readonly ownerMarkdownPartId = ownerMarkdownPartId;
							readonly codeBlockIndex = globalIndex;
							readonly elementId = element.id;
							readonly codemapperUri = codeblockEntry?.codemapperUri;
							readonly chatSessionResource = element.sessionResource;
							readonly isStreamingEdit = !isCodeBlockComplete;
							get uri() {
								return undefined;
							}
							readonly uriPromise = Promise.resolve(undefined);
							focus() {
								return ref.object.element.focus();
							}
							readonly languageId = languageId;
							readonly editDeltaInfo = EditDeltaInfo.fromText(text);
						}();
						this._codeblocks.push(info);
						orderedDisposablesList.push(ref);
						return ref.object.element;
					}
				},
				asyncRenderCallback: () => this._onDidChangeHeight.fire(),
				markedOptions: markedOpts,
				markedExtensions,
				...markdownRenderOptions,
			}, this.domNode));

			// Ideally this would happen earlier, but we need to parse the markdown.
			if (isResponseVM(element) && !element.model.codeBlockInfos && element.model.isComplete) {
				element.model.initializeCodeBlockInfos(this._codeblocks.map(info => {
					return {
						suggestionId: this.aiEditTelemetryService.createSuggestionId({
							presentation: 'codeBlock',
							feature: 'sideBarChat',
							editDeltaInfo: info.editDeltaInfo,
							languageId: info.languageId,
							modeId: element.model.request?.modeInfo?.modeId,
							modelId: element.model.request?.modelId,
							applyCodeBlockSuggestionId: undefined,
							source: undefined,
						})
					};
				}));
			}

			const markdownDecorationsRenderer = instantiationService.createInstance(ChatMarkdownDecorationsRenderer);
			this._register(markdownDecorationsRenderer.walkTreeAndAnnotateReferenceLinks(markdown, result.element));

			const layoutParticipants = new Lazy(() => {
				const observer = new ResizeObserver(() => this.mathLayoutParticipants.forEach(layout => layout()));
				observer.observe(this.domNode);
				this._register(toDisposable(() => observer.disconnect()));
				return this.mathLayoutParticipants;
			});

			// Make katex blocks horizontally scrollable
			// eslint-disable-next-line no-restricted-syntax
			for (const katexBlock of this.domNode.querySelectorAll('.katex-display')) {
				if (!dom.isHTMLElement(katexBlock)) {
					continue;
				}

				const scrollable = new DomScrollableElement(katexBlock.cloneNode(true) as HTMLElement, {
					vertical: ScrollbarVisibility.Hidden,
					horizontal: ScrollbarVisibility.Auto,
				});
				orderedDisposablesList.push(scrollable);
				katexBlock.replaceWith(scrollable.getDomNode());

				layoutParticipants.value.add(() => { scrollable.scanDomNode(); });
				scrollable.scanDomNode();
			}

			orderedDisposablesList.reverse().forEach(d => this._register(d));
		};

		if (enableMath && !MarkedKatexSupport.getExtension(dom.getWindow(context.container))) {
			// Need to load async
			MarkedKatexSupport.loadExtension(dom.getWindow(context.container))
				.catch(e => {
					console.error('Failed to load MarkedKatexSupport extension:', e);
				}).finally(() => {
					doRenderMarkdown();
					if (!this._store.isDisposed) {
						this._onDidChangeHeight.fire();
					}
				});
		} else {
			doRenderMarkdown();
		}
	}

	private renderCodeBlockPill(sessionResource: URI, requestId: string, inUndoStop: string | undefined, codemapperUri: URI | undefined, fromSubagent?: boolean): IDisposableReference<CollapsedCodeBlock> {
		const codeBlock = this.instantiationService.createInstance(CollapsedCodeBlock, sessionResource, requestId, inUndoStop);
		if (codemapperUri) {
			codeBlock.render(codemapperUri, fromSubagent);
		}
		return {
			object: codeBlock,
			isStale: () => false,
			dispose: () => codeBlock.dispose()
		};
	}

	private renderCodeBlock(data: ICodeBlockData, text: string, isComplete: boolean, currentWidth: number): IDisposableReference<CodeBlockPart> {
		const ref = this.editorPool.get();
		const editorInfo = ref.object;
		if (isResponseVM(data.element)) {
			this.codeBlockModelCollection.update(data.element.sessionResource, data.element, data.codeBlockIndex, { text, languageId: data.languageId, isComplete }).then((e) => {
				// Update the existing object's codemapperUri
				this._codeblocks[data.codeBlockPartIndex].codemapperUri = e.codemapperUri;
				this._onDidChangeHeight.fire();
			});
		}

		editorInfo.render(data, currentWidth).then(() => {
			this._onDidChangeHeight.fire();
		});

		return ref;
	}

	hasSameContent(other: IChatProgressRenderableResponseContent): boolean {
		if (other.kind !== 'markdownContent') {
			return false;
		}

		if (other.content.value === this.markdown.content.value) {
			return true;
		}

		// If we are streaming in code shown in an edit pill, do not re-render the entire content as long as it's coming in
		const lastCodeblock = this._codeblocks.at(-1);
		if (lastCodeblock && lastCodeblock.codemapperUri !== undefined && lastCodeblock.isStreamingEdit) {
			return other.content.value.lastIndexOf('```') === this.markdown.content.value.lastIndexOf('```');
		}

		return false;
	}

	layout(width: number): void {
		this.allRefs.forEach((ref, index) => {
			if (ref.object instanceof CodeBlockPart) {
				ref.object.layout(width);
			} else if (ref.object instanceof MarkdownDiffBlockPart) {
				ref.object.layout(width);
			} else if (ref.object instanceof CollapsedCodeBlock) {
				const codeblockModel = this._codeblocks[index];
				if (codeblockModel.codemapperUri && ref.object.uri?.toString() !== codeblockModel.codemapperUri.toString()) {
					ref.object.render(codeblockModel.codemapperUri);
				}
			}
		});

		this.mathLayoutParticipants.forEach(layout => layout());
	}

	addDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}
}

export function codeblockHasClosingBackticks(str: string): boolean {
	str = str.trim();
	return !!str.match(/\n```+$/);
}

export class CollapsedCodeBlock extends Disposable {

	readonly element: HTMLElement;
	private readonly pillElement: HTMLElement;
	private readonly statusIndicatorContainer: HTMLElement;

	private _uri: URI | undefined;
	get uri(): URI | undefined { return this._uri; }

	private readonly hover = this._register(new MutableDisposable());
	private tooltip: string | undefined;

	private currentDiff: IEditSessionEntryDiff | undefined;

	private readonly progressStore = this._store.add(new DisposableStore());

	constructor(
		private readonly sessionResource: URI,
		private readonly requestId: string,
		private readonly inUndoStop: string | undefined,
		@ILabelService private readonly labelService: ILabelService,
		@IEditorService private readonly editorService: IEditorService,
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IMenuService private readonly menuService: IMenuService,
		@IHoverService private readonly hoverService: IHoverService,
		@IChatService private readonly chatService: IChatService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();

		this.element = $('div.chat-codeblock-pill-container');

		this.statusIndicatorContainer = $('div.status-indicator-container');

		this.pillElement = $('.chat-codeblock-pill-widget');
		this.pillElement.tabIndex = 0;
		this.pillElement.classList.add('show-file-icons');
		this.pillElement.role = 'button';

		this.element.appendChild(this.statusIndicatorContainer);
		this.element.appendChild(this.pillElement);

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(registerOpenEditorListeners(this.pillElement, e => this.showDiff(e)));

		this._register(dom.addDisposableListener(this.pillElement, dom.EventType.CONTEXT_MENU, e => {
			const event = new StandardMouseEvent(dom.getWindow(e), e);
			dom.EventHelper.stop(e, true);

			this.contextMenuService.showContextMenu({
				contextKeyService: this.contextKeyService,
				getAnchor: () => event,
				getActions: () => {
					if (!this.uri) {
						return [];
					}

					const menu = this.menuService.getMenuActions(MenuId.ChatEditingCodeBlockContext, this.contextKeyService, {
						arg: {
							sessionResource: this.sessionResource,
							requestId: this.requestId,
							uri: this.uri,
							stopId: this.inUndoStop
						} satisfies ChatEditingActionContext
					});

					return getFlatContextMenuActions(menu);
				},
			});
		}));
	}

	private showDiff({ editorOptions: options, openToSide }: IOpenEditorOptions): void {
		if (this.currentDiff) {
			this.editorService.openEditor({
				original: { resource: this.currentDiff.originalURI },
				modified: { resource: this.currentDiff.modifiedURI },
				options
			}, openToSide ? SIDE_GROUP : undefined);
		} else if (this.uri) {
			this.editorService.openEditor({ resource: this.uri, options }, openToSide ? SIDE_GROUP : undefined);
		}
	}

	/**
	 * @param uri URI of the file on-disk being changed
	 * @param isStreaming Whether the edit has completed (at the time of this being rendered)
	 */
	render(uri: URI, fromSubagent?: boolean): void {
		this.pillElement.classList.toggle('from-sub-agent', !!fromSubagent);

		this.progressStore.clear();

		this._uri = uri;

		const session = this.chatService.getSession(this.sessionResource);
		const iconText = this.labelService.getUriBasenameLabel(uri);

		const statusIconEl = dom.$('span.status-icon');
		const statusLabelEl = dom.$('span.status-label', {}, '');

		this.statusIndicatorContainer.replaceChildren(statusIconEl, statusLabelEl);

		const iconEl = dom.$('span.icon');
		const iconLabelEl = dom.$('span.icon-label', {}, iconText);
		const labelDetail = dom.$('span.label-detail', {}, '');

		// Create a progress fill element for the animation
		const progressFill = dom.$('span.progress-fill');
		this.pillElement.replaceChildren(progressFill, iconEl, iconLabelEl, labelDetail);
		const tooltipLabel = this.labelService.getUriLabel(uri, { relative: true });
		this.updateTooltip(tooltipLabel);

		const editSession = session?.editingSession;
		if (!editSession) {
			return;
		}

		const diffObservable = derived(reader => {
			const entry = editSession.readEntry(uri, reader);
			return entry && editSession.getEntryDiffBetweenStops(entry.modifiedURI, this.requestId, this.inUndoStop);
		}).map((d, r) => d?.read(r));

		const isStreaming = derived(r => {
			const entry = editSession.readEntry(uri, r);
			const currentlyModified = entry?.isCurrentlyBeingModifiedBy.read(r);
			return !!currentlyModified && currentlyModified.responseModel.requestId === this.requestId && currentlyModified.undoStopId === this.inUndoStop;
		});

		// Set the icon/classes while edits are streaming
		let statusIconClasses: string[] = [];
		let pillIconClasses: string[] = [];
		this.progressStore.add(autorun(r => {
			statusIconEl.classList.remove(...statusIconClasses);
			iconEl.classList.remove(...pillIconClasses);
			if (isStreaming.read(r)) {
				const codicon = ThemeIcon.modify(Codicon.loading, 'spin');
				statusIconClasses = ThemeIcon.asClassNameArray(codicon);
				statusIconEl.classList.add(...statusIconClasses);
				const entry = editSession.readEntry(uri, r);
				const rwRatio = Math.floor((entry?.rewriteRatio.read(r) || 0) * 100);
				statusLabelEl.textContent = localize('chat.codeblock.applyingEdits', 'Applying edits');

				const showAnimation = this.configurationService.getValue<boolean>(ChatConfiguration.ShowCodeBlockProgressAnimation);
				if (showAnimation) {
					progressFill.style.width = `${rwRatio}%`;
					this.pillElement.classList.add('progress-filling');
					labelDetail.textContent = '';
				} else {
					progressFill.style.width = '0%';
					this.pillElement.classList.remove('progress-filling');
					labelDetail.textContent = rwRatio === 0 || !rwRatio ? localize('chat.codeblock.generating', "Generating edits...") : localize('chat.codeblock.applyingPercentage', "({0}%)...", rwRatio);
				}
			} else {
				const statusCodeicon = Codicon.check;
				statusIconClasses = ThemeIcon.asClassNameArray(statusCodeicon);
				statusIconEl.classList.add(...statusIconClasses);
				statusLabelEl.textContent = localize('chat.codeblock.edited', 'Edited');
				const fileKind = uri.path.endsWith('/') ? FileKind.FOLDER : FileKind.FILE;
				pillIconClasses = getIconClasses(this.modelService, this.languageService, uri, fileKind);
				iconEl.classList.add(...pillIconClasses);
				this.pillElement.classList.remove('progress-filling');
				progressFill.style.width = '0%';
				labelDetail.textContent = '';
			}
		}));

		// Render the +/- diff
		this.progressStore.add(autorunSelfDisposable(r => {
			const changes = diffObservable.read(r);
			if (changes === undefined) {
				return;
			}

			// eslint-disable-next-line no-restricted-syntax
			const labelAdded = this.pillElement.querySelector('.label-added') ?? this.pillElement.appendChild(dom.$('span.label-added'));
			// eslint-disable-next-line no-restricted-syntax
			const labelRemoved = this.pillElement.querySelector('.label-removed') ?? this.pillElement.appendChild(dom.$('span.label-removed'));
			if (changes && !changes?.identical && !changes?.quitEarly) {
				this.currentDiff = changes;
				labelAdded.textContent = `+${changes.added}`;
				labelRemoved.textContent = `-${changes.removed}`;
				const insertionsFragment = changes.added === 1 ? localize('chat.codeblock.insertions.one', "1 insertion") : localize('chat.codeblock.insertions', "{0} insertions", changes.added);
				const deletionsFragment = changes.removed === 1 ? localize('chat.codeblock.deletions.one', "1 deletion") : localize('chat.codeblock.deletions', "{0} deletions", changes.removed);
				const summary = localize('summary', 'Edited {0}, {1}, {2}', iconText, insertionsFragment, deletionsFragment);
				this.element.ariaLabel = summary;

				// No need to keep updating once we get the diff info
				if (changes.isFinal) {
					r.dispose();
				}
			}
		}));
	}

	private updateTooltip(tooltip: string): void {
		this.tooltip = tooltip;

		if (!this.hover.value) {
			this.hover.value = this.hoverService.setupDelayedHover(this.pillElement, () => ({
				content: this.tooltip!,
				style: HoverStyle.Pointer,
				position: { hoverPosition: HoverPosition.BELOW },
				persistence: { hideOnKeyDown: true },
			}));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatMcpServersInteractionContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatMcpServersInteractionContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { RunOnceScheduler } from '../../../../../base/common/async.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Emitter } from '../../../../../base/common/event.js';
import { escapeMarkdownSyntaxTokens, createMarkdownCommandLink, MarkdownString } from '../../../../../base/common/htmlContent.js';
import { Lazy } from '../../../../../base/common/lazy.js';
import { Disposable, IDisposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun } from '../../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { IMarkdownRendererService, openLinkFromMarkdown } from '../../../../../platform/markdown/browser/markdownRenderer.js';
import { IRenderedMarkdown } from '../../../../../base/browser/markdownRenderer.js';
import { localize } from '../../../../../nls.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { McpCommandIds } from '../../../mcp/common/mcpCommandIds.js';
import { IAutostartResult, IMcpService } from '../../../mcp/common/mcpTypes.js';
import { startServerAndWaitForLiveTools } from '../../../mcp/common/mcpTypesUtils.js';
import { IChatMcpServersStarting } from '../../common/chatService.js';
import { IChatRendererContent, IChatResponseViewModel, isResponseVM } from '../../common/chatViewModel.js';
import { IChatContentPart, IChatContentPartRenderContext } from './chatContentParts.js';
import { ChatProgressContentPart } from './chatProgressContentPart.js';
import './media/chatMcpServersInteractionContent.css';

export class ChatMcpServersInteractionContentPart extends Disposable implements IChatContentPart {
	public readonly domNode: HTMLElement;
	private readonly _onDidChangeHeight = this._register(new Emitter<void>());
	public readonly onDidChangeHeight = this._onDidChangeHeight.event;

	private workingProgressPart: ChatProgressContentPart | undefined;
	private interactionContainer: HTMLElement | undefined;
	private readonly interactionMd = this._register(new MutableDisposable<IRenderedMarkdown>());
	private readonly showSpecificServersScheduler = this._register(new RunOnceScheduler(() => this.updateDetailedProgress(this.data.state!.get()), 2500));
	private readonly previousParts = new Lazy(() => {
		if (!isResponseVM(this.context.element)) {
			return [];
		}

		return this.context.element.session.getItems()
			.filter((r, i): r is IChatResponseViewModel => isResponseVM(r) && i < this.context.elementIndex)
			.flatMap(i => i.response.value.filter(c => c.kind === 'mcpServersStarting'))
			.map(p => p.state?.get());
	});

	constructor(
		private readonly data: IChatMcpServersStarting,
		private readonly context: IChatContentPartRenderContext,
		@IMcpService private readonly mcpService: IMcpService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IOpenerService private readonly _openerService: IOpenerService,
		@IMarkdownRendererService private readonly _markdownRendererService: IMarkdownRendererService,
	) {
		super();

		this.domNode = dom.$('.chat-mcp-servers-interaction');

		// Listen to autostart state changes if available
		if (data.state) {
			this._register(autorun(reader => {
				const state = data.state!.read(reader);
				this.updateForState(state);
			}));
		}
	}

	private updateForState(state: IAutostartResult): void {
		if (!state.working) {
			this.workingProgressPart?.domNode.remove();
			this.workingProgressPart = undefined;
			this.showSpecificServersScheduler.cancel();
		} else if (!this.workingProgressPart) {
			if (!this.showSpecificServersScheduler.isScheduled()) {
				this.showSpecificServersScheduler.schedule();
			}
		} else if (this.workingProgressPart) {
			this.updateDetailedProgress(state);
		}

		const requiringInteraction = state.serversRequiringInteraction.filter(s => {
			// don't note interaction for a server we already started
			if (this.data.didStartServerIds?.includes(s.id)) {
				return false;
			}

			// don't note interaction for a server we previously noted interaction for
			if (this.previousParts.value.some(p => p?.serversRequiringInteraction.some(s2 => s.id === s2.id))) {
				return false;
			}

			return true;
		});

		if (requiringInteraction.length > 0) {
			if (!this.interactionMd.value) {
				this.renderInteractionRequired(requiringInteraction);
			} else {
				this.updateInteractionRequired(this.interactionMd.value.element, requiringInteraction);
			}
		} else if (requiringInteraction.length === 0 && this.interactionContainer) {
			this.interactionContainer.remove();
			this.interactionContainer = undefined;
		}

		this._onDidChangeHeight.fire();
	}

	private createServerCommandLinks(servers: Array<{ id: string; label: string }>): string {
		return servers.map(s => createMarkdownCommandLink({
			title: '`' + escapeMarkdownSyntaxTokens(s.label) + '`',
			id: McpCommandIds.ServerOptions,
			arguments: [s.id],
		}, false)).join(', ');
	}

	private updateDetailedProgress(state: IAutostartResult): void {
		const skipText = createMarkdownCommandLink({
			title: localize('mcp.skip.link', 'Skip?'),
			id: McpCommandIds.SkipCurrentAutostart,
		});

		let content: MarkdownString;
		if (state.starting.length === 0) {
			content = new MarkdownString(undefined, { isTrusted: true }).appendText(localize('mcp.working.mcp', 'Activating MCP extensions...') + ' ').appendMarkdown(skipText);
		} else {
			// Update to show specific server names as command links
			const serverLinks = this.createServerCommandLinks(state.starting);
			content = new MarkdownString(undefined, { isTrusted: true }).appendMarkdown(localize('mcp.starting.servers', 'Starting MCP servers {0}...', serverLinks) + ' ').appendMarkdown(skipText);
		}

		if (this.workingProgressPart) {
			this.workingProgressPart.updateMessage(content);
		} else {
			this.workingProgressPart = this._register(this.instantiationService.createInstance(
				ChatProgressContentPart,
				{ kind: 'progressMessage', content },
				this._markdownRendererService,
				this.context,
				true, // forceShowSpinner
				true, // forceShowMessage
				undefined, // icon
				undefined, // toolInvocation
			));
			this.domNode.appendChild(this.workingProgressPart.domNode);
		}

		this._onDidChangeHeight.fire();
	}

	private renderInteractionRequired(serversRequiringInteraction: Array<{ id: string; label: string; errorMessage?: string }>): void {
		this.interactionContainer = dom.$('.chat-mcp-servers-interaction-hint');

		// Create subtle hint message
		const messageContainer = dom.$('.chat-mcp-servers-message');
		const icon = dom.$('.chat-mcp-servers-icon');
		icon.classList.add(...ThemeIcon.asClassNameArray(Codicon.mcp));

		const { messageMd } = this.createInteractionMessage(serversRequiringInteraction);

		messageContainer.appendChild(icon);
		messageContainer.appendChild(messageMd.element);

		this.interactionContainer.appendChild(messageContainer);
		this.domNode.prepend(this.interactionContainer);
	}

	private updateInteractionRequired(oldElement: HTMLElement, serversRequiringInteraction: Array<{ id: string; label: string; errorMessage?: string }>): void {
		const { messageMd } = this.createInteractionMessage(serversRequiringInteraction);
		oldElement.replaceWith(messageMd.element);
	}

	private createInteractionMessage(serversRequiringInteraction: Array<{ id: string; label: string; errorMessage?: string }>) {
		const count = serversRequiringInteraction.length;
		const links = this.createServerCommandLinks(serversRequiringInteraction);

		const content = count === 1
			? localize('mcp.start.single', 'The MCP server {0} may have new tools and requires interaction to start. [Start it now?]({1})', links, '#start')
			: localize('mcp.start.multiple', 'The MCP servers {0} may have new tools and require interaction to start. [Start them now?]({1})', links, '#start');
		const str = new MarkdownString(content, { isTrusted: true });
		const messageMd = this.interactionMd.value = this._markdownRendererService.render(str, {
			asyncRenderCallback: () => this._onDidChangeHeight.fire(),
			actionHandler: (content) => {
				if (!content.startsWith('command:')) {
					this._start(startLink!);
					return Promise.resolve(true);
				}
				return openLinkFromMarkdown(this._openerService, content, true);
			}
		});

		// eslint-disable-next-line no-restricted-syntax
		const startLink = [...messageMd.element.querySelectorAll('a')].find(a => !a.getAttribute('data-href')?.startsWith('command:'));
		if (!startLink) {
			// Should not happen
			return { messageMd, startLink: undefined };
		}

		startLink.setAttribute('role', 'button');
		startLink.href = '';

		return { messageMd, startLink };
	}

	private async _start(startLink: HTMLElement) {
		// Update to starting state
		startLink.style.pointerEvents = 'none';
		startLink.style.opacity = '0.7';

		try {
			if (!this.data.state) {
				return;
			}

			const state = this.data.state.get();
			const serversToStart = state.serversRequiringInteraction;

			// Start servers in sequence with progress updates
			for (let i = 0; i < serversToStart.length; i++) {
				const serverInfo = serversToStart[i];
				startLink.textContent = localize('mcp.starting', "Starting {0}...", serverInfo.label);
				this._onDidChangeHeight.fire();

				const server = this.mcpService.servers.get().find(s => s.definition.id === serverInfo.id);
				if (server) {
					await startServerAndWaitForLiveTools(server, { promptType: 'all-untrusted' });

					this.data.didStartServerIds ??= [];
					this.data.didStartServerIds.push(serverInfo.id);
				}
			}

			// Remove the interaction container after successful start
			if (this.interactionContainer) {
				this.interactionContainer.remove();
				this.interactionContainer = undefined;
			}
		} catch (error) {
			// Reset link on error
			startLink.style.pointerEvents = '';
			startLink.style.opacity = '';
			startLink.textContent = 'Start now?';
		} finally {
			this._onDidChangeHeight.fire();
		}
	}

	hasSameContent(other: IChatRendererContent): boolean {
		// Simple implementation that checks if it's the same type
		return other.kind === 'mcpServersStarting';
	}

	addDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatMultiDiffContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatMultiDiffContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { ButtonWithIcon } from '../../../../../base/browser/ui/button/button.js';
import { IListRenderer, IListVirtualDelegate } from '../../../../../base/browser/ui/list/list.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { MarshalledId } from '../../../../../base/common/marshallingIds.js';
import { autorun, constObservable, IObservable, isObservable } from '../../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { URI } from '../../../../../base/common/uri.js';
import { localize } from '../../../../../nls.js';
import { MenuWorkbenchToolBar } from '../../../../../platform/actions/browser/toolbar.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { FileKind } from '../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { WorkbenchList } from '../../../../../platform/list/browser/listService.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { IResourceLabel, ResourceLabels } from '../../../../browser/labels.js';
import { ACTIVE_GROUP, IEditorService, SIDE_GROUP } from '../../../../services/editor/common/editorService.js';
import { createFileIconThemableTreeContainerScope } from '../../../files/browser/views/explorerView.js';
import { MultiDiffEditorInput } from '../../../multiDiffEditor/browser/multiDiffEditorInput.js';
import { MultiDiffEditorItem } from '../../../multiDiffEditor/browser/multiDiffSourceResolverService.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { IEditSessionEntryDiff } from '../../common/chatEditingService.js';
import { IChatMultiDiffData, IChatMultiDiffInnerData } from '../../common/chatService.js';
import { getChatSessionType } from '../../common/chatUri.js';
import { IChatRendererContent } from '../../common/chatViewModel.js';
import { ChatTreeItem } from '../chat.js';
import { IChatContentPart } from './chatContentParts.js';

const $ = dom.$;

interface IChatMultiDiffItem {
	uri: URI;
	diff?: IEditSessionEntryDiff;
}

const ELEMENT_HEIGHT = 22;
const MAX_ITEMS_SHOWN = 6;

export class ChatMultiDiffContentPart extends Disposable implements IChatContentPart {
	public readonly domNode: HTMLElement;

	private readonly _onDidChangeHeight = this._register(new Emitter<void>());
	public readonly onDidChangeHeight = this._onDidChangeHeight.event;

	private list!: WorkbenchList<IChatMultiDiffItem>;
	private isCollapsed: boolean = false;
	private readonly readOnly: boolean;
	private readonly diffData: IObservable<IChatMultiDiffInnerData>;

	constructor(
		private readonly content: IChatMultiDiffData,
		private readonly _element: ChatTreeItem,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IEditorService private readonly editorService: IEditorService,
		@IThemeService private readonly themeService: IThemeService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
	) {
		super();

		this.readOnly = content.readOnly ?? false;
		this.diffData = isObservable(this.content.multiDiffData)
			? this.content.multiDiffData.map(d => d)
			: constObservable(this.content.multiDiffData);

		const headerDomNode = $('.checkpoint-file-changes-summary-header');
		this.domNode = $('.checkpoint-file-changes-summary', undefined, headerDomNode);
		this.domNode.tabIndex = 0;
		this.isCollapsed = content?.collapsed ?? false;

		this._register(this.renderHeader(headerDomNode));
		this._register(this.renderFilesList(this.domNode));
	}

	private renderHeader(container: HTMLElement): IDisposable {
		const viewListButtonContainer = container.appendChild($('.chat-file-changes-label'));
		const viewListButton = new ButtonWithIcon(viewListButtonContainer, {});
		this._register(autorun(reader => {
			const fileCount = this.diffData.read(reader).resources.length;
			viewListButton.label = fileCount === 1
				? localize('chatMultiDiff.oneFile', 'Changed 1 file')
				: localize('chatMultiDiff.manyFiles', 'Changed {0} files', fileCount);
		}));

		const setExpansionState = () => {
			viewListButton.icon = this.isCollapsed ? Codicon.chevronRight : Codicon.chevronDown;
			this.domNode.classList.toggle('chat-file-changes-collapsed', this.isCollapsed);
			this._onDidChangeHeight.fire();
		};
		setExpansionState();

		const disposables = new DisposableStore();
		disposables.add(viewListButton);
		disposables.add(viewListButton.onDidClick(() => {
			this.isCollapsed = !this.isCollapsed;
			setExpansionState();
		}));
		if (!this.readOnly) {
			disposables.add(this.renderViewAllFileChangesButton(viewListButton.element));
		}
		disposables.add(this.renderContributedButtons(viewListButton.element));
		return toDisposable(() => disposables.dispose());
	}

	private renderViewAllFileChangesButton(container: HTMLElement): IDisposable {
		const button = container.appendChild($('.chat-view-changes-icon'));
		button.classList.add(...ThemeIcon.asClassNameArray(Codicon.diffMultiple));
		button.title = localize('chatMultiDiff.openAllChanges', 'Open Changes');

		return dom.addDisposableListener(button, 'click', (e) => {
			const source = URI.parse(`multi-diff-editor:${new Date().getMilliseconds().toString() + Math.random().toString()}`);
			const { title, resources } = this.diffData.get();
			const input = this.instantiationService.createInstance(
				MultiDiffEditorInput,
				source,
				title || 'Multi-Diff',
				resources.map(resource => new MultiDiffEditorItem(
					resource.originalUri,
					resource.modifiedUri,
					resource.goToFileUri
				)),
				false
			);
			const sideBySide = e.altKey;
			this.editorService.openEditor(input, sideBySide ? SIDE_GROUP : ACTIVE_GROUP);
			dom.EventHelper.stop(e, true);
		});
	}

	private renderContributedButtons(container: HTMLElement): IDisposable {
		const buttonsContainer = container.appendChild($('.chat-multidiff-contributed-buttons'));
		const disposables = new DisposableStore();

		const type = getChatSessionType(this._element.sessionResource);
		const overlay = this.contextKeyService.createOverlay([
			[ChatContextKeys.agentSessionType.key, type]
		]);
		const nestedInsta = disposables.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, overlay])));

		const marshalledUri = {
			...this._element.sessionResource,
			$mid: MarshalledId.Uri
		};

		const toolbar = disposables.add(nestedInsta.createInstance(
			MenuWorkbenchToolBar,
			buttonsContainer,
			MenuId.ChatMultiDiffContext,
			{
				menuOptions: {
					arg: marshalledUri,
					shouldForwardArgs: true,
				},
				toolbarOptions: {
					primaryGroup: () => true,
				},
			}
		));

		disposables.add(toolbar.onDidChangeMenuItems(() => this._onDidChangeHeight.fire()));

		return disposables;
	}

	private renderFilesList(container: HTMLElement): IDisposable {
		const store = new DisposableStore();

		const listContainer = container.appendChild($('.chat-summary-list'));
		store.add(createFileIconThemableTreeContainerScope(listContainer, this.themeService));
		const resourceLabels = store.add(this.instantiationService.createInstance(ResourceLabels, { onDidChangeVisibility: Event.None }));

		this.list = store.add(this.instantiationService.createInstance(
			WorkbenchList<IChatMultiDiffItem>,
			'ChatMultiDiffList',
			listContainer,
			new ChatMultiDiffListDelegate(),
			[this.instantiationService.createInstance(ChatMultiDiffListRenderer, resourceLabels)],
			{
				identityProvider: {
					getId: (element: IChatMultiDiffItem) => element.uri.toString()
				},
				setRowLineHeight: true,
				horizontalScrolling: false,
				supportDynamicHeights: false,
				mouseSupport: !this.readOnly,
				alwaysConsumeMouseWheel: false,
				accessibilityProvider: {
					getAriaLabel: (element: IChatMultiDiffItem) => element.uri.path,
					getWidgetAriaLabel: () => localize('chatMultiDiffList', "File Changes")
				}
			}
		));

		this._register(autorun(reader => {
			const { resources } = this.diffData.read(reader);

			const items: IChatMultiDiffItem[] = [];
			for (const resource of resources) {
				const uri = resource.modifiedUri || resource.originalUri || resource.goToFileUri;
				if (!uri) {
					continue;
				}

				const item: IChatMultiDiffItem = { uri };

				if (resource.originalUri && resource.modifiedUri) {
					item.diff = {
						originalURI: resource.originalUri,
						modifiedURI: resource.modifiedUri,
						isFinal: true,
						quitEarly: false,
						identical: false,
						added: resource.added || 0,
						removed: resource.removed || 0,
						isBusy: false,
					};
				}
				items.push(item);
			}

			this.list.splice(0, this.list.length, items);

			const height = Math.min(items.length, MAX_ITEMS_SHOWN) * ELEMENT_HEIGHT;
			this.list.layout(height);
			listContainer.style.height = `${height}px`;
			this._onDidChangeHeight.fire();
		}));


		if (!this.readOnly) {
			store.add(this.list.onDidOpen((e) => {
				if (!e.element) {
					return;
				}

				if (e.element.diff) {
					this.editorService.openEditor({
						original: { resource: e.element.diff.originalURI },
						modified: { resource: e.element.diff.modifiedURI },
						options: { preserveFocus: true }
					});
				} else {
					this.editorService.openEditor({
						resource: e.element.uri,
						options: { preserveFocus: true }
					});
				}
			}));
		}

		return store;
	}

	hasSameContent(other: IChatRendererContent): boolean {
		return other.kind === 'multiDiffData' && this.diffData.get().resources.length === (isObservable(other.multiDiffData) ? other.multiDiffData.get().resources.length : other.multiDiffData.resources.length);
	}

	addDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}
}

class ChatMultiDiffListDelegate implements IListVirtualDelegate<IChatMultiDiffItem> {
	getHeight(): number {
		return 22;
	}

	getTemplateId(): string {
		return 'chatMultiDiffItem';
	}
}

interface IChatMultiDiffItemTemplate extends IDisposable {
	readonly label: IResourceLabel;
	changesElement?: HTMLElement;
}

class ChatMultiDiffListRenderer implements IListRenderer<IChatMultiDiffItem, IChatMultiDiffItemTemplate> {
	static readonly TEMPLATE_ID = 'chatMultiDiffItem';
	static readonly CHANGES_SUMMARY_CLASS_NAME = 'insertions-and-deletions';

	readonly templateId: string = ChatMultiDiffListRenderer.TEMPLATE_ID;

	constructor(private labels: ResourceLabels) { }

	renderTemplate(container: HTMLElement): IChatMultiDiffItemTemplate {
		const label = this.labels.create(container, { supportHighlights: true, supportIcons: true });

		return {
			label,
			dispose: () => label.dispose()
		};
	}

	renderElement(element: IChatMultiDiffItem, _index: number, templateData: IChatMultiDiffItemTemplate): void {
		templateData.label.setFile(element.uri, {
			fileKind: FileKind.FILE,
			title: element.uri.path
		});

		const labelElement = templateData.label.element;
		templateData.changesElement?.remove();

		if (element.diff?.added || element.diff?.removed) {
			const changesSummary = labelElement.appendChild($(`.${ChatMultiDiffListRenderer.CHANGES_SUMMARY_CLASS_NAME}`));

			const addedElement = changesSummary.appendChild($('.insertions'));
			addedElement.textContent = `+${element.diff.added}`;

			const removedElement = changesSummary.appendChild($('.deletions'));
			removedElement.textContent = `-${element.diff.removed}`;

			changesSummary.setAttribute('aria-label', localize('chatEditingSession.fileCounts', '{0} lines added, {1} lines removed', element.diff.added, element.diff.removed));

			templateData.changesElement = changesSummary;
		}
	}

	disposeTemplate(templateData: IChatMultiDiffItemTemplate): void {
		templateData.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatProgressContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatProgressContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, append } from '../../../../../base/browser/dom.js';
import { alert } from '../../../../../base/browser/ui/aria/aria.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { createMarkdownCommandLink, MarkdownString, type IMarkdownString } from '../../../../../base/common/htmlContent.js';
import { Disposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { IMarkdownRenderer } from '../../../../../platform/markdown/browser/markdownRenderer.js';
import { IRenderedMarkdown } from '../../../../../base/browser/markdownRenderer.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { localize } from '../../../../../nls.js';
import { IChatProgressMessage, IChatTask, IChatTaskSerialized, IChatToolInvocation, IChatToolInvocationSerialized, ToolConfirmKind } from '../../common/chatService.js';
import { IChatRendererContent, isResponseVM } from '../../common/chatViewModel.js';
import { ChatTreeItem } from '../chat.js';
import { renderFileWidgets } from '../chatInlineAnchorWidget.js';
import { IChatContentPart, IChatContentPartRenderContext } from './chatContentParts.js';
import { IChatMarkdownAnchorService } from './chatMarkdownAnchorService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { AccessibilityWorkbenchSettingId } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { HoverStyle } from '../../../../../base/browser/ui/hover/hover.js';
import { ILanguageModelToolsService } from '../../common/languageModelToolsService.js';

export class ChatProgressContentPart extends Disposable implements IChatContentPart {
	public readonly domNode: HTMLElement;

	private readonly showSpinner: boolean;
	private readonly isHidden: boolean;
	private readonly renderedMessage = this._register(new MutableDisposable<IRenderedMarkdown>());

	constructor(
		progress: IChatProgressMessage | IChatTask | IChatTaskSerialized,
		private readonly chatContentMarkdownRenderer: IMarkdownRenderer,
		context: IChatContentPartRenderContext,
		forceShowSpinner: boolean | undefined,
		forceShowMessage: boolean | undefined,
		icon: ThemeIcon | undefined,
		private readonly toolInvocation: IChatToolInvocation | IChatToolInvocationSerialized | undefined,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IChatMarkdownAnchorService private readonly chatMarkdownAnchorService: IChatMarkdownAnchorService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super();

		const followingContent = context.content.slice(context.contentIndex + 1);
		this.showSpinner = forceShowSpinner ?? shouldShowSpinner(followingContent, context.element);
		this.isHidden = forceShowMessage !== true && followingContent.some(part => part.kind !== 'progressMessage');
		if (this.isHidden) {
			// Placeholder, don't show the progress message
			this.domNode = $('');
			return;
		}

		if (this.showSpinner && !this.configurationService.getValue(AccessibilityWorkbenchSettingId.VerboseChatProgressUpdates)) {
			// TODO@roblourens is this the right place for this?
			// this step is in progress, communicate it to SR users
			alert(progress.content.value);
		}
		const codicon = icon ? icon : this.showSpinner ? ThemeIcon.modify(Codicon.loading, 'spin') : Codicon.check;
		const result = this.chatContentMarkdownRenderer.render(progress.content);
		result.element.classList.add('progress-step');
		renderFileWidgets(result.element, this.instantiationService, this.chatMarkdownAnchorService, this._store);

		const tooltip: IMarkdownString | undefined = this.createApprovalMessage();
		const progressPart = this._register(instantiationService.createInstance(ChatProgressSubPart, result.element, codicon, tooltip));
		this.domNode = progressPart.domNode;
		this.renderedMessage.value = result;
	}

	updateMessage(content: MarkdownString): void {
		if (this.isHidden) {
			return;
		}

		// Render the new message
		const result = this._register(this.chatContentMarkdownRenderer.render(content));
		result.element.classList.add('progress-step');
		renderFileWidgets(result.element, this.instantiationService, this.chatMarkdownAnchorService, this._store);

		// Replace the old message container with the new one
		if (this.renderedMessage.value) {
			this.renderedMessage.value.element.replaceWith(result.element);
		} else {
			this.domNode.appendChild(result.element);
		}

		this.renderedMessage.value = result;
	}

	hasSameContent(other: IChatRendererContent, followingContent: IChatRendererContent[], element: ChatTreeItem): boolean {
		// Progress parts render render until some other content shows up, then they hide.
		// When some other content shows up, need to signal to be rerendered as hidden.
		if (followingContent.some(part => part.kind !== 'progressMessage') && !this.isHidden) {
			return false;
		}

		// Needs rerender when spinner state changes
		const showSpinner = shouldShowSpinner(followingContent, element);
		return other.kind === 'progressMessage' && this.showSpinner === showSpinner;
	}

	private createApprovalMessage(): IMarkdownString | undefined {
		if (!this.toolInvocation) {
			return undefined;
		}

		const reason = IChatToolInvocation.executionConfirmedOrDenied(this.toolInvocation);
		if (!reason || typeof reason === 'boolean') {
			return undefined;
		}

		let md: string;
		switch (reason.type) {
			case ToolConfirmKind.Setting:
				md = localize('chat.autoapprove.setting', 'Auto approved by {0}', createMarkdownCommandLink({ title: '`' + reason.id + '`', id: 'workbench.action.openSettings', arguments: [reason.id] }, false));
				break;
			case ToolConfirmKind.LmServicePerTool:
				md = reason.scope === 'session'
					? localize('chat.autoapprove.lmServicePerTool.session', 'Auto approved for this session')
					: reason.scope === 'workspace'
						? localize('chat.autoapprove.lmServicePerTool.workspace', 'Auto approved for this workspace')
						: localize('chat.autoapprove.lmServicePerTool.profile', 'Auto approved for this profile');
				md += ' (' + createMarkdownCommandLink({ title: localize('edit', 'Edit'), id: 'workbench.action.chat.editToolApproval', arguments: [reason.scope] }) + ')';
				break;
			case ToolConfirmKind.UserAction:
			case ToolConfirmKind.Denied:
			case ToolConfirmKind.ConfirmationNotNeeded:
			default:
				return;
		}

		if (!md) {
			return undefined;
		}

		return new MarkdownString(md, { isTrusted: true });
	}
}

function shouldShowSpinner(followingContent: IChatRendererContent[], element: ChatTreeItem): boolean {
	return isResponseVM(element) && !element.isComplete && followingContent.length === 0;
}


export class ChatProgressSubPart extends Disposable {
	public readonly domNode: HTMLElement;

	constructor(
		messageElement: HTMLElement,
		icon: ThemeIcon,
		tooltip: IMarkdownString | string | undefined,
		@IHoverService hoverService: IHoverService,
	) {
		super();

		this.domNode = $('.progress-container');
		const iconElement = $('div');
		iconElement.classList.add(...ThemeIcon.asClassNameArray(icon));
		if (tooltip) {
			this._register(hoverService.setupDelayedHover(iconElement, {
				content: tooltip,
				style: HoverStyle.Pointer,
			}));
		}
		append(this.domNode, iconElement);

		messageElement.classList.add('progress-step');
		append(this.domNode, messageElement);
	}
}

export class ChatWorkingProgressContentPart extends ChatProgressContentPart implements IChatContentPart {
	constructor(
		_workingProgress: { kind: 'working' },
		chatContentMarkdownRenderer: IMarkdownRenderer,
		context: IChatContentPartRenderContext,
		@IInstantiationService instantiationService: IInstantiationService,
		@IChatMarkdownAnchorService chatMarkdownAnchorService: IChatMarkdownAnchorService,
		@IConfigurationService configurationService: IConfigurationService,
		@ILanguageModelToolsService languageModelToolsService: ILanguageModelToolsService
	) {
		const progressMessage: IChatProgressMessage = {
			kind: 'progressMessage',
			content: new MarkdownString().appendText(localize('workingMessage', "Working..."))
		};
		super(progressMessage, chatContentMarkdownRenderer, context, undefined, undefined, undefined, undefined, instantiationService, chatMarkdownAnchorService, configurationService);
		this._register(languageModelToolsService.onDidPrepareToolCallBecomeUnresponsive(e => {
			if (context.element.sessionId === e.sessionId) {
				this.updateMessage(new MarkdownString(localize('toolCallUnresponsive', "Waiting for tool '{0}' to respond...", e.toolData.displayName)));
			}
		}));
	}

	override hasSameContent(other: IChatRendererContent, followingContent: IChatRendererContent[], element: ChatTreeItem): boolean {
		return other.kind === 'working';
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatPullRequestContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatPullRequestContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/chatPullRequestContent.css';
import * as dom from '../../../../../base/browser/dom.js';
import { Emitter } from '../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { IChatPullRequestContent } from '../../common/chatService.js';
import { IChatRendererContent } from '../../common/chatViewModel.js';
import { ChatTreeItem } from '../chat.js';
import { IChatContentPart } from './chatContentParts.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { localize } from '../../../../../nls.js';
import { addDisposableListener } from '../../../../../base/browser/dom.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { renderAsPlaintext } from '../../../../../base/browser/markdownRenderer.js';

export class ChatPullRequestContentPart extends Disposable implements IChatContentPart {
	public readonly domNode: HTMLElement;

	private _onDidChangeHeight = this._register(new Emitter<void>());
	public readonly onDidChangeHeight = this._onDidChangeHeight.event;

	constructor(
		private readonly pullRequestContent: IChatPullRequestContent,
		@IOpenerService private readonly openerService: IOpenerService
	) {
		super();

		this.domNode = dom.$('.chat-pull-request-content-part');
		const container = dom.append(this.domNode, dom.$('.container'));
		const contentContainer = dom.append(container, dom.$('.content-container'));

		const titleContainer = dom.append(contentContainer, dom.$('.title-container'));
		const icon = dom.append(titleContainer, dom.$('.icon'));
		icon.classList.add(...ThemeIcon.asClassNameArray(Codicon.gitPullRequest));
		const titleElement = dom.append(titleContainer, dom.$('.title'));
		titleElement.textContent = `${this.pullRequestContent.title} - ${this.pullRequestContent.author}`;

		const descriptionElement = dom.append(contentContainer, dom.$('.description'));
		const descriptionWrapper = dom.append(descriptionElement, dom.$('.description-wrapper'));
		const plainText = renderAsPlaintext({ value: this.pullRequestContent.description });
		descriptionWrapper.textContent = plainText;

		const seeMoreContainer = dom.append(descriptionElement, dom.$('.see-more'));
		const seeMore: HTMLAnchorElement = dom.append(seeMoreContainer, dom.$('a'));
		seeMore.textContent = localize('chatPullRequest.seeMore', 'See more');
		this._register(addDisposableListener(seeMore, 'click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.openerService.open(this.pullRequestContent.uri);
		}));
		seeMore.href = this.pullRequestContent.uri.toString();
	}

	hasSameContent(other: IChatRendererContent, followingContent: IChatRendererContent[], element: ChatTreeItem): boolean {
		return other.kind === 'pullRequest';
	}

	addDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatQuotaExceededPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatQuotaExceededPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { Button } from '../../../../../base/browser/ui/button/button.js';
import { WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../../../base/common/actions.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Emitter } from '../../../../../base/common/event.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { assertType } from '../../../../../base/common/types.js';
import { IMarkdownRenderer } from '../../../../../platform/markdown/browser/markdownRenderer.js';
import { localize } from '../../../../../nls.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { defaultButtonStyles } from '../../../../../platform/theme/browser/defaultStyles.js';
import { asCssVariable, textLinkForeground } from '../../../../../platform/theme/common/colorRegistry.js';
import { ChatEntitlement, IChatEntitlementService } from '../../../../services/chat/common/chatEntitlementService.js';
import { IChatErrorDetailsPart, IChatRendererContent, IChatResponseViewModel } from '../../common/chatViewModel.js';
import { IChatWidgetService } from '../chat.js';
import { IChatContentPart } from './chatContentParts.js';

const $ = dom.$;

/**
 * Once the sign up button is clicked, and the retry
 * button has been shown, it should be shown every time.
 */
let shouldShowRetryButton = false;

/**
 * Once the 'retry' button is clicked, the wait warning
 * should be shown every time.
 */
let shouldShowWaitWarning = false;

export class ChatQuotaExceededPart extends Disposable implements IChatContentPart {

	readonly domNode: HTMLElement;

	private readonly _onDidChangeHeight = this._register(new Emitter<void>());
	readonly onDidChangeHeight = this._onDidChangeHeight.event;

	constructor(
		element: IChatResponseViewModel,
		private readonly content: IChatErrorDetailsPart,
		renderer: IMarkdownRenderer,
		@IChatWidgetService chatWidgetService: IChatWidgetService,
		@ICommandService commandService: ICommandService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IChatEntitlementService chatEntitlementService: IChatEntitlementService
	) {
		super();

		const errorDetails = element.errorDetails;
		assertType(!!errorDetails, 'errorDetails');

		this.domNode = $('.chat-quota-error-widget');
		const icon = dom.append(this.domNode, $('span'));
		icon.classList.add(...ThemeIcon.asClassNameArray(Codicon.warning));

		const messageContainer = dom.append(this.domNode, $('.chat-quota-error-message'));
		const markdownContent = this._register(renderer.render(new MarkdownString(errorDetails.message)));
		dom.append(messageContainer, markdownContent.element);

		let primaryButtonLabel: string | undefined;
		switch (chatEntitlementService.entitlement) {
			case ChatEntitlement.Pro:
			case ChatEntitlement.ProPlus:
				primaryButtonLabel = localize('enableAdditionalUsage', "Manage Paid Premium Requests");
				break;
			case ChatEntitlement.Free:
				primaryButtonLabel = localize('upgradeToCopilotPro', "Upgrade to GitHub Copilot Pro");
				break;
		}

		let hasAddedWaitWarning = false;
		const addWaitWarningIfNeeded = () => {
			if (!shouldShowWaitWarning || hasAddedWaitWarning) {
				return;
			}

			hasAddedWaitWarning = true;
			dom.append(messageContainer, $('.chat-quota-wait-warning', undefined, localize('waitWarning', "Changes may take a few minutes to take effect.")));
		};

		let hasAddedRetryButton = false;
		const addRetryButtonIfNeeded = () => {
			if (!shouldShowRetryButton || hasAddedRetryButton) {
				return;
			}

			hasAddedRetryButton = true;
			const retryButton = this._register(new Button(messageContainer, {
				buttonBackground: undefined,
				buttonForeground: asCssVariable(textLinkForeground)
			}));
			retryButton.element.classList.add('chat-quota-error-secondary-button');
			retryButton.label = localize('clickToContinue', "Click to Retry");

			this._onDidChangeHeight.fire();

			this._register(retryButton.onDidClick(() => {
				const widget = chatWidgetService.getWidgetBySessionResource(element.sessionResource);
				if (!widget) {
					return;
				}

				widget.rerunLastRequest();

				shouldShowWaitWarning = true;
				addWaitWarningIfNeeded();
			}));
		};

		if (primaryButtonLabel) {
			const primaryButton = this._register(new Button(messageContainer, { ...defaultButtonStyles, supportIcons: true }));
			primaryButton.label = primaryButtonLabel;
			primaryButton.element.classList.add('chat-quota-error-button');

			this._register(primaryButton.onDidClick(async () => {
				const commandId = chatEntitlementService.entitlement === ChatEntitlement.Free ? 'workbench.action.chat.upgradePlan' : 'workbench.action.chat.manageOverages';
				telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: commandId, from: 'chat-response' });
				await commandService.executeCommand(commandId);

				shouldShowRetryButton = true;
				addRetryButtonIfNeeded();
			}));
		}

		addRetryButtonIfNeeded();
		addWaitWarningIfNeeded();
	}

	hasSameContent(other: IChatRendererContent): boolean {
		return other.kind === this.content.kind && !!other.errorDetails.isQuotaExceeded;
	}

	addDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatReferencesContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatReferencesContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { IListRenderer, IListVirtualDelegate } from '../../../../../base/browser/ui/list/list.js';
import { IListOptions } from '../../../../../base/browser/ui/list/listWidget.js';
import { coalesce } from '../../../../../base/common/arrays.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Event } from '../../../../../base/common/event.js';
import { IMarkdownString } from '../../../../../base/common/htmlContent.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { matchesSomeScheme, Schemas } from '../../../../../base/common/network.js';
import { basename } from '../../../../../base/common/path.js';
import { basenameOrAuthority, isEqualAuthority } from '../../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { URI } from '../../../../../base/common/uri.js';
import { IRange } from '../../../../../editor/common/core/range.js';
import { localize, localize2 } from '../../../../../nls.js';
import { getFlatContextMenuActions } from '../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { MenuWorkbenchToolBar } from '../../../../../platform/actions/browser/toolbar.js';
import { Action2, IMenuService, MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { FileKind } from '../../../../../platform/files/common/files.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { WorkbenchList } from '../../../../../platform/list/browser/listService.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { isDark } from '../../../../../platform/theme/common/theme.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { fillEditorsDragData } from '../../../../browser/dnd.js';
import { IResourceLabel, IResourceLabelProps, ResourceLabels } from '../../../../browser/labels.js';
import { ResourceContextKey } from '../../../../common/contextkeys.js';
import { SETTINGS_AUTHORITY } from '../../../../services/preferences/common/preferences.js';
import { createFileIconThemableTreeContainerScope } from '../../../files/browser/views/explorerView.js';
import { ExplorerFolderContext } from '../../../files/common/files.js';
import { chatEditingWidgetFileStateContextKey, ModifiedFileEntryState } from '../../common/chatEditingService.js';
import { ChatResponseReferencePartStatusKind, IChatContentReference, IChatWarningMessage } from '../../common/chatService.js';
import { IChatRendererContent, IChatResponseViewModel } from '../../common/chatViewModel.js';
import { ChatTreeItem, IChatWidgetService } from '../chat.js';
import { ChatCollapsibleContentPart } from './chatCollapsibleContentPart.js';
import { IDisposableReference, ResourcePool } from './chatCollections.js';
import { IChatContentPartRenderContext } from './chatContentParts.js';

const $ = dom.$;

export interface IChatReferenceListItem extends IChatContentReference {
	title?: string;
	description?: string;
	state?: ModifiedFileEntryState;
	excluded?: boolean;
}

export interface IChatListDividerItem {
	kind: 'divider';
	label: string;
	menuId?: MenuId;
	menuArg?: unknown;
	scopedInstantiationService?: IInstantiationService;
}

export type IChatCollapsibleListItem = IChatReferenceListItem | IChatWarningMessage | IChatListDividerItem;

export class ChatCollapsibleListContentPart extends ChatCollapsibleContentPart {

	constructor(
		private readonly data: ReadonlyArray<IChatCollapsibleListItem>,
		labelOverride: IMarkdownString | string | undefined,
		context: IChatContentPartRenderContext,
		private readonly contentReferencesListPool: CollapsibleListPool,
		@IOpenerService private readonly openerService: IOpenerService,
		@IMenuService private readonly menuService: IMenuService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
	) {
		super(labelOverride ?? (data.length > 1 ?
			localize('usedReferencesPlural', "Used {0} references", data.length) :
			localize('usedReferencesSingular', "Used {0} reference", 1)), context);
	}

	protected override initContent(): HTMLElement {
		const ref = this._register(this.contentReferencesListPool.get());
		const list = ref.object;

		this._register(list.onDidOpen((e) => {
			if (e.element && 'reference' in e.element && typeof e.element.reference === 'object') {
				const uriOrLocation = 'variableName' in e.element.reference ? e.element.reference.value : e.element.reference;
				const uri = URI.isUri(uriOrLocation) ? uriOrLocation :
					uriOrLocation?.uri;
				if (uri) {
					this.openerService.open(
						uri,
						{
							fromUserGesture: true,
							editorOptions: {
								...e.editorOptions,
								...{
									selection: uriOrLocation && 'range' in uriOrLocation ? uriOrLocation.range : undefined
								}
							}
						});
				}
			}
		}));

		this._register(list.onContextMenu(e => {
			dom.EventHelper.stop(e.browserEvent, true);

			const uri = e.element && getResourceForElement(e.element);
			if (!uri) {
				return;
			}

			this.contextMenuService.showContextMenu({
				getAnchor: () => e.anchor,
				getActions: () => {
					const menu = this.menuService.getMenuActions(MenuId.ChatAttachmentsContext, list.contextKeyService, { shouldForwardArgs: true, arg: uri });
					return getFlatContextMenuActions(menu);
				}
			});
		}));

		const resourceContextKey = this._register(this.instantiationService.createInstance(ResourceContextKey));
		this._register(list.onDidChangeFocus(e => {
			resourceContextKey.reset();
			const element = e.elements.length ? e.elements[0] : undefined;
			const uri = element && getResourceForElement(element);
			resourceContextKey.set(uri ?? null);
		}));

		const maxItemsShown = 6;
		const itemsShown = Math.min(this.data.length, maxItemsShown);
		const height = itemsShown * 22;
		list.layout(height);
		list.getHTMLElement().style.height = `${height}px`;
		list.splice(0, list.length, this.data);

		return list.getHTMLElement().parentElement!;
	}

	hasSameContent(other: IChatRendererContent, followingContent: IChatRendererContent[], element: ChatTreeItem): boolean {
		return other.kind === 'references' && other.references.length === this.data.length && (!!followingContent.length === this.hasFollowingContent);
	}
}

export interface IChatUsedReferencesListOptions {
	expandedWhenEmptyResponse?: boolean;
}

export class ChatUsedReferencesListContentPart extends ChatCollapsibleListContentPart {
	constructor(
		data: ReadonlyArray<IChatCollapsibleListItem>,
		labelOverride: IMarkdownString | string | undefined,
		context: IChatContentPartRenderContext,
		contentReferencesListPool: CollapsibleListPool,
		private readonly options: IChatUsedReferencesListOptions,
		@IOpenerService openerService: IOpenerService,
		@IMenuService menuService: IMenuService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextMenuService contextMenuService: IContextMenuService,
	) {
		super(data, labelOverride, context, contentReferencesListPool, openerService, menuService, instantiationService, contextMenuService);
		if (data.length === 0) {
			dom.hide(this.domNode);
		}
	}

	protected override isExpanded(): boolean {
		const element = this.context.element as IChatResponseViewModel;
		return element.usedReferencesExpanded ?? !!(
			this.options.expandedWhenEmptyResponse && element.response.value.length === 0
		);
	}

	protected override setExpanded(value: boolean): void {
		const element = this.context.element as IChatResponseViewModel;
		element.usedReferencesExpanded = !this.isExpanded();
	}
}

export class CollapsibleListPool extends Disposable {
	private _pool: ResourcePool<WorkbenchList<IChatCollapsibleListItem>>;

	public get inUse(): ReadonlySet<WorkbenchList<IChatCollapsibleListItem>> {
		return this._pool.inUse;
	}

	constructor(
		private _onDidChangeVisibility: Event<boolean>,
		private readonly menuId: MenuId | undefined,
		private readonly listOptions: IListOptions<IChatCollapsibleListItem> | undefined,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IThemeService private readonly themeService: IThemeService,
		@ILabelService private readonly labelService: ILabelService,
	) {
		super();
		this._pool = this._register(new ResourcePool(() => this.listFactory()));
	}

	private listFactory(): WorkbenchList<IChatCollapsibleListItem> {
		const resourceLabels = this._register(this.instantiationService.createInstance(ResourceLabels, { onDidChangeVisibility: this._onDidChangeVisibility }));

		const container = $('.chat-used-context-list');
		this._register(createFileIconThemableTreeContainerScope(container, this.themeService));

		const list = this.instantiationService.createInstance(
			WorkbenchList<IChatCollapsibleListItem>,
			'ChatListRenderer',
			container,
			new CollapsibleListDelegate(),
			[this.instantiationService.createInstance(CollapsibleListRenderer, resourceLabels, this.menuId), this.instantiationService.createInstance(DividerRenderer)],
			{
				...this.listOptions,
				alwaysConsumeMouseWheel: false,
				accessibilityProvider: {
					getAriaLabel: (element: IChatCollapsibleListItem) => {
						if (element.kind === 'warning') {
							return element.content.value;
						}
						if (element.kind === 'divider') {
							return element.label;
						}
						const reference = element.reference;
						if (typeof reference === 'string') {
							return reference;
						} else if ('variableName' in reference) {
							return reference.variableName;
						} else if (URI.isUri(reference)) {
							return basename(reference.path);
						} else {
							return basename(reference.uri.path);
						}
					},

					getWidgetAriaLabel: () => localize('chatCollapsibleList', "Collapsible Chat References List")
				},
				dnd: {
					getDragURI: (element: IChatCollapsibleListItem) => getResourceForElement(element)?.toString() ?? null,
					getDragLabel: (elements, originalEvent) => {
						const uris: URI[] = coalesce(elements.map(getResourceForElement));
						if (!uris.length) {
							return undefined;
						} else if (uris.length === 1) {
							return this.labelService.getUriLabel(uris[0], { relative: true });
						} else {
							return `${uris.length}`;
						}
					},
					dispose: () => { },
					onDragOver: () => false,
					drop: () => { },
					onDragStart: (data, originalEvent) => {
						try {
							const elements = data.getData() as IChatCollapsibleListItem[];
							const uris: URI[] = coalesce(elements.map(getResourceForElement));
							this.instantiationService.invokeFunction(accessor => fillEditorsDragData(accessor, uris, originalEvent));
						} catch {
							// noop
						}
					},
				},
			});

		return list;
	}

	get(): IDisposableReference<WorkbenchList<IChatCollapsibleListItem>> {
		const object = this._pool.get();
		let stale = false;
		return {
			object,
			isStale: () => stale,
			dispose: () => {
				stale = true;
				this._pool.release(object);
			}
		};
	}
}

class CollapsibleListDelegate implements IListVirtualDelegate<IChatCollapsibleListItem> {
	getHeight(element: IChatCollapsibleListItem): number {
		return 22;
	}

	getTemplateId(element: IChatCollapsibleListItem): string {
		if (element.kind === 'divider') {
			return DividerRenderer.TEMPLATE_ID;
		}
		return CollapsibleListRenderer.TEMPLATE_ID;
	}
}

interface ICollapsibleListTemplate {
	readonly contextKeyService?: IContextKeyService;
	readonly label: IResourceLabel;
	readonly templateDisposables: DisposableStore;
	toolbar: MenuWorkbenchToolBar | undefined;
	actionBarContainer?: HTMLElement;
	fileDiffsContainer?: HTMLElement;
	addedSpan?: HTMLElement;
	removedSpan?: HTMLElement;
}

class CollapsibleListRenderer implements IListRenderer<IChatCollapsibleListItem, ICollapsibleListTemplate> {
	static TEMPLATE_ID = 'chatCollapsibleListRenderer';
	readonly templateId: string = CollapsibleListRenderer.TEMPLATE_ID;

	constructor(
		private labels: ResourceLabels,
		private menuId: MenuId | undefined,
		@IThemeService private readonly themeService: IThemeService,
		@IProductService private readonly productService: IProductService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
	) { }

	renderTemplate(container: HTMLElement): ICollapsibleListTemplate {
		const templateDisposables = new DisposableStore();
		const label = templateDisposables.add(this.labels.create(container, { supportHighlights: true, supportIcons: true }));

		const fileDiffsContainer = $('.working-set-line-counts');
		const addedSpan = dom.$('.working-set-lines-added');
		const removedSpan = dom.$('.working-set-lines-removed');
		fileDiffsContainer.appendChild(addedSpan);
		fileDiffsContainer.appendChild(removedSpan);
		label.element.appendChild(fileDiffsContainer);

		let toolbar;
		let actionBarContainer;
		let contextKeyService;
		if (this.menuId) {
			actionBarContainer = $('.chat-collapsible-list-action-bar');
			contextKeyService = templateDisposables.add(this.contextKeyService.createScoped(actionBarContainer));
			const scopedInstantiationService = templateDisposables.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, contextKeyService])));
			toolbar = templateDisposables.add(scopedInstantiationService.createInstance(MenuWorkbenchToolBar, actionBarContainer, this.menuId, { menuOptions: { shouldForwardArgs: true, arg: undefined } }));
			label.element.appendChild(actionBarContainer);
		}

		return { templateDisposables, label, toolbar, actionBarContainer, contextKeyService, fileDiffsContainer, addedSpan, removedSpan };
	}


	private getReferenceIcon(data: IChatContentReference): URI | ThemeIcon | undefined {
		if (ThemeIcon.isThemeIcon(data.iconPath)) {
			return data.iconPath;
		} else {
			return isDark(this.themeService.getColorTheme().type) && data.iconPath?.dark
				? data.iconPath?.dark
				: data.iconPath?.light;
		}
	}

	renderElement(data: IChatCollapsibleListItem, index: number, templateData: ICollapsibleListTemplate): void {
		if (data.kind === 'warning') {
			templateData.label.setResource({ name: data.content.value }, { icon: Codicon.warning });
			return;
		}

		if (data.kind === 'divider') {
			// Dividers are handled by DividerRenderer
			return;
		}

		const reference = data.reference;
		const icon = this.getReferenceIcon(data);
		templateData.label.element.style.display = 'flex';
		let arg: URI | undefined;
		if (typeof reference === 'object' && 'variableName' in reference) {
			if (reference.value) {
				const uri = URI.isUri(reference.value) ? reference.value : reference.value.uri;
				templateData.label.setResource(
					{
						resource: uri,
						name: basenameOrAuthority(uri),
						description: `#${reference.variableName}`,
						range: 'range' in reference.value ? reference.value.range : undefined,
					}, { icon, title: data.options?.status?.description ?? data.title });
			} else if (reference.variableName.startsWith('kernelVariable')) {
				const variable = reference.variableName.split(':')[1];
				const asVariableName = `${variable}`;
				const label = `Kernel variable`;
				templateData.label.setLabel(label, asVariableName, { title: data.options?.status?.description });
			} else {
				// Nothing else is expected to fall into here
				templateData.label.setLabel('Unknown variable type');
			}
		} else if (typeof reference === 'string') {
			templateData.label.setLabel(reference, undefined, { iconPath: URI.isUri(icon) ? icon : undefined, title: data.options?.status?.description ?? data.title });

		} else {
			const uri = 'uri' in reference ? reference.uri : reference;
			arg = uri;
			const extraClasses = data.excluded ? ['excluded'] : [];
			if (uri.scheme === 'https' && isEqualAuthority(uri.authority, 'github.com') && uri.path.includes('/tree/')) {
				// Parse a nicer label for GitHub URIs that point at a particular commit + file
				templateData.label.setResource(getResourceLabelForGithubUri(uri), { icon: Codicon.github, title: data.title, strikethrough: data.excluded, extraClasses });
			} else if (uri.scheme === this.productService.urlProtocol && isEqualAuthority(uri.authority, SETTINGS_AUTHORITY)) {
				// a nicer label for settings URIs
				const settingId = uri.path.substring(1);
				templateData.label.setResource({ resource: uri, name: settingId }, { icon: Codicon.settingsGear, title: localize('setting.hover', "Open setting '{0}'", settingId), strikethrough: data.excluded, extraClasses });
			} else if (matchesSomeScheme(uri, Schemas.mailto, Schemas.http, Schemas.https)) {
				templateData.label.setResource({ resource: uri, name: uri.toString(true) }, { icon: icon ?? Codicon.globe, title: data.options?.status?.description ?? data.title ?? uri.toString(true), strikethrough: data.excluded, extraClasses });
			} else {
				templateData.label.setFile(uri, {
					fileKind: FileKind.FILE,
					// Should not have this live-updating data on a historical reference
					fileDecorations: undefined,
					range: 'range' in reference ? reference.range : undefined,
					title: data.options?.status?.description ?? data.title,
					strikethrough: data.excluded,
					extraClasses
				});
			}
		}

		for (const selector of ['.monaco-icon-suffix-container', '.monaco-icon-name-container']) {
			// eslint-disable-next-line no-restricted-syntax
			const element = templateData.label.element.querySelector(selector);
			if (element) {
				if (data.options?.status?.kind === ChatResponseReferencePartStatusKind.Omitted || data.options?.status?.kind === ChatResponseReferencePartStatusKind.Partial) {
					element.classList.add('warning');
				} else {
					element.classList.remove('warning');
				}
			}
		}

		if (data.state !== undefined) {
			if (templateData.actionBarContainer) {
				const diffMeta = data?.options?.diffMeta;
				if (diffMeta) {
					if (!templateData.fileDiffsContainer || !templateData.addedSpan || !templateData.removedSpan) {
						return;
					}
					templateData.addedSpan.textContent = `+${diffMeta.added}`;
					templateData.removedSpan.textContent = `-${diffMeta.removed}`;
					templateData.fileDiffsContainer.setAttribute('aria-label', localize('chatEditingSession.fileCounts', '{0} lines added, {1} lines removed', diffMeta.added, diffMeta.removed));
				}
				// eslint-disable-next-line no-restricted-syntax
				templateData.label.element.querySelector('.monaco-icon-name-container')?.classList.add('modified');
			}
			if (templateData.toolbar) {
				templateData.toolbar.context = arg;
			}
			if (templateData.contextKeyService) {
				if (data.state !== undefined) {
					chatEditingWidgetFileStateContextKey.bindTo(templateData.contextKeyService).set(data.state);
				}
			}
		}
	}

	disposeTemplate(templateData: ICollapsibleListTemplate): void {
		templateData.templateDisposables.dispose();
	}
}

interface IDividerTemplate {
	readonly container: HTMLElement;
	readonly label: HTMLElement;
	readonly line: HTMLElement;
	readonly toolbarContainer: HTMLElement;
	readonly templateDisposables: DisposableStore;
	readonly elementDisposables: DisposableStore;
	toolbar: MenuWorkbenchToolBar | undefined;
}

class DividerRenderer implements IListRenderer<IChatListDividerItem, IDividerTemplate> {
	static TEMPLATE_ID = 'chatListDividerRenderer';
	readonly templateId: string = DividerRenderer.TEMPLATE_ID;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) { }

	renderTemplate(container: HTMLElement): IDividerTemplate {
		const templateDisposables = new DisposableStore();
		const elementDisposables = templateDisposables.add(new DisposableStore());
		container.classList.add('chat-list-divider');
		const label = dom.append(container, dom.$('span.chat-list-divider-label'));
		const line = dom.append(container, dom.$('div.chat-list-divider-line'));
		const toolbarContainer = dom.append(container, dom.$('.chat-list-divider-toolbar'));

		return { container, label, line, toolbarContainer, templateDisposables, elementDisposables, toolbar: undefined };
	}

	renderElement(data: IChatListDividerItem, index: number, templateData: IDividerTemplate): void {
		templateData.label.textContent = data.label;

		// Clear element-specific disposables from previous render
		templateData.elementDisposables.clear();
		templateData.toolbar = undefined;
		dom.clearNode(templateData.toolbarContainer);

		if (data.menuId) {
			const instantiationService = data.scopedInstantiationService || this.instantiationService;
			templateData.toolbar = templateData.elementDisposables.add(instantiationService.createInstance(MenuWorkbenchToolBar, templateData.toolbarContainer, data.menuId, { menuOptions: { arg: data.menuArg } }));
		}
	}

	disposeTemplate(templateData: IDividerTemplate): void {
		templateData.templateDisposables.dispose();
	}
}

function getResourceLabelForGithubUri(uri: URI): IResourceLabelProps {
	const repoPath = uri.path.split('/').slice(1, 3).join('/');
	const filePath = uri.path.split('/').slice(5);
	const fileName = filePath.at(-1);
	const range = getLineRangeFromGithubUri(uri);
	return {
		resource: uri,
		name: fileName ?? filePath.join('/'),
		description: [repoPath, ...filePath.slice(0, -1)].join('/'),
		range
	};
}

function getLineRangeFromGithubUri(uri: URI): IRange | undefined {
	if (!uri.fragment) {
		return undefined;
	}

	// Extract the line range from the fragment
	// Github line ranges are 1-based
	const match = uri.fragment.match(/\bL(\d+)(?:-L(\d+))?/);
	if (!match) {
		return undefined;
	}

	const startLine = parseInt(match[1]);
	if (isNaN(startLine)) {
		return undefined;
	}

	const endLine = match[2] ? parseInt(match[2]) : startLine;
	if (isNaN(endLine)) {
		return undefined;
	}

	return {
		startLineNumber: startLine,
		startColumn: 1,
		endLineNumber: endLine,
		endColumn: 1
	};
}

function getResourceForElement(element: IChatCollapsibleListItem): URI | null {
	if (element.kind === 'warning' || element.kind === 'divider') {
		return null;
	}
	const { reference } = element;
	if (typeof reference === 'string' || 'variableName' in reference) {
		return null;
	} else if (URI.isUri(reference)) {
		return reference;
	} else {
		return reference.uri;
	}
}

//#region Resource context menu

registerAction2(class AddToChatAction extends Action2 {

	static readonly id = 'workbench.action.chat.addToChatAction';

	constructor() {
		super({
			id: AddToChatAction.id,
			title: {
				...localize2('addToChat', "Add File to Chat"),
			},
			f1: false,
			menu: [{
				id: MenuId.ChatAttachmentsContext,
				group: 'chat',
				order: 1,
				when: ContextKeyExpr.and(ResourceContextKey.IsFileSystemResource, ExplorerFolderContext.negate()),
			}]
		});
	}

	override async run(accessor: ServicesAccessor, resource: URI): Promise<void> {
		const chatWidgetService = accessor.get(IChatWidgetService);
		if (!resource) {
			return;
		}

		const widget = chatWidgetService.lastFocusedWidget;
		if (widget) {
			widget.attachmentModel.addFile(resource);
		}
	}
});

registerAction2(class OpenChatReferenceLinkAction extends Action2 {

	static readonly id = 'workbench.action.chat.copyLink';

	constructor() {
		super({
			id: OpenChatReferenceLinkAction.id,
			title: {
				...localize2('copyLink', "Copy Link"),
			},
			f1: false,
			menu: [{
				id: MenuId.ChatAttachmentsContext,
				group: 'chat',
				order: 0,
				when: ContextKeyExpr.or(ResourceContextKey.Scheme.isEqualTo(Schemas.http), ResourceContextKey.Scheme.isEqualTo(Schemas.https)),
			}]
		});
	}

	override async run(accessor: ServicesAccessor, resource: URI): Promise<void> {
		await accessor.get(IClipboardService).writeResources([resource]);
	}
});

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatSuggestNextWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatSuggestNextWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { Action } from '../../../../../base/common/actions.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { localize } from '../../../../../nls.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IChatMode } from '../../common/chatModes.js';
import { IChatSessionsService } from '../../common/chatSessionsService.js';
import { IHandOff } from '../../common/promptSyntax/promptFileParser.js';
import { AgentSessionProviders, getAgentSessionProviderIcon, getAgentSessionProviderName } from '../agentSessions/agentSessions.js';

export interface INextPromptSelection {
	readonly handoff: IHandOff;
	readonly agentId?: string;
}

export class ChatSuggestNextWidget extends Disposable {
	public readonly domNode: HTMLElement;

	private readonly _onDidChangeHeight = this._register(new Emitter<void>());
	public readonly onDidChangeHeight: Event<void> = this._onDidChangeHeight.event;

	private readonly _onDidSelectPrompt = this._register(new Emitter<INextPromptSelection>());
	public readonly onDidSelectPrompt: Event<INextPromptSelection> = this._onDidSelectPrompt.event;

	private promptsContainer!: HTMLElement;
	private titleElement!: HTMLElement;
	private _currentMode: IChatMode | undefined;
	private buttonDisposables = new Map<HTMLElement, DisposableStore>();

	constructor(
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IChatSessionsService private readonly chatSessionsService: IChatSessionsService
	) {
		super();
		this.domNode = this.createSuggestNextWidget();
	}

	public get height(): number {
		return this.domNode.style.display === 'none' ? 0 : this.domNode.offsetHeight;
	}

	public getCurrentMode(): IChatMode | undefined {
		return this._currentMode;
	}

	private createSuggestNextWidget(): HTMLElement {
		// Reuse welcome view classes for consistent styling
		const container = dom.$('.chat-suggest-next-widget.chat-welcome-view-suggested-prompts');
		container.style.display = 'none';

		// Title element using welcome view class
		this.titleElement = dom.append(container, dom.$('.chat-welcome-view-suggested-prompts-title'));

		// Container for prompt buttons
		this.promptsContainer = container;

		return container;
	}

	public render(mode: IChatMode): void {
		const handoffs = mode.handOffs?.get();

		if (!handoffs || handoffs.length === 0) {
			this.hide();
			return;
		}

		this._currentMode = mode;

		// Update title with mode name: "Proceed from {Mode}"
		const modeName = mode.name.get() || mode.label.get() || localize('chat.currentMode', 'current mode');
		this.titleElement.textContent = localize('chat.proceedFrom', 'Proceed from {0}', modeName);

		// Clear existing prompt buttons (keep title which is first child)
		const childrenToRemove: HTMLElement[] = [];
		for (let i = 1; i < this.promptsContainer.children.length; i++) {
			childrenToRemove.push(this.promptsContainer.children[i] as HTMLElement);
		}
		for (const child of childrenToRemove) {
			const disposables = this.buttonDisposables.get(child);
			if (disposables) {
				disposables.dispose();
				this.buttonDisposables.delete(child);
			}
			this.promptsContainer.removeChild(child);
		}

		for (const handoff of handoffs) {
			const promptButton = this.createPromptButton(handoff);
			this.promptsContainer.appendChild(promptButton);
		}

		this.domNode.style.display = 'flex';
		this._onDidChangeHeight.fire();
	}

	private createPromptButton(handoff: IHandOff): HTMLElement {
		const disposables = new DisposableStore();

		const button = dom.$('.chat-welcome-view-suggested-prompt');
		button.setAttribute('tabindex', '0');
		button.setAttribute('role', 'button');
		button.setAttribute('aria-label', localize('chat.suggestNext.item', '{0}', handoff.label));

		const titleElement = dom.append(button, dom.$('.chat-welcome-view-suggested-prompt-title'));
		titleElement.textContent = handoff.label;

		// Optional showContinueOn behaves like send: only present if specified
		const showContinueOn = handoff.showContinueOn ?? true;

		// Get chat session contributions to show in chevron dropdown
		const contributions = this.chatSessionsService.getAllChatSessionContributions();
		const availableContributions = contributions.filter(c => c.canDelegate);

		if (showContinueOn && availableContributions.length > 0) {
			button.classList.add('chat-suggest-next-has-dropdown');
			// Create a dropdown container that wraps separator and chevron for a larger hit area
			const dropdownContainer = dom.append(button, dom.$('.chat-suggest-next-dropdown'));
			dropdownContainer.setAttribute('tabindex', '0');
			dropdownContainer.setAttribute('role', 'button');
			dropdownContainer.setAttribute('aria-label', localize('chat.suggestNext.moreOptions', 'More options for {0}', handoff.label));
			dropdownContainer.setAttribute('aria-haspopup', 'true');

			const separator = dom.append(dropdownContainer, dom.$('.chat-suggest-next-separator'));
			separator.setAttribute('aria-hidden', 'true');
			const chevron = dom.append(dropdownContainer, dom.$('.codicon.codicon-chevron-down.dropdown-chevron'));
			chevron.setAttribute('aria-hidden', 'true');

			const showContextMenu = (e: MouseEvent | KeyboardEvent, anchor?: HTMLElement) => {
				e.preventDefault();
				e.stopPropagation();

				const actions = availableContributions.map(contrib => {
					const provider = contrib.type === AgentSessionProviders.Background ? AgentSessionProviders.Background : AgentSessionProviders.Cloud;
					const icon = getAgentSessionProviderIcon(provider);
					const name = getAgentSessionProviderName(provider);
					return new Action(
						contrib.type,
						localize('continueIn', "Continue in {0}", name),
						ThemeIcon.isThemeIcon(icon) ? ThemeIcon.asClassName(icon) : undefined,
						true,
						() => {
							this._onDidSelectPrompt.fire({ handoff, agentId: contrib.name });
						}
					);
				});

				this.contextMenuService.showContextMenu({
					getAnchor: () => anchor || dropdownContainer,
					getActions: () => actions,
					autoSelectFirstItem: true,
				});
			};

			disposables.add(dom.addDisposableListener(dropdownContainer, 'click', (e: MouseEvent) => {
				showContextMenu(e, dropdownContainer);
			}));

			disposables.add(dom.addDisposableListener(dropdownContainer, 'keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					showContextMenu(e, dropdownContainer);
				}
			}));
			disposables.add(dom.addDisposableListener(button, 'click', (e: MouseEvent) => {
				if (dom.isHTMLElement(e.target) && e.target.closest('.chat-suggest-next-dropdown')) {
					return;
				}
				this._onDidSelectPrompt.fire({ handoff });
			}));
		} else {
			disposables.add(dom.addDisposableListener(button, 'click', () => {
				this._onDidSelectPrompt.fire({ handoff });
			}));
		}

		disposables.add(dom.addDisposableListener(button, 'keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				this._onDidSelectPrompt.fire({ handoff });
			}
		}));

		// Store disposables for this button so they can be disposed when the button is removed
		this.buttonDisposables.set(button, disposables);

		return button;
	}

	public hide(): void {
		if (this.domNode.style.display !== 'none') {
			this._currentMode = undefined;
			this.domNode.style.display = 'none';
			this._onDidChangeHeight.fire();
		}
	}

	public override dispose(): void {
		// Dispose all button disposables
		for (const disposables of this.buttonDisposables.values()) {
			disposables.dispose();
		}
		this.buttonDisposables.clear();
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatTaskContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatTaskContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { Event } from '../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { IMarkdownRenderer } from '../../../../../platform/markdown/browser/markdownRenderer.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IChatProgressRenderableResponseContent } from '../../common/chatModel.js';
import { IChatTask, IChatTaskSerialized } from '../../common/chatService.js';
import { IChatContentPart, IChatContentPartRenderContext } from './chatContentParts.js';
import { ChatProgressContentPart } from './chatProgressContentPart.js';
import { ChatCollapsibleListContentPart, CollapsibleListPool } from './chatReferencesContentPart.js';

export class ChatTaskContentPart extends Disposable implements IChatContentPart {
	public readonly domNode: HTMLElement;
	public readonly onDidChangeHeight: Event<void>;

	private isSettled: boolean;

	constructor(
		private readonly task: IChatTask | IChatTaskSerialized,
		contentReferencesListPool: CollapsibleListPool,
		chatContentMarkdownRenderer: IMarkdownRenderer,
		context: IChatContentPartRenderContext,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();

		if (task.progress.length) {
			this.isSettled = true;
			const refsPart = this._register(instantiationService.createInstance(ChatCollapsibleListContentPart, task.progress, task.content.value, context, contentReferencesListPool));
			this.domNode = dom.$('.chat-progress-task');
			this.domNode.appendChild(refsPart.domNode);
			this.onDidChangeHeight = refsPart.onDidChangeHeight;
		} else {
			const isSettled = task.kind === 'progressTask' ?
				task.isSettled() :
				true;
			this.isSettled = isSettled;
			const showSpinner = !isSettled && !context.element.isComplete;
			const progressPart = this._register(instantiationService.createInstance(ChatProgressContentPart, task, chatContentMarkdownRenderer, context, showSpinner, true, undefined, undefined));
			this.domNode = progressPart.domNode;
			this.onDidChangeHeight = Event.None;
		}
	}

	hasSameContent(other: IChatProgressRenderableResponseContent): boolean {
		if (
			other.kind === 'progressTask' &&
			this.task.kind === 'progressTask' &&
			other.isSettled() !== this.isSettled
		) {
			return false;
		}

		return other.kind === this.task.kind &&
			other.progress.length === this.task.progress.length;
	}

	addDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatTextEditContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatTextEditContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, IDisposable, IReference, RefCountedDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { assertType } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { ISingleEditOperation } from '../../../../../editor/common/core/editOperation.js';
import { TextEdit } from '../../../../../editor/common/languages.js';
import { createTextBufferFactoryFromSnapshot } from '../../../../../editor/common/model/textModel.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { DefaultModelSHA1Computer } from '../../../../../editor/common/services/modelService.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { localize } from '../../../../../nls.js';
import { InstantiationType, registerSingleton } from '../../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../../platform/instantiation/common/instantiation.js';
import { IChatProgressRenderableResponseContent, IChatTextEditGroup } from '../../common/chatModel.js';
import { IChatService } from '../../common/chatService.js';
import { IChatResponseViewModel, isResponseVM } from '../../common/chatViewModel.js';
import { IChatListItemRendererOptions } from '../chat.js';
import { CodeCompareBlockPart, ICodeCompareBlockData, ICodeCompareBlockDiffData } from '../codeBlockPart.js';
import { IDisposableReference } from './chatCollections.js';
import { DiffEditorPool } from './chatContentCodePools.js';
import { IChatContentPart, IChatContentPartRenderContext } from './chatContentParts.js';

const $ = dom.$;

const ICodeCompareModelService = createDecorator<ICodeCompareModelService>('ICodeCompareModelService');

interface ICodeCompareModelService {
	_serviceBrand: undefined;
	createModel(response: IChatResponseViewModel, chatTextEdit: IChatTextEditGroup): Promise<IReference<{ originalSha1: string; original: IResolvedTextEditorModel; modified: IResolvedTextEditorModel }>>;
}

export class ChatTextEditContentPart extends Disposable implements IChatContentPart {
	public readonly domNode: HTMLElement;
	private readonly comparePart: IDisposableReference<CodeCompareBlockPart> | undefined;

	private readonly _onDidChangeHeight = this._register(new Emitter<void>());
	public readonly onDidChangeHeight = this._onDidChangeHeight.event;

	constructor(
		chatTextEdit: IChatTextEditGroup,
		context: IChatContentPartRenderContext,
		rendererOptions: IChatListItemRendererOptions,
		diffEditorPool: DiffEditorPool,
		currentWidth: number,
		@ICodeCompareModelService private readonly codeCompareModelService: ICodeCompareModelService
	) {
		super();
		const element = context.element;

		assertType(isResponseVM(element));

		// TODO@jrieken move this into the CompareCodeBlock and properly say what kind of changes happen
		if (rendererOptions.renderTextEditsAsSummary?.(chatTextEdit.uri)) {
			if (element.response.value.every(item => item.kind === 'textEditGroup')) {
				this.domNode = $('.interactive-edits-summary', undefined, !element.isComplete
					? ''
					: element.isCanceled
						? localize('edits0', "Making changes was aborted.")
						: localize('editsSummary', "Made changes."));
			} else {
				this.domNode = $('div');
			}

			// TODO@roblourens this case is now handled outside this Part in ChatListRenderer, but can it be cleaned up?
			// return;
		} else {


			const cts = new CancellationTokenSource();

			let isDisposed = false;
			this._register(toDisposable(() => {
				isDisposed = true;
				cts.dispose(true);
			}));

			this.comparePart = this._register(diffEditorPool.get());

			// Attach this after updating text/layout of the editor, so it should only be fired when the size updates later (horizontal scrollbar, wrapping)
			// not during a renderElement OR a progressive render (when we will be firing this event anyway at the end of the render)
			this._register(this.comparePart.object.onDidChangeContentHeight(() => {
				this._onDidChangeHeight.fire();
			}));

			const data: ICodeCompareBlockData = {
				element,
				edit: chatTextEdit,
				diffData: (async () => {

					const ref = await this.codeCompareModelService.createModel(element, chatTextEdit);

					if (isDisposed) {
						ref.dispose();
						return;
					}

					this._register(ref);

					return {
						modified: ref.object.modified.textEditorModel,
						original: ref.object.original.textEditorModel,
						originalSha1: ref.object.originalSha1
					} satisfies ICodeCompareBlockDiffData;
				})()
			};
			this.comparePart.object.render(data, currentWidth, cts.token);

			this.domNode = this.comparePart.object.element;
		}
	}

	layout(width: number): void {
		this.comparePart?.object.layout(width);
	}

	hasSameContent(other: IChatProgressRenderableResponseContent): boolean {
		// No other change allowed for this content type
		return other.kind === 'textEditGroup';
	}

	addDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}
}

class CodeCompareModelService implements ICodeCompareModelService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@ITextModelService private readonly textModelService: ITextModelService,
		@IModelService private readonly modelService: IModelService,
		@IChatService private readonly chatService: IChatService,
	) { }

	async createModel(element: IChatResponseViewModel, chatTextEdit: IChatTextEditGroup): Promise<IReference<{ originalSha1: string; original: IResolvedTextEditorModel; modified: IResolvedTextEditorModel }>> {

		const original = await this.textModelService.createModelReference(chatTextEdit.uri);

		const modified = await this.textModelService.createModelReference((this.modelService.createModel(
			createTextBufferFactoryFromSnapshot(original.object.textEditorModel.createSnapshot()),
			{ languageId: original.object.textEditorModel.getLanguageId(), onDidChange: Event.None },
			URI.from({ scheme: Schemas.vscodeChatCodeBlock, path: chatTextEdit.uri.path, query: generateUuid() }),
			false
		)).uri);

		const d = new RefCountedDisposable(toDisposable(() => {
			original.dispose();
			modified.dispose();
		}));

		// compute the sha1 of the original model
		let originalSha1: string = '';
		if (chatTextEdit.state) {
			originalSha1 = chatTextEdit.state.sha1;
		} else {
			const sha1 = new DefaultModelSHA1Computer();
			if (sha1.canComputeSHA1(original.object.textEditorModel)) {
				originalSha1 = sha1.computeSHA1(original.object.textEditorModel);
				chatTextEdit.state = { sha1: originalSha1, applied: 0 };
			}
		}

		// apply edits to the "modified" model
		const chatModel = this.chatService.getSession(element.sessionResource)!;
		const editGroups: ISingleEditOperation[][] = [];
		for (const request of chatModel.getRequests()) {
			if (!request.response) {
				continue;
			}
			for (const item of request.response.response.value) {
				if (item.kind !== 'textEditGroup' || item.state?.applied || !isEqual(item.uri, chatTextEdit.uri)) {
					continue;
				}
				for (const group of item.edits) {
					const edits = group.map(TextEdit.asEditOperation);
					editGroups.push(edits);
				}
			}
			if (request.response === element.model) {
				break;
			}
		}
		for (const edits of editGroups) {
			modified.object.textEditorModel.pushEditOperations(null, edits, () => null);
		}

		// self-acquire a reference to diff models for a short while
		// because streaming usually means we will be using the original-model
		// repeatedly and thereby also should reuse the modified-model and just
		// update it with more edits
		d.acquire();
		setTimeout(() => d.release(), 5000);

		return {
			object: {
				originalSha1,
				original: original.object,
				modified: modified.object
			},
			dispose() {
				d.release();
			},
		};
	}
}

registerSingleton(ICodeCompareModelService, CodeCompareModelService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

````
