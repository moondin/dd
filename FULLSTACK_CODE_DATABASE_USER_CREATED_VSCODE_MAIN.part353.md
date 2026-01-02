---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 353
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 353 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatThinkingContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatThinkingContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, clearNode } from '../../../../../base/browser/dom.js';
import { IChatThinkingPart, IChatToolInvocation, IChatToolInvocationSerialized } from '../../common/chatService.js';
import { IChatContentPartRenderContext, IChatContentPart } from './chatContentParts.js';
import { IChatRendererContent } from '../../common/chatViewModel.js';
import { ChatConfiguration, ThinkingDisplayMode } from '../../common/constants.js';
import { ChatTreeItem } from '../chat.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { IRenderedMarkdown } from '../../../../../base/browser/markdownRenderer.js';
import { IMarkdownRenderer } from '../../../../../platform/markdown/browser/markdownRenderer.js';
import { ChatCollapsibleContentPart } from './chatCollapsibleContentPart.js';
import { localize } from '../../../../../nls.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { autorun } from '../../../../../base/common/observable.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { IChatMarkdownAnchorService } from './chatMarkdownAnchorService.js';
import { ChatMessageRole, ILanguageModelsService } from '../../common/languageModels.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import './media/chatThinkingContent.css';


function extractTextFromPart(content: IChatThinkingPart): string {
	const raw = Array.isArray(content.value) ? content.value.join('') : (content.value || '');
	return raw.trim();
}

function extractTitleFromThinkingContent(content: string): string | undefined {
	const headerMatch = content.match(/^\*\*([^*]+)\*\*/);
	return headerMatch ? headerMatch[1] : undefined;
}

export class ChatThinkingContentPart extends ChatCollapsibleContentPart implements IChatContentPart {
	public readonly codeblocks: undefined;
	public readonly codeblocksPartId: undefined;

	private id: string | undefined;
	private content: IChatThinkingPart;
	private currentThinkingValue: string;
	private currentTitle: string;
	private defaultTitle = localize('chat.thinking.header', 'Thinking...');
	private textContainer!: HTMLElement;
	private markdownResult: IRenderedMarkdown | undefined;
	private wrapper!: HTMLElement;
	private fixedScrollingMode: boolean = false;
	private lastExtractedTitle: string | undefined;
	private extractedTitles: string[] = [];
	private toolInvocationCount: number = 0;
	private streamingCompleted: boolean = false;
	private isActive: boolean = true;
	private currentToolCallLabel: string | undefined;
	private toolInvocations: (IChatToolInvocation | IChatToolInvocationSerialized)[] = [];

	constructor(
		content: IChatThinkingPart,
		context: IChatContentPartRenderContext,
		private readonly chatContentMarkdownRenderer: IMarkdownRenderer,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IChatMarkdownAnchorService private readonly chatMarkdownAnchorService: IChatMarkdownAnchorService,
		@ILanguageModelsService private readonly languageModelsService: ILanguageModelsService,
	) {
		const initialText = extractTextFromPart(content);
		const extractedTitle = extractTitleFromThinkingContent(initialText)
			?? 'Thinking...';

		super(extractedTitle, context);

		this.id = content.id;
		this.content = content;
		const configuredMode = this.configurationService.getValue<ThinkingDisplayMode>('chat.agent.thinkingStyle') ?? ThinkingDisplayMode.Collapsed;

		this.fixedScrollingMode = configuredMode === ThinkingDisplayMode.FixedScrolling;

		this.currentTitle = extractedTitle;
		if (extractedTitle !== this.defaultTitle) {
			this.lastExtractedTitle = extractedTitle;
		}
		this.currentThinkingValue = initialText;

		if (configuredMode === ThinkingDisplayMode.Collapsed) {
			this.setExpanded(false);
		} else {
			this.setExpanded(true);
		}

		if (this.fixedScrollingMode) {
			this.setExpanded(false);
		}

		const node = this.domNode;
		node.classList.add('chat-thinking-box');
		node.tabIndex = 0;

		if (this.fixedScrollingMode) {
			node.classList.add('chat-thinking-fixed-mode');
			this.currentTitle = this.defaultTitle;
			if (this._collapseButton && !this.context.element.isComplete) {
				this._collapseButton.icon = ThemeIcon.modify(Codicon.loading, 'spin');
			}
		}

		// override for codicon chevron in the collapsible part
		this._register(autorun(r => {
			this.expanded.read(r);
			if (this._collapseButton && this.wrapper) {
				if (this.wrapper.classList.contains('chat-thinking-streaming') && !this.context.element.isComplete) {
					this._collapseButton.icon = ThemeIcon.modify(Codicon.loading, 'spin');
				} else {
					this._collapseButton.icon = Codicon.check;
				}
			}
		}));

		if (this._collapseButton && !this.streamingCompleted && !this.context.element.isComplete) {
			this._collapseButton.icon = ThemeIcon.modify(Codicon.loading, 'spin');
		}

		const label = this.lastExtractedTitle ?? '';
		if (!this.fixedScrollingMode && !this._isExpanded.get()) {
			this.setTitle(label);
		}

		if (this._collapseButton) {
			this._register(this._collapseButton.onDidClick(() => {
				if (this.streamingCompleted || this.fixedScrollingMode) {
					return;
				}

				const expanded = this.isExpanded();
				if (expanded) {
					this.setTitle(this.defaultTitle, true);
					this.currentTitle = this.defaultTitle;
				} else if (this.lastExtractedTitle) {
					const collapsedLabel = this.lastExtractedTitle ?? '';
					this.setTitle(collapsedLabel);
					this.currentTitle = collapsedLabel;
				}
			}));
		}
	}

	// @TODO: @justschen Convert to template for each setting?
	protected override initContent(): HTMLElement {
		this.wrapper = $('.chat-used-context-list.chat-thinking-collapsible');
		this.wrapper.classList.add('chat-thinking-streaming');
		if (this.currentThinkingValue) {
			this.textContainer = $('.chat-thinking-item.markdown-content');
			this.wrapper.appendChild(this.textContainer);
			this.renderMarkdown(this.currentThinkingValue);
		}
		this.updateDropdownClickability();
		return this.wrapper;
	}

	private renderMarkdown(content: string, reuseExisting?: boolean): void {
		// Guard against rendering after disposal to avoid leaking disposables
		if (this._store.isDisposed) {
			return;
		}
		const cleanedContent = content.trim();
		if (!cleanedContent) {
			if (this.markdownResult) {
				this.markdownResult.dispose();
				this.markdownResult = undefined;
			}
			clearNode(this.textContainer);
			return;
		}

		// If the entire content is bolded, strip the bold markers for rendering
		let contentToRender = cleanedContent;
		if (cleanedContent.startsWith('**') && cleanedContent.endsWith('**')) {
			contentToRender = cleanedContent.slice(2, -2);
		}

		const target = reuseExisting ? this.markdownResult?.element : undefined;
		if (this.markdownResult) {
			this.markdownResult.dispose();
			this.markdownResult = undefined;
		}

		const rendered = this._register(this.chatContentMarkdownRenderer.render(new MarkdownString(contentToRender), {
			fillInIncompleteTokens: true,
			asyncRenderCallback: () => this._onDidChangeHeight.fire(),
			codeBlockRendererSync: (_languageId, text, raw) => {
				const codeElement = $('code');
				codeElement.textContent = text;
				return codeElement;
			}
		}, target));
		this.markdownResult = rendered;
		if (!target) {
			clearNode(this.textContainer);
			this.textContainer.appendChild(rendered.element);
		}
	}

	private setDropdownClickable(clickable: boolean): void {
		if (this._collapseButton) {
			this._collapseButton.element.style.pointerEvents = clickable ? 'auto' : 'none';
		}

		if (!clickable && this.streamingCompleted) {
			super.setTitle(this.lastExtractedTitle ?? this.currentTitle);
		}
	}

	private updateDropdownClickability(): void {
		if (!this.wrapper) {
			return;
		}

		if (this.wrapper.children.length > 1 || this.toolInvocationCount > 0) {
			this.setDropdownClickable(true);
			return;
		}

		const contentWithoutTitle = this.currentThinkingValue.trim();
		const titleToCompare = this.lastExtractedTitle ?? this.currentTitle;

		const stripMarkdown = (text: string) => {
			return text
				.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').replace(/`(.+?)`/g, '$1').trim();
		};

		const strippedContent = stripMarkdown(contentWithoutTitle);
		const shouldDisable = !strippedContent || strippedContent === titleToCompare;
		this.setDropdownClickable(!shouldDisable);
	}

	public resetId(): void {
		this.id = undefined;
	}

	public collapseContent(): void {
		this.setExpanded(false);
	}

	public updateThinking(content: IChatThinkingPart): void {
		// If disposed, ignore late updates coming from renderer diffing
		if (this._store.isDisposed) {
			return;
		}
		this.content = content;
		const raw = extractTextFromPart(content);
		const next = raw;
		if (next === this.currentThinkingValue) {
			return;
		}
		const previousValue = this.currentThinkingValue;
		const reuseExisting = !!(this.markdownResult && next.startsWith(previousValue) && next.length > previousValue.length);
		this.currentThinkingValue = next;
		this.renderMarkdown(next, reuseExisting);

		if (this.fixedScrollingMode && this.wrapper) {
			this.wrapper.scrollTop = this.wrapper.scrollHeight;
		}

		const extractedTitle = extractTitleFromThinkingContent(raw);
		if (extractedTitle && extractedTitle !== this.currentTitle) {
			if (!this.extractedTitles.includes(extractedTitle)) {
				this.extractedTitles.push(extractedTitle);
			}
			this.lastExtractedTitle = extractedTitle;
		}

		if (!extractedTitle || extractedTitle === this.currentTitle) {
			return;
		}

		const label = this.lastExtractedTitle ?? '';
		if (!this.fixedScrollingMode && !this._isExpanded.get()) {
			this.setTitle(label);
		}

		this.updateDropdownClickability();
	}

	public getIsActive(): boolean {
		return this.isActive;
	}

	public markAsInactive(): void {
		this.isActive = false;
	}

	public finalizeTitleIfDefault(): void {
		this.wrapper.classList.remove('chat-thinking-streaming');
		this.streamingCompleted = true;

		if (this._collapseButton) {
			this._collapseButton.icon = Codicon.check;
		}

		this.updateDropdownClickability();

		if (this.content.generatedTitle) {
			this.currentTitle = this.content.generatedTitle;
			super.setTitle(this.content.generatedTitle);
			return;
		}

		const existingToolTitle = this.toolInvocations.find(t => t.generatedTitle)?.generatedTitle;
		if (existingToolTitle) {
			this.currentTitle = existingToolTitle;
			this.content.generatedTitle = existingToolTitle;
			super.setTitle(existingToolTitle);
			return;
		}

		// case where we only have one dropdown in the thinking container and no thinking parts
		if (this.toolInvocationCount === 1 && this.extractedTitles.length === 1 && this.currentToolCallLabel && this.currentThinkingValue.trim() === '') {
			const title = this.currentToolCallLabel;
			this.currentTitle = title;
			this.setTitleWithWidgets(new MarkdownString(title), this.instantiationService, this.chatMarkdownAnchorService, this.chatContentMarkdownRenderer);
			return;
		}

		// if exactly one actual extracted title and no tool invocations, use that as the final title.
		if (this.extractedTitles.length === 1 && this.toolInvocationCount === 0) {
			const title = this.extractedTitles[0];
			this.currentTitle = title;
			this.content.generatedTitle = title;
			super.setTitle(title);
			return;
		}

		const generateTitles = this.configurationService.getValue<boolean>(ChatConfiguration.ThinkingGenerateTitles) ?? true;
		if (!generateTitles) {
			this.setFallbackTitle();
			return;
		}

		this.generateTitleViaLLM();
	}

	private setGeneratedTitleOnToolInvocations(title: string): void {
		for (const toolInvocation of this.toolInvocations) {
			toolInvocation.generatedTitle = title;
		}
	}

	private async generateTitleViaLLM(): Promise<void> {
		try {
			let models = await this.languageModelsService.selectLanguageModels({ vendor: 'copilot', id: 'copilot-fast' });
			if (!models.length) {
				models = await this.languageModelsService.selectLanguageModels({ vendor: 'copilot', family: 'gpt-4o-mini' });
			}
			if (!models.length) {
				this.setFallbackTitle();
				return;
			}

			let context: string;
			if (this.extractedTitles.length > 0) {
				context = this.extractedTitles.join(', ');
			} else {
				context = this.currentThinkingValue.substring(0, 1000);
			}

			const prompt = `Summarize the following actions in 6-7 words using past tense. Be very concise - focus on the main action only. No subjects, quotes, or punctuation.

			Examples:
			- "Preparing to create new page file, Read HomePage.tsx, Creating new TypeScript file" → "Created new page file"
			- "Searching for files, Reading configuration, Analyzing dependencies" → "Analyzed project structure"
			- "Invoked terminal command, Checked build output, Fixed errors" → "Ran build and fixed errors"

			Actions: ${context}`;

			const response = await this.languageModelsService.sendChatRequest(
				models[0],
				new ExtensionIdentifier('core'),
				[{ role: ChatMessageRole.User, content: [{ type: 'text', value: prompt }] }],
				{},
				CancellationToken.None
			);

			let generatedTitle = '';
			for await (const part of response.stream) {
				if (Array.isArray(part)) {
					for (const p of part) {
						if (p.type === 'text') {
							generatedTitle += p.value;
						}
					}
				} else if (part.type === 'text') {
					generatedTitle += part.value;
				}
			}

			await response.result;
			generatedTitle = generatedTitle.trim();

			if (generatedTitle && !this._store.isDisposed) {
				this.currentTitle = generatedTitle;
				if (this._collapseButton) {
					this._collapseButton.label = generatedTitle;
				}
				this.content.generatedTitle = generatedTitle;
				this.setGeneratedTitleOnToolInvocations(generatedTitle);
				return;
			}
		} catch (error) {
			// fall through to default title
		}

		this.setFallbackTitle();
	}

	private setFallbackTitle(): void {
		const finalLabel = this.toolInvocationCount > 0
			? localize('chat.thinking.finished.withTools', 'Finished thinking and invoked {0} tool{1}', this.toolInvocationCount, this.toolInvocationCount === 1 ? '' : 's')
			: localize('chat.thinking.finished', 'Finished Thinking');

		this.currentTitle = finalLabel;
		this.wrapper.classList.remove('chat-thinking-streaming');
		this.streamingCompleted = true;

		if (this._collapseButton) {
			this._collapseButton.icon = Codicon.check;
			this._collapseButton.label = finalLabel;
		}

		this.updateDropdownClickability();
	}

	public appendItem(content: HTMLElement, toolInvocationId?: string, toolInvocation?: IChatToolInvocation | IChatToolInvocationSerialized): void {
		this.wrapper.appendChild(content);
		if (toolInvocationId) {
			this.toolInvocationCount++;
			let toolCallLabel: string;

			if (toolInvocation?.invocationMessage) {
				const message = typeof toolInvocation.invocationMessage === 'string' ? toolInvocation.invocationMessage : toolInvocation.invocationMessage.value;
				toolCallLabel = message;
			} else {
				toolCallLabel = `Invoked \`${toolInvocationId}\``;
			}

			if (toolInvocation?.pastTenseMessage) {
				this.currentToolCallLabel = typeof toolInvocation.pastTenseMessage === 'string' ? toolInvocation.pastTenseMessage : toolInvocation.pastTenseMessage.value;
			}

			if (toolInvocation) {
				this.toolInvocations.push(toolInvocation);
			}

			// Add tool call to extracted titles for LLM title generation
			if (!this.extractedTitles.includes(toolCallLabel)) {
				this.extractedTitles.push(toolCallLabel);
			}

			if (!this.fixedScrollingMode && !this._isExpanded.get()) {
				this.setTitle(toolCallLabel);
			}
		}
		if (this.fixedScrollingMode && this.wrapper) {
			this.wrapper.scrollTop = this.wrapper.scrollHeight;
		}
		this.updateDropdownClickability();
	}

	// makes a new text container. when we update, we now update this container.
	public setupThinkingContainer(content: IChatThinkingPart, context: IChatContentPartRenderContext) {
		// Avoid creating new containers after disposal
		if (this._store.isDisposed) {
			return;
		}
		this.textContainer = $('.chat-thinking-item.markdown-content');
		if (content.value) {
			this.wrapper.appendChild(this.textContainer);
			this.id = content.id;
			this.updateThinking(content);
		}
		this.updateDropdownClickability();
	}

	protected override setTitle(title: string, omitPrefix?: boolean): void {
		if (!title || this.context.element.isComplete) {
			return;
		}

		if (omitPrefix) {
			this.setTitleWithWidgets(new MarkdownString(title), this.instantiationService, this.chatMarkdownAnchorService, this.chatContentMarkdownRenderer);
			this.currentTitle = title;
			return;
		}
		const thinkingLabel = `Thinking: ${title}`;
		this.lastExtractedTitle = title;
		this.currentTitle = thinkingLabel;
		this.setTitleWithWidgets(new MarkdownString(thinkingLabel), this.instantiationService, this.chatMarkdownAnchorService, this.chatContentMarkdownRenderer);
	}

	hasSameContent(other: IChatRendererContent, _followingContent: IChatRendererContent[], _element: ChatTreeItem): boolean {
		if (other.kind === 'toolInvocation' || other.kind === 'toolInvocationSerialized') {
			return true;
		}

		if (other.kind !== 'thinking') {
			return false;
		}

		return other?.id !== this.id;
	}

	override dispose(): void {
		if (this.markdownResult) {
			this.markdownResult.dispose();
			this.markdownResult = undefined;
		}
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatTodoListWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatTodoListWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { Button } from '../../../../../base/browser/ui/button/button.js';
import { IconLabel } from '../../../../../base/browser/ui/iconLabel/iconLabel.js';
import { IListRenderer, IListVirtualDelegate } from '../../../../../base/browser/ui/list/list.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { WorkbenchList } from '../../../../../platform/list/browser/listService.js';
import { IChatTodoListService, IChatTodo } from '../../common/chatTodoListService.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { TodoListToolDescriptionFieldSettingId } from '../../common/tools/manageTodoListTool.js';
import { URI } from '../../../../../base/common/uri.js';
import { isEqual } from '../../../../../base/common/resources.js';

class TodoListDelegate implements IListVirtualDelegate<IChatTodo> {
	getHeight(element: IChatTodo): number {
		return 22;
	}

	getTemplateId(element: IChatTodo): string {
		return TodoListRenderer.TEMPLATE_ID;
	}
}

interface ITodoListTemplate {
	readonly templateDisposables: DisposableStore;
	readonly todoElement: HTMLElement;
	readonly statusIcon: HTMLElement;
	readonly iconLabel: IconLabel;
}

class TodoListRenderer implements IListRenderer<IChatTodo, ITodoListTemplate> {
	static TEMPLATE_ID = 'todoListRenderer';
	readonly templateId: string = TodoListRenderer.TEMPLATE_ID;

	constructor(
		private readonly configurationService: IConfigurationService
	) { }

	renderTemplate(container: HTMLElement): ITodoListTemplate {
		const templateDisposables = new DisposableStore();
		const todoElement = dom.append(container, dom.$('li.todo-item'));
		todoElement.setAttribute('role', 'listitem');

		const statusIcon = dom.append(todoElement, dom.$('.todo-status-icon.codicon'));
		statusIcon.setAttribute('aria-hidden', 'true');

		const todoContent = dom.append(todoElement, dom.$('.todo-content'));
		const iconLabel = templateDisposables.add(new IconLabel(todoContent, { supportIcons: false }));

		return { templateDisposables, todoElement, statusIcon, iconLabel };
	}

	renderElement(todo: IChatTodo, index: number, templateData: ITodoListTemplate): void {
		const { todoElement, statusIcon, iconLabel } = templateData;

		// Update status icon
		statusIcon.className = `todo-status-icon codicon ${this.getStatusIconClass(todo.status)}`;
		statusIcon.style.color = this.getStatusIconColor(todo.status);

		// Update title with tooltip if description exists and description field is enabled
		const includeDescription = this.configurationService.getValue<boolean>(TodoListToolDescriptionFieldSettingId) !== false;
		const title = includeDescription && todo.description && todo.description.trim() ? todo.description : undefined;
		iconLabel.setLabel(todo.title, undefined, { title });

		// Update aria-label
		const statusText = this.getStatusText(todo.status);
		const ariaLabel = includeDescription && todo.description && todo.description.trim()
			? localize('chat.todoList.itemWithDescription', '{0}, {1}, {2}', todo.title, statusText, todo.description)
			: localize('chat.todoList.item', '{0}, {1}', todo.title, statusText);
		todoElement.setAttribute('aria-label', ariaLabel);
	}

	disposeTemplate(templateData: ITodoListTemplate): void {
		templateData.templateDisposables.dispose();
	}

	private getStatusText(status: string): string {
		switch (status) {
			case 'completed':
				return localize('chat.todoList.status.completed', 'completed');
			case 'in-progress':
				return localize('chat.todoList.status.inProgress', 'in progress');
			case 'not-started':
			default:
				return localize('chat.todoList.status.notStarted', 'not started');
		}
	}

	private getStatusIconClass(status: string): string {
		switch (status) {
			case 'completed':
				return 'codicon-pass';
			case 'in-progress':
				return 'codicon-record';
			case 'not-started':
			default:
				return 'codicon-circle-outline';
		}
	}

	private getStatusIconColor(status: string): string {
		switch (status) {
			case 'completed':
				return 'var(--vscode-charts-green)';
			case 'in-progress':
				return 'var(--vscode-charts-blue)';
			case 'not-started':
			default:
				return 'var(--vscode-foreground)';
		}
	}
}

export class ChatTodoListWidget extends Disposable {
	public readonly domNode: HTMLElement;

	private readonly _onDidChangeHeight = this._register(new Emitter<void>());
	public readonly onDidChangeHeight: Event<void> = this._onDidChangeHeight.event;

	private _isExpanded: boolean = false;
	private _userManuallyExpanded: boolean = false;
	private expandoButton!: Button;
	private expandIcon!: HTMLElement;
	private titleElement!: HTMLElement;
	private todoListContainer!: HTMLElement;
	private clearButtonContainer!: HTMLElement;
	private clearButton!: Button;
	private _currentSessionResource: URI | undefined;
	private _todoList: WorkbenchList<IChatTodo> | undefined;

	constructor(
		@IChatTodoListService private readonly chatTodoListService: IChatTodoListService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService
	) {
		super();

		this.domNode = this.createChatTodoWidget();

		// Listen to context key changes to update clear button state when request state changes
		this._register(this.contextKeyService.onDidChangeContext(e => {
			if (e.affectsSome(new Set([ChatContextKeys.requestInProgress.key]))) {
				this.updateClearButtonState();
			}
		}));
	}

	public get height(): number {
		return this.domNode.style.display === 'none' ? 0 : this.domNode.offsetHeight;
	}

	private hideWidget(): void {
		this.domNode.style.display = 'none';
		this._onDidChangeHeight.fire();
	}

	private createChatTodoWidget(): HTMLElement {
		const container = dom.$('.chat-todo-list-widget');
		container.style.display = 'none';

		const expandoContainer = dom.$('.todo-list-expand');
		this.expandoButton = this._register(new Button(expandoContainer, {
			supportIcons: true
		}));
		this.expandoButton.element.setAttribute('aria-expanded', String(this._isExpanded));
		this.expandoButton.element.setAttribute('aria-controls', 'todo-list-container');

		// Create title section to group icon and title
		const titleSection = dom.$('.todo-list-title-section');

		this.expandIcon = dom.$('.expand-icon.codicon');
		this.expandIcon.classList.add(this._isExpanded ? 'codicon-chevron-down' : 'codicon-chevron-right');
		this.expandIcon.setAttribute('aria-hidden', 'true');

		this.titleElement = dom.$('.todo-list-title');
		this.titleElement.id = 'todo-list-title';
		this.titleElement.textContent = localize('chat.todoList.title', 'Todos');

		// Add clear button container to the expand element
		this.clearButtonContainer = dom.$('.todo-clear-button-container');
		this.createClearButton();

		titleSection.appendChild(this.expandIcon);
		titleSection.appendChild(this.titleElement);

		this.expandoButton.element.appendChild(titleSection);
		this.expandoButton.element.appendChild(this.clearButtonContainer);

		this.todoListContainer = dom.$('.todo-list-container');
		this.todoListContainer.style.display = this._isExpanded ? 'block' : 'none';
		this.todoListContainer.id = 'todo-list-container';
		this.todoListContainer.setAttribute('role', 'list');
		this.todoListContainer.setAttribute('aria-labelledby', 'todo-list-title');

		container.appendChild(expandoContainer);
		container.appendChild(this.todoListContainer);

		this._register(this.expandoButton.onDidClick(() => {
			this.toggleExpanded();
		}));

		return container;
	}

	private createClearButton(): void {
		this.clearButton = new Button(this.clearButtonContainer, {
			supportIcons: true,
		});
		this.clearButton.element.tabIndex = 0;
		this.clearButton.icon = Codicon.clearAll;
		this._register(this.clearButton);

		this._register(this.clearButton.onDidClick(() => {
			this.clearAllTodos();
		}));
	}

	public render(sessionResource: URI | undefined): void {
		if (!sessionResource) {
			this.hideWidget();
			return;
		}

		if (!isEqual(this._currentSessionResource, sessionResource)) {
			this._userManuallyExpanded = false;
			this._currentSessionResource = sessionResource;
			this.hideWidget();
		}

		this.updateTodoDisplay();
	}

	public clear(sessionResource: URI | undefined, force: boolean = false): void {
		if (!sessionResource || this.domNode.style.display === 'none') {
			return;
		}

		const currentTodos = this.chatTodoListService.getTodos(sessionResource);
		const shouldClear = force || (currentTodos.length > 0 && !currentTodos.some(todo => todo.status !== 'completed'));
		if (shouldClear) {
			this.clearAllTodos();
		}
	}

	private updateTodoDisplay(): void {
		if (!this._currentSessionResource) {
			return;
		}

		const todoList = this.chatTodoListService.getTodos(this._currentSessionResource);
		const shouldShow = todoList.length > 2;

		if (!shouldShow) {
			this.domNode.classList.remove('has-todos');
			return;
		}

		this.domNode.classList.add('has-todos');
		this.renderTodoList(todoList);
		this.domNode.style.display = 'block';
		this._onDidChangeHeight.fire();
	}

	private renderTodoList(todoList: IChatTodo[]): void {
		this.updateTitleElement(this.titleElement, todoList);

		const allIncomplete = todoList.every(todo => todo.status === 'not-started');
		if (allIncomplete) {
			this._userManuallyExpanded = false;
		}

		// Create or update the WorkbenchList
		if (!this._todoList) {
			this._todoList = this._register(this.instantiationService.createInstance(
				WorkbenchList<IChatTodo>,
				'ChatTodoListRenderer',
				this.todoListContainer,
				new TodoListDelegate(),
				[new TodoListRenderer(this.configurationService)],
				{
					alwaysConsumeMouseWheel: false,
					accessibilityProvider: {
						getAriaLabel: (todo: IChatTodo) => {
							const statusText = this.getStatusText(todo.status);
							const includeDescription = this.configurationService.getValue<boolean>(TodoListToolDescriptionFieldSettingId) !== false;
							return includeDescription && todo.description && todo.description.trim()
								? localize('chat.todoList.itemWithDescription', '{0}, {1}, {2}', todo.title, statusText, todo.description)
								: localize('chat.todoList.item', '{0}, {1}', todo.title, statusText);
						},
						getWidgetAriaLabel: () => localize('chatTodoList', 'Chat Todo List')
					}
				}
			));
		}

		// Update list contents
		const maxItemsShown = 6;
		const itemsShown = Math.min(todoList.length, maxItemsShown);
		const height = itemsShown * 22;
		this._todoList.layout(height);
		this._todoList.getHTMLElement().style.height = `${height}px`;
		this._todoList.splice(0, this._todoList.length, todoList);

		const hasInProgressTask = todoList.some(todo => todo.status === 'in-progress');
		const hasCompletedTask = todoList.some(todo => todo.status === 'completed');

		// Update clear button state based on request progress
		this.updateClearButtonState();

		// Only auto-collapse if there are in-progress or completed tasks AND user hasn't manually expanded
		if ((hasInProgressTask || hasCompletedTask) && this._isExpanded && !this._userManuallyExpanded) {
			this._isExpanded = false;
			this.expandoButton.element.setAttribute('aria-expanded', 'false');
			this.todoListContainer.style.display = 'none';

			this.expandIcon.classList.remove('codicon-chevron-down');
			this.expandIcon.classList.add('codicon-chevron-right');

			this.updateTitleElement(this.titleElement, todoList);
			this._onDidChangeHeight.fire();
		}
	}

	private toggleExpanded(): void {
		this._isExpanded = !this._isExpanded;
		this._userManuallyExpanded = true;

		this.expandIcon.classList.toggle('codicon-chevron-down', this._isExpanded);
		this.expandIcon.classList.toggle('codicon-chevron-right', !this._isExpanded);

		this.todoListContainer.style.display = this._isExpanded ? 'block' : 'none';

		if (this._currentSessionResource) {
			const todoList = this.chatTodoListService.getTodos(this._currentSessionResource);
			this.updateTitleElement(this.titleElement, todoList);
		}

		this._onDidChangeHeight.fire();
	}

	private clearAllTodos(): void {
		if (!this._currentSessionResource) {
			return;
		}

		this.chatTodoListService.setTodos(this._currentSessionResource, []);
		this.hideWidget();
	}

	private updateClearButtonState(): void {
		if (!this._currentSessionResource) {
			return;
		}

		const todoList = this.chatTodoListService.getTodos(this._currentSessionResource);
		const hasInProgressTask = todoList.some(todo => todo.status === 'in-progress');
		const isRequestInProgress = ChatContextKeys.requestInProgress.getValue(this.contextKeyService) ?? false;
		const shouldDisable = isRequestInProgress && hasInProgressTask;

		this.clearButton.enabled = !shouldDisable;

		// Update tooltip based on state
		if (shouldDisable) {
			this.clearButton.setTitle(localize('chat.todoList.clearButton.disabled', 'Cannot clear todos while a task is in progress'));
		} else {
			this.clearButton.setTitle(localize('chat.todoList.clearButton', 'Clear all todos'));
		}
	}

	private updateTitleElement(titleElement: HTMLElement, todoList: IChatTodo[]): void {
		titleElement.textContent = '';

		const completedCount = todoList.filter(todo => todo.status === 'completed').length;
		const totalCount = todoList.length;
		const inProgressTodos = todoList.filter(todo => todo.status === 'in-progress');
		const firstInProgressTodo = inProgressTodos.length > 0 ? inProgressTodos[0] : undefined;
		const notStartedTodos = todoList.filter(todo => todo.status === 'not-started');
		const firstNotStartedTodo = notStartedTodos.length > 0 ? notStartedTodos[0] : undefined;
		const currentTaskNumber = inProgressTodos.length > 0 ? completedCount + 1 : Math.max(1, completedCount);

		const expandButtonLabel = this._isExpanded
			? localize('chat.todoList.collapseButton', 'Collapse Todos')
			: localize('chat.todoList.expandButton', 'Expand Todos');
		this.expandoButton.element.setAttribute('aria-label', expandButtonLabel);
		this.expandoButton.element.setAttribute('aria-expanded', this._isExpanded ? 'true' : 'false');

		if (this._isExpanded) {
			const titleText = dom.$('span');
			titleText.textContent = totalCount > 0 ?
				localize('chat.todoList.titleWithCount', 'Todos ({0}/{1})', currentTaskNumber, totalCount) :
				localize('chat.todoList.title', 'Todos');
			titleElement.appendChild(titleText);
		} else {
			// Show first in-progress todo, or if none, the first not-started todo
			const todoToShow = firstInProgressTodo || firstNotStartedTodo;
			if (todoToShow) {
				const icon = dom.$('.codicon');
				if (todoToShow === firstInProgressTodo) {
					icon.classList.add('codicon-record');
					icon.style.color = 'var(--vscode-charts-blue)';
				} else {
					icon.classList.add('codicon-circle-outline');
					icon.style.color = 'var(--vscode-foreground)';
				}
				icon.style.marginRight = '4px';
				icon.style.verticalAlign = 'middle';
				titleElement.appendChild(icon);

				const todoText = dom.$('span');
				todoText.textContent = localize('chat.todoList.currentTask', '{0} ({1}/{2})', todoToShow.title, currentTaskNumber, totalCount);
				todoText.style.verticalAlign = 'middle';
				todoText.style.overflow = 'hidden';
				todoText.style.textOverflow = 'ellipsis';
				todoText.style.whiteSpace = 'nowrap';
				todoText.style.minWidth = '0';
				titleElement.appendChild(todoText);
			}
			// Show "Done" when all tasks are completed
			else if (completedCount > 0 && completedCount === totalCount) {
				const doneText = dom.$('span');
				doneText.textContent = localize('chat.todoList.titleWithCount', 'Todos ({0}/{1})', totalCount, totalCount);
				doneText.style.verticalAlign = 'middle';
				titleElement.appendChild(doneText);
			}
		}
	}

	private getStatusText(status: string): string {
		switch (status) {
			case 'completed':
				return localize('chat.todoList.status.completed', 'completed');
			case 'in-progress':
				return localize('chat.todoList.status.inProgress', 'in progress');
			case 'not-started':
			default:
				return localize('chat.todoList.status.notStarted', 'not started');
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatToolInputOutputContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatToolInputOutputContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { ButtonWithIcon } from '../../../../../base/browser/ui/button/button.js';
import { HoverStyle } from '../../../../../base/browser/ui/hover/hover.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Emitter } from '../../../../../base/common/event.js';
import { IMarkdownString } from '../../../../../base/common/htmlContent.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { autorun, ISettableObservable, observableValue } from '../../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { URI } from '../../../../../base/common/uri.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { localize } from '../../../../../nls.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IChatRendererContent } from '../../common/chatViewModel.js';
import { LanguageModelPartAudience } from '../../common/languageModels.js';
import { ChatTreeItem, IChatCodeBlockInfo } from '../chat.js';
import { CodeBlockPart, ICodeBlockData, ICodeBlockRenderOptions } from '../codeBlockPart.js';
import { IDisposableReference } from './chatCollections.js';
import { ChatQueryTitlePart } from './chatConfirmationWidget.js';
import { IChatContentPartRenderContext } from './chatContentParts.js';
import { ChatToolOutputContentSubPart } from './chatToolOutputContentSubPart.js';

export interface IChatCollapsibleIOCodePart {
	kind: 'code';
	textModel: ITextModel;
	languageId: string;
	options: ICodeBlockRenderOptions;
	codeBlockInfo: IChatCodeBlockInfo;
	title?: string | IMarkdownString;
}

export interface IChatCollapsibleIODataPart {
	kind: 'data';
	value?: Uint8Array;
	audience?: LanguageModelPartAudience[];
	mimeType: string | undefined;
	uri: URI;
}

export type ChatCollapsibleIOPart = IChatCollapsibleIOCodePart | IChatCollapsibleIODataPart;

export interface IChatCollapsibleInputData extends IChatCollapsibleIOCodePart { }
export interface IChatCollapsibleOutputData {
	parts: ChatCollapsibleIOPart[];
}

export class ChatCollapsibleInputOutputContentPart extends Disposable {
	private readonly _onDidChangeHeight = this._register(new Emitter<void>());
	public readonly onDidChangeHeight = this._onDidChangeHeight.event;

	private _currentWidth: number = 0;
	private readonly _editorReferences: IDisposableReference<CodeBlockPart>[] = [];
	private readonly _titlePart: ChatQueryTitlePart;
	private _outputSubPart: ChatToolOutputContentSubPart | undefined;
	public readonly domNode: HTMLElement;

	get codeblocks(): IChatCodeBlockInfo[] {
		const inputCodeblocks = this._editorReferences.map(ref => {
			const cbi = this.input.codeBlockInfo;
			return cbi;
		});
		const outputCodeblocks = this._outputSubPart?.codeblocks ?? [];
		return [...inputCodeblocks, ...outputCodeblocks];
	}

	public set title(s: string | IMarkdownString) {
		this._titlePart.title = s;
	}

	public get title(): string | IMarkdownString {
		return this._titlePart.title;
	}

	private readonly _expanded: ISettableObservable<boolean>;

	public get expanded(): boolean {
		return this._expanded.get();
	}

	constructor(
		title: IMarkdownString | string,
		subtitle: string | IMarkdownString | undefined,
		progressTooltip: IMarkdownString | string | undefined,
		private readonly context: IChatContentPartRenderContext,
		private readonly input: IChatCollapsibleInputData,
		private readonly output: IChatCollapsibleOutputData | undefined,
		isError: boolean,
		initiallyExpanded: boolean,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IHoverService hoverService: IHoverService,
	) {
		super();
		this._currentWidth = context.currentWidth();

		const container = dom.h('.chat-confirmation-widget-container');
		const titleEl = dom.h('.chat-confirmation-widget-title-inner');
		const elements = dom.h('.chat-confirmation-widget');
		this.domNode = container.root;
		container.root.appendChild(elements.root);

		const titlePart = this._titlePart = this._register(_instantiationService.createInstance(
			ChatQueryTitlePart,
			titleEl.root,
			title,
			subtitle,
		));
		this._register(titlePart.onDidChangeHeight(() => this._onDidChangeHeight.fire()));

		const spacer = document.createElement('span');
		spacer.style.flexGrow = '1';

		const btn = this._register(new ButtonWithIcon(elements.root, {}));
		btn.element.classList.add('chat-confirmation-widget-title', 'monaco-text-button');
		btn.labelElement.append(titleEl.root);

		const check = dom.h(isError
			? ThemeIcon.asCSSSelector(Codicon.error)
			: output
				? ThemeIcon.asCSSSelector(Codicon.check)
				: ThemeIcon.asCSSSelector(ThemeIcon.modify(Codicon.loading, 'spin'))
		);

		if (progressTooltip) {
			this._register(hoverService.setupDelayedHover(check.root, {
				content: progressTooltip,
				style: HoverStyle.Pointer,
			}));
		}

		const expanded = this._expanded = observableValue(this, initiallyExpanded);
		this._register(autorun(r => {
			const value = expanded.read(r);
			btn.icon = isError
				? Codicon.error
				: output
					? Codicon.check
					: ThemeIcon.modify(Codicon.loading, 'spin');
			elements.root.classList.toggle('collapsed', !value);
			this._onDidChangeHeight.fire();
		}));

		const toggle = (e: Event) => {
			if (!e.defaultPrevented) {
				const value = expanded.get();
				expanded.set(!value, undefined);
				e.preventDefault();
			}
		};

		this._register(btn.onDidClick(toggle));

		const message = dom.h('.chat-confirmation-widget-message');
		message.root.appendChild(this.createMessageContents());
		elements.root.appendChild(message.root);

		const topLevelResources = this.output?.parts
			.filter(p => p.kind === 'data')
			.filter(p => !p.audience || p.audience.includes(LanguageModelPartAudience.User));
		if (topLevelResources?.length) {
			const resourceSubPart = this._register(this._instantiationService.createInstance(
				ChatToolOutputContentSubPart,
				this.context,
				topLevelResources,
			));
			const group = resourceSubPart.domNode;
			group.classList.add('chat-collapsible-top-level-resource-group');
			container.root.appendChild(group);
			this._register(autorun(r => {
				group.style.display = expanded.read(r) ? 'none' : '';
			}));
		}
	}

	private createMessageContents() {
		const contents = dom.h('div', [
			dom.h('h3@inputTitle'),
			dom.h('div@input'),
			dom.h('h3@outputTitle'),
			dom.h('div@output'),
		]);

		const { input, output } = this;

		contents.inputTitle.textContent = localize('chat.input', "Input");
		this.addCodeBlock(input, contents.input);

		if (!output) {
			contents.output.remove();
			contents.outputTitle.remove();
		} else {
			contents.outputTitle.textContent = localize('chat.output', "Output");
			const outputSubPart = this._register(this._instantiationService.createInstance(
				ChatToolOutputContentSubPart,
				this.context,
				output.parts,
			));
			this._outputSubPart = outputSubPart;
			this._register(outputSubPart.onDidChangeHeight(() => this._onDidChangeHeight.fire()));
			contents.output.appendChild(outputSubPart.domNode);
		}

		return contents.root;
	}

	private addCodeBlock(part: IChatCollapsibleIOCodePart, container: HTMLElement) {
		const data: ICodeBlockData = {
			languageId: part.languageId,
			textModel: Promise.resolve(part.textModel),
			codeBlockIndex: part.codeBlockInfo.codeBlockIndex,
			codeBlockPartIndex: 0,
			element: this.context.element,
			parentContextKeyService: this.contextKeyService,
			renderOptions: part.options,
			chatSessionResource: this.context.element.sessionResource,
		};
		const editorReference = this._register(this.context.editorPool.get());
		editorReference.object.render(data, this._currentWidth || 300);
		this._register(editorReference.object.onDidChangeContentHeight(() => this._onDidChangeHeight.fire()));
		container.appendChild(editorReference.object.element);
		this._editorReferences.push(editorReference);
	}

	hasSameContent(other: IChatRendererContent, followingContent: IChatRendererContent[], element: ChatTreeItem): boolean {
		// For now, we consider content different unless it's exactly the same instance
		return false;
	}

	layout(width: number): void {
		this._currentWidth = width;
		this._editorReferences.forEach(r => r.object.layout(width));
		this._outputSubPart?.layout(width);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatToolOutputContentSubPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatToolOutputContentSubPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Emitter } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { basename, joinPath } from '../../../../../base/common/resources.js';
import { URI } from '../../../../../base/common/uri.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { localize, localize2 } from '../../../../../nls.js';
import { MenuWorkbenchToolBar } from '../../../../../platform/actions/browser/toolbar.js';
import { Action2, MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IFileDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IProgressService, ProgressLocation } from '../../../../../platform/progress/common/progress.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { REVEAL_IN_EXPLORER_COMMAND_ID } from '../../../files/browser/fileConstants.js';
import { getAttachableImageExtension } from '../../common/chatModel.js';
import { IMarkdownString, MarkdownString } from '../../../../../base/common/htmlContent.js';
import { IMarkdownRendererService } from '../../../../../platform/markdown/browser/markdownRenderer.js';
import { IChatRequestVariableEntry } from '../../common/chatVariableEntries.js';
import { IChatCodeBlockInfo } from '../chat.js';
import { CodeBlockPart, ICodeBlockData } from '../codeBlockPart.js';
import { ChatAttachmentsContentPart } from './chatAttachmentsContentPart.js';
import { IDisposableReference } from './chatCollections.js';
import { IChatContentPartRenderContext } from './chatContentParts.js';
import { ChatCollapsibleIOPart, IChatCollapsibleIOCodePart, IChatCollapsibleIODataPart } from './chatToolInputOutputContentPart.js';

/**
 * A reusable component for rendering tool output consisting of code blocks and/or resources.
 * This is used by both ChatCollapsibleInputOutputContentPart and ChatToolPostExecuteConfirmationPart.
 */
export class ChatToolOutputContentSubPart extends Disposable {
	private readonly _onDidChangeHeight = this._register(new Emitter<void>());
	public readonly onDidChangeHeight = this._onDidChangeHeight.event;

	private _currentWidth: number = 0;
	private readonly _editorReferences: IDisposableReference<CodeBlockPart>[] = [];
	public readonly domNode: HTMLElement;
	readonly codeblocks: IChatCodeBlockInfo[] = [];

	constructor(
		private readonly context: IChatContentPartRenderContext,
		private readonly parts: ChatCollapsibleIOPart[],
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@IFileService private readonly _fileService: IFileService,
		@IMarkdownRendererService private readonly _markdownRendererService: IMarkdownRendererService,
	) {
		super();
		this.domNode = this.createOutputContents();
		this._currentWidth = context.currentWidth();
	}

	private toMdString(value: string | IMarkdownString): MarkdownString {
		if (typeof value === 'string') {
			return new MarkdownString('').appendText(value);
		}
		return new MarkdownString(value.value, { isTrusted: value.isTrusted });
	}

	private createOutputContents(): HTMLElement {
		const container = dom.$('div');

		for (let i = 0; i < this.parts.length; i++) {
			const part = this.parts[i];
			if (part.kind === 'code') {
				this.addCodeBlock(part, container);
				continue;
			}

			const group: IChatCollapsibleIODataPart[] = [];
			for (let k = i; k < this.parts.length; k++) {
				const part = this.parts[k];
				if (part.kind !== 'data') {
					break;
				}
				group.push(part);
			}

			this.addResourceGroup(group, container);
			i += group.length - 1; // Skip the parts we just added
		}

		return container;
	}

	private addResourceGroup(parts: IChatCollapsibleIODataPart[], container: HTMLElement) {
		const el = dom.h('.chat-collapsible-io-resource-group', [
			dom.h('.chat-collapsible-io-resource-items@items'),
			dom.h('.chat-collapsible-io-resource-actions@actions'),
		]);

		this.fillInResourceGroup(parts, el.items, el.actions).then(() => this._onDidChangeHeight.fire());

		container.appendChild(el.root);
		return el.root;
	}

	private async fillInResourceGroup(parts: IChatCollapsibleIODataPart[], itemsContainer: HTMLElement, actionsContainer: HTMLElement) {
		const entries = await Promise.all(parts.map(async (part): Promise<IChatRequestVariableEntry> => {
			if (part.mimeType && getAttachableImageExtension(part.mimeType)) {
				const value = part.value ?? await this._fileService.readFile(part.uri).then(f => f.value.buffer, () => undefined);
				return { kind: 'image', id: generateUuid(), name: basename(part.uri), value, mimeType: part.mimeType, isURL: false, references: [{ kind: 'reference', reference: part.uri }] };
			} else {
				return { kind: 'file', id: generateUuid(), name: basename(part.uri), fullName: part.uri.path, value: part.uri };
			}
		}));

		const attachments = this._register(this._instantiationService.createInstance(
			ChatAttachmentsContentPart,
			{
				variables: entries,
				limit: 5,
				contentReferences: undefined,
				domNode: undefined
			}
		));

		attachments.contextMenuHandler = (attachment, event) => {
			const index = entries.indexOf(attachment);
			const part = parts[index];
			if (part) {
				event.preventDefault();
				event.stopPropagation();

				this._contextMenuService.showContextMenu({
					menuId: MenuId.ChatToolOutputResourceContext,
					menuActionOptions: { shouldForwardArgs: true },
					getAnchor: () => ({ x: event.pageX, y: event.pageY }),
					getActionsContext: () => ({ parts: [part] } satisfies IChatToolOutputResourceToolbarContext),
				});
			}
		};

		itemsContainer.appendChild(attachments.domNode!);

		const toolbar = this._register(this._instantiationService.createInstance(MenuWorkbenchToolBar, actionsContainer, MenuId.ChatToolOutputResourceToolbar, {
			menuOptions: {
				shouldForwardArgs: true,
			},
		}));
		toolbar.context = { parts } satisfies IChatToolOutputResourceToolbarContext;
	}

	private addCodeBlock(part: IChatCollapsibleIOCodePart, container: HTMLElement) {
		if (part.title) {
			const title = dom.$('div.chat-confirmation-widget-title');
			const renderedTitle = this._register(this._markdownRendererService.render(this.toMdString(part.title)));
			title.appendChild(renderedTitle.element);
			container.appendChild(title);
		}

		const data: ICodeBlockData = {
			languageId: part.languageId,
			textModel: Promise.resolve(part.textModel),
			codeBlockIndex: part.codeBlockInfo.codeBlockIndex,
			codeBlockPartIndex: 0,
			element: this.context.element,
			parentContextKeyService: this.contextKeyService,
			renderOptions: part.options,
			chatSessionResource: this.context.element.sessionResource,
		};
		const editorReference = this._register(this.context.editorPool.get());
		editorReference.object.render(data, this._currentWidth || 300);
		this._register(editorReference.object.onDidChangeContentHeight(() => this._onDidChangeHeight.fire()));
		container.appendChild(editorReference.object.element);
		this._editorReferences.push(editorReference);
		this.codeblocks.push(part.codeBlockInfo);
	}

	layout(width: number): void {
		this._currentWidth = width;
		this._editorReferences.forEach(r => r.object.layout(width));
	}
}

interface IChatToolOutputResourceToolbarContext {
	parts: IChatCollapsibleIODataPart[];
}



class SaveResourcesAction extends Action2 {
	public static readonly ID = 'chat.toolOutput.save';
	constructor() {
		super({
			id: SaveResourcesAction.ID,
			title: localize2('chat.saveResources', "Save As..."),
			icon: Codicon.cloudDownload,
			menu: [{
				id: MenuId.ChatToolOutputResourceToolbar,
				group: 'navigation',
				order: 1
			}, {
				id: MenuId.ChatToolOutputResourceContext,
			}]
		});
	}

	async run(accessor: ServicesAccessor, context: IChatToolOutputResourceToolbarContext) {
		const fileDialog = accessor.get(IFileDialogService);
		const fileService = accessor.get(IFileService);
		const notificationService = accessor.get(INotificationService);
		const progressService = accessor.get(IProgressService);
		const workspaceContextService = accessor.get(IWorkspaceContextService);
		const commandService = accessor.get(ICommandService);
		const labelService = accessor.get(ILabelService);
		const defaultFilepath = await fileDialog.defaultFilePath();

		const savePart = async (part: IChatCollapsibleIODataPart, isFolder: boolean, uri: URI) => {
			const target = isFolder ? joinPath(uri, basename(part.uri)) : uri;
			try {
				if (part.kind === 'data') {
					await fileService.copy(part.uri, target, true);
				} else {
					// MCP doesn't support streaming data, so no sense trying
					const contents = await fileService.readFile(part.uri);
					await fileService.writeFile(target, contents.value);
				}
			} catch (e) {
				notificationService.error(localize('chat.saveResources.error', "Failed to save {0}: {1}", basename(part.uri), e));
			}
		};

		const withProgress = async (thenReveal: URI, todo: (() => Promise<void>)[]) => {
			await progressService.withProgress({
				location: ProgressLocation.Notification,
				delay: 5_000,
				title: localize('chat.saveResources.progress', "Saving resources..."),
			}, async report => {
				for (const task of todo) {
					await task();
					report.report({ increment: 1, total: todo.length });
				}
			});

			if (workspaceContextService.isInsideWorkspace(thenReveal)) {
				commandService.executeCommand(REVEAL_IN_EXPLORER_COMMAND_ID, thenReveal);
			} else {
				notificationService.info(localize('chat.saveResources.reveal', "Saved resources to {0}", labelService.getUriLabel(thenReveal)));
			}
		};

		if (context.parts.length === 1) {
			const part = context.parts[0];
			const uri = await fileDialog.pickFileToSave(joinPath(defaultFilepath, basename(part.uri)));
			if (!uri) {
				return;
			}
			await withProgress(uri, [() => savePart(part, false, uri)]);
		} else {
			const uris = await fileDialog.showOpenDialog({
				title: localize('chat.saveResources.title', "Pick folder to save resources"),
				canSelectFiles: false,
				canSelectFolders: true,
				canSelectMany: false,
				defaultUri: workspaceContextService.getWorkspace().folders[0]?.uri,
			});

			if (!uris?.length) {
				return;
			}

			await withProgress(uris[0], context.parts.map(part => () => savePart(part, true, uris[0])));
		}
	}
}

registerAction2(SaveResourcesAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatTreeContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatTreeContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { IListVirtualDelegate } from '../../../../../base/browser/ui/list/list.js';
import { ITreeCompressionDelegate } from '../../../../../base/browser/ui/tree/asyncDataTree.js';
import { ICompressedTreeNode } from '../../../../../base/browser/ui/tree/compressedObjectTreeModel.js';
import { ICompressibleTreeRenderer } from '../../../../../base/browser/ui/tree/objectTree.js';
import { IAsyncDataSource, ITreeNode } from '../../../../../base/browser/ui/tree/tree.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { FileKind, FileType } from '../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { WorkbenchCompressibleAsyncDataTree } from '../../../../../platform/list/browser/listService.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { IResourceLabel, ResourceLabels } from '../../../../browser/labels.js';
import { ChatTreeItem } from '../chat.js';
import { IDisposableReference, ResourcePool } from './chatCollections.js';
import { IChatContentPart } from './chatContentParts.js';
import { IChatProgressRenderableResponseContent } from '../../common/chatModel.js';
import { IChatResponseProgressFileTreeData } from '../../common/chatService.js';
import { createFileIconThemableTreeContainerScope } from '../../../files/browser/views/explorerView.js';
import { IFilesConfiguration } from '../../../files/common/files.js';

const $ = dom.$;

export class ChatTreeContentPart extends Disposable implements IChatContentPart {
	public readonly domNode: HTMLElement;

	private readonly _onDidChangeHeight = this._register(new Emitter<void>());
	public readonly onDidChangeHeight = this._onDidChangeHeight.event;

	public readonly onDidFocus: Event<void>;

	private tree: WorkbenchCompressibleAsyncDataTree<IChatResponseProgressFileTreeData, IChatResponseProgressFileTreeData, void>;

	constructor(
		data: IChatResponseProgressFileTreeData,
		element: ChatTreeItem,
		treePool: TreePool,
		treeDataIndex: number,
		@IOpenerService private readonly openerService: IOpenerService
	) {
		super();

		const ref = this._register(treePool.get());
		this.tree = ref.object;
		this.onDidFocus = this.tree.onDidFocus;

		this._register(this.tree.onDidOpen((e) => {
			if (e.element && !('children' in e.element)) {
				this.openerService.open(e.element.uri);
			}
		}));
		this._register(this.tree.onDidChangeCollapseState(() => {
			this._onDidChangeHeight.fire();
		}));
		this._register(this.tree.onContextMenu((e) => {
			e.browserEvent.preventDefault();
			e.browserEvent.stopPropagation();
		}));

		this.tree.setInput(data).then(() => {
			if (!ref.isStale()) {
				this.tree.layout();
				this._onDidChangeHeight.fire();
			}
		});

		this.domNode = this.tree.getHTMLElement().parentElement!;
	}

	domFocus() {
		this.tree.domFocus();
	}

	hasSameContent(other: IChatProgressRenderableResponseContent): boolean {
		// No other change allowed for this content type
		return other.kind === 'treeData';
	}

	addDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}
}

export class TreePool extends Disposable {
	private _pool: ResourcePool<WorkbenchCompressibleAsyncDataTree<IChatResponseProgressFileTreeData, IChatResponseProgressFileTreeData, void>>;

	public get inUse(): ReadonlySet<WorkbenchCompressibleAsyncDataTree<IChatResponseProgressFileTreeData, IChatResponseProgressFileTreeData, void>> {
		return this._pool.inUse;
	}

	constructor(
		private _onDidChangeVisibility: Event<boolean>,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IConfigurationService private readonly configService: IConfigurationService,
		@IThemeService private readonly themeService: IThemeService,
	) {
		super();
		this._pool = this._register(new ResourcePool(() => this.treeFactory()));
	}

	private treeFactory(): WorkbenchCompressibleAsyncDataTree<IChatResponseProgressFileTreeData, IChatResponseProgressFileTreeData, void> {
		const resourceLabels = this._register(this.instantiationService.createInstance(ResourceLabels, { onDidChangeVisibility: this._onDidChangeVisibility }));

		const container = $('.interactive-response-progress-tree');
		this._register(createFileIconThemableTreeContainerScope(container, this.themeService));

		const tree = this.instantiationService.createInstance(
			WorkbenchCompressibleAsyncDataTree<IChatResponseProgressFileTreeData, IChatResponseProgressFileTreeData>,
			'ChatListRenderer',
			container,
			new ChatListTreeDelegate(),
			new ChatListTreeCompressionDelegate(),
			[new ChatListTreeRenderer(resourceLabels, this.configService.getValue('explorer.decorations'))],
			new ChatListTreeDataSource(),
			{
				collapseByDefault: () => false,
				expandOnlyOnTwistieClick: () => false,
				identityProvider: {
					getId: (e: IChatResponseProgressFileTreeData) => e.uri.toString()
				},
				accessibilityProvider: {
					getAriaLabel: (element: IChatResponseProgressFileTreeData) => element.label,
					getWidgetAriaLabel: () => localize('treeAriaLabel', "File Tree")
				},
				alwaysConsumeMouseWheel: false
			});

		return tree;
	}

	get(): IDisposableReference<WorkbenchCompressibleAsyncDataTree<IChatResponseProgressFileTreeData, IChatResponseProgressFileTreeData, void>> {
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

class ChatListTreeDelegate implements IListVirtualDelegate<IChatResponseProgressFileTreeData> {
	static readonly ITEM_HEIGHT = 22;

	getHeight(element: IChatResponseProgressFileTreeData): number {
		return ChatListTreeDelegate.ITEM_HEIGHT;
	}

	getTemplateId(element: IChatResponseProgressFileTreeData): string {
		return 'chatListTreeTemplate';
	}
}

class ChatListTreeCompressionDelegate implements ITreeCompressionDelegate<IChatResponseProgressFileTreeData> {
	isIncompressible(element: IChatResponseProgressFileTreeData): boolean {
		return !element.children;
	}
}

interface IChatListTreeRendererTemplate {
	templateDisposables: DisposableStore;
	label: IResourceLabel;
}

class ChatListTreeRenderer implements ICompressibleTreeRenderer<IChatResponseProgressFileTreeData, void, IChatListTreeRendererTemplate> {
	templateId: string = 'chatListTreeTemplate';

	constructor(private labels: ResourceLabels, private decorations: IFilesConfiguration['explorer']['decorations']) { }

	renderCompressedElements(element: ITreeNode<ICompressedTreeNode<IChatResponseProgressFileTreeData>, void>, index: number, templateData: IChatListTreeRendererTemplate): void {
		templateData.label.element.style.display = 'flex';
		const label = element.element.elements.map((e) => e.label);
		templateData.label.setResource({ resource: element.element.elements[0].uri, name: label }, {
			title: element.element.elements[0].label,
			fileKind: element.children ? FileKind.FOLDER : FileKind.FILE,
			extraClasses: ['explorer-item'],
			fileDecorations: this.decorations
		});
	}
	renderTemplate(container: HTMLElement): IChatListTreeRendererTemplate {
		const templateDisposables = new DisposableStore();
		const label = templateDisposables.add(this.labels.create(container, { supportHighlights: true }));
		return { templateDisposables, label };
	}
	renderElement(element: ITreeNode<IChatResponseProgressFileTreeData, void>, index: number, templateData: IChatListTreeRendererTemplate): void {
		templateData.label.element.style.display = 'flex';
		if (!element.children.length && element.element.type !== FileType.Directory) {
			templateData.label.setFile(element.element.uri, {
				fileKind: FileKind.FILE,
				hidePath: true,
				fileDecorations: this.decorations,
			});
		} else {
			templateData.label.setResource({ resource: element.element.uri, name: element.element.label }, {
				title: element.element.label,
				fileKind: FileKind.FOLDER,
				fileDecorations: this.decorations
			});
		}
	}
	disposeTemplate(templateData: IChatListTreeRendererTemplate): void {
		templateData.templateDisposables.dispose();
	}
}

class ChatListTreeDataSource implements IAsyncDataSource<IChatResponseProgressFileTreeData, IChatResponseProgressFileTreeData> {
	hasChildren(element: IChatResponseProgressFileTreeData): boolean {
		return !!element.children;
	}

	async getChildren(element: IChatResponseProgressFileTreeData): Promise<Iterable<IChatResponseProgressFileTreeData>> {
		return element.children ?? [];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/media/chatConfirmationWidget.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/media/chatConfirmationWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.chat-confirmation-widget {
	border: none;
	border-radius: 4px;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	position: relative;
}

.chat-confirmation-widget .monaco-text-button {
	padding: 0 12px;
	min-height: 2em;
	box-sizing: border-box;
	font-size: var(--vscode-chat-font-size-body-m);
}

.chat-confirmation-widget:not(:last-child) {
	margin-bottom: 16px;
}

.chat-confirmation-widget + .chat-tool-approval-message {
	margin: -12px 6px 16px;
	color: var(--vscode-descriptionForeground);
	font-size: var(--vscode-chat-font-size-body-s);
}

.chat-confirmation-widget-container .chat-confirmation-widget .chat-confirmation-widget-title {
	width: 100%;
	border-radius: 3px;
	padding: 2px 6px 2px 2px;
	user-select: none;

	&.monaco-button {
		display: flex;
		align-items: center;
		border: 0;
	}
}

.chat-confirmation-widget-container {
	position: relative;

	> .monaco-progress-container.active {
		position: absolute;
		left: 0px;
		right: 0;
		top: 0px;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}

	.chat-collapsible-top-level-resource-group {
		margin-top: -12px;
		margin-bottom: 12px;
	}
}

.chat-confirmation-widget .chat-confirmation-widget-title.expandable {
	cursor: pointer;
	margin-left: 0;
}

.chat-confirmation-widget .chat-confirmation-widget-title-inner {
	flex-grow: 1;
	flex-basis: 0;
}

.chat-confirmation-widget .chat-confirmation-widget-title p,
.chat-confirmation-widget .chat-confirmation-widget-title .rendered-markdown {
	display: inline;
	color: var(--vscode-descriptionForeground);
}

.chat-confirmation-widget .chat-confirmation-widget-title p {
	margin: 0 !important;
}

.chat-confirmation-widget .chat-confirmation-widget-title .codicon-error {
	color: var(--vscode-errorForeground) !important;
}

.chat-confirmation-widget .chat-confirmation-widget-title .chat-confirmation-widget-expando {
	display: flex;
	align-items: center;
}

.chat-confirmation-widget .chat-confirmation-widget-title.monaco-button {
	&:hover {
		background: var(--vscode-toolbar-hoverBackground);
	}

	&:active {
		background: var(--vscode-toolbar-activeBackground);
	}

	.monaco-button-mdlabel {
		display: flex;
		width: 100%;
		text-align: left;
		align-items: center;
	}
}

.chat-confirmation-widget-message h3 {
	font-weight: 600;
	margin: 4px 0 8px;
	font-size: 12px;
}

.chat-confirmation-widget .chat-confirmation-widget-title .rendered-markdown p a {
	color: inherit;
}

.chat-confirmation-widget-title small {
	font-size: 1em;

	&::before {
		content: ' \2013  ';
	}
}

.chat-confirmation-widget .chat-buttons-container,
.chat-confirmation-widget .chat-confirmation-widget-message {
	flex-basis: 100%;
	padding: 0 8px;
	margin: 8px 0;


	&:last-child {
		margin-bottom: 0;
	}
}

.chat-confirmation-widget .chat-confirmation-widget-message-container {
	border: 1px solid var(--vscode-chat-requestBorder);
	border-radius: 4px;
	font-size: var(--vscode-chat-font-size-body-s);
}

.chat-confirmation-widget .chat-buttons-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
}

.chat-confirmation-widget .chat-buttons {
	display: flex;
	gap: 8px;
}

.chat-confirmation-widget .chat-toolbar {
	display: flex;
	align-items: center;
}

.chat-confirmation-widget.collapsed .chat-confirmation-widget-message {
	display: none;
}

.chat-confirmation-widget .chat-confirmation-widget-message .rendered-markdown p {
	margin-top: 0;
}

.chat-confirmation-widget .chat-confirmation-widget-message .rendered-markdown > :last-child {
	margin-bottom: 0px;
}

.chat-confirmation-widget .chat-confirmation-widget-message .see-more {
	margin-top: -4px;

	a {
		color: var(--vscode-textLink-foreground);
		text-decoration: underline;
		display: block;
		cursor: pointer;
	}
}

.chat-confirmation-widget .chat-buttons-container:last-child {
	margin-bottom: 8px;
}

.chat-confirmation-widget-container.hideButtons .chat-buttons-container {
	display: none;
}

.chat-collapsible-io-resource-group {
	display: flex;
	gap: 8px;
	align-items: center;
	margin-bottom: 8px !important;

	.chat-collapsible-io-resource-items {
		display: flex;
		align-items: center;

		.chat-attached-context {
			margin-bottom: 0 !important;
		}
	}
}

.chat-confirmation-widget2 {
	margin-bottom: 8px;
	border: 1px solid var(--vscode-chat-requestBorder);
	border-radius: 4px;
}

.chat-confirmation-widget2 .chat-confirmation-widget-title {
	border-bottom: 1px solid var(--vscode-chat-requestBorder);
	padding: 5px 9px;
	display: flex;
	justify-content: space-between;
	column-gap: 10px;

	.rendered-markdown {
		line-height: 24px !important;

		p {
			margin: 0 !important;
		}
	}

	p,
	.rendered-markdown {
		display: inline;
	}
}

.chat-confirmation-widget2 .disclaimer {
	margin-bottom: 0 !important;
	font-style: italic;
	opacity: 0.7 !important;

	.chat-markdown-part > p {
		margin-bottom: 6px !important;
	}
}

.chat-confirmation-widget2 .chat-confirmation-widget-message:not(:has(.chat-confirmation-message-terminal)) {
	background: var(--vscode-chat-requestBackground);
	border-bottom: 1px solid var(--vscode-chat-requestBorder);
	padding: 6px 9px 0 9px;

	.tool-postconfirm-display {
		padding-bottom: 6px;
	}

	p {
		margin-top: 0;
		margin-bottom: 9px;
	}
}

.chat-confirmation-widget2 .chat-confirmation-message-terminal .chat-confirmation-message-terminal-editor {
	border-bottom: 1px solid var(--vscode-chat-requestBorder);
}

.chat-confirmation-widget2 .chat-confirmation-message-terminal .chat-confirmation-message-terminal-editor .interactive-result-code-block {
	border: none !important;
}

.chat-confirmation-message-terminal .chat-confirmation-message-terminal-disclaimer p:last-child {
	margin-bottom: 0 !important;
	padding: 5px 9px 0 9px;
}

.chat-confirmation-widget-container.hideButtons .chat-confirmation-widget-buttons,
.chat-confirmation-widget-container.hideButtons .chat-toolbar-container {
	display: none;
}

.chat-confirmation-widget2 .chat-confirmation-widget-buttons {
	display: flex;
	padding: 5px 9px;
	font-size: var(--vscode-chat-font-size-body-m);

	.chat-buttons {
		display: flex;
		column-gap: 10px;
		align-items: center;

		.monaco-button {
			overflow-wrap: break-word;
			padding: 2px 5px;
			width: inherit;
		}

		.monaco-text-button {
			padding: 2px 10px;
		}
	}
}

.chat-confirmation-widget2 .interactive-result-code-block.compare {
	.interactive-result-header .monaco-toolbar {
		display: none;
		/* Don't show keep/discard for diffs shown within confirmation */
	}
}

.chat-tool-invocation-part {
	.chat-confirmation-widget {
		border: none;
		font-size: var(--vscode-chat-font-size-body-s);

		.chat-confirmation-widget-message {
			margin: 2px 0 0 0;
			border: 1px solid var(--vscode-chat-requestBorder);
			border-radius: 4px;
			font-size: var(--vscode-chat-font-size-body-s);
		}

	}

	.chat-confirmation-widget-container .chat-confirmation-widget .chat-confirmation-widget-title {
		padding: 2px 6px 2px 2px;

		&.monaco-button {

			width: fit-content;
			outline: none;
			gap: 4px;
		}

		.codicon {
			font-size: var(--vscode-chat-font-size-body-s);
		}

		&:hover {
			background: var(--vscode-list-hoverBackground);
		}
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/media/chatExtensionsContent.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/media/chatExtensionsContent.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.chat-extensions-content-part {
	border: 1px solid var(--vscode-chat-requestBorder);
	border-bottom: none;
	border-radius: 4px;
}

.chat-extensions-content-part .extension-list-item {
	border-bottom: 1px solid var(--vscode-chat-requestBorder);
}

.chat-extensions-content-part .loading-extensions-element {
	line-height: 18px;
	padding: 4px;
	font-size: 12px;
	color: var(--vscode-descriptionForeground);
	user-select: none;
	border-bottom: 1px solid var(--vscode-chat-requestBorder);
}

.chat-extensions-content-part .loading-extensions-element .loading-message {
	padding-left: 4px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/media/chatMarkdownPart.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/media/chatMarkdownPart.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


.chat-markdown-part {

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		line-height: normal;
	}

	.katex-display .katex {
		margin: auto;
		width: fit-content;
		overflow: hidden;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/media/chatMcpServersInteractionContent.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/media/chatMcpServersInteractionContent.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.chat-mcp-servers-message {
	display: flex;
	align-items: center;
	gap: 8px;
	font-style: italic;
	font-size: 12px;
	color: var(--vscode-descriptionForeground);
	opacity: 0.8;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/media/chatPullRequestContent.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/media/chatPullRequestContent.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.chat-pull-request-content-part {
	border: 1px solid var(--vscode-chat-requestBorder);
	border-radius: 6px;
	margin: 4px 0;
	overflow: hidden;
}

.chat-pull-request-content-part .container .icon {
	padding-right: 4px;
	padding-top: 2px;
}

.chat-pull-request-content-part .content-container {
	display: flex;
	flex-direction: column;
}

.chat-pull-request-content-part .title-container .link {
	color: var(--vscode-textLink-foreground);
	flex-shrink: 0;
	white-space: nowrap;
}

.chat-pull-request-content-part {

	.title-container {
		display: flex;
		padding: 8px 12px;
		border-bottom: 1px solid var(--vscode-chat-requestBorder);
	}

	p {
		margin: 0px;
	}

	.description .see-more {
		display: none;
		position: absolute;
		right: 12px;
		bottom: 8px;

		a {
			color: var(--vscode-textLink-foreground);
			text-decoration: underline;
			cursor: pointer;
		}
	}

	.description {
		position: relative;
		padding: 8px 12px;
		background: var(--vscode-editor-background);
		line-height: 1.5em;

		.description-wrapper {
			/* This mask fades out the end of text so the "see more" message can be displayed over it. */
			mask-image:
				linear-gradient(to right, rgba(0, 0, 0, 1) calc(100% - 7em), rgba(0, 0, 0, 0) calc(100% - 4.5em)),
				linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 1.2em, rgba(0, 0, 0, 1) 0.15em, rgba(0, 0, 0, 1) 100%);
			mask-repeat: no-repeat, no-repeat;
			pointer-events: none;
			/* Two lines tall, relative to font size (line-height is 1.5em) */
			max-height: calc(2 * 1.5em);
		}

		.see-more {
			display: block;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/media/chatTerminalToolProgressPart.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/media/chatTerminalToolProgressPart.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.chat-terminal-content-part {
	flex: 1 1 auto;
	min-width: 0;
}

.chat-terminal-content-part .chat-terminal-content-title {
	border: 1px solid var(--vscode-chat-requestBorder);
	border-radius: 4px;
	padding: 0px 9px 0px 5px;
	max-width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	gap: 12px;

	.rendered-markdown {
		display: flex;
		column-gap: 4px;

		p {
			margin: 0 !important;
		}

		.monaco-tokenized-source {
			background: transparent !important;
		}
	}
}

.chat-terminal-content-part .chat-terminal-content-title .chat-terminal-command-block {
	display: flex;
	gap: 0px;
	align-items: flex-start;
	flex: 1 1 auto;
	min-width: 0;
	padding-top: 1px;
}

.chat-terminal-content-part .chat-terminal-content-title .chat-terminal-command-block > .rendered-markdown {
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	column-gap: 4px;
	align-items: center;
}

.chat-terminal-content-part .chat-terminal-content-title .chat-terminal-command-block > .rendered-markdown p {
	display: inline-flex;
	align-items: center;
	column-gap: 4px;
	margin: 0 !important;
}

.chat-terminal-content-part .chat-terminal-content-title .chat-terminal-command-block > .rendered-markdown .monaco-tokenized-source {
	background: transparent !important;
}

.chat-terminal-content-part .chat-terminal-content-title .chat-terminal-command-block > .rendered-markdown code {
	font-size: var(--vscode-chat-font-size-body-xs);
}

.chat-terminal-content-part .chat-terminal-content-title .chat-terminal-command-block .chat-terminal-command-decoration,
.chat-terminal-content-part .chat-terminal-content-title .chat-terminal-command-block .terminal-command-decoration {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 13px;
	width: 16px;
	height: 16px;
	flex-shrink: 0;
	margin-top: 2px;
}

.chat-terminal-content-part .chat-terminal-content-title .chat-terminal-command-block .chat-terminal-command-decoration.success,
.chat-terminal-content-part .chat-terminal-content-title .chat-terminal-command-block .terminal-command-decoration.success {
	color: var(--vscode-terminalCommandDecoration-successBackground) !important;
}

.chat-terminal-content-part .chat-terminal-content-title .chat-terminal-command-block .chat-terminal-command-decoration.default-color,
.chat-terminal-content-part .chat-terminal-content-title .chat-terminal-command-block .terminal-command-decoration.default-color {
	color: var(--vscode-terminalCommandDecoration-defaultBackground) !important;
}

.chat-terminal-content-part .chat-terminal-content-title .chat-terminal-command-block .chat-terminal-command-decoration.error,
.chat-terminal-content-part .chat-terminal-content-title .chat-terminal-command-block .terminal-command-decoration.error {
	color: var(--vscode-terminalCommandDecoration-errorBackground) !important;
}

.chat-terminal-content-part .chat-terminal-content-title .chat-terminal-command-block .chat-terminal-command-decoration.default,
.chat-terminal-content-part .chat-terminal-content-title .chat-terminal-command-block .terminal-command-decoration.default {
	pointer-events: none;
}

.chat-terminal-content-part .chat-terminal-content-title .chat-terminal-command-block .chat-terminal-command-decoration:focus-visible,
.chat-terminal-content-part .chat-terminal-content-title .chat-terminal-command-block .terminal-command-decoration:focus-visible {
	outline: 1px solid var(--vscode-focusBorder);
	outline-offset: 2px;
}

.chat-terminal-content-part .chat-terminal-action-bar {
	display: flex;
	gap: 4px;
	margin-left: auto;
	align-self: flex-start;
}

.chat-terminal-content-part .chat-terminal-content-message {
	.rendered-markdown {
		white-space: normal;
		line-height: normal;

		& > p {
			color: var(--vscode-descriptionForeground);
			font-size: var(--vscode-chat-font-size-body-s);
			margin: 0 !important;

			code {
				font-size: var(--vscode-chat-font-size-body-xs);
			}
		}
	}
}

.chat-terminal-output-container.collapsed { display: none; }
.chat-terminal-output-container {
	border: 1px solid var(--vscode-chat-requestBorder);
	border-bottom-left-radius: 4px;
	border-bottom-right-radius: 4px;
	max-height: 300px;
	box-sizing: border-box;
	overflow: hidden;
	position: relative;
	max-width: 100%;
	padding: 0;
}

.chat-terminal-content-part .chat-terminal-content-title.chat-terminal-content-title-no-bottom-radius {
	border-bottom-left-radius: 0px;
	border-bottom-right-radius: 0px;
	border-bottom: 0;
}

.chat-terminal-output-container.expanded { display: block; }
.chat-terminal-output-container > .monaco-scrollable-element {
	width: 100%;
	background: inherit;
}
.chat-terminal-output-container.chat-terminal-output-container-no-output .chat-terminal-output-body {
	padding-bottom: 5px;
}
.chat-terminal-output-container:focus-visible {
	outline: 1px solid var(--vscode-focusBorder);
	outline-offset: 2px;
}
div.chat-terminal-content-part.progress-step > div.chat-terminal-output-container.expanded > div > div.chat-terminal-output-body > div > div.chat-terminal-output-terminal > div > div.xterm-scrollable-element {
	margin-left: -12px;
	margin-right: -12px;
	padding-left: 12px;
	padding-right: 12px;
	box-sizing: border-box;
	background: inherit;
}
.chat-terminal-output-body {
	padding: 5px 0px 1px;
	max-width: 100%;
	box-sizing: border-box;
	min-height: 0;
	background: inherit;
}
.chat-terminal-output-content {
	background: inherit;
}
.chat-terminal-output-terminal {
	background: inherit;
}
.chat-terminal-output-terminal .xterm-viewport {
	background: inherit !important;
}
.chat-terminal-output-terminal.chat-terminal-output-terminal-no-output {
	display: none;
}
.chat-terminal-output {
	margin: 0;
	white-space: pre;
	font-size: 12px;
}

.chat-terminal-output-empty {
	display: none;
	font-style: italic;
	color: var(--vscode-descriptionForeground);
	line-height: normal;
	padding-left: 12px;
}
.chat-terminal-output-terminal.chat-terminal-output-terminal-no-output ~ .chat-terminal-output-empty {
	display: block;
}

.chat-terminal-output-container .xterm-scrollable-element .scrollbar {
	display: none;
}

.chat-terminal-output div,
.chat-terminal-output span {
	height: auto;
	line-height: normal;
}

.chat-terminal-output pre {
	margin: 0;
}
.chat-terminal-output-info {
	color: var(--vscode-descriptionForeground);
	font-size: var(--vscode-chat-font-size-body-xs);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/media/chatThinkingContent.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/media/chatThinkingContent.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.interactive-session .interactive-response .chat-used-context-list.chat-thinking-items {
	color: var(--vscode-descriptionForeground);
	padding-top: 0;
}

.interactive-session .interactive-response .value .chat-thinking-box {
	outline: none;
	position: relative;
	color: var(--vscode-descriptionForeground);

	.chat-used-context {
		margin: 0px;
	}

	.monaco-button.hidden,
	.chat-pinned-preview.hidden {
		display: none;
	}

	.chat-used-context-list.chat-thinking-collapsible {
		border: 1px solid var(--vscode-chat-requestBorder);
		border-radius: 4px;
		margin-bottom: 0;
		position: relative;
		overflow: hidden;

		.chat-tool-invocation-part {
			padding: 3px 12px 4px 18px;
			position: relative;

			.chat-used-context {
				margin-bottom: 0px;
				margin-left: 2px;
				padding-left: 2px;
			}

			.progress-container {
				margin: 0 0 2px 6px;
			}

			.codicon {
				display: none;
			}
		}

		.chat-thinking-item.markdown-content {
			padding: 5px 12px 6px 24px;
			position: relative;
			font-size: var(--vscode-chat-font-size-body-s);

			.progress-container {
				margin-bottom: 0px;
				padding-top: 0px;
			}

			[data-code] {
				background-color: var(--vscode-textPreformat-background);
				padding: 1px 3px;
				border-radius: 4px;
				border: 1px solid var(--vscode-textPreformat-border);
				white-space: pre-wrap;
			}
		}

		/* chain of thought lines */
		.chat-tool-invocation-part,
		.chat-thinking-item.markdown-content {

			&::before {
				content: '';
				position: absolute;
				left: 10.5px;
				top: 0px;
				bottom: 0px;
				width: 1px;
				border-radius: 0;
				background-color: var(--vscode-chat-requestBorder);
				mask-image: linear-gradient(to bottom, #000 0 9px, transparent 9px 21px, #000 21px 100%);
			}

			&:first-child::before {
				mask-image: linear-gradient(to bottom, transparent 0 21px, #000 21px 100%);
			}

			&:last-child::before {
				mask-image: linear-gradient(to bottom, #000 0 9px, transparent 9px 100%);
			}

			&:only-child::before {
				background: none;
				mask-image: none;
			}

			&::after {
				content: '';
				position: absolute;
				left: 8px;
				top: 12px;
				width: 6px;
				height: 6px;
				border-radius: 50%;
				background-color: var(--vscode-chat-requestBorder);
			}

		}
	}

	.chat-thinking-item {
		padding: 6px 12px;
		position: relative;

		.progress-container {
			margin-bottom: 0px;
			padding-top: 0px;
		}
	}

	.chat-thinking-text {
		font-size: var(--vscode-chat-font-size-body-s);
		padding: 0 10px;
		display: block;
	}

	.rendered-markdown > p {
		margin: 0;
	}
}

.interactive-session .interactive-response .value .chat-thinking-fixed-mode {
	outline: none;

	&.chat-used-context-collapsed .chat-used-context-list.chat-thinking-collapsible.chat-thinking-streaming {
		max-height: 200px;
		overflow: hidden;
		display: block;
	}

	&:not(.chat-used-context-collapsed) .chat-used-context-list.chat-thinking-collapsible.chat-thinking-streaming {
		max-height: none;
		overflow: visible;
		display: block;
	}

	.chat-used-context-list.chat-thinking-collapsible:not(.chat-thinking-streaming) {
		max-height: none;
		overflow: visible;
	}
}

.editor-instance .interactive-session .interactive-response .value .chat-thinking-box .chat-thinking-item ::before {
	background: var(--vscode-editor-background);
}

.interactive-session .interactive-response .value .chat-thinking-box .chat-used-context-label code {
	display: inline;
	line-height: inherit;
	padding: 0 4px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/abstractToolConfirmationSubPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/abstractToolConfirmationSubPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Separator } from '../../../../../../base/common/actions.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { toDisposable } from '../../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../../nls.js';
import { IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../../platform/keybinding/common/keybinding.js';
import { ChatContextKeys } from '../../../common/chatContextKeys.js';
import { ConfirmedReason, IChatToolInvocation, ToolConfirmKind } from '../../../common/chatService.js';
import { ILanguageModelToolsService } from '../../../common/languageModelToolsService.js';
import { IChatWidgetService } from '../../chat.js';
import { ChatCustomConfirmationWidget, IChatConfirmationButton } from '../chatConfirmationWidget.js';
import { IChatContentPartRenderContext } from '../chatContentParts.js';
import { BaseChatToolInvocationSubPart } from './chatToolInvocationSubPart.js';

export interface IToolConfirmationConfig {
	allowActionId: string;
	skipActionId: string;
	allowLabel: string;
	skipLabel: string;
	partType: string;
	subtitle?: string;
}

type AbstractToolPrimaryAction = IChatConfirmationButton<(() => void)> | Separator;

/**
 * Base class for a tool confirmation.
 *
 * note that implementors MUST call render() after they construct.
 */
export abstract class AbstractToolConfirmationSubPart extends BaseChatToolInvocationSubPart {
	public domNode!: HTMLElement;

	constructor(
		protected override readonly toolInvocation: IChatToolInvocation,
		protected readonly context: IChatContentPartRenderContext,
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
		@IKeybindingService protected readonly keybindingService: IKeybindingService,
		@IContextKeyService protected readonly contextKeyService: IContextKeyService,
		@IChatWidgetService protected readonly chatWidgetService: IChatWidgetService,
		@ILanguageModelToolsService protected readonly languageModelToolsService: ILanguageModelToolsService,
	) {
		super(toolInvocation);

		if (toolInvocation.kind !== 'toolInvocation') {
			throw new Error('Confirmation only works with live tool invocations');
		}
	}
	protected render(config: IToolConfirmationConfig) {
		const { keybindingService, languageModelToolsService, toolInvocation } = this;
		const allowKeybinding = keybindingService.lookupKeybinding(config.allowActionId)?.getLabel();
		const allowTooltip = allowKeybinding ? `${config.allowLabel} (${allowKeybinding})` : config.allowLabel;
		const skipKeybinding = keybindingService.lookupKeybinding(config.skipActionId)?.getLabel();
		const skipTooltip = skipKeybinding ? `${config.skipLabel} (${skipKeybinding})` : config.skipLabel;


		const additionalActions = this.additionalPrimaryActions();
		const buttons: IChatConfirmationButton<(() => void)>[] = [
			{
				label: config.allowLabel,
				tooltip: allowTooltip,
				data: () => {
					this.confirmWith(toolInvocation, { type: ToolConfirmKind.UserAction });
				},
				moreActions: additionalActions.length > 0 ? additionalActions : undefined,
			},
			{
				label: localize('skip', "Skip"),
				tooltip: skipTooltip,
				data: () => {
					this.confirmWith(toolInvocation, { type: ToolConfirmKind.Skipped });
				},
				isSecondary: true,
			}
		];

		const contentElement = this.createContentElement();
		const tool = languageModelToolsService.getTool(toolInvocation.toolId);
		const confirmWidget = this._register(this.instantiationService.createInstance(
			ChatCustomConfirmationWidget<(() => void)>,
			this.context,
			{
				title: this.getTitle(),
				icon: tool?.icon && 'id' in tool.icon ? tool.icon : Codicon.tools,
				subtitle: config.subtitle,
				buttons,
				message: contentElement,
				toolbarData: {
					arg: toolInvocation,
					partType: config.partType,
					partSource: toolInvocation.source.type
				}
			}
		));

		const hasToolConfirmation = ChatContextKeys.Editing.hasToolConfirmation.bindTo(this.contextKeyService);
		hasToolConfirmation.set(true);

		this._register(confirmWidget.onDidClick(button => {
			button.data();
			this.chatWidgetService.getWidgetBySessionResource(this.context.element.sessionResource)?.focusInput();
		}));

		this._register(confirmWidget.onDidChangeHeight(() => this._onDidChangeHeight.fire()));
		this._register(toDisposable(() => hasToolConfirmation.reset()));

		this.domNode = confirmWidget.domNode;
	}

	protected confirmWith(toolInvocation: IChatToolInvocation, reason: ConfirmedReason): void {
		IChatToolInvocation.confirmWith(toolInvocation, reason);
	}

	protected additionalPrimaryActions(): AbstractToolPrimaryAction[] {
		return [];
	}

	protected abstract createContentElement(): HTMLElement | string;
	protected abstract getTitle(): string;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/autoApproveMessageWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/autoApproveMessageWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMarkdownString } from '../../../../../../base/common/htmlContent.js';

export class AutoApproveMessageWidget {
	constructor(public readonly message: IMarkdownString) { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatExtensionsInstallToolSubPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatExtensionsInstallToolSubPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../../base/browser/dom.js';
import { Emitter } from '../../../../../../base/common/event.js';
import { toDisposable } from '../../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../../nls.js';
import { IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IExtensionManagementService } from '../../../../../../platform/extensionManagement/common/extensionManagement.js';
import { areSameExtensions } from '../../../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../../platform/keybinding/common/keybinding.js';
import { ChatContextKeys } from '../../../common/chatContextKeys.js';
import { ConfirmedReason, IChatToolInvocation, ToolConfirmKind } from '../../../common/chatService.js';
import { CancelChatActionId } from '../../actions/chatExecuteActions.js';
import { AcceptToolConfirmationActionId } from '../../actions/chatToolActions.js';
import { IChatWidgetService } from '../../chat.js';
import { ChatConfirmationWidget, IChatConfirmationButton } from '../chatConfirmationWidget.js';
import { IChatContentPartRenderContext } from '../chatContentParts.js';
import { ChatExtensionsContentPart } from '../chatExtensionsContentPart.js';
import { BaseChatToolInvocationSubPart } from './chatToolInvocationSubPart.js';

export class ExtensionsInstallConfirmationWidgetSubPart extends BaseChatToolInvocationSubPart {
	public readonly domNode: HTMLElement;
	private readonly _confirmWidget?: ChatConfirmationWidget<ConfirmedReason>;

	public get codeblocks() {
		return this._confirmWidget?.codeblocks || [];
	}

	public override get codeblocksPartId() {
		return this._confirmWidget?.codeblocksPartId || '<none>';
	}

	constructor(
		toolInvocation: IChatToolInvocation,
		context: IChatContentPartRenderContext,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IChatWidgetService chatWidgetService: IChatWidgetService,
		@IExtensionManagementService extensionManagementService: IExtensionManagementService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super(toolInvocation);

		if (toolInvocation.toolSpecificData?.kind !== 'extensions') {
			throw new Error('Tool specific data is missing or not of kind extensions');
		}

		const extensionsContent = toolInvocation.toolSpecificData;
		this.domNode = dom.$('');
		const chatExtensionsContentPart = this._register(instantiationService.createInstance(ChatExtensionsContentPart, extensionsContent));
		this._register(chatExtensionsContentPart.onDidChangeHeight(() => this._onDidChangeHeight.fire()));
		dom.append(this.domNode, chatExtensionsContentPart.domNode);

		if (toolInvocation.state.get().type === IChatToolInvocation.StateKind.WaitingForConfirmation) {
			const allowLabel = localize('allow', "Allow");
			const allowKeybinding = keybindingService.lookupKeybinding(AcceptToolConfirmationActionId)?.getLabel();
			const allowTooltip = allowKeybinding ? `${allowLabel} (${allowKeybinding})` : allowLabel;

			const cancelLabel = localize('cancel', "Cancel");
			const cancelKeybinding = keybindingService.lookupKeybinding(CancelChatActionId)?.getLabel();
			const cancelTooltip = cancelKeybinding ? `${cancelLabel} (${cancelKeybinding})` : cancelLabel;
			const enableAllowButtonEvent = this._register(new Emitter<boolean>());

			const buttons: IChatConfirmationButton<ConfirmedReason>[] = [
				{
					label: allowLabel,
					data: { type: ToolConfirmKind.UserAction },
					tooltip: allowTooltip,
					disabled: true,
					onDidChangeDisablement: enableAllowButtonEvent.event
				},
				{
					label: cancelLabel,
					data: { type: ToolConfirmKind.Denied },
					isSecondary: true,
					tooltip: cancelTooltip
				}
			];

			const confirmWidget = this._register(instantiationService.createInstance(
				ChatConfirmationWidget<ConfirmedReason>,
				context,
				{
					title: toolInvocation.confirmationMessages?.title ?? localize('installExtensions', "Install Extensions"),
					message: toolInvocation.confirmationMessages?.message ?? localize('installExtensionsConfirmation', "Click the Install button on the extension and then press Allow when finished."),
					buttons,
				}
			));
			this._confirmWidget = confirmWidget;
			this._register(confirmWidget.onDidChangeHeight(() => this._onDidChangeHeight.fire()));
			dom.append(this.domNode, confirmWidget.domNode);
			this._register(confirmWidget.onDidClick(button => {
				IChatToolInvocation.confirmWith(toolInvocation, button.data);
				chatWidgetService.getWidgetBySessionResource(context.element.sessionResource)?.focusInput();
			}));
			const hasToolConfirmationKey = ChatContextKeys.Editing.hasToolConfirmation.bindTo(contextKeyService);
			hasToolConfirmationKey.set(true);
			this._register(toDisposable(() => hasToolConfirmationKey.reset()));
			const disposable = this._register(extensionManagementService.onInstallExtension(e => {
				if (extensionsContent.extensions.some(id => areSameExtensions({ id }, e.identifier))) {
					disposable.dispose();
					enableAllowButtonEvent.fire(false);
				}
			}));
		}

	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatInputOutputMarkdownProgressPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatInputOutputMarkdownProgressPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ProgressBar } from '../../../../../../base/browser/ui/progressbar/progressbar.js';
import { decodeBase64 } from '../../../../../../base/common/buffer.js';
import { IMarkdownString, createMarkdownCommandLink, MarkdownString } from '../../../../../../base/common/htmlContent.js';
import { Lazy } from '../../../../../../base/common/lazy.js';
import { toDisposable } from '../../../../../../base/common/lifecycle.js';
import { getExtensionForMimeType } from '../../../../../../base/common/mime.js';
import { autorun } from '../../../../../../base/common/observable.js';
import { basename } from '../../../../../../base/common/resources.js';
import { ILanguageService } from '../../../../../../editor/common/languages/language.js';
import { IModelService } from '../../../../../../editor/common/services/model.js';
import { localize } from '../../../../../../nls.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { ChatResponseResource } from '../../../common/chatModel.js';
import { IChatToolInvocation, IChatToolInvocationSerialized, ToolConfirmKind } from '../../../common/chatService.js';
import { IToolResultInputOutputDetails } from '../../../common/languageModelToolsService.js';
import { IChatCodeBlockInfo } from '../../chat.js';
import { IChatContentPartRenderContext } from '../chatContentParts.js';
import { ChatCollapsibleInputOutputContentPart, ChatCollapsibleIOPart, IChatCollapsibleIOCodePart } from '../chatToolInputOutputContentPart.js';
import { BaseChatToolInvocationSubPart } from './chatToolInvocationSubPart.js';

export class ChatInputOutputMarkdownProgressPart extends BaseChatToolInvocationSubPart {
	/** Remembers expanded tool parts on re-render */
	private static readonly _expandedByDefault = new WeakMap<IChatToolInvocation | IChatToolInvocationSerialized, boolean>();

	public readonly domNode: HTMLElement;

	private _codeblocks: IChatCodeBlockInfo[] = [];
	public get codeblocks(): IChatCodeBlockInfo[] {
		return this._codeblocks;
	}

	constructor(
		toolInvocation: IChatToolInvocation | IChatToolInvocationSerialized,
		context: IChatContentPartRenderContext,
		codeBlockStartIndex: number,
		message: string | IMarkdownString,
		subtitle: string | IMarkdownString | undefined,
		input: string,
		output: IToolResultInputOutputDetails['output'] | undefined,
		isError: boolean,
		@IInstantiationService instantiationService: IInstantiationService,
		@IModelService modelService: IModelService,
		@ILanguageService languageService: ILanguageService,
	) {
		super(toolInvocation);

		let codeBlockIndex = codeBlockStartIndex;
		const toCodePart = (data: string): IChatCollapsibleIOCodePart => {
			const model = this._register(modelService.createModel(
				data,
				languageService.createById('json'),
				undefined,
				true
			));

			return {
				kind: 'code',
				textModel: model,
				languageId: model.getLanguageId(),
				options: {
					hideToolbar: true,
					reserveWidth: 19,
					maxHeightInLines: 13,
					verticalPadding: 5,
					editorOptions: {
						wordWrap: 'on'
					}
				},
				codeBlockInfo: {
					codeBlockIndex: codeBlockIndex++,
					codemapperUri: undefined,
					elementId: context.element.id,
					focus: () => { },
					ownerMarkdownPartId: this.codeblocksPartId,
					uri: model.uri,
					chatSessionResource: context.element.sessionResource,
					uriPromise: Promise.resolve(model.uri)
				}
			};
		};

		let processedOutput = output;
		if (typeof output === 'string') { // back compat with older stored versions
			processedOutput = [{ type: 'embed', value: output, isText: true }];
		}

		const collapsibleListPart = this._register(instantiationService.createInstance(
			ChatCollapsibleInputOutputContentPart,
			message,
			subtitle,
			this.getAutoApproveMessageContent(),
			context,
			toCodePart(input),
			processedOutput && {
				parts: processedOutput.map((o, i): ChatCollapsibleIOPart => {
					const permalinkBasename = o.type === 'ref' || o.uri
						? basename(o.uri!)
						: o.mimeType && getExtensionForMimeType(o.mimeType)
							? `file${getExtensionForMimeType(o.mimeType)}`
							: 'file' + (o.isText ? '.txt' : '.bin');


					if (o.type === 'ref') {
						return { kind: 'data', uri: o.uri, mimeType: o.mimeType };
					} else if (o.isText && !o.asResource) {
						return toCodePart(o.value);
					} else {
						let decoded: Uint8Array | undefined;
						try {
							if (!o.isText) {
								decoded = decodeBase64(o.value).buffer;
							}
						} catch {
							// ignored
						}

						// Fall back to text if it's not valid base64
						const permalinkUri = ChatResponseResource.createUri(context.element.sessionResource, toolInvocation.toolCallId, i, permalinkBasename);
						return { kind: 'data', value: decoded || new TextEncoder().encode(o.value), mimeType: o.mimeType, uri: permalinkUri, audience: o.audience };
					}
				}),
			},
			isError,
			ChatInputOutputMarkdownProgressPart._expandedByDefault.get(toolInvocation) ?? false,
		));
		this._codeblocks.push(...collapsibleListPart.codeblocks);
		this._register(collapsibleListPart.onDidChangeHeight(() => this._onDidChangeHeight.fire()));
		this._register(toDisposable(() => ChatInputOutputMarkdownProgressPart._expandedByDefault.set(toolInvocation, collapsibleListPart.expanded)));

		const progressObservable = toolInvocation.kind === 'toolInvocation' ? toolInvocation.state.map((s, r) => s.type === IChatToolInvocation.StateKind.Executing ? s.progress.read(r) : undefined) : undefined;
		const progressBar = new Lazy(() => this._register(new ProgressBar(collapsibleListPart.domNode)));
		if (progressObservable) {
			this._register(autorun(reader => {
				const progress = progressObservable?.read(reader);
				if (progress?.message) {
					collapsibleListPart.title = progress.message;
				}
				if (progress?.progress && !IChatToolInvocation.isComplete(toolInvocation, reader)) {
					progressBar.value.setWorked(progress.progress * 100);
				}
			}));
		}

		this.domNode = collapsibleListPart.domNode;
	}

	private getAutoApproveMessageContent() {
		const reason = IChatToolInvocation.executionConfirmedOrDenied(this.toolInvocation);
		if (!reason || typeof reason === 'boolean') {
			return;
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


		return new MarkdownString(md, { isTrusted: true });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatResultListSubPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatResultListSubPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMarkdownString } from '../../../../../../base/common/htmlContent.js';
import { URI } from '../../../../../../base/common/uri.js';
import { Location } from '../../../../../../editor/common/languages.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IChatToolInvocation, IChatToolInvocationSerialized } from '../../../common/chatService.js';
import { IChatCodeBlockInfo } from '../../chat.js';
import { IChatContentPartRenderContext } from '../chatContentParts.js';
import { ChatCollapsibleListContentPart, CollapsibleListPool, IChatCollapsibleListItem } from '../chatReferencesContentPart.js';
import { BaseChatToolInvocationSubPart } from './chatToolInvocationSubPart.js';

export class ChatResultListSubPart extends BaseChatToolInvocationSubPart {
	public readonly domNode: HTMLElement;
	public readonly codeblocks: IChatCodeBlockInfo[] = [];

	constructor(
		toolInvocation: IChatToolInvocation | IChatToolInvocationSerialized,
		context: IChatContentPartRenderContext,
		message: string | IMarkdownString,
		toolDetails: Array<URI | Location>,
		listPool: CollapsibleListPool,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super(toolInvocation);

		const collapsibleListPart = this._register(instantiationService.createInstance(
			ChatCollapsibleListContentPart,
			toolDetails.map<IChatCollapsibleListItem>(detail => ({
				kind: 'reference',
				reference: detail,
			})),
			message,
			context,
			listPool,
		));
		this._register(collapsibleListPart.onDidChangeHeight(() => this._onDidChangeHeight.fire()));
		this.domNode = collapsibleListPart.domNode;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatTerminalToolConfirmationSubPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatTerminalToolConfirmationSubPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { append, h } from '../../../../../../base/browser/dom.js';
import { HoverStyle } from '../../../../../../base/browser/ui/hover/hover.js';
import { HoverPosition } from '../../../../../../base/browser/ui/hover/hoverWidget.js';
import { Separator } from '../../../../../../base/common/actions.js';
import { asArray } from '../../../../../../base/common/arrays.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { ErrorNoTelemetry } from '../../../../../../base/common/errors.js';
import { createCommandUri, MarkdownString, type IMarkdownString } from '../../../../../../base/common/htmlContent.js';
import { thenIfNotDisposed, thenRegisterOrDispose, toDisposable } from '../../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../../base/common/network.js';
import Severity from '../../../../../../base/common/severity.js';
import { isObject } from '../../../../../../base/common/types.js';
import { URI } from '../../../../../../base/common/uri.js';
import { generateUuid } from '../../../../../../base/common/uuid.js';
import { ILanguageService } from '../../../../../../editor/common/languages/language.js';
import { IModelService } from '../../../../../../editor/common/services/model.js';
import { ITextModelService } from '../../../../../../editor/common/services/resolverService.js';
import { localize } from '../../../../../../nls.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../../../platform/dialogs/common/dialogs.js';
import { IHoverService } from '../../../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../../platform/keybinding/common/keybinding.js';
import { IMarkdownRenderer } from '../../../../../../platform/markdown/browser/markdownRenderer.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../../platform/storage/common/storage.js';
import { IPreferencesService } from '../../../../../services/preferences/common/preferences.js';
import { ITerminalChatService } from '../../../../terminal/browser/terminal.js';
import { TerminalContribCommandId, TerminalContribSettingId } from '../../../../terminal/terminalContribExports.js';
import { migrateLegacyTerminalToolSpecificData } from '../../../common/chat.js';
import { ChatContextKeys } from '../../../common/chatContextKeys.js';
import { IChatToolInvocation, ToolConfirmKind, type IChatTerminalToolInvocationData, type ILegacyChatTerminalToolInvocationData } from '../../../common/chatService.js';
import type { CodeBlockModelCollection } from '../../../common/codeBlockModelCollection.js';
import { AcceptToolConfirmationActionId, SkipToolConfirmationActionId } from '../../actions/chatToolActions.js';
import { IChatCodeBlockInfo, IChatWidgetService } from '../../chat.js';
import { ICodeBlockRenderOptions } from '../../codeBlockPart.js';
import { ChatCustomConfirmationWidget, IChatConfirmationButton } from '../chatConfirmationWidget.js';
import { EditorPool } from '../chatContentCodePools.js';
import { IChatContentPartRenderContext } from '../chatContentParts.js';
import { ChatMarkdownContentPart } from '../chatMarkdownContentPart.js';
import { BaseChatToolInvocationSubPart } from './chatToolInvocationSubPart.js';

export const enum TerminalToolConfirmationStorageKeys {
	TerminalAutoApproveWarningAccepted = 'chat.tools.terminal.autoApprove.warningAccepted'
}

export interface ITerminalNewAutoApproveRule {
	key: string;
	value: boolean | {
		approve: boolean;
		matchCommandLine?: boolean;
	};
}

export type TerminalNewAutoApproveButtonData = (
	{ type: 'enable' } |
	{ type: 'configure' } |
	{ type: 'skip' } |
	{ type: 'newRule'; rule: ITerminalNewAutoApproveRule | ITerminalNewAutoApproveRule[] } |
	{ type: 'sessionApproval' }
);

export class ChatTerminalToolConfirmationSubPart extends BaseChatToolInvocationSubPart {
	public readonly domNode: HTMLElement;
	public readonly codeblocks: IChatCodeBlockInfo[] = [];

	constructor(
		toolInvocation: IChatToolInvocation,
		terminalData: IChatTerminalToolInvocationData | ILegacyChatTerminalToolInvocationData,
		private readonly context: IChatContentPartRenderContext,
		private readonly renderer: IMarkdownRenderer,
		private readonly editorPool: EditorPool,
		private readonly currentWidthDelegate: () => number,
		private readonly codeBlockModelCollection: CodeBlockModelCollection,
		private readonly codeBlockStartIndex: number,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IDialogService private readonly dialogService: IDialogService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IChatWidgetService private readonly chatWidgetService: IChatWidgetService,
		@IPreferencesService private readonly preferencesService: IPreferencesService,
		@IStorageService private readonly storageService: IStorageService,
		@ITerminalChatService private readonly terminalChatService: ITerminalChatService,
		@ITextModelService textModelService: ITextModelService,
		@IHoverService hoverService: IHoverService,
	) {
		super(toolInvocation);

		// Tag for sub-agent styling
		if (toolInvocation.fromSubAgent) {
			context.container.classList.add('from-sub-agent');
		}

		if (!toolInvocation.confirmationMessages?.title) {
			throw new Error('Confirmation messages are missing');
		}

		terminalData = migrateLegacyTerminalToolSpecificData(terminalData);

		const { title, message, disclaimer, terminalCustomActions } = toolInvocation.confirmationMessages;

		const autoApproveEnabled = this.configurationService.getValue(TerminalContribSettingId.EnableAutoApprove) === true;
		const autoApproveWarningAccepted = this.storageService.getBoolean(TerminalToolConfirmationStorageKeys.TerminalAutoApproveWarningAccepted, StorageScope.APPLICATION, false);
		let moreActions: (IChatConfirmationButton<TerminalNewAutoApproveButtonData> | Separator)[] | undefined = undefined;
		if (autoApproveEnabled) {
			moreActions = [];
			if (!autoApproveWarningAccepted) {
				moreActions.push({
					label: localize('autoApprove.enable', 'Enable Auto Approve...'),
					data: {
						type: 'enable'
					}
				});
				moreActions.push(new Separator());
				if (terminalCustomActions) {
					for (const action of terminalCustomActions) {
						if (!(action instanceof Separator)) {
							action.disabled = true;
						}
					}
				}
			}
			if (terminalCustomActions) {
				moreActions.push(...terminalCustomActions);
			}
			if (moreActions.length === 0) {
				moreActions = undefined;
			}
		}

		const codeBlockRenderOptions: ICodeBlockRenderOptions = {
			hideToolbar: true,
			reserveWidth: 19,
			verticalPadding: 5,
			editorOptions: {
				wordWrap: 'on',
				readOnly: false,
				tabFocusMode: true,
				ariaLabel: typeof title === 'string' ? title : title.value
			}
		};
		const languageId = this.languageService.getLanguageIdByLanguageName(terminalData.language ?? 'sh') ?? 'shellscript';
		const model = this._register(this.modelService.createModel(
			terminalData.commandLine.toolEdited ?? terminalData.commandLine.original,
			this.languageService.createById(languageId),
			this._getUniqueCodeBlockUri(),
			true
		));
		thenRegisterOrDispose(textModelService.createModelReference(model.uri), this._store);
		const editor = this._register(this.editorPool.get());
		const renderPromise = editor.object.render({
			codeBlockIndex: this.codeBlockStartIndex,
			codeBlockPartIndex: 0,
			element: this.context.element,
			languageId,
			renderOptions: codeBlockRenderOptions,
			textModel: Promise.resolve(model),
			chatSessionResource: this.context.element.sessionResource
		}, this.currentWidthDelegate());
		this._register(thenIfNotDisposed(renderPromise, () => this._onDidChangeHeight.fire()));
		this.codeblocks.push({
			codeBlockIndex: this.codeBlockStartIndex,
			codemapperUri: undefined,
			elementId: this.context.element.id,
			focus: () => editor.object.focus(),
			ownerMarkdownPartId: this.codeblocksPartId,
			uri: model.uri,
			uriPromise: Promise.resolve(model.uri),
			chatSessionResource: this.context.element.sessionResource
		});
		this._register(editor.object.onDidChangeContentHeight(() => {
			editor.object.layout(this.currentWidthDelegate());
			this._onDidChangeHeight.fire();
		}));
		this._register(model.onDidChangeContent(e => {
			terminalData.commandLine.userEdited = model.getValue();
		}));
		const elements = h('.chat-confirmation-message-terminal', [
			h('.chat-confirmation-message-terminal-editor@editor'),
			h('.chat-confirmation-message-terminal-disclaimer@disclaimer'),
		]);
		append(elements.editor, editor.object.element);
		this._register(hoverService.setupDelayedHover(elements.editor, {
			content: message || '',
			style: HoverStyle.Pointer,
			position: { hoverPosition: HoverPosition.LEFT },
		}));
		const confirmWidget = this._register(this.instantiationService.createInstance(
			ChatCustomConfirmationWidget<TerminalNewAutoApproveButtonData | boolean>,
			this.context,
			{
				title,
				icon: Codicon.terminal,
				message: elements.root,
				buttons: this._createButtons(moreActions)
			},
		));

		if (disclaimer) {
			this._appendMarkdownPart(elements.disclaimer, disclaimer, codeBlockRenderOptions);
		}

		const hasToolConfirmationKey = ChatContextKeys.Editing.hasToolConfirmation.bindTo(this.contextKeyService);
		hasToolConfirmationKey.set(true);
		this._register(toDisposable(() => hasToolConfirmationKey.reset()));

		this._register(confirmWidget.onDidClick(async button => {
			let doComplete = true;
			const data = button.data;
			let toolConfirmKind: ToolConfirmKind = ToolConfirmKind.Denied;
			if (typeof data === 'boolean') {
				if (data) {
					toolConfirmKind = ToolConfirmKind.UserAction;
					// Clear out any auto approve info since this was an explicit user action. This
					// can happen when the auto approve feature is off.
					if (terminalData.autoApproveInfo) {
						terminalData.autoApproveInfo = undefined;
					}
				}
			} else if (typeof data !== 'boolean') {
				switch (data.type) {
					case 'enable': {
						const optedIn = await this._showAutoApproveWarning();
						if (optedIn) {
							this.storageService.store(TerminalToolConfirmationStorageKeys.TerminalAutoApproveWarningAccepted, true, StorageScope.APPLICATION, StorageTarget.USER);
							// This is good to auto approve immediately
							if (!terminalCustomActions) {
								toolConfirmKind = ToolConfirmKind.UserAction;
							}
							// If this would not have been auto approved, enable the options and
							// do not complete
							else {
								for (const action of terminalCustomActions) {
									if (!(action instanceof Separator)) {
										action.disabled = false;
									}
								}

								confirmWidget.updateButtons(this._createButtons(terminalCustomActions));
								doComplete = false;
							}
						} else {
							doComplete = false;
						}
						break;
					}
					case 'skip': {
						toolConfirmKind = ToolConfirmKind.Skipped;
						break;
					}
					case 'newRule': {
						const newRules = asArray(data.rule);
						const inspect = this.configurationService.inspect(TerminalContribSettingId.AutoApprove);
						const oldValue = (inspect.user?.value as Record<string, unknown> | undefined) ?? {};
						let newValue: Record<string, unknown>;
						if (isObject(oldValue)) {
							newValue = { ...oldValue };
							for (const newRule of newRules) {
								newValue[newRule.key] = newRule.value;
							}
						} else {
							this.preferencesService.openSettings({
								jsonEditor: true,
								target: ConfigurationTarget.USER,
								revealSetting: {
									key: TerminalContribSettingId.AutoApprove
								},
							});
							throw new ErrorNoTelemetry(`Cannot add new rule, existing setting is unexpected format`);
						}
						await this.configurationService.updateValue(TerminalContribSettingId.AutoApprove, newValue, ConfigurationTarget.USER);
						function formatRuleLinks(newRules: ITerminalNewAutoApproveRule[]): string {
							return newRules.map(e => {
								const settingsUri = createCommandUri(TerminalContribCommandId.OpenTerminalSettingsLink, ConfigurationTarget.USER);
								return `[\`${e.key}\`](${settingsUri.toString()} "${localize('ruleTooltip', 'View rule in settings')}")`;
							}).join(', ');
						}
						const mdTrustSettings = {
							isTrusted: {
								enabledCommands: [TerminalContribCommandId.OpenTerminalSettingsLink]
							}
						};
						if (newRules.length === 1) {
							terminalData.autoApproveInfo = new MarkdownString(localize('newRule', 'Auto approve rule {0} added', formatRuleLinks(newRules)), mdTrustSettings);
						} else if (newRules.length > 1) {
							terminalData.autoApproveInfo = new MarkdownString(localize('newRule.plural', 'Auto approve rules {0} added', formatRuleLinks(newRules)), mdTrustSettings);
						}
						toolConfirmKind = ToolConfirmKind.UserAction;
						break;
					}
					case 'configure': {
						this.preferencesService.openSettings({
							target: ConfigurationTarget.USER,
							query: `@id:${TerminalContribSettingId.AutoApprove}`,
						});
						doComplete = false;
						break;
					}
					case 'sessionApproval': {
						const sessionId = this.context.element.sessionId;
						this.terminalChatService.setChatSessionAutoApproval(sessionId, true);
						const disableUri = createCommandUri(TerminalContribCommandId.DisableSessionAutoApproval, sessionId);
						const mdTrustSettings = {
							isTrusted: {
								enabledCommands: [TerminalContribCommandId.DisableSessionAutoApproval]
							}
						};
						terminalData.autoApproveInfo = new MarkdownString(`${localize('sessionApproval', 'All commands will be auto approved for this session')} ([${localize('sessionApproval.disable', 'Disable')}](${disableUri.toString()}))`, mdTrustSettings);
						toolConfirmKind = ToolConfirmKind.UserAction;
						break;
					}
				}
			}

			if (doComplete) {
				IChatToolInvocation.confirmWith(toolInvocation, { type: toolConfirmKind });
				this.chatWidgetService.getWidgetBySessionResource(this.context.element.sessionResource)?.focusInput();
			}
		}));
		this._register(confirmWidget.onDidChangeHeight(() => this._onDidChangeHeight.fire()));

		this.domNode = confirmWidget.domNode;
	}

	private _createButtons(moreActions: (IChatConfirmationButton<TerminalNewAutoApproveButtonData> | Separator)[] | undefined): IChatConfirmationButton<boolean | TerminalNewAutoApproveButtonData>[] {
		const getLabelAndTooltip = (label: string, actionId: string, tooltipDetail: string = label): { label: string; tooltip: string } => {
			const keybinding = this.keybindingService.lookupKeybinding(actionId)?.getLabel();
			const tooltip = keybinding ? `${tooltipDetail} (${keybinding})` : (tooltipDetail);
			return { label, tooltip };
		};
		return [
			{
				...getLabelAndTooltip(localize('tool.allow', "Allow"), AcceptToolConfirmationActionId),
				data: true,
				moreActions,
			},
			{
				...getLabelAndTooltip(localize('tool.skip', "Skip"), SkipToolConfirmationActionId, localize('skip.detail', 'Proceed without executing this command')),
				data: { type: 'skip' },
				isSecondary: true,
			},
		];
	}

	private async _showAutoApproveWarning(): Promise<boolean> {
		const promptResult = await this.dialogService.prompt({
			type: Severity.Info,
			message: localize('autoApprove.title', 'Enable terminal auto approve?'),
			buttons: [{
				label: localize('autoApprove.button.enable', 'Enable'),
				run: () => true
			}],
			cancelButton: true,
			custom: {
				icon: Codicon.shield,
				markdownDetails: [{
					markdown: new MarkdownString(localize('autoApprove.markdown', 'This will enable a configurable subset of commands to run in the terminal autonomously. It provides *best effort protections* and assumes the agent is not acting maliciously.')),
				}, {
					markdown: new MarkdownString(`[${localize('autoApprove.markdown2', 'Learn more about the potential risks and how to avoid them.')}](https://code.visualstudio.com/docs/copilot/security#_security-considerations)`)
				}],
			}
		});
		return promptResult.result === true;
	}

	private _getUniqueCodeBlockUri() {
		return URI.from({
			scheme: Schemas.vscodeChatCodeBlock,
			path: generateUuid(),
		});
	}

	private _appendMarkdownPart(container: HTMLElement, message: string | IMarkdownString, codeBlockRenderOptions: ICodeBlockRenderOptions) {
		const part = this._register(this.instantiationService.createInstance(ChatMarkdownContentPart,
			{
				kind: 'markdownContent',
				content: typeof message === 'string' ? new MarkdownString().appendMarkdown(message) : message
			},
			this.context,
			this.editorPool,
			false,
			this.codeBlockStartIndex,
			this.renderer,
			undefined,
			this.currentWidthDelegate(),
			this.codeBlockModelCollection,
			{ codeBlockRenderOptions },
		));
		append(container, part.domNode);
		this._register(part.onDidChangeHeight(() => this._onDidChangeHeight.fire()));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatTerminalToolProgressPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatTerminalToolProgressPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { h } from '../../../../../../base/browser/dom.js';
import { ActionBar } from '../../../../../../base/browser/ui/actionbar/actionbar.js';
import { isMarkdownString, MarkdownString } from '../../../../../../base/common/htmlContent.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { migrateLegacyTerminalToolSpecificData } from '../../../common/chat.js';
import { IChatToolInvocation, IChatToolInvocationSerialized, type IChatMarkdownContent, type IChatTerminalToolInvocationData, type ILegacyChatTerminalToolInvocationData } from '../../../common/chatService.js';
import { CodeBlockModelCollection } from '../../../common/codeBlockModelCollection.js';
import { IChatCodeBlockInfo, IChatWidgetService } from '../../chat.js';
import { ChatQueryTitlePart } from '../chatConfirmationWidget.js';
import { IChatContentPartRenderContext } from '../chatContentParts.js';
import { ChatMarkdownContentPart, type IChatMarkdownContentPartOptions } from '../chatMarkdownContentPart.js';
import { ChatProgressSubPart } from '../chatProgressContentPart.js';
import { BaseChatToolInvocationSubPart } from './chatToolInvocationSubPart.js';
import '../media/chatTerminalToolProgressPart.css';
import type { ICodeBlockRenderOptions } from '../../codeBlockPart.js';
import { Action, IAction } from '../../../../../../base/common/actions.js';
import { IChatTerminalToolProgressPart, ITerminalChatService, ITerminalConfigurationService, ITerminalEditorService, ITerminalGroupService, ITerminalInstance, ITerminalService } from '../../../../terminal/browser/terminal.js';
import { Disposable, MutableDisposable, toDisposable, type IDisposable } from '../../../../../../base/common/lifecycle.js';
import { Emitter } from '../../../../../../base/common/event.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { DecorationSelector, getTerminalCommandDecorationState, getTerminalCommandDecorationTooltip } from '../../../../terminal/browser/xterm/decorationStyles.js';
import * as dom from '../../../../../../base/browser/dom.js';
import { DomScrollableElement } from '../../../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { ScrollbarVisibility } from '../../../../../../base/common/scrollable.js';
import { localize } from '../../../../../../nls.js';
import { ITerminalCommand, TerminalCapability, type ICommandDetectionCapability } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import { IMarkdownRenderer } from '../../../../../../platform/markdown/browser/markdownRenderer.js';
import { IHoverService } from '../../../../../../platform/hover/browser/hover.js';
import { URI } from '../../../../../../base/common/uri.js';
import { stripIcons } from '../../../../../../base/common/iconLabels.js';
import { IAccessibleViewService } from '../../../../../../platform/accessibility/browser/accessibleView.js';
import { IContextKey, IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { AccessibilityVerbositySettingId } from '../../../../accessibility/browser/accessibilityConfiguration.js';
import { ChatContextKeys } from '../../../common/chatContextKeys.js';
import { EditorPool } from '../chatContentCodePools.js';
import { IKeybindingService } from '../../../../../../platform/keybinding/common/keybinding.js';
import { DetachedTerminalCommandMirror, DetachedTerminalSnapshotMirror } from '../../../../terminal/browser/chatTerminalCommandMirror.js';
import { TerminalLocation } from '../../../../../../platform/terminal/common/terminal.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { TerminalContribCommandId } from '../../../../terminal/terminalContribExports.js';
import { ITelemetryService } from '../../../../../../platform/telemetry/common/telemetry.js';
import { isNumber } from '../../../../../../base/common/types.js';
import { removeAnsiEscapeCodes } from '../../../../../../base/common/strings.js';
import { PANEL_BACKGROUND } from '../../../../../common/theme.js';
import { editorBackground } from '../../../../../../platform/theme/common/colorRegistry.js';
import { IThemeService } from '../../../../../../platform/theme/common/themeService.js';

const MIN_OUTPUT_ROWS = 1;
const MAX_OUTPUT_ROWS = 10;

/**
 * Remembers whether a tool invocation was last expanded so state survives virtualization re-renders.
 */
const expandedStateByInvocation = new WeakMap<IChatToolInvocation | IChatToolInvocationSerialized, boolean>();

/**
 * Options for configuring a terminal command decoration.
 */
interface ITerminalCommandDecorationOptions {
	/**
	 * The terminal data associated with the tool invocation.
	 */
	readonly terminalData: IChatTerminalToolInvocationData;

	/**
	 * Returns the HTML element representing the command block in the terminal output.
	 * May return `undefined` if the command block is not currently rendered.
	 * Called when attaching the decoration to the command block container.
	 */
	getCommandBlock(): HTMLElement | undefined;

	/**
	 * Returns the HTML element representing the icon for the command, if any.
	 * May return `undefined` if no icon is present.
	 * Used to determine where to insert the decoration relative to the icon.
	 */
	getIconElement(): HTMLElement | undefined;

	/**
	 * Returns the resolved terminal command associated with this decoration, if available.
	 * May return `undefined` if the command has not been resolved yet.
	 * Used to access command metadata for the decoration.
	 */
	getResolvedCommand(): ITerminalCommand | undefined;
}

class TerminalCommandDecoration extends Disposable {
	private readonly _element: HTMLElement;
	private _interactionElement: HTMLElement | undefined;

	constructor(
		private readonly _options: ITerminalCommandDecorationOptions,
		@IHoverService private readonly _hoverService: IHoverService
	) {
		super();
		const decorationElements = h('span.chat-terminal-command-decoration@decoration', { role: 'img', tabIndex: 0 });
		this._element = decorationElements.decoration;
		this._attachElementToContainer();
	}

	private _attachElementToContainer(): void {
		const container = this._options.getCommandBlock();
		if (!container) {
			return;
		}

		const decoration = this._element;
		if (!decoration.isConnected || decoration.parentElement !== container) {
			const icon = this._options.getIconElement();
			if (icon && icon.parentElement === container) {
				icon.insertAdjacentElement('afterend', decoration);
			} else {
				container.insertBefore(decoration, container.firstElementChild ?? null);
			}
		}

		this._register(this._hoverService.setupDelayedHover(decoration, () => ({
			content: this._getHoverText()
		})));
		this._attachInteractionHandlers(decoration);
	}

	private _getHoverText(): string {
		const command = this._options.getResolvedCommand();
		const storedState = this._options.terminalData.terminalCommandState;
		return getTerminalCommandDecorationTooltip(command, storedState) || '';
	}

	public update(command?: ITerminalCommand): void {
		this._attachElementToContainer();
		const decoration = this._element;
		const resolvedCommand = command ?? this._options.getResolvedCommand();
		this._apply(decoration, resolvedCommand);
	}

	private _apply(decoration: HTMLElement, command: ITerminalCommand | undefined): void {
		const terminalData = this._options.terminalData;
		let storedState = terminalData.terminalCommandState;

		if (command) {
			const existingState = terminalData.terminalCommandState ?? {};
			terminalData.terminalCommandState = {
				...existingState,
				exitCode: command.exitCode,
				timestamp: command.timestamp ?? existingState.timestamp,
				duration: command.duration ?? existingState.duration
			};
			storedState = terminalData.terminalCommandState;
		} else if (!storedState) {
			const now = Date.now();
			terminalData.terminalCommandState = { exitCode: undefined, timestamp: now };
			storedState = terminalData.terminalCommandState;
		}

		const decorationState = getTerminalCommandDecorationState(command, storedState);
		const tooltip = getTerminalCommandDecorationTooltip(command, storedState);

		decoration.className = `chat-terminal-command-decoration ${DecorationSelector.CommandDecoration}`;
		decoration.classList.add(DecorationSelector.Codicon);
		for (const className of decorationState.classNames) {
			decoration.classList.add(className);
		}
		decoration.classList.add(...ThemeIcon.asClassNameArray(decorationState.icon));
		const isInteractive = !decoration.classList.contains(DecorationSelector.Default);
		decoration.tabIndex = isInteractive ? 0 : -1;
		if (isInteractive) {
			decoration.removeAttribute('aria-disabled');
		} else {
			decoration.setAttribute('aria-disabled', 'true');
		}
		const hoverText = tooltip || decorationState.hoverMessage;
		if (hoverText) {
			decoration.setAttribute('aria-label', hoverText);
		} else {
			decoration.removeAttribute('aria-label');
		}
	}

	private _attachInteractionHandlers(decoration: HTMLElement): void {
		if (this._interactionElement === decoration) {
			return;
		}
		this._interactionElement = decoration;
	}
}

export class ChatTerminalToolProgressPart extends BaseChatToolInvocationSubPart implements IChatTerminalToolProgressPart {
	public readonly domNode: HTMLElement;

	private readonly _actionBar: ActionBar;

	private readonly _titleElement: HTMLElement;
	private readonly _outputView: ChatTerminalToolOutputSection;
	private readonly _terminalOutputContextKey: IContextKey<boolean>;
	private _terminalSessionRegistration: IDisposable | undefined;
	private readonly _elementIndex: number;
	private readonly _contentIndex: number;
	private readonly _sessionResource: URI;

	private readonly _showOutputAction = this._register(new MutableDisposable<ToggleChatTerminalOutputAction>());
	private _showOutputActionAdded = false;
	private readonly _focusAction = this._register(new MutableDisposable<FocusChatInstanceAction>());

	private readonly _terminalData: IChatTerminalToolInvocationData;
	private _terminalCommandUri: URI | undefined;
	private _storedCommandId: string | undefined;
	private readonly _commandText: string;
	private readonly _isSerializedInvocation: boolean;
	private _terminalInstance: ITerminalInstance | undefined;
	private readonly _decoration: TerminalCommandDecoration;

	private markdownPart: ChatMarkdownContentPart | undefined;
	public get codeblocks(): IChatCodeBlockInfo[] {
		return this.markdownPart?.codeblocks ?? [];
	}

	public get elementIndex(): number {
		return this._elementIndex;
	}

	public get contentIndex(): number {
		return this._contentIndex;
	}

	constructor(
		toolInvocation: IChatToolInvocation | IChatToolInvocationSerialized,
		terminalData: IChatTerminalToolInvocationData | ILegacyChatTerminalToolInvocationData,
		context: IChatContentPartRenderContext,
		renderer: IMarkdownRenderer,
		editorPool: EditorPool,
		currentWidthDelegate: () => number,
		codeBlockStartIndex: number,
		codeBlockModelCollection: CodeBlockModelCollection,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITerminalChatService private readonly _terminalChatService: ITerminalChatService,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IChatWidgetService private readonly _chatWidgetService: IChatWidgetService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
	) {
		super(toolInvocation);

		this._elementIndex = context.elementIndex;
		this._contentIndex = context.contentIndex;
		this._sessionResource = context.element.sessionResource;

		terminalData = migrateLegacyTerminalToolSpecificData(terminalData);
		this._terminalData = terminalData;
		this._terminalCommandUri = terminalData.terminalCommandUri ? URI.revive(terminalData.terminalCommandUri) : undefined;
		this._storedCommandId = this._terminalCommandUri ? new URLSearchParams(this._terminalCommandUri.query ?? '').get('command') ?? undefined : undefined;
		this._isSerializedInvocation = (toolInvocation.kind === 'toolInvocationSerialized');

		const elements = h('.chat-terminal-content-part@container', [
			h('.chat-terminal-content-title@title', [
				h('.chat-terminal-command-block@commandBlock')
			]),
			h('.chat-terminal-content-message@message')
		]);
		this._titleElement = elements.title;

		const command = terminalData.commandLine.userEdited ?? terminalData.commandLine.toolEdited ?? terminalData.commandLine.original;
		this._commandText = command;
		this._terminalOutputContextKey = ChatContextKeys.inChatTerminalToolOutput.bindTo(this._contextKeyService);

		this._decoration = this._register(this._instantiationService.createInstance(TerminalCommandDecoration, {
			terminalData: this._terminalData,
			getCommandBlock: () => elements.commandBlock,
			getIconElement: () => undefined,
			getResolvedCommand: () => this._getResolvedCommand()
		}));

		const titlePart = this._register(_instantiationService.createInstance(
			ChatQueryTitlePart,
			elements.commandBlock,
			new MarkdownString([
				`\`\`\`${terminalData.language}`,
				`${command.replaceAll('```', '\\`\\`\\`')}`,
				`\`\`\``
			].join('\n'), { supportThemeIcons: true }),
			undefined,
		));
		this._register(titlePart.onDidChangeHeight(() => {
			this._decoration.update();
			this._onDidChangeHeight.fire();
		}));

		this._outputView = this._register(this._instantiationService.createInstance(
			ChatTerminalToolOutputSection,
			() => this._onDidChangeHeight.fire(),
			() => this._ensureTerminalInstance(),
			() => this._getResolvedCommand(),
			() => this._terminalData.terminalCommandOutput,
			() => this._commandText,
			() => this._terminalData.terminalTheme,
		));
		elements.container.append(this._outputView.domNode);
		this._register(this._outputView.onDidFocus(() => this._handleOutputFocus()));
		this._register(this._outputView.onDidBlur(e => this._handleOutputBlur(e)));
		this._register(toDisposable(() => this._handleDispose()));
		this._register(this._keybindingService.onDidUpdateKeybindings(() => {
			this._focusAction.value?.refreshKeybindingTooltip();
			this._showOutputAction.value?.refreshKeybindingTooltip();
		}));


		const actionBarEl = h('.chat-terminal-action-bar@actionBar');
		elements.title.append(actionBarEl.root);
		this._actionBar = this._register(new ActionBar(actionBarEl.actionBar, {}));
		this._initializeTerminalActions();
		this._terminalService.whenConnected.then(() => this._initializeTerminalActions());
		let pastTenseMessage: string | undefined;
		if (toolInvocation.pastTenseMessage) {
			pastTenseMessage = `${typeof toolInvocation.pastTenseMessage === 'string' ? toolInvocation.pastTenseMessage : toolInvocation.pastTenseMessage.value}`;
		}
		const markdownContent = new MarkdownString(pastTenseMessage, {
			supportThemeIcons: true,
			isTrusted: isMarkdownString(toolInvocation.pastTenseMessage) ? toolInvocation.pastTenseMessage.isTrusted : false,
		});
		const chatMarkdownContent: IChatMarkdownContent = {
			kind: 'markdownContent',
			content: markdownContent,
		};

		const codeBlockRenderOptions: ICodeBlockRenderOptions = {
			hideToolbar: true,
			reserveWidth: 19,
			verticalPadding: 5,
			editorOptions: {
				wordWrap: 'on'
			}
		};

		const markdownOptions: IChatMarkdownContentPartOptions = {
			codeBlockRenderOptions,
			accessibilityOptions: pastTenseMessage ? {
				statusMessage: localize('terminalToolCommand', '{0}', stripIcons(pastTenseMessage))
			} : undefined
		};

		this.markdownPart = this._register(_instantiationService.createInstance(ChatMarkdownContentPart, chatMarkdownContent, context, editorPool, false, codeBlockStartIndex, renderer, {}, currentWidthDelegate(), codeBlockModelCollection, markdownOptions));
		this._register(this.markdownPart.onDidChangeHeight(() => this._onDidChangeHeight.fire()));

		elements.message.append(this.markdownPart.domNode);
		const progressPart = this._register(_instantiationService.createInstance(ChatProgressSubPart, elements.container, this.getIcon(), terminalData.autoApproveInfo));
		this.domNode = progressPart.domNode;
		this._decoration.update();

		if (expandedStateByInvocation.get(toolInvocation)) {
			void this._toggleOutput(true);
		}
		this._register(this._terminalChatService.registerProgressPart(this));
	}

	private async _initializeTerminalActions(): Promise<void> {
		if (this._store.isDisposed) {
			return;
		}
		const terminalToolSessionId = this._terminalData.terminalToolSessionId;
		if (!terminalToolSessionId) {
			this._addActions();
			return;
		}

		const attachInstance = async (instance: ITerminalInstance | undefined) => {
			if (this._store.isDisposed) {
				return;
			}
			if (!instance) {
				if (this._isSerializedInvocation) {
					this._clearCommandAssociation();
				}
				this._addActions(undefined, terminalToolSessionId);
				return;
			}
			const isNewInstance = this._terminalInstance !== instance;
			if (isNewInstance) {
				this._terminalInstance = instance;
				this._registerInstanceListener(instance);
			}
			// Always call _addActions to ensure actions are added, even if instance was set earlier
			// (e.g., by the output view during expanded state restoration)
			this._addActions(instance, terminalToolSessionId);
		};

		const initialInstance = await this._terminalChatService.getTerminalInstanceByToolSessionId(terminalToolSessionId);
		await attachInstance(initialInstance);

		if (!initialInstance) {
			this._addActions(undefined, terminalToolSessionId);
		}

		if (this._store.isDisposed) {
			return;
		}

		if (!this._terminalSessionRegistration) {
			const listener = this._terminalChatService.onDidRegisterTerminalInstanceWithToolSession(async instance => {
				const registeredInstance = await this._terminalChatService.getTerminalInstanceByToolSessionId(terminalToolSessionId);
				if (instance !== registeredInstance) {
					return;
				}
				this._terminalSessionRegistration?.dispose();
				this._terminalSessionRegistration = undefined;
				await attachInstance(instance);
			});
			this._terminalSessionRegistration = this._store.add(listener);
		}
	}

	private _addActions(terminalInstance?: ITerminalInstance, terminalToolSessionId?: string): void {
		if (this._store.isDisposed) {
			return;
		}
		const actionBar = this._actionBar;
		this._removeFocusAction();
		const resolvedCommand = this._getResolvedCommand(terminalInstance);

		if (terminalInstance) {
			const isTerminalHidden = terminalInstance && terminalToolSessionId ? this._terminalChatService.isBackgroundTerminal(terminalToolSessionId) : false;
			const focusAction = this._instantiationService.createInstance(FocusChatInstanceAction, terminalInstance, resolvedCommand, this._terminalCommandUri, this._storedCommandId, isTerminalHidden);
			this._focusAction.value = focusAction;
			actionBar.push(focusAction, { icon: true, label: false, index: 0 });
		}

		this._ensureShowOutputAction(resolvedCommand);
		this._decoration.update(resolvedCommand);
	}

	private _getResolvedCommand(instance?: ITerminalInstance): ITerminalCommand | undefined {
		const target = instance ?? this._terminalInstance;
		if (!target) {
			return undefined;
		}
		return this._resolveCommand(target);
	}

	private _ensureShowOutputAction(command?: ITerminalCommand): void {
		if (this._store.isDisposed) {
			return;
		}
		const resolvedCommand = command ?? this._getResolvedCommand();
		const hasSnapshot = !!this._terminalData.terminalCommandOutput;
		if (!resolvedCommand && !hasSnapshot) {
			return;
		}
		let showOutputAction = this._showOutputAction.value;
		if (!showOutputAction) {
			showOutputAction = this._instantiationService.createInstance(ToggleChatTerminalOutputAction, () => this._toggleOutputFromAction());
			this._showOutputAction.value = showOutputAction;
			const exitCode = resolvedCommand?.exitCode ?? this._terminalData.terminalCommandState?.exitCode;
			if (exitCode) {
				this._toggleOutput(true);
			}
		}
		showOutputAction.syncPresentation(this._outputView.isExpanded);

		const actionBar = this._actionBar;
		if (this._showOutputActionAdded) {
			const existingIndex = actionBar.viewItems.findIndex(item => item.action === showOutputAction);
			if (existingIndex >= 0 && existingIndex !== actionBar.length() - 1) {
				actionBar.pull(existingIndex);
				this._showOutputActionAdded = false;
			} else if (existingIndex >= 0) {
				return;
			}
		}

		if (this._showOutputActionAdded) {
			return;
		}
		actionBar.push([showOutputAction], { icon: true, label: false });
		this._showOutputActionAdded = true;
	}

	private _clearCommandAssociation(options?: { clearPersistentData?: boolean }): void {
		this._terminalCommandUri = undefined;
		this._storedCommandId = undefined;
		if (options?.clearPersistentData) {
			if (this._terminalData.terminalCommandUri) {
				delete this._terminalData.terminalCommandUri;
			}
			if (this._terminalData.terminalToolSessionId) {
				delete this._terminalData.terminalToolSessionId;
			}
		}
		this._decoration.update();
	}

	private _registerInstanceListener(terminalInstance: ITerminalInstance): void {
		const commandDetectionListener = this._register(new MutableDisposable<IDisposable>());
		const tryResolveCommand = async (): Promise<ITerminalCommand | undefined> => {
			const resolvedCommand = this._resolveCommand(terminalInstance);
			this._addActions(terminalInstance, this._terminalData.terminalToolSessionId);
			return resolvedCommand;
		};

		const attachCommandDetection = async (commandDetection: ICommandDetectionCapability | undefined) => {
			commandDetectionListener.clear();
			if (!commandDetection) {
				await tryResolveCommand();
				return;
			}

			commandDetectionListener.value = commandDetection.onCommandFinished(() => {
				this._addActions(terminalInstance, this._terminalData.terminalToolSessionId);
				const resolvedCommand = this._getResolvedCommand(terminalInstance);
				if (resolvedCommand?.endMarker) {
					commandDetectionListener.clear();
				}
			});
			const resolvedImmediately = await tryResolveCommand();
			if (resolvedImmediately?.endMarker) {
				commandDetectionListener.clear();
				return;
			}
		};

		attachCommandDetection(terminalInstance.capabilities.get(TerminalCapability.CommandDetection));
		this._register(terminalInstance.capabilities.onDidAddCommandDetectionCapability(cd => attachCommandDetection(cd)));

		const instanceListener = this._register(terminalInstance.onDisposed(() => {
			if (this._terminalInstance === terminalInstance) {
				this._terminalInstance = undefined;
			}
			this._clearCommandAssociation({ clearPersistentData: true });
			commandDetectionListener.clear();
			if (!this._store.isDisposed) {
				this._actionBar.clear();
			}
			this._removeFocusAction();
			this._showOutputActionAdded = false;
			this._showOutputAction.clear();
			this._addActions(undefined, this._terminalData.terminalToolSessionId);
			instanceListener.dispose();
		}));
	}

	private _removeFocusAction(): void {
		if (this._store.isDisposed) {
			return;
		}
		const actionBar = this._actionBar;
		const focusAction = this._focusAction.value;
		if (actionBar && focusAction) {
			const existingIndex = actionBar.viewItems.findIndex(item => item.action === focusAction);
			if (existingIndex >= 0) {
				actionBar.pull(existingIndex);
			}
		}
		this._focusAction.clear();
	}

	private async _toggleOutput(expanded: boolean): Promise<boolean> {
		const didChange = await this._outputView.toggle(expanded);
		const isExpanded = this._outputView.isExpanded;
		this._titleElement.classList.toggle('chat-terminal-content-title-no-bottom-radius', isExpanded);
		this._showOutputAction.value?.syncPresentation(isExpanded);
		if (didChange) {
			expandedStateByInvocation.set(this.toolInvocation, isExpanded);
		}
		return didChange;
	}

	private async _ensureTerminalInstance(): Promise<ITerminalInstance | undefined> {
		if (this._terminalInstance?.isDisposed) {
			this._terminalInstance = undefined;
		}
		if (!this._terminalInstance && this._terminalData.terminalToolSessionId) {
			this._terminalInstance = await this._terminalChatService.getTerminalInstanceByToolSessionId(this._terminalData.terminalToolSessionId);
			if (this._terminalInstance?.isDisposed) {
				this._terminalInstance = undefined;
			}
		}
		return this._terminalInstance;
	}

	private _handleOutputFocus(): void {
		this._terminalOutputContextKey.set(true);
		this._terminalChatService.setFocusedProgressPart(this);
		this._outputView.updateAriaLabel();
	}

	private _handleOutputBlur(event: FocusEvent): void {
		const nextTarget = event.relatedTarget as HTMLElement | null;
		if (this._outputView.containsElement(nextTarget)) {
			return;
		}
		this._terminalOutputContextKey.reset();
		this._terminalChatService.clearFocusedProgressPart(this);
	}

	private _handleDispose(): void {
		this._terminalOutputContextKey.reset();
		this._terminalChatService.clearFocusedProgressPart(this);
	}

	public getCommandAndOutputAsText(): string | undefined {
		return this._outputView.getCommandAndOutputAsText();
	}

	public focusOutput(): void {
		this._outputView.focus();
	}

	private _focusChatInput(): void {
		const widget = this._chatWidgetService.getWidgetBySessionResource(this._sessionResource);
		widget?.focusInput();
	}

	public async focusTerminal(): Promise<void> {
		if (this._focusAction.value) {
			await this._focusAction.value.run();
			return;
		}
		if (this._terminalCommandUri) {
			this._terminalService.openResource(this._terminalCommandUri);
		}
	}

	public async toggleOutputFromKeyboard(): Promise<void> {
		if (!this._outputView.isExpanded) {
			await this._toggleOutput(true);
			this.focusOutput();
			return;
		}
		await this._collapseOutputAndFocusInput();
	}

	private async _toggleOutputFromAction(): Promise<void> {
		if (!this._outputView.isExpanded) {
			await this._toggleOutput(true);
			return;
		}
		await this._toggleOutput(false);
	}

	private async _collapseOutputAndFocusInput(): Promise<void> {
		if (this._outputView.isExpanded) {
			await this._toggleOutput(false);
		}
		this._focusChatInput();
	}

	private _resolveCommand(instance: ITerminalInstance): ITerminalCommand | undefined {
		if (instance.isDisposed) {
			return undefined;
		}
		const commandDetection = instance.capabilities.get(TerminalCapability.CommandDetection);
		const commands = commandDetection?.commands;
		if (!commands || commands.length === 0) {
			return undefined;
		}

		return commands.find(c => c.id === this._terminalData.terminalCommandId);
	}
}

class ChatTerminalToolOutputSection extends Disposable {
	public readonly domNode: HTMLElement;

	public get isExpanded(): boolean {
		return this.domNode.classList.contains('expanded');
	}

	private readonly _outputBody: HTMLElement;
	private _scrollableContainer: DomScrollableElement | undefined;
	private _renderedOutputHeight: number | undefined;
	private _mirror: DetachedTerminalCommandMirror | undefined;
	private _snapshotMirror: DetachedTerminalSnapshotMirror | undefined;
	private readonly _contentContainer: HTMLElement;
	private readonly _terminalContainer: HTMLElement;
	private readonly _emptyElement: HTMLElement;
	private _lastRenderedLineCount: number | undefined;

	private readonly _onDidFocusEmitter = this._register(new Emitter<void>());
	public get onDidFocus() { return this._onDidFocusEmitter.event; }
	private readonly _onDidBlurEmitter = this._register(new Emitter<FocusEvent>());
	public get onDidBlur() { return this._onDidBlurEmitter.event; }

	constructor(
		private readonly _onDidChangeHeight: () => void,
		private readonly _ensureTerminalInstance: () => Promise<ITerminalInstance | undefined>,
		private readonly _resolveCommand: () => ITerminalCommand | undefined,
		private readonly _getTerminalCommandOutput: () => IChatTerminalToolInvocationData['terminalCommandOutput'] | undefined,
		private readonly _getCommandText: () => string,
		private readonly _getStoredTheme: () => IChatTerminalToolInvocationData['terminalTheme'] | undefined,
		@IAccessibleViewService private readonly _accessibleViewService: IAccessibleViewService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITerminalConfigurationService private readonly _terminalConfigurationService: ITerminalConfigurationService,
		@IThemeService private readonly _themeService: IThemeService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService
	) {
		super();

		const containerElements = h('.chat-terminal-output-container@container', [
			h('.chat-terminal-output-body@body', [
				h('.chat-terminal-output-content@content', [
					h('.chat-terminal-output-terminal@terminal'),
					h('.chat-terminal-output-empty@empty')
				])
			])
		]);
		this.domNode = containerElements.container;
		this.domNode.classList.add('collapsed');
		this._outputBody = containerElements.body;
		this._contentContainer = containerElements.content;
		this._terminalContainer = containerElements.terminal;

		this._emptyElement = containerElements.empty;
		this._contentContainer.appendChild(this._emptyElement);

		this._register(dom.addDisposableListener(this.domNode, dom.EventType.FOCUS_IN, () => this._onDidFocusEmitter.fire()));
		this._register(dom.addDisposableListener(this.domNode, dom.EventType.FOCUS_OUT, event => this._onDidBlurEmitter.fire(event)));

		const resizeObserver = new ResizeObserver(() => this._handleResize());
		resizeObserver.observe(this.domNode);
		this._register(toDisposable(() => resizeObserver.disconnect()));

		this._applyBackgroundColor();
		this._register(this._themeService.onDidColorThemeChange(() => this._applyBackgroundColor()));
	}

	public async toggle(expanded: boolean): Promise<boolean> {
		const currentlyExpanded = this.isExpanded;
		if (expanded === currentlyExpanded) {
			if (expanded) {
				await this._updateTerminalContent();
			}
			return false;
		}

		this._setExpanded(expanded);

		if (!expanded) {
			this._renderedOutputHeight = undefined;
			this._onDidChangeHeight();
			return true;
		}

		if (!this._scrollableContainer) {
			await this._createScrollableContainer();
		}
		await this._updateTerminalContent();
		this._layoutOutput();
		this._scrollOutputToBottom();
		this._scheduleOutputRelayout();
		return true;
	}

	public focus(): void {
		this._scrollableContainer?.getDomNode().focus();
	}

	public containsElement(element: HTMLElement | null): boolean {
		return !!element && this.domNode.contains(element);
	}

	public updateAriaLabel(): void {
		if (!this._scrollableContainer) {
			return;
		}
		const command = this._resolveCommand();
		const commandText = command?.command ?? this._getCommandText();
		if (!commandText) {
			return;
		}
		const ariaLabel = localize('chatTerminalOutputAriaLabel', 'Terminal output for {0}', commandText);
		const scrollableDomNode = this._scrollableContainer.getDomNode();
		scrollableDomNode.setAttribute('role', 'region');
		const accessibleViewHint = this._accessibleViewService.getOpenAriaHint(AccessibilityVerbositySettingId.TerminalChatOutput);
		const label = accessibleViewHint
			? ariaLabel + ', ' + accessibleViewHint
			: ariaLabel;
		scrollableDomNode.setAttribute('aria-label', label);
	}

	public getCommandAndOutputAsText(): string | undefined {
		const command = this._resolveCommand();
		const commandText = command?.command ?? this._getCommandText();
		if (!commandText) {
			return undefined;
		}
		const commandHeader = localize('chatTerminalOutputAccessibleViewHeader', 'Command: {0}', commandText);
		if (command) {
			const rawOutput = command.getOutput();
			if (!rawOutput || rawOutput.trim().length === 0) {
				return `${commandHeader}\n${localize('chat.terminalOutputEmpty', 'No output was produced by the command.')}`;
			}
			const lines = rawOutput.split('\n');
			return `${commandHeader}\n${lines.join('\n').trimEnd()}`;
		}

		const snapshot = this._getTerminalCommandOutput();
		if (!snapshot) {
			return `${commandHeader}\n${localize('chatTerminalOutputUnavailable', 'Command output is no longer available.')}`;
		}
		const plain = removeAnsiEscapeCodes((snapshot.text ?? ''));
		if (!plain.trim().length) {
			return `${commandHeader}\n${localize('chat.terminalOutputEmpty', 'No output was produced by the command.')}`;
		}
		let outputText = plain.trimEnd();
		if (snapshot.truncated) {
			outputText += `\n${localize('chatTerminalOutputTruncated', 'Output truncated.')}`;
		}
		return `${commandHeader}\n${outputText}`;
	}

	private _setExpanded(expanded: boolean): void {
		this.domNode.classList.toggle('expanded', expanded);
		this.domNode.classList.toggle('collapsed', !expanded);
	}

	private async _createScrollableContainer(): Promise<void> {
		this._scrollableContainer = this._register(new DomScrollableElement(this._outputBody, {
			vertical: ScrollbarVisibility.Hidden,
			horizontal: ScrollbarVisibility.Auto,
			handleMouseWheel: true
		}));
		const scrollableDomNode = this._scrollableContainer.getDomNode();
		scrollableDomNode.tabIndex = 0;
		this.domNode.appendChild(scrollableDomNode);
		this.updateAriaLabel();
	}

	private async _updateTerminalContent(): Promise<void> {
		const liveTerminalInstance = await this._resolveLiveTerminal();
		const command = liveTerminalInstance ? this._resolveCommand() : undefined;
		const snapshot = this._getTerminalCommandOutput();

		if (liveTerminalInstance && command) {
			const handled = await this._renderLiveOutput(liveTerminalInstance, command);
			if (handled) {
				return;
			}
		}

		this._disposeLiveMirror();

		if (snapshot) {
			await this._renderSnapshotOutput(snapshot);
			return;
		}

		this._renderUnavailableMessage(liveTerminalInstance);
	}

	private async _renderLiveOutput(liveTerminalInstance: ITerminalInstance, command: ITerminalCommand): Promise<boolean> {
		if (this._mirror) {
			return true;
		}
		await liveTerminalInstance.xtermReadyPromise;
		if (liveTerminalInstance.isDisposed || !liveTerminalInstance.xterm) {
			this._disposeLiveMirror();
			return false;
		}
		this._mirror = this._register(this._instantiationService.createInstance(DetachedTerminalCommandMirror, liveTerminalInstance.xterm!, command));
		await this._mirror.attach(this._terminalContainer);
		const result = await this._mirror.renderCommand();
		if (!result || result.lineCount === 0) {
			this._showEmptyMessage(localize('chat.terminalOutputEmpty', 'No output was produced by the command.'));
		} else {
			this._hideEmptyMessage();
		}
		this._layoutOutput(result?.lineCount ?? 0);
		return true;
	}

	private async _renderSnapshotOutput(snapshot: NonNullable<IChatTerminalToolInvocationData['terminalCommandOutput']>): Promise<void> {
		if (this._snapshotMirror) {
			this._layoutOutput(snapshot.lineCount ?? 0);
			return;
		}
		dom.clearNode(this._terminalContainer);
		this._snapshotMirror = this._register(this._instantiationService.createInstance(DetachedTerminalSnapshotMirror, snapshot, this._getStoredTheme));
		await this._snapshotMirror.attach(this._terminalContainer);
		this._snapshotMirror.setOutput(snapshot);
		const result = await this._snapshotMirror.render();
		const hasText = !!snapshot.text && snapshot.text.length > 0;
		if (hasText) {
			this._hideEmptyMessage();
		} else {
			this._showEmptyMessage(localize('chat.terminalOutputEmpty', 'No output was produced by the command.'));
		}
		const lineCount = result?.lineCount ?? snapshot.lineCount ?? 0;
		this._layoutOutput(lineCount);
	}

	private _renderUnavailableMessage(liveTerminalInstance: ITerminalInstance | undefined): void {
		dom.clearNode(this._terminalContainer);
		this._lastRenderedLineCount = undefined;
		if (!liveTerminalInstance) {
			this._showEmptyMessage(localize('chat.terminalOutputTerminalMissing', 'Terminal is no longer available.'));
		} else {
			this._showEmptyMessage(localize('chat.terminalOutputCommandMissing', 'Command information is not available.'));
		}
	}

	private async _resolveLiveTerminal(): Promise<ITerminalInstance | undefined> {
		const instance = await this._ensureTerminalInstance();
		return instance && !instance.isDisposed ? instance : undefined;
	}

	private _showEmptyMessage(message: string): void {
		this._emptyElement.textContent = message;
		this._terminalContainer.classList.add('chat-terminal-output-terminal-no-output');
		this.domNode.classList.add('chat-terminal-output-container-no-output');
	}

	private _hideEmptyMessage(): void {
		this._emptyElement.textContent = '';
		this._terminalContainer.classList.remove('chat-terminal-output-terminal-no-output');
		this.domNode.classList.remove('chat-terminal-output-container-no-output');
	}

	private _disposeLiveMirror(): void {
		if (this._mirror) {
			this._mirror.dispose();
			this._mirror = undefined;
		}
	}

	private _scheduleOutputRelayout(): void {
		dom.getActiveWindow().requestAnimationFrame(() => {
			this._layoutOutput();
			this._scrollOutputToBottom();
		});
	}

	private _handleResize(): void {
		if (!this._scrollableContainer) {
			return;
		}
		if (this.isExpanded) {
			this._layoutOutput();
			this._scrollOutputToBottom();
		} else {
			this._scrollableContainer.scanDomNode();
		}
	}

	private _layoutOutput(lineCount?: number): void {
		if (!this._scrollableContainer) {
			return;
		}

		if (lineCount !== undefined) {
			this._lastRenderedLineCount = lineCount;
		} else {
			lineCount = this._lastRenderedLineCount;
		}

		this._scrollableContainer.scanDomNode();
		if (!this.isExpanded || lineCount === undefined) {
			return;
		}
		const scrollableDomNode = this._scrollableContainer.getDomNode();
		const rowHeight = this._computeRowHeightPx();
		const padding = this._getOutputPadding();
		const minHeight = rowHeight * MIN_OUTPUT_ROWS + padding;
		const maxHeight = rowHeight * MAX_OUTPUT_ROWS + padding;
		const contentHeight = this._getOutputContentHeight(lineCount, rowHeight, padding);
		const clampedHeight = Math.min(contentHeight, maxHeight);
		const measuredBodyHeight = Math.max(this._outputBody.clientHeight, minHeight);
		const appliedHeight = Math.min(clampedHeight, measuredBodyHeight);
		scrollableDomNode.style.height = appliedHeight < maxHeight ? `${appliedHeight}px` : '';
		this._scrollableContainer.scanDomNode();
		if (this._renderedOutputHeight !== appliedHeight) {
			this._renderedOutputHeight = appliedHeight;
			this._onDidChangeHeight();
		}
	}

	private _scrollOutputToBottom(): void {
		if (!this._scrollableContainer) {
			return;
		}
		const dimensions = this._scrollableContainer.getScrollDimensions();
		this._scrollableContainer.setScrollPosition({ scrollTop: dimensions.scrollHeight });
	}

	private _getOutputContentHeight(lineCount: number, rowHeight: number, padding: number): number {
		const contentRows = Math.max(lineCount, MIN_OUTPUT_ROWS);
		const adjustedRows = contentRows + (lineCount > MAX_OUTPUT_ROWS ? 1 : 0);
		return (adjustedRows * rowHeight) + padding;
	}

	private _getOutputPadding(): number {
		const style = dom.getComputedStyle(this._outputBody);
		const paddingTop = Number.parseFloat(style.paddingTop || '0');
		const paddingBottom = Number.parseFloat(style.paddingBottom || '0');
		return paddingTop + paddingBottom;
	}

	private _computeRowHeightPx(): number {
		const window = dom.getActiveWindow();
		const font = this._terminalConfigurationService.getFont(window);
		const hasCharHeight = isNumber(font.charHeight) && font.charHeight > 0;
		const hasFontSize = isNumber(font.fontSize) && font.fontSize > 0;
		const hasLineHeight = isNumber(font.lineHeight) && font.lineHeight > 0;
		const charHeight = (hasCharHeight ? font.charHeight : (hasFontSize ? font.fontSize : 1)) ?? 1;
		const lineHeight = hasLineHeight ? font.lineHeight : 1;
		const rowHeight = Math.ceil(charHeight * lineHeight);
		return Math.max(rowHeight, 1);
	}

	private _applyBackgroundColor(): void {
		const theme = this._themeService.getColorTheme();
		const isInEditor = ChatContextKeys.inChatEditor.getValue(this._contextKeyService);
		const backgroundColor = theme.getColor(isInEditor ? editorBackground : PANEL_BACKGROUND);
		if (backgroundColor) {
			this.domNode.style.backgroundColor = backgroundColor.toString();
		}
	}
}

export class ToggleChatTerminalOutputAction extends Action implements IAction {
	private _expanded = false;

	constructor(
		private readonly _toggle: () => Promise<void>,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
	) {
		super(
			TerminalContribCommandId.ToggleChatTerminalOutput,
			localize('showTerminalOutput', 'Show Output'),
			ThemeIcon.asClassName(Codicon.chevronRight),
			true,
		);
		this._updateTooltip();
	}

	public override async run(): Promise<void> {
		type ToggleChatTerminalOutputTelemetryEvent = {
			previousExpanded: boolean;
		};

		type ToggleChatTerminalOutputTelemetryClassification = {
			owner: 'meganrogge';
			comment: 'Track usage of the toggle chat terminal output action.';
			previousExpanded: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the terminal output was expanded before the toggle.' };
		};
		this._telemetryService.publicLog2<ToggleChatTerminalOutputTelemetryEvent, ToggleChatTerminalOutputTelemetryClassification>('terminal/chatToggleOutput', {
			previousExpanded: this._expanded
		});
		await this._toggle();
	}

	public syncPresentation(expanded: boolean): void {
		this._expanded = expanded;
		this._updatePresentation();
		this._updateTooltip();
	}

	public refreshKeybindingTooltip(): void {
		this._updateTooltip();
	}

	private _updatePresentation(): void {
		if (this._expanded) {
			this.label = localize('hideTerminalOutput', 'Hide Output');
			this.class = ThemeIcon.asClassName(Codicon.chevronDown);
		} else {
			this.label = localize('showTerminalOutput', 'Show Output');
			this.class = ThemeIcon.asClassName(Codicon.chevronRight);
		}
	}

	private _updateTooltip(): void {
		const keybinding = this._keybindingService.lookupKeybinding(TerminalContribCommandId.FocusMostRecentChatTerminalOutput);
		const label = keybinding?.getLabel();
		this.tooltip = label ? `${this.label} (${label})` : this.label;
	}
}

export class FocusChatInstanceAction extends Action implements IAction {
	constructor(
		private _instance: ITerminalInstance | undefined,
		private _command: ITerminalCommand | undefined,
		private readonly _commandUri: URI | undefined,
		private readonly _commandId: string | undefined,
		isTerminalHidden: boolean,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@ITerminalEditorService private readonly _terminalEditorService: ITerminalEditorService,
		@ITerminalGroupService private readonly _terminalGroupService: ITerminalGroupService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
	) {
		super(
			TerminalContribCommandId.FocusChatInstanceAction,
			isTerminalHidden ? localize('showTerminal', 'Show and Focus Terminal') : localize('focusTerminal', 'Focus Terminal'),
			ThemeIcon.asClassName(Codicon.openInProduct),
			true,
		);
		this._updateTooltip();
	}

	public override async run() {
		this.label = this._instance?.shellLaunchConfig.hideFromUser ? localize('showAndFocusTerminal', 'Show and Focus Terminal') : localize('focusTerminal', 'Focus Terminal');
		this._updateTooltip();

		let target: FocusChatInstanceTelemetryEvent['target'] = 'none';
		let location: FocusChatInstanceTelemetryEvent['location'] = 'panel';
		if (this._instance) {
			target = 'instance';
			location = this._instance.target === TerminalLocation.Editor ? 'editor' : 'panel';
		} else if (this._commandUri) {
			target = 'commandUri';
		}

		type FocusChatInstanceTelemetryEvent = {
			target: 'instance' | 'commandUri' | 'none';
			location: 'panel' | 'editor';
		};

		type FocusChatInstanceTelemetryClassification = {
			owner: 'meganrogge';
			comment: 'Track usage of the focus chat terminal action.';
			target: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether focusing targeted an existing instance or opened a command URI.' };
			location: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Location of the terminal instance when focusing.' };
		};
		this._telemetryService.publicLog2<FocusChatInstanceTelemetryEvent, FocusChatInstanceTelemetryClassification>('terminal/chatFocusInstance', {
			target,
			location
		});

		if (this._instance) {
			this._terminalService.setActiveInstance(this._instance);
			if (this._instance.target === TerminalLocation.Editor) {
				this._terminalEditorService.openEditor(this._instance);
			} else {
				await this._terminalGroupService.showPanel(true);
			}
			this._terminalService.setActiveInstance(this._instance);
			await this._instance.focusWhenReady(true);
			const command = this._resolveCommand();
			if (command) {
				this._instance.xterm?.markTracker.revealCommand(command);
			}
			return;
		}

		if (this._commandUri) {
			this._terminalService.openResource(this._commandUri);
		}
	}

	public refreshKeybindingTooltip(): void {
		this._updateTooltip();
	}

	private _resolveCommand(): ITerminalCommand | undefined {
		if (this._command && !this._command.endMarker?.isDisposed) {
			return this._command;
		}
		if (!this._instance || !this._commandId) {
			return this._command;
		}
		const commandDetection = this._instance.capabilities.get(TerminalCapability.CommandDetection);
		const resolved = commandDetection?.commands.find(c => c.id === this._commandId);
		if (resolved) {
			this._command = resolved;
		}
		return this._command;
	}

	private _updateTooltip(): void {
		const keybinding = this._keybindingService.lookupKeybinding(TerminalContribCommandId.FocusMostRecentChatTerminal);
		const label = keybinding?.getLabel();
		this.tooltip = label ? `${this.label} (${label})` : this.label;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatToolConfirmationSubPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatToolConfirmationSubPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../../base/browser/dom.js';
import { Separator } from '../../../../../../base/common/actions.js';
import { RunOnceScheduler } from '../../../../../../base/common/async.js';
import { IMarkdownString, MarkdownString } from '../../../../../../base/common/htmlContent.js';
import { toDisposable } from '../../../../../../base/common/lifecycle.js';
import { count } from '../../../../../../base/common/strings.js';
import { isEmptyObject } from '../../../../../../base/common/types.js';
import { generateUuid } from '../../../../../../base/common/uuid.js';
import { ElementSizeObserver } from '../../../../../../editor/browser/config/elementSizeObserver.js';
import { ILanguageService } from '../../../../../../editor/common/languages/language.js';
import { IModelService } from '../../../../../../editor/common/services/model.js';
import { localize } from '../../../../../../nls.js';
import { ICommandService } from '../../../../../../platform/commands/common/commands.js';
import { IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../../platform/keybinding/common/keybinding.js';
import { IMarkdownRenderer } from '../../../../../../platform/markdown/browser/markdownRenderer.js';
import { IMarkerData, IMarkerService, MarkerSeverity } from '../../../../../../platform/markers/common/markers.js';
import { IChatToolInvocation, ToolConfirmKind } from '../../../common/chatService.js';
import { CodeBlockModelCollection } from '../../../common/codeBlockModelCollection.js';
import { createToolInputUri, createToolSchemaUri, ILanguageModelToolsService } from '../../../common/languageModelToolsService.js';
import { ILanguageModelToolsConfirmationService } from '../../../common/languageModelToolsConfirmationService.js';
import { AcceptToolConfirmationActionId, SkipToolConfirmationActionId } from '../../actions/chatToolActions.js';
import { IChatCodeBlockInfo, IChatWidgetService } from '../../chat.js';
import { renderFileWidgets } from '../../chatInlineAnchorWidget.js';
import { ICodeBlockRenderOptions } from '../../codeBlockPart.js';
import { IChatContentPartRenderContext } from '../chatContentParts.js';
import { IChatMarkdownAnchorService } from '../chatMarkdownAnchorService.js';
import { ChatMarkdownContentPart } from '../chatMarkdownContentPart.js';
import { AbstractToolConfirmationSubPart } from './abstractToolConfirmationSubPart.js';
import { EditorPool } from '../chatContentCodePools.js';

const SHOW_MORE_MESSAGE_HEIGHT_TRIGGER = 45;

export class ToolConfirmationSubPart extends AbstractToolConfirmationSubPart {
	private markdownParts: ChatMarkdownContentPart[] = [];
	public get codeblocks(): IChatCodeBlockInfo[] {
		return this.markdownParts.flatMap(part => part.codeblocks);
	}

	constructor(
		toolInvocation: IChatToolInvocation,
		context: IChatContentPartRenderContext,
		private readonly renderer: IMarkdownRenderer,
		private readonly editorPool: EditorPool,
		private readonly currentWidthDelegate: () => number,
		private readonly codeBlockModelCollection: CodeBlockModelCollection,
		private readonly codeBlockStartIndex: number,
		@IInstantiationService instantiationService: IInstantiationService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IChatWidgetService chatWidgetService: IChatWidgetService,
		@ICommandService private readonly commandService: ICommandService,
		@IMarkerService private readonly markerService: IMarkerService,
		@ILanguageModelToolsService languageModelToolsService: ILanguageModelToolsService,
		@IChatMarkdownAnchorService private readonly chatMarkdownAnchorService: IChatMarkdownAnchorService,
		@ILanguageModelToolsConfirmationService private readonly confirmationService: ILanguageModelToolsConfirmationService,
	) {
		if (!toolInvocation.confirmationMessages?.title) {
			throw new Error('Confirmation messages are missing');
		}

		super(toolInvocation, context, instantiationService, keybindingService, contextKeyService, chatWidgetService, languageModelToolsService);

		this.render({
			allowActionId: AcceptToolConfirmationActionId,
			skipActionId: SkipToolConfirmationActionId,
			allowLabel: toolInvocation.confirmationMessages.confirmResults ? localize('allowReview', "Allow and Review") : localize('allow', "Allow"),
			skipLabel: localize('skip.detail', 'Proceed without running this tool'),
			partType: 'chatToolConfirmation',
			subtitle: typeof toolInvocation.originMessage === 'string' ? toolInvocation.originMessage : toolInvocation.originMessage?.value,
		});

		// Tag for sub-agent styling
		if (toolInvocation.fromSubAgent) {
			context.container.classList.add('from-sub-agent');
		}
	}

	protected override additionalPrimaryActions() {
		const actions = super.additionalPrimaryActions();
		if (this.toolInvocation.confirmationMessages?.allowAutoConfirm !== false) {
			// Get actions from confirmation service
			const confirmActions = this.confirmationService.getPreConfirmActions({
				toolId: this.toolInvocation.toolId,
				source: this.toolInvocation.source,
				parameters: this.toolInvocation.parameters
			});

			for (const action of confirmActions) {
				if (action.divider) {
					actions.push(new Separator());
				}
				actions.push({
					label: action.label,
					tooltip: action.detail,
					data: async () => {
						const shouldConfirm = await action.select();
						if (shouldConfirm) {
							this.confirmWith(this.toolInvocation, { type: ToolConfirmKind.UserAction });
						}
					}
				});
			}
		}
		if (this.toolInvocation.confirmationMessages?.confirmResults) {
			actions.unshift(
				{
					label: localize('allowSkip', 'Allow and Skip Reviewing Result'),
					data: () => {
						this.toolInvocation.confirmationMessages!.confirmResults = undefined;
						this.confirmWith(this.toolInvocation, { type: ToolConfirmKind.UserAction });
					}
				},
				new Separator(),
			);
		}

		return actions;
	}

	protected createContentElement(): HTMLElement | string {
		const { message, disclaimer } = this.toolInvocation.confirmationMessages!;
		const toolInvocation = this.toolInvocation as IChatToolInvocation;

		if (typeof message === 'string' && !disclaimer) {
			return message;
		} else {
			const codeBlockRenderOptions: ICodeBlockRenderOptions = {
				hideToolbar: true,
				reserveWidth: 19,
				verticalPadding: 5,
				editorOptions: {
					tabFocusMode: true,
					ariaLabel: this.getTitle(),
				},
			};

			const elements = dom.h('div', [
				dom.h('.message@messageContainer', [
					dom.h('.message-wrapper@message'),
					dom.h('.see-more@showMore', [
						dom.h('a', [localize('showMore', "Show More")])
					]),
				]),
				dom.h('.editor@editor'),
				dom.h('.disclaimer@disclaimer'),
			]);

			if (toolInvocation.toolSpecificData?.kind === 'input' && toolInvocation.toolSpecificData.rawInput && !isEmptyObject(toolInvocation.toolSpecificData.rawInput)) {

				const titleEl = document.createElement('h3');
				titleEl.textContent = localize('chat.input', "Input");
				elements.editor.appendChild(titleEl);

				const inputData = toolInvocation.toolSpecificData;

				const codeBlockRenderOptions: ICodeBlockRenderOptions = {
					hideToolbar: true,
					reserveWidth: 19,
					maxHeightInLines: 13,
					verticalPadding: 5,
					editorOptions: {
						wordWrap: 'off',
						readOnly: false,
						ariaLabel: this.getTitle(),
					}
				};

				const langId = this.languageService.getLanguageIdByLanguageName('json');
				const rawJsonInput = JSON.stringify(inputData.rawInput ?? {}, null, 1);
				const canSeeMore = count(rawJsonInput, '\n') > 2; // if more than one key:value
				const model = this._register(this.modelService.createModel(
					// View a single JSON line by default until they 'see more'
					rawJsonInput.replace(/\n */g, ' '),
					this.languageService.createById(langId),
					createToolInputUri(toolInvocation.toolCallId),
					true
				));

				const markerOwner = generateUuid();
				const schemaUri = createToolSchemaUri(toolInvocation.toolId);
				const validator = new RunOnceScheduler(async () => {

					const newMarker: IMarkerData[] = [];

					type JsonDiagnostic = {
						message: string;
						range: { line: number; character: number }[];
						severity: string;
						code?: string | number;
					};

					const result = await this.commandService.executeCommand<JsonDiagnostic[]>('json.validate', schemaUri, model.getValue());
					for (const item of result ?? []) {
						if (item.range && item.message) {
							newMarker.push({
								severity: item.severity === 'Error' ? MarkerSeverity.Error : MarkerSeverity.Warning,
								message: item.message,
								startLineNumber: item.range[0].line + 1,
								startColumn: item.range[0].character + 1,
								endLineNumber: item.range[1].line + 1,
								endColumn: item.range[1].character + 1,
								code: item.code ? String(item.code) : undefined
							});
						}
					}

					this.markerService.changeOne(markerOwner, model.uri, newMarker);
				}, 500);

				validator.schedule();
				this._register(model.onDidChangeContent(() => validator.schedule()));
				this._register(toDisposable(() => this.markerService.remove(markerOwner, [model.uri])));
				this._register(validator);

				const editor = this._register(this.editorPool.get());
				editor.object.render({
					codeBlockIndex: this.codeBlockStartIndex,
					codeBlockPartIndex: 0,
					element: this.context.element,
					languageId: langId ?? 'json',
					renderOptions: codeBlockRenderOptions,
					textModel: Promise.resolve(model),
					chatSessionResource: this.context.element.sessionResource
				}, this.currentWidthDelegate());
				this.codeblocks.push({
					codeBlockIndex: this.codeBlockStartIndex,
					codemapperUri: undefined,
					elementId: this.context.element.id,
					focus: () => editor.object.focus(),
					ownerMarkdownPartId: this.codeblocksPartId,
					uri: model.uri,
					uriPromise: Promise.resolve(model.uri),
					chatSessionResource: this.context.element.sessionResource
				});
				this._register(editor.object.onDidChangeContentHeight(() => {
					editor.object.layout(this.currentWidthDelegate());
					this._onDidChangeHeight.fire();
				}));
				this._register(model.onDidChangeContent(e => {
					try {
						inputData.rawInput = JSON.parse(model.getValue());
					} catch {
						// ignore
					}
				}));

				elements.editor.append(editor.object.element);

				if (canSeeMore) {
					const seeMore = dom.h('div.see-more', [dom.h('a@link')]);
					seeMore.link.textContent = localize('seeMore', "See more");
					this._register(dom.addDisposableGenericMouseDownListener(seeMore.link, () => {
						try {
							const parsed = JSON.parse(model.getValue());
							model.setValue(JSON.stringify(parsed, null, 2));
							editor.object.editor.updateOptions({ tabFocusMode: false });
							editor.object.editor.updateOptions({ wordWrap: 'on' });
						} catch {
							// ignored
						}
						seeMore.root.remove();
					}));
					elements.editor.append(seeMore.root);
				}
			}

			const mdPart = this._makeMarkdownPart(elements.message, message!, codeBlockRenderOptions);

			const messageSeeMoreObserver = this._register(new ElementSizeObserver(mdPart.domNode, undefined));
			const updateSeeMoreDisplayed = () => {
				const show = messageSeeMoreObserver.getHeight() > SHOW_MORE_MESSAGE_HEIGHT_TRIGGER;
				if (elements.messageContainer.classList.contains('can-see-more') !== show) {
					elements.messageContainer.classList.toggle('can-see-more', show);
					this._onDidChangeHeight.fire();
				}
			};

			this._register(dom.addDisposableListener(elements.showMore, 'click', () => {
				elements.messageContainer.classList.toggle('can-see-more', false);
				this._onDidChangeHeight.fire();
				messageSeeMoreObserver.dispose();
			}));


			this._register(messageSeeMoreObserver.onDidChange(updateSeeMoreDisplayed));
			messageSeeMoreObserver.startObserving();

			if (disclaimer) {
				this._makeMarkdownPart(elements.disclaimer, disclaimer, codeBlockRenderOptions);
			} else {
				elements.disclaimer.remove();
			}

			return elements.root;
		}
	}

	protected getTitle(): string {
		const { title } = this.toolInvocation.confirmationMessages!;
		return typeof title === 'string' ? title : title!.value;
	}

	private _makeMarkdownPart(container: HTMLElement, message: string | IMarkdownString, codeBlockRenderOptions: ICodeBlockRenderOptions) {
		const part = this._register(this.instantiationService.createInstance(ChatMarkdownContentPart,
			{
				kind: 'markdownContent',
				content: typeof message === 'string' ? new MarkdownString().appendMarkdown(message) : message,
			},
			this.context,
			this.editorPool,
			false,
			this.codeBlockStartIndex,
			this.renderer,
			undefined,
			this.currentWidthDelegate(),
			this.codeBlockModelCollection,
			{ codeBlockRenderOptions },
		));
		renderFileWidgets(part.domNode, this.instantiationService, this.chatMarkdownAnchorService, this._store);
		container.append(part.domNode);

		this._register(part.onDidChangeHeight(() => this._onDidChangeHeight.fire()));

		return part;
	}
}
```

--------------------------------------------------------------------------------

````
